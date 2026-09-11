# academic-nouns-adjectives — independent re-audit of the repair

Written 2026-09-04 by a session that did not write `REPAIR.md` and did not
write either review. Every claim in `REPAIR.md` was treated as unverified.
Nothing in `questions.json`, `lessons.json`, `REPAIR.md` or the two review
reports was edited; `tools/ship-topic.mjs` was not run.

---

## 0 · What I actually did, so the "found nothing" cases mean something

1. **Ran all six `decision` blocks as literal checklists over their own
   four items** — 24 traces, rule by rule, in file order, recording for
   each rule whether it fires, on what text, and whether the word it names
   is on that item's paper. Both repaired categories and all four
   untouched ones.
2. **Diffed the repair against its baseline** (`1474232..HEAD`, the last
   commit before the repair began) rather than reading the log's account
   of what changed. 280 changed lines in `lessons.json`, 32 in
   `questions.json`.
3. **Re-measured the giveaway metric from scratch** (§C of the lesson
   review: lesson strings carrying an item's key *and* a content word from
   that item's paragraph), plus two measures the log does not use — a
   whole-lesson duplicate scan, and a per-item table of *every* lesson
   string containing the key, read against the blank's own frame.
4. **Ran every grep `REPAIR.md` quotes.** All 22 reproduce.
5. **Ran `npm run draft`** (0 errors, 2 warnings — reproduces) and, because
   `check-draft` does not validate the lesson schema, **assembled the pair
   into a throwaway copy of the repo and ran `tools/validate-content.mjs`**.
   Passes, with the single t13/t16 warning. The log's schema claim holds.
6. Answered t15 and t22 myself and read every item whose paragraph,
   options, explanation, tip or optionNotes the repair touched.

### A blindness caveat I have to declare

I could not answer t15 truly blind. `questions.json` carries `optionNotes`
keyed by option, and it contains **exactly the three distractors** — so the
key of every item is recoverable by subtraction from the field names alone,
before reading a word of Turkish. `tools/blind-corpus.mjs` strips
`optionNotes` by allow-list, so a reviewer working from a blinded file is
safe; a re-auditor working from the source is not. I reasoned from the
paragraph and the lesson's own glosses and record my answer below, but it
is not a blind answer and should not be counted as one.

---

## 1 · Verdicts

| category | verdict | blocking defect |
| --- | --- | --- |
| **Scale & Extent** | **SHIPS** | — |
| **Evidence & Inference** | **SHIPS** | — |
| **Certainty & Doubt** | **SHIPS** — the repair's blocking claim is confirmed | — |
| **Significance & Priority** | **DOES NOT SHIP** | t15 as rewritten *is* `pitfall` b8, and b8 sits immediately above a `check` block that draws from this category |
| **Constraint & Requirement** | **SHIPS** | — |
| **Stance & Disposition** | **DOES NOT SHIP** | `pitfall` b8's `wrong` — *"The wording was reluctant."* — marks as an error the transferred-epithet use that `contrast` b1 and `forms` both license and that t21's key requires |

Four of six ship. The two that do not are two of the three the repair
claims to have fixed, and **both blocking defects were introduced by this
repair.** Neither is a procedural failure: all six decision blocks now run
4/4 to the key and certify no distractor. Both are the lesson teaching
against its own item, which is the same class as the finding each of those
two categories was already blocked on.

---

## 2 · The decision blocks, run literally

### 2.1 Scale & Extent — 4/4 keys, 0 distractors certified

| item | key | resolves at | distractor certified? |
| --- | --- | --- | --- |
| t1 | `magnitude` | **R4** — *"at twice the speed the deck had ever been tested for"* is R4's new *"kaç kat"* | no |
| t2 | `scope` | **R3** — *"allowed to ask how the vessel had been loaded that night, and nothing else"* | no |
| t3 | `margin` | **R1** — *"nine votes apart out of nineteen thousand"* | no |
| t4 | `threshold` | **R2** — *"falls below a certain ____ , the colonies stop coming"* | no |

The rewritten R4 (§5c) does what the log says: t1 was previously decided by
a false *"alışılmışın dışında büyük"* restriction and is now decided by the
scale the paragraph supplies. `magnitude` is a distractor at t2 and t4 and
is not certified at either, because R3 and R2 sit above R4.

**One soft spot, non-blocking.** R1's head clause is *"Cümle iki değeri
karşılaştırıyorsa"* — and t1's *"twice the speed the deck had ever been
tested for"* is literally a comparison of two values. R1 is held off only
by its elaboration (*"aradaki fark, hata payı"* — a difference, not a
ratio). If a learner fires it, R1 names `margin`, which is **not** on t1's
paper, so the worst case is a stall and not a certification. Recorded, not
charged.

### 2.2 Evidence & Inference — 4/4 keys, 0 distractors certified

Decision block untouched by the repair; re-traced anyway.

| item | key | resolves at |
| --- | --- | --- |
| t5 | `evidence` | R4 — *"two decades of catch records against the lunar calendar"*, offered to show the practice was thinning the stocks |
| t6 | `assumption` | R2 — *"built on the ____ … Nobody had asked the four hundred"* |
| t7 | `implication` | R3 — the enzyme finding's consequence for the coastal cities |
| t8 | `consensus` | R1 — *"the ____ among excavators is that"* |

**One pre-existing ordering hazard, non-blocking.** R2 (`assumption`) sits
above R4 (`evidence`), and t5's *first* sentence is a textbook R2 trigger:
*"For twenty years the ban on night fishing rested on what the older
skippers remembered, and on nothing else."* Run over the whole paragraph,
R2 arguably fires and names `assumption`, which **is** on t5's paper. Run
over the blank's own clause — which is what the rules' *"Cümle"* means —
R2 does not fire and R4 does. The item survives, but the block gives no
instruction about which text a rule reads. Pre-existing, not the repair's,
and not raised by either reviewer.

### 2.3 Certainty & Doubt — 4/4 keys, 0 distractors certified · repair CONFIRMED

The two blocking findings were real. I re-derived them against the baseline
before checking the fix: old R1's third disjunct *"ya da bir kuşkuyla
dengeleniyorsa"* does fire on t10's *"nothing … contradicts it — **yet** the
register itself stops in 1699"* and certifies `apparent`; old R4 *"Cümle bir
kusur, **bir itiraz** ya da yönteme yönelik bir şüphe taşıyorsa"* does fire
on t9's contradicting third witness and certifies `questionable`. Both
words are on their items' papers.

| item | key | resolves at | why the rivals are blocked |
| --- | --- | --- | --- |
| t9 | `conclusive` | **R2** | R1: the blank is a negated predicate, neither *It … that* nor prenominal. R4 never runs; had it, its new clause *"Kanıtın yalnızca yetersiz olması yetmez"* blocks it — nothing was selected or withheld |
| t10 | `plausible` | **R6** | R1 blocked by the frame — *is ____ as an explanation* is neither position, and the old third disjunct is gone. R2: the *"never"* in this sentence negates *closed*, not the blank's adjective. R3: *"can never be closed"*. **R4 blocked by the new insufficiency clause** — the register stopping in 1699 is a gap in the record, not doubt about who produced it. R5: the paragraph says the reading will *not* change |
| t11 | `questionable` | **R4** | own laboratory, own choice of batches, raw measurements withheld — the source/method discriminator that was stranded in `text` b10 |
| t12 | `tentative` | **R5** | R4 blocked: two planks and an interim report are incompleteness. (`questionable` is not on t12's paper in any case) |

**Does the new polarity rule over-fire?** I checked all four. It does not,
but the margin is thinner than the log says. `REPAIR.md` §1.2 describes R2
as *"the blank's adjective negated in **its own clause**"*. The shipped rule
says *"Boşluğun sıfatı **aynı cümlede** olumsuzlanıyorsa (never, not, far
from)"* — **same sentence**, not same clause. t10 contains *never* in the
same sentence. The rule is saved by its other binding — *boşluğun sıfatı*,
the blank's adjective, and t10's *never* negates `closed` — but the log
credits the rule with a tightness it did not ship.

**One cost the fix could not avoid.** R2 encodes t9's cue, and the
replacement `examples` sentence *"The results were far from conclusive."*
plus the `forms` example *"not conclusive evidence"* now print negated-
`conclusive` three times in the lesson t9 is served inside. The item review
already rated t9 D4 (*"suggestive but never ____"* is near-formulaic,
severity: note); the repair necessarily deepened it. Non-blocking, and I
do not see a fix that keeps the rule.

### 2.4 Significance & Priority — 4/4 keys reached, 0 distractors certified, and it still does not ship

| item | key | resolves at | notes |
| --- | --- | --- | --- |
| t13 | `crucial` | **R2** | R1 blocked — but see below |
| t14 | `substantial` | **R4** | R3 (`marginal`, on t14's paper) correctly blocked |
| t15 | `marginal` | **R3** | R2 blocked by the new *ama / yine de* guard |
| t16 | `negligible` | **R1** | — |

The procedure works. Three things about it are worth recording:

- **R1's promotion above `crucial` puts it first on t13, whose opening
  sentence is a negligibility claim**: *"Only four millimetres of rain fell
  on the plantation in June, **nothing at all beside** the winter storms
  that bring two hundred."* `REPAIR.md`'s trace says flatly *"R1: nothing
  says it may be left out"*, which overstates it — the first half of t13
  says precisely that, and the *"though"* is what withdraws it. R1 is
  blocked only by reading past the blank. It holds; the log's reason for
  why it holds is not the real one.
- **The new R2 guard cannot separate t13 from t15 on surface cues.** Both
  are *[blank] + contrastive marker + consequence*: t13 *"were ____ ,
  though: … without them the whole planting would have been lost"*, t15
  *"looked ____ ; even so, it was those four tenths that carried the
  depot"*. The guard — *"Sonuç boşluğa bir ama / yine de ile karşı
  konuyorsa bu kural işlemez"* — separates them only if the learner works
  out which clause the marker heads (in t13 the marker attaches to the
  blank's own clause and the consequence arrives on a colon; in t15 the
  marker heads the consequence). That is a real distinction and the guard
  is defensible, but it is finer than any other rule in the six blocks and
  it is doing the whole job of keeping t13 and t15 apart. Recorded.
- **R1's sharpening narrowed it slightly at t16.** *"hesaptan
  çıkarılabileceğini söylüyorsa"* is satisfied by *"the item was struck from
  the agenda"* rather than stated outright. It fires; it is less direct
  than the wording it replaced (*"pratikte hiçbir fark yaratmadığını"*).

### 2.5 Constraint & Requirement — 4/4 keys, 0 distractors certified

Untouched block; re-traced. t17 → R6 (`constraint`: a four-metre ceiling
is R6's *"yer"*), t18 → R5 (`obligation`; R3 `provision` blocked because no
document is named), t19 → R2 (`criterion`: *"seçme, kabul, değerlendirme"*
covers ranking), t20 → R1 (`exemption`). Nothing above each firing rule
certifies anything. The repair did not disturb it.

### 2.6 Stance & Disposition — 4/4 keys, 0 distractors certified

| item | key | resolves at | why the rivals are blocked |
| --- | --- | --- | --- |
| t21 | `reluctant` | **R5** | R1: no accident is set against the act. **R2 blocked by the new subject binding** — the blank's head is *signature*, not a party that keeps trying, and she gave way. R3: she states a view. R4: no risk |
| t22 | `deliberate` | **R1** | *"not careless"* plus the targeting rules out chance; nothing below runs |
| t23 | `persistent` | **R2** | the blank's subject is the widow, same request, same desk, six years |
| t24 | `indifferent` | **R3** | *"had no view at all"*, *"had not decided against voting"* |

The `forms` rewrite does what §2 claims at the level of syntax. Ten rows,
two per adjective, `use` values parallel, heading hedged. `contrast` b2's
predicative examples (*"The omission was deliberate."*, *"The problem proved
persistent."*) no longer contradict rows that read *isimden önce*: both
words now have a predicative row. t21's attributive slot is licensed
(`a reluctant + N` / *a reluctant apology*) and t22's bare predicative slot
is licensed (`be deliberate` / *the choice was deliberate*). Confirmed.

---

## 3 · Defects the repair introduced

### 3.1 BLOCKING · t15 is now the lesson's own `pitfall` b8

`docs/agents/question-author.md`, quoted in `CLAUDE.md` as one of the two
rules that exist only because a review found them: *a question must never
be built on a sentence from its own lesson, because `check` blocks draw
from the same category and the learner would meet the answer three blocks
above the question.*

`Significance & Priority` `pitfall` b8, unchanged by the repair:

> **wrong:** *The effect was negligible, but it changed the outcome.*
> **right:** *The effect was marginal, but it changed the outcome.*
> **why:** *negligible hesaba katmaya değmez demektir; sonucu değiştiren bir
> etki hesaptan çıkarılamaz. Küçük ama gerçek etki marginal'dır.*

t15, as rewritten by this repair:

> *… the tyre figure looked **____** ; even so, it was those four tenths
> that carried the depot under its emissions cap in November …*
> options: **`marginal`**, **`negligible`**, `substantial`, `considerable`

Same shape — *[small word] + contrastive + it changed the outcome* — same
two candidate words, same slot. The pitfall names which of the two is right
in that shape and which is wrong, and gives the reason. **And the lesson's
block order is `… b7 pitfall, b8 pitfall, b9 check …`** — b8 is the block
immediately above a `check` that `js/education.js` fills from this
category. A learner served t15 at b9 has just read the answer, with its
justification, one block up.

This is not an accident of the repair; it is the repair following the
review's instruction literally. `REVIEW-items.md` §5c: *"The fix … is to
rewrite t15's paragraph so the small saving still **changes something**,
which is what the lesson's own pitfall sentence does in nine words."*
The reviewer named the pitfall as the model. The repair built the item on
it and did not notice that this is the one construction the topic's brief
forbids.

The log's §3 records every consequence of the rewrite it did check —
option sets, numerals, the decision-block fix it forced, §5d — and does not
mention the pitfall the paragraph was modelled on.

### 3.2 BLOCKING · `Stance` `pitfall` b8 now contradicts the fix in `contrast` b1

The repair's §2.2 states the transferred epithet t21 needs, in two places:

- `contrast` b1, `reluctant` gloss (added by this repair): *"**Kişiyi
  niteler; kişinin gönülsüzlüğü onun yaptığı işe de taşınabilir.**"*
- `forms`, `reluctant` attributive row (added by this repair), `use`:
  *"İsimden önce: **kişiyi ya da onun yaptığı işi** niteler"*

And then denies it in a third, also rewritten by this repair (§5a):

- `pitfall` b8: **wrong:** *"The wording was reluctant."* → **right:** *"The
  wording was deliberate."*, `why`: *"… reluctant kişinin gönülsüzlüğünü
  anlatır …"*

*Wording* is work a person did. The lesson has just licensed carrying a
person's reluctance onto the work they do — that is the whole point of the
addition — and then prints an instance of exactly that as an error. t21's
key is the same transfer onto a different piece of written work: *a
**reluctant** signature*. `pitfall` b8 is at b8; the `check` is at b9.

This is also a fresh instance of the defect §5b was written to remove.
§5b's own statement of it: *"a `wrong` a teacher would accept … the pitfall
marks good English as an error to make a line look sharper than it is."*
Four of the five replacement pitfalls are clean by that test (*"Two topics
fall outside the extent of this course."*, *"Sales stayed under the
margin."*, *"A shortage of staff is an obligation the office cannot
escape."*, *"The campaign was cautious and never let up."* — all genuinely
wrong, and each still differs from its `right` in one place). The fifth is
not, and it is the one that lands on a key.

The old `wrong` at this slot was *"The delay was reluctant, not
accidental."* — an *event*, not a product of an act, and therefore not
parallel to *a signature*. The rewrite moved it onto t21's ground while
removing the *", not X"* shape it was aiming at.

### 3.3 Worth fixing · t22's `optionNotes` and `tip` teach something false to make the exclusion work

Shipped `optionNotes.indifferent`:

> *"Umursamayan. **Umursamazlık bir dikkatsizlik biçimidir** ve cümle 'not
> careless' diyerek bunu eliyor; ayrıca gecikme rastgele değil, tam o üç
> haneye denk geliyor."*

Shipped `tip`:

> *"'Deliberate' bilerek yapılmış demektir; anlatılan şey **dikkatsizlik ya
> da aldırmazlık**sa aranan sözcük 'indifferent' olur."*

Indifference is not a form of carelessness. A clerk can process every file
by the book and not care in the least what happens to it; a clerk can care
very much and still slip. *"The clerks had been indifferent, not careless"*
is a coherent English sentence, not a contradiction — it opposes an
attitude to a performance failure, which is an ordinary opposition.

`REPAIR.md` §5a leans on this: *"`not careless` excludes `indifferent` by
**meaning**: indifference is a form of inattention, which the sentence
denies."* It does not. What actually excludes `indifferent` is the other
clause the repair added — *"Every other notice posted that week reached
the council on time"* — because indifference produces scattered delays and
not three envelopes franked together. That is a genuine exclusion on
meaning, it is the one the review's second suggestion asked for, and the
same optionNote states it in its second half. The first half should not
have to carry any weight, and it is not true.

### 3.4 Worth fixing · `Constraint` `pitfall` b7's replacement now echoes two of its own items

New b7: **wrong** *"A shortage of staff is an **obligation** the office
cannot escape."* → **right** *"A shortage of staff is a **constraint** the
office cannot escape."*

- t17 (key `constraint`): *"Nothing in the business is harder to **work
  around** than a ____ built into the walls themselves."* The pitfall's
  `right` line now hands over *an inescapable constraint*.
- t18 (key `obligation`): *"the ____ to go to the help of anyone in danger
  at sea is one that no captain under any flag **may set aside**."* The
  pitfall's `wrong` line prints *an obligation … cannot escape* — the same
  relation as t18's key, marked as an error. The pitfall's actual error is
  the subject (a shortage is not a duty), not the collocation, but the
  surface reading cuts against t18.

The old `wrong` — *"The team worked under tight obligations."* — did
neither. Not blocking: this is semantic echo, not a shared sentence, and my
§C measurement scores both items 0. Recorded because it is a cost the log
does not mention and the replacement was optional.

### 3.5 Note · the `assumption` frame at t6 got closer, not further away

§4's table says t6 went from *"1 + the whole frame"* to **0**. On the
content-word metric that is right and I reproduce it. On the frame, it is
the wrong direction:

| | old | new |
| --- | --- | --- |
| `pitfall` b7 `right` | *We started **from** the assumption that costs would fall.* | *The whole plan rests **on** the assumption that prices hold.* |
| `forms` example | *on the assumption that costs fall* | *on the assumption that prices hold* |
| `examples` sentence | *The model rests on one untested assumption.* | *A forecast always **rests on** an assumption.* |
| t6's blank | *was built **on** the ____ that every student would reach …* | unchanged |

The old pitfall used *from*; the replacement uses *on*, which is t6's own
preposition, and the new `examples` sentence adds a third *rests on … an
assumption*. The lexical giveaway (*start*, *would*) is gone; the
structural one is marginally stronger. Non-blocking — t6 is decided by the
next sentence (*"Nobody had asked the four hundred"*), which the item
reviewer called the most carefully built distractor exclusion in the
corpus — but the log's "0" is measured on the axis that improved.

### 3.6 Note · a §C hit neither review nor the repair lists, at t13

`Significance` `pitfall` b6, untouched by the repair:

> **wrong:** *A **crucial** amount of water was **lost**.* → **right:** *A
> substantial amount of water was lost.*

t13's key is `crucial`, its quantity is rain, and its paragraph ends
*"without them the whole planting would have been **lost**."* Measured on
the review's own §C metric this scores **1** for t13 — the only §C hit in
the corpus that appears in neither §C's table nor `REPAIR.md`'s.

The distinction is real (*a crucial amount of X* quantifies; *these four
millimetres were crucial* predicates decisiveness), so this is not a false
teaching. But it is a lesson line, three blocks above a `check`, telling
the learner that `crucial` + a quantity of water is the error to avoid,
immediately before an item that keys `crucial` on a quantity of water.
Pre-existing, not the repair's, and worth the supervisor's attention while
this category is open anyway.

---

## 4 · Second defensible answers on what the repair changed

Only two items had a paragraph or option list changed: **t15** and **t22**.
t9–t12 had `optionNotes` rewritten and nothing else.

### t15 — `negligible` is still defensible, for a new reason

My own answer, reasoning from the paragraph and the lesson's glosses, is
**`negligible`**. (Not a blind answer — see §0.)

> *Fitting the whole fleet with the new tyres cut fuel use by four tenths
> of one per cent — a saving the depot could measure, but only just. Beside
> the driver-training scheme that took seven per cent off the same bill the
> tyre figure **looked ____** ; **even so**, it was those four tenths that
> carried the depot under its emissions cap in November, and the finance
> office has kept them in the accounts ever since.*

The repair's stated exclusion of `negligible` is: *"A saving that is still
in the accounts and did the carrying is precisely **not** one you may leave
out of the calculation."* Under a *was ____* frame that would settle it.
This frame is **`looked ____`**, and *looked* scopes the judgement to
appearance, which *even so* then overturns. *"Beside the seven-per-cent
scheme the tyre figure looked negligible; even so, it was those four tenths
that carried the depot"* is ordinary, idiomatic English and a completely
standard rhetorical move. The stated ground is stated — it just applies to
the half of the sentence the blank is not in.

Two further reasons it competes rather than losing:

- **`marginal` has already been said.** *"a saving the depot could measure,
  but only just"* is the lesson's `marginal` gloss almost word for word
  (*"ölçülüyor, sayılıyor, yine de zar zor"*). Putting `marginal` in the
  blank restates the first sentence; putting `negligible` there adds the
  comparative judgement the *Beside …* clause is set up to deliver.
- **`even so` presupposes something worth overturning.** `negligible` (this
  need not be counted) is a claim the consequence contradicts. `marginal`
  (small but real, and *"Yok saymak yanlış olur"* per the lesson's own
  gloss) already concedes the point, so the concessive has little to do.

Against this: run over the whole paragraph, the decision block does reach
`marginal` — R1 is blocked by *"has kept them in the accounts"*, R3 fires.
So the item is answerable within the lesson's system. But the bar in
`question-author.md` is not "the system reaches it"; it is *an option a
competent teacher would accept is a wrong option, not a less natural one*,
and a competent teacher accepts *looked negligible … even so*.

`REVIEW-items.md` found `negligible` defensible at t15 as originally
written (*"a saving nobody tracks any more is a saving one may
disregard"*). The repair removed that clause and left the frame that
produces the same result by a different route. **The D1 the rewrite was
meant to close is still open**, alongside the §3.1 giveaway the rewrite
opened.

### t22 — the shipped fix does rule `indifferent` out, but not by the reason given

Re-read cold, the answer is `deliberate` and I agree with the key. The
exclusion works, on the targeting clause the repair added (*"Every other
notice posted that week reached the council on time"* + the three loudest
objectors + one franking). It does **not** work on *"not careless"*, which
is what §5a and the shipped `optionNotes` and `tip` say it works on — see
§3.3.

Two residual risks, neither blocking:

- **`be deliberate` predicated of people.** §5a correctly diagnosed that
  *be deliberate about* pulls toward "purposeful / unhurried" rather than
  "did it on purpose", then shipped a frame that keeps `deliberate`
  predicated of *people* and adds *not careless* — the contrast term that
  most strongly activates the careful/careless reading (*a deliberate
  speaker* = slow and careful). The administrative register recovers the
  intended sense — an ombudsman choosing between intent and negligence is
  a standard opposition, and the re-run order settles it — so I would pass
  it. But the argument §5a makes against the frame it rejected applies in
  weaker form to the frame it shipped, and the log does not say so.
- **The repaired `forms` table licenses `be deliberate` of an act, never of
  an agent.** Its attributive row reads *"eylemi ya da onun ürününü
  niteler"*; its predicative example is *"the choice was deliberate"*;
  `contrast` b2's gloss is *"Bilerek **yapılmış**"*; `pitfall` b8's `why`
  says *deliberate* is what marks a text or an act as chosen on purpose.
  Every one of them attaches the word to an act or its product. t22
  attaches it to the clerks. So §2's claim that *"t22's bare predicative
  slot admits `be deliberate`"* is true of the syntax and not of what the
  lesson teaches the word attaches to — which is the same gap, one level
  down, as the one §2 was fixing.

---

## 5 · The `decline` claim — CONFIRMED

`REPAIR.md`: *"There is no `decline` in this topic — it is an
`academic-verbs` word … the item is a mis-carry from the other topic's
review."*

- `grep -ci decline` over `questions.json` and `lessons.json` → **0** and
  **0**. Reproduces.
- Neither `REVIEW-items.md` nor `REVIEW-lessons.md` contains the string
  `decline` anywhere. The only occurrences in this directory are the two
  lines of `REPAIR.md` that say so.
- `decline` occurs 20 times in `docs/agents/drafts/academic-verbs/lessons.json`
  and 13 times in that topic's `questions.json`, and commit `84b650f`
  ("Stop academic-verbs teaching something false about `emerge`") is where
  its decision rules were reordered — its message names `declined` being
  certified by a misfiring rule.

The repair was right not to act, and right about where the instruction came
from. Confirmed on the files; I cannot see the brief it was given, so the
"mis-carry" attribution is confirmed only in the sense that nothing in this
topic's evidence asked for it.

---

## 6 · Claims in `REPAIR.md` I could not confirm

Everything not listed here reproduced. This list is exhaustive.

1. **§3, the t15 option swap.** The log says *"Options: `considerable` →
   `negligible`"*. The diff shows **`crucial` → `negligible`**;
   `considerable` was never removed. The stated end state
   (`{marginal, negligible, substantial, considerable}`) is correct, and a
   later bullet in the same section says *"Removing it"* of `crucial` — so
   the section contradicts itself and the bullet is simply wrong. No
   consequence for the content.
2. **§1.2, R2's scope.** The log says the rule reads the blank's adjective
   *"negated in **its own clause**"*. The shipped condition says *"aynı
   **cümlede** olumsuzlanıyorsa"* — same sentence. See §2.3: the rule holds
   on a different binding than the one advertised.
3. **§3's t13 trace.** *"R1: nothing says it may be left out."* t13's first
   sentence says *"nothing at all beside the winter storms that bring two
   hundred"*. R1 is blocked by the *though* reversal, not by the absence of
   a negligibility claim. See §2.4.
4. **§5a's exclusion mechanism at t22.** *"`not careless` excludes
   `indifferent` by meaning: indifference is a form of inattention."*
   Refuted — see §3.3. The exclusion holds on the other clause.
5. **§4's table, t21 row: after = 0.** I measure **1** on the same metric —
   the replacement `examples` sentence *"He **gave** a reluctant nod."*
   shares *gave* with t21's *"gave way only after the dean wrote"*. Trivial
   in substance (*gave way* and *gave a nod* are unrelated), but the cell
   is not 0.
6. **§4's table, t6 row: after = 0.** True on the content-word metric,
   misleading on the frame — see §3.5.
7. **§3's claim that the rewrite fixed t15's D1.** Not confirmed —
   `negligible` remains defensible under *looked ____ ; even so*. See §4.
8. **§2's claim that the repaired `forms` table licenses t22's key.**
   Confirmed for syntax, not for what the lesson attaches the word to. See
   §4.
9. **"Unrelated and not mine: `academic-verbs/questions.json` carries an
   uncommitted edit to t11 that predates this session."** Unverifiable now
   — the working tree is clean and that file has since been committed.
10. **The commit-boundary table in "Where this repair lives in the
    history."** I confirmed the three commits exist with those messages and
    that `1474232..HEAD` contains the whole repair, but I did not attempt to
    reconstruct which bytes landed in which of the three, and the log's
    account of the stop hook is not checkable from the repository.

---

## 7 · What ships if the two blocking defects are fixed

Both are lesson-side and neither touches a key or a decision block:

- `Significance & Priority` needs t15's paragraph moved off `pitfall` b8's
  sentence, or b8 changed — and whichever is chosen, the `looked ____ ;
  even so` frame needs to stop admitting `negligible`. Those are one
  problem, not two: the frame that reproduces the pitfall is the frame that
  admits the pitfall's `wrong` word.
- `Stance & Disposition` needs `pitfall` b8's `wrong` off the transferred
  epithet its own `contrast` b1 licenses.

Both fixes are the kind that must be re-audited by a third session rather
than by whoever makes them, for the reason this pass exists.

I did not make either fix.
