# Two apps

*Whether the split the owner drew on 2026-09-05 is the right one, what
the second app would actually have to be, and what it costs in evenings.*

Written 2026-09-05 against `bf4d1b8` (v0.38) — 10 topics, 241 questions,
60 lessons. **This document changes no code and no content.** It answers
`docs/business/brief.md`, which is the only statement of intent this
project has.

---

## The answer, first

**Yes to two apps.** The two products want different promises, different
loops and different content, and a toggle inside one shell would make
both worse — an exam app that keeps apologising for being general and a
general app that keeps apologising for being about one Turkish
university's paper.

**But the line is drawn in the wrong place.** The seam that matters is
not *Turkish → global*; it is **exam → no exam**, and it runs straight
through the corpus in a place the data can show you: 21 of 241 questions
reason about Turkish, and **51 of 60 lessons do**. The item bank travels.
The teaching does not — and it does not travel because the teaching *is*
the Turkish contrast, which is the best thing about this app.

**So localisation is not the second step. It is the third, and it is
gated on a person, not on a budget.** "Properly localised for foreign
markets" is not a translation job — 37,000 words of lesson prose whose
whole method is *"Türkçede 'az' hem few hem little demektir"* cannot be
translated into Spanish, only re-argued by somebody whose Spanish
intuition is as good as your Turkish one. App 2 should ship in Turkish,
to the same learner, doing a different job; a second language is a second
co-author, and should be treated as a hiring decision rather than a
localisation ticket.

---

## 0 · What I could and could not verify

Same rule as the rest of `docs/research/`, and the same rule the brief
sets for this directory.

- **Measured, in this repository, by me:** every count in §1 and §5 —
  word counts, the Turkish-reference counts, the corpus totals, the
  commit history. Reproducible from `data/` and `git log`.
- **Read, in this repository:** `docs/research/content-pipeline.md`'s
  review arithmetic (§7.1–7.2), `docs/exam-spec.md`, `docs/roadmap.md`,
  `docs/research/architecture-and-scale.md`, `docs/research/progression.md`.
  These are the strongest evidence in the document because they were
  produced against primary material — two real sample papers, and
  measurements of the running app.
- **Search summaries only, never opened:** everything in §3 and §7 with a
  market or a regulator behind it. `WebFetch` is blocked in this
  environment. **I did not read a single one of those pages.** Every such
  claim is marked *(search summary)* at the point of use, and none of
  them decides a recommendation on its own.
- **Explicitly out of my competence:** Turkish tax law and Apple's review
  policy. §7 exists to give an accountant and a developer-account holder
  something specific to check, not to be relied on.

I have quoted no market size. The figures in the search index for
"language learning market" disagree with each other by an order of
magnitude and none of them would change a single decision below.

---

## 1 · Where the seam actually falls

The brief assumes the two apps share "the app" and differ in market. The
corpus says something more useful and more awkward: the two apps share
the **items** and share almost nothing of the **teaching**.

### 1.1 The measurement

Across `data/*/*.json`:

| | Count | Mentions Turkish |
| --- | --- | --- |
| Questions | 241 | **21 (8.7%)** |
| Lessons | 60 | **51 (85%)** |

A question is an English paragraph or sentence, four English options, and
a Turkish `explanation` / `tip` / `optionNotes` wrapper. Strip the
wrapper and the item is language-neutral: it works for a Spanish speaker,
a Vietnamese speaker, or a monolingual Anglophone who never learned the
labels.

A lesson is the opposite. Its method — the thing `CLAUDE.md` is right to
call the point of the product — is to name the boundary that *this
learner's L1* smears. `quantifiers` opens by saying Turkish has one word
where English has four, and the entire `contrast` block exists to undo
that specific interference. That block is not a translated asset. It is
an argument about Turkish.

### 1.2 What that means, as a table

| Asset | Travels to App 2 as-is? | Why |
| --- | --- | --- |
| Content schema (typed blocks, item types) | **Yes, entirely** | It is about shape, not about Turkish |
| `tools/validate-content.mjs`, `content-checks.mjs`, `blind-corpus.mjs`, `make-calibration.mjs` | **Yes, entirely** | The most transferable thing this project owns |
| The agent briefs in `docs/agents/` | **Yes**, minus the exam sections | The rules that cost the most to learn are L1-neutral: no item built on its own lesson's sentence; an option a competent teacher would accept is a wrong option |
| Design system, `css/style.css`, `js/dom.js`, `js/listbox.js`, the a11y contract | **Yes** | Nothing in it is Turkish except the strings |
| Quiz engine, storage, backup, mistake book, the weakness bound in `storage.js` | **Yes** | And §2 argues the weakness engine is the *seed of App 2*, not a leftover |
| The 241 items (English half) | **Mostly** — ~90% | Exceptions: the 24 `closest-meaning` restatements are an exam format; the rest are ordinary B1–C1 practice |
| The 60 lessons | **No** | 85% argue against Turkish. Re-authoring, not translation |
| `docs/exam-spec.md`, `CLOZE_BLANKS`, the section point weights | **No, and worthless outside** | One university's paper |
| The "coverage of the paper" framing that organises the whole roadmap | **No** | App 2 has no paper, and therefore no definition of done |

That last row is the one to sit with. `docs/roadmap.md` is a good
document because it can say "39 of Session I's 60 points". Delete the
exam and that sentence has no replacement. **App 2's hardest design
problem is not content and not competition; it is that nothing tells it
when it is finished, or when a learner is.** §2 is mostly about
manufacturing a substitute.

### 1.3 So the seam is not the one in the brief

Three seams, ordered by how cleanly they cut:

1. **Exam / no exam.** Clean. Different spine, different definition of
   done, different reason to open the app, different willingness to pay.
   This is a real product boundary and it justifies two apps.
2. **Item bank / explanation layer.** Clean, and *inside* the content —
   which means it is a schema decision, not a product one. Today an
   item's Turkish explanation lives in the same object as its English
   stem. If the two apps are ever to share a corpus, that has to become
   `{ item, explanations: { tr: …, es: … } }`. It costs almost nothing
   today and is very expensive to retrofit at 2,000 items.
3. **Turkish / global.** Not clean at all, because it is downstream of
   (2) and of a person who does not exist yet.

**What would have to be true for me to be wrong here:** that App 2's
lessons could be written without L1 contrast and still be better than
Babbel's. Possible — but then the thing that makes this app good is gone,
and it is competing on production values with companies that have
hundreds of staff. I would not take that trade.

---

## 2 · What App 2 actually is

"A Duolingo, but more instructive and more respectable" is a good
instinct and not yet a product. Here is the honest state of it: **the
audience is real and underserved, the mission is real, and there is no
loop.** This section proposes one. If the owner disagrees with the loop,
that is fine; what he should not do is start building before there is
one, because the loop decides the content, and content is the constraint
(§5).

### 2.1 The audience is the asset, and it is bigger than it looks

`CLAUDE.md`'s learner — **competence without the labels** — is not a
niche the owner invented to make the app feel special. It is a
recognisable category with a literature: in other languages it is called
the *heritage speaker*, and the described profile matches almost exactly
— strong ear, strong conversational instinct, gaps in formal register,
academic vocabulary and metalanguage *(search summary)*. Apps built
specifically for heritage speakers exist and are described as unusual
precisely because nearly everything else is built for people starting at
zero *(search summary)*.

English has a version of this cohort that no other language has: people
who acquired it from series, games, subtitles and Discord. Nobody had to
enrol them. They are not in a beginner funnel, they will never open a
lesson called *Greetings*, and every mainstream app insults them within
ninety seconds. That is the underserved segment, and the owner already
knows more about it than most product teams do, because he is in it.

### 2.2 But the segment has one structural problem, and it is fatal if ignored

**They have no deadline.** The exam app has one; that is why it works.
"Improvement" has none, and every signal points the same way: the
willingness to pay in language learning concentrates where there is a
gate — a certificate, an admission, a job *(search summary: learners
report paying a premium for exam-aligned outcomes; retention is higher
where progress maps to a named credential)*. Money aside, motivation
behaves the same way. An app for people who already function, aimed at a
goal they cannot name, competing with the pull of the thing they were
doing instead, will be opened four times and abandoned.

So App 2 must manufacture a stake. There are exactly three honest ones:

| Stake | What it is | Fit |
| --- | --- | --- |
| **A gate** | IELTS / TOEFL / Duolingo English Test / a university or employer test | Strongest pull, best payment behaviour — but it makes App 2 *another* exam app, and the exam is not the one he can read |
| **A register** | "You speak English. You do not write English that survives a professor or a hiring manager." | Real, unglamorous, defensible, and matches what the heritage-speaker literature says the gap actually is |
| **A map** | "You do not know what you don't know. Here is the list." | Weakest pull, cheapest to build, and the only one that is *already half-built in this repo* |

My recommendation is **the map first, the register second, the gate
never** — because the gate turns App 2 back into App 1 with a bigger
competitor, and because the map is buildable from what already exists.

### 2.3 The product, stated so it can be argued with

**The unit of work is a contrast, resolved.** Not a lesson, not a level,
not a day. English has some bounded number of boundaries a competent
non-academic speaker smears — the corpus has already named sixty of them,
and `docs/research/progression.md` established that they have essentially
no prerequisite structure, which is exactly the property a non-linear
diagnostic needs. A user's state is: *which boundaries are you on the
wrong side of?*

**The loop is: probe → verdict → boundary → re-probe.**

1. **Probe.** Four items on one contrast, drawn adversarially — the same
   items App 1 already has.
2. **Verdict.** Not a score. A sentence: *"Your ear is fine on `few` vs
   `a few`. You lose `little` vs `a little` when the noun is abstract."*
   The bound in `js/storage.js` that already refuses to call something a
   weakness on thin evidence is the honest engine for this, and it is
   written.
3. **Boundary.** One lesson, in the learner's L1, doing the one thing
   this app does better than anyone: naming the thing their language
   made invisible.
4. **Re-probe.** Later, unannounced, with different items. The boundary
   either moved or it did not.

**What the learner has on day 30 that they cannot get free elsewhere:**
a map of their own conflations, with evidence. Not "you did 30 lessons".
*"English has ~200 boundaries where a fluent-but-untaught speaker
typically loses one; you were tested on 60; you were wrong about 14; six
of those have moved; here they are, with the sentence that proved it."*

That artefact is the product. It is worth stating why it is defensible:

- **Duolingo structurally cannot produce it**, because it assumes you
  know nothing, so its model of you is a progress bar rather than a
  hypothesis about your errors.
- **ChatGPT will not produce it**, because it answers the question you
  asked. This audience's defining feature is that *they do not know which
  questions to ask.* An app that finds the unknown unknowns is doing the
  one job a chat interface cannot start.
- **A textbook produces it in the wrong currency** — it gives you all 200
  boundaries in a fixed order, most of which you already have.

### 2.4 "More respectable" made testable

Positioning that cannot be checked is decoration. Three rules; every one
of them is already lived in this repo, and every one is a thing a
competitor does the other way:

1. **It never manufactures urgency.** No streak, no lives, no
   "your progress will be lost". `docs/v1-plan.md` already refuses these;
   in App 2 the refusal becomes the *marketing*.
2. **It never claims more than the data supports.** The weakness bound is
   already in the code. On day 30 it can say "I don't know yet" about a
   category you have answered twice, and it should.
3. **It never tells you something a competent speaker would dispute.**
   This is the blind pass, and it is the most expensive promise in the
   product (§5).

**The free part, which the owner said is non-negotiable:** make the
*diagnostic* free and complete. The map costs the least content and is
the strongest proof the app is right about you; the paid half is the
fixing. This is the inverse of the usual freemium and it is the honest
version of it — the free tier tells you the truth about yourself and does
not withhold it to sell you something.

### 2.5 The honest verdict on App 2

It is one good product idea (the map) attached to one genuinely
underserved audience, with **no distribution and no content**. That is
not a reason to refuse it. It is the reason it must come second, and the
reason it must not start with a subscription (§5.4).

**What would have to be true for §2 to be wrong:** that the audience will
pay for, or return to, an app whose only promise is self-knowledge. I
would test that with fifteen people before writing one new item, and §9
says how.

---

## 3 · The competitive reality, without a slide

### 3.1 What actually happens to a solo-built language app

The category is not merely competitive; it is one where the entire
economics have moved to the top. From the 2026 subscription benchmarks
*(search summary — RevenueCat's report, which I could not open)*: the top
10% of subscription apps take about **94.5%** of the revenue, and roughly
**57.7% of new apps never reach $1,000 in total**, ever. The commonly
repeated shape of the distribution — most apps under $1,000/month, a few
per cent above $10k MRR — is consistent across every summary I saw.

Two of those figures deserve a second look because they are the only
*encouraging* ones I found, and they are in his category: Education has
the **highest median weekly subscription renewal rate (58%)** of any
category, and among the better trial-conversion rates (~6.5%)
*(search summary)*. People who buy education apps keep them. That does
not help you get bought.

**The realistic ceiling for App 2 as described** — solo, no ad budget, no
audience, no growth machine, a deliberate refusal of the mechanics that
make retention curves look good — is **hundreds of paying users, not
thousands**, and the median outcome for a project like this is under a
hundred. That is not pessimism; that is what he asked for. He said profit
is not the point and that a meaningful part is free. A product designed
against a target of *400 people who would be upset if it disappeared* is
a coherent, achievable, respectable thing. A product designed for growth
is answering someone else's question, and would lose.

### 3.2 The competitor is not Duolingo

Duolingo is not competing for this user; it has already lost them, which
is why they are describable as a segment at all. The real competitors
are, in order:

1. **ChatGPT and its equivalents.** Free at the margin, infinitely
   patient, and genuinely excellent at *"why is it `so smooth` and not
   `such smooth`"* — which is precisely this app's core interaction. This
   is the threat the brief does not mention and it is the one that
   matters. Even Duolingo's own AI tier is described as competing less
   with classroom apps than with ChatGPT's voice mode *(search summary)*.
2. **Nothing.** The default behaviour of this user is to keep watching
   series and never think about it. Most consumer education loses to
   nothing, not to a rival.
3. **Babbel and the grammar-forward tier**, which is where a
   competence-without-labels learner ends up today and is repeatedly
   described as the strongest option for adults who want explanations
   rather than pattern-guessing *(search summary)*. It is beatable on
   audience fit and unbeatable on production.

### 3.3 The one wedge

Against ChatGPT, only one thing survives: **ChatGPT answers; it does not
diagnose.** It has no persistent model of your errors, it never brings up
the boundary you have never noticed, and it will confidently agree with
you. The wedge is therefore the map (§2.3), plus the corpus discipline
that makes the verdicts trustworthy — the blind pass exists so that the
app is not merely another confident voice.

Say this plainly, because it decides what to build: **if App 2's headline
feature is explanation, it is dead on arrival.** Explanation is free
everywhere. If its headline feature is *finding the thing you did not
know to ask about*, it has something, and the something is exactly what
this repository has been accidentally building since the mistake book
shipped.

### 3.4 The asymmetry nobody has named

App 1 has a distribution channel: a prep school, a date, classmates, a
friend who has sat the exam, and a reason to talk about it in the six
weeks before it. **App 2 has none.** No channel, no season, no word of
mouth, no reason for anyone to mention it to anyone.

That asymmetry is larger than any product difference in this document and
it is the strongest argument in §4 for the order.

---

## 4 · The order

**App 1 first, finished and small. Then App 2, prototyped on App 1's
corpus with zero new content. Localisation third, and only with a
partner.**

### 4.1 App 1 is not a detour, because it is not a cost

The git history is worth stating: **168 commits in four days**, ~102,000
lines added, 38 versions, 241 reviewed-by-pipeline items, a design
system, a validator, a service worker, and a UI verification harness.
Whatever else is true, the *building* is not the expensive part of this
project any more.

Which means the question "is App 1 worth it?" is nearly moot — it is
built. The remaining spend is not the app; it is the **selling
apparatus**: a developer account, a payment path, a tax decision, a
support channel, a refund, a stranger who says an answer is wrong. That
apparatus is genuinely valuable to rehearse, and it is valuable in
proportion to how small the stakes are. Fifty people you know is the best
possible first customer set, because every one of them will tell you what
is broken instead of leaving one star.

**So yes: App 1's real value is the pipeline rehearsal, and the revenue
should be modelled as zero.** Every number in §7 should be treated as
covering costs, not producing income, exactly as the owner said.

### 4.2 What App 1 de-risks for App 2

| Question App 2 lives or dies on | Does App 1 answer it? |
| --- | --- |
| Can he sustain the review load the content requires? | **Yes, decisively.** §5 |
| Does the pedagogy work on people who are not him? | **Yes** — 50 users, one shared exam, verifiable outcomes |
| Can he take money, pay tax, handle a refund, ship an update? | **Yes**, at the cheapest possible scale |
| Will anyone pay anything for his work? | **Weakly** — friends buying a friend's app is not price discovery |
| **Will anyone still be using it in month three?** | **No. And this is the number App 2 depends on.** |

That last row is the honest limit of the rehearsal. App 1 is used
intensively for six weeks and then correctly discarded; it will produce
no evidence at all about retention, which is the only metric that decides
whether App 2 is a product or a hobby. §9 proposes the cheapest way to
get a first reading on it anyway.

### 4.3 The assumption inside App 1's plan that nobody has checked

"Three schools, ~50 people each" assumes the app is about *the prep-school
proficiency exam*. It is not. `docs/exam-spec.md` is derived from two
**YTÜ** sample papers, and its single most valuable finding — the
blank-by-blank map that reorganised the entire content roadmap — is a
fact about that paper. Bilkent's exam (which the friend actually sat),
Boğaziçi's, ODTÜ's: different sections, different weights, plausibly a
writing task of a different shape.

**This is a business risk, not a content one.** Sold to YTÜ students, App
1 is a precisely targeted product. Sold to three schools, two thirds of
the customers get an app that practises a paper they are not sitting, and
they will notice — this audience is exactly the audience that notices.

Cost to resolve: **one evening.** Get one past or sample paper from each
of the other two schools and diff the section list against
`docs/exam-spec.md`. If they match, the volume plan stands. If they do
not, App 1 is a YTÜ product with a smaller number in front of it — and it
is much better to know that before pricing it.

---

## 5 · Content supply: the real constraint

This is the section that should change a decision.

### 5.1 What the corpus cost, measured

| | |
| --- | --- |
| Questions | 241 (~178 words each) |
| Lessons | 60 (~616 words each) |
| Total authored words | **~80,000** — 43k in items, 37k in lessons |
| Option notes | 723 |

And what the pipeline says it costs to review properly
(`docs/research/content-pipeline.md` §7.1–7.2, which is the most
carefully costed document in the repo): **~90 minutes of the supervisor's
own attention per 12–15 items**, i.e. **6–8 minutes per shipped item**,
excluding agent time, and excluding a one-off hour per category spec.

Apply it to what exists:

| Corpus | Items | Supervisor hours, at 6–8 min/item |
| --- | --- | --- |
| Today | 241 | **24 – 32 h** |
| App 2 at 3× | ~720 | 72 – 96 h |
| A "global app" at 10× | ~2,400 | **240 – 320 h** |

At four hours a week — a generous estimate for a student in prep school —
240–320 hours is **fifteen to twenty months of evenings**, for one
language, before a single word is localised.

**That is the answer to "does the pipeline scale to a global app": no,
not with one supervisor.** It scales beautifully in the part that is
automated — agents write and blind-review at whatever volume you like —
and it does not scale at all in the part that is the actual quality
control, which is one person's attention, and which the pipeline document
itself identifies as the binding constraint.

### 5.2 The thing that has not been costed at all: the API bill

Nobody has recorded what the 241 items cost in AI spend. It is the only
input to App 2's unit economics and it is currently unknown, in a project
whose stated success condition is *covering the AI costs*.

**Recommendation, effectively free:** add one line to the batch record in
`docs/agents/` — items produced, agent sessions used, approximate spend.
After three rounds there is a real per-item number, and a sentence like
"App 2's 2,400 items cost roughly X" becomes sayable. Right now it is not.

### 5.3 Localisation is a co-author, not a translation

The measurement in §1.1 again, because it is the whole argument: **51 of
60 lessons reason about Turkish.** Re-authoring 60 contrastive lessons for
a second L1 is not 37,000 words of translation; it is 60 pedagogical
arguments about a language whose interference patterns the author does
not have. Rough cost, using the pipeline's own rate and treating a lesson
as roughly the review weight of six items: **45–60 hours of expert
attention per additional language**, where "expert" means a person with
native intuition for that L1 *and* enough English to adjudicate a blind
pass — and where the app's central promise, "an option a competent
teacher would accept is a wrong option", cannot be kept by anyone else.

So: **each additional language is a person, not a budget line.** The
right model, if it ever happens, is one language / one co-author / shared
item bank / shared tooling. Which is a nice model, and is nothing like
"localised for foreign markets".

**What would have to be true for me to be wrong:** that L1-neutral
explanation is good enough. Test it cheaply — rewrite three lessons with
every Turkish reference removed and give them to two learners with
different first languages. If the L1-neutral version teaches as well, the
whole localisation problem evaporates and my §1 headline is wrong. That
is a two-evening experiment and it is worth running before any of this
matters.

### 5.4 Therefore: do not launch App 2 on a subscription

A monthly price is a promise of continuing supply. At 6–8 minutes of
personal review per item, a cadence that feels alive — say 30 new items a
month — is **3–4 hours of his own attention every month, permanently**,
on top of everything else, or the app visibly dies while still charging.

A one-time unlock matches a finished corpus and matches "profit is not
the point". If recurring revenue is ever wanted, the honest form is a
*supporter* subscription that buys nothing withheld — which is a
different, and more respectable, thing than a paywall with a cadence
obligation behind it.

---

## 6 · What breaks technically, cheapest version first

The app is static, dependency-free, backend-free, account-free,
`localStorage`-only, and has a service worker. Each App 2 ambition needs
a specific capability; the point of this table is to show which ones are
nearly free and which one is a different project.

| Ambition | Cheapest capability that delivers it | Real cost |
| --- | --- | --- |
| Localised UI strings | A string table + `lang` handling | 1–2 evenings. Trivial |
| Localised *teaching* | A person (§5.3) | 45–60 h **per language** |
| "Slightly online" — content updates without a store release | **Already works.** Static JSON + network-first service worker | 0 |
| Works offline | **Already works** (`sw.js`) | 0 |
| Paid unlock | A store binary, entitlement from the store receipt | ~2–4 evenings of wrapper + a review cycle + $99/yr |
| Accounts / progress across devices | A backend | Weeks. **Skip it.** The export/import backup already in `storage.js` covers 90% of the need at 0% of the cost |
| Knowing what is broken | The existing "Bu soruda bir sorun var" report path | Already there; make it reach him |
| Knowing whether anyone returns in month 3 | Some usage signal — even opt-in, even aggregate | **Not available today, by policy.** See §6.2 |

### 6.1 The collision nobody has noticed: you cannot sell a public static file

Two of this project's commitments are individually right and jointly
fatal to charging money:

- *"A meaningful part is free"* — non-negotiable, the owner's words.
- *"Content is data"*, served as static JSON from GitHub Pages, out of a
  repository at `github.com/ErenDenizK/english-prep`.

Every question in this app is currently retrievable with one `curl` of
`data/manifest.json` followed by ten more. A paid unlock implemented in
`localStorage` is a cosmetic lock on an unlocked door, and this audience —
technically literate, Discord-fluent — is the single worst audience to
try it on. One screenshot of a fetch URL in a class group chat ends the
model.

There are exactly three honest resolutions, and **the owner has to pick
one deliberately**:

1. **Sell the container, give away the content.** The web app stays free
   and complete forever; the store app is the same app, and what people
   buy is installation, offline convenience and supporting the project.
   Coherent with everything he has said. Revenue depends on goodwill,
   which — at 150 friends-of-friends — is not a crazy bet.
2. **Split the corpus.** Free content in the repo; paid content only in
   the store binary. Defensible line: *free = practice, paid = the timed
   full-paper mock and the reading passages*. This costs the project one
   of its rules — some content stops being a file in git — and that rule
   is load-bearing for the whole authoring model. Know the price before
   paying it.
3. **Charge nothing for App 1**, treat the store listing and the tax
   registration as the rehearsal, and let App 2 be the thing that ever
   asks for money.

Option 3 is the one I would take if the goal is genuinely the experience
rather than the income, because it removes the refund surface, the DRM
temptation and the review-policy risk in one move, at a cost of ~23,000
TL that was never the point. Option 1 is the best if he wants money to
change hands, and it is the only one that does not require breaking an
existing rule.

### 6.2 The tension he will hit and has not named: no analytics

`CLAUDE.md` forbids analytics, and that is right for an app used by
friends for six weeks. **App 2 cannot be improved without some signal.**
Not a growth dashboard — one question: *are the items discriminating, and
does anyone come back?* Without it, the corpus can only be improved by
his own intuition, which is exactly the failure mode the whole review
pipeline exists to prevent.

The cheapest honest version, and the only one I would build: **the
existing backup export, plus a one-tap "send this to the developer"**.
Opt-in, visible, the learner's own file, nothing collected silently. It
preserves the promise and yields the one dataset that matters. It is a
few hours of work and it should exist before App 2 has a single user.

---

## 7 · Money, store, tax — a list for professionals, not answers

**Everything in this section is unverified and marked as such.** It is
here so the right person can check it quickly, per the standing rule in
the brief.

### 7.1 His price arithmetic checks out

He estimated ~150 TL net on a 270 TL price. Working it through, with each
rate named so it can be corrected:

| Step | Rate *(unverified)* | Result |
| --- | --- | --- |
| List price, VAT inclusive | — | 270 TL |
| Less Turkish VAT | 20% | 225 TL |
| Less Apple commission, Small Business Program | 15% *(search summary: applies under $1M annual proceeds; requires enrolment)* | 191 TL |
| Less withholding at the bank, if using the content-creator regime | 15% *(search summary)* | **~163 TL** |

So ~150–165 TL, and **his estimate is right and slightly conservative.**
At 150 buyers that is roughly 23,000–24,000 TL gross of the Apple
developer fee ($99/yr) and of AI spend, which nobody has measured (§5.2).

Note also: Apple announced VAT/tax adjustments affecting Türkiye in
January 2026 *(search summary)*. The current rate is his to confirm, not
mine to assert.

### 7.2 The tax regime he is thinking of is real, and has a trap in it

He believes there is a Turkish regime for app sellers that does not
require forming a company. **He is broadly right.** It is the *sosyal
içerik üreticiliği ve mobil cihazlar için uygulama geliştiriciliği*
exemption, GVK mükerrer 20/B *(search summary — I read no primary
source)*. What the summaries consistently say:

- 2026 threshold around **5,300,000 TL** (the fourth income-tax bracket
  ceiling), up from ~4,300,000 TL in 2025.
- Requires a **dedicated bank account** through which all such income
  passes; the bank withholds at source.
- Explicitly covers developers of applications for mobile devices sold
  through electronic app stores.
- **No company required** below the threshold.

**And the trap, which matters because the brief says he is not alone:**
the summaries state that where the activity is carried out through an
*adi ortaklık* (ordinary partnership), the partners **cannot** use the
exemption for that activity, though an individual can use it for
activity conducted individually outside the partnership. If he and his
friend intend to "run this together", the legal shape of *together*
changes the tax answer. That is a fifteen-minute question for an SMMM and
it should be asked **before** the developer account is opened in
somebody's name, because the account name is the answer.

**Nothing in §7 should be acted on without a mali müşavir.** One
consultation, priced as a single evening's worth of anything else, closes
the entire subject.

### 7.3 Android versus Apple, briefly

The brief mentions both. The honest ordering for this project:

1. **The web app is already the widest distribution he has**, on every
   platform, installable, offline, free — and it is the version his
   friends will actually use next month. Nothing about the store
   improves the product.
2. **iOS first if selling**, because that is where he is and where his
   circle is, and because one store is one review process, one tax
   question and one support inbox.
3. **Android is cheaper and lower-friction** (a one-off registration fee
   an order of magnitude below Apple's annual one *(unverified)*, easier
   review),
   and is the right *second* step if App 1 sells at all — but two stores
   before one product has worked is two support surfaces for the same
   zero revenue.

---

## 8 · What I would refuse

- **A single app with a toggle.** The owner is right and the analysis
  above only strengthens him: different definitions of done, different
  content, different loops.
- **Launching App 2 on a monthly subscription.** §5.4. It sells a supply
  cadence that one student cannot fund out of evenings.
- **Localising before there is a co-author.** §5.3. A machine-translated
  lesson whose whole method is L1 contrast is worse than no lesson, and
  it would be the first genuinely dishonest thing this project shipped.
- **Building accounts and sync for App 2.** The backup file already
  covers it. This is the classic place where a no-backend project becomes
  a backend project for a feature nobody asked for.
- **Any DRM in a static app.** §6.1. Pick a model that does not need it.
- **Reading passages before App 1 ships.** `docs/roadmap.md` already
  costed this at 25–35 hours and put it outside v1; nothing in the
  business case changes it, and it is the single easiest way to spend the
  next three months producing nothing sellable.

---

## 9 · If the next three months were my evenings

Assumption: ~4 hours a week, a student, sitting the exam himself, exam
date still unknown (`docs/roadmap.md`, Still open #1). If the exam is
inside this window, everything in Month 1 stays and everything else
slides — Month 1 is revision anyway.

### Month 1 — pay the debt on what you are about to sell

| | Work | Cost |
| --- | --- | --- |
| 1 | **Sit your own corpus cold**, as `content-pipeline.md` §7.1 step 6 demands and as nobody has recorded doing. Start with the ~120 items covering the cloze blanks you will actually sell on. This is not overhead; it is your revision. | 10–14 h |
| 2 | **Get one sample paper from each of the other two schools** and diff the sections against `docs/exam-spec.md` (§4.3). | 1 evening |
| 3 | **Ask the SMMM** the §7.2 questions, above all the partnership one, before any account exists in anyone's name. | 1 evening |
| 4 | **Start recording AI spend per batch** in the batch record (§5.2). | 20 min, once |

### Month 2 — make App 1 finishable and sellable, and choose the model

| | Work | Cost |
| --- | --- | --- |
| 5 | **Choose one of the three resolutions in §6.1 and write it down** in this directory. Everything else depends on it and it costs nothing but a decision. | 1 evening |
| 6 | Close the two real holes in `docs/roadmap.md`: `so / such`, then paragraph completion's schema. Ship what is reviewed; do not chase coverage. | 8–10 h |
| 7 | Open the developer account in the name the SMMM answer implies. Expect verification delay; start it early even if nothing ships. | 2 h + waiting |
| 8 | Make the "bu soruda bir sorun var" report actually reach you (§6.2), and add the opt-in "send my backup" button. | 3–4 h |

### Month 3 — ship small, and get the only evidence App 2 needs

| | Work | Cost |
| --- | --- | --- |
| 9 | Ship App 1 to the circle. Fifty people, one exam, a WhatsApp group for broken items. Fix things within a day; that is the rehearsal. | ongoing |
| 10 | **Run the L1-neutral experiment** (§5.3): three lessons stripped of Turkish, two non-Turkish readers. It decides whether App 2 can ever be localised without a partner, and it costs two evenings. | 2 evenings |
| 11 | **Prototype the map** (§2.3) on the existing corpus, with zero new content: a 20-item probe across categories, then the verdict screen, using the weakness bound already in `storage.js`. Show it to fifteen people who are not sitting the exam. | 6–8 h |
| 12 | Write App 2's one-pager only after (11). If the map does not make fifteen people say *"how did it know that"*, App 2 is not ready to be started and the corpus is better spent on App 1. | 1 evening |

Note what is **not** in the plan: no new topics beyond the two holes, no
localisation, no backend, no subscription, no second store, and no line
of App 2 code that is not a reuse of App 1's.

### What would have to be true for this plan to be wrong

| Recommendation | It is wrong if… |
| --- | --- |
| Two apps, split on *exam / no exam* | The exam framing turns out to be portable across Turkish universities *and* App 2's audience will not pay without a gate — in which case there is one app: a Turkish university-exam app, and App 2 is a feature of it |
| Localisation last, gated on a co-author | The L1-neutral experiment (10) shows the teaching survives without Turkish |
| App 1 first | The exam date is far away *and* the friend's Bilkent result says the corpus does not transfer — then App 1 has neither urgency nor a market, and its only remaining value is the store rehearsal, which is two evenings, not three months |
| No subscription | The map turns out to be genuinely consumable monthly, i.e. people want a *new* diagnosis, not a fixed one. Watch (11) for this; it is the one finding that would change §5.4 |
| Model revenue as zero | 150 people pay 270 TL, in which case the constraint was never money and this whole document was about the wrong thing |

---

## 10 · The biggest risk, and it is not in the brief

**The quality system has one component, it is the owner's personal
attention, and it has never actually been spent.**

The pipeline is designed around one irreplaceable human step — take the
batch cold, adjudicate the flags, read every Turkish explanation — costed
at 90 minutes per 12–15 items and described in its own document as *not
optional*. Against 241 shipped items that is **24–32 hours**. The entire
project is **four days old**. The agents have reviewed each other
exhaustively — six audit rounds, blind passes, independent re-audits,
five repairs that introduced new defects and were caught — and that
machinery is genuinely impressive. But every one of those passes is the
same kind of judgement checking itself, and the pipeline's own founding
finding is that *AI-assisted items reviewed with less human engagement
end up carrying more flaws than unassisted ones*. The system was designed
around that risk and then run without the one step that answers it.

Today that costs nothing: the users are friends, the app is free, and a
bad item is a text message. Every path in this document changes that
exactly once:

- **App 1 sold** converts an ambiguous item from a favour into a refund,
  a one-star review, and — for someone sitting a proficiency exam that
  gates their degree — a real grievance.
- **App 2** multiplies the corpus tenfold against the same single
  reviewer, at 6–8 minutes an item, forever.
- **Localisation** removes even the possibility of his review, because he
  cannot adjudicate a Spanish contrast.

Everything in this project — the whole architecture of briefs, blind
passes, calibration files and re-audits — is scaffolding around one
person's ability to say *"no, a competent teacher would accept that
option."* That capacity does not scale, cannot be delegated to an agent,
and is currently the only thing standing between this corpus and the
50%-flaw base rate the literature reports for generated items.

**Which is why the first item in Month 1 is not a feature.** Sit the
corpus cold, and find out how much of the debt is real. If the answer is
"almost none, the agents did well", that is the single most valuable
finding this project could produce, and it makes App 2 thinkable. If the
answer is "one item in twelve", then that is the true cost of content,
and it should be known before anyone builds a business on top of it.

---

## Sources

**Confidence note.** `WebFetch` is blocked in this environment. Every
external page below was seen only as a search-index summary; **I opened
none of them.** Nothing in §§1, 2, 4, 5, 6, 8, 9 or 10 depends on them —
those rest on measurements of this repository and on documents inside it.
§3 and §7 are where they are used, and both sections say so at the point
of use.

Internal, and the stronger evidence:
`docs/business/brief.md` · `CLAUDE.md` · `docs/roadmap.md` ·
`docs/exam-spec.md` · `docs/research/content-pipeline.md` (§7.1–7.2 in
particular) · `docs/research/architecture-and-scale.md` ·
`docs/research/progression.md` · `docs/agents/README.md` ·
`data/*/*.json` · `git log`.

External *(search summaries only)*:
- [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) and its [Education chapter](https://www.revenuecat.com/state-of-subscription-apps-2026-education) — revenue concentration, share of apps never reaching $1,000, Education renewal and trial-conversion rates.
- [Apple, App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/) and [Adapty's 2026 summary](https://adapty.io/blog/app-store-small-business-program/) — the 15% rate and the $1M threshold.
- [Gökay Gül SMMM, on GVK mük. 20/B for 2026](https://gokaygul.com/tr/blog/sosyal-icerik-ureticisi-vergi-istisnasi-2026/) and [mukellef.co](https://mukellef.co/blog/sosyal-medya-icin-vergi-istisnasi/) — the 5,300,000 TL threshold, the dedicated bank account, the withholding, the partnership exclusion.
- [Yapr, on language apps for heritage speakers](https://www.yapr.ca/a/language-app-heritage-speakers) — the closest existing analogue to this app's audience.
- [Pestel-analysis.com, Duolingo competitive landscape](https://pestel-analysis.com/blogs/competitors/duolingo) and [OpenAI's Duolingo Max case study](https://openai.com/index/duolingo/) — Duolingo's scale, and Max competing with AI tutors rather than with classroom apps.
- [Mordor Intelligence, online language learning](https://www.mordorintelligence.com/industry-reports/online-language-learning-market) — the exam-aligned willingness-to-pay claim in §2.2. Treated as directional only.
