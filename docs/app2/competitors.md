# What already exists, and where the gap actually is

2026-09-06. A teardown of the products App 2 would be launched into, and
an honest account of what is left over. `two-apps.md` §3 argued that the
competitor is ChatGPT rather than Duolingo. This document does not
restate that; it tests it, and it finds that §3 was looking at the wrong
half of the field. The threat App 2 has not named is not a chat box and
not an owl. It is a ten-year-old London company with two employees on
the masthead that already ships App 2's core mechanic, sells it for
$190 a year, and does not offer it in English.

**Evidence markers.** `WebFetch` and `curl` are blocked in this
environment, so nothing below was read at source. **[S]** = search
summary: a claim that came back in a search result's synthesis, which I
could not open to verify. **[?]** = unverified or contested; I am
reporting it because it matters, not because I trust it. **[≈]** = my
own reasoning, which you should argue with rather than cite. Every price
is dated; every one of them will be wrong within a year, and several
are localised per storefront, which is itself a finding.

---

## The answer, first

**1. The design App 2 is proposing already exists, is a decade old, and
is called a Brainmap.** Kwiziq has been shipping a per-grammar-point
mastery model — a placement test, a confidence score per point on a
scale from −100% to +100%, colour-coded green / yellow / red / grey, a
generated study plan, and periodic re-probing — since roughly 2015 [S].
That is the boundary map, with a different noun. §2 says this plainly
because the brief asked for it to be said plainly.

**2. And Kwiziq does not teach English.** French and Spanish only, ten
years in, with Italian, Portuguese and German described as "on the
cards" as long ago as 2017 and still not shipped [S]. **The slot App 2
wants is empty, in a design space that has been proven and then
deliberately not extended into the largest language market on earth.**
That is the single most encouraging fact in this document and the single
most alarming one, and §2.6 argues the reason is almost certainly
revenue per user, not product.

**3. So App 2 has two wedges against two different opponents, and its
plan currently states one.** Against ChatGPT the wedge is the
diagnostic, exactly as `two-apps.md` §3.3 says. Against Kwiziq — the
only incumbent whose mechanism is the same — the diagnostic is not a
wedge at all, because the diagnostic *is* Kwiziq. What is left there is
language coverage, price, and a claim Kwiziq's business model
structurally forbids: that you can finish.

**4. The plateau is real as a phenomenon and thin as a market.** The
"functional but unschooled" learner is documented — Richards named the
intermediate plateau for Cambridge in 2008, the heritage-speaker
literature describes this exact profile, and Duolingo publishes blog
posts about the plateau it cannot fix [S]. What I could not find is
anyone paying for a product aimed at it. §3 separates those two
findings, because the plan currently treats the first as evidence for
the second.

**5. Two of App 2's claimed differentiators do not survive contact.**
"Better explanations" is a credence good — correctness the buyer cannot
perceive before buying, and the 28-hour cold-solve debt buys nothing a
landing page can prove (§5.1). "The diagnostic" is the most-copied
artefact in this category: EF, Cambridge, Oxford, test-english.com and
Kwiziq all give one away as a lead magnet (§5.2). What survives is
narrower and better: **a taxonomy of contrasts plus a stated refusal to
assert more than the evidence supports** — which is a content property,
not a feature, and is exactly what `docs/agents/` has been building.

**6. The positioning sentence should name the learner, not the
mechanism.** §6. And it should never contain the words *personalised*,
*AI coach*, *study plan*, *master*, *fluent*, or a CEFR level, because
the incumbents own all six and two of them contradict the product.

---

## 0 · What I could and could not verify

I ran fourteen searches and read none of the underlying pages. That
constrains the document in three specific ways worth stating before the
findings.

**Prices are third-hand and inconsistent.** Kwiziq's premium tier came
back as *both* "$29.99/month, $74.99/three months, $189.99/year,
$299.99/two years" *and* "$16.25/month billed biennially up to
$38.99/month" from two different aggregators, both claiming 2026 [S].
Those are not reconcilable, and Kwiziq localises by region [S], so both
may be true of different storefronts. Where two sources disagree I have
printed both rather than picking. **Nothing in this document should be
used as a pricing input without someone opening the live page from the
storefront that matters.**

**Complaint evidence is aggregator-filtered, not primary.** The brief
asked for Reddit and forum voices; search returned almost none directly,
and the summaries that did come back were themselves synthesised from
review-farm blogposts, many of which are affiliate-monetised and
therefore biased toward "worth it". I have marked the user complaints
[S] uniformly and flagged where I think the aggregator is repeating a
marketing line. The one primary-ish signal I got was Trustpilot
aggregate scores, and those skew negative by construction.

**Market-size figures are worthless and I am including one anyway.**
Estimates for the 2026 English-language-learning market came back as
$10.7B, $13.0B, $20B, $24.0B and $68.4B [S] — a factor of six between
research houses, which tells you the category has no agreed boundary. I
cite the range in §3 only to make the point that anyone quoting a single
number at you has picked it.

---

## 1 · The teardown

Ordered by how directly each product competes for the specific learner:
an adult who already functions in English and wants the scaffolding
named. The last column is the only one that matters.

| Product | Unit of learning | Progress is | Money | Fails this learner by |
|---|---|---|---|---|
| Duolingo | An exercise inside a unit | Streak, XP, league, crown | Freemium sub; regional pricing | Assuming zero, then hiding the explanation |
| Busuu | A CEFR lesson | Level completion, certificate | $69.99/yr Premium | Selling a level label to someone who has one |
| Babbel | A dialogue with a grammar note | Course position | $107.64/yr, $299 lifetime | Being right and pitched at a beginner |
| LingQ | A word, coloured by status | Known-word count | ~$10/mo annual | Refusing to name anything |
| Anki | A card | Due count, retention | Free (iOS paid) [?] | Requiring you to already know what to make a card of |
| Elsa Speak | A phoneme in an utterance | Pronunciation score | $159.99/yr | Solving a different problem well |
| Speak | A phrase in a spoken turn | Curriculum position | $83.99/yr | Fluency practice for people who are already fluent |
| Grammarly | A flagged span in your text | Nothing — it is a tool | Free / $144/yr Pro | Correcting without ever teaching |
| Cambridge / BBC / test-english | A grammar topic, as reference | Nothing | Free | No model of *you* |
| Murphy, *English Grammar in Use* | A two-page unit | Units done | Book, or IAP per unit | Same 145 units for everybody |
| Gymglish | A daily 10-min lesson | Adaptive revision queue | From €14/mo | Optimised for the habit, not the gap |
| Kwiziq | A grammar point in a CEFR level | **Brainmap confidence, −100%…+100%** | ~$190/yr | **Does not exist for English** |
| Preply / italki / engVid | An hour, or a video | Whatever the teacher says | $3–40+/hr; engVid free | Cost, scheduling, or no persistence |
| ChatGPT | A question you thought to ask | Nothing persists | Free tier is enough | You must already suspect the gap |

### 1.1 Duolingo

**Who it is for:** someone starting at or near zero, in any of forty
languages, who needs a reason to come back tomorrow. **Unit:** an
exercise inside a unit inside a path. **Progress:** streak, XP, league
placement, crown level — four counters, none of which describe your
language. **Money:** freemium subscription — Super at $6.99/month in the
United States, and, decisively for App 2's audience, roughly $0.66/month
in Turkey and $0.93/month in India [S, Sep 2026]; Max at $29.99/month
[S]. At Q2 FY2026 it reported 58.7M daily actives, $298.5M quarterly
revenue and 12.7M paid subscribers [S] — about 22% of DAU paying, which
is a very good conversion rate and a useful benchmark to be honest with
yourself about not hitting.

**What it does badly for this learner:** it structurally cannot model
them. Its representation of a user is a position on a path, which
encodes "how far through our content are you" and not "what do you get
wrong". The learner who already says *I have gone* correctly is
misplaced by any placement test that asks whether they can produce it.

And then there is the thing Duolingo did to itself: **it removed Tips
and Notes** — the written grammar explanations — and replaced them with
an AI feature, "Explain My Answer", later made free for everyone [S].
The complaints are consistent and they are precisely this audience's
complaint: *"I frequently experienced that I did not understand why or
how my answer was wrong… the only way I knew that was to ask, or by
reading the relevant Tips and Notes"* [S]. Sentence discussions and
moderator comments went too [S].

That matters more than it looks. **The competitor with 58.7 million
daily users deleted the artefact App 2 is built out of, and its users
noticed and objected.** That is the best demand signal in this document
— and it is also a warning, because Duolingo deleted it deliberately,
having measured what it did to retention. [≈]

### 1.2 Busuu

**Who it is for:** an adult who wants a course with a shape. **Unit:** a
lesson inside a CEFR level, A1 through B2, curriculum built with
McGraw-Hill [S]. **Progress:** level completion, plus a downloadable
certificate per level for paying users [S]. **Money:** Premium
$9.99/month or $69.99/year; Premium Plus $13.99/month, about $6.66/month
annualised [S, Sep 2026].

Its signature is the **community correction loop** — you write, native
speakers correct you, you correct theirs. Reviews describe it as
genuinely valuable and genuinely unreliable: *"sometimes a correction
lands in minutes; sometimes it sits for a day, or you get a one-word
'good'"* [S].

**What it does badly for this learner:** it sells a level label. Busuu's
whole progress model is CEFR position, and the App 2 learner's problem is
not that they lack a level — most of them would test B2 and be told
nothing they did not know. The certificate is described even by
sympathetic reviewers as *"better for motivation than formal proof"* [S].
And its ceiling is B2, which is where this audience starts.

The community loop is worth stealing conceptually and cannot be: it
requires a two-sided marketplace, which is exactly the asset a solo
project cannot bootstrap.

### 1.3 Babbel

**Who it is for:** adults, explicitly — the "linguist-designed,
grammar-in-context" position [S]. **Unit:** a dialogue, with the grammar
rule stated before it is drilled — *"when a new structure appears,
Babbel stops and tells you the rule, with examples, before drilling
it"* [S]. **Progress:** position in a designed course. **Money:**
$15.25/month on three months, $8.97/month on twelve ($107.64/year), or
**$299 once for lifetime, all languages** [S, Sep 2026]; App Store
pricing differs again, and 50–60% discounts run near-continuously [S].

`two-apps.md` §3.2 put Babbel third and called it "beatable on audience
fit and unbeatable on production". Both halves hold up. **Babbel is the
product doing the closest thing to App 2's job today**, and it is doing
it for a learner who is starting a course rather than repairing one.

**What it does badly for this learner:** it is sequential. A course that
stops to explain each new structure is exactly wrong for someone whose
problem is distributed — they have eleven gaps scattered across material
they otherwise know, and Babbel's only way to find gap number seven is
to walk them through one to six.

The $299 lifetime is the number App 2's pricing has to survive. **A
learner comparing a finite English product against "all Babbel, all
languages, forever, $299, often discounted" is doing arithmetic App 2's
plan has not done.** [≈]

### 1.4 LingQ

**Who it is for:** the input-driven learner, the Krashen reader.
**Unit:** a word, coloured by status — blue new, yellow learning, white
known [S]. **Progress:** the known-word count, and reviewers say the
colour-coding is *"genuinely motivating… in a way that abstract
percentage scores don't"* [S]. **Money:** roughly $10/month on the
annual plan [S, Sep 2026].

**What it does badly for this learner:** it refuses on principle to do
the one thing they need. LingQ's philosophy is words over grammar —
*"if you want scripted lessons and heavy grammar explanations, you'll
hit limits fast"* [S]. For someone whose ear was built by input and
whose gaps were *caused* by input-only acquisition, prescribing more
input is prescribing the disease.

But note the mechanic, because it is the best-designed progress display
in this teardown and App 2 should study it: **a per-item state, shown as
colour, over a corpus the learner recognises.** That is the Brainmap
again, and the boundary map again, in a third costume.

### 1.5 Anki, and the English decks

**Who it is for:** the self-directed learner who has already diagnosed
themselves. **Unit:** a card. **Progress:** the due queue and retention
statistics. **Money:** free on desktop and Android, one-time on iOS [?].

The honest summary of the ecosystem: *"Anki works best for vocabulary,
short phrases, and sentence patterns you already understand from real
input. It is less effective as a stand-alone course for grammar"* [S].
The failure modes named are also familiar: cards too hard, decks too
big, and *"the learner trying to learn the language inside Anki instead
of using Anki to support real-world input"* [S].

**What it does badly for this learner — and this is the important
one:** Anki has no opinion. It will faithfully schedule whatever you
put in it, which requires you to already know what your gaps are. It is
the purest possible demonstration of the thing App 2 claims: **a
scheduling engine without a taxonomy cannot find the boundary you never
noticed.** Anki is the control group for the diagnostic hypothesis, and
it is free, which is why the hypothesis is worth testing.

### 1.6 Elsa Speak

**Who it is for:** a learner whose accent is the barrier. **Unit:** a
phoneme inside an utterance. **Progress:** a pronunciation score,
phoneme-level feedback on accent, fluency, rhythm and clarity [S].
**Money:** $159.99/year, or $59.99/quarter [S, Sep 2026] — the most
expensive per-year figure in this teardown outside tutoring.

**What it does badly for this learner:** nothing, really — it solves a
different problem, and solves it well. It is in this list to mark the
boundary of App 2's scope. Reviewers note the American-English
orientation is a limitation for other varieties [S], and that some users
find *"the app's emphasis on pronunciation at the expense of grammar and
vocabulary limiting"* [S].

**The lesson to take from Elsa is commercial, not pedagogical.** It
charges $160 a year for a narrow, measurable, single-axis product, and
gets away with it because the feedback is *visibly* something you could
not produce yourself. App 2's feedback is not visibly that. [≈]

### 1.7 Speak

**Who it is for:** the learner who wants to talk. **Unit:** a phrase,
learned in a video lesson, drilled to automaticity, then used in
conversation with an AI tutor — their "Speak Method" three-step loop
[S]. **Progress:** curriculum position plus conversational volume.
**Money:** $17.99/month or $83.99/year [S, Sep 2026]. Backed by the
OpenAI Startup Fund, ~$1B valuation after a $78M Series C in late 2024,
15M+ learners claimed, and named by Wirecutter in 2026 [S].

**What it does badly for this learner:** it targets the one skill this
audience already has. Someone who learned English from Discord and
series can talk. What they cannot do is write a sentence that survives a
professor, and Speak's loop does not touch that.

Speak is here as the category's answer to the question App 2 is also
answering — *what do you build now that the chat model is free?* — and
its answer is **wrap the model in a curriculum and sell the structure.**
That is, structurally, App 2's answer too. The difference is that Speak
sells structure around *speaking* and raised $78M to do it. [≈]

### 1.8 Grammarly

**Who it is for:** anyone writing English, natives included. **Unit:** a
flagged span in text you wrote. **Progress:** none — it is a tool, not a
course, and this is the important structural fact about it. **Money:**
Free tier with basic checks and 100 AI prompts a month; Pro at $144/year
annually, $30/month monthly; Enterprise [S, Sep 2026].

The ESL literature on it is careful: it *"provides indirect feedback by
drawing learners' attention to the language items which have to be
changed"* and can support learning *"when used alongside actual grammar
instruction"* — but it is *"not specifically designed as a teaching
tool"* [S].

**What it does badly for this learner:** it removes the error without
naming the boundary. A learner who writes *"I am working here since
2019"*, accepts Grammarly's fix to *"have been working"*, and closes the
tab has had the symptom treated and has not been told that *since*
selects a perfect. They will make it again tomorrow.

**And it is the closest thing in this teardown to a real threat App 2's
plan has not costed.** Grammarly touches this learner's actual output,
every day, for free, at the moment of the error — which is better
timing than any app can buy. The reason it is not fatal is that it is
optimised for the text, not the person: it has no persistent model of
your errors and no interest in acquiring one. If it ever ships "here are
the six rules you keep breaking", App 2's wedge closes overnight. That
is a real and unhedgeable risk and it belongs on the risk list. [≈]

### 1.9 The free reference tier: Cambridge, BBC, British Council, test-english

**Who it is for:** everyone, forever, at zero cost. Cambridge's *English
Grammar Today* covers 500+ topics with explanations and examples drawn
from the 2-billion-word Cambridge English Corpus, aimed explicitly at
B1–B2 [S]. British Council LearnEnglish carries a full free grammar
reference [S]. BBC Learning English is still active in 2026 across web,
YouTube, social and podcasts [S]. test-english.com gives free level
tests and topic tests — 15 multiple-choice items per test with feedback,
at A1, A2, B1, B1+ and B2 [S]. UsingEnglish lists 297 free grammar
quizzes across 37 topics [S].

**Unit:** a grammar topic, as reference. **Progress:** none. **Money:**
none, or institutional.

**What they do badly for this learner:** they have no model of *you*.
They are a library, and the App 2 learner's problem is not that the
library is closed — it is that they do not know which shelf to walk to.
Cambridge already publishes a better *must / have to* page than App 2
will write. [≈]

**The consequence for pricing is severe and should be stated in one
sentence: every explanation App 2 will ever write is already available
free, from a more authoritative source, in the same language.** The only
thing that is not free is the sentence that says *go and read this one*.

### 1.10 Murphy, and the app that is the book

*English Grammar in Use* is the world's best-selling grammar reference
for intermediate learners [S], and it is this audience's actual
incumbent — the book a Turkish or Brazilian learner is handed. The app
version ships a free Starter Pack of six units and sells the remaining
139 of 145 units by in-app purchase; it was pulled from Google Play in
October 2022 and survives on Microsoft Store and Amazon Appstore [S].
One user review claims individual lessons cost $20 [?] — that reads like
a bundle price misread, and I would not repeat it without checking.

**Unit:** a two-page unit — explanation left, exercises right.
**Progress:** units completed. **Money:** the book, or per-unit IAP.

**What it does badly for this learner:** the same 145 units, in the same
order, for everyone. Murphy is the thing the Brainmap was invented to
improve on, and it is the thing App 2 is also trying to improve on. Both
are answering Murphy. Only one of them has been doing it for ten years.

### 1.11 Gymglish

**Who it is for:** the adult professional who will not sustain a study
habit unaided. **Unit:** a 10–15 minute lesson, delivered daily by
email or app. **Progress:** an adaptive revision queue — *"new concepts
and areas to revise delivered at the perfect intervals"* — plus a level
assessment showing *"current strengths and weaknesses, past improvement
and future revision needs"* [S]. **Money:** from €14/month [S, Sep
2026]. Claims 8 million users [S, and treat that as marketing].

**What it does badly for this learner:** the unit is the *day*, not the
gap. Gymglish's genius is that the lesson arrives whether or not you
felt like studying, and its cost is that the content is scheduled by the
calendar rather than by your errors. It is also the product whose
retention mechanism App 2 has refused, executed better than a streak:
email delivery, no punishment, no counter.

**Worth noticing:** Gymglish already ships "strengths and weaknesses"
and "future revision needs" as a marketing bullet [S]. That phrasing is
not available to App 2 as a differentiator, because it is on a
competitor's features page.

### 1.12 Tutoring: Preply, italki, engVid

**Preply and italki** sell an hour of a person. Preply's tutors run from
$3 to $40+/hour and average $10–15; italki spans $4 to $60+, with
community tutors from about $5/hour and professional teachers from about
$10 [S, Sep 2026]. **Unit:** the lesson. **Progress:** whatever the
teacher tracks, which in practice is nothing durable. **Money:**
marketplace take rate.

**What they do badly for this learner:** an hour with a good teacher is
the single most effective intervention in this entire document, and
almost nobody buys twenty of them. The failure is economic and
logistical — scheduling, cost, and the embarrassment of paying someone
to watch you get *few / a few* wrong.

But note what a tutor does in the first fifteen minutes: **they
diagnose.** App 2's pitch is, precisely, the first fifteen minutes of a
good tutor, at software prices, repeatable. That is a better analogy for
the product than anything in the app tier, and §6 uses it.

**engVid** is the free video tier: 2,300+ lessons from nine teachers,
each with their own YouTube channel, plus a short quiz per video [S].
Business model was not visible in any result I got [?] — presumably ad
revenue on the individual channels. **What it does badly:** no
persistence, no model of the learner, and discovery by browsing a wall
of titles, which requires you to already know your gap. Same failure as
the reference tier, with a face attached.

### 1.13 ChatGPT, used as a tutor

**Who it is for:** anyone who thought of a question. **Unit:** the
question. **Progress:** none persists in any form the learner can see.
**Money:** free at the margin for this use.

This is `two-apps.md` §3.2's number one and it deserves the confirmation
and the correction I can give it.

**The confirmation.** Learners are, in fact, doing this at scale, for
exactly these tasks — grammar, vocabulary, exam prep, speaking practice
[S]. The 2025–26 applied-linguistics literature has moved from "can it"
to "what does over-reliance cost", which is what a settled behaviour
looks like [S].

**The correction, and it cuts against App 2 as much as for it.** One
study analysing ChatGPT's responses to grammar queries reported
*"a concerning lack of accuracy, with scores ranging from 0% to 80%, and
none achieving a perfect score"* [S]. §5.1 argues at length why this is
much less useful to App 2 than it looks: the learner cannot tell which
answer was in the failing band, does not check, and is not shopping for
a correctness guarantee.

**What it does badly for this learner** is exactly what §3.3 said and I
found nothing to weaken it: *you must bring it the question.* It has no
persistent model of your errors, it will not raise a boundary you have
never noticed, and — the part §3.3 undersells — it is agreeable. A
learner who says *"isn't 'such smooth' fine too?"* is at meaningful risk
of being told yes. For an audience defined by a good ear and no labels,
a confidently agreeable tutor is not a neutral tool; it is a machine for
fossilising the exact errors App 1's blind pass exists to catch. [≈]
