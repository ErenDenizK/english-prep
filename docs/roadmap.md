# Roadmap

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
| Topics | 3 | 7 |
| Questions | 73 | 168 |
| Lessons | 18 | 42 |
| Questions per category | 4.1 | 4.0 |

Everything drafted is in `docs/agents/drafts/`, and
`docs/agents/drafts/README.md` records exactly what each topic still owes
before it can ship. Nothing there is served.

## What the paper actually pays for

Session I is **60 points across 40 questions**, all four-option multiple
choice (`docs/exam-spec.md`, from the two sample papers).

| Section | Items | Points | Where the app stands |
| --- | --- | --- | --- |
| Cloze test | 10 | 15 | 9 of the 10 blank *types* are covered once the drafts ship |
| Closest meaning | 10 | 15 | drafted, one verification from shipping |
| Reading — 2 texts | 14 | 21 | **not covered, and out of v1** — see below |
| Paragraph completion | 6 | 9 | **not covered, no schema, not started** |

The single most useful thing in the exam spec is the blank-by-blank
breakdown of the sample cloze, because it says which grammar the paper
rewards rather than which grammar a textbook orders. Mapped against what
now exists:

| Blank | Tests | Covered by |
| --- | --- | --- |
| 1 | discourse markers | `connectors` (drafted) |
| 2, 4 | modals | `modals` (shipped) |
| 3 | causative `make + object + bare` | `gerunds-infinitives` (drafted) |
| 5, 10 | vocabulary | `academic-verbs`, `academic-nouns-adjectives` (drafted) |
| 6 | comparatives | `closest-meaning` (drafted, partly) |
| 7 | `so` / `such` | **nothing** |
| 8 | relative pronouns | `relative-clauses` (drafted) |
| 9 | quantifiers | `quantifiers` (drafted) |

Two of ten blanks are modals and **not one tests a tense or the passive**
— which is what the app shipped first. The seven drafts were commissioned
to close exactly that gap, and they do, with one hole: `so / such`.

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

### Now — clear the queue

| # | Work | Cost |
| --- | --- | --- |
| 1 | `closest-meaning`: one independent re-verification of the reporting block, then ship | hours |
| 2 | `connectors`, `relative-clauses`: sufficiency re-run on the repaired lessons, then ship | ~a day |
| 3 | `quantifiers`: both passes, never run | ~a day |
| 4 | `gerunds-infinitives`: one blocking item, two lessons that contradict their own questions | ~a day |
| 5 | `academic-verbs`, `academic-nouns-adjectives`: both passes, never run | ~a day |

That is **+168 questions and +42 lessons**, taking the app to 241
questions across 10 topics, and it closes 9 of the 10 cloze blank types.
It is the whole of the next stretch and it needs no new authoring.

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

**Proposed definition, for the owner to accept or move:**

> The app is 1.0 when every part of the exam it can honestly practise is
> practisable with reviewed content, and the app never tells a learner
> something it cannot support.

Four criteria, each measurable:

1. **Coverage.** Cloze (all ten blank types), closest meaning and
   paragraph completion are all practisable. That is **39 of Session I's
   60 points**.
2. **Quality.** Every shipped item has passed a blind pass and every
   shipped lesson a sufficiency pass, with zero known blocking defects.
   This is the one criterion that is currently *false of shipped content
   too* — the 73 live questions have been through it, but the pipeline
   has tightened since.
3. **Honesty.** Nothing on screen claims more than the data supports.
   This is already true and has to stay true: the weak-category claim is
   hedged, the topic score is a percentage over everything answered, the
   mistake book does not promise a graduation the calendar can prevent.
4. **It says what it does not do.** A learner can see, in the app, that
   reading and listening are not covered. An app that silently omits 21
   of 60 points is worse than one that says so.

**Reading is deliberately outside v1.** The arm re-derived the cost at
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
| Reading section | v1 ships; then one passage at a time, as supply |
| Listening (Session II, 20 points) | needs audio, which is a different project and a hosting decision |
| Mastery levels | ~8–10 items per category |
| Adaptive difficulty, item scheduling | ~15–20 items per category |
| Mock exam under time | cloze *and* restatement at exam scale, plus a passage schema |

---

## Decisions the owner has to make

1. **Is the v1 definition above the right one?** Specifically: is 39 of
   60 points, with reading named as out of scope, a thing you are willing
   to call 1.0.
2. **The exam date.** Still open, and it changes the order of everything
   below the first stretch — `docs/research/the-last-week.md` is written
   and cannot be acted on without it.
3. **`optionNotes` content budget.** The field ships; whether 291 notes
   get written against the existing corpus, or only against vocabulary
   where they are the minimum honest explanation, is a budget call.
4. **The dev-note banner.** "Geliştirme aşamasındayız" is the first thing
   a new learner reads. Right for friends today, wrong the day you call
   it 1.0. It is a one-line change and it should be a decision rather
   than a leftover.
