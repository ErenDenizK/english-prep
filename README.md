# English Prep Practice

A simple, free multiple-choice practice app for university English prep-school
exams ("hazırlık yeterlik/İYS" style Cloze Tests). Built as a static site so
it can be hosted for free on GitHub Pages and used by anyone with the link —
no accounts, no backend, no build step.

## How it works

The interface (buttons, headings, status text) is in Turkish, since that's
the audience; practice sentences stay in English (that's the exam) and
explanations/tips stay in Turkish (already were). Grammar category labels
(e.g. "Present Perfect vs Past Simple") stay in English — students need to
recognize the English grammar terms.

Two content destinations on a bottom tab bar (Eğitim/Test — icons, not
just a label color, so the two feel structurally distinct), plus a Profil
that lives behind its own header-corner avatar button rather than as a
third tab — it's identity/settings, not a content mode, so it doesn't sit
at the same level as "what am I practicing":

- **Eğitim** — opens on a skimmable chapter index (every category across
  every topic, with a one-line rule preview) so you can jump straight
  into whichever chapter you need without walking through earlier ones.
  Tapping a row opens that chapter as a story-card walk, one small
  full-screen beat at a time: an opening hook (when authored), the rule,
  each example, a check question (answering is encouraged but never
  required — the forward control reads "Atla"/skip until you answer),
  then a chapter-complete beat with a "Konulara Dön" (back to index) and,
  on a topic's last chapter, a "Bu Konudan Test Et" shortcut. A segmented
  progress bar shows where you are in the current chapter; a pill switcher
  lets you jump between topics once more than one is live. Nothing is
  locked — every chapter of every topic is reachable any time, same as
  Test.
- **Test** — pick a topic or start a mixed test drawing from every topic at
  once. Multiple-choice, paragraph-based cloze questions with instant
  feedback: a full explanation plus a short, generalizable rule after every
  answer. See your score and a breakdown by topic and by grammar category
  (e.g. "Present Perfect vs Past Simple: 3/4"). Nothing is sent to a
  server — all of it is saved locally in your browser (`localStorage`). A
  topic whose content has grown since your last visit shows a "Yeni
  sorular eklendi" badge (see **Content-freshness tracking** below).
- **Profil** — opened from a small circular button in the header (shows
  the learner's initial once a name is set). An optional display name
  (local only, never sent anywhere) drives a personalized "Hoş geldin,
  {name}!" greeting in the header; overall stats (tests completed,
  questions answered, accuracy); and — once you've done a few tests —
  which topics and which grammar categories you're weakest in, each
  weak category with a "Pratik Yap" button that jumps straight into an
  open, category-scoped test for it; plus a reset button for all locally
  saved history.

A dismissible note above the tabs tells first-time visitors the app is
still in development (not yet `v1`) and what's usable today. It's shown
once — dismissing it is remembered locally and survives a "Geçmişi
Sıfırla" history reset (it's tracked separately from score history), so
it won't reappear just because someone clears their stats.

The whole app is a fixed-height "app shell" (header/tabs, a scrolling
content area with no visible scrollbar, and a fixed bottom action bar on
the quiz/results screens) rather than an ordinary scrolling web page —
answering a question never shifts the button you're about to tap next, and
nothing on any screen ever causes horizontal shift. All interactive
controls (the question-count picker, the clear-history confirmation) are
the app's own components, not native browser `<select>`/`confirm()` chrome.

## Running locally

This is plain HTML/CSS/JS with no build step, but the pages load question
data with `fetch()`, which requires an HTTP origin (opening `index.html`
directly as a `file://` URL will not work). Serve the project root with any
static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser.

## Branches

- **`main`** — always working, verified content only. GitHub Pages serves
  this branch.
- **`test`** — day-to-day development. New content and changes land here
  first; once tried and approved, they're merged into `main`.

## Deploying to GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` (or `test`, for previewing in-progress work) and the
   `/ (root)` folder, then save.
4. GitHub Pages will publish the site at
   `https://<username>.github.io/<repository>/` within a few minutes, and
   auto-updates on every push to that branch — no further steps needed.

No GitHub Actions workflow is required since there's nothing to build.

## Project structure

```
index.html          Home: bottom-nav Eğitim/Test, topic selection, mixed test
quiz.html            Question-answering screen
results.html          Score, breakdown, and review
css/style.css          Single stylesheet — the fixed app-shell layout,
                         custom dropdown/modal components, mobile-first
js/                     ES modules — see file-level comments for each one's role
  dropdown.js             Custom dropdown (replaces native <select>)
  modal.js                Custom confirm modal (replaces window.confirm)
  education.js             Eğitim tab: chapter index + story-card viewer
data/manifest.json       Topic index (id, title, tier, file, question count,
                            contentVersion, categories)
data/tenses/tenses.json    Tenses topic: questions (grouped by category) and
                            lessons (one per category, for the Eğitim tab)
```

## Design

The visual identity is a single, deliberate look — not a light/dark toggle:
a warm, dark ink-and-amber palette, a serif display face (Fraunces) for
headings paired with IBM Plex Sans for body text and IBM Plex Mono for
scores and numbers, and hairline borders instead of shadowed "card" panels.
The goal is to read as an edited, purpose-built study tool rather than a
generic dashboard template. See `css/style.css` for the token definitions
(`:root` custom properties) if this direction is extended to new pages.

## Content authoring workflow

Lesson and question content (the actual Turkish explanations, example
sentences, and topic coverage) is being authored separately from this
engineering work — in its own planning process, producing a curriculum
and material for each topic. This repo's job is the app engine: turning
whatever content arrives into working topics using the schema below (or
extending the schema first, when a new content shape doesn't fit it —
e.g. a guided step-by-step lesson sequence, or a non-cloze question
format), and building whatever UI features that content needs. Content
itself isn't authored here.

**`docs/education-notes.md`** is the shared coordination log between the
two sides — curriculum order and status, design proposals from the
content side, and dev-side responses/decisions. Read it for the current
state of any in-flight cross-side discussion (e.g. the guided-path
interaction model referenced in the roadmap below).

**`scripts/validate-content.js`** checks a topic file (and the manifest
entry pointing at it) against the schema below — run it after adding or
editing any content:

```
node scripts/validate-content.js
```

No dependencies, no build step. Checks: every question has 4 options, a
valid `correctIndex`, exactly one `____` blank, and non-empty
`explanation`/`tip`; lesson and question category sets match each other
and the manifest's `categories` list; the manifest's `questionCount`
matches the file's actual question count; no duplicate topic or question
ids. Exits non-zero and lists every problem found if anything's wrong.

## Adding a new topic

Adding a topic never requires touching any JavaScript — it's just data:

1. Create a new JSON file (e.g. `data/modals/modals.json`) using the schema
   below.
2. Add an entry for it to `data/manifest.json`, including a `tier` (see
   **Topic roadmap** below for the available tiers).
3. That's it — the topic shows up on the home page automatically.

A manifest entry looks like:

```json
{
  "id": "tenses",
  "title": "Tenses",
  "tier": "foundations",
  "file": "data/tenses/tenses.json",
  "questionCount": 24,
  "contentVersion": 1,
  "categories": ["Present Simple vs Present Continuous", "..."]
}
```

- **`categories`** (optional) — the distinct category names used across the
  topic's questions, shown as preview chips on its home-page card. Purely
  cosmetic; keep it in sync with the categories actually used in the
  topic's question file.
- **`contentVersion`** (optional integer, start at `1`) — bump it whenever
  you add or materially change questions in this topic. The app compares
  it against what a learner's browser last recorded (see **Content-freshness
  tracking** below) and shows a "Yeni sorular eklendi" badge on the topic
  card when the manifest's version is higher. Starting a test for that
  topic marks the new version as seen. Omit the field entirely if you
  don't want freshness tracking for a topic.
- **`comingSoon`** (optional, `true`/omit) — marks a topic as a roadmap
  teaser: it renders a disabled card with a "Coming soon" badge, is
  excluded from the mixed-test question pool, and needs no `file` or
  `questionCount` yet. Flip it to a real entry (add `file` +
  `questionCount`, drop `comingSoon`) once the content is authored.

## Content-freshness tracking

There's no login — just a local record (`localStorage`, same mechanism as
the score history and the Profil tab) of which `contentVersion` a learner
has last seen per topic. It exists solely to power the "new questions
added" badge described above; it's separate from the Profil tab's display
name and stats, and isn't cleared by the "Geçmişi Sıfırla" reset. See
`getSeenVersion`/`markTopicSeen` in `js/storage.js`.

### Question schema

Each topic file looks like this:

```json
{
  "topicId": "tenses",
  "title": "Tenses",
  "level": "B2-C1",
  "note": "Optional free-text note about the set.",
  "questions": [
    {
      "id": "tenses-t1",
      "category": "Present Simple vs Present Continuous",
      "paragraph": "Every morning, Elif ____ to the university library before her first class starts. She says the quiet hours right after opening are the only time she can truly concentrate.",
      "options": ["goes", "is going", "has gone", "went"],
      "correctIndex": 0,
      "explanation": "'Every morning' alışkanlık/rutin bildiren bir zaman ifadesi, bu yüzden Present Simple kullanılır. 'is going' anlık bir eylem için kullanılırdı, ama burada tekrar eden bir alışkanlıktan bahsediliyor.",
      "tip": "Alışkanlık bildiren zaman zarfları (every day, usually, often) Present Simple'ı tetikler."
    }
  ]
}
```

Field rules:

- **`category`** — the specific grammar contrast this question tests (e.g.
  "Present Perfect vs Past Simple", not just "Tenses"). Real exam difficulty
  comes from confusing similar forms, so questions should target a specific
  confusable pair/triad wherever possible, not just any one form in
  isolation. Used to group questions for the per-category breakdown on the
  results screen.
- **`paragraph`** — 1–3 sentences of realistic context with exactly one
  blank marked as `____` (four underscores). A single decontextualized
  sentence is too easy and not representative of the real exam; give the
  blank enough surrounding context (time expressions, cause/effect,
  narrative sequence) that picking the right form actually requires
  understanding the passage, the way YTÜ İYS's Cloze Test does.
- **`options`** — exactly 4 strings, usually different forms/tenses of the
  same verb. Order doesn't matter; the app shuffles it per attempt.
- **`correctIndex`** — the 0-based index into `options` of the correct
  answer.
- **`explanation`** — **in Turkish** (the practice sentence stays in
  English; the teaching explanation should be in the learner's own
  language). Always a full explanation, never a one-liner: say why the
  correct option is right given the paragraph's context, and why the
  nearest wrong option(s) don't fit.
- **`tip`** — **in Turkish**, a short, standalone, generalizable rule (not
  tied to this specific sentence) the learner can carry into other
  questions, e.g. "Since + geçmiş bir nokta' her zaman Present Perfect ile
  kullanılır." This is distinct from `explanation`: the explanation is
  situational, the tip is a transferable rule.

### Prompt template for AI-authored questions

Use a prompt along these lines when generating a new question set (adjust
the topic, categories, and count):

> Write [N] multiple-choice cloze questions for the topic "[TOPIC NAME]",
> targeting the YTÜ İYS-style university English prep-school exam (B2-C1
> level). Group them into [K] categories, each testing a specific pair or
> triad of easily-confused forms within the topic (e.g. for Tenses:
> "Present Perfect vs Past Simple", not just "Present Perfect" alone).
> Return them as a JSON array matching this exact shape:
>
> `{ "id": string, "category": string, "paragraph": string, "options": string[4], "correctIndex": number, "explanation": string, "tip": string }`
>
> Rules:
> - `paragraph` must be 1–3 sentences of realistic context (not an isolated
>   textbook sentence) containing exactly one blank written as `____`.
> - `options` must have exactly 4 plausible forms, only one of which is
>   correct in context — the wrong options should be genuinely tempting,
>   not obviously wrong.
> - `correctIndex` is the 0-based index of the correct option.
> - `explanation` **must be written in Turkish**: explain why the correct
>   answer fits this specific context, and why the closest wrong option(s)
>   don't.
> - `tip` **must be written in Turkish**: a short, standalone, generalizable
>   rule the learner can reuse on other questions — not a repeat of the
>   explanation.
> - Vary subjects, contexts, and sentence structure across questions; avoid
>   repeating the same scenario.

### Lesson schema (Eğitim tab)

Alongside `questions`, a topic file can carry a `lessons` array — one
entry per category, each rendered as its own chapter (a story-card walk,
reachable directly from the Eğitim chapter index). Same category taxonomy
as the questions, so there's one set of category names per topic, not two.

```json
{
  "topicId": "tenses",
  "title": "Tenses",
  "questions": [ "..." ],
  "lessons": [
    {
      "category": "Present Simple vs Present Continuous",
      "rule": "Kısa, net bir Türkçe kural açıklaması.",
      "examples": [
        { "sentence": "She goes to the gym every morning.", "note": "Alışkanlık → Present Simple" },
        { "sentence": "She is going to the gym right now.", "note": "Şu an oluyor → Present Continuous" }
      ]
    }
  ]
}
```

- **`category`** — must match a category name used in that topic's
  `questions`.
- **`rule`** — **in Turkish**, one or two sentences stating the general
  pattern (not tied to a specific example).
- **`examples`** — 2–3 entries, each a clean, isolated English sentence
  (simpler than a test paragraph — teaching, not testing) demonstrating the
  rule, with a short Turkish `note` naming which form and why.

Prompt template for AI-authored lessons:

> Write a short lesson for the topic "[TOPIC NAME]", category "[CATEGORY
> NAME]", for a Turkish university English prep-school student. Return
> JSON matching this exact shape:
>
> `{ "category": string, "rule": string, "examples": [{ "sentence": string, "note": string }] }`
>
> Rules:
> - `rule` must be in Turkish, one or two sentences, stating the general
>   pattern — not tied to any one example.
> - Provide 2–3 `examples`. Each `sentence` is a clean, simple, isolated
>   English sentence (much simpler than an exam paragraph — this is
>   teaching, not testing) that clearly demonstrates the rule.
> - Each example's `note` is a short Turkish phrase naming the form and
>   why it applies (e.g. "Alışkanlık → Present Simple").

## Topic roadmap

The long-term goal is to cover the full prep-school grammar syllabus. New
topics are grouped into four learner-facing difficulty tiers (used to group
topic cards on the home page once more than one tier has content), plus a
cross-cutting vocabulary track:

- **Foundations** — Tenses, Articles, Prepositions, Quantifiers,
  Comparatives & Superlatives.
- **Core Grammar** — Modals, Passive Voice, Gerunds & Infinitives.
- **Compound Structures** — Conditionals, Relative Clauses, Question Tags.
- **Advanced / Discourse-level** — Reported Speech, Connectors & Linking
  Words.
- **Vocabulary** (cross-cutting, not tied to a tier) — Word Formation,
  collocations. This will likely need its own question sub-type eventually
  and is flagged for a future design pass.

This tiering reflects a difficulty grouping for learners, not a required
authoring order — topics can be added in any order; whichever gets a JSON
file next simply becomes the next live topic card. See the architecture
plan in this repository's history for the full reasoning.

## Versioning

`x.y`, tracked in `CHANGELOG.md`. **`x` is fixed at `0` for the entire
development phase and only the project owner bumps it — not a rule an
assistant or contributor applies on their own judgment, no matter how big
a change looks.** `1.0` marks the point the owner explicitly decides the
app is a real first release, not any particular feature set being
"finished." Until then:

- **`y` (development build number)** — increments for every round of
  shipped changes, big or small alike (a new mode is still just the next
  `0.y`, not a reason to touch `x`). Current: see the latest entry in
  `CHANGELOG.md`.

## Roadmap to v1.0

Everything shipped so far (`v0.1`–`v0.10`) is development work toward a
first real release, not a release itself. Below is the working list of
what's left, roughly in the order it makes sense to tackle — see
`CHANGELOG.md` for what's already landed under each `0.y`.

1. **Real-device pass** — in progress. Everything so far has been verified
   with Playwright in a headless sandbox plus static screenshots; the
   owner is now testing on real phones (via the `test` branch's GitHub
   Pages preview) — real touch targets, real fonts loading, real network.
2. ~~Open design thread: the quiz category eyebrow label~~ — **resolved,
   kept as-is.** It ties a Test-tab question directly to the matching
   Eğitim-tab lesson category, which is genuinely useful for a learner
   moving between the two tabs, not just decoration.
3. ~~Navigation restructure~~ — **done in `v0.6`**, driven directly by
   artifact-comment feedback on the `v0.5` build: Profil was flagged as
   "çok alakasız" (irrelevant) sitting next to Eğitim/Test, so it moved
   out of the tab bar into a small header button (shows the learner's
   initial once a name is set); the header now shows a personalized
   "Hoş geldin, {name}!" greeting instead of a static tagline; the app
   name in the header shortened to "English Prep".
4. ~~Short first-run onboarding tour~~ — **done in `v0.7`, in simplified
   form.** Rather than a multi-step guided tour, a small dismissible note
   above the tabs tells a first-time visitor the app is still in
   development and what's usable today. Proportionate for this stage; a
   fuller step-by-step tour can still happen later if the app grows
   enough to need one.
5. ~~A second real topic~~ — **done in `v0.9`.** Modals and Passive Voice
   are both live (3 real topics total), pulled in from the
   content-authoring side. Test/Eğitim now feel like a real multi-topic
   app, and the "Yeni sorular eklendi" content-freshness badge has real
   data points beyond Tenses to prove itself against.
6. ~~Story-card presentation for Eğitim chapters~~ — **done in `v0.9`.**
   Built from the content side's Vision proposal in
   `docs/education-notes.md`: each chapter (lesson category) is now a
   sequence of full-screen beats (hook/rule/examples/check questions/
   chapter-complete) instead of one long paginated card.
7. ~~UI/UX overhaul: bottom nav + skimmable Eğitim~~ — **done in `v0.10`**,
   driven directly by feedback that the v0.9 story-card Eğitim was
   disliked outright and the top navigation was bad. Eğitim/Test moved to
   a bottom tab bar (icons, not just color, so the two read as distinct
   destinations), the header dropped to a single slim row, and Eğitim now
   opens on a skimmable chapter index instead of forcing a linear walk —
   the research and reasoning are in `CHANGELOG.md`'s `v0.10` entry.
8. **Chapter locking / guided-path progression** — the one piece of the
   original interaction-model proposal not yet built: soft-unlocking
   chapter *N+1* only once chapter *N* has been opened and attempted, and
   topic-to-topic progression. Deliberately kept separate from the
   presentation-layer work above — it needs its own progress-storage
   schema and is easier to get right now that there are 3 real topics to
   test the topic-to-topic unlock against, rather than just Tenses alone.
   Eğitim stays fully open (no locking) until this lands.
9. **Promote to `main` once approved** — `main` is still on the very first
   development build; it only moves forward when the owner has tried a
   build on `test` and signs off, per the branch model below. Confirm
   GitHub Pages is actually serving `main` at that point (not left on
   `test` from earlier testing).
10. **Owner declares `1.0`** — once the above holds and the owner is happy,
   they set `x` to `1`; this isn't a technical milestone this project
   infers on its own.

## Roadmap beyond v1.0

- A dedicated question format for Vocabulary/Word Formation. Deferred —
  it's a different question shape than the paragraph cloze format
  everything else is built around, and needs its own schema
  design before content can be authored for it.
