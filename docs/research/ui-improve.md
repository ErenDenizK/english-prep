# Reading fast, in two lights

*Why hierarchy gets skimmed, what small type actually costs, and how many
modes this app should have.*

Written 2026-09-08 against `docs/design-system.md`, `css/style.css` and the
app as `test` serves it. The owner reported three things, and they are the
whole brief:

> "bence tasarım mükemmel sadece bazen hiyerarşi ya da küçük puntoları
> hızlı bir refleksle atlayabiliyorum dikkatli okumadığım zaman"

— plus a want for a bright/light mode, and a want for a second, more
readable mode distinct from it.

**Method, and where it is weak.** Everything called *measured* was
measured in this repository: `tools/color.mjs` run over the current tokens
and over candidate light ones, Playwright driving the real app at 320px
and counting every rendered text node, `npm run verify` run end to end.
The psychology and the standards reading come from the literature, and
this environment's egress proxy blocks the publishers and the APCA
documentation site, so most of it arrives through search-index summaries.
Marks: **[S]** search summary, not read at source · **[?]** unverified or
contested · **[≈]** my own reasoning from measured facts. A reference of
the form **DS §1.3** is to `docs/design-system.md`; a bare § is to this
document. One primary
source *was* fetched and it is the load-bearing one: APCA's font lookup
matrix from `raw.githubusercontent.com/Myndex/apca-w3`
(`fontMatrixAscend`, public beta 0.1.7 G, 28 May 2022).

---

## 0 · The short version

**1 · The skim complaint is not subjective, and it is not really about
hierarchy. It is about size.** At 320px, across the five main screens,
**54% of the rendered characters and 56% of the text elements are set at
13px or smaller** — 75% of the characters on the Eğitim index, 93% on
Profil. That tier is `--c-text-3`, measured Lc 63 against the page. APCA's
own font table asks for **Lc 113** at 13px/400, and the ceiling on this
ground — pure white, which DS §1.3 forbids anyway — is **Lc 107**. The
app's largest single body of text sits ~50 Lc below a requirement *no colour in
this palette can reach*. It is not a contrast bug a brighter grey fixes.

**2 · The light mode is worth building, and its best argument is one
nobody makes for light modes.** Solve the same three text tiers against a
warm off-white and they land at L 0.216 / 0.418 / 0.544 — a span of
**0.328** against **0.156** for the dark palette at identical APCA tiers.
Light mode returns **2.1× the tonal range for hierarchy**, the exact axis
DS §1.3 admits the dark palette had to spend. The polarity literature is on
its side too. What it breaks is the amber: measured, an amber fill cannot
be both readable with the app's dark ink and 3:1 distinct from an
off-white page. Arithmetic, not taste; §3.4 has the way out.

**3 · The third mode should not be a third theme.** Ranked by evidence,
"more readable" means bigger, heavier, more line spacing — in that order,
and those are the fixes finding 1 already demands in the base. Ship them
and the residue is a type-scale multiplier, which is *orthogonal* to
light/dark rather than exclusive with it. Two dimensions, not three modes.

**Order of work.** The type fix first, in the base, in the dark theme
that already ships: smallest change, answers the actual complaint, and a
prerequisite for the other two being worth having. Then the light theme,
then a "büyük yazı" switch, then the APCA font table in `npm run color` so
a 13px/400 token can never ship again.

Refusals are listed in §5.4 and §6; the short form is that nothing here
is solved by a new colour, a new typeface or a new theme.

---

## 1 · Why hierarchy gets skimmed (A)

### 1.1 The reading the owner is describing has a name

He is not reading badly. He is **satisficing** — reading until the rate of
information gain drops below a threshold, then jumping — which is the
documented behaviour rather than an aberration
([Duggan & Payne, CHI 2011](https://dl.acm.org/doi/10.1145/1978942.1979114)) [S].
It sits inside information-foraging theory: the reader follows
**information scent**, the trigger words in headings, links and the first
words of a line, and pays for the rest only when the scent is strong
enough [S]. Nielsen's eyetracking put the read fraction of an average page
under 20%, and the 1997 figure of ~79% scanning versus 16% reading
word-by-word is old enough to treat as directional [S] [?].

The important part for this app: **the same person alternates**. He reads
a lesson carefully and scans the index reflexively, and the interface has
to survive both. A design tuned only for careful reading fails the scan;
one tuned only for the scan is a poster.

### 1.2 What the eye actually does, and what it does not

The F-pattern is the famous finding and the most misused one: NN/g's own
2017 revisit says scanning is *not* always F-shaped [S]. Two of the other
patterns matter here:

- **Layer-cake**: fixations land on headings and subheadings and skip the
  paragraphs between — what a *well-structured* page produces, and the
  efficient pattern [S].
- **Spotted**: the eye jumps between things that stand out — headings,
  **bold words**, links, numbers — which is what a page produces when
  nothing gives it a structure to walk [S].

The design consequence is exact: a scanning reader looks for **anchors**
and uses whichever exist. If the only things that stand out are the amber
button and one 15px bold title per row, that is what gets fixated and the
rest is furniture. The magnitude: rewriting a site to be scannable
measured **47% higher usability**, concise **58%**, both plus an objective
tone **124%**
([Morkes & Nielsen, 1997](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/))
[S] — one old study with generous methodology [?], but nothing since has
argued the sign is wrong.

### 1.3 Which signal survives a fast skim

The brief asked for a ranking, so here is one, with the caveat that the
literature does not rank typographic devices head to head; it ranks
*visual features*, and the mapping to type is mine [≈].

| Signal | Survives a skim? | Why |
| --- | --- | --- |
| **Size** | Yes, strongest | Size is a preattentive feature — detected in parallel across the visual field, before attention lands [S]. A size step is visible in peripheral vision, which is where a skimming eye decides its next saccade. |
| **Weight** | Yes | Bold is preattentive too [S], and it survives where size cannot change (a row's title beside its hint). Weight is also the only hierarchy channel that does not cost vertical space — which on a 320×568 phone is the binding constraint. |
| **Position / alignment** | Yes | The left keyline is what the F's stem *is*. Ragged left edges from variable-width leading content is the single most common cause of an unscannable list — DS §7.1 already says so. |
| **Colour / lightness** | Partly | Hue is preattentive [S], but a *lightness tier* between two greys is a fine discrimination, not a pop-out — and on this palette the three text tiers are 0.156 apart in L by necessity. Between text-2 and text-3, the difference is invisible at a glance and only readable in comparison. |
| **Spacing** | **No, not for capture — yes, for structure** | Proximity groups things *after* the eye lands. Whitespace does not attract a saccade; it tells you what belongs together once you are looking. The search literature treats spacing as a grouping cue rather than a parallel-search feature [S]. |

So the honest answer to "does spacing beat size?" is **no, and they are not
competing**: size and weight decide *where the eye goes*, spacing decides
*what it finds there*. A screen fixed with whitespace alone reads calmer
and skims exactly as badly.

### 1.4 What this app actually looks like to a skimming eye

Measured, at 320px, across `#egitim`, `#egitim/konu/tenses`, a lesson
reader, `#test` and `#profil` — every element with a visible text node:

| Size / weight | Elements | Characters | Share |
| --- | --- | --- | --- |
| 28px | 1 | 36 | 0.4% |
| 22px/600 | 7 | 43 | 0.4% |
| 19px/400 | 20 | 662 | 6.6% |
| 17px/400 (serif) | 12 | 97 | 1.0% |
| 16px | 37 | 2,849 | 28.4% |
| 15px | 50 | 969 | 9.7% |
| **13px/400** | **106** | **4,768** | **47.6%** |
| **11px** | **57** | **599** | **6.0%** |

**Two-thirds of this interface by character count is set below 16px, and
almost half of it is one 13px tier in the dimmest of the three greys.**
The top of the scale — the part that would give a skimming eye an anchor —
carries 0.8% of the characters. Per screen:

| Screen | ≤13px | ≥19px | distinct sizes | first screenful ≤13px |
| --- | --- | --- | --- | --- |
| Eğitim indeksi | **75%** | 2% | 6 | 47% |
| Konu ekranı | 23% | 4% | 6 | 14% |
| Ders okuyucu | 33% | 20% | 7 | 9% |
| Test sekmesi | 32% | 3% | 6 | 14% |
| Profil | **93%** | 1% | 6 | 89% |

The index — the screen he opens most and scans hardest — is
three-quarters small type; Profil is nearly all of it. And every screen
uses six or seven of the seven steps, which is the other half of the
problem: **a scale entirely used on every screen has no emphasis in it.**
Seven steps were specified so each *screen* could pick three or four; the
build picks six.

### 1.5 The Row is where the hierarchy is lost

The Row is the app's most-used object and it encodes the defect in
miniature: `.row__title` at 15px/600 in `--c-text-1`, `.row__sub` at
13px/400 in `--c-text-3`. The size ratio is **1.15** — below any
typographic step worth the name, and below the scale's own ~1.2, which is
applied everywhere except here. The lightness difference, Lc 94 against
Lc 63, is real but is read *between two lines 2px apart*: comparison, not
capture. And the content that distinguishes lesson 3 from lesson 4 lives
in the 13px line.

So a fast reader gets a column of near-identical 15px bold titles with a
grey blur under each, and the thing that would let him choose is in the
blur. That is "hiyerarşiyi atlıyorum", and it is a layout fact rather than
an attention failure.

### 1.6 The design system already contains the fix

DS §1.3 says it outright — *"hierarchy is carried by size and weight first,
lightness second. If two tiers of grey are doing the work, the type is
wrong"* — and DS §11.4 parks the same question. The palette kept its half of
the bargain; the Row did not.

---

## 2 · Small type (B)

### 2.1 Is "never below 16px on mobile" folklore?

As a universal rule: **mostly folklore** [≈]. As applied to this app's
body text: well supported.

- **WCAG sets no minimum size.** 1.4.4 requires survival of 200% resize,
  1.4.12 that four spacing overrides be survivable [S]. The quoted
  "18pt / 14pt bold" is WCAG's definition of *large text* for the contrast
  thresholds, not a floor, and reading it as one is a common error [S].
- **Apple** puts body at 17pt with 11pt as an absolute floor for
  incidental text; **Material 3** names 14sp minimum, 16sp preferred [S].
  Both are below the folklore, and both assume a live OS text-size
  setting — the part web apps skip.
- **The one hard 16px fact is iOS Safari's focus zoom** on controls under
  16px (DS §9.1): a layout-integrity argument, not a legibility one.

So the defensible statement is not "16px or bust". It is: **there is no
standards floor, the platforms' floors are lower than the folklore, and
the actual constraint on size is contrast-dependent** — which is where
APCA earns its place in this project.

### 2.2 What APCA says that WCAG 2 does not

WCAG 2 has one threshold pair (4.5:1, or 3:1 for large text) and treats a
13px grey and a 24px grey identically. APCA's model is different in kind:
contrast and size and weight are one requirement, expressed as a lookup —
for a measured Lc, the table returns the minimum font size at each of nine
weights. Extracted from `fontMatrixAscend`, the rows this app lives in:

| Lc | w400 | w500 | w600 | w700 |
| --- | --- | --- | --- | --- |
| 60 | 24px | 21 | 18 | 16 |
| 75 | 18px | 16 | 15 | 14 |
| 90 | 16px | 15.5 | 14.5 | 14 |
| 100 | 15px | 14.5 | 13.5 | 13 |
| 110 | 14px | 13 | 12 | 11 |

Read it the other way — the direction that matters — and each size/weight
pair implies a **required Lc**. Interpolating the matrix and measuring
every token against the ground it actually sits on:

| Where | size / weight | token | measured Lc | required Lc | verdict |
| --- | --- | --- | --- | --- | --- |
| `.t-display` | 28/600 | text-1 | 94 | 45 | ok |
| `.t-title` | 22/600 | text-1 | 94 | 53 | ok |
| `.t-lead` | 19/400 | text-1 | 94 | 72 | ok |
| `.option` (serif) | 17/400 | text-1 | 94 | 82 | ok |
| `.t-body` prose | 16/400 | text-1 | 94 | 90 | ok, by 4 |
| `.btn--primary` | 16/700 | on-accent on amber | 67 | 60 | ok |
| `.row__title` | 15/600 | text-1 | 94 | 75 | ok |
| `.btn--quiet` | 15/600 | text-2 | 79 | 75 | ok, by 4 |
| `.listbox__option` | 15/400 | text-1 on surface-2 | 91 | 100 | **short 9** |
| `.feedback__body` | 13/400 | text-2 | 79 | 113 | **short 34** |
| `.t-meta`, `.row__sub`, `.stat__label`, `.option__key` | 13/400 | text-3 | 63 | 113 | **short 50** |
| `.chip` | 11/600 | text-2 | 77 | 117 | **short 40** |
| `.t-label`, nav label | 11/600 | text-3 | 63 | 117 | **short 54** |

Everything at 16px and above passes comfortably; everything at 13px and
11px misses by 34–54 Lc. And the shortfalls cannot be closed:

| Target | needs Lc | dark ceiling 107 | light ceiling 103 |
| --- | --- | --- | --- |
| 13px / 400 | 113 | unreachable | unreachable |
| 14px / 400 | 110 | unreachable | unreachable |
| 11px / 600 | 117 | unreachable | unreachable |
| 11px / 700 | 110 | unreachable | unreachable |
| 15px / 400 | 100 | reachable (white only) | reachable |
| **15px / 600** | **75** | **reachable — text-2 is 79** | reachable |
| 16px / 400 | 90 | reachable — text-1 is 94 | reachable |
| 14px / 600 | 95 | marginal — text-1 is 94 | reachable |

`prefers-contrast: more` does not save it either: it lifts text-3 to
text-2's value, Lc 79 — still 34 short at 13px.

**So the 13px and 11px tiers are unfixable by colour, in either theme, at
any token this palette can produce. The only lever left is size and
weight, and 15px/600 is the cheapest pair that clears** — Lc 75 required,
Lc 79 available, both weights already in the payload.

Two caveats, because they are what could overturn this. **APCA is not a
standard** — DS §1.1 says so, its font table is a public beta, it was pulled
from the WCAG 3 draft in 2023, and its small-size rows are deliberately
conservative [S]. Nothing above is a conformance failure; every token
passes WCAG 2.2 AA. But this project chose APCA as its *design* bar
precisely because WCAG 2 overestimates dark-ground contrast by 200–250%,
and a design bar suspended where it is inconvenient is not a bar. Second,
the table's values are for sans-serif references and serif faces should
use the row above, i.e. stricter [S] — which touches `.option` at 17px
serif, and it still passes.

### 2.3 Why small and dim is worse than the sum of small and dim

The psychophysics is unambiguous and old. Reading speed is flat above a
**critical print size** and falls below it, and where it falls depends on
contrast: performance is described by *acuity reserve* and *contrast
reserve*, and shrinking either eats the other's margin [S]
([Legge and colleagues](https://legge.psych.umn.edu/sites/legge.psych.umn.edu/files/2020-08/psychophysics_of_reading._vi._the_role_of_contrast_in_low_vision_rubin_legge_1989.pdf)).
That is the mechanism APCA's table approximates, and why "make it a bit
brighter" cannot rescue 13px: near the critical size the contrast
requirement rises steeply and this ground has no headroom. Add the
audience — this app is read in a second language under exam pressure, and
L2 reading leans harder on visual decoding [?] [≈] — and its tolerance for
marginal type is *lower* than a Turkish-only app's.

### 2.4 What the shell can already take

Measured at 320×640 with the WCAG 1.4.12 override applied (line-height
1.5, letter 0.12em, word 0.16em, paragraph 2em): no horizontal overflow on
any of the five screens, content simply gets taller — +25% (Test) to +69%
(reader). The DS §10 text-spacing test is a pass today, and `npm run verify`
runs **1,550 checks in 2m24s**, green. The shell is not fragile about type
getting bigger; it was built to grow downward, the only direction that
costs nothing.

---

## 3 · The light mode, done properly (C)

### 3.1 The polarity evidence, and what it does and does not license

The **positive polarity advantage** — dark-on-light outperforming
light-on-dark — is one of the more robust findings in display research.
Buchner & Baumgartner (2007) found it irrespective of ambient illumination
and colour contrast; Piepenbrock et al. found it for younger *and* older
adults, weaker in the older group; Buchner, Mayr & Brandt (2009)
attributed it to luminance — a bright field constricts the pupil, and a
smaller pupil sharpens the retinal image — and later work measured both
the smaller pupils and the better proofreading [S]. DS §11.5 already records
NN/g's summary, including that participants performed worse in dark mode
while reporting no difference.

That licenses one thing: **light mode is the better default for sustained
reading for most people, most of the time.** It does not license calling
dark mode an accessibility defect. The counter-cases are real —
photophobia and migraine, some low-vision conditions, flicker sensitivity
[S] — and halation runs the other way (light-on-dark blooms for astigmatic
eyes, which is why DS §1.2 forbids `#000000`), though the quoted "47% have
astigmatism" is a clinical prevalence figure doing duty as a design
statistic [?].

The conclusion is the boring one and it is right: **neither polarity is
the accessible one; offering the choice is.** A better argument for
building this than the dark-mode usage statistics, which come from content
farms quoting each other and should be treated as folklore [?].

---

### 3.2 The reason to build it here is hierarchy, not preference

Solve the *same three APCA tiers* against a warm off-white, using the
project's own solver:

| Tier | Dark: L | Light: L |
| --- | --- | --- |
| text-1 (Lc 90) | 0.938 | 0.216 |
| text-2 (Lc 75) | 0.862 | 0.418 |
| text-3 (Lc 60) | 0.782 | 0.544 |
| **span** | **0.156** | **0.328** |

Light mode returns **2.1× the lightness range** for the same perceptual
tiers, because APCA's dark-ground requirements bunch the light end of the
scale while its light-ground ones spread across the dark end. That is the
axis DS §1.3 had to give up. It does not fix §1 on its own — size still
dominates the skim — but it means a light theme is not a cosmetic variant
here: it is the version where a secondary tier can look secondary.

---

### 3.3 What has to change, beyond the values

**Elevation reverses.** Rule 1 — *"elevation is expressed by making the
raised thing lighter"* — is a statement about dark grounds; on a light
ground a raised surface goes *darker* or disappears into the page. It
wants restating in a form that survives both: **depth is a lightness step
away from the page, in whichever direction the page is not.** Same
three-step budget, same one-card-level limit. **The worst case flips**
too: DS §1.7's "measure against the lightest surface a token may sit on" is
the dark instance of "measure against the surface closest in lightness",
which in light mode is `--c-surface-2` — so `palette.mjs`'s hard-coded
`WORST` stays correct by name and for the opposite reason.

**A solved light palette.** Every value below produced by the project's
own `oklch()` + `apca()` + `wcagContrast()`, hue 75 to keep the warmth:

| Token | Value | OKLCH | Measured |
| --- | --- | --- | --- |
| `--c-surface-0` | `#FCFAF7` | 0.985 / 0.004 / 75 | the page |
| `--c-surface-1` | `#F4F0EC` | 0.958 / 0.007 / 75 | 1.09 vs page |
| `--c-surface-2` | `#EBE6E1` | 0.928 / 0.009 / 75 | 1.19 vs page |
| `--c-text-1` | `#1C1915` | 0.216 / 0.010 / 75 | Lc 90 on s-2, 101 on s-0; WCAG 14.1 / 16.8 |
| `--c-text-2` | `#514B44` | 0.418 / 0.014 / 75 | Lc 75 / 87; WCAG 6.9 / 8.3 |
| `--c-text-3` | `#756F66` | 0.544 / 0.016 / 75 | Lc 60 / 72; WCAG 4.0 / 4.8 |
| `--c-accent-text` | `#69440A` | 0.421 / 0.085 / 72 | Lc 75; WCAG 7.0 |
| `--c-ok` | `#319650` | 0.599 / 0.140 / 150 | 3.02 vs s-2 (1.4.11) |
| `--c-no` | `#DA5B56` | 0.633 / 0.160 / 25 | 3.02 vs s-2 |
| `--c-edge` | `#87847F` | 0.615 / 0.008 / 75 | 3.00 vs s-2 |
| `--c-hairline` | `#DBD9D5` | 0.885 / 0.006 / 75 | 1.35 vs page — decorative, as in dark |
| `--c-accent` | `#EFB05C` | unchanged | see §3.4 |
| `--c-on-accent` | `#1A0F03` | unchanged | Lc 67 on the fill, as in dark |

Note what survives untouched: the **semantic colours are still not text
colours** (Lc 62 and 61 as text — DS §1.5's conclusion reached again,
independently, on the opposite ground), the hairline is still decorative
and still exempt, and the edge is still the only required border.

### 3.4 The amber does not survive, and here is the arithmetic

`--c-accent` on a dark page measures 9.96:1 — the brightest thing on the
screen, and the one filled action reads instantly. On `#FCFAF7` the same
amber measures **1.83:1**. It stops being a figure.

Darkening it does not work, and this is provable rather than arguable.
Holding chroma 0.125 at hue 72: to clear **3:1 against the light page**
the fill needs **L ≤ 0.664** (`#C2852D`); to keep `--c-on-accent` at the
app's own design bar of **Lc 60** — APCA's requirement for a 16px/700
label — the fill needs **L ≥ 0.76** (`#E2A34F`). **The intervals do not
intersect.** Inverting the ink does not rescue it either: white on amber
needs L ≤ 0.55 for WCAG 4.5:1, and `oklch(0.55 0.125 72)` is outside sRGB;
the in-gamut solutions are `#8E5B01` and darker, which are brown. Same
shape of finding as DS §1.4's "no ink reaches Lc 75 on this fill": amber is a
light colour, and a light page has nowhere to put it.

**The way out, in order of preference.** (1) **Keep the amber exactly as
it is and give the primary button a boundary in light mode only.** WCAG
1.4.11 does not require one — a button identified by a sufficiently
contrasting text label passes without boundary contrast [S] — so this is a
perceptual fix, not a conformance one, and DS §1.6 already licenses an edge
where a fill cannot delineate a control. Cost: one rule, and the button
keeps its identity across both themes, which is what a brand actually is.
(2) Accept a softer primary and let size, weight and position carry it —
the light theme has the tonal range (§3.2) to make the label do more work.
(3) Do **not** ship a second accent hue. Two ambers is still one accent; a
different hue in light mode is a different product.

`--c-accent-text` must change regardless: `#F1CC92` on white is invisible,
and `#69440A` is the solved value at the same hue.

### 3.5 Mechanics, and the cold-start flash

Three states, not a toggle: **Sistem · Açık · Koyu**. A boolean cannot
express "follow the OS". The default must stay *dark* rather than
*system*, or existing installs change appearance on update — a surprise
nobody asked for [≈].

- `color-scheme: light dark` on `:root`, so form controls, scrollbars and
  the `<dialog>` backdrop follow.
- **Tokens redefined three ways**, which is what DS §9.3 already prescribes
  (preferences redefine tokens, never rules): `:root` keeps the dark set;
  `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`
  carries the light set; `:root[data-theme="light"]` carries it again so a
  manual choice beats the system in both directions.
- `light-dark()` is tidier and Baseline since May 2024, ~83% global [S].
  **I would not use it here**: it wants every token as a pair inside one
  declaration, which fights the existing `@supports (color: oklch(…))`
  block and puts two palettes on one line [≈].
- **The flash.** `<meta name="color-scheme" content="dark">` is hard-coded
  in all three heads precisely to stop a white flash on cold start (DS §9.1),
  and a stored preference makes it wrong half the time. The fix is a
  blocking inline script in the head of `index.html`, `quiz.html` and
  `results.html` — read the stored theme, set `data-theme` on `<html>`,
  before the stylesheet — ~200 bytes ×3, duplicated because there is no
  build step. It must rewrite `<meta name="theme-color">` too.
  `manifest.webmanifest`'s colours cannot be dynamic and should stay dark:
  they are the install-time colours and the icons are dark anyway.
- Storage: one key in a try/catch like every other read (DS §9.2). The
  control belongs in Profil beside the existing `role="switch"` rows,
  though three states is a radio group or the Listbox, not a switch.

### 3.6 What `npm run color` has to become

`palette.mjs` has one `SPEC` and one `WORST`; it needs a theme dimension —
surfaces per theme, each token measured against the surface closest in
lightness within that theme. Roughly 40 lines, no dependency, milliseconds
to run [≈]. The cheapest part of the light mode, and the part that keeps
it honest: the first draft of the dark palette passed WCAG everywhere and
failed APCA everywhere, and nobody would have seen it.

---

## 4 · The second, more readable mode (D)

### 4.1 The candidates, ranked by evidence rather than by intuition

**1 · Larger base size — strongest, and mostly already owed.** §2 is the
argument: below the critical print size reading speed falls and the
contrast requirement climbs [S], and APCA's table turns that into a floor
this app is under across half its characters.

**2 · Heavier small text — strong, cheap, free of vertical cost.**
15px/600 needs Lc 75; 15px/400 needs Lc 100. One weight step is worth
**25 Lc**, costs no space, and both weights are in the payload already —
on a fixed-height shell, the most efficient legibility lever there is [≈].

**3 · Line-height and letter-spacing — moderate, and narrower than it is
sold.** The strong result is Zorzi et al. (PNAS 2012): doubling
inter-letter spacing let dyslexic children read ~**10% faster** with
~**50% fewer errors**, replicated across sessions, materials and languages
[S]. It is a *crowding* effect measured in dyslexic children; generalising
it to "add tracking for everyone" is not supported, and past some point
tracking breaks word shapes and slows fluent readers [?]. Line-height 1.5
is 1.4.12's test value and body already runs 26/16 = **1.63**. So: leave
body, lift the tighter UI line-heights to 1.5, treat letter-spacing as an
optional 0.01em on prose.

**4 · Higher contrast — exhausted.** text-1 is Lc 94 of a 107 ceiling and
`prefers-contrast: more` already lifts the lower tiers.

**5 · Shorter line length — contested, and moot at 320px.** Dyson &
Haselgrove found ~55 characters supported effective reading at normal and
fast speeds; Shaikh & Chaparro later found 95 cpl read *faster*, and no
comprehension effect from layout; satisfaction tracked neither [S]. The
design system already measured ~36 characters at 16px on a 320px screen,
and 18px takes it to ~32. **Line length is not a lever here, it is a
consequence — and the readable mode makes it slightly worse.**

**6 · A dyslexia-specific typeface — refuse, and this is the contested
one.** The evidence is lopsided against. Kuster et al. (2018), *Annals of
Dyslexia*, n = 170: children with dyslexia read no faster and no more
accurately in Dyslexie than in Arial, and most preferred Arial. Wery &
Diliberto (2017): no improvement in rate or accuracy with OpenDyslexic.
Rello & Baeza-Yates (2013) is the study cited *for* these fonts, and what
it found was that **spacing** carried the effect [S] — candidate 3, not a
font argument. Honest residue: preference and self-reported comfort are
not nothing [?], and none of this work tested a second-language reader.
But one here costs ~15–20 KB, breaks the serif-is-English rule that
DS §2.1 makes the *language* signal, and buys a benefit the controlled
work does not find.

**7 · No italics, all-caps or justification — already done.** The BDA
guide asks for left-aligned unjustified text and structural chunking [S].
Measured: no `font-style: italic` and no `text-align: justify` in
`css/style.css`, DS §2.4 already refuses uppercase, and `js/dom.js`
supports exactly one inline mark — `**bold**` → `<strong>` at 600 in
text-1, which is also the best available anchor for the spotted scan.
This row of the wish list is a no-op, and that is a compliment to the
existing system.

**8 · Lower density — measured, and cheap.** An overlay taking the meta
tier to 15px/600, micro to 15px, `.t-ui` to 16px and prose line-height to
1.6 costs **+6% height** on the topic, reader and Test screens, **+11%**
on the index, **+19%** on Profil, with no horizontal overflow at 320px.
That is the true cost of the readable mode.

### 4.2 The platform hooks, and which are already right

`prefers-reduced-motion` is handled, and unusually well — motion is
opt-in, so the safe version is the fallback (DS §5). `forced-colors:
active` is handled and will need re-verifying in the light theme, which it
overrides. `prefers-color-scheme` is ignored today (§3.5).
`prefers-reduced-transparency` has nothing to act on [≈].

Two are worth arguing about. **`prefers-contrast: more` is aimed at the
wrong lever**: it lifts the greys, and §2.2 shows greys cannot fix 13px.
It should route into the readable mode's *type* tokens as well.
And **1.4.12 is the sharp one**: it asks "does the layout survive being
overridden", and the app passes (§2.4) — but a readable mode should be the
shape a user would have overridden *to*. Body is already at 1.63; the gaps
are paragraph spacing → 2em and the tighter UI line-heights → 1.5.

### 4.3 What is left that is not simply the base fix

Strip out everything that should be fixed for everyone and the residue is:
a **type-scale multiplier** (×1.125 — body 18, ui 17, meta 17 — or ×1.25),
**line-height ≥1.5 on the UI steps**, **paragraph spacing 2em**, and
optionally 0.01em of tracking on prose, off by default [?]. A legitimate
mode, about twenty lines of CSS, and not a theme.

**One thing to check first.** The scale is authored in `px`, so a reader
who raised their *browser's* default font size gets nothing from it.
Chrome for Android's current control is a "Default zoom" slider that
scales the whole layout [S], which px respects — but desktop default font
sizes and older text-scaling controls do not scale px, and
`-webkit-text-size-adjust: 100%` is set (correctly, for another reason).
Moving `--t-*` to `rem` would make the OS preference work for free [?]. If
it does, it makes the readable mode partly redundant — an argument for
doing it.

---

## 5 · How many modes is too many (E)

### 5.1 Two dimensions, not three modes

A "readable" theme exclusive with light and dark forces a bad choice on
whoever needs both, and triples the palette work. The two axes are
independent by construction: **polarity** is a colour dimension and
changes tokens; **readability** is a type dimension and changes sizes,
weights and line-heights. They meet in exactly one place — the APCA
requirement table — and that intersection is checked by arithmetic rather
than by eye. So: **2 × 2, orthogonal.** Dark (default) / Açık × Normal /
Büyük yazı.

This is what the platforms do: iOS keeps Bold Text, Larger Text and
Increase Contrast as independent switches, Android keeps font size,
display size, bold text and high-contrast text separate [S], and neither
ships a "readable theme". Reading apps add one useful idea on top —
**presets over sliders**: Kindle's Compact / Standard / Large / Low Vision
alongside its background choices, Apple Books' four backgrounds [S]. A
preset is the humane version of a settings panel: one control, named
outcomes.

### 5.2 The testing burden, measured rather than feared

The sweep is **1,550 checks in 2m24s** across four widths, and it is
green. What a second mode multiplies is not uniform:

| Added mode | Layout checks | Contrast checks | Real cost |
| --- | --- | --- | --- |
| **Light theme** | none — geometry is identical | doubles `npm run color` (milliseconds) | one 320px pass for the theme-specific rules: the primary button's boundary, forced-colors, the tinted feedback rows. Perhaps +15 checks, +20s [≈] |
| **Type mode** | **all of them** — sizes move, so overflow, target size, screen height and 1.4.12 all move | none | a second full sweep: +2m24s, ×2 the CI wall clock [≈] |

Which is the opposite of the intuition: the colour mode is nearly free to
verify because DS §8's conformance surface is geometry plus contrast and
it touches only the second; the type mode is expensive because it touches the
first. The mitigation is already in the repo's habits — `verify-ui.mjs`
takes a base URL and drives the real app, so a type mode reachable by a
seeded `localStorage` value can be swept by the same script behind a flag
rather than a fork. Add it there, so the next session inherits the check.

### 5.3 The argument against building any of it

**Fewer than 5% of users ever change a default setting** — Spool's number,
from an informal 2011 study of Word, endlessly requoted and not a
controlled result [S] [?]. Directionally it says something true: *the
default carries the app.* A mode is not a fix for a wrong default, it is a
place to hide one — which is the argument for the order in §6. Most of
this app's users will take whatever the link opens with, for six
weeks, at night, before an exam.

### 5.4 What to refuse

**A sepia third background** — a preference with no evidence behind it and
a third palette to solve. **A contrast slider or any free-form colour
control** — every value it can produce has to be conformant, so it means
solving a continuum instead of eleven tokens. **Auto-switching by time of
day** — the app is used at night, a theme that changes mid-lesson is a
flash and a surprise, and `prefers-color-scheme` already carries the OS's
schedule. **Per-topic or per-tier theming** — parked in
`docs/research/visual-longevity.md`, not this round. **A fourth text
tier** — three is what the ramp supports; the answer is size and weight.

---

## 6 · What to build, in what order (F)

**Stage 1 — the type fix, in the base, dark theme (half a day).** The
complaint the owner actually made, fixed for everybody, in the theme that
already ships.

- **Kill the 11px step.** Nav labels and `.t-label` block labels go to
  **15px/600**; the nav is the app's most permanent text and is currently
  11px at Lc 63.
- **Kill 13px/400 as a text tier.** `.row__sub`, `.t-meta`,
  `.stat__label`, `.option__key` and `.feedback__body` become **15px/600
  in `--c-text-2`** — required Lc 75, measured 79. One weight step buys
  25 Lc and costs no vertical space.
- **Widen the Row's size step** from 1.15 to at least 1.2: title 17/600,
  sub 15/600 — or hold the title at 15 and let weight and colour carry it,
  but not both compressed at once.
- Measured cost: **+6% to +19% screen height**, no horizontal overflow at
  320px. Confirm with the 1,550-check sweep.

**Stage 2 — use the top of the scale (half a day).** 0.8% of rendered
characters are at 22px or above. Screen titles at `--t-display`, section
heads at `--t-title`, one per screen — anchors for the layer-cake scan
(§1.2), which no amount of contrast work substitutes for.

**Stage 3 — the light theme (one to two days).** Values in §3.3, amber per
§3.4 option 1, mechanics per §3.5, `palette.mjs` per §3.6, plus a 320px
pass for the theme-specific rules. Default stays dark; the control is
**Sistem / Açık / Koyu** in Profil.

**Stage 4 — "Büyük yazı" (half a day).** One multiplier token over the
existing scale (×1.125), line-height ≥1.5 on the UI steps, paragraph
spacing 2em. Orthogonal to the theme. Route `prefers-contrast: more` into
it as well as into the greys, and sweep once with the flag set.

**Stage 5 — make the finding un-loseable (a couple of hours).** The
durable output of this arm is a check, not a palette. **Add the APCA font
table to `npm run color`**: each text token declares the size/weight pairs
it is used at, the run interpolates `fontMatrixAscend`, and a pair whose
required Lc exceeds the measured one fails the run — ~50 lines with the
matrix inlined and attributed [≈]. And keep the census: §1.4's measurement
was 40 lines of Playwright, and as `tools/type-census.mjs` it answers "how
much of this app is small type" on demand.

**What this arm refuses**, beyond §5.4: a dyslexia-specific typeface
(§4.1.6), a second accent hue for the light theme (§3.4), anything under
15px, and any version of the readable mode that ships *instead of*
Stage 1 — the mode nobody enables is not a fix for the screen everybody
sees.

---

## 7 · What I could not check

1. **The APCA font table is a public beta, not a standard.** It was
   fetched from source so the numbers are right; whether its conservative
   small-size rows are *correct* is a live argument (DS §1.1). Everything
   in §2.2 passes WCAG 2.2 AA today.
2. **The 700 weight is not in the payload.** `fonts/` ships Source Sans 3
   at 400 and 600 only and `.btn--primary` asks for 700; matching should
   resolve that to the 600 face, but whether an engine synthesises extra
   weight at Δ100 varies [?]. A reason to write new rules against 600.
3. **Light-mode weight compensation.** DS §11.2's open question stands:
   light-on-dark reads bolder, the advice is to drop weight or use a
   `GRAD` axis [S], and this build ships static instances. Settle it on a
   real phone.
4. **No Turkish-language reading research was found**, and none of the
   work cited tested a second-language reader. Turkish is agglutinative
   with much longer words (DS §2.4's +20–30%); whether the crowding and
   spacing results transfer is unknown to me.
5. **Chrome for Android's text scaling** with `text-size-adjust: 100%`
   and px type (§4.3) — one device check from being known rather than
   assumed. And the **dark-mode usage statistics** are content-farm
   figures citing each other; none is used for a recommendation here.

---

## Sources

**Reading behaviour** — [Duggan & Payne, *Skim reading by satisficing*, CHI 2011](https://dl.acm.org/doi/10.1145/1978942.1979114) · [NN/g, *F-Shaped Pattern: Misunderstood, But Still Relevant*](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) · [NN/g, *Text Scanning Patterns*](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) · [Morkes & Nielsen, *Concise, SCANNABLE, and Objective*](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) · [IxDF, *Preattentive Visual Properties*](https://ixdf.org/literature/article/preattentive-visual-properties-and-how-to-use-them-in-information-visualization)

**Size and contrast** — [Myndex/apca-w3 `fontMatrixAscend`](https://github.com/Myndex/apca-w3) (fetched) · [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html) (blocked; summary only) · [Rubin & Legge, *Psychophysics of Reading VI*](https://legge.psych.umn.edu/sites/legge.psych.umn.edu/files/2020-08/psychophysics_of_reading._vi._the_role_of_contrast_in_low_vision_rubin_legge_1989.pdf) · [W3C, *Understanding 1.4.12*](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) · [W3C, *Understanding 1.4.11*](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) · [Learn UI Design, *Font size guidelines*](https://www.learnui.design/blog/mobile-desktop-website-font-size-guidelines.html)

**Polarity** — [Piepenbrock et al., *Positive display polarity is advantageous for both younger and older adults*](https://www.semanticscholar.org/paper/1605c4f7d561f6cca0fcce6062f788562ccbae6f) · [Buchner, Mayr & Brandt 2009](https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/2009/Buchner_Mayr_Brandt__2009_.pdf) · [*Smaller pupil size and better proofreading with positive polarity*](https://pubmed.ncbi.nlm.nih.gov/25135324/) · [BOIA, *Dark Mode Can Improve Text Readability — But Not for Everyone*](https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone) · [nerdy.dev, *Fixing the irradiation illusion*](https://nerdy.dev/adjust-perceived-typepace-weight-for-dark-mode-without-layout-shift)

**Readable mode** — [Zorzi et al., PNAS 2012](https://www.pnas.org/doi/full/10.1073/pnas.1205566109) · [Kuster et al., *Dyslexie font does not benefit reading*, Annals of Dyslexia 2018](https://link.springer.com/article/10.1007/s11881-017-0154-6) · [Wery & Diliberto, *OpenDyslexic*](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5629233/) · [IDA, *Do Special Fonts Help?*](https://dyslexiaida.org/do-special-fonts-help-people-with-dyslexia/) · [BDA, *Dyslexia Style Guide 2023*](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf) · [Dyson & Haselgrove](https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586) · [Shaikh & Chaparro](https://journals.sagepub.com/doi/10.1177/154193120504900514)

**Modes and mechanics** — [MDN `light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) · [MDN `prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast) · [MDN `forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors) · [Apple, *Display and text size preferences*](https://support.apple.com/en-us/111773) · [Android, *Change text & display settings*](https://support.google.com/accessibility/android/answer/11183305) · [Amazon, *Accessible reading options for Kindle*](https://www.amazon.com/gp/help/customer/display.html?nodeId=TABlJ4ot69emTO8jJG) · [UIE/Spool, *Do users change their settings?*](https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/)
