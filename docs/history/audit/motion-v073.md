# v0.73 — independent motion and input review

Reviewed in Chromium at 390 × 844 and 1440 × 1000. Touch checks use actual
Chromium touch input, not synthetic DOM `click` events. These are browser
observations; physical iPhone/Safari smoothness is still a separate check.

The requested direction is a quieter aura, a fine thread that bends inward
under a fingertip, and noticeably richer page/button responses. Existing audit
preferences for almost stationary UI do not define the acceptance criteria.
Motion should look intentional while a tap, a question answer or a scroll
continues to do exactly what the learner asked.

## Issues caught before release

1. **First avatar click was swallowed.** Wrapping the SVG button contents in
   the capture phase of `pointerdown` changed the native event target midway
   through the gesture. Faces are now prepared before input; no synthetic
   replacement clicks or delayed navigation are used. A fresh real touch on
   the profile avatar now opens Profile on the first tap.
2. **Button labels escaped their surfaces during arrival.** The initial
   32 px text travel moved `Teste başla` below its pink button and placed the
   combobox value below its border. Control faces now use a contained 6 px
   movement and modest scale; larger travel belongs to display text.
3. **Compact list headings collided with stationary row text.** The collector
   used `.row__body`, while the actual row text is `.row__main`. That selector
   is corrected, and compact headings use 6 px travel instead of 32 px.
4. **The desktop held rail was thinner than intended.** Hover specificity
   overrode its pressed width. The held grip now reaches 8 px, from a 5 px
   resting stroke, without turning into a panel.
5. **About needed the shared face presentation too.** Its separate stylesheet
   entry did not initially style the injected wrapper, collapsing the space
   between chapter numbers and labels. The final review checks actual spacing,
   rather than assuming a shared JavaScript import includes its CSS.

## Focused checks

Run the independent cross-surface cases:

```sh
python3 tests/v073_review_browser.py --base-url http://127.0.0.1:8182/english-prep
```

**Result: 6/6 passed** on the final composed controls and styled About surface.
The six cases exercise:

- Rapid tab changes on both viewport sizes followed immediately by a real
  menu selection, checking the last navigation intent and focus.
- Per-frame painted button/combobox containment, requiring visible movement
  while keeping text inside the control throughout arrival.
- Immediate Profile, reset-cancel and transfer-cancel actions, preserving
  local records and returning focus to the opener.
- A double answer click during question arrival, recording only one answer
  and continuing correctly into the next question.
- Motion-off during an arrival, then usable keyboard scrolling in the reader.
- Reduced-motion About interactions, correct final states and preserved
  chapter-number spacing.

The focused rail suite separately checks mouse/touch dragging, inward pull,
release continuity, keyboard stages, escape, multitouch cancellation and native
scrolling outside the grip. The review also performed an actual touch drag
followed by text-area pan: the same native scroll position moved from 905 to
1100 px, without changing the open lesson.

## Visual evidence

The review captures actual timed browser frames, without substituting designed
mock-ups. A 700 ms delayed-font experiment samples rendered coordinates after
font readiness; the entry remains visible when the typography is ready. The
button release and rail are reviewed at intermediate positions, not only at
rest and at their endpoint. The real combobox press/release produced 23 distinct
painted transforms over a 64-frame observation and opened its
menu on the original click. This confirms visible interpolation; it is not a
device-performance benchmark.

Temporary review artifacts are generated under `/tmp/ep73-*`; production
screenshots remain in the existing About/GitHub media pipeline. Runtime
animations are finite apart from the intentionally ambient aura; motion-off
and the operating system's reduced-motion preference retain complete final
states. No learning material is modified by this review.
