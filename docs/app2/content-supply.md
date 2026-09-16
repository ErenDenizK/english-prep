# Content supply at ten times the corpus

How the App 1 quality pipeline behaves when the item bank goes from 241
items to somewhere between 700 and 2,000, is used for a year instead of
six weeks, and is read by learners whose first language nobody in the
loop speaks.

**The short version.**

1. **The sample needed to bound a defect rate does not grow with the
   corpus.** Sixty items cold-solved with nothing found bounds the corpus
   at **4.9%** at 95% confidence, whether it holds 241 items or 2,400.
2. **Exposure is the larger half, and sampling cannot close it.** A
   learner answering 1,500 items a year meets **75 defective items at
   *p* = 5%**, **15 at *p* = 1%**. That gap closes after shipping, from
   response data, or not at all.
3. **"Only cold-solving is undelegable" is nearly right, stated
   wrongly.** What is undelegable is an *error process uncorrelated with
   the generator's* — a person is the cheapest such source, not the only
   conceivable one. And three of the four judgements §2.5 of
   `content-pipeline.md` reserves for this human evaporate when App 2
   stops being Turkish.
4. **The five-in-seven repair defect rate is an argument against
   repairing.** With a boundary spec written, **discard-and-regenerate is
   cheaper than repair and deletes the independent re-audit step.**
5. **A delegated reviewer buys human sample size only if its
   false-positive rate is below the corpus defect rate.** At a 6% defect
   rate a reviewer at 80% sensitivity / 95% specificity is worth
   **×0.98** — nothing — and at 99% specificity **×2.64**:
   `calibration.md`'s precision rule recovered from arithmetic (§3.6).
6. **Budget: ~7.6 hours of the owner's attention per 100 shipped items**,
   against 10–13 today. If that is still too much, the lever is **corpus
   size, not review depth** (§6.4).

---

## 0 · What I could verify, and how claims are marked

`WebFetch` and `curl` are blocked; `WebSearch` works. I read search-result
summaries and opened no paper. **[S]** — search summary, unread in full.
**[?]** — unverified. **[≈]** — my own reasoning or arithmetic; every
number in §3 and §5 is computed here from exact binomial arithmetic.

`docs/research/content-pipeline.md` answers *how do you produce several
hundred items without the quality collapsing*. This one answers **what
breaks when you multiply it by ten**, and the answers are not the same.

Two corrections to the repository's own numbers first, both worth acting
on before anything here is planned around.

**The 7-minute figure has no ledger behind it.** `docs/audit/solve-log.json`
does not exist. `solver.md` and `vision.md` §4 both cite ~7 minutes an item
as *measured*; `tools/solve.mjs` hard-codes `MINUTES_PER_ITEM = 7`. Nothing
measured it. [≈]

**And the repository's two estimates of that step differ by an order of
magnitude.** `content-pipeline.md` §7.1 budgets *"take the batch as a
test, cold — 10 min"* for 12–15 items: **40 seconds an item**. Not the
same activity — the seven minutes includes reading the explanation
afterwards — but every plan in `docs/business/` uses the larger one.
**The cheapest useful thing anybody could do this week is one evening of
`npm run solve`**, which timestamps each entry; subtract consecutive
dates. If the true cost is two minutes, §6's budget falls threefold.

---

## 1 · Where the human is actually required

Step by step: does it need a person, or does it merely have one?

**1.1 · The boundary inventory — human, once.** Which boundaries exist is
not a content question; it is the answer to "what is this app", it is what
makes *done* countable (`vision.md` §3), and there is no ground truth to
grade a model against. But it is O(1) in the corpus — an afternoon for a
hundred boundaries — so it drops out of the per-item budget.

**1.2 · The boundary spec — mostly delegable; one paragraph is not.**
Five of `category-spec.md`'s six parts are inventory work a session does
better and faster: misconceptions, item plan, context bank, difficulty
recipe, coverage ledger. At an hour each × 100 boundaries that is 100
hours of a person doing a model's job, and it is the largest block of
*habitual* human time in the pipeline.

The exception is **§1's second half, the honest bound** — what the
category cannot discriminate. That is hard for the *author* model, for
1.5's reason: the model that believes *should* and *ought to* separate is
the model being asked whether they do. It is not hard for a different pass
with a different, falsifiable task: *write the four hardest items that
turn on this boundary, then argue the second-best option into each.* A
boundary where that succeeds four times out of four cannot discriminate,
and that verdict is delegable. **Delegate the spec; have the human approve
two lines — the discrimination sentence and the honest bound.**

**1.3 · Authoring — delegable, and nobody disputes it.** The only scale
question is *yield*: items authored per item shipped, somewhere between
1.2 and 1.6 [?] and unrecorded, because `content-pipeline.md` §4.4's batch
record was never built. At ten times the volume, yield decides whether
"regenerate the rejects" is free or is a second pipeline.

**1.4 · Mechanical checks — automated, and under-used.**
`content-checks.mjs` implements seven corpus-wide checks; six proposed in
`content-pipeline.md` §2.3 were never built, and §4 adds five that only
matter at scale. Every one is human attention bought at a one-off price —
the only saving that survives a tenfold multiplication.

**1.5 · The blind review pass — delegable, measurable, and not what it
looks like.** A blind reviewer is not a second opinion; it is a
*correlated* one. Author and reviewer share a prior over what English
sounds right, and the defects that matter — `modals-t17`, where `ought to`
is as good as `should` — are produced *by* that prior. A shared prior
yields a defect the reviewer cannot see, and it passes the item at high
confidence, which reads as evidence and is not. The calibration file shows
this from the other side: the first reviewer scored 5/5 recall on defects
planted *by a human*, and the set holds no defect a model produced and a
model failed to see — such a defect cannot be constructed on purpose,
because if you can name it the reviewer can find it. [≈]

So the blind pass's job is not to certify but to **shrink the human's
list**, and §3.6 makes "by how much" a number. Two consequences: the
calibration set must grow and absorb every defect a cold-solve finds, or
it becomes a fixed test the brief is tuned to pass; and **a second model
family stops being a luxury**, because decorrelating reviewer from author
is the cheapest route to the specificity §3.6 shows is load-bearing.

**1.6 · Lesson sufficiency — half of it is habit.** Part judgement, part
join. The join is `category-spec.md` §6's coverage ledger: every form the
lesson names appears in some option list (else taught-and-untested), every
option is a form the lesson names (else **D7**). Both directions are
computable from `forms`/`decision` blocks and option strings. A person
currently reads for this; at 120 boundaries they will stop (§4.6). What
remains — L2, L3, L5 — is genuine judgement and is delegable, because it
is visible in the text without answering anything.

**1.7 · Repair — delegable, and mostly should not happen.** Seven rounds,
five introduced a defect: a **71% iatrogenic rate**. Auditing every repair
independently accepts that cost instead of removing it. At App 1 scale
that was right — the spec cost an hour, and throwing the item away threw
the hour away. At App 2 scale it inverts: with a spec in place a *new*
item costs agent time and a CI run, while a repair costs a repair session,
a re-audit session, and a 71% chance of buying a defect.
**Repairs are for lessons; regeneration is for items.** A flagged item is
dropped and its slot refilled from the spec, re-entering at the top with a
new id — which is *more* review than a repaired item gets.

**1.8 · The independent re-audit — needed only where repairs remain.** A
lesson edit changes a document that must agree with itself and with every
item in its category, and it is where the worst historical failure came
from, so lesson repairs keep the re-audit. Item repairs no longer exist,
so it runs at boundary rather than item granularity — a tenfold drop in
frequency.

**1.9 · Cold-solving — the claim, tested.** The undelegable input is not
"a human". It is *a judgement whose errors are uncorrelated with the
generator's*, applied to the one question the generator cannot ask itself:
**would a competent teacher accept the second-best option?** A person is
the cheapest such source. Two others exist. A **different model family**,
cold, on the same protocol, is three orders of magnitude cheaper and less
correlated with the author than a same-family reviewer — but expert–judge
agreement is heterogeneous, κ ≈ 0.17–0.86 across dimensions **[S]**, so it
reduces the human sample without replacing it. **The learners** are the
one source that scales, and they arrive after shipping (§5): response data
answers "would a competent speaker accept this" better than any reviewer,
because it watches people accept it.

**And three of the four judgements `content-pipeline.md` §2.5 reserves for
this human do not survive App 2:**

| §2.5's reserved judgement | In App 2 |
| --- | --- |
| *Is the Turkish right?* | **Gone.** App 2 is English-medium (`vision.md` §3). He is no longer the only person who can read the explanations. |
| *Is the English natural?* | **Weakened.** He is not a native speaker of the medium either. Becomes a review-pass question with a style spec. |
| *Does this punish the student who knows more?* | **Intact — and now the whole of it.** This is the cold-solve. |
| *Is this what the exam asks?* | **Gone with the exam.** |

That cuts both ways. It removes the Turkish read-through. It also removes
the **L1 model**: App 1 knew `had better to` was a live distractor and
`am` was dead. App 2 does not, and §5 is the only instrument that can tell
it. **Until response data exists, App 2's distractor plausibility is
guesswork wearing the confidence App 1 had earned.** [≈]

**1.10 · What people would love to automate and cannot.** *Difficulty* —
direct model prediction correlates with empirical difficulty at Spearman
≈ .05–.35, with discrimination at ≈ 0.15 **[S]**. *Distractor
plausibility* — the generated-versus-human gap is much larger for
plausibility than for validity **[S]**: models produce options that are
wrong, not options someone would choose. *Whether the review is working* —
only a set with known answers can say, and it must keep growing or it
becomes something the brief is tuned to pass.

## 2 · What the literature says, beyond the automation-bias study

**2.1 · The cited study, restated.** N = 152 items, 19 teachers, three
conditions, 19-criterion flaw rubric, interaction density logged. Both AI
conditions carried more flaws; the *collaborative* condition showed the
largest increase, *d* = 1.06, with significantly lower interaction density
**[S]**. The mechanism is the human accepting the draft.

**2.2 · A companion finding, worse for reviewers than for authors.**
Neither human raters nor AI models reliably identified item provenance:
generated MCQs have reached a surface quality "largely indistinguishable
from human-authored material" **[S]**. With 2.1: **you cannot detect a
generated item's defects by how it reads**, which is why every control
here that works makes somebody *answer* something.

**2.3 · Base rates.** Human items in high-stakes settings: 46.2% violate
at least one guideline (Tarrant, 2,770 nursing items). LLM items: ~50%
carry at least one flaw, 28% two or more; 57% of generated sets contain an
implausible distractor **[S]**. These make §3's thresholds look
embarrassing until you notice the human baseline would fail them.

**2.4 · Distractors are the systematic weakness, distributionally.** An
empirical LLM-versus-human comparison found human distractors "very
similar to the correct answer and to each other", while model sets
contained a comparable subset *plus a tail* ranging from very similar to
very different **[S]**. That tail is D2 — a distributional property rather
than a random error, so it is detectable in aggregate (§4.4) rather than
only item by item.

**2.5 · AIG says review the model, not the item.** The Gierl/Lai tradition
generates 112 items from one item model and 1,728 from another, and its
principle is that the expert reviews the *item model and cognitive model*,
because item quality is inherited from them **[S]**. A boundary spec is an
item model in all but name — **but AIG item models are templates with
slots**, so certifying one sibling certifies the family. This project's
items differ by scenario, register and reasoning path, so certifying one
certifies nothing. **The spec earns amortised review of the plan, not of
the items**, and anyone arguing otherwise is importing a guarantee that
came with a constraint this app does not accept. [≈]

**2.6 · Review protocols with evidence.** Four, all **[S]**. Two
independent screeners, conflicts to a third adjudicator, agreement rate
reported. Judge calibration against human labels with a stated target —
the recurring figure is **κ ≥ 0.60** before a judge is used, which §5
would make computable here. Two-stage designs where the model labels
everything and humans label a subsample — prediction-powered inference,
plus a 2026 paper on how many human reviews are needed alongside an LLM
judge; the formal answer to §3. And checklists beat prose, which is
`re-audit.md`'s "run every `decision` block as a literal checklist"
arrived at independently.

## 3 · Sampling instead of censusing

### 3.1 The fact that makes App 2 possible

**The number of items you must solve to bound the corpus's defect rate
does not depend on the corpus size.** [≈] The binomial bound is a function
of the sample; the finite-population correction at *N* = 2,000 is
√(1 − n/N) = **0.985** at n = 60 and **0.975** at n = 100. Negligible. So
the census instinct — "at 241 you can review everything" — was never why
241 was reviewable: **you could have sampled 241 too.** The 28 hours buy a
guarantee about *individual items*, a different product from a bound on
the *rate*, and saying which of the two you are buying is most of the
discipline here.

### 3.2 The base table

Exact Clopper–Pearson one-sided 95% upper bounds. [≈] Read as: *I solved
n, found d, the corpus rate is at most X.*

| n solved | d = 0 | d = 1 | d = 2 | d = 3 | d = 4 | cost @7 min |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 40 | 7.2% | 11.3% | 14.9% | 18.3% | 21.4% | 4.7 h |
| **60** | **4.9%** | 7.7% | 10.1% | 12.4% | 14.6% | **7.0 h** |
| 80 | 3.7% | 5.8% | 7.7% | 9.4% | 11.1% | 9.3 h |
| 100 | 3.0% | 4.7% | 6.2% | 7.6% | 8.9% | 11.7 h |
| 120 | 2.5% | 3.9% | 5.2% | 6.3% | 7.5% | 14.0 h |
| 160 | 1.9% | 2.9% | 3.9% | 4.8% | 5.6% | 18.7 h |
| 200 | 1.5% | 2.3% | 3.1% | 3.8% | 4.5% | 23.3 h |

The inverse — items to solve to defend a claim, given the defects you
expect to meet on the way: [≈]

| Claim | d = 0 | d = 1 | d = 2 | d = 3 |
| --- | ---: | ---: | ---: | ---: |
| "under 10%" | 29 | 46 | 61 | 76 |
| "under 5%" | 59 | 93 | 124 | 153 |
| "under 3%" | 99 | 157 | 208 | 257 |
| "under 2%" | 149 | 236 | 313 | 386 |
| "under 1%" | 299 | 473 | 628 | 773 |

At seven minutes: **"under 5%" is one long evening if the corpus is clean
and three if it is not; "under 1%" is 35–90 hours and is not something
this project can buy.** That is the honest ceiling and belongs in whatever
the app tells learners. The zero-defect row is the rule of three (95%
bound ≈ 3/n), the only sampling arithmetic needed at the keyboard.

### 3.3 The bound you can afford is not the bound App 2 needs

P(a learner meets ≥ 1 defective item): [≈]

| corpus rate p | 20 items | 100 | 500 | 1,500 | expected bad in 1,500 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10% | 88% | ~100% | — | — | 150 |
| 5% | 64% | 99.4% | ~100% | ~100% | 75 |
| 2% | 33% | 87% | ~100% | ~100% | 30 |
| 1% | 18% | 63% | 99.3% | ~100% | 15 |
| 0.5% | 9.5% | 39% | 92% | ~100% | 7.5 |

At *p* = 5% an App 1 learner sitting one 20-item test has a 64% chance of
meeting a defective item — survivable, because they meet it once and then
sit the exam. An App 2 learner answers ~1,500 items a year, so **at the
rate seven hours of sampling can certify they meet 75 broken ones each.**
**This should govern App 2's quality plan:** the tenfold corpus is the
smaller half, *exposure* is the larger, no pre-ship budget closes it — 1%
is unaffordable and still means fifteen bad items a year per learner — and
the gap closes after shipping from response data (§5) or not at all.

### 3.4 Sample across boundaries, not within them

The defects this project finds cluster by category: `L5` was one finding
over four items; three of nineteen categories were cue-only *as
categories*. Whole boundaries fail, and clustered defects break
simple-random arithmetic. With m items per sampled boundary and
intra-boundary correlation ρ, DEFF = 1 + (m − 1)ρ and the effective sample
is n/DEFF. At ρ = 0.2 (a guess; no measurement **[?]**), twenty-four
solved items are worth: [≈]

| design | clusters | n_eff | zero-defect bound |
| --- | ---: | ---: | ---: |
| 1 item from each of 24 boundaries | 24 | 24.0 | ≤ 12% |
| 2 from each of 12 | 12 | 20.0 | ≤ 14% |
| 3 from each of 8 | 8 | 17.1 | ≤ 16% |
| 6 from each of 4 | 4 | 12.0 | ≤ 22% |
| 12 from each of 2 | 2 | 7.5 | ≤ 31% |

**Spread the sample.** One or two items from many boundaries buys a
tighter corpus bound than a deep dive into a few. This contradicts the
natural workflow — solve the boundary you just shipped — and both are
worth doing: the deep pass is a *release gate on that boundary*, the
spread pass is the *corpus estimate*, and neither may masquerade as the
other.

### 3.5 Two gates, because they answer different questions

**Gate A — the per-boundary release gate (LQAS)**, classifying against
p₀ = 5% (fine) versus p₁ = 20% (broken): [≈]

| n solved | accept if ≤ | P(reject a 5% boundary) | P(accept a 20% boundary) |
| ---: | ---: | ---: | ---: |
| 12 | 1 | 12% | 27% |
| 15 | 1 | 17% | 17% |
| **20** | **1** | **26%** | **7%** |
| 24 | 2 | 12% | 11% |
| 30 | 2 | 19% | 4% |

At boundary sizes of 12–16, n = 20 is more than the boundary holds and
the gate collapses into a census. The workable rule is *solve 6–8 of a
14-item boundary; accept on zero, investigate on one, reject on two* —
catching a badly broken boundary and missing a mildly bad one, which is
what Gate B and §5 are for.

**Curtail it.** Stop the moment the rejection threshold is crossed.
Simulated on a 24-item rule accepting ≤ 2: a truly bad batch (p = 20%) is
rejected after **14.2 items on average** instead of 24, while a good batch
still costs 23.8. [≈] The saving falls entirely on batches you were going
to throw away.

**Gate B — the corpus audit.** Once per release: a spread sample per §3.4,
sized from §3.2 to whatever claim you intend to make in public. Sixty
items, one evening, *"we can defend under 5%"*. This is the number that
goes in Profil's honesty section, and it should be a number, not an
adjective.

### 3.6 Making the delegated reviewer buy human sample size — and when it buys none

The formal tool is **prediction-powered inference**: label everything with
the cheap classifier, label a random subsample with the expensive one,
correct the classifier's bias from the overlap **[S]**. The estimator is
θ̂ = mean(reviewer over all N) + mean(human − reviewer over the n solved).
It is valid whatever the classifier does; the *gain* depends on how well
it predicts, because the variance that matters is Var(human − reviewer)
rather than Var(human). At a true defect rate of 6%: [≈]

| sensitivity | specificity | P(miss) | P(false alarm) | effective-n multiplier |
| ---: | ---: | ---: | ---: | ---: |
| 0.60 | 0.90 | 2.4% | 9.4% | **×0.50** |
| 0.70 | 0.95 | 1.8% | 4.7% | ×0.88 |
| 0.80 | 0.95 | 1.2% | 4.7% | ×0.98 |
| 0.80 | 0.98 | 1.2% | 1.9% | ×1.83 |
| 0.80 | 0.99 | 1.2% | 0.9% | **×2.64** |
| 0.90 | 0.995 | 0.6% | 0.5% | ×5.27 |

**Read the top row.** A plausible-sounding reviewer — 60% of defects
found, 90% of sound items left alone — makes the estimate *worse* than
ignoring it. And it is not sensitivity that decides this but
**specificity**: at a 6% defect rate, a 10% false-alarm rate produces more
noise than the signal contains. That is `calibration.md`'s *"below 4/5
precision it is worse than nothing"* recovered from arithmetic and
sharpened — at a 2% defect rate, 95% specificity is worth **×0.38**.

So: **calibrate for precision at the corpus's actual defect rate.** You
cannot measure a 1-in-100 false-alarm rate with five sound items, so the
calibration set must grow to dozens of *sound* items — inverting the
current set's emphasis. There is one number to optimise and it is
specificity.

### 3.7 Estimating what the review missed, for free

Two cold solvers on overlapping samples give a capture–recapture estimate
of what neither saw: N̂ = M₁M₂/m (Chapman: (M₁+1)(M₂+1)/(m+1) − 1).
Worked: A flags 14, B flags 11, 6 shared → N̂ ≈ 25.7 against a union of 19,
so **≈ 6 defects were seen by neither**. [≈] With few inspectors these
models underestimate, sometimes substantially **[S]** — an order of
magnitude, not a measurement. It still answers *is the review nearly done
or nowhere near*, and `solver.md` already wants a second solver anyway.

### 3.8 The bound is on solver-detectable defects, and must say so

A cold solve reaches D1, D6, D4, D12 and some D2. It cannot reach D5, D8
(the solver never reads the lesson), or L1–L5. If the pass has sensitivity
s over the full taxonomy, a bound B on detected defects is a bound B/s on
all defects: [≈]

| solver sensitivity | "≤ 5%" detected really means |
| ---: | ---: |
| 1.0 | ≤ 5% |
| 0.8 | ≤ 6.3% |
| 0.6 | ≤ 8.3% |
| 0.5 | ≤ 10% |

**So the published claim must name its class.** *"Under 5% of items have
more than one defensible answer or a wrong key"* is defensible from a
solve sample. *"Under 5% of items have any defect"* is not, and the
distance between the two sentences is a factor of two.

## 4 · Defects that only appear at scale

**4.1 · A fixed similarity threshold is a moving standard.**
`checkNearDuplicates` uses trigram Jaccard at 0.3, corpus-wide. Cost is
fine — 2,000 items is 2M small-set comparisons, under a second. **Its
false-positive rate is not.** As the corpus densifies, the maximum
similarity between two *legitimately distinct* items rises: more pairs,
and the space of B2 grammar paragraphs is not large. A threshold tuned on
241 items will fire at 2,000 on pairs nobody would call duplicates, and a
warning list nobody finishes is the failure mode `content-pipeline.md`
§2.3 warns about. [≈] **Fix: replace the threshold with a budget** —
report the top *k* = 20 most similar pairs per release. A fixed threshold
promises a constant standard and delivers a growing workload; a fixed
budget promises a constant workload and delivers a rising standard.

**4.2 · Semantic duplicates share no words.** Two items testing the same
discrimination with different scenarios are invisible to Jaccard, and are
the *more common* duplicate once a spec drives authoring — both were
written from the same item-plan row. **Fix: an authored fingerprint.** Each
item declares `keys` (the form), `punishes` (misconception ids from the
spec) and `decidedBy` (`signal` | `meaning`); two items in a boundary with
the same triple are one item written twice. Mechanical given the field,
and the field costs the author nothing, since `category-spec.md` §3's
table already required the decision. It also enables 4.7's enemy-item rule.

**4.3 · The option that is never a key anywhere.** Not "a distractor that
is a key elsewhere" — that is healthy. The pathology is the inverse: index
every option string corpus-wide and flag any option appearing **as a
distractor ≥ 5 times and never as a key**. That is either a repeated dead
option (D2 at corpus scale) or a form the corpus has quietly decided is
always wrong, which a test-wise learner will learn faster than the
grammar. [≈] At 241 items the check has no power; at 2,000 it does, which
is what "only at scale" means. `reviewer.md` names the property and asks a
human to notice it. It is a `GROUP BY`.

**4.4 · Distributional cues, corpus-wide rather than per item.** The
option-length cue as a per-item warning is noisy; as a corpus statistic it
is not. Compute the rate at which the key is the longest option — under
the null 25%. At 2,000 items a rate of 32% is a large, real, test-wise
cue; at 241 it is within noise. [≈] Report one line per release — *"key is
longest option: 27.4% (null 25%, n = 1,842)"* — and the same for
key-is-shortest, key-shares-most-words-with-stem, and
key-is-the-only-option-with-an-auxiliary. Distributional defects want
distributional detectors, which is the shape §2.4 predicts.

**4.5 · A contrast taught two ways in two places.** At 60 categories one
person holds the taxonomy in their head; at 120 boundaries nobody does,
and the failure is not a wrong lesson but two lessons that are each right
and disagree. Two joins reach it. [≈] **Contrast collision:** two lessons
whose `contrast` blocks carry the same pair of side labels. **Rule
contradiction:** two `decision` rules in different lessons whose `signals`
overlap and whose `then` differ — L2 across lessons rather than within
one. Neither is possible in prose lessons: a dividend of the block schema.

**4.6 · The coverage ledger, as code.** Per boundary: every form named in
the lesson appears in at least one option list (else taught-and-untested),
and every option is a form the lesson names or a spec-declared
misconception (else D7). Two warnings, one join, and it retires the
hand-written table that found a Future Passive taught twice and tested
nowhere — the table nobody will fill in a hundred times.

**4.7 · What no check reaches.** *Difficulty drift between boundaries* is
not measurable pre-launch (§1.10). **Construction** is: stem word count,
sentence count, authored distance from blank to deciding evidence, mean
edit distance from each distractor to the key. Report the per-boundary
distribution against the corpus and flag outliers — it does not measure
difficulty and must not be described as if it did, it measures whether a
boundary was *built* like the others, which is the AIG position **[S]**.
*Enemy items* — item banking's first-class concept for two items that must
not appear together, even with different keys **[S]** — are a
session-assembly constraint rather than a content check: App 1 ships one
paper's worth and does not need it; App 2 assembles sessions from a pool,
and its selector must not draw two items sharing a 4.2 fingerprint into
one sitting. *Provenance* —
spec version, brief commit, batch, cold-solved flag — makes a bad batch
**recallable** and makes §6.5 a check rather than a promise.

## 5 · Real learner responses

**5.1 · What responses find that no reviewer can.** **Distractor
plausibility** — the measured weakness (§1.10, §2.4): a distractor chosen
by 2% is dead, one chosen by 25% is doing its job, and for a global
audience nobody can guess which. **Miskeys and second defensible answers
at population scale** — an item whose "wrong" option is chosen by strong
learners is a D1/D6 detector that never tires. **Which boundaries this
audience actually smears** — what §1.9 says App 2 loses with the L1 model.
Nothing about D5, D8 or L1–L5: responses grade items, not teaching.

**5.2 · How many responses before the numbers mean anything.** Classical
item analysis wants n ≥ 30 before statistics stabilise, and defines a
non-functioning distractor as one chosen by under 5% — needing hundreds
before "under 5%" separates from "nobody happened to pick it" **[S]**. For
*defect detection*, which is coarser, exact power with the flag cutoff set
for a 5% false-alarm rate against a sound item at 55%: [≈]

| responses/item | power to catch p = 0.30 | power to catch p = 0.25 (vs 0.65) |
| ---: | ---: | ---: |
| 10 | 38% | 78% |
| 20 | 61% | 96% |
| **30** | **84%** | **~100%** |
| 50 | 97% | ~100% |
| 100 | ~100% | ~100% |

**Thirty responses per item catches a badly broken item; fifty makes it
near-certain.** Dead-distractor detection needs more — with 50 wrong
answers there is still a 7.7% chance of zero picks on a genuinely
5%-attractive option — so retirement wants n ≈ 100+ and must never be
automatic. [≈] Accrual over a 2,000-item corpus: [≈]

| weekly-active learners | items/week each | responses/item/week | weeks to 30/item |
| ---: | ---: | ---: | ---: |
| 50 | 30 | 0.8 | 40 |
| 200 | 30 | 3.0 | 10 |
| 500 | 40 | 10 | 3 |
| 2,000 | 40 | 40 | 1 |

**Below roughly 200 weekly-active learners, response data is not a quality
instrument on a useful timescale** — worth saying plainly, because "we
will fix it with usage data" is the kind of plan that assumes an audience
the app does not have.

**5.3 · The confound nobody mentions: the app chooses the exposure.** If
App 2 shows you the boundaries *your* answers say you smear, the learners
who see an item are selected *for weakness on its boundary*. Its correct
rate is then a fact about the selector, not the item, and comparing two
items compares two selection policies. [≈] This is not a nuance; it
invalidates the tables above if ignored, and it is invisible in the data.
**Fix, and it is cheap: reserve a random-exposure channel.** One item in
twenty drawn uniformly from the whole corpus, ignoring the learner model;
those responses, and only those, are the measurement sample. At 5% of a
200-learner cohort's 6,000 weekly answers that is 300 clean responses a
week — 30 per item in about four months. Slower, and interpretable.

**5.4 · The promise, and four options in order of what they cost.** No
accounts, no backend, no analytics, everything in the learner's own
`localStorage`. Breaking a stated promise for a metric is not a trade to
make casually, and "aggregate and anonymous" is the sentence every company
says on the way to breaking it.

1. **The report channel that already exists.** `js/report.js` is not
   statistical and is the highest-honesty instrument available. One change
   at scale: **carry the item id and the option the learner chose**,
   because "this question is wrong" without the chosen option is half a
   finding.
2. **Donated exports.** The backup path exists; add a "send me my answers"
   screen and an address. Nothing leaves the device without a deliberate
   act, so the promise stands literally. Biased toward the engaged —
   useless for calibration, adequate for defect detection.
3. **Explicit opt-in aggregate submission**, off by default, showing
   exactly what would be sent (item id, chosen option, first-attempt flag).
   Needs a backend and a rewrite of Profil's honesty copy. **It is a
   promise change and should be versioned and announced as one.**
4. **Anything default-on.** Refuse. It buys a better dataset and spends
   the one thing `two-apps.md` says a funded competitor cannot buy.

**Recommendation: 1 and 2 for the first year, and design so 3 stays
possible** — mostly meaning 4.7's provenance fields exist, so that when
responses arrive they attach to something.

**5.5 · The honest way to act on it.** **Response data flags; it never
adjudicates.** A flagged item joins the cold-solve queue at the same seven
minutes as any other, so its value is not that it replaces human attention
but that it **retargets** it: §3.2's seven hours bound a rate, the same
seven hours on flagged items remove defects a learner actually hit. Three
rules — **never auto-retire** (the negative point-biserial that "typically
indicates the specified correct answer is actually wrong" **[S]** also
fires on a hard item a weak cohort guessed); **report the flag with its
evidence, not its verdict**; **publish the rate you can defend** (§3.8).

## 6 · The pipeline as it should run at App 2 scale

### 6.1 The shape, with the human's minutes

| # | Step | Who | Human min / 100 items |
| ---: | --- | --- | ---: |
| 1 | Boundary inventory | Owner, once for the app | ~0 (amortised) |
| 2 | Boundary spec drafted from the template | Agent | 0 |
| 3 | **Approve two lines: discrimination, honest bound** | Owner | **160** |
| 4 | Spec falsification — try to defeat the boundary | Agent, separate session | 0 |
| 5 | Author 1.4 × the needed items against the spec | Agent | 0 |
| 6 | `npm run check` + the §4 checks | CI | 0 |
| 7 | Blind review, calibrated for precision | Agent, different family if possible | 0 |
| 8 | Lesson sufficiency: join by code, judgement by session | CI + agent | 0 |
| 9 | **Gate A — cold-solve 6–8 per boundary, curtailed** | Owner or second solver | **~390** |
| 10 | Adjudicate: **drop and regenerate**, never repair | Owner (decision only) | **30** |
| 11 | Lesson repairs only, with independent re-audit | Agent ×2 | 0 |
| 12 | Merge, format, provenance record, ship | Owner | 20 |
| 13 | Spot-read ten explanations | Owner | 20 |

Step 3 is one-off per boundary. **Steady state: ~7.6 hours per 100 items;
~10.3 including first-time spec approval** — against today's 10 to 13
hours per hundred, roughly a 35% saving, almost all of it from not
cold-solving everything. Per *release*: **Gate B**, 60 spread items,
**7 hours**, producing the one sentence the app may say in public; and
**response triage** (§5) once it exists, 30–60 minutes a month plus the
cold-solves it surfaces.

### 6.2 What that means for a 1,500-item App 2

1,500 items ≈ 100 boundaries × 15. [≈] Spec approvals 100 × 20 min =
**33 h**, once ever; Gate A across the build, 1,500 × 0.5 sampled × 7 min
≈ **88 h**; Gate B four times a year, **28 h/yr**. **Total to a first
complete corpus: ~120 hours**, against ~175 for a census that would still
have missed the clustered defects — about eight months at `vision.md`
§4's one-hour-an-evening cadence. **That is the real schedule, and the
number to argue with rather than the feature list.**

### 6.3 The claim this pipeline can defend

> *N items have been cold-solved by a competent speaker without seeing the
> key. Across a random sample of 60 spread over every boundary, d defects
> of the classes a blind solve can detect — a second defensible answer, a
> wrong key, an item answerable without its paragraph — were found. The
> corpus's rate of such defects is at most X% at 95% confidence. Defects a
> solver cannot see, such as an explanation that fails to name the trap,
> are not covered by that number.*

Four sentences, every one checkable against `docs/audit/solve-log.json`.

### 6.4 What gets cut if 7.6 hours per hundred is too high

1. **Cut spec approval to the boundary name.** Saves 2.7 h per hundred on
   the first pass; costs the honest-bound catch, which the falsification
   pass partly covers. Allowed, reluctantly.
2. **Cut Gate A from 7 items per boundary to 4.** Saves ~2.8 h per
   hundred; the gate weakens from catching a 20%-defective boundary ~93%
   of the time to roughly two-thirds. Allowed **if Gate B stays intact**.
3. **Cut the release cadence, not the depth.** Four boundaries a month
   instead of eight — the honest cut, and the one `vision.md` §7.2 reached
   from the other side. **The lever on content supply is corpus size, not
   review depth.**
4. **Cut Gate B, or shrink it below ~40 items.** *Not allowed.* At 40 a
   clean run bounds the corpus at 7.2%, at 24 it is 12%, at 8 it is 31% —
   not a bound but a gesture. A sample too small to support a sentence
   costs the same evenings and buys nothing, and the temptation is
   strongest on exactly the evening the corpus is worst.

### 6.5 One mechanical rule worth writing down now

`vision.md` §4's rule — *cold-solve everything you charge for, before you
charge for it* — becomes enforceable the moment provenance exists: an item
may enter the paid set only if its id appears in `solve-log.json` with
`agreed: true` and `flagged: false` under at least one solver. Four lines
in CI, converting the project's central promise from a resolution into a
build failure — and what keeps the census tractable, since the census is
only ever over what is sold.

---

## 7 · Where I would be wrong

**The 7-minute figure.** Every hour in §6 is a multiple of a number
nothing in this repository measured, and its own alternative estimate is
40 seconds. If the real cost is 2 minutes, §6 is 2–3 hours per hundred and
most of this document's austerity is unnecessary. Measure it first.

**ρ, the intra-boundary defect correlation.** §3.4 uses 0.2 as an
illustration and I have no measurement. If defects are nearly independent
within a boundary, spreading the sample buys much less than the table
claims. **This is estimable today** from how findings distributed across
categories in `docs/audit/`, and somebody should.

**The PPI argument assumes the reviewer's errors are independent of the
human's.** They are not: a reviewer that misses a defect from a shared
prior about English misses it in a way correlated with a solver who is
also a strong speaker of English. The multipliers in §3.6 are then
optimistic. The direction — specificity, not sensitivity, buys sample size
— survives; the numbers do not.

**"Regenerate, do not repair" could be wrong where it matters.** Five of
seven is not a rate, it is an anecdote with a denominator. And a repair
carries information a regeneration does not: somebody understood what was
wrong. If regeneration reproduces the same defect from the same spec — what
a spec-driven pipeline would do — I have proposed an infinite loop. **The
guard is that a regeneration must come with a spec amendment**; if the spec
cannot be amended to exclude the defect, repair by hand after all.

**§3.3's exposure argument assumes defects are met uniformly.** They are
not: a defective item in a boundary the learner needs is met repeatedly,
one in a boundary they never need is met never. The count of *distinct*
defective items met is lower than 75; the number of *encounters* is
higher. Both matter and I modelled neither.

**And the largest: I assume App 2 gets learners.** Every argument in §5
dissolves below ~200 weekly actives, and at that point App 2's quality
system is App 1's, run over ten times the content by the same one person.
**If the audience does not arrive, the honest plan is not a bigger corpus
reviewed more cleverly. It is a smaller corpus.**

---

## Sources

Search summaries only; nothing below was opened in full.

- [AI-assisted MCQ creation increases item-writing flaws through automation bias (Frontiers in CS, 2026)](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2026.1831250/full)
- [Evaluating the instrumental quality of LLM-generated assessment items (Frontiers in Education, 2026)](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1837523/full)
- [Distractor Generation in Multiple-Choice Tasks: A Survey of Methods, Datasets, and Evaluation](https://arxiv.org/pdf/2402.01512)
- [Generating Effective Distractors for Introductory Programming Challenges: LLMs vs Humans (LAK '25)](https://dl.acm.org/doi/10.1145/3706468.3706529)
- [Automatic distractor generation in MCQs: a systematic literature review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11623049/)
- [Nonfunctional distractor analysis: an indicator for quality of MCQs](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7372664/)
- [Module 34: Automated Item Generation (Gierl & Lai, NCME)](https://ncme.org/wp-content/uploads/2025/10/Module-34-Automated-Item-Generation-Gierl-Lai.pdf)
- [Prediction-Powered Inference (Angelopoulos & Bates)](https://arxiv.org/pdf/2301.09633)
- [Augmenting Human Evaluation with LLM Judges: How Many Human Reviews Do You Need?](https://arxiv.org/abs/2605.16354)
- [Using Human-LLM Disagreement to Improve Checklist-Based Quality Appraisal](https://arxiv.org/html/2608.20385)
- [Lot quality assurance sampling](https://en.wikipedia.org/wiki/Lot_quality_assurance_sampling)
- [Acceptance sampling / AQL](https://en.wikipedia.org/wiki/Acceptance_sampling)
- [Capture–recapture in software inspections after 10 years research](https://www.sciencedirect.com/science/article/abs/pii/S0164121203000906)
- [Classical Test Theory: item statistics and the point-biserial](https://assess.com/item-statistics-classical-test-theory/)
- [Enemy items in psychometrics and assessment](https://assess.com/enemy-items/)
