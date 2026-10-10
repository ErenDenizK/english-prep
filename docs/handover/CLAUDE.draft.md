# Working on English Prep

English Prep is a static web app for Turkish university English prep-school proficiency
exams (YTÜ İYS style): plain HTML, CSS and ES modules, no build step, no runtime
dependencies, served from GitHub Pages. Two content modes in the bottom nav, **Eğitim**
(continuous article lessons with inline checks) and **Test** (cloze and closest-meaning
questions with instant feedback), plus **Profil** in the header. No accounts, no backend, no
analytics: everything a learner does stays in their browser's `localStorage`.

Read [`docs/handover/CURRENT.md`](CURRENT.md) first: it is the state of the app now. Old
decisions live in `docs/history/` and ADRs; they explain, they do not bind.

## Who it is for (owner, 2026-09-05)

A learner with a real English base and no academic foundation: their ear is good, they have
never been taught the labels. Consequences that drive every content decision:

- Explain notation and metalanguage (`V3`, "gerund"); do not explain the language itself.
- Every lesson is an "X vs Y" contrast: the boundary their ear conflates, not the forms.
- A rule stated too absolutely fails them: their ear produces the counterexample. An option a
  competent teacher would accept is a wrong option, not a "less natural" one.
- Refine, never teach from zero. Copy that assumes no English is aimed at someone else.

## Where things live

- Pages: `index.html` (shell: Eğitim, Test, Profil), `quiz.html`, `results.html`, `about/`
  (product page; content in `about/content.js`, guide in `about/README.md`).
- `js/home.js` router and Test tab · `js/education.js` lessons · `js/quiz.js`, `js/results.js`,
  `js/profile.js` · `js/shell.js` bar/scroller/action bar · `js/storage.js`, `js/backup*.js`
  local data · `js/topics.js` content loading and `lessonId()` · `js/interactions.js` finite
  effects · `js/motion.js` motion preference · `js/scroll-rail.js` rail · `js/dom.js` node
  builders · `js/icons.js` icons.
- Styles: `css/editorial.css` is the live look (Margin/Sakura tokens, aurora) over
  `css/style.css` (structure and the older UI 3 layer it overrides); `css/interactions.css`,
  `css/composition.css`, `css/scroll-rail.css`, `css/onboarding.css`, `css/share.css`.
- Content: `data/manifest.json`, `data/<topic>/<topic>.json` (lessons + questions). Schema:
  `docs/CONTENT_GUIDE.md`, enforced by `tools/validate-content.mjs`.
- Specs: `docs/margin-design-system.md` (current interface), `docs/EXPERIENCE.md` (journeys),
  `docs/adr/` (decisions; the newest one on a topic wins), `docs/design/motion-v073.md`,
  `docs/design/scroll-rail-v073.md`, `docs/design/about-v072.md`.
- Content pipeline: `docs/agents/` (authors, reviewer, solver, calibration).
- Plans: `docs/app1-final.md` (content plan; see CURRENT.md for its status), `docs/app2/`
  (research for a second app; nothing built).
- `original/` (v0.64 interface) and `legacy/` (MVP) are served snapshots. Do not edit.
- `docs/family/`: shared family notes with the owner's other products; not binding here.

## Hard rules

These are the only non-negotiables. Everything else is a current choice that the owner may
change; ask about taste, decide technique yourself and record it in an ADR.

- **No build step, zero runtime dependencies.** `package.json` is tooling only.
- **No `innerHTML`** (or `insertAdjacentHTML`) anywhere. Build nodes, set `textContent`
  (`js/dom.js`).
- **Mobile first, fixed shell.** Check 320 px first. Only `#shell-scroll` scrolls. Answering
  must never move the button the learner is about to tap.
- **Content is data.** A topic, lesson or question never needs a JavaScript change. Lesson
  ids are derived (`lessonId(topicId, category)`); renaming a category resets progress.
- **Language.** UI, explanations, tips and lesson prose in Turkish (*sen*); examples, stems,
  options, category names and topic titles in English, marked `lang="en"`.
- **Never lose learner data.** Keep the v1 backup format and old storage fields readable.
- **`npm run check` passes before any push.** Run `npm run format` after editing `data/`.
- **Version `x` stays `0`.** `CHANGELOG.md` is `x.y`; only the owner bumps `x`. `y` grows per
  shipped round.
- **`test` is the live site.** A push to `test` is a deploy; there is no staging. `main` is a
  stale MVP, not a safety net. Work on your own branch unless told otherwise.

Settled by the owner's feedback (reopen only when asked): Eğitim/Test are the two nav peers and
Profil lives in the header; lesson checks never gate reading; no exam dates, daily goals,
streaks or reminders in the UI.

## Conventions

- Conventional Commits, lower-case subject, header at most 100 characters. Use the trailers
  the session gives you. Never write an AI model name into code, comments or docs.
- Replaced native controls owe the full native contract (`js/listbox.js`); prefer the
  platform where possible (`<dialog>` in `js/modal.js`).
- Colours and motion are tokens in the stylesheets, never inline values.
- New colour roles must pass `tools/editorial-palette.mjs` (the live checker) in both themes.
- Every effect has a still twin: reduced motion, motion off and hidden tabs keep every state
  and control. Animation never changes scoring, progress or history.
- Content authoring: write the category spec first; review blind with `npm run blind` and
  calibrate with `npm run calibrate` (never point a reviewer at `docs/agents/calibration.md`);
  never build a question on a sentence from its own lesson. Details: `docs/agents/README.md`.
- User-visible change → a `CHANGELOG.md` entry in Turkish.

## Verifying cheaply

Run only what covers the change.

- Docs only: `npm run check`.
- Content: `npm run format && npm run validate && npm test`.
- Colours/tokens: `npm run color`.
- Logic: `npm test` (node:test, `tests/*.test.js`).
- Any screen: `npm run serve` (port 8000) in the background, then `npm run verify`
  (Chromium sweep at 320/390/768/1280; Playwright is global, or set `PLAYWRIGHT_PATH`).
  Targeted Python suites in `tests/*_browser.py` take `--base-url`.
- UI work: screenshot at 390×844, 1180×820 and 1440×900 in dark (default) and light, and look
  before reporting. Emulation is not a physical-device test; say so.

## Commands

```bash
npm run check      # format:check + validate + color + test (also CI on main/test)
npm run format     # canonical JSON formatting for data/
npm run serve      # static server on :8000
npm run verify     # Chromium sweep; needs serve running
npm run audit      # screen measurements
npm run icons      # regenerates icons/ (never hand-edit)
npm run draft -- docs/agents/drafts/<topic>     # check an unshipped topic
npm run blind -- <questions.json> <outDir>      # unkey a set for blind review
npm run calibrate -- <outDir>                   # reviewer calibration corpus
npm run solve                                   # human cold-solve in the terminal
```
