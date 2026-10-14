# English Prep — state of the app · v0.80

Checked against branch `test` at `69e6519` (release commit) on 2026-10-14. Where this and another document disagree, the code and its checks win, then this page (`CLAUDE.md`). Every claim names a path or a command.

## 0. Status

**Parked at v0.80 on 2026-10-14. Complete, working, tested; not in active development.** Nothing is scheduled (`docs/ROADMAP.md`, status banner). To resume:

1. Read `CLAUDE.md`, then this file, then the "After parking" section at the end of `docs/ROADMAP.md` (what counts as a signal to resume).
2. `npm run check` (format, content, colour, unit tests) must be green.
3. `npm run serve` in the background, then `npm run verify` (Chromium sweep; Playwright global or `PLAYWRIGHT_PATH`).
4. `pip install -r tests/requirements.txt`, then `npm run browser` (all Python suites; starts its own server).
5. Pick from §6 below: taste items need the owner first; refactors need before/after screenshots.
6. Every release: bump `VERSION` in `sw.js:4` and add a matching Turkish `CHANGELOG.md` heading (`tests/service-worker.test.js` checks they agree).
7. If Playwright is stale, follow "Bumping Playwright" in `tests/README.md:20` (Python and Node versions move together; CI pins `playwright@1.56.1`).

## 1. Product and counts

A static, mobile-first web app for Turkish learners with a good English ear and no labels. **Eğitim**: article lessons, each one "X vs Y" distinction, with non-gating inline checks. **Test**: cloze and closest-meaning questions with instant feedback and a mistake book (Yanlış defteri). **Profil** (header): name, metrics, settings, backup. `about/` is the product page. No accounts, server or analytics: state is in `localStorage` (`js/storage.js`). No build step, no runtime dependencies (`package.json`, tooling only).

| Fact | Value | Evidence |
|---|---|---|
| Topics / lessons / questions | 10 / 60 / 241 | `npm run validate` → "10 live, 0 coming soon. 241 question(s), 60 lesson(s)." |
| Option notes | 723; every question has `optionNotes` | node count over `data/*/*.json` |
| Validate warning | 1, **intentional**: `academic-nouns-adjectives-t13` / `-t16` share an option set. They are mirror items with opposite keys (t13 keys `crucial`, t16 keys `negligible`) | `npm run validate`; `data/academic-nouns-adjectives/academic-nouns-adjectives.json` |
| Unit tests | 263 in 22 files, all pass | `npm test` → `# tests 263 # pass 263` |
| Browser sweep | 3,627 checks at 320/390/768/1280 (+ nav clearance at 1180×820), all pass (2026-10-14) | `node tools/verify-ui.mjs http://127.0.0.1:8241` |
| Python browser suites | 17 files (`tests/*.py` minus `_harness.py`, `run_all.py`) | `npm run browser` → 143 passed, 1 skipped (axe matrix, opt-in) |
| Colour proof | 66,864 contrast pairs pass (WCAG 2 + APCA) | `npm run color` |
| Font | Inter variable subset, 92,672 B, both axes | `assets/fonts/InterVariable.woff2`; `tests/font-subset.test.js` |
| Planned, not built | `so / such` (cloze map names missing topic `so-such`, `js/topics.js:318`), paragraph completion, reading passages | |

## 2. Branches and release

- **`test`**: the only development branch and the GitHub Pages site. A push is a deploy.
- **`main`**: the owner's release branch, moved by hand. After v0.80 it points at the same release as `test`.
- Release: `sw.js:4` is `"english-prep-v0.80"`, equal to the newest `CHANGELOG.md` heading (`## v0.80 — 2026-10-14`). `x` stays `0` until the owner says V1 (`docs/PRINCIPLES.md` §1).
- **CI** (`.github/workflows/ci.yml`): on push and PR to `main` and `test`; `permissions: contents: read`; `concurrency` per ref with cancel-in-progress. Job `check` (10 min): format:check, validate, color, test. Job `browser` (30 min): Python 3.12, `tests/requirements.txt`, Chromium, global `playwright@1.56.1`, server on :8000, `npm run verify`, then `npm run browser`. Actions `checkout`/`setup-node`/`setup-python` at `@v6`, Node 24 (`.nvmrc` = `24`; `package.json` `engines.node` = `>=22`).

## 3. Screens

| Screen | Route / file | What is on it |
|---|---|---|
| Eğitim | `index.html#egitim` (default) | "Bildiğin İngilizceyi netleştir." (`js/education.js:151`), corpus totals, resume action, search (`type="search"`, `:558`), topic index |
| Topic overview | `#egitim/konu/<id>` | topic intro and its lessons |
| Lesson | `#egitim/<lessonId>` | one scrolling article; optional pretest on first visit ("Derse geç", `js/education.js:1293`); non-gating checks; completion signature; scroll rail (`js/scroll-rail.js`) |
| Test | `#test` | topic tests, mixed test, category practice, Yanlış defteri |
| Quiz | `quiz.html` | one question at a time; one press commits; verdict plus rationale; tab-local resume (`js/session-state.js`) |
| Results | `results.html` | score bar, per-answer review, signature on first presentation |
| Profil | `#profil` | name/avatar, metrics, theme (Koyu/Açık/Sistem), motion switch (`role="switch"`, `js/profile.js:316`), install, backup preview, restore, reset |
| Introduction | `#hosgeldin` | optional three-page tour (`js/onboarding.js`); on screens ≤800px tall the actions are a sticky bottom bar (`css/onboarding.css:195-208`) |
| About | `about/index.html` | thesis "İkisi de doğru. Fark, anlamda."; lens, manifesto, distinction map, question anatomy, study loop on three captures, craft proofs (facts in `about/content.js`, incl. "1 yedek biçimi", `:146`), privacy card linking `js/storage.js` and `tests/cross_surface_browser.py` (`about/content.js:165-166`), FAQ. Guide: `about/README.md` |

First visit is dark: `js/theme.js:11` falls back to `"dark"`. About is always dark (`about/index.html:2,7`). At ≥1080px wide a companion pane appears (`css/composition.css:56-59`).

## 4. Architecture

**Pages:** `index.html` 184, `quiz.html` 93, `results.html` 93, `about/index.html` 190 lines. `original/` is the served v0.64 snapshot (do not edit).

**JS (`js/`, 33 modules, 10,231 lines; `wc -l js/*.js`):**

- Screens: `education.js` 1823, `home.js` 715 (router, Test tab), `profile.js` 715, `results.js` 556, `quiz.js` 520, `onboarding.js` 330, `session-state.js` 159, `quiz-engine.js`, `quiz-launch.js`.
- Data/state: `storage.js` 1036, `topics.js` 361, `backup-ui.js` 370, `backup.js` 195, `share.js`, `report.js`, `tiers.js`.
- Motion: `interactions.js` 670 (springs → `linear()`, `compose`, press/release; cascade 220 ms, ≤8 parts, `:427,453`), `scroll-rail.js` 454, `motion.js` 141 (preference, `--aura-clock` `:27`).
- Shell/UI: `listbox.js` 348, `icons.js` 277, `shell.js` 228, `dom.js` 197 (no `innerHTML`), `feedback.js`, `answers.js`, `modal.js`, `theme.js`, `install.js`, `widgets.js`, `prompt.js`, `config.js`, `progress.js`, `brand.js`.
- About: `about/about.js` 821, `about/content.js` 177 (all strings), `about/about.css` 500.
- Storage leftovers removed: `getStreak`, `getTodayCount`, `daysToExam`, `setExamDate`, `setDailyGoal`, `isOnboarded`, `RE_ENTRY_DAYS` (no match in `js about tests tools`). `getExamDate`/`getDailyGoal` stay for the v1 backup format (`js/storage.js:796,810,848-849`).

**CSS:** 7 files in `css/`, 3,308 lines (`style.css` 1043 structure, `editorial.css` 1623 the live look and only token source, `onboarding.css` 212, `interactions.css` 163, `scroll-rail.css` 138, `composition.css` 73, `share.css` 56) plus `about/about.css`. One `@layer` order declared identically at `css/style.css:28` and `css/editorial.css:22`: `tokens, reset, layout, components, screens, utilities, skin, motion, composition, rail, share, onboarding, about, overrides`. No `!important`. `html, body` use `overflow: clip` (fallback `hidden`) so only `#shell-scroll` scrolls (`css/style.css:97-102`). About loads `editorial.css`, `interactions.css`, `scroll-rail.css`, `about.css`, no `style.css`.

**Data:** `data/manifest.json` + `data/<topic>/<topic>.json` (10 topics); schema `docs/CONTENT_GUIDE.md`, enforced by `tools/validate-content.mjs` (1133 lines).

**Tools (`tools/`):** `verify-ui.mjs` 3549 (sweep, incl. `runNavClearance` `:3260`), `audit-ui.mjs`, `validate-content.mjs`, `content-checks.mjs`, `format-content.mjs`, `editorial-palette.mjs` + `color.mjs` (`npm run color`), `make-icons.mjs`, `subset-font.sh`, `blind-corpus.mjs`, `make-calibration.mjs`, `solve.mjs`, `check-draft.mjs`, `ship-topic.mjs` (its table marked historical), `extract-wordlist.{mjs,py}`, `capture-about.py` (About's three phone captures). Portfolio coupling is gone: no `world.json`, `make-world.mjs`, `capture-portfolio.mjs`, CAPTURES/OUTBOX or family-world test; the old family kit is in `docs/history/family/`.

**Tests:** 22 `tests/*.test.js` files (node:test), incl. `backup-fixtures.test.js` over golden `tests/fixtures/backup-v1-{first,resume,ui3}.json`, `doc-citations.test.js` (every `docs/` path cited in code exists), `no-glyph-icons.test.js`, `font-subset.test.js`, `service-worker.test.js`. 17 Python suites share `tests/_harness.py` (`--base-url`/`EP_BASE_URL`, `--browser-path`/`EP_BROWSER`), run by `tests/run_all.py`; guide `tests/README.md`. Run 2026-10-14 (local, Chromium 1194): 143 passed, 1 skipped (axe matrix, opt-in).

**Service worker (`sw.js`, 179 lines):** precaches the shell, every module, About's HTML/CSS/JS and three captures, and the font (`:30,54-56`). Content is network-first and cached on visit. Offline misses answer `Response.error()` (`:161,178`); navigations match with `ignoreSearch` (`:172`).

**Docs:** live: `CLAUDE.md`, this file, `docs/PRINCIPLES.md`, `docs/ROADMAP.md`, `docs/PRODUCT-DIRECTION.md`, `docs/margin-design-system.md` (v0.74 header, partly superseded banner), `docs/adr/` (newest 014), `docs/design/motion-v076.md`, `docs/CONTENT_GUIDE.md`, `docs/agents/`. Moved to `docs/history/`: EXPERIENCE, development, RESEARCH, VALIDATION, `design/feature-opportunities-v072.md`, `family/`. `README.md` is the parked-project readme with `docs/github/screen-egitim.webp`; `docs/github/` holds only that, the brand SVGs and `social-preview.png`.

## 5. Visual language as implemented

- **Ground:** dark first, plum page, opaque cards, pale Sakura light theme; tokens only in `css/editorial.css` (`@layer skin` from `:25`).
- **Roles:** the cherry/Sakura gradient marks the one primary action; correct = opaque Sakura surface, chosen wrong = periwinkle, always with a mark and Doğru/Yanlış. Proven by `npm run color`.
- **Type:** Inter variable for both languages (subset, see §1).
- **Atmosphere:** three drifting aurora clusters under one opacity cap, one wall clock `--aura-clock` (`js/motion.js:27`, `css/editorial.css:1491,1514`); still under reduced motion, paused in hidden tabs.
- **Material:** the app shell is opaque, no `backdrop-filter` in `css/` (checked by `npm run verify`). The one blur is About's masthead, now **sticky and visible** over content (`about/about.css:32,85`; `scroll-padding-top: 72px` keeps anchors clear). Once scrolled it is 95% page colour + `blur(16px)` inside `@supports`, solid under reduced transparency, more contrast and forced colours (`about/about.css:93-101`), meeting the material contract G2/G4 (`docs/PRINCIPLES.md` §4; `tests/about-material.test.js`). No in-app "Saydamlık" switch exists.
- **Forced colours:** the Profil switch names thumb and track in system colours (`css/editorial.css:1599-1603`); About's lens and charts likewise (`about/about.css`).
- **Motion (ADR 014, `docs/design/motion-v076.md`):** entrances built with their DOM via `compose`; springs sampled to `linear()`; one vector per screen. About's infinite loops `ab-pulse`, `ab-flowdash` and now `ab-spin` run only when `data-motion="on"` and the page is visible (`about/about.css:185`). Every effect has a still twin (`@layer overrides`).
- **Rail:** below 360px the compact rail moves into the gutter (`css/scroll-rail.css:123-125`); vertical place `top: var(--rail-top, 25vh)` (`:9`).
- **Icons:** all arrows/ticks/crosses come from `js/icons.js`; `tests/no-glyph-icons.test.js` enforces it.

## 6. Open items

**(a) Known bugs:**

None known. (The browser-suite failure found while writing this page, a test still opening deleted About captures, was fixed in v0.80, and a known timing flake in the rail's side-pinch test was made tolerant of one extra frame.)

The UI bugs found before parking were fixed in v0.80 (`1178f13`, `6753b71`, `f8c5f56`, `bbf5c34`, `0bf4cb7`, `6e2fd7c`, `f50ef8b`, `59a72e4`).

**(b) Taste decisions waiting for the owner** (none is a defect; ask with a short Turkish brief):

1. The opaque tab capsule covers the row under it at rest (the end still clears it, `runNavClearance`).
2. Rail vertical placement (starts at 25vh, `css/scroll-rail.css:9`).
3. Onboarding: page 3's empty band on tall phones; page 2's "Açıklam/a" word break at 320px.
4. Lesson title truncated in the phone bar (`text-overflow: ellipsis`, `css/style.css:218`).
5. Pretest spacing before "Derse geç" (`js/education.js:1293`).
6. About always dark (`about/index.html:2`), ignoring the Profil theme.
7. About's pill buttons vs the app's buttons.
8. About's reveal animations and dimmed steps (2.66:1 before reveal).
9. Reset dialog: weight of "Sil" vs "Vazgeç".
10. Two toggle styles in Profil (switch row vs three-state theme choice, `js/profile.js:309-351`).
11. A search result shows a bare lesson number.
12. Chromium's native search clear ✖ on the Eğitim search field.
13. Privacy card link labels "Depolama kodu" / "Ağ isteği testi" (`about/content.js:165-166`) need the owner's OK.

**(c) Refactors deliberately deferred** (no behaviour change; before/after screenshots required):

1. Split `js/education.js` (1823) along its section comments (index, topic, reader).
2. Split `js/storage.js` (1036) behind a re-exporting facade.
3. Merge the 74 selectors split across `css/style.css` and `css/editorial.css`.
4. Home/Profil duplication: the weak-category list (`js/home.js:468`, `js/profile.js:629`) and the question-count picker built twice in `home.js`.
5. Fixed waits in browser suites: 37 `wait_for_timeout`/`time.sleep` calls across 10 suites (`grep -c` over `tests/*.py`, worst `scroll_rail_browser.py` 11).

**(d) Never verified:** a real iPhone and a real Android. All evidence is Chromium emulation; iOS Safari `linear()` (17.2+), toolbar composition and aurora cost on phones are unchecked.

## 7. Commands (`package.json` scripts)

```bash
npm run check          # format:check + validate + color + test (CI job "check")
npm test               # node --test "tests/**/*.test.js"
npm run validate       # content schema; expect the one intentional t13/t16 warning
npm run format         # canonical JSON for data/   (format:check = --check)
npm run color          # WCAG 2 + APCA token proofs
npm run serve          # python3 -m http.server 8000
npm run verify         # tools/verify-ui.mjs sweep; needs serve
npm run browser        # python3 tests/run_all.py (own server)
npm run audit          # tools/audit-ui.mjs
npm run icons          # tools/make-icons.mjs
npm run blind | solve | calibrate | draft   # content pipeline (docs/agents/)
```

One suite: `python3 tests/<name>.py --base-url http://127.0.0.1:<port> [--browser-path <chrome>]`. About captures: `python3 tools/capture-about.py --base-url http://127.0.0.1:8000`.
