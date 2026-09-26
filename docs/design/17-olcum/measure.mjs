#!/usr/bin/env node
// One instrument, seven systems. Reads the ramps extract.mjs produced and
// our own solved spec from tools/palette.mjs, and measures all of them the
// same way: CIE L* per step, the gap between steps, the chroma curve, and
// hue drift along the ramp.
//
// The question it exists to answer is the owner's: are our values a system,
// or a pile? A system's ladder has even rungs and a deliberate chroma curve.

import fs from "node:fs";
import { hexToOklch, hexToLstar, round } from "./lib-oklch.mjs";
import { surfaces, tokens, lightSurfaces, lightTokens } from "../../../tools/palette.mjs";

const ramps = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).filter((r) => r.system !== "ours");

// Our own ladders, from the solved spec rather than a copy of it.
const OURS = [
  { system: "ours", ramp: "surface", theme: "dark", steps: Object.entries(surfaces).map(([name, hex], i) => ({ step: i, name, hex })) },
  { system: "ours", ramp: "surface", theme: "light", steps: Object.entries(lightSurfaces).map(([name, hex], i) => ({ step: i, name, hex })) },
  { system: "ours", ramp: "text", theme: "dark", steps: ["text-1", "text-2", "text-3"].map((n, i) => ({ step: i, name: n, hex: tokens[n] })) },
  { system: "ours", ramp: "text", theme: "light", steps: ["text-1", "text-2", "text-3"].map((n, i) => ({ step: i, name: n, hex: lightTokens[n] })) },
];

const NEUTRAL = /^(gray|grey|slate|neutral|stone|zinc|sand|olive|mauve|sage|taupe|cool-?gray|warm-?gray|coolGray|trueGray|blueGray)$/i;

const stats = (xs) => {
  if (!xs.length) return null;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
  return { n: xs.length, mean: round(m, 2), min: round(Math.min(...xs), 2), max: round(Math.max(...xs), 2), sd: round(sd, 2) };
};

function measure(r) {
  const pts = r.steps.map((s) => ({ ...s, ...hexToOklch(s.hex), Lstar: hexToLstar(s.hex) }));
  const gaps = pts.slice(1).map((p, i) => Math.abs(p.Lstar - pts[i].Lstar));
  const chroma = pts.map((p) => p.C);
  const hues = pts.map((p) => p.H).filter(Number.isFinite);
  // Hue drift measured around the circular mean, so 359 and 1 are 2 apart.
  let drift = null;
  if (hues.length > 1) {
    const rad = hues.map((h) => (h * Math.PI) / 180);
    const mh = Math.atan2(rad.reduce((a, h) => a + Math.sin(h), 0), rad.reduce((a, h) => a + Math.cos(h), 0)) * 180 / Math.PI;
    drift = Math.max(...hues.map((h) => Math.abs(((h - mh + 540) % 360) - 180)));
  }
  const peak = chroma.indexOf(Math.max(...chroma));
  return {
    ...r, pts,
    n: pts.length,
    Lrange: [round(Math.min(...pts.map((p) => p.Lstar)), 1), round(Math.max(...pts.map((p) => p.Lstar)), 1)],
    gap: stats(gaps),
    Cmax: round(Math.max(...chroma), 4),
    Cmin: round(Math.min(...chroma), 4),
    CpeakAt: pts.length ? round((peak / (pts.length - 1)) * 100, 0) : null,
    hueDrift: round(drift, 1),
    isNeutral: NEUTRAL.test(r.ramp),
  };
}

const all = [...ramps, ...OURS].map(measure);
const W = (s, n) => String(s).padEnd(n);
const R = (s, n) => String(s ?? "—").padStart(n);

/* ---- 1. Neutral ramps: the surface ladder every system builds on ---- */
console.log("=".repeat(96));
console.log("1 · NÖTR RAMPALAR — her sistemin üstüne kurulduğu yüzey merdiveni");
console.log("=".repeat(96));
console.log(W("sistem/rampa", 26) + W("tema", 7) + R("adım", 5) + R("L* aralığı", 14) + R("ΔL* ort", 9) + R("sd", 7) + R("en dar", 8) + R("Cmax", 8));
console.log("-".repeat(96));
for (const r of all.filter((r) => r.isNeutral || r.ramp === "surface").sort((a, b) => a.system.localeCompare(b.system) || a.ramp.localeCompare(b.ramp))) {
  console.log(W(`${r.system}/${r.ramp}`, 26) + W(r.theme, 7) + R(r.n, 5) +
    R(`${r.Lrange[0]}–${r.Lrange[1]}`, 14) + R(r.gap?.mean, 9) + R(r.gap?.sd, 7) + R(r.gap?.min, 8) + R(r.Cmax, 8));
}

/* ---- 2. Are "neutral" greys actually neutral? ---- */
console.log("\n" + "=".repeat(96));
console.log("2 · NÖTR GRİLER GERÇEKTEN GRİ Mİ? — rampa boyunca en yüksek kroma");
console.log("=".repeat(96));
const neut = all.filter((r) => r.isNeutral);
const bySys = new Map();
for (const r of neut) {
  if (!bySys.has(r.system)) bySys.set(r.system, []);
  bySys.get(r.system).push(r);
}
for (const [sys, rs] of bySys) {
  const cs = rs.map((r) => r.Cmax);
  const zero = rs.filter((r) => r.Cmax < 0.002).length;
  console.log(`${W(sys, 13)} ${R(rs.length, 3)} nötr rampa · Cmax ort ${R(round(cs.reduce((a, b) => a + b, 0) / cs.length, 4), 7)} · aralık ${R(round(Math.min(...cs), 4), 7)}–${R(round(Math.max(...cs), 4), 7)} · tam nötr (C<0.002): ${zero}/${rs.length}`);
}

/* ---- 3. How even is the ladder? (sd of the L* gap, all ramps) ---- */
console.log("\n" + "=".repeat(96));
console.log("3 · MERDİVEN NE KADAR DÜZGÜN? — ΔL* standart sapması, bütün rampalar");
console.log("=".repeat(96));
for (const [sys, rs] of [...new Map(all.map((r) => [r.system, null])).keys()].map((s) => [s, all.filter((r) => r.system === s)])) {
  const sds = rs.map((r) => r.gap?.sd).filter(Number.isFinite);
  const means = rs.map((r) => r.gap?.mean).filter(Number.isFinite);
  const ns = rs.map((r) => r.n);
  console.log(`${W(sys, 13)} ${R(rs.length, 3)} rampa · adım sayısı ${R(Math.min(...ns), 3)}–${R(Math.max(...ns), 3)} · ΔL* ort ${R(round(means.reduce((a, b) => a + b, 0) / means.length, 2), 6)} · sd ort ${R(round(sds.reduce((a, b) => a + b, 0) / sds.length, 2), 6)}`);
}

/* ---- 4. The chroma curve: where does chroma peak along a ramp? ---- */
console.log("\n" + "=".repeat(96));
console.log("4 · KROMA EĞRİSİ — kroma rampanın neresinde zirve yapıyor (0 = en açık uç, 100 = en koyu)");
console.log("=".repeat(96));
for (const [sys, rs] of [...new Map(all.map((r) => [r.system, null])).keys()].map((s) => [s, all.filter((r) => r.system === s && !r.isNeutral && r.ramp !== "surface" && r.ramp !== "text")])) {
  if (!rs.length) continue;
  const peaks = rs.map((r) => r.CpeakAt).filter(Number.isFinite);
  if (!peaks.length) continue;
  const mid = peaks.filter((p) => p >= 25 && p <= 75).length;
  console.log(`${W(sys, 13)} ${R(rs.length, 3)} renkli rampa · zirye ort %${R(round(peaks.reduce((a, b) => a + b, 0) / peaks.length, 0), 4)} · ortada (%25–75) zirve yapan: ${mid}/${peaks.length}`);
}

/* ---- 5. Hue drift along a ramp ---- */
console.log("\n" + "=".repeat(96));
console.log("5 · TON KAYMASI — rampa boyunca tonun dairesel ortalamadan en büyük sapması (derece)");
console.log("=".repeat(96));
for (const [sys, rs] of [...new Map(all.map((r) => [r.system, null])).keys()].map((s) => [s, all.filter((r) => r.system === s && !r.isNeutral)])) {
  const ds = rs.map((r) => r.hueDrift).filter(Number.isFinite);
  if (!ds.length) continue;
  console.log(`${W(sys, 13)} ${R(ds.length, 3)} rampa · ton kayması ort ${R(round(ds.reduce((a, b) => a + b, 0) / ds.length, 1), 6)}° · en büyük ${R(round(Math.max(...ds), 1), 6)}°`);
}

/* ---- 6. Ours, step by step ---- */
console.log("\n" + "=".repeat(96));
console.log("6 · BİZ — adım adım");
console.log("=".repeat(96));
for (const r of all.filter((r) => r.system === "ours")) {
  console.log(`\n-- ${r.ramp} / ${r.theme}`);
  r.pts.forEach((p, i) => {
    const gap = i ? `  Δ${round(Math.abs(p.Lstar - r.pts[i - 1].Lstar), 1)}` : "";
    console.log(`   ${W(p.name, 12)} ${p.hex}  L* ${R(round(p.Lstar, 1), 5)}  C ${R(round(p.C, 4), 7)}  H ${R(round(p.H, 0), 4)}${gap}`);
  });
}

fs.writeFileSync("/tmp/claude-0/-home-user-english-prep/35aaf06a-c1b1-5d5c-9c76-c9d0a66f288d/scratchpad/measured.json", JSON.stringify(all.map(({ pts, ...r }) => r), null, 1));
