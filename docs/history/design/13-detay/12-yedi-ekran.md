# The seven screens nobody has looked at

Closes gap #4 of `10-sentez.md` §5. Round two built two specimens — a
grammar diagram for the lesson reader, a record mosaic for the
entrance — and left seven screens untouched: the quiz question, the
answered question, results, the topic list, the topic overview,
Profil, and the first run. This document inventories all seven,
argues mid-tone in or out for each, and builds and measures
specimens for the three the learner sees most: the quiz question, the
answered question, and results.

Every specimen uses the dark surface ladder solved in
`12-arastirma/07-karar.md` §2 (`surface-0` … `surface-4`, ink tiers
`text-1/2/3`) and the counter-plane solved in `11-karsi-duzlem.md`
(`#7E7266`, fixed across both themes). The light theme keeps its
existing three-step ladder, because `08-iki-tema-asimetrisi.md` found
that ladder cannot grow — the light theme's whole mid-tone budget has
to come from non-surface, non-text sources, which is exactly what the
counter-plane is. Code: `13-detay/12-ornekler/*.html` (source, one CSS
custom-property block per theme, generated from
`tools/*` values by hand-transcription — see
`## Doğrulanamayanlar`), rendered to `*.png` at 390×844 with Chromium
(`executablePath: /opt/pw-browsers/chromium`). Measured with
`docs/design/measure-screens.py` and `docs/design/midtone.py`, both
[S] against this repo's own copies. Contrast checked with
`tools/color.mjs`, called directly [S].

## 1 · Method note: what "belongs" is decided against three things

Every judgement below weighs the same three constraints, so they are
stated once:

1. **The text-legibility ceiling.** `11-karsi-duzlem.md` §5 measured
   that the accent pair and `ok`/`no` fail 3:1 on the counter-plane in
   both themes, and that white and near-black marks clear only
   4.0–4.4:1 — short of this app's own Lc90+WCAG7 bar, and short even
   of literal WCAG AA 4.5:1 for normal text. Re-verified here directly
   with `tools/color.mjs`: white ink `#F4F7FB` on `#7E7266` is WCAG
   4.36, APCA Lc −72.5; near-black `#0D1116` is WCAG 4.05, Lc 30.9.
   **No text of any colour goes on the counter-plane in this
   document.** It is a graphics-only field, exactly as round two
   found, and every specimen below was built to keep it that way and
   then checked by pixel sampling (§6).
2. **Exam fidelity and no added ceremony.** `06-rakip-analizi.md`
   Öneri #1 and `app1-final.md` §7 both point the same way for the
   screen the learner is answering on: the thing that reads as
   professional is resemblance to the İYS paper, not decoration on top
   of it. A field competes with that directly on the one screen where
   it matters most.
3. **The gates**, from `00-v4-olcumu.md` via `10-sentez.md` §6: mid-tone
   population ≥ 10 % (CIE L\* 0.30–0.70) and at least one measurable
   colour family ≥ 1.5 % of frame, in both themes. The entrance's own
   ≥ 20 % event-area gate is specific to the entrance screen
   (`00-v4-olcumu.md`: "giriş ekranında olay alanı") and is not
   re-applied here; the other two are treated as per-screen, because
   that is what closing this gap means.

## 2 · Inventory: what is actually on the other four

Read from `js/home.js`, `js/education.js`, `js/profile.js`,
`js/onboarding.js`, and `docs/design-system.md` §0.1/§7. Not built as
specimens — reasoned from the real render functions and the component
table instead, which is enough to answer "does mid-tone belong here",
even without a screenshot.

### 2.1 The topic list (Test tab, `#topic-list`)

**What's on it.** A root screen: bar (56px, no back, trailing profile
control), then one `.surface.hero` card ("Sınav gibi / Karışık test",
an orb, two lines of body prose, a question-count listbox, one filled
button — `renderMixedTest`, `js/home.js:198`), then — when the learner
has enough history — a weak-spots section (`renderWeakSpots`), then
the topic list itself, grouped by tier, each topic a `.row`: a
monogram, title, subtitle ("24 soru · 6 ders"), an optional "Yeni"
chip, an accuracy percentage, a chevron (`renderTopicRow`,
`js/home.js:342`). Foot: the tab bar capsule, 64px + 12px inset.

**Budget.** Body = viewport − 56 (bar) − ~88 (capsule + inset) ≈ 424px
at 320×568, ≈ 700px at 390×844. Today's ink is the hero card's orb
wash plus row text; everything else is page.

**Judgement: mid-tone belongs on the hero card, not on the rows.**
The hero already has an orb (`--orb`, a radial accent wash) — that is
already an "event", already the app's own established device for
"this card is different in kind from what's below it", and round
two's entrance specimen used exactly this device. Extending it costs
nothing new. The rows are a scannable list (§7.1: "homogeneous,
scannable content is rows separated by hairlines") and a field behind
a list of things to tap is the same mistake the quiz question would
be making — it competes with scanning, not with reading, but it is
still the wrong plane for a control the learner is about to activate.

**Spec, where it belongs.** The monogram already carries hue per topic
(`hueOf`, `js/topics.js`) — that is the mosaic technique, already
shipped, one cell per topic instead of per day. It does not need the
counter-plane. What the counter-plane can add here is structural: the
hero card's `.hero__orb`, currently a soft accent wash behind the
icon, could sit on a counter-plane base layer (graphics-only, no text
crosses it — the orb is `aria-hidden`) so the card's identity mark
reads as a plane rather than a glow. Small area (the orb is roughly a
quarter of the card), so on its own this does not clear the 10 %
gate — it is one contributor among several, consistent with §2.5's
finding that no single screen clears the gate from one device alone.

### 2.2 The topic overview (`#egitim/konu/<id>`)

**What's on it.** A child screen, reached from the topic list: bar
(56px, back = "Konular", trailing "3 / 6"), then pure prose —
"Genel bakış" label, an `<h1>` title, running Turkish explanation,
worked English examples, a "Parçaları" list, up to three more prose
sections ("İngilizcenin istediği seçim", "Bu konudaki dersler",
"Sınavda"), then the lesson rows themselves (`renderIntro`,
`js/education.js:923`). On the wide layout this is the one screen
where the split runs prose-first (`split--main-first`, §7.3) because
the six lesson rows are what the learner came to choose from. Foot:
the tab bar (this is still inside Eğitim's own navigation, not the
focused reader — `closeReader()` in `js/education.js` explicitly
"restores the app header and bottom nav").

**Budget.** Same envelope as 2.1. Ink today is close to 100 % of the
scroll region's height, because this is the single longest run of
continuous prose in the app outside the lesson reader itself.

**Judgement: no.** This is a reading surface, word for word the same
case the lesson reader itself already settled in round two
(`10-sentez.md` says the reader "has no pane at any width and that is
a decision"). Every paragraph on it needs the Lc90+WCAG7 bar the
counter-plane cannot clear. The one non-text element is the lesson
rows' leading slot, which is currently blank in `renderLessonRow` (no
monogram, unlike the topic row) — that is a legitimate, tiny target
for the same counter-plane treatment given to rings elsewhere (§4.3),
but it is a few dozen pixels per row and does not change the verdict:
this screen's job is comprehension, and a field competes with it.

### 2.3 Profil

**What's on it.** Opened from the header, not the tab bar (settled,
`CLAUDE.md`). Bar, then a `.surface.hero` identity card — avatar, name
(editable field), a countdown line, the same orb device as the topic
list (`renderIdentity`, `js/profile.js:58`) — then "Hedefin" (two
rows: exam date, daily goal), "Genel durum" (two rings — completed
lessons, recent accuracy — plus a 3-up stat grid: streak days, tests
solved, questions solved; `renderStats`, `js/profile.js:177`), a weak
list, data/export rows, theme and settings rows, coverage, about.

**Budget.** This is the longest screen in the app by section count —
eight-plus sections in one scroll region — so unlike the topic
overview its ink is naturally spread rather than continuous: rings,
short stat figures, and rows, with real gaps between sections (48px
above each head per §0.2).

**Judgement: yes, on the identity card and the rings; no on the
settings rows.** The identity card is the same case as the topic
list's hero — an orb, already established, extendable to a
counter-plane base with no text crossing it. The two rings in "Genel
durum" are exactly the ring-track case built and measured for results
(§4.3) and transfer unchanged: the track is a closed graphic, the
number sits in its empty centre, never on the stroke. The settings,
data-export and about rows are controls and are again the "list of
things to activate" case from 2.1 — plain.

### 2.4 The first run (`#hosgeldin`)

**What's on it.** Four steps, no chrome (`js/onboarding.js`), each
its own screen with a top progress row (`onboard__steps`, four dots)
and two actions. Step 1 (`stepWelcome`) is a centred title over
`.onboard__orb` — a 64px book icon inside an animated glow — and two
lines of Turkish. Steps 2–4 ask the exam date, the daily goal (a
`choices` grid, cards) and the name.

**Budget.** Full-height, no bar, no tab bar — the one screen in the
app with the whole viewport to itself. At 320×568 this is roughly
500px of body after the step dots and the two-action footer; at
390×844 roughly 740px.

**Judgement: yes, on the welcome step's orb; no on steps 2–4.** The
welcome step is a pure identity moment — a mark and two lines, nothing
to scan or answer — and it already animates a glow
(`07-karar.md` confirmed this animation sits inside the
`prefers-reduced-motion: no-preference` guard, so it is not the "SC
2.2.2 uncontrolled" defect an earlier arm reported). A counter-plane
disc behind the icon, sized generously since this is the one screen
with room to spend, is the cleanest single opportunity in the whole
app: full-bleed, no text within it (the icon is `aria-hidden`), on the
one screen where "no added ceremony" does not apply because there is
no exam simulation to protect — this is the app introducing itself,
once. Steps 2–4 are a date field, a card-choice grid and a text field
— controls, same as 2.1 and 2.3's settings rows. No.

### 2.5 What the inventory says before any specimen is built

Four of seven screens split the same way: **a hero/identity card and
a ring get the counter-plane; a list of things to tap, and continuous
prose, do not.** That is not a coincidence of these four — it is the
same rule the three built specimens land on independently (§3–5): the
counter-plane goes where there is a closed, non-text graphic already
present (an orb, a ring, a mosaic), and nowhere there is a control to
activate or a sentence to read. The quiz question and the topic
overview are the strictest instances of "no"; the first run's welcome
step is the least constrained "yes" in the whole app, because it is
the one screen with nothing to protect.

## 3 · The quiz question (unanswered)

`js/quiz.js`, `js/answers.js`. Bar (56px): "Çık", the test's name,
"n / total"; a progress line along the bar's bottom edge. Body: one
`.quiz__prompt` card (category label, then the cloze sentence at
22/28 with a `.blank` rule), then four `.option` cards, each a
56px-minimum row with a numbered key and the English answer in serif.
Foot: `.shell__bar`, a hint ("Bir seçenek seç") — no button yet,
because nothing is chosen.

**Budget, measured from the specimen at 390×844:** bar 56px, foot
~96px (52px button height + 2×8px pad + a 20px safe-area allowance),
body ≈ 692px. The prompt card and four options together measure
≈ 450–470px including gaps. **That leaves roughly 220–240px, a third
of the scroll region, empty below the last option** — visible
directly in the composition bands below.

### 3.1 Judgement: no, argued three ways

1. **Exam fidelity.** `06-rakip-analizi.md`'s single highest-value
   finding is UWorld's: the way a study product reads as serious is
   fidelity to the paper, not restraint added on top of it. A cloze
   item on the İYS paper is black type on white paper. A field behind
   it is the one thing the reference does not have.
2. **The text bar.** The cloze sentence is the single most important
   string on the screen and needs Lc90+WCAG7. §1 above re-confirmed
   the counter-plane cannot carry it in either theme — this is the
   literal case the brief names: *"a field behind a question may be
   exactly wrong."* It is.
3. **"No added ceremony."** `app1-final.md` §7 refuses decoration on
   the answering screen specifically. A card the learner reads once
   and answers does not need a backdrop; it needs to be readable fast.

### 3.2 Measured

| | dark | light |
|---|---:|---:|
| mid-tone (CIE L\* 0.30–0.70) | **1.7 %** | **2.0 %** |
| colour family ≥ 1.5 % | none | none |
| event area | 5.2 % | 4.5 % |

Both gates fail, in both themes, by design. This is not an
accident of a plain specimen — it is the same order of magnitude as
v4's own worst screens (`00-v4-olcumu.md`: 8 of 9 screens scored zero
measurable colour family), reproduced here on purpose, with the
counter-plane available and *declined*. That is what "rejecting is a
result" means for this screen: the tool was in reach and the
measurement says not to use it.

### 3.3 Composition (§6, task 6)

Eight 105px bands, event-area share per band, dark theme:

```
band 1 (  0- 105px)  6.8%   ####            bar + card head
band 2 (105- 210px)  7.7%   #####           prompt sentence
band 3 (210- 315px) 13.7%   ########        prompt sentence, options begin
band 4 (315- 420px)  0.5%                   option cards (plain, low contrast to ground)
band 5 (420- 525px)  1.4%   #
band 6 (525- 630px)  2.2%   #
band 7 (630- 735px)  0.0%                   dead
band 8 (735- 844px)  0.9%   #               hint bar
```

**Top-heavy, with a dead lower third.** Bands 4–8 (420px of a 844px
frame, exactly the bottom half) carry almost no measured event at all
— the option cards themselves sit too close to the ground colour to
register as "departing from it" under the same 0.25-OKLab-L threshold
`measure-screens.py` uses everywhere else in this research. This is
the numeric form of "yavan" applied to a single screen: it is not
that the screen is empty, it is that everything on it is close enough
in lightness to the page that nothing beyond the first two elements
reads as separate from it.

## 4 · The answered quiz question

Same screen, `state.answered = true`. The chosen option ("am
thinking") gets `.option--no` (red tint, 1.5px edge, a close glyph);
the correct one ("think") gets `.option--ok`. Below the options, one
`.feedback` block: a verdict line (glyph + "Yanlış"), "Doğru cevap:
think", the explanation, the note for the option actually chosen, the
rule ("Kural: …"), and the quiet report link — four redundant
channels for the verdict, per `js/feedback.js`'s own stated reason
(WCAG 1.4.1). Foot: now a filled button, "Sonraki soru".

### 4.1 Judgement: still no, and for a stronger reason

Everything in §3.1 applies again, plus: the feedback block is now the
single densest piece of reading on the screen — an explanation, an
option-specific note and a rule, stacked, at 18/28. Putting *more*
text under time pressure onto a surface that cannot clear the reading
bar is a worse trade than doing it on the empty prompt, not a better
one. The one thing that changes between §3 and §4 is that the
options themselves now carry real colour (`ok`/`no`, already shipped,
not new) — which is why the measured numbers move even though nothing
was added on purpose.

### 4.2 Measured

| | dark | light |
|---|---:|---:|
| mid-tone | **3.0 %** | **8.7 %** |
| colour family ≥ 1.5 % | H60 4.7 % | H30 5.3 % |
| event area | 14.2 % | 12.6 % |

Both fail the 10 % mid-tone gate; light comes within 1.3 points of it
on the *shipped* `ok`/`no` and amber alone. That is a finding in its
own right (§5.4).

## 5 · Results

`js/results.js`. Bar: "Sonuç", no lead/trail — the way back is the
action bar, not the header. Then, on a phone, one column in this
order: the score (`.score` — a mode label, a large ring, a one-line
verdict, a percentage), the per-topic and per-category breakdowns
(rows, each with a small ring), a mistake-book shortcut when there is
one, then the review — every question again with its explanation,
the longest reading surface in the app (`renderReview`). Foot: "Ana
sayfa" / "Yeni test".

### 5.1 Judgement: yes — this is where the budget belongs

Three reasons, all already in the research this round inherits:

1. **`06-rakip-analizi.md` Öneri #5**, unactioned for six weeks:
   *"spend the ornament budget on the record, not on reward."* The
   result screen is exactly the record.
2. **No text crosses the plane.** Every ring's value sits in the
   stroke's own empty centre (confirmed by pixel sample, §6); a
   verdict mosaic of small marks needs no caption printed on top of
   it, only above it — the same layout round two's entrance specimen
   already used.
3. **There is no exam-fidelity argument against it here.** The
   learner has already finished answering. The screen's job changes
   from "answer under time pressure" to "understand what happened",
   and richness earned from the learner's own history was ranked the
   second-highest-value unspent idea in `06-rakip-analizi.md` six
   weeks ago.

### 5.2 What fills it, specifically

- **Ring tracks → counter-plane.** Every ring on this screen (the
  large score ring, and the small per-row rings in both breakdowns)
  draws its *unfilled* arc in `--counter` instead of `--raised`. This
  is a one-line token change on an existing, shipped component (#19
  Ring in §7's table) — not a new element.
- **A practice-record band, full-bleed, counter-plane fill.** One row
  of cells, one per question in the session, filled `ok`/`no` — the
  learner's own verdicts, not an invented streak. This is round two's
  mosaic technique, on real per-session data instead of synthetic
  weekly history, sitting on the counter-plane as its background
  rather than on the page: the counter-plane carries the field, the
  cells carry the only chromatic marks on it, and no text sits inside
  the band — the caption ("Bu testte · 10 soru") is a separate line
  above it. This is the single largest legitimate use of the
  counter-plane found in this round, by area (§5.3).
- **What did not go in:** a "typographic plate" (the fourth technique
  the brief allows) was considered for the score's verdict word
  ("İyi gidiyor") and rejected — that word is content, needs the
  reading bar, and the plate would be the exact "field behind a
  question" mistake §3.1 argued against, one screen later.

### 5.3 Measured

| | dark | light |
|---|---:|---:|
| mid-tone | **5.5 %** | **10.5 %** |
| colour family ≥ 1.5 % | H60 3.5 % | H30 3.2 % |
| event area | 11.7 % | 11.1 % |

**Light clears the 10 % gate; dark does not.** This is not a
specimen-building shortfall — it is the same asymmetry
`08-iki-tema-asimetrisi.md` predicted from the other direction,
arriving with an unexpected sign. §5.4 explains why.

### 5.4 The finding this specimen adds to the asymmetry

Computed directly (`docs/design/midtone.py`'s own CIE L\* formula):
the shipped **light accent** (`#a05801`) has **L\* 0.449** — inside
the mid-tone band on its own — while the shipped **dark accent**
(`#f1af5d`) has **L\* 0.762**, eight points outside it. So in the
light theme, the primary "Yeni test" button and the accent-toned
ring fill are *already* mid-tone before the counter-plane contributes
anything; in the dark theme the same elements sit just past the
band's edge and do not help. `08-iki-tema-asimetrisi.md` established
that the two themes cannot share one mechanism because their
text-bearing bands differ by 19 points; this specimen shows the same
non-mirroring one level down, in a place nobody had reason to check
before measuring it: **the one already-shipped colour token that
happens to double as "mid-tone furniture" is a light-theme-only
accident, not a designed one.** It is not something to fix — the
accent's value is solved against a contrast requirement, not against
this metric — but it is worth writing down so a future round does not
mistake dark theme's shortfall for a specimen problem when it is a
token-geometry fact.

For completeness, the equivalent `ok`/`no` figures: dark `ok`
(`#7ccd8e`) L\* 0.760 — outside the band; dark `no` (`#e97871`) L\*
0.633 — inside; light `ok` (`#1f8944`) L\* 0.502 and light `no`
(`#d14b48`) L\* 0.508 — both inside. A verdict mosaic in the dark
theme is therefore *already* lighter-weighted toward its "no" cells
for mid-tone purposes than its "ok" cells, before any design choice —
another asymmetry worth carrying into the next round rather than
re-discovering.

### 5.5 Composition

```
band 1 (  0- 105px)  0.9%                    bar, title only
band 2 (105- 210px)  6.8%   ####             ring appears
band 3 (210- 315px)  8.2%   #####            ring, verdict text
band 4 (315- 420px)  2.6%   ##               percentage, caption
band 5 (420- 525px) 20.8%   ############     record band (new)
band 6 (525- 630px) 26.1%   ################ breakdown rows begin
band 7 (630- 735px)  4.5%   ###
band 8 (735- 844px) 20.2%   ############     action bar
```

**Bottom-half-heavy, and evenly spread rather than top-loaded** — the
opposite shape from the quiz question. Bands 5–6 (the new record band
plus the start of the breakdown rows) are the densest quarter of the
screen; band 1, the bar itself, is nearly empty, which is correct —
a bar with only a centred title has nothing to be denser than. There
is no dead zone of the kind §3.3 found; the closest thing is band 7
(4.5 %), which is the gap between the second breakdown row and the
review heading, a single section boundary rather than idle space.

## 6 · Self-check: the two defects round two caught

**Text on an illegal surface.** Pixel-sampled directly from the
rendered PNGs (not just computed from the authored hex, so this
catches any unintended blending):

- `results-dark.png`, the ring value "7 / 10" at its expected centre
  pixel: sampled `rgb(13,17,22)` = `#0D1116`, the page ground — not
  the counter-plane. Confirmed at two sample points inside the value's
  bounding area.
- `results-dark.png`, the record band at y = 527 (inside the band,
  between cells): the background pixels sample to exactly
  `rgb(126,114,102)` = `#7E7266`, confirming the fill rendered as
  authored with no compositing surprise, and that this pixel carries
  no text — it is the gap between two `ok`/`no` cells.
- Every text/background pair actually used was additionally run
  through `tools/color.mjs`: `ink-1` on the feedback block's blended
  tint samples to `#2C1F22` (dark) / `#F1DCD4` (light) and clears
  WCAG 14.74 / 12.93 and APCA 99.9 / 85.8 — both comfortably above
  this app's own Lc90+WCAG7 bar. `accent-text` (the `.t-label` colour,
  corrected below) clears WCAG 9.4–12.8 in both themes. No pair
  measured below the app's existing bar; none was expected to be, since
  none of them touch the counter-plane.
- One authoring error caught and fixed in the process, worth
  recording because it is the kind of drift the brief warns about:
  the first draft coloured the quiz category label and the results
  section heads with `--ink-3` (grey) instead of `--accent-text`,
  which is what `.t-label` actually resolves to in `css/style.css:1809`
  (`color: var(--accent-text)`). Grey would have under-reported the
  screens' true colour-family share; fixed before the numbers in §3–5
  were taken, and re-measured after the fix (the tables above are
  post-fix).

**`lang="en"` on uppercased English.** Every English string that is
either uppercased by CSS or spoken has an explicit `lang="en"` in the
specimen source: the quiz category label ("PRESENT SIMPLE VS PRESENT
CONTINUOUS" — checked by eye in the render, the capital I in
"SIMPLE" is a plain I, not a dotted one, because `lang="en"` on that
exact element overrides the page's `lang="tr"` for case mapping), the
option text, "Doğru cevap: think", the topic names in the breakdown
rows, and the review's "Cevabın:" / "Doğrusu:" answers. Verified by
`grep -c 'lang="en"'` against every English-bearing element in
`13-detay/12-ornekler/*.html` — each of the six files carries one
`lang="en"` per English string, none missing.

## 7 · Summary table

| screen | mid-tone dark | mid-tone light | colour family | verdict |
|---|---:|---:|---|---|
| quiz question | 1.7 % | 2.0 % | none, either theme | **no** — exam fidelity, text bar |
| quiz answered | 3.0 % | 8.7 % | yes, both | **no** — same, plus denser text |
| results | 5.5 % | **10.5 %** | yes, both | **yes** — record + rings |
| topic list | not built | not built | — | **partial** — hero yes, rows no |
| topic overview | not built | not built | — | **no** — pure prose |
| Profil | not built | not built | — | **partial** — hero + rings yes, settings no |
| first run | not built | not built | — | **partial** — step 1 yes, steps 2–4 no |

Only results clears the 10 % gate, and only in the light theme.
That is the honest ceiling this round found for the three
highest-traffic screens: two of three take a **measured, argued "no"**
on mid-tone, and the one "yes" clears the gate in one theme out of
two. Closing that last gap — a dark-theme device that does not depend
on the accent token's accidental lightness (§5.4) — is now a named,
specific open question rather than an unmeasured one.

## Öneri

1. **Adopt the three-way split found across all seven screens as a
   rule, not a per-screen judgement call.** The counter-plane goes on
   a closed, non-text graphic that already exists in the component
   inventory — an orb, a ring track, a mosaic cell field — and
   nowhere there is a sentence to read or a control to activate. Every
   one of the seven screens sorted cleanly under this rule; write it
   into `docs/design-system.md` next to the counter-plane's own
   definition so a future round does not re-litigate it screen by
   screen.
2. **Ship the ring-track change first.** It is a one-line token swap
   on an existing, already-specified component (#19 in §7's table),
   touches five places in the app (the results score ring, the two
   breakdown row rings, and Profil's two stat rings), and needs no new
   markup, no new copy and no new accessibility contract — the value
   text's position relative to the stroke does not change.
3. **Build the results record band as the next specimen**, not as a
   shipped feature yet: it is the only one of the seven screens that
   clears the mid-tone gate at all, and only in one theme, so the open
   question — a dark-theme-specific device, since the light theme's
   pass rides partly on the accent token's coincidental lightness
   (§5.4) — needs its own round before this is proposed for `test`.
4. **Leave the quiz question and the topic overview alone.** Both are
   measured, argued "no"s, on the same evidence this round used for
   the lesson reader in round two. A ninth round should not re-open
   either without a reason stronger than "the gate isn't met" — the
   gate not being met is the finding, here.
5. **Treat the first run's welcome step and the hero-card orbs (Test
   tab, Profil) as the cheap wins.** All three already have a
   non-text graphic in the shipped app (`.onboard__orb`,
   `.hero__orb`); giving that graphic a counter-plane base is a CSS
   change with no new component and no new copy.

## Doğrulanamayanlar

- **Four of seven screens were reasoned from source, not rendered.**
  The topic list, topic overview, Profil and the first run were
  inventoried from `js/home.js`, `js/education.js`, `js/profile.js`
  and `js/onboarding.js` plus `docs/design-system.md` §0.1/§7, and the
  judgement in §2 is argued the same way §3–5's judgements are argued
  — but it has not been measured, because the brief asks for built
  specimens on "at least" the three highest-traffic screens and this
  round's time went to those three in full rigour (both themes, both
  gates, composition bands, pixel-level defect checks) rather than to
  six shallower ones. If the owner wants numbers rather than reasoning
  for 2.1–2.4, that is the next round's first item, and the source
  citations above (function names and line numbers) are the starting
  point.
- **The specimens use system font stacks, not the shipped subset
  faces.** Source Serif 4 / Source Sans 3 are not available in this
  session's Chromium without `fonts/`'s actual files wired in, so the
  specimens fall back to Georgia/system-ui, matching round two's own
  practice (`03-ornekler/*.html` does the same). This changes glyph
  metrics slightly — line counts and exact wrap points in the prompt
  and feedback text may differ by a line from the shipped app at the
  same width — but does not change any colour, contrast or area
  measurement, which is what this document reports.
- **The generator script (`13-detay/12-ornekler`'s source `.html`
  files) was hand-authored against `css/style.css`'s current token
  values and `07-karar.md`'s solved ladder, not generated from either
  file programmatically.** Every value was cross-checked once against
  its source (quoted inline in §5.4 and §6), but a value transcribed
  by hand is a different risk from one read by a script. If this
  round's numbers are to be trusted for a shipping decision rather
  than for a design direction, re-deriving the specimens' CSS custom
  properties from `css/style.css` and `tools/palette.mjs` directly
  (once the new ladder actually lands there, per `07-karar.md` §5
  item 1) would remove that risk.
- **The event-area gate's per-screen applicability is an
  interpretation, not a re-read of the source.** `00-v4-olcumu.md`'s
  own wording ties the ≥ 20 % figure to "giriş ekranında" (the
  entrance screen) specifically; `10-sentez.md` §6 restates all three
  gates together without repeating that qualifier. This document
  treats mid-tone and colour-family as per-screen and event-area as
  entrance-only, which is the reading that makes "closing gap #4"
  coherent (a gate that only ever applied to one already-solved
  screen would leave nothing to close) — but the source document
  itself should be re-read by the next round to confirm.
- **OLED cost, again.** `11-karsi-duzlem.md` already flagged this and
  it applies with more force here: the results specimen now proposes
  putting the counter-plane's L\* 48.8 fill behind a full-bleed band
  and under every ring track, on the screen shown after *every* test.
  Nobody has measured what that costs on the phone this app is
  actually read on.
