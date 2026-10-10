# A bounded map of the page — v0.71

The right scrollbar becomes a small Sakura-to-iris rail. It follows the
existing scroll surface rather than creating another navigation system.
Its upper and lower ends stay inside the page's visible middle, away from
the fixed header and actions. The thumb's length still represents the
visible fraction of the document; its position represents scroll position,
not lesson completion or a quiz score.

## Evidence and the design decision

The relevant sources were read on 4 October 2026 from their official source
repositories. Direct MDN and W3C documentation URLs returned the environment's
403 proxy response; no live-site inspection is claimed.

- [MDN: ARIA scrollbar role](https://github.com/mdn/content/blob/main/files/en-us/web/accessibility/aria/reference/roles/scrollbar_role/index.md)
  recommends native scrolling and specifies the required accessible name,
  `aria-controls`, `aria-valuenow`, orientation and keyboard operations. It
  explicitly notes that a scrollbar need not occupy the viewport's full length.
  Descendants of a scrollbar are presentational, so section dots are visual
  positions inside one scrollbar, not inaccessible nested buttons.
- [WCAG 2.2: Target Size (Minimum)](https://github.com/w3c/wcag/blob/main/understanding/22/target-size-minimum.html)
  requires a 24px target or the stated spacing/equivalence exceptions. A
  custom scrollbar is author styling and cannot claim the user-agent exception.
  The interactive rail provides a continuous **44 CSS px** hit region. That is
  a project choice above the minimum, not a claim that WCAG AA requires 44px.
- [WCAG: Pointer Cancellation](https://github.com/w3c/wcag/blob/main/understanding/21/pointer-cancellation.html)
  informed activation on pointer release and the Escape/pointer-cancel rollback.
- [WCAG: Animation from Interactions](https://github.com/w3c/wcag/blob/main/understanding/21/animation-from-interactions.html)
  informed immediate scroll-position feedback and removing decorative easing
  when the shared preference or operating system requests reduced motion.

An always-interactive 44px rail on a 320px phone would either cover article
text and answer controls or consume too much reading width. We measured the
actual right gutter instead of guessing from a device name. With at least
52px of whitespace, a fine pointer and enough height, the rail is interactive.
Otherwise it becomes a **6px passive indicator** with no hit area, tab stop or
screen-reader duplication. Native finger scrolling, wheel scrolling and the
browser's content keyboard handling remain intact. There is no floating menu
button competing with the two main app modes.

## Continuous and staged views

The reader draws up to five dots from its existing title and headed article
blocks. About draws up to six from its existing sections. Oversized sets are
sampled evenly; positions less than 44px apart on the rail are merged. A dot
always points to an actual visible section. Clicking near a dot moves to that
section's scroll offset. The current section name appears on hover/focus and
in `aria-valuetext` together with the page percentage.

Test, results, libraries, profile and onboarding use a continuous rail. In
particular, dots never jump between quiz questions or mark an answer. Scrolling
a lesson can still trigger the reader's existing completion rule, exactly as
native scrolling does. The rail contains no data-storage, scoring or content
mutation code.

## Architecture and interaction

`initScrollRail({scroller, content})` in `js/scroll-rail.js` defaults to the
app's `#shell-scroll` and `.page`, or to document scrolling and `main` on About.
It is idempotent and returns `refresh()` and `destroy()`. The shared shell and
About initialize it once. `destroy()` disconnects observers/listeners, releases
pointer capture, removes its generated node and restores the native scrollbar.

The DOM lives in one labelled navigation landmark outside the transformed
page content. Its single interactive control exposes `role="scrollbar"`,
`aria-controls`, vertical orientation and a 0–100 value. Passive variants are
`aria-hidden`. ResizeObserver tracks the content and viewport; a narrow
MutationObserver responds to real content replacement, hidden routes and open
disclosures. Scroll events schedule at most one paint per animation frame.
There is no idle animation loop, wheel interception, forced snapping or
learning-state dependency.

- Dragging uses pointer capture and tracks without a position transition.
  The 4px movement threshold separates dragging from a click. A track click
  commits on release inside the control. Escape or pointer cancellation restores
  the drag's original position; blur and hidden-page changes release it too.
- Up/Down move 48px; Page Up/Down and Space move 85% of the viewport; Home/End
  reach the page ends. These listeners belong to the rail, never to content.
- Thumb width and selected dots settle over 240–320ms. Section jumps use native
  smooth scrolling when permitted; manual scroll position never eases behind
  the user's finger or wheel. Motion-off stops an in-flight smooth jump.
- The current-section caption remains hoverable and can be dismissed with
  Escape without moving the pointer or focus. A native title tooltip does not
  compete with it.
- Forced colors restore the native scrollbar and hide the custom rail. Missing
  ResizeObserver support leaves the native scrollbar untouched. When content
  does not overflow, there is no custom control. Narrow layouts never gain a
  hidden interactive target over text.

## Palette measurement

The thumb uses the existing `accent-text` → `secondary` gradient with explicit
**sRGB** interpolation and a solid-accent fallback. It introduces no new palette
token. Tracks and inactive dot edges use `ink-2`: the earlier `edge` candidate
fell to 2.93:1 under an intentionally conservative repeated-cherry overlap, so
it was rejected. The caption has an opaque card background.

The measurement sampled 101 gradient positions against 40 backgrounds per
theme: the page plus all one-, two- and three-field combinations of the three
allowed aura endpoints at the maximum opacity, including repeated endpoints.
These are numerical contrast measurements, not a claim of user testing.

| Element | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Thumb gradient / aura background | 6.45:1 | 4.72:1 |
| Track and inactive dot edge / aura background | 6.59:1 | 5.30:1 |
| Focus outline / aura background | 6.80:1 | 4.91:1 |
| Caption text / opaque card | 14.35:1 | 14.25:1 |

The rail's geometry was inspected at 1440×1000: a 44×320px interaction region
from y=332 to y=652, safely inside the viewport. At 320/390/640px widths the
passive indicator occupies 6px at the outer edge without changing the content
column. Touch-first devices also receive the passive variant at wider widths.

## Verification and limits

`tests/scroll_rail_browser.py` exercises the real app and About: keyboard
scrolling, native wheel behavior, staged clicks, drag/Escape/pointer-cancel,
narrow geometry, reduced motion, forced colors, resize/cleanup and quiz attempt
invariance. The independent accessibility pass also checked the new labelled
landmark; the original body-level orphan control was corrected.

This is a progressive experiment, not an accessibility certification. Physical
iPhone touch behavior and assistive-technology announcements need a real-device
review. Content and wheel scrolling stay native so a decorative enhancement
does not become a prerequisite for reading.
