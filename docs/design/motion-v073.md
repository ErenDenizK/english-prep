# Motion v0.73 — an opening, a press, a release

Historical page-entry decision: v0.74 restores the v0.72 page choreography at
the owner’s request. Tactile controls remain. See [ADR 013](../adr/013-restore-page-entry-and-browser-space.md).

The owner asked for clearly visible page and button motion. v0.72's small
horizontal translation and panel halo were too quiet. That feedback supersedes
historical preferences for keeping every heading still. The academic content,
scoring and route structure are unchanged.

## One composition, different parts

A page opens in a 620 ms downward-to-rest movement: large hero/article titles
travel 24–32 px, supporting groups 12 px and compact section headings 6 px,
staggered by 32 ms. Compact headings and their row labels share a distance so
a title never descends into its first row. A control's label and icon travel
only 6 px with a .96-to-1 scale; the surrounding button, field or popup anchor
stays in its final position. This is a visible page composition, not a rotation
of the whole reading canvas. No paragraph becomes a delayed prerequisite for
using the page. Delays are bounded at 180 ms.

`animateArrival` decomposes visible sections into presentation parts. A group
that contains buttons, links or fields is split; actual controls never become
children of a translating ancestor. It ignores offscreen groups, input fields,
labels and screen-reader-only content. Sections with no controls can move as a
coherent piece. This keeps the composition legible and allows an immediate click
without the old large-parent cancellation snap.

| Place | Sequence |
| --- | --- |
| Education / Test | Lead, supporting text, progress and action faces; visible catalogue groups |
| Topic overview | Title/summary followed by visible lesson-row parts |
| New lesson | Title, summary, optional first-check presentation |
| Profile | Visible sections in order; existing identity mark keeps its longer settle |
| New question | Prompt composition plus existing choice-key signals; answer rectangles stay still |
| Results | Score structure arrives, while fresh completion artwork draws independently |
| Resumed reading | Restored reading position stays still; no animation surprises a return mid-paragraph |

An answered question does not replay its prompt. Typing, changing settings and
filtering a list do not replay the page entrance. The existing `whenVisible`
readiness boundary waits for fonts, supplied image decoding, intersection and
two painted frames. A slow request therefore cannot use up the entrance before
the new page appears. Navigation/state/focus commit before the composition;
there is no animation timer driving application state.

## Tactile controls

Buttons, About action links, navigation controls, listbox anchors, disclosures and interactive rows
use a shared native-input pipeline:

1. Pointer or activation-key down compresses presentation to .945 over 120 ms.
2. Release samples the actual current transform, then runs a 380 ms return with
   a restrained 1.035 overshoot. A quick tap still has a complete release.
3. The native click opens the route, menu or dialog immediately. The release
   does not hold the app's response hostage.
4. A drag beyond 12 px or pointer cancellation removes the press state; native
   swipe scrolling keeps its ordinary behavior. No pointer capture or
   `preventDefault` is used by this control system.

`.control-face` contains the original nodes, not copies. It inherits alignment,
gap and layout direction and cannot receive pointer events. Faces are prepared
when their DOM is inserted, before painting. **They must not be created on
pointerdown:** moving the initially hit SVG descendant at that moment was found
to suppress a browser's native click. The first avatar click is a regression
case now. The stationary outer control retains its listeners, accessible name,
focus rectangle and touch target.

Keyboard release and the resulting native `click(detail=0)` are one gesture,
not two competing animations. Assistive-technology/programmatic clicks without
a preceding down/up pair receive their own release cue. Inputs are excluded.
The custom rail and the complex interactive folio leaf have their own gesture
systems and are deliberately excluded from generic wrapping. About story and
onboarding selectors animate their existing presentation spans instead.

## Cancellation is a usable final state

Motion off, OS reduced motion, page hiding and pagehide cancel finite effects
and clear held presses. They do not reset a question or close a popup. Turning
motion back on does not replay an old click. Route replacement releases old
arrivals. No perpetual JavaScript loop, route snapshot or runtime animation
library is introduced. The bounded atmosphere remains CSS-owned.

## Evidence, engineering sources and verification

This is a product-specific design decision after direct owner feedback, not a
claim that one motion duration is universally correct. The implementation uses
platform behavior described by:

- [Web Animations: animation effects and timing](https://www.w3.org/TR/web-animations-1/).
- [Pointer Events: event dispatch and cancellation](https://www.w3.org/TR/pointerevents3/).
- [WAI-ARIA APG button keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
- [WCAG animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

The earlier [articulated-controls research](../research/2026-10-articulated-controls-v072.md)
provides the Rive/layered-animation precedents; this revision uses independently
moving presentation parts without adding a Rive runtime.

`tests/v073_motion_browser.py` exercises held physical press, release after a
native popup opens, stationary trigger geometry, first icon navigation, keyboard
activation without duplicate release, cold-data/font readiness, visible
screen-space travel, motion-off interruption and reduced-motion navigation.
`tests/v073_review_browser.py` independently checks rapid navigation, dialogs,
answer stability and control-face containment during actual rendered frames.
The existing menu/dialog suite covers native focus and selection behavior.
Actual capture contact sheets are review artifacts; screenshots alone are not
proof of uninterrupted input or correct scoring.
