# Re-audit — `academic-verbs`

Independent pass over the repair recorded in `REPAIR.md`, 2026-09-04, by a
session that did not write it. Every claim in that log was treated as
unverified and re-derived from `questions.json` and `lessons.json`.

**Nothing was repaired.** No content file was edited, `tools/ship-topic.mjs`
was not run, and this file is the only thing written.

**What was actually done, so a thorough pass can be told from a shallow one:**

- each of the six `decision` blocks run as a literal checklist over its own
  four items — 24 traces, recording the first rule that fires, whether it
  reaches the key, and whether any rule returns an option that is on the
  paper (§1);
- every non-key option substituted into its full repaired paragraph and
  judged by `question-author.md`'s test — *would a competent teacher accept
  it* — for the seven items the repair rewrote (§4);
- the three blocking claims re-derived from the files rather than read off
  the log (§3);
- the giveaway audit re-implemented from scratch and its "after" table
  reproduced; the 13 removal greps re-run; coverage recounted; the
  round-1 blast-radius claim re-checked across `data/` and the other draft
  (§6).

---

## 0 · Verdicts

| category | verdict | blocking defect |
| --- | --- | --- |
| `Change & Emergence` | **SHIPS** | none. Round 1's repair holds: 4/4 keys, 0 distractors certified. One new over-claim in `pitfall` b8 (§2.1), non-blocking |
| `Cause & Consequence` | **SHIPS** | none. The L5 is closed at t5 and 4/4 keys are reached. t6 still reaches its key only by elimination — pre-existing, recorded, non-blocking |
| `Claim & Concede` | **SHIPS** | none. `acknowledged` is genuinely excluded at t11 (§3.2); 4/4 keys, 0 distractors certified |
| `Examine & Establish` | **SHIPS** | none. 4/4 keys, 0 distractors certified. `pitfall` b9's `wrong` is now arguably acceptable English (§2.4) — worth fixing, not blocking |
| `Sustain & Restrict` | **DOES NOT SHIP** | `decision` **R4 fires at t17 and returns `preserve`, which is on the paper**, and R4 precedes R5. This is the defect round 1 called blocking in `Change & Emergence` and fixed there; §7 records it and calls it non-blocking. It is not (§5.4) |
| `Allocate & Withhold` | **DOES NOT SHIP** | the category's blocking item **t22** is not confirmed fixed: `allocated` survives the paragraph rewrite, because the review's case for it never rested on the sentence the repair removed (§4.4). t23's `retained` likewise (§4.5) |

Four of six ship. The two that do not are not the two the repair left
open — `Allocate & Withhold`'s *arithmetic* is fixed and verified, and its
*second defensible answers* are not; `Sustain & Restrict` was declared
shipping by both reviews and by the repair, and its `decision` block
points at a distractor.

---

## 1 · The six `decision` blocks, run literally over their own items

Rules are numbered in the order they appear in the block, which is the
order a learner reads them. "Certifies a distractor" means a rule returns
a verb that is an option on that item and is not the key.

### 1.1 `Change & Emergence` — R1 emerge · R2 shift · R3 evolve · R4 decline · R5 fade

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t1 `emerged` | **R1** — the covering thing (the water) receded, the parapet becomes visible *again*, and the blank's subject is the parapet | yes | no. R4 is stopped by *"boşluğun öznesi o miktarın kendisiyse"*: the falling quantity is the water, the blank's subject is the parapet |
| t2 `shifted` | **R2** — *"from foreign politics to household budgeting"*, and coverage is a focus | yes | no. R3 needs long gradual development; *"abrupt"*, *"within three issues"* |
| t3 `declined` | **R4** — enrolment is the measured quantity and is the subject | yes | no. R1/R2/R3 do not fire; R5 requires no measured quantity |
| t4 `faded` | **R5** — intensity gone, no number | yes | no. R4 has no quantity to bind to |

**4/4 keys, 0 distractors certified — the round-1 claim is confirmed.**
Both bindings do real work: without R1's *"onu örten şey ortadan kalktığı
için yeniden"* t1 falls through to R4, and without R4's subject clause R4
certifies `declined` at t1. Neither widening reaches an item it should not:
no other paragraph in the set has anything becoming visible.

### 1.2 `Cause & Consequence` — R1 accelerate · R2 trigger · R3 prompt · R4 undermine · R5 reinforce

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t5 `triggered` | **R2** — *"Nothing in a substation waits for a person to decide"* | yes | no. R1 has no process under way (the cascade starts at the contact); R3 needs a deciding subject and the paragraph denies one; R4/R5 have nothing pre-existing |
| t6 `prompted` | **none** — R3's first half fires, its second half (*"cümlede o özne varsa"*) fails; the paragraph names only the survey | **by elimination only** | no. R1 blocked by *"nothing came of them"*; R4/R5 have nothing pre-existing. `triggered` is not offered here |
| t7 `undermine` | **R4** — the case pre-exists and is weakened | yes | no. R2 needs a reaction beginning; R5 is the opposite direction |
| t8 `reinforced` | **R5** — a belief *"believed all along"* made firmer | yes | no. **R2 does not fire on the newly-added `triggered`**: no reaction begins, the belief pre-dates the maps |

4/4 keys reached (t6 by elimination, unchanged and recorded), 0 distractors
certified. The t8 option swap is safe.

### 1.3 `Claim & Concede` — R1 imply · R2 assert · R3 dispute · R4 concede · R5 acknowledge

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t9 `asserts` | **R2** — his own claim, plainly, *"Nowhere … a date, a drawing or a witness"* | yes | no. R5 needs a *teslim*; he grants nothing |
| t10 `implies` | **R1** — *"The report never says"* | yes | no |
| t11 `conceded` | **R4** — the point damages her own case, comes after three days of resistance, **and** she gives it *"for the sake of argument"* without adopting it | yes | no. **R5 is blocked twice**: by *"benimsiyorsa"* (she withdraws it) and by *"kendi konumuna zarar vermeden"* |
| t12 `disputed` | **R3** — the truth of a conclusion opposed, objections published | yes | no. R4/R5 grant nothing |

4/4 keys, 0 distractors certified. Both rewritten rules are the last two,
so nothing above them sees new input — confirmed by re-running R1–R3 over
all four items unchanged.

### 1.4 `Examine & Establish` — R1 verify · R2 estimate · R3 determine · R4 assess · R5 monitor

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t13 `determine` | **R3** — one closed answer (*"what had started it"*), and the paragraph gives it | yes | no. R1 has no prior claim to check |
| t14 `verify` | **R1** — grades already written, checked against records | yes | no |
| t15 `estimated` | **R2** — *"impossible"* + *"about five thousand"* | yes | no. R1 has no prior claim |
| t16 `monitor` | **R5** — *"around the clock"*, twelve-month record | yes | no. R3 never closes a question |

4/4, 0 certified. No rule was edited here; the two lesson-string edits do
not touch the procedure.

### 1.5 `Sustain & Restrict` — R1 suspend · R2 abandon · R3 restrict · R4 preserve · R5 maintain

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t17 `maintain` | **R4** — *"Korunan şey kaybolabilir ya da zarar görebilir bir değerse ve amaç onu geleceğe taşımaksa"*: the seed vault's protected thing is the seeds, and the purpose is decades | **no — R4 returns `preserve`, which is option 4** | **yes.** R5 would reach the key, but it is below R4 |
| t18 `restricts` | **R3** — the activity continues under a condition | yes | no. **R1 is blocked by the new first sentence**; R4 (the terns are the protected thing) would fire, but R3 precedes it |
| t19 `suspended` | **R1** — *"enrolment started again in September"* | yes | no |
| t20 `abandoned` | **R2** — *"altogether"*, site sold, scaffolding down | yes | no. R1 needs a stated return |

**3/4 keys reached; one distractor certified, and it is reached before the
key.** See §5.4 — this is the category's blocking defect, and the repair's
t18 fix is what leaves R4 exposed on only one item instead of two.

### 1.6 `Allocate & Withhold` — R1 assign · R2 allocate · R3 distribute · R4 withhold · R5 retain

The repair never traced this block. Four re-trace tables appear in
`REPAIR.md` (§1 lines 76, 194, 273, 415) and none of them is this
category — the one whose R4 **and** R5 were rewritten, whose t24 changed
an option and a paragraph, and whose t22/t23 paragraphs were rewritten.
§5's preamble re-traces the two categories whose rules were *not* touched
"because a repair is done when nothing else broke". The trace it skipped:

| item | first rule to fire | reaches key? | certifies a distractor? |
| --- | --- | --- | --- |
| t21 `allocates` | **R2** — a portion of next year's budget set aside for one heading, *"cannot be moved to anything else"* | yes | no. R1 has no task or person; R3 has one recipient; R4/R5 nothing is held back |
| t22 `assigned` | **R1** — a job, to a named person | yes | no |
| t23 `withheld` | **R4** — *"it does not dispute that the money is owed"*, deliberately unpaid | yes | no. **R5 is blocked by the rewritten *"başkasının o şey üzerinde bir alacağı yoksa"*** |
| t24 `retains` | **R5** — the rights are the university's by agreement and nobody has a claim | yes | no. **R4 no longer fires**: the old *"cümlede bekleyen bir taraf varsa"* did fire here (the author asking permission); the new wording does not |

**4/4 keys, 0 distractors certified.** The two rule rewrites do what §3
says they do, and the un-run trace turns out clean — but it was un-run,
and that is the one procedural gap in an otherwise careful log.

---

## 2 · Defects the repair introduced

### 2.1 `Change & Emergence` b8 — the false universal was replaced with a smaller one, and it leans toward the distractor at t2

`pitfall` b8's `why` now reads: *"evolve var olan bir şeyin kademeli
dönüşümüdür: bir şey başka bir şeye dönüşür **ve cümle neye dönüştüğünü
verir**."*

The added requirement is not true of `evolve`, and the lesson contradicts
it twice in its own English: `contrast` b1 *"The method evolved slowly."*
and `examples` b5 *"The theory evolved through several stages."* — neither
says what into. `forms` marks the complement optional (`S + evolve
(from/into + N)`).

It also points the wrong way at the only item where `evolved` is a live
lure. t2 *does* give from-what to-what (*"from foreign politics to
household budgeting"*), so a learner applying b8 finds `evolved`
*supported* there. Non-blocking — R2 fires before R3 and *"abrupt"* /
*"within three issues"* decide it — but the repair removed one over-strong
claim about `emerge` by writing a smaller one about `evolve`, and the log
does not mention the new clause.

### 2.2 t5 and t11 were written onto their lesson's rules, in the same pass that wrote one of the rules

`curriculum-author.md` names the failure as a repaired rule that quotes
the item. This round produced its mirror image twice — the *item* was
edited to contain a rendering of the rule:

| rule | the clause the repair inserted into the item |
| --- | --- |
| C&C R2 *"kimsenin karar vermesine gerek kalmadan"* | t5: *"Nothing in a substation waits for a person to decide"* |
| C&C R3 *"bir kişinin ya da kurumun aldığı bilinçli bir karar"* | t5's own explanation and `prompted` note repeat it |
| C&C R2 (again) | t8's new `triggered` note: *"Var olmayan bir tepkiyi ani biçimde başlatmak"* |
| C&C R4's new disjunct *"özne onu benimsemeden yalnızca **tartışma uğruna** veriyorsa"* | t11: *"a sentence she offered **for the sake of argument**"* |

Both items are served as `check` blocks **inside the lessons that carry
those rules**, so the learner meets the rule and then the sentence it was
written for. This is not caught by the giveaway audit, which compares
English lesson strings to English paragraphs and cannot see a Turkish rule
translating an English clause; it is not caught by `npm run draft` either.

I do not call it blocking, and I want to be fair about why: teaching the
discriminator an item turns on *is* the lesson's job, and R4's new
disjunct states a real property of `concede` (dialectical concession
without commitment) that survives any rewording of t11 — it passes
`curriculum-author.md`'s own test, *"if it only works because it quotes
that sentence, it is not yet a rule"*. But the consequence is that t5 and
t11 now measure recall of a phrase the lesson supplies, and the log's
claim for §1 — *"The lesson was not touched"* — is true of the file and
misleading about the coupling: the lesson was not moved to the item
because the item was moved to the lesson.

### 2.3 t24's pitfall became a rehearsal of t24, by the option swap

`pitfall` b7 in `Allocate & Withhold`:

```
WRONG: The company withheld its licence for another year.
RIGHT: The company retained its licence for another year.
why:   … lisans zaten şirketin ve kimsenin onun üzerinde bir alacağı yok.
```

t24 is now an institution that **retains** a right that is already its
own, with **withholds** as the trap, decided on whether anyone has a claim
— the pitfall with `licence` swapped for `copyright`. Before the swap,
`withholds` was *not* on t24's paper (options were `retains / allocates /
assigns / distributes`), so the pitfall rehearsed nothing live. The repair
made the pitfall's exact binary the item's live choice and did not notice,
because the noun-based audit cannot see it (§6.2: the only hit it scores
for t24 is the function word *"another"*).

This is the same relation the item review flagged for t21 — *"t21 **is**
its lesson's pitfall"* — and called worth fixing. Worth fixing; not
blocking.

### 2.4 `Examine & Establish` b9 — the new `wrong` is arguably correct English

Changed from *"Researchers monitored the cause of the failure."* to:

```
WRONG: The board monitored which of the two designs was cheaper.
RIGHT: The board determined which of the two designs was cheaper.
```

`monitor` + wh-clause is standard English (*the agency monitors which
species return each spring*, *we monitor which pages are visited*), and
with costs that move over time, monitoring which of two designs is cheaper
is a sentence a teacher would accept. The old `wrong` was unambiguously
wrong; the new one is not.

That is exactly the defect `REVIEW-lessons.md` §3 names in this topic's
`Claim & Concede` b8 (*"The committee disputed the proposal for two
hours"*) and the repair's own §7 declines to fix there, on the ground that
"a pitfall that marks an acceptable sentence as an error" is a real
defect. This round introduced a second instance of it while removing a
giveaway. Worth fixing; not blocking, because no item turns on it.

### 2.5 t18's new disclaimer makes the un-fixed `restrict … to` parse self-contradictory

`REVIEW-lessons.md` §5 and `REPAIR.md` §7 both record that `forms` b3 and
`pitfall` b8 teach `restrict + N + to + N` as *the limit is what follows
`to`*, which misparses t18's locative *"access to the eastern half"*. The
repair left it, on the ground that *"the key is unaffected on either
parse"*.

That was true of the old paragraph, whose disclaimer was about the
*path*. It is weaker now. Under the taught parse, *"the warden restricts
access to the eastern half"* means walkers may go only in the eastern
half — which makes the western half closed to walkers, contradicting the
repair's new first sentence *"No part of the beach is closed to walkers at
any point in the year."* The old disclaimer created no such contradiction.
The key still survives (only `restrict` takes the `N to N` frame at all,
so the mis-parsing learner still lands on it — by syntax rather than by
sense), so this is not blocking; but §7's stated reason for leaving the
parse alone is less true after the repair than before it, and the log
does not record the interaction.

### 2.6 `acknowledge` joined `assess` at 4/4-never-keyed, unremarked

Recounted from the file:

| category | member never keyed | on the paper, before → after |
| --- | --- | --- |
| `Claim & Concede` | `acknowledge` | 3/4 → **4/4** |
| `Cause & Consequence` | `accelerate` | 3/4 → 2/4 |
| `Allocate & Withhold` | `distribute` | 3/4 → 2/4 |

§7 defers *"`assess` appearing in 4/4 of its category's items while never
being keyed, and the same shape at 3/4 elsewhere"* to the supervisor as
kickoff rule 4's by-product. This round created a second 4/4 instance of
it. Kickoff rule 4 itself still holds everywhere (every member is a
distractor at least once; `dispute` is the thinnest at 2/4, keyed once and
a distractor once), and §2's coverage note is correct as far as it goes —
it just does not say that the shape both reviews flagged got worse in the
category it was repairing.

---

## 3 · The three blocking claims, verified from the files

### 3.1 `trigger` and `prompt` now genuinely compete — **confirmed, in one direction**

t5 offers `triggered / prompted / accelerated / undermined`; both members
are on one paper for the first time in the corpus, and `prompted` is
excluded by a stated fact rather than by taste: `prompt` requires a party
that can deliberate (*the earthquake prompted a tsunami* is not English),
and *"Nothing in a substation waits for a person to decide: the protective
switches open the instant a line touches anything"* denies one. The
exclusion is absolute, which is what `drafts/README.md` (lines 252–255)
requires — its bar is only that neither may show the other **with an event
object that a party commissions** (*an independent survey*), and a cascade
of automatic shutdowns is not that.

The scope of the claim is narrower than the log's phrasing. The pair
competes at exactly one item and in one direction: `trigger` keyed with
`prompt` offered. The reverse — `prompt` keyed with `trigger` offered — is
still untested, because t6 keys `prompted` and does not offer `triggered`,
and per the README it cannot. So a learner who over-generalises `trigger`
now risks t5 and t7; a learner who over-generalises `prompt` risks only
t5. The L5 is closed (4/4 by interchangeability is no longer possible);
`t19/t20`-style bidirectional coverage is not achieved, and §1's claim of
"both directions" is about the `trigger`/`reinforce` axis (t5/t8), which
*is* achieved.

### 3.2 `acknowledged` at t11 does not create a second defensible answer — **confirmed**

The paragraph rules `acknowledge` out, and it does so on the clause the
repair added rather than on register:

> *"… she ____ that two of her department's deadlines had gone because the
> system could not read the old files — **a sentence she offered for the
> sake of argument and withdrew the next morning**."*

`acknowledge` grants that something *is true*. "For the sake of argument"
is the conventional marker that the speaker does **not** hold the
proposition, and "withdrew it the next morning" confirms it. *"She
acknowledged that X, a sentence she offered for the sake of argument"* is
internally contradictory; *"conceded … for the sake of argument"* is
idiomatic. A teacher marking a paper would not take `acknowledged`.

Two reservations, neither of them a second answer:

- The exclusion rests entirely on one appositive. Read to the end of the
  blank's own clause — the §4 guessability test — `acknowledged` and
  `conceded` are equally idiomatic in that frame. That is by design (the
  review asked for the paragraph to decide it) but it means the item is
  one clause away from being defective.
- The narrative is strained: an admission extracted under three days'
  pressure, then described as offered "for the sake of argument". Concede
  covers both the yield-under-pressure sense and the dialectical sense, so
  the key is safe under either reading; the paragraph asks the learner to
  hold both at once.

The repair's claim that it avoided a self-inflicted giveaway at t11 is
also confirmed: `forms` carries *"She conceded the point."*, the first
draft's *"a point she gave the committee"* is not in the file, and the
current wording shares no content word with any `concede` string in the
lesson.

### 3.3 `Allocate & Withhold` is no longer decidable on polarity alone — **confirmed, and a cheaper route exists at two items**

Recomputed from `questions.json`, marking each option G (gives out) or K
(holds back):

| item | options | key | survive polarity |
| --- | --- | --- | --- |
| t21 | allocates G, distributes G, withholds K, retains K | G | 2 |
| t22 | assigned G, allocated G, withheld K, retained K | G | 2 |
| t23 | withheld K, assigned G, retained K, distributed G | K | 2 |
| t24 | retains K, withholds K, allocates G, assigns G | K | **2** |

2/2/2/2. The `distributes → withholds` swap at t24 is in the file, the
paragraph earns it (*"the rights pass to the university the day the thesis
goes into the repository"*), and `distribute` remains un-keyed and a
distractor at t21 and t23, so kickoff rule 4 holds.

What the polarity count does not capture, at two of the four items: the
blank is followed by **`to`**, and neither holding verb takes it
(*withhold … from*, *retain* + bare object). At t21 (*"____ two hundred
thousand lira **to** the repair of the harbour wall"*) and t22 (*"____ it
**to** the one who…"*) the K half is eliminable on the preposition,
without polarity and without any lexis. The residue is `allocate` vs
`distribute` at t21 — a real discrimination the paragraph makes — and
`assign` vs `allocate` at t22, which is §4.4's unresolved D1. So t22 is a
two-option item in which both options are defensible.

---

## 4 · Second defensible answers in the rewritten items

Fresh pass. Every non-key option substituted into the current paragraph
and judged by *would a competent teacher accept it*, not *is it worse*.

**4.1 t5 — clean.** `prompted` excluded (§3.1). `accelerated` needs a
cascade already running; the paragraph starts it at the contact.
`undermined` has nothing to weaken. The English of the rewrite is sound
(*brushed a poplar branch*, *a cascade of shutdowns*, *had reached the
coast before an engineer could pick up a telephone*).

**4.2 t8 — clean.** The added `triggered` is a working distractor, not a
dead one: it needs the knowledge that `trigger` requires a reaction that
did not exist, and *"had believed all along"* denies it. `prompted` takes
a deliberated action, not a belief. All four options are past forms, so
nothing is eliminable on grammar.

**4.3 t11 — clean.** See §3.2.

**4.4 t22 — NOT clean; `allocated` survives the rewrite.** The paragraph
now opens *"Nobody on the desk was competing for the flood story; it meant
two days in the rain."* That removes the word the review quoted
(*"wanted"*) and the scarce-contested-resource frame with it. But the
review's case for `allocated` did not rest on competition — it rested on
usage: *"allocate governs the giving-out of anything in short supply
according to a decision, and English uses it for work (cases are allocated
to caseworkers, shifts are allocated)"*. Nothing about *allocate work to
staff* requires the recipients to want it.

And the sentence the repair kept builds the apportionment frame by itself:
*"and gave the others the planning meeting and the school inspection"* —
one editor dividing a fixed set of jobs among a fixed set of reporters.
*"The editor allocated it to the one who had spent two summers on that
stretch of coast"* is English a competent teacher accepts. The taught line
(a story is not a divisible resource) still favours `assign`, exactly as
before the repair; that is what made this "worth fixing" rather than
fatal, and it is unchanged.

Combined with §3.3 — `withheld` and `retained` fall to the preposition —
t22 is a two-option item whose two options are both acceptable. This is
the item `REVIEW-items.md` §8 named as the category's blocking defect, and
I do not find it fixed.

**4.5 t23 — NOT clean; `retained` survives, and the new lesson rule is an
over-claim.** The added clause *"and it does not dispute that the money is
owed"* does establish the debt, and it makes `withheld` the better answer.
It does not make `retained` wrong. Withholding a sum that is **owed**,
pending documentation, is what English calls *retention*: an employer
*retains* 5% of a contract sum until defects are made good; an insurer
*retaining* the last part of a payment pending photographs is the same
construction. Money not yet paid is in the insurer's hands and the
family's entitlement is a claim, not the cash — which is why the pair is
hard here.

The repair's fix therefore rests on a lesson rule that English does not
fully honour: `retain` is now taught as presupposing *"zaten kendinin
olan"* ownership, and the retention sense is a standing counter-example.
That is the same shape as the claim round 1 removed from `emerge`
(*"Öncesinde ortada o şey yoktur"*) — a member defined by a precondition
that real usage breaks. It is milder, because the item's key is still the
better answer and the rule reaches every key in its category (§1.6). But
the log's *"upheld, fixed"* is stronger than what the files support, and
§3's claim that the same rewrite "is what makes §4's t23 repair work" ties
the two together: if the rule is an over-claim, the t23 repair inherits it.

There is also a smaller internal mismatch: the `withhold` gloss says the
thing not given *"öznenin kendi malı değildir"*, which is doubtful for
unpaid money in the insurer's own account, while R4's *"hakkı ya da
**alacağı**"* handles it correctly. The rule is right and the gloss above
it overstates.

**4.6 t24 — clean, but bought with a near-tautology.** No second
defensible answer: with *"the rights pass to the university"* stated,
`withholds` needs a claimant who no longer exists, `allocates` needs a
divisible share, `assigns` runs the wrong direction. The cost is that the
blank now restates its own preceding clause — *"the rights pass to the
university … and it **retains** them from then on"* — so the item is
answerable from the sentence before it. The old paragraph made the learner
infer ownership from *"has to write and ask permission"*; the new one says
it. `it` is also loose: its nearest nouns are *the repository* and *the
thesis*.

**4.7 t18 — clean; the D1 is genuinely closed.** *"No part of the beach is
closed to walkers at any point in the year"* now speaks about the thing
the blank governs, so a seasonal suspension of access to the eastern half
directly contradicts it. `suspends` is out. The paragraph stays coherent
under the intended reading (a marked corridor through the eastern half is
a narrowing, not a closure). Weak residual pull toward `maintains`
(*"nothing is ever closed"* is a continuity signal) — not defensible,
because *"simply maintains access"* makes the nesting clause pointless.
The one live interaction is §2.5, and it is with the lesson, not the item.

---

## 5 · §7's not-acted-on findings — are they non-blocking?

**5.1 t12's *"Nobody questioned the measurements"* (D12) — non-blocking,
confirmed.** The parallel does hand the answer to a learner who knows
*question ≈ dispute*, and *"published their objections"* repeats it. But
the key is right, no other option is defensible, and the stated reason for
deferring (t12's option set had to stay fixed while t11's moved) is sound
sequencing. Note that the reason has now expired: t11 and t12 are no
longer at risk of a string-identical option set, so nothing protects t12
from the next round.

**5.2 t9's *"repeats the claim twice more"* — non-blocking, confirmed.**
Note-level in the review too.

**5.3 `Cause & Consequence` R3's second clause at t6 — non-blocking,
confirmed.** Re-run in §1.2: R3 half-fires, no rule certifies a
distractor, and the key is reached by elimination. Deferring a rule three
other items pass through is defensible. It does mean this category's
procedure reaches only 3/4 keys *by rule*, which the log's §1 table
records honestly.

**5.4 `Sustain & Restrict` R4/R5 stated over *"korunan şey"* — NOT
non-blocking.** The repair writes that *"a learner reading R4 loosely at
t17 can reach `preserve`"*. It is not a loose reading. R4's condition is
*"Korunan şey kaybolabilir ya da zarar görebilir bir değerse ve amaç onu
geleceğe taşımaksa"*, and at t17 the protected thing is the seeds
(perishable, held for decades) — the condition is satisfied on its own
terms. R4 sits **above** R5, so a learner running the block as a checklist
stops at R4 and takes `preserves`, which is option 4 on that item. The
item's own `optionNotes` concede the mechanism in both directions:
t17 — *"Korunan şey tohumlar; boşluğun nesnesi ise sıcaklık düzeyi"*;
t18 — *"Korunan şey kuşlar; boşluğun nesnesi ise sınırlanan erişim."*
At t18 the same rule fires and only the accident of R3 sitting above it
keeps `preserves` off the verdict.

This is the defect round 1 called blocking, in the same words: *"The
procedure did not merely fail to reach the key; it pointed at a
distractor."* Round 1's remedy was to bind the rule to the blank's subject
(`Change & Emergence` R1 and R4 both gained *"boşluğun öznesi…"*). The
identical binding — over the blank's **object** — is what R4/R5 lack here,
and the two edits would be one sentence each. A repair that fixed this
defect in one lesson eleven hours earlier and shipped the same defect in
another cannot call it non-blocking on the same day.

I am not applying the fix; naming it is this pass's job.

**5.5 The remaining §7 items** — b3/b8's `restrict … to` parse (see §2.5,
now worse), `Claim & Concede` b8's acceptable `wrong` (still in the file,
still a defect, now with a sibling at §2.4), the untested caveats, and the
4/4-never-keyed shape (now two instances, §2.6) — are all correctly
classified as non-blocking, with the two amendments noted.

---

## 6 · Mechanical claims, re-run

**6.1 `npm run draft` — confirmed.** 24 questions, 6 lessons, 0 errors,
0 warnings. The t6/t8 identical-option-set warning is gone: t6 is
`prompted / undermined / reinforced / accelerated`, t8 is `reinforced /
prompted / undermined / triggered`.

**6.2 The giveaway audit — reproduced independently, and §5's after-table
is exact.** I re-implemented the method described (every `contrast` /
`forms` / `examples` / `pitfall` English string against every paragraph in
its own category; hit when the string carries the item's key lemma and
shares a content word) without reading the log's table first. Output:

| item | key | lesson string | shared |
| --- | --- | --- | --- |
| t3 | declined | b7 `pitfall` right | *last*, *year* |
| t7 | undermine | b3 `forms` | *argument* |
| t16 | monitor | b3 `forms` | *system* |
| t19 | suspended | b3 `forms` / b5 `examples` | *trial*, *until* |
| t24 | retains | b7 `pitfall` right | *another* |

Identical to §5's table. The six worst are gone **at the noun level**,
which is what the audit measures. Three of them are not gone structurally:
t17's pitfall is still `preserve` vs `maintain` on a machine-held physical
level (speed → pressure), t21's is still a portion of a fund to a single
heading (budget/research → fund/laboratory), and t13 still has two
`determine` pitfalls, one of them (b7, `verify` → `determine` on a
wh-clause) rehearsing t13's live trap. The review's actual suggestions for
two of those — *"move the pitfall to a different pair"* (t17), *"one
pitfall, not two"* (t13) — were not implemented. §5's preamble explains
the general policy (change the noun, keep the rule) but no row records the
divergence from the review's specific fix, which is what §5 says a repair
owes its auditor.

**6.3 The removal table — 13/13 confirmed.** Every string in §6 greps to
zero across both files, including `bekleyen bir taraf`. The two declared
survivors are where the log says: `a sell-off` once in `Cause &
Consequence` `forms` (colliding with nothing — t5's paragraph no longer
contains it), and `distributes` twice at t21 only (option + note).

**6.4 Round 1's blast radius — confirmed.** No item in the other five
categories, in any of the 14 content files under `data/`, or in the
`academic-nouns-adjectives` draft offers `emerge / evolve / shift /
decline / fade` in any inflection as an option.

**6.5 The history note is already corrected.** Commit `1ac2861` replaces
the log's earlier attribution (`94b8e6a`) with the right one: the sweep
was `1632abc`, "Give every topic a screen that says what it is", which
carries both drafts mid-repair. My own archaeology agrees with that table.

---

## 7 · Claims in `REPAIR.md` I could not confirm

1. **§4, t22 — *"upheld, fixed"*.** Not confirmed. `allocated` is still
   defensible; the review's case for it never depended on the sentence
   that was removed, and the retained clause *"gave the others the
   planning meeting and the school inspection"* rebuilds the apportionment
   frame. This is the category's blocking item.
2. **§4, t23 — *"upheld, fixed"*.** Not confirmed. `retained` survives on
   the contract-retention sense, which applies precisely to sums that are
   owed. The new discriminator (*retain* presupposes ownership) is an
   over-strong claim about English, of the same shape as the one round 1
   removed.
3. **§3 — *"none of them is answerable without discriminating inside a
   polarity half"*.** True as stated, but incomplete: at t21 and t22 the
   holding half is eliminable on the following `to` alone, before polarity
   and before any lexis.
4. **§5 — *"All six of the worst are gone from it"*.** Confirmed for the
   audit's own measure only. t17, t21 and t13 keep the structural
   rehearsal that made them findings; the review's suggested fixes for
   t17 and t13 were not taken and the divergence is not recorded per row.
5. **§7 — `Sustain & Restrict` R4/R5 *"Recorded, still open"* as
   non-blocking.** Not confirmed. Under the literal run both reviews and
   the repair use, R4 certifies `preserves` at t17 and is reached before
   the key (§5.4). Blocking by round 1's own standard.
6. **§2 — *"nothing above them sees anything new"*.** Confirmed for the
   rules. Not the whole risk: the item was rewritten to match the rule in
   the same pass (§2.2), which the log does not treat as a coupling.
7. **§1/§2 coverage — *"Kickoff rule 4 holds"*.** Confirmed, and
   incomplete: the round moved `acknowledge` from 3/4 to 4/4-never-keyed,
   a second instance of the shape §7 defers to the supervisor (§2.6).
8. **A trace for `Allocate & Withhold`.** Not made anywhere in the log,
   though its R4 and R5 were rewritten. Run here (§1.6): it comes out
   clean, 4/4 keys and 0 distractors certified.
9. **Unmentioned edits.** `pitfall` b8's new `why` in `Change &
   Emergence` (§2.1) and the substitution in `Examine & Establish` b9
   (§2.4) are both changes to what the lesson asserts about English, and
   neither is described in the log's "what changed" lists.

---

## 8 · What has to be true before this ships

Two categories are blocked, and both defects are one edit each — neither
of which this session may make:

- `Sustain & Restrict` — R4 and R5 stated over the blank's own object
  rather than over *"korunan şey"*, exactly as `Change & Emergence` R1/R4
  were bound to the blank's subject in round 1. Then re-run the block over
  all four items, because R3 currently masks the same misfire at t18.
- `Allocate & Withhold` — t22 needs `allocated` made false rather than
  less apt, and the paragraph clause that does the work is *"gave the
  others the planning meeting and the school inspection"*, not the opening
  the repair replaced. t23 needs either the same treatment for `retained`
  or the option removed; the lesson rule cannot carry the exclusion,
  because English does not.

Everything in §2 is worth fixing and none of it blocks. Whoever takes the
repair should not be this session, and should not be the session that
wrote `REPAIR.md`.
