// Canonical formatting for the content files.
//
// Content is written by several different sessions, and any of them that
// reads a topic file, changes one lesson and writes it back with
// JSON.stringify(data, null, 2) reformats every question in the file at
// the same time — a four-line diff arrives as four hundred. That happened
// once already, and "remember not to do that" is not a fix.
//
// So: one rule, applied by a command. An array of short strings stays on
// one line, because `["goes", "is going", "has gone", "went"]` is a single
// idea and four lines of it is worse to read and worse to review.
// Everything else expands at two spaces. `npm run validate` checks the
// files match, the same way a formatter check runs in any other project.
//
//   node tools/format-content.mjs          rewrites the files
//   node tools/format-content.mjs --check  exits 1 if any file differs

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = "data/manifest.json";

/**
 * One rule: a value whose parts are all *leaves* — primitives, or arrays of
 * primitives — goes on one line if it fits. So an option list, an example
 * pair and a forms row each read as the single idea they are, while a
 * lesson or a question, which contains structure, is stacked.
 *
 * 160 rather than 80, because these files are prose: several fields are
 * legitimately 200-character Turkish sentences, and a width that fights
 * that only produces a formatter nobody runs. What matters for review is
 * that one item is one line, not that lines are short.
 */
const INLINE_WIDTH = 160;

const INDENT = "  ";

const isPrimitive = (value) => value === null || typeof value !== "object";
const isLeaf = (value) =>
  isPrimitive(value) || (Array.isArray(value) && value.every(isPrimitive));

function compact(value) {
  if (Array.isArray(value)) {
    return `[${value.map(compact).join(", ")}]`;
  }
  if (value && typeof value === "object") {
    const body = Object.keys(value)
      .map((key) => `${JSON.stringify(key)}: ${compact(value[key])}`)
      .join(", ");
    return `{ ${body} }`;
  }
  return JSON.stringify(value);
}

/** True when the whole value can go on one line at this depth. */
function fitsInline(value, depth) {
  if (isPrimitive(value)) {
    return true;
  }
  const parts = Array.isArray(value) ? value : Object.values(value);
  if (parts.length === 0 || !parts.every(isLeaf)) {
    return false;
  }
  return INDENT.repeat(depth).length + compact(value).length <= INLINE_WIDTH;
}

/**
 * @param {unknown} value
 * @param {number} depth
 * @returns {string}
 */
function format(value, depth = 0) {
  if (isPrimitive(value)) {
    return JSON.stringify(value);
  }
  if (fitsInline(value, depth)) {
    return compact(value);
  }

  const pad = INDENT.repeat(depth);
  const padInner = INDENT.repeat(depth + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const entries = value.map((entry) => `${padInner}${format(entry, depth + 1)}`);
    return `[\n${entries.join(",\n")}\n${pad}]`;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return "{}";
  }
  const entries = keys.map(
    (key) => `${padInner}${JSON.stringify(key)}: ${format(value[key], depth + 1)}`
  );
  return `{\n${entries.join(",\n")}\n${pad}}`;
}

async function contentFiles() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, MANIFEST_PATH), "utf8"));
  const topicFiles = (manifest.topics ?? []).map((topic) => topic.file).filter(Boolean);
  // Topic files first: the manifest's lesson index is derived from them,
  // so it has to be written from their final contents.
  return [...topicFiles, MANIFEST_PATH];
}

/**
 * Copies each topic's lesson list — category and one-line summary, in
 * order — into the manifest.
 *
 * Generated rather than authored, because it is a duplicate and a
 * duplicate someone maintains by hand is a duplicate that drifts. It
 * exists so the Eğitim index, the Test tab, Profil and the results screen
 * can be built from the manifest alone: before this, rendering a list of
 * eighteen lesson names downloaded 141 KB of question data to show 1.7 KB
 * of information, and that cost grows linearly with the content.
 *
 * The validator checks it matches, so a topic file edited without running
 * the formatter fails the build rather than shipping a stale index.
 */
async function buildLessonIndex(manifest) {
  for (const topic of manifest.topics ?? []) {
    if (!topic.file) {
      continue;
    }
    const data = JSON.parse(await readFile(path.join(ROOT, topic.file), "utf8"));
    const lessons = (data.lessons ?? []).map((lesson) => ({
      category: lesson.category,
      summary: lesson.summary,
    }));
    if (lessons.length) {
      topic.lessons = lessons;
    } else {
      delete topic.lessons;
    }
  }
  return manifest;
}

const check = process.argv.includes("--check");
const changed = [];

for (const relativePath of await contentFiles()) {
  const absolute = path.join(ROOT, relativePath);
  const original = await readFile(absolute, "utf8");
  const parsed = JSON.parse(original);
  // The manifest is formatted last-ish anyway, but it is the one file
  // whose content is partly derived from the others.
  const value = relativePath === MANIFEST_PATH ? await buildLessonIndex(parsed) : parsed;
  const formatted = `${format(value)}\n`;
  if (formatted === original) {
    continue;
  }
  changed.push(relativePath);
  if (!check) {
    await writeFile(absolute, formatted);
  }
}

if (check) {
  if (changed.length) {
    console.error(
      `${changed.length} content file(s) are not formatted:\n` +
        changed.map((file) => `  ${file}`).join("\n") +
        "\n\nRun: npm run format"
    );
    process.exit(1);
  }
  console.log("✓ content files are formatted");
} else if (changed.length) {
  console.log(`formatted ${changed.length} file(s):\n${changed.map((f) => `  ${f}`).join("\n")}`);
} else {
  console.log("✓ nothing to format");
}
