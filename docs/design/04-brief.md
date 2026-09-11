# The brief

2026-09-11. Step 4. This is the contract step 5 builds against and step 6
writes down. It is deliberately the shortest file in this folder:
`02-references.md` and `03-research.md` did the work, and a brief that
repeats them is a brief nobody checks anything against.

Three parts: **what the app must feel like, stated as numbers** (§2),
**what it may never be** (§3), and **the three things still open** (§4).

---

## 1 · Who this is for, and what "feel" has to mean

`CLAUDE.md` fixes the learner and it decides this file too: someone with
a **real English base and no academic foundation**. Their ear is good,
their instinct is often right, and they have never met the labels. They
are not a beginner, and copy or ornament that congratulates progress
from nothing is aimed at somebody else.

Two consequences for the design language, and they pull against each
other, which is the whole difficulty:

- **It has to read as serious.** This app is used in the weeks before an
  exam that decides a year. Anything that looks like a game costs it
  credibility with exactly the learner it is for.
- **It has to read as alive.** Five rounds were rejected as *flat*, *AI
  slop*, *lifeless*. `02-references.md` §10 found the mechanism:
  reference products modulate — their entrance is four to eight times
  louder than their reading page — and ours is the same loudness
  everywhere.

So the brief is not "add life." It is **put the life in one place and
take it out of the others.** The entrance is loud. The page where a
learner reads is quieter than anything we ship today. Both are numbers
below.

---

## 2 · The measurable properties

Every row is a number, a source, and a place to check it. A direction in
step 5 that misses a row is not a matter of taste — it is out of spec.

### 2.1 Composition

| # | property | value | source |
|---|---|---|---|
| C1 | **event area, the screen the app opens on** | ≥ 25% | refs median 17.5%, their entrances 30–67%; ours 10% [`02` §10] |
| C2 | **event area, a reading or answering screen** | ≤ 12% | refs' quiet screens 5.5–21.7%; ours 5.1–8.1 [`02` §10] |
| C3 | **loud ÷ quiet, across the product** | ≥ 3× | theirs 4–8×, ours 1.5× [`02` §10] |
| C4 | **one large area that is not the ground, on the entrance** | ≥ 25% of the screen | every reference has one; our light theme has 0.1–2.2% [`02` §5] |
| C5 | **that area is one object, not a collection** | 1 | refs 6a, 8a, 10, 11a each ≈ 276px tall at 390 [`03` §7.1] |
| C6 | **accent hue families on any screen** | exactly 1 | 15 of 19 reference screens [`02` §12] |
| C7 | **saturated area, entrance** | 8–20% | refs 5.0–15.7% [`02` §12] |
| C8 | **saturated area, reading screen** | 1–3% | refs 1.0–1.3%; ours **0.1%** [`02` §12] |

### 2.2 Material

| # | property | value | source |
|---|---|---|---|
| M1 | **the one filled action is a plane, not a colour** | `#241E18` light · `#ECE7E1` dark, label in the page colour | Lc 97 / Lc 92 [`03` §2.3] |
| M2 | **that plane is the same material as C4** | one token, two jobs | reference 11 [`03` §2.2] |
| M3 | **`accent-mark` — never written on** | `#CE5500` light · `#FE6A00` dark (H 45) | +37% / +60% chroma [`03` §2.4] |
| M4 | **`accent-ink` — coloured text** | unchanged | Lc 86 on the page [`03` §2.6] |
| M5 | **dark surface ladder** | 0.175 / 0.300 / 0.360 | card step 0.125, zero `PAIRS` failures [`03` §4.3] |
| M6 | **gradient is a light source inside an object** | lit from one corner, on content | refs 10, 11, 8 [`02` §12] |
| M7 | **texture lightens, never darkens** | one token | keeps every `PAIRS` row valid by construction [`03` §13] |
| M8 | **no container outline** | deleted from all eight classes | refs use a divider between rows instead [`02` §11] |
| M9 | **a divider is decorative, and visible** | ≈ 2:1, not today's 1.35:1 | [`03` §11] |

### 2.3 Form

| # | property | value | source |
|---|---|---|---|
| F1 | **content radius** | r / w ≈ 0.08 | refs 0.055–0.10; ours 0.056 [`02` §11] |
| F2 | **control radius** | r / w ≈ 0.15 | ref 10 at 0.15–0.17 [`02` §11] |
| F3 | **corners are designed as circular arcs** | `corner-shape` is enhancement only | Chromium-only, ~65%, not Baseline [`03` §10] |
| F4 | **four silhouettes, no fifth** | rounded rect · squircle · pill · circle | all eleven references [`02` §11] |
| F5 | **the object is the control** | no card → row → control | `design-system.md` already forbids it [`02` §12] |

### 2.4 Type and reading

| # | property | value | source |
|---|---|---|---|
| T1 | **type differentiates by class, not only size** | upright serif for the English sentence under test | refs use serif for the work being read [`03` §5] |
| T2 | **no new font file** | the three we ship | no serif italic exists in `fonts/` [`03` §5] |
| T3 | **15px floor stays** | unchanged | `ui-improve.md` measured the failure [`02` §13] |
| T4 | **a lesson may be continuous prose at full column width** | the container must exist | ref 7c: 21 rows, 329 of 330px [`03` §6] |
| T5 | **a reading field is never dimmed to make something else stand out** | the blank gets louder instead | a second ink on a counter-plane reaches Lc 61–66, short of 75 [`03` §3] |

### 2.5 Data

| # | property | value | source |
|---|---|---|---|
| D1 | **visual interest is a rendering of data, not ornament** | at least one drawing built from `storage.js` | every reference; `visual-longevity.md` §5 lever 2 [`03` §8] |
| D2 | **it must be legible with no data** | the first-run state is designed, not invented | v0.62 handled it by inventing numbers [`03` §8] |
| D3 | **topic identity is a drawn mark, not a hue** | `visual-longevity.md` §5.5 | ten hashed hues measured collapsing into 30° [`03` §9] |

### 2.6 The contract that does not move

| # | property | source |
|---|---|---|
| X1 | no build step, no runtime dependency, no `innerHTML` | `CLAUDE.md` |
| X2 | every colour solved and checked in both themes by `npm run color` | `CLAUDE.md`, `tools/palette.mjs` |
| X3 | 320px first; only `.app-content` scrolls; answering never moves the next button | `CLAUDE.md` |
| X4 | the split layout at ≥ 1080 × 600 stays additive; the reader and the quiz have no pane | `design-system.md` §7.3 |
| X5 | two content tabs plus Profil in the header; lesson checks never gate progress | `CLAUDE.md`, settled by his own feedback |
| X6 | version `x` stays `0` | `CLAUDE.md` |

---

## 3 · The refusals

Carried forward, with the reason each was refused. A reference set is
taste input; it is not a licence to reopen a decision that was made on
evidence.

**From `visual-longevity.md` §6** — streaks, XP, badges, mascots,
confetti, skins, cosmetic unlocks. v0.62 shipped a streak flame, confetti
and a hashed hue against this list, six weeks after it was written. Note
that reference 6 and reference 8 both show a streak: that changes
nothing.

**From `02-references.md` §13** — telemetry density, product renders,
type at 10–11px, a full-bleed gradient behind body text, the bento grid.

**From `02-references.md` §14** — Liquid Glass as a system. A
hand-rolled imitation of a platform material is the exact move that
produced the last two rejections. If an Apple port is ever built, the
question reopens then.

**New here, and the most important one:**

> **No screen is signed off by a green check.** `01-diagnosis.md` §4.5
> identified the mechanism that produced something technically correct
> and lifeless: a taste problem converted into an engineering problem,
> with 3,462 passing checks reported as success. The checks are
> necessary and they are not sufficient, and step 5 is judged by him
> looking at it.

**And one deletion list**, so step 6 is not asked to carry the old
language forward by accident: `--grad-accent`, `--shadow-glow`, `--orb`,
`--wash-1/2`, `hueOf()`, `celebrate.js`, the streak flame, the per-topic
hue, the card outline.

---

## 4 · The three things still open

Step 5 presents these; it does not resolve them. That is the mechanism
from the one round that worked — *"Adım 0: iki paletle mockup'lar"* —
and its absence is the single clearest difference between that round and
the four that failed [`01` §2].

| | choice | measured either way |
|---|---|---|
| **A** | how vivid the mark is: **H 45** (+37% / +60%) or **H 36** (+66% / +79%) | both pass; H 36 is the reference's own hue and reads redder [`03` §14.1] |
| **B** | the dark ground: **warm** (ref 8, *"bize oldukça uygun"*) or the **cool slate** (`beta1-palette.md`'s argument) | identical contrast results; pure taste [`03` §14.2] |
| **C** | what carries the entrance's 25%: the **day's session**, the **next question**, or the **learner's week as data** | `app-plan.md` says the first; `visual-longevity.md` ranks the third second [`03` §14.3] |

---

## 5 · What a direction has to be, to be judged

Three directions. Each is **the same two screens** so they can be
compared rather than admired, and each takes a different answer to
choice **C**, because C is the one that changes the shape of the product
rather than its colour.

**The two screens, per direction, in both themes — twelve screens
total:**

1. **The entrance.** Where C1, C4, C5, C7 live. This is the screen every
   rejection has been about.
2. **The answering screen with a wrong answer shown.** The app's most
   frequent screen, the one carrying C2, C8, T5, M1 and F5 at once, and
   the place where "serious" and "alive" have to hold together.

**Each direction must arrive with:**

- its own measured row from `docs/design/measure-screens.py` — event,
  counter-plane, saturated area, hue families — printed beside it, so
  the spec above is checked rather than asserted;
- every colour from the solved values in §2.2, no improvised hex;
- a one-line statement of what it is betting on, and what it gives up.

**Directions are static HTML at 390 × 844 and at 320 × 568**, using the
real fonts and the real tokens, exactly as `docs/proto-ui4.html` did —
that part of the last round was right, and what was wrong was that there
was only one of them.

**They are not implemented in the app.** Step 6 does that, for the one
he picks, and step 7 ships it.

---

## 6 · How this gets judged

By him, looking. The measurements above exist so that a direction cannot
be *quietly* out of spec, and so that the next round cannot flatten
something without anyone noticing. They cannot tell anyone whether a
screen is beautiful, and this file does not pretend otherwise.

What is being asked for at the end of step 5 is not approval. It is a
**ranking** — first, second, third — and one sentence about the axis the
ranking is on. That sentence is worth more than the rest of this folder,
because it is the only thing in the whole project that has never been
collected.
