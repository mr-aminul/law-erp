# Bug Fixing Standards

Systematic approach for fixing bugs without introducing regressions.

## Process

1. **Reproduce** — confirm the bug with steps or a failing test
2. **Isolate** — find root cause, not symptoms
3. **Test first** — write a failing test that captures the bug
4. **Fix minimally** — smallest change that makes the test pass
5. **Verify** — full test suite + manual check if UI-related
6. **Prevent recurrence** — add test coverage for the edge case

## Root cause discipline

- Do not patch symptoms (extra `rescue`, defensive nil checks) without understanding why
- Trace from user action → controller → model → DB
- Check logs: `log/development.log` or `log/test.log`

## Regression prevention

Every bug fix must include a test unless:

- Purely visual/CSS with no test infrastructure yet (document in handoff)
- External dependency failure (document workaround)

## Hotfix vs proper fix

| Situation | Action |
|-----------|--------|
| Production down | Minimal fix + follow-up issue for root cause |
| Development bug | Fix root cause with test |
| Flaky test | Stabilize test; do not `@skip` without tracking |

## Invoke skill

For structured bug workflows, use `/bug-fix`.
