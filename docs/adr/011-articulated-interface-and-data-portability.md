# ADR 011 — Articulated controls, living color and portable progress

Accepted 4 October 2026. Baseline: v0.71 (`a234205`, subsequently attributed as
`b3d9549`; identical tree). This refines ADR010's atmosphere and replaces its
passive mobile rail and floating-device hero. Articles, questions, scoring,
answer semantics and backup format remain unchanged.

## Problem and evidence

The owner could barely perceive the aura, saw too much pink, could not grab the
mobile position indicator, and wanted individual parts to assemble rather than
whole screens to wobble. The desktop resume column also moved unnecessarily.
A product portfolio needs an object that explains the actual study flow, and a
repository landing page needs real evidence and a concise engineering story.

We reviewed primary W3C/MDN pointer, dragging and motion guidance, Rive's layers
and transitions documentation, and GitHub's presentation guidance. The research
records distinguish retrieved official source files from product websites that
returned proxy 403. Duolingo informs the request for expressive articulation;
we did not measure its proprietary timings or claim to reproduce its system.

- [Atmosphere measurements and color proof](../research/2026-10-living-aura-v072.md)
- [Articulated control research](../research/2026-10-articulated-controls-v072.md)
- [About folio decisions](../design/about-v072.md)
- [Touch rail architecture](../design/scroll-rail-v072.md)
- [Transfer research](../research/2026-10-data-transfer-v072.md)
- [GitHub presentation](../github/presentation-plan.md)

## More visible atmosphere, quieter reading

Three independently moving fields each mix cherry, iris and lagoon. Drift takes
7.8/9.4/11 seconds and local color cycles take 10.8/12.6/14.4 seconds. Only
transform and opacity change; there is no unchecked hue rotation or idle
JavaScript frame loop. The flattened atmosphere has one parent opacity ceiling:
0.42 dark, 0.09 light. Individual fields cannot accumulate past that ceiling.

This is a measured increase, not just a shorter CSS duration. In the controlled
390×844 comparison, pixels changing by at least 12 RGB levels over two seconds
rose from 0% in v0.71 to 46.3% in v0.72. Three sampled blank areas each showed all
three dominant hues over twelve seconds. These are frame differences, not FPS,
battery measurements or evidence that every reader prefers the result.

Main reading ink remains neutral. Lagoon introduces cool context/action accents;
Sakura identifies brand/selection and the existing correct state, periwinkle the
incorrect state. Named verdicts and check/cross marks carry meaning alongside
color. Brighter secondary ink and boundaries preserve their contrast against
the stronger atmosphere. Static, low-alpha title glows do not pulse or affect
paragraphs. The checker bounds every possible field mixture using its convex
color envelope, in addition to sampled gradients and title halos.

## Stable controls, articulated parts

Keep native state changes immediate. The surrounding popup/dialog box stays
stationary while an outside halo, labels and small marks compose separately.
Onboarding sheets fan, pages unfold, strokes draw and signals settle; the
explanatory copy stays put. New quiz prompts and option-key marks may enter,
but answer rows never move under a finger. Existing named 100–1100ms roles,
resource readiness, visibility and cancellation govern these effects.

Opening is expressive; closing and real input have priority. Focus, answers,
storage and navigation never wait for animation. Reduced motion, the single
Profile setting, page hiding, replacement and direct input cancel decoration.
A native menu remains clickable even at its first animated frame.

## Adaptive touch rail without taking over scrolling

An 8px edge handle stays inside the outer 16px gutter. Its transparent local
44×44 touch target is the only mobile pointer target at rest; there is no
full-height interception area. Pressing reveals an opaque bounded well. Its inner grip compresses; the outer thumb tracks actual native
scroll position immediately. Dragging is continuous. A track tap goes smoothly
to a position; a real heading stop goes smoothly to that block with a distinct
pulse. No forced snapping, intercepted wheel gesture or quiz-state mutation is
introduced. Desktop captions are removed; accessible position text stays.

Outside touch, Escape and cancellation release the control. Multi-touch gives
way to native gesture handling. Keyboard and tap alternatives accompany drag;
forced colors and insufficient room retain a native fallback. The local target extends inward beyond the thin visible handle: this touch-area
tradeoff remains a real-device review item. Its resting paint does not cover
reading text or verdict marks. The desktop resume pane stays fixed only in a sufficiently tall
wide viewport; short windows retain ordinary access to the full pane.

## One inspectable product object

About opens with a three-leaf study folio: read, apply, return. Each leaf uses a
real high-density capture and a distinct, measured accent. Select, fan open,
rotate, drag and return-to-front controls expose meaningful views. Text stays
outside the moving stack; native buttons provide the same operations without
dragging. Vertical touch scrolling and pinch zoom remain available. Editable
copy arrays and native disclosures continue to support longer future content.

GitHub presents the same product through a static brand, real study montage,
optional actual browser recordings, architecture diagram and linked evidence.
A static alternative accompanies each GIF. `main` receives only README/media;
the original runtime on that branch stays intact, and source links name `test`.

## Explicit, reviewable data transfer

“Yedek al” opens a snapshot preview before any transfer. Supported native file
sharing, download and text copy are separate choices. A canceled share does not
silently download. Clipboard failure exposes selected text for manual copying.
Close clears the exported text; late async results cannot update a newer dialog.
A completed platform share promise means handoff, not verified recipient receipt.
The v1 format and conservative merge/rollback behavior remain compatible.

There is no account, automatic cloud sync or remote backup service. Further
ideas are ranked separately in the [feature opportunity list](../design/feature-opportunities-v072.md),
with value, effort and data implications; a roadmap entry is not a shipped claim.

## Acceptance and limits

The release record in [VALIDATION.md](../VALIDATION.md) covers numerical contrast,
real motion frames, stable hit targets, touch and keyboard cancellation, reduced
motion, mobile reflow, enlarged text, transfer failure/retry, article/test/history
flows, offline behavior and byte-identical preservation of 85 material/archive
files. Chromium touch emulation does not replace physical Safari, OS share-sheet,
assistive-technology or hardware performance testing.
