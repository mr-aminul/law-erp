import { Client } from "@notionhq/client";
import { getNotionToken } from "./env.mjs";

let client;

export function getClient() {
  if (!client) {
    client = new Client({ auth: getNotionToken() });
  }
  return client;
}

export function normalizeId(id) {
  const trimmed = id.trim();
  if (trimmed === "self") return "self";

  const uuidMatch = trimmed.match(
    /([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})/i
  );
  if (uuidMatch) {
    const raw = uuidMatch[1].replace(/-/g, "");
    return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
  }

  return trimmed;
}

export function pageUrl(pageId) {
  const compact = pageId.replace(/-/g, "");
  return `https://app.notion.com/p/${compact}`;
}

export function extractPlainText(richText = []) {
  return richText.map((part) => part.plain_text ?? "").join("");
}

export function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function relationIdFromValue(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/([0-9a-f]{32})/i);
  if (!match) return null;
  const raw = match[1];
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

export function toNotionProperties(rawProperties = {}) {
  const properties = {};

  for (const [key, value] of Object.entries(rawProperties)) {
    if (value == null) continue;

    if (key.startsWith("date:")) {
      const [, propName, field] = key.split(":");
      if (field === "start") {
        properties[propName] = { date: { start: value } };
      }
      continue;
    }

    if (key === "Task name" || key === "title" || key === "Name") {
      properties[key === "Task name" ? "Task name" : key] = {
        title: [{ text: { content: String(value) } }],
      };
      continue;
    }

    if (key === "Description") {
      properties.Description = {
        rich_text: [{ text: { content: String(value) } }],
      };
      continue;
    }

    if (key === "Status") {
      properties.Status = { status: { name: String(value) } };
      continue;
    }

    if (key === "Priority" || key === "Effort level") {
      properties[key] = { select: { name: String(value) } };
      continue;
    }

    if (key === "Assignee") {
      const ids = parseJsonArray(value);
      properties.Assignee = {
        people: ids.map((id) => ({ id: normalizeId(id) })),
      };
      continue;
    }

    if (key === "Task type") {
      const names = parseJsonArray(value).map(String);
      properties["Task type"] = {
        multi_select: names.map((name) => ({ name })),
      };
      continue;
    }

    if (key === "Parent task" || key === "Sub-task") {
      const entries = parseJsonArray(value);
      const relations = entries
        .map((entry) => relationIdFromValue(String(entry)))
        .filter(Boolean)
        .map((id) => ({ id }));
      if (relations.length > 0) {
        properties[key] = { relation: relations };
      }
      continue;
    }

    if (typeof value === "string") {
      properties[key] = {
        rich_text: [{ text: { content: value } }],
      };
    }
  }

  return properties;
}

export function markdownToBlocks(markdown = "") {
  if (!markdown.trim()) return [];

  return markdown.split("\n\n").flatMap((chunk) => {
    const trimmed = chunk.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("## ")) {
      return [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: trimmed.slice(3) } }],
          },
        },
      ];
    }

    if (trimmed.startsWith("# ")) {
      return [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{ type: "text", text: { content: trimmed.slice(2) } }],
          },
        },
      ];
    }

    if (trimmed.startsWith("- ")) {
      return trimmed.split("\n").map((line) => ({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: line.slice(2) } }],
        },
      }));
    }

    return [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: trimmed } }],
        },
      },
    ];
  });
}

export async function fetchPageMarkdown(pageId) {
  const notion = getClient();
  const page = await notion.pages.retrieve({ page_id: pageId });
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  const lines = [`<page url="${pageUrl(pageId)}">`];

  if ("properties" in page) {
    for (const [name, prop] of Object.entries(page.properties)) {
      if (prop.type === "title") {
        lines.push(`# ${extractPlainText(prop.title)}`);
      }
    }
  }

  for (const block of blocks.results) {
    if (block.type === "heading_2") {
      lines.push(`## ${extractPlainText(block.heading_2.rich_text)}`);
    } else if (block.type === "heading_1") {
      lines.push(`# ${extractPlainText(block.heading_1.rich_text)}`);
    } else if (block.type === "paragraph") {
      const text = extractPlainText(block.paragraph.rich_text);
      if (text) lines.push(text);
    } else if (block.type === "bulleted_list_item") {
      lines.push(`- ${extractPlainText(block.bulleted_list_item.rich_text)}`);
    }
  }

  lines.push("</page>");
  return { page, markdown: lines.join("\n\n") };
}
