# Independent re-audit — the repair of `data/tenses/tenses.json`

2026-09-04. Scope: `data/tenses/tenses.json` — its six lessons and its
twenty-five questions. I did not write the content and did not write
`docs/audit/repair-tenses.md`. Nothing was repaired: this file is the only
thing this pass produced.

`data/modals/modals.json` and `data/passive-voice/passive-voice.json` were
not opened. `npm run validate` reports warnings against `passive-voice`
(fourteen at the time of writing) and one against
`academic-nouns-adjectives`; **those are not mine and are not findings
here** — `passive-voice` is under repair by another session and may have
been read mid-write. The repo moved twice under this pass (`789d8a4`,
`3df21db` landed after the tenses commit), so the corpus-wide counts below
are snapshots and the log's "32 → 27" figure is no longer comparable to
anything. Its per-file figure is, and it is verified.

The diff audited is `9d948bb` (`git diff 4c97859 9d948bb --
data/tenses/tenses.json`), 306 lines.

---

## 1. Verdicts

Nothing in this table is a mis-key. **I re-derived the key of every item I
was asked to and agree with all of them**, and every one of the six
`decision` blocks now returns its category's key on every one of its
category's items. The repair's own claims hold. What blocks each category
is either a defect the repair created, a fix it applied in one place and
not the identical place next door, or a giveaway `checkLessonGiveaway`
structurally cannot see and which the "5 → 0" headline therefore does not
measure.

| category | verdict | the one blocking defect |
| --- | --- | --- |
| Present Simple vs Present Continuous | **DOES NOT SHIP** | Deleting the first `decision` block orphaned the `text` block that opens *"Son kural sınavda en çok puan kaybettiren yer"* — there is now no rule list above it, and read against the only surviving list it points at r4 (`now` → Present Continuous), the exact rule the paragraph exists to override. Introduced by this repair. Two-word fix. |
| Present Perfect vs Past Simple | **DOES NOT SHIP** | Decision r2 still lists bare **`since` → Present Perfect**. Run on `t12` it returns `have rebuilt` — the option `t12`'s own note calls *"'Since' görünce en kolay düşülen tuzak"*. This is the defect `lessons-oldest.md` §1.2 called **blocking**, and §1.3 of the repair fixed it in Time Expressions and not in the second lesson carrying it. |
| Past Simple vs Past Continuous vs Past Perfect | **DOES NOT SHIP** | `t12`'s paragraph, its key, **and its reasoning** are printed inside its own lesson's `text` block: *"I didn't recognize the campus because they **had rebuilt** it since my last visit. Referans 'didn't recognize' … ondan önce biten eylem 'had rebuilt'."* Six shared words carrying the key — at the warning threshold. It is silent only because `lessonSentences()` never reads `text.body`. |
| Future Forms | **DOES NOT SHIP** | `t16` filled is the lesson's own `contrast` example minus one word: *"We are having dinner with the Özdemirs on Saturday"* against *"We are having dinner with them on Saturday."* — five shared words, carrying the key, one under the threshold. This is precisely the case the repair went hunting for and fixed for the `will` side; it left the identical one in the next `contrast` block. |
| Perfect Aspects: Simple vs Continuous vs Been/Gone | **DOES NOT SHIP** | `t25` is its lesson's `pitfall` in different clothes: *"She has gone to the library; **she'll be back** in an hour."* against *"She **has gone** down to the archive …, so she **should be back** before the meeting starts."* The cue and the answer are both above the question, and the `pitfall`'s `why` states the decision outright. Paraphrase, so no tool sees it. |
| Time Expressions & Signal Words | **DOES NOT SHIP** | The rewritten `t22` is decided by a rule the lesson does not contain. Its `explanation` excludes `still` because *"'the marks still haven't been entered' denir, yardımcı fiilden önce"* — `still` before the **auxiliary in a negative**. The `contrast` gloss says only *"fiilden önce gelir"*; the `forms` row gives `S + still + V / S + be + still + V-ing`, both positive; neither `decision` block mentions it. The learner who picks `still` is linked to a lesson that cannot correct them. |

Item-level, for the six the repair rewrote or re-optioned:

| item | verdict | note |
| --- | --- | --- |
| `t7` (tail) | **ships** | The tail fix is real: the old `and left it broken` coordinated a Past Simple with the blank; the new present consequence supports r4 of its own decision block instead. `broke` is still acceptable, which the repair records rather than hides. |
| `t9` (rewritten) | **ships**, weakened claim | Second answer genuinely gone. But it is still reached by the `while` chip alone (r3), so the meaning work the rewrite added is bypassable — see §3.1. |
| `t14` (rewritten) | **ships** | `am taking` is now excluded by the paragraph, not by preference. One note (`have taken`) lost the cue it was written against — §3.2. |
| `t19` (rewritten) | **ships** | Sound, correctly keyed, no surviving second answer. It is the item the whole pass turned on and it holds. |
| `t22` (rewritten) | **does not ship** | See the table above; and `ago` is still dead in slot for exactly the positional reason `option-notes-4.md` §5 named — one of the two dead options survived the rewrite. |
| `t23` (re-optioned) | **ships**, with a taxonomy cost | `never` is a real meaning-decided distractor and the swap is an improvement. But `never` and `ever` are taught nowhere in the Time Expressions lesson — the repair enlarged the class it recorded as unfixed. |

---

## 2. The six `decision` blocks, run as literal checklists

Rule by rule, in file order, over every item of the category — including the
three categories the repair did not touch. `fires` means the rule's
antecedent is true of the item's own text; a rule that fires and names a
form the item offers as a wrong option is blocking.

### 2.1 Present Simple vs Present Continuous — clean

r1 stative · r2 timeless truth · r3 habit chips · r4 `now` chips.

| item | r1 | r2 | r3 | r4 | reached | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| t1 | `go` not stative | no | **fires** `every morning` | — | Present Simple | `goes` ✓ | — |
| t2 | `work` not stative | no | no chip | **fires** `right now` | Present Continuous | `is working` ✓ | — |
| t3 | `boil` not stative | **fires** (`a fact … memorizes`) | — | — | Present Simple | `boils` ✓ | — |
| t4 | **fires** (`think`) | — | — | — | Present Simple | `think` ✓ | — |

Four rules, four items, no misfire. The bare `every` chip is gone, so
"every chemistry student" no longer produces the right answer off the wrong
word, and the lesson's own `"I understand the problem now."` now resolves to
Present Simple at r1, agreeing with the note printed beside it. **§1.2 of
the repair is verified in full.**

**What it cost.** The deleted block sat immediately above the `text` block
whose first two words are *"Son kural"* — and that block's last rule *was*
the stative rule the paragraph goes on to explain. The reference now has no
antecedent, and a learner who looks for a rule list finds only the one at
the foot of the lesson, whose last rule is `now` → **Present Continuous**.
The paragraph then tells them stative verbs stay Simple *"cümlede 'now'
geçse bile"*. The repair's §1.2 says *"Nothing is lost: every rule the
deleted block held appears below"* — true of the rules, false of the prose
that pointed at them. This is the whole shape the re-audit brief describes:
the defect it closed was real, and it left the document disagreeing with
itself somewhere else.

### 2.2 Present Perfect vs Past Simple — blocking, untouched

r1 definite-past chips · r2 `[since, already, yet, just, ever, never, so far, recently]` → Present Perfect · r3 open span · r4 unstated time, present result.

| item | reached at | returns | key |
| --- | --- | --- | --- |
| t5 | r2 (`since`) | Present Perfect | `has done` ✓ |
| t6 | **r1** (`two years ago`) | Past Simple | `met` ✓ |
| t7 | r4 (no time expression, `Look at this mess!` + the new present consequence) | Present Perfect | `has broken` ✓ |
| t8 | r3 (`over the past century`, quoted in the condition) | Present Perfect | `has experienced` ✓ |

In-category the block is sound, and r1 before r2 is load-bearing: t6
contains `since then`, and the reverse order would return `have met`, a
distractor on that item. Nothing here needed fixing.

**But r2's chip list is `since` unqualified, and that is the defect the
repair called blocking.** Its §1.3 argument, in its own words: *"`since` is
the signal Past Simple vs Past Continuous vs Past Perfect devotes a `text`
block to warning about, and `tenses-t12` is keyed on precisely that
caveat"*. Run this block on t12 — *"I didn't recognize the campus at first
because they ____ the whole entrance **since** my last visit"* — and r1 does
not fire (no chip), r2 does, and it returns **Present Perfect**, i.e.
`have rebuilt`, which is an option on t12 and is the trap its own
`optionNote` names. Identical defect, identical victim, one lesson over.
`lessons-oldest.md` §1.9 tabulates cross-lesson signals and does not list
`since` either, so this was missed twice, not once.

### 2.3 Past Simple / Continuous / Perfect — clean on all five

r1 `[by the time, by then, already, before that]` · r2 flashback · r3 `[while, as, all morning]` · r4 interruption · r5 sequence.

| item | reached at | returns | key |
| --- | --- | --- | --- |
| t9 | r3 (`while`) | Past Continuous | `was walking` ✓ |
| t10 | r1 (`by the time`, `already`) | Past Perfect | `had left` ✓ |
| t11 | r4 (long action cut by `the power went out`) | Past Continuous | `was cooking` ✓ |
| t12 | r2 (the reason clause goes back behind `didn't recognize`) | Past Perfect | `had rebuilt` ✓ |
| t19 | r5 (`glanced` → blank → `said`) | Past Simple | `asked` ✓ |

`before that` does not match t19's *"the year before, and"*; there is no
`while`/`as`/`all morning`; nothing is interrupted. Verified.

**The one thing to watch, and it is subtler than the repair's flat "no".**
r2's antecedent — *the narrative breaks order and returns to an earlier
time* — **is true of t19's paragraph**: *"the deadline I **had missed** the
year before"* is exactly that. The rule survives only because its consequent
scopes the answer to *"o erken olay"*, and the blank is not the earlier
event. A learner reading the rule as "if the passage steps back anywhere,
Past Perfect" reaches `had asked`, which is on offer. The repair widened r2
specifically to make room for t19 and then wrote t19 with a Past Perfect
inside it; the rule and the item are calibrated against each other, with no
margin.

Second cost, smaller: r2 no longer states the plain rule (*of two past
events, the earlier takes Past Perfect*), but the lesson's `pitfall` still
does — *"önce biten eylem Past Perfect alır"* — and so do **t12's tip** and
**t19's own new tip**. One lesson now states its central rule three
non-equivalent ways, and the loosest of the three is the one printed on the
new item.

### 2.4 Future Forms — clean on all four, with a live near-fire

r1 decision at speech time · r2 `[I promise, I think, …]` · r3 visible evidence · r4 arranged personal plan · r5 timetable chips · r6 timetable condition.

| item | reached at | returns | key |
| --- | --- | --- | --- |
| t13 | r3 (`Look at those clouds`) | be going to | `is going to rain` ✓ |
| t14 | r1 (`Stop offering…`, `until just now`) | will | `will take` ✓ |
| t15 | **r6** | Present Simple | `leaves` ✓ |
| t16 | r4 (`already in both of our calendars`) | Present Continuous | `are having` ✓ |

§1.5 is verified: the new r6 does reach t15, which r5's chips could not.

**But r6 was placed last, three rules behind r3.** r3's antecedent is
*"şu anda gözle görülen somut bir kanıt"*, and t15's own cue is *"the board
at the station is very clear"* — something visible, right now, that the
sentence points at. Strictly r3 requires a *tahmin*, and t15 asserts a
schedule rather than predicting, so I record this as a near-fire rather than
a blocking one. It matters more than the other near-fires in this file
because if it does fire it returns `be going to`, and **`is going to leave`
is an option on t15**. The same antecedent on t16 (`in both of our
calendars` is also visible evidence) is harmless only because `be going to`
is not offered there. The safe shape is r6 beside r5, above r3.

### 2.5 Perfect Aspects — clean on all four, and this is the repair's best work

r1 gone-to · r2 been-to · r3 quantity chips · r4 quantity condition · r5 duration chips · r6 duration condition · r7 Past Perfect.

| item | reached at | returns | key |
| --- | --- | --- | --- |
| t17 | r6 (no completed quantity; stress on elapsed time) | PPC | `have been writing` ✓ |
| t18 | r3 (`so far`) | PP Simple | `has read` ✓ |
| t20 | r2 (`before`, experience; she is not in Japan) | have been to | `been` ✓ |
| t25 | r1 (archive named, not back yet) | have gone to | `has gone` ✓ |

I re-derived the old block's behaviour independently: its r2 (*"Eylem hâlâ
sürüyorsa ya da izi ortadaysa … hâlâ bitmedi"*) is true of t18's *"she's
determined to finish the rest"* and returns `has been reading`, which is
t18's option 0. The defect was real and is gone — r3 now fires four steps
earlier and the new r6 is self-limiting.

Near-fire, recorded: r4 asks for *"tamamlanmış bir miktar ya da sayılabilir
bir sonuç"* and t17 contains *"two sections left to finish"* — a countable
quantity that is explicitly **not** completed. The word "tamamlanmış" and
the parenthetical *"(kaç bölüm bitti)"* hold it off. If it fired it would
return `have written`, t17's designated closest distractor. Putting the
quantity rules above the duration rules was right for t18 and t25; t17 pays
for it by reaching its key at rule 6 instead of rule 1.

### 2.6 Time Expressions — both blocks clean on all four

Word block (r1 `since` · r2 `for` · r3 `ago` · r4 `already` · r5 `yet`):
t21 → r1, t22 → r5, t23 → r4, t24 → r3. Four rules, four items, one each,
in file order. Tense block (r1 past reference point · r2 `[ago, yesterday,
last night, in 2019]` · r3 since/for open · r4 since/for closed · r5
`[already, yet, just, so far, ever, never]`): t21 → r3, t22 → r5, t23 → r5,
t24 → r2, all agreeing with the item's own tense.

The §1.3 claim is verified on the item it was made about: run over t12, r1
fires on *"I didn't recognize it"* and returns **Past Perfect**, the key.
The old r1 returned Present Perfect, the distractor. This is a genuine and
important fix — it is the one repair in this pass that changes what a
learner is told to do on a live item in the right direction.

Two costs, both small. r1's new parenthetical quotes t12's own paragraph
(*"I didn't recognize it"*) at the same moment the repair was generalising
three other parentheticals for exactly that reason (§1.4, §1.5). And the
block now terminates with no answer on t8 (*over the past century*), which
is out of category and therefore not a defect, but is the same shape as the
§1.6 finding it fixed elsewhere.

---

## 3. The rewritten items, option by option

For t19 and t22 I wrote my own answer from the paragraph before opening
`correctIndex`; both agree with the key.

### 3.1 `t9` — the second answer is gone; the item is still a trigger item

*"While she ____ across the bridge on her usual route home, a sudden gust
tore the umbrella out of her hand, and she had to turn back before she
reached the other side."*

- `was walking` (key) — the sentence.
- `walked` — **not acceptable.** `walk across the bridge` is telic, so the
  Past Simple in a `while`-clause presents the crossing as completed, and
  the tail says she never reached the other side. The blind pass's
  objection (*"While she waited" is standard English*) is genuinely
  answered: the option is now wrong about **this paragraph**, not less
  natural than the key. Confirmed.
- `has walked` — not acceptable; Present Perfect inside a closed past scene
  (`tore`, `had to turn back`).
- `walks` — not acceptable; tense clash with `tore`. Live: *"her usual route
  home"* invites the habitual reading.

Sound. Two things the log does not say. First, the key is still reachable
from the `while` chip alone at r3 of the category's decision block, so the
meaning work the rewrite added is bypassable and the item has not become a
reading item — it has become a *correct* trigger item. Second, the lesson's
`examples` block carries *"While she was cooking, the phone rang."* and
t9 is *"While she was walking …, a sudden gust tore …"*: the same frame,
three shared words, no keyed overlap. Not a giveaway by the tool's measure,
and I do not call it one, but the pattern is available above the question.

All three `optionNotes`, the `explanation` and the `tip` were checked
against the new text: every phrase they quote (`tore`, `had to turn back`,
`usual route`) exists in it. Clean.

### 3.2 `t14` — sound; one note left behind

*"Stop offering to pick me up — I ____ a taxi from the airport. I hadn't
thought about it until just now, so nothing is arranged."*

- `will take` (key) — a decision taken in this exchange.
- `am taking` — **not acceptable.** *"nothing is arranged"* is a direct
  denial. This was the surviving second answer and it is now dead, on the
  lesson's own axis. The fix works.
- `take` — not acceptable. The tempting reading here is the **habitual**
  one (*"Don't bother, I take a taxi from the airport"*), which is a natural
  English sentence, and it is defeated by *"I hadn't thought about it until
  just now"*. Its `optionNote` addresses only the timetable reading, so the
  learner who chose it for the habitual reason is answered off-target. Minor,
  and consistent with the lesson's framing of Present Simple as timetables.
- `have taken` — not acceptable.

**The note that no longer fits.** `have taken`'s note reads *"konuşan henüz
havaalanına inmiş bile değil"* and the repair's §3.2 explicitly declines to
touch it (*"was already about the speaker not having landed and is
unchanged"*). The old paragraph supported it with *"so just relax at home"*;
the new paragraph deleted that clause and replaced it with two sentences
about arrangement. Not-yet-landed is still *inferable* — you do not offer to
collect someone who has arrived — so I do not call this false, only
unsupported where it used to be stated. It is the one place in this repair
where a note survived a paragraph change on the strength of a clause that
was removed.

### 3.3 `t23` — good swap, taxonomy cost

- `already` (key) ✓ — my answer before reading.
- `yet` — not acceptable; needs a negative or a question. The `henüz`
  transfer error and the item's real trap.
- `never` — not acceptable, and **decided by meaning**: someone who has never
  finished cannot say there is no need to remind them. This is the item the
  category was missing and the swap is a clear gain over `since`, which the
  blind pass showed was a real sentence adverb.
- `ever` — not acceptable; does not stand alone in a positive declarative.

**Cost.** `never` and `ever` are not taught anywhere in the Time Expressions
lesson — not in either `contrast`, not in `forms`, not in either `decision`
block except as chips in a list about tense. The repair's own §5 records
*"`during`, `while`, `before` are options in Time Expressions and are taught
nowhere in the lesson"* as a known, unfixed problem and then says *"t22's
rewrite did not add any of them"* — true, and t23's re-optioning added two
more members of the same class. A learner who picks `never` is linked from
the results screen to a lesson with no rule that would have stopped them.

### 3.4 `t7` — tail fix verified, `broke` still acceptable

The old tail *"and left it broken for the whole office"* made `broke …
and left` perfectly parallel and so half-endorsed the distractor; the new
*"and now the whole office is drinking instant coffee"* removes the
coordination and supplies a present consequence, which is what r4 of the
category's decision block asks for. Genuine improvement, and it is the
reason t7 now reaches its key at all.

All three notes and the `explanation` re-read against the new text:
*"makine hâlâ bozuk"* (implied by the instant coffee), *"Look at this
mess!"*, *"bu dağınıklığı yaratan tek bir olay"*, *"gözünün önünde duran bir
sonuç"* — all still true. Nothing left behind.

`broke` remains a sentence a competent teacher accepts. The repair says so.
I agree with the diagnosis and with leaving it in this pass — see §6.

### 3.5 `t19` — answered blind, and it holds

*"The interview lasted barely ten minutes. The manager glanced at my
portfolio, ____ me two short questions about the deadline I had missed the
year before, and said she would call me on Monday."*

My answer before opening the key: **`asked`**, certain. The blank is the
middle term of a three-way coordination — `glanced …, ____ …, and said …` —
which fixes the finite form.

| option | reads as | accept? |
| --- | --- | --- |
| `asked` | the middle of `glanced` → `asked` → `said` | yes |
| `had asked` | "The manager glanced at my portfolio, had asked me two short questions …, and said …" | **no.** A coordination cannot mix a simple past with a past perfect across `and` like this, and there is nothing for the questions to precede. Live for a learner taught "Past Perfect = the earlier of two past events" — which is what this lesson's `pitfall` and t12's tip still say. |
| `was asking` | a background process | **no.** A progressive cannot sit in a chain of three completed acts framed as "barely ten minutes". |
| `has asked` | tied to now | **no.** `lasted`, `said`, `would call` close the scene. |

No second answer survives. The paragraph is 34 words, the near-duplicate
and scenario checks pass, and it collides with no lesson sentence in the
topic (I ran the cross-category sweep in §5). The claimed coverage change is
real: the category's keys are now `was walking` / `had left` / `was cooking`
/ `had rebuilt` / `asked`, and `blind-oldest.md` §3's *"Past Simple is never
the answer"* is answered.

Two honest reservations. The deciding evidence is the coordination
immediately around the blank, so the first sentence and the tail are
scenery — this is not the meaning-decided item the category also needs. And
the paragraph's own `had missed` makes the antecedent of the category's r2
true, as §2.3 sets out. Neither is a defect; both are things the next pass
should know it inherited.

### 3.6 `t22` — answered blind, key agreed, item does not ship

*"The results were supposed to go up on Friday, and it is now the middle of
the following week. According to the secretary, the marks haven't been
entered ____, so nobody in our year can register for next term."*

My answer before opening the key: **`yet`**, certain — clause-final `yet`
under a negative.

| option | accept? |
| --- | --- |
| `yet` (key) | yes |
| `already` | **no.** Belongs to positive statements; the work has not been done at all. Live, and it is the t23 pair run backwards, which is a real gain. |
| `still` | **no** — but only on **placement**, and the placement rule is not in the lesson. See below. |
| `ago` | **no**, and dead in the slot: no quantity anywhere near the blank, nothing to consider. |

Two findings.

**The `still` rule is missing from the lesson.** The `explanation` and the
`optionNote` both defeat `still` by saying it goes before the auxiliary in a
negative (*"the marks still haven't been entered"*). The lesson's `contrast`
gloss says only *"fiilden önce gelir"* with a positive progressive example;
the `forms` row — which this repair edited, per its §1.7 — now reads
`S + still + V / S + be + still + V-ing`, two positive patterns; the `yet`
row does carry its negative pattern, and the `still` row does not. So the
one rule that separates the key from its nearest rival exists only inside
the item. `lessons-oldest.md` §1.10 flagged the `still` row and the repair
fixed the half of it that the report named, not the half its own new item
created a need for.

**`ago` survived as a dead option.** `option-notes-4.md` §5 named `still`
*and* `ago` as dead-in-slot in the old t22, *"leaving `yet` as the only live
distractor"*. The rewrite made `still` live and left `ago` dead for the same
positional reason — the repair's own table says so (*"there is no quantity in
front of the blank"*) while its §4.2 prose claims the rewrite *"fixed … the
dead distractors"*. Half of that finding was closed.

The scenario does avoid printing `already`, `yet` and `still` outside the
option list, as claimed. Verified.

---

## 4. The moved lesson examples, checked against their whole lessons

Every moved sentence was read against the block it sits in, the note beside
it, and the four items of its category.

| moved | verdict |
| --- | --- |
| Future Forms `will` example → *"That's the doorbell — I'll get it."* | Consistent with the `will` gloss (*ani karar*); collides with no item. Clean. |
| Future Forms `be going to` example → *"The tank is almost empty — we are going to run out of fuel."* | Consistent with the gloss and now mirrored by the decision block's new parenthetical *"boş yakıt göstergesi"* — lesson-internal agreement improved. Clean. |
| Future Forms `examples[2]` → *"The queue is enormous — we are going to be late."* | The note *"Gözle görülür kanıta dayalı tahmin"* is still true of the new sentence. Clean. |
| Perfect Aspects `pitfall` → *"We have waited / have been waiting in this queue for forty minutes."* | Same error, same teaching, `why` updated in step. Clean, and the sharpest of the five moves — the old pair **was** t17's distractor/key with t17's own object. |
| Time Expressions `already` `contrast` example → *"They have already announced the results."* | Consistent with the gloss. Clean. |
| Time Expressions `pitfall` → *"I have paid the bill yet." / "I have already paid the bill."* | `wrong` and `right` differ in exactly the taught thing; `why` unchanged and still true. Clean. |
| Time Expressions `examples[2]` → *"They sold the house three months ago."* | Note still true. Clean. |
| Time Expressions `pitfall` → *"She has graduated two years ago." / "She graduated two years ago."* | Clean. |
| Time Expressions decision r1 parenthetical → *"(2019, the pandemic, I graduated)"* | Slightly weaker for t21 (the learner must generalise to *last summer*), still clearly a starting point. Acceptable trade. |
| Future Forms decision r3/r4 parentheticals | Both generalised correctly. Clean. |
| Time Expressions `still` `forms` pattern | Now generates the `contrast` example. Half the §1.10 finding closed; see §3.6. |

**No moved example contradicts its own block or collides with another item
in its category.** That part of the repair is sound, and I looked for the
failure mode the brief names (an example moved out of one collision and into
another) and did not find it.

What I did find is in the sentences that were **not** moved — §5.

---

## 5. Giveaways: the number is right and the file is not clean

`npm run format --check` passes. `npm run validate` passes. I ran
`checkLessonGiveaway` from `tools/content-checks.mjs` myself over this
topic, and then re-ran it over `4c97859`'s version of the file in a scratch
copy of the repo:

- **before: exactly 5** — t13, t17, t22, t23, t24, the ids the log names;
- **after: 0.**

I also ran it **cross-category** — every question against every *other*
lesson in the topic, which is how `option-notes-4.md` §2 found the old t19 —
and that is 0 as well. The claim is verified, and the old t19 collision with
the Perfect Aspects lesson is genuinely gone.

The number is not the file. `lessonSentences()` collects
`contrast.sides[].example`, `forms.rows[].example`, `examples.items[].sentence`
and a `pitfall`'s `wrong`/`right` — **and nothing else**. It does not read
`text.body`, it counts shared words rather than shared meaning, and it
compares a question only against its own category's lesson. Four collisions
sit in those blind spots, and one of them is at the warning threshold:

| item | against | shared run | why silent |
| --- | --- | --- | --- |
| **t12** | its own lesson's `text` block: *"I didn't recognize the campus because they had rebuilt it since my last visit."*, followed by *"ondan önce biten eylem 'had rebuilt'"* | **6, carrying the key** | `text.body` is not collected. This would warn today if it were. The paragraph, the key and the reasoning are all above the question, in the same category, so a `check` block can serve it three blocks below its own answer. |
| **t16** | Future Forms `contrast`: *"We are having dinner with them on Saturday."* | **5, carrying the key** | one under `GIVEAWAY_RUN`. The repair moved the `will` example in the block above for precisely this, at precisely this distance. |
| **t17** | Perfect Aspects `contrast` and `examples`: *"I have been writing for two hours."* (twice), `forms`: *"I have been writing."* | 4, carrying the key | below threshold. The keyed form appears three times in the lesson, twice inside a `for` + duration frame — which is t17's frame. |
| **t25** | Perfect Aspects `pitfall`: *"She has gone to the library; she'll be back in an hour."* and `contrast`: *"He has gone to the store; he'll be back soon."* | 3 | paraphrase, not reproduction. The `pitfall`'s `why` states t25's decision in full. |
| **t20** | *Present Perfect vs Past Simple* `examples`: *"Have you ever been to Japan?"* | 3, cross-category | different lesson, and below threshold. This is `option-notes-4.md` §2's argument about t19 word for word — *"any learner who read that lesson has been shown the answer as a worked example"* — with the same country in it. The repair rewrote t19 for that argument and discussed t20 at length in §5 without noticing that t20 carries it too. |

None of these is a fabrication of the tool's threshold: each is a sentence a
learner meets above a question whose answer it contains.

---

## 6. The log against its own diff

I read the 306-line diff before and after the log. **The log is accurate
about what it changed**, in unusual detail — every table in §1 matches the
file, every moved sentence in §2 is in the diff, and the two rewritten items
are exactly as described. Three places where it claims a little more than
the diff supports:

1. **§1.2, *"Nothing is lost"*.** The rules survived; the `text` block that
   pointed at them did not (§2.1).
2. **§4.2, *"the rewrite fixed the key distribution and the dead
   distractors"*.** It fixed the key distribution and one of the two dead
   distractors (§3.6).
3. **The headline "5 → 0"** is true of `npm run validate` and is presented,
   in §6 *Verification actually run*, as *"27 corpus warnings, none of them
   in `data/tenses/tenses.json`"*. That is a statement about the checker
   (§5). The log never claims the file is free of giveaways, so this is a
   framing risk rather than a false claim — but it is the number the next
   session will read.

Two claims I specifically tried to break and could not: *"no key was changed
on the basis of correctness"* (true — t19 and t22 are new paragraphs, and no
existing paragraph had its key re-decided), and *"every rewritten
paragraph's `explanation`, `tip` and three `optionNotes` were re-read
against the new text"* (true for t7, t9, t19, t22, t23; the single exception
is t14's `have taken` note, which the log names as unchanged and which lost
the clause it was written against — §3.2).

One process note: `blind-oldest.md` §4 lists **t19 among the thirteen tenses
items it could not break**, and the repair rewrote it anyway. The reasoning
is good and I agree with the outcome — but the repair declined to rewrite
t20 on exactly the ground that it was in that list. The asymmetry is worth
naming, because it means the largest change in the pass is the one with the
least prior reading behind it. That is why §3.5 exists.

---

## 7. The six things the repair chose not to do

Asked for, briefly, and I disagree with two of them.

- **`t7` — `broke`, recorded not fixed. Agree**, for this pass. No change to
  the option list makes it wrong. I would add what the repair does not: the
  item cannot be repaired within its key. Present Perfect against Past Simple
  with an *unstated* time and a present result is a two-answer contrast in
  modern English, so t7's category has to test the closed-period side (which
  t6 already does) or the open-period side (t5, t8) — t7 is the item that
  should be replaced next, not defended again.
- **`t12` — `have rebuilt`, recorded not fixed, decision block fixed
  instead. Agree with the choice and disagree that it was completed.** The
  Time Expressions half was fixed; the *Present Perfect vs Past Simple* half
  — the same `since` chip, the same victim — was not (§2.2). Half a fix for
  this defect is worse than the log implies, because the log presents it as
  the reachable half of the problem having been reached.
- **`t4` — `am thinking`. Agree.** The stative rule is what the category
  teaches, the lesson states it explicitly and emphatically, and it is what
  the paper rewards. Leave it.
- **`t13` — `will rain`. Agree**, and this is the least worrying of the six:
  the evidence-vs-spontaneous axis *is* the category, and the paragraph
  plants the evidence in the first three words.
- **`t3` — decided by world knowledge. Agree it should be left, disagree
  with the implied improvement.** The new timeless-truth branch means the
  lesson now contains the rule the item turns on, which is a real gain for
  the *lesson*. The *item* is unchanged and still has `boiled` and
  `has boiled` as one distractor in two costumes, so it remains effectively a
  two-option item. The repair does not claim otherwise; a reader skimming
  §1.2 might think it does.
- **`t8` — `experienced`. Agree** with leaving it out of scope. Note that
  with t7 it makes **two of four** items in *Present Perfect vs Past Simple*
  rest on a preference rather than a rule. That is a category-level finding
  and belongs in whatever pass replaces t7.

Of the other findings knowingly left: I agree with **t20** (do not rewrite a
working item to fix a dead-option count) — with the addition from §5 that
t20 has a giveaway nobody has recorded, which changes the cost-benefit of
that rewrite. I agree with **t3's costumes**, **t1's explanation**, **D4 in
Time Expressions** (not fixable without changing what the category tests),
**§1.8**, and **§1.10's `forms` split and t20's unmarked speaker shift**.
I partly disagree with **§1.9**: it concludes *"no live item springs any of
them"*, and `since` in the *Present Perfect vs Past Simple* block springs on
t12.

---

## 8. What I am least sure of, most doubt first

1. **The Future Forms r3 / t15 near-fire (§2.4).** My least confident
   finding and the reason I did not make it the blocking one for that
   category. It turns on whether a learner reads *"the board at the station
   is very clear"* as *"gözle görülen somut bir kanıt"*. Strictly r3 requires
   a prediction and t15 makes none; loosely, "very clear" is an invitation.
   I decided against blocking on it and I could be wrong in either
   direction — the repair's own §1.1 exercised the same judgement on t17's
   `for hours` and called it "no".
2. **Whether t14's `have taken` note is actually stranded (§3.2).** I argued
   that offering to collect somebody implies they have not arrived, which
   rescues the note. If that inference is weaker than I think, this is a
   real note-left-behind defect rather than the near-miss I filed it as.
3. **Perfect Aspects' verdict (§1, §5).** t25 against its own `pitfall` is a
   paraphrase, not a reproduction, and I am marking a category DOES NOT SHIP
   on a defect no tool measures and that predates this repair. My reasoning
   is that the pitfall hands over both the cue (*she'll be back*) and the
   form, which is the whole item — but a supervisor who scopes this pass to
   "what did the repair change" would reasonably downgrade it to *worth
   fixing*.
4. **Whether the "Son kural" dangle is worth a DOES NOT SHIP (§2.1).** The
   paragraph explains itself and the damage is confusion, not a wrong
   answer. I graded it blocking because it is a two-word fix, because it is
   a defect this repair introduced, and because the only rule list left in
   the lesson makes the phrase point at the opposite rule. A grader who
   weighs learner impact rather than provenance would call it a note.
5. **Whether `never` and `ever` being untaught is a defect or a category
   design fact (§3.3).** Every signal-word category will carry options it
   does not teach; the line I drew is that `during`/`while`/`before` were
   already recorded as a problem and this pass added to the list rather than
   holding it steady. That is a judgement about direction, not about a
   threshold.
6. **t19's r2 exposure (§2.3).** I convinced myself the rule's *"o erken
   olay"* scoping holds, and the trace above records it as reaching the key
   at r5. If the next pass decides a checklist is read by antecedent alone —
   which is the standard this repository has applied everywhere else — then
   r2 fires on t19 and returns `had asked`, and that category's verdict
   changes for a second reason.

**What I did not check.** I did not run `npm run verify` (no markup, CSS or
JS changed, and it needs a server). I did not read the other two topics
under repair, so any cross-topic near-duplicate between a tenses item and a
modals or passive-voice item is unexamined by me — `npm run validate`'s
corpus checks report none. I did not re-derive the keys of the nineteen
items the repair did not touch beyond what the decision-block traces
required; where I substituted options into an untouched item (t7, t15, t17,
t20, t25) I say so above, and where I did not, the verdict rests on
`blind-oldest.md`'s 73/73 rather than on my own reading.
