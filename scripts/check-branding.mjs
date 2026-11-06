#!/usr/bin/env node
// Guard the WhiteboardRT Server surface against stale upstream names.
// Attribution in README.md, LICENSE, and THIRD_PARTY_NOTICES.md is
// intentionally out of scope.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = [
  "package.json",
  "yarn.lock",
  "docker-compose.yml",
  "Dockerfile",
  "pm2.json",
  "pm2.production.json",
  ".github/workflows/ci.yml",
];

const walk = (current) => {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".ts")) {
      files.push(path.relative(root, full));
    }
  }
};

walk(path.join(root, "src"));

const forbidden = [
  /excalidraw-room/i,
  /excalidraw-collab/i,
  /excalidraw-portal/i,
  /portal\.excalidraw\.com/i,
  /Excalidraw collaboration server/i,
];

let failed = false;
for (const file of [...new Set(files)]) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const contents = fs.readFileSync(full, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(contents)) {
      process.stderr.write(`${file}: matched ${pattern}\n`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

process.stdout.write("branding checks passed\n");
