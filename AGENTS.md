# DreamShopVo Agent Guide

## Project Scope

The primary production application is `apps/web`: Next.js 16, React 19 and
Supabase. `apps/worker` is a Cloudflare Worker for R2 media, Telegram and Nova
Poshta; `supabase` contains the SQL schema, migrations and RLS contracts.

The root React 18/Firebase application, root Vercel API/Better Auth/Prisma code
and `functions` are legacy rollback systems. Do not treat them as the primary
production path, remove them, or change their external deployments until the
cutover, backup and observation conditions in the launch audit are met. Prisma
is installed only for that legacy rollback system.

## Local Review Skills

Use the matching project skill from `.agents/skills/<skill-name>/SKILL.md` when the request or affected area matches it:

- `marketplace-code-audit`: broad review of storefront, admin, catalog, cart, checkout, orders and data flows.
- `marketplace-bug-fix`: reproduce, isolate, fix, and regression-check a reported marketplace defect.
- `marketplace-ui-review`: inspect responsive layout, accessibility, interaction states, and marketplace usability.
- `prisma-safety-review`: review legacy Prisma schemas, queries, migrations and destructive operations.
- `performance-review`: inspect bundle size, rendering, data fetching, image delivery, and loading behavior.
- `security-review`: inspect auth, authorization, Firestore rules, Cloud Functions, secrets, uploads, input validation, and dependencies.
- `seo-review`: inspect routes, metadata, product discoverability, crawlability, structured data, and indexable content.
- `dead-code-cleanup`: identify unused code and dependencies with evidence before removing anything.

For a review, report findings first with severity and file/line references, then assumptions, test gaps, and a short summary. Do not claim a fix without verification.

## Working Rules

- Read the relevant existing code and current git diff before editing.
- Preserve unrelated user changes, especially changes in `src/firebase/services.ts`.
- Keep changes scoped to the request. Do not remove catalog data, legacy rollback
  files or external assets without explicit confirmation and evidence.
- Never place Supabase service-role keys, Firebase private credentials, Telegram
  secrets, Cloudflare credentials or `CLOUDINARY_URL` in client code or public
  environment variables.
- Treat Supabase/Firestore writes, R2/storage changes, migrations and dependency
  removals as potentially destructive. Inspect exact targets first and verify
  after changes.
- Prefer `rg` for code search and `apply_patch` for manual edits.

## Verification

Use the narrowest useful checks, then run the matching package build for
application changes. For UI changes, use the local production fixture and
inspect desktop and mobile states when available. For data or security changes,
verify rules and both success and failure paths.

Useful commands:

```bash
# New web app
npm --prefix apps/web run typecheck
npm --prefix apps/web test
npm --prefix apps/web run test:e2e:chromium

# Cloudflare Worker
npm --prefix apps/worker run typecheck
npm --prefix apps/worker test

# Legacy rollback app only
npm test -- --watchAll=false
npm run test:server
npm run prisma:validate
npm run typecheck:api
npm run build
```
