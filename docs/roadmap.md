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
| Topics | 8 | 2 |
| Questions | 193 | 48 |
| Lessons | 48 | 12 |
| Questions per category | 4.0 | 4.0 |

**Grammar is finished** (2026-09-04). The five drafted grammar topics
cleared their review debt and shipped together, as the owner asked and
for the reason the queue existed: they were commissioned to close one
gap, and shipping them one at a time would have meant five partial
answers to the cloze section instead of one whole one.

What remains drafted is the two vocabulary topics, in
`docs/agents/drafts/`; `docs/agents/drafts/README.md` records what each
still owes. Neither review pass has run on either, so neither is served.

## What the paper actually pays for

Session I is **60 points across 40 questions**, all four-option multiple
choice (`docs/exam-spec.md`, from the two sample papers).

| Section | Items | Points | Where the app stands |
| --- | --- | --- | --- |
| Cloze test | 10 | 15 | **8 of the 10 blank types shipped**; the other two are the vocabulary blanks, drafted |
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
| 5, 10 | vocabulary | `academic-verbs`, `academic-nouns-adjectives` (drafted) |
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
questions across 8 topics and closing 8 of the 10 cloze blank types.

The cost is worth recording, because it is the argument for the pipeline:
across the five, the passes found roughly one item with two defensible
answers per twelve written and roughly one untrue claim about English per
lesson — and **five of the repairs introduced a new defect**, each caught
only by an independent re-audit and none of them visible to
`npm run check`. A repair is not a fix until someone who did not write it
has re-read it.

### Now — the two vocabulary topics

`academic-verbs` and `academic-nouns-adjectives`: 48 questions and 12
lessons, neither review pass run on either. They close cloze blanks 5 and
10 and take the app to 241 questions across 10 topics.

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

## Decisions the owner has made

**The v1 definition above is accepted** (2026-09-04), and with it that
reading is named as out of scope rather than silently missing.

**Grammar finishes first, and in one or two sittings.** That reorders the
list above: the five grammar drafts clear their review debt and ship
before anything else starts, and the two vocabulary topics queue behind
them rather than beside them. `so / such` and paragraph completion follow
the grammar ship, not the vocabulary one.

**`optionNotes` is not a budget item now.** The field exists and the
vocabulary topics use it, because there one gloss per wrong option is the
minimum honest explanation. Writing 291 notes against the existing
grammar corpus is not scheduled: completing the app's features is worth
more than deepening content that already teaches.

**A content roadmap became a feature, in small.** Shipped 2026-09-04 as a
section in Profil: what exists, counted from the manifest so it cannot go
stale, over a short editorial list in `data/roadmap.json` of what is done,
next and planned. It replaced the "Geliştirme aşamasındayız" banner
rather than joining it. The larger version the owner described — down to
which questions and which `optionNotes` exist — is still later; this is
the version that fits on a phone and tells the truth today.

## Still open

1. **The exam date.** It changes the order of everything below the first
   stretch, and `docs/research/the-last-week.md` is written and cannot be
   acted on without it.
2. ~~**The dev-note banner.**~~ **Decided 2026-09-04: retired.** It sat
   above every screen, was the first thing a stranger read, cost 48px of
   the 320px fold on every arrival, and said something no learner could
   act on. Its one useful sentence is now on the first-run card, and what
   it was gesturing at is a real list in Profil.
