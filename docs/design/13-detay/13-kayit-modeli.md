# Gap #3: what the record mosaic's marks mean

`10-sentez.md` §5, item 3: *"the mosaic encodes nothing legible."*
`02-record-strip-v2-{dark,light}.png` is the one specimen in nine
rounds to clear all three rejection conditions in both themes
(`09-denetim.md`, Arm 3 final) — but it does it with ten day
columns sitting above four category labels that map onto nothing,
and browns the owner already called muddy once, about the glass in
round eight.

This file is not about the picture. It is about what a cell is,
what it means, and whether that meaning survives contact with how
little data this app actually has. Everything below is either read
directly from the app's own source, computed from `data/`, or
built and measured in this session. Marks: **[S]** read from source
or measured here, **[≈]** consistent secondary report, **[?]**
unverified.

---

## 1 · What is actually stored, and what six weeks buys

### 1.1 The stored shape, by field, not by summary

Read in full: `js/storage.js` (1071 lines), `js/quiz-engine.js`
(165 lines), and the two write sites, `js/quiz.js` and
`js/results.js`. One key, `englishPrep.history`, holding
`{ attempts: [] }`. Every finished quiz or lesson check appends one
attempt [S]:

```
attempt = {
  date: ISO string,                 // js/results.js:360, js/quiz.js
  mode: "mixed" | "topic" | "category" | "mistakes",
  topicBreakdown:    { [topicId]:  { correct, total } },
  categoryBreakdown: { [category]: { correct, total } },
  questions: [
    {
      id, topicId, category,        // js/quiz-engine.js:134-141
      type, prompt, correctAnswer,
      explanation, tip,
      optionNotes,                  // the full note object, not one note
      selectedAnswer: string|null,  // js/quiz.js:115 writes it as `selected`
      correct: boolean,
    }
  ]
}
```

`js/quiz-engine.js:151` carries `optionNotes` — the *whole* object,
every wrong option's note, not just the one the learner picked —
onto every stored question result. `js/quiz.js:115` then writes
`selected: question.selectedAnswer ?? null` into the attempt that
actually lands in `localStorage`. `grep -c "\.selected" js/storage.js`
returns 0 [S, confirmed independently, matches `09-denetim.md`'s
Arm 5 entry]. So every stored attempt already carries the literal
wrong-option text *and* the note that explains it, and nothing
downstream reads either back out except `js/results.js`'s
same-session review list and `js/feedback.js`'s answer moment.

### 1.2 What is derived, at what grain, gated how

None of this is re-derived here — `09-denetim.md`'s Arm 5 already
read every function and I re-read the same file to check its line
numbers, not its conclusions:

| function | grain | gate |
|---|---|---|
| `getItemStats()` [S, :168-198] | question | none — a raw tally |
| `getMistakeBook()` [S, :227-279] | question | 2 correct on 2 separate days to graduate (`MISTAKE_BOOK_GRADUATION`, :201) |
| `getTopicAccuracy()` [S, :331-351] | topic | last-20-answer window (`TOPIC_ACCURACY_WINDOW`, :304), `answered >= 3` to return anything (`MIN_ITEMS_FOR_WEAK_ENTRY`, :40) |
| `weakestEntries()` → `getWeakTopics`/`getWeakCategories` [S, :398-432] | topic/category | `total >= 6` (`MIN_ITEMS_FOR_WEAK_CLAIM`, :43) **and** `wilsonUpper(correct, total) < 0.8` (`MASTERY`, :51) to say `confident: true` |
| `getOverallStats()` [S, :477-516] | app-wide | last-40-answer window (`ACCURACY_WINDOW`, :459) |

`wilsonUpper` [S, :367-377] is the 95% Wilson upper bound, and its
own docstring already states the reasoning this file leans on
throughout: *"2 wrong out of 4 is 50%... the Wilson upper bound for
2/4 is about 0.85, so the app has no business saying that category
is a weakness."*

### 1.3 The corpus, counted directly

```
$ node -e '… walks data/manifest.json + every topic file …'
topics            10   (manifest.json — tenses, modals, passive-voice,
                        closest-meaning, connectors, quantifiers,
                        relative-clauses, gerunds-infinitives,
                        academic-nouns-adjectives, academic-verbs)
categories/topic   6   — every one of the ten topics, no exceptions
categories total  60   (10 × 6)
questions        241   (59 categories × 4 + 1 × 5)
optionNotes       723   — exactly 3 per question, every wrong option
                          in the corpus has a written note
```

[S, run in this repo; matches `09-denetim.md`'s Arm 5 numbers
exactly — 241/60/59×4+1×5/723 — independently reproduced, not
copied]

### 1.4 What six weeks of real use actually accumulates

Independently computed here from the app's own session-size
constants, as a cross-check on `05-kayit-ilerleme.md`'s scenario
table rather than a replacement for it:

```
js/config.js:5   TOPIC_TEST_DEFAULT_COUNT = 15
js/config.js:8   MIXED_TEST_DEFAULT_COUNT = "10"
js/storage.js:842 DAILY_GOAL_OPTIONS = [5, 10, 20]
```

[S] Three scenarios, 42 days, built from the daily-goal options a
learner actually picks in onboarding, at a plausible adherence rate
rather than every day:

| pattern | days hit / 42 | goal | total answers | / category (÷60) | / topic (÷10) |
|---|---:|---:|---:|---:|---:|
| light | 18 | 5 | 90 | 1.5 | 9 |
| moderate | 30 | 10 | 300 | 5.0 | 30 |
| heavy | 30 + 6 topic tests | 20 | 690 | 11.5 | 69 |

This lands in the same order of magnitude as `05`'s own
K1-pattern scenarios (240/360/540) [≈, cross-checked, not
re-derived — that table starts from stated usage patterns in a
document this pass did not re-open, this one starts from the app's
own stored constants; both land at single-to-low-double digits per
category and low tens per topic across six weeks]. The number that
matters for §2 below is not the exact count, it is the **order of
magnitude**: even a heavy six-week user meets a given category on
the order of ten times, not hundreds. Any mark keyed to "how many
times" has to be legible at that scale, and any mark keyed to "how
well" has to be honest at that scale — §3's problem exactly.

---

## 2 · The encoding: three candidates, and why two lose

### Candidate A — one cell = one day (what v2 built)

`02-record-strip-v2-*.html`: 70 cells, "Son 10 hafta / günlük"
above four category-name chips. Rejected on the evidence already in
`09-denetim.md`: *"ten columns above four category labels that do
not map onto them."* Structurally, a day and a category are
different axes — there is no way to make a 10-wide-by-7-tall grid
of days answer "how am I doing in Modals" without a second,
unstated dimension the reader has to invent. Killed by the
**position problem**, not the colour problem.

### Candidate B — one cell = one category, coloured by accuracy

The grid arm5's §5.4 named as an open question: 60 cells, one per
category, coloured by recent accuracy or a mastery tier. Two
independent reasons this loses, both already on the record:

1. **It cannot be honest.** §1.2/1.3 above: every category has 4 or
   5 items, total, ever. `MIN_ITEMS_FOR_WEAK_CLAIM = 6` can never be
   reached (`09-denetim.md`, Arm 5: *"no category in this app can
   reach the threshold at any accuracy, ever, under the current
   corpus"*). A 60-cell accuracy grid is 60 cells the app's own
   formula refuses to stand behind.
2. **It is the ornament already found and rejected.** A grid whose
   colour says "good here, bad there" is functionally Duolingo's
   discontinued strength meter (`05-kayit-ilerleme.md` §3.5) and
   exactly the *self*-level, verdict-shaped feedback Kluger &
   DeNisi's theory names as the kind most likely to reduce
   performance (`05` §2.3, d = 0.41 average but "more than a third
   of interventions decreased it," and the mechanism is specifically
   feedback that moves attention from the task to the person). A
   glance at 60 red/amber/green tiles reads as a report card whether
   or not the underlying number is statistically defensible.

### Candidate C — one cell = one category, coloured by coverage (built here)

Same 60 cells, same position, but the colour axis is changed: not
*how well*, but *how often this cycle*. A cell's shade is a count
of encounters, bucketed 0 / 1 / 2–3 / 4–5 / 6+, matching §1.4's
finding that six weeks puts most categories in exactly that range.
Rows are grouped by topic — ten rows, six cells each, topic title as
the row's own leading label (real titles: Tenses, Modals, Passive
Voice, Closest Meaning, Connectors & Discourse Markers, Quantifiers
& Determiners, Relative Clauses, Gerunds & Infinitives, Academic
Nouns & Adjectives, Academic Verbs — `data/manifest.json`, [S]).

This directly fixes Candidate A's defect by construction: **every
column sits under the label it belongs to**, because the label *is*
the row, not a caption four items away from ten columns. And it
sidesteps Candidate B's honesty problem, which §3 makes explicit.

### Candidate D — the honest-grain alternative, sized (not rejected, just too small)

`09-denetim.md`'s Arm 5 already computed this and it is not
re-derived here: a 10-cell topic-accuracy strip, at topic grain,
*can* clear the confidence gate — 60% over the 20-question window
gives `wilsonUpper` ≈ 0.78, under the 0.8 mastery bar — but at
compact cell size it fills **1.7% of a 390×844 frame**, an order of
magnitude under the ≥10% mid-tone floor `00-brief.md` carries
forward. Correct and too small to matter as an entrance-screen
device on its own. Not discarded — §4 puts exactly this in the one
place a statistically honest small number belongs: prose, not area.

**Chosen: Candidate C.** It is the only one of the four that is
simultaneously large enough to matter for §6's area requirement,
mapped so a column and its label cannot come apart, and honest at
the exact sample size this corpus actually has — because, unlike B,
it never asks the data for more than it can give.

---

## 3 · The honesty problem, resolved

`10-sentez.md` §5 states the tension exactly: the statistically
defensible grain (topic, ~24 items) reaches 1.7% of frame; the
grain large enough to matter (category, ~4-5 items) reaches ~10.5%
and "cannot support a confident claim about any cell." Candidate B
above is what happens if a design tries to make one mark do both
jobs at once — and it cannot, because the two jobs need different
amounts of evidence.

**The resolution is not a compromise between the two grains. It is
splitting what the mark is allowed to *claim* by what kind of claim
it is**, and putting each claim at the grain its evidence actually
supports:

- **A count needs no confidence interval.** "You have met this
  category N times in six weeks" is true the moment N is counted —
  it does not improve or degrade with more data, because it is not
  an estimate of anything. This is the same move `09-denetim.md`'s
  Arm 5 already made for individual wrong answers (§4.5: *"a
  per-distractor record cannot support a statistical claim… it can
  only support a factual one"*) — applied here one level up, to the
  category grid itself, not only to the distractor tallies beneath
  it.
- **An accuracy claim needs `wilsonUpper` and `total >= 6`**, and
  §1.3 shows category grain structurally never clears that bar. So
  accuracy claims stay where the app's own gate already allows them
  — the topic-level weak list already shipping in Profil, and the
  one honest small number Candidate D describes, which §4 places in
  prose rather than area.

So the 60-cell grid built for this file (§6) makes exactly one
claim per cell — *this many times, this cycle* — and that claim is
true at n=0 as much as at n=9; an empty cell is not a smaller
version of a confident claim, it is a different, equally true fact
("never met yet"). No cell in Candidate C ever says "you are weak
here," which means it needs no Wilson bound at all: **the tension
in `10-sentez.md` was only unsolvable as long as the 60-cell grid
was assumed to be a report card. It is not one here — the resolution
is a change of what class of statement the mark is, not a bigger
corpus.**

What this costs: the coverage mosaic cannot answer "am I getting
better," only "have I been here." That question stays answered
where it already is — Profil's weak lists, gated exactly as before
— and the mosaic adds a genuinely new fact those lists do not carry:
the *blank* cells, i.e. which categories the learner has not met at
all. That is itself the calibration-relevant fact
(`05-kayit-ilerleme.md` §2.6): a learner whose ear is usually right
tends to overestimate coverage of what already feels comfortable,
and a coverage map — not an accuracy map — is the one device that
can show the gap between "I think I've done this" and "I haven't."

---

## 4 · The distractor data: what it can say, and where it goes

Not repeating `05-kayit-ilerleme.md` §4-5's design — D1, the
extended mistake-book list plus the recurring-distractor rollup, on
a new child screen reached from Profil — which stands. Building on
it at exactly the one point this file's brief calls out: where the
distractor fact sits *relative to the mosaic*.

**Not in the mosaic.** The mosaic (§2-3) carries one claim —
count — and no more; folding a second claim (which option, how
often) into the same 60 cells is exactly the overload that made v2
illegible in the first place, just with a different pair of axes
colliding instead of days-vs-categories.

**One line beside it, at the honest grain.** `05`'s §4.5 finding —
a per-distractor tally cannot support a statistical claim, only a
factual, dated one — applies directly: the specimen built here
carries exactly one such line, built from real corpus data rather
than invented copy:

> *"Son yedi karşılaşmada en sık **been** ile **gone** karıştı."*

drawn from `data/tenses/tenses.json`'s `tenses-t20` [S]: paragraph
*"Have you ____ to Japan before…"*, `optionNotes.gone`: *"'Have gone
to' kişinin oraya gidip hâlâ orada olduğunu söyler…"* This is the
one wrong-option fact worth surfacing at the entrance — dated,
specific, task-level (Hattie & Timperley's terms, `05` §2.1) — and
it is a single sentence, not a grid.

**The full drill-down stays on D1**, per `05`'s existing placement:
Profil → a new child screen, the extended per-question mistake list
with `optionNotes` shown per row, and the category-level
recurring-distractor rollup. Nothing here changes that; this file
only had to decide whether the entrance mosaic needed a second axis
to carry it, and §3's honesty argument says it should not.

---

## 5 · What must never appear

Restating `05-kayit-ilerleme.md` §5.3's checklist only where the
coverage-mosaic design (§2-3) makes a new instance of an old rule
concrete, not re-arguing the sources:

- **No streak, level or badge tied to the mosaic.** Already ruled
  out app-wide (`app1-final.md` §7, `05` §5.3) and Deci, Koestner &
  Ryan's d = −0.28 to −0.40 on reward-contingent tasks (`05` §5.3,
  cited via `06-rakip-analizi.md`) is the mechanism, not a taste.
- **No "fill the grid" framing, and no coverage percentage.** This
  is new to this file, not inherited: because Candidate C's cells
  fill in as a learner practises, the object risks reading as a
  completion bar the moment a percentage or a "37/60 done!" label is
  attached to it. The mosaic must stay a *map of what happened*, not
  a *target of what should*. No copy anywhere in the specimen built
  for §6 states a completion fraction for the grid itself.
- **No accuracy colour anywhere in the mosaic**, per §3 — not even a
  small corner mark for "last one wrong." §2's Candidate B section
  gives the specific reason (Kluger & DeNisi's attention-to-self
  mechanism); a single-hue ramp is the only variant checked here
  that cannot be read as a verdict.
- **No per-topic hue as a legend.** Already measured and rejected:
  ten topic hues collapse into one ≈30° band (`05` §5.3, citing
  `10-ihtiyaclar.md` §6). The specimen uses one accent hue at
  varying strength, never a hue-per-topic key.
- **No celebration on a cell filling in or a category "completing."**
  `05` §5.3 already names this for mistake-book graduation; it
  applies identically here — a cell moving from empty to filled is
  not an event the app should mark with motion, sound or colour
  beyond the plain state change.

---

## 6 · The specimen, built and measured

Built in this session: `13-ornekler/01-coverage-mosaic-{dark,
light}.html` and their `.png` renders, 390×844, Chromium via
Playwright (`executablePath: "/opt/pw-browsers/chromium"`). Real
data throughout — real topic titles and category counts from
`data/manifest.json`, a real distractor line from `tenses-t20`, and
every text colour a token value copied verbatim from
`tools/palette.mjs`'s solved `surfaces`/`tokens` output, never
invented.

### 6.1 The object

Ten rows (`.trow`), one per topic, `list`-container idiom
(`design-system.md` §0.2: hairline between rows, nothing around).
Each row: topic title as a real `.row__title`-equivalent (18/400,
`text-1`, serif via `.t-en`, `lang="en"`), and six 31×31px cells at
4px gaps — one per category, in the topic's own order. Fill is a
single accent hue (`--accent`) at four opacities (0.42 / 0.62 / 0.8
/ 0.98) for encounter buckets 1 / 2–3 / 4–5 / 6+; bucket 0 is a
transparent cell with a 1.5px `--edge`-toned outline. One line of
legend, in full: *"Koyuluk: bu 6 haftada kaç kez çalıştığın — boş:
hiç görülmedi."*

The encounter counts are a hand-built, plausible six-week history
(front-loaded on the topics a learner meets first, tapering into
the vocabulary topics `v1-plan.md` names as what is left to
consolidate) — 87 total encounters, 37 of 60 categories non-empty,
bucket tally `[m0:23, m1:14, m2:16, m3:5, m4:2]`, all printed by the
generator script at build time. Not a simulation; a single
plausible instance, as item 6 asked for.

### 6.2 Type, contrast, and the two named defects

Every text/background pair in the specimen is one of two cases:
`--c-text-1` at 18-28px (body/heading tier, required Lc ≈ 90/85) or
`--c-text-2` / `--c-accent-text` at the two legal small pairs the
design system names — 15/600 or 18/400 (`design-system.md` §1.3;
`tools/palette.mjs`'s `PAIRS`, e.g. `.t-label`, `.t-meta`,
`.row__title`). No invented size: every size used (28, 22, 18, 15)
is one of the app's five declared type sizes. Computed directly
with `tools/color.mjs` against the exact solved hex values, text on
`--page` (never the mosaic's cell colours — no text sits on a cell
anywhere in this specimen):

| pair | dark Lc / WCAG | light Lc / WCAG |
|---|---:|---:|
| text-1, 22-28px, on page | 94.7 / 15.98 | 95.8 / 15.15 |
| text-2, 15/18px, on page | 79.8 / 12.73 | 87.8 / 9.95 |
| accent-text, 15/600, on page | 80.0 / 12.76 | 86.1 / 9.44 |
| on-accent, 18/600, on the button gradient | 67.0 / 9.91 | 72.8 / 4.79 |

[S, `tools/color.mjs`'s `apca`/`wcagContrast`, run against the
exact hexes in `13-ornekler/01-coverage-mosaic-*.html`]. Every pair
clears the requirement its own tier carries in `design-system.md`
§1.3/1.4 (text-1 at ≈90/85, text-2 and accent-text at ≈75-80, both
well past WCAG 7); `text-1` additionally clears the stricter
Lc-90-and-WCAG-7 bar arm3 found the first grammar-diagram specimen
failing — the specific defect this file was told to check for. No
occurrence found.

**`lang="en"` / uppercase check**, the second named defect: `grep -c
"text-transform" 01-coverage-mosaic-dark.html` returns 0 [S] — no
rule in this specimen uppercases anything, so the İ-bug's mechanism
(an English string uppercased under a Turkish locale) cannot occur
regardless of `lang`. Every English string is marked anyway,
correctly and for its own reason (screen-reader pronunciation, per
`CLAUDE.md`'s convention): all ten topic titles and both example
words (`been`, `gone`) carry `lang="en"` and `.t-en`; every Turkish
string carries `lang="tr"`. `grep -n 'lang='` on the built file
confirms all fourteen occurrences [S].

### 6.3 The measurement

```
$ python3 docs/design/measure-screens.py \
    13-ornekler/01-coverage-mosaic-{dark,light}.png
screen            event   hues        (mid-tone via midtone.py, separately)
dark              22.3%   H60 10.1%    mid 11.9%
light             20.7%   H60  6.3%    mid 13.9%
```

Against `00-brief.md`'s three carried-forward rejection conditions
— event ≥20%, one hue family ≥1.5%, mid-tone ≥10%, all in both
themes — **all three clear, in both themes** [S, measured in this
session with the same two scripts every prior specimen in this
round was measured with]. For direct comparison, not a claim of
improvement: v2 measured 23.7/8.0/15.1 (dark) and 22.9/8.2/15.3
(light) in `09-denetim.md`. This specimen trades roughly two points
of mid-tone and hue-family margin in exchange for every cell mapping
onto a real label and carrying one honest claim instead of an
illegible one — the trade §0's brief exists to make explicit rather
than to hide behind a passing number.

### 6.4 What the specimen does not settle

It is one screen's worth of one section, not the whole entrance.
Where this coverage mosaic sits relative to the rest of a real
Bugün screen (a hero, a ring, the daily goal) is unaddressed here —
the specimen borrows v2's chrome (bar, avatar, footer button)
verbatim to keep the comparison in §6.3 apples-to-apples, not
because that chrome is being proposed. Whether a real Bugün screen
has room for both this section and everything else Profil/Bugün
already carries is a layout-budget question for whoever runs the
next design round, the same way `10-sentez.md` §5 item 4 already
flags for the other seven screens.

---

## Öneri

1. **Adopt Candidate C's core move — decouple the claim from the
   grain — before adopting any specific pixel layout.** The
   honesty/area tension in `10-sentez.md` §5 is not a property of
   this corpus size; it is a property of asking one mark to be both
   large and confident. A coverage mark needs no confidence interval
   at any n; an accuracy mark needs six items a category will never
   have. Keep them apart and both problems named in that document
   are solved, not traded off.

2. **Build the mosaic as a `list` of topic rows, category cells
   trailing, not a free grid.** This is not a stylistic preference:
   it is what makes "which column belongs to which label"
   structurally unaskable, because the label is the row. It also
   costs nothing new in the component inventory — `.row__title` and
   a small new leaf ("coverage strip," a short sequence of marks in
   a row's trailing slot) are the only pieces, and the strip is
   exactly the gap `05-kayit-ilerleme.md` §5.2 already named and
   left open.

3. **Keep the mosaic to one claim (count) and put the distractor
   fact beside it as one dated sentence, never inside it.** §4's
   specimen line, built from real `optionNotes` data, is the
   pattern: specific, dated, task-level, and cheap — it needs no new
   storage, only `question.selected` already on disk since v0.34.
   The fuller per-distractor list stays where `05` already placed
   it, on D1.

4. **Ship `getDistractorStats()` before any of this**, exactly as
   `05-kayit-ilerleme.md`'s own recommendation #1 already states —
   it is the one piece all of §4 depends on and it costs nothing:
   the data is already in every learner's history.

5. **Whoever runs the next design round should see §6.3's numbers
   next to v2's before choosing between them**, not default to
   "more filled cells is more area" — the two are close enough
   (within ~2-4 points on every metric) that legibility, not area,
   should be the deciding factor, and only one of the two candidates
   has a legible information model behind its pixels.

## Doğrulanamayanlar

1. **The plausible six-week encounter history in §6.1 is
   hand-built, not simulated against `orderForPractice`.** Running
   the actual worst-first ordering logic (`js/quiz-engine.js:41-62`)
   over a synthetic 42-day session log would produce a *specific*
   distribution rather than a plausible one, and would let §1.4's
   "single-to-low-double-digits per category" finding be checked
   against a real simulation instead of independent arithmetic on
   session-size constants. Buildable in this repo with no network:
   a small script feeding `buildQuizSession`/`orderForPractice` a
   simulated 42-day answer stream and reading off the per-category
   counts.

2. **Whether a coverage mosaic actually serves the calibration
   argument in §3** (a learner sees blank cells and revises their
   sense of what they've covered) is asserted from the cited
   literature's general finding about overconfidence and
   disengagement (`05-kayit-ilerleme.md` §2.6, itself marked `[≈]`
   there), not tested with an actual learner. This file's job was
   the information model, not a usability check; the next honest
   step is showing the built specimen to someone actually revising
   for this exam, which needs a person, not a script.

3. **The comparison in §6.3 to v2's numbers** uses v2's own
   measurements as recorded in `09-denetim.md` rather than
   re-running `measure-screens.py`/`midtone.py` on the original
   `02-record-strip-v2-*.png` files in this pass. The files still
   exist at `03-ornekler/`; re-measuring them alongside this file's
   specimen in one pass, rather than trusting a prior session's
   printed numbers, was not done here and would be a small,
   zero-network check.

4. **Whether 31px cells at 4px gaps is the best point on the
   area/legibility curve**, as opposed to merely a point that clears
   the three thresholds — §6.3's numbers were reached by iterating
   cell size and ramp alpha twice against the measured output, not
   by solving for an optimum. A short sweep (e.g. 26/29/31/34px)
   with the same measurement scripts would show whether the margin
   above the three bars is flat or steep, which matters for how much
   room a real screen's other content has to share the fold with
   this section.
