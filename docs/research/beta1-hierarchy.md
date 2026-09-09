# Between minimalism and shallowness: the hierarchy arm for beta1

2026-09-09. Design-research arm. The owner's report after v0.41–0.43,
in substance: reading is still not fully improved; the design is
*"minimalizm ve sığ olmak arasında kaldı"* — stuck between minimalism
and shallowness. He asked for readability and the lesson flows to be
evaluated, and for the design to be rethought professionally rather
than patched, keeping the concepts that are right.

This document is everything about that which is **not colour**. A
sibling arm is designing the palette; the monochromatic hue (67–85°
OKLCH, so hierarchy has only lightness to work with) is taken here as
an input, not a finding. Everything below was looked at, not inferred
from the stylesheet: 91 screenshots at 320×568 and 390×844 in both
themes, plus 1280×900 for the split, in
`scratchpad/hier/` (the filenames cited are there), with a text census
of every visible character on each screen (`census.json`).

Marks: **[S]** measured or sourced · **[≈]** an inference from
measurement, or a figure from memory that should be checked ·
**[?]** contested or unverified.

---

## 0 · The short version

**"Shallow" has a measurable cause, and it is not the greys.** After
the v0.41–0.42 fix every small tier — meta, label, row subtitle, row
trail, nav, stat label, chip, quiet button, and now `<em>` — is set in
exactly one style: **15px / 600 / `--c-text-2`**. That single style is
**83% of the characters on the Eğitim index, 81% of the results
screen and 98% of Profil** at 320px [S]. The fix for contrast made
every secondary thing identical to every other secondary thing, and
bolder than the body text it is supposed to sit under. That is the
coordinator's first-hand finding, and the census confirms it on every
screen.

**Four causes, ranked.** (1) One quiet style doing every job, with the
weight axis pointing backwards — quiet text heavier than reading text.
(2) No large type where a learner normally looks: the index's largest
text is 22px on 2.3% of its characters, and every heading is a 15px
tracked grey *label*, so a screen's h1 is its smallest, dimmest line.
(3) A middle of the scale with no steps — 19 / 17 / 16 / 15 — where
nearly all the reading lives. (4) Surfaces 0.05 L apart on dark and
0.03 on light (WCAG 1.12 / 1.09): one card level reads as none.
Uniform block shapes and gaps in the reader are real but downstream;
right-anchoring, numerals and ornament are minor.

**The proposal**: a five-step scale with real steps — **15 · 18 · 22 ·
28 · 36** — two weights that point *up* (400 reads, 600 heads; 700
deleted, since it renders as the 600 face anyway, measured),
`--c-text-2` at exactly two pairs, a 2:1 above/below rule for headings
with a 64px section step, and a reader in which the contrast is the one
raised band and every other block is a shape without its label. The
design-system sections to amend, and the refusals, are in §6.

---

## 1 · What "shallow" is, visually

The brief listed eleven candidate causes. Each was tested against the
screens rather than assumed. The table is the summary; the argument
for each follows.

| # | Candidate | Index | Konu | Reader | Test | Quiz | Results | Profil | Contribution |
|---|---|---|---|---|---|---|---|---|---|
| 1 | One quiet style for every secondary job, bolder than body | ●●● | ●● | ●● | ●● | ● | ●●● | ●●● | **first** |
| 2 | Headings that are labels; no display type | ●●● | ●● | ● | ●● | ● | ●● | ●●● | **second** |
| 3 | Middle of the scale with no steps | ● | ●● | ●●● | ● | ●● | ●● | ○ | **third** |
| 4 | Surfaces too close: "one card" reads as none | ●● | ○ | ● | ●● | ○ | ○ | ●● | fourth, light theme worst |
| 5 | Every block the same shape | ○ | ●● | ●●● | ○ | ○ | ● | ○ | reader only, real |
| 6 | Uniform spacing rhythm | ○ | ● | ●● | ● | ○ | ● | ● | real, downstream |
| 7 | Weight nearly binary | ● | ● | ● | ● | ● | ● | ● | true; the *direction* is the fault |
| 8 | Nothing anchored right | ○ | ○ | ● | ○ | ○ | ○ | ○ | minor |
| 9 | No rules, numerals, ornament | ○ | ○ | ● | ○ | ○ | ○ | ● | minor |
| 10 | No chromatic depth | — | — | — | — | — | — | — | given; sibling arm |

### 1.1 One style for everything secondary — and it is the bold one

The census, at 320px, dark theme (light is identical in size and
weight) [S]:

| Screen | characters | share at 15px/600/text-2 | largest size on screen | share at that size |
|---|---|---|---|---|
| Eğitim index | 1,316 | **83.1%** | 22px serif | 2.3% |
| Konu (topic overview) | 2,101 | 27.7% | 22px/600 | 0.6% |
| Lesson reader | 3,192 | 22.7% | 28px serif | 0.9% |
| Test tab | 990 | 39.5% | 22px/600 | 2.6% |
| Results | 2,853 | **80.8%** | 28px/600 | 0.2% |
| Profil | 3,125 | **98.1%** | 22px/600 | 0.3% |

Look at `profil-390-dark.png`: the name-card hint, the stat labels,
the paragraph about where data lives, the section labels *İsmin* /
*Genel durum* / *Verilerin* / *Görünüm* — all one style. The only
things not in it are four numerals. The screen is not minimal; it is
*undifferentiated*, which is what "shallow" looks like when you can
name it. `results-seg1-320-dark.png` is worse in kind: a seven-line
explanation of a wrong answer set in bold grey meta, followed by
*Kural:* in the same style. That is the text the learner came to the
results screen to read, and it is rendered as a caption.

The mechanism is the coordinator's finding: v0.41 moved every sub-16
tier to 15/600 because APCA's matrix leaves nothing else legal below
18px on this ground [S — `requiredLc`: 15/400 needs Lc 100, 16/400
90, 17/400 83, 18/400 75; `--c-text-2` measures 75 on `surface-2`].
The pairs check measures one pair at a time and cannot see the set
collapse to one member.

And the weight now points the wrong way. Body is 16/400; everything
*under* it — subtitle, caption, counter — is 600. On
`index-390-dark.png` the gloss under "Tenses" is bolder than "Tenses";
on `lesson-seg1-320-dark.png` the pretest's rationale is a bold grey
paragraph heavier than the lesson's opening paragraph below it. In
every system in §5 emphasis is heavier than reading and nothing quiet
is. Here the quietest text is the heaviest, and an eye that treats
bold as a preattentive "look here" [S, ui-improve §1.3] is told to
look at the captions.

### 1.2 Every heading is a label

The h1 of the results screen is *Sonuç*, 15px, tracked, grey. The h1
of the topic overview is *Genel bakış* over a 22px *Tense nedir?*. The
h2s of the index are *Temeller* and *Temel Dilbilgisi*. The reader's
section heads are *Aradaki fark*, *Kontrol*, *Kontrol* again, *Ders
bitti*. All `.t-label`, all 15/600/text-2 with 0.09em tracking — the
same style as a row subtitle and a chip. On `index-390-light.png` the
line *Her konu, önce ne olduğunu anlatır; dersler içinde* (a meta
sentence) and the heading *Temeller* two lines under it are visually
one thing.

A tracked small label is a legitimate device — the *kicker* above a
headline — but it works by contrast with something large beside it.
Here it *is* the heading. At 320px the largest type on the index, the
Test tab and Profil is 22px, on under 3% of the characters; the one
display size, 28, appears on the lesson title
(`lesson-open-320-dark.png`, the best-looking header in the app) and
on the results score, where "1 / 3" at 28px is the smallest display
numeral on any results screen I know (`results-390-dark.png`).

### 1.3 The middle of the scale has no steps

Measured in `docs/audit/type-contrast.md` §1b and unchanged: 19 / 17 /
16 / 15 span ×1.27 with two consecutive ratios of ~1.06, and in the
reader 80% of the characters live there [S]. On
`lesson-contrast-390-dark.png` the side label *Past Simple* (19 serif),
its example (16 serif) and the gloss between (16 sans) are three tiers
of meaning in a 1.19× range, the gloss the same size as the example.
Contrast labels, example sentences and decision outcomes all share
the identical 19px serif: the style says "English, biggish" and nothing
about *which kind*.

### 1.4 The card that is not a card

OKLCH lightness of the surfaces, computed from the shipped hexes [S]:

| | surface-0 | surface-1 | surface-2 | Δ0→1 | Δ1→2 | WCAG 0:1 |
|---|---|---|---|---|---|---|
| dark | 0.176 | 0.229 | 0.286 | 0.053 | 0.057 | 1.12 |
| light | 0.986 | 0.957 | 0.927 | 0.029 | 0.030 | 1.09 |

On `index-390-light.png` the *Kaldığın yer* card is a faintly warmer
rectangle; on `test-320-light.png` the two cards are visible mainly by
their radius; on dark, `index-fresh` reads as text in a rounded region
rather than a raised object. DS §1.2's "three, not four" is right; it
lacks a *minimum* separation between adjacent steps, and the light
theme was solved for text contrast without one. The palette arm's
working tree, shifting the hue to 255°, keeps these exact L steps
(0.175 / 0.228 / 0.286) [S], so the finding stands against it; the
requirement it should be given is in §6.4. Two consequences are
hierarchy's: the filled button carries the whole "primary" load
because the card barely reads, and the wide layout's pane reads as a
column because nothing gives it an edge (§4.1).

### 1.5 Every block the same shape, on the same beat

660 blocks across 60 lessons, 11 a lesson, modal sequence `text ·
contrast · forms · check · examples · pitfall ×3 · check · decision`
[S]. Every block renders as `section.stack.stack--tight` with an
optional `.t-label`, separated by the one 32px gap of `.stack--loose`.
Measured at 320px, this lesson [S]: header 156, text 208, contrast
349, text 156, forms 418 (the one Surface), check 372, examples 536,
pitfall 128, 148, check 344, text 156, decision 556, end 270 — ~4,900px,
8.6 screenfuls of 568; thirteen sections, twelve identical gaps, one
card. `lesson-fresh-tall-320-dark.png` seen whole is a grey column
with one lighter rectangle a third of the way down, and it is the
*forms* table, not the contrast the lesson exists to teach. Uniform
rhythm and shape are real, but they are (1)–(3) at page scale: give
the blocks distinct type and the beat stops mattering; keep the type
and no spacing rule rescues it.

### 1.6 What was not it

**Weight nearly binary** is true (400 / 600; 700 is a fiction — §2.2),
but two weights serve every product in §5; the fault is direction.
**Nothing anchored right, no numerals**: the row's trailing value
works; the reader's one right-anchored element is the `%13` readout,
the least useful number on the page where "2 / 6" would place the
learner in the topic — minor, cheap (§3.1). **No ornament** is correct
and should stay so; the reader lacks one rule and one band, not
decoration.

---

## 2 · The type scale and rhythm, redesigned

### 2.1 The constraint that decides the scale

From `tools/palette.mjs`, the requirement for the candidate pairs,
against the measured Lc of the two text tokens [S]:

| pair | needs Lc | text-1 dark (s0/s1/s2) 94/93/91 | text-2 dark 79/77/75 | text-2 light 88/82/77 |
|---|---|---|---|---|
| 14/600 | 95 | fails on s2 | fails | fails |
| 15/600 | 75 | ok | **ok, at the floor on s2** | ok |
| 16/600 | 70 | ok | ok | ok |
| 15/400 | 100 | **fails** | fails | fails |
| 16/400 | 90 | ok, +1 | fails | ok on s0 only |
| 17/400 | 83 | ok | fails | fails on s2 |
| 18/400 | 75 | ok | **ok, at the floor on s2** | ok |
| 20/400 | 70 | ok | ok | ok |
| 22/400 | 65 | ok | ok | ok |
| 24+/400 | 60 | ok | ok | ok |

Two things follow. **There is no quiet regular text below 18px on
dark**, so quiet is bought with size relationship, position, measure
and *scarcity*, not colour — the meta tier can stay bold and grey and
read as quiet *provided it is one line*: a three-word tracked label
reads as a label; a seven-line paragraph at 15/600 is shouting in a
whisper, which is the results review. And **DS §2.2 has a wrong row**:
it lists "15px/400 in `--c-text-1` — needs Lc 90, measured 91" as one
of two legal pairings; the tool it describes says 15/400 needs 100 and
nothing reaches it [S]. No rule uses the pair, so nothing ships wrong;
the spec should say there is exactly *one* legal 15px pairing.

### 2.2 The weights that actually ship

`fonts/` holds Source Sans 3 at 400 and 600 and Source Serif 4 at 400.
Measured in the app's own Chromium by rendering the same string to a
canvas and counting ink [S]:

| request | Source Sans 3 ink | Source Serif 4 ink |
|---|---|---|
| 400 | 1,009 | 1,160 |
| 600 | 1,339 | 1,757 |
| 700 | 1,339 | 1,757 |

So a request for 700 in the sans resolves to the shipped 600 face
with **no synthesis** — identical ink, identical advance widths
(252.30px for both). The coordinator's premise that the primary button
is a faux-bold is not what happens; it is the plain 600 face, and the
`700` in `.btn--primary` and `.feedback__verdict` is a declaration
that does nothing. The serif is the opposite case: 600 and 700 *are*
synthesised (+51% ink) because no bolder serif exists and Chromium
emboldens. `.t-en` pins the block at 400, but the pin is on the
element, not its children — a `<strong>` or `<em>` inside an English
serif block would render as faux-bold. No authored string does that
today (`appendInline` runs on Turkish glosses; English lines go
through `englishTitle` as text) [≈]; it is a latent hazard worth one
rule: `.t-en strong, .t-en em { font-weight: 400 }` and emphasis in
English carried by nothing, because English is already the emphasis.

**Decision: two weights, and they point up.** 400 is for reading; 600
is for *heading, labelling and emphasis* — titles, row titles, block
labels, buttons, verdicts, `<strong>`, `<em>`. Nothing set at 600 is
ever a sentence the learner is meant to read through, with one
exception: the 15px meta tier, which is one line by rule. 700 is
removed from the stylesheet, not added to the payload:

- A 700 subset costs ~14 KB [≈, by the 600 file] against a fonts
  budget at 48.0 of 50 KB (DS §2.5), for a weight no system in §5
  needs.
- A 500 subset is refused for a sharper reason: `FONT_MATRIX` has rows
  for 400, 600 and 700 only, so **a 500 pair could not be checked by
  `npm run color`**.
- The amber fill's ceiling (Lc 67–68) is met by *size*: the primary
  label goes to 18/600, which sits between 18/700's ≈62 and 16/600's
  70 [≈]. It is added to `PAIRS` against `--c-accent` and measured
  before shipping; if it fails, 20/600 — never a weight that is not in
  the payload.

### 2.3 The scale

Five steps. Ratios 1.20 · 1.22 · 1.27 · 1.29. Every line-height a
multiple of 4. Per screen, **at most four of the five**, which is the
rule the current build breaks on every screen (six or seven of seven).

| token | size / lh | face · weight · colour | job |
|---|---|---|---|
| `--t-meta` | **15 / 20** | sans 600 text-2, tracked 0.09em when a label | block labels, kickers, counters, row subs, chips, nav, stat labels. **One line, never a sentence.** |
| `--t-body` | **18 / 28** | sans 400 text-1; serif 400 text-1 for English lines | Turkish prose, English example lines inside prose blocks, answer options, notes, rationales, buttons (600) |
| `--t-lead` | **22 / 28** | serif 400 (English) · sans 400 (Turkish) | contrast side labels, example sentences, decision outcomes, cloze stems, card titles, the Konu h1 |
| `--t-title` | **28 / 32** | sans 600 · serif 400 | screen titles inside a tab (Profil, Test cards), the results verdict line |
| `--t-display` | **36 / 40** | serif 400 (lesson titles) · sans 600 tabular (the score) | one per screen: the lesson title, the results score |

Deleted: 16, 17, 19. Kept: 15 (the floor) and 22, 28 as tokens that
now mean something different.

**Why body rises to 18 and not 17.** 17 → 15 is ×1.13, the crowded
middle again; 18 → 15 is the first step that reads as one at phone
distance, and 18/400 is the first size at which `--c-text-2` is
*legal for a sentence* (needs 75; 75 on `surface-2`, 77–79 on the
surfaces a paragraph sits on). The cost at 320px is ~33 characters a
line against ~36 [≈], on a floor DS §2.3 already accepts as below
every published minimum, and about +12% height on prose screens —
inside what `ui-improve.md` §4.1 costed for its readable mode (+6–19%,
no overflow at 320).

**Which tier is allowed to be `--c-text-2`, and where — explicit,
because the coordinator asked.**

| pair | allowed on | Lc margin dark | use |
|---|---|---|---|
| 15/600 text-2 | any surface | 0 on s2, +2/+4 on s1/s0 | every meta and label |
| 18/400 text-2 | **surface-0 and surface-1 only** | +2 / +4 | a quiet *sentence*: the pretest rationale, the backup nudge, the results "bu bir sıralama, bir sonuç değil" note, a stat's footnote |
| anything else | — | — | text-1 |

The second row is new and is the one thing the scale change buys that
no colour could: a paragraph that is quieter than body *at the same
size*, legal in both themes, never inside a dialog. Both rows go into
`PAIRS`.

**Line-height and measure.** 18/28 is 1.56 (the larger size needs
less than 16/26's 1.63); 22/28 is 1.27, so a two-line side label reads
as one object; 36/40 is 1.11. The measure is unchanged at 65ch and
608px (DS §7.3): ~62 characters wide, ~33 at 320px.

### 2.4 The rhythm

The 4pt scale is right; what is missing is a rule about which step
goes where, and one larger step, `--s-10: 64px`.

| relation | value | rule |
|---|---|---|
| label → its content | `--s-2` 4 · `--s-3` 8 | a label belongs to what is under it: tight |
| line → line inside an item (pattern → use, sentence → note) | `--s-2` 4 | one object |
| item → item inside a block (contrast sides, examples, rules) | `--s-6` 24 | plus a hairline where the items are homogeneous |
| paragraph → paragraph | `--s-5` 16 | unchanged |
| block → block | `--s-7` 32 | unchanged |
| **above a labelled block** | `--s-9` 48 | space above a heading ≥ 2× the space below it — the oldest rule in the book, and the one the reader breaks: today a `.t-label` has 32 above and 8 below, but so does every unlabelled block, so the label does not group |
| around the one band (the contrast) | `--s-9` 48 | a band needs air or it reads as a stripe |
| before a screen's last card (lesson end, results actions) | `--s-10` 64 | the end is a section, not a block |

The principle is alternation — 4 / 24 / 48 in the reader, not
8 / 16 / 32: three adjacent steps are arithmetic, hierarchy needs
geometric.

### 2.5 Before and after, 320px, three screens

**Eğitim index** (`index-320-dark.png`, `index-lower-390-light.png`)

| element | before | after |
|---|---|---|
| brand | 19 serif | 22 serif (`--t-lead`) — the one English word in the header earns the lead |
| resume card kicker | 15/600 text-2 tracked | same |
| resume card title | 22 serif | 22 serif — unchanged; it is right |
| "Tenses · %40" | 15/600 text-2 | same, it is a counter |
| primary button | 16/"700" (=600) on amber | 18/600 on amber, measured into `PAIRS` |
| backup nudge | 15/600 text-2 sentence + ✕, floating | 18/400 **text-2** sentence, on the keyline, ✕ at 48px — a quiet sentence, now legal |
| "Ya da kısa bir testle başla" (fresh) | centred 15/600 text-2 link with no shape | left-aligned text button on the keyline, 18/600 accent-text, chevron |
| search field | 16 | 18 (the iOS zoom rule wants ≥16; 18 is above it) |
| "Her konu, önce ne olduğunu anlatır" | 15/600 text-2 sentence | deleted from the list head, or 18/400 text-2 |
| tier heading *Temeller* | 15/600 text-2 tracked — same as the sentence above it and the row subs below | 15/600 tracked **with 48 above, 8 below**, and nothing else on the screen in that style within 48px of it |
| row title | 15/600 text-1 sans (English word) | **18 serif 400** — the topic name is English; the face and the size both say so |
| row sub | 15/600 text-2, one line, ellipsised ("görü…") | 15/600 text-2, **clamped to two lines** — the gloss is what distinguishes topics; an ellipsis at "görü…" reads unfinished (coordinator, confirmed at 390) |
| row trail "1/6" | 15/600 text-2 tabular | same |
| nav labels | 15/600 | same |

Sizes used: 15 · 18 · 22 — three of five. Before: 15 · 16 · 19 · 22 —
four, spanning 1.47× with the middle two indistinguishable.

**Lesson reader** (`lesson-open-320-dark.png` and the segments)

| element | before | after |
|---|---|---|
| reader top: "Dersler" · "%13" | 15/600 both | "Dersler" 15/600 · **"2 / 6"** 15/600 tabular — the position in the topic, with the progress bar still showing the position in the page |
| topic kicker | 15/600 tracked | same |
| lesson title | 28 serif | **36 / 40 serif** — the display; three lines at 320 for the longest titles, which is what a display is for |
| summary | 19 sans | 22 / 28 sans (`--t-lead`) |
| pretest label | 15/600 tracked | same, 48 above |
| pretest rationale | 15/600 text-2 paragraph | **18/400 text-2** — quiet by colour at last, and no longer bolder than the lesson |
| text block | 16/26 | **18 / 28** |
| contrast heading | 15/600 tracked, in the column | 15/600 tracked, **inside a full-bleed band** (§3.2) |
| contrast side label | 19 serif | **22 serif**, 24 above each side after the first, hairline between sides |
| side gloss | 16 sans | 18 sans |
| side example | 16 serif — same size as the gloss | 18 serif, 4 below the gloss |
| forms card | surface + 15/600 form names + 16 serif patterns + 15/600 use·example | **no card**: form names 15/600 tracked with a hairline above each group; pattern 18 serif; use 15/600 text-2 · example 18 serif text-1 |
| check label | "Kontrol", 15/600 | "**Kontrol 1**", "Kontrol 2" — a numeral, so the learner knows there are two |
| cloze stem | 19 serif | 22 serif |
| options | 17 serif · key 15/600 | 18 serif · key 15/600 tabular |
| examples sentence · note | 19 serif · 15/600 text-2 | 22 serif · 18/400 text-1, outcome after → in 600 |
| pitfall ✕/✓ lines · why | 16 serif · 15/600 text-2 | 18 serif · 18/400 text-1; consecutive pitfalls **grouped under one label** (§3.5) |
| decision triggers · outcome | chips 15/600 · 19 serif | chips 15/600 · 22 serif, **hairline between rules, 24 between, outcome indented 12** (§3.6) |
| end card | surface, label + 16 body + two buttons | same card, 18 body, 64 above |

Sizes used: 15 · 18 · 22 · 36 — four of five. Before: 15 · 16 · 17 ·
19 · 28 — five.

**Test tab** (`test-390-dark.png`, `test-320-light.png`)

| element | before | after |
|---|---|---|
| card titles *Yanlış defteri*, *Karışık test* | 22/600 sans | **28/600** (`--t-title`) — the card title is the screen's heading; there is no other |
| card body | 16/26 | 18/28 |
| "Yanlış yaptığın 3 soru burada" | the count buried mid-sentence | a **Stat**: "3" at 28/600 tabular with "soru" as its 15/600 label, then the sentence — the numeral is the anchor the skim needs |
| "Soru sayısı" · listbox | 15/600 · 15/600 | 15/600 · 18/600 |
| filled button | 16/"700" | 18/600 |
| secondary button | 15/600 | 18/600 |
| section label *En çok zorlandıkların* | 15/600 tracked, 32 above | 15/600 tracked, **48 above** |
| its note | 15/600 text-2 sentence | 18/400 text-2 |
| topic rows | as the index | as the index |

Sizes used: 15 · 18 · 28 — three of five.

---

## 3 · The lesson reader, block by block

### 3.0 The flow, end to end

Entry is from the topic screen's lesson rows or the index's resume
card; both land on `lesson-open-*.png`, which is the strongest
composition in the app: kicker, three-line serif display, a lead, a
labelled pretest. Then the shape decays. The pretest's own rationale
is bolder than the lesson's first paragraph; the first paragraph and
the contrast that follows are the same 16px; the contrast's label is
the same style as the pretest's label 500px earlier; the forms card is
the first thing with any mass and it is a reference table; two checks
say *Kontrol* with nothing to say which is which; three pitfalls
arrive as three sections; the decision block's outcomes float between
their triggers and the next rule's; and the end card is the second
Surface on a page whose first Surface was the least important thing
on it.

**Where the reader loses the thread — three places, seen:**

1. **After the contrast** (`lesson-seg2-320-dark.png`): the sides end,
   32px, and a Turkish paragraph begins that is *about the forms table
   below it*. Nothing says teaching has ended and reference begun; the
   band in §3.2 ends where its background ends.
2. **Between the pitfalls and the second check**
   (`lesson-seg5-320-dark.png`): ✕ ✓ why, 32, ✕ ✓ why, 32, *Kontrol* —
   three identical sections at one beat, then a question; a
   layer-caking eye (ui-improve §1.2) has no layer to land on.
3. **In the decision block** (`lesson-end-390-light.png`,
   `lesson-seg7-320-dark.png`): *→ Past Perfect*, chips, *→ Past
   Simple*, chips. The outcome sits 16px below its triggers and 16px
   above the next rule's, so half the time it reads as a heading for
   the chips under it — the one block where a learner can take the
   wrong rule away.

**The corpus says what the shape should be.** Sixty lessons; the
contrast block is at index 1 in all sixty, always with an authored
heading (85 blocks, 50 two-sided, 35 three-sided); pitfalls come in
runs of two or three (172 in 60 lessons); checks always number two
(120); the decision block closes 63 of 60 lessons — some have two
[S]. A lesson is, in fact, four parts: **the boundary** (text +
contrast), **the reference** (forms), **the practice** (check ·
examples · pitfalls · check) and **the exam rule** (decision). The
reader should show four parts, not thirteen sections.

### 3.1 The header

Right. Two changes: the display goes to 36, and the readout becomes
the lesson's position in its topic ("2 / 6"), right-anchored, because
that is the number a learner looks up for and the percentage is
visible as the bar anyway. The topic kicker at the top-left and the
count at the top-right give the reader two anchors on one line, which
is the cheapest right-anchoring available.

### 3.2 `contrast` — the one band on the page

Renders today as `ul.stack` of `li.stack--tight` with a hairline
between sides, 19px serif labels, no surface
(`lesson-contrast-390-dark.png`). It is indistinguishable from
`examples`, which also renders as a list of serif lines with a
Turkish line under each and hairlines between. The most important
block in every lesson has the same shape as its illustrations.

It should be the one raised thing in the teaching half: a **full-bleed
band** — `.bleed` plus `surface-1`, radius 0 (DS §1.2 already names "a
tinted band" as a use of `surface-1`; §4 gives full-bleed things no
radius) — 24px vertical padding, 48 above and below, the authored
heading as kicker, each side **22 serif label / 18 sans gloss / 18
serif example**, sides separated by 24 and a hairline. At 320 it is
the width of the phone and about a screenful tall: scrolling into and
out of it is the boundary, made spatial. No new primitive, no new
token. The forms card gives up its surface (§3.3), which is §7.1
applied — the contrast is heterogeneous, the forms are homogeneous
rows. Does it then look like the most important thing on the page?
Yes: the only background between the title and the end card. Today
the forms card is.

### 3.3 `forms` — a reference, so rows, not a card

The reader's only `.surface`, grouped by form, each row a serif
pattern over a bold-grey use·example line (`lesson-forms-390-dark.png`).
Its shape says "table", rightly; the card is why the eye lands here
instead of on the contrast. The renderer says it earns a card because
the learner scrolls back to it — but findability is a heading's job,
not a fill's, and §7.1 makes homogeneous content rows. So: form names
as 15/600 tracked labels with a hairline above each; pattern 18 serif;
use 15/600 text-2 with the example 18 serif *text-1* — it is English
and currently sits in grey.

### 3.4 `examples` — sentence first, then its reason

Renders as sentence 19 serif / note 15/600 text-2, hairlines between
(`lesson-seg4-320-dark.png`). The shape is fine; the sizes are not.
Sentence 22 serif, note 18/400 text-1 with the → outcome in 600. The
note is the teaching, and it is currently a caption. With the contrast
in a band, the examples no longer have a twin.

### 3.5 `pitfall` — a run is one block

✕ line / ✓ line / why, each pitfall its own section. The glyph pair is
the only block type identifiable from across the room; what fails is
the run — three sections, three gaps, no label (none of the 172 has
one and the renderer adds none). `renderLesson` should fold
consecutive pitfalls into one section under *Sık yapılan hata*, 24
between pairs, sentences 18 serif, why 18/400 text-1. A render
decision, no schema change — what the block vocabulary was for.

### 3.6 `decision` — rows with a rule between them, outcome indented

The ambiguity in §3.0 is spacing and shape at once. Each rule a row
(§7.1) with a hairline between and 24px; within a rule, triggers then
the outcome **indented by the arrow's width**, so it reads as the
consequence of what is above and not the title of what is below.
Outcome 22 serif. The renderer's merging of shared outcomes stays.

### 3.7 `check` — numbered, and visibly practice

Label / stem / options / feedback; it works, and the feedback band is
already full-bleed. Two changes: *Kontrol 1* and *Kontrol 2*, and the
stem at 22 serif so a question is visibly larger than the prose it
interrupts. The pretest keeps its own label.

### 3.8 `text` — the only block that should have no shape

Right as it is, at 18/28; none of the 100 carries a heading and none
should.

### 3.9 The end

The card stays (heterogeneous: a sentence and two actions). 64 above.
When it crosses a topic it already names the next topic; good.

---

## 4 · The screens that arrived recently

### 4.1 The split, ≥1080px — a column, not a pane

`index-1280-dark.png`, `test-1280-dark.png`, `profil-1280-light.png`,
`results-1280-dark.png`, `konu-1280-light.png`. The engineering is
right: the reading column holds 608, source order is untouched, the
bar follows the keylines. What is missing is that the pane was never
*designed* — it is the phone's stack placed in a 320px track:

- Index: the resume card and, 40px under it, the backup nudge floating
  with its ✕ — an orphaned sentence beside a list.
- Test: two cards, then *En çok zorlandıkların* cut at the fold while
  the right column scrolls on; no heading, no bottom.
- Profil: two paragraphs of 15/600 grey under 15/600 grey labels — a
  wall of bold grey — beside the stats.
- Results: *1 / 3* at 28px, the smallest thing that should be the
  biggest, beside bold grey explanations.
- Konu: the best of the five — six lesson rows with numerals, chips
  and chevrons, the app's one numeral column. The model.

A pane needs a top — a 15/600 tracked heading aligned to the reading
column's first baseline — so the columns start together; the nudge
belongs in the pane's card or nowhere; the score is a display. No new
primitive; §7.3 should say a pane is a stack with a heading.

### 4.2 The topic overview (Konu)

`konu-390-dark.png`, `shots/intro-after.png`. v0.44 fixed the literal
asterisks; what is left is hierarchy. *Tense nedir?* at 22/600 is the
app's only real h1 and it is a third smaller than the reader's
display. The *parts* list (*Zaman — olay şimdi mi…*) collapses name,
gloss and English example into a bold line over a grey serif line;
it wants the forms treatment of §3.3. Title to 28 sans (it is
Turkish). The two example sentences are the screen's best moment.

### 4.3 The mistake book entry

`test-390-dark.png`. A card identical in shape to *Karışık test*,
distinguished by taking the filled button; the count — the one fact —
is inside a sentence. §2.5 gives it a Stat.

### 4.4 The results review

`results-390-dark.png`, `results-seg1-320-dark.png`. The score at 28
is a title, not a display; *Sonuç* at 15 is the h1; everything under
each review stem — *Cevabın · Doğrusu*, the per-option note, the
explanation, *Kural* — is 15/600 text-2. The longest text in the app
set in the meta tier, an 80.8%-meta screen, and the single worst
reading surface. Score 36 tabular; verdict line 22; explanation and
note 18/400 text-1 with *Kural:* in 600; *Cevabın / Doğrusu* stays
the one meta line per item.

### 4.5 Profil after the theme control

`profil-390-dark.png`, `profil-theme-390-dark.png`. 98% one style;
the stat values at 22 are the only relief and should be 28. The
theme control is a Row-switch with a chip — consistent — but its
label and explanatory sentence are the same grey bold as everything,
so the newest control is invisible in the oldest way. Labels 48
above; paragraphs 18/400 text-1 (instructions, not captions).

### 4.6 The backup nudge

`index-390-dark.png`. The one sentence about the learner's data being
at risk, rendered as a caption with a close button and no shape.
18/400 text-2 on the keyline with the 48px ✕ — a quiet sentence, now
legal.

---

## 5 · What good looks like in this category

Five, chosen because a professional would cite them and because each
does one thing this app does not. Figures are from the products'
published specs where they publish them and from memory where they do
not; the marks say which.

**1 · Apple's iOS text styles.** Large Title 34, Title 1 28, Title 2
22, Title 3 20, Headline **17 semibold**, Body **17 regular**, Callout
16, Subheadline 15, Footnote 13, Caption 12 [S, in points]. Headline
and Body are the *same size*, differing only by weight — weight is
spent on headings, never on quiet text — and everything under Body is
lighter or equal in weight, smaller, and one line. This app's
footnote tier is its boldest and carries paragraphs.

**2 · Material 3.** Body Large 16/24 at 400; Title Large 22/28 at 400;
Headline Small 24/32; Label Large **14/20 at 500** [S]. The label
style is the only medium-weight one and exists for buttons and tabs —
words, not sentences. Fifteen styles, four or five per screen [≈];
this app has seven and uses six.

**3 · Medium.** Body in Charter at about 21px on desktop, line-height
near 1.58, 18–20 on a phone [≈ — ~21px and Charter confirmed by
search; the line-height from memory]. No label tier on the reading
surface at all; the byline is the one piece of small type, *under* a
display title. The reader is this app's Medium article, at 16.

**4 · The New York Times.** Cheltenham headlines at display sizes, a
serif body, Franklin for kicker, byline and metadata [S for the
roles; no first-party sizes found]. The point is structural: the
*kicker* — small, tracked, sans, above the headline — is exactly
`.t-label`, and it works there because it sits above 40px of
Cheltenham. A kicker with no headline under it is §1.2.

**5 · Murphy, *English Grammar in Use*.** Not a screen; the reference
for the reader's *shape*. Every unit is one spread — rule on the left
in lettered sections, exercises on the right — with examples set apart
from explanation and the two contrasted forms as labelled rows with
the distinguishing word emphasised [≈, from the editions, not a
measured spec]. Four parts a reader can see: rule, forms, examples,
exercise — the structure the corpus already has (§3.0) and the reader
hides.

**What all five share, and this app does not:** the weight axis points
up; the smallest style is scarce and one line; there is always one
size at least ×2 the body on a screen; and the reading size is 17–21,
not 16. Two of those are free here. One costs 12% height. One is a
rendering change in `education.js`.

---

## 6 · A concrete, buildable proposal for beta1

Everything below respects what is settled: three-tab nav, no build
step, no `innerHTML`, 320px floor, one accent doing one job, the split
additive and paneless in the reader and quiz, the block schema
unchanged. Ordered by what unlocks what.

### 6.1 The scale and weights (`css/style.css`, `tools/palette.mjs`)

1. Tokens: `--t-meta 15/20`, `--t-body 18/28`, `--t-lead 22/28`,
   `--t-title 28/32`, `--t-display 36/40`, `--t-ui` deleted (buttons
   and rows use body), 16/17/19 gone. `--s-10: 64px` added.
2. Weight: every `700` in the stylesheet becomes `600`;
   `.btn--primary` label 18/600; `.t-en strong, .t-en em` pinned to
   400; `em` stays 600 in the sans (it is emphasis, which is what 600
   is for).
3. `PAIRS` rewritten for the new pairs, including `18/600 on
   --c-accent` and `18/400 text-2 on surface-1`; the check runs before
   anything ships. If the amber pair fails, the label goes to 20, not
   to a new face.
4. Per-screen cap of four sizes, enforced: `verify-ui.mjs` counts
   distinct rendered font sizes per screen and fails above four (the
   §1.1 census script is forty lines and written).

### 6.2 The reader (`js/education.js`, `css/style.css`)

5. Contrast block → full-bleed `surface-1` band, 22 serif side labels,
   48 above and below.
6. Forms → rows with hairlines; the card is removed.
7. Consecutive pitfalls → one labelled group.
8. Decision → rows with hairlines, outcome indented under its triggers.
9. Checks numbered, stems at lead; "n / N" replaces the percentage
   readout; rhythm per §2.4 — 48 above every labelled block, 64 before
   the end card, 24 between items in a list-shaped block.

### 6.3 The other screens

12. Every explanatory paragraph currently in `.t-meta` → `.t-body`
    (results review, Profil, the lesson end, the Test cards' notes),
    and the four quiet sentences named in §2.5 → 18/400 text-2 on
    surface-0/1.
13. Stat values → `--t-title`; the results score → `--t-display`; the
    mistake book gets a Stat.
14. Row: title at body (serif 400 when English), sub clamped to two
    lines, min-height 56.
15. Panes: a tracked heading at the top of every pane, aligned to the
    reading column's first baseline; the nudge inside the resume card
    on wide.
16. "Ya da kısa bir testle başla" → a text button on the keyline.

### 6.4 Design-system amendments, by section

| DS section | amend |
|---|---|
| **Scope** | "Dark only" is false since v0.43. Two themes, both solved; the light one is the one most people read better in (§11.5's own citation). |
| **§1.2 Surfaces** | Add a *minimum adjacent step*: surface-0 → surface-1 must read as a card in both themes. The value is the palette arm's; the requirement is ≥0.05 OKLCH L on light as on dark [?], or a light-theme card takes a hairline as its *one* separation mechanism (§7.1 permits one) and drops the fill. |
| **§1.3 Text** | Add the direction rule: *the weight axis points up — no tier quieter than body is ever heavier than body, except a one-line label.* Add the two legal `--c-text-2` pairs (§2.3) and strike the sentence "if two tiers of grey are doing the work, the type is wrong" only to extend it: *if one style is doing every secondary job, the type is also wrong.* |
| **§2.2 Scale** | Replace the table with §2.3. Correct the "15/400 needs Lc 90" row — the tool says 100 and nothing reaches it; there is one legal 15px pairing. Add the per-screen cap of four. Add: *the meta tier is one line; a sentence is never meta.* |
| **§2.5 Loading** | State the measured fact: 700 resolves to the 600 face without synthesis in the sans and *with* synthesis in the serif; the stylesheet asks for 600 only, and `.t-en` pins descendants. |
| **§3 Space** | Add `--s-10: 64px` and the relation table of §2.4, in particular the 2:1 above/below rule for headings. |
| **§7.1 Row** | "One line, always" → "one line, or a fixed two when the sub *is* the distinguishing content (the index gloss); never a ragged count." Row title at body size. |
| **§7 inventory** | The Surface entry gains "or a full-bleed band (`.bleed`, radius 0) — the reader's contrast block"; the note that "the forms block earns a card" in `education.js` is reversed. |
| **§7.3 The second column** | A pane is a stack *with a heading*; the two columns start on one baseline; nothing floats under a pane's card. |
| **§11.2** | Close it: weight compensation is moot while the weight axis points backwards; revisit only after §1.3's direction rule ships, on a phone. |

### 6.5 What I would refuse

- **A third weight as the fix** — 500 cannot be checked by `npm run
  color`; 700 costs 14 KB for a job size does better.
- **An italic face** — 600 for `<em>` is right.
- **Borders, icons or colour per block type** — the shapes identify
  the blocks (§3); DS §1.6 stands.
- **A card around the contrast** — a band, radius 0, the only one.
- **Tabs, accordions or paged screens in the reader** — the fault is
  rendering, not the block types (§3.0).
- **A wider measure**, or a pane in the reader or quiz — §7.3 is right.
- **All-caps labels** (§2.4).
- **Meta at 400 on dark** — illegal below 18px, measured.
- **Body at 17** — keeps the crowded middle and buys nothing 18 does
  not.

### 6.6 Cost

Tokens, `PAIRS` and ~40 lines of rules: an afternoon. Four renderers
in `education.js` (`renderContrastBlock`, `renderFormsBlock`,
`renderDecisionBlock`, a pitfall-grouping pass in `renderLesson`) plus
labels: a day, with `npm run verify` after. §6.3 is class swaps.
Nothing touches content, schema, validator or manifest; none of it
lands in an exam week.

---

## 7 · What I could not check

1. **The amber pair at 18/600** — between 18/700's ≈60 and 16/600's 70
   against a 67–68 ceiling; probably clears, must be measured. If not,
   20.
2. **~33 characters at 18px in Turkish on a real 320px phone** —
   arithmetic, not reading; agglutinated words may make too many
   two-word lines.
3. **The light-theme card threshold** (the palette arm's; hairline as
   fallback) and **two-line row subs against `LANDING_BUDGET_SCREENS
   = 3`** (~200px more at 320) — the tool and the sweep will say.
5. **Figures marked [≈]** — Medium's line-height and Murphy's layout
   are from memory; Apple's and Material's tables are published; NYT
   sizes were not found in any first-party source.
6. **A 380px-tall landscape phone** with a 36px display and a
   full-bleed band (DS §8.7) — not shot; the sweep should add it.
7. **The state measured.** Screenshots and the census are of v0.44 as
   served on 2026-09-09; the palette arm was editing `css/style.css`
   and `tools/palette.mjs` in the same checkout while this was
   written, so token values quoted here are the committed ones, not
   its working tree.

## Sources

- `docs/design-system.md` §1–§3, §7, §11; `docs/audit/type-contrast.md`;
  `docs/research/ui-improve.md` §1, §4, §7; `tools/palette.mjs`
  (`requiredLc`, `PAIRS`), `tools/color.mjs` (`apca`); measurements in
  `scratchpad/hier/census.json`, `scratchpad/ink.mjs`, `scratchpad/weight.mjs`.
- Apple HIG, *Typography* (iOS default text styles);
  [Material Design 3 — Typography](https://m3.material.io/styles/typography);
  [Material Web — Typography](https://material-web.dev/theming/typography/).
- [Wichary, "Cast of characters"](https://medium.design/cast-of-characters-17eaa82755cf);
  [What font does Medium use](https://www.designyourway.net/blog/what-font-does-medium-use/) [≈];
  [What font does the NYT use](https://www.designyourway.net/blog/what-font-does-new-york-times-use/) [≈];
  [Stripe](https://open-design.ai/plugins/design-system-stripe/) and
  [Linear](https://open-design.ai/plugins/design-system-linear-app/) tokens via OpenDesign [≈].
- Duggan & Payne, CHI 2011; NN/g scanning patterns — via `ui-improve.md` §1.
