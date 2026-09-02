# English Prep Practice

A simple, free multiple-choice practice app for university English prep-school
exams ("hazırlık yeterlik/İYS" style Cloze Tests). Built as a static site so
it can be hosted for free on GitHub Pages and used by anyone with the link —
no accounts, no backend, no build step.

## How it works

- Pick a topic (e.g. Tenses) or start a mixed test drawing from every topic
  at once.
- Answer multiple-choice, paragraph-based cloze questions with instant
  feedback: a full explanation plus a short, generalizable rule after every
  answer.
- See your score, a breakdown by topic and by grammar category (e.g.
  "Present Perfect vs Past Simple: 3/4"), and — once you've done a few
  tests — which topics you're weakest in, based on data saved locally in
  your browser (`localStorage`). Nothing is sent to a server.

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
index.html          Home: topic selection + mixed test
quiz.html            Question-answering screen
results.html          Score, breakdown, and review
css/style.css          Single stylesheet (mobile-first, responsive)
js/                     ES modules — see file-level comments for each one's role
data/manifest.json       Topic index (id, title, tier, file, question count)
data/tenses/tenses.json    Tenses topic: all questions, grouped by category
```

## Design

The visual identity is a single, deliberate look — not a light/dark toggle:
a warm, dark ink-and-amber palette, a serif display face (Fraunces) for
headings paired with IBM Plex Sans for body text and IBM Plex Mono for
scores and numbers, and hairline borders instead of shadowed "card" panels.
The goal is to read as an edited, purpose-built study tool rather than a
generic dashboard template. See `css/style.css` for the token definitions
(`:root` custom properties) if this direction is extended to new pages.

## Adding a new topic

Adding a topic never requires touching any JavaScript — it's just data:

1. Create a new JSON file (e.g. `data/modals/modals.json`) using the schema
   below.
2. Add an entry for it to `data/manifest.json`, including a `tier` (see
   **Topic roadmap** below for the available tiers).
3. That's it — the topic shows up on the home page automatically.

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

Releases use a simple `x.y` scheme (tagged in git), tracked in
`CHANGELOG.md`:

- **`x` (major)** — big feature updates: a new mode, a major UI revision, a
  structural change to how the app works.
- **`y` (minor)** — smaller additions: a new topic going live, the profile
  system landing, small UI/UX tweaks.

## Roadmap beyond v1

- A lightweight local profile (name, settings, reset) once more than one
  person regularly uses the same device/browser.
- A guided, sequential "learning path" mode through topics, building on the
  per-topic weak-spot data already collected in v1.
- A dedicated question format for Vocabulary/Word Formation.
- Persisting per-category (not just per-topic) weak-spot history.
