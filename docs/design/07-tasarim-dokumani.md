# Tasarım dokümanı — the specification

2026-09-11. The build specification for the design language argued in
`06-sozel-yonerge.md`. That file decided *which approach is right*; this
one writes down **what the thing is**, in enough detail that a specimen
can be drawn from it and, later, an application built from it.

Nothing here is applied to the app. `css/style.css` and `js/` are
untouched.

**How to read it.** Every value is either solved or open. A solved value
carries [S] and was produced by `tools/color.mjs` against the app's own
`PAIRS` table — the same code `npm run color` runs in CI. An open value
carries **[A]** and is a question for the specimen sheet; one answered by
the owner carries **[K]** and its date. All three are listed again in
§17. Nothing is an adjective.

**What this supersedes.** Three earlier decisions are replaced, and the
replacements are marked ⟲ where they appear:

| earlier | now |
|---|---|
| `04-brief.md` C4 — a *counter-plane* of ≥ 25%, an opaque near-black card | ⟲ the **field**. The large area that is not the ground is light, not a slab (§2.1) |
| `03-research.md` §2.2 — the filled action is a **plane** | ⟲ the action is **painted**; the plane survives as the alternative to be chosen from a specimen (§2.3) |
| `04-brief.md` §2 medians, computed over eleven references | ⟲ rebased on the five he named: 1, 3, 4, 8, 10 (§15) |

---

# PART ONE · THE LAW

## 1 · The nine sentences

The whole language. A screen that cannot be described with these is not
in it.

1. **Renk ışıktır.** Colour is emitted from a field behind the objects,
   never painted onto them. Exactly one element per screen is painted,
   and it is the one action.
2. **Nesneler camdır.** An object is a tinted, blurred pane — at least
   78% opaque where it carries text, never below 55% anywhere.
3. **Dil gece tasarlanır**, and is solved again for day. The light theme
   is not an inversion.
4. **Alanın üç seviyesi vardır** — tam, kısık, alansız — and the
   screen's job picks one.
5. **Işığın tek yönü vardır**, the same corner on every screen, and an
   object's top edge catches it.
6. **İki yarıçap ailesi vardır** — content 0.09, control 0.16 of the
   object's own width — drawn as circular arcs.
7. **Tip, metnin ne olduğuna göre ayrılır**: serif for the English being
   examined, sans for everything the app says, tabular figures for
   everything measured.
8. **Hareket ışığı değiştirir**, not the layout.
9. **Doku alana aittir**, lightens what it sits on, and hatching means
   *not measured yet*.

---

# PART TWO · THE MATERIAL

## 2.1 · Alan — the field

**What it is.** A light source behind everything on the screen. Not a
background colour and not a decorative wash: a gradient with a position,
an extent and a measurable chroma, from which the screen's colour comes.

**Geometry.** One radial gradient, anchored to the **top-left** of the
scrolling region, extending 135% × 115% of the region's width. It does
not move when the region scrolls — it belongs to the screen, not to the
content — and it is never repeated or mirrored.

**Stops** [S], as a mix of the lit colour into the ground:

| stop | position | mix | dark (H 70 ground) | light |
|---|---|---|---|---|
| 1 | 0% | 100% | `#AB4400` · L 0.519 C 0.150 | `#EB8656` · L 0.720 C 0.139 |
| 2 | 34% | 75% | `#853703` · L 0.438 C 0.121 | `#EEA17A` · L 0.776 C 0.106 |
| 3 | 62% | 45% | `#582706` · L 0.336 C 0.084 | `#F1C1A6` · L 0.847 C 0.066 |
| 4 | 80% | 20% | `#321A09` · L 0.247 C 0.047 | `#F4DCCA` · L 0.909 C 0.036 |
| 5 | 100% | 0% | the ground | the ground |

Stops 1–3 are above the 0.06 chroma line and therefore count as **alan
ışığı**; stop 4 is the fade and deliberately does not. The lit colour is
`oklch(0.52 0.150 45)` dark and `oklch(0.72 0.140 45)` light — the same
hue family as the mark (§2.4) so a screen has one hue.

**The three levels** [S where a number appears]:

| level | field light | where | what survives |
|---|---|---|---|
| **Tam alan** | 15–25% of the screen | the entrance, the summary | the whole gradient, stops 1–5 |
| **Kısık alan** | 2–5% | the question, the answer | stops 3–5 only, and a lit edge on the chrome |
| **Alansız** | < 1% | the lesson reader | no gradient; the ground, ink and the mark |

The level is a property of the **screen**, declared once, not a
per-component choice. §12 assigns one to every screen in the app.

**Why the field replaces the counter-plane ⟲.** `04-brief.md` C4 asked
for ≥ 25% of the screen on the far side of L 0.5 from the ground. That
was derived from a reference set of white paper apps (§15). In the five
he named, the large area that is not the ground is **light**, not a
slab: field light 18.9% (ref 10) and 52.5% (ref 3), against glass planes
at 34–49% [S]. The composition rule survives; its material changes.

**Measurement.** `measure-screens.py` reports `field light` and `glass`
directly. A screen is in spec when its level's range holds.

## 2.2 · Cam — glass

**What it is.** A pane with a tint, an alpha, a blur behind it, a lit
top edge and a shadow that lifts it off the field. It is the *only* kind
of object. There is no opaque card in this language except the painted
action.

**Values** [S]:

| | dark | light |
|---|---|---|
| tint | `#322D27` [K] | `#FFFCF5` |
| alpha, carrying text | **0.78** | **0.78** |
| alpha, carrying none | 0.55 | 0.70 |
| blur | 20px | 20px |
| saturation | 1.1 | 1.05 |

The alpha floor is solved, not chosen. Compositing the tint over the
field's brightest and darkest point and measuring the ink against the
worst result [S]:

| α | dark, worst ink | light, worst ink |
|---|---|---|
| 0.55 | Lc 93 ✓ | **Lc 82 ✗** (needs 85) |
| 0.70 | Lc 95 ✓ | Lc 89 ✓ |
| **0.78** | **Lc 95 ✓** | **Lc 92 ✓** |
| 0.86 | Lc 96 ✓ | Lc 96 ✓ |

The light theme binds at 0.70; **0.78 is the rule**, for the same reason
`03-research.md` §4.3 took the 0.125 card step over the 0.170 one — a
value with no headroom fails the next time anything moves.

**The `PAIRS` rule that comes with it.** A glass surface is not a
colour, so it cannot be a `PAIRS` row on its own. Instead:

> **Every glass surface declares `(tint, alpha)`. `tools/palette.mjs`
> composites that pair over the field's stop 1 and stop 5 and measures
> the ink against whichever result is worse.** A glass surface that is
> not declared is not measured, which is the one way this can go stale —
> the same failure mode the `PAIRS` table already documents.

**CSS.**

```css
.pane {
  background: color-mix(in srgb, var(--glass-tint) 78%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(1.1);
  backdrop-filter: blur(20px) saturate(1.1);
  border-radius: var(--r-content);
  box-shadow:
    inset 0 1px 0 var(--lit-edge),   /* §7 · the top edge catches the light */
    var(--shadow-lift);              /* lifts it off the field, nothing more */
}
@supports not (backdrop-filter: blur(1px)) {
  .pane { background: var(--glass-solid); }   /* the tint at alpha 1 */
}
@media (prefers-reduced-transparency: reduce) {
  .pane { background: var(--glass-solid); backdrop-filter: none; }
}
```

`backdrop-filter` is **Baseline**, above 97% globally, `-webkit-` prefix
still wanted by Safari ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter),
[web-features](https://web-platform-dx.github.io/web-features-explorer/features/backdrop-filter/)).
Unlike `corner-shape` (§5) this is not an enhancement — it is available,
and the fallback exists for the two cases above rather than for support.

**The cost, stated as a rule rather than a hope.** A blurred surface is
expensive on old Android. **At most two blurred surfaces on a screen.**
A list of ten rows is one pane containing ten rows, never ten panes.

## 2.3 · Boyalı eylem — the one painted element ⟲

**What it is.** The single opaque, saturated thing on the screen. In a
language where everything else is translucent, opacity *is* the signal —
which is why references 10, 4 and 8 each paint exactly one control
(yellow, green, gold) and nothing else.

**Values** [S]:

| | fill | label | label contrast | vs `surface-2` |
|---|---|---|---|---|
| light | `#C35000` · L 0.574 C 0.164 H 45 | white | W 4.70 / **Lc 77** | 3.54:1 |
| dark | `#FFA401` · L 0.790 C 0.171 H 70 | the page colour | W 9.53 / **Lc 65** | 5.43:1 |

**Why painted rather than a plane ⟲.** `03-research.md` §2.2 made the
action a near-black or near-white plane, because that solved the dead
band and doubled as the counter-plane. With the counter-plane replaced
by the field (§2.1), the plane's second job is gone, and an opaque
neutral pill on a field of glass reads as *another pane*, not as the
action. Painting it is what makes it the only solid object.

**The alternative stays on the table.** The plane pill (`#241E18` light,
`#ECE7E1` dark, label at Lc 97 / 92) is measured, passing, and better on
one axis: contrast. Specimen 6 shows both. **[A]**

**The rule.** One per screen. Never two. A screen with no action has no
painted element, and that is a valid screen.

## 2.4 · İşaret — the mark

**What it is.** The accent as a *mark*: a rule, a bar, a fill in a
drawing, the underline of a cloze blank, the tab indicator. It is never
written on, which is what lets it be vivid.

**Values** [S]: light `#CE5500` (L 0.598 C 0.171 H 45), 3.21:1 against
`surface-2`; dark `#FE6A00` (L 0.700 C 0.200 H 45), 3.74:1. Against
today's `C 0.125` in both themes: **+37% and +60%**.

The H 36 ceiling — `#E13F00` / `#FF4B0C`, C 0.207 / 0.224, +66% and
+79% — was on the table and **was dropped** [K, 2026-09-11]: it is the
reference's own hue, and it reads as an alert colour in an app whose
whole job is telling a learner they were wrong.

**The rule.** Never below 2px in a rule or a bar. Never behind text.
Never more than one hue family on a screen.

## 2.5 · Düz yüzey — the plain plane

The reader has no field (§2.1), so it needs a surface that is not glass:
the ground itself, with ink on it and nothing else. Stated so nobody
invents a fourth material for it. Its only decoration is the mark, and
its only structure is the divider (§5).

---

# PART THREE · THE VALUES

## 3 · Colour

Both themes, every token, with what it answers and how it is checked.
⟲ marks a change from what ships today.

### 3.1 Dark

| token | value | oklch | rule |
|---|---|---|---|
| `--c-surface-0` (page) | `#14100B` ⟲ | L 0.175 C 0.012 H 70 | warm [K] |
| `--c-surface-1` (pane tint) | `#322D27` ⟲ | L 0.300 C 0.012 H 70 | ⟲ was 0.228 — the card step goes 0.053 → 0.125 |
| `--c-surface-2` (worst ground) | `#413C36` ⟲ | L 0.360 C 0.012 H 70 | zero `PAIRS` failures at this ladder [S] |
| `--c-text-1` | `#F4F1ED` ⟲ | L 0.971 C 0.006 H 70 | Lc 90 + WCAG 7 against `surface-2` |
| `--c-text-2` | `#DED9D3` ⟲ | L 0.900 C 0.010 H 70 | Lc 75 + 4.5 |
| `--c-text-3` | `#C6C0B9` ⟲ | L 0.822 C 0.012 H 70 | Lc 60 + 3.0 |
| `--c-accent-ink` | `#FCD49B` ⟲ | L 0.902 C 0.085 H 76 | coloured text, Lc 75 |
| `--c-mark` | `#FE6A00` ⟲ | L 0.700 C 0.200 H 45 | never written on, 3.74:1 |
| `--c-action` | `#FFA401` ⟲ | L 0.790 C 0.171 H 70 | the one painted element, label Lc 65 |
| `--c-on-action` | `#14100B` | the page | |
| `--c-field-lit` | `#AB4400` ⟲ | L 0.52 C 0.150 H 45 | stop 1 of the field |
| `--c-edge` | `#8C867F` ⟲ | L 0.652 C 0.012 H 70 | 3:1, non-text |
| `--c-divider` | `#514C46` ⟲ | L 0.42 C 0.012 H 70 | decorative, visible |
| `--c-ok` / `--c-no` | `#7FD492` / `#FF9D95` | unchanged | 3:1 |

`text-1` at L 0.971 sits **0.028 from white**; that is the headroom the
0.125 card step costs, and it is why a wider step was refused [S].

### 3.2 Light

Surfaces unchanged — the cream came from his own reaction and nothing
here disturbs it.

| token | value | oklch | rule |
|---|---|---|---|
| `--c-surface-0` (page) | `#F6F1E7` | L 0.960 C 0.014 H 85 | unchanged |
| `--c-surface-1` (pane tint) | `#FFFCF5` | L 0.992 | unchanged |
| `--c-surface-2` (worst ground) | `#E5DFD3` | L 0.905 | unchanged |
| `--c-text-1/2/3` | `#211B14` · `#413A31` · `#685F54` | unchanged | unchanged |
| `--c-accent-ink` | `#623200` | L 0.372 C 0.090 | Lc 86 on the page, 76 on `surface-2` |
| `--c-mark` | `#CE5500` ⟲ | L 0.598 C 0.171 H 45 | 3.21:1 |
| `--c-action` | `#C35000` ⟲ | L 0.574 C 0.164 H 45 | label white, W 4.70 / Lc 77 |
| `--c-on-action` | `#FFFFFF` ⟲ | | was the cream page; white opens the chroma |
| `--c-field-lit` | `#EB8656` ⟲ | L 0.720 C 0.140 H 45 | stop 1 |
| `--c-divider` | `#BBB7AF` ⟲ | L 0.78 | 1.78:1 — decorative, and visible |

### 3.3 What is deleted

`--grad-accent`, `--shadow-glow`, `--orb`, `--wash-1`, `--wash-2`,
`--glass-raised` as chrome, `hueOf()`, the per-topic hue, the streak
flame, `celebrate.js`, and the 1px outline on all eight component
classes. Every one of them is either refused by
`visual-longevity.md` §6 or replaced by the field.

### 3.4 New `PAIRS` rows

| where | px / weight | token | on |
|---|---|---|---|
| painted action label | 18 / 600 | `on-action` | `action` |
| glass pane body (composited) | 18 / 400 | `text-1` | `(tint, 0.78)` over field stop 1 |
| glass pane body (composited) | 18 / 400 | `text-1` | `(tint, 0.78)` over field stop 5 |
| glass pane meta | 15 / 600 | `text-2` | same, both stops |
| mark as a rule | — | `mark` | `surface-2`, 3:1 non-text |

## 4 · Zemin merdiveni — the surface ladder

| | page | pane tint | worst ground | card step |
|---|---|---|---|---|
| dark, today | 0.175 | 0.228 | 0.286 | 0.053 |
| **dark, here** ⟲ | 0.175 | **0.300** | **0.360** | **0.125** |
| light | 0.960 | 0.992 | 0.905 | 0.032 |

The dark ladder was measured at 0.125 / 0.150 / 0.170: all three pass
`PAIRS` with zero failures; 0.125 keeps 0.040 of lightness between
`text-1` and white and the others spend it [S]. Reference 8's own ladder
(0.30 / 0.37 / 0.44) has **no solution** at our text contract — `text-1`
cannot reach Lc 90 + WCAG 7 against a ground that light even at pure
white [S].

**Warm or cool was free** [S]: the identical ladder at H 70 and H 255
produces identical pass/fail and identical solved ink lightnesses to
three decimals — so it was a taste decision and nothing else.
**Warm, H 70** [K, 2026-09-11]. §3.1's cool column is dropped.

---

# PART FOUR · FORM

## 5 · Geometry

**Radius, as a ratio of the object's own width** ⟲:

| family | r / w | at 358px | at 176px | at 52px |
|---|---|---|---|---|
| **content** — a pane, a sheet, a prose container | 0.09 | 32px | 16px | — |
| **control** — an object that *is* the interaction | 0.16 | 57px | 28px | 8px |
| pill — an action, a chip, a filter | 999px | | | |
| circle — an icon button, an avatar, a mark | 50% | | | |

Today's single `--r-3: 20px` is 0.056 at 358 — the bottom of the content
range, used for controls too. There is no fifth silhouette: nothing has
a square corner, nothing has a mixed radius, nothing is a bare outlined
box.

`corner-shape: superellipse()` is added as a progressive enhancement.
It is **Chromium-only, ~65%, not Baseline**, so the design must be
complete as a circular arc, and at r/w 0.16 the arc's kink at the
tangent is visible. Specimen 3 decides whether 0.16 survives as an arc.
**[A]**

**Spacing.** The 4pt scale is unchanged: 2 · 4 · 8 · 12 · 16 · 24 · 32 ·
40 · 48 · 64. Gutter 16px. One reading column at 640px, one 320px pane
above 1080 × 600 (`design-system.md` §7.3, unchanged).

**Targets.** 44px minimum, measured on the object, not on the glyph —
and in this language the object is larger than before, because the pane
*is* the control.

## 6 · Typography

**Scale, unchanged**: 36 · 28 · 22 · 18 · 15, at most four on a screen,
15px only at weight 600 and only for one line. The floor exists because
`ui-improve.md` measured what happens below it.

**Families, both already subset and self-hosted:**

| role | family | why |
|---|---|---|
| **the English being examined** — the sentence under test, every option, every example [K] | Source Serif 4, upright | it is the specimen; it should look like one |
| **everything the app says** — instruction, explanation, label, action, nav | Source Sans 3 | Turkish, and it is the app talking |
| **everything measured** — a score, a count, a day, a page | Source Sans 3, `font-variant-numeric: tabular-nums` | figures that line up read as measurements |

**No fourth font file.** No serif italic (we ship none), no instrument
face. The "technical" quality of references 1 and 10 comes here from
tracking, weight and tabular figures, which is less than they have and
the right trade for an app that must be read at 320px.

**Tracking**: −0.02em at 36px, −0.015em at 28, −0.01em at 22, 0 at 18,
**+0.04em at 15px when uppercased**. Uppercase is reserved for the
section label and the eyebrow, one line each.

**`lang` is not cosmetic.** `text-transform: uppercase` follows the
element's language: an English label under `lang="tr"` renders *SİMPLE*.
Every English string that is uppercased or spoken carries `lang="en"`.

## 7 · Light and depth

**One direction, every screen: the top-left.** The field's gradient is
anchored there (§2.1); every object's *top* edge carries the lit line;
every shadow falls down and slightly right.

| token | dark | light |
|---|---|---|
| `--lit-edge` | `rgb(255 255 255 / 0.10)` | `rgb(255 255 255 / 0.70)` |
| `--shadow-lift` | `0 2px 6px rgb(0 0 0 / 0.45), 0 20px 44px -18px rgb(0 0 0 / 0.70)` | `0 2px 4px rgb(40 25 5 / 0.08), 0 18px 40px -16px rgb(40 25 5 / 0.28)` |
| `--shadow-rest` | `0 1px 2px rgb(0 0 0 / 0.40), 0 10px 28px -12px rgb(0 0 0 / 0.60)` | `0 1px 2px rgb(40 25 5 / 0.06), 0 8px 24px -10px rgb(40 25 5 / 0.18)` |

**A shadow lifts an object off the field. It never separates two planes
of nearly the same lightness** — that was UI 3's mistake, and the 0.125
card step (§4) is what makes it unnecessary.

**No inline shadows and no inline gradients.** They are tokens or they
are not there.

## 8 · Motion

**Motion changes the light, not the layout.** Transform and opacity
only; nothing reflows.

| event | what changes | duration | easing |
|---|---|---|---|
| a press | the field dims one step; the pane scales 0.985 | 120ms | `--ease-standard` |
| a release | both return | 170ms | `--ease-out` |
| a screen arrives | the field fades in from 0; content translates 8px up | 260ms | `--ease-out` |
| a correct answer | the option's **edge** lights to `--c-ok` | 260ms | `--ease-out` |
| a wrong answer | the option's edge lights to `--c-no`, 2px shake | 170ms | `--ease-standard` |
| a value arrives | a bar or rule grows from 0 to its width | 432ms | `--spring-gentle` |
| the tab indicator | slides | 768ms | `--spring-bouncy` |

**Two** of the three springs are kept — `--spring-gentle` and
`--spring-bouncy`, both derived from the damped-spring model in
`scratchpad/ui3/spring.mjs`, tokenised and already shipped.
`--spring-pop` is **deleted**: it existed for the answer card's pop, and
in this language a correct answer lights an edge rather than inflating a
box.

**Reduced motion.** Every one of the above collapses to an opacity
change of `--d-micro` or to nothing. The field never animates under
`prefers-reduced-motion`.

## 9 · Texture

**One token, and it belongs to the field.**

```css
--tex-dots: radial-gradient(currentColor 0.9px, transparent 0.9px);
--tex-size: 10px 10px;
--tex-opacity: 0.10;   /* dark */   /* 0.06 light — [A], specimen 7 */
```

It always **lightens** the surface it sits on, so every existing `PAIRS`
row stays valid by construction: the darkest point under the texture is
still the measured surface.

**Hatching means *not measured yet***, and nothing else. A category with
no answers, a day not yet reached, a lesson not opened. 45°, 6px pitch,
`--c-divider`.

Texture goes on the field and, at most, on the one painted action. Never
on a glass pane — a pane already has the field's texture showing through
it, and doubling it is UI 3's washes in another form.

## 10 · Drawing

**Icons.** The existing §6 contract is unchanged: 24-unit box, stroke
1.7, round caps and joins, `currentColor`, no fill except a deliberate
mark. Twenty icons exist in `js/icons.js`.

**Topic marks** ⟲ replace the per-topic hue. One drawn mark per topic,
40-unit box, stroke 2, one accent-filled element. `visual-longevity.md`
§5.5; the hue system it replaces was measured collapsing into 30°.

**Data drawings.** Built from `js/dom.js` node builders and inline SVG,
one accent, no library. Three shapes, and no fourth without a reason:

| shape | for | empty state |
|---|---|---|
| the week — seven bars | days, sessions | hatched bars, not zero-height |
| the line — a labelled bar | a category's accuracy | hatched track, "henüz ölçülmedi" |
| the dot row — n dots, filled/empty | a session's ten answers | all empty |

**Every drawing must be legible with no data.** That is the state a new
learner is in, and v0.62 handled it by inventing numbers.

---

# PART FIVE · THE INVENTORY

## 11 · Components

Twenty-one components have entries in `docs/components.html` and the
sweep enforces it. Here is each one restated in this language; ⟲ marks a
material change.

| # | component | in this language |
|---|---|---|
| 1 | **bar** | no glass, no fill ⟲ — the field shows through it; the title is the screen's name |
| 2 | **nav** | a capsule pane at α 0.55 (carries no body text), indicator in the mark |
| 3 | **foot / action bar** | transparent; holds the one painted action |
| 4 | **pane** ⟲ | was *card*. Glass, α 0.78, content radius, lit top edge |
| 5 | **list** | one pane containing rows; rows separated by `--c-divider`, never by gaps ⟲ |
| 6 | **row** | 60px min, mark · title · sub · trail |
| 7 | **tile** ⟲ | a **control** pane: control radius 0.16, the whole object is the target, label top-left |
| 8 | **action** | the one painted element (§2.3) |
| 9 | **quiet action** | text plus a 1.5px `--c-edge` outline, pill |
| 10 | **chip / filter** | pill, α 0.55 glass; selected = painted |
| 11 | **option** ⟲ | a control pane. Verdict is a 4px mark in the left margin plus a 2px edge — never a filled box |
| 12 | **field (input)** | pill, α 0.78, `--c-edge` 1.5px |
| 13 | **listbox** | the select-only combobox contract, unchanged; menu is a pane |
| 14 | **dialog** | native `<dialog>`, pane material, backdrop dims the field |
| 15 | **prose** | no pane, no field ⟲ — the ground and the ink |
| 16 | **band** | a full-bleed section of field at stop 3, for a contrast pair |
| 17 | **section head** | 15/600 uppercase, `--c-accent-ink`, `+0.04em` |
| 18 | **stat** | tabular figure + label; the figure never in the mark colour |
| 19 | **drawing** | §10 |
| 20 | **progress** | a mark rule on a `--c-divider` track, 3px |
| 21 | **live region** | invisible; one per screen |

Deleted: the ring, the monogram orb, the hashed-hue tile, the confetti
canvas.

## 12 · Which screen gets which field level

| screen | level | painted action | why |
|---|---|---|---|
| the entrance (`#bugun` / `#egitim`) | **tam** | yes, one | this is the first two seconds |
| topic overview | tam | yes | it is an entrance to a topic |
| the question | **kısık** | yes ("Kontrol et") | reading, but short |
| the answer | **kısık** | yes ("Devam") | reading, and the explanation is 377 chars |
| the lesson reader | **alansız** | no ⟲ | prose at full column width |
| the lesson check | kısık | yes | it is a question |
| results / summary | **tam** | yes | it is a summary, and it is earned |
| Profil | kısık | no | settings are not an occasion |
| the first run | tam | yes | it introduces the app |

The level is declared on the screen's root element (`data-alan="tam"`)
so it is auditable, and a screen without a declaration is a failure, not
a default.

## 13 · States

Every interactive object, in this language, in this order:

| state | what changes |
|---|---|
| rest | pane at its alpha, lit edge, `--shadow-rest` |
| hover (pointer only) | `--shadow-lift`, alpha +0.04 |
| press | scale 0.985, field dims one step, 120ms |
| focus-visible | 2px `--c-focus` ring, 2px offset, **on the object** not on an inner control ⟲ |
| disabled | alpha 0.55, ink at `--c-text-3`, no shadow |
| selected | painted |
| correct | 4px `--c-ok` mark in the left margin, 2px edge |
| wrong | 4px `--c-no` mark, 2px edge, shake |
| empty | hatched, with a sentence — never a zero |
| loading | the field alone, no skeleton boxes ⟲ |

## 14 · The accessibility contract

Unchanged in substance, extended where the material is new.

1. Every colour solved against **both** WCAG 2 and APCA, both themes,
   every size pairing — `npm run color`, in CI.
2. Glass surfaces measured as composites over the field's extremes
   (§2.2).
3. 44px targets; the object is the target.
4. `prefers-reduced-motion`, `prefers-contrast: more`,
   `prefers-reduced-transparency`, `forced-colors` — all four honoured;
   the last two are new here and non-optional.
5. `lang="en"` on every English string that is uppercased or spoken.
6. The listbox keeps the full select-only combobox contract; the dialog
   stays native.
7. One live region per screen.
8. The sweep runs at 320 / 390 / 768 / 1280 and in both themes.

## 15 · Measurement, and what asserts what

| property | asserted by | where |
|---|---|---|
| every colour pair | `tools/palette.mjs` | `npm run check`, CI |
| glass composites | `tools/palette.mjs`, new rows | CI |
| overflow, targets, console, §7.3 | `tools/verify-ui.mjs` | `npm run verify` |
| field level per screen | `measure-screens.py` + the `data-alan` attribute | `npm run audit` |
| one hue family per screen | `measure-screens.py` | `npm run audit` |
| component catalogue completeness | the sweep | `npm run verify` |

**The medians `04-brief.md` §2 used are rebased ⟲.** Over the five he
named rather than eleven [S]:

| | his five | `04-brief` used |
|---|---|---|
| grounds | 5 of 7 dark (L 0.07–0.39) | 5 of 6 white (L 0.91–1.00) |
| glass planes | 34–49% | 6–30% |
| field light | 2–53% | 0.1–21% |

`04-brief.md` C1, C2, C3, C6 survive unchanged — they are about
modulation and hue discipline, which both sets share. **C4, C5, C7 and
C8 are replaced** by §2.1's three levels, which say the same thing in
the right material.

## 16 · Refusals

Carried forward, each with the reason it was refused.

- `visual-longevity.md` §6 — streaks, XP, badges, mascots, confetti,
  skins, cosmetic unlocks. Reference 8 shows a streak; that changes
  nothing.
- `02-references.md` §13 — telemetry density, product renders, type at
  10–11px, a gradient behind body text, the bento grid.
- `02-references.md` §14 — Liquid Glass as a system. `backdrop-filter`
  is ours; the platform material is not.
- `06-sozel-yonerge.md` §7 — **no fourth font file.**
- `03-research.md` §9 — the per-topic hue. Measured collapsing into 30°.
- And the one that is about process rather than pixels: **no screen is
  signed off by a green check.** The checks are necessary and they are
  not sufficient.

---

# PART SIX · WHAT IS STILL OPEN

## 17 · The open values

Seven were open. **Three were answered on 2026-09-11** and are now part
of the specification; four remain, and each is settled by looking.

### Answered [K]

| # | question | answer | what it fixes |
|---|---|---|---|
| **A1** | how vivid is the mark | **H 45** — light `#CE5500` C 0.171, dark `#FE6A00` C 0.200 | +37% / +60% on today; the H 36 ceiling is dropped |
| **A2** | warm or cool dark ground | **warm, H 70** | `--c-surface-0` `#14100B`, `-1` `#322D27`, `-2` `#413C36`; inks `#F4F1ED` · `#DED9D3` · `#C6C0B9`; divider `#514C46`. The cool column of §3.1 is dropped |
| **A7** | where the serif goes | **every English under examination** — the question sentence, the options, example sentences | the type class comes to mean *this is the English being examined* |

A2's reason for the record: the cool ground existed so the accent had a
second channel to differ on (`beta1-palette.md`). With the mark at
C 0.200 it differs on chroma and lightness instead, and the measurement
[S] showed warm and cool to be identical on every contrast requirement —
so the argument had nothing left holding it up.

### Still open [A]

| # | question | the alternatives | measured |
|---|---|---|---|
| A3 | the action: painted or a plane | `#C35000` / `#FFA401` · `#241E18` / `#ECE7E1` | Lc 77 / 65 vs Lc 97 / 92 [S] |
| A4 | does the control radius survive as an arc | 0.16 arc · 0.16 superellipse · drop to 0.12 | `corner-shape` ~65%, not Baseline |
| A5 | the field's extent at *tam* | 15% · 20% · 25% | all three inside the reference band |
| A6 | the near-white pane on the dark theme at night | α 0.78 · α 0.55 · a darker tint | Lc 95 either way; the complaint would be glare |

A3 is the one with a real argument on both sides, and §2.3 states it:
the plane wins on contrast by twenty Lc, the painted one wins because in
a screen made of glass the only opaque saturated object *is* the action.
Neither reading settles it, which is why it goes to specimen 6.

## 18 · What still needs work, and is not a choice

1. **The light theme is now the harder half.** Field light and a lit
   edge are phenomena that read on a dark ground and are fragile on a
   light one. §2.1's light stops are solved but unlooked-at.
2. **Two blurred surfaces per screen** is a budget nobody has tested on
   a real low-end Android. It needs one measurement on a real device
   before step 9.
3. **`data-alan` has to be enforced**, or the three levels become a
   suggestion and the language flattens again — which is exactly how
   five rounds produced screens between 5.1% and 15.3% event area
   without anyone noticing.
4. **The lesson reader's shape** is not a design problem. `03-research`
   §6 measured it: their reading page is 21 rows of continuous prose,
   ours is short blocks with 25–50px gaps. It belongs to the lesson
   schema and to `visual-longevity.md` §5's first lever, and no CSS in
   this document fixes it.
5. **The empty state of every drawing** has to be designed, not
   defaulted.

## 19 · The specimen sheet — what step 8 draws from this

Not app screens. Each specimen is one material property at real size,
with its measurement printed beside it and its alternatives shown.

| # | specimen | settles |
|---|---|---|
| 1 | the field at *tam · kısık · alansız*, both themes, at 15 / 20 / 25% | §2.1, A5 |
| 2 | one pane at α 0.55 / 0.70 / 0.78 / 0.90 over the field's brightest and darkest point, ink contrast printed on each | §2.2, A6 |
| 3 | the same object at r/w 0.056 · 0.09 · 0.16, arc and superellipse, at 358 and 176px | §5, A4 |
| 4 | the question screen's type in place: serif English against sans Turkish, at 320 and 390 | §6 |
| 5 | one pane lit from each of four corners | §7 |
| 6 | the same action painted (`#C35000` / `#FFA401`) and as a plane (`#241E18` / `#ECE7E1`), on the field, with both labels measured | §2.3, A3 |
| 7 | the dot field at three opacities, and hatching | §9 |
| 8 | press · arrive · verdict, as three loops | §8 |
| 9 | every component from §11 at rest, in both themes | §11 |
| 10 | every state from §13 on one object | §13 |

**Nothing is applied to the app until the sheet has been looked at and
A3, A4, A5 and A6 answered.**
