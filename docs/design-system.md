# Design system

The binding specification for the interface. Written after a research pass
across colour, typography, layout, iconography, motion, components,
accessibility and mobile-web constraints; every rule below states *why* it
exists, because a rule without a reason gets overturned by the next person
who finds it inconvenient.

**Scope.** Dark only. Mobile first, verified from 320 CSS px up. Static
HTML, one stylesheet, ES modules, no build step, no runtime dependencies.
Interface language Turkish; English appears as example sentences, answer
options and grammar terms.

**Three rules that generate most of the others.**

1. **Depth comes from surface lightness, never from borders or shadows.**
   Shadows simulate blocked light; a dark ground has no light to block, so
   they read as nothing. Elevation is expressed by making the raised thing
   *lighter*.
2. **At most one card level. Nothing framed inside a framed thing.** With
   only three usable surface steps, a card inside a card spends two of them
   and leaves the eye unable to locate the object boundary.
3. **One accent, one job at a time.** An accent carrying eight meanings
   carries none.

---

## 1 · Colour

### 1.1 How these values were chosen

Not by eye. Each token was **solved** for its contrast requirement against
the lightest surface it is allowed to appear on, then verified against two
models — `tools/color.mjs` does the maths and `npm run color` prints the
report.

Two models, because WCAG 2's formula is known to **overestimate contrast on
very dark grounds by 200–250%** — APCA's author is explicit that it "can't
be used for dark mode" ([interview](https://medium.com/@colleengratzer/how-apca-changes-accessible-contrast-with-andrew-somers-3d47627a5e16),
[WhyAPCA](https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/documentation/WhyAPCA.md)).
That error lands exactly where this entire interface lives.

So: **WCAG 2.2 AA is the conformance bar and APCA is the design bar.** APCA
is not a standard — it was removed from the WCAG 3 draft in 2023 and the
replacement algorithm is still undetermined
([Roselli](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html))
— so nothing here is claimed as conformance on APCA grounds. It is used
because on a dark ground it is the stricter and more honest of the two.

This is not academic. Every text token in the first draft of this palette
passed WCAG comfortably and **failed APCA**. The published values are the
corrected ones.

### 1.2 Surfaces

Three, not four. Past three steps the levels stop being distinguishable,
and every extra step costs contrast on every text token that has to survive
the brightest one.

| Token | Value | Use |
| --- | --- | --- |
| `--c-surface-0` | `#13100D` | The page. Everything sits on this by default. |
| `--c-surface-1` | `#1F1C19` | A raised block: the one card level, a tinted band. |
| `--c-surface-2` | `#2C2A27` | Overlay only: dialog, sheet, the pressed state of a row. |

Derived from a warm near-black base — `oklch(0.175 0.008 75)` — with
Material's verified elevation-overlay curve, `alpha = (4.5·ln(1+dp)+2)/100`
([source](https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/elevation/ElevationOverlayProvider.java)),
at 1 dp and 6 dp.

**Never `#000000`.** Light text on pure black blooms (halation), which is
worst for exactly the sustained reading this app is for, and it leaves
nowhere to go darker so elevation becomes inexpressible. The tiny warm
chroma (0.008) keeps the greys from reading cold beside the amber; anything
above ~0.015 and the neutrals start looking like a colour.

### 1.3 Text

Solid tokens, never white-at-N%-opacity. A translucent token has a
*different* effective contrast on every surface in the ramp, so one token
would silently carry three contrast values. Material 3 made the same move,
dropping M2's alpha-based emphasis for solid roles.

| Token | Value | APCA Lc | WCAG | Use |
| --- | --- | --- | --- | --- |
| `--c-text-1` | `#EDEAE6` | 91 | 11.9 | Body prose, English sentences, headings |
| `--c-text-2` | `#D6D1CB` | 75 | 9.4 | Labels, secondary lines, metadata that must be read |
| `--c-text-3` | `#BDB7B0` | 60 | 7.2 | Non-essential: hints, placeholders, counters |

Measured against `--c-surface-2`, the worst case. Never `#FFFFFF`: maximum
contrast maximises halation.

These three are closer together in lightness than a light-theme palette
would be. That is the cost of APCA compliance on a dark ground, and it is
paid deliberately — **hierarchy is carried by size and weight first,
lightness second.** If two tiers of grey are doing the work, the type is
wrong.

### 1.4 Accent

| Token | Value | Use |
| --- | --- | --- |
| `--c-accent` | `#EFB05C` | The one filled action per screen. Carries dark ink. |
| `--c-on-accent` | `#1A0F03` | Label on `--c-accent`, **≥16px at weight 700**. |
| `--c-accent-text` | `#F1CC92` | Emphasis and links on a dark surface. |
| `--c-focus` | `#F4DAB2` | Focus ring. |

**Amber is structurally a dark-ink-on-fill colour**, the same class Radix
puts amber, yellow, lime, mint and sky in — their solid step is designed
for dark foreground text
([Radix](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)).
Never white on amber.

**The measured ceiling: no ink reaches Lc 75 on this fill.** Pure black
tops out at Lc 68. Lc 67 is comfortable for 16px/700 on APCA's own font
table but not for body text — so **the amber fill carries short bold
labels and nothing else. Never a paragraph, never a sentence.**

**Amber owns "highlight". There is no warning role.** The standard
colour-universal warning hue is `#E69F00`, which is amber
([Wong 2011](https://www.nceas.ucsb.edu/sites/default/files/2022-06/Colorblind%20Safe%20Color%20Schemes.pdf)).
Rather than leave "highlighted" and "caution" indistinguishable, this app
simply has nothing to warn about; if that changes, warning is expressed by
icon and copy, not by hue.

### 1.5 Semantic — indicators, not text

| Token | Value | Use |
| --- | --- | --- |
| `--c-ok` | `#7CCD8E` | Correct: icon, tint, indicator |
| `--c-no` | `#E97871` | Incorrect: icon, tint, indicator |

**Red cannot reach Lc 75 at any usable chroma on this ground** — only at
chroma 0.05, by which point it is pink. Red is inherently low-luminance;
this is a property of the colour, not a palette flaw.

The resolution is not a washed-out red. It is that **semantic colours are
never text colours.** The words "Doğru" and "Yanlış" are set in
`--c-text-1`; the hue lives in the ✓ / ✕ glyph and the row tint, where the
requirement is 1.4.11's 3:1 for non-text, which both clear (7.5 and 5.0).

This is also what WCAG **1.4.1 Use of Color (Level A)** demands anyway:
correct/incorrect must never be conveyed by colour alone. The feedback
block therefore carries **four redundant channels** — glyph, word, tint,
and the answer itself — so it survives greyscale, colour-vision deficiency
(~8% of men), a phone in sunlight, and forced-colors mode.

#### 1.6 Two lines, and the distinction is load-bearing

`--c-hairline: #36322D` **separates**. Contrast against the page is 1.12 —
far below 1.4.11's 3:1, and legitimately so: a decorative separator is
exempt.

`--c-edge: #78746E` **identifies a control's boundary**, which 1.4.11
requires at 3:1. It is the lightest value that clears 3:1 against all
three surfaces, and it exists for exactly one reason: no two surfaces in
this ramp are 3:1 apart, so a fill cannot delineate a text field. A field
with no visible edge is a conformance failure and a usability one at once.
This is the only place a border is required rather than forbidden.

For everything else the rule is absolute: **no border ever carries state.** State is expressed by
fill, glyph or text. This is the same conclusion the "no boxes" direction
arrived at from the visual side, reached independently from the contrast
maths — which is a good sign it is right.

### 1.7 Rules

- Every foreground token is measured against the **lightest** surface it
  may appear on, not the darkest. This one rule is what stops an elevation
  ramp from quietly breaking text contrast.
- Tokens are named by **role**, never by value. `--c-surface-1` survives a
  palette change; `--c-warm-grey-800` does not.
- Author in OKLCH with a hex fallback declaration above it. Equal lightness
  across hues means equal measured contrast across hues, so contrast is
  calibrated once per level rather than once per colour.
- `color-scheme: dark` in CSS **and** `<meta name="color-scheme"
  content="dark">` in the head. The meta tag applies before the stylesheet
  loads and prevents a white flash on every cold start.
- `@media (prefers-contrast: more)` lifts `--c-text-2` and `--c-text-3` one
  tier and makes hairlines visible. Cheap, and it directly serves low-vision
  students.
- `@media (forced-colors: active)`: anything signalled by `background-color`
  alone disappears. Re-express state with system colours (`Highlight`,
  `ButtonText`, `GrayText`) and give inactive states a
  `1px solid transparent` border so the active one has something to become.

---

## 2 · Typography

### 2.1 Two families, and a rule about which

**Source Serif 4** for English. **Source Sans 3** for Turkish and all UI.

A superfamily, so the pairing is harmonious by construction rather than by
luck — matched proportions and metrics, contrast built in. Source Serif 4
also ships **optical sizes**, which on a phone is a real gain: its
Caption/Small-Text cuts have wider proportions and light traps for small
text, its Display cut is condensed for headings. Set
`font-optical-sizing: auto` and it happens for free.

Both were verified to serve `latin-ext` from the Google Fonts CSS2 API.
No third family: figures use Source Sans 3 with
`font-variant-numeric: tabular-nums`, which saves a whole font download.

**The language rule: serif is English, sans is Turkish.** The typeface tells
the learner which language they are looking at before they read a word.

**But only at block level.** English example sentences, cloze prompts,
answer options and grammar terms are serif *blocks*. An English word inside
a Turkish sentence stays in the sans. The literature on bilingual
typography is clear that where two languages share a script, the
distinction is better carried by devices extrinsic to the typeface —
spatial organisation, rules, colour
([Keith Tam](https://keithtam.net/category/typography/bilingual-typography/))
— and inline typeface switching costs baseline alignment inside a single
line box for a signal stronger than the distinction warrants.

### 2.2 Scale

Base **16px**, non-negotiable, for two independent reasons: iOS Safari
zooms the viewport when a focused form control is under 16px, and 16px is
the lower edge of comfortable reading at phone distance.

| Step | Size / line-height | Use |
| --- | --- | --- |
| `--t-display` | 28 / 32 | Screen title |
| `--t-title` | 22 / 28 | Lesson title, section head |
| `--t-lead` | 19 / 28 | Cloze prompt, lesson hook |
| `--t-body` | 16 / 26 | Turkish prose, English examples |
| `--t-ui` | 15 / 20 | Buttons, rows, labels |
| `--t-meta` | 13 / 16 | Counters, captions |
| `--t-micro` | 11 / 16 | Block labels, small caps |

Seven steps. Ratio around 1.2 for the UI end, wider at the top where the
reader needs it. **Every line-height is a multiple of 4** so type lands on
the spacing grid; where the strict ratio lands off-grid it is rounded up,
which is what design systems actually do rather than snapping to a baseline
grid (that breaks on the first image or fluid element).

Line-height ratio **falls as size rises** — 1.63 at body, 1.14 at display.
A fixed ratio makes large text look loose.

### 2.3 Measure

Reading text is capped at **65ch**. At 320px this is inert — the arithmetic
does not resolve: 288px of usable width at 16px is roughly **36 characters
per line**, below Bringhurst's 45 floor and Baymard's 50, and the only way
to reach 45 would be dropping type below 16px, which is worse. **Accept the
short measure and hold 16px.** The cap binds on tablet and desktop, which
is where it was going to be needed anyway.

### 2.4 Turkish

- **`lang="tr"` on `<html>`; `lang="en"` on every English element.** Not
  cosmetic. CSS Text 3 makes the Turkish `i`/`İ` case mapping conditional
  on content language, so `text-transform: uppercase` on an English string
  under `lang="tr"` produces **SİMPLE**. Verified empirically in Chromium
  for this project: `lang="tr"` + uppercase on `i` renders `İ`, `lang="en"`
  renders `I`. *Still to confirm on real iOS Safari.*
- The same attribute switches screen-reader pronunciation, which in a
  language-learning app is the stronger argument: an English example read
  with Turkish phonology is useless. **WCAG 3.1.2 Language of Parts (AA).**
- Prefer not to uppercase content text at all. All-caps is measurably
  harder to read and some screen readers spell short all-caps strings out.
  Block labels use letter-spacing and weight instead.
- **`latin-ext` is required, and for exactly five glyphs**: `Ğ ğ İ Ş ş`.
  Everything else Turkish needs — `ç ö ü â î û` and `ı` — is inside the
  `latin` subset. Without `latin-ext` those five fall back to a system font
  and words render in mixed typefaces: "Değişiklik" with two foreign
  letters in it. Subtle enough to survive review, glaring once seen.
- **Turkish runs 20–30% longer than English.** Size every text container
  with +30% headroom at 320px, and put `overflow-wrap: break-word` on prose
  — agglutination produces single words wider than the viewport.
- Apostrophes follow TDK: suffixes on proper nouns take one
  (`Atatürk'ün`), derivational suffixes and institution names do not
  (`Türkçede`, `Türk Dil Kurumundan`). Use `’` (U+2019), not `'`.
- In JavaScript, `toLowerCase()` is locale-independent and therefore safe
  for matching English answers. `toLocaleLowerCase()` under a Turkish
  locale maps `I` to `ı` and would break matching — never use it for
  answer comparison.

### 2.5 Loading

Self-hosted `woff2`, subset to `latin` plus the five Turkish glyphs. Two
weights of the sans, **one of the serif**: English is set at 400
everywhere, taking its hierarchy from size and from the face rather than
from weight, which is the cleaner pairing against a sans at 600 and takes
the payload from 66.6 KB to 48.0 KB. `.t-en` pins `font-weight: 400` so
nothing can ask for a weight that isn't shipped and get a faux-bold.

Subsetting is where the saving is: Google's `latin-ext` slice is ~33 KB
against ~15 KB for `latin`, for hundreds of glyphs this app will never
render. One file per face, `latin` plus the five, cuts each face by 70–79%.
The character range was **not** trimmed below `latin` to save more — future
content will introduce characters this build has never seen, and a stray
glyph falling back to a system font is the mixed-typeface failure §2.4 is
about.

Static instances mean **`font-optical-sizing` is a no-op**: Source Serif
4's `opsz` axis is not present. That was one of the reasons for choosing
this family, and it is given up here; restoring it means shipping the
variable font at roughly +20 KB per weight. The superfamily-harmony
argument stands on its own. Google Fonts' shared-cache argument died when Chrome
partitioned the HTTP cache by top-level site in 2020; what remains is two
extra origins and a render-blocking round trip before the font URLs are
even known.

- `font-display: swap` for body.
- A **metric-matched fallback** `@font-face` using `size-adjust`,
  `ascent-override` and `descent-override`, so the swap does not reflow the
  page. This is a CLS fix, and CLS on a reader is the difference between
  losing your place and not.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the
  two faces used above the fold, and no others.

### 2.6 Cheap wins

`text-wrap: balance` on titles, `text-wrap: pretty` on prose. Both degrade
silently, and `balance` runs 10–100× faster than the JavaScript equivalents
it replaces. `font-variant-numeric: tabular-nums` on every figure that
changes — a question counter whose width shifts between questions moves the
button under the learner's thumb, which is a layout-shift bug, an
accessibility hazard and a broken promise all at once.

---

## 3 · Space

**4pt base.** Not 8: a text-dense app on a 320px floor needs 4 and 12 for
icon gaps and chip padding, and an 8pt grid can't express line-height
adjustments without visual jumps. Most values still land on 8.

`--s-1: 2px` · `--s-2: 4px` · `--s-3: 8px` · `--s-4: 12px` ·
`--s-5: 16px` · `--s-6: 24px` · `--s-7: 32px` · `--s-8: 40px` ·
`--s-9: 48px`

Dense at the bottom, coarse at the top — small steps for component
internals, large jumps for section breaks. Named numerically: t-shirt sizes
get clumsy past a handful, and reaching for `5xl` is a sign the scale is
wrong rather than short.

**No baseline grid.** Multiples, not snap. A single fluid image or a
30px gap on a 24px grid knocks the whole column out of rhythm, and forcing
captions onto body rhythm makes them look wrong. Perfect snapping is a
print luxury.

Page gutter is `--s-5` (16px), plus `env(safe-area-inset-left/right)`.

---

## 4 · Radius and elevation

`--r-1: 8px` · `--r-2: 12px` · `--r-3: 16px` · `--r-pill: 999px` · and **0
for anything full-bleed**.

**Nested radius = outer − padding.** Concentric corners are the only ones
that keep a constant gap; equal radii make the gap visibly thicker at the
corners. In CSS that is
`--r-inner: calc(var(--r-outer) - var(--s-4))`. If the result is ≤ 0 the
inner element is square-cornered — and that is usually the signal it
should not have been nested at all.

**No shadows.** Elevation is `--c-surface-1` / `--c-surface-2`. A modal
gets a scrim, not a shadow; the scrim does the separating work a shadow
cannot do on a dark ground.

A 1px inset top highlight — `inset 0 1px 0 rgb(255 255 255 / 0.04)` — is
permitted on a raised surface. It reads as a light edge rather than a
border and does not participate in the "no frames" rule.

---

## 5 · Motion

| Class | Duration |
| --- | --- |
| Micro state change (press, focus, colour) | 100–150 ms |
| Element enter | 200–250 ms |
| Element exit | 150–200 ms |
| View transition | 250–300 ms |
| Anything | never over 400 ms |

Exits are shorter than entrances: a leaving element no longer needs to be
read. The 400ms ceiling is the Doherty threshold — past it the interface
stops feeling like a conversation.

**Easing.** Entering uses `--ease-out: cubic-bezier(0, 0, 0, 1)`. Exiting
uses `--ease-in: cubic-bezier(0.3, 0, 1, 1)`. Moving on-screen uses
`--ease-standard: cubic-bezier(0.2, 0, 0, 1)`. **Never `ease-in` on
anything the user is waiting for.**

**Only `transform` and `opacity`.** They are the only two properties that
skip layout and paint and run on the compositor. Height animations are
layout animations — reserve the space and fade the content in instead,
which is the same fix the no-layout-shift rule already demands.

**What never animates.**

- Answering a question. It is the action performed hundreds of times a
  session; feedback must appear, not perform.
- Anything that moves layout under the thumb. A control that shifts between
  tap-down and tap-up is a pointer-cancellation hazard, not just a jank
  one.
- Keyboard-initiated actions — the user is moving faster than the
  animation.
- Nothing flashes more than three times per second (**WCAG 2.3.1, A**).

**Reduced motion is written as an opt-in, not an override.** The base rule
animates opacity only; a `@media (prefers-reduced-motion: no-preference)`
block adds the transform. That way the safe version is the fallback, and
meaningful feedback is never nuked along with the decoration. `reduce` also
turns off `scroll-behavior: smooth` — smooth scrolling is vestibular
motion, and it is the most commonly missed one.

Page-to-page transitions use the CSS `@view-transition` at-rule, which
needs no JavaScript and degrades to an instant swap where unsupported.

---

## 6 · Icons

Hand-drawn inline SVG, to a written contract, because a hand-built set
decays within a dozen icons without one.

| Property | Value |
| --- | --- |
| Canvas (`viewBox`) | `0 0 24 24` |
| Live area | 20 × 20, centred — all geometry inside it |
| Padding | 2 on every side, which is the budget for optical overshoot |
| Stroke | **2px**, centred, `stroke="currentColor"`, `fill="none"` |
| Caps and joins | round |
| Corner radius | 2 |
| Minimum gap between elements | 2 |

2px because icons here sit beside 600-weight nav labels and button text; a
1.5px stroke would look thin next to them. The set follows Lucide's
published geometry, which is the only one of the major sets with a
complete numeric drawing contract — the point being that a seventh icon
drawn in six months still matches the first six.

**Stroke width is absolute, not scaled.** Rendering a 24px icon at 20px
turns a 2px stroke into 1.67px and the set goes soft. Icons render at
their design size, or they get redrawn.

**Optical correction is expected.** Circles and diamonds must be slightly
larger than squares to look the same size; triangles slightly smaller. The
2px padding is what that borrows against.

**Selected navigation uses a filled variant, not a recoloured outline** —
two SVGs per destination. Fill changes visual *mass*, which survives
greyscale and forced-colors, so the selected state is not carried by hue
alone. This is the Apple and Material convention and it exists for that
reason.

### 6.1 The set

Fourteen drawings in `js/icons.js`: twelve outlines plus a filled variant
for each of the two nav destinations. `icon(name, {size, title})` builds
one; an unknown name throws rather than rendering nothing.

| Icon | Used for |
| --- | --- |
| `book` · `book-fill` | Eğitim, in the nav and on a lesson row |
| `check-square` · `check-square-fill` | Test, in the nav |
| `user` | the Profil trigger in the header |
| `arrow-left` · `arrow-right` | stepping back and forward |
| `check` · `close` | a right and a wrong answer |
| `chevron-down` · `chevron-right` | the listbox trigger; a row that opens |
| `bar-chart` | the results breakdown |
| `refresh` | starting another test |
| `target` | a weak spot to drill |

Every path coordinate is inside 2…22 and every drawing centres on (12,12)
— `refresh` alone sits at (12, 11.5), because its arrowhead needs the room
above the ring. Both filled variants are one `fill-rule="evenodd"` path
that keeps the outline's silhouette and inverts it: the outline's internal
strokes become voids, drawn 2 units wider than final so the shared 2-unit
stroke paints them back to exactly where the outline's stroke sat. Redraw
an outline and its fill has to be re-derived with it.

**Accessibility.** An icon beside a visible label is decorative:
`aria-hidden="true"`, and the label names the control. An icon-only
control is labelled on the *button* with `aria-label`, never on the SVG.
All inline SVG carries `focusable="false"`.

---

## 7 · Components

Twelve primitives. The current build has **45 component roots**, which is
what an ad-hoc system looks like from the outside; the consolidation below
is the point of the rebuild.

| Primitive | Replaces | Notes |
| --- | --- | --- |
| **Surface** | `panel`, `hero`, `question-card`, `score-summary`, `lesson-step` | One level only |
| **Row** | `topic-card`, `lesson-row`, `breakdown-list li`, `review-item` | The whole row is the target |
| **Stat** | `stat-tile`, `stat-grid` | Figures use tabular numerals |
| **Button** | `btn`, `option-btn`, `profile-trigger`, `quiz-nav__exit` | Three levels, one filled per screen |
| **Chip** | `badge`, `category-chip` | Pill radius, never interactive |
| **Field** | `text-input` | 16px minimum, always |
| **Listbox** | `dropdown` | Combobox pattern — §8.2 |
| **Dialog** | `modal`, `modal-overlay` | Native `<dialog>` — §8.3 |
| **Nav** | `bottom-nav` | Two destinations, always labelled |
| **Progress** | `progress-track` | Also the reader's position indicator |
| **Feedback** | `feedback` | Four redundant channels — §1.5 |

Three things sit outside that inventory and are not primitives:

- **The shell** — `.shell__header`, `.shell__scroll`, `.shell__nav`,
  `.shell__bar`. Layout, not a component. The header and the bar share the
  page's measure and gutters so the brand, the content and the buttons all
  land on the same two keylines. `.shell__bar-inner` has a fixed minimum
  height — the tallest thing it can hold, a 52px primary button, plus its
  padding — so a bar holding a hint and a bar holding a button are the same
  size and answering a question cannot move it.
- **`.btn--icon`** — a *shape*, orthogonal to the three levels, for a
  control whose whole content is one glyph or one letter. It carries
  `flex: none`, because the 48px square exists precisely so it cannot be
  squeezed, and in a flex row it otherwise collapses to 23px at 320.
- **`.blank`** — the cloze gap: a rule on the baseline, uniform width, with
  the word for the synthesiser hidden inside it. Sizing the gap to the
  answer would leak the answer.

### 7.1 Row versus Surface

The deciding question is **homogeneity**, not importance. Homogeneous,
scannable content is rows separated by hairlines. A Surface is justified
only for heterogeneous content — the home dashboard's mixed blocks. The
lesson index, the results breakdown and the answer options are all rows.

A scannable row: leading slot (fixed width, so every row's text starts on
the same keyline), primary line, optional secondary line, trailing value
(fixed width, right-aligned). **Ragged text edges from variable-width
leading content is the single most common cause of an unscannable list.**

Only **one separation mechanism per boundary**: a hairline, or a gap, or a
background change. Never two.

A row's secondary line is **one line, always** — clipped with an ellipsis.
A hint that wraps to four lines gives every row in the list a different
height, which is the same unscannability by another route.

**A control whose fill is `surface-1` steps up to `surface-2` when it sits
on a Surface**, or it disappears into it. Depth here is surface lightness;
two things at the same depth overlapping means one of them is at the wrong
depth.

### 7.2 Button

| Property | Value |
| --- | --- |
| Height, primary | 52px |
| Height, secondary | 44px minimum hit area |
| Padding | `--s-5` to `--s-6` horizontal |
| Label | `--t-ui`, weight 600 — **700 and ≥16px on the amber fill** (§1.4) |
| Icon | 20px, `--s-3` gap |
| Minimum width | 88px, so short Turkish labels don't produce runts |

Three levels, one filled per screen: filled → surface-1 → text. **No
outlined buttons.** An outlined button inside a tinted band is a frame
inside a frame — it was the one genuine box-in-box the review of the first
mockups found, and removing the variant removes the whole class of error.

States: default, hover, `:focus-visible`, pressed, loading. On a dark
ground hover and pressed both want to go lighter and would collapse into
each other, so they are separated by *channel*: **hover changes surface,
pressed changes scale** (`transform: scale(0.97)`, ≤100 ms).

**No disabled buttons.** Disabled controls are exempt from contrast
requirements, drop out of the tab order, and explain nothing. Keep the
control live and answer on activation — the lesson reader already does
this: an unanswered check reads "Atla" rather than locking the way
forward. Where unavailability must be shown, `aria-disabled="true"` keeps
the control focusable and announced.

**Focus: `outline`, never `box-shadow`.** Outlines survive forced-colors
mode and are not clipped by `overflow: hidden`. 2px solid `--c-focus`,
2px offset.

---

## 8 · Accessibility contract

Target **WCAG 2.2 AA**, self-imposed. Conformance is per *page*, and the
spec is explicit that **each responsive variation must conform separately**
— so the 320 / 390 / 768 / 1280 sweep is not diligence, it is the
requirement. A quiz → results → review flow is a "complete process": every
page in it conforms, or none do.

### 8.1 Targets

| Class | Size |
| --- | --- |
| Primary — nav items, action bar, answer options | **48 × 48** |
| Secondary | **44 × 44** hit area, whatever the ink measures |
| Absolute floor | 24 × 24, only with ≥24px centre-to-centre clearance |
| Gap between adjacent targets | ≥8px, ≥12px in the bottom nav |

48 clears WCAG 2.5.5 AAA (44), Material (48) and Apple's default (44) at
once, and is a multiple of 4 and 8. The AA floor of 24 (**2.5.8**) has a
spacing exception; AAA does not. Inline links in prose are exempt and stay
exempt — forcing size on them wrecks the line.

Note **rounded corners can disqualify a nominally 24px target**: the test
is whether a 24×24 axis-aligned square fits *inside* the shape.

### 8.2 Listbox

The question-count control is a **select-only combobox**, not a bare
listbox: `role="combobox"` on the trigger, `aria-expanded`,
`aria-controls`, and — the part hand-rolled versions get wrong — **DOM
focus stays on the trigger**, with the active option tracked by
`aria-activedescendant`. Popup is `role="listbox"`, options are
`role="option"` with `aria-selected` on the current value, and the popup is
outside the tab sequence.

Keyboard: Down/Up open and move, Enter accepts and closes, Escape
dismisses without committing, Home/End jump, printable characters
type-ahead. The accessible name must include the current **value**, not
only the field label.

### 8.3 Dialog

Use native `<dialog>` with `showModal()`. It is Baseline, and it gives the
top layer, `::backdrop`, focus containment, Escape-to-close and — the part
worth the most — it makes everything outside `inert` automatically, so
that never has to be maintained by hand.

Focus lands on the **least destructive action** (Cancel) for a
confirmation, and returns to the invoking element on close. There is
always a visible close control in the tab sequence. Never
`position: fixed` on `<body>` as a scroll lock.

### 8.4 Live regions

One **persistent** `role="status"` node in the shell, whose `textContent`
is replaced. Not a node built and appended with its content — screen
readers register live regions when they appear, and a region injected
together with its text is frequently missed.

**One exception, and only one: a modal gets its own.** A native
`<dialog>` makes the rest of the document inert, so the shell's region is
unreachable from inside it — announcing into it would announce into
nothing. The restore dialog therefore has `#restore-message`, which obeys
every other part of this rule: persistent in the markup, `textContent`
replaced, polite. This is written down because an audit counted the
regions, called it a violation, and was right to look — a rule that reads
as forbidding a correct thing gets "fixed" by the next person to read
it.

`polite`, never `assertive`. Answer feedback is a status message
(**4.1.3**), not an emergency; `assertive` interrupts a learner who is
still hearing the option they chose. Announce the outcome and the answer —
"Yanlış. Doğru cevap: *were*." — with the English wrapped in `lang="en"`
so the synthesiser switches voice. **Never move focus into the feedback**:
4.1.3 says "without receiving focus", and it would move the user away from
the button they are about to tap.

### 8.5 Routing and focus

On every hash route change, all three of:

1. update `document.title` (**2.4.2**);
2. move focus to the new view's heading, given `tabindex="-1"`, so the next
   Tab continues from the right place;
3. announce the view name in the polite region, because focus alone is not
   reliably announced across screen readers.

The visible ring uses `:focus-visible`, so a thumb tap on the nav does not
paint an outline while a keyboard user still sees one. Back and forward
get the same treatment as a forward navigation, or the browser Back button
silently strands focus.

### 8.6 The bottom bar obscures focus

**2.4.11 Focus Not Obscured (AA)** is the criterion a fixed bottom bar sits
directly on top of, and the spec names sticky footers as the typical
offender and `scroll-padding` as the fix. So: `scroll-padding-bottom` on
the scrolling region, at least the bar's height plus its safe-area inset.

The bottom nav is a `<nav>` landmark containing links with
`aria-current="page"` — **not** `role="tablist"`. A tablist makes the whole
nav one tab stop, implies panels in the same document, and fights a hash
router that changes the URL.

### 8.7 Also in scope

- **1.4.1 Use of Color (A)** — §1.5.
- **1.3.1 Info and Relationships (A)** — a question and its options are a
  group: `role="radiogroup"` with `aria-labelledby` pointing at the stem,
  so a screen reader announces "3 of 4" and what is being asked.
- **2.5.3 Label in Name (A)** — the accessible name must *contain* the
  visible label. Voice-control users say the word they can see.
- **1.4.12 Text Spacing (AA)** — the sharpest test for a fixed-height
  shell. Force line-height 1.5, paragraph 2em, letter 0.12em, word 0.16em
  and confirm nothing clips or slides under the bottom bar.
- **1.4.10 Reflow (AA)** — the 320px rule, restated.
- **1.3.4 Orientation (AA)** — do not lock to portrait. Landscape on a
  phone leaves roughly 380px of height; the reader and the action bar have
  to survive it.
- **2.5.7 Dragging Movements (AA)** — the moment anyone proposes
  swipe-to-turn-page, it needs a tap equivalent.
- **3.2.3 Consistent Navigation (AA)** — the nav is identical on every
  view.

---

## 9 · Technical

### 9.1 Viewport and units

```
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#13100D">
```

- **`100svh`, not `100dvh`**, for the shell height, with a `100vh`
  declaration above it as the fallback. `dvh` recalculates as the browser
  toolbar animates, which reflows on every scroll — WebKit has an open bug
  for exactly that jank. This shell is entirely fixed and sticky elements;
  a strip of unused space when the toolbar retracts is a far better trade
  than a nav bar that jitters while a lesson is being read.
- **`env(safe-area-inset-*)` resolves to `0px` without `viewport-fit=cover`**
  — the classic "why is my env() zero" bug. And setting `cover` *without*
  handling the insets is worse than not setting it at all. Bottom inset
  always; left/right for landscape on notched phones; top only if a fixed
  header runs under the status bar. Always pass the fallback:
  `env(safe-area-inset-bottom, 0px)`. Android now needs this too, not just
  iOS.
- `overscroll-behavior: contain` on the scrolling region, so a fast flick
  at the top of a lesson does not trigger pull-to-refresh mid-question.
- `-webkit-text-size-adjust: 100%` — **not `none`**, which would block the
  user's own text scaling.
- `touch-action: manipulation` on controls.
- **Never `user-scalable=no` or `maximum-scale=1`.** On a phone,
  pinch-zoom *is* the without-assistive-technology magnification that
  **1.4.4** requires.
- Every `input`, `select` and `textarea` at **16px**, which is the entire
  fix for iOS focus-zoom.

### 9.2 Performance

Field targets, tighter than "good" because a no-framework static app has no
excuse: **LCP ≤ 2.0s · INP ≤ 150ms · CLS ≤ 0.05.**

| Item | Budget, compressed |
| --- | --- |
| HTML shell | ≤ 8 KB |
| CSS | ≤ 25 KB |
| JS, critical path | ≤ 50 KB |
| Fonts, 3 subset faces | ≤ 50 KB |
| **Critical path total** | **≤ 150 KB** |
| Topic JSON | ≤ 60 KB, lazy, never critical |
| Longest task on tap | ≤ 50 ms |

**INP is the metric this app can actually fail**, and `localStorage` is the
reason: it is synchronous and blocks the main thread. Answering a question
currently scores, builds DOM, updates progress *and* writes storage in one
handler. The rule: **paint first, persist after.** In the handler do only
what the next frame needs — the state class, the live-region text. Then
yield (`scheduler.yield()`, else `setTimeout(…, 0)`) and do the storage
write and the next-question preparation in the continuation. Debounce
persistence to once per question, and on `visibilitychange`.

Every storage read and write is wrapped in `try`/`catch` with a sane
default. Storage throws in some privacy modes; a quiz that crashes because
it cannot save a score is worse than one that forgets it.

CLS: reserve the feedback block's height before it has content. This is the
same rule as "answering must never move the button", arrived at from the
performance side.

Test on **throttled Slow 4G with 4× CPU**, not on a laptop.

### 9.3 CSS architecture

Two token tiers, primitive → semantic, one-way. Most systems need no
third. Tokens live in `:root`; preference overrides (`prefers-contrast`,
`forced-colors`, `prefers-reduced-motion`) **redefine tokens rather than
rules**, which keeps them out of specificity fights.

`@layer reset, tokens, base, components, utilities` — cascade layers are
Baseline and remove the specificity arms race without a build step. Native
nesting, `oklch()`, `:has()` and container queries are all Baseline; a hex
declaration sits above every `oklch()` one as the fallback.

---

## 10 · Verification

Nothing here is considered done because it looks right.

- `npm run color` — every token re-measured against its requirement in both
  contrast models. A failing token fails the build of the palette, not the
  reviewer's eye.
- `npm run validate` — content schema and cross-file consistency.
- `npm test` — scoring and storage logic.
- Playwright sweep at **320 / 390 / 768 / 1280**: no horizontal overflow,
  no target under 48px, no console error, on every screen and in both
  orientations.
- Text-spacing override (1.4.12) at 320px.
- Keyboard only, tabbing to the last control with the action bar present —
  the 2.4.11 test.
- DevTools emulation of `forced-colors: active` and
  `prefers-reduced-motion: reduce`.
- Screen readers that this audience actually uses: **TalkBack on Android,
  VoiceOver on iOS.** Desktop NVDA/JAWS is nearly irrelevant for a
  phone-first Turkish student app.

Automated tooling catches perhaps a third of accessibility issues and none
of §8.2–8.6.

---

## 11 · Open, and to be confirmed on real devices

Honest list. Everything below is either unverifiable from here or
contested in the sources.

1. **Turkish casing on iOS Safari.** Verified in Chromium for this project;
   MDN warns that language-specific casing support varies. If Safari does
   not honour it, the block labels must be authored in the correct case
   rather than transformed.
2. **Dark-mode weight compensation.** Halation makes light-on-dark text
   read bolder than its nominal weight. Sources contradict each other on
   the fix — one says drop toward 350 to preserve apparent weight, another
   says raise to 450 to counter perceived thinness at small sizes. Settle
   it on a real phone at real brightness, not on a monitor.
3. **The 20–30% accent desaturation figure** is a heuristic repeated by
   secondary sources, not a standard. The palette here was solved by
   measurement instead, which is why it does not appear as a rule.
4. **Three text tiers this close in lightness** is what APCA demands on
   dark, but it has not yet been tried by a learner in a dark room. If the
   hierarchy reads flat, the answer is more size and weight separation, not
   dimmer greys.
5. **Dark mode is worse for reading for most people.** NN/g's review of the
   Piepenbrock studies found light mode won on both visual acuity and
   proofreading, for young and older adults alike, with the gap widening as
   type got smaller — and participants reported no perceived difference
   while performing worse. Dark-only is a legitimate product decision, made
   here on the owner's preference and on the app being used at night. The
   cost is that **type size and contrast have to be more generous than a
   light app would need**, which is why §1 targets Lc 90 and §2 holds 16px
   as a floor. If a light theme is ever wanted, the token architecture
   makes it a one-file change — the values would be new, not inverted.
