# The last week

What a learner should actually do in the seven days before this exam, and
what — if anything — the app should do about it.

Written 2026-09-04, when the owner and a few friends are sitting YTÜ's
proficiency exam in roughly a week and the app has no notion of time at
all: no exam date, no plan, no pacing, and nothing that distinguishes the
seventh day before from the seventieth.

---

## The short version

**Seven days is not "a short version of three months". It is a different
regime, and most of the evidence this project is built on does not reach
it.** Nearly every finding in `learning-design.md` and `practice-modes.md`
is measured on a delayed post-test — one week, four weeks, a year. The
question here is the opposite one: what raises a score on a paper sat on
day seven. Some of the same findings survive that translation. Several
famously do not, and two of them are ones this repository has repeated.

Five things carried the analysis.

**1 · Spacing buys almost nothing at this horizon, and that is a
measurement rather than a guess.** Rohrer & Taylor gave 216 students ten
practice problems either massed in one session or split across two
sessions a week apart. At the **four-week** test the spaced group roughly
doubled the massed group. At the **one-week** test the benefit was *nil*
([Rohrer & Taylor, 2006](https://onlinelibrary.wiley.com/doi/10.1002/acp.1266)).
Cepeda's ridgeline agrees from the other direction: the optimal gap
shrinks as a proportion of the delay, and at a seven-day delay it is one
to three days
([Cepeda et al., 2008](https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02209.x)).
So `learning-design.md` §5's "revisit every two to four days" is correct
for the three-week horizon it was written for and **wrong for this one**.
At six days out the scheduling question is close to answerless: study
most days, and stop optimising the calendar.

**2 · Overlearning buys nothing either — not at one week, not at four.**
Same paper, second experiment: three practice problems versus nine. The
extra six changed nothing at either delay. "Do all 73 questions again"
is the intuitive last-week plan and it is the one manoeuvre with a direct
null result against it.

**3 · Three things do survive at seven days**, and they are the three the
app is already built on: **retrieval practice with elaborated feedback**
(the crossover against rereading happens well inside a week —
[Roediger & Karpicke, 2006](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x)),
**interleaving** (Pan et al.'s L2 conjugation study found *no* benefit
within a session or at two days and a substantial one at **one week** —
which is precisely this horizon), and **sleep**. That is a convenient
answer and it should be read sceptically, so §1 gives the numbers and the
places the transfer is weakest.

**4 · Worst-first is the right selector and the wrong frame.** With
months left, the retrieval budget belongs to what you cannot do. With six
days, the yield-maximising target is the *almost*-known — the region of
proximal learning — and pouring the last hours into the hardest material
is the documented **labor-in-vain** effect. The change the app needs is
not to the ordering in `orderForPractice`; it is one sentence of framing
on `Yanlış defteri`, plus a rule that stops the last session before the
exam being nothing but the learner's own worst answers.

**5 · The app should not learn the exam date.** It should be able to learn
**one bit** — "sınavım yakın" — set by the learner, cleared by the
learner, with no countdown and no arithmetic. A stored date buys a number
that ticks; the worry component of test anxiety is the component most
associated with poor performance
([von der Embse et al., 2018](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683)),
and a ticking number is a worry generator that the learner did not ask
for. The one bit buys everything the date would buy for the advice, and
nothing it would buy for the anxiety. It also survives the storage
problem: WebKit's seven-day eviction (`onboarding.md`) means a stored date
can silently vanish inside the exact window it exists for.

> **Superseded on 2026-09-04.** The 7% below was recomputed after five
> more topics shipped: it is now **~22 of ~100**
> (`exam-spec.md` §"What the app covers", derivation in
> `research/quality-of-life.md` §5.1). The direction of §4's advice
> survives — half the paper is still untouched — but the proportional
> allocation it derives from the number does not: 40–50 minutes of a
> three-hour day, not twenty. Nothing else in this document was edited.

And the finding that outranks all five, because it is about hours rather
than mechanics: **the app addresses about 7% of this paper**
(`exam-spec.md`). In the last week, the most valuable true thing it can
tell a learner is *where not to spend the time*. A learner who spends
seven days inside this app is optimising 7 points out of 100 and will
walk into a reading section, a listening section and a note-taking sheet
they have not rehearsed once. §4 is a plan that says so, in hours.

---

## 0 · What I could actually verify

The same limitation every previous arm hit, and it has not improved:
**this session's egress proxy blocks direct page fetches.** Every domain I
tried — `pubmed.ncbi.nlm.nih.gov`, `files.eric.ed.gov`,
`onlinelibrary.wiley.com`, `laplab.ucsd.edu`, `psychnet.wustl.edu`,
`www.columbia.edu`, `www.ncbi.nlm.nih.gov` — returned a proxy denial. So
what follows is drawn from **search-result summaries of abstracts and of
first-party pages**, not from reading the papers.

Practically:

- **Designs, samples and headline results** are reported consistently
  enough across independent summaries that I treat them as reliable. Where
  I give a number it appeared in more than one summary, or in a summary of
  the paper's own abstract.
- **Anything needing a discussion section** — moderators, the authors'
  caveats, exact condition means — I have marked as uncertain or left out.
  In two places below I wanted a specific percentage and could not get it,
  and I say so rather than reconstructing it from memory.
- **Where a study's population or horizon differs from this one**, that is
  stated inline. This arm is more prone than most to borrowing an
  authoritative result that does not transfer, and the single most common
  way to get this subject wrong is to quote a retention finding as if it
  were a performance finding.

One more disclosure, because it changes how §4 should be read: **I am
inferring the exam date.** The owner said "we have a week" and also that
"there is time to add enough content" (`v1-plan.md`, *Blocked on the
owner* #2). This document assumes the first reading — an exam roughly
2026-09-10 to 2026-09-12 — and everything in §4 is dated relative to
"seven days out" rather than to a calendar. If the sitting is in a month,
§4 is wrong and `learning-design.md` §5 is right.

### What the app actually contains today

Because §4 has to be a plan over real content, and the count in the brief
does not match `main`:

| | Shipped (`data/`, on `test`) | Authored |
| --- | --- | --- |
| Topics | 3 — Tenses, Modals, Passive Voice | 4 |
| Questions | **73** | **97** |
| Lessons | **18** | **24** |

The 24 restatement questions and 6 restatement lessons exist, are reviewed
and are *one command* from shipping —
`node docs/agents/drafts/closest-meaning/assemble.mjs`, per the draft's own
README, whose round-3 note records five blind passes agreeing with the key
on 120 of 120 and an explicit *ship*. That matters more than any feature in
this document and §6 opens with it: restatement is **15 of Session I's 60
points**, and the app currently serves none of it.

---

## 1 · Seven days is a different regime

### 1.1 The distinction the whole arm turns on

Almost every study this project cites reports **retention**: how much
survives a delay of a week, a month, a year. The last-week question is
about **performance on a fixed date six days out**. Those are different
dependent variables, and a finding about one is not a finding about the
other.

The clean way to see it is the shape of the classic result. Roediger &
Karpicke had students read prose passages and then either restudy or take
recall tests, with the final test at 5 minutes, 2 days or 1 week. **At 5
minutes restudying won. At 2 days and 1 week testing won**, and by a wide
margin
([Roediger & Karpicke, 2006](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x)).
The intervention did not change; the answer changed because the delay
changed. I could not reach the paper for the condition means — the
summaries report the direction and the crossover, not the numbers — so
take the direction, not a figure.

That is the pattern to apply everywhere below: **ask what delay the study
measured, and whether six days is on the near or the far side of it.**

For this exam, six days is on the **far** side of most crossovers and the
**near** side of most spacing effects. That single sentence generates the
rest of §1.

### 1.2 Spacing: real, but nearly spent at this range

Spacing is the most robust finding in the neighbourhood — 839 assessments
across 317 experiments in
[Cepeda et al. (2006)](https://www.semanticscholar.org/paper/634293f80f8e661dc259e4902bca99821bec3014),
one of only two techniques rated high-utility by
[Dunlosky et al. (2013)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266).
Both of those measure delayed retention.

Two results bound what it is worth here.

**The optimal gap collapses as the deadline approaches.** Cepeda's
ridgeline study taught 1,354 people a set of facts, varied the inter-study
gap from 0 to 105 days and the test delay from 7 to 350 days. The optimal
gap grows with the delay but *shrinks* as a proportion of it: roughly
**20–40% of the delay at a one-week test**, falling to 5–10% at a year
([Cepeda, Vul, Rohrer, Wixted & Pashler, 2008](https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02209.x);
the same range is quoted in `learning-design.md` §5). At a seven-day
delay that is a gap of **one to three days**. Summaries of this paper
disagree between "about one day" and "about three days" for the 7-day
condition and I could not open it to settle which; either way the
prescription is the same, and it is not the two-to-four-day revisit
`learning-design.md` recommends for a three-week horizon.

**And the size of the benefit at one week can be nil.** Rohrer & Taylor
taught 216 college students one kind of maths problem and gave them ten
practice problems either massed in a single session or split across two
sessions a week apart. At the **four-week** test the distributed group
performed roughly twice as well. At the **one-week** test the benefit was
**nil**
([Rohrer & Taylor, 2006](https://onlinelibrary.wiley.com/doi/10.1002/acp.1266);
[ERIC ED505642](https://eric.ed.gov/?id=ED505642)).

Do not over-read that into "cramming is fine". Kornell's flashcard
experiments compared spacing against **cramming specifically — massing
study on the last day before the test** — with GRE-type word pairs, and
spacing won
([Kornell, 2009](https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.1537)).
Cepeda's own data show gap-0 as the worst point on the curve at every
delay tested.

**Synthesis, and it is a compromise between two literatures rather than a
finding:** at six days out, *some* spread beats one heroic session, and
that is all the spacing literature buys. Which days, and in what order,
is below the resolution of the evidence at this horizon. **The app should
therefore have no opinion about the schedule in the last week** — a
recommendation that is worth stating precisely because it is the opposite
of what a study app is expected to say.

### 1.3 Overlearning: the intuitive last-week plan, with a direct null

The obvious plan on day seven is *do everything again*. Rohrer & Taylor's
second experiment is the direct test: three practice problems versus
nine, one session. The extra six problems — textbook overlearning —
produced **no effect on test scores at either one week or four weeks**.

Transfer caveat, stated plainly: that is a single procedural maths task in
one lab study, and "overlearning" there means extra practice *after* the
criterion was reached. A learner who has never answered a Passive
Reporting item correctly is not overlearning by answering four of them.
The finding bites on the specific plan of **re-running material already
answered correctly**, which is exactly what "do all 73 questions again"
means for anyone who has already been through the app.

### 1.4 Retrieval practice: the one thing that gets *stronger* at this range

Rowland's meta-analysis of 159 effect sizes puts retrieval practice
against restudy at *g* = 0.50 overall — and the moderator is the one that
matters here: **studies with a retention interval of 24 hours or more
show a larger effect (*g* = 0.69) than shorter ones**, and the effect is
larger still when the material is complex, the retrieval effortful, and
**feedback is given**
([Rowland, 2014](https://pubmed.ncbi.nlm.nih.gov/25150680/)).
[Yang et al. (2021)](https://pubmed.ncbi.nlm.nih.gov/33683913/) get
*g* = 0.499 from 222 real-classroom studies and 48,478 students.

Six days is comfortably inside the regime where testing beats rereading,
and the app's format — retrieval, immediate elaborated feedback, wrong
answers explained — is the condition with the largest moderators attached
to it. **This is the strongest single claim in the document: whatever
else the last week contains, the studying inside it should be
answering questions with feedback, not reading.** It is also, awkwardly,
the thing the app is best at over the smallest share of the paper.

### 1.5 Interleaving: this horizon is where it pays

The most directly transferable study in the round is Pan, Tajran,
Lovelett, Osuna & Rickard: **adults learning Spanish preterite/imperfect
conjugation**, interleaved versus blocked training. Interleaving produced
**no benefit within a session and none at a 2-day test**, and a
substantial benefit at **one week**
([J. Educational Psychology, 2019](https://eric.ed.gov/?id=EJ1230840)).
Brunmair & Richter's meta-analysis puts interleaving at *g* = 0.42 with
large moderators, favouring similar, confusable categories and complex
material
([2019](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)).

Two consequences. First, an interleaved session run **today** pays on a
test **seven days from now** and not before — the timing lines up almost
exactly. Second, and less comfortably: an interleaved session run **on day
six** is being asked to pay in one day, which is the delay at which Pan et
al. found nothing. That is not an argument for blocking late; it is an
argument that whatever the learner does in the last two days is mostly
about *retrieval and familiarity*, not about acquiring a contrast.

### 1.6 Sleep, and the night before

Three separate claims, with different strengths.

**Sleep loss impairs the abilities this paper taxes.** Lim & Dinges pooled
70 articles and 147 cognitive tests: short-term sleep deprivation produced
its largest deficits on **sustained attention** (lapses, *g* = 0.776) with
reliable but smaller effects on working memory, and smaller ones again on
reasoning accuracy (*g* = 0.125, not significant)
([Lim & Dinges, 2010, *Psychological Bulletin* 136](https://www.semanticscholar.org/paper/9d1570cd8017a9816df6171c97cfbc8e79815d1a)).
Pilcher & Huffcutt's earlier meta-analysis of 19 studies reached the same
direction and found **mood** more affected than cognition
([Pilcher & Huffcutt, 1996, *Sleep* 19](https://pubmed.ncbi.nlm.nih.gov/8776790/)).
Reading two 700-word passages and holding a lecture's structure on a
note-taking sheet is a sustained-attention task with working memory
underneath it. This is the cell where sleep deprivation does its worst.

**Sleep after study consolidates what was studied.** Sleep following
learning produces better retention than an equal period of wakefulness,
shown repeatedly for vocabulary
([Gais et al., 2006](https://learnmem.cshlp.org/content/13/3/259.full);
meta-analysed for novel word learning in
[Psychonomic Bulletin & Review, 2021](https://link.springer.com/article/10.3758/s13423-021-01980-3)).
What the evidence does **not** cleanly support is the stronger folk
version — that studying late at night, right before sleep, beats studying
in the afternoon. The one experiment I found comparing evening against
afternoon training found the afternoon group *better* on word pairs at 24
hours, with the evening advantage confined to a procedural finger-tapping
task
([PLOS ONE, 2012](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0040963)).
So: sleep after studying, yes. *Study later so you sleep on it*, no —
that is not established and I would not put it in the app.

**The night before, specifically, is not where the marks are.** Okano et
al. put activity trackers on 88 MIT students across a chemistry course.
Sleep quality, duration and consistency together accounted for nearly
**25% of the variance in academic performance** — and **the single night
before a test showed no relation to performance**, while sleep over the
*week and the month* before did
([Okano et al., 2019, *npj Science of Learning*](https://www.nature.com/articles/s41539-019-0055-z)).

That last result is easy to misquote in both directions. It is
correlational, from one course, and the night-before null may partly
reflect restricted range — few students in a tracked study sleep two
hours. It does **not** license an all-nighter. What it supports is the
weaker and more useful claim: **the exam-week sleep that matters is all
seven nights, not the last one**, and the marginal hour of study bought by
cutting sleep on day six is being traded against the whole of §1.3's null.
Given that overlearning bought nothing at one week in a controlled
experiment, and sleep loss costs sustained attention at *g* ≈ 0.78, that
trade is a bad one on the numbers rather than as a matter of virtue.

### 1.7 Anxiety: two interventions the last week can actually deliver

Test anxiety is not a side issue on a paper that decides whether someone
repeats a year. Von der Embse et al.'s 30-year review of 238 studies found
test anxiety negatively related to performance, with the **worry**
component (*r* = −0.22) worse than the emotionality component
(*r* = −0.15)
([2018, *J. Affective Disorders* 227](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683)).

**The main treatment literature does not fit a one-week window.** A
meta-analysis of **44 RCTs, 2,209 university students** found interventions
reduced test anxiety at *g* = −0.76 and improved academic performance at
*g* = 0.37, with most support for behaviour therapy
([Huntley et al., 2019](https://pubmed.ncbi.nlm.nih.gov/30826687/)).
Those are multi-session programmes delivered by people. Nothing in this
app is going to deliver one, and it should not pretend to.

Two brief interventions *are* one-shot and could in principle be one
Turkish paragraph:

- **Arousal reappraisal** — being told that exam arousal is functional
  rather than harmful. Jamieson's GRE and community-college studies found
  improved performance and lower evaluation anxiety
  ([Jamieson et al., 2016](https://journals.sagepub.com/doi/abs/10.1177/1948550616644656)),
  and the 2024 meta-analysis of RCTs puts it at **d = 0.23 overall**
  (44 effect sizes), **d = 0.20 for cognitive written tasks**, with the
  authors explicitly calling it no silver bullet
  ([Bosshard & Gomez, *Scientific Reports* 14](https://pubmed.ncbi.nlm.nih.gov/38575696/)).
- **Expressive writing before the exam** — ten minutes writing about exam
  worries, which
  [Ramirez & Beilock (2011, *Science*)](https://www.science.org/doi/abs/10.1126/science.1199427)
  found improved exam scores, most for habitually anxious students. **It
  has failed to replicate at least once**, with a null on both performance
  and anxiety
  ([Syracuse dissertation replication](https://surface.syr.edu/etd/373)),
  which is enough to keep it out of a product that has five users and no
  way to measure whether it helped.

My read: **the reappraisal sentence is worth saying once, in Turkish, on
the results screen or in the last-week note — and it is worth saying at
d ≈ 0.2 precisely because it costs one paragraph.** Anything larger is
outside what a static app can honestly offer.

### 1.8 Known material versus weak material, when time is short

This is the question the app's own behaviour turns on, and the literature
gives a sharper answer than "practise your weaknesses".

**When time is ample, drop what you know and drill what you don't.**
Karpicke & Roediger's *Science* experiment is the canonical result:
after an item has been recalled once, further *restudy* does nothing for
delayed recall while further *testing* produces a large effect
([2008](https://pubmed.ncbi.nlm.nih.gov/18276894/)). That is the argument
for `Yanlış defteri` and it stands.

**When time is short, the highest-yield target is not the hardest
material.** Metcalfe's region-of-proximal-learning work found that, given
free choice, people spend most time on **medium-difficulty** items and
study easy ones first — and that when study time was manipulated
experimentally, **the best performance came from giving most time to the
medium-difficulty items**, because easy items show steep-then-flat uptake
while hard items may show almost none
([Metcalfe, 2002](https://psychology.columbia.edu/sites/psychology.columbia.edu/files/2016-11/349.pdf);
[Metcalfe & Kornell, 2005](https://www.semanticscholar.org/paper/7062327_Study_efficacy_and_the_region_of_proximal_learning_framework)).
The failure mode has a name — Nelson & Leonesio's **labor-in-vain
effect**: extra time on the most difficult items buys little or nothing,
and *under time pressure, or when the goal is short of complete mastery,
emphasising items that are too difficult is suboptimal*.

Six days before a proficiency exam is exactly "time pressure, and the goal
is short of complete mastery". A learner does not need to master Modal
Perfects in Passive; they need to convert the categories they half-know
into categories they answer correctly.

**Two caveats before this gets over-applied.** First, this literature is
about *item difficulty within a learner's own judgement*, measured with
paired-associate materials in the lab — it is not an exam-prep field
trial, and the transfer to "which grammar category to practise" is my
inference, not the authors'. Second, it argues against *only* the extreme:
spending the last week exclusively on what you are worst at. It does not
argue for practising what you already know, which §1.3's overlearning null
independently rules out.

**What survives both:** in the last week, the target is the **middle** —
the categories the learner gets right sometimes. The app's data already
identifies that band; `getWeakCategories()` uses a Wilson upper bound
against a `MASTERY` threshold of 0.8, which means "seen enough, not yet
reliable" is a group it can already name.

### 1.9 One thing the last week reliably buys that studying does not

Hausknecht et al. pooled 107 samples and 134,436 participants on
retesting: simply having taken the test before produced an adjusted score
gain of **d = 0.26**, and the gain was **larger when practice was
accompanied by coaching and when the same form was used**
([2007](https://pubmed.ncbi.nlm.nih.gov/17371085/)). In the language-exam
literature the same shape appears — a study of coaching for
English-proficiency university entry reports roughly **half an IELTS band
above the gain from test repetition alone**
([*J. European Second Language Association*](https://euroslajournal.org/articles/10.22599/jesla.74)).

Both are about different tests and different populations, and part of the
gain is format familiarity and anxiety reduction rather than language
learning. That is fine — **format familiarity and anxiety reduction are
exactly what is still purchasable in six days.** It is the strongest
available argument for the single most valuable thing on the list in §4:
**sit the YTÜ sample paper, whole, timed, once — and not on exam day.**

---

## 2 · What changes about the app's own advice

### 2.1 What the app says today, precisely

Three surfaces make claims about what to practise, and they are not the
same claim:

| Surface | What it does | Where |
| --- | --- | --- |
| `orderForPractice` | **unseen** items first, then items whose *last* answer was wrong, then the rest oldest-first | `js/quiz-engine.js` |
| `Yanlış defteri` | every item answered wrong and not yet graduated, **sorted by most wrong, then most recently wrong** | `js/storage.js:getMistakeBook`, `js/home.js:renderMistakeBook` |
| *En çok zorlandıkların* | categories below `MASTERY` (0.8), **sorted ascending by accuracy**, top 5 | `js/storage.js:weakestEntries` |

Only the second and third are worst-first. The first is *unseen*-first,
which is a different and better-behaved rule: with 73 shipped questions
most learners still have unseen items, so tier 0 dominates and the session
is mostly new material. **Nothing in §1 argues against
`orderForPractice`, in the last week or any other week.** Leave it alone.

### 2.2 Worst-first as a ranking: keep the selector, change the target

§1.8 says the last-week target is the **middle band** — categories the
learner gets right sometimes — not the bottom. The app already computes
everything needed to rank that way: `weakestEntries` produces
`{correct, total, accuracy, confident}` per category and then sorts
`a.accuracy - b.accuracy`. Ranking by *proximity to mastery from below*
instead — nearest to 0.8 first, among categories still under it — is a
**one-comparator change**, and it is the single cheapest evidence-backed
edit in this document.

I would gate it on the last-week mode rather than make it the default,
for one reason: with months left, the bottom of the list is where the
retrieval budget belongs (Karpicke & Roediger), and outside the last week
there is time for the labor-in-vain items to stop being labor-in-vain.
The ranking should follow the horizon, which is exactly what §3's one bit
is for.

### 2.3 The mistake book has a rule that cannot be satisfied in six days

`MISTAKE_BOOK_GRADUATION` is 2, **on two separate days**, since the last
wrong answer. The card promises it in Turkish: *"Bir soru, ayrı iki günde
doğru cevaplandığında defterden düşer."*

Do the arithmetic on a seven-day window. An item answered wrong on day 6
cannot leave before the exam — there is one day left and it needs two.
More generally, in the last week the book **only grows**, for everyone,
because new wrong answers arrive faster than the two-day clock can clear
them. A learner opening the Test tab on day 3 sees a number that has gone
up every time they have practised.

That rule is right for the app's normal life and I would not change the
threshold — one correct answer straight after reading an explanation
really does prove only that the explanation was on screen. But the
**copy** is a problem specific to this window, and it is a two-line fix:
in the last week the card should say what the book is *for* now — a list
of what to look at again before Friday — rather than advertise a
graduation the calendar has made unreachable.

This is the one place where I think "demoralising" is a real risk rather
than a guess, and the reason is not psychological, it is arithmetic: the
app makes a promise it cannot keep in this window, and the learner will
notice.

### 2.4 What the app should say differently, concretely

Five changes of wording, none of them a feature.

1. **"Answer, don't re-read."** Rowland's moderator (*g* = 0.69 at
   retention intervals over a day, larger with feedback) is at its
   strongest here, and re-reading a lesson already read is the archetypal
   low-yield last-week activity. The exception is a lesson **never**
   read in a category the learner is losing marks on — that is
   instruction, not restudy, and §1.3's overlearning null says nothing
   about it.
2. **"Mixed, not by topic."** Already the app's position, and this
   horizon is where the evidence for it is most direct: Pan et al. found
   the interleaving benefit **at one week**. The existing copy on
   *Karışık test* is good; it needs nothing added.
3. **"The middle, not the bottom."** §2.2, said out loud: the categories
   worth the last hours are the ones you get right *sometimes*.
4. **"This app is a small part of your exam."** The honest sentence, and
   the one with the largest expected value. `exam-spec.md` puts the app at
   about **7 of ~100 points**. A learner deciding how to spend Tuesday
   evening cannot make that decision without this number, and no other
   screen in the app will ever tell them.
5. **One sentence of arousal reappraisal**, at d ≈ 0.2 for cognitive
   written tasks (§1.7) and a cost of one paragraph. Something close to:
   *sınavda kalbinin hızlanması, bedeninin sana yardım etmek için
   hazırlanmasıdır; bunu bir tehlike işareti değil, hazırlık işareti
   olarak oku.* That is a claim about physiology with an RCT
   meta-analysis behind it, not a motivational slogan, and the
   distinction should survive into whatever Turkish gets written.

### 2.5 What must not change, even in the last week

The refusals in `practice-modes.md` §11 and `v1-plan.md` *Refused* are
**more** binding in the last week, not less, and the argument is the same
one in a sharper form. A streak or a daily goal is a guilt loop; applied
to someone six days from an exam that decides their year, it is a guilt
loop with a deadline attached. A countdown is the worry component of test
anxiety, rendered. A per-question timer is time pressure applied to
learning at the moment accuracy matters most.

The one genuine tension is the **timed, feedback-deferred block** that
`v1-plan.md` already decided to build and hold. §1.9 says format
rehearsal is one of the few things still purchasable in six days — but
the same section says the rehearsal that pays is *of the real paper*, and
the app has no exam-shaped content to put in the block. The decision in
`v1-plan.md` — build it, ship it with restatement, never with grammar
singles — survives this arm unchanged. The last-week version of that
rehearsal is **the YTÜ sample paper on the owner's own desk**, and §4
schedules it.

---

## 3 · Should the app know the exam date?

**No date. One bit, set by the learner.**

### 3.1 What a date would buy

Pacing and a countdown. Pacing is the weaker half of that pair, because
§1.2 has already established that at this horizon there is almost no
schedule to compute: the spacing literature's advice for a six-day window
is "most days", and any per-day plan the app generated would be
precision the evidence does not have. A countdown is the stronger half —
it is genuinely useful information, and the learner already has it.

### 3.2 What it would cost

**The worry component.** Von der Embse et al.: worry correlates with poor
performance at *r* = −0.22, more strongly than emotionality. A number
counting down on the app's home screen is a worry cue rendered in the
design system's own type scale, shown every time the app is opened, with
no way to answer it. `practice-modes.md` §5.2 already refused a
per-question countdown partly on these grounds; a days-to-exam countdown
is the same object at a different timescale.

**It resembles the two mechanics already refused, and one honest
difference.** A streak and a daily goal are refused because they are
*manufactured* contingencies producing introjected regulation
(`practice-modes.md` §4.2). A countdown is not manufactured — the exam
really is on Friday — so the introjection argument does **not** transfer,
and I want to be explicit that I am not reusing it. What transfers is the
*second* half of §4.2's argument: the failure mode is drift, not drama.
A visible deadline plus a visible weak-spots list is a pairing that pushes
a learner toward the cheapest action that makes the numbers move, and
§1.8 says the cheapest actions are not the highest-yield ones.

**And it would not survive the storage.** `onboarding.md` records
WebKit's seven-day eviction of script-written storage. An exam date is
exactly the value whose loss is invisible and whose window is exactly
seven days long: set it, do not open the app for a week, and the app
either shows nothing or — worse, if any arithmetic were built on it —
shows a stale plan. A date is the highest-consequence, lowest-durability
thing this app could store.

### 3.3 The one bit

A boolean in the settings the app already has:
`englishPrep.settings` → `EXAM_WEEK`, rendered with the existing
`toggleRow` in `js/profile.js` — the same primitive as *Önce kendin
düşün*. The learner turns it on when their exam is close and off when it
is over. Roughly a day, most of it Turkish copy rather than code.

What it changes: the weak-spot ranking (§2.2), the mistake-book copy
(§2.3), and the addition of one honest note (§2.4 items 1, 3 and 4). What
it does **not** change: any number on any screen, the question order, or
anything that ticks.

Why a bit beats a date, in one line: **a date is a fact about the world
that the app cannot verify, cannot keep, and cannot help with; a bit is a
statement of intent from the learner, and intent is the only input the
advice actually needs.**

**The counter-argument, stated fairly.** With a date the app could stop
suggesting a fourth pass through Tenses on day six and say "the paper is
tomorrow, sleep". With a bit it can say the same thing for the whole
week, less precisely. That is a real loss, and it is small — the
recommendations in §4 barely differ between day six and day two, because
§1.2 says they cannot.

---

## 4 · Seven days, concretely

Assumptions, stated so they can be argued with: **three hours a day, seven
days, roughly 21 hours**, a learner around B1–B2 who has already worked
through most of the app, and the exam described in `exam-spec.md`. Adjust
the hours proportionally; the *proportions* are the recommendation, not
the totals.

### 4.1 Where the marks are, against where the hours would go by default

| Section | Points | App covers | Trainable in six days? |
| --- | --- | --- | --- |
| Cloze (10 blanks) | 15 | ~3.75 | **Partly** — discourse markers, quantifiers, `so/such`, relatives are closed sets |
| Closest meaning | 15 | ~3 (24 items authored, unshipped) | **Yes** — narrow, learnable, and the app can serve it |
| Reading (2 × 7) | 21 | 0 | **Format, yes. Comprehension, barely** |
| Paragraph completion | 9 | 0 | **Yes** — the most trainable section per hour on the paper |
| Listening MC | 6 | 0 | A little |
| Listening note-taking | 14 | 0 | **Yes, mechanically** — it is a procedure, not a skill |
| Writing | ~20 (unverified) | 0 | Not without a marker |

The default failure is obvious once the table exists: **the app is the
most pleasant thing on the list and it addresses the least of it.** A week
spent inside it is a week spent on 7 points.

The second-order point is the one that decides the plan. **Paragraph
completion and note-taking are the two sections where a procedure can be
installed in days**, because neither is really a language test — one is
about referents and connectives, the other is about writing an outline
while listening. Reading, by contrast, is where the marks are and where
six days changes least: the L2 reading-strategy meta-analysis reporting a
mean effect around 0.91 across 46 studies
([Yapp, de Graaff & van den Bergh, 2023](https://journals.sagepub.com/doi/10.1177/1362168820985236))
is measuring instruction programmes that run for weeks, and quoting it for
a six-day window would be exactly the transfer error §0 warns about. What
*is* available in six days on reading is **format**: paragraph-numbered
texts, seven known question types, and a time budget — the §1.9 retest
finding, not the strategy-instruction finding.

### 4.2 The plan

**Day 7 — measure, once.** Sit **Session I of the YTÜ sample paper**,
whole, in one sitting, with a clock and no dictionary. Then spend as long
again marking it and writing down *why* each wrong answer was wrong — not
the correct letter, the reason. This is the highest-value 2–3 hours of the
week: it is the retest effect (`d` ≈ 0.26, larger with the same form,
§1.9), it is the only honest diagnostic anyone has, and it converts "I
should study English" into a list. Do it today rather than on day two —
everything after this depends on its output.

**Days 6 → 2 — five working days, roughly the same shape each day.** The
order within a day matters less than the mix; interleave sections rather
than blocking a whole day on one.

| Block | Minutes | What |
| --- | --- | --- |
| Cloze grammar the app does not teach | 45 | Discourse markers, relative pronouns, quantifiers, comparatives, `so/such`, causatives — the list in `exam-spec.md`. Closed sets: learn them as sets, test yourself, do not read about them |
| Reading | 45 | One 700-word passage, seven questions, timed. Then review every item against the paragraph it cites |
| Paragraph completion + restatement | 30 | Turkish market YDS/YÖKDİL practice books are full of *paragraf tamamlama* and *cümle tamamlama*; this is the cheapest section per hour on the paper |
| Listening with a note sheet | 20 | Any 8–12 minute academic lecture. Draw the headed outline first, fill it while listening, once. The exam's larger listening half is this exact task |
| **The app** | **20** | One mixed test, then the mistake book. Twenty minutes, not two hours |
| Vocabulary | 20 | Academic word list, *tested* rather than read. Two of ten cloze blanks and at least one reading item per text are vocabulary |

That is 3 hours and it deliberately gives the app **11% of the time**,
which is close to its 7% of the marks. If that reads as an odd
recommendation to put in this repository, it is the honest one.

> **Superseded on 2026-09-04**, along with the headline above: at ~22 of
> ~100 the proportional line is 40–50 minutes, and the row above should
> read **40**, taken from the two rows whose material the app now covers.
> The rest of the table stands — the sections it cannot touch are still
> half the paper.

**Day 1 — the day before.** No new material. One short mixed test in the
app, re-read the error notes from day 7 and from the week, pack the
documents, and go to bed at the usual hour. The evidence for this day
being light is §1.3 (overlearning: nil at one week and four) against §1.6
(sustained attention: *g* ≈ 0.78 for sleep loss). The trade is not close.

**Exam morning.** Nothing new. Eat. Arrive early. If arousal shows up,
read it as preparation rather than as danger (§1.7 — *d* ≈ 0.2, and no
more than that is claimed).

### 4.3 What the app cannot help with, said plainly

- **Reading (21 points).** No passages, no schema for one, and
  `v1-plan.md` stage 2 item 3 costs a week of code. Use the sample paper
  and any B2 reading source with questions.
- **Listening (20 points).** No audio, and the note-taking half is not a
  multiple-choice task at all. Text-to-speech would destroy the thing
  being tested. Use real lectures.
- **Writing (~20 points).** Nothing here can mark an essay, and a textarea
  with no feedback is a false signal on a fifth of the paper
  (`v1-plan.md`, *Refused*).
- **Most of the cloze grammar (11 of 15 points).** Discourse markers,
  relatives, quantifiers, comparatives, `so/such` — named in
  `exam-spec.md` as what the sample actually tests, and none of it is in
  the app.
- **Vocabulary.** Deferred since the README's first roadmap.

What the app *is* good for in this week, precisely: **twenty minutes a day
of mixed retrieval with elaborated feedback on tenses, modals and the
passive** — a real but small part of the cloze and restatement sections —
**plus the mistake book as a list of what to look at again.** That is a
genuine contribution and it is not the day's main event.

---

## 5 · Build, defer, refuse

The bar the brief sets is right and I have held to it: **anything costing
more than a day has to beat writing more questions.** In this particular
week it has to beat something stronger — *shipping questions that are
already written* — and almost nothing does.

### 5.1 Build

**1 · Ship Closest Meaning.** *(half a day, and it is not a feature)*
24 reviewed restatement questions and 6 lessons are sitting in
`docs/agents/drafts/closest-meaning/` behind one command. Restatement is
**15 of Session I's 60 points**, the app serves none of it today, and the
draft's own round-3 note records five blind passes agreeing with the key
on all 24 and an explicit *ship*. This raises exam coverage by more than
every other item in this document combined, and it is the only action here
that would still be worth taking if the exam were tomorrow.

**2 · Say what the app covers.** *(hours, and not gated on anything)*
One short paragraph, in Profil beside the existing "İçerik hakkında" note
or on the Test tab: this app practises tenses, modals, the passive and
sentence restatement; the exam also has reading, paragraph completion,
listening with a note sheet, and writing. A learner budgeting Tuesday
evening cannot make that call without it, and the app is the only thing
that knows the number. It is true in every week, so it should not wait for
a last-week mode.

**3 · One bit: `Sınav haftası`.** *(about a day, mostly Turkish copy)*
A boolean in `englishPrep.settings`, rendered with the `toggleRow`
primitive already in `js/profile.js`. Turning it on changes three things
and nothing else:

- the weak-spot ranking sorts **nearest-to-mastery first** rather than
  lowest-accuracy first (§2.2 — a comparator, not an algorithm);
- the mistake-book card's copy stops promising a graduation the calendar
  cannot deliver (§2.3);
- one note appears saying the three true things: answer rather than
  re-read, mixed rather than by topic, and this app is a small part of
  the paper.

No date, no countdown, no arithmetic, nothing that ticks.

**4 · One sentence of arousal reappraisal.** *(hours; a tone decision for
the owner)* §1.7. *d* ≈ 0.2 on cognitive written tasks in a 2024
meta-analysis of RCTs, cost of one paragraph. It belongs in the last-week
note rather than on a screen a learner sees every day.

That is the whole build list, and items 2–4 together are under two days.

### 5.2 Defer

| Deferred | Picked up when |
| --- | --- |
| **The timed, feedback-deferred block** | It became *eligible* the moment restatement ships — a 10-item timed restatement run is a rehearsal of a real section of the real paper, which is exactly the distinction `v1-plan.md` drew. But it is a day of code, and in this particular week that day is better spent shipping content. Build it after the exam |
| **Reading passages and reading lessons** | `v1-plan.md` stage 2. A week of code and 10 passages; nothing about a deadline makes that faster |
| **Vocabulary** | Same. Two of ten cloze blanks and at least one item per reading text, and still weeks away |
| **Per-category "what to do today"** (`learning-design.md` §5) | It is a spacing recommendation, and §1.2 says the spacing question has no answer worth computing at a six-day horizon. It is a good idea for a three-month horizon and a bad one for this one |
| **Reordering `orderForPractice` for the last week** | Never, as far as I can tell — unseen-first is right at every horizon. Recorded here so the next session does not reopen it |

### 5.3 Refuse

**A stored exam date, and any countdown.** §3. It buys a number the
learner already knows, it renders the worry component that
[von der Embse et al.](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683)
found most associated with poor performance, and it is the one value in
this app whose storage lifetime is the same length as its useful life.

**Any "you have not studied today" prompt, in any form** — a badge, a
banner, a red dot, a sentence. This is the daily-reminder mechanic that
`practice-modes.md` §11 refuses, wearing a deadline as an excuse. The
learner six days from an exam that decides their year does not need
manufactured urgency, and introjected regulation does not become healthy
because the pressure is now real.

**Lowering `MISTAKE_BOOK_GRADUATION` so the book can empty before the
exam.** It is tempting for exactly the reason it is wrong: it makes a
number go down by making the number mean less. One correct answer
immediately after reading the explanation proves the explanation was on
screen. Fix the copy (§2.3), not the threshold.

**A "sınav modu" that re-runs the whole pool.** The intuitive last-week
feature and the one with a direct null against it: overlearning changed
nothing at one week or four
([Rohrer & Taylor, 2006](https://onlinelibrary.wiley.com/doi/10.1002/acp.1266)).
It would also spend the week re-measuring item memory, which
`practice-modes.md` §1 already established is what a second pass through
73 questions measures.

**A generated day-by-day plan inside the app.** §1.2: there is no
schedule to compute at this horizon, and a plan rendered by software
looks like it was derived from something. §4 is a plan; it belongs in a
document a human wrote and sent to four friends, not in a screen that
implies a model behind it.

**An expressive-writing exercise before the exam.** §1.7. One *Science*
paper and at least one failed replication is not a basis for putting a
ten-minute ritual in front of someone on exam morning.

**A per-question or per-section timer on the app's grammar items.**
Unchanged from `practice-modes.md` §5.2 and `v1-plan.md`. The exam-shaped
rehearsal is the sample paper, and the app does not yet contain a section
worth timing.

**Writing new questions this week.** Not a refusal of content — a refusal
of *this* content *now*. The pipeline's throughput is review, at six to
eight minutes of genuine review per item (`v1-plan.md` stage 3), and the
one controlled comparison found teacher-plus-AI items carrying *more*
flaws than teacher-only ones when reviewers disengaged. Questions rushed
into `data/` in exam week are the exact conditions that produce a
miskeyed item in front of someone sitting the exam in four days. Ship the
reviewed ones; write the rest afterwards.

---

## 6 · Open questions for the owner

1. **When is the exam, exactly?** This is `v1-plan.md`'s blocked item #2
   and it is now blocking a second document. Everything in §4 assumes
   roughly seven days. If it is four weeks, §4 is wrong and
   `learning-design.md` §5's two-to-four-day spacing is right.
2. **Do you have the sample paper unsat?** §4.2's first instruction is to
   sit Session I whole and timed. If it has already been worked through
   piecemeal, the retest and diagnostic value is mostly spent and the day-7
   block should become a different paper, or reading practice.
3. **Is 20 minutes a day in the app acceptable to hear?** §4.2 recommends
   the app get about 11% of the study time. That is the honest allocation
   and it is a strange thing for the app's own repository to say. Someone
   has to decide whether the app is allowed to tell its five users to
   spend less time in it.
4. **Ship Closest Meaning before the exam, or hold it?** The draft is
   reviewed and its README calls it shippable; the repair rounds it went
   through are also the reason for caution. Shipping puts 24 items on a
   section worth 15 points in front of people who need them this week.
   Holding avoids any chance of a defect reaching someone four days out.
   My read is ship — five blind passes at 24/24 is a stronger record than
   anything else in `data/` has — but it is a content-risk decision and it
   is yours.
5. **Should the last-week note name the other sections by name?** §5.1
   item 2 tells a learner the app covers a small part of the paper. Said
   plainly it is useful; said badly it reads as the app apologising for
   itself, four days before an exam. It is a tone call.
6. **After the exam, does the last-week mode stay?** It is one boolean
   and about a day. If the answer is "this is for one week in September",
   the honest option is a document rather than a feature — §4 pasted into
   the group chat costs nothing and expires cleanly.

---

## Sources

Read as search-result summaries of abstracts and first-party pages, not as
full texts — see §0. Where a claim depends on a number, that number
appeared in more than one summary.

**Spacing, massing and overlearning at short horizons**
- [Rohrer & Taylor (2006). The effects of overlearning and distributed practice on the retention of mathematics knowledge. *Applied Cognitive Psychology* 20](https://onlinelibrary.wiley.com/doi/10.1002/acp.1266) · [ERIC ED505642](https://eric.ed.gov/?id=ED505642)
- [Cepeda, Vul, Rohrer, Wixted & Pashler (2008). Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention. *Psychological Science* 19](https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02209.x) · [ERIC ED505660](https://eric.ed.gov/?id=ED505660)
- [Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin* 132](https://www.semanticscholar.org/paper/634293f80f8e661dc259e4902bca99821bec3014)
- [Kornell (2009). Optimising learning using flashcards: spacing is more effective than cramming. *Applied Cognitive Psychology* 23](https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.1537)

**Retrieval practice and interleaving**
- [Roediger & Karpicke (2006). Test-Enhanced Learning. *Psychological Science* 17(3)](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x)
- [Karpicke & Roediger (2008). The Critical Importance of Retrieval for Learning. *Science* 319](https://pubmed.ncbi.nlm.nih.gov/18276894/)
- [Rowland (2014). The effect of testing versus restudy on retention: a meta-analytic review. *Psychological Bulletin* 140](https://pubmed.ncbi.nlm.nih.gov/25150680/)
- [Yang, Luo, Vadillo, Yu & Shanks (2021). Testing (quizzing) boosts classroom learning. *Psychological Bulletin* 147](https://pubmed.ncbi.nlm.nih.gov/33683913/)
- [Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving Students' Learning With Effective Learning Techniques. *PSPI* 14(1)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)
- [Pan, Tajran, Lovelett, Osuna & Rickard (2019). Does Interleaved Practice Enhance Foreign Language Learning? *J. Educational Psychology* 111(7)](https://eric.ed.gov/?id=EJ1230840)
- [Brunmair & Richter (2019). Similarity matters: A meta-analysis of interleaved learning](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)

**Study-time allocation under pressure**
- [Metcalfe (2002). Is study time allocated selectively to a region of proximal learning? *JEP: General* 131](https://psychology.columbia.edu/sites/psychology.columbia.edu/files/2016-11/349.pdf)
- [Metcalfe & Kornell (2005). A Region of Proximal Learning model of study time allocation. *J. Memory and Language* 52](https://www.semanticscholar.org/paper/7062327_Study_efficacy_and_the_region_of_proximal_learning_framework)
- Nelson & Leonesio (1988), the "labor-in-vain" effect — reached only through the two papers above, not directly.

**Sleep**
- [Lim & Dinges (2010). A Meta-Analysis of the Impact of Short-Term Sleep Deprivation on Cognitive Variables. *Psychological Bulletin* 136](https://www.semanticscholar.org/paper/9d1570cd8017a9816df6171c97cfbc8e79815d1a)
- [Pilcher & Huffcutt (1996). Effects of sleep deprivation on performance: a meta-analysis. *Sleep* 19](https://pubmed.ncbi.nlm.nih.gov/8776790/)
- [Okano, Kaczmarzyk, Dave, Gabrieli & Grossman (2019). Sleep quality, duration, and consistency are associated with better academic performance in college students. *npj Science of Learning* 4](https://www.nature.com/articles/s41539-019-0055-z)
- [Gais, Lucas & Born (2006). Sleep after learning aids memory recall. *Learning & Memory* 13](https://learnmem.cshlp.org/content/13/3/259.full)
- [Sleep and novel word learning: systematic review and meta-analysis (2021). *Psychonomic Bulletin & Review*](https://link.springer.com/article/10.3758/s13423-021-01980-3)
- [Holz et al. (2012). The timing of learning before night-time sleep. *PLOS ONE* 7(7)](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0040963)

**Test anxiety and one-shot interventions**
- [von der Embse, Jester, Roy & Post (2018). Test anxiety effects, predictors, and correlates: a 30-year meta-analytic review. *J. Affective Disorders* 227](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683)
- [Huntley et al. (2019). The efficacy of interventions for test-anxious university students: a meta-analysis of RCTs. *J. Anxiety Disorders* 63](https://pubmed.ncbi.nlm.nih.gov/30826687/)
- [Jamieson, Peters, Greenwood & Altose (2016). Reappraising Stress Arousal Improves Performance and Reduces Evaluation Anxiety in Classroom Exam Situations. *SPPS* 7](https://journals.sagepub.com/doi/abs/10.1177/1948550616644656)
- [Bosshard & Gomez (2024). Effectiveness of stress arousal reappraisal and stress-is-enhancing mindset interventions on task performance: a meta-analysis of RCTs. *Scientific Reports* 14](https://pubmed.ncbi.nlm.nih.gov/38575696/)
- [Ramirez & Beilock (2011). Writing About Testing Worries Boosts Exam Performance in the Classroom. *Science* 331](https://www.science.org/doi/abs/10.1126/science.1199427) — and a [failed replication](https://surface.syr.edu/etd/373)

**Test familiarity and coaching**
- [Hausknecht, Halpert, Di Paolo & Moriarty Gerrard (2007). Retesting in selection: a meta-analysis of coaching and practice effects for tests of cognitive ability. *J. Applied Psychology* 92](https://pubmed.ncbi.nlm.nih.gov/17371085/)
- [Teaching to the test: the effects of coaching on English-proficiency scores for university entry. *J. European Second Language Association*](https://euroslajournal.org/articles/10.22599/jesla.74)
- [Yapp, de Graaff & van den Bergh (2023). Effects of reading strategy instruction in English as a second language. *Language Teaching Research*](https://journals.sagepub.com/doi/10.1177/1362168820985236) — cited as a caution about horizon, not as support for a six-day intervention
