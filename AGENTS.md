# DreamShopVo Agent Guide

## Project Scope

The primary production application is `apps/web`: Next.js 16, React 19 and
Supabase. `apps/worker` is a Cloudflare Worker for R2 media, Telegram and Nova
Poshta; `supabase` contains the SQL schema, migrations and RLS contracts.

Only `apps/web`, `apps/worker` and `supabase` are production code. Firebase,
Prisma, the root CRA and the root Vercel API were decommissioned on 2026-08-29
after the catalog migration was confirmed by the owner. Do not reintroduce
those stacks or their configuration files.

## Local Review Skills

Use the matching project skill from `.agents/skills/<skill-name>/SKILL.md` when the request or affected area matches it:

- `marketplace-code-audit`: broad review of storefront, admin, catalog, cart, checkout, orders and data flows.
- `marketplace-bug-fix`: reproduce, isolate, fix, and regression-check a reported marketplace defect.
- `marketplace-ui-review`: inspect responsive layout, accessibility, interaction states, and marketplace usability.
- `performance-review`: inspect bundle size, rendering, data fetching, image delivery, and loading behavior.
- `security-review`: inspect auth, authorization, Supabase RLS, Worker code, secrets, uploads, input validation, and dependencies.
- `seo-review`: inspect routes, metadata, product discoverability, crawlability, structured data, and indexable content.
- `dead-code-cleanup`: identify unused code and dependencies with evidence before removing anything.

For a review, report findings first with severity and file/line references, then assumptions, test gaps, and a short summary. Do not claim a fix without verification.

## Working Rules

- Read the relevant existing code and current git diff before editing.
- Preserve unrelated user changes.
- Keep changes scoped to the request. Do not remove catalog data, Supabase
  migrations, R2 media or owner-supplied design assets without explicit
  confirmation and evidence.
- Never place Supabase service-role keys, Telegram secrets, Cloudflare
  credentials or `CLOUDINARY_URL` in client code or public
  environment variables.
- Treat Supabase writes, R2/storage changes, migrations and dependency
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

```
