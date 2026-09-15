# Technology base: should this app move onto React?

Research arm 02 of the 2026-09-15 round (`00-brief.md`). The question the
owner opened: should "plain HTML/CSS/ES modules, no build step, zero
dependencies" be given up for React or something like it — and if so, for
what?

The answer this arm reaches is **no framework, yes build step** — and the
build step it recommends is not the one anybody expected. The reasoning is
below; the decision rule is in **Öneri**.

## How the numbers here were produced

Everything marked *(measured)* was taken on this machine on 2026-09-15
against `test` at v0.63, and can be re-taken:

- **Transfer weight.** A local static server with gzip on (level 9) and
  correct MIME types, driven by Playwright/Chromium at 390×844, summing
  `content-length` over every response. GitHub Pages gzips text the same
  way, so this is the shape of the real download; it is not the
  `python3 -m http.server` that `npm run serve` starts, which sends
  everything uncompressed.
- **Framework weight.** Tarballs pulled from `registry.npmjs.org` and
  gzipped locally. Where a vendor ships a minified build (`preact.min.js`,
  `htmx.min.js`, `alpinejs/dist/cdn.min.js`, lit's non-`development/`
  files, `htm/preact/standalone.module.js`) that file was measured
  directly. Where it does not, the source is cited instead and the
  measurement is given as an upper bound.
- **Parse + execute cost.** Each runtime evaluated 7 times from a
  `Blob` module URL inside Chromium, median reported, under CDP
  `Emulation.setCPUThrottlingRate` at 1×, 4× and 6×. The throttle is
  relative to *this* container's CPU, not to a calibrated handset — see
  **Doğrulanamayanlar**.
- **Dependency counts.** Full transitive walk of the npm registry
  (`dependencies` plus the linux-x64 slice of `optionalDependencies`),
  summing each package's published `unpackedSize`.

Nothing was installed into the repository. No file outside this one was
touched.

---

## 1. What exists today, measured

### 1.1 The code

| | Files | Lines | Bytes |
| --- | --- | --- | --- |
| `js/*.js` | 27 | 8,285 | 305,323 |
| `css/style.css` | 1 | 1,986 | 51,879 |
| `css/fonts.css` | 1 | 185 | 8,319 |
| `index/quiz/results.html` | 3 | 332 | 16,227 |
| `sw.js` | 1 | 167 | — |
| `tests/*.js` | 8 | 2,184 | — |
| `tools/verify-ui.mjs` | 1 | 3,381 | — |
| `tools/palette.mjs` | 1 | 328 | — |

Of the 8,285 lines in `js/`, **4,888 are code, 2,690 are comment (32.4 %)
and 734 are blank** *(measured)*. That ratio matters twice below: once
because it is a third of the shipped bytes, and once because it is the
part of this codebase a rewrite would destroy.

### 1.2 The modules

Twenty-seven ES modules, no cycles, entry points `home.js`, `quiz.js`,
`results.js`. Sizes are on-disk bytes; the "gz" column is that file
gzipped on its own, which is how it is actually served.

| Module | Bytes | gz | What it does |
| --- | --- | --- | --- |
| `education.js` | 72,943 | 23,903 | Eğitim: lesson index, topic overview, the reader and every block type |
| `storage.js` | 38,354 | 12,747 | `localStorage` — history, lesson progress, profile, goals, streak |
| `home.js` | 26,595 | 9,625 | Hash router, nav, Test tab |
| `profile.js` | 24,331 | 8,658 | Profil tab |
| `results.js` | 17,112 | — | Score, breakdown, review |
| `quiz.js` | 15,119 | — | Test screen |
| `topics.js` | 14,478 | — | Manifest + topic file loading and caching |
| `icons.js` | 10,238 | — | 20 hand-drawn icons to the §6 contract |
| `widgets.js` | 8,297 | — | Ring, monogram, avatar, choice group, count-up, haptic |
| `onboarding.js` | 8,081 | — | `#hosgeldin`, four steps |
| `listbox.js` | 7,168 | — | Select-only combobox replacing `<select>` |
| `shell.js` | 7,003 | — | Bar, scroll region, action bar, the one live region |
| `dom.js` | 6,934 | — | `el`, `clear`, `appendProse`, `appendBlanked`, `pane` |
| `backup-ui.js` | 6,667 | — | Export/import screens |
| `feedback.js` | 6,265 | — | The one answer-feedback block |
| `backup.js` | 6,185 | — | Pure merge logic for progress export/import |
| `quiz-engine.js` | 6,056 | — | Pure scoring and shuffling |
| `report.js` | 3,736 | — | "Bu soruda bir sorun var" |
| `theme.js` | 3,240 | — | sistem / açık / koyu |
| `celebrate.js` | 3,236 | — | Canvas confetti |
| `quiz-launch.js` | 3,113 | — | The one path that starts a test |
| `answers.js` | 3,076 | — | The answer options, shared by Test and checks |
| `prompt.js` | 2,124 | — | The question's own text, shared three ways |
| `modal.js` | 1,936 | — | Confirmation on a native `<dialog>` |
| `config.js` | 1,409 | — | Cross-screen constants |
| `session-state.js` | 1,027 | — | Tab-scoped handoff index → quiz → results |
| `tiers.js` | 600 | — | Difficulty tier ids and Turkish labels |

Seven of these (`quiz-engine`, `storage`, `topics`, `config`, `tiers`,
`session-state`, `backup` — 68,109 bytes, 911 code lines) touch no DOM at
all. The other twenty (237,214 bytes, 3,998 code lines) build nodes.

### 1.3 What the app costs to open

`docs/research/architecture-and-scale.md` measured this on 2026-09-03 at
v0.13 and is the prior art the brief asks for. It found **328.8 KB over 27
requests, lesson list on screen at 1,034 ms**, of which 142.9 KB was
content JSON; its own follow-up note records the lesson-index fix bringing
that to **221.0 KB / 647 ms** with the JSON on the first screen dropping
from 142.9 KB to 3.7 KB. That document was measured against an
uncompressed local server.

Re-measured today at v0.63, gzip on, route `#egitim` *(measured)*:

| | |
| --- | --- |
| Requests | 31 |
| Transferred | **168,404 bytes — 164.5 KB** |
| DOM nodes after render | 230 |

| Kind | Bytes | Share |
| --- | --- | --- |
| ES modules (24 files, gzipped) | 98,119 | 58.3 % |
| Fonts (3 × woff2, already compressed) | 48,016 | 28.5 % |
| CSS (2 files, gzipped) | 14,780 | 8.8 % |
| Content JSON (`manifest.json`, gzipped) | 4,457 | 2.6 % |
| Document (gzipped) | 3,032 | 1.8 % |

The three entry graphs, gzipped per file as served *(measured)*:

| Entry | Modules | Raw | gz |
| --- | --- | --- | --- |
| `home.js` | 24 | 269,856 | 98,119 |
| `quiz.js` | 15 | 130,301 | 49,602 |
| `results.js` | 13 | 119,510 | 44,807 |

### 1.4 What it costs to *run*

Cold load to "the lesson list is on screen", CPU-throttled, no network
throttle *(measured)*:

| Throttle | FCP | DCL | Lesson list ready |
| --- | --- | --- | --- |
| 1× | 56 ms | 92 ms | **141 ms** |
| 4× | 124 ms | 248 ms | **417 ms** |
| 6× | 188 ms | 345 ms | **573 ms** |

With network throttling on top *(measured)*:

| Conditions | FCP | DCL | Lesson list ready |
| --- | --- | --- | --- |
| 4× CPU, 9 Mbps / 40 ms | 224 ms | 463 ms | **633 ms** |
| 6× CPU, 1.6 Mbps / 150 ms | 696 ms | 1,684 ms | **1,996 ms** |

**What this means for this app.** The app is currently fast on the phone
the brief describes and slow on the *network* it describes. 58 % of the
payload is the app's own JavaScript, and a third of that JavaScript is
prose comments. Hold that number — it is the finding this whole arm turns
on.

---

## 2. The candidates: runtime cost

All figures min+gzip. "Measured" means I gzipped the vendor's own minified
build from the npm tarball on 2026-09-15; "cited" means I could not
minify locally and used a published measurement.

| Runtime | Version | KB gz | How |
| --- | --- | --- | --- |
| **Plain ES modules** | — | **0** | nothing ships |
| Plain web components | — | **0** | platform |
| `htm` (template parser only) | 3.1.1 | **0.64** | measured — `dist/htm.module.js`, 1,207 B raw / 660 B gz |
| `@preact/signals-core` | 1.14.4 | **1.99** | measured — 2,034 B gz |
| lit-html only | 3.3.3 | **3.16** | measured — 7,309 B raw / 3,234 B gz |
| **Preact** (core) | 10.29.8 | **4.73** | measured — `preact.min.js`, 11,322 B raw / 4,841 B gz |
| **Preact + hooks + `htm`** | — | **5.20** | measured — `htm/preact/standalone.module.js`, 13,194 B raw / 5,325 B gz |
| **Lit** (html + reactive-element + element) | 3.3.3 | **5.44** | measured — 14,739 B raw / 5,573 B gz |
| Preact + hooks + `preact/compat` | 10.29.8 | **≈10.3** | measured, additive — 4,841 + 1,561 + 4,140 B gz |
| **Svelte 5** (compiled app runtime) | 5.57.0 | **2–5** | cited — compiler-only package; nothing to measure |
| **Solid** | 1.9.15 | **≈6–7** | cited; my un-minified upper bound was 20.9 KB gz |
| **htmx** | 2.0.10 | **16.2** | measured — `htmx.min.js`, 51,238 B raw / 16,539 B gz |
| **Alpine** | 3.17.3 | **19.4** | measured — `cdn.min.js`, 55,886 B raw / 19,907 B gz |
| **React 19 + react-dom** | 19.3.0 | **57.6** | cited — 186.49 KB min / 58.96 KB gz |

Sources for the cited rows: React 19 from
[guoyunhe/test-react-bundle-size](https://github.com/guoyunhe/test-react-bundle-size)
(Vite 6 build, React 19.0.0: 186.49 kB min / 58.96 kB gz — the same repo
gives React 18.3.1 at 143.87 / 46.34, so React 19 is ~27 % heavier than
React 18); Solid's ~6–7 KB runtime and Svelte 5's 2–5 KB per-app runtime
from the framework-size surveys collected at
[tech-insider.org/solidjs-vs-react-vs-svelte-2026](https://tech-insider.org/solidjs-vs-react-vs-svelte-2026/)
and
[khromov.se on Svelte 5 bundle size](https://khromov.se/svelte-5-brings-up-to-50-bundle-size-decrease-for-existing-svelte-4-apps/).
Lit's own claim of "about 5 KB" ([lit.dev](https://lit.dev/)) matches my
measured 5.44 KB closely enough to trust the method.

**React's un-minified floor, measured.** React 19's npm tarball ships
`cjs/react-dom-client.production.js` at 625,168 bytes — transpiled but not
whitespace-minified, because React now expects your bundler to do that.
Gzipped as shipped it is 110,528 bytes. That is the number a naive
`<script src>` from npm would cost, and it is 1.1× the app's entire
current JavaScript payload.

### 2.1 Parse and execute, which bytes do not tell you

Median of 7 evaluations from a Blob module URL, Chromium, CDP CPU
throttle *(measured)*:

| Runtime | 1× | 4× | 6× |
| --- | --- | --- | --- |
| React 19 core alone | 2.8 ms | 4.7 ms | 8.6 ms |
| **React 19 + react-dom client** | **38.0 ms** | **123.7 ms** | **185.9 ms** |
| Preact 10 | 1.9 ms | 6.2 ms | 7.5 ms |
| lit-html 3 | 2.6 ms | 6.0 ms | 7.5 ms |
| Preact + hooks + htm standalone | 1.8 ms | 3.8 ms | 6.6 ms |
| *(the whole app, nav → lesson list)* | *141 ms* | *417 ms* | *573 ms* |

Read the last two rows together. At 6× throttle **React would add ~186 ms
before one line of this app's own code runs — a 32 % increase in cold
start, spent entirely on machinery.** Preact, Lit and htm/preact add 7 ms:
1.2 %.

The React figure is measured against the un-minified production build and
is therefore an upper bound; a minified `react-dom` would parse faster. But
the gap is 25×, not 25 %, and minification does not close a gap that size.

**What this means for this app.** The app's users open it in 5–10 minute
standing sessions, six weeks before an exam, on mid-range Android over
Turkish mobile data. `docs/research/architecture-and-scale.md` already
judged one second to the lesson list worth half a day's work to remove.
React would put a third of it back, permanently, in exchange for nothing
the learner can see.

---

## 3. The styling layer

Current state, for comparison: **one stylesheet, 1,986 lines, six cascade
layers (`tokens, reset, layout, components, screens, utilities`), 113
unique custom properties, 251 rules, 15 media queries, 6 keyframes,
11,808 bytes gzipped** *(measured)*. No build, no tooling, no plugin.

| Option | Build step? | Output for an app this size | Transitive packages | node_modules (linux-x64) |
| --- | --- | --- | --- | --- |
| **Plain CSS + custom properties + `@layer`** | **No** | 11.8 KB gz today, 8.5 KB gz with comments stripped | **0** | **0 MB** |
| **Tailwind v4** via `@tailwindcss/cli` | **Yes** | 6–15 KB gz (cited) | **37** | **46.5 MB** |
| Tailwind v4 via `@tailwindcss/vite` | Yes | same | 28 (+ Vite: 18) | 44.9 MB (+ 60.4) |
| Tailwind v4 via `@tailwindcss/browser` | No | **73.5 KB gz of JS** | 1 | — |
| **CSS Modules** | **Yes** (bundler) | ≈ same CSS, hashed names | Vite: 18 | 60.4 MB |
| **vanilla-extract** | **Yes** | ≈ same CSS, hashed names | **90** | **52.8 MB** |
| **Panda CSS** | **Yes** (+ codegen) | atomic CSS, Tailwind-like | **149** | **114.9 MB** |
| **StyleX** | **Yes** (Babel + bundler) | atomic CSS | 49 (`@stylexjs/babel-plugin`) | 12.2 MB |

All *(measured)* except the Tailwind output range, which is cited from
[Panda CSS vs Tailwind v4 vs Vanilla Extract, 2026](https://kanopylabs.com/blog/panda-css-vs-tailwind-v4-vs-vanilla-extract)
and the survey at
[pkgpulse: Open Props vs Tailwind v4](https://www.pkgpulse.com/guides/open-props-vs-tailwind-v4-2026)
— reported figures cluster at 6–20 KB gz for a typical app, and 14.2 KB gz
for a 500-component benchmark. **Tailwind v4's output for this app would
land within ±3 KB of the stylesheet that already exists.**

### 3.1 Tailwind v4 without a build step costs 73.5 KB of JavaScript

`@tailwindcss/browser@4.3.3` — the CDN path, the only Tailwind that runs
without tooling — is **282,289 bytes raw, 73,541 bytes gzipped**
*(measured)*. That is 75 % of the app's entire current JavaScript payload,
downloaded so that CSS can be generated in the browser on every cold
start, after the stylesheet would otherwise have been ready. It also has
to be pre-cached for offline, and it runs before first paint. This is not
a viable option here; it is listed so nobody proposes it.

Tailwind v4's engine is a Rust rewrite (Oxide) using Lightning CSS, and it
ships as the Vite plugin, the PostCSS plugin or the standalone CLI — all
three are build steps
([Tailwind v4 / Oxide overview](https://anhtu.dev/tailwind-css-4-and-the-oxide-engine-when-a-css-framework-is-rewritten-in-rust-1094)).

### 3.2 Tailwind breaks `npm run color`, and that is disqualifying

`tools/palette.mjs` holds a `PAIRS` table: a hand-maintained list of
*semantic class → px → weight → text token → surface token* tuples
(`{ where: ".t-display", px: 36, weight: 600, token: "text-1", on:
"surface-2" }`), and CI re-measures every one against WCAG 2 **and** APCA
in both themes. This works because the app has roughly thirty *named* text
roles, and the class name tells you the size, the weight, the ink and the
ground it sits on.

Utility CSS destroys exactly that property. Under Tailwind, "which ink at
which size on which ground" is a combinatorial fact about the markup, not a
declarable fact about a rule. The `PAIRS` table cannot be written, and
`npm run color` — which CLAUDE.md records as having caught a palette that
passed WCAG everywhere and failed APCA everywhere — cannot run.

Panda and StyleX are atomic-CSS generators and break it the same way.
CSS Modules and vanilla-extract keep semantic class names and would *not*
break it, but they also do not change the stylesheet's content — they
change where it is written and add a bundler to compile it.

**What this means for this app.** The styling layer is the one place where
the answer is unambiguous: every candidate either changes nothing about
the output and adds 18–149 packages, or changes the output and takes the
accessibility checker with it. The current approach — tokens, cascade
layers, semantic classes, measured colours — *is* the professional design
system architecture the owner is asking for. It is not what is failing.

---

## 4. The real constraints, candidate by candidate

The five that bind:

1. **GitHub Pages, branch-served.** `test` is the deployed branch; a push
   is a deploy. There is no build in the pipeline, and `.github/workflows/`
   contains one job that only runs checks. A build step means either
   committing `dist/` into the branch — the exact class of noisy diff
   CLAUDE.md already complains about for content formatting — or adding a
   Pages Actions deploy, which makes "push = deploy" into "push, wait for
   CI, hope".
2. **Offline.** `sw.js` pre-caches a hand-written 31-entry `SHELL` list and
   is version-pinned to `CHANGELOG.md` by `tests/service-worker.test.js`.
3. **Mid-range Android in Turkey.** Alex Russell's 2026 baseline is a
   Samsung Galaxy A24 4G at the 75th percentile
   ([Performance Inequality Gap, 2026](https://infrequently.org/2025/11/performance-inequality-gap-2026/)).
   The budgets there are generous in bytes (~1.5 MiB JS-light at three
   seconds); the constraint that actually bites is CPU, which §2.1
   measures.
4. **No `innerHTML`, anywhere.** An XSS decision, and also the reason
   `js/dom.js` exists.
5. **CI runs a colour checker and a 3,381-line Playwright sweep** that
   depends on ~59 stable selectors and does `await import("/js/storage.js")`
   inside the page.

| Candidate | Breaks | Improves |
| --- | --- | --- |
| **Plain ES modules** (today) | nothing | nothing |
| **React 19** | Needs a bundler → Pages deploy changes shape; `sw.js` SHELL must be regenerated (a real chore, but automatable); `verify-ui.mjs`'s `import("/js/storage.js")` stops resolving; every class name in the sweep must be preserved by hand. JSX *is* `innerHTML`-free (it builds nodes), so rule 4 survives — but `dangerouslySetInnerHTML` becomes one keystroke away and the rule stops being structural. +186 ms cold start at 6× CPU. | Keyed reconciliation; one shared state model; the largest hiring pool, which is irrelevant to a solo maintainer. |
| **Preact + JSX** | Same build-step and sweep breakage as React. | Same benefits, at 4.7 KB and 7.5 ms instead of 57.6 KB and 186 ms. |
| **Solid** | Compiler is mandatory — Solid's JSX is not optional sugar, it is the compile target. So: build step, and a debugger that shows compiled output. | Finest-grained updates of anything here; no VDOM; the fixed-height shell would never see a full-subtree replace. |
| **Svelte 5** | Compiler mandatory. `.svelte` is **a second language for one person to maintain**, with its own tooling, its own editor plugin, its own upgrade path. Component styles are scoped by the compiler, which cuts across a single global sheet with six cascade layers — the design system would have to be re-expressed. | Smallest shipped runtime of the compiled options. |
| **Lit** | Nothing structural. Runs from a plain `<script type="module">`. **But**: Lit's default is shadow DOM, and shadow DOM is where `css/style.css` stops applying. Every component would need `adoptedStyleSheets` or a token re-import, or would have to opt into light DOM via `createRenderRoot`. `lit-html` renders from tagged templates — it builds a `<template>` and clones it, so no `innerHTML` on user data, but the static parts of a template *are* parsed as HTML. | Real templates without a build; 5.4 KB; standards-track. |
| **Alpine** | Its expression evaluator uses `new Function` *(measured: one occurrence in `dist/cdn.min.js`)*, so it needs `unsafe-eval`; `@alpinejs/csp` exists as a separate build that forbids expressions in attributes. Alpine's model is behaviour sprinkled on server-rendered HTML — this app renders everything from JSON, so every screen would become an HTML `<template>` driven by `x-for`, which is a bigger rewrite than React. 19.4 KB. | Nothing this app lacks. |
| **htmx** | **Structurally inapplicable.** htmx's premise is that a server returns HTML fragments. This app has no server — GitHub Pages serves files. And htmx's whole mechanism is swapping response HTML into the DOM, i.e. `innerHTML`, which is rule 4. | Nothing. |

**Rejections, stated plainly (brief rule 4).** htmx is rejected because the
architecture it requires does not exist and cannot be added to a static
host. Alpine is rejected because it costs 19.4 KB, needs a CSP exception or
a second build flavour, and solves a problem (adding interactivity to
server HTML) this app does not have. Svelte is rejected because a solo
maintainer inheriting a second language plus a compiler plus scoped-CSS
semantics that fight the existing cascade-layer system is a worse position
than the one he is in. React 19 is rejected on §2.1: 57.6 KB and 186 ms for
a feature set Preact delivers at 4.7 KB and 7.5 ms.

---

## 5. The honest trade

### 5.1 What a framework would actually buy, found in `js/`

I went looking for the problems a component framework solves. Here is
everything I found, with line numbers.

**Found — one genuine re-render defect.** `js/education.js:1409–1416`:

```js
const top = scrollRegion.scrollTop;
wrap.replaceWith(renderCheckBlock(question, blockIndex, { label }));
scrollRegion.scrollTop = top;
```

The comment above it records that the browser's scroll anchoring moved the
page by 162 px on a 320 px screen when a check was answered — "the whole
verdict line sliding out from under the reader's eyes". The cause is that
the block's DOM node is *replaced* rather than patched. **Any of React,
Preact, Solid or Lit patches in place and this bug does not exist.** This
is the single strongest argument in the whole arm for a framework, and it
is worth exactly one three-line workaround that is already written,
already commented, and already covered by `verify-ui.mjs`.

**Found — one hand-rolled state propagation.** `js/profile.js:98` and
`js/onboarding.js:56` dispatch `new CustomEvent("profile:namechange")`,
listened for at `js/home.js:692`, because two modules need to agree on the
learner's name without importing each other. That is a pub/sub bus with
exactly one topic *(measured: 2 dispatch sites, 1 listener, in 8,285
lines)*. A signals library — `@preact/signals-core` at 1.99 KB — would
replace it. So would a five-line `store.js`.

**Found — one destroy-the-input-you-are-editing hazard.**
`js/profile.js:94–99`: the name field's `change` handler calls `render()`,
which does `clear(container)` and rebuilds the whole tab, destroying the
input. It does not bite today because `change` fires on blur, so focus has
already left. It is the exact bug class keyed diffing removes.

**Not found — everything else.** There is no manual diffing anywhere; the
render functions are `f(state) → nodes` and blow away their subtree.
`removeEventListener` appears twice in the codebase (`education.js`,
`listbox.js`), so there is no listener-leak problem. There are 8
`setTimeout`/`requestAnimationFrame` calls in total and 6 of them are
animation frames in `celebrate.js` and `widgets.js` — no timing hacks
papering over render ordering. Module-level mutable state is a handful of
router bookkeeping variables. The DOM the app manages is **230 nodes**
*(measured)* — a size at which VDOM reconciliation is a rounding error.

**The uncomfortable conclusion.** `js/answers.js` is 75 lines of
`renderOptions(question, { selected, answered, onSelect })` returning a
node. That is a component. `js/widgets.js` exports nine of them.
`js/dom.js` is `createElement` with a shorter name. **This app already has
the component model.** What it lacks is the *patch* step, and the patch
step matters in precisely one place, which is already handled.

### 5.2 What a framework would cost, concretely

- **821 lines of plumbing become ~400 lines of template.** The codebase
  contains 453 `appendChild` calls and 368 `el(` calls *(measured)*. JSX,
  htm or lit-html templates would roughly halve that. Against 4,888 code
  lines total, that is a **~9 % reduction**, and it is the *entire* DX win
  on the table.
- **A build step in the deploy path.** Today `git push` is the deploy.
  After, it is a compile whose output either pollutes the branch or lives
  behind an Actions workflow.
- **A dependency audit surface where there is none.** React + react-dom is
  2 packages; a Vite build is 18 more *(measured)*, 60.4 MB on disk. Every
  one of them is now something that can be yanked, compromised or
  abandoned during the six weeks before someone's exam.
- **`npm run verify` needs rewriting.** It imports `/js/storage.js` inside
  the browser and asserts on ~59 selectors across 3,381 lines. Under a
  bundler those module URLs do not exist.
- **`sw.js` needs generating.** Its 31-entry `SHELL` list is hand-written.
  (This one is a *benefit* of tooling, not a cost: a build step could
  generate it and remove a standing chore.)
- **The comments die.** 2,690 comment lines, 32.4 % of `js/`, are this
  project's actual documentation — why scroll anchoring is pinned, why
  options stay focusable with `aria-disabled`, why the content cache is
  unversioned. A rewrite into a new component syntax does not carry them
  across; it paraphrases them, and half get dropped. `docs/` records three
  successive content-schema rewrites forced by presentation changes, each
  of which cost the content. This would be the same mistake at the code
  layer.

### 5.3 The number that decides it

Strip comments and blank lines from the 24 modules the home screen loads
and re-gzip *(measured)*:

| | Raw | gz |
| --- | --- | --- |
| As served, 24 separate files | 269,856 | **98,119** |
| Concatenated into one file | 269,856 | 87,162 |
| Concatenated, comments and blanks stripped | 141,416 | **36,221** |

And the stylesheets *(measured)*:

| | Raw | gz |
| --- | --- | --- |
| `style.css` + `fonts.css` as served | 60,198 | **14,780** |
| Comments stripped | 44,510 | **8,449** |

So a plain bundle-and-minify step — no framework, no new language, no
change to a single line of source — takes the first visit from **164.5 KB
to ~96 KB, a 42 % cut**, and removes 30 of the 31 requests. It saves
**61.9 KB of JavaScript**: more than React 19 weighs.

That is the whole finding. **The build step is worth having. The framework
it was supposed to justify is not.** Adopting React *and* minification
would net roughly zero bytes against today. Adopting minification alone
nets 68 KB and costs 7 ms of nothing.

*(These are comment-stripping figures, not true minification — identifier
mangling would go further. They are therefore a conservative floor.)*

---

## 6. The middle path: a component model with no build step

Three ways to get templates and patching while `git push` stays the
deploy.

### 6.1 Preact + htm, one file, no compile

`htm/preact/standalone.module.js` is Preact, hooks and the htm template
parser in a single pre-minified ES module: **13,194 bytes raw, 5,325 bytes
gzipped, median 6.6 ms to parse and execute at 6× CPU throttle**
*(measured)*. It is imported by a plain `<script type="module">` and
vendored into `js/vendor/` like any other file the service worker already
caches.

It gives real templates and real keyed diffing:

```js
import { html, render } from "./vendor/preact-standalone.module.js";
const options = (q, sel) => html`
  <div class="options" role="radiogroup">
    ${q.options.map((o, i) => html`<button class="option" key=${o}>…</button>`)}
  </div>`;
```

**DX cost, honestly.** htm parses the template string at runtime and caches
the parse per call site, so the first render of each template pays a small
one-off cost — 0.64 KB of parser plus that. Editors do not type-check
tagged templates the way they type-check JSX, so the autocomplete is
worse. `htm` uses `key=${…}` and spread syntax that reads like JSX but is
not JSX, which is a papercut every time someone copies a React snippet.
And the app's own `el()` helper would coexist with it for a long time
unless the migration is done in one go, which it should not be.

### 6.2 Lit from a vendored ESM bundle

Measured at **5,573 bytes gzipped** for html + reactive-element + element
(3,234 for lit-html alone), **7.5 ms at 6× throttle**. lit-html renders by
building a `<template>` and cloning it, with values bound as text nodes and
attributes — so user content never becomes markup and rule 4 holds. Lit
also has a `render(template, container)` mode that needs no custom elements
and no shadow DOM at all, which is the mode that fits here.

**DX cost.** If custom elements *are* used, the default render root is a
shadow root and `css/style.css` stops crossing it. Lit's answer is
`static styles` per component plus `adoptedStyleSheets`, which means the
design system stops being one file with six cascade layers and starts
being sixty fragments — a direct contradiction of design-system §0 and of
the way `npm run color` reads the stylesheet. Using Lit in light-DOM mode
avoids all of that but also discards the reason most people pick Lit.

### 6.3 Plain web components

Zero bytes. `customElements.define`, `<template>` + `cloneNode(true)` +
`textContent` — `innerHTML`-free, and the clone-a-template pattern is a
real ergonomic gain over 453 `appendChild` calls. But there is no
reactivity: you still write the update path by hand, so the one real defect
in §5.1 is not fixed. And shadow DOM carries the same stylesheet problem as
Lit. Custom elements without shadow DOM and without a reactive layer are
`js/widgets.js` with extra ceremony.

### 6.4 The three, side by side

| | Bytes gz | Eval @6× | Build? | Fixes `education.js:1415`? | Survives `npm run color`? |
| --- | --- | --- | --- | --- | --- |
| Preact + htm | 5,325 | 6.6 ms | No | **Yes** | **Yes** |
| Lit (light DOM) | 5,573 | 7.5 ms | No | **Yes** | **Yes** |
| Lit (shadow DOM) | 5,573 | 7.5 ms | No | Yes | **No** |
| Web components | 0 | 0 ms | No | No | Yes (light DOM only) |
| `@preact/signals-core` alone | 2,034 | — | No | No | Yes |
| React 19 + JSX | 57,600 | 185.9 ms | **Yes** | Yes | Yes |

---

## Öneri

**Do not adopt a component framework. Adopt a build step that only
minifies.** Keep plain ES modules, keep the single stylesheet with its
tokens and cascade layers, keep zero runtime dependencies.

Three moves, in order:

1. **Add `npm run build`: concatenate per entry point, strip comments,
   minify, emit to `dist/`, and generate `sw.js`'s `SHELL` list from the
   output.** Measured payoff: first visit **164.5 KB → ~96 KB (−42 %)**,
   **31 requests → ~5**, JS **98.1 KB → 36.2 KB or less**. Runtime cost:
   zero. New language: none. The `SHELL` list stops being hand-maintained.
   This is the single largest performance win available to this app and it
   has nothing to do with frameworks.

   The one thing to get right is that `dist/` must be built and published
   by a GitHub Actions Pages deploy, not committed to `test`. Committing
   build output into the served branch reproduces, at the code layer, the
   four-hundred-line-diff problem CLAUDE.md already documents for content
   formatting. Source stays readable and commented on `test`; only the
   deploy is compiled. `npm run serve` must keep serving *source*, because
   `verify-ui.mjs` imports `/js/storage.js` in the page — so the sweep runs
   against source and a second, shorter smoke run covers `dist/`.

2. **Do not move to a framework now.** If the visual redesign this round is
   feeding into turns out to need one, the move is
   **Preact + htm, vendored, no build step** — 5,325 bytes gzipped, 6.6 ms
   at 6× CPU throttle, importable from a plain `<script type="module">`,
   fixes `js/education.js:1415`, keeps every class name the Playwright
   sweep asserts on, keeps `npm run color` working, and can be adopted one
   render function at a time because `el()` and `html` compose in the same
   tree. **Not React**: it costs 11× the bytes and 25× the parse time for
   the same programming model.

3. **If the only itch is state, scratch only that.** `@preact/signals-core`
   is 2,034 bytes gzipped and replaces the `profile:namechange`
   CustomEvent bus. A hand-written `store.js` is smaller still.

### The decision rule the owner can check against

Adopt a component framework **only when all four are true**:

1. **More than five** `replaceWith`/`clear()`-and-rebuild sites need
   scroll, focus or animation state preserved across a re-render. Today:
   **one** (`js/education.js:1415`). `grep -c "replaceWith" js/*.js` is the
   check.
2. **More than three** independent cross-module state dependencies exist.
   Today: **one** (`profile:namechange`). `grep -rn "CustomEvent" js/` is
   the check.
3. The framework's runtime costs **under 10 KB gzipped and under 15 ms to
   parse and execute at 6× CPU throttle** — because the app's whole cold
   start is 573 ms there and anything costing more than ~2.5 % of it is
   buying comfort with the learner's time.
4. It can be **vendored and imported without a bundler**, so `git push`
   stays the deploy and `npm run verify` keeps working against source.

React 19 fails 3 and 4 today and would still fail them if 1 and 2 became
true. Preact + htm passes 3 and 4 now and is waiting for 1 and 2.

Do **not** adopt a styling layer under any of these conditions: Tailwind,
Panda and StyleX all make `tools/palette.mjs`'s `PAIRS` table
unwriteable, and none of the six candidates produces smaller CSS than the
11.8 KB (8.5 KB stripped) already shipping.

### What would change this answer

- **A measurement, not a source, showing React 19 minified parses in under
  40 ms on a real Galaxy A24.** My 185.9 ms is on an un-minified build at a
  synthetic 6× throttle. If the true figure is four times better, criterion
  3 becomes arguable for React — though Preact would still be five times
  better again.
- **The app growing a second surface with genuinely shared live state** —
  a sync layer, a multi-device account, a timed exam runner with a clock
  several screens read. Criterion 2 would break immediately and the
  five-line store would stop being enough.
- **A second maintainer.** Every argument in §5.2 about a solo maintainer's
  cost of a second language inverts if someone is hired who already knows
  React and does not know this codebase's 2,690 comment lines.
- **The redesign requiring animated list reordering** — shared-element
  transitions, drag-to-reorder, a leaderboard that resorts. Keyed
  reconciliation stops being a luxury there, and criterion 1 goes from one
  site to many in a single feature.
- **`@tailwindcss/browser` dropping below ~8 KB gz**, which would make the
  no-build Tailwind path arguable on bytes. It is 73.5 KB today and the
  architecture makes that unlikely.

---

## Doğrulanamayanlar

- **The 6× CPU throttle is not a calibrated Galaxy A24.** CDP's
  `setCPUThrottlingRate` slows *this container's* CPU by a factor. The
  2026 baseline device is a Galaxy A24 4G
  ([infrequently.org](https://infrequently.org/2025/11/performance-inequality-gap-2026/));
  I could not fetch that article directly (egress blocked) and have not
  established what multiplier maps this machine onto that handset. Every
  6× figure here should be read as a ratio between candidates, which is
  sound, not as a prediction of milliseconds on a phone, which is not. [?]
- **React 19's parse figure is an upper bound.** The build npm ships as
  `react-dom-client.production.js` is 625,168 bytes and not
  whitespace-minified. A bundler-minified build would parse faster; I
  could not minify locally (no minifier available, and installing one was
  out of scope). The 57.6 KB gz *byte* figure is cited, not measured. [?]
- **Solid's and Svelte 5's runtime sizes are cited, not measured.** Solid's
  npm `dist/solid.js` is unminified (12,284 B gz; plus `web/dist/web.js` at
  8,629 B gz = 20.9 KB gz as an upper bound); Svelte ships a compiler, so
  there is no artifact to weigh without building an app. Their eval times
  were not measured at all. [?]
- **Tailwind v4's output size for *this* app is an estimate.** The 6–15 KB
  gz range is from third-party benchmarks of other apps. Running Tailwind
  against this codebase would require installing it. [?]
- **GitHub Pages' actual compression was not confirmed.** All transfer
  figures assume gzip, measured against a local gzip-enabled server. Pages
  is fronted by Fastly and gzips text; whether it also serves brotli, which
  would cut another ~15–20 %, I did not verify. [?]
- **The `npm run build` payoff is comment-stripping, not minification.**
  36,221 B gz is the floor a real minifier would beat, not a number a real
  minifier produced. The direction is certain; the magnitude is
  conservative. [?]
- **The ~9 % line-count reduction from templates is an estimate**, derived
  from 453 `appendChild` + 368 `el(` call sites against 4,888 code lines.
  Nobody rewrote a screen to check. [?]
- **`docs/research/architecture-and-scale.md`'s 2026-09-03 figures are not
  directly comparable** to mine: they were taken uncompressed at v0.13
  against a different content corpus. Both are cited with their conditions
  rather than differenced.
- **An untracked 2.5 MB React-bundled design canvas
  (`english-prep-arayuz-yonleri.html`, 868 KB gzipped) sits in the repo
  root.** It is a Claude Design canvas, not app code, and its weight is
  the canvas editor rather than the design. It is noted only so nobody
  reads it as evidence about React's cost in this app. [?]
