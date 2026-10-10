# /about/ — authoring guide (v0.77)

The portfolio page. Its idea is the product's thesis: **"İkisi de doğru.
Fark, anlamda."** A learner whose ear is already right is shown the
boundary between two correct forms. The page demonstrates that before it
describes anything.

Files: `index.html` (static skeleton and all headings — the page reads
without JavaScript), `content.js` (every editable string), `about.js`
(behaviour), `about.css` (scoped to `.about-page`), `assets/` (real
captures). No `innerHTML`; every node is built and text set with
`textContent`. The page never writes learning data.

## Sections

| # | Section | Source of truth |
| --- | --- | --- |
| 1 | **Lens** — two correct sentences as a radiogroup; a diagram that changes with the meaning; three pairs; optional autoplay | `pairs` in `content.js` |
| 2 | **Manifesto** — who it is for, lit word by word with reading progress | `manifesto` |
| 3 | **Map** — every topic and lesson, each chip opening its lesson | `data/manifest.json` at runtime |
| 4 | **Anatomy** — one real question, answerable, with five named parts | `anatomy` + the topic file at runtime |
| 5 | **Loop** — Oku / Uygula / Geri dön on real captures; a sticky device follows the step on wide screens | `flow` + `assets/*-phone.webp` |
| 6 | **Craft** — spring curves drawn from `spring()` in `js/interactions.js`; contrast ratios computed from this page's tokens; content pipeline; figures; data/privacy, with links to its proof (the hero's promise line links to it) | `craft` |
| 7 | FAQ (native `<details>`) | `questions` |

## Rules for editing

- **A lens pair must be two sentences a competent speaker accepts.** The
  page's claim is that both are right; a pair with a wrong half breaks it.
  Name the lesson by `topic` + `category` (ids are derived with
  `lessonId`), and pick `diagram: "timeline"` or `"path"`. A new kind of
  diagram needs a builder in `about.js`.
- **Counts come from data.** Topics, lessons, questions and option notes
  are read from `../data`; never type them into the copy. The craft
  figures (tests, browser checks) are the exception — update them when
  the suites grow.
- **The anatomy question** is chosen by id. If it is removed from the
  data the section hides itself; choose another with `optionNotes` and a
  `tip`.
- **Captures** are real app screenshots at 2× (`780×1688` phone). The
  test suite checks their pixel size.

## Motion

- `[data-reveal]` elements are hidden before first paint **only** when
  motion is allowed (inline head script) and shown by an
  IntersectionObserver as they approach. A 2.5 s fallback shows
  everything if the module never loads.
- Springs are the app's own (`spring()`), passed to CSS as
  `--ab-spring*`.
- Autoplay of the lens runs once through the pairs, only while visible,
  stops on any interaction and has a pause/play button (WCAG 2.2.2).
- Reduced motion or the Profil switch: no hidden state, no autoplay,
  manifesto fully lit, spring demo disabled.

## Verification

`tests/about_interaction_browser.py` (serve the repo under
`/english-prep/` on :8012). `tests/reading_system.py` opens it offline,
`tests/v071_motion_browser.py` checks the motion switch and capture
pixels.
