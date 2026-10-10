# Sözel yönerge — the design language, argued before it is drawn

2026-09-11. The three directions of step 5 were rejected, and the
rejection came with the correction that matters most in this folder:

> *"Bu appleri örnek al kopyala değil tasarım fikri olsun diye
> yaptım. Amacın uygulamaya uyarlamadan önce bir tasarım şablonu
> oluşturmak, önce yönerge sonra uygulama. Önce sözel ve ardından
> görsel bir yönerge. Tasarımın her aşamasında düşünce araştırma ve
> vizyon olmalı, bunun gibi yapalım değil hangi yaklaşım daha doğru
> şeklinde hareket edilmeli."*

So this file is the **sözel yönerge**: the language decided in words
first, with the reasoning shown, before anything is drawn. Every section
below has the same five parts — **Soru · Yaklaşımlar · Kanıt · Karar ·
Bedel** — because "which approach is more correct" is a question with a
shape, and a list of oughts is not an answer to it.

The **görsel yönerge** comes after this and is not app screens: it is a
specimen sheet of the material itself. §11 says what it will contain.

---

## 0 · Two errors, mine, and how I know

**E1 · I chose which references to weight, and chose wrong.**

He sent eleven and then named five. The five are references **1, 3, 4,
8, 10** — the traffic tablet, the Hydroflask log screen, the crypto
wallet, MidnightReads, the wearable control screen. The six I built
`02-references.md`'s medians and `04-brief.md`'s spec from include the
two book apps, the solar dashboard and the insurance app, about which he
had already written *"çok bizim stilimize uygun bulamadım."*

Measured, the two sets are almost disjoint on the one property that
matters most [S]:

| | grounds |
|---|---|
| **his five** | L 0.07 · 0.12 · 0.20 · 0.32 · 0.39 · 0.87 · 0.96 — five of seven **dark** |
| **my six** | L 0.25 · 0.91 · 0.97 · 1.00 · 1.00 · 1.00 — five of six **white paper** |

Every median in `02-references.md` §3, and therefore every number in
`04-brief.md` §2, was computed over a centre he had already rejected.
The worst consequence: F1's whole argument — *our **light** theme has no
counter-plane* — is aimed at the light theme because **my set was
light**. His set says the question was never mainly about the light
theme.

**E2 · Step 5 varied the wrong axis, and this is the larger error.**

He asked, in his own words, for *"bağımsız bir tasarım / tema / font /
animasyon / visual-teknoloji geliştirmesi."* Step 5 gave three
**product structures** — what carries the entrance — wearing one visual
language that I picked on my own. The thing that was supposed to be
chosen was never put up for choice. That is the same failure
`01-diagnosis.md` §4.4 named, committed again in a folder written to
stop it.

The corrected procedure, replacing `01-diagnosis.md` §6 rows 5 onward:

| # | step | output | state |
|---|---|---|---|
| 5 | Üç yön — *wrong axis; kept as record* | `05-directions/` | rejected |
| 6 | **Sözel yönerge** — the language argued in words | this file | now |
| 7 | **Görsel yönerge** — the specimen sheet of the material | `07-gorsel/` | next |
| 8 | Araç seti — tokens, catalogue, measurements | `08-toolkit/` | |
| 9 | Uygulama | a release | |

---

## 1 · What the five actually are, measured

All measurements `docs/design/measure-screens.py`, screen crops, plus two
new columns defined for this file:

- **alan ışığı (field light)** — the share of pixels that are a *large
  smooth coloured area*: OKLab chroma ≥ 0.06 with a local lightness
  gradient under 0.02. Colour that is a lit field, not an edge or a mark.
- **cam / opak düzlem** — the share sitting 0.02–0.12 in L away from the
  screen's own ground (a translucent plane) against the share sitting
  more than 0.30 away (an opaque slab).

| | ground | field light | glass planes | opaque planes |
|---|---|---|---|---|
| 1 · Traffic | 0.20 | 0.0% | **44.2%** | 2.6% |
| 3 · Log | 0.12 | **52.5%** | 10.6% | 78.0%¹ |
| 4 · Wallet | 0.96 | 2.1%² | **48.9%** | 12.3% |
| 8 · MidnightReads | 0.32 | 3.5% | **43.6%** | 8.7% |
| 10 · Wearable | 0.07 | **18.9%** | **34.8%** | 24.5% |
| — | | | | |
| my direction A (light) | 0.96 | 8.5% | 27.7% | **41.4%** |
| my direction A (dark) | 0.18 | 8.2% | **7.8%** | **43.0%** |
| my direction C (dark) | 0.18 | 14.8% | **5.7%** | **41.6%** |

¹ reference 3 is a full-bleed gradient, so its "opaque" share *is* the
field. ² the wallet's field is a pastel aurora whose chroma sits just
under the 0.06 line — visible, and below the threshold; noted rather
than tuned away.

**One sentence carries the whole file: their objects are glass, mine are
slabs.** Their glass planes run 34–49%; my dark screens are at 6–8%,
with 41–43% of the screen as opaque cards. I built the right composition
out of the wrong material.

---

## 2 · Soru · What is an object made of?

**Yaklaşımlar.**

- **(a) The opaque plane.** An object is a solid surface a fixed step
  lighter or darker than the page, with a shadow. This is
  `design-system.md`'s current answer and what step 5 built.
- **(b) Glass.** An object is a translucent pane that takes its colour
  from what is behind it, blurred, with a thin lit edge. What all five
  of his references do.
- **(c) No object.** Content sits directly on the ground and is grouped
  by space and rule alone. The editorial answer; what UI 2 was.

**Kanıt.** Glass planes 34–49% in his five against 6–8% in mine [S].
`backdrop-filter` is **Baseline**, above 97% globally, needing only the
`-webkit-` prefix for Safari — so unlike `corner-shape` this is not a
progressive enhancement, it is available ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter),
[web-features](https://web-platform-dx.github.io/web-features-explorer/features/backdrop-filter/)).

The objection that has to be answered is text contrast: a blurred,
variable ground is not a ground `PAIRS` can measure. Solved — the
composite is computable, so the floor is computable [S]:

| glass opacity before the blur | worst ground under it, dark | worst, light |
|---|---|---|
| 0.60 | Lc 93 ✓ | Lc 84 ✗ |
| **0.70** | Lc 94 ✓ | **Lc 88 ✓** |
| **0.78** | Lc 95 ✓ | **Lc 91 ✓** |
| 0.90 | Lc 96 ✓ | Lc 97 ✓ |

Computed by compositing the glass tint over the darkest and the
brightest point of a lit field and measuring the ink against the worst
result. The light theme binds, at **α ≥ 0.70**.

**Karar. (b), with a rule that makes it measurable.**

> **A glass object that carries text is at least 78% opaque before the
> blur; one that carries no text may go to 55%. Every glass surface
> declares the tint and the alpha, and `PAIRS` measures the ink against
> the composite over the field's extremes, not against the tint.**

78 rather than 70 because a palette with no headroom fails the next time
anything moves — the same reason §4.3 of `03-research.md` chose the
0.125 card step over the 0.170 one.

**Bedel.** Three real ones, stated now.

1. `backdrop-filter` is expensive on old Android. Mitigation is a rule,
   not a hope: **at most two blurred surfaces on a screen**, and
   `@media (prefers-reduced-transparency)` plus a no-blur fallback where
   the tint alone is the surface — which the α ≥ 0.78 floor already
   guarantees is legible.
2. Glass only means anything if there is something behind it. That makes
   §3 not optional.
3. UI 3 already shipped glass and was rejected. The difference is
   located precisely in §3 and §4 and is not a matter of degree.

---

## 3 · Soru · Where does colour live?

**Yaklaşımlar.**

- **(a) On the object.** A tile is orange; a button is orange. What
  v0.62 did on every filled control, and what `02-references.md` §9
  concluded from the wrong six.
- **(b) In the field behind the objects.** The ground is lit — a
  gradient, an aurora, a glow — and the objects are neutral glass that
  the light passes through. What references 3, 4, 8 and 10 do.
- **(c) Nowhere; colour is only ink and mark.** The editorial answer,
  which is `03-research.md`'s recommendation and which the five reject.

**Kanıt.** Field light: reference 3 **52.5%**, reference 10 **18.9%**,
reference 8 3.5% but over a visibly warm glow, reference 4 a pastel
aurora sitting just under the chroma threshold. My directions: 8.2–14.8%
— and all of it inside one opaque card rather than behind anything [S].

And the correction this forces on my own earlier finding: I wrote in
`02-references.md` §9 that *saturated colour appears on content objects
and never on chrome.* Measured against his five that is not right
either. The accurate statement is narrower and stronger:

> **Colour is light. It is emitted from behind or within, and objects
> are what the light passes through. Colour is not paint applied to a
> surface.**

That distinguishes his five from v0.62 exactly, and it explains why
v0.62's two ambient washes failed while reference 3's full-bleed
gradient works: v0.62's washes were weak (chroma under the visible line)
*and* it also painted every button. A field must be strong enough to be
a light source, and then nothing else needs paint.

**Karar. (b).** The field carries the colour; objects are glass; exactly
one element per screen is painted, and it is the one action.

**Bedel.** A saturated field behind a 377-character Turkish paragraph is
not survivable — every pair in `tools/palette.mjs` fails. §5 is where
that gets resolved rather than waved at.

---

## 4 · Soru · What is the ground — paper, or night?

**Yaklaşımlar.**

- **(a) Paper first.** The light theme is the design and the dark theme
  is its inversion. What `04-brief.md` assumed, because my reference set
  was white.
- **(b) Night first.** The dark theme is the design; the light theme is
  solved separately to the same rules. Five of his seven screens are
  dark, and the two light ones are not paper — the wallet is a pastel
  field and MidnightReads' white card sits on a dark app.
- **(c) Neither: both solved independently.** What `beta1-palette.md`
  actually did, and why the light theme is not an inversion today.

**Kanıt.** His grounds: 0.07, 0.12, 0.20, 0.32, 0.39 [S]. Three of the
five sit *below* our own `surface-0` at 0.175. Reference 10's ground is
**L 0.07** — near-true-black, with the light coming entirely from the
tiles. Meanwhile he has twice told us the light theme matters: *"beyaz
mod rezil, krem kullan"*, and the cream ground came from his own
reaction.

So this is not "dark instead of light". It is **which theme the language
is designed in**, and the honest answer is that a language designed in
cream and inverted produces the dark theme we have — correct, and flat.

**Karar. (b), with (c)'s discipline.** The language is designed at
**night** — because field light, glass and a lit edge are all phenomena
that are *legible* on a dark ground and *fragile* on a light one, so the
hard case must be the one that is designed rather than derived. The
light theme is then solved to the same rules rather than inverted, as
`beta1-palette.md` already insists.

And one concrete change follows immediately, from `03-research.md` §4.3
[S]: the dark ladder moves from **0.175 / 0.228 / 0.286** to **0.175 /
0.300 / 0.360** — a card step of 0.125 instead of 0.053, zero `PAIRS`
failures. A language of glass and light needs a ladder wide enough for a
pane to be visible on it; ours was built for a document.

**Bedel.** The light theme becomes the harder half of the work rather
than the free half, and it must be solved rather than mirrored. §5's
division is what keeps it honest.

---

## 5 · Soru · Does this survive a paragraph? — the limit, and the division

This is the section the whole file exists for, and it is where "hangi
yaklaşım daha doğru" actually bites: **his five are apps with almost no
prose, and our core screen is a 198-character English paragraph followed
by a 377-character Turkish explanation.**

Reference 8 is the only one of the five with real reading in it, and it
is instructive: its reading view drops the field almost entirely —
field light **3.5%**, glass 43.6%, and the body text sits on the
quietest surface in the app [S]. The app that reads is the app that goes
quiet.

**Yaklaşımlar.**

- **(a) Apply the language everywhere.** Field and glass on every
  screen. Fails `PAIRS` on the reading surface, and reference 8 does not
  do it either.
- **(b) Apply it nowhere near text.** Field and glass only on Profil and
  the entrance. Safe, and it would leave the app's most-seen screen
  exactly as flat as the thing he keeps rejecting.
- **(c) Divide by what the screen is for**, and make the division part
  of the language rather than an exception to it.

**Kanıt.** `02-references.md` §10's modulation finding, restated in
material terms: the references' entrances run 30–67% event area and
their reading screens 5.5–21.7%. Reference 8 achieves that *with the
same tokens* by turning the field down, not by changing language.

**Karar. (c), stated as one rule with three states.**

> **The field has three levels, and the screen's job picks one.**
>
> - **Tam alan (full field)** — the entrance and the summary. Field
>   light 15–25%, glass objects, one painted action.
> - **Kısık alan (dimmed field)** — the question and the answer. The
>   field survives only as a lit edge and a corner glow behind the
>   chrome; field light 2–5%; the question itself sits on the quietest
>   plane in the app.
> - **Alansız (no field)** — the lesson reader. A plain ground, ink, and
>   the mark. Field light under 1%.

This is the same object, the same tokens and the same components at
three intensities — which is how reference 8 does it, and it is also
exactly the loudness range `04-brief.md` C3 asks for, now expressed as a
material rather than as a number to hit.

**Bedel.** Three states is a thing to get wrong, and a screen that
picks the wrong one will look like a different app. It has to be
declared per screen in the spec and asserted by the audit, not left to
whoever writes the next screen.

---

## 6 · Soru · What shape is an object?

**Yaklaşımlar.** (a) one radius for everything — today's answer;
(b) radius proportional to the object, in two families — content 0.08
and control 0.15, which `02-references.md` §11 measured; (c) the
superellipse, which `03-research.md` §10 established is Chromium-only,
~65%, not Baseline.

**Kanıt.** Reference 10's tiles measure r/w **0.171** and its one action
0.153; the wallet's floating card and MidnightReads' cards sit near
0.09–0.10 [S]. Ours is a single 0.056 — the bottom of the content range,
used for controls as well.

**Karar. (b), designed as a circular arc.** Two families: **content
0.09**, **control 0.16**. `corner-shape: superellipse()` is added as a
progressive enhancement and the design must be complete without it.

**Bedel.** At r/w 0.16 the arc's kink at the tangent is visible, and
whether that is acceptable cannot be settled in prose. It is the first
thing the görsel yönerge has to show at real size.

---

## 7 · Soru · What does the type sound like?

**Yaklaşımlar.** (a) editorial — a serif for what is read, a humanist
sans for everything else, which is where the app is now; (b) technical —
a grotesque with wide tracking, light weights at display size, tabular
and dotted numerals, which is what references 1 and 10 use; (c) both,
split by what the text *is*.

**Kanıt.** References 1 and 10 set their values in a dotted,
segmented, instrument face and their labels in a light wide-tracked
grotesque — the numbers look *measured*. Reference 8 sets its body in a
serif. Our app has both families already subset and self-hosted, and
uses the serif for almost nothing. `03-research.md` §5 found we ship no
serif italic, so any italic plan costs a fourth file.

**Karar. (c), and the split is by what the text is, not by where it
sits.**

> - **Serif (upright), for the language being examined.** The English
>   sentence under test, the option, the example. It is the specimen,
>   and it should look like one.
> - **Sans, for everything the app says in Turkish.** Instruction,
>   explanation, label, action.
> - **Tabular sans, for every measured number** — a score, a count, a
>   day. `font-variant-numeric: tabular-nums`, which is already in the
>   stylesheet for two rules and should be the rule for all of them.

The dotted instrument face of references 1 and 10 is **refused**: it
would be a fourth font file for decoration, and `visual-longevity.md`
§6's logic against cosmetic additions applies to a typeface as much as
to a badge.

**Bedel.** The 15px floor and the five-size scale stay, so the
"technical" feel has to come from tracking, weight and tabular figures
rather than from a new face. That is less than the references have, and
it is the right trade for an app that must stay readable at 320px.

---

## 8 · Soru · Where does the light come from, and how does it move?

**Yaklaşımlar.** (a) no light — flat fills, which is UI 2;
(b) light as a shadow under objects, which is UI 3 and which failed
because the planes were 0.05 apart; (c) light as a **source with a
position**: a field lit from one corner, objects catching it on one edge,
and motion that changes the light rather than the layout.

**Kanıt.** Every one of the five is lit from a definite direction:
reference 10's tiles are bright at the top-left and deep at the
bottom-right; reference 3 runs pink at the top to yellow at the bottom;
reference 4's aurora rises from the bottom; MidnightReads glows from
behind the cards. None of them uses a shadow to say "this is above
that" — the *lightness of the pane* says it.

**Karar. (c).**

> **The field is lit from one corner, the same corner on every screen.
> An object's top edge catches that light as a one-pixel lit line; its
> shadow exists only to lift it off the field, never to separate it from
> a plane of nearly the same lightness.**
>
> **Motion changes the light, not the layout.** A press dims the field
> by one step; an arrival brightens it over one duration; a correct
> answer lights the option's edge rather than filling it. Transform and
> opacity only, and everything collapses under
> `prefers-reduced-motion`.

**Bedel.** A single light direction is a constraint the whole system has
to obey, including mirrored layouts and RTL, which this app does not
need today but which the rule should name.

---

## 9 · Soru · Texture — and is it ornament?

**Yaklaşımlar.** (a) none, which is where we are; (b) a dot grid and a
halftone as references 1 and 10 use; (c) texture only where it carries
information, e.g. a hatched region meaning "not yet".

**Kanıt.** Reference 10 carries a dot grid on its display ground and a
halftone inside its one yellow action; reference 1's tick ladders are
texture that is data. The solar dashboard's hatched "future" region —
from the set he set aside — is the clearest case of (c).

**Karar. (b) as a ground, (c) where it can be.** One texture token, a
dot field, at a fixed size, always *lightening* the surface it sits on
so that every existing `PAIRS` row stays valid by construction
(`03-research.md` §13). Hatching is reserved for "not measured yet",
which the app genuinely has: a category with no answers in it.

**Bedel.** Texture is the easiest thing in this file to overuse, and one
dot field on every surface would be UI 3's washes again in another form.
It belongs to the **field**, not to the objects.

---

## 10 · The directive, in sentences

Nine sentences. If a screen cannot be described with these, it is not in
this language.

1. **Colour is light.** It is emitted from a field behind the objects,
   never painted onto them. Exactly one element per screen is painted,
   and it is the one action.
2. **Objects are glass.** A pane, tinted and blurred, at least 78%
   opaque where it carries text and never below 55% anywhere.
3. **The language is designed at night** and solved again for day; the
   light theme is not an inversion.
4. **The field has three levels** — full, dimmed, none — and the
   screen's job picks one. The entrance is full; the question is dimmed;
   the reader has none.
5. **The light has one direction**, the same on every screen, and an
   object's top edge catches it.
6. **Two radius families** — content 0.09, control 0.16 of the object's
   own width — drawn as circular arcs, with the superellipse as an
   enhancement.
7. **Type is split by what the text is**: serif for the English being
   examined, sans for everything the app says, tabular figures for
   everything measured.
8. **Motion changes the light, not the layout.**
9. **Texture belongs to the field**, lightens what it sits on, and
   hatching means *not measured yet*.

And the refusals carried forward unchanged: `visual-longevity.md` §6
(streaks, XP, badges, mascots, confetti, skins, cosmetic unlocks),
`02-references.md` §13 and §14 (telemetry density, product renders,
10–11px type, a gradient behind body text, the bento grid, Liquid Glass
as a system), plus one added here: **no fourth font file.**

---

## 11 · What the görsel yönerge will be

Not app screens. A **specimen sheet** of the material itself, so the
language can be judged before anything is built out of it — which is the
step this folder has skipped twice.

| # | specimen | what it settles |
|---|---|---|
| 1 | the field, at its three levels, in both themes | §3, §5 |
| 2 | one glass pane at 55 / 70 / 78 / 90% over the field's brightest and darkest point, with the measured ink contrast printed on each | §2 |
| 3 | the same object at r/w 0.056 · 0.09 · 0.16, as an arc and as a superellipse, at real size | §6 |
| 4 | the type: the same sentence set as serif, as sans, and as both, at 320 and 390 | §7 |
| 5 | the light: one pane, lit from each of four corners, and the one that wins | §8 |
| 6 | the painted element: the one action, at the two candidate chromas | `03` §14.1 |
| 7 | texture: the dot field at three densities, and hatching | §9 |
| 8 | motion: press, arrive, verdict — as three short loops | §8 |

Each specimen carries its measurement beside it, and each is a choice
with the alternatives shown — which is the mechanism from the one round
that worked and the mechanism steps 2 through 5 kept failing to use.

**Nothing is applied to the app until a specimen sheet has been looked
at and the choices in it made.**
