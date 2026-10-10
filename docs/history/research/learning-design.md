# Learning design

What the app should do to teach, and in what order. Written against the
build as it stands: 3 topics, 18 categories, 18 lessons, 72 questions —
exactly four per category — one blank and four options in every one of
them, and every lesson pulling two of its category's four questions in as
inline checks.

The short version. The loop the app already runs is the one the evidence
supports, and the two things it does best — testing, and explaining the
answer rather than marking it — are the two with the strongest research
behind them. Nothing in the pedagogy needs redesigning. What needs fixing
is that there is not enough content for the loop to be a loop: with four
questions per category, a learner who reads a lesson and takes one test
has met the entire pool, and every number the app then shows him is a
measurement of his memory for four paragraphs. The highest-value work is
not a feature. It is questions, plus three small changes that stop the app
lying about what it knows.

---

## 1 · The loop

Read a lesson, answer two checks inside it, take a test. That order is
right, and it is right for reasons worth writing down, because the
temptation in a rebuild is to rearrange it.

**Testing is the load-bearing part.** Retrieval practice and distributed
practice are the only two of ten study techniques that
[Dunlosky et al. (2013)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)
rate high-utility across ages, materials and criterion tasks; rereading
and highlighting, the two things students actually do, rate low.
[Yang, Luo, Vadillo, Yu & Shanks (2021)](https://pubmed.ncbi.nlm.nih.gov/33683913/),
pooling 222 studies and 48,478 students in real classrooms rather than
labs, put classroom quizzing at *g* = 0.499 on academic achievement.
[Rowland (2014)](https://pubmed.ncbi.nlm.nih.gov/25150680/) gets the same
0.50 across 159 lab experiments. This is one of the better-replicated
findings in the field, and the app is built on it already.

**The feedback is the second load-bearing part, and it is the part most
study apps get wrong.**
[Van der Kleij, Feskens & Eggen (2015)](https://journals.sagepub.com/doi/abs/10.3102/0034654314564881),
40 studies of item-level feedback in computer-based environments, found
elaborated feedback at *d* = 0.49, giving the correct answer at 0.32, and
telling the learner merely that they were wrong at **0.05**. Rowland found
testing with feedback at 0.73 against 0.39 without. The app's
`explanation` (why this option fits *this* passage, and why the closest
wrong one doesn't) plus `tip` (the transferable rule) is exactly the
elaborated condition. `CONTENT_GUIDE.md` already forbids one-line
explanations. That rule is worth more than any feature on the roadmap and
should be defended when an author is tired.

**Feedback timing: leave it alone.** The literature here is genuinely
contested and has been for thirty years. Kulik & Kulik (1988) found
immediate feedback better in classrooms and delayed better in labs;
Rowland found delayed feedback yielding the larger testing effect;
[a recent randomised trial in medical education](https://asmepublications.onlinelibrary.wiley.com/doi/full/10.1111/medu.15287)
found immediate and delayed equally beneficial in formative
multiple-choice testing. When a question has been asked this many times
and the answer keeps moving, the effect is small relative to everything
else in the design. The app's constraint decides it: this is a phone used
in fragments, and delayed feedback requires a second session the learner
may never open. Keep it immediate.

**Worked examples, and the one place the order is wrong.** A lesson here
is a worked-example sequence — a contrast, the structural patterns,
annotated examples — before any problem-solving. For a novice that is
correct and well supported; the expertise reversal effect
([Kalyuga, Ayres, Chandler & Sweller, 2003](https://en.wikipedia.org/wiki/Expertise_reversal_effect);
a [2025 meta-analysis](https://www.sciencedirect.com/science/article/pii/S0959475225000660)
finds the interaction reliable enough to treat as a design parameter)
says the same guidance *reverses* into a cost once the learner knows the
material. The app currently has one presentation of a lesson and shows it
to both people. A learner reopening a completed lesson two weeks later
does not need the contrast re-explained; he needs the `decision` block and
a question. That is a small change to `education.js` using progress the
app already stores, and it is the only ordering change in the loop I would
make.

I would **not** move checks before the instruction. Pre-questioning is
fashionable and the evidence is narrower than the enthusiasm: a
[multilevel meta-analysis of prequestions (2025)](https://link.springer.com/article/10.1007/s10648-025-10075-7)
found no general benefit for the non-prequestioned information in the
lesson (*g* ≈ .01) — the gain is confined to the items you pre-asked. With
four questions per category, pre-asking one costs a quarter of the pool to
benefit one item.

---

## 2 · Where this app is too easy

The obvious answer — "every question is four-option multiple choice, so
make the learner type" — is the wrong one, and the evidence is clearer
here than most people assume.

[Adesope, Trevisan & Sundararajan (2017)](https://journals.sagepub.com/doi/abs/10.3102/0034654316689306)
found multiple-choice practice tests producing *larger* effects than
short-answer ones (*g* = 0.70 vs 0.48).
[Kang, McDermott & Roediger (2007)](https://www.researchgate.net/publication/224943432_Test_format_and_corrective_feedback_modify_the_effect_of_testing_on_long-term_retention)
found short answer ahead only when feedback was given, and multiple choice
ahead when it wasn't. The generation effect is real but modest
([Bertsch, Pesta, Wiscott & McDaniel, 2007](https://link.springer.com/article/10.3758/BF03193441):
*d* = 0.40 over 86 studies), and it competes against transfer-appropriate
processing: wherever grammar is assessed on this exam it is assessed by
choosing an option, not by producing a form, and
[Pan & Rickard's (2018)](https://www.researchgate.net/publication/326143883_Pan_and_Rickard_2018_Transfer_of_test-enhanced_learning_meta-analysis_preprint)
meta-analysis of transfer shows benefits shrinking as practice and
criterion diverge. There is also a positive case for well-built multiple
choice:
[Little & Bjork](https://pubmed.ncbi.nlm.nih.gov/25123774/) show that
options which are genuinely competitive make the learner retrieve why each
*wrong* one is wrong, which improves later performance on the material
behind those distractors — an effect not obtained from cued recall. The
guide's "wrong options must be genuinely tempting" is doing more work than
it looks.

Against that, typed production costs: a text field on a phone, a Turkish
keyboard covering half the screen in a fixed-height shell that was
designed so nothing moves, and an answer normaliser (contractions,
capitalisation, *isn't* / *is not*, British spellings) hand-written under a
zero-dependency rule. It would fail quietly and mark correct answers wrong.
I would not build it.

The app is too easy in three other places, all cheaper to fix.

**Practice is blocked.** A topic test draws 15 items from one topic; a
category-scoped test from one category. Blocked practice inflates
performance during study and deflates it later.
[Brunmair & Richter (2019)](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)
put interleaving at *g* = 0.42 overall, but the moderators matter more than
the mean: 0.67 for paintings, 0.34 for maths, **−0.39 for word learning**,
ambiguous for expository text. Interleaving helps most when categories are
similar to each other and the material is complex — which is the precise
description of *Present Perfect vs Past Simple* sitting next to *Perfect
Aspects*. The nearest study to this app is
[Pan, Tajran, Lovelett, Osuna & Rickard (2019)](https://eric.ed.gov/?id=EJ1230840),
adults learning Spanish preterite/imperfect conjugation: no interleaving
benefit within a session or at two days, a substantial one at one week.
That is the shape to expect — interleaving looks worse while you do it and
better when it counts — and it is why the app should choose it rather than
the learner. The mixed test already exists; it is one screen away from
being the default.

**Checks are answered with the answer on screen.** A check placed
immediately after the `contrast` block is often solvable by scrolling up
three centimetres. That is copying, not retrieval, and retrieval is where
the effect comes from. The fix is placement, not mechanism: a check earns
its keep when the block it tests has left the viewport.

**The distractor set is fixed.** `buildQuizSession` shuffles option order
per attempt, which stops position learning, but the four strings are
always the same four. On second exposure a learner can recognise the item
without re-deriving anything. This is the pool problem in miniature, which
is the next section.

One production-flavoured change is worth having and costs no interface:
after a miss, ask a second question from the same category later in the
same session. That is scheduling inside `quiz-launch.js`, not a new input
mode, and it converts a wrong answer from a note on the results screen into
a second retrieval attempt.

---

## 3 · Four questions is not a pool

This is the real problem, and everything else is downstream of it.

A learner opens *Present Perfect vs Past Simple*, answers two of its four
questions as checks, then takes a topic test that draws 15 items from the
topic's 24 — so on average two or three of that same category's four,
including at least one he has just seen. Then his profile tells him
whether he is weak in it.

Retrieval practice does not transfer as far as its reputation suggests.
Pan & Rickard's meta-analysis of 122 experiments found a medium overall
transfer effect (*d* = 0.40), a larger one across test *formats* (0.58),
and progressively smaller ones as the distance between what was practised
and what was tested grew. A large share of what retrieval practice buys is
item-specific. With four items, the app is buying almost entirely
item-specific learning and then reporting it as knowledge of a grammar
contrast.

**What the minimum pool is, derived rather than guessed.** A lesson
consumes 2. A topic test should be able to run twice without repeating an
item drawn from a given category, which is another 4–6. Category-scoped
practice — a real feature of the app, reachable from both Test and Profil
— should give five fresh items and be repeatable at least twice over a
three-week run. And the score needs items the lesson never showed, or it
is not a measurement. That lands at **twelve to fifteen questions per
category**: roughly 216–270 across the current 18 categories, against 72
today.

That is a lot of writing, so stage it and get the structural part in
first:

1. **Eight per category** (72 new questions, doubling the app). Enough
   that a topic test stops repeating and category practice stops being a
   recital.
2. **Two of the eight are test-only** and never appear as a lesson check.
   One optional field in the question schema, four lines in the validator,
   one filter in `education.js`. This is the change that makes a score mean
   something, and it is small.
3. **One in four written to punish the surface heuristic** — see §7.
4. Beyond that, grow toward twelve as time allows, weakest categories
   first, using the app's own data to decide which.

**Until the pool exists**, three things the code should do, all small:

- Prefer unseen items when building a session. `buildQuizSession` picks
  uniformly at random; history already stores every answered question id
  with its attempt date, so passing that in and sorting by
  seen/unseen-then-random is a change to a pure function that already has
  unit tests around it.
- Stop summing all attempts into one accuracy figure (§7).
- Say the pool size on the topic card. "24 soru" is honest; a learner who
  knows he has seen them all will not mistake 90% for fluency.

---

## 4 · Sequencing

Three findings, and they point in different directions, which is why this
section is a compromise rather than a rule.

Mastery learning works.
[Kulik, Kulik & Bangert-Drowns (1990)](https://www.uky.edu/~gmswan3/575/kulik_kulik_Bangert-Drowns_1990.pdf),
108 controlled evaluations, found effects around half a standard deviation
on examinations, larger for weaker students (*d* ≈ 0.61) than stronger
(≈ 0.4), and durable at eight weeks. The same review records the cost:
self-paced mastery programmes **reduce completion rates** in college
courses. That is not a footnote for this app — it is the whole risk. A
friend three weeks from a proficiency exam who is told he may not proceed
to *Modal Perfects* until he scores 80% on *Must vs Have to* does not grind;
he closes the app. The project has already decided this once, in the rule
that lesson checks never gate progress. Extending gating to tests would
reverse that decision through the back door.

Learner control does not work either — as an instructional variable.
[Karich, Burns & Maki (2014)](https://eric.ed.gov/?id=EJ1034262) pooled the
educational-technology literature and found giving learners control over
sequence and pace produced *g* = 0.05, near zero, and near zero across most
moderators. Bjork, Dunlosky & Kornell (2013) explain why: learners
systematically prefer the conditions that feel fluent — blocked over
interleaved, rereading over testing — and fluency is not learning. Free
choice is not buying learning. It is buying the learner opening the app at
all, which is worth something but should be priced honestly.

So: **a strong default and no lock.** The app should always have an answer
to "what now" and should never refuse an answer to "let me do that
instead". Concretely, three changes:

- The end of a lesson currently offers the next lesson or a test on the
  same topic. It should offer a **mixed** test that includes the category
  just read plus categories read earlier. Same screen, different argument
  to `quiz-launch`, and it converts the app's main practice moment from
  blocked to interleaved.
- Real prerequisites exist in this taxonomy and are not encoded anywhere.
  *Passive with Modals* presupposes both *Modals* and *Tense Forms in
  Passive*; *Modal Perfects in Passive* presupposes *Modal Perfects*. A
  manifest field naming a lesson's assumptions, rendered as a line at the
  top of the reader with a link, is honest guidance that costs one line of
  content per lesson and gates nothing.
- A diagnostic that places the learner is the right idea and the wrong
  time. One item per category is 18 questions — a quarter of everything
  the app owns, spent before any teaching happens, and the items are then
  burnt. Revisit when there are eight per category and two are test-only.

---

## 5 · Session shape

The app should have an opinion about *what* to practise today and no
opinion at all about *how long*.

There is no credible evidence base for a specific session length. The
25-minute prescriptions circulating in study apps are folklore. What is
well supported is the spacing effect and its shape.
[Cepeda, Vul, Rohrer, Wixted & Pashler (2008)](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf),
1,354 participants across gaps up to 3.5 months and delays up to a year,
found an inverted-U: the optimal gap between study sessions is roughly
10–20% of the retention interval, nearer 20–40% when the test is a week
away. For a student sitting the exam in three weeks, that is a revisit
**every two to four days** — not daily, not once. Spacing also has a known
boundary condition worth stating plainly, because it is the one that
excuses cramming: spacing benefits shrink, vanish or reverse at very short
test delays. A student revising the night before is not behaving
irrationally for tomorrow's exam; he is behaving irrationally for the
degree. Three weeks out, spacing wins.
[Kim & Webb (2022)](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479),
98 effect sizes from 48 L2 experiments (N = 3,411), find the same pattern
in second-language learning specifically, with the caveat that grammar and
vocabulary may not behave identically.

The app can express this with what it already stores. History carries an
ISO date and per-item results for every attempt. A pure function over that
— pick one category last practised three or more days ago, plus one never
practised, ten items, mixed — is a few dozen lines, testable in
`node:test`, and renders as one row on the Eğitim index. Call it what it
is ("Bugün pratik") and let tapping something else be free.

What I would not do is build per-item spaced repetition. SM-2-style
scheduling assumes a large item pool, a learner who returns daily, and a
horizon measured in months. This app has 72 items and a three-week
horizon. Scheduling at the level of the *category* is the right resolution
for the data that exists, and it degrades gracefully when a learner
disappears for five days — which he will.

---

## 6 · The Turkish bet

The app's premise is contrastive: teach confusable pairs, because Turkish
speakers confuse them. Is that a real idea or a plausible-sounding one?

Both, in different parts. The **strong** Contrastive Analysis Hypothesis —
Lado and Fries's claim that you can *predict* what a learner will find hard
from a structural comparison of the two languages — did not survive the
1970s.
[Wardhaugh (1970)](https://files.eric.ed.gov/fulltext/ED038640.pdf)
separated the strong version from a weak, a-posteriori one and argued only
the weak version was tenable; Dulay and Burt's error analyses found L1
interference accounting for a minority of learner errors. Nobody should
design a syllabus by diffing Turkish against English.

The **weak** version — explain an attested error by reference to the L1 —
is what this app actually does, and it is uncontroversial. Cross-linguistic
influence is a settled part of SLA (Odlin, *Language Transfer*, 1989); what
died was the predictive claim, not the phenomenon. And the instructional
half of the bet is on firmer ground still: explicit, form-focused
instruction outperforms implicit
([Norris & Ortega, 2000](https://benjamins.com/catalog/sibil.48.18goo);
[Spada & Tomita, 2010](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2010.00562.x),
who found the explicit advantage holding for both simple and complex
features). The standard caveat is that outcome measures in that literature
skew toward explicit knowledge, so the effect sizes overstate transfer to
spontaneous speech. For this app the caveat barely bites: the criterion
task is a multiple-choice grammar section, which *is* an explicit-knowledge
task. This design fits its exam better than it would fit a speaking course,
and that is worth knowing.

Where the bet is only half-informed is in **which** contrasts were chosen.
The Turkish-specific claims currently in the content hold up. Turkish has
no present-perfect/past-simple distinction — the –DI past covers both —
and substitution of past simple for present perfect is among the most
frequent verb errors in Turkish learner data
([Cambridge Learner Corpus study of Turkish EFL verb errors](https://www.academia.edu/58813071/A_Learner_Corpus_Based_Study_on_Verb_Errors_of_Turkish_EFL_Learners);
[Bilkent MA thesis on present-perfect errors](https://repository.bilkent.edu.tr/items/a152df97-d9b1-42c3-9064-c1dcfb82592b)).
Over-extension of the progressive to stative verbs, also in the Tenses
lessons, is attested. Two of six Tenses categories are directly supported
by error data, and the `pitfall` blocks in that lesson (*I know her since
2015*) are the real thing.

But error analyses of Turkish learners consistently rank **articles and
prepositions above tense** — one frequently cited study puts articles at
29% of errors, prepositions at 28%, tenses at 15%
([Error Analysis of Turkish EFL Learners](https://www.sciencedirect.com/science/article/pii/S1877042816312381/pdf)).
Turkish has no articles at all, and marks with case suffixes and
postpositions where English uses prepositions: those are the two largest
transfer surfaces in the pair, and the app covers neither. Meanwhile
Passive Voice — a whole topic, six categories — corresponds to a
productive and familiar Turkish voice suffix (*-Il/-In*); passives are an
exam topic more than a transfer topic. None of that makes the current
topics wrong, because the exam is the exam and it tests what it tests. It
does mean the topic roadmap should be decided on exam weighting *plus*
Turkish error data, and that Articles has a stronger claim on the next
slot than a fourth tense topic.

One consequence for authoring: a `pitfall` is only worth its block if the
error is real. An agent asked to invent a common Turkish mistake will
produce a plausible one, and a plausible-but-unattested pitfall teaches a
learner a mistake he did not have. Pitfalls should come from the owner's
own prep-class experience or from published error analyses, and the agent
brief should say so.

---

## 7 · What I was not asked, and think matters more

### 7.1 The app acts on a number that does not mean what it says

`getWeakCategories()` sums `correct` and `total` for a category across
every attempt the learner has ever made, divides, and sorts. Anything with
three or more answered items and less than 100% is eligible to be called
weak. That figure drives the Profil weak-spots list, the worst-first
ranking on the results screen, and the "Pratik Yap" shortcut on Test — the
three places where the app tells the learner what is wrong with him.

With a four-item pool it is not a measurement of anything. Consider two
learners. The first fails a category badly, reads the lesson, drills it
three times and now answers all four items correctly from memory: he sits
at 4 correct of 16 plus 12 of 12, reads as 4/16 improved to 16/28 — still
"weak", still being sent back. The second met the category twice by luck in
a mixed test, got both right, and is invisible to the list because he never
reached three items. The statistic mixes first encounters with rehearsed
repeats, never decays, and cannot distinguish "has learned the rule" from
"has memorised four paragraphs".

Three fixes, cheapest first, none of them large:

1. **Count distinct items, not answers.** Require three *different*
   question ids before a category is eligible. The history already stores
   ids.
2. **Weight first encounters.** An item's first answer is evidence about
   the rule; the third is evidence about the item. Keeping a separate
   first-encounter tally and ranking on that is a few lines in
   `storage.js`, and it is the closest thing to an honest score the app can
   compute without new content.
3. **Hold items out** (§3). Two per category that never appear as lesson
   checks give the test a clean sample.

I would rank this above every feature in this document. An app that tells
a learner the wrong thing about himself, confidently, is worse than one
that says nothing.

### 7.2 The lessons teach a heuristic the exam is built to defeat

Every lesson ends on a `decision` block, and most of those blocks are
signal-word lists: *since, already, yet, just, ever* → Present Perfect.
`CONTENT_GUIDE.md` already sees the danger and says it well — "a signal
that appears in both branches is worse than no signal", "a trigger that
holds two thirds of the time trains a habit that fails on exactly the
questions an exam uses to separate students."

The guide fixed the lessons. It did not fix the questions, and the
questions are where the habit is rewarded. All four *Present Perfect vs
Past Simple* items are heuristic-consistent: *since she started university*
→ has done, *two years ago* → met, *over the past century* → has
experienced. The lesson's own `text` block warns that *for* appears on both
sides and that the open/closed period decides it; no question in the
category ever tests that. A learner can finish this lesson with the
exception explained and the rule reinforced four times, which is how you
build a heuristic that fails on the discriminating item.

This is a content specification with a number attached: **roughly one item
in four in each category should be a counter-signal item** — the trigger
word present, the "obvious" answer wrong, and the explanation naming why
the signal did not decide it. It costs nothing to build and it is the
difference between a learner who has a rule and one who has a reflex. It
also needs saying in `docs/agents/` explicitly, because an agent asked for
four questions on a contrast will produce four clean ones by default.

### 7.3 The app trains a slice of the exam and does not say so

Public descriptions of the İYS do not agree in detail, and this session
could not reach a primary source — direct fetches of `ybd.yildiz.edu.tr`
and the university domains are blocked, so everything below rests on
search-result summaries. Some sources describe a two-stage exam with Use
of English and Reading first; others four roughly equal sections of
Grammar & Vocabulary, Reading, Listening and Writing. `the-exam.md` in
this directory goes at the question properly and reaches a sharper
conclusion than I can support from here: that there is no discrete grammar
section at all, that grammar appears as one ingredient of a multi-blank
cloze passage and a restatement set, and that the app as it stands
addresses something in the region of a sixth of the marks. Read that file
for the exam; take from this one only the part that holds on every
description of the paper — grammar cloze in the app's current shape is a
minority of the exam, reading and listening and writing carry the rest,
and the app does not tell its learner so.

Listening is genuinely out of scope: audio hosting, bandwidth on a phone,
and a schema and player that do not exist. Writing is out of scope for a
better reason — nothing here can mark an essay, and an app that pretends to
would be worse than silence.

Reading is a different matter, and it is where the pedagogy and the
authoring economics point the same way. The cloze paragraph is already a
miniature reading passage. A **multi-blank passage** — one 120-word text
with four or five blanks, each blank a separate category — is closer to a
real Use of English section than four isolated items, interleaves
categories by construction rather than by scheduling, and yields five
questions from one authored paragraph instead of one. Against the pool
problem in §3, that is the difference between writing 144 paragraphs and
writing 30.

Note that this converges from a different direction with `the-exam.md`,
which arrives at the multi-blank passage by looking at the paper rather
than at the pool. Two independent arguments for the same format is the
strongest signal in this round of research.

It is also the largest build in this document. The one-blank contract runs
through `appendBlanked`, the feedback block, the results review and the
per-question storage shape, and the fixed-height shell has to hold a
passage plus options without moving the button under the learner's thumb.
I would not build it now. I *would* decide about it now, because it is the
kind of decision that expires: once 144 single-blank questions exist,
nobody rewrites them, and the format is settled by inertia rather than by
choice.

---

## What I would build for v1

Ordered by value per hour, and honest about size.

1. **Make the weak-category statistic mean something** (§7.1). Distinct
   items rather than answers, and a first-encounter tally alongside the
   cumulative one. `storage.js` plus tests; the screens keep their current
   shape. Half a day.
2. **Prefer unseen questions when building a session** (§3). Pass the set
   of previously answered ids into `buildQuizSession` and sort unseen
   first, random within each group. One pure function, one new test.
   Two hours.
3. **Mixed by default** (§2, §4). The end of a lesson offers a mixed test
   including the category just read; the Test tab leads with mixed and
   keeps single-topic as the deliberate choice. Copy and launch arguments,
   no new screens. Half a day, and it is the interleaving change.
4. **Eight questions per category, two of them test-only** (§3). 72 new
   questions, one optional schema field, a validator rule and a filter in
   the reader. The code is an afternoon; the content is the project. Write
   the questions for the categories the app's own data says are weakest
   first, and make one in four a counter-signal item (§7.2).
5. **A "Bugün" recommendation on the Eğitim index** (§5). A pure function
   over history — one category untouched for three days, one never seen,
   ten items, mixed — rendered as a single row. A day, mostly deciding what
   it says when there is no history yet.
6. **Prerequisite lines in the manifest** (§4). One field, one line in the
   reader, no gating. Two hours plus the content decisions.
7. **A second presentation for a re-opened lesson** (§1). A completed
   lesson opens on its `decision` block with the option to read it all
   again. Half a day, and it is the expertise-reversal fix.

## What I would defer

**Multi-blank reading passages** (§7.3) — the highest-ceiling item here,
and the one that most needs the interface to be settled first. Pick it up
once the question pool is being expanded in earnest, i.e. before item 4
above turns into 144 paragraphs. Decide now, build later.

**A placement diagnostic** (§4). It needs eight or more items per category
so that spending one per category on measurement is affordable. Until
then it consumes the pool it is trying to measure.

**Typed production practice** (§2). The evidence does not require it for a
multiple-choice exam, and the interface cost on a phone is high. Reopen
only if the owner decides the app should also serve the writing section,
where production is the point rather than a difficulty knob.

**Vocabulary and word formation.** Already on the roadmap and correctly
deferred: it is a different question shape, and the schema should be
designed once, with the multi-blank decision, rather than twice.

## What I would refuse

**Mastery gating.** Kulik et al. found the gains and the dropout in the
same review. A self-directed adult three weeks from an exam who is refused
access to a lesson stops using the app; he does not comply. The project
already decided that checks never block progress, and this is the same
decision at a larger scale.

**Streaks, daily goals and any counter that resets.** They are engagement
mechanics, not learning mechanics, and their cost lands on exactly the
learner this app is for: someone who will miss two days and needs the app
to be neutral about it when he comes back. Nothing in the retrieval or
spacing literature requires daily contact; Cepeda's own numbers say every
two to four days is optimal at this horizon, which a streak would punish.

**Per-item spaced-repetition scheduling.** SM-2 and its descendants assume
a large pool, daily returns and a months-long horizon. With 72 items and
three weeks, a per-item interval is a precise answer computed from nothing.
Schedule categories, not items.

**Adaptive difficulty.** With four to eight items per category there is
nothing to adapt over, and any such system would be a random number
generator with a confident label. Revisit the idea at ten times the
content, if ever.

**A percentage score presented to the point.** "%67" from a nine-item
sample implies a precision the sample cannot support, and it is the number
learners fixate on. A count ("6 / 9") says the same thing without the
false precision, and the per-category breakdown is where the information
actually is.

**An eighth block type for anything in this document.** Everything
proposed here is either data (questions, a prerequisite field, an
optional flag) or rendering. The block vocabulary was the last schema
change forced by a redesign, and it should stay that way.

## Open questions for the owner

**What is the current İYS split, exactly?** Everything in §7.3 — whether
reading belongs in this app, whether the multi-blank format is worth its
build — depends on how many marks the grammar section actually carries.
No session working from here could reach a primary source; the owner can
download YTÜ's own sample paper in ten minutes, and that document
outranks both this file and `the-exam.md`.

**Articles before more tenses?** Turkish learner error data puts articles
and prepositions above tense, and the app covers neither. Exam weighting
may still argue for staying inside Tenses, Modals and Passive. That is an
exam judgment, not a research one.

**Is a question allowed to be test-only?** It makes the score honest and
it means some authored content is never seen by a learner who only reads
lessons. Cheap either way, but it is a change to what a question *is*.

**How many questions can actually be authored per week?** The whole
staging in §3 assumes 72 new questions is a few weeks of agent-assisted
work rather than a few months. If it is months, the interim measures in §3
stop being interim and the app should say the pool is small rather than
imply otherwise.

**Should weakness decay?** A category answered badly three weeks ago and
well since is not weak, but the current statistic says it is forever. Any
decay function is a value judgment about how long evidence lasts, and it
belongs to whoever is going to sit the exam.

**Should the app ever tell the learner what to do today?** §5 argues for
one recommendation and no obligation, but a study tool with an opinion is
a different product from a reference someone opens when he wants
something. The owner has consistently chosen the quieter option — no
action bar in the reader, no scored checks — and this is the same choice
one level up.
