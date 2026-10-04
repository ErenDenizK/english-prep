# A grip, a continuous path, and real section stops — v0.72

The user rejected v0.71's passive phone indicator and desktop captions. The
new rail gives phones an actual touch grip. It combines continuous movement
with discrete destinations without imposing a second scrolling mode on the
article. The learning engine, article material and quiz navigation are unchanged.

## Evidence before implementation

The following official source repositories were retrieved and read on
4 October 2026. Direct W3C documentation returned the environment proxy's
403 response; no inspection of the live documentation sites is claimed.

- [W3C Pointer Events](https://github.com/w3c/pointerevents/blob/gh-pages/index.html):
  pointer capture keeps a drag attached when a finger leaves its original hit
  area. `pointercancel` and lost capture need explicit cleanup. `touch-action`
  belongs to the gesture's actual target, not the whole reading surface.
- [WCAG Dragging Movements](https://github.com/w3c/wcag/blob/main/understanding/22/dragging-movements.html):
  dragging needs a single-pointer alternative. Keyboard equivalence alone is
  insufficient. A tap on an empty track therefore selects a position without
  requiring a drag; section dots are another tap destination.
- [WCAG Pointer Cancellation](https://github.com/w3c/wcag/blob/main/understanding/21/pointer-cancellation.html):
  taps commit on release within the control. Drag cancellation restores its
  original scroll offset. Escape, cancellation, lost capture, hidden page and
  another simultaneous pointer all release the active drag.
- [WCAG Target Size (Enhanced)](https://github.com/w3c/wcag/blob/main/understanding/21/target-size-enhanced.html):
  44×44 CSS px is the chosen target size. This is the enhanced-size criterion,
  not a claim that every WCAG AA target must be 44px.
- [MDN ARIA scrollbar role](https://github.com/mdn/content/blob/main/files/en-us/web/accessibility/aria/reference/roles/scrollbar_role/index.md):
  native scrolling is preferred. Because this experiment replaces its visible
  control, it supplies the required name, controlled region, orientation,
  range/current value and keyboard behavior. Nested semantic buttons inside a
  scrollbar would become presentational, so dots stay visual destinations in
  one scrollbar; Shift+Arrow also visits their real section offsets.

## The compact control is explicit

Phones and other layouts without a measured 52px gutter get an **8px-wide
edge handle**, fully inside the outer 16px gutter. The handle has a local
transparent **44×44px touch target**; the rest of the track is pointer-transparent.
The target is deliberately larger than its artwork: a small part of the nearby
reading area can receive the handle's gesture only within that moving 44px
square. There is no invisible full-height capture strip, opaque resting pill,
or shadow over answer verdicts and prose, and no gutter narrowing every paragraph.

About reserves a 64px inner gutter on fine-pointer layouts from 700px; the rail
measures the actual content edge excluding frame padding, so its desktop control
cannot overlap the interactive folio. The slim handle's position tracks the
actual scroll offset. Touching it expands the grip inward to 44px and opens a
44px-wide opaque well, with paired grip dots and actual section stops where
available. This temporary overlay is explicit. A tap outside or Escape closes
it; a second stationary tap on the grip closes it as well. Motion-off retains
all interactions with immediate static states.

The grip and its well stay clear of the header and bottom actions. A short
viewport with insufficient usable height restores the native scrollbar. No
OS-edge pan gesture, wheel listener, scroll-snap setting or document-wide
`touch-action` rule is introduced. A second pointer cancels an active custom
drag without preventing that second event; the interface does not demand a
two-finger gesture. The word “pinch” describes the grip's visual deformation,
not a required multitouch interaction.

## Interaction contract

| Input | Navigation | Visible response |
| --- | --- | --- |
| Native content swipe / wheel | Continuous native scrolling | Position tracks immediately; grip receives a small emphasis |
| Press and drag grip | Continuous position, with no snapping | Grip narrows sideways, lengthens slightly; paired dots compress |
| Release a drag | Keeps exactly the chosen position | 460ms localized rebound inside the grip |
| Tap an empty open track | Smooth travel to that continuous position | Circular Sakura pulse at the selected location |
| Tap a real section dot | Smooth travel to the start of that block | Squared iris pulse, then the actual current-section dot |
| Arrow Up / Down | 48px continuous steps | Immediate movement and localized feedback |
| Page Up / Down, Space / Shift+Space | 85% of the viewport | Immediate movement |
| Shift+Arrow Up / Down | Previous / next existing section | Smooth section travel |
| Home / End | Real document endpoints | Immediate movement |
| Escape / cancelled pointer / second pointer | Restore an unfinished drag | Brief neutral return; compact well closes |
| Motion off / OS reduced motion | All destinations remain available | No decorative animation or programmatic smooth scrolling |

Continuous and discrete describe the destination, not an invented content
pagination system. Dragging never snaps at dots. Dots never change a question,
submit an answer or mark a lesson complete; ordinary reader scroll rules still
apply exactly as they do for native scrolling. There are no visible adjacent
captions on desktop. The current section remains available in `aria-valuetext`.

## Architecture and lifecycle

`js/scroll-rail.js` owns the DOM, geometry and input state; `css/scroll-rail.css`
owns finite grip/pulse/well motion. It still exposes the idempotent
`initScrollRail({scroller, content})`, `refresh()` and `destroy()` API.

- `data-compact` selects grip versus the wide always-open rail.
- `data-expanded` opens the compact hit region intentionally.
- `data-pressed` and `data-dragging` describe direct manipulation.
- `data-action=position|stage` and `data-phase=jump|release|cancel` select feedback.
- The outer thumb's translation never eases. Deformation belongs to its child
  `.scroll-rail__grip`, so decorative motion cannot corrupt pointer geometry.
- Measurements and scroll painting share at most one scheduled animation frame;
  there is no idle JavaScript animation loop.
- CSS uses existing `card`, `ink-2`, `accent-text`, `secondary`, `edge` and
  `focus` palette roles. It introduces no unaudited semantic color.
- Missing ResizeObserver support or forced colors leaves/restores native
  scrollbars. Destroy disconnects observers/listeners, cancels timers and
  releases capture. A non-overflowing page exposes no unnecessary scrollbar.

## Verification

`tests/scroll_rail_browser.py` has eleven behavioral scenarios: desktop keyboard
and section stops, direct drag/cancellation, native wheel preservation, compact
320/390/640px target and visible outer-gutter geometry, reduced/off/forced-colors fallback, actual CDP
one-finger drag/release and ordinary swipe, tap alternatives, actual multitouch
cancellation, About section keys/cleanup, quiz-attempt invariance, and zero desktop folio/control overlap at
700/1024/1200/1440px.

Physical iPhone/Safari edge behavior, VoiceOver scrollbar announcements and
motor-accessibility usability remain real-device review tasks. Browser emulation
supports the implementation evidence; it does not replace those checks.
