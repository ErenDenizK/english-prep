# v0.72 — Independent integration review

Date: 4 October 2026. Chromium `/usr/bin/chromium`, Python Playwright, static
prefix server `http://127.0.0.1:8182/english-prep`. Teaching files are outside this
review's edit scope. This audit is independent of the agents implementing the
rail, About folio, atmosphere and data-transfer experience.

## Executed behavioral checks

`tests/v072_integration_browser.py` passed its five functional scenarios:

| Scenario | Evidence checked |
| --- | --- |
| Desktop resume column | At 1440×1000, the aside remains within 1 CSS pixel of its initial viewport height while the native shell is scrolled to 120, 300 and 600 pixels. |
| Reset affordance | The real button has a solid border and at least a 44×44 CSS-pixel target. The safe confirmation action receives focus; Escape restores opener focus and preserves local storage. |
| Mobile rail and native reading | Chromium mobile/touch emulation receives CDP touch events on the actual thumb. Dragging changes native shell scroll position; a subsequent outside finger pan continues native scrolling, closes the expanded rail and preserves the lesson route. |
| Transfer privacy/cancel | Preview shows the expected profile name and readable export. No network request or download occurs before a transfer channel is selected. Escape restores opener focus, leaves stored data unchanged and clears exported JSON through the native queued close event. |
| About keyboard/reduced motion | Chapter selection, layer expansion and rotation work through keyboard activation with their final pressed/expanded states immediately available. Caption copy stays stationary; emulated reduced motion leaves no running folio effects. |

The optional sixth test ran the accessibility matrix described below. The final
combined command with `--axe` passed **all six tests with no skips**. The default
command intentionally omits that matrix unless axe is requested.

The owned interaction changes additionally passed all **9 onboarding** and
**8 component** browser scenarios. These cover multiple viewport sizes, 200%
text, slow fonts, repeated/rapid scene selection, distinct articulated parts,
motion-off/reduction, stable option hitboxes, native focus and fast cancellation.
One regression freezes the menu's first frame and clicks one pixel inside the
first option's upper edge, validating actual pointer hit testing rather than
only comparing bounding rectangles.

The retained motion suite exposed a further real interaction issue: a pending
visibility callback could begin translating the whole quiz after a test thought
the screen had settled. Pressing an answer then canceled that translation,
moving the target by 12 pixels. The production fix keeps the complete quiz,
option boxes and English passage geometry stationary. Only the prompt's outside
shadow, category label and small option shortcut glyphs assemble. A new
regression holds font readiness, releases the pending arrival, freezes its
midpoint and performs a real pointer press while comparing every option box.
The optional hidden-choice flow additionally sets its intentional focus before
queuing glyph presentation, so the input-priority guard does not suppress that
presentation. Its focused regression checks both immediate focus and real
glyph animation. The retained motion suite now has **11 scenarios**.

## Accessibility matrix

axe-core 4.10.3 ran **36 states**: 390×844 dark, 390×844 light, and 1440×1000 dark,
each across home, open select menu, reader with expanded rail, Profile, reset
dialog, transfer preview, expanded manual transfer, About, expanded/rotated
folio, the folio's selected test and return chapters, and the selected test stage
of the product story. The scan included
WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice tagged rules.

- **0 definite violation records**.
- **525 incomplete contrast nodes**, predominantly because axe cannot infer
  the background beneath gradients. These are manual-review results, not
  automatic passes. The release's palette/compositing verification supplies
  numerical token contrast evidence; it does not turn screenshots into a claim
  of universal readability on every display.
- **6 incomplete `aria-valid-attr-value` nodes** concerned select popup
  `aria-controls` references. Manual DOM inspection of the six affected
  route/viewport cases found **12 visible control references**, all pointing to
  existing IDs. Popup relationships and keyboard behavior are also exercised
  by the component suite.

The detailed raw reports are execution artifacts in
`/tmp/ep72-integration-axe.json` and `/tmp/ep72-aria-manual.json`; they are not
required runtime assets. Reproduce the matrix with:

```sh
python3 tests/v072_integration_browser.py --base-url http://127.0.0.1:8182/english-prep --axe
```

## Visual and material review

The 390px transfer dialog and About folio were inspected from browser captures.
The transfer has one readable vertical sequence, explicit channel choices and
a visible close action. The folio's labels and caption sit outside its moving
sheets; three real app captures form the object rather than disconnected
decorative buttons. An onboarding contact sheet at 0/120/350/700/1280ms shows
the back sheet, unfolding page, individual strokes, highlight and direction
symbol assembling while the real explanatory caption stays still.

SHA-256 comparison against baseline `a234205` found **no changed file** among
all **12 `data/`, 56 `original/` and 17 `legacy/` files**. The complete baseline
file lists were compared, not a sample.

This is desktop Chromium and emulated touch evidence. It does not certify
physical iPhone/Safari rendering, platform share-sheet delivery, battery cost,
screen-reader speech output, or hardware animation frame rates. Those remain
appropriate real-device checks. Publication/runtime checks and the broader
retained suite belong in the release validation record.
