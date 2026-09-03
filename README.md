# English Prep Practice

A free study app for Turkish university English prep-school proficiency
exams (YTÜ İYS style Cloze Tests). Built as a static site so it can be
hosted on GitHub Pages and used by anyone with the link — no accounts, no
backend, no build step.

Mobile first: it's designed to be used on a phone between classes, and
verified at 320px before anything else.

## How it works

The interface is in Turkish, since that's the audience. Practice sentences
stay in English (that's the exam), explanations and lesson prose stay in
Turkish, and grammar category labels stay in English — students need to
recognize the terms.

Eğitim and Test are the two content modes and live in a bottom nav.
Profil opens from the header — it's identity and settings, not a mode.

- **Eğitim** — a staged walkthrough of the syllabus. The index lists
  every lesson across every topic, grouped and skimmable with its own
  progress and a "pick up where you left off" card; you can start
  anywhere, since someone after one specific rule shouldn't have to walk
  through five chapters to reach it. Opening a lesson drops into a
  focused reader that pages through it a step at a time — why the pair is
  confusing, the forms, what they mean, how they're used, examples, the
  mistakes people actually make, and a recap you can carry into the exam
  — with check questions along the way. Checks are never scored and never
  block you: an unanswered one just reads "Atla". Finishing a lesson
  offers the next one or a test on the same topic.
- **Test** — pick a topic or start a mixed test drawing from every topic
  at once. Paragraph-based multiple-choice cloze questions with instant
  feedback: a full explanation of why the answer fits *this* passage, plus
  a short transferable rule. The results screen breaks the score down by
  topic and by grammar category, and each category links straight to the
  lesson that teaches it. A topic whose questions have grown since your
  last visit shows a "Yeni sorular eklendi" badge.
- **Profil** — an optional display name (local only, and the initial the
  header button shows), how far through the lessons you are, overall
  practice stats, and which topics and categories you're weakest in. A
  weak category is actionable in both directions: tap its name to open
  the lesson that teaches it, or "Pratik Yap" to start a test scoped to
  just that category. Plus a reset for everything stored locally.

Nothing is sent anywhere. All progress lives in this browser's
`localStorage`.

The whole app is a fixed-height "app shell" — header, one scrolling
content area with no visible scrollbar, and either the bottom nav or, in
a focused mode, a fixed action bar — rather than an ordinary scrolling
page. Answering a question never shifts the button
you're about to tap, and no screen ever moves sideways. The controls that
would normally hand the screen to the OS (the question-count picker, the
reset confirmation) are the app's own components, and re-implement the
keyboard and focus behaviour they replaced.

## Running locally

Plain HTML/CSS/JS with no build step, but the pages load content with
`fetch()`, which needs an HTTP origin — opening `index.html` as a `file://`
URL will not work.

```bash
npm run serve          # python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Checks

`package.json` exists for tooling only. The app itself has **no
dependencies and no build step**, and nothing here is needed to serve it.

```bash
npm run validate       # content schema + manifest/topic-file consistency
npm run color          # re-measures every colour token (WCAG 2 + APCA)
npm test               # unit tests for the scoring and storage logic
npm run check          # all three
npm run verify         # drives the real app in a browser — needs `serve`
```

`check` runs in CI on every push and pull request to `main` and `test`.
`verify` does not: it needs a browser, and the point of having no
dependencies is not to acquire one for CI. Run it locally for anything
that touches the interface — it walks a whole learner journey at four
widths and audits every screen it lands on. See `CLAUDE.md`.

`npm run validate` is the important one when content changes: it checks
every question and lesson against the documented schema, and catches the
cross-file drift that would otherwise show up as a wrong number on a
topic card or a lesson that links to nothing.

## Branches

- **`main`** — always working, verified content only. GitHub Pages serves
  this branch.
- **`test`** — day-to-day development. New content and changes land here
  first; once tried on a real phone and approved, they're merged into
  `main`.

## Deploying to GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` (or `test`, to preview in-progress work) and the
   `/ (root)` folder, then save.

The site publishes at `https://<username>.github.io/<repository>/` within
a few minutes and auto-updates on every push to that branch. No Actions
workflow is needed to build it — the CI workflow only runs the checks.

## Project structure

```
index.html            App shell: tab bar + Eğitim / Test / Profil views
quiz.html             Question-answering screen
results.html          Score, breakdown, review
css/style.css         Single stylesheet; design tokens in :root
js/                   ES modules — see each file's header comment
data/manifest.json    Topic index
data/<topic>/         One JSON file per topic: its lessons and questions
tools/                Content validator
tests/                Unit tests
docs/                 Content schema and content-agent briefs
```

## Design

The visual identity is a single, deliberate look — not a light/dark
toggle: a warm, dark ink-and-amber palette, a serif display face
(Fraunces) for headings paired with IBM Plex Sans for body text and IBM
Plex Mono for scores and numbers, and hairline borders instead of shadowed
"card" panels. The goal is to read as an edited, purpose-built study tool
rather than a generic dashboard template. Token definitions are the
`:root` custom properties at the top of `css/style.css`.

## Adding content

Adding a topic, a lesson or a question never requires touching
JavaScript — it's all JSON.

- **`docs/CONTENT_GUIDE.md`** is the authoritative schema: the manifest,
  the question shape, the lesson shape and its three step types, and the
  language rules. `npm run validate` enforces it.
- **`docs/agents/`** holds the briefs for the separate Claude sessions
  that author content — one for lessons, one for questions — plus how the
  handoff works and why the category taxonomy is settled before either
  starts.
- **`docs/education-notes.md`** is the running content/dev channel:
  curriculum order for upcoming topics, proposals from the content side,
  and the development side's answers.

Three topics are live today — Tenses, Modals and Passive Voice — with 24
questions and 6 lessons each.

## Versioning

`x.y`, tracked in `CHANGELOG.md`. **`x` is fixed at `0` for the entire
development phase and only the project owner bumps it** — not a rule an
assistant or contributor applies on their own judgment, no matter how big
a change looks. `1.0` marks the point the owner explicitly decides the app
is a real first release, not any particular feature set being "finished".
Until then, `y` increments for every round of shipped changes, big or
small alike.

## Roadmap to v1.0

Everything shipped so far is development work toward a first real release.
What's left, roughly in order:

1. **Real-device pass.** Everything so far has been verified with
   `npm run verify` across 320/390/768/1280 plus screenshots. Before anything is
   called `1.0`, the owner and at least one friend should use it on their
   own phones via the `test` branch's Pages preview — real touch targets,
   real fonts loading over a real network.
2. **Promote to `main` once approved.** `main` is still on an early
   development build; it only moves when the owner has tried a build on
   `test` and signs off. Confirm Pages is serving `main` at that point.
3. **Owner declares `1.0`.** Once the above holds and the owner is happy.
   This isn't a milestone the project infers on its own.

## Roadmap beyond v1.0

- **A guided learning path** through topics, built on the per-category
  weak-spot data already collected. Deliberately deferred: it needs its
  own design pass (fixed order? adaptive to weak spots? how it coexists
  with the free-form Eğitim and Test tabs) rather than being built on a
  guess.
- **A question format for Vocabulary / Word Formation.** Deferred for the
  same reason — it's a different question shape than the paragraph cloze
  everything else is built around, and needs schema design before content
  can be authored for it.
- **Self-hosted fonts.** The three families are loaded from Google Fonts
  today, which is one render-blocking third-party request on a phone that
  may be on a poor connection. Vendoring the `latin` + `latin-ext` subsets
  would remove it. Worth doing, not worth blocking `1.0` on.
