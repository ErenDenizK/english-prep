# Education Content Notes

This file is the single channel between the curriculum/education-content
side of this project and the technical/dev side — my notes, my requests,
and the material I produce all live here, and nowhere else. I don't touch
`index.html`, `css/`, `js/`, or the live `data/*.json` files; anything I
want built or changed goes through this document for the dev side to pick
up, evaluate, and implement.

Sections: **Vision** (the direction for how Eğitim should feel to use) →
**Messages to developer** (a running, dated request log — read this first
if you're picking up work) → **Curriculum plan** (topic order and content
approach) → **Eğitim/Test interaction model** (guided path vs. open world)
→ **Produced material** (worked examples built for the vision below) →
**Status** (per-topic content progress).

## Vision

Eğitim shouldn't read like a textbook page — it should feel like consuming
a short, tappable sequence of small beats, in the spirit of formats
learners already use daily (Instagram/TikTok Stories is one illustrative
example, not a spec to clone literally): one idea per screen, tap or swipe
to move forward, a visible "how much is left in this chapter" progress
indicator, fast pacing suited to studying in short bursts between other
things — instead of a long scroll of dense paragraph-and-example text.

This is a direction, not a fixed mechanic. Concrete shapes it could take,
for the dev side to weigh:

- **A. Story-card chapters (recommended core).** Each chapter (= one lesson
  category, e.g. "Present Simple vs Present Continuous") becomes a sequence
  of full-bleed cards: hook → rule → example → example → check question →
  feedback → chapter-complete. Tap to advance, small segmented progress bar
  at the top, swipe back to the previous card. See the worked example below
  — this reshapes content I'm already writing, it doesn't require rewriting
  it.
- **B. Path/map navigation (already proposed, keep).** The topic order from
  the curriculum plan below, laid out as a node map (a level per topic).
  Tapping a node opens that topic's story-card sequence (A). This is the
  macro layer; A is the micro layer inside each node.
- **C. Conversational/chat delivery (experiment, not core).** A "tutor"
  character delivers rule/examples as chat bubbles, questions come back as
  chat replies. Mimics messaging apps, but is a bigger build than A+B and
  isn't needed for the guided-path idea to work — flagging it as a later
  experiment, not something to build now.

Recommendation: **B for cross-topic navigation, A for in-chapter content.**
C is optional and lower priority.

Content-authoring principles that follow from this vision (these shape how
I write chapters going forward, independent of whether/when the dev side
builds the card UI):

- One idea per beat/card — a single rule statement, a single example, a
  single question. Already true of the existing `rule`/`examples`/
  `questions` fields; they just need re-chunking into beats, not rewriting.
- Keep each card's text short enough for a full-screen mobile card, not a
  paragraph dump — the existing content (1-2 sentence rules, single-line
  examples) already fits this without changes.
- A distinct visual treatment per beat *type* (rule vs. example vs.
  question) so the learner recognizes at a glance what kind of card they're
  on — a dev-side visual-design decision, noted here so content structure
  and UI design stay aligned.

## Messages to developer (requests log)

Dated, most recent first. Each entry: what I'm asking for, why, and what it
needs from the existing schema vs. something new.

- **2026-09-03 — Passive Voice content is live**
  (`data/passive-voice/passive-voice.json`, manifest entry added). Same
  shape as Tenses/Modals: 24 questions across 6 categories (Tense Forms in
  Passive · Passive with Modals · Modal Perfects in Passive · Causative
  Have/Get Something Done · Passive Reporting Structures · By + Agent:
  Include vs Omit), matching 6-entry `lessons` array, each with `intro`.
  Same validation as Modals passed (JSON parses, category sets match,
  4-option/valid-index/single-blank checks on every question). Noting per
  your last message: I'm not waiting on the Eğitim UI to exist before
  producing content — lessons and questions ship together for every topic
  regardless of what the tab looks like yet; build the guided-path/
  story-card UI against this whenever it's ready, the data shape won't
  need to change for it (see Vision + "Interaction model" above).
- **2026-09-03 — Modals content is live** (`data/modals/modals.json`,
  manifest entry updated, `comingSoon` removed). Same shape as Tenses: 24
  questions across 6 confusable-pair/triad categories (Must vs Have to vs
  Don't Have to · Can vs Could vs May vs Might · Must vs Can't vs
  Might/Could · Modal Perfects · Should vs Ought To vs Had Better · Can vs
  Could vs Be Able To), plus a matching 6-entry `lessons` array. Each
  lesson entry already carries the proposed `intro` field (one short
  Turkish hook line) — it's inert with the current `education.js` renderer
  (extra JSON keys are simply ignored), so this ships safely today and is
  ready to use whenever the story-card UI (see Vision) gets built; nothing
  needs to change in the data when that happens. Validated: JSON parses,
  lesson/question category sets match exactly, every question has 4
  options with `correctIndex` in range and exactly one `____` blank.
- **2026-09-03 — Story-card chapter format (Vision, above).** Requesting
  evaluation of a card-based, tap-to-advance presentation for Eğitim
  chapters (option A in Vision), combined with the path/map navigation
  already requested below. See "Produced material" for a worked example
  built from real, already-shipped Tenses content, showing the reshape
  requires no new question format — only two small additions: a chapter
  hook line and chapter-complete transition copy (both short, easy to
  author alongside existing lesson entries).
- **2026-09-03 — Guided-path chapter framing line.** Proposing a new
  optional `intro` field per lesson entry (one short Turkish sentence) to
  open each chapter before the existing `rule` — see the interaction model
  below. Everything else in that proposal reuses the existing schema.
- **Open question, not decided here:** should the 2-3 embedded check
  questions per chapter be the *same* items also live in the Test pool for
  that category, or a distinct reserved subset (so a learner doesn't see an
  identical question twice between Eğitim and Test)? If a reserved subset
  is wanted, I'd write slightly more questions per category going forward
  (e.g. 6 instead of 4, 2 marked for embedding) — worth deciding before
  more topics are authored, since it changes how much per-category content
  I produce. Locking/completion logic, progress storage, and the actual
  card/map UI are dev-side calls entirely; I'm not proposing an
  implementation for any of them.

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

## Eğitim/Test interaction model: guided path + open world

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
  existing `explanation`/`tip` fields. (This is exactly the card sequence
  in Vision's option A.)
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

## Produced material

Worked example: how one already-shipped chapter reshapes into story cards
(Vision, option A), using the real, already-authored Tenses content —
nothing invented except the two short new lines marked *(new)*.

**Topic: Tenses → Chapter: "Present Simple vs Present Continuous"**

1. **Hook** *(new — one line)*: "Elif'in her sabah aynı bir rutini var —
   ama bu sabah bir şey biraz farklı."
2. **Rule** (existing `lessons[0].rule`): "Present Simple; alışkanlıkları,
   rutinleri ve genel gerçekleri anlatır. Present Continuous ise şu anda
   veya bu aralar devam eden eylemleri anlatır."
3. **Example card**: "She goes to the gym every morning." — *Alışkanlık →
   Present Simple*
4. **Example card**: "She is going to the gym right now." — *Şu an oluyor
   → Present Continuous*
5. **Check question** (existing `questions[tenses-t1]`): "Every morning,
   Elif ____ to the university library before her first class starts..." —
   4 options, instant feedback using the existing `explanation` + `tip`.
6. **Check question** (existing `questions[tenses-t2]`): "Please don't
   interrupt him right now — he ____ on a very tight deadline..." — same
   pattern.
7. **Chapter complete** *(new — one line)*: "Bölüm tamamlandı ✅ Sıradaki:
   Present Perfect vs Past Simple."

Seven cards, five of them pulled verbatim from `data/tenses/tenses.json`
with zero rewriting — only the hook and the completion line are new, and
both are trivial to write alongside each chapter going forward. This is
the pattern I'll follow when preparing chapter material for every future
topic, so the dev side can build the card UI against a consistent shape.

## Status

| Topic | Status |
|---|---|
| Tenses | Live (24 questions, 6 categories) |
| Modals | Live (24 questions, 6 categories) — includes `intro` per lesson |
| Passive Voice | Live (24 questions, 6 categories) — includes `intro` per lesson |
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

## Notes

- Content-language convention is unchanged from the README: rule,
  explanation, and tip text is in Turkish; example/practice sentences and
  category labels stay in English.
- This file, like the rest of the repo's technical/dev-facing files, is in
  English; only learner-facing content (lesson text, question text) is
  Turkish/English per the convention above.
