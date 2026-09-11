# The exam

> **Superseded in part, 2026-09-03.** The owner supplied YTÜ SFL's own
> sample papers after this was written, and `docs/exam-spec.md` is now the
> verified specification. Read that first; where the two disagree, it
> wins. This document's section list held up. Its point weights did not —
> Session I is 40 items at 1.5 points for 60, not 50 — and its estimate
> that the app covers 12–19% of the marks was generous: the real figure is
> about 7%, because the cloze section turned out to test grammar this app
> does not teach at all. The reasoning below is kept because it is what
> made the right questions get asked.


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

- **[İTÜ](https://ydy.itu.edu.tr/programlar/lisans-hazirlik-programi/yeterlik-sinavi)**
  — session 1: restatement (9 items, 14 pts) + reading (24 items,
  36 pts) = 60; session 2: listening (10 items, 20 pts) + a ~350-word
  academic essay (20 pts) = 40. Pass 60, minimum 20 from session 2, 65 for
  graduate students. *No grammar section, no cloze.*
- **[Boğaziçi (BUEPT)](https://yadyok.bogazici.edu.tr/en/pages/testing-and-assessment-unit/2399)**
  — listening (selective + note-taking), reading
  (search reading + careful reading), writing; ~4 hours; pass 60 overall
  **and** a pass on writing specifically. *No grammar section at all.*
- **[YDS / e-YDS (ÖSYM)](https://www.uzmaningilizce.com/sss/yds_e_ydsde_soru_dagilimi_nasildir)**
  — the contrast case: 80 items, 180 minutes, all
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
   structural change, and it shares that change with reading (§4.3–4.4).

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

---

## 4 · The item types that should exist

Four new types cover everything on session 1. They are not equally
expensive, and the order below is by cost, not by exam weight — because
two of them turn out to be almost free.

### 4.0 One discriminator, and no migration

Every design below hangs off a single new optional field:

```json
{ "type": "restatement" }
```

Absent, it means `"cloze-single"` — the shape all 72 existing questions
have. **No existing content file changes.** `normalizeQuestion()` in
`js/topics.js` becomes a switch on `type` and is the one place the
authored schema meets the runtime shape, which is exactly where this
belongs; the module's header comment already frames it as that boundary.

The runtime shape stays `{ id, category, prompt, options, correctAnswer,
explanation, tip }` for every type, with **one addition**: an optional
`context` — the passage or cloze text an item cannot be understood
without. `scoreSession()` then needs `context` carried into
`questionResults`, or the results-screen review shows seven orphaned
questions with no passage.

That is the whole contract. Everything else is per-type authoring.

### 4.1 Restatement — the cheapest 12.5% on the paper

**What the learner sees.** A sentence in English, then four sentences.
Pick the one that means the same.

```json
{
  "id": "restatement-r1",
  "type": "restatement",
  "category": "Concession: Although vs Despite",
  "paragraph": "Although the results were promising, the team refused to publish before a second trial.",
  "options": [
    "Despite the promising results, the team would not publish until a second trial had been run.",
    "The results were promising because the team ran a second trial before publishing.",
    "The team published the promising results and then ran a second trial.",
    "Had the results been promising, the team would have published without a second trial."
  ],
  "correctIndex": 0,
  "explanation": "…", "tip": "…"
}
```

**Answered and scored exactly as today** — one of four, string-compared
after shuffling. `appendBlanked` no-ops when there is no `____`, so
`quiz.js` needs no change at all.

**The only real work is presentational.** Options are now full sentences
rather than two-word verb forms, so `.option` has to survive a three-line
label at 320px with a 44px target and the numeric key still aligned. That
is one CSS pass and one line in `docs/components.html`. Verify with
`npm run verify` at 320.

**Validator change:** `paragraph` currently must contain exactly one
`____`; for `restatement` it must contain none, and options must be
sentences (say, ≥ 6 words) rather than verb forms.

### 4.2 Paragraph completion — the same control again, 7.5% more

Structurally identical to restatement: a paragraph with one sentence
missing, four candidate sentences.

```json
{
  "id": "paracomp-p1",
  "type": "paragraph-completion",
  "category": "Paragraph Completion",
  "paragraph": "Coral reefs occupy less than one per cent of the ocean floor. ____ This is why even a small rise in sea temperature can trigger losses out of all proportion to the area affected.",
  "options": ["…", "…", "…", "…"],
  "correctIndex": 2,
  "explanation": "…", "tip": "…"
}
```

Here `____` marks a **whole missing sentence**, so it should render as a
full-width blank line rather than the inline word-blank `appendBlanked`
draws today — a `data-` variant on `.blank`, no new component.

**Together, §4.1 and §4.2 are 20% of the paper for roughly one day of
code.** They are the single best ratio in this document, and they are
where I would start on content.

Authoring note, and it is the hard part: a paragraph-completion item is
only valid if the correct sentence is forced by *cohesion* — a reference
word, a discourse marker, a chain of given-then-new information — and not
merely by being on-topic. Three plausible-but-incoherent distractors are
much harder to write than three wrong verb forms. Budget accordingly.

### 4.3 Cloze passage — 12.5%, and it changes the engine

This is the first type where one text carries several items, so it is the
first that breaks the flat pool.

```json
{
  "id": "cloze-c1",
  "type": "cloze",
  "text": "Urban planners have long argued that public transport ____ more than a way of moving people. ____ it shapes where people live …",
  "blanks": [
    { "category": "Perfect Aspects", "options": ["…"], "correctIndex": 1, "explanation": "…", "tip": "…" },
    { "category": "Discourse Markers", "options": ["…"], "correctIndex": 0, "explanation": "…", "tip": "…" }
  ]
}
```

Blank *numbers* are derived from position, exactly as lesson ids are
derived from category — the nth `____` in `text` takes the nth entry of
`blanks`. Nothing authored can drift out of sync, and there is no number
in the file for anyone to renumber by accident.

**Category lives on the blank, not on the cloze** — because that is the
truth about the item type: one passage, ten blanks, ten different things
being tested. Everything downstream (results breakdown, weak-spot
profile, the link from a wrong answer to its lesson) then keeps working
unchanged, which is a strong argument for putting it there.

**What the learner sees.** The whole text, every blank numbered, the
current blank marked; options below; the text stays on screen as they
work through the blanks. `appendBlanked()` in `js/dom.js` grows from "split
on `____` and insert a blank span" to "…and number them, and mark index N
as current" — perhaps fifteen lines. It is the right place for it: this
module exists precisely so no screen builds nodes itself.

**Scoring is unchanged.** Each blank normalizes into an ordinary item with
its own `category` and `correctAnswer`; ten blanks score as ten marks.

### 4.4 Reading passages — 17.5%, and the real structural change

```json
{
  "id": "reading-r1",
  "type": "reading",
  "title": "The economics of urban trees",
  "text": "…350 words of academic prose, paragraphs separated by blank lines…",
  "questions": [
    { "category": "Main Idea",  "question": "The passage is mainly concerned with…", "options": ["…"], "correctIndex": 2, "explanation": "…" },
    { "category": "Reference",  "question": "\"they\" in paragraph 2 refers to…",     "options": ["…"], "correctIndex": 0, "explanation": "…" }
  ]
}
```

Five things to say plainly about this one.

**1 · The pool stops being a list of questions and becomes a list of
units.** `buildQuizSession()` shuffles `questions` and slices to `count`.
That cannot survive a passage: seven items must stay together, in order,
after a text. The change is small but real — shuffle **units** (a
standalone item is a unit of one; a cloze or a reading passage is a unit
of N), then flatten, and let `count` be a *target* the builder fills to,
never splitting a unit. A request for 10 that lands on a 7-item passage
returns 12 or 10; it must never return 3 questions about a passage the
learner was not shown. Say that in the JSDoc, because it is the kind of
invariant a later refactor quietly breaks.

**2 · `count` and `questionCount` stop meaning the same thing.** The
manifest's `questionCount` is validated against the number of entries in
`questions`. With units it has to become an *item* count — blanks and
passage-questions included — or every topic card lies. Pick one meaning,
enforce it in the validator, and write it down in `CONTENT_GUIDE.md`.

**3 · The passage has to stay reachable without a nested scroll.** The
app shell has exactly one scrolling region and that is load-bearing. So:
render the passage in the scroll region above the question, inside a
native `<details>` — open for the first question of the set, collapsed
afterwards with the learner's choice remembered for that set. Native
`<details>` is the right call by this project's own convention (prefer
the platform; the disclosure is one of the things it gets right), it
costs no JS, and it keeps the answer control at a predictable place on
screen for six of the seven questions. Do **not** build a second scroll
pane inside the first.

**4 · The categories change meaning, and that is fine.** A reading item's
`category` is a *skill* — `Main Idea`, `Inference`, `Reference`,
`Vocabulary in Context`, `Author's Attitude` — not a grammar contrast.
Every mechanism in `results.js` and `profile.js` keys on the category
string, so a learner who misses four `Inference` items sees "Inference"
as a weak spot with no code change whatsoever. It does mean the taxonomy
rule in `CONTENT_GUIDE.md` ("a category should name a confusable pair")
needs a second clause for skill categories, and it means a reading topic
needs lessons teaching those skills if the results screen's
category→lesson link is not to dead-end.

**5 · Guard the Eğitim checks.** A lesson's `check` block draws from the
questions sharing its category. If reading and cloze items enter that
pool, a check could pull one item out of a seven-item passage and render
it context-free. `loadLessonsForTopics()` must filter `checkPool` to
single-item units. Two lines, and a bug that will otherwise ship.

### 4.5 What this costs, honestly

| Type | Schema | Renderer | Engine | Validator | Exam weight |
| --- | --- | --- | --- | --- | --- |
| Restatement | `type` only | CSS only | none | small | 12.5% |
| Paragraph completion | `type` only | one blank variant | none | small | 7.5% |
| Cloze passage | new `blanks[]` | `appendBlanked` grows | units | medium | 12.5% |
| Reading | new `questions[]` | `<details>` + strip | units + `context` | medium | 17.5% |

Two of the four are a day. The other two share one engine change and are
maybe a week together. **None of it is the expensive part** — the
expensive part is writing the passages, and that is §6.

---

## 5 · Vocabulary

### 5.1 There is no vocabulary section, and that is why it matters

The İYS has no item type called *vocabulary*. Neither does İTÜ's paper,
neither does BUEPT. (YDS does — 6 of 80 — and it is the least of the
places vocabulary decides YDS scores.)

Vocabulary is not a section on this paper. It is the **medium**. It
decides:

- the content-word blanks in the cloze — roughly half of them
  (*inference*, from the YDS cloze convention);
- the restatement items, where the correct option almost always
  re-expresses the stem with a synonym and the distractors are near-misses
  of meaning;
- *vocabulary-in-context* items inside the reading section explicitly;
- whether the two reading passages are readable at all, which is upstream
  of all 14 of their marks;
- the ceiling on the essay, which is 25% of the paper.

**Inference, but a confident one:** vocabulary is load-bearing for more of
this exam than grammar is. A student with strong grammar and weak lexis
reads slowly, misses the gate, and never writes the essay.

### 5.2 What the target actually is, and why that is good news

The useful research finding here is that the target is **finite and
enumerable**.

- **Hu & Nation (2000)** put comfortable unassisted reading comprehension
  at **98% lexical coverage**, with 95% as a floor for minimally adequate
  comprehension. Be honest about this number: it is influential and it is
  contested — a 2023
  [replication in *Language Learning*](https://onlinelibrary.wiley.com/doi/10.1111/lang.12622)
  (Kremmel et al.) could not fully reproduce it, and the original
  regression rested on 66 students. Treat 95–98% as the right order of
  magnitude, not a constant.
- **The [NGSL](https://www.newgeneralservicelist.com/new-general-service-list)**
  (2,809 words) gives ~92% coverage of general English. A B2 candidate
  broadly has this; it is not where the marks are.
- **The AWL**
  ([Coxhead 2000](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951))
  is 570 word families that account for about **10% of the tokens in
  academic text** and only 1.4% of fiction. On a
  350-word exam passage that is ~35 tokens. Coxhead built the list from
  exactly the words *outside* the first 2,000 — which is to say, from the
  band a B2 candidate has not covered and a reading passage is full of.
  Be careful with the arithmetic here: the NGSL's 92% is coverage of
  general English, not academic prose, so 92 + 10 is not a sum you can
  take. The claim that survives is weaker and still decisive — **the AWL
  is where the unknown words in an academic passage concentrate.**

So the honest target is not "learn English vocabulary". It is: **the AWL,
sublists 1–3 first (180 families, the B2 priority), then 4–10.** That is
a bounded, authorable, finishable list — which is exactly the kind of
thing a small static app is good at and a big commercial app is not.

Two caveats worth writing down. The AWL is built on the 1953 GSL and on
word *families*, both criticised; **Gardner & Davies' Academic
Vocabulary List (2013)** — see the
[list overview](https://www.eapfoundation.com/vocab/wordlists/overview/)
— is the modern alternative and worth a look before committing. And
word families are the reason **word formation** belongs
here: *analyse / analysis / analyst / analytical / analytically* is one
AWL family and four separate exam answers. The README already has "a
question format for Vocabulary / Word Formation" on the post-1.0 roadmap;
the AWL family lists are the principled content source it was missing.

### 5.3 How vocabulary should be learned — and what that means here

Four findings, each with a direct consequence for the build:

**Deliberate study is not inferior to learning from context.** The
comparative literature
([Webb 2007](https://journals.sagepub.com/doi/10.1177/1362168806072463)
on word pairs vs glossed sentences; the broader
decontextualised-vs-contextualised work) finds decontextualised
tasks **equal or better** for establishing the form–meaning link, and
context adds other kinds of knowledge rather than replacing it. *So:* an
app that drills words deliberately is not a compromise. It is the
efficient strand.
[Nation's four-strands](https://www.victoria.ac.nz/__data/assets/pdf_file/0003/1626123/2012-Yamamoto-Four-strands.pdf)
framing says the same thing — language-focused learning is one of four
legitimate strands, not a guilty one.

**Spaced beats massed, robustly.** Kim & Webb's 2022
[meta-analysis in *Language Learning*](https://onlinelibrary.wiley.com/doi/10.1111/lang.12479)
pooled 98 effect sizes from 48 experiments
(N = 3,411) and found spaced practice reliably better for L2 learning.
*So:* the scheduling matters at least as much as the items. An app that
shows 20 random words is doing the weaker half.

**Recognition retrieval works.** The intuition that production always
beats multiple choice does not hold up: meta-analytic work finds MC
retrieval at least as effective as free and cued recall at producing
testing effects. *So:* **this app's four-option control is not a
limitation for vocabulary.** It is a legitimate retrieval format — and it
happens to be the exact format the exam uses.

**Retrieval beats rereading.** *So:* the vocabulary feature must be a
drill, not a word list to scroll. A page of 570 words is a reference, not
a study tool.

### 5.4 What a vocabulary feature looks like here

**Content: no schema change at all.** A vocabulary item *is* the existing
shape — a short context with one blank and four options — with content
words instead of verb forms:

```json
{
  "id": "vocab-v1",
  "category": "AWL Sublist 1",
  "paragraph": "The committee could not ____ the two accounts of the incident, since each witness insisted the other was mistaken.",
  "options": ["reconcile", "reconsider", "reinforce", "reallocate"],
  "correctIndex": 0,
  "explanation": "**reconcile** — bağdaştırmak, uzlaştırmak. Cümlede iki tanığın birbirini yalanlaması var, yani komisyonun elinde çelişen iki anlatı var… 'reconsider' (yeniden düşünmek) burada anlamsız, çünkü…",
  "tip": "reconcile A with B — birbiriyle çelişen iki ifadeyi/rakamı bağdaştırmak."
}
```

Distractors drawn from the same AWL family or the same sublist are what
make it exam-like: *reconsider / reinforce / reallocate* are all plausible
academic verbs, and only the argument of the sentence picks one. The
Turkish gloss opens the `explanation`, where the schema already puts the
teaching, so one item delivers both the contextual reading and the
word-pair form–meaning link the research says is the efficient part.

**The category needs deciding, and sublist numbers are the wrong
answer.** `"AWL Sublist 1"` is an authoring bucket, not something a
learner recognises, and the results screen would show them "you are weak
in Sublist 3", which means nothing and links to no lesson. Group by
something a learner can act on — `"Research & Evidence"`,
`"Cause & Effect"`, `"Change & Trend"` — and keep the sublist as an
authoring note, not a category. This is the same taxonomy question as the
reading skills in §4.4, and it wants answering once for both.

**So the only new code is the scheduling** — and that is genuinely new.
`js/storage.js` today stores attempt history, lesson progress and a name.
It has no per-item state, and spacing needs some. The smallest honest
version is a **Leitner box**: five levels, an item answered right moves up
a level, wrong drops to level 1, and each level has a delay
(1 / 2 / 4 / 8 / 16 days). Perhaps 60 lines in `storage.js` plus a session
builder in `quiz-engine.js` that selects by due date instead of at random.
Profil's reset must clear it alongside `clearHistory()` and
`clearLessonProgress()`, and it is per-browser and unbacked like
everything else — which for a word schedule is a real loss and should be
said in the UI once.

**Where it goes: not a fourth tab.** The navigation is settled and it was
settled by the owner. Vocabulary is a *session type*, and session types
already live on the Test tab beside "mixed test" and "practise a weak
category". Put it there: a "Kelime" entry that starts a due-items session
and, when nothing is due, says so and offers new words instead. The quiz
screen, the answer control, the feedback block and the results screen all
work unchanged.

**What I would not build: a flashcard flip.** A tap-to-reveal card is the
same species as the story-card format the owner already rejected as a
gimmick, it is a worse retrieval format than a forced choice, and it is
not what the exam asks for. The four-option control is better on all
three counts.

---

## 6 · How much content this actually needs

### 6.1 The number

A credible preparation app for this paper needs roughly this, and I will
justify each line:

| Section | Items | Why this many |
| --- | --- | --- |
| Reading | 20–30 passages → **140–210 items** | Reading is 17.5% and the gate. Twenty passages is enough for the five skill categories to each get 25–40 items — the minimum for the weak-spot breakdown to say anything true. |
| Vocabulary | **360** | AWL sublists 1–3 = 180 families (60 per sublist), two items each so a family is met in two contexts. Sublists 4–10 double it later. |
| Cloze | 12–15 passages → **120–150 blanks** | Ten blanks per passage, and a learner needs to have seen the mixed grammar/lexis/discourse blend enough times to stop being surprised by it. |
| Restatement | **120** | Twelve papers' worth. The item type is pattern recognition over a closed set of transformations; ~120 covers them with repetition. |
| Paragraph completion | **60–80** | Ten-plus papers' worth. Fewer items than the others because there are fewer distinct cohesion patterns. |
| Grammar (existing shape) | **150** | The current 72 plus conditionals, relative clauses, noun clauses, gerund/infinitive, discourse markers, articles/prepositions. Substrate, not a section. |
| **Total** | **≈ 950–1,070** | |

**The app has 72.** That is roughly **7%** of a credible corpus, and all
of it in the one category that is 7% of the exam's needed volume.

### 6.2 The realistic path

That number is intimidating and mostly shouldn't be. Three things make it
tractable, and one makes it hard.

**Passages amortise.** One 350-word reading passage costs perhaps an hour
of careful authoring and review and yields seven items. One cloze passage
yields ten. Per *item*, the passage types are the **cheapest** content in
the table, not the dearest — the opposite of the intuition. 30 reading
passages plus 15 cloze passages is ~45 units of work for ~360 items.

**Vocabulary is enumerable.** 180 word families is a list you can work
through and finish. Twenty families a session is nine sessions for
sublists 1–3 at one item each, eighteen for two.

**The three existing topics are a working precedent.** 72 questions and 18
lessons already came out of the agent loop in `docs/agents/`. Whatever the
per-session throughput was, it is measurable now, and it is the only
honest input to a schedule.

**And the bottleneck is review, not generation.** `CONTENT_GUIDE.md`
already names the two things a validator cannot check — whether a
`pitfall`'s wrong and right differ in exactly the taught thing, and whether
a `decision`'s signals really decide. The new types add worse versions of
the same problem: **only a human can tell whether three distractors are
genuinely wrong**, and a plausible-looking reading question with two
defensible answers is much more damaging than a bad grammar question,
because it teaches the learner to distrust their own reading. A generated
passage set that nobody read carefully is negative value.

So the schedule is set by how many items one person can *read*, not how
many an agent can write. If that is 30 items an evening, 950 items is
roughly 32 evenings of review — which is a real answer, and a much better
planning number than "write more content".

### 6.3 What order to author in

By marks-per-hour, not by section size:

1. **Restatement** — no engine work, highest exam weight per authored
   item, and it exercises the grammar the app already teaches. Start here.
2. **Vocabulary, AWL sublist 1** — no engine work either once scheduling
   exists; and it is the ingredient every other section needs.
3. **Reading passages** — the gate. Expensive per unit, cheap per item.
4. **Cloze passages** — shares the engine change with reading, so it
   costs almost nothing once reading ships.
5. **Paragraph completion** — smallest weight, and the hardest items in
   the document to write well. Last.

---

## What I would build for v1

Ordered. Each line gives code size and content size separately, because
they are different bottlenecks with different people on them.

**1 · Exam mode.** A timed block with feedback deferred to the results
screen, back-navigation within the block, and a score expressed against
the 60 line. *Code: ~1 day. Content: none.* It is first because it costs
nothing in content and it fixes the mismatch in §3 — the app currently
trains a habit the paper punishes. Nothing else here has that ratio.

**2 · Restatement items.** `type: "restatement"`, a CSS pass so a
three-line option survives 320px, a validator branch. *Code: ~1 day.
Content: 40 items to ship, 120 to be credible.* 12.5% of the paper, and it
is the exam's use of the grammar the app already teaches — the Tenses,
Modals and Passive topics stop being background and start being the
answer to an actual item type.

**3 · Vocabulary, AWL sublists 1–3.** Items need no schema change at all;
the work is the Leitner scheduling in `storage.js`, a due-date session
builder, and a "Kelime" entry on the Test tab. *Code: ~2–3 days. Content:
180 items to ship (one per family), 360 to be credible.* It is the
ingredient every other section runs on.

**4 · Reading passages.** The units change in `buildQuizSession`,
`context` carried through `scoreSession`, the `<details>` passage
disclosure, the `checkPool` guard, and a skill taxonomy
(`Main Idea` / `Inference` / `Reference` / `Vocabulary in Context` /
`Author's Attitude`). *Code: ~1 week. Content: 10 passages / 70 items to
ship, 25 passages to be credible.* Highest exam weight of anything
buildable, and it is the gate.

**5 · Reading-skill lessons in Eğitim.** Five short lessons, one per skill
category, so the results screen's category→lesson link does not dead-end
on the new taxonomy. *Code: none — the block schema already fits.
Content: 5 lessons.* Ship with #4 or the feature is half-wired.

**6 · Cloze passages.** `appendBlanked` grows numbered blanks; the unit
change is already paid for by #4. *Code: ~2 days. Content: 8 passages /
80 blanks to ship.*

**7 · Paragraph completion.** *Code: ~half a day. Content: 40 items.*
Smallest weight, hardest items; last for both reasons.

**8 · Grammar top-up.** Conditionals, relative clauses, noun clauses,
gerund vs infinitive, discourse markers, articles and prepositions.
*Code: none. Content: ~80 questions.* Not because grammar is the exam,
but because it is the substrate the other six sit on, and the current six
categories per topic leave real holes — discourse markers in particular
are cloze blanks *and* paragraph-completion cues *and* essay marks.

**9 · Essay-structure lessons.** Cause / effect / opinion macro-structure,
thesis statements, topic sentences, the 350-word budget, and two annotated
model essays. *Code: none. Content: 4–5 lessons.* Teaching, explicitly not
grading — see below.

Total: perhaps **two to three weeks of code** and, at 30 reviewed items an
evening, **a couple of months of content** to reach the "credible" column
rather than the "ship" column. Both numbers are honest and neither is
heroic.

---

## What I would defer

**Listening — 25% of the paper, and the biggest thing I am not
recommending.** The hosting is genuinely fine: a three-minute mono
speech recording at 32 kbps Opus is ~700 KB, forty of them ~30 MB, well
inside GitHub Pages' [1 GB site limit and 100 GB/month soft bandwidth
allowance](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
For a handful of friends, bandwidth is not a number worth computing.

What stops me is everything else:

- **Producing it.** The İYS listening is two recordings with two distinct
  task types, one of them note-taking from a single hearing. That means
  authentic-sounding academic monologue with natural pacing, hesitation
  and varied accents. One person's realistic source is TTS, and TTS
  removes exactly the features the note-taking task tests.
- **It breaks the content contract.** "Adding content never requires
  touching JavaScript, it's all JSON" stops being true the moment content
  is a binary asset, and a repo whose content diffs are currently readable
  acquires blobs.
- **The accessibility question is real and interesting.** WCAG 1.2.1
  wants an alternative for prerecorded audio, and a transcript alongside a
  listening test invalidates it. The honest resolution — and the one
  1.1.1's own test exception points at — is a transcript revealed *after*
  the attempt, which a study app should do anyway. That is a design
  decision worth making deliberately rather than discovering.

**Pick it up when:** there is a real recorded source (past-paper audio the
school publishes, or a teacher willing to record), and reading, vocabulary
and restatement are all shipped. Not before — listening is 25% of the
paper but 0% of the gate, and a student who cannot clear session 1 never
hears it.

**A guided learning path.** Already deferred in the README for good
reasons, and this document makes it more deferrable, not less: a path
through three grammar topics is not the path this exam needs. Revisit once
there are five or six sections' worth of content for a path to be *through*.

**Word formation as its own item type.** Fold the derivations into the
vocabulary items first (`analyse / analysis / analytical` as the four
options of an ordinary blank). Split it out only if the results breakdown
shows it behaving as a distinct weakness.

**Migrating from the AWL to Gardner & Davies' Academic Vocabulary List.**
The AWL's criticisms are real, but the 180 families of sublists 1–3 are the
same words either way. Look at the AVL when sublists 4–10 come up.

**YDS-family item types the İYS does not use** — translation, dialogue
completion, irrelevant-sentence, isolated vocabulary and isolated grammar
MCs. Pick these up only if the owner's actual target turns out to be YDS
or YÖKDİL, which is the first open question below.

---

## What I would refuse

**Grading the essay.** 25% of the paper, and a static app with no backend
and no model cannot mark it. What it could do instead is worse than
nothing: a `<textarea>`, a word counter, and no feedback gives a learner
the feeling of having practised writing while telling them nothing about
whether the writing was any good — and on a section where the difference
between 10 and 18 marks decides the exam, a false signal is actively
harmful. Teach the essay (item 9 above). Do not pretend to score it. If
the owner wants writing feedback, the right answer is a human reader or a
paid API, and neither belongs in this repo.

**Speaking.** No source describes a speaking component on the İYS, and
building one would be building for a different exam. Even if there were,
recording and assessing speech is categorically outside a static
localStorage app.

**Auto-generating reading passages and shipping them unread.** The
volume in §6 will tempt this. A reading item with two defensible answers
does more damage than ten bad grammar items, because it teaches a learner
to distrust a correct reading. If the review budget will not cover a
section, ship less of that section — do not ship it unreviewed.

**A fourth item in the bottom nav.** The navigation was settled by the
owner's own feedback, twice. Vocabulary is a session type and belongs
beside the other session types on the Test tab.

**A flashcard flip for vocabulary.** Same species as the story-card format
already rejected, a weaker retrieval format than forced choice, and not
what the exam asks the learner to do.

**Any claim in this document presented to a student as fact about their
exam** until §0's sample paper has been checked. I could not reach a
primary source. The numbers are consistent and probably right; "probably
right" is not the standard for something a person schedules a year of
their life around.

---

## Open questions for the owner

**1 · Which exam, exactly, and when?** Everything above assumes YTÜ's
İYS. If the target is actually İTÜ's proficiency, drop cloze and paragraph
completion — İTÜ's session 1 is restatement plus reading only, and the
priority order changes. If it is YDS or YÖKDİL, half this document is
wrong: no listening, no writing, and five item types the İYS never uses.
**The date matters as much as the exam.** Three sittings — September,
January, June. If the next one is weeks away, the answer is item 1 and
item 2 and nothing else; if it is June, the whole list is reachable.

**2 · Can you get the sample paper?** `ybd.yildiz.edu.tr` publishes
example proficiency exams and a students' booklet. Ten minutes with the
real paper settles the 40-vs-45 item count, the 25-vs-30 gate, the
session-1 duration, the exact blank-type mix in the cloze, and the passage
length — all of which this document is guessing at, and all of which
change content specifications.

**3 · What score do you need — 60 or 70?** 60 passes. Sources say 70 also
exempts you from Advanced English I and II. Those are different
preparation targets: 60 is "clear the gate and write an organised essay",
70 is "read fast and know the words".

**4 · Are your friends sitting the same paper?** If any of them is at
İTÜ, Boğaziçi or Marmara, restatement, reading and vocabulary transfer
completely and cloze and paragraph completion do not. That decides whether
this app is a YTÜ tool with general parts or a general tool with a YTÜ
section — and it is a content-taxonomy decision, so it wants deciding
before 900 items are authored.

**5 · How many items an evening can you actually read?** §6 says the
schedule is set by review capacity, not authoring capacity. Your real
number turns 950 items into a date. If the answer is "not many", the right
plan is one section done properly — reading, on the gate argument — rather
than six sections at a quarter depth.

**6 · Are you comfortable with Turkish glosses in vocabulary items?**
The content rules already put teaching in Turkish, so a gloss in the
`explanation` follows the existing convention. But it is a pedagogical
choice with opinions attached, and it is yours.

---

## Sources

**Confidence note.** Direct fetches were blocked for every domain below;
these are the pages the search index surfaced and summarised. YTÜ's own
pages (`ybd.yildiz.edu.tr`) are the authority for §1 and were reachable
only through that index. The structural detail — item counts, points,
durations — comes from commercial prep-school pages, which agree with each
other on the shape and disagree on some of the numbers.

**YTÜ İYS**
- [YTÜ Yabancı Diller Yüksekokulu — TİB Öğrencileri İçin](https://ybd.yildiz.edu.tr/temel-ingilizce/tib-ogrencileri-icin)
- [YTÜ YDYO — Sıkça Sorulan Sorular](https://ybd.yildiz.edu.tr/temel-ingilizce/sikca-sorulan-sorular)
- [YTÜ YDYO Yönergesi (PDF)](https://ybd.yildiz.edu.tr/sites/ybd.yildiz.edu.tr/files/YDYO%20Y%C3%B6nergesi%2031_10_2023.pdf)
- [YTÜ SFL DBE Students' Booklet 2023–24 (PDF)](https://ybd.yildiz.edu.tr/sites/ybd.yildiz.edu.tr/files/3.ytu-sfl-dbe-students-booklet-for-2023-2024-academic-year.pdf)
- [YTÜ İYS sınav içeriği — ytuhazirlik.com](https://ytuhazirlik.com/ytu-iys-hazirlik-atlama-sinav-icerigi-sorulari/)
- [YTÜ İYS sınav içeriği — İstanbul Dil Akademisi](https://istdilakademisi.com/ytu-iys-sinav-icerigi-cikmis-sorular-hazirlik-atlama)
- [YTÜ İYS örnek Cloze Test 1 — İstanbul Dil Akademisi](https://istdilakademisi.com/materyal/ytu-ingilizce-yeterlilik-sinavi-ornek-sorular-cloze-test-1)
- [YTÜ İYS — W.O.L.A.](https://wola.com.tr/yildiz-teknik-universitesi-iys/)

**Neighbouring exams**
- [İTÜ Yabancı Diller — Yeterlik Sınavı](https://ydy.itu.edu.tr/programlar/lisans-hazirlik-programi/yeterlik-sinavi)
- [İTÜ Proficiency sınav içeriği — ituhazirlik.com](https://ituhazirlik.com/itu-proficiency-sinav-icerigi/)
- [Boğaziçi YADYOK — Testing and Assessment Unit](https://yadyok.bogazici.edu.tr/en/pages/testing-and-assessment-unit/2399)
- [Boğaziçi — English Proficiency and Exemption](https://globalstudents.bogazici.edu.tr/en/pages/english-proficiency-and-exemption/3020)
- [YDS soru dağılımı — Uzman İngilizce](https://www.uzmaningilizce.com/sss/yds_e_ydsde_soru_dagilimi_nasildir)
- [YDS soru tipleri — Angora Dil](https://angoradil.com/blog-detay/yds-soru-turleri/34)
- [YDS as a benchmark in Turkey: difficulty levels of reading comprehension questions (DergiPark, PDF)](https://dergipark.org.tr/tr/download/article-file/2592293)

**Vocabulary — lists and coverage**
- [Coxhead, A. (2000). A New Academic Word List. *TESOL Quarterly*](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951)
- [Academic Word List — EAP Foundation](https://www.eapfoundation.com/vocab/academic/awllists/)
- [Word lists for academic English — EAP Foundation](https://www.eapfoundation.com/vocab/wordlists/overview/)
- [The New General Service List](https://www.newgeneralservicelist.com/new-general-service-list)
- [Which Word List Should I Teach? — THAITESOL Journal (PDF)](https://files.eric.ed.gov/fulltext/EJ1257894.pdf)
- [Kremmel et al. (2023). Unknown Vocabulary Density and Reading Comprehension: Replicating Hu and Nation (2000). *Language Learning*](https://onlinelibrary.wiley.com/doi/10.1111/lang.12622)
- [Laufer & Ravenhorst-Kalovski — Lexical text coverage, learners' vocabulary size (PDF)](https://files.eric.ed.gov/fulltext/EJ887873.pdf)

**Vocabulary — how it is learned**
- [Kim & Webb (2022). The Effects of Spaced Practice on Second Language Learning: A Meta-Analysis. *Language Learning*](https://onlinelibrary.wiley.com/doi/10.1111/lang.12479)
- [Rogers — Repetition, Retrieval, and Spaced Practice (Wiley)](https://onlinelibrary.wiley.com/doi/10.1002/9781405198431.wbeal20349)
- [Webb (2007). Learning word pairs and glossed sentences. *Language Teaching Research*](https://journals.sagepub.com/doi/10.1177/1362168806072463)
- [Nakata (2017). Does repeated practice make perfect? *SSLA*](https://www.academia.edu/26222046/)
- [Applying the Four Strands to Language Learning (Victoria University of Wellington, PDF)](https://www.victoria.ac.nz/__data/assets/pdf_file/0003/1626123/2012-Yamamoto-Four-strands.pdf)
- [Retrieval Practice in Classroom Settings: A Review of Applied Research. *Frontiers in Education*](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00005/full)

**Constraints**
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
