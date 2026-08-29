# Annotated parity comparisons

The numbered annotations below map to the four callouts in every committed wireframe. Legacy and current captures are evidence of hierarchy and responsive behavior; they are not permission to copy inaccessible hover-only behavior or to reintroduce inconsistent colors.

| Screen | Legacy evidence | Current evidence | Annotated decision |
| --- | --- | --- | --- |
| Home | [desktop](legacy/home/desktop-1440x900.png) | [desktop](new/home/desktop-1440x900.png) | 1. Keep the aqua, logo-first header. 2. Preserve the photographic hero and catalogue CTA. 3. Keep categories immediately discoverable. 4. Retain product-first density with visible actions. |
| Catalog | [desktop](legacy/catalog/desktop-1440x900.png) | [desktop](new/catalog/desktop-1440x900.png) | 1. Preserve the compact shopping header. 2. Make result context explicit. 3. Keep filters usable without horizontal scrolling. 4. Use a stable 4/3/2-column grid and visible image fallbacks. |
| Product | [desktop](legacy/product/desktop-1440x900.png) | [desktop](new/product/desktop-1440x900.png) | 1. Preserve the return path. 2. Keep media dominant without hiding missing-image state. 3. Preserve name, price and availability hierarchy. 4. Keep purchase controls visible and keyboard reachable. |
| Cart | [desktop](legacy/cart/desktop-1440x900.png) | [desktop](new/cart/desktop-1440x900.png) | 1. Add explicit checkout progress. 2. Preserve the clear cart heading. 3. Distinguish populated and empty states. 4. Keep total and checkout action together on narrow screens. |
| Checkout | [desktop](legacy/checkout/desktop-1440x900.png) | [desktop](fixture/checkout/desktop-1440x900.png) | 1. Preserve cart-to-checkout orientation. 2. Group recipient fields. 3. Separate delivery and payment decisions. 4. Keep the order summary visible and expose pending/disabled feedback. |
| Account | [desktop](legacy/account/desktop-1440x900.png) | [desktop](fixture/account/desktop-1440x900.png) | 1. Preserve storefront navigation. 2. Put identity and frequent actions first. 3. Group address and notification state. 4. Keep order history readable on mobile without a table. |
| Admin dashboard | [desktop](legacy/admin-dashboard/desktop-1440x900.png) | [desktop](fixture/admin-dashboard/desktop-1440x900.png) | 1. Keep admin ownership visually distinct. 2. Prioritize actionable metrics. 3. Pair orders with inventory attention. 4. Surface integration health instead of hiding failures. |
| Product editor | [desktop](legacy/admin-product-editor/desktop-1440x900.png) | [desktop](fixture/admin-product-editor/desktop-1440x900.png) | 1. Preserve a clear return path. 2. Replace unrestricted legacy upload fields with the enforced three-slot media manager. 3. Keep catalog fields grouped and labelled. 4. Show save/archive outcomes next to their actions. |
| Admin orders | [desktop](legacy/admin-orders/desktop-1440x900.png) | [desktop](fixture/admin-orders/desktop-1440x900.png) | 1. Preserve admin navigation. 2. Add searchable, persistent filters. 3. Keep status and customer context scannable. 4. Make export, pagination and empty state explicit. |

## Responsive wireframes

Every required screen has a numbered structural wireframe at 1440×900, 768×1024 and 390×844:

| Screen | 1440×900 | 768×1024 | 390×844 |
| --- | --- | --- | --- |
| Home | [SVG](wireframes/home/desktop-1440x900.svg) | [SVG](wireframes/home/tablet-768x1024.svg) | [SVG](wireframes/home/mobile-390x844.svg) |
| Catalog | [SVG](wireframes/catalog/desktop-1440x900.svg) | [SVG](wireframes/catalog/tablet-768x1024.svg) | [SVG](wireframes/catalog/mobile-390x844.svg) |
| Product | [SVG](wireframes/product/desktop-1440x900.svg) | [SVG](wireframes/product/tablet-768x1024.svg) | [SVG](wireframes/product/mobile-390x844.svg) |
| Cart | [SVG](wireframes/cart/desktop-1440x900.svg) | [SVG](wireframes/cart/tablet-768x1024.svg) | [SVG](wireframes/cart/mobile-390x844.svg) |
| Checkout | [SVG](wireframes/checkout/desktop-1440x900.svg) | [SVG](wireframes/checkout/tablet-768x1024.svg) | [SVG](wireframes/checkout/mobile-390x844.svg) |
| Account | [SVG](wireframes/account/desktop-1440x900.svg) | [SVG](wireframes/account/tablet-768x1024.svg) | [SVG](wireframes/account/mobile-390x844.svg) |
| Admin dashboard | [SVG](wireframes/admin-dashboard/desktop-1440x900.svg) | [SVG](wireframes/admin-dashboard/tablet-768x1024.svg) | [SVG](wireframes/admin-dashboard/mobile-390x844.svg) |
| Product editor | [SVG](wireframes/admin-product-editor/desktop-1440x900.svg) | [SVG](wireframes/admin-product-editor/tablet-768x1024.svg) | [SVG](wireframes/admin-product-editor/mobile-390x844.svg) |
| Admin orders | [SVG](wireframes/admin-orders/desktop-1440x900.svg) | [SVG](wireframes/admin-orders/tablet-768x1024.svg) | [SVG](wireframes/admin-orders/mobile-390x844.svg) |

The legacy product-editor evidence is the old add-product modal because the old application has no separate product-editor route. The current fixture uses invented users, products and orders and never invokes production integrations.
