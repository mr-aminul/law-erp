#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getDefaultDataSourceId, getNotionToken } from "./lib/env.mjs";
import {
  fetchPageMarkdown,
  getClient,
  markdownToBlocks,
  normalizeId,
  pageUrl,
  toNotionProperties,
} from "./lib/notion.mjs";

getNotionToken();

const server = new McpServer({
  name: "ukil-notion",
  version: "1.0.0",
});

server.tool(
  "notion-fetch",
  "Fetch a Notion page, database, or the authenticated user (id: self).",
  {
    id: z.string().describe("Page/database UUID, notion.so URL, or 'self'"),
  },
  async ({ id }) => {
    const notion = getClient();
    const normalized = normalizeId(id);

    if (normalized === "self") {
      const user = await notion.users.me({});
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                self: {
                  workspace: { name: "Ukil (PAT)" },
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.person?.email ?? null,
                  },
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }

    try {
      const { page, markdown } = await fetchPageMarkdown(normalized);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ page, markdown }, null, 2),
          },
        ],
      };
    } catch {
      const database = await notion.databases.retrieve({
        database_id: normalized,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                database,
                data_source_url: `collection://${normalized}`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  }
);

server.tool(
  "notion-search",
  "Search Notion pages. Optionally scope to a database/data source.",
  {
    query: z.string(),
    data_source_url: z
      .string()
      .optional()
      .describe("Optional collection:// UUID to search within"),
    page_size: z.number().int().min(1).max(25).optional(),
  },
  async ({ query, data_source_url, page_size = 10 }) => {
    const notion = getClient();
    const filter = data_source_url
      ? {
          value: "page",
          property: "object",
        }
      : undefined;

    const databaseId = data_source_url?.replace("collection://", "");
    const response = await notion.search({
      query,
      page_size,
      filter,
      sort: { direction: "descending", timestamp: "last_edited_time" },
    });

    const results = response.results
      .filter((item) => {
        if (!databaseId) return true;
        if (!("parent" in item)) return false;
        return (
          item.parent.type === "database_id" &&
          item.parent.database_id === normalizeId(databaseId)
        );
      })
      .map((item) => ({
        id: item.id,
        url: pageUrl(item.id),
        object: item.object,
        last_edited_time: item.last_edited_time,
        title:
          "properties" in item
            ? Object.values(item.properties).find((p) => p.type === "title")
            : null,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify({ results }, null, 2) }],
    };
  }
);

server.tool(
  "notion-create-pages",
  "Create one or more pages in the Ukil Tasks Tracker database.",
  {
    parent: z
      .object({
        type: z.enum(["data_source_id", "page_id"]).optional(),
        data_source_id: z.string().optional(),
        page_id: z.string().optional(),
      })
      .optional(),
    pages: z.array(
      z.object({
        properties: z.record(z.union([z.string(), z.number(), z.null()])),
        content: z.string().optional(),
      })
    ),
  },
  async ({ parent, pages }) => {
    const notion = getClient();
    const parentConfig = parent?.data_source_id
      ? { database_id: normalizeId(parent.data_source_id) }
      : parent?.page_id
        ? { page_id: normalizeId(parent.page_id) }
        : { database_id: getDefaultDataSourceId() };

    const created = [];

    for (const page of pages) {
      const properties = toNotionProperties(page.properties);
      const children = page.content ? markdownToBlocks(page.content) : [];

      const response = await notion.pages.create({
        parent: parentConfig,
        properties,
        children: children.length > 0 ? children : undefined,
      });

      created.push({
        id: response.id,
        url: pageUrl(response.id),
      });
    }

    return {
      content: [{ type: "text", text: JSON.stringify({ created }, null, 2) }],
    };
  }
);

server.tool(
  "notion-update-page",
  "Update page properties or append content blocks.",
  {
    page_id: z.string(),
    command: z.enum([
      "update_properties",
      "insert_content",
      "update_content",
      "replace_content",
    ]),
    properties: z
      .record(z.union([z.string(), z.number(), z.null()]))
      .optional(),
    content: z.string().optional(),
    content_updates: z
      .array(
        z.object({
          old_str: z.string(),
          new_str: z.string(),
        })
      )
      .optional(),
  },
  async ({ page_id, command, properties, content, content_updates }) => {
    const notion = getClient();
    const id = normalizeId(page_id);

    if (command === "update_properties" && properties) {
      await notion.pages.update({
        page_id: id,
        properties: toNotionProperties(properties),
      });
    }

    if (command === "insert_content" && content) {
      await notion.blocks.children.append({
        block_id: id,
        children: markdownToBlocks(content),
      });
    }

    if (
      (command === "update_content" || command === "replace_content") &&
      (content_updates?.length || content)
    ) {
      const { markdown } = await fetchPageMarkdown(id);
      let next = markdown;

      if (command === "replace_content" && content) {
        next = content;
      } else if (content_updates) {
        for (const update of content_updates) {
          if (!next.includes(update.old_str)) {
            throw new Error(`Could not find content snippet: ${update.old_str}`);
          }
          next = next.replace(update.old_str, update.new_str);
        }
      }

      const blocks = await notion.blocks.children.list({ block_id: id });
      for (const block of blocks.results) {
        await notion.blocks.delete({ block_id: block.id });
      }
      const children = markdownToBlocks(next);
      if (children.length > 0) {
        await notion.blocks.children.append({ block_id: id, children });
      }
    }

    const verified = await fetchPageMarkdown(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { page_id: id, url: pageUrl(id), markdown: verified.markdown },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.tool(
  "notion-create-attachment",
  "Register an external image URL for embedding in page content.",
  {
    filename: z.string(),
    source_url: z.string().url(),
  },
  async ({ filename, source_url }) => {
    const file_upload_id = `external-${Date.now()}`;
    const suggested_markdown = `<image src="${source_url}" alt="${filename}"></image>`;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              file_upload_id,
              filename,
              source_url,
              suggested_markdown,
              note: "Use insert_content with the suggested_markdown under ## Screenshot",
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
