---
name: security-review
description: Review ecommerce authentication, authorization, Firestore rules, Cloud Functions, secrets, uploads, input validation, dependencies, and client data exposure. Use for security audits or security-sensitive changes.
---

# Security Review

Review both browser code and trusted backend boundaries.

## Checklist

- Verify admin checks and server-side authorization for products, users, orders, bug reports, notifications, and settings.
- Inspect Firestore and Storage rules, callable functions, validation, rate limits, and error leakage.
- Search for committed secrets, API keys used as secrets, unsafe environment exposure, and sensitive logging.
- Check Cloudinary upload preset scope, file type/size limits, public delivery assumptions, and separation of client and server credentials.
- Check XSS, unsafe HTML, URL handling, open redirects, insecure direct object references, and dependency risks.
- Check auth redirects, session state, logout, and privilege changes.

## Output

Lead with severity and exact evidence. Distinguish exploitable findings from hardening suggestions. Never print or commit secrets. Do not weaken rules or authorization while testing.
