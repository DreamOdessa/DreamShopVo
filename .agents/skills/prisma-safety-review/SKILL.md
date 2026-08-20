---
name: prisma-safety-review
description: Review Prisma schemas, queries, migrations, transactions, validation, and destructive-operation safety. Use when Prisma is added or when a project contains Prisma database code; report clearly when Prisma is absent.
---

# Prisma Safety Review

First determine whether Prisma is actually present by checking `package.json`, lockfiles, `prisma/`, schema files, generated clients, and server code. This repository currently uses Firebase/Firestore, so a review should be marked not applicable unless Prisma code has been introduced.

## When Prisma Exists

- Check schema relations, required fields, indexes, unique constraints, and migration history.
- Check authorization and tenant/user scoping before every read and write.
- Check input validation, query boundaries, pagination, transaction scope, and error handling.
- Check that deletes, cascades, migrations, and data backfills have an explicit rollback or recovery plan.
- Check that Prisma client lifecycle and connection handling match the deployment runtime.

## Output

Report confirmed safety findings with file/line and affected data. Clearly separate "Prisma not present" from unrelated Firebase findings. Never run destructive migrations or delete records as part of a review.
