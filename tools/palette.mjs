#!/usr/bin/env node
// The palette, and its proof. Every token declares the contrast it must
// hold and against which surfaces; running this re-measures all of them.
// A token that misses its target fails the run rather than the reviewer's
// eye — which matters here because the first draft of this palette passed
// WCAG everywhere and failed APCA everywhere, and no one would have seen it.
//
// See docs/design-system.md §1 for why both models are checked.

import { oklch, wcagContrast, apca, hexToRgb } from "./color.mjs";

const hex = (r, g, b) => "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase();

/** Material's elevation-overlay curve: alpha = (4.5·ln(1+dp)+2)/100. */
function elevate(base, dp) {
  const a = Math.min(1, (4.5 * Math.log(1 + dp) + 2) / 100);
  const [r, g, b] = hexToRgb(base);
  return hex(r + (255 - r) * a, g + (255 - g) * a, b + (255 - b) * a);
}

const BASE = oklch(0.175, 0.008, 75).hex;

export const surfaces = {
  "surface-0": BASE,
  "surface-1": elevate(BASE, 1),
  "surface-2": elevate(BASE, 6),
};

/** oklch coordinates kept alongside the hex so the palette stays re-derivable. */
const SPEC = {
  "text-1":      { L: 0.938, C: 0.006, H:  75, need: { lc: 90, wcag: 7.0 } },
  "text-2":      { L: 0.862, C: 0.010, H:  75, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.782, C: 0.012, H:  75, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.800, C: 0.125, H:  72, need: { ui: 3.0 } },
  "accent-text": { L: 0.864, C: 0.085, H:  78, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.180, C: 0.030, H:  72, need: {} },
  "ok":          { L: 0.780, C: 0.120, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.700, C: 0.140, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.900, C: 0.060, H:  78, need: { ui: 3.0 } },
  "hairline":    { L: 0.320, C: 0.010, H:  75, need: {} },
};

export const tokens = Object.fromEntries(
  Object.entries(SPEC).map(([name, s]) => [name, oklch(s.L, s.C, s.H).hex])
);

/** Contrast is always measured against the lightest surface a token may sit on. */
const WORST = surfaces["surface-2"];

function check() {
  const failures = [];
  const lines = [];

  for (const [name, s] of Object.entries(SPEC)) {
    const value = tokens[name];
    const w = wcagContrast(value, WORST);
    const lc = Math.abs(apca(value, WORST));
    let note = "";

    if (s.need.lc) {
      const ok = lc >= s.need.lc && w >= s.need.wcag;
      if (!ok) failures.push(`${name}: APCA ${lc.toFixed(0)}/${s.need.lc}, WCAG ${w.toFixed(2)}/${s.need.wcag}`);
      note = `text  APCA ${lc.toFixed(0).padStart(3)}/${s.need.lc}  WCAG ${w.toFixed(2).padStart(5)}/${s.need.wcag}  ${ok ? "ok" : "FAIL"}`;
    } else if (s.need.ui) {
      const ok = w >= s.need.ui;
      if (!ok) failures.push(`${name}: WCAG ${w.toFixed(2)}/${s.need.ui} (1.4.11)`);
      note = `ui    WCAG ${w.toFixed(2).padStart(5)}/${s.need.ui}${" ".repeat(16)}${ok ? "ok" : "FAIL"}`;
    } else {
      note = `—     WCAG ${w.toFixed(2).padStart(5)} (no requirement)`;
    }
    lines.push(`  ${name.padEnd(12)} ${value}  ${note}`);
  }

  // The label on the amber fill is the one place a foreground sits on a
  // colour rather than a surface, and amber caps what any ink can reach.
  const inkLc = Math.abs(apca(tokens["on-accent"], tokens["accent"]));
  const inkW = wcagContrast(tokens["on-accent"], tokens["accent"]);
  if (inkW < 4.5) failures.push(`on-accent: WCAG ${inkW.toFixed(2)}/4.5 on the fill`);
  if (inkLc < 60) failures.push(`on-accent: APCA ${inkLc.toFixed(0)}/60 on the fill`);

  console.log("surfaces");
  for (const [k, v] of Object.entries(surfaces)) console.log(`  ${k.padEnd(12)} ${v}`);
  console.log(`\ntokens — measured against ${WORST}, the lightest surface`);
  console.log(lines.join("\n"));
  console.log(
    `\n  on-accent on accent   WCAG ${inkW.toFixed(2)}  APCA ${inkLc.toFixed(0)}` +
      `  → label must be >=16px at weight 700 (APCA font table)`
  );

  if (failures.length) {
    console.log("\n✗ palette failed:\n" + failures.map((f) => "  - " + f).join("\n"));
    process.exit(1);
  }
  console.log("\n✓ every token meets its contrast requirement");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  check();
}
