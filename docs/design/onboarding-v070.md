# v0.70 · A composed, responsive introduction

Implemented on 4 October 2026. Scope: the optional three-page introduction,
its drawings and transitions. Teaching material, questions and learning
storage are unchanged.

## Findings before implementation

The v0.69 introduction had useful native scene controls, but its main motion
was a four-pixel sheet entrance over 220 ms and a line drawing over 360 ms.
Most of each new page appeared without a coordinated transition. The drawings
looked like whole objects being nudged, rather than the topic/article/answer
workflow being built in front of the user. Adding a longer fade to that same
object would not resolve this.

Measured baseline tour heights in Chromium were 648.95 px at 320 × 568,
682.16 px at 390 × 844 and 697.75 px at 1440 × 900. The first two pages use the
same geometry. The task is to strengthen their character without increasing
the amount of reading, making more decisions mandatory or enlarging the tour.

## Source evidence and its limits

Read on 4 October 2026:

- [IBM Carbon, empty states and optional onboarding](https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/patterns/empty-states-pattern/index.mdx)
  distinguishes bite-sized guidance from more involved education and explicitly
  calls onboarding optional. Its cognitive-cost guidance supports retaining
  the existing three pages and immediate skip. It does not prescribe these
  illustrations or prove an improvement in learning.
- [IBM Carbon motion package 11.53.0](https://registry.npmjs.org/@carbon/motion/-/motion-11.53.0.tgz),
  `package/js/generated/tokens.js`, documents 70–240 ms interaction roles,
  400 ms deliberate transitions and 700 ms immersive hero changes, with
  productive and expressive easing. This supports distinct motion roles;
  it is not a requirement that all controls last 700 ms.
- [MDN, Element.animate](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/element/animate/index.md)
  documents returned Animation objects and the ability to inspect active
  effects. The implementation uses the shared cancellation service rather
  than timeouts or waiting for an entrance before enabling controls.
- [WCAG, Animation from Interactions](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/animation-from-interactions.html)
  identifies nonessential motion and reduction needs. Every drawing has a
  complete static state and uses the app and OS motion policy.

Live Carbon, Fluent, MDN and W3C page hosts returned proxy 403 responses.
The linked official raw sources and Carbon package were accessible. This is
source research and local browser observation, not a rendered comparison of
those applications or a participant study.

## Motion decisions

The app's shared presets now do the timing and cancellation. The tour adds
only sequence composition and drawing semantics:

| Moment | Composition | Longest timeline |
| --- | --- | ---: |
| First entry / next page | Fully opaque heading moves 12 px, description follows after 60 ms; illustration builds independently | 720–880 ms |
| Topics | Three rows enter at 0, 80 and 160 ms while a path joins them | 720 ms |
| Article | Back sheet, then front sheet; an emphasis line and downward reading guide draw | 720 ms |
| Check / question | Answer rows appear in sequence; selected cue settles after the options | 880 ms |
| Explanation | Answer mark draws while the explanation lines enter; underline settles | 720 ms |
| Return | Two sheets separate in depth while the two return arcs draw | 720 ms |
| Final page | Full wordmark enters, its dot settles, a drawn signature curve completes | 880 ms |

The 560 ms scene role, 720 ms drawing/completion role and small stagger are
design decisions within the shared v0.70 scale. They are intentionally more
visible than v0.69. Native buttons, step state, headings, selected captions and
input values update immediately. Buttons and the name input never move as part
of a story sequence. Prose has no scale or transparency animation.

Forward/back page movement and earlier/later scene choice reverse their
direction. There is no automatically advancing tutorial, animation queue,
fake answer, pretend score or requirement to explore the drawing. The existing
optional name, blank-name completion, Skip and Back remain available.

## Technical boundary

SVG groups represent separate rows, sheets and explanation lines. Drawing
paths use `pathLength="1"`, so the shared `draw` preset works across differently
sized paths. Finished strokes and transforms are the default CSS state.
Interrupted motion therefore reveals the completed illustration rather than
leaving a partially drawn diagram behind.

`animateSequence` creates finite Web Animations through the common registry.
`cancelAnimationsWithin` releases the outgoing scene before replacement and
the entire form before completion/skip. There are no local timers, idle loops
or separate motion preference listeners. The previous CSS entrances and
keyframes were removed, avoiding two competing animations on one object.
The small SVG paths require paint while drawing; no unsupported claim of
compositor-only rendering or measured device frame rate is made.

The illustrations still use the existing 104 px scene at phone widths,
80 px on short screens and 120 px in wider layouts. Their colors inherit
shared semantic tokens. The closing signature is decorative and does not
change the accessible English Prep brand name.

## Four review passes and results

1. **Structure and evidence:** inspected the real three-page route, read the
   source references above and measured the v0.69 baseline before editing.
2. **Composition:** split existing drawings into semantic parts and applied
   shared timings. Native page and scene state is committed before effects.
3. **Geometry and readability:** inspected captured dark and light screens;
   checked 320, 390, 768 and 1440 px widths and 200% root text. Heights remain
   unchanged from baseline, all targets remain at least 44 px, the primary
   action stays in place across scene choices and no horizontal overflow is
   introduced. The short viewport still scrolls naturally.
4. **Interruption and final states:** verified that initial entry contains
   multiple delayed parts, each of the six scenes settles, a rapid page
   change cancels outgoing effects, Skip works during motion and name input
   does not wait for the final signature. App-off and OS-reduced states show
   complete static diagrams. No animation is required for comprehension.

`tests/onboarding_interaction_browser.py`: **6 tests passed** in Chromium.
The suite covers the observable behavior above, including the longer initial
entry; it no longer treats the previous 500 ms ceiling as a product rule.
Existing `tests/reading_system.py` owns the retained keyboard, optional-name,
Back selection and learning-storage-isolation contracts.

An axe-core 4.10.3 inspection of all three pages, both themes and 320/1440 px
widths reported **zero violations in 12 cases**. Gradient color contrast was
marked incomplete by axe and is not included in that claim; the shared palette
measurement covers the composite colors.

Physical iPhone/Safari testing and participant judgments of motion quality
remain outside this automated result. These checks verify geometry, behavior
and lifecycle; they do not establish that every user will prefer the timing.
