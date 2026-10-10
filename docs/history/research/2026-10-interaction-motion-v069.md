# v0.69: interaction motion as an application system

Research and source inspection: 4 October 2026, Türkiye time. Scope is interface,
onboarding, brand and portfolio; no lesson, question, answer or explanation data
is changed. This extends ADR 007 rather than reopening reading typography.

## What the current application actually does

Inspected `motion.js`, `shell.js`, `listbox.js`, `modal.js`, `answers.js`,
`onboarding.js`, `home.js`, `widgets.js`, both application stylesheets and About.
A local Chromium observation at 390 × 844 CSS px, with service workers blocked,
confirmed the following computed behavior:

| Object | Current observation | Decision |
| --- | --- | --- |
| Buttons | 100 ms transform; 160 ms background/border/shadow | Keep an immediate response and unify presentation timing. |
| Tab indicator | 220 ms transform | Keep: it explains which of the two modes is selected. |
| Opening question-count menu | No animation; focus correctly stays on the combobox | Add one finite 180 ms reveal after positioning; preserve keyboard behavior. |
| Route | 220 ms entrance plus three atmospheric loops | Avoid a second native View Transition layer. Nested route entries need one owner. |
| Atmosphere | Three CSS loops at 28, 34 and 42 seconds | Preserve the measured fields and pause lifecycle; do not add idle JavaScript. |
| Introduction | Static ordered lists with ±8 px panel entrance | Make the diagrams respond to a deliberate selection; keep automatic page advance absent. |
| Answer | Stable reserved mark column; pop/shake suppressed | Animate only the small verdict mark, never move/scale answer text or delay scoring. |
| Confirmation dialog | Native dialog/focus model, no deliberate entrance | Finite entrance on the inner card; immediate closing and Escape. |
| About | Separate local animation registry | Reuse the application motion service; remove duplicate lifecycle code. |

The menu's computed `transition` shorthand was `all`, but duration was the
default zero. This is an absence of an effect, not evidence of an expensive
running `transition: all`. The 390 px popup was 96 × 202 px and remained in the
top layer. Existing answers and native dialog semantics are assets to preserve.

## Primary sources inspected

These are retrieved official source documents, not observations of live product
interfaces or proof of a universally preferred timing value.

- [Fluent duration tokens](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/durations.ts)
  define 50, 100, 150, 200, 250, 300, 400 and 500 ms roles. This differs from
  Windows' 83/167/250 ms system examples cited in the previous research: they
  describe different implementations. Neither requires copying every token.
- [Material Web motion v0.192](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss)
  separates short/medium/long durations and standard/emphasized easing. Keep a
  small product-level scale rather than random per-component durations.
- [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
  documents an independently cancellable animation object. It supports finite
  decorative effects without holding state or focus until a transition ends.
- [MDN Animation.cancel](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel)
  explicitly says cancellation clears the effect and rejects the active
  `finished` promise with `AbortError`; every registered effect therefore needs
  both a fulfilled and a rejected cleanup path.
- [MDN Animation.finished](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)
  notes that replay creates another finished promise. The app should create
  one finite effect per state change, cancel its predecessor, and release it.
- [MDN pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer)
  and [hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)
  describe the primary input's precision and hover ability. Cursor-following
  decoration must require both fine precision and hover; touch and keyboard
  retain the complete content and ordinary pressed/selected feedback.
- [MDN animation rendering performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)
  explains style, layout, paint and compositing. Transform and opacity avoid
  geometry animation but do not prove zero energy cost or a universal frame rate.
- [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  explains why automatic movement alongside content requires a persistent pause
  mechanism, and why pausing only while focused is inadequate.
- [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
  supports disabling nonessential interaction motion. Respect OS reduction as
  well as the app's stored preference, including changes during an active effect.

MDN and W3C sources were retrieved through their official GitHub repositories;
the public links above are the readable forms. One initially guessed MDN path
and one guessed Material path returned 404; the actual reference paths were
then retrieved. The Material forwarding wrapper alone is not timing evidence.

## Motion coverage and restraint

Use the refined 100/160/220/360 ms role scale. Use the current shared easing
unless the final ADR chooses another consistently; these are design decisions,
not accessibility thresholds. Motion indicates response, relationship or a
completed action. Every state/ARIA/storage update and focus move is immediate.

| Surface/action | Treatment | Essential limits |
| --- | --- | --- |
| Buttons, links, icon actions | 100 ms surface/press response; arrow travels at most 2 px on fine-pointer hover | No delayed click; no changing hit box; no magnetic controls. |
| Topic/lesson rows | Subtle surface and chevron response | No row stagger, line rewrap or heavy elevation. |
| Menu open | 160 ms opacity .86→1 and translateY 3→0 px | Position first; one effect; menu remains immediately operable. |
| Menu close | Immediate hide and focus behavior | No invisible top-layer object waiting for an exit animation. |
| Dialog open | 220 ms inner-card translation 4→0 px | Native focus/inertness preserved; least destructive action focused immediately. |
| Switch/segmented choice | Existing 160–220 ms thumb/indicator movement | ARIA/current value immediate; keyboard selected state identical. |
| Route change | Single 220 ms bounded cue | No nested entrance, full-screen snapshot layer or queued mutation. |
| Resumed reader, article scroll | No article motion; live progress follows directly | Restored position exact; no scroll-linked parallax or paragraph reveals. |
| Answer selection | 160 ms small mark settle; feedback heading cue if needed | Correct/wrong text and explanation immediate; no wrong shake, answer-card scaling or score counting. |
| Next question | Single local 160–220 ms incoming cue | First option immediately tappable; no wipe covering the next action. |
| Lesson/test completion | One 360 ms mark/rule settle | Actual final score visible immediately; no confetti or performance judgment from tiny samples. |
| Intro step next/back | 220 ms directional panel cue | Manual steps, next/back/skip remain reachable; preserve optional name on return. |
| Intro diagram interaction | Bounded 160–360 ms connector/icon emphasis | Real selected state and explanatory copy; not a fake question or autoplay lesson. |
| About product scenes | User-selected local reveal with actual screenshot embedded | No separate screenshot gallery; no autoplay carousel or fabricated functionality. |
| About fine-pointer atmosphere | Event-driven bounded position update, optionally one rAF per pointer burst | No idle rAF, no pointer-only information; reset on leave/blur/off/hidden. |
| Search typing, form edits, errors, focus | Instant; optional static outline/background change | Never fade text/caret, delay validation, animate a focus ring into visibility or shake an error. |
| Disclosures | Instant semantic open/close; finite cue on newly exposed body only if geometry stays honest | No accordion height loop, no delaying `open` until visual completion. |

Do not animate every DOM node. Cover every meaningful interaction class with a
deliberate response, and document the stable cases. The reader's long-form text
is a stable surface, not an animation canvas.

## Shared implementation contract

Extend `js/motion.js` (or a small dependent module) with:

```js
animateElement(element, kind, { channel, direction } = {}); // Animation or null
cancelAnimationsWithin(container);                         // outgoing effects
bindPointerScene(element, { target, maxTilt: 2, maxShift: 6 }); // cleanup function
```

Use named, finite role presets such as `reveal`, `menu`, `dialog`, `scene`, `mark`
and `complete`; durations derive from the shared token roles. A registry contains
only active animations, and a WeakMap associates each element/key with its
current effect. Starting a replacement cancels the predecessor. Promise
fulfilment AND rejection remove the effect; no unhandled cancellation rejection.

The service checks connection, effective preference, page visibility and WAAPI
availability. `motion:change` cancels active effects whenever off or hidden;
switching the preference back on does not replay old activity. Route owners call
`cancelAnimationsWithin` before replacing content. On pagehide all active effects
are cancelled. No permanent mutation observer, recurring timer, per-frame loop
or `fill: forwards` state is necessary. The final DOM/CSS is always complete
before the effect starts; animation is presentation only.

One animation owner per element: CSS owns hover/press, tab/switch travel and
atmospheric loops. Named WAAPI effects own explicit menu, dialog and diagram
events. CSS route entrance can remain if children do not also animate. Icons
should expose semantic drawing groups via a safe data attribute; custom drawings
keep the 24 px canvas, consistent 2 px rounded stroke, no per-path stroke-width,
decorative default and label on the button. Prefer a small book/document/return
set for actual workflows over unrelated decorative symbols.

## Removing the header pause icon

The user's explicit direction supersedes ADR 007's header control. Remove it
from the shared bar and the top of the introduction. Preserve one preference in
Profile and About's footer. Because the atmosphere still moves continuously,
the reading/quiz view also needs a route-preserving pause mechanism; a quiet
inline text control near its end/actions is an option. It can use the same
preference with a legible label rather than another header glyph.

If the final implementation chooses no such in-session access, use a finite
atmospheric settle of at most five seconds on focused study screens instead of
claiming OS reduced motion alone resolves the continuous-animation requirement.
Do not add an undiscoverable keyboard shortcut and call it an equivalent UI.

## Verification before release

1. Read/save/focus/ARIA response occurs in the same action, before an effect ends.
2. Repeated menu, intro and route actions leave only the newest finite effect;
   Escape and closing release hidden overlays immediately.
3. Reduced-motion, preference-off and hidden-page changes cancel active WAAPI
   effects; detached nodes do not remain in the registry after cancellation.
4. Compare option, next-button and dialog geometry at 320/390/768/1440 px; test
   touch, keyboard, 200% text and rapid action sequences.
5. Observe a settled-reader trace with atmosphere on and off, and a pointer
   scene at rest: no recurring JavaScript or layout introduced by this system.
6. Inspect both semantic verdict colors and shape/word distinctions independently
   of motion. Palette contrast is measured by the separate palette study.
7. Verify the material tree is byte-identical and PWA caches new module assets.

Physical iPhone performance and preference are not measured by headless desktop
Chromium. Report actual environment and measurements instead of describing the
result as universally smooth or battery free.

## Implemented shared primitives

`js/interactions.js` now supplies the named finite effects and bounded pointer
scene, with durations read from the shared CSS tokens (100/160/220/360 ms
fallbacks). It has one document motion listener and one pagehide listener;
individual pointer scenes return a cleanup function. Pointer movement writes
variables on a caller-selected decorative target only. Precision is bounded to
2 degrees and 8 px even if a caller requests more. All current coordinates
reset on leave/cancel/blur, a precision change, preference-off and hidden-page
notifications. There is no idle frame request.

`js/brand.js` creates compact `ep.`, full `english prep.` and responsive forms
with one stable accessible name. `js/icons.js` retains the existing shared SVG
stroke contract and adds six drawings for bookmark, settings, local archive,
devices, workflow and comparison. Every icon has a semantic `data-icon` hook
so only a purposeful sub-element receives a hover cue.

Six interaction/brand scenarios in `tests/interactions.test.js` verify replacement
channels, cancellation without replay, unsupported/detached fallback, bounded
pointer bursts with no idle frame, touch/coarse fallback and lifecycle cleanup,
and one accessible identity for both brand forms. Together with the existing
motion preference suite, all 13 reported tests pass. These unit observations
complement, rather than replace, the integrated browser and visual review.

## Integrated motion observation

Observed the integrated working UI in Linux headless Chromium 151.0.7922.173,
1440 × 1000 CSS px, service workers blocked, without CPU throttling:

| Check | Observed result |
| --- | --- |
| Fine pointer over About artwork | A sampled position produced 1.4° tilt and 4.8 px translation; the text remained outside the transformed plane. |
| Stationary pointer, 1.2 seconds | Zero additional `requestAnimationFrame` requests. |
| Three consecutive About stage selections in one task | The final requested Read scene was selected immediately; exactly one 220 ms local WAAPI effect remained. |
| Live OS reduced-motion change | Once the browser delivered its media-query change, root motion was off, the pointer plane reset, and zero animations remained running. The stored user preference was untouched. |
| Hidden-page handler | With `document.hidden` overridden and a visibility event dispatched, all three atmospheric fields paused, the pointer scene reset, and no scripted animation remained active. This is a handler test, not a physical-device background lifecycle measurement. |
| Errors in these flows | No page errors. |

`emulate_media()` returning is not the same event as a delivered media-query
change: an immediate evaluation initially saw the previous state. Waiting for
the actual root preference update observed cancellation after 53.5 ms including
automation overhead. This is not a user-device response-time benchmark.

After the Present Perfect / Past Simple reader settled, three-second CDP
Performance windows produced:

| Metric delta | Atmosphere on | Atmosphere off |
| --- | ---: | ---: |
| Layout count | 0 | 0 |
| Style recalculation count | 0 | 0 |
| Script duration | 0 ms | 0 ms |
| Requested animation frames | 0 | 0 |
| Main-thread task duration | 5.066 ms | 0.698 ms |

The observation supports absence of new recurring main-thread JavaScript,
layout or style work in those windows. It does not measure GPU energy, battery
life, long-session memory or real iPhone frame rates. Six icon drawings were
also inspected together at 24 px and 48 px; the smaller settings knobs retain
their separation, and the workflow endpoint has the shared minimum ink gap.
