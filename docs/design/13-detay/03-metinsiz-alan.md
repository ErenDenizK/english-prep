# What fills the mid-tone

Arm 3 of the second detail round. Answers the owner's complaint —
"yavan" — with a proposal for content, not a colour value: what
non-text material could occupy CIE L\* 0.30–0.70 in this app, measured
against what the owner's own references spend it on, and against the
two-theme constraint the supervising session found while this arm was
running (`13-detay/08-iki-tema-asimetrisi.md`).

Method: `docs/design/measure-screens.py` and a new `census.py` region
segmenter (Pillow, pure Python, no numpy — none is installed), written
for this task and not part of the repo's own tooling. It flood-fills
the mid-tone mask into connected regions and reports each region's
area share, bounding box, aspect ratio, fill ratio (how much of its
own bounding box it fills — low means scattered, high means a solid
block), screen position, and mean OKLab chroma (chromatic if ≥ 0.035,
`measure-screens.py`'s own neutral threshold). `[S]` throughout means
measured in this session with these tools; `[≈]` means a WebSearch
synthesis with cited sources, since almost every documentation host is
blocked (`13-detay/00-brief.md` §"Ağ gerçeği" — confirmed again here:
`lingolia.com`, `teachingenglish.org.uk`, `archive.org`,
`researchgate.net`, `sfu.ca` all returned `EGRESS_BLOCKED`).

## 1 · What the references spend their mid-tone on

Eleven crops in `docs/design/refs/`, all Instagram posts of app-design
studios showing their work — a phone or tablet held in a hand against
a blurred studio backdrop, not a bare screenshot. That matters: a
meaningful share of every reference's mid-tone is *photography*, not
*application UI*, and the two have to be separated before drawing any
conclusion this app can act on. `[S]`

Census, 3% inset (matching `00-v4-olcumu.md`'s own methodology),
regions ≥ 0.5% of frame:

| ref | picked | total mid | biggest region | what it is |
|---|:-:|---:|---|---|
| 1-traffic | ✓ | 20.0% | 10.3%, neutral, top-center | **not app UI** — the blurred Instagram caption strip merging into the photo's own out-of-focus dark surround |
| 3-log (Hydroflask) | ✓ | 18.4% | 16.4%, chroma 0.136, fill 0.52 | **app's own screen background** — a single warm orange→pink→yellow gradient field filling the whole phone screen behind a bottle illustration |
| 4-wallet | ✓ | 10.1% | 7.3%, chroma 0.036 (borderline), fill 0.14 | a frosted/blurred reflection strip under the balance card — low fill ratio, i.e. scattered, not solid |
| 8-midnightreads | ✓ | 27.8% | 10 regions, 0.6–3.9% each | **genuine app UI** — amber "Continue" pill buttons, circular icon buttons, and small warm book-cover thumbnails |
| 10-wearable | ✓ | 9.9% | 5.0% neutral (hand/backdrop) + 2.8% chroma 0.122 | one region is photography (hand), one is a purple progress-arc tile — the only true UI region |
| 2-flask | | 13.9% | 10.1%, chroma 0.059, fill 0.58 | app's own screen background, same pattern as 3-log: one gradient field |
| 5-salesforce | | 16.7% | 4 regions, 2.8–4.4% each, all chromatic | four colourful data-visualisation tiles (bar/donut charts on gradient cards) |
| 11-insurance | | 7.7% | 4.7%, chroma 0.141 | one gradient hero card ("Welcome back") |
| 6-bookly, 7-bookly-reading | | 7.3%, 8.7% | ≤ 0.8%, chroma 0.044 | a small circular avatar/icon — negligible |
| 9-solar | | 4.8% | **0 regions ≥ 0.5%** | a bar/line/sparkline chart: real mid-tone data-ink, but as scattered marks each individually tiny, not a field |

Taxonomy, by measured area budget:

1. **Photography (hand, blurred studio backdrop, captions).** ~5–10%
   of frame in four of the five picked references. **Not available to
   this app** — no camera, no photo content, out of scope by the
   brief itself. `[S]`
2. **A single filled/gradient field as the screen's own background**
   (3-log 16.4%, 2-flask 10.1%, 11-insurance 4.7%). The single
   largest replicable category — one connected region, fill ratio
   0.5–0.6, i.e. a solid block, not texture. `[S]`
3. **Data-visualisation tiles** (5-salesforce, four regions
   2.8–4.4%; 9-solar, scattered sub-threshold marks). Structurally
   different from (2): many small marks rather than one field — a
   *mosaic* rather than a *plate*. `[S]`
4. **Filled UI elements — buttons, thumbnails, avatar dots**
   (8-midnightreads, ten regions from 0.6–3.9%). Small, plural,
   clustered near the bottom of cards. `[S]`
5. **Blurred/frosted decorative strips** (4-wallet). Low fill ratio
   (0.14) — the region's bounding box is large but mostly empty,
   meaning it is not a block but a texture requiring blur, which this
   app's "no build step, hand-drawn icons" constraint cannot cheaply
   produce at runtime. `[S]`

## 2 · What our own nine screens spend it on

Same census, no inset (our own shots, not crops of a photo), on
`docs/design/11-ui/shots/*.png`:

```
1-bugun.png      total-mid 2.4%   regions>=0.5%: 0
2-konular.png     total-mid 2.2%   regions>=0.5%: 0
3-konu.png        total-mid 2.5%   regions>=0.5%: 0
4-ders.png        total-mid 2.4%   regions>=0.5%: 0
5-soru.png        total-mid 1.3%   regions>=0.5%: 0
6-cevap.png       total-mid 2.7%   regions>=0.5%: 0
7-sonuc.png       total-mid 1.5%   regions>=0.5%: 0
8-ilk-acilis.png  total-mid 1.3%   regions>=0.5%: 0
9-deneme.png      total-mid 1.7%   regions>=0.5%: 0
```
`[S]`

Zero connected regions at any threshold down to 0.5%, on all nine
screens. Lowering the threshold to 0.03% turns up exactly eight
fragments total, on two screens, and every one of them is a rule or a
border, not a field:

```
6-cevap.png   #1 share 0.20%  bbox 338x7px   aspect 42.4
              #2 share 0.20%  bbox 327x2px   aspect 109.3
              #3 share 0.10%  bbox 323x1px   aspect 162.0
              #4 share 0.10%  bbox 323x1px   aspect 162.0
8-ilk-acilis  #1 share 0.08%  bbox 123x1px   aspect 62.0
              #2 share 0.08%  bbox 123x1px   aspect 62.0
              #3 share 0.06%  bbox 1x99px    aspect 0.02
              #4 share 0.06%  bbox 1x99px    aspect 0.02
```
`[S]`

Aspect ratios of 42–162 to 1: these are not shapes, they are
hairlines — the choice-card outline strokes and progress-bar edges in
`6-cevap.png`, a dialog's focus outline in `8-ilk-acilis.png`. This is
the direct, measured answer to the brief's framing question. Our
mid-tone is not zero because we lack mid-tone *surfaces* — the karar
ladder reaches `surface-4` at CIE L\* 30.3, right at the band's edge —
it is zero because **nothing in the corpus is drawn as a filled
region**. Every element is either a line one pixel wide or a block of
text at the ladder's extremes. `CLAUDE.md`'s own description of the
lesson block confirms this by name: the `contrast` block that carries
the app's entire pedagogy (`js/education.js`, rendered from
`{category, summary, blocks}`) is implemented as two block-quotes with
a coloured left border — a rule, in the taxonomy above, not a plate.

## 3 · What could legitimately fill it here

No photographs, no maps, no social feed — CLAUDE.md's own
description of this app — and the Duolingo dialect (mascots, badges,
celebration) is explicitly rejected in `07-karar.md` §2 on six
evidence lines, not by taste. Against the taxonomy above and the
brief's candidate list:

| candidate | verdict | why |
|---|---|---|
| **Learner's own record as marks** (heat grid / small multiples) | **built & measured**, §5 | matches taxonomy (3) — a mosaic, exists nowhere in the app today (the results screen shows a single ring, not history) |
| **Diagrammatic figure for a grammar contrast** | **built & measured**, §5 | matches taxonomy (2) — a plate, and it is the only candidate that also *teaches*, which none of the others do |
| **Typographic plate** (a large quoted sentence as a field) | rejected, reasoned | the type scale rule (`design-system.md`: five sizes, 36 the largest, "a sentence is never meta") caps how big a quoted sentence can legally get; at legal sizes the glyphs' own ink coverage is nowhere near what a filled plate needs, so this either breaks the type scale or fails to move the number — not tested because the first horn of that dilemma already rejects it |
| **Rules and bands as structural ink** | rejected, measured | this is what the app already does (§2's eight hairline fragments) and it measures at 0.06–0.20% each — a rule is definitionally thin; making it thick enough to matter turns it into a plate, i.e. candidate 2 |
| **Enlarged topic monogram** | untested, reasoned accept | plausible as a plate (taxonomy 2) using the existing 20-icon vocabulary (`js/icons.js`) at a much larger size, but it teaches nothing next to the contrast diagram and would compete with it for the same budget on the same screens; deprioritised, not built |
| **The exam's own artifact as a surface** (an answer-sheet grid, a cloze-blank pattern) | untested, reasoned promising | sits between taxonomy (2) and (3) — worth a specimen the next round has time for; listed in `## Doğrulanamayanlar` |
| Photograph, map, blurred backdrop | **rejected** | no camera content in this app by design; §1's own census shows this is where most of the references' mid-tone actually lives, which is the most important negative finding here — **the gap in the references is partly a gap this app cannot close by category**, so the target is not their 18.4% median but whatever the surviving two mechanisms can reach |
| Mascot, badge, celebration | **rejected** | `07-karar.md` §2, six evidence lines already written, not reopened here |

## 4 · Drawing the grammar

Every lesson in this app is an "X vs Y" contrast (`CLAUDE.md`, "Who
this is for"). Nothing in the app currently draws that contrast — the
`contrast` block is prose with a coloured rule (§2). Conventions from
the literature, as much as the network would surface:

**Reichenbach's three-point notation.** `[≈]`, corroborated across
several independent secondary sources (glottopedia.org synopsis, an
SFU course PDF, an ACL Anthology paper on Reichenbach's tense theory —
all blocked for direct fetch, WebSearch's synthesis is consistent
across all of them). Tense is three time points — S (speech time), R
(reference time), E (event time) — ordered on a line with two
relations: anteriority (written `-`) and simultaneity (written `,`).
Past perfect is `E-R-S` (event before reference before speech);
present is `E,R,S` (all three coincide). This is the formal linguistic
convention behind every timeline diagram in the ELT tradition, and it
is the reason a *line with points on it* is the right primitive, not
an invented one.

**Comrie's aspectual distinctions.** `[≈]`, same caveat (Comrie 1976,
*Aspect*, Cambridge Textbooks in Linguistics — the book itself is not
reachable, only secondary citation). Punctual vs durative, state vs
dynamic: "with a state, unless something happens to change it, the
state will continue... with a dynamic situation, the situation will
only continue if continually subject to a new input of energy." This
is exactly the "been vs gone" contrast this arm chose to draw:
*state* (still there, no further energy needed to remain so) against
*completed action with a return* (dynamic, and finished).

**ELT classroom convention**, `[≈]` (British Council TeachingEnglish,
ELT Concourse, both blocked for direct read, synthesis consistent
across both and independent of the academic sources above): a
horizontal line, arrowhead optional, a marked point for "now." Aspect
is a *texture* on that line — a dot for a single completed or
habitual point, a wavy line for an in-progress continuous action, a
cross for a specific point in time. "There is no set rule... rather a
common-sense convention," which is itself useful: it licenses this
app inventing its own consistent marks rather than importing someone
else's icon set wholesale.

**Assessment.** The literature converges on one primitive — a line,
points on it, one marked "now" — plus a small texture vocabulary for
aspect (dot / wave / cross). That much transfers directly and cheaply:
inline SVG, no library, drawn from the same token set as everything
else. But "been vs gone" is not a pure tense contrast, it is a
*spatial-result* contrast (where is she now, given what happened),
and no source above gives a convention for that. The specimen in §5
had to invent one — filled node vs hollow node for "is/is not there
now" — which is a second primitive family the vocabulary needs
alongside the timeline. **A full diagrammatic vocabulary for this
app's ~15 grammar categories is therefore at least two families, not
one**, and only one of them (the timeline) has a citable convention
behind it. That is a real cost the next round should budget for, not
a reason to reject the approach — CLAUDE.md's own instruction that
question-authors treat each category as a spec worth writing before
content (`docs/agents/category-spec.md`) applies here too: each
contrast category would need its diagram convention specified once,
the way `been`/`gone` was here, before lesson content is drawn.

## 5 · Measuring the proposals

Two candidates built as static specimens at 390×844, in
`13-detay/03-ornekler/`, **each in both themes** per the supervising
session's finding (`13-detay/08-iki-tema-asimetrisi.md`): the light
theme's whole text-bearing ladder lives in 6.3 L\* points, nineteen
points short of the mid-tone band, so anything that only works in dark
is a half-answer. Screenshots via Chromium
(`/opt/pw-browsers/chromium`), measured with this repo's own
`measure-screens.py` and `midtone.py`. `[S]` throughout this section.

### A defect found and fixed mid-arm

The first cut of the grammar-diagram specimen set full sentence labels
directly on a graphite counter-plate (`#6F6156`, CIE L\* 42.2) inside
the mid-tone band. Checked against this repo's own `tools/color.mjs`:

```
text-1 #F4F7FB  on #6F6156   Lc 80   WCAG 5.55   — needs Lc 90 + WCAG 7
pure white      on #6F6156   Lc 85   WCAG 5.97   — still fails
```

Both fail this project's contrast bar. The general fact behind it,
solved once: with dark theme `text-1` (`L 0.975`), the text-bearing
ceiling is CIE L\* 30.4 (`07-karar.md` §2); with pure white ink it is
36.8. The mid-tone band starts at 30. **The overlap between "counts as
mid-tone" and "can legally carry this app's body text" is 0.4 points
with the shipped ink, 6.8 points with pure white, and in the light
theme it is zero** — the text floor there is L\* 89, nineteen points
from the band (`08-iki-tema-asimetrisi.md` §3).

So a mid-tone plate can carry text, or be mid-tone — not both, except
in a 6.8-point sliver that only exists in one theme. The fix applied
here: the plate carries **only the drawn lines** (the SVG paths, the
presence-nodes); every label — "Ankara," "now," the row captions — sits
either on the page background outside the plate, or as a small chip
whose *own* background is the page colour, floating over the plate.
The chip pairing (`text-1` on `page`) is the app's ordinary text pair
and passes trivially in both themes (WCAG 17.6 / 15.2, APCA 102 / 96).
This is the general rule the taxonomy in §3 should carry forward:
**text-bearing mid-tone is a separate, much smaller budget than
graphics-only mid-tone, and the two should not be designed as one
thing.**

### Results

`docs/design/measure-screens.py` and `docs/design/midtone.py`, both
themes, both specimens, against the three rejection conditions
(`00-v4-olcumu.md`): entrance-screen event area ≥ 20%, one colour
family ≥ 1.5%, mid-tone ≥ 10%.

| specimen | theme | event | hue family | mid-tone |
|---|---|---:|---|---:|
| **A — grammar diagram** (lesson reader, not the entrance screen) | dark | 27.5% | H60 0.8% | **18.1%** |
| | light | 25.5% | H60 0.5% | **19.5%** |
| **B — record strip v1** (entrance screen, first cut) | dark | 15.1% | H60 2.6% | 6.5% |
| | light | 13.8% | H60 2.8% | 6.7% |
| **B′ — record strip v2** (entrance screen, denser grid) | dark | **23.7%** | **H60 8.0%** | **15.1%** |
| | light | **22.9%** | **H60 8.2%** | **15.3%** |

Region census on the final specimens (`census.py`, ≥ 0.5%):

```
01-grammar-diagram-dark    2 regions: 8.1%, 8.0% — the two plates
                            themselves, aspect 4.17, fill 0.89-0.90
                            (a solid block, matching taxonomy (2))
01-grammar-diagram-light   2 regions: 8.4%, 8.4%, fill 0.94
02-record-strip-v2-*       0 regions >= 0.5% despite 15%+ total mid
                            (matches taxonomy (3): a mosaic of small
                            marks, structurally the same pattern as
                            9-solar.png's chart, not a "field")
```

Reading the three columns together, not picking a winner (the pattern
the coordinator flagged and it holds): **neither specimen alone clears
all three conditions.** A (the diagram) clears event area and
mid-tone by a wide margin in both themes but its colour family is
marginal-to-absent (0.8% dark, 0.5% light — under the 1.5% floor in
both, and light is right at the 0.5% measurement floor). B′ (the
record strip, densified) clears all three, in both themes, but it is
not the entrance screen's only content and was tested standalone; the
one already-shipped screen it would sit inside still carries its own
list and copy. **The two are complementary, not competing**: A belongs
on the lesson reader, where CLAUDE.md already forbids the split-pane
(§7.3) and where nothing today fills the reading column's width; B′
belongs on the entrance screen (`#egitim`, the "Bugün" tab), which is
exactly where the rejection condition is written to apply. Shipping
both is not redundant — they answer different screens.

**B v1 → v2 is itself a finding.** The first cut (a 14×4 grid, ~44
cells, moderate empty-cell ratio) looked identical in every
screenshot review but missed the mid-tone floor by 3.3–3.5 points and
the event floor by 5–6. The fix was arithmetic, not aesthetic: a
denser grid (10×7, 70 cells) with a lower empty-cell ratio. **A
mosaic candidate's success is a direct function of cell count and
fill ratio, measurable before it is ever looked at**, which is the
whole point of having `midtone.py` rather than judging a screenshot
by eye.

## Öneri

1. **Ship both mechanisms, on different screens, not one "mid-tone
   component."** The diagram (taxonomy 2, a plate) belongs on the
   lesson reader, replacing the `contrast` block's current
   block-quote rendering; the record strip (taxonomy 3, a mosaic)
   belongs on the entrance screen. Neither should be generalised into
   a single reusable "mid-tone card," because the two are
   structurally different (one connected region vs many small marks)
   and the taxonomy in §1 shows the references never conflate them
   either.
2. **Add the counter-plane as a named, fixed token independent of
   either theme's surface ladder**, per
   `08-iki-tema-asimetrisi.md`'s own recommendation. This arm's value
   (`#6F6156`, CIE L\* 42.2) is a specimen, not a proposal for the
   final hex — but the *mechanism* (one value, not derived from
   either ground, used only for non-text graphics) is validated
   here: it measured within 1.4 points of itself between dark and
   light (18.1/19.5, 15.1/15.3), which is the theme-independence the
   asymmetry document asked for.
3. **Write "text-bearing mid-tone" and "graphics-only mid-tone" into
   the design system as two different budgets**, not one. The
   overlap where the two coincide is 6.8 points in dark ink-white,
   0.4 with the shipped ink, and zero in light. Every future
   mid-tone proposal should say which budget it is spending before
   it is measured, the way §5's defect-and-fix shows what happens
   when it doesn't.
4. **Treat the diagram vocabulary as at least two primitive families**
   — a Reichenbach-style timeline-with-points for tense/aspect
   contrasts, and a presence-node convention for spatial/result
   contrasts like been/gone — and write each grammar category's
   diagram convention once, as a spec, before drawing lesson content
   in it (the same discipline `docs/agents/category-spec.md` already
   asks of question content).
5. **Budget for density, not decoration, on any mosaic candidate.**
   B → B′ moved three numbers by changing a grid's dimensions and
   empty-cell ratio alone, with no change to colour or geometry. The
   next round should measure a mosaic's cell count and fill ratio
   before building the surrounding chrome.
6. **Do not chase the references' 18.4% median as a target.** §1's own
   census shows a meaningful share of that number is photography this
   app cannot and should not have. The real ceiling is what taxonomy
   (2) and (3) can reach on this app's actual content, which this
   arm measured at 15–20% per screen — already past the 10% floor,
   and the more honest number to aim the next round at.

## Doğrulanamayanlar

- **Comrie (1976), *Aspect*, and Reichenbach (1947), "The Tenses of
  Verbs," are cited from secondary WebSearch synthesis, not read
  directly.** Every host that would carry them —
  `researchgate.net`, `archive.org`, `sfu.ca`, `academia.edu`,
  `teachingenglish.org.uk`, `lingolia.com` — returned
  `EGRESS_BLOCKED` for both `WebFetch` and any attempted direct
  retrieval. The synthesis was cross-checked across independently
  worded queries and converged consistently (three-point notation,
  the anteriority/simultaneity relation symbols, the
  static/dynamic-energy distinction), which is why it is marked
  `[≈]` rather than discarded, but the primitives in §4 should be
  confirmed against Comrie's own figures on an open machine before
  a diagram spec is written from them.
- **Quirk et al., *A Comprehensive Grammar of the English Language*
  (the standard descriptive-grammar reference for exactly this
  register of exam) was searched for but returned nothing usable** —
  every result was a graded-learner site, not the source. Whether
  Quirk's own tense figures use the same line-and-point convention as
  the ELT-classroom tradition is unconfirmed.
- **The "exam's own artifact as a surface" candidate (§3) was reasoned
  about but not built.** A specimen — e.g. a cloze-blank pattern or an
  answer-grid texture rendered as a filled plate — is the natural next
  test and was left out only for time, not because it measured
  poorly; it never got the chance to.
- **Only one counter-plane hex was tried** (`#6F6156`). Whether a
  cooler or more saturated value holds the same 1–1.5 point
  dark/light stability is not tested — the mechanism (a fixed,
  theme-independent value) is the finding, not this specific colour.
- **The Turkish-uppercasing defect this arm shipped and then fixed
  in its own specimen** (`PAST SİMPLE` from a missing `lang="en"` on
  `.eyebrow`) was caught by the coordinator's review, not by this
  arm's own process. Worth flagging as a general note for future
  specimen-building sessions: a visual review of a rendered PNG does
  not catch this class of bug reliably — `grep` for elements with
  `text-transform:uppercase` lacking a `lang` attribute would, and
  did, once pointed at it.
