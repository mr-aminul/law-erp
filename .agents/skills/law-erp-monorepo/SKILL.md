---
name: law-erp-monorepo
description: >-
  Law ERP monorepo layout and placement rules for apps/web (Next.js), services/api
  (Go chi), and design/. Use when adding files, restructuring, choosing where code
  belongs, or keeping the repository organized.
---

# Law ERP Monorepo

## Layout

| Path | Purpose |
|------|---------|
| `apps/web/` | Next.js frontend only |
| `services/api/` | Go API (chi router) |
| `design/` | Shared theme.css, tokens, tailwind presets |
| `docs/` | ARCHITECTURE.md, ADRs, handoffs |

## Placement rules

**Frontend**
- Pages: `apps/web/app/`
- Components: `apps/web/components/`
- API client: `apps/web/lib/api/` (single fetch layer)
- Mock data (temporary): `apps/web/lib/mock/`
- Env: `apps/web/.env.local` from `.env.example`

**Backend**
- Entry: `services/api/cmd/server/main.go`
- Handlers: `services/api/internal/handler/{resource}.go`
- Router: `services/api/internal/server/server.go`
- Never import `internal/` from outside the module

**Design**
- Brand colors: edit `design/theme.css` only
- Web imports: `../../design/` from `apps/web/app/globals.css`

## Forbidden

- No Rails, Ruby, Gemfile, or ViewComponent references
- No new top-level app folders without updating `docs/ARCHITECTURE.md`
- No duplicate design tokens in `apps/web/`
- No scattered `fetch()` — use `lib/api/client.ts`

## Verify after structural changes

```bash
make test-api
cd apps/web && npm run build
```

## Reference

- [AGENTS.md](../../AGENTS.md)
- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
