# academic-nouns-adjectives — repair log

Written 2026-09-04 by the repair agent, against
`REVIEW-items.md` (blind pass, 24 items) and `REVIEW-lessons.md`
(sufficiency pass, 6 lessons).

**Both reviewers were uncalibrated** — their briefs pointed them at
`docs/agents/calibration.md`, they read the key, and they correctly
refused to report a score. Every finding acted on below was re-verified
against `lessons.json` / `questions.json` before anything changed, and
the two findings I did **not** act on are listed at the bottom with the
reason.

`npm run draft -- docs/agents/drafts/academic-nouns-adjectives` →
**0 errors, 2 warnings** (both pre-existing and unchanged: the t13/t16
identical option set, and the corpus-level `years` setting count). The
pair was also assembled into a throwaway copy of the repo and run through
`node tools/validate-content.mjs`, which `npm run draft` does not do — it
does not validate the lesson schema at all. That passed with the same one
warning, so no rewritten gloss, condition, note or explanation crosses a
length limit or trips the Turkish heuristic.

**This repair has not been independently re-audited.** Three of the first
six repairs in this project failed their re-review, one because the fix
traded a defect for a worse one. Every trace below is a claim.

---

## 0 · Already fixed before I started, verified and left alone

Eight Turkish strings said `on bir` (eleven) where their own paragraph
said something else. All four items now read correctly:

| item | paragraph | explanation now says |
| --- | --- | --- |
| t3 | nine votes out of nineteen thousand | *on dokuz binde **dokuz** oy* |
| t15 | seven per cent | *yüzde **yedi**lik eğitim tasarrufu* |
| t16 | ninety lira | *doksan lira* |
| t23 | six years on | *altı yıl sonra* |

`grep -nE "(^|[^a-zA-ZıİşŞğĞçÇöÖüÜ])on bir" lessons.json questions.json`
→ no match. (A bare `grep -F "on bir"` returns 3 hits; all three are
inside *implication bir* / *indication bir* and are not the numeral.)

---

## 1 · Blocking · `Certainty & Doubt`: the procedure certified a
## distractor twice and reached neither key

**The finding, verified.** Run literally over its own four items, the old
`decision` block did this:

| item | key | what the old block did |
| --- | --- | --- |
| t9 | `conclusive` | R2 requires the sentence to say the matter is **closed**; t9 says *suggestive but **never** ____*, the opposite, so R2 never fires. R4 (*"bir kusur, bir itiraz … taşıyorsa"*) fires on the contradicting witnesses and certifies **`questionable`**, which is on the paper. |
| t10 | `plausible` | R1's third disjunct — *"ya da bir kuşkuyla dengeleniyorsa"* — fires on *"nothing … contradicts it — **yet** the register itself stops in 1699"* and certifies **`apparent`**, which is on the paper. R5 fires too, and the block gives no ordering. |

Both confirmed. The block said nothing about polarity anywhere; the
`questionable` discriminator existed only in `text` b10's prose
(*"kaynağa ya da yönteme kuşku düşürmesi gerekir"*), never in a rule; and
R1's third disjunct was broader than its own head clause.

**What changed — the whole block, rewritten, specific first, one guarded
catch-all last.**

1. **R1 is now the only `apparent` rule and is bound to the frame**, not
   to a feeling: the blank must be inside `It is / became ____ that`, or
   directly in front of the noun it modifies. That is what `contrast` b1
   and the two `forms` rows already teach, and it is the fact about
   English that decides — apparent's two senses each live in one
   position. R1's old third disjunct is gone.
2. **R2 is new and reads polarity**: the blank's adjective negated in its
   own clause (*never, not, far from*) plus evidence that goes some way
   and does not close the matter → `conclusive`. Illustrated from the
   lesson's own `examples` (*The results were far from conclusive.*) and
   its `forms` row (`conclusive + evidence / proof / results`), never
   from t9.
3. **R4 (`questionable`) carries the discriminator that was stranded in
   b10**: the doubt must fall on the evidence's **source or method** —
   who produced it, what was selected, what was withheld — and the rule
   now says outright that insufficiency alone is not enough.
4. R3 `conclusive` (positive), R5 `tentative`, R6 `plausible` unchanged
   in substance, reordered beneath the above.
5. **R7 is a guarded terminal** — *"Yukarıdaki kuralların hiçbiri
   ateşlemediyse …"* — which the block previously had no equivalent of.

The heading now carries the clause the brief asks for:
**"Şıkkı boşluğa koy, sonra cümlenin olumsuzuna bak"**.

**The whole block re-traced, all four items, in order:**

| item | key | resolves at | distractor certified? |
| --- | --- | --- | --- |
| t9 | `conclusive` | **R2** — `never` negates the blank's adjective; the tyre casts and the third witness go some way and close nothing | no. R1 is blocked (the blank is a negated predicate, not `It … that`, not prenominal). R4 is blocked: nobody selected or withheld anything — the evidence is insufficient, not untrustworthy |
| t10 | `plausible` | **R6** — the burials support it, the register cannot prove it | no. R1 blocked by the frame (*is ____ as an explanation* is neither position). R2: no negation before the blank. R3: *"can never be closed"*. R4: no doubt about who produced the register. R5: nothing says the reading will change with more data — it says the opposite |
| t11 | `questionable` | **R4** — own laboratory, own choice of batches, raw measurements withheld | no. R5 is below R4 and never runs; had it run, nothing calls the results provisional |
| t12 | `tentative` | **R5** — the divers expect to move the figure once the keel comes up | no. R4 blocked: two planks and an interim report are incompleteness, not selection or concealment |

4/4 reach a verdict, 4/4 are the key, 0 distractors certified. R1 fires on
none of the four — correct, since none keys `apparent`, and it is bound to
English structure rather than to this corpus.

### 1a · The `apparent` imbalance around it

The lesson declared *"**Asıl tuzak apparent'tadır**"* and then spent a
`contrast` block, two `forms` rows, two `examples` items and **two of six
`decision` rules** on a word no item keys or turns on.

- `text` b0 no longer declares it the lesson's centre. It now says the
  true and useful thing instead: both senses are tied to a position, so
  a blank in neither position is not an `apparent` blank.
- `decision`: two rules → **one**, and that one is now load-bearing
  teaching rather than a second route to a word that is never right.
- `contrast` b1 kept — the sufficiency reviewer called it the best
  lexical teaching in either topic, and R1 now depends on it. Its two
  glosses were tightened so each names the position that carries its
  sense.
- The two `forms` rows kept, for the same reason: they are what R1 binds
  to.

`grep -F "Asıl tuzak"` → 0.

### 1b · The four `apparent` optionNotes

Verified: three of four gave the meaning and then asserted that neither
sense fits — a verdict, not a reason. All four rewritten to give the
reason the learner can check: which position each sense needs, that this
blank is in neither, and what the paragraph is actually measuring.

`grep -F "ikisi de buraya oturmaz"` → 0. `grep -F "ikisi de oturmuyor"` → 0.

---

## 2 · Blocking · `Stance & Disposition`: the `forms` block eliminated
## the key and licensed a distractor

**The finding, verified.** The positional column was unhedged and gave
each adjective exactly one slot:

- **t21** — *"a ____ **signature**"* is attributive. The table licensed
  only `deliberate` (*İsimden önce; eylemi niteler*) and `persistent`
  there; the key `reluctant` was licensed only in `be reluctant to + V`.
- **t22** — *"been ____ **about** it"*. In that table `about` belonged to
  `cautious`, an option; `deliberate` was listed attributive only.

And the lesson contradicted itself one block up: its own `contrast`
examples are *"The omission **was** deliberate."* and *"The problem proved
**persistent**."* — both predicative, both from the two rows that said
*isimden önce*. Confirmed on all counts.

**What changed.**

1. **`forms` b3 rewritten to ten parallel rows, two per adjective** —
   one predicative (with the complement it takes, where it takes one) and
   one attributive — so the same set of `use` values covers every form and
   no row reads as an exclusive slot. `indifferent`'s attributive row
   carries the warning that in that position it usually drifts to
   *vasat*, which is true and is the trap a learner meets in real prose.
   The heading now says so outright: **"Hangi tümleci alır (yeri tek
   başına hiçbir şıkkı elemez)"**.
2. **The transferred epithet t21 needs is now stated** — in `reluctant`'s
   gloss (*"Kişiyi niteler; kişinin gönülsüzlüğü onun yaptığı işe de
   taşınabilir."*) and in its attributive row's `use`. Illustrated by
   `a reluctant apology` in the `forms` row, **not** by t21's signature.
3. **`decision` R2 (`persistent`) is now bound to the blank's own
   subject** — *"Boşluğun öznesi, engellere rağmen aynı şeyi tekrar tekrar
   deneyen ya da geçmek bilmeyen taraf ise"*. Without that, `refused
   twice` in t21 makes R2 arguable; with it, t21 is out, because the
   department head stopped resisting. Same device as the `academic-verbs`
   repair, and it is what the block's own `contrast` (*kişi ya da sorun*)
   already implied.
4. Heading: **"Şıkkı boşluğa koy, sonra nedene bak"**.
5. **t22's frame changed** (see §5a) so the key sits in a natural frame
   the repaired table licenses.

**The whole block re-traced, all four items:**

| item | key | resolves at | distractor certified? |
| --- | --- | --- | --- |
| t21 | `reluctant` | **R5** — refused twice, gave way only under pressure, still calls it a mistake | no. R1: no accident is set against the act. R2: the subject is not the party that keeps trying — she gave way. R3: she plainly has a view. R4: no risk is being avoided |
| t22 | `deliberate` | **R1** — *not careless* puts negligence against the act, and the selectivity rules out chance | no. R2: one afternoon. R3 and R4 never run |
| t23 | `persistent` | **R2** — the blank's subject is the widow, same request, same desk, six years | no. R1: nothing accidental in view. (R2 is above R3–R5.) |
| t24 | `indifferent` | **R3** — no view at all, and the ward *"had not decided against voting"* | no. R1, R2 blocked; R5 needs an unwillingness the paragraph explicitly denies |

4/4 keys, 0 distractors certified. And the repaired `forms` table now
licenses the key in both slots that broke: t21's attributive slot admits
`a reluctant + N`, t22's bare predicative slot admits `be deliberate`.

`grep -F "İsimden önce; eylemi niteler"` → 0.

---

## 3 · Blocking · `Significance & Priority` L5: the pair the lesson works
## hardest on was never the decision

**The finding, verified.** `pitfall` b8 teaches *"The effect was
negligible, but it changed the outcome"* → **`marginal`** — the finest
distinction in the set. `marginal` and `negligible` co-occurred only in
t14, which keys `substantial`, so the pair was live nowhere. Three of the
four items were decided by size polarity alone. The item review is also
right that `negligible` was **genuinely defensible in t15 as written** — a
saving that *"had dropped out of the monthly report altogether"* is one
you may disregard — so the fix had to be the paragraph, not the option
list alone.

**What changed — t15's paragraph, so the small saving changes
something.**

- The closing beat is now: those four tenths *"carried the depot under
  its emissions cap in November, and the finance office has kept them in
  the accounts ever since."* A saving that is still in the accounts and
  did the carrying is precisely **not** one you may leave out of the
  calculation, which is the lesson's own `negligible` gloss.
- Options: `considerable` → `negligible`, so the set is
  `{marginal, negligible, substantial, considerable}` and **the decision
  is now `marginal` vs `negligible`**, on the axis the pitfall teaches.
- `crucial` is **not** admitted, and could not be: once an outcome hangs
  on the four tenths, `crucial` is defensible on the other axis. Removing
  it is what makes the marginal/negligible contest clean. (This is a
  change the item review did not ask for; it falls out of its own
  proposed fix.)
- `gain` → `figure` in the paragraph, which also retires the §C giveaway.
- **The explanation and all three optionNotes were rewritten to name the
  quantities the new paragraph names** — *binde dört*, *yüzde yedi*,
  *kasımda emisyon sınırı*. That rule exists because the last repair on
  this topic broke four items by not following it.

Option sets after the change — `t13 {crucial, substantial, considerable,
negligible}`, `t14 {substantial, crucial, marginal, negligible}`,
`t15 {marginal, negligible, substantial, considerable}`,
`t16 {negligible, crucial, substantial, considerable}` — so no *new*
identical pair is created. §5d (t15 and t16 being the same item, both
ending with the figure dropped from the record) is fixed by the same
rewrite.

**And the `decision` block had to move with it, which is the part that
nearly went wrong.** Re-running the old block over the new t15, **R1
(`crucial`) fired** — the paragraph now says an outcome hung on the four
tenths — and named a word that is no longer on t15's paper. That is a
stall, not a certification, but it is still the procedure failing. Fixed
by ordering and one guard:

- R1 is now `negligible`, sharpened to the real discriminator:
  *hesaptan çıkarılabileceğini söylüyorsa*.
- R2 is `crucial`, and now requires the dependence to be **the reason for
  the judgement in the blank**, with the guard stated: *"Sonuç boşluğa bir
  ama / yine de ile karşı konuyorsa bu kural işlemez"*. That is the
  lesson's own `pitfall` b8 relation promoted into the block, not a string
  from any item.
- R3 `marginal` sharpened with *hesaptan çıkarılamıyor*.
- R6 is now a guarded terminal (*"Yukarıdaki kuralların hiçbiri
  ateşlemediyse …"*).

**The whole block re-traced, all four items:**

| item | key | resolves at | distractor certified? |
| --- | --- | --- | --- |
| t13 | `crucial` | **R2** — *without them the whole planting would have been lost* is the reason for the judgement, not a concession against it | no. R1: nothing says it may be left out. R3 never runs |
| t14 | `substantial` | **R4** — nine hundred and forty thousand against an expected few thousand | no. R1, R2 (nothing depends on the excess — it is more than the repairs cost), R3 all blocked |
| t15 | `marginal` | **R3** — measurable, still in the accounts, but only just | no. R1 blocked (it cannot be left out). **R2 blocked by the new guard**: the consequence arrives after *even so*, set against the blank |
| t16 | `negligible` | **R1** — ninety lira in two hundred thousand, struck from the agenda | no |

4/4 keys, 0 distractors certified, no stall.

---

## 4 · Blocking-adjacent · 31 of 32 `examples` sentences were copies

**The finding, verified** by script: 31 of 32 `examples[].sentence`
strings were byte-identical to a `contrast` example in the same lesson.
The only exception was *"The provision of housing improved."*

**What changed.** All six `examples` blocks rewritten, plus the
`contrast` and `forms` examples that carried the measured giveaway
collocates — because replacing only the `examples` block would have left
*below … threshold* at two exposures and *consensus among economists* at
two. The item paragraphs were **not** rewritten for this, which is what
worked for `relative-clauses`. Replacements are short and abstract
(*a plausible account*, *an earthquake of magnitude six*, *He gave a
reluctant nod*), and each word now has three distinct illustrations —
one in `contrast`, one in `forms`, one in `examples` — so every rule is
still demonstrated and every contrast still shows both sides.

Re-measured, same script as §C of the lesson review (lesson strings
carrying an item's key *and* a content word from that item's paragraph):

| item | key | before | after | what is left |
| --- | --- | --- | --- | --- |
| t4 | threshold | **4** (*below*) | **1** | the `above / below the threshold` pattern in `forms`, which is a reference column |
| t8 | consensus | **3** (*among*) | **1** | the `consensus on + N / among + N` pattern in `forms`, likewise |
| t10 | plausible | **3** (*explanation*) | **0** | — |
| t15 | marginal | **3** (*gain*) | **0** | — |
| t7 | implication | 2 | **0** | — |
| t14 | substantial | 2 | **0** | — |
| t16 | negligible | 2 | **0** | — |
| t21 | reluctant | 2 | **0** | — |
| t6 | assumption | 1 + the frame | **0** | the `started … would` frame is gone from the pitfall |
| t23 | persistent | 1 (*years*) | **0** | — |
| t18 | obligation | — | 1 | *under*, a function word in both `under constraints` and `under any flag`; incidental |

`examples` sentences identical to a `contrast` example: **31 → 0.**

Greps for the strings this removed, all against both draft files:
`below this threshold` 0 · `consensus among economists` 0 ·
`plausible explanation` 0 · `The gain was marginal` 0 · `a marginal gain`
0 · `The difference is negligible` 0 · `rise in costs` 0 ·
`The finding has implications` 0 · `reluctant to sign` 0 ·
`years of persistent effort` 0 · `years of cautious effort` 0 ·
`dropped out of the monthly report` 0. `below the threshold` returns 1 —
the single surviving `forms` pattern, as intended.

---

## 5 · Non-blocking, in the order the reports ranked them

### 5a · t22 — `indifferent` was defensible and *be deliberate about* is strained

**Both halves verified.** *be indifferent about* is the ordinary
collocation and *be deliberate about* pulls toward "purposeful/unhurried"
rather than "did it on purpose", so a learner with a good ear was pushed
away from the key by the syntax while being pushed toward it by the
content.

I tried the item review's first suggestion — reframing to *the delay had
been deliberate* or *had acted deliberately* — and rejected it: every
version I could write leaves `indifferent` **ungrammatical** rather than
wrong, which trades this item's D1 for the D2 the same reviewer flags at
t18. So the fix takes both halves at once:

- the frame is now *"the clerks had been ____ , not careless"*, which is
  natural for `deliberate` and keeps all four options grammatical;
- *"Every other notice posted that week reached the council on time"* is
  the ruling-out clause the review's second suggestion asks for —
  indifference produces scattered delays, not three envelopes franked
  together;
- and `not careless` excludes `indifferent` by **meaning**: indifference
  is a form of inattention, which the sentence denies.

`about it` is gone from the item (`grep -F "about it"` → 0). Because this
hands the learner a *"was deliberate, not X"* frame, **`pitfall` b8 was
rewritten off that frame** (now *The wording was reluctant.* → *The
wording was deliberate.*), so the lesson no longer prints the shape the
check would meet three blocks later. `grep -F "not accidental"` → 0.

Explanation, tip and all three optionNotes rewritten to match the new
paragraph.

### 5b · Four pitfalls whose `wrong` is acceptable English

Checked all seventeen pitfalls in the topic myself. Four have a `wrong`
a teacher would accept, which is the defect: the pitfall marks good
English as an error to make a line look sharper than it is.

| where | old `wrong` | now |
| --- | --- | --- |
| Scale b6 | *The report explains the **scope** of the damage.* — current English | teaches the other direction, where the error is real: *Two topics fall outside the **extent** of this course.* → *… the **scope** of …* |
| Evidence b7 | *We started from the **implication** that costs would fall.* — readable, and it printed t6's whole frame | *The whole plan rests on the **implication** that prices hold.* → *… the **assumption** that …* |
| Constraint b7 | *The team worked under tight **obligations**.* — acceptable | *A shortage of staff is an **obligation** the office cannot escape.* → *… a **constraint** …* (a shortage cannot be an obligation) |
| Stance b7 | *After **years** of **cautious** effort, the team succeeded.* — perfectly good English, and it printed *years* against t23 | *The campaign was **cautious** and never let up.* → *… **persistent** …* (self-contradictory, which is what a pitfall needs) |

Each still differs from its `right` in exactly one place.

### 5c · `magnitude` given a false restriction

**Verified.** `contrast` b1 said *"Büyüklüğün kendisi, üstelik alışılmışın
dışında büyük"* and `decision` R4 inherited it. That is untrue —
*the magnitude of the effect was small*, *an earthquake of magnitude 3.1*
— and it was not even how t1 decides, since t1's cue is the scale itself
(*twice the speed the deck had ever been tested for*).

- The gloss is now *"ölçekle ifade edilen boyutu … Büyük demek zorunda
  değildir"*.
- **R4 now reads the scale** — *"tek bir olayın, kuvvetin ya da niceliğin
  boyutunu bir ölçekle veriyorsa: kaç kat, kaç birim, hangi düzeyde"* —
  which is what t1 supplies.
- `text` b10 promised *"iyi bir soru seni bu ikisi arasında seçim yapmaya
  zorlamaz"*, which t1 breaks. It now states the discriminator instead,
  and R6 is a guarded terminal rather than a reassurance.

`grep -F "alışılmışın dışında"` → 0. `grep -F "iyi bir soru seni bu ikisi arasında"` → 0.

**Scale block re-traced, all four items:** t3 → R1 (`margin`: nine votes
between two totals) · t4 → R2 (`threshold`: below a level the colonies
stop) · t2 → R3 (`scope`: *and nothing else*) · t1 → **R4** (`magnitude`,
via the new scale clause) · R5 and R6 never reached. 4/4 keys, 0
distractors certified. The new R4 would be arguable on t3's *nineteen
thousand* if it ran, but R1 is above it and resolves t3 first — the same
specific-first ordering the block already relied on.

### 5d · `considerable` was defined by its company

**Verified**: *"substantial ile neredeyse eş anlamlıdır"* plus a
tendency. It is the one member of the sixty with no independent gloss.
Now defined on its own — *hatırı sayılır ölçüde büyük*, typically with
uncountable abstract degrees, stressing weight rather than the count —
with the near-synonymy left to `text` b10, which is where it belongs.
`grep -F "substantial ile neredeyse eş anlamlıdır"` → 0.

---

## What I did not act on, and why

**t18 (D2 · `constraint`, `provision`, `exemption` fail on
complementation rather than meaning).** The finding is true — only
`obligation` takes `to + V`, so the frame decides. I left it, because the
two reviews **directly contradict each other here**: the item pass calls
it a defect and asks for the frame to be rewritten; the sufficiency pass
calls t18 *"the only category in either topic where a taught
complementation pattern actually decides an item"* and credits it as the
single load-bearing use of `constraint on` / `obligation to + V` that
`exam-vocabulary.md` §3.3 asks for. Rewriting the frame would delete that
and re-open a hole §3.3 names. Which of the two the topic wants is a
design decision, not a repair.

**`decline` given a false restriction.** There is no `decline` in this
topic — it is an `academic-verbs` word, and it was fixed there in
`84b650f`. `grep -ci decline` over both draft files → 0. Nothing to do
here; the item is a mis-carry from the other topic's review.

**t13 / t16 identical option sets** (`npm run draft` warning, and the
item review's *"admit `marginal` to t13"*). The review ranks it a note,
not a defect; t13 is the best item in the corpus precisely because size is
the wrong axis there, and swapping an option to clear a warning is not
worth the risk to it. Recorded, untouched.

**Every L5 whose fix is on the question side.** `Evidence`'s R6
countability rule and its `an evidence` pitfall fire on nothing; `Scale`
b8 (*to a large extent*) is untested; `Constraint` b6 (`criteria`) and b8
(`exception`) are untested; `reluctant to + V` is taught twice and no
blank in the category takes it; `substantial` vs `considerable` is
separated by three rules and required by no item. All five are real, all
five are true teaching, and the fix each one names is *one more item* —
which the four-per-category constraint forbids. Supervisor's call.

**§4a / §F — the never-keyed fifth member** (`extent`, `indication`,
`apparent`, `considerable`, `provision`, `cautious`) is an option in 4/4
items in three categories. This falls out of kickoff rule 4 by design and
is a decision about the rule, not a defect in any lesson.

**Corpus-level D10/D11** — paragraph vocabulary pitched above the option
band (*franked*, *returning officer*, *keel*, *stallholders*), and seven
items that are a British institutional reversal decided by two precise
numbers. Both are real, both are corpus-wide rewrites, and neither is in
this repair's scope. The `years` scenario warning survives.

**§9 — `tools/blind-corpus.mjs` keeps the parenthesised member list in
`category`**, which lets a reviewer constrain the fourth item of a set by
elimination. A tools change, not content.

---

## Files changed

Only `lessons.json` and `questions.json` in this draft directory.
`data/` was not touched, `tools/ship-topic.mjs` was not run, and neither
review report was edited.

Unrelated and not mine: `docs/agents/drafts/academic-verbs/questions.json`
carries an uncommitted edit to t11 that predates this session.
