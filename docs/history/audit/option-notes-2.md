# `optionNotes` — Quantifiers and Relative Clauses

2026-09-04. Scope: `data/quantifiers/quantifiers.json` and
`data/relative-clauses/relative-clauses.json` only. Nothing else was opened
or changed.

**144 notes written** — three per item, on all 48 items, covering every wrong
option. No note on any key. Longest is 144 characters; the bulk sit between
80 and 120. `npm run format && npm run check` clean, `validate` reports 0
errors and 0 warnings across the whole corpus.

Every note is written for the one reader who will ever see it: `js/feedback.js`
shows only the note for the option that was actually chosen, so each one is a
standalone sentence addressed to the learner who believed *that* word, and none
of them assumes the other two have been read.

## What the notes say, by topic

**Quantifiers.** The lessons run the decision through two gates in order —
is the noun countable, and what is the polarity of the clause — and each note
names the one gate its option actually fails, not both. So `little` beside a
plural noun is a countability note and says nothing about sufficiency;
`a few` beside `few` is a sufficiency note and says nothing about countability
(`Sayılabilir isim doğru ama baştaki 'a' onu olumlu yapar`). Where the option
is well formed and only the paragraph rules it out — `most of` in t22,
`either` in t20, `all` in t24 — the note argues the paragraph, and says so.
The close pairs the lessons themselves treat as close (`a few`/`few`,
`a little`/`little`, `much`/`a lot of`) are always given the half that
differs, never a manufactured second fault.

**Relative clauses.** Every note names one of the two things the topic turns
on: what the antecedent *is* (`İnsan öncüller içindir; buradaki öncül bir
kovan`), or what job it does inside the clause (`Ardından sahip olunan bir
isim bekler; burada arkasından yan cümlenin öznesi geliyor`). The lesson's
own vocabulary is used throughout — *öncül*, *ilgi zamiri*, *yan cümle*,
*çatı*, *ortaç*, *niceleyici*.

Two traps the brief named were avoided, and are worth recording as avoided:

- **No note excludes `that` because it is `that` rather than `which`** in a
  defining clause. The four notes that rule `that` out do it on the grounds
  the spec does teach — after a comma (t4, t5, t7), after a preposition
  (t15, t16), or because it cannot take a following noun (t3).
- **No note calls `whom` old-fashioned or wrong-in-modern-English.** In t1
  and t2 it is excluded because the slot is a subject or a possessor; in t13
  and t22 the wrong option is `for who` / `both of who`, and the note says
  the preposition is what bars `who`, which is the same rule from the other
  side.

## Items where a distractor is only weakly excluded

Four. A note was written for every one of them — none was impossible — but in
each case the exclusion rests on something narrower than the rule the item is
testing, and the supervisor may want to look at the item rather than the note.

- **`quantifiers-t19`, `each`.** *"the board did not accept each tender"* is
  neither ill formed nor absurd; it is only unmotivated. The item's own
  explanation says `each` *"tekliflerin tek tek ele alınıp onaylandığını ima
  ederdi"*, but under a negated verb that reading is not straightforwardly
  available, so the explanation overstates its case. The note hedges to what
  is defensible: `each` forces a one-by-one reading that goes blurry beside a
  negative verb. This is the softest exclusion in either topic.
- **`quantifiers-t9`, `much`.** Excluded by a collocation — *hardly much* is
  not said — rather than by a rule. `much` is otherwise licensed in exactly
  the negative-polarity environment `hardly` creates, so this distractor
  fails on a narrower fact than the item is about, and it is the weakest of
  the three in that set (`no` and `some` both fail on polarity, which is what
  the item teaches).
- **`quantifiers-t14`, `each`.** The only thing ruling it out is that
  *almost / nearly / practically* combine with `every` and not with `each`.
  That is true and it is what the lesson teaches, but it is a fact about three
  adverbs rather than about `each`, so a learner who chose it has not made the
  countability or polarity error the topic is built on.
- **`relative-clauses-t19`, `to employ`.** *"a textile company to employ
  nearly four hundred weavers"* is readable as a purpose or destined-use
  phrase; what actually blocks it is `at the time`, which pins the clause to a
  state holding while the streets were built. The note argues that, but the
  exclusion comes from an adverbial rather than from the `-ing` / V3 system
  the item tests.

Separately, and not a defect: the *Quantifier + Relative Pronoun* set uses the
same comma-splice distractor four times (`some of them`, `both of them`,
`none of them`, `all of them`). Each is honestly excluded, but the four notes
necessarily say the same thing, and a learner who works the category in one
sitting will read it four times.

## Where an existing `explanation` or `tip` had to be sharpened

No note contradicts its item. Three places needed care, and all three are
findings about the shipped text rather than about the notes.

1. **`relative-clauses-t18`, `waited`.** The explanation says the third form
   *"kısaltmada edilgen anlam verir ve ailelerin beklendiğini söylemiş
   olur."* `wait` is intransitive, so there is no passive reading to arrive
   at — the string simply fails. Worse, the lesson's own `decision` block
   licenses a V3 reduction for intransitive verbs with a finished result
   (`fallen leaves`, `retired teachers`), which gives a learner who read the
   lesson a route to `waited` that the explanation does not close. The note
   excludes it on transitivity instead. **Recommend rewording the
   explanation.**
2. **`quantifiers-t7` and `-t8`, `much`.** Both explanations state the ban on
   `much` in a plain affirmative clause flatly (*"denmez"*, *"doğal bir cümle
   değildir"*), while the lesson's own `text` block frames the same fact as
   naturalness and register (*"much düz olumlu bir cümlede kulağa yanlış
   gelir"*, and `many` there *"kullanılabilir, sadece biraz resmî durur"*).
   The lesson is the more accurate of the two. Both notes use the lesson's
   framing, which is why neither says *denmez*. The corpus is inconsistent
   with itself about how hard this rule is.
3. **`quantifiers-t12`, `any`.** The explanation says *"'any' olumlu bir
   cümlede bu anlamı veremez"*, which is softer than the truth — a bare `any`
   cannot be the subject of an affirmative declarative at all. The note
   follows the explanation's framing rather than strengthening it past what
   the item claims.

## A note on the eight short notes

Eight notes run under 62 characters, all in *Relative Clauses* and all of the
form *this pronoun is for people / for things, and this antecedent is the
other one*. That is the whole reason the option is wrong; padding them to the
80–140 band would have added a second clause that says nothing. They are
short because the fact is short.
