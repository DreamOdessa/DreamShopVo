# DreamShop design-system and parity brief

This is a versioned implementation reference, not an AI-generated redesign. The old site is the visual source until product approval.

## Tokens and rules

Use CSS custom properties in `apps/web/src/app/globals.css`. The active semantic set is `--color-canvas`, `--color-surface`, `--color-surface-muted`, `--color-surface-feature`, `--color-text`, `--color-text-strong`, `--color-text-muted`, `--color-brand`, `--color-brand-strong`, `--color-brand-deep`, `--color-accent`, `--color-success`, `--color-danger`, and `--color-focus`. Layout tokens are `--content-max`, desktop/tablet/mobile gutters, the 4/8/12/16/24/32/48/64 spacing scale, 8/12/20 radii, and fast/standard motion. The visual direction is a calm aqua-and-cream storefront with a single berry accent; typography remains system/installed until a licensed font is selected. Reduced motion is respected. Do not add Tailwind, shadcn, TanStack, RHF, or animation packages by default.

Grid: 1440px desktop content max-width with 24px gutters; 768px tablet with 20px gutters; 390px mobile with 16px gutters. Images need intrinsic dimensions, product-specific alt text, and a visible fallback. Every interactive control needs keyboard focus, target size, disabled/pending feedback and an error message connected to its field.

## Required reference artifacts

Create and commit approved captures under `docs/design-reference/` before visual parity sign-off. Each screen needs old/new screenshots and annotated wireframes at 1440×900, 768×1024 and 390×844: home, catalog, product, cart, checkout, account, admin dashboard, product editor and orders. Include loading, empty, error, disabled and success states. Current public home, catalog, product and empty-cart captures exist at all three viewports and are indexed in `docs/design-reference/README.md`; legacy comparison assets and the remaining screen/state matrix are still required before parity sign-off.

## Parity checklist

| Area | Required comparison |
| --- | --- |
| Storefront | hierarchy, product/card imagery, nav, cart and checkout states |
| Responsive | three viewports, no overflow, readable controls and stable layout |
| Accessibility | keyboard path, focus return/trap, contrast, headings, alt text, reduced motion |
| SEO | per-route titles/descriptions/canonical; product JSON-LD; no indexable private routes |

The current implementation has responsive image `sizes`, loading and fallback handling in `product-card.tsx`; visual/browser validation remains pending.
