# NexaHub Frontend Guide

This explains how the frontend is built and why, in plain English.

## 1. Pages

**Public website** — `/`, `/services`, `/services/[slug]`, `/about`, `/contact`
**Sign-in screens** — `/login`, `/register`, `/forgot-password`, `/reset-password`
**User dashboard** — `/dashboard` (overview), `/dashboard/services`, `/dashboard/requests`,
`/dashboard/requests/new`, `/dashboard/requests/[id]`, `/dashboard/history`,
`/dashboard/notifications`, `/dashboard/profile`, `/dashboard/settings`
**Admin prototype** — `/admin` (overview), `/admin/users`, `/admin/services`, `/admin/requests`,
`/admin/analytics`, `/admin/activity`, `/admin/settings`

Plus a friendly 404 page, an error page, `robots.txt` and `sitemap.xml`.

## 2. Design system

All colours live as **design tokens** (named variables) in `src/app/globals.css`, so the whole
look — including dark mode — can be changed in one place.

| Token | Light | Use |
|---|---|---|
| Navy | `#0F172A` | Headings, dark sections, brand mark |
| Accent blue | `#2563EB` | Primary buttons, focus rings, chart series 1 |
| Accent teal | `#0D9488` | Secondary accent, checkmarks, chart series 2 |
| Background | `#F8FAFC` | Page background |
| Card | `#FFFFFF` | Cards, dialogs, tables |
| Muted text | `#5B6B7F` | Secondary text (brand `#64748B`, deepened slightly to pass WCAG AA) |
| Border | `#E2E8F0` | Dividers and outlines |
| Link blue | `#1D4ED8` | Blue *text* (darker than button blue so it stays readable) |

**Typography:** Geist Sans (bundled locally, no external font requests) with tight, strong
headings and 14–16px body text.

**Status colours** are always paired with an icon and a label, so they never rely on colour alone:
Pending (amber, clock) · In progress (blue, spinner) · Completed (green, check) · Cancelled (grey, x).

**Components** (`src/components/ui`): Button (with loading state), Input, Password input with
show/hide, Textarea, Select, Checkbox, Switch, Field (label + hint + error wired for screen
readers), Card, Badge, Table, Dialog, Sheet (side panel), Dropdown menu, Tabs, Filter tabs,
Accordion, Pagination, Skeleton (loading placeholder), Empty state, Toast notifications.

These are written in the shadcn/ui style on top of Radix UI primitives (which handle keyboard
support and accessibility). The shadcn download tool was blocked in the build environment, so the
components were written directly — the result is the same kind of code you'd get from shadcn.

## 3. Key decisions (and why)

- **Mock data + a demo store.** `src/lib/store/demo-store.tsx` keeps all data in React state and
  saves it in the browser's localStorage. This makes buttons genuinely work (submit a request,
  update a status, deactivate a service) without a backend. In Phase 4 the store's actions get
  replaced with calls to secure server APIs — the screens stay the same.
- **Types mirror the database plan.** `src/types` matches the tables in `docs/ARCHITECTURE.md`
  so connecting Supabase later is a swap, not a rewrite.
- **Shared validation.** Zod rules in `src/lib/validation/schemas.ts` are used by every form now
  and can be reused by the server later, so browser and API agree on what "valid" means.
- **Honest prototype labelling.** Sign-in screens, the dashboard and especially the admin area
  show clear notices that they're demonstrations. The admin area is **not** protected — real
  protection comes from Supabase Auth, server-side role checks and Row Level Security.
- **No fake social proof.** No invented reviews, customer counts or testimonials. Prices are
  marked "illustrative"; analytics are marked "demo data"; people are fictional and use
  `example.com` emails.
- **A fixed demo date.** Sample data uses a fixed "today" (12 Oct 2026) so server and browser
  render identical output.
- **Next.js 16 Cache Components.** Pages render a fast static shell; anything that depends on
  the URL streams in inside a loading boundary. Next.js also keeps recently visited pages alive,
  so forms that depend on the URL are reset deliberately (e.g. the new-request form).

## 4. Accessibility & responsiveness

- Semantic landmarks, one `h1` per page, logical heading order, skip-to-content link.
- Every form field has a label; errors are announced and focus moves to the first invalid field.
- Visible focus rings; all interactive elements reachable by keyboard.
- WCAG AA colour contrast verified with axe-core in light and dark mode.
- Reduced-motion setting respected (animations switch off).
- Charts have a **Table** toggle so the data is never only a picture; chart colours were
  validated for colour-vision deficiency.
- Layouts tested at 360, 390, 768, 820, 1024, 1280 and 1440px with no sideways page scrolling.
  Request lists become cards on phones; wide admin tables scroll inside their card.

## 5. Connecting the backend later

1. Replace functions in the demo store with calls to `/api/...` routes (Phase 4).
2. Swap `src/lib/mock/*` reads for Supabase queries.
3. Replace the prototype sign-in with Supabase Auth and protect `/dashboard` and `/admin`
   with middleware + server-side `requireAdmin()` checks (Phase 5).
4. Remove the "demo" banners and the *Reset demo data* option.
