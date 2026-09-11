# Onboarding, identity and portability

What should happen the first time someone opens this app, the second time,
and the time they come back after two weeks away — and what happens to
everything they have done when they change phones.

Written against the `v0.13` build, 2026-09-03. Numbers about this app were
measured or counted from the repository; numbers about the world are cited
to their source. Where a claim about browser behaviour could not be
verified against a primary source from this machine, it says so — that is
not decoration, it is the difference between a design that survives a real
iPhone and one that does not.

One limit on this file worth stating up front: `webkit.org`, `caniuse.com`,
`developer.mozilla.org` and `developer.chrome.com` were all unreachable
from the session that wrote it. The quotations from those pages came
through a search index of them rather than a direct fetch. They are quoted
verbatim and linked to their canonical URLs, and they should be re-read at
source before anything in §5 or §7 is built — those two sections are the
ones where being wrong costs a learner their progress.

## Where the app stands today

There is no onboarding, and that is worth stating precisely rather than as
a complaint, because most of it is already right.

A first-time visitor gets `#egitim`: a progress bar reading "18 dersten 0
tanesi tamamlandı", a dismissible development note, and 18 lesson rows
grouped by topic. No modal, no tour, no sign-up, no permission prompt.
Time to the thing they came for — tapping a lesson — is one tap. That is
better than most study apps manage and it should be defended, not
replaced.

What is missing is narrower than "onboarding":

- **Nothing says what the app is for.** The header says "English Prep";
  the dev note says it is in development. Nowhere does it say *YTÜ
  yeterlik sınavı*, which is the only reason any of the six people who
  will use it opened the link.
- **The zero state is a zero.** `%0`, `0/18`, and a stats grid of
  `— / 0 / 0 / —` in Profil. The screen is honest and slightly
  discouraging, and it is the screen every learner sees exactly once at
  the moment they are deciding whether to bother.
- **Identity is a greeting.** `getProfileName()` produces one initial in
  the header (`js/home.js`) and nothing else. It carries no data, no
  portability, no meaning.
- **Everything is one `localStorage` origin away from gone**, on a
  platform that deletes exactly this kind of data on a seven-day timer.
  Sections 5 and 7 are about that, and it is the sharpest problem in this
  brief.
- **There is no re-entry.** The `renderResumeCard` in `js/education.js`
  fires on `read > 0.02 && !done`, which is a resume card, not a return.
  It looks the same after ten minutes and after ten weeks.

The rest of this file is those five, in the order the brief asked, with
the evidence for and against each.

---

## 1 · First run

### The thing most "onboarding" writing is about does not apply here

Almost everything published under the word *onboarding* is about SaaS
activation: get a stranger who arrived from an ad to reach a value moment
before the trial lapses, so the funnel converts. This app has no funnel.
It has six users, all of whom got the link from a friend who told them
what it was, and all of whom already have the motivating problem — an exam
with a date on it. Retention is not the design problem. Nobody here needs
persuading that they should study English; they need the thing to be
usable on a phone between classes.

So the useful literature is the narrow slice about *instruction* — does
telling people how an interface works, before they use it, help them use
it — and the answer there is consistently no.

### The evidence on tutorials, coach marks and overlays

Nielsen Norman Group ran a between-subjects remote unmoderated
quantitative usability test with **70 participants across four iOS apps**
that used deck-of-cards tutorials on first launch. Participants who read
the tutorial rated ease of use **4.92**; participants who skipped it rated
it **5.49** — the tutorial group found the app *harder*. NN/g's summary of
the wider body of work is blunt: tutorials "interrupt users, don't
necessarily improve task performance, and are quickly forgotten."
([Mobile Tutorials: Wasted Effort or Efficiency
Boost?](https://www.nngroup.com/articles/mobile-tutorials/);
[Onboarding Tutorials vs. Contextual
Help](https://www.nngroup.com/articles/onboarding-tutorials/))

Two things to be careful about before importing that result. It is a
single study with a modest n, and the ratings difference is
self-selection-adjacent — people who skip tutorials may be more confident
users. But the direction agrees with the qualitative work on
[instructional overlays and coach
marks](https://www.nngroup.com/articles/mobile-instructional-overlay/),
where NN/g's finding is that users dismiss overlays fast and do not read
them, and that the technique only earns its place when it is *timely* —
attached to a user's first encounter with a specific feature while they
are trying to use it — rather than front-loaded.

That "timely and attached to the feature" caveat is the only version of a
walkthrough that survives contact with this app, and this app has exactly
one candidate for it: the listbox on the Test tab, which is a select-only
combobox that does not look like an OS picker. Even there, the honest fix
is to make the control legible, not to explain it.

### So: is a walkthrough ever right here?

No. Three reasons specific to this app rather than to onboarding in
general:

1. **There are two destinations and they are labelled.** The bottom nav
   says *Eğitim* and *Test* in the user's own language. A tour would be
   pointing at two words that already say what they mean.
2. **The interface is deliberately small.** `docs/design-system.md` §7
   lists twelve primitives; the redesign cut 45 ad-hoc component roots
   down to those twelve. An interface you need a tour for is an interface
   with a §7 problem, and the fix belongs in §7.
3. **A first-run flow is a tax on every install, paid by the person least
   invested.** The one thing we know about this audience is that they
   arrived with a purpose. Anything between the link and a lesson is
   friction charged at the worst possible moment.

The alternative — the one the research actually supports — is a **better
first screen**, not a screen before the first screen. Progressive
disclosure in its original sense: show what is needed now, keep the rest
reachable.

### What I would put on the first screen instead

Concretely, replacing today's `%0 · 0/18` opener in `js/education.js`'s
`renderProgressSummary`, and only when `completed === 0` and history is
empty:

> **English Prep**
> Üniversite İngilizce yeterlik sınavı için 18 gramer dersi ve
> paragraf soruları. Hesap yok, her şey bu telefonda kalır.
>
> [ İlk dersi aç ]   Tenses · Present Simple vs Present Continuous
>
> …veya seviyeni görmek için karışık bir test çöz.

What the user does: taps the primary button and is in a lesson. What
happens if they skip it: they scroll past it to the same 18 rows that are
there today. It is not a step, it is the empty state doing its job — it
names the app's purpose, offers one obvious first action, and states the
privacy fact that is otherwise buried in Profil.

The design rules this has to respect: it is one `surface` (§7.1 — the
heterogeneous case, exactly like `renderResumeCard`), it disappears the
moment the learner has any progress, and it replaces the `%0` bar rather
than sitting above it. A progress bar reading zero and an empty-state card
on the same screen is two ways of saying "you have done nothing".

**Cost:** one render branch in `education.js`, roughly 30 lines, plus a
string. No schema change, no storage change.

### The dev note, while we are here

`initDevNote()` shows a dismissible "Geliştirme aşamasındayız" banner
above everything, including above the empty state, on first run. It is
currently the *first* thing a new learner reads, and what it tells them is
that the thing they were sent is not finished. That is the right message
for the owner's friends today and the wrong one the day the owner declares
`1.0`. It is already keyed separately from history
(`englishPrep.devNoteDismissed`, deliberately not cleared by reset), so
retiring it is a one-line change — but it should be a decision, not a
leftover.

---

## 2 · Placement and diagnosis

This is the strongest argument for a first-run flow, and this app cannot
support it. The reason is arithmetic, not taste.

### What a placement test has to do to be worth taking

A placement decision is a norm-referenced decision — it sorts a learner
relative to a distribution — and the standard psychometric requirement for
one is a reliability coefficient the decision can stand on. Cronbach's
alpha is the usual estimate, it is
[appropriate precisely for placement
decisions](https://teval.jalt.org/test/bro_13.htm), and it rises with test
length. Published L2 cloze tests land anywhere from α = .31 to α = .95
([Brown, *Questions and Answers about Language Testing
Statistics*](https://teval.jalt.org/test/bro_3.htm)); a meta-analysis of
L2 listening tests found a mean α of **.818** across studies
([Zhang et al.,
2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11353186/)). Call α = .80
the floor for a decision you are willing to show a learner.

The adaptive route — a CAT that finds a level in fewer items — needs an
item pool, and the pool is the binding constraint. Reported
**pool-size-to-test-length ratios sit between 6 and 12 for most
operational CATs**, with some as high as 14
([Veldkamp & van der Linden, item pool design
work](https://www.researchgate.net/publication/259622247_OPTIMAL_ITEM_POOL_DESIGN_FOR_A_HIGHLY_CONSTRAINED_COMPUTERIZED_ADAPTIVE_TEST)),
and every item in a real pool carries calibrated IRT parameters obtained
by pretesting it on a representative sample. This app has 72 items,
calibrated on nobody.

### This app's actual position

Counted from `data/`: **3 topics × 6 categories × 4 questions = 72
questions.** Exactly four per category, and the category is the unit the
app teaches, links to and reports on.

Four items cannot support a per-category statement. Two ways to see it —
both tables below computed for this document, not quoted:

**Confidence intervals.** A learner's category score is a proportion out
of 4. 95% Wilson intervals:

| Items | Score | Observed | 95% interval | Width |
| --- | --- | --- | --- | --- |
| 4 | 2/4 | 50% | 15%–85% | 70 pts |
| 4 | 3/4 | 75% | 30%–95% | 65 pts |
| 4 | 4/4 | 100% | 51%–100% | 49 pts |
| 12 | 9/12 | 75% | 47%–91% | 44 pts |
| 40 | 30/40 | 75% | 60%–86% | 26 pts |

A learner who gets 3 of 4 right has a true rate somewhere between 30% and
95%. That is not a diagnosis; it is a coin with an opinion. Even a perfect
4/4 is consistent with a true rate of 51%.

**Reliability.** Suppose the whole 72-item bank were a good test with
α = .85. Spearman-Brown run backwards gives a mean inter-item correlation
of .073, and forwards again gives the alpha of each sub-length:

| Subtest | Implied α |
| --- | --- |
| 4 items (one category) | **0.24** |
| 8 items | 0.39 |
| 18 items (one per category) | 0.59 |
| 36 items (half the bank) | 0.74 |

Under a *generous* assumption about the whole bank, a category subtest has
α = 0.24. You would have to spend half the bank to reach 0.74, which is
still below the floor.

### And the pool problem is worse than the reliability problem

Even if the numbers worked, a diagnostic that draws from the practice bank
is spending the practice bank. An 18-item placement test (one question per
category — the minimum that could say anything about *which* categories
are weak) burns **25% of every question the app owns**, and burns it in
the worst way: those 18 questions are now seen, so their later use as
practice is contaminated by recognition rather than knowledge. The user
pays 18 questions to be told something with α = 0.59.

`docs/research/the-exam.md` establishes that the app covers roughly 12–19%
of the marks on the paper it targets. A placement test built on this bank
would place a learner on 12–19% of an exam, using a measure with less than
half the reliability it needs. It would be a confident-looking number
about almost nothing, which is worse than no number.

### Is a placement test possible here at all?

**Not now.** What would have to be true:

- **A separate, retired item set.** Placement items must not be practice
  items. That means authoring items whose only job is placement — call it
  30–40 of them — and accepting that they are spent on first use.
- **A pool several times larger.** At the 6:1 ratio floor, a 20-item
  adaptive placement needs 120 calibrated items *for placement alone*, on
  top of the practice bank.
- **Response data to calibrate on.** This app has no backend and no
  analytics, by design and correctly. Without response data there are no
  item parameters, so there is no adaptive selection — only a fixed form
  with a hand-guessed difficulty order. `docs/research/the-exam.md` and
  `docs/research/architecture-and-scale.md` are both pushing toward more
  content; neither pushes toward telemetry, and this brief should not be
  the thing that quietly introduces it.
- **A decision worth making.** Placement is only useful if it changes
  what the app shows. Today every lesson is open by design ("no locking,
  at any level" — `docs/education-notes.md`), and the redesign plan lists
  a guided path as explicitly deferred. A placement test with nothing to
  place you *into* is a quiz with a certificate.

### What the app should do instead — and mostly already does

**The diagnostic already exists. It is retrospective, and it is better
than the upfront one would have been.** `getWeakCategories()` in
`js/storage.js` aggregates per-category accuracy over all attempts and
`MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3` suppresses categories with too little
data. That is a diagnostic built out of practice the learner wanted to do
anyway, at zero cost in questions, and it gets *more* reliable the longer
they use the app rather than being fixed at a first-run snapshot.

Two changes would make it honest and one would make it visible:

1. **Raise the threshold, or show the count.** Three attempts is a
   90-point-wide interval. The row already shows `${correct}/${total}` —
   good — but a category with 2/3 sits in the list looking like a verdict.
   Either raise `MIN_ATTEMPTS_FOR_WEAK_ENTRY` to 6 (still weak, but no
   longer absurd) or add a `t-meta` qualifier on thin rows: "az veri".
2. **Do not invent a level.** No CEFR badge, no "B1", no overall
   percentage presented as proficiency. The app can honestly say *"bu
   kategoride 9 sorudan 4'ünü doğru yaptın"*. It cannot honestly say
   *"seviyen B1"*, and the second is far more tempting to build.
3. **Point the empty state at the mixed test as an orientation, not a
   test.** "…veya seviyeni görmek için karışık bir test çöz" is already
   close to the right framing on the Test tab
   (`"Seviyeni görmenin en hızlı yolu"`). That copy is a small
   overpromise; `"Nerede zorlandığını görmenin en hızlı yolu"` is true,
   and is the same sentence.

**Cost:** one constant, one string, one conditional label. Compare with
the placement test: 120+ new authored items and a data-collection
apparatus the project has refused on principle.

---

## 3 · Goals and commitment

Two questions are on the table: *"sınavın ne zaman?"* and *"günde kaç
dakika?"*. They have different evidence behind them and different failure
modes, and only one of them survives.

### The evidence that is genuinely strong

**Implementation intentions** — an if-then plan naming a specific
situation and a specific response — have the best replicated record in
this literature. Gollwitzer & Sheeran's meta-analysis of **94 independent
tests** found a medium-to-large effect on goal attainment, **d = .65**
([*Advances in Experimental Social Psychology* 38,
69–119](https://www.socmot.uni-konstanz.de/publications/implementation-intentions-and-goal-achievement-meta-analysis-effects-and-processes)).
That is a real effect and it is cheap to induce: asking someone when and
where they will act is a single question.

### The evidence that is quietly against it

The catch is the behaviour being targeted. Large randomised experiments
find planning prompts increase **one-time actions** — vaccination,
screening, voting. When the same intervention was pointed at a *repeated*
behaviour, it failed. Carrera, Royer, Stehr, Sydnor & Taubinsky randomised
**877 gym members**: the treatment group chose the days and times they
intended to attend over the following two weeks, the control group merely
recorded their past two weeks. The result was a **tightly estimated null**
— no effect on attendance — "even though the majority of subjects believed
that planning is helpful"
([*Journal of Health Economics*, Nov
2018](https://pubmed.ncbi.nlm.nih.gov/30336306/);
[NBER w24959](https://www.nber.org/papers/w24959)).

A companion finding from the education side: a micro-randomised trial with
**357 German fifth- and sixth-graders** sent evening planning prompts for
vocabulary study, and found the effect "crucially depended on plan
quality"
([*Contemporary Educational Psychology*,
2025](https://www.sciencedirect.com/science/article/pii/S0361476X25000876)).
A plan the app pre-fills is a plan of zero quality by construction.

"Kaç dakika çalışacaksın?" is exactly the repeated-behaviour case where
the effect disappears. It should not be built.

### The cost side, which is the part apps forget

Höpfner & Keith gave **185 participants** fictitious feedback about
attaining or failing an assigned high, specific goal. Failing it produced
measurable decreases in affect, self-esteem and motivation relative to
attaining it — their conclusion is that goal-setting interventions carry
"potential undesirable effects" for the self, not merely for the task
([*Frontiers in Psychology*
12:704790](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.704790/full)).
The applied version of this is the "what-the-hell effect": a small,
technically trivial miss triggers abandonment rather than correction.

That is the mechanism the design system already ruled against. In
self-determination terms, a daily target the app keeps score of is
**introjected regulation** — behaviour driven by internal pressure
regulated by contingent self-esteem, in which "instead of an external
authority applying pressure, the person applies pressure to themselves
through guilt, shame, ego-involvement, or anxiety"
([Ryan & Deci,
2000](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf)).
A streak is that with a number attached. A daily-minutes goal is that with
a number the app itself chose.

### Where the line is

The distinction that matters is not *goal vs no goal*. It is **whether the
app keeps score of a target the learner did not have before, and shows
them the deficit.**

- **A count of what you did** is a fact. `4 test · 68 soru · %71` in
  Profil is already this, and it cannot be failed.
- **A target with a running deficit** is a debt. "Bugünkü 15 dakikanı
  tamamlamadın" is a debt notice. It is the same sentence a streak
  counter says, in a different font.

The line is: **the app may never show a state the learner has failed.**

### What survives: the exam date, and only as arithmetic

*"Sınavın ne zaman?"* is different from *"günde kaç dakika?"*, because the
answer is a fact the learner already has and did not invent to please the
app. It cannot be failed, only approached. And it is the single most
useful piece of context the app could hold, because it converts a pile of
lessons into a quantity: 18 lessons, 40 days.

Concretely — an optional field in Profil, next to the name, never asked
for on first run:

> **Sınav tarihin** (isteğe bağlı)
> [ 12.11.2026 ]
> Sadece bu cihazda saklanır. Ders sayısını takvimine bölmek için
> kullanılır.

And what it buys, on the Eğitim index, above the lesson list:

> Sınava **41 gün**. 18 dersten 6'sı tamamlandı — kalan 12 ders için
> haftada 2 ders yeter.

Notice what that sentence is and is not. It is arithmetic on two numbers
the learner supplied. It is not a target the app set, there is no daily
quantum, nothing turns red, and if the learner does zero lessons for a
week the sentence recomputes to "haftada 3 ders" rather than reporting a
shortfall. When the date passes, the field clears itself and the line
disappears — the app must never say "sınavın geçti".

The one implementation intention worth offering is the one the literature
actually supports, and it belongs at the *end* of a lesson rather than at
the start of the app: after finishing a lesson, "Sıradaki ders: Present
Perfect vs Past Simple" is already there. That is a specific next action
attached to a completed one, which is the shape the effect has.

**Cost:** one storage key, one date input, one computed line, one clearing
rule. Roughly a day. **The temptation to resist** is letting the exam date
grow a daily target — the moment it does, everything above applies to it.

---

## 4 · Identity without accounts

### What identity is for here

Today `englishPrep.profileName` produces one character in a circle. That
is not nothing — a name in an interface makes it *yours*, and this app is
a personal artefact rather than a service — but it is doing one job when
it could do two.

The second job is the useful one: **identity is how the learner
understands which pile of data they are looking at.** With no accounts,
the app's data is not attached to a person, it is attached to a *browser
on a device*. Everything confusing about local-first apps flows from that
mismatch, and it is invisible until the moment it hurts:

- Same phone, Safari and Chrome: two separate learners.
- Same phone, Safari tab and the home-screen icon: on iOS, **two separate
  learners** (§7).
- New phone: no learner at all.
- Private browsing: a learner who evaporates when the tab closes.
- A friend borrowing the phone: silently the same learner.

The `storage.js` header comment says it exactly right — "so it survives
across visits on the same device/browser" — and the user-facing copy never
says the second half. Profil says *"sadece bu cihazda saklanır"* under the
name field, which is a privacy reassurance. It is also, read the other
way, a warning, and it is not placed where the warning matters.

### What good account-free apps do

The reference frame is Ink & Switch's local-first essay, whose ideals
include **longevity** ("a user's data should continue to be accessible
indefinitely") and **user control**
([*Local-first software: You own your data, in spite of the
cloud*](https://www.inkandswitch.com/essay/local-first/)). Most of the
seven ideals need CRDTs and a sync server and are out of scope. Two do
not, and they are precisely the two this app is missing:

1. **The data has a visible, nameable form.** In a good local-first app
   you can point at your data — it is a file, a vault, a folder. Here it
   is an invisible key-value store on an origin the learner has never
   heard of. Making it nameable costs one screen.
2. **The data can leave.** Section 5.

### What I would do with identity

Keep the name cosmetic, and stop pretending it is the identity feature.
Add, in Profil, under a heading like **Verilerin**, a short block that
says what is actually true, in the learner's own language:

> **Verilerin**
> Her şey bu tarayıcıda saklanıyor — hiçbir yere gönderilmiyor. Telefon
> değiştirirsen ya da tarayıcı verilerini silersen ilerlemen gider.
> `6 ders · 4 test · 68 soru`
>
> [ Yedek al ]   [ Yedeği geri yükle ]

That block is the identity feature. The name goes on the backup file
(`english-prep-deniz-2026-11-12.json`), which is the first time it does
any work beyond decoration — when a learner has two backups they need to
tell them apart.

One further thing worth detecting rather than explaining: **storage that
does not work.** `storage.js` already swallows every failure, which is the
right behaviour for the app and the wrong behaviour for the learner. A
single write-read probe at boot (`localStorage.setItem` of a throwaway key,
read it back, remove it) distinguishes "works" from "silently discards" —
the iOS private-browsing and blocked-storage cases. If it fails, one quiet
line in the same block: *"Bu pencerede ilerleme kaydedilemiyor — gizli
sekmede olabilirsin."* Not a modal. Not a blocker. A fact, once, where the
learner is already looking at facts about their data.

**Cost:** the block is ~40 lines in `profile.js` plus a `probeStorage()`
in `storage.js`. The buttons are section 5.

---

## 5 · Portability

This is the sharpest question in the brief, and the honest starting point
is that **the app currently loses data on a schedule, on the platform most
of its users are on.**

### The threat, stated precisely

WebKit's storage policy: *"Safari proactively evicts data when cross-site
tracking prevention is turned on. If an origin has no user interaction,
such as click or tap, in the last seven days of browser use, its data
created from script will be deleted."* The policy covers LocalStorage,
IndexedDB, sessionStorage, Cache and service worker registrations, and it
dates from iOS 13.4 / Safari 13.1
([*Full Third-Party Cookie Blocking and
More*](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/);
[*Updates to Storage
Policy*](https://webkit.org/blog/14403/updates-to-storage-policy/)).

Read that against the brief's own scenario. **"Someone comes back after
two weeks" is, on iOS Safari, someone whose progress has already been
deleted** — not by accident, not by a bug, by design and on purpose. It is
seven days *of browser use*, not seven calendar days, so a learner who
stops using Safari entirely buys time; a student who browses daily and
does not open this app does not.

There are two documented escapes. The first is installation: web apps
added to the home screen *"are not part of Safari and have their own days
of use counter"*, so the timer that deletes a Safari tab's data does not
run against them. The second is persistence — eviction *"skips over
origins that have been granted data persistence by using
`navigator.storage.persist()`"*
([MDN, *Storage quotas and eviction
criteria*](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)).
And on WebKit, persistence is granted *"based on heuristics like whether
the website is opened as a Home Screen Web App"*
([MDN, `StorageManager.persist()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)).
In practice this reduces to: **on iOS, `persist()` succeeds for
home-screen web apps and effectively nowhere else.** That is the whole
reason section 7 is not a cosmetics question.

Chrome is milder and grants persistence silently by heuristic — high site
engagement, bookmarked, installed, or notifications granted — never by
prompt
([web.dev, *Persistent
storage*](https://web.dev/articles/persistent-storage)). Android Chrome
does not evict on a timer the way Safari does; it evicts under storage
pressure, worst-origin-first.

**So the two-line summary:** call `navigator.storage.persist()` — it is
three lines and it is free on Chrome — but do not let it be the plan,
because on iOS it will return `false` for anyone who has not installed the
app, and the app cannot tell them why in a way they will act on.

The plan has to be an export the learner holds.

### How big is the thing being moved

Measured by constructing payloads against the real storage schema in
`js/storage.js` (history attempts with per-topic and per-category
breakdowns and a per-question record, plus lesson progress for all 18
lessons, plus name and seen-versions):

| History size | Raw JSON | `deflate-raw` | base64url |
| --- | --- | --- | --- |
| 10 attempts | 13.6 KB | 1.6 KB | 2,107 chars |
| 30 attempts | 42.3 KB | 3.3 KB | 4,355 chars |
| 100 attempts | 132.2 KB | 8.2 KB | 10,988 chars |

Two things follow. The payload is small enough that *every* transport is
technically viable, so the choice is about what a person can actually do
on a phone, not about bytes. And it is not bounded — history is append-only
and grows without limit, so any transport with a hard ceiling will work
in testing and fail for the one friend who used the app most.

### The options, and what each actually supports today

**A JSON file downloaded and re-uploaded.** The download half is where iOS
gets contradictory. iOS 13 added a Safari download manager; whether the
HTML `download` attribute is honoured on iOS Safari is asserted both ways
across the sources reachable from here, and the most-cited "not supported"
claim traces to a [2017 Apple Developer Forums
thread](https://developer.apple.com/forums/thread/91631) that predates the
download manager entirely. There are also fresher reports of blob-URL
download regressions
([starting around iOS
18.2](https://www.simon-neutert.de/2025/js-safari-media-download/)) and of
downloads not reaching Files without a manual step. **I could not settle
this from a primary source and I am not going to pretend otherwise — it
must be checked on a real iPhone, which is a step the project's roadmap
already has.** The upload half is fine everywhere: `<input type="file">`
on iOS opens the Files/Photos picker and has for years.

**`navigator.share({ files })`.** The native share sheet, which on iOS is
the mechanism people already use to move a file to Files, AirDrop, or
WhatsApp. Level 2 file sharing landed in iOS 15 / Safari 15, with
[reported inconsistencies when files are combined with `text` or
`title`](https://github.com/mdn/browser-compat-data/issues/13439).
Requires a transient user activation and a `canShare()` guard. This is
strictly better than a download link *on iOS*, because it hands the file
to the OS instead of to Safari's download plumbing.

**A URL fragment.** Everything after `#` never leaves the device, so there
is no server limit and GitHub Pages never sees it. The binding constraint
is the browser: Chrome ~32 kB, Safari ~80 kB, but **Android Chrome caps
around 8,192 characters** for some operations
([SISTRIX](https://www.sistrix.com/ask-sistrix/technical-seo/site-structure/url-length-how-long-can-a-url-be)).
Against the table above, 30 attempts fits and 100 attempts does not.
Compression is free and dependency-free: `CompressionStream("deflate-raw")`
is [supported in every current
browser](https://web.dev/blog/compressionstreams), Safari from 16.4.

**A QR code.** A version-40 QR at error-correction level L holds **2,953
bytes** in byte mode, in a **177×177** module grid
([DENSO WAVE](https://www.qrcode.com/en/about/version.html)). Our 10-attempt
payload fits; 30 does not. Generating one needs a Reed–Solomon encoder we
would have to write — several hundred lines, no dependencies allowed —
and reading one needs either `BarcodeDetector` (not in Safari) or the
phone's own camera app resolving a URL. It is the most charming option and
the one with the lowest ceiling and highest build cost. Out.

**File System Access API.** `showSaveFilePicker` is a desktop-Chromium
feature. It is not in Safari at all and not in Chrome on Android. For a
mobile-first app it does not exist.

**Origin Private File System.** Well supported, and irrelevant: the
"origin private" in the name is the point. OPFS is invisible to the user,
unreachable by other apps, and evicted by the same policy as everything
else. It solves storage, not portability.

**`navigator.storage.persist()`.** Not a transport. Do it anyway (see
above), as a floor, not a plan.

### What I would build

**A single "Yedek al" that produces one JSON file, offered through
`navigator.share` where available and a download link otherwise, plus a
"Yedeği geri yükle" that takes a file *or* pasted text.**

Concretely, in Profil under **Verilerin**:

- **Yedek al** → builds `{ v: 1, exportedAt, name, history, lessonProgress,
  seenVersions }`, pretty-printed, filename
  `english-prep-<isim>-<tarih>.json`. If `navigator.canShare({ files })`,
  call `navigator.share`; otherwise create a blob URL on an `<a download>`
  and click it. Both paths need the same transient activation, so both
  hang off the same tap.
- **Yedeği geri yükle** → a screen with an `<input type="file"
  accept="application/json,.json">` **and** a `<textarea>`. The textarea is
  not a fallback afterthought; it is the path that cannot fail. A learner
  who cannot get a file from one phone to another can always paste text
  into WhatsApp and paste it out again, and no API is involved on either
  end. It is also the accessible path and the one that works in every
  browser ever made.
- On import, show what was found *before* writing anything: "6 ders
  ilerlemesi, 4 test, 68 soru — 12 Kasım 2026 tarihli yedek." Then
  **Birleştir** and **Değiştir**.

### Import should merge, and the data already allows it

This is the part that decides whether import is safe, and the existing
schema makes it easy:

- **History attempts** carry a `date` and are append-only. Union by
  `(date, mode)` and sort — importing your own backup twice is a no-op,
  and importing a phone that has diverged gains you both sets of practice.
- **Lesson progress** is `{ read, done }` where `recordLessonRead` already
  only ever moves forward. Merge is `max(read)`, `done || done`. That is
  the function `recordLessonRead` already implements, applied pairwise.
- **Seen versions** merge by `max`.
- **Name** — keep the local one unless it is empty.

So **Birleştir** is the default and it is genuinely non-destructive;
**Değiştir** exists for the "this phone has junk on it" case and goes
through the same `<dialog>` confirmation as `Geçmişi sıfırla`.

Three sharp edges to get right:

1. **Lesson ids are derived, not authored** — `lessonId(topicId, category)`
   in `js/topics.js`. A category rename renames the lesson and orphans its
   progress, and the same is true across an import from an older build.
   The importer must therefore drop unknown lesson ids **silently and
   count them**: "3 ders ilerlemesi bu sürümde yok, atlandı." Never fail
   the import over content drift, and never write an id no lesson has.
2. **Version the file and validate it.** `v: 1`, and a shape check as
   paranoid as `readJson`'s. An import is the only place in this app where
   untrusted data enters storage, and the app has a strict no-`innerHTML`
   rule precisely because it takes that seriously elsewhere. Numbers get
   clamped, strings get length-capped, arrays get type-checked, unknown
   keys get dropped.
3. **Offer the backup at the moment of destruction.** The reset dialog is
   currently the only path that destroys data and it offers no way out.
   One extra line in it — *"Silmeden önce yedek almak ister misin?"* with a
   Yedek al button — costs nothing and is the single highest-value place
   this feature can appear.

### Why the others lose

- **URL fragment / QR:** have a ceiling that the data will eventually
  cross, and the failure is silent truncation on the phone of the person
  who used the app most.
- **File System Access:** absent on both target platforms.
- **OPFS:** solves a different problem.
- **`persist()` alone:** on iOS, only works for the population that has
  already installed, which is the population least at risk.
- **A backend:** would solve this completely and is refused by the
  project's first constraint. Worth being explicit about the trade rather
  than silent: the cost of no accounts is that data portability is a
  manual act the learner has to perform, and every design above is an
  attempt to make that act as close to one tap as a static site can get.

**Cost:** export ~60 lines, import UI ~120, merge logic ~80 plus tests.
The merge functions are pure and belong next to `quiz-engine.js` in the
tested-without-a-browser half of the codebase. Call it two days including
the unit tests, and it is the highest-value two days in this document.

---

## 6 · Coming back after a gap

### The reframe that is actually true

A two-week absence is not a lapse to be recovered from. For someone
sitting an exam in a couple of months, it is roughly the spacing interval
the literature would have chosen.

Cepeda, Vul, Rohrer, Wixted & Pashler taught **over 1,350 people** a set of
facts, reviewed them after gaps of up to 3.5 months, and tested at delays
of up to a year. The optimal gap between study and review scaled with the
retention interval: **about 20–40% of a one-week delay, falling to about
5–10% of a one-year delay**
([*Psychological Science* 19:1095–1102](https://files.eric.ed.gov/fulltext/ED505660.pdf)).
Interpolating for an exam eight weeks out puts the useful gap in the range
of one to two weeks. The larger meta-analysis behind it — **839
assessments across 317 experiments** — found the same joint dependence of
optimal inter-study interval on retention interval
([Cepeda et al., *Psychological Bulletin* 132:354–380](https://www.yorku.ca/ncepeda/publications/CPVWR2006.html)).

Be careful with this. That research is about spacing *deliberate review of
the same material*, not about being absent from an app, and it does not
license the app to tell a learner their two weeks off was good for them.
What it does license is the app not treating the gap as a problem — which
is the only thing the first screen has to get right.

### What the first screen should show

The failure mode to avoid is the one every consumer app has: the guilt
banner. "14 gün oldu!", a broken streak, a red number. That is section 3's
introjected regulation with a calendar attached, and this project has
already refused it once.

The opposite failure is doing nothing, which is where the app is now: the
resume card in `renderResumeCard` renders identically after ten minutes
and after ten weeks, saying "Kaldığın yer · %73". After two weeks that is
a slightly odd thing to be told, because the learner does not remember
what was at 73%.

The right move is to change **what is offered**, not to comment on the
absence. The data to do it already exists and nothing reads it:
`attempt.date` is written on every attempt in `results.js` and never used
for anything.

When the most recent activity is more than ~10 days old and there is
prior progress, the Eğitim index leads with a **re-entry card** instead of
the plain resume card:

> **Kaldığın yer**
> Present Perfect vs Past Simple — %73
> [ Kaldığın yerden devam et ]
> [ Önce 5 soruyla hatırla ]

The second button is the one that matters, and it needs no new machinery:
`startCategoryPractice(getWeakCategories()[0].category, 5)` already exists
and already does exactly this, falling back to `startMixedTest(5)` for a
learner with no test history. This is retrieval practice as re-entry: it
takes ninety seconds, it tells the learner what they still have rather
than what they lost, and unlike re-reading a lesson at 73% it produces
something to act on.

Two rules for the copy: **never name the number of days**, and **never use
a word that implies fault**. "Hoş geldin" is fine. "Uzun zamandır yoksun"
is not. The card should read as a menu, not as a greeting from someone
who was waiting.

There is also a genuinely positive thing to say to a returner that has
nothing to do with them: **new content**. `getSeenVersion` /
`markTopicSeen` already power a "Yeni" chip, but only on the Test tab's
topic rows. A returner arrives on Eğitim and never sees it. Surfacing
"Passive Voice'a 8 yeni soru eklendi" on the re-entry card is news about
the app, not a verdict about the learner, and it is the one message that
gets better the longer they were away.

One trap in the wiring, found while checking it: every launcher in
`js/quiz-launch.js` calls `markSeen` on **all** live topics before
navigating (`topics.forEach(markSeen)` in both `startCategoryPractice` and
`startMixedTest`). So the "5 soruyla hatırla" button would clear every
"Yeni" badge on its way out, deleting the news at the moment of showing
it. The re-entry card has to read `getSeenVersion` **before** it renders
its buttons, and the news line has to survive the tap that follows.

**Cost:** a `getLastActivity()` in `storage.js` reading `max(attempt.date)`
against lesson progress (which has no timestamps — see the open questions),
one extra render branch, one button. Half a day.

---

## 7 · Installability and distribution

Another arm of this round covers offline mechanics. This section is only
about what the user sees, decides and believes.

### What installation actually buys, per platform

**On iOS it buys the learner's data.** This is not a nicety. Per section
5, WebKit deletes script-written storage after seven days without
interaction, and `navigator.storage.persist()` is granted "based on
heuristics like whether the website is opened as a Home Screen Web App".
A learner who uses this in a Safari tab is on a seven-day timer; a learner
who adds it to the home screen is not. **On iOS, "Ana Ekrana Ekle" is the
save button.**

**On Android it buys an icon.** Chrome does not evict on a timer, grants
persistence silently by engagement heuristics, and — crucially — **shares
storage between the installed WebAPK and the browser**, same origin, same
data. Installing changes how the app is launched and nothing about whether
the data survives.

### What it costs, and the trap in the middle

The cost on iOS is worse than it looks, and it is the most important thing
in this section:

**On iOS, a home-screen web app has its own storage container. It does not
share `localStorage`, cookies or service workers with Safari**
([WebKit bug 181849](https://bugs.webkit.org/show_bug.cgi?id=181849), open
since 2018 and still describing current behaviour). Which means:

> A learner uses the app in Safari for two weeks, finishes six lessons,
> then follows the app's own advice and adds it to the home screen. The
> icon opens an app with **zero progress**. Their six lessons are still in
> Safari, invisible from the icon they will now use every day.

That is a data-loss event caused by the app's own suggestion, and it is
silent. iOS 26 makes it more likely rather than less: **every site added
to the Home Screen now opens as a web app by default**, without needing a
manifest, with an "Open as Web App" toggle the user has to notice and turn
*off*
([heise](https://www.heise.de/en/news/iOS-26-and-iPadOS-26-Changed-web-app-behaviour-on-the-home-screen-10749652.html);
[iDownloadBlog](https://www.idownloadblog.com/2025/06/17/apple-ios-26-safari-web-apps-home-screen-bookmarks/)).
The previous escape hatch — "add to home screen without a manifest and it
opens in Safari with your data" — is closing.

**So installation must not be recommended before export/import exists.**
The correct order is: build section 5, then recommend installing, then
have the install advice say, in the same breath, "önce yedek al, sonra
uygulamada geri yükle." A three-step instruction is bad. A three-step
instruction is much better than silently resetting someone's progress.

### The prompt

There is no prompt to build on iOS. Safari does not implement
`beforeinstallprompt`
([Apple Developer Forums feature
request](https://developer.apple.com/forums/thread/807603)), so the only
route is Share → Ana Ekrana Ekle, performed by hand, by a user who mostly
does not know the option exists.

Chrome on Android does fire `beforeinstallprompt`, gated on a valid
manifest served over HTTPS, at least one tap on the page, and ~30 seconds
of viewing
([web.dev, *Installation
prompt*](https://web.dev/learn/pwa/installation-prompt/)). Since Chrome
108 on mobile a service worker is no longer required to be *installable*
from the menu, though the automatic prompt heuristic still wants a fetch
handler
([Chrome for Developers, *Revisiting Chrome's installability
criteria*](https://developer.chrome.com/blog/update-install-criteria)).

For six friends, none of this machinery is worth building. **The install
instruction is a WhatsApp message from the owner, plus one short static
section in Profil** with two platform-specific paragraphs and no
detection, no banner, no `beforeinstallprompt` handler, and above all no
interstitial. An install prompt on first run is a first-run flow wearing a
different hat, and section 1 already answered that.

### The manifest, and the icon that is missing

There is currently **no `manifest.webmanifest`, no `apple-touch-icon`, and
no PNG of any kind in the repository** — the favicon is an inline SVG data
URI of the 📘 emoji, which iOS will not use. Adding to the home screen
today produces an icon made from a screenshot of the page. That is the
single most visible "this is not a real app" signal there is, and a missing
or unreachable icon can also block installation on iOS.

The minimum, and it is genuinely minimum:

- `manifest.webmanifest` with `name`, `short_name` ("English Prep"),
  `start_url: "./"`, `scope: "./"`, `display: "standalone"`,
  `background_color` and `theme_color` matching the existing
  `#13100d`, and `icons` at 192 and 512 (maskable variant for Android).
- `<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">` at
  180×180, because iOS reads that and not the manifest's icon array on
  older versions.
- `<link rel="manifest" href="manifest.webmanifest">` in all three HTML
  files, not just `index.html`.

The icons are the only asset this project would gain that is not text, and
they need to be drawn to the §6 icon contract rather than generated.

### The link preview, which nobody asked about and matters more

This app is distributed as a URL pasted into a chat. Right now that paste
produces a bare link: `index.html` carries a `<meta name="description">`
and **no Open Graph tags at all**. In WhatsApp, Instagram DMs and Telegram,
the preview card *is* the first impression — it arrives before the app
does, and it is the only onboarding that happens before the tap.

`og:title`, `og:description`, `og:url` and a 1200×630 `og:image` at an
absolute URL, kept [under WhatsApp's ~300 KB
ceiling](https://www.techcompare.app/open-graph-viewer/whatsapp-link-previews),
turn "erendenizk.github.io/english-prep" into a card that says what the
thing is in Turkish. Static tags in static HTML — WhatsApp does not run
scripts, which suits this app exactly. Half an hour of work, applied at the
one moment every single user passes through.

---

## 8 · What I was not asked

### The origin is shared with every other project the owner publishes

The repository is `ErenDenizK/english-prep`, so unless a custom domain has
been configured the Pages URL is
`https://erendenizk.github.io/english-prep/`. The security origin is then
**`erendenizk.github.io`**, not the path. Storage,
quota, permissions and eviction are all per-origin, so:

- Every GitHub Pages project under that account shares one `localStorage`.
  The `englishPrep.` key prefix in `storage.js` already prevents
  collisions, which was good instinct; it does not prevent one project's
  data blowing the shared quota, and it does not namespace anything the
  browser itself keys by origin.
- `navigator.storage.persist()` is granted or refused for the **whole
  account's** Pages, not for this app.
- A service worker registered by any other project at the account root
  could claim this app's scope.
- WebKit's seven-day interaction counter is also per-origin — which cuts
  the app's way, since visiting any of the owner's other Pages resets it,
  but is not something to rely on.
- "Clear website data" for `erendenizk.github.io` deletes everything, for
  everything.

A custom domain (or a dedicated `github.io` account) makes the app its own
origin and removes all five at once. It is a DNS record and a `CNAME` file,
it costs whatever a domain costs, and it also makes the shared link
something a person can read out loud — which for an app distributed by
word of mouth is not a small thing.

### Lesson progress has no timestamps, and section 6 needs one

`recordLessonRead` stores `{ read, done }` and nothing else. `attempt.date`
exists on the history side and is never read. So "when was this learner
last here" is currently answerable from tests but not from lessons — a
learner who only reads lessons has no last-seen date at all. Adding an
`at` field to the lesson progress record is a one-line schema change that
`getAllLessonProgress`'s existing normalisation would absorb, and it is
the precondition for both the re-entry card and any honest "kaldığın yer"
recency. Old records without it simply read as "unknown", which the
existing `clampRead` pattern handles the same way.

### The file input is where "prefer the platform" cuts the other way

`docs/design-system.md` and CLAUDE.md both record the reasoning: the
listbox exists to *avoid* handing the screen to the OS, the dialog exists
because the platform gets top layer and focus containment right. An import
screen needs `<input type="file">`, which is the most OS-handing control
there is — and here that is correct, because the OS file picker is the
only thing that can reach a file the browser did not create. Worth writing
down so the next session does not "fix" it into a custom control. The §8.1
44px target applies to whatever triggers it, and the input itself should be
visually hidden behind a real `.btn` with a `<label>`, not restyled.

### Anything built here has to be added to the browser sweep

`tools/verify-ui.mjs` walks a full learner journey and audits every screen
it lands on. An import screen, a re-entry card and an empty state are three
new screens it does not know about. CLAUDE.md is explicit that adding to
the sweep is part of the change rather than a follow-up — and the empty
state in particular is the one screen that only exists when storage is
empty, which is exactly the state a fresh browser context starts in, so it
is nearly free to cover.

### Two people, one phone

The name field implies personhood the storage model does not have. If a
friend borrows the phone and does a test, it lands in the owner's history
and quietly moves their weak-category ranking. Nothing in this brief should
be read as a reason to build profile switching (see refusals) — but the
**Verilerin** block in §4 is also the honest place to say what the name is
and is not.

### The best onboarding this app has is its results screen

The moment after a test is the one moment a learner is actively interested
in what to do next, and `results.js` already ranks categories worst-first
and links each to its lesson. Anything this document proposes about
"pointing the learner at what they do not know" is weaker than what that
screen already does. It is worth saying plainly: **the app's best
onboarding is its results screen**, and the first-run problem is largely
the problem of getting a new learner to one.

---

## What I would build for v1

Ordered. Sizes are honest and assume no new dependencies.

1. **Call `navigator.storage.persist()` at boot.** Three lines, guarded,
   result ignored. Free on Chrome, and on iOS it costs nothing to ask.
   *~15 minutes.*
2. **Open Graph tags on all three pages**, plus a real
   `<meta name="description">` naming the exam. The link preview is the
   first impression for every user this app will ever have, and it is
   currently blank. *~1 hour, plus the image.*
3. **The first-run empty state** in `js/education.js` — what the app is,
   one primary action into the first lesson, the privacy fact. Replaces
   the `%0` progress bar when there is no progress. *~half a day.*
4. **Export / import, with merge.** One `Yedek al` (share sheet where
   available, download link otherwise), one restore screen taking a file
   *or* pasted text, a preview before writing, and a merge that is
   non-destructive by construction. Pure merge functions with unit tests
   alongside `quiz-engine`. **This is the item that matters.** *~2 days.*
5. **The Verilerin block in Profil**, plus a boot-time storage probe, plus
   "önce yedek al" inside the reset dialog. This is what makes item 4
   discoverable rather than a feature nobody finds. *~half a day.*
6. **Icons and manifest** — `apple-touch-icon` at 180, manifest icons at
   192/512, `manifest.webmanifest`, linked from all three pages — then a
   short static install section in Profil with the two platform
   paragraphs. **Only after item 4**, because on iOS the install advice
   moves the learner into an empty storage container and the backup is the
   bridge. *~1 day plus drawing the icon.*
7. **The re-entry card**, gated on last activity older than ~10 days,
   offering "devam et" and "5 soruyla hatırla", plus the "new content"
   line. Needs the lesson-progress timestamp. *~half a day.*
8. **Weak-spot honesty** — raise `MIN_ATTEMPTS_FOR_WEAK_ENTRY` or label
   thin rows, and change the mixed-test copy from "seviyeni görmenin" to
   something the app can actually deliver. *~1 hour.*

Roughly a working week, and items 1, 2, 5 and 8 together are under a day.

## What I would defer

- **The exam-date countdown (§3).** The design is written and it is small,
  but it sits one bad copy decision away from being a guilt mechanic, and
  the owner has already rejected one gamification proposal on exactly that
  ground. Pick it up when the owner says the countdown is on the right
  side of the line and agrees the app will never show a daily target.
- **A placement test (§2).** Pick it up when there is a **separate
  placement item set of 30+ questions that is not the practice bank**, and
  a guided path for a placement result to feed. Adaptivity needs
  calibrated item parameters, which need response data, which needs a
  backend — so adaptive placement is not deferred, it is out.
- **`beforeinstallprompt` handling and a custom install UI.** Worth it at
  a scale this app does not have. Revisit if the app is ever shared beyond
  people the owner can text.
- **QR transfer.** Revisit only if a Reed–Solomon encoder ever arrives for
  another reason, and never as the primary path — its ceiling is ~10
  attempts of history.
- **A custom domain.** Cheap and clarifying (§8), but it changes the
  origin, which **deletes every existing learner's progress**. Do it
  either before anyone has data worth keeping, or after item 4 ships and
  the friends have been told to take a backup first. Not in the middle.
- **Lesson-progress timestamps as a general event log.** The one `at`
  field is enough for §6. A richer local event log is
  `docs/research/architecture-and-scale.md`'s territory, not this one.

## What I would refuse

- **A first-run tour, carousel, or coach marks.** The evidence is against
  it (§1) and the app is a bottom nav with two labelled words.
- **A daily goal, a minutes target, or a streak.** Introjected regulation
  with a number attached (§3). The app may count what happened; it may
  never display a state the learner has failed.
- **A single proficiency number — a CEFR band, a "level", a percentage
  called your English.** The bank cannot support it (§2), it would be the
  most-screenshotted thing in the app, and it would be wrong.
- **Any interstitial before the first lesson** — including an install
  prompt, a "welcome" modal, a name prompt, or a cookie-style storage
  notice. The privacy fact belongs in the empty state as one line of copy.
- **Notifications, and any re-engagement that reaches out.** No push, no
  email, no "haven't seen you" anything. The app has no server to send
  from and should not acquire one for this.
- **Accounts, framed as backup.** The most standard fix for §5 is "sign in
  to sync", and it would trade the project's defining constraint for a
  problem that a JSON file solves.
- **Profile switching / multiple learners per device.** It looks like the
  answer to §4's ambiguity and is not: it doubles every storage path,
  invites a "who are you" screen on launch, and serves a case (sharing a
  phone) that a second browser profile already handles.
- **Auto-importing from a URL fragment.** If backup-by-link is ever built,
  the fragment must land on a preview screen requiring an explicit tap.
  A link that silently replaces someone's progress on open is a link
  someone can be sent.
- **Telling the returning learner how long they were gone.** Change what
  is offered; never count the days (§6).

## Open questions for the owner

1. **Is the app allowed to name the exam?** The empty state's whole value
   is saying "üniversite İngilizce yeterlik sınavı" out loud, and
   `docs/research/the-exam.md` targets YTÜ's İYS specifically. Naming a
   named university's exam in an unaffiliated app is a judgement call, not
   a design one.
2. **What do the friends actually carry — iPhone or Android?** It changes
   the priority order in this document more than anything else. If they
   are all on iPhones, items 4 and 6 are urgent and everything else is
   decoration. If they are all on Android, the seven-day problem largely
   evaporates.
3. **Countdown or no countdown?** §3 argues an exam date is on the safe
   side of the line and a minutes goal is not. The owner rejected
   gamification once already and gets to decide where this one sits.
4. **Merge or Replace as the import default?** I recommend Merge. Replace
   is simpler to explain and simpler to reason about, and the owner may
   prefer "this backup *is* your progress now" as a promise.
5. **Custom domain, and when?** It fixes the shared origin (§8) and
   destroys existing progress. There is a window to do it cheaply and it
   is closing.
6. **Is `MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3` a deliberate number?** At three
   attempts a "weak category" verdict rests on a 90-point-wide interval.
   Raising it makes the list emptier and truer.
7. **Does the dev note retire at 1.0, or stay?** It is currently the first
   thing a new learner reads.
8. **How much does the owner want to know about how this is going?** Every
   design in this document is deliberately blind — no analytics, no
   telemetry, no way to learn whether anyone finished a lesson. That is
   correct for the learner and genuinely costly for the author, and it is
   worth saying out loud once rather than discovering it later.
