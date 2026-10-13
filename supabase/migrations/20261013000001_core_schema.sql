-- NexaHub core schema: tables, constraints and indexes.
-- Security (RLS, grants, triggers) lives in the next migration.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user. Role is ALWAYS 'user' on sign-up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 120),
  phone       text check (phone is null or phone ~ '^[+0-9 ()-]{0,20}$'),
  city        text check (city is null or char_length(city) <= 80),
  role        text not null default 'user' check (role in ('user', 'admin')),
  status      text not null default 'active' check (status in ('active', 'suspended', 'invited')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Services catalog. Never hard-deleted: deactivate with is_active = false.
-- ---------------------------------------------------------------------------
create table public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  name              text not null check (char_length(name) between 3 and 120),
  category          text not null check (category in ('home-repairs', 'cleaning', 'it-support', 'business', 'moving', 'coaching')),
  icon              text not null default 'sparkles',
  short_description text not null check (char_length(short_description) between 10 and 200),
  description       text not null check (char_length(description) between 20 and 2000),
  features          text[] not null default '{}',
  process           jsonb not null default '[]'::jsonb,
  pricing_model     text not null check (pricing_model in ('fixed', 'hourly', 'quote')),
  price_amount      numeric(10, 2) check (price_amount is null or price_amount > 0),
  pricing_label     text not null,
  duration          text not null,
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  created_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint price_required_unless_quote check (pricing_model = 'quote' or price_amount is not null)
);

-- ---------------------------------------------------------------------------
-- Service requests. Human-friendly reference like REQ-1001.
-- ---------------------------------------------------------------------------
create sequence public.service_request_number_seq start 1001;

create table public.service_requests (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default ('REQ-' || nextval('public.service_request_number_seq')),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  service_id       uuid not null references public.services (id),
  requirements     text not null check (char_length(btrim(requirements)) between 20 and 1000),
  preferred_date   date,
  notes            text check (notes is null or char_length(notes) <= 500),
  status           text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority         text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  assignee         text check (assignee is null or char_length(assignee) <= 80),
  feedback_rating  smallint check (feedback_rating between 1 and 5),
  feedback_comment text check (feedback_comment is null or char_length(feedback_comment) <= 300),
  feedback_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index service_requests_user_id_idx on public.service_requests (user_id, created_at desc);
create index service_requests_status_idx on public.service_requests (status);
create index service_requests_service_id_idx on public.service_requests (service_id);

-- Timeline of every status change.
create table public.request_status_history (
  id          bigint generated always as identity primary key,
  request_id  uuid not null references public.service_requests (id) on delete cascade,
  old_status  text,
  new_status  text not null,
  note        text check (note is null or char_length(note) <= 300),
  changed_by  uuid references public.profiles (id) on delete set null,
  changed_at  timestamptz not null default now()
);
create index request_status_history_request_idx on public.request_status_history (request_id, changed_at);

-- In-app notifications for a user.
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null default 'status' check (kind in ('status', 'system', 'reminder')),
  title       text not null,
  body        text not null default '',
  href        text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- Services a user saved with the heart button.
create table public.saved_services (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  service_id  uuid not null references public.services (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, service_id)
);
create index saved_services_service_idx on public.saved_services (service_id);

-- Append-only audit trail of sensitive actions.
create table public.audit_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null,
  category    text not null check (category in ('auth', 'service', 'request', 'user', 'settings')),
  entity_id   text,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id);
