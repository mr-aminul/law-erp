# Core Engineering Standards

Always-on standards for Law ERP (Next.js + Go monorepo).

## Minimize scope

- Smallest correct diff; no unrelated changes
- Match existing naming and patterns in the touched app
- Reuse `lib/api/`, shared components, and handler helpers before adding new abstractions

## Quality bar

- Go: `go test ./...` and `go build ./...` in `services/api/`
- Web: `npm run build` and `npm run lint` in `apps/web/` when UI changes
- Handle errors explicitly; return proper HTTP status codes from API
- Validate input at API boundaries

## Security

- No secrets in code or commits; use env vars
- CORS origins configured in API config, not wildcard in production
- Sanitize/validate all external input in Go handlers

## Architecture

- **Web:** UI only; data via `lib/api/client.ts`
- **API:** chi router, thin handlers, domain logic in services (when added)
- **Design:** single source in `design/`

## Git

- Commit only when the user explicitly requests
- PR-ready: builds pass, no debug logging left behind
