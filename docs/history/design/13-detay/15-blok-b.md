# Paragraph completion does not fit a phone, measured

`10-sentez.md` §5 lists this as gap 6, from arm 7's measurement: a
99-word stem rendering 784 px over 28 lines at 320 px, putting the
options below the fold. `docs/exam-spec.md` §Paragraph completion says
the real item is larger than that — **a paragraph of roughly 120 words
with one sentence removed, and four candidate sentences** whose
distractors are all on-topic and all grammatical.

So this is measured with a real item shape: a 120-word paragraph and
four full sentences, set at the type scale from `12-arastirma/07-karar.md`.

## 1 · The item against the shell

The shell takes 144 px (bar 56, action bar 88), so the reading window is
the viewport minus that.

| viewport | window | content | ratio | fits in one view |
|---|---:|---:|---:|---|
| 320 × 568 | 424 px | 1328 px | **3.13 ×** | no |
| 390 × 844 | 700 px | 1104 px | **1.58 ×** | no |
| 768 × 900 | 756 px | 684 px | 0.90 × | **yes** |
| 1280 × 900 | 756 px | 684 px | 0.90 × | **yes** |

At 320 the first option starts **260 px below the fold**; the last
option ends at 1400 px, two and a half screens down.

## 2 · The type scale is not the lever

Dropping the body from 18/28 to 17/24 — which the scale does not permit
for body text anyway — moves the first option from 260 px below the fold
to 162 px below it. The ratio goes from 3.13 × to about 2.9 ×.

**A 10 % change against a 213 % overflow.** Neither the meta tier rising
to 17 nor the two line-height increases from `07-karar.md` change this
picture at all: they touch the bar and the headings, not the stem.

## 3 · Splitting the screen does not rescue it either

Tested the arrangement closest to what the paper does — the paragraph
pinned in its own scroll region, the options scrolling below it —
at three different splits:

| viewport | paragraph pane | paragraph visible | options fully visible |
|---|---|---:|---:|
| 320 × 568 | 40 % | 25 % | **1 of 4** |
| 320 × 568 | 45 % | 28 % | **1 of 4** |
| 320 × 568 | 50 % | 32 % | **1 of 4** |
| 390 × 844 | 40 % | 50 % | 3 of 4 |
| 390 × 844 | 45 % | 56 % | 2 of 4 |
| 390 × 844 | 50 % | 63 % | 2 of 4 |

At 320, every split shows one option and a third of the paragraph. There
is no share that helps, because 1328 px of content in a 424 px window is
not an arrangement problem.

At 390 a 40 % split is genuinely better than scrolling — three options
and half the paragraph at once — and that is worth knowing.

## 4 · What is actually different about this item

Every other question type in this app fits the window: a cloze sentence
and its four short options, a restatement and its four sentences. This
one does not, and the reason is that **it is the only item where the
learner must compare four long candidates against a long text**. That is
roughly 190 words that have to be simultaneously available.

On the exam this is free. The paper is A4, the eye moves, everything is
in view. **The app cannot reproduce the exam's reading conditions for
this item type on a phone**, and no layout decision changes that.

Two things follow that are worth separating carefully.

**Scrolling is not itself a violation.** The app's rule is that the
fixed-height shell holds and that answering never moves the button the
learner is about to tap — not that every screen fits in one view. A
lesson already scrolls. At 390 × 844 this is one scroll, which is
ordinary.

**But losing simultaneity is a real comprehension cost**, and it is
specific to this item type. The learner who cannot see the paragraph
while reading option C is doing a harder task than the exam sets — extra
working-memory load the paper does not impose. That is the opposite
direction from what the fidelity argument in `02-sinav-artefakti.md`
wants.

## 5 · The options, with their costs

1. **Scroll, and accept it.** Zero cost to build, honest at 390, poor at
   320. The learner does more work than the exam asks.
2. **A 40 % split at ≥ 390, plain scroll below that.** Measured to show
   three options and half the paragraph at once. Costs a container type
   the section grammar does not have (arm 7 named it `reference`), and
   the breakpoint is a new one.
3. **Two-phase — read, then reveal the options.** Closest to honest about
   the memory load, and it is what the exam implicitly requires anyway.
   But `docs/app1-final.md` §7 refused added ceremony, and it breaks the
   one-tap model every other item type shares. This is a product
   decision, not a design one.
4. **Shorten the paragraphs below the exam's 120 words.** Would make the
   practice easier than the exam. Fidelity argues against it and so does
   the content brief; the measured requirement is roughly halving both
   the paragraph and the options, which produces a different item type.
5. **Let the wide layout carry it.** At 768 and above the whole item fits
   in one view at 0.90 ×. This is the first screen where `§7.3`'s second
   column is not a bonus — arm 7 reached the same conclusion for reading
   comprehension from the other direction.

## Öneri

1. **Write the ratio into `docs/exam-spec.md` beside the item
   description**, so whoever builds Block B starts from 3.13 × rather
   than discovering it.
2. **Take option 1 at 320 and option 2 at ≥ 390**, if a decision is
   needed now: scrolling is within the rules, and the split is a
   measured improvement exactly where there is room for it. Option 3 is
   the one worth putting to the owner, because it is a product question
   about whether this item type gets its own flow.
3. **Do not solve this with type.** The lever is worth 10 % against a
   213 % overflow and it costs the scale its consistency.
4. **Treat 768+ as where this item reads correctly**, and say so rather
   than pretending the phone case is equivalent.
5. **Build one real item before deciding.** Everything here is measured
   against a constructed 120-word paragraph matching the spec. A real
   one from the corpus may run longer, and the four candidate sentences
   are the part most likely to grow.

## Doğrulanamayanlar

- **The item is constructed, not real.** No paragraph-completion content
  exists in `data/` yet (task #48). The paragraph and the four options
  were written to the spec's stated shape — ~120 words, four full
  on-topic sentences — but a real item from the eventual corpus will
  differ, and the four options are the part most likely to be longer.
- **Reading-comprehension load is asserted, not measured.** The claim
  that losing simultaneity costs comprehension is a reasonable inference
  from the task's structure, not a result. The literature that would
  support it sits behind hosts this session cannot reach.
- **320 × 568 is the documented floor, not the common case.** Nothing
  here says how many learners actually use a 320 px-wide viewport; the
  app verifies at that width by rule. The 390 numbers are the ones that
  describe most phones.
- **Safe-area insets are not included.** Chromium in this container
  reports zero regardless of emulation profile, which arm 7 also
  flagged. A real notched phone loses more of the window than these
  numbers show, making the 320 case worse rather than better.
