# Design system

The binding specification for the interface. Written after a research pass
across colour, typography, layout, iconography, motion, components,
accessibility and mobile-web constraints; every rule below states *why* it
exists, because a rule without a reason gets overturned by the next person
who finds it inconvenient.

**Scope.** Two themes, both solved — dark by default and a light one
that follows the phone or a choice in Profil (since v0.43; the light
one is the one most people read better in, §11.5). Mobile first,
verified from 320 CSS px up. Static
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

## 0 · Structure

Rewritten 2026-09-10 as the first section, because it was the missing
one: six rounds of measured, green increments still did not add up,
and the reason was that nothing above the component level had ever
been designed (`docs/ui2-plan.md` §1). Three contracts, and everything
on a screen is an instance of one. **A new feature is placed, not
invented: which screen, which section, which container, which
components.** If it cannot be described that way, the feature is not
ready.

### 0.1 The screen

Every screen has the same anatomy and declares it:

```
screen
  bar    leading · title · trailing        opaque, 56px, hairline below
  body   the one scroll region             sections; gutter 16; measure 608
  foot   tabs | actions | none             opaque, hairline above
```

- **The bar always has a title, and the title is the screen's name.**
  Roots are titled by their tab — *Eğitim*, *Test*, *Profil*; a child
  by what it is — the topic's name, the lesson's category, the test's
  name with its count, *Sonuç*. The brand is not a title and is not in
  the chrome. A person always knows where they are; that is what
  structure means.
- **Leading** is the way back on a child, named for where it goes
  (*Konular*, *Dersler*, the tab Profil was opened from; *Çık* or
  *Bitir* in the quiz), and empty on a root. **Trailing** holds one
  thing: the profile control on a root, a readout on a child. A
  progress line may run along the bar's bottom edge — the reader's
  position, the quiz's count.
- **Foot** is the tab bar on a root, the action bar where the screen
  has a forward action (the topic screen, the quiz, the results), and
  nothing in the reader, whose forward actions are at its end.
- **Bars are opaque and take their height in the column.** Nothing
  scrolls under chrome. Translucent, floating chrome was tried
  (v0.56) and failed as structure on every phone that did not
  composite the blur: text through text, rows under a capsule.
  `js/shell.js` `createBar` is the one place a top is made.

### 0.2 The section

A body is a vertical sequence of sections. A section is a **head** — a
label (`.t-label`, 15/600 in the accent's text colour, tracked) with an
optional one-line hint (`.t-quiet`) — and **one container**:

| container | holds | separation | class |
|---|---|---|---|
| **list** | homogeneous rows | a hairline between rows, nothing around | rows in a `div`, or `.items` |
| **card** | one heterogeneous group with an action | the card's fill, 16px radius | `.surface` |
| **prose** | paragraphs and inline marks | space only | `.prose` |
| **band** | one raised block inside prose — the contrast | the card's fill, full-bleed, no radius | `.block--contrast` |

48 above a head, 8 below; 32 between unlabelled sections. A section
never contains a section; a card never contains a card; a list is never
inside a card. The head may be omitted only on a screen's first section
when that section is a card that carries its own label.

### 0.3 The component

Fourteen, each with a spec in §7 and an entry in `docs/components.html`,
and the sweep fails if a class in the components layer has no entry:

Bar · TabBar · ActionBar · Button · Row · Card · SectionHead · Stat ·
Chip · Field · Listbox · Dialog · Progress · Feedback/Option.

Components reference the **semantic** tokens (`--page`, `--card`,
`--raised`, `--ink`, `--ink-2`, `--accent`, `--accent-ink`,
`--accent-text`, `--hairline`, `--edge`, `--focus`, `--ok`, `--no` and
the tints) and the **component** tokens (`--target`, `--bar-h`,
`--btn-h`, `--btn-h-primary`, `--row-min`). They never name a primitive
(`--c-*`), which is what lets a theme be a rebinding.

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
the one nearest the text.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--c-surface-0` | `#0C1117` · `oklch(0.175 0.014 255)` | `#F6F1E7` | The page. Everything sits on this by default. |
| `--c-surface-1` | `#181D23` · `oklch(0.228 0.014 255)` | `#EEE8DD` | A raised block: the one card level, or the reader's full-bleed band. |
| `--c-surface-2` | `#262B31` · `oklch(0.286 0.014 255)` | `#E5DFD3` | Overlay only: dialog, listbox menu, a control sitting on a card. |

**The dark ground is slate, hue 255, chroma 0.014.** It was warm (H
67–78) until 2026-09-09, and that was the structural cause of the
interface reading *shallow*: every non-semantic token — page, cards,
all three greys, the accent, the focus ring, the dividers — sat inside
one eleven-degree hue band, so hierarchy and depth had a single
channel, lightness, and on a dark ground APCA had already spent most of
it. A cool ground gives the warm accent a second axis to stand against.

**The light ground is paper, hue 85, L 0.96** — cream, two lightness
steps below the cool near-white the theme first shipped with, which the
owner used and called unreadable. That was glare: a full-brightness
cool white with maximal-contrast ink on it. The ink is a warm dark
(hue 70). On light the accent and the ground share a family again, and
that is not the dark theme's defect recurring: here the accent is a
saturated dark on a pale ground, the classic ink-on-paper pairing, and
depth runs in the direction the eye expects. `docs/research/premium.md`
§1 has the evidence and the cross-check against `apca-w3`;
`docs/research/beta1-palette.md` has the slate; `tools/palette.mjs` is
the source of truth and `npm run color` prints the measured table for
both themes.

**Elevation is a lightness step away from the page, in whichever
direction the page is not.** Dark surfaces lighten by ≈0.055 L per
step; light surfaces darken by the same budget. So the worst case for
text is `--c-surface-2` in both themes, for opposite reasons — on dark
it is the surface nearest light text, on light the one nearest dark
text — and every foreground token is measured against it.

**Never `#000000`, never `#FFFFFF`.** Light text on pure black blooms
(halation), which is worst for exactly the sustained reading this app is
for; and a pure ground leaves nowhere to go for elevation.

### 1.3 Text

Solid tokens, never white-at-N%-opacity. A translucent token has a
*different* effective contrast on every surface in the ramp, so one token
would silently carry three contrast values. Material 3 made the same move,
dropping M2's alpha-based emphasis for solid roles.

| Token | Dark | Light | APCA Lc (worst surface) | Use |
| --- | --- | --- | --- | --- |
| `--c-text-1` | `#E9ECEF` | `#211B14` | 91 / 85 | Body prose, English sentences, headings, controls |
| `--c-text-2` | `#D0D4DA` | `#413A31` | 76 / 77 | The one-line tier at 600; the quiet sentence at 18/400 |
| `--c-text-3` | `#B5BAC2` | `#685F54` | 61 / 63 | **No text rule uses it.** Kept as a token and for `prefers-contrast` |

On light, `text-1`'s requirement is **Lc 85** rather than 90: it
measures 85 against the darkest cream and 88–90 against the two
surfaces prose sits on, and APCA's 90 is the *preferred* level on a
ground that has no glare problem, which the old white did. Every size
pairing still clears the font matrix by the same margins.

**The weight axis points up.** 400 reads; 600 heads, labels and
emphasises. No tier quieter than body is ever heavier than body, except
a one-line label. The opposite arrangement was tried — every secondary
tier at 15/600 in the second grey, because that pair clears APCA — and
it made *quiet*, *label* and *subtitle* one style, 83% of the index's
characters and 98% of Profil's. Each piece was legible and every piece
was the same piece.

**`--c-text-2` is legal at exactly two pairs.** 15/600 anywhere (Lc 76
against a requirement of 75, in both themes), and 18/400 on `surface-0`
and `surface-1` only — the quiet sentence, `.t-quiet` — where it
measures 79–80 against 75; on `surface-2` it measures exactly 75, which
is the requirement and not a margin, so a paragraph never sits there in
the second grey. Quiet text below 18px does not exist on either ground:
15/400 needs Lc 100 and no ink reaches it.

The three greys are closer together in lightness than a palette chosen by
eye would put them. That is the cost of APCA compliance, and it is paid
deliberately — **hierarchy is carried by size and weight first, lightness
second.** If two tiers of grey are doing the work, the type is wrong;
and if one style is doing every secondary job, the type is also wrong.

### 1.4 Accent

**The accent is a pair — one value per theme — because one amber cannot
serve both.** Dark ink on a fill that clears 3:1 against a light page
has no solution at any hue or chroma scanned. Inverting the ink opens
one window: a burnt amber with the page itself as the ink.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--c-accent` | `#F1AF5D` · `oklch(0.80 0.125 70)` | `#A05801` · `oklch(0.535 0.125 60)` | The one filled action per screen. |
| `--c-on-accent` | `#1A0F03` | `#F6F1E7` (= `surface-0`) | Label on `--c-accent`, **body size at weight 600** — measured into `PAIRS` in both themes. |
| `--c-accent-text` | `#F5CE95` | `#623200` | Emphasis, links, the text button, section labels. Lc 77 / 76. |
| `--c-accent-tint` | 14% of the accent | 14% of the accent | The tint behind an accented chip. |
| `--c-focus` | `#F4DAB2` | `#825023` | Focus ring. |

**Amber is structurally a dark-ink-on-fill colour**, the same class Radix
puts amber, yellow, lime, mint and sky in — their solid step is designed
for dark foreground text
([Radix](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)).
Never white on the dark amber.

**The measured ceiling on the dark fill: no ink reaches Lc 75.** Pure
black tops out at Lc 68; the ink ships at 67, which APCA's font table
clears at 18px/600 and not for body text — so **the amber fill carries
short bold labels and nothing else. Never a paragraph, never a
sentence.** The light fill has the same rule for the same reason from
the other side.

**Amber owns "highlight". There is no warning role.** The standard
colour-universal warning hue is `#E69F00`, which is amber
([Wong 2011](https://www.nceas.ucsb.edu/sites/default/files/2022-06/Colorblind%20Safe%20Color%20Schemes.pdf)).
Rather than leave "highlighted" and "caution" indistinguishable, this app
simply has nothing to warn about; if that changes, warning is expressed by
icon and copy, not by hue.

### 1.5 Semantic — indicators, not text

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--c-ok` | `#7CCD8E` | `#1F8944` | Correct: icon, tint, indicator |
| `--c-no` | `#E97871` | `#D14B48` | Incorrect: icon, tint, indicator |

**Red cannot reach Lc 75 at any usable chroma on the dark ground** —
only at chroma 0.05, by which point it is pink. Red is inherently
low-luminance; this is a property of the colour, not a palette flaw.

The resolution is not a washed-out red. It is that **semantic colours are
never text colours.** The words "Doğru" and "Yanlış" are set in
`--c-text-1`; the hue lives in the ✓ / ✕ glyph and the row tint, where the
requirement is 1.4.11's 3:1 for non-text, which both clear in both
themes (7.5 / 5.0 dark, 3.1 / 3.2 light).

This is also what WCAG **1.4.1 Use of Color (Level A)** demands anyway:
correct/incorrect must never be conveyed by colour alone. The feedback
block therefore carries **four redundant channels** — glyph, word, tint,
and the answer itself — so it survives greyscale, colour-vision deficiency
(~8% of men), a phone in sunlight, and forced-colors mode.

#### 1.6 Two lines, and the distinction is load-bearing

`--c-hairline` (`#2F3339` / `#D6D1C8`) **separates**. Contrast against
the page is 1.12 — far below 1.4.11's 3:1, and legitimately so: a
decorative separator is exempt.

`--c-edge` (`#71767D` / `#76736B`) **identifies a control's boundary**,
which 1.4.11 requires at 3:1. It is the value nearest the page that
clears 3:1 against all three surfaces, and it exists for exactly one
reason: no two surfaces in this ramp are 3:1 apart, so a fill cannot
delineate a text field. A field with no visible edge is a conformance
failure and a usability one at once. This is the only place a border is
required rather than forbidden.

For everything else the rule is absolute: **no border ever carries
state.** State is expressed by fill, glyph or text. This is the same
conclusion the "no boxes" direction arrived at from the visual side,
reached independently from the contrast maths — which is a good sign it
is right.

### 1.7 Rules

- Every foreground token is measured against the surface **nearest the
  text in lightness** — the lightest on dark, the darkest on light. This
  one rule is what stops an elevation ramp from quietly breaking text
  contrast.
- Tokens are named by **role**, never by value. `--c-surface-1` survives a
  palette change; `--c-slate-800` does not. It survived one on 2026-09-09.
- Author in OKLCH with a hex fallback declaration above it. Equal lightness
  across hues means equal measured contrast across hues, so contrast is
  calibrated once per level rather than once per colour.
- **The light theme is written twice**, because there is no build step:
  once under `@media (prefers-color-scheme: light)` guarded by
  `:root:not([data-theme="dark"])`, once under `:root[data-theme="light"]`.
  The media query carries the phone's preference and yields to an
  explicit dark choice; the attribute carries a choice and beats a light
  phone. `js/theme.js` owns the attribute, `<meta name="theme-color">`
  and `<meta name="color-scheme">`; a blocking script in each page's head
  reads the stored preference before the stylesheet lands, so a cold
  start never flashes the wrong theme. The sweep checks all of this
  (*iki tema*).
- `<meta name="color-scheme" content="dark light">` in the head, so form
  controls, scrollbars and the dialog backdrop follow the page.
- `@media (prefers-contrast: more)` lifts `--c-text-2` one tier and makes
  hairlines visible, re-solved per theme. Cheap, and it directly serves
  low-vision students.
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

Base **18px** for prose. Five steps, and every adjacent pair is at least
1.2 apart:

| Step | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| `--t-display` | 36 / 40 | 600 sans · 400 serif | The lesson title; the results score |
| `--t-title` | 28 / 32 | 600 | Screen title, card title, stat value |
| `--t-lead` | 22 / 28 | 400 | Contrast side labels, example sentences, decision outcomes, cloze stems, the header's brand |
| `--t-body` | 18 / 28 | 400 (600 on a button or a verdict) | Turkish prose, English examples, rows, options, buttons, fields, the listbox |
| `--t-meta` | 15 / 20 | **600, always** | One line: a label, a counter, a row sub, a chip, a nav item, a quiet button |

**The old scale had 19, 17, 16 and 15 in its middle** — two one-pixel
"steps" where eighty per cent of the reader's characters lived — so
size carried no hierarchy where it was needed most. Body is 18 rather
than 16 because that is the smallest size at which the second grey at
weight 400 clears its ground (§1.3); 16/400 needs Lc 90 and only
`--c-text-1` reaches it, which is why a *quiet* tier could not exist
below 18.

**The scale bottoms out at 15px, and that is a contrast decision.**
It used to run to 13 and 11. APCA's font matrix requires **Lc 113 at
13px/400** and **Lc 117 at 11px/600**, and the ceiling on this ground is
**Lc 107 with pure white ink**, which §1 forbids — so those two steps
were unreachable by any grey, in this theme or any other, and a census
found **54% of the app's rendered characters sitting in them**. They are
gone rather than dimmed differently. `--t-micro` was removed instead of
resized so that no call site can drift back below 15.

**At 15px there is exactly one legal pairing: weight 600 in
`--c-text-2`** (needs Lc 75; measures 76 in both themes against the
worst surface). 15/400 needs Lc 100 and nothing reaches it — an earlier
edition of this table listed 15/400 in `--c-text-1` as legal at Lc 90,
and that row was wrong; the tool built with the real matrix caught four
rules set that way. Two consequences: **the meta tier is one line, and a
sentence is never meta** — anything longer than a line that is quieter
than body is `.t-quiet`, 18/400 in the second grey on `surface-0`/`1`,
or it is body. And **English has a floor of 18px**: the serif ships at
400 only, and 15/400 clears no ground.

**At most four sizes on a screen.** Display appears in the reader and on
the results; a tab screen has the brand at 22, a title at 28, body and
meta. The sweep counts the rendered sizes on every screen it lands on
and fails at five; the component page is the one exemption, being the
catalogue.

**`npm run color` checks the pairing, not just the token.**
`tools/palette.mjs` carries APCA's `fontMatrixAscend` rows for the weights
this app ships, interpolates between them, and measures every (selector,
size, weight, token, ground) the stylesheet declares — including the
primary button's label against the amber in both themes. **Adding a rule
that sets text means adding its row to `PAIRS`** — a pair that is not
listed is not checked. And because a utility class can override a
component's weight where the table cannot see it, the sweep audits the
*rendered* pairs too: nothing at 15px lighter than 600, nothing heavier
than 600.

**`--c-text-3` is used by no rule.** At Lc 60 it clears only 22px at
weight 600, and nothing in the app pairs those. It survives as a token
and in the `prefers-contrast: more` override; it should not come back as
a text colour.

**Every line-height is a multiple of 4** so type lands on the spacing
grid; where the strict ratio lands off-grid it is rounded up, which is
what design systems actually do rather than snapping to a baseline grid
(that breaks on the first image or fluid element). Line-height ratio
**falls as size rises** — 1.56 at body, 1.11 at display. A fixed ratio
makes large text look loose.

### 2.3 Measure

Reading text is capped at **65ch**. At 320px this is inert — the arithmetic
does not resolve: 288px of usable width at 18px is roughly **32 characters
per line**, below Bringhurst's 45 floor and Baymard's 50, and the only way
to reach 45 would be dropping type below the size the second grey needs
(§2.2), which is worse. **Accept the short measure and hold 18px.** The cap binds on tablet and desktop, which
is where it was going to be needed anyway — and it binds as a *ceiling*
there, not as a target the layout grows towards: what a wide window is
allowed to do with the width instead is §7.3.

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

**Nothing asks for a weight above 600.** A request for 700 resolves to
the 600 face without synthesis in the sans — Chromium takes the nearest
face at or above 600 — but the *fallback* face during the swap is a real
700, so a label declared at 700 lightened as the webfont landed. The
stylesheet declares 600 only; `strong`, `b` and `em` are pinned to 600
rather than `bolder` (a bold inside a 600 label computes to 900); and
the sweep fails on any rendered weight above 600.

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
`--s-9: 48px` · `--s-10: 64px`

**Which step goes where** — the rule the scale lacked until the reader
was measured against it:

| relation | value | rule |
|---|---|---|
| label → its content | 8 | a label belongs to what is under it |
| line → line inside one object (pattern → use, sentence → note) | 4 | one object (`.stack--snug`) |
| item → item inside a block (contrast sides, examples, rules) | 24, plus a hairline where the items are homogeneous | `.items` |
| paragraph → paragraph | 16 | |
| block → block | 32 | `.stack--loose` |
| **above a labelled block** | 48 | space above a heading is at least twice the space below it; a label with the same 32 above it that every unlabelled block had grouped nothing |
| around the one band (the contrast) | 48 | a band without air is a stripe |
| before a screen's last card (lesson end) | 64 | the end is a section, not a block |

The principle is alternation: 4 / 24 / 48 in the reader, not 8 / 16 / 32.
Three adjacent steps are arithmetic; hierarchy needs geometric.

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

**No shadows.** Elevation is `--card` / `--raised`. A modal gets a
scrim, not a shadow; the scrim does the separating work a shadow cannot
do on a dark ground. (v0.56 made one exception for a floating tab bar;
v0.57 removed the bar and the exception with it.)

Cards are `--r-3` (16px); controls and fields `--r-2`; chips and the
tab bar's selected capsule the pill.

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

**Route changes are one crossfade.** The app is one document with a hash
router, so `js/home.js` wraps the synchronous part of a route change —
showing the view, moving focus — in `document.startViewTransition()`,
and the browser makes a 220 ms crossfade from two snapshots. Never the
asynchronous part: a transition that waits on a fetch freezes the old
screen under the finger. It is skipped under `prefers-reduced-motion:
reduce` and where the API is missing (same-document view transitions
are baseline in every engine since late 2025). The screen that arrives
carries `.animate-in` — opacity only by default, a 6px rise when motion
is welcome — and so do the reader, the topic screen and each quiz
question. The feedback band does not: answering a question is the one
action that must appear, not perform.

**Three things animate, and no fourth**: the route crossfade, the
entrance of an arriving screen, the eased progress fill. Pressed states
scale; hover changes surface. An ambient glow was tried (v0.56) and read
as a smudge; it is gone.

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

Fourteen. Every one has an entry in `docs/components.html` showing every
state it has, in both themes, and the sweep fails the day a class in the
components layer has no entry (§0.3). The specs, one line each on
anatomy · sizes · states · tokens · accessibility:

| # | Component | Anatomy | Sizes | States | Accessibility |
|---|---|---|---|---|---|
| 1 | **Bar** `.bar` | lead · title · trail; optional progress line | 56px; title 18/600 centred, clipped before it wraps | — | the title is a `<p>`, the screen's own heading stays in the body; back is a real button |
| 2 | **TabBar** `.nav` | two `<a>` with icon + label | 48px items, capsule on the current | current | a `<nav>` landmark with `aria-current`, never a tablist |
| 3 | **ActionBar** `.shell__bar` | one or two `.btn`, or a hint | 52 + 2×8, fixed | hint / one / two | equal halves; labels never wrap; no disabled button — a hint instead |
| 4 | **Button** `.btn` | label, optional 20px icon | 48; primary 52; min 88 wide | hover (surface), pressed (scale .97), focus (outline), `aria-disabled` | filled / tonal (`--secondary`) / quiet / text (`--text`) / icon (`--icon`); one filled per screen |
| 5 | **Row** `.row` | lead (24) · main (title, sub ≤2 lines) · trail | min 56 | hover, `aria-checked` as a switch | a `<button>` or `<a>`; the whole row is the target |
| 6 | **Card** `.surface` | a label, content, an action | 16 padding, 16 radius | — | one level; controls on it step up to `--raised` |
| 7 | **SectionHead** `.t-label` + `.t-quiet` | label, optional hint | 15/600 tracked; hint 18/400 | — | an `<h2>` or `<h3>` in the body's outline |
| 8 | **Stat** `.stats` | value over label | 28/600 tabular over 15/600 | — | two by two at 8rem minimum |
| 9 | **Chip** `.chip` | one word | 15/600 pill; English 18 serif | ok / no / accent | never interactive |
| 10 | **Field** `.field` | the one border in the app | 48; 18px | focus, `--multiline` | a label or `aria-label`, always |
| 11 | **Listbox** `.listbox` | trigger + menu | 48 trigger; 44 options | open (raised trigger), active option | the select-only combobox contract, §8.2 |
| 12 | **Dialog** `.dialog` | title, body, two equal actions | 22rem max | open | native `<dialog>`, §8.3 |
| 13 | **Progress** `.progress` | a 3px track and fill | — | eased fill | the reader's position on the bar's edge |
| 14 | **Feedback** `.feedback` + **Option** `.option` | verdict glyph + word, body, report; answer rows | 52 rows, serif | ok / no, `aria-disabled` once answered | four redundant channels, §1.5; the group points at its stem |

Two shapes sit inside the inventory rather than beside it: `.btn--icon`,
a fixed 48px square a flex row cannot squeeze; and `.blank`, the cloze
gap — a rule on the baseline, uniform width so it cannot leak the
answer.

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

A row's title is body size — serif at 400 when it is English. Its
secondary line is **one line, or a fixed two** when the sub *is* the
distinguishing content (the index gloss, the lesson summary), clamped
rather than ellipsised — never a ragged count. A hint that wraps to four
lines gives every row in the list a different height, which is the same
unscannability by another route; an ellipsis at "görül…" in the first
row of the app is the other failure.

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
| Label | `--t-body`, weight 600 — on the amber fill measured into `PAIRS` in both themes (§1.4); never wraps in the action bar |
| Icon | 20px, `--s-3` gap |
| Minimum width | 88px, so short Turkish labels don't produce runts |

Three levels, one filled per screen: filled → tonal → text. In the
action bar two actions are equal halves — a 1:2 split, then a
label-width retreat, both read as a broken structure — and no label
wraps. **No outlined buttons.** An outlined button inside a tinted band is a frame
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

### 7.3 The second column

Layout, like the shell — it draws nothing, owns no colour and adds no card
level. `.split` is `.stack` with a second column, in the way `.cluster` is
a row.

**A wide window does not get a wider page.** §2.3 caps reading text at
65ch and that cap is a constant, not a starting point: the comprehension
evidence puts the useful band at roughly 55–75 characters and has raw
reading *speed* still improving past it, which is the wrong dependent
variable for a screen whose job is a learner deciding between four forms
of one verb. The reading column is 608px at 320px of window and 608px at
2560px, measured in the sweep.

**What a wide window gets is a second column**, holding content that was
otherwise below the fold. That is the one thing the desktop-layout
research is unambiguous about: a page spread thin across a wide window
measures *worse* than the same page condensed — more space, fewer elements
per screenful, higher interaction cost — so the win is content per
screenful, never pixels per line.

| | |
| --- | --- |
| Pane | `--w-aside`, **320px** |
| Reading column | `--w-page`, **640px** (608px of content) |
| Frame | `--w-wide` = pane + `--s-8` + column = **1000px** |
| Engages at | **`min-width: 1080px` and `min-height: 600px`** |

1080 is the frame plus a section gutter either side, so the breakpoint is
derived from the content rather than from a device. **The height condition
is not optional**: a landscape tablet is wide and short at once, two panes
on a short window is the documented way "tablet support" ends up worse
than the phone layout it replaced, and 1024×600 and 1280×560 both fall
back to one column on purpose.

320px is not a new minimum to verify. It is *wider* than the 288px of
content a 320px phone has, so nothing inside a pane meets a width the 320
sweep has not already covered — which is why this could be added without
re-authoring anything.

**Where it applies, and where it deliberately does not.**

| Screen | Pane | Reading column |
| --- | --- | --- |
| Eğitim index | the start card | search + all ten topics |
| Topic overview | its six lessons | the overview prose |
| Test | mixed test, mistake book, weak spots | the ten topics |
| Profil | what the app says about itself | the learner's own figures and data |
| Results | score and both breakdowns | the review |
| **Lesson reader** | **none** | a reading surface gains nothing from a second column; the measure is already the whole answer |
| **Quiz** | **none** | a question, four options and one action are *one thing*. Splitting a decision screen turns it into a scanning screen, and a 2×2 option grid additionally destroys the option order the distractors were written in |

Three rules the pane keeps:

1. **Source order is never rearranged to get a side.** It is the reading
   order for a screen reader and the Tab order for a keyboard (1.3.2), so
   the two stay the same thing; `.split--main-first` moves the *tracks*
   when the reading column belongs on the left.
2. **Which pane is which is decided by content, not by importance** —
   prose keeps the measure, a scannable list takes the 320. The topic
   overview is the case that makes this concrete: the lessons are the
   list, so they take the pane even though they are what the learner came
   to choose from.
3. **A split has exactly two children**, because the tracks are
   positional. Below the breakpoint there is no rule at all — a `.split`
   is the `.stack stack--loose` it always was, and the phone layout is not
   restored by a media query, it is never left. Verified as pixels: the
   390 and 768 screens are byte-identical across this change.

**Where it stops.** The frame stops at 1000px and centres. Past that there
is no third content stream on any of these screens, and widening the two
that exist would spend the width on eye travel — a row whose title and
value are 2000px apart is the unscannable list §7.1 is about. A 2560px
window showing the whole of Profil at once, with black either side, is the
finished state and not an unfinished one.

**The action bar follows the panes.** A frame with two columns has four
keylines, and a bar sharing 1:2 of the whole width lands on none of them.
Where the pane is on the left the retreat takes the pane's width and the
advance takes the reading column — still §7.2's forward-takes-twice, now
on the keylines. Where the pane is on the right the same rule would invert
the two, so there the bar is left as it is.

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
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#0c1117">
<!-- js/theme.js rewrites both when a preference is stored or chosen -->
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

- `npm run color` — every token and every declared size pairing
  re-measured against its requirement in both contrast models, in both
  themes. A failing token fails the build of the palette, not the
  reviewer's eye.
- `npm run validate` — content schema and cross-file consistency.
- `npm test` — scoring and storage logic.
- Playwright sweep at **320 / 390 / 768 / 1280, and 390 again in the
  light theme**: no horizontal overflow, no target under 44px, no console
  error, at most four rendered sizes, no rendered pair the scale forbids,
  no bar label on two lines, on every screen the journey lands on; the
  theme as a state (stored, followed, chosen, restored) in its own
  section; **the anatomy** — a titled bar on every screen, its three
  slots never overlapping, opaque bars, content starting below the bar
  and ending above the foot; **the catalogue** — every class in the
  components layer present on `docs/components.html`, audited in both
  themes. 1280 is also where the second column (§7.3) is in force,
  so the wide layout conforms per this list rather than beside it, and a
  section of its own additionally measures the split against §7.3: that it
  engages at 1280×900, stands down at 768×1024 and at 1280×560, that the
  reading column is the same width at 760 and at 1600, and that a screen
  with no pane keeps the 640px page at any window width.
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
2. ~~**Dark-mode weight compensation.**~~ **Closed 2026-09-09.** The
   question was moot while the weight axis pointed backwards — every
   quiet tier heavier than body — and the app ships two weights, so
   there is no 350 or 450 to reach for. Revisit only if a real phone at
   real brightness shows the 400 body reading thin on dark, and then
   with the light theme as the first answer.
3. **The 20–30% accent desaturation figure** is a heuristic repeated by
   secondary sources, not a standard. The palette here was solved by
   measurement instead, which is why it does not appear as a rule.
4. ~~**Three text tiers this close in lightness**…~~ **Settled
   2026-09-08, and the prediction held.** The owner reported skimming
   past hierarchy and small type when reading quickly. Measurement found
   the cause was not the tiers being close but the app pairing its two
   smallest sizes with its weakest colour — contrast falling exactly as
   size fell, which is backwards. This section's own prescription was
   followed: more size and weight separation, not dimmer greys. The scale
   now stops at 15px and `--c-text-3` carries no text. See
   `docs/audit/type-contrast.md` for the measurement and
   `docs/research/ui-improve.md` for the evidence.
5. **Dark mode is worse for reading for most people.** NN/g's review of the
   Piepenbrock studies found light mode won on both visual acuity and
   proofreading, for young and older adults alike, with the gap widening as
   type got smaller — and participants reported no perceived difference
   while performing worse. Dark-only is a legitimate product decision, made
   here on the owner's preference and on the app being used at night. The
   cost is that **type size and contrast have to be more generous than a
   light app would need**, which is why §1 targets Lc 90 and §2 holds
   18px for prose. **The light theme shipped in v0.43** — as this item
   predicted, the values were new rather than inverted, solved by the
   same tool at the same bar — and the owner's report that small type
   was being skimmed while the design "looked perfect" was this study's
   signature. Two things only a real phone can settle remain: whether
   the slate reads *blue* on an OLED at night (then chroma 0.010 or hue
   240), and whether the light button reads *brown* (then hue 50–55).
