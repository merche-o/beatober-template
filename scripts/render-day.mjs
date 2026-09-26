#!/usr/bin/env node
/**
 * Render one Beatober day.
 * Usage: npm run render:day -- 1
 *        npm run render:day -- 1 --auto-highlight
 *        npm run render:day -- 1 --offset 12.5
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
let day = null;
let autoHighlight = false;
let offset = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--auto-highlight" || a === "--autoHighlight") autoHighlight = true;
  else if (a === "--offset") offset = Number(args[++i]);
  else if (a === "--day") day = Number(args[++i]);
  else if (/^\d+$/.test(a) && day == null) day = Number(a);
}

if (!day || day < 1 || day > 31) {
  console.error(
    "Usage: npm run render:day -- <1-31> [--auto-highlight] [--offset SEC]",
  );
  process.exit(1);
}

const pad = String(day).padStart(2, "0");
const props = {
  day,
  autoHighlight,
  ...(offset != null && !Number.isNaN(offset)
    ? { startOffsetSec: offset }
    : {}),
};

const outDir = path.join(root, "out");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `day-${pad}.mp4`);
const propsFile = path.join(os.tmpdir(), `beatober-day-${pad}-props.json`);
fs.writeFileSync(propsFile, JSON.stringify(props));

const result = spawnSync(
  "npx",
  ["remotion", "render", "BeatoberReel", out, `--props=${propsFile}`, "--gl=angle"],
  { cwd: root, stdio: "inherit" },
);

process.exit(result.status ?? 1);
