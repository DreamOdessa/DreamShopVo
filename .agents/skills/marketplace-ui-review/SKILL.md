---
name: marketplace-ui-review
description: Review ecommerce UI for responsive layout, accessibility, interaction states, visual consistency, and shopping-flow usability. Use for storefront or admin UI reviews and after visible frontend changes.
---

# Marketplace UI Review

Evaluate the interface from the shopper's and administrator's point of view.

## Checklist

- Check desktop and narrow mobile layouts for overflow, overlap, clipped text, unstable card sizes, and usable touch targets.
- Check browse, search, filters, product detail, cart, wishlist, login, and admin editing flows.
- Check loading, empty, error, disabled, success, permission, and missing-image states.
- Check keyboard navigation, visible focus, labels, alt text, headings, contrast, dialog behavior, and form errors.
- Check that controls use familiar icons or text labels consistently and that destructive actions are explicit.
- Check image aspect ratios and the Cloudinary fallback behavior for products without photos.

## Review Method

Inspect the relevant React and styled-components code, run the dev server when useful, and use a browser screenshot or direct DOM inspection for visual claims. Report findings with severity, file/line, viewport or state, user impact, and recommendation. Do not report subjective preferences as defects without a usability or accessibility reason.
