# Dead Code Policy

Remove code made obsolete by the current change. Do not leave orphans.

## Checklist

- Unused exports in `lib/api/`, handlers, components
- Mock data replaced by API — delete mock entries
- Stale env vars or README sections
- Imports with no references

## Monorepo caution

- Deleting a handler? Remove route registration and frontend types too
- Deleting a component? Grep for imports across `apps/web/`
- Never leave references to Rails, `legacy/`, or removed paths

## Tooling

Use `/dead-code-sweep` for systematic passes before large refactors.
