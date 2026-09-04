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

`npm run draft` is clean on five of the seven topics below, and the two
warnings it does leave are explained where they occur. Either way it says
only that the files are well formed and the taxonomy lines up. It says
nothing about whether the teaching is right, which is what the two review
passes are for — and which is why every topic here is still here.

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

**Independently re-verified 2026-09-04: SHIPS.** No rule fires on a key;
all twelve distractors fire a rule before the last one; `Same meaning`
certifies exactly one option per item and it is the key in all four. Each
key survives on a guard doing real work — the emphasis-word clause, the
voice-only clause, the fewer-words clause — and the deleted tail turned
out not to be load-bearing for any key, so removing it closed the
contradiction with the rule above it without opening a gap.

That pass also found the string-quoting anti-pattern only half closed:
the previous commit de-quoted one rule and left two others quoting
verbatim strings from their own items. An illustration lifted from a live
item goes stale silently the moment that item is reworded, which is how
the last two regressions happened. Both now state relations only.

One residual, recorded rather than fixed. Read from memory rather than
from the page, four rules would each eliminate a key — the sharpest is
the role-swap rule, because two keys restate by passivising the reporting
verb and that moves the reported party into subject position, which *is*
the operation the items test. It is mitigated by adjacency: the voice-only
carve-out sits one line above it. No rule is unusable without its guard.

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

**Examples repaired 2026-09-04.** The same audit found the lessons
handing over their own answers: category 5 gave away three of its four —
one example shared subject noun, verb, participle and adverbial slot with
a key and labelled the answer in its note, and the `forms` block carried
the exact full-versus-reduced pair another item tests, with that item's
keyed verb. Category 6 was worse in a quieter way: every option shape in
the category appeared in the prose beside the rule that decides it.

Fixed by replacing the English, not the teaching — every rule is still
demonstrated, every contrast still has both sides, the Turkish notes were
re-pointed rather than deleted, and the replacements are short and
abstract so the question author's concrete scenarios cannot collide with
them. Measured over 588 lesson-string against own-category-paragraph
pairs: max content-word Jaccard 0.087 → 0.056, shared word trigrams 0,
and key-echoes — a lesson string carrying that question's answer *and*
sharing a content word with its paragraph — 17 → 5. All five remaining
are `the reason why`, where "reason" is the antecedent the rule keys on
and the pattern cannot be taught without it.

That pass also caught a 400-character text block pushed over the limit by
the rule repair before it, which meant the topic could not have shipped
at all.

**Needs:** a sufficiency re-run. The decision rules were repaired and
have not been checked since, and on this project's record an unaudited
repair is where the next defect comes from.

## quantifiers · 24 questions, 6 lessons

**Items: reviewed 2026-09-04, SHIPS on all six categories.** Nothing
blocking, no miskey, and — the number the pass exists for — **no item
with a second answer a competent teacher would accept**, on a properly
blind file this time. That is unusually clean for quantifiers, and it is
the spec's honest bounds working: `a lot of` never appears in an
affirmative list beside `plenty of`, `much` never meets `a lot of` under
negation, `some`/`any` is never keyed inside a question, and `each`/
`every` is keyed only where the grammar forces it.

Two things recorded rather than fixed. `t13` and `t17` are a near-
duplicate the automated check cannot see — two pieces of infrastructure
broken by weather, users taking the longer route, keyed `both` and
`neither`; trigram overlap is under 8%, so `checkNearDuplicates` will
never flag it. And two categories test structure where their names
promise meaning: a learner can score 4/4 on *Each vs Every* while still
believing the two are semantically identical, and *Much vs A Lot Of*
never puts `plenty of` against `a lot of` at all. Neither is an item
defect; both are things the lessons must not promise.

**Lessons: sufficiency audit running.**

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

## academic-verbs and academic-nouns-adjectives · 48 questions, 12 lessons

**Neither pass has run on either topic.** Written 2026-09-04 against
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
