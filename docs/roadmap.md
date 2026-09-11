# Roadmap

> **App 1's planning closed on 2026-09-06.** What remains to be built is
> in **`docs/app1-final.md`** — the complete task list, costed and
> ordered, with the bar every item must clear and the list of things
> already decided against. This file stays as the historical record of
> how the plan got there, and where the two disagree, `app1-final.md` is
> the plan. App 2 is researched separately in `docs/app2/`.

What ships next, in what order, and the point at which this stops being
`0.x`. Written 2026-09-04.

`docs/v1-plan.md` holds the evidence behind the staging decisions and the
research arms they came from; this is the shorter document, and where the
two disagree this one is newer. The version rule does not change: **`x`
stays `0` until the owner says otherwise**, and nothing in here makes
that call.

---

## Where we are

| | Shipped | Drafted, not shipped |
| --- | --- | --- |
| Topics | **10** | 0 |
| Questions | **241** | 0 |
| Lessons | **60** | 0 |
| Questions per category | 4.0 | — |
| Option notes | **723 — one for every wrong option in the app** | — |

Updated 2026-09-05. **The draft queue is empty**: everything written has
shipped, and every shipped item has been through the pipeline as it
stands today rather than as it stood when the item was written.

**Grammar is finished** (2026-09-04). The five drafted grammar topics
cleared their review debt and shipped together, as the owner asked and
for the reason the queue existed: they were commissioned to close one
gap, and shipping them one at a time would have meant five partial
answers to the cloze section instead of one whole one.

**Vocabulary is finished too** (2026-09-05). The two vocabulary topics
cleared the four categories their first re-audit had blocked — a
`decision` rule that certified a distractor, two second-defensible
answers, an item that was its own lesson's `pitfall` block, and a
`pitfall` marking as wrong a use the rest of its lesson licensed — went
through a second repair and a second independent re-audit, and shipped.
The copies left in `docs/agents/drafts/` are history, not a queue.

## What the paper actually pays for

Session I is **60 points across 40 questions**, all four-option multiple
choice (`docs/exam-spec.md`, from the two sample papers).

| Section | Items | Points | Where the app stands |
| --- | --- | --- | --- |
| Cloze test | 10 | 15 | **9 of the 10 blanks, which is 7 of the 8 distinct types.** Ten blanks test eight types — blanks 2 and 4 are both modals, 5 and 10 both vocabulary. One type is uncovered: `so / such`. **The app still says seven — see the defect below** |
| Closest meaning | 10 | 15 | **shipped** |
| Reading — 2 texts | 14 | 21 | **not covered, and out of v1** — see below |
| Paragraph completion | 6 | 9 | **not covered, no schema, not started** |

The single most useful thing in the exam spec is the blank-by-blank
breakdown of the sample cloze, because it says which grammar the paper
rewards rather than which grammar a textbook orders. Mapped against what
now exists:

| Blank | Tests | Covered by |
| --- | --- | --- |
| 1 | discourse markers | `connectors` ✓ |
| 2, 4 | modals | `modals` ✓ |
| 3 | causative `make + object + bare` | `gerunds-infinitives` ✓ |
| 5, 10 | vocabulary | `academic-verbs`, `academic-nouns-adjectives` ✓ |
| 6 | comparatives | `closest-meaning` ✓ (partly) |
| 7 | `so` / `such` | **nothing** |
| 8 | relative pronouns | `relative-clauses` ✓ |
| 9 | quantifiers | `quantifiers` ✓ |

Two of ten blanks are modals and **not one tests a tense or the passive**
— which is what the app shipped first. The seven drafts were commissioned
to close exactly that gap. Five of them are now served; the two
vocabulary topics close blanks 5 and 10, and one hole is left over:
`so / such`.

---

## The order, and why

Three things decide it, in this priority:

1. **Review debt before new content.** There are 168 drafted questions and
   42 drafted lessons that no learner can reach. Writing a ninth topic
   before clearing that is decorating a queue.
2. **A scored section beats a better version of a covered one.**
3. **Nothing ships that the pipeline has not passed.** Across five topics
   the two review passes have found roughly one item with two defensible
   answers per twelve written, and roughly one untrue claim about English
   per lesson. Neither is visible to `npm run check`.

### Done — the grammar queue

**The five grammar topics shipped together, 2026-09-04**, in the one
sitting the owner asked for.

| # | Work | Outcome |
| --- | --- | --- |
| 1 | `closest-meaning`: independent re-verification of the reporting block | shipped |
| 2 | `connectors`: sufficiency re-run on the repaired lessons | shipped |
| 3 | `relative-clauses`: lesson examples that hand over their own questions, then re-audit | shipped |
| 4 | `quantifiers`: both passes, never run | shipped |
| 5 | `gerunds-infinitives`: blocking item fixed, lessons audited, re-verified twice | shipped |

That was **+120 questions and +30 lessons**, taking the app to 193
questions across 8 topics and closing 7 of the 10 cloze blanks — 6 of the
8 distinct types the sample tests.

The cost is worth recording, because it is the argument for the pipeline:
across the five, the passes found roughly one item with two defensible
answers per twelve written and roughly one untrue claim about English per
lesson — and **five of the repairs introduced a new defect**, each caught
only by an independent re-audit and none of them visible to
`npm run check`. A repair is not a fix until someone who did not write it
has re-read it.

### Done — the three oldest topics, reviewed at last (2026-09-04)

`tenses`, `modals` and `passive-voice` predate the pipeline and had never
had a blind pass; `data/roadmap.json` had at one point implied otherwise,
and that claim was corrected before this one was made. All three have now
been through it, and the results are worth separating:

- **73 of 73 agreement with the key.** No item in the three is
  mis-keyed. That was the open question and it is closed.
- **What the passes did find is discrimination.** Two items cannot
  discriminate at all (`modals-t2`, `modals-t18`); eight more carry a
  second answer that survives the paragraph; nine are answerable with the
  paragraph deleted, and across the twelve passive-structure items nine
  keys are the only well-formed option — a student who reads nothing
  scores 9/12.
- **49 of 72 questions have their keyed sentence inside their own
  lesson.** A `check` block draws from the same category, so the learner
  meets the answer two blocks above the question. This one is now a
  validator warning (`checkLessonGiveaway`) with a ratchet, so it can
  only shrink.
- **Five `decision` blocks hand a learner following them a distractor.**
  The worst class of defect in the corpus: the lesson's own checklist,
  run literally, returns a wrong option.

A repair round is under way on all three, and will be re-audited
independently before it is called done.

### Done — the two vocabulary topics (2026-09-05)

`academic-verbs` and `academic-nouns-adjectives` shipped: 48 questions
and 12 lessons, through both review passes, two repair rounds and two
independent re-audits. They close cloze blanks 5 and 10 and take the app
to 241 questions across 10 topics.

### Done — the defect this table found (2026-09-06)

**The app understates its own cloze coverage.** `CLOZE_BLANKS` in
`js/topics.js:296` maps each of the sample paper's ten blanks to the
topic that covers it, and `clozeCoverage` derives the on-screen number
from what is live — which is why Profil could be trusted to move on its
own as topics shipped. Blanks 5 and 10 were written as
`{ topicId: null, label: "kelime bilgisi" }` because no vocabulary topic
existed yet. They were never repointed when the two shipped, so a `null`
counts as missing for ever and the screen still says seven of ten when
it is nine of ten.

Fixed. Blank 5's four options are all nouns and blank 10's are all
verbs, so they point at `academic-nouns-adjectives` and `academic-verbs`
respectively, and Profil now says nine of ten.

The part worth keeping is what the tests were doing. `coverage.test.js`
asserted *"two blanks are vocabulary, which no grammar topic can
cover"* and *"seven of ten"* — so the suite did not miss the defect, it
**locked it in**, because both tests were written as a description of
the code rather than of the paper. They now assert the paper: no blank
may be nameless, and the two vocabulary blanks resolve to two different
topics. Naming a topic that does not exist yet is the correct form and
`so-such` had always done it.

### Next — the two real holes

| # | Work | Cost |
| --- | --- | --- |
| 6 | `so / such` — the one cloze blank type nothing covers. One category, four items, folded into an existing topic rather than made a topic of its own | half a day |
| 7 | **Paragraph completion** — 9 points, a whole section, no coverage. A ~120-word paragraph with one sentence removed and four candidates. Needs a schema decision (it is neither a cloze nor a restatement) and a category spec; distractors are on-topic and grammatical and fail on *coherence*, which is a different authoring skill | schema ~1 day, then ~2 hours per item |
| 8 | Items per category from 4 to 6 where a category is weak-flagged most often | ongoing |

### After that — the error-tracking screen

A place to examine past mistakes rather than the immediate feedback that
already exists. Research arm running; it will say where it lives and what
it can honestly show at this sample size. The mistake book (`Yanlış
defteri`) already covers the *practise* half; this is the *understand*
half.

---

## Where v1 is

**Accepted by the owner, 2026-09-04:**

> The app is 1.0 when every part of the exam it can honestly practise is
> practisable with reviewed content, and the app never tells a learner
> something it cannot support.

Four criteria, each measurable:

1. **Coverage.** ~~Cloze (all ten blank types), closest meaning and
   paragraph completion are all practisable. That is **39 of Session I's
   60 points**.~~ **Revised 2026-09-06: all four sections of Session I —
   cloze, closest meaning, reading and paragraph completion — are
   practisable. That is 60 of 60.** Listening (Session II, 20 points) is
   the one thing named as elsewhere.
2. **Quality.** Every shipped item has passed a blind pass and every
   shipped lesson a sufficiency pass, with zero known blocking defects.

   **This sentence means two different things and the difference is
   about twenty hours of work.** Read as *passed the pipeline as it
   stood when it shipped*, the 193 live questions already satisfy it.
   Read as *passed the pipeline as it stands today*, they do not: the
   pipeline has tightened four times since `tenses`, `modals` and
   `passive-voice` went out — the blind-corpus tool, the calibration
   file, the category spec, and the independent re-audit that has since
   caught a defect in five of six repairs. Those three topics have never
   met the current bar.

   Recorded as open rather than decided, because it is the owner's call
   and it is the difference between v1 being close and v1 being a week
   away.
3. **Honesty.** Nothing on screen claims more than the data supports.
   This is already true and has to stay true: the weak-category claim is
   hedged, the topic score is a percentage over everything answered, the
   mistake book does not promise a graduation the calendar can prevent.
4. **It says what it does not do.** A learner can see, in the app, that
   reading and listening are not covered. An app that silently omits 21
   of 60 points is worse than one that says so.

> **Superseded 2026-09-06.** The owner's decision: *"App 1 bu projenin
> bitmiş hâli… listening hariç tüm özellikler tamamlanır."* Reading is
> **in**, which changes criterion 1 from *39 of Session I's 60 points*
> to **all 60** — every section of the paper except the one that is a
> separate sitting. Criteria 2–4 are unchanged, and the open question
> inside criterion 2 is still open. The paragraph below records why
> reading had been excluded; the reasoning was sound and the decision
> overrides it. `docs/business/vision.md` §2 has the arithmetic and the
> cost.

**Reading was deliberately outside v1.** The arm re-derived the cost at
**2.5–3.5 hours of review per passage**, and a passage is single-use —
once read, all seven of its items are spent — so ten passages is five
sittings and 25–35 hours. It is a supply to be replenished, not a project
to be finished, and putting it inside v1 makes v1 unreachable. It is the
first thing after.

### What v1 explicitly does not include

Carried forward from `docs/v1-plan.md`'s refusals and not reopened here:
no streaks, no timers, no score other than correct/total, no number that
goes up, no leaderboard, no account, no backend, no item-level spaced
repetition, no adaptive difficulty, no flashcards.

Two of those have a threshold rather than a principle behind them and
will be worth revisiting after v1: adaptive difficulty and scheduling
both need roughly 15–20 items per category, against 4 today.

---

## After v1

| | Unblocked when |
| --- | --- |
| ~~Reading section~~ | **Moved into v1, 2026-09-06.** Still one passage at a time, as supply — but now before v1.0 rather than after it |
| Listening (Session II, 20 points) | needs audio, which is a different project and a hosting decision |
| Mastery levels | ~8–10 items per category |
| Adaptive difficulty, item scheduling | ~15–20 items per category |
| Mock exam under time | cloze *and* restatement at exam scale, plus a passage schema |

---

## Decisions the owner has made

**The v1 definition above is accepted** (2026-09-04), and with it that
reading is named as out of scope rather than silently missing.

**Grammar finishes first, and in one or two sittings.** That reorders the
list above: the five grammar drafts clear their review debt and ship
before anything else starts, and the two vocabulary topics queue behind
them rather than beside them. `so / such` and paragraph completion follow
the grammar ship, not the vocabulary one.

**~~`optionNotes` is not a budget item now.~~ Reversed, and done
(2026-09-05).** The decision was that writing ~291 notes against the
existing grammar corpus was not worth it against shipping features. It
was reversed and the work was done: **723 notes, one for every wrong
option in the app**, all ten topics. What changed the answer was the
audience statement — a learner whose ear is good and whose instinct is
often right does not need to be told they were wrong, they need to be
told *what the thing they chose would have meant*, because that is the
boundary their ear is missing. The note is that sentence.

**A content roadmap became a feature, in small.** Shipped 2026-09-04 as a
section in Profil: what exists, counted from the manifest so it cannot go
stale, over a short editorial list in `data/roadmap.json` of what is done,
next and planned. It replaced the "Geliştirme aşamasındayız" banner
rather than joining it. The larger version the owner described — down to
which questions and which `optionNotes` exist — is still later; this is
the version that fits on a phone and tells the truth today.

## Where the money and the platform questions went

They are not in this file. `docs/business/` is six documents written
2026-09-05 against the owner's own brief — the two-app split, the price,
the store routes, what "a bit online" would cost this codebase, and who
owns the corpus. `docs/business/README.md` is the index, and the only
item there with a near deadline is a contributor note, before a second
author writes anything into `data/`.

---

## Still open

1. **The exam date.** It changes the order of everything below the first
   stretch, and `docs/research/the-last-week.md` is written and cannot be
   acted on without it.
2. ~~**The dev-note banner.**~~ **Decided 2026-09-04: retired.** It sat
   above every screen, was the first thing a stranger read, cost 48px of
   the 320px fold on every arrival, and said something no learner could
   act on. Its one useful sentence is now on the first-run card, and what
   it was gesturing at is a real list in Profil.
