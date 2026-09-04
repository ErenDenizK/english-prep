# Practice modes

What the app should let a learner *do*, beyond the one thing it does now —
and which of the mechanics that made other study apps famous should be
kept out of this one.

**The short version.** The interesting constraint here is not the missing
backend or the missing build step. It is that **there are 72 questions,
four per category**. A learner who runs four 20-question mixed tests has
seen every item in the app. From the fifth test onward they are not
retrieving a grammar rule, they are recognising a sentence they have met
before, and every score after that is inflated. Almost every "game mode"
in the survey below — survival, sprint, beat-your-score, leaderboards —
is a mode whose value scales with pool size, and this pool cannot pay for
them. The modes that *do* pay here are the ones that change **what the
learner has to produce from the same item**: mistakes-only rerun,
recall-before-reveal, and eventually a timed section rehearsal. Those cost
almost no content and they get harder, not easier, on a second pass.

The other half of the answer is about motivation, and it is short: this
app has five or six users, all of whom have already decided to study
because there is an exam. It has no retention problem to solve. Streaks,
points, leaderboards and lives are engineering aimed at a problem this app
does not have, and each of them has a documented cost.

---

## 0 · What I could actually verify

Same limitation the exam research hit: **this session's network allows a
web search index but blocks direct page fetches.** Every domain I tried —
`pmc.ncbi.nlm.nih.gov`, `docs.ankiweb.net`, `blog.duolingo.com`,
university-hosted PDFs, `gwern.net` — returned a proxy denial. So the
research below is drawn from search-result summaries of abstracts and of
first-party help pages, not from reading the papers.

What that means in practice:

- **Study designs, samples and headline effect sizes** are reported
  consistently enough across independent summaries that I treat them as
  reliable. Where I give a number, it appeared in more than one summary.
- **Anything requiring a paper's discussion section** — moderators,
  boundary conditions, the authors' own caveats — I have either marked as
  uncertain or left out.
- **Product behaviour** (Quizlet's modes, UWorld's tutor/timed split) comes
  from vendor help pages via search summary. Product behaviour changes;
  re-check before copying anything.

Where the evidence genuinely does not settle a question, I say so rather
than picking the side that makes a recommendation sound cleaner. There are
two such places: whether timed practice helps or hurts at this stage, and
whether anything in the gamification literature survives contact with a
group of six.

---

## 1 · What a "test" is here today, measured

Read `js/quiz.js` and `js/quiz-engine.js` and it is one mode with three
scopes:

| Dimension | Today |
| --- | --- |
| Item shape | one paragraph (mean **20 words**), one blank, four options |
| Retrieval | recognition — pick one of four |
| Selection | `shuffle(pool).slice(0, n)` — uniform random, no memory |
| Scope | mixed / one topic / one category |
| Length | 5, 10, 20, all |
| Feedback | immediate, per question, explanation + transferable tip |
| Timing | none |
| Scoring | correct / total, plus a topic and category breakdown |
| Repeat behaviour | none — a question you got right yesterday is as likely to appear as one you have never seen |

And the pool it draws from:

| | |
| --- | --- |
| Topics | 3 |
| Categories | 18 |
| Questions | **72** |
| Questions per category | **exactly 4**, in every category |

Two consequences fall straight out of those numbers and they govern
everything else in this document.

**One: the pool is exhausted in four sittings.** A 20-question mixed test
is 28% of the entire app. Four of them, with uniform random selection and
no memory, and the expected coverage is essentially the whole file.
There is no version of "play more" that this content can absorb.

**Two: after that, the app is testing item memory, not grammar.** The
learner has seen the exact sentence, with the exact four options, and
read the explanation. Recognition of a familiar item is a much weaker
retrieval event than first exposure, and the score no longer measures what
it did. Nothing in the app currently notices this — `buildQuizSession`
has no idea what the learner has already answered, even though
`js/storage.js` has been recording `{id, topicId, correct}` for every
question of every attempt this whole time.

That stored history is the single most valuable unused asset in the app,
and three of the four modes I recommend are built on it.

---

## 2 · The survey: what the good apps actually do

I looked at what each mode is *for* — the retrieval demand it creates —
rather than what it is called. Sorted by whether the purpose is real.

### 2.1 Modes that change what the learner practises

**Review-only / mistakes-only rerun.** Restrict the pool to items the
learner has previously got wrong. Anki's version is the filtered deck
("Custom Study → Review forgotten cards"); every serious question bank has
one. Pedagogically this is the most defensible mode on the list, and the
reason is Karpicke & Roediger's 2008 *Science* experiment: students
learned foreign-language vocabulary, and after an item was first recalled
correctly it was either repeatedly restudied, repeatedly tested, or
dropped. **Repeated studying after learning had no effect on delayed
recall; repeated testing produced a large effect.** ([PubMed
18276894](https://pubmed.ncbi.nlm.nih.gov/18276894/)) The corollary that
matters here is the other half: items you can already produce are cheap to
drop, and the retrieval budget belongs to the items you cannot. With 72
questions, spending a quarter of a session re-asking the ones already
answered right three times is the most expensive thing the app currently
does.

**Spaced review.** Anki's core loop, Quizlet's Learn, Memrise's whole
premise. Cepeda, Pashler, Vul, Wixted & Rohrer's meta-analysis synthesised
**839 assessments across 317 experiments** and found the spacing benefit
robust, with the optimal inter-study interval growing as the retention
interval grows — you space wider when you need to remember for longer.
([Psychological Bulletin
132](https://www.semanticscholar.org/paper/634293f80f8e661dc259e4902bca99821bec3014))
Dunlosky et al.'s review of ten study techniques gave **only two** its top
"high utility" rating: practice testing and distributed practice.
([PSPI 2013](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266))
The evidence is as strong as education research gets. The catch for this
app is §1: a scheduler needs items to schedule, and four per category is
not a review queue, it is a short list. Real, but blocked on content — see
§8.6 and §10.

**Interleaved practice.** Mixing item types within a session instead of
blocking them by topic. Rohrer, Dedrick & Stershic ran it as a randomised
controlled trial in **nine seventh-grade classrooms, 126 students**, over
three months of ordinary homework: same problems, differently arranged.
The interleaved arrangement scored higher on tests one day and one month
later. ([J. Educational Psychology
107(3)](https://eric.ed.gov/?id=ED557355)) This app already has the mode —
the mixed test *is* interleaving — and it is worth naming that, because
"karışık test" currently reads as a convenience rather than as the
better-evidenced choice. It should be the default and it should say why.

**Production instead of recognition.** Typing the answer (Quizlet's Write,
Duolingo's typed exercises) rather than choosing it. The generation demand
is strictly higher. But the evidence does *not* say multiple choice is a
weak substitute, and this is one of the few places where the folk wisdom
is wrong: Little, Bjork, Bjork & Angello showed that multiple-choice
practice **with competitive incorrect alternatives** improves later
cued-recall performance on *related but untested* information — a benefit
cued recall itself does not produce — because the learner retrieves
reasons to reject each distractor.
([Little et al. 2012, UCLA](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf))
That finding is worth a lot here, since it says the app's existing item
format earns its keep *provided the distractors are competitive*, and it
points at a cheaper upgrade than typing: make the learner engage with all
four options (§8.1).

**Mock exam / full-length simulation.** UWorld's timed blocks, every
med-school and USMLE bank, every SAT/GRE course. Purpose is genuinely
distinct from item practice: pacing, stamina, section-switching, and
familiarity with the paper. UWorld's own framing of the split is the
clearest statement of it — tutor mode for immediate feedback and building
knowledge, timed mode to "simulate real exam conditions to improve pacing
and endurance", with the recommended progression running from mostly tutor
to mostly timed as the exam approaches.
([UWorld mode guidance, via prep summaries](https://residencyadvisor.com/resources/usmle-step1-prep/is-it-better-to-do-timed-or-tutor-mode-for-step-1-question-banks))
Real — see §6.

**Flashcards.** Two-sided recall with self-graded confidence. The correct
tool for vocabulary and for anything with a one-to-one mapping. This app's
content has no such mapping: a cloze paragraph has no "back of the card".
It becomes relevant the moment vocabulary content exists, and not before.

**Matching / drag-to-pair.** Quizlet's Match is explicitly "race against
the clock to match terms and definitions as quickly as possible"
([Quizlet Help Center](https://help.quizlet.com/hc/en-us/articles/360030841732-Studying-on-Quizlet)).
The retrieval it trains is term-to-definition association at speed. It is
also a dragging interaction, which WCAG **2.5.5 / 2.5.7** require a
non-drag equivalent for (`docs/design-system.md` §8.7 already names this).
For paragraph cloze there is nothing to match. Decorative here.

### 2.2 Modes that are motivational wrappers

**Streaks.** Duolingo's, and the most successful engagement mechanic in
the category. Discussed in §4.3.

**Lives / survival.** Duolingo's hearts; "you have three wrong answers,
how far can you get". What it is for, honestly: raising the stakes of each
item so attention rises, and manufacturing a loss condition that makes
resumption feel urgent. The learning claim — that it makes you careful — is
untested as far as I can find. The cost is concrete: it punishes the
learner for the exact behaviour the app wants, which is attempting items
they are unsure about.

**Sprint / beat-your-score / XP.** "How many in 60 seconds", personal
bests, points per session. Trains speed of recognition. In a 72-item pool
it trains speed of *recall of previously seen items*, which is not a skill
the exam pays for.

**Leaderboards.** Duolingo's Leagues. Social comparison as the driver.
The one mechanic in this survey with direct experimental evidence of harm
in a classroom setting (§4.2).

### 2.3 Three more, briefly, because they are usually misread

**Khan Academy's Mastery Challenge** is the most transferable design in
this whole survey and nobody talks about it as a game mode. It is **six
questions covering three skills, two questions per skill**: both right and
the skill levels up, one right and one wrong and it stays, both wrong and
it levels *down*. It unlocks only after you have reached "Familiar" on
three skills, and there is a **12-hour cooldown** between challenges,
explicitly so the spacing does its work rather than being farmed.
([Khan Academy Help
Center](https://support.khanacademy.org/hc/en-us/articles/360037127892-What-are-Mastery-Challenges-in-course-mastery))

Look at the shape: two questions per skill is exactly what this app's four-
per-category pool can serve, twice. The mechanic is a *competence signal*
rather than a currency — a level that can go down is a measurement, not a
reward — and the cooldown is the anti-farming rule that §4.2 says a streak
lacks. It is the one mechanic from a consumer product I would steal
outright, and the only reason it is not in §9 is the pool size: with four
questions per category a learner reaches the bottom of every skill in two
challenges.

**Brilliant** is not a mode at all, it is a content philosophy — "no
videos, everything is interactive", one concept per lesson, direct
instruction mixed with problem solving.
([Brilliant FAQ](https://brilliant.org/faq/)) That is a statement about
what a *lesson* is, and this project already made the same decision in
`docs/redesign-plan.md` stage 3 when a lesson became typed blocks with
`check` questions inline. Nothing to copy; worth noting the convergence.

**Memrise and Magoosh** add nothing this document does not already cover:
Memrise is spaced repetition with a speed-review layer on top (§2.1, §2.2),
and Magoosh is a timed question bank with video explanations — the
tutor/timed split again, plus a content format this project cannot
produce.

---

## 3 · The two things "oyun modu" can mean

Everything in §2.1 changes **what the learner has to do to get an item
right**. Everything in §2.2 changes **whether they open the app at all**.

Both are legitimate design targets, and this project is allowed to want
both. What it is not allowed to do is argue for one with the other's
evidence, which is the standard failure mode of this conversation:
someone proposes a leaderboard for engagement and defends it with a study
about learning outcomes, or proposes typed answers for learning and
defends it with a chart about daily actives.

So, two different questions with two different burdens of proof:

| | Retrieval mode | Motivational wrapper |
| --- | --- | --- |
| Changes | the cognitive demand of an item | the reason to open the app |
| Evidence to demand | learning-outcome studies, delayed post-tests | engagement/retention data **and** a check that motivation quality did not degrade |
| Failure looks like | a mode that feels harder and teaches nothing extra | a mode that lifts usage while making the learner resent it |
| Cost when wrong | wasted build effort | a person who quits studying for an exam |

The second row's asymmetry is the whole point of §4. A retrieval mode that
does not work is a waste. A wrapper that does not work can leave someone
worse off than no app.

---

## 4 · Motivation, honestly

### 4.1 What the literature actually supports

The headline meta-analysis is favourable and worth stating fairly. Sailer
& Homner synthesised gamification's effects and found significant small-
to-moderate effects on **cognitive** (g = 0.49, k = 19, N = 1,686),
**motivational** (g = 0.36, k = 16, N = 2,246) and **behavioural**
outcomes (g = 0.25, k = 9, N = 951). ([Educational Psychology Review 32,
2020](https://eric.ed.gov/?id=EJ1245270)) Anyone arguing that gamification
"doesn't work" is arguing against that.

But read the same abstract's next sentence, because it is the part that
decides this app's case: **the cognitive effect held up in a subsplit of
methodologically rigorous studies; the motivational and behavioural
effects were less stable.** The strongest evidence is for the effect that
game-*structure* has on learning, and the weakest is for the effect that
game-*rewards* have on wanting to learn — which is exactly backwards from
how the mechanics are usually sold.

Three further findings constrain it:

**The undermining effect is real and it is specifically about rewards.**
Deci, Koestner & Ryan's meta-analysis of **128 experiments** found that
engagement-contingent, completion-contingent and performance-contingent
tangible rewards all significantly undermined free-choice intrinsic
motivation (d = −0.40, −0.36, −0.28 respectively).
([Psychological Bulletin 125(6),
1999](https://www.semanticscholar.org/paper/8ad9801baea65b40fbbe6fc56e34b2b7be47d0ba)) The mechanism SDT gives
is that a reward contingent on doing the thing reframes the thing as
something you do *for* the reward. A learner who is studying because
there is an exam in three months already has identified regulation — the
good kind of extrinsic motivation, where the behaviour is endorsed
because the goal is personally valued. Points are a downgrade offered to
someone who does not need one.

**Introjected regulation is the specific thing streaks produce.** In SDT's
taxonomy introjection is compliance with *internal* pressure — guilt,
shame, ego — and it is still classified as **controlled** motivation
because the behaviour is not endorsed by the self. The critique of
streak-and-punishment designs is precisely that they "produce short-term
compliance but tap into introjected regulation rather than identified or
intrinsic motivation."
([Frontiers in Psychology, gamification and online language
learning](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1295709/full))
Opening an app so a number does not reset is not the same act as opening
it to learn, even when the fingers do the same thing.

**One classroom experiment found net harm.** Hanus & Fox ran a 16-week
longitudinal study across two university courses — same curriculum, one
gamified with a **leaderboard and badges** — measuring at four time
points. Students in the gamified course showed **less intrinsic
motivation, less satisfaction and less empowerment over time** than the
control, and did worse on the final exam.
([Computers & Education 80,
2015](https://www.semanticscholar.org/paper/dff76a9862467d426113ec530f83942016ae3a97))
It is one study, in a specific setting, and the meta-analysis above
outweighs it in aggregate. But it is the single most directly relevant
study to "should I add a leaderboard for my five friends", and its answer
is no.

**And the effects decay.** The novelty effect is well documented in
gamified learning systems: high activity at introduction, a drop after a
few weeks once the novelty wears off. A 2022 longitudinal study of
Brazilian STEM students across seven intervals found a U-shape — the drop
at about four weeks, then partial recovery through familiarisation.
([Rodrigues et al.,
2022](https://www.researchgate.net/publication/358614501_Gamification_suffers_from_the_novelty_effect_but_benefits_from_the_familiarization_effect_Findings_from_a_longitudinal_study))
Four weeks is not a footnote when the exam is twelve weeks away. It is
most of the study period.

### 4.2 The streak, specifically

Duolingo's streak deserves credit before criticism, because it is the
best-executed engagement mechanic in consumer software and the reasons are
design reasons, not psychological trickery:

- **It is a single number with a single meaning.** No composite score, no
  interpretation required.
- **It is generous where it matters.** Streak Freeze and the "earn it
  back" window exist because Duolingo found leniency *increases*
  engagement — the punishing version makes people quit outright after a
  loss. That is the mechanic's designers admitting the loss-aversion
  hook's sharp edge and filing it down.
- **It rewards frequency, and frequency is the thing that actually
  works.** Spacing is one of only two techniques Dunlosky et al. rated
  high-utility. A streak is a crude spacing scheduler with a face on it.

Now the cost. The mechanism is loss aversion over an accumulating sunk
cost, and it is deliberate: the longer the streak, the more expensive
breaking it feels, and by design that cost grows without bound while the
learning value of one more day stays flat. The commentary on this is
extensive and largely blog-level rather than peer-reviewed — I could not
find a controlled study of streak harm, and I am not going to dress up
[The Decision Lab's "streak
creep"](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)
as one. What is well-evidenced is the general form of the objection:
introjected regulation is controlled motivation (§4.1), and controlled
motivation is what a guilt-driven daily open produces.

The failure mode I would actually expect here, and it is not the dramatic
one: **a learner protects the streak with the cheapest possible session.**
In this app the cheapest possible session is a 5-question test on the
topic they are best at. The streak survives, the weak categories never get
touched, and the app's own weak-spot data — the most useful thing it
collects — becomes the record of a metric being farmed rather than a
diagnosis.

### 4.3 Six friends and a real exam

Now the question that actually decides this. Does any of it apply?

**Mostly, no — and for a structural reason.** Every engagement mechanic
above is an answer to *the retention problem*: a free consumer product
whose users have no external reason to come back, competing for attention
against everything else on the phone. Duolingo needs a streak because most
of its users are learning Italian for no particular deadline. That is a
real and hard problem and streaks are a good answer to it.

This app has the opposite situation:

- **The users already have a deadline**, and it is a consequential one —
  fail and it is another year of prep school.
- **There are five or six of them and they know each other.** The
  strongest engagement mechanism available is a friend saying "have you
  done the passives ones yet", and it costs nothing to build.
- **The horizon is a few months, not a habit for life.** A mechanic whose
  novelty half-life is four weeks and whose payoff is compounding habit
  formation is being asked to work over exactly the interval it works
  worst.
- **The withdrawal problem is inverted.** The undermining literature's
  worry is what happens to motivation when the reward stops. Here the
  reward *and* the activity both stop on exam day, so that particular harm
  is bounded. What is not bounded is the harm during the study period, if
  the mechanic redirects effort toward the metric.

There is one honest counter-argument and it should be recorded: **the
users are university students who have all used Duolingo**, and a study
app with no visible progress at all can read as unfinished. The answer to
that is not points. It is that progress should be *shown* — how many
lessons read, how the weak categories are moving, how many of the 72
questions have been seen — because that is feedback on competence, which
SDT treats as a basic psychological need and which does not require a
reward contingency to satisfy. The app already computes almost all of it
in `js/storage.js` and shows some of it in Profil.

**Verdict.** Build competence feedback, not reward schedules. There is no
streak in this app, no XP, no leagues, and no lives. That decision is not
currently written down anywhere in the repository — I grepped — so this
document is where it goes on the record.

---

## 5 · Timed practice

### 5.1 What the evidence says

The best available synthesis is a quantitative review of **125 studies
yielding 827 effect sizes**, which found an overall small but
**detrimental** effect of time pressure on performance, and — the
important part — that the effect splits by measure: **time pressure
improves speed and impairs accuracy**, for both perceptual and cognitive
tasks.
([Meta-analysis of time pressure on human
performance](https://www.researchgate.net/publication/225280171_A_meta-analysis_of_the_effect_of_time_pressure_on_human_performance))
A related experimental literature on speeded testing finds that even
*mild* time pressure — enough time for everyone to finish comfortably —
makes people speed up from the very first item, and speed up more than the
constraint required.
([*Journal of Intelligence* 11(6),
2023](https://www.mdpi.com/2079-3200/11/6/120))

Add test anxiety. Von der Embse et al. synthesised **238 studies from
1988 onward** and found test anxiety negatively related to a wide range of
performance outcomes; the *worry* component correlated more strongly with
poor performance (r = −0.22) than the *emotionality* component
(r = −0.15).
([Journal of Affective Disorders 227,
2018](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683))
Worry is the cognitive component — the intrusive "I am running out of
time" thought — which is exactly what a visible countdown manufactures.

So a naive reading says: never add a timer. That reading is wrong, and the
reason is that these studies measure performance *on the timed occasion*.
They do not measure what practising under time does to performance on a
later timed exam. The exam is timed whether or not the app is. Pacing has
to be learned somewhere, and learning it for the first time in the hall is
the worst available option.

The practitioner consensus — UWorld's tutor/timed split (§2.1) — resolves
it by **stage**: untimed with immediate feedback while knowledge is being
built, timed blocks as the exam approaches, and the mix shifting over
time. That is not research, it is exam-prep folklore, but it is folklore
that agrees with the research: accuracy first, because time pressure costs
accuracy; speed later, because speed is trainable and the exam demands it.

### 5.2 What that means for this app specifically

Two facts from `docs/research/the-exam.md` change the design:

**The İYS session 1 is not a heavily speeded paper.** Around 40 MC items
in 60–90 minutes is 1.5–2.25 minutes per item — and most of that budget is
consumed by reading two passages and a cloze paragraph, not by deciding
between four options. The pressure a learner will feel is **budget
pressure across a section**, not per-item pressure. A per-question
countdown would therefore train the wrong thing while imposing the exact
worry component the anxiety literature warns about.

**The app's items are 20-word paragraphs answered in seconds.** A timer on
those is a reaction-time game.

So if a timed mode belongs here, it is a *section* timer, not a question
timer, and it belongs in the mock exam (§6) rather than as a variant of
the existing test. What a timed mode must not do:

- **No per-question countdown**, and no auto-advance on expiry. Being
  moved off a question you were in the middle of is a 2.2.1 violation as
  well as an anxiety one.
- **No timing without a way to turn it off.** WCAG **2.2.1 Timing
  Adjustable (A)** is not optional: any time limit must be turnable off,
  adjustable to 10×, or extendable — and only a handful of exemptions
  apply, of which "real-time event" and "essential" are the plausible
  ones. A practice timer is not essential; it is a setting. This alone
  settles the design: **timing is opt-in, and it is switchable mid-session.**
- **Never colour, never flash, never beep as time runs low.** §5 of the
  design system already forbids animating anything the learner is acting
  on, and the anxiety literature says the worry component is what costs
  marks.
- **Do not score speed.** Report elapsed time next to accuracy and let the
  learner draw the conclusion. The moment "fast" is a score, the app is
  rewarding the behaviour the meta-analysis says degrades accuracy.

The honest position is that the evidence here is **thin in the direction
that matters**. I found nothing that measures whether practising a
proficiency exam under time improves the real score. Everything I found
measures acute performance under pressure, which is a different question.
I would build the timer because the exam has one and pacing is otherwise
unrehearsed — not because a study says so.

---

## 6 · A mock exam

### 6.1 Why it is the strongest idea on the list, in principle

If the app exists for one specific exam, a full-length timed simulation is
the highest-fidelity practice available, and three separate lines of
evidence point at it:

- **Practice testing is one of only two techniques Dunlosky et al. rated
  high-utility**, on the grounds that it benefits learners of different
  ages and abilities across many criterion tasks and in real educational
  settings.
  ([PSPI 2013](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266))
  A mock exam is practice testing at maximum dose.
- **Test anxiety is treatable, and study-skills work is among the things
  that treat it.** A meta-analysis of **44 randomised controlled trials,
  2,209 participants**, found interventions reduced test anxiety
  (g = −0.76) and improved academic performance (g = 0.37) versus control,
  with behaviour therapy best supported and study-skills training and
  combined approaches showing promise.
  ([J. Anxiety Disorders,
  2019](https://pubmed.ncbi.nlm.nih.gov/30826687/)) A learner who has sat
  the shape of the paper four times is not meeting it for the first time
  under conditions.
- **It is the only way to learn the things that are not knowledge**: how
  long two reading passages take, whether to do cloze first, what it feels
  like at minute 55.

### 6.2 What it would cost here, honestly

The code is the cheap part. Deferring feedback to the end is a flag in
`js/quiz.js`, a section timer is a `<time>` element and an interval, and
`results.html` already renders a per-question review. Call it a couple of
days of careful work including the accessibility obligations from §5.2.

**The content is the entire cost, and the app has none of it.** Against
the paper described in `docs/research/the-exam.md`:

| Section | Items | Does the app have this shape? |
| --- | --- | --- |
| Cloze Test | 10 blanks in **one** passage | No — 72 items are one blank in its own 20-word paragraph |
| Restatement | 10 | No |
| Reading | 2 passages × 7 | No |
| Paragraph Completion | 6 | No |
| Listening | 20 | No, and it needs audio the project cannot author |
| Writing | 1 essay | No, and it cannot be scored without a human |

One session-1 paper is **40 items in four shapes, none of which exist**.
That is more new content than the entire app currently contains, and three
of the four shapes need a schema change before a single item can be
authored — a multi-blank cloze is not a question, it is a passage with an
ordered list of questions, and `data/<topic>/` has no place to put one.

**So my recommendation is conditional, and here is the condition:** a mock
exam mode is the right thing to build **immediately after** the content
exists for at least the cloze and restatement sections, and it is a waste
of effort before that. A "mock exam" assembled from 40 of the app's
existing one-blank grammar items would be a simulation of an exam that
does not exist, which is worse than no simulation — it would rehearse a
pace and a paper shape the learner will not meet, and it would produce a
score the learner would reasonably trust.

There is a cheaper intermediate that is worth naming: a **timed section
rehearsal** rather than a full paper. Ten cloze blanks against a 12-minute
budget is a real, useful, buildable exercise the moment multi-blank cloze
content exists, and it needs none of the listening or writing apparatus.
That is what I would actually build first.

**What the recommendation depends on** (the exam research is still
settling): if session 1 turns out to be 45 items rather than 40, or the
duration is 60 rather than 90 minutes, the *timer* changes and nothing
else does. If the İYS turns out to have a discrete grammar section after
all, the existing 72 questions become mock-exam material and this whole
section gets cheaper by an order of magnitude. Do not build a timer
against unverified numbers — put the section durations in `data/`, not in
`js/config.js`, so a corrected sample paper is a content edit.

---

## 7 · Social, with no backend

Five friends want to compare notes. What is actually possible on static
hosting is more than it sounds, and less than it looks.

### 7.1 The mechanisms, concretely

**A result in a URL fragment.** Encode a finished attempt — score, item
count, per-category tallies, date — as compact JSON, base64url it, and put
it after the `#`. The receiving page decodes it and renders a read-only
result card. The fragment is **never sent to the server**: browsers strip
it before the request, which is why this works on GitHub Pages at all and
why it leaks nothing to GitHub. Practical size is not a problem — a
20-question result with 18 possible category buckets is a couple of
hundred characters, and the cross-browser-safe URL ceiling is around
2,000. Keep well under it anyway, because messaging apps and link
previewers are stricter than browsers.
([URL length limits](https://learn.microsoft.com/en-us/archive/blogs/ieinternals/url-length-limits))

**Sending it.** `navigator.share()` opens the OS share sheet, which is
exactly right on a phone. It requires a **secure context** (GitHub Pages
is HTTPS, fine) and **transient activation** — it must be called from a
real tap, not from a promise chain that resolved later. Support is good on
mobile Safari and Chrome for Android and patchy on desktop Firefox, so
feature-detect (`navigator.canShare?.({url})`) and fall back to
`navigator.clipboard.writeText()`, and fall back again to a selectable
input for the case where the clipboard is refused.
([MDN, Web Share
API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API))

**A challenge code.** Replace the unseeded `Math.random()` in
`shuffle()` with a seeded PRNG when a seed is supplied, thread the seed
through `buildQuizSession`, and put it in the shared URL. Two people who
open the same link get the **same questions in the same order** and can
compare answer for answer. This is about twenty lines — a `mulberry32`,
an optional argument, and a route — and it is the one genuinely social
thing here that does not need a server, because the server's usual job
(agreeing on which questions) is done by arithmetic instead.

### 7.2 What is worth having, and what it costs

Worth having: **the challenge code**, and a **result card the learner
chooses to share**. Both are one-way, both are the learner's deliberate
act, both work offline until the moment of sending.

The privacy cost is small but not zero, and it is worth being precise
because the app's central promise is "nothing is sent anywhere":

- A shared URL carries its payload **through whatever app it is sent in**.
  WhatsApp, Instagram and every link-preview bot on the way will see it.
  That is a change to the promise, so the share action has to be
  unmistakably the learner's choice, and the payload has to be small
  enough that they could read it if they wanted to.
- **Never put the profile name in the link automatically.** It is stored
  locally today and that is a promise the app has made implicitly. Let the
  share sheet's message text carry the name if the learner types it.
- **A shared score is unverifiable, permanently.** Anyone can edit the
  fragment. Among six friends that is socially fine — nobody forges a
  practice score to impress four people they eat lunch with — but it means
  the app must never present a received score as a fact, never rank
  people, and never store someone else's number as if it were data. Render
  it as "Ali'nin gönderdiği sonuç", not as a row in a table.

### 7.3 What is not possible, and should not be faked

No leaderboard, no friend list, no "who studied most this week", no push
notification, no shared progress. Every one of those needs a writable
server, and the two ways to fake it — a third-party backend-as-a-service,
or writing to a GitHub repo through a token in the client — both break the
no-backend constraint, the second one catastrophically. Not worth
discussing further.

---

## 8 · The modes nobody asked for

This is the section I would read first. Everything below is a **different
retrieval demand on the 72 questions that already exist** — which is the
only kind of mode a 72-question app can afford — and each one is cheaper
than authoring more content.

### 8.1 Cevabı önce düşün — hide the options until the learner commits

**What the learner does.** The paragraph appears with its blank and *no
options*. They think of a word — or type it, but thinking is enough — then
tap "Seçenekleri göster" and answer as normal.

**What it is for.** It converts a recognition item into an attempted
production item without changing a single character of content. Choosing
from four is the easiest form of retrieval there is; generating a
candidate first is the hard, effortful kind that the desirable-difficulties
literature is about. It also directly exploits the pretesting effect:
Richland, Kornell & Kao found that a pretest improved later performance
over an equivalent period of extended study, **and that this held when the
analysis was restricted to items the pretest failed to retrieve** — the
guess helps even when the guess is wrong.
([Richland, Kornell & Kao,
2009](https://pubmed.ncbi.nlm.nih.gov/19751074/))

**Cost.** One extra state in `renderQuestion()`, one extra button, a
setting in Profil. No engine change, no storage change, no content.
Half a day.

**Content it needs that does not exist.** None. This is the highest
value-per-line item in this document.

**Caveat.** It adds a tap to every question and it will feel slower. It
should be a mode the learner turns on, not the default, and it earns its
place *after* the first pass through a topic, when recognition has already
gone stale.

### 8.2 Yanlış defteri — a mistakes-only rerun

**What the learner does.** Opens a list of every question they have got
wrong, ordered worst-first, and drills only those. An item leaves the list
after being answered correctly twice on separate days.

**What it is for.** Concentrating the retrieval budget where it pays.
Karpicke & Roediger's dropping experiment (§2.1) is the direct
justification: continued testing of not-yet-learned items is what moves
delayed recall; continued restudy of already-learned ones does nothing.
With 72 items, uniform random selection spends most of a session on
material the learner has already demonstrated.

It also has the right name. *Yanlış defteri* is an established habit in
Turkish exam prep; the app would be digitising something the users already
believe in rather than teaching them a new mechanic.

**Cost.** Small, and smaller than it looks: `js/storage.js` has been
recording `{id, topicId, correct}` for every question of every attempt
since the beginning, so the data is already on disk in every user's
browser. What is missing is a selector (`questionsAnsweredWrong()`), an
entry point on the Test tab, and a rule for when an item graduates.
`quiz-launch.js` already exists precisely so a new entry point cannot skip
a step. One to two days.

**Content it needs.** None.

**The one design trap.** Do not let the list empty itself into a
congratulation. An empty *yanlış defteri* in a 72-question app means "you
have seen everything once", not "you are ready". Say the true thing.

### 8.3 Emin misin? — confidence-weighted answering

**What the learner does.** Answers, and marks whether they were sure. Two
taps, or one long-press, or a two-position control under the options.

**What it is for.** Two things at once. Sparck, Bjork & Bjork found that a
confidence-weighted multiple-choice format — where the test taker
indicates relative confidence among the alternatives — **significantly
enhanced later recall** compared with standard multiple choice, and that
participants were largely unaware it had.
([Cognitive Research: Principles and Implications,
2016](https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-016-0003-x))

The second thing is diagnostic and specific to this app. Right now
`getWeakCategories()` cannot distinguish two very different learners: one
who guessed and got it right, and one who knew it cold. **Confidently
wrong** is the cell that costs marks in a real exam, and it is currently
invisible. A single boolean per answer would let Profil say the most
useful sentence a study app can say: *"Passive with modals — you are sure
and you are wrong."*

**Cost.** A control in `js/answers.js`, one extra field in the stored
attempt, one new derivation in `js/storage.js`, one row in Profil. A day
or two. The stored history format would need a version guard for
attempts recorded before the field existed.

**Content it needs.** None.

**Risk.** It is a second decision on every question, and the design system
is right that answering is the action performed hundreds of times per
session. If it cannot be done in one tap without moving anything, it is
not worth it.

### 8.4 Neden yanlış? — elimination practice

**What the learner does.** Instead of picking the right option, taps the
three that are wrong.

**What it is for.** Little, Bjork, Bjork & Angello's finding (§2.1) is
that multiple-choice practice benefits *related, untested* information
because the learner retrieves reasons to reject the distractors — and that
the benefit depends on the alternatives being **competitive**. This mode
makes that process explicit rather than hoping for it. On an exam whose
restatement and cloze sections are largely won by eliminating three
plausible options, it is also the closest thing to the actual exam skill.

**Cost.** Moderate on the UI (multi-select with three targets, all the
`radiogroup` semantics in §8.7 of the design system replaced by something
else), and the feedback block has to say something per option.

**Content it needs that does not exist.** This is the catch: it needs a
one-line reason per distractor — three per question, **216 short Turkish
notes**. That is a real authoring job. But it is the *cheapest way to
triple the teaching value of the existing 72 items*, and for a pool this
small that trade is better than writing 216 new questions. Worth putting
to the content agents as a question before committing.

### 8.5 Dersten önce — a deliberate pretest

**What the learner does.** Opening a lesson they have never read starts
with two of that lesson's `check` questions, framed as *"bunları
bilmiyorsan sorun değil — ders tam da bunun için"*.

**What it is for.** The pretesting effect again (§8.1), but applied where
the app already has the machinery: `check` blocks exist, are already
filled from the lesson's category, and already never gate progress. Today
they sit mid-lesson, where they function as confirmation. Moved to the
front, the same content does a different and better-evidenced job — and it
gives the reader a reason to care about the next screen.

**Cost.** Very small — a rendering decision in `js/education.js` about
where a `check` may appear, plus a Turkish framing string. It touches the
block schema not at all.

**Content it needs.** None, though lessons whose checks are currently
written as recaps would read oddly at the front, so the content side
should be asked.

### 8.6 What I looked for and did not find

Two things I expected to recommend and will not:

**Adaptive difficulty.** Every serious bank has it. With four questions
per category there is nothing to adapt between — the "harder" question
does not exist. It becomes a real option at roughly 15–20 items per
category and not before.

**A spaced-repetition scheduler.** The evidence is as strong as anything
in this document (§2.1). The blocker is the same: a scheduler with 72
cards and no way to generate more will have every item due at once within
a fortnight, and the learner will be reviewing sentences they have
memorised. What the app should do *now* is cheap and unglamorous — record
when each question was last seen, so that when there is a pool worth
scheduling the history is already there. That is one field.

---

## 9 · What I would build for v1

Ordered by value per unit of work. Nothing here needs new content, a
schema change, a dependency, or a server. The whole list is about a week.

**1 · Stop re-asking what the learner already knows.** *(half a day)*
`buildQuizSession` currently calls `shuffle(pool).slice(0, n)` and knows
nothing about history. Weight the draw: unseen items first, then items
answered wrong, then the rest. This is a change to one pure function in
`js/quiz-engine.js` with 29 existing unit tests around it, and it makes
every existing mode better without adding a mode. It is also the single
fix for the exhaustion problem in §1.

**2 · Record when each question was last seen.** *(an hour)* One field
alongside the `{id, topicId, correct}` already stored per attempt. It buys
nothing today and it is the precondition for every scheduling idea in §10.
Do it now, while the history is small, rather than discovering later that
six months of data lacks the one column that mattered.

**3 · Yanlış defteri.** *(1–2 days)* §8.2. Mistakes-only practice, built
on data the app already has, named after a habit the users already have.
This is the mode I would ship if I could only ship one.

**4 · Cevabı önce düşün.** *(half a day)* §8.1. An opt-in toggle that
hides the options until the learner has committed to a guess. Highest
value per line in the document; zero content cost.

**5 · Say that the mixed test is the better one.** *(hours)* Interleaving
is the mode with the cleanest classroom RCT behind it (§2.1) and the app
already has it, labelled as a convenience. One line of Turkish on the
Test tab turns a shuffle into a method.

**6 · Emin misin?** *(1–2 days, and the most likely to be cut)* §8.3.
Ship it only if the confidence control genuinely fits in one tap with no
layout movement. If it costs a second decision per question, it fails the
design system's own rule about the action performed hundreds of times a
session, and the diagnostic payoff is not worth breaking that.

**What v1 deliberately does not include:** any timer, any score other than
correct/total, and any number that goes up.

---

## 10 · What I would defer

| Deferred | Picked up when |
| --- | --- |
| **Timed section rehearsal** (§6.2) | multi-blank cloze content exists — one passage, ten blanks — and the section duration is confirmed from a real sample paper |
| **Full mock exam** (§6) | cloze *and* restatement content exist at exam scale, and there is a schema for a passage that owns an ordered list of blanks |
| **Neden yanlış? elimination mode** (§8.4) | the content side agrees to author ~216 one-line distractor explanations, or a subset for the highest-traffic categories |
| **Challenge code + shareable result** (§7) | the owner confirms the friends actually want to compare — this is a social feature, and asking four people is cheaper and more reliable than any research in this document |
| **Spaced-repetition scheduling** (§2.1, §8.6) | roughly 15–20 questions per category, i.e. ~300 items, up from 72 |
| **Adaptive difficulty** (§8.6) | same threshold, plus a per-item difficulty signal, which today would have to be inferred from aggregate accuracy the app does not have enough users to estimate |
| **Mastery levels, Khan-style** (§2.3) | ~8–10 questions per category, so a level can be earned, lost and re-earned without the learner meeting the same two items each time |
| **Flashcards** (§2.1) | vocabulary content exists — the README already has this deferred for the same reason |
| ~~**Deliberate pretest before a lesson** (§8.5)~~ | **Shipped 2026-09-04.** The question for the content side turned out not to arise: a `check` block carries no authored prose at all — it is `{"type": "check"}` and is filled from the lesson's category at render time — so there was no recap wording to read oddly at the front. |

The pattern is worth stating: **almost nothing here is blocked by the
constraints.** No build step, no backend and no dependencies cost this
document one recommendation. What blocks it is 72 questions. That is the
real bottleneck, and every hour spent on mode mechanics instead of content
is an hour spent decorating a pool that is too small to decorate.

---

## 11 · What I would refuse

**Streaks.** §4. The mechanic is excellent at the problem it was built for
and this app does not have that problem. The users have an exam date;
that is a stronger and healthier motivator than a number they must protect
daily. The specific failure I expect is not drama, it is drift: the
cheapest way to protect a streak in this app is a five-question test on
your best topic, which is the exact opposite of what the weak-spot data is
for. And the cost of getting it wrong is asymmetric — a learner who quits
after breaking a 40-day streak has been made worse off by the app than if
it had never counted.

**Points and XP.** The undermining literature is specifically about
performance- and completion-contingent rewards, with effects around
d = −0.28 to −0.40 on free-choice intrinsic motivation across 128
experiments (§4.1). A learner with identified regulation — studying
because passing matters to them — is exactly who has something to lose
here. Show competence instead: lessons read, categories improving,
questions seen. Those are facts about learning; points are a currency.

*The line this draws, since §2.3 recommends the opposite-looking thing:*
**a number that only goes up is a currency; a number that can go down is a
measurement.** Khan's mastery level drops when you answer two questions
wrong, which makes it a claim about what you currently know. XP never
drops, which makes it a record of attendance. Build the first kind; the
distinction is the whole of the disagreement.

**Leaderboards and leagues.** The one mechanic with a direct classroom
experiment against it: Hanus & Fox's 16-week study found lower intrinsic
motivation, satisfaction and empowerment in the gamified course, with a
leaderboard and badges as the manipulation (§4.1). Then add that this app
has **six users who know each other**. A leaderboard among six friends is
not anonymous social comparison, it is a permanent public ranking of your
friend group by English ability, three months before an exam that decides
whether each of them repeats a year. And because scores would arrive
through editable URL fragments (§7.2), it would be a ranking that anyone
can forge. There is no version of this I would build.

**Lives, hearts and survival mode.** It punishes attempting an item you
are unsure about, which is the behaviour the entire retrieval-practice
literature says to encourage — including the pretesting work showing that
*failed* retrieval attempts still improve later learning (§8.1). A mode
that ends the session on the third wrong answer teaches avoidance. Also,
in a 72-item pool, "how far can you get" is answered by "until I run out
of questions".

**Sprints, per-question countdowns and any speed score.** §5.2. The time
pressure meta-analysis (125 studies, 827 effect sizes) finds pressure buys
speed and costs accuracy; the test-anxiety meta-analysis (238 studies)
finds the *worry* component is the one most associated with poor
performance, and a ticking clock manufactures worry. Meanwhile the actual
exam gives roughly 1.5–2.25 minutes per item, most of it spent reading.
There is no exam skill here that a countdown on a 20-word paragraph
trains. If timing is ever added it is a **section budget**, opt-in and
switchable mid-session per WCAG 2.2.1, with elapsed time reported and
never scored.

**Matching, drag-to-pair and any minigame.** There is nothing in a cloze
paragraph to match against anything, so the mode would need content
invented purely to give the game something to chew — and the app would owe
it a non-dragging equivalent under WCAG 2.5.7 as well. This is decoration
wearing a pedagogy costume.

**Unlock progression / a locked path through topics.** Already refused
once by the owner, on the record: the story-card proposal with "gamified
chapter-unlock progression" was rejected in `docs/education-notes.md`
because it "read as a flashcard/gimmick, not real teaching". The Eğitim
index's free navigation — start anywhere, because someone after one rule
should not walk through five chapters — is a settled decision, and a game
mode is not a reason to reopen it.

**A mock exam assembled from the existing 72 questions.** §6.2. It would
produce a confident, precise, trustworthy-looking score for a paper that
does not exist. A wrong number that looks official is worse than no
number, and the learner has no way to know.

**Daily reminder notifications.** Also infeasible — scheduled push needs a
push service and a server to sign for it — but I would refuse it on merit
even if it were free. It is the delivery mechanism for exactly the guilt
loop §4.2 describes.

**Anything that reports another person's score as data.** Received results
arrive in an editable URL fragment and can never be verified (§7.2).
Render them as a message from a friend; never as a row, a rank or a stat.

---

## 12 · Open questions for the owner

1. **Do the friends actually want to compare scores?** Everything in §7 is
   built on an assumption. Four messages settles it, and the answer decides
   whether the challenge code is v1 work or never.
2. **Is the plan to grow the question pool, and by how much?** This is the
   question the whole document hangs on. Under ~150 questions, build the
   modes in §9 and nothing else. Over ~300, spaced scheduling and adaptive
   selection become the obvious next things and half of §10 unblocks.
3. **Is 216 one-line distractor explanations an acceptable content job?**
   (§8.4) It is the best value-for-effort content work available, but it is
   the content agents' time, and it competes directly with authoring the
   reading and restatement items the exam research says matter more.
4. **How long until the exam, per person?** The tutor-then-timed
   progression in §5.1 is a calendar recommendation. If the sitting is in
   four weeks the timed work matters much more and matters now; if it is in
   six months, accuracy first, and the timer can wait for real content.
5. **Should Profil show "seen 48 of 72 questions"?** It is honest
   competence feedback and it costs nothing, but it also tells the learner
   the pool is small, which may read as the app being thin. My instinct is
   to show it — an app that hides how much content it has is asking the
   learner to trust a number they can't check — but it is a tone decision,
   not a technical one.
6. **Would you accept a mode that makes the app feel slower?**
   Both §8.1 and §8.3 trade speed for retrieval quality. They are correct
   and they will feel worse in the first session. Someone has to decide
   that is acceptable before either is built, because the first reaction to
   both will be that the old way was nicer.

---

## Sources

Read as search-result summaries of abstracts and first-party help pages,
not as full texts — see §0. Where a claim depends on a number, that number
appeared in more than one summary.

**Retrieval practice, spacing, interleaving**
- [Roediger & Karpicke (2006). Test-Enhanced Learning. *Psychological Science* 17(3)](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01693.x)
- [Karpicke & Roediger (2008). The Critical Importance of Retrieval for Learning. *Science*](https://pubmed.ncbi.nlm.nih.gov/18276894/)
- [Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin* 132](https://www.semanticscholar.org/paper/634293f80f8e661dc259e4902bca99821bec3014)
- [Rohrer, Dedrick & Stershic (2015). Interleaved Practice Improves Mathematics Learning. *J. Educational Psychology* 107(3)](https://eric.ed.gov/?id=ED557355)
- [Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving Students' Learning With Effective Learning Techniques. *PSPI* 14(1)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)

**Multiple choice, distractors, pretesting, confidence**
- [Little, E. Bjork, R. Bjork & Angello (2012). Multiple-Choice Tests Exonerated, at Least of Some Charges (PDF)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf)
- [Sparck, E. Bjork & R. Bjork (2016). On the learning benefits of confidence-weighted testing. *Cognitive Research: Principles and Implications*](https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-016-0003-x)
- [Richland, Kornell & Kao (2009). The pretesting effect: do unsuccessful retrieval attempts enhance learning?](https://pubmed.ncbi.nlm.nih.gov/19751074/)

**Motivation and gamification**
- [Sailer & Homner (2020). The Gamification of Learning: A Meta-Analysis. *Educational Psychology Review* 32](https://eric.ed.gov/?id=EJ1245270)
- [Deci, Koestner & Ryan (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin* 125(6)](https://www.semanticscholar.org/paper/8ad9801baea65b40fbbe6fc56e34b2b7be47d0ba)
- [Hanus & Fox (2015). Assessing the effects of gamification in the classroom. *Computers & Education* 80](https://www.semanticscholar.org/paper/dff76a9862467d426113ec530f83942016ae3a97)
- [Hamari, Koivisto & Sarsa (2014). Does Gamification Work? A Literature Review of Empirical Studies (PDF)](http://creativegames.org.uk/modules/Gamification/Hamari_etal_Does_gamification_work-2014.pdf)
- [Rodrigues et al. (2022). Gamification suffers from the novelty effect but benefits from the familiarization effect](https://www.researchgate.net/publication/358614501_Gamification_suffers_from_the_novelty_effect_but_benefits_from_the_familiarization_effect_Findings_from_a_longitudinal_study)
- [Investigating the influence of gamification on motivation and learning outcomes in online language learning. *Frontiers in Psychology* (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1295709/full)
- [The Decision Lab — Streak Creep: When Gamified Engagement Mechanics Backfire](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification) *(commentary, not research)*
- [Keeping the Streak Alive: Motivation and Language Learning in Duolingo (University of Oulu, PDF)](https://oulurepo.oulu.fi/bitstream/handle/10024/54117/nbnfioulu-202502121605.pdf)

**Time pressure and test anxiety**
- [A meta-analysis of the effect of time pressure on human performance (125 studies, 827 effect sizes)](https://www.researchgate.net/publication/225280171_A_meta-analysis_of_the_effect_of_time_pressure_on_human_performance)
- [Should Intelligence Tests Be Speeded or Unspeeded? *Journal of Intelligence* 11(6), 2023](https://www.mdpi.com/2079-3200/11/6/120)
- [von der Embse, Jester, Roy & Post (2018). Test anxiety effects, predictors, and correlates: a 30-year meta-analytic review. *J. Affective Disorders* 227](https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683)
- [The efficacy of interventions for test-anxious university students: a meta-analysis of RCTs (2019)](https://pubmed.ncbi.nlm.nih.gov/30826687/)

**Product behaviour**
- [Quizlet Help Center — Studying on Quizlet](https://help.quizlet.com/hc/en-us/articles/360030841732-Studying-on-Quizlet)
- [Quizlet — Study modes](https://quizlet.com/gb/features/study-modes)
- [Khan Academy Help Center — What are Mastery Challenges in course mastery?](https://support.khanacademy.org/hc/en-us/articles/360037127892-What-are-Mastery-Challenges-in-course-mastery)
- [Brilliant — FAQ](https://brilliant.org/faq/)
- [UWorld tutor vs. timed mode, as summarised by prep guidance](https://residencyadvisor.com/resources/usmle-step1-prep/is-it-better-to-do-timed-or-tutor-mode-for-step-1-question-banks)

**Platform mechanics**
- [MDN — Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [W3C — Web Share API specification](https://w3c.github.io/web-share/)
- [URL length limits (IEInternals, Microsoft Learn)](https://learn.microsoft.com/en-us/archive/blogs/ieinternals/url-length-limits)
- [WCAG 2.2 — 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)
