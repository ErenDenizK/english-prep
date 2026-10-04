# About v0.72 — an inspectable study folio

The opening object now explains the relationship between an article, an
explained question and a return to study. Three real application captures sit
on separate leaves of one folio. It replaces the passive floating phone and
wide-screen arrangement; the product story below remains expandable.

## Design decisions

The affordance is a physical index, not an ambiguous hover area. A tab brings
one leaf forward; the front leaf and “Katmanları aç” separate the stack. Each
exposed leaf remains directly selectable. “Döndür” offers a deliberate angled
view, with a named “Öne dön” action to restore it. Horizontal dragging turns a
leaf, while the same action is available through native chapter buttons.

The object remains one surface: its index, stack, handling controls and
caption share a border and background. Text that explains the product sits
outside the moving geometry. Sakura marks reading, lagoon marks application,
and apricot marks return; a neutral headline plus one lagoon word prevents
the background atmosphere and all headings from repeating the same pink.
Color is reinforcement: names, icons, position, pressed state and the active
sheet edge also identify the selected state.

Actual phone/desktop captures use the existing 3×/2× WebPs and a responsive
`picture`. Their small previews are evidence of the real application; all
essential benefits and action labels are separate HTML text. No imitation
lesson, invented score, storage mutation or educational-material edit exists.

## Motion architecture

State, copy, links and accessibility attributes change synchronously. CSS
moves the sheet stack to its final arrangement in 860ms and the user-selected
angle in 680ms. Shared finite presets separately fold the capture (`folio`),
compose the initial sheet (`fan`), settle its icon and open its folded corner.
The traced connector supplies a final relationship cue. No entire-page wobble
or moving explanatory paragraph is involved.

The active leaf waits for its pixels, document fonts, visible intersection and
two paint frames before its flourish. Rapid selections invalidate earlier
arrivals and cancel active effects. Motion-off and hidden-page handling cancel
presentation; all final states remain complete. A chosen side angle changes
instantly under reduced motion. The decorative preview can be enlarged in a
later enhancement, but this release does not add a screenshot gallery.

Dragging is local and event-driven, with no idle animation loop. The deck
rotates at most ±16° horizontally and ±5° vertically during a drag. At 46px
horizontal travel, release selects the adjacent chapter. Short travel returns
to rest. A vertical intention before capture, `pointercancel`, lost pointer
capture, blur, page hiding and motion preference changes release the gesture
without selecting a new chapter. The surface permits `pan-y pinch-zoom`.
The keyboard controls also support Left/Right/Home/End. Ordinary vertical
scrolling, browser zoom and the page's own scroll rail are independent.

## Research used, and its limits

Primary documents were retrieved on 2026-10-04 through their official GitHub
source repositories. The corresponding W3C/MDN product hosts and Duolingo's
shape-language page returned a proxy 403 in this environment. This is not a
claim of a new live Duolingo interaction measurement.

- [WCAG 2.2 Understanding 2.5.7: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
  ([retrieved source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/22/dragging-movements.html)):
  dragging requires a single-pointer alternative; keyboard support alone is
  insufficient. The chapter and inspection buttons supply tap alternatives.
- [WCAG Understanding 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
  ([retrieved source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/animation-from-interactions.html)):
  user preferences must suppress non-essential motion. The existing shared
  setting and OS reduced-motion preference govern this composition.
- [MDN `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
  ([retrieved source](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/properties/touch-action/index.md)):
  the browser decides gesture ownership from the initial touch-action chain
  and sends pointercancel when native handling takes over. The folio declares
  pan-y/pinch-zoom before the gesture and never blocks page scrolling globally.

The physical-folio metaphor, color assignments, angles and timings are design
choices, not requirements imposed by those sources. The app's shared v0.72
motion research supplies the wider articulation and rhythm decisions.

## Verification

`tests/about_interaction_browser.py` covers native chapter changes, focus,
layer expansion and direct page selection, explicit angle/front return,
bounded real-mouse dragging, cancellation, reduced motion and the absence of
learning-data writes. Existing cases cover the editable study/architecture
stories, 320/390/768/1440px overflow, 200% text, native disclosure opening and
closing, delayed decoding, touch, extension copy and latest-selection wins.

Captures inspected during development include 390px normal/expanded and 1440px
expanded states. This is automated Chromium and rendered-image inspection,
not physical-device Safari certification or a participant usability study.
The release's final validation report records the executed counts.
