---
name: marketplace-code-audit
description: Audit ecommerce storefront and admin code for catalog, cart, orders, auth, data flow, and maintainability defects. Use for broad marketplace reviews or before shipping significant marketplace changes.
---

# Marketplace Code Audit

Review the repository as a working ecommerce system, not as isolated files.

## Workflow

1. Map routes, storefront pages, admin flows, Firebase services, Cloud Functions, and media upload paths.
2. Trace the critical journeys: browse/search, product detail, cart, checkout/order creation, authentication, wishlist, and admin product editing.
3. Check loading, empty, error, retry, permission, and stale-data states for each journey.
4. Check data contracts between components, Firestore services, functions, and local models. Look for field-name drift and unsafe assumptions about missing images or products.
5. Run focused tests or builds and report only evidence-backed findings.

## Review Output

Order findings by severity: blocker, high, medium, low. Include file and line, user impact, root cause, and a minimal fix direction. Separate confirmed defects from questions and residual test gaps. Do not change code during a review unless the user also requests fixes.

## Project Notes

Firebase Auth and Firestore remain active. New media uploads use Cloudinary unsigned upload configuration. Preserve unrelated local changes.
