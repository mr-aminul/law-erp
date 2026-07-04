---
name: bug-fix
description: Systematic bug investigation and fix with regression test. Use when the user reports a bug, error, regression, unexpected behavior, or asks to debug, fix, trace, or reproduce an issue.
---

# Bug Fix

Structured workflow for Law ERP (Next.js + Go/chi).

## Phase 1: Reproduce

1. Get steps, expected vs actual, and which app (web vs API)
2. Run `make dev` or the relevant service alone
3. Check: browser console, API logs, `go test` output
4. Confirm `NEXT_PUBLIC_API_URL` and API `PORT` if cross-service bug

## Phase 2: Isolate

**Web:** Component → `lib/api` → network → API handler

**API:** Route → handler → (future: service → DB)

- Read stack traces; grep error strings
- No patches until root cause is clear

## Phase 3: Test-first fix

1. Failing test: Go `_test.go` for API; unit test for `lib/` on web
2. Minimal fix
3. Run `go test ./...` and/or `npm run lint` / `npm run build`

## Phase 4: Verify

- [ ] Bug gone manually
- [ ] Regression test passes
- [ ] Minimal diff; dead code removed

## Output

- **Root cause:** one sentence
- **Fix:** what changed
- **Test:** what is guarded
