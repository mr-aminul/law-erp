---
name: ci-triage
description: Diagnose failing CI, builds, tests, lint, type checks, or deploy checks. Use when a command or GitHub Actions job fails.
---

# CI Triage

Turn noisy failures into the next smallest fix.

## Workflow

1. Identify the failing command, workspace, package, and exact error line.
2. Reproduce locally with the narrowest equivalent command.
3. Classify the failure: dependency/install, lint/style, type/build, test assertion, environment, or flaky timing.
4. Fix root cause minimally; do not mute checks or delete tests unless the user explicitly asks.
5. Re-run the narrow command, then the broader gate when reasonable.

## Project commands

Prefer existing scripts and Make targets:

- Root web build: `npm run build`
- Web workspace: `npm run build --workspace @law-erp/web`
- API/dev commands: `make dev-api` or documented Make targets
- API tests: `make test-api` or `cd services/api && go test ./...`
- Web lint: `cd apps/web && npm run lint`

## Output

Report:

- Failing check and root cause.
- Files changed.
- Commands rerun and result.
- Any remaining external blocker.
