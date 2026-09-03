# Education Content Notes

This file is the single channel between the curriculum/education-content
side of this project and the technical/dev side — my notes, my requests,
and the material I produce all live here, and nowhere else. I don't touch
`index.html`, `css/`, `js/`; I do author the `data/*.json` content files
directly (that's the content itself, not app code) and note every change
here too.

Sections: **Vision** (the direction for how Eğitim should feel to use) →
**Messages to developer** (a running, dated request log — read this first
if you're picking up work) → **Curriculum plan** (topic order and content
approach) → **Eğitim/Test interaction model** (free navigation vs. open
world) → **Content schema reference** (the fields each topic file now
carries) → **Status** (per-topic content progress).

## Vision

**Superseded 2026-09-03.** The previous version of this section proposed
an Instagram/TikTok-Stories-style "story-card" format — short tappable
cards, gamified chapter-unlock progression. The project owner reviewed it
and rejected it: it read as a flashcard/gimmick, not real teaching. Full
pivot below; the story-card proposal (and the guided-path locking that
went with it) is dropped, not just deprioritized. If you already started
building against the old version of this section, stop — the new model is
simpler to build, not harder.

**New direction: Eğitim is a proper article/textbook chapter per grammar
topic, written the way a professional language teacher would explain it to
someone who has never had the concept explained before** — not a
rule-plus-two-examples flashcard. Concretely:

- **Every topic opens with an overview article** (new `overview` field on
  the topic file) that introduces the grammar area itself in plain terms
  before any confusable-pair comparison starts — e.g. "What even is a
  tense?" — including a short note on where Turkish and English diverge,
  since that's where most learner confusion actually originates.
- **Every category is a full article, not a card.** Built on the
  **Form – Meaning – Use** framework (a standard ESL-teaching model: how a
  structure is built, what it conceptually means, when/why a fluent
  speaker reaches for it) plus a **Common Mistakes** section — the kind of
  correction a real teacher gives, specific to Turkish-speaking learners,
  not generic. See "Content schema reference" below for the exact fields;
  all three shipped topics already use this shape (see Status).
- **No embedded quiz questions inside Eğitim.** The old vision's
  "check-question cards" are dropped. Eğitim goes back to being pure,
  unscored teaching, per the app's original design intent (see README);
  Test remains where all practice happens.
- **Navigation: free, table-of-contents style — no locking, at any level.**
  A topic shows its overview plus its category articles in a recommended
  order (numbered, like a book's table of contents), but every article is
  directly reachable — no chapter or topic is ever gated behind finishing
  another. This matches Test's existing "everything open" philosophy
  instead of contradicting it. The existing `education.js` Previous/Next
  pager can likely stay as the reading mechanic (page through in
  recommended order); the main UI addition is a table-of-contents / topic
  overview entry point, not a new swipe/lock engine — this is a **smaller**
  build than the old story-card proposal, not a bigger one.

## Messages to developer (requests log)

Dated, most recent first. Each entry: what I'm asking for/doing, why, and
what it needs from the schema.

- **2026-09-03 — Vision pivot + all three live topics rewritten to the new
  article format.** Rewrote `data/tenses/tenses.json`,
  `data/modals/modals.json`, and `data/passive-voice/passive-voice.json`
  in place: added a topic-level `overview` object to each, and replaced
  every `lessons[]` entry's old `rule`/`examples`(/`intro`) shape with the
  new `intro`/`form`/`meaning`/`usage`/`examples`(5-8 now)/
  `commonMistakes`/`recap` shape — see "Content schema reference" below for
  field-by-field details. `questions` arrays are **untouched** (owner
  confirmed the question quality was never the problem). This was a full
  rewrite, not additive — old `rule` field no longer exists in these
  files, so if any UI code reads `lesson.rule` or `lesson.intro` alone it
  will need to switch to the new fields. All three files re-validated:
  JSON parses, `lessons`/`questions` category sets match exactly per topic,
  every `overview` has `title`/`body`/`keyPoints`, every lesson entry has
  all seven new fields non-empty. Requesting: build the Eğitim UI against
  this new shape (table-of-contents navigation, no locking, no embedded
  questions — see Vision and Interaction model). This supersedes every
  card/chapter-lock request logged below from before 2026-09-03 — those
  are kept in this log for history, not as live asks.
- **2026-09-03 — Passive Voice content is live**
  (`data/passive-voice/passive-voice.json`, manifest entry added). 24
  questions across 6 categories (Tense Forms in Passive · Passive with
  Modals · Modal Perfects in Passive · Causative Have/Get Something Done ·
  Passive Reporting Structures · By + Agent: Include vs Omit). *(Lessons
  in this file were later rewritten to the new article format — see the
  entry above.)*
- **2026-09-03 — Modals content is live** (`data/modals/modals.json`,
  manifest entry updated, `comingSoon` removed). 24 questions across 6
  confusable-pair/triad categories (Must vs Have to vs Don't Have to · Can
  vs Could vs May vs Might · Must vs Can't vs Might/Could · Modal Perfects
  · Should vs Ought To vs Had Better · Can vs Could vs Be Able To).
  *(Lessons in this file were later rewritten to the new article format —
  see the entry above.)*
- ~~2026-09-03 — Story-card chapter format request~~ — **superseded, see
  Vision above.** Kept for history only; do not build this.
- ~~2026-09-03 — Guided-path chapter framing line (`intro` field)~~ —
  **superseded** by the fuller article schema below; `intro` still exists
  but is now one field among seven per lesson entry, not the whole
  addition.
- ~~Open question about embedded check questions being a reserved
  subset~~ — **moot**, embedded questions are dropped entirely.

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
2. Modals — done
3. Passive Voice — done
4. Conditionals — next
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
Perfect") rather than one isolated form. `questions` still follow the
cloze schema and AI-authoring prompt template already documented in the
README; `lessons` now follow the article schema below instead of the
README's older rule/examples template — the README's lesson-authoring
section is stale and worth updating whenever it's convenient for whoever
owns that file.

## Eğitim/Test interaction model: free navigation, both tabs

**Eğitim = a topic overview + its category articles, in a recommended
order, nothing locked.**

- Opening a topic shows its `overview` first (what this grammar area is,
  in plain terms), then its category articles listed in the order they
  appear in `lessons[]` — that order is the recommended reading order, but
  every article is directly reachable, not gated behind the previous one.
- Each article is the full Form/Meaning/Use/Examples/Common-Mistakes/Recap
  content described below — no embedded questions, no scoring.
- No end-of-topic gate, no next-topic unlock condition. A learner can open
  Conditionals before finishing Modals if they want to.

**Test = open world, unchanged.**

- No gating tied to Eğitim at all, same as before this pivot — any live
  topic's test, or the mixed all-topics test, is selectable at any time.
  Eğitim and Test are now consistent with each other in philosophy (both
  fully open), rather than Eğitim being a locked path against Test's open
  world.

## Content schema reference

What each topic's `data/<topic>/<topic>.json` now contains (see any of the
three live files for real examples):

- **`overview`** *(new, topic-level)* — `{ title, body: string[], keyPoints:
  string[] }`. `title` is short ("Tenses Nedir?"). `body` is 2-3 Turkish
  paragraphs introducing the grammar area from zero — what it is
  conceptually, where Turkish speakers typically trip up, and a one-line
  map of the categories to come. `keyPoints` is 2-3 short takeaway bullets.
- **`lessons[]`** *(per category, replaces the old `rule`/`examples` shape
  entirely)*:
  - `category` — unchanged, must match the `questions` taxonomy.
  - `intro` — one Turkish sentence framing why this pair/triad is
    confusable (kept from the previous schema version).
  - `form` — Turkish-labelled structural formulas for each item in the
    pair/triad (affirmative/negative/question where relevant), e.g. "S +
    V(s/es)" style.
  - `meaning` — a full Turkish paragraph (not one sentence) on what each
    form conceptually communicates and why — this replaces the old, much
    thinner `rule` field.
  - `usage` — Turkish paragraph on contextual cues/signal words that point
    to each form — practical "how to recognize which one" guidance.
  - `examples` — now 4-8 entries (was 2-3), same `{ sentence, note }`
    shape, grouped implicitly by which form they demonstrate.
  - `commonMistakes` — *(new)* array of `{ wrong, right, why }`, 1-2+ per
    category, targeting errors specific to Turkish-speaking learners with
    a Turkish explanation of the fix.
  - `recap` — *(new)* one Turkish sentence closing the article before the
    next one.
- **`questions[]`** — unchanged, same cloze schema as before.

## Status

| Topic | Status |
|---|---|
| Tenses | Live — full article rewrite (24 questions, 6 categories + overview) |
| Modals | Live — full article rewrite (24 questions, 6 categories + overview) |
| Passive Voice | Live — full article rewrite (24 questions, 6 categories + overview) |
| Conditionals | Not started — next up, will use the article schema from the start |
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

## Notes

- Content-language convention is unchanged from the README: Turkish for
  all teaching/explanatory text (`overview`, `form`, `meaning`, `usage`,
  `commonMistakes`, `recap`, `explanation`, `tip`); example/practice
  sentences and category labels stay in English.
- This file, like the rest of the repo's technical/dev-facing files, is in
  English; only learner-facing content (lesson text, question text) is
  Turkish/English per the convention above.

## Open content questions (2026-09-03, from the block conversion)

Two things surfaced while converting the Tenses lessons that are content
decisions rather than code ones, and neither is an assistant's to make.

**`tenses-t19` may be in the wrong category.** "By the time she turned
thirty, she ____ two companies" tests Past Perfect for the earlier of two
past events — which is what *Past Simple vs Past Continuous vs Past
Perfect* exists to teach, and what `t10` and `t12` already test there. It
currently sits in *Perfect Aspects*, so it reaches learners as a check
inside that lesson, and the Perfect Aspects lesson therefore teaches the
rule a second time. Moving it would let Perfect Aspects be purely
Simple-versus-Continuous plus been/gone, and would make the results
screen link a wrong answer to the lesson that actually covers it. Moving
it is a taxonomy change; both categories already exist, so it costs one
edit and nothing else.

**`tenses-t20` is a weak question.** "Have you ____ to Japan before" is
decided by `before` alone, and only `gone` is a tempting distractor — `go`
and `went` are ungrammatical after `have`, so it is effectively a
two-option question. Worth rewriting the next time the question set is
touched.

Three more, from the Modals conversion:

**`modals-t17` has two defensible answers.** "In my opinion, you ____ try
that new bakery downtown", with `should | had better | must | ought to`.
`ought to` is grammatical and natural here and means much the same thing;
the explanation only argues `should` is *more* natural, which is a
preference rather than a rule. An item like that punishes the student who
knows more. Dropping `ought to` from the options costs nothing — `might`
distracts just as well.

**The modal-perfect category name omits a form a quarter of its questions
turn on.** `Modal Perfects: Must Have vs Can't Have vs Should Have`, but
`t16` is entirely `needn't have` versus `shouldn't have`. The lesson
teaches it; the label under-describes the set. Renaming is a taxonomy
change — questions, manifest and lesson move together, and every learner's
progress for that lesson resets — so it is worth doing once, deliberately,
rather than in passing.

**`modals-t20`'s distractor `mustn't have` is not a standard structure at
all.** That is a legitimate way to build a distractor, and the lessons now
say so explicitly in two places, but it is worth knowing it was doing that
work silently before.

Four more, from the Passive Voice conversion:

**`passive-voice-t20` tests something no lesson taught, and may be
miscategorised.** It turns entirely on `be supposed to`, which the article
version of *Passive Reporting Structures* never mentioned in any field.
The block version now teaches it — a `forms` row, an example, a pitfall
and a decision rule — so the gap is closed, but the deeper point stands:
`be supposed to` is an expectation-and-obligation structure that happens
to look passive, not a way of attributing information to an unnamed
source. If the taxonomy is ever re-cut, it belongs with the modals.

**`passive-voice-t21` and `-t23` are style judgements dressed as grammar
items.** "My wallet was stolen by someone on the train" and "The patient
was taken by paramedics to the hospital" are both grammatically perfect;
every option in each is grammatical, so the item rewards guessing which
one the author found natural. `t23` is the one to rewrite — either make
the omitted agent genuinely predictable, or drop the distractor.

**`passive-voice-t15` is effectively three options wide.** Its fourth,
`am`, produces "I always am it painted", which no learner would consider.

**Nothing in the passive set tests Future Passive or Past Perfect Passive
as a correct answer** — they appear only as distractors. The lessons teach
both anyway, because rejecting a form is a skill too, but the question set
has a hole where two of the seven passive tenses should be.

---

Everything above is the owner's call, not an assistant's: each one is
either a taxonomy change (which resets a learner's progress for the
lesson, and has to move questions, manifest and lesson together) or a
rewrite of a question that is currently answerable. None was made.
