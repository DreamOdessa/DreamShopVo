# DreamShop admin architecture

## Roles and server enforcement

Roles are customer, staff and admin. UI visibility is never an authorization control: server actions and Worker operations must use Supabase claims/RLS (`apps/web/src/lib/auth/admin.ts`, `apps/worker/src/supabase-auth.ts`). All admin mutations should record actor, target, outcome and request correlation once audit history is introduced.

| Module | Launch-critical operations | Enforcement |
| --- | --- | --- |
| Products | create/edit/archive; price, stock, category, ingredients; up to 3 media slots | admin claims + RLS + Worker admin media endpoint |
| Categories | CRUD, ordering, cover | admin claims + RLS |
| Orders | list/detail, status transition, tracking, export, retry integration | admin claims + RLS/RPC workflow |
| Customers | profile/order summary, customer discount | admin claims + RLS/RPC |
| Integrations | view failed events and retry | admin RPC + Worker outbox contract |

## Explicitly post-launch

Variants, promo codes, bulk edits/imports, CMS/site settings expansion, advanced analytics, full audit history and granular staff permissions are post-launch until requirements, authorization and UAT are written.

## Acceptance

Admin UAT must cover role denial, product/category CRUD, three-image boundary, stock conflict, order transitions/export, customer data access, discount handling and retry idempotency. Each action must have loading/error/success states and a safe response to stale data.

## Current automated evidence

- `supabase/tests/rls_smoke.sql` exercises admin catalog CRUD, grants and protected RPCs, along with customer denials for dashboard/customer summaries, discounts and inventory mutations. It also proves the launch three-image limit: slots 0–2 are accepted and a fourth slot is rejected by the database constraint, while a failed integration event can be retried exactly once through the admin RPC without exposing the outbox table.
- `apps/web` Vitest checks deny valid-looking unauthenticated requests before any catalog mutation, inventory change, order status/tracking update, customer-discount update, media association, integration retry or CSV order export. They also preserve newer data on stale inventory, order-status and media changes, and report an already-claimed integration retry. The export route returns `403` to an authenticated non-admin and, on its admin path, emits a private CSV that neutralizes spreadsheet formulas.
- Checkout and customer-cancellation Vitest checks reject malformed input before creating a session, require authenticated claims, preserve the idempotent `create_order` token contract, map unavailable-product errors without saving an address, and do not disclose an order that another customer cannot cancel.
- Customer cancellation returns its success state before a delayed client-side refresh, so the terminal `cancelled` page cannot unmount the confirmation before the customer sees it; a focused action test guards this behavior.
- On 2026-08-20, a disposable hosted-Supabase admin completed a browser UAT against the local production build: email/password sign-in, category creation and product creation were verified through the database, then the product, category and temporary user were removed in the same run.
- On 2026-08-20, a separate disposable hosted-Supabase admin completed the Worker media lifecycle with an in-memory one-pixel PNG: authenticated upload, public read, deletion and post-delete `404`. The object and user were removed in the same run.
- On 2026-08-20, disposable hosted-Supabase admin and customer users completed the customer-discount browser UAT: the admin changed the customer value to `12.5%`, the value was verified in the database, and both users were removed in the same run.
- On 2026-08-20, disposable hosted-Supabase admin and customer users completed the positive admin order-status UAT in the local production build. Isolated orders (created directly without an outbox event) covered `pending → processing`, `processing → shipped` with a 14-digit TTN, and `shipped → delivered`; each mutation was verified in the database with its customer notification, then removed with both users. A defect that hid the terminal-transition success state was fixed and re-verified. The separate shipped-order TTN-edit flow also displayed success, persisted the replacement TTN and emitted one notification.
- On 2026-08-20, a disposable hosted-Supabase admin completed the real CSV-export route in the local production build. The authenticated browser received a private attachment response with the expected CSV headers; the temporary user was removed afterwards.
- On 2026-08-20, a disposable hosted-Supabase admin completed the stale-order-status browser case: an update from another session was preserved and the original page displayed its stale-state error. The temporary order and users were removed afterwards.
- On 2026-08-20, a disposable hosted-Supabase admin completed the stale-inventory browser case: an update from another session was preserved and the original page displayed its stale-state error. The temporary product, category and user were removed afterwards.
- On 2026-08-20, a disposable hosted-Supabase admin completed product-media browser UAT from the Worker-approved local origin: a PNG upload was stored by the Worker and associated with the product's first media slot in the database. The object, product, category and user were removed afterwards.
- On 2026-08-20, the remaining staging browser flow created a test order, cancelled it, displayed the terminal `cancelled` state and made a repeated cancellation unavailable. Together with the evidence above and the server-side denial suites, this completes the launch-critical RB-009 matrix. The consolidated register is `docs/ADMIN_UAT_MATRIX.md`.
- The staging user, order and saved address from that final run were intentionally not deleted without exact identifiers. Their targeted cleanup is tracked as `AUD-012`; broad deletion is prohibited and the retained disposable records do not invalidate UAT.
