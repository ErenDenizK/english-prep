# Drafts

Nothing in here is served. A topic is shipped by putting it in `data/`
and in `data/manifest.json`, which is what `tools/ship-topic.mjs` does —
and it will happily ship content that failed both review passes, so the
state of each topic is recorded below rather than inferred from the
files being present.

The pipeline, in order:

```bash
npm run draft -- docs/agents/drafts/<topic>                       # schema + taxonomy
npm run blind -- docs/agents/drafts/<topic>/questions.json <dir>  # unkey for review
#   → a blind pass on the items, and a sufficiency pass on the lessons
node tools/ship-topic.mjs <topic> && npm run format && npm run check
```

`npm run draft` is clean on all five topics below. That says the files
are well formed and the taxonomy lines up. It says nothing about whether
the teaching is right, which is what the two review passes are for.

---

## closest-meaning · 24 questions, 6 lessons

**Items: reviewed and passed.** Five blind passes, 120/120 on the
author's keys, explicit *ship*.

**Lessons: repaired seven times, and the last three rounds each found a
defect introduced by the round before it.** Every round ran the closing
`decision` block as a literal checklist over its own category's items.

The last one is the reason this is still here. It found that the repair
had reproduced the defect it was repairing, one rule further down: the
round before had removed a rule whose worked example was `"earlier" →
"later"` — fatal because a key rewrites *weeks earlier than the protocol
allowed* to *weeks early* — and in the same commit gave the confidence
rule the example `"only rumoured"`, where a different key rewrites *It is
only rumoured that …* to *is rumoured to …*. Same shape, same category,
one rule apart.

Both carve-outs now state a relation instead of quoting a string, and one
that contradicted another rule four lines above it was deleted rather
than reworded. Traced by hand afterwards: no rule fires on a key, and
`Same meaning` certifies exactly one option per item, always the key.

**That hand-trace is not an independent pass, and on this block's
history a hand-trace is not enough.** One clean independent
re-verification and it ships.

One residual, recorded rather than fixed: read from memory rather than
from the page, the interior-change rule's headline ("the inside of the
reported clause changed → Reverse") would eliminate three keys, and the
exemption that saves them is the rule's second sentence.

## connectors · 24 questions, 6 lessons

**Items: reviewed, three repaired, passed.** Two had a second defensible
answer — a second region behaving the same way is a further point as well
as a parallel, so `Moreover` was as good as `Similarly`; and two events
sharing an afternoon does not forbid reading them in sequence. One
garden-pathed on *a fifth* two clauses after *four*.

**Lessons: reviewed and repaired; not re-reviewed.** Three did not ship
as written. Two failed the same way: the syntactic gate — an adverb
cannot join two clauses with a comma — was written last, so a learner
working the list top to bottom never reaches it, and on one item the
procedure certifies `however`, a distractor, on the item built to reject
it. Four claims about English were untrue, two of them firing on their
own category's keys (`by then` does not require *had + V3*; `above all`
need not pick out an already-listed item).

**Needs:** a sufficiency re-run over the repaired lessons.

## relative-clauses · 24 questions, 6 lessons

**Items: reviewed, one second defensible answer in twenty-four** — a good
result, and the direct consequence of the spec's honest bounds (no
defining `that` vs `which`, no object `who` vs `whom`, no zero relative,
no stranding on offer). The one that got through is lesson-side.

**Lessons: four of six did not ship; rules repaired, not re-reviewed.**
One failure repeats: rules written as surface-position tests ("if there
is a preposition immediately before the blank", "if `of` is immediately
before the blank") are false on the shapes the items use, because the
preposition is inside the option in three of four preposition items and
in all four quantifier items. Twelve of twenty-seven rules fired on
nothing in their own category.

**Still open, and it is the bigger half:** the same audit found the
lessons hand over their own answers. Category 5's `examples` block gives
three of its four questions away — one example shares subject, verb,
participle and adverbial slot with a key and labels the answer in its
note. Categories 2, 3 and 6 do the same more weakly. `check` blocks draw
from the same category's questions, so the learner meets the answer a few
blocks above the question. This needs new English example sentences, not
new rule conditions, and it is not started.

## quantifiers · 24 questions, 6 lessons

**Neither pass has run.** The blind review and the lesson-sufficiency
audit both died on the session rate limit before producing anything.
The author's own self-check is clean and the twelve items it rejected for
having two acceptable answers are logged in `docs/agents/quantifiers-spec.md`
§7 — which is a good sign and is not a review.

## gerunds-infinitives · 24 questions, 6 lessons

**Items: reviewed. One blocking, and four more that are lesson-side.**
`t1` has two defensible answers: *he quietly ____ through it at rush
hour* takes `refuses to drive` as readily as `avoids driving`, and
*quietly refuses* is the stronger collocation — a refusal can be silent,
which is what *quietly* says.

Lesson 6 tells the learner to answer `t24` wrongly: its first rule sends
*was used to* to `+ V-ing`, and that item's key is the passive of *use*,
`was used to open`. Lesson 5 is on a different axis from its own items —
it teaches `for + -ing` only as an object's function, which the spec
itself calls unkeyable and which no item tests, while both of the
category's `for + -ing` keys are preposition-governed complements the
lesson never mentions. Its first rule actively routes one of them to the
wrong answer. Five lesson examples give their own questions away.

**Lessons: audit did not run** (rate limit). Nothing repaired yet.

One number worth the supervisor's eye: in 8 of 24 items the key is the
only grammatical option, so a student who knows nothing but *which of
these is real English* scores a third without reading a paragraph. That
survives shuffling. It is concentrated in categories 4 and 5.

## academic-verbs · 24 questions, 6 lessons
## academic-nouns-adjectives · 24 questions, 6 lessons

**Neither pass has run.** Written 2026-09-04 against
`docs/agents/kickoff-vocabulary.md`, after a learner sitting the Bilkent
paper asked for vocabulary. First content in the app that is not grammar,
and the first to use `optionNotes`, which is mandatory here: every wrong
option is a different word, so one explanation cannot cover three.

Validated against the school's own published word list: **0 of the 60
target words appear in its elementary band** (`docs/exam/wordlists/`), so
both topics sit above what the school treats as assumed knowledge.

`npm run draft` leaves one warning on each, and **both are forced rather
than careless.** Each category is five words and each item shows four, so
there are only five possible option sets — and in these two categories one
member cannot be shown at all:

- *Cause & Consequence*: `trigger` and `prompt` are interchangeable with
  an event object (`triggered / prompted an independent survey`), so
  neither item keyed on one may show the other. Both must therefore omit
  `trigger`, and two items land on the same four options.
- *Significance & Priority*: `marginal` is defensible wherever
  `negligible` is, so it cannot enter either of those items. Same
  arithmetic, same collision.

The alternative in both cases was to weaken a distractor that is doing
real teaching — `negligible` is the *named* closest trap in its item's
explanation, and the whole point of that item is that a quantity can be
negligible while its consequence is not. Recorded rather than fixed.

One thing was fixed: `eleven` was the arbitrary quantity in six of the
nouns/adjectives paragraphs — votes, lira, flats, days, per cent, years.
An author's tic rather than a defect in any item, but six of them in one
session reads as one voice. Only the numerals changed; the arithmetic in
every paragraph still holds. `years` remains at 4/24, which is four
ordinary time spans rather than a rut.

---

## What the reviews cost, and what they caught

Across five topics the two passes found, between them: one item with two
defensible answers per twelve written, and roughly one untrue claim about
English per lesson. Neither number is going down on its own, and both are
invisible to `npm run draft` — which is the argument for the passes, and
the reason a topic that has not had both is not shippable however clean
its files look.
