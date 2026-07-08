# Notion Task Tracker — Examples

## Example: Full `/notion-task-tracker` run

**Context:** User implemented UserSearchPicker + Pagination in `apps/web/`. Uncommitted changes on branch.

### Phase 1 — Read changes

```bash
git status --short
git diff
git diff --cached
```

**Work items inferred:**

| # | Title | Files | UI? |
|---|-------|-------|-----|
| 1 | Assign lawyers searchable user picker | `UserSearchPicker.tsx`, `NewCaseForm.tsx` | Yes |
| 2 | Enhanced matters list pagination | `Pagination.tsx`, `pagination.ts`, `CasesContent.tsx` | Yes |

### Phase 2 — Match in Notion

- Search `"Assign lawyers"` → found existing task → **update**
- Search `"pagination"` → no exact match → **create** under `Cases Page Update Requirements`

### Phase 3 — Propose (wait for user)

Present plan table → **ask permission** → do not write to Notion yet.

### Phase 4 — Apply updates

For each approved row: all fields + description + screenshots.

### Phase 5 — User reply (after sync)

```markdown
Synced 2 tasks to **Ukil Tasks Tracker** (approved).

| Task | Action | Status | Screenshot | Link |
|------|--------|--------|------------|------|
| Assign lawyers searchable user picker in new case form | Updated | Done | Yes | [Open](https://app.notion.com/p/397ba8879eb481acbebad4aabe0534ab) |
| Enhanced matters list pagination controls | Created | Done | Yes | [Open](https://app.notion.com/p/...) |
```

### Example: Proposed plan (before permission)

```markdown
**Proposed Notion sync** — review and confirm:

| Task | Action | Status | Screenshot | Notion match |
|------|--------|--------|------------|--------------|
| Assign lawyers searchable user picker | Update | Done | Yes | [Existing](https://app.notion.com/p/397ba887...) |
| Enhanced matters list pagination | Create | Done | Yes | New → parent: Cases Page Update Requirements |

**Descriptions (preview)**
- UserSearchPicker: type-to-search assign lawyers, chips — `UserSearchPicker.tsx`, `NewCaseForm.tsx`
- Pagination: page numbers, jump-to-page, always visible — `Pagination.tsx`, `CasesContent.tsx`

Proceed with these Notion updates?
```

---

## Example: Backend-only change (no screenshot)

**Work item:** Fix dashboard stats query in `getDashboard.ts` — no UI.

- Match or create task
- Update all fields + description (mention GraphQL fallback behavior)
- Screenshot column: **N/A**
- Summary table row: `Screenshot | N/A`

---

## Example: Create payload

```json
{
  "parent": { "type": "data_source_id", "data_source_id": "76fba887-9eb4-832f-849e-87d0cf064c9c" },
  "pages": [{
    "properties": {
      "Task name": "Enhanced matters list pagination controls",
      "Description": "Replaced basic Prev/Next with full Pagination component — page numbers, jump-to-page, always visible. Files: Pagination.tsx, CasesContent.tsx.",
      "Status": "Done",
      "Assignee": "[\"6fcff4d4-afe1-4fb8-9d6a-263c0c248789\"]",
      "Priority": "Medium",
      "Effort level": "Small",
      "Task type": "[\"💬 Feature request\"]",
      "Parent task": "[\"https://app.notion.com/p/394ba8879eb4800aa1bee61704120d64\"]",
      "date:Due date:start": "2026-07-09",
      "date:Due date:is_datetime": 0
    },
    "content": "## Task description\nAdded reusable Pagination UI with first/prev/numbered pages/next/last, jump input, and always-visible footer on Matters list.\n\n**Files**\n- `apps/web/components/ui/Pagination.tsx`\n- `apps/web/lib/utils/pagination.ts`\n- `apps/web/app/(dashboard)/cases/CasesContent.tsx`"
  }]
}
```

---

## Example: Multiple work items from one diff

A single commit touching rename + status removal + modal might map to **three** Notion tasks if three separate subtasks already exist under the parent epic. Sync each independently; one summary table row per task.

Do **not** merge unrelated Notion tasks into one update unless the code change is truly one feature.
