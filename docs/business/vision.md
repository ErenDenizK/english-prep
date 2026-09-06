# Which one, how big, and in what order

2026-09-06. The owner asked the question the other six documents circle
without answering: **should he build App 1, App 2, or both — how big
should each be, how should they be run, what should they contain, and
in which version does each thing arrive.**

This document answers it. It is a recommendation, not a survey. Where it
disagrees with an arm, the arm's reasoning is cited so the disagreement
can be checked rather than taken.

---

## The answer in five sentences

**Both — but sequentially, and not as equals.** App 1 finishes first,
because it is nearly built, because its market has a deadline that
recurs every semester, and because it is the only way to obtain the one
input App 2 cannot buy: evidence from people who are not his friends.
App 2 starts only after App 1 has shipped and produced that evidence.
**The binding constraint on both is not code and not money — it is
roughly seven minutes of his own attention per question**, and every
plan below is denominated in that. And the single most important
scheduling decision in the whole project is that **the quality debt is
the gate on charging money, not the feature list.**

---

## 1 · Why App 1 first, stated so it can be argued with

Four reasons, in descending strength.

**1. App 2 has no definition of done, and App 1 manufactures one.**
This is `two-apps.md` §1.2's sharpest finding and it deserves to drive
the schedule. `docs/roadmap.md` is a good document because it can say
"39 of Session I's 60 points". Delete the exam and no sentence replaces
that. A solo evening project with no stopping rule does not ship late —
it ships never. §3 below proposes App 2's substitute, and that substitute
is *designed from what App 1 measures*.

**2. The work is already paid for.** 241 questions, 60 lessons, 723
option notes, the design system, the engine, the review pipeline, the
1,500-check sweep. App 1 is not a detour that delays App 2; it is App 2's
foundation with an exam bolted on. The only parts that do not travel are
`docs/exam-spec.md`, `CLOZE_BLANKS` and the section weights.

**3. Friends' feedback is not evidence.** Everything known about whether
this app works comes from people who know the person who built it. App 1
sold to three schools produces the first data point that is not
affection: did a stranger pay, use it, and come back. App 2's whole
premise — that there is a large audience of *competence without labels* —
is currently a hypothesis with n≈3.

**4. Every risky first is cheaper on App 1.** First store listing, first
tax registration, first refund, first stranger's bug report, first
"where did my progress go". Learning each of those on a 150-person
Turkish app with a finite corpus is much cheaper than learning them on a
subscription product with a content cadence to keep.

**The counter-argument, honestly.** App 1's ceiling is a few hundred
sales in a market that exists for six weeks a year, and App 2 is the one
he actually cares about. If the calendar were the only consideration,
starting App 2 now would put it a season earlier. The reason not to is
§1's first point: starting it now means starting it without knowing when
it is finished.

---

## 2 · App 1 — scope, and the version map

**What it is.** The exam app as it stands, finished against the paper it
targets, sold once, to Turkish prep-school students. Turkish interface,
English content, no accounts, no backend, offline.

**Its ceiling is deliberate.** The paper defines done, so App 1 is a
*finite* product. That is a feature. It can be finished, and a finished
thing can be left alone while its author does something else — which is
exactly what App 2 needs of it.

### Where it actually stands

| | |
|---|---|
| Topics / questions / lessons | 10 / 241 / 60 |
| Items per category | 4.0, across all 60 categories |
| Item types | 193 cloze, 24 restatement, 24 typed cloze |
| Session I coverage | Cloze 9/10 blanks · Closest meaning ✓ · Reading ✗ · Paragraph completion ✗ |
| Points practisable | 30 of 60 today; **39 of 60** at v1.0 |

### The map

**v0.39 — freeze (this week).** The exam is days away and the person
sitting it is the person who would be pushing. Nothing ships except the
cloze-coverage fix (task #43), which is two lines and makes a screen stop
understating the truth. **A push to `test` is a deploy; treat exam week
as a code freeze.**

**v0.40–v0.45 — finish the paper (2–4 weeks after the exam).**

| | Work | Cost |
|---|---|---|
| `so / such` | The one cloze blank type nothing covers. One category, four items, folded into an existing topic | ~half a day |
| Paragraph completion | 9 points, a whole section, no schema. A ~120-word paragraph with one sentence removed; distractors are on-topic and grammatical and fail on **coherence** — a different authoring skill | schema ~1 day, then ~2 h/item |
| The error-tracking screen | Task #32, unblocked since the chosen option started being stored. **Build it here, not in App 2** — see §3 | ~2 evenings |
| The quality debt | §4. The gate on everything after this row | ~28 h, shareable |

**v1.0 — the honest claim.** The definition already accepted in
`docs/roadmap.md`: *every part of the exam it can honestly practise is
practisable with reviewed content, and the app never tells a learner
something it cannot support.* That is 39 of Session I's 60 points, and
`x` moves from 0 to 1 only when the owner says so.

**v1.1 — reading.** Deliberately outside v1: 2.5–3.5 h of review per
passage, and a passage is single-use. It is a supply to be replenished,
not a project to be finished — one passage at a time, forever, or not at
all.

**v1.2 — the mock.** Cloze and restatement at exam scale, under time.
Needs v1.1's passages to be honest, which is why it is last.

**v2.0 — paid.** Everything in `shipping.md` and `pricing.md` becomes
real here: source closed (the owner's decision, `brief.md` addendum),
domain bought, Play listing, entitlement decided, and the free/paid line
drawn at *free forever, paid depth* — every lesson and the v1 corpus
free, items 5–10 per category and the timed mock paid.

---

## 3 · App 2 — and the problem it has to solve first

**The hardest design problem in this whole plan is not content and not
competition. It is that nothing tells App 2 when it is finished, or when
a learner is.** An exam app inherits its stopping rule from the paper. A
"get better at English" app inherits nothing, which is why that category
is full of products whose answer is a streak counter — a stopping rule
that never arrives, sold as engagement.

This project has explicitly refused streaks, timers, numbers that go up
and leaderboards. So it needs a different answer, and it already has the
raw material for one in the owner's own audience statement.

### The proposal: the unit is a *boundary*, not a topic

The audience is **competence without labels** — an ear that is usually
right and has never been taught the scaffolding. What such a learner is
missing is not knowledge in general. It is a finite, enumerable set of
**boundaries their ear smears**: *must / have to*, *few / a few*, *since
/ for*, *wrote / written*.

That is already how every lesson in App 1 is built — `CLAUDE.md` says so
— and it has three consequences that solve the problem:

1. **Done exists, and it is countable.** "There are N boundaries in this
   corpus; you have closed 43 of them." Finite, personal, honest, and
   nothing like a streak.
2. **The unit is smaller than a topic**, so supply can grow one boundary
   at a time and the product is never half-built.
3. **It matches what the learner would say about themselves.** Nobody
   says "I am B2". They say "I never know which one of these two to
   use."

### The wedge: the diagnostic

`two-apps.md` §3.2 is right that the competitor is ChatGPT, not
Duolingo, and that if the headline feature is *explanation* the app is
dead — explanation is free everywhere now.

But there is one thing a chat box structurally cannot do: **tell you
what you did not know to ask.** You have to bring it a question. The
whole value of a corpus with a taxonomy is that it can find the boundary
you did not know was a boundary.

That is why the error-tracking screen belongs in **App 1 v0.4x, not App
2**. It is App 2's core mechanic, and App 1 is the only place it can be
validated against ground truth, because there the paper says whether the
diagnosis was right.

### App 2's map

**v0.1 — Teşhis, and nothing else.** The diagnostic alone: ~20 items
across the boundaries, free, Turkish, no account, no store. It tests the
one hypothesis everything else rests on — *does someone who does not
know him find this useful* — and it is perhaps two weekends because the
engine already exists.

**v0.2 — 20 boundaries.** The diagnostic now has somewhere to send you.
Still free, still Turkish, still no exam framing anywhere in the copy.

**v0.5 — 60 boundaries, plus state.** The mistake book, the boundary
list, "43 of N closed". This is the first version that is a product
rather than a demo.

**v1.0 — ~100 boundaries, and the claim.** Enough that "the boundaries
your ear smears are named and closed" is a true sentence rather than an
ambition. Paid depth begins here, if at all.

**v2.0 — a second language.** Not a localisation ticket. 51 of 60
lessons argue against Turkish specifically; a second language is 45–60
hours from someone whose intuition in it is as good as his in Turkish.
**Treat it as a hiring decision**, and do not take it before v1.0 has
shown the thing works in one language.

### Its ceiling, said out loud

Hundreds of paying users, not thousands (`two-apps.md` §3.1). That is
the realistic outcome for a solo-built language app with no marketing
budget, and it is fine — he has said profit is not the point. Planning
for it honestly is what stops v1.0 being scoped like a startup.

---

## 4 · Management: the constraint is his attention

Everything above is denominated in the wrong currency if it is counted
in features. The real unit is this:

> **~6–8 minutes of the owner's own undelegable attention per shipped
> question** (`content-pipeline.md` §7.1–7.2).

Writing is delegable. The blind pass is delegable. Repairs are
delegable. What is not delegable is **cold-solving the item before
looking at the key** — a competent speaker sitting down with the
question and finding out whether it actually discriminates. Every defect
class the review rounds found is a defect that survives everything
except somebody solving the item.

**241 items × 7 minutes ≈ 28 hours, and the git history says it has not
been spent.** That is not a criticism; the corpus is four days old. But
it is the real balance sheet.

### Three rules that follow

**1. The quality debt is the gate on charging money.** Not the feature
list. A wrong item in a free app is a shrug; in a paid app it is a
refund, a message on a Sunday, and the one thing this project's whole
identity is built on being right about. **Cold-solve everything you
charge for, before you charge for it** — and nothing else, which cuts 28
hours to whatever the paid tier actually contains.

**2. The friend should be the second solver, not the second author.**
He sat the Bilkent prep exam, so he *is* the target audience, and an
independent solver is the pipeline's scarcest input. Making him a
content author instead costs two things: the corpus's single-standard
property, and it triggers the copyright question in `licensing.md` §5
immediately. As a solver he needs no licence note at all, and he halves
the only number that matters.

**3. Denominate versions in items, not in features.** "v1.0 needs
paragraph completion" is unschedulable. "v1.0 needs 24 paragraph-
completion items at ~2 h each plus a schema day" is a calendar.

### Cadence

A realistic solo cadence, stated as a budget rather than a promise: one
hour of the owner's attention per evening he has one, spent on solving
before it is spent on anything else. At ~8 items an hour that is a
finished topic a week, or the whole existing corpus cold-solved in about
a month of evenings.

**And the thing not to promise: a monthly content cadence.** That is
`two-apps.md` §5.4, and it is the argument against launching App 2 on a
subscription — a monthly price is a standing promise of 3–4 hours a
month of the one resource that cannot be bought.

---

## 5 · What both apps share, and why that matters

Everything except the exam:

- the content schema, the typed blocks, the item types;
- `validate-content.mjs`, `content-checks.mjs`, `blind-corpus.mjs`,
  `make-calibration.mjs` — the most transferable thing this project
  owns;
- the agent briefs, minus their exam sections;
- the design system, the a11y contract, the sweep;
- the quiz engine, storage, backup, the mistake book, the weakness
  bound.

This is the concrete reason "App 1 first" is not a delay. Roughly
everything built for App 1 between now and v1.0 is App 2 infrastructure
that happens to be validated against a real exam first.

---

## 6 · The risk that is not on any list

`two-apps.md` §10 names it and it belongs at the end of this document
too, because it is the one that decides whether any of the above
happens.

**The quality system has exactly one component, and it is the owner's
own attention.** Not the validator, not the sweep, not the review
sessions — those all check things that can be checked mechanically or by
another model. The part that catches a question with two defensible
answers is a competent person solving it cold, and there is one of him.

Everything in this document is a way of spending that resource
deliberately: finish the finite product first, pay the debt only on what
is sold, recruit the one other person who can spend it, and never sign
up for a cadence that spends it forever.
