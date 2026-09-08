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
  "edge":        { L: 0.560, C: 0.010, H:  75, need: { ui: 3.0 } },
};

export const tokens = Object.fromEntries(
  Object.entries(SPEC).map(([name, s]) => [name, oklch(s.L, s.C, s.H).hex])
);

/* -- The light theme -------------------------------------------------

   Not an inversion. Every value below was solved against the same
   requirements as the dark set, on a warm off-white at the same hue 75,
   and the numbers came out different rather than mirrored.

   Two rules restate themselves rather than flipping. Elevation is not
   "lighter"; it is **a lightness step away from the page, in whichever
   direction the page is not** — so the light surfaces darken while the
   dark ones lighten, with the same three-step budget. And the worst case
   is still `surface-2` for the opposite reason: on dark it is the
   lightest surface and therefore closest to light text, on light it is
   the darkest and closest to dark text. "Measure against the surface
   closest in lightness" is the rule both instances obey.

   The accent does not survive the flip and is deliberately unchanged.
   Clearing 3:1 against an off-white page needs L <= 0.664; keeping
   --c-on-accent readable on the fill needs L >= 0.76. There is no
   intersection, so the amber stays as it is and the light-mode filled
   button gets a boundary instead — a perceptual fix, not a conformance
   one, since a text-labelled button passes 1.4.11 without it. */
const LIGHT_SURFACE_SPEC = {
  "surface-0": { L: 0.985, C: 0.004, H: 75 },
  "surface-1": { L: 0.958, C: 0.007, H: 75 },
  "surface-2": { L: 0.928, C: 0.009, H: 75 },
};

const LIGHT_SPEC = {
  "text-1":      { L: 0.216, C: 0.010, H:  75, need: { lc: 90, wcag: 7.0 } },
  /* Solved a step past each target rather than exactly onto it. The first
     draft of these values hit their requirements to the decimal and then
     failed the run, because a token with zero margin fails on rounding —
     which is the same thing as having no margin at all. */
  "text-2":      { L: 0.403, C: 0.014, H:  75, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.544, C: 0.016, H:  75, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.800, C: 0.125, H:  72, need: {} },
  "accent-text": { L: 0.406, C: 0.085, H:  72, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.180, C: 0.030, H:  72, need: {} },
  "ok":          { L: 0.586, C: 0.140, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.620, C: 0.160, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.500, C: 0.090, H:  78, need: { ui: 3.0 } },
  "hairline":    { L: 0.885, C: 0.006, H:  75, need: {} },
  "edge":        { L: 0.603, C: 0.008, H:  75, need: { ui: 3.0 } },
};

export const lightSurfaces = Object.fromEntries(
  Object.entries(LIGHT_SURFACE_SPEC).map(([n, s]) => [n, oklch(s.L, s.C, s.H).hex])
);
export const lightTokens = Object.fromEntries(
  Object.entries(LIGHT_SPEC).map(([n, s]) => [n, oklch(s.L, s.C, s.H).hex])
);

/** Both themes, so nothing can be solved for one and forgotten in the other. */
const THEMES = [
  { name: "dark", spec: SPEC, tokens, surfaces },
  { name: "light", spec: LIGHT_SPEC, tokens: lightTokens, surfaces: lightSurfaces },
];

/** The surface closest in lightness to the text — `surface-2` in both. */
const WORST = surfaces["surface-2"];


/* -- The size half of the requirement --------------------------------

   A token on its own has no contrast requirement. APCA's model is that
   contrast, size and weight are ONE requirement: the published
   `fontMatrixAscend` returns, for a given Lc, the minimum font size at
   each weight. Read backwards it gives the Lc a size/weight pair needs.

   This exists because the check above could not see the defect that
   shipped for weeks. Every token met its own fixed requirement and the
   run was green, while the app set 54% of its rendered characters at
   13px and 11px in the dimmest grey in the palette — pairs needing Lc
   113 and 117 against a ceiling of 107. The defect was never in a token.
   It was in a pair, and nothing measured pairs.

   Rows transcribed from fontMatrixAscend for the weights this app ships.
   APCA is a public beta and was pulled from the WCAG 3 draft in 2023, so
   nothing here is a conformance claim — §1 of the design system explains
   why it is the design bar anyway. [≈] the interpolation between rows is
   ours, not APCA's. */
const FONT_MATRIX = [
  { lc: 60, px: { 400: 24, 600: 18, 700: 16 } },
  { lc: 75, px: { 400: 18, 600: 15, 700: 14 } },
  { lc: 90, px: { 400: 16, 600: 14.5, 700: 14 } },
  { lc: 100, px: { 400: 15, 600: 13.5, 700: 13 } },
  { lc: 110, px: { 400: 14, 600: 12, 700: 11 } },
];

/**
 * The Lc a size/weight pair requires, interpolated between matrix rows.
 * Returns null when the pair sits below the table entirely, which means
 * no contrast this or any palette can produce will carry it.
 */
export function requiredLc(px, weight) {
  const rows = FONT_MATRIX.filter((r) => r.px[weight] !== undefined);
  if (px >= rows[0].px[weight]) return rows[0].lc;
  for (let i = 0; i < rows.length - 1; i += 1) {
    const hi = rows[i];
    const lo = rows[i + 1];
    if (px <= hi.px[weight] && px >= lo.px[weight]) {
      const t = (hi.px[weight] - px) / (hi.px[weight] - lo.px[weight]);
      return hi.lc + t * (lo.lc - hi.lc);
    }
  }
  return null;
}

/* Every place the stylesheet sets text, as the pair it actually renders.
   Adding a rule to css/style.css means adding its row here; a pair that
   is not listed is not checked, which is the one way this can go stale.
   `on` is the lightest surface the text can sit on. */
export const PAIRS = [
  { where: ".t-display", px: 28, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".t-title", px: 22, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".t-lead", px: 19, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".option (serif)", px: 17, weight: 400, token: "text-1", on: "surface-2" },
  { where: "body prose", px: 16, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".t-ui", px: 15, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".row__title", px: 15, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".listbox__trigger", px: 15, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".field--multiline", px: 16, weight: 400, token: "text-1", on: "surface-1" },
  { where: ".feedback__verdict", px: 15, weight: 700, token: "text-1", on: "surface-2" },
  { where: ".t-meta", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".t-label", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".row__sub", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".row__lead", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".row__trail", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".nav__item", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".stat__label", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".option__key", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".chip", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".btn--quiet", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".feedback__body", px: 16, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".feedback__report", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".listbox__option", px: 15, weight: 600, token: "text-1", on: "surface-2" },
];

function checkPairs(theme, failures, lines) {
  lines.push("\n  size x weight, against the surface closest in lightness:");
  for (const pair of PAIRS) {
    const measured = Math.abs(apca(theme.tokens[pair.token], theme.surfaces[pair.on]));
    const need = requiredLc(pair.px, pair.weight);
    const label = `${pair.where} ${pair.px}/${pair.weight} ${pair.token}`;
    if (need === null) {
      failures.push(`${label}: below APCA's table — no contrast carries this pair`);
      lines.push(`  ${label.padEnd(46)} Lc ${measured.toFixed(0).padStart(3)} / —    BELOW TABLE`);
      continue;
    }
    const ok = measured >= need;
    if (!ok) failures.push(`${label}: APCA ${measured.toFixed(0)}/${need.toFixed(0)}`);
    lines.push(
      `  ${label.padEnd(46)} Lc ${measured.toFixed(0).padStart(3)} / ${need.toFixed(0).padStart(3)}  ${ok ? "ok" : "SHORT"}`
    );
  }
}

function checkTheme(theme, failures) {
  const lines = [];
  const worst = theme.surfaces["surface-2"];

  for (const [name, spec] of Object.entries(theme.spec)) {
    const value = theme.tokens[name];
    const w = wcagContrast(value, worst);
    const lc = Math.abs(apca(value, worst));
    let note = "";

    if (spec.need.lc) {
      const ok = lc >= spec.need.lc && w >= spec.need.wcag;
      if (!ok)
        failures.push(
          `${theme.name}/${name}: APCA ${lc.toFixed(0)}/${spec.need.lc}, WCAG ${w.toFixed(2)}/${spec.need.wcag}`
        );
      note = `text  APCA ${lc.toFixed(0).padStart(3)}/${spec.need.lc}  WCAG ${w.toFixed(2).padStart(5)}/${spec.need.wcag}  ${ok ? "ok" : "FAIL"}`;
    } else if (spec.need.ui) {
      const ok = w >= spec.need.ui;
      if (!ok) failures.push(`${theme.name}/${name}: WCAG ${w.toFixed(2)}/${spec.need.ui} (1.4.11)`);
      note = `ui    WCAG ${w.toFixed(2).padStart(5)}/${spec.need.ui}${" ".repeat(16)}${ok ? "ok" : "FAIL"}`;
    } else {
      note = `—     WCAG ${w.toFixed(2).padStart(5)} (no requirement)`;
    }
    lines.push(`  ${name.padEnd(12)} ${value}  ${note}`);
  }

  // The label on the amber fill is the one place a foreground sits on a
  // colour rather than a surface, and amber caps what any ink can reach.
  // The fill is the same in both themes, so this measures the same twice
  // on purpose: it is the one token the light theme could not re-solve.
  const inkLc = Math.abs(apca(theme.tokens["on-accent"], theme.tokens["accent"]));
  const inkW = wcagContrast(theme.tokens["on-accent"], theme.tokens["accent"]);
  if (inkW < 4.5) failures.push(`${theme.name}/on-accent: WCAG ${inkW.toFixed(2)}/4.5 on the fill`);
  if (inkLc < 60) failures.push(`${theme.name}/on-accent: APCA ${inkLc.toFixed(0)}/60 on the fill`);

  console.log(`\n=== ${theme.name} ===\n\nsurfaces`);
  for (const [k, v] of Object.entries(theme.surfaces)) console.log(`  ${k.padEnd(12)} ${v}`);
  console.log(`\ntokens — measured against ${worst}, the surface closest in lightness`);
  checkPairs(theme, failures, lines);
  console.log(lines.join("\n"));
  console.log(
    `\n  on-accent on accent   WCAG ${inkW.toFixed(2)}  APCA ${inkLc.toFixed(0)}` +
      `  → label must be >=16px at weight 700 (APCA font table)`
  );
}

function check() {
  const failures = [];
  for (const theme of THEMES) checkTheme(theme, failures);

  if (failures.length) {
    console.log("\n✗ palette failed:\n" + failures.map((f) => "  - " + f).join("\n"));
    process.exit(1);
  }
  console.log("\n✓ both themes: every token and every size pairing meets its requirement");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  check();
}
