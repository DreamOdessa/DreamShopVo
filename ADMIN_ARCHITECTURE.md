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
