# Validation — v0.72

4 October 2026. Baseline: shipped v0.71 (`a234205`, reattributed with an identical
tree as `b3d9549`). Source material from `39dcd46` remains unchanged: **10 topics,
60 continuous article lessons, 241 questions and 723 option notes**. Independent
SHA-256 comparison found identical bytes in all **85 files** under `data/`,
`original/` and `legacy/`. Previous release reports remain in Git history.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | **246 unit tests passed**, no failures or skips; formatting, schema and current/historical palette checks passed. |
| Current palette | **67,650 numerical comparisons passed**, including 6,456 aura mixtures and 1,108 title-halo samples; a continuous color-envelope argument bounds intermediate aura states. |
| `tools/verify-ui.mjs` | **3,600 checks passed**, zero failures in the comprehensive browser sweep. |
| `tests/editorial_smoke.py` | **12 passed across initial/corrective runs**: all material, responsive flows, history, original interface and offline coexistence. The export case now explicitly reviews then downloads the backup. |
| `tests/reading_system.py` | **14 passed**: reading roles, onboarding/name, motion preference, install and offline behavior. |
| `tests/component_interactions_browser.py` | **8 passed**: menus, dialogs, answer semantics, stable click targets and cancellation. |
| `tests/pretest_progress_browser.py` | **3 passed**: optional preliminary checks do not manufacture article progress. |
| `tests/quiz_resume_browser.py` | **10 passed**: question order/identity, persistence and interruption/failure paths. |
| `tests/ux_refinements.py` | **7 passed across initial/corrective runs**. The cancellation case now selects native sharing from the explicit export preview; no automatic fallback is allowed. |
| `tests/onboarding_interaction_browser.py` | **9 passed**: articulated parts, readiness, rapid/repeated selection, keyboard, narrow layouts and 200% text. |
| `tests/about_interaction_browser.py` | **15 passed across initial/corrective runs**; final keyboard selection, enlarged-text wrapping and updated transfer-feature copy were checked after integration. |
| `tests/v070_motion_browser.py` | **11 passed** in the final corrective run: stationary real pointer targets through delayed arrival and hidden-choice reveal, focus and glyph choreography. |
| `tests/v071_motion_browser.py` | **8 passed**: cold fonts/images, scene ownership, settings-only pause, centered chrome, real image density and native scrolling. |
| `tests/composition_browser.py` | **5 passed**: centered headers, enlarged text, quiz chrome and honest result states. |
| `tests/scroll_rail_browser.py` | **11 passed**: desktop content clearance, actual emulated touch drag/multi-touch, track/stage jumps, keyboard, fallback, cleanup and unchanged quiz state. |
| `tests/aura_browser.py` | **3 passed**: perceptible frame change, three-color local cycles, and off/reduced/hidden behavior. |
| `tests/transfer_browser.py` | **4 passed**: preview, explicit channels, cancellation, manual copy and stale async cleanup. |
| `tests/v072_integration_browser.py --axe` | **6 passed with no skips**: five independent behavioral scenarios plus the 36-state accessibility matrix. |
| Real media | Eight app captures refreshed at **1170×2532 (phone, 3×)** and **2880×2000 (wide, 2×)**. GitHub media derives from actual captures/browser recordings, with static alternatives. |

The fifteen Python suites cover **126 passing scenarios**, including corrective runs. These are automated scenarios and numerical assertions, not participants. All
browser checks use Chromium and the production `/english-prep/` path prefix.
No runtime package, build step or dependency lockfile was introduced.

## What repeated review changed

1. **Measure visible movement.** CSS motion existed but was almost invisible.
   Over two seconds, pixels changing by at least 12 RGB levels rose from **0% to
   46.3%** in the controlled 390×844 comparison. Three blank sample areas each
   cycle through cherry, iris and lagoon over twelve seconds. Layer opacity is
   capped after composition so overlap cannot accumulate unchecked.
2. **Protect the interaction boundary.** Popup/dialog frames stay stationary;
   marks and labels animate separately. A first-frame regression actually clicks
   one pixel inside an option edge. A retained quiz test exposed a real 12px
   answer-target shift when input canceled an entering container; the correction
   confines entry motion to the prompt and key glyphs, preserving answer geometry.
3. **Inspect real compositions.** The new About folio was reviewed at phone,
   tablet, desktop and enlarged text sizes. Tabs now wrap as whole controls.
   GitHub capture review exposed an insufficient desktop rail gutter; final
   presentation keeps the rail outside the desktop content frame. The opaque
   resting mobile grip also covered a verdict mark in a real capture; its final
   paint is now an 8px edge handle in the outer 16px gutter, with a local 44px
   touch target and an opaque well only after activation.
   The tall desktop resume pane stays within 1px of its initial screen position
   through native scrolling; short windows retain full ordinary scroll access.
4. **Test outcomes and data boundaries.** Transfer channels act only after user
   selection. Cancellation does not claim delivery or trigger download. Native
   queued close events and late promises cannot corrupt a new export preview.
   Every preserved material/archive file matches the preceding release.

## Contrast and accessibility evidence

The stronger aura's conservative dark minima include **9.66:1 reading ink,
7.19:1 supporting ink, 7.12:1 cool accent, 6.52:1 Sakura, 3.49:1 essential
boundary and 6.49:1 focus**. Measured title halos retain at least **7.04:1**.
Opaque answer surfaces keep neutral prose and check/cross plus written verdicts.
The [atmosphere research](research/2026-10-living-aura-v072.md) gives the color
hull derivation and distinguishes continuous bounds from discrete samples.

Axe-core 4.10.3 ran **36 states with zero definite violations** across dark phone,
light phone and dark desktop. **531 incomplete results are not automatic passes**:
525 concern contrast beneath gradients, handled with separate token/compositing
measurements and rendered inspection; six concern popup ID relationships.
Manual DOM checks found all 12 visible `aria-controls` targets in those six
cases. [Independent review](audit/expressive-v072.md) records the matrix and
limits. This is evidence within tested states, not a blanket WCAG certification.

## Reproduce

From `/workspace/english-prep`, with Python Playwright and Chromium installed:

```sh
python3 -m http.server 8182 --bind 127.0.0.1 --directory /workspace
# In a separate terminal, from the checkout:
npm run check
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node tools/verify-ui.mjs http://127.0.0.1:8182/english-prep
python3 tests/editorial_smoke.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/v070_motion_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/aura_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/scroll_rail_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/transfer_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/about_interaction_browser.py --base-url http://127.0.0.1:8182/english-prep
python3 tests/v072_integration_browser.py --base-url http://127.0.0.1:8182/english-prep --axe
```

The other named Python suites accept the same `--base-url`. The optional axe
matrix also needs axe-core; its test CLI documents the path override. Media
reproduction lives in `tools/capture-portfolio.py` and `docs/github/capture.py`.
A restored environment must restart its HTTP process and verify real responses.

## Limits and provenance

Physical iPhone/Safari, real OS share-sheet recipient delivery, screen-reader
speech, learner usability, battery use and hardware frame rates were not
certified. Chromium emulation and numerical contrast are useful, narrower
observations. Several rendered research hosts were proxy-blocked; retrieved
primary GitHub source documents are identified in each research record.

The owner's authorized attribution correction changes only seven design commits'
author/committer identity and consequent parent hashes. Trees, messages and both
dates were verified identical; [the address map](audit/design-attribution-v072.md)
keeps historical audit references traceable. Older original/content commits were
not reattributed. Repository presentation on `main` changes documentation/media
only; the Pages application continues from `test`.
