# English Prep — state of the app · v0.77

Checked against branch `test` at `dbd2651` on 2026-10-10. Replaces `docs/history/handover/CURRENT.md` (written at v0.75) and `docs/history/handoff-v1.md` (v0.76, Turkish). Where this and an older document disagree, the code wins, then this page. "Unverified" marks claims taken from earlier documents and not re-checked here.

## 1. Product

A static, mobile-first web app for Turkish university prep-school proficiency exams (YTÜ İYS style) aimed at learners whose English comes "by ear". **Eğitim** is 60 article lessons, each one "X vs Y" distinction. **Test** is explained questions with immediate feedback and a mistake book (Yanlış defteri). **Profil** (opened from the header) holds identity, metrics, settings and backup, and `/about/` is the portfolio page. There are no accounts, server or analytics: all state is in `localStorage` (`js/storage.js`). There is no build step and no runtime dependencies (`package.json:6`).

| Fact | Value | Evidence |
|---|---|---|
| Topics / lessons / questions | 10 / 60 / 241 | `npm run validate` → "10 live … 241 question(s), 60 lesson(s)." |
| Option notes | 723 (every question has `optionNotes`) | node count over `data/*/*.json`; About shows it live (`about/about.js:369`) |
| Validate warning | `academic-nouns-adjectives-t13` / `-t16` have identical option sets | `npm run validate` (1 warning, passes) |
| Unit tests | 250, all pass | `npm test` → `# tests 250 # pass 250` (incl. `tests/family-world.test.js`) |
| Browser scenario files | 17 Python Playwright suites, 136 pass + 1 skip (axe matrix, opt-in) (2026-10-10) | `npm run browser` |
| `npm run verify` sweep | 3,591 checks at 4 widths, all pass (2026-10-10) | `npm run verify` |
| Planned, not built | `so / such` (cloze map points at missing topic `so-such`, `js/topics.js:334`), paragraph completion, reading passages | |

## 2. Branches and release

The owner's policy (2026-10-10) is that only two branches exist:

- **`test`** is the live GitHub Pages site and the only development branch. Sessions work here and push after checks: `npm run check`, plus `npm run serve` + `npm run verify` for any change to a screen.
- **`main`** is the owner's release branch. Only the owner pushes to it, by hand.

CI (`.github/workflows/ci.yml`) runs two jobs on push or PR to both branches: `check` (format:check, validate, color, test) and `browser` (`npm run verify`, then `npm run browser`, with Playwright 1.56 installed in the job).

Each release bumps `VERSION` in `sw.js:4` (currently `"english-prep-v0.77"`). Without the bump, installed clients keep the old shell cache.

**V1 (owner, 2026-10-10)** means a presentable, working, family-aligned, portfolio-ready product that the owner signs off. It does not mean exam coverage or more content. `app1-final.md` and its "30/60 exam coverage" definition (handoff-v1 §6B) are history.

## 3. Screens (v0.77)

| Screen | Route / file | What is on it |
|---|---|---|
| Eğitim | `index.html#egitim` (default, `js/home.js:44-45`) | "Bildiğin İngilizceyi netleştir." (`js/education.js:151`), corpus totals, resume action, search, topic index |
| Topic overview | `#egitim/konu/<id>` (`js/home.js:649`) | topic intro and its six lessons |
| Lesson | `#egitim/<lessonId>` | one continuous article; optional pretest open on first visit; non-gating inline checks; completion signature on first finish; elastic scroll rail |
| Test | `#test` | topic tests, mixed test, category practice, Yanlış defteri |
| Quiz | `quiz.html` | one question at a time; one press commits; verdict gesture plus rationale; tab-local resume |
| Results | `results.html` | correct/answered with a linear bar, per-answer review, signature on first presentation |
| Profil | `#profil` | name/avatar, metrics, theme (Koyu/Açık/Sistem), motion switch, install, backup preview, restore, reset |
| Introduction | `#hosgeldin` | optional, three pages: six illustrated Eğitim/Test scenes, then an optional name |
| About | `about/index.html` | rebuilt in v0.77 around the thesis **"İkisi de doğru. Fark, anlamda."** (`about/index.html:8,62`). Sections: lens (`#lens`, two correct sentences with a diagram that follows the meaning), manifesto (`#fikir`), distinction map from `data/manifest.json` (`#harita`), anatomy of one real question that can be answered but is never recorded (`#soru`), study loop on real captures (`#urun`), live craft proofs (`#yapim`), FAQ (`about/index.html:58-168`, `about/README.md`). **The folio is gone.** |

The first visit is always dark: `js/theme.js:11` falls back to `"dark"`, and light applies only when chosen or via "Sistem". At ≥1080×600 a companion pane appears (`css/editorial.css:1045,1431`). It is sticky only from 800px tall (`css/composition.css:55-58`).

## 4. Architecture

**Pages:** `index.html` (185 lines), `quiz.html`, `results.html` (94 each) and `about/index.html` (190). Each one carries its own aurora markup. `original/` holds the preserved v0.64 interface (`legacy/`, the MVP, was removed in roadmap phase 1; it remains in the `main` history).

**JS (`js/`, 33 modules, 10,394 lines; `wc -l js/*.js`):**

- Routing/screens: `home.js` 715 (hash router), `education.js` 1823 (index, topic, reader), `quiz.js` 520, `results.js` 556, `profile.js` 715, `onboarding.js` 330, `quiz-launch.js`, `quiz-engine.js` 164, `session-state.js` 159.
- Data/state: `storage.js` 1149 (history, progress, settings, backup), `topics.js` 361 (loading, manifest), `backup.js` 195, `backup-ui.js` 370, `share.js`, `report.js`, `tiers.js`.
- Motion: `interactions.js` 691 (springs → `linear()`, `compose`/`composeScreen`, presets, press/release, `whenVisible`), `motion.js` 141 (preference, aura clock), `scroll-rail.js` 454.
- Shell/UI: `shell.js` 228, `dom.js` 197 (no `innerHTML`), `widgets.js` 53, `icons.js` 306, `listbox.js` 348, `modal.js`, `feedback.js`, `answers.js`, `brand.js`, `theme.js`, `install.js`, `prompt.js`, `progress.js`, `config.js`.
- About: `about/about.js` 809, `about/content.js` 169 (all strings), `about/about.css` 434. It imports `js/motion.js`, `interactions.js`, `scroll-rail.js`, `install.js`, `topics.js` and `tiers.js` (`about/about.js:4-10`).

**CSS, one layer stack:** every sheet puts its rules in one ordered `@layer` list, declared identically at the top of `css/style.css` and `css/editorial.css` (whichever a page loads first fixes it): `tokens, reset, layout, components, screens, utilities` (`style.css`), `skin` (`editorial.css`), `motion` (`interactions.css`), `composition`, `rail` (`scroll-rail.css`), `share`, `onboarding`, `about` (`about/about.css`; its `:where()` resets sit in `reset`) and `overrides` (the reduced-motion, motion-off and hidden-tab still twins and `[hidden]`). No declaration uses `!important`. `css/style.css` (~1050 lines) is the structure only: the UI 3 skin, its slate palette and every declaration `editorial.css` always overrode were deleted, so colour, type, radius, shadow and motion tokens have one source, `editorial.css` (the live look). 74 selectors still appear in both files; none of their style.css declarations is one editorial.css always overrides. Small files: `interactions.css` (press/release), `composition.css` (wide layout), `scroll-rail.css`, `onboarding.css`, `share.css`. The app pages load `style.css` + `editorial.css` + the small files. About loads only `editorial.css`, `interactions.css`, `scroll-rail.css` and `about.css`, with no `style.css` (`about/index.html:34-37`).

**Data:** `data/manifest.json` plus `data/<topic>/<topic>.json` (10 topics). Adding content requires no JS change.

**Tools (`tools/`):** `validate-content.mjs` 1193, `content-checks.mjs`, `format-content.mjs`. Colour tool: `editorial-palette.mjs` (`npm run color`, the live tokens in `css/editorial.css`); the UI 3 `palette.mjs` and `token-check.mjs` were retired with the tokens they measured. Others: `verify-ui.mjs` 3470 (browser sweep), `audit-ui.mjs`, `capture-portfolio.{mjs,py}`, `solve.mjs`, `blind-corpus.mjs`, `make-calibration.mjs`, `check-draft.mjs`, `make-icons.mjs`, `make-world.mjs`, `ship-topic.mjs`.

**Tests:** 250 node:test unit tests (`tests/*.test.js`) and 17 Python browser suites (`tests/*.py`, shared setup in `tests/_harness.py`, runner `tests/run_all.py`, guide `tests/README.md`).

**Service worker:** `sw.js` precaches the shell, every module, the About HTML/CSS/JS and its three captures, and `InterVariable.woff2` (`sw.js:15-72`). Content is network-first and cached on visit.

## 5. Visual language as implemented

- **Ground:** dark first. Plum page `#141216` (`about/index.html:6`), opaque cards (`--card`, computed `rgb(29,26,32)`) and a raised surface, plus a pale Sakura light theme. Live tokens are in `css/editorial.css:13-105`.
- **Roles:** the cherry/Sakura gradient marks the one primary action (`--grad-accent`, `css/editorial.css:47`). Iris is structure, lagoon is context, apricot is attention. A correct answer gets an opaque Sakura surface; a selected wrong answer is periwinkle. Both always carry a mark and the word Doğru/Yanlış. Contrast is proven by `npm run color` ("67650 editorial contrast pairs passed").
- **Type:** Inter variable for both languages. `--f-serif: var(--f-sans)` and `--f-sans: Inter, …` (`css/editorial.css:48-50`). Role sizes start at `css/editorial.css:51`.
- **Atmosphere:** three drifting aurora clusters (cherry/iris/lagoon) with one parent opacity cap (.42 dark / .09 light, `css/editorial.css:95,134,165`). The markup is in every page and shares one wall clock, `--aura-clock` (`js/motion.js:27`, `css/editorial.css:1581,1604`, inline in `about/index.html:43`). Pools are still under reduced motion; the aura pauses in hidden tabs.
- **Material:** the app shell has no live glass: no app stylesheet sets `backdrop-filter`, and `.glass,.nav` get the opaque page colour (`css/editorial.css`). `npm run verify` asserts the header and tab bar are opaque with no backdrop filter. **"No blur anywhere" is false:** the About masthead blurs once scrolled (`about/about.css:78`, `blur(16px) saturate(1.4)` over an 82% page colour). It has no `@supports` and no `prefers-reduced-transparency` guard. The owner allows glass again, measured and tested separately first (`docs/PRINCIPLES.md` §4).
- **Motion (v0.76, ADR 014, `docs/design/motion-v076.md`):**
  - Entrances are built in the same task as their DOM via `compose` / `composeScreen` (`js/interactions.js:498,530`; callers `js/home.js:582`, `js/education.js:962,1529`, `js/results.js:167-186`, `js/profile.js:571`). They start from their first keyframe.
  - Springs are sampled into CSS `linear()` (`js/interactions.js:17-67`), with a cubic fallback.
  - One vector per screen: tabs `enter` 28px sideways, drill-ins `rise` 18px, the question prompt slides 40px while its options only fade (`js/interactions.js:246-275`).
  - At most 8 parts (`collectParts` limit, `:474`) within a 220ms cascade (`CASCADE_SPAN`, `:448`).
  - Answers: the wrong pick shakes, the right one swells (`celebrate`), and the explanation rises (`js/quiz.js:362-372`). A bounded scroll keeps the options visible (`revealVerdict`).
  - Press 120ms (`css/interactions.css:91,98`) and release 380ms (`css/interactions.css:3`) are unchanged.
  - There is no cross-document view transition. `whenVisible` is used for artwork only.
- **Brand:** `ep.` / `english prep.` in Inter 600 with a Sakura dot (`js/brand.js`, 21 lines). About has its own masthead brand (`about/about.css:80-81`).

## 6. Known weak spots

1. **Documentation drift (largely fixed 2026-10-10).** `CLAUDE.md` was rewritten and superseded docs moved to `docs/history/`. Still stale: the Margin doc header says v0.74 (`docs/margin-design-system.md:1`); About's craft figures hard-code "247 birim testi" (`about/content.js:144`) while there are 250; code comments still cite docs now under `docs/history/`.
2. **Style stack (consolidated, phase 1 item 4).** One `@layer` order, no `!important`, one token source (§4). Left: `style.css` and `editorial.css` still split one component across two files (74 shared selectors), and style.css's structure still uses editorial's motion tokens (`--spring-*` map to `--ease-standard`).
3. **Dead code.** Each item below was checked by grepping for callers in `js about *.html tools tests`:
   - Removed in roadmap phase 1: `js/celebrate.js`, and the `ring`, `monogram`, `initialsOf`, `choices`, `countUp` and `motionWelcome` exports of `js/widgets.js` (which now holds only `hueOf`, `avatar` and `haptic`). `docs/components.html` draws its monograms itself and no longer shows rings or choice groups.
   - Also removed: `downloadBackup` in `js/backup-ui.js` and its one test; the live share path is `js/share.js`, covered by `tests/share.test.js`.
   - Also removed: `loadRoadmap` and `data/roadmap.json` (no caller; the validator no longer checks the file).
   - Also removed: `getTopicTotals` and `getCategoryTotals` in `js/storage.js` and their test cases. `getLastActivity` stays as a test helper: no screen calls it, but `tests/storage.test.js` and `tests/answer-times.test.js` use it to prove activity timestamps are stored.
   - Dead CSS (rings, choices, the onboarding orb/steps/preview, `.section-head`, `.formula`, the unused tokens) was deleted. `js/interactions.js:77,83` still name `.about-button` and `.choice` in selectors that no element matches.
4. **Browser tests (fixed 2026-10-10).** The Python suites share `tests/_harness.py`: every file takes `--base-url` (`EP_BASE_URL`, default `http://127.0.0.1:8000/`) and `--browser-path` (`EP_BROWSER`, default Playwright's own Chromium); `transfer_browser.py` still accepts `--base`. Version-named suites were renamed by feature. `tests/requirements.txt` pins `playwright` and `pillow`; CI runs them. Not yet run in GitHub Actions itself.
5. **Unverified on real devices.** All evidence is Chromium emulation. Not checked: iOS Safari `linear()` (17.2+), toolbar composition, and aurora performance on phones.
6. **Desktop tab capsule overlap.** `.nav` is an opaque `var(--card)` capsule with `border-radius:14px` (`css/editorial.css:264-273`), not glass. Measured headless at 1440×900 and 1280×800 on `#egitim`: it sits centred over the right-hand list column at rest and covers a topic row (Gerunds / Quantifiers). The same happens on `#test`.
7. **Rail placement.** The track defaults to `top: 25vh` with a fixed height (`css/scroll-rail.css:8-11`). It spans roughly the middle third, so at the top of a page the thumb sits mid-screen (handoff-v1 §5; on lessons unverified).
8. **Onboarding page 3** leaves a large empty band at the bottom on phones (handoff-v1 §5, unverified; see `css/onboarding.css:179` min-height).
9. **About issues:**
   - About is hard-coded dark (`about/index.html:2` `data-theme="dark"`, `:7` color-scheme dark) and ignores the Profil theme.
   - Forced-colours support is three rules (`about/about.css:429-433`) and has not been tested in a forced-colours run.
   - Infinite loops: `ab-pulse` (`:188`) and `ab-flowdash` (`:391`) are gated on motion and page visibility. `ab-spin` (`:158`) is gated only by `prefers-reduced-motion` (`:426`), not by the Profil motion switch.
   - Arrows are Unicode glyphs (↗ ↓ ↑) instead of icons (`about/index.html:68,85,150-152,183-185`; `about/about.js:493,569`).
   - The phone is a CSS-drawn device frame around the captures (`.ab-device`, `about/about.css:304-320`).
   - The captures in `about/assets/*.webp` were last committed at v0.73 (`2db1000`), so they predate the v0.76 motion and fixes.
   - The masthead blur has no fallback (§5).
10. **Portfolio capture is broken on v0.77.** `tools/capture-portfolio.mjs:185` waits for `#folio-deck .folio-leaf` and `docs/github/capture.py:174` waits for `#study-folio`. Neither exists in the rebuilt About.
11. **README and repo media are from v0.73.** `docs/github/*` was last changed at `2db1000`. `README.md:56-63` still presents the folio and `folio.gif`.
12. **Fonts.** `css/fonts.css` and `fonts/` (the unused Source Sans 3 / Source Serif 4 faces) are gone; `css/style.css:133-134` still names those families in tokens that `editorial.css` overrides. Inter is a subset (Latin, Latin-1, Latin Extended-A, general punctuation, arrows and the symbols in use; both axes kept), cut by `tools/subset-font.sh` from the full 352,240 B file in git history: `assets/fonts/InterVariable.woff2` is 92,672 B, preloaded on every page and precached. `editorial.css` declares the matching `unicode-range`, and `tests/font-subset.test.js` fails if a character the app shows is outside the range or the font's cmap.
13. **About images (fixed).** `sw.js` now precaches the three study-loop captures About shows (`about/assets/{article,test,results}-phone.webp`, 476 KB); a unit test ties the list to `about/content.js`.
14. Small duplications: the question-count picker is built twice in `home.js`, the weak-category list exists in both `home.js` and `profile.js`, and backup transfer is spread over three files (handoff-v1 §7.6, unverified). `storage.js` (1149) and `education.js` (1823) are candidates for splitting.

## 7. How to run and verify

```bash
npm run check          # format:check + validate + color + test (what CI runs)
npm test               # 250 unit tests
npm run validate       # content schema; expect the one t13/t16 warning
npm run color          # WCAG 2 + APCA token proofs
npm run serve          # python3 -m http.server 8000
npm run verify         # browser sweep (needs serve; Playwright found globally or via PLAYWRIGHT_PATH)
npm run audit          # tools/audit-ui.mjs
npm run browser        # all Python suites; starts its own server (pip install -r tests/requirements.txt)
python3 tests/<name>.py --base-url http://127.0.0.1:<port> [--browser-path <chrome>]   # one suite (tests/README.md)
```

Other scripts: `format`, `tokens`, `icons`, `blind`, `solve`, `calibrate`, `draft` (`package.json:7-22`). Before a release, bump `sw.js:4` `VERSION`.
