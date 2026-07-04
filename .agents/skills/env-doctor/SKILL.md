---
name: env-doctor
description: Diagnose local development environment issues for Node, npm workspaces, Go/chi API, ports, env files, and missing tools in the Law ERP monorepo.
---

# Environment Doctor

Find setup problems without trashing the user's machine.

## Workflow

1. Read `README.md`, `Makefile`, `apps/web/.env.example`, `services/api/README.md`
2. Check tools with read-only commands
3. Verify lockfiles (`package-lock.json`, `go.sum`); don't upgrade unless asked
4. Check ports: web `3000`, API `8080`

## Checks

```bash
node --version && npm --version
go version
cat apps/web/.env.local 2>/dev/null | grep -v SECRET || echo "no .env.local"
curl -s http://localhost:8080/health
```

## Common fixes

- Missing `.env.local`: `cp apps/web/.env.example apps/web/.env.local`
- Go deps: `cd services/api && go mod tidy`
- Web deps: `npm install` from repo root
- PATH for Go: ensure `go` is on PATH (1.23+)

## Safety

- No secret values in commits
- No lockfile deletes as first move
