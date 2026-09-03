# Redesign plan

Agreed 2026-09-03, after the owner's review of the `v0.11` build: the
architecture is right, the interface isn't. This file is the plan of
record for replacing it. Update it as decisions land — the point is that
the reasoning outlives any one session.

## Scope

**Replaced:** the visual layer (`css/style.css` and the render functions
that build markup for it) and the lesson content format.

**Kept:** the app shell, hash routing, storage, the quiz engine, the 72
questions, the category taxonomy, the validator, the tests and the
Playwright harness.

That split is what makes this affordable. Content is data, presentation
is code, and there are 28 unit tests plus a 217-check browser sweep to
catch what a redesign breaks.

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

**Palette: to be chosen from mockups.** Both a rebuilt dark identity and
a light/paper direction are being drawn on the same screens so the choice
is made by looking, not describing.

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

**1 · Design system in code.** Rebuild the token layer and the
primitives: surface tiers instead of borders, at most one card level,
a real type scale, a restricted accent. Apply to the existing screens
first so old and new can be compared directly. No content changes.

**2 · Screen-by-screen.** Home/Test, quiz, results, Profil — each one's
information hierarchy reconsidered, not merely repainted. The home screen
leads with resuming and weak spots; the mixed test moves down.

**3 · Eğitim: the new lesson model.** Schema and reader together, plus
`tools/validate-content.mjs`, `docs/CONTENT_GUIDE.md` and the briefs in
`docs/agents/` in the same change — the project's standing rule is that
schema, validator and guide move together or not at all.

**4 · Content rewrite.** 18 lessons in the new model. This is the
delegated work: two agents, one pair per topic, from the updated brief.
Tenses first as the reference implementation, reviewed closely before the
other two topics start.

**5 · Verify and ship.** Full Playwright sweep at 320/390/768/1280, then
a real-device pass by the owner, then `main`.

## Guardrails for the new system

Carry these into stage 1 so the old failure mode can't return:

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
