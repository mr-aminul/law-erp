# Testing Gates

## Go (`services/api/`)

- **Every change** needs `_test.go` coverage for new or changed behavior (see `.cursor/rules/tdd-mandatory.mdc`)
- Run: `go test ./...` or `make test-api` before marking work complete
- Table-driven tests for handlers and config helpers
- Cover happy path **and** edge cases (empty input, not found, unauthorized)

## Web (`apps/web/`)

- Prefer tests for `lib/` utilities and non-trivial hooks
- Run: `npm run lint` before finishing UI work
- Bug fixes in UI logic need a regression test when test tooling exists
- E2E patterns: see `/e2e-testing-patterns` when adding Playwright/Cypress

## Vertical slices

Build feature end-to-end in one pass:

1. API handler + test
2. Client types + fetch
3. UI wiring
4. Remove mock data for that feature

## When tests are deferred

Document in PR/commit why (e.g. spike only) — never silently skip.
