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

- `supabase/tests/rls_smoke.sql` exercises admin catalog CRUD, grants and protected RPCs, along with customer denials for dashboard/customer summaries, discounts and inventory mutations. It also proves the launch three-image limit: slots 0–2 are accepted and a fourth slot is rejected by the database constraint.
- `apps/web` Vitest checks deny valid-looking unauthenticated requests before any catalog mutation, inventory change, order status/tracking update, customer-discount update, media association or CSV order export. The export route also returns `403` to an authenticated non-admin.
- This is not full launch UAT: positive browser scenarios still require disposable admin and customer accounts with isolated catalog, order and media data. RB-009 remains open until that context and the listed positive/stale-state cases are verified.
