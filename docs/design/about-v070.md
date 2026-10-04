# About v0.70: an expressive portfolio designed from the phone

4 October 2026, Türkiye time. UI/presentation only; no learning material changes.
This implements the owner's request for stronger motion and a portfolio that
feels intentionally composed on phones. [ADR 009](../adr/009-expressive-study-motion.md)
and [the motion study](../research/2026-10-motion-v070.md) define the shared system.

## Diagnosis before implementation

The actual v0.69 page was inspected at 320, 390 and 1440 CSS pixels in local
Chromium with a 900px viewport height. At 390px, the hero occupied 1009px, study
section 1430px and eight fully expanded feature paragraphs 2231px. The study
copy reserved a 400px minimum height, followed by a 512px screenshot illustration.
Architecture selected a different paragraph, but its only visual reaction was a
small icon mark. Section entry moved only the eyebrow for 160ms. The interface
was accessible and consistent, but its timing and composition barely separated
an ordinary control from an intentional product demonstration.

These are measured geometry and implementation observations. They are not
participant research or an assertion that every long mobile page is bad.

## Source evidence and limits

Fresh official MDN sources were retrieved successfully:

- [Using the Web Animations API](https://github.com/mdn/content/blob/main/files/en-us/web/api/web_animations_api/using_the_web_animations_api/index.md)
  explains browser animation objects and their timing/control model. The shared
  service composes finite browser animations without deferring actual UI state.
- [Intersection Observer](https://github.com/mdn/content/blob/main/files/en-us/web/api/intersection_observer_api/index.md)
  supports asynchronous visibility observations. Observe the illustration itself
  when a tall phone section places it well below the heading; section entry alone
  would often play an unseen animation.

The parallel motion investigation retrieved actual Carbon, Material Web,
Material Android and Fluent implementation sources. Carbon distinguishes
productive and expressive movement; Material Web supplies 700–1000ms extra-long
roles. These support using a larger timing range for storytelling while keeping
button input immediate. They do not prescribe this portfolio's exact timings.
See the linked motion study for source URLs, extracted values and limitations.

Direct requests to current Raycast, Linear, Material's site, MDN's rendered site
and web.dev returned proxy 403 here. No fresh competitor interaction observation,
measured competitor timing or physical-phone frame rate is claimed. Two guessed
Primer source paths returned 404 and were not used as evidence.

## Design decisions

### A compact opening with real application evidence

Keep the full `english prep.` masthead and compact `ep.` closing signature. The
opening juxtaposes genuine phone and wide captures. A custom SVG route connects
three parts of the product story; a 900ms artwork entrance, 560ms phone settle
and 720ms trace form a bounded sequence. Staggers are 0/90/160ms. The final CSS
layout is complete before motion starts, and cancellation exposes that layout.

On phones, the artwork is 300–340px high. Duplicate figure captions are removed
there, with alt text and the main product narrative retained. The phone occupies
34% of the illustration width, preserving its complete silhouette without
running into the following corpus section. The existing fine-pointer response
remains limited to 2 degrees and 6px on the decorative parent. Heading, prose,
links and hit targets never follow the cursor.

### Show the selected study scene beside its controls

The native pressed-state controls are 56px tall on phones. Their redundant icons
are hidden below 700px so each short action label remains intact at ordinary
text size. Larger widths keep the icons and sequence numbers. The selected real
capture is immediately below its controls on phones, cropped to a square at its
actual available width; readable explanatory copy follows. On a wide screen,
copy and the full wide capture remain side by side. No fixed copy height remains.

A user change immediately updates selected state, copy, alt text, source, status
announcement and real application action. The image gets a 560ms scene; the label
and chosen glyph receive smaller related cues. Rapid selection cancels both
preceding artwork and control effects. There is no autoplay, false quiz, iframe,
image gallery, viewport chooser, swipe requirement or learning-storage write.

### Features become inspectable, not another wall of paragraphs

All eight features retain their complete authored title and category in visible
native disclosure summaries. The first starts open; the others reveal their full
copy and optional link by click, touch, Enter or Space. Opening one does not
silently close another. No feature is a fake clickable card: its chevron and
native summary communicate the real expansion. Added items retain the same
content-driven layout and safe `textContent` rendering.

Each first visible feature has a finite icon/headline cue. Disclosure open/close
is immediate; only the newly opened body and related glyph move. Important
product description remains in ordinary hero/study copy, with data/offline limits
available in both features and explicit FAQ answers.

### Make the engineering relationship visible

The compact three native controls select a custom SVG layer drawing alongside
actual architecture text. Content, interface and continuity have separate drawn
planes joined by a normalized path. The selected plane and control agree
immediately; its path then traces and the plane settles. The actual local-data,
session-storage and caching explanations remain literal and editable. Native
technical disclosures preserve supplementary detail without forcing every
paragraph into the initial phone scroll.

## Motion ownership and lifecycle

All explicit effects use shared `animateElement`, `animateSequence` and
`cancelAnimationsWithin`. No private scheduler, animation registry, dependency,
permanent requestAnimationFrame loop or spring solver was added. CSS owns
ordinary pressed surfaces, arrows and disclosure chevrons. The visibility
observer watches headings, features and large illustrations separately; each
entry occurs once. A running user-chosen scene takes precedence over a generic
entry. No content is hidden while waiting for an observer or animation.

SVG groups and glyphs use a centered fill-box transform origin. Hero figure
rotation is on its image child, avoiding a snap when the parent's animation
returns to identity. Root/OS motion-off removes finite effects and pointer
movement; the visible final scene and immediate controls remain complete.
The preference remains in the footer, with no top pause button.

## Review findings and measurements

| Width | Hero: before → after | Study: before → after | Features: before → after | Horizontal overflow |
| --- | --- | --- | --- | --- |
| 320px | 1058 → 930px | 1423 → 1170px | 2394 → 1367px | 0px |
| 390px | 1009 → 871px | 1430 → 1201px | 2231 → 1314px | 0px |
| 1440px | 666 → 666px | 989 → 965px | 1060 → 757px | 0px |

768px was also checked: no horizontal overflow, with a 1248px study section.
The smaller initial feature area is progressive disclosure, not smaller body
type or removed explanations. Normal story body text remains 16px.

Visual and independent engineering review found and corrected:

1. An icon crowded the phone's `Uygula` label into two pieces. Hide that redundant
   icon at the narrow breakpoint rather than shrinking the label.
2. A phone caption overflowed the shortened hero plane. Recompose the phone and
   remove duplicate mobile captions instead of clipping text.
3. Observing the whole tall section played artwork before it was visible. Observe
   the artwork independently and avoid competing with a user-triggered scene.
4. A selector list found the feature's summary label before its body, making the
   wrong text move on expansion. Select the feature body first, falling back to
   the direct technical/FAQ paragraph. A browser assertion now covers this.
5. SVG group transforms otherwise use an unsuitable origin. Center them on the
   filled geometry; keep application text untransformed by artwork effects.

`tests/about_interaction_browser.py` covers real source/action links, retained
keyboard focus, architecture semantics, bounded event-driven pointer motion,
preference persistence, mobile/desktop images, 200% text, touch, long appended
content, disclosure operation and the correct animated target, mobile density,
rapid scene replacement, reduced-motion cancellation and visible-once artwork
entry. Automated Chromium results do not certify physical iPhone/Safari behavior
or universal perceptual smoothness. Root release validation covers accessibility,
current captures, offline caching, shared color measurements and deployment.
