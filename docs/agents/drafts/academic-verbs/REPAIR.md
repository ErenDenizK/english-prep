# academic-verbs — repair log

Started 2026-09-04 by the supervisor, after the item review
(`REVIEW-items.md`) and the lesson sufficiency review
(`REVIEW-lessons.md`).

**This log covers one finding of several. The topic is not repaired and
must not ship.** Two repair agents were commissioned for the full list
and both terminated on a session rate limit before changing anything;
what follows is the single blocking defect the supervisor took on
directly because it is a false statement about English rather than a
judgement call. Everything else in both reviews is still open, and is
listed at the bottom.

**Both reviewers were uncalibrated** — their briefs mistakenly pointed
them at the answer key, they read it, and they correctly refused to
report a score. Their findings are therefore evidence, not verdicts. The
finding below was re-verified against the files before anything changed.

---

## Fixed: `Change & Emergence` taught something false, and it eliminated
its own key

**The finding, verified.** The lesson said in three places that `emerge`
requires the thing not to have existed before:

| Where | What it said |
| --- | --- |
| `contrast` b1, the `emerge` side | *"Öncesinde ortada o şey yoktur."* |
| `pitfall` b8, the `why` | *"Öncesinde o şey yoksa emerge kullanılır."* |
| `decision` R1 | *"…öncesinde ortada olmayan bir şeyin ilk kez göründüğünü söylüyorsa"* |

That is not true of English — *the sun emerged from behind the cloud* —
and it is not true of this category's own first item. `academic-verbs-t1`
keys `emerged` for a bridge parapet that stood under a reservoir for
fifty years and rises *"above the surface **again**"*. Run literally, R1
never fires on t1, and R4 (*measurable quantity, direction down*) then
fires on *"the water dropped so far"* and certifies `declined`, which is
on the paper. The procedure did not merely fail to reach the key; it
pointed at a distractor.

The item's own `tip` already carried the correction — *"ilk kez **ya da
yeniden**"* — which appeared nowhere in the lesson. An item quietly
repairing its lesson is the tell that they were written apart.

**What changed.** Four edits, and the two rule edits bind to the same
thing:

1. **b1 `emerge` gloss** — now: *"Görünmeyen ya da bilinmeyen bir şey
   görünür hâle gelir: ilk kez ortaya çıkabilir, ya da onu örten şey
   kalktığı için yeniden. Belirleyici olan, öncesinde görünmüyor
   olmasıdır — var olmaması değil."* The distinction is stated as a
   relation; the block's own example (`A new approach emerged.`) is
   unchanged.
2. **b8 `pitfall` why** — the false universal is gone and the pitfall
   still teaches what it was for: `evolve` is an existing thing turning
   into something else and the sentence says what into; `emerge` is
   something coming into view.
3. **R1** now reaches a thing becoming visible *again*, **and** requires
   the blank's subject to be the thing becoming visible.
4. **R4** now requires the blank's subject to be the measurable quantity
   itself.

**The subject binding is not invented.** The lesson's own `forms` block
already gives each verb the subject it takes — `emerge`: *eğilim, kanıt,
sorun*; `decline`: *sayı, oran, düzey*. The rules were simply not
carrying what the forms rows already said, which is the failure class
`curriculum-author.md` names as *rules written against the lesson's
examples rather than against the items*. Nothing here is quoted from a
live item: an illustration lifted from an item goes stale the moment the
item is reworded, and that is how two previous repairs regressed.

**The whole block re-traced afterwards**, not just the repaired rules:

| Item | Key | Resolves at | Distractor certified? |
| --- | --- | --- | --- |
| t1 | `emerged` | **R1** — parapet is the thing coming into view | no; R4 is blocked by its subject clause (the falling quantity is the water, not the parapet) |
| t2 | `shifted` | **R2** — start point and end point given | no; R3 needs long gradual development and the paragraph says *abrupt*, *within three issues* |
| t3 | `declined` | **R4** — enrolment is the measured quantity and it is the subject | no; R5 is blocked by its own *no measured quantity* clause |
| t4 | `faded` | **R5** — intensity disappearing, no number | no; R4 is blocked, there is no quantity |

4/4 reach a verdict, 4/4 are the key, 0 distractors certified.

**Blast radius checked.** No item outside this category offers any of the
five verbs as an option, so the repaired rules govern only their own set.
`npm run draft` stays at 0 errors.

---

## Not done, and still blocking

Nothing below has been touched.

- **`Cause & Consequence`, L5** — `trigger` and `prompt` never appear in
  the same option list, so the set's hardest pair is never the decision.
  The fix is at paragraph level (make one of them genuinely wrong), not
  by adding an option: `drafts/README.md` records why they cannot
  currently share an item.
- **`Claim & Concede`, L5** — `acknowledged` is absent from `t11`, the
  only `concede` item.
- **`Allocate & Withhold`** — the item review's arithmetic, unverified
  here: polarity alone leaves 2 options in t21/t22/t23 and **1 in t24**.
- **Second defensible answers** — `t22` (`assigned`/`allocated`), `t23`
  (`withheld`/`retained`, whose lesson discriminator is contradicted by
  `t24`), `t18` (`restricts`/`suspends`, borderline).
- **Six items pre-solved by a lesson sentence** — `t5`'s `sell-off` is
  verbatim; `t21` *is* its lesson's pitfall. Fix the lesson's English,
  not the items.

## Before this ships

**This repair needs an independent re-audit like any other.** Three of
the first six repairs in this project failed their re-review, one because
the fix traded a defect for a worse one — and the supervisor wrote this
one, so nobody uncommitted to it has read it yet. The trace above is a
claim, not a verification.

---

# Second round — the five findings that were left open

2026-09-04. Everything in "Not done, and still blocking" above is now
either repaired or listed at the bottom with a reason. The
`Change & Emergence` repair was not reopened and no file in `data/` was
touched.

Both reviews were re-verified against the files before anything changed.
One finding's *arithmetic* was checked by re-running it (§3), and one
finding's *suggested fix* turned out to be unsafe as written and was
implemented differently (§2) — the reasoning is in the section, because
a repair that quietly does something other than what the review asked
for is the thing nobody can audit later.

`npm run draft` ends at **0 errors, 0 warnings**. The warning it had
before this round — t6 and t8 offering an identical option set — is
gone, and §1 explains why that was never forced in the first place.

---

## 1 · Blocking · `Cause & Consequence`: the pair the lesson teaches
hardest was never the decision

**The finding, verified.** `trigger` and `prompt` were never in one
option list as a live choice: t5 kept `prompt` out, t6 kept `trigger`
out, and t7 — the only item offering both — keys `undermine`. A learner
who believes the two are interchangeable scored 4/4. `drafts/README.md`
records why they could not share an item as written: with an event
object (*triggered / prompted an independent survey*) both are
defensible.

**Why the fix is in t5 and not t6.** The overlap README describes is
real, so the repair had to move an item *out* of the frame where the two
words overlap, not add an option inside it. There are two directions and
only one of them is safe:

- Make `trigger` wrong in t6. The reliable way to do that is
  `prompt + NP + to V`, a frame `trigger` resists — but `undermine`,
  `reinforce` and `accelerate` do not take that frame either, so the
  item would have been decided on syntax and three of four options would
  have been dead. Rejected.
- Make `prompt` wrong in t5. `prompt` needs a party that can decide;
  it cannot take a purely physical chain reaction (*the earthquake
  prompted a tsunami* is not English). That exclusion is absolute rather
  than a preference, and it is the lesson's own line — *"tepkiyi veren
  bir özne ve bilinçli bir karar vardır"*.

**What changed.**

1. **t5's paragraph** is now an automatic cascade with the deciding fact
   in the first sentence rather than beside the blank: *"Nothing in a
   substation waits for a person to decide: the protective switches open
   the instant a line touches anything."* The blank's own clause no
   longer carries the answer, which is what §4 of the item review asks
   of an item.
2. **t5's options** become `triggered / prompted / accelerated /
   undermined` — `reinforced` out, `prompted` in. Explanation, tip and
   all three `optionNotes` rewritten; the explanation names `prompted`
   and says which clause kills it.
3. **t8's `accelerated` → `triggered`.** t8 keys `reinforce`, so nothing
   ever required it to omit `trigger`; that omission is the whole reason
   two items drew from one pool. `triggered` there is wrong on this
   lesson's central axis — the belief the maps confirm *"had been
   believed all along"*, so there is no reaction that did not exist
   before. t5 and t8 now test that axis in both directions, which is
   what the item review praised t19/t20 for.

The lesson was not touched. R2 (*"kimsenin karar vermesine gerek
kalmadan"*) and R3 (*"bir kişinin ya da kurumun aldığı bilinçli bir
karar"*) already drew this line; the corpus simply never asked them to.

**Re-traced, all four items, every rule:**

| Item | Key | Resolves at | Anything else fire? |
| --- | --- | --- | --- |
| t5 | `triggered` | **R2** — nobody decides, the switches open by themselves | no; R3 is blocked by its "o özne" clause, R1 by "the cascade begins here", R4/R5 have nothing pre-existing |
| t6 | `prompted` | R3, first half only | no rule fires on a distractor; see the reservation below |
| t7 | `undermine` | **R4** — the case exists and is weakened | no; R2 needs a reaction beginning, R5 the opposite direction |
| t8 | `reinforced` | **R5** — a belief held all along is made firmer | no; **R2 blocks `triggered`** on the same clause that makes t5's key |

**Reservation, unchanged and not mine to close:** t6 still reaches its
key by elimination rather than by R3, because R3's second clause asks
for the deciding party *in the sentence* and t6 names only the survey.
That is `REVIEW-lessons.md` §2's own finding, it is not on this round's
list, and rewording a rule that three other items pass through is not a
change to make on the way past. Recorded, still open.

**Coverage after the swap** — keys `trigger`/`prompt`/`undermine`/
`reinforce`, `accelerate` never keyed (distractor ×2), every member a
distractor at least once (trigger ×2, prompt ×3, undermine ×3,
reinforce ×2). Kickoff rule 4 holds.

---

## 2 · Blocking · `Claim & Concede`: `acknowledged` absent from t11

**The finding, verified.** t11 offered `conceded / asserted / implied /
disputed`. It is the only `concede` item, its frame is exactly where the
choice between the two lives, and the blind reviewer wrote of it:
*"`acknowledged` would [work] — it is not offered"*.

**Why the review's own fix could not be applied as written.** "Put
`acknowledged` back into t11" would have created a second defensible
answer in the item it repaired. In a *that*-clause frame the two verbs
are not separable: `acknowledge` covers admitting a fact one had
concealed, which is precisely what the old paragraph described (three
days of denial, then an admission under questioning). Every teacher
would take it. The review knew this — its fix says "and **make the
paragraph decide it**" — so the paragraph is where the work went.

**The relation that separates them, and it is in the lesson already.**
`acknowledge` grants that something *is true*; `concede` gives a point to
the other side, and the subject need not have accepted it. So the
paragraph now says the subject never accepted it:

> *"… — a sentence she offered for the sake of argument and withdrew the
> next morning."*

**What changed.**

1. **t11's paragraph** gains that closing clause. The three days of
   denial and the questioning stay, so the item still tests what it
   tested; what is new is a fact that makes `acknowledged` false rather
   than second-best.
2. **t11's options** become `conceded / acknowledged / asserted /
   implied` — `disputed` out, `acknowledged` in. `dispute` is still
   keyed at t12 and still a distractor at t10, so kickoff rule 4 holds.
   (`disputed` rather than `implied` was dropped because keeping it would
   have given t11 and t12 a string-identical option set.)
3. **The lesson's two glosses and two rules now state the relation.**
   `concede`: *"Tartışmada karşı tarafa bir puan verir: o noktada
   direnmekten vazgeçer, ama onu benimsemiş olmak zorunda değildir."*
   `acknowledge` gains one word — *"doğru ya da geçerli olduğunu
   **benimseyerek**, açıkça teslim eder"*. R4 gains the third disjunct
   (*"özne onu benimsemeden yalnızca tartışma uğruna veriyorsa"*) and R5
   is restated over what the subject believes. Both are written as
   relations; neither quotes the item, and the block's own examples
   (`He conceded that the sample was small.`,
   `She acknowledges the earlier work.`) are untouched and still
   illustrate both sides.

**One thing this round introduced and then removed.** The first draft of
the paragraph ended *"a point she gave the committee …"* — and the
lesson's `forms` row is `She conceded the point.` That is the failure
class `curriculum-author.md` names as the one that only bites when you
are repairing: the repair had put the item's deciding noun into a lesson
string keyed on the same verb. Caught by re-running the giveaway audit
over the repaired files, and reworded to *"a sentence she offered"*. The
audit now returns nothing for t11.

**Re-traced, all four items, every rule:**

| Item | Key | Resolves at | Anything else fire? |
| --- | --- | --- | --- |
| t9 | `asserts` | **R2** — his own claim, stated plainly, no evidence | no; R4 needs a point that costs him and R5 a *teslim*, and he is granting nothing |
| t10 | `implies` | **R1** — *"never says"*, the figure does the saying | no |
| t11 | `conceded` | **R4** — costs her, comes after resistance, **and** is granted without being accepted | no; **R5 blocks `acknowledged`** on "benimsiyorsa" and on the damage clause |
| t12 | `disputed` | **R3** — the truth of a conclusion opposed | no; R4/R5 grant nothing |

4/4 reach a verdict, 4/4 are the key, 0 distractors certified. The rule
order (imply → assert → dispute → concede → acknowledge) is unchanged,
and the two rewritten rules are the last two, so nothing above them sees
anything new.

---

## 3 · `Allocate & Withhold` — the arithmetic, re-run, then the fix

**The item review's measurement is exact.** Re-computed from
`questions.json` rather than read off the report, marking each option G
(gives out) or K (holds back) and counting how many share the key's
polarity:

| item | options | key | survive polarity |
| --- | --- | --- | --- |
| t21 | allocates G, distributes G, withholds K, retains K | G | 2 |
| t22 | assigned G, allocated G, withheld K, retained K | G | 2 |
| t23 | withheld K, assigned G, retained K, distributed G | K | 2 |
| **t24** | retains K, allocates G, assigns G, distributes G | K | **1** |

**2 / 2 / 2 / 1, exactly as reported.** t24 was a one-option item for
any learner who knew only which half of the set means "keep". The
finding is upheld in full.

**What changed.**

1. **t24's `distributes` → `withholds`.** Polarity now leaves two live
   options in all four items and none of them is answerable without
   discriminating inside a polarity half. `distribute` is still the
   un-keyed fifth member and still a distractor at t21 and t23, so rule
   4 holds.
2. **t24's paragraph** had to earn that option. The rights now *"pass to
   the university the day the thesis goes into the repository"*, so the
   university holds what has become its own and `withholds` is false
   rather than unattractive.
3. **The lesson's withhold/retain line is rewritten**, because the old
   one was wrong and the corpus proved it. It asked *"is there a party
   waiting?"* — and t24 has a party waiting (an author asking
   permission) while keying `retains`. The line is now **whose the thing
   is**: `withhold` = the other party's due, deliberately not handed
   over; `retain` = already the subject's, with nobody holding a claim
   on it. Both glosses, R4 and R5 say it, and the retain gloss carries
   the correction explicitly — *"birinin ondan bir şey beklemesi bunu
   değiştirmez"*.

This is also what makes §4's t23 repair work, and t23/t24 now test the
pair in both directions with the other member on the paper — the shape
the item review named as the model.

---

## 4 · Second defensible answers — t22, t23, t18

All three verified against the paragraphs before acting. All three fixed
at paragraph level; no option was removed to make a problem go away.

**t22 · `assigned` / `allocated` — upheld, fixed.** The paragraph opened
*"Every reporter on the desk wanted the flood story"*, which builds the
scarce-contested-resource frame the lesson gives to `allocate`
(*"Sınırlı bir kaynağın bir bölümü … resmen ayrılır"*) one sentence
before keying `assign`. The item punished a learner who had learned the
lesson. The opening is now *"Nobody on the desk was competing for the
flood story; it meant two days in the rain."* — a job, not a prize. The
explanation was rewritten to name the removed frame rather than to
assert the key harder.

**t23 · `withheld` / `retained` — upheld, fixed.** An insurer *retaining*
a payment pending documentation is standard commercial English, and
nothing in the paragraph said the money was the family's. It now does:
*"and it does not dispute that the money is owed"*. `retain` presupposes
the thing is the subject's, so the sentence excludes it. The tip and the
`retained` note were rewritten to the corrected discriminator — they had
been carrying the "waiting party" test that t24 contradicts.

**t18 · `restricts` / `suspends` — upheld, fixed.** The sentence meant to
exclude `suspends` was about the *path* (*"The coast path is not closed
at any point in the year"*), while the blank governs access to half the
*beach*; the two are compatible, so a seasonal suspension of beach
access was defensible. The disclaimer is now
*"No part of the beach is closed to walkers at any point in the year."*
Explanation and the `suspends` note follow it.

---

## 5 · Six items pre-solved by a lesson sentence — fixed in the lessons

The review named the tension and it is real: for vocabulary, showing the
word's typical object *is* the teaching, so a lesson that does its job
will contain the item's collocation. So none of these was fixed by
weakening a lesson. Each rule still has both of its sides and every
`pitfall` still differs from its `wrong` in exactly one place; what moved
is the noun each one is demonstrated on.

| Item | The lesson string that stood over it | Now |
| --- | --- | --- |
| t21 | `examples`: *"The budget allocates a third to research."* | *"The trust allocates a fixed share of its income to bursaries."* |
| t21 | `pitfall`: *"Half of the budget was distributed / allocated to research."* | *"Half of the fund was distributed / allocated to a single laboratory."* — same one-word difference, same rule |
| t22 | `contrast`: *"The editor assigned the task to a junior."* | *"The dean assigned the evening class to a new lecturer."* |
| t17 | `pitfall`: *"The engine preserves / maintains a constant speed."* | *"The pump preserves / maintains the pressure in the pipes."* |
| t18 | `contrast`: *"The rules restrict access to members."* | *"The permit restricts fishing to the winter months."* |
| t18 | `pitfall`: *"Access is restricted for / to staff."* | *"Bidding is restricted for / to local firms."* — the `to`/`for` rule is untouched |
| t13 | `forms`: *"The study determined why it failed."* | *"The court determined whether the signature was genuine."* |
| t13 | `pitfall`: *"Researchers monitored / determined the cause of the failure."* | *"The board monitored / determined which of the two designs was cheaper."* |
| t23 | `forms`: *"They withheld payment from the supplier."* | *"They withheld approval from the contractor."* — `approval` is already in that row's own `use` |

`t5` is the exception and it was fixed the other way round: its
paragraph was rebuilt for §1, which took the `sell-off` with it. The
lesson's `forms` row *"The news triggered a sell-off."* is left alone —
no item now uses the phrase, and changing a sentence that nothing
collides with would be churn.

**Re-measured.** The giveaway audit was re-run over the repaired files:
every lesson `contrast` / `forms` / `examples` / `pitfall` string against
every paragraph in its own category, scoring a hit when the string shares
the item's **key** and a content word. Before: t18 ×3, t21 ×2, t5, t22,
t17, t13, t23. After, the whole table is

| item | key | lesson string | shared |
| --- | --- | --- | --- |
| t3 | declined | `pitfall` right / `examples` | *year* |
| t7 | undermine | `forms` | *argument* |
| t16 | monitor | `forms` | *system* |
| t19 | suspended | `forms` / `examples` | *trial*, *until* |
| t24 | retains | `pitfall` right | *another* |

— which is the "moderate, listed once and not itemised" set the review
explicitly left alone: one incidental noun each, no shared scenario. All
six of the worst are gone from it.

**Re-traced decision blocks for the two categories whose lessons were
edited here but whose rules were not** (`Examine & Establish`,
`Sustain & Restrict`). Neither edit touched a rule, but the block was run
anyway, because a repair is done when nothing else broke:

| Item | Key | Resolves at | Anything else fire? |
| --- | --- | --- | --- |
| t13 | `determine` | R3 — one closed answer, and the paragraph gives it | no |
| t14 | `verify` | R1 — a figure already claimed, then checked | no; R2's *"about"* sits in R1's shadow, as before |
| t15 | `estimated` | R2 — exact counting stated impossible, round figure | no |
| t16 | `monitor` | R5 — continuous, twelve-month record | no |
| t17 | `maintain` | R5 — the object is a level held by effort | see the reservation below |
| t18 | `restricts` | R3 — activity continues under a condition | no; **R1 is now blocked** because the paragraph says nothing closes |
| t19 | `suspended` | R1 — restart stated | no |
| t20 | `abandoned` | R2 — permanent, site sold | no |

**Reservation, pre-existing and not acted on:** `Sustain & Restrict`'s R4
and R5 are written over *"korunan şey"* rather than over the blank's own
object, and at t17 the thing being protected is the seeds while the
blank's object is a temperature. R3 fires before R4 at t18 and R5 states
the level case, so no key is lost — but a learner reading R4 loosely at
t17 can reach `preserve`, which is on the paper. This is
`REVIEW-lessons.md` §5's own Note, it is not on this round's list, and it
is a rule change in a block whose only assigned defects were at paragraph
level. Recorded, still open.

---

## 6 · What was removed, grepped

Every string this log claims to have taken out, searched for across both
files afterwards:

| string | result |
| --- | --- |
| `Every reporter on the desk wanted` | gone |
| `The coast path is not closed` | gone |
| `the final payment` | gone |
| `The editor assigned the task to a junior` | gone |
| `The budget allocates a third to research` | gone |
| `Half of the budget was distributed` | gone |
| `They withheld payment from the supplier` | gone |
| `The rules restrict access to members` | gone |
| `Access is restricted` | gone |
| `The engine preserves a constant speed` | gone |
| `The study determined why it failed` | gone |
| `Researchers monitored the cause` | gone |
| `bekleyen bir taraf` (the withhold/retain rule that t24 contradicted) | gone |

Two survive on purpose and are not claimed as removed: `a sell-off`
remains in the `Cause & Consequence` `forms` row and now collides with
nothing (§5), and `distributes` remains at t21, where it is a working
distractor — it was removed only from t24.

---

## 7 · Not acted on, and why

- **t12's *"Nobody questioned the measurements"* (D12, worth fixing).**
  The parallel does supply the verb. Not on this round's list, and t12 is
  the item whose option set had to stay stable while t11's changed —
  editing both in one pass is how a repair round loses its own baseline.
- **t9's *"he repeats the claim twice more"* (D12, note).** Same reason;
  the review itself rates the evidence sentence that follows as
  decorative rather than the item as broken.
- **`Cause & Consequence` R3's second clause (L1 at t6).** §1 above:
  t6 still reaches its key by elimination. Rewording a rule three other
  items pass through was out of scope for a paragraph-level round.
- **`Sustain & Restrict` R4/R5 stated over the wrong noun (L1 at t17).**
  §5 above.
- **`Sustain & Restrict` b3/b8 teaching `restrict + N + to + N` as "the
  limit follows *to*", which misparses t18's locative *to the eastern
  half*.** The key is unaffected on either parse; fixing it means either
  a new pattern in `forms` or a rewritten blank object, and the option
  set that repair would need is the one §4 has just stabilised.
- **`Claim & Concede` b8's `wrong` being correct English** (*"The
  committee disputed the proposal for two hours"*). A true finding and a
  real defect — a pitfall that marks an acceptable sentence as an error —
  but the fix is a new pitfall, not an edit, and this round changed two
  glosses and two rules in that same lesson already.
- **The four other untested caveats** (`accelerate` + counted quantity,
  `reinforce` + bare that-clause, `imply`/`infer`, `dispute`/`discuss`,
  `withhold … from`, `restrict … to`). Each spends a `pitfall` on
  something no item's option set can spring. They are arguments for a
  sixth item per category, which is the supervisor's call and not an
  edit.
- **`assess` appearing in 4/4 of its category's items while never being
  keyed**, and the same shape at 3/4 elsewhere. Kickoff rule 4 produces
  it by construction. Named in both reviews as the supervisor's call.
- **The `Change & Emergence` category.** Out of scope by instruction; not
  read for repair and not touched.

## Before this ships

Unchanged from the round above, and now with more surface: this round
rewrote five paragraphs, moved nine lesson sentences and changed four
`decision` rules across three lessons. **The traces in §1–§5 are claims
made by the session that made the changes.** Three of the first six
repairs in this project failed their re-review. The topic needs an
independent blind pass over the four items whose paragraphs moved (t5,
t11, t22, t23, t24 — and t8, whose option set changed), by a session that
has not read this file.

One housekeeping note for whoever picks this up: a repair session running
concurrently on `academic-nouns-adjectives` committed the whole working
tree at 15:28 (`WIP: the nouns/adjectives lesson examples, mid-repair`),
which swept most of this round's edits into that commit. The files on
disk are correct and `npm run draft` is clean; the commit boundary is
not.

---

## Where this repair lives in the history

Commit boundaries for this round are wrong, and the record is here rather
than in them. Two repair agents wrote concurrently while a stop hook
committed the working tree whenever this session paused, so:

| commit | title says | actually contains |
| --- | --- | --- |
| `1632abc` | the topic intro screens | those, plus both drafts mid-repair |
| `94b8e6a` | the nouns/adjectives lesson examples, WIP | that, correctly |
| `23f1302` | the academic-verbs repair | **both** repairs' final state and both `REPAIR.md` files |

Nothing was lost and every intermediate state passed `npm run draft`, but
a reader following `git log` will not find a commit whose message
describes the `academic-nouns-adjectives` repair. These two files are the
record; the history is only where the bytes are.
