# Education Content Notes

A shared coordination log between the curriculum/education-content side of
this project and the technical/dev side. Read this before starting new
topic work; log status updates and format requests here as they happen.

## Curriculum plan

Target exams: YTÜ İYS (Cloze Test format) and Bilkent's English prep-school
proficiency exam. Level: B2-C1 — content starts at intermediate-and-up, not
absolute-beginner material.

Topic production order below is driven by exam weight and conceptual
dependency (which topics need to be understood before the next one makes
sense), not by the `tier` grouping already used for the home-page display
in `data/manifest.json`.

**Stage A — core verb-phrase grammar** (everything else builds on this)
1. Tenses — done
2. Modals — next
3. Passive Voice
4. Conditionals
5. Gerunds & Infinitives

**Stage B — clause-combining / discourse level**
6. Relative Clauses
7. Reported Speech
8. Connectors & Linking Words

**Stage C — precision/detail topics**
9. Articles
10. Prepositions
11. Quantifiers
12. Comparatives & Superlatives
13. Question Tags

Vocabulary / Word Formation is intentionally out of scope for now — it
needs its own question schema (a different shape than the single-blank
cloze format everything else uses). Revisit once that schema exists; see
the README's "Roadmap beyond v1.0" section, which already flags this.

Each topic is split into 4-6 categories, each a specific confusable
pair/triad (e.g. "Present Perfect vs Past Simple", not just "Present
Perfect") rather than one isolated form — same approach as the existing
Tenses content, and per the question/lesson schema and AI-authoring prompt
templates already documented in the README.

## Interaction model proposal: guided path (Eğitim) + open world (Test)

Proposed design for how the two tabs should feel, building on the topic
order above. This reuses the existing `lessons`/`questions` schema — no new
question format is required to build this.

**Eğitim = a single linear, story-like path, chapter by chapter.**

- The Stage A → B → C topic order above becomes one path. Each topic is a
  "level"; each level is split into chapters — one chapter per lesson
  `category`, matching the schema 1:1 (Tenses' 6 categories → 6 chapters,
  etc.), so no new content unit needs inventing.
- A chapter combines, in order: a short, simple framing line to open it
  (light narrative touch — one relatable sentence, not a full story — so it
  reads as "next step in a journey" rather than a grammar-book entry) → the
  existing `rule` (Turkish) → the existing `examples` (English sentence +
  Turkish note) → 2-3 embedded check questions pulled from that same
  category's existing `questions` pool → instant feedback using the
  existing `explanation`/`tip` fields.
- **Locking:** chapter *N+1* unlocks once chapter *N* has been opened and
  its check questions attempted (a soft gate — seeing the material and
  trying the questions is what unlocks the next step, not a required
  score, so it doesn't feel punishing). Topic *N+1* unlocks once every
  chapter in topic *N* has been completed.
- **End-of-topic beat:** a short "you finished Tenses" moment with two
  paths forward — continue to the next unlocked topic, or jump into Test
  for that topic to practice freely.

**Test = open world, unchanged.**

- No gating tied to Eğitim progress, ever. Any live topic's test, or the
  mixed all-topics test, stays selectable at any time — exactly today's
  behavior. This is the deliberate contrast: Eğitim is the guided,
  one-thing-unlocks-at-a-time path for learners who want structure; Test is
  the sandbox for free practice, review, or jumping straight to a known
  weak spot (per the Profil tab's weak-category data) without walking the
  path first.
- No content changes needed here — same schema, same free topic/mixed
  selection.

**Content impact.** The `lessons` and `questions` files I'm already
producing topic-by-topic cover both surfaces as-is — one content set, two
presentations. The one genuinely new piece is the chapter's opening framing
line; I'd author it as a small addition alongside each lesson entry's
`rule` (e.g. a new optional `intro` field) rather than a new schema.

**Open question for the dev side, not decided here:** whether the 2-3
embedded check questions per chapter should be the *same* items that also
live in the Test pool for that category, or a distinct reserved subset (so
a learner doesn't see an identical question twice between Eğitim and
Test). If a reserved subset is wanted, I'd need to author slightly more
questions per category going forward (e.g. 6 instead of 4, with 2 marked
for embedding) — worth deciding before more topics are authored, since it
changes how much per-category content I write. Locking/completion logic,
progress storage, and the path/map UI itself are dev-side calls entirely.

## Status

| Topic | Status |
|---|---|
| Tenses | Live (24 questions, 6 categories) |
| Modals | In progress — next up |
| Passive Voice | Not started |
| Conditionals | Not started |
| Gerunds & Infinitives | Not started |
| Relative Clauses | Not started |
| Reported Speech | Not started |
| Connectors & Linking Words | Not started |
| Articles | Not started |
| Prepositions | Not started |
| Quantifiers | Not started |
| Comparatives & Superlatives | Not started |
| Question Tags | Not started |
| Vocabulary / Word Formation | Deferred — needs a new question schema |

## Format requests

Content is authored against the existing schema: `lessons` (rule +
examples, for the Eğitim tab) and `questions` (single-blank cloze, for the
Test tab). Some topics may teach better with a practice format other than
single-blank cloze — for example sentence-combining for Relative Clauses,
transformation drills for Reported Speech, or quick matching for Question
Tags. When that looks worth it, it'll be logged here with the topic and
the reasoning. Evaluating and building a new format is a dev-side call, not
something produced from the content side.

- **Logged 2026-09-03:** guided-path chapter framing line (see
  "Interaction model proposal" above) — proposing a new optional `intro`
  field per lesson entry. Everything else in that proposal reuses the
  existing schema.

## Notes

- Content-language convention is unchanged from the README: rule,
  explanation, and tip text is in Turkish; example/practice sentences and
  category labels stay in English.
- This file, like the rest of the repo's technical/dev-facing files, is in
  English; only learner-facing content (lesson text, question text) is
  Turkish/English per the convention above.
