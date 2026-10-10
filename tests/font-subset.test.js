// The Inter file is a subset (tools/subset-font.sh). A character the app
// shows that is not in it falls back to a system face mid-word, which on a
// Turkish page means a stray İ or ş in another font. So every codepoint
// the learner can see must be both inside the @font-face `unicode-range`
// and in the font's own cmap, read straight from the woff2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { brotliDecompressSync } from "node:zlib";
import { join, extname } from "node:path";

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, ROOT), "utf8");

// WOFF2 (W3C, §5): the table directory, then one brotli stream holding
// every table back to back. cmap is never transformed, so it can be sliced
// out without undoing the glyf/loca transform.
const KNOWN_TAGS = ("cmap head hhea hmtx maxp name OS/2 post cvt  fpgm glyf loca prep CFF  VORG EBDT " +
  "EBLC gasp hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR " +
  "CPAL SVG  sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx " +
  "opbd prop trak Zapf Silf Glat Gloc Feat Sill").match(/.{4}\s?/g).map((tag) => tag.slice(0, 4));

function cmapOf(woff2) {
  assert.equal(woff2.toString("latin1", 0, 4), "wOF2");
  const numTables = woff2.readUInt16BE(12);
  const compressedSize = woff2.readUInt32BE(20);
  let at = 48;
  const base128 = () => {
    let value = 0;
    for (let i = 0; i < 5; i += 1) {
      const byte = woff2[at++];
      value = value * 128 + (byte & 0x7f);
      if (!(byte & 0x80)) return value;
    }
    throw new Error("bad UIntBase128");
  };
  const tables = [];
  for (let i = 0; i < numTables; i += 1) {
    const flags = woff2[at++];
    let tag = KNOWN_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) {
      tag = woff2.toString("latin1", at, at + 4);
      at += 4;
    }
    const version = flags >> 6;
    const length = base128();
    const transformed = tag === "glyf" || tag === "loca" ? version === 0 : version !== 0;
    tables.push({ tag, length: transformed ? base128() : length });
  }
  const data = brotliDecompressSync(woff2.subarray(at, at + compressedSize));
  let offset = 0;
  for (const table of tables) {
    if (table.tag === "cmap") return parseCmap(data.subarray(offset, offset + table.length));
    offset += table.length;
  }
  throw new Error("no cmap");
}

function parseCmap(cmap) {
  const records = [];
  for (let i = 0; i < cmap.readUInt16BE(2); i += 1) {
    const at = 4 + i * 8;
    records.push({ platform: cmap.readUInt16BE(at), encoding: cmap.readUInt16BE(at + 2), offset: cmap.readUInt32BE(at + 4) });
  }
  const points = new Set();
  const full = records.find((r) => r.platform === 3 && r.encoding === 10);
  if (full) {
    const sub = cmap.subarray(full.offset);
    assert.equal(sub.readUInt16BE(0), 12);
    for (let i = 0; i < sub.readUInt32BE(12); i += 1) {
      const at = 16 + i * 12;
      for (let cp = sub.readUInt32BE(at); cp <= sub.readUInt32BE(at + 4); cp += 1) points.add(cp);
    }
    return points;
  }
  const bmp = records.find((r) => r.platform === 3 && r.encoding === 1);
  const sub = cmap.subarray(bmp.offset);
  assert.equal(sub.readUInt16BE(0), 4);
  const segments = sub.readUInt16BE(6) / 2;
  const ends = 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const ranges = deltas + segments * 2;
  for (let s = 0; s < segments; s += 1) {
    const end = sub.readUInt16BE(ends + s * 2);
    const start = sub.readUInt16BE(starts + s * 2);
    const delta = sub.readInt16BE(deltas + s * 2);
    const rangeOffset = sub.readUInt16BE(ranges + s * 2);
    for (let cp = start; cp <= end && cp !== 0xffff; cp += 1) {
      const glyph = rangeOffset === 0
        ? (cp + delta) & 0xffff
        : sub.readUInt16BE(ranges + s * 2 + rangeOffset + (cp - start) * 2);
      if (glyph !== 0) points.add(cp);
    }
  }
  return points;
}

async function declaredRange() {
  const css = await read("css/editorial.css");
  const face = css.match(/@font-face\s*\{[^}]*InterVariable[^}]*\}/)[0];
  const range = face.match(/unicode-range:\s*([^;]+);/);
  assert.ok(range, "the Inter @font-face declares a unicode-range");
  return range[1].split(",").map((part) => {
    const [from, to = from] = part.trim().replace(/^U\+/i, "").split("-");
    return [parseInt(from, 16), parseInt(to, 16)];
  });
}

async function filesUnder(dir, extensions) {
  const out = [];
  for (const entry of await readdir(new URL(dir, ROOT), { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && extensions.includes(extname(entry.name))) {
      out.push(join(entry.parentPath ?? entry.path, entry.name));
    }
  }
  return out;
}

// What a learner can see: content, the strings in code, the pages. Code
// comments are prose for maintainers and may name glyphs the UI never draws.
const stripComments = {
  ".js": (text) => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1"),
  ".css": (text) => text.replace(/\/\*[\s\S]*?\*\//g, ""),
  ".html": (text) => text.replace(/<!--[\s\S]*?-->/g, ""),
  ".json": (text) => text,
};

async function shownCodepoints() {
  const files = [
    ...(await filesUnder("data/", [".json"])),
    ...(await filesUnder("js/", [".js"])),
    ...(await filesUnder("about/", [".js", ".html", ".css"])),
    ...(await filesUnder("css/", [".css"])),
    ...["index.html", "quiz.html", "results.html"].map((page) => new URL(page, ROOT).pathname),
  ];
  const seen = new Map();
  for (const file of files) {
    const text = stripComments[extname(file)](await readFile(file, "utf8"));
    for (const char of text) {
      const cp = char.codePointAt(0);
      if (cp > 0x7e && !seen.has(cp)) seen.set(cp, file);
    }
  }
  return seen;
}

const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
const MUST = "İıĞğŞşÇçÖöÜüâîû‘’“”–—…·←↑→↓↗";

test("the subset font and its unicode-range cover every character the app shows", async () => {
  const cmap = cmapOf(await readFile(new URL("assets/fonts/InterVariable.woff2", ROOT)));
  const ranges = await declaredRange();
  const inRange = (cp) => ranges.some(([from, to]) => cp >= from && cp <= to);

  const shown = await shownCodepoints();
  for (const char of MUST) shown.set(char.codePointAt(0), "the Turkish, quote, dash and arrow set");
  assert.ok(shown.size > 20, `scanned ${shown.size} non-ASCII codepoints`);

  const missing = [...shown]
    .filter(([cp]) => !cmap.has(cp) || !inRange(cp))
    .map(([cp, file]) => `${hex(cp)} ${String.fromCodePoint(cp)} (${file}; cmap ${cmap.has(cp)}, range ${inRange(cp)})`);
  assert.deepEqual(missing, []);
});

test("the unicode-range promises nothing the subset does not hold", async () => {
  const cmap = cmapOf(await readFile(new URL("assets/fonts/InterVariable.woff2", ROOT)));
  const ranges = await declaredRange();
  for (let cp = 0x20; cp <= 0x7e; cp += 1) assert.ok(cmap.has(cp), `${hex(cp)} in cmap`);
  const outside = [...cmap].filter((cp) => !ranges.some(([from, to]) => cp >= from && cp <= to));
  assert.deepEqual(outside.map(hex), [], "every glyph in the file is reachable through the range");
});

test("the declared range is the one tools/subset-font.sh cuts", async () => {
  const script = await read("tools/subset-font.sh");
  const cut = script.match(/^UNICODES="([^"]+)"/m)[1].split(",");
  const declared = (await declaredRange()).map(([from, to]) =>
    from === to ? hex(from) : `${hex(from)}-${to.toString(16).toUpperCase().padStart(4, "0")}`);
  assert.deepEqual(declared, cut);
});
