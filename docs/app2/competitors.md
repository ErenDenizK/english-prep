# What already exists, and where the gap actually is

2026-09-06. A teardown of the products App 2 would launch into, and an
honest account of what is left over. `two-apps.md` §3 argued that the
competitor is ChatGPT rather than Duolingo. This document does not
restate that; it tests it, and finds §3 was looking at the wrong half of
the field. The threat App 2 has not named is neither a chat box nor an
owl. It is a ten-year-old London company with two founders on the
masthead that already ships App 2's core mechanic, sells it for about
$190 a year, and does not offer it in English.

**Evidence markers.** `WebFetch` and `curl` are blocked here, so nothing
below was read at source. **[S]** = search summary, not verified at
source. **[?]** = unverified or contested; reported because it matters,
not because I trust it. **[≈]** = my own reasoning, to be argued with
rather than cited. Every price is dated, several are localised per
storefront, and all of them will be wrong within a year.

---

## The answer, first

**1. The design App 2 is proposing already exists, is a decade old, and
is called a Brainmap.** Kwiziq has shipped a per-grammar-point mastery
model — placement test, a confidence score per point from −100% to
+100%, colour-coded green / yellow / red / grey, a generated study plan,
periodic re-probing — since around 2015 [S]. That is the boundary map
with a different noun. §2 says so plainly, because the brief asked for
plainness.

**2. And Kwiziq does not teach English.** French and Spanish only, ten
years in, with Italian, Portuguese and German "on the cards" as far back
as 2017 and still unshipped [S]. **The slot App 2 wants is empty, inside
a design space that has been proven and then deliberately not extended
into the largest language market on earth.** That is the most
encouraging fact in this document and the most alarming one; §2.6 argues
the reason is revenue per user, not product.

**3. So App 2 has two wedges against two opponents, and its plan states
one.** Against ChatGPT the wedge is the diagnostic, as `two-apps.md`
§3.3 says. Against Kwiziq — the only incumbent whose mechanism is the
same — the diagnostic is not a wedge at all, because the diagnostic *is*
Kwiziq. What is left there is language coverage, price, and a claim
Kwiziq's business model structurally forbids: that you can finish.

**4. The plateau is real as a phenomenon and thin as a market.** Richards
named the intermediate plateau for Cambridge in 2008, the heritage-speaker
literature describes this exact profile, and Duolingo publishes blog
posts about the plateau it cannot fix [S]. What I could not find is
anyone paying for a product aimed at it. §3 keeps those apart, because
the plan currently treats the first as evidence for the second.

**5. Two claimed differentiators do not survive contact.** "Better
explanations" is a credence good — correctness the buyer cannot perceive
before buying, which the 28-hour cold-solve debt cannot make visible
(§5.1). "The diagnostic" is the most-copied artefact in the category:
EF, Cambridge, Oxford, test-english.com and Kwiziq all give one away as
a lead magnet (§5.2). What survives is narrower and better: **a taxonomy
of contrasts plus a stated refusal to assert more than the evidence
supports** — a content property, not a feature, and exactly what
`docs/agents/` has been building.

**6. The positioning sentence names the learner, not the mechanism**
(§6) — and must never contain *personalised*, *AI coach*, *study plan*,
*master*, *fluent*, or a CEFR level. Incumbents own all six, and two of
them contradict the product.

---

## 0 · What I could and could not verify

Fourteen searches, none of the underlying pages read.

**Prices are third-hand and internally inconsistent.** Kwiziq's premium
tier came back as *both* "$29.99/month, $74.99/three months,
$189.99/year, $299.99/two years" *and* "$16.25/month billed biennially
up to $38.99/month", both claimed for 2026 [S]. Those do not reconcile,
and Kwiziq localises by region [S]. Where sources disagree I print both.
**Nothing here is a pricing input until someone opens the live page on
the storefront that matters.**

**Complaint evidence is aggregator-filtered, not primary.** The brief
asked for Reddit and forum voices; search returned almost none directly.
What came back was synthesised from review blogs, many affiliate-
monetised and biased toward "worth it". The only near-primary signal was
Trustpilot aggregates, which skew negative by construction.

**Market-size figures are worthless and one appears anyway.** Estimates
for the 2026 English-learning market: $10.7B, $13.0B, $20B, $24.0B,
$68.4B [S] — a factor of six between research houses, which means the
category has no agreed boundary. §3 cites the range only to show that
anyone quoting you one number has picked it.

---

## 1 · The teardown

Ordered by how directly each competes for the specific learner: an adult
who already functions in English and wants the scaffolding named. The
last column is the only one that matters.

| Product | Unit of learning | Progress is | Money (Sep 2026) | Fails this learner by |
|---|---|---|---|---|
| Duolingo | An exercise in a unit | Streak, XP, league, crown | $6.99/mo US, ~$0.66 TR | Assuming zero, then deleting the explanation |
| Busuu | A CEFR lesson | Level done, certificate | $69.99/yr | Selling a level label to someone who has one |
| Babbel | A dialogue with a rule | Course position | $107.64/yr, $299 lifetime | Being right, and pitched at a beginner |
| LingQ | A word, coloured | Known-word count | ~$10/mo annual | Refusing on principle to name anything |
| Anki | A card | Due count, retention | Free (iOS paid) [?] | Requiring you to know what to make a card of |
| Elsa Speak | A phoneme | Pronunciation score | $159.99/yr | Solving a different problem, well |
| Speak | A spoken phrase | Curriculum position | $83.99/yr | Drilling the skill this audience has |
| Grammarly | A flagged span | Nothing — it is a tool | Free / $144/yr Pro | Fixing the symptom, never naming the rule |
| Cambridge / BBC / test-english | A grammar topic | Nothing | Free | No model of *you* |
| Murphy, *Grammar in Use* | A two-page unit | Units done | Book, or per-unit IAP | The same 145 units for everybody |
| Gymglish | A daily 10-min lesson | Adaptive revision queue | From €14/mo | Scheduling by calendar, not by error |
| **Kwiziq** | **A grammar point** | **Brainmap, −100%…+100%** | **~$190/yr** | **Not offered for English** |
| Preply / italki | An hour of a person | Whatever the teacher tracks | $3–40+/hr | Cost, scheduling, embarrassment |
| ChatGPT | A question you asked | Nothing persists | Free at the margin | You must already suspect the gap |

### 1.1 Duolingo

For someone starting near zero who needs a reason to return tomorrow.
Progress is streak, XP, league and crown — four counters, none of which
describe your language. Super is $6.99/month in the US and roughly
**$0.66/month in Turkey, $0.93/month in India** [S, Sep 2026]; Max is
$29.99/month [S]. Q2 FY2026: 58.7M daily actives, $298.5M quarterly
revenue, 12.7M paid subscribers [S] — about 22% of DAU paying, a
conversion rate worth being honest about not hitting. It cannot model
this learner at all: its representation of a user is a position on a
path, encoding *how far through our content are you* rather than *what
do you get wrong*.

Then the thing it did to itself. **Duolingo removed Tips and Notes — the
written grammar explanations — replacing them with an AI feature,
"Explain My Answer", later made free to all** [S]; sentence discussions
and moderator comments went too [S]. The complaint is precisely this
audience's: *"I frequently experienced that I did not understand why or
how my answer was wrong… the only way I knew that was by reading the
relevant Tips and Notes"* [S].

**The competitor with 58.7 million daily users deleted the artefact App
2 is built out of, and its users objected.** Best demand signal in this
document — and a warning, because the removal was deliberate and
presumably measured. [≈]

### 1.2 Busuu

A course with a shape: lessons inside CEFR levels A1–B2, built with
McGraw-Hill, progress shown as level completion plus a certificate [S].
Premium $9.99/month or $69.99/year [S, Sep 2026]. Its signature is the
**community correction loop** — you write, natives correct you, you
correct theirs — reported as valuable and unreliable: *"sometimes a
correction lands in minutes; sometimes it sits for a day, or you get a
one-word 'good'"* [S].

It sells a level label to someone who already has one; most of this
audience would test B2 and learn nothing, and B2 is Busuu's ceiling.
Even sympathetic reviewers call the certificate *"better for motivation
than formal proof"* [S]. The community loop is worth wanting and
impossible to copy: a two-sided marketplace is the one asset a solo
project cannot bootstrap.

### 1.3 Babbel

Adults, explicitly — "linguist-designed, grammar-in-context" [S]. The
unit is a dialogue with the rule stated first: *"when a new structure
appears, Babbel stops and tells you the rule, with examples, before
drilling it"* [S]. $8.97/month on twelve months ($107.64/year), or **$299
once for lifetime, all languages** [S, Sep 2026], with 50–60% discounts
running near-continuously [S].

`two-apps.md` §3.2 called it "beatable on audience fit and unbeatable on
production", and both halves hold. **Its failure is sequence:** this
learner has eleven gaps scattered through material they otherwise know,
and Babbel's only route to gap seven is to walk them through one to six.
The $299 lifetime is the number App 2's pricing must survive — a learner
comparing a finite English product against *all Babbel, all languages,
forever, $299, often discounted* is doing arithmetic the plan has not
done. [≈]

### 1.4 LingQ

The input-driven Krashen reader. The unit is a word coloured by status —
blue new, yellow learning, white known — and reviewers say the
colour-coding is *"genuinely motivating… in a way that abstract
percentage scores don't"* [S]. About $10/month annual [S, Sep 2026]. It
refuses on principle to do the one thing this learner needs: *"if you
want scripted lessons and heavy grammar explanations, you'll hit limits
fast"* [S]. For someone whose gaps were *caused* by input-only
acquisition, prescribing more input prescribes the disease.

Note the mechanic though: **a per-item state, shown as colour, across a
corpus the learner recognises.** That is the Brainmap and the boundary
map in a third costume, and the best-designed progress display here.

### 1.5 Anki, and the English decks

Free, and for the learner who has already diagnosed themselves. The
ecosystem's own summary: *"Anki works best for vocabulary, short
phrases, and sentence patterns you already understand from real input.
It is less effective as a stand-alone course for grammar"*, the named
failure being *"trying to learn the language inside Anki instead of
using Anki to support real-world input"* [S].

**Anki has no opinion.** It schedules whatever you put in, which
requires you to know your gaps already. It is the purest demonstration
of App 2's own claim — *a scheduling engine without a taxonomy cannot
find the boundary you never noticed* — and it is free, which is why the
claim is worth testing rather than assuming.

### 1.6 Elsa Speak, and Speak

Both target speech, and both mark the edge of App 2's scope. **Elsa**
scores pronunciation at phoneme level on accent, fluency, rhythm and
clarity, for $159.99/year [S, Sep 2026]; reviewers note the
American-English orientation as a limit and that some find *"the
emphasis on pronunciation at the expense of grammar and vocabulary
limiting"* [S]. **Speak** teaches phrases in short videos, drills them,
then runs them through an AI tutor, at $17.99/month or $83.99/year [S,
Sep 2026]; backed by the OpenAI Startup Fund at roughly $1B after a $78M
Series C in late 2024, 15M+ learners claimed, named by Wirecutter in
2026 [S]. Both drill the one skill this audience has: someone who
learned English from Discord can talk. What they cannot do is write a
sentence that survives a professor.

Two lessons. Elsa charges $160 a year for a narrow single-axis product
because its feedback is *visibly* something you could not produce
yourself, and App 2's is not visibly that. Speak answers App 2's own
question — *what do you build once the chat model is free?* — with
**wrap the model in a curriculum and sell the structure**, which is
structurally App 2's answer too, funded by $78M. [≈]

### 1.7 Grammarly

Anyone writing English, natives included. The unit is a flagged span in
text *you* wrote; progress is nothing, because it is a tool rather than
a course. Free tier, Pro at $144/year [S, Sep 2026]. The ESL literature
is careful: it *"provides indirect feedback by drawing learners'
attention to the language items which have to be changed"* and helps
*"when used alongside actual grammar instruction"*, but is *"not
specifically designed as a teaching tool"* [S]. It removes the error
without naming the boundary: a learner who writes *"I am working here
since 2019"*, accepts the fix to *"have been working"* and closes the
tab has had a symptom treated and has not been told that *since* selects
a perfect. They will do it again tomorrow.

**And it is the threat the plan has not costed.** Grammarly touches this
learner's real output, every day, free, at the moment of the error —
better timing than any app can buy. It is survivable only because it is
optimised for the text rather than the person: no persistent model of
your errors, no interest in one. **If it ever ships "here are the six
rules you keep breaking", App 2's wedge closes overnight.** [≈]

### 1.8 The free reference tier: Cambridge, BBC, British Council, test-english

Cambridge's *English Grammar Today* covers 500+ topics with examples
drawn from the 2-billion-word Cambridge English Corpus, aimed explicitly
at B1–B2 [S]. British Council LearnEnglish carries a full free grammar
reference [S]; BBC Learning English is still active in 2026 across web,
YouTube and podcasts [S]; test-english.com gives free level and topic
tests — 15 MCQs with feedback at A1 to B2 [S]; UsingEnglish lists 297
free quizzes across 37 topics [S]. Progress: none. Money: none. They
have no model of *you*: they are a library, and this learner's problem
is not that the library is shut but that they do not know which shelf to
walk to.

**The pricing consequence in one sentence: every explanation App 2 will
ever write is already available free, from a more authoritative source,
in the same language.** What is not free is the sentence that says *go
and read this one.*

### 1.9 Murphy, and the app that is the book

*English Grammar in Use* is the world's best-selling grammar reference
for intermediate learners [S] and this audience's actual incumbent — the
book a Turkish or Brazilian learner is handed. The app ships six free
units and sells the other 139 of 145 by in-app purchase; it was pulled
from Google Play in October 2022 and survives on Microsoft Store and
Amazon Appstore [S]. One review claims individual lessons cost $20 [?] —
that reads like a misread bundle price.

The same 145 units, in the same order, for everyone. **Murphy is the
thing the Brainmap was invented to improve on, and the thing App 2 is
also trying to improve on. Both are answering Murphy; one has been doing
it for ten years.**

### 1.10 Gymglish

A 10–15 minute lesson delivered daily by email or app, with an adaptive
revision queue — *"new concepts and areas to revise delivered at the
perfect intervals"* — and an assessment showing *"current strengths and
weaknesses, past improvement and future revision needs"* [S]. From
€14/month [S, Sep 2026]; 8 million users claimed [S, treat as
marketing].

Its unit is the *day*, not the gap: content scheduled by calendar rather
than by error. It is also the product that solved App 2's retention
problem without a streak — email delivery, no punishment, no counter.
**And note that "strengths and weaknesses" and "future revision needs"
are already a competitor's feature bullet**, so that phrasing is not
available as a differentiator.

### 1.11 Tutoring: Preply, italki, engVid

Preply and italki sell an hour of a person: Preply $3 to $40+/hour
averaging $10–15; italki $4 to $60+, community tutors from ~$5/hour [S,
Sep 2026]. Progress is whatever the teacher tracks, which is durably
nothing. An hour with a good teacher is the most effective intervention
in this document and almost nobody buys twenty of them — the failure is
cost, scheduling, and the mild embarrassment of paying someone to watch
you get *few / a few* wrong. But notice what a tutor does in the first
fifteen minutes: **they diagnose.** App 2's pitch is the first fifteen
minutes of a good tutor, at software prices, repeatable — a better
analogy for the product than anything in the app tier, and §6 uses it.

**engVid** is the free video tier: 2,300+ lessons from nine teachers
with their own YouTube channels, plus a quiz per video [S]; the business
model was not visible in any result [?]. No persistence, no model of the
learner, and discovery by browsing a wall of titles — which again
requires you to already know your gap.

### 1.12 ChatGPT, used as a tutor

**The confirmation.** Learners are doing this at scale for grammar,
vocabulary, exam prep and speaking practice [S], and the 2025–26
applied-linguistics literature has moved from *can it* to *what does
over-reliance cost*, which is what a settled behaviour looks like [S].

**The correction, which cuts both ways.** One study of ChatGPT's
responses to grammar queries reported *"a concerning lack of accuracy,
with scores ranging from 0% to 80%, and none achieving a perfect
score"* [S]. §5.1 argues why this helps App 2 far less than it appears.

**What it does badly** is what §3.3 said and I found nothing to weaken
it: you must bring it the question, and it will never raise a boundary
you have not noticed. The part §3.3 undersells is that **it is
agreeable.** A learner who asks *"isn't 'such smooth' fine too?"* is at
real risk of being told yes. For an audience defined by a good ear and
no labels, a confidently agreeable tutor is not neutral — it is a
machine for fossilising the exact errors App 1's blind pass exists to
catch. [≈]

## 2 · Kwiziq, and whether App 2 is a reinvention of it

### 2.1 What it actually is

A London company founded by Gareth Davies (CEO) and Simon Potter (CTO),
self-funded until 2015 and having raised about $313K in one round since
[S]. Two names, one small raise, ten years of operation — roughly the
shape this project could reach, which is part of why it is worth
studying.

You take a **placement test**, grammar-only, mapped to CEFR A1–C1 with
priority given to intermediate content [S]. "Kwizbot" then *"starts to
build up a picture of what you know, don't know or may have
mislearned"* [S] and generates a **StudyPlan**. You take short quizzes;
after each one the bot decides whether to keep the current topics or
pick new ones, and *"can occasionally bring back lessons so that you
don't forget things you learned earlier"* [S].

The state it maintains is the **Brainmap**: *"a very smart, detailed and
ever-changing map made just for you… divided into grammatical areas
within each CEFR level"*, with a **confidence score per point from
−100% to +100%** rendered as colour — *"green for what you know,
white/yellow for what you don't yet know, red for those pesky mistakes
you keep making, grey where we have not yet tested your knowledge"* [S].
The interactive Brainmap is premium [S]. The French course covers *"all
500 French grammar topics organised by level and area"* [S].

### 2.2 The comparison, laid out honestly

| | Kwiziq | App 2 as planned |
|---|---|---|
| Entry | Grammar-only placement test | The diagnostic, ~20 items |
| Unit | A grammar point inside a CEFR level | A boundary — a pair the ear conflates |
| Learner state | Confidence per point, −100%…+100%, colour-coded | Open / closed per boundary |
| Untested state | Grey — "we have not tested this yet" | The `storage.js` bound: no weakness on thin evidence |
| Teaching | A lesson per point, native-authored | A lesson per boundary, contrast-shaped |
| Re-testing | Kwizbot re-raises old topics | Re-probe, unannounced, different items |
| Scope | ~500 topics, grows | ~100 boundaries, claimed closable |
| Medium | English, for French/Spanish | English, for English |
| Price | ~$190/yr [S] | Annual + lifetime, priced against local Duolingo |

Rows one through five are the same product. The diagnostic is the same
instrument and the state model is the same state model — Kwiziq even
ships the honesty bound App 2 is proud of, as the colour grey.

### 2.3 So: is it a reinvention? Yes

**Say it plainly, because the brief asked for plainness: the boundary
map is the Brainmap.** Not similar in spirit, not convergent by
accident — the same mechanism, probe → per-point state → targeted lesson
→ re-probe, shipped a decade earlier by a company still running on it.
Anyone claiming App 2's map as the innovation has not looked.

**Good news, first: it is prior art that the design teaches and that
people pay for.** `vision.md` §3 worried that a "get better at English"
app has no stopping rule and no honest retention story. Kwiziq answers
both empirically — the per-point state *is* a visible stopping rule, and
it has sustained a subscription for ten years without a streak. App 2 no
longer has to argue that this can work at all.

**Good news, second: Kwiziq's complaints are a free defect list** (§4.2).
Somebody else has already paid for the lesson that this design goes
dense, text-heavy and practice-poor if you let it.

**Bad news, exactly once: it removes "nobody has built this" from the
pitch**, and it should therefore be removed from the plan's own
self-description. `vision.md` §3 presents the boundary model as the
solution to a problem the category has not solved. The correct sentence
is narrower: *this design is proven, and it has never been pointed at
English.*

### 2.4 Where App 2 is genuinely different

**1. The unit is a pair, not a point** — real, but smaller than it
feels. Plenty of Kwiziq's 500 French topics are already contrastive
(*depuis* vs *il y a*) and the rest are forms. Call it a sharper
taxonomy, not a new mechanic; its value is downstream, because a
contrast-shaped taxonomy forces contrast-shaped items, which is what
makes a diagnostic discriminate. [≈]

**2. Finiteness.** Kwiziq's map is scoped by level and grows; App 2
claims a set you can close. **Kwiziq structurally cannot make that
claim, because it sells a $190/year subscription** — the same collision
`vision.md` names between the stopping rule and the recurring price,
resolved by Kwiziq in the direction App 2 has refused. This is the one
difference that is also a weapon.

**3. No levels.** Kwiziq's whole frame is CEFR. App 2's audience does
not describe itself with a level and is frequently mis-served by one.
Refusing CEFR is a real divergence, aimed precisely at *competence
without labels*.

Everything else — diagnostic, map, colour, re-probe, per-point lesson,
honest "not tested yet" — is Kwiziq's.

### 2.5 Where App 2 is strictly worse, and stays worse

Ten years of authored content, ~500 topics per language, a level test
tuned on a decade of responses, and a working subscription business.
Against that App 2 brings 241 items in the wrong language and a plan for
~100 boundaries at 6–8 minutes of one person's undelegable attention
each. **There is no version of this where App 2 out-produces Kwiziq.**
The only defensible positions are the ones content volume cannot buy:
the language it is not in, the price it cannot charge, and the claim it
cannot make.

### 2.6 The question worth more than the rest of this section

**Why has a company that built this machine, and had ten years, never
pointed it at English?**

Italian, Portuguese and German were on their own roadmap in 2017 and
none shipped [S], so the constraint is not ambition. Two hypotheses, and
the second should worry this project. [≈]

**A: content cost.** Each language is a decade of expert authoring.
Plausible, and it explains the unshipped Italian.

**B, and I think this is the real one: the customers are different
people.** Kwiziq's learners are largely Anglophone adults learning French
or Spanish as an enthusiasm, and can be charged $190 a year because that
is a hobby budget in a high-income currency. **The English-learning
market has the opposite economics** — the largest by headcount, among
the lowest by revenue per user, which is why Duolingo Super sells at
~$0.66/month in Turkey and ~$0.93 in India [S, Sep 2026]. Same product,
same content cost, one-twentieth the price ceiling.

If B holds, Kwiziq's absence from English is not an oversight App 2 is
clever to notice. **It is a market the incumbent priced and declined.**
`vision.md`'s pricing anchor is already right — per storefront, against
local Duolingo — but the honest expected revenue at that anchor is far
below what the same product earns in Kwiziq's market. **The strongest
argument against App 2 in this document is not competitive; it is that
the audience it chose is the one the proven business model avoids.**

Not fatal for a project whose stated ceiling is hundreds of users and
whose author says profit is not the point. Fatal for any plan that
quietly assumes otherwise.

---

## 3 · The plateau: is the segment real?

**The phenomenon is documented and has a name.** Jack C. Richards wrote
*Moving Beyond the Plateau: From Intermediate to Advanced Levels in
Language Learning* for Cambridge in 2008 [S], and the description
matches this project's audience statement uncomfortably closely:
learners at the plateau *"develop a functional but limited version of
the language — they can communicate, but they lack precision, range, and
naturalness"*, with *"persistent, fossilized errors… typical of
lower-level learners [that] reappear despite the amount of time and
effort devoted to correcting them"* [S]. Richards calls it *temporary
fossilization*, escapable with the right pedagogy [S].

The **heritage-speaker** literature that `two-apps.md` §2.1 cited
describes the same shape from the other side: *"advanced listening
skills, strong conversational instincts, deep cultural knowledge… what
they may lack are formal registers, academic vocabulary, or literacy
training"*, and *"heritage learners' instructional needs differ
fundamentally from second-language learners, shaped by home exposure
instead of classroom sequencing"* [S]. And Duolingo itself publishes on
the intermediate plateau [S] — the category leader documenting the
ceiling of its own method.

**What they currently do is leave.** The recurring advice pattern is
*outgrow Duolingo, then switch to input* — LingQ, native content, Anki,
a tutor if affordable, reference sites when a specific question arises.
There is a thin tier of products marketing to them directly: a
"Moreover — Advanced English" app, B2–C1 Substacks, twelve-week "break
the plateau" guides on Gumroad [S]. **The thinness is the finding**: a
cottage industry of one-person products, which is precisely what App 2
would be. What they say is missing — explanations of *why* an answer was
wrong, content that is not beginner-shaped, something that says where to
aim — maps onto App 2's three claims, which is either validation or my
own search terms coming back to me, and is honestly partly the latter.
[≈]

**The gap between "real segment" and "real market."** About 1.5 billion
people are learning English [S] and the 2026 market is worth between
$10.7B and $68.4B depending on the research house [S]. Neither number
says anything about *this* segment, and I found no figure sizing it and
no product reporting revenue from it. The asymmetry to carry forward:
`two-apps.md` §2.2 said this segment has no deadline, and the plateau
literature sharpens that, because a plateau is by definition a state of
*functioning adequately*. **The pain is real and low-grade; low-grade
pain converts badly; and the products serving it are one-person
products.** That is consistent with a real segment that will not support
a company — fine for this project, whose target is a few hundred people
who would be upset if it disappeared, and not something to write up as
an underserved market opportunity.

---

## 4 · What the incumbents' users complain about

### 4.1 Streaks, from people who wanted to learn

The pattern is consistent: users report *"maintaining their streak just
to pass challenges rather than focusing on actual learning"*, and *"if
they realize they're about to lose it at the end of the day, they'll
spend 5 minutes on an old mastered lesson just to save it"* [S]. On
motivation: *"because of Duolingo's emphasis on external motivation,
many users don't develop their intrinsic motivation… the streak becomes
more important than learning Spanish itself"*, with the claim that
*"streaks will undermine intrinsic motivation after a while"* [S]. And
the compulsion register: 1,139-day streaks kept *while wanting to quit*,
with *"not losing the streak the only thing pushing them to complete
daily lessons"* [S].

**This is the best-evidenced complaint here and App 2 should still be
careful with it.** These are the voices of people who kept a streak for
three years. The mechanic they complain about worked on them. Refusing
to build it is a values position, not a demand signal — and §5.4 argues
it has a price.

### 4.2 Kwiziq's complaints, which are App 2's future complaints

A defect forecast rather than a competitor's problems, because App 2's
design produces the same failure modes.

- **Dense and text-heavy:** *"lessons are clear… but they can be dense
  and there is a lot of text to read; if you don't like tests or
  learning by reading, this is not the course for you"* [S].
- **Not enough practice outside the quiz:** *"only some lessons provide
  short practice questions, which seems like a missed opportunity"* [S].
  App 1 has the identical structure — a lesson, then a `check` block
  drawn from the same category.
- **Weak on vocabulary**, with reviewers recommending pairing it with
  Memrise [S]. App 2's boundary model shares that blind spot by
  construction.
- **No speaking, limited advanced content, and price**, repeatedly [S].
- **Interface confusion:** one Trustpilot reviewer, *"so complicated and
  confusing… didn't find the lessons helpful at all"* [S].
- **Trust signals:** french.kwiziq.com sits at about **3.2/5 on
  Trustpilot**, the profile has never been claimed, and negative reviews
  have gone unanswered for twelve months [S], with at least one
  documented refund-not-received complaint against a stated 7-day
  guarantee [S].

**The last one is the cheapest lesson in this document.** A small
subscription product with an unclaimed review profile and an unanswered
refund complaint is one Sunday-morning email from a 1-star trend — the
exact Sunday message `vision.md` §4 already prices as the cost of
charging money.

### 4.3 Advanced learners on beginner-shaped products

Softer evidence, not to be overstated. The recurring shape is *"fine if
you want to refresh existing knowledge, but you cannot learn a new
language with it"*, and its mirror — apps that are *"not for advanced
learners"*, with most popular apps topping out around intermediate [S].
One aggregator puts it directly: apps for adults are *"built to maximise
activity rather than real-world progress"*, leaving learners unable to
*"review weak spots efficiently"* [S]. **The sharpest single data point
remains Duolingo's removal of Tips and Notes** (§1.1), because it is a
behaviour rather than an opinion.

---

## 5 · Where App 2's differentiators are weak

### 5.1 "Explanation quality" is a credence good

The plan already says explanation cannot be the headline. The quality
claim survives underneath it — in the cold-solve debt, the blind pass,
the "never assert what a competent teacher would dispute" rule — and
deserves a brutal accounting.

ChatGPT's measured 0–80% accuracy band on grammar queries [S] sounds
like an opening. **It is not, because the learner cannot tell which
answer fell in the failing band.** That is the definition of a credence
good: quality unverifiable before, and often after, purchase. A learner
who gets a wrong explanation from a chat box and a right one from App 2
experiences two confident explanations.

Twenty-eight hours of cold-solving buys something real and buys nothing
a landing page can prove. **The only way correctness becomes perceivable
is to make the *process* visible rather than the outcome** — and this
project has unusual material for that. [≈]

**Concrete recommendation: publish the error ledger.** Every reported
item, its verdict and the fix, dated, on a public page, fed by the
`report.js` path that already exists. Nobody in this category does it;
Kwiziq does not even answer its Trustpilot reviews. It converts an
invisible property into one a stranger can check.

### 5.2 The diagnostic is a hook, not a moat

**It is the most-copied artefact in the category.** Free level tests are
lead magnets: EF SET's 15-minute check and free certified test,
Cambridge's free 25-question placement test, the Oxford Online Placement
Test, test-english.com's tests at five levels, and Kwiziq's own [S]. A
learner has met four of these; "take our diagnostic" is not a new offer,
it is the thing they skip.

**And the premise that they do not know their weak spots is only half
true.** The L2 research supports it — the Dunning–Kruger pattern appears
in second-language self-assessment, with *"lower-comprehensibility
speakers overestimating their performance while upper-level speakers
underestimated it"* [S]. But note the direction: **the more proficient a
learner is, the better calibrated they are**, and App 2's audience sits
at the proficient end. They can probably name three of their eleven
boundaries unprompted.

**What survives is narrower and still real:** they know *some* gaps,
cannot rank them, cannot tell a genuine gap from a stylistic preference,
and do not know which are cheap to fix. The honest wedge is not *"you
don't know what you don't know"* but *"you know three of them; here are
the other eight, and the sentence that proves each."* The evidence is
the product, not the list.

**And the output is unpleasant.** It hands an adult who believes they
are good at English a list of things they get wrong. Duolingo sells a
green owl partly because the alternative is telling adults they are
wrong, which people pay to avoid. That is a copy and sequencing problem,
and it is real. [≈]

### 5.3 "Finite" reads as honest to a reader and as *small* to a buyer

`vision.md` proposes advertising that the corpus is finite, calling it
"a strange thing to advertise and the correct one". Half right.

To someone who has already rejected Duolingo, *"about a hundred
boundaries, and then you are done"* is the most trustworthy sentence in
the category. To someone scanning a store listing beside Babbel's
lifetime-all-languages-$299 and Duolingo's forty languages, it is the
smallest number on the shelf. **Those are two jobs and one page cannot
do both** [≈] — so finiteness is a positioning line, not a listing line,
and belongs in the second paragraph where it reads as integrity rather
than as thin content. The market is at least drifting that way: one-time
and lifetime plans grew from 6.4% to 10.3% of plan-type share between
2023 and 2025 [S], and subscription fatigue is documented enough that
regulators are legislating cancellation flows [S].

### 5.4 Refusing streaks costs discovery, not just retention

The refusal is right and it is not free. Store ranking runs on retention
and review volume, and App 2 will have deliberately weak retention —
three unexciting notifications, default-off — over a corpus the learner
is *encouraged* to finish. **A product designed to be completed and left
will look, to every ranking system that exists, like a product people
abandon.** [≈] `two-apps.md` §3.4 named the distribution gap; this
compounds it. Fine, provided the plan does not later reason backwards
from poor download numbers to a product problem that is actually a
strategy consequence.

### 5.5 English-medium does not remove localisation; it moves it to the listing

`vision.md` argues that teaching in English makes the localisation
problem *not arise*. For the teaching, yes. For being found, no. Kwiziq
markets in English because its customers are Anglophones; App 2's are
Turkish, Brazilian, Indonesian, Polish. App stores rank per storefront
and per language, and the query that finds this product is typed in the
learner's own language. **Localisation survives — in the listing, the
keywords and the first screenshot** — a much smaller job than
re-authoring 37,000 words and a much more commercially consequential
one. [≈] The correction to the v2.0 row: the store listing is not a
localisation nicety, it is the v1.0 acquisition channel.

### 5.6 What survives all of this

Two things, and they are enough for the stated ceiling. **The vacant
slot** — a proven design, ten years old, never pointed at English (§2.6),
with the warning that the incumbent may have declined the market rather
than missed it. And **the taxonomy plus the honesty rules** —
contrast-shaped units, evidence-bounded claims, and an item standard
that refuses distractors a competent teacher would accept: content
properties, expensive, slow, and not copyable by a better-funded team
without spending the same attention. Neither is "we explain better" and
neither is "we have a diagnostic".

---

## 6 · Positioning

### 6.1 The sentence

Everything above points one way: **name the learner, not the mechanism.**
The mechanism is Kwiziq's, the diagnostic is a commodity, the
explanation is free. What no competitor's homepage says out loud is the
audience's own self-description.

> **You already speak English. Nobody ever named the things your ear
> gets wrong. This does — and then it stops.**

Three clauses, three jobs. *You already speak English* disqualifies the
beginner and flatters nobody. *Nobody ever named* is the gap in the
learner's words rather than CEFR's. *And then it stops* is the finite
claim, placed where it reads as integrity — and it is the one sentence
here that a subscription business cannot copy (§2.4).

Two supporting lines, for where one sentence is not enough:

- **The tutor analogy** (§1.11): *the first fifteen minutes with a good
  teacher — the part where they work out what is actually wrong — done
  properly, and repeatable.* The clearest short explanation of the
  diagnostic that never uses the word.
- **The evidence line**, which is the real §5.2 wedge: *not "you don't
  know what you don't know" — "here are the eight you hadn't noticed,
  and the sentence that proves each one."*

### 6.2 The sentences it must not use

Each is owned, exhausted, or contradicts the product.

- **"Personalised AI language coach."** Kwiziq's own positioning [S] and
  now everyone's. Using it makes App 2 a Kwiziq clone in the one
  sentence a reader gives you.
- **"Your personalised study plan."** Kwiziq, Busuu and Gymglish all
  ship this exact phrase [S].
- **"Learn English the fun way / in just 5 minutes a day."** The
  category default. It promises the thing this product refused, and
  attracts the audience that leaves.
- **"Master English grammar."** Every grammar app, and wrong on the
  merits: this learner wants labels for competence they already have.
  `CLAUDE.md`'s own rule is *refine, not teach from zero*, and *master*
  violates it.
- **"Go from B2 to C1", or any CEFR promise.** A product that refuses
  levels cannot sell one (§2.4).
- **"Fluent in N months" / "speak with confidence."** Speak, Elsa and
  every tutoring marketplace own the second; the first is a promise this
  product cannot keep.
- **"Unlike Duolingo…"** The most-used comparison in the category. It
  installs the owl as the reference point and makes the product a
  reaction to it — and per `two-apps.md` §3.2, Duolingo is not the
  competitor anyway.

**One test for any future line: could Kwiziq's homepage print it
verbatim tomorrow?** If yes, it is category description, not
positioning.

---

## 7 · What I would check next, cheaply

1. **Take the Kwiziq French level test on the free tier and look at the
   real Brainmap.** An hour, no money. Every claim in §2 is second-hand;
   this makes it first-hand — including whether the grey "not tested
   yet" state is as honest in practice as the copy says.
2. **Check Kwiziq's live price from a Turkish IP.** §0 could not
   reconcile two price sets, and §2.6 turns on whether Kwiziq localises
   downward the way Duolingo does.
3. **Map App 1's 60 categories onto Kwiziq's French topic list.** If
   most have a counterpart, §2.4's "sharper taxonomy" claim is weaker
   than stated and should leave the pitch.
4. **Run the v0.1 diagnostic on fifteen strangers and count how many
   boundaries they name before seeing the result.** The direct test of
   §5.2, the cheapest experiment in the plan, and the thing
   `two-apps.md` §2.5 already asked for.

---

## Sources

All accessed 2026-09-06 via search summaries; none opened at source.

- Kwiziq: [Brainmaps blog](https://www.kwiziq.com/blog/brainmaps-how-our-a-i-language-coach-helps-you-learn-languages-faster/) · [Brainmap FAQ](https://www.kwiziq.com/faq/what-are-brainmaps) · [Tour](https://www.kwiziq.com/tour) · [About](https://www.kwiziq.com/about-us) · [2017 fact sheet](https://progress.lawlessspanish.com/files/spanish/press/kwiziq-factsheet-2017.pdf) · [All Language Resources review](https://www.alllanguageresources.com/kwiziq-review/) · [Actual Fluency](https://actualfluency.com/kwiziq-language-review/) · [Multilingual Mastery](https://multilingualmastery.com/kwiziq-review/) · [InfinLume pricing](https://www.infinlume.com/blog/kwiziq-pricing) · [Trustpilot](https://www.trustpilot.com/review/www.kwiziq.com) · [Tracxn profile](https://tracxn.com/d/companies/kwiziq/)
- Duolingo: [Q2 FY2026 8-K](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm) · [Business of Apps stats](https://www.businessofapps.com/data/duolingo-statistics/) · [Super price, India](https://geopriced.com/price/duolingo-super/india) · [cost comparison](https://languageappguide.com/pricing/duolingo-cost/) · [intermediate plateau](https://blog.duolingo.com/intermediate-plateau) · [Explain My Answer now free](https://blog.duolingo.com/explain-my-answer-now-free) · [Tips disappeared](https://duolingoguides.com/duolingo-tips-disappeared/) · [Duolingo Is Ruining Language Learning](https://mathiasbarra.substack.com/p/duolingo-is-ruining-language-learning)
- Other products: [Babbel cost](https://speakfluentreviews.com/babbel-cost/) · [Busuu review](https://languageappguide.com/app-reviews/busuu-review/) · [LingQ review](https://lingtuitive.com/blog/lingq-review) · [ELSA review](https://e-student.org/elsa-speak-review/) · [Speak review](https://speakshark.com/blog/speak-app-review-2026) · [Grammarly pricing](https://www.eesel.ai/blog/grammarly-pricing) · [Gymglish review](https://www.langoly.com/gymglish-review/) · [Preply vs italki](https://www.italki.com/en/blog/italki-vs-preply) · [engVid](https://www.engvid.com/) · [English Grammar in Use](https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition)
- Free tier and tests: [Cambridge English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) · [British Council grammar](https://learnenglish.britishcouncil.org/free-resources/grammar) · [BBC Learning English](https://en.wikipedia.org/wiki/BBC_Learning_English) · [test-english.com](https://test-english.com/) · [EF SET](https://www.efset.org/) · [Oxford Placement Test](https://en.wikipedia.org/wiki/Oxford_Placement_Test)
- Research: [Richards, *Moving Beyond the Plateau* (PDF)](https://www.professorjackrichards.com/wp-content/uploads/moving-beyond-the-plateau.pdf) · [Understanding the Language Learning Plateau](https://www.teljournal.org/article_53188.html) · [Heritage speakers and the native language continuum](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8865415/) · [ACTFL heritage learners](https://www.actfl.org/educator-resources/resources/heritage-learners) · [Saito et al., Dunning–Kruger in L2 speech (PDF)](https://www.paveltrofimovich.ca/wp-content/uploads/2024/06/Saito_et_al_2020.pdf) · [ChatGPT and over-reliance in grammar learning](https://journals.bilpubgroup.com/index.php/fls/article/view/10519) · [CDA of ChatGPT's grammar responses](https://journal.privietlab.org/index.php/PSSJ/article/view/2088)
- Market: [subscription vs one-time models](https://www.airbridge.io/en/blog/subscription-vs-one-time-purchase-app) · [English language learning market size](https://www.globalgrowthinsights.com/market-reports/english-language-learning-market-102194)
