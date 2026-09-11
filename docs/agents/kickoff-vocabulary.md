# Kickoff — vocabulary, two topics

The taxonomy is fixed here and is not an author's to change. It is the
one thing the question author and the lesson author must agree on, and
it is what the results screen uses to send a wrong answer to the lesson
that teaches it.

This exists because a learner sitting the Bilkent paper asked for it:
*"gramer modundan memnun, bir de vocab olsa"*. It is the first content
in the app that is not grammar.

## The one design decision everything else follows from

**The unit is a semantic set, not a word.** `docs/research/vocabulary.md`
§2.2 argues it and the argument is short: the exam's vocabulary blank is
four same-part-of-speech words from one neighbourhood, one of which the
paragraph selects. Author against a word *list* and you pick `emerge`,
then have to invent three distractors — and the honest ones are its
neighbours anyway. Author against a **set** and you get four items from
one context bank, every option in every item is a real candidate, and
the lesson writes itself as a `contrast`.

It also produces a category name of exactly the shape the taxonomy
already uses. `question-author.md`'s own worked example is `Deduction &
Certainty (must be / can't be / might be)`. A vocabulary category is
`Change & Emergence (emerge / evolve / shift / decline / fade)` — same
shape, same job.

## The band, and what is out of scope

In, because the paper samples it (`docs/exam-spec.md`, and
`docs/research/vocabulary.md` §1.3):

- the academic core — AWL / AVL territory
- mid-frequency general abstract vocabulary (`gratitude`, `devastate`)

Out, each for a reason, and **not** an author's call to reopen:

- **phrasal verbs** — not one item on either sample paper, and they
  average 5.6 senses, so an item keyed on one sense is arguable
- **collocations** — not on the paper, and they fail rule 2 outright:
  the three wrong options break no rule and the explanation can only say
  *"bu böyle söylenir"*
- **technical / subject vocabulary** — the texts are general-interest
- **K1–K3 in their core senses** — the learner has them
- **word formation** — there is not one item on either paper. Show the
  family in a `forms` block if it helps; do not build a category on it.

## Topic 1 · `academic-verbs`

```
Topic id:      academic-verbs
Topic title:   Academic Verbs
Tier:          vocabulary
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `Change & Emergence (emerge / evolve / shift / decline / fade)`
2. `Cause & Consequence (trigger / prompt / undermine / reinforce / accelerate)`
3. `Claim & Concede (assert / imply / concede / dispute / acknowledge)`
4. `Examine & Establish (assess / determine / verify / estimate / monitor)`
5. `Sustain & Restrict (maintain / preserve / restrict / suspend / abandon)`
6. `Allocate & Withhold (allocate / distribute / assign / withhold / retain)`

## Topic 2 · `academic-nouns-adjectives`

```
Topic id:      academic-nouns-adjectives
Topic title:   Academic Nouns & Adjectives
Tier:          vocabulary
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `Scale & Extent (extent / scope / magnitude / margin / threshold)`
2. `Evidence & Inference (evidence / indication / assumption / implication / consensus)`
3. `Certainty & Doubt (apparent / plausible / questionable / conclusive / tentative)`
4. `Significance & Priority (crucial / substantial / marginal / negligible / considerable)`
5. `Constraint & Requirement (constraint / obligation / provision / criterion / exemption)`
6. `Stance & Disposition (reluctant / deliberate / cautious / persistent / indifferent)`

Every member of a set shares one part of speech. That is not a stylistic
preference: an option of a different word class is eliminable on
grammar, which makes it a dead option and the item a three-way choice.

---

## Rules that are new for this content type

**1 · `optionNotes` is mandatory, and must cover all three wrong
options.** This is the type the field was built for
(`docs/CONTENT_GUIDE.md`). For a grammar item one explanation is enough
because the other two options usually fail for the same reason. Here
every wrong option is a different word, and the learner who chose
`gratitude` needs to be told what `gratitude` means — not what the other
two mean. One short Turkish gloss each: what it means, and why this
paragraph does not select it. Under 160 characters.

**2 · All four options must sit in the same frequency band.** The sample
paper's weakest blank is weak because one option is a word the learner
may simply never have met, which makes "I don't recognise it" a surface
cue. An option nobody recognises is a dead option in a new costume.

**3 · The paragraph must select the key, and the selection must be
nameable.** Not "the key sounds better here". Something in the context —
a time relation, a polarity, a cause, an object the verb takes, a
quantity — makes exactly one of the five candidates true and the rest
false or off-target. If you cannot name it in the explanation, the item
is not finished.

**4 · Four of the five set members are keyed across the category's four
items; the fifth appears only as a distractor.** Every member must
appear as a distractor at least once, so no member can be chosen or
eliminated by familiarity alone.

## Rules that carry over unchanged

Everything in `docs/agents/question-author.md` and
`docs/agents/curriculum-author.md`, and in particular the two that were
written because a review found them:

- **A question is never built on a sentence from its own lesson.**
  `check` blocks draw from the same category's questions, so the learner
  would meet the answer three blocks above the question. This has bitten
  this project in five of the last six topics — check it before you
  hand the file over, by comparing every English sentence in your
  lesson against every paragraph in its category.
- **An option a competent teacher would accept is a wrong option**, not
  a less natural one. For vocabulary this is the whole game: if two of
  your five set members are both true of the paragraph, the item is
  broken however clearly you meant one of them.

## What both authors must do

- Fill in §1–§6 of `docs/agents/category-spec.md` for your topic before
  writing items, and hand it over with the content.
- Run `tools/content-checks.mjs` over your own set before you deliver.
- Write a coverage ledger: which set member is keyed where, which
  appears only as a distractor, and — the honest half — every item you
  rejected because two options were both acceptable, with the reason.
