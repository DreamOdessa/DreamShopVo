# DreamShop architecture

## Production architecture

```text
browser -> Vercel `apps/web` (Next.js)
              -> Supabase Auth/Postgres/RLS
              -> Cloudflare Worker -> R2 / Telegram / Nova Poshta
```

`apps/web` is the storefront and admin application. `apps/worker` owns media
delivery/upload, Telegram and delivery integrations. `supabase/migrations`
owns schema and authorization.

## Ownership and contracts

| Boundary | Owner | Contract |
| --- | --- | --- |
| Public routes and admin UI | `apps/web` | Stable URLs; server actions authenticate through Supabase; no Firebase/Prisma imports (enforced by `check:migration-boundary`). |
| Database and auth | Supabase | Schema solely through ordered migrations; RLS is the browser authorization boundary; checkout uses RPC and token idempotency. |
| Media/integrations | `apps/worker` | Existing `/media/*`, Telegram and Nova Poshta request/error contracts must be versioned before changes. |

## Target repository layout

```text
apps/web                 new storefront and admin
apps/worker              R2 media and external integrations
supabase                 migrations, generated types, RLS tests
```

## Flows and recovery

Anonymous catalog data must not require wishlist/session reads; authenticated wishlist state is a separate personalization concern. Product slug changes require a redirect map and canonical verification. Database changes require forward migration, RLS test and a tested rollback/recovery instruction.

The owner confirmed on 2026-08-29 that catalog data is migrated and authorized
removal of the old Firebase/Prisma application. Recovery uses tested Supabase
backups and immutable Vercel/Cloudflare deployments; it does not restore the
removed legacy application.
