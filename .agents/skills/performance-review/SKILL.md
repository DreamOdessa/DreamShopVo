---
name: performance-review
description: Review React ecommerce performance across bundle size, rendering, data fetching, images, animations, and loading states. Use for slow pages, high network cost, or performance work before release.
---

# Performance Review

Find measurable work that improves the shopper's path to useful content.

## Workflow

1. Inspect build output, route loading, large dependencies, repeated renders, and expensive effects or memoization.
2. Trace Firestore reads and listeners for duplicate queries, unbounded collections, missing pagination, and unnecessary refreshes.
3. Inspect product and category image URLs, fallback behavior, dimensions, format, lazy loading, and Cloudinary transformations.
4. Inspect animation cost, list rendering, layout shifts, and mobile behavior.
5. Verify improvements with a build, focused measurement, or reproducible network/render observation.

## Guardrails

Do not trade away auth, correctness, image quality, or accessibility for an unmeasured micro-optimization. Report the evidence, affected route, likely gain, and regression risk.
