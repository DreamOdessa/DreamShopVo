# DreamShop architecture

## Current state

```text
Legacy rollback path: browser -> root CRA (`src/`) -> Firebase Auth/Firestore/Functions
                                   \-> root Vercel API -> Prisma/Better Auth/Postgres

Target path: browser -> Vercel `apps/web` (Next.js)
                         -> Supabase Auth/Postgres/RLS
                         -> Cloudflare Worker -> R2 / Telegram / Nova Poshta
```

`apps/web` is the active target storefront/admin. `apps/worker` owns media delivery/upload, Telegram and delivery integrations. `supabase/migrations` owns schema and authorization. Root `src`, `functions`, `api`, `server`, `prisma`, Firebase config and root Vercel config are legacy/migration state, not safe deletion candidates.

## Ownership and contracts

| Boundary | Owner | Contract |
| --- | --- | --- |
| Public routes and admin UI | `apps/web` | Stable URLs; server actions authenticate through Supabase; no Firebase/Prisma imports (enforced by `check:migration-boundary`). |
| Database and auth | Supabase | Schema solely through ordered migrations; RLS is the browser authorization boundary; checkout uses RPC and token idempotency. |
| Media/integrations | `apps/worker` | Existing `/media/*`, Telegram and Nova Poshta request/error contracts must be versioned before changes. |
| Legacy rollback | root CRA/Firebase, root Vercel API, Prisma | Frozen except critical rollback fixes; runtime ownership needs confirmation before archival. |
| Migration tooling | `scripts/*` | Firebase-to-Supabase/R2 utilities; no normal production serving path. |

## Target repository layout

```text
apps/web                 new storefront and admin
apps/worker              R2 media and external integrations
apps/legacy-web          isolated legacy CRA rollback (move only after deploy audit)
apps/legacy-functions    isolated Firebase Functions rollback
tools/migration          maintained import and reconciliation utilities
archive/legacy-node-stack Prisma/Better Auth only after deployment proof
supabase                 migrations, generated types, RLS tests
```

## Flows and rollback

Anonymous catalog data must not require wishlist/session reads; authenticated wishlist state is a separate personalization concern. Product slug changes require a redirect map and canonical verification. Database changes require forward migration, RLS test and a tested rollback/recovery instruction.

Read-only Vercel inspection on 2026-08-20 confirms the legacy production deployment owns the public aliases (`dream-odessa.shop`, `dream-odessa.com`, `dream-shop-vo.vercel.app`) and builds `api/auth.ts`, `api/telegram-start.ts`, `api/telegram-webhook.ts` and `api/nova-poshta.ts`. `dreamshop-next.vercel.app` is a distinct Next.js production alias. Therefore Prisma/Better Auth and the legacy API are **KEEP**, not archive candidates, until cutover.

Cutover: preserve public URLs, back up data, rehearse restore, switch domain only after UAT, and keep Firebase rollback deployable for 14 days. Roll back by restoring the previous domain alias/deployment and retaining the old data path; do not run destructive cleanup during the window.
