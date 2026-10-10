# The design language, researched

2026-09-11. Step 3 of the procedure in `01-diagnosis.md`. It answers the
twelve questions `02-references.md` §15 handed over, to the standard
`docs/research/beta1-palette.md` set: **every claim is a number that can
be re-run, every recommendation ends in a value, and §14 lists what could
not be verified.**

No application code is touched here. The output of this file is a set of
solved values and three decisions the owner has to make, which step 4
turns into a brief and step 5 turns into three directions.

Marks as elsewhere: [S] measured or read from a source in this
repository; [≈] an estimate.

**How the numbers were produced.** Colour is solved with the app's own
`tools/color.mjs` and checked against the app's own `PAIRS` table and
`requiredLc()` from `tools/palette.mjs` — the same code `npm run color`
runs in CI, so nothing here can pass in this file and fail in the build.
Screens are measured with `docs/design/measure-screens.py`. The solver
scripts are in the session scratchpad and are reproduced inline where a
result depends on the search.

---

## 0 · The short version

Five things are settled by measurement and need no further discussion.

1. **A vivid orange fill cannot carry a label.** At H 36–60 there is a
   dead band from L 0.62 to L 0.74 — exactly where the reference orange
   lives — in which no ink clears WCAG 4.5 *and* APCA Lc 60 together:
   light inks fail WCAG, dark inks fail APCA. Reference 6's own
   "Continue reading" button measures **3.49:1**.
2. **So the filled action stops being a colour and becomes a plane, and
   the whole problem dissolves.** A near-black pill on the cream page
   carries its label at **Lc 97** and stands at **14.6:1** against the
   page; a near-white pill on the dark page carries its label at Lc 92
   and 15.4:1 [S]. That is reference 11's move, and it is the same
   material as §3's counter-plane — one token doing two jobs. The accent
   is then freed to be vivid, because nothing is written on it: one hue,
   **H 45**, in both themes — light `#CE5500` (C 0.171, **+37%** on
   today), dark `#FE6A00` (C 0.200, **+60%**).
3. **The dark theme's flatness is the card, not the ground.** Page 0.175
   with a card at 0.300–0.320 — a step of 0.125–0.150, the reference's
   0.14 — passes the whole `PAIRS` table with zero failures. It costs
   `text-1` a move from L 0.935 to 0.959–0.971. The ground never has to
   get lighter.
4. **Warm or cool is free.** The identical ladder at H 70 and at H 255
   produces identical pass/fail and identical ink lightnesses. So the
   hue of the dark ground is a taste decision, not a contrast one — the
   first time in this project that sentence has been true.
5. **The reading-page ink gap is not typography.** Both their page and
   ours set a baseline step near 1.55× the type size. Theirs is 21 rows
   of continuous prose filling 329 of 330 available pixels; ours is a
   stack of short blocks with 25–50px gaps. It is lesson shape — lever 1
   in `visual-longevity.md` §5, ranked highest, never touched.

And three things are **choices**, not findings. They are in §14 with
their consequences, and step 5 builds a direction around each.

---

## 1 · Re-reading our own work first

`01-diagnosis.md` §1 measured that the last four rounds cited no research
at all. So this one starts by reading it.

### 1.1 What `visual-longevity.md` already decided

- **§0.2, the hue arithmetic.** Holding the accent's solved lightness
  and chroma, the sRGB gamut plus the hues owned by `ok` and `no` leave
  **148 usable degrees**. Ten topics sit 15° apart and are
  indistinguishable; five tiers fit at a 35° minimum. `02-references.md`
  §12 measured the prediction coming true on a shipped screen: the
  Eğitim tab spans **H40–H70, ten hues inside 30°** [S].
- **§5, the ranked levers.** lesson shape → richness from the learner's
  record → a tier accent → motion → one drawn mark per topic →
  subtract. Rounds 2 through 5 worked items 4 and 5 and invented a
  per-topic accent §0 had ruled out.
- **§6, the refusals.** Streaks, XP, badges, mascots, confetti, skins,
  cosmetic unlocks. v0.62 shipped three of them.
- **The parking notice at the top**, which four rounds also ignored in
  the other direction: *almost every lever here is parked*, because the
  exam was days away and **the owner looked at the grouped index and
  felt nothing from the tier names**. That matters for §8 below: the
  tier accent is solved, and it was parked by his reaction, not by
  arithmetic.

### 1.2 What `beta1-palette.md` already decided, and what this file may not undo

The cool ground is an argument, not an accident: before it, *every*
non-semantic token sat in an 11° band around the amber, so the interface
was one hue and the accent was warm against nothing. A cool ground gives
the accent a second channel to differ on.

§4 below shows that the contrast cost of warm and cool is now identical,
which means this is the one place where a reference disagrees with our
own research on equal footing. It goes to §13 as a choice rather than
being decided here.

### 1.3 What `premium.md` is missing

190 lines, a fifth of the research average, for the question that has
consumed five releases. Its §1 is the source of the cream ground and is
sound. It contains nothing about *vividness*, *loudness*, *entrance*, or
what makes an interface read as a product rather than a document — which
is precisely what §§2–12 here are about. This file is the replacement.

---

## 2 · Q1 · The accent — and why the action stops being one

### 2.1 The dead band, measured

One token carries three jobs today: coloured text, a fill with a label on
it, and a decorative tint. The requirement that binds is the second one.
`requiredLc(18, 600)` is **60** — the top row of APCA's font matrix, so
no larger size relaxes it — and the palette also requires WCAG 4.5 for
the ink on the fill.

Searching every in-gamut maximum-chroma colour at H 36 / 45 / 60 against
four candidate inks (white, black, the cream page, the dark ink) [S]:

| L | H 36 max C | white on it | cream on it | dark ink on it | label? |
|---|---|---|---|---|---|
| 0.50 | 0.171 `#AF2F00` | W 6.50 / Lc 86 | W 5.78 / Lc 77 | W 2.62 / Lc 21 | **yes** |
| 0.56 | 0.191 `#CB3802` | W 5.11 / Lc 79 | W 4.54 / Lc 70 | W 3.33 / Lc 28 | **yes** |
| 0.62 | 0.212 `#E94101` | W 4.02 / Lc 71 | W 3.57 / Lc 63 | W 4.24 / Lc 36 | **no** |
| 0.68 | 0.211 `#FF5827` | W 3.15 / Lc 63 | W 2.79 / Lc 54 | W 5.42 / Lc 45 | **no** |
| 0.74 | 0.161 `#FF815F` | W 2.45 / Lc 53 | W 2.18 / Lc 44 | W 6.95 / Lc 54 | **no** |
| 0.80 | 0.116 `#FFA289` | W 1.95 / Lc 42 | W 1.73 / Lc 33 | W 8.75 / Lc 65 | yes |

Between **L 0.62 and L 0.74** nothing works. Light inks lose WCAG,
because a mid-light saturated orange is not far enough from white in
luminance; dark inks lose APCA, because APCA correctly reports that dark
text on a mid-light saturated ground is weak. The reference orange
(L 0.654 C 0.208 H 36) sits in the middle of that band, which is why
reference 6's own "Continue reading" button measures WCAG **3.49** — it
would fail our table, and it fails WCAG 2 AA for anything but large
text.

**This is not a reason to copy it and look away.** It is the reason the
action has to stop being a colour.

### 2.2 The move that dissolves it

The references do not solve this problem. Reference 6 writes white on an
orange that measures 3.49:1 and ships it. Reference 11 does something
better, and it is the thing to copy: **its one filled action is a
near-black pill**, and the orange is spent on the hero and two tags,
where nothing is written on it.

Take that move and the constraint disappears, because the two jobs stop
sharing a token:

| | what it is | requirement | carries text? |
|---|---|---|---|
| **the filled action** | a **plane** — near-black on light, near-white on dark | its label, and 3:1 vs the page | yes, easily |
| `accent-mark` | a rule, a bar, a tile ground, a highlight, a hero wash | 3:1 vs `surface-2` where it carries meaning | **never** |
| `accent-ink` | coloured text — a section label, a count, a heading | Lc 75 + WCAG 4.5 as text | it *is* text |

The action plane is the **same material as §3's counter-plane**. One
token, two jobs, no new colour — which is exactly the observation
`02-references.md` §12 made about reference 11 and could not yet cost.

### 2.3 The action as a plane, measured

[S], against the cream page `#F6F1E7` and the dark page `#0C1117`:

| | vs its page | vs `surface-2` | its label (the page colour as ink) |
|---|---|---|---|
| light pill L 0.20 `#1A150F` | 16.11:1 | 13.67:1 | **Lc 98**, W 16.11 |
| **light pill L 0.24 `#241E18`** | **14.64:1** | 12.42:1 | **Lc 97**, W 14.64 |
| light pill L 0.28 `#2D2821` | 12.98:1 | 11.01:1 | Lc 95, W 12.98 |
| dark pill L 0.90 `#E2DDD7` | 14.03:1 | 8.00:1 | Lc 86, W 14.03 |
| **dark pill L 0.93 `#ECE7E1`** | **15.41:1** | 8.79:1 | **Lc 92**, W 15.41 |
| dark pill L 0.96 `#F6F1EB` | 16.86:1 | 9.62:1 | Lc 97, W 16.86 |

Today's filled label measures Lc 76 on the light accent and Lc 72 on the
dark one [S]. The plane gives it **Lc 92–97** — the action becomes the
most legible thing on the screen, which is what an action should be, and
it does it with no new hue.

### 2.4 The mark, solved

With no text on it, the only requirement is 1.4.11's 3:1 where the mark
carries meaning. Maximising chroma at each hue, with margin (a 3.2:1
floor rather than 3.0 so a later surface change cannot break CI) [S]:

| H | light mark | dark mark (0.175 / 0.300 / 0.360 ladder) |
|---|---|---|
| 36 | L 0.604 C 0.207 `#E13F00` · 3.22:1 | L 0.666 C 0.224 `#FF4B0C` · 3.22:1 |
| 40 | L 0.600 C 0.188 `#D74B01` · 3.23:1 | L 0.680 C 0.213 `#FE5A01` · 3.43:1 |
| **45** | **L 0.598 C 0.171 `#CE5500` · 3.21:1** | **L 0.700 C 0.200 `#FE6A00` · 3.74:1** |
| 50 | L 0.594 C 0.157 `#C55C00` · 3.23:1 | L 0.720 C 0.190 `#FE7802` · 4.06:1 |
| 60 | L 0.590 C 0.138 `#B76601` · 3.22:1 | L 0.756 C 0.177 `#FF9002` · 4.75:1 |

Today ships C **0.125** in both themes. At H 45 the mark is **C 0.171
light (+37%)** and **C 0.200 dark (+60%)**, at **one hue in both
themes** — so the brand stays one colour and the vividness arrives
anyway. At H 36 it is +66% and +79%, and the light mark `#E13F00` is
within 0.05 L and 0.001 C of the reference orange.

### 2.5 If a coloured filled action is still wanted

It is no longer necessary, but it is solvable, and the values are here so
step 5 can try it rather than guess. Same margins (label W ≥ 4.7,
Lc ≥ 63; fill ≥ 3.2:1) [S]:

| | light | dark |
|---|---|---|
| H 36 | L 0.578 C 0.198 `#D53B00`, white, W 4.71 / Lc 77 | L 0.780 C 0.131 `#FF987C`, black, Lc 63 |
| H 45 | L 0.574 C 0.164 `#C35000`, white, W 4.70 / Lc 77 | L 0.780 C 0.137 `#FF996A`, black, Lc 63 |
| H 70 | L 0.564 C 0.132 (H 60), white | L 0.790 C 0.171 `#FFA401`, page, Lc 65 |

Note the asymmetry, because it is the reason the plane is the better
answer: the light theme gains up to **+58%** chroma by moving hue, and
the dark theme gains almost nothing below H 60 — its best is its current
H 70. A single-hue coloured action therefore costs one theme or the
other, while a single-hue *mark* costs neither.

### 2.6 Recommendation

1. **`accent-mark`, one hue at H 45**, both themes: light `#CE5500`,
   dark `#FE6A00`. This is where "canlı" comes from.
2. **The filled action becomes a plane**: light `#241E18`, dark
   `#ECE7E1`, label in the page colour. Same material as the
   counter-plane.
3. **`accent-ink` unchanged** — `--c-accent-text` already measures Lc 86
   on the page and Lc 76 on the darkest cream surface [S], and its job
   has not changed.
4. **`--grad-accent`, `--shadow-glow` and the per-button gradient are
   deleted.** With the mark carrying gradients on content objects and
   the action carrying none, nothing is left to justify them.

The cost is two new tokens per theme, three `PAIRS` rows, and one
sentence in `design-system.md` that says the accent is never written on.

## 3 · Q2 · The counter-plane in the light theme

`02-references.md` §5: every reference carries a large area that is not
its ground; our light theme carries 0.1–2.2% and nothing else.

**The near-black card on cream is not a compromise — it is a better text
ground than the page.** Measured [S]:

| card | vs the cream page | page colour as ink on it | a quiet second ink (L 0.80) |
|---|---|---|---|
| L 0.20 H 70 `#1A150F` | 16.11:1 | **Lc 98**, W 16.11 | Lc 66 |
| L 0.24 H 70 `#241E18` | 14.64:1 | Lc 97, W 14.64 | Lc 65 |
| L 0.28 H 70 `#2D2821` | 12.98:1 | Lc 95, W 12.98 | Lc 64 |
| L 0.32 H 70 `#38322B` | 11.24:1 | Lc 93, W 11.24 | Lc 62 |

Body prose needs Lc 75 at 18/400 and a 15/600 meta line needs Lc 75 [S,
`requiredLc`]. So:

- **The counter-plane carries one ink, not two.** The page colour on it
  reaches Lc 93–98, far above anything our cream page offers. A second,
  quieter ink at L 0.80 reaches only Lc 61–66 — short of 75. Any meta
  text on the counter-plane must be the *same* ink, differentiated by
  size or weight, never by a dimmer grey.
- **L 0.24 is the recommendation.** It is the darkest value that still
  leaves room for a `+0.04` hover/pressed state without touching the
  page, and its 14.6:1 is comfortably above 1.4.11's 3:1.

**Which object carries it** is a product question, and `app-plan.md`
already answers it: the screen the app opens on has one object that is
the day's work. That object becomes the counter-plane. At 25–30% of a
390 × 844 screen it is roughly 210–250px tall — a card, not a band.

This also answers something §12 of the references file raised: the
near-black pill that reference 11 uses as its one filled action is the
same material at a smaller size. One token, two uses, no new colour.

---

## 4 · Q3 · The dark ground — warm, lighter, or neither

### 4.1 What reference 8 actually does

Sampled from the screenshot [S]:

| | L | C | H |
|---|---|---|---|
| its ground | 0.299–0.376 | 0.003–0.016 | 49–87 |
| its glass card | 0.427–0.457 | 0.015–0.020 | 97–104 |
| its white stats card | 0.835 | 0.039 | 81 |
| **our `surface-0` / `-1` / `-2`** | **0.175 / 0.228 / 0.286** | 0.014 | 255 |

Its chroma is at or below ours. Its warmth is a hue shift at the same
tiny chroma, which costs nothing. What is genuinely different is the
**step from ground to card: 0.14, against our 0.053.**

### 4.2 Can we copy its ladder? No — and the reason is worth writing down

Re-solving the ink ramp against each candidate ground [S]:

| candidate | surfaces | result |
|---|---|---|
| A · its exact ladder, 0.30 / 0.37 / 0.44 | `#322D27 #443F39 #57514C` | **no solution** — `text-1` cannot reach Lc 90 + WCAG 7 against a ground that light, even at pure white |
| B · 0.28 / 0.335 / 0.39 | `#2D2823 #3B3630 #49443E` | solves; `text-1` L 0.972, **0.027 from white** |
| ceiling search | worst ground L **0.450** | `text-1` must be L 0.998 — the contract's absolute limit |

So reference 8's dark theme is not available to us at our own text
contract. Its body text sits at a contrast our `PAIRS` table would
reject, which is a fact about the reference, not about us: it is a
reading app for pleasure and we are a study app used the week before an
exam, and `ui-improve.md` measured what happens here when text gets
quiet.

### 4.3 What *is* available: move the card, not the ground

Keeping the page at 0.175 and widening the step [S]:

| ladder | card step | `text-1` | headroom to white | `PAIRS` failures |
|---|---|---|---|---|
| 0.175 / 0.228 / 0.286 (shipped) | 0.053 | L 0.935 | 0.064 | 0 |
| **0.175 / 0.300 / 0.360** | **0.125** | L 0.959 | 0.040 | **0** |
| 0.170 / 0.320 / 0.390 | 0.150 | L 0.971 | 0.028 | 0 |
| 0.170 / 0.340 / 0.430 | 0.170 | L 0.989 | 0.010 | 0 |

**Recommended: `0.175 / 0.300 / 0.360`.** It is reference 8's card step
(0.125 against its 0.14), it passes every pair, and it leaves 0.040 of
lightness between `text-1` and white — enough that a later change has
somewhere to go. The 0.150 and 0.170 ladders also pass but spend the
headroom, and a palette with no headroom is a palette that fails the next
time anything moves.

### 4.4 Warm or cool: measured to be free

The same ladder at H 70 and at H 255 gives *identical* results — same
zero failures, same solved ink lightnesses to three decimals [S]. Hue
does not enter the contrast maths at this chroma.

So this is the one design question in the file where our own research and
the reference disagree with nothing to separate them but taste, and it
goes to §14.2 as a choice. What can be said:

- `beta1-palette.md`'s argument for cool still stands: it gives the
  accent a second channel to differ on.
- Reference 8 has ground H 62–104 and accent H 80 — the *same* hue — and
  works, because its accent separates on lightness (0.755 against 0.30)
  and chroma instead.
- With `accent-mark` at C 0.17–0.21, we would have that lightness and
  chroma separation too, which weakens the original argument for cool
  without refuting it.

---

## 5 · Q4 · The serif, and a constraint nobody checked

`02-references.md` §8 found that reading apps differentiate by type
**class**, not size: a serif italic in the accent against a sans body.

**We do not ship a serif italic.** `fonts/` contains exactly three faces
[S]: `source-sans-3-400`, `source-sans-3-600`, `source-serif-4-400`. An
italic would be synthesised by the browser — a slanted upright, which on
a serif is visibly wrong — or it costs a fourth subset at roughly 19KB,
which is the size of the existing serif subset.

Three options, and the recommendation is the cheapest:

1. **Upright serif, accent-coloured, for the English sentence under
   test.** No new font file. The serif already loads and is already used
   for `.option`. Extending it to the taught sentence makes the type
   class mean *"this is the English being examined"*, which is a
   semantic distinction the app genuinely has and currently signals with
   nothing.
2. Serif italic for lesson titles — costs the fourth subset, and titles
   are the place where a distinction matters least.
3. Leave the serif where it is. Free, and gives up the one differentiator
   the reading references rely on.

**Recommended: 1.** It is free, it is a real semantic distinction, and it
lands on the screen where the learner spends their time. Whether the
accent colour comes with it is a `PAIRS` question: `accent-ink` at
18/400 needs Lc 75, which today's `--c-accent-text` clears at 86 on
cream [S].

---

## 6 · Q5 · Ink on the reading page — the type was never the problem

The first version of `02-references.md` claimed their leading was looser
than ours. Withdrawn: that measurement compared ink bands at two
different scales. Both pages set a baseline step near **1.55× the type
size** [≈] — theirs 26px on ~17px type, ours 28px on 18px.

Re-measured properly [S]:

| | rows | column fill | step pattern |
|---|---|---|---|
| reference 7c | 21 rows of continuous prose | **329 of 330px** | 26px, uniform |
| our lesson | 19 rows | lines end early | 28px inside a block, **25–50px between blocks** |

The ink gap is the **shape of the page**. Their reading view is one flow;
ours is a stack of short typed blocks with gaps between them, and a block
is often a sentence or two, so lines end early and the page is mostly
margin.

That is `visual-longevity.md` §5 lever **1**, ranked first, measured six
weeks ago — *all sixty lessons are the same shape; 21 block sequences
across 60 lessons; the two commonest cover 40%; every lesson opens
`text > contrast` and closes on `decision`* — and never touched.

**Recommendation: this is not a CSS change and step 6 should not try to
make it one.** It is a content question and it belongs to the lesson
schema. What the design language owes it is a *prose* container that can
hold continuous text at full column width, so that a lesson which wants
to be a page can be one. What it must not do is add margin to blocks to
make the stack look deliberate.

The separate question — can the *question's* paragraph be quieted so the
blank reads as the one live thing — is answered by §3's table: on a
counter-plane, a second quieter ink does not reach Lc 75 at 18/400. So a
question paragraph cannot be dimmed and stay conformant. If the blank is
to stand out more, the blank has to get louder, not the paragraph
quieter. `accent-mark` at C 0.174 is exactly that, and the blank's rule
carries no text.

---

## 7 · Q7 · The loudness range, and how to stop it flattening again

`02-references.md` §10 measured the largest gap in the set: the
references' entrance screens run **30–67% event area** and ours run
**~10%**, and their loud-to-quiet span within one product is **4× to 8×**
against our **1.5×**.

### 7.1 Where the 30% comes from, arithmetically

A 390 × 844 screen is 329,160px. The chrome takes roughly 180px of
height — a bar and a nav — leaving about 259,000px of body. Thirty per
cent of the whole screen is 98,700px, which at full column width
(358px) is **276px of height** [≈].

That is one object. Not a hero *plus* tiles *plus* a ring: the
counter-plane card of §3, about 276px tall, carrying the day's work.
`app-plan.md` already puts exactly one object there.

Cross-check against the references: reference 6a's near-black hero is
32% of the screen and is a single card; reference 11a's orange hero is
16% plus its two stacked cards. Both are one region, not a collection.

### 7.2 What the sweep should assert

The reason this matters more than it looks: **nothing currently stops a
later round flattening it again.** Five rounds produced screens between
5.1% and 15.3% event area without anyone noticing, because no check
looks at it. `tools/verify-ui.mjs` measures overflow, touch targets,
console errors and §7.3 geometry; `tools/palette.mjs` measures contrast.
Neither can see this.

`docs/design/measure-screens.py` can, and it already runs on PNGs the
sweep produces. Proposed assertions, to be added in step 6:

| screen | assertion |
|---|---|
| the entrance, both themes | `event ≥ 25%` and `counter-plane ≥ 25%` |
| the reading page, both themes | `event ≤ 12%` |
| any screen | at most **one** accent hue family |
| the entrance | saturated area **≥ 8%**; the reading page **1–3%** |

These are floors and ceilings on a measurement, not on a value, so they
constrain the *result* rather than the implementation — which is the
property that made the `PAIRS` table work and that every rule written in
the last four rounds lacked.

**Caveat, stated rather than buried:** the sweep runs Chromium
headless, and `measure-screens.py` needs Pillow, which is not a
dependency of this project and must not become one. So these assertions
belong to a manual audit step (`npm run audit` already exists and
already measures screens against §7), not to `npm run check` in CI. Step
6 decides which; this file only establishes that the numbers are
checkable.

## 8 · Q6 · Rendering the data we already hold

Every reference spends its visual interest on data. `visual-longevity.md`
§5 ranked this second. `storage.js` already holds, per learner:
every quiz's score and its per-category breakdown, lesson progress and
completion, the mistake book, the seen-version marks and the timestamps.

Nothing in the app draws any of it except a number.

This is not a colour question and this file cannot solve it, but it can
state the constraint the design language must satisfy: **a data drawing
is built from `js/dom.js` node builders and inline SVG, in one accent,
with no library** — and it must be legible when there is *no* data,
which is the state a new learner is in and the state every ornament in
v0.62 handled by inventing a number.

Handed to step 4 as a brief item, and to step 5 as the thing one of the
three directions should be built around.

---

## 9 · Q8 · The per-topic hue is finished

Measured on the shipped screen: the Eğitim tab spans **H40–H70** — ten
hashed topic hues inside 30° [S]. `visual-longevity.md` §0 predicted
exactly this from the gamut arithmetic six weeks before it shipped.

Three successors, and only one is free:

| | status |
|---|---|
| **a drawn mark per topic** | `visual-longevity.md` §5.5. No hue, no palette row, works in both themes, and `js/icons.js` already has the contract and the 20 existing icons to match. |
| a tier accent (5, 35° apart) | solved and re-verified here [S]: dark 7.14–8.00:1 against `surface-2`, light **3.00–3.59:1**. Feasible, but the light values are tight — H 195 lands on exactly 3.00 — and the owner already looked at the grouped index and felt nothing from the tier names. |
| nothing | the topic is identified by its name and its position, as it is on every reference index screen in the set. |

**Recommended: the drawn mark, and delete `hueOf()`.** It is the one
option that adds identity without adding a colour system, it is lever 5
rather than a new invention, and the tier accent's light margins leave
no room for the cream page to move.

---

## 10 · Q9 · `corner-shape` — verified, and it changes the recommendation

`02-references.md` §11 deliberately left this open rather than asserting
it. Checked:

- `corner-shape` is **Chromium-only** as of mid-2026, roughly **65% of
  users globally**, **not Baseline**, with no public timeline from
  Safari or Firefox.
- MDN marks it experimental and advises checking compatibility before
  production use.

Sources: [MDN, `corner-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape),
[Squircle.js, *Squircles in CSS* (2026)](https://squircle.js.org/blog/squircles-in-css),
[Smashing Magazine, *Beyond border-radius* (2026-03)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/).

**So the design is the `border-radius` version, and `corner-shape` is a
progressive enhancement for the two thirds who have it.** That is
a stronger constraint than it sounds: at r/w 0.17 a circular arc meets
the straight edge with a visible kink, so a control tile designed *for*
a superellipse looks wrong to the 35% who get the arc. Step 5 must
prototype the control radius as a plain arc and judge it there.

Recommended radius families, as ratios of the object's own width:

| family | r / w | on a 358px card | today |
|---|---|---|---|
| content — a card, a sheet, a prose container | 0.08 | 28px | `--r-3` 20px = 0.056 |
| control — a tile that *is* the interaction | 0.15 | 54px at 358, 26px at a 176px tile | none |
| pill, circle | unchanged | | |

---

## 11 · Q10 · The outline, and the divider that should replace it

`css/style.css` puts `inset 0 0 0 1px var(--line)` on **eight** component
classes [S], the card among them, in both themes. In eleven references,
almost nothing is a container with a line around it, and a line appears
only *between rows inside* one container.

The measurement that matters is what a divider may be. Solving for a
hairline that clears 3:1 on each light surface [S]: it has to be
**L ≤ 0.50** — `#66635C`, which on cream reads as a hard rule, not a
hairline. Today's light hairline is L 0.862, **1.35:1**.

The resolution is the one WCAG actually specifies rather than the one a
blanket rule would imply. SC 1.4.11 applies to graphical objects
*required to understand the content*. A divider that duplicates
information already carried by spacing and by the row's own structure is
not one, and none of the references treats it as one. So:

**Recommended:** the divider stays decorative and unmeasured, but moves
from 1.35:1 to roughly **2:1** so it is visible — around L 0.78 on the
light surfaces [≈, to be solved per surface in step 6] — and the card
outline is deleted. Separation becomes plane lightness plus the §4.3
shadow, which is the mechanism `design-system.md` already describes and
which the widened ladder finally makes work.

Two notes for step 6: `prefers-contrast: more` already redefines
`--line` at 0.2 alpha and must keep a visible boundary; and the
`forced-colors` block at the end of the stylesheet supplies its own 1px
borders, so deleting the token cannot delete those.

---

## 12 · Q11 · "The tile is the control"

Not a colour question, so this file only states what the design language
owes it.

The candidates are the answer option, the topic entry and the day's
session — each currently a card containing a row containing a control.
Absorbing the frame means the whole object becomes the target, which is
free for the 44px floor (it gets bigger, not smaller) and not free for
three other things:

1. **The focus ring** currently sits on an inner control; it has to move
   to the object and follow the larger radius.
2. **The accessible name** becomes the whole object's content, so it has
   to be composed deliberately rather than inherited from a label.
3. **`docs/components.html`** gains a component and the sweep enforces
   it, which is the mechanism that keeps this from being a one-screen
   experiment.

`design-system.md` already forbids a frame inside a frame. This is not a
new rule; it is the existing rule, applied.

---

## 13 · Q12 · Texture

The cheapest item in the file and the only one with no dependency at all.
Reference 10 carries a dot grid on its display ground, a halftone inside
its one action and dot-matrix numerals; reference 6c carries a
highlighter mark behind a glossary word.

A CSS `repeating-linear-gradient` or a `radial-gradient` dot field costs
nothing, no request and no build step. The constraint is that it must
never approach the text-contrast floor: a texture behind text changes the
ground `PAIRS` measures against.

**Recommended:** one texture token, defined as a pattern over a solid
ground whose *darkest* point is still the measured surface — so the
pattern lightens rather than darkens, and every existing `PAIRS` row
stays valid by construction. That single rule makes texture safe without
adding a single measurement.

---

## 14 · The three choices

These are not findings and I am not making them. Each is a real fork with
a measured consequence on both sides; step 5 builds a direction around
each so the choice is made by looking rather than by reading.

### 14.1 How vivid the mark is

§2.4 recommends H 45, which is one hue in both themes and lands at
C 0.171 light / C 0.200 dark — **+37% and +60%** on today. H 36 is the
reference's own hue and reaches C 0.207 / C 0.224 — **+66% and +79%**,
with the light mark `#E13F00` within 0.05 L of the reference orange.

| | light mark | dark mark | against today |
|---|---|---|---|
| **H 45** | C 0.171 `#CE5500` | C 0.200 `#FE6A00` | +37% / +60% |
| H 36 | C 0.207 `#E13F00` | C 0.224 `#FF4B0C` | +66% / +79% |

Both pass. H 36 is a red-orange and reads as an alert hue in a study
app; H 45 is an amber-orange and keeps a family resemblance to the
`--c-accent-text` we already ship. I recommend 45. He has asked for
vivid five times, so the ceiling is on the table.

### 14.2 Warm dark ground, or keep the cool slate

Measured to cost nothing either way. Warm is what reference 8 does and
what he called *"bize oldukça uygun"*; cool is what `beta1-palette.md`
argued for and the argument still stands. With `accent-mark` present, the
accent no longer needs the ground's hue to separate from it.

### 14.3 What carries the entrance's 30%

The counter-plane card of §3 is the mechanism. What goes *on* it is a
product decision: the day's session, the next question, or the learner's
week drawn as data (§7). The first is `app-plan.md`'s answer, the third
is `visual-longevity.md`'s ranked second lever, and they are not
exclusive.

---

## 15 · What could not be verified

Listed because `beta1-palette.md` listed its own, and because the last
four rounds' failure mode was confidence.

1. **The superellipse exponent of the reference tiles.** Reference 10 is
   photographed at an angle; a perspective-distorted corner cannot be
   fitted honestly. The r/w ratio was measured; the exponent is [≈].
2. **Whether the control radius family survives as a circular arc.**
   §10 says it must be prototyped, not assumed. Nothing in this file
   settles it.
3. **`corner-shape` share for *this* app's audience.** The 65% is a
   global figure. Turkish students on Android and iPhone are not the
   global browser mix and this app has no analytics, by design, so the
   real number is unknowable here.
4. **Whether a 37–79% chroma rise reads as "canlı" or as "loud".**
   Chroma is measurable; the reaction is not. That is what step 5 is
   for, and it is the only question in this file that a measurement
   cannot settle even in principle.
5. **The reference type sizes.** Read off screenshots at an unknown
   scale, so every type figure in `02-references.md` §8 and in §6 above
   is [≈]. The *ratios* are sound; the absolute pixel values are not.
   This is also why §6 withdrew the leading claim rather than adjusting
   it.
6. **Reference 8's true colours.** Its mockup carries a warm overlay
   across the whole image, so its sampled gold (L 0.755 C 0.063) is
   certainly less chromatic than the real token. The ladder measurements
   in §4.1 are relative and survive this; the accent sample does not, and
   is not used for anything.
7. **Whether the divider at 2:1 is enough at 320px on a real phone in
   daylight.** `verify` measures geometry and contrast, not perception.
   It needs the owner's phone, which is the same instrument that decided
   the cream ground.
8. **Whether the near-white action pill works on the dark theme.** Its
   numbers are excellent (Lc 92, 15.4:1) but a large near-white plane on
   a dark screen at night is the exact complaint that produced the cream
   ground in the first place — *"aşırı göz yoruyor"*
   (`beta1-palette.md`). Step 5 must show it at L 0.93 and at a dimmer
   alternative, on his phone, before step 6 writes it down.
9. **The 276px entrance object.** §7.1's arithmetic assumes a 390 × 844
   screen and ~180px of chrome. At 320 × 568 — the floor this app
   supports — 30% of the screen is a bigger share of a smaller body, and
   whether one object can be that tall there without pushing the day's
   action below the fold is a layout question step 5 has to answer by
   building it.

---

## 16 · Handover to step 4

The brief should state, as measurable properties:

- the entrance's event area ≥ 25% and the reading page's ≤ 12% (§7);
- the counter-plane ≥ 25% on the entrance, carrying **one** ink (§3);
- the filled action as a **plane**, `#241E18` light / `#ECE7E1` dark,
  label in the page colour (§2.3);
- `accent-mark` at H 45 — `#CE5500` light, `#FE6A00` dark — never
  written on (§2.4);
- `accent-ink` unchanged, and `--grad-accent` / `--shadow-glow` deleted
  (§2.6);
- the dark ladder at 0.175 / 0.300 / 0.360 (§4.3);
- the upright serif for the English sentence under test (§5);
- two radius families, 0.08 and 0.15 of the object's width, designed as
  circular arcs (§10);
- the card outline deleted, a divider between rows instead (§11);
- one texture token that lightens rather than darkens (§13);
- and the refusals carried forward: `visual-longevity.md` §6, plus
  Liquid Glass from `02-references.md` §14, plus the per-topic hue
  (§9).

And it should record the three choices of §14 as open, so that step 5
presents them rather than resolving them quietly — which is the specific
failure `01-diagnosis.md` §4.4 identified in every round since the
two-palette mockups.
