#!/usr/bin/env node
// Measure the redesigned app's actual CSS palette, including every permitted
// aura overlap and sRGB action-gradient sample. WCAG ratios are enforced;
// APCA is diagnostic, not a claim about whole-page or font-size accessibility.
// An optional CSS file argument allows negative fixtures without editing the app.

import { readFileSync } from "node:fs";
import { wcagContrast, apca, hexToRgb } from "./color.mjs";

const stylesheet = process.argv[2] ?? new URL("../css/editorial.css", import.meta.url);
const css = readFileSync(stylesheet, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const colourTokens = [
  "page", "card", "raised", "ink", "ink-2", "hairline", "edge", "accent",
  "accent-2", "accent-ink", "accent-text", "accent-tint", "focus", "ok", "no",
  "ok-tint", "no-tint", "ok-edge", "no-edge", "editorial-mark", "editorial-wash", "editorial-note",
  "secondary", "tertiary",
];
const auroraTokens = ["aurora-cherry", "aurora-iris", "aurora-apricot"];
const monitoredTokens = [...colourTokens, ...auroraTokens, "aurora-opacity", "grad-accent"];
const auditedDeclarations = new Map();

function palette(name, selector, inherited = {}) {
  // Layout-only :root rules are fine. Splitting a palette across later overrides
  // would otherwise evade this source audit, so require one declaration block.
  const blocks = [...css.matchAll(selector)]
    .map((match) => match[1])
    .filter((block) => monitoredTokens.some((token) =>
      new RegExp(`--${token}\\s*:`).test(block)));
  if (blocks.length !== 1) {
    throw new Error(`${name}: expected one palette declaration, found ${blocks.length}`);
  }
  const declarations = [...blocks[0].matchAll(/--([\w-]+)\s*:\s*([^;{}]+)\s*;/g)];
  for (const [, token] of declarations) {
    if (monitoredTokens.includes(token)) {
      auditedDeclarations.set(token, (auditedDeclarations.get(token) ?? 0) + 1);
    }
  }
  function declaration(token, optional = false) {
    const matches = declarations.filter((match) => match[1] === token);
    if (matches.length === 0 && optional) return inherited[token];
    if (matches.length !== 1) {
      throw new Error(`${name}: --${token} must have one explicit declaration`);
    }
    return matches[0][2].trim();
  }
  const values = {};
  for (const token of [...colourTokens, ...auroraTokens]) {
    const value = declaration(token, auroraTokens.includes(token));
    if (!/^#[0-9a-f]{6}$/i.test(value ?? "")) {
      throw new Error(`${name}: --${token} must be an explicit six-digit hex color`);
    }
    values[token] = value.toLowerCase();
  }
  const opacity = declaration("aurora-opacity");
  if (!/^(?:0?\.\d+|0|1(?:\.0+)?)$/.test(opacity)) {
    throw new Error(`${name}: --aurora-opacity must be an explicit number from 0 to 1`);
  }
  values["aurora-opacity"] = Number(opacity);
  const maximum = name === "dark" ? 0.10 : 0.05;
  if (values["aurora-opacity"] > maximum) {
    throw new Error(`${name}: --aurora-opacity exceeds ADR007's ${maximum} cap; re-evaluate the effect before raising it`);
  }
  const gradient = declaration("grad-accent", true);
  // Explicit interpolation makes the calculation independent of color-space
  // defaults. Only the two audited opaque endpoints belong in this token.
  if (!/^linear-gradient\(\s*(?:(?:-?\d+(?:\.\d+)?(?:deg|turn|rad|grad)|to\s+(?:left|right|top|bottom)(?:\s+(?:left|right|top|bottom))?)\s+)?in\s+srgb\s*,\s*var\(--accent\)\s*,\s*var\(--accent-2\)\s*\)$/i.test(gradient ?? "")) {
    throw new Error(`${name}: --grad-accent must explicitly interpolate the two audited --accent/--accent-2 stops in srgb`);
  }
  values["grad-accent"] = gradient.replace(/\s+/g, " ").toLowerCase();
  return values;
}

const dark = palette("dark", /:root\s*\{([^{}]*)\}/g);
const light = palette("light", /:root\[data-theme=["']?light["']?\]\s*\{([^{}]*)\}/g, dark);
const systemLight = palette("system light", /:root:not\(\[data-theme=["']?dark["']?\]\)\s*\{([^{}]*)\}/g, dark);
for (const token of monitoredTokens) {
  const total = [...css.matchAll(new RegExp(`[{;]\\s*--${token}\\s*:`, "g"))].length;
  if (total !== auditedDeclarations.get(token)) {
    throw new Error(`--${token} is redeclared outside the three audited palette blocks`);
  }
}
for (const token of monitoredTokens) {
  if (light[token] !== systemLight[token]) {
    throw new Error(`System light and explicit light disagree on --${token}`);
  }
}

const surfaces = ["page", "card", "raised", "editorial-wash"];
const readingSurfaces = [...surfaces, "accent-tint", "ok-tint", "no-tint"];
const requirements = [
  { name: "Prose", text: "ink", minimum: 7 },
  { name: "Supporting text", text: "ink-2", minimum: 4.5, darkMinimum: 7 },
  { name: "Sakura labels", text: "accent-text", minimum: 4.5 },
  { name: "Reading emphasis", text: "editorial-mark", minimum: 4.5 },
  { name: "Reading notes", text: "editorial-note", minimum: 4.5, darkMinimum: 7 },
  { name: "Correct feedback", text: "ok", minimum: 4.5 },
  { name: "Retry feedback", text: "no", minimum: 4.5 },
  { name: "Secondary accent", text: "secondary", minimum: 4.5 },
  { name: "Attention accent", text: "tertiary", minimum: 4.5 },
  { name: "Control boundaries", text: "edge", minimum: 3 },
  { name: "Focus indicators", text: "focus", minimum: 3 },
];

// 3 single, 6 double, and 6 triple overlaps. Each distinct lobe occurs at most
// once; these are three fields total, not three per nested reader/container.
function auraSurfaces(tokens) {
  const output = [];
  function addOrders(order, remaining) {
    for (const token of remaining) {
      const next = [...order, token];
      const rgb = next.reduce((background, foreground) =>
        hexToRgb(tokens[foreground]).map((channel, index) =>
          tokens["aurora-opacity"] * channel +
          (1 - tokens["aurora-opacity"]) * background[index]), hexToRgb(tokens.page));
      output.push({ name: next.map((item) => item.replace("aurora-", "")).join(" → "), rgb });
      addOrders(next, remaining.filter((item) => item !== token));
    }
  }
  addOrders([], auroraTokens);
  return output;
}

function actionGradient(tokens) {
  const from = hexToRgb(tokens.accent);
  const to = hexToRgb(tokens["accent-2"]);
  return Array.from({ length: 101 }, (_, index) => ({
    name: `action ${index}%`,
    rgb: from.map((channel, position) => channel + (to[position] - channel) * index / 100),
  }));
}

const displayHex = (rgb) => "#" + rgb.map((channel) =>
  Math.round(channel).toString(16).padStart(2, "0")).join("");
let failed = 0;
let measured = 0;
let reportedFailures = 0;
function measure(theme, role, foreground, background, minimum) {
  const ratio = wcagContrast(foreground, background.rgb);
  const lc = Math.abs(apca(foreground, background.rgb));
  measured += 1;
  if (!Number.isFinite(ratio) || ratio < minimum) {
    failed += 1;
    if (reportedFailures++ < 20) {
      console.error(`FAIL ${theme} ${role} on ${background.name}: ${ratio.toFixed(2)}:1; needs ${minimum}:1`);
    }
  }
  return { ratio, lc, background: background.name };
}
function report(name, results, minimum) {
  const worst = results.reduce((a, b) => a.ratio < b.ratio ? a : b);
  const lowestLc = Math.min(...results.map((result) => result.lc));
  console.log(`  ${name.padEnd(23)} ${worst.ratio.toFixed(2)}:1 ≥ ${minimum.toFixed(1)}:1; |Lc| ≥ ${lowestLc.toFixed(1)} (limiting: ${worst.background})`);
}

console.log("Editorial palette — actual CSS; explicit and system light agree.");
let opaqueMeasured = 0;
let auraMeasured = 0;
let gradientMeasured = 0;
let answerMeasured = 0;
for (const [theme, tokens] of [["dark", dark], ["light", light]]) {
  const opaque = readingSurfaces.map((token) => ({ name: `--${token}`, rgb: hexToRgb(tokens[token]) }));
  const aura = auraSurfaces(tokens);
  const gradient = actionGradient(tokens);
  console.log(`\n${theme}: opaque reading and control surfaces`);
  const opaqueStart = measured;
  for (const requirement of requirements) {
    const minimum = theme === "dark" ? (requirement.darkMinimum ?? requirement.minimum) : requirement.minimum;
    report(requirement.name, opaque.map((background) =>
      measure(theme, `--${requirement.text}`, tokens[requirement.text], background, minimum)), minimum);
  }
  opaqueMeasured += measured - opaqueStart;

  console.log(`\n${theme}: ${aura.length} aura bounds at per-field opacity ${tokens["aurora-opacity"]}; unrounded sRGB source-over`);
  const triple = aura.filter((surface) => surface.name.split(" → ").length === 3);
  console.log(`  Maximum three-field composites: ${[...new Set(triple.map((surface) => displayHex(surface.rgb)))].join(", ")} (rounded for display only)`);
  const auraStart = measured;
  for (const requirement of requirements) {
    const minimum = theme === "dark" ? (requirement.darkMinimum ?? requirement.minimum) : requirement.minimum;
    report(requirement.name, aura.map((background) =>
      measure(theme, `--${requirement.text}`, tokens[requirement.text], background, minimum)), minimum);
  }
  auraMeasured += measured - auraStart;

  console.log(`\n${theme}: action gradient, 101 sRGB samples including both endpoints`);
  const gradientStart = measured;
  report("Filled action labels", gradient.map((background) =>
    measure(theme, "--accent-ink", tokens["accent-ink"], background, 4.5)), 4.5);
  // A filled action must be identifiable against the surrounding opaque plane
  // and against any permitted atmosphere on the page canvas.
  const actionSurfaces = [
    ...surfaces.map((token) => ({ name: `--${token}`, rgb: hexToRgb(tokens[token]) })),
    ...aura,
  ];
  report("Filled control boundary", gradient.flatMap((sample) => actionSurfaces.map((background) =>
    measure(theme, sample.name, sample.rgb, { ...background, name: `${sample.name} / ${background.name}` }, 3))), 3);
  gradientMeasured += measured - gradientStart;

  // Answer rows now have opaque semantic surfaces. Check their softer borders
  // against both the inside and every surrounding app plane, not only the
  // prominent check/cross color. The colors never replace literal verdicts.
  console.log(`\n${theme}: filled answer states and transitions`);
  const answerStart = measured;
  for (const state of ["ok", "no"]) {
    const inside = { name: `--${state}-tint`, rgb: hexToRgb(tokens[`${state}-tint`]) };
    report(`${state} answer boundary`, [...opaque, ...aura].map((background) =>
      measure(theme, `--${state}-edge`, tokens[`${state}-edge`], background, 3)), 3);
    report(`${state} verdict glyph`, [measure(theme, `--${state}`, tokens[state], inside, 3)], 3);

    // A pointer may still be over a just-committed option. Sample both neutral
    // and hover starts, including all sRGB intermediate colors. Text never
    // fades, the surface remains opaque, and no bright overlay crosses prose.
    const transition = ["card", "raised"].flatMap((start) => {
      const from = hexToRgb(tokens[start]);
      const fromBorder = hexToRgb(tokens[start === "raised" ? "ink-2" : "edge"]);
      const toBorder = hexToRgb(tokens[`${state}-edge`]);
      return Array.from({ length: 101 }, (_, index) => ({
        name: `${start} → ${state} ${index}%`,
        rgb: from.map((channel, position) => channel + (inside.rgb[position] - channel) * index / 100),
        border: fromBorder.map((channel, position) => channel + (toBorder[position] - channel) * index / 100),
      }));
    });
    for (const [role, token, minimum] of [
      ["prose", "ink", 7],
      ["shortcut", "ink-2", theme === "dark" ? 7 : 4.5],
      ["focus", "focus", 3],
    ]) {
      report(`${state} transition ${role}`, transition.map((background) =>
        measure(theme, `--${token}`, tokens[token], background, minimum)), minimum);
    }
    report(`${state} transition edge`, transition.map((background) =>
      measure(theme, `--${state}-edge transition`, background.border, background, 3)), 3);
  }
  answerMeasured += measured - answerStart;
}

if (failed) {
  if (reportedFailures > 20) console.error(`... ${reportedFailures - 20} additional failed pairs omitted.`);
  console.error(`\n${failed} of ${measured} editorial contrast pairs failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${measured} editorial contrast pairs passed (${opaqueMeasured} opaque + ${auraMeasured} aura + ${gradientMeasured} gradient + ${answerMeasured} answer samples).`);
  console.log("Decorative hairlines are not control boundaries. Aura is behind opaque cards; no additional field, blend mode, or animated brightness is covered by these bounds.");
}
