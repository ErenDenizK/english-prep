# Independent re-audit — `passive-voice`, third repair round

2026-09-05. Scope: `data/passive-voice/passive-voice.json`, all six
categories, all 24 items, all six `decision` blocks. I did not write the
content and I did not write `docs/audit/repair-passive-voice-2.md`. I
repaired nothing.

Method: `docs/agents/re-audit.md`. Read against `docs/CONTENT_GUIDE.md` and
`docs/agents/question-author.md`. The previous audit is
`docs/audit/re-audit-passive-voice.md`; the round under audit is
`docs/audit/repair-passive-voice-2.md`, whose diff is `f543ec9..HEAD` on this
file (two commits: `ce88106` snapshot, `5992f9d` the finish).

---

## 0 · Verdict

| category | verdict | the one defect that blocks it |
| --- | --- | --- |
| **Tense Forms in Passive** (t1–t4) | **DOES NOT SHIP** | **t1.** *"Fresh bread **has been baked** every morning at this bakery, using the same recipe that's been in the family for three generations"* is a sentence a competent teacher accepts — the recipe clause supplies exactly the durational frame the perfect wants. `question-author.md` rule 2. The category's *assigned* defect (t3's and t4's keyed sentences standing in their own `forms` block) is genuinely closed; this is the one the round named in its did-not-do list and left. |
| **Passive with Modals** (t5–t8) | **SHIPS** | Nothing blocking. Both `decision` blocks reach all four keys in file order; all four items pass the paragraph-deleted test; the sweep is clean. Costs in §4 and §6. |
| **Modal Perfects in Passive** (t9–t12) | **SHIPS** | Nothing blocking. `decision` reaches all four keys; all four pass the deleted test. The doubled-modal tell is real, is not a within-item giveaway, and is ruled on in §6. |
| **Causative: Have/Get Something Done** (t13–t16) | **SHIPS** | Nothing blocking. t14's rewrite is sound: the deleted test now leaves two options the label admits equally and only tense separates them, which is what it was rewritten for. Three recorded costs in §3.4 and §8. |
| **Passive Reporting Structures** (t17–t20) | **DOES NOT SHIP** | **t18 against its own `decision` block.** r1 requires *"the blank at the start of the sentence **and a full clause (subject + verb) after it**"*. The rewrite moved the subject **inside the option** (`It is believed that **they**`), so what follows the blank is a bare VP and r1 does not fire. r2 and r3 do not fire either. **r4 fires** — the reported event is earlier and the subject did it — and returns `to have + V3`, which on this item is `They are believed to have`, a distractor. This is the identical failure the round *did* fix in the `Causative` block this same night (r2 gained *"ister boşluktan sonra, ister seçeneğin içinde"*) and did not apply here, to the block whose items it had just rewritten. |
| **By + Agent: Include vs Omit** (t21–t24) | **DOES NOT SHIP** | **t23 against its own `decision` block.** r1's new qualifier reads *"…ve boşluktan sonra **onu** söyleyen bir öbek yoksa"* — no phrase after the blank naming **the agent**. On t23 nobody knows who forged the letter, and the phrase after the blank (*a modern ballpoint pen*) names an **instrument**, not the agent. So r1 still fires and still returns `Passive without an agent` = `was written`, a distractor. The learner who reasons *correctly* about the pen at r1 gets the wrong answer. r4 got the explicit *"kullanılan bir araç ya da malzeme değil"* disambiguator in the same edit; r1 did not. The log's own trace (§4.3) reads r1 as *"a phrase follows the blank"*; the rule does not say that. |

**Two categories ship, one ships that the previous audit blocked, three do
not.** The round closed every defect it was assigned except one it named and
deferred (t1), and it introduced no new defect in a question. Both of the
blocking findings above are `decision`-block failures on items or rules the
round itself moved, and both are the same shape: **the fix was applied to one
rule and not to the identical rule next door.**

---

## 1 · What I ran

```
npm run check                      # clean: format, validate, palette, 136 tests
npm run validate                   # 2 warnings, both in other files
checkLessonGiveaway (run ≥ 6)      # 0 rows in this topic
stricter sweep (run ≥ 3 + key + shared content word)   # before 15, after 2
option-string sweep over the lesson fields lessonSentences() never reads
```

- `npm run check` is green, 136/136. `npm run validate` prints two warnings,
  in `academic-nouns-adjectives` and `roadmap.json`; none in `passive-voice`.
- The identical-option-set warning the round's §5.2 argument rests on is real
  and does fire — it is one of the two warnings, on
  `academic-nouns-adjectives-t13`/`t16`.
- Paragraph-deleted test run by me on **all 24 items**, not only the six the
  brief names.
- All six `decision` blocks walked rule by rule in file order over all four of
  their own items — including the two blocks this round did not open.
- Every `optionNotes` key checked against its own option set, every note
  checked for length and for covering the key: **all 24 items clean**, all
  three wrong options covered on every item, no note on a key, none over 160
  characters.

---

## 2 · The paragraph-deleted test, run by me

The test as the brief states it: delete the paragraph, look at the four
options and the category label — which `js/quiz.js` prints above every
question — and ask whether one option still picks itself out by being **the
only well-formed one**, **the only one the label admits**, or **the only one
of its shape**. I ran it on all 24 items. Column *survivors* is how many
options are still live after the label has done all it can.

### 2.1 `Passive Reporting Structures` — the three rewritten items

| item | options | survivors | result |
| --- | --- | --- | --- |
| **t17** | `is said to have warned` · `is said to warn` · `is said to be warning` · `is said to have been warned` | **4** | **Passes.** All four are `is said to …`; all four are well-formed English strings; none is of a different shape. Nothing distinguishes the key. This is a real repair — the old set was one passive report against three actives. |
| **t18** | `It is believed that they` · `It was believed that they` · `It is believed that they have` · `They are believed to have` | **4** | **Passes** on the stated test. Three are the `It … that` frame and one is the subject frame, so there *is* an odd one out — but it is a distractor, not the key, which is the right way round. All four are well-formed sentence-openings. |
| **t20** | `is supposed to start` · `was supposed to start` · `is supposed to have started` · `was supposed to have started` | **4** | **Passes.** A clean 2×2 of {is, was} × {to start, to have started}. No option is odd on shape and all four are well-formed. |

All three claims in the log's §1 are re-derived and hold. The category's
headline defect — *the key is the only well-formed option* — **is closed**, in
the one category that carried three of the corpus's original nine instances.

**One claim of the log's does not hold**, and it is the claim the commit
message repeats: *"Every one of the twelve options across the three items is a
row of the category's own `forms` table."* The `forms` block has six rows and
every one of them is **present tense**:

```
It is said/thought/believed/reported that + cümle
S + is said to + V
S + is believed to be + V-ing
S + is reported to have + V3
S + is reported to have been + V3
S + is supposed to + V
```

`was supposed to start`, `is supposed to have started`, `was supposed to have
started` and `It was believed that they` are not among them — there is no
`supposed to have + V3` row and **no past-tense reporting verb anywhere in the
lesson**. The consequence is in §5.2, and it is the cost of these rewrites.

### 2.2 `Causative` — t13–t16

| item | options | survivors | result |
| --- | --- | --- | --- |
| **t13** | `had` · `let` · `has had` · `will have` | **3** | Passes. `let` is excluded by the label; three tenses of *have* remain and only the paragraph separates them. |
| **t14** | `got them repaired` · `repaired them` · `get them repaired` · `got repaired` | **2** | **Passes**, narrowly and correctly. `repaired them` is not a causative and `got repaired` has no object, so the label eliminates both; `got them repaired` and `get them repaired` are equally causative and **only tense separates them**, which the options cannot carry. This is exactly the property the previous audit found missing, and the rewrite supplies it. Nothing in the set is malformed — the two non-English strings (`made them repaired`, `got repaired them`) are gone. |
| **t15** | `have` · `make` · `let` · `am having` | **2** | Passes, on the same narrow margin the previous audit recorded. `make` and `let` are excluded by the label; `have` and `am having` are not. |
| **t16** | `had had` · `had` · `have had` · `did have` | **4** | Passes. Four inflections of *have*; the label admits all four and none is malformed. |

### 2.3 `Passive with Modals` and `Modal Perfects` — re-run, because a later round edited both lessons

The previous audit passed these eight items. This round touched the
`Passive with Modals` `forms` block (§6 of its log, the `should` row), so I
re-ran them rather than inherit the pass.

| item | options | survivors | result |
| --- | --- | --- | --- |
| t5 | `should be submitted` · `must be submitted` · `might be submitted` · `will be submitted` | **4** | Passes. One frame, four modals. |
| t6 | `must be worn` · `can be worn` · `might be worn` · `must wear` | **3** | Passes. `must wear` is active and the label eliminates it; three well-formed passives remain. |
| t7 | `can be paid` · `must be paid` · `might be paid` · `can pay` | **3** | Passes, same shape as t6. |
| t8 | `might be postponed` · `will be postponed` · `must be postponed` · `can't be postponed` | **4** | Passes. |
| t9 | `must have been` · `can't have been` · `should have been` · `must be` | **3** | Passes *on the stated test* — `must be` is eliminable by the label, three modal perfects remain. See §6 for the tell the test does not name. |
| t10 | `should have been` · `must have been` · `can't have been` · `should be` | **3** | Passes, same. |
| t11 | `can't have been` · `must have been` · `should have been` · `might be` | **3** | Passes. |
| t12 | `may have been` · `must have been` · `can't have been` · `may be` | **3** | Passes, same. |

The `should` row edit (`Applications should be submitted online.` →
`Damaged books should be reported at the desk.`) is confirmed in the diff and
changes nothing about any of these eight items; it removes t5's sub-threshold
echo and nothing else. The round's own §9.4 doubt about having made an
unasked-for edit in a passing category is, on inspection, unfounded: no item
and no `decision` rule depends on that string.

### 2.4 `Tense Forms` and `By + Agent` — run for completeness

| item | survivors | result |
| --- | --- | --- |
| t1 | 4 | Passes the deleted test. Its defect is elsewhere — §5.1. |
| t2 | 4 | Passes. |
| t3 | 4 | Passes. |
| t4 | 4 | Passes (`is being` · `was` · `has been` · `is` — four auxiliaries, nothing odd). |
| t21 | 4 | Passes. Three well-formed passives differing only in what follows `by`, plus one active. |
| t22 | 4 | Passes. |
| t23 | 4 | Passes. `was written with` is the only `with` option, but the odd-one-out is a distractor as often as a key in this file (t18, t9), so it is not an exploit. |
| t24 | 4 | Passes. |

---

## 3 · All six `decision` blocks as literal checklists

Rules walked in file order over the category's own four items. First rule that
fires wins; a rule that fires and returns a **non-key option** is blocking.
Run over the two blocks this round did not open as well.

### 3.1 `Tense Forms in Passive` › *Hangi zamanın edilgeni?* — **clean**

Six rules. r3 gained the `since` test this round.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t1 | **r1**, chip *every morning* (in the stem, verbatim) | Present Simple Passive | `is baked` ✔ |
| t2 | r1 no; r2 no; **r3** — *in 1973* is a year, and no `since` binds it to today | Past Simple Passive | `was built` ✔ |
| t3 | r1 no; r2 no; **r3 does not fire** — the closed past moment *it was first published* is bound to today by `since`; **r4**, chip `since` | Present Perfect Passive | `have been sold` ✔ |
| t4 | r1 no; **r2**, chip `now` inside *for now* | Present Continuous Passive | `is being` ✔ |

**The `since` hazard is genuinely closed.** I re-derived the pre-fix state:
without the trailing clause, r3's condition (*"a definite closed past moment
— a date, a year, or yesterday / last week / two years ago"*) is satisfied by
t3's *since it **was first published***, r3 precedes r4, and r3 returns
`Past Simple Passive` — which on t3 is `were sold`, its closest distractor.
The added *"ve bu an bir 'since' ile bugüne bağlanmıyorsa"* removes it. This
was a defect the *previous* round introduced and this round found on its own,
outside its assigned list. Credit where it is due: this is the only rule in
the file where a discriminating test was folded into the earlier rule and the
wording actually does the work.

r5 and r6 are reached by no item. r6 is the block's own caveat about
`this week` / `this year` and earns its place by warning.

**One residual, non-blocking.** r4's chip list is `["since", "so far",
"already", "recently"]` and `since` is bare. `CONTENT_GUIDE.md` is explicit
that *"a signal that appears in both branches is worse than no signal"*, and
causal `since` is the second branch — t3's own `tip` says so
(*"'çünkü' anlamındaki since böyle bir sinyal vermez"*). No item in t1–t4 has
causal `since`, so it does not fire wrongly today. The round's §3.1 explains
why it could not carry the caveat into r4 (the schema allows exactly one of
`signals`/`condition` per rule) and that is correct; the honest remaining move
is a `condition` rule after r4, not a wider chip.

### 3.2 `Passive with Modals` — two blocks, both clean

**A · *Aktif mi, edilgen mi?*** — four rules.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t5 | **A1** — after the blank comes *this week*, a time phrase, not an object | Modal + be + V3 | narrows to the three passives ✔ |
| t6 | **A1** — *at all times* | Modal + be + V3 | eliminates `must wear` ✔ |
| t7 | **A1** — *in nine smaller instalments*, a PP not an object | Modal + be + V3 | eliminates `can pay` ✔ |
| t8 | **A1** — *until spring* | Modal + be + V3 | ✔ |

**B · *Hangi modal?*** — five rules, and this is the block that does the work.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t5 | **B1 does not fire** — *no deadline*, *no penalty*: the paragraph explicitly removes the sanction; **B2** — early filing is advisable, not required | should be + V3 | `should be submitted` ✔ |
| t6 | **B1** — *anyone who takes one off is walked straight back up to the surface* is the sanction | must be + V3 | `must be worn` ✔ |
| t7 | B1 no (*the registrar's office is relaxed about this*); **B2 does not fire** — *the total comes to exactly the same amount either way* removes any advantage, so there is nothing to advise; **B3** — an open option | can be + V3 | `can be paid` ✔ |
| t8 | B1 no; B2 no; B3 no (no choice is offered); **B4** — *the board did not vote* | may / might be + V3 | `might be postponed` ✔ |

t7 is the sharpest item in the file for this test: the clause that stops B2
firing is a deliberate one, and without it B2 would fire and return
`should be + V3`, which is not an option. It is there. Both blocks reach every
key without a wrong return.

### 3.3 `Modal Perfects in Passive` — clean

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t9 | r1 no (the delivery has happened); **r2** — *it's not here, and the tracking says it arrived yesterday* | must have been + V3 | `must have been` ✔ |
| t10 | r1 no (*much earlier* + *until the final review* close the window); r2 no; r3 no; r4 no; **r5** — *it's frustrating that nobody noticed* | should have been + V3 | `should have been` ✔ |
| t11 | r1–r3 no; **r4** — *on the ground floor and completely sheltered* | can't have been + V3 | `can't have been` ✔ |
| t12 | r1 no; r2 no (nothing is certain); **r3** — *it is just as likely that…* | may / might have been + V3 | `may have been` ✔, the slash form's first branch |

r1's condition (*"olay henüz olmamışsa ve hâlâ yapılabilir durumdaysa"*) is
the one that could misfire on t10, where the catching never happened. It does
not, because r1 also requires the action to still be doable and *much earlier*
plus *until the final review* close that. It is a narrow escape and it holds.

### 3.4 `Causative` — clean, and under-determined on three of four

Rewritten this round: heading, r1, r2, r5's `then`.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t13 | r1 no — object+V3 is present (*the whole set reprinted*) but there is no `by the time`/`before` marker; **r2** | have / get + object + V3 | a **family** of three (`had`, `has had`, `will have`) — the key is in it, no wrong option is returned |
| t14 | r1 no; **r2**, firing on the option-internal *them repaired* — this is the fix, and it works | have / get + object + V3 | a family of two (`got them repaired`, `get them repaired`) |
| t15 | r1 no; **r2** | have / get + object + V3 | a family of two (`have`, `am having`) |
| t16 | **r1** — *By the time we moved in* is the marker and *the entire kitchen renovated* is object+V3 | had had + object + V3 | `had had` ✔ |

**Not blocking**, and the round's central claim about this block is verified:
r2 could not reach t14 before, because every rule was phrased about what
follows the blank and t14's causative phrase is inside the option; the added
*"ister boşluktan sonra, ister seçeneğin içinde"* reaches it. r1's tightening
to an explicit `by the time` / `before` marker is also verified — as written
before, r1 could be read onto t13, whose reprinting does finish before
*the second batch was exactly right*, and it would have returned
`had had + object + V3`, a form t13 does not offer.

**Two costs, both recorded rather than blocking.**

1. **The block decides one item in four.** On t13, t14 and t15, r2 returns a
   *pattern* and the remaining decision is tense, which no rule in the block
   makes. The `then` says *"zamanı taşıyan parça have/get'tir"* — where to put
   the tense, never which tense. That is honest as far as it goes and it is
   the reason r2 returns no wrong option; it is also why a learner holding
   this checklist can answer t16 and none of the other three.
2. **r5's new parenthetical prints t14's best distractor verbatim.** The rule
   now reads *"Nesne V3'ten sonra geliyorsa **(repaired them, cut my hair)**
   ortada yaptırma yoktur"*. `repaired them` is t14's option string, exactly,
   and the log calls it *"the best distractor in the file"* and *"the item's
   whole test"*. The rule eliminates it by name, in the lesson whose `check`
   blocks draw t13–t16. It hands over no key, so it is a cost and not a block —
   but it is a **new** one: the parenthetical did not exist before this round
   (`git diff f543ec9 HEAD`), and it is invisible to every giveaway check in
   the repo, for the reason in §4.3.

### 3.5 `Passive Reporting Structures` › *Boşluğun iki yanına bak* — **BLOCKING on t18**

The block is **unchanged**, and three of its four items were rewritten under
it. The log knows this is the dangerous case, traces it in §5.1, and gets t18
wrong.

The five rules, in file order:

```
r1  Boşluk cümlenin başındaysa VE arkasından tam bir cümle (özne + fiil) geliyorsa
        → It is said/believed/reported that ...
r2  Beklenen ya da planlanan, ama gerçekleşmemiş olabilecek bir durumdan söz ediliyorsa
        → is supposed to + V
r3  Aktarılan olay aktarımdan önce olmuşsa VE özne eylemin uygulandığı tarafsa
        → to have been + V3
r4  Aktarılan olay aktarımdan önce olmuşsa VE eylemi özne kendi yapmışsa
        → to have + V3
r5  Boşluğun önünde asıl özne varsa VE olay aktarımla aynı zamandaysa
        → S + is said to + V
```

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t17 | r1 no (the blank is mid-sentence); r2 no; **r3 does not fire** — the event is earlier, but the manager is the warner, not the warned; **r4** | to have + V3 | `is said to have warned` ✔ |
| **t18** | **r1 does not fire** — see below; r2 no; r3 no (they moved, they were not moved); **r4 fires** — the migration is centuries before the reporting and the people did it themselves | **to have + V3** | **`They are believed to have` ✘ — a distractor** |
| t19 | r1 no; r2 no; **r3** — *late last night*, and the hikers were seen | to have been + V3 | `are reported to have been` ✔ |
| t20 | r1 no; **r2** — a scheduled meeting whose schedule is not to be trusted | is supposed to + V | `is supposed to start` ✔ |

**Why r1 does not fire on t18.** The rule has two conjuncts. The first holds:
the blank opens its sentence. The second does not. What follows the blank is

> `____ moved inland after the second tremor, and that a few of them settled…`

— a bare verb phrase. There is no subject after the blank, because **the
rewrite moved the subject inside the option**: `It is believed that **they**`.
A learner running the checklist runs it *before* choosing an option, on the
text in front of them, and *"arkasından tam bir cümle (özne + fiil) geliyorsa"*
is false of that text. The old t18 — *"____ that the ancient city was
destroyed by a massive earthquake"* — did have a full clause after the blank,
which is what r1 was written for. The stem changed and the rule did not.

The log's §5.1 trace records *"t18 | — | **r1** — the blank opens the sentence
and a full clause follows"*. A full clause does not follow. That single
mis-read is the whole difference between the log's clean table and this one.

**And even if r1 is read charitably, it does not decide the item.** Its `then`
is the frame `It is said/believed/reported that …`, and **three** of t18's
four options instantiate it (`It is believed that they`, `It was believed that
they`, `It is believed that they have`). The log records this honestly —
*"r1 narrows t18 from four options to two, not to one"* (it is three, not two)
— and argues the remaining choice is ordinary tense knowledge the block should
not own. I accept that argument for the perfect inside the clause. I do not
accept it for `is` vs `was` on the reporting verb itself, which is not tense
knowledge from a neighbouring lesson: it is *which reporting structure*, and
there is no rule for it anywhere in this block or this lesson (§5.2).

So on t18 the block either (a) does not fire at r1 and returns a distractor at
r4, or (b) fires at r1 and hands back three of the four options. Both are
failures of a checklist and (a) is blocking.

**This is the same defect the round fixed next door and did not carry across.**
In the `Causative` block, r2's condition was widened *this round* from
*"Boşluktan sonra 'nesne + V3' sırası varsa"* to *"…ister boşluktan sonra,
**ister seçeneğin içinde**"*, precisely because t14's causative phrase had
moved inside the option. The round then rewrote t18 so that its subject moved
inside the option, and left r1 saying "after the blank". The fix and the
defect are one file apart and were made on the same night.

**The minimal repair** (for whoever does it, not for me): r1's second conjunct
becomes *"…ve boşluktan sonra bir cümle gövdesi (fiil) geliyorsa — öznesi
seçeneğin içinde olabilir"*, and a rule is added that decides `is` against
`was` on the reporting verb. One of those is a wording change; the other is
the lesson gap in §5.2 and is larger.

### 3.6 `By + Agent: Include vs Omit` › *By yazayım mı?* — **BLOCKING on t23**

r1, r3 and r4 were edited this round. The five rules:

```
r1  Faili sen de bilmiyorsan ya da someone/people/they gibi belirsizse
      VE boşluktan sonra ONU söyleyen bir öbek yoksa      → Passive without an agent
r2  Fail bağlamdan zaten belliyse                          → Passive without an agent
r3  Fail — işi yapan kişi ya da kurum — cümlenin en şaşırtıcı parçasıysa
                                                           → Passive + by + agent
r4  Boşluktan hemen sonra İŞİ YAPANI söyleyen bir isim öbeği geliyorsa
      — kullanılan bir araç ya da malzeme değil            → Passive + by + agent
r5  Söylenen şey fail değil, kullanılan araç ya da malzemeyse
                                                           → Passive + with + instrument
```

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t21 | **r1** — *I have no idea who took it*, and nothing after the blank names an agent | Passive without an agent | `was stolen` ✔ |
| t22 | r1 no — the agent is known **and** *a fifteen-year-old student* stands right after the blank; r2 no; **r3** — *which surprised every critic* | Passive + by + agent | `was written by` ✔ |
| **t23** | **r1 fires** — see below | **Passive without an agent** | **`was written` ✘ — a distractor** |
| t24 | **r1** (nobody is named) and r2 (*An ambulance was there in four minutes*) both hold; r1 is first | Passive without an agent | `was taken` ✔ |

**Why r1 fires on t23.** Both conjuncts hold.

- *Faili sen de bilmiyorsan* — the letter is a forgery and nobody knows who
  wrote it. The log says so itself: *"read literally, r1 fires on t23 (nobody
  knows who forged the letter)"*.
- *…ve boşluktan sonra **onu** söyleyen bir öbek yoksa* — `onu` is `faili`,
  the agent. After the blank stands *a modern ballpoint pen*. It is a phrase,
  and it does **not** name the agent; the whole item exists because it names
  an **instrument**. So "there is no phrase after the blank naming the agent"
  is **true**, and r1 fires and returns `was written`.

The perverse consequence is worth stating precisely, because it is what makes
this blocking rather than untidy: **the learner who reasons correctly about
the pen at r1 gets the wrong answer**, and the learner who mistakes the pen
for an agent skips r1 and — via r3 or r4 — reaches `was written by`, the other
wrong answer. The only path to the key is to fail to run r1 at all.

**The round diagnosed this exactly and then wrote a qualifier that does not
close it.** Its §4.3 says the qualifier exists *"for a second reason: read
literally, r1 fires on t23"*, and its trace then reads r1 as
*"r1 no (a phrase follows the blank)"*. The rule does not say "a phrase
follows the blank". It says a phrase **naming the agent** follows the blank.
r4 — edited in the same commit, two rules down — got the disambiguator spelled
out (*"— kullanılan bir araç ya da malzeme değil"*). r1 did not. That is the
class of defect this brief names, inside a single edit.

**The minimal repair:** give r1 the same clause r4 got —
*"…ve boşluktan sonra bir isim öbeği hiç gelmiyorsa (fail ya da araç)"*, or
move r5 in front of r1. The second is one line and needs no new wording.

---

## 4 · Giveaways: the numbers, re-derived

### 4.1 The shipped checker

`checkLessonGiveaway` imported from `tools/content-checks.mjs` and run over
each lesson with its own category's questions, on the working tree and on
`f543ec9`:

| | run ≥ 6 (or ≥ 8 without the key) |
| --- | --- |
| before this round | **0** |
| after | **0** |

Corpus-wide the count is 0, so `tests/content-checks.test.js`'s ratchet
(`CEILING = 0`) holds. Verified: 136/136 tests pass.

### 4.2 The three-word sweep — **15 rows verified; the two survivors are t8 and t19**

I re-implemented the checker's internals with the run threshold at **3**,
keeping its two other conditions (the lesson sentence must contain the
normalised key) and adding the previous audit's third (at least one shared
content word between the filled stem and the lesson sentence, so a shared
*pattern* is not counted as a shared *scenario*). My stop-list and content-word
filter are my own, not the previous audit's.

| | before (`f543ec9`) | after (HEAD) |
| --- | --- | --- |
| rows | **15** | **2** |
| items | **10** | **2** |

**The row count the round reports is exactly right.** Its item count is
**10, not 11** — a transcription slip, and its own §6 "cleared this round"
list (t3, t4, t17, t22, t23, plus t5's and t20's, and t18's which it does not
name) adds to the same ten. Nothing turns on it.

**The two survivors are the two the round names**, with the same lesson
sentences:

| item | lesson sentence still standing | shared | block |
| --- | --- | --- | --- |
| **t8** | *"The project might be postponed."* | `postponed`, run 3 | `Passive with Modals` › `forms`, may/might row |
| **t19** | *"Two paintings are reported to have been recovered from a garage."* | `reported`, run 5 | `Passive Reporting` › `examples` item 4 |

**I agree that both should be left.** In each the single shared word is the
row's own pattern verb — the thing the `forms`/`examples` block exists to
exemplify — and the scenarios (a launch held back by an unheld board vote; a
search for missing hikers) share nothing else with the lesson sentence. This
is the line the previous audit drew between a shared pattern and a shared
scenario, and it is the right one.

The fifteen before, for the record, and what closed each:

| item | lesson sentence | closed by |
| --- | --- | --- |
| t3 ×2 | *Three million copies have been sold.* / *Over a million units have been sold since launch.* | `forms` row and `examples` item moved (§3 of the log) ✔ |
| t4 | *The lobby is being renovated.* | `forms` row moved ✔ |
| t5 | *Applications should be submitted online.* | `forms` row moved (§6 of the log) ✔ |
| t8 | *The project might be postponed.* | left, correctly |
| t17 ×3 | *The minister is said to be considering an early election.* / *He is said to live in Ankara.* / *The CEO is said to be very demanding.* | item rewritten off `is said to` as a bare key ✔ |
| t18 | *It is believed that the fire started in the roof space.* | item rewritten ✔ |
| t19 | *Two paintings are reported to have been recovered…* | left, correctly |
| t20 ×3 | *The new library is supposed to open in March.* / *The train is supposed to arrive at six.* / *The bus is supposed to leave at seven.* | item rewritten off `is supposed to` as a bare key ✔ |
| t22 | *The letter was written by a fountain pen.* | `pitfall` 7 moved to *parcel / string* ✔ |
| t23 | *The letter was written with a fountain pen.* | same `pitfall` ✔ |

The `pitfall` 7 move is the most valuable single edit in the round: the old
pair was t23's key **and** its closest distractor, one preposition apart, in
t23's own lesson. The replacement (*The parcel was tied by/with a length of
string*) still differs in exactly the preposition, and `parcel`, `tied` and
`string` appear in none of t21–t24. Verified in the diff and in the sweep.

### 4.3 A channel neither sweep closes, and the round wrote into it

`lessonSentences()` reads `contrast.sides[].example`, `forms.rows[].example`,
`examples.items[].sentence`, `pitfall.wrong`/`.right` and `text.body`. It does
**not** read `decision.rules[].condition`, `.signals` or `.then`, nor
`gloss`, `note`, `why`, `pattern` or `use`. Its own comment says the thing:
*"A block type this function does not know about is a channel it does not
close."*

I swept those fields for verbatim multi-word option strings from the same
category, before and after. The whole delta is one row:

```
Causative › decision.rules[4].condition
  "Nesne V3'ten sonra geliyorsa (repaired them, cut my hair) …"
  — passive-voice-t14, DISTRACTOR "repaired them"
```

It did not exist at `f543ec9`. It is not a key, so it is a cost and not a
block (§3.4). Everything else the sweep finds is pre-existing and is the
`Modal Perfects` `forms`/`decision` tables printing the modal-perfect strings
that *are* the option strings — `must have been`, `should have been`,
`can't have been` in `forms.rows[].form` and `decision.rules[].then`. That is
unavoidable in a category whose options are the forms it teaches, both audits
have accepted it, and I accept it too.

The `Passive Reporting` rewrites also **cleared** four rows here that the
before-sweep found: `is said to` and `is supposed to` were t17's and t20's
whole keys and were printed verbatim in that lesson's `forms.rows[].pattern`,
`examples.items[].note` and `decision.rules[].then`. Nothing in the current
file prints t17's, t18's or t20's key. Uncredited in the log, and it is the
strongest thing the rewrites did.

**For whoever comes next:** teaching `lessonSentences()` to read
`decision.rules[].condition` and `examples.items[].note` is a two-line change
and would have caught the one new row above at authoring time. It would also
raise the corpus backlog off zero, so it needs the ratchet moved with it.

---

## 5 · The rewritten items, option by option

**A note on method, so the next reader can discount it correctly.** The brief
asks me to answer each rewritten item from the paragraph before reading its
key. I cannot honestly claim a blind first answer: the dump I worked from
carried `correctIndex`, and I saw it before I reasoned. What follows is
therefore the substitution test — every wrong option put back into its
paragraph and judged one at a time against `question-author.md`'s question —
plus, where my own reading of the paragraph does not land where the key does,
a plain statement of that. A properly blind pass on t17 in particular would be
worth somebody's time (`npm run blind`).

### 5.1 t17 — the exclusion the paragraph does not make

> Nobody at the council will put a name to the story, and the minutes of the
> safety meeting were never circulated. The site manager **____** about the
> cracked roof beam weeks before the ceiling came down, and two councillors
> now admit that a note reached their desks and was quietly filed.
>
> `is said to have warned` ✔ · `is said to warn` · `is said to be warning` ·
> `is said to have been warned`

- **`is said to warn`** — *"The site manager is said to warn about the cracked
  roof beam weeks before the ceiling came down."* **Rejected.** A bare
  infinitive puts the warning at the reporting time or makes it habitual, and
  a specific closed-past adverbial cannot sit under it. Live: matching the
  infinitive to the reporting verb is exactly `pitfall` 7 of this lesson.
- **`is said to be warning`** — **Rejected**, same failure in the progressive.
- **`is said to have been warned`** — *"The site manager is said to have been
  warned about the cracked roof beam weeks before the ceiling came down, and
  two councillors now admit that a note reached their desks and was quietly
  filed."* **I do not think this is excluded**, and this is my second finding
  in this category.

  It is grammatical, the tense is right, and it is not merely defensible — in a
  building-collapse story it is the *more* idiomatic reading of that sentence.
  *"The person in charge was warned weeks before and nothing was done"* is the
  stock shape of the genre, and everything around the blank supports it: the
  minutes suppressed, the note filed, nobody willing to be named.

  The log's exclusion (§1.1) is *"the note reached the councillors' desks, so
  the manager is the source, not the recipient"*, and the item's `explanation`
  states it outright: *"not, meclis üyelerinin masasına **ondan** ulaşmış"* —
  the note reached their desks **from him**. **The paragraph does not say
  that.** It says *"a note reached their desks and was quietly filed"*, with
  no source. Under the passive reading the same note is the one that warned
  the manager, copied upward or downward; under the active reading it is his.
  Both readings are available and the text does not choose.

  The discourse argument — the councillors' admission reads as corroboration,
  and only corroborates a claim the manager *sent* something — is a real
  argument and it is why I put this second rather than first in §0. But it is
  an inference about narrative function that a marker would have to construct,
  and `question-author.md` rule 2 is about what a competent teacher *accepts*,
  not about which reading the author had in mind. **An explanation whose
  exclusion of the closest distractor rests on a fact the paragraph never
  states is the definition of an item that needs one more sentence.**

  **The one-clause repair:** make the note his. *"…and two councillors now
  admit that **his** note reached their desks and was quietly filed"* closes
  it completely, costs nothing, and leaves the 2×2 design and the
  paragraph-deleted result exactly as they are.

**Paragraph-deleted:** passes (§2.1). **Design:** the 2×2 of
{active, passive} × {contemporaneous, earlier} on a verb that passivises
without an object is a genuinely good idea and it is the reason the option set
is now clean. The item is one clause away from being the best in the file.

### 5.2 t18 and t20 — sound items, and a lesson that no longer covers them

Both items substitute correctly.

**t18.**

- `They are believed to have` — *"They are believed to have moved inland after
  the second tremor, and that a few of them settled as far away as the
  mainland."* **Rejected**, hard: the `and that …` conjunct has nothing to
  attach to. Live rather than dead — it is `pitfall` 6's error exactly.
- `It is believed that they have` — **Rejected.** A present perfect under an
  event the paragraph dates to 1628, and it clashes with the coordinated
  `settled` in the same sentence.
- `It was believed that they` — **Rejected**, on *an account the island's
  guidebooks still repeat*. This is the round's own least-confident call and
  I agree it is the weakest of the three; I also think it holds. The whole
  frame of the paragraph is present (*is dated*, *is far less certain*,
  *still repeat*), and `was believed` needs a belief that has been given up.

**t20.**

- `was supposed to start` — **Rejected**: it says nine has come and gone. The
  corridor clock says twenty to. (Note this depends on the reader parsing
  *twenty to* with its hour elided; for this audience that idiom is taught,
  and `still` carries the rest.)
- `is supposed to have started` — **Rejected**: it expects the meeting to have
  begun by now.
- `was supposed to have started` — **Rejected** on both halves.

**But — the lesson does not teach the axis either item now turns on.** Both
new items key `is` against `was` **on the reporting verb**, and:

- the `forms` block has six rows and every one is present tense;
- the `contrast`, `examples` and all three `pitfall`s print present reporting
  verbs and nothing else — there is no `was said`, `was believed` or
  `was supposed to` anywhere in the lesson;
- the one `text` block that discusses time says the opposite thing:
  *"Zaman farkını taşıyan parça **to**'dan sonrasıdır"* — the tense difference
  is carried by what comes **after `to`**. On t20 that steers a learner toward
  `is supposed to have started`, a distractor; on t18 toward
  `It is believed that they have`, a distractor;
- the `decision` block has no rule for it (§3.5).

So the lesson attests exactly one cell of each of the two new 2×2 grids, four
or five times over, and it is the keyed cell in both. That is a giveaway of a
kind no sweep in this repo can see — not a shared sentence but a **shape
monoculture** — and it is *new*, because before this round neither item tested
the reporting verb's own tense.

It is also the round's blind spot stated in its own words: §1.4 records with
satisfaction that the sweep *"drops from seven hits in this lesson to zero
**without a lesson edit**"*. The lesson edit was the part that was needed.

**What is owed:** one `forms` row (`S + was said/believed to + V`, *"For years
it was believed that the tomb was empty."*), one `examples` item in the past,
and one `decision` rule distinguishing a belief still held from one given up.
That is the work that makes t18 and t20 teachable rather than only answerable,
and it is why I would not ship this category even with the r1 wording fixed.

### 5.3 t14 — the rewrite holds

> The lease is very clear that tenants must not touch the wiring themselves.
> So when the kitchen sockets went dead last month we **____** within a day,
> and the landlord paid the electrician's bill without an argument.

- `repaired them` — **Rejected**, and it is a genuinely excellent distractor:
  flawless English, contradicted twice (the lease forbids it; an electrician
  billed the landlord). Nothing about it is a matter of taste.
- `get them repaired` — **Rejected.** Right pattern, wrong tense: *went dead*,
  *last month* and *paid* close the past three times over. This is the option
  that keeps the paragraph necessary, and it is why the deleted test passes.
- `got repaired` — **Rejected**: with the object dropped, the tenants are the
  thing repaired. I agree with the round that it is live rather than dead —
  remembering `get … done` without `get something done` is a real error and
  `pitfall` 7 is built on the word order — but it is the weakest of the three
  and it is on my doubt list.

**The item now does what it was written to do.** The previous audit's finding
is closed and the fix did not reproduce the defect: the two non-English
strings are gone, the label no longer picks out one option, and the surviving
discrimination is tense, which the options cannot carry.

### 5.4 t21 — the swap is an improvement

`by a stranger` → `by a thief`. The previous audit was right that
*"on a crowded train, a stranger is the default assumption"* makes
`by a stranger` a second acceptable answer; `by a thief` is empty for a reason
that needs no claim about what the speaker knows — the verb entails the agent.
The exclusion survives substitution. I agree with the swap and with the
round's own recorded cost: t21 now carries two redundancy distractors testing
one judgement rather than three distinct failure modes.

### 5.5 t1 — the item that blocks `Tense Forms`

> Fresh bread **____** every morning at this bakery, using the same recipe
> that's been in the family for three generations.

`has been baked` substituted: *"Fresh bread has been baked every morning at
this bakery, using the same recipe that's been in the family for three
generations."* A present perfect with a repeated-event adverbial wants a
durational frame — *for a hundred years*, *since the war* — and this sentence
has one sitting in its second clause: *for three generations*. It is attached
to the recipe rather than to the baking, which is the whole of the argument
against the option, and it is not enough: the reading *"bread has been baked
here every morning, on this family recipe, for three generations"* is
available to any reader and is good English.

That is `question-author.md` rule 2: **an option a competent teacher would
accept is a wrong option, not a less natural one**, and *"if the explanation
has to argue that the key is more natural, the item is broken."* The item's
`optionNotes` entry does exactly that arguing — *"buradaki üç kuşak ise tarife
bağlı, ekmeğin pişirilmesine değil"* — which is a defensible reading of the
syntax and not an exclusion of the sentence.

The previous audit found this and the round named it in its did-not-do list
and deferred it, with a clear reason (its assigned list for this category was
the t3/t4 giveaways, and the fix is a paragraph rewrite). That was a
defensible scoping call. It is still what stops the category shipping, and
the round says so itself: *"It is the first thing I would put on the next
list."* Agreed. The repair is one adverbial: drop *at this bakery* for
something that closes the period, or move *every morning* out of the clause.

### 5.6 Explanations, tips and notes — checked against the new text

- **All 24 items:** every `optionNotes` key is one of that item's own options;
  every item covers all three wrong options; none covers the key; none exceeds
  160 characters. Clean.
- **t17** — `explanation` and the `is said to have been warned` note both
  assert *"notu masalara gönderen taraf o"* / *"ondan ulaşmış"*, which the
  paragraph does not say (§5.1). Both are true of the item the author intended
  and not of the item on the page.
- **t18** — the `It is believed that they have` note says *"Anlatılan göç ise
  1628 yazına tarihlenmiş"* — **the migration is not dated to 1628**; the
  paragraph dates the *eruption* to 1628 and says explicitly that what became
  of the people *"is far less certain"*. The note's conclusion is right and its
  stated reason is not. One clause: *"…1628 yazına tarihlenen patlamanın
  ardına düşen, kapanmış bir geçmişe ait."*
- **t20, t14, t21, t13, t15** — every `explanation`, `tip` and note re-read
  against its new text and true of it. t13's narrowing (*"bu kalıpta yaptırma
  anlamını taşıyan fiiller have ile get'tir"*, replacing the false claim that
  only *have* and *get* take object + V3) is correct English and correctly
  narrow. t15's `make` note likewise.
- **t4 and t16 argue only for their keys.** Both explanations are single
  sentences that name no wrong option in words:
  *"'This week' şu anda devam eden bir süreci gösteriyor, bu yüzden Present
  Continuous Passive ('is being renovated') kullanılır."* (125 chars) and
  t16's one sentence about `by the time`. `CONTENT_GUIDE.md` says an
  explanation is *"always"* both halves and *"never a one-liner"*.
  `checkExplanationsNameDistractors` misses both because it substring-matches
  option text: t4's explanation contains the string `is` and t4 has an option
  `is`; t16's contains `had` and t16 has an option `had`. Neither item is
  otherwise defective and both carry complete `optionNotes`, so this is
  **not blocking** — but it is two more items for the backlog and one more
  false negative in a checker whose count is treated as evidence.

---

## 6 · Ruling on the doubled-modal argument

The finding, from the previous audit's §1.3: in **t6, t7, t9, t10 and t12**
exactly one modal appears twice in the option set, and in every one of the
five the key is that modal's fuller form. *"If one modal repeats, take the
longer one"* answers five items with the paragraph deleted and is wrong
nowhere in the file. The round declined to fix it and gave three reasons.
Taking them in order:

**1 · "In every one of the five the doubling is the item's design."**
**Agreed.** t6 (`must be worn` / `must wear`) and t7 (`can be paid` /
`can pay`) hold the modal constant so the item tests **voice**; change the
active option's modal and it starts failing for two reasons at once, which is
a weaker item. t9, t10 and t12 hold it constant so the item tests **the
perfect infinitive**. A minimal pair differs in one thing, and these do. The
tell is not the doubling — it is that the fuller member happens to be keyed in
all five.

**2 · "The cheap fix collides with the identical-option-set check."**
**Verified as stated, and it does not carry the conclusion.** t11 is
`can't have been` / `must have been` / `should have been` / `might be`.
Substituting `might be` into t9 or into t10 reproduces that set exactly, and
the check is real — it fires today on `academic-nouns-adjectives-t13`/`t16`,
which is one of the two warnings `npm run validate` prints. So declining *that
substitution* was right.

But the premise underneath it — *"the modal inventory in this category is four
wide"* — is **false of this lesson**. Its `forms` block has **six** rows:
`must have been`, `may / might have been`, **`could have been`**,
`can't / couldn't have been`, `should have been`, **`shouldn't have been`**.
With `could have been` in the pool, non-colliding sets that break the tell
exist. One of many: give t10 `{should have been, could have been,
can't have been, may be}` — key `should have been`, no modal doubled, distinct
from t9's, t11's and t12's sets, and every option a row of the lesson's own
table. So the honest form of reason 2 is *"the obvious one-word fix collides"*,
not *"the fix is unavailable"*.

**3 · "The durable fix is a rewrite, in a category that ships."**
**Agreed, and it is the reason the ruling goes the round's way.** Keying the
*present* form in one of the five is the fix that makes the tell unreliable
rather than merely absent, and it is a new item with three new distractors,
written by a round that owns the category and can substitute all three. Adding
a fifth rewrite to a night already carrying four is precisely how the last
several rounds introduced defects — the repository's own count is five of
seven — and that argument is stronger than the correction to reason 2.

**Ruling: the decision was right and one of its three reasons is not.**
Declining the previous audit's specific suggestion was correct. Concluding
that the option sets therefore cannot be repaired is not; the inventory is six
wide, not four. Neither category is blocked on this — the tell is a
cross-item meta-strategy, not one of the three exploits the paragraph-deleted
test names, and each of the five items is still decidable only by reading its
paragraph. It stays on the list, and the scope is **two items or one**: one
new present-keyed item (the round's own proposal, and the better fix), or
`could have been` / `shouldn't have been` into t9 and t10.

One correction to the round's §5.2 arithmetic: it says *"the work is one item,
not five"*. If the route taken is the option-set route it is two (t9 and t10;
t12's `may` doubling then stands alone and is harmless). If it is the new-item
route it is one, as claimed.

---

## 7 · The log against its own diff

`git diff f543ec9 HEAD -- data/passive-voice/passive-voice.json` is 234 lines.
Every entry in the log's §0 table is present in it and nothing is in the diff
that the table does not name. Item by item:

| the log claims | verdict |
| --- | --- |
| t17, t18, t20 rewritten whole — stem, options, explanation, tip, all notes | **True.** |
| t14 rewritten — stem, options, explanation, two notes | **True.** |
| t13's explanation: a false claim about English narrowed | **True**, and the claim really was false (*want / need / like / see* all take object + V3). |
| t15's explanation and `make` note softened | **True.** |
| t21 `by a stranger` → `by a thief`, with explanation and note | **True.** |
| two `forms` examples and one `examples` sentence replaced in `Tense Forms` | **True**, and the three replacements share no content word with any of t1–t4. Checked. |
| one `forms` example replaced in `Passive with Modals` | **True.** |
| `pitfall` 7 moved to a new scenario | **True**, and `wrong`/`right` still differ in exactly the preposition. |
| `decision` r3 gains the `since` test (`Tense Forms`) | **True**, and it closes a real blocking defect the previous round introduced. |
| `decision` heading, r1, r2, r5 `then` (`Causative`) | **True.** |
| `decision` r1, r3, r4 gain the agent/instrument test (`By + Agent`) | **True of the edit; false of its effect on r1** — §3.6. |
| *"Unchanged: … the `Passive Reporting Structures` `decision` block"* | **True**, and it is why the category does not ship — §3.5. |
| *"the giveaway sweep drops from 15 rows to 2"* | **True.** Item count is 10 → 2, not 11 → 2. |
| *"No rule returns a non-key option anywhere"* (§8) | **False on two of six blocks.** `Passive Reporting` r4 returns `They are believed to have` on t18; `By + Agent` r1 returns `was written` on t23. Both traces in the log reach the key by reading a rule more loosely than it is written. |
| *"Every one of the twelve options … is a row of the category's own `forms` table"* | **False** for at least three of t20's four and for `It was believed that they` — §2.1. Repeated verbatim in the commit message. |
| *"all four rewritten items pass the paragraph-deleted test"* | **True**, re-derived independently — §2. |
| every `optionNotes` key checked against its option set | **True**, all 24 items clean. |

**Two smaller drifts.** The log's §1.1 quotes t17's stem as *"Nobody **in the
department** … the minutes of **that** meeting"*; the shipped stem reads
*"Nobody **at the council** … the minutes of **the safety** meeting"* — the
final commit `5992f9d` changed it and the log was not re-read. And the commit
message calls the model item **p19**; it is t19.

**On the log as a document.** It is the most careful of the repair logs in
this directory: it states its standard, records costs it was not asked about,
names four things it did not do and why, and its §9 doubt list correctly
identifies t18's `was believed` exclusion and t14's `got repaired` as its two
weakest calls. Where it fails it fails in one specific way — **it traces its
own `decision` rules by their intent rather than by their text**, twice, on the
two blocks whose items or wording it had just moved. That is worth saying
plainly because it is the same reading error that produced both blocking
findings in this report, and the countermeasure is mechanical: trace a rule by
reading only the string a learner sees, with the item's stem beside it and the
author's intention out of the room.

---

## 8 · The findings I am least sure of, in order of my own doubt

1. **t1 blocking `Tense Forms in Passive` (§5.5).** My highest doubt, and it
   is the one that decides a verdict. *"Fresh bread has been baked every
   morning at this bakery"* is odd on its own and rescued only by *for three
   generations* three clauses later, attached to the wrong noun. I read that
   as enough for a teacher to accept; a reader who holds the adverbial
   strictly to the recipe will say the option is properly excluded and the
   category ships. Two audits have now called it a rule-2 failure and no round
   has fixed it, so it is at least worth one deliberate decision rather than a
   third deferral.

2. **t17's `is said to have been warned` (§5.1).** I am confident the
   `explanation` asserts something the paragraph does not say — that is a fact
   about two strings. I am much less confident about how much that costs. The
   corroboration argument (councillors admitting a note arrived reads as
   confirming that the manager *sent* one) is real, and a reader who weights
   discourse function highly will call the item sound. It is the second
   finding in that category and not the one it is blocked on, and the repair
   is one word (*his note*), so nothing rests on which of us is right.

3. **The lesson monoculture behind t18 and t20 (§5.2).** The facts are
   checkable — the `Passive Reporting` lesson contains no past-tense reporting
   verb, and both new items key present against past. What I am unsure of is
   whether that is a *giveaway* or merely a *gap*. A learner who has read the
   lesson has seen only `is`-frames; whether they generalise "so the answer is
   always `is`" or simply "I was never taught this" I cannot tell from the
   file, and the two want different fixes. I have written it up as the second
   reason not to ship the category rather than the first, because the first
   (§3.5) needs no such judgement.

4. **`got repaired` on t14 (§5.3).** I called it live, agreeing with the
   round, and I hold it more loosely than the round does. *"We got repaired
   within a day"* is grammatical and absurd, and the argument that a learner
   reaches for it is an argument about a memory slip rather than about a
   misreading of the paragraph. If it is dead, t14 is a three-option item and
   the deleted test narrows from two survivors to two out of three, which is
   still a pass — so the category's verdict does not move either way.

5. **Whether `decision` r5's new *(repaired them, cut my hair)* is a cost or a
   defect (§3.4).** It prints t14's best distractor verbatim in t14's own
   lesson, which is a real loss of the item's test for anyone who has studied.
   It hands over no key, the block is the last thing in the lesson and both
   `check` blocks precede it, and eliminating a named wrong form is a
   legitimate thing for a decision rule to do. I recorded it and did not block
   on it. Somebody could reasonably block on it.

6. **`is supposed to start` on t20 depending on *twenty to* (§5.2).** Every
   exclusion in that item runs through the reader parsing an elided clock
   idiom. For a B2 Turkish learner *"dokuza yirmi var"* is ordinary, and
   *still* carries the direction even if the hour is missed. I cleared it. A
   reader who thinks the idiom is too much load for the one piece of evidence
   the whole item turns on would not.

7. **The t18 stem's *"the second tremor"*.** A definite reference with no
   antecedent — the paragraph mentions an eruption and an ash layer and never
   a first tremor. It does not affect any option and I did not count it, but
   it is a cohesion flaw in a stem that was written fresh this round, and the
   next person in this file may as well fix it while they are there.

---

## 9 · What I did not check

- **The app.** No HTML, CSS or JS changed, so `npm run verify` was not run —
  same reasoning as the round's, and it needs a browser.
- **`data/manifest.json` beyond one line.** The round's §7 says
  `contentVersion` is still 2 and asks whoever merges to bump it; the finishing
  commit `5992f9d` did — `passive-voice` is now **3** (and `tenses` 4, `modals`
  3). So that did-not-do entry is stale rather than outstanding. I did not
  audit the manifest's other edits or the `roadmap.json` wording change in the
  same commit; both are outside this scope.
- **The other nine topics**, beyond confirming the corpus-wide giveaway count
  is still 0 and that `npm run check` is green.
- **A blind pass.** I saw `correctIndex` before I reasoned (§5). The one item
  where that most likely cost something is t17.
