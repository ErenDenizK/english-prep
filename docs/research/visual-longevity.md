# Visual longevity

*How an interface this consistent stays worth looking at on day thirty —
without spending the consistency that makes it good.*

Written 2026-09-05, against `docs/design-system.md` as it stands at v0.32
(10 topics, 241 questions, 60 lessons).

The owner's question, in his words:

> "Uygulama çok güzel UI ve çok tutarlı, lakin çok vakit geçiren bir
> öğrenci için bu arayüzün sıkıcılaşmasını nasıl engelleyebiliriz?
> Görseli bozmak istemiyorum ya da bütünlüğe zarar vermek, ama uzun
> kullanımda alınan görsel zevki artırmanın ve canlı tutmanın yolu ne
> olabilir?"

**Scope.** What the learner *sees*, and how it stays worth looking at. A
separate arm is researching feature additions; where a lever here would
also be a feature, it is marked and handed over rather than argued.
Everything below is bound by the app's constraints: no build step, no
runtime dependency, no backend, no account, static hosting,
`localStorage` only, mobile-first from 320px, WCAG 2.2 AA, Turkish UI.

**Method, and its holes.** Two kinds of evidence are in here and they are
not the same kind. The colour and corpus numbers were **measured in this
repository** — I ran `tools/color.mjs` over candidate palettes and walked
`data/` — and can be re-run. The psychology is from the literature, and
this environment's egress proxy blocked Semantic Scholar, ACM DL,
Springer Link and the UXPA journal, so several papers reach me only
through search-index summaries. Every one of those is marked. §8 lists
what I could not check.

---

## 0 · The short version

The tension is real and it is sharper than "pretty versus consistent."
The same property produces both halves of the problem: **fluency**.
Consistency makes the app easy to process, ease of processing is
experienced as beauty, and ease of processing is also what stops a thing
being noticed. The pleasure and the fading are the same mechanism running
forward. Anything that buys freshness by making the interface less fluent
is spending the asset to pay the interest.

So the answer is not to vary the chrome. It is to notice that this app
already has two enormous reservoirs of legitimate variation — **the
content and the learner's own record** — and that it is currently drawing
on neither for anything the eye can see.

Two measurements make the case, and both are in this repository:

1. **All sixty lessons are the same shape.** Every one uses all seven
   block types; 21 distinct type-sequences exist across 60 lessons and
   the two commonest cover 40% of them. Every lesson opens
   `text > contrast` and closes on `decision`. The curriculum brief
   explicitly says "not a template" — and sixty lessons written by agents
   reading that brief made it one anyway.
2. **A per-tier accent is arithmetically feasible and a per-topic accent
   is not.** Holding the accent's solved lightness and chroma
   (`L 0.800 / C 0.125`), the sRGB gamut plus the hues already owned by
   `--c-ok` and `--c-no` leave **148 usable degrees** of hue. Ten topics
   would sit 15° apart, which is indistinguishable. Five tiers fit at a
   35° minimum, all in gamut, all clearing 1.4.11's 3:1 against all three
   surfaces by a margin of 7.28 or better.

Ranked by visual payoff per unit of risk to the system, the order is:
lesson shape, then richness earned from the record, then a tier accent,
then motion, then a single drawn mark per topic. Time-of-day tinting is
cheap and dangerous. A light theme is the largest job available and is
**not a freshness lever at all** — it is a preference, and it should be
built for daylight readability if it is built.

Refused, with reasons in §6: streaks, XP, badges, mascots, confetti,
skins, and cosmetic unlocks.

---

## 1 · The tension, stated properly

### 1.1 Consistency is not merely *correlated* with the pleasure — it is the mechanism

The processing-fluency account of aesthetic pleasure (Reber, Schwarz &
Winkielman, *PSPR* 8(4), 2004) says the pleasure a person takes in an
object tracks how fluently they process it, and that fluency is
hedonically marked — it produces a positive affective signal before any
judgement is made. Winkielman et al. found the facial-EMG signature of
that within the first three seconds of exposure, seconds before
participants reported anything.

The design system is, read from this angle, a fluency machine. Three
surfaces so elevation is legible at a glance. One accent so a screen has
one obvious next action. Seven type steps and a 4pt grid so nothing has
to be measured by eye. Twelve primitives so a control the learner has
never met is a control they have already met. `.shell__bar-inner` at a
fixed minimum height so the button does not move. Every one of those is a
decision to reduce processing cost, and the "çok güzel" in the owner's
question is, on this account, largely the *feeling of that cost being
low*.

The strongest available check on this is a CHI 2023 study (Preßler,
Schmid & Hurtienne) that manipulated fluency directly on city websites
and then partialled it out: **the aesthetics–usability correlation fell
from r ≈ .79 to r ≈ .34** once perceived fluency was controlled. Roughly
speaking, more than half of what people call beautiful in an interface is
what they call easy. *(Numbers from the search-index summary; the ACM DL
page is blocked here — verify before quoting.)*

That is the trap in the owner's question. The obvious way to make an
interface feel newer is to make it more *stimulating*, and every device
for doing so — more colour, more texture, more ornament, more motion —
raises processing cost. It pays for novelty out of the fluency account,
and the fluency account is where the "çok güzel" was.

### 1.2 And fluency is exactly what stops being noticed

Fluency has a second consequence, and it is the one the owner has run
into. A thing processed without effort is a thing not attended to. The
orienting response habituates: novel stimuli produce a burst of
attention that subsides after several repetitions once the stimulus
stops being informative. An interface that gets out of the way
successfully has, by construction, got out of the way.

So consistency delivers the pleasure and then withdraws the attention
that would notice it. This is not a design flaw that a better design
system would avoid. It is what a good one *does*.

### 1.3 Which means the honest framing is not "add variety"

It is: **hold arousal potential roughly constant while familiarity
rises**, and take the increment from somewhere that does not cost
fluency. §2 finds where; §3.1 says why that is the right shape of answer.

---

## 2 · Diagnosis before prescription: where the boredom actually is

Nobody gets bored of "the app." They get bored of a particular rectangle
they have looked at four hundred times. Before choosing a lever, count.

### 2.1 Exposures, by surface

Take a plausible day-thirty learner: opens the app twice a day for a
month, does one test per sitting (10 for a mixed test, 15 for a topic
test — `js/config.js`), reads a lesson every other sitting.

| Surface | Exposures in 30 days | Does its *content* change? |
| --- | --- | --- |
| Shell frame — header, nav, gutters | ~60 | no |
| **Eğitim index (the default route, `#egitim`)** | **~60** | **barely — only as progress ticks** |
| Question frame (`quiz.html`) | ~720 | **yes, completely, every time** |
| Feedback block | ~720 | two states, alternating |
| Results screen | ~60 | numerically only |
| Lesson reader | ~30 | yes — but only 60 lessons exist |
| Profil | ~5 | numerically only |

The instinct is to reach for the quiz screen, because it is seen
seven hundred times. That instinct is wrong. Berlyne's collative
variables are properties of the whole percept, and the percept on the
quiz screen is *mostly a paragraph of English the learner has never
read*, with four options they have never seen. The frame repeats; the
stimulus does not. And the frame is precisely the thing the
non-negotiables forbid moving — answering a question must never move the
button under the thumb.

The screens where **both** the frame and the content repeat are the
Eğitim index, the results screen and Profil. Of those, the Eğitim index
is the arrival screen. **It is the first thing seen on every one of sixty
arrivals and it is almost entirely static.** That is where the boredom
is.

### 2.2 The measurement that surprised me: sixty lessons, one shape

Walking `data/` (all 10 topic files, 60 lessons, 654 blocks):

| | |
| --- | --- |
| Lessons using **all seven** block types | **60 of 60** |
| Blocks per lesson | 10.9 average |
| Distinct type-sequences across 60 lessons | 21 |
| Coverage of the two commonest sequences | 24 of 60 (40%) |
| Lessons opening `text > contrast` | 60 of 60 |
| Lessons closing on `decision` | 60 of 60 |

The commonest sequence, met sixteen times:

```
text > contrast > forms > check > examples > pitfall > pitfall > pitfall > check > decision
```

`docs/agents/curriculum-author.md` prints almost exactly that under the
heading **"A shape that works"**, and immediately says:

> Not a template — a lesson that needs a different order should have one
> — but this is where the Tenses lessons settled, and it is a reasonable
> place to start.

Sixty lessons, written by separate sessions each reading that brief,
started there and stayed. The disclaimer did not survive contact with an
agent looking for a shape to follow.

This matters more than any colour token in this document. The block
vocabulary exists — CLAUDE.md says so — so that *presentation* decisions
belong to `js/education.js` and the content can say what it is. A
learner on their thirtieth lesson has scrolled the same eleven-block
rhythm thirty times. The sentences are new; the page is not. And unlike
the quiz screen, where the content genuinely carries the novelty, here
the content has been poured into a mould that flattens it.

The fix costs no CSS, no token and no schema change. It is a content
instruction. That is what puts it first in the ranking.

### 2.3 What the exposure counts are worth

I want to use the mere-exposure literature to say "the index goes stale
around day nineteen," and I am not going to, because the number will not
carry that. See §3.2: the fitted curve turns over at roughly 37
exposures, but it was fitted to brief laboratory exposures of simple
stimuli, not to an app screen someone arrives at with an intention. Use
it as an order of magnitude — **tens of exposures, not hundreds** — and
notice that on that scale every surface in the table above is well past
it inside a month. That is all it supports.

---

## 3 · What the literature actually says

### 3.1 Berlyne: the inverted U, and why it predicts *small structured* variation

Berlyne's new experimental aesthetics puts the **collative variables** —
novelty, complexity, uncertainty, incongruity, surprise — at the centre.
They are called collative because judging them requires *collating*: the
percept against memory of previous percepts, and the percept's parts
against each other. Their joint effect is arousal potential, and hedonic
value is an **inverted U** in arousal potential: too little and the thing
is dull, too much and it is unpleasant, with liking peaking in the
middle.

The mechanism Berlyne (1970) gives for boredom is a two-factor account
and it is the useful part: repeated exposure produces **positive
habituation** (comfort, growing immediately) and **tedium** (growing
later). Their sum over time is the inverted U in *familiarity*. So the
thing that decays is not the design; it is the design's novelty
component, and it decays on a schedule.

Two consequences follow directly, and they are the spine of this
document:

- **The fix is a small increment of collative variable per unit of
  exposure, not a large one.** The curve is inverted-U in *both*
  directions. A redesign that "freshens" the app by raising complexity
  overshoots on day one to solve a day-thirty problem.
- **Novelty is relative to what the perceiver has already collated.**
  Which means variation that *the learner's own history produces* is
  automatically calibrated: the more they have seen, the more there is to
  vary. This is not a coincidence — it is why §5.2 outranks every
  ornament in this document.

*(Berlyne's framework is uncontested as the historical frame; the
inverted-U's generality is contested — Frontiers in Human Neuroscience
2016, "Berlyne Revisited", argues hedonic tone is multifaceted rather
than one curve. I could read the Frontiers abstract; the Oxford Handbook
chapter on collative variables is behind a blocked domain.)*

### 3.2 Mere exposure, and where it turns

Zajonc's effect is one of the best-replicated in psychology — Bornstein's
1989 meta-analysis pooled **208 studies** (*Psychological Bulletin*
106(2), 265–289) and found repeated exposure reliably increases
preference, moderated by stimulus complexity, exposure duration and the
maximum number of presentations.

The part that answers the owner's question is the re-examination:
**Montoya, Horton et al. (2017)**, *Psychological Bulletin*, **268 curve
estimates from 81 articles**, which found a positive linear slope with a
**negative quadratic term** — the statistical signature of an inverted U.
The reported fit for liking is

```
y = 0.66131 + 0.00191x − 0.000026x²
```

I derived the vertex myself rather than trusting the summary's prose,
which garbled it: `dy/dx = 0` at `x = 0.00191 / (2 × 0.000026) ≈ 36.7`.
Liking rises to about thirty-seven exposures and declines after.
Inverted-U curves were found for **visual** stimuli specifically, and not
for auditory ones.

Caveats, stated because they bind: this is a meta-analytic fit over
laboratory paradigms with brief exposures of simple stimuli, and the
quantity being predicted is a liking rating, not "does this student want
to open the app." **I could not reach the paper** — Semantic Scholar,
ACM DL and Springer are all blocked from here — so the equation itself
rests on a search-index summary. Treat 37 as "tens", not as a threshold.

What survives the caveats is the shape, and the shape is the answer to
"is this real?" Yes: familiarity's contribution to liking is not
monotonic, it turns, and on a screen opened twice a day it turns inside
the first month.

### 3.3 The aesthetic–usability effect, and the limit that matters here

Kurosu & Kashimura (1995) had 252 participants rate 26 ATM layouts and
found apparent usability correlated with aesthetic appeal more strongly
than inherent usability did. Tractinsky replicated it in Hebrew with
tighter controls and got a *stronger* correlation, giving the field "what
is beautiful is usable."

The owner should know two things about it before it is used to justify
anything here.

**First, it is largely a fluency effect** (§1.1): controlling for
processing fluency cut the correlation from ≈.79 to ≈.34. It is not a
licence to decorate; it is a restatement that legible interfaces are
liked.

**Second, most of the evidence is about first impressions, which is the
opposite of this question — and the longitudinal evidence is weak.** A
7-week, 110-participant, 2×2×7 mixed-design lab experiment (*IJHCS* 165,
2022) crossed high/low visual aesthetics with high/low usability on a
coffee machine and found **no effect of visual aesthetics on perceived
usability at all** — not a decaying one, *nil from the first session*.
The authors' own explanation is that a coffee machine carries no social
signalling, unlike a phone.

Whatever else that study proves, it is a fair warning against reasoning
that "prettier is better" transfers to sustained use of a tool. This app
is closer to the coffee machine than to the phone: it is used alone, in
private, by someone with a deadline.

### 3.4 Novelty effects in educational technology: freshness is a loan

The novelty effect in edtech is well documented and its shape is
specific. In gamified learning systems, engagement climbs, then falls at
around **four weeks** as the mechanic becomes ordinary. Rodrigues et al.
(2022, *IJETHE*), tracking Brazilian STEM students across seven
intervals, found a **U** — the drop at about four weeks, then partial
recovery as familiarisation set in.

Two readings, and the second is the one to keep:

- Any freshness bought with a novel visual device is **borrowed against a
  four-week horizon**, which for a student whose exam is twelve weeks out
  is most of the study period. A "fresh look" is a loan, not an asset.
- The recovery half is a genuine result and cuts the other way:
  familiarity has its own value, and things that survive the trough get
  liked *for being familiar*. An app that keeps changing its face never
  reaches that.

This is the strongest single argument against the whole family of
"periodically refresh the visuals" answers.

### 3.5 Seductive details: in a *learning* app, ornament has a measured cost

This is the finding that decides the question for this app specifically,
and it is the one most often skipped.

**Seductive details** are interesting but instructionally irrelevant
additions — an arresting illustration, a vivid aside, a decorative
flourish beside the material. Harp & Mayer (1998) established the effect;
Rey's 2012 review and meta-analysis found significant negative effects on
both retention and transfer; Sundararajan & Adesope's 2020 meta-analysis
("Keep it Coherent", *Educational Psychology Review*) pooled **177 effect
sizes from 50 studies** and found a small but significant negative effect
on overall learning outcomes. A 2023 study found seductive details hamper
learning **even when they do not disrupt** the flow of the material.

*(Rey 2012 and the 2020 meta-analysis are cited from search-index
summaries; ScienceDirect and Springer are both blocked here. The
direction and rough magnitude are consistent across four independent
summaries, which is why I am willing to lean on the direction. Do not
quote the effect sizes without checking.)*

The consequence is blunt. In a consumer app, decoration is neutral-to-
positive: worst case it is ignored. **In a learning app, decoration
beside the material has a measured cost paid in the thing the app
exists for.** The literature also records moderators — grouping seductive
details rather than interspersing them reduces the harm — which is itself
a design instruction: whatever visual interest is added must be *outside*
the reading column, not beside the sentences.

This is why §5 puts every ornament-shaped lever below every
content-shaped one, and why §6 refuses confetti in terms of evidence
rather than taste.

### 3.6 Personalisation versus customisation

Different mechanisms, different evidence, very different risk to a solved
system.

- **Personalisation** — the app chooses, from what it knows. Zero
  interaction cost. It cannot break the design system, because the system
  still authors every state. Its failure mode is being wrong about the
  learner, and being wrong invisibly.
- **Customisation** — the learner chooses. The reported benefit is a
  *sense of ownership and control*, which is a real and reasonable thing
  to want. Its cost is interaction effort and, fatally for this app, a
  combinatorial explosion of states that `npm run color`, `npm run
  verify` and the WCAG-per-responsive-variation rule must each cover.

The honest state of the evidence on customisation's benefit is that it is
**thin and mostly practitioner-grade**. The searches returned UX blogs,
vendor marketing and a Northwestern figure ("13.3% increase in perceived
ownership, 4.28/7 → 5.21/7") that I could not trace to a paper and would
not cite. I found no controlled evidence that letting users recolour an
interface improves anything measurable over a month.

For this app the asymmetry is decisive. A solved palette is solved
*because* the number of states is small and each was measured. Every
learner-facing visual choice multiplies the state space the CI has to
prove. **Prefer personalisation the app derives from data it already has;
treat customisation as an expensive thing bought only where the learner
knows something the app cannot.**

(The two settings that exist — `thinkFirst`, and the remembered counts —
pass that test exactly: they encode a preference the app cannot infer.
`getChoice`/`setChoice` in `js/storage.js` is the right hook if a visual
preference is ever justified, and it rides the backup for free.)

### 3.7 Motion: what the evidence is actually about

The practitioner literature on microinteractions is enthusiastic and
mostly worthless as evidence — the searches returned "35% higher
likeability" and "up to 20% retention uplift" with no traceable source.
Ignore those.

What is real, and what it is about, is narrower than it looks. The
peer-reviewed work I could find on UI microinteraction animation
(*Displays*, 2026, on animations as modulators of emotion and time
perception) studies **waiting**: emotional valence and duration
estimation across a 10-second wait, on first exposure. NN/g's much-quoted
result — a progress animation reducing perceived wait — is the same
thing.

**This app has no waits.** It is static files on GitHub Pages with a
service worker, a ≤150 KB critical path and a topic JSON that is lazy and
never critical. The single best-evidenced benefit of interface motion
does not apply, because the problem it solves does not exist here.

What remains for motion is: (a) making a state change legible, which the
design system already spends motion on and already caps at 400ms; and (b)
character — unevidenced, and where the vestibular risk lives. WCAG **2.3.3
Animation from Interactions (AAA)** requires that interaction-triggered
motion be disable-able; `prefers-reduced-motion` is the mechanism, and
`css/style.css` already honours it correctly in two places, written as an
opt-in so the safe version is the fallback. That is better than most
production stylesheets and it should not be loosened to buy character.

---

## 4 · The position

The owner asked for intuition as well as research. Here is the view, and
it is a view rather than a survey.

**1. Do not spend the chrome.** The consistency is the product. Every
increment of visual interest bought from the frame is bought from
fluency, which is where the liking came from (§1.1), and in a learning
app it is also bought from comprehension (§3.5). The frame's job is to
disappear, and it is doing it.

**2. The variation is already in the building.** This app holds 241
questions, 60 lessons, ten topics across five tiers, and a per-learner
record of every attempt, every item, every lesson read. That is an
enormous reservoir of legitimate difference, and almost none of it
currently reaches the eye. The Eğitim index shows the same ten rows on
arrival sixty; every lesson is the same eleven-block rhythm; the accent
is the same amber on every screen of every topic. **The app is not
visually monotonous because it lacks decoration. It is monotonous because
it is not showing what it knows.**

**3. Where the chrome must vary, vary it along a dimension the data
already declares.** Not exceptions — a *dimension*. `tier` exists in
`data/manifest.json`, is already a display grouping, and has exactly five
values. A hue that varies with tier is a system with one more axis, and
`npm run color` can prove all five the same way it proves one. A hue that
varies because a designer wanted variety is an exception, and exceptions
are what a system is for preventing. This is the difference between
extending "one accent, one job" and breaking it, and §5.3 argues it
concretely.

**4. Interest earned from a learner's own record is the only kind that
gets *more* interesting over time.** Every other lever on the list decays
on the four-week schedule in §3.4 — it is at its most novel on the day it
ships and less so every day after. Data-earned richness runs the other
way: the sparse version is honest on day one and there is genuinely more
to draw on day thirty. It is the only lever whose curve points the right
direction, and that is why it is ranked where it is.

**5. Refuse the whole family whose novelty comes from ornament**, not
because it would be ugly, but because it is a loan against a four-week
horizon (§3.4), it has a measured cost in a learning context (§3.5), and
this project has already written down what it thinks of taxing an
arrival.

---

## 5 · The levers, ranked

Ranked by **visual payoff per unit of risk to the system**. "In-system"
asks the deciding question: can this be done by extending what
`docs/design-system.md` already says, or does it require an exception to
it?

| # | Lever | Payoff at day 30 | In-system? | Hours |
| --- | --- | --- | --- | --- |
| 1 | Lesson shape follows the material | high | yes — no code at all | 2 + content |
| 2 | Richness earned from the learner's record | high, and rising | yes | 10–16 |
| 3 | Accent per **tier** (not per topic) | medium-high | yes, as a new axis | 8–14 |
| 4 | Motion, tightly scoped | low-medium | yes | 3–5 |
| 5 | One drawn mark per topic | medium | borderline | 8–12 |
| 6 | Time or season | medium, and unpredictable | no — breaks fixed chrome colour | 4–6 |
| 7 | Light theme | **none for this question** | yes but total | 25–40 |
| 8 | Subtract, don't add | unknown until measured | yes | 2 |

Hours include this project's actual overhead: `npm run color` for any
token change, `npm run serve && npm run verify` (~430 checks, four
viewports) for anything touching a screen, a `docs/design-system.md`
amendment where a rule changes, `docs/components.html` where a primitive
changes, and a `CHANGELOG.md` entry.

---

### 5.1 Lesson shape follows the material — *first, and it costs no CSS*

**What it does at day thirty.** The learner's thirtieth lesson stops
being the thirtieth instance of one rhythm. The pages differ because the
grammar differs: a lesson about a two-way contrast opens on the contrast;
a lesson that is mostly a table of forms is mostly a table of forms; a
lesson whose whole content is three mistakes is three `pitfall` blocks
and a `decision`, with no `text` at all. This is the highest-variance
change available to the *reading* experience and it changes zero pixels
of the system.

**In-system?** More than in-system — it is the system being used as
designed. CLAUDE.md: "A lesson is a page of typed blocks... The types are
semantic, so `js/education.js` owns every decision about how they look."
The renderer is already prepared for any order. The brief already says a
lesson needing a different order should have one. Only the corpus
disagrees.

**What it touches.** `docs/agents/curriculum-author.md` — the "A shape
that works" section, which needs to stop printing a runnable answer.
Then content, per lesson, on the ordinary review loop.

**Cost.** ~2 hours for the brief. The content is the real cost and it is
incremental: nothing needs rewriting, but every lesson written or
repaired from here can be shaped by its material, and the twenty-four
lessons on the two commonest sequences are the obvious first candidates
for a shape pass.

**What would have to be true for it to be wrong.** That the uniform
rhythm is doing pedagogical work — that a predictable lesson structure
lowers load and helps the learner know where they are. This is a real
position (worked-example and coherence research both like predictable
structure) and it is why the recommendation is *shape follows the
material*, not *vary for variety*. If the eventual audit finds that
lessons diverge only where the grammar genuinely diverges, then the
current uniformity is evidence that the grammar genuinely doesn't — and
this lever is a mirage. The test is cheap: take four lessons whose
material is obviously unalike (`Time Expressions & Signal Words` against
`Perfect Aspects`), have an author shape each from the block vocabulary
without seeing the suggested order, and see whether four different pages
come back. If they come back identical, I am wrong.

---

### 5.2 Richness earned from the learner's record — *the only lever whose curve rises*

**What it does at day thirty.** The arrival screen — the sixty-exposure,
almost-static one from §2.1 — becomes a screen that could not have been
drawn on day one. Not a dashboard: a page with genuinely more on it
because there is genuinely more to say. Concretely, the material already
sitting unused in `js/storage.js`:

- `getHistory()` — every attempt with a timestamp. Thirty days of
  activity is a **shape**, and shapes are visual. A thin strip of marks,
  one per day, tall for a long session and short for a brief one, is a
  drawing that is different for every learner and different every week.
- `getTopicAccuracy(topicId)` — ten topics with real numbers. The topic
  rows on the index currently carry a count. They could carry a
  proportion, and ten proportions side by side is a picture.
- `getItemStats()` / `getMistakeBook()` — which items were wrong, and
  when they stopped being wrong. "You have not got this one wrong since
  the fourteenth" is a fact the app owns and never says.
- `getLastActivity()` — how the app can be different for someone
  returning after a week versus someone returning after an hour.

**The distinction that keeps this out of §6.** A record is descriptive; a
streak is prescriptive. A history strip with gaps in it says *this is
what happened*. A streak counter with gaps in it says *you failed*. The
same pixels, opposite acts. The rule to write into the design system if
this is built: **the app may draw what the learner did; it may never
score the learner for not doing it.** No target line, no "best week", no
number that can go down. Gaps render as absence, not as a break.

**In-system?** Yes, and it needs no new primitive. Stat exists. Row
exists. Progress exists. An SVG strip is built with `createElementNS` the
way `js/icons.js` already builds icons — no `innerHTML`, no dependency.
Under §1.5 the marks may not carry meaning by colour alone, so height and
position carry it and hue is at most a second channel. Under §7.1 the
strip is content inside the one card level, not a card inside a card.

**What it touches.** `js/home.js` (`renderTopicRow`, and the index
header), `js/education.js` (the progress summary that `renderWelcome`
replaces), `js/profile.js` (`renderStats`), possibly one new builder in
`js/dom.js`. No new colour token if the marks use `--c-text-3` /
`--c-accent` at existing values; one if a dedicated non-text indicator is
wanted, in which case `tools/palette.mjs` gains a row.

**Cost.** 10–16 hours, most of it in the sweep and in getting the empty
and near-empty states right — a history strip with two marks in it must
look deliberate, not broken.

**What would have to be true for it to be wrong.** Three things, any one
of which sinks it.

- If the learner reads the record as a score. Watch for the strip being
  described back to you as "my streak"; if the owner or a friend says
  that word about it unprompted, it has become the thing §6 refuses and
  it comes out.
- If it makes the arrival screen slower to act on. The index exists so a
  learner can start; if the first tappable thing moves below the fold at
  320px, the lever has cost more than it bought. The 320px audit decides
  this, not taste.
- If the data is too thin to be interesting. Ten topics and ~60 sessions
  is not much of a canvas. If the honest drawing is dull, the answer is
  that it is dull, not that it should be padded.

---

### 5.3 An accent per *tier* — measured, and the answer to the brief's question 2

The brief asked whether ten hues for ten topics breaks "one accent, one
job" or extends it. **Neither: it does not fit.** Here is the arithmetic,
run with this repository's own `tools/color.mjs`.

**Step 1 — how much hue is available.** Hold the accent's solved
coordinates, `L 0.800 / C 0.125`, and rotate H. Contrast against
`--c-surface-2` stays between **7.15 and 8.10** at every hue on the wheel
— every hue clears 1.4.11's 3:1 by more than double, which confirms the
design system's claim that equal lightness buys equal measured contrast.
Dark ink on the fill (`L 0.180 / C 0.030`, same hue) lands at **Lc 65–71**
everywhere, versus the amber's own 67. Contrast is not the constraint.

Three other things are:

| Constraint | Cost in degrees |
| --- | --- |
| sRGB gamut at `C 0.125` — outside it the browser clips and the shipped colour is not the designed one | removes ~130° (reds/pinks 0–45, blues/violets 235–305) |
| ≥25° clearance from `--c-ok` (H150) — a green accent reads as "correct" | removes 50° |
| ≥25° clearance from `--c-no` (H25) — likewise "wrong" | removes 50°, mostly already gone to gamut |
| ≥20° clearance from the amber accent itself (H72) | removes ~40° |

What is left is **148 degrees, in three arcs**: 92–125, 175–230,
305–359 (plus a 3° sliver at 50–52).

**Step 2 — how many hues fit in it.** Ten topics in 148° is 15° apart,
which at this lightness is not a difference anyone will name. **Per-topic
accent is not a design decision to make; it is arithmetically
unavailable.** Five tiers fit, with the amber kept as one of them:

| Tier | H | Value | vs `surface-0` | vs `surface-1` | vs `surface-2` | ink Lc |
| --- | --- | --- | --- | --- | --- | --- |
| `foundations` | 72 | `#EFB05C` *(the amber, unchanged)* | 9.96 | 8.91 | 7.52 | 67 |
| `core-grammar` | 110 | `#C3C55F` | 10.36 | 9.26 | 7.82 | 69 |
| `compound-structures` | 190 | `#3DD7CF` | 10.67 | 9.54 | 8.05 | 71 |
| `advanced` | 225 | `#51CEFA` | 10.44 | 9.33 | 7.88 | 69 |
| `vocabulary` | 330 | `#EBA0E4` | 9.64 | 8.62 | 7.28 | 65 |

All five in gamut. Minimum pairwise hue separation **35°**. Worst-case
contrast **7.28** against the lightest surface, versus a 3.0 requirement.
Every one is ≥40° from `--c-ok` and ≥47° from `--c-no`.

**Step 3 — and here is the part that decides whether it extends the rule
or breaks it.** There is a fourth constraint the numbers cannot see. The
accent-*text* token cannot be re-hued at constant chroma: solving
`--c-accent-text`'s Lc 75 requirement across the wheel needs chroma from
**0.065** (violet, effectively a grey tint) to **0.200** (green), because
the sRGB gamut narrows sharply at `L ≈ 0.87`. Five "equal" accent-text
tokens would not look equal.

So the proposal is **not** a second accent. It is:

> A tier hue is a **non-text identity mark**. It may tint a rule, a
> spine, a progress fill or the cloze `.blank`. It may never be a
> button fill, never be text, and never be the focus ring.

Under that rule, "one accent, one job" is **extended, not broken** —
because the accent's job (the one filled action per screen) is untouched
and still amber everywhere, and the focus ring, which is an
accessibility affordance and must be recognisable across the whole app,
never moves. What varies is the *highlight* role, which is a different
job, on a dimension the data already declares. And it lands on the quiz
screen: `.blank` is a 2px rule under every cloze gap, seen seven hundred
times a month, and it would be a different colour in a vocabulary topic
than in a tenses topic. That is exactly Berlyne's small structured
increment, applied to the highest-exposure surface in the app, at a
processing cost of nothing.

**In-system?** Yes, provided the rule above is written into
`docs/design-system.md` §1 as a numbered role alongside the accent, and
provided `tools/palette.mjs` gains all five so `npm run color` proves
them in CI. If they are added to the stylesheet without being added to
the palette tool, this lever has broken the single most important thing
about this design system and should be reverted.

**What it touches.** `tools/palette.mjs` (a `TIERS` block, same
`need: { ui: 3.0 }` shape); `css/style.css` tokens layer (a
`--c-topic` defaulting to `var(--c-accent)`, and `.blank` /
`.progress__fill` / a new row spine switched from `--c-accent` to
`--c-topic`); one `style.setProperty("--c-topic", …)` where the route
resolves a topic — `js/home.js`, `js/education.js`, `js/quiz.js`;
`js/tiers.js` gains the hue map; `docs/design-system.md` §1.4;
`docs/components.html`.

**Cost.** 8–14 hours, including the sweep at four viewports and a
forced-colors pass (in forced-colors the tint disappears entirely, which
is fine — it was never the only channel, because the tier label is
already printed in Turkish next to it).

**What would have to be true for it to be wrong.**

- If the tier is not a category the learner thinks in. The hue is
  wayfinding only if "I am in the vocabulary part" is a thought they
  have. If tiers are an authoring convenience the learner never notices,
  the hue is decoration with a spreadsheet behind it. **This is
  answerable tonight, for free: ask the owner and one friend to name the
  five groups on the home screen. If they cannot, drop this lever.**
- If the amber turns out to be the brand rather than a role. `theme-color`,
  `manifest.webmanifest` and the generated icons are all amber-and-near-
  black. If a cyan progress bar under an amber app icon reads as a
  different app, the identity argument beats the freshness one.
- If five hues at 35° prove indistinguishable on a real phone in daylight.
  Measure on the device, not the monitor — this is §11's standing
  instruction and it applies here.

---

### 5.4 Motion, within the no-layout-shift rule

**What it does at day thirty.** Little, honestly, and that is the finding.
The one place motion has real evidence is perceived waiting (§3.7) and
this app does not wait. What is left is a small amount of character in
places where nothing is under the thumb.

**What is available, and what is not.**

Available, because it moves nothing the learner is about to touch:

- **View transitions between routes.** The CSS `@view-transition` at-rule
  is already sanctioned by §5, needs no JavaScript and degrades to an
  instant swap. Arriving at a lesson from the index could feel like
  arriving *somewhere*. This is the single best motion available and it
  costs almost nothing.
- **The progress indicator advancing** after the learner has left the
  question — a transform on a fill that occupies reserved space.
- **The results screen assembling.** It is a terminus; nothing is pending
  under the thumb; the numbers can arrive in order. `.animate-in` already
  exists for exactly this and is already correctly written as a
  reduced-motion opt-in.

Not available, and not arguable:

- Anything on **answering a question**. §5 names it: "It is the action
  performed hundreds of times a session; feedback must appear, not
  perform." It is also the third-most-repeated event in the app, which
  makes it the worst possible place to put a performance — a 200ms
  flourish seen 720 times is 2.4 minutes of the learner's month spent
  watching an animation they stopped noticing in week one.
- Anything that animates height. Layout animation, forbidden.
- Anything that raises the flash rate or ignores `prefers-reduced-motion`.

**Cost.** 3–5 hours. `@view-transition` in `css/style.css`, the
reduced-motion pair, the sweep.

**What would have to be true for it to be wrong.** If a view transition
makes the app feel *slower* — which is the standard failure: 280ms of
transition on a route change the learner makes forty times a session is
perceptible drag, and the Doherty ceiling is about the whole interaction,
not one element. If the owner's own thumb finds the app less responsive
with it on, it is wrong regardless of how it looks.

---

### 5.5 Typography and illustration: one drawn mark, and where ornament creeps in

**The state of play.** Three subset faces, two weights of sans and one of
serif, and a language rule that is already doing real visual work — serif
means English, sans means Turkish, and it tells the learner what they are
looking at before they read. Fourteen icons to a numeric contract.
Neither is short of anything.

**What I would not do.** Add a display face. It costs payload against a
≤50 KB font budget, it costs the superfamily-harmony argument that
justified the pairing, and a fourth voice in a two-language interface is
the ornament creep the section title warns about. Likewise: no
illustrations beside prose, ever — that is the seductive-details finding
(§3.5) applied literally.

**The one thing I would do.** The **topic overview screen**
(`#egitim/konu/<id>`) is the natural home for a single large drawn mark.
It is a threshold screen, entered ten times rather than seven hundred; it
is the one screen in the app whose job is "you have arrived somewhere
specific"; and it has no reading column for a mark to sit beside. Ten
marks — one per topic — at 96–120px, drawn to §6's contract (24-unit
canvas scaled by whole multiples so the 2-unit stroke stays absolute), in
`--c-topic` if §5.3 ships, `aria-hidden` because the title is right
there.

That is where illustration earns its place: at a threshold, not in a
paragraph.

**Cost.** 8–12 hours, mostly drawing. Ten icons to a contract is a real
day's work, and `js/icons.js` grows by two-thirds, which is a maintenance
cost the §6 contract exists to survive.

**What would have to be true for it to be wrong.** If the topic overview
is a screen learners skip. Check the routes: if the ordinary path into a
lesson is index → lesson and the overview is only reached deliberately,
then ten drawings have been made for a screen nobody sees, and the effort
belongs in §5.2 instead.

---

### 5.6 Time and season: cheap, and dangerous for exactly that reason

**Measured.** I rotated the surface base hue away from `oklch(0.175 0.008
75)` and re-derived `surface-2` through the same Material elevation curve.
At H 30, 150, 250 and 300, and at chroma 0.008 / 0.014 / 0.020, **all
three text tokens keep their required Lc and WCAG values** in every
combination but one (H250 at C0.008, where `text-3` lands on Lc 60
exactly and rounds under). Contrast-wise, a warm evening ground and a
cool morning ground are free.

**Which is the problem.** The cheapest change on this list is also the one
that most changes what the app *is*. The warm near-black is not a
technical choice — §1.2 says the tiny 0.008 chroma exists so the neutrals
do not read cold beside the amber. Rotate the ground to H250 and the
amber is now a warm accent on a cool ground, which is a different app
with the same tokens.

Three concrete costs beyond the aesthetic one:

- **The browser chrome will not follow.** `<meta name="theme-color"
  content="#13100d">` is a single value; the status-bar tint would stop
  matching the page the moment the page drifted. `theme-color` accepts a
  `media` attribute, but only for media queries — not for "it is nine in
  the evening."
- **An installed app's splash cannot follow at all.** `background_color`
  and `theme_color` in `manifest.webmanifest` are fixed at install.
- **The generated icons and the social card are drawn against `#13100d`**
  (`tools/make-icons.mjs`). They would be permanently the wrong ground.

**And the benefit is unfalsifiable.** No learner will report that the app
felt fresher in October. There is no measurement to make.

**What would have to be true for it to be right** (inverting the usual
question, because this one starts out wrong): if the variation were tied
to something the learner can *name* — not the clock, which they cannot
see the app tracking, but something they did. Which is §5.2 again, better
argued.

---

### 5.7 A light theme: the biggest job here, and not an answer to this question

**Is it a freshness lever?** No. A theme is switched once, on the day it
appears, and never again — the learner picks the one their eyes prefer
and it becomes the app. Berlyne's curve is not restarted by a preference
someone sets and forgets; it is restarted, briefly, by the *day the
option appears*, which is a one-off worth a fortnight (§3.4) for
25–40 hours of work.

**But it may deserve building for a different reason**, and the design
system says so itself, at §11.5: NN/g's review of the Piepenbrock studies
found light mode won on visual acuity and proofreading, for young and
older adults alike, with the gap widening as type got smaller — and
participants performed worse while reporting no difference. This app is
for sustained reading of small text, sometimes in daylight. That is a
*legibility* argument, and it is a much better one than freshness.

On the numbers people quote for dark-mode preference: they are junk. The
searches returned "82% of smartphone users," "91–95% prefer dark" and
"71.5% daily usage" from marketing blogs with no traceable methodology.
The one credible figure I found is NN/g's roughly-thirds split — a third
always light, a third always dark, a third contextual — and if that is
right, dark-only is currently serving one third well and asking the other
two to cope.

**What it actually costs.** §11.5's "the token architecture makes it a
one-file change" is true of the *stylesheet* and misleading about the
work. The values would be new, not inverted — every one re-solved,
because APCA's dark-ground correction runs the other way on light and the
three text tiers would move apart rather than together. Then:

- `tools/palette.mjs` doubles: a second `SPEC`, both measured, both in CI.
- `css/style.css`: `color-scheme: light dark`, a
  `@media (prefers-color-scheme: light)` token block, and the
  `prefers-contrast` and `forced-colors` blocks re-derived for it.
- `--c-on-accent` and the whole §1.4 amber argument re-examined: amber is
  a dark-ink-on-fill colour *on a dark ground*; on a light one the filled
  button may need a different accent entirely.
- `<meta name="color-scheme">` and `<meta name="theme-color">` in three
  HTML files, the latter needing `media` variants.
- `manifest.webmanifest` — which cannot vary, so an installed app has one
  splash colour and it will be wrong for someone.
- `tools/make-icons.mjs` and the social card, both drawn on `#13100d`.
- The full sweep, twice: WCAG conformance is per responsive variation
  (§8), and a theme is a variation. That is 320/390/768/1280 × 2.

**What would have to be true for it to be wrong** (as a project, not as a
freshness lever): if the owner and his friends genuinely study at night,
on phones, in the dark, then the legibility argument is arguing about
someone who isn't there — and a light theme is 40 hours of re-solving a
palette that was already solved. **Ask before building.** This is a
question with five users and a group chat.

---

### 5.8 The anti-lever: consider subtracting

Every lever above adds. It is worth costing the opposite, because it is
two hours and it might be the answer.

`npm run audit` already measures each screen against §7 — height, rows,
filled buttons. Run it and read the results as a *density* report rather
than a conformance one. If the Eğitim index is fourteen rows tall at
320px, the problem on day thirty may not be that it is unvarying; it may
be that it is a wall, and a wall is tiring in a way that reads as boring.

Boredom and fatigue are different complaints that produce the same
sentence. §3 of this document assumes boredom. It is worth two hours to
check.

**Cost.** 2 hours: run `npm run audit`, read it against §7, write down
what is denser than the spec allows.

---

## 6 · Refusals, with reasons

Not on taste. On this project's stated positions and on the evidence.

**Streaks, XP, points, levels, leaderboards.** Already settled, and
settled well: `docs/research/practice-modes.md` §4 lays out Sailer &
Homner's meta-analysis (the cognitive effect is the robust one; the
motivational and behavioural effects are the unstable ones), Deci,
Koestner & Ryan's 128 experiments on reward undermining intrinsic
motivation, the SDT argument that streaks produce *introjected*
regulation, and Hanus & Fox's 16-week classroom study where the gamified
course produced less intrinsic motivation and a worse final exam. It also
names the failure mode that matters here: **a learner protects a streak
with the cheapest possible session**, which in this app is a five-question
test on their best topic, and the weak-category data — the most useful
thing the app collects — becomes a record of a metric being farmed. I
have nothing to add and nothing to overturn.

What I will add is the *visual* half, which that document did not cover.

**Confetti and celebration animations.** Three reasons, in order of
weight. (1) The design system forbids it structurally: motion is capped
at 400ms and confined to `transform` and `opacity`, §5 says answering "must
appear, not perform", and the results screen sits directly above the
action bar the learner is reaching for. (2) It is a performance-contingent
reward, which is the exact contingency Deci et al. measured at d = −0.28.
(3) It is a novelty asset on the four-week schedule (§3.4) — celebration
that fires every time stops being celebration by the second week and
becomes 400ms of delay before the score. There is also a plain
accessibility cost: a burst of particles is precisely what
`prefers-reduced-motion` exists for, and honouring the query would mean
half the users never see the thing that was supposed to make the app feel
alive.

**Mascots and characters.** This is the seductive-details finding (§3.5)
in its purest form: an interesting, instructionally irrelevant figure
placed next to material to be learned, with a measured negative effect on
retention and transfer across 177 effect sizes. It is also a permanent
tonal commitment — a character has a personality, and a personality has
opinions about being wrong, and an app for adults three months from a
consequential exam does not need a cartoon's opinion about a wrong
answer. And in a Turkish-language app, a character's voice is a register
decision no one has made.

**Skins, themes-as-collectibles, cosmetic unlocks.** Every learner-visible
variant multiplies the state space that `npm run color` and the
320/390/768/1280 sweep have to prove — and WCAG conformance is defined per
responsive variation, so this is not paperwork, it is the requirement.
Three skins is twelve sweeps. Worse, if the variants are *unlocked*, they
are completion-contingent rewards (d = −0.36) attached to a visual system
whose whole claim is that its values were solved rather than chosen. A
palette that a learner can swap for a worse one is not a solved palette.

**Badges and achievements.** Hanus & Fox's gamified condition was
specifically a leaderboard and badges, and it is the single most directly
relevant controlled study to "should I add this for five friends." Its
answer is no. Beyond that: a badge is a claim about the learner, awarded
by an app that knows only what happened in one browser, and this app has
been careful — in `renderBackupNudge`, in the empty state, in the whole
Profil screen — never to claim more about a learner than it can support.

**Notifications and returning nudges.** Out of scope for a visual
document, but named because it is the family the above belongs to, and
because `js/storage.js` and `js/education.js` both already say it in the
same words: *this project has no streaks, no notifications and nothing
that taxes an arrival*. A one-off dismissible line about backups is the
maximum this app charges a learner for showing up, and that line was
argued for on the grounds that it protects something the learner would
otherwise lose. Nothing in this document meets that bar.

**One clarification, because §5.2 sits close to this line.** A history
strip is not a streak. The test is whether the artefact can *fall*. A
streak, an XP total and a badge shelf all have a state that is worse than
the state before, and that difference is the mechanism. A drawing of what
happened has no such state: a week with three marks is not a failed week,
it is a week with three marks. If any version of §5.2 acquires a number
that can go down, a target the learner can miss, or a comparison to their
own past best, it has crossed into this section and belongs here.

---

## 7 · Three recommendations

### Tonight — free, and it is a question, not a change

**Ask two people to name the five groups on the home screen.** The tier
hue in §5.3 is the best-measured proposal in this document and it rests
entirely on `tier` being a category the learner thinks in. That is
unknown, and it is knowable in five minutes over a group chat. If the
answer is "what five groups", §5.3 drops out of the ranking and §5.2
absorbs its hours.

**And if you want a change tonight rather than a question:** edit the
"A shape that works" section of `docs/agents/curriculum-author.md` so it
stops shipping a runnable answer. Keep the block descriptions, delete the
worked sequence, and replace it with the two questions a shape has to
answer — *what does the learner have to be handed before the first
`check` makes sense, and what does this material end on?* That is one
edit, no code, no sweep, and it is the upstream cause of the single
largest uniformity in the app (§2.2). Sixty lessons will not change, but
the sixty-first will.

### A week — the arrival screen learns to draw what it knows

**§5.2, scoped to the Eğitim index.** Not Profil, not the results screen,
not a redesign. One screen: the one seen on every arrival and currently
nearly static.

Three things, in order:

1. Each topic row carries its accuracy as well as its count —
   `getTopicAccuracy(topicId)` already returns it. Ten proportions on one
   screen is a picture that is different for every learner and changes as
   they work.
2. A history strip above the list: one mark per day for the last thirty,
   height by session length, built with `createElementNS` the way the
   icons are. `--c-text-3` for the marks; no hue carrying meaning; gaps
   render as absence.
3. Both hidden until there is something to draw, replacing rather than
   sitting above the empty state — the pattern `renderWelcome` already
   establishes, and for the reason its comment already gives.

Then `npm run serve && npm run verify`, and the 320px check that the
first tappable row has not been pushed below the fold. 10–16 hours.

This is the recommendation I would actually make. It is the only lever
whose payoff grows with the exact thing the owner is worried about —
time spent in the app — and it needs no new token, no new primitive and
no exception to a single rule in the design system.

### A project — the tier accent, done properly

**§5.3, in the order that keeps it honest**, and only if tonight's
question came back yes.

1. `tools/palette.mjs` first. Add the five tier hues with
   `need: { ui: 3.0 }` and confirm `npm run color` passes and prints
   them. If the palette tool does not know about a colour, that colour
   is not part of this system.
2. `docs/design-system.md` §1.4 second — write the role down before
   writing the CSS: *a tier hue is a non-text identity mark; never a
   button fill, never text, never the focus ring.* A rule invented after
   the fact gets "fixed" by the next person to read the stylesheet.
3. `--c-topic` in the tokens layer, defaulting to `var(--c-accent)`, so
   every screen that does not set it is unchanged and the diff stays
   readable.
4. Switch `.blank` and `.progress__fill` from `--c-accent` to
   `--c-topic`. That is the whole visible change on the quiz screen, and
   it is the one the learner meets seven hundred times a month.
5. One `setProperty` at the three places a route resolves a topic, plus
   the tier map in `js/tiers.js`.
6. `docs/components.html`, the four-viewport sweep, a forced-colors pass,
   and a look on a real phone in daylight before it merges to `main`.

8–14 hours. It extends the design system along an axis the data already
has, it is provable in CI, and it puts a small, structured, zero-cost
difference on the highest-exposure surface in the app — which is exactly
what §3.1 says the answer should look like.

---

## 8 · What I could not verify

**Blocked outright by the egress proxy.** `semanticscholar.org`,
`dl.acm.org`, `link.springer.com`, `uxpajournal.org`. Every paper below
reaches me through a search-index summary rather than the source:

- **Montoya et al. 2017** — the 81 articles / 268 curve estimates, and
  the fitted equation `y = .66131 + .00191x − .000026x²`. I derived the
  vertex (≈36.7 exposures) from the quoted coefficients myself because
  the summary's own prose about where the curve peaks was internally
  inconsistent. If that equation is mis-transcribed by the summary, the
  number is wrong. The *shape* — positive slope, negative quadratic — is
  reported consistently across several independent summaries.
- **Preßler, Schmid & Hurtienne, CHI 2023** — the r ≈ .79 → .34 drop when
  fluency is partialled out. This is the most load-bearing number in §1
  and I could not open the paper. Check it before quoting it anywhere
  binding.
- **Sundararajan & Adesope 2020** (177 effect sizes, 50 studies) and
  **Rey 2012** on seductive details. Direction and rough magnitude agree
  across four independent summaries; the effect sizes themselves are
  unverified.
- **Bornstein 1989** — the 208-study figure and the *Psychological
  Bulletin* 106(2), 265–289 citation are consistent across several
  reference indexes, which is weak but not nothing.

**Weak or absent evidence, stated as such.**

- **Microinteractions.** The practitioner numbers ("35% higher
  likeability", "20% retention uplift") have no traceable source and are
  not used anywhere in this document. The peer-reviewed work I found is
  about *waiting*, which this app does not do.
- **Customisation's benefit.** I found no controlled study showing that
  letting users recolour an interface improves anything over a month.
  The "13.3% ownership increase" figure returned by search is untraceable
  and is not relied on.
- **Colour-coded wayfinding.** The dramatic figures in circulation ("95%
  memorisation accuracy", "95% faster navigation") come from signage
  vendors and are not credible. §5.3 rests on the measured contrast
  arithmetic, not on these.
- **Dark-mode preference statistics.** Mutually contradictory and mostly
  marketing. Only NN/g's roughly-thirds split is used.
- **Time-of-day and seasonal interface variation.** I found no evidence
  either way. §5.6 is measurement plus judgement, and is labelled as such.

**Measured in this repository, and re-runnable.** Everything in §2.2 and
§5.3 — the corpus block-type counts and sequences, the hue arcs, the
per-hue contrast and gamut tables, the accent-text chroma range, and the
ground-hue rotation in §5.6 — was computed with `tools/color.mjs` and by
walking `data/`. These are the claims in this document I would defend
without qualification.

**Not verified on a device.** Nothing here has been looked at on a real
phone. §11 of the design system already says this is where dark-mode
judgements have to be settled, and it applies to every colour proposal in
§5.3 and §5.6: five hues at 35° separation may be four hues and a
duplicate in daylight, and that is a fact about a screen in a hand, not
about a contrast formula.
