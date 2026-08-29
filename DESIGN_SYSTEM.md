# DreamShop design-system and parity brief

This is a versioned implementation reference, not an AI-generated redesign.
The aqua-and-cream design language is retained as the starting point for future
product-owner-approved refinements.

## Tokens and rules

Use CSS custom properties in `apps/web/src/app/globals.css`. The active semantic set is `--color-canvas`, `--color-surface`, `--color-surface-muted`, `--color-surface-feature`, `--color-text`, `--color-text-strong`, `--color-text-muted`, `--color-brand`, `--color-brand-strong`, `--color-brand-deep`, `--color-accent`, `--color-success`, `--color-danger`, and `--color-focus`. Layout tokens are `--content-max`, desktop/tablet/mobile gutters, the 4/8/12/16/24/32/48/64 spacing scale, 8/12/20 radii, and fast/standard motion. The visual direction is a calm aqua-and-cream storefront with a single berry accent; typography remains system/installed until a licensed font is selected. Reduced motion is respected. Do not add Tailwind, shadcn, TanStack, RHF, or animation packages by default.

Grid: 1440px desktop content max-width with 24px gutters; 768px tablet with 20px gutters; 390px mobile with 16px gutters. Images need intrinsic dimensions, product-specific alt text, and a visible fallback. Every interactive control needs keyboard focus, target size, disabled/pending feedback and an error message connected to its field.

## Required reference artifacts

Create and commit captures under `docs/design-reference/` before visual
approval. Each screen needs current screenshots and annotated wireframes at
1440×900, 768×1024 and 390×844: home, catalog, product, cart, checkout,
account, admin dashboard, product editor and orders. Include loading, empty,
error, disabled and success states. The complete technical artifact set is
indexed in [the capture README](docs/design-reference/README.md), with state
coverage in the [interaction-state matrix](docs/design-reference/state-matrix.md).
Product-owner approval remains part of UAT rather than being inferred from
automated evidence.

## Parity checklist

| Area | Required comparison |
| --- | --- |
| Storefront | hierarchy, product/card imagery, nav, cart and checkout states |
| Responsive | three viewports, no overflow, readable controls and stable layout |
| Accessibility | keyboard path, focus return/trap, contrast, headings, alt text, reduced motion |
| SEO | per-route titles/descriptions/canonical; product JSON-LD; no indexable private routes |

The current implementation has responsive image `sizes`, loading and fallback
handling in `product-card.tsx`. On 2026-08-29, the production build was
reviewed with an isolated local fixture in Chromium, Firefox and WebKit.
Public storefront, checkout, authenticated account and required admin screens
were checked at all three target viewports without root horizontal overflow or
serious/critical axe violations. The reproducible Chromium fixture set contains
42 captures and 27 annotated SVG wireframes cover the nine required screens.
Keyboard access to the mobile menu, reduced-motion handling, guest redirects
and the sign-in return URL are also covered. This is technical
responsive/accessibility evidence, not product-owner visual approval.
