# DreamShop cleanup decision register

No files, assets, tables or dependencies were deleted during this audit.

| Area | Decision | Evidence | Safe order |
| --- | --- | --- | --- |
| `apps/web`, `apps/worker`, `supabase` | KEEP | Active target and CI jobs | Maintain, type and test |
| root `src`, `public`, Firebase rules, `functions` | ARCHIVE / REVIEW_REQUIRED | Root `firebase.json` and CI legacy build still reference it | Confirm Firebase Hosting/Functions deployment and rollback drill; then move intact |
| `api`, `server`, `prisma`, root Better Auth deps | KEEP | 2026-08-20 Vercel production inspection confirms public legacy aliases and builds for `api/auth.ts`, Telegram and Nova Poshta handlers | Retain until completed cutover plus 14-day rollback window; then re-audit before archive |
| `scripts/migrate-live-catalog-to-supabase.mjs` | KEEP / MOVE | Active Firebase→Supabase migration utility | Move to `tools/migration` after command/owner documentation |
| `scripts/generate-product-covers.mjs` | KEEP / REVIEW_REQUIRED | Uses both legacy Firebase source and Supabase/R2 | Document source of truth and run only controlled dry-runs |
| old Firebase import scripts and docs | ARCHIVE | Firebase-specific operational instructions remain | Preserve with legacy rollback bundle, mark historical |
| `build`, generated covers, duplicate media | REVIEW_REQUIRED | Generated/deployment assets may be referenced operationally | Compare import/deploy/runtime references and media database keys before removal |
| Prisma tables/schema | REVIEW_REQUIRED | `DATABASE_URL` unavailable; root Vercel API owns handlers | Backup, inspect deployed DB, prove no runtime use, then archive rather than delete |

Required proof before `DELETE`: no static import, dynamic import, CI command, deploy config, Vercel/Firebase runtime route, scheduled job, migration script or operational runbook reference. Produce a backup and a separate reversible commit for each cleanup group.
