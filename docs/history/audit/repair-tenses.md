# Repair pass — `data/tenses/tenses.json`

2026-09-04. Scope: `data/tenses/tenses.json` only. Nothing else under
`data/` was opened or written; `data/manifest.json`, the app code and the
other two topics under repair (`modals`, `passive-voice`) were not touched.
`git status` at the end shows one modified file.

Inputs: `docs/audit/blind-oldest.md` (rows whose id starts with `t`),
`docs/audit/lessons-oldest.md` §1 and §0, `docs/audit/option-notes-4.md`
§"Items where writing the notes showed the item is weak".

**No key was changed on the basis of correctness.** The blind pass agreed
with the key on 73 of 73, so every finding worked here is about
discrimination. Two items (`t19`, `t22`) are keyed to a *different form*
than before, but only because they were rewritten from the paragraph up as
coverage items — no existing paragraph had its answer re-decided.

## Headline numbers

| | before | after |
| --- | --- | --- |
| `npm run validate` giveaway warnings for this file | **5** (t13, t17, t22, t23, t24) | **0** |
| `npm run check` errors | 0 | 0 |
| corpus-wide warnings (all eight topics) | 32 | 27 |

`npm run format && npm run check` — clean, 136/136 unit tests pass.

---

## 1. The `decision` blocks

### 1.1 Perfect Aspects — rule 2 handed the learner t18's closest distractor

`lessons-oldest.md` §1.1 (blocking) and §1.5 (no been/gone branch).

The old block, in order: `how long…` → PPC; **"Eylem hâlâ sürüyorsa ya da
izi ortadaysa (… hâlâ bitmedi)" → PPC**; `how many/so far…` → PP Simple;
"bitmiş bir miktar" → PP Simple; `by the time…` → Past Perfect.

Rewritten to seven rules: the two been/gone branches first, then the two
quantity rules, then the two duration rules, then Past Perfect. The
duration *condition* is now self-limiting — it requires that there be **no**
completed quantity — so it can no longer outrank the axis the lesson's own
`contrast` is built on. The two been/gone rules are phrased by the
situation ("a place someone went to; are they still there?") rather than by
where the blank sits, because in `t25` the auxiliary is inside the option,
not before the blank.

`for three hours` was dropped from the duration chips: it was one word away
from t17's own paragraph (§0.2). `for hours` replaces it.

**Literal trace, rule by rule, over all four items in the category:**

| item | r1 gone-to | r2 been-to | r3 quantity chips | r4 quantity cond. | r5 duration chips | r6 duration cond. | r7 Past Perfect | reached | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t17 (report, "for almost three hours now") | no place | no place | no chip | nothing completed — "two sections **left**" is a remainder | near-miss on `for hours`; treat as no | **fires** (no completed quantity, stress on elapsed time) | — | `Present Perfect Continuous` | `have been writing` | yes ✓ |
| t18 ("five chapters **so far**") | no place | no place | **fires** on `so far` | — | — | — | — | `Present Perfect Simple` | `has read` | yes ✓ |
| t20 ("Have you ____ to Japan **before**") | Japan named; she is *not* still there (you are talking to her) → no | **fires** (`before`, experience) | — | — | — | — | — | `have been to` | `been` | yes ✓ |
| t25 ("down to the archive… should be back") | **fires** (archive named, not yet returned) | — | — | — | — | — | — | `have gone to` | `has gone` | yes ✓ |

Four items, four different rules, each reached before any rule that names a
form the item offers as a distractor. The old rule 2 would have returned
`has been reading` on t18 and `has been going` on t25 — both distractors on
those items. It cannot now: on t18, rule 3 fires four steps earlier; on
t25, rule 1 fires five steps earlier.

### 1.2 Present Simple vs Present Continuous — the broken order was met first

`lessons-oldest.md` §1.3 (blocking) and §1.4.

The lesson carried **two** `decision` blocks with the same three rules in
different orders. The first, *"Cümledeki ipucu"*, put the `now` chips above
the stative rule, so run literally on the lesson's own `examples` sentence
`"I understand the problem now."` it returned Present Continuous — against
the note printed beside that very sentence. The second block silently fixed
the order three blocks later.

**The first block is deleted and the final block carries the complete,
correct procedure.** Nothing is lost: every rule the deleted block held
appears below, and the lesson goes from 11 blocks to 10, which is still a
legitimate shape (`text, contrast, forms, check, text, examples, pitfall,
pitfall, check, decision`) and ends on a `decision` as the guide asks. Two
`decision` blocks whose *jobs* differ are fine — Time Expressions has two
and keeps them — but two with the same job, one of them wrong, is the
defect.

Two branches were added or fixed:

- a timeless-truth condition, which `t3` turns on and neither old block had;
- the habit chips are now full phrases (`every day`, `every morning`, …).
  The old list contained a bare **`every`**, which fired on
  "**every** chemistry student" in `t3` — a quantifier on a noun. The
  learner reached the right answer by matching the wrong word.

**Literal trace over all four items:**

| item | r1 stative | r2 timeless truth | r3 habit chips | r4 `now` chips | reached | key |
| --- | --- | --- | --- | --- | --- | --- |
| t1 ("Every morning, Elif ____ to the library") | `go` is not stative | not a general truth | **fires** on `every morning` | — | Present Simple | `goes` ✓ |
| t2 ("don't interrupt him **right now**") | `work` is not stative | no | no chip matches (no bare `every` any more) | **fires** on `right now` | Present Continuous | `is working` ✓ |
| t3 ("Water ____ at 100 degrees…, **a fact**") | `boil` is not stative | **fires** | — | — | Present Simple | `boils` ✓ |
| t4 ("I ____ that the extension is a good idea") | **fires** (`think`) | — | — | — | Present Simple | `think` ✓ |

And on the lesson's own example that broke the old block: `"I understand
the problem now."` → rule 1 fires (`understand`) → Present Simple, which is
what the note beside it says. The `now` chips are now unreachable for a
stative verb, which is exactly the caveat the `text` block after them calls
*"sınavda en çok puan kaybettiren yer"*.

### 1.3 Time Expressions — the second block taught a rule two other lessons exist to correct

`lessons-oldest.md` §1.2 (blocking).

Old rule 1: `signals: [since, for, already, yet, just, so far, ever, never]
→ Present Perfect`. `for` is the signal *Present Perfect vs Past Simple*
devotes a whole `text` block to warning about; `since` is the signal
*Past Simple vs Past Continuous vs Past Perfect* devotes a `text` block to
warning about, and `tenses-t12` is keyed on precisely that caveat — its own
`optionNote` calls `have rebuilt` *"'Since' görünce en kolay düşülen
tuzak"*. A learner running the old rule 1 on t12 picked the named trap.

Rebuilt, in order: the past-reference-point condition first, then the
`ago/yesterday` chips, then `since`/`for` split into an open-period branch
and a closed-period branch, then the remaining chips (`already`, `yet`,
`just`, `so far`, `ever`, `never`). `since` and `for` no longer appear in
any chip list at all.

**Trace on the item the old block got wrong — `tenses-t12`**, which lives
in a different category but is what the block was walking the learner into:
"I didn't recognize the campus at first because they ____ the whole
entrance **since** my last visit." Rule 1 fires — the reference point is a
past moment, `didn't recognize` — and returns **Past Perfect**, which is
the key (`had rebuilt`). The old block returned Present Perfect, which is
the distractor.

**Trace over this lesson's own four items** (this block decides a *tense*;
the block that decides the *word* is traced in §1.4):

| item | fires | returns | the item's own tense |
| --- | --- | --- | --- |
| t21 ("I haven't seen my cousin ____ last summer") | r3 — `since`, period open to now | Present Perfect | `haven't seen` ✓ |
| t22 (rewritten; "the marks haven't been entered ____") | r5 — `yet` | Present Perfect | `haven't been entered` ✓ |
| t23 ("I've ____ finished the assignment") | r5 — `already` | Present Perfect | `I've finished` ✓ |
| t24 ("He moved to Istanbul five years ____") | r2 — `ago` | Past Simple | `moved` ✓ |

### 1.4 Time Expressions — the word-choice block

Not a finding; traced because the block sits beside one that changed and
because two of its four items were rewritten.

| item | r1 `since` | r2 `for` | r3 `ago` | r4 `already` | r5 `yet` | key |
| --- | --- | --- | --- | --- | --- | --- |
| t21 | **fires** (a starting point follows the blank: "last summer") | — | — | — | — | `since` ✓ |
| t22 | no | no | no | sentence is negative → no | **fires** | `yet` ✓ |
| t23 | no | no | no | **fires** (positive, finished earlier than expected) | — | `already` ✓ |
| t24 | no | no | **fires** (blank sits straight after a quantity, verb is `moved`) | — | — | `ago` ✓ |

Four items, four rules, in file order, one each. One edit was made here:
rule 1's parenthetical read `(2019, last summer, I graduated)` and
`last summer` is t21's own following phrase (§0.2 of the sufficiency pass).
It now reads `(2019, the pandemic, I graduated)`.

### 1.5 Future Forms — rule 5 could not fire on t15

`lessons-oldest.md` §1.6.

Rule 5 was `signals: [according to the schedule, the timetable says,
departs at, arrives at]`, and `tenses-t15` contains none of them — its cue
is *"the board at the station is very clear"*. The checklist terminated
with no answer on a live item. The idea rule 5 wanted is a condition, so a
sixth rule states it: *the time is set by a printed or posted timetable
rather than by anyone's decision*. The chips are kept as rule 5 because
they are real exam phrases; the condition catches everything they miss.

Two parentheticals lifted from items were generalised at the same time
(§0.2): `(bulutlar, boş depo, kırık cam)` → `(kararan gökyüzü, boş yakıt
göstergesi, kırık cam)` — `bulutlar` is t13's cue verbatim — and
`(takvimde yazıyor, karşı tarafla konuşulmuş)` → `(tarihi ve saati belli,
karşı tarafla sözleşilmiş)` — `takvimde yazıyor` is t16's.

**Literal trace over all four items:**

| item | r1 decided now | r2 `I promise/I think…` | r3 visible evidence | r4 arranged plan | r5 timetable chips | r6 timetable condition | returns | key |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t13 ("Look at those clouds — it ____ any minute") | not a decision | no chip | **fires** | — | — | — | `be going to` | `is going to rain` ✓ |
| t14 (rewritten) | **fires** ("Stop offering… I hadn't thought about it until just now") | — | — | — | — | — | `will` | `will take` ✓ |
| t15 ("The last train back ____ at 23:10… the board at the station is very clear") | no | no | no | no | no chip | **fires** | `Present Simple` | `leaves` ✓ |
| t16 ("____ dinner… already in both of our calendars") | no | no | no | **fires** | — | — | `Present Continuous` | `are having` ✓ |

### 1.6 Past Simple / Continuous / Perfect — rule 2 was widened out of the way of the new t19

Not in the brief's list. It became necessary because §4.1 below puts a
**Past Simple** item into this category for the first time, and the old
rule 2 — *"İki geçmiş olaydan biri açıkça diğerinden önce bitmişse, önce
biten → Past Perfect"* — is true of any narrative sequence, so it would
have claimed the new item three rules before rule 5 could reach it. It now
names what actually calls for Past Perfect: **the narrative stepping back
out of chronological order**. The sufficiency pass recorded that t12
reaches its key *only* through this rule, so the rewording was checked
against t12 first.

**Literal trace over all five items:**

| item | r1 chips | r2 flashback | r3 `while/as` | r4 interrupted | r5 sequence | returns | key |
| --- | --- | --- | --- | --- | --- | --- | --- |
| t9 (rewritten) | no | no | **fires** on `while` | — | — | Past Continuous | `was walking` ✓ |
| t10 ("By the time the professor arrived… **already**") | **fires** on `by the time`, `already` | — | — | — | — | Past Perfect | `had left` ✓ |
| t11 ("He ____ dinner when the power went out") | no | no | no | **fires** | — | Past Continuous | `was cooking` ✓ |
| t12 ("I didn't recognize the campus because they ____ … since my last visit") | no | **fires** — the sentence goes back behind `didn't recognize` | — | — | — | Past Perfect | `had rebuilt` ✓ |
| t19 (rewritten) | `before that` does not match "the year **before**, and" | no — the three verbs run in order inside one interview | no | no | **fires** | Past Simple | `asked` ✓ |

### 1.7 One small correctness fix, recorded

`lessons-oldest.md` §1.10: the Time Expressions `forms` row for `still` had
`pattern: "S + still + V"`, which does not generate the `contrast` block's
own example `"She is still waiting for the results."` The pattern now reads
`"S + still + V / S + be + still + V-ing"`. No example changed.

---

## 2. The five giveaway warnings

The rule followed, from the brief: where a lesson example and a question
are the same sentence, **the lesson's example moves**. The one exception is
t22, which was rewritten for a different reason (§4.2) and took its
giveaway with it.

| warning | what moved | new text |
| --- | --- | --- |
| **t13** — Future Forms printed `"Look at those clouds — it's going to rain."` twice | `contrast` › be going to `example`, and `examples.items[2].sentence` | `"The tank is almost empty — we are going to run out of fuel."` and `"The queue is enormous — we are going to be late."` — the `examples` note (*"Gözle görülür kanıta dayalı tahmin → be going to"*) is still true of the new sentence |
| **t17** — the Perfect Aspects `pitfall` **was** the item's distractor/key pair (`"I have written this report for three hours."` / `"I have been writing this report for three hours."`) | that `pitfall` | `"We have waited in this queue for forty minutes."` / `"We have been waiting in this queue for forty minutes."`, `why` updated from *"For three hours"* to *"For forty minutes"*. Same error, same teaching, different sentence |
| **t22** | — | the question was rewritten (§4.2); the lesson's `"The meeting had already started by the time we arrived."` stays, because it is what the second `decision` block's Past Perfect branch is built on and it no longer matches any question |
| **t23** — `"I have already finished the assignment."` appeared as the `already` `contrast` example **and** as a `pitfall`'s `right` | both | `"They have already announced the results."`; and the pitfall becomes `"I have paid the bill yet."` / `"I have already paid the bill."` — its `why` was already general and is unchanged |
| **t24** — `"He moved to Istanbul five years ago."` appeared in `examples` **and** as a `pitfall`'s `right`, with the item's stem being that sentence with its last word blanked | both | `"They sold the house three months ago."`; pitfall becomes `"She has graduated two years ago."` / `"She graduated two years ago."` — `why` unchanged and still true |

One more sentence was moved that the validator did **not** warn on. The
Future Forms `will` `contrast` example was `"Don't worry — I'll take a
taxi."`, which is `tenses-t14`'s key clause verbatim; it scored five shared
words, one under the threshold. It is now `"That's the doorbell — I'll get
it."` Left in place it would have become a real giveaway the moment t14's
paragraph changed.

After these changes `npm run validate` reports **zero** giveaway warnings
for `data/tenses/tenses.json`, down from five.

---

## 3. Items where a second answer survived the paragraph

### 3.1 `tenses-t9` — rewritten

Blind pass: *"While she waited"* is standard English, so the Past Simple
option was acceptable; and separately, the two halves were in different
scenes — *"someone waiting for a bus does not yet have a stop to miss"*.

- **was** `While she ____ for the bus, she noticed a familiar face across the street and almost missed her stop thinking about it.` / `waited · was waiting · has waited · waits`
- **now** `While she ____ across the bridge on her usual route home, a sudden gust tore the umbrella out of her hand, and she had to turn back before she reached the other side.` / `walked · was walking · has walked · walks`, key `was walking`

`while` is kept — it is the category's signal and the lesson teaches it —
but the Past Simple option is no longer defeated by a claim about `while`.
It is defeated by the paragraph: *walk across the bridge* is telic, so the
Past Simple asserts she crossed, and the last clause says she never reached
the other side. One scene throughout, which is the coherence note fixed.

**Option by option, substituted into the new paragraph:**

| option | reads as | would a competent teacher accept it? |
| --- | --- | --- |
| `was walking` (key) | "While she was walking across the bridge…, a sudden gust tore the umbrella out of her hand, and she had to turn back before she reached the other side." | yes — this is the sentence |
| `walked` | "While she walked across the bridge…, …she had to turn back before she reached the other side." | **no.** Grammatical, but it asserts the crossing was completed and the sentence's own tail denies it. This is the fix: the option is now wrong about the paragraph, not merely less natural |
| `has walked` | "While she has walked across the bridge…, a sudden gust tore…" | **no.** Present Perfect inside a closed past scene (`tore`, `had to turn back`) |
| `walks` | "While she walks across the bridge on her usual route home, a sudden gust tore…" | **no.** Tense clash with `tore`. Live, though: `her usual route home` invites the habitual reading, which is why it stays in the set |

`explanation`, `tip` and all three `optionNotes` were rewritten against the
new text. The `tip` (*"'While' genelde Past Continuous ile, 'when' genelde
Past Simple ile eşleşir"*) is unchanged and still true — `tore` is the
`when`-side Past Simple.

### 3.2 `tenses-t14` — rewritten

Blind pass: *am taking* (an arrangement already made) is at least as
natural as *will take*; suggested fix, *"add a cue that fixes the decision
at speech time"*.

- **was** `Don't worry about picking me up — I ____ a taxi from the airport, so just relax at home.`
- **now** `Stop offering to pick me up — I ____ a taxi from the airport. I hadn't thought about it until just now, so nothing is arranged.`

Options and key unchanged (`am taking · will take · take · have taken`,
key `will take`).

| option | reads as | accept? |
| --- | --- | --- |
| `will take` (key) | a decision taken in this exchange | yes |
| `am taking` | a fixed arrangement | **no.** "nothing is arranged" and "I hadn't thought about it until just now" contradict it outright. It was the surviving second answer; it is now excluded by the paragraph, on the lesson's own axis (*who decided, and when*) |
| `take` | a timetable or a habit | **no.** Neither is available: a one-off, personally decided journey, explicitly unplanned until this moment |
| `have taken` | already in the taxi | **no.** The speaker has not landed |

`explanation` and the `am taking` / `take` notes were rewritten to quote
the new cue. `have taken`'s note was already about the speaker not having
landed and is unchanged. `tip` unchanged.

### 3.3 `tenses-t23` — options changed, paragraph kept

Blind pass: *since* is a real sentence adverb (*"I've since finished the
assignment"*), so a strong student is punished. `option-notes-4.md` §5
adds that `ago` and `since` were both dead in the slot for the *same*
positional reason, leaving `yet` as the only live distractor.

Both are fixed at once: `since` → `never`, `ago` → `ever`. Paragraph, key
and `tip` unchanged.

| option | reads as | accept? |
| --- | --- | --- |
| `already` (key) | "I've already finished the assignment, so there's no need to remind me…" | yes |
| `yet` | "I've yet finished the assignment…" | **no.** `yet` in this sense needs a negative or a question. The classic *henüz* transfer error, and the item's real trap |
| `never` | "I've never finished the assignment, so there's no need to remind me about the deadline anymore." | **no** — and this is the point of the swap. It is perfectly grammatical and is defeated by *meaning*: someone who has never finished cannot say there is no need to remind them. The category needed at least one item decided by reading rather than by position |
| `ever` | "I've ever finished the assignment…" | **no.** `ever` does not stand alone in a positive declarative |

`explanation` and the notes for `never` and `ever` are new; the `yet` note
is unchanged and still true.

### 3.4 `tenses-t7` — the D1 finding left, the aspect clash fixed

The brief and the blind pass both say record and leave: no change to the
option list makes `broke` wrong English, and it is not wrong here. **That
finding is left standing and is recorded in §5.**

What *is* fixed is the separate defect `option-notes-4.md` §3 named — the
old tail coordinated a Past Simple with the blank (*"Someone ____ the
coffee machine **and left** it broken"*), so the key produced
*has broken … and left* and the item half-endorsed its own distractor.
Its recommended repair was *"probably in the second clause, not in the
option list"*.

- **was** `Look at this mess! Someone ____ the coffee machine and left it broken for the whole office.`
- **now** `Look at this mess! Someone ____ the coffee machine, and now the whole office is drinking instant coffee.`

Options, key, `explanation`, `tip` and all three `optionNotes` are
unchanged, and all were re-read against the new text: the explanation's
*"makine hâlâ bozuk"*, the `broke` note's *"'Look at this mess!' vurguyu şu
anki sonuca koyuyor"*, the `breaks` note's *"bu dağınıklığı yaratan tek bir
olay"* and the `was breaking` note's *"gözünün önünde duran bir sonuç"* are
each still true, and the new tail supports them more directly than the old
one did. `broke` remains acceptable English in the new paragraph; nothing
here claims otherwise.

---

## 4. Coverage

Both changes in this section are new items written from scratch, which is
the largest thing on the list; they were done last, after §1–§3.

### 4.1 `tenses-t19` — the category's missing Past Simple

Three findings converge on this one item:

- `option-notes-4.md` §2 — its paragraph is verbatim from the **Perfect
  Aspects** lesson, which prints *"By the time she turned thirty, she had
  founded two companies."* twice (an `examples` item and the Past Perfect
  side of the *"Hangi ana bağlı"* contrast). It is filed under a different
  category, so the validator's per-lesson check cannot see it and no
  warning ever fired — but any learner who read Perfect Aspects has been
  shown the answer as a worked example.
- the same section — it is the **fifth** item in a category where every
  other has four, and *"if one item goes, it is the one already told to the
  learner elsewhere"*.
- `blind-oldest.md` §3 — *"Past Simple is never the answer"* in a category
  that names three forms.

Deleting the item would need `questionCount` in `data/manifest.json` to
change, which is out of scope for this session, so it was **rewritten** as
the category's Past Simple item instead. That resolves all three.

- **now** `The interview lasted barely ten minutes. The manager glanced at my portfolio, ____ me two short questions about the deadline I had missed the year before, and said she would call me on Monday.`
- `asked · had asked · was asking · has asked`, key `asked`

The paragraph carries its own Past Perfect — *the deadline I had missed the
year before* — so the learner can see the form that is **not** being asked
for, sitting in the one place it does belong.

| option | reads as | accept? |
| --- | --- | --- |
| `asked` (key) | the middle of three actions on the narrative line: `glanced` → `asked` → `said` | yes |
| `had asked` | the questions finished before something else in the past | **no.** They run in sequence inside a ten-minute interview, coordinated by `and`; there is nothing for them to precede. The genuine earlier event is already marked in the sentence |
| `was asking` | a background process waiting to be interrupted | **no.** A progressive cannot sit in a coordinated chain of completed acts, and "barely ten minutes" frames three short ones |
| `has asked` | tied to now | **no.** `lasted`, `said` and `would call` close the scene |

Category keys are now `was walking` / `had left` / `was cooking` /
`had rebuilt` / `asked` — Past Continuous ×2, Past Perfect ×2, Past Simple
×1, where before Past Simple was never the answer.

The Perfect Aspects lesson keeps *"By the time she turned thirty, she had
founded two companies."* in both places: with t19 rewritten it no longer
reproduces any question, and it is the lesson's clearest Past Perfect
example.

### 4.2 `tenses-t22` — the category's missing `yet`

Three findings again: `blind-oldest.md` §3 (`already` keyed twice, while
`for`, `yet`, `while`, `during`, `still` and `before` are never the
answer), the giveaway warning (the stem was the lesson's `examples`
sentence with the blank filled), and `option-notes-4.md` §5 (`still` and
`ago` were both dead in the slot for the same positional reason, leaving
`yet` as the only live distractor).

- **was** `The meeting had ____ started by the time we arrived, so we missed the introduction entirely.` — key `already`
- **now** `The results were supposed to go up on Friday, and it is now the middle of the following week. According to the secretary, the marks haven't been entered ____, so nobody in our year can register for next term.` — `yet · already · still · ago`, key `yet`

| option | reads as | accept? |
| --- | --- | --- |
| `yet` (key) | "the marks haven't been entered yet, so nobody… can register" | yes |
| `already` | — | **no.** `already` belongs to positive statements; the sentence is negative and the work has not been done at all. Live: this is the direction of the t23 pair, run the other way |
| `still` | — | **no**, and honestly so: `still` *can* carry this meaning, but not here — it goes before the auxiliary (*the marks still haven't been entered*), which is what the lesson's `contrast` says about its position. The note and the explanation both say this rather than claiming the word is wrong |
| `ago` | — | **no.** `ago` follows a quantity and takes Past Simple; there is no quantity in front of the blank |

The four keys in the category are now `since` / `yet` / `already` / `ago` —
one each, where before `already` was keyed twice.

The scenario deliberately avoids printing `already`, `yet` or `still`
anywhere outside the option list.

---

## 5. What I did **not** do, and why

**Left on the reviewer's own recommendation** — each is a textbook
convention the paragraph plants a defeater for, not an option that is wrong
English. Changing the option list cannot fix them and rewriting the
paragraph would strain it:

- **`t7` — `broke`.** *"Someone broke the coffee machine"* is fully
  idiomatic and, in American usage, the likelier sentence. The item is
  saved by emphasis, not by grammar. The tail was fixed (§3.4) so the item
  no longer half-endorses the distractor, but `broke` remains acceptable
  and the explanation still argues emphasis. **Recorded, not fixed.**
- **`t12` — `have rebuilt`.** *"…because they have rebuilt the whole
  entrance since my last visit"* is what most speakers would say. The item
  survives on the reference point (`didn't recognize`), and its own
  `optionNote` already concedes the alternative by name. **Recorded, not
  fixed** — and the Time Expressions decision block that was pushing
  learners *into* it has been fixed instead (§1.3), which is the reachable
  half of this problem.
- **`t4` — `am thinking`.** Current usage for a tentative opinion. The item
  relies on the textbook stative rule, which the lesson teaches
  explicitly. **Recorded, not fixed.**
- **`t13` — `will rain`.** Grammatical; only the evidence rule separates
  it from the key, and the paragraph plants the evidence
  (*"Look at those clouds"*). **Recorded, not fixed.**
- **`t3` — decided by world knowledge**, with the second clause
  decorative. The added timeless-truth branch (§1.2) at least means the
  lesson now *has* the rule the item turns on, and the bare `every` chip no
  longer lets a learner reach the key by matching "every chemistry
  student". The item itself is unchanged. **Recorded, not fixed.**
- **`t8` — `experienced`** (`option-notes-4.md` §7). Accepted in ordinary
  usage; the item asserts a rule rather than catching a fault. Not on the
  brief's list and not touched.

**Other findings knowingly left:**

- **`t20` is a two-way item wearing four options** (`option-notes-4.md`
  §4). `go` and `went` cannot follow *Have you ____* at all, so two of the
  three notes teach V3 rather than been/gone. The frame *Have you ____ to
  Japan* admits only `been`, `gone` and `been going`, so a third live
  option would need a different paragraph — and t20 is one of the thirteen
  tenses items the blind pass "could not break". Rewriting it to fix a
  dead-option count risked trading a working item for a new defect, so it
  was left. It is worth a pass of its own.
- **`t3`'s `boiled` / `has boiled` are one distractor in two costumes**
  (`option-notes-4.md` §5). Same reasoning: fixing it means rewriting an
  item that passed the blind pass, for a structural gain, and t3 is already
  on the "record and leave" list above.
- **`t1`'s explanation argues only `is going`** (§5, adjacent note). The
  guide asks the explanation to name *the closest* wrong option and it
  does; the `optionNotes` cover the other two. No change.
- **Time Expressions is still decided beside the blank.** `blind-oldest.md`
  calls this a category-level pattern rather than a per-item defect, and
  the rewritten t22 has the same shape as the item it replaces — the
  polarity that decides `yet` sits two words before the blank. The rewrite
  fixed the key distribution and the dead distractors; it did not fix D4,
  and I do not think D4 is fixable in a signal-word category without
  changing what the category tests.
- **§1.8 — the `for` caveat is taught in *Present Perfect vs Past Simple*
  and never tested.** Fixing it means adding or re-keying an item in that
  category, which was not on the brief's list and would have been a third
  new item in one pass. Not done.
- **§1.9 — signals that point two ways across lessons.** `already` is
  now disambiguated in both places that use it (Time Expressions' second
  block puts the past-reference branch first; the Past trio block has it as
  a Past Perfect chip). `this week`, `just`, `recently`, `never` and `as`
  are **not** fixed: they sit in the *Present Perfect vs Past Simple* and
  *Past trio* decision blocks, no live item springs any of them, and each
  fix is a judgement about a chip list that would be better made across the
  whole topic at once. Recorded, not done.
- **§1.10 — the Future Forms `forms` block mixes polarities with
  purposes** (`will`/Olumlu, `will`/Olumsuz, then `Kesinleşmiş plan`,
  `Resmî tarife`). The guide says that is two blocks. Splitting it changes
  the lesson's block count and layout for a presentational gain with no
  item consequence; not done.
- **§1.10 — `t20`'s paragraph shifts speaker without marking it** (the
  advisor's question printed without quotation marks). Real, cosmetic,
  and it belongs with the t20 rewrite above rather than as a patch. Not
  done.
- **`during`, `while`, `before` are options in Time Expressions and are
  taught nowhere in the lesson.** Still true; `t22`'s rewrite did not add
  any of them, and adding a block to teach three words that are never keyed
  would grow the lesson for no exam gain. Recorded.

**Nothing was re-keyed on the basis of correctness, no explanation was
weakened to let an item survive, and no item lost what it tests.** The two
items whose key form changed (t19, t22) are new paragraphs written to fill
a gap the blind pass measured, not old paragraphs re-decided.

---

## 6. Verification actually run

- `npm run format` — reformats `data/tenses/tenses.json` and regenerates
  the manifest's lesson index. Reported one file.
- `npm run check` — format `--check`, validate, colour, unit tests.
  **0 errors**; 136/136 tests pass; 27 corpus warnings, **none of them in
  `data/tenses/tenses.json`** (was 32 corpus-wide with 5 in this file).
- Every `decision` block that changed was re-run as a literal ordered
  checklist over all four (or five) items of its category, rule by rule in
  file order; the traces are the tables in §1 and each one records which
  rule fires, on what text, and whether the form it returns is an option on
  that item.
- Every rewritten paragraph had all three wrong options substituted into it
  and read as written; the judgements are the tables in §3 and §4.
- Every rewritten paragraph's `explanation`, `tip` and three `optionNotes`
  were re-read against the new text; where a note quoted text that no
  longer exists it was rewritten, and where it did not it was left and is
  named as unchanged above.
- `npm run verify` was **not** run: it needs a running server and a browser,
  and this change touches no markup, CSS or JavaScript.

Not committed, not pushed.
