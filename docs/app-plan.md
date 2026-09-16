# The application, planned from its materials

2026-09-11. Four rounds of interface work (v0.46–v0.62) were rejected by
the owner, the last of them in these words: *the ideas are not bad, but
it became AI slop; you keep re-skinning the old system instead of
building the app. Plan and build the whole application from the
materials you have.*

He is right, and this file is the answer. It is not a UI plan. It
designs the product — what a session is, what screens exist, what the
menus mean — from the content and the learner, and only then gives that
product a surface.

Decisions the owner took on 2026-09-11, which this plan obeys:

| question | his answer |
|---|---|
| the shape of the app | **the day's session** — the app chooses what to practise; teaching opens inside the flow where the learner gets something wrong |
| the visual language | **editorial, with expression put inside it** — custom drawing and a little motion, without breaking the academic feel |
| what may change | the tabs' meaning, **but they must express a purpose**, and the learner must still be able to choose between studying a topic and taking a test; a *Bugün*-style home page is welcome |
| onboarding | **cut it.** The exam countdown was onboarding-excess, unnecessary as a feature and as a process. A first run introduces the app, teaches how it works, welcomes the learner. Nothing more, nothing collected |
| the home screen | **a dashboard** — progress, weak areas, accuracy |

Marks as elsewhere: [S] a source read; [?] unverifiable from here;
[≈] an estimate.

---

## 1 · Why four rounds failed, precisely

Not "the CSS was wrong". The same skeleton was repainted four times:

```
tab Eğitim → topic → lesson (4 min page) → back → tab Test → topic → quiz → results page
```

Every round changed how that skeleton looked and none changed the fact
that **the learner has to assemble the study session themselves** —
choose a half of the app, choose a topic, choose a lesson or a test,
and then carry what went wrong on the test back to the lesson that
explains it, by hand, across two tabs. The app computes exactly which
lesson that is, on every wrong answer, and has never once opened it.

v0.62 then added decoration on top of that unresolved structure, which
is what made it read as slop. Named exactly, so it is not repeated:

1. **Ornament with no referent.** A per-topic hue produced by *hashing
   the topic id*. Modals is purple for no reason. That is the purest
   form of the thing: a decision that looks like design and carries no
   information.
2. **Every surface treated the same.** Card, edge, lit top, shadow —
   on the hero, the tiles, the stats, the options, the prompt, the
   feedback, the dialog. When everything is a card, nothing is, and the
   eye has no path through the screen.
3. **The two known tells of generated interface**: a gradient on the
   primary action, and a glow under it. [S] Both are in every list of
   "how to spot AI design" published this year, for the same reason —
   they are the median of the training data, reached for when nothing
   else decides.
4. **Motion as garnish.** Springs with overshoot on things that do not
   move in space, a breathing orb, a shake, a pop, confetti, a
   count-up. Each defensible alone; together, a toy.
5. **Readability went backwards** — which is the part that actually
   matters. Body text moved onto tinted grounds, the reader gained a
   coloured band behind its title, the explanation (a 377-character
   paragraph, read after every wrong answer) was put inside a red box.

## 2 · The materials

Counted on 2026-09-11, not estimated:

| | |
|---|---|
| topics | 10 live, 4 difficulty tiers |
| lessons | 60, one per category — each an *X vs Y* contrast |
| a lesson | ~3,800 characters ≈ 4 minutes, 7–12 typed blocks |
| block types | `text` 100 · `contrast` 85 · `pitfall` 172 · `forms` 60 · `examples` 60 · `decision` 63 · `check` 120 |
| questions | 241 — 217 paragraph-cloze, 24 restatement |
| a question | a ~198-character paragraph, 4 options, **a 377-character explanation**, a one-line rule, and a note for each wrong option |
| the engine | scoring, interleaved draw, item stats, a mistake book that graduates an item after two correct answers on two separate days, weak categories and weak topics |

Two facts in that table decide the product.

**The explanation is the teaching.** 241 × ~377 characters is 91,000
characters of instruction written *at the point of failure* — more than
half the length of the entire lesson corpus, and it is already keyed to
the exact mistake the learner just made. The app has been treating it
as a footnote under a quiz.

**Every question knows its category, and every category has a lesson.**
So the app can always answer "which page explains this?" — it has
answered it on the results screen for months, as a link nobody follows
because it means leaving the test.

## 3 · The learner's real session

Six weeks, a phone, ten minutes at a time, on a bus or before bed. They
open the app to find out **what to do now**, do it, and see that it
worked. They do not open it to browse a syllabus.

So the product is a loop, not a library:

```
   what should I do now?  →  do it  →  find out  →  understand why  →  meet it again later
        Bugün                    Oturum                                   the book
```

Every piece of that already exists in the code. None of it was ever
assembled into one path.

## 4 · The product

### 4.1 Three destinations, each an intent

| | name | what it is for |
|---|---|---|
| home | **Bugün** | what to do now, and how it is going |
| tab | **Öğren** | the ten topics and their sixty lessons — read anything, any time |
| tab | **Çöz** | choose a practice: mixed, one topic, the mistake book |
| bar | **Profil** | the learner: name, data, settings, what the app covers |

This keeps what the owner settled by feedback long ago — a learner can
still choose between studying a topic and taking a test, and Profil is
not a content mode — and it fixes what was broken: neither tab was an
*intent*, so the home screen had to guess which one you wanted and the
answer was a card with five mutually exclusive states.

`Bugün` is the default route. `Öğren` and `Çöz` are the two ways to
override the app's suggestion, named as the two things a learner
actually wants to do.

### 4.2 The session — the one screen that matters

One screen, `#oturum`, with phases. It replaces the quiz screen, the
results page, and the reader's role as the place teaching happens.

**Composition** (10 items, interleaved, never blocked):

| source | up to | why |
|---|---|---|
| the mistake book, due items | 4 | the one mode with evidence behind it; it is why the book exists |
| the weakest category already met | 3 | the app knows; it has never acted on it |
| categories not yet met | the rest | new ground every day, or the app is only revision |

**Phases:**

1. **Soru** — the paragraph, four options, nothing else on screen.
2. **Cevap** — the verdict, the correct answer, the explanation, the
   note for the option they chose, the rule. Prose on the page, not in
   a coloured box: this is the longest thing the learner reads and it
   is read after a mistake, when they are least patient.
3. **Kural** *(conditional)* — when the same category has now been
   missed twice, or the item came from the book, the session offers
   **"Bu kuralı aç"**. It expands, inline, the two blocks of that
   lesson that carry the boundary and the procedure — its `contrast`
   and its `decision`. No new content, no schema change, no navigation
   away. This is the thing the app has never done and the reason the
   whole round exists.
4. **Özet** — the last phase of the same screen, not a separate page:
   how many, which categories went wrong, one drawing, and two ways
   on — *keep going* (10 more) or *finish*.

The learner can leave at any point; what was answered is recorded, as
it is today.

### 4.3 Bugün

A dashboard, as asked, in one column:

- **The offer.** One line saying what today's session is made of
  ("4 tanesi yanlış defterinden"), and one button. This is the only
  filled button on the screen.
- **Bu hafta.** Seven days as seven small marks — answered / not — and
  the number of questions this week. No streak language, no flame, no
  nagging; a week of days is a fact, and a missed day is a gap in a row
  rather than a punishment.
- **Nerede zorlanıyorsun.** The three weakest categories, worst first,
  each a row that opens *that category's* practice. With the hedge the
  app already writes when the evidence is thin.
- **İlerleme.** Lessons read, questions seen, accuracy over the last
  twenty — three figures on one line, and one line of prose saying
  which part of the exam this app does not cover.

### 4.4 Öğren and the reader

`Öğren` is ten topic rows — a drawn mark, the English name, the Turkish
gloss, and how many of its six lessons are done. A topic opens its
overview (unchanged in substance: what this thing *is*, then its
lessons). A lesson opens the reader, which stays a single scrolling
page, because a lesson is something you read and four minutes is a
reasonable page.

What changes in the reader: it loses the coloured band, the check
blocks lose their boxes, and the end of a lesson offers the session
rather than a topic test.

### 4.5 The first run

One screen. Not a wizard, not a tour, nothing collected — the owner
struck the exam date and the daily goal, and the research already in
this repo (`js/education.js`, `docs/research/onboarding.md`) rejects
tours outright.

It says what the app is, shows in three short lines how a session works
(*soru → neden → kural*), and has one button, *Başla*, which starts the
first session. It appears once and is reachable again from Profil.

## 5 · The language

Editorial, with expression put inside it — the owner's words. Which
means: the page is quiet, and the few things that are alive are alive
for a reason.

### 5.1 What carries hierarchy

Type, space and one accent. Not containers.

- The measured scale stays: **36 · 28 · 22 · 18 · 15**, four sizes per
  screen at most, 15 only at 600 and only for a line.
- The measured palette stays, both themes, and `npm run color` stays in
  CI. What is deleted is everything that was added on top of it:
  `--accent-2`, `--grad-accent`, `--shadow-glow`, `--orb`, `--wash-1/2`,
  and the three-level shadow set.
- **A card is a rare thing.** It is used where something is a discrete
  object you act on — the session offer on Bugün, a dialog. Lists are
  rows with hairlines. Prose is prose on the page. The options are rows
  with a letter, separated by rules, not eight stacked cards.
- One accent, three jobs and no fourth: the one filled action, the
  progress fill, the section label.

### 5.2 The drawings

This is where the expression goes, and the reason it will not read as
generated: the drawings *mean* something and are built to the same
written contract as the icon set (§6 of the design system) — 2px
stroke, round caps and joins, a fixed live area, no fill except one
accent element.

**Ten topic marks**, each a picture of what the topic *is*:

| topic | the drawing |
|---|---|
| Tenses | a timeline: three ticks, one filled |
| Modals | a dial from *kesin* to *belki*, with a needle |
| Passive Voice | two nodes and an arrow running backwards |
| Relative Clauses | a sentence line with a branch hanging off one word |
| Connectors | two blocks joined by a span |
| Quantifiers | a row of units under one bracket |
| Gerunds & Infinitives | a path forking after a verb |
| Closest Meaning | two shapes almost overlapping |
| Academic Nouns & Adjectives | a block with a label clipped to it |
| Academic Verbs | an arrow acting on a shape |

They are 40px in a list, 96px on a topic screen. They replace the
hashed hue, and unlike it they teach: after a week, a learner finds
*Relative Clauses* by its branch.

**Six state drawings**, at 96–120px, for the moments the app has
something to say: the welcome, a finished session, an empty mistake
book, everything read, nothing found in search, offline.

### 5.3 Motion — five things, and no sixth

| what | how | why |
|---|---|---|
| a phase change inside the session | 140 ms crossfade, opacity only | it happens ten times a session; it must not perform |
| a screen arriving | 220 ms, 8 px rise, ease-out, no stagger | says a new place |
| the verdict mark | the tick or cross **draws itself**, 260 ms | the drawing language, applied to feedback |
| the progress line | width, 280 ms ease-out | position |
| a press | opacity and surface, 120 ms; `scale(.98)` on the option and the button | touch feedback |

Deleted: every spring with overshoot, the staggered children, the
shake, the pop, the count-up, the confetti, the breathing orb, the
sliding tab indicator, the haptic. Under `prefers-reduced-motion`
everything above becomes a fade or nothing, and the sweep counts zero
running animations, as it does today.

The emotional beat of the app is **one per session**: the drawing at
the end of the summary, and a line that is honest about what happened.
Not one per answer.

## 6 · What is deleted

Feature-level, because a rebuild that only adds is not a rebuild:

- the exam countdown, the daily goal, and the four-step first run;
- the results *page* (it becomes the session's last phase);
- the topic tile grid, the hashed hues, the rings, the stat tiles, the
  streak flame, the confetti;
- the gradient, the glow, the ambient washes, the floating capsule;
- `js/widgets.js` and `js/celebrate.js` as they stand — the ring, the
  monogram, the count-up and the confetti have no place in the new
  language; `avatar` and `choices` survive, rewritten.

Nothing in `data/` changes. No content is rewritten. The engine,
storage, validator, service worker and the whole test suite stay.

## 7 · The phases

Each lands on `test` only when the app is coherent; `npm run check`
passes at every step and the sweep before any push.

| phase | ships |
|---|---|
| **0 · The plan and the look** | this file; a static prototype of six screens in the new language, shown to the owner before a line of app code changes |
| **1 · The drawings** | `js/marks.js` — ten topic marks and six state drawings to the §6 contract, with a catalogue page and the contrast measured |
| **2 · The session** | `#oturum`: composition, the four phases, inline `Kural`, the summary; `results.html` retires |
| **3 · The three destinations** | Bugün, Öğren, Çöz, Profil recomposed; the router and the tab bar renamed to intents |
| **4 · The surface** | `css/style.css` rewritten to §5 — no gradient, no glow, no washes, cards only where earned; the first run reduced to one screen |
| **5 · Spec and proof** | the design system rewritten around this plan; the sweep extended to the session's phases; three phones, two themes |

## 8 · What this refuses

- A tour, a wizard, a countdown, a streak that punishes, a celebration
  the learner did not earn.
- Locked progression: the learner may open any lesson at any time.
  Sequencing is a suggestion the app makes on Bugün, never a gate.
- A gradient, a glow, an ambient wash, a hashed colour, a card around
  something that is not an object.
- Any motion that does not say something, and any motion over 400 ms.
- Adding a component without its spec, its catalogue entry and its
  measured pairs — the one rule from UI 2 that was right and stays.
