#!/usr/bin/env node
// Measures every control the app actually draws, in Chromium, at phone width:
// height, padding, label size, weight, radius, and the height/label ratio the
// real design systems publish. The owner said the buttons and menus do not fit
// together; this is that claim turned into numbers.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { createRequire } from "node:module";

const ROOT = "/home/user/english-prep";
const PORT = 8123;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const server = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    const body = await readFile(p);
    res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((r) => server.listen(PORT, r));

const require = createRequire(import.meta.url);
const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
const { chromium } = require(join(globalModules, "playwright"));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

const PROBE = () => {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const seen = [];
  const sel = "button, a.btn, .btn, .tab, .nav a, .nav button, [role=tab], input, select, .option, .listbox__trigger, .chip";
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const s = getComputedStyle(el);
    const label = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 26);
    seen.push({
      cls: (el.className || el.tagName).toString().split(" ").filter(Boolean).slice(0, 3).join(".") || el.tagName,
      label,
      h: px(r.height), w: px(r.width),
      fs: px(s.fontSize), fw: s.fontWeight, lh: s.lineHeight,
      padY: px(s.paddingTop) + px(s.paddingBottom), padX: px(s.paddingLeft) + px(s.paddingRight),
      radius: s.borderTopLeftRadius, border: s.borderTopWidth + " " + s.borderTopStyle,
      bg: s.backgroundColor, color: s.color,
      minH: s.minHeight,
    });
  }
  return seen;
};

const out = {};
for (const [name, url] of [["components", `http://127.0.0.1:${PORT}/docs/components.html`], ["app", `http://127.0.0.1:${PORT}/index.html`]]) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  out[name] = await page.evaluate(PROBE);
}
await browser.close();
server.close();

const R = (s, n) => String(s ?? "—").padStart(n);
const W = (s, n) => String(s).padEnd(n);

for (const [scope, rows] of Object.entries(out)) {
  // One row per distinct geometry, so a list of twenty identical options
  // reports once with a count.
  const key = (r) => [r.cls, r.h, r.fs, r.fw, r.padX, r.radius].join("|");
  const groups = new Map();
  for (const r of rows) {
    if (!groups.has(key(r))) groups.set(key(r), { ...r, n: 0 });
    groups.get(key(r)).n++;
  }
  console.log("\n" + "=".repeat(112));
  console.log(`${scope.toUpperCase()} — 390px, ${rows.length} kontrol, ${groups.size} ayrı geometri`);
  console.log("=".repeat(112));
  console.log(W("sınıf", 26) + R("×", 3) + R("yük", 7) + R("punto", 7) + R("ağır", 6) + R("y/p", 7) + R("yanPad", 8) + R("dikPad", 8) + R("yarıçap", 9) + "  etiket");
  console.log("-".repeat(112));
  for (const g of [...groups.values()].sort((a, b) => b.h - a.h || a.cls.localeCompare(b.cls))) {
    const ratio = g.fs ? (g.h / g.fs).toFixed(2) : "—";
    console.log(W(g.cls.slice(0, 26), 26) + R(g.n, 3) + R(g.h, 7) + R(g.fs, 7) + R(g.fw, 6) + R(ratio, 7) +
      R(g.padX, 8) + R(g.padY, 8) + R(g.radius, 9) + "  " + g.label);
  }
  // The two numbers the systems publish: height/label ratio, and the spread
  // of distinct control heights and radii on one screen.
  const hs = [...new Set([...groups.values()].map((g) => g.h))].sort((a, b) => a - b);
  const fss = [...new Set([...groups.values()].map((g) => g.fs))].sort((a, b) => a - b);
  const rads = [...new Set([...groups.values()].map((g) => g.radius))];
  const ratios = [...groups.values()].filter((g) => g.fs && g.h).map((g) => g.h / g.fs);
  console.log("-".repeat(112));
  console.log(`ayrı yükseklik: ${hs.length} (${hs.join(", ")})`);
  console.log(`ayrı punto:     ${fss.length} (${fss.join(", ")})`);
  console.log(`ayrı yarıçap:   ${rads.length} (${rads.join(", ")})`);
  if (ratios.length) console.log(`yük/punto oranı: ${Math.min(...ratios).toFixed(2)}×–${Math.max(...ratios).toFixed(2)}×  (Spectrum yayınlıyor: 2.00–2.73×)`);
  const under = [...groups.values()].filter((g) => g.h < 44);
  if (under.length) console.log(`44px altı: ${under.map((g) => `${g.cls}(${g.h})`).join(", ")}`);
}
