# The exam

What YTÜ's İngilizce Yeterlik Sınavı actually is, how much of it this app
covers, and what to build next.

**The short version.** The app's 72 questions all have one shape: a short
paragraph, one blank, four options, testing a verb form. On the exam this
targets, **there is no section with that shape.** There is no discrete
grammar section at all. The exam is a reading-and-listening-and-writing
paper in which grammar appears only as one ingredient of a ten-blank cloze
passage and a ten-item restatement set. By the most generous reading, the
app currently prepares a learner for **about 12–19% of the marks** — and
even in that slice, its item format does not match the paper's.

That is not a reason to throw the grammar away. Grammar is the substrate
everything else stands on, and a B1 student who cannot tell *Present
Perfect* from *Past Simple* will fail the reading section too. But it is a
reason to stop treating "more grammar topics" as the road to a useful app.
The next question is not the seventh tense topic. It is the first reading
passage.

---

## 0 · How much of this I could actually verify

This matters more than usual, so it goes first.

**I could not reach any primary source.** This session's network egress
allows a web *search* index but blocks direct fetches of
`ybd.yildiz.edu.tr`, `osym.gov.tr`, university domains generally, and the
prep-school sites. Everything below comes from search-result summaries of
those pages, not from reading the pages.

That splits the findings into two confidence bands, and I have marked
every claim:

- **Reported** — stated consistently across several independent sources,
  including summaries of YTÜ's own pages (the School of Foreign Languages
  announcements, its FAQ, its `YDYO Yönergesi` PDF). Treat as fact but
  verify the numbers before betting content-authoring months on them.
- **Extrapolated** — my inference from the shape of neighbouring exams
  (İTÜ, Boğaziçi, YDS). Marked inline. Do not present these to anyone as
  facts about YTÜ.

**The single most useful thing the owner can do in ten minutes** is
download YTÜ's own sample paper. Search results say the School of Foreign
Languages publishes example proficiency exams in the student section of
`ybd.yildiz.edu.tr`, and the 2023–24 `Students' Booklet` PDF is indexed at

`https://ybd.yildiz.edu.tr/sites/ybd.yildiz.edu.tr/files/3.ytu-sfl-dbe-students-booklet-for-2023-2024-academic-year.pdf`

Everything in §1 should be checked against that document. If it contradicts
me, it wins.

---

## 1 · What the exam is

### 1.1 Shape

**Reported.** YTÜ's İngilizce Yeterlik Sınavı (İYS) — the *hazırlık atlama*
exam — runs in **two sessions on the same day**, 50 points each, 100 total.
It is held three times a year: **September, January and June**.

| Session | Sections | Points |
| --- | --- | --- |
| 1 (morning) | Cloze Test, Restatement ("closest meaning"), Reading, Paragraph Completion | 50 |
| 2 (afternoon) | Listening, Writing | 50 |

YTÜ's own framing groups session 1 as **"Use of English"** and
**"Reading"** — the reading half being the two passages plus paragraph
completion.

**Pass mark: 60/100 across both sessions.** Sources agree on 60. A student
below the session-1 threshold does not sit session 2 and is placed by
their session-1 score. Sources **disagree** on that threshold: some say 25
of 50, some say 30. Unresolved; ask the school.

### 1.2 Session 1 in detail

**Reported**, though the counts are the least reliable numbers here — the
prep schools give both 40 and 45 as the total, and one of them notes the
duration has itself varied between 60, 70 and 90 minutes across sittings.

| Item type | Questions | ~Points | ~Share of paper |
| --- | --- | --- | --- |
| Cloze Test | 10 | 12.5 | 12.5% |
| Restatement / closest meaning | 10 | 12.5 | 12.5% |
| Reading (2 passages × 7) | 14 | 17.5 | 17.5% |
| Paragraph Completion | 6 | 7.5 | 7.5% |
| **Session 1** | **40** | **50** | **50%** |

Each MC item is reported at **1.25 points**, which is exactly 50 ÷ 40 — so
the internally consistent count is **40**, and the "45" that also
circulates is probably someone's rounding or an older paper. I'd plan
against 40 and verify.

### 1.3 Session 2 in detail

**Reported.** 95 minutes, 13:00–14:35.

| Item type | Questions | ~Points |
| --- | --- | --- |
| Listening — while-listening + note-taking, 2 recordings | 20 MC | ~25 |
| Writing — one academic essay, ~350 words, cause / effect / opinion prompt | 1 | ~25 |
| **Session 2** | | **50** |

The listening is not a comprehension quiz over a transcript. It is *two
distinct listening skills* — selective/while-listening, where you see the
questions first and answer as the audio runs, and careful/note-taking,
where you do not see the questions and must take notes from a single
hearing. That distinction comes straight out of the Boğaziçi BUEPT model
and is standard across Turkish proficiency exams.

**No speaking component** appears in any source for the İYS. (Reported by
omission — nobody lists one. Medium confidence.)

### 1.4 Level

**Reported.** The syllabus targets **CEFR B2**: YTÜ's regulation treats a
pass as evidence of B2, and this repo's own content files already declare
`"level": "B2-C1"`, which is the right ballpark. B2 is the level at which
a learner is expected to read moderately demanding academic prose and
write a structured argumentative essay — which is exactly what the paper
asks for.

### 1.5 The neighbours, for calibration

The İYS is not idiosyncratic. Every Turkish university proficiency exam I
could check has the same skeleton — **reading + listening + writing, with
grammar embedded rather than sectioned off**:

- **İTÜ** — session 1: restatement (9 items, 14 pts) + reading (24 items,
  36 pts) = 60; session 2: listening (10 items, 20 pts) + a ~350-word
  academic essay (20 pts) = 40. Pass 60, minimum 20 from session 2, 65 for
  graduate students. *No grammar section, no cloze.*
- **Boğaziçi (BUEPT)** — listening (selective + note-taking), reading
  (search reading + careful reading), writing; ~4 hours; pass 60 overall
  **and** a pass on writing specifically. *No grammar section at all.*
- **YDS / e-YDS (ÖSYM)** — the contrast case: 80 items, 180 minutes, all
  multiple choice, no writing and no listening. Its published distribution
  is roughly vocabulary 6, grammar 10, cloze 10, sentence completion 10,
  EN→TR translation 3, TR→EN 3, reading passages 20, dialogue completion
  5, closest-meaning 4, paragraph completion 4, irrelevant-sentence 5.

The İYS reads like the top of a YDS paper (cloze, restatement, reading,
paragraph completion) bolted to the bottom of a BUEPT (listening,
writing). **The YDS item types the İYS does *not* use are as informative
as the ones it does**: no isolated grammar items, no isolated vocabulary
items, no translation, no dialogue completion, no irrelevant-sentence.
Building those would be building for the wrong exam.

### 1.6 The four session-1 item types, precisely

Getting these right is the whole design problem, so:

**Cloze Test.** *One* continuous paragraph with ~10 numbered blanks, each
with its own four (İYS) or five (YDS) options. The blanks are mixed on
purpose: some are verb forms, some are prepositions, some are conjunctions
or discourse markers, and **many are vocabulary** — choosing between four
plausible content words on the strength of the surrounding argument. You
read the paragraph once and answer ten questions against it.

**Restatement / closest meaning.** A sentence is given; four options
follow; pick the one that means the same thing. This is where grammar
transformation actually lives on this paper — passive↔active, modal
paraphrase, conditional restructuring, concession (*although* → *despite*)
— fused with vocabulary. It is 12.5% of the paper on its own and it is the
**single best-matched target for a static MC app** in the whole exam.

**Reading.** Two passages, seven questions each. Main idea, inference,
reference (*"it" in line 12 refers to…*), vocabulary-in-context,
author's attitude. One passage shared by seven items.

**Paragraph Completion.** A paragraph with one sentence removed —
usually not the first — and four candidate sentences. You choose the one
that fits the paragraph's logical and referential flow. It is a coherence
test, not a grammar test, and Turkish students find it disproportionately
hard.

---

## 2 · Where the app lands on that paper

### 2.1 What 72 questions currently buy

The app has three topics — Tenses, Modals, Passive Voice — 18 categories,
72 questions, all one shape: 1–3 sentences, one `____`, four verb forms,
one right. Against the paper above:

| Exam component | Share | What the app trains for it |
| --- | --- | --- |
| Listening | ~25% | Nothing. |
| Writing | ~25% | Nothing directly. Grammatical accuracy is one rubric line. |
| Reading (2 passages, 14 items) | ~17.5% | Nothing. |
| Cloze Test (10 items) | ~12.5% | The grammar half of the blanks. Wrong item format. |
| Restatement (10 items) | ~12.5% | The grammar knowledge, none of the item skill. |
| Paragraph Completion (6 items) | ~7.5% | Nothing. |

The **honest headline number is 12–19%**, and here is the arithmetic
behind it, so it can be argued with. In the YDS cloze tradition roughly
half the blanks are function/grammar and half are content vocabulary
(*inference* — I could not get a blank-by-blank breakdown of a real İYS
cloze), which puts the app's reach at ~6 of 12.5 marks. Restatement is
grammar transformation fused with lexical paraphrase; call it another ~6
of 12.5. That is 12 marks. Add a few marks of essay accuracy and you reach
19. **Nothing else on the paper is touched at all.**

And note what the topic list is: Tenses, Modals, Passive. Those three are
*exactly* the transformations restatement items are built from —
passive↔active, modal paraphrase, tense-shift in reported speech. The
content is aimed at the right target. Only the delivery is wrong.

### 2.2 The gaps, in order of marks

1. **Reading — ~25% (passages + paragraph completion), and it is also the
   gate.** See §3. This is the highest-value gap by a distance, and unlike
   the other two big ones it is fully buildable inside the constraints.
2. **Listening — ~25%.** Needs audio. See "What I would defer".
3. **Writing — ~25%.** Needs a human or a model to mark. See "What I
   would refuse".
4. **Vocabulary — not a section, but the largest cross-cutting
   ingredient.** It decides cloze blanks, decides restatement options,
   decides whether the reading passages are readable at all, and decides
   the essay's ceiling. The app has zero. See §5.
5. **Restatement as an item type — 12.5%,** and the cheapest new item type
   to build: it is the existing four-option MC control with a longer stem.
6. **Cloze as a real passage — 12.5%.** The app's current questions are
   what a cloze *item* looks like after you cut it out of its passage and
   give it its own paragraph. Putting ten blanks back into one text is a
   structural change, and it shares that change with reading (§4.1).

---

## 3 · The thing that wasn't in the brief

I was asked six questions. The most important fact I found is not in any
of them, so it goes here rather than at the end.

### 3.1 The exam is a clock and a gate, and this app is neither

**The gate.** Session 1 has a cut-off. Score below it (25 or 30 of 50 —
sources disagree) and **you do not sit session 2 at all**: no listening,
no essay, placed by your session-1 score. So session-1 marks are not just
half the paper. They are the admission ticket to the other half.

Run the arithmetic a marginal student faces. To pass you need 60/100. A
plausible route: a mediocre-but-organised essay (~15/25) plus ~60% of the
listening (~15/25) gives 30 from session 2, so you need **30 of 50 in
session 1 — 24 of 40 items right.** Of those 40 items, 20 are pure reading
comprehension (14 passage + 6 paragraph completion), 10 are restatement,
10 are cloze. **You cannot get to 24 without reading well.** There is no
arrangement of grammar knowledge that gets a student over that line while
they read slowly.

**The clock.** 40 items in 60–90 minutes, including two full academic
passages. That is roughly 90–135 seconds per item with the reading time
inside it. The İYS is not a knowledge test with a generous time
allowance; it is a rate test.

Now look at what this app trains. One item on screen. No timer. **Instant
feedback after every single answer**, with a full Turkish explanation and
a transferable tip. Answering never moves the button. It is a beautifully
built *study* loop — and it is the exact inverse of the exam behaviour:
sustained silent work across a block of items with no feedback, a passage
held in working memory across seven questions, and a clock.

This is not an argument against the instant-feedback loop. It is the right
loop for learning, and the design notes are right that it should stay. It
is an argument that **the app currently has only one mode, and the exam
needs two.** A learner needs the teaching loop *and* a rehearsal that
looks like the paper: a fixed block of items, answers withheld, a visible
clock, and all the feedback at the end — which is exactly what the results
screen already is.

### 3.2 Why this is the cheapest big win in the whole document

Everything else in this document is content work measured in hundreds of
authored items. **A timed, feedback-deferred mode is code, and not much of
it.** The pieces already exist:

- `buildQuizSession()` already builds a fixed list of items.
- `state.selectedAnswers` already holds one answer per item, and
  `scoreSession()` already scores the whole array at the end.
- `results.js` already renders a full per-item review with explanations.
- `js/shell.js` already owns a fixed action bar that does not move.

What is missing is a `mode` on the quiz request (`"study"` vs `"exam"`),
a branch in `renderQuestion()` that skips `renderAnswerFeedback` and
labels the button "Sonraki", a way to go *back* to a previous item within
the block (the exam lets you), and a clock. The clock is the only genuinely
new component, and it is a `<p class="t-num">` updated on an interval with
`aria-live="off"` and an accessible time-remaining announcement at
intervals — WCAG 2.2 **2.2.1 Timing Adjustable** applies, and its exception
for "a real-time event or an essential time limit" is exactly the case
here, so a mode the learner explicitly opts into with the limit stated up
front is conformant. Say so in a comment, because someone will ask.

Estimate: **a day of work, no schema change, no new content.** It is worth
more per hour spent than any item type below.

### 3.3 And the score has to mean something

Related, and nearly free. The app reports percentage-correct on a
self-chosen 10-question grammar drill. The exam reports a number out of
100 with a pass at 60 and a gate partway through. Those are not the same
kind of number, and "80% on Tenses" tells a student nothing about whether
they will pass.

Once a timed, mixed, exam-shaped block exists, its score can be expressed
in the units the learner actually cares about — marks out of the section's
weight, against the 60 line. That requires no new content either; it
requires deciding that the number on the results screen should be an exam
number.

