# Kol 6 — the drawn layer: icons, marks, figures

Scope per the brief: audit, not redesign. Every number below was
either rendered in this session's Chromium
(`/opt/pw-browsers/chromium`) and measured with Pillow, computed
directly from `js/icons.js` and `css/style.css`, or pulled from a
package/spec fetched in this session (npm tarball or
`raw.githubusercontent.com`). Specimens live in `06-ornekler/`.

## 1 · The set, measured

### 1.1 The contract, and the one call site that follows it

`docs/design-system.md` §6 states stroke is **absolute, not
scaled** — "rendering a 24px icon at 20px turns a 2px stroke into
1.67px and the set goes soft" — and tells authors to "prefer 24, or
redraw at the size you actually need."

I grepped every `icon(...)` call in `js/` [S, this repo]:

```
grep -n 'icon(["\x27][a-z-]+["\x27]\s*[,)]' js/*.js
```

23 call sites. **22 of them pass a `size` other than 24** — 18 (x5),
20 (x13), 22, 28, 36, 64. The one exception is `js/home.js:495` and
`:512`, the bottom-nav renderer, which is the only call site using
`{ size: 24 }` — the design size. Every row chevron, every chip
icon, every back arrow, every onboarding glyph, the mistake-book
target mark, the streak flame — all of it renders off the size the
contract specifies.

Because `icon()` sets `width`/`height` on the `<svg>` while the
`viewBox` stays `0 0 24 24` (`js/icons.js:242-243`), this scales the
whole coordinate system, `stroke-width="2"` included. Effective
stroke at each size actually used, exact by construction:

| size (px) | 16 | 18 | 20 | 22 | 24 | 28 | 36 | 64 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| effective stroke | 1.333 | 1.500 | 1.667 | 1.833 | **2.000** | 2.333 | 3.000 | 5.333 |

[S, computed from `js/icons.js` + the call sites above]

**Empirical confirmation.** I rendered `arrow-right` at each size (8
sizes) against the real `--c-surface-1` / `--c-text-1` tokens at
16x device-pixel supersampling and measured the shaft's stroke width
with a 50%-luminance sub-pixel edge crossing (script:
`measure.mjs` + `analyze_stroke2.py`, this session):

| size | predicted stroke (css px) | measured (css px) |
|---|---:|---:|
| 16 | 1.333 | 1.234 |
| 18 | 1.500 | 1.386 |
| 20 | 1.667 | 1.556 |
| 22 | 1.833 | 1.656 |
| 24 | 2.000 | 1.821 |
| 28 | 2.333 | 2.144 |
| 36 | 3.000 | 2.756 |
| 64 | 5.333 | 4.879 |

Linear regression of measured against predicted: slope 0.9125,
intercept 0.012, **R² = 0.99983** [S, measured this session]. The
small constant gap (~0.1-0.2px) is the antialiasing threshold's own
measurement bias (the 50%-luminance edge sits slightly inside true
geometric edges under sRGB alpha blending), not scatter — the
relationship is fully linear. **The stroke is not 2px anywhere the
learner actually sees an icon except the two nav tabs.**

### 1.2 Pixel-grid alignment collapses off 24px

Using the exact `getBBox()` geometry of all 20 icons at all 8 used
sizes (`measure.mjs`, this session), I checked what fraction of each
icon's four ink-bbox edges land on a whole device pixel at DPR 2 and
DPR 3 (common phone pixel ratios):

| size | aligned edges, DPR2 | aligned edges, DPR3 |
|---|---:|---:|
| 16 | 38% | **100%** |
| 18 | 48% | 22% |
| 20 | 32% | 48% |
| 22 | **0%** | 22% |
| 24 | **100%** | 95% |
| 28 | 32% | 48% |
| 36 | 95% | 48% |
| 64 | 38% | **100%** |

[S, computed this session from real icon geometry]

24px is the only size that is clean at *both* common ratios. Every
other size is a coin flip or worse, at whichever ratio the learner's
phone happens to use — meaning the "soft" set the design-system
prose warns about is not a hypothetical, it is 22 of 23 call sites,
confirmed by direct measurement. Contact sheets at 16/18/20/24/28/36
(dark) and 20 (light), rendered against the real tokens, are in
`06-ornekler/contact-sheet-*.png`.

### 1.3 Grid, terminal style, corner radius — otherwise consistent

Reading every path in `js/icons.js`: viewBox is `0 0 24 24`
everywhere, no per-path `stroke-width` override exists anywhere in
the file (confirmed — the shared `ROOT_ATTRS` object is the only
place `stroke-width` is set), caps/joins are `round` on every icon
via the same shared attributes, and corner radius reads as 2 on
every rectangular form I could check by eye against the coordinate
comments (`check-square`, `calendar`). **This part of the contract
holds with no exceptions found.** The failure is entirely in §1.1/§1.2
— scaling, not drawing.

### 1.4 Optical mass varies 8.6x within the set

Rendered all 20 icons at the nominal 24px design size against real
tokens (`--c-surface-1` / `--c-text-1`, dark), then measured
antialiasing-weighted ink coverage inside each icon's own 24x24
bounding box (`mass.mjs` + `measure_mass.py`, this session):

| icon | ink coverage of 24x24 box |
|---|---:|
| check-square-fill | 57.82% |
| book-fill | 40.71% |
| target | 35.69% |
| check-square | 25.96% |
| calendar | 25.85% |
| book | 21.64% |
| spark-fill | 18.80% |
| bar-chart | 18.72% |
| user | 15.93% |
| bolt | 15.01% |
| refresh | 14.74% |
| pen | 14.39% |
| spark | 13.82% |
| close | 12.91% |
| flame | 11.70% |
| arrow-left | 11.49% |
| arrow-right | 11.45% |
| check | 8.08% |
| chevron-right | 6.78% |
| chevron-down | 6.76% |

[S, measured this session]

The two filled variants (57.82%, 40.71%) being heaviest is by
design — they carry the selected nav state and are meant to read as
mass (§6: "fill changes visual mass"). But **`target`, an *outline*
icon of three concentric strokes, measures 35.69% — heavier than
`check-square`'s own outline (25.96%) and nearly as heavy as the
filled book.** `target` is used at 20-22px next to body text as the
"weak spot" marker (`js/home.js:129,312`, `js/education.js:1051`) —
exactly the context where the chevrons were deliberately kept
lightest ("a chevron is an affordance on a row, not a thing you look
at," per the code comment at `js/icons.js:145-146`). No equivalent
comment explains why three concentric rings should read 5x heavier
than a chevron in the same list row. This is a real, measured
inconsistency in a set that otherwise documents its optical
decisions carefully.

### 1.5 Contrast — not a problem

Nav icon amber `#f1af5d` on `#0c1117`: WCAG 9.95:1, APCA 65.9 Lc
[S, `tools/color.mjs` run this session] — both clear every threshold
`tools/palette.mjs` defines (`APCA_LC.fluent = 60` is the highest
named tier, and this clears it despite being non-text). No finding
here; contrast is not where this set is weak.

## 2 · Reference contracts, verbatim

Every row below is from the package's own npm-published source, not
a description of it. Tarballs fetched from `registry.npmjs.org` and
extracted this session (`extracted/*/`); `check` used as the common
probe icon since it exists in all seven.

| system | grid | shape model | multi-size handling | licence | source |
|---|---|---|---|---|---|
| Lucide | `viewBox 0 0 24 24` | stroke 2, round caps/joins | one master, scaled | ISC | `extracted/lucide/icons/check.svg` [S] |
| Feather | `viewBox 0 0 24 24` | stroke 2, round | one master, scaled | MIT | `extracted/feather/dist/icons/check.svg` [S] |
| Octicons | `viewBox 0 0 16 16` **and** `0 0 24 24` | filled path, no stroke | **two independently-drawn masters** | MIT | `extracted/octicons/build/svg/check-{16,24}.svg` [S] |
| Bootstrap Icons | `viewBox 0 0 16 16` | filled path | one master, scalable | MIT | `extracted/bootstrap/icons/check.svg` [S] |
| Carbon | `viewBox` = pixel size, 1 unit = 1px | filled path | **four independently-drawn masters**, 16/20/24/32 | Apache-2.0 | `extracted/carbon/svg/{16,20,24,32}/checkmark.svg` [S] |
| Material Symbols | `viewBox 0 -960 960 960` (internal 20x grid at nominal 48px) | filled path | 3 styles x 7 weights x 2 fill states as **separate static files**; the 4-axis variable font (wght/FILL/GRAD/opsz) is a different npm package | Apache-2.0 | `extracted/material/rounded/check.svg` + package README [S] |
| Phosphor | `viewBox 0 0 256 256` | filled path | **six independently-drawn masters** (thin/light/regular/bold/fill/duotone) | MIT | `extracted/phosphor-core/assets/regular/check.svg` [S] |
| Radix Icons | `viewBox 0 0 15 15` | filled path, `fill-rule evenodd` | none — one fixed size, React-component-only distribution | MIT | `extracted/radix/dist/react-icons.cjs.development.js` (`CheckIcon`) [S] |
| **This app** | `viewBox 0 0 24 24` | stroke 2, round | one master, scaled (see §1) | — | `js/icons.js` |

Confirmed by content, not just filename: Carbon's `checkmark.svg` at
16/20/24/32 have **four genuinely different path strings** (not one
scaled) — e.g. the 20px path has two overlapping `<path>` elements
(a rendering quirk of their export, visible in the raw file), the
24px a single cleaner path. Octicons' 16px and 24px checks likewise
differ in curve construction, not just scale. This is the real
substance behind "why two masters exist" (item asked for in the
brief): **a stroke this thin redrawn at half the size does not just
shrink, its terminals and curve tension need re-cutting to still
read as the same mark** — which is exactly the failure mode §1.1/1.2
measured for this app's own scaled icons.

Material Symbols' opsz axis, verbatim from the npm package README
[S]: *"SVGs are available for both unfilled (FILL 0) and filled
(FILL 1) states with grade (GRAD) 0 and size (opsz) 48px. Other
variations of grade and size are not included to keep the package
size small."* So the actual free-to-use static SVG distribution
**does not ship opsz correction at all** — only the variable font
does, and a variable font is not a per-icon SVG asset a
zero-dependency app can vendor a handful of. Material's opsz axis is
real and well-designed, but it is not something reachable from this
project's constraints without either the variable font (a font
dependency, K2/K5 territory per `07-karar.md`) or hand-authoring
the correction ourselves — which is exactly what "hand-drawn, to a
contract" already is.

### 2.1 Byte cost, single icon, raw / gzip

| source | raw | gz |
|---|---:|---:|
| Lucide `check.svg` | 315 | 239 |
| Feather `check.svg` | 262 | 201 |
| Octicons `check-16.svg` | 263 | 197 |
| Octicons `check-24.svg` | 247 | 198 |
| Bootstrap `check.svg` | 271 | 225 |
| Material `rounded/check.svg` | 240 | 196 |
| Phosphor `regular/check.svg` | 215 | 185 |
| Carbon `svg/24/checkmark.svg` | 138 | 150 |
| **`js/icons.js` `check` entry** | **35** | — (amortized in the shared file) |

[S, measured this session — `wc -c` / `gzip -c \| wc -c` on the
extracted files]

The app's own `check` entry is 35 bytes because the SVG root
attributes, the builder function, and the accessibility handling are
shared once across all 20 icons rather than repeated per file — a
standalone SVG file always pays that overhead per icon, a
`<script type="module">` importing 20 named exports never does. The
whole `js/icons.js` (20 icons, plus all its contract documentation)
is 10,238 bytes raw / 4,267 bytes gzipped [S, measured this session]
— cheaper gzipped than four of the single external icons above,
*combined 20 of them*.

### 2.2 Turkish- or exam-relevant glyphs — none, anywhere

Checked every system's icon list for anything domain-specific:
none of the seven ship a glyph for a cloze blank, a mistake book, a
streak, a proficiency-exam concept, or anything Turkish-specific —
expected, since these are general UI icon systems, not education- or
locale-specific ones. What hand-drawing buys here is not a glyph a
licensed set is missing in the abstract; it is that `flame` =
streak, `spark` = goal reached, `bolt` = mixed test, `target` = weak
spot, `pen` = the learner's name are **this app's own metaphors**,
already tuned to its own tokens, at a marginal per-icon cost (§2.1)
far below vendoring any of the seven — which is the same K5
argument `07-karar.md` already used to reject Radix/Headless-UI:
the win has to clear the maintenance cost of a new package, and at
20 icons of generic shapes it does not.

## 3 · Optical sizing, with numbers

Real font, real weights, rendered at 16x supersampling, stem width
of the letter `l` measured by the same 50%-luminance sub-pixel
method as §1.1 (`measure_text.mjs` + `analyze_text.py`, this
session):

| text role (actual app usage) | stem width (css px) |
|---|---:|
| nav label, 15px/600 (current) | 1.731 |
| nav label, 17px/600 (post `07-karar.md` type-scale decision) | 1.948 |
| body/row text, 18px/400 sans | 1.467 |
| English row title, 18px/400 serif (§7.1) | 1.611 |

[S, measured this session]

Paired against the icon strokes from §1.1:

| pairing (real usage) | icon stroke | text stem | ratio |
|---|---:|---:|---:|
| nav icon 24px vs 15/600 label (today) | 2.000 | 1.731 | 1.155 |
| nav icon 24px vs 17/600 label (after the type bump ships) | 2.000 | 1.948 | **1.027** |
| row chevron 20px vs serif English title 18/400 | 1.667 | 1.611 | 1.035 |
| row chevron 20px vs sans Turkish sub 18/400 | 1.667 | 1.467 | 1.136 |
| "finished" check 18px vs body 18/400 | 1.500 | 1.467 | **1.022** |
| chip icon 18px (flame/calendar/spark-fill) vs chip label 15/600 | 1.500 | 1.731 | **0.867** |

Two things worth flagging with numbers rather than eyeballing:

- **The nav icon gets better, not worse, once `07-karar.md`'s
  15→17 type bump ships** — ratio moves from 1.155 to 1.027, i.e.
  the icon and its own label's stem width nearly match. That
  decision was made for an unrelated reason (APCA x-height
  correction) and happens to fix an optical-weight mismatch it never
  set out to fix.
- **The one real mismatch is the chip icon.** `flame`/`calendar`/
  `spark-fill` render at 18px (stroke 1.5px) beside a 15px/600 label
  whose own stem is 1.731px — the icon is measurably *thinner* than
  the word next to it (ratio 0.867, the only pairing below 1.0 in
  this table). Specimen: `06-ornekler/optical-weight-chip.png`.
  Everywhere else the icon reads at or slightly above the text's
  weight, which is the expected direction (icons conventionally read
  a little heavier than body text, not lighter).

Specimens rendered against real tokens/fonts: `optical-weight-row-
nav.png` (chevron beside serif/sans row titles, nav icon beside
15px and 17px labels), `optical-weight-chip.png`.

## 4 · The figure layer, which does not exist

### 4.1 The real conventions

**ISOTYPE** [≈, WebSearch summaries of secondary sources — see
§Doğrulanamayanlar]: Neurath's Vienna Method represents quantity by
**repeating a unit at fixed size, never by enlarging one unit** —
"a greater quantity should not be represented by an enlarged
pictogram but by a greater number of pictograms repeated at the same
size," because size alone doesn't tell a viewer whether to compare
height, length or area, while a repeated count can be read or
literally counted.

**Tufte, sparklines** [≈]: "data-intense, design-simple, word-sized
graphics... with resolutions 5 to 100 times conventional graphics
and tables," and a defining constraint — data-ink ratio of 1.0, "no
frames, tic marks, and non-data paraphernalia."

**Tufte, small multiples** [≈]: "information slices that repeat a
common design several times within a user's eye span... each
instance showing different data values" — same structure, varying
only the data, so comparison is pattern-recognition rather than
re-reading a legend each time.

**Brinton, *Graphic Methods for Presenting Facts*, 1914** [≈]: the
first American book on information graphics; documented small
multiples and slope/bump charts decades before Tufte named them,
establishing that "same shape, repeated, data varies" is not a
modern invention but the oldest working convention in the field.

**ELT tense/aspect timelines** [≈, corroborated across several
independent search results plus general domain knowledge of these
widely-reproduced teaching diagrams]: a single horizontal axis, a
fixed vertical tick or "now" label marking the present, a **dot**
for a punctual, closed action (simple past) and a **line or shaded
band** running from the event up to "now" for an action whose
relevance continues (present perfect) — the same repertoire this
app's own `CLAUDE.md` describes lessons as needing: *"the boundary
between two things their ear conflates,"* not a description of
either tense alone.

### 4.2 A minimal vocabulary, proven feasible, not proposed as done

Two feasibility specimens, built from the app's **actual** tokens
(`css/style.css` loaded for real, not approximated hex values),
plain inline SVG (in real code this would be `createElementNS`
exactly like `js/icons.js`, no `innerHTML`), zero new dependency:

**`figure-poc-timeline.png`** — Simple Past vs Present Perfect. Axis
in `--hairline`, "now" tick in `--ink-2`, the punctual dot in
`--no`, the connecting band in `--ok`, stroke width 2 to match the
icon contract. This is the ISOTYPE/ELT convention applied directly
to this app's own "X vs Y" pedagogy (per `CLAUDE.md`) rather than to
a generic quantity chart.

**`figure-poc-isotype.png`** — countable vs uncountable, by
Neurath's actual rule: three discrete repeated unit-squares at fixed
size (`--accent` stroke) for "three apples" against one continuous
filled band (`--accent-tint` fill) for "some water." No pictorial
illustration (no apple, no glass) — purely the diagrammatic
convention itself, which is what the brief asked to investigate
("not illustration, not mascots").

Both render correctly against the real stylesheet with zero
additional code beyond the SVG markup itself — the tokens already
exist (`--ok`, `--no`, `--hairline`, `--ink-2`, `--accent`,
`--accent-tint`) and the icon contract's own rules (stroke 2,
`currentColor`-adjacent token colours, round caps) apply directly.

### 4.3 Where it fails

- **Coverage.** A tense/aspect timeline only serves the temporal
  slice of the syllabus. `docs/v1-plan.md` names the remaining work
  as vocabulary, `so/such`, and paragraph completion — none of which
  a timeline mark represents. A figure vocabulary for this app needs
  at least two shapes (temporal + the ISOTYPE-style
  quantity/countability one above) to cover more than a minority of
  lessons, and some categories (paragraph completion, cohesion)
  may not have a natural diagrammatic form at all — that is a real
  limit, not a gap to paper over with a third invented shape.
- **Screen-space budget.** Both specimens need roughly 60px of
  height at a legible size (see the 360x60 viewBox used above). This
  app is "a fixed-height shell: only `.app-content` scrolls, and
  answering a question must never move the button the learner is
  about to tap" (`CLAUDE.md`). Measured today: total on-screen icon
  footprint on the Eğitim tab is **2.315%** of a 390px-wide viewport
  (6 icons, bounding-box area, not ink) and on the Test tab
  **1.196%** (8 icons) [S, measured this session,
  `icon_area.mjs`] — icons alone cannot plausibly close the ≥10%
  mid-tone gate or contribute a durable ≥1.5% colour family on their
  own; a figure is the only drawn-layer candidate with enough area
  to matter, but that same area is what the fixed-height shell can't
  spend without a real layout decision (where, on which screen, at
  whose expense).
- **A 22nd component.** `docs/design-system.md` §7 is explicit:
  "Twenty-one. Every one has an entry in `docs/components.html`...
  the sweep fails the day a class in the components layer has no
  entry." A figure vocabulary is a new primitive, not a variant of
  an existing one (it isn't a Chip, Stat, or Progress) — which means
  it needs its own anatomy/sizes/states/tokens/accessibility row
  before it can ship, and `npm run verify`'s components sweep would
  need to know about it. That decision belongs to the synthesis
  round this brief says comes later, not to this arm.
- **Forced-colors safety.** Both specimens use token-derived colours
  (`--ok`, `--no`, `--accent`), which is necessary but not
  sufficient: `css/style.css`'s `forced-colors: active` block
  (line 1960) adds explicit borders to specific component classes
  (`.option`, `.nav__item`, `.chip`, …) because forced-colors
  discards fills outright. A figure that relies on a filled band
  (the present-perfect connector, the uncountable strip) would
  render as **nothing** under forced-colors unless it gets the same
  treatment — a `stroke` fallback outline, minimum — which today's
  icons never need because they are stroke-only to begin with. This
  is a real, specific cost a figure vocabulary adds that the icon
  set does not carry.

### 4.4 Measured baseline (what "no figures" costs today)

Screenshotting the live app (390px, real tokens, `shots.mjs` +
`midtone.py`/`measure-screens.py`, this session):

| screen | mid-tone (L\* 0.30-0.70) | event area | colour family |
|---|---:|---:|---|
| Eğitim tab | 6.3% | 9.6% | H30: 5.0% |
| Test tab | 7.6% | 10.8% | H30: 5.1% |

[S, measured this session against the live app on `localhost:8000`]

Both sit under the brief's ≥10% mid-tone gate and close to the
event-area gate; a colour family already clears ≥1.5% on both
screens today (H30, amber — consistent with `07-karar.md`'s
already-shipped v0.63 fixes, measured independently here). This
confirms the icons/drawn-layer alone are not the reason mid-tone is
still short — their total footprint (§4.3) is too small to move that
number regardless of ink density; only a larger drawn element
(a figure) has enough area to be relevant to that specific gate.

## 5 · The app icon and the link-preview card

### 5.1 Maskable safe zone — verified against the primary spec

W3C's manifest spec, fetched from `raw.githubusercontent.com/w3c/
manifest/main/index.html` this session [S], defines the safe zone
verbatim: *"a circle with center point in the center of the icon and
with a radius of 2/5 (40%) of the icon size."*

`tools/make-icons.mjs` sizes the `book-fill` glyph to 62% of the
icon canvas, centred. Working from the icon's own drawn extremes
(`book-fill`'s ink spans viewBox x:2-22, y:4-20 per the comment in
`js/icons.js:78-89`), I computed where that glyph's bounding-box
corners land relative to the safe-zone circle: at 0.3308 of the
icon's own radius from centre, against a 0.4-radius safe zone —
**17.3% of margin to spare** [S, computed this session from the
real geometry]. The 62% choice is not a round-number guess; it
clears the actual spec with real margin. Overlay specimen:
`appicon-safezone-overlay-512.png` (dashed circle = the safe zone,
solid glyph = the actual rendered icon).

### 5.2 Contrast and native-size legibility

Glyph amber `#f1af5d` on background `#0c1117`: WCAG 9.95:1, APCA
65.9 Lc [S, `tools/color.mjs`, this session] — not a risk at any
size.

Rendered the glyph *natively* at 16/32/48/64px (not a downscaled
512px raster — the geometry the browser would actually draw at that
size) — specimens `appicon-native-{16,32,48,64}px.png`. The spine
slot (2 viewBox units wide) scales to:

| render size | spine-slot width (css px) |
|---|---:|
| 16 | 0.83 |
| 32 | 1.65 |
| 48 | 2.48 |
| 64 | 3.31 |

[S, computed from the 62%-canvas placement rule in
`tools/make-icons.mjs`]

At 48px (a realistic home-screen icon size) and above, the "open
book" reads clearly — spine notch and slot both visible in the
specimen. At 16px (the size a browser tab favicon actually renders,
since `index.html:29` points the plain `<link rel="icon">` at
`icon-192.png` and the browser downscales it) the slot is sub-pixel
and the glyph will antialias toward a solid rounded blob rather than
a legible book. This is low-stakes — 16px is the tab favicon only,
not the home-screen icon, and most installed-PWA contexts use the
192/512 sizes where legibility is confirmed — but it is a real,
measured floor on this specific glyph.

### 5.3 Platform wiring — no gap found

`index.html` correctly serves `icon-180.png` via `apple-touch-icon`
(iOS ignores the manifest for Add-to-Home-Screen) and
`manifest.webmanifest` correctly lists 192/512 `any` plus a 512
`maskable` entry reusing the same full-bleed-safe asset [S, read
both files this session]. No missing size, no missing `purpose`
value, nothing to fix here.

### 5.4 Distinctiveness — the one item I could not measure

The brief asks whether the mark is "distinguishable from the
hundreds of language-app icons the owner's learner already has." I
could not fetch or render actual competitor app icons in this
sandbox (no general image fetch, and reproducing third-party app
icons would itself raise the branding concerns Artifact publishing
already refuses) — so this is stated from general category
knowledge, not measurement, and marked accordingly: **a plain
open-book glyph on a solid ground, with no mascot and no wordmark,
is one of the most generic possible choices in language-learning
app iconography** — most category leaders differentiate with a
mascot (an owl, a character) or a lettermark, not a bare book glyph,
because "book" as a category signifier is shared by nearly every
competitor. This is a directional finding worth the owner's own
comparison against his phone's actual home screen, not something I
can put a number on. [?]

## 6 · What it costs

| recommendation-adjacent finding | byte cost | build cost | forced-colors / prefers-contrast |
|---|---|---|---|
| Fix the stroke-scaling bug (§1.1) — either redraw 2-3 fixed masters per icon at the sizes actually used (18/20/24, matching Carbon's four-master precedent), or keep scaling and rewrite the §6 contract to say so | near-zero either way (a few hundred bytes/icon if redrawing masters; zero if only the doc changes) | authoring time only, `npm run icons` untouched, zero new dependency | no change — icons already use `currentColor` only |
| Address the `target`/chip-icon weight outliers (§1.4/§3) | zero | geometry tweaks to existing paths, no new tooling | no change |
| Adopt a licensed set instead (§2) | 138-315 bytes/icon raw vs this app's 35 bytes/icon marginal (§2.1); whole packages measured at 1.4-54MB unpacked | fails the same K5 gate `07-karar.md` already applied to Radix/Headless-UI — marginal win doesn't clear a new dependency's maintenance cost at 20 generic shapes | Octicons/Bootstrap/Carbon/Phosphor/Material are fill-based — same `currentColor` safety as this app's icons if vendored raw; Radix ships **only** as React components, so using it at all would mean either adding React (already rejected, `07-karar.md` §1) or hand-copying its SVG markup out of a `.js` bundle, forfeiting the licence attribution its distribution model assumes |
| Figure vocabulary, feasibility only (§4.2) | ~500-900 bytes/instance of inline SVG markup, comparable to a small existing component, not an icon | zero new dependency, `createElementNS` pattern already established by `js/icons.js`; but is a 22nd `docs/components.html` entry and a `verify-ui.mjs` sweep addition | **not free** — a filled figure (the present-perfect band, the uncountable strip) needs an explicit forced-colors fallback the way `.option`/`.nav__item`/etc already get (`css/style.css:1960`); stroke-only figures would be safe by construction, filled ones are not, today |
| App icon / link-preview card (§5) | no change recommended — already correct | `npm run icons` unchanged | n/a (PNG assets, not inline SVG; no forced-colors interaction) |

## Öneri

1. **The stroke-scaling bug is the highest-value, lowest-risk
   candidate.** It is measured exactly (§1.1, R² = 0.99983), it
   contradicts the project's own written contract, and it costs
   nothing to acknowledge either direction — redraw a small number
   of fixed masters (Carbon's four-master precedent is real
   evidence this is normal practice at this grid size), or update
   §6 to describe what the code already does. What it should not
   stay is silently inconsistent with its own documentation.
2. **Two specific optical-weight mismatches are real and numbered**
   (§1.4, §3): `target` reads 35.69% ink coverage against
   `chevron-down`'s 6.76% in the same list-adjacent role, and chip
   icons at 18px (stroke 1.5) read measurably lighter (ratio 0.867)
   than their own 15/600 label. Both are only worth revisiting
   *after* the scaling decision above, since stroke width is the
   input every one of these numbers depends on.
3. **A figure vocabulary is technically feasible at zero new
   dependency cost** — two working specimens prove it (§4.2), built
   from real tokens, no `innerHTML`, matching the icon contract's
   own stroke rules. But it is a new, 22nd component with a real
   screen-space cost inside a fixed-height shell (§4.3) and a
   forced-colors obligation the icon set doesn't currently carry
   (§6) — a scope decision for the synthesis round, not something
   this arm can or should resolve alone, per the brief.
4. **The app icon and link-preview card pass every check this arm
   could measure** — safe-zone margin (17.3% to spare, against the
   primary W3C spec), contrast (WCAG 9.95, APCA 65.9), native
   legibility to 32px, correct platform wiring at every size the
   manifest and `index.html` need. No fix recommended. The 16px
   favicon floor and the icon's category-distinctiveness are the
   two open questions, and neither is fully measurable from this
   sandbox (§5.2, §5.4).
5. **None of the seven reference systems checked has anything this
   app's icon set is missing for its own domain** (§2.2) — the real
   trade is per-icon authoring time against per-icon dependency
   weight, and on the measured numbers (§2.1) the hand-drawn set is
   still well on the right side of that trade at 20 icons. Adopting
   any of the seven would re-fail the same K5 gate `07-karar.md`
   already used to reject component libraries at a comparable
   scale.

## Doğrulanamayanlar

- **ISOTYPE, Tufte (sparklines and small multiples), and Brinton**
  (§4.1) are all sourced from `WebSearch` summaries of secondary
  discussion, not a primary page read directly — `en.wikipedia.org`
  and `archive.org` (which hosts Brinton's actual 1914 text) both
  returned `EGRESS_BLOCKED` in this session. Marked [≈] throughout
  §4.1; the claims are corroborated across multiple independent
  search results and are consistent with how these are commonly
  cited elsewhere, but I have not read the primary text myself this
  session.
- **The ELT tense/aspect timeline convention** (§4.1) is likewise
  [≈] — corroborated across several independent search results plus
  general trained familiarity with these widely-reproduced teaching
  diagrams (Murphy/Swan-style grammar references), but no specific
  reference-grammar page was fetched and read this session.
- **App-icon distinctiveness against real competitor icons** (§5.4)
  could not be measured at all — no image-fetch access to actual
  app-store icons in this sandbox, and reproducing third-party app
  icons here would raise the same branding concern the Artifact
  tool's own publishing rules already flag. Answered from general
  category knowledge only, marked [?].
- **iOS Human Interface Guidelines' own icon-shape numbers**
  (corner radius, safe area) were not checked — `developer.apple.com`
  was not reachable in this session's egress list, and only the
  W3C `maskable` spec (the one this app's manifest actually
  declares) was verified against source. The apple-touch-icon
  (180px) was rendered and inspected visually but not measured
  against Apple's own safe-area guidance specifically.
- **Radix Icons' and Phosphor's full licence text** — the `license`
  field from npm registry metadata was read directly [S], but the
  LICENSE file inside each tarball was not opened and diffed against
  it; treat the field value as reliable, the exact legal text as
  unverified [≈].
- **The social-card.png's crop behaviour** across chat apps
  (WhatsApp/Telegram/iMessage link previews, which each crop OG
  images differently) was not tested — only the source 1200x630 PNG
  itself was confirmed to exist and use the correct palette. [?]
- **Process note, not a content finding:** while this arm was
  working, a concurrent session in the same shared working directory
  committed and pushed a change (`b79bd5d`, "Denetim: dokuz ekranda
  tek bir dolu ara ton bölgesi yok…") that — by `git add`-ing broadly
  — swept up this arm's in-progress specimen files in
  `06-ornekler/` into its own commit on `test`, which is already
  pushed to `origin/test`. I did not run any `git` command myself in
  this session. I'm not in a position to confirm whether this was a
  one-off or will recur for the rest of this round's files
  (including this very report, once written) — worth the owner's or
  the orchestrating session's attention, since `CLAUDE.md` treats
  every push to `test` as a deploy and this brief explicitly asked
  every arm not to commit.
