# English Prep now · v0.75 (2026-10-04), read 2026-10-10

Read this first. It describes what the code does today, checked against the files named.
Where it and an older document disagree, this page and the code win. Draft: see
[AUDIT.md](AUDIT.md).

## Content

10 topics, 60 lessons, 241 questions, 723 option notes (`data/`). Eight grammar topics, two
vocabulary topics (`academic-verbs`, `academic-nouns-adjectives`), closest-meaning items.
Lessons are typed blocks: `contrast`, `forms`, `examples`, `pitfall`, `decision`, `text`,
`check`. Planned and not built: `so / such` (no topic yet; the cloze map points at a missing
`so-such` topic, `js/topics.js:334`), paragraph completion, reading passages.

## Screens

| Screen | Route / file | What is on it |
|---|---|---|
| Eğitim | `index.html#egitim` | "Bildiğin İngilizceyi netleştir.", real corpus totals, a resume/reading action, search, topic index |
| Topic overview | `#egitim/konu/<id>` | the topic's intro and its six lessons |
| Lesson | `#egitim/<lessonId>` | one continuous article; an optional pretest open on first visit ("Derse geç"); inline checks that never gate; a drawn completion signature on first finish; the elastic scroll rail |
| Test | `#test` | topic tests, mixed test, category practice, Yanlış defteri (mistake book) |
| Quiz | `quiz.html` | one question at a time; one press commits; answer rows keep their geometry; feedback and rationale stay until "next"; tab-local resume on refresh |
| Results | `results.html` | correct/answered fraction with a linear bar, per-answer review; first-presentation signature (tab-local marker) |
| Profil | `#profil`, from the header | name/avatar, linear completion and recent-accuracy metrics, theme (Koyu / Açık / Sistem), the motion toggle, install, backup preview (share/download/copy), restore, reset |
| Introduction | `#hosgeldin` | optional, three pages: six illustrated Eğitim/Test scenes, then an optional name |
| About | `about/` | product page around an inspectable three-leaf folio of real captures; feature and technical disclosures |

Wide screens (≥1080×600) add a 300 px companion pane on suitable screens; lessons and quizzes
stay single-column at ~592 px. The home pane is sticky only from 800 px tall.

## Visual language as implemented

- **Ground and surfaces:** dark first, plum `#141216`, cards `#1d1a20`, raised `#28242c`;
  a pale Sakura light theme. Cards are opaque. Live tokens: `css/editorial.css:13-105`.
- **Colour roles:** cherry/Sakura gradient `#ed96b4 → #dca2d8` on the one primary action;
  iris (structure), lagoon (context), apricot (attention). Correct = opaque Sakura surface,
  selected wrong = periwinkle, always with a check/cross mark and the word Doğru/Yanlış.
- **Type:** Inter variable for both languages (`assets/fonts/`). Roles: 30/36 page title,
  24 panel, 20 section, 18/30 reading, 16 annotations and controls, 14 metadata.
- **Atmosphere:** three drifting aurora clusters (cherry, iris, lagoon) behind every route,
  one parent opacity .42 dark / .09 light, paused in hidden tabs, still pools under reduced
  motion, removed in forced colours. Contrast is proven by `tools/editorial-palette.mjs`.
- **Material:** no blur anywhere today. `css/editorial.css:184-189` neutralises the older
  glass bars from `css/style.css`. This is the current look, not a principle (open question 1).
- **Motion:** press 120 ms / release 380 ms on control faces; page arrivals 360 ms over 12 px
  (the v0.72 choreography); longer timings only for artwork and real completion (560 to
  1100 ms). All finite, cancellable, and never in front of input (`js/interactions.js`).
- **Brand:** `ep.` / `english prep.` in Inter 600 with a Sakura dot (`js/brand.js`).

## Known weak spots

1. **Documentation.** `CLAUDE.md` mixes three eras; values are repeated in CLAUDE.md, the
   Margin doc, EXPERIENCE.md, ADRs 006–013 and the family README, and they disagree. See
   AUDIT.md §3.
2. **Two style layers.** `css/style.css` still carries the UI 3 skin (glass, glow, springs,
   slate palette); `css/editorial.css` overrides it, partly with `!important`. `tools/palette.mjs`
   and the sweep's "bars ≥0.8 opaque before blur" check (`tools/verify-ui.mjs:2765`) still test
   the overridden layer.
3. **Dead code.** `js/celebrate.js` (only precached in `sw.js:17`); `ring`, `monogram`,
   `countUp`, `choices` in `js/widgets.js`; `loadRoadmap` (`js/topics.js:90`), so
   `data/roadmap.json` is never shown.
4. **Unverified on devices.** iPhone Safari toolbar behaviour and real-phone performance of
   the aurora are untested; all evidence is Chromium emulation.
5. **Tests.** The Python browser suites (`tests/*_browser.py`) are not wired to any npm script
   and disagree on the server URL (`:8000` vs `:8182/english-prep`). CI runs `npm run check`
   on `main`/`test` only.
6. **Content gaps** listed above; app-level improvements the owner wants are not yet written
   down anywhere.

## Open questions for the owner

1. Is glass/blur allowed again, with a legibility test instead of a ban?
2. Is grain/texture allowed (nothing forbids it; nothing uses it)?
3. Is `docs/app1-final.md` still the closed plan, or does a new roadmap for app-level
   improvements replace it?
4. How free is About to change, including the folio?
5. Adopt the draft `CLAUDE.md` and move history to `docs/history/` now, or in steps?
6. Later, as code work: remove the dead UI 3 layer from `css/style.css` and the dead modules?
