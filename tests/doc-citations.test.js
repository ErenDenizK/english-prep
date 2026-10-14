// Every `docs/...` path that code cites must exist. Comments cite the doc a
// behaviour comes from (CLAUDE.md, conventions); a citation to a file that
// moved to docs/history/ sends the next reader nowhere.
//
// Only literal paths are checked: a path followed by `*`, `<`, `$` or `{`
// is a pattern or a template, not a citation.

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCES = ["js", "css", "about", "tools", "sw.js"];
const TEXT = /\.(?:m?js|css|html|py|sh)$/;

// Paths code writes rather than cites: they exist once the tool has run.
const OUTPUTS = new Set(["docs/audit/solve-log.json"]);

function files(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return [];
  if (statSync(full).isFile()) return TEXT.test(path) ? [path] : [];
  return readdirSync(full).flatMap((name) => files(join(path, name)));
}

test("every docs/ path cited in js, css, about, tools and sw.js exists", () => {
  const missing = [];
  let checked = 0;
  for (const file of SOURCES.flatMap(files)) {
    const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
    lines.forEach((line, index) => {
      for (const match of line.matchAll(/docs\/[\w./-]*\w/g)) {
        const next = line[match.index + match[0].length];
        if (next && "*<${".includes(next)) continue;
        const path = match[0];
        if (OUTPUTS.has(path)) continue;
        checked += 1;
        if (!existsSync(join(ROOT, path))) {
          missing.push(`${relative(ROOT, join(ROOT, file))}:${index + 1} ${path}`);
        }
      }
    });
  }
  assert.ok(checked > 0, "the scan found citations to check");
  assert.deepEqual(missing, [], `cited docs that do not exist:\n${missing.join("\n")}`);
});
