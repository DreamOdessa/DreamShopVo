# DreamShop: audit baseline

Audit date: 2026-08-20. Snapshot: `45b7d91c52a4263e9921b7aae8a5640c2f5bf6ca`.

## Method and reproducibility

The audit was performed without changing application code. The worktree already contained unrelated changes in `src/firebase/services.ts`; they were not inspected as a change target or modified. Local prerequisites differ from CI: Node `25.9.0` instead of 22; npm `11.12.1`; Docker and Supabase CLI are unavailable. Secrets were inventoried by variable name only, never printed.

| Check | Result | Evidence |
| --- | --- | --- |
| Legacy tests | pass | 4 suites, 8 tests: `npm test -- --watchAll=false` |
| Legacy production build | pass | `npm run build`; gzip JS 310.41 kB |
| Next typecheck/boundary/build | pass | `npm --prefix apps/web run typecheck`, `check:migration-boundary`, `build` |
| Worker types/typecheck/tests/dry-run | pass | generated types unchanged; 23 Vitest tests; `wrangler deploy --dry-run` |
| Web dependency gate | pass | `npm audit --audit-level=high` passes; 2 moderate PostCSS findings remain |
| Worker dependency gate | pass | `wrangler` updated to 4.124.0; `npm audit --audit-level=high` passes |
| Prisma validation | pass | `prisma validate` with a non-secret local test connection string |
| Supabase migration/RLS smoke | pass | fresh local PostgreSQL cluster: bootstrap, every migration, full RLS smoke and backup/restore drill |

CI is `.github/workflows/quality.yml`: it runs the four checks above with Node 22 and a Postgres 17 service. Durations are local command output, not a CI-equivalent measurement.

## Findings

| ID | Priority | Evidence and impact | Recommendation | Phase |
| --- | --- | --- | --- | --- |
| AUD-001 | P0 — resolved locally | CI dependency gates initially failed on high `nanoid` and Worker `undici`. Normal audit fixes and Worker `wrangler` 4.124.0 leave no high findings; generated Worker types were refreshed. Two moderate PostCSS findings remain in web. | Commit lockfile/Wrangler/type generation changes and run the complete CI matrix on Node 22. Evaluate the Next/PostCSS upgrade separately, without forced upgrade. | 1 |
| AUD-002 | P1 | `apps/web/src/app/sitemap.ts:15-18` calls `getCatalogProducts`; that query has `.limit(120)` at `apps/web/src/lib/catalog.ts:203-235`. Active products after the first 120 cannot enter sitemap. | Add a dedicated cursor/paginated sitemap query, test cardinality against active products. | 3 |
| AUD-003 | P1 | Public `/`, `/catalog`, category and product pages call `getWishlistState` (`store-home.tsx:12-17`, catalog page `:60-64`, header `:4-7`). The Next build labels these routes dynamic. | Isolate authenticated wishlist/header data behind a client or separately personalized boundary; retain cacheable anonymous catalog data. | 3 |
| AUD-004 | P1 | Root `vercel.json` still deploys the legacy CRA build and `/api/**` Prisma/Better Auth endpoints, while `apps/web/vercel.json` is the new Next deployment. | Record a single deployment ownership map and protect it with CI; retain legacy only as deliberate rollback until cutover. | 2 |
| AUD-005 | P1 | Prisma/Better Auth are not dead code: `vercel.json`, `api/auth.ts`, `api/telegram-*.ts`, and `server/*` reference them. `prisma validate` is blocked locally by missing `DATABASE_URL`. | Mark this stack `REVIEW_REQUIRED`; verify Vercel project routing/runtime use before archive or dependency removal. | 2/8 |
| AUD-006 | P2 | Catalog mapping uses repeated `as unknown as` casts (`apps/web/src/lib/catalog.ts:146,164,233,256,288,352,380`). | Generate and commit Supabase DB types; replace casts incrementally with typed select contracts. | 3 |
| AUD-007 | P2 | The root legacy build is 310.41 kB gzip JS and includes legacy Firebase/client dependencies. | Keep it as rollback only; set a measured new-site performance budget before cutover. | 4/6 |
| AUD-008 | P2 — resolved locally | The initial Docker-based path was unavailable. A fresh local PostgreSQL cluster completed bootstrap, all migrations, full RLS smoke and custom-format backup/restore; `prisma validate` also passes with a test URL. Smoke assertions were corrected to filter their own test records because the catalog-import migration seeds real catalog rows. | Keep the test-record filters; require the same CI evidence before production cutover. | 1/6 |
| AUD-009 | P2 | Legacy docs and deployment references still instruct Firebase deploys (`docs/*`, `TELEGRAM_NOTIFICATIONS.md`, `functions/*`); current target uses Worker/Supabase. | Classify docs and legacy Functions as rollback/archival candidates after runtime/deployment confirmation. | 8 |

## Confirmed controls and gaps

Worker authentication checks bearer JWTs and server-side admin claims; media paths use an admin check; CORS allowlist and Telegram constant-time secret comparison are present (`apps/worker/src/http.ts`, `supabase-auth.ts`, `telegram.ts`). Checkout validates items and invokes the idempotent `create_order` RPC (`apps/web/src/app/(store)/checkout/actions.ts:41-164`); migrations include RLS, inventory reservation and checkout-token work.

Not verified: real RLS denial paths, deployed secret scope, CORS against production origins, upload MIME/magic-byte hostile fixtures, production cache headers, browser/a11y matrix, backup/restore, and live external integrations. No secrets were exposed by this audit.
