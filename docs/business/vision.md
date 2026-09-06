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

**Both — but sequentially, and not as equals.** **App 1 is the final
form of this system**, not a stepping stone: it finishes, and then it is
left alone. App 2 is born from inside it and then diverges — a broader
audience and a much longer usage life mean **the system and the UI
change**, which is the owner's own framing and it is right (§5 measures
how much). App 1 goes first because it is nearly built, because its
market has a deadline that recurs every semester, and because it is the
only way to obtain the one input App 2 cannot buy: evidence from people
who are not his friends.
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

**2. The work is already paid for — the half that travels.** 241
questions, the review pipeline, the tooling, the engine, the merge, the
design tokens. Not the screens: §5 measures the split at roughly 2,000
lines of shared core against 4,800 lines of shell, and the shell is the
part App 2 rewrites. That still makes App 1 the cheapest possible way to
build App 2's foundation, but "App 2 is App 1 with the exam removed" is
not true and planning on it would under-cost App 2 by a factor of
three.

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

**Its ceiling is deliberate, and v2.0 is where it stops.** The paper
defines done, so App 1 is a *finite* product — and the owner's decision
is that this system's final form is App 1, not a base that keeps
evolving. That is a feature, and it should be honoured rather than
drifted away from: after v2.0 the map below has no more rows. Errata,
new passages as supply, a yearly check that the paper has not changed —
maintenance, not a roadmap. A finished thing can be left alone while its
author does something else, which is exactly what App 2 needs of it, and
the way most solo projects die is by never letting the first one
finish.

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

### What a longer life and a wider audience actually change

The owner's framing — App 2 is born inside App 1 and then evolves
somewhere very different, because it teaches a broader audience over a
much longer period, so the system and the UI change — is not a
concession. It is a design brief, and it names two variables that each
break something App 1 gets for free.

**Duration: six weeks becomes a year.**

- **The exam supplies the reason to return.** App 1 never has to answer
  "why open this tomorrow"; the calendar answers it. App 2 must, and
  this project has explicitly refused streaks, notifications, timers and
  numbers that go up. The boundary model is the honest substitute,
  because *"four boundaries are ready to look at again"* is a *state*
  rather than a score: it can be true or false, it is derived from what
  the learner actually did, and unlike a streak it cannot be lost by
  going on holiday.
- **The session shape inverts.** Exam prep is long sittings under a
  deadline; year-long study is short and frequent. The current shell is
  built around a twenty-question sitting that ends on a results screen.
  A five-minute daily thing wants the opposite — practice in one tap and
  no terminal screen — and that is a shell rewrite, not a setting.
- **Content exhaustion becomes the dominant constraint.** 241 items is a
  few weeks. App 1's corpus can be *finished*; App 2's can only be
  *grown*, at the same 6–8 minutes of undelegable attention per item.
  This is the supply argument from §4 again, and a year-long product
  makes it the central fact of the design rather than a scheduling
  detail. It is also, doubly now, the argument against a subscription.
- **Visual satiation stops being hypothetical**, and this one is worth
  reopening deliberately. `docs/research/visual-longevity.md` asked
  exactly the right question — how does an interface this consistent
  stay worth looking at on day thirty — and parked almost every lever it
  found. But both reasons for parking them were properties of App 1: the
  exam was five days away, and the owner looked at the grouped index and
  felt nothing. **That document was researching a problem App 1 does not
  have.** It should be re-read from the top when App 2 starts, with its
  own premise restored rather than its App 1 conclusions inherited.

**Audience: exam candidates become "anyone refining their English".**

- **No shared goal.** An exam makes every learner's target identical, so
  App 1 never has to ask what someone wants. App 2 has to either ask or
  infer — and inferring is the wedge, which is why the diagnostic is the
  first thing built rather than a feature added later.
- **No shared level.** B1–C1 becomes a wide spread. The boundary model
  absorbs this where a level system would not: you only ever meet the
  boundaries your own answers show you smear.
- **No shared deadline, so no shared urgency**, and this reaches further
  into the interface than it looks. The word *sınav* is load-bearing in
  App 1's copy — in the onboarding, in Profil's honesty section, in the
  reason every screen gives for existing. Removing it is not a
  find-and-replace; it is re-answering "why is this screen here" for
  every screen.
- **Onboarding has thirty seconds to establish why you are here**, where
  App 1 could simply assume it.

### So: a shared core, and a new shell

The practical form this takes, given the project's own no-build-step
rule:

**App 2 is a new codebase that copies the core, not a fork of the whole
repository and not a shared package.** Sharing modules across two apps
without duplication needs either a build step or a monorepo layout, and
the no-build-step rule is a large part of why this project still works
and costs nothing to run. **Copying ~2,000 lines once is cheaper than
acquiring a toolchain**, and the two apps will diverge anyway — a shared
module that both apps must agree about becomes a negotiation between a
finished product and a moving one.

What gets copied, and what genuinely does stay in sync, is `tools/`.
6,065 lines of validator, formatter, blind pass, calibration, sweep and
solve — the pipeline is the one asset that is identical for both apps,
because it is about *how content is checked*, not about what the content
teaches or how it looks.

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

## 5 · What travels, measured

An earlier draft of this document said "everything except the exam
travels". That was wrong, and the owner's framing is what corrects it:
if the system and the UI change, then what does *not* travel is the
screens — which are most of the code.

Counted over `js/` on 2026-09-06:

| | Lines | |
|---|---|---|
| **Shared core** | **~1,990 (29%)** | `dom` · `modal` · `listbox` · `icons` · `quiz-engine` · `backup` · `storage` · `config` · `session-state` · `prompt` |
| **Rewritten shell** | **~4,790 (71%)** | `education` (1,768) · `home` · `profile` · `quiz` · `results` · `topics` · `shell` · `answers` · `feedback` · `quiz-launch` · `backup-ui` · `report` · `tiers` |

Two caveats on the core, because a table like this flatters itself.
`storage.js` travels as a mechanism — the lattice merge, the guarded
reads, the export — but its *shapes* are attempt-and-topic shaped and
App 2's are boundary-shaped, so call it mostly rather than wholly.
`icons.js` and `listbox.js` travel as components; whether App 2 wants
those particular fourteen icons is a design question, not a code one.

And `css/style.css` (1,154 lines) splits the same way as `js/`: the
tokens, the type scale and the accessibility contract travel; the
component rules go with the screens they style.

**What travels whole is `tools/`** — 6,065 lines, plus 2,098 lines of
tests. The validator, the formatter, the blind pass, the calibration
corpus, the browser sweep and the solve ledger are identical for both
apps, because they are about how content is *checked* rather than what
it teaches or how it looks. Together with the agent briefs and the
review protocol, that is the asset `two-apps.md` §3 argues a
better-funded competitor cannot cheaply buy.

**So "App 1 first" is still not a delay — but for a narrower reason
than the earlier draft claimed.** What App 1 buys App 2 is a proven
pipeline, a validated engine, a design language and 241 items of
evidence that the method works. It does not buy App 2 its screens, and
anyone planning App 2 as "App 1 minus the exam" would under-cost it by
roughly a factor of three.

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
