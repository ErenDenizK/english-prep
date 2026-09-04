# Drafts

**Shipped 2026-09-04: `closest-meaning`, `connectors`, `quantifiers`,
`relative-clauses`, `gerunds-infinitives`** — 120 questions and 30
lessons, taking the app to 8 topics, 193 questions and 48 lessons. That
is the whole grammar queue: every topic commissioned to close the cloze
gap is now served, and 8 of the paper's 10 blank types are practisable.
Each cleared a blind pass on its items and a sufficiency pass on its
lessons, and every lesson repair went back for an independent re-audit
rather than being trusted — which is the only reason five repair-
introduced defects were caught. Their sections below are kept as the
record of what those passes found.

**Still drafted, not served: the two vocabulary topics.** Neither review
pass has run on either.

Nothing else in here is served. A topic is shipped by putting it in `data/`
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

**Re-audited 2026-09-04: no blocking item in any of the six
categories.** All 24 items get a verdict and it is the key in all 24.
That pass also caught two of the previous repair's five claimed fixes not
landing as reported — a rule reported deleted was still in the file, and
a trap named in a rule that never runs — plus the twin of a defect that
repair had removed: it took out one of two medial `forms` rows that
rebuilt their own items and left the other, which carried the same
auxiliary, the same slot, the key spelled out and a shared content word.
All applied. **Ready to ship.**

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

**Final pass 2026-09-04: 16/16 on all six categories, no blocking
defect.** All four structural changes — a deletion, two reorderings and
an inserted rule — were re-traced against what every rule below them now
sees. That pass also grepped for each deleted string to confirm the
claimed fixes had landed, a habit the connectors round earned, where two
of five had not. **Shipped.**

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

**Lessons: audited, repaired, re-audited, repaired again, third pass
running.** The first audit found four of six categories unshippable, all
one way: twelve signal-shaped rules, eight of them missing the exact
token their own items use. The re-audit cleared five and found one
blocking defect plus three things the repair had introduced — including
five rules and glosses that had been fixed by quoting the very item that
exposed them, two with the blank still in and one ending in an item's
answer. All applied; the third pass is the gate.

## gerunds-infinitives · 24 questions, 6 lessons

**Items: reviewed, one repaired, passed.** `t1` was the blocking one —
*he quietly ____ through it at rush hour* took `refuses to drive` as
readily as `avoids driving`, and *quietly refuses* is the stronger
collocation, because a refusal can be silent and that is what *quietly*
says. Repaired and re-read.

**Lessons: audited, repaired, and independently re-verified twice.**
The audit is kept in full at `AUDIT.md` (732 lines) because it is the
clearest worked record of the failure class this project keeps hitting:
rules written against the lesson's own examples rather than against the
items they have to decide.

Lesson 6 was the worst of it — its first rule sent *was used to* to
`+ V-ing`, while its own category's key is the passive of *use*,
`was used to open`. Lesson 5 was on a different axis from its items
entirely: it taught `for + -ing` only as an object's function, which the
spec calls unkeyable and no item tests, while both of the category's
`for + -ing` keys are preposition-governed complements the lesson never
mentioned, and its first rule actively routed one of them to the wrong
answer. Five lesson examples gave away their own questions.

**Re-verified 2026-09-04: SHIPS.** Lesson 6 traced option by option:
16/16 get a verdict, every key certified, no distractor certified. The
repaired R1 now excludes adverbial `little by little` by name — the
gerunds repair's own defect was an unguarded `by ...` string test that
fired on it, rejecting a key and pointing at its distractor — while
`t24` is still caught because *by whichever assistant opened up* names
who performs the action. That trace also found the fix had quietly
repaired something the audit never recorded: `t21`'s paragraph carries a
bare `by ...` string ("gives directions by the old landmarks") that the
old rule stalled on too.

One residual, recorded rather than fixed and the thinnest margin in the
block: in `t22`, R4 sits above R5 and *have rearranged her week
completely* is change-shaped; R4's parenthetical guard
(*önce zordu, sonra alıştı*) is the whole of what keeps it silent.

One number worth the supervisor's eye, unchanged by the repairs: in 8 of
24 items the key is the only grammatical option, so a student who knows
nothing but *which of these is real English* scores a third without
reading a paragraph. That survives shuffling, and it is concentrated in
categories 4 and 5. It is an argument for the sixth item per category,
not a blocker. **Shipped.**

## academic-verbs and academic-nouns-adjectives · 48 questions, 12 lessons

**Neither pass has run on either topic.** Written 2026-09-04 against
`docs/agents/kickoff-vocabulary.md`, after a learner sitting the Bilkent
paper asked for vocabulary. First content in the app that is not grammar,
and the first to use `optionNotes`, which is mandatory here: every wrong
option is a different word, so one explanation cannot cover three.

Validated against a published prep-school word list: **0 of the 60 target
words appear in its elementary band** (`docs/exam/wordlists/`), so both
topics sit above what that school treats as assumed knowledge. The list
turned out to be **Bilkent's, not YTÜ's** — it came in with the files a
friend sitting the Bilkent exam shared — so read the check as evidence
about Doruk's paper. It says nothing about the owner's.

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
