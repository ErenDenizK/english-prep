/**
 * Every colour primitive exists in css/style.css more than once: a hex
 * fallback, an `oklch()` redeclaration inside `@supports`, and the light
 * theme written out twice because there is no build step. `npm run color`
 * measures none of them — it measures `tools/palette.mjs`, the solved
 * spec — so a copy can drift and CI still reports a pass.
 *
 * It did. `--c-edge` shipped `oklch(0.545 0.012 255)` (#6B7177, 2.89:1 on
 * `--c-surface-2`) while the spec, the hex fallback and `npm run color`
 * all said `oklch(0.564 …)` (#71767D, 3.12:1). Since `oklch()` is
 * Baseline, the `@supports` block is what every current browser takes:
 * the app shipped a control boundary below SC 1.4.11's 3:1 while CI
 * called it ok.
 *
 * This compares every declaration in the stylesheet against the spec it
 * is supposed to be a copy of. Zero dependencies, ~70ms.
 */

import { readFileSync } from "node:fs";
import { oklch } from "./color.mjs";
import { surfaces, tokens, lightSurfaces, lightTokens } from "./palette.mjs";

const CSS = "css/style.css";

/** Names that are deliberately not a copy of a solved primitive. */
const ALIAS = {
  dark: { "surface-up": "surface-1" },
  light: {},
};
const UNCHECKED = {
  // A lifted plane above the page, not one of the three solved surfaces.
  light: ["surface-up"],
  dark: [],
};

const expected = {
  dark: { ...surfaces, ...tokens },
  light: { ...lightSurfaces, ...lightTokens },
};

/**
 * Walk the stylesheet tracking brace depth and the headers we are inside,
 * so each `--c-*` declaration can be attributed to a theme and told apart
 * from the `prefers-contrast` overrides, which are meant to differ.
 */
function declarations(src) {
  const out = [];
  const stack = [];
  let depth = 0;
  src.split("\n").forEach((line, i) => {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (opens) stack.push({ header: line.trim().replace(/\{.*$/, "").trim(), depth });
    depth += opens - closes;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();

    const m = line.match(/^\s*--c-([a-z0-9-]+):\s*([^;]+);/);
    if (!m) return;
    const ctx = stack.map((s) => s.header).join(" | ");
    if (/prefers-contrast/.test(ctx)) return;   // deliberate overrides
    const theme = /data-theme="light"|:not\(\[data-theme="dark"\]\)/.test(ctx) ? "light" : "dark";
    out.push({ name: m[1], value: m[2].trim(), line: i + 1, theme, ctx });
  });
  return out;
}

/** Resolve a declaration to a hex, or null when it is not a colour we solve. */
function resolve(value) {
  const hexMatch = value.match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) return "#" + hexMatch[1].toUpperCase();
  const ok = value.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (ok) return oklch(+ok[1], +ok[2], +ok[3]).hex;
  return null;   // rgb(... / alpha) tints, var() aliases
}

const src = readFileSync(CSS, "utf8");
const decls = declarations(src);
const problems = [];
let checked = 0;

for (const d of decls) {
  if (UNCHECKED[d.theme].includes(d.name)) continue;
  const specName = ALIAS[d.theme][d.name] || d.name;
  const want = expected[d.theme][specName];
  if (!want) continue;              // tints and anything not solved
  const got = resolve(d.value);
  if (got === null) continue;
  checked++;
  if (got !== want) {
    problems.push(
      `${CSS}:${d.line}  --c-${d.name} (${d.theme})  ships ${got}  spec ${want}` +
        `\n    ${d.value}`
    );
  }
}

if (!decls.length) {
  console.error("token-check: no --c-* declarations found; the parser is wrong, not the CSS.");
  process.exit(1);
}

if (problems.length) {
  console.error(`token-check: ${problems.length} of ${checked} declarations do not match tools/palette.mjs\n`);
  for (const p of problems) console.error("  " + p + "\n");
  console.error("The spec is the source of truth: `npm run color` solves it and measures it.");
  console.error("Fix the stylesheet, not palette.mjs, unless the requirement itself changed.");
  process.exit(1);
}

console.log(`token-check: ${checked} colour declarations in ${CSS} match tools/palette.mjs.`);
