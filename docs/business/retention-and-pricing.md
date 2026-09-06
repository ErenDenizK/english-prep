# Coming back, and paying for it

2026-09-06. Three decisions arrived before this document did, and it
treats all three as settled: **App 2 goes wide** — English for learners
anywhere, positioned as a higher-level, more instructive Duolingo for
people who already function in the language and were never taught the
scaffolding; **App 2 may use notifications**, unlike App 1, which
refused them; and **App 2 carries a subscription at a reasonable price,
whichever the market accepts more.**

So the questions here are *how*, not *whether* — with one exception. §D
was asked as a direct question and it gets a direct answer, because the
owner's own product model contains a stopping rule and a subscription's
economics want people not to stop. Refusing to answer that would be the
one useless thing this document could do.

What it deliberately does not re-derive: the boundary model and its
"done exists and is countable" argument (`vision.md` §3); the
content-cadence objection to subscriptions (`two-apps.md` §5.4); the
competitive shape of the category and the ceiling of hundreds rather
than thousands (`two-apps.md` §3); the free-tier design and the Turkish
price arithmetic (`pricing.md` §2, §4). Where this document disagrees
with those, it says so in §E rather than quietly overwriting them.

---

## 0 · What could and could not be verified

**Nothing in this document was read at its source.** `WebFetch` is
blocked by the network egress proxy in this session, and so is `curl` —
every HTTPS connection outside the tool allow-list returns a 403 from
the proxy. What worked is `WebSearch`, which returns titles, URLs and a
model-written summary of the results. That is a weaker instrument than
it looks: it can and does compress conflicting figures into a single
confident sentence.

| Tag | Means |
| --- | --- |
| `[S]` | From a search summary. The URL is in §F. **Not read at source.** |
| `[?]` | Unverified, internally inconsistent across summaries, or a figure whose provenance I could not establish. |
| `[≈]` | My own reasoning or arithmetic, built on tagged inputs whose assumptions are stated next to the number. |

Two whole classes of claim in here rot fast. **Platform behaviour**
(iOS web-push requirements, Chrome's permission heuristics) changes with
every browser release. **Prices** in this category change several times
a year and the whole language-app market is drenched in permanent
discounting, so a list price and a street price are different numbers.
§G is the re-verification list, dated.

---

# A · Notifications, the mechanics

## A.1 The iOS requirement chain, and what it costs in reach

Web push on iOS exists, and it is gated behind a chain of conditions
that each cost users:

1. **iOS 16.4 or later** (March 2023) `[S]`. Effectively a non-issue by
   2026.
2. **The site must be installed to the Home Screen from Safari's Share
   sheet.** A page open in a Safari tab has no access to `PushManager`,
   and neither does Chrome or Firefox on iOS `[S]`. As of iOS 26 a site
   added to the Home Screen opens as a web app by default even without a
   manifest, but push still requires the manifest and the install `[S]`.
3. **There is no install prompt.** Safari will not offer it; the app has
   to teach the gesture in its own UI `[S]`.
4. **Permission must be requested from a user gesture** `[S]`.

The reversal worth knowing: Apple's plan to break Home Screen web apps
in the EU under the DMA was **abandoned on 2024-03-01**, and iOS 17.4
shipped with them intact `[S]`. The claim still repeated in vendor blogs
that "push notifications are not available in EU countries" is stale
`[?]`.

**The cost of step 2 is the whole ballgame.** One agency measurement
puts Home Screen installs at **under 2% of users** across its client
sites `[S]`; other sources quote 70–80% figures that are plainly stated
preferences rather than behaviour `[S]`. Take the low number as the
default and the high ones as marketing. Then multiply by opt-in:

> installed to Home Screen (2–15%) × grants permission (44–56%)
> ≈ **1–8% of iOS users reachable** `[≈]`

**And there is a reliability problem on top of the reach problem.**
Apple's developer forums carry recurring reports that a PWA's
`PushSubscription` silently expires — endpoints disappearing without
warning after a week or two, or after a period of inactivity `[S]`. For a
product that sends *at most one message a week*, that is close to
disqualifying: the failure mode is "you have not been active, therefore
your subscription is gone, therefore you cannot be reminded." The one
message the design most wants to send is the one least likely to arrive.

Safari 18.4's **Declarative Web Push** delivers a notification from a
JSON payload without a service worker `[S]`. It simplifies the client. It
does not remove the server.

## A.2 Android and Chrome

Materially easier, and the differences matter to the design:

- Chrome on Android supports web push **from an ordinary tab** — no
  install required — and from an installed PWA `[S]`.
- **Android 13 (API 33) and later require the `POST_NOTIFICATIONS`
  runtime permission, off by default** `[S]`. Chrome mediates this for
  web content, so a web-push grant on Android 13+ can be two dialogs
  deep rather than one.
- **Chrome punishes bad asking, permanently.** Sites with very low
  accept rates are auto-enrolled in a "quieter" permission UI, and since
  Chrome 84/86 sites detected sending abusive content are enrolled
  automatically `[S]`. Since late 2025 Chrome also **auto-revokes**
  notification permission for sites with low user engagement and high
  send volume `[S]`. This is a live constraint, not a hypothetical: a
  poorly-timed prompt does not just fail once, it degrades the app's
  ability to ask again.

Historical Android opt-in was 85–91%; recent figures show it falling to
**around 67%** as Android 13's runtime permission propagates, against
iOS at **43.9–56%** `[S]`. The summaries conflict on the exact numbers
`[?]`; the direction is consistent across all of them.

## A.3 What a notification actually needs on the server, and whether it can stay free

Web Push has three parties: the app's page (subscribes), a **push
service** run by the browser vendor (Mozilla, Google's FCM, Apple), and
an **application server** that signs and posts messages. The push
service is free and is not yours. The application server is `[S]`:

- a **VAPID** keypair identifying the sender;
- **storage for every subscriber's endpoint and encryption keys**;
- something that wakes on a schedule and POSTs an encrypted payload per
  endpoint.

The code is small — `web-push` on Node does it with no Firebase project,
no SDK, no sender id `[S]`. The free tiers are real: FCM is free with a
Firebase project, OneSignal's free tier is quoted at 10,000 subscribers
`[S]`. A cron on a free serverless tier plus a key-value store would
cost nothing at this scale `[≈]`.

**And it still breaks two non-negotiables at once, one of which is not a
technical rule.** It creates a server that must stay alive for the app to
work as promised — the property `README.md` calls "guard the zero running
cost… it cannot leak what it does not hold." And it creates, for the
first time, **a per-person record held by him**: an endpoint identifying a
browser on a device, plus keys, plus a schedule. Under KVKK and GDPR that
is personal data with a controller, a lawful basis, a retention period
and a deletion path. The real cost is not the hosting bill; it is the
first time somebody emails asking what he stores. `[≈]`

**Local, scheduled notifications with no server at all:**

- **The web has no reliable answer.** The Notification Triggers API
  (`TimestampTrigger` / `showTrigger`) does exactly what is wanted —
  schedule a notification in advance, delivered by the OS with no
  network — but it is Chrome-only and has lived in origin-trial limbo
  for years, with no Safari implementation `[S]`. Its current status
  needs checking before anyone plans on it `[?]`. It is not a foundation.
- **A native wrapper has a complete answer.** Capacitor's Local
  Notifications plugin schedules on-device notifications with no server
  `[S]`. This is a solved, boring, cross-platform capability.
- **A Trusted Web Activity is not that answer.** Bubblewrap and
  PWABuilder wrap a PWA in an Android APK `[S]`, but a TWA is still the
  web engine: it inherits web push and does not give web code local
  scheduling. TWA solves distribution, not notifications.

## A.4 The finding this section exists to produce

The owner's notification model is *"N boundaries are ready to look at
again."* That fact is **known to the device** — answers, boundary states
and the review schedule all live in `localStorage`, and no server knows
or needs to know any of it. Web push is the wrong instrument for a
device-known fact: it makes him build a server so that the server can be
told something the phone already knew, in order to tell the phone.

> **Web push is for facts the server knows. Local notifications are for
> facts the device knows. This product's notifications are, with one
> exception, device-known facts — so they should be local.** `[≈]`

The exception is *"M new boundaries shipped"*, which is genuinely
server-side. It is also cheaply faked without push: the app already
fetches static JSON with a network-first service worker, so on any open
it can notice new content and schedule a **local** notification for the
next reminder slot. That is one extra `if`, no server, no endpoints, no
personal data.

The consequence for the roadmap is pleasant, because a wrapper is already
assumed: `two-apps.md` §6 costs a store binary at "~2–4 evenings of
wrapper + a review cycle + $99/yr" for the paid unlock. **If App 2 ships
wrapped for the same reason App 1 does — to take money — notifications
arrive as a side effect, with no server, no per-user data, no delivery
problem, and 20–40× the iOS reach of the PWA path** `[≈]`. If App 2 ever
ships as pure web, the recommendation is no notifications at all rather
than a server.

## A.5 Permission: when to ask, and what it is worth

The single highest-leverage mechanic in this whole section:

- A bare system prompt converts at **30–40%**; a **soft ask** — an
  in-app explanation shown at a moment of demonstrated value, with the
  OS dialog raised only if the learner says yes — converts at
  **55–70%**, a reported 2–3× improvement `[S]`.
- **Timing beats copy.** Ask after a value moment, not during
  onboarding; small changes in timing move opt-in by tens of points
  `[S]`.
- The soft ask has a second, larger benefit that the vendor blogs
  undersell: **a "no" to a soft ask is free**, whereas a "no" to the OS
  dialog is permanent on iOS and, on Chrome, feeds the quiet-prompt and
  auto-revocation heuristics (§A.2).

Applied here, the value moment is not the first quiz and not the first
correct answer. **It is the first boundary closed** — the first time the
app can say a true, specific, personal thing: *you used to smear
`must` / `have to`; you don't now.* That is the only moment at which
"shall I tell you when others come due?" is a sentence about the learner
rather than about the app. `[≈]`

## A.6 Do reminders cause return, or uninstall? Both, and the doses differ

The efficacy evidence is real but smaller than the marketing implies:

- A micro-randomised trial on a workplace well-being app (n=1255) found
  users **3.9% more likely** to engage in the next 24 hours when a
  tailored message was sent (RR 1.039, 95% CI 1.01–1.08) `[S]`. That is
  the cleanest causal estimate I found and it is a small effect.
- A stress-management RCT (n=77) found intelligent and daily
  notifications beat occasional ones on viewing and acting, d ≈ 0.43–0.50
  `[S]`; a mobile learning app reported D1 retention **51% vs 44%**, D7
  **29% vs 24%** `[S]` (vendor-sourced).
- A 9-week mobile-assisted language-learning RCT (n=150) reported daily
  practice adherence of **82%** with push, **67%** self-scheduled, **49%**
  control `[S]`. `[?]` — venue and peer-review status not established,
  and the effect is far larger than the trials above; suggestive only.
- Outside learning, reminders reliably move adherence: 2.5× odds on
  chronic medication `[S]`; food logging from 12% to 63% `[S]`.

The fatigue evidence points the other way and is steeper:

- Retention at three months by daily volume: **88% at one/day, 71% at
  three/day, 54% at five/day** `[S]`.
- **71%** of users cite excessive notifications as a reason they have
  uninstalled an app; **6%** report abandoning an app after as little as
  one push per week `[S]`. These are survey numbers with the usual
  problems `[?]`, but the gradient is consistent everywhere.

**The reconciliation is the design instruction.** The marginal effect of
*one relevant, well-timed* notification is positive and small. The
marginal effect of *volume* is negative and large. There is no dose at
which notifications are a growth lever for a product like this — there
is only a dose at which they are a courtesy that does not cost anything.

That dose is low, and the low dose is what the project's values already
want. The ethical answer and the measured answer coincide here, and it is
worth saying plainly: **he gives up nothing by refusing the aggressive
version. The aggressive version does not work for a product with 400
users; it works for one with 40 million, where a 3.9% lift is a
business.**

And **he has no analytics, so he cannot tune the dose.** Duolingo's
bandits `[S]` are unavailable to him not because he refuses them but
because he has no feedback channel. A product that cannot measure fatigue
must pick a dose that is safe unmeasured — the floor, not the ceiling.

---

# B · The design question: is the owner's test defensible?

The test proposed:

> **A notification is acceptable if it states something that would still
> be true and useful if the app had no interest in your returning.**
> *"4 boundaries are ready to look at again"* passes. *"Your streak is at
> risk"* fails.

**The reject half is very well supported. The accept half is not a test
yet — it is a necessary condition wearing a sufficient condition's
clothes.** Below: what holds it up, then four ways it breaks, then a
repaired version.

## B.1 What supports it

**Self-determination theory gets the mechanism right.** The relevant
finding is not the general one about autonomy but the specific one about
reminders: giving users control over *when* they are reminded supports
autonomy and thereby motivation, because users know when they can
actually act — while reminders imposed by the system can be **perceived
as surveillance and undermine autonomy and intrinsic motivation** `[S]`.
So the axis that matters is not friendly-vs-harsh phrasing. It is
**whose schedule is being served.**

**Reactance theory explains why the streak message fails specifically.**
The more overtly a message commands, and the more obviously it is
engineered to provoke guilt or fear, the stronger the reactance — people
reject the message *and* the product `[S]`; a 2015 study found the
guiltier students felt after a message about taking school seriously,
the more likely they were to dismiss it `[S]`. "Your streak is at risk"
is a loss-framed guilt appeal about a fact the app invented. It is
almost a laboratory stimulus for reactance.

**The gamification literature supports the distinction between reporting
state and manufacturing score.** A recent meta-analysis finds
gamification improves intrinsic motivation, autonomy and relatedness but
has **minimal impact on competency**; that points and badges *used as
controlling mechanisms* undermine developing intrinsic interest, while
mechanics giving competence feedback and meaningful choice sustain
engagement; and that short interventions look strong because they are
new, then decay `[S]`. "4 boundaries are ready" is competence feedback.
"Your streak is at risk" is a controlling mechanic.

**Duolingo's own record is the strongest single piece of evidence, and it
argues against streaks as a *retention* device on this project's
timescale.** Their former head of growth: streaks make people come back,
**and losing a streak is a big reason people quit** `[S]`. Qualitative
work reports a "motivational shift from active learning to merely
maintaining the daily streak," and users doubting a high streak indicates
better understanding `[S]`. Duolingo absorbs that trade because the
quitters are replaced. A 400-user app cannot.

**And the passing message has a working precedent in exactly this
shape.** AnkiMobile's reminder is "notify me at a time of day when I have
due cards" `[S]` — a state, learner-scheduled, absent when untrue. That is
the owner's message, already shipped, in the least gamified product in the
category.

## B.2 Where the test breaks

**1. Truth does not constrain selection, and selection is where the
manipulation lives.** "4 boundaries are ready" is true. So is "0
boundaries are ready — don't open the app today", and "you have not
opened this in five weeks and appear to have stopped". The app will
never send the second or third. A test that filters individual messages
for truth, applied to a policy that chooses *which* true things to say
in order to maximise return, licenses exactly the optimisation it means
to forbid — this is precisely the seam Duolingo's bandit algorithms
occupy `[S]`. **The test constrains messages; it needs to constrain the
policy.**

**2. The fact can be manufactured, and then truth is free.** If the app
decides when a boundary "comes due", then *"4 are ready"* is exactly as
invented as a streak. A streak is not disqualified by being false — a
streak is perfectly true — it is disqualified by being a quantity the
app created so that it would have something to report. The
distinguishing property is not truth; it is **whether the fact would
still exist under a different, equally good implementation of the same
pedagogy.** A review interval derived from a memory model survives that
question. An interval tuned until daily actives go up does not.

Here the project gets lucky: **with no analytics he literally cannot
tune the schedule against engagement.** A constraint he adopted for
other reasons defends this value for him. It is worth writing that down
before the first time someone suggests adding analytics "just to see if
the reminders work."

**3. It says nothing about frequency, and frequency is what actually
kills.** Every message in a stream of five a day can pass the test, and
the stream still takes retention from 88% to 54% `[S]`. Volume is an
independent axis and needs an independent axiom.

**4. "Useful if the app had no interest in your returning" is too easy
to satisfy.** Almost any true fact about your own data clears that bar.
The version with teeth is stronger and narrower: **would this change
what you do today?** A due-review count changes what you do today. "You
have closed 43 boundaries" does not — it is true, it is about you, and
it is a score with extra steps.

**5. It has no stopping condition, which is fatal for this product
specifically.** The whole claim of the boundary model is that a learner
can finish. A learner who has finished, and who has moved on, will keep
receiving "4 are ready to look at again" forever, each one individually
passing the test. An app with a stopping rule needs the stopping rule to
reach the notification layer.

## B.3 The repaired test

Four axioms, of which the owner's is the first:

1. **Content.** A notification may only state a fact about the learner's
   own material that would still be true and useful if the app had no
   interest in their returning — *and* that changes what they might do
   today.
2. **Policy.** The app must be willing to send the message that loses
   it the session. If it can never say *"nothing is due, and I am not
   going to invent something"*, or *"you appear to have stopped and I
   will stop too"*, then axiom 1 is decoration.
3. **Provenance.** Every fact a notification reports must come from a
   rule that is visible to the learner and that the app does not tune
   against engagement. Review intervals are pedagogy, published; they
   are not a growth surface.
4. **Rate.** A ceiling set before the first message is written, not
   discovered afterwards. Default: **one per week, at a time the learner
   chose**, never more than one per day, and none at all when nothing is
   due.

Axiom 2 is the one that does the work, and it is testable in the crudest
possible way: **a stranger reading the app's source should be able to
find the code path that sends nothing.**

## B.4 What that produces, concretely

Three messages. Not a vocabulary that can be extended later — three.

1. **Due.** *"N boundaries are ready to look at again."* Sent only when
   N ≥ 3, only in the slot the learner picked.
2. **New supply.** *"M new boundaries shipped."* Sent only when true,
   scheduled locally when the app notices new content.
3. **Finished.** *"You have closed everything currently here. I will
   stop reminding you until there is something new."* Sent once, then
   silence.

The third is the whole argument. No engagement-optimised product would
ever ship it, it costs sessions, and it is the only one of the three
that proves the other two are honest. It is also the notification form
of `vision.md` §3's claim that this product can finish — and if the
notification layer cannot say the product's central claim out loud, the
claim is marketing.

**Defaults, stated as decisions:**

- **Off.** No notification is ever sent to someone who did not turn them
  on, and the app works completely without them.
- **The learner picks the day and hour before the OS dialog is raised**
  — this is the autonomy finding `[S]`, and it also removes the
  timezone question from any server that might exist.
- **The soft ask fires after the first boundary is closed**, never in
  onboarding (§A.5).
- **A visible, permanent statement of the cap** in the settings screen —
  "at most one a week; none when nothing is due" — which is a promise a
  learner can check.
- **No mascot, no guilt, no second person imperative, no "we".** Reactance
  `[S]` is the mechanism; the copy rule is that a notification says what
  is true about the learner's material and stops.

**Where I would be wrong.** If it turns out that nobody ever enables
notifications at all — plausible at a default-off, once-a-week,
soft-asked, deliberately unexciting design — then this entire section
bought nothing and the honest conclusion is that App 2's return problem
was never solvable by notification. That is a real possible outcome, and
it is cheap to discover: ship it default-off with a single settings
toggle, and if the toggle is unused, delete it rather than escalate it.

---

# C · Monetisation: what the market actually accepts

## C.1 The shelf, in dollars

Prices as of 2026-09-06, all `[S]`, all list rather than street — this
category discounts permanently and Black Friday is a structural event in
it, not a promotion.

| Product | Monthly | Annual | One-time / lifetime | Free tier |
| --- | --- | --- | --- | --- |
| Duolingo Super (US) | $6.99 | ~$96 | — | Yes, ad-supported, full course |
| Babbel | $14.99 (some sources $17.95 `[?]`) | ~$95.88 ($7.99/mo) | **$249–299 list, $129–169 street** | Effectively none |
| Busuu | ~$6–15 depending on tier and term | annual ≈ $5–7/mo | **None** | Yes, limited |
| LingQ | $10 (Premium), $36.99 (Premium Plus) | ~33% off annual | — | Yes, limited |
| Speak | $17.99 | $83.99–$99 `[?]` | — | Not established `[?]` |
| ELSA Speak | from ~$13.33 | — | — | Free-forever plan |
| Pimsleur | $19.95 (1 language) / $20.95 (all) | — | **$475 list, ~$300 street** | Trial only |
| AnkiMobile (iOS) | — | — | **$24.99, funds the whole project** | Desktop/Android free |

Two benchmarks to put alongside them, both `[S]` from RevenueCat's *State
of Subscription Apps 2026*: **Education's median annual price is
$44.99** — the highest of any category — and Education's **month-1 median
revenue per user is $22.82**.

Reading that table, three things are true at once. **Annual is the
category's real unit** — every product's headline is a per-month number
that is only available annually. **Lifetime exists and is normal**, at
Babbel and Pimsleur, at roughly 2.5–5× the annual price, and permanently
discounted. And **Anki is the existence proof for the shape this project
actually is**: a finite, respected, unmarketed tool funded by a single
$24.99 purchase that pays for full-time work on a free ecosystem `[S]`.

## C.2 The number that should change the plan: regional prices

`pricing.md` §4.3 is right that the same number means different things
in different storefronts, and it understates by how much.

- **The stores do not do regional pricing. They do FX conversion** at
  the storefront's daily rate `[S]`. Apple offers ~900 price points
  across 175 storefronts and 44 currencies, and a "Custom Price Change"
  per region — but the default behaviour converts a base price, which is
  why a $19.99 base arrives as ₹1,899 in India where PPP-adjusted would
  be ~₹659, and R$129.90 in Brazil against a PPP-adjusted ~R$49.50
  `[S]`. Developers commonly cut 80–85% in those markets `[S]`.
- **Duolingo, who can measure this better than anyone, prices Turkey at
  roughly $0.63–0.66/month and India at $0.93/month against $6.99 in the
  US, with a global average of $4.81 across 46 storefronts** `[S]`. One
  summary gives the Turkish annual as about $14 `[S]`; another quotes a
  TRY 233.34 figure whose period is ambiguous `[?]`.

**So the category leader's price in Turkey is about a tenth of its US
price, and about $14 a year.** That is the shelf App 2 lands on when it
goes wide, and it has two consequences that are more important than any
price he picks.

**First, and I disagree with `pricing.md` §4.3 here:** its rule of thumb
— price App 2 at about one local Spotify Premium individual — puts the
app on the wrong shelf in exactly the markets the audience is in. Spotify
Turkey is 135 TL/month against Duolingo Super at roughly 30 TL/month
`[S]`; read as a monthly price, that rule prices App 2 at roughly
**four to five times the category leader** in Turkey. The shelf a
language app lands on is the language-app shelf, and its anchor is
Duolingo. The Spotify anchor is right for *how much software a person
buys*; it is wrong for *what this software costs*.

**Second, the wide audience and the paying audience are not the same
people.** "Competence without labels" — the learner who got their English
from series, films and games — is concentrated in Turkey, Brazil,
Indonesia, Egypt, the Philippines, India. Those are the storefronts where
correct pricing is $8–20 a year. The US, Germany, Japan and Korea are
where $40–60 a year is normal and where this learner is rarer. That is
not a reason to avoid the wide audience; it is a reason not to model
revenue as *users × US price*. `[≈]`

## C.3 Churn, and how long a subscriber lasts

- **Yearly plans renew at 83.4%**, roughly twice the monthly rate and
  more than four times weekly `[S]`.
- **Month 1 accounts for 35% of all annual cancellations** — over a
  third of annual subscribers switch off auto-renew within the first
  month `[S]`. They still get their year; the renewal is already gone.
- **Annual subscribers retain at 33.9% after 12 months; monthly at
  13.8%** `[S]`. Annual plans reduce churn by roughly half `[S]`.
- General subscription churn averages ~5.3% monthly; below 5% is good,
  above 10% is structural `[S]`. **At 5%/month the average life is 20
  months; at 10% it is 10** `[S]`.
- **Education has the highest median weekly renewal of any category
  (58%) and ~6.5% trial conversion** `[S]` — already noted in
  `two-apps.md` §3.1, and still the most encouraging figure in the file.
- E-learning churn peaks in summer at 7.8% `[S]`. A language app has a
  season whether or not it has an exam.

And the number that decides the free-tier argument: **EdTech freemium
converts at about 2.6% free-to-paid**, against ~3.7% for freemium
generally, while **hard paywalls convert about 5× better than freemium
(10.7% vs 2.1%)** `[S]`.

That is a direct cost on `pricing.md` §2.5's *free forever, paid depth*,
and it is worth paying with the number in front of him rather than by
accident: **choosing free-forever over a hard paywall plausibly costs
four-fifths of the conversion rate.** For App 1 that is clearly correct
anyway — a free app that acquires the September learner and converts them
in April is the design. For App 2 it is a values decision costing real
money, and the right way to hold it is: the free tier is not a
conversion funnel, it is the thing he said the point was.

---

# D · The tension: a product that finishes, sold by the month

## D.1 State it without flinching

The boundary model gives the learner a stopping rule: when your
boundaries are closed, you are done. That is the "more respectable"
claim, it is `vision.md` §3's answer to the problem that App 2 has no
definition of done, and it is the reason a person might trust this app
over one with a streak.

A subscription is a bet that people do not stop. **The product's central
promise and the business model's central assumption point in opposite
directions**, and no amount of pricing cleverness makes that go away.
Every hybrid below is a way of *choosing which one to honour*, not a way
of having both.

## D.2 How things that genuinely finish are actually monetised

Four patterns, all `[S]`:

- **Sell the finish once.** Pimsleur and Babbel both run subscriptions
  *and* sell lifetime at $249–475 list. AnkiMobile sells $24.99 once and
  funds a whole ecosystem. ETS sells a TOEFL prep course at $149. When a
  thing ends, the market's answer is a price for the thing.
- **Sell consumption, not time.** LingoLeap sells credits — $20 for 30
  days, $16.60/month for three — because what a test-taker consumes is
  evaluations, not calendar `[S]`.
- **Split the finite from the ongoing.** The course-business advice is
  explicit and matches this project exactly: *sell finite outcomes once
  and charge recurring fees for continuing benefits* — support, updates,
  community — and *"trying to stretch a finite outcome into an endless
  content stream usually creates filler; students notice"* `[S]`.
- **Accept the churn and price the year.** Exam-prep apps do this,
  badly, and the summaries are blunt: one-time prep courses for specific
  exams are not well suited to subscriptions because they have a natural
  end point `[S]`.

The mirror-image warning is equally clear: a subscriber who runs out of
new content cancels, and content freshness is described as the
structural foundation of retention in subscription content apps `[S]`.
Which is `two-apps.md` §5.4's argument arriving from the other side —
and at 3–4 hours of undelegable attention per month, this project cannot
be a content-freshness business. It is not a preference. It is arithmetic
about one person's evenings.

## D.3 The arithmetic, which is smaller than the argument

Take `two-apps.md` §3.1's honest ceiling — **400 paying users, ever** —
and a corpus a diligent learner finishes in about six months. Apply a 15%
store commission (Small Business Program, per `pricing.md` §7). All
`[≈]`, on `[S]` inputs:

| Model | Assumption | Gross/user | Net/user | 400 users |
| --- | --- | --- | --- | --- |
| Monthly $6.99 | median life 5 months (below the ~10-month benchmark, because the product ends) | $34.95 | $29.71 | **~$11,900**, once |
| Annual $39.99 | 1.3 years median — one purchase, ~30% renew once | $51.99 | $44.19 | **~$17,700**, over ~2 years |
| One-time $39.99 | no renewal, ever | $39.99 | $33.99 | **~$13,600**, once |
| Annual $39.99 + lifetime $99 at 20% take | mixed | ~$61 | ~$52 | **~$20,900** |

**The spread between the best and worst model here is about $9,000 over
two years.** The spread between 400 users and 100 users — the difference
`two-apps.md` §3.4 says is the real one, because App 2 has no
distribution channel at all — is $16,000. And the spread between the
Turkish storefront and the US storefront on the *same* model is a factor
of three (§C.2).

> **At this scale the pricing model is a values decision that costs a few
> thousand dollars, and reach is the decision that costs everything.**
> Anyone spending a week choosing between subscription and one-time is
> optimising the third-most-important variable. `[≈]`

Which is liberating, and it means the model should be chosen on which
one he can honour with 3–4 hours a month and still look at himself in
the mirror.

## D.4 The recommendation

**Ship both instruments from day one, with the annual plan as the
default and a lifetime unlock as a permanent, unpromoted, equal-status
option — and no monthly plan at launch.**

Concretely, for App 2 v1.0:

- **Free forever**: the diagnostic in full, plus a real block of
  boundaries — 25–30, not a teaser. No ads, no time limit, no countdown.
  This costs conversion (§C.3) and it is the point.
- **Annual, $39.99 US list.** Below Babbel (~$96), Speak (~$84–99) and
  Duolingo Super (~$96), just under Education's $44.99 median `[S]` —
  cheap for the shelf, and deliberately so, because this is a solo
  product with a stopping rule and no support organisation behind it.
  **No monthly tier**: monthly is
  where a finishing product's churn benchmark punishes it hardest, it
  attracts the one-month tourist, and at $6.99 × 5 months it earns less
  than the annual anyway (§D.3).
- **Lifetime, $99 US list.** 2.5× the annual — the low end of the
  category's 2–12× range and well under Babbel's $249 `[S]`. Offered
  from launch, at full price, never as a Black Friday event.
- **Per-storefront prices set by hand against the local Duolingo Super
  annual, not against Spotify and not by FX conversion.** Turkey lands
  somewhere around 400–700 TL/year for the annual `[?]` — a number that
  must be re-derived at the spot rate on the day. State plainly, to
  himself, that the Turkish and Indian storefronts are an audience, not
  a revenue line.
- **Do not discount. If the price moves, it moves up** — `pricing.md`
  §4.2's rule, and it matters more globally than locally, because the
  category's permanent discounting is exactly the behaviour a
  "respectable" product is differentiating against.

**Why lifetime rather than only a subscription, given decision 3.** The
standard warning is that lifetime cannibalises your best customers —
the loyal ones who would have renewed forever `[S]`. **That warning
assumes a product people do not finish.** For a product with a stopping
rule the same source gives the opposite reading: if users churn in
months one to three, a lifetime price *captures revenue before it walks
out* `[S]`. Here the "loyal customer who renews forever" does not exist
by design. **Lifetime is not the risky instrument for this product; it is
the one that matches it**, and it is the only price on the page that
says out loud "this ends."

**Why an annual plan at all, then.** Three reasons, in order. It is the
owner's decision and the market's default, and both stores are built for
it. It carries the honest recurring half of the promise — new boundaries
ship, and a year of access to whatever ships is a real thing to sell,
whereas "forever" is a promise about a corpus that does not exist yet.
And it is the instrument that survives him deciding, in year two, that
he would rather build something else: a lapsed annual plan is a graceful
ending; a lifetime promise on an abandoned app is a debt.

**The one thing that must be true for this to be honest**, and it is a
copy decision rather than a pricing one: **the listing must say the
corpus is finite and roughly how big it is.** "About 120 boundaries
today, growing slowly" converts worse than silence and it is the entire
difference between a subscription and a subscription trap. A learner who
subscribes knowing they may be done in six months and cancels at month
six is a satisfied customer. The same learner who was allowed to assume
infinity is a complaint.

## D.5 What I would be wrong about

- **If App 2 finds a channel** — a school, a creator, a country's exam —
  the ceiling moves by an order of magnitude and the model choice starts
  to matter. Then the answer flips: at 5,000 users the difference between
  models is six figures and a subscription with real renewal is worth
  building for.
- **If the diagnostic works better than expected**, the product may not
  finish at all. A boundary map that keeps finding new boundaries as the
  learner's level rises is a genuinely recurring service, and the
  stopping rule I have treated as the product's identity would turn out
  to be an artefact of a small corpus. This is the single assumption most
  worth testing early, and `vision.md` §3's v0.1 diagnostic tests it.
- **If notifications are the thing that makes the subscription renew** —
  i.e. if the reminders drive a step-change in return rate — then §B's
  deliberately weak dose is leaving money on the table, and he will
  never know, because he has no analytics. I think this is unlikely at
  the measured effect sizes (§A.6), but it is the place where the values
  and the revenue genuinely diverge and I want it on the record that I
  chose the values.
- **If Apple or Google changes the lifetime rules.** A non-consumable
  purchase is a permanent obligation across every future version, and
  the store's entitlement mechanics are the thing that has to keep
  working, not his code.

---

# E · Where this document disagrees with the others

**With `pricing.md` §3.2 — "a one-time unlock on App 2 is the slow
bleed."** The argument is that every buyer keeps consuming content
produced monthly against revenue booked once. That imports a cost
structure this project does not have and has committed to never having:
no backend, no accounts, no analytics, static hosting, **zero marginal
cost per user**. What a lifetime buyer consumes is content that was
going to be written anyway for new buyers. The real cost of lifetime is
not a bleed, it is **foregone renewal** — and §D.3 prices that at a few
thousand dollars across the app's whole plausible life. That is a price
worth paying for an instrument that matches the product's central claim.

**With `two-apps.md` §5.4 — "do not launch App 2 on a subscription."** I
agree with its mechanism entirely and think its conclusion is one step
too strong. What §5.4 actually forbids is *a subscription whose object is
a content cadence*, because that is a standing claim on 3–4 hours a month
of the one resource that cannot be bought. It does not forbid selling a
**year of access to a finished thing plus whatever happens to ship**, if
the listing says the corpus is finite. The difference between those two
is a sentence in the store description, and it is the difference between
a promise he can keep and one he cannot.

**With `pricing.md` §4.3's "one local Spotify Premium" heuristic.** Wrong
shelf, and by roughly 4–5× in Turkey (§C.2). The anchor is the local
Duolingo Super price. This matters more for App 2 than for App 1 because
App 2's audience is concentrated in exactly the storefronts where the two
anchors diverge most.

**With `vision.md` §3's parenthetical that the project "has explicitly
refused streaks, notifications, timers and numbers that go up."**
Notifications have now been un-refused for App 2 by decision, and that
line will misdirect the next session that reads it. But the *reason* for
the original refusal survives intact and should be promoted from a
prohibition to a design constraint — which is what §B.3's four axioms
are for. The three-message vocabulary in §B.4 is offered as the concrete
form; it belongs in App 2's own brief when one is written.

**Agreeing loudly with `two-apps.md` §3.4**, because §D.3 re-derives it
from a different direction: App 2 has no distribution channel, and that
is a bigger number than every pricing decision in this file combined.

---

# F · Sources

All accessed 2026-09-06 via search summaries only; **none read at
source** (§0).

**Notifications — platform mechanics.**
[MagicBell: PWA iOS limitations & Safari support 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) ·
[Webscraft: PWA push on iOS in 2026](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en) ·
[Batch: enabling iOS web push on a PWA](https://doc.batch.com/developer/technical-guides/how-to-guides/web/how-to-integrate-batchs-snippet-using-google-tag-manager/how-do-i-enable-ios-web-push-notifications-on-my-pwa-website) ·
[9to5Mac: iOS 17.4 keeps Home Screen web apps in the EU](https://9to5mac.com/2024/03/01/apple-home-screen-web-apps-ios-17-eu/) ·
[Apple Developer Forums: PWA web push not arriving on iOS 18](https://developer.apple.com/forums/thread/770749) ·
[Apple Developer Forums: push delivery delays and failures](https://developer.apple.com/forums/thread/797329) ·
[Chrome for Developers: Notification Triggers API](https://developer.chrome.com/docs/web-platform/notification-triggers) ·
[Capacitor: Local Notifications plugin](https://capacitorjs.com/docs/apis/local-notifications) ·
[GoogleChromeLabs: Bubblewrap](https://github.com/googlechromelabs/bubblewrap) ·
[Android Developers: notification runtime permission](https://developer.android.com/develop/ui/compose/notifications/notification-permission) ·
[Chromium Blog: automatic notification permission revocation, Oct 2025](https://blog.chromium.org/2025/10/automatic-notification-permission.html) ·
[Relaybell: VAPID keys explained](https://relaybell.com/blog/vapid-keys-explained) ·
[PkgPulse: web-push vs OneSignal vs firebase-admin 2026](https://www.pkgpulse.com/guides/web-push-vs-onesignal-vs-firebase-push-notifications-2026) ·
[Progressier: PWA stats](https://progressier.com/pwa-stats)

**Notifications — opt-in, efficacy, fatigue.**
[Batch: Great Push Notifications Benchmark 2025](https://batch.com/ressources/etudes/benchmark-notifications-push-crm-mobile) ·
[Business of Apps: push notification statistics 2026](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) ·
[MobiLoud: average opt-in rate](https://www.mobiloud.com/blog/push-notification-opt-in-rate) ·
[Notificare: pre-permission prompts](https://notificare.com/blog/2019/05/23/Increase-opt-ins-with-the-Pre-Permission/) ·
[PushEngage: iOS push permission priming patterns](https://www.pushengage.com/ios-push-notification-permission/) ·
[JMIR mHealth: how notifications affect engagement — a micro-randomized trial](https://mhealth.jmir.org/2023/1/e38342) ·
[PMC: timing and frequency of push in a stress-management app](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5207732/) ·
[PMC: to prompt or not to prompt — microrandomized trial](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6293241/) ·
[ResearchGate: push notifications and habit formation in daily language practice](https://www.researchgate.net/publication/401241990_Push_Notifications_and_Habit_Formation_Behavioral_Impact_on_Daily_Language_Practice_Consistency) ·
[ResearchGate: push frequency and app user behaviour](https://www.researchgate.net/publication/351932011_Mobile_apps_in_retail_Effect_of_push_notification_frequency_on_app_user_behavior)

**Motivation, streaks, gamification.**
[Springer ETR&D: gamification meta-analysis](https://link.springer.com/article/10.1007/s11423-023-10337-7) ·
[PMC: effects of gamification on behavioural change in education — a meta-analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8037535/) ·
[Oulu University: *Keeping the Streak Alive — Motivation and Language Learning in Duolingo*](https://oulurepo.oulu.fi/bitstream/handle/10024/54117/nbnfioulu-202502121605.pdf?sequence=1&isAllowed=y) ·
[Duolingo blog: how the owl decides what notification to send](https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/) ·
[Taplytics: how Duolingo A/B tested streaks](https://taplytics.com/blog/how-duolingo-ran-an-experiment-on-their-streaks-feature/) ·
[Learning Loop: psychological reactance](https://learningloop.io/blog/psychological-reactance) ·
[ScienceDirect: apps that motivate — an SDT taxonomy of app features](https://www.sciencedirect.com/science/article/pii/S1071581920300513) ·
[ScienceDirect: the effect of reminders for self-set goals on productivity](https://www.sciencedirect.com/science/article/abs/pii/S0304387826001057) ·
[PMC: reminders improve adherence to a self-help sleep intervention](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5686282/) ·
[Anki manual: background](https://docs.ankiweb.net/background.html)

**Pricing, churn, models.**
[RevenueCat: State of Subscription Apps 2026 — Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education) ·
[RevenueCat: average renewal rates by category 2026](https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category) ·
[RevenueCat: subscription app trends and benchmarks 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) ·
[RevenueCat: a guide to lifetime subscriptions](https://www.revenuecat.com/blog/growth/lifetime-subscriptions) ·
[9to5Mac: annual subscribers rarely return after cancelling](https://9to5mac.com/2026/05/27/new-report-shows-annual-app-subscribers-rarely-return-after-they-cancel/) ·
[Adapty: education app subscription benchmarks](https://adapty.io/blog/education-app-subscription-benchmarks/) ·
[Userpilot: why freemium-to-premium conversions are flopping](https://userpilot.com/blog/freemium-to-premium/) ·
[DealNews: Babbel plan pricing 2026](https://www.dealnews.com/features/babbel/plan-pricing/) ·
[Test Prep Insight: Busuu vs Babbel](https://testprepinsight.com/comparisons/busuu-vs-babbel/) ·
[Test Prep Insight: how much does Pimsleur cost](https://testprepinsight.com/resources/how-much-does-pimsleur-cost/) ·
[SaaSworthy: LingQ pricing](https://www.saasworthy.com/product/lingq/pricing) ·
[SaaSworthy: ELSA Speak pricing](https://www.saasworthy.com/product/elsa-speak/pricing) ·
[SpeakShark: Speak app pricing per month 2026](https://speakshark.com/blog/speak-app-pricing-per-month-2026) ·
[FlashcardsLearn: Anki price — what's free, what costs $25, and why](https://www.flashcardslearn.com/en/blog/how-much-does-anki-cost) ·
[GeoPriced: Duolingo Super cost by country](https://geopriced.com/cost/duolingo-super) ·
[Mirava: Apple App Store price tiers 2026](https://www.mirava.io/blog/apple-app-store-price-tiers-how-they-work-2026) ·
[PricePush: the App Store does not localize prices](https://pricepush.app/blog/app-store-doesnt-localize-prices) ·
[Klasio: course subscription business model](https://klasio.com/blog/15472/course-subscription-business-model-a-complete-guide) ·
[Fitscope: how fitness apps reduce churn with fresh content drops](https://www.fitscope.com/blog/how-fitness-apps-reduce-churn-with-fresh-content-drops) ·
[LingoLeap: TOEFL & IELTS prep pricing](https://lingoleap.ai/pricing)

---

# G · What must be re-verified before money or evenings are spent

Dated **2026-09-06**. Nothing below was read at source. The first block
decays in months; the second in weeks.

## Platform behaviour — check on a real device, not in a blog

| # | Claim used here | How to check |
| --- | --- | --- |
| 1 | iOS web push requires iOS 16.4+ **and** a Home Screen install from Safari; a tab cannot subscribe | Apple's Safari release notes and a real iPhone. Five minutes. |
| 2 | EU Home Screen web apps and web push were restored in iOS 17.4 and the "no push in the EU" claim is stale | A real EU device or Apple's current developer documentation. **This one is repeated wrongly in current vendor blogs.** |
| 3 | PWA `PushSubscription` endpoints silently expire on iOS after inactivity | The strongest reason not to build web push. Verify with a two-week test on one device before committing, because it invalidates the whole weekly-reminder design if true. |
| 4 | Notification Triggers API (`TimestampTrigger`) is Chrome-only and never shipped to Safari | Current status on the Chrome platform status board. If it has shipped broadly, the serverless web path reopens and §A.4 changes. |
| 5 | Chrome auto-revokes notification permission on low engagement + high volume, and auto-enrols low-accept-rate origins in a quieter prompt | Chromium blog and Chrome release notes. Affects whether the soft-ask design is sufficient. |
| 6 | Android 13+ `POST_NOTIFICATIONS` is off by default and Chrome mediates it for web content | A real Android 13+ device. |
| 7 | Capacitor Local Notifications schedules on-device with no server, on both platforms | Build the two-evening spike before planning on it. This is the load-bearing technical claim in §A. |
| 8 | PWA Home Screen install rate under 2% | Not verifiable in general — **measure his own**, which he cannot do without analytics. Treat as unmeasurable and design for the low number. |

## Prices and market figures — all move several times a year

| # | Figure used | Verify |
| --- | --- | --- |
| 9 | Duolingo Super: US $6.99/mo; Turkey ~$0.63–0.66/mo (~$14/yr); India $0.93/mo; global average $4.81 | The actual storefronts, in the target countries, on the day. The Turkish figures conflicted across summaries. **This is the anchor for every App 2 price.** |
| 10 | Babbel $14.99/mo, ~$95.88/yr, lifetime $249–299 list / $129–169 street; Busuu ~$6–15/mo with no lifetime; LingQ $10 / $36.99; Speak $17.99/mo, $84–99/yr; Pimsleur ~$20/mo, lifetime $475 list / ~$300 street; ELSA from $13.33 | Each product's own pricing page, and note the street price separately from list. |
| 11 | AnkiMobile $24.99 one-time funds the project | The App Store listing. Included because it is the closest existing analogue to what App 2 could be. |
| 12 | Education median annual price $44.99; month-1 median revenue $22.82; weekly renewal 58%; trial conversion 6.5% | RevenueCat *State of Subscription Apps 2026*, Education chapter, read at source. `two-apps.md` also leans on the 58% and 6.5% figures. |
| 13 | Annual plans renew at 83.4%; 35% of annual cancellations occur in month 1; annual retain 33.9% at 12 months vs monthly 13.8% | Same report. These decide §D.3's arithmetic. |
| 14 | EdTech freemium converts ~2.6%; hard paywalls ~5× better (10.7% vs 2.1%) | This is the measured cost of *free forever, paid depth*. Worth confirming before that decision is re-affirmed for App 2. |
| 15 | Apple offers ~900 price points across 175 storefronts, FX conversion by default, Custom Price Change per region | App Store Connect itself. **Google Play's equivalent must be checked separately** — Android is the priority platform per `README.md`. |
| 16 | Store commission 15% under the Small Business Program | Already item 1 in `pricing.md` §7. Do not verify it twice. |

## And two things to decide rather than look up

- **Whether App 2 ships wrapped.** Everything in §A turns on it. Wrapped:
  notifications are local, free, reliable, private, and reach 20–40× more
  iOS users. Pure web: the recommendation is no notifications at all
  rather than a server. This is a one-line decision with a very large
  shadow.
- **Whether the store listing will say the corpus is finite.** §D.4 says
  the honesty of the whole subscription rests on it, and it is a
  conversion cost he has to agree to pay before the price is set, not
  after the first refund request.
