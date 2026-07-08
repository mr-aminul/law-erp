# Ukil Notion MCP

Local [Model Context Protocol](https://modelcontextprotocol.io/) server for syncing work to **Ukil Tasks Tracker** in Notion using a **personal access token (PAT)**.

Replaces the Cursor Notion plugin when it is unavailable or timing out.

## Setup

1. Copy env template and add your PAT:

   ```bash
   cp .env.example .env
   # Edit .env — set NOTION_TOKEN=ntn_...
   ```

2. Install dependencies and register MCP with Cursor:

   ```bash
   cd tools/ukil-notion-mcp
   npm install
   npm run setup
   ```

3. **Restart Cursor** (or reload MCP servers) so `.cursor/mcp.json` is picked up.

The setup script writes `.cursor/mcp.json` (gitignored) pointing at this server. Token is read from repo-root `.env` only — never stored in MCP config.

## Tools

| Tool | Purpose |
|------|---------|
| `notion-fetch` | Page/database content; `id: "self"` for assignee user id |
| `notion-search` | Find tasks by keyword |
| `notion-create-pages` | Create tasks in Ukil Tasks Tracker |
| `notion-update-page` | Update properties or page body |
| `notion-create-attachment` | Image URL helper for screenshots |

Used by the `/notion-task-tracker` skill (`.agents/skills/notion-task-tracker/`).

## Verify

```bash
cd tools/ukil-notion-mcp
NOTION_TOKEN=ntn_... node -e "import('./lib/env.mjs').then(m => m.getNotionToken() && console.log('token ok'))"
```

## Security

- `.env` is gitignored — do not commit tokens
- Rotate your PAT if it was shared in chat or logs
- PAT scope = everything your Notion user can access
