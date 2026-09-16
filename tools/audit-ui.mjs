// Measures the app against docs/design-system.md, screen by screen.
//
// Separate from tools/verify-ui.mjs on purpose: that one asserts a
// contract and fails the build, this one reports numbers a designer
// argues about. The §7 rules it counts — one filled button per screen,
// at most one card level and nothing framed inside a framed thing, a
// row's secondary line is one line always — are the three that a human
// eye reads as "this looks off" without being able to say why.
//
// It exists because a UI/UX claim made from reading the stylesheet is a
// guess. The first pass of this audit reported the mistake book on a
// store that had never been used, because localStorage survived between
// screens; the `localStorage.clear()` below is that bug's fix and the
// reason every number here is taken from a screen built from scratch.
//
//   npm run serve &
//   node tools/audit-ui.mjs
//
// Needs Playwright, which is deliberately not a dependency — the loader
// is the same two-way unwrap as verify-ui.mjs.

// A UI/UX audit that measures. Every number is taken from the running app.
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";

// Same two-way unwrap as tools/verify-ui.mjs: a CJS module reached by path
// puts everything on `default` rather than on named exports.
const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
const mod = await import(pathToFileURL(join(globalModules, "playwright", "index.js")).href);
const chromium = mod.chromium ?? mod.default?.chromium;
const BASE = "http://localhost:8000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
const page = await ctx.newPage();

async function screen(hash, seed) {
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  // Clear first. Without this a seeded screen leaks into the next
  // "first run" measurement, which is how the first pass of this audit
  // reported the mistake book on a store that had never been used.
  await page.evaluate(() => localStorage.clear());
  if (seed) await page.evaluate(seed);
  await page.goto(`${BASE}/index.html${hash}`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}

async function report(label, root) {
  const m = await page.evaluate((sel) => {
    const scope = document.querySelector(sel);
    if (!scope) return null;
    const vis = (el) => el.offsetParent !== null || el === document.body;
    // Screen-level, not container-level: "one filled button per screen"
    // (§7.2) counts the shell's action bar too, and the first version of
    // this audit scoped it to the content root and reported the topic
    // screen as having no primary when its primary was in the bar.
    const filled = [...document.querySelectorAll(".btn--primary")].filter(vis);
    const surfaces = [...scope.querySelectorAll(".surface")].filter(vis);
    const nested = surfaces.filter((s) => s.parentElement.closest(".surface"));
    // A row's secondary line must be ONE line (§7.1).
    const subs = [...scope.querySelectorAll(".row__sub")].filter(vis).map((el) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
      return Math.round(el.getBoundingClientRect().height / lh);
    });
    return {
      height: Math.round(document.querySelector("#shell-scroll")?.scrollHeight ?? 0),
      filled: filled.length,
      filledLabels: filled.map((b) => b.textContent.trim().slice(0, 24)),
      surfaces: surfaces.length,
      nestedSurfaces: nested.length,
      rows: [...scope.querySelectorAll(".row")].filter(vis).length,
      subsOverOneLine: subs.filter((n) => n > 1).length,
      subsTotal: subs.length,
    };
  }, root);
  if (!m) return console.log(`${label}: (not rendered)`);
  console.log(
    `${label.padEnd(26)} h=${String(m.height).padStart(5)}px  filled=${m.filled} ${JSON.stringify(m.filledLabels)}` +
    `  surfaces=${m.surfaces}(nested ${m.nestedSurfaces})  rows=${m.rows}` +
    `  wrapped row__sub=${m.subsOverOneLine}/${m.subsTotal}`
  );
}

const attempt = {
  date: new Date().toISOString(), mode: "mixed",
  topicBreakdown: { tenses: { correct: 1, total: 6 } },
  categoryBreakdown: { "Present Simple vs Present Continuous": { correct: 1, total: 6 } },
  questions: [0,1,2,3,4,5].map((i) => ({ id: "tenses-t"+i, topicId: "tenses", category: "Present Simple vs Present Continuous", correct: i === 0 })),
};
const seedHistory = new Function(`localStorage.setItem("englishPrep.history", ${JSON.stringify(JSON.stringify({ attempts: [attempt] }))});`);

await screen("#egitim", null);            await report("Eğitim · ilk açılış", "#view-egitim");
await screen("#egitim", seedHistory);      await report("Eğitim · test geçmişli", "#view-egitim");
await screen("#egitim/konu/tenses", null); await report("Konu girişi (tenses)", "#lesson-reader");
await screen("#test", null);               await report("Test · ilk açılış", "#test-panel");
await screen("#test", seedHistory);        await report("Test · geçmişli", "#test-panel");
await screen("#profil", seedHistory);      await report("Profil", "#profile-container");

await browser.close();
