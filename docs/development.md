# Development and content guide

> The detailed product, content and engineering rationale moved here from the
> repository README during the v0.72 presentation pass. File-tree paths and shell
> commands are relative to the repository root. Historical measurements and
> design decisions remain dated; [validation](VALIDATION.md), the
> [current interface system](margin-design-system.md), and the [decision records](adr/)
> are the maintained references for current behavior.

**Margin / Sakura:** [open the redesigned app](../index.html),
[compare the full original](../original/index.html), or inspect its
[unchanged runtime source archive](../original/source-39dcd46.zip). This version
uses the full `test` source at `39dcd46`; the earlier prototype lives on in
the `main` branch's history. The original's
hosted service worker has only been adapted to isolate its offline caches.

Run `npm run serve` and open `http://localhost:8000/`; run `npm run check`
for the repository checks. See the current [experience](../docs/EXPERIENCE.md),
[interface system](../docs/margin-design-system.md), and [research](../docs/RESEARCH.md).
Current product captures: [phone](../about/assets/education-phone.webp),
[wide screen](../about/assets/education-wide.webp), [article](../about/assets/article-phone.webp),
and [results](../about/assets/results-phone.webp). These are browser viewport
captures with demonstration state, not physical-device certification.
See [validation evidence and commands](../docs/VALIDATION.md).
The detailed refinement record includes the [element inventory](history/audit/element-inventory.md),
[type and color measurements](history/audit/type-color.md),
[interaction audit](history/audit/interaction-accessibility.md), and
[verified UI research](../docs/research/2026-10-ui-principles.md).
The v0.71 [ADR 010](../docs/adr/010-living-scenes-and-navigation.md) adds readiness-gated motion,
cohesive scenes, high-density captures and an adaptive scroll rail.
[ADR 009](../docs/adr/009-expressive-study-motion.md),
[filled-answer research](../docs/research/2026-10-answer-surfaces-v070.md),
[motion research](history/research/2026-10-motion-v070.md),
[onboarding composition](history/design/onboarding-v070.md), and
[Profile/results design](../docs/design/profile-results-v070.md) connect evidence to decisions.
[ADR 008](../docs/adr/008-explorable-interactions.md) preserves the earlier
interaction research and native focus/cancellation contracts; its short timing
scale and neutral answer surfaces are superseded.
[ADR 007](../docs/adr/007-sakura-and-purposeful-motion.md) and its
[Sakura palette research](../docs/research/2026-10-sakura-palette.md) retain the
background and brand foundation; ADR 008 supersedes its answer-status hues,
header motion control and screenshot gallery.
The previous [v0.67 review](history/audit/readability-v0.67.md) and
[ADR 006](../docs/adr/006-reading-hierarchy-and-atmosphere.md) preserve the earlier
comparison; its reading typography remains applicable, while the later ADRs
supersede its palette, atmosphere and introduction.
The [component catalogue](../docs/components.html) uses the production stylesheet.
The hosted versions share the browser origin's existing local progress
and settings; their offline shell/content caches are isolated.

A study app for the English proficiency exams that Turkish university
prep schools set — written against two real YTÜ İYS sample papers rather
than against an idea of what such an exam contains.

It is a static site. No accounts, no backend, no build step, no
dependencies, no analytics. Everything a learner does stays in their own
browser. It installs to a phone home screen; previously opened material
remains available offline while browser storage is retained.

**10 topics · 241 questions · 60 lessons · 723 option notes.**

---

## Who it is for

This is the decision that shapes everything else, so it comes first.

**Someone with a real English base and no academic foundation.** They
picked the language up from series, films, games, maybe from speaking it
— so their ear is good and their instinct is usually right — and they
were never taught the scaffolding underneath. They are not beginners.
They are the opposite of the usual textbook learner: **competence without
the labels.**

Three consequences run through the whole app:

- **The notation gets explained; the language usually does not.** Someone
  who says *"I have gone"* correctly may never have seen `V3` written
  down. Naming the form is the part they are actually missing. Explaining
  what a tense *is* would be talking down to them.
- **Every lesson is a contrast, not a chapter.** *Present Simple vs
  Present Continuous.* *Must vs Have to.* They do not need to be taught
  the forms — they need the boundary between two things their ear
  conflates.
- **A rule stated too absolutely fails this learner hardest**, because
  their ear will produce the counterexample and they will be right. That
  is why an option a competent teacher would accept counts as a defect
  here, and why every question has been read by someone who never saw the
  answer key.

---

## The three screens

The interface is Turkish. Practice sentences, example sentences and
answer options are English — that is the exam. Grammar category names
stay English, because students have to recognise the terms.

**Eğitim** opens on the ten topics, grouped, each with one Turkish line
saying what it is. A topic opens on its own overview — what this thing is,
two or three examples, the three components it turns on, and where it
appears on the paper — and the six lessons live one level below that,
because every lesson is a contrast and dropping someone into an argument
about a word they have not met does not work. A lesson is one scrolling
page built from typed blocks: the two forms set against each other, the
patterns, the mistake people actually make, the decision procedure to
carry into the exam, and check questions inline. An unread lesson opens with an optional
pretest and a direct “Derse geç” action. Its question and explanation do not
count toward article reading progress. Checks are never scored and never
block anything. Reaching the article end finishes the lesson; there is
no confirmation button for it.

**Test** is a mixed test across every topic, a single-topic test, practice
scoped to one grammar category, or **Yanlış defteri** — only the questions
you have got wrong and not yet earned your way out of. An item leaves the
book after two correct answers on two separate days; getting it wrong
again puts it back and the count restarts. Answering shows a full
explanation of why the key fits *this* paragraph, a short transferable
rule, and — the part that took the longest to write — a line saying what
the option *you* chose would have meant. There is one of those for every
wrong option in the app.

**Profil** is a local display name, how far through the lessons you are,
what your recent accuracy is and what is in that average, your weakest
categories, grouped study/appearance preferences, backup/restore, and exam
coverage limits. Completion and recent accuracy use labeled linear metrics;
no test data means an explicit empty state. The shared motion preference is available in Profile settings only;
OS reduced motion takes precedence. No header or content-footer toggle remains.

Nothing is sent automatically. Exporting a backup or opening a native share
sheet requires an explicit action and a preview of what the file contains.

It is a phone app first and stays one — but on a tablet or a desktop the
screens that have something worth putting beside them do: the start card
next to all ten topics, a topic's overview next to its six lessons, a
score next to the review of it. Not by widening the page. The reading
measure is bounded: narrow screens use their available width, while prose
stops growing on wider screens. Extra width buys a second column of what
would otherwise be below the fold. The lesson reader and
the question screen have no second column at any width, on purpose —
reading gains nothing from one, and a question with four options and one
action is a decision rather than something to scan. Below 1080px, or on a
short landscape window where two columns would be worse than one, every
screen is the phone layout, pixel for pixel.

---

## What it does not cover, and why the app says so

Session I of the sample paper is 60 points across four sections; Session
II is 20 more. This app practises parts of two of those sections. It says
so, on screen, in Profil:

> Session I'de 40 soru ve 60 puan var. Bu uygulama şu an paragraf içindeki
> boşluklar (15 puan) ve anlamca en yakın cümle (15 puan) çalıştırıyor.
> Okuma (21 puan) ve paragraf tamamlama (9 puan) burada yok…

The covered fraction is **counted, not asserted**: the sample cloze's ten
blanks are mapped to the topics that cover them, and the app derives the
number from what is actually live rather than stating it. A learner who
does well here should not conclude anything false about Friday.

That mechanism only works for a blank that names its covering topic in
advance. Two were written as `null` before any vocabulary topic existed,
were never repointed when those shipped, and so counted as uncovered for
ever — the screen said seven of ten when it was nine. Fixed 2026-09-06,
with a test that no blank may be nameless, which is the form the bug
could recur in.

---

## How the content is made

This is the unusual part of the repository, and the reason to look at it.

Lessons and questions are written by separate sessions working from
briefs in `docs/agents/`, against a category taxonomy fixed before either
starts — that taxonomy is what lets a wrong answer on the results screen
link to the lesson that teaches it.

Then the part that matters:

1. **A blind pass.** `npm run blind` strips a question set to exactly what
   a learner sees before answering — by allow-list, so a field nobody has
   thought about is withheld rather than leaked — and shuffles the
   options. A reviewer answers all of them before seeing any key.
2. **A lesson sufficiency pass**, whose highest-yield check is running each
   lesson's decision procedure as a literal checklist over its own
   questions. A rule that fires and returns a wrong option is a blocking
   defect even if a later rule would have reached the key, because the
   learner stops at the first rule that fires.
3. **A repair**, then **an independent re-audit** by a session that did not
   write the repair. This is not ceremony: of the repair rounds run so
   far, **five introduced a new defect**, every one caught here and none
   of them visible to `npm run check`.

The blind pass over the three oldest topics agreed with the key on **73 of
73 items** — so nothing is mis-keyed. What it found instead was
discrimination: items with a second defensible answer, and items
answerable with the paragraph deleted. Those were repaired.

Four things the tooling now enforces because a review found them:

- a question may not be built on a sentence from its own lesson (a check
  block draws from the same category, so the learner would meet the answer
  two blocks above the question);
- a lesson that uses `V3` or `V2` must say what it means;
- an intro may not print any of its own questions' answers;
- every colour token must still meet its contrast requirement.

---

## Running it

Plain HTML, CSS and ES modules with no build step — but the pages load
content with `fetch()`, so a `file://` URL will not work.

```bash
npm run serve          # static server on :8000
```

`package.json` exists for tooling only. It has **zero dependencies**, and
nothing in it is needed to serve the app.

```bash
npm run check          # format + validate + colour + unit tests — this is CI
npm run verify         # drives the real app in Chromium; needs `serve`
npm run audit          # measures each screen against the design spec
```

`check` runs on every push and pull request to `main` and `test`.
`verify` needs a browser and a running server. It walks learner journeys
at 320 / 390 / 768 / 1280px, checks overflow, targets, console errors,
wide layouts, and accessibility behavior. Use the command's output for
the current check count. Automated checks do not establish complete
accessibility conformance or substitute for learner testing.

Unit tests cover scoring, storage, backup, content validation, and both
hosted service workers' behavior against shared caches.

---

## Layout

```
index.html            App shell: header + Eğitim / Test / Profil + nav
quiz.html             Question screen
results.html          Score, breakdown, review
sw.js                 Service worker: versioned shell, unversioned content
js/                   ES modules — read each file's header comment
css/style.css         Inherited layout and components, in cascade layers
css/editorial.css     Margin presentation and theme extension
css/interactions.css  Shared control, icon and interaction states
css/onboarding.css    Interactive three-page introduction
assets/fonts/         Self-hosted Inter UI font
about/                Editable product and architecture stories with real captures
data/manifest.json    Topic index
data/<topic>/         One JSON file per topic: lessons and questions
tools/                Validator, formatter, colour maths, browser sweep
tests/                Unit tests
docs/                 Design system, content schema, research, agent briefs
original/             Full original interface and unchanged source archive
```

`docs/` is where the reasoning lives. `docs/margin-design-system.md` documents
the current extension; `docs/history/design-system.md` preserves the historical
source specification. `docs/CONTENT_GUIDE.md` is the content
schema; `docs/ROADMAP.md` is what ships next; `docs/research/` holds the
arms each decision was made from, including the ones that argued against
what shipped.

---

## Design

Margin opens in dark mode with plum-neutral surfaces, cherry/sakura brand
accents, Sakura correct-answer surfaces and periwinkle incorrect-answer surfaces.
Separate measured borders distinguish the full opaque rows; English text stays
neutral. Check/cross shapes, literal verdicts and accessible descriptions carry
meaning independently of hue. Pink is a product choice, not a universal correctness cue.
Inter's distinct heading, pattern, prose, support and control roles continue
from ADR 006. Explicit light and System preferences remain available.

[ADR 009](../docs/adr/009-expressive-study-motion.md) records the v0.70
interaction and answer-status system; later decisions refine its motion. Three bounded aura groups appear behind
every route, including reading; cherry, iris and lagoon pigments crossfade within
a measured group-opacity envelope. Profile settings provide the persistent motion preference; hidden pages
pause decoration and OS reduced motion wins.
Foreground cards remain opaque. Shared roles use 100ms control feedback, 220ms
reveals, 360ms navigation, 560ms scenes, 720ms completion, 900ms artwork stories and 1100ms flowing illustrations.
CSS owns ordinary control states; `js/interactions.js` owns finite effects and
bounded sequences. Replacing a scene cancels its delayed effects; pointer/focus
input settles moving ancestors. Menus translate without scaling. Inputs, scoring
and navigation commit immediately. Answering does not replay the question's
entrance; no full-page transition overlay blocks interaction.

The shared brand supports compact `ep.` and full `english prep.` signatures.
The optional three-page introduction composes six explorable Education/Test
scenes from sheets, answer rows and drawn paths, then offers an optional name.
It is skippable, writes no learning progress and never intercepts deep links.
A lesson signature appears only on its first unfinished-to-done transition.
Results have a distinct closing signature; a tab-local presentation marker
prevents replay on reload, separately from recording the attempt. Resume,
profile and result metrics identify what their actual numbers mean.
The [product/engineering portfolio](../about/) has selectable Read/Apply/Return and
architecture stories, with real responsive screenshots inside those explanations.
A compact mobile hero, nearby story controls and native feature/technical
disclosures keep the phone layout focused. (Superseded: v0.77 rebuilt About without the folio; see `about/README.md`.) Text and controls
remain stable; keyboard access and reduced-motion states remain complete. Content is expandable in `about/content.js`; the
[authoring guide](../about/README.md) explains safe copy, section and image edits.

`npm run color` checks current production roles, filled-answer boundaries,
explicit transition samples, action gradients and bounded aura overlaps in both themes. See the [interface system](../docs/margin-design-system.md)
for exact tokens and [validation](../docs/VALIDATION.md) for completed checks and
limits; passing contrast calculations alone does not establish reading comfort.

---

## Adding content

Adding a topic, a lesson or a question never requires touching JavaScript.
`docs/CONTENT_GUIDE.md` is the schema, `npm run validate` enforces it, and
`npm run format` keeps the files from churning between authors. Run
`format` after editing content: several sessions write into `data/`, and
one that reads a topic file, changes a lesson and writes it back
reformats every question in the file at the same time.

`docs/agents/README.md` describes the authoring loop, and the briefs
beside it are the ones the sessions actually run on.

---

## Versioning

`x.y`, tracked in `CHANGELOG.md`. **`x` is fixed at `0` and only the
project owner bumps it** — not a judgment an assistant or a contributor
makes, however large a change looks. `1.0` marks the point the owner
decides this is a real release, not any particular feature being
finished. Until then `y` increments for every shipped round.

`sw.js`'s cache name carries the same version, and a unit test fails when
the two disagree.

---

## Branches

- **`test`** — what GitHub Pages serves. Day-to-day development lands
  here and is tried on a real phone, so **a push to `test` is a
  deploy**.
- **`main`** — the owner's release branch, moved by the owner's hand at V1
  and later. Sessions never push, merge or open pull requests into it
  (owner, 2026-10-10; see `CLAUDE.md`).

To publish: **Settings → Pages → Deploy from a branch**, pick `test` and
the `/ (root)` folder. No Actions workflow builds it; CI only runs the
checks. So **there is no staging branch.** Work is verified before it lands,
not after.

---

## Where it is going

`docs/ROADMAP.md` is the current plan. What the product becomes after V1 (exam app,
general English app, or two apps) is parked in `docs/PRODUCT-DIRECTION.md`; the
September business research is in `docs/history/business/`.
