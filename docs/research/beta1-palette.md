# A second hue

Research for the beta-1 palette. Written 2026-09-09 against the owner's
report of the same week, which is the third report on readability and
the first that names the cause rather than a symptom.

> The design is *"stuck between minimalism and shallowness."* In light
> mode the orange does not create good contrast. Brown and orange, while
> nice, become shallow over a long run and hurt readability. He wants the
> best palette for **both** modes. He likes the UI but does not think it
> is the best choice.

Every number below was produced by `tools/color.mjs` (`oklch`, `apca`,
`wcagContrast`) and, for the recommended palette, by a byte-for-byte
copy of `tools/palette.mjs` with only its four spec blocks replaced, so
that the output pasted in §9 is the project's own tool speaking. Claims
are marked **[S]** established in the literature, **[?]** contested or
unverified, **[≈]** my own inference.

---

## 0 · The short version

1. **The root cause is verified, and it is worse than stated.** Every
   non-semantic token in the dark theme sits between OKLCH hue **67° and
   78°**; in the light theme between **68° and 85°**. Surfaces, all three
   text tiers, accent, accent-text, focus, hairline and edge share one
   hue. Only `ok` (150) and `no` (25) leave it. The interface has one hue,
   and therefore one channel — lightness — for figure, ground, hierarchy
   and depth at once. APCA had already spent that channel on three text
   tiers 0.156 apart in L. "Shallow" is the literal description.
2. **Vision science supports the diagnosis but not the folklore.** Form,
   depth and fine detail ride on luminance; hue is a second, lower
   resolution channel that carries *identity* and *grouping* cheaply
   [S]. A one-hue interface is not tiring — there is no evidence for
   that — but it *is* starved: nothing can be told apart by kind, only by
   how bright it is [≈]. That is what the owner is seeing.
3. **The amber failing on light is the same fact.** On a warm off-white
   the amber is the page with more chroma. And it cannot be darkened: a
   dark-ink amber that clears 3:1 against the page does not exist (§4).
4. **Design: move the warmth from the ground to the figure.** A cool
   slate ground (H 255, C 0.014 dark / 0.004–0.008 light), the same
   cool grey for text, and the amber kept as the only warm thing on the
   screen. The temperature contrast is the second channel.
5. **The accent becomes a pair.** Dark: `oklch(0.80 0.125 70)` with dark
   ink, as now. Light: `oklch(0.55 0.125 60)` with *light* ink — a burnt
   amber, 4.09:1 against the darkest surface and Lc 76 under its label.
   Same family, opposite ink polarity, both solved.
6. **Two complete palettes are solved and pass the real tool** — A
   (slate) and B (true neutral) — every token, every `PAIRS` row, both
   modes, a step past each requirement. A is recommended. §9 has the
   tool's output and the paste-ready blocks.
7. **Depth is not improved by the hue change, and should not be
   expected to be.** Measured: chroma at these magnitudes contributes
   nothing to the surface ramp, and the light ramp is at the threshold
   of visibility already. What the second hue buys is a figure that is
   *different in kind* from the ground. §6.
8. **One cost is real:** in light mode the accent, `ok` and `no` all live
   at L 0.55–0.62, so for a deuteranope the accent tint and the correct
   tint converge (ΔE 0.06). §5 measures it and says why it is
   acceptable, and where it is not.

---

## 1 · The measurement

`tools/color.mjs` has no inverse transform, so I wrote one in the
scratchpad (sRGB → OKLab, the standard matrices) and ran every shipped
hex through it.

| token | dark hex | L | C | H | light hex | L | C | H |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| surface-0 | `#13100D` | 0.176 | 0.008 | **67** | `#FCFAF7` | 0.986 | 0.005 | **78** |
| surface-1 | `#1F1C19` | 0.229 | 0.007 | **67** | `#F4F0EC` | 0.957 | 0.007 | **68** |
| surface-2 | `#2C2A27` | 0.286 | 0.006 | **78** | `#EBE6E1` | 0.927 | 0.009 | **68** |
| text-1 | `#EDEAE6` | 0.938 | 0.006 | **75** | `#1C1915` | 0.215 | 0.009 | **75** |
| text-2 | `#D6D1CB` | 0.863 | 0.010 | **73** | `#4D4840` | 0.404 | 0.015 | **80** |
| text-3 | `#BDB7B0` | 0.782 | 0.012 | **72** | `#756F66` | 0.544 | 0.016 | **78** |
| accent | `#EFB05C` | 0.800 | 0.125 | **72** | *(same)* | | | |
| accent-text | `#F1CC92` | 0.864 | 0.085 | **78** | `#654003` | 0.405 | 0.085 | **72** |
| focus | `#F4DAB2` | 0.900 | 0.060 | **78** | `#7F5C1D` | 0.500 | 0.090 | **78** |
| hairline | `#36322D` | 0.320 | 0.010 | **74** | `#DBD9D5` | 0.886 | 0.006 | **85** |
| edge | `#78746E` | 0.561 | 0.010 | **78** | `#84807C` | 0.602 | 0.008 | **68** |
| ok | `#7CCD8E` | 0.780 | 0.120 | 150 | `#2C924D` | 0.585 | 0.139 | 150 |
| no | `#E97871` | 0.700 | 0.141 | 25 | `#D55753` | 0.619 | 0.160 | 25 |

Eleven tokens in an 11° band on dark and a 17° band on light. The
design system did this on purpose and said why: §1.2 sets the surface
chroma to 0.008 *"so the neutrals do not read cold beside the amber"*,
and every subsequent token was solved at the same hue to keep contrast
calibration per level rather than per colour (§1.7). Both reasons were
sound and they compound into a single-hue interface.

Two further things fall out of the table.

**The ground's warmth is invisible as colour and only shows as absence.**
ΔE (OKLab) between `#13100D` and the pure grey at the same lightness is
**0.008**, below anything a viewer identifies as "brown". What the eye
gets is not a brown page but a page that is the same temperature as
everything on it — including the amber, which is therefore not warm
*against* anything.

**Material's `elevate()` drifts the hue on the way up the ramp.** From H
67 at `surface-0` to H 78 at `surface-2`, and chroma erodes from 0.0078
to 0.0061, because the overlay blends towards pure white in sRGB. On a
cool base it does the same in the other direction (H 254 → 248, C 0.0122
→ 0.0093 at C 0.012). Harmless at chroma 0.008; at the chroma a cool
ground needs it starts to matter. §8 replaces it.

---

## 2 · Chromatic contrast as a second channel

### 2.1 What is established

**Luminance carries form, depth and fine detail; colour does not.**
Livingstone & Hubel's psychophysics [S] showed that shape-from-shading,
perspective depth, motion and fine spatial detail all fail or degrade at
equiluminance — when two regions differ in hue but not in luminance, the
visual system cannot infer three-dimensional structure from the boundary
([J. Neurosci. 1987](https://www.jneurosci.org/content/7/11/3416)). The
chromatic channels have far lower spatial resolution than the luminance
channel — roughly a third in APCA's own summary, an order of magnitude
in Bach's demonstrations ([APCA in a
Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html),
[michaelbach.de](https://michaelbach.de/ot/col-equilu/)). This is why
the design system is right to measure text by lightness only, and why
nothing in this document proposes hue as a text-contrast substitute.

**But hue can carry reading, at the sizes the app uses, when it is
strong.** Legge, Parish, Luebker & Wurm [S] measured reading speed
against luminance contrast, colour contrast (red/green) and mixtures:
with high colour contrast, normal readers reached the same >300 wpm as
with high luminance contrast, and where both were present, performance
followed whichever was stronger with no additive gain ([JOSA A
1990](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-7-10-2002)).
Low-vision readers did worse with colour alone. So hue is not a weak
copy of lightness; it is a *separate* channel with its own capacity,
good for large figures and poor for fine ones.

**Hue is preattentive.** A single item differing in hue from a field
pops out in constant time regardless of how many distractors surround
it — the classic feature-search result (Treisman & Gelade 1980) [S].
Lightness differences pop out too, but the app has already divided its
lightness range into three text tiers, three surfaces, an edge and a
hairline, so a *fourth* lightness difference has no room to be
unambiguous. A hue difference has the entire wheel.

**Warm advances, cool recedes — with a caveat.** Chromostereopsis is
real and optical: chromatic aberration in the eye places red in front of
blue for most observers [S]. The effect weakens at equiluminance,
meaning much of the everyday "warm advances" impression is luminance
doing the work, and under binocular viewing red's advance survives while
blue's recession mostly does not
([Thompson, May & Stone
1993](https://www-users.york.ac.uk/~pt2/ThompsonMayStone1993.pdf),
[PMC 2024](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11652407/)).
For this app that is the right way round: a bright amber on a dark cool
ground gets both cues — it is lighter *and* warmer — and the two agree.

### 2.2 What is not established

**"A monochromatic UI tires the eye over time."** I could not find it.
The visual-fatigue literature measures brightness, flicker, ambient
light, viewing duration and, more recently, colourfulness in video
([Sci. Rep. 2024](https://www.nature.com/articles/s41598-024-78329-y))
and colour scheme in search tasks under vibration
([ScienceDirect 2024](https://www.sciencedirect.com/science/article/abs/pii/S0141938224000313)).
None of it tests a one-hue interface against a two-hue one over weeks of
use. The claim as the owner phrased it — *shallow over a long run* — is
better read as a report about **discrimination**, not fatigue: after the
novelty of the palette wears off, the eye has learned that hue tells it
nothing, and every distinction has to be made the slow way, by comparing
brightnesses. That reading is consistent with everything in §2.1 and is
marked [≈] because it is mine.

**Itten's "contrast of hue"** is design theory, taught for a century and
still in every curriculum, but it is a taxonomy of effects rather than a
measured finding ([Itten review, Part
I](https://www.academia.edu/109056855/Ittens_seven_colour_contrasts_a_review_Part_I_Early_contrast_theories_and_the_road_to_Ittens_contrast_theory))
[≈]. The practitioner rule that *pure greys read flat and a tinted grey
reads richer* (Refactoring UI, the shadcn academy) is folklore of the
useful kind — widely observed, never tested [?]. This document does not
lean on either; it leans on §2.1 and on the numbers.

### 2.3 So what "shallow" means here

The interface has two things to tell the learner apart by colour — *the
thing to press* and *the thing to read* — and it currently tells them
apart by lightness alone, on a ground that has also to tell apart three
reading tiers by lightness alone. The design system's own rule, "one
accent, one job," is correct and was never the problem. The problem is
that the one accent has no *kind* of its own. Give it one — make it the
only warm thing on a cool page — and every use of it (the filled button,
the link, the blank's underline, the progress fill, the focus ring)
becomes recognisable as *the same kind of thing* at a glance, before the
eye has compared any brightnesses.

---

## 3 · Two-hue system design

The constraint, taken as given: **brown and orange together go
shallow.** So the warm ground is not defended below; it is measured
against the alternatives and let go.

### 3.1 The four options

**(a) Cool-neutral ground + warm accent.** Slate, H 250–270, low chroma.
The amber becomes warm *against* something. Text is cool grey, so the
serif for English sits as dark ink on a cool page — the ordinary
appearance of a printed book, which is where the serif came from. Focus
ring and links, both in the accent family, become chromatically distinct
from hairline and edge, which stay on the ground's hue. This is the
design most of §2 points to and the one solved in full as **candidate A**.

**(b) True neutral ground + warm accent.** C = 0. Same argument, less
of it: the amber is warm against nothing rather than against cool. It is
the safest of the four, and the one most likely to be called "generic
dark mode". Solved in full as **candidate B**, chiefly to show that A's
numbers are not bought with the chroma — the two are within 0.5 Lc of
each other everywhere.

**(c) Warm ground + cool accent.** Keeps the brown. Feasible: at H 200
(teal) the dark accent window is L 0.745–0.915 with dark ink and the
light window L 0.53–0.555 with white ink; at H 240 (blue) the light
window is a comfortable L 0.44–0.56 (`#1F6A96`). But the owner's
constraint was *brown and orange*, and (c) keeps the half he named
first. It also puts the app's one accent within 15° of the default blue
of every framework (§7). The teal variant survives that objection; the
blue does not. Not recommended, and not solved beyond the accent.

**(d) Warm ground + a second warm accent, far enough away.** Measured
and it fails on the semantics. Towards red: H 35–45 lands 10–20° from
`no` (H 25) and, at the accent's L 0.80, is out of sRGB gamut at every
hue below 50. Towards yellow-green: H 100–120 is in gamut but 30–50°
from `ok` (H 150), and under deuteranopia an H 40 accent is ΔE **0.042**
from `ok` — indistinguishable. There is no second warm hue that the
semantic colours have not already taken.

### 3.2 What each does to the things the owner values

| | warmth / identity | serif + sans | the amber's legibility | depth |
| --- | --- | --- | --- | --- |
| **(a) slate + amber** | warmth moves from page to figure; the app stops being "brown" and becomes "amber on slate" | dark serif on a cool page: the book | in dark, unchanged (7.5:1, Lc 67 under ink); in light, needs the pair in §4 either way | ramp unchanged (§6); figure/ground gains a hue difference |
| **(b) neutral + amber** | warmth only in the figure; page is nothing | the same | the same | the same, minus the temperature contrast |
| **(c) warm + teal** | keeps the brown; loses the amber identity | serif on warm paper, as now | teal has an easier light-mode window (L 0.53–0.555, white ink) | as now |
| **(d) warm + second warm** | keeps the brown | as now | fails: every candidate hue collides with `ok` or `no` | as now |

### 3.3 Why H 255 and C 0.014

Radix's guidance for pairing a grey with an accent is either *the grey
tinted towards the accent's hue* for harmony, or a pure grey for
neutrality ([Radix, composing a
palette](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)).
The first is exactly what the current palette did and what the owner is
reporting against. The practitioner rule that goes the other way — take
the brand hue's temperature and send the greys in the opposite direction
[?] — is the one this document follows, on the strength of §2.1 rather
than of the rule.

H 255 is the hue of Radix Slate and Tailwind Slate in OKLCH terms, a
blue-grey that does not read as blue below about C 0.02 [≈]. Measured:
at L 0.175, C 0.014 is ΔE **0.015** from the pure grey — nearly double
the current ground's 0.008, and just under the 0.015 line at which DS
§1.2 says a neutral starts to look like a colour. It is set that high
deliberately: below about 0.010 the ground reads as plain black beside
the amber and the temperature contrast is lost [≈]. The light ground
runs 0.004 → 0.008 up the ramp (ΔE 0.005–0.008 from grey), which is as
much as an off-white can carry before it looks tinted.

Text takes the ground's hue at the same low chromas as now (0.006 /
0.010 / 0.012 dark; 0.012 / 0.016 / 0.018 light). It could be pure grey;
keeping it on the ground's hue is what stops it looking warmer than the
page and re-introducing the third temperature.

---

## 4 · The accent must be per-mode

### 4.1 The dark-ink dead end, re-derived

DS §1.4 and `ui-improve.md` §3.4 established this and it holds under a
finer scan. For a dark-ink amber (ink `oklch(0.18 0.03 H)`) to sit on a
light page, the fill needs both:

- **WCAG ≥ 3:1 against `surface-2`** (light) — the *darkest* light
  surface, so the worst case: at H 72, C 0.125, this requires
  **L ≤ 0.664**.
- **The ink at APCA Lc ≥ 60 and WCAG ≥ 4.5 on the fill**, the font
  matrix's row for 16px/700: requires **L ≥ 0.755**.

No intersection, at any hue from 50 to 72 and any chroma from 0.12 to
0.17. The scan found *no* dark-ink window on any light ground — warm,
slate or neutral. Amber is a light colour; a light page has nowhere to
put it.

### 4.2 The light-ink solution, and its window

Invert the ink. With `#FFFFFF` (or the page colour) as the label, the
conditions become *fill dark enough for the ink* and *fill dark enough
for the page*, which agree in direction. Measured windows on the slate
light ground, L in steps of 0.005:

| H | C | window (L) | steps | midpoint | ink Lc | ink WCAG | vs s2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | 0.12 | 0.455–0.575 | 25 | `#9C4F1C` | 84 | 5.92 | 4.77 |
| **60** | **0.12** | **0.515–0.575** | **13** | `#A25C14` | 80 | 5.15 | 4.15 |
| 70 | 0.12 | 0.555–0.570 | 4 | `#A16707` | 78 | 4.71 | 3.80 |
| 72 | 0.12 | 0.560–0.570 | 3 | `#A16803` | 78 | 4.67 | 3.76 |
| 60 | 0.14+ | — | 0 | out of gamut below L 0.60 | | | |

The window closes as the hue approaches the dark accent's 70° and as
chroma rises; at H 68 nothing between C 0.13 and 0.16 is in gamut below
L 0.60. **H 60, C 0.125, L 0.55** is the last comfortable point that is
in gamut (C 0.13 at the same L and hue is not) — a burnt amber,
`#A55D0C`.

The upper ceiling on that hue is the WCAG 4.5 requirement for the ink,
not APCA: at L 0.55 the page-coloured ink measures **Lc 76 / 4.82:1**.
So on light, as on dark, the fill carries **short bold labels at 16px or
larger and nothing else** — for a different reason each time, but the
rule is the same rule.

### 4.3 The pair

| | dark | light |
| --- | --- | --- |
| `--c-accent` | `oklch(0.80 0.125 70)` `#F1AF5D` | `oklch(0.55 0.125 60)` `#A55D0C` |
| `--c-on-accent` | `oklch(0.18 0.03 70)` `#1A0F03` — dark ink | `oklch(0.985 0.004 255)` `#F8FAFD` — the page as ink |
| ink on fill | WCAG 9.91, Lc 67 | WCAG 4.82, Lc 76 |
| fill vs surface-0 / 1 / 2 | 9.95 / 8.90 / 7.49 | 4.82 / 4.44 / 4.09 |
| `--c-accent-text` | `oklch(0.871 0.085 76)` `#F5CE95` — Lc 77 | `oklch(0.418 0.085 66)` `#6B420E` — Lc 76 |
| `--c-focus` | `oklch(0.90 0.06 78)` `#F4DAB2` — 10.5:1 | `oklch(0.50 0.09 68)` `#855823` — 5.0:1 |

Ten degrees of hue between the two fills and the same chroma. Radix's
own amber scale moves further than that between its solid step and its
text step, and nobody reads them as two brands
([Radix,
scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)).
What makes it one accent is that on both grounds it is *the only warm
thing there is*.

The dark value moves from H 72 to 70 and C stays 0.125: Lc under the ink
is 67 either way, and 70 sits 2° closer to the light value. It is a
cosmetic move and could be left at 72.

---

## 5 · Semantic colours

`ok` and `no` keep their roles: indicators, never text (DS §1.5). Their
dark values are unchanged (`#7CCD8E`, `#E97871`); the light values are
re-solved a step past 3:1 against the new `surface-2` (`#2E944E` 3.12,
`#D65854` 3.17). What changes is their neighbourhood, so the question is
whether they still read as *not the accent* — for everyone, and for the
8% of men with a red-green deficiency.

Simulated with the Machado, Oliveira & Fernandes (2009) matrices at
severity 1.0 in linear sRGB [S], the same model DaltonLens and R's
`colorspace` ship; the matrix constants are transcribed from the
published table and should be spot-checked against one of those
implementations before this is relied on [≈]. ΔE is OKLab Euclidean;
around 0.02 is a just-noticeable step, 0.06 is clearly different, 0.15
is a different colour.

### 5.1 Dark — unchanged in substance

| | accent ↔ ok | accent ↔ no | ok ↔ no |
| --- | --- | --- | --- |
| current, normal | 0.155 | 0.147 | 0.245 |
| current, deuteranopia | 0.076 | 0.113 | 0.073 |
| **A, normal** | 0.159 | 0.144 | 0.245 |
| **A, deuteranopia** | 0.075 | 0.113 | 0.073 |
| A, protanopia | 0.061 | 0.150 | 0.174 |

The dark accent is at L 0.80, `ok` at 0.78, `no` at 0.70: lightness keeps
them apart when hue collapses, exactly as now.

### 5.2 Light — the one cost

| | accent ↔ ok | accent ↔ no | ok ↔ no |
| --- | --- | --- | --- |
| current, normal | 0.272 | 0.217 | 0.268 |
| current, deuteranopia | 0.231 | 0.185 | **0.047** |
| **A, normal** | 0.192 | 0.117 | 0.269 |
| **A, deuteranopia** | **0.061** | 0.082 | **0.046** |
| A, protanopia | 0.119 | 0.073 | 0.087 |

Two things. **`ok ↔ no` at ΔE 0.047 under deuteranopia is the current
palette's number too**, and it is the reason DS §1.5 gives the verdict
four redundant channels. Red and green at the same lightness cannot be
separated for a deuteranope; that is the condition, not the palette.

**`accent ↔ ok` falls from 0.231 to 0.061.** The current light accent is
a pale amber at L 0.80, far above the indicators in lightness; the new
one is at L 0.55, beside them (accent/ok WCAG 1.31, accent/no 1.29). For
a deuteranope the burnt amber and the green both become olive. Where
does that matter? The accent's *tint* (`.chip--accent`, the switch
on-state on Profil) and the `ok` *tint* (`.chip--ok`, `.option--ok`,
`.feedback--ok` on results and in lesson checks) are 0.12–0.14 alpha
washes of each — and both would wash to the same pale olive. They do not
share a screen, and every chip carries a word. I judge it acceptable and
it must be written down.

Darkening light `ok` to L 0.50 (`#137738`) was measured as a fix: it
lifts `ok ↔ no` under deuteranopia to 0.134, and drops `accent ↔ ok`
under **protanopia** to 0.037. No free lunch; leave `ok` where it is
solved.

---

## 6 · Depth without borders

The DS rule — depth is a lightness step away from the page, no borders,
no shadows, one card level — is kept. The question the brief asks is
whether a cool ground lets the ramp be smaller with chroma doing work.
Measured, it does not.

### 6.1 Dark ramps

| ramp | s0 / s1 / s2 | WCAG s0:s1 · s1:s2 | ΔE s0→s1 · s1→s2 | text-1 Lc on s2 |
| --- | --- | --- | --- | --- |
| current: warm, `elevate()` 1 dp / 6 dp | `#13100D #1F1C19 #2C2A27` | 1.118 · 1.185 | 0.053 · 0.057 | 90.5 |
| cool, `elevate()` | `#0C1117 #181D23 #262B30` | 1.118 · 1.187 | 0.053 · 0.058 | 91.3 |
| **cool, OKLCH L 0.175 / 0.228 / 0.286, C 0.014 held** | `#0C1117 #181D23 #262B31` | 1.118 · 1.188 | 0.053 · 0.058 | 91.3 |
| cool, same L, C rising 0.012 / 0.016 / 0.020 | `#0D1116 #171D24 #242B34` | 1.116 · 1.188 | 0.052 · 0.058 | 91.3 |
| cool, smaller L 0.175 / 0.215 / 0.255, C rising | `#0D1116 #151A21 #1C232C` | 1.084 · 1.104 | 0.040 · 0.038 | 92.7 |
| cool, larger L 0.175 / 0.24 / 0.30, C held | `#0C1117 #1B2026 #292E35` | 1.156 · 1.199 | 0.066 · 0.058 | 90.6 |

Three findings. **An OKLCH lightness ramp at constant chroma reproduces
`elevate()`'s depth to the third decimal** and does it without the hue
drift, so the derivation can change with nothing lost (§8). **Chroma
rising with elevation changes ΔE by 0.001** — at 0.012–0.020 the chroma
is perceptually inert as depth; Material 3's tonal surfaces get their
effect from tinting *towards the primary* at far higher alpha, and that
is precisely the ground-shares-the-accent's-hue design being left
behind ([M3 surface
tint](https://api.flutter.dev/flutter/material/ElevationOverlay/applySurfaceTint.html)).
**A smaller ramp buys nothing worth having**: 0.255 at the top gains
text-1 1.4 Lc and loses a quarter of the depth. The ramp could go the
other way — 0.30 at the top still passes, with text-1 at Lc 90.6 — but
that is a margin of 0.6 on the one pair the whole app reads, and the
current steps are kept.

### 6.2 Light ramps

| ramp | s0 / s1 / s2 | WCAG | ΔE | text-1 Lc on s2 |
| --- | --- | --- | --- | --- |
| current warm 0.985 / 0.958 / 0.928 | `#FCFAF7 #F4F0EC #EBE6E1` | 1.088 · 1.093 | 0.029 · 0.030 | 90.0 |
| **cool, same L, C 0.004 / 0.006 / 0.008** | `#F8FAFD #EEF1F5 #E4E8ED` | 1.084 · 1.086 | 0.027 · 0.028 | 90.3 |
| cool, C 0.006 / 0.010 / 0.014 | `#F7FAFE #EDF2F8 #E1E8F1` | 1.075 · 1.097 | 0.025 · 0.031 | 90.1 |
| cool wider 0.985 / 0.952 / 0.915 | `#F8FAFD #ECEFF4 #DFE3EA` | 1.102 · 1.117 | 0.033 · 0.037 | **87.5 — fails** |

The light ramp sits at ΔE 0.027–0.030 per step, near the threshold of
noticing, and it cannot be widened: pushing `surface-2` to L 0.915
drops body prose to Lc 87.5, under the 90 the design bar requires at
16px/400. **On light, depth from surfaces is at its ceiling in any
hue.** This is the honest limit of "depth from lightness" on a light
page, and it is where the second hue earns its place: the filled button,
the progress fill and the blank's underline are separated from the page
by *kind*, not by three hundredths of L.

---

## 7 · What to refuse

The defaults have names now; the trade has been cataloguing them since
2025 ([Spot the
Slop](https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c),
[impeccable.style](https://impeccable.style/slop/)). Listed so the
candidates can be checked against them rather than against taste.

| default | what it looks like | the candidates |
| --- | --- | --- |
| **the gradient hero** | purple-to-cyan or indigo-to-violet behind a headline | no gradient anywhere; the DS forbids them and nothing here relaxes that |
| **glassmorphism** | translucent panels with blur and a hairline glow | no translucency; depth is a solid surface step (§6) |
| **the blue/violet accent** | H 260–300 at high chroma, the framework default | the accent is amber, H 60–70; the only cool thing is the ground, at C 0.014, which is a grey |
| **multiple accents** | a "primary" and a "secondary" and a gradient between | one accent, one job, and now one *temperature* |
| **Inter and zinc** | the default font on the default grey | the type is Source Serif 4 + Source Sans 3; the grey is solved, not picked |
| **neon on black** | `#000` with saturated glows | never `#000` (DS §1.2); `surface-0` is L 0.175 |

One risk to name honestly: *slate + amber* is itself a common pairing —
Tailwind's slate and amber sit next to each other in every picker [?].
What keeps this from looking like that is not the hue pair but the
things the design system already has — a serif for one language and a
sans for the other, a 608px reading column, 15px as the floor, no
borders — and the fact that every value is solved. A palette is not a
brand; a palette in a system is.

---

## 8 · What changes in `palette.mjs`, and beyond it

**Surfaces.** Replace `BASE` + `elevate()` with a `SURFACE_SPEC` of
OKLCH coordinates, mirrored on `LIGHT_SURFACE_SPEC`, and derive both the
same way. §6.1 shows this changes the dark ramp by nothing measurable
and removes the hue drift; it also makes the dark surfaces re-derivable
in the same terms as everything else, which the file's own comment says
it wants. `elevate()` and its Material citation go.

**The accent is a per-theme token with a per-theme requirement.** Light
`accent` currently carries `need: {}`; it becomes `need: { ui: 3.0 }`,
and the comment block explaining why the amber "does not survive the
flip" is replaced by §4. The ink check's comment — *"the fill is the
same in both themes, so this measures the same twice"* — is no longer
true and comes out; the code under it already measures per theme. Add
one line: the accent against all three surfaces, since on light the
worst case is `surface-2` and on dark it is not the interesting one.

**A CVD line.** §5's simulation is ~20 lines and has no dependency.
Printing `accent ↔ ok ↔ no` ΔE under deuteranopia beside the semantic
tokens would have caught §5.2 in CI instead of in a research pass.
Report, not gate — there is no threshold to defend yet.

**Two hard-coded tints become a token.** `css/style.css` lines 858 and
877 paint the amber tint as `rgb(239 176 92 / 0.14)`; with a per-mode
accent that is the wrong amber half the time. `--c-accent-tint`, set in
the same three places the other tokens are.

**The light `.btn--primary` boundary goes.** It existed because the
amber could not carry itself on a light page. It can now (4.09:1
against the darkest surface).

**`prefers-contrast: more` is re-solved.** Its six hexes (`#d6d1cb
#6b665f #a09a93` dark; `#4d4840 #b3afa9 #5a564f` light) are warm greys
at H 75 and would be the last warm neutrals left in the file.

**Outside the stylesheet**, every place that carries the ground colour:

- `index.html`, `quiz.html`, `results.html` — `<meta name="theme-color"
  content="#13100d">` and the inline `t === "light" ? "#fcfaf7" :
  "#13100d"` on line 21 of each;
- `js/theme.js:25` — `THEME_COLOR = { light: "#fcfaf7", dark: "#13100d" }`;
- `manifest.webmanifest` — `background_color` and `theme_color`;
- `tools/make-icons.mjs` — five hexes on lines 64–95, then `npm run
  icons` so the icons and the link-preview card are drawn on the new
  ground and in the new amber;
- `docs/design-system.md` §1 tables, and §1.2's sentence about the warm
  chroma keeping the neutrals from reading cold, which becomes its
  opposite;
- `docs/components.html`, which renders against the real CSS and needs
  looking at, not editing.

**Not during an exam week**, as `type-contrast.md` §4 already says: this
touches every screen, `test` is what Pages serves, and a push is a
deploy. `npm run verify` before the push, and the §7 audit after.

---

## 9 · Recommendation

**Candidate A — slate ground, amber pair.** The reasons are §2.1 (hue
is the channel the interface does not use), §3.1 (the alternatives keep
the brown, collide with the semantics, or are the framework default),
§4 (the light accent has to be re-solved anyway, so this is the moment),
and §6 (depth cannot come from anywhere else on light). B is the fallback
if the slate reads as blue on a real phone; it costs the temperature
contrast and keeps everything else.

**What would make me wrong.**

1. **The slate reads as blue on an OLED at night.** C 0.014 is at the
   DS's own "looks like a colour" line, chosen there on purpose. If the
   owner sees a blue page, drop to C 0.010 (ΔE from grey 0.010, still
   above the current warm ground's 0.008) or rotate to H 240; the text
   and edge tokens re-solve within 0.002 L.
2. **The light button reads as brown.** `#A55D0C` is a burnt amber, and
   brown is the thing being left. If it does, the window in §4.2 allows
   H 50–55 (a redder, more terracotta fill: `#9F5618`, ink Lc 82) at the
   price of sitting 25–30° from `no`. Check §5 again before choosing it.
3. **The deuteranopia convergence in §5.2 proves real on the results
   screen.** It should not — the accent tint and the ok tint do not
   share a screen — but if a route ever puts a `.chip--accent` beside a
   `.chip--ok`, that is the day to darken light `ok` and accept the
   protanopia cost.
4. **The amber floats.** Bright, warm, on a dark cool ground it gets
   every depth cue at once (§2.1). That is the intent; if a 320px screen
   with three amber marks (button, progress, blank) looks like a
   Christmas tree, the fix is fewer marks, not a duller amber — one
   accent, one job.

### 9.1 The tool's output for candidate A

Produced by a copy of `tools/palette.mjs` differing from the original
only in its import path and its four spec blocks (verified with `diff`).
Both themes, every token, every pair.

```
=== dark ===

surfaces
  surface-0    #0C1117
  surface-1    #181D23
  surface-2    #262B31

tokens — measured against #262B31, the surface closest in lightness
  text-1       #E9ECEF  text  APCA  91/90  WCAG 12.03/7  ok
  text-2       #D0D4DA  text  APCA  76/75  WCAG  9.58/4.5  ok
  text-3       #B5BAC2  text  APCA  61/60  WCAG  7.31/3  ok
  accent       #F1AF5D  ui    WCAG  7.49/3                ok
  accent-text  #F5CE95  text  APCA  77/75  WCAG  9.61/4.5  ok
  on-accent    #1A0F03  —     WCAG  1.32 (no requirement)
  ok           #7CCD8E  ui    WCAG  7.46/3                ok
  no           #E97871  ui    WCAG  5.02/3                ok
  focus        #F4DAB2  ui    WCAG 10.54/3                ok
  hairline     #2F3339  —     WCAG  1.12 (no requirement)
  edge         #71767D  ui    WCAG  3.12/3                ok

  size x weight, against the surface closest in lightness:
  .t-display 28/400 text-1                       Lc  91 /  60  ok
  .t-title 22/400 text-1                         Lc  91 /  65  ok
  .t-lead 19/400 text-1                          Lc  91 /  73  ok
  .option (serif) 17/400 text-1                  Lc  91 /  83  ok
  body prose 16/400 text-1                       Lc  91 /  90  ok
  .t-ui 15/600 text-1                            Lc  91 /  75  ok
  .row__title 15/600 text-1                      Lc  91 /  75  ok
  .listbox__trigger 15/600 text-1                Lc  91 /  75  ok
  .field--multiline 16/400 text-1                Lc  94 /  90  ok
  .feedback__verdict 15/700 text-1               Lc  91 /  68  ok
  .t-meta 15/600 text-2                          Lc  76 /  75  ok
  .t-label 15/600 text-2                         Lc  76 /  75  ok
  .row__sub 15/600 text-2                        Lc  76 /  75  ok
  .row__lead 15/600 text-2                       Lc  76 /  75  ok
  .row__trail 15/600 text-2                      Lc  76 /  75  ok
  .nav__item 15/600 text-2                       Lc  76 /  75  ok
  .stat__label 15/600 text-2                     Lc  76 /  75  ok
  .option__key 15/600 text-2                     Lc  76 /  75  ok
  .chip 15/600 text-2                            Lc  76 /  75  ok
  .btn--quiet 15/600 text-2                      Lc  76 /  75  ok
  .feedback__body 16/400 text-1                  Lc  91 /  90  ok
  .feedback__report 15/600 text-2                Lc  76 /  75  ok
  .listbox__option 15/600 text-1                 Lc  91 /  75  ok

  on-accent on accent   WCAG 9.91  APCA 67  → label must be >=16px at weight 700 (APCA font table)

=== light ===

surfaces
  surface-0    #F8FAFD
  surface-1    #EEF1F5
  surface-2    #E4E8ED

tokens — measured against #E4E8ED, the surface closest in lightness
  text-1       #161A1F  text  APCA  90/90  WCAG 14.20/7  ok
  text-2       #474D55  text  APCA  76/75  WCAG  6.93/4.5  ok
  text-3       #68707A  text  APCA  61/60  WCAG  4.08/3  ok
  accent       #A55D0C  ui    WCAG  4.09/3                ok
  accent-text  #6B420E  text  APCA  76/75  WCAG  7.08/4.5  ok
  on-accent    #F8FAFD  —     WCAG  1.18 (no requirement)
  ok           #2E944E  ui    WCAG  3.12/3                ok
  no           #D65854  ui    WCAG  3.17/3                ok
  focus        #855823  ui    WCAG  4.99/3                ok
  hairline     #D5DAE0  —     WCAG  1.14 (no requirement)
  edge         #7F8389  ui    WCAG  3.10/3                ok

  size x weight, against the surface closest in lightness:
  .t-display 28/400 text-1                       Lc  90 /  60  ok
  .t-title 22/400 text-1                         Lc  90 /  65  ok
  .t-lead 19/400 text-1                          Lc  90 /  73  ok
  .option (serif) 17/400 text-1                  Lc  90 /  83  ok
  body prose 16/400 text-1                       Lc  90 /  90  ok
  .t-ui 15/600 text-1                            Lc  90 /  75  ok
  .row__title 15/600 text-1                      Lc  90 /  75  ok
  .listbox__trigger 15/600 text-1                Lc  90 /  75  ok
  .field--multiline 16/400 text-1                Lc  96 /  90  ok
  .feedback__verdict 15/700 text-1               Lc  90 /  68  ok
  .t-meta 15/600 text-2                          Lc  76 /  75  ok
  .t-label 15/600 text-2                         Lc  76 /  75  ok
  .row__sub 15/600 text-2                        Lc  76 /  75  ok
  .row__lead 15/600 text-2                       Lc  76 /  75  ok
  .row__trail 15/600 text-2                      Lc  76 /  75  ok
  .nav__item 15/600 text-2                       Lc  76 /  75  ok
  .stat__label 15/600 text-2                     Lc  76 /  75  ok
  .option__key 15/600 text-2                     Lc  76 /  75  ok
  .chip 15/600 text-2                            Lc  76 /  75  ok
  .btn--quiet 15/600 text-2                      Lc  76 /  75  ok
  .feedback__body 16/400 text-1                  Lc  90 /  90  ok
  .feedback__report 15/600 text-2                Lc  76 /  75  ok
  .listbox__option 15/600 text-1                 Lc  90 /  75  ok

  on-accent on accent   WCAG 4.82  APCA 76  → label must be >=16px at weight 700 (APCA font table)

✓ both themes: every token and every size pairing meets its requirement
```

The unrounded margins, from the solver: dark text tiers Lc 91.3 / 76.3
/ 61.0; light 90.4 / 75.5 / 60.8; light body prose is 0.4 past 90 at
L 0.217, which is the "a step past" the brief asked for and what the
last light palette lacked. If a wider margin is wanted on that one pair,
L 0.212 measures 91.0 and changes nothing else.

### 9.2 Candidate A, paste-ready

`tools/palette.mjs`:

```js
const SURFACE_SPEC = {
  "surface-0": { L: 0.175, C: 0.014, H: 255 },
  "surface-1": { L: 0.228, C: 0.014, H: 255 },
  "surface-2": { L: 0.286, C: 0.014, H: 255 },
};

const SPEC = {
  "text-1":      { L: 0.941, C: 0.006, H: 255, need: { lc: 90, wcag: 7.0 } },
  "text-2":      { L: 0.869, C: 0.010, H: 255, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.788, C: 0.012, H: 255, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.800, C: 0.125, H:  70, need: { ui: 3.0 } },
  "accent-text": { L: 0.871, C: 0.085, H:  76, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.180, C: 0.030, H:  70, need: {} },
  "ok":          { L: 0.780, C: 0.120, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.700, C: 0.140, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.900, C: 0.060, H:  78, need: { ui: 3.0 } },
  "hairline":    { L: 0.320, C: 0.012, H: 255, need: {} },
  "edge":        { L: 0.564, C: 0.012, H: 255, need: { ui: 3.0 } },
};

const LIGHT_SURFACE_SPEC = {
  "surface-0": { L: 0.985, C: 0.004, H: 255 },
  "surface-1": { L: 0.958, C: 0.006, H: 255 },
  "surface-2": { L: 0.928, C: 0.008, H: 255 },
};

const LIGHT_SPEC = {
  "text-1":      { L: 0.217, C: 0.012, H: 255, need: { lc: 90, wcag: 7.0 } },
  "text-2":      { L: 0.417, C: 0.016, H: 255, need: { lc: 75, wcag: 4.5 } },
  "text-3":      { L: 0.541, C: 0.018, H: 255, need: { lc: 60, wcag: 3.0 } },
  "accent":      { L: 0.550, C: 0.125, H:  60, need: { ui: 3.0 } },
  "accent-text": { L: 0.418, C: 0.085, H:  66, need: { lc: 75, wcag: 4.5 } },
  "on-accent":   { L: 0.985, C: 0.004, H: 255, need: {} },
  "ok":          { L: 0.590, C: 0.140, H: 150, need: { ui: 3.0 } },
  "no":          { L: 0.623, C: 0.160, H:  25, need: { ui: 3.0 } },
  "focus":       { L: 0.500, C: 0.090, H:  68, need: { ui: 3.0 } },
  "hairline":    { L: 0.885, C: 0.010, H: 255, need: {} },
  "edge":        { L: 0.608, C: 0.010, H: 255, need: { ui: 3.0 } },
};
```

`css/style.css`, the `:root` dark set (hex, then the `@supports` OKLCH
override as now):

```css
    --c-surface-0: #0c1117;
    --c-surface-1: #181d23;
    --c-surface-2: #262b31;
    --c-text-1: #e9ecef;
    --c-text-2: #d0d4da;
    --c-text-3: #b5bac2;
    --c-accent: #f1af5d;
    --c-on-accent: #1a0f03;
    --c-accent-text: #f5ce95;
    --c-focus: #f4dab2;
    --c-ok: #7ccd8e;
    --c-no: #e97871;
    --c-ok-tint: rgb(124 205 142 / 0.12);
    --c-no-tint: rgb(233 120 113 / 0.12);
    --c-accent-tint: rgb(241 175 93 / 0.14);
    --c-hairline: #2f3339;
    --c-edge: #71767d;
```

The `@supports (color: oklch(…))` override takes the `SPEC` triples
verbatim — `--c-surface-0: oklch(0.175 0.014 255)` and so on — and now
includes the three surfaces, since they are no longer derived.

The light set, written twice as now (the media query and the
`[data-theme="light"]` attribute). Note that `--c-accent` and
`--c-on-accent` are **present** here, which they are not today:

```css
      --c-surface-0: #f8fafd;
      --c-surface-1: #eef1f5;
      --c-surface-2: #e4e8ed;
      --c-text-1: #161a1f;
      --c-text-2: #474d55;
      --c-text-3: #68707a;
      --c-accent: #a55d0c;
      --c-on-accent: #f8fafd;
      --c-accent-text: #6b420e;
      --c-focus: #855823;
      --c-ok: #2e944e;
      --c-no: #d65854;
      --c-ok-tint: rgb(46 148 78 / 0.12);
      --c-no-tint: rgb(214 88 84 / 0.12);
      --c-accent-tint: rgb(165 93 12 / 0.14);
      --c-hairline: #d5dae0;
      --c-edge: #7f8389;
      color-scheme: light;
```

`theme-color`: dark `#0c1117`, light `#f8fafd`, in the three heads,
`js/theme.js` and the manifest.

### 9.3 Candidate B, paste-ready

B is A with `C: 0` on every neutral and the lightnesses below re-solved;
the accent pair, `focus`, `ok` and `no` are the same tokens. It passes
the same tool run (dark text-1 Lc 92, light 90; all pairs ok; light
accent 4.07:1; ink 4.82 / Lc 76).

| token | B dark: L → hex | B light: L → hex |
| --- | --- | --- |
| surface-0 / 1 / 2 | 0.175 / 0.228 / 0.286 → `#101010 #1C1C1C #2A2A2A` | 0.985 / 0.958 / 0.928 → `#FAFAFA #F1F1F1 #E7E7E7` |
| text-1 | 0.942 → `#ECECEC` | 0.209 → `#181818` |
| text-2 | 0.869 → `#D4D4D4` | 0.412 → `#4B4B4B` |
| text-3 | 0.788 → `#BABABA` | 0.540 → `#6F6F6F` |
| accent-text | 0.870 → `#F5CD95` | 0.416 → `#6B410E` |
| on-accent | as A | 0.985, C 0 → `#FAFAFA` |
| ok / no | as A | 0.587 / 0.622 → `#2C934D #D65853` |
| hairline | 0.320 → `#333333` | 0.885 → `#D9D9D9` |
| edge | 0.562 → `#757575` | 0.607 → `#828282` |

---

## 10 · What I could not check

- **How the slate looks on a phone.** Every number here is a
  measurement of a colour, and the one thing the owner reported — that
  the palette goes shallow *over time* — is not measurable from a
  terminal. The hedges in §9 are the ones to test first, on the phone,
  at night, at the brightness he actually uses.
- **The Machado matrices** were transcribed from memory of the published
  table; the deuteranopia numbers in §5 are consistent with each other
  and with the known red/green collapse, but the constants should be
  compared against DaltonLens before §5 is quoted as fact.
- **`accent-text` against `text-2` on light** (L 0.418 vs 0.417): a link
  in body prose is distinguished from secondary text by hue alone.
  WCAG 1.4.1 asks for more than colour on links inside text unless they
  clear 3:1 against the surrounding text; `a { color: var(--c-accent-text) }`
  has no underline today. Not introduced by this palette, but worth
  measuring while the file is open [?].
- **Whether H 255 at C 0.014 is the right slate or merely a defensible
  one.** Anything from H 240 to 270 solves identically; the choice
  between them is the owner's eye, and the values re-solve in seconds.

---

## Sources

- Livingstone & Hubel 1987 — [J. Neurosci.](https://www.jneurosci.org/content/7/11/3416); Bach, [equiluminance](https://michaelbach.de/ot/col-equilu/)
- Legge, Parish, Luebker & Wurm 1990 — [JOSA A](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-7-10-2002), [PDF](https://legge.psych.umn.edu/sites/legge.psych.umn.edu/files/files/media/legge90_psychophysics_of_reading._xi._comparing_luminance_and_color_contrast.pdf); Knoblauch, Arditi & Szlyk 1991 — [JOSA A](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-8-2-428)
- APCA — [Why APCA](https://git.apcacontrast.com/documentation/WhyAPCA.html), [in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- Chromostereopsis — [Thompson, May & Stone 1993](https://www-users.york.ac.uk/~pt2/ThompsonMayStone1993.pdf), [PMC 2024](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11652407/), [Bach](https://michaelbach.de/ot/col-chromostereopsis/)
- Visual fatigue — [Sci. Rep. 2024](https://www.nature.com/articles/s41598-024-78329-y), [ScienceDirect 2024](https://www.sciencedirect.com/science/article/abs/pii/S0141938224000313)
- Itten's seven contrasts — [review, Part I](https://www.academia.edu/109056855/Ittens_seven_colour_contrasts_a_review_Part_I_Early_contrast_theories_and_the_road_to_Ittens_contrast_theory)
- Radix Colors — [composing a palette](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette), [scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)
- Material 3 surface tint — [Flutter `applySurfaceTint`](https://api.flutter.dev/flutter/material/ElevationOverlay/applySurfaceTint.html)
- Machado, Oliveira & Fernandes 2009 — [colour-science](https://colour.readthedocs.io/en/develop/_modules/colour/blindness/machado2009.html), [DaltonLens](https://daltonlens.org/understanding-cvd-simulation/)
- Tinted neutrals — [shadcn academy](https://www.shadcndesign.com/academy/neutral-colors), [Refactoring UI](https://refactoringui.com/previews/building-your-color-palette)
- The defaults — [Spot the Slop](https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c), [impeccable.style](https://impeccable.style/slop/), [SmoothUI](https://smoothui.dev/blog/ai-design-slop)
