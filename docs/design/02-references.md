# The references, measured

2026-09-11. The owner supplied the input that had been missing for five
rounds: five screens he likes, all from the same studio
(`rondesignlabs`), with the note that they are not our concept and may
even be opposite to it — offered as taste, not as a template.

That is the right way to give them, and it is also why they have to be
*measured* rather than described. "Modern, clean, alive" is the kind of
sentence that has failed four times. What follows is what the pixels
say.

Marks as elsewhere: [S] read from the source; [≈] an estimate.

---

## 1 · What they are

| # | screen | kind |
|---|---|---|
| 1 | *Traffic Management* — fleet dashboard on a tablet | dark, dense telemetry |
| 2 | *Hydroflask* — a bottle's control screen | dark, product hero, glass |
| 3 | *Hydroflask* — "How much did you drink today?" | light, full-bleed warm gradient |
| 4 | a crypto wallet | light, pastel field, one floating card |
| 5 | *Salesforce Opportunities* redesign on a tablet | white, four saturated data tiles |

None of them contains a paragraph. Every one of them is built around
numbers and objects. Our core screen is a 198-character English
paragraph followed by a 377-character Turkish explanation. Section 5
says what that costs.

## 2 · The measurements

Each reference cropped to its post's image area, downsampled to 200px
wide, the mockup's studio background dropped as the modal colour, then:
the share of pixels with chroma below 0.10 (**neutral**); the share of
pixels whose local gradient exceeds 0.10 (**drawn structure**); and the
5th-to-95th percentile spread of lightness (**tonal range**). Our own
screens measured the same way, without the background drop, because
there is no studio background to remove.

| | neutral | drawn structure | tonal range |
|---|---|---|---|
| REF 1 Traffic | 99% | 14.4% | 0.60 |
| REF 2 Flask | 65% | 20.6% | 0.87 |
| REF 3 Log | 48% | 13.0% | 0.85 |
| REF 4 Wallet | 77% | 17.3% | 0.91 |
| REF 5 Salesforce | 68% | 11.3% | 0.37 |
| **their median** | **68%** | **14.4%** | **0.85** |
| v0.62 Bugün | 90% | 13.5% | 0.58 |
| v0.62 Öğren | 92% | 12.5% | 0.48 |
| v0.62 cevap | 94% | 21.5% | 0.58 |
| ui4 prototype Bugün | 93% | 14.5% | 0.59 |
| ui4 prototype cevap | 90% | 19.7% | 0.63 |
| ui4 prototype Öğren | 97% | 12.4% | 0.22 |
| **our median** | **92%** | **14.0%** | **0.58** |

And, separately, how concentrated the colour is: the share of all
chromatic pixels that live in the busiest fifth of a 10×16 grid of
cells.

| REF 1 | REF 2 | REF 3 | REF 4 | REF 5 |
|---|---|---|---|---|
| 100% | 71% | 44% | 83% | 73% |

## 3 · Four findings

**F1 · We are not too colourful. We are too colourless.**
Their median screen is 68% neutral; ours is 92%. The gap is not small
and it runs the opposite way to the assumption behind four rounds of
work, in which the response to "too much" was always to subtract.

The colour they use is **concentrated**: in four of the five, three
quarters or more of it sits in a fifth of the screen. Reference 1 is the
extreme — 99% neutral, and every chromatic pixel inside one fifth of the
cells. That is colour spent on a few objects, not spread as atmosphere.

v0.62 did exactly the opposite: two ambient washes across the whole
page, a gradient on every filled button, a glow under it, and a
different hue for every topic. Colour everywhere, concentrated nowhere.
Which reads, correctly, as tint rather than as design.

**F2 · Their screens have a much wider tonal range, and this is the
biggest single gap.**
Their median spread from the 5th to the 95th percentile of lightness is
**0.85**; ours is **0.58**. They put a near-white card on a deep field
(4), a bright product against a dark ground (2), a white panel above
saturated tiles (5). Within one screen they travel most of the available
range.

Our three surfaces span **0.11** of lightness by construction —
`surface-0` 0.175, `surface-1` 0.228, `surface-2` 0.286 — because the
palette was solved for uniform readability. Everything is safe, and
therefore flat.

This also explains why UI 3's shadows did not work. Depth was added as a
shadow token while the tonal separation stayed at 0.05 between a card
and its page. A shadow under two nearly identical greys reads as a
smudge, which is what the owner said it was, twice.

**F3 · Their type runs about 5:1 from largest to smallest, and the large
end is light.** [≈] Measured off the screenshots: 78.3 against
*Operational Efficiency*; 0.002541 against *Bitcoin*; the numeral 16
against *Log Additional Water Consumed*. Roughly five to one, with the
big figures set in a light weight and the small captions tracked wide.

Our scale is 36 · 28 · 22 · 18 · 15 — a ratio of **2.4:1** — and the top
of it is set at weight 600. We have no quiet end and no loud end. The
one device every reference leans on, a very large light figure beside a
very small tracked caption, is not available to us at all.

**F4 · Nothing in these five screens is ornament. All of it is
information.**
The sparklines, the tick ladders under the route numbers, the ±2.5 min
scale, the venn of two overlapping circles, the small technical line
drawings of the buses, the line charts sitting on top of the coloured
tiles — every visually interesting element is a rendering of data.

v0.62 spent a comparable visual budget on a hue derived from hashing a
topic id, a glow, a flame, a ring and confetti. Same budget, zero
payload. That is the mechanical difference between the two, and it is
also, word for word, what `docs/research/visual-longevity.md` §5 ranked
first and second and what the last four rounds never touched.

## 4 · Where the v0.62 error is exactly located

In all five references, saturated colour and gradient appear **on
content objects** — a data tile, a product hero, the surface of a
logging screen. In none of them does it appear on the navigation chrome,
and in none of them is it applied to every button.

v0.62 put the gradient and the glow on the chrome and on every primary
action, and left the content grey. That is the inversion, and it is
enough on its own to explain the verdict. The instinct was not wrong;
the surface it was applied to was.

## 5 · What transfers, and what does not

**Transfers.**

- A colour budget near a third of the screen rather than a twelfth, spent
  on few objects.
- A tonal range near 0.85 within a screen: one near-white plane against a
  deep field, rather than three greys 0.05 apart.
- A type ratio near 5:1, with the large end light and the small end
  tracked. Our scale needs a new top and a new bottom, and the new top
  must not be 600.
- Ornament that is information: the learner's week, a session's ten
  answers, a category's accuracy, a contrast drawn as a diagram. We have
  all of this data and render none of it.
- Pills for choice and navigation; one filled, the rest quiet.

**Does not transfer, and saying so now is cheaper than finding out in
round six.**

- Telemetry density. Reference 1 works because 200 numbers *are* the
  content. Ours is prose.
- Product renders. There is no object to photograph.
- Type at 10 and 11 px. `docs/research/ui-improve.md` measured that
  exact failure in this app and it is why the floor is 15.
- A full-bleed gradient behind body text. Reference 3 puts display type
  on a gradient, not a 377-character paragraph; every pair in
  `tools/palette.mjs` would fail.

## 6 · The reference that is still missing

All five are number screens. Sixty per cent of this app is reading: a
paragraph, an explanation, a lesson. Designing from these five alone
would produce a beautiful dashboard and an ugly reading surface, and the
reading surface is where a learner spends their time.

**Needed: one or two things he finds beautiful that are mostly text.**
A reading app, an article page, a book or magazine spread, a
documentation site, a newsletter. It does not have to be an app. Without
it, the type decisions in §3 are being made for numbers and applied to
Turkish prose on faith.
