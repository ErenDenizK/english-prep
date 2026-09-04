# Orientation

Whether the app should teach *what a grammar area is* before it teaches
the contrasts inside it, where such a thing would live, what would be in
it, and what it would cost.

Written 2026-09-04 against the 8-topic build. The owner's complaint, in
his words paraphrased: the articles are good, but for a first-time reader
they are suffocating, because the app goes straight at the important
headings — X vs Y — with no general "what are these" introduction to the
main headings. He thinks that would also improve onboarding.

**The short version.** He is right about the gap and half right about the
fix. Every one of the 48 lessons is a contrast and nothing in the running
app ever says what a relative clause, a modal or the passive *is* — but
the missing thing is smaller than "an introduction", the evidence for
adding a long one is weaker than it looks, and the evidence against
adding one to the *front of every lesson* is stronger than it looks.
What the literature actually supports is a **short, structural,
skippable, once-per-topic** orientation: the names of the parts, the two
questions the topic's six lessons divide between them, and the reading
order. Not a concept essay. And it is not an onboarding fix — §5 answers
that directly and the answer is mostly no.

Three things found in the repository change the cost of all of this, and
none of them was in the brief:

- **The orientation already exists for three topics, orphaned in the
  data.** `data/tenses/tenses.json:6`, `data/modals/modals.json:6` and
  `data/passive-voice/passive-voice.json:6` still carry a topic-level
  `overview` object — 1,011–1,308 characters of Turkish body plus key
  points each — written 2026-09-03 for the article-era reader and
  stranded by the block redesign. No code reads it (`grep -rn overview
  js/` is empty) and the validator does not know it is there.
- **It exists again, for five more topics, in developer prose.** Every
  category spec written since — `docs/agents/relative-clauses-spec.md`,
  `quantifiers-spec.md`, `connectors-spec.md`,
  `gerunds-infinitives-spec.md`, `closest-meaning-spec.md` — opens with a
  section called "the one fact the whole topic is built on" or "what this
  topic is". That is the orientation, written for an agent instead of a
  learner.
- **Every lesson's first block is already half of it.** All 48 lessons
  open on a `text` block of 227–394 characters that names the Turkish/
  English divergence for that category. So the app is not silent about
  L1 contrast; it is silent about *category identity*, and any
  orientation that repeats the L1 point is redundant by construction.

**The same caveat as every other file in this directory.** Network egress
blocks the publishers: `sciencedirect.com`, `link.springer.com`,
`journals.sagepub.com`, `eric.ed.gov`, `files.eric.ed.gov`,
`semanticscholar.org`, `pedocs.de` and `en.wikipedia.org` were all
refused from this session. Every effect size below therefore comes from a
search index's summary of the abstract rather than from the paper.
Numbers I could not corroborate across at least two independent summaries
are marked **unverified**. Numbers measured from this repository — every
pixel figure, every count — were measured here, in Chromium at 320×640,
and are not affected.

---

## 0 · What is actually on screen today, measured

The owner's factual claim checks out, with one qualification.

**All 48 lessons are contrastive.** Counted from `data/manifest.json`:
8 topics × 6 categories, and every category name is a versus — *Who vs
Whom vs Whose*, *Much vs Many vs A Lot Of vs Plenty Of*, *Third
Conditional vs Mixed Conditional*, *Used To vs Be Used To vs Get Used
To*. There is no category anywhere in the corpus that names a single form
or a grammatical area. That is deliberate — `docs/agents/README.md` makes
it a rule of the kickoff ("each category names a **confusable pair or
triad**, not a single form") — and `docs/CONTENT_GUIDE.md:49` gives the
reason: real exam difficulty lives in confusing similar forms.

**The qualification.** The first block of every lesson is a `text` block
that does frame the category against Turkish. Measured lengths, first
block per lesson, by topic:

| Topic | First-block `text` lengths (chars) |
| --- | --- |
| `tenses` | 263, 301, 345, 250, 287, 241 |
| `modals` | 295, 301, 282, 261, 266, 289 |
| `passive-voice` | 348, 291, 273, 327, 301, 311 |
| `closest-meaning` | 272, 227, 266, 311, 291, 280 |
| `connectors` | 333, 259, 295, 287, 279, 302 |
| `quantifiers` | 359, 270, 292, 343, 325, 318 |
| `relative-clauses` | 374, 284, 294, 334, 320, 290 |
| `gerunds-infinitives` | 361, 364, 357, 378, 334, 394 |

`relative-clauses` lesson 1 opens: *"Türkçede ilgi cümlesi ismin **önüne**
gelir ve ortada hiçbir zamir yoktur: 'okuduğum kitap', 'bizi arayan
adam'. İngilizce bunu tersine çevirir…"* That is a genuine orientation
sentence. So the app is not as bare as the complaint implies — but it is
**bare in exactly the place the complaint lands**:

1. It is the *lesson's* framing, not the *topic's*. It explains why *this
   pair* is confusable, not what the six lessons above it are collectively
   about.
2. It only reads as an introduction when you enter through lesson 1. A
   learner who arrives from the results screen — which links a wrong
   answer straight to the category that teaches it, `renderBreakdown`
   (`js/results.js:97`) — can land on *Preposition + Relative Pronoun: In
   Which / For Whom / Of Which* as the first Eğitim screen they ever see.
3. It never names the parts. Nowhere in the running app do the words
   *öncül*, *yan cümle*, *ilgi zamiri* get introduced before they are
   used. (`öncül` appears 50 times inside `relative-clauses.json`, and its
   first appearance is inside a `contrast` gloss that assumes it.)

**Sizes, measured in Chromium at 320×640** (scroll region 524px, fold at
580):

| | |
| --- | --- |
| Eğitim index, total content height | **4,564 px** — 8.7 screens |
| Lesson rows | 48; heading labels 16px; rows 62px or 82px |
| Rows whose *English title* wraps to two lines at 320 | **31 of 48** |
| Welcome card (first run) | 384px; first lesson row at y=512 |
| `relative-clauses` lesson 1, reader | **5,807 px** — 9.1 screens |
| `relative-clauses` lesson 4, reader | 5,826 px |
| `tenses` lesson 1, reader | 4,461 px |
| A ~350-char `text` block, rendered | ~234 px |
| A legacy `overview.body` (3 paragraphs, ~1,150 chars) would render | ~750–900 px, ~1.5 screens |

Those numbers are the budget every option in §2 spends from.

### 0.1 · The app has already promised this, in Turkish, to the learner

Found after the rest of this file was drafted, and it changes the staging
question rather than the design one. Commit `1e523d8` — "An in-app
roadmap in Profil, and the development banner retires into it" — added
`data/roadmap.json`, a short editorial list rendered in Profil with
`done` / `next` / `planned` chips. Its fifth row reads:

> **Konu girişleri** — *Her konunun başında 'bu nedir' anlatan kısa bir
> bölüm. Şu an dersler doğrudan karşılaştırmayla başlıyor.*
> `status: "next"`

So the feature this document is evaluating is already on screen, in the
app, marked **next**, sitting beside `Kelime` ("Yazıldı, denetimi
bekliyor"). Three consequences:

1. **The question is no longer whether.** It is what shape and in what
   order, which is §2 and §6.3.
2. **The promised shape is (a)/(e2), not (c2).** *"Her konunun başında"*
   — at the start of each **topic**, not each lesson. That is the option
   this file ranks third and would build after vocabulary, and it is the
   one the learner has been told about.
3. **The roadmap row is itself a claim the app has to keep true.**
   `docs/roadmap.md`'s honesty criterion applies to it: a `next` row that
   stays `next` for months is the same species of stale claim the dev
   banner was retired for.

`data/roadmap.json` also settles a small question §2 would otherwise have
had to argue: **a validated, non-content JSON file in `data/` is now an
established pattern** (`validateRoadmap` in
`tools/validate-content.mjs:756`). An orientation could live in one
rather than inside the topic files. I would still put it in the topic
file — it is content about a topic and it belongs where that topic's
lessons are, and `format-content.mjs` already copies a derived index of
topic-file content into the manifest — but the alternative is no longer
unprecedented.

---

## 1 · Is an orientation layer justified, or is it intuition?

Five bodies of evidence bear on this and they do not agree. Two are for,
two are against, and the fifth — the one that matters most here, because
this app's users are not novices — says it depends on who is reading.

### 1.1 For: the pre-training principle

This is the most on-point finding in the literature, and it is almost
literally the owner's proposal. Mayer's **pre-training principle** is
that people learn more deeply from a lesson when they already know *the
names and characteristics of the main concepts*. Reported as supported in
**7 of 7 experimental tests with a median effect size of 0.92**
([Mayer, *Principles for Managing Essential Processing*, Cambridge
Handbook of Multimedia Learning ch. 11](https://www.cambridge.org/core/books/abs/the-cambridge-handbook-of-multimedia-learning/principles-for-managing-essential-processing-in-multimedia-learning-segmenting-pretraining-and-modality-principles/4110A2275F6DCD02DAB1F8B37BA7E5CE)).

Note what pre-training *is* in those experiments: the learner is told the
names of the components of a system — the parts of a car braking system,
the parts of a pump — and what each one does, before seeing the
explanation of how the system works. It is a **parts list**, not a
conceptual essay. The mechanism claimed is cognitive-load management:
naming the components in advance removes one of the two things the
learner would otherwise be doing at once.

Two honesty notes. Seven tests is a small evidence base for a median that
large. And the 2025 meta-analysis of Mayer's own corpus reports that
pre-training effects were **non-significant for factual learning
outcomes**, though it holds elsewhere
([Cromley & Chen, *A meta-analysis of Richard Mayer's multimedia learning
research*, Educational Research Review 49 (2025) 100730](https://www.sciencedirect.com/science/article/pii/S1747938X25000673)).
The criterion task here — pick one of four pronouns — sits closer to
transfer than to factual recall, which cuts the right way, but that is an
argument by analogy, not a finding.

**What this licenses:** naming the parts. *Öncül*, *ilgi zamiri*, *yan
cümle*, and what each does. **What it does not license:** three
paragraphs about what relative clauses mean.

### 1.2 For, weakly and with an old fight attached: advance organizers

Ausubel's advance organizer is the classical version of this proposal and
its evidence is genuinely mixed, which is not how it is usually cited.

- [Luiten, Ames & Ackerson (1980)](https://journals.sagepub.com/doi/abs/10.3102/00028312017002211),
  *American Educational Research Journal* 17(2), 211–218, meta-analysed
  **135 published and unpublished studies** and found a **small
  facilitative effect on both learning and retention, reported as d ≈
  0.21, with the effect increasing over the retention interval**. The
  0.21 figure is **unverified**: every route to the paper and to its ERIC
  record was blocked, and it comes from a single search-index summary.
  The direction and the "small" characterisation appear in two
  independent summaries.
- [Stone (1983)](https://www.tandfonline.com/doi/abs/10.1080/00220973.1983.11011862),
  *Journal of Experimental Education* 51(4), 29 reports yielding 112
  studies, also positive.
- Against both, [Barnes & Clawson (1975)](https://journals.sagepub.com/doi/10.3102/00346543045004637),
  *Review of Educational Research* 45(4), 637–659, analysed 32 studies
  and concluded advance organizers do **not** reliably facilitate
  learning. Ausubel replied in the same journal three years later
  ([*In Defense of Advance Organizers*, RER 48(2)](https://journals.sagepub.com/doi/10.3102/00346543048002251)),
  arguing that most of the "organizers" tested were not organizers in his
  sense at all — they were summaries and overviews at the same level of
  abstraction as the material, whereas an advance organizer is defined as
  being at a *higher* level of abstraction and generality.

That last point is the one worth carrying, because it is a design
constraint rather than a debating position: **if what gets written is a
preview of the six lessons, it is not an advance organizer and the
0.21 does not apply to it.** A table of contents is not a schema.

On whether organizers help low-prior-knowledge learners more, the
evidence I could reach is genuinely mixed and I will not pretend
otherwise: some studies report benefit confined to weaker readers, at
least one reports the reverse, and at least one reports both groups
benefiting. There is no meta-analytic moderator estimate I could verify.

### 1.3 Against: the coherence principle and seductive details

Everything added to a lesson is also a cost, and this is the best-measured
cost in the set.

Mayer's **coherence principle** — people learn better when extraneous
material is excluded — is reported as supported in **23 of 23
experimental tests, median effect size 0.86** (same chapter source as
§1.1, so treat the two medians as coming from one author's own tally).
The independent meta-analysis is smaller and more credible:
[Sundararajan & Adesope (2020), *Keep it Coherent: A Meta-Analysis of the
Seductive Details Effect*, Educational Psychology Review 32(3), 707–734](https://link.springer.com/article/10.1007/s10648-020-09522-4),
pooled **177 effect sizes from 50 studies** and found interesting-but-
inessential additions harming learning at **g = −0.16 overall**
(comprehension −0.19, recall −0.17, transfer −0.12), mediated by
increased *extraneous* cognitive load.

Small, but it is the right size of number for this decision, because the
thing being proposed is small. An orientation that is *interesting*
rather than *load-bearing* — the history of the relative pronoun, a note
on how English compares to German — is a seductive detail with a heading.
And the app's own first-block `text` already carries the L1 contrast, so
an orientation that repeats it is extraneous **by construction**, not by
bad luck.

### 1.4 Against, and this one is uncomfortable: productive failure

The app already implements a small version of the opposite intervention.
`renderPretestBlock` (`js/education.js:821`) puts one question at the top
of an unread lesson, before a word of it has been taught, and tells the
learner they are expected to get it wrong.

The evidence for that ordering is stronger than the evidence for
pre-training. [Sinha & Kapur (2021), *When Problem Solving Followed by
Instruction Works: Evidence for Productive Failure*, Review of
Educational Research 91(5), 761–798](https://journals.sagepub.com/doi/10.3102/00346543211019105)
meta-analysed **53 studies, 166 comparisons, more than 12,000
participants** and found problem-solving-then-instruction beating
instruction-then-problem-solving at **g = 0.36 [0.20, 0.51]**, rising to
around **d = 0.58** at high fidelity to the design principles.

A block that explains the concept before anything is attempted is,
precisely, the I-PS arm. This does not kill the proposal — the
preparatory phase in productive-failure designs is not "no information",
and a recent experiment (165 secondary students) found that **partial**
activation of relevant prior knowledge before instruction prepares
learners at every prior-knowledge level, so full coverage of the concept
is not required
([*Prior knowledge activation as preparation prior to instruction*,
Instructional Science 53, 1633–1661 (2025)](https://link.springer.com/article/10.1007/s11251-025-09727-6)).
But it does say something sharp about *placement*: **the orientation must
not get between the learner and the pretest.** If it ships as a block at
the top of the lesson (§2c), it either displaces the pretest or pushes it
below the fold — and the pretest is already 279px down at 320
(`user-flow.md` §J1, friction 2).

### 1.5 The one that decides it: expertise reversal

This is the strongest argument against, and it is the one the brief
correctly identified, because this app's users are Turkish students with
years of English behind them sitting a proficiency exam. Some of them
already have the category.

The current meta-analysis is
[Tetzlaff, Simonsmeier, Peters & Brod (2025), *A cornerstone of
adaptivity — A meta-analysis of the expertise reversal effect*, Learning
and Instruction 98, 101100](https://www.sciencedirect.com/science/article/pii/S0959475225000660)
— **176 effect sizes, 60 experimental studies, 5,924 participants**:

- low prior knowledge learners learn better from **high-assistance**
  instruction, **d = 0.505**;
- high prior knowledge learners learn better from **low-assistance**
  instruction, **d = −0.428**;
- moderated by educational status and content domain;
- and — the finding that decides the design — the effect is
  **asymmetrical: giving assistance to novices helps more than
  withholding it from experts hurts.**

That asymmetry is the whole answer to the brief's question, and it is
worth stating as plainly as possible: **on this evidence the cost of
showing an orientation to someone who does not need it is real and
smaller than the benefit to someone who does — provided he can get past
it in one gesture.** An orientation that is one tap away costs the expert
one tap. An orientation that is 250px at the top of all 48 lessons costs
him 48 scrolls, and it costs him them again on every re-read, which is
exactly the population `learning-design.md` §1 already identified as
needing a *different* presentation of a completed lesson.

The repo's own file already reached half of this conclusion from the
other end: *"A learner reopening a completed lesson two weeks later does
not need the contrast re-explained."* The same sentence is true of the
orientation, six times per topic.

### 1.6 The L2-specific evidence, which is the thinnest part

The brief asked specifically about prerequisite/schema knowledge in L2
grammar instruction. This is where I have the least to offer and the
honest report is that **the L2 literature does not establish that a
learner needs the category label to use the form.**

Two findings pull opposite ways, and both are about *metalinguistic
knowledge* — knowing and being able to state grammatical facts and terms,
which is the closest operational analogue of "knowing what a relative
clause is":

- [Roehr (2008), *Metalinguistic Knowledge and Language Ability in
  University-Level L2 Learners*, Applied Linguistics 29(2), 173–199](https://academic.oup.com/applij/article-abstract/29/2/173/196477)
  found metalinguistic knowledge — the ability to correct, describe and
  explain L2 errors — **substantially correlated** with proficiency in
  university-level learners, to the point of arguing it and
  language-analytic ability may be one construct.
- [Alderson, Clapham & Steel (1997), *Metalinguistic knowledge, language
  aptitude and language proficiency*, Language Teaching Research 1(2),
  93–121](https://www.lancaster.ac.uk/fass/doc_library/linguistics/alderson/alderson_cv.pdf)
  tested **509 first-year undergraduates** and found the relationship
  between metalinguistic knowledge and general proficiency **weak**,
  concluding that the two are separate factors of linguistic ability.

Neither is a study of *teaching* the terms, so neither supports the
intervention directly; both are correlational. I could not find an
experiment that adds a topic-level conceptual introduction to L2 grammar
instruction and measures the difference, and I looked. The nearest L2
advance-organizer work is about **listening and reading comprehension**,
not grammar
([Sadeghi & Rahmati, *System* 40(1), on advance organizers and EFL
listening](https://www.sciencedirect.com/science/article/abs/pii/S0346251X12000395)),
which is a different construct.

What the L2 literature *does* support, robustly, is the thing this app
already does: explicit, form-focused instruction beats implicit.
[Li & Sun (2024), *Effects of different forms of explicit instruction on
L2 development: a meta-analysis*, Foreign Language Annals 57(1), 229–255](https://onlinelibrary.wiley.com/doi/10.1111/flan.12726)
— 28 reports, 67 samples, N = 3,754 — report **d = 1.07 within-group and
0.81 between-group** for explicit instruction, with the *form* of
explicitness moderating the size. The repo already carries Norris &
Ortega and Spada & Tomita to the same effect (`learning-design.md` §6).
And deductive-versus-inductive comparisons inside explicit instruction
keep coming out near null, which is a warning against believing that
front-loading the rule is inherently better.

There is one Turkish-specific fact worth recording because it supports
the *choice of topic* rather than the intervention: relative clauses are
an attested difficulty for Turkish tertiary EFL learners, and a
Hacettepe prep-school study of 30 philology students found pre-test
results indicating the learners "needed remedial teaching" on relative
clause recognition
([Koçak, *Turkish tertiary level EFL learners' recognition of relative
clauses*, JLLS](https://dergipark.org.tr/en/pub/jlls/issue/59085/850976)).
If one topic gets an orientation first, that is evidence it should be
this one.

### 1.7 The verdict on question 1

**Justified, narrowly, and only in a specific shape.** Stated as
conditions, because a recommendation without them would be intuition
wearing citations:

1. **It is a parts list and a map, not an essay.** Pre-training's
   evidence is about naming components. Coherence's evidence is about the
   cost of everything else. Both point at the same length: short.
2. **It is once per topic, not once per lesson.** Expertise reversal is
   asymmetrical, so one skippable exposure is cheap and six unavoidable
   ones are not.
3. **It does not displace the pretest.** Productive failure is the
   better-evidenced ordering for the thing that follows it.
4. **It does not repeat the L1-contrast sentence the lesson already
   opens with.** That is the coherence principle applied to our own
   content.
5. **It is skippable in one gesture, and the app never requires it.**
   §4.

Fail any of those and the honest description of the change is "we added
900 words of Turkish to a phone app because it felt incomplete", and the
seductive-details number is the one that applies.

---

## 2 · Where does it live?

Five options, four of which were in the brief. Ranked at the end. Costs
are against the measurements in §0.

### (a) A topic-level screen above the lesson list

A real screen at `#egitim/konu/<topicId>`, reached from the index,
showing the topic's orientation and then its six lesson rows.

| | |
| --- | --- |
| **Schema** | One new topic-file field (say `intro`), plus `tools/format-content.mjs` copying a short gloss into the manifest so the index can show an entry point without fetching the topic file, plus validator rules for both. Three files changed together, as `CLAUDE.md` requires. |
| **`js/education.js`** | A new render function (~80–120 lines), a new route branch in `js/home.js` `applyRoute` (the router already splits `#egitim/<param>`; a `konu/` prefix avoids any collision with lesson ids, which are `<topicId>-<slug>`), and an entry point on the index. |
| **Content** | 8 topics × one page. See §6. |
| **320px cost** | Zero on the index if the entry point is folded into the existing topic heading; +62–82px per topic if it is a row. The screen itself is ~800–1,200px, ~2 screens, which is fine because it is a screen you chose to open. |
| **Other** | Three new states for `tools/verify-ui.mjs`; a new screen for the §8 accessibility contract; a `document.title` and an `announce()` string. |

The one real objection is that it introduces a level of navigation the
app deliberately does not have. `docs/education-notes.md` proposed
exactly this in the article era ("the main UI addition is a table-of-
contents / topic overview entry point") and it was never built; the
index went flat instead, and `user-flow.md`'s implemented item 6 settled
the index on **one card and then rows**. A topic screen does not violate
that — it is below the index, not on it — but it does mean the answer to
"where are the lessons" becomes two taps for someone who came in through
a topic.

### (b) A new first lesson per topic — "Genel bakış"

**Refused, and not on taste.** This one is arithmetically blocked by the
project's own invariants:

- `tools/validate-content.mjs:577` raises a hard **error** if a
  lesson's `category` is not used by any question in the topic:
  *"lessons and questions must share one taxonomy"*. A `Genel bakış`
  lesson fails validation unless four questions are written for a
  category that is not a grammar contrast.
- `data/manifest.json`'s `categories` array must match the topic's
  question categories exactly (`CONTENT_GUIDE.md:93`), so the manifest
  would have to lie or the fake category would have to appear in the
  **mixed test pool**, in `getWeakCategories()`, and in the results
  breakdown as a thing the learner can be weak at.
- Every denominator in the app is `lessons.length`. Eight fake lessons
  turn "48 dersten 12 tanesi tamamlandı" into "56 dersten…", and
  `seenEverything` in `renderIndex` (`js/education.js:517`) starts
  requiring the learner to "complete" eight pages of prose before the
  all-done card can appear.
- Lesson ids are derived from the category (`js/topics.js:134`) by a
  slug that strips everything outside `[a-z0-9]`, so `Genel bakış`
  resolves to **`relative-clauses-genel-bak`** — the `ış` is silently
  deleted. That is a permanent, learner-visible URL, in a corpus whose
  ids are otherwise English grammar terms, and it is the kind of thing
  nobody notices until it is in someone's history.

The cost of making (b) work is a schema change plus a validator change
plus special-casing in four screens, to get something (a) gets without
any of them. It is the most expensive option on the list and it looks
like the cheapest, which is why it is worth writing down at length.

### (c) A new block at the top of each lesson

Two versions, and they should not be confused.

**(c1) A new block type.** Refused, and it was already refused twice:
`CONTENT_GUIDE.md:317` ("Seven, and there will not be an eighth without a
reason"), `CLAUDE.md` ("the blocks are the last schema change that should
be forced by a redesign"), and `learning-design.md`'s refusals list ("an
eighth block type for anything in this document"). Nothing here is a new
*kind* of content — it is Turkish prose, which `text` already is.

**(c2) A `text` block with a heading, at the top of each lesson.** Costs
**nothing**: no schema change, no code change, no validator change. An
author can ship it today. That is its attraction and it is also the
problem, because the cost lands entirely on the learner:

- The `text` cap is 400 characters (`CONTENT_GUIDE.md:327`, enforced), so
  the orientation is one paragraph. That is enough for a parts list and
  not enough for a map.
- It repeats six times per topic. Measured: ~250px × 6 = ~1,500px of
  duplicated Turkish per topic, and the identical paragraph is met on
  every re-read. §1.3 and §1.5 both bill for this.
- It sits above or below the pretest. Above, it delays the retrieval
  attempt that §1.4 says is doing the work and pushes the first option
  further below the 320 fold than the 625px `user-flow.md` already
  measured. Below, it interrupts the feedback.
- And the lesson's existing first `text` block is *already* an
  orientation paragraph. Two orientation paragraphs in a row is the wall
  of prose the block schema exists to prevent.
- Its English examples cannot carry `lang="en"` (§3.1, last paragraph),
  so either the parts list has no English in it or the app breaks its own
  language rule 48 times.

The honest version of (c) is not "add a block" but **"rewrite the 48
existing first blocks so each carries one sentence of category
identity"** — which is a content edit, costs no code, and is genuinely
worth doing regardless of what else ships. It is item 2 in the ranking.

### (d) An expandable section on the topic heading in the Eğitim index

| | |
| --- | --- |
| **Schema** | Same as (a) — the text has to come from somewhere. |
| **Code** | A disclosure pattern the app does not have. `aria-expanded` appears in exactly one file, `js/listbox.js`, and the design system's §7 inventory is twelve primitives with no accordion. Adding one means owning the whole contract (`CLAUDE.md`: "Native controls are replaced, so replace their behaviour too"), or using `<details>`, whose styling and animation are the reason it was not used elsewhere. |
| **320px cost** | The index is 4,564px and the eight topic headings are 16px labels at y=488, 996, 1484, 1932, 2440, 3048, 3516, 4064. An expanded panel inserts ~700px in the middle of a list, which moves every row below it — on a screen whose whole design rule is that answering must not move the thing under the learner's thumb. |
| **Other** | It makes the index a place where content opens, which is the one thing `user-flow.md`'s implemented item 6 deliberately stopped: one card, then rows. |

It is the cheapest-*looking* option and the second-worst. The index is a
list of 48 destinations at 8.7 screens; the fix for "this list is
overwhelming" is not to make the list longer in place.

### (e) The two I would actually build

**(e1) A one-line Turkish gloss per topic, in the manifest.** The Eğitim
index is built from `lessonIndex(manifest)` (`js/topics.js:180`) and
never fetches a topic file — that is the 1.7 KB-instead-of-141 KB
decision recorded in the same function's comment. The index today shows
each topic's **English title and nothing else**: `Relative Clauses`,
`Gerunds & Infinitives`, `Closest Meaning`. A `gloss` field on the
manifest topic entry, rendered as a `t-meta` line under the heading,
costs:

- one optional manifest field, one validator rule, one line in
  `renderIndex` and one in `renderTopicList` on the Test tab;
- **~16–20px per topic** (a 16px `t-meta` line plus the stack gap) —
  **~130–160px on a 4,564px index**, under 4%;
- eight Turkish sentences, one hour total;
- no fetch, no new screen, no new route, no new primitive.

It does not answer "what is a relative clause". It answers "what is this
group of six things", which is the smaller half of the complaint and the
half that is currently unanswered on the screen where the complaint is
felt.

**(e2) The topic screen — option (a) — reached from a `Genel bakış` row
at the head of each topic group.** One row per topic: +8 rows,
+62–82px each, **+520–650px on the index, +11–14%**. The row reuses
`renderLessonRow`'s shape (lead slot, title, sub, chevron) so it costs no
new primitive, and it demotes itself once the topic has been opened (§4).

(e1) and (e2) are the same content at two lengths, and (e1) is the first
sentence of (e2). Shipping (e1) alone is a coherent, complete change.
Shipping (e2) without (e1) is not, because the index would then be the
only screen with no answer.

### Ranking of §2

1. **(e1)** — a manifest gloss per topic. Highest value per line of code
   in this document.
2. **(c2), rewritten** — one sentence of category identity in each
   lesson's existing first `text` block. No code at all.
3. **(e2)/(a)** — the topic screen, after the vocabulary topics ship.
4. **(d)** — only if the owner rejects a topic screen outright.
5. **(b)** — refused; see above.
6. **(c1)** — refused; an eighth block type.

---

## 3 · What is in it

### 3.1 The draft, for `relative-clauses`

At the length I am recommending: about **1,050 characters** of Turkish,
which renders to roughly **750–850px at 320** — one and a half screens,
against the legacy `overview` objects' ~1,150 characters and against a
5,807px lesson. `[EN]` below marks a string that must render inside a
node carrying `lang="en"`; `**bold**` is the only inline markup, per the
schema.

> ### Relative Clause nedir?
>
> Bir ismi tarif eden, ama tek başına cümle olmayan bir yan cümledir.
> Türkçede bunu her gün kuruyorsun: *dün aldığımız harita*, *bu ağaçları
> diken kadın*. İngilizce aynı işi görür, iki farkla — yan cümle ismin
> **arkasına** geçer ve araya, ismin yerini tutan bir kelime girer:
> `[EN]` the map **that** we bought, `[EN]` the woman **who** planted
> these trees.
>
> Her ilgi cümlesinde üç parça vardır, ve bu konudaki altı ders bu üç
> parçadan birine bakar:
>
> - **Öncül** — tarif edilen isim. `[EN]` the map
> - **İlgi zamiri** — öncülün yerine geçen kelime.
>   `[EN]` that · who · which · whose · where · when
> - **Yan cümle** — zamirden sonra gelen, öncülü tarif eden kısım.
>   `[EN]` we bought
>
> Türkçede seçilecek bir şey yoktur; ek ne olursa olsun aynıdır. İngilizce
> ise her seferinde bir seçim ister, ve bu seçimi **iki soru birlikte**
> yapar: öncül **ne** (insan mı, yer mi, zaman mı, nesne mi) ve öncül yan
> cümlenin **içinde ne iş yapıyor** (özne mi, nesne mi, sahip mi).
> Aşağıdaki altı ders, bu iki sorunun ayrı ayrı cevaplarıdır — ilk ikisi
> diğer dördünün varsaydığı temeldir, o yüzden sırayla okumak işine
> yarar.
>
> Sınavda bu konu tek bir boşluk olarak karşına çıkar ve dört seçeneğin
> dördü de zamirdir.

**What it deliberately does not do.** It does not say which pronoun goes
where; it does not mention the comma; it does not mention prepositions
standing in front of the pronoun; it does not say `whom` is receding. All
four of those are the content of individual lessons, and three of them
are the *keyed contrast* of a lesson. It also does not repeat lesson 1's
own opening sentence about Turkish putting the clause in front of the
noun — it makes the same point in different words, which is the minimum
that can be asked, and a reviewer should check whether even that is one
repetition too many.

**Examples checked against the corpus.** `map`, `harita`, `gardener`,
`kedi`, `dükkan` appear zero times in `data/relative-clauses/`. `door`,
`key` and `teacher` do appear, in a pitfall, a `contrast` example and a
question paragraph respectively, and were rejected for that reason. This
check is not optional: `docs/agents/question-author.md` rule 1 exists
because 20 of 24 keys in one topic were built on the lesson's own
sentences, and an orientation is the *most* likely place to reintroduce
that defect, because it is written last and about the same material.

**One constraint the draft exposes, and it is an argument in §2.** English
inside a Turkish prose field cannot carry `lang="en"` today. `js/dom.js`
has no `lang` handling at all — `appendProse` and `appendInline` build
text nodes and bold spans and nothing else — so every English word inside
a `text` block inherits the page's `lang="tr"` (`index.html:2`). The
lessons work around this by putting English in *structural* slots that
`renderContrastBlock`, `renderFormsBlock` and `renderExamplesBlock` mark
with `englishTitle()`. `CLAUDE.md` is explicit that this is not cosmetic:
`text-transform: uppercase` follows the element's language, and a
screen-reader pronounces the mislabelled string in Turkish. So an
orientation written as a `text` block (option c2) **cannot honour the
app's own `lang` rule for its examples**, and the draft above therefore
needs a renderer that puts the English in its own nodes — which is
option (a)/(e2), or a rewrite of the draft with no inline English at
all.

### 3.2 The template

Five questions, in this order, and nothing else.

1. **What is this thing, in function terms, with a Turkish example the
   learner already produces?** Not a definition from a grammar book —
   the sentence *"you already do this in Turkish, here it is"*. This is
   the schema-activation move and it is the only place a Turkish example
   belongs.
2. **What are its parts, named?** Two to four named components, each with
   a two-to-five-word English illustration. This is the pre-training
   principle's actual content (§1.1) and it is the part that earns the
   page. The names must be the ones the lessons already use — `öncül`,
   not a synonym.
3. **What is the choice English makes that Turkish does not?** One
   sentence. Not the answer to the choice; the *shape* of it.
4. **What do the six lessons divide between them, and in what order?**
   One or two sentences, naming the dimension rather than listing the
   lesson titles — the titles are on screen already. If there is a real
   prerequisite ("the first two are assumed by the other four"), say it;
   `learning-design.md` §4 asked for prerequisite lines and this is where
   they cost nothing.
5. **What does the exam do with it?** One sentence about the *format*,
   never about the procedure. `docs/exam-spec.md` is the source; anything
   not in it is not allowed here.

**What it must not contain**, each with the rule it would break:

| Never | Because |
| --- | --- |
| A decision procedure or signal-word list | That is the `decision` block, and a duplicated procedure is a procedure that drifts. |
| Any keyed contrast of any of its own lessons | It is the lesson's job, and stating it here means the learner meets the answer one screen above the question. |
| Any sentence from a question paragraph or a lesson block | `question-author.md` rule 1, inverted. |
| A claim the app cannot support — how common a form is, what "usually" happens on the paper, a difficulty level | `docs/roadmap.md`'s honesty criterion; `content-pipeline.md` found ~1 untrue claim about English per lesson without a check. |
| A repeat of the lesson's first `text` block | Coherence principle (§1.3), self-inflicted. |
| Encouragement, reassurance, or a promise about outcomes | `onboarding.md`'s line: the app may state facts, never a state the learner has failed or a readiness it cannot measure. |
| More than ~1,200 characters | It is a phone. Past that it is an article, and articles were removed once already. |

---

## 4 · How does someone who does not need it skip it?

**By not tapping it.** That is the entire mechanism, and the question is
whether that is honest or a dodge. It is honest, but only for options
(a)/(e2)/(e1), and it is *not* honest for (c2) or (d) — which is most of
why the ranking in §2 came out as it did.

The distinction the project has already drawn, repeatedly, is between
**something in the way** and **something offered**:

- lesson checks never gate progress and an unanswered one reads "Atla"
  (`CLAUDE.md`; design system §7.2, "No disabled buttons");
- `docs/education-notes.md`: "free navigation, both tabs… no locking, at
  any level";
- `learning-design.md` §4: "a strong default and no lock", and mastery
  gating refused on Kulik's own dropout finding;
- `onboarding.md` §1: no interstitial before the first lesson, on the
  70-participant NN/g result and on the "tax on every arrival" argument.

A row on the index that says **Genel bakış** is not before anything. The
learner arriving at `#egitim` sees the same card and the same 48 lesson
rows; one extra row exists, at the head of each topic group, and tapping
a lesson works exactly as it does today. Nothing is dismissed, nothing is
deferred, nothing has to be got past. That is a different object from a
first-run carousel and the difference is not rhetorical: the carousel
appears without being asked for and must be dismissed.

**Where I have to concede something.** If it is optional, the people who
most need it may not open it. `Karich, Burns & Maki (2014)` — already in
`learning-design.md` §4 — found learner control over sequence and pace
producing **g = 0.05**, near zero across most moderators, because
learners choose the conditions that feel fluent. A learner who does not
know what a relative clause is does not know that he does not know, and
"Genel bakış" is a phrase that reads as skippable. So the honest claim is
**not** "optional means it reaches the right people"; it is "optional
means it costs the wrong people nothing, and the app's own default has to
do the reaching".

Two cheap moves close most of that gap, and both use state the app
already stores:

1. **Order, not gating.** The `Genel bakış` row is the first row in its
   topic group, above lesson 1. It keeps the fixed-width lead slot so the
   keyline holds (§7.1) but puts an icon in it rather than a number —
   `lesson.order` is 1–6 and the orientation is not lesson 0. Position is
   the strongest recommendation an ungated list can make and it costs
   nothing.
2. **Demote it once the topic has been read.** `getAllLessonProgress()`
   already tells `renderIndex` which lessons are done. When any lesson in
   a topic is `done`, the row loses its position at the head of the group
   — or drops to a `t-meta` link under the heading. That is the
   expertise-reversal fix (§1.5) implemented with data the app already
   has, and it is the same shape as `learning-design.md`'s recommendation
   7, "a second presentation for a re-opened lesson".

What I would **not** do is make it a first-run-only card, a dismissible
banner, or anything that remembers whether it has been seen and hides
itself. `onboarding.md` refuses "any interstitial before the first
lesson" and a self-hiding orientation is an interstitial that has learned
manners.

---

## 5 · Does this improve onboarding? The direct answer

**It is a genuinely different intervention from the tour, and it is
mostly not an onboarding fix.** Both halves matter, so both are argued.

### 5.1 Why it is not the tour wearing a hat

`onboarding.md` §1 rejected a guided tour on three grounds. Check the
orientation against each:

| The tour's problem | Does the orientation have it? |
| --- | --- |
| It teaches the **interface**, and this interface is a bottom nav with two labelled Turkish words | **No.** It teaches the *subject matter*. Nothing in it describes a control. |
| It is an **interstitial** — a step between the link and the thing they came for | **No**, in options (a)/(e1)/(e2). It is a destination among destinations. In option (c2) it *is* an interstitial, inside the lesson. |
| It is **forgotten**, because it is delivered before there is anything to attach it to | **Partly no.** A parts list is attached to the very next thing read, and unlike a coach mark it is re-openable when it becomes relevant. But "partly": the NN/g finding is about front-loading, and front-loading is what this is. |

There is also a fourth, structural difference: the tour has no second
use. An orientation does — a learner who returns after two weeks and
opens *Reduced Relative Clauses* can re-read what `öncül` means. The
NN/g evidence is about a thing consumed once; this is a reference.

So the two are not the same object and the 70-participant result does not
transfer to it. That is the answer to the "is it the same thing wearing a
different hat" question: **no**.

### 5.2 Why it still is not the onboarding fix the owner thinks it is

This is the part I would push back on, and the measurements are the
argument.

**The first-run screen is already good, and it is not where the
suffocation is.** Measured at 320, on the build as of `1e523d8`: no
banner — the development note retired into Profil's roadmap section in
that commit — then the welcome card at y=72..456,
*"Üniversite İngilizce yeterlik sınavı için dersler ve paragraf
soruları. Hesap açman gerekmiyor…"*, then **İlk dersi aç**, then the
first topic heading at 488. `user-flow.md` Journey 1 grades that
**Strong** and measures **two taps to a first answered question**.
Nothing about the first screen goes straight at "X vs Y": the first
screen says what the app is and offers one button.

**The suffocation is at the second screen, and that is a teaching
problem, not an onboarding one.** Tap the button and you arrive at a
**5,807px** page — 9.1 screens at 320 — whose `h1` is
*Who vs Whom vs Whose*, in English, in the display face, preceded by one
Turkish paragraph and followed by a question you are told you will
probably get wrong. That is the moment the owner is describing. It is the
*lesson*, not the *first run*.

**And an orientation does not fix that moment, because it is not on that
screen.** A topic page reached from the index helps the learner who taps
*Relative Clauses* first. It does nothing for the learner who taps **İlk
dersi aç**, and it does nothing for the learner who arrives from the
results screen, which `onboarding.md` §8 correctly calls "the app's best
onboarding".

**So the accurate claim is narrower than the owner's, and it is still
worth something:** an orientation layer improves *re-entry* and
*navigation comprehension* — knowing what a group of six lessons is
before choosing among them — and it improves the experience of the
learner who browses the index rather than following the app's default.
Those are real, and they are not onboarding.

If the goal is genuinely the first-run experience, the higher-value
changes are already written down and cheaper than this one:

- the remaining `user-flow.md` fix at Journey 1 — moving the pretest's
  four-line rationale *below* the question, saving ~150px so the first
  option is above the 320 fold. (The other two are done: the pretest no
  longer collides with the lesson's own checks, and the development
  banner retired into Profil in `1e523d8`, which recovered the 48px of
  the fold `user-flow.md` was still charging it for.)
- the manifest gloss (§2 e1), which puts one Turkish sentence next to
  each of the eight English topic titles on the screen every new learner
  lands on.

**Verdict: the intervention is legitimate and the onboarding argument for
it is not the reason to do it.** Do it because §1.1 and §1.5 say a short
parts-list helps the learner who lacks the category and costs the one who
has it a tap. Do not do it expecting the first run to feel different; it
will not, because the first run does not go near it.

---

## 6 · Cost and staging

### 6.1 Per topic

The content is cheaper than it looks, because it has been written twice
already (§0).

| Step | Who | Cost per topic |
| --- | --- | --- |
| Draft from the existing source — the topic's `docs/agents/<topic>-spec.md` opening section, or the orphaned `overview` for the three oldest | Curriculum-author agent, one run | agent time |
| Check every example against the corpus (§3.1) and against the lesson's own first `text` block | Supervisor, scripted grep | 10 min |
| Claim-check: is every statement about English true, and does it stay inside `docs/exam-spec.md` | Independent reviewer session | agent time + 15 min adjudication |
| Turkish read-through | Supervisor | 10 min |
| Merge, `npm run format`, `npm run check` | Supervisor | 5 min |

**~40–45 minutes of human attention per topic**, against
`content-pipeline.md` §7.1's 90 minutes per 12–15 questions. Eight topics
is **5–6 hours of the supervisor's time**, plus 8 agent runs, plus a
one-off code cost of roughly a day for (e2) or an hour for (e1).

### 6.2 Does it need its own review pass?

**Yes, and a different one from either existing pass.**

- The **blind pass** does not apply: there is no key.
- The **lesson-sufficiency pass** (`content-pipeline.md` §8.1) does not
  apply either: an orientation deliberately does *not* answer any
  question, so "answerable from the lesson" is the wrong test — and
  running it would push an author toward writing the answers in.
- What *does* apply is the finding that produced the sufficiency pass in
  the first place: across five topics the review found **roughly one
  untrue claim about English per lesson**, and none of them visible to
  `npm run check`. An orientation is pure prose making general claims,
  which is the highest-density place for that defect in the whole corpus.

So: a **claim-check pass**, cheap and specific. One reviewer session, one
topic, given the orientation, that topic's six lessons and its 24
questions, and nothing else, answering three questions per sentence — *is this true of English;
does it contradict any lesson in this topic; does it state or imply the
answer to any of this topic's 24 questions?* That is a 20-minute pass and
it is the one that would catch an orientation quietly teaching a rule
that the lesson later qualifies.

One more control worth having: **the orientation is written last, after
the topic's lessons exist**, not first. Written first it becomes a spec
the lessons then contradict; written last it can be checked against them.
This inverts the order used for `category-spec.md`, deliberately — the
spec is for the author, the orientation is for the learner, and the
learner's version has to describe what actually shipped.

### 6.3 Before or after the two vocabulary topics?

**After, and not close.** Four reasons, in order of weight:

1. **`docs/roadmap.md` already decided the principle.** "Review debt
   before new content… writing a ninth topic before clearing that is
   decorating a queue." There are 48 drafted questions and 12 drafted
   lessons in `docs/agents/drafts/` that no learner can reach, and
   neither review pass has run on either topic. An orientation is not a
   ninth topic, but it is unambiguously new content ahead of unshipped
   reviewed content.
2. **It closes no scored blank.** `academic-verbs` and
   `academic-nouns-adjectives` close cloze blanks 5 and 10 — the last two
   of ten. An orientation closes none, and the roadmap's second ordering
   rule is "a scored section beats a better version of a covered one".
3. **The arithmetic gets worse if you do it first.** Writing orientation
   for 8 topics now means writing it for 10 in a fortnight — and the two
   vocabulary topics are precisely the ones where a "what is this"
   introduction is *least* like the others, because their categories are
   word-list slices rather than grammar contrasts. Doing all ten in one
   round, after the taxonomy for all ten is fixed, is one template
   instead of two.
4. **The template will be better for having seen the vocabulary
   topics.** `content-pipeline.md` §8.2 already warns that "category" is
   about to mean three different things. An orientation format designed
   against six grammar topics and then stretched over a word-list topic
   is the fourth forced schema change `CLAUDE.md` warns about.

**Against all four, one real counter-argument, and it is §0.1.** The app
now tells every learner who opens Profil that topic introductions are
`next`, in the same list where `Kelime` is also `next`. That is a
commitment already made, in Turkish, on screen. It does not reverse the
ordering — the list carries no dates, deliberately, and `next` is a set
rather than a queue — but it does mean the cost of waiting is no longer
zero: a `next` row that does not move is the stale claim the development
banner was retired for, one commit ago. The resolution is the exception
below: ship the cheap half now so the row is visibly moving, and build
the promised topic screen against ten topics rather than eight.

**The exception, which I would ship immediately:** the manifest gloss
(§2 e1) and the 48 first-`text`-block rewrites (§2 c2). Neither needs a
new schema, neither needs a screen, both are content, and together they
are an hour of code and an evening of writing. They also answer the
narrow, true version of the complaint — *the index says `Relative
Clauses` in English and nothing else* — on the screen where the complaint
is felt.

---

## 7 · What I was not asked

### 7.1 Three `overview` objects are dead learner-facing content

`data/tenses/tenses.json:6`, `data/modals/modals.json:6`,
`data/passive-voice/passive-voice.json:6`. About 4,500 characters of
Turkish teaching prose that no learner has seen since the block redesign, that
`tools/validate-content.mjs` never looks at (it validates `topicId`,
`level`, `lessons`, `questions` and ignores unknown top-level keys), and
that `tools/format-content.mjs` faithfully reformats on every run.

Two things follow. First, **it should be either revived or deleted, by a
decision** — it is a five-line diff either way, and it is the best
starting draft that exists for three of the eight orientations. Second,
and more useful: **the validator should warn on an unknown top-level key
in a topic file.** This project's whole quality apparatus is built on the
idea that content is checked; a field can currently be added, populated
with a thousand characters of Turkish, orphaned by a redesign, and
survive every `npm run check` since without producing one line of
output.
That is a four-line change in `validateTopicFile`.

### 7.2 The index has an English-only heading problem that is not this project

Eight topic headings, all English, no gloss: `Tenses`, `Modals`,
`Passive Voice`, `Closest Meaning`, `Connectors & Discourse Markers`,
`Quantifiers & Determiners`, `Relative Clauses`, `Gerunds & Infinitives`.
The convention that grammar terms stay English is right and settled
(`CONTENT_GUIDE.md:60`) — the terms are on the exam. But *"Closest
Meaning"* is not a grammar term a student will meet on a paper; it is
this app's name for a question type. A learner scanning eight English
headings has to already know what six of them mean to choose one, which
is a smaller and more immediate version of the owner's complaint, and
(e1) fixes it for the price of eight sentences.

### 7.3 Thirty-one of forty-eight lesson titles wrap at 320

Measured: rows are 62px when the English category title fits one line and
82px when it wraps, and 31 of 48 wrap. The summaries are all one line
(16px), so the design system's §7.1 rule — "a row's secondary line is one
line, always" — is being kept and the *title* is what varies. It is not a
defect against any written rule, and it is 620px of the 4,564px index. If
the index is ever revisited for length, the category names are where the
length is, and renaming a category is a taxonomy change that resets
progress — so this is a thing to know before, not after.

### 7.4 The orientation is the natural home for the prerequisite lines

`learning-design.md` §4 asked for a manifest field naming a lesson's
assumptions ("*Passive with Modals* presupposes both *Modals* and *Tense
Forms in Passive*"), rendered as a line at the top of the reader, gating
nothing. Half of that content is question 4 of the §3.2 template. If a
topic screen ships, the prerequisite information should live there in
prose rather than as a separate field, and the field should not be built
twice.

### 7.5 Whatever ships goes into the browser sweep

`tools/verify-ui.mjs` walks one learner journey at four widths and audits
each screen it lands on. A topic screen is a new screen; a `Genel bakış`
row is a new index state; a manifest gloss is a new node in an existing
one. `CLAUDE.md` is explicit that adding to the sweep is part of the
change. The topic screen in particular needs the §8.5 routing-and-focus
check, because it introduces the app's first three-segment hash route.

---

## Ranked recommendation

Ordered by value per hour, sizes honest.

1. **A one-line Turkish gloss per topic, in the manifest** (§2 e1). One
   optional field, one validator rule, two render lines, eight
   sentences. **~1 hour of code, ~1 hour of writing**, ~+150px on a
   4,564px index. Ship this now, before the vocabulary topics. It
   answers the true, narrow version of the complaint on the screen where
   the complaint is felt.
2. **Rewrite the 48 lessons' existing first `text` block so each carries
   one sentence of category identity** (§2 c2, the honest version). No
   code, no schema, no new screen; the block already exists and is
   already ~300 characters of the 400 allowed. **~2–3 hours of writing
   plus a claim-check pass.** This is where a learner who lands on lesson
   4 from the results screen actually is.
3. **Delete or revive the three orphaned `overview` objects, and make the
   validator warn on unknown top-level keys** (§7.1). **~30 minutes.**
   Do it in the same commit as (1), because (1) is where the decision
   about topic-level content gets made.
4. **The topic screen** (§2 a/e2), after `academic-verbs` and
   `academic-nouns-adjectives` ship and against all ten topics at once.
   **~1 day of code, ~6 hours of supervisor time across ten topics**,
   plus agent runs and three new states in the browser sweep. This is
   the shape `data/roadmap.json`'s **Konu girişleri** row has already
   promised the learner (§0.1), so items 1–3 are not a substitute for
   it — they are what keeps the row honest while it waits.
5. **The claim-check review pass** (§6.2), written into
   `docs/agents/` as a third short brief. **~1 hour to write**, and it is
   a precondition for (4) rather than a follow-up — the pipeline's own
   record is that repairs and new prose introduce defects that only an
   independent read catches.

Items 1–3 together are **under half a day** and are the whole of what I
would do before the vocabulary topics ship.

## What I would refuse

- **A "Genel bakış" lesson inside the `lessons` array** (§2b). It is a
  hard validator error by design, it requires four fake questions or a
  lying manifest, and it changes every denominator the app shows. The
  taxonomy is the coupling point between two content agents and it is
  not a place to store a page that is not a category.
- **An eighth block type** (§2 c1). Refused three times already in this
  repository, and nothing here is a new kind of content.
- **A conceptual essay.** Three paragraphs on what a tense *is*
  philosophically is the article format that was removed twice, and the
  seductive-details number (g = −0.16 over 50 studies) is the one that
  applies to the interesting-but-inessential half of it. The cap is
  ~1,200 characters and it is a cap, not a target.
- **An orientation block at the top of all 48 lessons.** Expertise
  reversal is asymmetrical but it is not free: d = −0.428 for the
  high-prior-knowledge learner given assistance he does not need, paid
  six times per topic and again on every re-read.
- **Anything that comes before the pretest.** Productive failure at
  g = 0.36 over 53 studies is better evidenced than pre-training at
  7 tests, and the pretest is already 279px down at 320.
- **A first-run "welcome to relative clauses" card, a dismissible
  orientation banner, or an orientation that hides itself once seen.**
  `onboarding.md`'s refusal of any interstitial before the first lesson
  covers all three; a self-hiding interstitial is still an interstitial.
- **Any claim in the orientation about how common a form is, how often it
  appears on the paper, or how hard the topic is.** The app has 4
  questions per category and no telemetry; `docs/roadmap.md`'s honesty
  criterion is that nothing on screen claims more than the data supports.
- **Writing the orientation before the lessons exist.** It would become a
  spec the lessons contradict. It is written last and checked against
  them.

## Open questions for the owner

1. **Is the complaint about the index or about the lesson?** §5.2 argues
   it is the lesson — a 5,807px page whose first heading is an English
   contrast. If that is right, item 2 of the ranking matters more than
   item 4, and the topic screen may not be needed at all. This is the one
   question that changes the whole recommendation and only he can answer
   it.
2. **The three orphaned `overview` objects: revive or delete?** They are
   the best existing draft for three topics and they are also a year of
   invisible content. Either answer is fine; leaving them is not.
3. **Does a topic screen belong in an app whose navigation was
   deliberately flattened?** The top menu was removed on the owner's
   feedback and `CLAUDE.md` says navigation is settled. A topic screen
   does not reopen the nav, but it does add a level, and that is his call
   rather than a research one.
4. **`Closest Meaning` and `Connectors & Discourse Markers` are not exam
   terms.** The English-only heading rule exists because students must
   recognise grammar terms on the paper. Do these two get a Turkish
   heading, or a Turkish gloss under an English heading? (I recommend the
   gloss, for consistency.)
5. **Is the orientation allowed to describe the exam's format** — "this
   comes up as one blank with four pronouns"? It is true, it is in
   `docs/exam-spec.md`, and it is the first place the app would tell a
   learner what a question will look like before they meet one.
6. **Ten topics or eight?** If the two vocabulary topics are certain,
   the orientation round should wait for them and cover all ten. If they
   might slip, doing eight now and two later costs one extra review
   round and no rework.
7. **Does the `Konu girişleri` row in `data/roadmap.json` describe items
   1–3 or item 4?** It says *"her konunun başında"*, which is item 4. If
   the cheap half ships first, the row's `detail` should say what
   actually landed rather than continuing to describe something else —
   otherwise the app's most honest screen carries a sentence that is no
   longer true of it.
