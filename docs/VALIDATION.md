# Validation — v0.75

4 October 2026. The owner clarified the Safari target as the flat backing band,
then reported overlapping labels/headings in About’s feature disclosures.

- `npm run check`: 246 unit tests, content/schema and palette checks passed.
- `aura_browser.py`: 3 passed after root-canvas and large-viewport changes.
- `about_interaction_browser.py`: all 15 passed after adjusting feature layout
  and mobile spacing. An initial overly tall version exceeded its mobile
  density budget; the final version retains readable type with less empty space.
- Real feature layouts inspected at 320, 390, 768, 1220 and 1440px: all eight
  labels sit 8px above their headings, chevrons stay in their column, native
  keyboard expansion works, and 200% type at 390px does not overflow horizontally.
- Full app sweep: 3,590/3,591 checks passed; the fixed 1200px reading probe
  reported zero progress in the desktop flow. It now scrolls into the actual
  article after the variable-height pretest. The complete affected desktop
  flow then passed all 69 checks; no reading/scoring implementation changed.
- Browser-tab metadata probe: standalone-only theme-color does not match a
  regular tab; dark/light root colors follow the palette, atmosphere min-height
  covers the viewport, and app/About pages have no horizontal overflow/errors.

The visual goal under Safari’s native toolbar cannot be certified here: these
are Chromium page-paint checks. No physical iPhone was available. Neither the
metadata change nor extending the decorative canvas removes native URL controls.

## Earlier release evidence

### Validation — v0.74

4 October 2026. Page-opening callers were restored byte-for-byte from v0.72
(`5b48cd0`) in Home, Education, Profile, Quiz and Results. v0.73 button feedback,
aura tempo and rail remain. No teaching material or preserved version changed.

- `npm run check`: 246 unit tests passed; content format/schema and palette checks passed.
- `v073_motion_browser.py`: 5 passed, including delayed-resource readiness with
  the restored 360ms route opening and retained physical press/release.
- `v073_review_browser.py`: 6 passed for rapid input, containment, dialogs,
  answer stability and About. Its movement check follows the restored horizontal axis.
- `v070_motion_browser.py`: 11 passed for route interruption and event/focus boundaries.
- `reading_system.py`: 14 passed, including honest installation outcomes,
  manifest identity, optional onboarding, reading, offline and cache failure paths.
- Full `tools/verify-ui.mjs` sweep: 3,590 of 3,591 checks passed. The sole
  failure expected outdated Profile storage copy from before v0.72. Updated
  that assertion to the existing local-storage/no-auto-sync explanation, then
  reran its complete `runIndexStates` group: all 75 checks passed. The separate
  onboarding group also passed all 27 checks. No application change was made
  to satisfy the stale assertion; the unaffected sweep was not repeated.
- Actual viewport resize probe: 390×660 → 390×844 → 390×660, plus 320×568
  and 1440×900. Body/scroll area follow available height, navigation remains
  within the viewport and no horizontal overflow appears. Mobile captures reviewed.
- Simulated iOS standalone flag selects the installed message and hides the
  installation button. This is a UI-branch check, not proof of OS installation.

The first browser run hit a stale local server returning empty responses.
A fresh server on port 8184 was verified against source bytes before rerunning;
the results above are from the successful rerun. Physical Safari toolbar
collapse and Add to Home Screen were not tested on a device. The app does not
claim it can remove browser-owned URL controls. See [ADR 013](adr/013-restore-page-entry-and-browser-space.md).

## Earlier release evidence

### Validation — v0.73

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

The [independent audit](history/audit/motion-v073.md), [rail design](design/scroll-rail-v073.md),
[motion language](history/design/motion-v073.md) and [ADR012](adr/012-elastic-edge-and-expressive-arrivals.md)
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
