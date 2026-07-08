# Law ERP — Agent Protocol

Monorepo workflow for AI-assisted development.

## Stack

| Layer | Tech | Location |
|-------|------|----------|
| Frontend | Next.js 14, React, Tailwind, shadcn/ui | `apps/web/` |
| Backend | **Go + chi + gqlgen** | `services/api/` |
| Design tokens | Shared CSS + Tailwind preset | `design/` |

**Go framework:** [go-chi/chi v5](https://github.com/go-chi/chi) — lightweight, idiomatic HTTP router. Not Gin, not Fiber. Middleware from chi; CORS via `github.com/go-chi/cors`.

## Repo layout

```text
law-erp/
├── apps/web/           # Next.js UI — only frontend app
├── services/api/       # Go REST API
│   ├── cmd/server/     # Entrypoint
│   └── internal/       # handlers, server, config (not exported)
├── design/             # Shared theme.css, tokens, tailwind presets
├── docs/               # Architecture, ADRs, handoffs
├── .cursor/rules/      # Cursor agent rules (.mdc)
└── .agents/skills/     # Project skills (/skill-name)
```

**Do not** add files at repo root except: `README.md`, `AGENTS.md`, `Makefile`, `go.work`, `package.json`, config dotfiles.

## Priority order

1. User instructions in the current message
2. This file (`AGENTS.md`)
3. Rules in `.agents/rules/` and `.cursor/rules/`
4. Skills in `.agents/skills/`
5. `docs/DATA_GOVERNANCE.md` — AI training & tenant data rules

## Mandatory gates

Before marking work complete:

1. **Build** — `go build ./...` in `services/api/`; `npm run build` in `apps/web/` when UI changed
2. **Tests** — New Go behavior has `_test.go`; run `go test ./...`
3. **Lint** — `npm run lint` when touching `apps/web/`
4. **DRY** — No third copy of logic; extract shared code
5. **Dead code** — Remove obsolete code; no orphaned files
6. **Scope** — Touch only the app/service the task requires

## When to use which skill

| Intent | Skill |
|--------|-------|
| Repo layout, where to put code | `law-erp-monorepo` |
| Go API routes, handlers, middleware | `go-api-dev` |
| Minimal solution (default) | `ponytail` |
| Test-first features | `tdd` |
| Fix bugs | `bug-fix` |
| Remove unused code | `dead-code-sweep` |
| Review changes | `code-reviewer` |
| Log/sync Notion tasks after code changes (`/notion-task-tracker`) | `notion-task-tracker` — MCP: `tools/ukil-notion-mcp/` |
| Local setup issues | `env-doctor` |
| End session | `handoff` |

## Conventions

### Go (`services/api/`)

- Standard library first; chi for routing only
- `internal/` for all app code; `cmd/server` for main
- Handlers in `internal/handler/`; one file per resource
- JSON responses via shared helper; consistent error shape
- Config from env in `internal/config/`

### Next.js (`apps/web/`)

- App Router; mock data in `lib/mock/` until API wired
- API client in `lib/api/` — never raw fetch scattered in components
- Import design tokens from `../../design/` (not duplicated CSS)
- Components in `components/`; domain types in `types/`

### API contract

- Versioned GraphQL schema in `graph/schema/`; playground at `/` in dev
- Health: `GET /health` (REST, for probes)
- Data queries: `POST /graphql`

## Git

- Commit only when the user explicitly asks
- No force-push to main
