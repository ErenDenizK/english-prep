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

Batch 1 contains no paragraph at all. Batch 2 contains three genuine
reading surfaces (7's chapter page, 8's article page, 6's glossary
entries), which is why it was asked for: our core screen is a
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

Re-running the old method reproduces the first pass's published figures
to within 4 points, so the difference below is the crop, not the maths.
The script is `docs/design/measure-screens.py`, committed beside this
file so the numbers can be re-run. It is not in `tools/` and not in
`npm run check`: it measures screenshots rather than the app, it needs
Pillow, and CI has no browser to produce the screenshots. Reference
crops are measured with `--inset=0.03` to keep the bezel out; our own
captures need no inset.

## 3 · The measurements

**The fifteen reference screens.**

| screen | neutral | structure | tonal | conc. | counter-plane |
|---|---|---|---|---|---|
| v0.62 ana (light) | 88.7% | 11.5% | 0.55 | 89% | 0.7% |
| v0.62 ana (dark) | 89.4% | 12.5% | 0.69 | 89% | 8.4% |
| v0.62 Eğitim (light) | 88.9% | 12.4% | 0.55 | 95% | 0.7% |
| v0.62 Eğitim (dark) | 89.7% | 13.8% | 0.69 | 95% | 8.0% |
| v0.62 ders (light) | 98.1% | 17.3% | 0.44 | 100% | 2.2% |
| v0.62 ders (dark) | 98.0% | 18.3% | 0.52 | 98% | 5.2% |
| v0.62 cevap (light) | 93.1% | 18.7% | 0.51 | 99% | 0.1% |
| v0.62 cevap (dark) | 92.8% | 25.8% | 0.69 | 91% | 12.7% |
| v0.62 sonuç (dark) | 95.6% | 9.9% | 0.59 | 99% | 5.8% |
| v0.62 Profil (dark) | 94.6% | 10.4% | 0.36 | 100% | 3.1% |
| ui4 Bugün (light) | 93.0% | 12.2% | 0.51 | 91% | 0.7% |
| ui4 Bugün (dark) | 92.8% | 13.4% | 0.72 | 86% | 8.3% |
| ui4 cevap (dark) | 91.5% | 19.2% | 0.72 | 76% | 9.1% |
| ui4 ders (light) | 98.0% | 17.0% | 0.38 | 55% | 1.3% |
| ui4 ders (dark) | 97.4% | 18.4% | 0.48 | 53% | 4.6% |
| ui4 Öğren (dark) | 98.4% | 12.3% | 0.30 | 64% | 2.1% |
| **median** | **93.1%** | **13.6%** | **0.54** | **91%** | **3.9%** |

## 4 · The first finding is that four of our metrics say nothing

| | references | ours | gap |
|---|---|---|---|
| neutral | 89.9% | 93.1% | 3 points |
| drawn structure | 14.2% | 13.6% | 0.6 points |
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
next four sections are the four places they sit differently, each one
measurable and each one checkable after the fact.

## 5 · F1 · Every reference screen has a counter-plane. Our light theme never does

A reference screen puts a large area on the far side of the lightness
range from its own ground:

- a **near-black card covering 32% of a white book app** (6a) — the
  hero with the cover, the title and the orange button;
- a **white stats card covering 40% of a dark reading app** (8a);
- 29.4% and 68.3% in the two Hydroflask screens;
- 12.0% and 10.7% on the two reading pages themselves.

The median reference screen is 8.7%; its home or index screen is 30–40%.

Ours, light theme, every screen without exception: **0.1% · 0.7% · 0.7%
· 0.7% · 1.3% · 2.2%.** There is no dark plane anywhere in our light
theme. The screen is cream, the cards are a slightly lighter cream, the
type is ink, and nothing else happens. That is a document, and the word
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

## 10 · What transfers, and what does not

**Transfers, with a number attached.**

- A counter-plane: **≥ 10%** of a screen on the far side of L 0.5 from
  its ground, and **≥ 25%** on an index or home screen. Light theme
  first, where we currently have none.
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
- A streak counter, even though both reference 6 and reference 8 show
  one. `docs/research/visual-longevity.md` §6 refuses it with reasons,
  v0.62 shipped it against that refusal, and a reference set is taste
  input, not a licence to re-open a decision that was made on evidence.

## 11 · Liquid Glass — recorded as a condition, not a refusal

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

## 12 · What step 3 has to answer

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
   fixed-height shell.
6. **The one thing that is not a colour question.** Every reference
   spends its visual budget on rendering data. Ours is available and
   unrendered. `visual-longevity.md` §5 ranked this second, six weeks
   ago, and four rounds walked past it.
