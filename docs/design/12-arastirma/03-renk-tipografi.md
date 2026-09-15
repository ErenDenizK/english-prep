# Colour and typography

Research arm 3 of six. 2026-09-15. The question this arm was given:
the app already solves colour in OKLCH and checks every token against
both WCAG 2 and APCA in CI — **is that state of the art, and what does
a professional system add on top?**

The short answer is that the *architecture* is already at the level of
the systems it would be compared to, and in one respect ahead of them;
and that the *application* of it has a measurable hole, which is not in
the colour at all but in how the contrast requirement is read against
the two typefaces this app actually ships. Section 2.4 is the finding
that matters most in this document.

**Method.** Every number below is either (a) measured here with this
repo's own `tools/color.mjs` and `tools/palette.mjs`, (b) measured in
Chromium 1.56 via Playwright against the repo's own `fonts/*.woff2`,
(c) measured with `fontTools` 4.64 / `pyftsubset` against fonts fetched
from Google Fonts today, or (d) cited. Claims are marked **[S]**
established, **[≈]** my own inference, **[?]** unverified — the same
convention `docs/research/beta1-palette.md` uses.

Reproduction scripts were written to the session scratchpad, not to the
repo. Nothing outside this file was changed.

---

## 0 · The short version

1. **The colour architecture is already right.** Solved OKLCH
   coordinates, a requirement declared per token, both contrast models
   measured in CI, and two themes designed rather than inverted — that
   is what Radix does and what Material and Tailwind do *not* do. §1.
2. **Measured against Radix's own published slate scale, this app has
   independently converged on the same lightness architecture.** Dark
   ground L 0.175 against Radix's 0.178; first ink L 0.941 against
   0.949; third ink 0.788 against 0.769. Light: first ink 0.225 against
   0.241, third 0.490 against 0.502. §1.4.
3. **The one thing a professional ramp has that this one does not is
   *steps in between*.** This app has three surfaces and three inks —
   eleven tokens total. Radix has twelve steps per hue and each one has
   a job. The missing steps are the hover state, the pressed state and
   the separator, which is why "depth" keeps being reported as the
   weakness. §1.3, §1.5.
4. **APCA is not a standard and will not become one soon.** It was
   removed from the WCAG 3 draft in July 2023 and is still out as of the
   April 2026 draft; WCAG 3 is not expected at Recommendation before
   2028–2030. WCAG 2.2 AA is the operative legal bar. §2.
5. **This app's APCA numbers are being read one size step too
   generously.** APCA's font matrix is indexed to a *reference font*
   (Helvetica/Arial), and APCA publishes a documented correction: divide
   the reference x-height by the test font's. Arial's x-height is
   0.528 em; Source Sans 3 is **0.486**, Source Serif 4 is **0.475**.
   Applying APCA's own correction, **21 of 38 `PAIRS` rows fail in dark
   and 20 of 38 in light** — the entire 15px tier, by about 20 Lc. §2.4.
6. **The fix is a size, not a colour.** At weight 600, the second ink
   measures Lc 76–77 in both themes; the corrected matrix wants **16.5px
   of Source Sans 3** for that, not 15px. The one-line tier should be
   **17/600**, not 15/600. §2.4, Öneri.
7. **`--w-measure: 65ch` does not produce 65 characters.** Both shipped
   families default to *tabular* figures, so `0` — the glyph `ch` is
   defined by — is 25 % (sans) / 22 % (serif) wider than their average
   letter. Measured: 65ch = 585px of Source Sans 3, which carries
   **81 Turkish characters per line**, past WCAG 1.4.8's 80 ceiling. §5.2.
8. **Turkish diacritics have no room at the top of the scale.** Measured
   in Chromium: at `--t-display` 36/40 the gap between one line's
   descenders and the next line's Turkish ink is **0px** (English: 6px);
   at `--t-title` 28/32 it is **1px** (English: 5px). §5.3.
9. **Optical sizing is correctly rejected, and now with a number.**
   Instancing the Source Serif 4 variable font shows that across the
   app's entire serif range (18–22px) the shipped opsz-20 static is
   within **2 %** of the optically correct cut, and restoring the axis
   costs **+27.7 KB**. §4.4.
10. **The variable *sans* is the opposite case.** Source Sans 3
    instanced to wght 400–600 and subset identically is **24.3 KB**
    against **28.2 KB** for the two statics it replaces — 3.9 KB
    *smaller*, with every weight in between available. §6.3.
11. **The pairing should not change.** Eight free, self-hostable
    pairings were subset to Latin + the five Turkish glyphs with this
    project's own flags and measured. The current pair is 48.0 KB;
    nothing cheaper is better and nothing better is cheap. §6.2.
12. **`PAIRS` should stop being a hand-written list.**
    `tools/verify-ui.mjs` already walks every rendered text node and
    reads `fontSize` and `fontWeight`; it does not read `color` or the
    effective background. Adding those two properties turns `PAIRS`
    from an authored table into a measured one. §7.

---

## 1 · How serious systems generate a colour ramp

### 1.1 Four architectures, and they are not the same thing

| System | Space | Ramp is generated by | Guarantee it makes |
| --- | --- | --- | --- |
| **Material 3** | HCT (CAM16 hue+chroma, CIE L\* tone) | tone 0–100 per hue; roles are tones, not hexes | Δtone 40 ⇒ ≥ 3:1, Δtone 50 ⇒ ≥ 4.5:1 |
| **Radix Colors** | hand-tuned, 12 steps | each step has a named job | step 11 = Lc 60, step 12 = Lc 90 on step 2 |
| **Tailwind v4** | OKLCH | 50–950, equal lightness across 22 hues | none — "same number = same lightness" |
| **Adobe Leonardo** | any, solved | you give it target *contrast ratios* | exactly the ratios you asked for |
| **Open Props** | OKLCH | steps 0–15, `--gray-hue` / `--gray-chroma` | none |

Sources: [M3 — how the system works](https://m3.material.io/styles/color/system/how-the-system-works),
[Radix — understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale),
[Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4),
[Leonardo](https://github.com/adobe/leonardo),
[Open Props OKLCH beta](https://nerdy.dev/open-props-oklch-palettes-beta).

### 1.2 Perceptual ramp vs contrast-solved ramp — measured

The distinction is not stylistic. A **perceptual ramp** fixes the
*steps* and lets the contrast fall where it may. A **contrast-solved
ramp** fixes the *contrast* and lets the steps fall where they may.

Material's tone rule is the clearest case, and it is testable. I built
a neutral grey ramp at exact CIE L\* values (Material's "tone" *is*
L\*) and measured every pair with this repo's `tools/color.mjs`:

```
  tone  40 on tone  80  Δ40  WCAG 3.80  APCA Lc 49
  tone  50 on tone  90  Δ40  WCAG 3.46  APCA Lc 54
  tone  10 on tone  50  Δ40  WCAG 3.85  APCA Lc 31
  tone   0 on tone  40  Δ40  WCAG 3.24  APCA Lc 22
  tone  60 on tone 100  Δ40  WCAG 3.15  APCA Lc 59
  tone  40 on tone  90  Δ50  WCAG 5.01  APCA Lc 65
```

**Material's guarantee is real — and it is a WCAG 2 guarantee only.**
Every Δ40 pair clears 3:1 (3.15–3.85) and the Δ50 pair clears 4.5:1.
But the *same* Δ40 is worth anywhere from **Lc 22 to Lc 59** depending
on where on the ramp it sits: a 2.7× spread. A system that promises
"Δ40 is enough" is promising something that is true in the model WCAG 2
uses and false in the model that predicts readability.

That is the whole argument for a contrast-solved ramp, in one table.
Leonardo is the pure form of it: you name the ratios and it finds the
colours. This app is already the pure form of it — `SPEC` in
`tools/palette.mjs` declares `need: { lc, wcag }` per token and the run
fails if a token misses.

**[≈] The right architecture is neither, but both, in order.** Solve
the *inks* against a contrast requirement, because they carry the
requirement. Space the *surfaces* perceptually, because their job is to
be distinguishable from each other, not to carry text. This app already
does exactly that: `SURFACE_SPEC` is three equal-ish lightness steps
with no `need`, and `SPEC` is contrast-solved. That is not an accident
of this codebase; it is the correct structure and it is already here.

### 1.3 What Radix's twelve steps are for, and which this app lacks

| Step | Job |
| --- | --- |
| 1 | App background |
| 2 | Subtle background |
| 3 | Component background, normal |
| 4 | Component background, **hover** |
| 5 | Component background, **pressed / selected** |
| 6 | Subtle border, separator |
| 7 | Border of an interactive element |
| 8 | Border, **hover** / strong focus ring |
| 9 | Solid fill — highest chroma in the scale |
| 10 | Solid fill, **hover** |
| 11 | Low-contrast text |
| 12 | High-contrast text |

I verified Radix's published guarantees against this repo's own tool,
using the real hexes from `@radix-ui/colors@3.0.0`:

```
  dark  slate-11 on slate-2   Lc 60.3   WCAG  8.45   (claim: Lc 60)
  dark  slate-12 on slate-2   Lc 95.5   WCAG 15.15   (claim: Lc 90)
  light slate-11 on slate-2   Lc 76.2   WCAG  5.65
  light slate-12 on slate-2   Lc 99.8   WCAG 15.58
  dark  slate-9  on slate-1   WCAG 3.68            (SC 1.4.11: 3.0)
  light slate-9  on slate-1   WCAG 3.22            (SC 1.4.11: 3.0)
```

The guarantees hold, and on dark the scale is tuned to land on Lc 60.3
— a third of a point over target. That is a contrast-solved ramp with a
perceptual spine, and it is what "professional" means here.

**One caveat that matters for this app specifically.** The step-9 3:1
property does *not* hold for Radix's "bright" scales. Measured:

```
  amber-9 #FFC53D on the light page #fdfdfc   WCAG 1.55  Lc 25
  amber-12 #4f3422 ON amber-9 (dark ink)      WCAG 7.21  Lc 68
  amber-11 #ab6400 on the light page          WCAG 4.53  Lc 70
```

Radix ships a light-mode amber fill at **1.55:1 against its own page**
and puts dark ink on it. `docs/research/beta1-palette.md` §4 refused
that and inverted the ink instead, producing this app's burnt-amber
light accent at 4.07:1. **This app is stricter than Radix here, and it
was right to be** — but it is worth knowing that the constraint which
forced the accent pair (`accent: need { ui: 3.0 }`) is a self-imposed
one, not something SC 1.4.11 unambiguously requires of a decorative
gradient fill whose label already meets text contrast (§2.3).

### 1.4 Where this app already sits — measured against all three

L is OKLCH lightness, computed here from the published hexes with the
standard sRGB→OKLab matrices.

| | L (dark ground → up) | steps |
| --- | --- | --- |
| **This app** | 0.175 · 0.228 · 0.286 | ΔL 0.053, 0.058 |
| Radix slate dark 1–3 | 0.178 · 0.213 · 0.252 | ΔL 0.035, 0.039 |
| Apple iOS dark | 0.000 · 0.227 · 0.294 | ΔL 0.227, 0.067 |
| Material `#121212` | 0.182 | — |

| | L (light ground → down) |
| --- | --- |
| **This app** | 0.960 · 0.933 · 0.905 |
| Radix slate light 1–3 | 0.991 · 0.983 · 0.956 |

| ink | this app (dark) | Radix slate (dark) | this app (light) | Radix (light) |
| --- | --- | --- | --- | --- |
| first | 0.941 | 0.949 (step 12) | 0.225 | 0.241 (step 12) |
| second | 0.869 | — | 0.352 | — |
| third | 0.788 | 0.769 (step 11) | 0.490 | 0.502 (step 11) |

Three things fall out.

**The ground is right.** 0.175 against Radix's 0.178 and Material's
0.182. Three independent systems put the dark page within 0.007 L of
each other. Nothing to change.

**The inks are right.** First and third ink land within 0.008–0.021 L
of Radix's corresponding steps in both themes. The app's *second* ink
has no Radix counterpart because Radix does not have one — it has two
text steps, not three, and this app's own design system already records
that `--c-text-3` is used by no rule. The app effectively has two inks
too. §2.4 will argue that at small sizes it can only afford one.

**The light ground is deliberately darker than everyone's.** 0.960
against Radix's 0.991 — three full Radix steps down. That is the cream
decision in `tools/palette.mjs`, taken from an owner report of glare,
and the research supports it (§3.4). It is a real difference from the
reference systems and it should be kept.

**The one real divergence is chroma.** Radix's dark slate runs
C 0.004 → 0.015 at steps 8–10 → 0.003 at step 12: a bell curve, chroma
peaking in the middle of the ramp and dying at both ends. This app
holds C 0.014 *flat* across all three surfaces. [≈] That is why the
surfaces read as "a colour" rather than as depth: at the dark end Radix
deliberately drains chroma so the ground is a ground, and spends it in
the middle where separators and solids live. This app spends it at the
bottom, where it does the least work, and has nothing in the middle to
spend it on.

### 1.5 What this means for this app

- **Do not adopt Material's HCT.** Its guarantee is a WCAG 2 guarantee
  and this project already holds a strictly stronger one. Moving to
  tones would *lower* the bar and add a dependency.
- **Do not adopt Tailwind's 50–950 or Open Props.** They are ramps
  without requirements. The project's own `palette.mjs` is Leonardo's
  idea implemented in 60 lines with zero dependencies, which is the
  right trade for a build-stepless app.
- **Do adopt Radix's *step vocabulary*.** The gap is not the values, it
  is that there are only three surfaces and no named step for hover,
  pressed, separator, or interactive border. Concretely: eight surface
  tokens instead of three, named by job, with the middle ones carrying
  the chroma. That is the single colour change with real payoff.
- **Apply Radix's chroma curve.** Drop `surface-0` to C ≈ 0.006 and let
  the new mid-steps carry C 0.014–0.018. Costs nothing, measurable in
  `npm run color` immediately, and addresses the "shallow" report that
  `beta1-palette.md` §7 said the second hue would *not* fix.

---

## 2 · Contrast standards in 2026

### 2.1 What actually applies

- **WCAG 2.2** is a W3C Recommendation and is the operative bar. SC
  1.4.3 Contrast (Minimum) AA: 4.5:1 for text, 3:1 for large text
  (≥ 18.66px bold or ≥ 24px). SC 1.4.6 AAA: 7:1 / 4.5:1.
- **In the EU**, the European Accessibility Act became enforceable
  **28 June 2025**; the harmonised standard is EN 301 549, and the
  version that is still the legal reference (v3.2.1, 2021) incorporates
  **WCAG 2.1 AA**. EN 301 549 **v4.1.1**, published September 2026,
  adopts WCAG 2.2 — but is not yet the reference for presumption of
  conformance.
  ([AccessibleEU](https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en))
- **WCAG 3.0** is a Working Draft. The March 2026 draft restructured
  "outcomes" into 174 "requirements". Industry expectation for
  Recommendation is **2028–2030**.
  ([W3C WAI](https://www.w3.org/WAI/WCAG3),
  [Eric Eggert](https://yatil.net/blog/wcag-3-is-not-ready-yet))

**[≈] For this app none of the above is a legal question.** It is a
static site with no accounts, served to its author and his friends. The
EAA applies to products and services offered to consumers. The reason
to care is that the user sits an exam in six weeks and reads on a
phone, often standing.

### 2.2 APCA: what it is and what it is not

- **Removed from WCAG 3 in July 2023** for lack of working-group
  support, and still out as of the April 2026 draft. It is not in any
  normative document.
- Myndex's own documentation carries the footer *"NOTICE: Personal
  opinions expressed are the author's and may or may not reflect those
  of the W3 or AGWG."*
  ([WhyAPCA.md](https://github.com/Myndex/SAPC-APCA/blob/master/documentation/WhyAPCA.md))
- Its published levels:

| Lc | For |
| --- | --- |
| 90 | Preferred for fluent body text; ≥ 14px/400 |
| 75 | **Minimum** for columns of body text; ≥ 18px/400 |
| 60 | Minimum for non-column content text; 24px/400 or 16px/700 |
| 45 | Larger/heavier text — 36px/400 or 24px/700 |
| 30 | Absolute minimum for any text; "spot readable" |
| 15 | Non-text |

([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html);
these match `APCA_LC` in this repo's `tools/color.mjs` exactly.)

`tools/palette.mjs` already says all of this in its own comments. The
project's position — APCA is the design bar, WCAG 2 is the conformance
bar, both are checked — is correct and needs no change. What does need
changing is *how* the matrix is read.

### 2.3 SC 1.4.11 Non-text Contrast, precisely

Level **AA**, introduced in WCAG 2.1, unchanged in 2.2. 3:1 against
adjacent colours for:

1. **User Interface Components** — visual information required to
   identify UI components and states, *except* inactive components or
   where the appearance is determined by the user agent.
2. **Graphical Objects** — parts of graphics required to understand the
   content, *except* where a particular presentation is essential.

([Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html))

**[≈] Two consequences for this app.** First, the criterion is about
what is *required to identify* a component — a button's boundary, a
selected state, a focus ring. A decorative gradient fill behind a label
that itself meets text contrast is arguably not the boundary. Second,
and more usefully: the criterion *does* cover the states this app does
not currently have tokens for. Hover and pressed backgrounds that
differ from the resting background by less than 3:1 are fine (state is
also carried by the label and by `aria-pressed`), but a *border* that
is the only signal of a component's edge is squarely in scope. That is
another argument for §1.5's extra steps.

### 2.4 The x-height correction — the finding of this document

APCA's font matrix does not measure text. It measures a **reference
font**: "Helvetica Neue, Helvetica, Fira Sans, Kanit, or Arial". For
any other typeface APCA publishes a correction
([referenceFont.md](https://github.com/Myndex/SAPC-APCA/blob/master/documentation/referenceFont.md)):

> Divide the x-height of the reference font by the x-height of the test
> font […] then multiply minimum font sizes by this ratio.

with a worked example: Helvetica x-height 52, Times New Roman 45,
ratio 1.156, so an 18px reference minimum becomes 21px of Times.

**Measured, from the OS/2 `sxHeight` of the actual font files:**

| family | x-height (em) | cap (em) | ratio vs Arial |
| --- | --- | --- | --- |
| Arial (via Liberation Sans, metric-compatible) | **0.528** | 0.659 | 1.000 |
| **Source Sans 3** | **0.486** | 0.660 | **1.0864** |
| **Source Serif 4** | **0.475** | 0.670 | **1.1116** |
| IBM Plex Sans | 0.516 | 0.698 | 1.023 |
| Inter | 0.546 | 0.728 | 0.967 |
| Noto Sans / Noto Serif | 0.536 | 0.714 | 0.985 |
| Public Sans | 0.517 | 0.723 | 1.021 |
| Literata | 0.507 | 0.701 | 1.041 |
| Lora | 0.500 | 0.700 | 1.056 |
| Newsreader | 0.426 | 0.670 | 1.239 |

Both of this app's faces have a **smaller x-height than the APCA
reference** — 8.0 % smaller for the sans, 10.0 % smaller for the serif.
[?] APCA's "Nutshell" also states the tables assume an x-height ratio
of at least 0.5 of the em; **both shipped faces are below that** (0.486
and 0.475). I could not confirm that sentence in `referenceFont.md`
itself, so it is marked unverified — but the ratio method above is
documented and unambiguous on its own.

I applied the documented correction to the app's real `PAIRS` table,
importing `PAIRS`, `requiredLc` and both themes' tokens from
`tools/palette.mjs` and converting each row's real px to its
reference-equivalent px before reading the matrix:

```
=== dark ===   21 of 38 pairs fail the corrected matrix
  .t-meta        15/600  ref 13.8  Lc 76  need 75 → 97   SHORT 21
  .nav__item     15/600  ref 13.8  Lc 76  need 75 → 97   SHORT 21
  .chip          15/600  ref 13.8  Lc 76  need 75 → 97   SHORT 21
  .t-label       15/600  ref 13.8  Lc 77  need 75 → 97   SHORT 20
  .ring__value   15/600  ref 13.8  Lc 91  need 75 → 97   SHORT  6
  .t-quiet       18/400  ref 16.6  Lc 79  need 75 → 86   SHORT  7
  .btn--primary label (2nd stop) 18/600 ref 16.6 Lc 61 need 60 → 67  SHORT 6
  … (all fifteen 15/600 rows, plus the two quiet-sentence rows)

=== light ===  20 of 38 pairs fail
  .t-meta        15/600  ref 13.8  Lc 77  need 75 → 97   SHORT 20
  .option (serif) 18/400 ref 16.2  Lc 85  need 75 → 89   SHORT  3
  .t-quiet       18/400  ref 16.6  Lc 83  need 75 → 86   SHORT  3
  body prose     18/400  ref 16.6  Lc 85  need 75 → 86   SHORT  0
```

**This is the same defect the design system already documented one
level up.** `docs/design-system.md` §2.2 tells the story of a census
that found 54 % of rendered characters at 13px and 11px needing Lc 113
and 117 against a ceiling of 107, and killed those steps. The
correction says the story did not go far enough: **15/600 in the second
ink needs Lc 97 of Source Sans 3**, and Lc 97 is not reachable on the
cream ground at all.

**What it takes to fix, by size** (solved against the app's real
measured Lc values):

| pair | measured Lc | smallest legal Source Sans 3 size |
| --- | --- | --- |
| second ink, weight 600 | 76–77 | **16.5px** |
| first ink, weight 600 | 85–91 | **16px** |
| first ink, weight 400 | 85 | **18.5px** |
| second ink, weight 400 | 79–83 | **18.5–19.5px** |

So: the 15px tier has to become **17px** (the first size at or above
16.5 that stays on the 4px grid with a 24px line-height), or the second
ink has to leave small sizes entirely and the tier becomes 16px in the
first ink. Both are in `## Öneri`.

**Honest counterweight.** None of this is a WCAG 2 failure. The same
`.t-meta` pair measures **8.44:1** in light and comfortably clears AA.
This is a self-imposed bar, and the project chose it deliberately. The
point is only that a bar you have chosen should be applied as its
author specifies, or the green run is telling you something that is not
true — which is precisely the argument `palette.mjs`'s own header makes
about the first draft that "passed WCAG everywhere and failed APCA
everywhere".

### 2.5 What a solo project should actually enforce

1. **WCAG 2.2 AA, absolutely, in CI.** 4.5:1 text, 3:1 non-text. Cheap,
   stable, legally meaningful, already done.
2. **APCA as the design bar, with the x-height correction applied.**
   Otherwise it is decorative.
3. **Not WCAG 2 AAA (7:1) as a hard gate.** The app currently requires
   `wcag: 7.0` for `text-1`. That is a fine goal but it is the
   requirement that makes the cream ground hardest to solve, and AAA
   conformance is not claimable page-wide anyway.
4. **The rendered pair, not the token.** This is §7 and it is the
   highest-leverage change in this document after §2.4.

---

## 3 · Dark mode done properly

### 3.1 Why naive inversion fails

Three separate reasons, and they compound.

- **Polarity is not symmetric perceptually.** Piepenbrock et al. (2013,
  *Ergonomics*) found reading ~26 % faster with positive polarity (dark
  on light) in well-lit conditions [S]. NN/g's summary: *"In people
  with normal vision […] visual performance tends to be better with
  light mode, whereas some people with cataract and related disorders
  may perform better with dark mode."*
  ([NN/g](https://www.nngroup.com/articles/dark-mode/))
  WCAG 2's contrast ratio is polarity-blind — it returns the same
  number either way — which is exactly the gap APCA exists to close.
- **Halation.** Light text on a dark ground blooms for readers with
  uncorrected astigmatism, which is common
  ([BOIA](https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone)).
  Maximal contrast makes it worse, not better.
- **Chroma does not survive inversion.** A saturated accent that reads
  as a mid-tone on white reads as a glare source on near-black. The
  standard remedy is to desaturate accents 20–30 % for dark
  ([UX Planet](https://uxplanet.org/8-tips-for-dark-theme-design-8dfc2f8f7ab6)),
  which is a different colour, not the same colour inverted.

`tools/palette.mjs` already states "Not an inversion" and solves each
theme independently, including the ink-polarity flip on the accent.
That is the correct architecture and matches Radix, whose dark scales
are separately designed to APCA targets rather than mirrored (§1.3).

### 3.2 Elevation by lightness — real values

"Elevation by lightness" means: in dark mode a shadow is invisible, so
the thing that says *nearer* is a lighter plane. Every major system
implements it, with quite different step sizes (all L values computed
here from published hexes):

| System | base → +1 → +2 | ΔL |
| --- | --- | --- |
| Apple iOS dark | `#000000` · `#1C1C1E` · `#2C2C2E` → L 0.000 · 0.227 · 0.294 | 0.227, 0.067 |
| Radix slate dark | L 0.178 · 0.213 · 0.252 | 0.035, 0.039 |
| **This app** | L 0.175 · 0.228 · 0.286 | **0.053, 0.058** |
| Material 2 | `#121212` + white overlay, 2 %–12 % by dp | ≈ 0.02–0.05 |

Material 2 expressed this as a semi-transparent white overlay whose
opacity rises with dp (4 % at 2dp, 8 % at 4dp, 12 % at 8dp); Material 3
replaced the overlay with `surfaceTint`. Apple exposes it as two named
sets, *base* and *elevated*, and switches automatically when an
interface comes to the foreground
([Apple HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)).
Apple deliberately does not publish guaranteed hex values.

**[≈] This app's steps are about 50 % larger than Radix's and about
right against Apple's second step.** That is defensible with three
surfaces; it becomes wrong if §1.5's extra steps are added, because
eight steps across the same range means ΔL ≈ 0.02 and the whole ramp
has to be respaced. If the surface vocabulary grows, `SURFACE_SPEC`
should be generated from an L range and a count, not hand-listed.

### 3.3 True black on OLED

Three competing effects, all real:

- **Power.** A true-black pixel on OLED draws essentially zero. Measured
  reductions of **11–38 %** in average OLED power draw switching light →
  dark at 50 % brightness, app-dependent
  ([summary](https://bejamas.com/blog/does-dark-mode-save-battery)).
  `#121212` still draws current, just less.
- **Smear.** [?] The commonly cited OLED artefact is that near-black
  greys transition more slowly than pure black, producing smear on
  scroll. I found no measurement of this in the time available and it
  is marked unverified.
- **Glare and halation.** This is the one with actual guidance behind
  it. Material's whole reason for `#121212` rather than `#000000` is
  that maximal contrast on pure black is harsher, and that it leaves no
  room to express elevation *below* the base surface.

**[≈] For this app, `#000000` is the wrong choice and the current
L 0.175 ground is the right one**, for a reason specific to the
product: the app is read in 5–10 minute standing sessions, often
indoors, on a screen that is also showing a cream theme half the time.
The power saving of moving 0.175 → 0.000 is small (the ground is
already dark), and it would cost the one thing the ramp needs most,
which is room below the cards.

### 3.4 Warm or cool ground

There is no research that settles this; what exists is an argument the
project has already had and won on measurement.
`docs/research/beta1-palette.md` §1 found every non-semantic token
sitting in an 11° hue band around the amber, diagnosed "one hue,
therefore one channel", and moved the ground to cool slate (H 255) so
the amber has a temperature to be warm *against*.

The light side went the other way for a different reason, also recorded:
the owner called a cool near-white "aşırı göz yoruyor", which is glare,
and the ground became cream at H 85, L 0.960. Both decisions are
independently supported:

- **Cool dark ground**: Radix's slate dark sits at H 248–286, i.e. cool,
  at C 0.004–0.015. This app is at H 255, C 0.014 — the same family,
  about 2–3× the chroma at the ground (§1.4's real divergence).
- **Warm light ground**: Radix ships `sand` (light 1 `#fdfdfc`, 2
  `#f9f9f8`) precisely for this, and APCA's own guidance treats Lc 90 as
  *preferred* for body text rather than a maximum — there is no
  requirement to sit at the top of the range on light.

**Nothing to change here.** This is the one part of the palette that was
arrived at by user feedback plus measurement, and it should be left
alone.

### 3.5 How the reference systems compare, in one line each

- **Material 3**: tones, generated from one seed; dark is tone 80 where
  light is tone 40. Guarantees WCAG 2 ratios only (§1.2). Elevation by
  `surfaceTint`.
- **Apple HIG**: semantic tokens, base and elevated sets, no published
  hexes, automatic switching, system-wide increase-contrast setting.
- **Radix**: twelve designed steps per hue per theme, APCA targets on
  steps 11/12, chroma bell curve, step 9 at 3:1 for neutral scales and
  deliberately not for bright ones.

---

## 4 · Type systems

### 4.1 Modular scale vs hand-picked steps

The honest finding here is that **this app's hand-picked scale is
already a modular scale, to within rounding**, and nobody noticed.

| step | shipped | 18 × 1.25ⁿ | error |
| --- | --- | --- | --- |
| display | 36 | 35.16 | +2.4 % |
| title | 28 | 28.13 | −0.4 % |
| lead | 22 | 22.50 | −2.2 % |
| body | **18** | 18.00 | — |
| meta | 15 | 18 ÷ 1.2 = 15.00 | 0 % |

A major third (1.25) above body, one minor third (1.2) below it. So
"should this app use a modular scale?" is already answered: it does.
Polaris uses exactly 1.2 and rounds to the 4px grid
([Polaris typography tokens](https://polaris.shopify.com/design/typography/typography-tokens));
Utopia's default is 1.2 at the small end and 1.25 at the large end
([Utopia](https://utopia.fyi/blog/css-modular-scales/)) — this app is
Utopia's ratios with the poles swapped.

**[≈] The value of naming it is not the arithmetic, it is the
constraint.** Utopia's own argument is that named steps stop "an
infinite number of magic number font sizes infiltrating codebases".
This app enforces that with a different mechanism — `verify-ui.mjs`
fails a screen that renders five sizes — which is stronger, because it
measures the rendered page rather than the stylesheet.

### 4.2 What real systems actually ship

**Material 3** (15 roles, 5 families × 3 sizes; source: baseline
type scale):

| Role | px | line-height | tracking | weight |
| --- | --- | --- | --- | --- |
| Display L / M / S | 57 / 45 / 36 | 64 / 52 / 44 | −0.25 / 0 / 0 | 400 |
| Headline L / M / S | 32 / 28 / 24 | 40 / 36 / 32 | 0 | 400 |
| Title L / M / S | 22 / 16 / 14 | 28 / 24 / 20 | 0 / 0.15 / 0.1 | 400 / 500 / 500 |
| Body L / M / S | 16 / 14 / 12 | 24 / 20 / 16 | 0.5 / 0.25 / 0.4 | 400 |
| Label L / M / S | 14 / 12 / 11 | 20 / 16 / 16 | 0.1 / 0.5 / 0.5 | 500 |

Note: Material's *body large* is 16/24 — a ratio of 1.50. Its tracking
goes **positive** as size falls (0.5 at body small) and negative at
display. This app does the opposite at display (−0.02em at 36px), which
agrees, and does nothing at small sizes, which does not.

**IBM Carbon**, productive set
([type sets](https://carbondesignsystem.com/elements/typography/type-sets/),
cross-checked against
[`packages/type/scss/_styles.scss`](https://github.com/carbon-design-system/carbon/blob/main/packages/type/scss/_styles.scss)):

| token | px | line-height | weight | tracking |
| --- | --- | --- | --- | --- |
| label-01 / helper-text-01 | 12 | 16 (1.333) | 400 | 0.32px |
| body-01 | 14 | 20 (1.42857) | 400 | 0.16px |
| heading-01 | 14 | 20 | 600 | 0.16px |
| body-02 | 16 | 24 (1.5) | 400 | 0 |
| heading-02 | 16 | 24 | 600 | 0 |
| heading-03 | 20 | 28 (1.4) | 400 | 0 |
| heading-04 | 28 | 36 (1.28572) | 400 | 0 |
| heading-05 | 32 | 40 (1.25) | 400 | 0 |
| heading-06 | 42 | ×1.199 | 300 | 0 |
| heading-07 | 54 | ×1.19 | 300 | 0 |

Carbon shows the same law this app's design system states: **the
line-height ratio falls as size rises** — 1.42857 at body-01 down to
1.19 at heading-07. This app runs 1.56 at body down to 1.11 at display,
i.e. a steeper version of the same curve.

**Polaris**: all font sizes on a 1.2 ratio, all line-heights multiples
of 4px, primitive tokens in increments of 100 with `font-size-100` as
base, plus a semantic layer on top.

**Apple Dynamic Type**: eleven text styles (Large Title → Caption 2),
**body = 17pt at the default "Large" setting**, and the whole scale
shifts across twelve size categories the user chooses, up to the
accessibility sizes. Apple does not publish a static table because the
table is not static. [?] I could not retrieve the full leading/tracking
table for the Large setting within this session — the page that carries
it was not reachable.

**What this app should take from all four**: nothing structural. Five
steps with at most four on a screen is a *tighter* system than any of
these and is right for a two-screen app. The one borrowable detail is
**Material's positive tracking at small sizes**, which is a real
legibility gain and costs one line of CSS (§5.3 has a second reason to
want it).

### 4.3 Fluid type — `clamp()`

**When it helps**: when one layout must serve 320px and 1600px and the
headings would otherwise be either tiny on desktop or enormous on
mobile.

**When it hurts**, and this is the documented failure: text sized in
`vw` alone does not respond to browser zoom, because the viewport width
in CSS pixels does not change when you zoom. That is WCAG failure
**F94** against SC 1.4.4 Resize Text. The mitigation is a `rem`
component inside the `clamp()` — `clamp(1.5rem, 1rem + 2.5vw, 3rem)` —
and a rule of thumb that if `max ≤ 2.5 × min` the text will pass 1.4.4
on modern browsers
([Smashing Magazine](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/),
[Utopia WCAG warnings](https://www.trysmudford.com/blog/utopia-wcag-warnings/)).

**Reject for this app, and the reason is specific.** The reading column
is 608px at every window width by design (`docs/design-system.md` §7.3;
`--w-frame` changes, `--w-page` does not). A fluid scale interpolates
between viewport poles; here there is only one pole that matters,
because the prose never gets wider. Fluid type would vary the size of
text inside a column whose width is constant — which is the one case
where it does nothing but add risk. The step from 320px to 390px is 70
CSS pixels and the current scale handles it by wrapping, which is
correct.

### 4.4 Optical sizing — measured, and rejected with a number

`docs/design-system.md` §2.5 records that shipping static instances
makes `font-optical-sizing` a no-op, and estimates the cost of
restoring it at "roughly +20 KB per weight". I measured it.

Source Serif 4's variable font carries `opsz` **8 → 60** (default 20)
and `wght` 200 → 900. Instancing it at wght 400 and reading the metrics
at each optical size:

| opsz | advance `n` (em) | x-height (em) | stem of `l` (em) |
| --- | --- | --- | --- |
| 8 | 0.680 | 0.508 | 0.272 |
| 14 | 0.643 | 0.492 | 0.260 |
| 18 | 0.618 | 0.481 | 0.252 |
| **20 (the shipped static)** | **0.606** | **0.475** | **0.248** |
| 32 | 0.592 | 0.468 | 0.238 |
| 60 | 0.558 | 0.452 | 0.214 |

The app sets the serif at **18px and 22px only** (English has a floor of
18px; `--t-lead` is 22). Against the shipped opsz-20 cut:

- at 18px the correct cut is 2.0 % wider in advance and 1.3 % larger in
  x-height;
- at 22px the difference is under 0.5 %.

**Cost, measured** — same subset range, same `pyftsubset` flags as
`css/fonts.css`:

| build | bytes | vs shipped |
| --- | --- | --- |
| shipped static Source Serif 4 400 | 19,116 | — |
| variable, wght pinned 400, opsz 8–60 free | **47,476** | **+28,360 (+27.7 KB)** |
| variable, wght 400–600, opsz free | 78,644 | +59,528 |
| variable, full axes | 118,508 | +99,392 |

**+27.7 KB to buy a 2 % metric change across the app's entire serif
range.** Reject, and the design system's existing note should be
updated from "roughly +20 KB per weight" to this measurement.

**[≈] A second reason to reject, which is new.** APCA's font matrix is
indexed on *CSS font-weight*. A real optical-size cut changes stem
weight without changing the weight value — opsz 8 has a stem 9.7 %
heavier than opsz 20 at the same `wght 400`. Turning on `opsz` would
make `PAIRS` measure a fiction in the opposite direction from §2.4.
Static instances keep the model honest.

---

## 5 · Reading typography, specifically

The core screen is a **199-character English paragraph** (measured over
all 217 shipped paragraphs: mean 199.9, median 204, p90 280, max 373;
mean 36.5 words) and a **377-character Turkish explanation** (241
explanations: mean 385.0, median 377, p90 476, max 571), on a phone.

### 5.1 Measure, measured

Average advance per character, measured in Chromium against the repo's
own woff2 files and the app's own corpus strings:

| | px per character at 18px |
| --- | --- |
| Source Serif 4 400, English paragraph | **8.193** |
| Source Sans 3 400, Turkish explanation | **7.187** |
| Source Sans 3 400, English | 7.199 |

Characters per line at the app's real widths:

| usable width | English serif | Turkish sans |
| --- | --- | --- |
| 288px (320px viewport − gutters) | **35.2** | **40.1** |
| 581px (the 65ch cap, see §5.2) | 70.9 | **80.8** |
| 608px (the reading column) | **74.2** | 84.6 |

And the width needed to hit a target:

| target CPL | serif 18px | sans 18px |
| --- | --- | --- |
| 45 | 369px | 323px |
| 55 | 451px | 395px |
| 65 | 533px | 467px |
| 75 | 614px | 539px |

**The evidence on what to aim for.** Dyson & Haselgrove (2001) and
Dyson & Kipping (1998) found intermediate line lengths around **55 CPL**
giving the best combination of speed and comprehension for screen
reading; the conventional band is **50–75 CPL**
([Dyson, PDF](https://stu.westga.edu/~ssynan1/literacy/Dyson.pdf),
[ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586)).
Baymard gives 50–75 for desktop and **30–50 for mobile portrait**
([Baymard](https://baymard.com/blog/line-length-readability)). WCAG
1.4.8 (AAA) caps at **80 characters**.

**So the 320px case is fine and the wide case is not.** At 320px the app
delivers 35 (English) and 40 (Turkish) characters — inside Baymard's
mobile band, below Dyson's optimum, and unfixable without shrinking
type, exactly as `docs/design-system.md` §2.3 concluded. That conclusion
stands. What §2.3 did not check is the other end.

### 5.2 `65ch` is not 65 characters — measured

`--w-measure: 65ch`, applied to `.prose`.

The CSS `ch` unit is **the advance of the digit zero**. Both shipped
families ship **tabular figures as their default set** — `css/fonts.css`
documents this at length, including that `pnum` was dropped to save
~3 KB. A tabular zero is much wider than an average letter:

| | `ch` at 18px | average letter at 18px | overshoot |
| --- | --- | --- | --- |
| Source Sans 3 | 9.00px | 7.187px | **+25.2 %** |
| Source Serif 4 | 10.00px | 8.193px | **+22.1 %** |

Therefore `65ch` resolves to **585px** for the sans and **650px** for
the serif, and:

- Turkish prose is capped at 585px → **81 characters per line**, past
  WCAG 1.4.8's 80-character ceiling and well past Dyson's 55.
- English prose is capped not by `65ch` (650 > 608) but by the reading
  column itself → **74 characters per line**.

Neither is a disaster; both are the wrong side of every guideline the
design system cites, and the token says "65". The fix is that CSS has no
average-advance unit, so the number has to be solved per family:

```css
--w-measure-tr: 26rem;   /* 416px → 58 characters of Source Sans 3  */
--w-measure-en: 29rem;   /* 464px → 57 characters of Source Serif 4 */
```

(at the 16px root; 26rem × 7.187/18×16 ≈ 58 CPL, 29rem likewise ≈ 57.)
Two tokens rather than one is not an inconsistency — the app already has
a two-family rule and the two families have different average advances,
so one number cannot serve both. This binds only above ~470px, so the
phone layout is untouched.

### 5.3 Line height and the Turkish diacritics — measured

This is the most product-specific measurement in this document.
Measured in Chromium against the shipped fonts, using the real
half-leading arithmetic (`half = (line-height − fontBoundingBox) / 2`)
and the actual ink extents of a realistic Turkish string
(`İngilizce Öğrenme`, `değişikliğiçğp`) against an English one
(`Changing quickly`):

| token | px / lh | headroom above Turkish ink | headroom, English | gap to next line, TR | gap, EN |
| --- | --- | --- | --- | --- | --- |
| `--t-display` | 36 / 40 | **0.5px** | 5.5px | **0px** | 6px |
| `--t-title` | 28 / 32 | **1.0px** | 5.0px | **1px** | 5px |
| `--t-lead` | 22 / 28 | 2.0px | 5.0px | 2px | 5px |
| `.option` | 18 / 24 | 2.5px | 4.5px | 3px | 5px |
| `--t-meta` | 15 / 20 | **1.5px** | 3.5px | 3px | 5px |
| `--t-body` sans | 18 / 28 | 4.5px | 6.5px | 8px | 10px |
| `--t-body` serif | 18 / 28 | 4.5px | 6.5px | 7px | 9px |

**Three findings.**

1. **At `--t-display` a two-line Turkish heading has zero pixels between
   one line's descenders and the next line's diacritics.** English has
   six. The app's headings are Turkish (`js/education.js` sets lesson
   titles), and `text-wrap: balance` makes two-line headings normal
   rather than exceptional. The display and title line-heights were
   chosen on a 4px grid and against Latin; Turkish needs one grid step
   more: **display 36/44, title 28/36**.
2. **At `--t-meta` 15/20 there is 1.5px of headroom above `İ` and `Ğ`.**
   The half-leading there is *negative* (−0.5px: the 21px content box is
   larger than the 20px line box), so any ancestor with `overflow:
   hidden` whose box stops at the line box will shave the dot off `İ`.
   §2.4 already argues this tier should be 17px; at 17/24 the headroom
   becomes comfortable.
3. **Body is fine.** 18/28 gives 4.5px of headroom and a 7–8px inter-line
   gap in Turkish. The 1.56 ratio that looked generous against Carbon's
   1.43 is doing real work for this language.

**Line-height for mixed Latin/Turkish.** There is no research specific
to Turkish line spacing that I could find [?]. What is established is
the general rule — WCAG 1.4.8 (AAA) requires at least **1.5** within
paragraphs — and the mechanical fact measured above: Turkish ink is
taller than English ink at the same size because `Ğ ğ İ Ö Ü Ş` add a
mark above the cap line or below the baseline. Measured at 18px sans,
the ink ascent of `Ğ` is **16px** against **12px** for `Hx`: the breve
sits **33 % above cap height**.

### 5.4 Uppercase, and the `lang` trap

Two independent reasons not to uppercase Turkish, both already in the
design system, both now with numbers behind them:

- **Case mapping is language-conditional.** CSS Text 3 makes `i` → `İ`
  under `lang="tr"`, so an English string uppercased inside the Turkish
  page renders `SİMPLE`. Verified in Chromium for this project.
  ([Turkish i in computing](https://en.wikipedia.org/wiki/Dotted_and_dotless_I_in_computing))
- **The ink box grows by half.** Measured at 18px Source Sans 3:
  `DEĞİŞİKLİK` has an ink box of 16px ascent + 5px descent = **21px**;
  `CHANGE` has 13 + 1 = **14px**. The same all-caps treatment is 50 %
  taller in Turkish. Any component sized against Latin caps will clip.

The design system's rule — prefer letter-spacing and weight over caps —
is correct and the measurement supports it.

### 5.5 Minimum body size on mobile

The 16px floor that circulates as folklore does have a basis: at typical
phone holding distances of **25–35 cm**, 16px is at the lower edge of
comfortable reading for normal vision, and readers with reduced acuity
struggle at 14–15px. The systematic review of font size for older adults
on mobile
([Frontiers in Psychology, 2022](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.931646/full))
finds larger is preferred but declines to name a universal number.

**This app is at 18px for prose, which is above every recommendation**,
and §2.4's correction says that is not generosity — it is the minimum
once the x-height of Source Sans 3 is taken into account. 18px of Source
Sans 3 has the x-height of **16.6px of Arial**. The app is running a
16.6px-equivalent body, not an 18px one.

---

## 6 · Pairing a serif with a sans

### 6.1 What makes a pairing work

Two coherent strategies, and they are opposites:

- **Superfamily.** One designer, shared skeleton, matched x-height, cap
  height, baseline and proportions. Harmony by construction. Source Sans
  / Source Serif, IBM Plex Sans / Plex Serif, Noto Sans / Noto Serif,
  Roboto / Roboto Serif.
  ([Google Fonts Knowledge](https://fonts.google.com/knowledge/choosing_type/pairing_typefaces_within_a_family_superfamily))
- **Contrast pairing.** Two unrelated faces chosen so their differences
  are deliberate: era, proportion, contrast. Needs an eye and a reason.

The single mechanical test is **x-height agreement** — a serif whose
x-height is far from the sans's will look like a different size at the
same `font-size`. Measured (§2.4 table): Source Sans 3 0.486 vs Source
Serif 4 0.475 — **2.3 % apart**. IBM Plex Sans and Plex Serif are
**identical** at 0.516. Inter (0.546) against Literata (0.507) is 7.7 %
apart, which is visible.

**Where a serif earns its place in an interface.** Not as decoration and
not as a heading face. It earns it when it carries a *distinction the
reader needs to make*, and this app has the textbook case: the serif is
English, the sans is Turkish, so the typeface tells the learner which
language they are looking at before they read a word. That is the
strongest justification for a serif in a UI I can construct, and it is
already the rule.

### 6.2 Candidates, with real bytes

Every candidate below was fetched from Google Fonts today and subset
with **this project's exact `pyftsubset` invocation** — Google's `latin`
range plus `U+011E-011F, U+0130, U+015E-015F` — and the same layout
feature list from `css/fonts.css`. Sizes are the resulting woff2 files.

| pairing | sans 400 | sans 600 | serif 400 | total |
| --- | --- | --- | --- | --- |
| Noto Sans + Noto Serif | 13,448 | 13,884 | 14,932 | **42.3 KB** |
| Public Sans + Lora | 13,064 | 13,048 | 20,500 | 46.6 KB |
| Public Sans + Literata | 13,064 | 13,048 | 19,044 | 45.2 KB |
| Public Sans + Newsreader | 13,064 | 13,048 | 21,036 | 47.1 KB |
| **Source Sans 3 + Source Serif 4 (current)** | **14,444** | **14,456** | **19,116** | **48.0 KB** |
| IBM Plex Sans + IBM Plex Serif | 19,572 | 20,592 | 17,704 | 57.9 KB |
| Inter + Literata | 19,876 | 20,508 | 19,044 | 59.4 KB |
| Inter + Source Serif 4 | 19,876 | 20,508 | 19,116 | 59.5 KB |

**A reproducibility result worth recording**: re-deriving the current
three faces from today's Google Fonts TTFs produced files that are
**byte-identical** to the ones in `fonts/` — 14,444 / 14,456 / 19,116.
The build documented in `css/fonts.css` reproduces exactly, two years
of font version bumps notwithstanding.

**Recommendation: keep the pair.** The two candidates that beat it on
bytes lose on the thing the pairing exists for.

- **Noto Sans + Noto Serif** is 5.7 KB cheaper but the two faces have
  *identical* x-height, cap height and metrics (0.536 / 0.714 / 1.069 for
  both) — which is excellent superfamily engineering and terrible for
  this app, because the whole point is that the reader can tell the two
  languages apart at a glance. Noto's serif is a Times-ish
  transitional with low contrast; side by side with Noto Sans at the
  same size it is a weak signal.
- **Public Sans + Literata** is 2.8 KB cheaper; Literata is a fine
  reading serif, but Public Sans (x-height 0.517) against Literata
  (0.507) is a contrast pairing not a superfamily, and the app would
  gain nothing it does not have.
- **IBM Plex** is the strongest alternative on quality — identical
  x-heights, a genuinely distinct serif, designed together — at **+9.9
  KB** and a complete visual restart. Worth knowing about if the
  redesign goes to a new face anyway; not worth it on its own.

**[≈] Newsreader is a trap.** Its x-height is 0.426 em — the smallest
here by a wide margin, and a ratio of **1.239** against Arial. Applying
§2.4's correction, an 18px Newsreader body would need a matrix reading
at 14.5px reference, which is Lc 100+ territory. It is a beautiful face
and it would fail this app's own contrast bar at every size it ships.

### 6.3 Variable fonts

The serif case is rejected in §4.4. The **sans case is the opposite**,
and this is a free win:

| build | bytes |
| --- | --- |
| Source Sans 3 statics 400 + 600 (shipped) | 28,900 |
| Source Sans 3 variable, instanced `wght=400:600`, same subset | **24,912** |

**3,988 bytes smaller**, one file instead of two, one `@font-face`
instead of two, and every weight between 400 and 600 available — which
matters because §2.4's remedy for the small tier is either more size or
more weight, and a 550 is currently unreachable.

The metric-matched fallback in `css/fonts.css` is per-weight
(`size-adjust: 92.91%` at 400, `89.06%` at 600) and would need one entry
per weight actually used, which is unchanged in difficulty.

[?] Browser support for `font-variation-settings` / variable woff2 is
universal in the browsers this app targets, but I did not test the
partial-instance file in a real browser in this session — only measured
it.

---

## 7 · What to change about `PAIRS`

`PAIRS` is a good idea implemented in the only way available at the time.
Its own header states the failure mode: *"Adding a rule to
`css/style.css` means adding its row here; a pair that is not listed is
not checked, which is the one way this can go stale."*

**Audited today**: `css/style.css` has **39 rules that set `font-size`**
across **46 distinct selectors**; `PAIRS` has **38 rows**. Coverage is
essentially complete right now. The list is not stale. It is *fragile*,
and it is fragile in a way that has a mechanical fix.

`tools/verify-ui.mjs` (lines ~245–262) already walks every text node on
every screen it lands on, skips hidden and zero-box nodes, and reads:

```js
const style = getComputedStyle(parent);
const size   = Math.round(parseFloat(style.fontSize));
const weight = Number(style.fontWeight);
```

It does **not** read `style.color`, and it does not resolve the
effective background. Those are the only two things missing. With them,
the sweep knows the real rendered pair — selector, size, weight,
foreground, background — for every character on every screen at every
viewport, and `PAIRS` stops being an authored list and becomes an
artefact the sweep produces.

Concretely, three changes, in order of value:

1. **Apply APCA's x-height correction inside `requiredLc()`.** Add a
   per-family ratio (`sans: 1.0864`, `serif: 1.1116`, derived from OS/2
   `sxHeight` against Arial's 0.528) and convert `px` to
   reference-equivalent px before reading `FONT_MATRIX`. Ten lines.
   This is what makes every other number in the file mean what it says.
   It will fail the run until the type scale changes — which is the
   point.
2. **Add the family to each `PAIRS` row.** Today the serif rows are
   identified only by the string `"(serif)"` in `where`. With two faces
   at different x-heights, family is part of the requirement.
3. **Generate the rows from the sweep.** Have `verify-ui.mjs` emit the
   rendered pair set to a JSON file, and have `palette.mjs` read it when
   the file exists (falling back to the hand list so `npm run check`
   still works without a browser). The sweep already runs four viewports
   and a full learner journey; it sees more than the stylesheet does,
   including every utility-class override that `PAIRS` structurally
   cannot see.

One thing **not** to change: the two-model check. Measuring both WCAG 2
and APCA, in both themes, and failing the run on either, is the part of
this system that is genuinely ahead of Material and Tailwind. Keep it.

---

## Öneri

### Colour

1. **Keep the architecture.** Solved OKLCH coordinates, per-token
   requirements, both models in CI, two designed themes. It matches
   Radix and beats Material and Tailwind on guarantee strength. No
   dependency, no build step, 60 lines.
2. **Grow the surface vocabulary from 3 to 8, named by job**, on
   Radix's model — `page`, `subtle`, `component`, `component-hover`,
   `component-pressed`, `separator`, `border`, `border-hover`.
   Generate them from an L range and a count rather than hand-listing,
   because with eight steps the spacing is ΔL ≈ 0.02 and hand-tuning
   eight values twice is how a theme drifts.
3. **Apply a chroma curve.** `surface-0` down to C ≈ 0.006, mid-steps at
   C 0.014–0.018, inks back down to C 0.006. This is what Radix does
   (measured: 0.004 → 0.015 → 0.003) and it is the one structural
   difference left between the two palettes.
4. **Do not change the ground hues.** Cool slate dark, cream light. Both
   came from owner feedback plus measurement and both are supported.
5. **Consider relaxing `text-1`'s `wcag: 7.0` to 4.5.** AAA is not
   claimable page-wide, it is the binding constraint on the cream
   ground, and APCA is the real bar here. Keep 4.5 as the floor.

### Type scale

The scale needs one change, and it is forced by §2.4 rather than by
taste. Sizes are Source Sans 3 unless marked.

| token | px / line-height | weight | ink | ref-equivalent | matrix needs | measured |
| --- | --- | --- | --- | --- | --- | --- |
| `--t-display` | 36 / **44** | 600 | text-1 | 33.1 | Lc 60 | 85–91 ✓ |
| `--t-title` | 28 / **36** | 600 | text-1 | 25.8 | Lc 60 | 85–91 ✓ |
| `--t-lead` | 22 / 28 | 400 | text-1 | 20.3 · 19.8 serif | Lc 69–71 | 85 ✓ |
| `--t-body` | 18 / 28 | 400 | text-1 | 16.6 · 16.2 serif | Lc 86 · 89 | 85 — **marginal** |
| `--t-ui` | **17 / 24** | 600 | text-1 / text-2 | 15.7 | Lc 72 | 76–91 ✓ |

Three changes from what ships:

- **15 → 17 at the one-line tier.** The corrected matrix needs 16.5px of
  Source Sans 3 to carry the second ink at Lc 76–77; 17 is the next size
  that keeps a 4px-grid line-height. This is the §2.4 fix, and it also
  resolves the 1.5px diacritic headroom measured in §5.3.
- **Display and title line-heights +4px** (40 → 44, 32 → 36). Measured:
  Turkish two-line headings currently have 0px and 1px of clearance.
- **Body stays 18px, and the marginal Lc becomes a known cost.** On
  light, `text-1` at 18/400 measures Lc 85 against a corrected
  requirement of 86 (sans) / 89 (serif). Either raise body to 19 or
  darken `text-1` on cream by ~0.01 L. Darkening the ink is cheaper and
  does not move the measure; raising to 19 costs vertical space on a
  fixed-height shell.

The scale stays five steps and the 18/17 adjacency is not the failure
the old 19/17/16/15 scale was: those four all carried prose, while 18 is
prose at 400 and 17 is one-line UI chrome at 600 in a different family
role. The ratio rule in §2.2 of the design system should be restated as
"adjacent *prose* sizes are ≥ 1.2 apart".

**Cost to check before committing**: raising the meta tier 15 → 17 with
a 20 → 24 line-height adds 4px per meta line. Run `npm run audit` — the
fixed-height shell is the constraint, not the type.

**Do not add**: fluid `clamp()` type (§4.3 — the prose column is a
constant width), optical sizing (§4.4 — +27.7 KB for 2 %), a third
family, or a weight above 600.

**Do add**: Material-style positive tracking at the small end
(≈ +0.01em at 17px), which helps both legibility and the Turkish ink
crowding measured in §5.3.

**Measure**: replace `--w-measure: 65ch` with two per-family tokens.
`65ch` currently delivers **81 Turkish characters per line**, past WCAG
1.4.8's ceiling. 26rem (Turkish) and 29rem (English) land both at 57–58,
inside Dyson's band. Binds only above ~470px; the phone is untouched.

### Fonts

- **Keep Source Sans 3 + Source Serif 4.** Eight alternatives measured;
  none wins on the axis that matters (§6.2). The superfamily argument
  and the language rule are the same argument.
- **Switch the sans to the variable font instanced `wght=400:600`:**
  24,912 bytes against 28,900, one file instead of two, and every
  intermediate weight available. Total payload 48.0 KB → **44.0 KB**.
- **Keep the serif static.** +27.7 KB for a 2 % metric change.

### `PAIRS`

1. Apply the x-height ratio inside `requiredLc()` (sans 1.0864, serif
   1.1116). The run will go red; that is the finding, not a regression.
2. Add `family` to each row.
3. Have `verify-ui.mjs` emit the rendered `(selector, px, weight, color,
   background)` set and have `palette.mjs` consume it, keeping the hand
   list as the browserless fallback.
4. Keep the two-model check exactly as it is.

### On the brief's larger question

Nothing in colour or typography argues for React, a build step, or a
runtime dependency. Everything recommended here is a value in
`tools/palette.mjs`, a token in `css/style.css`, or two extra properties
read in `tools/verify-ui.mjs`. The palette tool is already Leonardo's
idea with zero dependencies, and the sweep is already a stronger
enforcement mechanism than any design system named in this document
ships. **If the visual language keeps being rejected, it is not because
the colour architecture is behind — it is because there are three
surfaces where a system needs eight, and no named step for a hover, a
press or a separator.** That is §1.5, and it is a day of work.

---

## Doğrulanamayanlar

- **[?] APCA's "x-height ratio of at least 0.5" assumption.** Quoted in
  secondary sources summarising APCA's guidance; I could not find the
  sentence in `referenceFont.md` itself. The ratio *method* is
  documented and unambiguous, and every number in §2.4 rests on the
  method, not on the 0.5 claim. But if that sentence is real, both
  shipped faces (0.486, 0.475) sit below the tables' stated domain.
- **[?] Apple's Dynamic Type table at the default "Large" setting.** I
  confirmed body = 17pt but could not retrieve the full
  size/leading/tracking table; the pages carrying it were unreachable
  from this environment. Apple deliberately publishes no guaranteed hex
  values for semantic colours either, so the iOS dark-mode hexes in §3.2
  are from secondary sources and should be treated as approximate.
- **[?] OLED smear on near-black greys.** Frequently asserted as an
  argument for `#000000`; I found no measurement. The power figures
  (11–38 % at 50 % brightness) are from a secondary summary and were not
  traced to the primary study.
- **[?] Line-height guidance specific to Turkish.** None found. The
  numbers in §5.3 are my own measurements of this app's own fonts and
  strings in Chromium, not a citation, and they are marked as such.
- **[?] Turkish text expansion.** Sources give 20–30 %, 25–30 % and
  40–50 % for UI strings, and disagree. The design system's +30 %
  headroom rule sits in the middle of that range. This corpus cannot
  settle it — the English paragraphs and the Turkish explanations are
  not translations of each other, so no ratio measured here would mean
  anything.
- **[?] The variable-font partial instance was measured, not rendered.**
  24,912 bytes is a real file produced with the project's own flags; I
  did not load it in a browser and confirm that `wght: 550` renders.
- **[≈] The chroma-curve diagnosis** (§1.4, §1.5) is inference from
  Radix's measured values plus `beta1-palette.md` §6's finding that
  chroma contributes nothing to the surface ramp at these magnitudes.
  It predicts that draining chroma from `surface-0` and spending it in
  the middle steps will read as more depth; that prediction is untested.
- **[≈] The claim that `.option__key` is set in the sans**, not the
  serif. My audit script matched it to the serif ratio on the substring
  "option"; at the sans ratio its requirement is Lc 97 rather than 100,
  and it fails either way, so the conclusion is unaffected.
- **Not checked at all**: P3 / wide-gamut behaviour of any of these
  values on a real phone; how the corrected type scale affects screen
  heights (needs `npm run audit`); whether any of the eight candidate
  pairings renders Turkish correctly on iOS Safari, which
  `docs/design-system.md` §2.4 already lists as unconfirmed for the
  current pair.
