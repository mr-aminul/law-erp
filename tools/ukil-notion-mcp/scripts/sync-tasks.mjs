#!/usr/bin/env node
/**
 * One-off sync helper — updates Ukil Tasks Tracker via Notion REST API (curl-friendly env).
 * Usage: node scripts/sync-tasks.mjs
 */
import { config } from "dotenv";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: resolve(repoRoot, ".env") });

const TOKEN = process.env.NOTION_TOKEN;
const ASSIGNEE = "6fcff4d4-afe1-4fb8-9d6a-263c0c248789";
const DUE = "2026-07-09";
const DB = "901ba887-9eb4-836b-88e5-81e85ddaf1aa";
const PARENT_EPIC = "394ba887-9eb4-800a-a1be-e61704120d64";

function api(method, path, body) {
  const args = [
    "-sS",
    "-H",
    `Authorization: Bearer ${TOKEN}`,
    "-H",
    "Notion-Version: 2022-06-28",
    "-H",
    "Content-Type: application/json",
    "-X",
    method,
    `https://api.notion.com/v1${path}`,
  ];
  if (body) args.push("-d", JSON.stringify(body));
  const out = execSync(`curl ${args.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(" ")}`, {
    encoding: "utf8",
  });
  const parsed = JSON.parse(out);
  if (parsed.object === "error") {
    throw new Error(`${path}: ${parsed.message}`);
  }
  return parsed;
}

function props({ description, taskType = "Feature request", effort = "Small", priority = "Medium", parent = PARENT_EPIC }) {
  return {
    Status: { status: { name: "Done" } },
    Description: { rich_text: [{ text: { content: description.slice(0, 2000) } }] },
    Assignee: { people: [{ id: ASSIGNEE }] },
    "Due date": { date: { start: DUE } },
    Priority: { select: { name: priority } },
    "Effort level": { select: { name: effort } },
    "Task type": { multi_select: [{ name: taskType }] },
    "Parent task": { relation: [{ id: parent }] },
  };
}

function blocksFromMarkdown(md) {
  const lines = md.split("\n");
  const blocks = [];
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: paragraph.join("\n") } }] },
      });
      paragraph = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] },
      });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] },
      });
    } else if (line.startsWith("![") || line.startsWith("<image")) {
      flushParagraph();
      const urlMatch = line.match(/https?:\/\/[^\s"')]+/);
      if (urlMatch) {
        blocks.push({
          object: "block",
          type: "image",
          image: { type: "external", external: { url: urlMatch[0] } },
        });
      }
    } else if (line.trim() === "") {
      flushParagraph();
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
  return blocks;
}

async function replaceBody(pageId, markdown) {
  const existing = api("GET", `/blocks/${pageId}/children?page_size=100`);
  for (const block of existing.results) {
    api("DELETE", `/blocks/${block.id}`);
  }
  const children = blocksFromMarkdown(markdown);
  if (children.length) {
    api("PATCH", `/blocks/${pageId}/children`, { children });
  }
}

async function updateTask(pageId, description, bodyMarkdown, extraProps = {}) {
  api("PATCH", `/pages/${pageId}`, {
    properties: { ...props({ description }), ...extraProps },
  });
  await replaceBody(pageId, bodyMarkdown);
  return `https://app.notion.com/p/${pageId.replace(/-/g, "")}`;
}

async function createTask(title, description, bodyMarkdown, opts = {}) {
  const page = api("POST", "/pages", {
    parent: { database_id: DB },
    properties: {
      "Task name": { title: [{ text: { content: title } }] },
      ...props({
        description,
        taskType: opts.taskType ?? "Feature request",
        effort: opts.effort ?? "Medium",
        priority: opts.priority ?? "Medium",
        parent: opts.parent ?? PARENT_EPIC,
      }),
    },
  });
  await replaceBody(page.id, bodyMarkdown);
  return `https://app.notion.com/p/${page.id.replace(/-/g, "")}`;
}

const TASKS = [
  {
    id: "395ba887-9eb4-809c-9613-dd1cdf835ffd",
    description:
      "Renamed Cases to Matters in sidebar navigation and config. Files: Sidebar.tsx, navigation.ts, CasesContent.tsx.",
    body: `## Task description
Sidebar and nav label now reads **Matters** instead of Cases, matching product terminology.

**Files**
- apps/web/components/layout/Sidebar.tsx
- apps/web/lib/config/navigation.ts
- apps/web/app/(dashboard)/cases/CasesContent.tsx

**Routes:** /cases (Matters list) — mock data only.`,
  },
  {
    id: "394ba887-9eb4-8046-88e9-ff49d4849463",
    description:
      "Multi-select status/type/lawyer filters, search bar moved right beside New Matter button, CasesContent extracted. Files: CasesContent.tsx, MultiSelectDropdown.tsx.",
    body: `## Task description
Matters list toolbar: multi-select filters for status, case type, and lawyer; search input aligned right next to **New Matter**; table extracted to CasesContent with Suspense wrapper.

**Files**
- apps/web/app/(dashboard)/cases/CasesContent.tsx
- apps/web/app/(dashboard)/cases/page.tsx
- apps/web/components/ui/MultiSelectDropdown.tsx`,
  },
  {
    id: "394ba887-9eb4-80cc-af6e-d397b62d9419",
    description: "Client name in matters table links to client profile. Files: CasesContent.tsx.",
    body: `## Task description
Clicking client name in the matters table navigates to \`/clients/{id}\` without triggering row navigation.

**Files**
- apps/web/app/(dashboard)/cases/CasesContent.tsx`,
  },
  {
    id: "394ba887-9eb4-808d-94e5-f180831c6e56",
    description:
      "AssignedLawyers component shows lawyer avatars/initials in matters table. Files: AssignedLawyers.tsx, CasesContent.tsx.",
    body: `## Task description
Assigned lawyers column displays stacked avatars with initials instead of plain text names.

**Files**
- apps/web/components/cases/AssignedLawyers.tsx
- apps/web/app/(dashboard)/cases/CasesContent.tsx`,
  },
  {
    id: "394ba887-9eb4-8076-b8b8-e2566aae3a19",
    description:
      "Inline CaseStatusSelect in table; removed New status from CASE_STATUSES. Files: CaseStatusSelect.tsx, caseStatus.ts.",
    body: `## Task description
Status is editable inline via portal dropdown with auto flip above/below. Removed **New** from case status enum.

**Files**
- apps/web/components/cases/CaseStatusSelect.tsx
- apps/web/lib/utils/caseStatus.ts
- apps/web/lib/mock/data.ts`,
  },
  {
    id: "395ba887-9eb4-80ab-b758-cadcff21727e",
    description:
      "Full Pagination component with page numbers, jump-to-page, page size selector; default 15/page. Files: Pagination.tsx, pagination.ts, CasesContent.tsx.",
    body: `## Task description
Replaced basic prev/next with reusable Pagination — first/prev/numbered pages/next/last, items-per-page dropdown, jump input when >5 pages. Default page size 15.

**Files**
- apps/web/components/ui/Pagination.tsx
- apps/web/lib/utils/pagination.ts
- apps/web/app/(dashboard)/cases/CasesContent.tsx`,
  },
  {
    id: "397ba887-9eb4-81ac-beba-d4aabe0534ab",
    description:
      "UserSearchPicker with type-to-search, chips for selected lawyers in NewCaseForm. Files: UserSearchPicker.tsx, UserChip.tsx, NewCaseForm.tsx.",
    body: `## Task description
Assign lawyers via searchable picker — filter by name, role, or email; selected users shown as removable chips.

**Files**
- apps/web/components/ui/UserSearchPicker.tsx
- apps/web/components/ui/UserChip.tsx
- apps/web/components/cases/NewCaseForm.tsx`,
  },
  {
    id: "394ba887-9eb4-801f-b342-f6bfedf66177",
    description:
      "New matter opens in modal on /cases?new=1; /cases/new redirects. Files: CasesContent.tsx, cases/new/page.tsx, Modal.tsx.",
    body: `## Task description
**New Matter** opens a modal on the matters list page. URL param \`?new=1\` deep-links the modal; legacy \`/cases/new\` redirects.

**Files**
- apps/web/app/(dashboard)/cases/CasesContent.tsx
- apps/web/app/(dashboard)/cases/new/page.tsx
- apps/web/components/ui/Modal.tsx`,
  },
  {
    id: "394ba887-9eb4-8006-be57-dcf2f3bcc6b8",
    description: "NewCaseForm supports inline create-new-client option. Files: NewCaseForm.tsx.",
    body: `## Task description
Client select includes **+ Create new client** with conditional name field.

**Files**
- apps/web/components/cases/NewCaseForm.tsx`,
  },
  {
    id: "394ba887-9eb4-80b6-996b-ebd58095c1b8",
    description: "NewCaseForm supports custom case type creation. Files: NewCaseForm.tsx.",
    body: `## Task description
Case type select includes **+ Create new type** with free-text input for custom types.

**Files**
- apps/web/components/cases/NewCaseForm.tsx`,
  },
  {
    id: "395ba887-9eb4-803f-82ae-ecd13a9bb4e3",
    description:
      "Upload Document modal on case detail Documents tab. Files: UploadDocumentForm.tsx, cases/[id]/page.tsx.",
    body: `## Task description
**Upload Document** button opens modal with UploadDocumentForm on case detail Documents tab.

**Files**
- apps/web/components/cases/UploadDocumentForm.tsx
- apps/web/app/(dashboard)/cases/[id]/page.tsx`,
  },
  {
    id: "394ba887-9eb4-805b-b9a2-e577e39695ed",
    description: 'Case detail field label renamed from "Limitation Date" to "Deadline". Files: cases/[id]/page.tsx.',
    body: `## Task description
Overview tab shows **Deadline** instead of Limitation Date for limitationDate field.

**Files**
- apps/web/app/(dashboard)/cases/[id]/page.tsx`,
  },
];

const CREATES = [
  {
    title: "Notification drawer and bell in sidebar",
    taskType: "Feature request",
    effort: "Medium",
    description:
      "Sidebar notification bell with unread badge and slide-out drawer with tabs, read/dismiss. Files: NotificationBell.tsx, NotificationDrawer.tsx, NotificationPanel.tsx.",
    body: `## Task description
Notification bell in sidebar header (expanded + collapsed). Drawer slides from sidebar edge with filter tabs, expand/collapse items, mark read, dismiss, refresh. Zustand store + mock notifications.

**Files**
- apps/web/components/layout/NotificationBell.tsx
- apps/web/components/layout/NotificationDrawer.tsx
- apps/web/components/notifications/NotificationPanel.tsx
- apps/web/lib/store/notificationStore.ts
- apps/web/lib/mock/notifications.ts
- apps/web/components/layout/Shell.tsx
- apps/web/components/layout/Sidebar.tsx`,
  },
  {
    title: "Design system polish — status tokens and surface styling",
    taskType: "Polish",
    effort: "Medium",
    description:
      "Status color surface pairs, bg-surface migration, sidebar logo insets, StatCard icons. Files: design/theme.css, StatCard.tsx, multiple pages.",
    body: `## Task description
Modern status foreground/surface pairs in theme.css; pages migrated from bg-white to bg-surface; sidebar logo inset tokens; dashboard StatCards show lucide icons; Table/Dropdown/Modal refinements.

**Files**
- design/theme.css
- design/tokens.css
- design/tailwind.preset.js
- apps/web/components/dashboard/StatCard.tsx
- apps/web/app/(dashboard)/page.tsx
- Multiple dashboard pages (clients, staff, billing, calendar)`,
  },
  {
    title: "Notion task tracker skill and ukil-notion MCP server",
    taskType: "Feature request",
    effort: "Small",
    parent: PARENT_EPIC,
    description:
      "Agent skill /notion-task-tracker plus local Notion MCP at tools/ukil-notion-mcp using PAT from .env.",
    body: `## Task description
Added notion-task-tracker skill for syncing git changes to Ukil Tasks Tracker. Local MCP server (tools/ukil-notion-mcp) uses NOTION_TOKEN from repo-root .env; setup via npm run setup writes .cursor/mcp.json.

**Files**
- .agents/skills/notion-task-tracker/
- tools/ukil-notion-mcp/
- .env.example
- AGENTS.md`,
  },
];

const results = [];

for (const task of TASKS) {
  try {
    const url = await updateTask(task.id, task.description, task.body);
    results.push({ title: task.id, action: "Updated", url, ok: true });
    console.log("OK update", task.id, url);
  } catch (e) {
    results.push({ title: task.id, action: "Update failed", error: e.message, ok: false });
    console.error("FAIL", task.id, e.message);
  }
}

for (const task of CREATES) {
  try {
    const url = await createTask(task.title, task.description, task.body, task);
    results.push({ title: task.title, action: "Created", url, ok: true });
    console.log("OK create", task.title, url);
  } catch (e) {
    results.push({ title: task.title, action: "Create failed", error: e.message, ok: false });
    console.error("FAIL create", task.title, e.message);
  }
}

console.log("\n--- SUMMARY ---");
console.log(JSON.stringify(results, null, 2));
