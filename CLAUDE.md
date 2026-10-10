# Working on English Prep

English Prep is a static web app that sharpens the English of Turkish learners who have a good ear
and no labels: plain HTML, CSS and ES modules, no build step, no runtime dependencies, served by
GitHub Pages from the `test` branch. Two content modes in the bottom nav, **Eğitim** (article
lessons, each one "X vs Y" distinction, with inline checks) and **Test** (cloze and
closest-meaning questions with instant feedback), plus **Profil** from the header and a product
page at `about/`. No accounts, no backend, no analytics: a learner's data stays in their
browser's `localStorage`.

Read in this order; nothing else binds except the interface values named below:

1. This file: rules and how to verify.
2. [`docs/STATE.md`](docs/STATE.md): what the code does today, its weak spots.
3. [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md): what V1 means, the family, how rules and new
   techniques are admitted (lab → gate → owner).
4. [`docs/ROADMAP.md`](docs/ROADMAP.md): the work, in order. Do not start work that is not on it
   without asking.

Interface values live in [`docs/margin-design-system.md`](docs/margin-design-system.md) and the
newest ADR on a topic in `docs/adr/` (motion: ADR 014 and `docs/design/motion-v076.md`). Old plans
and specs are in `docs/history/`: they explain, they never bind. If documents disagree: code and
its checks › STATE › this file › newest ADR on the topic › Margin › history.

## Who it is for (owner, 2026-09-05)

A learner with a real English base and no academic foundation: their ear is good, nobody taught
them the labels. Every content and copy decision follows from that:

- Explain notation and metalanguage (`V3`, "gerund"); do not explain the language itself.
- Every lesson is an "X vs Y" contrast: the boundary the ear conflates, not the forms.
- A rule stated too absolutely fails them: their ear finds the counterexample. An option a
  competent teacher would accept is a wrong option, not a "less natural" one.
- Refine, never teach from zero. Copy that assumes no English is aimed at someone else.

**V1** (owner, 2026-10-10) is a working, presentable, family-aligned product the owner signs
off; it is not about content or exam coverage (`docs/PRINCIPLES.md` §1).

Whether the product is an exam app, a general English app or two apps is open and parked
([`docs/PRODUCT-DIRECTION.md`](docs/PRODUCT-DIRECTION.md)); do not settle it in passing.

## Branches (owner, 2026-10-10)

- **`test`** is the only development branch and the live site. Work here, commit here, push here
  after the checks below pass. A push is a deploy: there is no staging.
- **`main`** is the owner's release branch, moved by the owner's hand at V1 and later. Never push,
  merge or open a pull request into `main`.
- No other branches. If the session was given another branch name, ignore it for this repo and
  use `test`.
- Bump `VERSION` in `sw.js` with every release, or phones keep the old cache. It must equal the
  newest `CHANGELOG.md` heading (`tests/service-worker.test.js` checks it).

## Where things live

- Pages: `index.html` (shell: Eğitim, Test, Profil, `#hosgeldin`), `quiz.html`, `results.html`,
  `about/` (own CSS/JS, guide in `about/README.md`).
- JS: `home.js` router and Test tab · `education.js` lessons · `quiz.js`, `results.js`,
  `profile.js`, `onboarding.js` · `shell.js` bar/scroller/action bar · `storage.js`,
  `backup*.js` local data · `topics.js` content loading and `lessonId()` · `interactions.js`
  motion engine (`compose`, springs, press/release) · `motion.js` preference and aurora ·
  `scroll-rail.js` · `listbox.js`, `modal.js` controls · `dom.js` node builders · `icons.js`.
- CSS: `editorial.css` is the live look (Margin/Sakura tokens, aurora) and overrides
  `style.css`, which still carries the old UI 3 skin underneath (removing it is roadmap phase 1);
  `interactions.css`, `composition.css`, `scroll-rail.css`, `onboarding.css`, `share.css`.
- Content: `data/manifest.json` and `data/<topic>/<topic>.json` (lessons + questions). Schema:
  `docs/CONTENT_GUIDE.md`, enforced by `tools/validate-content.mjs`.
- Content pipeline: `docs/agents/` (author, reviewer, calibration, blind review, human solver).
- Family: `docs/family/` (English Prep's page in the maker's design family, the copied kit,
  `world.json`). The kit is copied from the portfolio repo; never edit `docs/family/kit/`.
- `original/` (the v0.64 interface, linked from About) is a served snapshot: do not edit.

## Hard rules

- **No build step, zero runtime dependencies.** `package.json` is tooling only.
- **No `innerHTML`** or `insertAdjacentHTML`. Build nodes, set `textContent` (`js/dom.js`).
- **Mobile first, fixed shell.** Check 320 px first. Only `#shell-scroll` scrolls. Answering never
  moves the control the learner is about to tap.
- **Content is data.** A topic, lesson or question never needs JavaScript. Lesson ids are derived
  (`lessonId(topicId, category)`); renaming a category resets progress.
- **Language.** UI, explanations, tips and lesson prose in Turkish (*sen*); examples, stems,
  options, category names and topic titles in English, marked `lang="en"`.
- **Never lose learner data.** The v1 backup format and old storage fields stay readable.
- **Every effect has a still twin.** Reduced motion, the motion toggle, hidden tabs and forced
  colours keep every state and control. Animation never changes scoring, progress or history.
- **Colours and motion are tokens**, measured by `npm run color` in both themes; never inline.
- **Version `x` stays `0`** until the owner declares V1. `CHANGELOG.md` is `x.y` in Turkish; `y`
  grows per shipped round.
- **New techniques go through the lab** (`docs/PRINCIPLES.md` §4): glass, new motion or
  atmosphere effects are tried in `lab/` (not linked, `noindex`, not precached; note that `test`
  serves it publicly), gated by measurements, approved by the owner, then promoted one surface
  per release behind a switch. One visual axis changes per release.
- **Glass is allowed** (owner, 2026-10-10) only under the material contract in
  `docs/PRINCIPLES.md` §4: chrome only, measured legibility, a solid twin. Not by eye.

Settled by the owner (reopen only when asked): Eğitim and Test are the two nav peers and Profil is
in the header; lesson checks never gate reading; no exam dates, daily goals, streaks or reminders
in the UI. Taste is asked of the owner, with a short plain-Turkish brief; technique is decided,
measured and recorded in an ADR.

## Conventions

- Conventional Commits, lower-case subject, header ≤ 100 characters, with the trailers the
  session gives you. Never write an AI model name into code, comments or docs.
- Code reads like its neighbours; comments cite the doc section a behaviour comes from. A lesson
  from one bug is a comment beside that code, not a rule here.
- Replaced native controls owe the full native contract (`js/listbox.js`); prefer the platform
  (`<dialog>` in `js/modal.js`).
- Content: write the category spec first; review blind (`npm run blind`), calibrate with
  `npm run calibrate` (never show a reviewer `docs/agents/calibration.md`); never build a question
  on a sentence from its own lesson. Run `npm run format` after editing `data/`.
- If you change a token, run `node tools/make-world.mjs` (`npm test` fails on drift).
- Never write into the other family products' repositories. Findings for them go in
  `docs/family/OUTBOX.md` (proposed, awaiting the owner; `docs/PRINCIPLES.md` §2).
- Keep `docs/STATE.md` true: a change that alters what it says updates it in the same commit.
- The owner speaks Turkish, often by dictation: read through transcription errors, confirm names.

## Verifying cheaply

Run what covers the change, all of it before a push to `test`.

- Docs only: `npm run check`.
- Content: `npm run format && npm run validate && npm test`.
- Tokens/colours: `npm run color`.
- Logic: `npm test` (node:test, `tests/*.test.js`).
- Any screen: `npm run serve` (port 8000) in the background, then `npm run verify` (Chromium sweep
  at 320/390/768/1280, about 3,600 checks; Playwright is global or `PLAYWRIGHT_PATH`), plus the
  matching Python suite in `tests/*.py` (17 files), or all of them with `npm run browser` (starts
  its own server). They need `pip install -r tests/requirements.txt`; every file takes
  `--base-url` (`EP_BASE_URL`) and `--browser-path` (`EP_BROWSER`, e.g.
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; see `tests/README.md`).
- UI work: screenshot at 390×844, 1180×820 (touch) and 1440×900, dark and light, and look before
  reporting. Emulation is not a device test; say so.

```bash
npm run check      # format:check + validate + color + test (CI on main and test)
npm run format     # canonical JSON formatting for data/
npm run serve      # static server on :8000
npm run verify     # Chromium sweep; needs serve running
npm run browser    # every Python browser suite (tests/README.md)
npm run audit      # screen measurements
npm run icons      # regenerates icons/ (never hand-edit)
npm run draft -- docs/agents/drafts/<topic>   # check an unshipped topic
npm run blind -- <questions.json> <outDir>    # unkey a set for blind review
npm run calibrate -- <outDir>                 # reviewer calibration corpus
npm run solve                                 # human cold-solve in the terminal
```
