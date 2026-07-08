#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const cursorDir = resolve(repoRoot, ".cursor");
const envPath = resolve(repoRoot, ".env");
const envExamplePath = resolve(repoRoot, ".env.example");
const mcpExamplePath = resolve(__dirname, "../mcp.json.example");
const mcpPath = resolve(cursorDir, "mcp.json");

mkdirSync(cursorDir, { recursive: true });
copyFileSync(mcpExamplePath, mcpPath);

if (!existsSync(envPath)) {
  if (existsSync(envExamplePath)) {
    copyFileSync(envExamplePath, envPath);
    console.log("Created .env from .env.example — add NOTION_TOKEN.");
  } else {
    writeFileSync(
      envPath,
      "NOTION_TOKEN=\nUKIL_NOTION_DATA_SOURCE_ID=76fba887-9eb4-832f-849e-87d0cf064c9c\n"
    );
    console.log("Created .env — add NOTION_TOKEN.");
  }
} else {
  console.log(".env already exists — left unchanged.");
}

const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
console.log("\nUkil Notion MCP configured:");
console.log(`  MCP config: ${mcpPath}`);
console.log(`  Server:     ${mcp.mcpServers["ukil-notion"].command}`);
console.log("\nRestart Cursor (or reload MCP) to pick up the new server.");
