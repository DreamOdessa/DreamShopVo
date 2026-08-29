# Legacy visual source audit

Status: **code-derived and owner-authorized read-only runtime evidence, not visual-parity approval**. Reviewed on 2026-08-29 from the preserved legacy source, local public assets and the owner-provided legacy preview. The preview was used only to capture storefront screens; no account, product, order or configuration data was changed, and its private access address is not stored in this repository.

## Visual DNA confirmed in source

| Element | Legacy evidence | Current storefront treatment | Decision |
| --- | --- | --- | --- |
| Base canvas and type | Inter/system stack; pale aqua-to-cream canvas (`#e0f7fa` → `#f0fdfa`), deep blue-green text (`#2c3e50`). | Inter/system stack; aqua canvas `#dceff0`, pale surfaces and deep blue-green semantic text tokens. | Preserve the calm aqua/cream identity while giving text an accessible semantic token. |
| Brand gradient | Header and primary controls use the aqua family: `#158b9d`, `#2faec2`, `#5bdbe8`; cards also use `#4dd0e1`, `#26c6da`, `#00acc1`. | Header uses `--color-brand-gradient-start` / `--color-brand-gradient-end`; buttons use the deeper brand token. | Preserve hue family; make the new interface quieter and use fewer uncontrolled gradients. |
| Hero | `background-first.PNG`, the full Dream logo, centred title, subtitle and a scroll cue; large desktop hero with a mobile non-fixed background. | The same background and logo assets, centred copy, CTA and scroll cue; fixed attachment is likewise disabled for small screens. | Preserve the recognisable entry composition and asset language. |
| Product catalog | White, square-media cards; 8px rounding; 150–220px fluid cards; category label, organic badge and price hierarchy. | White, square-media cards with 7px rounding, fluid 4/3/2-column grid, badge and price hierarchy. | Preserve product-first density while using visible inline actions and semantic disabled state. |
| Mobile navigation | Sticky header; a left drawer at up to 84vw, a dark aqua gradient and overlay, with the brand centred in the compact header. | Sticky header; left drawer at up to 84vw, overlay, 48px navigation targets and keyboard Escape support. | Preserve placement and orientation; simplify decoration and add verified keyboard behavior. |
| Status colour | Legacy source uses green `#1a9b5c` and red `#e74c3c` for price/availability feedback. | `--color-success` and berry `--color-danger` / `--color-accent`. | Keep distinct positive and destructive states without using price decoration as the only signal. |

## Code and asset evidence

- [Legacy global styles](../../src/styles/GlobalStyles.ts) establish the font, base canvas, text colour, overflow guard and 1400px container.
- [Legacy header](../../src/components/Header.tsx) defines the sticky aqua gradient, responsive desktop/mobile split and left drawer.
- [Legacy home](../../src/pages/Home.tsx) defines the hero, shared logo/background assets, mobile fixed-background exception and product grid.
- [Legacy product card](../../src/components/ProductCard.tsx) defines the square media, badges, actions, price hierarchy and fluid card sizing.
- Local source assets were inspected without network access: `background-first` is 1024×1024, `background-second.jpg` is 1280×1280, `logo.png` is 1483×945 and `logo-name.PNG` is 1313×1051. The current storefront uses matching local copies of the hero background and logo.
- [Current tokens and layout rules](../../apps/web/src/app/globals.css) and [current home composition](../../apps/web/src/components/storefront/store-home.tsx) contain the mapped implementation.

## Code-derived layout anatomy

These annotations describe structure visible in source; they are not a substitute for annotated legacy screenshots.

```text
Desktop home
[ sticky aqua header: logo | centred primary navigation | account / wishlist / cart ]
[ photographic aqua hero: logo → welcome heading → concise subtitle → catalogue CTA ]
[ category/product showcase ]
[ popular-product grid: square image | category/meta | name | price | action ]

Mobile home
[ menu | centred/compact brand | wishlist / cart ]
[ left navigation drawer + dimming overlay ]
[ same hero and product hierarchy, two cards per compact row ]
```

## Runtime capture findings

- The live legacy home confirms the source-derived tall first-screen hero, logo-first composition, aqua gradient header and rounded desktop navigation controls. The current storefront now preserves those observable traits while retaining its accessible focus and motion rules.
- Catalog and product layouts loaded, but the legacy runtime did not serve product media at any captured viewport. The rendered cards and product detail displayed blank media/alt-content areas, so these screenshots are valid layout evidence but cannot approve image-treatment parity.
- During viewport changes the legacy client intermittently returned loading or maintenance frames. Each committed screenshot was recaptured only after its expected route heading or product content appeared. These transient frames are a live-legacy stability limitation, not a defect attributed to the new storefront.

## Intentional differences and unresolved decisions

1. Legacy detail-page source also contains an unrelated purple `#667eea` / `#764ba2` control family, while its header and catalog are aqua. Without approved historical renders, there is no evidence that purple is a durable brand requirement; it has **not** been restored to the new storefront.
2. The legacy source relies on hover-only floating card actions and long decorative motion. The new storefront keeps touch-visible controls, focus states and reduced-motion behaviour. This is an intentional accessibility improvement, not a parity regression.
3. The capture set cannot validate legacy product photography, authenticated checkout/account/admin screens, error pages or all dynamic content. The remaining sign-off inputs are listed in [the capture index](README.md#required-before-visual-parity-sign-off).
