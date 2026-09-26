#!/usr/bin/env node
// Type scales and component dimensions, from the same real token packages.
// The owner's complaint was that no font size, button and text size fit
// together. That is a measurable claim: a scale has a ratio, and a control
// has a documented relationship between its height and its label.

import fs from "node:fs";
import path from "node:path";

const DS = process.env.DS_DIR;
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const px = (v) => {
  const m = /^([\d.]+)px$/.exec(String(v).trim());
  return m ? Number(m[1]) : null;
};
const R = (s, n) => String(s ?? "—").padStart(n);
const W = (s, n) => String(s).padEnd(n);
const ratios = (xs) => xs.slice(1).map((v, i) => Number((v / xs[i]).toFixed(3)));
const stats = (xs) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return { mean: Number(m.toFixed(3)), sd: Number(Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length).toFixed(3)),
           min: Math.min(...xs), max: Math.max(...xs) };
};

/* ---- Adobe Spectrum: the one system that publishes desktop AND mobile ---- */
const spec = readJson(path.join(DS, "adobe-spectrum-tokens-15.4.1/package/src/typography.json"));
const layout = readJson(path.join(DS, "adobe-spectrum-tokens-15.4.1/package/src/layout.json"));
const setVal = (tok, set) => (tok?.sets?.[set] ? px(tok.sets[set].value) : px(tok?.value));

console.log("=".repeat(92));
console.log("1 · SPECTRUM — aynı jeton, masaüstü ve dokunmatik: ölçüler dokunmatikte BÜYÜR");
console.log("=".repeat(92));
console.log(W("jeton", 30) + R("masaüstü", 10) + R("mobil", 9) + R("oran", 8));
console.log("-".repeat(92));
const ladder = (obj, pred) => Object.keys(obj).filter(pred)
  .map((k) => ({ k, d: setVal(obj[k], "desktop"), m: setVal(obj[k], "mobile") }))
  .filter((r) => r.d && r.m).sort((a, b) => a.d - b.d);
for (const r of ladder(layout, (k) => /^component-height-\d+$/.test(k))) {
  console.log(W(r.k, 30) + R(r.d + "px", 10) + R(r.m + "px", 9) + R((r.m / r.d).toFixed(2) + "×", 8));
}
console.log("-".repeat(92));
for (const r of ladder(layout, (k) => /^component-edge-to-text-\d+$/.test(k))) {
  console.log(W(r.k, 30) + R(r.d + "px", 10) + R(r.m + "px", 9) + R((r.m / r.d).toFixed(2) + "×", 8));
}

/* ---- The optical rule: control height / label size ---- */
console.log("\n" + "=".repeat(92));
console.log("2 · SPECTRUM — düğme yüksekliği / etiket puntosu (her boy kendi puntosuyla eşlenir)");
console.log("=".repeat(92));
const fs100 = (n, set) => setVal(spec[`font-size-${n}`], set);
// Spectrum pairs t-shirt sizes: height-75 with font-size-75, 100 with 100, ...
for (const n of [75, 100, 200, 300]) {
  const h = { d: setVal(layout[`component-height-${n}`], "desktop"), m: setVal(layout[`component-height-${n}`], "mobile") };
  const f = { d: fs100(n, "desktop"), m: fs100(n, "mobile") };
  const e = { d: setVal(layout[`component-edge-to-text-${n}`], "desktop"), m: setVal(layout[`component-edge-to-text-${n}`], "mobile") };
  if (!h.d || !f.d) continue;
  console.log(`boy ${W(n, 5)} masaüstü: ${R(h.d, 3)}px / ${R(f.d, 2)}px = ${R((h.d / f.d).toFixed(2), 5)}×  yan boşluk ${R(e.d, 3)}px` +
    `   ·   mobil: ${R(h.m, 3)}px / ${R(f.m, 2)}px = ${R((h.m / f.m).toFixed(2), 5)}×  yan boşluk ${R(e.m, 3)}px`);
}

/* ---- Type scale ratios, every system that publishes one ---- */
console.log("\n" + "=".repeat(92));
console.log("3 · PUNTO MERDİVENLERİ — ardışık basamak oranı (bir ölçek ne kadar düzenli?)");
console.log("=".repeat(92));
const scales = {};
scales["spectrum (mobil)"] = Object.keys(spec).filter((k) => /^font-size-\d+$/.test(k))
  .map((k) => setVal(spec[k], "mobile")).filter(Boolean).sort((a, b) => a - b);
scales["spectrum (masaüstü)"] = Object.keys(spec).filter((k) => /^font-size-\d+$/.test(k))
  .map((k) => setVal(spec[k], "desktop")).filter(Boolean).sort((a, b) => a - b);

// IBM Carbon publishes its type scale as a function in the built bundle.
const carbonType = fs.readFileSync(path.join(DS, "carbon-type-11.68.0/package/lib/index.js"), "utf8");
const cbSizes = [...carbonType.matchAll(/fontSize:\s*(?:rem\()?"?([\d.]+)/g)].map((m) => Number(m[1]))
  .filter((v) => v > 0.5 && v < 8).map((v) => Number((v * 16).toFixed(1)));
if (cbSizes.length) scales["carbon"] = [...new Set(cbSizes)].sort((a, b) => a - b);

// Tailwind's text sizes come out of theme.css.
const tw = fs.readFileSync(path.join(DS, "tailwindcss-4.3.3/package/theme.css"), "utf8");
const twSizes = [...tw.matchAll(/--text-[a-z0-9]+:\s*([\d.]+)rem/g)].map((m) => Number((Number(m[1]) * 16).toFixed(1)));
if (twSizes.length) scales["tailwind"] = [...new Set(twSizes)].sort((a, b) => a - b);

scales["BİZ"] = [15, 18, 22, 28, 36];

console.log(W("sistem", 22) + R("basamak", 9) + R("aralık", 12) + R("oran ort", 10) + R("sd", 8) + "  oranlar");
console.log("-".repeat(92));
for (const [name, xs] of Object.entries(scales)) {
  if (xs.length < 3) continue;
  const rs = ratios(xs), st = stats(rs);
  console.log(W(name, 22) + R(xs.length, 9) + R(`${xs[0]}–${xs[xs.length - 1]}px`, 12) +
    R(st.mean, 10) + R(st.sd, 8) + "  " + rs.slice(0, 9).join(" "));
}

/* ---- Primer: what GitHub actually ships for a button, in both themes ---- */
console.log("\n" + "=".repeat(92));
console.log("4 · PRIMER (GitHub) — düğme jetonları: kaç ayrı değer bir düğmeyi tarif ediyor");
console.log("=".repeat(92));
for (const theme of ["light", "dark"]) {
  const f = path.join(DS, `primer-primitives-11.10.0/package/dist/css/functional/themes/${theme}.css`);
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, "utf8");
  const btn = [...txt.matchAll(/--button-([a-zA-Z]+)-([a-zA-Z]+)-([a-zA-Z]+)-([a-zA-Z]+):/g)];
  const kinds = new Set(btn.map((m) => m[1]));
  const props = new Set(btn.map((m) => m[2] + "-" + m[3]));
  const states = new Set(btn.map((m) => m[4]));
  console.log(`${W(theme, 7)} ${R(btn.length, 4)} düğme jetonu · ${kinds.size} çeşit (${[...kinds].join(", ")})`);
  console.log(`        durumlar: ${[...states].join(", ")}`);
  console.log(`        özellikler: ${[...props].slice(0, 8).join(", ")}${props.size > 8 ? ` … (+${props.size - 8})` : ""}`);
}

/* ---- Primer radius + space ladders ---- */
console.log("\n" + "=".repeat(92));
console.log("5 · PRIMER — köşe yarıçapı ve boşluk merdivenleri");
console.log("=".repeat(92));
for (const [label, rel] of [["radius", "dist/css/base/size/size.css"], ["space", "dist/css/base/size/size.css"]]) {
  const f = path.join(DS, "primer-primitives-11.10.0/package", rel);
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, "utf8");
  const found = [...txt.matchAll(new RegExp(`--base-size-(\\d+):\\s*([\\d.]+)(px|rem)`, "g"))]
    .map((m) => ({ k: m[1], v: m[3] === "rem" ? Number(m[2]) * 16 : Number(m[2]) }));
  if (found.length) { console.log(`${label}: ` + found.map((x) => `${x.k}=${x.v}px`).join("  ")); break; }
}
const radiusFile = path.join(DS, "primer-primitives-11.10.0/package/dist/css/functional/size/border.css");
if (fs.existsSync(radiusFile)) {
  const txt = fs.readFileSync(radiusFile, "utf8");
  const rs = [...txt.matchAll(/--borderRadius-([a-zA-Z]+):\s*([^;]+);/g)].map((m) => `${m[1]}=${m[2].trim()}`);
  console.log("yarıçap: " + rs.join("  "));
}
