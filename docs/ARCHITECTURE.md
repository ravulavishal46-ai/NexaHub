# NexaHub — Project Architecture & Frontend Plan (Phase 1)

> **Status:** Proposal — waiting for your approval before any application code is generated.
> **Audience:** A beginner. Every technical term is explained the first time it appears.

---

## 1. What we found in the project directory

The repository `NexaHub` is **completely empty** (no files, no commits yet). That's a good
thing: we start clean and nothing has to be deleted or migrated.

---

## 2. The big picture (in plain English)

Think of NexaHub as a restaurant:

| Restaurant            | NexaHub                          | Technology                       |
|-----------------------|----------------------------------|----------------------------------|
| Dining room & menu    | The website people click on      | **Next.js + React + Tailwind**   |
| Waiters               | Server code that takes requests  | **Next.js API routes / server actions** |
| Kitchen pantry        | Where all data is stored         | **Supabase PostgreSQL**          |
| Door security / ID    | Who are you? Are you staff?      | **Supabase Auth + roles**        |
| The building          | Where it all runs on the internet| **Vercel**                       |
| Recipe book history   | Every change ever made to code   | **GitHub**                       |

```
 ┌──────────────────────┐        ┌──────────────────────────┐        ┌───────────────────────┐
 │  Browser (user/admin)│  HTTPS │  Next.js app on Vercel   │  HTTPS │  Supabase             │
 │  React pages         │ ─────► │  • Pages (UI)            │ ─────► │  • Auth (logins)      │
 │  Tailwind styling    │        │  • API routes (server)   │        │  • PostgreSQL + RLS   │
 │  ONLY public anon key│ ◄───── │  • Role checks (server)  │ ◄───── │  • Audit log table    │
 └──────────────────────┘        └──────────────────────────┘        └───────────────────────┘
```

**Key idea — three locks on every door (defense in depth):**
1. **Page lock** – Next.js *middleware* redirects logged-out users / non-admins away from protected pages. (Convenience, not real security.)
2. **Server lock** – Every admin API route re-checks on the server: "Is this person logged in, and is their role `admin` in the database?"
3. **Database lock** – **Row Level Security (RLS)** in PostgreSQL. Even if lock 1 and 2 had a bug, the database itself refuses to return rows a user isn't allowed to see.

---

## 3. Technology choices (and why)

| Choice | Why |
|---|---|
| **Next.js 15 (App Router)** | One project holds both the website and the server code. Vercel (the hosting company) makes Next.js, so deployment is easy. |
| **TypeScript** | JavaScript with "spell-check for data types" — catches many bugs before the app runs. |
| **Tailwind CSS** | Style elements with short class names; responsive (mobile/desktop) design is built in. |
| **Supabase** | Hosted PostgreSQL database + login system + security rules, with a generous free tier. |
| **`@supabase/ssr`** | Official library to keep users logged in securely using cookies on the server. |
| **Zod** | Validates every form and API input ("is this email really an email?"). |
| **Vitest + React Testing Library** | Fast automated tests for logic and components. |
| **Playwright** | Robot that opens a real browser and clicks through the app to test it end-to-end. |

---

## 4. Frontend structure

### 4.1 Pages (URLs)

| URL | Who can see it | Purpose |
|---|---|---|
| `/` | Everyone | Landing page: what NexaHub is, call-to-action buttons |
| `/login` | Logged-out | Email + password login |
| `/register` | Logged-out | Create an account |
| `/services` | Everyone | Browse active services (cards, search, category filter) |
| `/services/[id]` | Everyone | Service details + "Request this service" button |
| `/dashboard` | Logged-in user | Summary: open requests, recent activity |
| `/dashboard/requests` | Logged-in user | Request history table with status filter |
| `/dashboard/requests/new` | Logged-in user | Submit a new service request form |
| `/dashboard/requests/[id]` | Owner only | Request detail + status timeline |
| `/dashboard/profile` | Logged-in user | View/edit own name, phone |
| `/admin` | Admin only | Analytics cards + charts |
| `/admin/services` | Admin only | Create / edit / deactivate services |
| `/admin/requests` | Admin only | All requests, filter, update status |
| `/admin/requests/[id]` | Admin only | Detail + change status with a note |
| `/admin/users` | Admin only | List users (limited fields) |
| `/admin/audit-logs` | Admin only | Read-only history of sensitive actions |

### 4.2 Folder layout

```
nexahub/
├── src/
│   ├── app/                         ← Each folder = a URL (Next.js "App Router")
│   │   ├── (public)/                ← Landing, services (shared public layout)
│   │   ├── (auth)/login, register/  ← Auth pages (centered card layout)
│   │   ├── dashboard/               ← User area (sidebar layout)
│   │   ├── admin/                   ← Admin area (admin sidebar layout)
│   │   ├── api/                     ← Server-only API routes (Phase 3+)
│   │   └── layout.tsx, globals.css
│   ├── components/
│   │   ├── ui/                      ← Button, Input, Card, Badge, Table, Modal, Select…
│   │   ├── layout/                  ← Navbar, Sidebar, Footer, MobileMenu
│   │   ├── services/                ← ServiceCard, ServiceForm, ServiceFilters
│   │   ├── requests/                ← RequestTable, StatusBadge, StatusTimeline, RequestForm
│   │   └── admin/                   ← StatCard, Charts, AuditLogTable, UserTable
│   ├── lib/
│   │   ├── mock-data.ts             ← Fake data for Phase 2
│   │   ├── data/                    ← "Data access layer": one place that fetches data
│   │   ├── supabase/                ← Supabase clients (browser / server) — Phase 3+
│   │   ├── validation/              ← Zod schemas shared by forms and APIs
│   │   └── auth/                    ← requireUser(), requireAdmin() helpers — Phase 5
│   └── types/                       ← TypeScript types: Service, ServiceRequest, Profile…
├── supabase/migrations/             ← SQL files that build the database (Phase 3)
├── tests/ (unit, e2e)               ← Automated tests (Phase 6)
├── docs/                            ← This document and future guides
└── .env.example                     ← Lists required settings — never real secrets
```

**Important design trick:** in Phase 2 every page gets its data through `src/lib/data/*`
functions (e.g. `getServices()`), which at first return mock data. In Phase 4 we change
only those functions to talk to Supabase — **the pages themselves don't need rewriting.**

### 4.3 Design system
- Mobile-first, responsive (phone → tablet → desktop); sidebar collapses into a menu on phones.
- Light & dark mode, accessible colors, keyboard-friendly, visible focus rings.
- Consistent status colors: `pending` (amber), `in_review` (blue), `in_progress` (indigo),
  `completed` (green), `rejected` (red), `cancelled` (gray).
- Icons from `lucide-react`; charts from `recharts`.

---

## 5. Backend structure

The "backend" lives inside the same Next.js project under `src/app/api/` (and server
actions). It never runs in the browser, so it can safely do checks the user can't tamper with.

| Endpoint | Method | Who | Does |
|---|---|---|---|
| `/api/requests` | GET / POST | User | List own requests / create one |
| `/api/requests/[id]` | GET, PATCH (cancel) | Owner | View / cancel own pending request |
| `/api/profile` | GET / PATCH | User | Read / update own name & phone (never role) |
| `/api/admin/services` | GET / POST | Admin | List all / create service |
| `/api/admin/services/[id]` | PATCH | Admin | Edit or deactivate (no hard delete) |
| `/api/admin/requests` | GET | Admin | All requests with filters |
| `/api/admin/requests/[id]/status` | PATCH | Admin | Change status + note → audit log |
| `/api/admin/users` | GET | Admin | Limited user list |
| `/api/admin/analytics` | GET | Admin | Counts per status, per service, over time |
| `/api/admin/audit-logs` | GET | Admin | Read audit log |

Every route follows the same recipe:
1. Read the logged-in user from the secure cookie (`supabase.auth.getUser()` — verified with Supabase, not trusted from the browser).
2. For admin routes: call `requireAdmin()` which looks up the role **in the database**.
3. Validate input with Zod.
4. Query the database **as that user** so RLS still applies.
5. Return safe, minimal data; log sensitive actions to `audit_logs`.

**Secret keys:** the Supabase *service role* key (a master key that bypasses all security)
is **avoided wherever possible**. If ever needed, it lives only in Vercel's server
environment variables — never in any file starting with `NEXT_PUBLIC_`, never in Git.

---

## 6. Database structure (Supabase PostgreSQL)

```
auth.users (managed by Supabase)
     │ 1:1
     ▼
profiles ──────────────┐
  id (= auth user id)  │ 1:many
  full_name, phone     ▼
  role ('user'|'admin')  service_requests ────────► services
  created_at             id, user_id, service_id    id, name, description,
                         title, details, status      category, price_estimate,
                         priority, created_at,       is_active, created_by,
                         updated_at                  created_at, updated_at
                              │ 1:many
                              ▼
                         request_status_history     audit_logs (append-only)
                           request_id, old_status,    actor_id, action, entity,
                           new_status, note,          entity_id, details (JSON),
                           changed_by, changed_at     created_at
```

### 6.1 Security rules (Row Level Security) — summary

| Table | Regular user | Admin |
|---|---|---|
| `profiles` | Read/update **own** row; **cannot change `role`** | Read all |
| `services` | Read **active** only | Read all, create, update |
| `service_requests` | Read/create **own**; cancel own pending | Read all, update status |
| `request_status_history` | Read for own requests | Read all, insert |
| `audit_logs` | No access | Read only (no one can edit/delete) |

### 6.2 How we stop users from making themselves admin
1. New profiles are created by a **database trigger** when someone signs up, and the trigger
   **always** sets `role = 'user'` — it ignores anything the user sends.
2. Database permissions **revoke** the ability to update the `role` column from normal users,
   plus a guard trigger that rejects role changes unless done by an admin.
3. The very first admin is promoted **manually by you** with one SQL command in the Supabase
   dashboard (I will give you the exact command and ask first).
4. A helper function `is_admin()` (marked `security definer`, fixed `search_path`) is used by
   all policies, so the role check lives in one trusted place.

---

## 7. Development phases

| Phase | What we build | What you'll be asked to approve |
|---|---|---|
| **1 — Architecture (this doc)** | Plan only | Approve this plan |
| **2 — Frontend with mock data** | Next.js project, design system, all pages with fake data, responsive layouts | Nothing paid/destructive; review the screens |
| **3 — Database design** | SQL migrations: tables, RLS policies, triggers, seed data; tested locally first | ⚠️ Creating/using a Supabase project; applying SQL to it |
| **4 — Backend & connection** | Supabase clients, data layer swaps mock → real, API routes, validation | Adding env variables |
| **5 — Auth & admin access** | Login/register, middleware, `requireAdmin()`, admin promotion, audit logging | ⚠️ Promoting your first admin account |
| **6 — Automated tests** | Unit tests, API authorization tests, RLS tests, Playwright end-to-end | — |
| **7 — Deployment prep** | Vercel config, env var checklist, security headers, README deploy guide | ⚠️ Connecting Vercel; any production DB change |

Each phase ends with: a short explanation, a commit pushed to GitHub, and a pause for your OK.

---

## 8. Phase 2 detailed plan (next step, after your approval)

1. **Scaffold** a Next.js + TypeScript + Tailwind + ESLint project in this repo.
2. **Types** — `Service`, `ServiceRequest`, `RequestStatus`, `Profile`, `AuditLog`.
3. **Mock data** — ~8 services in 4 categories, ~15 requests across all statuses, 6 users, 10 audit entries.
4. **UI kit** — Button, Input, Textarea, Select, Card, Badge/StatusBadge, Table, EmptyState, Modal, Toast.
5. **Layouts** — public navbar + footer; user dashboard sidebar; admin sidebar; mobile menu.
6. **Pages** — every page in section 4.1, using mock data and working filters/forms
   (forms validate with Zod but don't save yet).
7. **A temporary "view as: user / admin" switch** (development only) so you can click
   through both areas before real login exists. It will be removed in Phase 5.
8. **Checks** — `npm run lint`, `npm run build`, and a quick smoke test pass before pushing.

**Not included in Phase 2:** real login, real database, any Supabase account, any paid service.
