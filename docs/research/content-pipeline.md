# The content pipeline

How to produce several hundred exam-quality items with AI agents without
the quality collapsing, and how to know whether it has.

**The short version.** Two other arms of this round agree that the app
needs on the order of a thousand items across five item types it does not
have. That number is now the binding constraint on v1, and the thing that
will decide whether it is reachable is not how fast agents can write. It
is **review throughput**, and the published evidence says the naive way of
spending it makes things worse rather than better: in the one controlled
comparison I could find, teacher-plus-AI items carried *more* item-writing
flaws than teacher-only items, at *d* = 1.06, because reviewers accepted
AI drafts with measurably less engagement than they gave their own drafts.
A review stage that consists of reading a generated item and nodding is
not a weak control. It is a negative one.

So this document is mostly about three things:

1. **An intermediate artifact.** The pipeline today goes kickoff → items.
   The automatic-item-generation literature goes cognitive model → item
   model → items, and the middle layer is what makes distractors
   principled, batches consistent, and review fast. This repo needs it and
   calls it a **category spec**.
2. **A blind first pass.** The single highest-value check is not reading
   the item — it is *answering* it, cold, without the key, both by a
   second agent and by the supervisor. Reading an item with the answer
   visible makes the answer look inevitable. That is precisely the failure
   mode the flaws in this repo's own history survived.
3. **A calibration set the repo already owns.** `docs/education-notes.md`
   records five specific defective items found by human review — an item
   with two defensible answers, an item that is effectively two options
   wide, a distractor no learner would consider. Those are a free,
   permanent test of whether a review pass is actually working. Plant them
   in review batches. If the reviewer passes `modals-t17`, the reviewer is
   decoration.

Everything else follows from those, plus a list of checks precise enough
to implement.

---

## 0 · What I could actually verify

Same problem the exam arm had, and it constrains this document the same
way. **Every direct fetch was blocked by the network egress proxy** —
`arxiv.org`, `pubmed.ncbi.nlm.nih.gov`, `ncbi.nlm.nih.gov`,
`frontiersin.org`, `link.springer.com`, `sciencedirect.com`, and every
publisher PDF I tried, including the two I most wanted (Gierl, Lai &
Turner's AIG paper and the Haladyna, Downing & Rodriguez guidelines). I
had a web *search* index and nothing else.

So every number below marked **Reported** comes from a search-result
summary of a paper I could not open. They are consistent across results
and I believe them, but I have not read the methods sections, and where a
number decides something expensive I say so. Nothing here is
**Extrapolated** without the word appearing next to it.

Two consequences worth stating rather than burying:

- I could not obtain the full 31-guideline Haladyna taxonomy or the full
  19-criterion Tarrant item-writing-flaw rubric. I have the flaw *names*
  that appear in summaries and I have reconstructed the subset that
  applies to this app from those. Before the review rubric in §3 is
  treated as complete, someone should open one of those two papers.
- The strongest single finding in this document — the automation-bias
  result — rests on one 2026 study of 152 items by 19 teachers, read
  through a summary. It is directionally consistent with everything else
  and I would design against it, but it is one study.

---

## 1 · What actually goes wrong

### 1.1 The base rates are bad, and they are bad in a specific way

**Reported.** Human-written items in a high-stakes setting are already
worse than people assume. Tarrant et al. (2006) examined 2,770
multiple-choice questions used in high-stakes nursing assessments over
five years: **46.2% violated at least one item-writing guideline**, and
over 90% were written at low cognitive levels. That is the baseline. The
question is not whether agents can hit perfection; it is whether they can
beat a bar that trained humans clear less than half the time.

**Reported.** For LLM-generated items the published rates cluster around:
about **50% carry at least one item-writing flaw and 28% carry two or
more**; **57%** of generated sets contained at least one implausible
distractor; **17%** lacked enough context; and in one study only **44%**
of generated questions met four minimal standards simultaneously —
grammatical, answerable from the source, options relevant to the stem, and
exactly one correct answer.

The shape of that is the useful part. The failures are not random noise;
they concentrate in two places, and both are places a reader who already
knows the answer will not look:

- **the distractors**, which are the half of the item nobody proofreads;
- **the sufficiency of the context**, which is invisible unless you try to
  answer the item without it.

Every check I propose in §2 and §3 is aimed at one of those two.

### 1.2 The taxonomy, mapped onto this repo's own defect log

The published flaw taxonomies (Haladyna/Downing/Rodriguez 2002; Tarrant
2006) name things like *unfocused stem*, *negative stem*, *window
dressing*, *unequal option length*, *heterogeneous options*, *implausible
distractor*, and *clues to the correct answer* — vague terms, specific
determiners, a mutually exclusive pair, grammatical inconsistency across
options. That list was built for classroom and licensure testing, and
about half of it does not bite here.

What is more useful is that **this repository has its own defect log**,
produced by adversarial review rather than theory, and it maps cleanly
onto the taxonomy. From `docs/education-notes.md` and the commit message
for `90a67ad`:

| Defect found | Where | Published name |
| --- | --- | --- |
| `modals-t17`: `should` keyed, but `ought to` is equally defensible | question | **ambiguous key** — more than one correct option |
| `tenses-t20`: `go`/`went` ungrammatical after `have`, so it is a two-option item | question | **implausible / non-functioning distractor** |
| `passive-voice-t15`: `am` produces "I always am it painted" | question | same |
| `passive-voice-t21`, `-t23`: every option grammatical, keyed on the author's taste | question | **construct-irrelevant** — style judgement dressed as grammar |
| A signal word taught as a Present Perfect trigger that the lesson's own example contradicted | lesson | **internally inconsistent teaching** |
| A `when` rule that would have been wrong on one of the topic's own questions | lesson | **lesson/question contradiction** |
| A "common mistake" whose wrong and right differed in three things at once | lesson | **confounded contrast** |
| A pitfall marking correct English as an error | lesson | **factually wrong content** |
| `passive-voice-t20` tests `be supposed to`, which no lesson taught | both | **blueprint gap** — untaught construct assessed |
| `tenses-t19` sits in the wrong category | both | **miscoded item** |

Ten defects, and note what is *not* among them:
nothing was ungrammatical, nothing was formatted wrong, nothing failed the
schema. **The validator caught none of these and could not have.** Every
one required somebody to hold the item and the claim about it in mind at
the same time.

Note also the two that are worse than the rest. A pitfall marking correct
English as an error and a decision rule that is wrong on the topic's own
questions do not merely fail to teach — they *install* an error, and the
learner then meets a correct sentence on the real paper and rejects it.
That asymmetry is the whole reason the standard in §6 is what it is.

### 1.3 The two failure modes that matter most here

Everything above collapses into two that should drive the design.

**The ambiguous key.** An item where two options are defensible is the
most damaging defect an assessment item can have, because it punishes
exactly the learner who knows more — the student who has learned that
*ought to* means what *should* means gets it wrong for knowing that. It is
also the defect most invisible to its author: an author who has decided
which option is correct reads the others through that decision.
`modals-t17` sat in this repo for weeks.

Benchmark-quality work has converged on a small label set for this, which
is worth stealing verbatim as the reviewer's output: an item is one of
**`clean`**, **`not_well_posed`**, **`gold_incorrect`**, or
**`ambiguous`**. Four labels, no prose, no scores. (Reported, from work on
verifying benchmark answer keys.)

**The surface-cue item.** The item that appears to test the construct and
actually tests a keyword. This app has a documented instance of the
pattern at the category level: the learning-design arm found that all four
*Present Perfect vs Past Simple* questions are heuristic-consistent — the
signal word present, the signal word deciding — while the lesson's own
`text` block warns that *for* appears on both sides. The learner finishes
with the exception explained and the reflex reinforced four times.

The equivalent in machine reading comprehension is well documented and
gives us the check. **Reported:** on the RACE dataset, models answer
nearly half the questions correctly *without the passage*, because
question-and-option patterns leak the answer. The instrument that revealed
that — the **passage-blind baseline** — is directly transferable, and it
is the only mechanical way I know to detect an item that tests the cue
rather than the construct. §3.2.

### 1.4 Difficulty drift, and why you cannot ask the model

An authoring agent asked for "B2–C1" items will produce items whose actual
difficulty is unknown to it, and will drift across a run and between runs
because nothing anchors the scale.

The tempting fix is to have a model rate difficulty. **Do not.**
Reported: across studies of text-based item-difficulty modelling, *direct
LLM prompting* aligns with empirical difficulty at Spearman ≈ **.05–.35**;
the strong numbers in that literature (r ≈ .8–.87) come from regression or
tree models fitted on **existing response data**, which this app does not
have. For item *discrimination* — the statistic that actually says whether
an item separates learners — the best direct LLM prediction reported was
Spearman **0.152**, which is nothing.

So difficulty cannot be measured here, by model or by six users. What can
be done is to **control it by construction**: fix the surface features
that drive difficulty in the spec (sentence count, clause depth, whether
the deciding evidence is in the same clause as the blank, whether the
distractor set includes the learner's most common wrong rule), and let
difficulty be whatever a fixed recipe produces. That is the AIG position —
difficulty is a property of the item model, not a judgement about the
item. It also means a category's items are comparable to each other, which
is the only comparison this app actually makes.

### 1.5 Repetition and low diversity across a batch

**Reported.** Independent generation from the same prompt collapses toward
the same modes; post-training alignment pushes models toward typical,
familiar text; and "tail-forgetting" means the unusual case — which in
this app is the *counter-signal* item, the interesting one — is exactly
what gets dropped first.

The repo's own content shows the symptom. `question-author.md` already
says "do not reuse a scenario" and the existing set still leans hard on
university-library-and-morning-routine. That instruction is unenforced,
and an instruction nobody checks is a preference.

The consequence for batching is in §4, and it is not the obvious one:
diversity is a property **of a set**, so it can only be produced, and only
be checked, when the whole set is in one context at once.

### 1.6 The finding that should change the process

**Reported, and the load-bearing citation in this document.** A 2026 study
compared MCQ quality across three conditions — teacher-only, AI-only, and
teacher–AI collaboration — over 152 items from 19 teachers, scored against
the 19-criterion item-writing-flaw rubric, with authoring-interaction
density logged. Both AI and teacher–AI items carried significantly more
flaws than teacher-only items, and the **collaborative** condition showed
the largest increase, *d* = 1.06, alongside significantly *lower*
interaction density. The authors read it as automation bias: the human
accepted the draft.

Two things follow, and they are the difference between a pipeline that
works and one that produces confident garbage.

**First: "the supervisor reviews it" is not a control unless the review
has a forcing function.** A person reading a generated item, with the key
and a fluent Turkish explanation in front of them, is being shown the
answer and a reason. The reason will be persuasive; models are good at
that. It is not that the supervisor is careless — it is that the task, as
posed, cannot detect the defect.

**Second: the review has to be structured so that agreeing is work.** The
concrete version is in §3.5, and it is simply this: the supervisor answers
the batch before he reads it. Fifteen items, no key visible, ten minutes.
Wherever he hesitates between two options, the item is a candidate
`ambiguous`; wherever he answers instantly without reading the context,
the item is a candidate surface-cue. That is not extra work bolted onto
review — it *is* the review's first pass, it is faster than reading, and
it produces the only item-response data this project will ever have from a
person who has to sit the exam.

---

## 2 · Item quality, measurably, with six users

### 2.1 What you cannot have, stated once so nobody proposes it later

Classical item analysis — difficulty as a *p*-value, discrimination as a
point-biserial correlation, distractor analysis by option take-up — is the
right instrument and it is unavailable. **Reported:** point-biserial
estimates need roughly *n* ≥ 30 before they stabilise at all, its standard
error goes as 1/√N, and the conventional quality thresholds (0.10 minimal,
0.20 good, 0.30 strong) are stated with the caveat that they move with
sample size. A non-functioning distractor is conventionally one chosen by
**under 5% of examinees** — a definition that needs hundreds of examinees
before "under 5%" distinguishes itself from "nobody happened to pick it".

This app has six users, no backend, no analytics, and `localStorage` that
never leaves the phone. Cambridge pretests with **~30,000 candidates a
year**. The gap is not one of degree.

So: **no *p*-values, no point-biserials, no distractor take-up statistics,
and no adaptive anything built on them.** Any proposal in this project
that computes an item statistic from six learners is producing a number
whose confidence interval covers the entire scale. The learning-design arm
reached the same verdict about adaptive difficulty from the other side.

### 2.2 What six users can still give you

Three things, and they are not consolation prizes.

**Response-process evidence — the technique that works *because* the
sample is small.** Cognitive interviewing and think-aloud protocols are
standard sources of validity evidence, and the literature is explicit that
they saturate at small samples: the point is depth per participant, not
count. **Reported.** One friend, one sitting, ten items, thinking aloud —
"I picked that because *for* is there", "I didn't read the second
sentence" — tells you more about whether an item measures the construct
than a thousand anonymous response vectors would. It directly detects the
surface-cue item, the ambiguous key, and the item that is answerable from
world knowledge, which are exactly the three defects §1 says dominate.

This costs one evening per round and needs no code. It is the single
highest-information quality instrument available to this project and it
currently does not exist.

**A defect-report channel.** Six users who hit a bad item currently have
no way to say so, and — this is the part that matters — a learner who
believes the content is authoritative will conclude *he* is wrong. That
turns one bad item into a learned error. A "bu soruda bir sorun var" link
on the feedback block that opens a pre-filled `mailto:` or a GitHub issue
URL carrying the question id needs no backend, no accounts and no
analytics, and it is consistent with the disclosure position in §6: you
tell learners the content is AI-authored and human-checked *and* you give
them somewhere to send the ones that got through. One is not honest
without the other.

**Weak signals from the learner's own history, used as triage and never as
a statistic.** Storage already keys history by question id. Two derived
numbers are worth reading — not for the learner, for the supervisor:

- an item every learner who met it got **right first time** is a candidate
  for "too easy / answerable from the cue", and
- an item every learner got **wrong first time** is a candidate for
  "keyed wrong".

With six people these are hypotheses to check by hand, not measurements.
But they cost nothing and they point attention. Note the privacy
constraint: history is on the learner's phone and does not come back. This
is something a friend reads off their own Profil screen and mentions,
which is fine, and it is another reason the report channel is the real
instrument.

### 2.3 Checks that belong in `tools/validate-content.mjs`

The rule for this section: a check earns its place if it is **mechanical,
has a low false-positive rate, and catches a defect class that has
actually occurred** — either here or in the literature. Warnings that fire
on good content are worse than no check, because they train everyone to
skim the warning list, and this validator's warning list is already long.

Ordered by value. Everything here is zero-dependency Node over strings.

**C1 · The explanation must name a wrong option.** `CONTENT_GUIDE.md`
already requires the explanation to say why the closest wrong option
doesn't fit, and nothing enforces it. Check: for each question, at least
one of the distractor strings occurs as a substring of `explanation`
(case-insensitive, after normalising the curly quotes the Turkish text
uses). *Warning.* Options are English inside Turkish prose and are
conventionally quoted, so the match is reliable; the false positives are
explanations that paraphrase the distractor, which are worth a look
anyway. **This is the cheapest way to make an existing prose rule real.**

**C2 · Option-length cue.** Longest-option-is-correct is one of the oldest
documented test-wise cues. Check: if the correct option's length in
characters is both the maximum and ≥ 1.5 × the mean length of the
distractors, warn. Skip for `type: "cloze-single"` where all four options
are verb forms of the same lemma — the cue does not exist there — and
apply it to restatement, paragraph completion and reading, where options
are sentences and the cue is real.

**C3 · Stem–option lexical overlap cue.** In restatement and reading,
authors unconsciously build the key out of the stem's own words. Check:
tokenise stem and each option, drop a small English stopword list, compute
content-word Jaccard; warn if the correct option scores highest **and**
its score exceeds the best distractor by more than 0.15. For restatement
this is close to an inversion of the intended skill: a good restatement
paraphrases, so the key having the *most* shared vocabulary is a signal
the item is solvable by word-matching.

**C4 · Banned option forms.** Reject (error) any option matching
`/^\s*(all|none) of the (above|these)\s*$/i`, and any option that is a
substring of another option in the same item after normalisation. The
second catches the mutually-implied pair — if `could` and `could have`
are both options, one of them is arguably contained in the other's reading
and the item is muddier than the author thinks. *Warning* for the
substring case; it has legitimate exceptions.

**C5 · Near-duplicate stems across the whole corpus.** The batch-diversity
check, and it must be corpus-wide, not batch-wide, because the drift in §4
is between batches. Check: normalise each `paragraph` (lowercase, strip
punctuation and the blank), take word 3-grams, compute Jaccard against
every other question in the corpus. **Error at ≥ 0.60, warning at ≥ 0.40.**
At ~1,000 items this is 500k comparisons of small sets — under a second in
Node, and it can be windowed by category if it ever isn't.

**C6 · Scenario over-use.** The unenforced "vary everything" rule. Check:
across a topic's questions, count content words (stopwords and the four
option strings removed) appearing in more than **25%** of paragraphs;
warn, listing them. "library", "university", "professor" appearing in 8 of
24 is the finding, and it is exactly the mode collapse §1.5 predicts.

**C7 · The tip must be transferable.** `CONTENT_GUIDE.md`'s rule is that a
tip is a rule, not a restatement of this item. Mechanical proxy: warn if
`tip` contains any capitalised token from `paragraph` that is not a
sentence-initial word — i.e. the tip names the item's character or place.
Narrow, near-zero false positives, and it catches the commonest bad tip.

**C8 · Provenance completeness.** Once §6's batch log exists: every
question id in `data/` must appear in exactly one entry of
`content-log/`, and every id in the log must exist. *Error.* This is what
turns "we reviewed it" from a claim into a checkable fact, and it is four
lines.

**C9 · Counter-signal coverage.** The learning-design arm's specification
— roughly one item in four should be one where the signal word is present
and the obvious answer is wrong — is currently a sentence in a research
file. Give a question an optional boolean `counterSignal`, and warn when a
category with ≥ 8 questions has fewer than one in five flagged. The field
is authored, so this checks that somebody *claimed* it, not that it is
true; that is still worth having, because it forces the author to decide
per item and it gives the reviewer a list to verify.

Per-type checks are in §5 with their item types.

### 2.4 Checks that need a second model

These are a **review pass**, run by the supervisor on a batch, not in CI —
they are non-deterministic and they cost tokens, and a non-deterministic
gate in CI is a gate that gets disabled. §3 is how they are organised.

**M1 · Blind solve.** Answer each item cold: stem, options, nothing else.
No key, no explanation, no tip, no category name. Output one of `clean`,
`ambiguous`, `not_well_posed`, `gold_incorrect`, plus the chosen option
and one sentence of reasoning. §3.2.

**M2 · Context-stripped solve.** The passage-blind baseline, adapted per
type. §3.2.

**M3 · Distractor defence.** For each distractor: name the specific
misconception a learner holding it would have, and give the specific
reason it is wrong here. A distractor for which the model cannot do both
is a non-functioning distractor and should be replaced.

**M4 · Item-writing-flaw rubric.** The applicable subset of the 19-criterion
rubric, applied per item, as a checklist with a yes/no and a quotation.

**M5 · Near-duplicate judgement.** After C5's mechanical pass, ask whether
any two items in the batch test the *same discrimination* — which is a
semantic duplicate even when no words are shared, and is the one C5 cannot
see.

Three constraints on all of these, from the LLM-judge literature
(**Reported**):

- **Never the authoring session.** Intrinsic self-correction does not
  work — models asked to fix their own reasoning without external feedback
  frequently make it worse — and judges show self-enhancement bias toward
  their own outputs. The reviewer gets the items and the spec, and nothing
  the author wrote about them.
- **Shuffle, and run the blind solve twice with the option order
  reversed.** Position bias is well documented in LLM judging. Here it
  earns its keep twice over: an item whose blind answer *changes* when the
  options are reordered is itself a finding.
- **Prefer a different model** where one is available, and at minimum a
  different session with a different brief.

### 2.5 What only a human can do, and specifically only this human

Four things, and the supervisor should know that they are his and not
delegable:

- **Is the Turkish right?** He is the only native speaker in the loop.
  Fluent-but-off Turkish in an explanation is invisible to the validator's
  character heuristic and to a reviewing agent that produced the same
  register.
- **Is the English natural?** Agents write correct, slightly airless
  English. Exam English is journalistic. Only a person who has read the
  real paper can tell.
- **Does this item punish the student who knows more?** `modals-t17`
  again. This requires holding "what a strong learner would think" in mind
  and is the judgement models are worst at.
- **Is this what the exam actually asks?** The exam arm could not reach a
  primary source. Until the sample paper is in hand, every claim about
  item flavour is the owner's to make.

### 2.6 One check I would not build

**Balancing the correct answer's position.** `quiz-engine.js` shuffles
options per attempt, so position carries no information to the learner.
Checking `correctIndex` distribution would be a real psychometric practice
applied to a system where it cannot matter — the definition of theatre. It
goes in the refusals.

---

## 3 · Review architecture

### 3.1 What serious item banks do, and what survives the translation

**Reported**, from exam-board and licensure documentation:

- **Items are reviewed by several people in different roles, not by one
  person once.** The standard set is another content expert, an editor, a
  bias/fairness reviewer, and a psychometrician; the review results are
  themselves recorded as validity documentation.
- **Content review has a fixed agenda**: the single best answer, the
  accuracy of each distractor, clarity of wording, fit between stem and
  options, and *test-wise clues* — hints inside the item as to which
  options are right or wrong.
- **Every item carries a supporting reference.** NBME items are prepared
  with a citation to a current textbook, journal or site. The claim the
  item makes is traceable to something outside the item.
- **Items are pretested before they count.** Cambridge runs pretests
  through ~30,000 candidates a year, and holds a *pretest review meeting*
  that considers the item statistics **and** candidate and teacher
  feedback together.
- **Item writers edit as a team**, led by a chair and a subject officer —
  not alone, and not by the writer's own judgement.

Three of those five transfer, one transfers in a mutated form, and one
does not transfer at all.

| Practice | Here |
| --- | --- |
| Multiple reviewers in distinct roles | **Transfers.** The roles become agent briefs. Distinctness is what buys the coverage, not headcount. |
| Fixed content-review agenda | **Transfers, and is the cheapest win.** It is a checklist; §3.3. |
| A supporting reference per item | **Transfers, mutated.** There is no textbook to cite. The equivalent is the **category spec** (§4.1): the item cites the specific rule and the specific misconception it is built on. |
| Team editing under a chair | **Transfers as the supervisor.** He is the chair, the subject officer and the fairness reviewer, and his time is the budget. |
| Pretesting with candidate statistics | **Does not transfer.** §2.1. What survives is the *feedback* half of the pretest review meeting: §2.2's think-aloud and report channel. |

The last row is worth dwelling on. Cambridge's pretest meeting looks at
statistics *and* candidate feedback. This project gets the second half and
none of the first, so the second half has to carry more weight than it
does anywhere else — which is the argument for taking §2.2 seriously
rather than treating it as a nicety.

### 3.2 The gate: solve it blind, then solve it stripped

This is the part I would build first, and it replaces "the supervisor
reads the items" as the primary control.

**Pass A — blind solve.** A reviewing session receives, for each item,
only: the stem (and passage, where the type has one) and the four options,
in a shuffled order. It receives **no** key, explanation, tip, category
name, or authoring brief. It returns, per item:

```
id            the item id
answer        the option it chose, as text
confidence    high | medium | low
verdict       clean | ambiguous | not_well_posed | gold_incorrect
why           one sentence
```

Then the same pass runs again with the option order reversed. Three
outcomes matter:

- **Disagreement with the key** → `gold_incorrect` candidate. Supervisor
  reads it. This is the `modals-t17` detector.
- **`ambiguous`, or two runs disagreeing with each other** → the item has
  more than one defensible answer, or the reviewer is order-sensitive on
  it, which for a four-option grammar item means the options are too close
  to call. Either way the supervisor reads it.
- **Agreement with the key at high confidence** → weak positive evidence,
  and *only* weak. A capable model answering a B2 grammar item correctly
  is not news. The value of Pass A is entirely in its failures.

**Pass B — context-stripped solve.** The passage-blind baseline from §1.3,
adapted per type. The item is presented with the evidence that is supposed
to decide it removed:

| Type | What is removed |
| --- | --- |
| Grammar cloze | Every sentence except the clause containing the blank |
| Vocabulary | Same |
| Restatement | Nothing to strip — instead, give only the four options and ask which is the odd one out; a set where the key is identifiable without the stem is broken |
| Paragraph completion | The paragraph. Only the four candidate sentences remain |
| Reading | The passage. Only the question and options remain |
| Cloze passage | Every sentence except the one holding the blank |

**An item answered correctly with the deciding evidence removed is a
failed item**, and the failure is precisely "tests the surface cue rather
than the construct". This is the check the learning-design arm's §7.2
needs and did not have: run it over the four existing *Present Perfect vs
Past Simple* questions and it should fail all four, which is both a
validation of the check and a to-do list.

Two honest caveats. A strong model will sometimes answer a *good* item
from the stripped context by guessing well — so Pass B produces
candidates, not verdicts, and the threshold should be "correct at high
confidence", not merely correct. And running Pass B on reading items
requires the model not to have the passage in context from Pass A, i.e. a
separate session.

**This pair is the answer to the question in the brief's title.** It is
mechanical, it runs unattended, it produces a short list, and the
supervisor's scarce attention goes to the short list rather than to
everything.

### 3.3 The reviewer's brief, and the sentences it must contain

A third brief in `docs/agents/`, alongside the curriculum and question
authors: **`item-reviewer.md`**. Its shape follows the existing two, and
these are the sentences it cannot be written without.

**On what it is given:** *"You are given the items and the category spec.
You are not given the answer key, the explanations, or anything the author
wrote about their own items — if you find yourself reasoning about what
the author intended, stop, because you have been given something you
should not have."*

**On the standard:** *"You are not judging whether the item is good. You
are trying to break it. An item survives review by resisting an attempt to
answer it a different way, not by looking reasonable."*

**On distractors, the half nobody reads:** *"For every wrong option, name
the specific misconception that would lead a learner to choose it, and the
specific reason it is wrong here. If you cannot do both for an option, say
so — that option is doing no work and the item is effectively three
options wide."*

**On ambiguity, which is the expensive defect:** *"An item where a second
option is defensible under any reading a B2 learner could reasonably have
is `ambiguous`, even if the keyed option is better. 'Less natural' is not
'wrong'."*

**On the construct:** *"State, in one clause, what a learner must know to
answer this item that they would not need to know to answer it if the
context were removed. If the honest answer is 'nothing', the item tests a
keyword."*

**On its own limits:** *"Do not rate difficulty. Do not rate quality on a
scale. Both are things you are measurably bad at; return the four verdicts
and the evidence, and let a person weigh it."*

And the agenda, taken from the exam boards' content review and cut to what
applies here — the review is a checklist, per item, each answered with a
quotation from the item rather than a judgement:

1. Is there exactly one defensible answer?
2. Does each distractor correspond to a nameable misconception?
3. Is any distractor ungrammatical or impossible, and therefore free?
4. Is the item decidable from its context, and only from its context?
5. Does the stem contain a clue — a grammatical agreement that fits only
   one option, a word repeated in the key, a length or specificity cue?
6. Does the item assume knowledge a Turkish B2 learner would not have
   (a cultural reference, a name, an institution, a unit, a holiday)?
7. Is the register and length within the spec's band?
8. Does the item test the category it is filed under?

Item 6 deserves a note. The published bias/fairness review exists to catch
content that disadvantages a subgroup. Here the "subgroup" is the whole
audience: an item resting on American campus life, imperial units, a
first-name-only convention, or a cultural assumption is not offensive, it
is simply harder for the wrong reason. The exam's own passages are
academic and international; the items should be too.

### 3.4 Resolving disagreement

The systematic-review world has solved this shape of problem and its
answer is boring and correct: **two independent screeners, conflicts to a
third adjudicator, and the agreement rate is itself reported.**
(**Reported**; the literature also records that dual screening finds
eligible studies a single screener misses, and that inter-rater kappa
across reviewers is often mediocre — 0.49 in one study of 34 reviewers —
which is the point: reviewers disagree, so build for it.)

Translated:

- **Reviewer 1** is the blind-solve pass (§3.2). It is mechanical and it
  never sees the author's reasoning.
- **Reviewer 2** is the rubric pass (§3.3). It sees the full item
  including key and explanation, because half the agenda is about the
  explanation.
- **Conflicts** — anything either pass flags — go to the supervisor, who
  adjudicates. He is the third reviewer and the only one whose verdict is
  final.
- **Agreement is recorded per batch**: how many items each pass flagged,
  how many both flagged, how many the supervisor upheld. Three numbers per
  batch, one line in the log, and they are the only evidence you will ever
  have about whether the review is working. §4.4.

If Reviewer 2 flags nothing across three batches while the supervisor
keeps finding defects, Reviewer 2 is decoration and its brief needs
rewriting. You cannot notice that without the three numbers.

### 3.5 Where the supervisor's attention goes

The budget is one person with a job and an exam. Spend it in this order,
and note that the first item is *before* he reads anything.

**1 · Take the batch as a test.** Fifteen items, no key visible, ten
minutes, on the phone. Record the answers. This is the anti-automation-bias
intervention and it is derived directly from §1.6: reading an item with
its answer and a persuasive Turkish explanation attached is a task in
which the defect is undetectable, and *answering* it is a task in which
the defect surfaces as hesitation. Every item where he hesitated, guessed,
or answered without reading the context goes on the list regardless of
whether he got it right.

Second-order benefit, and it is not small: this is retrieval practice for
the person who has to sit the exam, on material he is going to have to
read anyway. The review cost is partly repaid as study.

**2 · Read the flag list.** The union of: his own hesitations, Pass A's
non-`clean` verdicts, Pass B's stripped-context successes, and Reviewer
2's rubric failures. On a well-behaved batch of 15 this should be four to
seven items. If it is fifteen, the batch is not ready and the right move
is to reject it wholesale rather than repair it item by item — repairing a
bad batch is slower than regenerating against a fixed spec.

**3 · Read every Turkish explanation once, fast.** Fifteen short
paragraphs. He is the only person who can, and a fluent-but-wrong Turkish
explanation is a defect the whole rest of the pipeline is blind to.

**4 · Read nothing else.** Specifically: not the distractor rationales for
items that passed, not the reviewer's prose for `clean` items. That is
what the pass is for, and re-reading it is how a two-hour review becomes a
five-hour one and then stops happening.

### 3.6 Is the reviewer actually working? Salt the batch.

A review pass has the same problem as the content: it drifts, and nothing
tells you. The fix is cheap and this repository already owns the
materials.

`docs/education-notes.md` records real, human-found defects in shipped
items: `modals-t17` (two defensible answers), `tenses-t20` (effectively
two options wide), `passive-voice-t15` (an option no learner would
consider), `passive-voice-t23` (every option grammatical; keyed on taste),
`passive-voice-t20` (tests a structure no lesson taught). Freeze those
five, plus five items the supervisor has personally verified as sound,
into `docs/agents/calibration-items.json` — **not** under `data/`, because
they are tooling, not content.

Then: **every review batch is salted with two or three of them**, ids
rewritten so they are not recognisable. The reviewer must flag the known
bad ones and pass the known good ones. If it misses a known bad item, its
verdict on the rest of the batch is worth nothing and the batch is
re-reviewed with a repaired brief.

This is the closest thing to a unit test a probabilistic reviewer can
have. It costs one file and a few lines of assembly per batch, it never
expires, and it grows for free — every defect the supervisor finds by hand
gets added to the calibration set, so the review gets harder to fool over
time rather than easier.

---

## 4 · Batch strategy

### 4.1 The missing artifact: a category spec

The kickoff in `docs/agents/README.md` fixes the taxonomy and the counts,
and then hands an agent a category name and asks for four questions. The
distance between "Present Perfect vs Past Simple" and a specific item is
enormous, and every agent crosses it differently. That gap is where
between-batch inconsistency comes from, and no amount of reviewing at the
far end closes it.

Automatic item generation has a name for what belongs in the gap.
**Reported:** the standard AIG method is three stages — content experts
build a **cognitive model** describing the knowledge, the sources of
difficulty and the plausible errors; an **item model** turns that into a
template with variable elements; an algorithm generates. The claimed
result is items whose psychometric properties resemble traditionally
written ones on a high-stakes health-professions exam, and — the part that
matters here — the distractors are derived *from the cognitive model*
rather than invented per item, which is what makes them systematically
plausible. Recent hybrid work uses an LLM to draft the template, reportedly
cutting template construction from about five hours to under ten minutes.

The full template machinery is wrong for this project: templated items are
mechanically similar, and this app's items are short prose passages where
similarity is the thing to avoid. But the **cognitive model is exactly
right**, it is what is missing, and it is one page of Markdown per
category. Call it a **category spec**, keep it in `docs/specs/<topic>/`,
and require it before any authoring session for that category is started.

A spec contains, and I mean these as required headings:

1. **The discrimination.** One sentence: what a learner must decide.
   *"Whether the period the verb describes is still open at the moment of
   speaking."*
2. **The rule, stated so it is right.** Including the cases where the
   obvious signal word does not decide. This is the same content as the
   lesson's `decision` block and should be written to agree with it —
   which is also how the lesson/question contradiction from §1.2 gets
   caught before it ships rather than after.
3. **The misconceptions, numbered.** M1, M2, M3… Each is a wrong rule a
   Turkish-speaking B2 learner actually holds, phrased as the learner
   would hold it. *"M2: 'for' means Present Perfect."* Five to eight per
   category. **This is the distractor source**: every distractor in every
   item must be traceable to a numbered misconception, and the item's
   review record says which. That single requirement is what converts
   distractor writing from taste into engineering, and it is the
   difference the AIG literature attributes its distractor quality to.
4. **The context bank.** Ten to fifteen one-line scenario seeds in
   different domains — a lab, a city council, a translation deadline, a
   glacier, a court, a bakery supply chain — written once by the
   supervisor. Agents draw from it and mark which they used. This is the
   cheapest fix for §1.5's mode collapse and it needs no cleverness: the
   diversity is supplied, not requested.
5. **The difficulty recipe.** The surface features fixed by fiat, since
   §1.4 says difficulty cannot be measured: sentence count, whether the
   deciding evidence sits in the blank's own clause or elsewhere, whether
   a counter-signal is present. Three bands, and the batch plan says how
   many of each.
6. **The coverage plan.** For a batch of 15: which misconceptions get how
   many items, how many counter-signal items (the learning-design arm's
   one in four), how many at each difficulty band, and which context seeds
   are off-limits because an earlier batch used them.

A spec is written by the supervisor with an agent's help and then it is
**frozen**. It is the fixed input every future batch for that category is
generated against, which is the only mechanism that makes batch 7
comparable to batch 1 at all. Changing a spec is a deliberate act with a
version number, exactly like a taxonomy change.

The honest cost: one page per category, eighteen categories today,
probably an hour each with an agent drafting and the supervisor
correcting. Eighteen hours, front-loaded, against a corpus of a thousand
items. It is the best-value eighteen hours in this document, and it is
also the thing most likely to be skipped because it produces nothing a
learner can see.

### 4.2 Twenty for one category, or four across five

**One category, the whole target at once.** Four reasons, in order of
strength:

**Diversity is a property of a set, and only a set in one context can be
made diverse.** §1.5's mode collapse is between independent generations.
An agent writing 15 items for one category with all 15 in view can be told
"no two items may share a scenario domain, a sentence shape, or a
misconception pair" and can actually comply, because it can see what it
has already written. Fifteen items produced by five separate sessions
cannot be made to satisfy that constraint by any instruction, because no
session sees the others. The corpus-wide near-duplicate check (C5) then
catches what leaks *between* batches, which is the residual the set-level
constraint cannot reach.

**Review is faster per item within a category.** The reviewer holds one
rule, one misconception list and one spec in mind for the whole batch. A
mixed batch forces a context switch per item and the marginal item gets a
worse read. Given that review is the binding constraint, anything that
raises items-reviewed-per-hour is worth more than it looks.

**A category is a shippable unit.** Twelve items in one category is a
working practice loop for that category. Four items in each of five
categories is five broken loops. Since rounds will be abandoned halfway —
they always are — the unit of work should be the unit of usefulness.

**Coverage is checkable.** "Did this batch cover M1–M6 and include four
counter-signal items?" is answerable for a single-category batch and
meaningless for a scattered one.

The counter-argument is real and should be stated: a single-category batch
tempts the author into fifteen variations of one sentence frame, which is
the *worst* diversity outcome, and it is the failure mode a scattered
batch cannot have. The mitigation is the spec's coverage plan and context
bank — the author is filling a distribution, not free-associating around a
theme. Without a spec, I would actually reverse this recommendation and
scatter, because scattering is a crude diversity mechanism and a
spec-less single-category batch is where fifteen near-duplicates come
from.

**Size: 12–15 items, and not more.** Three constraints converge on the
same band. It is the learning-design arm's derived pool size, so a batch
is exactly one category made whole. It is about what one reviewing pass
holds without the later items degrading — long generations drift, and the
fifteenth item of a run is written with a context full of the previous
fourteen. And it is about what a person can adjudicate in one sitting; a
batch that cannot be finished in one evening will be finished across two,
which is where standards slip.

### 4.3 How batch 7 gets worse, and how you would notice

Three distinct mechanisms, three distinct countermeasures. They are worth
separating because they fail differently.

**Within-run degradation.** Later items in a long generation are worse and
more similar than earlier ones. *Countermeasure:* cap the batch at 15;
require the author to state the coverage plan *first* and then fill it,
so the last items are the ones the plan assigned rather than whatever is
left in the context.

**Between-run inconsistency.** Two sessions given the same category name
produce different interpretations of what the category means, different
distractor conventions, different registers. *Countermeasure:* the frozen
spec, plus **three fixed exemplar items** in the brief — the same three,
every time, chosen by the supervisor as the bar. Exemplars anchor register
far more effectively than adjectives do. They should be real shipped items
he has verified, and they should be replaced only deliberately.

**Standard drift in the reviewer and the supervisor.** The insidious one:
the content does not get worse, the gate does. Batch 7 passes because the
review has quietly relaxed. *Countermeasure:* §3.6's salted calibration
items, which are a fixed measuring stick, and the batch record below,
which makes the trend visible.

**How you notice.** Four numbers per batch, in the log, and their trend
across batches:

| Number | What a rise means |
| --- | --- |
| Items flagged by Pass A / Pass B | The content is getting worse, or the spec is not being followed |
| Items flagged by the rubric pass | Same |
| Items the supervisor rejected or rewrote | The reality check on the two above |
| Calibration items the reviewer missed | The *review* is getting worse — and this one invalidates the other three |

If the supervisor's rejection rate rises while the reviewer's flag rate
falls, the reviewer has drifted. If both rise, the authoring has. If both
fall while the calibration items are still caught, things are genuinely
improving — which they should, because the spec accumulates the
misconceptions found in earlier rounds. That last point is the reason to
keep the numbers at all: **the pipeline is supposed to get better, and the
only way to claim that honestly is to have measured it from the
beginning.**

### 4.4 The batch record

One Markdown file per batch, in `content-log/`, outside `data/`. It is
short:

```
Batch:        2026-09-14-tenses-present-perfect-vs-past-simple
Spec:         docs/specs/tenses/present-perfect-vs-past-simple.md @ v2
Brief:        docs/agents/question-author.md @ 1a2b3c4
Author:       Claude Opus 5, one session, 2026-09-14
Reviewer:     Claude Opus 5, separate session, blind + rubric
Items:        tenses-t25 … tenses-t39   (15 authored, 13 shipped)
Salted:       3 calibration items, 3 caught
Flagged:      Pass A 2 · Pass B 3 · rubric 4 · union 6
Supervisor:   answered blind, hesitated on t31 t36; rejected t28 t33;
              rewrote the explanation on t31
Shipped:      2026-09-15 to branch test, merged to main 2026-09-18
```

That is the item-bank *item history* the standards ask for, reduced to
what one person can maintain: what produced these items, what checked
them, what was found, and what was done. It makes C8 possible, it makes
§4.3's trend real, and it is the evidence behind the disclosure sentence
in §6.

---

## 5 · The new item types

Each is harder to author than a single-blank grammar question, and each is
harder in a *different* way, which is why one brief cannot cover them.
What follows, per type: the sentences the brief must contain, the spec
fields the type adds, and the checks the validator can make. The runtime
shapes are the exam arm's (`docs/research/the-exam.md` §4) and I have not
changed them.

Two things apply to all five.

**Every new type needs its own reviewer agenda**, not just its own author
brief. The §3.3 checklist is written for a four-option grammar item; a
reading item's version has different questions on it, given below.

**Every new type needs three exemplars before the first batch.** Written
by hand, by the supervisor, and verified. This is the most reliable
control on register that exists and it costs one evening per type.

### 5.1 Restatement

The cheapest new type and the one closest to what exists. Its danger is
that it looks like a grammar item and is not one: it is decided by
*meaning*, and an author who thinks in transformations will write four
options that differ grammatically and mean the same thing, or four that
mean different things for reasons the learner can spot without reading the
stem.

**The brief must contain:**

- *"The keyed option must preserve every proposition of the stem —
  polarity, modality, time reference, causal direction and scope — and add
  none. A restatement that is merely compatible with the stem is wrong."*
- *"Each of the three distractors must come from a different named failure
  family, and you must say which: polarity flip, modality strength shift
  (must → should), causal direction reversed, time reference shifted,
  scope or quantifier changed, or true-but-not-equivalent. Two distractors
  from the same family waste a slot."*
- *"Do not build the keyed option out of the stem's own words. A good
  restatement paraphrases; if the key is the option that shares the most
  vocabulary with the stem, a learner can answer by matching words and
  the item tests nothing."*
- *"The stem must be a single sentence that is worth restating — it needs
  at least two propositions in a relation. 'The meeting was cancelled' has
  nothing to transform."*

**Spec additions:** the failure families above become the misconception
list; the transformation inventory (passive↔active, modal paraphrase,
conditional restructuring, concession, cause/effect, reported speech)
becomes the coverage plan.

**Validator:** no `____` in the stem (error). Exactly four options, each
≥ 6 words and a complete sentence — first character uppercase, final
character terminal punctuation (warning). Stem ≥ 12 words (warning). C2
option-length cue and C3 stem-overlap cue from §2.3 both apply, and C3 is
the important one here.

**Reviewer agenda additions:** "For the keyed option, list the stem's
propositions and check each survives. For each distractor, name which one
it breaks." That is a mechanical procedure, it is fast, and it is exactly
what an author skips.

### 5.2 Paragraph completion

The hardest items in this document to write well, and the exam arm ranks
them last for that reason. The failure mode is specific: an author writes
one sentence that fits the topic and three that do not, and the item
becomes a topic-matching exercise. A real paragraph-completion item is
decided by **cohesion** — a pronoun that has no antecedent unless this
sentence is there, a contrastive marker that requires the preceding claim,
a given-new chain.

**The brief must contain:**

- *"Name, for every item, the single cohesive link that forces the keyed
  sentence: the referring expression and its antecedent, the discourse
  marker and the claim it contrasts with, or the given-new chain and where
  it breaks. If you cannot name one, the item is decided by topic and is
  not a paragraph-completion item."*
- *"Every distractor must be on-topic and locally fluent. A distractor
  that is about something else is not a distractor; it is padding. Each
  must fail on cohesion — wrong referent, a marker that contradicts the
  flow, information given twice, or a new topic the following sentence
  does not pick up — and you must say which."*
- *"The removed sentence must not be the first sentence of the paragraph.
  Removing the topic sentence produces an item decided by summarising,
  which is a reading skill and belongs in a reading set."*

**Validator:** exactly one `____` (which for this type stands for a whole
sentence, not a word). The paragraph must retain ≥ 3 sentences besides the
blank (warning under that). Options ≥ 8 words, each ending in terminal
punctuation. The blank must not be the first sentence — check that a
sentence-terminal character occurs before the `____` (error). Warn if the
keyed option is the **only** option containing a pronoun or a discourse
marker from a small fixed list (*however, therefore, this, these, such,
instead, moreover*): that is a surface cue and a common one.

### 5.3 Cloze passage

The structural risk is that a cloze passage becomes ten single-blank items
sharing a background. On the real paper, the blanks are decided by the
passage's argument, and they are **mixed on purpose** — verb forms,
prepositions and connectives, and content vocabulary.

**The brief must contain:**

- *"One passage, one argument. A blank that can be answered by reading
  only the sentence it sits in is a grammar item that has been pasted into
  a passage — for each blank, name the sentence elsewhere in the passage
  that decides it."*
- *"Mix the blank types deliberately: roughly a third verb form, a third
  connective or preposition, a third content vocabulary. A cloze of ten
  verb-form blanks is not this exam's cloze."*
- *"No blank in the first sentence. The reader has no context yet, so a
  first-sentence blank is guessing."*

**Spec additions:** this type needs a spec per *passage set*, not per
category, because its unit is the passage. What it inherits from category
specs is the misconception list for whichever categories its blanks draw
on.

**Validator:** the count of `____` in `text` must equal `blanks.length`
(error) — the exam arm's derivation-not-authoring principle makes this
free. At least six words between consecutive blanks (warning). No blank
before the first sentence-terminal character (error). Each blank's options:
four, distinct, and the filled-sentence seam check the validator already
does, run per blank. Warn if more than 40% of a passage's blanks share one
category — that is the ten-verb-form cloze. Passage length band, and the
lexical profile check from §5.4.

### 5.4 Reading passages

The most valuable type and the one where a defect does the most damage:
the exam arm is right that a reading item with two defensible answers
teaches a learner to distrust a correct reading, which is worse than
teaching a wrong rule.

Two separate authoring problems, and the brief has to treat them
separately. The passage must be *readable* — right level, right register,
genuinely coherent, original. The questions must be answerable **from the
text and not from world knowledge**, which is the passage-blind problem
from §1.3 in its home territory.

**The brief must contain:**

- *"Write the passage first, and write it as prose that would stand on its
  own. Do not write it around the questions — a passage reverse-engineered
  from seven items reads like a list and the items become trivially
  locatable."*
- *"The passage must be original. Do not reproduce, translate or lightly
  paraphrase an existing text; if you find yourself recalling a specific
  article, change the subject."*
- *"For every question, give the exact span of the passage that answers it:
  paragraph number and the clause. If you cannot point at a span, the item
  is not a reading item and must be rewritten or dropped."*
- *"A learner who has not read the passage must not be able to answer.
  After writing each item, read the question and its four options with the
  passage covered. If one option is obviously true of the world, or the
  other three are obviously false, the item is testing general knowledge."*
- *"Distractors must be wrong **about the passage**, not wrong about the
  world: the classic four are a claim the passage does not make, a claim
  the passage makes about something else, a true statement that does not
  answer the question, and an over-generalisation of a hedged claim in the
  text."*
- *"A `Reference` item must quote a word or phrase that occurs verbatim in
  the passage, and must name the paragraph it occurs in."*

**Validator:** these are unusually checkable for a "soft" type.

- Passage word count in band (**280–400**; error outside 200–500,
  warning outside 280–400).
- Mean sentence length in band 15–25 words; warn outside.
- 5–8 questions per passage; warn outside. No more than two questions of
  the same skill category in one set (warning).
- **Reference-item check:** for an item whose category is `Reference`, the
  quoted span in the question stem must occur verbatim in the passage, and
  in the paragraph the stem names (**error** if absent). This is a string
  search, it is exact, and it catches a real and embarrassing bug class.
- **Vocabulary-in-context check:** the target word must occur in the
  passage (error).
- **Stem grounding:** warn if no content word of a question stem occurs in
  the passage — a question about something the passage never mentions.
- **Lexical profile.** This is the one that needs data: ship
  `tools/wordlists/` with the NGSL and the AWL as JSON, and report the
  percentage of passage tokens outside both lists. Warn outside a band the
  supervisor sets after looking at a few real passages (my guess, and it
  is only a guess without the sample paper: 2–6% off-list is the B2
  academic range; under 2% is too easy, over 8% is a passage that fails on
  vocabulary rather than reading). This is a genuine text-difficulty
  control obtainable with zero dependencies — a set lookup over ~3,400
  strings. **Check the licences before checking the lists in**; I could
  not reach either site to confirm terms.

**Reviewer agenda for reading:** answer all seven questions *without* the
passage (Pass B), then answer them with it, then check every claimed
answer span actually says what the key needs it to say. The third step is
where the real defects are, and it is exactly what an author does not do.

### 5.5 Vocabulary

Structurally the existing item shape, so it needs no engine work, but its
distractors are chosen by a completely different logic: not "which wrong
rule would a learner apply" but "which word would a learner confuse this
one with".

**The brief must contain:**

- *"All four options must be the same part of speech and must fit the slot
  grammatically. If three options are ungrammatical in the sentence, the
  item tests syntax and the vocabulary is decoration."*
- *"The context must decide the word by meaning or by collocation, and you
  must say which. A sentence in which two of the four options would both
  be reasonable is a failed item even if one is more idiomatic."*
- *"Draw distractors from the same sublist or the same word family as the
  target — near neighbours in academic register, not random words."*
- *"Include the Turkish gloss in bold inside the explanation. The learner
  gets the contextual reading and the form–meaning link in one item."*

**Validator:** the target word (the keyed option) must not appear
elsewhere in the paragraph (error — it gives the answer away). All four
options must be distinct and none a morphological variant of another by a
crude suffix strip (warning; this catches a word-formation item filed as a
vocabulary item, which is a different construct). The explanation must
contain a `**bold**` span (warning) — that is the gloss convention and it
is otherwise unenforced. And, if the category names a word list —
`AWL Sublist 1` — **the keyed option must be on that list** (error). That
last one is exact, free once the word lists are in the repo, and it is the
check that keeps a vocabulary set on its declared syllabus instead of
drifting into whatever the agent found interesting.

---

## 6 · Provenance and correctness

### 6.1 The honest standard

State it once, plainly, and let everything else be measured against it:

> **An item is correct when a competent human has confirmed that its key
> is uniquely defensible.** Not when the validator passes. Not when a
> reviewing model agrees. Those are filters that decide what the human
> reads; they are not the standard.

Two consequences the project should accept before it starts writing
hundreds of items.

**Unreviewed content must not ship.** The exam arm already refuses
auto-generated reading passages shipped unread, and the argument
generalises: an item nobody read is not "probably fine", it is unknown,
and §1's base rates say the prior is roughly a coin flip on at least one
flaw. If the review budget will not cover a section, ship less of that
section. A smaller correct app is strictly better than a larger one
containing an unknown number of items that teach false things to people
sitting a real exam.

**Correctness is asymmetric, so the review effort should be too.** An item
that is merely *bad* — too easy, a wasted distractor, a dull scenario —
costs a learner a minute. An item that is *wrong* — a bad key, a pitfall
marking correct English as an error, a decision rule that fails on the
paper — installs an error the learner will act on under exam conditions,
and it is the app's own confident Turkish explanation that installs it.
The review agenda in §3.3 leads with "is there exactly one defensible
answer" for that reason and not by accident.

### 6.2 What to record

The item-bank standards answer this and the answer is proportionate:
**Reported**, an item bank carries item author, date written, status,
correct answer, format, links to the blueprint, and *item history* —
usage, reviews, and changes. Cut to what one person can maintain, that is
§4.4's batch record plus two fields on the item itself.

The two fields I would put on the item, and only these two:

- **`counterSignal`** (boolean, optional) — from §2.3's C9. It is
  pedagogical metadata, it is checkable, and it is the one property of an
  item the author must decide deliberately.
- **nothing else.** Author, date, model, spec version and review outcome
  all belong in the batch record, keyed by id range. Putting them on the
  item would add five fields of bookkeeping to every one of a thousand
  JSON objects, would double every content diff, and would be exactly the
  kind of authored bookkeeping the lesson schema deliberately removed by
  deriving ids. Keep `data/` for what the learner reads.

The connection between the two is C8: the validator asserts every shipped
question id appears in exactly one batch record. That makes provenance a
property of the repository rather than a promise, and it is the only way
to answer "was this item ever actually reviewed?" a year from now.

**The spec version is the important one.** When a misconception turns out
to be wrong — a distractor family that seemed plausible and isn't — you
need to find every item built on it. `Spec: … @ v2` plus an id range is
how. Without it, a bad idea in a spec is unbacked-out and quietly
contaminates every batch after it.

### 6.3 There is no way to unship a wrong item, and there should be

Not asked, and it belongs here. Suppose §7 finds that `modals-t17` is
ambiguous — which it is, and it has been for weeks. The repository can
edit it. What it cannot do is anything about the learner who already
answered it, and the mechanics are worse than they look:

- history keys on question id, so a fixed item keeps its id and the
  learner's record now says they got wrong an item that no longer exists;
- `getWeakCategories()` sums that answer into a weakness the learner is
  still being sent back to (the learning-design arm's §7.1);
- a `check` block inside a lesson may have taught the wrong thing, and
  lesson progress records only that the page was read.

Three cheap moves, in order:

1. **Retire, don't silently rewrite.** A materially wrong item gets a new
   id and the old id is dropped. `contentVersion` bumps, which the app
   already surfaces as a badge. History for a dropped id becomes inert
   rather than misleading, which requires the scoring code to ignore ids
   it cannot resolve — worth checking that it does.
2. **An errata line in the batch record.** What was wrong, when it was
   found, how it was found. Two lines, and it is what makes §4.3's trend
   honest: the batches that later needed errata are the evidence that the
   review of the day was not enough.
3. **Say it once in the app.** Which is the next section.

### 6.4 Should the app tell learners the content is AI-authored?

**Yes — once, in Profil, in a sentence that says what was *checked* as
well as what was written, and never on the item itself.**

The case against is real and I want to state it fairly. **Reported:**
labelling content as AI-generated reliably *reduces* perceived
trustworthiness even when readers judge the same content accurate and
fair — the "transparency dilemma" — and detailed disclosure lowers
engagement further than simple disclosure does. A learner who trusts the
app less will use it less, and an app nobody opens teaches nobody.

I still land on disclosure, for three reasons, the third of which is the
one that decides it.

**It is true and it is material.** The content makes claims about a
language, to people who will act on them in an exam that decides a year of
their lives. §1's base rates say some of those claims will be wrong. A
learner is entitled to know the provenance of a claim they are being asked
to memorise. This is the same argument the repo already accepts about the
exam facts — the exam arm refuses to let its own findings be presented as
fact about a student's exam until the sample paper is checked.

**The trust research is about persuasion, and this is not a persuasion
context.** The studies that find AI labels reducing trust are largely
about news and messaging, where the reader's job is to believe or not.
This app's job is to be *used and corrected*. Its six users know the owner
built it with AI; the label is not news to them, and the finding that
matters more is the one about learners valuing authorship clarity and a
sense of control.

**The disclosure is what makes the defect channel work.** This is the
functional argument and it is decisive. A learner who believes the content
is authoritative and hits `modals-t17` concludes that *he* is wrong, and
learns something false with extra conviction. A learner who knows the
content is AI-written and human-checked concludes that the item might be
broken, and — if you have given him somewhere to say so (§2.2) — tells
you. **Disclosure converts your six users from consumers into your only
pretest panel.** That is worth more than the marginal trust it costs, and
it is the closest this project can get to Cambridge's pretest review
meeting.

**What it should say**, in Turkish, in Profil, one short paragraph, and
written to be informative rather than to hedge: that the lessons and
questions are written with AI and checked by a person before they ship;
that mistakes get through anyway; that a report link is right there on
every question; and that the app is not affiliated with the university or
the exam board. The last clause is not a legal reflex — it is the same
honesty as the rest of the sentence.

**Not on the item.** A badge on every question is noise, it goes invisible
within a session, and it lands in the middle of the retrieval moment,
which is the one place the app should be quiet. One statement in the place
where identity and settings live is the app's own existing logic about
where such things belong.

**And the sentence has to stay true.** If a batch ever ships unreviewed,
the sentence in Profil becomes false, and the cost of the disclosure is
that you would have to change it. That is a feature: it is the one place
where the honesty of the pipeline is exposed to the person it is about.

---

## 7 · The supervisor's loop

### 7.1 A round, end to end

A **round is one category**, 12–15 items. Nothing larger is a useful unit,
because nothing larger is finishable in one evening and nothing larger is
shippable when abandoned.

| # | Step | Who | Cost |
| --- | --- | --- | --- |
| 1 | Write or update the category spec (§4.1) | Supervisor + agent | ~1 h, **once per category, not per round** |
| 2 | Author the batch against the spec, coverage plan first | Author agent, one session | agent time |
| 3 | `npm run format`, `npm run validate` | Supervisor | 2 min |
| 4 | Pass A blind solve ×2 orders, Pass B stripped solve | Reviewer session 1 | agent time |
| 5 | Rubric pass (§3.3), with salted calibration items | Reviewer session 2 | agent time |
| 6 | **Take the batch as a test, cold** | Supervisor | 10 min |
| 7 | Adjudicate the flag list | Supervisor | 30–45 min |
| 8 | Return rejects for rewrite, or drop them | Supervisor → author agent | 10 min |
| 9 | Read every Turkish explanation once | Supervisor | 10 min |
| 10 | Merge, manifest counts, `contentVersion`, batch record | Supervisor | 15 min |
| 11 | `npm run check`, `npm run serve` + `npm run verify` | Supervisor | 10 min |
| 12 | Ship to `test`, try on a phone, merge to `main` | Supervisor | 10 min |

**Automated:** 3, 4, 5, 11 — and 4 and 5 are the ones that do the actual
filtering. **The supervisor personally does:** 6, 7, 9, and the judgement
inside 8. That is roughly **90 minutes of human attention per 12–15
items**, plus the one-off hour for the spec.

**What the supervisor must personally read**, stated as a rule because it
is the rule that decays first: every flagged item in full; every Turkish
explanation once; nothing else. Not the reviewer's prose on clean items,
not the distractor rationales that passed. Re-reading what the pass
already read is how a 90-minute review becomes four hours and then stops
happening — and, per §1.6, reading a passing item with its key attached is
close to worthless anyway.

### 7.2 What that arithmetic says about the corpus

At 90 minutes per 12–15 items, one properly reviewed item costs **six to
eight minutes of the supervisor's attention**. Against the exam arm's
credible corpus of ~950–1,070 items:

- **~950 items ≈ 100–125 hours.** At four hours a week that is six to
  eight months. At an evening a week it is a year.
- **The exam arm's "ship" column** — 40 restatement, 180 vocabulary,
  70 reading, 80 cloze blanks, 40 paragraph completion, 80 grammar
  top-up, ≈ 490 items — is **50–65 hours**, or three to four months at
  four hours a week.
- **Reading passages are cheaper per item and dearer per unit**: seven
  items arrive together and share one passage read, so a passage costs
  maybe 45 minutes of review for seven items. That is the best ratio of
  any type and it argues, again, for reading first.

These numbers assume the spec exists. Without it, review is slower —
because every item has to be judged against a standard the reviewer is
reconstructing from scratch — and the rejection rate is higher. The
eighteen hours of spec writing pay for themselves inside the first two
topics.

**The honest conclusion is the same one the exam arm reached from the
content side: pick fewer sections and finish them.** One category at 13
items is worth more than five categories at four, and one exam section
done properly is worth more than five at a quarter depth.

### 7.3 Making the round survivable

Three details that decide whether this is done for six months or
abandoned in three.

**A round must be abandonable at step 7 and still ship.** If the flag list
has nine items on it at 22:30, drop the nine and ship four. A category
with four new items is better than a category with none, the spec and the
batch record capture what happened, and the rejected items can be
regenerated later. The alternative — "finish the round properly next
week" — is how a half-reviewed batch ends up merged by someone who has
forgotten which items were flagged.

**Step 6 is not optional and should be scheduled first.** It is the
cheapest step, the highest-yield step, and it is study for the exam the
supervisor is sitting. If any step gets skipped on a tired evening, it
must not be this one.

**The order of a round should vary.** Reviewer fatigue is real and the
last items of a batch get the worst read. Adjudicate the flag list in a
different order each time — reverse, or shuffled — so that the item that
gets the tired read is not always the one with the highest id.

---

## 8 · What I was not asked

Seven things. The first is the one I would act on soonest.

### 8.1 The lessons need a blind pass too, and it is the same pass

Four of the ten defects in §1.2 are lesson defects and two more are
lesson–question mismatches; three of those six are cases where the lesson
and the questions actually contradict each other: a signal word taught as a trigger that the
lesson's own example contradicts, a `when` rule that would be wrong on one
of the topic's own questions, an item testing `be supposed to` that no
lesson mentioned. Those were found by agents that happened to be looking
at both. Nothing in the pipeline requires anyone to.

It should, and the check writes itself out of §3.2:

> **The lesson-sufficiency pass.** A reviewing session is given one
> lesson and that category's questions, and nothing else — no
> explanations, no tips. It answers every question **using only the
> lesson**. For each question it reports: answerable from the lesson;
> answerable but the lesson's stated rule gives the *wrong* answer;
> or not addressed by the lesson at all.

Three findings, three different actions. "Not addressed" is either a
lesson gap or a miscategorised question — `passive-voice-t20` exactly.
"Lesson gives the wrong answer" is the most dangerous defect this app can
have and there is currently no procedure that looks for it. And the pass
costs one agent run per lesson, needs no new schema, and is the strongest
argument I have for keeping the two content agents' outputs coupled rather
than merely co-located.

It also produces something the app wants anyway: a list of categories
whose questions are not covered by their lesson, which is the same
information the results screen's category→lesson link depends on being
true.

### 8.2 "Category" is about to mean three different things

Today a category is a confusable grammar pair. After the new item types it
is also a reading *skill* (`Inference`), a word-list slice
(`AWL Sublist 1`), and a cohesion pattern. Every mechanism in
`results.js` and `profile.js` keys on the string, so this works
mechanically — the exam arm is right about that — but three things follow
that nobody has decided:

- **The kickoff block cannot express it.** `docs/agents/README.md`'s
  kickoff has a topic, a tier, a category list and a per-category count.
  It has no item type, no spec reference, and no way to say "this topic's
  categories are skills, not contrasts". It needs both fields before the
  first reading batch, or the two agents will disagree about what a
  category *is*, which is the one failure the kickoff exists to prevent.
- **The weak-spots list will mix incommensurable things.** A learner's
  Profil showing "Inference" next to "Modal Perfects" next to "AWL Sublist
  2" is three different kinds of claim about him in one list. That may be
  fine; it should be a decision.
- **`CONTENT_GUIDE.md`'s rule that a category names a confusable pair
  needs a second clause**, and the validator's category checks need to
  know which kind they are looking at.

### 8.3 One JSON file per topic will not survive this

A topic today is 24 questions and 6 lessons. At 12–15 per category it is
~90 questions plus lessons — call it 3,000 lines — and a reading topic
with 25 passages of 350 words is far worse. Three problems, all of which
have already happened here in miniature:

- **Parallel sessions collide.** The formatter exists because two sessions
  round-tripping the same file produced a four-hundred-line diff. More
  content and more parallel batches make that constant.
- **Review by reading a 3,000-line file is worse than review by reading a
  batch.** The unit of review is a batch; the unit of storage should let
  you see one.
- **A diff stops being reviewable**, which quietly removes the last
  human check on what actually landed.

The fix is cheap and does not need a build step: authoring delivers to
`data/incoming/<batch-id>.json` (the question-author brief nearly says
this already), the supervisor merges, and if a topic file crosses some
threshold — 1,500 lines is a reasonable trigger — the topic's questions
split into per-category files with the manifest naming them. `topics.js`
already fetches per topic and caches; fetching a handful more static JSON
files on a topic open is not a meaningful cost, and the alternative is a
merge conflict every round.

### 8.4 Nine new warnings will kill the warning list

I have proposed nine validator checks and most of them are warnings.
`npm run validate` already prints warnings that do not fail the build.
Add nine more across a thousand items and the output becomes a wall
nobody reads, at which point the checks are worse than useless — they
create the belief that content was checked.

So the policy has to change with the checks: **warnings must be zero at
merge, or each surviving warning is named and dismissed in the batch
record.** One line — "t31 flagged for option length; the long option is
the correct one and the length is inherent to the form" — is enough. A
warning that is neither fixed nor explained is a warning that will be
ignored on every subsequent run.

### 8.5 Originality is a correctness property, not a legal footnote

An agent asked for a 350-word academic passage may reproduce one it has
memorised, and an agent asked for exam-style items may reproduce items
from a published past paper. Both are problems for this project even
setting licensing aside: a passage lifted from somewhere else has not been
level-controlled, and a copied item comes without the misconception
analysis the spec requires. The brief line in §5.4 covers the passage; the
matching rule for items is *"do not reproduce items from past papers or
prep-school materials; use them only to calibrate the spec"*.

Three related loose ends: the licence terms for the NGSL and the AWL
before those lists are checked in; whether the app's own content should
carry a licence at all, which it currently does not; and the fact that
this app is not affiliated with the university, which §6.4's disclosure
paragraph should say.

### 8.6 The supervisor burns the pool he is supposed to practise on

Step 6 of every round has the supervisor answering every new item cold.
Over a year that means he has personally seen every item in the app before
any of it shipped. **He can never take a meaningful test in his own app.**

There is no fix, only an acknowledgement and a mitigation: his friends
can, so their results are the only ones that mean anything, and his own
benefit from the app is the review itself — which is, per the retrieval
literature the learning-design arm cites, a perfectly good form of study,
just not a measurable one. Worth knowing before he wonders why his scores
are so high.

### 8.7 There is no external calibration, and ten real items would fix it

Every standard in this document is internal: the spec says what good is,
the exemplars anchor it, the reviewer checks against it. Nothing connects
that loop to the actual exam. If the spec's idea of a B2 cloze blank is
two levels off, every check in §2 and §3 will pass a thousand items that
are wrong together.

The only cure is external material, and the exam arm already identified
where it is: YTÜ's published sample paper. **Ten real items, used as
exemplars in the briefs and as the calibration reference for the specs,
are worth more than any check in this document.** Not copied — read, and
used to fix the register, the length, the distractor style and the
difficulty band. This makes the exam arm's open question 2 the highest
priority in this round of research as well, from a completely different
direction.

---

## What I would build for v1

Ordered by value per hour of the supervisor's time. The first four cost no
code at all and can be run against the existing 72 questions and 18
lessons this week, which is the point: **the pipeline should be proven on
content that already exists before it is pointed at content that does
not.**

**1 · The reviewer brief and the calibration set.** `docs/agents/item-reviewer.md`
to §3.3, and `docs/agents/calibration-items.json` seeded with the five
known-bad items already documented in `docs/education-notes.md` plus five
verified-good ones. *One evening, no code.* Everything else in this
document depends on the review pass existing, and the calibration set is
what makes it checkable rather than reassuring.

**2 · Run Pass A and Pass B over the current 72 questions.** Blind solve
in both option orders, then context-stripped solve. *One agent run and an
hour of adjudication.* It will confirm `modals-t17`, and I expect it to
fail all four *Present Perfect vs Past Simple* items on Pass B. That
result is the proof the check works, and it is also the first entry in
the backlog.

**3 · The lesson-sufficiency pass over all 18 lessons** (§8.1). *One agent
run per topic, an evening of adjudication.* Six of the ten known defects
are lesson defects and half of those are lesson–question contradictions;
this is the only procedure that looks for them systematically.

**4 · Validator checks C1, C4, C5, C6.** Explanation names a distractor;
banned option forms; corpus-wide near-duplicate stems; scenario over-use.
*Half a day.* All four are string work over data already in the repo, all
four enforce rules `CONTENT_GUIDE.md` already states and cannot check, and
C5 is the only defence against between-batch drift that does not depend on
anyone remembering anything.

**5 · The category spec, as a template plus one worked example.**
`docs/specs/` with the six required headings from §4.1, and one category
written properly end to end so the shape is not theoretical. *Two hours
for the template, one hour per category after that.* Write specs for
categories as they come up for extension, not all eighteen at once.

**6 · The batch record and check C8.** `content-log/`, the format in
§4.4, and the validator assertion that every question id appears in
exactly one record. *Two hours.* This is what makes §6.4's disclosure
sentence true rather than hopeful.

**7 · The report link and the Profil disclosure.** A "bu soruda bir sorun
var" affordance on the feedback block that opens a pre-filled `mailto:` or
GitHub issue with the question id, and one paragraph in Profil saying the
content is AI-written and human-checked. *Half a day of code, and it is
the only user-visible item in this list.* It turns six users into the
pretest panel this project can otherwise never have.

**8 · One think-aloud session, with one friend, on ten items.** *One
evening.* Response-process evidence is the one validity instrument that
works better at small *n*, and nothing else available here will tell you
whether an item measures what it claims.

**9 · The remaining checks as their types arrive** — C2, C3, C7, C9 and
the per-type checks in §5, each landing with the item type it belongs to.
**10 · The word lists and the lexical profile**, when reading or
vocabulary authoring actually starts and not before.

Total before any new content is authored: **roughly three evenings of
agent-run adjudication and about a day of code.** That is the whole
apparatus, and it is small because almost all of it is prose and string
comparison.

---

## What I would defer

**Machine-readable distractor→misconception mapping** and validator-checked
coverage plans. The spec's numbered misconceptions should be *cited in
prose* in the review record first. Pick it up once three rounds have run
against a stable spec and the citations are actually being written —
formalising a discipline nobody is practising produces a schema and no
discipline. What would have to be true: specs stable over three rounds,
and a batch where coverage was actually the thing that went wrong.

**Splitting the topic files** (§8.3). Not yet worth the churn. Trigger: a
topic file over ~1,500 lines, or the second time two parallel batches
collide in one file.

**Any item statistic.** *p*-values, point-biserials, distractor take-up,
discrimination. What would have to be true: a hundred-odd people using the
app and a way to get their responses back — which means a backend, which
this project has refused for better reasons than this one would overturn.

**The full 19-criterion item-writing-flaw rubric.** I could not read either
source paper (§0), so the §3.3 agenda is a reconstruction. Pick it up when
someone can open Tarrant et al. (2006) or Haladyna, Downing & Rodriguez
(2002) and check the reconstruction against the original. Until then the
eight-point agenda is honest about what it is.

**Cross-vendor review** — running the review pass on a model from a
different family to defeat self-preference bias. Real effect, but a
different *session* with no access to the author's reasoning already
removes most of it. Pick it up if defect patterns start clustering in a
way that looks like the reviewer sharing the author's blind spots.

**Automatic CEFR or readability classification.** The band checks in §5.4
— word count, mean sentence length, off-list token percentage — get most
of the value with none of the machinery, and a trained classifier is a
runtime-shaped dependency in a repo that has none.

**A script that runs the review passes.** Do three rounds by hand first.
Automating a process before it has been run three times automates
somebody's guess about it.

---

## What I would refuse

**Any item statistic computed from six learners.** A *p*-value from six
responses, a point-biserial from six, a distractor "take-up" of 0 out of
6. These would look like psychometrics and be noise, and — worse — they
would be *acted on*, because a number on a screen gets used. This is the
clearest piece of theatre available at this scale and it is the one most
likely to be proposed, because the statistics are famous.

**Balancing the correct answer's position across a set.** The engine
shuffles options per attempt. The cue this guards against cannot exist
here. (§2.6.)

**Asking a model to rate difficulty, or quality, on a numeric scale.**
Direct LLM difficulty prediction correlates with empirical difficulty at
Spearman ≈ .05–.35 and with discrimination at ≈ .15 (**Reported**, §1.4).
A 1–5 "item quality" score from a reviewing agent would be an average of
things that cannot be averaged, and it would immediately become the number
people look at instead of the flags. Four verdicts and quoted evidence, or
nothing.

**Letting the authoring session review its own batch.** Intrinsic
self-correction does not work and self-enhancement bias is documented.
This is free to avoid and expensive to get wrong.

**Shipping unreviewed content behind a disclaimer.** A disclaimer is not a
control. If the review budget will not cover a section, the section ships
smaller. (§6.1, and it is the same refusal the exam arm made about
unreviewed reading passages — arrived at from the production side rather
than the pedagogical one.)

**A per-item "AI-generated" badge.** One honest paragraph in Profil, not a
label in the middle of every retrieval moment. (§6.4.)

**A single aggregate quality score for a batch.** It hides which check
failed, it invites optimisation against itself, and the four numbers in
§4.3 already say everything it would.

**Generating new items from the app's existing items as seed material.**
That is the loop mode collapse lives in: the corpus's idiosyncrasies get
amplified and its gaps get permanent. Items come from the spec and the
context bank, which are written by a person.

**Adding a runtime dependency for any of this.** Every check proposed here
is string comparison, set arithmetic and JSON. The word lists are data in
`tools/`, never fetched by the browser. If a check cannot be written that
way, it belongs in the review pass, not the validator.

---

## Open questions for the owner

**1 · How many hours a week, honestly?** Every number in §7 scales off
one input: your review capacity. Four hours a week reaches the exam arm's
"ship" column in three to four months and its "credible" column in six to
eight. One evening a week reaches the ship column in eight months. Both
are real answers; neither is "write more content".

**2 · Will you write ten exemplar items from the real sample paper?** §8.7
argues this is worth more than every automated check in this document,
because it is the only thing that connects the internal standard to the
external one. It is also an hour's work if you have the paper, and
impossible if you don't — which makes the exam arm's open question 2 the
gate on this arm too.

**3 · Breadth or depth for v1?** The pipeline can produce five sections at
a quarter depth or one section done properly, and the arithmetic says not
both. The exam arm's gate argument says reading; the learning-design arm's
pool argument says depth in what exists. They are compatible only if you
pick one section and finish it.

**4 · Do the friends agree to be a panel?** One think-aloud each, and a
willingness to report broken items. It costs them an evening and it is the
only source of response-process evidence this project will ever have. If
the answer is no, §2.2 collapses and the review pass is the whole quality
system.

**5 · Is the Profil disclosure sentence yours to write?** I have taken a
position (§6.4) and it is a position about your app's relationship with
your friends, not a technical finding. The wording especially — "yapay
zekâ ile yazıldı, bir insan tarafından kontrol edildi" says something
different from "yapay zekâ tarafından üretilmiştir", and the difference is
the whole point.

**6 · Retire or edit?** When an item turns out to be wrong, does it get a
new id (clean, but some learner history goes inert) or an edit in place
(no disruption, but the history now records an answer to a question that
no longer exists)? §6.3 recommends retiring. It is a decision about what a
question id *is*, and it should be made once rather than per incident.

**7 · Is there a second Turkish reader?** The supervisor's ten minutes per
round on the Turkish explanations is the one step that cannot be
delegated to an agent. If one of the friends would read them, that is ten
minutes a round back and a second pair of eyes on the register — and it is
the only place in this pipeline where adding a person actually helps.

**8 · Are you willing to freeze a spec?** A frozen spec means a category's
items are consistent with each other and with a standard you set once,
rather than each item being the best that session could do. That is a real
trade: consistency buys comparability and drift resistance, and it costs
the occasional item that would have been better if the author had been
allowed to improvise. I think it is obviously worth it at this volume. It
is still a choice about what kind of thing this content is.

---

## Sources

**Confidence note, repeated because it matters.** Every direct fetch was
blocked by this environment's egress proxy — arXiv, PubMed, PMC,
Frontiers, Springer, ScienceDirect, Wiley, and every publisher PDF I
tried. What follows are the pages the search index surfaced and
summarised. **I did not read any of them.** Numbers quoted as *Reported*
come from those summaries and are consistent across results; the two I
most wanted to verify directly — the Haladyna/Downing/Rodriguez
guidelines and the Tarrant item-writing-flaw rubric — are the two the
§3.3 review agenda reconstructs, and that reconstruction should be checked
against the originals by anyone who can open them.

**Item-writing guidelines and flaws**
- [Haladyna, Downing & Rodriguez (2002). A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment. *Applied Measurement in Education* 15(3)](https://www.tandfonline.com/doi/abs/10.1207/S15324818AME1503_5)
- [Tarrant, Knierim, Hayes & Ware (2006). The frequency of item writing flaws in multiple-choice questions used in high stakes nursing assessments](https://www.sciencedirect.com/science/article/abs/pii/S1471595306001065)
- [Tarrant & Ware (2008). Impact of item-writing flaws on student achievement in high-stakes nursing assessments. *Medical Education*](https://asmepublications.onlinelibrary.wiley.com/doi/10.1111/j.1365-2923.2007.02957.x)
- [The Impact of Item-Writing Flaws on Difficulty and Discrimination in Item Response Theory (arXiv 2503.10533)](https://arxiv.org/html/2503.10533v1)
- [Rodriguez (2005). Three Options Are Optimal for Multiple-Choice Items: A Meta-Analysis of 80 Years of Research. *EM:IP*](https://onlinelibrary.wiley.com/doi/10.1111/j.1745-3992.2005.00006.x)
- [An assessment of functioning and non-functioning distractors in MCQs. *BMC Medical Education*](https://bmcmededuc.biomedcentral.com/articles/10.1186/1472-6920-9-40)

**Automatic item generation**
- [Gierl, Lai & Turner. Using automatic item generation to create multiple-choice test items. *Medical Education*](https://mcc.ca/wp-content/uploads/AIG-Gierl-Lai-Turner-Medical-Education-Journal.pdf)
- [Gierl, Lai et al. Using Automatic Item Generation to Improve the Quality of MCQ Distractors](https://pubmed.ncbi.nlm.nih.gov/26849247/)
- [A suggestive approach for assessing item quality, usability and validity of Automatic Item Generation. *Advances in Health Sciences Education*](https://link.springer.com/article/10.1007/s10459-023-10225-y)
- [Feasibility assurance: a review of automatic item generation in medical assessment](https://link.springer.com/article/10.1007/s10459-022-10092-z)
- [Using a Hybrid of AI and Template-Based Method in Automatic Item Generation. *JMIR Formative Research* (2025)](https://formative.jmir.org/2025/1/e65726)

**LLM-generated items: quality and failure modes**
- [AI-assisted MCQ creation increases item-writing flaws through automation bias. *Frontiers in Computer Science* (2026)](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2026.1831250/full)
- [Evaluating the instrumental quality of LLM-generated assessment items. *Frontiers in Education* (2026)](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1837523/full)
- [The use of large language models in generating MCQs for health professions education: systematic review and network meta-analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12758716/)
- [Moore et al. An Automatic Question Usability Evaluation Toolkit (SAQUET) (arXiv 2405.20529)](https://arxiv.org/abs/2405.20529) · [repository](https://github.com/StevenJamesMoore/SAQUET)
- [Assessing the Quality of Multiple-Choice Questions Using GPT-4 and Rule-Based Methods (arXiv 2307.08161)](https://arxiv.org/pdf/2307.08161)
- [Ten tips to harnessing generative AI for high-quality MCQs in medical education assessment](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12273594/)
- [Automated Reading Passage Generation with OpenAI's Large Language Model (arXiv 2304.04616)](https://arxiv.org/pdf/2304.04616)

**Difficulty and discrimination prediction**
- [Text-Based Approaches to Item Difficulty Modeling in Large-Scale Assessments: A Systematic Review (arXiv 2509.23486)](https://arxiv.org/abs/2509.23486)
- [LLMs Struggle to Measure What Distinguishes Students of Different Proficiency Levels: Item Discrimination in Reading Comprehension Assessment (arXiv 2606.18709)](https://arxiv.org/html/2606.18709v1)
- [Estimating Item Difficulty with Large Language Models as Experts (arXiv 2605.18562)](https://arxiv.org/abs/2605.18562)

**Model review, judging and self-correction**
- [Huang et al. (2024). Large Language Models Cannot Self-Correct Reasoning Yet. ICLR](https://arxiv.org/abs/2310.01798)
- [Self-Preference Bias in LLM-as-a-Judge (arXiv 2410.21819)](https://arxiv.org/pdf/2410.21819)
- [Reliability without Validity: A Systematic, Large-Scale Evaluation of LLM-as-a-Judge Models (arXiv 2606.19544)](https://arxiv.org/pdf/2606.19544)
- [HLE-Verified: Systematic Verification and Structured Revision of Humanity's Last Exam (arXiv 2602.13964)](https://arxiv.org/html/2602.13964v2) — source of the `clean / not_well_posed / gold_incorrect / ambiguous` verdict set
- [Fantastic Bugs and Where to Find Them in AI Benchmarks (arXiv 2511.16842)](https://arxiv.org/html/2511.16842)

**Passage-blind baselines and reading-item artifacts**
- [World Knowledge in Multiple Choice Reading Comprehension (arXiv 2211.07040)](https://arxiv.org/pdf/2211.07040)
- [A Survey on Measuring and Mitigating Reasoning Shortcuts in Machine Reading Comprehension (arXiv 2209.01824)](https://arxiv.org/pdf/2209.01824)
- [What Makes Reading Comprehension Questions Difficult? (arXiv 2203.06342)](https://arxiv.org/pdf/2203.06342)

**Diversity and mode collapse in generation**
- [Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity (arXiv 2510.01171)](https://arxiv.org/html/2510.01171)
- [Multi-Sample Prompting and Actor-Critic Prompt Optimization for Diverse Synthetic Data Generation (arXiv 2506.21138)](https://arxiv.org/pdf/2506.21138)

**Review workflows, item banks and standards**
- [Item Review Workflow for Exam Development — Assessment Systems](https://assess.com/item-review/)
- [NBME — Item Co-Creation & Test Development Committees](https://www.nbme.org/about-nbme/our-collaborations/item-co-creation/)
- [How COMLEX Items are Developed — NBOME](https://www.nbome.org/blog/how-comlex-items-are-developed/)
- [Cambridge English — Producing exams: pretesting](https://www.cambridgeenglish.org/why-choose-us/producing-exams/pretesting/) · [What is Pretesting?](https://support.cambridgeenglish.org/hc/en-gb/articles/202843216-What-is-Pretesting)
- [Green & Hawkey (2010). An investigation of the process of writing IELTS Academic Reading test items (PDF)](https://ielts.org/cdn/Research/investigation-of-process-of-writing-academic-reading-test-items-green-et-al-2010.pdf)
- [Exploring the experiences of content experts with item vetting during item bank development](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11190415/)
- [AERA, APA & NCME (2014). Standards for Educational and Psychological Testing (PDF)](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf)
- [Use of a committee review process to improve the quality of course examinations](https://link.springer.com/article/10.1007/s10459-004-7515-8)

**Small-sample quality evidence**
- [Classical Test Theory: Item Statistics — Assessment Systems](https://assess.com/item-statistics-classical-test-theory/) · [Point-biserial item discrimination](https://assess.com/the-point-biserial-item-discrimination/)
- [Koskey (2016). Using the Cognitive Pretesting Method to Gain Insight Into Participants' Experiences](https://journals.sagepub.com/doi/10.1177/1609406915624577)
- [Cognitive interviewing as a method to inform questionnaire design and validity](https://www.sciencedirect.com/science/article/pii/S2949678023000211)
- [Evaluating the accuracy of screening by one vs two independent reviewers](https://www.sciencedirect.com/science/article/pii/S089543562600123X)
- [Belur et al. (2021). Interrater Reliability in Systematic Review Methodology](https://journals.sagepub.com/doi/10.1177/0049124118799372)

**Disclosure and transparency**
- [In Transparency We Trust? Evaluating the Effectiveness of Watermarking and Labeling AI-Generated Content — Mozilla Foundation](https://www.mozillafoundation.org/en/research/library/in-transparency-we-trust/research-report/)
- [Full Disclosure, Less Trust? How the Level of Detail about AI Use Affects Readers' Trust (arXiv 2601.09620)](https://arxiv.org/pdf/2601.09620)
- [1EdTech AI-Generated Content Best Practices v1.0](https://www.imsglobal.org/resource/AI-Generated_Content_Best_Practices/v1p0)
- [From Prompt to Practice: A Framework for Transparent GenAI Use in Higher Education — EDUCAUSE Review](https://er.educause.edu/articles/2026/3/from-prompt-to-practice-a-framework-for-transparent-genai-use-in-higher-education)

**Word lists, for §5.4's lexical profile**
- [The New General Service List](https://www.newgeneralservicelist.com/new-general-service-list)
- [Academic Word List — EAP Foundation](https://www.eapfoundation.com/vocab/academic/awllists/)
