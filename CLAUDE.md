# CLAUDE.md

Context for Claude sessions working in this repository.

## What this is

A static, mobile-first web app for Turkish university English prep-school
proficiency exams (YTÜ İYS style). Two content modes in a bottom nav —
**Eğitim** (article-based lessons in a paged reader) and **Test**
(paragraph-cloze questions with instant feedback) — plus **Profil**,
which opens from the header because it's identity and settings, not a
content mode. Built by the owner for himself and friends sitting the
exam. Served from GitHub Pages.

No accounts, no backend, no analytics. Everything a learner does is stored
in their own browser's `localStorage`.

## Non-negotiables

- **No build step.** Plain HTML/CSS/ES modules, served as-is. `package.json`
  exists for tooling only (validator, tests) and has **zero dependencies**;
  never add one that the app itself would need at runtime.
- **No `innerHTML`, anywhere.** Content comes from JSON files and is
  rendered by building nodes and setting `textContent` (`js/dom.js`).
  Keep it that way.
- **Mobile first.** Verify at 320px before anything else. The app is a
  fixed-height shell: only `.app-content` scrolls, and answering a
  question must never move the button the learner is about to tap.
- **Navigation is settled, and it was settled by feedback.** The owner
  asked for the top menu to go and for Profil to leave the tab bar. Don't
  reopen either without being asked. Likewise lesson checks never gate
  progress — an unanswered one reads "Atla".
- **Version `x` stays `0`.** `CHANGELOG.md` uses `x.y`; `x` is bumped to
  `1` only when the owner explicitly decides the app is a real release.
  That is never an assistant's judgment call, no matter how large a
  change looks. `y` increments for every shipped round of changes.

## Commands

```bash
npm run validate    # content schema + manifest/topic-file consistency
npm run color       # every colour token re-measured (WCAG 2 + APCA)
npm test            # unit tests (node:test) for quiz-engine and storage
npm run check       # all three
npm run serve       # static server on :8000 (fetch() needs an HTTP origin)
```

Both checks also run in CI on every push and PR to `main` and `test`.

## Branches

- `main` — verified content only; GitHub Pages serves this.
- `test` — day-to-day development. Work lands here first, gets tried on a
  real phone, then merges to `main`.

## Layout

```
index.html            App shell: tab bar + Eğitim / Test / Profil views
quiz.html             Question-answering screen
results.html          Score, breakdown, review
js/
  home.js             Home screen + the hash router (#egitim, #test, #profil,
                        #egitim/<lessonId>), bottom nav, profile trigger
  education.js        Eğitim: lesson index, and the focused reader that
                        paces an authored article into steps
  feedback.js         The one answer-feedback block, shared by Test and
                        Eğitim checks
  quiz.js             Test screen
  results.js          Results screen
  profile.js          Profil tab
  quiz-engine.js      Pure scoring/shuffling logic — no DOM, no storage
  storage.js          localStorage: history, lesson progress, profile name
  topics.js           Loads and caches manifest + topic files
  quiz-launch.js      The one path that starts a test, from any entry point
  dom.js              Shared node builders (el, appendProse, appendBlanked)
  dropdown.js         Custom listbox (replaces <select>)
  modal.js            Custom confirm dialog (replaces window.confirm)
  config.js           Cross-screen constants
  tiers.js            Difficulty tier ids and Turkish labels
css/style.css         Single stylesheet; design tokens in :root
data/manifest.json    Topic index
data/<topic>/         One JSON file per topic: its lessons and questions
tools/                Content validator
tests/                Unit tests
docs/                 Content schema, content/dev notes, agent briefs
```

## Design

`docs/design-system.md` is the binding specification — tokens, type scale,
spacing, icon contract, component inventory, the accessibility contract and
the mobile-web constraints, each with its reasoning. Read it before
touching `css/style.css`.

Three rules generate most of the rest: depth comes from surface lightness
rather than borders or shadows; at most one card level and nothing framed
inside a framed thing; one accent doing one job. Colour values are not
chosen by eye — they are solved against a contrast requirement and verified
by `npm run color`, which is in CI.

`docs/redesign-plan.md` tracks the staged rebuild against that spec.

## Conventions

**Language.** UI strings, explanations, tips and lesson prose are
**Turkish**. Practice sentences, example sentences and answer options are
**English**. Grammar category names and topic titles stay **English** —
students need to recognize the terms.

**`lang="en"` on English text inside the Turkish page.** Not cosmetic:
CSS `text-transform: uppercase` follows the element's language, so an
English label under `lang="tr"` becomes "SİMPLE" instead of "SIMPLE".
Any English string that gets uppercased or spoken needs the attribute.

**Native controls are replaced, so replace their behaviour too.** The
dropdown and modal exist to avoid OS chrome and layout shift; both
re-implement the keyboard and focus contracts they took over (listbox
pattern, focus trap and restore). Anything similar added later has to do
the same.

**Content is data.** Adding a topic, lesson or question never requires
touching JavaScript. The schema lives in `docs/CONTENT_GUIDE.md` and is
enforced by `tools/validate-content.mjs`; change all three together or
none of them.

**Lesson ids are derived, not authored** — `lessonId(topicId, category)`
in `js/topics.js`, mirrored in the validator. Progress is stored against
them, so renaming a category renames the lesson and resets progress for
it. A category rename is a taxonomy change: questions, manifest and
lesson move together or not at all.

**Lessons are articles, not screens.** A lesson file carries named prose
sections (`intro`, `form`, `meaning`, `usage`, `examples`,
`commonMistakes`, `recap`); `js/education.js` decides how they are paced
into reader steps and pulls check cards from the questions sharing the
lesson's category. Presentation can change without touching content —
and it already has, more than once.

## Content authoring

Lessons and questions are written by separate Claude sessions working
from `docs/agents/`. The supervisor fixes the category taxonomy first —
that's the one thing the two agents must agree on, and the thing the app
uses to link a wrong answer on the results screen to the lesson that
teaches it. See `docs/agents/README.md` for the loop.

## Verifying a change

The unit tests cover scoring and storage, not the screens. For anything
that touches the UI, drive the real app: `npm run serve`, then Playwright
(Chromium is at `/opt/pw-browsers/chromium-*/chrome-linux/chrome` in this
environment) across 320 / 390 / 768 / 1280, checking for horizontal
overflow, touch targets under 40px, and console errors. Google Fonts is
unreachable from the sandbox — that one failed request is expected and is
not an app fault.
