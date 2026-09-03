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

Ten defects, four distinct mechanisms. Note what is *not* in the list:
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
