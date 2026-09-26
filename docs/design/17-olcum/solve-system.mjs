#!/usr/bin/env node
// The joint solve. The surface ladder cannot be deepened on its own: the
// ink was solved for a three-surface world and `text-3` is already 0.6 Lc
// short of its own 17/600 tier on the ground. So surfaces and ink move
// together or not at all.
//
// Method, after Spectrum/Leonardo: do not pick a value and test it. State
// the requirement and search for the value that meets it. Every number
// printed here is the result of a search, and the search is over OKLCH
// lightness at the hue and chroma the palette already declares.

import { oklch, apca, wcagContrast } from "../../../tools/color.mjs";
import { requiredLc } from "../../../tools/palette.mjs";
import { hexToLstar, round } from "./lib-oklch.mjs";

const H = { dark: 255, light: 85 };
const C_SURF = { dark: 0.014, light: 0.008 };
const C_INK = { "text-1": 0.006, "text-2": 0.010, "text-3": 0.012 };

// What each ink is used for. These are the tiers the stylesheet declares,
// with meta raised 15 -> 17px: the x-height measurement said 15/600 in
// Source Sans 3 behaves as 13.9px against APCA's Helvetica-indexed matrix.
const TIERS = {
  "text-1": [[36, 600], [28, 400], [22, 600], [18, 400]],
  "text-2": [[18, 400]],
  "text-3": [[17, 600]],
};

/** Search OKLCH L for the extreme value of `ink` that still clears every
 *  tier on `surfaceHex`. Dark theme searches downward (dimmest ink that
 *  still works), light theme upward. */
function solveInk(theme, name, surfaceHex) {
  const C = C_INK[name];
  const need = TIERS[name].map(([px, w]) => requiredLc(px, w));
  const lo = theme === "dark" ? 0.60 : 0.05;
  const hi = theme === "dark" ? 0.99 : 0.55;
  let best = null;
  for (let i = 0; i <= 2000; i++) {
    const L = theme === "dark" ? hi - (i / 2000) * (hi - lo) : lo + (i / 2000) * (hi - lo);
    const hex = oklch(L, C, H[theme]).hex;
    const lc = Math.abs(apca(hex, surfaceHex));
    if (need.every((n) => lc >= n)) best = { L: round(L, 3), hex, lc: round(lc, 1) };
    else if (best) break;
  }
  return best;
}

console.log("=".repeat(100));
console.log("ORTAK ÇÖZÜM — merdiven ne kadar derinleşebilir, ve mürekkep ne olmalı");
console.log("=".repeat(100));

const RESULT = {};
for (const theme of ["dark", "light"]) {
  const dir = theme === "dark" ? +1 : -1;
  const ground = theme === "dark" ? 0.175 : 0.962;
  console.log(`\n### ${theme.toUpperCase()}`);
  console.log("  En üst yüzey        mürekkep, o yüzeyde çözülmüş (OKL / hex / Lc)");
  console.log("  " + "-".repeat(92));
  const rows = [];
  for (const depth of [0.286, 0.34, 0.40, 0.46, 0.52]) {
    const top = theme === "dark" ? depth : 1.0 - (depth - 0.0) * 0 - (0.962 - (0.962 - (depth - 0.286) - 0.076));
    // Light theme mirrors: the ladder descends from the ground by the same
    // OKL distance the dark one ascends.
    const topL = theme === "dark" ? depth : round(ground - (depth - 0.175), 3);
    const topHex = oklch(topL, C_SURF[theme], H[theme]).hex;
    const inks = {};
    let ok = true;
    for (const name of Object.keys(TIERS)) {
      const s = solveInk(theme, name, topHex);
      if (!s) { ok = false; break; }
      inks[name] = s;
    }
    const label = `OKL ${topL.toFixed(3)} ${topHex} L* ${String(round(hexToLstar(topHex), 1)).padStart(4)}`;
    if (!ok) { console.log(`  ${label}   ÇÖZÜMSÜZ`); continue; }
    // The ink ladder must stay separated, or the hierarchy collapses.
    const spread = Math.abs(inks["text-1"].L - inks["text-3"].L);
    console.log(`  ${label}   ` + Object.entries(inks).map(([n, s]) => `${n.slice(-1)}:${s.L.toFixed(3)}`).join(" ") +
      `   mürekkep yayılımı ${round(spread, 3)}` + (spread < 0.06 ? "  ← çöküyor" : ""));
    rows.push({ topL, topHex, inks, spread });
  }
  RESULT[theme] = rows;
}

/* ---- The chosen depth, and the ladder it produces ---- */
console.log("\n" + "=".repeat(100));
console.log("SEÇİLEN MERDİVEN — 5 basamak + karşı düzlem");
console.log("=".repeat(100));

// Chosen: OKL 0.46 top. It is the deepest rung whose ink ladder keeps a
// spread above 0.06 OKL in both themes, and it puts the top surface within
// reach of the counter-plane instead of leaving a 58-point hole below it.
const PICK = 0.46;
const LADDER = { dark: [0.175, 0.228, 0.286, 0.348, 0.412, 0.460], light: [0.962, 0.930, 0.896, 0.860, 0.822, 0.782] };
for (const theme of ["dark", "light"]) {
  console.log(`\n--- ${theme}`);
  let prev = null;
  LADDER[theme].forEach((L, i) => {
    const hex = oklch(L, C_SURF[theme], H[theme]).hex;
    const Ls = hexToLstar(hex);
    const gap = prev === null ? "" : `  ΔL* ${round(Math.abs(Ls - prev), 1)}`;
    prev = Ls;
    console.log(`  s${i}  OKL ${L.toFixed(3)}  ${hex}  CIE L* ${String(round(Ls, 1)).padStart(5)}${gap}`);
  });
  const span = Math.abs(hexToLstar(oklch(LADDER[theme][5], C_SURF[theme], H[theme]).hex) - hexToLstar(oklch(LADDER[theme][0], C_SURF[theme], H[theme]).hex));
  console.log(`  aralık: ${round(span, 1)} CIE L* puan  (bugün: ${theme === "dark" ? 12.4 : 6.3})`);
  const top = oklch(LADDER[theme][5], C_SURF[theme], H[theme]).hex;
  for (const name of Object.keys(TIERS)) {
    const s = solveInk(theme, name, top);
    console.log(`  ${name}: OKL ${s ? s.L : "—"}  ${s ? s.hex : ""}  (en üst yüzeyde Lc ${s ? s.lc : "—"})`);
  }
}
