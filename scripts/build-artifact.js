#!/usr/bin/env node
// Generates the single-file preview build from the real app sources.
//
//   node scripts/build-artifact.js [outputPath]
//
// Why this exists: the shareable preview used to be a hand-maintained
// copy of the app in one HTML file. Every change had to be made twice,
// in two different sets of class names, and the copy drifted from the
// real thing basically every round. This script removes the copy: the
// preview is now produced from index.html, quiz.html, results.html,
// css/style.css, js/*.js and data/*.json exactly as they ship.
//
// It is NOT a build step for the site. The site stays plain static files
// with no build (see README); this only produces the preview artifact.
//
// What it has to bridge, and how:
//   1. Three pages -> one document. Each page's <body> content becomes a
//      screen; js/navigate.js swaps between them instead of navigating.
//   2. ES modules -> one classic script. The modules are wrapped in a
//      tiny registry (they only ever use `export function|const` and
//      named imports, so the transform is mechanical and total).
//   3. fetch() -> inlined JSON, read via __ENGLISH_PREP_DATA__.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_OUT = path.join(ROOT, "dist", "english-prep-preview.html");

// Dependency order. Modules are concatenated in this order, so anything a
// module imports must appear before it.
const MODULE_ORDER = [
  "navigate.js",
  "tiers.js",
  "topics.js",
  "storage.js",
  "session-state.js",
  "quiz-engine.js",
  "feedback.js",
  "modal.js",
  "dropdown.js",
  "education.js",
  "profile.js",
  "quiz.js",
  "results.js",
  "home.js",
];

const PAGES = [
  { file: "index.html", id: "index" },
  { file: "quiz.html", id: "quiz" },
  { file: "results.html", id: "results" },
];

function read(...parts) {
  return fs.readFileSync(path.join(ROOT, ...parts), "utf8");
}

/**
 * Rewrites one ES module into a registry factory.
 *
 * `import { a, b } from "./x.js"` becomes a destructure off the registry,
 * and every `export` marker is dropped after its name is collected so the
 * factory can return them. The whole codebase uses only these two forms,
 * which is what makes a 30-line transform sufficient here.
 */
function wrapModule(name, source) {
  const exported = [];
  let body = source;

  body = body.replace(/^import\s*\{([\s\S]*?)\}\s*from\s*"\.\/(.+?)"\s*;/gm, (_, names, from) => {
    const bound = names
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .join(", ");
    return `const { ${bound} } = __require("${from}");`;
  });

  body = body.replace(/^export\s+(async\s+)?function\s+(\w+)/gm, (_, isAsync, fnName) => {
    exported.push(fnName);
    return `${isAsync ?? ""}function ${fnName}`;
  });

  body = body.replace(/^export\s+const\s+(\w+)/gm, (_, constName) => {
    exported.push(constName);
    return `const ${constName}`;
  });

  if (/^export\s/m.test(body)) {
    throw new Error(`${name}: unsupported export form — the transform in scripts/build-artifact.js needs updating.`);
  }

  return `__define("${name}", function () {\n${body}\nreturn { ${exported.join(", ")} };\n});`;
}

/** Pulls the markup between <body> and </body>, minus <script> tags. */
function bodyOf(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) {
    throw new Error("No <body> found.");
  }
  return match[1].replace(/<script[\s\S]*?<\/script>/gi, "").trim();
}

function collectData() {
  const manifest = JSON.parse(read("data", "manifest.json"));
  const data = { "data/manifest.json": manifest };
  for (const topic of manifest.topics) {
    if (topic.comingSoon) continue;
    data[topic.file] = JSON.parse(read(topic.file));
  }
  return data;
}

function build() {
  const css = read("css", "style.css");
  const data = collectData();

  const screens = PAGES.map(
    ({ file, id }) => `<div class="screen" id="screen-${id}"${id === "index" ? "" : " hidden"}>\n${bodyOf(read(file))}\n</div>`
  ).join("\n\n");

  const modules = MODULE_ORDER.map((name) => wrapModule(name, read("js", name))).join("\n\n");

  return `<title>English Prep</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

<style>
${css}

/* Preview-only: the three pages of the real app live in one document
   here, so exactly one screen is shown at a time and each keeps the same
   fixed-height column shell the real pages have. */
html, body { height: 100%; margin: 0; overflow: hidden; }
body { display: block; }
.screen { height: 100%; display: flex; flex-direction: column; }
</style>

${screens}

<script>
(function () {
  "use strict";

  window.__ENGLISH_PREP_BUNDLED__ = true;
  window.__ENGLISH_PREP_DATA__ = ${JSON.stringify(data)};

  var __factories = {};
  var __cache = {};
  function __define(name, factory) { __factories[name] = factory; }
  function __require(name) {
    if (!__cache[name]) {
      if (!__factories[name]) { throw new Error("Unknown module: " + name); }
      __cache[name] = __factories[name]();
    }
    return __cache[name];
  }

  // Screen swapping stands in for page navigation. Each page's init is
  // registered by its own module via registerPage().
  window.__ENGLISH_PREP_NAVIGATE__ = function (page, init) {
    var id = page.replace(".html", "");
    ["index", "quiz", "results"].forEach(function (name) {
      document.getElementById("screen-" + name).hidden = name !== id;
    });
    document.querySelector("#screen-" + id + " .app-content").scrollTop = 0;
    if (typeof init === "function") { init(); }
  };

${modules}

  // The quiz and results modules have to be instantiated even though
  // nothing imports them: that's how each registers its own init with
  // navigate.js. Requiring them is the bundle's stand-in for the real
  // site loading each page's <script> when you land on that page.
  __require("quiz.js");
  __require("results.js");

  // Entry point last — same as the real site loading index.html.
  __require("home.js");
})();
</script>
`;
}

const outPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, build());
console.log(`Preview build written to ${path.relative(ROOT, outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
