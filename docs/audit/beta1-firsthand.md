# Beta1 — what I saw with my own eyes

2026-09-09. The owner's new direction, in substance: reading is still
not fully fixed — the design is *"stuck between minimalism and
shallowness"*; in light mode the orange does not create contrast; brown
and orange, though nice, go shallow over a long run; he wants the best
palette for both modes, readability and the lesson flows evaluated, and
the whole UI rethought professionally — not a full redesign, but from
scratch — for **beta1, a fully presentable app**.

Three research arms are running (palette, hierarchy/reader, full
screen audit). This file is what I measured and looked at myself before
they landed, so that the synthesis is not made from second-hand reports
alone. Screenshots in
`scratchpad/shots/{dark,light}-{egitim,test,profil,intro}.png` at
390×844.

---

## 1 · The root cause, measured: the interface is one hue

OKLCH hue of every token, both themes (`node` against
`tools/palette.mjs`):

| | dark | light |
|---|---|---|
| surface-0 / 1 / 2 | 67 / 67 / 78 | 78 / 68 / 68 |
| text-1 / 2 / 3 | 75 / 73 / 72 | 75 / 80 / 78 |
| accent · accent-text · on-accent | 72 · 78 · 71 | 72 · 72 · 71 |
| focus · hairline · edge | 78 · 74 · 78 | 78 · 85 · 68 |
| **ok · no** | **150 · 25** | **150 · 25** |

**Every non-semantic token in both themes sits inside 67°–85°.** The
page, the cards, all three text tiers, the accent, the button ink, the
focus ring, the dividers — one warm-orange hue family, differing only in
lightness and a little chroma. Only the two indicators leave it, and
they are forbidden as text.

So hierarchy and depth have exactly one channel, **lightness** — and
`type-contrast.md` already measured that channel as nearly spent on
dark, where APCA forces the three text tiers within 0.156 of L. The
owner's three complaints are one fact seen three times:

- *hierarchy gets skimmed* → the only signal is lightness, and it is
  weak;
- *shallow over time* → no chromatic contrast anywhere; the screen
  could be a sepia photograph;
- *the orange does not pop on white* → the accent is the ground's own
  hue, so on a light page it is merely a more saturated page.

The palette arm is designing a second hue axis. That is the structural
fix and nothing below substitutes for it.

---

## 2 · My own last round made the flatness worse

This needs saying plainly. v0.41–0.42 moved every small tier
(`.t-meta`, `.t-label`, `.row__sub`, `.row__trail`, `.nav__item`,
`.stat__label`, `.chip`, `.btn--quiet`) to **15px / 600 / `--c-text-2`**
so that each pair clears APCA. The pairs check passed. Looking at the
Eğitim index afterwards: the meta sentence, the tier headings, the row
subtitles, the first-run card's two sub-lines and the nav labels are now
**the same size, the same weight and the same grey.** The screen is
uniformly medium-bold. My fix deleted the one axis — weight — that had
distinguished *quiet* from *label*, and the owner's "stuck between
minimalism and shallowness" came right after it.

The measurement could not see this. The pairs check verifies that each
piece is legible; it has no way to notice that every piece became the
same piece. That is the fourth instance in this repository of a check
passing on the wrong unit.

**The constraint underneath is hard**, from the APCA matrix now in
`tools/palette.mjs`: on this dark ground, 15/400 needs Lc 100 and
16/400 needs Lc 90 — only `text-1` reaches either. `text-2` at weight
400 first becomes legal at **18px**. So *"quiet by colour"* does not
exist below 18px on dark. Quietness has to come from size relationship,
position, measure or spacing — or the body size rises so that a 16px
meta tier is a real step below it. That has been sent to the hierarchy
arm as an input it must satisfy through `requiredLc`.

---

## 3 · A presentability defect, found and fixed: stray asterisks

The topic overview for Modals read, in the second sentence, *"o eyleme
dair \*tutumunu\* söyleyen…"* — literal asterisks in the prose. Authors
had used `*emphasis*` in 21 strings across eight topics (`intro.what`,
`intro.choice`, `intro.lessons`, block `body`, `why`, `gloss`), and
`js/dom.js` resolved only `**bold**`. A stranger's first look at any
topic overview met a rendering fault.

**Fixed 2026-09-09.** `appendInline` now resolves both marks in one
pass, longest first; `<em>` is emitted for a screen reader and styled as
a weight step rather than a slant, because no italic face ships
(`fonts/` holds sans 400/600 and serif 400 only). `validate-content.mjs`
walks every string in a topic file and rejects an unbalanced mark of
either kind — the same defence the renderer's comment had always claimed
and the validator had never actually had. Verified: the Modals intro
renders 0 asterisks and 7 `<em>` elements; 161 unit tests and 1,591
sweep checks green.

A related find: **`700` is declared but does not ship.** `.btn--primary`
and `.feedback__verdict` ask for weight 700 and the browser synthesises
it from 600. The primary button's label — the one place APCA's ceiling
on amber forces 16/700 — is therefore a faux-bold. Either ship the 700
subset or stop asking for it; the hierarchy arm is deciding the weight
axis and should decide this with it.

---

## 4 · Screen notes, first-hand

**Eğitim index.** "English Prep" appears twice within 150px — the
header and the first-run card's title. *"Uygulama hâlâ yazılıyor"* on
the first screen is an admission that must not survive to beta1. *"Ya da
kısa bir testle başla"* is a centred, shapeless link; it reads as
something that lost its button. Row subtitles truncate with an ellipsis
at 390px ("görül…", "zoru…") — an ellipsis in the first row of the app
reads unfinished. On dark, `surface-1` barely separates from `surface-0`;
the first-run card is identifiable by its corner radius and nothing
else, which is the design system's own "one card level reads as no
card" risk, realised.

**Light mode.** The amber primary button at L 0.80 on an off-white page
is a pale wash; the 1px inset boundary I added is invisible and the
owner is right that it does not work. The accent has to be a *pair* —
one value per mode — not one value with a border.

**Topic intro.** Typographically the best screen in the app: the
display-size serif English examples with a Turkish gloss beneath are
exactly what the audience statement asks for. Two problems. The two
bottom buttons read **"Derslere dön"** and **"Derslere geç"** — the
same noun, two verbs, and a stranger cannot tell which goes where. And
the *parts* section renders as three label/serif pairs with no visual
grouping, so it reads as a list of six lines rather than three parts.

**Profil.** The name field sits in a card; nothing else on the screen
does. Four stats, then a paragraph, then two full-width secondary
buttons, then more prose — it is a settings page written as an essay.
"—" for accuracy with no history is correct and cold.

---

## 5 · What this file hands to the synthesis

1. The palette must gain a second hue axis (arm 1), and the accent must
   be a per-mode pair.
2. The type scale must be rebuilt with real steps and a used weight axis
   (arm 2), under the hard rule that quiet text cannot be `text-2` below
   18px on dark.
3. Ship or stop declaring weight 700.
4. Beta1 blockers seen so far: the *"hâlâ yazılıyor"* line, the
   duplicated title, the ellipsis rows, the shapeless secondary link,
   the intro's twin button labels, the light-mode primary button.
5. Stray asterisks: fixed, and now a validator error.
