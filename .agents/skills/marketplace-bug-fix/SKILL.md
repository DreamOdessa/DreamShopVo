---
name: marketplace-bug-fix
description: Diagnose and fix ecommerce storefront or admin bugs with reproduction, focused changes, regression checks, and clear verification. Use when a marketplace defect is reported or a failing flow needs repair.
---

# Marketplace Bug Fix

Fix the smallest complete cause of the reported behavior.

## Workflow

1. Capture the expected and actual behavior, route, user role, data shape, and reproduction steps.
2. Search from the visible symptom through the component, service, Firestore document, function, or upload path involved.
3. Reproduce with a focused test, local check, or deterministic code path before editing when practical.
4. Implement a scoped fix that preserves existing contracts and handles missing, loading, error, and permission states.
5. Add or update a regression check when the project has a suitable test location.
6. Run the narrowest relevant check and `npm run build` for app changes.

## Guardrails

Do not hide errors with broad catches, weaken authorization, or delete production data to make a bug disappear. For Firestore or media issues, distinguish stale references from missing files and remember that client Cloudinary deletion is intentionally not physical deletion.

## Handoff

State the root cause, files changed, verification performed, and any remaining limitation. Mention when the defect cannot be reproduced locally.
