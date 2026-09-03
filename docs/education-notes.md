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

_No open requests yet._

## Notes

- Content-language convention is unchanged from the README: rule,
  explanation, and tip text is in Turkish; example/practice sentences and
  category labels stay in English.
- This file, like the rest of the repo's technical/dev-facing files, is in
  English; only learner-facing content (lesson text, question text) is
  Turkish/English per the convention above.
