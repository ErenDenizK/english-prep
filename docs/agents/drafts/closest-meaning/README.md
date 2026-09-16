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

## Round 2 (2026-09-04) — after the repairs

The lessons' eleven false claims are fixed and committed. The questions
went back through **two fresh independent blind passes**.

| | |
| --- | --- |
| Agreement with the key | **24/24 and 24/24** |
| Items with two faithful restatements | **0**, from either reader |
| The hedge exploit | dead — `may have` / `might have` went from 8 distractors and 0 keys to **1 distractor and 2 keys** |
| The named-source exploit | dead — one stem now names its source and its key keeps it, one item names nobody at all, so the reflex deletes the correct answer as often as a wrong one |

One reader called the reporting category "the best-engineered part of the
set", because two options in each item now carry the same raised-passive
form and differ only in content — the transformation cannot be recognised
and guessed. Both readers independently named `t13` and `t23` the two
strongest items.

**Nothing that remains is a correctness defect.** What the second round
found is about what the items *measure*:

- The *Third Conditional* group reduces three of its four items to one
  move — a past counterfactual means both propositions are false. Only
  the mixed-conditional item adds anything.
- The *Unless* group is the most rigid: one reader called it "one item,
  four times", and all four carry a past-tense option that is eliminable
  on sight because every stem is future.
- One stem never says whether an event is over, so a distractor is not
  decisively wrong on the stem alone.
- One key glosses its own hedge, so the reporting grammar is not
  exercised in that item.
- Assorted prose: a stadium that finishes a match, an examination that
  becomes closer, "On a Saturday" for "On Saturdays", a stem that
  distinguishes critics from reviewers and options that collapse them.

### One finding deliberately not acted on

A reader observed that in most items the three distractors fail on
**content** alone — one contradicts a stated fact, one invents a fact,
one shifts the tense — so the target structure is never strictly
*required*, and ten items are solvable by elimination without it.

That is true, and it is also how the real paper works. `docs/exam-spec.md`
records that its distractors "are grammatically fluent and differ in
*meaning*, usually by reversing a causal direction, changing a modality,
or swapping which of two things is being compared." Content-level
discrimination is the skill this section tests. Redesigning around the
observation would make the app's items less like the exam's, not more.

What *was* asked for is narrower and cheap: where it costs nothing,
prefer one distractor per category that is consistent with every fact in
the stem and wrong only in the grammatical relation — the way the
strongest reporting item already works.

## The integration is proved

Assembled into `data/` as a dry run on 2026-09-04 and then reverted. With
the fourth topic present:

- `npm run validate` — **4 topics, 97 questions, 24 lessons, clean**
- `npm test` — 89
- `npm run verify` — **545 checks, no problems** (up from 455, the extra
  ninety being the six new lessons audited at 390px)

So nothing about a fourth topic, the `compound-structures` tier — which
had never been used — or restatement items inside a lesson's `check`
blocks needs code. `node docs/agents/drafts/closest-meaning/assemble.mjs`
from the repo root is genuinely the whole of it.

## Round 3 (2026-09-04) — and the line for shipping

**The questions are done.** Five independent blind passes have now read
them, every one agreeing with the key on all 24 — 120 of 120 — and the
final pass returned an explicit *ship*: no item with two faithful
restatements, no key worth arguing against, no ambiguous stem, no broken
English. Its three prose notes were applied.

**The lessons took four repair rounds**, all on one thing: a `decision`
rule that reaches the wrong verdict on its own lesson's questions. Nine
such rules have now been fixed. One of them was introduced *by a previous
repair* — fixing a rule that wrongly demanded the two sides of a
comparison keep their written order, I told the learner the only thing to
check is which side has more, which certifies a distractor that keeps the
comparison intact and swaps the people.

That is why the class kept reappearing, and it is the finding worth
keeping: **a decision block is a procedure, and its rules only mean
anything together.** Changing one without re-auditing the rest is how a
fix becomes the next defect.

### The line

Not every audit finding is a reason to hold content, and the difference
is sharp:

| The rule … | Verdict |
| --- | --- |
| fires on the key, or certifies a distractor | **misleading — must fix before shipping.** A learner who follows the procedure is actively led to the wrong answer, which is worse than having no procedure |
| fires on nothing in its category | incomplete — ship, and record it |
| should have fired and did not | incomplete — ship, and record it |

An under-firing rule leaves a learner where they would have been anyway.
A misfiring one takes marks off them. Only the first row holds a release.

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
