---
name: handoff
description: Writes a compact handoff to docs/handoffs/CURRENT.md so a new session or agent can continue without re-deriving context. Use when the user asks for a handoff, session summary, continuation doc, or ending work with follow-on tasks. Triggers "handoff", "hand off", "summary for next session", "pick up later", "/handoff".
disable-model-invocation: true
---

# Handoff

Invoke with **`/handoff`**. Output: **`docs/handoffs/CURRENT.md`** — next session opens with **`@docs/handoffs/CURRENT.md`**.

Each handoff **overwrites** the previous one. Transient context only; durable decisions go in ADRs.

## Instructions

1. **Focus** — Use user text after `/handoff` as the next-session goal, or infer from conversation.
2. **Redact** — Replace secrets and PII with `[REDACTED]`.
3. **Extract, don't duplicate** — Link plans, ADRs, issues, PRs by path. Quote at most 1–2 lines.
4. **Write** `docs/handoffs/CURRENT.md` (create `docs/handoffs/` if missing).
5. **Suggest skills** — List only skills matching **remaining** work (see `AGENTS.md` table).
6. **Verify** — File exists, no secrets, next actions are ordered and actionable.
7. **Reply** with `@docs/handoffs/CURRENT.md` and one-line instruction for next session.

## Template

```markdown
# Handoff: <short title>

**For next session:** <one sentence>

**Created:** <YYYY-MM-DD>

## Current state

- <what works, what was tried>
- **Environment:** <branch, dirty tree, services — or omit>
- **Preferences (this session):** <user constraints from chat — or omit>

## Decisions and constraints

- <must-not-reverse decisions>
- **Rejected / failed:** <approach → why — or omit>

## Links

- Plan / PRD: <path>
- ADR: <path>
- Issue: <path>
- PR / diff: <path>

## Blockers and open questions

- <or "None">

## Next actions (ordered)

1. ...
2. ...

## Suggested skills

- `/skill-name` — why
```

## Fallback

Only if user requests private/off-workspace handoff: write to OS temp via `mktemp` and state file is outside workspace.
