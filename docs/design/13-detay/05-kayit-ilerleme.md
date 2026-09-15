# Arm 5 — the record: what a serious study tool shows a
learner about themselves

2026-09-15. Detail round, arm 5 of `13-detay/`. Scope per
`00-brief.md`: research and specification only. Nothing here
touches `js/`, `css/`, `data/` or any `.html` file, and nothing
is drawn — only placed, per `CLAUDE.md` "Structure first".

Marks: **[S]** read from the primary source, or measured/run in
this repository. **[≈]** reported consistently by secondary
sources. **[?]** could not be verified this pass.

---

## 1 · What the app already knows

Read in full: `js/storage.js` (1072 lines) [S] and
`js/quiz-engine.js` (165 lines) [S].

### 1.1 The stored shape

One key, `englishPrep.history`, holding `{ attempts: [] }`. Every
completed test session — a full quiz, an exited one, an Eğitim
check-block run — appends one attempt [S, `js/storage.js:103`,
`js/quiz.js:102`, `js/results.js:360`]:

```
attempt = {
  date: ISO string,           // session-level, not per-question
  mode: "mixed" | "topic" | "category" | "mistakes",
  topicBreakdown:    { [topicId]:  { correct, total } },
  categoryBreakdown: { [category]: { correct, total } },
  questions: [
    { id, topicId, category, correct: boolean,
      selected: string | null }   // the literal option text chosen
  ]
}
```

That `questions[].selected` field is the load-bearing one for
this arm and it is easy to miss, because no aggregator in
`storage.js` currently reads it (§1.3). It shipped in **v0.34,
2026-09-05** [S, `CHANGELOG.md`: *"The app now writes down which
option was chosen, not only whether it was right… every session
run without it threw the distractor choice away permanently…
this is the densest week of real use the app has had."*]. Since
the app's own changelog calls that its first week of dense real
use, most of the history any real learner has accumulated
already carries this field — it is not a future migration, it is
close to the whole of the record that exists today.

### 1.2 What is stored, verbatim

- **Per attempt (session-level):** a timestamp, a mode, and two
  breakdowns (topic, category) as `{correct, total}` pairs.
- **Per question, per attempt:** id, topicId, category,
  correct/incorrect, and the exact option text picked.
- **Lesson progress**, a separate key: `{read: 0..1, done, at}`
  per lesson id [S, `js/storage.js:641`]. No connection to quiz
  history except that both feed `getLastActivity`/`getStreak`.
- **A profile name**, an exam date, a daily-goal choice, and a
  handful of UI settings. None of these are learning data.

### 1.3 What is derived — computed at read time, not stored

Everything the app currently *shows* about performance is a pure
function over `attempts`, run fresh on every read. None of it is
persisted separately, so none of it needs a migration if its
formula changes — but that also means every one of these is
recomputed by walking the *entire* history on every Profil paint,
which matters once the history is a few thousand rows long
(§4 gives the real ceiling for this app's six-week life, so it is
not currently a performance problem — only a note for App 2).

| function | what it returns | grain |
|---|---|---|
| `getItemStats()` | per-question `{seen, wrong, lastCorrect, last}` | question |
| `getMistakeBook()` | items wrong and not yet graduated (2 correct answers on 2 separate days) | question |
| `getTopicTotals()` / `getCategoryTotals()` | lifetime correct/total sums | topic / category |
| `getTopicAccuracy(id)` | last-20-answers window | topic |
| `getWeakTopics()` / `getWeakCategories()` | most-recent-answer-only ranking, Wilson-gated | topic / category |
| `getOverallStats()` | lifetime counts + last-40 windowed accuracy | app-wide |
| `getStreak()` / `getTodayCount()` | calendar-day activity | day |

Two of these already encode real statistical caution, and both
matter directly to §4 below:

- **`wilsonUpper(correct, total)`** [S, `js/storage.js:367`] — the
  upper bound of the 95% Wilson interval, used so that "2 wrong
  out of 4" cannot be reported as a proven weakness (its own
  docstring: *"the Wilson upper bound for 2/4 is about 0.85, so
  the app has no business saying that category is a weakness"*).
- **`MIN_ITEMS_FOR_WEAK_CLAIM = 6`** [S, line 43] — a category or
  topic is only allowed to be *stated* as weak (`confident: true`)
  once six distinct questions in it have been answered, on top of
  the Wilson bound clearing 0.8.

### 1.4 Three buckets, honestly

**Already there, and already surfaced.** Lifetime and windowed
accuracy, per-topic and per-category breakdowns, the mistake
book, the weak-topic/weak-category rankings with their confidence
gate. This is the existing record and it is not nothing — Profil
already renders two of exactly the ranked-list surfaces UWorld
and Khan Academy are cited for in
`docs/design/12-arastirma/06-rakip-analizi.md` §1.2–1.3 [S,
`js/profile.js:620-654`].

**Already there, not yet surfaced.** The single biggest finding
of this section: **which wrong option the learner picked is
already in every attempt since 2026-09-05**, and no function in
`storage.js` reads `question.selected`. `getItemStats` and
`getMistakeBook` both discard it while iterating the exact same
loop that reads `question.correct` [S, `js/storage.js:173-197`,
`238-266`]. This is not a schema change. It is one new pure
function — call it `getDistractorStats()` — walking the history
that is already on disk and tallying `selected` per wrong answer.
Zero migration, because there is nothing to migrate: the data is
sitting in every learner's `localStorage` right now, unread.

Also in this bucket, all fully derivable from `attempt.date` +
`attempt.questions[]` with no new field:

- **First-answer vs. re-answer**, per question: `getItemStats`
  already computes `seen` across the whole history; "was this the
  first time" is `seen === 1` at the point a given attempt is
  folded in, which the current reducer does not expose but could
  with one more field on the accumulator.
- **Category-level history over time** (a trend line, not a
  lifetime sum): `categoryBreakdown` already carries a date via
  its parent attempt; a time-bucketed version of
  `getCategoryTotals` is a groupby, not new data.
- **Spacing between encounters**: every attempt that touched a
  question id is already timestamped; the gap sequence per item is
  a sort-and-diff over data `getMistakeBook` already sorts for a
  different purpose (`answers.sort((a, b) => a.when - b.when)` [S,
  line 244]).
- **`mode === "mistakes"`** already flags a mistake-book rerun
  distinctly from an ordinary quiz [S, used once, in
  `getOverallStats`'s `accuracyFromBook`], so "this was a
  deliberate re-test" is also already there and mostly unused.

**Needs a real addition.** Only one thing on the task's list is
genuinely absent with no way to derive it after the fact:
**time per item.** No `Date.now()` call exists anywhere in
`js/quiz.js` around option selection [S, checked — the file's
only timestamps are `state.session`/`state.selectedAnswers`
bookkeeping, none are wall-clock]. Adding it is cheap — one
timestamp when a question mounts, one when an option is chosen,
one new field on the per-question record — but it is a genuine
schema addition, not a read of something already stored, and (as
`category` already demonstrates for attempts recorded before
2026-09-04ish [S, `js/storage.js:164`, *"`category` is absent on
attempts recorded before it was stored"*]) it would arrive the
same honest way: absent on old attempts, present going forward,
no backfill and no claim of one.

---

## 2 · What the evidence says is worth showing

### 2.1 Feedback: levels, and when it hurts

**Hattie & Timperley 2007**, *The Power of Feedback*, Review of
Educational Research 77(1) [≈, abstract and framework confirmed
by search; PDF itself blocked per `00-brief.md`'s network note].
Feedback operates at four levels — task, process,
self-regulation, self (praise) — and effectiveness runs in that
order: task-level feedback ("this option is wrong because…") is
the most reliably useful, self-level praise ("great job!") the
least, because praise carries no information about the task and
often redirects attention to the self rather than the work. The
three questions the model organises feedback around — *Where am I
going? How am I going? Where to next?* — map cleanly onto three
things this app already has or could have: the exam's own point
target, the accuracy record, and the mistake book / weak list as
the "next" answer.

**This app's `explanation` + `optionNotes` are already task-level
feedback in Hattie & Timperley's sense** — CLAUDE.md's rule that
*"an option a competent teacher would accept is a wrong option"*
and `question-author.md`'s rule 5 (*"the explanation must name a
wrong option, by its own words"*) are, independently, the same
design decision this literature converges on: feedback that names
the specific wrong reasoning, not just the right answer.

### 2.2 Elaborated feedback beats knowledge-of-result — and this
app already ships the winning kind

**Van der Kleij, Feskens & Eggen 2015**, Review of Educational
Research, meta-analysis of 40 studies / 70 effect sizes in
computer-based learning [≈]. Three feedback types compared:

| type | what it is | mean effect size |
|---|---|---|
| KR (knowledge of result) | "correct" / "incorrect" only | **0.05** |
| KCR (knowledge of correct response) | shows the right answer | **0.32** |
| EF (elaborated feedback) | an explanation | **0.49** |

EF was reported as particularly stronger for **higher-order**
learning outcomes, and immediate feedback outperformed delayed
feedback for lower-order outcomes.

**What this means here.** The app's feedback block
(`js/feedback.js`) already sits at the top tier: verdict, correct
answer, a full explanation, and (when the learner got it wrong) a
note on the specific option they chose — that is EF, not KR or
KCR, on every single question, already. The finding is not "build
elaborated feedback"; it is already built. The finding is that
**a record screen that only restates KR — a percentage, a ring —
would be reverting the *summary* view to the weakest tier of
feedback even though the *moment* view already uses the
strongest.** The record has to carry the elaboration forward, not
flatten it back to a score.

### 2.3 Kluger & DeNisi 1996: when feedback makes performance
worse

Psychological Bulletin 119(2), 607 effect sizes from 23,663
observations [≈]. Two numbers matter here:

- Feedback interventions improved performance on average, **d =
  0.41** — but **more than a third of them decreased it**.
- Feedback Intervention Theory's explanation: an intervention that
  moves attention *up* the hierarchy — from the task, toward
  "meta-task" and self-related processing — is the one that hurts.
  Feedback that stays locked on the task is the safe kind.

**What this means here.** This is the sharpest argument in the
literature against exactly the ornament this app has already
rejected (`CLAUDE.md`, `app1-final.md` §7): a streak number, a
level, an XP total are all *self*-level or *meta-task*-level
information — they describe the learner's standing, not the task.
Kluger & DeNisi's own theory says this is the category of
feedback most likely to backfire. A record built from "which
option, why wrong, how often" stays at the task level throughout;
a record built from "12-day streak, Level 4" does not, by
construction. This is not a register argument (as the app's
existing anti-gamification reasoning mostly is, per
`06-rakip-analizi.md` §5's confetti/mascot notes, both flagged
`[?]`) — it is a specific, sourced mechanism for why the wrong
kind of record actively costs performance, not merely taste.

### 2.4 The testing effect: retrieval strengthens memory more
than review does

**Roediger & Karpicke 2006**, Psychological Science, the
canonical single study [≈, numbers cross-checked against multiple
secondary reports]: a study-study-study-study group and a
study-test-test-test group, both five minutes on a prose passage.
Tested **5 minutes** later: the pure-study group recalled **81%**
against the tested group's **75%** — studying wins in the short
run. Tested **one week** later: the tested group recalled **61%**
against the study-only group's **40%** — the reverse, and by a
wider margin.

**Adesope, Trevisan & Sundararajan 2017**, Review of Educational
Research, the meta-analysis across the field (not one study):
average effect size **g = 0.51**, described as the most defensible
summary figure [≈]. Multiple-choice practice tests specifically
carried a larger effect (**+0.70**) than short-answer tests
(**+0.48**) [≈] — directly relevant, since every item in this
corpus is four-option multiple choice.

**What this means here.** This is not primarily a display
finding; it is a *scheduling* finding, and the task asks that
distinction to be drawn explicitly (§2.5 below does). What it
tells the record surface specifically: an item answered correctly
today is weaker evidence of durable learning than the same item
answered correctly **after a gap**, and `getMistakeBook`'s own
"two correct answers on two separate days" graduation rule [S,
`js/storage.js:200-226`] already encodes exactly this — it is an
implementation of the testing effect's practical corollary, not
merely a plausible-sounding rule. A record screen that shows raw
"correct/wrong" without this day-separation context is showing
less than the app's own storage layer already knows.

### 2.5 Spacing: no universal interval, but a window this app
can act on

**Cepeda, Pashler, Vul, Wixted & Rohrer 2006**, Psychological
Bulletin, 132, 839 assessments across 317 experiments [≈]. The
central finding is explicitly *not* one magic number: the
inter-study interval that maximises retention rises as the
retention interval (time to the test that matters) rises. There
is no interval-agnostic "best gap."

`js/storage.js`'s own docstring on `RE_ENTRY_DAYS = 10` already
cites this literature correctly and specifically [S, line 565]:
*"Cepeda et al. taught over 1,350 people and reviewed them at gaps
up to 3.5 months: the useful gap scales with how far off the test
is, and for an exam a couple of months out it lands around one to
two weeks."* That is a correct, sourced application already in
the codebase — this arm's job is only to confirm it, which the
above does.

**The scheduler/display boundary, stated plainly, because the
task asks the harder question directly.** Spacing itself —
*when* the app re-shows an item — is a property of
`orderForPractice` (`js/quiz-engine.js`), not of any screen. A
record surface cannot create the spacing effect; it can only
**report** the spacing that already happened (§1.4's derivable
"gap sequence per item") so the learner can see *that* a gap
existed, which is closer to the metacognitive-calibration
literature (§2.6) than to the testing-effect literature. Put
another way: Roediger & Karpicke and Cepeda et al. are arguments
for what `orderForPractice` should do (and largely already does —
unseen first, then last-wrong, then oldest-seen [S,
`js/quiz-engine.js:41-62`]); they are not arguments for what a
*screen* should draw. Conflating the two is the mistake this
section exists to head off.

### 2.6 Metacognitive calibration: the record's actual job

**Dunlosky & colleagues' line of work on judgments of learning**
[≈, multiple secondary sources converge]: the **underconfidence-
with-practice** effect — after several study-test cycles, adults'
confidence judgments *undershoot* their actual performance — sits
alongside the more commonly cited early-stage overconfidence.
Both are calibration failures in opposite directions, and the
common finding across this literature is that **overconfidence
specifically leads to premature disengagement**: a learner who
believes they already know a category stops practising it before
they do.

**What this means here.** This is the clearest first-principles
argument for why a record screen exists at all, independent of
any single number on it: this app's learner is explicitly, per
`CLAUDE.md`, someone whose *ear* is frequently right and who has
never been taught the boundary where it fails — which is a
textbook description of a calibration gap, not a knowledge gap.
The record's job is not motivation (§2.3 already rules that out)
and not raw memory strength (the testing effect's job, and the
scheduler's). **Its job is to correct the specific mismatch
between "this feels right" and "this is right"** — which is
exactly what a per-distractor record does and a percentage does
not (§4).

### 2.7 Which of the above are screen properties, and which are
schedule properties — answered directly

| finding | screen, schedule, or both |
|---|---|
| Elaborated feedback > KR/KCR (§2.2) | **screen** — already built into the per-answer moment; the open question is only whether the summary preserves it |
| Feedback moving attention to self/meta-task can hurt (§2.3) | **screen** — a direct constraint on what the record may show |
| Testing effect (§2.4) | **schedule** — `orderForPractice` and the mistake-book graduation rule, not a display |
| Optimal spacing has no fixed number (§2.5) | **schedule** — already implemented via `RE_ENTRY_DAYS`; the screen's role is only to *report* realised gaps, not to create them |
| Calibration / overconfidence (§2.6) | **screen** — the one finding that is a display property first: a learner cannot recalibrate against information they cannot see |

---

## 3 · How real products show it, with specifics

Continuing `06-rakip-analizi.md`'s teardown rather than repeating
it; only the parts of that document's §1–§2 that bear on *the
record specifically* are restated here, plus what that document
did not already cover.

### 3.1 UWorld — already documented in this repo [≈,
`06-rakip-analizi.md` §1.3, §6.2–6.3]

Per question, after answering: the percentage of first-time
answerers who chose *each* option (an answer-distribution bar
chart under the four options, not just under the key), "Your
Average Time Spent (Sec)" against a peer average, and topic-level
performance with a percentile. The axis is always **a
distribution over the four options**, never a single scalar; the
unit is seconds or a percentage of peers; the decision it
supports is "was I close, or did I fall for the trap most people
fall for." Single-player, this app substitutes the learner's own
history for the peer distribution — same axis (which option, how
often), different denominator (their own past selections instead
of other test-takers).

### 3.2 Anki — the statistics screen and the grading buttons

**Statistics tab** [≈, `docs/stats.html` on `docs.ankiweb.net`
blocked by this session's egress; reconstructed from search
summaries and `06-rakip-analizi.md`'s existing citation]: a
calendar heatmap of review counts per day, a forecast of upcoming
reviews, and — via the widely-used **True Retention** add-on
rather than Anki core — a pass rate computed specifically over
**mature** cards (interval ≥ 21 days), because young/lapsed cards
would otherwise dilute the number the learner actually wants:
"of the things I claim to have learned, how many do I still
know." Anki's own manual guidance treats **85–90%** as the target
band for vocabulary-type material [≈].

**The grading buttons are the sharper transfer, already flagged
in `06-rakip-analizi.md` §6.4**: *Again / Hard / Good / Easy*, each
labelled with the *interval it will produce* ("Again 10m",
"Good 3d"), so the control states its own consequence rather than
a name for it. This app has no interval to schedule — its answer
options are a single-shot choice, not a spaced-repetition grade —
but the *mechanic* (a control that says what happens next, not
just what it is) transfers to a mistake-book row: not "Yanlış
defteri, 12 soru bekliyor" alone, but a row that can additionally
say what happens when it graduates (already computed by
`getMistakeBook`'s `correctDays` field, currently unused on
screen — see §5).

### 3.3 Khan Academy — the mastery ladder, already documented
[≈, `06-rakip-analizi.md` §1.2]

Four states — Attempted, Familiar, Proficient, Mastered — of
which **only Proficient and Mastered count toward the course
percentage**; the organisation's own public reasoning is that
"skills to proficient+" tracks better against an external
assessment than either raw attempts or full mastery. The unit is
a **count of skills**, not a percentage of questions; the axis
that matters is *how many categories cleared the bar*, and the
bar deliberately excludes the shallow level.

**Direct transfer, already named in this repo**
(`06-rakip-analizi.md` §6.5, `app1-final.md`'s N5): "categories at
proficient: 6 of 10" against the known 60-point paper. §4 below
supplies the number this app can actually claim given its corpus
size, and it is smaller than 6/10 sounds — see the confidence-gate
finding.

### 3.4 Quizlet Learn mode

Each term moves through **not-yet-learned → familiar (1 correct)
→ mastered (2+ correct)**, and the mode's stated target is 100% of
the set mastered by a stated deadline (a term end-date, mirroring
this app's exam date) [≈]. Internally it runs an ML-trained
prioritisation model over roughly 1.5 million sampled answers to
show items closest to being forgotten within a session [≈] —
which is a scheduling detail, not a display one, and this app's
corpus (241 items total) is roughly five orders of magnitude too
small to train anything comparable; the relevant transfer is only
the **two-state mastery label** (not-yet / familiar / mastered),
which is coarser and cheaper than Khan Academy's four-state ladder
and closer to what `getMistakeBook`'s existing 2-correct-answers
rule already produces.

### 3.5 Duolingo's strength bars — removed, and why matters more
than that they existed

Strength was shown as a semicircular meter per completed skill,
decaying over time if unpracticed, with a "practice weakest
words" action; both the strength meter and the decay mechanic are
now discontinued in the live product [≈, `duolingo.fandom.com`;
no primary Duolingo statement on the removal reason located
**[?]**]. The wiki-level evidence only establishes *that* it was
removed, not *why* — this is worth stating as a genuine unknown
rather than assumed, because "product removed a metric" is
consistent with several different explanations (it discouraged
users by showing decay as a loss; it was replaced by a different
mechanic; it under-performed commercially) and this pass could
not distinguish between them.

**What is usable regardless of the reason**: strength-as-decay is
structurally a countdown framed as a loss (a meter draining), and
that framing is exactly the "extrinsic reward on an
already-motivated task" pattern §2.3 and `06-rakip-analizi.md`
§2.3 already argue against for this learner — independent of
Duolingo's own reason for dropping it, the mechanism argument
against it stands on its own.

### 3.6 UWorld's App Store reception, restated as a caution for
§5

Already flagged in `06-rakip-analizi.md` §1.3: UWorld's medical
product is described in reviews as *"frustrating, poorly designed,
slow, glitchy,"* with its highlighting/answer-elimination tooling
specifically cited as interrupting the answering and review flow
[≈]. The lesson for this arm is narrow but important: **UWorld's
information density is worth copying; its interaction cost is
not.** A per-distractor history, seconds-per-item, and a
mastery-ladder count are all *read-only* additions to a screen the
learner already visits (Profil, results). None of them add a step
to the answering flow itself — which this app's own non-negotiable
already forbids moving (*"answering a question must never move the
button the learner is about to tap"*, `CLAUDE.md`). UWorld's
complaints are about tools bolted onto the *answering* screen;
nothing recommended in §5 touches that screen.

---

## 4 · The distractor is the content

### 4.1 The corpus, measured [S, run in this repo]

```
$ node -e '... walks data/manifest.json + every topic file ...'
totalQuestions   241
totalCategories  60
items/category   59 categories at 4, 1 at 5   (241 = 59·4 + 5)
optionNotes      241 questions carry notes; 723 notes total
                 → exactly 3 notes per question, i.e. every
                   wrong option in the app has one (matches
                   `app1-final.md` §1's own count)
```

So: **every wrong answer in the corpus already has a written
explanation of what choosing it means.** `question-author.md`'s
rule (*"an option a competent teacher would accept is a wrong
option"*) and `CONTENT_GUIDE.md`'s `optionNotes` field together
mean the app is sitting on 723 short, per-misconception glosses
that no screen currently surfaces outside the single moment right
after answering (`js/feedback.js`) and the same-session results
review (`js/results.js`'s "İnceleme" list). Nothing currently
shows a learner *which* wrong option they favour **across** many
questions and many days — only within one attempt.

### 4.2 The information model

A per-distractor record, buildable today from §1.4's zero-schema
`getDistractorStats()`:

```
distractorStats(category?) = {
  [questionId]: {
    total: number,          // times this question was answered
    wrongCounts: {
      [optionText]: number  // how often THIS wrong option was picked
    }
  }
}
```

Rolled up one level, per category:

```
categoryDistractorProfile(category) = {
  [optionText]: {
    timesChosen: number,
    // which questions it was chosen on, so the app can point at
    // the specific optionNote rather than only a tally
    questionIds: string[]
  }
}
```

**What this lets the app say, that it cannot say today**: not
"you got 2 of 4 wrong in Modal Perfects" (already said, via
`getWeakCategories`) but *"across this category you keep reaching
for `should have` where the passage needs `needn't have`"* — a
named, recurring confusion rather than a count. That sentence is
constructible directly from `optionNotes[selected]` (already
authored, per item) plus a tally of how often that specific
`selected` string recurs for that learner in that category. No
new authoring is required; the corpus already carries the text
for both halves of the sentence.

### 4.3 The arithmetic: how much evidence does a learner actually
accumulate

Three real constraints from this app's own numbers, combined.

**Session sizes, as the app already defines them** [S,
`js/config.js`]: `MIXED_TEST_DEFAULT_COUNT = "10"`,
`TOPIC_TEST_DEFAULT_COUNT = 15`, daily-goal options `{5, 10, 20}`
[S, `js/storage.js:842`]. K1 in `10-ihtiyaclar.md` §3 is the
dominant use pattern — 5–10 minutes, standing, which in this app's
own session sizes is one 10-question mixed test.

**Three usage scenarios over the stated six-week window (42
days)**, built from `10-ihtiyaclar.md`'s own K1–K3 table:

| pattern | sessions | answers/wk | 6-week total |
|---|---|---|---|
| light — K1 only, ~4 days/wk | 24 × 10 | 40 | **240** |
| moderate — daily-goal met most days | 36 × 10 | 60 | **360** |
| heavy — + one K2 evening/wk (~30q) | 24×10 + 6×30 | 100 | **540** |

**Against a 241-item pool with `orderForPractice`'s worst-first
ordering** (unseen → last-wrong → oldest-seen [S,
`js/quiz-engine.js:41-62`]): 240 answers is roughly **one pass**
through the whole corpus; 360 is **~1.5 passes**; 540 is **~2.2
passes**, with the extra passes concentrated on items the learner
got wrong, by construction of the ordering.

**Per category (4–5 items), this converts to encounters, not
distinct items**: a light user meets each category's items about
**4 times** over six weeks (one pass); a heavy user, roughly
**8–9 times**, weighted toward whichever 1–2 items in that
category keep being missed. This is enough encounters for the
mistake book's own 2-correct-on-2-days rule to fire multiple times
per category, but §4.4 shows it is **not** enough for the app's
own statistical bar for a stated claim.

### 4.4 The confidence-gate finding — computed, not estimated

This is the sharpest, most checkable finding in this document.

`weakestEntries()` [S, `js/storage.js:398-432`] ranks and grades
both topics and categories, but its `total` for a grouping is the
count of **distinct question ids ever answered in that grouping**
— repeated encounters with the same item do not increase it,
because `getItemStats` holds one stat object per question id
regardless of how many times it was answered. `confident` requires
`total >= MIN_ITEMS_FOR_WEAK_CLAIM` (6) **and** `wilsonUpper(...)
< 0.8`.

**A category has 4 or 5 distinct items, total, in the whole
corpus** (§4.1). `total` for a category can therefore never reach
6, no matter how many times the learner answers, no matter how
badly. Run through the app's own formula [S, `wilsonUpper` copied
verbatim from `js/storage.js:367-377` and evaluated in this repo]:

| record | wilsonUpper | reads as "not mastered"? | `confident`? |
|---|---:|---|---|
| 1/4 correct | 0.699 | yes (< 0.8) | **no — `total`=4 < 6** |
| 2/4 correct | 0.850 | no | no |
| 3/4 correct | 0.954 | no | no |
| 4/5 correct | 0.964 | no | no |

**Every category in this app's corpus is structurally incapable
of earning an unhedged weakness claim, even at a maximum-severity
1-out-of-4 record.** `js/profile.js` already, correctly, hedges
this: *"Şimdilik az veriyle sıralandı"* fires whenever `every`
category in the ranked list is unconfident [S, line 626] — and
per the table above, that is *always*, for every learner, forever,
at the category grain, given today's 4-per-category corpus. This
is not a bug (the hedge is honest and already shipping); it is a
structural ceiling worth stating plainly, because it directly
answers the task's question: **at category grain, the app's own
n=6 bar is never reachable, at any accuracy, under the current
corpus.**

**Topic grain is different, and reachable.** Topics hold ~24 items
(241/10). `getTopicAccuracy`'s window is 20 [S, line 304], and:

| record (of 20 windowed) | wilsonUpper | `confident`-equivalent |
|---|---:|---|
| 12/20 (60%) | 0.781 | **yes** — clears both gates |
| 14/20 (70%) | 0.855 | no |
| 16/20 (80%) | 0.919 | no |

A topic-level claim becomes statistically honest at roughly
**60% accuracy over a 20-question window** — reachable within one
or two sessions under the "moderate" usage pattern above. This
reproduces, from the other direction, what `app1-final.md` §7
already states as a decided-against item: *"item-level spaced
repetition and adaptive difficulty… need roughly 15–20 items per
category against 4 today… a threshold, and the threshold is not
reached."* This arm's contribution is showing the exact same
threshold problem also governs *stated claims*, not only
scheduling — and quantifying it with the app's own formula rather
than as a general observation.

### 4.5 What this means for a distractor-level claim specifically

Per-distractor tallies are worse-evidenced than per-category ones,
not better — a single wrong option inside a 4-item category might
be chosen once or twice in a learner's entire six weeks. **A
per-distractor record cannot support a statistical claim ("you
choose X 80% of the time you're wrong here") at this corpus size.
It can only support a factual one**: *"the last time you got this
wrong, you chose X"* or *"you have chosen X twice, on
[dates]."* That is Hattie & Timperley's task-level feedback
(§2.1) restated as a record rather than a moment — a log, not a
statistic. §5 designs the surface around that distinction rather
than around a manufactured confidence number.

---

## 5 · The display, specified but not drawn

Per `CLAUDE.md` "Structure first": screen → section → container →
component, using only the existing 21 (`docs/design-system.md`
§0.3, §7) and the existing containers (list / card / grid / prose
/ band, §0.2). Where nothing existing fits, that is stated as a
gap for the owner's design round, not filled in here.

### 5.1 Where D1 sits, relative to what already exists

Three surfaces already touch this data and must not be duplicated:

| surface | screen | what it already does |
|---|---|---|
| per-answer feedback | Quiz / Eğitim check | Row/Feedback component, EF-tier (§2.2), one question |
| session review | Results | `list` of per-question rows, one attempt |
| weak lists | Profil (reading column) | two `list` sections, cross-attempt, topic + category grain |

**D1 is none of these.** `app1-final.md`'s own framing is exact:
*"the mistake book covers practising them; this is
understanding."* The weak lists in Profil already answer "where
am I weak" (Hattie & Timperley's *how am I going*); D1 has to
answer *why*, at the level of a specific recurring confusion —
which is §4's per-distractor log, not a re-skin of an existing
ranked list.

### 5.2 Placement

**Screen: a new child screen**, reached from Profil (the tab that
already, per `docs/design-system.md` §7.3's own table, holds *"the
learner's own figures and data"* in its reading column) — a Row
appended to (or replacing part of) the existing weak-category
list, titled in the bar the way every child is: what it is, not
the app's name — e.g. *"Hata kaydı"*. `leading` reads "Profil"
(the tab it opened from), matching every other child screen's
back-button convention (§0.1). This keeps the tab bar and the
Eğitim/Test/Profil split exactly as settled (`CLAUDE.md`
Non-negotiables — *"navigation is settled… don't reopen it"*);
nothing here adds a tab or a top menu.

**Body, three sections, all built from existing containers:**

1. **A `list` section, "Yanlış defteri"'s existing rows, extended**
   — reusing `renderBreakdown`'s exact Row pattern (ring lead, `t-en`
   title, trailing fraction, §7.1 of the design system) but keyed
   per-question rather than per-category, sorted the way
   `getMistakeBook` already sorts (worst first: most wrong, then
   most recent). Tapping a row does not need a new screen-within-
   a-screen; it can expand in place, the way a `Dialog` is
   reserved for confirmations only and a `Row` already tolerates
   a secondary line (§7 table, component 5) — an expanded row
   reveals sub-content.
2. **That expansion, per item, is a `prose` container**, not a
   card: the question's own paragraph (already stored nowhere new
   — it is content data, loaded the way `topics.js` already loads
   it), the option the learner chose *this last time* with its
   `optionNote` (already authored, §4.1), and — per §4.5's honesty
   finding — a **log**, not a statistic: the dated list of past
   selections for this item (`selected` + `attempt.date`,
   §1.4's zero-schema derivation), each line reading as a
   sentence ("15 Eyl: `should have`, tekrar denendi 2 gün sonra: doğru")
   rather than as a percentage. This is where Hattie & Timperley's
   task-level feedback and Kluger & DeNisi's caution (§2.1, §2.3)
   both land: named, specific, never a self-level number.
3. **A `list` section, "Bu kategorilerde tekrar eden şık"** — the
   category-grain distractor rollup from §4.2, one row per
   category that has a recurring (2+) wrong-option choice, title =
   category name, trailing = the option text in `lang="en"`
   (matching the app's existing `t-en` convention throughout
   `js/results.js` and `js/feedback.js`), no fraction and no
   percentage anywhere in this section — per §4.5, there is not
   enough evidence at this corpus size to state one honestly, and
   the row's job is only to say *what recurs*, not *how reliably*.

**What needs a new primitive, named as a gap rather than solved
here.** A true "history strip" — a short sequence of per-encounter
marks for one item, the UWorld/Anki-heatmap idea — does not map
onto any of the 21 existing components. `Progress` is a single
track, not a sequence of discrete marks; `Ring` is a single
fraction. Composing one from repeated small glyphs is possible
without declaring a 22nd component (§5.4's grid section already
does something adjacent), but a genuine multi-mark sequence inside
a Row is new visual vocabulary and belongs in the next design
round's component pass, not asserted here.

### 5.3 What must never appear — named, with the source

Per `00-brief.md`'s "ret şartları" and `06-rakip-analizi.md` §2.3
and §5, restated as a checklist against this specific screen:

- **No streak, XP, level, or badge tied to fixing a mistake.**
  Ruled out twice over: `app1-final.md` §7 already decided against
  "any number that only goes up" for the whole app, and Deci,
  Koestner & Ryan's meta-analysis (d = −0.28 to −0.40 across
  reward-contingency types [≈, cited via
  `06-rakip-analizi.md` §2.3]) is a mechanism, not a taste,
  argument against adding one here specifically.
- **No confetti, no "well done" celebration on graduating a
  mistake-book item.** Confetti is already shipped-then-rejected
  app-wide (`10-ihtiyaclar.md` §6); a graduation is exactly the
  kind of event a gamified product would reward, which is the
  reason to name it explicitly rather than assume the existing
  rejection covers a screen that does not exist yet.
- **No invented denominator.** Nunes & Drèze's stamp-card result
  (19% → 34% completion, [≈]) is the one piece of gamification
  evidence this document's source material treats as real — but
  conditional on the denominator being real. A per-distractor "3
  of 3 traps caught" ring is fine; a synthetic "mastery score" that
  is not traceable to the 241-item corpus or the 60-point exam is
  not, for the same reason the daily-goal ring is already
  qualified in `06-rakip-analizi.md` §5 (*"the ring is not the
  mistake, the invented denominator is"*).
- **No colour-as-reward.** The distractor rollup (§5.2.3) must not
  use colour to say "good" or "bad" about a *choice pattern* — only
  the existing `--ok`/`--no` semantic pair, already measured for
  contrast in both themes (§1.5 of `design-system.md`), and only
  where it marks correctness of an *answer*, never a trait of the
  learner. A recurring-distractor row is information about a
  confusion, not a verdict on the person.
- **No per-topic hue as a legend.** Tempting for a category grid
  (§5.4) but already measured and rejected: *"on ton 30° içine
  çöküyor"* — ten topic hues collapse into a 30° band [S, cited in
  both `10-ihtiyaclar.md` §6 and `06-rakip-analizi.md` §1.7]. A
  colour key that has already been measured as visually
  indistinguishable must not be reused here just because `hueOf`
  exists; §5.4 uses the semantic `--ok`/`--no`/`--accent` triad
  instead, which is separately verified.
- **No leaderboard, ever, for this app** — moot rather than
  refused, since there is no account and no peer data, but worth
  stating because §3.1's UWorld transfer (peer distribution → own
  history) could be misread as a step toward one. It is not; the
  denominator stays the learner's own past selections.

### 5.4 The one genuinely new container: a category grid, and the
open trade-off it creates

Item 6 (§6 below) asks whether a rendered record can meet the
mid-tone bar. The only candidate shape that plausibly can is a
`grid` container (§0.2, already in the vocabulary — "homogeneous
tiles, 12px gaps, two abreast on a phone") holding one cell per
**category** (60 cells) rather than per topic (10 cells), coloured
by the existing `--ok`/`--no`/`--accent` semantic triad rather than
by hue.

This directly conflicts with §4.4's finding: **60 cells is the
grain that is never statistically confident; 10 cells is the grain
that is.** A category grid is visually substantial (§6 quantifies
it) but every cell in it is, by §4.4, a hedge; a topic grid is
honest but small. This document does not resolve that tension —
it is exactly the kind of trade-off `00-brief.md`'s rule 4 asks to
be stated rather than smoothed over. One resolution worth naming
without adopting: a category grid whose cell **shape** (not
colour) encodes confidence — e.g. an unfilled outline for
"under 6 encounters" versus a filled cell for "6+" — would let the
grid be both large enough to matter for §6 and honest about §4.4,
at the cost of a state the `grid` container does not currently
have a token for. Left for the design round.

---

## 6 · The measurement tie-in

`docs/design/12-arastirma/00-v4-olcumu.md` [S] measured v4's
mid-tone population (CIE L* 0.30–0.70) at a **2.2% median** across
nine screens, against **18.4%** on the owner's five pointed-to
references — an eightfold gap, and the single clearest numeric gap
in the whole research programme. `00-brief.md`'s carried-forward
gate is **≥ 10%**.

### 6.1 Geometry, at 390×844 (screen area 329,160 px²)

Using the space scale already declared (`--s-3: 8px`,
`--s-4: 12px`, radii `--r-1`–`--r-3`, §3–§4 of
`design-system.md`) and the page gutter already fixed at 16px each
side (§3), a phone's usable width is `390 − 32 = 358px`.

**Category grid, 60 cells** (§5.4), sized to fit that width in
whole columns: 6 columns of ~50px cells with 12px gaps —
`6×50 + 5×12 = 360px` (rounds to the 358px budget), 10 rows —
`10×50 + 9×12 = 608px` tall.

| measure | value | % of screen (329,160 px²) |
|---|---:|---:|
| section footprint (incl. gaps) | 358 × 608 ≈ 217,664 px² | 66.1% |
| **cell fill only** (the coloured area) | 60 × 50 × 50 = 150,000 px² | **45.6%** |

That footprint is too tall to be one section among several on a
Profil screen that already carries an identity block, a stats
block and a goals block (`js/profile.js`'s existing `main` pane,
§5.2 above). A **compact** variant — 24px cells, 8px gaps, sized to
sit as one section among others — fits 11 columns in 358px
(`11×24 + 10×8 = 344px`) and needs 6 rows for 60 cells
(`6×24 + 5×8 = 184px` tall):

| measure | value | % of screen |
|---|---:|---:|
| section footprint | 358 × 184 ≈ 65,872 px² | 20.0% |
| **cell fill only** | 60 × 24 × 24 = 34,560 px² | **10.5%** |

**The compact category grid, on its own, clears the ≥10% bar by
about half a point — if the cell fill colour itself falls inside
the L* 0.30–0.70 band.** That condition is unverified (§
Doğrulanamayanlar): `--ok`/`--no`/`--accent` are solved for
contrast against text, not for landing in a specific L* band as
a *fill*, and this arm has nothing built to run
`docs/design/midtone.py` against, per `00-brief.md`'s scope
(research only, no implementation). The geometric share is a real
number; the colour-band share is not yet confirmed to overlap it.

**Topic grid, 10 cells** (the statistically honest grain, §4.4),
same compact cell size, 2 rows of 5 (`5×24+4×32=248px` wide,
comfortably inside 358; `2×24+8=56px` tall):

| measure | value | % of screen |
|---|---:|---:|
| cell fill only | 10 × 24 × 24 = 5,760 px² | **1.7%** |

An order of magnitude short of the bar on its own. This is the
concrete cost of §5.4's honesty/area trade-off: **the grain that
is statistically defensible cannot carry the mid-tone requirement
alone; the grain that can carry it is never statistically
confident.** Some other non-text area has to do the rest of the
work regardless of which grain is chosen for the grid — this arm
does not have a candidate for that remainder and does not invent
one.

### 6.2 The per-item history strip, by contrast, is not a
mid-tone candidate

A strip of, say, five 10×10px marks with 4px gaps inside one Row
(§5.2's expanded item) is `5×10+4×4=66px` wide by 10px tall — 660
px² per row. Even eight such rows simultaneously visible in one
viewport (roughly what a 390×844 screen shows of a scrolling list
at once) is `8×660=5,280`px², **1.6% of the screen** — negligible
for §6's purposes regardless of colour. The strip is a §5
information device, not a §6 area device; conflating the two would
be a mistake in either direction.

---

## Öneri

1. **Ship `getDistractorStats()` first, before any screen.** It is
   the one finding in this document with zero cost and zero risk:
   the data (`questions[].selected`) has existed in every
   learner's history since v0.34, is read by nothing, and a pure
   function over it needs no migration, no new field and no UI
   decision. This is the cheapest way to make §4's information
   model real enough to design against with actual data rather
   than a projection.

2. **Design D1 around a log, not a score, at the distractor grain
   — and around a hedged ranking, not a stated claim, at the
   category grain.** §4.4 is not a suggestion; it is a property of
   the current corpus size, computed with the app's own formula.
   Any category-level "you are weak at X" sentence in D1 should
   read the same hedge Profil's weak list already prints (*"az
   veriyle sıralandı"*), because at 4 items per category that hedge
   is not an interim state — it is permanent until the corpus
   grows, which `app1-final.md` §7 already names as the same
   threshold blocking item-level spaced repetition.

3. **Reuse existing containers for D1's two ranked sections (list
   + list); treat the category grid as an open design question,
   not a decision.** §5.4 and §6.1 show the grid is the one
   candidate that can meaningfully move the mid-tone number, but
   its natural grain (60 cells) is exactly the grain §4.4 shows is
   never confident. Whoever runs the next design round should see
   both numbers before choosing a grain, rather than defaulting to
   "more cells is more area" without knowing it costs honesty, or
   "fewer cells is more honest" without knowing it costs eleven
   points of mid-tone.

4. **Time-per-item is worth adding, but only after the above.** It
   is the one true schema addition in §1.4, it is cheap, and it is
   the one UWorld transfer (§3.1, §3.6) that adds nothing to the
   answering screen's interaction cost. But nothing in §2–§5
   depends on it — every literature-backed design move in this
   document is buildable from data that already exists. Sequence
   it last.

5. **Kluger & DeNisi (§2.3) is the strongest available argument
   against reward-style ornament for this specific screen**,
   stronger than the register argument this repo has used so far
   (`06-rakip-analizi.md` §5's confetti/mascot notes are explicitly
   flagged `[?]`, evidence-free). Recorded here so the next design
   round can cite a mechanism instead of a taste when the streak-
   or-badge idea for the record screen inevitably comes up again.

## Doğrulanamayanlar

1. **Every effect size and percentage in §2 and §3** was read from
   search-result summaries of abstracts, not from the papers
   themselves — the same limitation `06-rakip-analizi.md`'s own
   Doğrulanamayanlar §9 already states for its citations, and it
   applies identically here since the same network restriction
   governed this pass. Directions are consistent across multiple
   independent summaries for every number printed above; exact
   digits (Hattie & Timperley's framework specifics beyond the
   three-question structure; the precise Kluger & DeNisi
   sub-breakdowns by feedback-sign and attention-level; Cepeda et
   al.'s exact ISI/RI curve) should be checked against the PDFs
   before any is printed in a user-facing document. *Fetch on an
   open machine:* the Hattie & Timperley 2007 PDF (PMC has a later
   replication at
   `pmc.ncbi.nlm.nih.gov/articles/PMC6987456/`, itself unfetched
   here), Kluger & DeNisi 1996 via `psychnet.wustl.edu` mirrors of
   Roediger & Karpicke, and Cepeda et al. 2006 via
   `laplab.ucsd.edu` or `augmentingcognition.com` (both found by
   search, neither fetched).

2. **Anki's actual statistics screen** — the description in §3.2
   is reconstructed from search summaries and this repo's own
   earlier citation in `06-rakip-analizi.md`, not from
   `docs.ankiweb.net/stats.html` directly, which this session's
   proxy refused. The 85–90% "target retention" band is
   community guidance repeated across several sources, not a
   documented Anki default. *Fetch on an open machine:*
   `docs.ankiweb.net/stats.html` and `docs.ankiweb.net/deck-
   options.html#retention`.

3. **Duolingo's own reasoning for removing skill strength** (§3.5)
   is unverified in either direction — only that the feature is
   gone. Treated in the text as an open question, not assumed.
   *Fetch on an open machine:* `blog.duolingo.com`, searched for
   "strength" or "decay" posts circa 2020–2022, which is when
   community threads place the removal.

4. **Whether `--ok` / `--no` / `--accent`, as fills rather than as
   text-on-a-ground, actually land inside the CIE L* 0.30–0.70
   band** (§6.1's open condition on the 10.5% figure). This
   requires either the solved values from `tools/palette.mjs` run
   through the L* formula in `docs/design/midtone.py` directly (no
   screenshot needed, since both are pure colour math — this could
   have been checked in this pass and was not, because it edges
   toward "designing" the grid rather than researching whether one
   is feasible; flagged instead of decided). *Next step, in this
   repo, no network needed:* pull the three tokens' resolved OKLCH
   values from `tools/palette.mjs`'s `PAIRS`/solved output and run
   `lstar()` from `docs/design/midtone.py` on each, in both themes.

5. **The exact split between "familiar" and "mastered" thresholds
   Quizlet and Khan Academy each use internally** (§3.3, §3.4) —
   the one-correct/two-correct and four-state ladders are reported
   consistently across secondary sources, but neither company's
   primary specification was reachable this pass. Low stakes: this
   document's only transfer from either is the *shape* (a small
   ordinal ladder, not a percentage), and `getMistakeBook`'s
   existing 2-correct-on-2-days rule is already an instance of
   that shape, independently arrived at.

6. **Mochi and Readwise's Daily Review**, cited via
   `06-rakip-analizi.md` §4, were not independently re-verified in
   this pass — carried forward from that document's own
   Doğrulanamayanlar §12, which already flags them as assessed
   from reviews rather than use.
