# Arm 1 — Surface, depth and elevation, measured against

## every serious system that has solved this

Scope: `07-karar.md` §2 proposes a 5-step dark surface ladder
(surface-0..4, OKLCH L 0.175→0.400) and a 3-step ink (text-1..3,
L 0.975/0.905/0.827). This document measures that proposal against
Radix Colors, Material 3 (and the Material 2 model it replaced), IBM
Carbon, GitHub Primer, Atlassian Design Tokens, and Apple's HIG
materials, using this repo's own `tools/color.mjs` maths, and against
the owner's own eleven reference screenshots.

All conversions below were run with a small script built on
`tools/color.mjs`'s `hexToRgb`, `wcagContrast` and `apca`, plus an
inverse OKLCH function and a CIE L\* (0-100) function written to the
same gamma/matrix constants as `tools/color.mjs` and
`docs/design/measure-screens.py`. Validated against `07-karar.md`'s
own numbers before use: `surface-0 #0D1116` → OKLCH L 0.176 C 0.0122
H 254, CIE L\* 4.9 — the document says L 0.175 C 0.012 H 255,
CIE L\* 4.9. Match, to rounding. [S]

---

## 1 · Raw values, as published

### Radix Colors (npm `@radix-ui/colors` 3.0.0)

Downloaded the tarball from `registry.npmjs.org`, read the CSS
directly — no docs site needed for the numbers themselves. [S]

**slate-dark** `#111113 #18191b #212225 #272a2d #2e3135 #363a3f
#43484e #5a6169 #696e77 #777b84 #b0b4ba #edeef0`

**gray-dark** `#111111 #191919 #222222 #2a2a2a #313131 #3a3a3a
#484848 #606060 #6e6e6e #7b7b7b #b4b4b4 #eeeeee`

**sand-dark** `#111110 #191918 #222221 #2a2a28 #31312e #3b3a37
#494844 #62605b #6f6d66 #7c7b74 #b5b3ad #eeeeec`

**amber-dark** (accent) `#16120c #1d180f #302008 #3f2700 #4d3000
#5c3d05 #714f19 #8f6424 #ffc53d #ffd60a #ffca16 #ffe7b3`

Step semantics, from `WebSearch` orientation (radix-ui.com itself is
403; this is a search-engine snippet, [≈] not [S]): 1-2 app
background, **3-5 component background at rest / hover / pressed**,
6-8 borders (subtle / interactive / interactive-hover), 9-10 solid
fill, 11-12 text (low-contrast / high-contrast). This matters for §4
below — three of Radix's twelve steps are not more *elevation*, they
are the same level in three interaction states.

### Material 3 baseline dynamic scheme (`color_spec_2021.ts`)

`google/material-foundation/material-color-utilities`,
`typescript/dynamiccolor/color_spec_2021.ts`, read at
`raw.githubusercontent.com`. [S] HCT "tone" is defined to equal CIE
L\* (0-100) for a neutral/near-neutral palette — Google's own
description of HCT states this explicitly — so these are reported
as tone = CIE L\* directly, not converted through a hex round-trip:

| token | dark tone (≈ CIE L\*) |
|---|---:|
| `surfaceContainerLowest` | 4 |
| `surfaceDim` = `surface` = `background` | 6 |
| `surfaceContainerLow` | 10 |
| `surfaceContainer` | 12 |
| `surfaceContainerHigh` | 17 |
| `surfaceContainerHighest` | 22 |
| `surfaceBright` | 24 |
| `outline` | 60 |
| `onSurfaceVariant` (secondary text) | 80 |
| `onSurface` (primary text) | 90 |

That is a **7-step surface ladder** (excluding the dim/bright
synonyms of the two ends) spanning tone 4→24 — almost exactly the
CIE L\* 4.9→30.3 span this app's 5-step proposal covers. M3 spends
two more steps than we do, inside the *same* range.

### Material 2's elevation-overlay model, which M3 replaced

`androidx/androidx`, `compose/material/material/…/ElevationOverlay.kt`
and `Colors.kt`, read at `raw.githubusercontent.com`. [S] Not a fixed
step table — a continuous formula, white overlaid on a dark surface:

```kotlin
val alpha = ((4.5f * ln(elevation.value + 1)) + 2f) / 100f
```

with `darkColors()` defaulting `background = surface = #121212`,
`onSurface = white`. Computed at the model's own canonical dp values:

| dp | alpha | hex | CIE L\* |
|---:|---:|---|---:|
| 0 | 2.0% | #121212 | 5.5 |
| 1 | 5.1% | #1e1e1e | 11.3 |
| 2 | 6.9% | #222222 | 13.2 |
| 3 | 8.2% | #262626 | 15.2 |
| 4 | 9.2% | #282828 | 16.1 |
| 6 | 10.8% | #2b2b2b | 17.5 |
| 8 | 11.9% | #2e2e2e | 18.9 |
| 12 | 13.5% | #323232 | 20.8 |
| 16 | 14.7% | #353535 | 22.2 |
| 24 | 16.5% | #393939 | 24.0 |

This is why M3 replaced it: the formula caps out near L\* 24 no
matter how high `elevation` climbs (ln growth flattens fast), so a
dialog at 24dp and one at 48dp look almost identical — M2's own
ceiling problem, on the *surface* axis instead of the *ink* axis.

### IBM Carbon (npm `@carbon/themes` 11.81.0)

`js/generated/themes/{g10,g90,g100}.js`, resolved hex (not DTCG
references). [S]

| token | g10 | g90 | g100 |
|---|---|---|---|
| `background` | #f4f4f4 | #262626 | #161616 |
| `layer01` | #ffffff | #393939 | #262626 |
| `layer02` | #f4f4f4 | #525252 | #393939 |
| `layer03` | #ffffff | #6f6f6f | #525252 |
| `layerHover01` | #e8e8e8 | #474747 | #333333 |
| `layerHover02` | #e8e8e8 | #636363 | #474747 |
| `layerHover03` | #e8e8e8 | #5e5e5e | #636363 |
| `textPrimary` | #161616 | #f4f4f4 | #f4f4f4 |
| `textSecondary` | #525252 | #c6c6c6 | #c6c6c6 |
| `borderSubtle01` | — | — | #525252 |
| `borderStrong01` | — | — | #6f6f6f |

Every layer also ships a hover token — 3 levels × 2 states (rest,
hover) at minimum, plus `layerActive01-03` for pressed in the fuller
theme. Confirmed via `WebSearch` [≈]: Carbon's own guidance is that
dark themes get "one step lighter with each added layer" and that
layering is colour, not shadow — no `boxShadow`-per-layer token
exists in `@carbon/themes` at all; the package's only shadow-shaped
export is a flat `shadow = rgba(0,0,0,0.8)` used for scrims/menus,
not for card elevation.

### GitHub Primer (npm `@primer/primitives` 11.10.0)

`dist/css/functional/themes/{dark,dark-high-contrast}.css`. [S]

| token | dark | dark-high-contrast |
|---|---|---|
| `bgColor-inset` | #010409 | #010409 |
| `bgColor-default` | #0d1117 | **#010409** |
| `bgColor-muted` | #151b23 | #151b23 |
| `bgColor-emphasis` | #3d444d | — |
| `fgColor-default` | #f0f6fc | #ffffff |
| `fgColor-muted` | #9198a1 | #b7bdc8 |
| `borderColor-default` | #3d444d | #b7bdc8 |
| `overlay-bgColor` | #010409 | — |

Note `overlay-bgColor` equals `bgColor-inset` (the *darkest* value in
the whole ladder), not a lighter plane — Primer's popovers/dialogs
get their separation from **shadow against a near-black fill**, not
from being lighter than the page. And in high-contrast mode
`bgColor-default` collapses onto `bgColor-inset` — the surface ladder
itself shrinks under `prefers-contrast: more`; the work moves to text
and border instead. This is one specific, opposite-direction answer
to §5.

### Atlassian Design Tokens (npm `@atlaskit/tokens` 17.0.0)

`dist/esm/artifacts/tokens-raw/atlassian-dark*.js`, parsed as the JS
array they are (`var tokens = [...]`, `THIS FILE WAS CREATED VIA
CODEGEN`). [S]

| token | dark | dark-increased-contrast |
|---|---|---|
| `elevation.surface.sunken` | #18191A | #18191A |
| `elevation.surface` | #1F1F21 | #1F1F21 |
| `elevation.surface.hovered` | #242528 | — |
| `elevation.surface.pressed` | #2B2C2F | — |
| `elevation.surface.raised` | #242528 | #242528 |
| `elevation.surface.raised.hovered` | #2B2C2F | — |
| `elevation.surface.raised.pressed` | #303134 | — |
| `elevation.surface.overlay` | #2B2C2F | #2B2C2F |
| `elevation.surface.overlay.hovered` | #303134 | — |
| `elevation.surface.overlay.pressed` | #3D3F43 | — |
| `color.text` | #CECFD2 | #E2E3E4 |
| `color.text.subtle` | #A9ABAF | #CECFD2 |
| `color.text.subtlest` | #96999E | #BFC1C4 |

Two things worth flagging. First, the *whole* interaction-state
system doubles or triples the surface token count without adding a
single new elevation level: `surface`, `raised` and `overlay` are
three levels; each carries `.hovered`/`.pressed` on top, for nine
surface tokens describing three visual planes. Second — unlike
Primer — Atlaskit's increased-contrast theme keeps the *identical*
surface hex values and raises only text (`#CECFD2→#E2E3E4`) and
border. Two real systems, two opposite strategies for the same
accessibility preference; see §5.

`elevation.shadow.raised` and `.overlay` are also real, verbatim
box-shadow stacks, not just colour:

```
elevation.shadow.raised:  0 1px 0 rgba(0,4,4,0.5),
                           0 0 1px rgba(0,4,4,0.5)
elevation.shadow.overlay: inset 0 0 0 1px rgba(189,189,189,0.12),
                           0 8px 12px rgba(0,4,4,0.36),
                           0 0 1px rgba(0,4,4,0.5)
```

So Atlaskit's `raised`/`overlay` tiers are **lightness step + border
inset + shadow, together** — three channels stacked on the same two
levels, not spent on more levels.

### Apple HIG materials (`developer.apple.com`, verbatim JSON)

`developer.apple.com` itself returned 200, but the rendered page is
a client-side app shell with no numbers in the raw HTML; its
JSON data endpoint,
`/tutorials/data/design/human-interface-guidelines/materials.json`,
does carry the real prose. [S] It confirms, in Apple's own words,
that materials are **not a lightness-step system at all**: "A
material is a visual effect that creates a sense of depth... by
allowing color to pass through from background to foreground."
iOS/iPadOS ship four standard materials (ultra-thin, thin, regular,
thick) defined by blur/vibrancy/content-adaptive luminosity, not by
a published opacity or blur-radius number — Apple deliberately does
not publish exact percentages ("avoid selecting a material... based
on the apparent color it imparts... system settings can change its
appearance"). visionOS's `glass` material is explicitly described as
adapting to the *luminance of what's behind it* rather than using a
fixed value at all. This is a genuinely different paradigm from
every token-based system above — content-reactive, not authored — and
is the one system here with no numbers to extract, by the platform's
own design intent, not a network failure.

---

## 2 · One comparison table, this repo's maths

Full per-step OKLCH L / C / H / CIE L\* for every ladder above is in
the working script (see `## Doğrulanamayanlar` for where it would go
if this round produces a follow-up file); the load-bearing numbers:

| system | steps below text-ceiling* | span (CIE L\*) | Δstep (CIE L\*) | chroma curve |
|---|---:|---|---|---|
| Radix slate/gray/sand-dark | 7 (steps 1-7) | 5.1 → 30.3–30.6 | 3.2–4.5, then +6.1 | **bell**: C 0.000→0.012 (step7)→0.016(step8, past ceiling)→0.003(step12) |
| M3 baseline dark | 7 | 4 → 24 (tone) | 2, 4, 2, 5, 5, 2 | flat-ish (neutral palette, C≈4-8 in HCT units throughout) |
| M2 overlay (0-24dp) | 10 of 10 (white ink never breaks) | 5.5 → 24.0 | 5.8, 1.9, 2.0, 0.9,1.4,1.4,1.9,1.4,1.8 | none — grayscale by construction |
| Carbon g100 | 3 of 4 layers | 7.2 → 24.0 (34.9 loose) | 8.0, 8.8, 10.9 | none — grayscale |
| Primer dark | 4 of 4 (all pass strict) | 1.0 → 28.5 | 4.5, −8.5(inset<default),27.5 | low, flat (C≈0.014–0.019) |
| Atlaskit dark | 0 strict / 2 loose (sunken, surface) | 8.7 → 11.8 (loose) | 2.9 | low, flat (C≈0.003–0.007) |
| **This app, proposed** | **5 of 5 (strict, new ink)** | **4.9 → 30.3** | **6.6, 6.8, 7.6, 4.4** | **bell: C 0.012→0.018(mid)→0.012** |

\* "steps below text-ceiling" = how many of the system's own dark
surface steps still carry that system's own primary text token at
Lc 90 + WCAG 7 (computed below, §3b). Radix and M3 both count the
container/component tier as steps 1-7 of their 12/24-tone systems;
their true "surface" range (before text/border/solid steps) is
narrower than their full palette.

**Where the app's proposal agrees with the reference systems:**
1. **A bell-shaped chroma curve is the norm, not a Radix quirk.**
   Every dark ladder measured except the two purely-grayscale ones
   (M2, Carbon) — Radix (3 families) and this app's own proposal —
   peaks chroma mid-ladder and tapers at both ends. The app's own
   curve (0.012/0.016/0.018/0.016/0.012) already does this: symmetric,
   peaking at surface-2 (step 3 of 5, 50% through the ladder), close
   to Radix's peak position (step 7-8 of 12, ≈58-65% through). This
   is agreement, already built in — not something to fix.
2. **A ~7-11 CIE-L\* delta per step is the working range.** Radix's
   first five deltas (3.6-4.5), M3's (2-5), the app's own (4.4-7.6)
   all cluster well below the ~20-30 point jumps Carbon and Primer
   take at their *widest* gap (their ladders are shorter and built
   for a different job — 3-4 named "layers," not a fine ramp).
3. **5 steps spanning ≈4.9→30 CIE L\* sits inside the same window
   M3 uses 7 steps for (tone 4→24) and Radix uses 7 for (L\* 5→30).**
   The app is not choosing a wider or narrower range than the
   references — it is choosing *fewer stops inside the same range*.

**Where it's an outlier, with numbers:**
- **Every multi-vendor system in this set gives at least one full
  interaction state (hover, and usually pressed) its own token; the
  app's proposal gives none.** Radix: steps 3-5 of 12 (25%) are one
  level's rest/hover/pressed states. Carbon: every `layerNN` ships a
  `layerHoverNN`, and the fuller theme adds `layerActiveNN` — 2-3×
  the token count of the level count. Atlaskit: `surface`,
  `.hovered`, `.pressed` for *each* of its 3 named levels — 9 surface
  tokens for 3 planes. This repo's current `css/style.css` has zero
  surface-level hover/pressed tokens today (`grep -n "surface.*hover\|
  surface.*press" css/style.css` — no hits) and `07-karar.md §2`
  proposes none either. See §4.
- **The app's ladder is grayscale-adjacent (C 0.012-0.018, H 255
  fixed) while Radix's three neutral families range further apart in
  hue **character** even at similar chroma** — sand (H≈90-107) reads
  warm, slate (H≈248-286) reads cool-blue, gray is achromatic (C=0
  exactly, computed). The app's H 255 sits inside Radix slate's own
  hue band (248-286) — not an outlier, a specific choice matching
  the "cool/blue-slate" family rather than gray or sand. Worth
  stating as a decision, not a gap.

---

## 3 · What actually explains "yavan"

### (a) Midtone-band (CIE L\* 30-70) occupancy, by named step

| system | steps in 30-70 band | of how many total steps |
|---|---:|---:|
| Radix slate/gray/sand-dark | 4 | 12 |
| Radix amber-dark (accent) | 2 | 12 |
| M2 overlay | 0 | 10 |
| Carbon g10 | 1 | 9 |
| Carbon g90 | 5 | 9 |
| Carbon g100 | 3 | 9 |
| Primer dark | 1 | 8 |
| Primer dark-high-contrast | 0 | 6 |
| Atlaskit dark | 2 | 13 |
| **This app, proposed** | **1 (surface-4, L\* 30.3, right at the edge)** | **5** |

This is a step-count analog of `docs/design/midtone.py`'s pixel-share
metric, not the same measurement — a system can have zero pixels in
the band even with a token that sits inside it, if that token is
rarely painted. But the pattern lines up with what `00-v4-olcumu.md`
already found for this app's own screens (2.2% pixel-share vs the
owner's 18.4%): **every reference system keeps at least one working
step inside or at the edge of the midtone band**, and several
(Carbon g90/g100, Radix, Atlaskit) keep several. The app's proposed
ladder keeps exactly one, sitting on the boundary (30.3). That is
consistent with the decision the karar already made — the ladder
was extended specifically to reach the band — but it also means the
new ladder has almost no *room* inside the band to paint anything:
one step, not a range. A screen that wants two visibly different
midtone planes (say, a card and a divider band both above surface-3
but below the ink floor) has nowhere to put the second one without
either compressing toward surface-4 or extending past it. §4 answers
whether that argues for a 6th/7th step.

### (b) Text ceiling per system's own ink, strict (Lc 90 + WCAG 7) and loose (Lc 75 + WCAG 4.5)

Computed with `wcagContrast`/`apca` from `tools/color.mjs`, each
system's own darkest-to-lightest neutral surfaces against its own
primary ("strict" test) and secondary ("loose" test) ink:

| system | ink | strict ceiling (CIE L\*) | loose ceiling (CIE L\*) |
|---|---|---:|---:|
| Radix slate-dark | step 12 `#edeef0` | step 5, L\* 20.2 | step 8, L\* 40.8 |
| M2 overlay | white | step 24dp, L\* 24.0 (never breaks in range) | same |
| Carbon g100 | `textPrimary` | layer02, L\* 24.0 | layer03, L\* 34.9 |
| Carbon g100 | `textSecondary` | **none in ladder** (best Lc 71.2 < 75, on the *darkest* bg) | **none** |
| Primer dark | `fgColor-default` | `bgColor-emphasis`, L\* 28.5 (all 4 steps pass) | same |
| Primer dark | `fgColor-muted` | **none** | **none** |
| Atlaskit dark | `color.text` | **none** (best Lc 76.3, WCAG 11.30 — WCAG passes, APCA doesn't) | `surface`, L\* 11.8 only |
| Atlaskit dark | `color.text.subtlest` | **none** | **none** |
| **This app, OLD ink `#E9ECEF` (current, pre-karar)** | | surface-2, L\* 18.3 | surface-4, L\* 30.3 |
| **This app, NEW ink `text-1` (07-karar proposal)** | | **surface-4, L\* 30.3 — all 5 steps pass** | same |

This reproduces `07-karar.md`'s central claim exactly: the current
ink caps strict-tier text at surface-2 (L\* 18.3), one step short of
the top; the proposed ink clears all five steps at the strict bar,
with zero accessibility cost (WCAG 7+ and APCA Lc 90+ both still
clear at surface-4). [S], independently reproduced.

It also surfaces something the reference systems don't advertise:
**three of five systems measured here ship a "secondary" or "muted"
ink that fails our own strict *and* loose bar against every one of
their own surfaces** (Carbon `textSecondary`, Primer `fgColor-muted`,
Atlaskit `color.text.subtlest`). Two explanations, both consistent
with what's visible in the data: (1) WCAG 2's known blind spot at
the dark end — it overestimates contrast there by 200-250%, per
`tools/color.mjs`'s own comment — so a token built to satisfy WCAG
alone (Carbon's `textSecondary` clears WCAG 4.5-10.6 everywhere in
the ladder) can still fail APCA's Lc 75; (2) these tokens are meant
for large text, icons or UI labels, not body copy, where a lower bar
is legitimate. Either way: **this app's own `text-2`/`text-3` should
not be assumed automatically body-text-safe just because they clear
WCAG** — worth a standing check, already partially covered by
`PAIRS` in `tools/palette.mjs`, but the finding is that reference
systems get this wrong (by our bar) often enough that it is not a
one-off risk.

### (c) What each system does above its text ceiling

| system | above ceiling, is it... |
|---|---|
| Radix | non-text component fill (steps 6-10: borders, solid buttons) |
| M2 | never exceeds ceiling inside 0-24dp; higher dp needs would inherit the same cap |
| Carbon | `layer03`/`borderStrong03` — border and non-text component fill |
| Primer | `bgColor-emphasis` *is* the ceiling; nothing sits above it as a "surface" |
| Atlaskit | `surface.raised`/`.overlay` and their hover/pressed states — genuinely used as *text-bearing* planes in the real product, yet fail this repo's strict bar and partly the loose bar too (Atlaskit ships components on them regardless, presumably accepting WCAG-only compliance) |
| **This app** | nothing — surface-4 *is* the ceiling, by design (07-karar's own framing: "surfaces above it carry no text, only bands/rings/counter-planes") |

This app's answer — surfaces above the text ceiling are non-text —
matches Radix and Carbon's actual practice, and is *stricter* than
Atlaskit's, which knowingly ships text-bearing raised/overlay planes
that would fail this app's own bar. That is evidence the app's rule
is not overcautious; it is at the strict end of a real spread.

---

## 4 · Auditing 07-karar.md §2 against the above

**Is 5 steps enough?** For the *level* axis, yes, by the comparison
in §2 above — the app covers the same CIE L\* range (4.9→30) that
Radix and M3 use 7 named steps for for, with fewer but roughly
equal-sized stops. For the *state* axis, **no — and this is very
likely the specific, measurable cause of the "shallow / no depth"
complaint**, for three converging reasons:

1. Every reference system with any product surface area (Radix,
   Carbon, Atlaskit) gives hover/pressed its own token(s), separate
   from the level tokens — Radix spends 25% of its whole scale on
   it. `07-karar.md §2` defines none, and neither does the app's
   current `css/style.css` (zero `hover`/`press` surface tokens,
   checked by grep).
2. Absent a distinct hover/pressed surface, an interactive element
   at rest and under a finger *are the same colour* — which is a
   direct, measurable definition of "flat": no depth change at the
   one moment (touch) where depth communication matters most on a
   phone (there is no mouse hover on this app's actual devices, but
   `:active`/pressed still is).
3. `00-v4-olcumu.md`'s own three numbers (event area, midtone
   population, measurable colour) were all measured on *static*
   screenshots — none of them could have caught a missing
   interaction-state token, because a screenshot shows one state.
   The complaint the owner is describing (repeated across eight
   rejected rounds, per the brief) plausibly includes motion/touch
   feedback that these three static metrics structurally cannot
   see.

**A 7-step candidate**, keeping the app's own endpoints and bell
curve, verified against the exact ceiling this proposal's own ink
produces (computed via `tools/color.mjs`'s `wcagContrast`/`apca`,
not by editing the app):

| step | OKLCH L | C | H | hex | CIE L\* | text-1 strict? | text-1 loose? |
|---|---:|---:|---:|---|---:|---|---|
| surface-0 | 0.175 | 0.012 | 255 | #0D1116 | 4.9 | yes | yes |
| surface-1 | 0.215 | 0.015 | 255 | #151A20 | 9.0 | yes | yes |
| surface-2 | 0.255 | 0.018 | 255 | #1E232A | 13.5 | yes | yes |
| surface-3 | 0.295 | 0.018 | 255 | #272D35 | 18.2 | yes | yes |
| surface-4 | 0.335 | 0.016 | 255 | #313740 | 22.8 | yes | yes |
| surface-5 | 0.375 | 0.013 | 255 | #3B424B | 27.7 | yes | yes |
| surface-6 | 0.415 | 0.012 | 255 | #454C55 | 32.0 | **no** (Lc 88.8) | yes |

The true strict-bar ceiling for `text-1` against this app's own
proposed ink sits at OKLCH L ≈ 0.40-0.41 (CIE L\* ≈ 30-32) — one
notch above the karar's own surface-4 (L 0.400, L\* 30.3), which is
already effectively at the wall. **A 7-step ladder is achievable at
the strict bar (Lc 90 + WCAG 7) only by tightening the steps, not by
extending the range** — six steps fit strictly inside 4.9→30; a
seventh either needs to compress the existing deltas (from ~6.6-7.6
down to ~4-5 CIE L\* per step, closer to Radix's own 3.2-4.5) or
accept the loose bar (Lc 75+WCAG4.5) for its top step or two, which
the loose-ceiling column shows holds out to roughly CIE L\* 46
(computed with the same script, `text-1` loose-ceiling ≈ L\* 46,
`text-2` loose-ceiling ≈ L\* 30). A 9-step ladder is only reachable
by leaning further on the loose bar for its top 2-3 steps, i.e.
accepting that the top of a 9-step ladder is `text-2`/`text-3`
territory, never `text-1`.

**This has not been run through `npm run color`** — the brief for
this round says not to touch the app, and `npm run color` checks
`css/style.css` against `tools/palette.mjs`'s `PAIRS`, neither of
which exists for a candidate that isn't written yet. What's verified
above is the same underlying maths (`wcagContrast`, `apca`, the
OKLCH conversion) that `tools/color.mjs` provides and `npm run
color` calls — so the *numbers* a real edit would need to clear are
already known, not the tool's own exit code.

**Recommendation for this axis, stated as a finding, not a change**:
the "shallow" complaint is more likely explained by the *missing
hover/pressed tier* than by the step *count*. Adding 2 more level
steps (7-step) buys less measured evidence of fixing "yavan" than
adding hover/pressed variants of the 5 levels already proposed would
— none of the reference systems solve "flat" by adding more static
levels; all of the ones that ship real interactive components solve
it by adding *state* tokens to the levels they already have.

---

## 5 · What elevation is made of, and what it costs

| system | composition | evidence |
|---|---|---|
| Radix | lightness step only (component tier), border step only (border tier) — never combined in the base tokens | steps 3-5 vs 6-8 are disjoint token groups |
| M3 (2021+) | lightness step (tonal surface) is the primary channel; shadow (`shadow`/`scrim`, tone 0) exists but Material's own literature (confirmed via `WebSearch`, [≈]) frames tonal elevation as the *replacement* for relying on shadow in dark theme, because shadow is close to invisible on a near-black page | `shadow(): tone: () => 0` — a fixed black, used by component-level shadow definitions outside this file, not the surface system itself |
| M2 | shadow (dp) + a lightness overlay *specifically compensating for shadow's invisibility on black* — the overlay formula exists **because** shadow alone fails on OLED-dark UIs | `ElevationOverlay.kt` docstring context, `calculateForegroundColor`/overlay alpha formula, [S] |
| Carbon | lightness step only; explicitly no per-layer shadow token in `@carbon/themes` (checked: no `boxShadow`/layer-linked shadow export) | grep of the theme package, [S]; "layering is colour, not shadow," `WebSearch` [≈] |
| Primer | lightness step (`bgColor-*`) + border (`borderColor-default`) + shadow for `overlay` (near-black fill, distinguished by drop shadow, not lightness) | `overlay-bgColor` == `bgColor-inset`, the darkest token, [S] |
| Atlaskit | lightness step + border (translucent white/gray insets baked into `elevation.shadow.overlay`) + real box-shadow, **stacked**, for `raised`/`overlay` | verbatim shadow stacks quoted in §1, [S] |
| Apple (HIG) | translucency + blur + content-adaptive luminosity — no fixed lightness value at all; the "surface" colour is computed from whatever is behind it | Apple's own materials.json prose, [S] |
| **This app** | lightness step + a tokenised edge (`--c-edge`) + shadow ("depth is a lighter plane with a tokenised edge and shadow," `design-system.md`) | design-system §-stated rule |

So this app's own three-channel model (lightness + border + shadow)
is not unusual — it matches Primer and Atlaskit's actual practice
most closely, and Atlaskit stacks all three specifically for its two
*elevated* tiers (raised, overlay) while using lightness alone for
its base tiers (surface, sunken). That is a concrete, adoptable
refinement this app doesn't currently make: **use lightness alone
for in-flow level changes (surface-1..3) and add border+shadow only
for planes that genuinely float above content** (a modal, a popover)
— which happens to already be roughly what `design-system.md` says
in prose, just not measured against a reference before now.

**OLED cost**, using linear-RGB sum (0=black, 3=white) as a power
proxy — a standard, if approximate, way to reason about OLED
emission cost, since each subpixel's light output scales
~linearly with its linear (not gamma-encoded) value:

| token | linear-RGB sum, as % of white |
|---|---:|
| true black | 0.00% |
| Primer `bgColor-inset` #010409 | 0.14% |
| this app `surface-0` #0D1116 | 0.59% |
| Radix `slate-1` #111113 | 0.59% |
| M2 base #121212 | 0.60% |
| Primer `bgColor-default` #0d1117 | 0.61% |
| Atlaskit `surface.sunken` #18191A | 0.97% |
| M2 24dp #393939 | 4.09% |
| Atlaskit `overlay.pressed` #3D3F43 | 5.08% |
| Primer `bgColor-emphasis` #3d444d | 5.96% |
| this app `surface-4` / Radix `slate-7` #43484e | 6.57% |
| Carbon g100 `layer03` #525252 | 8.44% |

All of these are under 10% of white's draw even at the *top* of a
5-7-step ladder — the OLED-cost question this round was asked to
weigh barely moves within any of these systems' ranges; the real
OLED cost driver in this app is the *area* painted at surface-3/4
(a full-screen fill vs a small card), not which named system
produced the token. Primer's `bgColor-inset` is the one system that
holds meaningfully closer to true black (0.14% vs this app's 0.59%)
— it is the only "well"/sunken token in this set actually optimised
toward zero rather than toward a comfortable-not-pure-black feel.

**`prefers-contrast: more` and `forced-colors: active`**: none of
the four npm packages measured (Radix, Carbon, Primer, Atlaskit)
contain either media query in their own CSS/token output — checked
directly (`grep -rl "prefers-contrast\|forced-colors"` across all
four source trees: zero hits). Two of the four (Primer, Atlaskit)
instead ship a *named alternate theme* (`dark-high-contrast`,
`atlassian-dark-increased-contrast`) that a consuming app is
expected to wire to the media query itself; Radix and Carbon ship
nothing for this at all — high contrast is the integrating app's
problem in all four cases, this app included. Given that, the two
that do provide a track record for what to do disagree on strategy:
Primer collapses the surface ladder toward black under high contrast
and leaves text/border to carry the extra work; Atlaskit keeps the
surface ladder frozen and raises text/border only. **This app's own
`css/style.css` already does the Atlaskit strategy** — `--c-text-2`
folds into `--c-text-1`, `--c-hairline`/`--c-edge` darken/lighten,
but no `--c-surface-*` token changes under `@media (prefers-contrast:
more)` (checked directly, lines 280-308). That is now validated
against a real precedent rather than an assumption, and the new ink
(text-1 already clearing surface-4 at the strict bar) makes this
strategy *safer* under the proposed ladder than under the current
one, since there is no scenario where prefers-contrast needs the
ladder itself to move.

`forced-colors: active` is handled today with a border-on-transparent
pattern (`css/style.css:1960`) — giving state a border to become once
fills are discarded by the OS. None of the four packages measured
publish forced-colors handling either (same zero-hit grep), so there
is no reference implementation to compare this pattern against
directly; it matches the general, platform-documented advice (not
independently reachable this round — `developer.mozilla.org` is
403) to rely on borders/outlines rather than background colour once
forced-colors strips custom fills. Flagged `[≈]`, not `[S]`.

---

## 6 · The owner's own references, reverse-engineered

Wrote `plateaus2.py` (Pillow, in the scratchpad, not committed):
crops each PNG 3% inward (matching `measure-screens.py`'s own inset
convention for these files), builds a 101-bin CIE L\* histogram
(0-100), finds local-maximum bins holding ≥0.8% of the image's
pixels and ≥3 CIE-L\* apart from any already-kept peak (merging
anti-aliasing/gradient noise into the plateau it belongs to), then
tags each surviving peak by its mean OKLab chroma — `< 0.035` is
"neutral" (the identical threshold `measure-screens.py` already uses
for its own `neutral` column), so a saturated accent block isn't
miscounted as a surface/elevation step. [S], run against all eleven
files in `docs/design/refs/`.

### The five the owner singled out (1, 3, 4, 8, 10)

| ref | neutral plateaus (L\*) | count | of those, below L\* 35 ("dark surface" tier) |
|---|---|---:|---:|
| 1-traffic | 0, 5, 56, 64, 100 | 5 | 2 |
| 3-log | 3, 12, 90, 100 | 4† | 2 |
| 4-wallet | 4, 45, 79, 92 | 4 | 1 |
| 8-midnightreads | 0, 16, 20, 26, 29, 86 | 6 | **5** |
| 10-wearable | 2, 12, 18, 30 | 4 | **4** |

† 3-log also has 3 *chromatic* plateaus (L\* 51/78/82, mean chroma
0.036-0.178) — colour-carrying content, not surface steps; excluded
here, consistent with the ref's own H0:9.0% hue reading in
`00-v4-olcumu.md`.

**The two structurally closest analogs to this app — 8-midnightreads
(dark reading UI) and 10-wearable (dark-throughout watch face) — are
also the two with the most dark-tier neutral plateaus: 5 and 4.**
Both top out right where this app's proposal does: midnightreads'
highest dark plateau is CIE L\* 29, wearable's is L\* 30 — against
this app's own surface-4 at L\* 30.3. That is an independent,
pixel-measured data point landing almost exactly on the ceiling
`07-karar.md` derived from ink contrast alone, from a completely
different method (reverse-engineering a screenshot the owner
pointed at, not solving an accessibility formula). It is the
strongest single piece of evidence in this document that **5 steps,
topping out around CIE L\* 30, is not an arbitrary number** — two
independent methods converge on it.

1-traffic and 4-wallet, by contrast, are not dark-throughout UIs —
most of their surface area is light, with a dark chrome band — so
they only need 1-2 dark-tier steps, and their remaining neutral
plateaus sit in the upper register (L\* 45-100, ink/light-surface
territory) that doesn't map onto this app's dark-only surface ladder
at all. Their comparison value is in the earlier "midtone population"
argument (§3a), not the step-count one: 1-traffic's plateaus at L\*
56/64 are *neutral, not chromatic* (chroma 0.000-0.001) — genuine
gray midtone planes (most likely chart gridlines or dividers) sitting
squarely inside the CIE L\* 30-70 band this app's ladder barely
touches. That is one more concrete example of the "band is populated
in liked references, empty in ours" pattern `00-v4-olcumu.md` already
found by a different measurement.

### All eleven, for completeness

| ref | dark-tier neutral plateaus (L\*<35) | total neutral plateaus |
|---|---:|---:|
| 1-traffic | 2 | 5 |
| 2-flask | 2 | 4 |
| 3-log | 2 | 4 |
| 4-wallet | 1 | 4 |
| 5-salesforce | 1 | 4 |
| 6-bookly | 2 | 3 |
| 7-bookly-reading | 2 | 3 |
| 8-midnightreads | 5 | 6 |
| 9-solar | 0 | 2 |
| 10-wearable | 4 | 4 |
| 11-insurance | 0 | 3 |

Median dark-tier count across all eleven: 2. Across the owner's five:
2. The outliers pulling the *singled-out* set's mean up (2.8 vs the
full set's 1.9) are precisely 8 and 10 — the two dark-mode analogs.
This is consistent with reading the owner's picks as "this is what a
good *dark* screen looks like," specifically, rather than "this is
what a good screen looks like" in general — most of the eleven
references are hybrid light/dark UIs where the dark-ladder question
barely applies.

---

## Öneri

Not a redesign — this round doesn't touch the app — but a ranked set
of things a later design pass should act on, in order of how much
measured evidence each carries:

1. **The 5-step, CIE L\* 4.9→30.3 range in `07-karar.md §2` is
   supported by two independent methods** (ceiling-from-ink-contrast,
   and the owner's own dark-analog references topping out at L\* 29
   and 30) and should not be widened in range. Treat CIE L\* ≈ 30 as
   the real wall, not just this ink's wall.
2. **Add hover/pressed surface tokens before adding more level
   steps.** This is the one gap every reference system with real
   interactive components (Radix, Carbon, Atlaskit) fills and this
   app's current CSS and the karar's own proposal both leave empty.
   It is also the one gap none of `00-v4-olcumu.md`'s three static
   metrics could have caught, which is itself worth noting given how
   many rounds have been rejected on "flat"/"shallow" grounds.
3. **If a 6th/7th step is wanted anyway**, compress rather than
   extend: six steps fit the strict ink bar (Lc90+WCAG7) inside the
   existing 4.9→30 range at deltas of ~4-5 CIE-L\* (closer to Radix's
   own 3.2-4.5 than the karar's current 6.6-7.6); a 7th needs the
   loose bar and should be treated, explicitly, as `text-2`/`text-3`
   territory, never `text-1`.
4. **Keep the shadow/border budget for planes that actually float**
   (modal, popover) and lightness-only for in-flow level changes —
   this matches Atlaskit's actual split (surface/sunken:
   lightness-only; raised/overlay: lightness+border+shadow) and is
   already roughly what `design-system.md` states in prose; a later
   pass could make the CSS reflect that split explicitly rather than
   applying the same three-channel treatment everywhere depth is
   used.
5. **The app's existing `prefers-contrast: more` strategy (freeze the
   surface ladder, raise text/border) matches a real precedent
   (Atlaskit) rather than Primer's opposite one (collapse the
   ladder), and the new ink makes it strictly safer** — no change
   needed here, just confidence that it was the right strategy.
6. **Audit `text-2`/`text-3` against every surface step they'll
   actually sit on, not just surface-4**, before shipping — three of
   five reference systems measured here ship a secondary ink that
   quietly fails APCA (while passing WCAG) somewhere in their own
   ladder, which is exactly the failure mode `tools/palette.mjs`'s
   `PAIRS` table exists to prevent, but only for pairs someone
   remembered to add a row for.

## Doğrulanamayanlar

- **Apple HIG's exact vibrancy/blur numbers.** The materials.json
  prose (§1) confirms Apple does not publish fixed opacity or blur
  values by design — materials are computed against live content.
  Where a value table might still exist (e.g. exact vibrancy alpha
  per level: "primary/secondary/tertiary/quaternary" for labels), it
  would live in a WWDC session or SwiftUI runtime, not a public spec;
  not fetched this round.
- **W3C/MDN's own account of `forced-colors` best practice.**
  `developer.mozilla.org` and `w3.org` are both 403 per the brief's
  network table; the border-on-transparent claim in §5 is stated as
  general platform guidance from memory/training, marked `[≈]`, not
  independently re-verified against a primary source this round. A
  session with open access to `developer.mozilla.org` should check
  `css-color-adjust`/`forced-colors` spec text directly.
- **Whether a candidate 7-step ladder actually passes `npm run
  color`.** §4's candidate values were checked against the same
  `wcagContrast`/`apca` functions `tools/color.mjs` exports, by hand,
  not by writing them into `css/style.css` and `tools/palette.mjs`
  and running the real command — this round's brief is explicit that
  the app is not to be touched. The next round that *does* touch the
  app should run `npm run color` on whatever ladder is chosen before
  treating it as settled; the maths here narrows the search space but
  is not a substitute for the tool's own pass.
- **Full OKLCH/L\*/chroma tables for every step of every system**,
  beyond what's quoted in §2's summary table — they exist in the
  session's scratchpad script output but weren't reproduced in full
  here to keep this document inside the "one detail area" scope; a
  follow-up could paste the complete per-step table if a later round
  wants it as a citation source rather than a summary.
- **Material 3's 2025/2026 contrast-curve-driven spec** (the current
  default in `google/material-foundation/material-color-utilities`,
  superseding the 2021 baseline used above) was read
  (`color_spec_2025.ts`, `color_spec_2026.ts`) but not fully
  extracted — its surface tones are computed via `ContrastCurve`
  objects resolved against the *primary* palette's tone rather than
  fixed numbers, so a straight tone table isn't meaningful without
  also fixing a source colour; the 2021 baseline table used in §1-§4
  is the stable, comparable one, but a later round wanting the exact
  current-Android values should resolve `color_spec_2026.ts` against
  a specific seed colour rather than reading tone constants off it.
