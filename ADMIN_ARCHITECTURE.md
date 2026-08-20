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
- On 2026-08-20, a disposable hosted-Supabase admin completed a browser UAT against the local production build: email/password sign-in, category creation and product creation were verified through the database, then the product, category and temporary user were removed in the same run.
- On 2026-08-20, a separate disposable hosted-Supabase admin completed the Worker media lifecycle with an in-memory one-pixel PNG: authenticated upload, public read, deletion and post-delete `404`. The object and user were removed in the same run.
- On 2026-08-20, disposable hosted-Supabase admin and customer users completed the customer-discount browser UAT: the admin changed the customer value to `12.5%`, the value was verified in the database, and both users were removed in the same run.
- This is not full launch UAT: positive browser scenarios still require disposable admin and customer accounts with isolated catalog, order and media data. RB-009 remains open until that context and the listed positive/stale-state cases are verified.
