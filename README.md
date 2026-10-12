# NexaHub

**Your Services. Simplified.** — a smart service management platform where people discover
services, submit requests and track progress, and administrators manage the whole operation.

> **Current stage: frontend prototype.** Every screen works, but all data is fictional and is
> stored only in your browser. There is no real database, login or admin security yet — those
> arrive in the backend phases (Supabase Auth, server-side checks and Row Level Security).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn-style
components on Radix UI · Lucide icons · Motion · Recharts · Zod

---

## Preview it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install        # download the libraries (first time only)
npm run dev        # start the app in development mode
```

Then open **http://localhost:3000** in your browser.

| Where to go | What you'll see |
|---|---|
| `/` | Public landing page |
| `/services` | Service catalog with search, filters and sorting |
| `/login`, `/register` | Prototype sign-in screens (any email + password works) |
| `/dashboard` | User dashboard |
| `/admin` | Admin dashboard prototype |

Tip: the **Reset demo data** option (account menu → *Reset demo data*) restores the original
sample data at any time.

### Other useful commands

| Command | What it does |
|---|---|
| `npm run typecheck` | Checks the TypeScript types |
| `npm run lint` | Checks code quality rules |
| `npm run build` | Builds the optimised production version |
| `npm start` | Runs the production build (after `npm run build`) |
| `npm run check` | Runs typecheck + lint + build in one go |

---

## Project structure

```
src/
├── app/                 Pages (each folder is a URL)
│   ├── (marketing)/     Public website: home, services, about, contact
│   ├── (auth)/          Login, register, forgot/reset password
│   ├── dashboard/       User dashboard
│   └── admin/           Admin dashboard prototype
├── components/
│   ├── ui/              Design-system building blocks (Button, Dialog, Table…)
│   ├── shared/          Reusable pieces (status badges, stat cards, icons…)
│   ├── brand/           NexaHub wordmark
│   └── theme/           Light / dark theme
├── features/            Screens grouped by area
│   ├── marketing/       Landing page sections, header, footer
│   ├── services/        Service card, catalog, detail
│   ├── auth/            Auth forms
│   ├── dashboard/       User dashboard screens
│   ├── admin/           Admin screens and charts
│   ├── requests/        Request table + timeline shared by user & admin
│   └── app-shell/       Sidebar / top bar layout shared by both dashboards
├── lib/
│   ├── mock/            Fictional sample data
│   ├── store/           Browser-only demo store (to be replaced by real APIs)
│   └── validation/      Form rules (Zod) — reusable on the server later
└── types/               Data shapes that mirror the planned database tables
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — overall plan, database design, security model
- [`docs/FRONTEND.md`](docs/FRONTEND.md) — design system and frontend decisions
- [`docs/TESTING-CHECKLIST.md`](docs/TESTING-CHECKLIST.md) — how the frontend was tested and a manual checklist

## Project status

- [x] Phase 1 — Architecture & frontend plan
- [x] Phase 2 — Responsive frontend with mock data (public site, user dashboard, admin prototype)
- [ ] Phase 3 — Database design (Supabase, Row Level Security)
- [ ] Phase 4 — Backend APIs & connecting the frontend
- [ ] Phase 5 — Real authentication & admin-only access
- [ ] Phase 6 — Automated test suite
- [ ] Phase 7 — Deployment to Vercel
