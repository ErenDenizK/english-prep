# Closing a boundary, and being allowed to stop

The scheduling and mastery model for App 2 — a product used for a year
rather than for six weeks, whose central claim is that a learner can
finish.

Research arm, 2026-09-06. Written against `vision.md` §3,
`retention-and-pricing.md` §B, and the graduation rule already shipped in
`js/storage.js`.

---

## 0 · What this is, and what it inherits

Four things are settled before this document starts. **The unit is a
boundary, not a flashcard** — a pair the learner's ear conflates (*must /
have to*, *few / a few*, *since / for*), taught by contrast, tested by
several interchangeable items. **Progress is "boundaries closed"**, and
the learner can finish. **No streaks, no timers, no score that only goes
up.** And **a crude graduation rule already exists**: an item leaves the
mistake book after two correct answers on two separate days, and a wrong
answer clears the count (`js/storage.js:224`) — designed for a six-week
exam run.

Two documents here already did half the work. `learner-model.md` §2.3
established that **the schedulable unit is the category, not the item**,
and §2.2 rejected SM-2, FSRS and BKT on data-volume grounds — both hold
at a year, and §5 adds a second, independent reason to reject them.
`retention-and-pricing.md` §B fixed the four notification axioms; §6.6 is
the exact rule those axioms need and do not contain.

**Markers.** `[S]` a claim from a search summary — abstracts and
secondary descriptions, not papers read in full, because WebFetch and
curl are blocked here. `[?]` unverified. `[≈]` my own reasoning or
arithmetic, reproducible from the constants given. The three numbers this
document leans on hardest — Cepeda's 5–10%, Bahrick's 56 days, Rawson's
criterion of 3 — are all `[S]` and should be read properly before code is
written against them.

---

## 1 · Spacing, when the unit is not a card

### 1.1 Established, versus popular

| Claim | Status |
| --- | --- |
| **Spacing beats massing, and the optimal gap grows with the retention interval.** Cepeda (2006), 254 studies, >14,000 observations; Cepeda (2008), >1,350 participants, gaps to 3.5 months, tests to a year: optimal gap **~20% of the test delay at weeks, ~5% at a year** | **Established** `[S]`. The only result in this literature that hands a scheduler a number, and the number §6 is built on |
| **Retrieval beats review**; repeated *testing* transfers better than repeated *studying*. Roediger & Karpicke (2006), Butler (2010) | **Established** `[S]` |
| **Spacing survives the jump from rote pairs to concepts.** Kornell & Bjork (2008): the benefit is "not confined to memory of exact repetitions, but also applies to … abstract a pattern from non-exact same-category repetitions and … use this pattern in a transfer test" | **Established** `[S]`, and §1.2 leans on it harder than on anything else |
| **It survives the jump to English tense contrasts specifically.** Bird (2010) taught *simple past / present perfect* and *present perfect / past perfect* — boundaries — at short and long intervals; distributed won at delay | **Established** `[S]`. But Rogers (2015) says ≥7 days, Suzuki (2017) says shorter, and the replication literature calls the optimum unsettled `[S]` |
| **Expanding intervals.** The most repeated claim in the SRS world | **Folklore.** Karpicke & Roediger (2007) found expanding beat equal spacing at 10 minutes and **equal spacing won at two days**, with and without feedback; placement of the *first* retrieval mattered more than the later ratios `[S]` |
| **Overlearning** — extra correct answers in one sitting | **Folklore.** Rohrer & Taylor (2006): 9 practice problems vs 3 in one session had **no effect** at 1 or 4 weeks, while splitting 10 across two sessions nearly doubled the 4-week score `[S]` |
| **SM-2's constants** | One person's 1987 tuning of his own collection, never independently validated `[S]`, and requiring a self-graded 0–5 quality this app cannot honestly collect |
| **Leitner's boxes** | The mechanism is well supported; the boxes have no meta-analysis behind them `[S]` |
| **FSRS** | State of the art on its own benchmark — 9,999 collections, ~350M reviews — which measures *calibration of a predicted recall probability*, not learning, and says so in its own limitations `[S]`. 21–34 parameters fitted per learner, needing ~1,000 reviews to beat the defaults |

Two of those rows do more work than the rest.

**The expanding-interval row is what makes §4 possible.** If equal
spacing is at least as good at delay, then **a flat terminal interval is
not a compromise the finishing condition forces on the model** — it is at
least as well supported as the doubling tail it replaces.

**The overlearning row sets where the budget goes.** A closing criterion
should count *sessions*, not correct answers inside one.

One number from practice, quoted as design precedent and not as evidence:
Anki's desired retention defaults to 0.90 and a card counts as "mature"
at an interval of **21 days** `[S]` — a community-calibrated guess at
where *learned* starts, and close to the number §6 derives from Cepeda.

### 1.2 The real question: can you schedule a boundary and draw a fresh item?

Every algorithm above schedules an *item*: an atomic cue–response pair
with its own forgetting curve. Here the thing learned is a contrast and
the items are interchangeable probes of it, so the question is whether
the spacing evidence survives substituting a different probe each time.

**It survives, and the better reading is that it is improved by it.**
Butler et al. (2017) is the direct test — retrieval practice with
*different examples* of a concept versus repeated retrieval of the *same*
example: "variability during retrieval practice produced superior
transfer of knowledge to new examples" `[S]`. Kornell & Bjork (2008) is
the same result from the induction side, and Butler (2010) has repeatedly
tested material transferring to *new questions* better than restudied
material `[S]`.

The mechanism spacing depends on — a retrieval attempt made after enough
delay to be effortful — is a property of the *attempt*, not of the
stimulus being byte-identical to last time. Nothing in Cepeda's design
requires the same cue; it uses one because its unit is a fact `[≈]`.

The converse is the strongest argument for boundary-level scheduling and
it is not a matter of taste: **item-level scheduling here optimises the
wrong latent variable.** After the second exposure, "can the learner
answer `soSuch-04`?" measures memory for that sentence, not command of
the contrast. `learner-model.md` §4.1 measured this in App 1 and called
it the most important thing on the page; at a year it stops being a
measurement problem and becomes a product one, because a learner who has
memorised the corpus and been told they closed 60 boundaries has been
lied to.

So: **schedule the boundary, draw fresh probes, and the evidence is on
your side.** The substitution is not a compromise forced by the content
model. It is the better instrument.

### 1.3 The one place substitution costs something

Birnbaum, Kornell, E. Bjork & R. Bjork (2013) tested *why* interleaving
helps induction and found, across three experiments, that **temporal
spacing was harmful when it interrupted the juxtaposition of interleaved
categories, even with total spacing held constant** `[S]`. The
discriminative-contrast account has since been contested for complex
perceptual categories `[S]` — a live hypothesis, not a law, but it points
at something a naive design gets wrong.

A boundary is *definitionally* a discrimination. If the app spreads a
boundary's probes uniformly across a session, so a *must* item and a
*have to* item are eleven questions apart, it has spaced away the
juxtaposition that makes the contrast visible.

**Consequence, and it shapes the session UI rather than the scheduler:**

> A visit is a **block** of that boundary's probes, adjacent. A session
> is four or five such blocks, from different boundaries, in sequence.
> Interleave *between* boundaries; juxtapose *within* one.

This contradicts "shuffle the whole pool", which is what `quiz-engine.js`
does today, and it is a cheap thing to get right at the start and an
annoying one to retrofit.

### 1.4 What the format costs, said once

The probe is a four-option cloze, and multiple-choice tests generally
produce **smaller** testing effects than cued recall `[S]`. Little,
E. Bjork, R. Bjork & Angello (2012) is the partial rescue: items whose
alternatives are *competitive and plausible* do produce retrieval-induced
learning, including on **related** questions, because the learner must
retrieve why each wrong option is wrong `[S]` — a finding that endorses a
rule this project already enforces for a different reason
(`question-author.md`). The rule is also what makes the format work at
all; and 13 cloze probes still do not prove what 13 production tasks
would `[≈]`.

---

## 2 · Mastery, and the right to say "closed"

### 2.1 What the existing rule is, and what it was for

Two correct answers on two separate days since the last wrong one; a
wrong answer clears the count. Per *item*, not per boundary.

It is a good rule for what it was built for, and it gets the two things
right that most such rules get wrong: **separate days**, so it cannot be
satisfied by re-reading the explanation and answering twice in a row, and
**derived from the event log** rather than stored, so it survives
export/import for free. Both properties are kept below.

It fails at a year in three ways `[≈]`. **Two is inside the noise** —
two correct four-option answers happen by chance 6.25% of the time, so
across a hundred boundaries that is six false graduations per pass, per
learner. **Two consecutive days is not spacing**: a learner can graduate
an item on Monday and Tuesday and never see it again, and nothing in
Cepeda supports a 1-day gap as evidence of anything that lasts a year.
And **the reset is too expensive** — clearing the count on one wrong
answer costs a full re-run for one slip, which at six weeks is two days
and at a year would be a month, while the savings literature (§3.2) says
a slip after mastery is not the same state as never having learned it.

### 2.2 What the criterion literature says

The best-supported part of this document, and it converges on a number.

**Rawson & Dunlosky's successive relearning programme** is the closest
thing to a direct answer: **practise to an initial criterion of 3 correct
recalls, then relearn to criterion in 3 further widely spaced sessions**
`[S]`. Vaughn & Rawson (2011) crossed initial criteria of 1–4 correct
recalls with 1–5 relearning sessions and found criterion **3** to be the
efficient point, with more retrievals in the initial session adding
nothing unless the material is unusually hard; that the effects of
criterion and of relearning are **subadditive**, so criterion matters a
lot without relearning and progressively less with it; that relearning
has "pronounced effects on long-term retention with a relatively minimal
cost in additional practice trials" — under 2 minutes per concept at the
first relearning, under 1 by the fifth; and that three relearning
sessions may be enough for maximal benefit `[S]`. Read with Rohrer &
Taylor's overlearning null `[S]`: **spend the budget on more sessions,
not on more correct answers per session.**

**Mastery learning** gives the other half — how strict the per-session
bar should be. Kulik, Kulik & Bangert-Drowns (1990): mastery programmes
work, d ≈ 0.6 for weaker students, ≈ 0.4 for stronger `[S]`; and, for a
threshold, **stringency changes the result, with the real gap between the
81–90% band and the 91–100% band rather than between 70% and 80%** `[S]`.
**Intelligent tutoring systems** landed in the same region independently:
Cognitive Tutor's knowledge-tracing threshold is P(known) ≥ 0.95, and a
2025 EDM paper argues 0.98 does better, **partly because 0.95 does not
account for forgetting** `[S]`.

### 2.3 What four items can and cannot decide

Criterion-referenced measurement is blunt about this. What matters for a
mastery decision is not coefficient alpha but **decision consistency** —
would the master/non-master classification replicate on a parallel form —
and high-stakes practice wants P₀ ≥ 0.90 `[S]`. Unreachable from four
four-option items, and the app should never pretend otherwise.

The arithmetic that binds, with *g* = 0.25 `[≈]`:

| Visit shape | Pass rule | P(pass) by pure guessing | P(pass) at true 0.85 |
| --- | --- | --- | --- |
| 4 probes | ≥3 correct | **5.1%** | 89.0% |
| 3 probes | ≥2 correct | **15.6%** | 93.9% |
| 3 probes | 3 correct | 1.6% | 61.4% |
| 2 probes | 2 correct | 6.3% | 72.3% |

No single visit decides anything. A sequence decides a great deal,
because the guess probabilities multiply and the competence probabilities
barely do:

| Closing sequence: 4(≥3) → 3(≥2) → 3(≥2) → 3(≥2) | Probability of closing on a clean run |
| --- | --- |
| Pure guessing (p = 0.25) | **0.019%** — about 1 in 5,200 |
| Partial command (p = 0.60) | 12.9% |
| p = 0.70 | 31.4% |
| Genuine command (p = 0.85) | **73.8%** |
| p = 0.90 | 87.0% |

That table is the whole argument for the threshold in §6, and the only
defensible way I know to set one: **not by choosing a percentage that
sounds like mastery, but by choosing a sequence whose false-positive rate
against a guesser is a number you can print.** One in five thousand is a
number the app can stand behind when it says "closed". Note the other
side of it: a learner with genuine 85% command still fails the run 26% of
the time and needs one more visit — the correct direction of error for a
product whose claim is that "closed" means something `[≈]`.

### 2.4 The threshold I would defend

> **A boundary is closed after four passing visits on four separate days,
> spanning at least 28 days, with the final gap at least 14 days.**

Every clause earns its place. **Four visits** is one initial plus three
relearnings, exactly Rawson & Dunlosky's prescription `[S]`. **A pass is
≥3 of 4 on the first visit, ≥2 of 3 thereafter** — the initial criterion
of 3 correct `[S]`, then a bar strict enough for a 1-in-5,200
false-positive rate and loose enough to forgive one slip. **Separate
days** is inherited from the existing rule, which got it right.

**Spanning ≥28 days with a final gap ≥14** is the clause that makes
"closed" mean something at a *year*, and it comes from Cepeda: at a
one-year retention horizon the optimal gap is ~5–10% of the interval,
i.e. 18–36 days `[S]`. A boundary whose last two demonstrations are 14
and 21 days apart has survived gaps of the right order of magnitude. One
demonstrated a day later has not.

### 2.5 Why not more

Because the marginal evidence is worth less than the marginal item. A
fifth visit moves the false-positive rate from 1 in 5,200 to 1 in 33,000
`[≈]` — an improvement in a number already far below the rate at which
the *content* is wrong. The blind pass and the solve log exist because
items have defects; `docs/content-review.md` found them. A scheduler
tuned to a precision the item bank cannot support is measuring its own
arithmetic. And the overpractice literature says the fifth visit does not
buy retention either `[S]`. The honest place to spend it is on a boundary
that is still open.

---

## 3 · Forgetting, and re-opening

### 3.1 Re-opening must be measured, never assumed

There is an obvious cheap design: assume decay, and re-open a boundary
when a modelled recall probability crosses a threshold. It is what FSRS
does, and here it is exactly wrong `[≈]`, because it fails axiom 3 of
`retention-and-pricing.md` §B — *every fact a notification reports must
come from a rule visible to the learner that the app does not tune
against engagement.* A modelled decay curve manufactures the due-date;
this is §B.2's "the fact can be manufactured, and then truth is free" in
its purest form — an app deciding on its own authority that you have
probably forgotten something, then reporting that decision as news about
you.

**A boundary re-opens when the learner gets it wrong. Not before.**

Which means the app must actually ask, which means there must be a finite
number of confirmations after closing, which is §4.

### 3.2 What re-test intervals for mastered material are worth

Thinner evidence than for initial learning, and worth saying so.

**Bahrick's spacing programme is the one long study.** Bahrick × 4
(1993): four subjects, 300 word pairs, 13 or 26 relearning sessions at
intervals of **14, 28 or 56 days**, retention tested 1–5 years after
training stopped — and the 56-day schedule was best `[S]`. The earlier
8-year study found inter-session spacing an excellent predictor of
reaching "permastore", with optimum recall for words "accessed at
intervals of 30 days" `[S]`. And the 50-year study gives the shape of the
tail: school Spanish declined exponentially for 3–6 years, then **stayed
unchanged for up to 30 years** before a final decline `[S]`.
Well-consolidated material does not decay smoothly forever; it falls,
plateaus, and stays.

**The applied literature on refresher intervals is honest and
unhelpful.** CPR skill retention: skills decay within weeks to months,
annual retraining is ineffective, brief retraining every 1–6 months beats
less frequent refreshers — and "the optimum training frequency has not
been determined" `[S]`. Cited only because it is the field that has spent
the most money failing to answer this exact question `[≈]`.

**And the savings effect is what changes the design.** Forgotten material
is relearned faster than new material is learned, and savings detect
traces too weak to show on recall `[S]`; Rawson's relearning sessions
cost under a minute per concept `[S]`.

The consequence is the load-bearing argument of §4 and it is worth
stating on its own line:

> **Being wrong about when to stop is cheap.** A boundary that quietly
> re-opens after the app stopped watching costs one failed probe and a
> re-run that is faster than the original. An app that never stops costs
> the learner a permanent obligation and costs the product its central
> claim.

### 3.3 The honest presentation of "this came back"

Three rules `[≈]`:

**Never frame it as a loss.** The learner did not lose anything; the app
asked, and the answer was no. Copy: *"since / for came back open."* Not
*"you've forgotten since / for"*, and never a count of boundaries lost.

**Say why, with the evidence.** A re-opened boundary shows the probe that
failed, and the date. Axiom 3 made visible: the learner can check the
rule against their own history. It is also the only defence when the app
is wrong, which §6.5 says happens about 3% of the time per confirmation.

**The counter must move both ways, visibly.** "43 of 112 closed" going to
42 is the honest form. A counter that only ever rises is a streak with
better manners — §B.2's "score with extra steps". Refusing streaks and
then shipping a monotone counter would be the same mistake wearing this
project's own vocabulary.

---

## 4 · The finishing condition

The part that matters most, and where the literature runs out and a
values decision starts.

### 4.1 The problem, stated exactly

Every scheduler in §1 has an infinite tail: intervals grow, the card is
never done, "mastered" is a display state rather than a terminal one —
Anki's maximum interval defaults to decades `[S]`. Coherent for a
lifetime flashcard collection; incompatible with a product whose claim is
that you can finish. And the tail cannot be truncated by fiat, because
memory does decay and the app would be lying.

### 4.2 Three facts that reconcile it

**One: a flat terminal interval is well supported.** Karpicke & Roediger
found equally spaced retrieval beat expanding retrieval at delay `[S]`,
so the model need not choose between honesty and an ever-growing
interval. **Two: consolidated material plateaus** — Bahrick's permastore
`[S]`, and boundary knowledge is more re-derivable than an arbitrary
paired associate, being a rule with a lesson behind it (a learner who has
"forgotten" *few / a few* has usually not lost it but stopped noticing
the trigger). Both point the same way: the decay the app would be
modelling in year two is smaller than its own measurement error `[≈]`.
**Three: being wrong is cheap** (§3.2, savings).

Together they license a terminal state — a **finite tail of exactly two
confirmations, then silence**:

| Phase | Meaning | Scheduled? |
| --- | --- | --- |
| **Not started** | never met | no |
| **Open** | met, not yet closed | yes, on the ladder |
| **Closed** | four passing visits over ≥28 days | two confirmations only |
| **Sealed** | both confirmations passed | **never again** |

Confirmations at **+60 days** and **+180 days** after closing. A sealed
boundary is one the app has confirmed six times across roughly nine
months, and has then decided to stop asking about.

Why those two numbers `[≈]`: +60 sits at the top of Bahrick's tested band
(14/28/**56** days, longest best) `[S]` and just past Cepeda's 18–36-day
optimum for a one-year horizon — deliberately past it, because a
*confirmation* is a measurement rather than a learning event and a longer
gap is a stronger test. The second is one sample from the far side of the
first year, where Bahrick's curve is still falling before it plateaus
`[S]`. Both are guesses inside an evidenced range and I would not defend
either to the day.

### 4.3 What the app does for the learner who finished and comes back

Everything closed, three months away, and the door opens again.

**What it must not do**: silently re-open a pile of boundaries on a decay
model and present a backlog. That is the manufactured fact of §B.2, and
the worst possible first screen for someone returning — the product's one
promise was that they had finished, and the app's first act takes it
back.

**Instead, an offered spot-check, never an imposed one:**

> **You closed 112 boundaries. 41 of them you have not seen in over 90
> days.**
> *Check a sample of 12 →* / *No thanks*

Twelve probes, one each from twelve boundaries chosen
least-recently-confirmed-first. Any boundary whose probe fails re-opens,
with the probe shown; the rest stay sealed and the app says so —
*"The other 29 were not checked."* Sampling twelve tells you about
twelve, and a product that spent this much effort on not lying should not
start now `[≈]`.

**The spot-check is learner-initiated and never notified.** It is on the
screen when they arrive; it does not chase them. A "come back and
re-check" push would be the streak in its final disguise — a debt the app
invented while nobody was there. It is also the honest answer to a
subscription's problem (`vision.md` §3): a returning learner has a real,
bounded thing to do, whether or not they are paying `[≈]`.

### 4.4 The message the model exists to make possible

*"You have closed everything currently here. I will stop reminding you
until there is something new."*

The model above is what makes that sentence *true* rather than a
marketing line, and the truth condition is precise: every boundary is
Closed or Sealed, no confirmation is due, and the notification scheduler
has nothing to fire. §6.6 gives the code path. §B's axiom 2 says a
stranger reading the source should be able to find the branch that sends
nothing — in this model it is the `dueCount === 0` branch, and it is
three lines.

---

## 5 · What it costs to compute and store

### 5.1 The rule that makes cross-device merge work

`js/backup.js` merges histories by attempt date, first-writer-wins, then
sorts. It is order-independent and lossless because **it merges an
append-only log, and every derived fact is recomputed from that log**.
`getMistakeBook` is a fold over the log — which is why the mistake book
survives a restore with nothing to migrate, and why `learner-model.md`
§1.2 states the rule as *never persist a number you cannot recompute.*
That is not a stylistic preference. It **rules out every stateful
scheduler by a second, independent argument**:

> SM-2's `EF`, FSRS's `(S, D)`, and even a Leitner box index are *mutable
> per-item state*. Merging two devices' copies has no correct answer.
> `max` is wrong — the device where the learner failed should pull the
> interval down. `min` is wrong — a later pass should count. Last-writer-
> wins discards a real session. There is no rule that is both
> order-independent and lossless, because the state is a summary of an
> ordering that the summary has thrown away `[≈]`.

So even if `learner-model.md` §2.2's data-volume argument were wrong, and
even if App 2 someday had thousands of reviews per boundary, FSRS would
still break the one feature that makes a no-account app usable on two
devices. **The model must be a pure fold over the event log, replayed in
timestamp order** — and everything in §6 is written to that constraint.

### 5.2 Two things the fold needs that the current log does not have

**A pass is a day-level fact, so group by day.** A visit is all probes of
one boundary answered on one local day. Two devices used on the same day
then contribute probes to the *same* visit — six probes, one decision —
which is deterministic, order-independent, and better than two
half-visits `[≈]`.

**Store the local day key in the event; do not recompute it.** A live
defect in the existing code, not a hypothetical: `dayKey`
(`js/storage.js:201`) derives the calendar day from the timestamp *in the
reader's current timezone*. Restore a backup in another timezone, or
travel, and answers shift across a day boundary — silently changing a
graduation count, in either direction, with no way to notice. A recorded
`day` string costs 10 characters and makes replay timezone-stable `[≈]`.

### 5.3 The arithmetic, and what it costs

Everything in §6 is integer comparison and small-array counting. Per
boundary: group its events by day, decide each day's pass/fail by
counting, walk the resulting `(day, pass)` sequence through the ladder.
No exponentials, no optimisation pass, no fitted parameters, no floating
point that matters. Cost, on `learner-model.md` §1.3's measured event
sizes `[≈]`:

| | |
| --- | --- |
| Events in a year of daily 5-minute use (12 items/day) | ~4,400 |
| Event log at 22 chars/tuple | ~97 KB chars, ~190 KiB as UTF-16 |
| Against the smallest `localStorage` quota (5 MiB, Safari) | **~4%** |
| Full replay: one pass, grouping and a ladder walk | O(n), single-digit milliseconds `[?]` |

The replay result is memoised in memory per screen entry, keyed by
`(event count, last event day)`, and **never written to storage as
truth**; if cached to storage at all, it carries the log length it was
computed from and is discarded when that does not match. At ~100
boundaries the derived state is ~100 rows of five small fields, under
10 KiB `[≈]`. **Nothing in this model is a storage problem.**

### 5.4 Inspectability

Axiom 3 requires the rule to be visible to the learner, which is cheap
here and worth spending: a boundary's detail screen lists its visits —
date, probes, result — and the next due date with the interval that
produced it; the ladder is printed as a table *in the app*; the
spot-check names its sample size and what it did not check. A model made
of six integers and a table of intervals can be shown to a learner. One
made of 34 fitted parameters cannot, and choosing between them is partly
choosing whether the app may keep secrets about the learner from the
learner `[≈]`.

---

## 6 · The recommended model

### 6.1 State per boundary — all of it derived

```
{
  phase:     "new" | "open" | "closed" | "sealed" | "resting",
  level:     0..3,          // index into the ladder, open phase only
  visits:    [ {day, n, k, pass} … ],   // one row per day visited
  lastDay:   <day key>,
  dueDay:    <day key>,     // lastDay + LADDER[level]
  closedOn:  <day key> | null,
  confirms:  0 | 1 | 2,
  fails:     <consecutive failed visits>
}
```

Not stored. Computed by `reviewState(events, boundaryId)` — a pure
function in a module alongside `quiz-engine.js`, unit-tested the same
way, replaceable wholesale without migrating anyone.

### 6.2 The ladder

| Level | Interval to next visit | Where it comes from |
| --- | --- | --- |
| 0 → 1 | **2 days** | short enough that the second visit happens; long enough not to be the same sitting |
| 1 → 2 | **7 days** | Bird (2010) / Rogers (2015)'s ≥7-day band for L2 syntax `[S]` |
| 2 → 3 | **14 days** | ~20% of a 60-day horizon; Cepeda's weeks-scale optimum `[S]` |
| 3 → close | **21 days** | inside Cepeda's 18–36-day window for a 1-year horizon `[S]`; near Anki's 21-day "mature" `[S]` |
| closed → confirm 1 | **60 days** | Bahrick's best tested interval was 56 `[S]` |
| confirm 1 → confirm 2 | **120 days** | one sample past the first year `[≈]` — the weakest constant here |
| confirm 2 → | **nothing** | §4 |

Time from first visit to closed, on a clean run: **44 days**, four
visits, 13 probes. Time to sealed: **~7.5 months**, six visits, 19
probes.

The intervals do not double, and §1.1 is why: Karpicke & Roediger found
equal spacing at least as good at delay `[S]`, and a ladder that stops
growing is what a finite tail requires.

### 6.3 Transitions

```
on a visit (all probes of boundary B answered on day d):

  pass = (first visit)  ? k >= 3 of n >= 4
                        : k >= 2 of n >= 3

  phase "new"      + pass  → open, level 1, due d+2
  phase "new"      + fail  → open, level 0, due d+2      (retry, no penalty)

  phase "open"     + pass  → level+1; at level 4 → CLOSED (see 6.4)
  phase "open"     + fail  → level = max(0, level-1); fails += 1
                             at fails >= 3 → resting for 14 days,
                                             lesson offered instead
                             at fails >= 5 → resting, and the app says
                                             the item set may be at fault

  phase "closed"   + pass  → confirms += 1; at 2 → SEALED
  phase "closed"   + fail  → REOPENED at level 2 (7-day), confirms = 0

  phase "sealed"   + fail  → REOPENED at level 2   (only reachable via
                             a spot-check the learner asked for)
```

**One demotion, not a reset.** The savings effect (§3.2) says a learner
who slips after three passes is not in the same state as one who never
passed `[S]`; the existing rule's `days.clear()` charges them as if they
were. A demotion costs one visit and one shorter interval.

**The `resting` phase is the leech rule, and it points at the content.**
Three failed visits with no pass means the drilling is not working: show
the lesson, stop asking for two weeks, and — at five — say out loud that
the item set may be wrong and offer the existing "bu soruda bir sorun
var" path. A model that can only ever blame the learner is the wrong
model for a corpus with known defects `[≈]`.

### 6.4 The closing criterion, in one sentence

> **Closed** = four passing visits, on four separate days, spanning ≥28
> days, with the final gap ≥14 days, and no failed visit since the first
> pass at level 2.

The span and final-gap clauses are guards, not the mechanism — the ladder
produces 44 days and gaps of 2/7/14/21 on a clean run, so they only bite
when a learner does several visits early and the intervals compress. They
exist because "closed" is a claim about durability and a 4-day run does
not support one (§2.4).

Probes consumed: 13. **This sets a hard content requirement: a boundary
needs at least 8 authored items for the closing sequence to avoid heavy
repetition, and 12 for every draw to be plausibly fresh through sealing
(19 probes).** Draw least-recently-seen first, ties broken randomly —
`learner-model.md`'s highest value-per-line recommendation, and here it is
a precondition rather than a nicety.

### 6.5 The re-open criterion, with its error rate

A closed boundary re-opens on a **failed confirmation visit**: ≤1 correct
of 3. At a true command of 0.90 that happens 2.8% of the time; at 0.95,
0.7% `[≈]`. Across both confirmations, a learner who genuinely still
knows a boundary sees it wrongly re-opened about **5.5% of the time at
p = 0.90, 1.4% at p = 0.95**.

I would publish that number in the app: it is the cost of the app being
willing to check, it is small, and stating it is what makes the re-open
message (§3.3) something other than an accusation. The false *seal* rate
— a learner who has genuinely decayed and is never asked again — cannot
be bounded without data the app deliberately does not collect, which is
the honest cost of §4 and the subject of §7.

### 6.6 The notification rule, exactly

Against `retention-and-pricing.md` §B's four axioms.

```
Fires at most once per week, on the weekday and hour the learner chose,
and only if all of:

  1. notifications are ON (default OFF, asked after the first close)
  2. no notification has been sent in the last 7 days
  3. no session has happened in the last 3 days
  4. dueCount >= 3

where dueCount = boundaries with phase "open" and dueDay <= today
                + boundaries with phase "closed" whose confirmation is due
     ("resting" boundaries are excluded; "sealed" are never counted)

The message names min(dueCount, SESSION_BOUNDARIES = 5), not dueCount:

  "5 boundaries are ready for today."

Backlog is never displayed as a number, in the notification or in the app.
```

Two clauses do unobvious work. **Condition 3 exists so the app does not
remind an active learner** — someone who practised yesterday does not
need to be told what is due, and without it the reminder becomes a
habit-nag aimed at exactly the people who have the habit.

**Capping the reported number is not cosmetic.** An uncapped due count
grows while a learner is away, so "17 boundaries are ready" arrives at
the worst moment and reads as an accusation — the streak's failure mode,
a debt accumulated on your behalf, reconstructed out of honest parts. The
capped number is still true (five *are* ready today, and five is a
session) and it cannot become a stick `[≈]`.

**And the two stopping paths, which are the point:**

```
if every boundary is closed or sealed and nothing is due:
    send once:  "You have closed everything currently here.
                 I will stop reminding you until there is something new."
    then set quiet = true until new content ships.

if 3 consecutive weekly notifications have been sent with no session:
    stop for 90 days, then send one:
      "Still here if you want it. I will not remind you again."
    then stop permanently unless the learner returns.
```

Both are the code path §B says a stranger should be able to find. They
are eleven lines, they are in the same function as the send, and no
version of this model is honest without them.

### 6.7 A year, with numbers

Assumptions `[≈]`: a session is 12 probes ≈ 4 minutes, containing 4
boundary-blocks of 3. A boundary costs 4 visits to close, 2 to seal, and
~1.5 more for failed visits and demotions — call it 7.5 visits over its
life.

| Use | Visits/week | Visits/year | Boundaries finished/year |
| --- | --- | --- | --- |
| 3 sessions a week | 12 | 624 | **~83** |
| Daily | 28 | 1,456 | **~190** |

Against `vision.md`'s v1.0 target of ~100 boundaries: a three-times-a-week
learner finishes in about **14 months**; a daily learner exhausts the
corpus in about **six**.

The second number is uncomfortable, being the content-supply argument
from `vision.md` §3 restated as a date. But it also says the pacing is
right: a model that took four years to finish 100 boundaries would
contradict the product's claim, and one that finished them in six weeks
would not mean anything.

### 6.8 Every constant, and where it came from

| Constant | Value | Source |
| --- | --- | --- |
| Ladder | 2, 7, 14, 21 days | Cepeda `[S]`, Bird/Rogers `[S]`, rounded `[≈]` |
| Confirmation gaps | 60 then 120 days (so +60 and +180 after closing) | Bahrick `[S]`; the second is a guess `[≈]` |
| First-visit pass | ≥3 of 4 | Rawson's criterion of 3 `[S]` + the guess table `[≈]` |
| Later-visit pass | ≥2 of 3 | guess table `[≈]` |
| Visits to close | 4 | successive relearning: 1 + 3 `[S]` |
| Closing span / final gap | ≥28 / ≥14 days | Cepeda's 1-year window `[S]` |
| Demotion on failure | one level | savings effect `[S]` |
| Resting after | 3 failed visits | guess `[≈]`, Anki's leech threshold is 8 `[S]` |
| Probes per boundary | ≥8, want 12 | 13 draws to close, 19 to seal `[≈]` |
| Notification floor | dueCount ≥ 3 | `retention-and-pricing.md` §B.4 |
| Reported cap | 5 | one session `[≈]` |
| Abandonment stop | 3 unanswered, then 90 days | guess `[≈]`, axiom 2 |

---

## 7 · Where I would be wrong

**The whole model could be over-engineered for the evidence it will ever
have.** Forty-four days and thirteen probes to close one boundary is a
lot of machinery around a decision a teacher makes by looking. If the
first hundred learners close 12 boundaries each and stop, none of §6.4's
carefulness is ever exercised and a two-visit rule would have shipped a
year earlier.

**The 120-day second confirmation is the weakest thing here** — one guess
inside an evidenced range, with no reason to prefer it over 90 or 180. If
nobody is still using the app 300 days after their first closure, it
never fires for anyone and the model has a limb no learner reaches.

**The false-seal rate is unbounded and I chose not to bound it.**
Bahrick's plateau `[S]` and the savings effect `[S]` are the argument
that sealing is cheap to be wrong about, and both are about vocabulary
rather than grammatical contrasts. If boundary knowledge decays faster
than I think, the app is confidently wrong about people in year two. The
only defence built is the voluntary spot-check, and a voluntary defence
protects only the learners who use it.

**The multiple-choice format may not carry the weight.** §1.4: MC
produces smaller testing effects than recall `[S]`, and the rescue is
conditional on genuinely competitive distractors `[S]`. If the bank
drifts toward easy distractors — which is what happens when items are
authored fast — thirteen probes prove much less than §2.3's tables
suggest, because those tables assume a guess floor of 0.25 and real
discrimination above it.

**Juxtaposition may not matter.** §1.3's discriminative-contrast account
is contested `[S]`. If it is wrong, the block structure is merely
neutral — fine, except that I used it to argue for a session shape, and
that argument would then be decoration.

**And the notification may be moot**, for the reason §B already gave: at
default-off, once a week, deliberately unexciting, nobody may enable it,
in which case §6.6 is careful work on a feature with no users.

---

## 8 · What I would refuse

- **FSRS, SM-2, or any fitted memory model.** Two independent reasons now:
  the data volume (`learner-model.md` §2.2) and the merge (§5.1).
- **A modelled decay curve that re-opens boundaries without asking.** §3.1.
- **An infinite interval tail.** §4.
- **A monotone "boundaries closed" counter.** §3.3.
- **An uncapped due count, anywhere.** §6.6.
- **Any tuning of the intervals against usage.** Axiom 3. The project has
  no analytics, which means it *cannot* do this — and that accident should
  be written down as a commitment before someone proposes analytics "just
  to see whether the reminders work".
- **Per-item scheduling.** §1.2.
- **Confidence self-ratings.** SM-2's `q`; `learner-model.md` §2.5.

---

## 9 · Open questions for the owner

1. **Can a boundary carry 12 items?** §6.4 says the model needs ≥8 and
   wants 12. At ~100 boundaries that is 800–1,200 items, and at the
   project's own measured 6–8 minutes of undelegable attention per item
   that is **80–160 hours**. If it cannot, the honest lever is **fewer
   boundaries, not fewer items per boundary** — because four items per
   boundary is precisely what corrupted the measurement in App 1.
2. **Is 44 days to close acceptable, or does the first closure need to
   arrive sooner?** A learner who has closed nothing after six weeks may
   not stay to see the model work. The cheap alternative is a shorter
   first ladder (1, 4, 10, 21 → 36 days) at a real cost in what "closed"
   means.
3. **Should the spot-check ever be offered without being asked for?**
   §4.3 says no. It is the single place where the design gives up the
   most retention, and it is a values call, not a research one.
4. **Does "sealed" appear in the interface, or only "closed"?** Two words
   is more honest and one word is more legible. I lean to one word in the
   count and two on the detail screen.
5. **What happens to a closed boundary when its items are rewritten?**
   A corrected item changes what the four passing visits were evidence
   *of*. The choices are to leave it closed, to reset it, or to add one
   confirmation — and this is a content-pipeline decision, not a
   scheduler one.

---

## Sources

All `[S]` — search summaries of abstracts and secondary descriptions, not
papers read in full.

**Spacing and retrieval.** [Cepeda et al. (2006), *Psych. Bulletin* 132](https://pubmed.ncbi.nlm.nih.gov/16719566/) · [Cepeda et al. (2008), *Psych. Science* 19](https://escholarship.org/uc/item/0kp5q19x) · [Karpicke & Roediger (2007), *JEP:LMC* 33(4)](https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JEPLMC.pdf) · [Kang (2016)](https://journals.sagepub.com/doi/abs/10.1177/2372732215624708) · [Rohrer & Taylor (2006)](https://files.eric.ed.gov/fulltext/ED505642.pdf)

**Criterion and successive relearning.** [Rawson & Dunlosky (2022), *Current Directions*](https://journals.sagepub.com/doi/full/10.1177/09637214221100484) · [Rawson & Dunlosky (2011), *JEP:General*, "How Much Is Enough?"](https://www.ovid.com/journals/jepge/pdf/10.1037/a0023956~optimizing-schedules-of-retrieval-practice-for-durable-and) · [Vaughn & Rawson (2011), *Psych. Science*](https://journals.sagepub.com/doi/10.1177/0956797611417724)

**Concepts, transfer and interleaving.** [Kornell & Bjork (2008)](https://web.williams.edu/Psychology/Faculty/Kornell/Publications/Kornell.Bjork.2008a.pdf) · [Birnbaum, Kornell, E. Bjork & R. Bjork (2013)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Birnbaum_Kornell_EBjork_RBjork_inpress.pdf) · [Firth et al. (2021), *Review of Education*](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/rev3.3266) · [Butler (2010)](https://andymatuschak.org/files/papers/Butler%20-%202010%20-%20Repeated%20Testing%20Produces%20Superior%20Transfer%20of%20Learning%20Relative%20to%20Repeated.pdf) · [Butler, Black-Maier, Raley & Marsh (2017)](https://static1.squarespace.com/static/5c8baca1e5f7d136349ea789/t/5e739a3d46338e7dec37aaf6/1584634429337/Butler+et+al+2017.pdf)

**Multiple choice.** [Little, E. Bjork, R. Bjork & Angello (2012)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf) · [Marsh, Roediger, R. Bjork & E. Bjork (2007)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Marsh_Roediger_BjorkBjork2007PBR.pdf)

**L2 grammar and spacing.** [Bird (2010), *Applied Psycholinguistics* 31(4)](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/effects-of-distributed-practice-on-the-acquisition-of-second-language-english-syntax/9920EC042394DCB7094726C7F80F6F8C) · [Suzuki & DeKeyser (2017)](https://yuichisuzuki.net/wp-content/uploads/2023/04/Suzuki-DeKeyser-2017-LTR.pdf) · [replications of Bird (2010) and Serrano (2011), *Language Teaching*](https://www.cambridge.org/core/journals/language-teaching/article/abs/input-spacing-in-second-language-classroom-settings-replications-of-bird-2010-and-serrano-2011/B51D5A5B5011F51A35CD70E5ABB9A823)

**Long-term retention and relearning.** [Bahrick × 4 (1993), *Psych. Science* 4](https://gwern.net/doc/psychology/spaced-repetition/1993-bahrick.pdf) · [Bahrick & Phelps (1987)](https://gwern.net/doc/psychology/spaced-repetition/1987-bahrick.pdf) · [Bahrick (1984), permastore](https://www.semanticscholar.org/paper/Semantic-memory-content-in-permastore:-fifty-years-Bahrick/57f7bca4dbd92caba99c660b58f6d5013760ac35) · [Ebbinghaus savings, review (2023)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9971077/) · [CPR training frequency, *Resuscitation* (2018)](https://www.resuscitationjournal.com/article/S0300-9572(18)31068-2/abstract) · [paediatric CPR retraining review (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9630773/)

**Mastery thresholds.** [Kulik, Kulik & Bangert-Drowns (1990), *RER* 60(2)](https://journals.sagepub.com/doi/10.3102/00346543060002265) · [Kulik & Kulik (1987)](https://journals.sagepub.com/doi/10.2190/FG7X-7Q9V-JX8M-RDJP) · ["How Much Mastery is Enough Mastery?", EDM 2025](https://educationaldatamining.org/EDM2025/proceedings/2025.EDM.short-papers.4/index.html) · [Fast-Forwarding Over-Practice Steps (2025)](https://arxiv.org/abs/2506.17577) · [van der Linden, decision models for criterion-referenced tests](https://ris.utwente.nl/ws/files/6732376/v04n4p469.pdf) · [classification consistency](https://metricgate.com/docs/classification-consistency/) · [Wilson et al. (2019), the 85% rule](https://www.nature.com/articles/s41467-019-12552-4)

**Practice precedent.** [Anki deck options](https://docs.ankiweb.net/deck-options.html) · [FSRS tutorial](https://github.com/open-spaced-repetition/fsrs4anki/blob/main/docs/tutorial.md) · [srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark)
