# Notion Task Tracker — Reference

## MCP server

**`ukil-notion`** — local PAT server at `tools/ukil-notion-mcp/`

| Setting | Value |
|---------|-------|
| Config | `.cursor/mcp.json` (from `npm run setup` in `tools/ukil-notion-mcp`) |
| Token | `NOTION_TOKEN` in repo-root `.env` |
| Data source | `UKIL_NOTION_DATA_SOURCE_ID` or default `76fba887-9eb4-832f-849e-87d0cf064c9c` |

Call tools via MCP server name **`ukil-notion`**. Tool names match the table below.

## Key tools

| Tool | Use |
|------|-----|
| `notion-fetch` | `id: "self"`, database/page ids, verify updates |
| `notion-search` | Find tasks by title |
| `notion-create-pages` | New task in data source |
| `notion-update-page` | `update_properties`, `update_content`, `insert_content` |
| `notion-create-attachment` | Upload screenshot via `source_url` |

## Ukil Tasks Tracker schema

**Title property:** `Task name`  
**Data source:** `collection://76fba887-9eb4-832f-849e-87d0cf064c9c`

| Property | Type | Update format |
|----------|------|---------------|
| Task name | title | string |
| Description | text | string |
| Status | status | `Not started`, `In progress`, `Done` |
| Assignee | person | JSON array of user UUIDs: `"[\"uuid\"]"` |
| Due date | date | `date:Due date:start`, `date:Due date:is_datetime: 0` |
| Priority | select | `High`, `Medium`, `Low` |
| Effort level | select | `Small`, `Medium`, `Large` |
| Task type | multi_select | JSON array: `"[\"🐞 Bug\"]"`, `"[\"💬 Feature request\"]"`, `"[\"💅 Polish\"]"` |
| Parent task | relation | JSON array with one page URL |
| Sub-task | relation | Usually auto-managed from parent side |

## Assignee

Always resolve from:

```
notion-fetch { "id": "self" }
```

Use `self.user.id` in Assignee property. Do not guess email or name.

## Parent / subtask URLs

Page URL form: `https://app.notion.com/p/<id-without-dashes>`

Relation property expects JSON array of URLs:

```json
"Parent task": "[\"https://app.notion.com/p/394ba8879eb4800aa1bee61704120d64\"]"
```

## Image upload response

`notion-create-attachment` returns:

- `file_upload_id` — use in `<image src="file-upload://...">`
- `suggested_markdown` — safe to paste into page content

Attach within ~1 hour; unattached uploads expire.

## Common parent tasks (Ukil)

Search by name — do not hardcode unless confirmed:

- **Cases Page Update Requirements** — matters/cases page work
- **Clients Page Update Requirements** — clients page work

## Pitfalls

1. **`update_content` old_str must match exactly** — fetch page first
2. **Pages with screenshots only** — no default template text; use `insert_content`
3. **`useSearchParams` pages** — screenshot may need JS click to open modals
4. **0x0.st** — often disabled; use litterbox.catbox.moe for temp PNG hosting
5. **Do not commit** `docs/screenshots/` unless user asks — local capture aid only
