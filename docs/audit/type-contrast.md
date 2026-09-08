# The owner's report, measured

2026-09-08. The owner said:

> *"Bence tasarım mükemmel, sadece bazen hiyerarşi ya da küçük puntoları
> hızlı bir refleksle atlayabiliyorum dikkatli okumadığım zaman."*

Skimming past hierarchy and small type when reading quickly rather than
carefully. This document measures that against the real stylesheet, and
finds it is not a matter of taste: **the palette lowers contrast exactly
where the type gets small, which is the opposite of what APCA requires**,
and the CI check that measures every colour cannot see it.

---

## 1 · What is actually on screen

Every size in `css/style.css` comes from a token — seven steps, no
improvisation, one stray `17px`. The scale is disciplined. The problem is
not the scale; it is **which colour each step is paired with**.

Measured with the project's own `tools/color.mjs`, against
`--c-surface-2`, which is the lightest surface any of these can sit on:

| class | px | weight | token | APCA Lc | needs | |
|---|---|---|---|---|---|---|
| `.t-display` | 28 | 400 | `text-1` | 91 | 60 | ok |
| `.t-title` | 22 | 400 | `text-1` | 91 | 65 | ok |
| `.t-lead` | 19 | 400 | `text-1` | 91 | 75 | ok |
| `body` | 16 | 400 | `text-1` | 91 | 85 | ok |
| `.t-ui` | 15 | 400 | `text-1` | 91 | 90 | ok |
| `.t-ui` on `text-2` | 15 | 400 | `text-2` | 75 | 90 | **short by 15** |
| `.t-meta` | 13 | 400 | `text-3` | 60 | 100 | **short by 40** |
| `.t-label` | 11 | 600 | `text-3` | 60 | 100 | **short by 40** |

**The shape of the table is the finding.** Everything set in `text-1`
clears its requirement with room to spare, at Lc 91, whatever the size.
The failures are all in one place: the app switches to a *weaker* colour
as the type gets *smaller*. APCA's whole model is that the required
contrast **rises** as size and weight fall. This palette lowers it.

`.t-label` is the sharpest case, because of what it is for. It is the
**block label** — a hierarchy signal, the thing whose entire job is to
tell the reader what kind of block they are looking at. It is rendered at
**11px in the weakest text colour in the palette**, which is to say: the
signal that marks hierarchy is drawn in the least noticeable way the
design system makes available. A fast reader skipping it is the system
working as built.

**A caveat on the `needs` column.** Those figures are APCA's font lookup
table as I hold it, and the exact cells should be checked against the
published table before anything is solved against them. Nothing in the
finding depends on the exact numbers: the direction (smaller needs
*more*) is not in dispute, and the gaps here are 15 and 40 points, not
one or two.

---

## 2 · Why `npm run color` passes

`tools/palette.mjs` measures **every token against the worst surface it
can sit on**, and each token carries a fixed requirement — `text-3` needs
Lc 60, and it delivers Lc 60. Every token passes. The check is honest and
it is green.

But **the defect does not live in a token. It lives in a pair** — a
token rendered at a size. `palette.mjs` never sees a size, so it cannot
see the pairing, and 1,520 browser checks do not look at contrast at all.

This is the same shape as three earlier findings in this repository: a
check that passes because it measures the wrong unit. The coverage test
asserted "seven of ten" and *locked in* the bug it was supposed to catch.
The service-worker cache name passed its test while deleting the
learner's content on every deploy. A check that fires on correct content
is worse than no check — and so is a check that cannot fire on incorrect
content.

**The fix is to make the check measure pairs**, and to let it fail. §4.

---

## 3 · The design system predicted this, and prescribed the answer

This is the part worth reading twice. `docs/design-system.md` §"What is
still unsettled" already contains both of the owner's requests, written
before he made them.

On hierarchy, item 4:

> **Three text tiers this close in lightness** is what APCA demands on
> dark, but it has not yet been tried by a learner in a dark room. **If
> the hierarchy reads flat, the answer is more size and weight
> separation, not dimmer greys.**

That condition has now fired. The owner is the learner, he has used the
app for weeks, and he reports the hierarchy reading flat under a fast
skim. **So the remedy is not mine to invent — the spec pre-committed to
it: more size and weight separation, not dimmer greys.**

And on the light theme, item 5:

> **Dark mode is worse for reading for most people.** NN/g's review of
> the Piepenbrock studies found light mode won on both visual acuity and
> proofreading, for young and older adults alike, **with the gap widening
> as type got smaller** — and **participants reported no perceived
> difference while performing worse**. […] If a light theme is ever
> wanted, the token architecture makes it a one-file change — the values
> would be new, not inverted.

Two things follow. First, the request for a bright mode is cheap by
construction: the tokens are solved, not hand-picked, so a light palette
is a second `SPEC` block, not a redesign. Second — and this is the
uncomfortable one — *"participants reported no perceived difference while
performing worse"* **is exactly the report being made here**: the design
looks perfect and the small type is being missed. That is the documented
signature of the condition, not a coincidence, and it means the light
mode is not only a preference. For small text it is a legibility measure.

---

## 4 · What follows

Not implemented in this document; recorded so the order is deliberate.

1. **Teach `npm run color` about size.** Extend `palette.mjs` from
   token-against-surface to **pair-against-surface**: a declared list of
   (class, px, weight, token) with the APCA font-table requirement for
   each. It will fail on the three rows above the day it lands, which is
   correct — so it ships as a **ratchet first**, reporting a backlog that
   can only shrink, and graduates to an error at zero. That is the
   pattern this project already uses for `checkNotationGlossed`.
2. **Fix the pairs, by the spec's own rule.** More size and weight
   separation, not dimmer greys. Concretely that means the secondary
   tiers stop buying their quietness with contrast, and buy it with size,
   weight, spacing and position instead — the signals that survive a
   skim. Which of those survive best is what
   `docs/research/ui-improve.md` is measuring.
3. **The light mode**, as a second solved `SPEC`, verified by the same
   tool at the same bar.
4. **The readable mode**, which is a different question from the light
   one and should not be folded into it.

**Nothing here should ship during an exam week.** `test` is what Pages
serves, a push is a deploy, and this touches every screen at once.
