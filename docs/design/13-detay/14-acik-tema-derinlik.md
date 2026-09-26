# The light theme's depth, and where the mid-tone was hiding

`10-sentez.md` §5 lists this as gap 5: the light theme has 6.3 L\* points
of text-bearing ladder and therefore cannot express elevation the way
the dark theme does, and nobody had solved what it does instead.

Solving it turned up something bigger than the gap, so this document
answers the question and then reports what it found on the way.

All values computed with `tools/color.mjs`.

## 1 · The two themes, mapped on one axis

| token | dark | CIE L\* | light | CIE L\* |
|---|---|---:|---|---:|
| `bg` | `#0c1117` | 4.9 | `#f6f1e7` | 95.3 |
| `surface-1` | `#181d23` | 10.5 | `#eee8dd` | 92.2 |
| `surface-2` | `#262b31` | 17.3 | `#e5dfd3` | 89.0 |
| `hairline` | `#2f3339` | 21.1 | `#d6d1c8` | 84.0 |
| **`edge`** | **`#71767d`** | **49.4** | **`#76736b`** | **48.5** |
| `text-3` | `#b5bac2` | 75.3 | `#685f54` | 40.8 |
| `text-1` | `#e9ecef` | 93.3 | `#211b14` | 10.2 |

Read down the two lightness columns and the shape of the problem is
visible without any further measurement. Each theme clusters its
surfaces at one end, its ink at the other, and then **jumps across the
middle in one step**: 32.2 points of nothing in dark, **40.5 points in
light**.

## 2 · The finding that was not the question

Both `edge` tokens sit at CIE L\* 49.4 and 48.5.

`11-karsi-duzlem.md` solved the counter-plane — the value that reads as
mid-tone against both grounds — and landed on `#7E7266`, **CIE L\* 48.8**,
inside a window of L\* 41–58.

So the three values are within one point of each other. Checked
directly:

| value | vs dark ground | vs light ground | both ≥ 3 : 1 |
|---|---:|---:|---|
| `edge` dark `#71767d` | 4.14 | 4.06 | **yes** |
| `edge` light `#76736b` | 4.00 | 4.21 | **yes** |
| counter-plane `#7E7266` | 4.05 | 4.16 | **yes** |

**Both existing edge tokens already satisfy the counter-plane
requirement**, including against the theme they were not solved for. And
a single value serves both: `#7F7367` (OKLCH L 0.564 C 0.024 H 70)
gives a minimum of 4.10 against the two grounds.

That is not a coincidence. An edge token is *defined* as the value that
holds 3 : 1 against the surface it bounds, and the counter-plane is
defined as the value that holds 3 : 1 against both grounds. They are the
same requirement, asked twice.

**So the counter-plane is not a colour to invent. It is `--c-edge`,
given area.**

And that is exactly what the flood-fill found. `09-denetim.md` reports
that the nine rejected screens contain eight mid-tone fragments with
aspect ratios from 42 : 1 to 162 : 1. Those fragments *are* the edge
token. The app already owns the middle band of both themes — **it has
only ever drawn one pixel of it.**

Nine rounds of "flat", "shallow", "yavan", and the missing value was in
the palette the whole time, used as a hairline.

## 3 · So: what the light theme does for depth

It does not use a surface ladder, because it has 6.3 points and cannot
get more. It uses the **40.5 points below its surfaces**, which are
unavailable for text and fully available for lines and fields.

Radix does exactly this in its own light scale: steps 1–5 (backgrounds
and components) span 9.8 L\* points, and steps 6–8 (borders) span a
further 13.7, down to L\* 75.8. We spend 6.3 on surfaces, one hairline at
84.0, and then nothing until 48.5.

A four-rung ladder, solved at H 85 C 0.014:

| token | OKLCH L | hex | CIE L\* | vs page | vs `surface-2` | role |
|---|---:|---|---:|---:|---:|---|
| `hairline` | 0.862 | `#D6D1C8` | 84.0 | 1.35 | 1.15 | separator; exempt from 1.4.11 |
| **`rule`** | **0.790** | **`#BFBAB1`** | **75.7** | 1.72 | 1.46 | a line meant to be seen |
| **`border`** | **0.700** | **`#A29E95`** | **65.2** | 2.37 | 2.01 | a bounded thing that is not a control |
| `edge` | 0.555 | `#77736A` | 48.5 | 4.20 | 3.56 | control boundary; 3 : 1 required |

`rule` at L\* 75.7 lands within a point of Radix's step 8 (75.8),
reached independently. The two new rungs carry no contrast requirement
of their own — they are decoration and structure, not control
boundaries — which is why they can sit below 3 : 1 honestly.

The same ladder in dark, for symmetry, at H 255 C 0.012: `hairline`
L 0.320 (L\* 21.1), `rule` L 0.400 (30.3), `border` L 0.470 (38.5),
`edge` L 0.564 (49.4).

## 4 · The corrected statement of the asymmetry

`08-iki-tema-asimetrisi.md` said the two themes need different
mechanisms for depth. That was right about the *text-bearing* ladder and
wrong to imply the whole problem is asymmetric.

The accurate statement:

- **Text-bearing planes are asymmetric.** Dark has 25.4 L\* points and
  can express elevation as a ladder; light has 6.3 and cannot. That
  stands.
- **Non-text planes are symmetric.** Dark has 32.2 unused points above
  its surfaces; light has 40.5 below. Both reach the same counter-plane
  window from opposite sides, and both already have a token sitting in
  it.

So the light theme's depth is carried by lines and fields where the dark
theme's is carried by fills — but they are drawn from the same band with
the same value, which is why one counter-plane serves both.

## Öneri

1. **Stop treating the counter-plane as a new token.** It is
   `--c-edge`, and the two theme-specific edge values should collapse
   into one cross-theme value (`#7F7367`, or the balanced `#7E7266`).
   Write that down before anyone adds a `--c-plane` beside them.
2. **Give the edge area.** The one change that addresses nine rounds of
   rejection is not a new colour; it is drawing the value the app
   already has as a field rather than as a 1px line.
3. **Add `rule` and `border` to both themes**, at the values above. The
   middle band is 32–40 points wide and currently holds one token.
4. **Do not add light surface steps.** Six points cannot carry four
   planes, and Radix does not try either — it puts the extra steps in
   its border range, which is what this ladder does.
5. **Re-examine `--c-hairline`.** At 1.35 : 1 against the page it is
   nearly invisible, which is defensible for a separator and indefensible
   for anything meant to be seen. If a line is currently doing structural
   work at `hairline`, it wants `rule`.

## Doğrulanamayanlar

- **The `rule` and `border` rungs have no contrast requirement**, by
  design — they are not control boundaries. That means `npm run color`
  will not check them, and nothing will catch it if a later round puts a
  control on one. A `PAIRS`-style row asserting "these two tokens are
  never used as a control boundary" would need writing, and has not
  been.
- **Collapsing the two edge tokens into one has not been tested against
  the real stylesheet.** 516 `var()` uses; the sweep would catch a
  visual break but not a semantic one.
- **Radix's light scale was read from `@radix-ui/colors@3` on npm**, and
  the step-role mapping (1–2 backgrounds, 3–5 components, 6–8 borders)
  comes from a WebSearch summary rather than the docs site, which is
  blocked. The values are primary; the role labels are `[≈]`.
- **No perceptual claim is made about the new rungs.** Whether L\* 75.7
  and 65.2 read as distinct steps on a real phone in daylight is not
  something the maths answers, and no device test was run.
