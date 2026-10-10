# About v0.69 — a responsive product story

Date: 4 October 2026 (Türkiye time). Baseline: v0.68, `9e68e84`.
Status: implemented for v0.69 after review; presentation only.

## What the existing page measures

Chromium, local `/english-prep/about/`, 900px viewport height, 320/390/1440px
widths. The page has no horizontal overflow in these captures. The dedicated
screen gallery has six controls (four screens plus two viewports) and occupies
1666/1671/1242px respectively. A second section repeats the study sequence in
1254/1114/610px. The gallery is a large browsing task before the same product
story is explained again. These are measured layout facts, not usability-study
results. The owner explicitly requests removal of that gallery section while
retaining real screenshots within the page.

The current hero is a static composition of a phone and a wide screenshot.
Architecture consists of three static labels followed by six full paragraphs.
Only button presses and screenshot replacement have finite motion. A motion
toggle occupies the header; the owner explicitly requests its removal there.

## Evidence consulted

Official documentation was retrieved from MDN's source repository on 4 October.
Live W3C and web.dev requests were blocked by the network proxy; they are not
claimed as newly inspected. These constraints complement the W3C and design
system evidence already recorded in the v0.68 motion research.

| Source | Relevant fact | Decision |
| --- | --- | --- |
| [MDN Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) ([retrieved source](https://github.com/mdn/content/blob/main/files/en-us/web/api/pointer_events/index.md)) | Pointer Events cover mouse, touch and pen; `pointerType` permits input-specific handling. Touch manipulation must not unintentionally block pan/zoom. | Pointer decoration only for fine, hover-capable input and mouse/pen. Touch uses ordinary buttons. No pointer capture, scroll interception or `touch-action:none`. |
| [MDN hover media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover) ([source](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/at-rules/@media/hover/index.md)) | Mobile may emulate hover through an inconvenient long press. | No essential copy, action or state depends on hovering. Product-story and architecture controls work by click, Enter and Space. |
| [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) ([source](https://github.com/mdn/content/blob/main/files/en-us/web/api/window/requestanimationframe/index.md)) | Requests are one-shot; refresh rates vary; callbacks are normally paused in hidden tabs. | Coalesce pointer events to at most one pending frame. No permanent JS animation loop. Clear queued work and reset transforms on leave, hidden document or motion preference change. |
| [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) ([source](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/at-rules/@media/prefers-reduced-motion/index.md)) | Large scaling and panning can trigger discomfort; the OS preference signals a request to remove nonessential motion. | Shared reduced-motion preference disables pointer tilt, background movement and entry/reveal effects; all states and controls remain immediate. |
| [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) ([source](https://github.com/mdn/content/blob/main/files/en-us/web/api/intersection_observer_api/index.md)) | Asynchronous visibility observation avoids application scroll-event polling. | At most one finite entry accent for a section becoming visible. Content is never initially hidden and observer failure never hides content. No scroll-linked parallax or continuous scroll observer. |

## Design and interaction decisions

### Brand and opening composition

Use the compact `ep.` mark in the masthead and the full lower-case
`english prep.` wordmark near the closing invitation. Both share Inter's weight,
tight spacing and the cherry dot. The headline remains a readable, stable
statement; only a decorative line/light and screenshot composition respond to
the pointer. Do not split the headline into independently moving letters.

Pointer interaction belongs to the hero visual's bounded area. Maximum tilt
2 degrees and translation 6px. A low-opacity radial light follows within that
area behind opaque screenshots; it must not raise the background under prose
or introduce a new unmeasured text-color pair. Nothing tracks the cursor across
the whole document. Motion returns to rest on pointer leave. The composition
stays attractive and complete without pointer support.

### One interactive study story

Remove the dedicated screen × viewport gallery, image-opening buttons and the
redundant separate numbered study-story section. Replace them with one section
that explains **read → apply → return** through learner actions. Step buttons
are plainly labeled, have pressed state and remain in DOM during changes.
The selected scene updates explanatory copy, a genuine screenshot and a real
application link. Small supporting story detail can make the optional initial
check clear without introducing a fourth principal navigation choice.

The screenshot is supporting evidence within the story, not a gallery item.
Use a responsive `picture`: phone capture on narrow viewports, wide capture
when the layout makes it legible. No screen-size chooser. Give every image its
intrinsic dimensions, alt text and a quiet truthful demo-state caption. Reserve
the image's layout area to avoid control movement while it loads. There is no
fake working quiz, iframe, timed slide advance or fabricated learning content.

Selection commits immediately. A short local reveal affects the scene visual
and accent; controls stay still and keyboard focus stays on the selected step.
Copy stays high contrast from its first frame. A polite status announces only
the user-selected stage. Swiping is unnecessary; native vertical scroll and
zoom remain intact. Every step has one useful route into the real app.

### Features and architecture

Feature entries become an editorial grid with small purpose-drawn line icons,
subtle local edge/underline response and varied spacing. Hover does not suggest
a static card is a clickable control. Only real links receive arrow motion.
Cards stay content-sized so added copy can expand them.

Architecture becomes a three-part **content → interface → local continuity**
diagram with selectable nodes. Each node exposes actual engineering details,
not merely an ornamental glow. It includes one visible detail panel, a clear
selected state and a source link. Nodes remain native buttons with pressed
state. Long explanations reflow. Supplemental engineering entries can remain
compact native disclosures, avoiding six competing open paragraphs. Critical
privacy/offline limitations remain visible in the ordinary feature copy.

### Motion budget and semantics

- Press/hover feedback: shared ~100ms; bounded arrow translation 2px.
- Selection/menu/disclosure cues: shared ~180ms; local opacity/3–5px transform.
- Story change or first visible section accent: shared ~220ms, no action delay.
- A one-time drawn connection/brand mark: at most 420ms; no infinite line draw.
- No score/count-up effects, magnetic buttons, shaking text, cursor replacement,
  flash, autoplay carousel, animated text gradient or decorative click handlers.
- Header motion toggle is removed. A clearly labeled **Hareket** preference in
  the footer uses the shared persisted control. OS reduced motion always wins;
  a disabled preference cancels running finite effects as well as the aura.
- All additions are vanilla JS/CSS/SVG and safe DOM construction. Runtime
  dependencies, build step, learning corpus and application state are untouched.

## Editing model and implementation ownership

Owned implementation: `about/index.html`, `about/about.js`, `about/about.css`,
`about/content.js`, `about/README.md`. Root owns shared motion/palette, icons,
service-worker changes and final screenshots. About can import shared icons
where their meaning matches; unique art uses explicit SVG nodes, not HTML
strings. The page keeps `extraSections` and appendable feature/FAQ data.

Replace `tourScreens` with a documented `studyStages` data array containing
unique id, visible label, title, body, detail, capture id, alt and actual action.
Architecture is another appendable data array; renderer must not assume three
entries or use an item index to choose meaning. CSS uses content-driven grids
and flexible tracks. `README.md` documents both arrays and how to refresh real
screenshots. Hero/static CTAs remain usable when the module fails.

## Acceptance before publication

1. Dedicated screenshot gallery and viewport controls absent; real app captures
   remain integrated in hero/story, have alt text and current actual UI.
2. 320,390,768,1440px: no overflow, lost controls or fixed-height copy clipping.
   Repeat with long appended stage/feature text and 200% text size.
3. Story/architecture controls keep focus, pressed state and displayed content
   in agreement. All app/source/install links resolve under `/english-prep/`.
4. Pointer transformation is bounded, event-driven and resets on leave. It does
   not run for touch, hidden document, saved motion-off or OS reduced motion.
5. No header motion button; footer preference persists and stops local effects.
   Reduced motion removes decoration without delaying any interaction.
6. Feature content remains accessible without hover. No content is hidden until
   scrolling or tied to JS animation completion. No new console errors or
   failing image requests. Actual material and preserved versions are unchanged.


## Implementation review and measured outcomes

The accepted plan is implemented in `about/*` with the shared brand and finite
interaction modules. The dedicated gallery, screen/viewport controls and image
opening links are absent. Three learner-action stages and three architecture
nodes have immediate state updates, native button semantics and retained focus.
The existing eight real captures remain available; the release owner refreshes
them against the final application before publication.

A local Chromium run at 900px height measured:

| Width | Horizontal overflow | New study section | Previous gallery + repeated story |
| --- | --- | --- | --- |
| 320px | 0px | 1423px | 2920px |
| 390px | 0px | 1430px | 2785px |
| 768px | 0px | 1386px | Not captured in the baseline |
| 1440px | 0px | 989px | 1852px |

These are geometry measurements, not evidence of learning outcomes. All three
study stages select the appropriate real phone/wide capture. Story copy remains
content-sized; a minimum height stabilizes ordinary transitions without clipping
long authored additions.

`tests/about_interaction_browser.py` passes seven focused tests: real story
links/media and keyboard focus; architecture explanations/source links; bounded
pointer response with no idle requestAnimationFrame loop or headline movement;
footer preference persistence and cancellation; responsive media/reflow; touch
operation without pointer decoration; and long/new authored content without
renderer changes. No page JavaScript errors occurred.

Review found and corrected two implementation defects: 200% text made corpus
figures and the footer preference exceed 320px, fixed by allowing utility rows
to wrap; the hero light's lower edge overlapped caption bounds at intermediate
mobile widths. Its final 200px bottom inset keeps the reflection outside live
caption text, conservatively checked by the palette reviewer across nine widths.
The maximum pointer displacement is 6px, not the initial proposed 8px. The shared
scene cue uses the ADR's 220ms role. Headings remain stable; selection cues move
only artwork or the selected architecture icon.
