# Testing Gates

## Go (`services/api/`)

- New handlers and pure logic require `_test.go`
- Run: `go test ./...` or `make test-api`
- Table-driven tests for handlers and config helpers

## Web (`apps/web/`)

- Prefer tests for `lib/` utilities and non-trivial hooks
- Run: `npm run lint` before finishing UI work
- E2E patterns: see `/e2e-testing-patterns` when adding Playwright/Cypress

## Vertical slices

Build feature end-to-end in one pass:

1. API handler + test
2. Client types + fetch
3. UI wiring
4. Remove mock data for that feature

## When tests are deferred

Document in PR/commit why (e.g. spike only) — never silently skip.
