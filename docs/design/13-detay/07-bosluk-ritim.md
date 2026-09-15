# Arm 7 — space, grid and rhythm

All line numbers below are against `css/style.css` at commit
`b79bd5d` on `test` (2026-09-15), the commit this session read.
Command lines are runnable in this repo as written. Browser numbers
were measured live with Playwright/Chromium
(`/opt/pw-browsers/chromium`) against `npm run serve` on `:8000`,
scripts kept in this session's scratchpad and reproducible from the
commands quoted.

## 1 · The real scale, audited

**Tokens.** `css/style.css:79-95`, ten spacing steps and five radius
steps:

```
--s-1: 2px   --s-2: 4px   --s-3: 8px   --s-4: 12px  --s-5: 16px
--s-6: 24px  --s-7: 32px  --s-8: 40px  --s-9: 48px  --s-10: 64px
--r-1: 8px   --r-2: 12px  --r-3: 20px  --r-4: 28px  --r-pill: 999px
```

Plus a separate, deliberately un-pooled family the design system
calls **component tokens** (§0.3): `--target`, `--bar-h`, `--nav-h`,
`--btn-h`, `--btn-h-primary`, `--row-min`, `--ring-size`,
`--ring-stroke`. This distinction matters for what follows: a literal
`56px` in the components layer is not automatically spacing-scale
drift if it is one of these — a single-use anatomy dimension, not a
gap.

**The audit** [S], counted directly against the file, layout layer
onward (`css/style.css:400-1986`, i.e. everything after the token and
reset layers):

| kind | declarations | on-token | off-scale |
|---|---:|---:|---:|
| padding / margin / gap | 97 | 95 (98%) | 2 |
| border-radius | 33 | 29 (88%) | 4 |

Command: `awk 'NR>=400{print NR": "$0}' css/style.css \|
grep -E '(padding\|margin\|gap)[a-z-]*:'` and the equivalent for
`border-radius:`.

The two spacing exceptions: `margin-block-start: 2px` at
`css/style.css:1523` (the option's check-mark glyph nudge) — this
*equals* `--s-1` exactly, it is simply not written as `var()`, so it
is not drift in value, only in form; and `gap: 0.35em` at
`css/style.css:1656` (the quiz strip's inline readout, e.g. "3 / 10")
— an em-based gap between baseline-aligned inline text is correctly
outside the px spacing scale by *kind*, the same reason the type
scale's own line-heights are px and its letter-spacing is em.

The four radius exceptions are all `border-radius: 50%` —
`css/style.css:729` (hero orb), `865` (avatar), `1040` (switch
thumb), `1710` (onboarding orb) — every one a 1:1 box that has to be
a true circle. No token in a linear or geometric radius scale can
produce a circle except by coincidence of matching half the box's
side; `50%` is the only correct value for a circular element,
regardless of scale. This is not an exception to explain away, it is
a case the radius scale was never supposed to cover.

**So: 130 real declarations, 2 off-token and both defensible, 0
unexplained.** This is not "a scale with 40 exceptions." It is close
to the cleanest layer in the stylesheet — cleaner than colour was
before `tools/token-check.mjs` existed to enforce it (`07-karar.md`
§4: `--c-edge` shipped 2.89:1 against a measured 3.12:1 and nothing
caught it for a release). Nothing enforces the spacing scale the way
`npm run color` enforces the palette — no `spacing-check.mjs` exists —
and it held anyway. That is itself worth recording: the eight
rejected rounds all touched colour, light, motion or structure, and
none of them touched a hand-typed pixel value in a padding
declaration, which is exactly the kind of drift that accumulates
silently when nobody is required to look. The fact that it did not
accumulate is either luck or discipline; either way it is not this
project's neglected axis, and a `spacing-check.mjs` mirroring
`token-check.mjs`'s allow-list approach (30 minutes of work, one
regex over `padding|margin|gap|border-radius`, checked into `npm run
check`) would convert luck into a guarantee at negligible cost. That
is a real recommendation, not a finding, and it is the only concrete
proposal this arm makes for `css/style.css` itself.

**Literal sizes that are not spacing.** The remaining hard-coded
lengths in the components/screens layers are single-use component
anatomy, and every one of them is traceable to a rule already written
down. `.monogram--lg` 56×56 (`css/style.css:850-851`) matches
design-system.md's own Monogram row ("40; `--lg` 56"); `.avatar` 36,
`.avatar--lg` 72 matches the Avatar row; `.switch` 52×32 matches the
Switch row; `.row` 56 min matches Row; the tile grid's `minmax(128px,
1fr)` at `css/style.css:670` carries its own derivation as a comment
two lines above it ("128 + 12 + 128 = 268 fits the 288 a 320px phone
leaves inside its gutters"). The hero orb's `-90px / -70px / 260px /
260px` bleed (`css/style.css:725-728`) and the onboarding orb's
`152px` (`css/style.css:1707-1708`) are the only genuinely
one-off decorative constants, and a decorative bleed radius is not a
candidate for a token scale — nothing else in the app will ever want
"the hero's background orb's overflow," by definition.

**Verdict: reject the premise.** The brief asked whether the scale is
right or unexamined. It has in fact been followed with unusual
discipline for eleven months of redesign churn; the thing worth
doing is making that discipline mechanical rather than the thing
worth doing being a redesign of the scale itself.

## 2 · The 320px budget, computed

Chrome heights, from the tokens and the `--foot-space` formulas at
`css/style.css:413-422`:

| screen kind | foot formula | bar | foot (no inset) |
|---|---|---:|---:|
| root (tab bar) | `nav-h + nav-inset + inset-b + s-6` | 56 | 64+12+0+24 = 100 |
| action-bar (quiz, topic overview, results) | `btn-h-primary + 2·foot-pad + inset-b + s-6` | 56 | 52+16+0+24 = 92 |
| reader / no foot | `s-9 + inset-b` | 56 | 48+0 = 48 |

**Measured live** [S] (Playwright, `#egitim`, `#egitim/konu/tenses`,
`#egitim/<lessonId>`, quiz.html, at 320×568 and 390×844, reading
`.shell__scroll`'s `clientHeight` minus its own computed
`padding-top`/`padding-bottom`):

| viewport | root | action-bar | reader |
|---|---:|---:|---:|
| 320×568, no safe area (iPhone SE class) | 412px | 420px | 464px |
| 390×844, Chromium reports 0 safe-area | 688px | 696px | 740px |

Chromium in this sandbox reports `env(safe-area-inset-*)` as `0px`
for every device profile tried, including Playwright's built-in
`devices["iPhone 13"]` — confirmed directly: a probe div with
`padding-top: env(safe-area-inset-top, -1px)` computed to `0px` on
that profile. So the 390×844 column above is real Chromium output but
not a real notched phone. Apple's commonly-cited values for that
class of device are inset-top 47 / inset-bottom 34 [≈, not verified
from an Apple source — see Doğrulanamayanlar]; applying them by hand:

| viewport (with cited insets) | root | action-bar | reader |
|---|---:|---:|---:|
| 390×844, top 47 / bottom 34 | 607px | 615px | 659px |

**What the type-scale change costs**, measured by injecting
`--t-display-lh:44px; --t-title-lh:36px; --t-meta:17px;
--t-meta-lh:24px` (the `07-karar.md` proposal) over the shipped
stylesheet and re-measuring the same DOM, isolated per screen (fresh
page load, one before/after pair, no intermediate navigation — see
scratchpad `measure3.mjs`–`measure5.mjs`):

| element / screen | before | after | Δ |
|---|---:|---:|---:|
| `.row` with a 1-line `.row__sub` (Test topic list) | 74px | 78px | +4px (+5%) |
| `.nav__item` content (icon 24 + gap 4 + label) | 44px | 48px | +4px, still inside the fixed 56px item box |
| Topic overview, full screen (7 rows) | 2662px | 2694px | +32px |
| Lesson reader, full lesson (2 check blocks) | 5820px | 5896px | +76px |
| Eğitim index (tiles, no rows) | 2270–2174px | 2314–2214px | +40–44px |
| Profil (meta-heavy per §1.3's own count) | 2710–3134px | 2798–3206px | +72–88px |

None of these overflow anything, because every one of them lives in
the scroll region, which absorbs length by definition — the fixed-
height shell's whole point (`CLAUDE.md`: "only `.app-content`
scrolls"). The one place growth meets a *fixed* box is the tab
capsule: `.nav__item`'s rendered height stays exactly 56px before and
after (`--nav-h` 64 minus the capsule's own vertical padding), so its
content — icon plus label — has 12px of total slack to spend before
and 8px after. It does not overflow, but the margin the design
tightens from ~6px to ~4px per side, and it now spends the smaller
half of the capsule's original headroom on the app's single most-
touched control (`07-karar.md` itself calls this "the sekme
göstergesine bağlı ... uygulamanın en sık dokunulan öğesi" in the
motion-budget discussion). Not a defect — a margin worth watching
once real device safe-area is in the loop, since the figure above is
Chromium's zero-inset case.

The real risk this task was asked to find is not in the tab bar or
the rows, both of which absorb the change comfortably. It is in
content whose *length* scales with the type change faster than its
container does, which is exactly what §5 below measures for
paragraph completion — a stem that grows from 168px to 784px on one
screen at 320px width, independent of anything in this section.

**Cross-check.** Every one of the design system's declared line-
heights, old and new, is a multiple of 4 by construction (36/44 ·
28/36 · 22/28 · 18/28 · 17/24 → 44,36,28,28,24, each ÷4 exact),
matching §2.2's own claim. That guarantee is authored, not measured —
see §4 for what actually happens once real content and its
irregularities (borders, sub-pixel font rendering) are in the mix.

## 3 · Reference scales, verbatim

All fetched from source — npm tarballs (`registry.npmjs.org`) or
`raw.githubusercontent.com` — except where marked; see command list
at the end of this section.

**Tailwind v3** (`tailwindlabs/tailwindcss`, `v3` branch,
`stubs/config.full.js`) [S] — the widely-copied baseline, spacing in
px (converted from the file's rem, 1rem=16px):

```
0 2 4 6 8 10 12 14 16 18 20 22 24  28 32 36 40 44 48  56 64
80 96 112 128 144 160 176 192  224 256  288 320  384
```

Step size doubles roughly every octave: **2px** steps 0–16, **4px**
16–48, **8px** 48–64, **16px** 64–192, **32px** 192–320, **64px**
beyond. Not geometric (no constant ratio) and not linear (no constant
step) — a hybrid that widens its grain exactly where the brief
guessed one would be needed: dense near zero, coarse far from it. Our
app's own §3 rule ("dense at the bottom, coarse at the top") is the
same shape in words.

Radius (same file): `2 4 6 8 12 16 24` px + `full` (9999px). Ratio
climbs 2→1.5→1.33→1.5→1.33→1.5 — oscillating, not fixed.

**Tailwind v4** (`tailwindlabs/tailwindcss`, `next` branch,
`packages/tailwindcss/theme.css`) [S] — the scale is gone. One token,
`--spacing: 0.25rem` (4px), and every utility is `n × 0.25rem` for
arbitrary `n` including halves and quarters (`p-3.5` = 14px). This is
a **pure linear function**, not a curated set — the opposite move
from v3, and from every other system measured here. Radius stayed a
short named list: `xs 2 · sm 4 · md 6 · lg 8 · xl 12 · 2xl 16 · 3xl 24
· 4xl 32` px.

**IBM Carbon**, `@carbon/layout@11.59.0` (npm tarball,
`scss/generated/_spacing.scss`) [S]:

```
spacing-01…13:  2 4 8 12 16 24 32 40 48 64 80 96 160  px
```

Plus a separate coarser **layout** scale for page-level regions
(`_layout.scss`): `16 24 32 48 64 96 160` px — a subset of the same
sequence, used only for macro regions rather than component internals
— and a **fluid** scale (`_fluid-spacing.scss`) that is not fixed at
all: `0, 2vw, 5vw, 10vw`, viewport-relative rather than px-token-
relative, a structurally different mechanism from every other entry
in this section (fluid spacing changes proportionally with the
window, ours does not and should not on a 65ch-capped reading
column — §7.3's own reasoning already forecloses this for us).

Carbon's radius (`packages/themes`, not fetched — see
Doğrulanamayanlar) is documented elsewhere in Carbon's own system as
4/8/16px; not independently verified here.

**GitHub Primer**, `@primer/primitives@11.10.0` (npm tarball) [S]:

```
base-size:  2 4 6 8 12 16 20 24 28 32 36 40 44 48  64 80 96 112 128 px
functional: xxs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 24 px
```

The functional (semantic) tier is the one worth comparing directly:
**2, 4, 8, 12, 16, 24 — identical to our app's own `--s-1` through
`--s-6`**, value for value, six for six. Primer's base tier keeps 4px
granularity to 48px then jumps to 16px steps (64, 80, 96, 112, 128),
the same doubling-of-grain shape as Tailwind v3 and Carbon.

Radius (`dist/css/functional/size/radius.css`) [S]: `3 · 6 · 12 ·
full` — a clean geometric ×2 at every step, the one system in this
set with an exact geometric radius progression.

**Atlassian**, `@atlaskit/tokens@17.0.0` (npm tarball,
`dist/es2019/artifacts/tokens-raw/atlassian-spacing.js`) [S]:

```
0 2 4 6 8 12 16 20 24 32 40 48 64 80  px
```

Same doubling-of-grain family again: 2px steps to 8, 4px to 24, 8px
to 48, 16px beyond. No radius scale was found in this package —
searched the whole tarball for `borderRadius`/`border-radius` and the
only hits were unrelated codemod utilities. Atlassian does not
appear to publish a system-level radius token set the way it does
spacing; component radii are presumably per-component. Not confirmed
beyond this package — see Doğrulanamayanlar.

**Material 3**, `material-components/material-web` (git clone,
sparse-checkout `tokens/`, `versions/latest/sass/_md-sys-shape.scss`,
"Design system: Google Material 3, Version: 34.0.21") [S] — **no
spacing scale exists.** Searched the whole `tokens/` tree for any
`spacing` file; none. Material's spacing guidance ("4dp grid," "8dp
grid") is design-guideline prose (`m3.material.io`, blocked to this
session — see Doğrulanamayanlar), not a published token set the way
colour, type and shape are. This is worth stating plainly: three of
the four other systems measured here (Carbon, Primer, Atlaskit)
publish an explicit spacing scale as code; Tailwind publishes one (v3)
or a formula (v4); Material 3 publishes neither, for spacing
specifically, while publishing an exhaustive one for shape:

```
none 0 · extra-small 4 · small 8 · medium 12 · large 16
large-increased 20 · extra-large 28 · extra-large-increased 32
extra-extra-large 48 · full 9999
```

The `-increased` variants are new in this file (v34, i.e. the
"Material 3 Expressive" wave) and they are visible evidence of the
same thing found in our own type-scale history (`07-karar.md` §2):
even a system with Google's resources reached a point where its
existing steps (16, 28) needed an intermediate value bolted on
(20, 32) rather than the whole scale being re-derived. A growing-step
scale gets patched at the point of friction; it does not get
replaced.

**Apple HIG** — could not be read as a primary source; see
Doğrulanamayanlar. Secondary, consistent sources [≈] via `WebSearch`
put Interface Builder's default view-to-superview margin at 20pt and
sibling-to-sibling at 8pt, inside a general "8-point grid" convention
repeated across independent write-ups. Consistent with, not
independent confirmation of, the doubling-grain family above.

**The shape all six share.** Every system that publishes an explicit,
non-formula spacing scale — Tailwind v3, Carbon, Primer, Atlaskit,
and our own `--s-1…10` — widens its step size as values grow: dense
(2 or 4px) near zero, coarse (16–64px) far from it, never a constant
ratio and never a constant difference. Radius scales cluster the same
way but more loosely (Primer is the one clean geometric case; ours,
Tailwind's and Material's all oscillate their ratio). The two outliers
are Tailwind v4 (abandoned the curated scale for a linear formula,
the opposite direction) and Material 3 (never published a spacing
scale at all, only shape). Our scale is not an outlier in this set —
it is the median case, and its bottom six steps are, coincidentally
or not, identical to Primer's semantic tier.

Commands run for this section (reproducible):

```
curl -sS https://raw.githubusercontent.com/tailwindlabs/tailwindcss/v3/stubs/config.full.js
curl -sS https://raw.githubusercontent.com/tailwindlabs/tailwindcss/next/packages/tailwindcss/theme.css
curl -sS https://registry.npmjs.org/@carbon/layout/latest   # then fetch dist.tarball
curl -sS https://registry.npmjs.org/@primer/primitives/latest
curl -sS https://registry.npmjs.org/@atlaskit/tokens/latest
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/material-components/material-web.git
  # then: git sparse-checkout set tokens
```

## 4 · Vertical rhythm, and whether it is worth it

**The web-standards evidence, both directions.** The CSS Working
Group has a live draft addressing exactly this —
`w3c/csswg-drafts/css-rhythm-1/Overview.bs` [S], "CSS Rhythmic Sizing
Module Level 1," editors from Google and Apple, dated 2026-02-17,
`Work Status: exploring`. Its own abstract: features "for aligning
content size to multiple of unit size," explicitly so that "lines of
text in different fonts can create consistent visuals" and rhythm
survives "through pictures and different size of text." Two things
follow from this one document. **Pro:** the problem is real enough
that CSSWG editors from two browser vendors are actively drafting for
it, as of eight months ago. **Con:** `Work Status: exploring` is the
earliest, least-committed status the CSSWG uses — this is nowhere
near Candidate Recommendation, meaning the web platform still has no
native way to snap arbitrary block flow to a grid, which is precisely
our design-system's stated reason (§3: "a single fluid image or a
30px gap on a 24px grid knocks the whole column out of rhythm ...
Perfect snapping is a print luxury") for rejecting one. The document
is contemporary evidence, not received wisdom, that the counter-
argument is still correct in September 2026.

**Testing it here.** Real screen: the lesson reader at
`#egitim/tenses-present-simple-vs-present-continuous`, 320×2400 (tall
viewport so nothing is clipped by scrolling — measuring document flow,
not viewport). 47 elements matched (`.t-label`, block wrappers,
`.options`/`.option`, buttons, rows), each element's `top` measured
relative to the scroll region's own top, before and after injecting
the proposed type-scale tokens (script: scratchpad `measure5.mjs`)
[S]:

| | before | after |
|---|---:|---:|
| elements landing on a strict 4px grid | 31 / 47 (66%) | 47 / 47 (100%) |
| elements landing on a strict 8px grid | 19 / 47 (40%) | 20 / 47 (43%) |
| elements that moved at all | — | 38 / 47 (81%) |
| cumulative drift by the last element | — | up to 68px |

Read the 4px row with real caution: it moved from 66% to 100% on
*this* lesson, which is a statement about this lesson's particular
content length interacting with the change, not a structural
guarantee — the 4px promise the design system actually makes is
about authored line-height *tokens* (§2.2, verified in §2 above:
36/44·28/36·22/28·18/28·17/24 are all exactly ÷4), and that promise
holds regardless of content by construction. The rendered-position
number in this table includes borders, box-shadow insets and font-
rasterisation rounding that the token promise never covered, which is
why even the *unchanged* body/lead tiers don't put every element on a
4px grid today (66%, not 100%).

The **8px row is the real answer to the "is it worth it" question,
because our app never claimed 8px and this measures whether it
happens anyway.** Before the change, 40% of flowed elements
land on an 8px position — worse than a coin flip against a null
scale. After, 43% — statistically the same. A strict 8-point baseline
grid does not exist in this reader today, was never close to existing,
and the type-scale revision neither meaningfully repairs nor
meaningfully worsens that. This is the "reject with a measurement"
case the brief asked for: the app's own §3 rule ("no baseline grid ...
perfect snapping is a print luxury") is not a stated preference that
happens to be convenient — it is what the numbers already show, on
the actual reader, re-confirmed under the exact revision on the
table.

Command: `node measure5.mjs` (scratchpad; requires `npm run serve` on
`:8000`; ~15s).

## 5 · The section grammar, stress-tested

Grounded in the actual specs for these four screens
(`docs/app1-final.md` §3 Block B–D, `docs/exam-spec.md`), not
invented shapes.

**Error notebook (D1).** Homogeneous past-mistake entries, one per
question the learner got wrong — this is exactly what **list**
already covers: `Row` with a title (the stem, clamped), a sub (date /
category / "yanlış cevap: X"), a trailing chevron to the detail. A
topic/category filter above the list is a `Chip` row, already an
inventoried component. **The grammar holds. No new container.**

**Paragraph completion.** Per `docs/exam-spec.md` §"Paragraph
completion": "~120 words... a sentence removed... four candidate
sentences." It renders inside the existing quiz screen
(`docs/app1-final.md` B1: "rendering in the quiz screen"), stem in
`#question-stem` (`.t-lead.t-en`, `js/prompt.js:36-44`), options in
the existing `.options` list. **The container types are unchanged —
`prose` stem, `list` of `Option` cards — but the budget is not.**
Measured directly [S] (scratchpad `measure6.mjs`: launched a real
topic quiz, then swapped `#question-stem`'s text for a 99-word
paragraph-completion-shaped stem, at 320×568):

| | today's cloze stem | 99-word paragraph stem |
|---|---:|---:|
| stem height | 168px (one short sentence) | **784px** |
| stem line count | — | 28 lines |
| `.options` bottom edge | 572px (≈ fits) | **1188px** |
| options visible without scrolling | yes | **no** |

The four answer options — the thing the learner has to read and tap —
sit 620px below the fold on a 568px-tall viewport. This is not a
container-taxonomy failure (`prose` + `list` is still the right
description) but it is a real failure of the quiz screen's implicit
contract, which every other item type on the ship today honours
without anyone writing it down: a question, its stem and its four
options are meant to be readable together, close to one glance,
because that is what `CLAUDE.md`'s "answering a question must never
move the button the learner is about to tap" and design-system.md
§7.3's "a question, four options and one action are one thing" are
both describing. A 120-word stem breaks that at 320px width — see §6
for how much the wide layout helps and how little it helps on the
device this app is actually used on.

**Reading passage (C1, 14 questions across two texts).** Per
`docs/exam-spec.md` §"Reading": "~700 words," "divided into paragraphs
numbered with Roman numerals," 7 questions per text, each question
citing a specific paragraph, and `docs/app1-final.md` C1 itself flags
this as "the first item shape in the app where several questions
share one stem" and "a reading item cannot be shuffled into a mixed
test alone." **This is the one place the section grammar does not
hold**, and it does not hold for a structural reason, not a
cosmetic one: `prose` (§0.2: "paragraphs and inline marks, space
only") describes text with no relationship to anything outside it.
A reading passage is prose that seven separate question cards need to
*keep referring back to* while the passage itself stays fixed. None
of the five containers has a rule for "a block that other, later
sections point at and the learner re-consults." Naming it:

> **reference** — one long-form source block (prose, with structural
> markers — the Roman-numeral paragraphs) that one or more question
> cards elsewhere on the same screen cite by position. Collapsed by
> default below the wide-layout breakpoint (opens on demand, closes
> once a re-read is done, so it never permanently eats the vertical
> budget a `check` block or the options need); promoted to the aside
> pane at ≥1080×600 rather than collapsed, because at that width there
> is room to keep it open and being able to see the passage and the
> question at once is the entire point of the interaction (§6 works
> the width case through). Never more than one per screen — a second
> reference block competing for the same collapsed space is a second
> unscannable list by the §7.1 argument, restated one level up.

Rough size, so the collapse decision is not asserted: scaling the
§6 measured ratio (an 88-word paragraph → 224px at the 608px reading-
column width) to 700 words gives roughly **1,780px / 64 lines** even
in the *wide* column — a passage this long will scroll inside its own
block at any width, which is expected and fine for reading prose; the
`reference` container's job is keeping that scroll from displacing
the question, not from existing at all.

**Mock exam (D2), all four sections under time.** The single-question
decision shape (`docs/app1-final.md` D2: "all four sections at exam
scale") is unchanged from the quiz today, so **`prose`/`list`/`card`
still describe every individual screen inside it — no new container
type.** What is new is a screen-level need the current grammar is
silent on rather than wrong about: a 40-item timed sitting needs a way
back to any earlier item (flagged, skipped, answered), which is
homogeneous, scannable content — i.e. it is a **grid** of small
numbered state-tiles by the existing definition, not a new
container — but it is content the plain quiz has no equivalent of, so
it is a genuinely new *pane role* for §6, not a new container for §5.
Kept there rather than invented here.

## 6 · The wide layout, re-examined

**The existing split, measured, not assumed** [S] (scratchpad
`measure7.mjs`, `#egitim` at 1280×900, `.split` and its two children):

| | documented (§7.3) | measured |
|---|---:|---:|
| pane | 320px | **320px**, exact |
| gap | `--s-8` = 40px | **40px**, exact |
| reading column | 640px track / 608px content | **608px**, exact |
| frame (pane+gap+column) | 1000px | **968px** |
| centred margins at 1280px | — | 156px both sides, symmetric |

The frame is 32px narrower than the documented arithmetic
(320+40+640=1000). The measured `608` is very likely the *inner*
content width of the 640px track (i.e. the same number
design-system.md already calls "608px of content" for the reading
column alone), so the 968 vs 1000 gap is consistent with measuring
content boxes on both sides rather than one content, one track — a
units mismatch in the doc's own arithmetic rather than a CSS bug, but
worth a line fixed in design-system.md's §7.3 table rather than left
for the next session to re-derive. Not a design decision either way;
flagging it as a documentation-precision finding.

**Reading passage at 1280×.** §5 named the missing `reference`
container and said it promotes to the aside at ≥1080×600 rather than
collapsing. Working that through §7.3's own two live rules:

- *Rule 2, "which pane is which is decided by content, not
  importance"* — prose keeps the measure, a scannable list takes the
  320 pane. A reading passage is unambiguously the **prose** side, so
  it takes the **608px reading column**, not the pane, and the
  currently-active question (stem + its options, exactly the same
  shape a plain quiz question already is at 320px) takes the **pane**.
  This is not a new split shape: it is the *inverse* of the Topic
  Overview row in the §7.3 table (lessons list in the pane, overview
  prose in the column) applied to the same discriminator, which is
  evidence the existing rule already generalises rather than needing
  a bespoke case.
- *Rule 3, "a split has exactly two children"* — holds: passage
  (column) and current question+options (pane). The 7-question index
  (jump to question III of VII) is a small control inside the pane,
  not a third track.

This is, concretely, the one place in the whole app where giving the
quiz's question a pane is *correct* rather than the violation §7.3
was written to forbid — and the reason is exactly the discriminator
the doc already states, not an exception to it: the quiz's existing
"no pane, ever" rule is justified by "a question, four options and
one action are one thing... splitting a decision screen turns it into
a scanning screen" (§7.3). A reading-comprehension question is
*already* a scanning task by definition — the learner is meant to look
back at paragraph V while deciding — so the reasoning that forbids a
pane on a grammar question is the reasoning that *requires* one here.
Below 1080×600 (i.e. on the phone, which is how this app is actually
read the night before an exam per `CLAUDE.md`), there is no pane at
all, by §7.3's own third rule, and the `reference` container's
collapse-by-default behaviour named in §5 is what carries the same
job at that width — measured at roughly 1,780px/64 lines for a full
700-word passage even inside the widest column available, so
"promoted to a pane" was never going to remove the need to collapse
it; it only removes the need to collapse it 350px wide instead of
608px wide.

**Mock exam at 1280×.** The §5 finding (a new pane *role* — the
question-navigator grid — not a new container) fits the split
mechanism as-is: pane = the navigator (a `grid` of state-tiles,
exactly the existing Tile-family shape at small scale), column = the
current question. This is structurally identical to Reading's split
above (scannable control in the pane, single decision in the column)
and to no existing row in the §7.3 table, because none of the five
listed screens has an in-progress index — Test's pane ("mixed test,
mistake book, weak spots") is a set of *entry points*, not a live
position tracker. A genuinely new row for that table once the screen
is built; not a new mechanism.

**Error notebook and paragraph completion at 1280×.** The error
notebook fits directly into the existing Profil/Test-style split
(filter chips or a topic breakdown in the pane, the mistake list in
the column) with no new work. Paragraph completion stays a quiz
screen — one decision, no pane, by the same reasoning that already
excludes the plain quiz — and its only wide-layout benefit is
incidental: the reading column's 608px measure (vs. 288px of content
at 320px) cuts the same stem from **784px/28 lines to roughly
224–320px/8–11 lines**, a 2.5–3.5× reduction measured directly in §5,
simply because character-per-line roughly triples. That is real
relief, but only above 1080×600 — which is not where `CLAUDE.md` says
this app is actually read.

## Öneri

1. **Ship a `spacing-check.mjs`.** The one real gap this arm found is
   not in the scale but in its enforcement: nothing plays the role for
   spacing/radius that `npm run color` plays for the palette. The scale
   itself does not need re-deriving — §1's audit found 128 of 130 real
   declarations already on-token — but the two exceptions found here
   were found by hand, the way `--c-edge`'s contrast bug was found by
   hand before `token-check.mjs` existed. A short allow-listed check
   (regex over `padding|margin|gap|border-radius` in the components/
   screens layers, same shape as `tools/token-check.mjs`) converts an
   accidental clean record into a guaranteed one, in well under an
   hour.
2. **Fix the 968-vs-1000 arithmetic in design-system.md §7.3.** A
   documentation-precision fix, not a CSS change — the measured pixels
   are already correct; the stated sum of them is not.
3. **Name `reference` as a sixth container**, with the rule given in
   §5: collapsed by default below 1080×600, promoted to the aside pane
   above it. Needed once for Reading, and the wide-layout case for it
   is already implied by §7.3's own discriminator rather than being a
   new exception to it (§6).
4. **Budget the type-scale change against paragraph completion before
   shipping it**, not against the screens that already exist. Every
   screen in the app today absorbs the 15→17 change inside its scroll
   region without incident (§2); the one place this arm found a
   96-line-of-the-file kind of problem is a screen that does not exist
   yet, and it is a budget problem (784px stem, 620px of it below the
   fold) rather than a token problem, so it needs a design answer —
   collapse/expand, a scroll-within-stem affordance, or accepting an
   initial-scroll question for this one item type — before B1 is
   built, not after.
5. **Do not build a baseline grid.** Re-confirmed, not merely
   repeated: on the actual reader, under the actual proposed type
   scale, 8px alignment sits at 40–43% before and after — statistically
   unchanged, and the CSSWG's own rhythm module is still `Work Status:
   exploring` eight months into 2026. The existing §3 rule was already
   correct; this arm's job was to check whether the revision changes
   that, and it does not.

## Doğrulanamayanlar

- **Apple HIG, primary source.** `developer.apple.com/design/human-
  interface-guidelines/...` returned no extractable body content
  through `WebFetch` (an empty/JS-shell response) and a direct `curl`
  to the layout page returned `404` through this session's proxy. The
  16/20pt margin and 8pt-grid figures in §3 are secondary, consistent
  [≈] citations via `WebSearch` snippets, not a primary read. A
  session on an open network should fetch
  `developer.apple.com/design/human-interface-guidelines/layout`
  directly and quote the real figures.
- **Material 3's spacing guidance (prose form).** Confirmed by direct
  repo search that `material-components/material-web` publishes no
  spacing token file — but the *prose* guidance ("4dp/8dp grid") lives
  on `m3.material.io`, blocked to this session end to end. The
  absence-of-a-token-file finding is solid ([S], a real search of a
  real clone); what Material's own written rationale for not
  tokenising spacing says, if anything, is not read.
- **Carbon's radius scale.** Not independently fetched — §3 repeats a
  commonly-cited 4/8/16px figure without pulling it from
  `carbon-design-system/carbon` the way the spacing scale was pulled.
  `packages/themes` or an equivalent radius package would need
  locating and fetching to upgrade this to [S].
- **Atlaskit radius.** Searched the whole `@atlaskit/tokens@17.0.0`
  tarball; no radius tokens found. Marked as "not published in this
  package" rather than "does not exist" — Atlassian may publish
  component radii through `@atlaskit/primitives` or a components
  package this session did not fetch.
- **Real device safe-area insets.** Chromium in this sandbox reports
  `env(safe-area-inset-*)` as `0px` regardless of device emulation
  profile — confirmed by direct probe, not assumed. The 390×844
  "with cited insets" row in §2 uses commonly-repeated Apple figures
  (47/34) that this session could not verify against a primary Apple
  source (same block as above) or against real hardware. A session
  with access to a real notched device, or to Apple's own developer
  documentation, should confirm or correct these two numbers before
  they are used for anything load-bearing.
- **The `--w-frame: 1000px` documentation gap (§6).** Flagged as
  measured-vs-documented (968 vs 1000) with a plausible explanation
  (content-box vs border-box double-count), but the actual CSS rule
  that produces `--w-wide` (`css/style.css:135`) was not traced fully
  against the rendered box model to confirm *which* box is being
  double-counted. A future session touching `--w-wide` should trace it
  rather than accept this arm's guess.
