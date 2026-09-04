# Re-audit 2 — `academic-verbs`

Independent audit of `REPAIR-2.md`, 2026-09-04. Written by a session that
wrote none of `REVIEW-items.md`, `REVIEW-lessons.md`, `REPAIR.md`,
`RE-AUDIT.md` or `REPAIR-2.md`, and that read every claim in those files
as unverified.

Scope: `docs/agents/drafts/academic-verbs/` only. Nothing under `data/`,
no code, and nothing in `academic-nouns-adjectives` was read or touched.
Nothing was repaired — this file is the only thing written, and it is not
committed.

**Uncalibrated.** No blinded calibration file was handed to me, and
`docs/agents/calibration.md` is off limits to a reviewer, so I did not
open it. My findings are ungraded. I also read the keys before answering
the items — unavoidable in an audit of a repair, and it means this is a
pass-C (adversarial) review and nothing in it is an agreement rate.

---

## 0 · Verdicts

| category | verdict | blocking defect |
| --- | --- | --- |
| `Change & Emergence` | **SHIPS** | none. Untouched this round; re-traced anyway — 4/4 keys, 0 distractors certified |
| `Cause & Consequence` | **SHIPS** | none. Untouched; 3/4 keys by rule, t6 by elimination only (pre-existing, §2.2), 0 distractors certified |
| `Claim & Concede` | **SHIPS** | none. Untouched; 4/4 keys, 0 distractors certified |
| `Examine & Establish` | **SHIPS** | none. The replaced `pitfall` is genuinely wrong English and differs from its `right` in exactly the verb; 4/4 keys, 0 certified |
| `Sustain & Restrict` | **SHIPS** | none. **The `RE-AUDIT` §5.4 defect is fixed**: R4 no longer fires at t17, and the misfire R3 was masking at t18 is closed too. 4/4 keys, 0 certified |
| `Allocate & Withhold` | **SHIPS** | none. **t22's `allocated` and t23's `retained` are both excluded on my own reading** (§3). Two costs the repair introduced and did not record — §7.1 and §7.2 — are worth fixing, not blocking |

Six of six ship. Both previously blocked categories are fixed, and I could
not break either fix.

That is a clean verdict, so it is worth saying what would have made it a
dirty one and did not happen: no `decision` rule anywhere in the topic
fires and returns a word that is an option on that item and not its key
(120 rule evaluations, §2); no non-key option in the two rewritten items
survives substitution (§3); and the three lesson edits agree with every
other block in their lessons except in one place, which is §7.2.

**Four findings, all "worth fixing", none blocking**, listed in §7. Two of
the four were introduced by this repair; the supervisor should read §7.1
first, because it is one string away from being free to fix and because
it is the same *construction* the previous re-audit called blocking in the
sibling draft.

---

## 1 · What I ran, and in what order

1. `git diff` over the draft directory, before reading `REPAIR-2.md`, so
   the log was checked against the change rather than the change read
   through the log. Repair 2 was uncommitted when I read it and was
   committed mid-audit by another session as `4c97859`; either way the
   change I audited is `063f3ae..4c97859` for this directory — 26 lines of
   `lessons.json`, 24 of `questions.json`, plus `REPAIR-2.md` itself — and
   nothing else. I re-checked the committed content against what I had
   read; it is identical.
2. All six `decision` blocks run as literal checklists over their own four
   items — every rule on every item, in file order, including rules below
   the one that reaches the key. 24 traces, 120 rule evaluations (§2).
3. Every non-key option of t22 and t23 substituted into its rewritten
   paragraph and judged by `question-author.md` rule 2 — *would a
   competent teacher accept it*, not *is it worse than the key* (§3).
4. The three lesson edits checked against every other block in their own
   lesson and against all four of their category's items (§4).
5. `checkLessonGiveaway` imported from `tools/content-checks.mjs` and run
   over the draft's own lessons and questions — which `npm run draft` does
   not do (§6).
6. `npm run draft`, on the working tree **and** on the committed
   pre-repair version, to check the log's "clean before and after".
7. The full `tools/validate-content.mjs` — which `npm run draft` also does
   not run, and which is the only thing that checks the *lesson block*
   schema — against the draft assembled into a throwaway topic file in a
   scratch directory outside the repository (§6).

---

## 2 · The six `decision` blocks, run over their own items

Rules are numbered in file order, which is the order a learner reads them.
A rule **fires** when every conjunct of its condition is satisfied by the
paragraph. "On the paper" means the word the rule returns is one of that
item's four options. A rule that fires and returns a word that is on the
paper and is not the key is a blocking defect, wherever it sits in the
block — but I record firing at every position, because a rule below the
key that only just fails is where the next repair breaks something.

### 2.1 `Change & Emergence` — R1 emerge · R2 shift · R3 evolve · R4 decline · R5 fade

Untouched by repair 2. Re-traced from the files rather than inherited.

**t1** key `emerged` · options emerged / declined / faded / evolved · blank's subject: *the parapet*

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 emerge | **YES** | the covering thing receded (*"the water dropped so far"*) and the parapet is visible *"again"*; the blank's subject is the parapet — **key** | — |
| R2 shift | no | no start point and end point for a focus | not on the paper |
| R3 evolve | no | *"half a century"* supplies the duration, but nothing keeps its identity and changes form | `evolved` — not certified |
| R4 decline | no | there is a falling quantity (the water), but the subject clause binds it: the blank's subject is the parapet | `declined` — **not certified; the round-1 subject binding is what does this** |
| R5 fade | no | something appears rather than dims | `faded` — not certified |

**t2** key `shifted` · options shifted / faded / evolved / emerged

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 emerge | no | nothing becomes visible or known | `emerged` — not certified |
| R2 shift | **YES** | *"from foreign politics to household budgeting"*, and coverage is a focus — **key** | — |
| R3 evolve | no | *"so abrupt"*, *"within three issues"* defeats gradualness | `evolved` — not certified |
| R4 decline | no | no measured quantity falling | not on the paper |
| R5 fade | no | the magazine *"kept its page count, its typeface and its price"*; nothing dims | `faded` — not certified |

**t3** key `declined` · options declined / evolved / emerged / shifted

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 emerge | no | nothing becomes visible | `emerged` — not certified |
| R2 shift | no | 1961 and 2004 are time points, not a start and end for a focus, and enrolment is not *odak, denge ya da tercih* — the second conjunct is what stops it | `shifted` — not certified |
| R3 evolve | no | decades and *"year after year"* satisfy the first conjunct; *"aynı şey kalıp biçim değiştiriyorsa"* fails — a number falling is not a change of form | `evolved` — not certified |
| R4 decline | **YES** | *"four hundred pupils … in 1961"* is the comparison with an earlier level, enrolment is the quantity and is the blank's subject — **key** | — |
| R5 fade | no | there is a measured quantity | not on the paper |

**t4** key `faded` · options faded / emerged / shifted / declined

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 emerge | no | nothing becomes visible or known — *"neither could say afterwards"* | `emerged` — not certified |
| R2 shift | no | *"from memory"* is a lone `from` with no destination, and a memory is not a focus or preference | `shifted` — not certified |
| R3 evolve | no | no form change | not on the paper |
| R4 decline | no | no quantity | `declined` — not certified |
| R5 fade | **YES** | intensity gone, no number anywhere — **key** | — |

**4/4 keys, 0 certified.**

### 2.2 `Cause & Consequence` — R1 accelerate · R2 trigger · R3 prompt · R4 undermine · R5 reinforce

Untouched by repair 2.

**t5** key `triggered` · options triggered / prompted / accelerated / undermined

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 accelerate | no | the cascade begins at the contact; nothing was under way | `accelerated` — not certified |
| R2 trigger | **YES** | *"Nothing in a substation waits for a person to decide"*, *"the instant a line touches anything"* — **key** | — |
| R3 prompt | no | the same clause denies a deciding subject, and *"before an engineer could pick up a telephone"* repeats it | `prompted` — not certified |
| R4 undermine | no | nothing pre-existing is weakened | `undermined` — not certified |
| R5 reinforce | no | nothing is made firmer | not on the paper |

**t6** key `prompted` · options prompted / undermined / reinforced / accelerated

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 accelerate | no | *"nothing came of them"* — no process under way | `accelerated` — not certified |
| R2 trigger | no | a survey of a whole block is not a reaction beginning of itself, and *"finally"* is the wrong tempo | not on the paper |
| R3 prompt | **no** | first conjunct holds (a survey is a considered institutional step); **second conjunct fails** — *"cümlede o özne varsa"*, and the only subject named is the photograph | — |
| R4 undermine | no | nothing pre-existing weakened | `undermined` — not certified |
| R5 reinforce | no | nothing made firmer | `reinforced` — not certified |

t6 reaches its key **by elimination only**. Confirmed independently, and
it is pre-existing — `RE-AUDIT` §1.2 found the same thing and repair 2 did
not touch this category. No distractor is certified, so the learner is
left to reason rather than sent somewhere wrong. Non-blocking, recorded.

**t7** key `undermine` · options undermine / trigger / prompt / reinforce

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 accelerate | no | no process under way | not on the paper |
| R2 trigger | no | nothing begins — the object of the blank is *"the case"*, not a reaction | `trigger` — not certified |
| R3 prompt | no | no deciding subject, no step taken | `prompt` — not certified |
| R4 undermine | **YES** | *"careful and generously sourced"* pre-exists and is weakened by the 2019 graph — **key** | — |
| R5 reinforce | no | the opposite direction | `reinforce` — not certified |

**t8** key `reinforced` · options reinforced / prompted / undermined / triggered

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 accelerate | no | nothing under way | not on the paper |
| R2 trigger | no | *"None of it was news to anyone"* — nothing begins | `triggered` — not certified |
| R3 prompt | no | the subject is the maps; no one takes a step | `prompted` — not certified |
| R4 undermine | no | the belief pre-exists but is strengthened | `undermined` — not certified |
| R5 reinforce | **YES** | *"what the residents had believed all along"*, made firmer — **key** | — |

**3/4 keys by rule + t6 by elimination, 0 certified.**

### 2.3 `Claim & Concede` — R1 imply · R2 assert · R3 dispute · R4 concede · R5 acknowledge

Untouched by repair 2.

**t9** key `asserts` · options asserts / implies / concedes / acknowledges

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 imply | no | *"he repeats the claim twice more"* — it is said outright | `implies` — not certified |
| R2 assert | **YES** | his own view, plainly, and *"Nowhere in the book does he give a date, a drawing or a witness"* supplies *kanıt sunmadan* — **key** | — |
| R3 dispute | no | nobody's claim is opposed | not on the paper |
| R4 concede | no | nothing given up | `concedes` — not certified |
| R5 acknowledge | no | claiming an invention is not granting anything to another side | `acknowledges` — not certified |

**t10** key `implies` · options implies / asserts / disputes / acknowledges

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 imply | **YES** | *"The report never says …"*, the reader infers from the ratio — **key** | — |
| R2 assert | no | blocked by the same clause | `asserts` — not certified |
| R3 dispute | no | no claim opposed | `disputes` — not certified |
| R4 concede | no | nothing surrendered | not on the paper |
| R5 acknowledge | no | *"a matter for the trust to explain"* grants nothing as true | `acknowledges` — not certified |

**t11** key `conceded` · options conceded / acknowledged / asserted / implied

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 imply | no | she says it | `implied` — not certified |
| R2 assert | no | *"Under questioning"* is not putting her own view forward, and *"offered for the sake of argument and withdrew the next morning"* defeats *açık ve kesin* | `asserted` — not certified |
| R3 dispute | no | she opposes nobody | not on the paper |
| R4 concede | **YES** | both branches: it damages her own case and follows three days of resistance, **and** she gives it without adopting it — **key** | — |
| R5 acknowledge | no | blocked twice — she withdraws it (no *benimseme*) and it damages her position | `acknowledged` — not certified |

t11's exclusions of both `asserted` and `acknowledged` rest on the one
appositive. That is `RE-AUDIT` §3.2's reservation, still true, still
non-blocking: the appositive is explicit and does the work.

**t12** key `disputed` · options disputed / asserted / conceded / acknowledged

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 imply | no | the objections are published | not on the paper |
| R2 assert | no | the pseudo-cleft makes the object *someone else's* conclusion, not the labs' own view | `asserted` — not certified |
| R3 dispute | **YES** | the truth of a conclusion opposed, *"published their objections"* — **key** | — |
| R4 concede | no | nothing surrendered | `conceded` — not certified |
| R5 acknowledge | no | nothing granted | `acknowledged` — not certified |

**4/4 keys, 0 certified.**

### 2.4 `Examine & Establish` — R1 verify · R2 estimate · R3 determine · R4 assess · R5 monitor

The block was not edited; the third `pitfall` was replaced (§4.3).

**t13** key `determine` · options determine / verify / estimate / assess

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 verify | no | no prior claim to check | `verify` — not certified |
| R2 estimate | no | no approximation, no round figure | `estimate` — not certified |
| R3 determine | **YES** | one closed answer (*"what had started it"*), given in the paragraph — **key** | — |
| R4 assess | no | no grading asked for | `assess` — not certified |
| R5 monitor | no | one investigation, not a repeated observation | not on the paper |

**t14** key `verify` · options verify / determine / monitor / assess

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 verify | **YES** | *"Applicants type their own grades"* is the prior claim; the registry checks it against records — **key** | — |
| R2 estimate | no | no approximation | not on the paper |
| R3 determine | **would fire** | read literally, *whether what the applicant wrote matches* is an *olup olmadığı* answer that closes — but R1 sits above it and fires | `determine` — not certified **because of rule order**, not because the condition fails |
| R4 assess | no | no grading | `assess` — not certified |
| R5 monitor | no | *"Only once a place has been offered"* — a single act | `monitor` — not certified |

t14 is the one place in the topic where a rule below the key would fire on
its own terms. It is not a defect as the block stands — the learner stops
at R1, R1 is right, and the verify/determine discriminator R1 encodes is
the same one `pitfall` b7 teaches. It is recorded because reordering this
block, or weakening R1, would turn it into one.

**t15** key `estimated` · options estimated / determined / monitored / assessed

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 verify | no | no prior claim | not on the paper |
| R2 estimate | **YES** | *"Counting the birds directly is impossible"* **and** *"about five thousand"* — both branches — **key** | — |
| R3 determine | no | the answer is approximate; nothing closes | `determined` — not certified |
| R4 assess | no | no grading | `assessed` — not certified |
| R5 monitor | no | *"each spring"* sits inside the reported fact, not in the counting, and the purpose is not to notice change | `monitored` — not certified |

**t16** key `monitor` · options monitor / verify / estimate / assess

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 verify | no | no prior claim | `verify` — not certified |
| R2 estimate | no | no approximation | `estimate` — not certified |
| R3 determine | no | *"not any single reading"* — nothing closes | not on the paper |
| R4 assess | no | no grading | `assess` — not certified |
| R5 monitor | **YES** | *"around the clock"*, the twelve-month record — **key** | — |

**4/4 keys, 0 certified.**

### 2.5 `Sustain & Restrict` — R1 suspend · R2 abandon · R3 restrict · R4 preserve · R5 maintain

All five conditions rewritten by repair 2. This is the category that did
not ship.

**t17** key `maintain` · options maintain / suspend / abandon / preserve · blank's object: *a temperature of minus eighteen degrees*

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 suspend | no | a temperature is not a *faaliyet, hizmet ya da izin*; and *"without an hour's interruption"* denies any stopping | `suspend` — not certified |
| R2 abandon | no | a temperature is not a *plan, proje ya da iş* | `abandon` — not certified |
| R3 restrict | no | a temperature is arguably a *miktar*, so the first conjunct is reachable — the second is not: nothing is narrowed by a limit, the level must stay constant | not on the paper |
| R4 preserve | **no** | the blank's object is the temperature. The perishable value is the seeds, which are not the object and are not even named — the paragraph says *"the seed vault"* | `preserve` — **not certified. This is the defect `RE-AUDIT` §5.4 blocked on, and it is fixed** |
| R5 maintain | **YES** | a level held by continuous effort — the generators take over when the mains fail — **key** | — |

I tried to make R4 fire and could not. Its two conjuncts are *the blank's
object is the perishable valuable thing itself* and *the purpose is to
carry it to the future*; a set-point is not a thing that can be lost or
damaged, and the noun that is (*seeds*) never appears. Fixed.

**t18** key `restricts` · options restricts / maintains / suspends / preserves · blank's object: *access*

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 suspend | no — and this is the block's closest call | *access* is arguably an *izin*, and *"Between April and July"* is a *süre*; the second conjunct presupposes a stopping, and the first sentence denies one outright: *"No part of the beach is closed to walkers at any point in the year"* | `suspends` — not certified, on the strength of one sentence |
| R2 abandon | no | access is not a plan/project/job | not on the paper |
| R3 restrict | **YES** | access is *erişim*; the activity continues, narrowed by a season and a marked line — **key** | — |
| R4 preserve | **no** | the terns are the protected value; the blank's object is access | `preserves` — **not certified even with R3 removed. Under the old wording this rule fired here and only R3's position hid it** |
| R5 maintain | no | access is not a *düzey, hız ya da işleyiş*, and nothing falls when effort stops | `maintains` — not certified |

**t19** key `suspended` · options suspended / maintained / restricted / abandoned · blank's object: *the study*

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 suspend | **YES** | a study is a *faaliyet*; *"while an independent panel looked into the case"* is the condition and *"enrolment started again in September"* the resumption — **key** | — |
| R2 abandon | no | first conjunct is reachable (a study is close to a *proje*); the second fails on the resumption | `abandoned` — not certified |
| R3 restrict | no | a study is not *erişim/miktar/kapsam*, and it stops rather than narrows | `restricted` — not certified |
| R4 preserve | no | a study is not a perishable value carried forward | not on the paper |
| R5 maintain | no | not a level, and the study does not continue | `maintained` — not certified |

**t20** key `abandoned` · options abandoned / restricted / suspended / preserved · blank's object: *the restoration*

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 suspend | no | a restoration is arguably a *faaliyet*, so the first conjunct is reachable; the second fails three times over — *"altogether"*, the site sold, the scaffolding down *"for the last time"* | `suspended` — not certified |
| R2 abandon | **YES** | a *proje*, given up altogether, no return foreseen — **key** | — |
| R3 restrict | no | the work stops, it is not narrowed | `restricted` — not certified |
| R4 preserve | no | the blank's object is the restoration, not the stonework; and nothing is being carried forward | `preserved` — not certified |
| R5 maintain | no | not a level | not on the paper |

**4/4 keys, 0 certified.** The repair holds, and it closed two misfires
rather than the one it was blocked on.

**What the rewrite cost, checked rather than assumed.** Three of the five
conditions gained an object-type test they did not have, which is a new way
for a rule to reach an item. Each new first conjunct is satisfied somewhere
it was not before — *access* as an *izin* at t18 (R1), *the study* as a
*proje* at t19 (R2), *the restoration* as a *faaliyet* at t20 (R1) — and in
all three the second conjunct fails on text the paragraph states
explicitly. So the widening is real but inert. R4 (`preserve`) now fires on
no item in its own category; the log records this in its §1.4 and it is
true, but it is a coverage consequence of four items and five verbs, not a
misfire.

### 2.6 `Allocate & Withhold` — R1 assign · R2 allocate · R3 distribute · R4 withhold · R5 retain

R1 widened by repair 2; t22 and t23 rewritten.

**t21** key `allocates` · options allocates / distributes / withholds / retains

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 assign | no | money to a heading, not a task to a person; and the new disjunct finds no person sent anywhere | not on the paper |
| R2 allocate | **YES** | a portion of next year's budget set aside for one heading, *"cannot be moved to anything else"* — **key** | — |
| R3 distribute | no | one heading, no recipients | `distributes` — not certified |
| R4 withhold | no | *"Nothing has been spent yet"* is earmarking, not holding back, and no counterparty has a right | `withholds` — not certified |
| R5 retain | no | the sentence's action points outward, to a purpose | `retains` — not certified |

**t22 (rewritten)** key `assigned` · options assigned / allocated / withheld / retained

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 assign | **YES**, on the new disjunct | *"belirli bir kişi belirli bir göreve veya yere gönderiliyorsa"* — Selin, named, sent to the hearings — **key**. The first disjunct does *not* fire: what is given is a person to a job, not a job to a person, so without the widening the block reaches no rule here | — |
| R2 allocate | no | *"the only reporter on the paper who could"* is scarcity of a skill, not a stock to take a share from; and one whole named person is not *bir bölüm* | `allocated` — not certified |
| R3 distribute | no | one recipient | not on the paper |
| R4 withhold | no | nothing is held back | `withheld` — not certified |
| R5 retain | no | she is sent away, not kept | `retained` — not certified |

**t23 (rewritten)** key `withheld` · options withheld / assigned / retained / distributed

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 assign | no | an authorisation is not a task, role or case, and no person is sent anywhere — the widened disjunct does not reach it | `assigned` — not certified |
| R2 allocate | no | no share of a resource | not on the paper |
| R3 distribute | no | one file, one family | `distributed` — not certified |
| R4 withhold | **YES** | *"it does not dispute that the repairs are covered"* is the entitlement, and *"simply ____ … until the garage sends the photographs"* is the deliberate refusal — **key** | — |
| R5 retain | no | blocked on its second conjunct — *"başkasının o şey üzerinde bir alacağı yoksa"*, and the family has one | `retained` — not certified |

**t24** key `retains` · options retains / withholds / allocates / assigns

| rule | fires? | on what | on the paper? |
| --- | --- | --- | --- |
| R1 assign | no | rights are not a task or role, and no person is sent anywhere — the widening does not reach here | `assigns` — not certified |
| R2 allocate | no | rights are not a share of a resource | `allocates` — not certified |
| R3 distribute | no | one holder | not on the paper |
| R4 withhold | no | the rights passed by agreement; the author asking permission is not a claim, which the `retain` gloss says in as many words | `withholds` — not certified |
| R5 retain | **YES** | the university keeps what is already its own and nobody has a claim — **key** | — |

**4/4 keys, 0 certified. The widened R1 fires at t22 and nowhere else** —
checked against t21, t23 and t24 individually, all three of which fail its
new disjunct on "no person is sent anywhere".

---

## 3 · Every non-key option of the rewritten items, substituted

The test is `question-author.md` rule 2: *an option a competent teacher
would accept is a wrong option* — not an option that is worse than the key.
I reached these verdicts before reading the repair's own table, and I state
where I disagree with its confidence rather than its conclusion.

### 3.1 t22 — the exclusion the repair itself flagged as weakest

> The inquiry into the sluice gates needed somebody who could read a tide
> table, and Selin was the only reporter on the paper who could. The editor
> ____ her to the hearings the same afternoon, and the planning meeting
> waited until she was back from the coast.

**`allocated`** — *"The editor allocated her to the hearings the same
afternoon"*. **Not accepted. I agree with the repair, and I reached it
independently, but the margin is narrower than its table shows.**

The case against it, in the order I weighed it:

1. `allocate`'s object is canonically a divisible quantity earmarked for a
   purpose — money, time, space, a quota. Human objects occur, but they
   occur inside an apportioning scheme: *participants were allocated to the
   treatment arm*, *two officers were allocated to the case*, *she was
   allocated to Ward 4*. The scheme is what licenses them.
2. Every feature of this sentence points away from a scheme. It is active
   with a named agent; the object is a definite individual named in the
   previous sentence and referred to by a pronoun; the destination is a
   one-off event rather than a slot in a rota; and the choice is made on
   fitness (*"the only reporter on the paper who could"*), which is
   `assign`'s territory and not `allocate`'s.
3. There is no stock left to take a share from, and — this is the part of
   the round-1 diagnosis that was right — the clause that used to hand the
   other jobs out is gone.

So a teacher marks it, and I would mark it. What I will not do is call it
impossible: *allocate + person + to* is attested English, and a learner who
argued that an editor allocates reporters across stories would be arguing
from a real pattern. This is a register judgment, and the honest statement
is that the item's exclusion of `allocated` is sound but thin.

What would change my verdict: if the paragraph reacquired any plurality on
either side of the blank — more than one reporter, more than one hearing,
or a rota — `allocated` would come back, because that is the frame it wants.
It currently has none, so the exclusion stands.

**`withheld`** — *"The editor withheld her to the hearings"*. **Not
accepted.** `withhold` takes `from`, never `to`, and the meaning is
contradicted by *"the same afternoon"*. Live rather than dead as a
distractor: the lesson's third `pitfall` is built on exactly this error
(*"They withheld the information **to** the committee"*), so it is an error
this audience makes.

**`retained`** — *"The editor retained her to the hearings"*. **Not
accepted.** The engage sense takes a to-**infinitive** or `as` (*retained
her to represent them*, *retained her as counsel*), not `to` + noun phrase,
and she is already on the staff.

**Recorded, not new:** `withheld` and `retained` both die on the
preposition before any lexis, so the live choice at t22 is two options, not
four. `RE-AUDIT` §3.3 found this, `REPAIR-2` §6.5 records it as unfixed,
and the rewrite neither improved nor worsened it — the old paragraph had a
`to` frame at the blank too.

### 3.2 t23 — the object change, and whether it defeats the counter-example

> The insurer has not said that the claim is invalid, and it does not
> dispute that the repairs are covered. It has simply ____ its authorisation
> until the garage sends the photographs it asked for in March, and the
> family has been driving a hire car ever since.

**`retained`** — *"It has simply retained its authorisation until the
garage sends the photographs"*. **Not accepted, and I am more confident
here than at t22.**

The counter-example that defeated the previous version was contract
retention: an employer withholds a sum that *is* owed, pending remedy, and
English calls that retaining. That sense is specific to **money already in
the payer's hands** — retention money, a retained percentage. It does not
extend to a decision. `retain` requires something the subject has and could
give up; an authorisation that has never been issued is not held, which is
what *"the family has been driving a hire car ever since"* establishes. And
the only reading that would rescue it — "kept its power to authorise" —
is blocked by *"until the garage sends the photographs"*, which would then
make the sentence say the insurer went on authorising until a condition was
met, the opposite of the paragraph.

The key is also positively idiomatic in a way that helps: *withhold its
approval / its consent / its authorisation* is standard institutional and
legal English, possessive and all (*shall not unreasonably withhold its
consent*), and in that collocation the thing withheld is by definition not
yet given. So the object change does the work the repair claims, and it
does it without the over-claim about ownership that round 1 leaned on.

**`assigned`** — *"It has simply assigned its authorisation…"*. **Not
accepted.** No recipient in the clause, an authorisation is not a task, and
the paragraph is about something not being given.

**`distributed`** — *"It has simply distributed its authorisation…"*.
**Not accepted.** One file, one family, one decision — and nothing given at
all.

`assigned` and `distributed` are thin, for the reason the repair states:
they are the giving half of an item whose blank withholds. That makes them
wrong options rather than dead ones (the direction is what the lesson's
second `contrast` block teaches), but the live choice at t23 is again two
options, not four. Unchanged by the rewrite and recorded by both previous
passes.

---

## 4 · The three lesson edits

### 4.1 `Allocate & Withhold` — the `withhold` gloss

Before: *"Verilmeyen şey öznenin kendi malı değildir."*
After: *"Belirleyici olan, karşı tarafın o şey üzerinde bir hakkının
bulunmasıdır."*

**Sound, and the one edit in this round that improves coherence rather than
trading it.** The old sentence was false — an employer withholds its own
money — and the new one is R4's criterion exactly. Checked against every
other block in the lesson:

- `decision` R4 (*"karşı tarafın hakkı ya da alacağıysa"*) — identical
  criterion.
- the `retain` gloss (*"Başkasının o şey üzerinde bir alacağı yoktur;
  birinin ondan bir şey beklemesi bunu değiştirmez"*) — now a clean
  complement rather than a second, differently-drawn line.
- `pitfall` b7 (*"withheld its licence"* → *"retained its licence"*),
  whose `why` already rested on entitlement and not on ownership.
- all four items: t21 (nobody entitled to anything), t22 (nothing held
  back), t23 (the family entitled), t24 (the author not entitled, covered
  by the retain gloss's second sentence).

One residue: b7's *"lisans zaten şirketin"* is now decorative rather than
criterial. Harmless.

### 4.2 `Allocate & Withhold` — the new `forms` row and the widened R1

Row: `assign` · *"Ters yön: kişi bir göreve ya da yere verilir"* ·
`S + assign + person + to + N` · *"They assigned her to the Ankara office."*

Schema-clean (English `form`/`pattern`/`example`, Turkish `use`), it
answers the same question as the other rows in the block, and it is a real
second frame of the verb rather than a row invented to square the grid.
The widened R1 is contained — §2.6 shows it firing at t22 and at no other
item in the category.

**Two things it does not agree with**, both introduced by this edit and
neither recorded in the log:

1. **It contradicts the `contrast` gloss two blocks above it.** That gloss
   still reads *"Bir görev, rol ya da yer belirli bir kişiye veya ekibe
   verilir. Nesne bir miktar değil, bir iştir."* — the object is a job. The
   new row's object is a person, and t22's key now depends on the frame the
   gloss excludes. The repair edited `forms` and `decision` and left the
   highest-value block in the lesson saying the older thing. §7.2.
2. **It puts t22's answer four words above a `check` block.** §7.1.

### 4.3 `Examine & Establish` — the replaced `pitfall`

```
WRONG: The librarian monitored which of the two copies was the older.
RIGHT: The librarian determined which of the two copies was the older.
```

**Sound, and it fixes what it says it fixes.** The old `wrong` (*"The board
monitored which of the two designs was cheaper"*) is acceptable English —
costs move, so monitoring which is cheaper is coherent — and a pitfall that
marks acceptable English as an error is the defect `RE-AUDIT` §2.4 named.
The new object cannot change: which of two copies is older is settled and
closed, so `monitor` is genuinely impossible and `determine` is genuinely
right. The pair differs in exactly the verb (L3 satisfied).

Checked against the rest of its lesson and its items:

- the `why` agrees with the `contrast` gloss for `monitor` (*"süre
  boyunca, düzenli aralıklarla … değişimi fark etmektir"*), with the
  `forms` row (*"süregelen bir durum · süreklilik bildirir"*) and with
  R5.
- no content word is shared with any of the four paragraphs — confirmed
  mechanically in §6, where t13–t15 share at most one word with any lesson
  sentence and t16 two.
- **one thing to note.** The new `why` ends *"böyle bir soruyu bir kerede
  cevaplayıp kapatmak determine'dir"*, and at t14 the fact the registry
  settles (*what the applicant has written*) is also fixed and past-closed,
  with `determine` on the paper as a distractor. So the `why` carries a
  small pull toward a distractor one item away. It is blocked — `pitfall`
  b7 states the verify/determine discriminator directly above it, and R1
  precedes R3 — and the old `why` had the same shape, so this is not new.
  Recorded because "the last repair added a lesson claim that lured the
  learner toward a distractor" is the specific way this project has been
  bitten before, and I looked for it here.
- the `monitor`/`determine` pair the pitfall rehearses is decided at no
  item in the category (t13 has no `monitor` option, t16 has no
  `determine`). That is an L5-shaped untested caveat, it was equally true
  of the pitfall this one replaced, and with five verbs and four items some
  pair has to go untested. Note, not a finding.

---

## 5 · The log against the diff

`git diff` over the draft directory, against the log's §0 table — read
before the log, and covering exactly `063f3ae..4c97859` for this
directory, which is repair 2 and nothing else.

| log claims | diff shows | verdict |
| --- | --- | --- |
| `Sustain & Restrict` `decision`: all five rules restated over the blank's object | all five `condition` strings replaced; `then` values and rule order untouched | **accurate** |
| `Allocate & Withhold` `withhold` gloss replaced | one string | **accurate** |
| `Allocate & Withhold` `forms`: one new row | one row, inserted after the ditransitive `assign` row | **accurate** |
| `Allocate & Withhold` `decision` R1 widened | one condition, one disjunct added | **accurate** |
| `Examine & Establish` third `pitfall`: new `wrong`/`right`/`why` | three strings | **accurate** |
| t22: paragraph, explanation, tip, three optionNotes | exactly those seven strings | **accurate** |
| t23: paragraph, explanation, tip, three optionNotes | exactly those seven strings | **accurate** |
| "Nothing else in either file was edited" | true — no other hunk, and no reformatting churn: both files still reserialize byte-identically to canonical 2-space JSON | **accurate** |
| §5: the `Change & Emergence` b8 `why` was already fixed by commit `063f3ae` and needed no edit | `git show 063f3ae -- lessons.json` is exactly that one-line change | **accurate** |
| "clean before and after" for `npm run draft` | 0 errors, 0 warnings on the working tree **and** on `HEAD`'s version | **accurate** |

Three places where the log claims slightly more than the change supports.
None of them changes a verdict; all three are the kind of overstatement
that becomes the next round's starting assumption if nobody writes it down.

1. **§2.2: *"The paragraph still has to be read: the fact that decides
   `assign` over `allocate` … lives in the first sentence, not beside the
   blank."*** Overstated. A learner who reads only *"The editor ____ her to
   the hearings"* can answer: `withheld` and `retained` die on the
   preposition, and between the two survivors the pronoun object plus `to`
   is `assign`'s canonical frame. The first sentence *supports* the key; it
   is no longer what decides it. This is a real cost of the rewrite —
   before, the blank's object was a job, `allocate` was live on the frame,
   and the context had to settle it. See §7.3.
2. **§2.3: *"its English shares no content word with any paragraph in the
   category."*** True as stated and the wrong measure. The overlap that
   matters is the frame plus the pronoun — *assigned her to the* — which is
   four words of the item's own filled sentence. See §7.1.
3. **§1.2: *"the lesson's own `forms` block already gives each verb the
   object it takes … The rules were simply not carrying what the block
   above them said."*** True of four rules out of five. R2 says *plan,
   proje ya da **iş***; the `forms` row says *plan, proje, **yer***. The
   substitution is a small widening rather than a copy, and it is what
   makes R2 reach *"the restoration"* at t20. Benign, but it is an
   invention and the log calls it a transcription.

Everything else in the log I could check, I could confirm — including the
two self-critical sections (§6's eight not-done findings and §7's ranked
list of what to test first), which are accurate about their own scope.
§7.1 correctly named its own weakest link, and §7.4 correctly named the
`forms` row as an edit that over-fits one item. It was right on both counts;
§7.1 survives testing and §7.4's worry turns out to be the round's real
cost, though not for the reason it gives.

---

## 6 · Mechanical re-runs

**The giveaway measure.** `checkLessonGiveaway`, imported from
`tools/content-checks.mjs` and run over the draft's own six lessons and
their questions — which `npm run draft` does not do, because
`tools/check-draft.mjs` imports only the five question-side checks and the
taxonomy check.

> **0 findings.** No item's keyed sentence appears in its own lesson at the
> six-word threshold.

The full distribution, because the threshold is the interesting part here:

| longest shared run with a sentence in its own lesson | items |
| --- | --- |
| 4 words, lesson sentence carries the key | **t22** — *"assigned her to the"*, against the `forms` row this repair added |
| 3 words, carries the key | t11 — *"she conceded that"* |
| 2 words or fewer | the other 22 |

t22 is now the most coupled item in the topic, and it was not before: the
sentence it is coupled to did not exist until this repair. Below the
mechanical threshold, above everything else. §7.1.

**`npm run draft -- docs/agents/drafts/academic-verbs`** —
`24 question(s), 6 lesson(s) — 0 error(s), 0 warning(s)`. Confirmed on the
working tree, and confirmed identically on `HEAD`'s pre-repair version, so
the log's "clean before and after, it was never the thing that was failing"
is exact.

**The full validator.** `npm run draft` does not check the lesson block
schema at all — no block counts, no `summary` or `gloss` lengths, no
Turkish check on lesson prose, no filled-sentence seam check. Since this
repair edited lesson blocks, I assembled the draft into a throwaway topic
file plus manifest in a scratch directory outside the repository and ran
the real `tools/validate-content.mjs` against it:

> **0 errors and 0 warnings attributable to the draft.** (The run reports
> seven errors and one warning, all of them artifacts of the scratch
> harness — my hand-written manifest gloss and `js/topics.js` expecting the
> topics the scratch manifest does not contain.)

So the new `forms` row, the new `pitfall` and the five rewritten conditions
are schema-clean, both lessons are still inside the 6–14 block range, and
the two rewritten paragraphs pass the seam check with their keys
substituted.

**Scenario reuse, by hand.** The rewritten t22 brings journalism nouns that
already occur elsewhere: *coast* is now in t3, t5 and t22 (3 of 24 —
`checkScenarioReuse` trips at 15%, i.e. at four), *editor* in t2 and t22,
*reporter* in t6 and t22. All of it was true of the paragraph t22 replaced,
so it is texture rather than a change. No near-duplicate: the decisions are
unrelated and `checkNearDuplicates` is clean.

---

## 7 · Findings

Four, none blocking. Two were introduced by this repair.

### 7.1 t22's key now sits four words above a `check` block — **worth fixing**

**Defect:** `question-author.md` rule 1 / D12. **Introduced by this repair.**

The new `forms` row's example is *"They assigned her to the Ankara
office."* t22's filled sentence is *"The editor assigned her to the
hearings the same afternoon."* Shared: **assigned her to the** — the verb,
the pronoun, the preposition and the article, with the key inside it.

The lesson's `forms` block is block 3 and the first `check` is block 4, and
a `check` draws from this category's four questions. So a learner who opens
this lesson has a real chance of meeting t22 one block after reading its
answer in the same frame with the same pronoun.

This compounds with §7.3: the item is decidable on the frame alone, and the
frame is now printed one block above it.

**Why I did not call it blocking.** No learner is misled, the item is
answerable as keyed, no distractor is defensible, and the shared span is a
syntactic frame rather than a scenario — t22's own setting (sluice gates,
tide table, Selin, hearings) appears nowhere in the lesson. It is below the
project's own six-word threshold, which is why every automated check passes.
The harm is to what the item *measures* when it is met as a check, which is
the "worth fixing" tier.

**What would make it blocking**, and the supervisor should decide this
rather than me: if rule 1 is read as absolute — *never* build a question on
a sentence from its own lesson — then this is a violation, and it is the
same construction the previous re-audit called blocking in the sibling
draft. I did not apply it that way because there the whole item had been
rewritten into the lesson's sentence, with the same two candidates in the
same slot; here a lesson sentence acquired four words of an item that
already existed.

**Suggested fix:** one string. Change the `forms` example to a frame t22
does not use — *"They assigned the new registrar to the Ankara office."* —
and the overlap drops to two words with nothing else affected. The row
itself is legitimate and should stay.

### 7.2 The `assign` `contrast` gloss now contradicts the `forms` row below it — **worth fixing**

**Defect:** internal inconsistency (L-side). **Introduced by this repair.**

The gloss still reads *"Bir görev, rol ya da yer belirli bir kişiye veya
ekibe verilir. Nesne bir miktar değil, bir iştir."* — the object is a job,
given to a person. The new `forms` row reverses the direction and makes the
object a person, and t22's key depends on that reversed frame. The repair
updated `forms` and `decision` R1 and left the `contrast` block, which
`CONTENT_GUIDE.md` calls the highest-value block in the schema, asserting
the narrower thing.

A learner who reads only the `contrast` block is told the frame t22 tests
is not a frame of `assign`.

**Suggested fix:** one clause in the gloss — *"…ya da bir kişi belirli bir
göreve veya yere verilir"* — matching what R1 was already widened to say.

### 7.3 The t22 rewrite moved the decision from the context into the frame — **worth fixing**

**Defect:** D4/D10 direction. **Introduced by this repair**, as the price of
closing D1.

Before, the blank's object was a job (*"____ it to the one who had spent two
summers on that stretch of coast"*), `allocate` was live on the frame, and
the surrounding sentences had to decide it — which is exactly why `allocated`
survived round 1 and why the item was blocked. After, the object is a
person, and the frame decides: two options die on the preposition and the
survivor is settled by *assign somebody to something*. The first sentence
now confirms the key rather than carrying it.

This is a real trade and the right one — a second defensible answer is
worse than an item that measures less — but it should be recorded as a
trade rather than as the log's §2.2 claims it, which is that the paragraph
still has to be read.

**Suggested fix:** none required. Record and leave, unless §7.1's fix is
made, in which case the two are worth thinking about together.

### 7.4 t23's keyed sentence is the surface of `pitfall` b7 with the opposite key — **worth fixing**

**Defect:** D-adjacent lure. **Introduced by this repair**, and not noticed
by it.

`pitfall` b7 teaches:

```
WRONG: The company withheld its licence for another year.
RIGHT: The company retained its licence for another year.
```

The rewritten t23 keys: *"The insurer has simply **withheld its
authorisation** until the garage sends the photographs."*

Same shape — institutional subject, `withheld`/`retained` as the live
binary, possessive *its* + abstract noun, duration adjunct — and the
pitfall says the `withheld` version of that shape is the error. The old
t23 object (*"the last part of the payment"*) had no possessive and did not
collide.

**Why it is not blocking.** The pitfall's `why` states the real criterion
(*"kimsenin onun üzerinde bir alacağı yok"*), not a surface rule about
`its`, and t23's first sentence supplies the entitlement in as many words.
A learner who reads the `why` gets it right; only one who memorised the
pair gets it wrong. And the key is strongly idiomatic — *withhold its
consent / its approval* is fixed institutional English.

**Suggested fix:** drop the possessive in t23 — *"____ the authorisation"*
— or give b7 a different noun. Either kills the surface match in one word.

### Recorded, not findings

- **t6 reaches its key by elimination only** (§2.2). Pre-existing,
  untouched this round, no distractor certified.
- **t14's R3 would fire below the key** (§2.4). Harmless as ordered; a
  constraint on anyone who reorders that block.
- **t22 and t23 are two-live-option items**, since the other half of each
  set dies on the preposition or on direction (§3). Both previous passes
  found this; the rewrites neither improved nor worsened it.
- **`preserve` fires on no item in its own category** (§2.5), and
  `acknowledge`, `assess` and `distribute` are never keyed in theirs. Four
  items and five verbs makes this arithmetic, not a defect; it belongs to
  whoever owns kickoff rule 4, as `REPAIR.md` §7 and `REPAIR-2.md` §6.4
  both say.
- **The eight findings `REPAIR-2` §6 declines to fix** — including t18's
  `restrict … to` parse, t5 and t11 written onto their own lessons' rules,
  and t12's *"Nobody questioned"* — are all still open, all still true, and
  I found no reason to reclassify any of them as blocking. §6's reasoning
  for deferring each is sound, and the log gains from listing them.

---

## 8 · What I checked, and what I did not

**Checked, item by item:**

- 120 rule evaluations — every rule of all six `decision` blocks against
  all 24 items, in file order, including below the key (§2). This is the
  measure both blocked categories failed on, and it is the one place a
  "found nothing" verdict has to be earned in the four categories the
  repair did not touch, so I ran those four in full rather than inheriting
  `RE-AUDIT` §1.
- Six non-key options substituted into the two rewritten paragraphs and
  judged on acceptability, not on relative aptness (§3). I formed my own
  verdict on t22's `allocated` before reading the repair's, and I state
  where my confidence differs from its table.
- All three lesson edits against every other block of their own lessons
  and against all four of their category's items (§4).
- The whole diff against the whole log, claim by claim (§5).
- `checkLessonGiveaway` over the draft, plus the full shared-run
  distribution rather than only the pass/fail (§6).
- `npm run draft` on the working tree and on the pre-repair commit; the
  full `tools/validate-content.mjs` in a scratch harness, because
  `npm run draft` does not validate lesson blocks at all (§6).
- Scenario reuse of the new t22 nouns by hand (§6).

**Not checked, and why:**

- **A blind pass.** I read the keys — unavoidable when auditing a repair,
  and it means nothing here is an agreement rate. No `npm run blind` file
  was produced for this round, and none is needed for an adversarial pass,
  but if the supervisor wants a measured agreement rate on the two
  rewritten items, that is a separate blind run by a session that has not
  read this file.
- **Calibration.** No blinded calibration file was handed to me. This pass
  is uncalibrated and should be read as ungraded.
- **The other draft.** `academic-nouns-adjectives` was not read or opened;
  another session is working there.
- **Anything under `data/`, and any code.** Not read except
  `tools/content-checks.mjs`, `tools/check-draft.mjs` and
  `tools/validate-content.mjs`, which I read to know what the checks
  actually cover. Nothing outside this directory was modified, and the
  scratch validator harness was assembled outside the repository.
- **The teaching quality of the four untouched categories** beyond their
  `decision` blocks. `REVIEW-items.md`, `REVIEW-lessons.md` and
  `RE-AUDIT.md` covered that ground, this pass was scoped to what repair 2
  changed plus the traces, and I re-derived only what those needed.
- **Whether the topic should ship as a whole.** Six categories ship on the
  evidence above. The coverage question — five verbs and four items, so
  one verb per category is never keyed — is a kickoff decision that no
  audit can settle.

---

*No file other than this one was written. Nothing was committed or pushed.*

---

## 9 · Supervisor's two edits, verified

Appended after the audit above, at the supervisor's request. The two edits
act on §7.1 and §7.2; I did not write them.

**Scope, checked first.** `git diff` shows exactly two strings changed,
both in the `Allocate & Withhold` lesson — block 1 (`contrast`, the
`assign` gloss) and block 3 (`forms`, the new row's example). Nothing else
in `lessons.json`, and `questions.json` is untouched, so §3's option
substitutions still stand on the text they judged. Every `decision` block
in the file is byte-identical to what §2 traced, and the file still
reserializes to canonical 2-space JSON.

**Verdict: both edits are sound. §7.1 and §7.2 are closed. Do not revert
either.** One cost is recorded below, in edit 1, with an optional
refinement; it is not a defect and does not affect §0's verdict table,
which is unchanged.

### 9.1 The `forms` example — `"The registrar assigned two interpreters to the appeal court."`

**Does it still teach the frame?** Yes. *The registrar* is S, *two
interpreters* is the human object, *to the appeal court* is `to + N` —
`S + assign + person + to + N` instantiated exactly, with a place
destination that the row's own `use` (*"kişi bir göreve ya da yere
verilir"*) names.

**Does the giveaway span go?** Yes. Re-run rather than eyeballed — the
full shared-run distribution, every item against every sentence of its own
lesson:

| longest shared run | items | changed by this edit? |
| --- | --- | --- |
| 3 words, carries the key | t11 (*"she conceded that"*) | no — pre-existing, now the corpus maximum |
| 2 words | **t22** and 17 others | **yes — t22 was 4** |
| 1 word | 5 items | no |

t22 drops from 4 to 2, and it is no longer the most coupled item in the
topic. The four-word span that made §7.1 — *assigned her to the*, the key
inside it and the item's own pronoun — is gone.

Two further measurements the supervisor asked for:

- **The new example against all 24 filled items in the topic:** longest run
  **2 words**, and in every case it is *"to the"*. Nothing else reaches 2.
- **The new example against every other lesson sentence in the topic:**
  longest run **2 words**, again *"to the"*.
- `checkLessonGiveaway` still reports **0**, which it also did before the
  edit — as the supervisor says, that measure was never the one that
  caught this, which is why the distribution above is the answer.

*Named so a later pass does not rediscover it:* t22 still shares two words
with a lesson sentence — *"assigned her"*, against the **pre-existing**
ditransitive row *"They assigned her the case."*, which repair 2 did not
add and this edit does not touch. Two words is the corpus noise floor (18
of 24 items sit there), and the two frames differ, so the shape-match that
made §7.1 is not reconstructible from it. Not a finding.

**Collisions.** None that matter.

- No content word of the new sentence — *registrar*, *interpreters*,
  *appeal*, *court* — appears in any item paragraph in the topic.
- The only lexical-family contact in the corpus is *registrar* here against
  *registry* in t14. Different word, different lesson, different category,
  different verb, no shared decision. Cosmetic.
- Against other lesson sentences: the closest are *"The permit restricts
  fishing to the winter months."* and *"They withheld the information to
  the committee."*, both at *"to the"*. No conflict — neither is about
  `assign`.
- **No `decision` rule fires differently.** The rules are byte-identical,
  and they are evaluated against item paragraphs rather than lesson
  examples, so a changed example cannot reach them. §2.6's trace stands
  verbatim: 4/4 keys, 0 distractors certified, the widened R1 firing at t22
  and nowhere else.

**One cost, recorded, and it does not warrant a revert.** The replacement
sentence sits in the one place where `assign` and `allocate` genuinely
overlap: an **indefinite plural** human object dispatched to an
institutional slot. *"The registrar allocated two interpreters to the
appeal court"* is acceptable English — court interpreters are a pooled
resource a listing office allocates, which is the scheme reading §3.1
identified as what licenses `allocate` with human objects. The sentence it
replaced (*"her to the Ankara office"* — a definite individual, a staff
posting) sat outside that overlap.

Why this is not a defect and why I would not revert:

- nothing is keyed on a `forms` row; its job is to show that `assign` takes
  the pattern, not that no other verb does;
- no item in the category has that shape, so no learner can be sent to a
  wrong answer by it;
- t22's exclusion of `allocated` is untouched — it rests on t22's own
  paragraph (active, named individual, no pool, chosen on fitness), not on
  this example;
- and the giveaway it removes was the larger problem by a wide margin.

**Optional refinement, zero cost, offered rather than required:** a
definite singular human chosen on fitness exemplifies the frame at a point
where the lesson's own contrast is sharp instead of blurred — e.g. *"The
coach assigned the youngest runner to the final leg."*, which no rival
verb in the block takes and which shares no vocabulary with any item or
lesson sentence in the topic. Either way, the edit as made is a net
improvement and closes §7.1.

### 9.2 The `assign` `contrast` gloss

> *"Bir görev, rol ya da yer belirli bir kişiye veya ekibe verilir; nesne
> bu görev de olabilir, göreve gönderilen kişi de. Nesne hiçbir zaman bir
> miktar değildir."*

**One correction to the request before the answer:** there are **three**
`assign` rows in that `forms` block, not five — the block has seven rows
across five verbs. I checked the gloss against all three.

**Against the three `assign` `forms` rows:**

| row | gloss covers it? |
| --- | --- |
| `S + assign + N + to + N` — *"They assigned the case to a team."* | yes — the first disjunct, object = the task |
| `S + assign + person + to + N` — the new row | **yes — this is the disagreement §7.2 named, and it is closed** |
| `S + assign + N + N` — *"They assigned her the case."* | yes for its direct object (the task). The person in a ditransitive is a recipient rather than *"göreve gönderilen kişi"*, so the gloss describes that row loosely rather than wrongly — and `CONTENT_GUIDE.md` caps a `gloss` at one or two sentences, which rules out enumerating ditransitive roles. No contradiction |

**Against `decision` R1.** Exact agreement, which it did not have before:
the gloss now mirrors both of R1's disjuncts (*a task to a person* / *a
person to a task or place*) and repeats R1's first discriminator, *bir
miktar değil*. The block and the procedure now say the same thing about
the same verb.

**Against all four items:**

- **t21** — `assign` is not on the paper; the *"never an amount"* sentence
  correctly keeps it away from *"two hundred thousand lira"* anyway.
- **t22** — the key's frame is licensed by the `contrast` block for the
  first time. This is the whole point of the edit and it lands.
- **t23** and **t24** — `assigned` / `assigns` are distractors, and their
  objects (*its authorisation*, *the rights*) are neither a task nor a
  person, so the gloss's positive enumeration excludes them exactly as R4
  and R1 do. The exclusion is no weaker than under the old wording.

**Does it still draw the line the block exists to draw?** Yes, and more
honestly than before.

- **Against `distribute`** — untouched: *"belirli bir kişiye veya ekibe"*
  against *"aynı şey çok sayıda alıcıya yayılır"*. The new example's plural
  object does not blur this, because `distribute` is about many
  *recipients*, not many objects.
- **Against `allocate`** — the line is now *a task or a person* against
  *"sınırlı bir kaynağın bir bölümü … vurgu payın büyüklüğündedir"*, and
  the `allocate` gloss's own wording carries it: a person is not a portion
  of a resource whose size is the point.

The honest consequence, stated because it is the substance of the edit:
widening `assign`'s object to include persons does move it one step toward
`allocate`, since English does allocate people. The old gloss drew the line
crisply and **falsely** — it excluded the very frame t22's key uses, which
is what made it §7.2. The new one draws it where the line actually is:
slightly less crisp, true instead of false. For a lesson that is the right
trade, and it is the same trade §4.1 credited the `withhold` gloss with.

**Schema.** 158 characters, under the 200-character `gloss` warning; two
sentences; Turkish; no markup. `npm run draft` is clean, and the full
`tools/validate-content.mjs`, re-run in the scratch harness described in
§6, reports **0 findings attributable to the draft** — the same seven
harness artifacts as before and nothing else.

### 9.3 What this changes in the report above

- **§7.1 — closed** by the `forms` example. One residual recorded in §9.1,
  non-blocking, with an optional refinement.
- **§7.2 — closed** by the gloss.
- **§7.3 and §7.4 — still open.** Neither edit touches t22's context/frame
  balance or t23's collision with `pitfall` b7, and neither was expected to.
- **§0's verdict table — unchanged.** `Allocate & Withhold` shipped before
  these edits and ships after them; the edits remove two of the four
  worth-fixing findings rather than any blocking one.

*Nothing was committed. `lessons.json` is left exactly as the supervisor
edited it; the only file this session has written is this one.*
