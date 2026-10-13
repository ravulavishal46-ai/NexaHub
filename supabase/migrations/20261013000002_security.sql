-- NexaHub security: Row Level Security, column grants, triggers and
-- server-side functions (RPCs). All privileged logic runs in SECURITY DEFINER
-- functions with an empty search_path and explicit permission checks.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();
create trigger service_requests_touch before update on public.service_requests
  for each row execute function public.touch_updated_at();

create or replace function public.write_audit(p_action text, p_category text, p_entity_id text, p_details jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_logs (actor_id, action, category, entity_id, details)
  values ((select auth.uid()), p_action, p_category, p_entity_id, coalesce(p_details, '{}'::jsonb));
$$;
revoke all on function public.write_audit(text, text, text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- New users: profile is created automatically, ALWAYS as a standard user.
-- Anything the client sends in metadata (e.g. role) is ignored except the name.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, status)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    'user',
    'active'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Belt and braces: role/status can never change through a normal update.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and coalesce(current_setting('nexahub.privileged', true), '') <> 'on' then
    raise exception 'Role and account status can only be changed by an administrator.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_privileges before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.saved_services enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: read your own; admins read all. Update only your own (limited columns below).
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Services: everyone sees active services; admins see and manage all.
create policy "services: read active" on public.services
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "services: admin insert" on public.services
  for insert to authenticated
  with check ((select public.is_admin()));
create policy "services: admin update" on public.services
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Requests: users read their own; admins read all. All writes go through RPCs below.
create policy "requests: read own or admin" on public.service_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "history: read own or admin" on public.request_status_history
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.service_requests r
      where r.id = request_id and r.user_id = (select auth.uid())
    )
  );

create policy "notifications: read own" on public.notifications
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "notifications: mark own read" on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "saved: read own" on public.saved_services
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "saved: add own" on public.saved_services
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "saved: remove own" on public.saved_services
  for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "audit: admin read" on public.audit_logs
  for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Table privileges (on top of RLS): least privilege per role.
-- ---------------------------------------------------------------------------
revoke all on public.profiles, public.service_requests, public.request_status_history,
  public.notifications, public.saved_services, public.audit_logs from anon;
revoke insert, update, delete, truncate on public.services from anon;
revoke insert, delete, truncate on public.profiles from authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, phone, city) on public.profiles to authenticated;
revoke insert, update, delete, truncate on public.service_requests from authenticated;
revoke insert, update, delete, truncate on public.request_status_history from authenticated;
revoke insert, delete, truncate on public.notifications from authenticated;
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
revoke update, truncate on public.saved_services from authenticated;
revoke insert, update, delete, truncate on public.audit_logs from authenticated;
revoke delete, truncate on public.services from authenticated;
revoke usage on sequence public.service_request_number_seq from anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPCs (server-side actions). Each checks permissions itself.
-- ---------------------------------------------------------------------------

-- Customer: submit a request (always created as pending, owned by the caller).
create or replace function public.create_service_request(
  p_service_id uuid,
  p_requirements text,
  p_priority text default 'normal',
  p_preferred_date date default null,
  p_notes text default null
)
returns public.service_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.service_requests;
begin
  if v_uid is null then
    raise exception 'You need to be signed in.' using errcode = '42501';
  end if;
  if exists (select 1 from public.profiles where id = v_uid and status <> 'active') then
    raise exception 'Your account is not active.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.services where id = p_service_id and is_active) then
    raise exception 'This service is not available.' using errcode = 'P0002';
  end if;

  insert into public.service_requests (user_id, service_id, requirements, priority, preferred_date, notes)
  values (v_uid, p_service_id, btrim(p_requirements), coalesce(p_priority, 'normal'), p_preferred_date, nullif(btrim(coalesce(p_notes, '')), ''))
  returning * into v_row;

  insert into public.request_status_history (request_id, old_status, new_status, note, changed_by)
  values (v_row.id, null, 'pending', 'Request submitted.', v_uid);

  perform public.write_audit('Submitted a new request', 'request', v_row.reference, '{}'::jsonb);
  return v_row;
end;
$$;

-- Customer: cancel own pending request.
create or replace function public.cancel_my_request(p_request_id uuid)
returns public.service_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.service_requests;
begin
  update public.service_requests
     set status = 'cancelled'
   where id = p_request_id and user_id = v_uid and status = 'pending'
  returning * into v_row;
  if v_row.id is null then
    raise exception 'Only your own pending requests can be cancelled.' using errcode = '42501';
  end if;
  insert into public.request_status_history (request_id, old_status, new_status, note, changed_by)
  values (v_row.id, 'pending', 'cancelled', 'Cancelled by customer.', v_uid);
  perform public.write_audit('Cancelled a request', 'request', v_row.reference, '{}'::jsonb);
  return v_row;
end;
$$;

-- Customer: rate own completed request (once).
create or replace function public.rate_my_request(p_request_id uuid, p_rating int, p_comment text default null)
returns public.service_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.service_requests;
begin
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5.' using errcode = '22023';
  end if;
  update public.service_requests
     set feedback_rating = p_rating,
         feedback_comment = nullif(btrim(coalesce(p_comment, '')), ''),
         feedback_at = now()
   where id = p_request_id and user_id = (select auth.uid())
     and status = 'completed' and feedback_rating is null
  returning * into v_row;
  if v_row.id is null then
    raise exception 'Only your own completed, unrated requests can be rated.' using errcode = '42501';
  end if;
  perform public.write_audit('Rated a completed request', 'request', v_row.reference, jsonb_build_object('rating', p_rating));
  return v_row;
end;
$$;

-- Admin: change a request's status (with optional note) and notify the customer.
create or replace function public.admin_update_request_status(p_request_id uuid, p_status text, p_note text default null)
returns public.service_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old text;
  v_row public.service_requests;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required.' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'in_progress', 'completed', 'cancelled') then
    raise exception 'Unknown status.' using errcode = '22023';
  end if;
  select status into v_old from public.service_requests where id = p_request_id for update;
  if v_old is null then
    raise exception 'Request not found.' using errcode = 'P0002';
  end if;
  update public.service_requests set status = p_status where id = p_request_id returning * into v_row;
  insert into public.request_status_history (request_id, old_status, new_status, note, changed_by)
  values (v_row.id, v_old, p_status, nullif(btrim(coalesce(p_note, '')), ''), (select auth.uid()));
  insert into public.notifications (user_id, kind, title, body, href)
  values (
    v_row.user_id, 'status',
    'Request ' || v_row.reference || ' is now ' || replace(p_status, '_', ' '),
    coalesce(nullif(btrim(coalesce(p_note, '')), ''), 'An administrator updated your request.'),
    '/dashboard/requests/' || v_row.reference
  );
  perform public.write_audit('Updated request status', 'request', v_row.reference,
    jsonb_build_object('from', v_old, 'to', p_status));
  return v_row;
end;
$$;

-- Admin: assign a request to a staff member (null to unassign).
create or replace function public.admin_assign_request(p_request_id uuid, p_assignee text)
returns public.service_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.service_requests;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required.' using errcode = '42501';
  end if;
  update public.service_requests set assignee = nullif(btrim(coalesce(p_assignee, '')), '')
   where id = p_request_id returning * into v_row;
  if v_row.id is null then
    raise exception 'Request not found.' using errcode = 'P0002';
  end if;
  perform public.write_audit('Assigned request', 'request', v_row.reference,
    jsonb_build_object('assignee', v_row.assignee));
  return v_row;
end;
$$;

-- Admin: suspend / reactivate an account (admins cannot change their own status).
create or replace function public.admin_set_user_status(p_user_id uuid, p_status text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required.' using errcode = '42501';
  end if;
  if p_user_id = (select auth.uid()) then
    raise exception 'You cannot change your own account status.' using errcode = '42501';
  end if;
  if p_status not in ('active', 'suspended') then
    raise exception 'Unknown status.' using errcode = '22023';
  end if;
  perform set_config('nexahub.privileged', 'on', true);
  update public.profiles set status = p_status where id = p_user_id returning * into v_row;
  perform set_config('nexahub.privileged', 'off', true);
  if v_row.id is null then
    raise exception 'User not found.' using errcode = 'P0002';
  end if;
  perform public.write_audit(case when p_status = 'suspended' then 'Suspended account' else 'Reactivated account' end,
    'user', p_user_id::text, '{}'::jsonb);
  return v_row;
end;
$$;

-- Audit service changes made by admins (insert/update through RLS-protected policies).
create or replace function public.audit_service_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit('Created service', 'service', new.slug, jsonb_build_object('name', new.name));
  elsif new.is_active is distinct from old.is_active then
    perform public.write_audit(case when new.is_active then 'Reactivated service' else 'Deactivated service' end,
      'service', new.slug, jsonb_build_object('name', new.name));
  else
    perform public.write_audit('Updated service', 'service', new.slug, jsonb_build_object('name', new.name));
  end if;
  return new;
end;
$$;

create trigger services_audit after insert or update on public.services
  for each row execute function public.audit_service_change();

-- Function execute permissions: only signed-in users may call the RPCs.
revoke all on function public.create_service_request(uuid, text, text, date, text) from public, anon;
revoke all on function public.cancel_my_request(uuid) from public, anon;
revoke all on function public.rate_my_request(uuid, int, text) from public, anon;
revoke all on function public.admin_update_request_status(uuid, text, text) from public, anon;
revoke all on function public.admin_assign_request(uuid, text) from public, anon;
revoke all on function public.admin_set_user_status(uuid, text) from public, anon;
grant execute on function public.create_service_request(uuid, text, text, date, text) to authenticated;
grant execute on function public.cancel_my_request(uuid) to authenticated;
grant execute on function public.rate_my_request(uuid, int, text) to authenticated;
grant execute on function public.admin_update_request_status(uuid, text, text) to authenticated;
grant execute on function public.admin_assign_request(uuid, text) to authenticated;
grant execute on function public.admin_set_user_status(uuid, text) to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.audit_service_change() from public, anon, authenticated;
