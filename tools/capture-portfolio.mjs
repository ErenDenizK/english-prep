#!/usr/bin/env node
// Captures the screens and the signature clip the maker's portfolio needs for
// English Prep's embassy, to the family kit's presentation spec
// (docs/family/kit/presentation.md §3–§5; how to run: docs/family/CAPTURES.md).
// Development tooling only: the app never loads it, and it adds no
// dependency. Playwright is found as tools/verify-ui.mjs finds it (global
// install or $PLAYWRIGHT_PATH); Chromium from $CHROMIUM_PATH or Playwright.
//
// It serves nothing itself. Start a static server on the working tree first:
//
//   npm run serve &
//   node tools/capture-portfolio.mjs [baseUrl]      (default http://localhost:8000)
//   node tools/make-world.mjs                        (fills world.json's captures)
//
// Writes lossless PNG masters and the clip to captures/portfolio/
// (gitignored), named as the kit names them (presentation.md §4), plus
// manifest.json: the build (app commit, sw.js VERSION) of every file.
//
// Everything on screen is the real app: the real question bank, scoring and
// DOM. The quiz session and the reading progress are seeded through the
// app's own modules, so no screen is mocked. Stills use reduced motion, which
// shows the aurora as its three still pools and makes every frame
// repeatable; the clip runs with motion on, as a learner sees it.
//
// The clip is frames, not a screen recorder (presentation.md §5): the page's
// animations are slowed through CDP (Animation.setPlaybackRate), lossless
// 2× PNG frames are taken with Page.captureScreenshot (the screencast caps
// its frames at CSS pixels; see signature()), resampled to 60 fps at the
// real rate, then encoded AV1 10-bit, HEVC Main 10 (hvc1) and H.264. The transfer is tagged sRGB (iec61966-2-1,
// transfer 13), not bt709: Safari brightens bt709-tagged UI (the portfolio's
// media note). Without ffmpeg the frames stay on disk with encode.sh beside
// them.

import { link, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SITE = "https://erendenizk.github.io/english-prep/";
export const REPO = "ErenDenizK/english-prep";

// Kit sizes (presentation.md §3): wide is required, the tablet is touch, the
// phone is a touch device with a mobile viewport.
export const SIZES = Object.freeze({
  wide: { width: 1440, height: 900, touch: false, mobile: false },
  touch: { width: 1180, height: 820, touch: true, mobile: false },
  phone: { width: 390, height: 844, touch: true, mobile: true },
});
const DPR = 2;
const CLIP_SECONDS = 7;
const fileName = (view, size, suffix = ".png") => `english-prep-${view}-${SIZES[size].width}x${SIZES[size].height}@${DPR}x${suffix}`;

const VIEW_TEXT = {
  egitim: {
    caption: "Eğitim: every lesson is one boundary the ear already hears, X vs Y.",
    alt: "English Prep's Eğitim tab: a list of lessons on a dark plum ground, with cherry, iris and lagoon light resting behind it.",
  },
  question: {
    caption: "An answered question: the choice turns Sakura, with the check and the word Doğru.",
    alt: "A test question with its correct option marked in Sakura pink, a check mark and the word Doğru, and the explanation below.",
  },
  about: {
    caption: "About: both are correct; the difference is in the meaning.",
    alt: "English Prep's About page: the headline İkisi de doğru. Fark, anlamda. over the plum ground, with the promise line beneath.",
  },
  lesson: {
    caption: "A lesson opens on its question, then a try-first check that never gates reading.",
    alt: "A lesson on a phone: Present Perfect vs Past Simple, the Turkish question Geçmiş kapandı mı, şimdiye mi uzanıyor?, and a try-first cloze with four English options.",
  },
};

const still = (view, size) => ({
  id: `${view}-${size}`,
  kind: "screen",
  view,
  size,
  files: [fileName(view, size)],
  viewport: [SIZES[size].width, SIZES[size].height],
  dpr: DPR,
  touch: SIZES[size].touch,
  ...VIEW_TEXT[view],
});

/** The kit's required set, hero first; world.json lists it in this order. */
export const SHOTS = Object.freeze([
  still("egitim", "wide"),
  still("question", "wide"),
  still("about", "wide"),
  still("egitim", "touch"),
  still("question", "touch"),
  still("about", "touch"),
  still("lesson", "phone"),
  still("question", "phone"),
  still("about", "phone"),
  {
    id: "signature",
    kind: "signature",
    view: "signature",
    size: "wide",
    files: [fileName("signature", "wide", "-poster.png"), ...["av1", "hevc", "h264"].map((codec) => fileName("signature", "wide", `.${codec}.mp4`))],
    viewport: [SIZES.wide.width, SIZES.wide.height],
    dpr: DPR,
    touch: false,
    durationSeconds: CLIP_SECONDS,
    caption: "An answer: the press, the release, and the Sakura Doğru.",
    alt: "A test question: an option is pressed and released, turns Sakura with a check mark and Doğru, and the explanation opens below.",
  },
]);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "captures", "portfolio");
const LESSON = "tenses-present-perfect-vs-past-simple";
const TOPIC = "modals";
// Content time runs this much slower while the clip's frames are taken.
const RATE = Number(process.env.CAPTURE_RATE) || 0.02;
const FPS = 60;
// Everything but tooling and docs: the newest commit that changed what ships.
const SHIPPED = [".", ":(exclude)docs", ":(exclude)tools", ":(exclude)tests", ":(exclude)lab", ":(exclude).github", ":(exclude)package.json", ":(exclude)*.md"];

async function loadChromium() {
  const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
  let npmRoot = null;
  try {
    npmRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    // npm is optional; the node prefix is tried as well.
  }
  const directories = [process.env.PLAYWRIGHT_PATH, join(globalModules, "playwright"), npmRoot && join(npmRoot, "playwright")].filter(Boolean);
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

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

async function build() {
  const sw = await readFile(join(ROOT, "sw.js"), "utf8");
  return {
    commit: git("log", "-1", "--format=%H", "--", ...SHIPPED),
    version: sw.match(/const VERSION = "([^"]+)"/)?.[1] ?? null,
    dirty: Boolean(git("status", "--porcelain", "--", ...SHIPPED)),
  };
}

const hasFfmpeg = () => spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
function ffmpeg(args) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit", env: { ...process.env, SVT_LOG: "1" } });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}
function encoders() {
  const list = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" }).stdout ?? "";
  return new Set([...list.matchAll(/^\s*V\S*\s+(\S+)/gm)].map(([, name]) => name));
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

async function newContext(browser, size, { motion }) {
  const { width, height, touch, mobile } = SIZES[size];
  const context = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: DPR, hasTouch: touch, isMobile: mobile,
    colorScheme: "dark", reducedMotion: motion ? "no-preference" : "reduce", serviceWorkers: "block",
  });
  await context.addInitScript((motionOn) => {
    try {
      localStorage.setItem("englishPrep.onboarded", "1");
      localStorage.setItem("englishPrep.theme", "dark");
      localStorage.setItem("englishPrep.motion", motionOn ? "on" : "off");
    } catch {
      /* storage unavailable */
    }
  }, motion);
  return context;
}

async function settle(page, ms = 300) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

const optionWith = (page, text) => page.locator(".option").filter({ has: page.locator(".option__text", { hasText: text }) }).first();
const toTop = (page) => page.evaluate(() => {
  const scroller = document.querySelector("#shell-scroll");
  if (scroller) scroller.scrollTop = 0;
  window.scrollTo(0, 0);
});

// Each view: navigate, seed through the app's own modules, wait for the
// real content, rest at the top.
const VIEWS = {
  async egitim(page, base) {
    await page.goto(`${base}/index.html#egitim`, { waitUntil: "networkidle" });
    await page.waitForSelector("#index-list .tile");
    // One lesson part-read, so the resume line is real.
    await page.evaluate(async (id) => {
      const { recordLessonRead } = await import("./js/storage.js");
      recordLessonRead(id, 0.42);
    }, LESSON);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#index-list .tile");
  },
  async lesson(page, base) {
    await page.goto(`${base}/index.html#egitim/${LESSON}`, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-reading-start]");
  },
  async question(page, base) {
    await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
    const answers = await seedQuiz(page);
    await page.goto(`${base}/quiz.html`, { waitUntil: "networkidle" });
    await page.waitForSelector(".option");
    await optionWith(page, answers[0].correct).click();
    await page.waitForSelector(".feedback");
  },
  async about(page, base) {
    await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
    await page.waitForSelector(".ab-hero__title");
  },
};

async function stills(browser, base, size, written) {
  const context = await newContext(browser, size, { motion: false });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  for (const shot of SHOTS.filter((s) => s.kind === "screen" && s.size === size)) {
    await VIEWS[shot.view](page, base);
    await toTop(page);
    await settle(page);
    const path = join(OUT, shot.files[0]);
    await page.screenshot({ path, animations: "disabled" });
    written.push({ shot, file: shot.files[0] });
  }
  await context.close();
  if (errors.length) throw new Error(`${size}: ${errors.join("; ")}`);
}

/* The signature: an answer committed (presentation.md §3, "an answer: press,
 * release, the Sakura Doğru"). Content time, at the real rate:
 *   0 → 1.4 s   rest on the unanswered question
 *   1.4 s       the pointer arrives on the correct option (hover)
 *   2.0 s       press: the inner face goes to .945 in 120 ms
 *   2.25 s      release: 380 ms back through 1.035; the answer commits, the
 *               colour cue (220 ms) and the verdict mark (560 ms) play
 *   → 7 s       rest on the Sakura Doğru
 * The page runs at RATE through CDP, so each content second lasts 1/RATE s
 * of wall time (about six minutes in all) and the capture has frames to
 * spare for 60 fps. */
async function signature(browser, base, written) {
  const shot = SHOTS.find((s) => s.kind === "signature");
  const context = await newContext(browser, shot.size, { motion: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
  const answers = await seedQuiz(page);
  await page.goto(`${base}/quiz.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".option");
  await settle(page, 1500); // the entrance plays out at the real rate first
  const target = optionWith(page, answers[0].correct);
  const box = await target.boundingBox();
  if (!box) throw new Error("signature: the correct option is not on screen");
  // Park the pointer where it touches nothing, so the first frame is at rest.
  await page.mouse.move(SIZES.wide.width - 8, SIZES.wide.height - 8);

  const raw = join(OUT, ".signature-raw");
  await rm(raw, { recursive: true, force: true });
  await mkdir(raw, { recursive: true });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Animation.enable");
  await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
  // Frames: Page.captureScreenshot at scale 2, a loop that runs beside the
  // script. Page.startScreencast was the first choice, but Chromium caps its
  // frames at CSS pixels (1440 × 900 here, whatever the DPR), which halves
  // the clip's text; a scaled capture renders the real 2× pixels (identical
  // to page.screenshot, and it fires no resize). Each frame is stamped with
  // the wall clock at the middle of its capture.
  const frames = [];
  const pending = [];
  let capturing = true;
  const clip = { x: 0, y: 0, width: SIZES.wide.width, height: SIZES.wide.height, scale: DPR };
  const loop = (async () => {
    while (capturing) {
      const before = Date.now();
      const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true, clip });
      const path = join(raw, `${String(frames.length).padStart(5, "0")}.png`);
      frames.push({ path, time: (before + Date.now()) / 2000 });
      pending.push(writeFile(path, Buffer.from(data, "base64")));
    }
  })();
  while (!frames.length) await page.waitForTimeout(20);
  const start = frames[0].time * 1000;
  const at = async (contentSeconds) => {
    const wait = start + (contentSeconds / RATE) * 1000 - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
  };
  const x = box.x + Math.min(box.width / 2, 120);
  const y = box.y + box.height / 2;
  await at(1.4);
  await page.mouse.move(x, y, { steps: 12 });
  await at(2.0);
  await page.mouse.down();
  await at(2.25);
  await page.mouse.up();
  await page.waitForSelector(".feedback");
  await at(CLIP_SECONDS + 0.1);
  capturing = false;
  await loop;
  await Promise.all(pending);
  await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 });
  await context.close();
  if (errors.length) throw new Error(`signature: ${errors.join("; ")}`);

  // Resample to 60 fps of content time: each output frame is the newest
  // captured frame at or before its moment.
  const t0 = frames[0].time;
  const count = Math.round(CLIP_SECONDS * FPS);
  const dir = join(OUT, ".signature-frames");
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  let index = 0;
  const used = new Set();
  for (let i = 0; i < count; i += 1) {
    const moment = t0 + i / FPS / RATE;
    while (index + 1 < frames.length && frames[index + 1].time <= moment) index += 1;
    used.add(index);
    await link(frames[index].path, join(dir, `${String(i + 1).padStart(4, "0")}.png`));
  }
  const wallFps = frames.length / ((frames.at(-1).time - t0) || 1);
  console.log(`signature: ${frames.length} captured frames (${wallFps.toFixed(1)}/s wall, ${(wallFps / RATE).toFixed(0)}/s content), ${used.size} distinct in ${count} output frames`);

  const name = (suffix) => fileName("signature", "wide", suffix);
  const poster = join(OUT, name("-poster.png"));
  await writeFile(poster, await readFile(join(dir, "0001.png")));
  written.push({ shot, file: name("-poster.png") });

  // Rec. 709 matrix, limited range, sRGB transfer (see the header); no audio;
  // +faststart. The scale filter sets the RGB → YUV matrix explicitly
  // (swscale defaults to BT.601 otherwise).
  const tags = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "iec61966-2-1", "-color_range", "tv", "-an", "-movflags", "+faststart"];
  const filter = (format) => ["-vf", `scale=out_color_matrix=bt709:out_range=tv,format=${format}`];
  const input = ["-framerate", String(FPS), "-i", join(dir, "%04d.png")];
  const available = hasFfmpeg() ? encoders() : new Set();
  const av1 = available.has("libsvtav1")
    ? ["-c:v", "libsvtav1", "-preset", "4", "-crf", "28", "-svtav1-params", "tune=0", ...filter("yuv420p10le")]
    : ["-c:v", "libaom-av1", "-cpu-used", "4", "-crf", "28", "-b:v", "0", "-row-mt", "1", ...filter("yuv420p10le")];
  const jobs = [
    ["av1", av1, available.has("libsvtav1") || available.has("libaom-av1")],
    ["hevc", ["-c:v", "libx265", "-preset", "slow", "-crf", "20", "-tag:v", "hvc1", "-x265-params", "log-level=error", ...filter("yuv420p10le")], available.has("libx265")],
    ["h264", ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high", ...filter("yuv420p")], available.has("libx264")],
  ];
  const script = [];
  for (const [codec, args, ok] of jobs) {
    const file = name(`.${codec}.mp4`);
    const line = ["ffmpeg", "-y", ...input, ...args, ...tags, join(OUT, file)];
    script.push(line.map((part) => (/[\s,=:]/.test(part) ? `'${part}'` : part)).join(" "));
    if (!ok) {
      console.warn(`no encoder for ${codec}: frames kept in ${dir}`);
      continue;
    }
    ffmpeg(line.slice(2));
    written.push({ shot, file });
  }
  await writeFile(join(OUT, "encode.sh"), `#!/bin/sh\n# Re-encode the signature from its frames (tools/capture-portfolio.mjs).\n${script.join("\n")}\n`);
  if (jobs.every(([, , ok]) => ok) && !process.argv.includes("--keep-frames")) {
    await rm(dir, { recursive: true, force: true });
  }
  await rm(raw, { recursive: true, force: true });
}

async function main() {
  const base = (process.argv.slice(2).find((arg) => !arg.startsWith("--")) ?? "http://localhost:8000").replace(/\/$/, "");
  const chromium = await loadChromium();
  if (!chromium) {
    console.error(
      "playwright bulunamadı. Bu araç projenin bağımlılığı değildir; kurulu olduğu dizini göster:\n" +
        "  PLAYWRIGHT_PATH=$(npm root -g)/playwright node tools/capture-portfolio.mjs",
    );
    process.exit(2);
  }
  const info = await build();
  if (info.dirty) console.warn("the working tree has uncommitted app changes: the manifest marks this build dirty");

  await mkdir(OUT, { recursive: true });
  for (const entry of await readdir(OUT)) if (/^english-prep-.*\.(png|mp4)$/.test(entry)) await rm(join(OUT, entry));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const written = [];
  try {
    for (const size of Object.keys(SIZES)) await stills(browser, base, size, written);
    if (!process.argv.includes("--no-clip")) await signature(browser, base, written);
  } finally {
    await browser.close();
  }

  const shotDate = new Date().toISOString().slice(0, 10);
  const files = [];
  for (const { shot, file } of written) {
    const { size } = await stat(join(OUT, file));
    files.push({ file, id: shot.id, kind: shot.kind, viewport: shot.viewport, dpr: shot.dpr, touch: shot.touch, bytes: size, build: { commit: info.commit, version: info.version } });
    console.log(`captures/portfolio/${file}  ${(size / 1024).toFixed(0)} KB`);
  }
  const manifest = { tool: "tools/capture-portfolio.mjs", base, shot: shotDate, build: info, clip: { fps: FPS, rate: RATE, seconds: CLIP_SECONDS }, files };
  await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log("captures/portfolio/manifest.json: run node tools/make-world.mjs to record the captures in world.json");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
