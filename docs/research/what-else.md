# What else this app could have

A sweep of everything the app could gain, ranked by value per hour, split
into what can land before Tuesday and what belongs to the wider English
app. Written 2026-09-05, against `b40df36` (v0.32), on the fourth day
before the exam.

The brief was *"tüm olası yenilikleri araştır"* — not a fix list. Two
items below are defect-shaped anyway, and they are marked; they earn
their place because they are additions to a capability the app claims to
have and does not yet keep.

**What this document deliberately does not contain.** No theming, no
motion, no ornament, no gamification — a separate arm has that subject.
Nothing already ranked in `docs/roadmap.md`, `docs/audit/next.md`
§6, or `docs/research/quality-of-life.md` §7 is re-proposed as though it
were new; where a proposal here touches one of those, it says so and adds
only the part that is new. Items 1–5 and 7–8 of the quality-of-life
ranking shipped last night (v0.27–v0.32) and are treated as done.

---

## The short version

**1 · The cheapest thing on this list is one field, and every day it is
not stored is a day of data gone for good.** The app records *whether*
an answer was right and never *which option was chosen*
(`js/results.js:297-302`, `js/quiz.js:102-107`,
`js/quiz-engine.js:134-146`). Twenty minutes of work, no learner-visible
change, and it is the datum the planned error screen
(`audit/next.md:314-333`) needs to say "you picked *Similarly*" and the
only empirical signal the content pipeline could ever have from someone
who has to sit the paper. Measured cost: **+29% on history size**, which
takes `audit/next.md`'s one-year projection from 941 KB to about 1.2 MB
against a budget in megabytes.

**2 · Every deploy silently deletes the learner's offline content.**
`sw.js:94` deletes every cache whose name is not the current `VERSION`,
and topic files are written into that same versioned cache (`sw.js:116`).
The version has been bumped six times in two days. A learner who opens
the app underground after a deploy gets *"Konular yüklenemedi"* — which
is the exact scenario the service worker was written for
(`audit/product.md:873-885`). The sweep does not catch it because
`runOffline` (`tools/verify-ui.mjs:2227`) only ever exercises one
version. **About an hour, and it is the highest-value hour in the
document if he really does revise on the metro.**

**3 · 180 of the app's 241 questions are met inside the reader, and none
of it is recorded.** Measured: every one of the 60 lessons carries
exactly two `check` blocks, plus a pretest on first open, all three drawn
from the same four-question category pool (`js/education.js:1058`,
`:1343`, `:1473`). So a learner who reads a lesson meets three of that
category's four questions before ever taking a test — and the answers
live in `state.reader.answers`, a `Map` that dies with the page. Three
consequences follow, and none of them is written down anywhere: a test
after reading is largely a re-test; `orderForPractice` puts those items
in tier 0 and draws them *first*; and the pretest — the one event the app
designs the learner to fail — produces nothing at all, not even a mistake
book entry.

**4 · The one number on Profil punishes the mode the app recommends.**
`getOverallStats` (`js/storage.js:474-499`) windows the last 40 answers
with no regard for `mode`, which every attempt already carries. The
mistake book is by construction the learner's hardest items, so a week of
running it drags the headline accuracy down. That is precisely the
failure the function's own docstring names about lifetime averages — *"it
falls when they attempt something hard, which punishes exactly the
behaviour the app wants"* — arriving again by a different route.

**5 · The cloze section is covered by content and uncovered by format.**
Seven of ten blank types have a lesson (`clozeCoverage`, shipped v0.27).
Zero of ten have ever been rehearsed in the shape the paper uses: one
~450-word text, ten blanks, options printed after the passage
(`docs/exam-spec.md`, and its own line — *"A cloze passage is not ten of
our questions in a row. The unit is the passage."*). Nothing in
`roadmap.md` or `audit/next.md:216-260` costs this, because both tables
treat cloze as a covered section. It is a wider-app item, and it should
share one schema decision with paragraph completion rather than get its
own.

---

## 0 · What I could and could not verify

**Everything about the app is read from this repository**, at `b40df36`,
with file and line references throughout. Four things are measured rather
than asserted, by running the real modules over the real corpus:

| Measurement | Result |
| --- | --- |
| Items per category, over `data/manifest.json` and the ten live topic files | 60 categories: **59 hold 4 items, one holds 5**. `MIN_ITEMS_FOR_WEAK_CLAIM = 6` remains unreachable by construction |
| `check` blocks per lesson | **exactly 2 in all 60 lessons**; +1 pretest on first open |
| Same-category adjacency in a 10-item mixed test, 2000 trials through `buildQuizSession` | mean **0.12**, and **89% of tests have none**. Same-topic: 0.86, 60% |
| Days to exhaust the bank at 20/day, unseen-first | **13** — so about 2026-09-18. Pool exhaustion stays a post-exam problem, as `audit/next.md:341` found at 193 questions, now with four more days of slack |
| History record size, per answered question | **127 bytes** today; a stored `selectedAnswer` adds ~36 (mean option length 18.1 chars) = **+29%** |

**External sources: search-index summaries only. I fetched no paper.**
`WebFetch` returned `EGRESS_BLOCKED` (tested on `developer.mozilla.org`),
which is the same wall every prior arm hit. `WebSearch` works and returns
result summaries. Three external claims appear below and each is labelled
**[search-summary]** where it is used:

- *Successive relearning* — retrieval to a criterion of correct recalls,
  spaced across separate sessions — is reported to improve performance on
  real course exams and long-term retention, with a prescriptive
  criterion of three correct recalls relearned across widely spaced
  sessions (Rawson & Dunlosky). This is the mistake book's rule and is a
  reason to leave it alone.
- *Feedback timing* is contested: a 1988 meta-analysis favoured immediate
  feedback; later work reports delayed feedback superior in the lab,
  immediate superior in classrooms, and at least one recent trial finding
  no difference in formative multiple-choice testing. **This weakens, not
  strengthens, the case for a feedback-deferred mode as a learning
  intervention** — its case is format rehearsal, not retention.
- *Test-format familiarity* is reported as a real but bounded gain, framed
  as reducing construct-irrelevant variance rather than teaching English,
  with explicit warnings that heavy test-like practice inflates scores
  without the underlying ability. That is exactly the right size of claim
  for item 5 above.

**Not verified in a browser.** I did not run `npm run serve` or
`npm run verify`, and I did not reproduce the service-worker cache wipe
against Chromium. The claim in §1.2 is read from `sw.js` and is
unambiguous in the source, but it is a source reading, not a
reproduction. Anyone acting on it should reproduce it first; the
reproduction is also the test.

**Not knowable from here.** Whether the owner actually loses signal on
his commute (it decides §1.2's rank), whether his four friends have read
the coverage paragraph in Profil, and whether any of the five would send
a backup file if asked (it decides §2.3).

---

## 1 · This week — before Tuesday

The bar, taken from `quality-of-life.md`: does it change what happens on
a phone between tomorrow and Tuesday, on a screen that already exists,
without risking a regression nobody would catch in four days? Everything
here is a change to an existing screen or to a file with a unit test
around it. **The whole section is about three hours.**

Ordered by value per hour.

### 1.1 Store which option was chosen — **20 minutes**

**What it is.** Every attempt's per-question record is
`{id, topicId, category, correct}` and nothing else — built in two places
that must agree (`js/results.js:297-302` on the normal path,
`js/quiz.js:102-107` on `pagehide`). `scoreSession` already computes
`selectedAnswer` and hands it to the results screen
(`js/quiz-engine.js:143`); it is simply never written down. Add it to
both records.

**Why it is first.** It is the only item in this document that is
*irreversible by delay*. Every session run without it throws away the
distractor choice permanently, and this week is the densest week of real
use the app will ever have had. Three things downstream want it:

- The error-tracking screen already scoped by `audit/next.md:314-333` as
  *a log, not a diagnosis* cannot say what the learner actually picked
  without it. That screen's whole honesty argument is that a record is
  true at any sample size; a record missing the response is half a record.
- `docs/research/content-pipeline.md:296-312` endorses exactly this use —
  *"weak signals from the learner's own history, used as triage and never
  as a statistic"* — and stops at *"history is on the learner's phone and
  does not come back"*. That sentence is no longer true: `exportState`
  (`js/storage.js:783`) puts the whole history in a file the learner can
  already hand over from the share sheet. See §2.3.
- The problem report already carries the chosen option
  (`js/report.js:44-46`), so the app has decided this datum is fit to
  leave the device. Storing it locally is strictly less exposure.

**Cost and risk.** Two lines plus one storage test. It rides the backup
for free (`exportState` carries `history` whole) and needs no
`BACKUP_VERSION` bump, because `mergeHistory` is first-writer-wins on
attempt date and an extra field is additive. Measured size cost: **+29%
on history**, taking `audit/next.md:455-470`'s one-year figure from
941 KB to ~1.2 MB and its parse from 55 ms to about 70 ms. Neither is
near a limit.

**Wrong if:** the owner will never look at his own or anyone's stored
answers, and the error screen is never built. Even then it costs twenty
minutes and 29% of a number measured in kilobytes. There is no version of
this that does damage, which is the whole argument for doing it now
rather than when it is needed.

### 1.2 The offline content cache survives a deploy — **1 hour** *(defect-shaped)*

**What it is.** `sw.js` has one cache, named for the app version
(`sw.js:29`). Content is written into it (`sw.js:116`) and `activate`
deletes every cache that is not the current version (`sw.js:94`). So
**every release wipes every topic file the learner had cached**. The
shell survives because it is re-precached on install; content is not in
`SHELL` (`sw.js:48-79`), deliberately and correctly, so there is nothing
to restore it. The next time that learner is offline, the shell paints
and both tabs say *"yüklenemedi"* — the exact failure `audit/product.md`
§6 measured and the service worker was built to end.

The version has moved v0.27 → v0.32 in about thirty hours. The window in
which a learner is offline *and* their content cache is empty is
therefore not rare this week; it is roughly "the first time they go
underground after any deploy".

**The fix.** A second cache, unversioned — `english-prep-content` —
holding `/data/`, with `activate` deleting only the versioned shell
caches. Content is bounded by the corpus (780 KB today, measured) and the
network-first policy keeps it fresh whenever there is signal, so an
unversioned content cache carries no staleness risk the current design
does not already accept.

**And the test, which is the real deliverable.** `runOffline`
(`tools/verify-ui.mjs:2227`) registers one worker, caches one lesson,
goes offline and asserts the lesson opens. It has never exercised a
version change, which is why a wipe on every deploy survived the sweep.
The new section is: cache a lesson, activate a worker with a different
`VERSION`, go offline, assert the lesson still opens. That is what stops
this recurring.

**Wrong if:** he is never offline with a stale cache. That is the one
fact I cannot check and it decides this item's rank entirely — if the
answer is "I have signal everywhere", this drops to the bottom of the
list and stays a correctness fix for later. If the answer is "the metro",
it is the most valuable hour here.

**Second-order:** two caches is one more thing to reason about, and a
future session must not "tidy" the content cache back into the versioned
one. The test is what makes that impossible to do quietly.

### 1.3 The option note reaches the results review — **45 minutes**

**What it is.** v0.28 authored **579 option notes across all 193
questions then live**, and every wrong option in the corpus now says
something. The learner sees the note for the option they chose during the
test (`js/feedback.js:58`) — and never again. The results review renders
the prompt, the two answers, the explanation and the tip
(`js/results.js:213-237`) but not the note, because `scoreSession` does
not carry `optionNotes` into `questionResults` (`js/quiz-engine.js:134-146`).

`selectedAnswer` is already there. So this is: add one field to the
returned object, and one `t-meta` line under *"Cevabın:"* when the answer
was wrong and a note exists.

**Why it is worth 45 minutes.** The review is the second pass over a
test, and the second pass is where the mistake gets consolidated rather
than merely met. The note is not redundant with the explanation, and
`js/feedback.js:49-57` says why in its own words: the explanation names
the closest wrong option and the others usually fail for the same reason,
whereas in a vocabulary set every wrong option is a different word and
the note is the only thing that tells the learner what *theirs* meant.
Two of the ten live topics are vocabulary.

**Cost, and the §7 check.** No new control, no new card, no new
primitive — one line inside an `article` that already exists. It does not
touch the one-filled-button rule.

**Risk.** The results screen has no height budget (`audit/product.md`
§3.2, §5.5) and this makes it longer: one line per wrong answer, so about
eight lines on a bad 20-question test. That is the honest cost and it is
why the note goes under the answers rather than being given a block.

**Wrong if:** the note is close enough to the explanation that re-reading
it is noise. For the eight grammar topics that is partly true; for the
two vocabulary topics it is not true at all, and vocabulary is the newest
content and the one his friends will meet least prepared.

### 1.4 One sentence about the material a mixed test draws from — **20 minutes, copy only**

**What it is.** `startMixedTest` (`js/quiz-launch.js:54-58`) pools every
live topic, and `orderForPractice` (`js/quiz-engine.js:41`) draws unseen
items first. Both are right. The consequence is not obvious and nothing
on screen says it: **a learner who has read six of sixty lessons gets a
ten-question test in which roughly nine items come from categories no
lesson has taught them yet** — 24 of 241 items belong to categories they
have read, and the draw is uniform over the unseen.

The machinery downstream handles this correctly. A low score produces
weak categories, which the next-step card turns into *instruction* rather
than restudy (shipped v0.27). What is missing is that the learner is
never told, so a 3/10 on day two reads as a verdict on them rather than
as a description of the draw. The mixed-test card currently says the
questions come from every topic mixed together and that the exam is like
that too (`js/home.js:180-187`); it does not say that some of them will
be things the app has not taught yet.

**Cost.** One clause in an existing paragraph. No layout change.

**Who it is for.** Not the owner — he has read the corpus. The four
friends started this week from zero, and this is the sentence that stops
their first test being read as a result. That makes it the same species
as the still-open item 6 of `quality-of-life.md` §7 (the honest note in
Profil, which is the owner's tone call and is not reopened here). This is
a different sentence on a different screen and does not depend on that
decision.

**Wrong if:** framing the test as partly untaught makes learners avoid
it. The counterweight is that the app already argues the opposite case in
its own voice for the pretest block (`js/education.js:1305-1327`) — that
attempting and failing before study is the point — so there is a true and
encouraging way to say this, and it is the same sentence the reader
already uses.

### 1.5 Stop the headline accuracy punishing the mistake book — **20 minutes as a label, 1 hour as a filter**

**What it is.** `getOverallStats` (`js/storage.js:474-499`) walks
backwards through history until it has 40 answers, with no reference to
`mode` — a field every attempt has carried since the beginning and which
**nothing in the app has ever read from history** (it is read only from
the live session result, `js/results.js:134,172`). The mistake book is by
construction the learner's hardest items, so under the usage
`quality-of-life.md` §1.2 projects (20 mixed + 10 book per day), about a
third of that 40-answer window is drilled failures. The number falls
because he took the app's advice.

`getTopicAccuracy` (`js/storage.js:328`) has the same blindness, feeding
the percentage on each Test-tab topic row.

**Two shapes, and I would take the smaller one this week.**

- *The label* (20 minutes): the stat already prints its own denominator
  — *"Son 40 soruda"* (`js/profile.js:96-101`). Naming what is in the
  window is honest, costs nothing, and changes no number four days before
  an exam.
- *The filter* (1 hour): exclude `mode === "mistakes"` attempts from the
  accuracy window, with a unit test. Truer, and it is a change to a
  displayed number during exam week, which is the one category of change
  this project has been most careful about.

**Wrong if:** he reads the number as "how am I doing overall" and would
rather it include everything, which is a defensible reading — a mistake
book run *is* him answering questions. That is why the label is the
version I would ship: it makes the reading explicit without deciding it
for him.

---

## 2 · The wider app — after the exam

The organising question here is different: not "what changes Tuesday" but
"what does this app need in order to keep being true as it grows". Two of
the five below cost nothing today and a great deal later, which is the
only reason they are ranked above things with more obvious value.

### 2.1 Record what happens in the reader — **3–4 hours, plus one decision that is not mine**

**The measurement.** Every lesson has exactly two `check` blocks (checked
across all 60), and a pretest on first open. All three draw from the same
shuffled pool of that lesson's category — the same four questions the
test bank holds (`js/topics.js:243` builds `checkPool` from the topic's
own questions; `js/education.js:1058` takes from one shuffle, and
`:1454-1458` deliberately shares the taker with the pretest so the same
item is not met twice in one page). So **a first read of a lesson exposes
three of that category's four questions**, and across the corpus a
learner who reads everything meets **180 of 241 questions inside the
reader**.

None of it is recorded. `state.reader.answers` is a `Map` that dies when
the reader closes.

**What that does, in three parts, none of them previously named:**

1. **A test after reading is largely a re-test.** For a learner who reads
   first — which Eğitim being the default tab makes the normal case — the
   test measures memory for items met in the reader, not the grammar.
   Every number the app derives from history inherits that.
2. **The ordering makes it worse, not better.** `orderForPractice` puts
   an item with no stats in tier 0 and draws it *first*. The items the
   reader just spent are exactly the items the next test prioritises.
3. **The pretest, which the app designs the learner to fail, produces
   nothing.** Not a mistake-book entry, not a weak-category observation,
   not a timestamp. It is the single most diagnostic event in the reader
   and the app forgets it before the page scrolls.

**Three responses, and the choice is the owner's because it is partly a
content decision.**

- **(a) Leave it, and write it down.** Defensible: a check answered three
  blocks after the lesson taught it is a recognition test at zero delay
  and is weak evidence of anything. If this is the answer, it belongs in
  `CLAUDE.md` beside the existing note that checks draw from the same
  category, because the *measurement* consequence is not currently
  recorded anywhere and the next session will re-derive it.
- **(b) Record checks as their own mode.** `recordAttempt` already takes
  `mode`; write reader answers as `mode: "lesson"` attempts. Then let
  `getItemStats` (ordering) and `getMistakeBook` see them — so a failed
  pretest enters the book, which is exactly what the book is for — while
  `getOverallStats` and `weakestEntries` exclude them, so a zero-delay
  recognition answer never becomes a claim about the learner. This needs
  §1.5's mode-awareness to exist first, which is a reason to do §1.5 as
  the filter rather than the label eventually.
- **(c) Author dedicated check items** so the reader stops consuming the
  test pool. Cleanest measurement, and it is 120 new items through the
  full review pipeline: roughly the cost of five topics.

**I would take (b), after the exam.** It converts the app's most frequent
retrieval event into evidence at the cost of one storage decision, and it
is the only one of the three that makes the mistake book fire from the
reader — where, for a lesson-first learner, most of their wrong answers
actually happen.

**Wrong if:** recording checks visibly moves the numbers in a way that
reads as a verdict, or if the owner's view is that a check is teaching
and must never be measurement — in which case (c) is the honest answer
and it is a content programme, not a feature.

### 2.2 Decide the passage container once, before anything needs it — **0 hours now**

**What it is.** Three of the paper's shapes need a container the schema
does not have: paragraph completion (a ~120-word paragraph with a
sentence-sized gap), the real cloze (a ~450-word text with **ten**
blanks and the options printed after it), and reading (a ~700-word text
with paragraphs addressable by Roman numeral). The roadmap costs the
first at ~8 hours of code and the third at about a week; the second is
not costed anywhere, because both `roadmap.md` and `audit/next.md:216`
treat cloze as a covered section.

`audit/next.md:563-635` already says the passage schema's **marked span**
must be decided before a passage is written, carried from
`vocabulary.md:900`. This adds one requirement to the same list, and it
is the same kind of thing: **the container must carry more than one
addressable gap.** A schema built for "a paragraph with a gap" makes
paragraph completion work and makes the real cloze a second schema; a
schema built for "a passage with N addressable positions, each of which
may be a gap, a marked span, or a numbered paragraph" covers all three
and costs nothing extra to specify today.

**Why it is ranked here despite doing nothing.** It is the only item in
this document whose cost is strictly increasing with time and whose cost
today is zero. Everything else can wait without getting dearer.

**Wrong if:** the multi-blank cloze is never built, in which case a
one-gap container would have been simpler. The insurance is one paragraph
in `docs/CONTENT_GUIDE.md` when the type is specified.

### 2.3 Item triage from exported backups — **2 hours of tooling, and it depends on §1.1**

**What it is.** A `tools/` script — never a feature, never in the app —
that reads one or more backup files and prints, per question: how many
learners met it, how many got it wrong first time, and which distractor
they took. `npm run triage -- backups/*.json`.

**Why this is allowed when analytics are not.** `content-pipeline.md`
§2.1 refuses *p*-values, point-biserials and distractor take-up
statistics, and it is right: five learners produce confidence intervals
covering the scale. But §2.2 endorses precisely this as **triage** — *an
item every learner got wrong first time is a candidate for "keyed
wrong"* — and stops only because *"history is on the learner's phone and
does not come back"*. The backup is a file the learner produces by
tapping a button and hands over through the share sheet, the same channel
the problem report already uses (`js/report.js:69-87`). Nothing is
collected; something is given.

The output must be hypotheses, not measurements: **the value is entirely
in the extreme cells.** Every learner wrong on one item is a candidate
mis-key. Every learner right first time without reading is a candidate
surface cue. A distractor nobody ever picked is a candidate dead option —
which is `question-author.md` rule 4 detected from the other side, and
the pipeline's most-repeated defect.

**Risk, and it is real.** A backup carries the learner's name and their
entire history, which is a great deal more than a bug report. Asking for
one routinely would be a different relationship with four friends than
the one this app has. The honest shape is: the tool exists for files the
owner is *given*, the script never phones anywhere, and no output ever
reaches a screen.

**Wrong if:** the five learners' vectors are mostly zeros and ones with
nothing extreme in them, which is the likely case for most items. Then
the tool costs two hours and finds two or three items, which is still
better than the pipeline's current empirical signal, which is none.

### 2.4 The cloze section, in the shape the paper uses — **~1 day of code, then supply**

**What it is.** The app's cloze item is a two-to-three-sentence paragraph
with one blank and four options (`data/connectors/connectors.json`, and
every other topic). The paper's cloze is one continuous ~450-word text
with ten numbered blanks and all forty options printed after it. The
learner has to hold a passage, decide ten different things about it, and
navigate between the text and an options block. **The app rehearses none
of that**, and its own specification says so plainly: *"A cloze passage
is not ten of our questions in a row. The unit is the passage."*

Coverage today reads "7 of 10 blanks have a lesson" and that is true and
it is about content. The format number is zero.

**How much that is worth: less than it sounds.** Test-format familiarity
is reported as a real but bounded gain, framed as removing
construct-irrelevant variance rather than teaching English, with explicit
warnings that heavy test-shaped practice inflates scores without the
ability behind them **[search-summary; no paper fetched]**. So this is
worth building after the sections that are worth *marks*, not before.

**Where it goes in the order.** After paragraph completion, which is nine
uncovered points against this one's zero additional points, and sharing
§2.2's container so the second one is a content job rather than a second
schema. Per-passage authoring is a supply, not a project: ten blanks in
one coherent 450-word text, each testing a different thing, is a harder
authoring constraint than ten separate items, and a passage is spent once
read.

**Wrong if:** the friction on the real paper is not format at all but
reading speed, in which case the reading work carries this too and a
cloze passage is a detour. Ten minutes with the sample paper and one
learner would settle it, and that measurement costs nothing.

### 2.5 A generated search index — **~4 hours, and not yet**

**What it is.** The Eğitim filter searches lesson category, summary and
topic title, over strings already in memory (`js/education.js:685-737`).
It cannot find a rule inside a `pitfall` block, or the topic that covers a
word. At 60 lessons that is fine; at 150 it is the difference between an
app you look things up in and one you scroll.

The constraint-respecting version is generated at format time —
`tools/format-content.mjs` already generates the manifest's lesson index —
producing a small `data/search-index.json` of lesson id plus keywords, so
searching never downloads the corpus. No dependency, no build step, no
`innerHTML`.

**Named so it is not reinvented, and explicitly deferred.** The gate is
corpus size, not code. **Wrong if** the wider app grows by depth rather
than breadth — more items per existing category — in which case the
filter never stops working and this is never needed.

### 2.6 Inherited and still right — not re-argued here

Listed only so this document is not read as a complete map of the
backlog: the topic-file split (`audit/product.md` §3.1, and it grows more
binding every topic — a mixed test today downloads 780 KB including every
word of lesson prose); 4 → 6 items per category, which is the only thing
that would ever make a *confident* weakness claim possible (measured
above: 59 categories at four items, one at five, threshold six); the
`level` axis and the coverage claim as data (`audit/next.md` §5.1); the
error-tracking screen scoped as a log (§3.2 there); "Bugün pratik"; the
timed, feedback-deferred block; and reading as ongoing supply.

One note on the last of those, because this document's external reading
touches it: the feedback-deferred block's case is **format rehearsal, not
retention**. The timing literature is genuinely contested — an old
meta-analysis favouring immediate feedback, later work reporting delayed
feedback better in the lab and immediate better in classrooms, and a
recent formative multiple-choice trial finding no difference at all
**[search-summary; no paper fetched]**. Anyone building it should not
claim a learning gain it cannot support.

---

## 3 · What I would refuse

Named because each sounds obviously right, and four of them are things I
talked myself into before measuring.

**Interleaving enforced in the draw.** This was on my own list until I
measured it. Over 2000 simulated 10-item mixed tests against the real
corpus, the mean number of adjacent same-category items is **0.12**, and
**89% of tests contain none**. Same-*topic* adjacency is common (0.86 per
test), but a learner never sees the topic during a test — `js/quiz.js`
prints the category (`renderQuestion`, the `t-label` above the prompt) —
so two adjacent items from one topic show two different labels. There is
nothing here to fix, and touching `orderForPractice` to fix nothing is
the change `quality-of-life.md` §6 names as the most dangerous available.

**Typed-answer items, to add production practice.** The most plausible
"make retrieval harder" proposal, and it is wrong twice. Every item on
the paper except the note-taking sheet is four-option multiple choice, so
production is not the construct. And a typed blank has to accept
`will have finished` and `'ll have finished` and reject a
near-miss, which means shipping an answer-normalisation ruleset — the one
kind of code where a wrong rule marks a correct learner wrong and the
learner concludes they are wrong. *"Önce kendin düşün"*
(`js/quiz.js:233-244`) already buys the recall step at zero content cost
and with no false negatives.

**Text-to-speech, for the listening section or for pronunciation.**
`SpeechSynthesis` needs no dependency, no backend and no build step, so
it clears every architectural constraint — and it is still wrong.
Fourteen of Session II's twenty points are a hand-written note-taking
sheet that is not a multiple-choice task at all, `exam-spec.md` says
listening cannot be faked with text-to-speech, and `audit/next.md:250`
already argues listening should be written down as *refused* rather than
*later*. The narrow remaining use — an English example read aloud — is a
control on every item for a benefit nobody has asked for, in an app whose
users read Turkish explanations, and a synthesiser saying `____` is worse
than the `.blank` element already handles for screen readers.

**A "practise this category" action on the results breakdown rows.** The
breakdown already links each category to its lesson
(`js/results.js:97-114`) and it is tempting to add practice beside it. It
would break a rule both `js/results.js` and `js/profile.js:7-10` state
explicitly: one row, one action, and which action it is follows from
which screen you are on. The Test tab's weak-spot rows are the practice
door; Profil's and the results screen's are the lesson door. Two actions
on one row is where that stops being legible.

**A bookmark, star, or "kaydet" collection.** It looks like the missing
half of the mistake book and it is its opposite. The book is written by
evidence, sorted worst-first, and clears itself when the learner earns it
out (`js/storage.js:224-280`). A starred list is written by the learner's
own judgement — the judgement the app exists to correct — never clears,
and only grows. A learner with 30 starred items and 24 book items has two
lists competing for the same evening, one of which is a measurement and
one of which is a mood from last Tuesday.

**Pooling backups into anything a learner sees.** §2.3's tool is one
short step from "you and your friends both get this one wrong", and that
step is the leaderboard `practice-modes.md` refuses at length — with the
aggravating detail that these six people know each other and sit the same
exam. The tool prints to a terminal, for one person, about items. It
never prints about people and nothing it computes goes near a screen.

**A printable or PDF revision sheet.** A print stylesheet is genuinely
free — no dependency, no build step — and the audience is holding phones.
Worse, the one thing worth printing is the mistake book, and the mistake
book only works because it is live: an item leaves it when the learner
earns it out, and paper cannot do that. A frozen copy of a self-clearing
list is a list that stops being true the day it is made.

**Upheld without re-argument, from the documents that made them:** any
countdown or stored exam date; any readiness or "hazırsın" claim; a
seen-N-of-241 progress number; streaks, points, badges, daily goals and
any re-engagement prompt; accounts, sync or a backend under any framing;
a per-exam content fork; five-option items or negative marking;
item-level scheduling, adaptive difficulty, mastery levels, FSRS or BKT;
a placement test or any proficiency number stated about the learner;
flashcards; a full-pool "sınav modu"; a per-question timer; and anything
that reopens the two-tab navigation. Every proposal above lands on a
screen that already exists.

---

## 4 · What I would build, in my own voice

**First, the twenty-minute one: store the chosen option.** Not because
it does anything on Tuesday — it does nothing on Tuesday — but because it
is the only item here that gets *more expensive by waiting* in a way that
cannot be recovered. Code can be written later; this week's answers
cannot. Every other line in this document could be deleted and I would
still ask for this one.

**Second, the offline content cache** — if, and only if, the answer to
"do you lose signal" is yes. The service worker was built for one
scenario, that scenario is the metro, and the app currently fails it
after every deploy. It is an hour, and the test that comes with it is
what stops it happening a third time.

**Third, the option note in the results review.** Forty-five minutes
against a round of work that produced 579 notes, all of which are
currently visible for a few seconds each and then gone. That is the
highest ratio of value already paid for to value delivered anywhere in
the repository.

**And the one I would refuse hardest: any pooling of the learners' data
into something a learner can see.** Not the tool — the tool is fine, it
prints about items to one person in a terminal. What I would refuse is
the obvious, friendly, apparently harmless next step: a line that says
"three of you missed this one", a shared weak-category list, a
group-mistake-book. It would be the most-screenshotted thing the app ever
shipped, it would be a ranking of five friends by English ability four
days before an exam that decides each of their years, and — because the
inputs are files anyone can edit — it would be a ranking anyone can
forge. `practice-modes.md` refused the leaderboard when it was a feature
request. I am refusing it in advance as a consequence, because §2.3 is
the first thing in this project that would make it easy.

---

## 5 · Open questions

Answers to these change the ranking above more than any further research
would.

1. **Do you lose signal where you study?** It is the whole rank of §1.2.
2. **Should a check answered inside a lesson count?** (§2.1) It is one
   sentence from you and it is worth three or four hours either way — and
   the answer decides whether the reader's 180 exposures are teaching or
   measurement.
3. **Would any of the four send you a backup file if you asked?** (§2.3)
   If not, the tool has one dataset — yours — and is worth about a
   quarter of what it says.
4. **Is the friction on the real cloze the format or the reading speed?**
   (§2.4) Ten minutes with the sample paper settles it and it decides a
   day of work.
5. **Does the headline accuracy mean "everything I answered" or "how I am
   doing on fresh material"?** (§1.5) It is a reading, not a bug, and
   only you can pick it.
