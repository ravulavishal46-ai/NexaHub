# Frontend Testing Checklist

## Automated checks already run (Phase 2)

| Check | Result |
|---|---|
| TypeScript type check (`npm run typecheck`) | ✅ No errors |
| Lint (`npm run lint`) | ✅ No errors or warnings |
| Production build (`npm run build`) | ✅ 42 pages generated |
| Browser workflow tests (22 scenarios, Playwright, production build) | ✅ All pass (one timing-sensitive theme check passes on rerun, see below) |
| Accessibility scan (axe-core, 25 pages × light and dark) | ✅ No violations after fixes |
| Horizontal overflow (25 pages × 360 / 768 / 1024px) | ✅ None |
| Internal link check (62 unique links) | ✅ No broken links |

Browser scenarios covered: catalog search/filter/empty state, category deep links, service
detail → request, request form validation + submission, request appears in My Requests,
cancel with confirmation, unknown request ID, admin status update → user notification,
admin assignment, admin create + deactivate service (and it disappears from the public
catalog), suspend user → activity log entry, pagination, chart table view, login error and
success, registration validation, logout + signed-out state, sidebar collapse, theme switch,
contact form, 404 page, mobile menus.

Note: one run of the theme-switch check timed out because the test clicked before the page had
finished loading its interactive code; it passed on every rerun once the page was loaded.

These scripts were run as a one-off review. A permanent automated test suite is added to the
repository in **Phase 6**.

## Manual checklist (try these yourself)

### Public website
- [ ] Home page loads; header becomes frosted when you scroll
- [ ] "Explore Services" and "How It Works" buttons go to the right places
- [ ] Category tiles open the catalog already filtered
- [ ] FAQ items open and close (mouse and keyboard)
- [ ] Catalog: search "backup", filter "Cleaning", sort by price, search nonsense → empty state
- [ ] Service detail shows features, process, sample pricing and related services
- [ ] Contact form shows errors when empty, then a success message

### Sign-in screens
- [ ] Password show/hide toggle works
- [ ] Login with password `wrongpassword` shows an error; any other password signs in
- [ ] Register shows errors for mismatched passwords and unticked checkbox
- [ ] Forgot password → success screen → reset password → success

### User dashboard
- [ ] Overview numbers match the requests list
- [ ] New request: submit empty → errors; fill in → toast → detail page
- [ ] Cancel a pending request (confirmation dialog) → it moves to Request History
- [ ] Notifications: open one (marks read), "Mark all as read"
- [ ] Profile: edit name → Save → name updates in the top-right menu
- [ ] Settings: switches, theme picker, Reset demo data (with confirmation)
- [ ] Logout → signed-out screen → "Continue as demo user"
- [ ] Sidebar collapse button; on a phone, the ☰ menu

### Admin prototype
- [ ] Warning banner explains there is no access control yet
- [ ] Users: search, status filter, pagination, profile dialog, suspend/reactivate
- [ ] Services: add (validation), edit, deactivate/reactivate
- [ ] Requests: status filters, open details panel, assign staff, update status with a note
- [ ] After updating one of Alex Morgan's requests, the user dashboard shows a notification
- [ ] Analytics: hover chart tooltips; "Table" toggle shows the numbers
- [ ] Activity logs: search, category filter, sort, Export CSV

### Across the app
- [ ] Light / dark / system theme
- [ ] Keyboard only: Tab through pages, focus ring always visible, dialogs trap focus, Esc closes
- [ ] Phone (≈390px), tablet (≈820px), laptop (≈1280px): nothing overflows sideways
- [ ] Turn on "reduce motion" in your OS: animations stop
- [ ] Unknown URL shows the 404 page
