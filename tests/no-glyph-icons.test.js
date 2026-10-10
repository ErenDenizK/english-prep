// Charter rule 4 (docs/PRINCIPLES.md §6): no characters as icons. An arrow,
// tick or cross the interface shows is an icon from js/icons.js; in running
// text it is a word ("Paylaş, sonra Ana Ekrana Ekle"). Lesson content in
// data/ is language, not interface, and keeps its arrows ("since → Present
// Perfect"); so do code comments, tools and tests, which no learner sees.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);

// Arrows (U+2190–21FF), dingbat ticks and crosses (U+2713–2718, U+274C,
// U+2705), dingbat arrows (U+2794–27BF), supplemental arrows (U+27F0–27FF,
// U+2900–297F) and the misc-symbol arrows (U+2B00–2B11).
const GLYPH = /[←-⇿✓-✘✅❌➔-➿⟰-⟿⤀-⥿⬀-⬑]/u;

/** JS or CSS with comments removed; strings and template literals kept. */
function stripComments(source) {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
      out += " ";
    } else if (c === "/" && next === "/") {
      // A URL in a string never gets here: the string branch consumed it.
      while (i < source.length && source[i] !== "\n") i += 1;
    } else if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < source.length && source[j] !== c) j += source[j] === "\\" ? 2 : 1;
      out += source.slice(i, j + 1);
      i = j + 1;
    } else {
      out += c;
      i += 1;
    }
  }
  return out;
}

const stripHtmlComments = (source) => source.replace(/<!--[^]*?-->/g, " ");

async function list(dir, extensions) {
  const entries = await readdir(new URL(dir, ROOT), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext)))
    .map((entry) => `${dir}${entry.name}`);
}

const files = [
  ...(await list("", [".html"])),
  ...(await list("about/", [".html", ".js", ".css"])),
  ...(await list("js/", [".js"])),
  ...(await list("css/", [".css"])),
];

test("the scan covers the interface", () => {
  for (const file of ["index.html", "quiz.html", "results.html", "about/index.html", "about/about.js", "about/content.js", "js/profile.js", "js/install.js", "css/editorial.css"]) {
    assert.ok(files.includes(file), `${file} is scanned`);
  }
});

test("interface code shows no arrow, tick or cross characters", async () => {
  const hits = [];
  for (const file of files) {
    const raw = await readFile(new URL(file, ROOT), "utf8");
    const code = file.endsWith(".html") ? stripHtmlComments(raw) : stripComments(raw);
    code.split("\n").forEach((line, index) => {
      const match = line.match(GLYPH);
      if (match) hits.push(`${file}: "${match[0]}" (U+${match[0].codePointAt(0).toString(16).toUpperCase()}) in ${line.trim().slice(0, 80)}`);
    });
  }
  assert.deepEqual(hits, [], "use an icon from js/icons.js, or words in running text");
});

test("the comment stripper keeps strings and drops comments", () => {
  assert.equal(stripComments('a("→") // →'), 'a("→") ');
  assert.equal(stripComments("/* → */ b"), "  b");
  assert.equal(stripComments('u = "https://x.test/→"'), 'u = "https://x.test/→"');
});
