# Interaction-state matrix

This matrix records the required visual states and their reproducible evidence. Destructive or externally integrated success paths remain part of launch UAT; the design reference uses inert fixtures and action tests instead of sending real orders or notifications.

| Area | Loading | Empty | Error | Disabled | Success | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Home/catalog | Server-rendered shell and product-image fallback | Empty result copy in catalog | Store error boundary with retry | Inactive filters/actions use semantic disabled state | Applied filter/result state | Three-browser responsive/axe suite; `storefront.spec.ts`; public captures. |
| Product | Image fallback reserves layout | Missing product uses not-found screen | Store error boundary | Unavailable product disables purchase | Cart/wishlist controls announce changes | `fixture/product-unavailable/*`, product capture and component tests. |
| Cart | `cart-loading` skeleton | Explicit empty cart | Inventory retry state | Checkout is unavailable for invalid inventory | Populated total and checkout action | `fixture/cart-empty/*`, `fixture/cart-populated/*`, cart/inventory components. |
| Authentication | Pending buttons use spinner and disabled state | Not applicable | Provider error notice | Submit is disabled while pending | Password-update notice | `fixture/auth/*`, `fixture/auth-error/*`, `fixture/auth-success/*`. |
| Checkout | Cart/inventory loading shell | No-items checkout state | Inventory retry and field/action errors | Online card option and pending submit | Action result redirects to order detail | `fixture/checkout/*`; checkout action tests cover error and success without external delivery. |
| Account | Server route waits before rendering | Address, notification and order empty panels | Section-scoped retry panels | Mutation buttons disable while pending | Populated profile, notification and order state | `fixture/account/*`; account page and action components. |
| Admin catalog/editor | Server route and pending form controls | Category/product empty panels | Admin error boundary and inline mutation errors | Media slots/actions enforce pending and three-slot limits | Inline save/media success state | `fixture/admin-product-editor/*`; admin action/media tests; RLS three-slot smoke test. |
| Admin dashboard/orders | Server route and pending retry controls | Orders, stock and integration empty panels | Admin error boundary and integration failure rows | Claimed retry and invalid status actions are disabled/rejected | Status/export/retry action tests and populated fixture | `fixture/admin-dashboard/*`, `fixture/admin-orders/*`; admin Vitest and browser UAT register. |

## Review conclusions

- Keyboard focus remains visible, the mobile menu closes with Escape and reduced motion is respected.
- The 390px layouts avoid horizontal overflow and keep primary actions reachable.
- Product/media fallbacks reserve space and do not rely on alt text as the only visible state.
- Serious and critical axe violations are a release-blocking threshold; lower-impact findings still require review rather than automatic dismissal.
