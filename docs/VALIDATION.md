# Validation — v0.73

4 October 2026. Baseline: v0.72 (`5b48cd0`). This release changes aura tempo,
scrollbar deformation and finite button/page motion. It does not change teaching
material, scoring, backup schema or the preserved interfaces. Earlier release
validation remains in Git history; its broader scans are not claimed as new runs.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | 246 unit tests passed; formatting/schema and current/historical palette checks passed. |
| Current palette | 67,650 comparisons passed. Aura timing changed; its colors, opacity and continuous contrast envelope did not. |
| `tests/aura_browser.py` | 3 passed: three visible local color cycles, paused/hidden/reduced states and bounded composition. |
| `tests/scroll_rail_browser.py` | 12 passed, plus a repeated early-release case: pointer/touch drag, continuous deformation, real section destinations, native scrolling, cancellation and fallback. |
| `tests/v073_motion_browser.py` | 5 passed: actual press/release, first icon activation, single keyboard release, delayed-resource entry and motion preferences. |
| `tests/v073_review_browser.py` | 6 passed: independent rapid actions, real rendered containment, dialogs, double-answer protection, keyboard and About. |
| `tests/component_interactions_browser.py` | 8 passed: real menu/dialog input and focus. |
| `tests/v070_motion_browser.py` | 11 passed: event-boundary behavior, stationary answer targets, interruption and final states. |
| `tests/editorial_smoke.py` | 12 passed: every article, all major practice flows, history/restore/reset, responsive reading and offline coexistence. |
| `tests/about_interaction_browser.py` | 15 passed after correcting shared control styles and explicit folio-label updates. |
| `tests/onboarding_interaction_browser.py` | 9 passed: scenes, rapid selection, delayed fonts, keyboard, reflow and enlarged text. |

The nine browser suites cover **81 passing scenarios**. All browser observations are Chromium with the production `/english-prep/`
prefix. Physical Safari, assistive-technology speech, battery consumption and
hardware frame-rate performance are not certified by these checks.

## What changed through rendered review

The reference drawing led to one 1.5px thread and a 5px thumb that grows only to
8px when held. A local curve bends at most 14px inward. Its horizontal response
is continuous, while the vertical thumb follows the actual scroll position.
The old expanding box and separate release pulse/keyframe are gone. Section
markers remain on the curve. An early release continues from the current bend;
no animation loop remains after settling.

Page motion is deliberately stronger: 620ms arrivals, 24–32px display-title
travel, 12px supporting groups and 6px compact headings/control faces. Pressing
compresses presentation in 120ms; the 380ms release continues from the current
transform. Native actions do not wait for those effects.

Actual timed captures exposed defects that endpoint-only tests missed:

- Preparing a face during pointerdown could swallow the first avatar click;
  preparation now happens before input.
- Full heading travel pushed labels outside their button/combobox surfaces;
  the contained control role preserves a clear page movement without that leak.
- A stale row selector left titles stationary under moving section headings;
  the real row presentation and compact heading now move coherently.
- About needed the shared stylesheet and named mutable label nodes. Updating
  a button's last child after wrapping erased its icon; scoped label updates
  preserve both animation and content.

The [independent audit](audit/motion-v073.md), [rail design](design/scroll-rail-v073.md),
[motion language](design/motion-v073.md) and [ADR012](adr/012-elastic-edge-and-expressive-arrivals.md)
distinguish the chosen visual direction from functional acceptance. Previous
restrained-motion decisions are not treated as restrictions on the owner's new
request.

## Reproduce

Start the static server from the workspace:

```sh
python3 -m http.server 8182 --bind 127.0.0.1 --directory /workspace
```

From `/workspace/english-prep`, in a second terminal:

```sh
npm run check
python3 tests/aura_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/scroll_rail_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/v073_motion_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/v073_review_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/editorial_smoke.py --base-url http://127.0.0.1:8182/english-prep
```

The other listed suites accept the same base URL. No runtime dependency or
build step is added. Media is regenerated through the existing real-browser
capture pipeline; it is demonstration state, not rewritten teaching content.
