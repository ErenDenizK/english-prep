# The references, measured

2026-09-11. The owner supplied the input that had been missing for five
rounds: screens he likes, with the note that they are not our concept
and may even be opposite to it — offered as taste, not as a template.

Two batches.

- **Batch 1**, five screens from one studio (`rondesignlabs`): *"Modern,
  sade, temiz, canlı ve interaktif, güzel ölçülmüş indexlenmiş,
  kullanışlı."*
- **Batch 2**, four more, after this file's first version asked for
  something text-heavy: two views of a book-reading app, a dark
  glassmorphism reading app, and a solar-energy dashboard. *"Çok bizim
  stilimize uygun bulamadım ama ikisi kitap okuma app'i… glassmorphism
  canlı güzel aydınlatılmış buton ve yapı önerisi bize oldukça uygun ve
  modern."*
- **Batch 3**, two more — the studio's wearable control screen and a
  light insurance app — with an instruction about *how* to read all
  eleven: *"sadece ölçüm değil aynı zamanda organizasyon, renk
  dağılımı, özellikle rondesignlab'e ait olanların şekilsel formu, UI
  elementlerinin yapısı… hem ölçüm, hem hissiyat ve bütüncül elementler
  bir arada değerlendirilmeli."* §10 to §12 are that reading.

That is the right way to give them, and it is also why they have to be
*measured* rather than described. "Modern, clean, alive" is the kind of
sentence that has failed four times. What follows is what the pixels
say.

Marks as elsewhere: [S] read from the source; [≈] an estimate.

> **This file's first version measured the wrong pixels, and its main
> finding was wrong.** §2 says how. The correction is not a detail: the
> first pass concluded *we are too colourless* and that conclusion does
> not survive measuring the screens themselves. It is left visible
> rather than quietly deleted, because a round that begins by saying
> the last four rounds asserted instead of measuring cannot then hide
> its own bad measurement.

---

## 1 · What they are

| # | screen | kind |
|---|---|---|
| 1 | *Traffic Management* — fleet dashboard on a tablet | dark, dense telemetry |
| 2 | *Hydroflask* — a bottle's control screen | dark, product hero, glass |
| 3 | *Hydroflask* — "How much did you drink today?" | light, full-bleed warm gradient |
| 4 | a crypto wallet | light, pastel field, one floating card |
| 5 | *Salesforce Opportunities* redesign on a tablet | white, four saturated data tiles |
| 6 | a book app — Books · Overview · Glossary | white/cream, orange accent, serif titles |
| 7 | the same app — Library and the **reading view** | white, orange serif chapter head, selection popover |
| 8 | *MidnightReads* — home · **reading view** · notes | warm dark, glass cards, gold accent |
| 9 | a solar dashboard — today · stored · impact | cream, orange, big light figures |
| 10 | *rondesignlabs* — a wearable's control screen | near-black, squircle tiles, two gradients, one yellow |
| 11 | an insurance app — home · hospital · map | white, one orange hero, black pill actions, grey map |

Batch 1 and reference 10 contain no paragraph at all. Batch 2 contains
three genuine reading surfaces (7's chapter page, 8's article page,
6's glossary entries), which is why it was asked for: our core screen is a
198-character English paragraph followed by a 377-character Turkish
explanation, and the first five could not say anything about that.

## 2 · How they are measured, and what the first pass got wrong

**The defect.** The first pass measured each reference as its *whole
Instagram post* — the studio's tan or grey backdrop, a hand holding the
device, the black bezel, and Instagram's own dark chrome, with only the
single most common quantised colour dropped as "background". A studio
backdrop with a vignette does not reduce to one quantised colour, so
most of it stayed in the sample. Reference 3's headline number — 48%
neutral, our "most colourful" reference — is substantially a photograph
of a warm gradient held in a hand, and reference 2's is a dark
photograph of a hand.

Those numbers were then compared against screenshots of our app, which
contain no backdrop, no hand and no bezel. The comparison had a
systematic bias in exactly the direction of the conclusion it produced.

**The method now.** Every reference is cropped to the *screen itself*,
inside the bezel — fifteen screens across the nine posts. Our own
screens are PNG captures at 390 × 844 (DPR 2). Both are then
downsampled to 200px wide and measured identically, with no background
drop anywhere, because there is no longer a background:

| metric | operational definition |
|---|---|
| **neutral** | share of pixels with OKLab chroma < 0.035 |
| **drawn structure** | share of pixels whose gradient to the next pixel right/down exceeds 0.08 in CIE L\* |
| **tonal range** | 95th − 5th percentile of CIE L\* |
| **concentration** | share of all chromatic pixels falling in the busiest 32 of a 10 × 16 grid |
| **counter-plane** | share of pixels on the far side of L 0.5 from the screen's own modal ground — dark area on a light screen, light area on a dark one |
| **ink coverage** | share of pixels more than 0.35 in OKLab L away from the ground, at 390px, for a reading surface |
| **event area** | share of pixels that depart from the ground at all: 0.25 away in OKLab L, or OKLab chroma ≥ 0.06. How much of the screen is doing something |
| **hue families** | accent hues present: chroma ≥ 0.08, binned at 30°, merged within ±45°, each covering ≥ 0.5% of the screen |

Re-running the old method reproduces the first pass's published figures
to within 4 points, so the difference below is the crop, not the maths.
The script is `docs/design/measure-screens.py`, committed beside this
file so the numbers can be re-run. It is not in `tools/` and not in
`npm run check`: it measures screenshots rather than the app, it needs
Pillow, and CI has no browser to produce the screenshots. Reference
crops are measured with `--inset=0.03` to keep the bezel out; our own
captures need no inset.

## 3 · The measurements

**The nineteen reference screens.** `event` is the share of the screen
that departs from its own ground at all — 0.25 away from it in OKLab L,
or chromatic; `hues` are the accent hue families it carries.

| screen | neutral | struct. | tonal | conc. | counter | ink | **event** | hues |
|---|---|---|---|---|---|---|---|---|
| 1 Traffic | 100.0% | 13.9% | 0.32 | 100% | 1.1% | 1.8% | 4.4% | — |
| 2 Flask | 23.1% | 21.3% | 0.79 | 26% | 29.4% | 29.1% | 88.8% | H240 |
| 3 Log | 30.2% | 7.8% | 0.86 | 29% | 68.3% | 77.8% | 78.2% | H0 |
| 4 Wallet | 69.5% | 6.4% | 0.48 | 64% | 1.3% | 10.7% | 17.5% | H120 |
| 5 Salesforce | 62.2% | 6.6% | 0.88 | 53% | 5.9% | 6.2% | 43.4% | **H300 H240 H0 H60** |
| 6a Books | 87.3% | 21.0% | 0.91 | 83% | **31.6%** | 36.9% | **45.0%** | H30 (+H240 0.7%) |
| 6b Overview | 85.6% | 11.0% | 0.91 | 82% | 8.7% | 11.2% | 23.3% | H30 |
| 6c Glossary | 97.1% | 14.2% | 0.32 | 89% | 1.2% | 3.9% | 7.1% | H60 |
| 7c **Reading** | 98.1% | **29.5%** | 0.91 | 100% | 12.0% | 17.4% | 21.7% | H30 |
| 8a Home | 81.6% | 20.1% | 0.76 | 81% | **40.0%** | 53.7% | **67.0%** | H60 |
| 8b **Reading** | 92.2% | **26.9%** | 0.49 | 100% | 10.7% | 7.1% | 14.4% | H60 |
| 8c Notes | 89.9% | 20.7% | 0.42 | 99% | 8.7% | 3.7% | 7.7% | H60 |
| 9a Today | 92.8% | 15.4% | 0.62 | 93% | 4.9% | 9.5% | 11.9% | H30 |
| 9b Stored | 94.2% | 8.8% | 0.39 | 99% | 0.7% | 1.9% | 7.4% | H30 |
| 9c Impact | 96.2% | 8.5% | 0.30 | 97% | 1.0% | 1.8% | 5.5% | H30 |
| 10 Wearable | 66.6% | 9.3% | 0.73 | 59% | 10.7% | 18.9% | **31.2%** | **H300 H90** |
| 11a Home | 71.7% | 8.9% | 0.48 | 69% | 2.4% | 14.7% | **30.3%** | H30 |
| 11b Hospital | 96.3% | 10.0% | 0.42 | 100% | 2.7% | 5.3% | 8.9% | H30 |
| 11c Map | 95.4% | 16.1% | 0.30 | 100% | 0.9% | 3.1% | 6.7% | H30 |
| **median** | **89.9%** | **13.9%** | **0.62** | **89%** | **5.9%** | **9.5%** | **17.5%** | **one** |

References 3 and 4 are photographed at a steep angle and their crops
keep a little hand and bezel; every other crop is screen only.

**Sixteen of ours**, v0.62 as shipped and the ui4 prototype, both
themes.

| screen | neutral | struct. | tonal | conc. | counter | ink | **event** | hues |
|---|---|---|---|---|---|---|---|---|
| v0.62 ana (light) | 88.7% | 11.5% | 0.55 | 89% | 0.7% | 8.2% | 9.9% | H30 |
| v0.62 ana (dark) | 89.4% | 12.5% | 0.69 | 89% | 8.4% | 8.4% | 10.7% | H60 |
| v0.62 Eğitim (light) | 88.9% | 12.4% | 0.55 | 95% | 0.7% | 8.2% | 9.9% | H30 |
| v0.62 Eğitim (dark) | 89.7% | 13.8% | 0.69 | 95% | 8.0% | 8.5% | 10.7% | H60 |
| v0.62 ders (light) | 98.1% | 17.3% | 0.44 | 100% | 2.2% | 5.1% | 6.8% | — |
| v0.62 ders (dark) | 98.0% | 18.3% | 0.52 | 98% | 5.2% | 5.7% | 8.0% | — |
| v0.62 cevap (light) | 93.1% | 18.7% | 0.51 | 99% | 0.1% | 8.8% | 10.2% | H30 |
| v0.62 cevap (dark) | 92.8% | 25.8% | 0.69 | 91% | 12.7% | 12.5% | 15.3% | H60 |
| v0.62 sonuç (dark) | 95.6% | 9.9% | 0.59 | 99% | 5.8% | 6.3% | 7.5% | H60 |
| v0.62 Profil (dark) | 94.6% | 10.4% | 0.36 | 100% | 3.1% | 3.2% | 5.2% | H60 |
| ui4 Bugün (light) | 93.0% | 12.2% | 0.51 | 91% | 0.7% | 8.5% | 9.7% | H30 |
| ui4 Bugün (dark) | 92.8% | 13.4% | 0.72 | 86% | 8.3% | 9.5% | 10.9% | H60 |
| ui4 cevap (dark) | 91.5% | 19.2% | 0.72 | 76% | 9.1% | 10.8% | 12.8% | H60 |
| ui4 ders (light) | 98.0% | 17.0% | 0.38 | 55% | 1.3% | 4.9% | 6.5% | — |
| ui4 ders (dark) | 97.4% | 18.4% | 0.48 | 53% | 4.6% | 6.0% | 8.1% | — |
| ui4 Öğren (dark) | 98.4% | 12.3% | 0.30 | 64% | 2.1% | 3.6% | 5.1% | — |
| **median** | **93.1%** | **13.6%** | **0.54** | **91%** | **3.9%** | **8.2%** | **9.8%** | **one** |

## 4 · The first finding is that four of the five metrics say nothing

| | references | ours | gap |
|---|---|---|---|
| neutral | 89.9% | 93.1% | 3 points |
| drawn structure | 13.9% | 13.6% | 0.3 points |
| tonal range | 0.62 | 0.54 | 0.08 |
| concentration | 89% | 91% | none |

Measured on the screens rather than on the posts, **we sit inside the
reference set on every axis the first pass used.** We are not
measurably less colourful, less structured, flatter or less
concentrated than screens the owner calls modern, alive and clean — and
he has rejected five of ours in a row.

This is worth more than a correction. It says the thing he keeps naming
is not an average property of the screen, which is why five rounds of
adjusting average properties — more tint, less tint, a wash, a
gradient, a glow, then subtract the glow — could not reach it. The
difference is where the values *sit*, not what they average to. The
fifth column is the exception, and it is the loudest number in the
file: **event area, 17.5% against our 9.8%**, and on the screen that
opens the app 30–67% against our 10 — §10.

The sections from here to §12 are the places the values sit
differently: five findings, then the shape language, then how an
element is built. Each is measurable and each is checkable after the
fact.

## 5 · F1 · Every reference has one large area that is not its ground

A reference screen puts a large area somewhere other than its own
ground — and in the whole set there are only two ways it is done: the
area is **dark** (or light, on a dark screen), or it is **saturated**.
Nine of the eleven references take the first route:

- a **near-black card covering 32% of a white book app** (6a) — the
  hero with the cover, the title and the orange button;
- a **white stats card covering 40% of a dark reading app** (8a);
- 29.4% and 68.3% in the two Hydroflask screens;
- 12.0% and 10.7% on the two reading pages themselves.

The median reference screen is 5.9%; its home or index screen is 30–40%.

The other route is reference 11's, and it matters because 11 is the
lightest, quietest product in the set: its home screen's counter-plane
is only 2.4%, but a **16% orange hero** does the same work, and the one
black pill inside it does the rest. Reference 9 is the same shape at a
smaller scale. So the rule is not "put a black card on it" — it is
**a large area that is not the ground**, by lightness or by colour, and
a light product may choose either.

Ours, light theme, chooses neither. Counter-plane on every screen
without exception: **0.1% · 0.7% · 0.7% · 0.7% · 1.3% · 2.2%**, and the
accent area that might have stood in for it is 4.6–5.4%, spread over
chrome rather than gathered into one object. There is no dark plane and
no colour plane anywhere in our light theme. The screen is cream, the
cards are a slightly lighter cream, the type is ink, and nothing else
happens. That is a document, and the word
for a document that was supposed to be a product is *flat* — which is
the word he has used, in one form or another, about every round.

Our dark theme measures 2.1–12.7%, median 7%, which is *inside* the
reference band. The light theme is the one that is one-sided. Worth
recording because he said so himself, months ago and in different words
— *"beyaz mod rezil"* — and we changed its tint to cream and never
changed its composition.

And it explains the shadow problem without appealing to taste. UI 3
added depth as a shadow token between two planes 0.03–0.05 apart at the
same end of the range. Reference 9 uses a card-to-ground separation of
**0.054** — the same as ours — and reads as a card, because it is a
white card at L 0.985 on a cream ground at L 0.943 *and the screen also
contains ink*. Depth is not the distance between two planes. It is the
distance the screen as a whole travels.

## 6 · F2 · Our accent was solved for the wrong job

The reference orange, sampled from the book app and the solar
dashboard, is the same colour twice: [S]

| | L | C | H |
|---|---|---|---|
| reference orange (6, 7, 9) | 0.65–0.67 | 0.19–0.22 | 36–40 |
| our `--c-accent`, light | **0.534** | **0.125** | 60 |
| our `--c-accent-2`, light | 0.531 | 0.160 | 42 |
| our `--c-accent`, dark | 0.800 | 0.125 | 70 |

Ours is 0.13 darker and carries 40% less chroma. Not a matter of
preference — a consequence:

**Their accent is a fill. Ours is a text colour that is also used as a
fill.** `--c-accent: #a05801` has to clear the `PAIRS` table as
*coloured text on cream*, which is a WCAG 2 requirement of 4.5:1 and
forces L down; chroma then falls out of the gamut at that lightness.
The reference orange as text on white is 3.49:1 — it would fail our own
table, and it never appears as body text in any of the three apps. It
appears as a button fill with white on it, as a 2px rule, as a chapter
heading at display size, and as a count at the end of a line.

So the vividness he is pointing at is not a bolder choice. It is a
**split token**: a fill accent that never has to be legible as small
text, and an ink accent that does. We have one token doing both jobs
and the text job wins, everywhere, including where nothing is being
read.

Two more colour facts, both [S]:

- Their dark ground is **warm**: #33322e, H 95. Ours is #181d23, H 253
  — blue slate. The dark app he singled out as *"bize oldukça uygun"*
  is warm-neutral, and ours is the one cool surface in the whole
  reference set.
- Their reading surfaces still carry **1.0–1.4% saturated colour** —
  an orange chapter heading, an orange occurrence count, a yellow
  highlight. Ours carries **0.1%.** Ten times less, on the screen where
  the learner spends most of their time. "Academic but alive" has a
  number, and the number is about one per cent.

## 7 · F3 · Their reading page carries three times our ink

Measured on the reading surfaces at 390px:

| | ground | ink coverage |
|---|---|---|
| 7c reading (book app, light) | L 1.00 | **17.4%** |
| 6c glossary (light) | L 1.00 | 3.9% |
| 8b reading (Midnight, dark) | L 0.32 | 7.1% |
| our ders v0.62 (light) | L 0.96 | **5.1%** |
| our ders ui4 (light) | L 0.96 | 4.9% |
| our ders v0.62 (dark) | L 0.18 | 5.7% |
| our cevap v0.62 (dark) | L 0.26 | 12.5% |

The light reading page is the gap: less than a third of their ink. On a
dark ground the numbers are comparable (5.7 vs 7.1), because a dark
ground carries less ink by construction.

It is not tighter setting — the opposite. Their body sets a baseline
step of **1.73×** the ink band height; ours sets **1.31×** [≈,
row-profile measurement on both]. Their lines are further apart than
ours. They fit more text on the page by using a longer measure, a
smaller margin and more lines, not by crowding. Our reader spends its
page budget on space around a smaller amount of text, which is why it
reads as a slide rather than as a page.

## 8 · F4 · In a reading app the type ratio is 3:1, not 5:1, and the contrast is by class

The first version of this file took a ratio of about 5:1 from the
dashboards, with the large end set light, and proposed it as a target.
The reading references do not do this [≈, ink-band heights from the
row profile of 7c]:

| | ink band |
|---|---|
| chapter heading (serif italic, accent) | 29 |
| body | 15 |
| page number | 10 |

Roughly **2.9:1**, and the heading is not large-and-light. It is a
*different class of type*: a serif, italic, in the accent colour,
against a sans body. The book app does the same on its index — serif
italic for the title of a work, sans for the author. MidnightReads
inverts it: sans bold headings over a serif body.

We ship both families already — Source Serif 4 and Source Sans 3, both
subset and self-hosted — and use the serif for almost nothing. The
differentiating device the reading references rely on is sitting
unused in `fonts/`, and it costs nothing, while the 5:1 ratio the
dashboards suggested would have meant a new top and a new bottom to the
type scale and a fight with the 15px floor that
`docs/research/ui-improve.md` measured into existence.

The dashboards' device is still real, and reference 9 shows it working
on a cream ground: a very large figure in a light weight, a tiny
tracked caption, and 1–5% of the screen in saturated orange. It belongs
to *number* screens — a session summary, an accuracy figure — and not
to a lesson. That is a direction to try in step 5, not a scale change
to adopt now.

## 9 · Where the v0.62 error is exactly located

Unchanged by the re-measurement, and now better supported.

In every reference, saturated colour and gradient appear **on content
objects** — a data tile, a product hero, a book cover, a chapter
heading, a button that does the screen's one job. In none of them does
it appear on the navigation chrome, and in none of them is it applied
to every button.

v0.62 put the gradient and the glow on the chrome and on every primary
action and left the content grey. The instinct was not wrong; the
surface it was applied to was. The glass the owner praises in reference
8 is the same point again: it is on the **cards**, over a warm blurred
field, and the tab bar underneath it is plain.

## 10 · F5 · They modulate. We are the same loudness on every screen

The `event` column is the simplest number in this file: how much of the
screen is doing anything at all. Sorted by what kind of screen it is:

| | references | ours |
|---|---|---|
| the screen that opens the app | 30.3 · 31.2 · 45.0 · 67.0 | 9.7 · 9.9 · 10.7 · 10.9 |
| a reading or detail screen | 5.5 · 6.7 · 7.1 · 7.4 · 7.7 · 8.9 · 14.4 · 21.7 | 5.1 · 6.5 · 6.8 · 8.0 · 8.1 |
| loud ÷ quiet, within one product | **4× to 8×** | **1.5×** |

On the quiet screens we are indistinguishable from the references. On
the screen that opens the app we are at a third of them. And the span
between our own loudest and quietest screen is 1.5× where theirs is
four to eight.

This is the finding that explains the *first two seconds*, which is
where every verdict in this project has been formed. "AI slop", "flat",
"lifeless" are judgements about an entrance. Our entrance is built to
the same recipe as our reading page — same plane, same one accent at
the same 5%, same card, same list — because the design system gave
every screen one grammar and I applied it at one volume.

Reference 11 is the cleanest demonstration because it is a *light*
product with a modest palette, not a neon dashboard: its home screen is
30.3% event with a 16% orange hero, and the hospital screen two taps
later is 8.9% with 1.0% orange. Same app, same tokens, same components.
Loud where you arrive, quiet where you read.

Nothing in our non-negotiables prevents this. It is a decision we never
made.

## 11 · Form: the shape language, measured

The owner asked specifically about the studio's *şekilsel form*. It is
measurable, and it is the largest single difference in how the
references feel as objects.

**Corner radius is proportional to the object, and the proportion says
what kind of object it is.** Radius over the object's own width [S]:

| object | r / width |
|---|---|
| 10 · a control tile (Strain, Sync) | **0.171** |
| 10 · the one yellow action | 0.153 |
| 11 · a content card | 0.099 |
| 6 · the Library sheet | 0.055 |
| **ours** · `--r-3` on a 358px card | **0.056** |
| **ours** · `--r-4` on the 358px hero | 0.078 |

Two families, not one. **Content** objects — a card holding a
paragraph, a sheet holding a list — sit at 0.055–0.10. **Control**
objects — a tile that *is* a switch, a slider, a gauge — sit at
0.15–0.17, and that ratio is most of what makes reference 10 read as a
device rather than as a page. We have only the content family, at the
bottom of its range, and we use it for controls too.

**The corners look like superellipses rather than circular arcs** [≈].
Marked as an estimate on purpose: the exponent was not fitted, because
reference 10 is photographed at an angle and a perspective-distorted
corner cannot be fitted honestly. What is visible at r/w 0.17 is that
the corner meets the straight edge without the kink a circular arc
leaves, which is what makes the tile read as one form rather than as a
rectangle with rounded corners.

Whether we can have that is an open question, not a known limitation.
CSS gained `corner-shape` for exactly this, and it shipped in Chromium
and Safari during 2025 — but this app is served to whatever browser a
student has, it has no build step and no polyfill, and `border-radius`
is the fallback in any case. **Step 3 verifies support and writes down
what the fallback looks like; it does not assume either way.** The
ratio we can have unconditionally.

**Everything is one of four silhouettes.** Across all eleven
references: the rounded rect (content), the large-radius squircle
(control), the pill (choice, chip, action), and the circle (icon
button, avatar, map pin, gauge). There is no fifth. Nothing has a
square corner; nothing has a mixed radius; nothing is a bare outlined
box. Our inventory is the same four, which is worth recording as a
place where UI 2's discipline was right.

**Outlines are nearly absent, and dividers are not.** In eleven
references almost nothing is a container with a 1px line around it.
Separation is done by plane lightness plus a soft shadow; a rule appears
only as a **divider between rows inside one container** — 6c's glossary
entries, 11's service list, 8c's note stack.

We do the opposite. `css/style.css` puts
`inset 0 0 0 1px var(--line)` on eight component classes, the card
among them [S], so every card, tile, option and panel carries a full
outline in both themes — and our lists mostly separate their rows by
gap instead. An outline around a container plus no line between its rows
is precisely the arrangement that reads as a form, and it is the
mechanical half of what "kutu kutu" named.

## 12 · Elements: how a thing is built, and where the colour sits

**The tile is the control, not a card containing one.** Reference 10 is
the clearest statement of this. Each tile carries a quiet label in its
top-left and then *is* the thing: "Assist Limit" is a value and a slider
filling the tile; "Strain" is a gauge; "Sync" is a toggle. Nothing is a
card with a widget inside it, and nothing is a row with a control parked
on the right. The object's whole area is the affordance.

Ours is the opposite almost everywhere: a card, a heading inside it, a
row inside that, a control at the end of the row. Three frames to reach
one interaction. `docs/design-system.md` already forbids "nothing framed
inside a framed thing"; the references show what obeying it produces.

**One filled action per screen — and it does not have to be the
accent.** In reference 11 the filled action is a **near-black pill**
("View Premium", "Direction") on a white screen, while the orange is
spent on the hero and on two small tags. In reference 10 the filled
action is the yellow. Both screens have exactly one. We currently give a
gradient and a glow to every primary action on every screen, which
means none of them is *the* action, and it also means the accent can
never be used anywhere else without competing with a button.

The near-black pill is worth noticing twice: it is the counter-plane of
§5 and the one action at the same time. One object, two jobs, no new
colour.

**Gradient is a light source inside an object, never a ramp across a
button.** Reference 10's two chromatic tiles are lit from one corner —
bright magenta at the top-left falling to a deep violet at the
bottom-right, the violet tile the same in reverse. Reference 11's hero
is a warm diagonal with one bright lobe. Reference 8's glass cards glow
from within. In none of them does a gradient run linearly across a
100%-wide button, which is precisely what `--grad-accent` does in
v0.62, on every filled control, identically.

This is not a new idea in this project. `docs/design-system.md` already
says *depth is a lighter plane*. UI 3 implemented the sentence on the
wrong objects.

**Colour distribution: one hue family, area set by the screen's job.**
Of nineteen reference screens, **fifteen carry exactly one accent hue
family** and one (reference 1) carries none at all. Two carry two:
reference 6a, whose second is a book cover rather than a design
decision, and reference 10, whose two are 170° apart — a magenta/violet
gradient for state and a yellow for the one action, the maximum
separation two hues can buy. Only reference 5, a four-tile data
dashboard, carries four, and it is the one screen in the set whose
colour *is* the content.

Our screens also carry one family — but for the wrong reason. v0.62's
per-topic hue generates ten hues by hashing the topic id, and the
Eğitim screen measures **H40–H70: ten hues inside 30°** [S]. They do not
read as ten colours; they read as one smudged orange. That is
`docs/research/visual-longevity.md` §0's arithmetic — 148 usable
degrees ÷ 10 topics — measured on the shipped screen rather than
predicted. The feature costs a hue system and delivers a single
indistinct tint.

Area, by the screen's job [S]:

| | reference | ours |
|---|---|---|
| entrance | 15.7% (11a) · 13.2 + 4.8% (10) · 5.2% (8a) · 5.0% (6a) | 4.6–5.4% |
| reading / detail | 1.0–1.3% | **0.1–0.2%** |

**Drain the field so the one accent reads.** Reference 11c is a
full-screen map in grey — no green parks, no blue water — so that a
single orange dot is the only colour on the screen. The technique
generalises: when a large area must be present but is not the point,
take its colour away.

We already do the first half of this without having named it: the cloze
blank is a 2px rule in `var(--accent)` [S, `css/style.css`], and on the
question screen it is almost the only saturated thing — the 0.1–0.2%
in the table. What is missing is not the accent, it is the field: the
198-character paragraph around the blank is set in full ink at the same
size, so the accent has nothing quiet to be loud against. Whether a
reading field *can* be drained without hurting the reading is a real
question and not a free move; §15 asks it rather than assuming it.

**Texture, at a cost of nothing.** Reference 10 has a dot grid on the
display ground, a halftone in the yellow action and dot-matrix numerals
for values; reference 6c has a yellow highlighter mark behind a glossary
word. These are low-contrast patterns that survive both themes, add no
palette row, and are the cheapest "this was made by someone" signal in
the set. We have none, anywhere.

**Organisation.** Ten of eleven references are a single scrolling column
of sections — head plus one container — with a bottom nav; only
reference 10 is a bento grid, and it is a watch-sized control surface
with no scrolling and no prose. Our section grammar is already the
majority pattern, so the organisation is not what is wrong. What differs
is inside a section: their containers are **fewer and larger**, and a
section is usually one object, where ours is often a head plus a list of
five rows of three elements each.

## 13 · What transfers, and what does not

**Transfers, with a number attached.**

- One large area that is not the ground: **≥ 10%** of a screen, **≥ 25%**
  on the screen the app opens on — either on the far side of L 0.5 (a
  near-black card on the light theme) or saturated (reference 11's 16%
  hero). Either route, but not neither, which is what we have now.
- A split accent: a **fill** accent near L 0.66 / C 0.20, used only
  where nothing small is read on it and verified by APCA at ≥ 18px/600;
  an **ink** accent that keeps the current WCAG 2 guarantee.
- **1–2% saturated colour on a reading surface**, never 0.1% and never
  a wash.
- Ink coverage near **12–17%** on the light reading page, reached by
  measure and margin, not by tightening the leading — which should go
  the other way, toward 1.5–1.7× the ink band.
- Type contrast by **class** — serif italic in the accent for the
  thing being taught, sans for everything else — rather than by a wider
  size ratio.
- A warm dark ground (H ≈ 60–95) instead of the blue slate.
- Ornament that is information: the week, the ten answers of a session,
  a category's accuracy, a contrast drawn as a diagram. We hold all of
  this data and render none of it.
- **A loudness range across the product**: the entrance at 30% event
  area, the reading page at 7%, a span of at least 4× within the same
  tokens and the same components.
- **Two radius families**: content at r/w ≈ 0.08–0.10, controls at
  r/w ≈ 0.15–0.17. Our single 0.056 covers neither end well.
- **One filled action per screen**, and on the light theme let it be the
  near-black pill — counter-plane and call to action in one object.
- **The tile is the control.** No card wrapping a row wrapping a
  control. This is `design-system.md`'s own rule, unenforced.
- **Gradient as a light source inside an object**, lit from one corner,
  on content — not a ramp across every button.
- **Low-contrast texture**: a dot grid, a halftone, a highlighter mark.
  No palette row, no dependency, both themes.
- **Drain a large area that is not the point** so the one accent reads.
- Hairline dividers *inside* one container instead of an outline
  *around* every container.

**Does not transfer, and saying so now is cheaper than finding out in
round six.**

- Telemetry density. Reference 1 works because 200 numbers *are* the
  content. Ours is prose.
- Product renders and book covers. Reference 6's 32% counter-plane is
  mostly a photographed cover. We have no object to photograph, so our
  counter-plane has to be drawn, which is a constraint on how it is
  built, not a reason to skip it.
- Type at 10 and 11px. `docs/research/ui-improve.md` measured that
  exact failure in this app and it is why the floor is 15.
- A full-bleed gradient behind body text. Reference 3 puts display type
  on a gradient, not a 377-character paragraph; every pair in
  `tools/palette.mjs` would fail.
- The bento grid of reference 10. It is a watch-sized control surface
  with no scrolling and no prose; our shell is a fixed-height column
  that must work at 320px with a Turkish paragraph in it. The *tile
  proportions* and the *radius family* transfer; the grid does not.
- A streak counter, even though both reference 6 and reference 8 show
  one. `docs/research/visual-longevity.md` §6 refuses it with reasons,
  v0.62 shipped it against that refusal, and a reference set is taste
  input, not a licence to re-open a decision that was made on evidence.

## 14 · Liquid Glass — recorded as a condition, not a refusal

The owner: *"verdiğimiz örneklerden birisi Apple'ın yerleşik liquid
glass'ını kullanıyor olabilir, doğrudan bir problem değil, kullanmak
zorunda değiliz ya da özel Apple port'u yaptığımız zaman dahil
ederiz."*

Recorded as decided: **we do not adopt Liquid Glass as a system.** It
is a platform material with a platform implementation; this app is a
static web page with no build step and no dependencies, served to
Android and iOS browsers alike, and a hand-rolled imitation of it is
the exact move — re-skinning a borrowed surface treatment — that
produced the last two rejections.

What we take from reference 8 instead is what is measurable in it and
reproducible in CSS: a **warm** dark ground, a *lit* card with its own
lightness rather than a shadow, an accent used as a fill on the one
button that matters, and glass on **content cards** rather than on
chrome. If an Apple-specific port is ever built, `backdrop-filter`
already carries most of it and the question reopens then.

## 15 · What step 3 has to answer

Step 2 is finished; these are its handover questions, and
`03-research.md` is where they get the `beta1-palette.md` treatment —
a recommendation, and a list of what could not be verified.

1. **The split accent.** Solve a fill accent at H ≈ 40 for both themes:
   maximum chroma that keeps its own label (18px/600, white or ink on
   it) above the APCA floor, in gamut, in both themes, added to `PAIRS`
   as a new row class. Does the existing ink accent survive unchanged
   beside it, or does the pair need re-solving together?
2. **The counter-plane, in the light theme.** Which object carries it,
   given that we have no cover art — the day's session, the question
   itself, the topic mark? What does it do to `surface-0/1/2`, and what
   does an APCA sweep say about text on it?
3. **The warm dark ground.** Moving H 253 → H ≈ 70 re-solves every
   dark token. Is the cost one palette run or a cascade?
4. **The serif, finally used.** Which role: the English sentence being
   taught, the lesson title, the contrast pair? One role only, decided
   with a reason, since `visual-longevity.md` §5 ranks lesson shape
   first and we have still not touched it.
5. **Ink on the reading page.** What measure, margin and leading take
   the light lesson from 5% to 12–17% at 320px without breaking the
   fixed-height shell — and, separately, whether the question's
   paragraph can be quieted so the blank reads as the one live thing,
   without costing the learner the reading. That one is a measurement
   against `PAIRS`, not a preference.
6. **The one thing that is not a colour question.** Every reference
   spends its visual budget on rendering data. Ours is available and
   unrendered. `visual-longevity.md` §5 ranked this second, six weeks
   ago, and four rounds walked past it.
7. **The loudness range.** Which screen is the entrance, what carries
   its 30%, and what the sweep should assert so that the range cannot
   quietly flatten again in a later round — an `event`-area floor on
   the entrance and a ceiling on the reader are both checkable by
   `measure-screens.py`.
8. **The per-topic hue, decided rather than inherited.** §12 measures
   it collapsing into 30°. Either it goes — and the topic mark of
   `visual-longevity.md` §5.5 carries identity instead — or it becomes
   the per-**tier** accent that file already solved at 35° separation.
   It cannot stay as it is.
9. **The two radius families**, and whether the control family is worth
   having without a continuous corner — which means first checking
   whether `corner-shape` is actually available to our audience, and
   what the `border-radius` fallback costs if it is not.
10. **The outline-to-divider inversion.** Removing
    `inset 0 0 0 1px var(--line)` from eight component classes and
    putting a hairline *between rows* instead is a small diff and a
    large change of character. It needs the `PAIRS` treatment for the
    divider and a `verify` pass, not an opinion.
11. **"The tile is the control."** Which of our objects can absorb its
    own frame — the answer option, the topic entry, the day's session —
    and what that does to the touch target, the focus ring and the
    screen-reader name. This is a component question, so it lands in
    `docs/components.html` and the sweep.
12. **Texture.** One low-contrast pattern, defined as a token, legible
    in both themes, measured so it never approaches the text-contrast
    floor. Cheapest item on this list and the only one with no
    dependency at all.
