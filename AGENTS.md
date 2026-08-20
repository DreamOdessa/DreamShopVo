# DreamShopVo Agent Guide

## Project Scope

DreamShopVo is a React 18 and TypeScript storefront with an admin panel. Firebase provides authentication, Firestore data, Cloud Functions, and messaging. Cloudinary provides new image and media uploads through an unsigned upload preset. Prisma is not currently installed in this repository.

## Local Review Skills

Use the matching project skill from `.agents/skills/<skill-name>/SKILL.md` when the request or affected area matches it:

- `marketplace-code-audit`: broad review of storefront, admin, catalog, cart, checkout, orders, and Firebase data flows.
- `marketplace-bug-fix`: reproduce, isolate, fix, and regression-check a reported marketplace defect.
- `marketplace-ui-review`: inspect responsive layout, accessibility, interaction states, and marketplace usability.
- `prisma-safety-review`: review Prisma schemas, queries, migrations, and destructive operations when Prisma is introduced; report not-applicable when it is absent.
- `performance-review`: inspect bundle size, rendering, data fetching, image delivery, and loading behavior.
- `security-review`: inspect auth, authorization, Firestore rules, Cloud Functions, secrets, uploads, input validation, and dependencies.
- `seo-review`: inspect routes, metadata, product discoverability, crawlability, structured data, and indexable content.
- `dead-code-cleanup`: identify unused code and dependencies with evidence before removing anything.

For a review, report findings first with severity and file/line references, then assumptions, test gaps, and a short summary. Do not claim a fix without verification.

## Working Rules

- Read the relevant existing code and current git diff before editing.
- Preserve unrelated user changes, especially changes in `src/firebase/services.ts`.
- Keep changes scoped to the request. Do not remove catalog data or external assets without explicit confirmation.
- Never place Firebase private credentials, Cloudinary API secrets, or `CLOUDINARY_URL` in React code or Vercel client environment variables. Client uploads use only `REACT_APP_CLOUDINARY_CLOUD_NAME` and `REACT_APP_CLOUDINARY_UPLOAD_PRESET`.
- Treat Firestore writes, storage changes, migrations, and dependency removals as potentially destructive. Inspect exact targets first and verify after changes.
- Prefer `rg` for code search and `apply_patch` for manual edits.

## Verification

Use the narrowest useful checks, then run `npm run build` for changes affecting the app. For UI changes, use the local dev server and inspect desktop and mobile states when available. For data or security changes, verify rules and both success and failure paths.

Useful commands:

```bash
npm run build
npm test -- --watchAll=false
npm start
```