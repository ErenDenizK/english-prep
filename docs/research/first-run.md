# First run, the topic level, and the pile-up

What a learner meets when they open this app, in what order, and why the
Eğitim index has stopped working — plus whether the topic intro should be
promoted to something that reads like *ders 0*.

Written 2026-09-04 against the `v0.21` build (8 topics, 48 lessons, 193
questions — the build in which the topic intros shipped). Three questions
were asked; a fourth arrived mid-research and outranks all of them, so it
is answered first.

> **konular çok yığılıyor** — a friend using the app, relayed by the owner.
> He is explicit that he is not prescribing a fix.

**The short version.** The friend is right and the measurement agrees with
him: the Eğitim index is **5,332px at 320 — 8.3 screens** — and it is
2.5× the next-longest screen in the app. Two thirds of that is 48 lesson
rows and a fifth is eight topic headers that grew from one object to
three in `v0.21`, which shipped today. The flat index was a good decision
at 18 lessons and is a bad one at 48; it will be worse at 60.

The fix that answers the pile-up and the owner's *ders 0* request at the
same time is **one change, not two**: make the index a list of **eight
topics**, and make the topic screen — which already exists at
`#egitim/konu/<topicId>` and already renders the intro *and* the lesson
rows — the way into a topic. The index goes from 5,332px to about
**1,070px**, from 48 rows to 8, and the intro stops being a quiet button
under a heading and becomes the head of the screen every learner passes
through on the way to a lesson. That is *ders 0* without a fake lesson,
without a schema change, and without adding a single row to a list that
is already too long.

What it costs is one tap for the learner who knew exactly which lesson he
wanted, and §1.6 is about paying that back rather than pretending it is
free.

On onboarding: **the evidence still does not support a first-run flow, and
this repository has already refused one on better grounds than most
projects manage.** What it supports is what the app already does — an
empty state that names the app and offers one action, and a pretest that
delivers a first success in two taps. The two things worth changing are
that the purpose statement is destroyed by the learner's first tap
(`js/education.js:211`) and that the pretest's rationale still sits above
the question, which puts the first tappable option below the 320 fold.

---

## A caveat that is worse than usual, stated first

`docs/research/README.md` records that this environment's egress blocks
the publishers. It is worse in this session: **`WebFetch` was refused for
every domain tried except `github.com`.** Blocked, each verified by
attempting it: `nngroup.com`, `chernev.com`, `arxiv.org`,
`pmc.ncbi.nlm.nih.gov`, `files.eric.ed.gov`, `researchgate.net`,
`en.wikipedia.org`, `apps.apple.com`, `docs.ankiweb.net`,
`brilliant.org`, `khanacademy.org`, `blog.duolingo.com`,
`pageflows.com`, `gallery.reteno.com`, `junoschool.org`,
`humanfactors.com`.

After fifteen consecutive refusals I stopped attempting fetches, so
below, **"refused"** and **"blocked"** both mean the domain was tried and
the proxy refused it; **"not fetched"** means it was never tried. Neither
was read.

So **every external number and every product flow in this file comes from
a search index's summary of a page, not from the page.** They are cited to
their canonical URLs so they can be checked, and each one that carries a
number says where it came from. Two consequences worth naming rather than
burying:

- I could **not** read a single primary source for §5. The product flows
  below are third-party design-gallery and review-blog descriptions of
  apps I could not install or open. Where a flow is load-bearing for a
  recommendation, the recommendation does not rest on it alone.
- Everything measured **from this repository** — every pixel arithmetic,
  every line number, every behaviour traced through the code — was done
  here and is not affected. The measurements table in §0 was taken by the
  supervisor in Chromium at 320×640 before this arm started and is treated
  as given.

---

## 0 · What is on screen today

### 0.1 The measurements, as given

| Screen | Height | Rows | Surfaces (nested) | Filled buttons | Wrapped `row__sub` |
| --- | --- | --- | --- | --- | --- |
| Eğitim index, first run | **5,332px** (8.3 screens) | **48** | 1 (0) | 1 — "İlk dersi aç" | 0/48 |
| Eğitim index, with history | 5,272px | 48 | 1 (0) | 1 — "Bu dersi aç" | 0/48 |
| Topic intro `#egitim/konu/tenses` | 2,016px | 6 | 0 (0) | **0** | 0/6 |
| Test tab, first run | 992px | 8 | 1 (0) | 1 — "Teste başla" | 0/8 |
| Test tab, with history | 1,396px | 9 | 2 (0) | 1 — "Yanlışları çalış" | 0/9 |
| Profil | 2,160px | 10 | 1 (0) | **0** | 0/9 |

§7.1 holds everywhere. §7.2's cap is never exceeded. And the Eğitim index
is **2.5× the next-longest screen** (5,332 against Profil's 2,160) and
very nearly as tall as the app's three other distinct screens put
together — topic intro 2,016 + Test tab 1,396 + Profil 2,160 = 5,572.

### 0.2 Where the 5,332px goes

Derived from the CSS tokens rather than measured, and it reconciles with
the measurement to within ~1%:

| | Height | Share |
| --- | --- | --- |
| 48 lesson rows (`.row`, 62px, 82px when the English title wraps; `orientation.md` §7.3 measured 31 of 48 wrapping at 320) | **~3,600px** | **68%** |
| 8 topic headers — `t-label` heading + gloss + "Bu konu nedir?" + gaps | **~960px** | **18%** |
| 8 section gaps (`.stack--loose`, 32px) | 256px | 5% |
| The one card | ~450–500px | 9% |

Two facts follow, and the second is the sharper one.

**The list is the screen.** No amount of card design or copy trimming
touches 68% of it. The only lever that reaches the rows is *how many rows
there are*.

**The topic header block tripled yesterday, and the cheap option was not
cheap.** `orientation.md` §0 measured this index at **4,564px** on the
same 8-topic, 48-lesson build. Today it is 5,332. The difference is
**768px**, and it is exactly accounted for:

```
per topic, added by the intro entry point (js/education.js:565–580):
  gloss, t-meta 13/16, two lines at 320   32px
  stack--tight gap                          8px
  "Bu konu nedir?" — .btn min-height       48px
  stack--tight gap                          8px
                                          ------
                                           96px  ×  8 topics  =  768px
```

`orientation.md`'s "What shipped" note defends the button against a row on
exactly this arithmetic: *"a quiet button is one 44px tap target, about
400px across eight topics"*, against a costed 520–650px for a row. The
button shipped **with** a gloss line above it, and the pair costs **768px
— more than the row it was avoiding**, on the screen whose length is now
the complaint. That is not an argument against the intro; it is an
argument that the entry point does not belong on this screen at all, which
is §1 and §3.

### 0.3 What that length means, on the only evidence I could find for it

NN/g's 2018 eyetracking study — **130,000 fixations across 120
participants** — is summarised as finding **57% of viewing time above the
fold and 74% within the first two screenfuls**, down from 80% above the
fold in their 2010 numbers
([Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/);
**nngroup.com is blocked from here — this is a search-index summary and
the figures should be confirmed at source before anything expensive rests
on them**).

Applied to this screen, at 320 with a 640px viewport, two screenfuls is
1,280px. That budget holds the card (~470), one section gap (32), the
first topic's header (120) and about **nine lesson rows**. So on the
current index, **roughly 39 of 48 lessons sit outside the region where
three quarters of attention lands** — and they sit there in the same type
size, the same weight and the same colour as the nine that do not.

The friend's word is *yığılıyor* — piling up. That is what it is: not too
much information, but information with no shape, all of it at one visual
weight, most of it past where anyone looks.

---

## 1 · The pile-up

### 1.1 The decision this reverses, and why reversing it is legitimate

The flat index was chosen deliberately. `docs/education-notes.md`'s
interaction model asked for the opposite — *"the main UI addition is a
table-of-contents / topic overview entry point"* — and `orientation.md`
§2(a) records what happened instead: *"it was never built; the index went
flat"*. `js/education.js:1–8` states the reason in the file's own words:

> Index — every lesson across every topic. It opens with what to do next,
> not with a table of contents … someone who wants one specific rule
> should not have to walk through five chapters to reach it.

That reasoning is still correct and nothing below contradicts it. It was
written when the index held **18 rows across three topics**. The premise
it rests on — that the whole list is scannable, so flatness is free — stopped
being true somewhere between 18 rows and 48, and it fails harder at 60,
which `docs/roadmap.md` schedules for the next content round
(`academic-verbs`, `academic-nouns-adjectives`).

The two halves of that comment can be kept separately, and that is the
whole design:

- *"opens with what to do next"* — the card. It is unchanged by everything
  below, and it is the reason the default path stays at **zero extra
  taps**: the card links to a specific lesson, not to a topic.
- *"should not have to walk through five chapters"* — this is about
  *locking*, and nothing below locks anything. But it also implies direct
  reachability, and a topic level costs one tap. §1.6 pays that back.

### 1.2 The options, costed

All heights are at 320 against the 5,332px baseline, derived from §0.2's
decomposition. "Taps" is for a learner who knows the exact lesson he wants
and is not using the card.

| | Option | Index height | Rows on index | New primitives | Extra taps | Code |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | Trim what is there — gloss into a clipped one-line sub, heading itself the tap target, drop the separate button | **~4,690px** (−12%) | 48 | 0 | 0 | ~15 lines |
| **B** | **Topic index — 8 topic rows, drilling into the topic screen that already exists** | **~1,070px (−80%)** | **8** | 0 | **+1** | ~90 lines |
| C | Collapsed-by-default accordion groups | ~1,100px collapsed; +430–530px per expansion, inserted mid-list | 8 headers | **1 (a disclosure)** | +1 | ~150 lines + a11y contract |
| D | Only the current topic expanded | ~1,600px | 8 headers + 6 rows | 1 | +1 for 7 of 8 topics | ~170 lines |
| E | Continue-first; the full list behind a control | ~500px | 0 | 0 | +1 to +2 for everyone | ~40 lines |
| F | Filter / search field over the flat list | 5,332 **+60px** | 48 | 0 | **−1**, if he types | ~50 lines |
| G | Sticky topic header + jump bar | 5,332 **+48px** | 48 | 1 | 0 | ~80 lines |

And a variant worth separating from B because it is the fallback if the
owner refuses a topic level:

| | Option | Index height | Notes |
| --- | --- | --- | --- |
| **B′** | A + F together: trim, then a filter over the flat list | ~4,750px | Keeps the flat list exactly; makes the "I know which lesson" case *better* than today; does not fix the pile-up |

### 1.3 The evidence, such as it is

**Breadth beats depth, but not to the bottom.** Larson & Czerwinski (1998)
arranged **512 items in three structures — 8³, 16×32 and 32×16** — and are
summarised as finding that increased depth hurt search performance, *but
that the medium 16×32 condition outperformed the broadest shallow
structure overall*, with the least "lostness"
([CHI '98](https://dl.acm.org/doi/10.1145/274644.274649); search-index
summary, `dl.acm.org` not fetched). This is the single most on-point
finding available and it points at **two levels of eight and six**, not at
one level of forty-eight. It is also 28 years old, about desktop web
hierarchies, and I could not read it.

**NN/g's own decision rule for mobile subnavigation** is a threshold on
subcategory count: *under 6 subcategories, a submenu or accordion; between
6 and 15, a section menu; more than 15 per primary category, a category
landing page*
([Mobile Subnavigation](https://www.nngroup.com/articles/mobile-subnavigation/);
blocked, search-index summary). This app is **8 primary × 6 sub**, which
lands squarely on "section menu" — a screen per section listing its items,
which is precisely what `renderIntro` (`js/education.js:628`) already
draws.

**Accordions cost more than they look and hide what they hold.** The same
source is summarised as saying accordions *"shorten pages and reduce
scrolling, but they increase the interaction cost by requiring people to
decide on topic headings"*, that **scrolling is cheaper than clicking**,
and that collapsed content is systematically less discoverable
([Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/),
[Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/);
both blocked). That is a real argument against C — an accordion pays the
same tap as B and gets a worse screen for it, because an expansion
inserts half a screen into the middle of a list and moves everything
below it.

**Do not let the structure move.** Findlater & McGrenere (2004) compared
static, adaptive and adaptable split menus and are summarised as finding
the **static menu significantly faster than the adaptive one**, with the
mechanism being that frequent adaptation prevents users from building
spatial memory of the layout
([CHI '04](https://dl.acm.org/doi/10.1145/985692.985704); not fetched —
search-index summary). That
is the case against D, and it is the same reasoning
`docs/research/user-flow.md` already used to refuse **"ordering, greying
or marking the lesson rows by weakness"**. A list whose shape depends on
what you did last week is a list you cannot learn.

**Search is not a substitute for structure.** NN/g's long-standing finding
is that *more than half of users are search-dominant* — and, in the same
material, that *"web design still needs to be grounded in a strong sense
of structure and navigation support"* and that users who arrive by search
still need structure to know where they are
([Search and You May Find](https://www.nngroup.com/articles/search-and-you-may-find/);
blocked). Both halves matter here: F is worth having and cannot carry the
change on its own.

**Jump links are rehabilitated, for pages with real sections.** NN/g's
re-assessment is summarised as saying in-page links work on any screen
size for a page with three or more distinct sections, with roughly *one
user in ten* unfamiliar with the pattern but content with it once used
([Anchors OK? Re-Assessing In-Page Links](https://www.nngroup.com/articles/in-page-links/);
blocked). That is G's warrant, and G is a real option — it is just a
smaller one.

**And the platform convention says the same thing.** Apple's HIG describes
sectioned plain tables with headers plus an optional index bar along the
trailing edge for long lists, and explicitly warns **not** to add an index
to a table whose rows carry trailing controls such as disclosure
indicators
([Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables);
not fetched — search-index summary). Every row in this app carries a trailing
`chevron-right` (`js/education.js:485`), so the index-bar version of G is
ruled out by the convention it would be borrowing.

### 1.4 Option by option, and what each costs the learner

**A — trim what is there. ~15 lines, −640px, keep.** Move each topic's
gloss into the heading block as one clipped line and make the heading
itself the tap target for the intro, so the separate 48px button and one
8px gap disappear. Index 5,332 → ~4,690px. It is free, it is a strict
improvement, and **it is the first step of B anyway** — a topic row *is*
a heading plus a gloss plus a tap. Shipping A alone leaves the index at
7.3 screens, which does not answer the complaint.

**B — the topic index. ~90 lines, −4,260px, this is the recommendation.**

The index becomes: the card (unchanged, all six states), one `t-label`
heading, and **eight topic rows**. A topic row is `renderLessonRow`'s
shape with different contents — fixed lead slot, English title, a
one-line clipped Turkish gloss as the secondary, and `3/6` plus a chevron
in the trail:

```
Tenses                                              3/6  ›
Olayın ne zaman olduğundan çok nasıl görüldüğü…
```

Height: card ~470 + heading 24 + 8 rows (62–82px; most of the eight
titles fit one line at 320 — the estimate assumes two wrap, and
*Connectors & Discourse Markers* certainly does) ≈ **1,070px, 1.7
screens.** Every topic in the app is then inside the two screenfuls where
74% of attention lands, which is the sentence the whole recommendation
reduces to.

It needs **no schema change and no storage change**. `lessonIndex(manifest)`
(`js/topics.js:180`) already carries `topicId`, `topicTitle`, `topicGloss`
and `hasIntro` on every lesson; per-topic completion is a `filter` over
the `progress` map `renderIndex` already holds. The destination already
exists: `openTopicIntro` (`js/education.js:709`) already renders the
intro *and* the topic's lesson rows, by the same `renderLessonRow`.

What it costs, honestly:

- **One tap** for a learner who is not following the card. §1.6.
- **The index stops naming the lessons.** This is the real loss and it
  should not be soft-pedalled: today a learner can scan for *Future Forms*
  and find it; after B he has to know it is inside Tenses. F is the
  compensation, and I would ship them together rather than promise F
  later.
- **A second scroll surface.** The topic screen is 2,016px today with the
  lesson rows at the bottom of it. §3.4 fixes that, and it has to be part
  of the same change or B makes the topic worse than the index it
  replaced.

**C — collapsed groups. Refused.** It pays B's tap, produces B's collapsed
height, and then buys a worse screen: an expansion inserts ~500px mid-list
and moves everything under the learner's thumb; collapsed content is
measurably less discoverable; and it adds a **thirteenth primitive** to a
system whose §7 inventory of twelve is the point of the rebuild. If it is
built with `<details>` it inherits styling and animation problems the
project already declined once; if it is hand-rolled it owes the whole
disclosure contract, per CLAUDE.md's "replace their behaviour too".
`user-flow.md`'s settled *one card, then rows* also stops the index being
a place where content opens, and C reopens exactly that.

**D — only the current topic expanded. Refused.** Everything wrong with C,
plus a structure that changes between visits, against a finding that
static beat adaptive and the repo's own refusal of weakness-ordered rows.
It also needs a definition of "current" that the data supports only
loosely — `recordLessonRead`'s `at` timestamp exists now, but "current
topic" for a learner who read one lesson each in three topics is a guess
presented as the app's opinion.

**E — continue-first, list behind a control. Refused, and it is the
tempting one.** ~500px, the shortest possible screen. It is also the
Duolingo path move (§5.1): it answers "too much choice" by removing the
choice. Three things stop it. The card already *is* the continue-first
layer and it is not going anywhere. The index is the only screen where a
learner can see the shape of what exists, and `docs/roadmap.md`'s v1
criterion 4 — *"a learner can see, in the app, that reading and listening
are not covered"* — depends on the app being legible about its own extent.
And it charges the browsing learner two taps to reach any lesson at all,
which is a worse trade than B's one.

**F — a filter over the lessons. ~50 lines. Ship with B.** A `field`
(§7 already has the primitive) at the head of the index; while the query
is non-empty the index renders matching **lesson** rows instead of topic
rows, matching against category and summary. No fetch — `state.lessons` is
already in memory. Cost: +60px, and one real trap — Turkish case folding.
`"I".toLowerCase()` is `"i"` in English and must be `"ı"` in Turkish;
`refreshProfileTrigger` (`js/home.js:425`) already gets this right with
`toLocaleUpperCase("tr")` and a filter has to do the same in the other
direction, plus diacritic folding for `ğüşiöç`, because a learner typing
`gerund` should match `Gerunds & Infinitives` and one typing `sıralama`
should match a Turkish summary.

This is the option that makes the "I knew which lesson I wanted" case
**better than it is today**: today he scrolls up to 5,332px and scans 48
English titles; with F he types three letters. It is worth saying plainly
that this is the only option in the table that improves that case rather
than taxing it.

**G — sticky topic header, or jump links. The fallback.** If the owner
refuses a topic level outright, G plus A is the honest second-best: A
takes 640px off, G makes the remaining 4,690px navigable by letting the
current topic's name stay on screen and by offering eight jump targets at
the top. It does not reduce the pile; it gives it a handrail. Costs a
sticky element inside the one scrolling region, which interacts with
§8.6's `scroll-padding-bottom` and needs checking at 320 in landscape
(§8.7, 1.3.4).

### 1.5 What the evidence supports

**B, with A as its first commit and F in the same change.** The ordering
argument is not close:

- It is the only option that gets the whole app inside two screenfuls.
- It costs **zero new primitives** and **zero schema**, because the
  destination screen already exists and already draws the same rows.
- It is what this repository's own content channel asked for in the first
  place (`docs/education-notes.md`), what the app has already promised the
  learner in `data/roadmap.json`'s *Konu girişleri* row, and what the one
  applicable industry threshold (6–15 sub-items → a section menu) points
  at.
- It is the only option that also answers question 3 — see §3.

### 1.6 Paying back the tap

The learner who knows exactly which lesson he wants is the case a flat
list serves best, and B taxes him. Four things pay it back, three of which
exist today:

1. **The card.** Six states, always exactly one, always linking to a
   *lesson* (`js/education.js:170, 220, 308, 313, 381`). For the learner
   following the app's recommendation, B changes nothing at all: still one
   tap from opening the app to being in a lesson.
2. **The results screen.** `renderBreakdown` links a wrong answer straight
   to the lesson that teaches it (`js/results.js:97–100`,
   `index.html#egitim/<lessonId>`). `onboarding.md` §8 calls this the app's
   best onboarding; it bypasses the index entirely and B does not touch it.
3. **URLs.** `#egitim/<lessonId>` is unchanged, so every link anyone has
   ever pasted still lands on the lesson. The topic level is added
   *beside* the lesson route, not above it — `parseRoute` (`js/home.js:435`)
   already namespaces `konu/` safely.
4. **F, the filter.** The only thing that makes his case better rather
   than merely unharmed.

And one honest residual: a learner browsing *without* a target — "what is
in this app" — now sees eight titles instead of forty-eight. That is the
change, and it is the point. Eight things he can read is more information
than forty-eight things he scrolls past.

---

## 2 · Onboarding

### 2.1 What is already settled, and should stay settled

`onboarding.md` §1 refused a first-run tour on NN/g's between-subjects
test of **70 participants across four iOS apps**, in which the group that
read the tutorial rated the app **harder** to use (4.92 against 5.49), plus
the summary that tutorials *"interrupt users, don't necessarily improve
task performance, and are quickly forgotten"*
([Mobile Tutorials](https://www.nngroup.com/articles/mobile-tutorials/);
blocked from here too — I could not re-verify it, and it is quoted from
`onboarding.md`, which could not verify it either). It then added three
reasons specific to this app, and those three do not need a citation and
have not changed: two labelled destinations, twelve primitives on purpose,
and a tax on every arrival charged to the person least invested.

`user-flow.md` then measured the shipped first run and graded it
**Strong** — two taps to a first answered question — and located the real
problem at the second screen.

Nothing found in this round disturbs either. What follows is the four
candidates the brief asked to be tested rather than assumed.

### 2.2 Candidate A — onboarding as content selection

*Which exam? Which topic? How long until the exam?*

**"Which topic" and "how long" are already answered and should not be
asked at arrival.** Topic choice is the index; asking it in a modal is the
index with an extra step. The exam date has a design in `onboarding.md`
§3 — optional, in Profil, never asked on first run, arithmetic only — and
that placement is right for the same reason it is right here.

**"Which exam" is the one that has become a real question**, and it did so
after `onboarding.md` was written. `docs/research/exam-vocabulary.md` §1.5
establishes that the app now serves two papers that differ in ways the app
can act on:

| | YTÜ İYS | Bilkent PAE |
| --- | --- | --- |
| Options per item | 4 | **5** |
| Wrong answers penalised | no | **yes, ¼** |
| Closest meaning / restatement | **yes** | not in any source found |
| Paragraph completion | **yes** | not in any source found |

So the question buys three concrete things: two sentences of guessing
advice (*on YTÜ never leave a blank; on Bilkent guess only after
eliminating an option* — that arm calls it "worth more per hour than any
content in this document"), an honest coverage paragraph in Profil (today
`closest-meaning` is sold as coverage to a learner for whom it is not),
and nothing else.

**Verdict: worth having, and not as onboarding.** It belongs exactly where
the exam date belongs — an optional field in Profil, changeable, defaulting
to nothing, with the app saying nothing different until it is set. Three
reasons it must not be a first-run question:

- **It changes no content.** All 193 questions are served to both
  learners. A question that gates nothing and hides nothing is a tax with
  a personalisation costume, which is the thing §2.1 refused.
- **It cannot be got wrong later if it is never asked.** A first-run
  answer is sticky; a Profil field is a fact the learner maintains.
- **Six users, one of whom is the owner.** He knows which exam each friend
  is sitting. The cheapest implementation of "which exam" is the sentence
  he already types into WhatsApp when he sends the link (§5.9).

### 2.3 Candidate B — onboarding as a first success

**This is the candidate the evidence supports, and the app already
implements it.** `renderPretestBlock` (`js/education.js:1015`) puts one question at the top of an unread lesson
before a word of it is taught. `user-flow.md` §J1 measured the path:
link → **İlk dersi aç** → an option → answered, feedback open. **Two taps
to a first answered question.**

The evidence for that ordering is the strongest thing in this area, and
it is stronger than the evidence for anything a first-run flow would do
instead:

- **Pretesting.** Two meta-analyses are summarised as reporting
  **g = 0.34 (k = 45; Boustani & Shanks, 2022)** and **g = 0.54 (k = 97;
  St. Hilaire et al., 2024)** for taking a test before the material is
  taught ([Springer, *Memory & Cognition*, 2025, quoting
  both](https://link.springer.com/article/10.3758/s13421-025-01813-x);
  `link.springer.com` not fetched — search-index summary, **not** read at
  source).
- **Productive failure.** Already in the repo: Sinha & Kapur (2021),
  53 studies, 166 comparisons, >12,000 participants, **g = 0.36**
  (`orientation.md` §1.4).

So the "first success" onboarding is already built, is better evidenced
than anything that would replace it, and has **one unfixed defect that is
the highest-value item in this whole file**:

> `renderPretestBlock` (`js/education.js:1015–1031`) renders its
> four-line rationale *above* the
> question. `user-flow.md` Journey 1, friction 2 measured the consequence
> at 320×640: the **Önce bir dene** heading at y=279, the rationale to
> ~430, the paragraph to ~610, and the first option at **625..677** —
> top edge only, with options 2–4 entirely off screen. Verified still
> unfixed today: the function appends `intro` and then
> `renderCheckBlock`.

Moving the paragraph into the feedback keeps every word, saves ~150px, and
puts the sentence where it becomes true. **~10 lines.** It is the only
change in this document that improves the app's *first two taps*.

### 2.4 Candidate C — progressive disclosure across the first few sessions

**Already built, and the increment is small.** `renderIndex`
(`js/education.js:491–551`) picks exactly one card from six states
depending on what the app knows: untouched → `renderWelcome`; everything
seen → `renderAllDoneCard`; away → `renderReEntryCard`; a half-read lesson
→ `renderResumeCard`; otherwise → `renderNextStepCard`; and
`renderProgressSummary` as the fallback nothing reaches. That *is*
progressive disclosure across sessions, and it is a better implementation
of the idea than a staged tour would be, because each state is a
consequence of what the learner did rather than of a counter.

The gap `user-flow.md` §J1 friction 4 identified is still open and is
worth restating because it is one line: **the app's purpose statement
exists in exactly one runtime string** —
*"Üniversite İngilizce yeterlik sınavı için dersler ve paragraf
soruları"* at `js/education.js:211` — **and the learner's first test
destroys it forever.** From the second visit on, nothing in the running
app says what it is for. `renderNextStepCard` and `renderReEntryCard` do
not have to repeat it; the *topic index* is a better home for it, as one
`t-meta` line under the heading, because that heading is about to become
the one permanent structural label on the screen (§3.4).

### 2.5 Candidate D — the empty state as onboarding

**Shipped, graded Strong, and defensible on a comparison nobody has drawn
in this repo yet.** The reason it works here is that the empty state is
not empty: behind the card there are 48 lessons a learner can start.
Compare Anki, whose first run is a genuinely empty deck list and whose
best-known criticism is precisely that new users must go elsewhere to
learn what to do (§5.7). "Empty state as onboarding" is only a strategy
when the state is not empty; that is a distinction worth writing down
before someone applies the pattern to a screen where it does not hold —
`renderMistakeBook` (`js/home.js:86–90`) already got this right by
returning `null` rather than explaining a mode nobody can use.

### 2.6 What would have to be true for a conventional first-run flow

Four conditions. All four, not any one:

1. **The answer would have to change what the app shows.** Today no
   question a learner could answer changes a single row. When the content
   branches — a Bilkent-only word-formation topic, a YTÜ-only paragraph
   completion set — the question buys something. Even then, see 4.
2. **The interface would have to contain something a learner cannot
   discover by looking at it.** Twelve primitives and two labelled Turkish
   words is not that. `docs/design-system.md` §7 is, in effect, a standing
   argument that the tour is unnecessary; if a tour ever becomes
   necessary, the bug is in §7.
3. **The audience would have to arrive without the motivating problem.**
   The SaaS activation literature is about strangers from an ad. These are
   six friends with an exam date, sent a link by a person who told them
   what it was.
4. **The answer would have to be changeable afterwards** — at which point
   it belongs in Profil, and it is no longer a first-run flow. This is the
   condition that dissolves the category: every question worth asking is a
   setting, and every setting belongs where the settings are.

---

## 3 · *Ders 0*

### 3.1 The refusal, re-checked against the code

`orientation.md` §2(b) refused making the intro a real lesson. Every leg
of that argument was re-run against the current build. **It holds**, with
one correction worth making because it changes the size of the workaround
rather than the conclusion.

| Claim | Status |
| --- | --- |
| "the validator requires four questions per lesson" | **Imprecise.** The hard error is that a lesson's `category` must be used by **at least one** question in the topic — `tools/validate-content.mjs:599–604`, *"lessons and questions must share one taxonomy"*. Separately, `check` blocks may not exceed the category's question count (`:574–578`) and a lesson with none draws a warning (`:572`). So a `Genel bakış` lesson needs **one** invented question, not four. It is a smaller lie and still a lie. |
| the manifest `categories` array would have to lie | **Holds.** `:725–733` requires the manifest's `categories` to be set-equal to the topic file's question categories. The fake category therefore enters `liveCategories` (`js/home.js:362`), the mixed-test pool, `getWeakCategories()` and the results breakdown as something a learner can be *weak at*. |
| every `lessons.length` denominator breaks | **Holds, and there are more than the arm listed.** `js/education.js:146–147, 287, 385, 411, 521, 543`; `lessonCount` is a hard manifest error at `tools/validate-content.mjs:783`; `topicMeta` prints "6 ders" at `js/home.js:255`; and `seenEverything` (`js/education.js:519–522`) would start requiring eight pages of prose to be "completed" before the all-done card could ever appear. |
| the derived id mangles Turkish | **Holds exactly.** Ran `lessonId` (`js/topics.js:134–140`) against the candidates: `Genel bakış` → **`relative-clauses-genel-bak`**; `Konuya giriş` → `relative-clauses-konuya-giri`; `Başlangıç` → `relative-clauses-ba-lang`. The `ış`, `ş` and `ı` are silently deleted, in a permanent learner-visible URL. |

**So: no fake lesson, no fake category, no eighth block type.** That is
settled and this file does not reopen it.

### 3.2 What the owner is actually asking for

*"Sanki ders 0'mış gibi"* — as though the intro were lesson zero. Read
carefully, that is a request about **standing**, not about the `lessons`
array. Three things give a thing standing in this app, and none of them
requires it to be a lesson:

- **Position in the flow** — what you meet, and when.
- **Position in the type scale** — how loud it is next to its neighbours.
- **A number in the lead slot** — the visual grammar the lesson rows
  already use (`row__lead`, fixed `--s-6` width, `js/education.js:469`).

The current implementation gives it none of the three. It is a
`btn--quiet` (the app's *third* button level, the one reserved for the
thing you can ignore) under a `t-label` heading (11px, letter-spacing
.09em, `--c-text-3` — the app's **smallest and faintest** type), labelled
with a question. It reads as a footnote about a topic, because that is
exactly what it is dressed as.

### 3.3 The costed shapes

| | Shape | Cost on the index | Verdict |
| --- | --- | --- | --- |
| (i) | A `Genel bakış` row at the head of each topic group, `0` in the lead slot | **+520–650px** on a screen that is already 5,332 | No. Right idea, wrong screen. |
| (ii) | A distinct card per topic on the index | +8 surfaces, and §7.1's one-surface rule | No. |
| (iii) | Keep the button, make it louder (secondary fill) | +0px, +8 filled-ish controls | No — §7.2, and eight of anything loud is not loud. |
| (iv) | **The topic screen becomes the way in; the intro is its head** | **−768px** (the button and gloss leave the index with the flat list) | **Yes.** |
| (v) | A `0` in the lead slot **on the topic screen**, so the reading order is 0,1,2,…,6 | +0px on the index, +~40px on the topic screen | Yes, with (iv). |
| (vi) | The topic hand-off: at the end of a topic's last lesson, the primary offers the **next topic's intro** | +0px anywhere | Yes, and it is free. |

### 3.4 The resolution — and it is the same change as §1

**Prominence comes from position in the flow, not from a row in a list.**
That single sentence resolves the tension the brief identified, and the
arithmetic is why: every shape that makes the intro prominent *on the
index* adds 500–800px to the screen the friend is already complaining
about, and the shape that makes it prominent *in the flow* removes 768px.

Concretely, three placements, none of which costs the index a pixel:

**(iv) The topic screen is the route into a topic.** Tapping *Tenses* on
the index lands on `#egitim/konu/tenses`, whose first words are already
`Genel bakış` / *Tense nedir?* (`js/education.js:633–634`). The learner
does not have to read it — the lesson rows are on the same screen, and
§3.5 makes them one tap away — but he passes it, once per topic, on the
way in. That is what *ders 0* means as a piece of interaction design: a
place in the sequence, not an entry in a list of things to complete.

It is also exactly the placement `orientation.md` §4 argued for on the
expertise-reversal evidence (**+0.505 for novices given assistance,
−0.428 for experts given assistance they do not need, asymmetrical across
60 studies, 176 effect sizes**): one skippable exposure per topic is
licensed; forty-eight unavoidable paragraphs are not. A screen you pass
through and scroll past costs the expert the same as a screen he never
opens: a flick.

**(v) The `0`.** On the topic screen, the intro's head takes the same
fixed-width lead slot the lesson rows use, carrying `0`, so the column
reads `0, 1, 2, 3, 4, 5, 6` down one keyline. This is the owner's phrase
rendered literally, at a cost of about 40px, on a screen he chose to open,
and with no id, no storage key, no denominator and no completion state
anywhere near it. It must **not** gain a "Tamamlandı" chip: the moment the
intro can be completed it is a lesson, and §3.1 is why it cannot be.

**(vi) The hand-off, which is free and fixes a journey that has none.**
`renderLessonEnd` (`js/education.js:1201–1242`) computes
`state.lessons[state.reader.lessonIndex + 1]` over the **flat** lesson
array, so the last lesson of *Tenses* offers "Sıradaki ders" and delivers
*Modals · Must vs Have to…* with no acknowledgement that a topic ended
and a new one began. **The app has no concept of finishing a topic
anywhere** — not in the card states, not at the end of the reader, not on
the Test tab.

When the next lesson belongs to a different topic, the primary should read
**"Sıradaki konu: Modals"** and open that topic's intro. That is
pre-training delivered at the one moment it is load-bearing — Mayer's
principle is about knowing the *names and characteristics of the main
concepts before the explanation*, reported as supported in **7 of 7 tests,
median d = 0.92** (`orientation.md` §1.1, itself a search-index summary of
a Cambridge Handbook chapter) — and it costs nothing on any screen.

**(iii-a) And the topic screen needs a primary action**, which is §6's
first audit finding and belongs here too: the action bar currently holds
only *Derslere dön* (`js/education.js:761`). After (iv) it must hold the
forward action — **"Derslere geç"** as `btn--primary`, jumping to the
lesson rows — so a learner who does not want the prose never scrolls
2,016px to reach six rows. With that, the expert's cost for the whole
change is: one tap on the index, one tap in the action bar.

### 3.5 One thing to decide before building (v)

Once a topic has any lesson `done`, `orientation.md` §4 recommended
demoting the intro. On the topic screen the equivalent is **ordering, not
hiding**: for a topic with progress, the lesson rows come first and the
intro's body sits below them under its own `Genel bakış` heading. The `0`
stays. Nothing is dismissed and nothing remembers having been seen — a
self-hiding orientation is still an interstitial, which `onboarding.md`
refused and `orientation.md` refused again.

---

## 4 · The flow, as a sequence

Written twice for each journey where the recommendation changes it:
**today**, traced through the running code, and **after B+F**. The intro's
position is marked on each — *offered* (a control he may tap), *passed*
(on his route, scrollable past), *unavailable* (not reachable from here).

### J1 · Brand-new learner, from a pasted WhatsApp link

**Today.** Opens the link → the router lands on `#egitim` → he reads
**English Prep**, one sentence naming the exam and the privacy fact, and
one filled button **İlk dersi aç** (`renderWelcome`,
`js/education.js:202–246`) → below it, a quiet *Ya da kısa bir testle
başla* and then 8 topic headings and 48 rows, 5,332px of them → he taps
the filled button → lands in *Tenses · Present Simple vs Present
Continuous* → the pretest heading at y=279, four lines of rationale, the
question, and the **first option at y=625 against a 640 fold** → he
scrolls, taps an option, gets feedback. **Two taps, one forced scroll.**

*The intro: **offered**, and almost certainly not taken — it is most of a
screen below the card, in the app's quietest control, phrased as a
question.*

**After B+F.** Identical for the first two taps — the card is unchanged and
still links to a lesson. What changes is what he sees *behind* the card:
eight topics, gloss lines, 1,070px, the whole app legible in two
screenfuls. And the pretest fix puts the first option above the fold, so
it is **two taps and no scroll**.

*The intro: **offered**, one tap from the card, on a screen that now has
eight things on it instead of fifty-six.*

### J2 · Returning the same day, after one five-question test

**Today.** `untouched` is false (`js/education.js:503`), so the welcome
card is gone. He is `!away`, has no half-read lesson, so he gets
`renderNextStepCard` (`js/education.js:345`): **Sıradaki adım**, the category he did
worst on, *"Son testlerinde en çok bu sorularda zorlandın"*, and a filled
**Bu dersi aç**. Then the same 5,272px of rows. He taps the button and is
in the right lesson. **One tap.** Good — this is `user-flow.md` item 6
working exactly as designed.

What he does *not* get: the purpose statement, which died with the welcome
card (§2.4), and any idea that the topic he keeps failing has an
introduction.

*The intro: **offered**, still buried.*

**After B+F.** Same card, same one tap. Behind it, eight rows — and the
one he keeps failing now carries `1/6` and a Turkish gloss, so the
diagnosis the card states in prose is also visible in the structure. The
purpose line moves under the topic heading, where it survives every state.

### J3 · Returning after three weeks

**Today.** `getLastActivity()` returns a timestamp older than
`RE_ENTRY_DAYS = 10` (`js/storage.js:522`), so `away` is true
(`js/education.js:518`) and — since `user-flow.md` item 3 ungated it — he
gets `renderReEntryCard` whether or not he left a lesson half-read. With a
half-read lesson: *Kaldığın yer*, the category, `%73`, **Önce 5 soruyla
hatırla** (filled) and *Kaldığın yerden devam et*. Without: *Kısa bir
hatırlatma*, "Beş soru, doksan saniye", **5 soruyla başla**, *Sıradaki
derse geç*. Plus `newContentNote` if the app has grown since he left. The
copy never names the number of days and never implies fault. Then 5,272px
of rows.

**One tap to ninety seconds of retrieval practice.** This journey is the
best-designed thing in the app and B does not touch it.

*The intro: **offered**. For a returner it is the one audience with a
second use — re-reading what `öncül` means before reopening *Reduced
Relative Clauses* — and it is eight screens down.*

**After B+F.** Same card, same tap. Behind it, eight rows with per-topic
progress, which is the first time a returner can see *where he was* rather
than only *what is next*. And the intro is one tap from the topic he is
about to re-enter, which is where the second use actually lives.

### J4 · Finished a topic

**Today — and this is the journey with no design at all.** He reads the
sixth lesson of *Tenses* to the end. `renderLessonEnd` (`js/education.js:1201`) offers
*Bu konudan test çöz* (secondary) and **Sıradaki ders** (filled). Tapping
it calls `markLessonDone` and opens
`state.lessons[lessonIndex + 1]` — which is **Modals · Must vs Have to vs
Mustn't vs Don't Have to**, a different topic, with no line saying so. He
is now reading about obligation modals having been told he is on the next
lesson.

Back on the index, six rows carry *Tamamlandı* chips and nothing else has
changed. `seenEverything` is global (`js/education.js:519`), so no card fires. The Test
tab shows `Tenses %71` beside a row that starts another Tenses test.
**Nothing anywhere marks that a topic ended.**

*The intro: **unavailable** — the one moment in the entire app where a
learner is provably about to meet a new grammar area, and the intro to it
is not offered.*

**After B + (vi).** The sixth lesson's end reads **"Tenses bitti"**, offers
*Bu konudan test çöz* (secondary) and **"Sıradaki konu: Modals"** (filled)
→ the *Modals* intro, `0` in the lead slot, its six lessons beneath it,
and *Derslere geç* in the action bar. On the index, *Tenses* reads `6/6`.

*The intro: **passed** — on his route, one flick to scroll past, and
delivered at the moment the pre-training literature says it does its
work.*

### J5 · He knows exactly which lesson he wants

The case the flat list serves best, and the one B taxes. Written out
because it is the honest cost.

**Today.** Opens the app → ignores the card → scrolls, scanning 48 English
titles across up to 5,332px → finds *Preposition + Relative Pronoun: In
Which / For Whom / Of Which*, seventh topic, fourth row → taps. **One tap,
one long scroll, one visual search over 48 items at one type weight.**

**After B alone.** Scrolls 1,070px over 8 rows → taps *Relative Clauses* →
the topic screen → *Derslere geç* → four rows down → taps. **Three taps,
two short scrolls.** Worse, and I am not going to argue otherwise.

**After B+F.** Types `whom` into the filter → two rows → taps. **One tap
plus typing, no scroll.** Better than today.

That is why F is not a follow-up. Without it, B trades one learner's
problem for another's.

---

## 5 · How comparable products actually open

**Read this section against §A.** I could not install, open or fetch any
of these products; `apps.apple.com`, `play.google.com`, the vendors' own
sites and every design gallery I tried were refused. Everything below is a
search index's summary of third-party descriptions, and where a claim
matters I say what it would take to confirm it.

### 5.1 Duolingo — and the pile-up it already solved, badly for us

**First screen:** *"I want to learn…"* and a list of languages. **Second:**
one motivation question (Travel / Career / Brain training). **Then:**
first-time-or-not, with an optional placement test (5–10 minutes);
**then** a daily-goal commitment (5/10/15 minutes) which is also where the
streak is introduced; **then** the first lesson
([Juno School](https://www.junoschool.org/article/duolingo-onboarding-experience/),
[Appcues GoodUX](https://goodux.appcues.com/blog/duolingo-user-onboarding);
junoschool.org refused, the Appcues page not fetched; both are
search-index summaries).

**What it costs the user:** four to five screens and a commitment before
any content. Duolingo can afford it because the funnel is the product:
the daily goal and the streak it introduces are the retention mechanic
that the business runs on.

**The part that matters more here.** In **November 2022** Duolingo
replaced the free-choice "skill tree" with a linear **path**, one lesson
at a time. Luis von Ahn's stated reason, as quoted:
*"This is why we decided to do this: to simplify Duolingo and also to make
it so that new users understood how to best use Duolingo"* — with reduced
"choice paralysis" given as the benefit and a large user backlash from
people who wanted to choose what to revise
([NBC News](https://www.nbcnews.com/tech/tech-news/duolingos-update-redesign-luis-von-ahn-interview-rcna44655),
[duoplanet](https://duoplanet.com/duolingo-new-learning-path-review/);
not fetched — search-index summaries).

**So the biggest language app in the world had this exact problem and
solved it by deleting the choice.** That is option E in §1.2, at industrial
scale, and it is the thing this project has refused twice already —
`docs/education-notes.md` rejected "gamified chapter-unlock progression"
outright, and `practice-modes.md` §11 refuses "unlock progression / a
locked path through topics". Duolingo is the reason to be sure the
alternative — a level of structure, with nothing locked — actually works,
because the failure mode of not having one is a company deciding the
answer is to stop offering choices.

**Imitate: nothing. Learn from: the diagnosis, not the treatment.**

### 5.2 Busuu

A full sign-up plus a multi-step quiz before the first lesson, study-plan
creation with a daily commitment, and a soft paywall offering a 7-day
trial into an annual subscription
([Reteno flow gallery](https://gallery.reteno.com/flows/web-screens-busuu),
[Language Tips 2025 review](https://language-tips.net/busuu-2025-review/);
gallery.reteno.com refused, the review not fetched). The onboarding's length is in service of the trial conversion.
**Do not imitate.** The business incentive is the whole explanation, and
this app has no business.

### 5.3 Memrise

Language selection, account creation, reminders, subscription; the level
question is a **self-report** — *"Learn from scratch" / "Getting started"
/ "Making good progress"*
([Memrise help centre](https://memrisebeta.zendesk.com/hc/en-us/articles/4962856912145-Can-I-change-the-difficulty-level-of-the-language-I-m-learning);
not fetched — search-index summary).

Two things are worth taking. The self-report is the only "placement" that
costs no items — and `onboarding.md` §2 showed why this app cannot afford
a real one (4 items per category, α ≈ 0.24 for a category subtest, an
18-item diagnostic burning 25% of the bank). But a self-report only earns
its place if the app then shows something different, which this app must
not do, because showing something different means hiding something.

And a structural note: in **March 2024** Memrise removed community courses
from the app entirely, moving them to a separate site, explicitly because
supporting them *"comes at a significant cost that hinders the development
of the main Memrise experience"*
([Memrise blog](https://www.memrise.com/blog/changes-to-the-memrise-app);
not fetched). Content removed to make the product legible. This app's version
of that decision is §1: the list is not too big because there is too much
content, it is too big because there is one level where there should be
two.

### 5.4 Elevate

Pick two or three focus areas, then a short assessment that sets a
starting level, then a personalised daily session; roughly **three to five
minutes to the first game**
([Nibble review](https://nibble-app.com/blog/elevate-app-review),
[mindtools.io](https://mindtools.io/programs/elevate/); not fetched). The
assessment is real and the app has enough items to spend on it. Against
this app's 193 questions, spending items on measurement is spending the
practice bank, which `onboarding.md` §2 costed and refused.

### 5.5 Brilliant

An onboarding quiz *before* the sign-up screen, feeding a recommended
path. The most useful thing in the material I could reach is a criticism:
the recommendation screen *"could benefit from explaining why a specific
path was chosen based on the user's quiz answers"*
([Savvy](https://trysavvy.com/example/brilliant-onboarding); not fetched).

That is a good rule and this app already keeps it. `renderNextStepCard`
does not just recommend a lesson, it says why —
*"Son testlerinde en çok bu sorularda zorlandın"* (`js/education.js:370`).
A recommendation without its reason is an instruction.

### 5.6 Khan Academy — the structural one

Course → **unit page** listing skills, each at *Not started / Attempted /
Familiar / Proficient / Mastered*; a **Course Challenge** card at the
bottom of a course; Mastery Challenges unlocked at thresholds (Familiar on
≥3 skills, Proficient on ≥1, 12 hours since the last)
([Khan Academy help centre](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery);
not fetched — `khanacademy.org` itself was refused; search-index
summary).

**This is the two-level structure §1 recommends, in a product with far
more content than this one**, and it is the closest real-world analogue to
option B: a course landing page, a unit page, skills as rows. It is worth
naming what to take and what to leave:

- **Take:** the level. Course → unit → skill is exactly topic → lesson,
  and nobody thinks Khan Academy's course page is a locked path.
- **Take:** mastery levels are a number that can go *down*.
  `practice-modes.md` §11 already drew this line — *"a number that only
  goes up is a currency; a number that can go down is a measurement"*.
- **Leave:** the thresholds and the unlocks. With four items per category
  this app cannot support a mastery claim (`onboarding.md` §2), and
  `docs/roadmap.md` puts mastery levels behind 8–10 items per category.

### 5.7 Anki, AnkiDroid, AnkiMobile

**No onboarding at all.** The first run is an empty deck list, and the
best-documented criticism of the product is exactly that: a steep learning
curve, an interface that depends on community tutorials rather than
built-in guidance, and new users having to configure and read before they
can start
([Anki forums](https://forums.ankiweb.net/t/learning-curve-for-anki/7574);
not fetched — search-index summary; `docs.ankiweb.net` was refused).

This is the control condition for §2.5, and it is the one product on this
list whose constraints resemble this app's — no funnel, no ads in the
desktop product, an audience that arrived with a purpose. It still fails,
and the reason is instructive: **"no onboarding" works when the first
screen contains the thing you came for, and fails when it is empty.**
This app's first screen contains 48 lessons and a button that opens one.
Anki's contains nothing until you build it.

### 5.8 Turkish YDS / YÖKDİL apps

The three most visible on Google Play and the App Store, from their own
store descriptions as summarised: *YDS YÖKDİL: Test Çöz & Kelime* (1,700+
questions, per-option explanations, **live word duels, XP, weekly
leagues**); *YDS YÖKDİL İngilizce Hazırlık* (600 high-frequency words,
grammar lessons, word games); *YDS+* (1,500+ vocabulary, **50+ real ÖSYM
papers**, 3,800 Oxford words, "AI personalisation")
([Play](https://play.google.com/store/apps/details?id=com.edulearningapp.yds_yokdil_pro&hl=tr),
[Play](https://play.google.com/store/apps/details?id=com.opiaclab.kelimeler&hl=en_US),
[App Store](https://apps.apple.com/tr/app/yds-yds-y%C3%B6kdi-l-haz%C4%B1rl%C4%B1k/id6720766118);
`apps.apple.com` refused and the Play listings not fetched — these are
search-index summaries of store listings, not of the apps).

Two conclusions, and they point in opposite directions.

**What they have that this app cannot get:** real past papers and
thousands of items. That is the axis this app loses on and it does not
need to compete there — it is six friends and one exam, and
`docs/roadmap.md` already sets the honest bound.

**What they have that this app must not copy:** XP, weekly leagues and
live duels are the retention layer of an ad- or subscription-funded
product with strangers in it. `practice-modes.md` §11 refuses leaderboards
specifically for this audience — *"a permanent public ranking of your
friend group by English ability, three months before an exam that decides
whether each of them repeats a year"*. The Turkish market makes that
mechanic look like the norm. It is the norm for a business model this app
does not have.

**What is worth stealing, and it is small:** their topic lists carry item
counts. This app's Test tab already does (`topicMeta`, `js/home.js:257`);
its Eğitim index does not, and after option B the topic row is exactly the
place for `3/6`.

### 5.9 Two non-education products, at opposite poles

**Headspace — value before questions.** The first interaction after
download is reportedly a breathing exercise on the loading screen,
*"immediately bringing the user value before asking them a single
question"*; the personalisation questions come **after** registration,
under *"Before you start, we just have a few questions"*
([Appcues GoodUX](https://goodux.appcues.com/blog/headspaces-mindful-onboarding-sequence),
[designpractice.io](https://medium.com/designpractice-io/onboarding-journey-of-headspace-ios-app-8867420accf);
not fetched). If a first-run question is ever asked here, this is the ordering:
after a lesson, never before one. It is also, more or less, what
`renderNextStepCard` does — it earns the right to make a claim by having
watched the learner answer questions.

**Superhuman — the opposite, and the one that actually describes this
project.** They deliberately did not build self-serve onboarding for their
complex, high-price segment; every new user got a 1:1 session instead,
reportedly hitting **65% full email migration in the first session** and
roughly doubling activation versus self-serve
([First Round Review](https://review.firstround.com/superhuman-onboarding-playbook/),
[growth.design](https://growth.design/case-studies/superhuman-user-onboarding);
not fetched — search-index summaries; the 65% figure is a vendor-sourced number
and should be treated as marketing).

The transferable observation is not the tactic, it is the recognition:
**this app already has human-led onboarding.** It is distributed by the
owner pasting a link into a chat with a sentence explaining what it is,
to six people he can text. That is the highest-converting onboarding
mechanism there is, it is already in place, and every screen the app might
add in front of the content is a worse version of a message he has already
sent. The app's job is to be worth the message, not to repeat it.

### 5.10 The summary the section is for

| Product | Should this app imitate it? | Why not |
| --- | --- | --- |
| Duolingo's onboarding | **No** | Screens before value, in service of a streak the project has refused |
| Duolingo's path | **No** | Solves the pile-up by deleting choice; refused twice here |
| Busuu | **No** | Length exists to convert a trial |
| Memrise's self-report level | **No** | Only pays if the app hides content afterwards |
| Memrise's content cull | Partly | The principle — legibility over completeness |
| Elevate's assessment | **No** | Spends items this bank does not have |
| Brilliant's "explain the recommendation" | **Yes, already done** | `renderNextStepCard` says why |
| **Khan Academy's course → unit → skill** | **Yes** | The two-level structure §1 recommends |
| Khan's mastery unlocks | **No** | 4 items per category cannot support the claim |
| Anki | As a warning | No onboarding works only when the first screen is not empty |
| YDS/YÖKDİL apps' leagues and duels | **No** | Engagement mechanics for a business model this app lacks |
| Headspace's ordering | **Yes** | If a question is ever asked, ask it after a lesson |
| Superhuman's recognition | **Yes** | The owner's WhatsApp message *is* the onboarding |

---

## 6 · A UI/UX principles audit

### 6.1 Where the app breaks its own written spec

Five findings. Ordered by what they cost a learner.

**1 · The topic intro screen has no primary action, and its only fixed
control points backwards.** `renderIntro` (`js/education.js:628–702`)
ends with the topic's lesson rows; the action bar carries a single
`secondary` **Derslere dön** (`js/education.js:761`). §7.2 defines three
button levels with one filled per screen, and a screen whose entire job is
to route a learner into six lessons offers **zero**.

The measurement makes it concrete: the intro is **2,016px** and the lesson
rows are at the bottom of it, so a learner who has read enough must scroll
roughly three screens to reach the thing the screen exists to hand him,
while a persistent control at the bottom of the viewport offers to take
him back where he came from. This is the finding that matters most for
what the owner asked, because *"routes them into the intro and then the
lessons"* is precisely the half that is missing.

The same label is also `btn--primary` one screen away, at the end of a
lesson (`js/education.js:1233`). One string, two levels, two screens.

**2 · The topic heading is the smallest, faintest text in its own
group.** `js/education.js:559` renders it as `t-label` — `--t-micro`
11px/16px, weight 600, letter-spacing .09em, colour `--c-text-3`
(`css/style.css:444–450`) — above rows whose titles are `t-ui` 15px/20px
weight 600 in `--c-text-1` (`css/style.css:563–567`, `.row` sets
`color: inherit` at `css/style.css:537`).

So on a screen that is 68% list, **the group heading is quieter than every
one of the six things it governs**, eight times over. §2.2 defines a type
scale, and a scale is a hierarchy; nothing in §2 says a heading may not
rank below its contents, because nobody thought it needed saying. This is
a large part of why 48 rows read as a pile rather than as eight groups of
six, and it is a two-token change.

**3 · "Bu konu nedir?" is a button wearing a row's clothes.**
`js/education.js:574–579` builds a `btn--quiet` and appends
`icon("chevron-right")` to it. In this app the trailing chevron is the
Row's "this leads somewhere" signifier — `renderLessonRow` puts it in
`row__trail` (`js/education.js:485`), `renderTopicRow` on the Test tab
does the same (`js/home.js:300`). Meanwhile `.btn` is
`justify-content: center` (`css/style.css:603`) and, as a grid item in a
`.stack`, stretches full width — so the control is **centred**, directly
above a list of rows whose text starts on a fixed `row__lead` keyline
(`css/style.css:548–554`).

§7.1's stated failure mode is *"ragged text edges from variable-width
leading content is the single most common cause of an unscannable list"*.
This is that, produced by a control rather than by content. It is also the
only full-width `btn--quiet` in the app.

**4 · One route change produces two titles and two announcements.**
`applyRoute` sets `document.title` and calls `announce(VIEW_TITLES[view])`
(`js/home.js:454–455`) before dispatching; `openTopicIntro` then sets both
again (`js/education.js:758–759`). §8.4 specifies **one** persistent live
region whose `textContent` is replaced — replacing it twice inside one
navigation means the first message is likely never spoken, or the second
truncates it. The lesson reader has the same shape. Not a conformance
failure, but it is the kind of thing §8.5 exists to prevent, and the fix
is to let the sub-route own both.

**5 · The pretest still puts the rationale above the question.**
`renderPretestBlock` (`js/education.js:1015–1031`) appends the four-line
`intro` and then the check block. `user-flow.md` Journey 1 measured the consequence at 320: the first
option at **625..677** against a 640 fold, options 2–4 off screen. The
mobile-first rule in CLAUDE.md is *"verify at 320px before anything
else"*; the app's very first interaction fails it. Ten lines, ~150px, and
`orientation.md` §5.2 has been asking for it for a day.

### 6.2 Where the spec is now wrong or incomplete

Four gaps, each of which allowed one of the findings above.

**(a) §7 has no rule about how long a list may be, and §7.1 is a
composition rule pretending to be a layout rule.** It answers *Row or
Surface?* by homogeneity and stops. It has nothing to say about
forty-eight rows, about the ratio of group chrome to content (960px of
headers for 3,600px of rows), or about the point at which a list needs a
level above it rather than more scrolling. The spec should carry a
budget — a candidate, phrased so it can be checked: **a scannable list is
one whose shape fits inside two screenfuls at 320; past that, the fix is a
level, not a longer scroll.** That sentence would have flagged this index
at 24 rows.

**(b) §7's inventory has nothing between the Nav and the Row.** There is
no primitive for "a group of rows with a name, a description, and
somewhere to go". The app grew one anyway, out of a Button, because that
was the only material available — which is exactly how a twelve-primitive
system becomes a forty-five-primitive one again. Either the inventory
gains a **Group header** (title, optional gloss, optional destination, one
keyline) or — the answer §1 recommends — **the topic level becomes a Row
like everything else** and no new primitive is needed. The spec should say
which, because the decision is being made by accretion right now.

**(c) §2.2 does not require a heading to outrank what it heads.** Finding
2 is invisible to every check the project runs: it passes the palette
tool, the validator, the browser sweep and the accessibility contract.

**(d) §7.2's "one filled per screen" reads as a cap and is being used as
one.** Two screens now have zero. For Profil that is correct — it is a
destination, not a step. For the intro screen it is a defect. The rule
should be split: **exactly one filled action on any screen that has a next
step; none on a screen that is a destination.**

### 6.3 One process gap — the one that would have caught §0.2

`tools/verify-ui.mjs` audits every screen it lands on for horizontal
overflow (`root.scrollWidth > root.clientWidth`, line 137), undersized
targets (line 128) and console errors, at four widths. **It never measures
vertical height.** So the 768px the intro entry point added to the app's
landing screen passed ~1,051 harness checks without producing one line of
output, and the pile-up was found by a friend rather than by the sweep.

The fix is small and belongs in the same commit as anything in §1:
**record `scrollHeight` for each screen the sweep visits at 320, print it,
and fail above a per-screen budget.** It is one `evaluate` on screens the
sweep already reaches. CLAUDE.md is explicit that adding to the sweep is
part of the change; this is the check that turns "the index is getting
long" from an opinion into a build failure.

---

## 7 · What must never happen

Grounded in this project's standing refusals, and repeated here because
every item in §1 and §3 is within one bad decision of one of them.

- **No locking.** Not by topic, not by lesson, not by score, not by
  reading the intro first. `docs/education-notes.md` settled it ("free
  navigation, both tabs… no locking, at any level"), `learning-design.md`
  §4 refused mastery gating on Kulik's own dropout finding, and
  `practice-modes.md` §11 refused unlock progression. **The topic screen
  in §3 is a place, not a gate**; every lesson stays reachable by URL, by
  the card, and from the results screen.
- **No streaks, no daily goal, no minutes target.** `onboarding.md` §3 and
  `practice-modes.md` §4.2. The line is the one already written: the app
  may count what happened; it may never display a state the learner has
  failed.
- **No number that only goes up.** A currency, not a measurement
  (`practice-modes.md` §11). This applies directly to §3: the intro must
  never gain a completion state, a tick, or a place in any denominator —
  the moment it can be completed it is a lesson, and §3.1 is why it cannot
  be one.
- **No readiness claim.** No CEFR band, no "hazırsın", no proficiency
  number. `user-flow.md`'s state-5 copy is a statement about the app's
  coverage, deliberately, and stays that way.
- **Nothing that taxes every arrival.** No welcome modal, no tour, no
  coach marks, no install prompt, no "which exam" gate, no cookie-style
  storage notice. `onboarding.md` §1. A topic row is not a tax: it is
  where the lessons are, and the card still goes straight past it.
- **Nothing that reopens the navigation.** Two destinations in the bottom
  nav, Profil in the header. `docs/design-system.md` §7 (Nav: "two
  destinations, always labelled"), CLAUDE.md ("navigation is settled").
  Everything in this document lands on `#egitim`, `#egitim/konu/<id>` or
  `#egitim/<lessonId>` — three routes that already exist.
- **And one specific to this file: no reordering of the lesson list.**
  Not by weakness, not by recency, not by "current topic". `user-flow.md`
  refused it; Findlater & McGrenere is the outside evidence for the same
  thing. The card carries the suggestion. The list stays a list, in the
  same order, every time.

---

## Ranked recommendation

Value per hour, sizes honest, no new dependencies and no build step.

**1 · Move the pretest rationale below the question. ~10 lines.**
`renderPretestBlock`, `js/education.js:1015`. Saves ~150px and puts the
first tappable option above the 320 fold on the app's very first
interaction. It is the oldest
open item in this area (`user-flow.md` J1 friction 2, `orientation.md`
§5.2) and it is the smallest thing in this file. *Half an hour.*

**2 · Give the topic screen a primary action. ~10 lines.**
`actionBar.set` at `js/education.js:761` gains **Derslere geç** as
`btn--primary` alongside the existing back action. This is §6.1 finding 1
and it is a precondition for everything in §3: without it, "routes them
into the lessons" is false. *Half an hour.*

**3 · Fix the topic heading's rank. ~2 tokens.** `t-label` → a heading
that outranks its rows (§6.1 finding 2). Do it before deciding anything
structural, because it is possible — not likely, but possible — that a
list of 48 rows with eight *legible* group headings reads well enough that
the owner wants to stop there. It is a ten-minute experiment against a
day's work. *Ten minutes, plus one measurement.*

**4 · Add screen height to the browser sweep. ~15 lines.**
`tools/verify-ui.mjs`: record and print `scrollHeight` at 320 for every
screen it visits, and fail above a budget. Without this, the next 768px
arrives the same way the last one did. Do it **before** item 5, so the
change is measured rather than asserted. *One hour.*

**5 · The topic index — option B, with A folded in. ~90 lines.**
`renderIndex`'s group loop (`js/education.js:553–589`) becomes eight topic
rows: fixed lead slot, English title, the manifest `gloss` as a clipped
one-line secondary, `3/6` and a chevron in the trail. The card and all six
states are untouched. The gloss and the "Bu konu nedir?" button leave the
index with the flat list. **5,332px → ~1,070px; 48 rows → 8.** No schema
change, no storage change, no new primitive; the destination already
exists. Add three states to the sweep. *One day.*

**6 · Ship the filter in the same change. ~50 lines.** A `field` at the
head of the index; a non-empty query renders matching **lesson** rows over
`state.lessons`. Turkish-safe folding (`toLocaleLowerCase("tr")` plus
diacritic folding), matching category and summary. This is what keeps item
5 honest for the learner who knew what he wanted. *Two to three hours,
most of it the folding and its tests.*

**7 · *Ders 0*, the three free placements. ~40 lines total.**
(v) the `0` in the topic screen's lead slot so the column reads 0–6;
(vi) `renderLessonEnd` detects a topic boundary and offers **"Sıradaki
konu: Modals"** into that topic's intro; and the ordering rule from §3.5 —
once a topic has progress, its lesson rows come above the intro body. None
of the three costs the index a pixel and (vi) fixes the only journey in
the app with no design at all. *Half a day.*

**8 · The purpose sentence stops being single-use. One string.**
`js/education.js:211` is the only runtime place the app says what it is
for, and the learner's first test destroys it. After item 5 the index has
a permanent structural heading; put it there. *Fifteen minutes.*

**9 · "Hangi sınav" as an optional Profil field. ~40 lines plus copy.**
Two sentences of guessing advice (`exam-vocabulary.md` §6 item 9) and an
honest coverage paragraph, defaulting to nothing, never asked at arrival,
changeable. **Not onboarding**, and it should not be described as
onboarding in the changelog either. *Two hours, after the owner decides
the wording.*

Items 1–4 together are **under two hours** and are what I would do before
touching the structure at all.

---

## What I would refuse

- **A `Genel bakış` lesson in the `lessons` array.** Re-verified against
  the current code (§3.1): one hard validator error, a fake category in
  the manifest, the mixed-test pool, `getWeakCategories()` and the results
  breakdown, six broken denominators, and a permanent URL reading
  `relative-clauses-genel-bak`. `orientation.md` refused it; nothing has
  changed except that there are now eight topics to do it to instead of
  three.
- **A `Genel bakış` row at the head of each topic group on the index.**
  +520–650px on the screen the complaint is about. The right idea on the
  wrong screen; §3.3 (iv)–(vi) get the same thing for −768px.
- **A completion state for the intro** — a tick, a chip, a percentage, a
  place in `18 dersten…`. It would make the intro a lesson through the
  back door and would add a number that only goes up.
- **An accordion, a disclosure, or any collapsed-by-default group on the
  index.** A thirteenth primitive, a contract to own, less discoverable
  content, an expansion that moves half a screen under the learner's
  thumb, and the same tap that option B charges. Same price, worse screen.
- **Any index whose shape depends on what the learner did last week** —
  "only the current topic expanded", weakness-ordered rows, recently-used
  first. Static beat adaptive; the repo already refused the row version;
  and an app whose home screen rearranges itself cannot be learned.
- **Continue-first with the catalogue behind a control.** It is the
  Duolingo path in a smaller box, it charges the browsing learner two taps
  to reach anything, and it removes the one screen where a learner can see
  what the app does and does not contain — which `docs/roadmap.md`'s v1
  criterion 4 depends on.
- **A first-run flow of any kind**, including a "which exam" gate, a
  placement test, a goal question, a level self-report, and an install
  prompt. §2.6 lists the four conditions that would have to hold together;
  none holds, and the fourth dissolves the category anyway.
- **A level self-report that changes what is shown.** Memrise's question
  is cheap because Memrise then hides content. Hiding content is locking
  with better manners.
- **Search as the answer to the pile-up.** It is a good complement and a
  bad structure. More than half of users may be search-dominant on a
  website; none of six friends will type into a phone to find a lesson
  they can see.
- **Telling the learner the list used to be shorter, or apologising for
  its length.** The app never comments on itself to the learner; Profil's
  roadmap section is where the app's own state is discussed, and it is
  opt-in.

---

## Open questions for the owner

1. **Does a topic level belong in an app whose navigation was deliberately
   flattened?** `orientation.md` asked this and it is now the load-bearing
   question rather than a side one. It does not touch the bottom nav and
   it does not lock anything, but it does mean the index answers "which
   topic" before it answers "which lesson". Recommendation 3 (ten minutes)
   exists so that the alternative gets a fair test first.
2. **Is one extra tap acceptable for the learner who knew which lesson he
   wanted?** §J5 is the honest version of the cost. My answer is yes *if*
   the filter ships with it and no if it does not, which is why they are
   one change and not two.
3. **What should a topic row's trailing value say — `3/6`, a percentage,
   or nothing?** `3/6` is a count of what happened and cannot be failed.
   A percentage would be the fifth bare percentage in the app and the
   second meaning of one (`user-flow.md` already found two that answer
   different questions). I would use `3/6` and show nothing at `0/6`.
4. **Should the topic hand-off (§3.3 vi) be the primary at the end of a
   topic, or the secondary?** The primary today is "Sıradaki ders" and it
   silently crosses topics. Making the intro the primary is a stronger
   recommendation than this app usually makes; making it the secondary
   leaves the current silent hand-off in place. I lean primary, and it is
   a judgement about how opinionated the app is allowed to be.
5. **Does "hangi sınav" get asked at all?** It buys two true sentences and
   one honest coverage paragraph, and it costs a field in Profil. If the
   owner would rather tell each friend directly — which is the
   Superhuman observation in §5.9 — that is a defensible answer and it is
   free.
6. **`data/roadmap.json`'s *Konu girişleri* row.** `orientation.md` open
   question 7 asked what it describes and it is still open; after §3 it
   would describe something different again. The app's most honest screen
   should not carry a sentence that is no longer true of it.
7. **How long until each friend's exam?** It decides whether any of this
   is worth a day. If the sitting is in four weeks, items 1–4 (two hours)
   are the whole of what I would do, and the topic index waits.
