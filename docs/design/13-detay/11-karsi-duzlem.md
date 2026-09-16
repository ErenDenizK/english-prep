# The counter-plane, solved

`10-sentez.md` §5 lists this as the second gap blocking any design: the
counter-plane had exactly one trial value, `#6F6156`, and that value
broke the contrast bar. The mechanism was validated; the value was not.

This solves it the way the palette was solved — against a requirement,
in both themes, verified with `tools/color.mjs`.

## 1 · What it has to be

`08-iki-tema-asimetrisi.md` established that an element which is
mid-tone against **both** grounds cannot be derived from either. So the
counter-plane is a single value used unchanged in both themes, and it
has to satisfy, simultaneously:

| | requirement | why |
|---|---|---|
| vs the dark ground `#0D1116` | ≥ 3 : 1 | WCAG 2.2 SC 1.4.11 — it is meaningful non-text content |
| vs the light ground `#F6F1E7` | ≥ 3 : 1 | the same, in the other theme |
| CIE L\* 30–70 | — | otherwise it is not mid-tone and the whole point is lost |
| marks drawn on it | ≥ 3 : 1 | a diagram's lines are non-text content too |

## 2 · The window exists, and it is 17 points wide

Scanning neutral greys against both grounds:

| CIE L\* | hex | vs dark | vs light | both ≥ 3 : 1 |
|---:|---|---:|---:|---|
| 40 | `#5E5E5E` | 2.92 | 5.76 | no |
| **45** | `#6A6A6A` | 3.50 | 4.80 | **yes** |
| **50** | `#777777` | 4.23 | 3.98 | **yes** |
| **55** | `#848484` | 5.06 | 3.32 | **yes** |
| 60 | `#919191` | 6.01 | 2.80 | no |

**The window is CIE L\* 41 – 58.** Seventeen points, sitting entirely
inside the mid-tone band.

That is the counter-plane's existence proof. One value, unchanged,
legible as a distinct plane on a near-black page and on a cream one.

## 3 · Chroma does not move the window — so the hue is free

| | window | width |
|---|---|---:|
| neutral, C 0.000 | CIE L\* 40.7 – 57.9 | 17.1 |
| warm, C 0.012 H 70 | 40.7 – 57.8 | 17.1 |
| warm, C 0.024 H 70 | 41.0 – 57.8 | 16.8 |
| warm, C 0.040 H 70 | 40.7 – 57.9 | 17.2 |
| cool, C 0.012 H 255 | 40.9 – 58.1 | 17.1 |
| cool, C 0.040 H 255 | 40.9 – 58.1 | 17.1 |

The window is set by lightness alone. **The counter-plane's hue is a
genuinely free parameter** — the first one this project has had. Warm
(H 70) ties it to the light theme's cream and the accent's family; cool
(H 255) ties it to the dark theme's slate; neutral commits to neither.
Nothing in the maths prefers one, so this is the owner's to choose and
it should be shown as three specimens rather than decided here.

## 4 · The trade along the window, and the balanced point

At C 0.024 H 70, with white ink `#F4F7FB` and near-black `#0D1116` as
the marks:

| CIE L\* | hex | vs dark | vs light | white mark | dark mark |
|---:|---|---:|---:|---:|---:|
| 41.8 | `#6C6155` | 3.14 | 5.36 | 5.62 | 3.14 |
| 45.5 | `#756A5D` | 3.59 | 4.69 | 4.92 | 3.59 |
| **48.8** | **`#7E7266`** | **4.05** | **4.16** | **4.36** | **4.05** |
| 52.3 | `#877B6E` | 4.59 | 3.67 | 3.84 | 4.59 |
| 57.4 | `#94887B` | 5.47 | 3.07 | 3.22 | 5.47 |

Every row passes. The window's ends are lopsided — the bottom favours
the light theme and white marks, the top favours the dark theme and
dark marks — and **CIE L\* 48.8, `#7E7266`, is where all four measures
are within 0.31 of each other.** That is the value to start from.

The optimum found by maximising the minimum of the two ground contrasts
is `#7F7366` (OKLCH L 0.563 C 0.024 H 70, min 4.10), one step away and
functionally the same. Either is defensible; `#7E7266` is balanced
across four measures rather than two.

## 5 · The finding that decides how the plane is used

**The accent cannot be drawn on the counter-plane. Not anywhere in the
window, at any chroma.**

Exhaustive search over L 0.40–0.75 × C {0.008, 0.024, 0.040} at H 70,
keeping only planes inside the window: **no value lets the amber pair —
`#F1AF5D` in dark, `#A05801` in light — hold 3 : 1 against the plane in
both themes.** Along the whole window the dark amber runs 1.82–3.17 and
the light amber 1.02–1.56.

Nor do `ok` (2.42) or `no` (1.63) on the balanced plane.

So the counter-plane carries **white and near-black marks only**. It is
structurally monochrome, and that is a consequence of the contrast
requirement rather than a taste decision.

Two things follow.

**First, the diagram drawn on it must be monochrome** — and that lands
exactly where `02-sinav-artefakti.md` arrived from the other direction.
The exam booklet is monochrome. A grammar figure set in white and black
on a neutral plane is simultaneously the only thing the contrast maths
permits and the thing that most resembles the paper the learner is
sitting. Two independent constraints, one answer.

**Second, the colour family has to come from somewhere else.** The
≥ 1.5 % hue condition cannot be met by the plane. That is consistent
with what arm 3 measured without knowing why: its diagram specimen
passed mid-tone and event area and carried H60 at only 0.5–0.8 %, while
its mosaic passed the hue condition at 8.0–8.2 %. The plane and the
mosaic are not alternatives — **the plane cannot do hue and the mosaic
is where hue lives.**

## Öneri

1. **Adopt the counter-plane as a fixed cross-theme token** with the
   window written down: CIE L\* 41–58, one value, identical in both
   themes, never derived from a ground. Start at `#7E7266`.
2. **Put the hue choice in front of the owner as three specimens** —
   warm H 70, cool H 255, neutral — at the same lightness. It is the
   one free parameter and the maths has no opinion.
3. **Write the monochrome rule into the design system** as a measured
   consequence: the plane carries white and near-black marks only,
   because the accent pair cannot clear 3 : 1 on any plane in the
   window. Then the next round cannot rediscover it by drawing an
   amber line on a grey field.
4. **Keep the plane and the mosaic separate**, per arm 3, and now with
   the reason: one carries the mid-tone and cannot carry hue, the
   other carries the hue.
5. **Re-run arm 3's grammar-diagram specimen on `#7E7266`** with the
   labels off the plane, and measure. Its predecessor scored 18.1 %
   mid-tone with a plane that failed contrast; this one should score
   similarly and pass.

## Doğrulanamayanlar

- **The 3 : 1 bar for the plane itself is an interpretation.** SC 1.4.11
  applies to graphics "required to understand the content". A plane that
  is purely a ground for marks arguably is not, in which case the true
  requirement is only that the marks on it are legible. Holding the
  plane to 3 : 1 as well is the stricter reading and it is what this
  document solved for; `w3.org` is blocked so the Understanding document
  could not be read directly to check the wording.
- **Only WCAG 2 was used here, not APCA.** The plane carries no text, and
  APCA's non-text guidance (Lc 15 / 30) is less settled than its text
  matrix. If the plane ever carries a label, the 0.4-point text overlap
  measured in `09-denetim.md` applies and this whole document does not.
- **The balanced value was not run through `npm run color`.** It is not
  in `tools/palette.mjs` yet, and adding it there is a change to the app,
  which this round's instruction excludes. The maths is the same maths
  the tool runs, but it has not been run *by* the tool.
- **OLED cost not measured.** A plane at L\* 48 covering 15 % of a dark
  screen costs real power on an OLED phone, which is what this app is
  read on. Nobody has measured it, here or in round one.
