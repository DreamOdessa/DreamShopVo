---
name: dead-code-cleanup
description: Identify and safely remove unused React code, imports, routes, assets, configuration, and dependencies with evidence and verification. Use for cleanup requests or after feature removals.
---

# Dead Code Cleanup

Remove only code that is proven unreachable or unused in the repository's supported flows.

## Workflow

1. Search imports, exports, route registration, dynamic imports, scripts, public asset references, and configuration references.
2. Check string-based references, Firebase collection names, Cloud Function entry points, service-worker files, and deployment scripts before declaring something unused.
3. Separate confirmed dead code from code that is merely low-traffic or indirectly invoked.
4. Remove in small groups and inspect the diff after each group.
5. Run TypeScript/build checks and relevant tests. For dependency removal, update the lockfile only through the package manager.

## Guardrails

Do not delete Firestore data, user-facing routes, migration history, environment examples, or external assets based only on an unused import. Preserve unrelated user changes and report uncertain candidates instead of removing them.
