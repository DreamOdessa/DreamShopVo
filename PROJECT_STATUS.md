# DreamShopVo: Current Project Status

Last updated: 2026-08-02

This file is the handoff point for a new Codex session. Read it before auditing or redoing completed work.

## Active Architecture

- New storefront/admin: Next.js in `apps/web`, deployed as Vercel project `dreamshop-next`.
- Database and authentication: Supabase.
- Product media: Cloudflare R2 through the DreamShop Cloudflare Worker API.
- Telegram authentication and order notifications: Cloudflare Worker plus Telegram bot.
- Deployments: GitHub `main` and manual Vercel production deployment when GitHub automation does not trigger.
- Legacy React/Firebase application still exists at the repository root during migration. Do not treat it as the target architecture.

## Confirmed Working By The User

- Google login and registration.
- Telegram login/registration flow, including phone confirmation and return to the site.
- Personal account login/logout.
- Checkout and order creation.
- Telegram notifications about new orders.
- Nova Poshta city, branch and parcel-locker selection.
- Product image upload to R2.
- Up to three product images: one primary and two additional images.
- Category cover upload.

Do not repeat full investigations of these areas unless a new regression is reported or a change touches them directly.

## Completed And Technically Verified

- Supabase authentication JWT configuration was repaired; Telegram Worker access uses the working Supabase server credential.
- Google OAuth PKCE callback preserves the verifier cookie (`ad0690f`).
- Product creation redirects to the product edit page so images can be uploaded immediately.
- Product create/edit forms support ingredients.
- Account page shows saved addresses, order count, quick links and password change access.
- Admin product list supports search, category, availability and sorting in one persistent filter form.
- Category/sort changes apply immediately; search no longer clears the other filters.
- Product rows show primary image, category, price, stock, accurate availability status, storefront link, edit and delete actions.
- Product deletion uses the existing verified admin server action and also requests cleanup of linked R2 media.
- Migration-boundary check confirms `apps/web` does not import the legacy Firebase stack.
- `npm --prefix apps/web run typecheck` and `npm --prefix apps/web run build` pass.

## Product Cover Generator

- Script: `scripts/generate-product-covers.mjs`.
- Command: `npm run covers:products -- --dry-run --limit=1` for a safe preview.
- The script creates branded product covers on a dark teal rubber mat, uploads to R2 and can register them as product media.
- Dry-run succeeded with a legacy product source and includes fallback rendering for missing/stale source images.
- Covers have NOT been generated/applied to the full catalog yet.
- User supplied generator identifier `019f91d0-64df-7342-9779-1d1d878eb316`, but the service/provider for that identifier is still unknown. Do not embed it until the provider and API contract are identified.

## Deployment State

- Catalog/account management commit: `6e9e2d8`.
- Quick product deletion and handoff commit: `7f87737`.
- Production deployment containing both commits: `dpl_3m9orr143JpXWyCq6Cj9PxDfkj2A` (`READY`).
- Alias: `https://dreamshop-next.vercel.app`.
- The older design reference remains `https://dream-shop-vo.vercel.app/`; visual parity is still an active migration requirement.

## Important Working Tree Rules

- `src/firebase/services.ts` contains unrelated user changes. Never revert or include them in a migration commit without explicit review.
- `.agents/` and `AGENTS.md` are local project guidance supplied by the user; preserve them.
- Never commit Telegram tokens, Supabase server keys, Cloudinary secrets or R2 credentials.

## Remaining Launch Work

1. User acceptance test of combined admin product filters and row-level deletion on production.
2. Finish catalog data quality: descriptions, ingredients, stock and images for every active product.
3. Generate/review product covers, then apply approved covers to R2 in controlled batches.
4. Continue visual parity with the old storefront across home, catalog, product, cart, checkout and account pages.
5. Add remaining site-level admin settings only after defining which content must be editable.
6. Run responsive/accessibility/performance/SEO release checks on the production alias.
7. Point the final public domain to the new Next.js deployment.
8. Remove legacy Firebase code and dependencies only after the new site is accepted and migration rollback is no longer needed.
