# DreamShopVo: Current Project Status

Last updated: 2026-08-02

## Continuation Update: 2026-08-14

- GitHub, Vercel and Cloudflare Codex plugins are connected.
- Current production deployment `7f87737` is `READY`; Vercel reports no runtime
  error clusters for the last seven days.
- Public route checks return `200` for `/`, `/catalog` and `/cart`; protected
  `/checkout`, `/account` and `/admin` correctly redirect with `307`.
- Cloudflare Worker `/health` returns `200`; media, Nova Poshta, Supabase,
  Telegram auth and Telegram order notification checks all report healthy.
- Cloudflare account inspection confirms Worker `dreamshop-api`, compatibility
  date `2026-08-01`, persistent invocation logs, the required secret bindings,
  and an R2 binding from `PRODUCT_MEDIA` to bucket `dream-shop`.
- R2 contains only one object under `products/`. This independently confirms
  that missing storefront images are a catalog/media population issue, not a
  rendering or Worker delivery defect.
- Production catalog audit found 186 active products across eight pages. Only
  one product currently has a visible primary image; 185 use the fallback.
  Details are in `CATALOG_QUALITY_AUDIT.md`.
- The product cover generator now supports `--offset` and refuses an unbounded
  `--apply` unless `--all` is explicitly supplied.
- A first site-level admin setting was implemented locally: admins can edit the
  home hero title, subtitle, CTA label and internal CTA link. The storefront
  reads `home.hero` from `site_settings` and retains safe defaults.
- Real Chrome checks now cover the production home, catalog and product route
  at desktop and 390px mobile widths. The home and catalog render without
  broken image requests, missing image alt attributes, or captured console
  errors. The empty product artwork is the intentional fallback for missing R2
  media.
- The browser audit exposed a storefront blocker: product slugs containing
  Cyrillic characters return 404 because the encoded dynamic route parameter
  was compared directly with the decoded database slug. The local catalog
  query now decodes the route segment safely before the Supabase lookup.
- The local sitemap now includes the home page and keeps the catalog as the
  next-highest priority URL.
- Storefront product queries now include the existing `ingredients` field. A
  visible "Склад" chip list and a delivery summary were added to product pages.
- The storefront now has real `/about`, `/contacts`, `/delivery`, `/privacy`,
  `/returns` and `/terms` routes with page metadata, sitemap entries and a
  complete four-column footer. The old site only displayed most of these names
  as non-clickable list items.
- A keyboard-labelled scroll-to-top control was added for long catalog and home
  pages. The home category showcase is capped at four categories and three
  products per category to reduce repetition and mobile page length.
- The cart icon now opens an accessible mini-cart instead of forcing immediate
  navigation. It opens after additions, supports quantity changes and removal,
  shows the live total, closes with Escape/overlay, and links to cart/checkout.
- The storefront header now includes a catalog search field on desktop and in
  the mobile drawer, a direct phone action, and an account label that reflects
  whether the visitor is authenticated.
- `apps/web` typecheck passes after these local changes. A production build
  also passes completely in maintenance-mode verification with controlled
  public placeholder configuration (28 routes, verified with webpack after a
  local Turbopack process stalled). The migration-boundary check also passes.
  A live-data local build still needs the
  Vercel public Supabase environment values.
- These 2026-08-14 changes are in the writable archive copy at
  `/home/senonkray/Documents/Codex/DreamShopVo-current`; they are not pushed or
  deployed yet.

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

1. Publish the encoded-product-slug fix to a preview deployment and verify Cyrillic product pages return 200.
2. User acceptance test of combined admin product filters and row-level deletion on production.
3. Generate/review one product cover, then apply approved covers to R2 in batches of at most ten.
4. Finish catalog data quality: descriptions, ingredients, stock and images for every active product.
5. Continue visual parity with the old storefront across home, catalog, product, cart, checkout and account pages.
6. Add remaining site-level admin settings only after defining which content must be editable.
7. Complete performance measurements after product media is populated; current image-placeholder results are not representative.
8. Point the final public domain to the new Next.js deployment.
9. Remove legacy Firebase code and dependencies only after the new site is accepted and migration rollback is no longer needed.
