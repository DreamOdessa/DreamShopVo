# DreamShopVo

DreamShopVo is an online storefront and admin application for Dream Odessa.
The active stack is Next.js, Supabase and a Cloudflare Worker.

## Repository layout

- `apps/web` — customer storefront and admin UI (Next.js 16, React 19).
- `apps/worker` — R2 media, Telegram and Nova Poshta integration API.
- `supabase` — ordered database migrations, generated types and RLS tests.
- `docs/design-reference` — current UI fixtures and wireframes.

The former CRA/Firebase/Prisma application was decommissioned on 2026-08-29
after the owner confirmed the catalog migration. It is not part of this
repository's supported runtime.

## Local development

Use Node.js 22 or newer. Copy the environment-value names from
`apps/web/.env.example` and `apps/worker/.dev.vars.example`; do not commit
secrets.

```bash
cd apps/web
npm ci
npm run dev
```

```bash
cd apps/worker
npm ci
npm run dev
```

## Verification

```bash
npm --prefix apps/web run typecheck
npm --prefix apps/web test
npm --prefix apps/web run test:e2e:chromium
npm --prefix apps/worker run typecheck
npm --prefix apps/worker test
npm --prefix apps/worker run build
```

## Deployment

The live web project is Vercel `dreamshop-next`, with `apps/web` as its root
directory. Production changes are released from the GitHub `main` branch.
Cloudflare Worker releases are managed from `apps/worker`.
