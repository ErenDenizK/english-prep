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
npm run format      # canonical formatting for the content JSON
npm run validate    # content schema + manifest/topic-file consistency
npm run color       # every colour token re-measured (WCAG 2 + APCA)
npm test            # unit tests (node:test): quiz engine, storage, backup, content checks
npm run check       # all four (format as a --check)
npm run serve       # static server on :8000 (fetch() needs an HTTP origin)
npm run verify      # drives the real app in Chromium — needs `serve` running
npm run icons       # redraws the app icons and the link-preview card
npm run draft -- docs/agents/drafts/<topic>          # checks a topic that is not shipped yet
npm run blind -- docs/agents/drafts/<topic>/questions.json <outDir>   # unkeys a set for review
```

`check` runs in CI on every push and PR to `main` and `test`. `verify`
does not: it needs a browser, and this project has no dependencies.

**Run `npm run format` after editing a content file.** Several sessions
write into `data/`, and any of them that reads a topic file, changes one
lesson and writes it back with `JSON.stringify(data, null, 2)` reformats
every question in the file at the same time — a four-line change arrives
as a four-hundred-line diff. `check` fails when the files drift.

## Branches

- `main` — verified content only; GitHub Pages serves this.
- `test` — day-to-day development. Work lands here first, gets tried on a
  real phone, then merges to `main`.

## Layout

```
index.html            App shell: header + Eğitim / Test / Profil views + nav
quiz.html             Question-answering screen
results.html          Score, breakdown, review
js/
  home.js             The hash router (#egitim, #test, #profil,
                        #egitim/<lessonId>), the nav, and the Test tab
  education.js        Eğitim: lesson index, and the focused reader that
                        paces an authored article into steps
  quiz.js             Test screen
  results.js          Results screen
  profile.js          Profil tab
  shell.js            The scrolling region, the focused-mode action bar and
                        the one live region — shared by all three
  answers.js          The answer options, shared by Test and Eğitim checks
  feedback.js         The one answer-feedback block, likewise
  quiz-engine.js      Pure scoring/shuffling logic — no DOM, no storage
  storage.js          localStorage: history, lesson progress, profile name
  topics.js           Loads and caches manifest + topic files
  quiz-launch.js      The one path that starts a test, from any entry point
  report.js           "Bu soruda bir sorun var" — the text, and the share
  dom.js              Shared node builders (el, appendProse, appendBlanked)
  icons.js            The 14 hand-drawn icons, to the §6 contract
  listbox.js          Select-only combobox (replaces <select>)
  modal.js            Confirmation on a native <dialog>
  config.js           Cross-screen constants
  tiers.js            Difficulty tier ids and Turkish labels
manifest.webmanifest  Name, icons, colours for an installed app
icons/                Generated — run `npm run icons`, never hand-edit
css/style.css         Single stylesheet, in cascade layers
css/fonts.css         The three subset faces + metric-matched fallbacks
fonts/                Self-hosted woff2 subsets
data/manifest.json    Topic index
data/<topic>/         One JSON file per topic: its lessons and questions
tools/
  validate-content.mjs  Content schema + cross-file consistency
  content-checks.mjs    The four checks the schema cannot make (corpus-wide)
  format-content.mjs    Canonical formatting + the manifest's lesson index
  palette.mjs           Re-measures every colour token (WCAG 2 + APCA)
  color.mjs             Zero-dependency OKLCH / contrast maths
  verify-ui.mjs         Drives the real app in Chromium at four widths
  make-icons.mjs        Draws icons/ from the design tokens and js/icons.js
tests/                Unit tests
docs/                 Design system, content schema, dev notes, agent briefs
docs/components.html  Every primitive on one page, against the real CSS
docs/content-review.md  What reviewing all 72 questions found
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

## Where the project is going

`docs/v1-plan.md` is the plan of record for v1, and `docs/research/` holds
the six research arms it was synthesised from. Read the plan before
proposing work: the round found that the app is preparing for the wrong
*shape* of exam — there is no discrete grammar section on the paper this
targets — and that four questions per category is the constraint binding
everything else. The next thing to build is not a seventh grammar topic.

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
listbox exists to avoid OS chrome and layout shift, so it re-implements
the whole select-only combobox contract it took over — focus stays on the
trigger, `aria-activedescendant` tracks the active option, and Down/Up,
Enter, Escape, Home/End and type-ahead all behave as a real `<select>`
does. The confirmation dialog went the other way and is a native
`<dialog>`: the top layer, the backdrop, focus containment, Escape and
inert-everything-else are all things the platform gets right and a
hand-rolled trap does not. Prefer the platform; where you can't, owe it
the full contract.

**Content is data.** Adding a topic, lesson or question never requires
touching JavaScript. The schema lives in `docs/CONTENT_GUIDE.md` and is
enforced by `tools/validate-content.mjs`; change all three together or
none of them.

**Lesson ids are derived, not authored** — `lessonId(topicId, category)`
in `js/topics.js`, mirrored in the validator. Progress is stored against
them, so renaming a category renames the lesson and resets progress for
it. A category rename is a taxonomy change: questions, manifest and
lesson move together or not at all.

**A lesson is a page of typed blocks, not an article and not screens.**
A lesson file carries `{ category, summary, blocks }`, where each block
declares what it *is* — a `contrast`, a set of `forms`, a `pitfall`, a
`decision`, a `check`. The types are semantic, so `js/education.js` owns
every decision about how they look, and `check` blocks are still filled
from the questions sharing the lesson's category.

This replaced an article of named prose sections, which replaced a
sequence of story cards. Each time, the presentation changed and the
*content* had to be rewritten with it — which is precisely what a block
vocabulary is meant to stop. The blocks are the last schema change that
should be forced by a redesign; if a fourth one looks necessary, the
question to ask first is whether the block types are wrong or only their
rendering is.

## Content authoring

Lessons and questions are written by separate Claude sessions working
from `docs/agents/`. The supervisor fixes the category taxonomy first —
that's the one thing the two agents must agree on, and the thing the app
uses to link a wrong answer on the results screen to the lesson that
teaches it. See `docs/agents/README.md` for the loop.

**Blind a corpus with `npm run blind`, never by hand.** The first
hand-rolled attempt hid `correctIndex` and `explanation` and left `tip`
— and a tip is a standalone rule written for the item it belongs to, so
it names the keyed form outright in twenty-two items out of
twenty-four. Two reviewers opened their reports by saying so and had to
discount their own agreement rate, which is the one number a blind pass
exists to produce. `tools/blind-corpus.mjs` works by allow-list, shuffles
the options, and writes the key back beside the source rather than into
the directory the reviewer is pointed at.

**Content is reviewed by a session that has not seen the key.** The one
controlled comparison in the literature found teacher-plus-AI items
carrying *more* flaws than teacher-only items, because reviewers gave the
drafts less engagement — so `docs/agents/reviewer.md` is built to stop
that, and `calibration.md` grades the reviewer against ten items whose
answer is already known before its findings are believed. This applies to
your own rewrites too: three of the first six failed their re-review, one
because the fix traded a defect for a worse one.

**Write the category spec before the content.** `docs/agents/category-spec.md`,
with a worked example beside it. Every finding worth acting on in the
first review was invisible inside one item and obvious across four, which
is what the spec is for.

Two rules that only exist because a review found them, both in
`docs/agents/question-author.md`: a question must never be built on a
sentence from its own lesson (`check` blocks draw from the same category,
so the learner would meet the answer three blocks above the question),
and an option a competent teacher would accept is a wrong option, not a
less natural one.

## Verifying a change

The unit tests cover scoring and storage, not the screens. For anything
that touches the UI:

```bash
npm run serve &     # fetch() needs an HTTP origin
npm run verify      # ~430 checks, four viewports, one full learner journey
```

`tools/verify-ui.mjs` walks Eğitim → a lesson → a check → the Test tab →
a full quiz → results → Profil at 320 / 390 / 768 / 1280, auditing each
screen it lands on for horizontal overflow, touch targets under 44px and
console errors, then runs the §8 accessibility contract once. This is not
optional polish: WCAG conformance is defined per page and per responsive
variation, so the sweep *is* the requirement.

It needs Playwright, which is deliberately not a dependency — the script
finds a global install, or takes `PLAYWRIGHT_PATH`. Chromium already ships
in this environment. Adding to it means adding to that file, so the next
session inherits the check rather than rebuilding it.
