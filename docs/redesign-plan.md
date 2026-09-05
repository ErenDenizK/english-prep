# Redesign plan

Agreed 2026-09-03, after the owner's review of the `v0.11` build: the
architecture is right, the interface isn't. This file is the plan of
record for replacing it. Update it as decisions land — the point is that
the reasoning outlives any one session.

## Scope

**Replaced:** the visual layer (`css/style.css` and the render functions
that build markup for it) and the lesson content format.

**Kept:** the app shell, hash routing, storage, the quiz engine, the 72
questions, the category taxonomy, the validator, the tests and the browser
sweep.

That split is what makes this affordable. Content is data, presentation
is code, and there are 28 unit tests plus a ~150-check browser sweep
(`npm run verify`) to catch what a redesign breaks.

## Diagnosis

The design has **one visual device** — a 1px-bordered, 3px-radius
rectangle — and uses it for every role: container, card, list item, chip,
badge, button, note. Measured on the `v0.11` build: 23 separate
`border: 1px solid` rules and 40 uses of the same amber.

What follows from that:

1. **Nesting becomes literal boxes-in-boxes.** The Test tab renders a
   tier box containing a topic-card box containing category-chip boxes —
   three nested rectangles, with horizontal padding compounding at each
   level, leaving roughly 200px of usable text width on a 390px phone.
2. **Nothing is emphasized, because everything is.** One accent colour
   carrying eight different meanings (accent text, eyebrows, progress,
   primary button, badges, links, active nav, table headings) reads as
   decoration rather than signal.
3. **On a phone the card border is pure loss.** The viewport is already
   the frame; a second frame only narrows the text. The
   "Sık yapılan hatalar" step squeezes its content into a box at the top
   while 40% of the screen below it sits empty.
4. **Density is wrong for a study tool.** The home screen spends about
   60% of its first view on the mixed-test hero — the least-used action.
   Someone opening the app wants to resume, or to drill the thing they
   keep failing.

For lessons specifically, the problem is not only styling. The article
schema's `meaning` and `usage` are three-to-five-sentence Turkish
paragraphs, and on a phone they read as walls of text. The parts that
actually win exam marks — the signal words, the wrong→right pairs, the
recap procedure — are buried inside that prose.

## Decisions

**Lesson format: block scroll.** A lesson is one scrolling page — no
tapping "İleri" eight times — but it is built from full-width visual
blocks rather than paragraphs: a contrast, a wrong→right pair, a rule, an
example, a check. Blocks are separated by rules and whitespace, never by
nested boxes. Check questions appear inline in the flow.

**Palette: dark, settled.** Both a rebuilt dark identity and a
light/paper direction were drawn on the same four screens; the owner chose
dark by looking at them. The tokens were then *solved* against a contrast
requirement in two models rather than picked — see `docs/design-system.md`
§1 and `tools/palette.mjs`, which re-measures every one of them and fails
the build if a value drifts.

**Not reopening** (settled by earlier feedback): the bottom nav with
Profil in the header; checks that never gate progress; no build step and
no runtime dependencies; one category taxonomy shared by lessons and
questions.

## Stages

**0 · Direction.** Mockups at 390px with real Tenses content, in both
palettes, covering the lesson reader, the Eğitim index, the home screen
and a test question. Output: the chosen direction plus a written spec —
tokens, spacing scale, type scale, component inventory.

*This comes first deliberately. It is the third Eğitim redesign
(story-cards → article → this), and each previous one rewrote the content
before the direction was settled. Nobody should write 5,400 words again
against a layout that hasn't been seen.*

**1 · Design system in code.** ✅ *Done.* `css/style.css` rebuilt from
scratch — 881 lines from 1354, five cascade layers, twelve primitives from
45 ad-hoc component roots. The palette is solved rather than picked and
re-measured by `npm run color`. Fonts self-hosted as three subset faces
(46.9 KB), and the icon set hand-drawn to the §6 contract.

*The plan said "apply to the existing screens first so old and new can be
compared". That turned out not to be possible: the rebuild replaced the
class vocabulary wholesale, so there was no intermediate state where both
existed. Stage 2 therefore had to land before anything rendered at all.*

**2 · Screen-by-screen.** ✅ *Done.* Every screen rebuilt on the new
vocabulary, and three hierarchy decisions taken:

- **Eğitim is the default view.** Someone opening a study app wants to
  carry on where they left off, not to be handed an exam. Its index leads
  with overall progress, then the lesson you were in the middle of, then
  the list. The mixed test moved to the Test tab, where it belongs and
  where it is the point rather than the obstacle.
- **A weak spot does different things on different screens.** On Test,
  tapping one starts practice scoped to that category; in Profil, it opens
  the lesson that teaches it. That is what let every row keep a single
  action — the old build had rows carrying a link *and* a button, which is
  a row that cannot be tapped.
- **Results are ranked worst-first.** A breakdown in the order the
  questions happened to come out is a table; in this order it is a reading
  list.

Also in this stage, because they were the same change: the nav became a
landmark with `aria-current` instead of a `role="tablist"`, the
confirmation dialog became a native `<dialog>` (deleting the hand-rolled
focus trap), and `tools/verify-ui.mjs` was written so the browser sweep is
a checked-in command rather than a script each session rebuilds.

**3 · Eğitim: the new lesson model.** ✅ *Done.* A lesson is now
`{ category, summary, blocks }` — seven semantic block types (`text`,
`contrast`, `forms`, `examples`, `pitfall`, `decision`, `check`) — and the
reader holds it as one scrolling page with a sticky header carrying the
way out and the read position. Schema, validator, guide and the two agent
briefs moved in the same change, as the standing rule requires.

Three decisions worth keeping:

- **Reaching the end is what finishes a lesson.** There is no "Dersi
  bitir" button, because a button that only confirms what the scroll
  position already proved is a tap asked for nothing. Progress is stored
  as a read fraction rather than a step index, so it stays meaningful when
  an author adds a block to a lesson someone is halfway through.
- **No action bar in the reader at all.** A filled amber slab pinned under
  every screen is the loudest thing on a surface whose job is to be quiet.
  The sticky header is the way out; the things to do next are at the end,
  where you arrive at them.
- **`tools/format-content.mjs`.** Several sessions write into `data/`, and
  any of them that round-trips a topic file through `JSON.stringify`
  reformats every question in it. That happened once; a formatter and a
  `--check` in CI is the fix, not a note asking people to remember.

**4 · Content rewrite.** ✅ *Done.* 18 lessons, three agents in parallel,
one per topic — with the first Tenses lesson written by hand first as the
reference implementation, which is what made three parallel arms safe
rather than three divergent interpretations of a prose spec.

The agents' reports were worth as much as the lessons. They found a
signal word taught as a Present Perfect trigger that the same lesson's own
example contradicted; a `when` rule that would have been actively wrong on
one of the questions; a "common mistake" whose wrong and right sentences
differed in three things at once; and a pitfall marking perfectly good
English as an error. Those are all failures the previous format hid inside
paragraphs. Open content questions they raised are recorded at the end of
`docs/education-notes.md` — including two questions that may be in the
wrong category, which is the owner's call and not an assistant's.

**5 · Verify and ship.** `npm run verify` green at 320/390/768/1280, then
a real-device pass by the owner, then `main`.

## Guardrails for the new system

Written for stage 1, and they held. `css/style.css` now declares a border
in exactly three places, and none of them is decoration: `.field`, where
1.4.11 requires a control's boundary at 3:1 and no fill in this ramp can
reach it; and two rules inside `@media (forced-colors: active)`, where the
system discards every background and an outline is the only channel left.
Everything else that used to be a box is a surface, a hairline or a gap.

- **At most one card level.** If something inside a card needs its own
  frame, the card is wrong.
- **Borders are for separation, not decoration.** A rule between blocks,
  not a box around each.
- **One accent, one meaning.** Amber (or its replacement) marks the
  primary action and current progress. Everything else uses text weight
  and colour value for hierarchy.
- **Full-bleed on phones.** Content blocks run to the page gutter; the
  viewport is the frame.
- **A spacing scale that is actually a scale**, applied consistently, not
  chosen per component.
