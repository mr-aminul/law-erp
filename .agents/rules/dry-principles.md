# DRY Principles

## Where logic lives

| Concern | Location |
|---------|----------|
| HTTP routes | `services/api/internal/server/server.go` |
| Request/response | `services/api/internal/handler/` |
| API fetching | `apps/web/lib/api/client.ts` |
| UI markup | `apps/web/components/` |
| Brand styling | `design/` |

## Rules

- Third occurrence of the same logic → extract before adding more
- Shared JSON encoding → one helper in handler package
- Shared fetch options → extend `lib/api/client.ts`, not per-component wrappers
- Shared UI → component in `components/ui/` or domain folder

## Anti-patterns

```typescript
// BAD — fetch in component
const res = await fetch("http://localhost:8080/health");

// GOOD
import { apiFetch } from "@/lib/api";
await apiFetch<HealthResponse>("/health");
```

```go
// BAD — duplicate JSON write in every handler
json.NewEncoder(w).Encode(x)

// GOOD — use writeJSON helper
writeJSON(w, http.StatusOK, x)
```
