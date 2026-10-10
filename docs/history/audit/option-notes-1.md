# Option notes — `closest-meaning` and `connectors`

Written 2026-09-04. Two files touched, both under `data/`:
`data/closest-meaning/closest-meaning.json` and
`data/connectors/connectors.json`. Nothing else.

## What was written

**144 notes: every wrong option on all 48 items** (24 restatement + 24
cloze), three per item. Longest note is 144 characters, average 116.
`npm run format && npm run check` is clean — 0 errors, 0 warnings,
including the validator's key-set, correct-answer and length
rules for `optionNotes`.

Method, per the brief: read the item's paragraph or sentence, its key,
its `explanation`, its `tip` and the lesson for its category, then
substitute each wrong option and write the belief that would make it
look right and the property that defeats it. Because
`js/feedback.js` shows **only** the note for the option actually chosen,
each note stands alone and never assumes the learner has read the other
two.

The two topics needed different notes, and the split held:

- `closest-meaning` notes name **what changed in meaning** — a role
  swapped, a condition dropped, a certainty softened, an event re-timed,
  a scope overshot. They use the lessons' own Turkish vocabulary
  (koşul/sonuç takası, kutup, kesinlik, üstün taraf, aktarım, kaynak)
  rather than the English move names in the `decision` blocks.
- `connectors` notes name the **one** thing that rules the option out
  here — usually the relation, sometimes the syntax — and never recite
  both.

## Findings about the items

**1. `connectors-t8` is a syntax-only item, and its three distractors
are one distractor.** `however`, `nevertheless` and `on the other hand`
are all excluded by the same fact: they are adverbs (or an adverbial
phrase) and the blank joins two independent clauses with a comma. None
of them is wrong about the *relation* — `however` in particular is a
perfectly good relation for this pair of clauses. So the three notes say
close to the same thing, and they can only repeat what the item's own
`tip` already says, since that tip names all three options outright. The
item still teaches the right lesson (word class decides), but it is the
one place in these 48 where per-option notes add nearly nothing.

**2. `connectors-t3`'s `Moreover` is the softest distractor in either
topic.** The paragraph gives ferries stopping at force seven, then a
cable car stopping at the same strength. `Likewise` is clearly better —
new subject, same behaviour, and `both operators` marks the parallel —
but a competent teacher reading `Moreover` there would not call it an
error: it can add a further fact about the same topic (bad-weather
stoppages) even when the subject changes. My note argues the honest,
narrower point (the subject changes and the second clause says nothing
about the ferries), not that `Moreover` is ungrammatical. The same
softness exists in weaker form for `Moreover` in `connectors-t2`. If
either item is ever revised, the fix is to make the second sentence
carry an explicitly *parallel* structure (as t2 nearly does with "almost
exactly the same fortnight") so that `Moreover` reads as under-informative
rather than merely less apt.

Every other distractor across both topics had an honest, nameable reason
— a wrong relation, a wrong word class, a swapped role, a moved event, a
dropped condition, a changed certainty, or information the source
sentence does not contain.

## Where existing text needed care

No `explanation` or `tip` contradicts a note. Three places where I had to
write around the existing wording rather than with it:

- **`closest-meaning-t14`** — the explanation calls the Saturday sales
  "olup biten bir satış", but the sentence is a habitual present ("On
  Saturdays the new shop sells…"). The defect in option `The new shop is
  expected to sell…` is that it turns a stated regularity into a
  prediction, so the note says "düzenli olarak olanı bildiriyor" rather
  than repeating "olup bitmiş". Not a contradiction; a wording nit in the
  explanation.
- **`connectors-t8`** — as above, the tip already names all three wrong
  options, so the notes cannot tell the learner anything the tip will not
  tell them two lines later.
- **`closest-meaning-t11`** — the distractor `No volunteer reported…so
  the sponsor stopped the trial in order to save money` breaks two things
  at once (it hardens `may have` into fact *and* turns the concession
  into a cause). The note leads with the modality, because that is what
  the lesson's decision procedure fires on first; the causal flip is
  named second, inside the same sentence.

## Not done here

Nothing was added to the other six live topics. A parallel session
covered `gerunds-infinitives` (`docs/audit/option-notes-3.md`); the
remaining topics still have no `optionNotes`.
