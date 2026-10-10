#!/usr/bin/env node
// How deep can the surface ladder go before the text stops clearing it?
//
// The measurement that started this: our dark surfaces occupy 12.4 of the
// 100 CIE L* points and the light ones 6.3, where seven real systems span
// 85-100 points across 10-16 steps. So there is no value in the palette
// that can be drawn as a mid-tone field — which is what nine rounds of
// "flat, shallow, generic" was pointing at.
//
// This does not pick values by eye. It walks candidate ladders and asks
// the project's own question of each rung: does every ink that may sit on
// it still clear requiredLc() for its size and weight, and 3:1 for a
// control boundary? The answer bounds the ladder.

import { oklch, wcagContrast, apca } from "../../../tools/color.mjs";
import { requiredLc, tokens, lightTokens } from "../../../tools/palette.mjs";
import { hexToLstar, round } from "./lib-oklch.mjs";

// The ink that actually sits on a surface, with the tiers each is used at.
// Sizes/weights are the ones the stylesheet declares today.
const INKS = {
  dark: [
    { name: "text-1", hex: tokens["text-1"], tiers: [[36, 600], [28, 400], [22, 600], [18, 400]] },
    { name: "text-2", hex: tokens["text-2"], tiers: [[18, 400]] },
    { name: "text-3", hex: tokens["text-3"], tiers: [[17, 600]] },
  ],
  light: [
    { name: "text-1", hex: lightTokens["text-1"], tiers: [[36, 600], [28, 400], [22, 600], [18, 400]] },
    { name: "text-2", hex: lightTokens["text-2"], tiers: [[18, 400]] },
    { name: "text-3", hex: lightTokens["text-3"], tiers: [[17, 600]] },
  ],
};

/** Does every ink clear every tier on this surface? Returns the failures. */
function inkFails(theme, surfaceHex) {
  const out = [];
  for (const ink of INKS[theme]) {
    const lc = Math.abs(apca(ink.hex, surfaceHex));
    for (const [px, w] of ink.tiers) {
      const need = requiredLc(px, w);
      if (lc < need) out.push(`${ink.name}@${px}/${w} Lc ${lc.toFixed(1)}<${need}`);
    }
  }
  return out;
}

const C = { dark: 0.014, light: 0.008 };
const H = { dark: 255, light: 85 };
const GROUND = { dark: 0.175, light: 0.962 };

console.log("=".repeat(104));
console.log("YÜZEY MERDİVENİ — her basamakta mürekkep hâlâ geçiyor mu? (projenin kendi requiredLc eşikleri)");
console.log("=".repeat(104));

for (const theme of ["dark", "light"]) {
  console.log(`\n--- ${theme.toUpperCase()}  (C ${C[theme]}, H ${H[theme]}, zemin OKL ${GROUND[theme]})`);
  console.log("  OKL    hex      CIE L*   zemine WCAG   ilk kırılma");
  console.log("  " + "-".repeat(96));
  const dir = theme === "dark" ? +1 : -1;
  const groundHex = oklch(GROUND[theme], C[theme], H[theme]).hex;
  const baseline = inkFails(theme, groundHex);
  if (baseline.length) console.log(`  (zeminin kendisi zaten kıl payı: ${baseline.join("; ")})`);
  const baseSet = new Set(baseline);
  let lastOk = null;
  for (let step = 0; step <= 40; step++) {
    const L = GROUND[theme] + dir * step * 0.025;
    if (L < 0.12 || L > 0.98) break;
    const hex = oklch(L, C[theme], H[theme]).hex;
    const fails = inkFails(theme, hex).filter((f) => !baseSet.has(f));
    const w = wcagContrast(groundHex, hex);
    const mark = fails.length ? "✗" : "✓";
    if (!fails.length) lastOk = { L, hex, Lstar: hexToLstar(hex) };
    // Print every other rung to keep it readable, plus the boundary.
    if (step % 2 === 0 || fails.length) {
      console.log(`  ${mark} ${round(L, 3).toFixed(3)}  ${hex}  ${String(round(hexToLstar(hex), 1)).padStart(5)}   ${w.toFixed(2)}:1` +
        (fails.length ? `        ${fails[0]}` : ""));
    }
    if (fails.length) break;
  }
  console.log(`  → en derin geçen basamak: OKL ${round(lastOk.L, 3)}  ${lastOk.hex}  CIE L* ${round(lastOk.Lstar, 1)}`);
  const span = Math.abs(lastOk.Lstar - hexToLstar(groundHex));
  console.log(`  → kullanılabilir aralık: ${round(hexToLstar(groundHex), 1)} → ${round(lastOk.Lstar, 1)} CIE L* = ${round(span, 1)} puan (bugün kullandığımız: ${theme === "dark" ? 12.4 : 6.3})`);
}
