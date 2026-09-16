# Content review, round 1

Run 2026-09-03 against the 72 questions and 18 lessons that existed at
`v0.14`. This is stage 1 of `docs/v1-plan.md`: *the pipeline should be
proven on 72 questions before it is aimed at 900.*

Six reviewers ran independently and none of them saw another's output.

| Pass | What it had | What it did |
| --- | --- | --- |
| Calibration | 13 items with keys and explanations, one lesson | Pass C over `docs/agents/calibration.md`'s set, graded against a key it never saw |
| Blind A | 72 items, options shuffled, **no key** | answered every item cold, flagged second workable answers |
| Blind B | 72 items, a *different* shuffle, **no key** | the same, plus the deciding span of each paragraph |
| Lessons × 3 | one topic's lessons + its questions with the key removed | answered each question from its lesson alone, then swept every caveat against its own four questions |

---

## The result that reframes everything else

**Nothing is miskeyed.** Two independent blind passes, different option
orders, no answer key, 72 items each: **144 of 144 answers matched the
key.** Zero D6.

That is the floor, and it holds. Every defect below is about what an item
*measures*, not about whether it is right. It also means the corpus is
worth repairing rather than replacing — which was not obvious before the
pass, and is the single most useful thing the round established.

The second-order result is less comfortable:

> **16 of 72 items have a second defensible answer. Ten of those were
> named by both blind passes independently, and one — `modals-t17` — was
> a coin-flip for both.**

And the third is the one nobody predicted:

> **Not one of the 18 lessons is insufficient for its own questions.**
> All three lesson passes reported zero L1. Every question is answerable
> from its lesson — usually because the lesson contains the answer
> sentence. The failure runs the other way: **the lessons teach roughly
> twenty things the questions never ask.**

---

## Calibration

The reviewer was run against the ten-item set before anything else was
believed. Scored per `docs/agents/calibration.md`:

| | |
| --- | --- |
| Recall | **5 / 5** — every planted defect found, with the right defect class |
| Precision | **5 / 5** — no sound item was claimed broken on its key |
| Discrimination | 4 / 5 — the *Present Perfect vs Past Simple* set was called `worth fixing` where the key says `blocking`; it was correctly reported once at category level rather than four times |

It also caught `tenses-t20`'s second defect (D4, cue-only) which the key
records but does not require, and reported the *Present Perfect vs Past
Simple* failure as a lesson-side L5 rather than a question-side one,
which is the better reading.

**And it found a hole in my own key.** Four of the five items I certified
sound carry a real **D5** — their explanations argue only for the key and
never name a wrong option. That is true of `tenses-t17`, `modals-t10`,
`modals-t14` and `passive-voice-t4`, and I had not applied D5 when
building the set. The reviewer was right and the key was incomplete; the
calibration file now says so. `modals-t23` passed completely clean, from
every pass, and remains the best item in the corpus.

Verdict: **worth believing on unseen content.**

---

## The findings that matter

### 1 · Sixteen items ask the learner to rank two acceptable answers

Confirmed by both blind passes:

| id | key | also works |
| --- | --- | --- |
| `tenses-t7` | has broken | broke |
| `tenses-t9` | was waiting | waited |
| `tenses-t12` | had rebuilt | have rebuilt |
| `tenses-t14` | will take | am taking |
| `tenses-t15` | leaves | is leaving |
| `modals-t2` | has to | must |
| `modals-t17` | should | ought to, must |
| `modals-t18` | had better | should, ought to |
| `modals-t19` | ought to | must |
| `passive-voice-t23` | was taken | was taken by paramedics |

Named by one pass only: `tenses-t13` (will rain), `modals-t1` (have to),
`modals-t6` (can), `modals-t16` (shouldn't have), `passive-voice-t16`
(had), `passive-voice-t21` (was stolen by someone — style only).

They cluster into four shapes, and the shape is the finding:

- **Near-synonym modals.** `should` / `ought to` / `had better` / `must`
  in one option set, with nothing in the paragraph separating them.
  `modals-t17` is the blocking case: the lesson itself says `ought to`
  means *"neredeyse aynı"*, so the item is decided by a trigger phrase
  the lesson never claims is decisive.
- **Internal versus external obligation.** `modals-t2` keys `has to` on
  *"According to the university's regulations"* — but the same lesson's
  own `forms` and `examples` use `must` for external rules (*"You must
  wear a helmet"*). The distinction is one textbook's, not English's.
- **Future-form preference.** `leaves` versus `is leaving` for a
  timetable, `will` versus `going to` for a prediction: English tolerates
  both and the item picks one.
- **Style dressed as grammar.** `passive-voice-t21` and `-t23`: every
  option is grammatical and true, so the item rewards guessing which
  phrasing the author preferred.

### 2 · The lessons teach about twenty things the questions never test

Zero L1 across all 18 lessons; roughly twenty L5. A sample:

| lesson | warns about | never sprung because |
| --- | --- | --- |
| Present Perfect vs Past Simple | `for` appears on both sides — the flagship caveat, a whole `text` block and an `examples` item | the word `for` as a duration occurs in none of `t5`–`t8` |
| Should vs Ought To vs Had Better | *"ikisinin ardından 'to' gelip gelmemesi sınavların en sevdiği ayrıntıdır"*, and all three pitfalls are form traps | every option across `t17`–`t20` is a correctly formed modal |
| Modal Perfects | `mustn't have` is not a structure — flagged twice, once in the `decision` block | `mustn't have` is in no option set in `t13`–`t16` |
| Modal Perfects | *"should have **went**"* → *"gone"* | every stem hands the learner the participle (`____ forgotten`, `____ studied`) |
| Must vs Can't vs Might/Could | *"Ortada yasak yoksa 'mustn't' şıkkını ele"* | `mustn't` appears in no option set |
| Can vs Could vs Be Able To | *"Bu ayrım sadece **olumlu** cümlelerde geçerlidir"* | all four items are affirmative |
| Present Simple vs Present Continuous | the dropped third-person `-s`, called the detail Turkish speakers most often miss | no option anywhere is a bare stem |
| Causative | the do-it-yourself reading, and the word-order trap | every item already supplies `object + V3` after the blank |
| Modal Perfects in Passive | the dropped `been` (*"must have broken"*) | no option ever omits it |
| By + Agent | `by` versus `with` for an instrument — a `forms` row, an example, a pitfall and a `decision` rule | the string `with` is in none of the 16 options |

Every one of these is a lesson that does its job and a question set that
never collects on it. The learner scores 4/4 and keeps the belief.

### 3 · Questions reuse their own lesson's example sentences

The passive pass counted it: **20 of 24 keys reuse a lesson sentence's
subject and verb, most of them verbatim.** The calibration pass found the
same in 7 of its 13. `tenses-t15` was *"My flight leaves at 7:45
tomorrow"*, which is the Future Forms lesson's own `contrast` example.

This is not a style complaint. `check` blocks are filled from the
questions sharing the lesson's category, so **the learner meets the
answer sentence a few blocks above the question that asks it.** The check
block's whole purpose — retrieval, not recognition — is defeated by
construction. Nobody costed this when `check` was designed, and it does
not show up in any schema rule.

### 4 · Three categories can be passed without reading the paragraph

Blind B classified every item by its deciding span:

| category | verdict |
| --- | --- |
| Time Expressions & Signal Words (`t21`–`t24`) | **all four cue-only** — one trigger beside the blank, the paragraph decorative |
| Causative (`p13`–`p16`) | **all four cue-only** — the `object + V3` frame gives it away |
| Passive with Modals (`p5`–`p8`) | **worse** — three of four options in each are ungrammatical strings (`must being kept`, `can be take`), so it is a spelling check that scores 4/4 without the paragraph |
| Tense Forms in Passive (`p1`–`p4`) | one signal chip each, matching the lesson's `decision` block one-for-one |

Against that, four groups do real work and are the strongest content
here: present deduction (`m9`–`m12`), modal perfects (`m13`–`m16`),
modal perfects in passive (`p9`–`p12`), and `modals-t23`. Each forces the
learner to read a second clause and reason from evidence. Whatever the
next authoring round writes, it should be shaped like those.

### 5 · Two lessons contradict each other, and one question sits on the fault line

Found independently by the tenses pass and the calibration pass:

> `this week` is a **Present Continuous Passive** signal chip in *Tense
> Forms in Passive*, and part of the **Present Perfect** open-period
> condition in *Present Perfect vs Past Simple*. `passive-voice-t4`
> (*"the main lobby ____ renovated this week"*) keys `is being`, with
> `has been` as the near-miss distractor.

A learner who studied the tenses lesson and applies its rule literally is
marked wrong. `CONTENT_GUIDE.md` already names this failure — *"A signal
that appears in both branches is worse than no signal"* — and it has now
happened across two lessons, which is the case the rule did not
anticipate.

Same shape, within the tenses topic: *Time Expressions & Signal Words*
lists `since` and `for` as unconditional Present Perfect chips, and both
of the other two tense lessons exist partly to disown them. `tenses-t12`
is keyed against the `since` chip.

### 6 · Coverage holes nobody had counted

The passive pass listed every form its lessons teach against every form
its questions test. **Fifteen taught forms never appear on an option list
at all**, and five more appear only as distractors. Future Passive
(`will be + V3`) is taught in two separate lessons with the same example
sentence and is tested nowhere. `could` — half of *Must vs Can't vs
Might/Could*'s own name — is in none of its four option sets.

---

## What I changed, and what happened when it was reviewed

Only defects in content **as shipped** — an item that is wrong now, not
an item that is missing something. Everything else is a writing round,
and a writing round belongs to stage 3 with a category spec in front of
it.

Every rewrite then went back through a blind pass, on the principle the
brief states: an author does not certify their own work. **Three of the
first six rewrites were rejected**, and one of them because I had traded
a defect for a worse one. That is the pipeline working on its operator,
and it is the most useful thing in this section.

| id | the defect | what shipped |
| --- | --- | --- |
| `tenses-t15` | `leaved` is not a word, and the stem was the lesson's own contrast example verbatim | new stem, four live options — **passed** |
| `tenses-t8` | D12: the paragraph carried `have become`, handing over the tense | result clause rewritten — **passed** |
| `modals-t10` | the explanation ruled out `mustn't`, which was not among the options | `should` → `mustn't`, which also sprang a caveat no question had tested and cleared the duplicate option set it shared with `modals-t9` — **passed, called the best-written of its round** |
| `modals-t17` | D1 blocking: `ought to` is also correct | **rejected twice.** The first rewrite offered `might`, which is idiomatic advice — a new D1. The second offered `had better`, which reads as enthusiasm when nothing is at stake. The third denies the consequence in the paragraph itself, and **passed** |
| `passive-voice-t23` | D3: every option grammatical, so the item rewarded guessing the author's taste | rebuilt as the `with`-instrument item the lesson teaches in four blocks and no question tested — **passed** |
| `tenses-t20` | D2: `go` and `went` are dead after `Have you` | the rewrite introduced a defensible `had been`. **Reverted to the original** and registered |
| `passive-voice-t15` | D2: `am` produces *I always am it painted* | `am` → `let`, prose tightened. **Rejected three times** — see below |

### `passive-voice-t15`, and why it stopped where it did

Three reviewers rejected three versions, and the third gave the reason:
**the causative structure is handed to the learner in the stem.** With
`the whole house painted` already written out, every option is the same
verb in a different slot, so nothing about causative formation is
assessed. A tense-axis version (`have` / `am having` / `have had` /
`had`) failed too, because `have had` is defensible for a lifelong
pattern.

The fix is a redesign rather than an option swap: the blank has to
swallow the structure, so that `have painted the whole house` and `have
the whole house paint` become choosable. That is a new item and it
belongs to the authoring round, with the category spec in front of it.
What shipped is strictly better than what was there — `let` is at least a
real causative neighbour where `am` was absurd — and the item is on the
register.

Three attempts was the rule set before this started, and it was kept. A
fourth guess is precisely the failure the brief exists to prevent.

### A limitation of the method, found the hard way

A reviewer rejected `had better to` and `ought try` as options *"no B2
learner deliberating meaning will weigh"*. But `had better to` is the
error Turkish speakers make, the lesson for that category is built on it,
and all three of its pitfalls use it.

**A fluent reviewer's "no learner would consider this" is a judgement
about the reviewer.** `docs/agents/reviewer.md` now says so under D2, and
a later run, told to apply the learner's standard explicitly, reversed
the call and explained why: Turkish maps both *should* and *had better*
onto *-meli/-malı*, and *-yor* covers habitual aspect, so
continuous-for-habitual is a live distractor where a native speaker sees
a dead one. The other eleven defect classes are unaffected — a second
defensible answer reads the same from either side of the fluency line.

Recorded and not acted on: everything in §2, §4 and §6, which is missing
content rather than broken content.

---

## The owner's call, not mine

Each of these is a taxonomy change — it renames a lesson id, so it resets
every learner's progress for that lesson, and it has to move questions,
manifest and lesson together.

1. **`Modal Perfects: Must Have vs Can't Have vs Should Have`** does not
   name `needn't have`, which is `modals-t16`'s key, or `shouldn't have`,
   which is the lesson's whole second contrast.
2. **`Must vs Have to vs Don't Have to`** does not name `mustn't`, which
   is `modals-t3`'s key — and the label already spells out the *other*
   negative, so "must covers mustn't" is not the convention in use here.
3. **`Perfect Aspects`** carries three unrelated contrasts under one
   lesson id, so a learner who fails only `tenses-t20` (been/gone) is
   sent to a lesson two-thirds of which is about something else.
4. **`tenses-t19`** tests Past Perfect for the earlier of two past events,
   which is what *Past Simple vs Past Continuous vs Past Perfect* is for.
   (Carried over from `education-notes.md`; the review agreed.)

---

## Round 2: the explanation repair (2026-09-03)

The largest finding of round 1 was that two thirds of the explanations
argued only for the key. Forty-six were rewritten by three agents, one
per topic, each given the questions **and the lesson for their category**
so the wording would match what the learner had been taught.

Then the rewrites were fact-checked by a reader who had not written them.

| | |
| --- | --- |
| Clean | **34 of 46** |
| Explanations naming an option not on their own list (the pre-existing defect) | **0** |
| Explanations whose reasoning led away from the key | **0** |
| **False statements about English** | **12** |

The two that mattered:

- A tip said `should have` *"çıkarım bildirmez"* — does not express
  inference. But *the parcel should have arrived by now* is ordinary
  English, and a learner who carried that rule away would misread it.
- `passive-voice-t13` asserted that *"İngilizcede yaptırma anlamını
  yalnızca have ve get taşır"*. False — `make` and `let` are causatives
  too — and it contradicted the same explanation's own sentence about
  `make` two clauses earlier. What is true is narrower: only `have` and
  `get` take the *object + past participle* pattern.

The other ten were the same failure at lower stakes: *yet* said to occur
"only" in questions and negatives; `for` described as marking a period
still open, when it marks duration and *he lived there for five years* is
finished — which is precisely the point the *Present Perfect vs Past
Simple* lesson makes, so the explanation contradicted a shipped lesson;
Past Perfect said to require a second past event after it.

**The shape is worth naming, because it will recur.** None of the twelve
was a wrong answer or a bad argument. Each was a correct local
explanation finished off with a generalisation wider than the evidence
for it — the sentence an author writes to sound authoritative once the
real work is done. It is invisible to the person writing it and obvious
to anybody reading it cold, which is the entire case for the review step.

All twelve corrected. `npm run validate` now reports zero warnings.

---

## What this changes in the plan

`docs/v1-plan.md` stage 3 said *"one item in four should be decided by
something other than the surface cue."* The round says three things it
did not:

1. **The reviewer works.** 5/5 recall, 5/5 precision, and it found a
   defect class my own calibration key had missed. The pipeline can be
   pointed at new content.
2. **`check` blocks and question authoring are coupled, and the coupling
   was never written down.** A question that reuses its lesson's example
   sentence is a check the learner has already been shown the answer to.
   This belongs in `docs/agents/question-author.md` as a rule, and it is
   the one finding here that is about the app's design rather than its
   content.
3. **A category is the unit of review, not an item.** Every finding worth
   acting on in this round — the untested caveats, the cue-only
   categories, the coverage holes, the near-synonym clusters — is
   invisible while reading a single item and obvious across four. The
   category spec in stage 1 item 5 is therefore not documentation; it is
   the thing that makes the next round's review possible at all.
