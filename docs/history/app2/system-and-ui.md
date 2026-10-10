# App 2 — the system and the UI

*What the interface looks like, and how it is shaped, when the unit is a
boundary and the horizon is a year rather than six weeks.*

Written 2026-09-06 as a research arm for the second app. It takes
`docs/business/vision.md` §3 as settled: App 2 teaches English worldwide,
in English, to adults who already function in the language; the unit is a
**boundary** — a pair the ear conflates; progress is boundaries closed and
the learner can finish; App 2 is a new codebase copying ~1,990 lines of
core and rewriting ~4,790 of shell; no build step.
`docs/design-system.md`'s principles hold unless argued against, and this
document argues against exactly two, both in §5.

**This is also the re-read `visual-longevity.md` asked for.** Its note
says it was researching a problem App 1 does not have — six weeks of use,
and an owner who felt nothing from tier grouping — and that it should be
re-read from the top with its premise restored. §5 is that re-read; its
conclusions are re-derived against 365 arrivals, and three come out
differently.

**Marking.** `[S]` search-index summary, source unopened; `[?]`
unverified; `[≈]` my own reasoning or arithmetic. WebFetch and curl are
blocked here, so every external claim is `[S]` unless computed in this
repository. §8 lists what I could not check.

---

## 0 · The short version

App 1's shell is built around a **sitting** — choose a count, answer
twenty, arrive at a results screen that assembles the picture. The count
listbox, the progress bar, the score and the breakdown all exist because a
sitting has a beginning and an end. A five-minute daily habit has neither.
It has a **queue**, whose terminus is not a score but *emptiness*. So the
answer is not "make the sitting shorter": delete the sitting, delete the
results screen, and replace both with one surface that is the start and
the end of every session.

1. **The gate** — one recurring arrival surface, one sentence, at most two
   controls. It says what is ready; when the queue empties you return to
   it and it says the other thing. No results screen, no score. (§1)
2. **Two destinations, App 1's shell.** Practice and Boundaries in the
   nav, identity in the header. The diagnostic and the review queue are
   *states*, not places; putting either in the nav is the mistake. (§2)
3. **The boundary screen is one object in three states** — unmet, open,
   closed — over four block types, capped so a uniform page is not
   expressible. (§3)
4. **Progress is a set, not a number.** Never `43/104` as a ratio. Three
   state counts, a list that *is* the picture, and one drawing whose cells
   are boundaries in the order you closed them — a day-strip is a
   six-week instrument and dies at 320px over a year. (§4)
5. **Three parked levers unpark, one as a reversal.** Lesson shape becomes
   a schema constraint rather than a brief; the accent hue unparks
   *re-aimed at grammatical family, not difficulty tier*; the light theme
   stops being a freshness question and becomes a reach requirement,
   roughly half the cost at v0.1 that it is retrofitted. (§5)

What decides most of it: at 365 arrivals every surface is far past the
exposure count where liking turns (§5.1), and variation will not outrun
that. What works is making the most-seen surfaces carry the learner's own
changing record and never moving the frame behind them — because the far
side of the trough is familiarity-as-value, and an app that keeps changing
its face never gets there.

---

## 1 · The session

### 1.1 What App 1's session is, measured

`js/config.js` sets `TOPIC_TEST_DEFAULT_COUNT = 15` and
`MIXED_TEST_DEFAULT_COUNT = "10"`; `quiz-launch.js` is the single entry
and every path ends on `results.html`. `js/shell.js` exists because three
screens run in focused mode with an action bar whose minimum height is
fixed at `52px + 2 × --s-3` = 68px so answering never moves the button.
That bar is the physical expression of a sitting: something is always
pending under the thumb. The results screen is the sitting's
justification — where twenty scattered answers become one picture, and
where a wrong answer is linked to the lesson that teaches it. Removing the
sitting removes that screen's reason to exist, not merely its convenience.

### 1.2 What the evidence supports, and what it does not

The microlearning literature returns confident numbers I do not trust:
"5–10 minutes, 3–5 times weekly", d = 0.74 over controls, SMD 1.43 versus
lectures, 62% versus 23% retention at 30 days `[S]`. The effect sizes are
implausible for a format manipulation and several trace to vendor blogs.
**Nothing below rests on them.** `[?]`

What is solid is enough. **Distributed practice**: spacing beats massing
across domains, four 50-minute sessions beat one four-hour session, and
Japanese learners trained across four sessions at 1-day and 7-day
intervals showed similar gains at 7 and 28 days `[S]`. Nothing says five
minutes beats thirty; it says **the same total time cut into more sessions
is worth more**, which is the only claim the design needs. **Retrieval
practice and desirable difficulties**: testing beats re-presentation,
interleaving beats blocking, and the extra difficulty is where retention
comes from `[S]` — all three favour a short mixed session over a long
blocked one. **Habit formation is slow and cued by context, not length**:
Lally's participants reached 95% of their automaticity asymptote between
18 and 254 days, median 66, and **missing a single opportunity did not
materially affect the curve** `[S]`. So expect months before opening the
app is automatic, and treat a missed day as a non-event — an argument
against the streak from the habit literature rather than from SDT, worth
having because that is where streaks are usually justified from.

So the micro-session is not pedagogically inferior: cut the same study
time into daily pieces and distributed practice says you gain. The costs
are elsewhere and real. **Reading depth** — a boundary's first meeting
needs 300–500 words plus practice, which five minutes will not hold; §3
resolves it by making the first meeting a declared, longer shape rather
than pretending all sessions are equal. **The assembled picture** — six
answers a day produce the same pattern as twenty and nobody sees it; §4 is
the replacement. **Warm-up** — a fixed orienting cost amortised over
twenty items is not amortised over six `[≈]`, which is the argument for
the gate being nearly empty: every pixel on it is paid 365 times and taxes
the shortest sessions hardest. **Exam stamina** — not paid at all, because
App 2 has no exam.

### 1.3 The gate

On open, one sentence and one button.

```
┌─ 320 ────────────────────────────────┐
│  English                        (D)  │  header, 56px
├──────────────────────────────────────┤
│  Six boundaries are ready            │  t-title 22/28
│  to look at again.                   │
│                                      │
│  [        Start        ]             │  btn--primary, 52px
│                                      │
│  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  │  the closed-strip (§4.4)
│  ·  ·  ·  ·  ·  ·  ·  ·             │
├──────────────────────────────────────┤
│   ▣ Practice        ▢ Boundaries     │  nav, 60px
└──────────────────────────────────────┘
```

That is the whole surface, and it needs a rule written before it is built,
because it is what every future feature will want a row on:

> The gate holds one sentence, at most two controls, and the record strip.
> Anything else proposed for it belongs in Boundaries.

| State | Sentence | Primary |
| --- | --- | --- |
| Queue has items | "Six boundaries are ready to look at again." | Start |
| Queue empty, unmet remain | "Nothing is due. There are 73 boundaries here you haven't met." | Meet a new one |
| Everything met and closed | "You have closed everything here. I'll tell you when there is more." | — (a quiet *Look at something again*) |
| First ever open | "Let's find out which ones your ear smears." | Start — the diagnostic (§2.2) |

The third sentence is `vision.md`'s third notification, said in the app.
It is the product's central claim in the one place it can be checked, and
no engagement-optimised product would put it on its home screen. That is
the point of putting it there.

### 1.4 Practice starts by being open

App 1 settled that Eğitim is the default because "someone opening a study
app wants to carry on where they left off, not to be handed an exam"
(`js/home.js`). **That reasoning survives and inverts its conclusion.** In
App 2 the practice *is* carrying on — the queue is literally the
continuation of previous sessions — so Practice is the default route, and
the thing that would be being handed an exam is a cold item with no
context.

Hence a gate rather than opening straight onto an item. It costs one tap
and buys three things: **autonomy** — SDT's triad is the best-supported
frame here, a 2024 meta-analysis over 443,000 participants finding all
three needs predicting well-being and performance `[S]`, and the cheapest
autonomy affordance in existence is a screen where the learner presses the
thing `[≈]`; **a place for "done"**, which otherwise has nowhere to be
said and forces the invention of a terminal screen; and **a place for the
record** (§4.4).

Rejected. *Opening directly on the first item* — saves a tap, costs those
three, and starts every session with a demand. *A home screen with
sections* — that is App 1's Test tab, and App 1's own measurement is that
the arrival screen is where the boredom is at sixty exposures; at 365 it
is worse. *A "today's plan" screen* — a plan is a promise the app makes on
the learner's behalf, converting a queue into a target that can be missed,
which is the streak's mechanism in a different hat.

### 1.5 The loop, where it stops, and how big it is

`gate → item → feedback → item → … → gate`.

- **Every item commits as it is answered.** App 1 writes an attempt at the
  end of a quiz; App 2 must write per item because there is no end. This
  is `design-system.md` §9.2's INP rule from a new direction: paint first,
  persist after, one debounced write per item and one on
  `visibilitychange`.
- **Leaving mid-queue costs nothing and is not remarked on.** No "are you
  sure", no "you were so close". A queue is not a commitment.
- **There is no score** — not per session, per boundary or per day.
- **The queue does not accumulate**, and this is the most important
  scheduling decision in the app. Anki's characteristic failure is the
  backlog: miss a week, return to a wall; its own answer is a daily review
  cap `[S]`. **App 2 avoids it by choosing the right unit.** Cards
  accumulate because a card is scheduled; boundaries do not, because a
  boundary ready for a month is still one boundary. Ten missed days
  produce a queue no larger than the number of boundaries you have open,
  and the wall cannot form. Write it down, because the first person to add
  per-item scheduling will rebuild the wall without noticing:

> **Readiness is a property of a boundary, not of an item.** Nothing in
> the queue may be counted twice for having waited longer.

| Session | Items | Minutes | Frequency |
| --- | --- | --- | --- |
| Review | 4–8 | 2–4 | most opens |
| First meeting of a boundary | read + 4 | 5–8 | 1–3 a week |
| A deliberate browse | — | — | rare, and fine |

`[≈]` From App 1's measured per-item cost and what 288px of column holds,
not from the literature. The one that matters is the review: **if it
routinely runs past five minutes the queue is mis-shaped**, and the fix is
the readiness rule, never a cap bolted on afterwards.

**End on an open loop, not a ceremony.** The Zeigarnik literature is
usually cited for the wrong half: a 2025 meta-analysis of the Zeigarnik
and Ovsiankina effects found **no memory advantage for unfinished tasks**
— that half does not replicate — but did find a robust tendency to resume,
around two-thirds, with no prompting and no reward `[S]`. So build nothing
on "unfinished things are remembered better", and do notice that
*finishing discharges the pull*: a results screen is a closing ritual, and
closing a session formally guarantees no pull to resume. The gate does the
opposite honestly — it says what is still open and stops talking. It also
forbids manufactured cliffhangers: the app never stops mid-boundary to
create tension.

---

## 2 · The navigation

### 2.1 Two objects, and everything else is a filter

App 2's things are boundaries, the queue, the diagnostic, the library and
your state. Reduce them: the queue is a *view of* boundaries filtered by
readiness; the library is a *view of* boundaries unfiltered; your state is
an *attribute of* each boundary plus three counts; the diagnostic is a
first-run mode and later one row. **There are two objects: a boundary, and
the set of boundaries.** That is the whole information architecture.

```
nav:     [ Practice ]  [ Boundaries ]
header:  (initial / figure) → Profile
```

**Structurally identical to App 1's settled shell** — two content modes in
the nav, identity out of the tab bar — which is neither coincidence nor
laziness: that shape was settled by owner feedback, survives the change of
subject intact, and is ~200 lines of `js/home.js` chrome that transfers
as-is. **Practice** is the gate and the item screen, the default route,
where you go with nothing in mind. **Boundaries** is the list, grouped by
state, and the way into any boundary screen — where you go with something
in mind. **Profile** is name, backup, notification settings, the honesty
section and reset.

> **A nav destination is somewhere you can go with nothing in mind, on any
> day of the year.** Everything else is a route.

### 2.2 What I reject, by name

**Three tabs mirroring App 1 (Learn / Practice / Profile).** Learn would
be the library and Practice the queue, but they are two filters on one
list, and a nav presenting one object twice teaches the learner that the
app has two content stores. App 1 can afford Eğitim/Test because lessons
and questions genuinely are two corpora; App 2's boundary contains both.

**Four tabs (Today / Boundaries / Review / You).** Review and Today are
the same queue. Worse, Review is empty on most days by design, and **a
destination that is often empty trains the learner to stop visiting it**
`[≈]` — precisely the one you most need visited when it is not.

**A tab for the diagnostic.** You take it once. Adaptive-testing work puts
short diagnostics at few items — reliability > 0.9 at a mean of 8.5 items
in one CAT, 4–6 for a depression screener `[S]` — which suggests
`vision.md`'s ~20-item v0.1 diagnostic is generous rather than thin, and
certainly not a fixture. It is the first-run state of the gate, and
afterwards one row at the foot of Boundaries reading *Check again*,
because a year-old diagnosis is stale.

**No nav at all — everything from the gate.** Tempting, wrong for one
reason: the learner who thinks *"I want to look at `since / for` right
now"* is the audience statement's learner exactly — competence without
labels, who knows what confuses them — and burying the library tells them
the app decides what they study. That is the autonomy cost SDT is most
specific about, and it throws away the wedge, because the library *is* the
taxonomy the chat box does not have.

**A hamburger or top menu.** Removed from App 1 by owner request. Not
reopened.

### 2.3 Naming

Call the unit a **boundary** in the interface, not only in the docs.
*"Pair"* is factually wrong — App 1 already ships a four-way contrast
(`Must vs Have to vs Mustn't vs Don't Have to`). *"Contrast"* collides
with App 1's block type. *"Confusion"* is accurate and insulting to a
learner defined by competence. *"Boundary"* is abstract on first meeting
and exact afterwards, and onboarding has one sentence to define it — which
it needs anyway, because the product claim lives in that sentence: *"A
boundary is a place two forms sit close enough that your ear stops telling
them apart. This app names them and closes them."*

Individual boundaries are never named, only notated — **`must / have
to`**, serif, `lang="en"`, as App 1 sets English. The notation is the
title, the row label, the heading, and the thing the learner says to a
friend.

---

## 3 · The boundary screen

### 3.1 One object in three states, not one page in five sections

The brief lists what it must hold: the contrast, why your ear conflates
it, examples, practice, your state. Rendering all five at once is the
obvious move and it is wrong, for a reason this repository already knows:
learners judge their own learning by processing fluency, so re-reading
feels like learning and retrieval feels like failing (`learner-model.md`
§3.2, on Bjork, Dunlosky & Kornell). **A screen that opens on the
explanation every time offers the comfortable option first, 365 times.**

So one route `#b/<id>` renders three ways:

| State | Opens on | Explanation | Practice |
| --- | --- | --- | --- |
| **unmet** | the teaching | is the page | at the bottom |
| **open** | your state | one control away | immediate |
| **closed** | the record | one control away | offered, not pushed |

One renderer, three orderings. It is also the mechanism by which a first
meeting is allowed to be long while every return is short (§1.5) without
the app having modes.

### 3.2 Four block types, capped

App 1's lesson is `{ category, summary, blocks }` over seven types, and
`visual-longevity.md` §2.2 measured the result: **60 of 60 lessons use all
seven, every one opens `text > contrast`, every one closes on `decision`,
and two sequences cover 40%.** Sixty lessons written by separate sessions
reading a brief that said "not a template" made it one anyway.

That document's fix was to edit the brief. **At App 2's scale I would
change the schema instead**, because the finding is that a brief does not
survive contact with an agent looking for a shape to follow, and App 2
will have several times as many of those over a year.

```json
{ "id": "must-have-to", "notation": "must / have to", "family": "modals",
  "line": { "forms": [ … ] }, "why": "…", "edges": [ … ],
  "evidence": [ { "a": "…", "b": "…", "note": "…" } ] }
```

- **`line` — exactly one, mandatory.** Two to four forms, one clause each.
  It *is* the boundary; a file without one is not a boundary.
- **`why` — optional, 60–120 words.** Why your ear smears these. The one
  block about the learner rather than about English, and the one App 1 has
  no equivalent of. Also the one that should most often be absent: some
  boundaries are smeared for no interesting reason, and saying so at
  length is padding.
- **`edges` — zero to three.** Where the rule stops. This is the project's
  "an option a competent teacher would accept is a wrong option" rule
  moved upstream into the teaching: **the competent ear will produce the
  counterexample, so the app names it first.** For this audience an edge
  case is not advanced material, it is the credibility of the screen.
- **`evidence` — two to six minimal pairs.** Two sentences differing in
  one place, with the difference in meaning stated. Not "examples":
  minimal pairs, because a boundary is only visible in a pair.

Practice is not a block; it is drawn from the items keyed to the boundary,
exactly as App 1's `check` blocks are filled from questions sharing a
category. That machinery travels.

**Why this produces different pages where seven types did not.** `[≈]`
With seven optional types the full page is the safe answer and every
author converges on it. With one mandatory-and-capped, two optional and
one ranged 0–3, the possible pages are: line alone; line + evidence; line
+ why + evidence; line + edges + evidence; and the full one. A boundary
whose content is *"identical except one is formal"* is legitimately a
two-block page, and the schema makes that a normal file rather than a
suspiciously short one. That is the difference between a brief and a
constraint. The validator gains one corpus-wide check in the spirit of
`tools/content-checks.mjs`: **if more than 60% of boundary files share a
block signature, fail** — the measurement `visual-longevity.md` had to
make by hand, run in CI.

### 3.3 The screen, at 320px

Viewport 320 × 568. Header 56, nav 60 — both read from `css/style.css` —
leaves **452px above the fold** and 288px of column inside the gutters. No
action bar: App 1's reader hides it deliberately and the reasoning
transfers verbatim ("a filled amber slab pinned under every screen of a
lesson is the loudest thing on a surface whose whole job is to be quiet").

```
┌─ 320 ────────────────────────────────────┐
│  ←  Boundaries                           │  44px, quiet
├──────────────────────────────────────────┤
│  MODALS                                  │  t-micro, family
│  must / have to                          │  t-display 28/32, serif, en
│  Both are “necessary”. One of them is    │  t-lead, ≤ 3 lines
│  your idea.                              │
├──────────────────────────────────────────┤
│  must      the speaker decides           │  `line`: form serif/en,
│  have to   something outside decides     │  gloss sans, on a 2px rule
│                                          │  tinted by family (§5.3)
├──────────────────────────────────────────┤  ← fold, ~452px
│  WHY YOUR EAR SMEARS IT      (`why`)     │
│  I must call her.   ← I decided          │  `evidence`, 2–6 rows
│  I have to call her. ← the job decided   │
│  WHERE IT STOPS              (`edges`)   │
│  In the past both collapse to “had to”.  │
├──────────────────────────────────────────┤
│  Try four                                │
│  You ____ wear a helmet here.            │  cloze, serif, .blank
│  [ must ]  [ have to ]                   │  52px option rows
└──────────────────────────────────────────┘
```

Three decisions in that layout, not defaults. **The notation is the title
and the largest thing on screen** — `--t-display` 28/32, serif,
`lang="en"`. `must / have to` fits at 288px; `mustn't / don't have to`
wraps to two lines. Let it wrap: shrinking the title to fit the longest
notation punishes every short one, and `text-wrap: balance` makes the
two-line case look intentional. **The `line` block is the only place a
family hue appears** (§5.3) — above the fold, the boundary's identity, the
most-seen non-text element in the app. **Practice is on the same page,
below the teaching**; App 1 learned this in `renderLessonEnd`, where
making the end of a lesson its own screen "would mean a tap to see two
buttons".

**State `open`** reorders to: back · family · notation · `line` · your
state · practice · one control, *Show the explanation*, expanding `why` /
`evidence` / `edges` in place. `line` stays above the fold in every state
— the one thing always worth re-reading, and it costs four seconds.
**State `closed`**: back · family · notation · `line` · `Closed on 14
March, after two clean passes.` · a quiet *Look at it again*. No trophy,
no badge, no colour change beyond the state word. A closed boundary is
finished business and the screen should be calm (§4.3).

### 3.4 Your state, without a percentage

Five named states, and the transition rule is App 1's, already written and
tested:

| State | Meaning |
| --- | --- |
| `unmet` | never practised |
| `open` | met, and wrong at least once since |
| `closing` | one clean pass; waiting on a second, on a different day |
| `closed` | two correct on two separate days since the last miss |
| `reopened` | closed, then missed again |

`js/storage.js` implements exactly this at the item level —
`MISTAKE_BOOK_GRADUATION = 2`, `dayKey()` for "separate days", and
`getMistakeBook()` deriving the whole thing from the attempt log with no
extra key. **App 2's boundary state is that rule one level up**, at the
boundary rather than the item, and it is the largest single piece of
engineering App 2 gets free.

**Rendered as a word and a date, never a bar.** A boundary carries four to
eight items; a percentage over four moves in steps of 25% and reads as
precision the data does not have `[≈]`. A word is honest at n = 1.
`reopened` is shown in those words — the one place App 2 displays
something that looks like regression, and hiding it would make `closed` a
lie. §4.2 handles the counting consequence.

---

## 4 · Progress, without a number that goes up

### 4.1 Why `43 of N closed` is not quite right

It is nearly right — finite, personal, honest, nothing like a streak.
Three problems, increasing in seriousness. **N moves**: the corpus grows
for the life of the product, so `43/104` in March is `43/140` in September
without the learner getting worse, and any ratio or bar built on N turns
corpus growth into apparent regression `[≈]`. **The denominator
discourages at the start**: Koo & Fishbach's small-area hypothesis —
already in this repository at `learner-model.md` §3.2 — found motivation
higher when attention is on whichever region is *smaller*, accumulated
progress early and remaining progress late, and `3 of 104` puts a
beginner's attention on 101. The goal-gradient work points the same way —
effort accelerates near a goal (Hull 1934; Kivetz, Urminsky & Zheng 2006),
and a pre-stamped loyalty card beats a blank one for identical remaining
effort `[S]`; read carefully that is not licence to fake a head start but
a warning that **a distant denominator is a demotivator.** And **`closed`
can fall**: a reopened boundary decrements it, and a number that can go
down is what `visual-longevity.md` §6 defines as the streak's mechanism.

### 4.2 What I propose instead

**Three state counts, a list, and one drawing. No ratio anywhere.** The
headline, on the gate and atop Boundaries, is a sentence of states:

> **31 met · 19 closed · 6 ready to look at again**

All three are states, not scores: each is true or false right now and
derived from what the learner did. **`met` only ever rises** —
`learner-model.md` §3.2's first fix, separate the monotone from the
non-monotone, applied. `closed` can fall by one, which is survivable
because it sits between two other numbers, is not the headline, and the
boundary that fell is *right there in the list* marked `reopened`. **A
number that falls with a visible, nameable cause is a fact; a number that
falls with no cause you can point at is a score** `[≈]` — that is the line
I would write into App 2's design system. And **N appears once, in prose,
on Boundaries, never in a ratio**: *"There are 104 boundaries here today,
and more are being written."* Honest about growth, and unreadable as "you
are 30% of the way to good English", which `31/104` will be.

Refused here, beyond everything `visual-longevity.md` §6 and
`practice-modes.md` §4 already refuse: **a completion percentage of the
corpus** (§4.1); **a projected finish date**, which is a target the learner
can miss, computed by the app, about the future — a streak with a
calendar; and **comparison to your own past rate**, a number that can fall
with no nameable cause, i.e. the line above, crossed.

### 4.3 At 3 closed, and at 90

**At 3** the risk is an empty vessel — 101 ghost rows waiting to be
filled, which is a wall, and a wall is discouraging in a way that reads as
boring (`visual-longevity.md` §5.8). So Boundaries lists **only what you
have met**, plus one row: *Find more* → the family list. The strip has
three marks and the rest of the row is *absent*, not outlined — no greyed
slots. The headline reads `4 met · 3 closed · 1 ready` and is entirely
true. Nothing says `3/104`.

**At 90** the risk inverts. Group by state in the queue's own order —
**ready · open · closing · closed** — so the top of the list is always the
actionable part, and **collapse the closed group to a count with a
disclosure**: `71 closed ›`. It is finished business and should get
quieter as it grows. That is the opposite of a trophy case, deliberately:
a trophy case is a reward display, and completion-contingent rewards are
the d = −0.36 contingency `practice-modes.md` §4 already refused. Within
closed, order by most recently closed — the learner is looking for
something they just did, not browsing an archive.

### 4.4 The one drawing, and why it is not a calendar

`visual-longevity.md` §5.2 recommends a history strip: one mark per day
for thirty days, height by session length. **It does not survive a year,
and the arithmetic is the reason** — 365 marks across 288px is 0.79px
each, below a device pixel at 1× `[≈]`. A day-strip is a six-week
instrument. The semantics fail before the arithmetic does: over six weeks
gaps read as absence, over a year they read as failure, and a calendar
with holes is a streak drawn sideways — exactly the artefact that document
warns will be described back to you as "my streak".

So **the strip's cells are boundaries in the order you closed them.** One
mark per closed boundary, so it grows with achievement rather than with
the calendar and has **no gaps by construction** — nothing in it can read
as failure. Reading order stays chronological, so it is still a record of
a year, measured in the units the app is about. Colour is at most a second
channel (`design-system.md` §1.5): a reopened boundary's mark is *hollow*,
not red, and its meaning is also in the list. It is built with
`createElementNS`, the way `js/icons.js` builds icons — no `innerHTML`, no
dependency, no new primitive. At 3 marks it is three marks and a lot of
space, which is honest; at 90 it is a paragraph-shaped block that could
not have been drawn on day one. **It is the only representation in the app
whose interest rises with time**, which is `visual-longevity.md` §4's
whole argument for why data-earned richness outranks ornament.

### 4.5 Sub-goals cost a taxonomy decision

Goal-gradient says the finish line motivates when it is near `[S]`. In a
104-boundary corpus growing to 200 it is never near, so the effect never
fires — unless there is an intermediate finite unit. Use the **family**: a
named group of 8–16 boundaries a learner would recognise as a thing about
themselves. *Modals. Articles and quantifiers. Tense and aspect.
Prepositions. Word choice.* Not "Tier 2" — `visual-longevity.md`'s
parked-lever finding was that the owner looked at difficulty tiers and
felt nothing, and that finding is about difficulty labels, not about
grouping. "I'm bad with articles" is a sentence people say; "I'm at the
compound-structures tier" is not.

Display follows Koo & Fishbach: accumulated progress early, remaining
late, flipping at the halfway point — `3 closed in Modals` becomes `4 left
in Modals`. A display rule, not a model, and one `if`.

**The cost, named.** A five-family taxonomy is a taxonomy decision, and
this project's rule is that a category rename moves questions, manifest
and content together or not at all. Fix the families before the first
boundary is authored, as `docs/agents/README.md` has the supervisor fix
the category taxonomy first. Five is also the number the colour arithmetic
permits (§5.3) — a happy constraint, but a constraint: a sixth family
costs the hue axis.

---

## 5 · Visual longevity, with the premise restored

### 5.1 What causes the fatigue, re-derived at 365 arrivals

The mechanism does not change. Consistency makes the interface fluent;
fluency is hedonically marked, so it is experienced as beauty; and fluency
is what stops a thing being attended to. Anything buying freshness by
making the interface less fluent spends the asset to pay the interest
(`visual-longevity.md` §1, on processing fluency and the CHI 2023
partialling, r ≈ .79 → .34 `[S]`).

What changes at a year is the **position on the curve**, and it changes
enough to alter the conclusion. Montoya et al.'s meta-analytic fit turns
over at roughly 37 exposures `[S]`. At six weeks App 1's arrival screen
sits near 60 — just past the turn, which is why that document could
sensibly ask how to delay it. **At a year App 2's gate sits at ~365: not
near the turn, but a long way down the far side, and no amount of
variation moves it back up.**

So the question changes from *how do we delay staleness* to *what is the
steady state after it*. Two findings answer it. **The edtech novelty curve
is a U, not a slide** — Rodrigues et al. (2022) found the ~4-week drop
followed by partial recovery as familiarisation set in `[S]`, so things
that survive the trough get liked *for being familiar*. And **change
aversion is the price of never reaching it**: redesigns produce a reliable
negative reaction whose named mechanism is mere exposure — users lose
familiarity and perceive the new experience as worse even where usability
is unchanged `[S]`. An app that refreshes its face annually pays that toll
annually and never banks the recovery. **So: do not spend the chrome.**
`visual-longevity.md` §4.1 got this right for the wrong horizon, and the
longer horizon makes it more true rather than less.

### 5.2 The levers, re-ranked

| # | Lever | App 1 verdict | App 2 verdict |
| --- | --- | --- | --- |
| 1 | Lesson shape follows the material | parked as a brief edit | **unparked, promoted to a schema constraint** (§3.2) |
| 2 | Richness earned from the record | parked (five days to the exam) | **unparked, and it is now the progress representation** (§4) |
| 3 | Accent per tier | parked — the owner felt nothing from tiers | **unparked, re-aimed at family** (§5.3) |
| 4 | Motion, tightly scoped | available | **unparked, with a technical correction** (§5.4) |
| 5 | One drawn mark per topic | borderline, ten drawings | **unparked as five, one per family** |
| 6 | Time or season | refused | **still refused, and weaker at a year** |
| 7 | Light theme | "none for this question" | **reframed: reach, not freshness — first or never** (§5.5) |
| 8 | Subtract | 2 hours, worth doing | **carried, aimed at the gate first** |

**Why 6 weakens rather than strengthens over a year.** The objections
stand — `theme-color` is one value and cannot follow a clock,
`manifest.webmanifest`'s `background_color` is fixed at install, the icons
are drawn against `#13100D`. What a year adds is that a slow seasonal
drift is by construction imperceptible: nobody notices a hue rotation
spread over three months, so the lever delivers nothing while breaking
three things that are hard to fix `[≈]`.

**And one lever a year makes available that six weeks did not:
progressive reduction.** The interface can legitimately get *simpler* as
the learner gets more fluent with it — the line under the gate's sentence,
the "what this is" copy on a first boundary screen, the hint explaining
`closing`: scaffolding for a learner who no longer needs it, each a row on
a surface seen 365 times. It is the only variation whose direction is
*toward* fluency rather than against it, which is why the fluency argument
does not veto it `[≈]`, and it is personalisation rather than
customisation — the app derives it, the learner chooses nothing, no new
state must be proved by `npm run color` — which is the class
`visual-longevity.md` §3.6 prefers. Rules, because it goes wrong easily:
it removes only **explanation**, never controls and never content; it is
keyed on sessions with that surface, not days elapsed; it is reversible
from Profile in one control, permanently; and it never removes anything
the learner has not demonstrably used. No controlled evidence `[?]` — it
rests on the fluency argument alone, and it is built last.

### 5.3 The accent hue, unparked and re-aimed

**Unpark it, and change what it is bound to.**

The arithmetic in `visual-longevity.md` §5.3 is the part of that document
I trust most — computed with `tools/color.mjs`, re-runnable. Holding the
accent's solved `L 0.800 / C 0.125` and rotating hue, the sRGB gamut plus
the hues owned by `--c-ok` (H150) and `--c-no` (H25) leave **148 usable
degrees in three arcs**, fitting five hues at a 35° minimum with
worst-case contrast 7.28 against the lightest surface where the
requirement is 3.0. Ten hues would sit 15° apart and be indistinguishable.
That arithmetic does not change; only the axis does.

It was parked because the owner grouped App 1's index by difficulty tier,
looked at it on his phone, and **felt nothing from the tier names**. That
kills the lever *as aimed at tiers* — an axis its own author cannot
perceive is not worth colouring. It says nothing about hue as a mechanism.

Three candidate axes. **State** (unmet / open / closing / closed) —
reject: state already has a word and a position, so hue would be a third
redundant channel on the one dimension that has two, and it sits
semantically adjacent to `--c-ok` / `--c-no`, which is the collision
`design-system.md` §1.4 exists to prevent. **Pack or tier** — reject, for
the reason above; a difficulty ordering is a claim `js/tiers.js` says in
its own comments it does not make. **Grammatical family** — take it. It is
the axis the audience statement predicts the learner thinks in:
*competence without labels* describes someone who says "I'm hopeless with
articles" and has never met the word *determiner*. It is content, not
difficulty, so it makes no claim about progression. And §4.5 needs it
anyway as the sub-goal unit, so the hue colours a structure the product
requires rather than one invented to be coloured.

The rule, into App 2's design system §1 **before any CSS**, carried
unchanged because it is what makes this an extension rather than a breach:

> A family hue is a **non-text identity mark**. It may tint a rule, a
> spine or a progress fill. It may never be a button fill, never be text,
> and never be the focus ring.

"One accent, one job" survives: the amber still owns the one filled action
per screen and the focus ring never moves. What varies is the *highlight*
role, on a dimension the data declares. And App 2 has a better target than
App 1's `.blank`: **the `line` block's 2px rule on the boundary screen**,
above the fold, the boundary's identity, the most-seen non-text element in
the app. Non-negotiable process, or this lever breaks the best thing about
the system: `tools/palette.mjs` gains all five with `need: { ui: 3.0 }`
**first**, and `npm run color` proves them in CI. A hue in the stylesheet
and not in the palette tool is not part of this system.

**What would still make it wrong.** Five hues at 35° may be four and a
duplicate on a real phone in daylight. That is a fact about a screen in a
hand and it has never been checked; `design-system.md` §11 says so and it
still applies.

### 5.4 Motion, and a correction to inherit

`@view-transition` is the best motion available, and App 2 navigates far
more than App 1 — gate → item → gate, twenty times a session. **But
`design-system.md` §5's line that it "needs no JavaScript" is only true
for cross-document navigation.** The at-rule drives MPA transitions
between real page loads; App 1's home is a hash router inside one
document, and same-document transitions need
`document.startViewTransition()`. `[?]` I could not verify current support
from here and it must be checked before being costed. If App 2 is likewise
one document with a hash router, the at-rule alone does nothing and the
transition is a JS call behind a `prefers-reduced-motion` guard and a
capability check. Everything else stands: nothing animates on answering,
nothing animates height, and reduced motion stays an opt-in so the safe
version is the fallback.

### 5.5 The light theme stops being a freshness question

`visual-longevity.md` ranked it last and was right to: a theme is chosen
once and restarts nobody's curve. **At App 2 the question is not freshness
and the answer changes.** Three things differ. The audience is worldwide
rather than five friends who study at night, so the owner's preference
stops being evidence about users. The use is sustained reading of small
text over a year, and NN/g's review of the Piepenbrock studies found light
mode won on visual acuity and proofreading for young and older adults
alike, the gap widening as type got smaller, while participants reported
no difference and performed worse `[S]` — already cited at
`design-system.md` §11.5. And the only credible preference figure is
NN/g's rough thirds `[S]`, meaning dark-only serves one third well.

**The cost is a fraction of the retrofit estimate if it is done first.**
That document's 25–40 hours assumes re-solving every token, doubling
`tools/palette.mjs`, re-deriving `prefers-contrast` and `forced-colors`,
re-examining the amber's dark-ink-on-fill argument, three HTML files, the
icons, and the full sweep twice. In a codebase with **no component rules
yet**, most of that collapses into choosing the palette at all: the second
`SPEC` is written alongside the first, and the doubled sweep is over a
much smaller app. **12–18 hours at v0.1 against 25–40 at v0.5** `[≈]` — my
estimate, not measured. So: **App 2 ships `color-scheme: light dark` from
v0.1, or never.**

That is one of two places this document argues against a principle rather
than extending it. The other: **the language rule does not transfer
intact.** "Serif is English, sans is Turkish" does real work in App 1 —
the typeface says which language you are looking at before you read. In an
English-only app that distinction has nothing to distinguish. **Do not
delete the pairing; re-aim it.** Serif now means *the language under
examination* — notations, minimal pairs, cloze stems, options — and sans
means *the app talking about it*. Same two faces, same superfamily
argument, same payload, one sentence rewritten. Getting this wrong in
either direction — dropping the serif, or keeping a rule about Turkish in
an app with no Turkish — is the kind of thing that survives three
redesigns unnoticed.

### 5.6 Where the boredom will be, counted in advance

`visual-longevity.md` §2.1's method was the useful part: count exposures
per surface and ask whether the content changes. At one session a day for
a year:

| Surface | Exposures / year | Content changes? |
| --- | --- | --- |
| **The gate** | **~365** | **yes — sentence, counts and strip all move** |
| Item frame | ~2,200 | yes, completely, every time |
| Feedback block | ~2,200 | two states |
| Boundary screen, `open` | ~700 | yes, per boundary |
| Boundaries list | ~100 | slowly |
| Boundary screen, `unmet` | ~100 | yes, and each is new |
| Profile | ~10 | numerically |

The gate is the highest-exposure repeating surface and, unlike App 1's
Eğitim index, it is **not static** — sentence, counts and strip all derive
from the record. That is the design working: the surface seen every day is
the one drawing what the learner did. It is also why lever 8, *subtract*,
applies to it first. Run `npm run audit` against the gate as a density
report rather than a conformance one, and be suspicious of anything on it
that is not the sentence, the button and the strip.

---

## 6 · What the core forces

The ~1,990 reusable lines are not neutral: they make some things free and
some things a three-file change.

**Free, and to be used as-is.** `dom.js`'s six builders, from which every
screen in §3 is constructible — and `appendBlanked`'s "every blank is the
same width on purpose, sizing it to the answer would leak the answer" is a
content-security decision, not a style one. `quiz-engine.js`, pure.
`storage.js`'s **derive-don't-store** pattern, which is what §3.4 rests
on, plus its lattice merge: attempts union, progress takes the further of
two, the device in your hand wins on name and preference — two devices, no
backend, no conflict UI. `icons.js`'s numeric contract, and
`createElementNS` as the way to draw §4.4's strip. `modal.js`, for reset
confirmation. `shell.js`'s one persistent live region and `announce()`,
both of which App 2 would otherwise get wrong. The tokens, the type scale
and `--h-nav` / `--h-target`. And `tools/`, whole — including
`verify-ui.mjs`, whose walk becomes **gate → item → feedback → gate →
Boundaries → boundary → Profile**: two hours to rewrite, with the ~430
checks, the overflow detection, the 44px audit and the console-error trap
all transferring.

**What the core cannot do, and what each costs.**

1. **A second inline markup marker.** `appendInline` supports exactly
   `**bold**`. §3.2's `why` blocks will want a second style — `V3`, or a
   form quoted mid-sentence in the serif. Adding one is a schema +
   validator + renderer change, which by this project's rule move together
   or not at all. **~3 hours, and a permanent widening of the content
   surface.** I would not add one, and would let `line` carry every form
   needing distinct setting — but the pressure will come, and the decision
   should be made once rather than by whoever hits it first.
2. **Derived state does not stay free.** `getItemStats()` walks the whole
   attempt history per call, and `js/home.js` calls `getMistakeBook()`
   twice in one render. Over six weeks that is nothing. Over a year at ~6
   items a day, history holds ~2,200 question records — order of 150–200
   KB of JSON `[≈]` — parsed and walked synchronously on the main thread
   against a ≤50 ms longest-task budget and a 150 ms INP target
   (`design-system.md` §9.2). It will not fail in year one and it will
   fail. The fix is cheap designed now and expensive retrofitted: keep the
   log as the single source of truth, memoise a projection keyed on the
   log's length, and **never merge the projection** — a restored backup
   merges logs and recomputes. That last clause is the whole trick.
   **~1 day plus tests, and a comment saying why the cache is not merged.**
3. **There is no scheduler.** §1.5's readiness rule needs a new pure
   module of maybe 80–150 lines, `boundary-state.js`, beside
   `quiz-engine.js` and tested the same way. **6–10 hours, and the
   highest-value new code in App 2.**
4. **Notifications cannot be computed while the app is closed.**
   `vision.md` settles that they come from the store wrapper; nothing in
   the core reaches them. Noted so nobody designs a web-push flow.
5. **Same-document view transitions need JavaScript** (§5.4).
6. **`listbox.js` may have no user.** It exists because App 1 asks "how
   many questions?" in three places; App 2 asks nobody, because the queue
   decides. Shipping 235 lines and a full combobox accessibility contract
   for zero controls is dead weight — **copy it when the first control
   needs it.** Same for `tiers.js`, which families replace.
7. **A light theme doubles the measured surface** — a second `SPEC` in
   `palette.mjs`, and the 320/390/768/1280 sweep run twice, because
   conformance is per responsive variation. Not paperwork; the
   requirement. §5.5 argues it is worth it and much cheaper first.

---

## 7 · What I would build, in order

1. **Fix the family taxonomy.** Five families, content-named, before a
   single boundary is authored. It is the sub-goal unit (§4.5), the hue
   axis (§5.3) and the library's grouping, and the one thing that cannot
   be renamed later without moving content, items and progress together.
2. **Write design system §1 with the light palette in it** — both `SPEC`s
   in `palette.mjs`, both proved by `npm run color`, before any component
   rule exists (§5.5).
3. **`boundary-state.js`** — the five states and the readiness rule, pure
   and tested. Nothing renders until this is right.
4. **The gate and the item screen** — §1's whole loop, one-sentence gate,
   no results screen.
5. **The boundary schema and its validator check**, including the
   block-signature check (§3.2).
6. **The boundary screen in its three states** (§3.3).
7. **Boundaries, with the state counts and the strip** (§4).
8. Then the family hue, the five drawn marks, the view transition and
   progressive reduction — in that order, each after the sweep.

The first three are not screens, and that is the point. `vision.md` §5
warns that anyone planning App 2 as "App 1 minus the exam" under-costs it
by about three; the UI version of that trap is planning it as screens when
the taxonomy, the palette and the state machine are what decide what the
screens can be.

---

## 8 · What I could not verify

WebFetch and curl are unavailable here, so every external claim reaches me
through a search-index summary.

- **The microlearning numbers** (d = 0.74, SMD 1.43, 62% vs 23% at 30
  days) — implausible for a format manipulation, several tracing to vendor
  blogs. **Nothing in §1 rests on them**; §1 rests on distributed practice
  and retrieval practice, which are old, large and uncontested.
- **The 2025 Zeigarnik / Ovsiankina meta-analysis** — the direction ("no
  memory advantage, but resumption is robust") is reported consistently
  and is the half I lean on; the ~two-thirds rate is a summary figure.
- **Kivetz, Urminsky & Zheng (2006)** and endowed progress — direction
  only. **Lally et al. (2010)** — 18–254 days, median 66, consistently
  reported, including that 66 is the median of a modelled
  95%-of-asymptote figure rather than a switch-on point.
- **The SDT meta-analysis over 443,000 participants (2024)** — I could not
  identify the paper; used only to say the triad is well supported.
  **The CAT stopping rules** (8.5 items mean; 4–6 for a depression
  screener) are from other domains, and argue only that a 20-item
  diagnostic is generous, not what one should be.
- **Change aversion** — almost entirely practitioner literature. The
  mechanism (mere exposure) is well supported; "usually temporary" is not.
- Everything `visual-longevity.md` §8 lists is still unverified — the
  Montoya coefficients, the CHI 2023 fluency partialling, the
  seductive-details effect sizes.

**Computed here, re-runnable:** the shell heights (56 / 60 / 68px) and the
452px fold budget at 320×568, from `css/style.css`; the 288px column; the
history-size arithmetic in §6; the strip's per-mark widths at 3 and 90
marks. The 148-degree hue arc and the five-hue table are
`visual-longevity.md`'s, computed with `tools/color.mjs`, and unchanged by
re-aiming the axis. **Nothing has been looked at on a device**: five
hues at 35° may be four and a duplicate in daylight, the light palette
does not exist, and §3.3's claim about a wrapped two-line notation is a
claim about `text-wrap: balance` on a real screen.

**The one question I would put to the owner before anything is built.**
§5.3 rests on grammatical family being a category the learner thinks in —
the same five-minute test `visual-longevity.md` §7 proposed for tiers,
which tiers failed. It is free to answer: **ask two people who learned
English from series and games to describe what they are bad at, and see
whether the answer is a family name.** If it is "articles" and
"prepositions", the family is real and §4.5 and §5.3 both stand. If it is
"I don't know, just… bits", then families are an authoring convenience the
learner never sees, the hue is decoration with a spreadsheet behind it,
and §4.5 needs a different sub-goal unit before §5.3 can be reopened.
