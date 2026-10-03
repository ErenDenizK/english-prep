#!/usr/bin/env node
// Measure the colours the redesigned app actually uses, directly from its
// stylesheet. The original palette/token checks still cover the preserved UI.
// WCAG 2 ratios are enforced; APCA is reported as a second reading, not as a
// claim about font-size/weight pairings or whole-page accessibility.

import { readFileSync } from "node:fs";
import { wcagContrast, apca } from "./color.mjs";

const stylesheet = new URL("../css/editorial.css", import.meta.url);
const css = readFileSync(stylesheet, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const colourTokens = [
  "page", "card", "raised", "ink", "ink-2", "hairline", "edge", "accent",
  "accent-2", "accent-ink", "accent-text", "accent-tint", "focus", "ok", "no",
  "ok-tint", "no-tint", "editorial-mark", "editorial-wash", "editorial-note",
];

function palette(name, selector) {
  // Later layout-only :root rules are fine. Another palette override must be
  // added to this audit explicitly, so it cannot silently bypass the checks.
  const blocks = [...css.matchAll(selector)]
    .map((match) => match[1])
    .filter((block) => colourTokens.some((token) =>
      new RegExp(`--${token}\\s*:`).test(block)));
  if (blocks.length !== 1) {
    throw new Error(`${name}: expected one palette declaration, found ${blocks.length}`);
  }
  const declarations = [...blocks[0].matchAll(/--([\w-]+)\s*:\s*([^;{}]+)\s*;/g)];
  const values = {};
  for (const token of colourTokens) {
    const matches = declarations.filter((match) => match[1] === token);
    if (matches.length !== 1 || !/^#[0-9a-f]{6}$/i.test(matches[0][2].trim())) {
      throw new Error(`${name}: --${token} must have one explicit six-digit hex value`);
    }
    values[token] = matches[0][2].trim().toLowerCase();
  }
  return values;
}

const dark = palette("dark", /:root\s*\{([^{}]*)\}/g);
const light = palette("light", /:root\[data-theme=["']?light["']?\]\s*\{([^{}]*)\}/g);
const systemLight = palette("system light", /:root:not\(\[data-theme=["']?dark["']?\]\)\s*\{([^{}]*)\}/g);
for (const token of colourTokens) {
  if (light[token] !== systemLight[token]) {
    throw new Error(`System light and explicit light disagree on --${token}`);
  }
}

const surfaces = ["page", "card", "raised", "editorial-wash"];
const readingSurfaces = [...surfaces, "accent-tint", "ok-tint", "no-tint"];
const requirements = [
  { name: "Prose", text: "ink", on: readingSurfaces, minimum: 7 },
  { name: "Secondary text", text: "ink-2", on: readingSurfaces, minimum: 4.5 },
  { name: "Accent labels", text: "accent-text", on: [...surfaces, "accent-tint"], minimum: 4.5 },
  { name: "Reading notes", text: "editorial-note", on: readingSurfaces, minimum: 4.5 },
  { name: "Correct feedback", text: "ok", on: [...surfaces, "ok-tint"], minimum: 4.5 },
  { name: "Incorrect feedback", text: "no", on: [...surfaces, "no-tint"], minimum: 4.5 },
  { name: "Filled action labels", text: "accent-ink", on: ["accent", "accent-2"], minimum: 4.5 },
  { name: "Control boundaries", text: "edge", on: readingSurfaces, minimum: 3 },
  { name: "Focus indicators", text: "focus", on: readingSurfaces, minimum: 3 },
  { name: "Filled controls", text: "accent", on: surfaces, minimum: 3 },
];

let failed = 0;
let measured = 0;
console.log("Editorial palette — actual CSS; system and explicit light agree.");
for (const [theme, tokens] of [["dark", dark], ["light", light]]) {
  console.log(`\n${theme}: minimum contrast across each component's surfaces`);
  for (const requirement of requirements) {
    const results = requirement.on.map((background) => {
      const foreground = requirement.text;
      const ratio = wcagContrast(tokens[foreground], tokens[background]);
      const lc = Math.abs(apca(tokens[foreground], tokens[background]));
      measured += 1;
      if (!Number.isFinite(ratio) || ratio < requirement.minimum) {
        failed += 1;
        console.error(`FAIL ${theme} --${foreground} on --${background}: ${ratio.toFixed(2)}:1; needs ${requirement.minimum}:1`);
      }
      return { ratio, lc, background };
    });
    const worst = results.reduce((a, b) => a.ratio < b.ratio ? a : b);
    const lowestLc = Math.min(...results.map((result) => result.lc));
    console.log(`  ${requirement.name.padEnd(23)} ${worst.ratio.toFixed(2)}:1 ≥ ${requirement.minimum.toFixed(1)}:1; |Lc| ≥ ${lowestLc.toFixed(1)} (WCAG limiting surface: --${worst.background})`);
  }
}

if (failed) {
  console.error(`\n${failed} of ${measured} editorial contrast pairs failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${measured} editorial contrast pairs passed. Decorative hairlines and marks are not control boundaries.`);
}
