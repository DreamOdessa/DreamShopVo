# Design-reference capture index

This directory is evidence for visual parity review, not an approval to change the visual direction without comparison.

The [legacy source audit](legacy-source-audit.md) records both the design DNA proven from the preserved source and the limits of the owner-authorized, read-only legacy capture.

## Authorized legacy captures

The owner supplied access to the legacy preview on 2026-08-29. These captures cover the publicly rendered home, catalog, product and empty-cart screens at all three reference viewports. No account, order, product or configuration data was changed, and the private access address is intentionally not recorded here.

| Screen | 1440×900 | 768×1024 | 390×844 | Review result |
| --- | --- | --- | --- | --- |
| Home | [PNG](legacy/home/desktop-1440x900.png) | [PNG](legacy/home/tablet-768x1024.png) | [PNG](legacy/home/mobile-390x844.png) | Confirms the tall photographic hero, logo-first composition, aqua header and rounded desktop navigation. |
| Catalog | [PNG](legacy/catalog/desktop-1440x900.png) | [PNG](legacy/catalog/tablet-768x1024.png) | [PNG](legacy/catalog/mobile-390x844.png) | Confirms card density and the responsive header; legacy product media was unavailable during capture. |
| Product | [PNG](legacy/product/desktop-1440x900.png) | [PNG](legacy/product/tablet-768x1024.png) | [PNG](legacy/product/mobile-390x844.png) | Confirms information hierarchy and purchase controls; legacy product media was unavailable during capture. |
| Empty cart | [PNG](legacy/cart/desktop-1440x900.png) | [PNG](legacy/cart/tablet-768x1024.png) | [PNG](legacy/cart/mobile-390x844.png) | Confirms the aqua cart band, empty-state hierarchy and responsive header. |

The legacy client intermittently showed loading or maintenance frames while changing viewport. Those transient frames were discarded; every file above was saved only after the expected route heading or product content was present. Missing legacy images are a limitation of the old runtime, not evidence for changing the current product-image treatment.

## Read-only local legacy captures

The preserved CRA application also exposes a guarded local preview with invented cart, account and admin data. `npm run capture:legacy-reference` from `apps/web` starts that preview and captures the five authenticated/administrative reference screens without Firebase writes or production credentials.

| Screen | 1440×900 | 768×1024 | 390×844 | Review result |
| --- | --- | --- | --- | --- |
| Checkout | [PNG](legacy/checkout/desktop-1440x900.png) | [PNG](legacy/checkout/tablet-768x1024.png) | [PNG](legacy/checkout/mobile-390x844.png) | Preserves the legacy form hierarchy and summary placement using an invented local cart. |
| Account | [PNG](legacy/account/desktop-1440x900.png) | [PNG](legacy/account/tablet-768x1024.png) | [PNG](legacy/account/mobile-390x844.png) | Records the legacy profile structure without opening a real user account. |
| Admin dashboard | [PNG](legacy/admin-dashboard/desktop-1440x900.png) | [PNG](legacy/admin-dashboard/tablet-768x1024.png) | [PNG](legacy/admin-dashboard/mobile-390x844.png) | Records navigation, metrics and responsive sidebar behavior. |
| Product editor | [PNG](legacy/admin-product-editor/desktop-1440x900.png) | [PNG](legacy/admin-product-editor/tablet-768x1024.png) | [PNG](legacy/admin-product-editor/mobile-390x844.png) | Records the legacy add/edit modal; mobile captures close the sidebar before the modal is saved. |
| Admin orders | [PNG](legacy/admin-orders/desktop-1440x900.png) | [PNG](legacy/admin-orders/tablet-768x1024.png) | [PNG](legacy/admin-orders/mobile-390x844.png) | Records the legacy order-management hierarchy with local fixture rows only. |

## Current implementation captures

| Screen | 1440×900 | 768×1024 | 390×844 | Review result |
| --- | --- | --- | --- | --- |
| Home | [PNG](new/home/desktop-1440x900.png) | [PNG](new/home/tablet-768x1024.png) | [PNG](new/home/mobile-390x844.png) | No horizontal overflow; primary navigation, header actions, hero CTA and next-section entry remain visible. |
| Catalog | [PNG](new/catalog/desktop-1440x900.png) | [PNG](new/catalog/tablet-768x1024.png) | [PNG](new/catalog/mobile-390x844.png) | No horizontal overflow; filters remain stacked and tappable on mobile. |
| Product | [PNG](new/product/desktop-1440x900.png) | [PNG](new/product/tablet-768x1024.png) | [PNG](new/product/mobile-390x844.png) | No horizontal overflow; quantity, cart and wishlist actions remain visible on mobile. |
| Empty cart | [PNG](new/cart/desktop-1440x900.png) | [PNG](new/cart/tablet-768x1024.png) | [PNG](new/cart/mobile-390x844.png) | No horizontal overflow in the guest empty state. |

## Deterministic technical captures

Run `npm run capture:design-reference` from `apps/web` to generate a fresh, repeatable set of Chromium captures from the isolated local fixture. It contains home, catalog, available and unavailable product states, guest empty and populated carts, and sign-in baseline/error/success states at the three target viewports. The images are deliberately separated from the approved `new/` baseline: fixture content has no production data and cannot be used as a legacy visual comparison.

| Screen | 1440×900 | 768×1024 | 390×844 |
| --- | --- | --- | --- |
| Home | [PNG](fixture/home/desktop-1440x900.png) | [PNG](fixture/home/tablet-768x1024.png) | [PNG](fixture/home/mobile-390x844.png) |
| Catalog | [PNG](fixture/catalog/desktop-1440x900.png) | [PNG](fixture/catalog/tablet-768x1024.png) | [PNG](fixture/catalog/mobile-390x844.png) |
| Product | [PNG](fixture/product/desktop-1440x900.png) | [PNG](fixture/product/tablet-768x1024.png) | [PNG](fixture/product/mobile-390x844.png) |
| Unavailable product (disabled purchase) | [PNG](fixture/product-unavailable/desktop-1440x900.png) | [PNG](fixture/product-unavailable/tablet-768x1024.png) | [PNG](fixture/product-unavailable/mobile-390x844.png) |
| Guest empty cart | [PNG](fixture/cart-empty/desktop-1440x900.png) | [PNG](fixture/cart-empty/tablet-768x1024.png) | [PNG](fixture/cart-empty/mobile-390x844.png) |
| Populated cart | [PNG](fixture/cart-populated/desktop-1440x900.png) | [PNG](fixture/cart-populated/tablet-768x1024.png) | [PNG](fixture/cart-populated/mobile-390x844.png) |
| Sign-in | [PNG](fixture/auth/desktop-1440x900.png) | [PNG](fixture/auth/tablet-768x1024.png) | [PNG](fixture/auth/mobile-390x844.png) |
| Sign-in error | [PNG](fixture/auth-error/desktop-1440x900.png) | [PNG](fixture/auth-error/tablet-768x1024.png) | [PNG](fixture/auth-error/mobile-390x844.png) |
| Sign-in success notice | [PNG](fixture/auth-success/desktop-1440x900.png) | [PNG](fixture/auth-success/tablet-768x1024.png) | [PNG](fixture/auth-success/mobile-390x844.png) |
| Checkout | [PNG](fixture/checkout/desktop-1440x900.png) | [PNG](fixture/checkout/tablet-768x1024.png) | [PNG](fixture/checkout/mobile-390x844.png) |
| Account | [PNG](fixture/account/desktop-1440x900.png) | [PNG](fixture/account/tablet-768x1024.png) | [PNG](fixture/account/mobile-390x844.png) |
| Admin dashboard | [PNG](fixture/admin-dashboard/desktop-1440x900.png) | [PNG](fixture/admin-dashboard/tablet-768x1024.png) | [PNG](fixture/admin-dashboard/mobile-390x844.png) |
| Product editor | [PNG](fixture/admin-product-editor/desktop-1440x900.png) | [PNG](fixture/admin-product-editor/tablet-768x1024.png) | [PNG](fixture/admin-product-editor/mobile-390x844.png) |
| Admin orders | [PNG](fixture/admin-orders/desktop-1440x900.png) | [PNG](fixture/admin-orders/tablet-768x1024.png) | [PNG](fixture/admin-orders/mobile-390x844.png) |

## Parity artifact status

- [Annotated comparisons and 27 responsive wireframes](comparisons.md) cover all nine required screens.
- Legacy and current evidence now covers checkout, account, admin dashboard, product editor and orders at all three target viewports.
- The [interaction-state matrix](state-matrix.md) maps loading, empty, error, disabled and success evidence.
- Chromium, Firefox and WebKit cover responsive overflow and serious/critical axe checks; keyboard mobile navigation and reduced motion have dedicated checks.

The initial new-application captures were taken locally from the production build on 2026-08-20. The remote public legacy captures and guarded local-preview captures were taken read-only on 2026-08-29. This completes the technical RB-008 artifact set. Product-owner visual approval remains an explicit UAT/cutover decision, and legacy product media should be refreshed if the old runtime becomes able to serve it again.

## Reproducible public-state checks

From `apps/web`, run `npm run test`, then `npm run test:e2e` after installing the Playwright browsers. The E2E suite starts an isolated local Supabase-compatible fixture, makes a production build and runs `next start`; it needs no production secrets. A synthetic local admin session extends the checks to checkout, account and the three required admin screens without authenticating against or mutating production. It covers Chromium, Firefox and WebKit, the three reference viewports, keyboard mobile navigation, reduced-motion behavior, horizontal overflow, guest redirects with a preserved return URL, and serious/critical axe violations.

On 2026-08-29, all 33 expanded browser checks passed (11 scenarios in each of Chromium, Firefox and WebKit). This records functional responsive/accessibility coverage and completes the technical reference set; it does not substitute for final product-owner UAT approval.
