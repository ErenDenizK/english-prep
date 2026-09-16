# What is not here yet

The forward-looking arm of the 2026-09-04 audit. Two sibling documents
catalogue what exists (`docs/audit/content.md`, `docs/audit/product.md`);
this one is about what should come, what it costs, and which of the
decisions being taken this week are the expensive ones to reverse.

Written against `test` at `359b121`, with `npm run check` green
(107 unit tests, formatter and validator clean, palette re-measured).

Two facts frame everything below and neither is in the repository yet:

1. **The owner starts using the app daily from tomorrow**, for his own
   YTÜ İYS. A friend uses it for Bilkent's PAE. This is a real
   single-user product with a deadline, not a demo.
2. **In about a month he wants this to become a broader English
   application**, and was explicit that this is a heads-up rather than a
   request. §5 treats it as a constraint on decisions taken now, not as
   work to start.

---

## 0 · What I could actually verify, and one thing I could not

Repository measurements are exact and were taken by running code against
this checkout. Everything about the outside world is worse: this
environment's egress proxy blocked `ybd.yildiz.edu.tr` outright
(`EGRESS_BLOCKED`), which is the same limitation every research arm has
recorded since 2026-09-03. External claims below come from **web-search
index summaries**, not from the pages.

**And one of those summaries may be the most important sentence in this
document.** Searching for the İYS calendar returned, twice and in two
differently-worded queries, that YTÜ's İYS applications ran **3–6
September 2026**, that **Session I is 9 September 2026 at 09:30 and
Session II is 11 September at 09:30**, and that **only candidates who
pass Session I sit Session II** — with a **60/100** overall pass and a
Session I floor of **25 out of 50**.

Three reasons to treat that as a question rather than a fact:

- The page it paraphrases is blocked from here, so nobody in this session
  has read it.
- The highest-ranked YTÜ URL in both searches is
  `…/9-11-eylul-**2025**-ingilizce-yeterlilik-sinavi-iys-duyurusu`. The
  September dates may be a 2025 announcement that the index re-dated.
  The only unambiguously 2026 YTÜ announcement URL returned was
  `23-haziran-2026`.
- "25 out of 50" contradicts `docs/exam-spec.md`, which counts Session I
  as **40 questions × 1.5 = 60 points** from the sample paper itself. One
  of the two is describing a scaled score and there is no way to tell
  which from here.

**This is a one-minute check for the owner and it invalidates or confirms
most of §6.** If Session I is on 9 September, the exam is *five days
away*, not a month, and the correct plan for this week is
`docs/research/the-last-week.md` §4 — which is a study plan for a person,
not a build plan for an app. If the sitting is later, §6 stands as
written. I have costed both.

It also, if true, settles `docs/v1-plan.md`'s *Blocked on the owner* #1:
the Session I threshold would be real, a candidate can fail on Session I
alone, and Session I is therefore the whole of what this app should ever
have been aimed at. That was named there as "the single most consequential
unknown in this document" and it is still unresolved after two rounds.

---

## 1 · The v1 definition, re-tested

`docs/roadmap.md:134-136`, accepted by the owner:

> The app is 1.0 when every part of the exam it can honestly practise is
> practisable with reviewed content, and the app never tells a learner
> something it cannot support.

**The definition holds. Its four criteria do not all mean what they
say**, and two of them contain arithmetic that is now wrong.

### 1.1 Criterion 1 (coverage) is short by one blank type, not two

`docs/roadmap.md:40` says the cloze section is at "**8 of the 10 blank
types shipped**; the other two are the vocabulary blanks, drafted."
Its own blank-by-blank table twelve lines later (`:50-59`) says otherwise,
and so does the corpus:

| Blank | Tests | Status |
| --- | --- | --- |
| 1 | discourse markers | `connectors`, shipped |
| 2, 4 | modals | `modals`, shipped |
| 3 | causative | `gerunds-infinitives`, shipped |
| 5, 10 | vocabulary | **drafted, unreviewed** |
| 6 | comparatives | `closest-meaning` — its own table says *partly* |
| 7 | `so / such` | **nothing** |
| 8 | relative pronouns | `relative-clauses`, shipped |
| 9 | quantifiers | `quantifiers`, shipped |

**Seven of ten blanks are covered, not eight, and one of the seven is
marked partial by the document making the claim.** `so / such` is
missing from the summary line and present at `:57` and `:116` of the same
file. This is a small error and it matters for one reason: criterion 4
("it says what it does not do") is rendered from `uncoveredSections()` in
`js/topics.js:267`, which tracks *sections*, not blank types — so nothing
in the app is wrong today. But the roadmap is the document a future
session will cost work from, and it currently says one topic less work
remains than does.

### 1.2 Criterion 2 (quality) is ambiguous, and the ambiguity is worth 20 hours

The criterion reads "every shipped item has passed a blind pass and every
shipped lesson a sufficiency pass". `docs/roadmap.md:146-148` then
concedes it is "currently *false of shipped content too* — the 73 live
questions have been through it, but the pipeline has tightened since."

Those are two different criteria wearing one sentence:

- **Passed the pipeline as it stood when it shipped** — true today for all
  193 items. Remaining work: zero.
- **Passed the pipeline as it stands now** — false for `tenses`, `modals`
  and `passive-voice`: 73 questions and 18 lessons authored before the
  category spec, the salted calibration set and rules 1 and 2 in
  `docs/agents/question-author.md` existed.

At the pipeline's own measured rate — 6–8 minutes of supervisor attention
per item, ~45 minutes per lesson including the sufficiency pass
(`docs/research/content-pipeline.md:1349-1360`) — the second reading is
**73 × 7 min + 18 × 45 min ≈ 9 + 13 ≈ 22 hours**.

**That is the largest uncosted line item in the current v1 definition,
and it is invisible because the definition does not say which reading it
means.** It needs one word from the owner, not a project.

My read: take the first reading, and record the second as a standing
debt with a trigger — re-pass a topic when it is next edited for any
other reason. The original three topics carry two cloze blanks and part
of restatement (`docs/exam-spec.md`); they are not where a defect does
the most damage, and 22 hours spent re-reading passed content is 22 hours
not spent on the sections at zero.

### 1.3 What remains, in hours

| | Work | Hours | Source |
| --- | --- | --- | --- |
| 1 | Two vocabulary topics: both review passes on 48 items and 12 lessons, then ship | **~18** | `exam-vocabulary.md:657-670`, measured rates |
| 2 | `so / such`: one category, 4 items, one lesson, folded into an existing topic | **~4** | pipeline rate + one spec hour |
| 3 | Paragraph completion: schema, validator branch, renderer, `CONTENT_GUIDE` | **~8 (1 day of code)** | `roadmap.md:117` |
| 4 | Paragraph completion content, 24 items = 4 exam-shaped sittings | **12–48** | see below |
| 5 | *(If criterion 2 means "the current pipeline")* re-pass the first three topics | *+22* | §1.2 |
| | **v1 as accepted** | **42–78 h** | |
| | **v1 on the strict reading of criterion 2** | **64–100 h** | |

**Item 4's range is a real disagreement between two documents in this
repo and it should be settled by measurement, not argument.**
`docs/roadmap.md:117` prices a paragraph-completion item at "~2 hours".
`docs/research/reading.md:599-640` prices a *reading* item — which carries
a 700-word passage and a NOT-TRUE option-by-option adjudication — at
21–30 minutes, and `content-pipeline.md` prices a grammar item at 6–8
minutes. A paragraph-completion item is a ~120-word paragraph with one
sentence removed and four candidates each failing on a *named* cohesive
link (`content-pipeline.md:990-1020`). It is dearer than a grammar item
and cheaper than a reading item; 2 hours is four to six times the reading
rate for a sixth of the text. **My estimate is 30–45 minutes an item.**

The way to settle it costs nothing extra: the pipeline's own rule is that
a round is abandonable at four items and still ships
(`content-pipeline.md:1377-1390`). Write four, time the round, and the
number is known. Do not plan 24 items against a number nobody has taken.

At the owner's realistic throughput — he is also sitting an exam — v1 is
**four to ten weeks at 10 hours a week**, or **three to six months at
four**. That is the honest range and it does not depend on which reading
of criterion 2 wins.

### 1.4 Is reading still rightly outside v1, now that there is a daily user?

**Yes, and daily use makes the argument stronger rather than weaker.**

The instinct runs the other way: a daily user exhausts the bank (§4.1),
reading is 21 points and the largest untapped supply, so surely it moves
up. Three things say no, and one of them is new.

1. **A passage is single-use** (`reading.md:646-668`). Once read, all
   seven items are spent. Ten passages is five sittings and 25–35 hours
   of review. A daily user consumes five sittings in **five days**. As an
   answer to pool exhaustion, reading is the worst content type in the
   plan, not the best — it is the only one where the supply is destroyed
   by the use.
2. **The phone is the wrong medium for this section specifically.** The
   screen-inferiority effect is concentrated in expository text and is
   worse under time pressure (`reading.md:758-780`, *g* ≈ −0.21 overall,
   ≈ −0.27 expository — search-index summaries, unverified). The owner
   owns the two highest-fidelity reading items that exist for this exam:
   the sample papers, on paper.
3. **New, and the reason to say it now:** the owner is about to become
   the app's heaviest user *and* its only reviewer. Reading is the one
   content type where those two roles collide destructively —
   `content-pipeline.md:1518` calls it "the supervisor burns the pool he
   is supposed to practise on." At 4 items per category that is annoying.
   At 7 items per passage, reviewing a passage *is* sitting it, and he
   can never sit it again.

**What did change, and is worth taking:** the reading arm's own cost
table (`reading.md:699-718`) lists **5–6 reading-skill lessons with no
passages at ≈ 6 hours, usable immediately**. Those teach the seven
question types and the elimination procedure, use the existing block
schema with no code at all, are not single-use, and are the cheapest
points-per-hour available against the 21 uncovered points. They were
scheduled to ship *with* the passages (`v1-plan.md` stage 2 item 4, "or
the feature is half-wired") — but that coupling exists to stop the
results screen dead-ending on a new taxonomy, and it does not apply to
lessons that carry no questions. **Unbundle them.** This is the one
reading recommendation in this document.

---

## 2 · The exam gaps, costed as supply

The distinction that matters here is the one `reading.md` drew and
nothing else has adopted: some content is a **project that finishes** and
some is a **supply that has to be replenished**. The difference is
whether an item survives being met a second time.

| Gap | Points | Code | Content, first credible set | Per unit thereafter | Project or supply? |
| --- | --- | --- | --- | --- | --- |
| `so / such` | ~1.5 (blank 7) | none | 4 items + 1 lesson, **~4 h** | — | **Project.** It closes and stays closed |
| Vocabulary (blanks 5, 10) | ~3 direct | none | 48 drafted items, **~18 h** of review | ~7 min/item | **Project**, then supply if extended |
| Paragraph completion | **9** | ~8 h | 24 items, **12–48 h** (§1.3) | 30 min – 2 h/item | **Supply, mildly.** A 120-word paragraph is memorable; an item is worth perhaps two meetings, not ten |
| Reading | **21** | ~1 week | 10 passages, **25–35 h** | 2–3.5 h/passage | **Supply, hard.** 7 items spent per sitting |
| Listening | **20** | audio + a hosting decision this project has never made | — | — | **Neither. It is a different product** |

Three things follow that are not in the roadmap.

**Vocabulary is the only remaining gap that is a project rather than a
supply, and it is 40% written.** 48 items and 12 lessons exist in
`docs/agents/drafts/`; neither review pass has run. Eighteen hours takes
the app from 193 to 241 questions and closes two of the three uncovered
cloze blanks. Nothing else on the list has that ratio.

**Paragraph completion is the only uncovered *section* the app can hold
honestly.** Reading needs a passage unit and a week of code; listening
needs audio. Paragraph completion needs one `type` value, one validator
branch, and a renderer that shows a paragraph with a sentence-sized gap —
the type registry at `js/topics.js:72-77` was built for exactly this and
adding to it is additive by construction (`tools/validate-content.mjs:57`,
absent means cloze, so no existing item is touched). It is 9 points and
the second-cheapest section on the paper.

**Listening should be written down as refused rather than left as
"later".** `docs/roadmap.md:182` has it "needs audio, which is a different
project and a hosting decision". That is true and it undersells the
problem: the larger half of Session II is a **hand-written note-taking
sheet** (`exam-spec.md`), which is not a multiple-choice task, cannot be
scored by this app, and would be destroyed by text-to-speech
(`v1-plan.md`, *Refused*). Fourteen of the twenty listening points are
outside anything this architecture can do. It is not a deferred section;
it is a section this app is structurally not for. Saying so lets the
coverage paragraph stay honest without a future session re-deriving it.

---

## 3 · The researched-and-never-built features, and the exact number each waits on

The corpus today: **193 questions, 48 categories, 8 topics, 48 lessons.**
Forty-seven categories hold 4 questions; one holds 5. **4.02 items per
category**, which is the same number `docs/v1-plan.md` called the binding
constraint on everything, unchanged after +120 items — because every
topic shipped since arrived at four per category too.

That is the single most important fact in this section. **The corpus
grew 2.7× and not one gate moved**, because all the growth went into
breadth. Every threshold below is per-category.

| Feature | Where it was researched | Gate | Today | Status |
| --- | --- | --- | --- | --- |
| Unseen-first draw | `practice-modes.md:843` | none | — | **Shipped** (`js/quiz-engine.js:41`) |
| `Yanlış defteri` | `practice-modes.md:710` | none | — | **Shipped** (`js/storage.js:188`) |
| `Cevabı önce düşün` | `practice-modes.md:680` | none | — | **Shipped** (`js/config.js:27`) |
| `optionNotes` field | `practice-modes.md:774` | none | — | **Shipped**; content open, and the bill is now **579 notes**, not the 291 recorded in `v1-plan.md` — the corpus doubled under the estimate |
| **Timed, feedback-deferred block** | `v1-plan.md` stage 2 item 2 | "exam-shaped content exists" | 24 restatement items shipped | **UNBLOCKED.** `the-last-week.md:775` says it became eligible the moment restatement shipped. ~1 day of code, zero content |
| **Category-level "Bugün pratik"** | `learning-design.md:270-310` | *none, and this has been mis-filed* | — | **UNBLOCKED.** See below |
| A *confident* weakness claim | `vocabulary.md:773-810` | **6 distinct items** per category (`js/storage.js:28`) | 4 | **Gated.** +2 items × 48 categories = **96 items ≈ 12–16 h** |
| Mastery levels | `practice-modes.md:881` | 8–10 per category | 4 | **Gated.** +192 items ≈ 22–30 h |
| Adaptive difficulty, item scheduling | `roadmap.md:183` | 15–20 per category | 4 | **Gated.** +528 items ≈ 55–70 h |
| Flashcards | `vocabulary.md:833` | — | — | Refused permanently, on evidence |
| Placement test | `v1-plan.md`, *Refused* | — | — | Refused; α = 0.24 at four items |
| Challenge code / social | `practice-modes.md:638` | "do the friends want to compare" | unasked | Still gated on four messages |
| **Error-tracking screen** | arm launched 2026-09-04, **never reported** | — | — | See §3.2 |

### 3.1 The one genuinely unblocked feature nobody has noticed

`docs/roadmap.md:171-173` puts "adaptive difficulty and item scheduling"
behind 15–20 items per category. That is correct for *item* scheduling
and it has quietly swallowed a different feature.

`learning-design.md:295-305` proposes **"Bugün pratik"**: pick one
category last practised three or more days ago plus one never practised,
ten items, mixed, rendered as one row on the Eğitim index. Its unit is
the **category**, which `learner-model.md:427-468` argues at length is
the only schedulable unit this app has — four items have nowhere to put
an interval, and item-recall optimises memory for a sentence.

**It needs no new storage and no new content.** Every attempt already
carries an ISO date and its per-question ids and categories
(`js/results.js:216-229`), and `getItemStats()` already returns
`{last, category}` per item (`js/storage.js:129`). "Which category has
this learner not touched for three days" is a pure function over data
that exists. Cost: a function in the style of `quiz-engine.js`, unit
tests, and one card. **Half a day.**

It has been sitting behind a threshold that does not apply to it since
2026-09-03, and it is precisely the feature whose value appears the day
someone starts using the app daily.

### 3.2 The error-tracking arm, and what it could honestly show

It was commissioned (`roadmap.md:120-126`) and never reported. Rather
than re-commission it blind, here is the constraint it would have hit, so
whoever writes it starts past it.

The mistake book covers *practise*; this screen is *understand*. The
temptation is a diagnosis — "you confuse `few` and `a few`" — and the
app cannot support one: `MIN_ITEMS_FOR_WEAK_CLAIM = 6` distinct items
(`js/storage.js:28`) is unreachable in all 48 categories, so every
inference on this screen would carry the same hedge Profil already shows.

But a **log is not an inference**. "You answered this item on 3, 7 and
9 September; wrong, wrong, right" is a record, it is true at any sample
size, and it is the one thing a month of daily data makes genuinely
richer. Scope the screen as a per-item history with the explanation
attached, not as a diagnosis, and it is honest on day one and better
every week. Scope it as a diagnosis and it is blocked on 96 new items.

---

## 4 · What one real daily user changes

Everything in the app assumes an anonymous learner with no history. From
tomorrow there is one learner with a fixed exam and accumulating data.
Four things change and two of them are risks.

### 4.1 He empties the bank in about ten sessions. Measured.

`orderForPractice` draws unseen items first (`js/quiz-engine.js:41`), so
a mixed test delivers *n* items the learner has never met until there are
none left.

| Session size | Sessions to see all 193 | With the vocabulary drafts (241) |
| --- | --- | --- |
| 10 (the Test tab default, `js/config.js:8`) | **20** | 25 |
| 20 | **10** | 13 |
| "all" | 1 | 1 |

**One 20-question test a day starting 2026-09-05 exhausts the corpus
around 2026-09-14.** After that, `correct` stops measuring grammar and
starts measuring item memory — the finding `practice-modes.md:57-104`
built its whole argument on, arriving for real in nine days.

The app already has a card for it (`js/education.js:542`, fires when
`getItemStats()` covers `questionCount`), and its copy is honest: from
here it is revision. But the card is a stopgap for a content problem
(`user-flow.md:838`, open question 2), and the content answer that is
already written and merely unreviewed is the two vocabulary topics.
**Eighteen hours of review buys three more days of unseen questions**, and
that is the honest way to say what shipping them is worth — not "+48
items".

### 4.2 A month of data does *not* unlock a weak-spot claim, and this is the important correction

The intuition is that diagnosis is blocked on data and a daily user will
supply it. **It is not.** `weakestEntries` counts **one observation per
distinct question**, deliberately (`js/storage.js:359-390`): answering the
same four items three times gives `total = 4`, not 12, because lifetime
sums let repetition manufacture evidence. `confident` requires
`total >= 6`. Every category has four.

So the app will still be showing *"Şimdilik az veriyle sıralandı"* on
9 October with a month of daily answers behind it, and it is right to.
**The binding input is items, not answers, and no amount of use moves
it.** There is a unit test asserting exactly this
(`tests/`, "answering the same four questions again does not manufacture
evidence" — test 107).

The cheapest threshold in the whole plan is this one: **+2 items in a
category takes it from four to six and lets the app make its first
confident statement about a weakness ever.** Ninety-six items across all
48; far fewer if aimed at the categories that get weak-flagged most, which
is `roadmap.md:118`'s item 8 and is currently unranked because nobody has
the data. **From tomorrow, the owner is that data.** After two weeks of
daily use, `getWeakCategories()` will name the categories worth extending
first — which turns an "ongoing" roadmap line into a specific list of
maybe six categories and **~4 hours**.

### 4.3 The last-week mode is not blocked on the exam date, and never was

`docs/roadmap.md:221-223` and `v1-plan.md` both record the exam date as
blocking `the-last-week.md`. Reading the document itself, that is a
misfiling of its own conclusion.

`the-last-week.md:552-620` **refuses a stored date and any countdown**,
on the worry component of test anxiety and on the observation that a date
is "the highest-consequence, lowest-durability thing this app could
store". What it asks for instead is **one boolean** — `EXAM_WEEK` in
`englishPrep.settings`, rendered with the `toggleRow` primitive already in
`js/profile.js:249` beside *Önce kendin düşün*, turned on by the learner
and off by them. It changes three things: the weak-spot ranking sorts
nearest-to-mastery first, the mistake-book copy stops promising a
graduation the calendar cannot deliver, and one note appears. **About a
day, mostly Turkish copy.**

What the *date* blocks is not the feature. It blocks knowing whether to
build it this week or next month. That is §0's question.

The settings infrastructure is already there: `SETTINGS` in
`js/config.js:25-28` holds one key, `getSetting`/`setSetting` exist
(`js/storage.js:676-696`), and the toggle row is a shipped primitive. This
is the smallest well-specified unbuilt feature in the repository.

### 4.4 The risk: one browser now holds something irreplaceable

Backup exists and is good — export, import, non-destructive merge, tested
(`js/backup.js`, `js/backup-ui.js`). **Nothing in the app ever mentions
it.** It is a `Yedek al` button in Profil (`js/profile.js:187`), reachable
only by someone who went looking.

The threat model *inverts* for a daily user, and that is worth stating
because the existing analysis is about the opposite person:

- **WebKit's seven-day eviction stops being the threat.** The policy
  deletes script-written storage after seven days of browser use *without
  interaction on the origin* (confirmed still current; webkit.org and MDN
  reachable only as search summaries from here). A daily user resets that
  timer daily. The one scenario that has haunted this project's storage
  design does not apply to its principal user.
- **What replaces it:** a lost or replaced phone; clearing browsing data;
  opening the app in a different browser (`learner-model.md:1063` — "two
  devices are two learners"); and the iOS trap, where **Add to Home
  Screen moves the app into a separate storage container and destroys the
  progress on the way** (`onboarding.md:513-560`). That last one is a
  single tap, is the thing people do when they like an app, and it is
  silent.

A month of daily use is roughly **115 KB** of history at one 20-question
attempt a day (measured: 3,915 bytes per attempt against the real record
shape in `js/results.js:216`). Storage capacity is a non-issue. The value
of the thing is not.

**One nudge, at ~2 hours, is the highest value-per-hour item in this
document.** After some threshold of attempts, once, never inside a
session, never as a badge or a red dot: one line offering the backup. It
is not a re-engagement prompt — `user-flow.md:813` and
`practice-modes.md:1000` refuse those and are right — because it fires on
a fact about the data rather than on the learner's absence, and it can be
dismissed permanently.

### 4.5 The slow leak, recorded rather than fixed

Every render of the Test tab does **eleven full `JSON.parse` of the
history string**: `getMistakeBook()` twice (`js/home.js:77`, `:364`),
`getWeakCategories()` once via `getItemStats()`, and `getTopicAccuracy()`
once per topic row (`js/home.js:287`) — eight rows today, ten when the
vocabulary topics ship.

Measured on desktop Node against realistic records:

| History | Size | 11–12 parses |
| --- | --- | --- |
| 30 attempts (a month, one a day) | 115 KB | 7 ms |
| 90 attempts (a month, three a day) | 344 KB | 19 ms |
| 270 attempts | 1.0 MB | 56 ms |

A mid-range phone is roughly four to eight times slower. **This is not a
problem at a month and will be one at a year**, and it is worth knowing
now only so that nobody is surprised. The fix is a module-level cache of
the parsed history invalidated on write — about an hour — and it should
be done when the number is felt, not before. History has no cap and
should not acquire one: `learner-model.md` proposed 5,000 events, and
truncating a learner's history to save 20 ms is the wrong trade.

---

## 5 · Broader English, as an architecture problem

Everything is aligned to one paper: `exam-spec.md` is the source of
truth, `uncoveredSections()` in `js/topics.js:267-280` hardcodes that
paper's four sections and their point values, `renderCoverage()` in
`js/profile.js:293-325` renders a paragraph about *Session I* and
*Session II*, and the honesty criterion is defined as honesty about that
paper.

A general English app needs a different organising axis. Here are the
three candidates, what each costs against the code that exists, and —
the part that actually helps — which decisions being taken this week are
expensive to reverse.

### 5.1 The three candidate axes

**Axis A — CEFR level.** *Cheap in code, empty in content today.*

The hook already exists and nobody has noticed: every topic file carries
a **`level`** field, the validator requires it to be a non-empty string
(`tools/validate-content.mjs:664`, `:367`), and **nothing in `js/` reads
it**. All eight topics say `"B2-C1"`. So the axis is present, mandatory,
uncontrolled, and single-valued — which is the worst of all states,
because it looks like a working axis in the data and sorts nothing.

Making it real: a controlled vocabulary (the way `js/tiers.js` does it),
lifting it into the manifest through the formatter (which already
generates the lesson index), and a filter. **Half a day of code.** The
content cost is the whole cost: an axis with one value is not an axis, so
this only becomes real when there is A2/B1 content, which is a different
authoring programme.

**One distinction must be written down before anyone builds this**, or it
will be re-litigated: `onboarding.md:1096` refuses "a single proficiency
number — a CEFR band, a 'level', a percentage called your English", and
`onboarding.md:299` refuses "do not invent a level". Both refusals are
about a claim made **about the learner**. Labelling *content* by level is
not that claim, and the refusal does not reach it. Conflating the two
would block the only axis a general English app can plausibly use.

**Axis B — Skill (grammar / vocabulary / reading / listening / writing).**
*Cheap to declare, and mostly a promise the architecture cannot keep.*

Another manifest field, another closed list, an hour. But the app's whole
model is "an item is four options and one key", and three of the five
skills do not fit it: reading needs the passage unit (a week of code),
listening needs audio and a hosting decision, writing needs a marker and
is refused. A skill axis today would render four labels, two of which
lead nowhere. It is the axis that most looks like a general English app
and least is one.

`js/tiers.js:6-20` is already a half-hearted version of this — its five
values mix difficulty (`foundations`, `advanced`) with skill
(`vocabulary`) — and it is honestly documented as "purely a display
grouping". If a skill axis is ever wanted, it should replace that
confusion rather than sit beside it.

**Axis C — Multiple exams.** *Explicitly refused, and the refusal is
still right — but one thing under it has to move.*

`exam-vocabulary.md:793-801` refuses "a 'Bilkent mode', a per-university
content fork, or two manifests", on the ground that the words, the item
and the band are the same across YTÜ and Bilkent, and that only **three
facts** differ: option count (4 vs 5), negative marking (none vs ¼), and
section weight. "A fork doubles the review debt, and review debt is the
thing this project is measurably worst at."

Nothing has changed about the content. **One thing has changed about the
app**: since that refusal, the coverage claim became a rendered feature
(`js/profile.js:293`), and it is hardcoded to one paper in JavaScript. The
Bilkent user is currently shown a paragraph about *Session I*, *Session
II* and a 24-item restatement topic that, on the evidence available, does
not appear on his paper at all (`exam-vocabulary.md:240-244`).

So the honest revision is not a fork. It is: **the coverage claim is
data, not code.** Move the section list and point values out of
`uncoveredSections()` into a small file beside `data/roadmap.json` — the
one precedent in the repo for editorial data that is not content — and
the app can state a different paper's coverage without a second corpus, a
second manifest, or a single new item. **About two hours.** That is the
cheap version of Axis C and it is the only version I would build.

### 5.2 The decisions being taken now that are expensive to reverse

This is the part that matters, and it is short.

**1 · Category names are identity, and every day of use makes a rename
dearer.** `lessonId(topicId, category)` derives a lesson id by slugging
the category string (`js/topics.js:134-140`); lesson progress is stored
against that id; and history stores the category as a **string** on every
answered question (`js/results.js:224-228`), which is what
`weakestEntries` groups on (`js/storage.js:359-390`). `CLAUDE.md` already
records the first half of this ("renaming a category renames the lesson
and resets progress"). **The second half is not written down anywhere: a
rename also orphans every past answer in that category from the weak-spot
ranking.** Today that costs nothing. After a month of daily use it costs
the owner his own diagnosis.

> **This is the single most time-sensitive architectural decision in the
> repository.** A broader-English restructure will want to rename
> categories. If any taxonomy change is coming, it is cheapest today and
> gets monotonically dearer from tomorrow. The taxonomy was fixed once
> before for exactly this reason (`v1-plan.md`, *Taxonomy: fix now* —
> "cheaper now than at any later point, with six users"), and the same
> argument now applies to one user with real data.

**2 · The question `type` discriminator is additive, and that is the
cheap-either-way one.** `QUESTION_TYPE` (`js/topics.js:72-77`),
`QUESTION_TYPES` in the validator (`tools/validate-content.mjs:57`), and
`renderPrompt`'s instruction map (`js/prompt.js:15-17`) are all
open-for-extension with `cloze` as the default for anything authored
before a type existed. Adding `paragraph-completion`, `synonym` or
anything else touches no existing item. Nothing needs deciding here; it
was designed correctly and should be left alone.

**3 · The passage schema's marked span — free to decide now, expensive to
retrofit.** `vocabulary.md:900` asks for one requirement to be put on the
reading schema *before* it is written: a paragraph must be able to carry
a **marked span**, not merely be addressable by a Roman numeral, because
vocabulary-in-context and reference items point at a word inside a
paragraph. It costs nothing to write into the schema now and means
re-authoring every passage later. **It is still undecided.** Record it in
`docs/CONTENT_GUIDE.md` when the passage type is specified, not after.

**4 · The Turkish bet is the most expensive reversal in the repository
and nobody has costed it.** Every UI string, explanation, tip and lesson
block is Turkish, and the lessons are not merely written *in* Turkish —
they are written *for a Turkish L1*, as contrastive teaching against
predictable transfer errors (`learning-design.md:310-376`). Reversing it
is 48 lessons and 193 explanations and tips re-authored, not translated.

**So "broader English" has two readings and they are different products:**

- *Broader content for Turkish speakers* — general B1/C1 English, still
  Turkish-explained, still one learner population. **Additive.** New
  topics, a real `level` axis, nothing existing rewritten.
- *An English app for anyone* — a language change, an audience change,
  and a rewrite of the entire corpus.

**One sentence from the owner settles which, and it changes every
estimate in this section.** Nothing else in §5 should be built before
that sentence exists, because the first reading costs half a day of code
and the second is a new project.

**5 · What is cheap either way, and can be ignored:** the tier list
(`js/tiers.js` — one line to extend, validated in one place), the backup
format (`BACKUP_VERSION = 1` already exists in `js/backup.js:19`), the
module graph (`architecture-and-scale.md:122` — leave it alone), the
manifest's per-topic shape (the formatter generates the derived fields,
so adding one is a generator change plus a validator rule), and
localStorage capacity (measured: a month is 115 KB against a budget in
megabytes).

---

## 6 · The staged plan

Ranked within each horizon. Hours are supervisor hours — the thing this
project is actually short of — not agent time.

### Horizon 1 · This week, because he is using it (target: ≤ 1 day of work)

| # | Work | Hours | Why now |
| --- | --- | --- | --- |
| 1 | **Answer §0: when is the exam?** | 0 | It decides horizons 1 and 2 entirely, and it has been open since 2026-09-03 across three documents |
| 2 | **A backup nudge** | ~2 | §4.4. From tomorrow one browser holds something irreplaceable and nothing in the app has ever said the word "yedek" outside Profil |
| 3 | **Fix `roadmap.md:40`**: seven of ten blanks, not eight | ~0.2 | §1.1. It is the document the next session costs work from |

**Explicitly not this week:** any feature, any schema work, any new
content. If the exam is on 9 September, item 2 is the only build item and
the rest of the week is `the-last-week.md` §4 — a study plan, in a
message, not in the app.

### Horizon 2 · The month to the exam (target: ~30 hours)

Assumes the exam is *not* five days away. If it is, everything here moves
to horizon 3 unchanged.

| # | Work | Hours | Why here |
| --- | --- | --- | --- |
| 1 | **Ship the two vocabulary topics** — both review passes, then serve | **~18** | The only thing that changes what he practises this month. 193 → 241, and it buys three more days before the bank is empty (§4.1). It is also 40% of a project already paid for |
| 2 | **`so / such`** | ~4 | Closes the last uncovered cloze blank type. One category, folded into an existing topic |
| 3 | **`Sınav haftası`, the one bit** | ~8 | §4.3. Fully specified, unbuilt, and its whole value window is this month |
| 4 | **"Bugün pratik"** — category-level, from data that exists | ~4 | §3.1. The one unblocked deferred feature, and it exists for exactly this user |
| 5 | **The timed, feedback-deferred block** on restatement | ~8 | §3. Unblocked since `closest-meaning` shipped. A 10-item timed restatement run rehearses a real 15-point section |
| 6 | **5–6 reading-skill lessons, no passages** | ~6 | §1.4. Cheapest points-per-hour against the 21 uncovered points, no code, not single-use |
| 7 | **4 → 6 items in the categories his own data flags** | ~4 | §4.2. After two weeks of daily use he *is* the ranking. First confident weakness claim the app has ever been able to make |

Items 1–2 are content and items 3–6 are code; they do not compete for the
same evening, which is the only reason this list is not shorter.

**Explicitly not in horizon 2:** the paragraph-completion schema (it is a
day of code plus an unmeasured content bill, and it should not be started
in the month before the exam it is meant to prepare for); reading
passages; the error-tracking screen; `optionNotes` content (579 notes);
any work on the broader-English axes.

### Horizon 3 · After the exam

| # | Work | Hours | Note |
| --- | --- | --- | --- |
| 1 | **Settle criterion 2's tense** (§1.2) | 0 | One word. It is worth 22 hours either way |
| 2 | **Paragraph completion: schema, then a measured round of four items** | ~8 + ~3 | Take the number instead of arguing about it (§1.3). Then decide whether 24 items is 12 hours or 48 |
| 3 | **Coverage claim as data, not code** (§5.1, Axis C) | ~2 | Makes the app honest for the Bilkent user without a fork, and is the only multi-exam work I would do |
| 4 | **The error-tracking screen, scoped as a log** | ~8 | §3.2. Honest at any sample size if it records rather than infers |
| 5 | **The rest of paragraph completion** | 12–48 | 9 points, and v1 closes with it |
| 6 | **The `level` axis, if and only if the owner's sentence in §5.2 says "broader content for Turkish speakers"** | ~4 code | Then a content programme, which is the real cost |
| 7 | **Reading, as ongoing supply** | 2–3.5 h per passage, forever | One or two a month. Never as a project with an end |

**What I would not do at all, at any horizon:** listening (§2), writing,
a second corpus for Bilkent, `optionNotes` against the grammar corpus,
and any of the three gated modes in §3 until the per-category number
moves — which it will not, because every additional item is worth more
spent closing a section than deepening a category that already teaches.

---

## What I would refuse

**Reporting the 9 September date as a fact.** §0. It is a search-index
summary of a page this environment cannot reach, its top-ranked source
URL carries `2025` in the slug, and one of its numbers contradicts the
only primary source this project owns. It is a question for the owner,
worth a minute, and it should not appear in `exam-spec.md` until a PDF
says so — the same standard `exam-vocabulary.md:807` set when it refused
to rewrite the spec from prep-school pages.

**A stored exam date, or any countdown.** Upheld from
`the-last-week.md:783` without modification, and I want to be explicit
that the possibility of the exam being five days away does not weaken it
— it is the exact condition under which a ticking number does the most
damage. The one bit (§4.3) buys everything the advice needs.

**Reading passages inside v1.** Upheld from `roadmap.md:156-161`, and
strengthened rather than weakened by daily use (§1.4): a single-use
content type is the worst possible answer to pool exhaustion, and the
supervisor is now also the user, so reviewing a passage spends it.

**A per-exam content fork, a "Bilkent modu", or a second manifest.**
Upheld from `exam-vocabulary.md:793`. The only thing that moves is the
coverage sentence, and it moves into `data/`, not into a branch.

**Five-option items or negative marking, for anyone.** Upheld from
`exam-vocabulary.md:802`: 241 existing items each needing a fifth option
authored to fill a slot, which is the dead distractor
`question-author.md` rule 4 exists to refuse, arriving 241 times.

**A CEFR band, level, or proficiency number shown as a fact about the
learner.** Upheld from `onboarding.md:1096` — and §5.1 draws the line the
refusal did not need to draw before: labelling *content* by level is not
this, and a future session should not read the refusal as blocking the
only axis a general English app can use.

**Item-level scheduling, adaptive difficulty, mastery levels, FSRS, BKT.**
Upheld from `learner-model.md:1187` and `practice-modes.md:881`. All of
them are gated on per-category item counts and none of the gates moved
when the corpus grew 2.7× (§3). Nothing in daily use changes this: §4.2
shows the app counts distinct items, not answers, on purpose.

**Any re-engagement prompt** — a streak, a daily goal, a "you have not
studied today", a badge on the mistake book, a push notification. Upheld
from `practice-modes.md:903` and `the-last-week.md:790`. The backup nudge
in §4.4 is not one of these and the distinction should survive review: it
fires on a property of the stored data, appears once, is permanently
dismissible, and does not report on the learner's behaviour.

**Truncating history to make the Test tab render faster.** §4.5. The
measurement says a month costs 7 ms and a year costs tens; the fix is a
parse cache, not a cap. A learner's own record is the one thing in this
app that cannot be regenerated.

**Starting the broader-English restructure now.** Not a refusal of the
goal — a refusal of doing it before the one sentence in §5.2 exists.
Additive general content and a rewritten corpus are different products,
they cost two orders of magnitude apart, and every hour spent guessing
which is meant is an hour taken from the exam the owner sits.

**Writing new questions in the week before the exam**, if the exam turns
out to be near. Upheld verbatim from `the-last-week.md:825`. Ship what is
reviewed; write the rest afterwards.

**Automating the review passes.** Upheld from
`content-pipeline.md:1655`. Three rounds by hand first; the pipeline has
had five and they were five different processes.

**And one refusal that is mine rather than inherited: costing paragraph
completion at two hours an item without measuring it.** `roadmap.md:117`'s
number is four to six times the rate this project measured for a *harder*
item type. Planning 24 items against it makes a 12-hour job look like a
48-hour one, which is exactly how a section gets deferred forever. Write
four, time the round, then plan.

---

## Open questions for the owner

Ordered by what they unblock.

1. **When is the exam?** (§0) It is the only input that changes the shape
   of horizons 1 and 2, it has been open across three documents since
   2026-09-03, and there is now a specific date to confirm or deny.
2. **"Broader English" — for Turkish speakers, or for anyone?** (§5.2)
   One sentence. The first is additive and cheap; the second is a new
   product, and the corpus is 48 Turkish-authored lessons deep.
3. **Is a taxonomy change coming?** (§5.2) If any category is going to be
   renamed for the broader-English restructure, it is cheapest before
   tomorrow and monotonically dearer after.
4. **Which reading of criterion 2 is v1?** (§1.2) One word, worth 22
   hours.
5. **May the app nudge about backup?** (§4.4) It is the one place I am
   proposing something adjacent to a refused pattern, and the owner has
   twice been right about what belongs on a screen.
6. **Does the Bilkent friend sit PAE Stage 1 or Stage 2?**
   (`exam-vocabulary.md:849`, still unanswered.) Stage 1 is 200
   grammar-and-vocabulary items with five options and a guessing penalty;
   Stage 2's vocabulary is 20 items in two texts. Only the second is this
   app's shape, and the coverage sentence in §5.1 cannot be written
   honestly without knowing which.
