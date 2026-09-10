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

/* -- Surfaces -----------------------------------------------------------

   Both ramps are OKLCH coordinates now, derived the same way as every
   other token. The dark ramp used to be produced by Material's
   elevation-overlay curve from one base hex; an OKLCH constant-chroma
   ramp reproduces it to the third decimal in lightness and removes the
   curve's side effects — it drifted hue by +11 degrees and eroded chroma
   by a fifth up the ramp, which was harmless at C 0.008 and is not at
   the chroma a cool ground needs.

   The ground is slate — H 255 at C 0.014 dark, C 0.004–0.008 light. That
   is the whole reason for this palette: every non-semantic token used
   to sit in an 11-degree band around the amber (67–78), so the interface
   was one hue and the accent was warm against nothing. A cool ground
   gives the amber a second channel to differ on. C 0.014 is at the
   design system's own "looks like a colour" line on purpose; if a real
   OLED reads it as blue, C 0.010 or H 240 keeps everything else within
   0.002 L. See docs/research/beta1-palette.md. */
const SURFACE_SPEC = {
  "surface-0": { L: 0.175, C: 0.014, H: 255 },
  "surface-1": { L: 0.228, C: 0.014, H: 255 },
  "surface-2": { L: 0.286, C: 0.014, H: 255 },
};

export const surfaces = Object.fromEntries(
  Object.entries(SURFACE_SPEC).map(([n, c]) => [n, oklch(c.L, c.C, c.H).hex])
);

/** oklch coordinates kept alongside the hex so the palette stays re-derivable. */
const SPEC = {
  "text-1":      { L: 0.941, C: 0.006, H: 255, need: { lc: 90, wcag: 7.0 } },
  "text-2":      { L: 0.869, C: 0.010, H: 255, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.788, C: 0.012, H: 255, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.800, C: 0.125, H:  70, need: { ui: 3.0 } },
  "accent-text": { L: 0.871, C: 0.085, H:  76, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.180, C: 0.030, H:  70, need: {} },
  "ok":          { L: 0.780, C: 0.120, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.700, C: 0.140, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.900, C: 0.060, H:  78, need: { ui: 3.0 } },
  "hairline":    { L: 0.320, C: 0.012, H: 255, need: {} },
  "edge":        { L: 0.564, C: 0.012, H: 255, need: { ui: 3.0 } },
};

export const tokens = Object.fromEntries(
  Object.entries(SPEC).map(([name, s]) => [name, oklch(s.L, s.C, s.H).hex])
);

/* -- The light theme -------------------------------------------------

   Not an inversion. Every value solved against the same requirements on
   a light slate at the same hue, and different rather than mirrored.

   Elevation is a lightness step away from the page in whichever
   direction the page is not, so these surfaces darken while the dark
   ones lighten. The worst case is still `surface-2` for the opposite
   reason: darkest here, closest to dark text.

   THE ACCENT IS A PAIR. One amber cannot serve both modes: on a light
   page, dark ink on a fill that clears 3:1 against the page has no
   solution at any hue 50–72 or chroma 0.12–0.17. Inverting the ink
   opens one window — oklch(0.55 0.125 60), with the page itself as the
   ink: Lc 76 on the fill, 4.8:1, and 4.1:1 against the darkest surface.
   C 0.125 is the gamut ceiling at that lightness. So light `accent` is a
   burnt amber and light `on-accent` is `surface-0`; the same hue family
   as the dark pair, so it reads as one brand.

   One recorded cost: under a deuteranopia simulation the light accent
   and `ok` sit 0.06 ΔE apart, because the burnt amber now shares the
   indicators' lightness. Acceptable — the accent tint and the ok tint
   never share a screen, and chips carry words — but if a route ever
   puts them side by side, darken light `ok` and accept the protanopia
   cost instead. */
/* -- The light theme: paper, not a white screen. ---------------------

   The first light palette was a cool near-white (L 0.985, H 255) with a
   cool near-black on it, solved to the same Lc 90 as dark. The owner
   used it and called it unreadable — "aşırı göz yoruyor". He was
   describing glare: a full-brightness cool white is the brightest thing
   a phone can show, and maximal contrast on it is the opposite of a
   page. The research is one-sided here (docs/research/premium.md §1):
   an off-white ground lowers overall luminance while keeping contrast,
   and APCA's own guidance sets Lc 90 as the *preferred* level for body
   text, 75 as the floor — there is no "maximum" on light, but there is
   no requirement to sit at the maximum either.

   So the ground is cream — hue 85, the hue of paper under warm light —
   at L 0.96, two steps darker than the old page, and the ink is a warm
   dark rather than a cool one. `text-1` measures Lc 85–86 against
   `surface-2`, the darkest cream, and 88–90 against the two surfaces
   prose actually sits on; its requirement here is 85 rather than 90,
   and the reasons are the two above. Every size pairing still clears
   the font matrix by the same margins as dark. Both numbers were
   cross-checked against the reference `apca-w3` and `colorjs.io`
   (see the research note), which agree with tools/color.mjs to 0.1. */
const LIGHT_SURFACE_SPEC = {
  "surface-0": { L: 0.960, C: 0.014, H: 85 },
  "surface-1": { L: 0.933, C: 0.016, H: 85 },
  "surface-2": { L: 0.905, C: 0.018, H: 85 },
};

const LIGHT_SPEC = {
  "text-1":      { L: 0.225, C: 0.016, H: 70, need: { lc: 85, wcag: 7.0 } },
  "text-2":      { L: 0.352, C: 0.018, H: 70, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.490, C: 0.020, H: 70, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.535, C: 0.125, H: 60, need: { ui: 3.0 } },
  "accent-text": { L: 0.372, C: 0.090, H: 60, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.960, C: 0.014, H: 85, need: {} },
  "ok":          { L: 0.555, C: 0.140, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.595, C: 0.170, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.480, C: 0.090, H:  60, need: { ui: 3.0 } },
  "hairline":    { L: 0.862, C: 0.014, H:  85, need: {} },
  "edge":        { L: 0.555, C: 0.012, H:  85, need: { ui: 3.0 } },
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
  { where: ".t-display", px: 36, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".t-title", px: 28, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".stat__value", px: 28, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".t-lead", px: 22, weight: 400, token: "text-1", on: "surface-2" },
  { where: "body prose", px: 18, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".option (serif)", px: 18, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".row__title", px: 18, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".feedback__body", px: 18, weight: 400, token: "text-1", on: "surface-2" },
  { where: ".field", px: 18, weight: 400, token: "text-1", on: "surface-1" },
  { where: ".btn", px: 18, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".listbox", px: 18, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".feedback__verdict", px: 18, weight: 600, token: "text-1", on: "surface-2" },
  // The quiet sentence: the one place a paragraph may be --c-text-2, and
  // only on the page or a card — never on surface-2, where it is 75/75.
  { where: ".t-quiet / quiet sentence", px: 18, weight: 400, token: "text-2", on: "surface-1" },
  { where: "quiet sentence (page)", px: 18, weight: 400, token: "text-2", on: "surface-0" },
  // The primary label sits on the amber, not on a surface.
  { where: ".btn--primary label", px: 18, weight: 600, token: "on-accent", on: "accent" },
  { where: ".t-meta", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  // The section label is the accent's text colour — the one place the
  // accent marks structure rather than an action — so a section opens
  // with a mark the eye finds before it reads. Measured like any text.
  { where: ".t-label", px: 15, weight: 600, token: "accent-text", on: "surface-2" },
  { where: ".t-ui", px: 15, weight: 600, token: "text-1", on: "surface-2" },
  { where: ".row__sub", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".row__lead", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".row__trail", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".nav__item", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".stat__label", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".option__key", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".chip", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".btn--quiet", px: 15, weight: 600, token: "text-2", on: "surface-2" },
  { where: ".feedback__report", px: 15, weight: 600, token: "text-2", on: "surface-2" },
];

function checkPairs(theme, failures, lines) {
  lines.push("\n  size x weight, against the surface closest in lightness:");
  for (const pair of PAIRS) {
    const ground = theme.surfaces[pair.on] ?? theme.tokens[pair.on];
    const measured = Math.abs(apca(theme.tokens[pair.token], ground));
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
  // The accent is a pair now — one value per theme — so this measures
  // two different fills, and the light one is the page as ink.
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
