# What the learner pays

Written 2026-09-05, against `docs/business/brief.md`. This document
answers one question in four parts: what a sale is actually worth, what a
question actually costs to make, which part of the app is free, and
whether 270 TL is the right number in the market this is sold in.

Two sibling documents cover ground this one deliberately does not:
`shipping.md` (store mechanics and platform policy) and `two-apps.md`
(whether the split is right). Where they overlap with this one it is
noted rather than repeated.

**Every number in here carries a tag.**

| Tag | Means |
| --- | --- |
| `[search]` | From a web-search summary. `WebFetch` is blocked in this session, so no primary source was opened. Dated where it matters. |
| `[repo]` | Computed from files in this repository. Reproducible. |
| `[estimate]` | Built from `[search]` and `[repo]` inputs plus stated assumptions. The assumptions are written next to the number, not in a footnote. |

Commission rates, VAT treatment, tax exemptions and competitor prices all
change. §7 is the list of what must be re-checked before he prices
anything, and two of the items on it are for a professional rather than
for a session with a search index.

---

## 1 · The verdict on his own arithmetic

**Yes, it clears his bar — but for a different reason than his numbers
say, and the part of his estimate that is wrong is not the part he
hedged.**

Three findings, in order of how much they move:

1. **His net-per-sale is pessimistic by about 8%.** He guessed ~150 TL.
   The real figure is **~163 TL** if he enrols in the App Store Small
   Business Program and uses the Turkish app-developer income-tax
   exemption, and **~134 TL** if he does neither. His 150 sits between
   them, which means he mentally applied the 30% commission and forgot
   the tax. Both halves are worth fixing — together they are the
   difference between 150 sales paying for three months of tooling and
   four.

2. **The costs he did not compute are larger than the commission he
   did.** The Apple Developer Program is $99/year `[search]` — about
   4,800 TL, or **30 sales before the first lira is his**. The AI
   subscription that produces the corpus is 4,800–9,700 TL *per month*
   `[search]`, which is another 30–60 sales per month of production.
   Commission and tax cost him 40% of the sticker price; the tooling
   costs him whatever number of months he keeps working.

3. **"Three schools × 50 people" is the number to interrogate, and he
   didn't.** Everything else in this document is arithmetic. That line is
   a forecast, it is the only input that can be wrong by an order of
   magnitude, and it silently assumes that 150 people *reached* equals
   150 people *paying*. It does not.

### 1.1 What one sale is actually worth

The chain, per sale, at a 270 TL sticker on the Turkish App Store:

| Step | Rate | Amount |
| --- | --- | --- |
| Customer pays | | **270.00 TL** |
| less Turkish KDV, collected and remitted by Apple | 20% `[search]` | −45.00 |
| = the base Apple takes commission on | | 225.00 |
| less App Store commission, Small Business Program | 15% `[search]` | −33.75 |
| = **developer proceeds** | | **191.25 TL** |
| less income-tax withholding at the bank, GVK mük. 20/B | 15% `[search]` | −28.69 |
| = **in his hand** | | **162.56 TL** `[estimate]` |

The same chain at the **standard 30% commission** yields 157.50 TL of
proceeds and **133.88 TL** in hand. His guess of 150 sits between the two,
which is what you get by remembering the 30% and forgetting the tax. The
commission and the tax treatment are independent levers and both are
worth pulling:

**The 15% commission.** The App Store Small Business Program charges 15%
instead of 30% for developers with up to **$1,000,000 in proceeds in the
prior calendar year**; developers new to the App Store also qualify
`[search]`. Conditions that matter for a two-person project: enrolment is
a *thing you apply for*, not automatic; the applicant must be the Account
Holder of the developer membership, not a team member; and proceeds
across all associated developer accounts are combined against the ceiling
`[search]`. Nothing here is close to a million dollars, so the only way to
miss this is by not enrolling. **Enrol before the first sale.**

**The Turkish exemption he believes exists — it does.** GVK mükerrer madde
20/B exempts, from income tax, the earnings of mobile application
developers from electronic application-sale platforms. For 2026 the
ceiling is the fourth bracket of the income-tax tariff, **5,300,000 TL**,
and the mechanism is a **15% withholding taken by the bank on amounts
transferred into a dedicated account**, which is final `[search]`. It
requires an *istisna belgesi* from the tax office and a Turkish bank
account opened for the purpose, and it does not require forming a
company. His belief in the brief was correct.

**This is the one paragraph in this document that a professional must
sign off.** Whether Apple's foreign-sourced proceeds land in a way that
satisfies the exemption, whether the certificate must precede the first
payment, and what happens to income received before the certificate
issues are all questions with money attached, and a search summary is not
an answer. `docs/business/brief.md` already says this; it is repeated
because the number above depends on it.

### 1.2 What it costs to produce

The brief's bar is *"if it covers the AI costs and the store fees, that
is already a win."* The store fee is $99/year. The AI cost has never been
written down, so here it is from two directions.

**Direction one: what actually happened.** The whole app — 10 topics,
**241 questions**, **60 lessons**, **723 option notes** `[repo]` — plus
354,000 words of documentation `[repo]`, was produced in **four calendar
days across 168 commits** `[repo]`. That is not four evenings. It is four
days of near-total immersion, and it was done on a flat-rate Claude
subscription, not per-token.

Claude plans: Pro is **$20/month**, Max starts at **$100/month** (Max 5x)
and Max 20x is the tier above `[search]`. Claude Code draws on the same
usage pool as the rest of the plan `[search]`. The production pattern in
this repo — five blind passes on one topic's items, seven lesson repair
rounds on the same topic, 38 review artifacts across `docs/audit/` and
`docs/agents/drafts/` `[repo]` — is not Pro-shaped work. Assume **Max
5x** as the honest floor and Max 20x as the realistic ceiling during a
content sprint.

At 48.4 TL/USD `[search]`, spot on 2026-09-04:

| | per month | in sales at 162.56 TL |
| --- | --- | --- |
| Claude Pro | ~970 TL | 6 |
| Claude Max 5x | ~4,840 TL | 30 |
| Claude Max 20x | ~9,680 TL | 60 |
| Apple Developer Program | ~400 TL (4,800/yr) | 30 sales/year |

**One month of Max 5x costs about thirty sales.** That is the sentence to
remember, because it converts a pricing question into a schedule
question.

**Direction two: what a question would cost at API prices.** This matters
because it is the cost the project would face the moment any part of the
pipeline is automated rather than driven from a subscription seat.

Assumptions, all stated: roughly **10 agent sessions per shipped topic**
(two authoring sessions, a blind pass, a rubric pass, a lesson
sufficiency pass, one to three repair rounds and an independent re-audit
each — which is *below* what `closest-meaning` actually consumed);
5–15M cumulative input tokens per heavy session with 70–85% served from
cache; 100–250k output tokens. At Opus 5 rates of $5/MTok input,
$25/MTok output and ~$0.50/MTok for cache reads, that is **$10–30 per
session**, **$100–300 per topic**, and — allocating the lessons across
the questions they teach —

> **roughly $4–12 of model time per shipped question** `[estimate]`,
> or 200–580 TL.

Against 241 shipped questions that is **$960–2,900**, or 46,000–140,000
TL, or **285–860 sales just to have paid for the corpus that already
exists.**

The finding is not "the pipeline is too expensive." It is:

**The economics of this project rest entirely on flat-rate subscription
pricing.** A shipped question costs more than a sale at API rates and a
fraction of a sale at subscription rates. Everything below assumes the
subscription. If he ever moves generation to the API to make it faster,
the cost per question rises by an order of magnitude and the bar in the
brief stops being clearable at any plausible volume. Write that down
before someone proposes automating the pipeline.

**Direction three: evenings, which are the real currency.**
`docs/research/content-pipeline.md` §7.2 puts one properly reviewed item
at **six to eight minutes of the supervisor's attention** — 90 minutes
per 12–15 items. Against 241 shipped questions that is **24–32 hours of
review alone** `[repo]`, before the app, the design system, the
validator, or a word of the documentation. The observed four-day sprint
was more like 40–55 hours `[estimate]`.

What is left to v1, from `docs/roadmap.md`: `so / such` (half a day),
paragraph completion (schema ~1 day, then ~2 hours per item), and
depth from 4 to 6 items per category. Reading, explicitly after v1, is
**25–35 hours** for ten passages. Call the remaining road to v1 another
**60–80 hours**, and reading a further 30.

At 150 sales the whole project returns **24,384 TL** for something like
**110–130 hours** of his own work: **about 190 TL an hour** `[estimate]`.
A private English lesson in Türkiye pays **650–1,600 TL an hour**
`[search]`. He could earn the entire projected revenue of this app in
about fifteen to thirty hours of tutoring the same subject.

That is not an argument against building it. The brief already says the
return is the project and the experience, and that is a completely
coherent position. It is written down so that in June, when the money
lands and it is small, he sees a number he already agreed to rather than
a disappointment.

### 1.3 So does 150 people clear the bar?

At 162.56 TL per sale, and counting only the costs the brief names:

| Cost to cover | TL | Sales needed |
| --- | --- | --- |
| Apple Developer Program alone | 4,792 | **30** |
| + 3 months of Claude Pro | 7,696 | **48** |
| + 6 months of Claude Pro | 10,600 | **66** |
| + 3 months of Max 5x | 19,312 | **119** |
| + 4 months of Max 5x | 24,152 | **149** |
| + 6 months of Max 5x | 33,832 | **209** |
| + 6 months of Max 20x, or 12 of Max 5x | 62,872 | **387** |

`[estimate]`, all of it, from the `[search]` inputs above.

**150 sales pays the App Store fee and four months of Max 5x, almost
exactly.** That is the answer: yes, it clears the bar, on the condition
that the AI budget for this app stops at about four months of serious
production. It does not cover a year of it, and it does not cover Max 20x
for half a year.

Which gives the honest scale for the whole thing:

- **30 sales** — the project is not costing him money in fees.
- **~150 sales** — his own bar, clearly met, one production season paid.
- **~400 sales** — a full year of heavy tooling paid for, which is what
  "this sustains itself" would actually mean.

And there is a second, more forgiving reading of his bar that should be
said out loud, because it is probably the true one: **if he would be
paying for the Claude subscription anyway** — for other projects, for
learning, because he wants it — then the app's *marginal* AI cost is near
zero and the only real cost is $99. On that reading the bar is **30
sales** and it is met by his own friends before the app is announced. He
should decide which reading he means, because the two produce break-even
numbers thirteen times apart.

### 1.4 The number that is actually fragile

Everything above is arithmetic over rates. "Three schools, ~50 people
each" is a forecast, and it hides a step:

> Is 150 the number of people who **hear about it**, or the number who
> **pay**?

If 150 is the paying number, the table above holds. If 150 is the reach
— 150 students in three prep schools who see it — then the paying number
is what survives install, use, and a purchase decision. Freemium mobile
apps convert at low single-digit percentages; friend-of-a-friend
distribution converts much better than that but nowhere near 100%. At a
generous 20% it is 30 buyers, which is exactly the developer fee and
nothing else. At a typical freemium 3–5% it is 5–8 buyers, which does not
pay the developer fee.

**The recommendation is not to lower the forecast. It is to state it as a
funnel and put the numbers on the arrows before launch**, because it
changes what the free tier has to do. If the free tier's job is to make
150 reached become 30 paying, that is a different design from a free tier
whose job is to make 750 reached become 150 paying. §2 assumes the
second, because the second is the only one that meets his bar on the
strict reading.

---

## 2 · The free tier

*"Kesinlikle önemli bir bölümü ücretsiz olur."* The constraint is fixed;
the design is not. Five shapes were considered, and four of them are
wrong for reasons specific to this app rather than in the abstract.

**The recommendation, first: free forever, paid depth.** The app as it
exists at v1 — every lesson, every one of the shipped questions, the
mistake book, the results screen, progress — is free permanently. What is
paid is **more of the same** and **the sections that do not exist yet**.

### 2.0 A constraint that comes before the design

`CLAUDE.md`'s non-negotiables say no accounts, no backend, everything in
`localStorage`. That has two consequences most free-tier designs ignore:

1. **Any metered free tier is unenforceable.** "N questions a day" stored
   in `localStorage` is defeated by clearing site data. Metering needs
   either a server (forbidden) or a native receipt check (possible on
   iOS, but it makes the web build and the app build genuinely different
   products).
2. **The GitHub Pages build is currently the entire product, free, to
   anyone with the URL.** Whatever the paid app is, the existing web app
   is either *the free tier by definition* or it has to be narrowed at
   the moment the paid app ships. Narrowing something people already use
   is a much worse day than starting narrow. This is an argument for the
   recommended design rather than against it: **make the web app the free
   tier deliberately, and it stops being a problem.**

### 2.1 Free by topic — no

The app's diagnostic machinery is per-category. A wrong answer on the
results screen links to the lesson that teaches it; that link is the
single most valuable thing the app does, and `lessonId(topicId,
category)` exists to make it work.

Locking topics breaks it at the exact moment it matters. The learner
answers, gets it wrong, is told *this is your weak category*, taps
through — and hits a paywall. The app has diagnosed a problem and then
refused to fix it. For the learner in `CLAUDE.md` — competent, no
scaffolding, and quick to conclude that a thing is wrong rather than that
they are — that does not read as an incomplete product. It reads as bait.

There is also an information problem on the learner's side: the topics
you need are the ones you are bad at, which you do not know before you
start. "Some topics free" is a purchase you cannot evaluate.

**The one topic-shaped split that survives** is by **exam section**
rather than by grammar topic. Cloze and closest meaning free; paragraph
completion, and later reading, paid. That maps to a real cost asymmetry —
a reading passage is 2.5–3.5 hours of review and is *single-use*
`[repo, roadmap]` — it has a story a student accepts, and it never
strands anyone mid-diagnosis inside a section they are working through.
It is a fallback worth keeping, not the recommendation.

### 2.2 Free by mode — no, and it is backwards twice

**Lessons free, tests paid** is the intuitive version, and it is inverted
on both axes.

- *On cost*: the lessons are the expensive half. The review passes found
  roughly one untrue claim about English per lesson `[repo, roadmap]`;
  `closest-meaning`'s lessons went through seven repair rounds, each of
  the last three finding a defect the round before had introduced
  `[repo]`. Questions are comparatively cheap and, crucially, renewable.
- *On value*: for this learner, lessons alone are the part worth least.
  They already produce *"I have gone"* correctly. What they lack is the
  label and the boundary — which the lesson supplies in a minute and the
  practice supplies over a week. Charging for practice and giving away
  explanation sells the cheap half of the value at the expensive half of
  the cost.

**Tests free, lessons paid** fails the §2.1 test identically: a wrong
answer routes to a paywall.

The mode split that *does* work is not a split of today's modes at all;
it is free = the modes that exist, paid = the modes that do not. Which is
§2.5.

### 2.3 Free by volume — no, and it fights the calendar and the corpus

A daily cap is a mechanic for products with effectively unlimited
content. This app has **241 questions** `[repo]` and four items per
category by design.

Two failures, both specific:

- **The calendar.** A student two weeks from the exam wants to do eighty
  questions on a Saturday. A daily cap turns the app's single
  highest-value moment into its most frustrating one, and the moment they
  hit the cap is the moment a free YouTube playlist looks like the better
  tool. `docs/research/the-last-week.md` exists because the last week is
  the week that matters; a cap is a design that is worst exactly then.
- **The corpus.** With 241 questions, a cap of even 20/day means a
  motivated learner exhausts the free *and* paid supply inside two weeks.
  Metering a small corpus does not extend it; it just annoys people on
  the way to the same end.

Plus §2.0: it is not enforceable without a backend the project has
refused to build.

### 2.4 Free by time — no, and the reason is seasonal

A trial is the option whose failure mode is least visible in September
and most expensive in April.

- **A 7-day trial started in September** expires five months before the
  exam. Its only lesson to the learner is that this app is a thing that
  switches off. The most likely September user — someone who found it
  early and would have been the ideal long-horizon customer — is the one
  it burns.
- **A 7-day trial started in April** is, roughly, the remaining
  preparation window. The learner can correctly infer that the trial is
  the product. The customers who value it most get it for nothing.

The same mechanic, applied honestly, gives the product away to the
high-intent cohort and drives off the low-intent one. It is also
structurally a subscription mechanic, and §3 argues App 1 should not be a
subscription.

### 2.5 Free forever, paid depth — yes

**Free, permanently:**

- **Every lesson.** All of Eğitim. They are the app's honest face, the
  part a stranger reads first, and the part a learner screenshots and
  sends to a friend — which is the entire distribution channel he has.
  Giving them away is not generosity; it is the marketing budget.
- **The whole shipped question corpus at v1 depth** — four items per
  category, every topic, every section the app covers.
- **The mistake book, the results screen, progress, the roadmap in
  Profil.** Everything that makes the app feel like it is theirs.

**Paid, one-time:**

- **Depth, not access.** Items 5–10 in every category. The roadmap
  already names this as work ("items per category from 4 to 6 where a
  category is weak-flagged most often"), and the app's own post-v1
  thresholds make the pitch for it: mastery levels need ~8–10 items per
  category, adaptive difficulty and item scheduling need ~15–20, against
  4 today `[repo, roadmap]`. So the paid tier is literally what unlocks
  the app's best planned features, and the story writes itself — *you are
  buying more practice, and more practice is what lets the app be smarter
  about you.*
- **Reading passages.** 21 of the paper's 60 points, deliberately outside
  v1, 2.5–3.5 hours of review each, and single-use `[repo]`. This is the
  one part of the corpus with an unavoidable ongoing cost and an obvious
  ongoing value. If any part of this project ever earns recurring
  revenue, it is this.
- **A mock exam under time.** A nameable object, and one Turkish students
  already have a category and a budget for (*deneme*).

### 2.6 Why this one, on this product specifically

Three reasons, each tied to something in the repo rather than to
freemium orthodoxy:

**The mistake book only becomes valuable after a learner has been wrong a
lot.** It is the app's best mode and it has a warm-up period. Every
design in §2.1–§2.4 interrupts precisely that accumulation — with a lock,
a cap, or a clock — and each of them therefore prevents the app from ever
demonstrating the thing that would justify paying for it. Free-forever is
the only shape where the paywall arrives *after* the app has proved
itself.

**It builds the highest-intent purchase moment the product can
construct**, and builds it out of the corpus rather than out of a timer.
The learner has done the four items in a category, has been wrong twice,
has read the lesson, knows this is their weak spot — and the app says
*there are six more of these.* That is a purchase the learner initiates.
Nothing in §2.1–§2.4 produces a moment that good.

**It is the only reading of the promise that survives friend-of-a-friend
distribution.** "Kesinlikle önemli bir bölümü ücretsiz" is satisfied by a
fraction, technically. But the distribution channel is a student sending
a link to a group chat, and what a group chat can carry is *a complete
thing that works*, not *a sampler*. The free tier is not a marketing
concession here. It is the product's only means of travel.

**One rule to write down now, while it is cheap:** the free corpus is
never thinned to make the paid tier look better. The pressure to do that
arrives in the first month with two sales, it is always available, and
taking it converts the app from generous to grudging in one release.
Depth is added above the free line; nothing moves below it.

---

## 3 · One-time versus subscription

The two apps have opposite shapes and should have opposite models. This
is one of the few questions in the brief with a clean answer.

### 3.1 App 1 — one-time. Not close.

**The product's shape is a deadline.** The exam is sat once. The app's
value goes to approximately zero the day after, by design and honestly —
`docs/roadmap.md` refuses streaks and score-that-goes-up precisely
because it is not trying to be a habit.

A subscription on a six-week need is **a cancellation with extra steps**,
and the specific damage is the timing: the cancellation happens *during
or just after exam week*, when the learner is most stressed and least
charitable. You get one month of revenue and an interaction that ends
badly. At a plausible 89 TL/month, one month nets him about 53 TL against
162 TL for the one-time unlock — **a third of the revenue and a worse
experience** `[estimate]`.

**The cost structure agrees.** The prompt names the failure mode of a
one-time unlock as a slow bleed on an app that costs money to run every
month. That failure mode does not apply here, and the reason is written
into `CLAUDE.md`'s non-negotiables: no backend, no accounts, no
analytics, static hosting on GitHub Pages. **The marginal cost of one
more user is zero.** There is nothing to bleed. A one-time unlock is
exactly the right instrument for an asset with no running cost.

The one thing that *does* cost money every month is **new content**, and
that is what §2.5's extras are for. If reading passages become a
replenished supply, sell them as **packs, one-time each**. A student
buying a pack in April is buying a book. A student subscribing in April
is signing up for a thing they intend to cancel in June.

### 3.2 App 2 — recurring, but it has to be earned

**A habit product with no deadline.** Its whole promise is that it is
still there in March. That is what recurring pricing is for, and the
brief is right that the payment habit abroad supports it.

It is also the app that genuinely has a monthly cost. "Slightly more of
an online platform" means some server, but the larger recurring cost is
content: a product whose promise is *still useful next year* consumes new
material forever. **A one-time unlock here is the slow bleed** — every
customer keeps consuming content that costs money to produce, against
revenue that arrived once, years ago. It looks fine for eighteen months
and then it does not, which is exactly why lifetime deals kill small
apps.

But a subscription has to survive the day it renews, and the test is
blunt: **what shipped this month?** If the answer is "nothing," the
subscription is a rental of a static asset and the learner is right to
cancel. So:

> **A subscription on App 2 is a promise to keep writing.** The pipeline
> costs six to eight minutes of supervisor attention per item
> `[repo]`. That promise is a commitment about his own evenings, not a
> pricing decision.

If he is not prepared to make that commitment, sell App 2 one-time too,
and sell it smaller.

**A middle path worth naming: annual-first.** One price, once a year,
presented as *a year of access* rather than as a monthly plan. It reads
to the buyer like a purchase, it renews like a subscription, and it
survives a quiet month. It is also much better suited to markets where
recurring card mandates are unpopular — which includes Türkiye, and
therefore includes App 1's audience if App 2 is ever sold there.

### 3.3 The failure modes, stated plainly

| Wrong choice | What happens |
| --- | --- |
| Subscription on App 1 | Revenue caps at one month per customer. The cancellation lands in exam week. The best word-of-mouth moment becomes a cancellation flow. Roughly a third of the one-time revenue. |
| One-time on App 2 | Every customer keeps consuming content produced monthly against revenue booked once. Fine for a year and a half, then structurally unfixable without breaking a promise to existing buyers. |

---

## 4 · Price, in the market he is actually in

### 4.1 The reference prices in a Turkish student's head

All `[search]`, all September 2026, all volatile:

| Anchor | Price | 270 TL is… |
| --- | --- | --- |
| Net minimum wage, 2026 | 28,075 TL/month | **0.96% of a month**; about a third of a day |
| English course / dershane program | 9,200–42,500 TL | **2–3% of one course** |
| Private English lesson, one hour | 650–1,600 TL | **17–40% of one hour** |
| Duolingo Super, annual plan | ~53 TL/month (~329 TL/yr) | **5 months** of Super |
| Duolingo Super, a Turkish App Store rung | 139.99 TL | **1.9×** |
| Spotify Premium, individual / student | 135 / 99 TL per month | **2 months** |
| Netflix, individual / student | 99.99 / 52.99 TL per month | **2.7 months** |
| YDS/YÖKDİL books | from ~36 TL; sets not verified | several books |
| YouTube | 0 TL, abundant | ∞ |

### 4.2 The verdict

**270 TL is above the reference price in their head, but by a survivable
margin and for the right reason.**

The reference set splits cleanly into two shelves and the app can be put
on either:

- **The app shelf.** What a Turkish student pays for software on their
  phone is 50–150 TL, and the rungs they recognise are Spotify at 135,
  Netflix at 100, Duolingo at 140. On this shelf **270 TL is
  expensive** — nearly two Spotify months for something they have never
  heard of.
- **The exam-prep shelf.** What they pay to pass a proficiency exam is
  thousands: a course is 9,200 TL at the bottom end, a single tutor hour
  is 650. On this shelf **270 TL is not a price, it is a rounding
  error**, and the objection will not be the money.

**So the pricing problem is a presentation problem, not a number
problem.** If the store listing reads as a study app, 270 TL is hard. If
it reads as *preparation for the İYS specifically* — named, with the
section-by-section coverage the app already computes and the omissions it
already admits — then the comparison the buyer makes is *one tutor hour,
or this*, and 270 TL wins that comparison so completely that arguing
about 20 TL either way is wasted effort.

Four practical notes:

1. **Check it against Apple's actual Turkish rungs.** Apple sells at
   fixed price points, so the real price will be something like 249.99 or
   279.99 rather than 270. **Unverified — the current Turkish ladder was
   not obtainable in this session.** If a rung sits near 249, take it:
   it costs him about 13 TL net and it is materially easier for a
   student, because it reads as *two-hundred-and-something*.
2. **Use a launch price for the first cohort, not a discount later.** His
   first buyers are his friends. A discount three months after launch
   punishes exactly the people who took the risk. If the price is going
   to move, move it up.
3. **Do not price App 1 monthly** — §3.
4. **Do not chase seasonal elasticity.** The same 270 TL is cheap in
   April and expensive in September. The temptation is a seasonal price;
   the better answer is a flat price and a free tier that does the
   September work. The free app acquires the September learner; the exam
   calendar converts them in April without him touching the price.

### 4.3 What happens in another storefront

For App 2, and stated precisely, because the brief gets this half right:

> **The localisation problem is not translation. It is that the same
> number means something different in each storefront.**

$4.99/month is a coffee in the US. At 48.4 TL/USD it is ~242 TL in
Türkiye — **more than Spotify Premium and Netflix individual combined**,
and roughly 0.9% of net minimum wage *every month*. In Egypt, Pakistan or
Indonesia it is a serious monthly commitment — and those are exactly the
markets with the largest audiences for "improvement, not learning"
English apps.

The consequence: **App 2 needs per-storefront prices set by hand against
local anchors**, not one number Apple converts. The anchor is not the
dollar; it is *what the learner in that country already pays for Spotify,
Netflix or Duolingo*, because that is the shelf the app lands on. A
serviceable rule of thumb: price App 2 at about **one local Spotify
Premium individual**, then check every storefront manually.

Two riders:

- **Purchasing-power pricing invites store-switching arbitrage.** At this
  scale it is a leak to know about, not a problem to solve. Solving it
  costs more than it recovers.
- **Every extra country multiplies §5.** Support burden scales with time
  zones and languages, not with revenue. A deliberately short country
  list at launch is a pricing decision as much as a marketing one.

---

## 5 · The thing he has not asked about

Taking money creates an obligation the free app does not have, and it
arrives on a schedule that is knowable in advance. It should be costed
before it exists.

### 5.1 Refunds — he does not control them

On the App Store the developer does not decide refunds. Apple reviews the
request against its own criteria; the developer is often not consulted,
and the proceeds are reversed `[search]`. (Exact windows and
developer-consultation rules are `shipping.md`'s territory and should be
verified there.)

For a one-time unlock sold to students under deadline pressure, the
refund pattern is predictable and specific:

> **Buy in April. Sit the exam in May. Ask for a refund in June.**

Nothing in the mechanism prevents it. The practical consequence is a
cash-flow rule rather than a policy: **assume some fraction of each
cohort's revenue evaporates weeks after it lands, and never spend the
money in the month it arrives.**

Turkish consumer law adds a second layer and mostly helps: the 14-day
right of withdrawal (*cayma hakkı*) generally does not extend to
services performed instantly in an electronic environment or to
intangible goods delivered instantly `[search]`. That protects him from a
statutory return — but Apple's policy is what actually governs the
transaction, and Apple is more generous than the law requires.
**Unverified, and a lawyer's question rather than this session's.**

### 5.2 Support — the obligation, and when it lands

The app already has the reporting half: `js/report.js`, *"Bu soruda bir
sorun var"*, with a share. What changes when money changes hands is the
other end of that channel.

A free user who finds a bad item sends a bug report. **A paying user who
finds a wrong answer at 23:40 the night before the exam is not sending a
bug report — they are sending an accusation, and the corpus's own history
says they may well be right.** The review passes found roughly one item
in twelve carrying a second defensible answer before repair, and five of
six repairs introduced a new defect that only an independent re-audit
caught `[repo]`. The learner `CLAUDE.md` describes is exactly the person
whose ear produces the counterexample.

The obligation is not *answer at midnight*. It is **have the answer ready
before midnight**. Five things, none of which cost money, all of which
cost less now than later:

1. **A stated channel and a stated response time.** One address, and one
   sentence: *I answer within 48 hours, and I am one person.* Underpromise
   deliberately. A student who knows the answer comes tomorrow does not
   email three times tonight.
2. **A visible erratum path.** The report mechanism exists; what is
   missing is the other end of it — a short page in Profil, beside the
   roadmap that already ships there, listing what was reported and what
   happened to it. That converts *the app is wrong* into *the app is
   honest*, which is the entire brand and criterion 3 of v1.
3. **A content-update mechanism that does not need App Store review.**
   This is architecturally load-bearing and it is a pricing question in
   disguise. Content is JSON and there is already a service worker and a
   content cache. If a wrong item can only be fixed by shipping a build
   and waiting for review, it stays wrong for days during the one week it
   matters. **Decide before launch whether the paid app fetches content
   or embeds it**, because that decision determines whether the promise
   in (1) can be kept.
4. **A refund posture, written down in advance.** He cannot grant App
   Store refunds, but he can decide now what he does when asked — the
   good answer being *help them get one from Apple* rather than argue.
   Deciding it in advance is free. Deciding it at 23:40 is not.
5. **An exam-week rule.** The week of maximum email is the week of
   minimum available attention, because he or his partner is sitting the
   same exam. Either pre-commit to a lighter window that week and say so
   in the app, or arrange coverage. **Two people is exactly the right
   size for this, and he already has two** — this is the first concrete
   thing the second person is for.

**Costing it.** At one support email per ten paying users over a cohort's
life, at ten minutes each, 150 buyers is about **15 emails and 2.5
hours** `[estimate]`. The volume is nothing. The cost is the **on-call
obligation** — six to eight weeks of not being able to ignore the phone,
landing on precisely the weeks he most needs to be studying. Price it in
evenings, not lira.

### 5.3 One more he has not asked about

**The two-person split, before there is anything to split.** The brief
says he is not alone and names a partner. Money makes co-ownership
concrete, and the cheapest moment to write it down is while it is
hypothetical. Three specifics, all of which interact with §1:

- **Whose Apple Developer account is it?** The Small Business Program
  requires the applicant to be the Account Holder, and proceeds across
  associated accounts are combined `[search]`.
- **Whose bank account receives the proceeds?** The GVK mük. 20/B
  exemption attaches to a person, a certificate and a dedicated account
  `[search]`. It is not divisible by agreement after the fact.
- **What is the split, and what does it apply to** — revenue, or revenue
  net of the subscription and the developer fee?

Five minutes now. Expensive later.

---

## 6 · Summary of the recommendation

| Question | Answer |
| --- | --- |
| Does his arithmetic clear his bar? | **Yes**, at 150 sales — it covers the store fee and about four months of Max 5x. Not a year of it. |
| Net per sale at 270 TL | **~163 TL** with the Small Business Program and the Turkish exemption; ~134 TL without either. Enrol in both. |
| Cost per shipped question | Negligible on a subscription; **$4–12 at API rates** `[estimate]`. The project's economics depend on the subscription. |
| Cost per shipped question, in evenings | **6–8 minutes** of supervisor attention `[repo]`; ~110–130 hours to v1 from here. Effective wage ~190 TL/hour against 650–1,600 for tutoring. |
| Break-even | **30 sales** for the developer fee. **~150** for his stated bar. **~400** for a year of heavy tooling. |
| The fragile input | Not the commission, the VAT or the price. **"150 people"** — reach or paying? |
| Free tier | **Free forever, paid depth.** Every lesson and the whole v1 question corpus free; items 5–10 per category, reading passages and a timed mock paid. |
| App 1 model | **One-time unlock.** Zero marginal cost, deadline-shaped demand, no bleed to fear. |
| App 2 model | **Recurring — annual-first — and only if he commits to shipping content monthly.** Otherwise one-time and smaller. |
| Price | **Keep ~270 TL**, snap to Apple's nearest lower rung. It is expensive on the app shelf and negligible on the exam-prep shelf; the listing decides which shelf it is on. |
| Other storefronts | Per-country prices set by hand against the local Spotify/Netflix/Duolingo rung. The same number is a different amount of money. |
| Before taking money | A stated support window, a visible erratum page, a content-update path that skips App Store review, a decided refund posture, an exam-week rule, and a written split with his partner. |

---

## 7 · What must be re-checked before he prices anything

Dated **2026-09-05**. `WebFetch` was blocked in this session; everything
below is a search summary and nothing was read at its source.

**Two of these are for a professional, not for a search index.**

| # | Figure used | Verify |
| --- | --- | --- |
| 1 | App Store Small Business Program: 15%, up to $1M prior-year proceeds, new developers qualify, Account Holder must apply, associated accounts combine | Apple Developer — Small Business Program page. Confirm the rate, the ceiling and that enrolment is still annual and manual. |
| 2 | Turkish KDV on electronic services: **20%**, collected and remitted by Apple, commission charged on the VAT-exclusive base | Apple's tax and price schedules for the Türkiye storefront. **The 18% figure still widely quoted online is from 2018 and is wrong.** |
| 3 | **GVK mük. 20/B**: exemption for mobile app developers; 2026 ceiling **5,300,000 TL**; **15% final withholding** at the bank; requires an *istisna belgesi* and a dedicated Turkish bank account; no company needed | **A YMM or SMMM. Not a search result and not this document.** Specifically: do App Store proceeds paid from abroad qualify as-is, must the certificate precede the first payment, and what happens to income received before it issues. |
| 4 | 270 TL sits between Apple's Turkish price rungs | The current Türkiye price-point ladder in App Store Connect. Not obtainable here. |
| 5 | Apple Developer Program **$99/year** | Whether it is billed in USD or TL, and the current TL amount. |
| 6 | **USD/TRY 48.4** (2026-09-04) | Every dollar figure in §1 moves with this. Re-run the tables at the spot rate on the day. |
| 7 | Claude plan pricing — **Pro $20/mo, Max from $100/mo**, Claude Code sharing the plan's usage pool | claude.com/pricing, and whether his plan's weekly limits actually sustain the pipeline's throughput. |
| 8 | App Store refund windows; developer not consulted; proceeds reversed | Overlaps `shipping.md` — verify there rather than twice. |
| 9 | Competitor prices: Duolingo Super ~53 TL/mo annual and a 139.99 TL rung; Spotify 135/99; Netflix 99.99/52.99; courses 9,200–42,500 TL; tutoring 650–1,600 TL/hr; net minimum wage 28,075 TL | All of these move several times a year in Türkiye. Re-check the month he lists. |
| 10 | 14-day *cayma hakkı* does not cover instantly delivered digital content | **A lawyer.** Whether the exception covers an in-app purchase specifically. |

**And two things to measure rather than look up**, because they decide
more than any rate above:

- **The funnel.** How many people hear about it, how many install, how
  many pay. §1.4. Everything else here is arithmetic; this is the
  forecast.
- **Which reading of the bar he means.** All AI spend charged to the app
  (break-even ~150 sales), or only the marginal spend (break-even 30).
  The two answers are thirteen times apart and only he can choose.
