---
name: debugging
description: General debugging workflow for errors, unexpected behavior, failed commands, and broken local app states. Use when the issue is not yet classified as bug, CI, or environment.
---

# Debugging

Find the failure path before changing code.

## Workflow

1. Capture the exact symptom, command, screen error, or log line.
2. Reproduce the smallest version locally.
3. Classify the issue: app bug (`/bug-fix`), failing gate (`/ci-triage`), setup problem (`/env-doctor`), or design flaw (`/architecture-review`).
4. Trace from entry point to failing boundary.
5. Patch the root cause minimally and verify with the narrowest check.

## Rules

- Do not add defensive code until the cause is known.
- Do not hide errors, skip tests, or silence logs as a fix.
- Keep notes short: symptom, cause, fix, verification.
