#!/usr/bin/env node
// Writes docs/family/world.json: English Prep's world for the portfolio's
// embassy, on the family kit's schema (docs/family/kit/world.schema.json,
// kit/presentation.md §2). Every value is read from the app's own sources,
// never retyped ("copied, never redrawn"), so the portfolio copies tokens
// instead of redrawing them.
//
//   node tools/make-world.mjs          rewrites docs/family/world.json
//   node tools/make-world.mjs --check  exits 1 if the file has drifted
//
// Sources: css/editorial.css (palette, aurora, type), css/interactions.css
// (press), js/interactions.js (springs, release keyframes, durations),
// about/index.html (the promise line), sw.js (the version), and the capture
// manifest captures/portfolio/manifest.json when tools/capture-portfolio.mjs
// has run (it is gitignored, so CI never has it).
//
// Drift. `source.commit`, `source.version`, `source.date` and each capture's
// `shot` name *when* the values were read, not *what* they are: a commit
// cannot contain its own hash, so comparing them would fail on every commit.
// `--check` and tests/family-world.test.js compare everything else
// (`stable()` below); the four volatile fields are refreshed whenever the
// file is regenerated. Without a manifest, `source.commit` is the last commit
// that touched a token file; with one, it is the app commit the captures were
// shot from (the newest commit that changed a shipped file), which also
// carries these values. Development tooling only: the app never reads it.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SHOTS, SITE, REPO } from "./capture-portfolio.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const WORLD_PATH = join(ROOT, "docs", "family", "world.json");
export const MANIFEST_PATH = join(ROOT, "captures", "portfolio", "manifest.json");
export const TOKEN_FILES = ["css/editorial.css", "css/interactions.css", "js/interactions.js", "about/index.html"];

const read = (path) => readFileSync(join(ROOT, path), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

function block(css, selector, label) {
  const blocks = [...css.matchAll(selector)].map((match) => match[1]).filter((body) => /--page\s*:/.test(body));
  if (blocks.length !== 1) throw new Error(`${label}: expected one palette block, found ${blocks.length}`);
  const values = {};
  for (const [, name, value] of blocks[0].matchAll(/--([\w-]+)\s*:\s*([^;{}]+?)\s*;/g)) values[name] = value;
  return values;
}

function need(values, name) {
  const value = values[name];
  if (value === undefined) throw new Error(`css/editorial.css: --${name} is missing`);
  return value.trim().toLowerCase();
}

const seconds = (value) => (value.endsWith("ms") ? Number.parseFloat(value) / 1000 : Number.parseFloat(value));
const rem = (value) => Number.parseFloat(value) * (value.endsWith("rem") ? 16 : 1);
const fix = (number, places = 3) => Number(number.toFixed(places));

/* The press role. Kit motion.md §2: "the release is the spring; the press-in
 * itself may be a 60–120 ms ease". English Prep's release is not a spring: it
 * is a 380 ms keyframe .945 → 1.035 → 1 (js/interactions.js, preset
 * "release"), one deliberate overshoot past rest. It is mapped under press,
 * never under settle (motion.md: settle must not overshoot a surface). The
 * schema wants a spring, so press is the spring that peaks where the release
 * peaks (offset × duration) and is within 1 % of rest where the release ends:
 * ω_d = π / t_peak, ζω = ln(100) / t_end, and for bounce b ≥ 0, ζ = 1 − b,
 * d = 2π / ω (motion.md §1). Its overshoot (about 11 % of the travel) is not
 * the keyframe's (.035 past a .055 travel), which no spring starting at rest
 * reaches under bounce ≤ .5, so it is listed in source.estimated and explained
 * in motion.note. Nothing in the app is retuned. */
function pressSpring(release) {
  const tPeak = (release.peakOffset * release.ms) / 1000;
  const tEnd = release.ms / 1000;
  const omegaD = Math.PI / tPeak;
  const decay = Math.log(100) / tEnd;
  const omega = Math.hypot(omegaD, decay);
  return { duration: fix((2 * Math.PI) / omega), bounce: fix(1 - decay / omega) };
}

const zetaOf = ({ stiffness, damping }) => fix(damping / (2 * Math.sqrt(stiffness)), 2);

function readMotion(interactionsCss, interactionsJs) {
  const table = interactionsJs.match(/MOTION_DURATIONS\s*=\s*Object\.freeze\(\{([^}]*)\}/);
  if (!table) throw new Error("js/interactions.js: MOTION_DURATIONS not found");
  const durations = Object.fromEntries([...table[1].matchAll(/(\w+)\s*:\s*(\d+)/g)].map(([, key, ms]) => [key, Number(ms)]));

  const springTable = interactionsJs.match(/const SPRINGS\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\);/);
  if (!springTable) throw new Error("js/interactions.js: SPRINGS not found");
  const springs = Object.fromEntries(
    [...springTable[1].matchAll(/(\w+)\s*:\s*\{\s*stiffness:\s*([\d.]+),\s*damping:\s*([\d.]+)\s*\}/g)].map(([, name, k, c]) => [
      name,
      { stiffness: Number(k), damping: Number(c) },
    ]),
  );
  for (const name of ["soft", "lively", "bouncy"]) if (!springs[name]) throw new Error(`js/interactions.js: spring ${name} not found`);

  const release = interactionsJs.match(
    /case "release": return \{[^[]*\[\s*\{ transform: "scale\(([\d.]+)\)[^"]*", offset: 0[^}]*\},\s*\{ transform: "scale\(([\d.]+)\)[^"]*", offset: ([\d.]+)/,
  );
  if (!release) throw new Error("js/interactions.js: release keyframes not found");

  const press = interactionsCss.match(/\[data-pressing="true"\][^{]*\{\s*transform:\s*scale\(var\(--press-depth,\s*([\d.]+)\)\)[^;]*;\s*transition:\s*transform\s+(\d+)ms\s+(cubic-bezier\([^)]*\))/);
  if (!press) throw new Error("css/interactions.css: press rule not found");

  return {
    durations,
    springs,
    press: { depth: Number(press[1]), ms: Number(press[2]), ease: press[3].replace(/\s+/g, "") },
    release: { from: Number(release[1]), peak: Number(release[2]), peakOffset: Number(release[3]), ms: durations.release },
  };
}

function readLight(editorial, dark) {
  const width = Number(editorial.match(/\.ambient__field\s*\{[^}]*width:\s*max\(([\d.]+)vw/)?.[1]);
  const height = Number(editorial.match(/\.ambient__field\s*\{[^}]*height:\s*max\(([\d.]+)vh/)?.[1]);
  if (!width || !height) throw new Error("css/editorial.css: .ambient__field size not found");
  // Each cluster's rest centre in % of the viewport, from its box; the static
  // transform belongs to the drift and is left to the animation.
  const centre = (body, name) => {
    const prop = (key) => {
      const match = body.match(new RegExp(`(?:^|[\\s;{])${key}\\s*:\\s*(-?[\\d.]+)v[wh]`));
      return match ? Number(match[1]) : undefined;
    };
    const [left, right, top, bottom] = ["left", "right", "top", "bottom"].map(prop);
    const x = left !== undefined ? left + width / 2 : 100 - right - width / 2;
    const y = top !== undefined ? top + height / 2 : 100 - bottom - height / 2;
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error(`aurora ${name}: position not found`);
    return [fix(x, 2), fix(y, 2)];
  };
  const order = ["cherry", "iris", "lagoon"];
  const sources = [...editorial.matchAll(/\.ambient__field--(\w+)\s*\{([^{}]*)\}/g)].map(([, name, body]) => {
    const prop = (key) => {
      const match = body.match(new RegExp(`--${key}\\s*:\\s*([^;]+);`));
      if (!match) throw new Error(`aurora ${name}: --${key} is missing`);
      return seconds(match[1].trim());
    };
    // The pigment a cluster starts in: cherry unless a rule lights another;
    // the cycle then runs cherry → iris → lagoon.
    const lit = order.find((p) => new RegExp(`\\.ambient__field--${name} \\.ambient__pigment--${p}[^{]*\\{\\s*opacity:\\s*1`).test(editorial));
    const start = order.indexOf(lit ?? "cherry");
    return {
      pigments: [...order.slice(start), ...order.slice(0, start)].map((p) => need(dark, `aurora-${p}`)),
      at: centre(body, name),
      size: [width, height],
      drift: { period: prop("ambient-duration"), phase: prop("ambient-phase") },
      cycle: { period: prop("pigment-cycle"), phase: prop("pigment-phase") },
    };
  });
  if (sources.length !== 3) throw new Error(`expected three aurora clusters, found ${sources.length}`);
  return sources;
}

export function readManifest() {
  if (!existsSync(MANIFEST_PATH)) return null;
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function readPrevious() {
  try {
    const world = JSON.parse(readFileSync(WORLD_PATH, "utf8"));
    return world.version === 1 ? world : null; // the provisional family-world/0 file carries nothing over
  } catch {
    return null;
  }
}

/** The volatile fields: when the values were read (see the header). */
function provenance(manifest, previous) {
  const tokenCommit = git("log", "-1", "--format=%H", "--", ...TOKEN_FILES);
  let commit = tokenCommit;
  const shotFrom = manifest?.build?.commit;
  if (shotFrom && tokenCommit) {
    const descends = git("merge-base", "--is-ancestor", tokenCommit, shotFrom) !== null;
    if (descends && !manifest.build.dirty) commit = shotFrom;
    else console.warn("captures/portfolio/manifest.json predates the token files or was shot from a dirty tree: reshoot (node tools/capture-portfolio.mjs)");
  }
  if (!commit) {
    const { commit: was = "unknown", version, date = new Date().toISOString().slice(0, 10) } = previous?.source ?? {};
    return { commit: was, version, date };
  }
  const version = git("show", `${commit}:sw.js`)?.match(/const VERSION = "english-prep-v([\d.]+)"/)?.[1];
  return { commit, version, date: git("show", "-s", "--format=%cs", commit) };
}

export function buildWorld({ manifest = readManifest(), previous = readPrevious() } = {}) {
  const editorial = read("css/editorial.css");
  const interactions = read("css/interactions.css");
  const interactionsJs = read("js/interactions.js");
  const about = readFileSync(join(ROOT, "about/index.html"), "utf8");

  const dark = block(editorial, /:root\s*\{([^{}]*)\}/g, "dark");
  const lightTheme = { ...dark, ...block(editorial, /:root\[data-theme=["']?light["']?\]\s*\{([^{}]*)\}/g, "light") };
  const motion = readMotion(interactions, interactionsJs);

  const gradient = need(dark, "grad-accent").match(/linear-gradient\(\s*([\d.]+)deg/);
  const buttonRadius = editorial.match(/\.btn--primary\s*\{[^}]*border-radius:\s*([\d.]+)px/);
  const brand = editorial.match(/\.brand-mark\s*\{[^}]*letter-spacing:\s*(-?[\d.]+)em/);
  const promise = about.match(/<p class="ab-quiet"[^>]*>([^<]+)<\/p>/);
  if (!gradient || !buttonRadius || !brand || !promise) throw new Error("accent gradient, primary radius, brand mark or promise line not found");

  // The UI's weights as the sheet sets them (the @font-face range is not one).
  const faceless = editorial.replace(/@font-face\s*\{[^}]*\}/g, "");
  const weights = [...new Set([...faceless.matchAll(/font-weight:\s*(\d{3})\s*;/g)].map(([, w]) => Number(w)))].sort((a, b) => a - b);
  const stack = need(dark, "f-sans").replace(/\s+/g, " ").replace(/^inter\b/, "Inter");
  const readingSize = rem(need(dark, "reading-size"));

  const sources = readLight(editorial, dark);
  const source = provenance(manifest, previous);
  const shotOf = (id) => manifest?.shot ?? previous?.captures?.find((capture) => capture.id === id)?.shot ?? source.date;
  const { soft, lively, bouncy } = motion.springs;

  return {
    version: 1,
    slug: "english-prep",
    name: "English Prep",
    source: {
      repo: REPO,
      commit: source.commit,
      ...(source.version ? { version: source.version } : {}),
      files: [...TOKEN_FILES, "sw.js"],
      date: source.date,
      estimated: ["/motion/press"],
    },
    ground: { base: need(dark, "page"), frame: need(dark, "card"), raised: need(dark, "raised"), hairline: need(dark, "hairline") },
    ink: { primary: need(dark, "ink"), secondary: need(dark, "ink-2") },
    accent: {
      color: need(dark, "accent"),
      gradient: { stops: [need(dark, "accent"), need(dark, "accent-2")], angle: Number(gradient[1]) },
      ink: need(dark, "accent-ink"),
      radius: Number(buttonRadius[1]),
      job: "The one primary action, and a correct answer, always with the check mark and the word Doğru.",
      light: need(dark, "editorial-mark"),
    },
    light: {
      behaviour: "drift",
      theme: "dark",
      cap: Number(need(dark, "aurora-opacity")),
      sources,
      note:
        `English Prep's own CSS aurora (.ambient in css/editorial.css): one opacity on the parent flattens all nine layers; ` +
        `each source sits at its cluster's rest centre in % of the viewport, sized max(${sources[0].size[0]}vw, 470px) × max(${sources[0].size[1]}vh, 520px). ` +
        `The light theme lowers the cap to ${Number(need(lightTheme, "aurora-opacity"))}. Paused when hidden; reduced motion shows three still pools; forced colours hide it.`,
    },
    fonts: {
      ui: { family: "Inter", stack, weights },
      display: {
        family: "Inter",
        stack,
        weights: [600],
        tracking: Number(brand[1]),
        size: rem(need(dark, "t-display")),
        lineHeight: rem(need(dark, "t-display-lh")),
      },
      reading: { family: "Inter", stack, weights: [400], size: readingSize, lineHeight: Math.round(readingSize * Number(need(dark, "reading-leading"))) },
    },
    motion: {
      press: pressSpring(motion.release),
      settle: { ...soft },
      glide: { ...lively },
      pop: { ...bouncy },
      pressScale: { mouse: motion.press.depth, touch: motion.press.depth },
      ease: need(dark, "ease-standard"),
      note:
        `press: the release is the spring (kit motion.md §2). English Prep presses the inner face to ${motion.press.depth} in ${motion.press.ms} ms ` +
        `(${motion.press.ease}) and releases in a ${motion.release.ms} ms keyframe ${motion.release.from} → ${motion.release.peak} → 1 (peak at ${Math.round(motion.release.peakOffset * 100)} %), ` +
        `not a spring; that overshoot is why the release sits under press and not under settle. The press spring here peaks and rests when the release does ` +
        `(estimated: no spring from rest reaches the keyframe's overshoot). settle, glide and pop are the app's own v0.76 springs (js/interactions.js SPRINGS): ` +
        `soft ζ ${zetaOf(soft)} for content, lively ζ ${zetaOf(lively)} for route slides and dialogs (about 2 % past rest: recorded, not retuned to the kit's zero-bounce glide), ` +
        `bouncy ζ ${zetaOf(bouncy)} for marks and glyphs. The route itself moves ${motion.durations.route} ms over 12 px on the ease; the verdict mark takes ` +
        `${motion.durations.scene} ms after a ${motion.durations.reveal} ms colour cue. Reduced motion and the Profil toggle make every spatial move instant.`,
    },
    promise: {
      text: promise[1].trim(),
      lang: "tr",
      gloss: "Free · No account · Your progress stays in your browser",
      evidence: `${SITE}about/`,
    },
    links: { open: SITE, code: `https://github.com/${REPO}`, about: `${SITE}about/` },
    captures: SHOTS.map(({ id, kind, files, viewport, dpr, touch, caption, alt, durationSeconds }) => ({
      id,
      kind,
      files: files.map((file) => `captures/${file}`),
      viewport,
      dpr,
      ...(touch ? { touch } : {}),
      theme: "dark",
      caption,
      ...(alt ? { alt } : {}),
      ...(durationSeconds ? { durationSeconds } : {}),
      shot: shotOf(id),
    })),
  };
}

/** The world without its volatile fields: what --check and the test compare. */
export function stable(world) {
  const { commit, version, date, ...source } = world.source;
  return { ...world, source, captures: world.captures.map(({ shot, ...capture }) => capture) };
}

export function serialise(world) {
  return JSON.stringify(world, null, 2) + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const world = buildWorld();
  if (process.argv.includes("--check")) {
    const current = readPrevious();
    if (!current || serialise(stable(current)) !== serialise(stable(world))) {
      console.error("docs/family/world.json is out of date: run node tools/make-world.mjs");
      process.exit(1);
    }
    console.log("docs/family/world.json matches the tokens.");
  } else {
    mkdirSync(dirname(WORLD_PATH), { recursive: true });
    writeFileSync(WORLD_PATH, serialise(world));
    console.log(`wrote docs/family/world.json (source ${world.source.commit.slice(0, 7)}${readManifest() ? ", captures from the manifest" : ""})`);
  }
}
