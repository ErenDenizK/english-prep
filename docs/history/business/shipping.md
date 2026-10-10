# Shipping it, and charging for it

Research arm, 2026-09-05. Answers the part of `docs/business/brief.md`
that says **"Apple, iOS, Türkiye — there is a stack of process here and I
want it researched, not assumed."**

This document does not touch the app. It is about the machinery around
it: which door you walk through to reach a paying Turkish student, what
each door costs in money and in evenings, and which claims in here you
must not spend money on until you have checked them yourself.

---

## How to read the sourcing marks

`WebFetch` is blocked in this environment. Nothing below was read from
Apple's or Google's own pages. Every factual claim carries one of:

| Mark | Means |
| --- | --- |
| **[R]** | **Read from this repository.** A file in this repo says it. As reliable as the repo. |
| **[S]** | **Search summary, not a read source.** A web search returned this. It was not read from the primary source and may be months stale. |
| **[?]** | **Unverified and I could not even get a good search answer.** Treat as a question, not a fact. |
| **[≈]** | **My own reasoning**, from how the mechanism works. No source at all. Argue with it. |

Apple and Google change fees, percentages and policy clauses constantly.
A number in here that looks authoritative and is a year old is worse than
no number, so §9 is a dated **verify before spending** list naming every
claim you must check against the primary source before any money moves.

Turkish tax law is deliberately absent. Another arm has it. Where the
*store* demands a tax form, that is a store requirement and it is in §6;
what you then owe the Turkish state is not this document's business and I
have not guessed at it.

---

## 1. The cheapest path to a paying Turkish student

**There is no store in it.**

You have a static, installable PWA with a service worker and a web
manifest **[R]**: `sw.js` caches the shell and the modules and falls back
to a cached topic file when there is no signal **[R]**; the manifest
declares `display: standalone` with 192 and 512 icons and a maskable one
**[R]**. All learner state is in `localStorage` — history, lesson
progress, the profile name — with no login and no server **[R,
`js/storage.js`]**.

That means the cheapest route is:

1. The app stays exactly where it is, on GitHub Pages, free.
2. A student pays you on a Turkish payment page.
3. They get an unlock code. The app checks it locally and opens the paid
   part.
4. Apple and Google get nothing, because neither of them is involved.

**Guideline 3.1.1, the in-app-purchase rule, binds App Store apps. It
does not bind a website** **[≈, and this is the single most useful thing
in the document]**. A PWA opened in Safari is not in Apple's
jurisdiction. If you sell an unlock for a web app, there is no
commission, no review, no developer programme, and no annual fee. People
assume Apple takes a cut of anything that happens on an iPhone. It does
not; it takes a cut of anything that happens *in an App Store app*.

### What that route actually costs

**Money:** the payment processor's cut, and nothing else fixed.
For a Turkish individual with no company, the relevant fact is that
**Shopier is reported to allow selling without a `vergi levhası`, while
iyzico and PayTR require a şahıs şirketi or a company** **[S]**. That one
difference decides the processor for you if you do not yet have a
company. I did not get a reliable commission rate for Shopier and I am
not going to invent one **[?]**.

**Time:** a paywall and a code check. Days, not weeks.

**What you lose, honestly:**

- **Discovery.** No store listing, no search, no "download on the App
  Store" badge. Your brief already says reach comes from your own circle
  and possibly paid ads — so for App 1 you are not actually losing a
  distribution channel you were counting on. For App 2 (global) you
  would be.
- **iOS install friction.** On iOS there is no install prompt. The user
  must open the Share sheet and tap "Ana Ekrana Ekle" **[S]**. On Android
  Chrome the browser offers installation itself **[S]**. This is a real
  conversion loss and the fix is a screenshot-by-screenshot install
  instruction, not code.
- **Trust.** "Pay a stranger 270 TL on a link" is a harder ask than "buy
  in the App Store", except that in your case the stranger is a
  classmate, which is the whole reason this route works for App 1 and
  would not work for App 2.
- **The code will be shared.** This is the serious objection, and §4
  takes it seriously.

### Push and offline on the no-store route

- **Offline: already solved.** `sw.js` is cache-first for the shell,
  network-first for content, and the content cache is deliberately
  unversioned so a release does not wipe a learner's downloaded topics
  **[R]**. This works identically on iOS and Android.
- **Push: works, but only for an installed PWA.** Since iOS 16.4, web
  push works for web apps **added to the Home Screen** — not for an open
  Safari tab **[S]**. As of iOS 26, a site added to the Home Screen
  defaults to opening as a web app even without a manifest **[S]**. So
  push is available to exactly the users who installed, which is the
  population you care about. There is also an EU wrinkle: in 2024 Apple
  briefly removed standalone PWA behaviour in the EU under the DMA
  **[S]** — irrelevant for Turkey, potentially relevant for App 2, and
  the state of it now is **[?]**.
- **The app sends no push today** and adding it would need a push
  service, i.e. the first thing in this project that costs a server bill.
  Say no to it until something demands it.

---

## 2. The one honest argument for paying a store 15%

Do not read §1 as "stores are a scam". There is one thing a store sells
you that you cannot cheaply build, and for your specific situation it is
the thing you actually need:

**The store is an entitlement service and a payment collector, rented for
15%.**

Your buyers are ~150 students in three schools who all know each other
**[R, brief]**. An unlock code checked locally, in an app with no server,
is a string one student can WhatsApp to forty others in a second. There
is no way to detect it, because there is nothing to detect it *with* —
the app has no backend by design **[R]**. Your mitigations, in order of
how much they cost:

1. **Accept it.** Your brief says the goal is explicitly not profit and
   that covering the AI and store fees is already a win **[R]**. If ten
   of fifty pay and forty ride along, the fees are still covered and the
   experience is still had. This is a legitimate answer and I would not
   dismiss it.
2. **Per-buyer codes tied to a name the app displays.** Doesn't stop
   sharing, makes it socially visible. Cheap. Weak.
3. **One tiny serverless endpoint** that counts activations per code. A
   free-tier worker costs nothing in money and costs the project its
   "there is no server" property — which §8 argues is a real strategic
   asset, so spend it consciously if at all.
4. **Store IAP.** Apple and Google bind the purchase to an Apple ID or
   Google account, handle re-download on a new phone, handle refunds, and
   handle the Turkish card rails. That is what the 15% buys.

So the decision is not "store or no store" on principle. It is: *is
sharing-proof entitlement worth 15% plus a developer fee plus review
risk, for this audience?* For 150 friends-of-friends, probably not. For
App 2's global recurring subscription, almost certainly yes.

---

## 3. Store routes, ranked

Ranked by cost-and-risk to first paying user, cheapest first.

### Route 0 — No store. PWA + off-store unlock code

- **Fixed cost:** 0 **[≈]**. Processor commission only **[?]**.
- **Time:** a few evenings for the paywall and the code check.
- **Review risk:** none. There is no reviewer.
- **Reach:** everyone with a browser, iOS and Android alike, from day one.
- **Loses:** discovery, install friction on iOS, entitlement enforcement.
- **Verdict: start here.** It is the only route that can have a paying
  user this month.

### Route 1 — Google Play, as a Trusted Web Activity

Google supports PWAs in Play through **Trusted Web Activity**, packaged
with **Bubblewrap** or **PWABuilder**; you upload an almost-empty APK
that points at your site, and **Digital Asset Links** proves you own the
domain **[S]**. Reported gates: a Lighthouse score of at least 80 **[S]**
and the asset-links file.

- **Fixed cost:** **$25, one time, no renewal** **[S]**.
- **Time:** an evening to package. Then the calendar, not the work:
  identity verification 2–5 business days **[S]**, and for **personal
  accounts created after 13 November 2023, a closed test with at least 12
  testers running 14 consecutive days before you can go to production**
  **[S]**. Total account-to-production roughly three weeks **[S]**.
  Organisation accounts are reported to skip the 12-tester rule **[S]**.
- **You have the 12 testers.** Three schools of fifty is not a problem
  here; it is an asset. Start the closed test the day you open the
  account, because the 14 days run in parallel with everything else you
  are doing.
- **Review risk: low, but not zero.** Play enforces a minimum
  functionality / webview-spam policy and reportedly enforces it harder
  in 2026 **[S]**; suspensions cluster on apps that wrap *someone else's*
  site **[S]**. A TWA of a domain you have proved you own, via Google's
  own sanctioned mechanism, is the case the policy was written to permit
  **[≈]**.
- **The real obstacle is your URL, and it is concrete.** The repo has no
  `CNAME` **[R]** and the remote is `github.com/ErenDenizK/english-prep`
  **[R]**, so the site is served from a *subpath* of a shared origin. A
  TWA verifies an **origin**, and Digital Asset Links must be served from
  `/.well-known/assetlinks.json` at the **root** of that origin — which
  on a shared `github.io` you cannot control **[≈, high confidence in the
  mechanism, verify the exact requirement]**. **The Play route therefore
  needs a custom domain.** Budget for one.
- **Charging:** Play policy requires Play Billing for digital goods sold
  in a Play-distributed app **[S]**, and a TWA reaches it through the
  **Digital Goods API + Payment Request API**, Chrome 101+ **[S]**. This
  is the fiddliest engineering in the whole document and it is the only
  part of the Play route I would call genuinely hard.
- **The tempting shortcut and its risk:** ship free on Play, sell the
  unlock entirely off-store, let the app just recognise a code. Whether
  that is compliant or is a payments-policy violation is exactly the grey
  zone stores litigate. **[?] — do not assume it is fine.**

### Route 2 — iOS, as a native wrapper (Capacitor / WKWebView)

- **Fixed cost:** **$99 per year** **[S]**. Turkish community posts
  report the local-currency charge has at times been far below the dollar
  conversion — roughly 650–1,100 TL depending on where you enrol and
  when **[S, forum-sourced, treat as gossip]**. Check the actual number
  on the enrolment screen; do not plan around the gossip.
- **The hidden cost nobody lists: you need a Mac.** Xcode is macOS-only.
  If you do not have one, add a borrowed Mac, a rented cloud Mac, or a
  used Mac to the budget. **[≈]**
- **Time:** several evenings to wrap, plus review turnaround, plus a
  first rejection you should plan for rather than hope against.
- **Review risk: the highest single risk in this document.** §4.
- **Design decision that matters:** the wrapper must **bundle the app's
  files locally**, not point a `WKWebView` at your URL. A wrapper that
  loads a remote URL is the archetype Apple rejects **[S]**; a wrapper
  that ships the HTML, CSS and modules in the bundle and works in
  aeroplane mode from first launch is a different animal **[≈]**.
- **And that creates the one real tension in this whole plan.** Your
  release cadence is a web cadence — `sw.js` even carries a note about
  six releases in thirty hours **[R]**. Bundling content freezes it
  behind App Review. The resolution is the architecture you already have:
  **bundle a snapshot as the offline floor, keep fetching `data/` over
  the network for updates** — which is precisely what `sw.js` does today,
  network-first for content and cache-first for the shell **[R]**. Grammar
  fixes reach learners at web speed; only shell changes need a release.

### Route 3 — Native rewrite (SwiftUI / Kotlin)

Costed, as instructed, in a student's evenings.

What would have to be rebuilt: **6,769 lines of JavaScript, 1,339 lines
of CSS and three HTML shells** **[R]** — a hash router, a paged lesson
reader over a typed-block content schema, a quiz engine, a results
breakdown, `localStorage`-equivalent persistence with backup/restore, a
14-icon hand-drawn set, a replaced select-only combobox implementing the
full ARIA contract, a modal, and a design system whose colour tokens are
solved against a contrast requirement and re-measured in CI **[R,
`CLAUDE.md`]**. Plus 241 questions and 48 lessons that currently render
from JSON **[R]**.

**Estimate: 150–300 hours per platform** **[≈]**. At two hours an evening,
four evenings a week, that is **five to nine months per platform**, and
the second platform is not free. The content tooling — validator,
formatter, blinding, calibration — is Node and stays Node **[R]**, so you
would be maintaining two content renderers against one schema.

**But the hours are not the argument. The cadence is.** A native rewrite
puts *every content fix* behind a 1–3 day store review. Four days before
an exam, that is the difference between a corrected question and a wrong
one. **Do not do this.** Not now, and not for App 1. If App 2 ever needs
it, it needs it for a specific capability, and that capability should be
named before a line is written.

---

## 4. The review risk, specifically. Read this twice.

**This is the highest-risk section and the one where I am least able to
verify anything. Everything below is [S] or [≈] unless marked.**

### The clause

**Guideline 4.2, Minimum Functionality.** Reported wording: *"Your app
should include features, content, and UI that elevate it beyond a
repackaged website. If your app is not particularly useful, unique, or
'app-like,' it doesn't belong on the App Store."* **[S]** The rejection
letter reportedly reads: *"We found that the experience your app provides
is not sufficiently different from a web browsing experience, as it would
be if displayed in Safari."* **[S]**

It is reported as the **number one rejection reason for WebView-based
apps** **[S]** and as among the most common rejection reasons overall in
2026 **[S]**.

### What actually gets rejected

From the search summaries, consistently **[S]**:

- An app that loads a remote URL in a shell with no native layer.
- Website-to-app converters and no-code wrappers, as a category.
- Apps where Safari can do everything the app does.
- Collections of links.
- The special case Play punishes hardest: wrapping a site you do not own
  **[S]** — not your situation, you own it.

### What gets through

Reported as what moves an app from "thin wrapper" to "standalone app" in
a reviewer's eyes **[S]**:

- **Push via APNs** — described as proof of native platform usage.
- **Face ID / Touch ID** — described as "the easiest win".
- **Genuine offline access.**
- Native lifecycle and permission handling done properly, rather than
  web-only patterns **[S]**.
- One iOS-specific trap: **Web Push does not work inside a `WKWebView`**
  **[S]**. If you want notifications in the wrapper you must use native
  push, not the web push you would use in the PWA. Two implementations.

### Where you actually stand

Argued, not sourced **[≈]**:

The archetypal 4.2 casualty is a marketing site in a shell with three
screens and a contact form. You have 241 questions and 48 lessons across
ten topics **[R]**, a quiz engine with scoring and shuffling, per-category
weakness tracking, lesson progress, a results breakdown that links a
wrong answer to the lesson that teaches it **[R, `CLAUDE.md`]**, offline
operation, and an accessibility contract verified across four viewports
by ~430 automated checks **[R]**. That is not a repackaged website; it is
an application that happens to be written in web technology, and the
guideline is aimed at the former.

**But I cannot promise you a reviewer will see it that way, and I want to
be blunt about the failure mode:** App Review is a human, working fast,
who may open your app, see something that looks like a webpage, and send
the template. That outcome is not evidence you did anything wrong and it
is not final — the reported process is to reply in Resolution Center with
a fix or an explanation, which is faster than a formal appeal to the App
Review Board **[S]**.

### If you go to iOS, build these before you submit, not after

Ordered by review value per evening **[≈]**:

1. **Bundle everything locally.** Aeroplane mode on, launch, full lesson,
   full test, results. This is both the strongest 4.2 answer and a
   genuinely better app.
2. **Native local notifications** for a revision reminder. No server
   needed — local notifications are scheduled on device **[S]**.
3. **Face ID lock** on the app, if it fits the product at all. Cheap,
   and named as the easiest win **[S]**.
4. **Haptics** on answer feedback **[S]**. Small, native, felt.
5. **iOS share sheet** for the backup export that already exists **[R,
   `js/backup.js`]**.
6. **In the review notes, say what the app is**: an offline exam-prep
   app with a bundled corpus of 241 questions, built for a specific
   Turkish university proficiency exam. Reviewers read those notes.

### What I could not verify at all

- The current exact text of 4.2 and 4.2.2. **[?]**
- Whether Apple's 2026 enforcement of wrappers is tighter or looser than
  the summaries suggest. **[?]**
- Any real 2026 rejection-then-approval case study for an offline
  education app with bundled content. I found none. **[?]**

---

## 5. What a store forces on you that a PWA does not

Each of these is zero work today because you have no accounts, no
analytics and no backend **[R]** — and each becomes work the moment you
enter a store.

| Requirement | What it means for you | Mark |
| --- | --- | --- |
| **IAP mandatory for digital goods** | Guideline 3.1.1: unlocking content in-app must go through Apple's purchase system. Play requires Play Billing equivalently. **This sets your commission before you choose a price.** | [S] |
| **Commission: 15%, but only if you enrol** | App Store Small Business Program drops 30% → 15% for developers under $1M proceeds; you must enrol, it is not automatic. Google Play applies a 15% rate on the first $1M per year. | [S] |
| **Privacy policy at a public URL** | Required even if the app collects nothing (reported as 5.1.1), no login, linked in store metadata and in-app. Cheapest compliance in the document: one more page on GitHub Pages. | [S] |
| **Privacy nutrition labels / Play Data Safety** | Declare every data type collected. Your honest answer is "none", which is rare and takes ten minutes. | [S] |
| **Privacy manifest (`PrivacyInfo.xcprivacy`)** | Required for apps using "required reason" APIs, and third-party SDKs must ship their own; reported as enforced through 2026. A Capacitor wrapper storing preferences will touch a required-reason API. | [S] |
| **Account deletion in-app** | If the app lets users create accounts, it must let them delete the account *and data* in-app, not only on a website. **You have no accounts. This is a concrete reason to keep it that way.** | [S] |
| **Age rating** | A questionnaire to complete. English-language education content should land at the lowest bracket; I did not verify the 2026 questionnaire. | [?] |
| **EU DSA trader status** | For EU distribution, Apple requires trader status and **publishes your address, phone and email on the App Store product page**; apps without it were removed from the EU App Store in February 2025. Even non-EU developers reportedly must declare a status. **Irrelevant to App 1 (Turkey storefront). A serious privacy consideration for App 2, for a student publishing under his own name.** | [S] |
| **Play target-API treadmill** | Play enforces target-API-level deadlines (an API 36 deadline is mentioned for 2026), so the wrapper needs periodic re-release even in a month when the web app does not change. | [S] |
| **Android developer verification, and it reaches sideloading too** | Google announced verification for installing apps on certified Android devices *including sideloading*, opening to all developers March 2026, enforced in four countries September 2026, global from 2027. **This closes the "just hand out an APK" escape hatch over the next two years — and it does not touch the PWA, which is not an app install at all.** | [S] |

---

## 6. Turkey specifics — what the *store* demands of a seller

Tax is the other arm's. This is only what App Store Connect and Play
Console will not let you past.

### Apple

- **Sign the Paid Apps Agreement** before you can submit tax forms; all
  developers must complete a US tax form under it **[S]**.
- **W-8BEN** is the individual's form (W-8BEN-E is for entities) **[S]**.
- **Turkish individual accounts are reported to require the T.C. kimlik
  numarası** in the tax information **[S]**.
- **A bank account that can receive international transfers** **[S]**.
- **Enrolling as an individual publishes your own legal name** as the
  seller, not a brand **[≈]**. If that matters to you, it is an argument
  for a company you may not otherwise want.
- A D-U-N-S number is an *organisation* enrolment requirement, not an
  individual one **[?] — I did not verify this and it is the kind of
  thing that changes.**
- **VAT:** Türkiye's VAT went 18% → 20% and App Store prices were updated
  accordingly **[S]**. Apple collects and remits it; your proceeds are
  net of it **[S]**.

**What that does to your 270 TL** **[≈, arithmetic on [S] inputs]**:

```
  270.00 TL   list price, VAT-inclusive
÷   1.20      Türkiye VAT at 20%
= 225.00 TL   net of VAT
−  33.75 TL   Apple commission at 15% (Small Business Program)
= 191.25 TL   your proceeds, before any Turkish income tax
```

Your brief estimates ~150 TL net after commission and tax **[R]**. That
arithmetic says **191 TL before income tax** — so your estimate is right
if tax takes roughly a fifth. Your instinct was well calibrated. At 150
buyers that is about **28,700 TL of proceeds**, before tax.

### Google

- **A payments profile and merchant registration**, available only in
  **supported locations** **[S]**.
- **Whether Türkiye is on that supported-merchant list, I could not
  confirm. [?] This is the single most important unverified fact in the
  document for the Android route** — everything in Route 1 depends on it
  and I would not spend the $25 before checking.
- **The payments profile country cannot be changed afterwards**; a wrong
  country means a new profile **[S]**. Get it right the first time.
- **Identity verification, 2–5 business days** **[S]**.
- Bank account and tax information in the payments profile **[S]**.

### Both

Neither store requires a company as such, on anything I found — an
individual developer account is a supported path on both **[S]**. What
Turkish law then requires of you as a person receiving that money is a
separate question and **not one this document answers**.

---

## 7. Android or Apple first — challenging the assumption

Your brief names Apple and iOS. **I think that is the wrong first store,
and the reasons are not close.**

**Against Apple first:**

1. **Turkey is an Android country.** Android is reported at **over 85%**
   of the Turkish mobile market **[S]** — well above the global average
   **[S]**. Of your ~150 students, roughly 20–25 are on iPhone. **An
   iOS-first launch aims $99 a year and the hardest review process in the
   industry at a sixth of your market.**
2. **$25 once versus $99 every year** **[S]**.
3. **Google Play accepts your actual PWA** through TWA, Google's own
   sanctioned mechanism **[S]**. Apple has never accepted a PWA as an app
   and still does not in 2026 **[S]** — iOS requires a native wrapper and
   therefore the 4.2 conversation.
4. **No Mac needed** **[≈]**.

**For Apple, honestly:**

1. iOS users are generally reported to spend more per head — but 15% of a
   small base is a small number, and your goal is explicitly not profit
   **[R]**.
2. If you are on an iPhone yourself, the iOS build is the one you can
   actually test on a real phone daily, and this project's rule is that
   things get tried on a real phone before they reach `main` **[R]**.
3. Apple's paid-app machinery is mature and its Turkish VAT handling is
   automatic **[S]**.

**Recommended order:**

1. **Now — Route 0.** PWA where it is, unlock code, Shopier. Both
   platforms, no fee, no review, first paying user in weeks. Install
   instructions with screenshots for iOS are part of the product, not an
   afterthought.
2. **Next — Route 1, Google Play as a TWA.** $25, a custom domain, and
   the 12-tester closed test started on day one. This reaches ~85% of
   your market with the least risk per lira.
3. **Only then — Route 2, iOS wrapper.** And gate it on evidence: if
   Route 0 shows that a real fraction of your buyers are on iPhone and
   are hitting the Add-to-Home-Screen wall, the $99 buys something. If
   not, it does not.
4. **App 2 changes this calculus.** A global recurring subscription
   wants store billing and store discovery, and iOS is a much bigger
   share of a global paying audience than of a Turkish one. Decide App 2
   on its own evidence; do not let App 1's answer pre-commit it.

---

## 8. What it costs to keep alive, per year, for one person

| Item | Cost | Mark |
| --- | --- | --- |
| Hosting | **0** — GitHub Pages, static | [R] |
| Backend / database / API | **0** — there is none | [R] |
| Runtime dependencies | **0** — `package.json` has zero, and tooling only | [R] |
| Domain (needed for the Play TWA; optional otherwise) | roughly $10–15/yr | [?] |
| Google Play | **$25, once, ever** | [S] |
| Apple Developer Program | **$99/yr**, charged in TL at a rate to check on the enrolment screen | [S] |
| Payment processor | a % of sales, no fixed fee | [?] |
| AI authoring costs | your existing subscription | [R, brief] |

**Year one, all three doors open: about $124 plus a domain.** Year two
onward, if you keep Apple: about $99 plus the domain. **If you stop at
Route 0, the running cost of this project is zero.**

### Name the asset

**This app has no server bill, and that is a strategic asset, not an
accident.** It is worth saying plainly because every decision ahead will
be tempted to spend it:

- **It cannot be killed by neglect.** A backend that stops being paid for
  takes the app down. A static site on Pages does not. If you sit an exam,
  get a job, and forget this for eight months, it is still up and still
  working for the students who installed it.
- **The marginal user costs nothing.** Fifty users and five thousand cost
  the same: zero. So a free tier is not a loss-leader you subsidise — it
  is genuinely free to provide, which is why the brief's "a meaningful
  part is free" **[R]** costs you nothing at all.
- **It cannot leak what it does not have.** No accounts, no analytics, no
  server means the privacy label is honestly empty and there is no
  breach available to have **[R]**.
- **It is the reason a one-person project can outlive its author's
  attention** — the only sustainability model that has ever worked for
  software built in evenings.

Every route above spends some of this. Route 1 spends a domain and a
release process. A push service would spend the "no server" property
outright. Route 3 spends the release cadence. **Know which one you are
spending each time.**

---

## 9. Verify before spending — dated list, 2026-09-05

Nothing here was read from a primary source. Check each of these against
the source named, on the day, before money moves.

**Blocking the Android route**

1. **Is Türkiye a supported merchant location for Google Play?**
   Play Console Help, "Supported locations for developer and merchant
   registration". **The $25 is wasted if not.** [?]
2. **Does a TWA's Digital Asset Links file need to sit at the origin
   root?** If yes, the `github.io` subpath cannot work and a domain is
   mandatory, not optional. Chrome for Developers, TWA docs. [≈]
3. **The 12-testers / 14-days rule** — still current, and does it apply
   to an account you open now? Play Console Help. [S]
4. **Play Billing via the Digital Goods API** — still the supported route
   for a TWA, and what happens to buyers on non-Chrome Android browsers. [S]
5. **Whether selling the unlock entirely outside a free Play app is
   compliant.** Play payments policy. Do not assume. [?]

**Blocking the iOS route**

6. **The current text of Guideline 4.2 / 4.2.2**, from
   `developer.apple.com/app-store/review/guidelines/` — not from a blog. [S]
7. **The Apple Developer Program price as charged in Türkiye**, on the
   enrolment screen. The 650–1,100 TL figures are forum gossip. [S]
8. **Small Business Program: enrolment window, eligibility, and that it
   is 15%.** It is not automatic. [S]
9. **W-8BEN and T.C. kimlik requirements for a Turkish individual**, from
   App Store Connect Help, before signing the Paid Apps Agreement. [S]
10. **Whether an individual enrolment needs a D-U-N-S number.** [?]
11. **Privacy manifest requirements** as they apply to a Capacitor
    wrapper in 2026. [S]

**Blocking the no-store route**

12. **Shopier's actual commission, payout schedule, and its current
    position on selling without a `vergi levhası`.** From Shopier, not
    from a blog. This is the one number that decides your net on the
    cheapest route. [S]
13. **Whether iOS web push still requires Home Screen installation**, and
    whether Turkey is affected by any EU-style PWA restriction. It is not,
    as far as I can tell, but confirm before promising push. [S]

**Before App 2**

14. **EU DSA trader status** — that it publishes your address and phone
    on the product page, and what a non-trader declaration costs you in
    consumer-rights warnings shown to buyers. [S]
15. **Android developer verification timeline** and whether it affects
    anything you plan to distribute outside Play. [S]

---

## 10. The one-paragraph answer

Ship it as it is. Sell an unlock code through a Turkish payment page that
takes individuals, and you have a paying student this month with no fee,
no commission, no reviewer and no server. Then spend $25 and a domain on
Google Play as a Trusted Web Activity, because 85% of Turkish phones are
Android and Google is the only store that accepts what you have actually
built. Spend the $99 on Apple only when your own sales data shows iPhone
buyers you are losing at the Add-to-Home-Screen wall — and when you do,
bundle the corpus locally, add native notifications and Face ID, and
expect to argue with a reviewer once. Do not rewrite it natively: not
because of the five to nine months per platform, but because it would put
every corrected question behind a three-day review in the week before an
exam. And guard the fact that this thing costs nothing to run, because
that is the property that lets it still be alive next year.
