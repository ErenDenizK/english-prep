#!/usr/bin/env node
// Measure the colours the redesigned app actually uses, directly from its
// stylesheet. The original palette/token checks still cover the preserved UI.
// WCAG 2 ratios are enforced; APCA is reported as a second reading, not as a
// claim about font-size/weight pairings or whole-page accessibility.

import { readFileSync } from "node:fs";
import { wcagContrast, apca, hexToRgb } from "./color.mjs";

const stylesheet = new URL("../css/editorial.css", import.meta.url);
const css = readFileSync(stylesheet, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const colourTokens = [
  "page", "card", "raised", "ink", "ink-2", "hairline", "edge", "accent",
  "accent-2", "accent-ink", "accent-text", "accent-tint", "focus", "ok", "no",
  "ok-tint", "no-tint", "editorial-mark", "editorial-wash", "editorial-note",
];

function palette(name, selector, additionalColours = []) {
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
  for (const token of [...colourTokens, ...additionalColours]) {
    const matches = declarations.filter((match) => match[1] === token);
    if (matches.length !== 1 || !/^#[0-9a-f]{6}$/i.test(matches[0][2].trim())) {
      throw new Error(`${name}: --${token} must have one explicit six-digit hex value`);
    }
    values[token] = matches[0][2].trim().toLowerCase();
  }
  return values;
}

const dark = palette("dark", /:root\s*\{([^{}]*)\}/g, ["aurora-blue", "aurora-teal"]);
const light = palette("light", /:root\[data-theme=["']?light["']?\]\s*\{([^{}]*)\}/g);
const systemLight = palette("system light", /:root:not\(\[data-theme=["']?dark["']?\]\)\s*\{([^{}]*)\}/g);
for (const token of colourTokens) {
  if (light[token] !== systemLight[token]) {
    throw new Error(`System light and explicit light disagree on --${token}`);
  }
}

// Read the effect's actual maximum stop opacity. The bound assumes two normal
// source-over gradient layers on --page; no blend mode or translucent text
// surface. Reading/quiz surfaces remain opaque. Both stacking orders are
// checked so changing the gradient order cannot evade this audit.
const alphaDeclarations = [...css.matchAll(/--aurora-alpha\s*:\s*([^;{}]+)\s*;/g)];
if (alphaDeclarations.length !== 1 || !/^(?:0?\.\d+|0)$/.test(alphaDeclarations[0][1].trim())) {
  throw new Error("--aurora-alpha must have one explicit unitless value");
}
const auroraAlpha = Number(alphaDeclarations[0][1].trim());
if (auroraAlpha < 0 || auroraAlpha > 0.06) {
  throw new Error("--aurora-alpha exceeds the researched 0.06 maximum; re-evaluate the effect before raising it");
}
const composite = (foreground, background) => foreground.map((channel, index) =>
  auroraAlpha * channel + (1 - auroraAlpha) * background[index]);
const pageRgb = hexToRgb(dark.page);
const blueRgb = hexToRgb(dark["aurora-blue"]);
const tealRgb = hexToRgb(dark["aurora-teal"]);
const auroraSurfaces = [
  { name: "blue", rgb: composite(blueRgb, pageRgb) },
  { name: "teal", rgb: composite(tealRgb, pageRgb) },
  { name: "blue over teal", rgb: composite(blueRgb, composite(tealRgb, pageRgb)) },
  { name: "teal over blue", rgb: composite(tealRgb, composite(blueRgb, pageRgb)) },
];
const displayHex = (rgb) => "#" + rgb.map((channel) =>
  Math.round(channel).toString(16).padStart(2, "0")).join("");

const surfaces = ["page", "card", "raised", "editorial-wash"];
const readingSurfaces = [...surfaces, "accent-tint", "ok-tint", "no-tint"];
const requirements = [
  { name: "Prose", text: "ink", on: readingSurfaces, minimum: 7 },
  { name: "Secondary text", text: "ink-2", on: readingSurfaces, minimum: 4.5, darkMinimum: 7 },
  { name: "Accent labels", text: "accent-text", on: [...surfaces, "accent-tint"], minimum: 4.5 },
  { name: "Reading notes", text: "editorial-note", on: readingSurfaces, minimum: 4.5, darkMinimum: 7 },
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
    // The dark reading system deliberately keeps a 7:1 margin for supporting
    // text. This is the product's stronger target, not the AA minimum.
    const minimum = theme === "dark" ? (requirement.darkMinimum ?? requirement.minimum) : requirement.minimum;
    const results = requirement.on.map((background) => {
      const foreground = requirement.text;
      const ratio = wcagContrast(tokens[foreground], tokens[background]);
      const lc = Math.abs(apca(tokens[foreground], tokens[background]));
      measured += 1;
      if (!Number.isFinite(ratio) || ratio < minimum) {
        failed += 1;
        console.error(`FAIL ${theme} --${foreground} on --${background}: ${ratio.toFixed(2)}:1; needs ${minimum}:1`);
      }
      return { ratio, lc, background };
    });
    const worst = results.reduce((a, b) => a.ratio < b.ratio ? a : b);
    const lowestLc = Math.min(...results.map((result) => result.lc));
    console.log(`  ${requirement.name.padEnd(23)} ${worst.ratio.toFixed(2)}:1 ≥ ${minimum.toFixed(1)}:1; |Lc| ≥ ${lowestLc.toFixed(1)} (WCAG limiting surface: --${worst.background})`);
  }
}

const opaqueMeasured = measured;
console.log(`\nDark aurora: two stops at maximum alpha ${auroraAlpha}; unrounded sRGB source-over composites`);
for (const surface of auroraSurfaces) {
  console.log(`  ${surface.name.padEnd(23)} ${displayHex(surface.rgb)} (rounded only for display)`);
}
// Any role permitted directly on the page must also remain legible at every
// maximum glow composite. Primary action labels stay on their opaque fill.
for (const requirement of requirements.filter((item) => item.on.includes("page"))) {
  const minimum = requirement.darkMinimum ?? requirement.minimum;
  const results = auroraSurfaces.map((background) => {
    const ratio = wcagContrast(dark[requirement.text], background.rgb);
    const lc = Math.abs(apca(dark[requirement.text], background.rgb));
    measured += 1;
    if (!Number.isFinite(ratio) || ratio < minimum) {
      failed += 1;
      console.error(`FAIL dark --${requirement.text} on aurora ${background.name}: ${ratio.toFixed(2)}:1; needs ${minimum}:1`);
    }
    return { ratio, lc, background: background.name };
  });
  const worst = results.reduce((a, b) => a.ratio < b.ratio ? a : b);
  const lowestLc = Math.min(...results.map((result) => result.lc));
  console.log(`  ${requirement.name.padEnd(23)} ${worst.ratio.toFixed(2)}:1 ≥ ${minimum.toFixed(1)}:1; |Lc| ≥ ${lowestLc.toFixed(1)} (limiting composite: ${worst.background})`);
}

if (failed) {
  console.error(`\n${failed} of ${measured} editorial contrast pairs failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${measured} editorial contrast pairs passed (${opaqueMeasured} opaque + ${measured - opaqueMeasured} aurora bounds). Decorative hairlines and marks are not control boundaries.`);
}
