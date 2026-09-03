# Closest Meaning — reviewed draft, **not shipped**

24 restatement questions and 6 lessons, written 2026-09-03 to
`docs/agents/closest-meaning-spec.md` and reviewed. **They are not in
`data/` and not in the manifest, so the app does not serve them.**

They are here rather than discarded because the review found the content
mostly sound and the defects specific: this is a repair job with a
written list, not a rewrite. The next session should be able to finish it
without re-deriving anything.

## Why it is not shipped

Two blocking defects in the lessons would put a false grammar rule in
front of somebody sitting the exam, and the question repairs did not run
— both authoring agents hit a session rate limit mid-repair. Shipping
now would mean overriding the review's own finding, which is the one
thing this pipeline exists to prevent.

## What the review established

**Nothing is miskeyed.** Two independent blind passes, different option
orders, no answer key: **24/24 each**. Both readers picked the author's
key on every item. That is the floor, and it holds — every defect below
is about what an item measures, not whether it is right.

## The repair list

### Lessons — 2 blocking, 4 worth fixing, 4 notes

Both blocking defects are in `As...As vs Comparatives vs The More...The More`:

1. **A `contrast` gloss that is false for `less`.** *"Fazlası hangi
   taraftaysa than'den önce o durur"* — true for `-er`/`more`, false for
   `less`, where the greater side is *after* `than*. The lesson's own
   `forms` row (*A is less useful than B*) contradicts its gloss.
2. **A `decision` rule that classifies the correct answer as a
   distractor.** Rule 2 fires "Reverse" when the sides keep their order
   and the pattern flips negative→positive — but the lesson's own
   `examples` block pairs *A is not as expensive as B* with *A is less
   expensive than B* as **equivalents**. The rule must test the direction
   of the comparison, not the polarity of the pattern.

Worth fixing, all the same shape — a correct local claim closed off with
an absolute wider than the evidence:

3. *"`would` yalnızca sonuç kolunda durur"* — `would` occurs in
   if-clauses for willingness (*If you would wait here…*).
4. *"İngilizcede şart kolu daima had + V3'tür"* — false inside this
   lesson's own category: *If I were you, I would have refused* is the
   other mixed conditional.
5. *"would have + V3 … cümle artık bugün hakkında hiçbir şey söylemez"* —
   *If she had left earlier, she would have arrived by now* is entirely
   about the present, and decision rule 1 would mark a same-meaning
   option wrong because of this.
6. *"too daima bir engeli işaret eder"* — under negation the blocked
   action is realised (*It's not too late to apply*).

Notes: a `forms` row in *Unless* whose example is passive while its
pattern is do-support; `so` listed as a reason conjunction alongside
`because`/`since`/`as`; *"yarılar yer değiştiremez"* (they can — it means
something else, which the lesson's own pitfall says four blocks later); a
correlative `forms` row whose example does not instantiate its pattern;
the untranslated term *korelatif*.

One lesson of six was found completely clean: **Passive Reporting**.

### Questions — 2 structural, 5 item-level

The two structural ones are the important ones, because neither is
visible in a single item:

1. **"Never pick the hedged one" is a free strategy.** `may have` /
   `might have` / `might be` appears in **8 distractors and 0 keys**. A
   student who notices eliminates an option across a third of the topic
   without reading. Counted, not guessed.
2. **The reporting category has a slot a student can learn.** Each of
   `t21`–`t24` contains exactly one option replacing attributed belief
   with a named party confirming it; in three of the four that option is
   a distractor and the key names nobody. "Eliminate the one that names a
   source" works on all four.

Item-level:

3. **`t4` — the stem is ambiguous and a distractor is built on the gap.**
   Two facts coordinated with *and*; the key requires a causal link the
   sentence never asserts, and one distractor is exactly the reading you
   get by declining to supply it. Probably a one-word fix (*so* for
   *and*).
4. **`t6` — no meaning operation, and answerable cold.** The key is the
   stem with *otherwise* swapped for *unless*, nine identical words; it
   is also the only option that preserves a conditional at all.
5. **`t14` — two defensible answers.** A past-simple correlative reads as
   either an observed trend or a general rule, and two options split on
   exactly that seam. It is also a weaker twin of `t16`.
6. **`t19` — the stem's causal link does not hold.** Suddenness is not
   what stops a match; darkness is. *"failed so completely that…"* was
   the suggestion.
7. **`t15` — a pronoun binds ambiguously** in an item about comparing the
   two things it could bind to.

Also: `t1`–`t3` share one distractor architecture, and `t5`/`t7` are the
same item twice.

### A design finding on the lessons

All six have an identical 11-block skeleton. The reviewer's judgement —
which reads right — is **"mould at the front, justified at the back"**:
the closing `text` + `decision` pair should stay uniform, because the
exam move is uniform and a learner benefits from one checking vocabulary.
The opening five should not. Lesson 6 spends its `contrast` on two frames
it has just called synonymous, when the real difficulty is the time
relation in the infinitive; lessons 4 and 5 each need a second `contrast`
along a second real axis, and lesson 4's two blocking defects are exactly
what that missing contrast would have caught; and three `pitfall`s per
lesson produces filler in four of the six.

## What is left

1. Repair the lessons — 2 blocking first.
2. Repair the questions, including both structural tells. Making a
   hedged option the key somewhere kills the first one outright.
3. Re-run both blind passes and the lesson fact-check.
4. Run a lesson-sufficiency pass — not yet done for this topic, and it is
   the pass that found the most last time.
5. `node docs/agents/drafts/closest-meaning/assemble.mjs` from the repo
   root writes the topic file and the manifest entry, refusing if the
   taxonomy does not line up. Then `npm run format && npm run check`.
