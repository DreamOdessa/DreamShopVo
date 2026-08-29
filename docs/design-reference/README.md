# Design-reference capture index

This directory holds repeatable evidence for the current DreamShopVo UI. It is
not an approval to change the visual direction without product-owner review.

## Current application captures

The `new/` baseline captures show home, catalog, product and cart at desktop,
tablet and mobile sizes. The `fixture/` captures expand that coverage to
authentication, checkout, account and admin states using isolated data.

Run the following from `apps/web` to regenerate the deterministic browser set:

```bash
npm run capture:design-reference
```

The suite makes a production build, starts an isolated local fixture and does
not use production credentials or customer data.

## Wireframes and state coverage

- `wireframes/` contains 27 SVG wireframes for the nine core screens at the
  three reference viewports.
- `state-matrix.md` maps loading, empty, error, disabled and success states to
  automated checks and fixture captures.

On 2026-08-29 the public storefront, checkout, authenticated account and
required admin screens passed responsive and serious/critical axe checks in
Chromium, Firefox and WebKit. Product-owner visual approval remains a separate
UAT decision.
