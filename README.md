# English Prep

A study app for the English proficiency exams that Turkish university
prep schools set — written against two real YTÜ İYS sample papers rather
than against an idea of what such an exam contains.

It is a static site. No accounts, no backend, no build step, no
dependencies, no analytics. Everything a learner does stays in their own
browser. It installs to a phone home screen and works with no
connection.

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
carry into the exam, and check questions inline. Checks are never scored
and never block anything. Reaching the end finishes the lesson; there is
no button for it.

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
categories, an export/import of everything stored, and the roadmap.

Nothing is sent anywhere.

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

The number on screen is currently "seven of ten" and the true figure is
nine — two blanks were written before any vocabulary topic existed and
were never repointed when those shipped, so they count as uncovered for
ever. It is wrong in the direction the design prefers, and it is on the
list (`docs/roadmap.md`).

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
`verify` does not — it needs a browser, and the point of having no
dependencies is not to acquire one for CI. It walks a whole learner
journey at 320 / 390 / 768 / 1280, auditing every screen it lands on for
horizontal overflow, touch targets under 44px and console errors, then
runs the accessibility contract once. **1518 checks.** Run it for anything
that touches the interface: WCAG conformance is defined per page and per
responsive variation, so the sweep *is* the requirement.

There are also 146 unit tests over the scoring, storage, backup and
content checks.

---

## Layout

```
index.html            App shell: header + Eğitim / Test / Profil + nav
quiz.html             Question screen
results.html          Score, breakdown, review
sw.js                 Service worker: versioned shell, unversioned content
js/                   ES modules — read each file's header comment
css/style.css         One stylesheet, in cascade layers
data/manifest.json    Topic index
data/<topic>/         One JSON file per topic: lessons and questions
tools/                Validator, formatter, colour maths, browser sweep
tests/                Unit tests
docs/                 Design system, content schema, research, agent briefs
```

`docs/` is where the reasoning lives. `docs/design-system.md` is the
binding visual specification; `docs/CONTENT_GUIDE.md` is the content
schema; `docs/roadmap.md` is what ships next; `docs/research/` holds the
arms each decision was made from, including the ones that argued against
what shipped.

---

## Design

One deliberate look rather than a theme toggle: a warm dark ground, one
amber accent doing one job, a serif display face against a sans for body
text and a mono for numbers, and depth from surface lightness rather than
borders or shadows.

The palette is not chosen by eye. Every colour is solved against a
contrast requirement and re-measured by `npm run color`, which runs in CI
— WCAG 2 ratios and APCA lightness contrast, on every token, against every
surface it can appear on.

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

- **`main`** — the intended published branch: verified content only.
- **`test`** — day-to-day development. Work lands here, gets tried on a
  real phone, then merges.

To publish: **Settings → Pages → Deploy from a branch**, pick the branch
and the `/ (root)` folder. No Actions workflow builds it; CI only runs
the checks.

**As of 2026-09-05 that merge has never happened.** `main` holds a
single commit — the initial MVP of 2026-09-02 — and `test` is 182
commits ahead of it: the redesign, all ten topics, the review pipeline
and every fix since. So one of two things is true, and which one matters
a great deal: either Pages is pointed at `test`, in which case the first
bullet above describes an intention rather than the deployment, or it is
pointed at `main`, in which case everyone using the app is on the
two-day-old MVP. It could not be checked from the session that wrote
this (the live host is unreachable through its proxy), so it is written
down rather than guessed at.

---

## Where it is going

`docs/roadmap.md` is the current plan and `docs/business/` is the
newer question — what this becomes after the exam it was built for.
Neither is decided here.
