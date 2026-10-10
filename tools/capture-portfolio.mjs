#!/usr/bin/env node
// Captures the screens and the signature clip the maker's portfolio needs for
// English Prep's embassy (docs/family/README.md). Development tooling only:
// the app never loads it, and it adds no dependency. Playwright is found the
// way tools/verify-ui.mjs finds it (global install or $PLAYWRIGHT_PATH).
//
// It serves nothing itself. Start the static server first:
//
//   npm run serve &
//   node tools/capture-portfolio.mjs [baseUrl]      (default http://localhost:8000)
//
// Writes to captures/portfolio/ (gitignored):
//   <screen>-wide.png    1440×900 at 2×      home, lesson, question, results, about
//   <screen>-phone.png   390×844 at 2×, plus folio-phone (About's folio in view)
//   <screen>-*.webp      the same, when ffmpeg is on PATH (lossless quality 94)
//   answer-wide.webm     ~8 s at 1440×900: a correct answer (Sakura, Doğru),
//   answer-phone.webm    then the next question answered wrong (periwinkle, Yanlış)
//   answer-*-poster.png  the clip's first settled frame, for poster-first playback
//
// Everything on screen is the real app: the real question bank, scoring and
// DOM. The quiz session and the results are seeded through the app's own
// modules (the same route as tools/capture-portfolio.py, which keeps About's
// committed assets), so no screen is mocked. Stills use reduced motion, which
// shows the aurora as its three still pools and makes every frame repeatable;
// the clips run with motion on, as a learner sees it.

import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const BASE = (process.argv[2] ?? "http://localhost:8000").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "captures", "portfolio");
const LESSON = "tenses-present-perfect-vs-past-simple";
const TOPIC = "modals";
const SIZES = [
  { name: "wide", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];
const DPR = 2;

async function loadChromium() {
  const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
  const directories = [join(globalModules, "playwright"), process.env.PLAYWRIGHT_PATH].filter(Boolean);
  const specifiers = [
    "playwright",
    ...directories.flatMap((directory) => [pathToFileURL(join(directory, "index.js")).href, pathToFileURL(directory).href]),
  ];
  for (const specifier of specifiers) {
    try {
      const module = await import(specifier);
      const chromium = module.chromium ?? module.default?.chromium;
      if (chromium) return chromium;
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

const chromium = await loadChromium();
if (!chromium) {
  console.error(
    "playwright bulunamadı. Bu araç projenin bağımlılığı değildir; kurulu olduğu dizini göster:\n" +
      "  PLAYWRIGHT_PATH=/usr/lib/node_modules/playwright node tools/capture-portfolio.mjs"
  );
  process.exit(2);
}

const hasFfmpeg = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
function ffmpeg(args) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

// The same deterministic session the About captures use: the five shortest
// prompts of one topic, answered in order. Runs inside the page, through the
// app's own modules, so an invalid session is refused exactly as in the app.
async function seedQuiz(page) {
  return page.evaluate(async (topicId) => {
    const { loadManifest, loadQuestionsForTopics } = await import("./js/topics.js");
    const state = await import("./js/session-state.js");
    const topic = (await loadManifest()).topics.find((t) => t.id === topicId);
    const bank = await loadQuestionsForTopics([topic]);
    const session = [...bank].sort((a, b) => a.prompt.length - b.prompt.length || a.id.localeCompare(b.id)).slice(0, 5);
    const request = { mode: "topic", topicIds: [topicId], count: 5 };
    const snapshot = state.createQuizSnapshot({
      attemptId: "portfolio-demo", date: new Date().toISOString(), request, session,
      selectedAnswers: session.map(() => null), currentIndex: 0, optionsHidden: false,
    }, bank);
    if (!state.setQuizRequest(request) || !state.setActiveQuiz(snapshot)) throw new Error("Invalid demo session");
    return session.map((q) => ({ correct: q.correctAnswer, wrong: q.options.find((o) => o !== q.correctAnswer) }));
  }, TOPIC);
}

async function seedResults(page) {
  await page.evaluate(async (topicId) => {
    const { loadManifest, loadQuestionsForTopics } = await import("./js/topics.js");
    const { scoreSession } = await import("./js/quiz-engine.js");
    const { setQuizResult } = await import("./js/session-state.js");
    const topic = (await loadManifest()).topics.find((t) => t.id === topicId);
    const bank = await loadQuestionsForTopics([topic]);
    const session = [...bank].sort((a, b) => a.prompt.length - b.prompt.length || a.id.localeCompare(b.id)).slice(0, 5);
    const answers = session.map((q, i) => (i === 0 ? q.options.find((o) => o !== q.correctAnswer) : q.correctAnswer));
    const result = { ...scoreSession(session, answers), date: new Date().toISOString(), mode: "topic", topicTitles: { [topicId]: topic.title }, recorded: true };
    if (!setQuizResult(result)) throw new Error("Invalid demo result");
  }, TOPIC);
}

async function prepare(context) {
  await context.addInitScript(() => {
    try {
      localStorage.setItem("englishPrep.onboarded", "1");
      localStorage.setItem("englishPrep.theme", "dark");
    } catch {
      /* storage unavailable */
    }
  });
}

async function settle(page, ms = 250) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

const optionWith = (page, text) => page.locator(".option").filter({ has: page.locator(".option__text", { hasText: text }) }).first();

const written = [];
async function shot(page, name, size) {
  const path = join(OUT, `${name}-${size}.png`);
  await page.screenshot({ path });
  written.push(path);
  if (hasFfmpeg) {
    const webp = path.replace(/\.png$/, ".webp");
    ffmpeg(["-i", path, "-c:v", "libwebp", "-quality", "94", "-compression_level", "6", webp]);
    written.push(webp);
  }
}

async function stills(browser, size) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height }, deviceScaleFactor: DPR,
    colorScheme: "dark", reducedMotion: "reduce", serviceWorkers: "block",
  });
  await prepare(context);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  // Home: Eğitim with one lesson part-read, so the resume line is real.
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForSelector("#index-list .tile");
  await page.evaluate(async (id) => {
    const { recordLessonRead } = await import("./js/storage.js");
    recordLessonRead(id, 0.42);
  }, LESSON);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#index-list .tile");
  await settle(page);
  await shot(page, "home", size.name);

  await page.goto(`${BASE}/index.html#egitim/${LESSON}`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-reading-start]");
  await page.evaluate(() => { document.querySelector("#shell-scroll").scrollTop = 0; });
  await settle(page);
  await shot(page, "lesson", size.name);

  const answers = await seedQuiz(page);
  await page.goto(`${BASE}/quiz.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".option");
  await optionWith(page, answers[0].correct).click();
  await page.waitForSelector(".feedback");
  await page.evaluate(() => { document.querySelector("#shell-scroll").scrollTop = 0; });
  await settle(page);
  await shot(page, "question", size.name);

  await seedResults(page);
  await page.goto(`${BASE}/results.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".score__metric");
  await settle(page);
  await shot(page, "results", size.name);

  await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#folio-deck .folio-leaf");
  await settle(page, 400);
  await shot(page, "about", size.name);
  if (size.name === "phone") {
    // On a phone the folio sits below the headline; give it a frame of its own.
    await page.evaluate(() => document.querySelector("#study-folio").scrollIntoView({ block: "start" }));
    await settle(page, 400);
    await shot(page, "folio", size.name);
  }

  await context.close();
  if (errors.length) throw new Error(`${size.name}: ${errors.join("; ")}`);
}

// The signature: an answer committed. The Sakura confirmation with its check
// and Doğru, the next question entering on the route glide, then a wrong
// answer in periwinkle with Yanlış. Motion on, as a learner sees it.
async function clip(browser, size) {
  const seedContext = await browser.newContext({ viewport: { width: size.width, height: size.height }, serviceWorkers: "block" });
  await prepare(seedContext);
  const seedPage = await seedContext.newPage();
  await seedPage.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  const answers = await seedQuiz(seedPage);
  const session = await seedPage.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(sessionStorage))));
  await seedContext.close();

  const videoDir = join(OUT, `.video-${size.name}`);
  await rm(videoDir, { recursive: true, force: true });
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1,
    colorScheme: "dark", reducedMotion: "no-preference", serviceWorkers: "block",
    recordVideo: { dir: videoDir, size: { width: size.width, height: size.height } },
  });
  await prepare(context);
  // sessionStorage is per tab, so the seeded quiz is replayed into the new one
  // before any app script runs; only keys the app has not written yet are set.
  await context.addInitScript((json) => {
    for (const [key, value] of Object.entries(JSON.parse(json))) {
      if (sessionStorage.getItem(key) === null) sessionStorage.setItem(key, value);
    }
  }, session);
  const page = await context.newPage();
  const started = Date.now();
  await page.goto(`${BASE}/quiz.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".option");
  await settle(page, 50);
  const leadIn = (Date.now() - started) / 1000;
  await page.waitForTimeout(1200);

  const first = optionWith(page, answers[0].correct);
  await first.hover();
  await page.waitForTimeout(350);
  await first.click();
  await page.waitForSelector(".feedback");
  await page.waitForTimeout(2200);
  await page.getByRole("button", { name: "Sonraki soru" }).click();
  await page.waitForSelector(".option:not(.option--ok)");
  await page.waitForTimeout(1300);
  const second = optionWith(page, answers[1].wrong);
  await second.hover();
  await page.waitForTimeout(350);
  await second.click();
  await page.waitForSelector(".feedback");
  await page.waitForTimeout(2300);

  const video = page.video();
  await context.close();
  const raw = await video.path();
  const target = join(OUT, `answer-${size.name}.webm`);
  const poster = join(OUT, `answer-${size.name}-poster.png`);
  if (hasFfmpeg) {
    // Trim the blank page load and re-encode once as VP9 at constant quality.
    const start = Math.max(0, leadIn - 0.1).toFixed(2);
    ffmpeg(["-ss", start, "-i", raw, "-c:v", "libvpx-vp9", "-crf", "24", "-b:v", "0", "-row-mt", "1", "-an", target]);
    ffmpeg(["-ss", "1.0", "-i", target, "-frames:v", "1", poster]);
    written.push(target, poster);
  } else {
    await rename(raw, target);
    written.push(target);
  }
  await rm(videoDir, { recursive: true, force: true });
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  for (const size of SIZES) await stills(browser, size);
  for (const size of SIZES) await clip(browser, size);
} finally {
  await browser.close();
}
for (const path of written) {
  const { size } = await stat(path);
  console.log(`${path.slice(ROOT.length + 1)}  ${(size / 1024).toFixed(0)} KB`);
}
const leftovers = (await readdir(OUT)).filter((name) => name.startsWith(".video-"));
if (leftovers.length) console.warn(`left behind: ${leftovers.join(", ")}`);
