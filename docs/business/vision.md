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
| Reading passages | 21 points, the largest section. A supply rather than a project: each passage is single-use, so six to ten of them is the realistic first stock | 2.5–3.5 h **per passage** |
| The quality debt | §4. The gate on everything after this row | ~28 h, shareable |

**What that adds up to.** Paragraph completion at ~2 h an item is
roughly 48 hours for 24 items; reading at 2.5–3.5 h a passage is 25–35
hours for a first stock of ten. **Finishing App 1 is on the order of 75
to 90 hours of review, plus the cold-solve debt on whatever is sold.**
That is a real number and it is the price of the cleaner claim — and it
is the reason App 1 finishing matters more than App 2 starting early.

**v0.5 — reading.** Moved *into* App 1 by the owner on 2026-09-06:
*"listening hariç tüm özellikler tamamlanır."* This supersedes the v1.0
definition accepted on 2026-09-04, which had put reading outside v1
because a passage costs 2.5–3.5 hours of review and is single-use.

That reasoning was not wrong; the decision overrides it, and the
arithmetic is what makes the override attractive. Reading is **21 of
Session I's 60 points** — the largest single section, larger than the
cloze and the restatement together. With it in, App 1 practises **all
four sections of Session I**, and what it does not cover is exactly one
thing that is a separate sitting: listening.

| Section | Items | Points |
|---|---|---|
| Cloze | 10 | 15 |
| Closest meaning | 10 | 15 |
| Reading — two texts | 14 | **21** |
| Paragraph completion | 6 | 9 |
| **Session I** | **40** | **60** |
| Session II — listening, a separate paper | — | 20, and out |

**v1.0 — the whole of Session I.** The definition becomes simpler and
much stronger than the one it replaces: *every section of the paper this
app can practise at all is practisable with reviewed content, and the app
never tells a learner something it cannot support.* Not "39 of 60" — **60
of 60 of Session I**, with listening named as the one thing that is
elsewhere. `x` still moves from 0 to 1 only when the owner says so.

**v1.1 — the mock.** Cloze, restatement, reading and paragraph
completion at exam scale, under time. It comes after v1.0 because it
needs all four sections to exist before it can be honest.

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

1. **Done exists, and it is countable — of the corpus, not of the
   language.** This precision is not pedantry; `docs/app2/boundaries.md`
   §6 found that the denominator does not exist as a property of English
   at all. Murphy is 145 units, that arm's own inventory is 110, App 1
   is 60 categories — and Swan is 600+ entries while Cambridge's English
   Grammar Profile enumerates 1,200+ competences. The gap is pure
   resolution. So the honest sentence is *"there are N boundaries in
   this app and you have closed 43"*, never *"there are N boundaries in
   English"*. The first is finite, personal and true; the second is a
   claim nobody can make. Everything else about the unit survives that
   correction, and a product whose whole pitch is honesty had better
   make it out loud.
2. **The unit is smaller than a topic**, so supply can grow one boundary
   at a time and the product is never half-built.
3. **It matches what the learner would say about themselves.** Nobody
   says "I am B2". They say "I never know which one of these two to
   use."

**But *"43 of N"* is the wrong way to draw it**, and
`docs/app2/system-and-ui.md` §4 took my proposal apart on three counts:
N moves as the corpus grows, a distant denominator demotivates rather
than motivates, and `closed` can fall again — a counter that goes down
reads as punishment. What replaces it is three state counts, a list that
is its own picture, and one drawing whose cells are **boundaries in the
order they were closed**. Never days: a day strip is arithmetically dead
at 365 marks in 288 pixels, and semantically it is a streak wearing
different clothes.

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

### The audience is global, and that does not cost what the research said

**Decided by the owner, 2026-09-06: App 2 teaches English to learners
worldwide, not to Turkish speakers.** This looks like it collides with
`two-apps.md` §5.3, which is the most-cited finding in this directory:
51 of 60 lessons argue against Turkish, translating them is re-authoring
rather than translation, ~45–60 hours per language, so *each language is
a co-author and localisation is a hiring decision.*

**That finding is right about translation and wrong about necessity,
because it assumed the learner's own language is the medium.** That is
the Duolingo assumption, and it is correct for Duolingo: it teaches
beginners, and a beginner needs their L1.

This app's audience is defined as the opposite. *Competence without
labels* — someone who already speaks English, picked it up from series
and games, and is missing the scaffolding. **That learner can read an
explanation in English.** Reading it is itself practice. So the
localisation problem does not get solved cheaply; **it does not arise.**

What the L1 contrast actually contributed, separated out:

| | L1-dependent? | Travels to a global App 2 |
|---|---|---|
| The boundary taxonomy — *must / have to*, *few / a few* | No, it is about English | **Whole** |
| The item bank | Barely — 21 of 241 items mention Turkish | **~90%** |
| The diagnostic and the weakness measurement | No | **Whole** |
| The explanation prose | **Yes** — ~37,000 words framed as *"Türkçede…"* | **Re-authored once, in English** |

So the cost of going global is **one re-authoring pass of the
explanations, in English** — on the order of the 45–60 hours §5.3 costed
per language, but paid once rather than per language, and by the owner
rather than by a hire.

**And the deeper point is that going global improves the method rather
than diluting it.** The L1 contrast was a *shortcut*: knowing the
learner is Turkish let the app **predict** which boundaries they smear.
Strip the known L1 and the app has to **measure** instead — which is the
diagnostic, which is already the wedge from §3, and which is *better
information than a prediction from somebody's passport*. A Turkish
speaker who learned English from games does not smear the same
boundaries as one who learned it in a classroom, and the L1 model cannot
tell them apart. The empirical model can.

That is also what makes the product defensible against a chat box. "Here
is an explanation of *must* versus *have to*" is free everywhere. "Here
are the eleven boundaries **your** answers show you conflate, and here is
your state on each" is not, and it needs a corpus with a taxonomy behind
it.

**Where this could be wrong.** If the real audience turns out to be
lower-level than "already functions in English", English-medium
explanations fail and the L1 problem comes straight back. That is a
question the v0.1 diagnostic answers cheaply and early — which is another
reason it is the first thing built.

### What a longer life and a wider audience actually change

The owner's framing — App 2 is born inside App 1 and then evolves
somewhere very different, because it teaches a broader audience over a
much longer period, so the system and the UI change — is not a
concession. It is a design brief, and it names two variables that each
break something App 1 gets for free.

**Duration: six weeks becomes a year.**

- **The exam supplies the reason to return.** App 1 never has to answer
  "why open this tomorrow"; the calendar answers it. App 2 must, and
  App 1 has explicitly refused streaks, notifications, timers and numbers
  that go up — a refusal that belongs to App 1's design, not to the
  project as a rule, and App 2 reopens exactly one of the four. The boundary model is the honest substitute,
  because *"four boundaries are ready to look at again"* is a *state*
  rather than a score: it can be true or false, it is derived from what
  the learner actually did, and unlike a streak it cannot be lost by
  going on holiday.
- **The session shape inverts.** Exam prep is long sittings under a
  deadline; year-long study is short and frequent. `docs/app2/system-and-ui.md`
  takes this further than "shorter sessions": it deletes the sitting and
  the results screen both, and replaces them with a **gate** — one
  sentence, one button, the record strip — that is simultaneously the
  start and the end of every session, in four states (queue ready,
  nothing due, everything closed, first run). The rule that makes it work
  is that **readiness is a property of a boundary, not of an item**,
  which is what stops an Anki-style backlog wall from ever forming.
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

### Notifications, and the test that decides which ones

**Decided in principle, 2026-09-06: App 2 may have notifications.** App 1
refused them and should keep refusing them — it has a calendar. App 2
does not, and a year-long product with no return mechanism dies quietly.

But "we refused streaks and now we allow notifications" is only coherent
if there is a line, so here is the one I would draw:

> **A notification is acceptable if what it says would still be true and
> useful even if the app had no interest in your returning.**

*"Four boundaries are ready to look at again"* passes: it is a fact about
the learner's own state, derived from what they actually did, and it is
worth knowing whether or not they open the app. *"Your streak is at
risk"* fails: it is only meaningful because the app created the stake it
now threatens. The first is a due-date; the second is a debt the app
invented and then called in.

The test has a practical consequence: the notification cannot be
designed before the scheduling model is, because you cannot say *"ready
to look at again"* without something that decides when. So notifications
arrive with the review model, at v0.5, and never as a growth feature
bolted on later.

**The research arm has landed** (`retention-and-pricing.md`) and it
changed two things.

**Notifications need no server.** Web push is the wrong instrument here:
on iOS a page has no `PushManager` at all until the learner installs it
to the Home Screen, and install rates are measured under 2% — so a push
design reaches perhaps one in twenty of the iOS audience, and there are
reports of subscription endpoints expiring on inactivity, which kills a
weekly reminder specifically. But *"N boundaries are ready"* is a fact
the device already knows. A push server would be this project's first
per-person record and its first data-protection duty, bought in exchange
for nothing. **Local notifications from the store wrapper that the paid
unlock already requires deliver the whole design with no backend and no
personal data.**

**And the test above is only the first of four axioms.** The arm's
correction is that *truth is not the test* — a streak is true. What the
other three add: the app must be **willing to send the message that
loses it the session**; every fact must come from a **rule visible to
the learner and never tuned against engagement**; and the **rate ceiling
is set before the first message is written**, not discovered later.

That produces three messages and no more. *N boundaries are ready.* *M
new boundaries shipped.* And the one that matters: **"You have closed
everything currently here. I will stop reminding you until there is
something new."** No engagement-optimised product would ever ship that
third message. It is the notification form of this product's central
claim — that you can finish — and if the notification layer cannot say
the claim out loud, the claim is marketing.

Defaults, from the same section: **off** unless turned on, the learner
picks the day and hour *before* the OS dialog is raised, the ask fires
after the first boundary is closed rather than in onboarding, and the
cap is stated permanently in settings as a promise the learner can
check.

**Where this could still be nothing.** At default-off, once a week,
soft-asked and deliberately unexciting, it is entirely possible nobody
enables it. That is cheap to find out and the honest response is to
delete the toggle rather than escalate it.

### Subscription, and the thing it collides with

**The owner's decision: a subscription at a reasonable price, whichever
form the market accepts.** Recorded, and the arm above is researching the
market half.

The half that is not a market question is a tension inside the product,
and it should be named before it is priced. **The boundary model gives
the learner a stopping rule.** When your boundaries are closed, you are
done — and that honesty is the entire content of the claim to be *more
respectable than Duolingo*. A subscription's economics want the opposite:
they want you not to finish.

There are only three honest ways out, and the dishonest fourth is the one
the category is full of:

1. **Let them finish and leave.** Price so that a three-to-six-month
   lifetime pays, and treat churn-on-completion as success rather than
   failure. This is the only option that keeps the claim intact.
2. **Grow the corpus so "done" recedes.** Legitimate — but it is exactly
   the standing cadence promise §4 warns about, at 6–8 minutes of his own
   attention per item, forever.
3. **One-time or lifetime**, which fits a finite product honestly and
   gives up recurring revenue.
4. ~~Design retention mechanics that prevent finishing.~~ This is what a
   streak is for. Taking it would cost the one thing that distinguishes
   the product.

**The research landed on (1) and (3) together, and the arithmetic behind
it is the part worth keeping.** At the honest ceiling of a few hundred
users, the spread between the best and the worst pricing model is around
$9,000 over two years, while the spread between 400 users and 100 is
around $16,000. **The model is therefore a values decision, not a
revenue one** — which means it should be chosen for what it says about
the product, and the thing to actually work on is whether anyone shows
up.

So: **an annual subscription plus a permanent lifetime tier, and no
monthly.** Lifetime is the right instrument rather than the risky one
here, because what it normally cannibalises — the learner who renews
forever — *does not exist by design* in a product built to be finished.
And the listing should say the corpus is finite, which is a strange
thing to advertise and the correct one.

**The pricing anchor changes too, and this is a correction to
`pricing.md` §4.3.** Its heuristic was "about one month of a local
Spotify". But Duolingo Super is roughly **$0.63–0.93 a month in Turkey
and India against $6.99 in the United States** — so the Spotify anchor
would price this app at four to five times the category leader in
exactly the markets its audience lives in. Per-storefront prices get set
by hand against **local Duolingo**, not against a global number
converted at the exchange rate.

### One decision that has a deadline

Everything else in this document can wait for App 1 to finish. This one
cannot, because it is only cheap before the first screen is built.

**The light theme.** App 1 committed to a single dark look on purpose and
that was right for it. For a global audience it is not a freshness lever
— it is a **reach requirement**, and `docs/app2/system-and-ui.md` §5
prices it at **12–18 hours if the tokens carry `light dark` from v0.1,
against 25–40 retrofitted afterwards.** So it is decided at v0.1 or it is
decided never, and deciding it by default is deciding never.

The same section unparks the per-tier accent hue, re-aimed. The owner
looked at App 1's grouped index and felt nothing — which kills *tiers*
as the axis, not *hue* as a mechanism. Grammatical family is the axis the
audience statement predicts a learner actually thinks in.

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

**v0.1 — the diagnostic, and nothing else.** ~20 items across the
boundaries, free, **in English**, no account, no store. It tests the
hypotheses everything else rests on: *does someone who does not know him
find this useful*, *is the audience actually high enough to be taught in
English*, and — added by `docs/app2/boundaries.md` §7 — **is the unit
even right**.

That third one has a designed test rather than a hope. The inventory
found that 16 of its 110 candidates are not contrasts at all but single
facts a learner simply does not know: articles, countability, agreement,
plural *-s*, dependent prepositions. Those are close to the largest
error categories every learner corpus reports, so **by item count the
boundary unit survives and by error mass it may not.** The defence — that
someone who acquired English from high-frequency input got those for
free and only lacks the labelled contrasts — is reasoning, not
measurement, and no error corpus of naturalistic acquirers appears to
exist to settle it.

**So v0.1 carries a few of those non-contrast items on purpose.** If
they fail at the same rate as the contrasts, the product's spine is
wrong and it is far better to learn that in twenty items than in sixty
boundaries.

**And the twenty items are two stages, not one list** —
`docs/app2/diagnostic.md` settled the shape with one number. Under the
obvious rule, *one wrong answer and the boundary is flagged*, a learner
who has mastered everything still collects two false flags, and **88% of
learners are told something untrue about themselves.** That is this
project's own honesty rule failing inside the feature meant to embody
it. So: **eleven screen items, base-rate weighted, one slot held
uniformly random — then up to three flagged boundaries confirmed at
three items each.** Simulated, that confirms one to two real boundaries
and misleads about one learner in fifty.

**The screen misses far more than it mis-claims, and that is the honest
part.** A uniform twenty-item screen recalls roughly a quarter of a
learner's real boundaries. There is no fixing that arithmetically, so
the app prints the denominator instead — *"looked at 14 of 60; these
families were never entered"* — which is both the honest disclosure and,
not by accident, the sentence that bridges to the paid product.

**One structural finding to design around rather than wait out:
calibration never arrives.** Roughly 600 takers are needed to calibrate
a 120-item pool to ±10 points, and this product's honest ceiling is
hundreds of users. The diagnostic therefore runs on **author priors for
its whole life** — so any design whose honesty depends on future
response data is never honest, and the priors have to be good enough on
day one.

Perhaps two weekends, because the engine exists — and because the item
pool already does too: 241 items over 60 categories is exactly the four
per boundary that the confirmation stage needs. What is missing is a
`prior` field, a `family` field, and the English re-authoring already
costed above.

**v0.2 — 20 boundaries.** The diagnostic now has somewhere to send
you. Explanations in English, written for someone who already speaks it:
the job is naming the boundary, never teaching the language.

**v0.5 — 60 boundaries, plus state.** The mistake book, the boundary
list, "43 of N closed". This is the first version that is a product
rather than a demo.

**v1.0 — the spine, which is nearer 60 than 100.** An earlier draft
said ~100. `docs/app2/boundaries.md` §5 cut its own 110 candidates
against *"is this worth it to someone who is not preparing for
anything"* and roughly 50 came out as exam or writing furniture —
*who/whom*, the formal connector inventory, *It is said that*, reduced
relatives. Reaching 100 would mean re-importing the exam product into
the app built to escape it. **The target is the ~60 that survive the
cut**, and a smaller honest spine is the point rather than a
compromise. Paid depth begins here, if at all.

**v2.0 — localised interface, not localised teaching.** With English as
the medium from v0.1, a "second language" is now a much smaller thing:
the UI strings and the marketing, so a learner can navigate in their own
language while still being taught in English. That is one or two evenings
per language plus a translator, not a co-author. **The teaching stays in
English** — and if it ever should not, that is a new product decision,
not a translation ticket.

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
