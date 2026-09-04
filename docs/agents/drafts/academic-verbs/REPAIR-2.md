# Repair 2 — `academic-verbs`

Second repair pass, 2026-09-04, working from `RE-AUDIT.md` §5.4, §4.4, §4.5
and §8. Written by a session that wrote neither `REPAIR.md` nor the
re-audit.

Scope: `docs/agents/drafts/academic-verbs/` only. Nothing under `data/`,
no code, and nothing in the `academic-nouns-adjectives` draft was touched.
Not committed, not pushed.

`npm run draft -- docs/agents/drafts/academic-verbs` →
**24 questions, 6 lessons, 0 errors, 0 warnings** (clean before and after;
it was never the thing that was failing).

---

## 0 · What changed, in one table

| file | where | change |
| --- | --- | --- |
| `lessons.json` | `Sustain & Restrict` → `decision` | all five rules restated over **the blank's own object** (§1) |
| `lessons.json` | `Allocate & Withhold` → `contrast` `withhold` gloss | *"Verilmeyen şey öznenin kendi malı değildir"* → the criterion R4 already uses (§3.3) |
| `lessons.json` | `Allocate & Withhold` → `forms` | one new row: `S + assign + person + to + N` (§2.3) |
| `lessons.json` | `Allocate & Withhold` → `decision` R1 | widened to cover *person → post*, the frame the new t22 uses (§2.3) |
| `lessons.json` | `Examine & Establish` → third `pitfall` | new `wrong`/`right`/`why` — the old `wrong` was acceptable English (§4) |
| `questions.json` | t22 | paragraph, explanation, tip, three optionNotes (§2) |
| `questions.json` | t23 | paragraph, explanation, tip, three optionNotes (§3) |

Nothing else in either file was edited. `Change & Emergence`,
`Cause & Consequence` and `Claim & Concede` are untouched; the re-audit
passed all three and nothing here reaches them.

---

## 1 · `Sustain & Restrict` — the `decision` block (RE-AUDIT §5.4)

### 1.1 The defect

R4's condition was *"Korunan şey kaybolabilir ya da zarar görebilir bir
değerse ve amaç onu geleceğe taşımaksa"* → `preserve`. At t17 the
protected thing **is** the seeds — perishable, held for decades — so the
condition is satisfied on its own terms, R4 sits above R5, and a learner
running the block as a checklist stops on `preserve`, which is option 4 on
that item and is not the key. The same rule fires at t18 (the protected
thing is the terns) and is masked only by R3 sitting above it.

### 1.2 The fix

Round 1 fixed the identical defect in `Change & Emergence` by binding two
rules to the blank's **subject**. Here the binding is over the blank's
**object**, and it is applied to all five rules rather than only the two
that misfire — a block where two rules name the blank and three do not
reads as three unbounded rules, which is how this defect got in.

| # | before | after |
| --- | --- | --- |
| R1 `suspend` | "Durdurma geçici olduğu belirtiliyorsa — …" | "**Boşluğun nesnesi bir faaliyet, hizmet ya da izinse** ve durdurulması geçiciyse — …" |
| R2 `abandon` | "Bırakma kalıcıysa ve cümlede geri dönüş öngörülmüyorsa" | "**Boşluğun nesnesi bir plan, proje ya da işse** ve ondan büsbütün vazgeçiliyorsa; …" |
| R3 `restrict` | "Faaliyet sürüyor ama bir tavan, kota ya da koşulla daraltılmışsa" | "**Boşluğun nesnesi bir erişim, miktar ya da kapsamsa** ve faaliyet durmadan bir sınır, tavan ya da koşulla daraltılıyorsa" |
| R4 `preserve` | "**Korunan şey** kaybolabilir … bir değerse ve amaç onu geleceğe taşımaksa" | "**Boşluğun nesnesi** kaybolabilecek ya da zarar görebilecek **değerli şeyin kendisiyse** ve amaç onu geleceğe taşımaksa" |
| R5 `maintain` | "**Korunan şey** bir düzey, hız ya da işleyişse ve …" | "**Boşluğun nesnesi** bir düzey, hız ya da işleyişse ve …" |

Rule order and every `then` are unchanged.

The binding is not invented for the occasion: the lesson's own `forms`
block already gives each verb the object it takes (`restrict` — erişim,
miktar, kapsam; `suspend` — bir faaliyet, hizmet ya da izin; `abandon` —
plan, proje, yer; `preserve` — benzersiz ya da kırılgan bir değer;
`maintain` — düzey, hız, standart). The rules were simply not carrying
what the block above them said.

### 1.3 The whole block, run as a literal checklist over all four items

Every rule evaluated in file order on every item, whether or not an
earlier rule already fired.

**t17** — key `maintain`; options `maintain / suspend / abandon / preserve`.
Blank's object: *a temperature of minus eighteen degrees*.

| rule | fires? | on what | word it names on the paper? |
| --- | --- | --- | --- |
| R1 suspend | **no** | a temperature is not a faaliyet/hizmet/izin; and the paragraph demands *"without an hour's interruption"* | `suspend` is on the paper — not certified |
| R2 abandon | **no** | a temperature is not a plan/proje/iş | `abandon` on the paper — not certified |
| R3 restrict | **no** | nothing is narrowed; the level must stay constant | `restrict` not on the paper |
| R4 preserve | **no** | the perishable value is the **seeds**; the blank's object is the temperature | `preserve` on the paper — **not certified. This is the repair.** |
| R5 maintain | **YES** | a level held by continuous effort — the generators take over when the mains fail | **key** |

**t18** — key `restricts`; options `restricts / maintains / suspends / preserves`.
Blank's object: *access*.

| rule | fires? | on what | word it names on the paper? |
| --- | --- | --- | --- |
| R1 suspend | **no** | *"No part of the beach is closed to walkers at any point in the year"* — access is not stopped at all, so "durdurulması geçici" has nothing to attach to | `suspends` on the paper — not certified |
| R2 abandon | **no** | access is not a plan/proje/iş | `abandon` not on the paper |
| R3 restrict | **YES** | access is *erişim*; the activity continues, narrowed by a season and a marked line | **key** |
| R4 preserve | **no** (checked below the key deliberately) | the protected thing is the terns; the blank's object is access | `preserves` on the paper — **not certified even when R3 is removed.** Under the old wording R4 fired here and only R3's position hid it |
| R5 maintain | **no** | access is not a düzey/hız/işleyiş, and nothing falls when effort stops | `maintains` on the paper — not certified |

**t19** — key `suspended`; options `suspended / maintained / restricted / abandoned`.
Blank's object: *the study*.

| rule | fires? | on what | word it names on the paper? |
| --- | --- | --- | --- |
| R1 suspend | **YES** | a study is a faaliyet; *"while an independent panel looked into the case"* is a condition and *"enrolment started again in September"* a resumption | **key** |
| R2 abandon | **no** | it resumed — no permanent giving-up | `abandoned` on the paper — not certified |
| R3 restrict | **no** | the study is not erişim/miktar/kapsam, and it is stopped, not narrowed | `restricted` on the paper — not certified |
| R4 preserve | **no** | a study is not a perishable value carried to the future | `preserve` not on the paper |
| R5 maintain | **no** | not a level; and the study does not continue | `maintained` on the paper — not certified |

**t20** — key `abandoned`; options `abandoned / restricted / suspended / preserved`.
Blank's object: *the restoration*.

| rule | fires? | on what | word it names on the paper? |
| --- | --- | --- | --- |
| R1 suspend | **no** | first half passes (a restoration is a faaliyet), second fails: *"altogether"*, site sold, scaffolding down *"for the last time"* — no period, no condition, no return | `suspended` on the paper — not certified |
| R2 abandon | **YES** | a proje, given up altogether, no return foreseen | **key** |
| R3 restrict | **no** | the work is not narrowed, it stops | `restricted` on the paper — not certified |
| R4 preserve | **no** | the blank's object is the restoration (the work), not the stonework; and the purpose is abandoned, not carried forward | `preserved` on the paper — not certified |
| R5 maintain | **no** | not a level | `maintain` not on the paper |

**4/4 keys reached by rule; 0 distractors certified, at any position in the
block rather than only above the key.**

### 1.4 What this fix costs, stated plainly

R4 (`preserve`) now fires on **no item in its own category**, because
`preserve` is never the key there — it is a distractor at t17, t18 and t20
and nowhere the answer. That was already true before this repair (the
3/4-never-keyed shape `RE-AUDIT` §2.6 defers to the supervisor); the
change is that the rule no longer reaches an item *wrongly*. A rule that
correctly describes a verb the category never keys is teaching, not a
misfire, but the next auditor should know it was noticed rather than
missed.

---

## 2 · t22 — making `allocated` false rather than less apt (RE-AUDIT §4.4)

### 2.1 What the re-audit found

Round 1 replaced the opening sentence (removing *"wanted"* and the
contested-resource frame), but the review's case for `allocated` rested on
usage, not competition: English allocates work (*cases are allocated to
caseworkers*, *shifts are allocated*). Worse, the clause round 1 **kept** —
*"and gave the others the planning meeting and the school inspection"* —
rebuilt the apportionment frame by itself: one editor dividing a fixed set
of jobs among a fixed set of reporters is exactly what `allocate` names.

### 2.2 The rewrite

Before:

> Nobody on the desk was competing for the flood story; it meant two days
> in the rain. The editor ____ it to the one who had spent two summers on
> that stretch of coast, and gave the others the planning meeting and the
> school inspection.

After:

> The inquiry into the sluice gates needed somebody who could read a tide
> table, and Selin was the only reporter on the paper who could. The
> editor ____ her to the hearings the same afternoon, and the planning
> meeting waited until she was back from the coast.

Two things changed, and both are load-bearing:

1. **The blank's object is now a definite, named person, not a job.**
   `assign somebody to something` is the frame; `allocate` wants an
   apportionable quantity.
2. **The apportionment frame is gone, and its absence is stated as
   narrative rather than as a rule.** *"the only reporter on the paper who
   could"* leaves no set to divide among, and *"the planning meeting
   waited until she was back"* replaces the clause that used to hand the
   other jobs out. Nothing else is being shared out anywhere in the
   paragraph.

The paragraph still has to be read: the fact that decides `assign` over
`allocate` — one qualified person, chosen for what she knows, no pool —
lives in the first sentence, not beside the blank.

### 2.3 The two lesson edits this forced, and why they are not free

The new item uses `assign + person + to + N`, which the lesson taught only
in the other direction (`assign + task + to + person`). Two consequences,
both handled:

- **`forms` gains one row** — `S + assign + person + to + N`, *"They
  assigned her to the Ankara office."* It is a real second frame of the
  verb, not a row invented to square off the grid, and its English shares
  no content word with any paragraph in the category.
- **`decision` R1 is widened** — *"… ya da belirli bir kişi belirli bir
  göreve veya yere gönderiliyorsa"*. Without it the block would no longer
  reach t22's key. The widening is re-traced over the whole category in
  §3.4; it fires nowhere it did not fire before.

### 2.4 All three wrong options, substituted into the rewritten paragraph

The test is `question-author.md`'s: *would a competent teacher accept it* —
not *is it worse than the key*.

| option | filled sentence | verdict |
| --- | --- | --- |
| `allocated` | "The editor **allocated** her to the hearings the same afternoon…" | **not accepted.** `allocate` apportions a share of a stock according to a scheme. The paragraph supplies no stock (one qualified reporter), no scheme, and a definite named individual as the object; the choice is made on fitness, which is `assign`'s territory. |
| `withheld` | "The editor **withheld** her to the hearings…" | **not accepted.** `withhold` takes `from`, never `to`; and the meaning — keeping her back — is contradicted by *"the same afternoon"* and *"until she was back from the coast"*. |
| `retained` | "The editor **retained** her to the hearings…" | **not accepted.** `retain` takes no `to`-phrase in any of its senses. The engage/hire sense (*retain someone **to do** X*, *retain someone **as** Y*) needs a to-infinitive or `as`, neither of which is present, and she is already on the paper's staff. |

**Residual risk, recorded rather than hidden.** The exclusion of
`allocated` is a usage judgment, not a syntactic impossibility.
Institutional English does say *"she was allocated to Ward 4"* and *"two
officers were allocated to the case"* — always with an apportioning scheme
in view (wards, caseloads) and usually in the passive with an indefinite
or plural human. Active, with a named agent, a named individual and a
one-off event, and with the paragraph stating there was exactly one person
who could do the job, I judge it something a teacher marks. That judgment
is the thing a third auditor should test first, because it is the weakest
link in this repair.

**Why not simply swap the option out.** Replacing `allocated` with
`distributed` would have made the exclusion certain in one line. It was
rejected on two grounds: it removes the contrast the item exists to test
(`assign` vs `allocate` is keyed nowhere else — at t24 both are
distractors), which is the *"never make an item easier by removing what it
tests"* rule; and it would return `distribute` to 3/4-never-keyed, the
shape `RE-AUDIT` §2.6 says this round should stop making worse.

---

## 3 · t23 — making `retained` false, without a rule English does not honour (RE-AUDIT §4.5)

### 3.1 What the re-audit found

Round 1 added *"and it does not dispute that the money is owed"* and
leaned on a new lesson claim: `retain` presupposes ownership. English does
not honour it — withholding a sum that **is** owed, pending documentation,
is exactly what contract *retention* names (an employer retains 5% until
defects are made good). So the fix rested on an over-claim of the same
shape as the `emerge` claim round 1 had just removed, and `retained`
survived at the item.

### 3.2 The rewrite — change the object, not the rule

The counter-example applies to **a sum of money sitting in the payer's own
account**. It does not apply to an authorisation, because an authorisation
that has not been issued is not a thing anyone holds. So the object moved
and the lesson's account of `retain` was left alone.

Before:

> … and it does not dispute that **the money is owed**. It has simply ____
> **the last part of the payment** until the garage sends the photographs…

After:

> … and it does not dispute that **the repairs are covered**. It has
> simply ____ **its authorisation** until the garage sends the photographs
> it asked for in March, and the family has been driving a hire car ever
> since.

*"the repairs are covered"* still establishes the entitlement `withhold`
requires (the family has a right to the decision), which is what R4 tests;
the hire car still shows the consequence and that nothing has been issued.

### 3.3 The lesson edit this allowed

The `withhold` gloss claimed *"Verilmeyen şey öznenin kendi malı
değildir"* — false for an unpaid sum in the insurer's own account, and
`RE-AUDIT` §4.5 flagged it as overstating what R4 says correctly one block
below. It now reads *"Belirleyici olan, karşı tarafın o şey üzerinde bir
hakkının bulunmasıdır"*, which is R4's criterion and is true.

The `retain` gloss and R5 were **not** changed: with t23 no longer resting
on them, *"zaten kendinin olan bir şeyi elde tutmak"* is the prototypical
sense and still decides t24 correctly. It remains a tendency stated as a
rule; see §6.

### 3.4 All three wrong options, substituted into the rewritten paragraph

| option | filled sentence | verdict |
| --- | --- | --- |
| `retained` | "It has simply **retained** its authorisation until the garage sends the photographs…" | **not accepted.** `retain` requires something the subject holds. The authorisation has not been issued — the family are still in a hire car — so there is no object in hand to keep. The retention counter-example that defeated the previous version is about a *sum of money already in the payer's account*; an authorisation is neither a sum nor held. |
| `assigned` | "It has simply **assigned** its authorisation…" | **not accepted.** `assign` gives a task or role to a person; there is no recipient in the clause and an authorisation is not a task. The paragraph is about something *not* being given. |
| `distributed` | "It has simply **distributed** its authorisation…" | **not accepted.** `distribute` spreads one thing across many recipients; there is one file, one family, one decision — and nothing has been given at all. |

`assigned` and `distributed` are thin here, as they were before the
rewrite: they are the giving-half of a category whose blank withholds, so
they fail on direction. That is a reason the lesson teaches (the second
`contrast` block is *"Verilmediğinde"*), so they are wrong options rather
than dead ones — but they are not the item's live choice, and the item is
really `withhold` vs `retain`. Unchanged from the version the re-audit
examined, and recorded so it is not read as new.

### 3.5 The `Allocate & Withhold` `decision` block, run over all four items

The trace `REPAIR.md` never made, re-made here after two of its four items
changed and R1 was widened.

**t21** — key `allocates`; options `allocates / distributes / withholds / retains`.

| rule | fires? | on what |
| --- | --- | --- |
| R1 assign (widened) | **no** | what is given is money to a heading, not a task to a person; nobody is sent anywhere. The new disjunct adds nothing here |
| R2 allocate | **YES** | a portion of next year's budget set aside for one heading, *"cannot be moved to anything else"* — **key** |
| R3 distribute | no | one heading, no recipients |
| R4 withhold | no | nothing is held back |
| R5 retain | no | nothing is kept |

**t22 (rewritten)** — key `assigned`; options `assigned / allocated / withheld / retained`.

| rule | fires? | on what |
| --- | --- | --- |
| R1 assign (widened) | **YES** | a named person is sent to a specific job — the disjunct added in §2.3 — **key**. Under the old R1 this item would have reached no rule at all |
| R2 allocate | no | no limited resource, no share, no heading |
| R3 distribute | no | one recipient |
| R4 withhold | no | nothing is held back |
| R5 retain | no | nothing is kept |

**t23 (rewritten)** — key `withheld`; options `withheld / assigned / retained / distributed`.

| rule | fires? | on what |
| --- | --- | --- |
| R1 assign (widened) | **no** | an authorisation is not a task, role or case; no person is sent anywhere |
| R2 allocate | no | no share of a resource |
| R3 distribute | no | one recipient |
| R4 withhold | **YES** | *"it does not dispute that the repairs are covered"* — the family's right — and the insurer deliberately does not issue it — **key** |
| R5 retain | no | blocked by *"başkasının o şey üzerinde bir alacağı yoksa"*: the family has one. Nothing is held either |

**t24** — key `retains`; options `retains / withholds / allocates / assigns`.

| rule | fires? | on what |
| --- | --- | --- |
| R1 assign (widened) | **no** | rights are not a task, role or case, and no person is sent anywhere. The widening does not reach this item |
| R2 allocate | no | rights are not a share of a resource |
| R3 distribute | no | one holder |
| R4 withhold | no | the rights passed to the university by agreement; nobody has a claim |
| R5 retain | **YES** | the university keeps what is already its own and nobody has a claim — **key** |

**4/4 keys; 0 distractors certified.** The widened R1 fires at t22 and
nowhere else.

### 3.6 Polarity, re-counted after both rewrites

Marking each option G (gives out) or K (holds back):

| item | options | key | survive polarity |
| --- | --- | --- | --- |
| t21 | allocates G, distributes G, withholds K, retains K | G | 2 |
| t22 | assigned G, allocated G, withheld K, retained K | G | 2 |
| t23 | withheld K, assigned G, retained K, distributed G | K | 2 |
| t24 | retains K, withholds K, allocates G, assigns G | K | 2 |

2/2/2/2, unchanged. `RE-AUDIT` §3.3's further point — that at t21 and t22
the holding half also falls to the following `to`, before polarity — is
**still true of both**, and t23 no longer offers that shortcut (its blank
takes a bare object). Not fixed; see §6.

---

## 4 · `Examine & Establish` — the `pitfall` whose `wrong` was acceptable (RE-AUDIT §2.4)

Round 1 replaced *"Researchers monitored the cause of the failure."* (a
giveaway) with:

```
WRONG: The board monitored which of the two designs was cheaper.
RIGHT: The board determined which of the two designs was cheaper.
```

`monitor` + wh-clause is standard English, and costs move over time, so
monitoring which of two designs is cheaper is a sentence a teacher takes.
A pitfall that marks acceptable English as an error is a defect the
project has already named once, in this topic's `Claim & Concede` b8.

The fix keeps the pair (`monitor` → `determine`, differing in exactly the
verb) and moves the object to a fact that **cannot change**, which is what
makes `monitor` genuinely impossible:

```
WRONG: The librarian monitored which of the two copies was the older.
RIGHT: The librarian determined which of the two copies was the older.
why:   monitor süre boyunca değişen bir şeyi izlemektir. Hangi nüshanın
       daha eski olduğu değişmeyen, geçmişte kapanmış bir olgudur; böyle
       bir soruyu bir kerede cevaplayıp kapatmak determine'dir.
```

Checked for the defect the last replacement introduced: neither sentence
shares a content word with t13's paragraph (fire, roof space,
investigators, extractor fan) or t16's (sensors, plant, tank, temperature,
twelve-month record), the two items in the category whose keys are
`determine` and `monitor`. The category's `decision` block was not
touched, so `RE-AUDIT` §1.4's 4/4 trace stands unchanged.

---

## 5 · `Change & Emergence` `pitfall` b8 (RE-AUDIT §2.1) — already fixed, verified

The re-audit's §2.1 quotes a `why` reading *"… bir şey başka bir şeye
dönüşür **ve cümle neye dönüştüğünü verir**"*. That string is not in
`lessons.json`: commit `063f3ae` — the re-audit's own commit — replaced it
in the same change that recorded the finding. The file now reads:

> "evolve, bir şeyin daha önceki hâlinden kademe kademe gelişmesini
> anlatır. Yeni kurulan bir araştırma alanının öncesinde bir hâli yoktur;
> burada anlatılan bir gelişme değil, ortaya çıkıştır — o da emerge'dir."

Checked against the two objections the re-audit raised: it no longer
requires an `evolve` sentence to name what the thing turned into (so it no
longer contradicts the lesson's own *"The method evolved slowly."* and
*"The theory evolved through several stages."*, or the optional complement
in `forms`), and it no longer points at `evolved` on t2, the one item
where that option is a live lure. **Nothing to do; no edit made here.**

---

## 6 · What the re-audit asked for that I did **not** do

Listed separately, because a log that quietly drops a finding costs the
next pass its starting point.

1. **§2.5 — `forms` b3 / `pitfall` b8 teach `restrict + N + to + N` as
   "the limit is what follows `to`", which misparses t18's locative
   *"access to the eastern half"*.** Not fixed. The lesson's teaching is
   correct English and the item's wording is the reason all four options
   are syntactically live there — moving the blank into the `N to N` frame
   would kill `maintains`, `suspends` and `preserves` on syntax and turn a
   four-option item into a one-option one. The interaction the re-audit
   names is real (under the taught parse t18's second sentence contradicts
   its first), and the key survives on either parse. Left open, and it
   should go to whoever decides whether the frame or the item moves.
2. **§2.2 — t5 and t11 were written onto their own lessons' rules.** Not
   fixed. Those categories ship; unpicking the coupling means rewriting
   two items the re-audit found otherwise clean, which is how a repair
   trades one defect for a worse one. It is a finding about *how* the
   round was worked, and it belongs to the supervisor.
3. **§2.3 — t24's `pitfall` (withhold/retain on a licence) is now the
   item's live binary.** Not fixed. Every withhold/retain pitfall in a
   five-verb category rehearses either t23 or t24, since those are the
   only two items the pair decides; replacing it with a different pair
   moves the rehearsal rather than removing it. Recorded, not repaired.
4. **§2.6 — `acknowledge` at 4/4-never-keyed, and the same shape
   elsewhere.** Not touched. It is a coverage decision about kickoff rule
   4 that `REPAIR.md` §7 already referred to the supervisor, and fixing it
   means re-keying items in categories that pass. This round did not make
   it worse: `distribute` stays at 2/4 (the swap that would have raised it
   was rejected, §2.4), `allocate` at 2/4 with one key, and `preserve` at
   3/4-never-keyed as before.
5. **§3.3's third point — at t21 and t22 the holding half is eliminable on
   the following `to`, before polarity and before any lexis.** Still true
   at both. t23 no longer offers the shortcut, but that is a side effect
   of the object change, not a fix. Fixing it at t21/t22 means finding a
   frame in which `withhold` and `retain` are both grammatical and both
   wrong on meaning, which neither paragraph currently supports.
6. **§6.2 — the structural rehearsals at t17, t21 and t13** (the pitfall
   pairs survive with different nouns; t13 still has two `determine`
   pitfalls). Not fixed. The review's specific suggestions — *"move the
   pitfall to a different pair"*, *"one pitfall, not two"* — were not
   implemented here either, for the reason in item 3: a new pair has to be
   invented and re-checked for its own acceptable-`wrong` problem, which
   is exactly the defect §2.4 was created by.
7. **§5.1 — t12's *"Nobody questioned the measurements"* hands the answer
   to a learner who knows *question ≈ dispute*.** Not fixed. The re-audit
   notes the reason for deferring it has expired now that t11's options
   have settled; t11 is untouched by this round, so nothing here changes
   the position.
8. **§3.2's reservation that t11's exclusion of `acknowledged` rests
   entirely on one appositive.** Not touched — that category ships and the
   re-audit confirmed the exclusion holds.

## 7 · What a third auditor should test first

In this order, because that is roughly the order of my own confidence:

1. **t22's `allocated`** (§2.4). A usage judgment, not a syntactic bar.
   If a teacher would take *"The editor allocated her to the hearings"*,
   this repair failed the same way the last one did, and the honest
   remedy is then the option swap I rejected — with its cost to coverage
   accepted explicitly rather than argued away.
2. **The `Sustain & Restrict` block on items other than t17** (§1.3). I
   evaluated all five rules on all four items including below the key,
   but three of the five conditions changed, and a widened R1 or R2 that
   fires early on an item I read one way is the failure mode.
3. **t23's `retained`** (§3.4). *"Retained its authorisation"* is
   incoherent to me; the reading that would rescue it — "kept its power to
   authorise" — is blocked by *"until the garage sends the photographs"*,
   which makes the sentence say the insurer went on approving until a
   condition was met. If that reading survives for someone else, the
   object needs to move again, not the lesson.
4. **The `forms` row and R1 widening in `Allocate & Withhold`** (§2.3).
   They exist to serve one item, which is the shape of an edit that
   over-fits. My case is that `assign + person + to + N` is a real frame
   of the verb that the lesson simply did not carry — but it was added
   because an item needed it, and that should be said out loud.
