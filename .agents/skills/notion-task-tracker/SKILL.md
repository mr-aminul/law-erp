---
name: notion-task-tracker
description: Sync local code changes to Cosmos Notion Ukil Tasks Tracker — read git diff, match or create tasks, propose a sync plan for user approval, then fill all fields and attach UI screenshots. Use when the user invokes /notion-task-tracker or asks to log/sync Notion tasks after work.
disable-model-invocation: true
---

# Notion Task Tracker (Ukil)

Invoke with **`/notion-task-tracker`**. Uses the project-local **`ukil-notion`** MCP (`tools/ukil-notion-mcp/`).

**Setup (once):** `cd tools/ukil-notion-mcp && npm install && npm run setup` — then restart Cursor. Token lives in repo-root `.env` as `NOTION_TOKEN`.

**Default database:** Cosmos → **Ukil Tasks Tracker**  
**Data source ID:** `76fba887-9eb4-832f-849e-87d0cf064c9c`

Server: `ukil-notion` — tools `notion-fetch`, `notion-search`, `notion-create-pages`, `notion-update-page`, `notion-create-attachment`. Details: [reference.md](reference.md).

---

## How it works when called

Run these four phases **in order**. Do not skip phase 1.

### Phase 1 — Read the changes

Understand what the user actually did before touching Notion.

1. Run in parallel:
   - `git status --short`
   - `git diff` (unstaged)
   - `git diff --cached` (staged)
   - `git log -5 --oneline` (recent context)
2. If the branch diverged from main, also `git diff main...HEAD` for the full session scope.
3. Group changes into **logical work items** (one Notion task per distinct feature/fix).
   - Example: pagination component + CasesContent wiring = one task
   - Example: UserSearchPicker + NewCaseForm = one task
4. For each work item, note:
   - Short title (matches or suggests a Notion task name)
   - Files touched
   - **UI change?** → any change under `apps/web/` that affects what the user sees (components, pages, layout, styles)

If there are **no code changes** (user only wants to update Notion manually), use their message as the work item list instead.

### Phase 2 — Match tasks in Notion

For each work item:

1. `notion-fetch` `{ "id": "self" }` → assignee user id (once per run).
2. `notion-search` with keywords from the work item title.
3. **Match found** → use that page id.
4. **No match** → **create** a new task (see [Create task](#create-task)), then use the new id.
   - Infer parent epic from context (e.g. cases page work → search `Cases Page Update Requirements`).
   - Set `Parent task` when the work clearly belongs under an existing epic.

Search before creating — avoid duplicate tasks.

### Phase 3 — Propose sync plan (seek permission)

**Stop here.** Do not write to Notion until the user approves.

Present a **proposed sync plan** as a table:

```markdown
| Task | Action | Status | Screenshot | Notion match |
|------|--------|--------|------------|--------------|
| Assign lawyers user search | Update | Done | Yes | [Existing task](https://notion.so/...) |
| Enhanced pagination | Create | Done | Yes | No match — will create under Cases Page |
```

Columns:
- **Task** — proposed task name
- **Action** — `Update` or `Create`
- **Status** — value to set (usually `Done`)
- **Screenshot** — `Yes` / `No` / `N/A` (Yes for frontend/UI changes)
- **Notion match** — link to existing task, or note for new task (+ parent epic if known)

Below the table, briefly list per row:
- Description summary (1 line)
- Key files from the diff

Ask explicitly: **"Proceed with these Notion updates?"** (or similar). Wait for user confirmation.

- **User approves** → continue to Phase 4
- **User edits the plan** → adjust table, ask again
- **User declines** → stop; do not touch Notion

### Phase 4 — Apply updates in Notion

For **each approved** row in the plan:

Set **all applicable fields**:

| Field | Rule |
|-------|------|
| **Task name** | Keep existing title if good; refine only if misleading |
| **Description** | 1–2 sentences: what changed + key files |
| **Status** | As proposed (usually `Done`) |
| **Assignee** | Authenticated user from `self` |
| **Due date** | Today unless user specified otherwise |
| **Priority** | Infer or default `Medium` |
| **Effort level** | `Small` (single component) / `Medium` (multi-file feature) |
| **Task type** | `🐞 Bug` / `💬 Feature request` / `💅 Polish` — pick best fit |
| **Parent task** | Set when work is under a known epic |

**Page body** — always update `## Task description`:
- Behavior / UX change
- Files and routes touched
- Mock vs API if relevant

Use `notion-update-page`:
- `update_properties` for database fields
- `update_content` or `insert_content` for body (fetch page first for exact `old_str`)

**Screenshot — required for frontend/UI changes** (when Screenshot column = Yes):

1. Ensure dev server is up (`http://localhost:3000`).
2. Navigate to the affected screen; reproduce the change (open modal, type in search, etc.).
3. Capture a **focused** screenshot (the changed UI, not the whole desktop).
4. Upload → embed in page under `## Screenshot` (see [Screenshot pipeline](#screenshot-pipeline)).

Skip screenshot when column is `N/A` (pure backend/logic).

### Phase 5 — Confirm what was applied

After Notion writes succeed, post a short **completion summary** (same table shape, but with final Links):

```markdown
| Task | Action | Status | Screenshot | Link |
|------|--------|--------|------------|------|
| Assign lawyers user search | Updated | Done | Yes | [Open](https://notion.so/...) |
```

One row per task actually synced. Note any failures below the table.

---

## Checklist (full run)

```
Phase 1 — Changes
- [ ] git status + diff reviewed
- [ ] Work items listed (title, files, UI yes/no)

Phase 2 — Notion match
- [ ] self fetched (assignee id)
- [ ] Each work item searched in Notion
- [ ] Create vs update decided per item

Phase 3 — Propose (STOP — get permission)
- [ ] Proposed sync plan table shown to user
- [ ] User approved before any writes

Phase 4 — Apply
- [ ] All fields set per approved task
- [ ] Page body ## Task description written
- [ ] Screenshots captured for UI changes
- [ ] notion-fetch verify each task

Phase 5 — Confirm
- [ ] Completion summary table with final links
```

---

## Create task

**Parent:** `{ "type": "data_source_id", "data_source_id": "76fba887-9eb4-832f-849e-87d0cf064c9c" }`

**Properties on create:**

```json
{
  "Task name": "<title from work item>",
  "Description": "<short summary>",
  "Status": "Done",
  "Assignee": "[\"<user-id-from-self>\"]",
  "Priority": "Medium",
  "Effort level": "Small",
  "Task type": "[\"💬 Feature request\"]",
  "Parent task": "[\"https://app.notion.com/p/<parent-id>\"]",
  "date:Due date:start": "YYYY-MM-DD",
  "date:Due date:is_datetime": 0
}
```

Include `content` with `## Task description` on create. Add screenshot embed after upload if UI change.

---

## Screenshot pipeline

1. Save locally: `docs/screenshots/<slug>.png` (do not commit unless user asks)
2. Upload:
   ```bash
   curl -s -F "reqtype=fileupload" -F "time=72h" \
     -F "fileToUpload=@/tmp/<slug>.png" \
     https://litterbox.catbox.moe/resources/internals/api.php
   ```
3. `notion-create-attachment` → `{ "filename": "<slug>.png", "source_url": "<url>" }`
4. `insert_content` at end of page:
   ```markdown
   ## Screenshot
   <image src="file-upload://<file_upload_id>"></image>
   <one-line caption>
   ```

Prefer page body embed over `Attach file` property (often fails).

---

## Defaults

| Field | Default |
|-------|---------|
| Assignee | User from `notion-fetch` `"self"` |
| Due date | Today |
| Status after sync | `Done` |
| Task type | `💬 Feature request` |
| Priority | `Medium` |
| Effort | `Small` (UI tweak) / `Medium` (feature) |

---

## Additional reference

- Property formats & pitfalls: [reference.md](reference.md)
- Full examples including summary table: [examples.md](examples.md)
