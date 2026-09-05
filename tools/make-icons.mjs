// Draws the app's icons and its link-preview card, and writes them as PNGs.
//
// They are generated rather than drawn by hand for the same reason the
// palette is measured rather than picked: an icon that exists only as a
// binary blob is an icon nobody can change without redoing it from
// nothing. Everything here comes from the design system's own tokens and
// from js/icons.js, so the icon is the app's icon by construction.
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
 * The icon: the app's own book glyph, amber on the app's near-black.
 *
 * Not a rounded square with a margin — iOS and Android both apply their
 * own mask, and a shape that has already rounded itself ends up with two
 * corners. Full bleed, and the glyph sized to survive that mask: it sits
 * inside the middle 62%, which is inside every platform's safe area.
 */
const ICON_PAGE = (size) => `
<!doctype html><meta charset="utf-8">
<style>
  html, body { margin: 0; width: ${size}px; height: ${size}px; }
  body { background: #13100d; display: grid; place-items: center; }
  svg { width: ${Math.round(size * 0.62)}px; height: ${Math.round(size * 0.62)}px; color: #efb05c; }
</style>
<div id="host"></div>
<script type="module">
  import { icon } from "../js/icons.js";
  document.getElementById("host").appendChild(icon("book-fill", { size: ${Math.round(size * 0.62)} }));
</script>`;

/**
 * The link-preview card. This app is distributed by pasting a URL into a
 * group chat, so this image *is* the first impression — and today that
 * preview is blank.
 */
const CARD_PAGE = `
<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="../css/fonts.css">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    background: #13100d; color: #edeae6;
    font-family: "Source Sans 3", system-ui, sans-serif;
    display: grid; align-content: center; gap: 28px;
    padding: 0 96px; box-sizing: border-box;
  }
  h1 {
    margin: 0; font-family: "Source Serif 4", Georgia, serif; font-weight: 400;
    font-size: 96px; line-height: 1; letter-spacing: -0.015em;
  }
  .rule { width: 96px; height: 4px; background: #efb05c; border-radius: 999px; }
  p { margin: 0; font-size: 34px; line-height: 1.4; color: #d6d1cb; max-width: 22ch; }
  .glyph { position: absolute; right: 96px; bottom: 84px; color: #efb05c; }
</style>
<h1>English Prep</h1>
<div class="rule"></div>
<p>Üniversite İngilizce yeterlik sınavı için ders ve test.</p>
<div class="glyph" id="glyph"></div>
<script type="module">
  import { icon } from "../js/icons.js";
  document.getElementById("glyph").appendChild(icon("book-fill", { size: 160 }));
</script>`;

const browser = await chromium.launch();
const written = [];

// The generator pages are written into the repo and served, rather than
// injected with setContent: a page created that way has no origin, so its
// module import of js/icons.js — the whole point of generating rather than
// hand-drawing — is refused. They are deleted again below.
const SCRATCH = "icons/_render.html";
const CARD_SCRATCH = "icons/_card.html";

async function shoot(url, width, height, file) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("svg") !== null);
  // The webfont lands after the module does.
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
