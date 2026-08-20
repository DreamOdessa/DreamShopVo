# Design-reference capture index

This directory is evidence for visual parity review, not an approval to change the visual direction without comparison.

## Current implementation captures

| Screen | 1440×900 | 768×1024 | 390×844 | Review result |
| --- | --- | --- | --- | --- |
| Home | [PNG](new/home/desktop-1440x900.png) | [PNG](new/home/tablet-768x1024.png) | [PNG](new/home/mobile-390x844.png) | No horizontal overflow; primary navigation, header actions, hero CTA and next-section entry remain visible. |
| Catalog | [PNG](new/catalog/desktop-1440x900.png) | [PNG](new/catalog/tablet-768x1024.png) | [PNG](new/catalog/mobile-390x844.png) | No horizontal overflow; filters remain stacked and tappable on mobile. |
| Product | [PNG](new/product/desktop-1440x900.png) | [PNG](new/product/tablet-768x1024.png) | [PNG](new/product/mobile-390x844.png) | No horizontal overflow; quantity, cart and wishlist actions remain visible on mobile. |
| Empty cart | [PNG](new/cart/desktop-1440x900.png) | [PNG](new/cart/tablet-768x1024.png) | [PNG](new/cart/mobile-390x844.png) | No horizontal overflow in the guest empty state. |

## Required before visual parity sign-off

- Historical legacy screenshots and annotated comparison wireframes for every required route.
- New captures for catalog, product, cart, checkout, account, admin dashboard, product editor and orders at all three target viewports.
- Loading, empty, error, disabled and success states for each relevant flow.
- Chrome, Firefox and WebKit review, including keyboard focus, contrast and reduced-motion checks.

The initial captures were taken locally from the production build on 2026-08-20. They are a baseline for the new application only; the legacy site has not been bypassed or treated as an approved visual reference.
