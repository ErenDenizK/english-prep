# English Prep Practice

A simple, free multiple-choice practice app for university English prep-school
exams ("hazırlık yeterlik/İYS" style tests). Built as a static site so it can
be hosted for free on GitHub Pages and used by anyone with the link — no
accounts, no backend, no build step.

## How it works

- Pick a topic (e.g. Present Simple) or start a mixed test drawing from every
  topic at once.
- Answer multiple-choice, fill-in-the-blank questions with instant feedback
  and a full explanation after every answer.
- See your score, a breakdown by topic, and — once you've done a few tests —
  which topics you're weakest in, based on data saved locally in your
  browser (`localStorage`). Nothing is sent to a server.

## Running locally

This is plain HTML/CSS/JS with no build step, but the pages load question
data with `fetch()`, which requires an HTTP origin (opening `index.html`
directly as a `file://` URL will not work). Serve the project root with any
static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser.

## Deploying to GitHub Pages

1. Merge this branch into the repository's default branch (e.g. `main`).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the `/ (root)` folder, then save.
5. GitHub Pages will publish the site at
   `https://<username>.github.io/<repository>/` within a few minutes.

No GitHub Actions workflow is required since there's nothing to build.

## Project structure

```
index.html          Home: topic selection + mixed test
quiz.html            Question-answering screen
results.html          Score, breakdown, and review
css/style.css          Single stylesheet (mobile-first, responsive)
js/                     ES modules — see file-level comments for each one's role
data/manifest.json       Topic index (id, title, tier, file, question count)
data/tenses/*.json         One question set per tense
```

## Adding a new topic

Adding a topic never requires touching any JavaScript — it's just data:

1. Create a new JSON file (e.g. `data/modals/modals-obligation.json`) using
   the schema below.
2. Add an entry for it to `data/manifest.json`, including a `tier` (see
   **Topic roadmap** below for the available tiers).
3. That's it — the topic shows up on the home page automatically.

### Question schema

Each topic file looks like this:

```json
{
  "tenseId": "present-simple",
  "title": "Present Simple",
  "questions": [
    {
      "id": "present-simple-001",
      "prompt": "She ____ to school every day.",
      "options": ["go", "goes", "is going", "went"],
      "correctAnswer": "goes",
      "explanation": "\"Goes\" is correct because ... \"Go\" is wrong because ... \"Is going\" is wrong because ... \"Went\" is wrong because ..."
    }
  ]
}
```

Field rules:

- **`prompt`** — a sentence with exactly one blank marked as `____` (four
  underscores).
- **`options`** — exactly 4 strings. Order doesn't matter; the app shuffles
  it per attempt.
- **`correctAnswer`** — must exactly match one of the strings in `options`.
- **`explanation`** — always a full teaching explanation, never a one-liner.
  It must say *why the correct option is right* **and** briefly explain the
  mistake or misconception behind *each* wrong option. This is what makes
  the app useful for learning, not just testing.

### Prompt template for AI-authored questions

Use a prompt along these lines when generating a new question set (adjust
the topic and count):

> Write 8 multiple-choice, fill-in-the-blank English grammar questions for
> the topic "[TOPIC NAME]", targeting a university English prep-school exam.
> Return them as a JSON array matching this exact shape:
>
> `{ "id": string, "prompt": string, "options": string[4], "correctAnswer": string, "explanation": string }`
>
> Rules:
> - `prompt` must contain exactly one blank written as `____`.
> - `options` must have exactly 4 plausible choices, only one of which is
>   grammatically correct in context.
> - `correctAnswer` must exactly match one of the `options` strings.
> - `explanation` must be a full teaching explanation: confirm why the
>   correct answer is right, and briefly explain the specific mistake each
>   wrong option represents (don't just say "wrong tense" — say which tense
>   it wrongly suggests and why that doesn't fit here).
> - Vary sentence subjects and contexts across questions; avoid repeating
>   the same sentence structure.

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
