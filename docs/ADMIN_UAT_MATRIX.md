# Launch admin UAT matrix

This register consolidates the launch-critical admin evidence. Test accounts, products, categories, orders and media used in the hosted runs were disposable; no production customer records were used.

| Scenario | Positive-path evidence | Denial/conflict evidence | Result |
| --- | --- | --- | --- |
| Admin role boundary | Hosted admin sign-in and protected admin pages | `rls_smoke.sql`; Web actions reject unauthenticated mutations; CSV returns `403` to an authenticated non-admin | Pass |
| Product/category CRUD | Hosted category/product create and delete run; database CRUD assertions | Customer catalog writes denied by RLS; unauthenticated action tests | Pass |
| Product media and three-slot limit | Hosted Worker upload/read/delete and browser association run | Database accepts slots 0–2 and rejects slot 3; stale deletion preserves replacement media | Pass |
| Inventory | Hosted quick-stock update | Stale browser update is rejected and newer stock survives; customer inventory mutation denied | Pass |
| Orders and tracking | Hosted `pending → processing → shipped → delivered`, TTN edit and private CSV export | Invalid/terminal transitions, stale status, unauthenticated writes and spreadsheet formulas are rejected or neutralized | Pass |
| Customer access and discount | Hosted admin/customer `12.5%` discount run and customer summaries | Customer cannot read admin summaries or change protected discount; unauthenticated action denied | Pass |
| Integration retry | Failed-event retry succeeds once | Second claim reports already processed; outbox table and claim functions stay protected | Pass |
| Checkout and cancellation | Staging browser created a test order, cancelled it and displayed the terminal confirmation | Repeated cancellation became unavailable; action tests hide another customer's order and require authenticated claims | Pass |
| Loading/error/success and responsive UI | Phase 4 authenticated/admin captures and three-browser matrix | Stale-state and inline error tests; no serious/critical axe findings at the reference viewports | Pass |

## Reverification on 2026-08-29

- Web Vitest: 9 files, 31 tests passed, including all admin, checkout and cancellation action suites.
- Worker Vitest: 1 file, 23 tests passed; typecheck passed; Wrangler dry-run build passed.
- Production Web build and the 33-scenario Chromium/Firefox/WebKit matrix passed as part of RB-008 immediately before this register was closed.
- The fresh-migration RLS and backup/restore evidence from RB-002/RB-007 remains applicable because no Supabase migration changed after that verification.

## Follow-up data hygiene

The portable continuation log records a disposable staging user, order and saved address left by the final checkout/cancellation run, but it does not include safe identifiers. Do not perform a broad lookup or deletion. Remove only those exact records when their IDs are recovered from the original staging session; this is tracked as `AUD-012` and does not invalidate the completed UAT result.
