import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");

for (const envPath of [
  resolve(repoRoot, ".env"),
  resolve(repoRoot, ".env.local"),
]) {
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}

export function getNotionToken() {
  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "NOTION_TOKEN is missing. Copy .env.example to .env and add your Notion personal access token."
    );
  }
  return token;
}

export function getDefaultDataSourceId() {
  return (
    process.env.UKIL_NOTION_DATA_SOURCE_ID?.trim() ||
    "76fba887-9eb4-832f-849e-87d0cf064c9c"
  );
}

export const REPO_ROOT = repoRoot;
