# DreamShop cutover and rollback rehearsal

This runbook is for RB-010. It does not authorize an untested production switch. The current production/legacy targets remain untouched until every gate below has recorded evidence and an owner has approved the visual UAT item in `AUD-011`.

## Ownership map

| Surface | Target | Source/config | Rollback anchor |
| --- | --- | --- | --- |
| Storefront/admin | Vercel Next.js project rooted at `apps/web` | `apps/web/vercel.json` | Previously verified legacy Vercel deployment and alias |
| API/media/integrations | Cloudflare Worker `dreamshop-api` | `apps/worker/wrangler.jsonc` | Previous Worker deployment/version |
| Database/auth | Supabase migrations and RLS | `supabase/migrations`, `supabase/tests/rls_smoke.sql` | Timestamped custom-format backup plus restore verification |
| Product media | R2 bucket `dream-shop` | Worker binding `PRODUCT_MEDIA` | Pre-cutover object inventory; storage is not rolled back by a Worker version |
| Legacy application | CRA on root Vercel plus Firebase Functions rollback path | root `vercel.json`, `firebase.json` | Preserve until RB-011 completes |

## Gate 1 — repository and build evidence

Run from the repository root:

```bash
npm run check:deployment-boundaries
npm run check:cutover-readiness
npm test -- --watchAll=false
npm run build
npm --prefix apps/web run test
npm --prefix apps/web run typecheck
npm --prefix apps/web run check:migration-boundary
npm --prefix apps/web run build
npm --prefix apps/web run test:e2e
npm --prefix apps/worker run test
npm --prefix apps/worker run typecheck
npm --prefix apps/worker run build
```

Stop if any command fails. Record commit SHA, Node version and command output in the rehearsal report.

## Gate 2 — platform identity and immutable rollback anchors

Authenticate through the platform-approved login flow; never put tokens in this file or command history.

```bash
cd apps/worker
npx wrangler whoami --json
npx wrangler versions list --name dreamshop-api --json
npx wrangler deployments list --name dreamshop-api --json
npx wrangler r2 bucket info dream-shop --json

cd ../web
vercel whoami
vercel list --status READY --json
```

Record the active Worker version/deployment IDs, active Vercel production URL and previous known-good Vercel URL. Cloudflare Worker rollback does not restore R2 objects, so the bucket inventory is a separate gate. Wrangler v4 remote object commands require an explicit `--remote`; do not run object deletion during rehearsal.

## Gate 3 — database backup and restore proof

Create a timestamped custom-format backup from the staging database and restore it into an isolated empty rehearsal database. Use scoped environment variables supplied outside the repository; do not print connection strings.

```bash
DREAMSHOP_BACKUP_DIR="$(mktemp -d)"
pg_dump --format=custom --file "$DREAMSHOP_BACKUP_DIR/staging.dump" "$DREAMSHOP_STAGING_DATABASE_URL"
createdb "$DREAMSHOP_RESTORE_DATABASE_NAME"
pg_restore --exit-on-error --no-owner --dbname "$DREAMSHOP_RESTORE_DATABASE_NAME" "$DREAMSHOP_BACKUP_DIR/staging.dump"
psql --dbname "$DREAMSHOP_RESTORE_DATABASE_NAME" -v ON_ERROR_STOP=1 -f supabase/tests/rls_smoke.sql
```

Do not drop either database in this runbook. Cleanup is a separate, exact-target action after the evidence is reviewed.

## Gate 4 — R2 reconciliation

Export product/category media object keys from Supabase and obtain a read-only R2 inventory through the account-approved S3-compatible inventory method or Cloudflare dashboard. Compare exact normalized keys in both directions:

- database key missing in R2: release blocker;
- R2 key missing in database: quarantine candidate, never delete during rehearsal;
- content type or size outside upload policy: release blocker pending review.

Record counts and key hashes, not credentials or signed URLs. `wrangler r2 bucket info dream-shop --json` provides bucket-level evidence but is not an object-level reconciliation.

## Gate 5 — staging deploy and UAT

Deploy the Worker to a staging environment and the Web artifact to a protected Vercel preview/custom staging target. Verify `/health`, public catalog/product/cart, authenticated checkout/account, admin catalog/orders/customers/media, one inert integration retry, robots/sitemap and the 33-scenario browser matrix against the staging URLs. Use `vercel curl` for protected previews; never disable deployment protection.

The current Worker config has no named staging environment, so creating one is a prerequisite configuration change and must use a distinct Worker name and R2 bucket. Never point a staging Worker at the production R2 bucket for mutation tests.

## Gate 6 — domain and rollback drill

1. Lower DNS TTL only through the approved DNS owner and record the prior value.
2. Promote the already-tested immutable Vercel deployment; do not rebuild during promotion.
3. Verify TLS, canonical URLs, auth redirects, Worker CORS and order creation using a labelled test order.
4. Reassign the domain/alias to the recorded legacy deployment, verify the legacy health path, then restore the new deployment.
5. Roll the Worker to the recorded previous version, verify `/health`, then restore the tested version.
6. Confirm that no database migration or R2 mutation was implicitly rolled back.

Any failed verification triggers immediate alias/Worker rollback. Database restore is reserved for proven data corruption and requires an exact incident decision; never down-migrate production blindly.

## Gate 7 — monitoring and sign-off

Before cutover, confirm Vercel runtime/error logs, Worker observability, Supabase database/auth health, integration backlog, order reconciliation and alert ownership. Capture a clean pre-cutover window and define the RB-011 observation start time. Required sign-offs are technical UAT, product-owner visual approval (`AUD-011`), exact staging-data cleanup disposition (`AUD-012`) and rollback-owner availability.

## Current rehearsal status — 2026-08-29

- Repository build/test/UAT evidence: pass through RB-009.
- Local Worker dry-run: pass with Wrangler 4.124.0.
- Vercel authentication: blocked in this workspace (CLI logged out).
- Cloudflare authentication: blocked in this workspace (`loggedIn: false`).
- Remote backup/restore, R2 reconciliation, staging deploy, monitoring and domain rollback drill: pending authenticated platform access.
