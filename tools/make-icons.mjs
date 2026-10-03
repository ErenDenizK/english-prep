// Draws the app's icons and its link-preview card, and writes them as PNGs.
//
// They are generated rather than drawn by hand for the same reason the
// palette is measured rather than picked: an icon that exists only as a
// binary blob is an icon nobody can change without redoing it from
// nothing. Everything here comes from the design system's own tokens and
// self-hosted typeface, so the mark remains reproducible.
//
// The outputs are committed. Run this only when the design changes:
//
//   npm run serve &   # it renders the real page's fonts and stylesheet
//   node tools/make-icons.mjs

import { rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:8000";

/** Same resolution dance as tools/verify-ui.mjs — see the note there. */
async function loadChromium() {
  const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
  const directories = [join(globalModules, "playwright"), process.env.PLAYWRIGHT_PATH].filter(Boolean);
  const specifiers = [
    "playwright",
    ...directories.flatMap((directory) => [
      pathToFileURL(join(directory, "index.js")).href,
      pathToFileURL(directory).href,
    ]),
  ];
  for (const specifier of specifiers) {
    try {
      const module = await import(specifier);
      const chromium = module.chromium ?? module.default?.chromium;
      if (chromium) {
        return chromium;
      }
    } catch {
      // next
    }
  }
  return null;
}

const chromium = await loadChromium();
if (!chromium) {
  console.error("playwright bulunamadı — tools/verify-ui.mjs'deki nota bak.");
  process.exit(2);
}

/**
 * The icon: the ep. wordmark, primary ink and blue on the app's charcoal.
 *
 * Not a rounded square with a margin — iOS and Android both apply their
 * own mask, and a shape that has already rounded itself ends up with two
 * corners. Full bleed, and the glyph sized to survive that mask: it sits
 * inside the middle 62%, which is inside every platform's safe area.
 */
const ICON_PAGE = (size) => `
<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family: Inter; src:url('../assets/fonts/InterVariable.woff2'); font-weight:100 900; }
  html, body { margin:0; width:${size}px; height:${size}px; }
  body { background:#141216; display:grid; place-items:center; }
  .mark { color:#eee9ed; font:600 ${Math.round(size * .42)}px/1 Inter,sans-serif; letter-spacing:-.06em; transform:translateY(-.035em); }
  .mark span { color:#ed96b4; }
</style>
<div class="mark" id="brand-mark">ep<span>.</span></div>`;

/**
 * The link-preview card. This app is distributed by pasting a URL into a
 * group chat, so this image *is* the first impression — and today that
 * preview is blank.
 */
const CARD_PAGE = `
<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family:Inter; src:url('../assets/fonts/InterVariable.woff2'); font-weight:100 900; }
  * { box-sizing:border-box; }
  html,body { margin:0; width:1200px; height:630px; }
  body { background:#141216; color:#eee9ed; font-family:Inter,sans-serif; padding:64px 80px; display:grid; align-content:space-between; }
  .brand { font-size:32px; font-weight:600; letter-spacing:-1px; }
  h1 { font-size:76px; line-height:1.12; font-weight:600; letter-spacing:-3px; margin:0; }
  span { color:#ed96b4; }
  p { font-size:28px; color:#c6bcc6; margin:0; }
</style>
<div class="brand" id="brand-mark">english prep<span>.</span></div>
<h1>Bildiğin İngilizce.<br><span>Daha net ayrımlar.</span></h1>
<p>Oku. Ayırt et. Uygula.</p>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const written = [];

// The generator pages are written into the repo and served, rather than
// injected with setContent: a page created that way has no origin, so its
// local font URLs must resolve against the app origin. They are deleted again below.
const SCRATCH = "icons/_render.html";
const CARD_SCRATCH = "icons/_card.html";

async function shoot(url, width, height, file) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("#brand-mark");
  // Wait for the self-hosted face, not a fallback rendering.
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(200);
  await writeFile(join(ROOT, file), await page.screenshot());
  await page.close();
  written.push(file);
}

try {
  for (const size of [180, 192, 512]) {
    await writeFile(join(ROOT, SCRATCH), ICON_PAGE(size));
    await shoot(`${BASE}/${SCRATCH}`, size, size, `icons/icon-${size}.png`);
  }
  await writeFile(join(ROOT, CARD_SCRATCH), CARD_PAGE);
  await shoot(`${BASE}/${CARD_SCRATCH}`, 1200, 630, "icons/social-card.png");
} finally {
  await rm(join(ROOT, SCRATCH), { force: true });
  await rm(join(ROOT, CARD_SCRATCH), { force: true });
  await browser.close();
}

console.log(`wrote:\n${written.map((file) => `  ${file}`).join("\n")}`);
