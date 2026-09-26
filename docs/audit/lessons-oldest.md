# Lesson sufficiency pass — Tenses, Modals, Passive Voice

**I am uncalibrated.** No blinded calibration file was handed to me (`npm run
calibrate` produces one; `docs/agents/calibration.md` is the key and I did not
open it). Read the findings below as ungraded.

This is the **lesson sufficiency pass**, not the blind item pass. Scope: the 18
lessons and 72 questions in `data/tenses/tenses.json`,
`data/modals/modals.json`, `data/passive-voice/passive-voice.json`.

Method, per lesson: run the `decision` block as a literal ordered checklist
against all four of its category's questions and record which step fires;
check that every question's rule is stated somewhere in the lesson; check
`contrast` against `forms` against the items; check whether the lesson's own
prose contains a question's answer; read the Turkish for claims that are wrong
about English or that contradict their own example.

Nothing under `data/` was edited.

---

## 0. The finding that outranks everything else

### 0.1 The lessons are written out of their own questions — blocking, all three topics

**49 of the 72 questions, counted strictly, have their keyed sentence
reproduced verbatim or near-verbatim inside their own lesson's blocks** (a
further three are borderline structural echoes). In **9 of the 18 lessons all
four questions are reproduced.** A `check` block draws from the questions
sharing the lesson's category, so this is not a distant risk: the learner meets
the answer two or three blocks above the question, in the same scroll.

The clearest examples, one per topic:

| Lesson block | Text in the lesson | The question |
| --- | --- | --- |
| `passive-voice` › By + Agent › `pitfall` | wrong: `"My wallet was stolen by someone on the train."` right: `"My wallet was stolen on the train."` | `passive-voice-t21`: *"My wallet ____ while I was on the crowded train…"* — key `was stolen`, closest distractor `was stolen by someone`. The pitfall **is** the item's key/distractor pair. |
| `passive-voice` › Modal Perfects in Passive › `pitfall` | wrong: `"This mistake should be caught much earlier."` right: `"This mistake should have been caught much earlier."` | `passive-voice-t10`: *"This mistake ____ caught much earlier…"* — key `should have been`, closest distractor `should be`. Same. |
| `tenses` › Time Expressions › `examples` | `"The meeting had already started by the time we arrived."` | `tenses-t22`: *"The meeting had ____ started by the time we arrived…"* — the example is the stem with the blank filled. |
| `tenses` › Time Expressions › `pitfall` + `examples` | `"He moved to Istanbul five years ago."` (twice) | `tenses-t24`: *"He moved to Istanbul five years ____…"* — key `ago`. Identical sentence. |
| `modals` › Can vs Could vs May vs Might › `contrast` | Can: `"Can I borrow your notes from yesterday?"` · Could: `"Could you possibly lend me your charger?"` · Might: `"I'm not sure, but I might come later."` | `modals-t5`, `modals-t8`, `modals-t7`. Three of that lesson's four items, in one block. |
| `modals` › Can vs Could vs Be Able To › `pitfall` | wrong: `"Despite the traffic, she could arrive on time."` right: `"Despite the traffic, she was able to arrive on time."` | `modals-t23`: *"Despite the terrible traffic, she ____ arrive…"* — key `was able to`, distractor `could`. Again the exact pair. |

Per lesson, questions whose key sentence is reproduced in that lesson:

| Topic | Lesson | Leaked |
| --- | --- | --- |
| tenses | Present Simple vs Present Continuous | 0 of 4 (t1 shares *every morning* + *goes to the* with the contrast; borderline) |
| tenses | Present Perfect vs Past Simple | 0 of 4 — **the one clean lesson in the corpus** |
| tenses | Past Simple vs Past Continuous vs Past Perfect | 1 of 5 (t12); t10 borderline; t19 leaked by a *different* lesson |
| tenses | Future Forms | **4 of 4** |
| tenses | Perfect Aspects | 1 of 4 (t17) |
| tenses | Time Expressions & Signal Words | 3 of 4 |
| modals | Must vs Have to vs Mustn't vs Don't Have to | 2 of 4 (t3, t4); t1 borderline |
| modals | Can vs Could vs May vs Might | **4 of 4** |
| modals | Must vs Can't vs Might/Could | 1 of 4 (t11); t10 borderline |
| modals | Modal Perfects | 2 of 4 (t14, t16) |
| modals | Should vs Ought To vs Had Better | 3 of 4 (t17, t19, t20) |
| modals | Can vs Could vs Be Able To | **4 of 4** |
| passive-voice | every one of the six lessons | **4 of 4 each** |

Two specific sub-cases worth separating out, because they are worse than the
rest:

- **The lesson gives the key *and* the closest distractor.** `passive-voice`
  pitfalls for t5, t6, t10, t12, t20, t21, t24; `modals` pitfalls for t16, t23.
  A pitfall block whose `wrong`/`right` pair is an item's distractor/key pair
  does not teach that item, it answers it.
- **Cross-lesson leak.** `tenses` › Perfect Aspects prints
  `"By the time she turned thirty, she had founded two companies."` twice —
  once in `examples`, once in the *Hangi ana bağlı* `contrast`. That is
  `tenses-t19` verbatim, and t19 belongs to **Past Simple vs Past Continuous vs
  Past Perfect**, so it will not surface as a check inside Perfect Aspects but
  will surface on the Test tab to a learner who read that lesson.

What a learner ends up believing: that they know the rule, when what they have
is a memory of the sentence. On the paper the sentence will be different and
the recall will not transfer — which is exactly the failure the exam is built
to find.

**Structural note for whoever repairs this.** `tools/validate-content.mjs`
already has `checkIntroGiveaway`, which errors when an intro's English prints
a phrase from one of its own questions' stems or options. It runs on `intro`
only. The same comparison over `contrast.sides[].example`,
`forms.rows[].example`, `examples.items[].sentence`, `pitfall.wrong` and
`pitfall.right` would have caught roughly fifty of these mechanically. The
guardrail exists; it was never pointed at the blocks.

### 0.2 The `decision` blocks were written by reading off the item set — worth fixing, all three topics

A second consequence of the same authoring order. Several `decision` rules
carry `signals` chips or Turkish parentheticals that are not general English
cues at all — they are the deciding words of one specific question:

- `modals` › Must vs Have to › rule 2 `signals: [… "we'll provide them"]` — that
  is `modals-t4`'s clue (*"she'll provide printed copies for everyone"*) and
  nothing else.
- `modals` › Can/Could/May/Might › rule 2 `signals: ["politely", "possibly",
  "please", "a stranger"]` — three of the four are literally in `modals-t8`
  (*"…she asked the stranger next to her politely"* / *"____ you possibly…"*).
- `modals` › Can/Could/Be Able To › rule 2 `signals: [… "once you finish" …]`
  — `modals-t24` opens *"Once you finish this course"*.
- `modals` › Should/Ought/Had better › rule 2 condition *"(ceza, kaçırılan tren,
  **kabul edilmeyen ödev**)"* — the third item is `modals-t18`'s consequence.
- `passive-voice` › Passive with Modals › rule 2 *"Özne eylemi kendi
  yapabilecek bir varlık değilse (**form, kapı, ilaç, proje**)"* — form = t5,
  ilaç = t7, proje = t8, and t6 is a door held open.
- `passive-voice` › Tense Forms › rule 3 `signals: [… "in 1973" …]` — a
  four-digit year that exists in the corpus once, in `passive-voice-t2`.
- `passive-voice` › Causative › rule 1 *"(her hair cut, the car fixed)"* — t13
  and t14.

These rules score 100% on the four items they were written from and carry
nothing to the paper. A decision block that names *this year* rather than *a
specific past year* is a rule; one that names *1973* is an answer key.

---

## 1. `data/tenses/tenses.json`

### 1.1 Perfect Aspects — the decision block's rule 2 produces the keyed distractor on t18 — **blocking**

Block: the final `decision`, *"Sınavda ne arayacaksın"*. Rules, in order:

```
1  signals: how long, for three hours, all day, lately      → Present Perfect Continuous
2  condition: "Eylem hâlâ sürüyorsa ya da izi ortadaysa
   (yorgunum, gözlerim kızarmış, hâlâ bitmedi)"             → Present Perfect Continuous
3  signals: how many, how much, so far, three times         → Present Perfect Simple
```

Run it on `tenses-t18`: *"She ____ five chapters of the book **so far**, and
**she's determined to finish the rest** by the weekend."* Rule 1 does not fire.
Rule 2 does — the reading is manifestly still going on, which is what
*"hâlâ bitmedi"* names. First match wins, and the answer it hands the learner
is `has been reading`, which is the item's closest distractor. The rule that
reaches the key (`has read`) is rule 3, one step too late.

The same misfire threatens `tenses-t25` (*"…she should be back before the
meeting starts"* — Deniz is still away, so rule 2 fires and offers
`has been going`, another distractor).

What a learner believes: that "still in progress" decides between Perfect
Simple and Perfect Continuous. It does not — quantity-vs-duration does, and
the lesson's own `contrast` says so (*"ne kadarının tamamlandığına…"* vs
*"ne kadar süredir devam ettiğine"*). The decision block contradicts the
contrast it is meant to operationalise.

### 1.2 Time Expressions — the second decision block walks the learner into a trap another lesson names — **blocking**

Block: `decision` *"Kelimeyi gördün, hangi zaman gelir"*, rule 1:

```
signals: ["since", "for", "already", "yet", "just", "so far", "ever", "never"]
then: "Present Perfect"
```

Two of those eight are signals the topic elsewhere warns are not signals at
all:

- **`for`.** *Present Perfect vs Past Simple* carries a whole `text` block
  about it: *"Bir kelime iki tarafta da çıkabilir: **for**. … Kararı veren
  kelime değil, dönemin hâlâ açık olup olmadığıdır."* Its own `decision`
  correctly omits `for`. Time Expressions puts it back, unqualified.
- **`since`.** *Past Simple vs Past Continuous vs Past Perfect* carries
  *"Bir uyarı: **since** her zaman Present Perfect demek değildir."* And
  `tenses-t12` is keyed on exactly that: *"I didn't recognize the campus at
  first because they ____ the whole entrance **since** my last visit"* → key
  `had rebuilt`, with the item's own optionNote calling `have rebuilt`
  *"'Since' görünce en kolay düşülen tuzak"*. A learner who runs Time
  Expressions' rule 1 on t12 picks that named trap.

The topic's `intro` says of this lesson *"bağımsızdır ve önce de okunabilir"*,
so it must stand on its own — and standing on its own it teaches a rule two
other lessons exist to correct.

Same block, rule 3 partially patches `already`/`yet` for a past reference
point but says nothing about `since` or `for`.

### 1.3 Present Simple vs Present Continuous — the first decision block gets the lesson's own example wrong — **blocking**

The lesson carries two `decision` blocks with the same three rules in
different orders.

`"Cümledeki ipucu"` (first, immediately after `forms`):

```
1  signals: every day, usually, often, always, never, on Mondays  → Present Simple
2  signals: now, right now, at the moment, currently, these days,
   this week                                                      → Present Continuous
3  condition: stative verb (think, believe, love, know, own…)      → Present Simple
```

The lesson's own `examples` block, three blocks later, contains
`"I understand the problem now."` with the note *"Durum fiili; \"now\" var ama
yine de Present Simple"*. Run the checklist on that sentence: rule 2 fires on
`now` and returns Present Continuous. The stative rule is third and never
reached.

The lesson knows this — the `text` block right after says *"Son kural sınavda
en çok puan kaybettiren yer"* — and the second decision block,
`"Sınavda sırayla bunlara bak"`, fixes it by putting the stative rule first.
But a learner reads top to bottom and meets the broken order first, under a
heading that does not say it is provisional.

No question in the category springs this (none combines a stative verb with a
`now`-type adverb), which makes it a lesson defect rather than an item defect —
and an untested one, so nothing in the app will surface it.

### 1.4 Present Simple vs Present Continuous — the decision procedure has no branch for the case `tenses-t3` turns on — **worth fixing** (L1)

`tenses-t3`: *"Water ____ at 100 degrees Celsius at sea level, **a fact** every
chemistry student memorizes early on."* → key `boils`.

The rule is stated in the lesson — the `contrast` gloss for Present Simple
reads *"…ya da **her zaman doğru olan bir gerçek**"*, and `examples` carries
*"The sun rises in the east."* → *"Değişmeyen gerçek → Present Simple"*. So the
lesson is not silent (point 2 passes).

But neither `decision` block has a timeless-truth branch. Run
`"Cümledeki ipucu"` on t3 literally: no habit signal, no `now` signal, `boil`
is not stative — the checklist ends with no answer. Run
`"Sınavda sırayla bunlara bak"` and rule 3's chip list is
`["every", "usually", "always", "never"]`, so it fires on the bare `every` in
**"every chemistry student"** — a quantifier on a noun, not a time expression.
The learner reaches the key by matching the wrong word, and a learner who
correctly declines to match it falls off the end of the list.

### 1.5 Perfect Aspects — the decision block has no `been`/`gone` branch, though half its items turn on it — **worth fixing** (L1)

The category is named *"Perfect Aspects: Simple vs Continuous vs **Been/Gone**"*
and two of its four questions are been/gone items: `tenses-t20`
(*"Have you ____ to Japan before"* → `been`) and `tenses-t25`
(*"She ____ down to the archive… she should be back"* → `has gone`).

The final `decision` block has five rules and every one of them is about
Simple-vs-Continuous or Past Perfect. Nothing about been/gone. The distinction
*is* taught — there is a `contrast` (*"Been to / gone to"*) and a `pitfall` —
so the learner has the rule, but the block described in `CONTENT_GUIDE.md` as
*"the procedure the learner carries into the exam"* and *"the block a learner
will come back for"* omits a third of its own lesson.

### 1.6 Future Forms — the decision block's last rule cannot fire on `tenses-t15` — **worth fixing**

Final `decision`, rule 5:

```
signals: ["according to the schedule", "the timetable says", "departs at", "arrives at"]
then: "Present Simple"
```

`tenses-t15`: *"The last train back ____ at 23:10 tomorrow night, and **the
board at the station is very clear** that nothing runs after it."* → key
`leaves`. None of the four chips is in the paragraph. Rules 1–4 do not fire
either (no speaking-moment decision, no `I promise`/`I think`, no visible
physical evidence, no pre-arranged personal plan). The checklist terminates
with no answer on a live item.

Rule 5 wanted a `condition` (*the time is set by a printed schedule rather than
by anyone's decision*) and was written as `signals`. The lesson's `pitfall`
(*"The plane will leave at 6pm according to the schedule."* →
*"The plane leaves…"*) has the same shape: it teaches the phrase rather than
the idea.

### 1.7 Time Expressions — three of four questions are answered by the lesson's own prose — **blocking** (instance of §0.1)

Called out separately because the task asked it be verified specifically, and
it verifies:

- `tenses-t22` ← `examples`: `"The meeting had already started by the time we
  arrived."` — the stem with the blank filled, seven shared 4-grams.
- `tenses-t23` ← `contrast`/already example and `pitfall.right`, both
  `"I have already finished the assignment."` — the stem is *"I've ____
  finished the assignment"*.
- `tenses-t24` ← `examples` `"He moved to Istanbul five years ago."` **and**
  `pitfall.right` `"He moved to Istanbul five years ago."` **and**
  `pitfall.wrong` `"He has moved to Istanbul five years ago."` The stem is
  *"He moved to Istanbul five years ____"*.
- `tenses-t21` (`since`) is not reproduced as a sentence, but the `decision`
  rule *"Boşluktan sonra bir başlangıç noktası varsa (2019, **last summer**, I
  graduated) → since"* names the item's exact following phrase.

### 1.8 Present Perfect vs Past Simple — the `for` caveat is taught and never tested — **worth fixing** (L5)

The lesson devotes a `text` block and an `examples` item (*"I lived in Izmir
for five years, but I moved away in 2019."* → *"\"For\" var ama dönem 2019'da
kapanmış → Past Simple"*) to the signal that appears on both sides. None of
`tenses-t5`–`t8` contains `for`. Of the eight chips in the Present Perfect
branch of the decision block — `since, already, yet, just, ever, never, so
far, recently` — exactly one (`since`, in t5) is ever exercised.

This is the defect `docs/agents/reviewer.md` names as *the Present Perfect vs
Past Simple defect*, and it is still here. It is also the cleanest lesson in
the corpus by the §0.1 measure, so it is worth keeping and worth extending.

### 1.9 Signals that point two ways across lessons — **worth fixing** (L2)

| Signal | Lesson A | Lesson B |
| --- | --- | --- |
| `already` | Present Perfect vs Past Simple → **Present Perfect**; Time Expressions → **Present Perfect** | Past Simple/Continuous/Perfect → **Past Perfect** (rule 1 chip) |
| `this week` | Present Simple vs Present Continuous → **Present Continuous** (rule 2 chip) | Present Perfect vs Past Simple → **Present Perfect** (rule 3 condition, *"this week, this year"*) |
| `just`, `recently`, `never` | Present Perfect vs Past Simple → **Present Perfect** | all three occur freely with Past Simple; `CONTENT_GUIDE.md` names `just` as its example of a both-sides trigger |
| `as` | Past Simple/Continuous/Perfect → **Past Continuous** (rule 3 chip) | `as` is a causal and comparative conjunction far more often than a simultaneity marker |

Only `already` is ever disambiguated, and only in Time Expressions' second
decision block.

### 1.10 Notes

- **Future Forms `forms` block mixes polarities with purposes.** Rows are
  `will`/Olumlu, `will`/Olumsuz, `be going to`/Olumlu, then Present
  Continuous/*Kesinleşmiş plan* and Present Simple/*Resmî tarife*.
  `CONTENT_GUIDE.md`: *"a block mixing polarities with purposes is two
  blocks."*
- **`tenses-t20`'s paragraph shifts speaker without marking it.** *"My advisor
  mentioned a summer research program in Kyoto and asked whether **I** would
  need to apply for a visa. Have **you** ____ to Japan before…"* The second
  sentence is the advisor's direct speech with no quotation marks; the first
  sentence is the narrator's. It reads as an error before it reads as a frame.
- **Time Expressions' `still` row contradicts its own contrast example.**
  `forms`: `pattern: "S + still + V"`, example `"She still works there."`
  `contrast`: gloss *"…ve fiilden önce gelir"*, example
  `"She is still waiting for the results."` — where `still` follows the
  auxiliary. The pattern as written does not generate the contrast's example.
- **`during`, `while`, `before` are options in Time Expressions questions
  (t21, t24) and are not taught anywhere in the lesson.** The `optionNotes`
  carry the whole teaching load for them.

---

## 2. `data/modals/modals.json`

### 2.1 Must vs Have to — the `forms` block contradicts the `contrast`, and `modals-t2` is keyed against the `forms` block — **blocking** (D1 / D8)

The `contrast`, *"Zorunluluğu kim koyuyor"*:

> **Must** — *"Konuşmacının kendi koyduğu zorunluluk: kendi kararı, kendi
> verdiği söz, kendi vicdanı. **Kimse onu zorlamıyordur.**"*
> **Have to** — *"Dışarıdan gelen zorunluluk: bir yasa, bir kurum kuralı, bir
> amir."*

The `forms` block, two blocks later:

> `{ form: "Must", use: "Olumlu", pattern: "S + must + V", example: "You must wear a helmet." }`
> `{ form: "Must", use: "Olumsuz", pattern: "S + mustn't + V", example: "You mustn't park here." }`

Both examples are externally imposed rules addressed to someone else — the
precise thing the contrast says `must` is *not*. The second `contrast` block
compounds it: its `Mustn't` example is `"You mustn't use your phone during
takeoff."`, an airline regulation.

Then `modals-t2`: *"According to the university's regulations, every student
____ submit a health report…"*, options `["has to", "must", …]`, keyed
`has to`. Its own explanation concedes the problem and resolves it with an
appeal the app cannot support:

> *"Anlamca 'must'a yakın olsa da, resmi kurumsal kural bağlamında **sınavlarda
> 'have to' tercih edilir**."*

*Every student must submit a health report* is not merely acceptable, it is the
register regulations are actually written in — and the lesson's own `forms`
block models it. This is D1 with both answers standard, which
`docs/agents/reviewer.md` classes as blocking, and D8 besides: the learner who
studied the `forms` block picks `must` and is marked wrong.

`modals-t1` sits on the other side of the same shaky distinction (*"nobody is
forcing me, but I promised"* → `must`, with `have to` as an option). t1 is
defensible inside the taught system; I flag the pair together rather than
twice, because it is one defect: the internal/external split is stated as
absolute and is not.

### 2.2 Should vs Ought To vs Had Better — the decision block and the examples block classify the same sentence differently, on a live item — **blocking**

`modals-t20`: *"You ____ leave your valuables visible in the car like that;
**it's basically an invitation for someone to break in**."* → key `shouldn't`.

The `decision` block, rule 2:

> *"Tavsiyeye uyulmazsa ne olacağı cümlede açıkça yazıyorsa (ceza, kaçırılan
> tren, kabul edilmeyen ödev)"* → **Had better**

The consequence is written in the sentence. Rule 2 fires, before the `should`
rules, and returns `had better not` — a form t20 does not offer. Meanwhile the
lesson's `examples` block contains the item's own sentence with the opposite
label:

> `"You shouldn't leave your valuables visible in the car."` →
> *"Olumsuz tavsiye, **bir uyarı değil** → shouldn't"*

So one block says this sentence is not a warning and another says a sentence
with a written consequence is one. A learner who follows the procedure gets a
form that is not on offer and has to guess their way back.

### 2.3 `modals-t20` needs three forms its lesson never mentions — **worth fixing** (D7 / D9)

Same item, options: `["shouldn't", "mustn't have", "don't have to", "needn't"]`.
Only `shouldn't` belongs to the category *Should vs Ought To vs Had Better*.
`don't have to` and `mustn't` belong to lesson 1; `mustn't have` belongs to
lesson 4. The Should/Ought/Had-better lesson mentions none of the three, so the
distractor analysis lives entirely in `optionNotes`.

Consequence for the app, not just the item: a learner who misses t20 is sent
from the results screen to a lesson that does not teach what they got wrong.

### 2.4 Should vs Ought To — the only item testing the distinction works by withholding the rival — **worth fixing** (D3)

The lesson states outright that the two are near-synonyms:

> `contrast` › Ought to: *"Anlamca 'should' ile neredeyse aynı, ama daha resmî
> ve daha çok bir sorumluluk/beklenti tonu taşır."*
> `modals-t19` explanation: *"'Ought to' anlamca 'should' ile neredeyse
> aynıdır…"*

`modals-t19` (*"As the eldest sibling, she ____ set a good example…"*) is keyed
`ought to`, and its options are `["ought to", "had better", "must", "can"]` —
`should` is absent. It is answerable only because the equally correct answer
was left out. `decision` rule 4 (*"Genel bir sorumluluk, ahlaki beklenti ya da
resmî bir ton varsa"* → Ought to) and rule 5 (*"Ortada aciliyet ya da tehdit
yoksa"* → Should) would both fire on t19, in that order.

If a *should*/*ought to* item ever offers both, nothing in the lesson decides
it, because there is nothing to decide.

### 2.5 Should vs Ought To vs Had Better — all three pitfalls are untested — **worth fixing** (L5)

The lesson's three `pitfall` blocks are its strongest content and are, per
`docs/agents/reviewer.md`, the errors Turkish speakers actually make:

- `"You had better **to** see a doctor."` → `"You had better see a doctor."`
- `"You ought apologize to her."` → `"You ought **to** apologize to her."`
- `"You **hadn't better** tell him about it."` → `"You had better **not** tell
  him about it."`

No question in the category offers `had better to`, `ought` bare, or
`hadn't better` as an option. Three pitfalls, zero springs. The form pitfalls
are also the half of this lesson that would survive translation to a real
paper — the *should*/*ought to* semantic half (§2.4) will not.

### 2.6 Can vs Could vs May vs Might — `may` and `might` are never made to compete — **worth fixing**

`modals-t6` is keyed `may`, options `["may", "must", "should", "can"]` — no
`might`. `modals-t7` is keyed `might`, options
`["might", "must", "have to", "can't"]` — no `may`. Each item is answerable
only because its true rival is absent, exactly as in §2.4.

That is unavoidable, because the lesson cannot separate them either: the
`decision` block gives `then: "May / Might"` for the probability branch and
then rule 3, *"Belirsizlik cümlede özellikle vurgulanıyorsa ikisinden zayıf
olanı seç"* → Might. Both t6 (*"if the director doesn't manage to finish"*) and
t7 (*"I'm not sure yet"*) emphasise uncertainty; the rule would pick `might`
for both. The contrast's claim that `may` is *"makul bir ihtimal"* and `might`
*"daha zayıf, daha belirsiz"* is an ordering the lesson states and no item can
test.

### 2.7 Must vs Can't vs Might/Could — decision rule 1 is under-specified against rule 2 — **worth fixing**

```
1  condition: "Cümlede somut bir kanıt var ve tek makul açıklama bu"  → Must
2  condition: "Kanıt tam tersini gösteriyor; durum mantıken imkânsız"  → Can't
```

Rule 1 as written says nothing about which *direction* the evidence points.
`modals-t10` (*"She ____ be at home right now — I just saw her car leaving the
parking lot"*) satisfies rule 1's literal wording — there is concrete evidence
and one plausible reading — and a learner running the list in order can stop
at rule 1 and answer `must`, which is the item's closest distractor. Rule 2 is
the fix, and it is second.

Also in this lesson: `could` appears in the `contrast` label (*"Might /
Could"*) and gets a `forms` row, but no question in the category ever offers
`could` as an inference. Half of the third side is untested (L5, note).

### 2.8 Can vs Could vs Be Able To — the category is decided by two cue words — **worth fixing** (D4, category level)

`modals-t23` turns on `despite`; `modals-t24` turns on `once you finish`. Both
words are `signals` chips in the lesson's `decision` block, rules 1 and 2, and
both chips were taken from the items. `modals-t21` and `t22` are decided by
present-vs-past framing. So the category's four items are: one *despite*, one
*once you finish*, one present, one past — and all four have their key sentence
in the lesson (§0.1). Nothing here requires reading a paragraph.

The one genuinely transferable thing the lesson teaches — *"Bu ayrım sadece
olumlu cümlelerde geçerlidir. Olumsuzda 'couldn't' her iki anlamda da rahatça
kullanılır"* — is untested, because no item is negative (L5).

### 2.9 Notes

- **Modal Perfects** is the strongest decision block in the topic: its five
  rules fire correctly and in order on t13/t14/t15/t16, one rule each, and rule
  5 (*"Şıkta 'mustn't have' varsa ele"*) is genuinely transferable. No
  sufficiency finding.
- **`should have` is defined too narrowly.** The Modal Perfects `contrast`
  says *"**Çıkarım değil** eleştiri"*. `should have` also carries an inferential
  reading (*They should have arrived by now*). Nothing in the corpus tests it,
  so this is a note, not a hole.
- **`modals-t8`'s `Shall` option** is defended in its `optionNote` as
  *"'Shall you' diye bir rica biçimi yoktur"* — correct, and a live distractor
  for a Turkish speaker, not a D2.

---

## 3. `data/passive-voice/passive-voice.json`

Every one of these six lessons reproduces all four of its questions (§0.1).
That is the topic's dominant defect and is not repeated below.

### 3.1 Passive with Modals — the paragraph does no work in any of the four items — **worth fixing** (D2 / D10, category level)

| id | options |
| --- | --- |
| t5 | `should be submitted` · `should submit` · `should be submitting` · `should submitted` |
| t6 | `must be kept` · `must keep` · `must been kept` · `must being kept` |
| t7 | `can be taken` · `can take` · `can be take` · `can taking` |
| t8 | `might be postponed` · `might postpone` · `might been postponed` · `might be postpone` |

In all four the modal is constant across the options, so the sentence's meaning
selects nothing; the only decision is which of four spellings of *modal + be +
V3* is well-formed. Two of the three distractors in each item (`should
submitted`, `must been kept`, `can be take`, `might be postpone`, …) are
ill-formed strings, leaving one live semantic distractor (the active). A learner
who memorises the shape scores 4/4 without reading a word of context.

This also strands half the lesson: `decision` rules 1 and 3 (*"Boşluktan sonra
fiilin nesnesi yoksa"* / *"Özne eylemi yapan kişiyse ve arkasından nesnesi
geliyorsa"*) are about reading the sentence, and no item ever requires them.
The `forms` block's `have to`, `will be`, and `mustn't/shouldn't be` rows are
untested too.

Calling this D2 in the fluent-reader sense would be wrong — `must been kept` is
exactly the error a Turkish speaker makes and the lesson has a pitfall on it.
The finding is not that the distractors are dead; it is that **the paragraph
is**.

### 3.2 By + Agent — three of four items are decided by syntax, not by the judgement the category names — **worth fixing** (D4 / D10, category level)

The category is *Include vs Omit*, and the lesson's length goes to *when* an
agent is worth naming. But `t22`, `t23`, `t24` all have the shape *"… ____
[noun phrase naming the agent or instrument]"*, and the explanations say so
themselves:

> t24: *"'by' düşünce arkadaki isim öbeği cümleye bağlanamaz — 'the vaccine was
> developed a team of researchers' bozuk bir cümledir."*
> t22: *"'by' düşünce 'a fifteen-year-old student' isim öbeği cümleye
> bağlanamaz ve yapı bozulur."*

That is not an include/omit judgement, it is *a stranded NP needs a
preposition*. The `decision` block's rule 4 says exactly that
(*"Boşluktan hemen sonra faili söyleyen bir isim öbeği geliyorsa"* → by), and
it makes rule 3 (*"Fail cümlenin en şaşırtıcı ya da en bilgilendirici
parçasıysa"*) inert on every item it applies to.

Only `t21` tests the omit half, and it is the item whose key/distractor pair
appears verbatim in the lesson's `pitfall` (§0.1). Rule 2 —
*"Fail bağlamdan zaten belliyse (doktorlar, polis, garsonlar)"* — is never
tested (L5).

### 3.3 Causative — the decision block never reaches `passive-voice-t16` — **worth fixing** (L1)

`passive-voice-t16`: *"By the time we moved in, the previous owners ____ the
entire kitchen renovated…"* → key `had had`, options
`["had had", "had", "have had", "did have"]`. The item is purely about tense.

The `decision` block, *"Boşluktan sonrasına bak"*, has four rules and none of
them is about tense. Rule 1 fires (*"Boşluktan sonra \"nesne + V3\" sırası
varsa"*) and returns `"have / get + object + V3"` — the pattern, not the
answer. The learner is told they need a causative and left to pick among four
causatives.

The tense *is* taught, in the `forms` block — including the row whose example
is t16 verbatim, cue and all:

> `{ form: "Past Perfect", pattern: "S + had had + nesne + V3", example: "The owners had had the kitchen renovated before we moved in." }`

So a learner reaches the key from the `forms` block, and reaches it by
recognising the sentence rather than by running the procedure.

Also here: `make` is the distractor in t13, t14 *and* t15, with the same
reasoning in each `optionNote` (*"make bir kişiyi zorlar ve yalın fiil alır"*).
Three of four items in the category test the same discrimination (D11-adjacent;
note).

### 3.4 Passive Reporting — decision rule 3 fires before rule 4 and returns the active — **worth fixing**

```
3  condition: "Aktarılan olay aktarımdan daha önce olmuşsa"                    → to have + V3
4  condition: "Olay hem geçmişteyse hem de özne eylemi yapmıyorsa
   (görülmüş, bulunmuş, kurtarılmış)"                                          → to have been + V3
```

`passive-voice-t19`: *"The missing hikers ____ seen near the northern trail
**late last night**…"* → key `are reported to have been`. Rule 3's condition is
fully satisfied by *late last night*; first match wins and hands the learner
`to have + V3`, i.e. *are reported to have seen* — the active, which reverses
who saw whom. Rule 4 carries the passive half and is one step too late.

The form is not among t19's options so the item survives, but the procedure is
wrong as written and would fail on a paper. Rule 3 needs the voice test folded
into it, or rules 3 and 4 need swapping.

### 3.5 Tense Forms in Passive — one `decision` rule names two answers and delivers one — **worth fixing**

Final rule of *"Hangi zamanın edilgeni?"*:

```json
{ "condition": "Bir zaman ifadesi iki tarafa da uyuyorsa (this week, this year),
  belirleyici olan kelime değil eylemin şu anda sürüp sürmediğidir:
  sürüyorsa Continuous, sonucu sayılıyorsa Perfect",
  "then": "Present Continuous Passive" }
```

The condition explicitly branches two ways; `then` returns only one of them. A
learner scanning the `then` column — which is how these are read, and what
`CONTENT_GUIDE.md` says `then` is for (*"the thing the learner writes down"*) —
takes away *this week → Present Continuous Passive*, unconditionally. Where a
rule genuinely admits two answers the guide's remedy is a slash form
(`"Present Continuous / Present Perfect Passive"`); this rule instead hides one
answer in Turkish prose.

`passive-voice-t4` (*"the main lobby ____ renovated **this week**"*) is the
only item this rule serves, and it is the Continuous branch — so the Perfect
branch is asserted, never delivered, never tested.

### 3.6 Tense Forms in Passive — a `since` caveat that lives in a question's `tip` and not in the lesson — **note** (L2)

`passive-voice-t3`'s tip carries a real warning:

> *"…'çünkü' anlamındaki since böyle bir sinyal vermez."*

The lesson's `decision` rule 4 lists `since` as a Present Perfect Passive
signal with no such qualification. The lesson is the durable artefact and the
tip is attached to one item; the caveat is in the wrong place.

### 3.7 Notes

- **Garbled Turkish**, Tense Forms `pitfall` 3: *"Nesne almayan fiillerin
  (happen, occur, arrive, rise, die) edilgeni olmaz: **özne yapılacak bir nesne
  yoktur**."* The clause has lost a word (presumably *"özne yapılacak bir nesne
  yoktur"* → *"özne **yapılacak** bir nesne yoktur"*, i.e. *there is no object
  to promote to subject*). As it stands it does not parse.
- **Untested pitfalls in Tense Forms** (L5): the intransitive-passive pitfall
  above, and `"The report was wrote last week."` → `"…was written…"`. Neither
  `was happened` nor a V2-for-V3 form is ever an option in t1–t4.
- **A register claim the app cannot support**, Passive Reporting `contrast`:
  *"Daha kısadır ve **akademik metinlerde daha sık görülür**."* Same class of
  claim `CONTENT_GUIDE.md` bans from `intro` (*"A claim the app cannot support —
  how common a form is"*); the rule is written for intros but the reason for it
  applies here too. Compare `modals-t2`'s *"sınavlarda tercih edilir"* (§2.1).
- **Lesson 2 and lesson 3 disagree about `modal + be + V3`.** Modal Perfects'
  `contrast` glosses it as *"Eylem henüz yapılmamıştır ve hâlâ yapılabilir"*,
  but lesson 2 teaches it as general possibility (`"The results can be checked
  online."`), which is neither unperformed nor pending. Minor, and no item
  turns on it.

---

## 4. What passed

Recorded so a thorough pass can be told from a shallow one. These are the
decision blocks I ran against their four items and could not break, and the
lesson-level checks that came back clean.

**Decision blocks that reach the key on every item of their category, by the
step the block itself provides:**

- `modals` › **Modal Perfects: Must / Can't / Should / Needn't Have** — five
  rules, four items, one rule each, in order. The best block in the corpus.
- `modals` › **Must vs Have to vs Mustn't vs Don't Have to** — reaches all four
  (though rules 2 and 3 fire on chips lifted from the items; §0.2).
- `passive-voice` › **Modal Perfects in Passive** — rules 2, 5, 4, 3 fire on
  t9, t10, t11, t12 respectively, cleanly.
- `passive-voice` › **Passive with Modals** — reaches all four via rule 2,
  which is the finding in §3.1, not a credit.
- `tenses` › **Present Perfect vs Past Simple** — all four, and it is the only
  lesson in the corpus that also passes the leak check.
- `tenses` › **Past Simple vs Past Continuous vs Past Perfect** — reaches
  t9/t10/t11/t19 by rules 3, 1, 4, 1; t12 only via the general precedence
  condition (rule 2), with no `since` signal, which is defensible given the
  lesson's `text` warning but is the weakest link in the block.

**Lessons whose `contrast` and `forms` agree with each other and with their
items:** every lesson in `tenses` and `passive-voice`. The one disagreement
found is `modals` › Must vs Have to (§2.1).

**Lessons with no `check`-preview leak:** `tenses` › Present Perfect vs Past
Simple (the only one), and `tenses` › Present Simple vs Present Continuous
(borderline — the contrast example `"She goes to the gym every morning."`
shares *every morning* + *goes to the* with `tenses-t1` but is a different
scenario).

**Turkish prose:** apart from the two items in §3.7 and §2.1, I found no
Turkish explanation that is factually wrong about English or that contradicts
its own example. The Turkish is accurate, and in the `optionNotes` it is
consistently better than the `explanation` fields it sits under.
