# Learner model

What the app should know about the learner, how it should work that out,
and what it should say about it.

Written against the app as it stands: 3 topics, 18 categories, 18 lessons,
72 questions — **exactly four questions per category** — with an aggregate
attempt history in `localStorage` and no notion of time.

**The short version.** The most valuable change is not a scheduler. It is
recording *which wrong answer* the learner picked and *when* they picked
it, at the item level, and then being far more honest than the app
currently is about how little four questions can tell you. Everything a
spaced-repetition algorithm would buy is dominated, at this content
volume, by the fact that the learner runs out of questions. Track time and
distractors, weight recent evidence over old, schedule *categories* rather
than items, refuse to show a percentage the data does not support, and
spend the saved effort on more questions.

---

## 0 · The shape of the problem, before any of the theory

Three facts decide most of this document, and none of them is about
algorithms.

**Four questions per category.** Not four hundred. A learner who does two
mixed tests and one topic test has seen a meaningful fraction of the
whole corpus. On second encounter a question no longer measures grammar:
it measures whether you remember that the answer to the Elif-in-the-library
one is "goes". Every mastery estimator in the literature assumes a supply
of fresh items drawn from the skill; this app does not have one. That is
the binding constraint, and §4.1 argues it is the most important thing on
this page.

**There is a deadline.** This is exam prep, not a lifelong vocabulary
habit. The learner has a proficiency exam on a date, and after it the app
is finished with them. Spaced repetition research is explicit that the
optimal spacing is a function of the *retention interval* ([Cepeda et al.
2008](https://escholarship.org/uc/item/0kp5q19x)) — and here the retention
interval is knowable to the day. That is a free, powerful input that no
off-the-shelf scheduler uses, because no off-the-shelf scheduler knows
when your exam is. §4.2.

**The learner is one of about five people, and the owner is one of them.**
There is no A/B test, no cohort, no analytics. Any model whose parameters
have to be *fitted* to a population cannot be fitted here. Anything
proposed must work correctly the first time a single person uses it, from
zero data, with parameters chosen by argument rather than by tuning.

---

## 1 · What to record

### 1.1 What is recorded now

One record per completed attempt, appended to `englishPrep.history`:

```json
{
  "date": "2026-09-03T18:40:11.201Z",
  "mode": "mixed",
  "topicBreakdown":    { "tenses": { "correct": 7, "total": 10 } },
  "categoryBreakdown": { "Future Forms": { "correct": 1, "total": 2 } },
  "questions": [ { "id": "tenses-t1", "topicId": "tenses", "correct": true } ]
}
```

Everything Profil and the results screen show is a sum over this array.
The shape is honest and it has one genuinely good property: the
`questions` array is a per-item record, so the raw material for a better
model is *almost* already there.

Four things are missing, in descending order of what they would buy:

1. **Which wrong option was chosen.** `correct: true|false` throws away
   the diagnosis. In a four-option cloze the distractor *is* the
   misconception: picking `is going` for a habitual `every morning` is a
   different error from picking `went`, and they need different remedies.
   This is one integer.
2. **When each answer happened.** The attempt has a `date`; the items
   inside it do not, and more importantly nothing downstream ever reads
   the date. Every question in this document that begins "should we…"
   — schedule, decay, weight, warn — needs a timestamp, and none of them
   can be added later for data already collected.
3. **The category on the item.** `categoryBreakdown` carries it in
   aggregate, but the per-question entry does not, so per-category recency
   has to be reconstructed by re-loading the content files and joining on
   question id. Denormalising one short string removes that dependency.
4. **Whether the item had been seen before.** Derivable from the log if
   the log is per-item and complete, which is the argument for keeping one.

Not missing, and worth naming so it does not get added: the learner's
name is already optional and local; nothing else identifying should ever
be recorded.

### 1.2 The record I would keep

Two structures, because they have different lifetimes and different jobs.

**An event log — append-only, capped, the source of truth.** Tuples, not
objects, because the key names would otherwise be 60% of the bytes:

```json
{
  "v": 1,
  "events": [
    ["tenses-t1", 20334, 1043, 0, 1, 4200],
    ["modals-t7",  20334, 1102, 2, 0, 9100]
  ]
}
```

Positional, one row per answered question:

| # | Field | Meaning |
| --- | --- | --- |
| 0 | `qid` | question id — already unique across topics |
| 1 | `day` | days since 2026-01-01, local time. Integer, ~5 digits for a century |
| 2 | `min` | minute of the local day, 0–1439 |
| 3 | `pick` | index of the chosen option **in the authored order**, or `-1` for skipped |
| 4 | `ok` | 1 correct, 0 wrong |
| 5 | `ms` | response time in ms, clamped to 60000 |

`day`+`min` rather than an ISO string is not premature optimisation: an
ISO timestamp is 24 characters and this is 10, on the one field that
appears in every row. Splitting them also makes "was this the same study
session?" a subtraction rather than a `Date` parse.

`pick` must be the index in the **authored** option order, not the
shuffled order the learner saw, or it means nothing after the fact.
`js/quiz-engine.js` currently shuffles options into the session object and
scores by string comparison, so this needs the authored index carried
through — a small change to `buildQuizSession`.

`ok` is redundant given `pick` and the content files, and I would keep it
anyway: it makes every consumer of the log independent of loading
`data/`, and it survives a question being edited after the fact.

**Derived per-item state — recomputable, cached, small.** Keyed by
question id:

```json
{
  "v": 1,
  "items": {
    "tenses-t1": { "n": 3, "k": 2, "last": 20334, "lastOk": 1, "picks": [2, 0, 0] }
  }
}
```

and per-category state, which is what the app actually reasons about:

```json
{
  "v": 1,
  "cats": {
    "Future Forms": { "n": 9, "k": 5, "w": 3.42, "wn": 5.10, "last": 20334, "seen": 4, "due": 20337 }
  }
}
```

`w`/`wn` are the recency-weighted correct and total from §2.5; `seen` is
how many of the category's items have ever been answered (out of four);
`due` is the day the category next wants attention. All of it is a pure
function of the log, so it can be thrown away and rebuilt — which is the
point. **Never persist a number you cannot recompute**, because the
formula in §2.5 *will* change and a stored `w` computed under the old one
is silently wrong.

### 1.3 What it costs, measured

Sizes below are `JSON.stringify` character counts, measured against the
real content files. `localStorage` stores UTF-16, so the quota cost is
roughly **2 bytes per character**.

| Thing | Chars | As UTF-16 |
| --- | --- | --- |
| One current-shape attempt (10 questions) | 735 | 1.4 KiB |
| 400 attempts (a year of daily practice, current shape) | 294,000 | **0.56 MiB** |
| One event tuple | 22 | 44 B |
| 10,000 events (a year of heavy use) | 220,000 | **0.43 MiB** |
| Per-item state, all 72 items | ~3,300 | 6.5 KiB |
| Per-category state, all 18 categories | ~1,800 | 3.5 KiB |

Ten thousand answered questions in a year is deliberately pessimistic:
it is 30 questions a day, five days a week, for eight months. A realistic
prep season — 20 minutes a day for three months — is nearer 2,000 events,
about 90 KiB.

**So the event log is cheaper than the aggregate history it replaces.**
That is not a coincidence: the current record stores the same per-item
facts *plus* two breakdown objects whose keys are long English category
names repeated in every attempt.

Against the quotas:

- **Chrome and other Chromium browsers**: Web Storage is capped per origin
  independently of the general storage quota. MDN gives 10 MiB
  ([Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria));
  the historically documented Chromium figure is 5 MiB of UTF-16, i.e.
  ~5 million characters. Take the smaller.
- **Safari, iOS and macOS**: 5 MiB per origin for `localStorage`
  specifically, which is the number that matters here. The much larger
  figures Apple published for Safari 17 — up to ~20% of disk per origin,
  up to 60–80% overall
  ([Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/))
  — are the *general* storage quota governing IndexedDB and Cache, not
  Web Storage.
- **Firefox**: 5 MiB per origin for Web Storage; the general quota is a
  fraction of disk under the same eviction rules as everyone else.

**A year of pessimistic use is under 10% of the smallest quota.** Storage
size is not a reason to avoid an event log, and — this is the point of
measuring — it is also not a reason to avoid *capping* one. A ring buffer
at 5,000 events (~110 KiB) is free insurance against a pathological case
and against the app ever being one of several things sharing the origin.
Drop from the front; rebuild derived state from what remains.

`writeJson` in `js/storage.js` already swallows `QuotaExceededError`
silently, which is the right failure for a name field and the wrong one
for a study log: the learner would keep practising and keep losing it.
See §3.4.

### 1.4 What actually deletes it

Quota is the least of it. Three mechanisms remove `localStorage`, in
increasing order of how likely they are to hit this app.

**Explicit clearing.** "Clear browsing data", private browsing ending,
uninstalling the browser. Nothing to be done; the learner did it.

**Eviction under storage pressure.** The [Storage
Standard](https://storage.spec.whatwg.org/) makes this normative and
unambiguous: a bucket has a mode of `"best-effort"` (the default) or
`"persistent"`, and *"a user agent that comes under storage pressure
should clear network state and local storage buckets whose mode is
'best-effort', ideally prioritizing removal in a manner that least impacts
the user."* In practice this is least-recently-used, and a study app used
every day is a poor eviction candidate. `navigator.storage.persist()`
upgrades the bucket to `"persistent"`, which the spec says the user agent
should only clear after informing the user. It is a permission-gated call
and it is one line.

**Safari's seven-day cap on script-writable storage. This is the one that
will bite.** Since Safari 13.1 / iOS 13.4, WebKit deletes *all* of a
site's script-writable storage — LocalStorage, SessionStorage, IndexedDB,
Media Keys, Service Worker registrations — after **seven days of Safari
use without user interaction on that site**
([Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/),
[Tracking Prevention in WebKit](https://webkit.org/tracking-prevention/)).

The precise conditions matter, because most of what is written about this
online gets them wrong:

- It applies to **every** site, not only to domains ITP has classified as
  trackers. There is nothing this app can do to be exempted by behaving
  well.
- The counter is **days on which Safari was used**, not calendar days. A
  learner who does not open Safari for a fortnight has not spent any of
  the seven days. A learner who browses daily spends one per day.
- **User interaction on the site resets it.** A tap, a click, or text
  entry. Opening the app and answering one question is a reset; the app
  cannot reset it from script.
- **Home-screen web apps are exempt from Safari's counter.** A site added
  to the home screen is not running in Safari and keeps its own
  usage counter, which only ticks on days the web app itself is used.

Read against this app's actual usage: a Turkish student cramming for a
proficiency exam does not practise every day. They practise, get busy for
two weeks, and come back. If they browse the web on their phone during
those two weeks — they do — the app's storage is gone when they return,
and with it every score, every lesson tick and their name. Silently, with
the app showing a cheerful empty state.

The mitigations, in order of effect: **tell them to add it to the home
screen** (removes the problem entirely, and is a two-tap instruction),
**offer an export** (§3.4), and call `navigator.storage.persist()`
because it costs one line even though there is no first-party WebKit
documentation confirming it defeats the ITP timer — reports that it does
are anecdotal and I would not promise the learner anything on the
strength of them.

### 1.5 Migrating from what exists

The current history cannot be converted into an event log — it has no
per-item time and no `pick`. Do not fabricate them. Convert what is
convertible and mark it:

- For each existing attempt, emit one event per `questions` entry with
  `day`/`min` taken from the attempt's `date`, `pick: -1`, `ms: -1`, and
  `ok` from the record. Losing which distractor was chosen is losing
  something that was never captured.
- Bump the storage version. `storage.js` already has the right instinct
  here — `getAllLessonProgress` normalises a legacy `{step}` shape rather
  than trusting it, and `getCategoryTotals` skips pre-category attempts
  instead of crashing. Same discipline: read old shapes, write only the
  new one, never let a malformed entry take a screen down.
- Keep `englishPrep.history` untouched for one release, then delete it.
  It is 0.5 MiB in the worst case and the cost of being able to undo a
  bad migration.

---

## 2 · Turning records into knowledge

### 2.1 What the evidence actually supports

Two findings are solid enough to design against, and it is worth being
precise about what they say, because the gap between them and "therefore
ship FSRS" is wider than the spaced-repetition literature's popular
summaries suggest.

**Spacing beats massing, and the right gap grows with the retention
interval.** [Cepeda, Pashler, Vul, Wixted & Rohrer (2006)](https://pubmed.ncbi.nlm.nih.gov/16719566/),
*Psychological Bulletin* 132, 354–380, synthesised 254 studies and over
14,000 observations of verbal recall: distributed practice beats massed
practice, and — the part that matters for scheduling — the inter-study
interval producing maximal retention *increases as the retention interval
increases*. [Cepeda, Vul, Rohrer, Wixted & Pashler (2008)](https://escholarship.org/uc/item/0kp5q19x),
*Psychological Science* 19, 1095–1102, put numbers on it with over 1,350
participants taught a set of facts, reviewed after a gap of up to 3.5
months and tested up to a year later: **the optimal gap was about 20% of
the test delay for delays of a few weeks, falling to about 5% at a
one-year delay.** For a learner sitting an exam in eight weeks, "20% of
the delay" is about ten days — a much shorter interval than any
general-purpose SRS would settle on.

**Retrieval beats review.** [Roediger & Karpicke (2006)](https://pubmed.ncbi.nlm.nih.gov/16507066/),
*Psychological Science* 17, 249–255: students who studied prose passages
and took recall tests retained more at delay than students who restudied
the same material the same number of times, *without feedback*. The Test
tab is not a measuring instrument that happens to teach; it is a teaching
instrument that happens to measure. This is the single strongest argument
for the app existing at all, and it deserves to be said in the interface
(§3.3).

Neither finding validates a scheduler. They say: spread practice out,
practise by retrieving. Everything past that is engineering with weaker
support.

### 2.2 Leitner, SM-2 and FSRS, honestly

| | Input per review | Arithmetic | Per-item state | Fitted parameters |
| --- | --- | --- | --- | --- |
| Leitner | correct / incorrect | one increment | box index | none |
| SM-2 | self-graded quality 0–5 | two multiplications | `EF`, `n`, `I` | none (constants are Woźniak's, from 1987) |
| FSRS-6/7 | grade + elapsed time | exponentials, power law | `D`, `S`, last review | 21 (FSRS-6) / 34 (FSRS-7), fitted per user |

**Leitner (1972).** *n* boxes; a correct answer promotes an item one box,
a wrong answer sends it back to box 1; box *i* is reviewed every *k*ⁱ
days. It needs a boolean and stores an integer.

Its evidence base is thinner than its reputation. What is well supported
is the mechanism it encodes — expanding spacing with retrieval — not the
boxes. Direct experimental tests of the Leitner system itself are a
handful of small classroom vocabulary studies; there is no Leitner
equivalent of Cepeda's meta-analysis. That is not a reason to avoid it.
It is a reason not to claim more for it than "a defensible encoding of a
well-supported principle".

**SM-2 ([Woźniak, 1990](https://super-memory.com/english/ol/sm2.htm)).**
`I(1)=1`, `I(2)=6`, `I(n)=I(n−1)·EF`, with

```
EF' = EF + (0.1 − (5 − q)·(0.08 + (5 − q)·0.02))     clamped to EF ≥ 1.3
```

where `EF` starts at 2.5 and `q` is the learner's **self-graded** quality
of recall on a 0–5 scale; `q < 3` restarts the repetition count while
keeping `EF`.

That `q` is disqualifying here, and not for an implementation reason. A
paragraph cloze produces a boolean, not a six-point self-assessment, and
§3.2's calibration literature says learners' own confidence judgements are
systematically miscalibrated — so asking for `q` would import noise
dressed as signal. Map the boolean onto `q ∈ {2, 5}` and SM-2 collapses
into Leitner with a per-item multiplier, which is a fair description of
what it then is. The constants are one person's tuning from 1987 against
his own collection; they have never been independently validated as
optimal.

**FSRS.** A three-variable memory model — Difficulty, Stability,
Retrievability — where stability is the interval at which recall
probability has fallen to 90%, and retrievability follows a power-law
forgetting curve. It is the current state of the art, and the benchmark
behind it is genuinely large: the
[srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark)
evaluates on **9,999 Anki collections and ~350 million reviews** (from a
727-million-review dataset), split with `TimeSeriesSplit` so older reviews
train and newer reviews test.

What it reports, without same-day reviews:

| Algorithm | Log loss ↓ | RMSE(bins) ↓ | AUC ↑ | Params |
| --- | --- | --- | --- | --- |
| FSRS-7 | 0.3401 | 0.0634 | 0.7167 | 34 |
| FSRS-6 | 0.3460 | 0.0653 | 0.7034 | 21 |
| GRU | 0.3328 | 0.0549 | 0.7324 | 503 |
| `AVG` (constant per-user average) | 0.3945 | 0.1034 | 0.4997 | 0 |

Read this carefully before quoting it:

- **It measures calibration of a predicted recall probability, not
  learning.** The benchmark's own limitations section says it "evaluates
  predictive accuracy specifically, not practical scheduling quality".
  Nobody has run the experiment that would matter here — an RCT of FSRS
  against Leitner on exam outcomes.
- **It is the FSRS authors' own benchmark**, on data from a system where
  FSRS itself generated many of the intervals under evaluation.
- **The margin over a trivial baseline is real but not enormous.** A
  constant per-user average scores 0.3945 log loss against FSRS-7's
  0.3401. The AUC gap (0.50 → 0.72) is the more meaningful one.
- **The 34 parameters are fitted from the learner's own history**, and the
  optimiser needs on the order of a thousand reviews before beating the
  defaults. Our learner will produce a few hundred, spread over 72 items.

Duolingo's [half-life regression](https://research.duolingo.com/papers/settles.acl16.pdf)
(Settles & Meeder, ACL 2016) is the honest counterexample to my own
scepticism: they report ~45% error reduction over baselines at predicting
recall, and ~16% improvement in measured recall from replacing fixed
intervals with a learned forgetting model. But HLR is a regression fitted
over *hundreds of millions* of trials across *millions* of learners. It is
evidence that this class of model works at Duolingo's scale, and no
evidence at all about what it does with one student and 72 items.

### 2.3 The unit: not the item, the category

**This is the decision the rest follows from, and I think the app's
natural unit is the category, not the question.**

Every one of the three schedulers assumes the same world: a large pool of
*independent* items, each an atomic cue–response pair with its own
forgetting curve, and an unlimited supply of them. An Anki user has five
thousand cards. This app has 72 questions in 18 groups of four, and the
four in a group are not independent — they are four probes of one rule.

Item-level scheduling breaks here in three ways:

1. **The items collide.** You cannot stagger four items across a
   two-month schedule without either leaving the category untouched for
   weeks or reviewing three of its items in one sitting. With four items
   the intervals have nowhere to go.
2. **The latent variable is wrong.** After the second exposure, "can the
   learner answer `tenses-t1`?" measures memory for that sentence, not
   command of Present Simple versus Present Continuous. Scheduling by
   item-recall optimises the thing we do not care about. (§4.1.)
3. **The whole app is already category-keyed.** `lessonId(topicId,
   category)` is the join between a wrong answer and the lesson that
   fixes it; `getWeakCategories` ranks by category; the results screen
   links category rows to lessons. The taxonomy is the model.

So: **the schedulable unit is the category — 18 of them — and questions
are interchangeable probes drawn from it.** A category is what the
intelligent-tutoring literature calls a knowledge component: the thing
that is learned, that transfers, and that a lesson teaches. Item selection
inside a category becomes trivial and solves exhaustion at the same time:
*least recently answered first, ties broken randomly*, which with four
items gives a natural rotation.

There is a second, quieter reason. All three schedulers model the decay of
arbitrary paired associates, because that is what flashcards are. A
grammar rule is not an arbitrary association: it is re-derivable from the
lesson, it decays more slowly, and a learner who has "forgotten" it has
usually not lost it but failed to notice the trigger. Importing a
flashcard forgetting curve wholesale would be modelling the wrong kind of
memory.

### 2.4 Mastery estimation, and where it stops paying

**Bayesian Knowledge Tracing** (Corbett & Anderson, 1995; see Pelánek's
[overview of learner-modelling techniques](https://link.springer.com/article/10.1007/s11257-017-9193-2)
and the [25-year systematic review](https://link.springer.com/article/10.1007/s11257-023-09389-4))
gives each skill four parameters — prior knowledge `P(L0)`, learn rate
`P(T)`, guess `P(G)`, slip `P(S)` — and tracks a posterior probability of
mastery. It is the right *conceptual* model for this app: skills, not
cards; a binary latent "knows the rule"; explicit guess and slip terms.

It is the wrong *implementation*. Its parameters are fitted across a
population — thousands of students per skill — and there is a
well-documented identifiability problem: different parameter sets fit the
same data equally well, and some fitted solutions are degenerate (a model
where getting it right makes mastery *less* likely). Fitting 18 skills ×
4 parameters from one learner's few hundred answers is not estimation, it
is curve-drawing.

But steal the guess term, because at four options it is brutal. If the
learner guesses uniformly, on four questions:

| Score by pure guessing | Probability |
| --- | --- |
| 0/4 | 31.6% |
| 1/4 | 42.2% |
| 2/4 | 21.1% |
| 3/4 | 4.7% |
| 4/4 | 0.4% |

**A learner who knows nothing scores at least 1/4 more often than not
(68.4%), and gets 2/4 or better a quarter of the time (26.2%).** The app
currently labels a category "weak" at 3 or more attempts with accuracy
below 100% and shows the fraction. Under that rule a learner guessing at
random is labelled "weak" in a four-item category **99.6% of the time** —
the only escape is a 4/4 fluke. The rule as written cannot distinguish a
weakness from chance, because it was never asked to. Any claim the app
makes about a category from four observations has to be made with that
table in mind.

**Elo**, as used in adaptive educational systems
([Pelánek, 2016](https://dl.acm.org/doi/10.1016/j.compedu.2016.03.017);
[Klinkenberg, Straatemeier & van der Maas, 2011](https://www.sciencedirect.com/science/article/abs/pii/S036013151630080X),
*Computers & Education* 57, 1813–1824, the Math Garden system used by
Dutch primary schools), treats each answer as a match between learner
skill θ and item difficulty *d*:

```
P(correct) = 1 / (1 + e^-(θ − d))
θ ← θ + K · (outcome − P)
d ← d − K · (outcome − P)
```

with a single parameter *K*, or an uncertainty function `K(n) = a/(1+b·n)`
that shrinks the step as evidence accumulates. Pelánek's argument for it
is exactly the one that should appeal here: it needs one parameter instead
of BKT's four per skill, it runs online with no fitting pass, and it is
competitive on accuracy.

It still does not survive contact with this app. Elo's power comes from
estimating θ and *d* jointly from many learners crossing many items; with
one learner they are not separately identifiable. Fix *d* from the
authored difficulty and only update θ, and what remains is a logistic
recency-weighted accuracy with extra steps. Which is fine — but say so
rather than calling it Elo.

**So: recency-weighted accuracy, with an explicit prior and an explicit
confidence.** Not because it is best, but because at this data volume it
is inside the noise of anything better, and the Wilson intervals say why:

| Observed | Point estimate | 95% Wilson interval |
| --- | --- | --- |
| 0/4 | 0% | 0% – 49% |
| 1/4 | 25% | 5% – 70% |
| 2/4 | 50% | 15% – 85% |
| 3/4 | 75% | 30% – 95% |
| 2/8 | 25% | 7% – 59% |
| 5/20 | 25% | 11% – 47% |

**A category score of 1/4 is consistent with anything from "guessing" to
"knows it and slipped".** Twenty observations — five full passes through
a category's four questions, by which point the learner has memorised
them — still leaves a 36-point interval. No estimator recovers signal
that is not in the data. The complexity budget should go into
*representing that uncertainty*, not into a better point estimate.

### 2.5 What I would actually compute

Thirty lines of arithmetic in a pure module, no dependencies, unit-testable
in the style of `tests/quiz-engine.test.js`.

**Recency weighting.** For each event *i* in category *c*, with `today`
and `day_i` as integer days:

```
w_i = 0.5 ^ ((today − day_i) / H)          H = 14 days
K_c = Σ w_i · ok_i                          weighted correct
N_c = Σ w_i                                 weighted total
```

`H = 14` is the one number here chosen by argument rather than derivation:
a prep season is 6–12 weeks, so a fortnight is long enough that last
week's practice still counts and short enough that a category fixed a
month ago stops being called weak. The weights it produces:

| Answered | Weight |
| --- | --- |
| today | 1.00 |
| 3 days ago | 0.86 |
| 1 week ago | 0.71 |
| 2 weeks ago | 0.50 |
| 4 weeks ago | 0.25 |
| 2 months ago | 0.05 |

This alone fixes a real defect. `getWeakCategories` today sums lifetime
totals, so a category the learner has *fixed* stays on the weak list
forever: 1/4 then 4/4 then 4/4 reads as 9/12 = 75% and still ranks below
a category tried once at 3/4. Under recency weighting the old failure
decays out. Five lines.

**The estimate.** A Beta posterior mean, which is two extra terms:

```
â_c = (K_c + α·p₀) / (N_c + α)             α = 2, p₀ = 0.55
```

`α = 2` is a pseudo-count: two imaginary prior answers, so no single
observation can drive the estimate to 0 or 1. `p₀ = 0.55` sits above the
0.25 guess floor and below "knows it", so an unattempted category is not
ranked as the weakest thing the learner has. What it produces:

| Weighted evidence | â |
| --- | --- |
| nothing | 55% |
| 0/1 | 37% |
| 1/1 | 70% |
| 0/4 | 18% |
| 1/4 | 35% |
| 2/4 | 52% |
| 4/4 | 85% |

**Confidence, as a multiplier rather than a threshold.**

```
conf_c = N_c / (N_c + 3)
```

`MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3` is currently a cliff: two answers say
nothing, three say everything. A shrinkage factor is the same idea without
the cliff — thin evidence is ranked, just quietly.

**What to practise next.**

```
priority_c = (1 − â_c) · conf_c · overdue_c · fresh_c

overdue_c = min(1, (today − last_c) / interval_c)
fresh_c   = (items in c not answered in the last H days) / 4
```

`fresh_c` is the item-exhaustion guard from §4.1: it stops the app
recommending a category whose four questions the learner answered an hour
ago, which a pure weakness ranking would otherwise do forever.

**The interval, and the exam.**

```
interval_c = clamp(2 · 2^streak_c, 1, D / 3)
```

where `streak_c` is the number of consecutive category sessions scored
≥ 3/4 and `D` is days remaining to the exam (§4.2). Base 2 days,
doubling: 2, 4, 8, 16, 32, 64. The `D/3` clamp is the part no off-the-shelf
scheduler can do — an interval longer than a third of the remaining time
schedules a category for one more look and then never again, which is
exactly wrong before a deadline. With no exam date, clamp at 21 days
instead and say the schedule is a guess.

Everything above is a pure function of `(events, today, examDate)`. That
is the property worth protecting: it can be rewritten wholesale without
migrating anyone's data.

### 2.6 The cold start

Serious systems solve this three ways: a **population prior** (start the
learner at the cohort mean — Klinkenberg's Math Garden, every CAT system),
a **placement test**, or **content-derived difficulty** (estimating item
difficulty from features of the item before any learner sees it —
[Fischer et al., 2021](https://link.springer.com/article/10.1007/s42113-021-00101-6)).

None is available. There is no cohort. A placement test covering 18
categories at 4 items each *is the entire corpus*, so administering one
destroys the thing it is measuring. And content-derived difficulty needs a
trained model.

**So the app should not have a model at the start, and should say so.**
Concretely:

- Until a category has any weighted evidence, it is not ranked, not called
  weak, and not shown a percentage. The Turkish for this already exists in
  Profil's empty state — extend the same honesty to the per-category level.
- Recommend by **curriculum order**, which the manifest already encodes:
  `tier: "foundations"` before `tier: "core-grammar"`. That is the owner's
  editorial judgement about what to learn first, and it is a better prior
  than anything inferred from three answers.
- Use the **lesson progress that already exists** as a weak prior. Having
  read a category's lesson and never tested it is a different state from
  having done neither, and it is the single most useful thing to recommend:
  "you read this, now check it".
- Let the first mixed test be an implicit placement without calling it one.
  Ten questions touch six or so categories once each. That is enough to
  say "these are the ones you missed" and not enough to rank anything —
  which is exactly what the app should then say.

---

## 3 · What to show, and what to do with it

### 3.1 Feedback on errors

**Timing: immediate, and the app already has it right.** Kulik & Kulik
([1988](https://journals.sagepub.com/doi/abs/10.3102/00346543058001079),
*Review of Educational Research*, 53 studies) found the split that has
held up since: **delayed feedback wins in laboratory acquisition studies,
immediate feedback wins in applied studies using real classroom quizzes
and real material.** Van der Kleij, Feskens & Eggen
([2015](https://journals.sagepub.com/doi/abs/10.3102/0034654314564881),
*Review of Educational Research* 85(4), 40 studies, 70 effect sizes)
found effect sizes in computer-based environments were *negatively*
affected by delayed timing. This app is the applied case.

One qualification, and it is a product idea rather than a caveat. The İYS
is an uninterrupted paper: you answer forty questions and find out
nothing until it is over. Immediate per-item feedback is the right
*learning* design and the wrong *exam rehearsal*. That argues for a second
mode — a deneme where feedback is withheld to the end — not for changing
the Test tab. Worth noting that the deneme mode is also the only place the
app could collect an uncontaminated measurement, because feedback between
items teaches.

**Type: elaborated, and the app already has that right too, with a
number.** Van der Kleij et al. found elaborated feedback (an explanation)
at *g* = 0.49, against 0.32 for knowledge of the correct response and
**0.05 for bare correct/incorrect**, with the advantage largest for
higher-order outcomes. Bare verification is worth approximately nothing.

The app's current block is explanation + `Kural:` transferable rule —
elaborated feedback with an explicit transfer prompt, which is the top of
that ranking. Do not simplify it. The one improvement available is
**distractor-specific**: with `pick` recorded (§1.2), the block could
address the option actually chosen rather than the option most learners
choose. The sample question's explanation already does this by hand for
one distractor ("'is going' anlık bir eylem için kullanılırdı"); doing it
for all three is a content-schema change, and belongs in the deferred pile
until the volume problem in §4.1 is settled.

**The wall of red.** This is the part worth being careful about. Kluger &
DeNisi ([1996](https://psycnet.apa.org/record/1996-01216-001),
*Psychological Bulletin* 119(2), 254–284) meta-analysed 607 effect sizes
from 23,663 observations: feedback improved performance on average
(*d* = 0.41), but **over a third of feedback interventions made
performance worse.** Their account is that feedback which draws attention
to the *self* rather than the *task* consumes the attention the task
needed. Hattie & Timperley
([2007](https://www.bera.ac.uk/blog/how-to-optimise-the-use-of-hattie-and-timperleys-feedback-levels-for-student-learning))
reach the same place from teaching practice: feedback at the task,
process and self-regulation levels helps; feedback at the **self** level
is the least effective of the four.

So the risk in a review screen is not the colour. It is that eight red
marks in a column stop being eight task-level facts and become one
self-level verdict — *you are bad at this*. Three consequences, all
cheap:

- **Group the wrong answers by the rule they share, not by question
  number.** Three misses that are all Present Perfect vs Past Simple are
  one thing to learn, and reading them as one thing is both truer and
  smaller.
- **Do not render the run of verdicts as a run.** The review already
  separates items with rules rather than boxes, for layout reasons; the
  affective reason points the same way.
- **Never aggregate errors into a statement about the person.** "Zayıf
  konular" is a self-level heading. §3.3.

And a genuinely encouraging finding to set against all that: the
**hypercorrection effect**. Butterfield & Metcalfe (2001) and subsequent
work found that errors made with *high* confidence are corrected more
reliably than low-confidence errors when the feedback is clear, and that
the advantage
[persists over a week](https://link.springer.com/article/10.3758/s13423-011-0173-y).
A confident wrong answer followed immediately by a clear explanation is
one of the better learning events available. The design should not be shy
about showing the error — it should be careful about summing errors up.

### 3.2 Progress representation

**The lifetime accuracy percentage is the worst statistic in the app, and
it is the headline one.** `getOverallStats().accuracy` is cumulative over
all history. Take a learner at 60% over 100 questions:

| Then they answer | Lifetime reads |
| --- | --- |
| 20 more, all correct | 66.7% |
| 40 more, all correct | 71.4% |
| 60 more, all correct | 75.0% |
| 100 more, all correct | 80.0% |

**Sixty consecutive correct answers to move from 60% to 75%** — most of a
prep season, at 72 available questions. A trailing window of the last
twenty would have read 100% on the first day. The current statistic is
structurally incapable of showing improvement at a rate a human can
perceive, and it does the thing the question asks about: it goes *down*
when the learner attempts something hard, and then refuses to come back.

Three fixes, in order:

1. **Separate the monotone from the non-monotone.** Questions answered,
   lessons finished, days practised: these only ever go up, and they are
   the honest reward for effort. Accuracy moves in both directions and
   should be visibly a different kind of number. Profil's `stats` grid
   currently mixes three monotone counters and one non-monotone one in an
   identical four-cell grid, which reads as four facts of the same kind.
2. **Window the accuracy.** "Son 20 soru" rather than lifetime. Same
   arithmetic, one slice.
3. **Do not lead with a percentage at all.** The headline of a person's
   progress screen should be what they have done and what is next, not a
   score out of a hundred that they will read as a grade.

**Which end of the bar to show.** Koo & Fishbach
([2012](https://www.semanticscholar.org/paper/846c9878f068c05b7ca62d7a9aa7907158c2266c),
*Journal of Consumer Research* 39(3), 493–509) — the small-area
hypothesis — found that motivation is higher when attention is on
whichever region is *smaller*: accumulated progress early ("20% done"),
remaining progress near the end ("20% to go"), because the small area
creates an impression of fast movement. That is a display rule, not a
model: the lesson counter should read `3/18 tamamlandı` early and
`3 ders kaldı` late, flipping at the halfway mark.

**Self-assessment, and the state of Dunning–Kruger.** The question asked
for the literature's actual status, and the honest answer is: **do not
build anything on it.** The observed pattern is robust, but the causal
story is contested. Krueger & Mueller (2002), Nuhfer et al. (2016, 2017)
and Gignac & Zajenkowski
([2020](https://www.sciencedirect.com/science/article/abs/pii/S0160289620300222),
*Intelligence* 80, 101449) argue it is largely **regression to the mean plus a
better-than-average effect**, an artefact of the quartile-split analysis
rather than a metacognitive deficit — and Gignac & Zajenkowski has itself
been challenged ([Hiller, 2023](https://philarchive.org/rec/AVRCOG)) over
a recoding choice. A design decision resting on a claim in that state is
resting on nothing.

What *is* well supported and directly useful is narrower: learners judge
their own learning by **processing fluency**, so re-reading feels like
learning and retrieval practice feels like failing. Koriat & Bjork's work
on illusions of competence and Bjork, Dunlosky & Kornell
([2013](https://sanlab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_Dunlosky_Kornell_2012.pdf),
*Annual Review of Psychology*) document the loop: the learner tries the
harder, more effective strategy, feels worse, and switches back to the
one that feels fluent and teaches less.

That has a one-sentence design consequence, and only one: **say it, once.**
A learner who finds the Test tab uncomfortable and the Eğitim tab pleasant
is experiencing exactly the illusion, and telling them so — briefly, in
Turkish, where they will meet it — is a real intervention that costs a
line of copy. If the app ever wants to *measure* calibration, the
supported way is to ask for a prediction before a test and show the miss
afterwards. That is a feature, not a v1.

### 3.3 Guidance

The owner wants the app to say "you keep getting X wrong, do this next".
Three things have to be true before it can.

**It has to be right, because it does not get many tries.** Dietvorst,
Simmons & Massey ([2015](https://pubmed.ncbi.nlm.nih.gov/25401381/),
*Journal of Experimental Psychology: General*, 5 studies) found people
abandon an algorithmic forecaster faster than a human one after seeing it
err — even when they have watched the algorithm outperform the human.
An app that tells a learner to study Future Forms when they know
perfectly well they are fine at Future Forms spends credit it does not
get back, and the next four recommendations are wasted too.

**So the bar for saying it out loud has to be numeric.** I would propose:

> Say it only when the category has **≥ 6 effective observations** and the
> **95% Wilson upper bound is below 0.60** — that is, when the data can
> rule out "actually mostly fine".

Which observations clear it:

| Observed | Point | Wilson upper | Verdict |
| --- | --- | --- | --- |
| 0/4 | 0% | 49% | too little data (n < 6) |
| 1/4 | 25% | 70% | stay quiet |
| 1/6 | 17% | 56% | **say it** |
| 2/6 | 33% | 70% | stay quiet |
| 1/8 | 13% | 47% | **say it** |
| 2/8 | 25% | 59% | **say it** |
| 3/12 | 25% | 53% | **say it** |

And here is the bind that this whole document keeps arriving at: **a
category has four questions, so six observations means the learner has
seen at least two of them twice** — and a repeated item measures memory
for the item, not the rule (§4.1). *The confidence threshold cannot be met
without degrading the measurement that has to clear it.* No amount of
modelling gets around that. More questions does.

**It has to show its reason, at the task level.** Not "Zayıf olduğun
kategori: Future Forms" — a claim about the person, Hattie's least
effective level — but the fact and the action: *"Future Forms'ta son 6
sorunun 5'ini kaçırdın. Dersi aç."* Same information, no verdict, and the
evidence is visible, so a recommendation the learner disagrees with reads
as thin data rather than as the app being wrong about them.

**It has to be one thing.** Profil's weak list shows five rows. Five
recommendations are a list; a recommendation is one. The design system's
"one accent, one job" argument is about attention, and it applies here:
one named next action, with the rest available as a list the learner can
open.

**What it should say when it does not know.** The literal thing, plus the
curriculum fallback:

> *"Henüz yönlendirecek kadar veri yok — birkaç test daha çöz. Sıradaki
> ders: Present Perfect vs Past Simple."*

Fabricating a ranking to avoid an empty state is the single fastest way
to spend the trust that Dietvorst's studies say is hard to get back. The
app is allowed not to know. It is not allowed to pretend.

### 3.4 Storage loss

**What is honest to promise: nothing.** Profil currently says the name is
*"sadece bu cihazda saklanır, hiçbir yere gönderilmez"* — precisely true
about privacy, and silent about durability, which is the half the learner
will get wrong. *Saklanır* reads as a promise to keep it.

Given §1.4, the most likely loss is not quota and not the learner: it is
Safari deleting everything after seven days of Safari use without a visit
— which is a completely ordinary pattern for someone who studies in
bursts. Four responses, in order of value per line of code:

1. **Say the true thing, once, in Profil.** One sentence next to
   "Geçmişi sıfırla": progress lives in this browser, the browser can
   clear it, and adding the app to the home screen is what stops that.
   Nothing else the app can do has as large an effect as that two-tap
   instruction, because a home-screen web app is *exempt from Safari's
   counter entirely* — it is not running in Safari.
2. **Export and import.** Everything is already JSON. Export is
   `JSON.stringify` over four keys, a `Blob`, and an `<a download>`;
   import is a file input and the same validation `readJson` already
   does. About forty lines, zero dependencies, and it is simultaneously
   the app's only multi-device story (§4.4) and its only backup.
3. **`navigator.storage.persist()`**, feature-detected, on first write.
   One line. It upgrades the bucket from `"best-effort"` to
   `"persistent"`, which the Storage Standard says a user agent should
   only clear after informing the user. Chrome grants it silently to
   engaged origins; Firefox prompts; **Safari's behaviour with respect to
   the ITP timer is not documented by WebKit**, and the reports that it
   helps are anecdotal. Call it because it is free. Do not report success
   to the learner.
4. **Stop swallowing quota errors.** `writeJson` catches everything and
   continues, which is right for a display name and wrong for a study
   log: the learner keeps practising and keeps losing it. Distinguish
   `QuotaExceededError`, set a flag, and let Profil say
   *"İlerlemen kaydedilemiyor"*. A visible failure beats silent loss.

What not to do: no cloud backup, no "sync code", no encoding state in a
URL or a QR code. Each of them either breaks the no-backend line or
converts a privacy promise into a qualified one, and the export file does
the job.

---

## 4 · What I was not asked, and think matters more

### 4.1 The learner runs out of questions, and the model has no idea

This is the most important thing on this page.

`buildQuizSession` shuffles the whole pool and takes the first *n*, with
no memory of what the learner has already seen. Combined with 72
questions, four per category, that produces the following, all of it
measurable today:

- **A single-topic test draws 15 of 24.** A second one delivers, in
  expectation, **5.6 questions the learner has not seen** and about nine
  repeats. It takes ~4.5 topic tests to see all 24 at least once.
- **A mixed test draws 10 of 72.** Full coverage of the corpus takes about
  33 mixed tests — 330 answered questions, a fortnight of moderate use.
- **"Pratik Yap" on a weak category is the same four questions, every
  time.** `startCategoryPractice` asks for 15;
  `quiz.js` filters the pool to the category, which leaves four;
  `buildQuizSession` clamps to the pool size. The app's single most
  targeted recommendation delivers an identical four-question test on
  every invocation, for the rest of the learner's life.

The consequence for the model is not "the tests get boring". It is that
**`correct` changes meaning partway through, silently.** On first
encounter it is evidence about the grammar. By third encounter it is
evidence about whether the learner remembers that the library sentence
takes `goes`. Every estimator in §2 — mine included — assumes the
observations are exchangeable probes of a skill, and after the first pass
through a category they are not. An accuracy that rises because items
became familiar looks exactly like an accuracy that rises because the rule
was learned, and no amount of arithmetic separates them from this data.

Three things follow.

**Draw by least-recently-seen, not at random.** With the per-item `last`
field from §1.2, the selection rule becomes: sort the eligible pool by
`last` ascending (never-seen first), break ties randomly, take *n*. It
maximises the interval between repeats for free, removes the "same
question twice in a row while another is never shown" case, and it is a
change to one function. **This is the highest value-per-line change in
this document, and it needs no model at all.**

**Discount repeats explicitly.** In the weighting of §2.5, multiply an
event's weight by an exposure discount, e.g. `0.6^(exposures_before)`, so
a third look at an item counts about a third of a first look. The number
is a guess; the direction is not.

**Tell the truth when the pool is exhausted.** When every item in a
category has been answered recently, the honest recommendation is not
"practise this more" — it is "read the lesson again" or "there are no new
questions here yet". The `fresh_c` term in §2.5 produces this; the UI has
to be willing to say it.

And the real conclusion: **the bottleneck is content, not modelling.**
Four items per category is enough to notice a problem and not enough to
confirm one — §3.3's confidence threshold cannot be met without repeating
items, and repeating items is what corrupts the measurement. Twelve
questions per category would let the app say things it currently cannot,
and would improve the learner model more than every algorithm in §2
combined. If there is one number to move before writing any of this, it
is 4.

### 4.2 There is an exam date, and the app does not know it

Cepeda et al. (2008) is the only piece of research in this document that
hands the app a number, and it is unusable without the retention
interval: the optimal inter-study gap was **~20% of the test delay at
weeks-scale delays**, falling toward 5% at a year. The app is prep for a
specific exam on a specific day. That interval is knowable, and it is one
optional field in Profil.

What it buys, concretely:

- **A derived interval instead of a guessed one.** Exam in 56 days →
  target gap 6–11 days, which is the clamp in §2.5 doing real work
  instead of holding a made-up constant.
- **A schedule that converges.** Doubling intervals are correct for
  indefinite retention and wrong before a deadline. `min(interval, D/3)`
  guarantees every category gets at least two more looks before the exam;
  as *D* shrinks, the whole schedule compresses on its own.
- **A phase change in what to recommend.** With eight weeks left, breadth
  — cover categories with no data. With one week left, the weakest
  categories with the best chance of moving. The same priority function
  with a different exponent, not new code.
- **A countdown, which is the small-area rule from §3.2 for free**, and
  the one number this learner actually cares about.

Cost: a date field, a `Number.isFinite` guard, and roughly fifteen lines.
Everything downstream must work with `examDate = null`, because most
learners will not set it.

### 4.3 A prerequisite graph beats a scheduler here

The 18 categories are treated as independent, and they are not.
"Tense Forms in Passive" presupposes Tenses. "Modal Perfects in Passive"
presupposes both Modal Perfects and the passive. `tier: "foundations"`
versus `"core-grammar"` in the manifest is a coarse, topic-level
approximation of an ordering that actually exists at category level.

One optional `requires: [...]` array per category in the manifest — data,
not code, which is the project's own convention — would let the
recommender say the most useful thing a study app can say:

> *"Modal Perfects in Passive'de zorlanıyorsun. Önce Modal Perfects'e bak."*

That recommendation is **correct on day one with zero learner data**,
because it is authored knowledge rather than an inference. It is exactly
what §2.6's cold start needs, it costs no storage, it cannot be wrong in
the way a statistical claim can be wrong, and it survives the learner
having answered nothing. Set against a scheduler estimating stability
from six noisy observations, it is not close.

The taxonomy is also the resolution limit of the whole model, and it is
uneven. "Past Simple vs Past Continuous vs Past Perfect" is three
contrasts under one label, so a learner solid on two and lost on the third
gets a single number that hides it. "Time Expressions & Signal Words" is
not a peer of the others at all — it is a cross-cutting cue that appears
inside every tense category. No estimator can be finer than its
categories.

### 4.4 Two devices are two learners

A phone and a laptop are two origins' worth of `localStorage` and two
independent models, neither aware of the other. There is no fix without a
backend, and the backend is correctly out of scope. Two consequences:

- The export file (§3.4) is the only bridge, and it is manual. That is
  acceptable; pretending otherwise is not.
- The first support question the owner gets will be *"my progress
  disappeared"* from someone who opened the app in Chrome having always
  used Safari. One line in Profil prevents it.

### 4.5 Response time is a free signal and a trap

Six bytes per event buys the one measurement that is arguably closer to
the exam than accuracy is: the İYS is timed, and a rule you *reconstruct*
in forty seconds is not the same as a rule you *apply* in eight, even
though both score 1. Math Garden ([Klinkenberg et al., 2011](https://www.sciencedirect.com/science/article/abs/pii/S036013151630080X))
scores accuracy and response time jointly for exactly this reason.

But on a phone the distribution is contaminated by everything: reading the
paragraph for the first time, a bus stop, a lock screen, a notification.
Modelling it naively would make the app confidently wrong.

**Record it, clamp it, do not model it in v1.** If it is ever used, the
defensible statistic is the learner's median response time on *correct*
answers within a category, compared against their own median across all
categories — never against an absolute threshold, and never surfaced as a
number to the learner.

### 4.6 The model must never touch the answer button

The design non-negotiable is that answering a question does not move the
button the learner is reaching for. Any model that recalculates and
re-renders on answer puts that at risk, and `localStorage` is synchronous
and on the main thread.

The discipline: **append the event on answer and do nothing else.** Derived
state is recomputed on screen *entry* — the results screen, Profil, the
Test tab — never per answer and never per render. Recomputing 18
categories from a 5,000-event log is a single pass over an array and will
not be measurable, but it should still happen once per screen rather than
being tempting to call from a render function.

### 4.7 The app should say what it is doing

A learner who is told "these questions come back because spacing them out
is what makes them stick" behaves differently from one who thinks the app
is repeating itself. Given §3.2's fluency illusion — retrieval practice
*feels* like failing — the single line of copy explaining why the app
keeps asking is not decoration; it is the thing that stops the learner
abandoning the effective strategy for the comfortable one. The Eğitim tab
already explains grammar. It can afford one paragraph explaining the app.

---

## What I would build for v1

Ordered by value per unit of work. The first three need no model at all.

1. **Draw questions least-recently-seen first.** One sorted array in
   `buildQuizSession`, fed by a per-item `last` map. Removes the worst
   symptom in §4.1 and is a precondition for everything else being
   measured on fresh items. *Half a day, including tests.*
2. **Tell the truth about storage, and offer export/import.** One
   sentence in Profil about the browser clearing data and the home-screen
   fix, a `navigator.storage.persist()` call, a `QuotaExceededError` flag,
   and JSON export/import. Nothing here is modelling; all of it is the
   difference between a learner keeping their progress and not.
   *One day.*
3. **Fix the progress display.** Window the accuracy to the last 20
   answers; separate monotone counters from accuracy visually; flip the
   lesson counter from "done" to "remaining" past halfway; stop showing a
   percentage for a category with fewer than 6 observations. All display,
   no new data. *Half a day.*
4. **The event log, and the migration.** §1.2's tuple log with `pick`,
   `day`, `min`, `ms`; per-item and per-category derived state recomputed
   on screen entry; the one-way migration from `englishPrep.history`;
   the 5,000-event cap. Everything after this depends on it, and none of
   it is visible to the learner. *One to two days, most of it tests.*
5. **Recency-weighted category estimates replacing the lifetime sums.**
   §2.5's `w`, `â_c`, `conf_c`. Roughly thirty lines of pure arithmetic in
   a new module alongside `quiz-engine.js`, unit-tested the same way.
   Replaces `getWeakTopics`/`getWeakCategories` internals without changing
   their signatures. *One day.*
6. **One recommendation, with its evidence, at the task level.** The
   priority function, the ≥6-observations / Wilson-upper-below-0.60 gate,
   the "I don't know yet, here is the next lesson" fallback, and the
   curriculum-order cold start. *One day, most of it Turkish copy.*
7. **The exam date and the interval clamp.** Optional field, countdown,
   `min(interval, D/3)`, and the breadth-to-depth shift as *D* shrinks.
   *Half a day.*
8. **A `requires: [...]` edge list in the manifest**, with the validator
   extended to check the ids resolve, and one recommendation phrasing that
   uses it. Authored data beating inference. *Half a day plus the owner's
   time deciding the edges — which is the real cost, and it is his
   judgement, not an assistant's.*

Roughly a week of work, of which the parts that need any statistics are
about a day and a half.

## What I would defer

- **Distractor-specific feedback.** Recording `pick` in v1 costs nothing
  and makes it possible later. Acting on it needs a content-schema change
  (per-option notes) and 72 × 3 new pieces of Turkish prose. **Pick it up
  when** the question pool has grown past four per category, so the
  authoring effort lands on content that will not be rewritten.
- **Response-time modelling.** Record it now, model it never until there
  is a reason. **Pick it up when** someone can look at real logged data
  from a real phone and see whether the distribution is usable at all.
- **A deneme mode with feedback withheld to the end.** Correct exam
  rehearsal and the only uncontaminated measurement the app could take.
  **Pick it up when** there are enough questions for a 40-item paper that
  is not most of the corpus — i.e. after §4.1.
- **Calibration measurement** (ask for a predicted score, show the miss).
  Well-supported and genuinely useful. **Pick it up when** the basic
  recommendation loop has been used by real learners and is trusted;
  adding a second thing that asks the learner to be wrong about
  themselves, before the first one works, is too much.
- **Anything resembling FSRS.** **Pick it up when** the app has thousands
  of reviews per learner over dozens of distinct items per category —
  which would mean the content problem was solved and then solved again.

## What I would refuse

- **FSRS, SM-2, or any fitted memory model, now.** FSRS-7's 34 parameters
  are fitted from a learner's own history and need on the order of a
  thousand reviews to beat defaults; this learner will produce a few
  hundred across 72 items. It would be a large amount of untestable code
  producing numbers indistinguishable from the ones in §2.5.
- **Bayesian Knowledge Tracing.** Four parameters per skill × 18 skills,
  fitted from a single learner, with a documented identifiability problem.
  That is not estimation.
- **Item-level scheduling.** §2.3. Four items per category have nowhere to
  put an interval, and the latent variable it optimises is memory for a
  sentence.
- **A single headline accuracy percentage as the summary of a person.**
  §3.2 gives the arithmetic: it cannot show improvement fast enough to be
  read as improvement, and it goes down for doing the right thing.
- **Streaks and daily goals.** I found no primary evidence I would design
  on, the mechanism is a counter that becomes a punishment the day it
  breaks, and "do not break the streak" competes directly with "study the
  thing you are worst at" for a learner with six weeks left. If the owner
  wants one, it should be argued for on its own, not smuggled in as
  motivation research.
- **Anything built on Dunning–Kruger.** §3.2: the causal claim is
  contested and the contest is unresolved.
- **Confidence ratings on every question** (the SM-2 `q`). It doubles the
  taps per question, and §3.2's calibration literature says the answer
  would be systematically wrong.
- **Difficulty labels shown to the learner as a property of the learner.**
  "Zayıf" is a self-level word. §3.1.
- **Any collection of data beyond what §1.2 lists.** No timing of how long
  a lesson was open, no scroll telemetry, no per-session identifiers. The
  app has no analytics and should keep not having them; a local log that
  would be embarrassing if exported is a local log that should not exist.

## Open questions for the owner

1. **Will the question pool grow, and by how much?** §4.1 is the argument
   that this determines everything else. Four per category caps what the
   app can honestly say. Is twelve realistic, and on what timescale?
2. **Is the exam date something you would type in?** The whole
   deadline-aware schedule (§4.2) rests on one optional field. If nobody
   would fill it in, the schedule falls back to guessed constants and §4.2
   is not worth building.
3. **Who decides the prerequisite edges (§4.3)?** It is a taxonomy
   judgement, it is content, and by the project's own rules that is not an
   assistant's call. It is also the single cheapest improvement to the
   recommendations.
4. **How wrong may a recommendation be?** §3.3 proposes a bar that leaves
   the app frequently silent. The alternative is a chattier app that is
   sometimes wrong. Dietvorst says silence is safer; you know the five
   people who will use it.
5. **Is "Zayıf konular" a heading you want to keep?** It is the clearest
   self-level framing in the app, and §3.1 says that is the least
   effective register. The information is worth keeping under a different
   name; the name is yours.
6. **Should a home-screen install be actively recommended?** It is the
   only real answer to Safari's seven-day deletion, and it is a prompt
   that costs the learner two taps and the app some dignity.
7. **Do the friends use one device or several?** §4.4 has no good answer,
   only an honest one, and how loudly the app should say it depends on
   who is actually using it.
