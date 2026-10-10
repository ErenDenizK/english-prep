#!/usr/bin/env node
// Pulls colour ramps out of the real token packages of thirteen design
// systems, plus our own stylesheet, into one shape:
//   { system, ramp, theme, steps: [{ step, hex }] }
// so a single instrument can measure all of them the same way.
//
// Each system ships its tokens differently, so each gets a small parser.
// Nothing here guesses: a parser either finds the declared values or the
// system is reported as unread.

import fs from "node:fs";
import path from "node:path";
import { parseCssOklch } from "./lib-oklch.mjs";
import { oklch } from "../../../tools/color.mjs";

const DS = process.env.DS_DIR;
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);
const out = [];
/** "#rrggbb" or "rgb(r, g, b)" -> "#rrggbb"; anything else -> null. */
function toHex(str) {
  const v = String(str).trim();
  if (v.startsWith("#")) return v.length >= 7 ? v.slice(0, 7).toLowerCase() : null;
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(v);
  if (!m) return null;
  return "#" + [1, 2, 3].map((i) => Math.round(Number(m[i])).toString(16).padStart(2, "0")).join("");
}
const push = (system, ramp, theme, steps) => {
  if (steps.length >= 3) out.push({ system, ramp, theme, steps });
};

/* ---- Radix Colors: one css file per scale, hex in :root / .dark ---- */
function radix(dir) {
  if (!exists(dir)) return;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".css"))) {
    if (f.includes("alpha")) continue; // alpha scales are not solid colours
    const txt = read(path.join(dir, f));
    const head = txt.split("@supports")[0]; // sRGB block only, not the P3 one
    const theme = f.includes("-dark") ? "dark" : "light";
    const ramp = f.replace(".css", "").replace("-dark", "");
    const steps = [];
    for (const m of head.matchAll(/--[a-z]+-(\d+):\s*(#[0-9a-f]{6})/g)) {
      steps.push({ step: Number(m[1]), hex: m[2] });
    }
    push("radix", ramp, theme, steps.sort((a, b) => a.step - b.step));
  }
}

/* ---- Tailwind v4: theme.css, already in oklch() ---- */
function tailwind(file) {
  if (!exists(file)) return;
  const txt = read(file);
  const byRamp = new Map();
  for (const m of txt.matchAll(/--color-([a-z]+)-(\d+):\s*(oklch\([^)]+\))/g)) {
    const p = parseCssOklch(m[3]);
    if (!p) continue;
    if (!byRamp.has(m[1])) byRamp.set(m[1], []);
    byRamp.get(m[1]).push({ step: Number(m[2]), hex: oklch(p.L, p.C, p.H).hex });
  }
  for (const [ramp, steps] of byRamp) {
    push("tailwind", ramp, "single", steps.sort((a, b) => a.step - b.step));
  }
}

/* ---- IBM Carbon: const name<step> = "#hex" in the built bundle ---- */
function carbon(file) {
  if (!exists(file)) return;
  const txt = read(file);
  const byRamp = new Map();
  for (const m of txt.matchAll(/const ([a-zA-Z]+?)(\d0{1,2})\s*=\s*"(#[0-9a-f]{6})"/g)) {
    const ramp = m[1];
    if (!byRamp.has(ramp)) byRamp.set(ramp, []);
    byRamp.get(ramp).push({ step: Number(m[2]), hex: m[3] });
  }
  for (const [ramp, steps] of byRamp) {
    push("carbon", ramp, "single", steps.sort((a, b) => a.step - b.step));
  }
}

/* ---- Open Color: plain JSON arrays, index 0..9 ---- */
function openColor(file) {
  if (!exists(file)) return;
  const d = JSON.parse(read(file));
  for (const [ramp, v] of Object.entries(d)) {
    if (!Array.isArray(v)) continue;
    push("open-color", ramp, "single", v.map((hex, i) => ({ step: i, hex })));
  }
}

/* ---- Ant Design: generated palettes, {name: [..10]} ---- */
function antd(dir) {
  const cand = [path.join(dir, "lib", "presets.js"), path.join(dir, "es", "presets.js")].find(exists);
  if (!cand) return;
  const txt = read(cand);
  // Each preset is `const name = exports.name = ["#...", ...]` — 10 steps.
  for (const m of txt.matchAll(/(?:const|var)\s+(\w+)\s*=\s*(?:exports\.\w+\s*=\s*)?\[([^\]]*?"#[0-9a-fA-F]{6}"[^\]]*?)\]/g)) {
    const hexes = [...m[2].matchAll(/#[0-9a-fA-F]{6}/g)].map((x) => x[0].toLowerCase());
    if (hexes.length < 6) continue;
    const dark = /Dark$/.test(m[1]);
    push("ant-design", m[1].replace(/Dark$/, ""), dark ? "dark" : "light",
      hexes.map((hex, i) => ({ step: i + 1, hex })));
  }
}

/* ---- Primer (GitHub): base scales, {color:{scale:{gray:{0..9:{value}}}}} ---- */
function primer(dir) {
  const css = path.join(dir, "dist", "css", "primitives.css");
  if (exists(css)) {
    const txt = read(css);
    const byRamp = new Map();
    for (const m of txt.matchAll(/--base-color-scale-([a-z]+)-(\d+):\s*(#[0-9a-fA-F]{6})/g)) {
      const key = m[1];
      if (!byRamp.has(key)) byRamp.set(key, []);
      byRamp.get(key).push({ step: Number(m[2]), hex: m[3].toLowerCase() });
    }
    for (const [ramp, steps] of byRamp) {
      push("primer", ramp, "single", steps.sort((a, b) => a.step - b.step));
    }
    if (byRamp.size) return;
  }
  const cand = [path.join(dir, "dist", "styleLint", "base", "color", "light.json")].find(exists);
  if (!cand) return;
  const walk = (node, trail) => {
    if (node && typeof node === "object" && typeof node.value === "string" && node.value.startsWith("#")) {
      return [[trail, node.value]];
    }
    if (!node || typeof node !== "object") return [];
    return Object.entries(node).flatMap(([k, v]) => walk(v, trail.concat(k)));
  };
  const flat = walk(JSON.parse(read(cand)), []);
  const byRamp = new Map();
  for (const [trail, hex] of flat) {
    const step = Number(trail[trail.length - 1]);
    if (!Number.isFinite(step)) continue;
    const ramp = trail.slice(0, -1).filter((s) => s !== "color" && s !== "base" && s !== "scale").join("-");
    if (!byRamp.has(ramp)) byRamp.set(ramp, []);
    byRamp.get(ramp).push({ step, hex });
  }
  for (const [ramp, steps] of byRamp) {
    push("primer", ramp, "light", steps.sort((a, b) => a.step - b.step));
  }
}

/* ---- Adobe Spectrum: color-palette.json, sets per theme ---- */
function spectrum(file) {
  if (!exists(file)) return;
  const d = JSON.parse(read(file));
  const themes = { light: new Map(), dark: new Map() };
  for (const [key, tok] of Object.entries(d)) {
    const m = /^([a-z]+(?:-[a-z]+)*)-(\d+)$/.exec(key);
    if (!m || !tok || !tok.sets) continue;
    for (const theme of ["light", "dark"]) {
      const v = tok.sets[theme];
      const hex = v && typeof v.value === "string" ? toHex(v.value) : null;
      if (!hex) continue;
      if (!themes[theme].has(m[1])) themes[theme].set(m[1], []);
      themes[theme].get(m[1]).push({ step: Number(m[2]), hex });
    }
  }
  for (const theme of ["light", "dark"]) {
    for (const [ramp, steps] of themes[theme]) {
      push("spectrum", ramp, theme, steps.sort((a, b) => a.step - b.step));
    }
  }
}

/* ---- Our own app: css/style.css, both themes ---- */
function ours(file) {
  if (!exists(file)) return;
  const txt = read(file);
  const grab = (blockRe) => {
    const m = blockRe.exec(txt);
    if (!m) return new Map();
    const map = new Map();
    for (const d of m[1].matchAll(/(--c-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      const raw = d[2].trim();
      let hex = null;
      if (raw.startsWith("#")) hex = raw.slice(0, 7);
      else if (raw.startsWith("oklch")) {
        const p = parseCssOklch(raw);
        if (p) hex = oklch(p.L, p.C, p.H).hex;
      }
      if (hex) map.set(d[1], hex);
    }
    return map;
  };
  // The two theme blocks, taken up to the next selector at column 0.
  const dark = grab(/:root\s*\{([\s\S]*?)\n\}/);
  const light = grab(/\[data-theme=["']light["']\]\s*\{([\s\S]*?)\n\}/);
  for (const [theme, map] of [["dark", dark], ["light", light]]) {
    if (map.size) out.push({ system: "ours", ramp: "tokens", theme, steps: [...map].map(([k, hex], i) => ({ step: i, name: k, hex })) });
  }
}

radix(path.join(DS, "radix-ui-colors-3.0.0/package"));
tailwind(path.join(DS, "tailwindcss-4.3.3/package/theme.css"));
carbon(path.join(DS, "carbon-colors-11.59.0/package/lib/index.js"));
openColor(path.join(DS, "open-color-1.9.1/package/open-color.json"));
antd(path.join(DS, "ant-design-colors-8.0.1/package"));
primer(path.join(DS, "primer-primitives-11.10.0/package"));
spectrum(path.join(DS, "adobe-spectrum-tokens-15.4.1/package/src/color-palette.json"));
ours("/home/user/english-prep/css/style.css");

const summary = {};
for (const r of out) {
  summary[r.system] ??= { ramps: 0, steps: 0, themes: new Set() };
  summary[r.system].ramps++;
  summary[r.system].steps += r.steps.length;
  summary[r.system].themes.add(r.theme);
}
for (const [s, v] of Object.entries(summary)) {
  console.error(`${s.padEnd(12)} ${String(v.ramps).padStart(3)} ramp(s)  ${String(v.steps).padStart(4)} colours  themes: ${[...v.themes].join("/")}`);
}
fs.writeFileSync(process.argv[2] || "/dev/stdout", JSON.stringify(out, null, 1));
