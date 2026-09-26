# Twenty items, and what they are allowed to say

2026-09-06. A research arm for App 2. `vision.md` §3 settled three things
and this document reopens none of them: **the wedge is the diagnostic** —
telling a learner what they did not know to ask, which is the one thing a
chat box structurally cannot do, because you have to bring it a question;
**the unit is a boundary**, a pair the learner's ear smears, and progress
is boundaries closed; **v0.1 is the diagnostic alone** — roughly twenty
items, free, no account.

The question left over is the hard one. *How do you honestly find
someone's boundaries in about twenty items?* Not "how do you build a
plausible result screen" — that takes an afternoon. The app has to be
right, and where it cannot be right it has to say so, because the
audience is `CLAUDE.md`'s **competence without labels** and that learner
punishes an over-claim harder than any other. Their ear produces the
counterexample. An app that tells them they conflate *since* and *for* on
one wrong answer is not being strict; it is being wrong, and they know.

The seed is already in the codebase. `js/storage.js` refuses to call a
category weak until six distinct items have been met *and* the 95% Wilson
upper bound rules out mastery, and its comment says why: **the bound
separates "this is the one you got most wrong" — a ranking, which needs
little evidence — from "you don't know this" — a claim, which needs a
lot.** That distinction is the whole of this document; App 2 needs it
enforced across sixty boundaries instead of one, on twenty observations
instead of a term's worth.

---

## 0 · What could and could not be verified

`WebFetch` and `curl` are blocked by this session's egress proxy, as they
were for `retention-and-pricing.md`. `WebSearch` works and returns
titles, URLs and a model-written summary. Nothing below was read at
source.

| Tag | Means |
| --- | --- |
| `[S]` | From a search summary. URL in §8. **Not read at source.** |
| `[?]` | Unverified, or provenance I could not establish. |
| `[≈]` | My own reasoning or arithmetic — every simulation figure in §1–§6. |

Two repository facts were measured rather than assumed: the corpus is
**241 questions across 60 categories in 10 topics** (4.0 items per
category), and **no question carries a `difficulty` field** — the item
schema is `id`, `category`, `paragraph`/`sentence`, `options`,
`correctIndex`, `explanation`, `tip`, `optionNotes`, `type`. Difficulty
exists only at topic level, as `tier`. So there is no author-assigned
item difficulty to bootstrap from, and there is a schema change hiding
inside §3.

---

## 1 · The measurement problem, stated properly

### 1.1 The arithmetic of coverage, which kills most of the options

Take the space as 60–120 boundaries — App 1 has 60 categories and
`vision.md`'s v1.0 line is "~100 boundaries", so the range is the
project's own. To *measure* a boundary the way §2 will require takes 3–4
items; 60 boundaries at 4 items is 240, which is to within four the
entire App 1 corpus. A twenty-item test covers, at best:

| Items per boundary | Boundaries touched | Of 60 | Of 120 |
| --- | --- | --- | --- |
| 1 | 20 | 33% | 17% |
| 2 | 10 | 17% | 8% |
| 4 | 5 | 8% | 4% |

`[≈]` **No arrangement of twenty items covers the space.** That is not a
limitation of the estimator; it is a fact about twenty. Any design that
pretends otherwise is lying at the arithmetic level before it reaches a
psychometric question. **The v0.1 diagnostic is therefore a *screen*, not
a survey**, and everything it prints has to be phrased as what a screen
can support. That is a harder line to write than it looks, and §5 is
mostly about writing it.

### 1.2 Four candidate machineries, and what each costs

**(a) IRT computerised adaptive testing.** Estimate a latent θ, pick the
item with maximum information at θ̂, stop at a target standard error —
what Duolingo's placement does `[S]`. It needs a **calibrated bank**:
~500 responses per item for a 2PL, and 2PL wants *more* than 1PL because
discrimination is the unstable parameter `[S]`. Calibration error is not
cosmetic — small samples degrade the ability estimates they feed, worst
at the extremes, through capitalisation on chance `[S]`. And it assumes a
single dominant trait, which the boundary model denies: CAT measures *how
much* English you have, and two learners with identical θ can smear
disjoint sets. Unavailable, and more importantly **off-model**.

**(b) Cognitive diagnosis models — DINA, G-DINA, CD-CAT.** The family
actually *about* the right thing: a Q-matrix mapping items to attributes
and a posterior over binary mastery patterns rather than a scalar, with a
developed short-test selection toolkit — Shannon entropy minimisation,
posterior-weighted Kullback–Leibler, mutual information, the G-DINA
discrimination index `[S]`.

The boundary model *is* a Q-matrix with one attribute per item, which is
the good news and the trap: at one-to-one, what makes G-DINA powerful —
pooling evidence across items loading on several attributes — switches
off, and the model degenerates to independent per-boundary Bernoulli
estimates with guess and slip terms. Which is fine, and is what §2
builds; it should be called that, not called G-DINA. The real thing is
awkward in small samples `[S]`, carries a documented non-identifiability
problem `[S]`, and gets markedly worse classification on 1-item
attributes than 3-item ones `[S]`. Nobody there is classifying sixty
attributes from twenty items. **Steal the framing, refuse the
estimator** — the move `learner-model.md` §2.4 made with BKT.

**(c) Sequential testing (SPRT).** Wald's test stops when the likelihood
ratio crosses a boundary; in mastery testing it decides in about **half**
the items a fixed-length test needs `[S]`. The most under-rated option
here, because it is natively about the thing the app wants — decide per
boundary between mastered and not, with controlled error rates, on as few
items as the evidence allows — and it needs no calibration, only
`P(correct | mastered)` and `P(correct | not)`, which can be *assumed*
(§2.1: ~0.90 and 0.25–0.40). Its cost is that it eats items on the
boundary it is interrogating, and item budget binds: an SPRT that runs to
a decision on the first doubt spends six items and leaves fourteen for
fifty-nine other boundaries. **Adopt it truncated** — §6 is an SPRT with
a hard stop at 4 items per boundary and at most three boundaries opened.

**(d) A Bayesian model over boundaries.** A prior that this learner
conflates each boundary, updated by each response. The right
*representation* — it is what makes "confirmed / suspected / not looked
at" expressible — and cheap: sixty Bernoulli posteriors, no fitting pass,
thirty lines, pure, unit-testable in the style of
`tests/quiz-engine.test.js`. Its cost is the prior (§3). **This is the
model**; (b) is its selection rule and (c) its stopping rule.

**(e) The two-stage screen.** The multistage literature's useful finding:
the **routing module dominates** a two-stage test's precision, and
lengthening it is the most effective lever on error `[S]`; short-to-long
(12 routing, 24 measurement) beat equal-length three-stage (12-12-12)
`[S]`. That is routing to a difficulty level, not to a boundary, so it
does not transfer whole `[≈]` — but its shape does, inverted: here the
*screen* is the expensive stage, because coverage buys recall, and
confirmation is what buys the right to speak.

### 1.3 What survives zero response data

| Machinery | Needs calibration data? | Needs a fitted model? | On-model? | Usable at v0.1 |
| --- | --- | --- | --- | --- |
| IRT CAT (2PL) | Yes, ~500/item `[S]` | Yes | No — scalar θ | **No** |
| CD-CAT / G-DINA | Yes | Yes | Yes | **No** |
| SPRT, truncated | No — assumed slip/guess | No | Yes | **Yes** |
| Per-boundary Bayes | No — author prior | No | Yes | **Yes** |
| Two-stage screen | No | No | Yes | **Yes** |

`[≈]` The three survivors are the three that need no population — and
that put their assumptions in constants a person chose and can be argued
with, rather than in parameters a fitting pass produced and nobody can
inspect. For a project whose CI re-measures every colour token, that is
the correct trade.

### 1.4 What actually binds, and it is not the estimator

`[≈]` Every surviving design hits the same wall: **twenty items yield
roughly one defensible finding per learner** (§6.2). The estimator choice
moves that between 0.6 and 2.2. The *sampling* choice — which boundaries
get looked at — moves it more (§4.2). The honesty threshold moves it most,
because the naive "wrong once, therefore conflated" rule produces four
findings of which nearly two are false (§2.4).

So the design problem is not which psychometric model. It is: **given
that the test supports about one claim, how do you spend it, and what do
you say about the 95% of the space you did not touch.**

---

## 2 · What can be claimed from *n* items

### 2.1 The guessing floor, and the one way this corpus is lucky

Four options. A learner who knows nothing scores `[≈]`:

| | 0 right | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 1 item | 75.0% | 25.0% | | | |
| 2 items | 56.3% | 37.5% | 6.3% | | |
| 3 items | 42.2% | 42.2% | 14.1% | 1.6% | |
| 4 items | 31.6% | 42.2% | 21.1% | 4.7% | 0.4% |

`learner-model.md` §2.4 published the four-item row for App 1. The row
that matters for App 2 is the first. **A single item carries so little
information that a wrong answer is compatible with almost anything**, and
a *right* answer is worth less still: someone who knows nothing gets it
right one time in four.

One thing runs in the app's favour, and it is a property of this
project's authoring rules rather than of multiple choice. The distractor
is the *other member of the pair* — the form the learner's ear would
produce — so someone who genuinely smears *since/for* is not choosing at
random among four; they are being pulled to the wrong one. Effective
`P(correct | not mastered)` is plausibly **below** 0.25 `[≈]`. I model it
at 0.25 anyway, because modelling it lower would claim credit for item
quality nobody has measured; it means the tables below are conservative.
**Slip `s = 0.10` is my assumption throughout `[≈]`, and it is the one I
would most want checked against real data.**

### 2.2 Wilson, at the sizes actually available

`storage.js` already computes the 95% Wilson upper bound and gates every
spoken claim on it. Extended to the sizes twenty items produce `[≈]`:

| Observed | Point | 95% Wilson |
| --- | --- | --- |
| 0/1 | 0% | 0 – 79% |
| 0/2 | 0% | 0 – 66% |
| 0/3 | 0% | 0 – 56% |
| 1/3 | 33% | 6 – 79% |
| 0/4 | 0% | 0 – 49% |
| 1/4 | 25% | 5 – 70% |
| 2/4 | 50% | 15 – 85% |

**Getting every item on a boundary wrong is consistent with 79% mastery
at n=1 and 49% at n=4.** The interval does not clear the 0.80 mastery
line until n=4 and a clean sweep.

### 2.3 The claim ladder

Wilson is right for App 1, where the question is "is this category below
mastery". App 2's question is binary — *does this learner conflate this
pair* — so the honest instrument is the posterior odds under explicit
slip and guess `[≈]`:

```
P(¬mastered | w wrong of n) ∝ (1−π) · (1−g)^w · g^(n−w)
P( mastered | w wrong of n) ∝    π  ·    s^w  · (1−s)^(n−w)
```

with `s = 0.10`, `g = 0.25`, and `π` the prior that the learner **has
mastered** this boundary. Posterior probability that they have not:

| prior π | 1 wrong of 1 | 1 of 2 | 2 of 2 | 2 of 3 | 3 of 3 | 2 of 4 | 3 of 4 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.50 | 88% | 68% | 98% | 94% | ~100% | 81% | 99% |
| 0.70 | 76% | 47% | 96% | 87% | 99% | 65% | 98% |
| 0.85 | 57% | 27% | 91% | 73% | 99% | 43% | 95% |

`[≈]` Three things fall out, and they set the thresholds:

1. **One wrong answer is worth 57–88% depending entirely on a prior
   nobody has measured.** It is not evidence; it is a hint whose strength
   is an author's guess. It may be *ranked* and must not be *stated*.
2. **Two wrong of two clears 90% at every prior.** The cheapest
   defensible claim available, and it costs two items.
3. **Three of three, or three of four, is 95–99% at every prior** and is
   robust to the guess parameter being badly wrong (at `g = 0.40` the
   3-of-4 cell does not move).

### 2.4 Why a threshold is not optional: sixty chances to be wrong

`[≈]` The argument I would put in front of the owner first. Take the
naive rule — *one wrong answer, boundary flagged* — on a flat 20-item
screen, one item per boundary, and a learner who has in fact mastered
everything tested. With slip 0.10:

| Boundaries screened | Expected false flags | P(at least one false claim) |
| --- | --- | --- |
| 10 | 1.0 | 65% |
| 15 | 1.5 | 79% |
| 20 | 2.0 | 88% |

**Nine in ten learners are told about a boundary they do not have.** And
it is worse than noise: the flagged boundary is precisely where they
slipped, so the app's headline finding is systematically an artefact.

Under "2 of 2 wrong" the per-boundary false-positive rate is 1%, and
across ten boundaries the chance of any false claim is **9.6%** `[≈]`.
Under "flagged in a screen, *then* at least 2 wrong of 3 in a
confirmation stage" it is 0.10 × 0.028 = **0.28% per boundary** `[≈]` —
one learner in about thirty-five ever sees a wrong claim.

This is the false-positive paradox from screening medicine arriving
intact: a test with respectable specificity throws mostly false positives
at a low base rate, and confirmation with a second, more specific test is
the standard answer `[S]`. **Build it the way a screening programme is
built: a sensitive screen that flags, and a specific follow-up that
speaks.**

### 2.5 The reliability number, said out loud

`[≈]` Alpha for a k-item subscale with mean inter-item correlation r̄ is
`k·r̄ / (1 + (k−1)·r̄)`:

| r̄ | k=1 | 2 | 3 | 4 | 6 | 8 | 12 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.15 | .15 | .26 | .35 | .41 | .51 | .59 | .68 | .78 |
| 0.25 | .25 | .40 | .50 | .57 | .67 | .73 | .80 | .87 |
| 0.40 | .40 | .57 | .67 | .73 | .80 | .84 | .89 | .93 |

Items within one boundary should be homogeneous, so r̄ ≈ 0.40 is the
optimistic reading — and even there **a four-item boundary subscale has
reliability .73**, under the .80–.90 conventionally wanted before a score
decides something about an individual. Spearman-Brown predictions for
short *multidimensional* pools are known to be optimistically biased
`[S]`, and the boundary model is definitionally multidimensional, so .73
is the generous figure.

The conclusion is not "abandon subscales" but: **the per-boundary output
must be a binary classification with a stated error rate, never a
score.** A classification at 99% posterior is defensible where a
percentage at reliability .73 is not — and it is also what the learner
wants. Nobody has ever wanted to know they are 62% on *since/for*.

### 2.6 Guessing correction: no

Formula scoring subtracts 1/3 per wrong answer on a four-option item so a
blind guesser expects zero `[S]`. Inappropriate here for the reason the
literature already gives: it does not penalise blind guessers on average,
and it **penalises the partially-informed learner who declines to
guess** `[S]`. This app's learner is definitionally the
partially-informed one, and there is no omit option anyway. The guess
correction that belongs here is `g` inside the likelihood (§2.3).
**Correct the model, not the score.**

### 2.7 The rule, in one paragraph

> **State nothing from one item.** Rank from one item, silently. Say
> *"this looked shaky"* from two wrong of two, and *"you conflate
> these"* only after a confirmation stage in which at least two of three
> further items on that boundary also went wrong. Never print a
> per-boundary percentage. Never print a total score. And print, always,
> the count of boundaries that were **not looked at** — that number is
> larger than every other number on the screen, and hiding it is the lie
> this product exists not to tell.

---

## 3 · Item selection without calibration

### 3.1 What an author-assigned difficulty is worth

Not much, and the literature is unusually consistent. `[S]` Thorndike
(1982) had judges rate item difficulty on a 9-point scale: correlations
with empirical p+ of **.83, .74, .72** — but for the *average of 20
raters*. Translated to a single judge: **.23 to .32**. With anchor items
and group discussion, single-judge figures improve to about **.32 → .44**
(reading comprehension) and **.37 → .50** (analytical reasoning) `[S]`.
The summary's own framing: investigations of experts estimating item
difficulty "have generally not found much success" `[S]`.

`[≈]` **One author, alone, rating his own items, should expect r ≈ 0.3** —
enough to sort into "probably easy" and "probably hard" piles, badly
wrong about any individual item, 9% of the variance explained. So **a
v0.1 that needs accurate item difficulty is not buildable**; a v0.1 that
needs items to be *roughly comparable* — all §6 needs, since it compares
wrong-counts across boundaries — is, because excluding outliers is a
weaker demand than ranking. One cheap improvement from the same
literature: **comparative judgement** — "which of these two is harder" —
rather than absolute rating `[S]`; the ETS work exists precisely because
absolute rating fails. Spend attention on ~100 pairwise comparisons
rather than 240 absolute ratings `[≈]`.

### 3.2 LLM-simulated difficulty, better than it has any right to be

`[S]` The 2025–26 literature on automated item difficulty prediction
reports correlations of **.75–.87** with empirical difficulty for MCQs
and reading items; one study on 250,000+ maths responses reports Pearson
≈ **.78** on unseen questions. The method that works is not "ask a model
how hard this is" but **simulate students of varying ability, score the
simulated responses, and fit IRT to the simulated matrix** `[S]` — and,
counter-intuitively, weaker-domain models made better simulators `[S]`.
`[≈]` If those hold — `[?]` none read at source, and the domains are
maths and reading, not grammar boundaries — an LLM prior at r ≈ 0.78 is
**more than twice as informative as the owner's own rating at r ≈ 0.3**,
at minutes rather than hours.

Caution rather than enthusiasm. `CLAUDE.md` carries this project's one
hard-won finding about AI in the pipeline: the single controlled
comparison found teacher-plus-AI items carrying **more** flaws than
teacher-only items, because reviewers gave the drafts less engagement. A
difficulty prior is a different artefact — never shown to a learner,
nothing depends on it — so the risk is smaller, but the failure mode is
the same shape: a number that looks like a measurement, was not measured,
and displaces the judgement it was meant to assist. **So: use it, name
the field `difficultyPrior`, and store provenance beside it (`"llm-sim"` /
`"author"` / `"observed"`), with `validate-content.mjs` refusing an
`"observed"` value that lacks the §3.4 minimum behind it.** The
provenance field *is* the safeguard: it makes a prior impossible to
mistake for a measurement six months later.

### 3.3 The priors actually worth having

`[≈]` Difficulty is the least useful prior for this design. Two others
matter more.

**A boundary base rate — what fraction of learners smear this pair.**
§4.2 shows this drives recall, and it is the one the author can really
estimate, because unlike item difficulty it is a claim about *people* and
he has taught them. The Cambridge Learner Corpus is the external anchor:
grammar is the largest error category, within it determiners are **almost
a third**, prepositions **14%**, clause errors **13%** `[S]`; word
choice, prepositions and determiners are the three commonest error types
overall `[S]` — from 16 million words across 86 L1s `[S]`. A population
base rate, not this learner's, which is what a prior is for.

**A family label.** Boundaries clump — aspect, determiners and
quantifiers, prepositions of time, modality, conditionals, non-finite
complements, relative clauses. Family is the unit at which §4.3 buys
coverage, and it is nearly free: App 1's ten topics almost are the
families.

**Discrimination is not a prior here; it is a construction rule.** The
distractor is the other member of the pair, so an item that does not
discriminate between having and not having the boundary is a *broken
item* — catchable by the existing blind pass and cold-solve protocol
rather than by a parameter. `npm run solve`'s `b?` answer — *I chose b
and another option is defensible* — is exactly a discrimination failure
reported by a human. The pipeline already collects the signal; it does
not need a number.

### 3.4 When real data may replace the prior

`[≈]` Half-width of a 95% interval on an item's p-value, worst case:

| Responses on the item | 10 | 20 | 30 | 50 | 100 | 200 | 500 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 95% half-width | ±31 pp | ±22 pp | ±18 pp | ±14 pp | ±10 pp | ±7 pp | ±4 pp |

Three thresholds, which I would write into the tooling as constants the
way `MIN_ITEMS_FOR_WEAK_CLAIM` is written into `storage.js`:

- **n ≥ 30 — the item may be *retired*.** ±18 pp is useless for ranking
  and plenty for spotting an item 85% get wrong or 95% get right. Killing
  dead items is the first thing response data buys, and it arrives early.
- **n ≥ 100 — the observed p-value may *replace* the prior.** ±10 pp is
  narrower than the author prior's implied error at r ≈ 0.3 `[≈]`.
- **n ≥ 500 — only then is 2PL discrimination estimable** `[S]`, and by
  then the app should ask whether it wants a 2PL at all (§1.2a).

In takers, for a pool of P items and T takers answering 20 each:

| Pool | Takers | Responses/item | Half-width |
| --- | --- | --- | --- |
| 120 | 100 | 17 | ±24 pp |
| 120 | 300 | 50 | ±14 pp |
| 120 | 600 | 100 | ±10 pp |
| 240 | 1500 | 125 | ±9 pp |

`[≈]` **Six hundred people must take the diagnostic before a 120-item
pool is calibrated to ±10 pp.** Against `vision.md`'s stated ceiling of
"hundreds of paying users, not thousands", that is the whole lifetime
audience. Hence the most important scheduling fact here:

> **The diagnostic will run on author priors for its entire useful life,
> or close to it.** A design whose honesty depends on eventual
> calibration is a design that is never honest. Everything in §6 must be
> defensible at zero responses; §6.5 is an improvement, not a rescue.

One qualification cuts the other way: the diagnostic is free and has no
account, so its taker count is not bounded by the paying ceiling — a free
20-item test that gets shared can plausibly see thousands of takes where
the app sees hundreds of buyers `[?]`. Plan for the pessimistic case.

### 3.5 Two traps in the data that does arrive

`[≈]` **Self-selection.** People who take a test labelled "find the
boundaries your ear smears" are not a sample of English learners. An
item's observed p-value is `P(correct | took this test)`, while §4's base
rates are population quantities. Conflating them makes every boundary
look more conflated than it is, forever, and the error is invisible
because it never contradicts itself.

**Non-random exposure.** Once selection is adaptive, an item's responses
come only from learners the algorithm sent it to, so its raw p-value is
biased by the selection rule — which is why the online-calibration
literature proposes optimal designs for item replenishment `[S]`. Cheap
v0.1 mitigation: **hold one screen slot in twenty as a uniformly random
item**. It costs 5% of the test's power and it is the only thing that
will let the response data be trusted later.

---

## 4 · The false-negative problem

Under `vision.md` §3's claim — *finding what you did not know to ask* — a
false positive is embarrassing and a false negative is the failure of the
premise: a boundary never tested is invisible, and the learner leaves
believing they do not have it.

### 4.1 The recall arithmetic, which is bleak

`[≈]` 60 boundaries, a learner who genuinely conflates 8 of them (13%),
a flat 20-item screen with uniform sampling:

- truly-conflated boundaries sampled: 20 × 8/60 = **2.7**
- of those, flagged (`P(wrong | not mastered) = 0.75`): **2.0**
- **recall: 25% of the learner's real boundaries.**

At two items per boundary with a "both wrong" rule, coverage halves and
recall falls to **9%**.

So the honest sentence is not "here is what you conflate" but *"here are
two of them; there are probably six more this test did not look at."*
That sentence is more interesting than the false one, and it is also the
pitch: a screen that says *there are more* has a reason to exist beyond
itself.

### 4.2 Three sampling policies, with numbers

`[≈]` **(a) Uniform coverage.** 20 boundaries at random from 60; recall
25%. Unbiased, and wasteful — it spends items on boundaries almost nobody
smears.

**(b) Base-rate weighted.** Sample the boundaries with the highest prior.
For a 10-boundary × 2-item design:

| Conflation rate in the sampled set | E[true conflations sampled] | Detected (2-of-2 wrong) |
| --- | --- | --- |
| 0.13 | 1.3 | 0.7 |
| 0.25 | 2.5 | 1.4 |
| 0.35 | 3.5 | 2.0 |
| 0.50 | 5.0 | 2.8 |

**Base-rate weighting roughly triples yield across the plausible range.**
It is the highest-leverage single decision in the design and costs
nothing but a `prior` field in the content JSON. Its cost is a bias that
must be disclosed: the app systematically does not look at rare
boundaries — and *"my gaps are unusual"* is close to the audience's
self-image. §4.4 pays for that.

**(c) Maximum information gain.** Pick the item that most reduces
posterior entropy — CD-CAT's Shannon-entropy and posterior-weighted KL
rules `[S]`. With independent per-boundary posteriors and one attribute
per item this collapses to something simple `[≈]`: **gain is maximised at
the boundary whose posterior is nearest 0.5.** Before any responses that
is the boundary whose *prior* is nearest 0.5 — for a well-chosen prior
set, the ordering (b) produces — and after a wrong answer it is the
boundary just flagged. So (c) is not a third policy; **it is (b) for the
screen and "confirm what you flagged" for the follow-up**, which is §6's
design, now derived twice.

### 4.3 Families, as the guard against (b)'s bias

`[≈]` Pure base-rate ordering picks eleven boundaries from three
families, because base rates clump — determiners are a third of grammar
errors `[S]`, so a greedy rule buys determiners eleven times. That is the
worst possible failure for a screen, whose job is breadth. The fix is a
constraint, not a different objective: **at most two screen items per
family, every family entered at least once**, then rank within family by
base rate. With seven or eight families and eleven slots that is
satisfiable, and it converts the screen from "the eleven commonest
boundaries" into "a sweep of the space, entering each family at its most
likely door" — the content-balancing constraint every operational CAT
carries, for the same reason `[?]`.

### 4.4 What the learner is told about what was *not* tested

The part comparable products universally omit, and the part that makes
the claim true. `[≈]` Three things on the result screen:

1. **The denominator, unrounded.** *"This test looked at 14 of 60
   boundaries."* Not a progress ring — a sentence with two integers.
2. **The families it did and did not enter.** *"It did not look at
   conditionals, relative clauses, or reported speech at all."* That
   turns an absence into information: a learner who suspects their gaps
   are in conditionals now knows this test was blind to them.
3. **What a clean sweep does and does not mean.** *"You answered
   everything correctly. That means the 14 boundaries below are probably
   not your problem. It does not mean you have none."* Even 0 wrong on 14
   boundaries leaves the other 46 completely unmeasured `[≈]`.

And this is not merely ethical. It is the only honest bridge from a free
20-item screen to a paid product: **"there are 46 boundaries this did not
look at" is a true sentence that is also the offer.** A product forced to
choose between honesty and its funnel has designed the funnel wrong;
here they are the same sentence.

### 4.5 The free channel that gets ignored

`[≈]` Self-report. Ask the learner up front to tick the pairs they know
they hesitate on. It costs no items, it is the densest thirty seconds
available, and it raises the prior on exactly the boundaries §4.2 says
the prior governs. Treat it as a prior and never as a measurement:
self-assessment correlates with objective proficiency around **r =
.52–.65** in one summary and **~.45** in a meta-analysis `[S]`; more
learners over-estimate than under-estimate `[S]`; lower-skill learners
over-estimate most `[S]`; receptive skills self-assess better than
productive `[S]`, which mildly favours this case since a boundary
judgement is receptive.

`[?]` I would guess self-report is *better* for boundaries than for
levels, because "I never know which of these two" is a far more concrete
introspection than "I am B2". v0.1 tests that for free: record the ticks,
compare against confirmed findings, report the agreement rate. **That
comparison is itself a finding worth putting on the landing page.**

---

## 5 · Diagnostic UX that does not lie

### 5.1 What comparable products claim

| Product | Shape | Claim |
| --- | --- | --- |
| **Duolingo placement** | ~10 min, adaptive — re-estimates after each question `[S]` | Explicitly "an approximate estimation"; the output is an *action on the tree* (test out of a skill, a quarter, or all) rather than a statement about you `[S]` |
| **EF SET Quick Check** | 15 min, **not adaptive** `[S]` | "A rough estimate", CEFR-aligned, positioned as practice, no certificate `[S]`. EF's accuracy claims — comparable accuracy at all levels, correlation to TOEFL/IELTS bands — attach to the 50-minute certificate test, not this one `[S]` |
| **Cambridge "Test your English"** | ~25 questions, free, instant `[S]` | Deliberately narrow: which Cambridge exam to sit, not what your English is `[S]` |
| **DIALANG** | Diagnostic; reading, writing, listening, grammar, vocabulary, 14 languages `[S]` | The interesting one — the first major system oriented to **diagnosis and feedback rather than certification** `[S]`; reports CEFR level *plus* answer verification, placement score, self-assessment feedback and advice, and states it is not an exam `[S]` |
| **ELSA Speak** | Continuous, phoneme-level across 44+ phonemes `[S]` | Percentage scores. Criticised for covering only segmental features, for ASR's known unreliability on non-native speech, and — sharpest — that leading tools "deliver wildly different results despite similar marketing claims" because they evaluate fundamentally different signals `[S]` |

### 5.2 Where the claims outrun the evidence

`[≈]` Three distinct failures, worth separating because App 2 is exposed
to a different one than it looks.

**Precision theatre.** ELSA's percentage is the clearest: two significant
figures from a process whose validity is contested and whose disagreement
with competitors is documented `[S]`. The tell is that the *format*
promises more than the method delivers. **A boundary percentage would be
App 2 committing exactly this error**, and §2.5 is the arithmetic that
says so.

**Silent coverage.** EF SET's caveats are real and published, but they
are about retest effects and small improvements `[S]`, not about what the
test did not sample. None of these products tells you what it did not
look at. For a level test that is arguably fine — level is a scalar and
any sample estimates it. **For a boundary product it is fatal**, because
boundaries are a set and an unsampled member is simply missing. This is
the failure App 2 is uniquely exposed to, and §4.4 answers it.

**Borrowed authority.** Expressing everything in CEFR letters imports the
scale's credibility onto a fifteen-minute instrument. App 2 must not
acquire a level scale, and it already has a better unit.

### 5.3 What DIALANG got right

`[S]` It reports a level *and* answer verification *and* the placement
score *and* self-assessment feedback *and* advice, and says plainly it is
not an exam. `[≈]` Two properties worth stealing whole: **the result is
several things that can disagree**, and the learner can see the
disagreement — a single number cannot be wrong in an inspectable way,
whereas four that do not quite line up invite exactly the scrutiny an
honest instrument should invite; and **the output is oriented to action
rather than certification**, which is `vision.md`'s own state-versus-score
distinction.

### 5.4 The honest result screen

`[≈]` In English, per the v0.1 decision, for someone who already speaks
it:

> **Two boundaries confirmed.**
>
> **wrote / written** — You chose *wrote* in both places where the
> sentence needed the participle. Two of two, then two of three on the
> follow-up.
> **few / a few** — Three of four.
>
> **One more looked shaky, and this test can't say.**
>
> *since / for* — one wrong answer. That's one answer. It could be a
> slip. If you want to know, three more questions will tell you.
>
> **It looked at 14 of 60 boundaries.**
>
> It did not look at conditionals, relative clauses or reported speech at
> all. Whatever is in there, this test has nothing to say about it.

Five properties, each a decision. **No score** — no "14/20", no
percentage, no level; the test measured set membership and reports set
membership. **The evidence is inline** — "two of two, then two of three"
is the learner's own audit trail, the blind-pass instinct in
`docs/agents/` pointed at the learner: whoever can check the claim will,
and whoever cannot is reassured that someone could. **The middle tier
exists, named as uncertain and not softened**, and it carries the price
of resolving it — three more questions, an offer rather than a tease.
**The denominator is a sentence, not a widget.** And **zero confirmed is
a legitimate, well-written outcome** — §6.2 says about a third of
learners see it, so it is not an edge case: *"Nothing here is confirmed.
On the 14 boundaries this looked at, you were right often enough that it
has no case to make. There are 46 it did not look at."*

### 5.5 Three refusals, written down so they can be held to

- **Never a CEFR level, or any level.** The product's claim is that a
  level is the wrong question.
- **Never a percentage on a boundary.** §2.5.
- **Never a claim from a single item**, however strong the posterior
  looks under a prior nobody has measured. §2.3.

---

## 6 · The recommended design for v0.1

### 6.1 Shape

**20 items, two stages, fixed length.**

- **Stage 1 — the screen: 11 items, one per boundary**, chosen by base
  rate under the family constraint of §4.3 (every family entered, at most
  two per family, ranked within family by prior). One of the eleven is a
  uniformly random item, for §3.5.
- **Stage 2 — confirmation: up to 3 boundaries × 3 items = 9.** The
  boundaries flagged in stage 1, worst prior first. A boundary is
  **confirmed** when at least 2 of its 3 follow-up items are also wrong —
  3 of 4 overall.
- **Unused confirmation budget reverts to screening.** A learner who
  flags nothing spends all nine remaining items on nine more boundaries,
  ending at **20 of 60 covered** — the right behaviour, since a learner
  with no flags is exactly the one who needs more coverage.

Self-report (§4.5) runs before stage 1 and raises the prior on ticked
boundaries; it never selects an item on its own.

### 6.2 What it does, simulated

`[≈]` Slip 0.10, guess 0.25, 60 boundaries. "Rate" is the conflation rate
*among the boundaries the screen chose* — base-rate weighting is what
lifts it above the population's ~0.13.

| Design | Coverage | Rate | Flags | Confirmed true | Confirmed false | P(≥1 true) | P(any false claim) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **11 + 3×3** | 11–20 | 0.15 | 2.2 | **1.04** | 0.026 | 65% | 2.6% |
| **11 + 3×3** | 11–20 | 0.30 | 3.2 | **1.93** | 0.020 | 85% | 2.0% |
| **11 + 3×3** | 11–20 | 0.45 | 4.3 | **2.18** | 0.012 | 89% | 1.2% |
| 14 + 2×3 | 14–20 | 0.30 | 4.1 | 1.29 | 0.013 | 72% | 1.3% |
| 12 + 2×4 | 12–20 | 0.30 | 3.5 | 1.13 | 0.002 | 68% | 0.2% |
| 16 + 2×2 | 16–20 | 0.30 | 4.7 | 0.86 | 0.005 | 58% | 0.5% |
| 8 + 4×3 | 8–20 | 0.30 | 2.4 | 1.52 | 0.016 | 78% | 1.6% |
| **20 flat, "1 wrong = conflated"** | 20 | 0.30 | 5.9 | 4.50 | **1.40** | 99% | **75%** |

The last row is the design that gets built without this document, and it
is the argument for the rest of it: it produces the most findings, and
**three-quarters of learners get at least one wrong claim.** At the lower
base rate its false-claim rate is 82%, and 43% of everything it prints is
false.

The recommended row confirms **one to two boundaries** and gives a false
claim to about **one learner in fifty**. That is the honest yield of
twenty items, and the reason §5.4's screen has a shaky tier and a
coverage sentence: the confirmed tier alone is too thin to be a product,
and the other two tiers are what make it one without lying.

### 6.3 What the pool must contain, and what it costs

`[≈]` Stage 2 needs 3 items on any boundary the screen might flag and the
screen needs 1, so an eligible boundary needs **4 items** — exactly what
App 1 has: 241 items across 60 categories, 4.0 each. **The v0.1 pool
already exists.** What it needs is not authoring:

1. **Explanations re-authored in English** — `vision.md` §3 costs this at
   the 45–60 hours it costed per language, paid once.
2. **A `prior` field per boundary** — the base rate, author-estimated
   against §3.3's corpus anchors. Sixty numbers, an evening.
3. **A `family` field per boundary** — seven or eight values, mostly
   derivable from App 1's ten topics.
4. **`difficultyPrior` + provenance per item** (§3.2). Optional for v0.1;
   the §6.1 design does not read it, deliberately.
5. **Cold-solve coverage on the screen candidates first.** At
   `vision.md`'s measured ~7 minutes an item, 60 screen candidates is ~7
   hours. This is the cost that cannot be delegated, and it belongs on the
   screen items because a broken screen item is a false flag that then
   consumes three confirmation items.

Not on that list: any response data, any fitting pass, any backend.

### 6.4 Storage

`[≈]` No account, per the settled scope. Result in `localStorage` in the
shape App 1 uses, so `exportState`/`importState` and the whole backup
path come across unchanged. The response log §6.5 needs is a different
thing from a per-person record: **calibration needs `(itemId, correct)`
counts, not `(personId, itemId, correct)` rows.** Aggregate counts buy
every calibration in §3.4 and create no data-protection duty — the same
argument `retention-and-pricing.md` made for local notifications over web
push, arriving here independently.

### 6.5 The upgrade path

- **First 100 takers.** No algorithm change. Retire items at n ≥ 30 that
  are answered wrong by >85% or right by >95% (§3.4) — a broken screen
  item is this design's most expensive defect.
- **300 takers** (±14 pp per item). Replace the author's per-boundary
  `prior` with the observed flag rate — the highest-value substitution
  available, since §4.2 says the prior is the lever. And check the slip
  assumption: `s` is directly estimable as the wrong-answer rate on
  boundaries the confirmation stage then cleared.
- **600 takers** (±10 pp). `difficultyPrior` may become `"observed"`. The
  screen can become genuinely adaptive within stage 1, re-ranking after
  each answer, since a wrong answer on a determiner boundary raises the
  posterior on its family `[?]` — a correlation assumed here and needing
  its own measurement.
- **Never, at this data volume:** a 2PL calibration, a fitted G-DINA, a θ
  estimate, or a level.

### 6.6 What v0.1 must refuse to do

Report a score, a percentage or a level (§5.5). Claim a boundary from one
item (§2.3). Hide the coverage denominator (§4.4). Present the shaky tier
as a finding, or hide it (§5.4). And ask for an email before showing the
result — the result *is* the product, and gating it turns an honest
instrument into a lead magnet, which the audience that would pay is
precisely the audience that notices.

---

## 7 · Where I would be wrong

`[≈]` In descending order of cost.

**1. Slip is not 0.10.** Everything in §2.3, §2.4 and §6.2 rides on it.
At `s = 0.20` — plausible on a phone, in a fourth language, with no
stakes — the recommended design's false-claim rate rises roughly
fourfold (the 2-of-2 gate goes from 1% to 4% per boundary) and "3 of 4"
stops being comfortable. **This is the first thing to measure**, and it is
measurable from the app's own logs at n ≈ 300 (§6.5). If it comes back
high, the answer is a fourth follow-up item, not a softer threshold.

**2. Boundaries are not independent.** I treat 60 posteriors as
independent, which is certainly false — someone who smears *since/for*
probably smears other time prepositions. Dependence is *good* for recall
(one flag informs a family) and *bad* for the false-positive arithmetic
(errors correlate, so a bad day flags a cluster). I expect the net mildly
favourable and would not bet on it.

**3. The base rates might be flat.** §4.2's tripling assumes the sampled
set can be enriched from 0.13 to 0.30. If conflation is roughly uniform —
if everyone's set is idiosyncratic, the *optimistic* reading of the
product's own premise — base-rate weighting buys nothing, recall stays
near 25%, and honest yield is one confirmed boundary rather than two. The
design still works; the marketing gets thinner.

**4. The audience might not tolerate the hedge.** Everything here assumes
a learner shown "two confirmed, one shaky, 46 not looked at" reads it as
rigour. They might read it as the app not knowing. `vision.md` already
flags the parallel risk — the audience may be too low-level for
English-medium explanation — and this is its measurement cousin; both are
answered by the same cheap experiment, which is another argument for v0.1
being the diagnostic alone.

**5. Every psychometric figure in §3 is a search summary.** The
expert-judgement correlations (.23–.50), the LLM figures (.75–.87), the
~500-per-item rule and the routing findings were read as summaries. The
.23–.32 single-judge translation of Thorndike is a derived quantity in
someone else's paper and I could not check the derivation; if the expert
figure is really .5, §3.1's dismissal is too harsh — though it would not
change the v0.1 design, which does not read difficulty at all.

**6. I may be over-solving.** A defensible alternative: ship the 20-item
screen with one tier and honest copy — *"here is what you got wrong
today"* — make no boundary claim at all, and let the lessons do the
diagnosing. Cheaper, cannot be wrong, gives up the wedge. I do not
recommend it, because "what you got wrong today" is what App 1 already
does and is not a reason for App 2 to exist. But that it is cheaper and
cannot be wrong is worth having said.

---

## 8 · Sources

Search summaries only; nothing read at source.

- [Effects of Calibration Sample Size and Item Bank Size on CAT](https://files.eric.ed.gov/fulltext/EJ1101283.pdf) · [Accounting for item calibration error in CAT](https://link.springer.com/article/10.3758/s13428-025-02649-8) · [Optimal Online Calibration Designs for Item Replenishment](https://link.springer.com/article/10.1007/s11336-019-09687-0) · [Item Calibration With Small Samples Under Multistage Test Design](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12376)
- [Mastery accuracy under Rasch and DINA](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8381025/) · [Diagnostic Classification Models in Small Sample Contexts](https://arxiv.org/pdf/2104.10975) · [Non-identifiability in Q-matrix based CDMs](https://arxiv.org/pdf/1303.0426) · [Item Selection Accommodating Practical Constraints in CD-CAT](https://frontiersin.org/articles/10.3389/fpsyg.2021.619771/full) · [Interim CD-CAT in a Learning Context](https://pmc.ncbi.nlm.nih.gov/articles/PMC8202977/)
- [A Modified Sequential Probability Ratio Test](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9053723/)
- [Multistage Testing With Intersectional Routing for Short-Length Tests](https://pmc.ncbi.nlm.nih.gov/articles/PMC7003183/) · [Misrouting Under Two-Stage Multistage Testing](https://onlinelibrary.wiley.com/doi/10.1002/ets2.12000)
- [Estimating Item Difficulty With Comparative Judgments (Attali, ETS)](https://files.eric.ed.gov/fulltext/EJ1109277.pdf) · [Estimating item difficulty using LLMs and tree-based ML](https://www.sciencedirect.com/science/article/pii/S156042922601317X) · [Synthetic Student Responses: LLM-Extracted Features for IRT Difficulty](https://arxiv.org/abs/2602.00034) · [Estimating Real Difficulty with LLM Student Simulations](https://arxiv.org/html/2601.09953)
- [Formula Scoring of Multiple-Choice Tests (Frary)](https://onlinelibrary.wiley.com/doi/10.1111/j.1745-3992.1988.tb00434.x) · [Spearman-Brown and Reliabilities of Random Test Forms](https://arxiv.org/pdf/2308.13811) · [Sensitivity, Specificity and Predictive Values](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2017.00307/full)
- [Duolingo placement test](https://duolingo.fandom.com/wiki/Placement_test) · [Partial credit improvements to Duolingo's placement test](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/) · [EF SET Quick Check](https://www.efset.org/quick-check/) · [EF SET FAQ](https://www.efset.org/faq/) · [Cambridge — Test your English](https://www.cambridgeenglish.org/test-your-english/) · [DIALANG review](https://www.researchgate.net/publication/249908068_DIALANGA_diagnostic_language_assessment_system_review) · [DIALANG 2.0, Lancaster LTRG](https://wp.lancs.ac.uk/ltrg/projects/dialang-2-0/) · [On the Adequacy of ELSA Speak in Formal Education](https://www.oajaiml.com/uploads/archivepdf/217742138.pdf) · [AI Pronunciation Scoring Compared](https://www.trancy.org/blog/ai-pronunciation-scoring-compared-trancy-vs-speak-vs-elsa-in-2026-35b9d2252005816bb5bdd205875c930f)
- [Cambridge Learner Corpus — error coding and analysis (Nicholls)](http://ucrel.lancs.ac.uk/publications/CL2003/papers/nicholls.pdf) · [Biases in Self-Ratings of Second Language Proficiency](http://sites.psych.ualberta.ca/IClab/wordpress/wp-content/uploads/2016/08/MacIntyreNoelsClement1997.pdf) · [Self-assessment as a measure of speaking proficiency (SSLA)](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/closer-look-at-a-marginalized-test-method-selfassessment-as-a-measure-of-speaking-proficiency/786D4E0E0D500DCDD43CCE24ED610592)

Internal, and load-bearing above: `js/storage.js` (`getWeakCategories`,
`getItemStats`, `wilsonUpper`, `MIN_ITEMS_FOR_WEAK_CLAIM`);
`docs/research/learner-model.md` §2.4–2.6; `docs/business/vision.md` §3;
`docs/business/retention-and-pricing.md` §0; `CLAUDE.md`;
`data/manifest.json` and `data/**` (241 items, 60 categories, no
`difficulty` field).
