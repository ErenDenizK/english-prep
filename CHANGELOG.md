# Changelog

Versioning: `x.y`, `x` fixed at `0` while the app is in development — see
the README's **Versioning** section for the exact rule (only the project
owner bumps `x`; everything below is a `0.y` development build, not a
release).

## v0.23 — 2026-09-04

**"Başla" now starts at the beginning.** The welcome card's one action
opened `Present Simple vs Present Continuous` — the first lesson of the
first topic — which is the complaint this whole round began with: every
lesson in this app is a contrast, so dropping a learner into one before
they have the category drops them into an argument about a word they have
not met. It opens **Tense nedir?** now, and that screen hands them on to
the lessons.

Two of the three things asked for turned out already to be true, and
saying so is worth more than building them again. A brand-new learner
already sees **all eight topics, each with a one-line Turkish
description**, on the first screen — that is what the index became when
it stopped being 48 lesson rows. A separate "here is what you will learn"
flow would re-show what is already on screen, which is the tour this
project refused on evidence.

107 unit tests, 1156 verification checks.

## v0.22 — 2026-09-04

**The Eğitim index is eight topic rows instead of forty-eight lesson
rows. 5,332px → 1,116px, 8.3 screens → 1.7.**

A learner reported that the topics pile up. He was right, and the number
is worse than it sounds: the index was two and a half times the
next-longest screen and grew with the content — 60 rows once the
vocabulary topics ship. The flat list was a deliberate decision, recorded
in `docs/education-notes.md` as the index "going flat" rather than
gaining a topic level, and it outgrew itself.

The destination already existed. `#egitim/konu/<topicId>` renders a
topic's orientation *and* its six lesson rows, so the lessons simply live
one level down, on the screen that already explained them. No schema
change, no storage change, no new primitive, and the card and all six
index states are untouched.

**768 of those pixels were mine, and the reason is worth writing down.**
v0.21 put a one-line gloss and a "Bu konu nedir?" button under each topic
heading. I chose the quiet button over a `Genel bakış` row *because* a row
would have cost 520–650px. Measured: gloss 32px + button 48px + two 8px
gaps = 96px × 8 topics = **exactly 768px**. The cheaper option was the
more expensive one, and I shipped it without measuring.

**So the sweep now measures height.** It audited horizontal overflow on
every screen and passed 1,051 checks while the index grew by 768px, which
is how the pile-up came to be found by a friend using the app instead of
by the build. Budgets are opt-in per screen: three screens for a list a
learner scans on the way somewhere, four for the topic screen, none for a
lesson or the results review, which are long because the learner chose to
read them. The first version of that check applied one budget everywhere
and immediately fired on all three — a check that fires on correct
content is one nobody finishes reading.

**What this costs, and what pays it back.** The learner who knew exactly
which lesson he wanted went from one tap to three. So the index has a
filter: two letters put the lesson rows back and the topic level
disappears. Turkish folding is not `toLowerCase()`, which is wrong here
and wrong only in Turkish — `I`/`ı` and `İ`/`i` are different pairs — so
`ilgi` and `İLGİ` find the same two lessons, and `gecmis` finds `geçmiş`
for a phone keyboard set to English.

**The topic screen now routes.** It ended in lesson rows and offered only
a way backwards, which routes nobody; it has a primary action opening the
first lesson of that topic the learner has not finished. Its journey is
in the sweep: index → topic → lesson.

**The pretest's rationale moved below its question.** Three sentences of
explanation pushed the first tappable option below the fold at 320, on
the very first interaction the app asks for, from someone who has not yet
decided it is worth the trouble.

`npm run audit` is new: it measures each screen against §7 rather than
reading the stylesheet and guessing. Its own first pass was wrong —
localStorage survived between screens, so it reported the mistake book on
a store that had never been used.

107 unit tests, 1159 verification checks.

## v0.21 — 2026-09-04

**Every topic now says what it is**, before any of its lessons offers to
distinguish three things inside it.

The owner's report was that the lessons are good but suffocating for a
first arrival, because they go straight at the important headings. He was
right on the facts: all 48 lessons across 8 topics are contrasts, and
nothing anywhere said what a relative clause *is*. The index offered
`Relative Clauses` and then, one line down, `Who vs Whom vs Whose`.

Two things ship, and they are the same content at two lengths. Under each
topic heading on the Eğitim index there is now **one Turkish line**; under
that, a **"Bu konu nedir?"** button opening a real screen at
`#egitim/konu/<topicId>` — what the thing is in function terms with a
Turkish example the learner already produces, its parts named, the choice
English makes that Turkish does not, what the six lessons divide between
them, and what the exam does with it. Then the topic's own lesson rows,
so it is a topic page rather than a leaflet.

**It is a screen you choose to open, and that is the whole design.** The
expertise-reversal literature decides it: across 60 studies and 5,924
participants, the same support that helped novices (+0.505) measurably
*hurt* people who already had the schema (−0.428). The effect is
asymmetrical, so one screen a learner can ignore is licensed and 48
unavoidable paragraphs are not. Someone who knows what a relative clause
is never sees this and pays nothing for its existence.

**Its shape is evidence too.** The parts list is the part that earns the
page: Mayer's pre-training principle — the strongest result in that
literature, median d = 0.92 — is about knowing the *names and
characteristics* of the main concepts, which in the experiments is a
parts list rather than prose. Pulling the other way, the coherence
principle found added interesting-but-inessential material hurting
learning across 50 studies, so the validator caps the Turkish and
everything except the parts is one or two sentences.

**Typed fields, not one prose blob**, because English has to sit in its
own field to carry `lang="en"` — a Turkish prose field cannot, and
`text-transform: uppercase` would turn SIMPLE into SİMPLE.

**A new check caught something on its first run.** An orientation must
not print a phrase that appears in one of its own questions — it sits one
screen above them, so a collision there is worse than one in a lesson.
The `passive-voice` intro listed `has been` among the auxiliaries, and
`has been` is an option in `passive-voice-t4`. The research arm had
predicted exactly that failure, because an orientation is written last
and about the same material.

**Honest about what this does not fix.** The owner expected it to improve
onboarding. Measured, it mostly does not: the first-run screen is a 384px
welcome card and one button, and the suffocation is at the *second*
screen — a 5,807px lesson. This helps re-entry and navigation, and the
lesson-level fix is a separate job.

**The intros have not had a content review.** They have a schema check, a
giveaway check and 1,128 browser checks; nobody independent has read them
for whether the teaching is true. That is the same gap the two review
passes close for lessons and items, and it is open.

107 unit tests, 1128 verification checks.

## v0.20 — 2026-09-04

**The app now says what is built and what is coming**, in Profil, as a
section rather than a banner.

There was a banner. It sat above every screen, it was the first thing a
stranger read, it cost 48px of the 320px fold on every single arrival,
and what it said — "geliştirme aşamasındayız, yeni konular ekleniyor" —
is not something a learner can do anything with. It is retired.

What replaces it is in two halves, and they are deliberately different
kinds of thing. What **exists** is counted from the manifest — "Şu an 8
konu, 48 ders, 193 soru" — so shipping a topic updates it and nothing has
to remember to. What is **coming** is a short editorial list in
`data/roadmap.json`, three states (Bitti / Sırada / Planlandı) and no
dates: this app has no schedule to promise and would not keep one. The
rows are not tappable, because a roadmap row that looked like a control
would be promising a screen that does not exist.

It went in Profil because Profil is already the honest-metadata screen —
which part of the exam this covers, how the content was written, where
the data lives. A roadmap is the same species of fact, it is not a
content mode, and the navigation stays two destinations.

The banner's one useful sentence survives on the first-run card, where a
learner meets it once before they judge the app, and nowhere else. The
`.note` primitive it was the only user of is gone from the stylesheet and
from the design system's inventory: an unused primitive that was not even
on the components page is dead code, not a spare part.

107 unit tests, 1073 verification checks.

## v0.19 — 2026-09-04

**The user flow, all nine recommendations.** `docs/research/user-flow.md`
walked five journeys end to end and ranked what it found; this is the
whole list, and the two decisions it left open.

**Leaving a test no longer costs you the test.** `Çık` was a link, so five
answered questions went with one tap and nothing was written down — the
learner landed on the screen a brand-new learner sees, because from
storage's point of view they were one. It then became a link plus a
confirmation dialog, which was wrong in the same way: a dialog makes the
loss loud instead of making it not a loss. Five answered questions are a
five-question test, so the control now reads **Bitir**, records what was
answered and shows the score. Questions never reached are not scored as
wrong. The dialog is gone.

**One card at the top of Eğitim, always.** There were three mutually
exclusive branches and a bare progress line for everyone who fell through
— which was most returners, and which is how a learner with real test
history came to land on a bar reading `18 dersten 0 tanesi tamamlandı`.
Six states now, one surface, one primary action each: the welcome card, a
next-step card that points at the lesson for the category you have got
most wrong, the resume card, the re-entry card (now with a way forward for
someone who finishes what they start), and an end state for a learner who
has read everything — which used to be a dead end with nothing offered but
a replay.

**That end state does not say you are ready**, because the bank is a
fraction of the paper. It names which sections are missing instead, read
from the manifest: the day `closest-meaning` shipped, every sentence
naming it as missing became a lie about the app the learner was holding.
Profil's coverage paragraph now reads the same single answer.

**Numbers that meant nothing.** `Yeni` marked every topic on a store that
had never seen any of them, and the first mixed test then consumed all
of them at once — the badge is a comparison, and a learner with no
baseline has nothing to compare to. The baseline is now set where the
questions were actually delivered, not where the test was launched. The
results breakdown applied no evidence threshold at all, so a ten-question
test produced nine rows sorted worst-first, most of them `0/1`: the rows
stay, the claim goes. And Profil's headline percentage was windowed while
the topic percentage was a lifetime average — two bare percentages, one
screen apart, answering different questions. Both are now "lately".

**Lesson progress records when it happened.** A learner who reads and
never tests had no timestamp anywhere, so the app could never notice they
had been away — which is exactly the learner most likely to have been.
One field, absent on old records, and absence stays "unknown" rather than
becoming a date that never happened.

**One filled button per screen** on the Test tab: when the mistake book
has questions in it, it is the better mode and it takes the filled
button. Three card bodies cut to one sentence. The third mode is still
below the fold at 320×640 and copy cannot fix that; saying so is better
than claiming the trim solved it.

107 unit tests, 1051 verification checks.

## v0.18 — 2026-09-04

**Grammar is finished.** Five topics shipped together — `closest-meaning`,
`connectors`, `quantifiers`, `relative-clauses`, `gerunds-infinitives` —
taking the app from 3 topics, 73 questions and 18 lessons to **8 topics,
193 questions and 48 lessons**.

They shipped as one queue rather than one at a time because they were
commissioned as one: the exam spec's blank-by-blank breakdown of the
sample cloze says the paper rewards discourse markers, modals, causatives,
relative pronouns, quantifiers and vocabulary, and **not one of its ten
blanks tests a tense or the passive** — which is what the app shipped
first. Eight of the ten blank types are now practisable. The remaining two
are vocabulary, drafted and queued; `so / such` is covered by nothing.

**Closest meaning is live**, which is fifteen of Session I's sixty points
the app previously had a schema for and no content behind.

What the reviews cost, recorded because it is the whole argument for
having them: across the five topics the two passes found roughly one item
with two defensible answers per twelve written, and roughly one untrue
claim about English per lesson. Neither is visible to `npm run check`.
Five of the repairs **introduced a new defect while fixing another**, and
every one of those was caught only by an independent re-audit — among them
a rule reported deleted that was still in the file, an example lifted from
a live item one rule below the one just de-quoted, and an unguarded string
test that rejected a key and pointed at its distractor. A repair is not a
fix until someone who did not write it has re-read it.

One number carried forward rather than solved: in 8 of the 24
`gerunds-infinitives` items the key is the only grammatical option, so a
student who knows nothing but *which of these is real English* scores a
third without reading the paragraph. It survives shuffling. It is an
argument for a sixth item per category, not a blocker.

101 unit tests, 1018 verification checks.

## v0.17 — 2026-09-04

**Yanlış defteri.** The mode the practice-modes research ranked first on
value per unit of work and called *"the mode I would ship if I could only
ship one"*. It needed no new content and no new data: the app has
recorded which questions you got wrong, in every attempt, since the
beginning — so every learner's book already has its contents.

The graduation rule is the design, and it is deliberately strict. An item
enters the moment you get it wrong and leaves only after **two correct
answers on two separate days**. Answering again ten seconds after reading
the explanation proves the explanation was on screen; a second one the
next day is the first evidence of anything durable. Get it wrong again
and the count starts over.

The empty state is not a congratulation. An empty book in a 73-question
app means you have cleared your mistakes, not that you know the
questions, and the card says exactly that. Before you have taken a test
the card does not appear at all.

**The mixed test now says why it is the better mode**, not the faster
one. Interleaving is the practice format with the cleanest classroom
trial behind it, and the reason belongs to the learner: when the topic is
not announced, choosing the rule becomes part of the question, exactly as
it is on the paper. That one line was the difference between a shuffle
and a method.

**Taxonomy.** Three category names did not contain a form that was the
keyed answer of one of their own questions, and one question sat in the
wrong category. All four fixed, with the owner's decision, accepting that
progress for those lessons starts over. `tenses-t25` is new, written to
fill a hole the review had recorded: nothing in the corpus keyed `gone`.

**Restatement items** — the exam's "closest meaning", fifteen of Session
I's sixty points — now have a schema, a validator branch, a shared prompt
component and an option row that aligns to its first line, because four
whole sentences at 320px wrap to four lines and a vertically centred "2"
floats beside nothing. The content for it is written and reviewed but
**held**: see `docs/agents/drafts/closest-meaning/`.

89 unit tests, 455 verification checks.

## v0.16 — 2026-09-03

**Every wrong answer now tells you why what you chose was wrong.**

The v0.15 review found that two thirds of the explanations argued only
for the key. That is the exact moment an explanation exists for: a
learner who picked a distractor was told what was right and never told
what was wrong with their own reasoning. Forty-six of the 72 have been
rewritten to name the closest wrong option in its own words and say what
it would have meant in that paragraph — quoting the phrase that rules it
out, where there is one.

`npm run validate` now reports **zero warnings** for the first time.

Six tips were rewritten as well, all of them for the same reason: they
stated as absolutes rules the lessons themselves disown. "'Since' is
always used with the Present Perfect" was false and the app contained its
own counterexample — `tenses-t12` is keyed against it, and *since* also
means *because*. A tip is meant to be carried to other questions, so an
absolute in one has to actually hold.

Also:

- The validator warns on an explanation over 600 characters. The corpus
  averages 362; past 600 it stops being an explanation and becomes the
  lesson again, in the one place a learner is least willing to read it.

### The rewrites were checked, and twelve of them were wrong

An independent pass fact-checked all 46, and found 34 clean. It found no
explanation arguing against an option that was not on its own list, and
none whose reasoning led anywhere but the key — but it found **twelve
statements about English that are not true**, almost all of the same
shape: a correct local argument closed off with an absolute wider than
the fact supporting it.

Two were serious enough to mislead. A tip said `should have` "does not
express inference" — but *the parcel should have arrived by now* is
ordinary English. And `passive-voice-t13` claimed that "in English only
*have* and *get* carry causative meaning", which is false, and which
contradicted the same explanation's own sentence about `make`. What is
true, and what it says now, is narrower: only `have` and `get` take the
*object + past participle* pattern.

The rest were the same failure at lower stakes: *yet* declared to occur
"only" in questions and negatives (*we have yet to hear back*), `for`
described as marking a period that is still open (it marks duration —
*he lived there for five years* is finished, which is the very point the
Present Perfect lesson makes), Past Perfect said to require a second past
event after it. All twelve are corrected.

This is the third time in two releases that a review has caught the
thing written an hour earlier. The rule that produced it is worth
stating plainly: **nothing this project publishes is certified by
whoever wrote it.**

## v0.15 — 2026-09-03

Stage 1 of `docs/v1-plan.md`: the content pipeline, proved on the 72
questions we have before it is aimed at 900. Six reviewers, none of whom
saw another's output. The report is `docs/content-review.md`.

### The three results

**Nothing is miskeyed.** Two blind passes, different option orders, no
answer key, 72 items each: 144 of 144 answers matched. Every defect below
is about what an item *measures*, not whether it is right — which is what
makes the corpus worth repairing rather than replacing.

**No lesson is insufficient. Every lesson teaches more than its questions
test.** All eighteen pass on "does the lesson contain what its questions
need"; about twenty caveats are warned about and never sprung. The
*Present Perfect vs Past Simple* lesson devotes a whole block to `for`
appearing on both sides, and the word does not occur in any of its four
questions. This is the opposite of the failure the pass was written to
find.

**Questions were built on their own lessons' example sentences** — 20 of
24 keys in one topic, most verbatim. Because `check` blocks are filled
from the questions sharing a lesson's category, the learner met the
answer sentence a few blocks above the question that asked it. Nobody
costed that coupling when `check` was designed.

### Sixteen items have a second defensible answer

Ten were named by both blind passes independently. They cluster into
near-synonym modals (`should` against `ought to`), future-form preference
(`leaves` against `is leaving`), and agent omission as a style judgement.
`modals-t17` was a coin-flip for both readers.

### What changed in the app

- **"Bu soruda bir sorun var"** on every answer. There is no backend to
  post it to and it does not need one: the app is distributed by pasting
  a URL into a group chat, so the report goes back the same way — share
  sheet first, clipboard second. Six friends sitting the real exam are
  the only pretest panel this project can have, and until now there was
  nowhere for them to say a question was wrong.
- **Profil says where the content comes from**: written by a language
  model, reviewed against a written brief, and still capable of being
  wrong. Somebody studying for an exam that decides their year is
  entitled to know that before they trust a question.
- **Four content checks in `npm run validate`** that the schema validator
  could not make — the explanation must name a distractor, banned option
  forms, corpus-wide near-duplicate stems, scenario over-use. Three of
  the four can only be answered by reading every question at once. The
  first found that two thirds of the explanations never mention a wrong
  option; the second failed immediately on shipped content, because
  `tenses-t15` offered `leaved`, which is not a word.

### Seven questions rewritten, three rewrites rejected

Every rewrite went back through a blind pass, because an author does not
certify their own work. `modals-t17` was rejected twice — the first fix
traded one defensible-second-answer for another — and passed on the
third. `tenses-t20` was reverted to its original after the rewrite made
it worse. `passive-voice-t15` was rejected three times and is on the
register: the reviewer's diagnosis is that its causative structure is
handed to the learner in the stem, which is a redesign rather than an
option swap.

### And the method's own limitation

A reviewer dismissed `had better to` as an option "no B2 learner would
weigh". It is the error Turkish speakers make, the lesson is built on it,
and all three of that lesson's pitfalls use it. A fluent reviewer's "no
learner would consider this" is a judgement about the reviewer;
`docs/agents/reviewer.md` now says so.

### Also

- `docs/agents/reviewer.md`, `calibration.md`, `category-spec.md` and one
  worked spec — the pipeline's own documents.
- Five rules added to `docs/agents/question-author.md`, each naming a
  defect that reached shipped content.
- `this week` removed from the passive lesson's signal chips: it was a
  Present Continuous Passive trigger in one lesson and part of the
  Present Perfect condition in another, and `passive-voice-t4` is keyed
  against the first, so a learner who studied the other lesson was marked
  wrong.
- A bug the report button exposed: the quiz's global `Enter` handler
  advanced the question whenever focus was not in the action bar, so
  pressing Enter on any control inside the page fired twice. Reporting a
  question skipped the next one. The guard now asks whether the target is
  a control `Enter` already activates.
- 75 unit tests, 429 verification checks.

## v0.14 — 2026-09-03

The research round, and everything in it that could be built the same day.

Six arms researched independently — the exam itself, learning design, the
learner model, practice modes, onboarding, and the content pipeline — plus
a seventh of direct measurement. They are in `docs/research/`, the
decisions are in `docs/v1-plan.md`, and this release is that plan's
stage 0: the things that were verifiably broken and needed nobody's
permission.

### What the round found

**The app was preparing for the wrong shape of exam.** The owner then
supplied YTÜ SFL's own sample papers, and `docs/exam-spec.md` is written
from them. Session I is 40 questions at 1.5 points: a ten-blank cloze
passage, ten restatements, two reading texts of seven, six paragraph
completions. There is no discrete grammar section anywhere on it — and of
the ten cloze blanks, **not one tests a tense or the passive.** Two test
modals; the rest are discourse markers, relative pronouns, quantifiers,
comparatives, `so/such` and causatives. The app covers about 7% of the
marks, and its three topics are the wrong three.

**Four questions per category is the binding constraint on everything
else**, and no amount of modelling escapes it. **Review throughput, not
generation, is the content bottleneck** — and the one controlled
comparison found reviewers gave AI drafts measurably less engagement than
their own, so a review stage that consists of reading and nodding is a
negative control rather than a weak one.

### The learner's data stops quietly disappearing

WebKit deletes script-written storage after seven days of browser use
without an interaction on the origin, so on iOS Safari "I came back after
a couple of weeks" already meant "my progress is gone".

- **Backup and restore**, with a merge that cannot lose anything: attempts
  are identified by the moment they were recorded, so restoring the same
  file twice is a no-op; lesson progress takes the further of the two and
  "done" is sticky. Restoring is two steps — choose, read what it would
  do, then commit — and the sentence afterwards is written to be true when
  nothing happened.
- **Pasting is a first-class path.** The share sheet and the download
  behave differently on every platform; a textarea depends on nothing.
- **`navigator.storage.persist()`** at boot, and one honest sentence in
  Profil about where the data lives.
- **No install advice anywhere**, deliberately: on iOS a home-screen web
  app gets a *separate* storage container, so telling someone to install
  is telling them to leave their progress behind. Backup had to ship
  first.

### The app stops re-asking what the learner already knows

`buildQuizSession` was `shuffle(pool).slice(0, n)` and had no imports at
all, so the per-question history recorded since the first commit never
decided anything. Three of the six arms put this first, independently.

Questions are now drawn worst-known first — never answered, then answered
wrong last time, then oldest. Selection is principled and presentation is
not: the chosen questions are shuffled again, so a session never feels
like it is working down a list.

### The statistics start meaning something

The number driving all three places the app tells a learner what is wrong
with them summed every answer ever given and called anything short of
perfect a weakness — which labelled a learner answering at random as weak
in essentially everything. Now: one observation per distinct question, and
the one that counts is the most recent answer to it.

The headline accuracy is windowed to the last forty answers for the same
reason. A lifetime average stops responding long before the learner stops
improving, and falls when they attempt something hard.

And the screens stop making claims the evidence cannot carry. Two wrong
out of four is consistent with someone who knows 80% of the material
having a bad afternoon, so the *ranking* stands on its own while the
*assertion* is gated on a Wilson bound. "En çok zorlandıkların" is
something the app knows; "you don't know this" is not.

### The home screen stops downloading the question bank

It was fetching all three topic files — 141.4 KB, questions and all — to
render a list of eighteen lesson names, 1.7 KB of information. A lesson
index generated into the manifest by the formatter, and checked by the
validator so it cannot drift, took opening the app from **328.8 KB and
1,034 ms to 221.0 KB and 647 ms**. Four screens stopped fetching topic
files; only the reader and the quiz still do.

The reason to do it now is scale rather than speed: the cost was linear in
content, and at the question count the exam work implies this screen would
have pulled 1.38 MB.

### Smaller, and worth having

- **A real icon and a link preview.** The app is shared by pasting a URL
  into a group chat and that preview was blank; Add to Home Screen
  produced a screenshot of the page. Both are generated from the design
  tokens and `js/icons.js` by `npm run icons`, so they can be changed.
- **"Önce kendin düşün"** — an opt-in setting that hides the answer
  options until the learner says they have an answer, turning recognition
  into retrieval. Zero content cost.
- `npm run verify` is now 416 checks and covers the backup round-trip
  across two browser contexts, because that is the one operation in the
  app that could destroy something a learner cannot get back.

## v0.13 — 2026-09-03

Stages 3 and 4 of `docs/redesign-plan.md`, and the answer to the owner's
verdict on the article lessons: *"makale tipini genel olarak beğenmedim."*
A lesson is no longer an article, and no longer a slideshow either.

### A lesson is a page you scroll, built from typed blocks

- **Seven block types** — `text`, `contrast`, `forms`, `examples`,
  `pitfall`, `decision`, `check` — replace the named prose sections
  (`intro`, `form`, `meaning`, `usage`, `commonMistakes`, `recap`). The
  old fields buried the parts that actually win exam marks: `meaning` was
  a contrast written as a paragraph, `usage` was a list of signal words
  written as a sentence, `recap` was a decision procedure. Those are now
  what they are, and the app can present each one properly.
- **The types are semantic, not presentational.** `contrast` means "these
  two forms are set against each other", not "draw two columns". Every
  decision about how a block looks stays in `js/education.js`, which is
  the point: this is the third lesson format, and each previous change
  forced a full content rewrite. It should be the last one a redesign can
  force.
- **`text` blocks are capped at 400 characters, as an error.** A block
  that grows past it is the wall of prose the schema exists to break up,
  and what it is really carrying is a contrast or a decision nobody has
  written as one yet. Saying so at validation time is the only moment
  anyone acts on it.

### The reader

- **One scrolling page**, not eight taps. A step holding a single sentence
  left two thirds of a phone empty and still asked for a tap to leave.
- **A sticky header** carries the way out and the read position. On a
  3700px lesson, scrolling back to the top to find a Back button is not a
  way out.
- **No action bar.** A filled amber slab pinned under every screen is the
  loudest thing on a surface whose whole job is to be quiet.
- **Reaching the end finishes the lesson.** There is no "Dersi bitir"
  button, because a button that only confirms what the scroll position
  already proved is a tap asked for nothing.
- **Progress is a read fraction, not a step index** — which is what a
  scrolling page has, and which stays meaningful when an author adds a
  block to a lesson someone is halfway through. Reopening a lesson returns
  you to where you stopped reading.
- Answering an inline check keeps the scroll position exactly. Chrome's
  own scroll anchoring moved it 162px on a 320px screen — the whole
  verdict line sliding out from under the reader's eyes.

### All 18 lessons rewritten

Three agents in parallel, one per topic, against a hand-written reference
lesson and a machine-checked schema. Their reports were worth as much as
the lessons: they found a signal word taught as a Present Perfect trigger
that the same lesson's own example contradicted; a `when` rule that would
have been actively wrong on one of the questions; a "common mistake" whose
wrong and right sentences differed in three things at once; and a pitfall
marking perfectly good English as an error. Every one of those was hiding
inside a paragraph in the article version.

Open content questions they raised — including two questions that may be
in the wrong category — are recorded in `docs/education-notes.md`. Those
are taxonomy changes and the owner's call, so none was made.

### Content files stop churning

`npm run format` (`tools/format-content.mjs`) gives the content JSON one
canonical shape, checked in CI. Several sessions write into `data/`, and
any of them that read a topic file, changed one lesson and wrote it back
with `JSON.stringify(data, null, 2)` reformatted every question in the
file at the same time — a four-line change arriving as four hundred. That
happened once already, and "remember not to do that" is not a fix.

Also fixed, both found by the content agents reading the validator against
its own comments: the Turkish heuristic was calling `resmî` and `kâğıt`
foreign, and it was being applied to example notes that its own
documentation exempts.

## v0.12 — 2026-09-03

The redesign, stages 1 and 2 of `docs/redesign-plan.md`. The owner's
verdict on `v0.11` was that the architecture was right and the interface
wasn't — specifically the boxes-inside-boxes and the article reader. This
build replaces the entire visual layer and rebuilds every screen on top of
it. No content changed; the 72 questions, the taxonomy and the lesson
files are untouched.

### A design system, rather than a stylesheet

- **`docs/design-system.md`** is now the binding specification: colour,
  type, space, radius, motion, icons, a twelve-primitive component
  inventory, and an accessibility contract, each value traced to why it is
  that value. `css/style.css` was rebuilt from it — **881 lines from 1354,
  twelve primitives from 45 ad-hoc component roots**, in five cascade
  layers so nothing in the file ever needs a specificity fight.
- **The palette is solved, not picked.** Every token is derived from a
  contrast requirement in two models — WCAG 2 for conformance, APCA for
  the design, because WCAG 2 overestimates contrast on dark grounds by
  200–250%. `npm run color` re-measures all of them and fails if one
  drifts; it runs in CI.
- **Three rules generate most of the file**: depth is surface lightness,
  never a border or a shadow; at most one card level; one accent, one job.
  `css/style.css` now declares a border in exactly three places, none of
  them decoration — the text field, where 1.4.11 requires a 3:1 boundary
  no fill in this ramp can provide, and two rules under
  `forced-colors: active`, where backgrounds are discarded and an outline
  is all that is left.
- **Fonts are self-hosted** as three subset woff2 faces with
  metric-matched fallbacks, so the swap when they arrive shifts nothing.
  Source Serif 4's semibold was dropped rather than trimming the character
  set: English takes its hierarchy from size and from the face, never from
  weight, and the budget came in at **46.9 KB** with Turkish coverage
  intact. The last Google Fonts request is gone.
- **Fourteen hand-drawn icons** in `js/icons.js`, built to a written
  contract — 24 canvas, 20 live area, 2px absolute stroke, round joins,
  every coordinate inside 2…22. The two nav destinations have filled
  variants that are the *same drawing* inverted, so the selected state
  survives greyscale and forced-colors rather than relying on hue.

### Every screen rebuilt, and re-argued

- **Eğitim is now the app's home.** Someone opening a study app wants to
  carry on, not to be handed an exam. Its index leads with your overall
  progress, then the lesson you were in the middle of, then the list.
- **The mixed test moved to the Test tab**, where it is the point of the
  screen rather than 60% of the first view of a different one.
- **A weak spot does different things on different screens** — on Test it
  starts practice scoped to that category, in Profil it opens the lesson
  that teaches it. That is what let every row keep a single action; the
  old build had rows carrying a link *and* a button.
- **The results breakdown is ranked worst-first.** In question order it is
  a table; in this order it is a reading list.
- **Lists are scannable again.** A row's secondary line is one line,
  clipped — the old index put a whole intro sentence under every title and
  gave each row a different height.
- **The action bar is part of the shell** and has a fixed minimum height,
  so answering a question cannot move the button you are already reaching
  for. Before an answer it shows what is needed rather than a disabled
  button.

### Accessibility, deliberately rather than incidentally

- **The bottom nav is a `<nav>` landmark with `aria-current`**, not a
  `role="tablist"` — a tablist makes the whole bar one tab stop, implies
  panels in the same document, and fights a hash router.
- **The confirmation dialog is a native `<dialog>`.** That deleted the
  hand-rolled focus trap and got, for free, the thing it never had:
  everything outside the dialog is `inert`.
- **The listbox is a full select-only combobox** — focus stays on the
  trigger, `aria-activedescendant` tracks the active option, and Down/Up,
  Enter, Escape, Home/End and type-ahead all work.
- **A hash route is treated as a navigation**: `document.title` changes,
  focus moves to the new view, and the view is announced in the one
  persistent live region. The browser Back button gets the same treatment.
- **The cloze blank is a rule on the baseline**, with the word supplied to
  the synthesiser instead of five underscores read out one at a time.
- **Answer feedback announces the English form wrapped in `lang="en"`** so
  the synthesiser switches voice, and never takes focus.

### Verification is now a command

`npm run verify` (`tools/verify-ui.mjs`) drives the real app in Chromium
through one full learner journey — Eğitim, a lesson, a check, the Test
tab, a whole quiz, results, Profil — at 320 / 390 / 768 / 1280, auditing
every screen it lands on for horizontal overflow, touch targets under
44px and console errors, then running the accessibility contract once.
**149 checks.** This is not extra diligence: WCAG conformance is defined
per page *and per responsive variation*, so the sweep is the requirement.
Playwright stays out of `package.json` — the project still has zero
dependencies — and the script finds a global install instead.

It earned its keep immediately, catching a 48px icon button that a flex
parent squeezed to 23px at 320 and nowhere else, and nav items that flew
to opposite corners of a desktop window.

## v0.11 — 2026-09-03

Two lines of work that had run in parallel are merged here: the content
side's rewrite of every lesson into full article form, and a development
round that had continued from `v0.5` on its own branch. Nothing from
either is dropped — the navigation decisions made in `v0.6`–`v0.10` in
response to direct feedback stand, and the Eğitim reader is rebuilt on
top of them around the new content.

### Eğitim now reads the article content

- **Lessons are articles, not slides.** Every lesson across all three
  topics is authored as `intro / form / meaning / usage / examples /
  commonMistakes / recap` (content side, `docs/education-notes.md`),
  replacing the old rule-plus-two-examples shape that could only ever
  render as a slideshow. The app decides the pacing: those sections
  become the reader's steps, so content authors write prose, not screens.
- **Common mistakes get a real presentation** — the wrong form struck
  through above the fix, with the Turkish reason underneath. This is the
  step that carries the most exam value and it now looks like it.
- **Check questions are drawn from the same category's Test pool**, so a
  category never needs two parallel bodies of content kept in sync. They
  are never scored and **never gate progress**: an unanswered check reads
  "Atla", so re-reading one lesson for one rule never means sitting an
  exercise to get past it.
- **The index covers every topic**, grouped and skimmable, with per-lesson
  progress, an overall progress bar, and a "pick up where you left off"
  card. Lesson ids are derived from topic + category rather than
  authored, so a content file carries no bookkeeping field that could be
  renumbered by accident.
- **Hash routing** (`#egitim`, `#test`, `#profil`, `#egitim/<lessonId>`):
  the device back button steps back through the app instead of leaving
  it, a lesson can be linked to, and a reload keeps your place. Profil
  and the results screen use it to link a weak category straight to the
  lesson that teaches it.

### Quality infrastructure

- **`tools/validate-content.mjs`** (`npm run validate`) replaces
  `scripts/validate-content.js`, checking everything it did plus the
  lesson article schema, cross-file agreement (`questionCount`,
  `lessonCount`, `categories`), duplicate answer options — which the
  case-insensitive scorer would mark correct twice — and the seam between
  a question's blank and its correct option.
- That last check found two real content bugs on its first run:
  `passive-voice-t22` and `-t24` read "was written by **by** a student"
  once the correct option was filled in. An author writing the option and
  the sentence separately cannot see that seam, and neither can a reader
  of the JSON.
- **Unit tests** (`npm test`, `node:test`): 28 covering scoring and the
  storage layer, including corrupt-store and unavailable-`localStorage`
  degradation. **CI** runs both on every push and PR to `main` and `test`.
- **`docs/CONTENT_GUIDE.md`** is the authoritative schema, and
  **`docs/agents/`** holds paste-ready briefs for the sessions that
  author lessons and questions. **`CLAUDE.md`** carries project context
  forward.

### Fixes

- The "still in development" note stayed on screen inside the lesson
  reader, which is supposed to be a focused mode, eating a third of a
  phone screen.
- A failed content load left Eğitim permanently stuck on its error
  message: the "already loaded" flag was set before the fetch, so leaving
  and returning never retried. Topic files were also fetched and parsed
  twice; they're cached now, with failures evicted so a retry retries.
- `viewport-fit=cover` was declared but no safe-area insets were applied,
  so the bottom bar sat under the home indicator on notched phones.
- The fixed shell used `height: 100%`, which jumps as mobile browser
  toolbars slide in and out; it now tracks `100dvh` where supported.
- Going back from the results screen re-entered `quiz.html` and silently
  rolled a brand new test.
- Fraunces 400 was used by the question prompt and lesson example
  sentences but never requested. The font request now asks for exactly
  the two weights the stylesheet uses, down from nine.
- `isCorrectAnswer` threw on an unanswered question instead of scoring it
  wrong; pressing Enter on a focused advance button could fire twice and
  skip a question; anchors styled as buttons carried the UA underline.
- Five questions were single sentences rather than the cloze passages the
  exam uses, and the Passive Voice question ids didn't carry their topic
  prefix.

### Accessibility and mobile

- The custom dropdown now implements the WAI-ARIA listbox contract it
  took over from `<select>`: arrow keys, Home/End, Enter/Escape,
  `aria-activedescendant`, and an accessible name that includes the
  current value (it previously announced only "Soru sayısı").
- The confirm modal traps focus while open, returns it to whatever opened
  it, and opens on Cancel rather than the destructive action.
- The bottom nav follows the ARIA tabs pattern (roving tabindex,
  arrow-key navigation) and stays reachable while Profil is open.
- Answer feedback is announced (`role="status"`) rather than signalled by
  colour alone, and a wrong answer in a lesson check now says so in words.
- Every touch target is at least 44px; `prefers-reduced-motion` is
  honoured.
- Verified with Playwright across 320/390/768/1280: 217 checks, no
  horizontal overflow, no undersized targets, no console errors.

### Internal

- Extracted `js/dom.js` (shared node builders — the app still uses no
  `innerHTML` anywhere), `js/feedback.js` (one answer-feedback block for
  both Test and Eğitim checks), `js/quiz-launch.js` (the single path that
  starts a test, so a new entry point can't skip marking content seen),
  and `js/config.js`.

## v0.10 — 2026-09-03

UI/UX overhaul driven by direct feedback on v0.9 ("Eğitim sistemini hiç
beğenmedim", "tepedeki menü kötü"): the top navigation moves to the
bottom, the header shrinks, and Eğitim gets a skimmable entry point
instead of forcing one linear path through each chapter.

- **Bottom tab bar replaces the top tab bar.** Eğitim/Test now switch via
  a fixed bottom nav with distinct icons (open book vs. checklist),
  following the mobile-standard pattern for 2–5 top-level destinations —
  better thumb reach, and structurally separates the two modes instead of
  two mirror-image tabs sharing one bar. Profil deliberately stays out of
  it (still the header-corner avatar button) — it's identity/settings,
  not a content mode.
- **Header collapses to one slim row.** Drops the wordmark's subtitle/
  greeting line entirely; just "English Prep" + the profile avatar.
- **Eğitim gets a chapter index.** Opening Eğitim now shows a skimmable
  list of every chapter across every topic (category name + one-line rule
  preview) — tap any row to jump straight into that chapter's story
  cards, no need to walk through earlier ones first. A "‹ Konulara Dön"
  control returns to the index from mid-chapter, and the chapter-complete
  card now offers it alongside "Bu Konudan Test Et". This was the direct
  fix for the "didn't like the Eğitim system at all" feedback: a forced
  single path with no way to jump to or skip anything is a known-bad
  pattern for study/reference use (fine for onboarding a total novice,
  bad once you want a specific rule).
- **Check questions no longer hard-gate.** Down to 1 per chapter (from
  2); the forward control is never disabled on an unanswered check card —
  it reads "Atla" (skip) until answered, then the normal "›".
- Research and reasoning behind this round — bottom-nav ergonomics,
  Duolingo's path-vs-practice-hub split, linear-story vs. skimmable-view
  precedent, icon-based destination differentiation — are in the approved
  plan for this round; see the PR/commit for the full citation list.

## v0.9 — 2026-09-03

Eğitim rebuilt as a story-card chapter viewer, two new topics live, and
the content pipeline gets a validator.

- **Eğitim redesign: story cards.** Replaces the flat, all-topics-in-one
  pager with a chapter-by-chapter sequence of small full-screen beats per
  category — hook (when a lesson has one) → rule → each example → 2
  embedded check questions (answer required before advancing) → a
  generated chapter-complete beat, ending each topic with a "Bu Konudan
  Test Et" shortcut into a full Test session for it. A segmented progress
  bar (Stories-style) shows position within the current chapter; a topic
  switcher (pills) appears once more than one topic is live; edge arrows
  (plus ArrowLeft/ArrowRight/number-key/Enter shortcuts) move through
  cards. Built from the content side's "Vision" proposal in
  `docs/education-notes.md` — presentation only, no chapter locking yet
  (every chapter of every topic stays reachable any time, same as Test).
- **Modals and Passive Voice are live** (24 questions / 6 categories
  each, pulled in from the content-authoring side) — the app now has 3
  real topics instead of 1, and the home screen's tier accordion groups
  them for the first time.
- **`scripts/validate-content.js`**: a small, dependency-free script that
  checks the manifest and every topic file against the schema (see
  README). Passes clean against all 3 live topics.
- Small refactor: extracted `js/feedback.js` so the "verdict +
  explanation + tip" block isn't duplicated between `quiz.js` and the new
  story-card check cards.
- `docs/education-notes.md` gained a "Developer responses" section
  answering the content side's story-card vision and messages.

## v0.8 — 2026-09-03

Content/dev coordination lands, plus a small feature that closes the loop
on Profil's weak-spot data.

- **`docs/education-notes.md`** brought in from the content-authoring
  side's coordination branch: curriculum order for the next 12 topics, and
  a proposed interaction model for Eğitim (a linear, chapter-by-chapter
  guided path, soft-unlocked) versus Test (staying fully open, unchanged).
  Responded on the dev side: approved the proposal and its one new
  optional lesson field (`intro`), and decided embedded chapter-check
  questions share the same pool as Test rather than needing a reserved
  subset — full reasoning in the file.
- **New: "Pratik Yap" on weak categories.** Profil's weak-category list
  now has a button per entry that launches an open, category-scoped Test
  session straight from that weak spot, instead of just showing the
  number. `quiz.js` gained an optional `category` filter on top of its
  existing topic/count request shape to support this — no new schema,
  no content dependency.
- Weak-topic/weak-category list rows now share a `.breakdown-list__info`
  wrapper (small internal refactor to make room for the action button
  without duplicating the row-layout CSS).

## v0.7 — 2026-09-03

Small follow-ups from the `v0.6` navigation pass — closing out the last
two items planned for this round.

- **Dismissible "still in development" note**: a small banner above the
  tabs tells first-time visitors the app isn't `v1` yet and what's
  usable today (Eğitim, Test, Profil). Dismissing it is remembered
  locally and survives a history reset — it's a separate, deliberately
  simpler stand-in for the more elaborate multi-step onboarding tour
  that was on the roadmap; that fuller tour is deferred as
  disproportionate for this stage.
- **Weak-spot lists show rank numbers** ("1. Tenses", "2. ..."):
  addresses artifact-comment feedback that the ordering read as
  arbitrary — entries were already sorted weakest-first, the numbers
  just make that order visible instead of implicit.
- Ported both to the "Tenses Practice" artifact.

## v0.6 — 2026-09-03

Navigation restructure, driven directly by artifact-comment feedback left
on the `v0.5` preview — the recurring point across several comments was
that Profil didn't belong next to Eğitim/Test.

- **Profil moved out of the tab bar.** It now opens from a small circular
  button in the header instead of sitting as a third tab — it's
  identity/settings, not a content mode, so grouping it with Eğitim/Test
  was structurally wrong. The tab bar is back to two tabs.
- **Personalized header greeting.** Once a display name is set in Profil,
  the header shows "Hoş geldin, {name}!" instead of the static tagline,
  and the profile button shows the learner's initial. Updates live, no
  reload needed.
- **Header simplified**: the visible app name is now just "English Prep".
- Removed the artifact-only "Anlık önizleme" preview badge from its
  header, per direct feedback that it wasn't needed.
- This is the first step of a broader UX pass; see README's **Roadmap to
  v1.0** for what's next (a short onboarding tour, and a guided learning
  path mechanism in Eğitim).

## v0.5 — 2026-09-02

New "Profil" tab — a real, visible local profile, replacing the previous
silent/nameless tracking as the home for anything about *you* rather than
about a specific test result.

- **New "Profil" tab**: third tab alongside Eğitim/Test. Shows an optional
  display name (local only, saved on this device, never sent anywhere),
  overall stats (tests completed, questions answered, overall accuracy),
  and — once enough data exists — which topics and which grammar
  categories you're weakest in.
- **Per-category weak-spot history now persists**: category results were
  already shown per-test on the results screen, but weren't saved across
  sessions. `recordAttempt()` now persists `categoryBreakdown` alongside
  the existing per-topic breakdown, so "Zayıf Olduğun Kategoriler" reflects
  real history, not just the last test.
- **"Clear history" moved into Profil**: the old header button is gone;
  resetting local history (same in-app confirmation modal as before) now
  lives under Profil's "Ayarlar" section.
- Content-freshness tracking (the "Yeni sorular eklendi" badge) is
  unchanged and stays separate from the new profile — it isn't cleared by
  the history reset.
- Resolved the open design question on the quiz category eyebrow label:
  kept, since it's the same taxonomy the Eğitim tab's lessons use, not
  just decoration.

## v0.4 — 2026-09-02

Structural UX overhaul, driven by direct feedback on the v0.3 build and
preview artifact.

- **App shell rewrite**: the app is now a fixed-height column (header/tabs,
  a scrolling content area, a fixed bottom action bar on quiz/results)
  instead of an ordinary scrolling page. Answering a question no longer
  pushes the "Next Question" button around, and no screen ever shifts
  horizontally (no visible scrollbar anywhere, hidden via CSS while
  staying scrollable).
- **New "Eğitim" (teaching) mode**: a segmented Eğitim/Test tab control on
  the home screen. Eğitim is a fast, paginated tour through each topic's
  categories — a short rule plus simple examples, no scoring. Ships with 6
  real lessons for Tenses.
- **Custom in-app components replace native browser chrome**: the
  question-count picker is now an app-owned dropdown instead of `<select>`;
  "Clear history" now opens an in-app confirmation modal instead of
  `window.confirm()`. Neither can trigger OS-native UI or reflow the page.
- **Silent content-freshness tracking**: a nameless local record (extending
  the existing score history, no login, no visible profile screen) tracks
  which `contentVersion` of a topic a learner has seen, showing a "Yeni
  sorular eklendi" badge when it's grown since their last visit.
- **Full Turkish UI copy pass**: every interface string (buttons, headings,
  status lines, empty states) is now in Turkish. Practice sentences stay
  English; explanations/tips stay Turkish (already were); grammar category
  labels stay English.
- De-emphasized the `____` blank styling and removed the visible
  keyboard-shortcut hint (the 1–4/Enter shortcuts still work, just aren't
  advertised) per direct feedback that both were too loud for the primary
  mobile audience.

## v0.3 — 2026-09-02

UI/UX polish pass, informed by the roadmap (more topics, more tiers).

- Fixed a box-width inconsistency: the topic grid used `auto-fill` (which
  reserves empty grid tracks) and its padding wasn't scoped to a bordered
  container, so topic cards floated narrower than the hero panel with
  unexplained dead space. Switched to `auto-fit` and moved the grid's
  padding onto `.topic-tier`, so panels at the same nesting level always
  match widths.
- Quiz screen: added a "Back to Home" exit link, an animated progress bar,
  and a visible keyboard-shortcut hint (the 1-4/Enter shortcuts already
  worked but were undiscoverable).
- Topic cards now show a category-preview chip row.
- Added a real "Modals" (Core Grammar tier) `comingSoon` manifest entry, so
  the tier accordion groups topics for real today instead of only in a
  temporary test edit — rendered as a disabled "Coming soon" card, excluded
  from the mixed-test question pool.

## v0.2 — 2026-09-02

Content and visual identity overhaul, replacing v0.1's placeholder content
and generic look before any real use.

- **Tenses content rewritten**: replaced the 16 isolated, single-sentence
  placeholder questions with 24 paragraph-based cloze questions grouped
  into 6 confusable-form categories (e.g. "Present Perfect vs Past
  Simple"), matching the actual difficulty of a YTÜ İYS-style Cloze Test.
  Explanations and tips are now written in Turkish, the learner's own
  language; practice sentences stay in English.
- **New `tip` field**: each question now carries a short, generalizable
  rule alongside its situational explanation — shown in the quiz feedback
  and in the results review.
- **Category breakdown**: the results screen now shows a per-category score
  breakdown (in addition to per-topic), so a learner can see, e.g., that
  they specifically struggle with Past Perfect vs Past Simple.
- **Visual identity redesigned**: replaced the generic light "card + shadow"
  look with a single deliberate dark theme — warm ink-and-amber palette,
  Fraunces display serif for headings, IBM Plex Sans/Mono for body and
  numbers, hairline borders instead of shadowed cards.
- Manifest simplified to a single "Tenses" topic (was two separate,
  thinner per-tense topics).

## v0.1 — 2026-09-02

Initial development build.

- Home, quiz, and results screens for multiple-choice, fill-in-the-blank
  practice questions.
- Mixed test (random questions across all topics) and per-topic test modes.
- Immediate answer feedback with full teaching explanations.
- Results screen with score, per-topic breakdown, and a weak-topic callout
  based on locally saved history (`localStorage`, no backend).
- First topic set: Present Simple and Past Simple (8 questions each).
- Fully static, no build step; deploys directly via GitHub Pages.
