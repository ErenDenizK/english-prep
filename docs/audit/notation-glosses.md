# Notation glosses — clearing the `V2` / `V3` backlog

2026-09-05. Scope: the sixteen `uses V3/V2 N time(s) and never says what
it means` warnings `npm run validate` reported across five topics. Every
one of them is now written. **The backlog is 0**, and `CEILING` in the
notation-backlog test of `tests/content-checks.test.js` has been lowered
from 16 to 0.

Nothing else was touched: no question, no code, no schema. The two
pre-existing warnings — the shared option set in
`academic-nouns-adjectives`, and the 181-character `roadmap.json` detail
— are still the only warnings the validator reports.

## What a gloss had to do here

`CLAUDE.md`'s "Who this is for": the learner has the competence and not
the label. They say *I have gone* correctly and have never seen `V3`
written down. So each of these sentences names the form in Turkish,
puts the abbreviation beside it, and proves it with verbs whose third
form is not the second — because `V3 = -ed` is the exact equation
`passive-voice` writes a pitfall to break.

Fourteen lessons were warned about (two of them for both tokens).
Thirteen needed a gloss written; the fourteenth was better served by
taking the notation out — see below. Thirteen copies of one sentence
would be worse than none, so each is written to the lesson it is
in — different verbs, and a different thing being said about the form:
what stays fixed while the modal moves, what the learner already builds
in Turkish, where the regular and irregular columns diverge, which of
the two forms the result clause turns on.

## Where each one went

At the point of use, meaning the block the notation first appears in or
the block immediately before it. Five went into prose that was already
there; six are a new `text` block set directly above the `forms` table
it explains; two are `contrast` glosses in a side whose own label
carries the token.

| Lesson | Home | The sentence, in short |
| --- | --- | --- |
| `tenses` › Present Perfect vs Past Simple | new `text` before `forms` | the two columns of the irregular list — went/saw/took against gone/seen/taken |
| `tenses` › Past Simple vs Past Continuous vs Past Perfect | new `text` before `forms` | *gitmişti* is one word, English needs two, and the second is never `V2` — there is no *had went* |
| `tenses` › Perfect Aspects | new `text` before `forms` | two of the three patterns share `V3`; the Continuous takes `been + V-ing` instead |
| `tenses` › Time Expressions & Signal Words | new `text` before `forms` | both tokens: know / knew / known, three forms that separate |
| `passive-voice` › Passive with Modals | existing `text[0]` | the modal is the only part that inflects; `be` and `V3` never move |
| `passive-voice` › Modal Perfects in Passive | existing `text[0]` | *gönderilmiş olmalı* — you already build this |
| `passive-voice` › Causative | existing `text[0]` | `cut, taken, broken`, next to the lesson's own *I had my hair cut* |
| `passive-voice` › Passive Reporting Structures | new `text` before `forms` | `V3` stands in two different slots here; the reporting verb, and again for an event that came earlier |
| `passive-voice` › By + Agent | existing `text[0]` | the mis-taught chunk `be + V3 + by`, opened up mid-sentence |
| `closest-meaning` › Third Conditional vs Mixed | new `text` before `forms` | `V3` against bare `V`, which is the whole difference in the result clause |
| `closest-meaning` › Passive Reporting | existing `text[0]` | the same form as in Passive Voice, which this lesson already sends the reader back to |
| `connectors` › Time & Sequence | `contrast` gloss for *By Then* | glossed inside the side that already said `had + V3` |
| `gerunds-infinitives` › Causative Verb Patterns | `contrast` gloss for *have + something + V3* | the side's own label carries the token; the gloss now names it |

## What I judged as "remove rather than gloss"

Three `forms` rows across two `connectors` lessons — all of them places
where verb-form shorthand had wandered into a topic that is not about
verb forms.

**`Result vs Purpose` — the one `V3` in the topic, removed.** The row
existed to show *therefore* sitting between an auxiliary and the main
verb, and it made that point through a perfect: `S + have/has +
therefore + V3` / *The board has therefore raised the fee.* The
participle was carrying nothing the row was teaching. It is now `S +
will + therefore + V` / *The board will therefore raise the fee.* —
same position, same lesson, one fewer notation to explain. That lesson
now uses no verb-form shorthand at all.

**`Time & Sequence` — `V2` removed, `V3` kept and glossed.** The two
rows read `Meanwhile, + S + V2` and `Subsequently, + S + V2`; they now
read `Meanwhile, + S + Past Simple` and `Subsequently, + S + Past
Simple`. In a connectors lesson the useful fact is *a full clause
follows, in the past simple* — a form name the reader has met in
`tenses` and can read straight off, where `V2` has to be decoded first.

`had + V3` in the same table stayed. It is the Past Perfect's signature,
this lesson's `pitfall` and its `decision` block both turn on it, and
spelling it out four times would cost more than it explains. It is
glossed once, in the *By Then* side that introduces it.

The other twelve keep their notation for the same reason: `If + S + had
+ V3, S + would have + V3` is readable *because* it is shorthand, and
the same line with "past participle" twice is not.

## Two claims I had to walk back

Both were mine, both caught on a second read against the corpus rather
than by any check, and both are the failure `CLAUDE.md` names — a rule
stated too absolutely, which this learner's ear breaks first.

- In `Time Expressions & Signal Words` I first wrote that *since* and
  *for* call for `have/has` and the third form. The lesson's own
  `decision` block says otherwise: a period that closed in the past
  takes Past Simple, *for* and all. The sentence now says only what the
  table below it shows.
- In `Perfect Aspects` I first called `V3` "the part every perfect
  shares". Present Perfect Continuous is in that lesson and has no `V3`
  in it. It now says two of the patterns share it and names what the
  third takes instead.

A third was inaccurate rather than absolute: in `Passive Reporting
Structures` I first glossed `V3` as the reporting verb's third form,
which is true of `It + be + V3 + that` and false of `S + is reported to
have + V3`, where the second `V3` belongs to the reported event. The
sentence now names both slots.

## The giveaway count did not move

Adding prose to a lesson is exactly how a lesson comes to contain a
question's keyed sentence, so `checkLessonGiveaway` was run over the
whole corpus before and after, at the shipped six-word threshold and at
three.

| | before | after |
| --- | --- | --- |
| threshold 6 (shipped) | 0 | 0 |
| threshold 3 | 39 | 39 |

At three the two sets are not merely the same size — they are
identical, line for line (`diff` clean). Nothing I wrote reaches even a
three-word run against a question, which is what the drafting rule was
for: the English inside these glosses is bare verb forms in lists
(`went, saw, took`), never a sentence. The one place I nearly broke it
was `had gone, had written, had left` in the Past Perfect gloss; it
survives because a run needs three *consecutive* shared words and those
pairs are comma-separated.

## Ready to become an error, but not by me

`checkNotationGlossed` now reports nothing across all sixty lessons, and
the ratchet in `tests/content-checks.test.js` holds it at zero, so a new
unglossed `V2` or `V3` fails the test. Promoting the check itself from
`report.warn` to `report.error` in `tools/content-checks.mjs` would make
it fail CI instead, which is where it belongs once the corpus has held
at zero for a while. **That is a supervisor decision and I have not made
it.**

## Left undone

- **`V1` is still unused and still undefined.** The check's own comment
  notes the corpus uses two thirds of a three-part system. Two of the
  new glosses now name all three forms in passing (*know / knew /
  known*), which is as close as this pass came; nothing writes `V1`, so
  nothing needs it.
- **The gloss regex accepts `past participle` as well as `üçüncü
  hâli`.** `Tense Forms in Passive` — the one `passive-voice` lesson
  that was never warned about — passes on the English term: *fiilin
  **V3** (past participle) hâli*. That is metalanguage this learner is
  no likelier to have met than `V3` itself, and its pitfall does the
  same for `V2`. It is not a warning and I did not touch it, but it is
  the lesson to look at first if the check is ever tightened.
- **`npm run verify` was not run** — it needs a browser and a running
  server. The five new blocks are ordinary `text` blocks in the middle
  of existing lessons, so the risk is length rather than layout, but the
  sweep has not confirmed it.
