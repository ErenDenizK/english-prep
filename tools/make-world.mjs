#!/usr/bin/env node
// Writes docs/family/world.json: English Prep's world for the portfolio's
// embassy (docs/family/README.md). Every value is read from the app's own
// sources, never retyped, so the portfolio copies tokens instead of
// redrawing them (family vision §3.1, "tokens are copied, never redrawn").
//
//   node tools/make-world.mjs          rewrites docs/family/world.json
//   node tools/make-world.mjs --check  exits 1 if the file has drifted
//
// Sources: css/editorial.css (the Margin palette both themes, aurora pigments,
// cap and timings, type, motion durations), css/interactions.css (press and
// release), js/interactions.js (the duration table), about/index.html (the
// promise line). The colour values themselves are solved and audited by
// tools/editorial-palette.mjs (`npm run color`); this file only reports them.
// Development tooling only: the app never reads world.json.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { wcagContrast } from "./color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const WORLD_PATH = join(ROOT, "docs", "family", "world.json");

const read = (path) => readFileSync(join(ROOT, path), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function block(css, selector, label) {
  const blocks = [...css.matchAll(selector)].map((match) => match[1]).filter((body) => /--page\s*:/.test(body));
  if (blocks.length !== 1) throw new Error(`${label}: expected one palette block, found ${blocks.length}`);
  const values = {};
  for (const [, name, value] of blocks[0].matchAll(/--([\w-]+)\s*:\s*([^;{}]+?)\s*;/g)) values[name] = value;
  return values;
}

function need(values, name, label) {
  const value = values[name];
  if (value === undefined) throw new Error(`${label}: --${name} is missing`);
  return value;
}

function seconds(value) {
  const number = Number.parseFloat(value);
  return value.endsWith("ms") ? number / 1000 : number;
}

const round = (number) => Math.round(number * 100) / 100;

export function buildWorld() {
  const editorial = read("css/editorial.css");
  const interactions = read("css/interactions.css");
  const interactionsJs = read("js/interactions.js");
  const about = readFileSync(join(ROOT, "about/index.html"), "utf8");

  const dark = block(editorial, /:root\s*\{([^{}]*)\}/g, "dark");
  const light = { ...dark, ...block(editorial, /:root\[data-theme=["']?light["']?\]\s*\{([^{}]*)\}/g, "light") };

  const theme = (values, label) => {
    const v = (name) => need(values, name, label).toLowerCase();
    return {
      ground: v("page"),
      card: v("card"),
      raised: v("raised"),
      ink: [v("ink"), v("ink-2")],
      hairline: v("hairline"),
      edge: v("edge"),
      accent: {
        pair: [v("accent"), v("accent-2")],
        gradient: need(values, "grad-accent", label).replace(/var\(--accent\)/, v("accent")).replace(/var\(--accent-2\)/, v("accent-2")),
        ink: v("accent-ink"),
        text: v("accent-text"),
        tint: v("accent-tint"),
      },
      focus: v("focus"),
      roles: {
        secondary: v("secondary"),
        cool: v("cool"),
        tertiary: v("tertiary"),
      },
      answers: {
        correct: { ink: v("ok"), surface: v("ok-tint"), edge: v("ok-edge") },
        incorrect: { ink: v("no"), surface: v("no-tint"), edge: v("no-edge") },
      },
      aurora: {
        pigments: { cherry: v("aurora-cherry"), iris: v("aurora-iris"), lagoon: v("aurora-lagoon") },
        parentOpacity: Number(need(values, "aurora-opacity", label)),
      },
      contrast: {
        inkOnGround: round(wcagContrast(v("ink"), v("page"))),
        supportingOnGround: round(wcagContrast(v("ink-2"), v("page"))),
        accentInkOnAccent: round(Math.min(wcagContrast(v("accent-ink"), v("accent")), wcagContrast(v("accent-ink"), v("accent-2")))),
      },
    };
  };

  const fields = [...editorial.matchAll(/\.ambient__field--(\w+)\s*\{([^{}]*)\}/g)].map(([, name, body]) => {
    const prop = (key) => {
      const match = body.match(new RegExp(`--${key}\\s*:\\s*([^;]+);`));
      if (!match) throw new Error(`aurora ${name}: --${key} is missing`);
      return seconds(match[1].trim());
    };
    return { cluster: name, drift: prop("ambient-duration"), driftPhase: prop("ambient-phase"), colourCycle: prop("pigment-cycle"), colourPhase: prop("pigment-phase") };
  });
  if (fields.length !== 3) throw new Error(`expected three aurora clusters, found ${fields.length}`);

  const tableMatch = interactionsJs.match(/MOTION_DURATIONS\s*=\s*Object\.freeze\(\{([^}]*)\}/);
  if (!tableMatch) throw new Error("js/interactions.js: MOTION_DURATIONS not found");
  const durations = Object.fromEntries([...tableMatch[1].matchAll(/(\w+)\s*:\s*(\d+)/g)].map(([, key, ms]) => [key, Number(ms)]));

  const pressMatch = interactions.match(/\[data-pressing="true"\][^{]*\{\s*transform:\s*scale\(var\(--press-depth,\s*([\d.]+)\)\)[^;]*;\s*transition:\s*transform\s+(\d+)ms\s+(cubic-bezier\([^)]*\))/);
  if (!pressMatch) throw new Error("css/interactions.css: press rule not found");
  const easeStandard = need(dark, "ease-standard", "dark");

  const font = editorial.match(/@font-face\s*\{[^}]*font-family:\s*([^;]+);[^}]*src:\s*url\("([^"]+)"\)[^}]*font-weight:\s*([^;]+);/);
  const brand = editorial.match(/\.brand-mark\s*\{[^}]*letter-spacing:\s*([^;]+);/);
  const promise = about.match(/<p class="(?:about|ab)-quiet"[^>]*>([^<]+)<\/p>/);
  if (!font || !brand || !promise) throw new Error("font, brand mark or promise line not found");

  return {
    $schema: "family-world/0 (provisional until the family kit's presentation.md fixes it)",
    product: "english-prep",
    name: "English Prep",
    generatedBy: "tools/make-world.mjs",
    sources: ["css/editorial.css", "css/interactions.css", "js/interactions.js", "about/index.html"],
    themes: { dark: theme(dark, "dark"), light: theme(light, "light") },
    defaultTheme: "dark",
    accentJob: "The one primary action, and a correct answer (always with the check mark and the word Doğru).",
    light: {
      kind: "aurora",
      behaviour: "drift",
      clusters: fields,
      note: "Three clusters each crossfade cherry, iris and lagoon; one opacity on the parent flattens all nine layers (not a per-layer cap). Paused when the page is hidden; reduced motion shows three still pools; forced colours hide it.",
    },
    materials: { glass: false, note: "Opaque cards; no backdrop blur anywhere (Margin system)." },
    type: {
      family: font[1].trim(),
      file: font[2].replace(/^\.\.\//, ""),
      weights: font[3].trim(),
      stack: need(dark, "f-sans", "dark").replace(/\s+/g, " ").trim(),
      reading: { size: need(dark, "reading-size", "dark"), lineHeight: Number(need(dark, "reading-leading", "dark")) },
      mark: { text: "ep.", full: "english prep.", weight: 600, tracking: brand[1].trim(), dot: { dark: dark["editorial-mark"].toLowerCase(), light: light["editorial-mark"].toLowerCase() } },
    },
    motion: {
      ease: easeStandard,
      durationsMs: durations,
      press: { ms: Number(pressMatch[2]), depth: Number(pressMatch[1]), easing: pressMatch[3] },
      springGrammar: {
        press: `inner face compresses to ${pressMatch[1]} in ${pressMatch[2]} ms`,
        settle: `continuous ${durations.release} ms release (.945 to 1.035 to 1)`,
        glide: `route ${durations.route} ms over 12 px; scene ${durations.scene} ms`,
        pop: `verdict mark ${durations.scene} ms (.72 to 1.1 to 1); colour cue ${durations.reveal} ms`,
        note: "A naming map onto existing timings. English Prep's values are bezier keyframes, not springs, and stay as they are.",
      },
    },
    shape: { radii: ["r-1", "r-2", "r-3", "r-4"].map((name) => need(dark, name, "dark")), primaryHeight: need(dark, "btn-h-primary", "dark") },
    promise: {
      tr: promise[1].trim(),
      en: "Free. No account. Your progress stays in your browser.",
      short: { tr: "Hesapsız. İlerlemen kendi tarayıcında.", en: "No account. Your progress stays in your browser." },
      register: "Turkish, sen",
      source: "about/index.html, .about-quiet",
    },
    captures: { dir: "captures/portfolio/", tool: "tools/capture-portfolio.mjs" },
  };
}

export function serialise(world) {
  return JSON.stringify(world, null, 2) + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const output = serialise(buildWorld());
  if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(WORLD_PATH, "utf8");
    } catch {
      /* missing counts as drift */
    }
    if (current !== output) {
      console.error("docs/family/world.json is out of date: run node tools/make-world.mjs");
      process.exit(1);
    }
    console.log("docs/family/world.json matches the tokens.");
  } else {
    mkdirSync(dirname(WORLD_PATH), { recursive: true });
    writeFileSync(WORLD_PATH, output);
    console.log("wrote docs/family/world.json");
  }
}
