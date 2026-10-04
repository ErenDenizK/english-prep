# Validation — v0.71

4 October 2026. Baseline: shipped `cfa4089` (v0.70). Source material from
`test` commit `39dcd46` remains unchanged: **10 topics, 60 continuous article
lessons, 241 questions and 723 option notes**. Independent SHA-256 checks found
identical bytes in all **85 files** under `data/`, `original/` and `legacy/`.
The preceding validation report remains in Git history.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | **238 unit tests passed**, no failures or skips. Formatting/schema, current and historical palette checks passed. |
| Current palette | **7,848 numerical contrast comparisons passed**; the unchanged three aura pigments stay inside the measured alpha envelope. |
| `tools/verify-ui.mjs` | **3,597 checks passed** in the final comprehensive run, with zero failures. |
| `tests/editorial_smoke.py` | **12 passed**: real material, responsive flows, history, preserved version and offline coexistence. |
| `tests/reading_system.py` | **14 passed**: article roles, optional introduction, settings-only motion preference, OS/hidden behavior and install/offline paths. |
| `tests/component_interactions_browser.py` | **6 passed**: menus, dialogs, answer semantics/focus and motion cancellation. |
| `tests/pretest_progress_browser.py` | **3 passed**: instructional-body progress, optional checks and resume. |
| `tests/quiz_resume_browser.py` | **10 passed**: real question identity/order, answer persistence and failure paths. |
| `tests/ux_refinements.py` | **7 passed across the initial and corrective runs**. Six passed initially; the Profile focus defect was fixed and the affected case plus the adjacent late-route case passed again. |
| `tests/onboarding_interaction_browser.py` | **8 passed**: cohesive scenes, slow-font readiness, repeat selection, interruption, keyboard, responsive layout and 200% text. |
| `tests/about_interaction_browser.py` | **13 passed**; two relevant tests repeated after the final enlarged-text masthead correction also passed. |
| `tests/v070_motion_browser.py` | **9 passed across initial and corrective runs**. Eight passed initially; the result assertion was updated to observe actual readiness-gated motion and the affected case passed. |
| `tests/v071_motion_browser.py` | **8 passed**: cold fonts/images, latest-scene ownership, settings-only control, centered chrome, image density, native narrow scrolling and desktop rail. |
| `tests/composition_browser.py` | **5 passed**: header centering, 200% text, changing quiz controls and honest complete/partial/zero-result states. |
| `tests/scroll_rail_browser.py` | **8 passed**: drag/cancel, keyboard, landmarks, actual emulated touch swipe, coarse-pointer tablet, native fallback, cleanup and unchanged quiz state. |
| Axe-core 4.10.3 | **24 final scans, zero definite violations**, including WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice rules. |
| Real media | Eight captures regenerated: phone **1170×2532 (3×)**, wide **2880×2000 (2×)**. Responsive selection and intrinsic dimensions verified. |

The twelve Python suites cover **103 test scenarios**. Counts describe automated
checks, not participants or physical devices. All checks use Chromium and the
production `/english-prep/` URL prefix. No runtime package or build was added.

## Four rounds of diagnosis and refinement

1. **Reproduce and measure.** A controlled 2.1-second font delay reproduced an
   entrance that ended around 589ms before Inter completed around 2154ms. Mobile
   header centers drifted up to 43.5px. Previous aura displacement was too small
   to communicate movement. The supplied fragmented compositions were reviewed.
2. **Implement the shared language.** Font/image readiness plus actual visibility
   govern finite effects. Onboarding/About group their parts into coherent scenes.
   The new 1100ms flowing illustration role complements fast control responses.
   Equal outer header tracks hold the title center; the result is a single folio.
3. **Review real renders and interaction.** A moving gradient revealed a rectangular
   boundary and was corrected with contained falloffs. Enlarged mobile About text
   exposed a launch action wrapping into single characters; it now wraps as a whole.
   The rail's initial boundary contrast was strengthened. Repeated native name
   changes caused a redundant Profile rerender; already-committed names no longer
   redraw the field, preserving actual focus and selection.
4. **Verify semantics and failure paths.** Axe found an orphan desktop scrollbar;
   a named navigation landmark corrected it. Rapid selections, delayed resources,
   forced colors, off/reduced/hidden states and existing learning flows were checked.
   Two older motion assertions sampled immediate DOM commit; they now wait for
   the actual finite effect while still verifying that state is immediately usable.

There are no animation callbacks that update a score, unlock a button or change
lesson content. Real input cancels pending/active ancestors before it can move a
control. A late image cannot resurrect an obsolete scene. Answer prose stays
opaque and fixed; the existing Sakura/periwinkle semantics remain measured.

## Measurements and honest limits

The same three fixed aura pigments now travel and overlap on 16/21/27-second
phases, with unchanged maximum field alpha 0.10 dark/0.05 light. In a controlled
five-second sample, the phone area changing by at least three channel units grew
from 0.1% to 40.2%; mean RGB change grew from 0.305 to 1.965. These are image differences,
not a user-preference or battery measurement. The isolated CSS loop added no
LayoutCount/RecalcStyleCount/ScriptDuration over the sampled 1.2 seconds; headless
CDP did not report layer events, so GPU compositing is not claimed as measured.

Rail measurements use 101 sRGB gradient positions against 40 conservative aura
backgrounds per theme. Thumb minima are 6.45:1 dark/4.72:1 light; track/inactive-dot
edges 6.59:1/5.30:1; focus 6.80:1/4.91:1. Forced colors restores native scrollbars.
A 44px interactive rail appears only with enough measured whitespace and a fine
pointer. Narrow/touch layouts retain the full reading column and native gestures,
with a passive six-pixel indicator. There is no scroll snapping or quiz navigation.

Axe returned 301 incomplete checks: 297 contrast cases and four closed-popup
`aria-controls` references. They are not counted as passes. Six additional DOM
checks at 320/1440px verified existing uniquely identified hidden popup targets.
Numerical palette/rail measurements supplement gradient limitations.

Header centers measure 0.00px offset at 320/390/768/1440px. Onboarding action position
is unchanged between scenes, including 320px and 200% text. Final artwork sequences
last 1100–1260ms while selections remain immediate. Current real screenshot files
are about 101–243KiB each; HTML retains logical viewport dimensions to reserve space.

Official Duolingo pages were proxy-blocked. The research distinguishes that limit
from retrieved Rive official case-study/technical sources and W3C/MDN source text.
No invented Duolingo timings, physical iPhone/Safari certification, screen-reader
usability study, battery benchmark or universally preferred animation is claimed.

## Reproduce

From `/workspace`, start `python3 -m http.server 8171 --bind 127.0.0.1 --directory /workspace`.
Confirm a real response from `/english-prep/index.html`; a listening PID alone is
insufficient. From `/workspace/english-prep`:

```sh
npm run check
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node tools/verify-ui.mjs http://127.0.0.1:8171/english-prep
python3 tests/v071_motion_browser.py --base-url http://127.0.0.1:8171/english-prep
python3 tests/scroll_rail_browser.py --base-url http://127.0.0.1:8171/english-prep
python3 tools/capture-portfolio.py --base-url http://127.0.0.1:8171/english-prep
```

Other Python suites above use the same `--base-url` argument. Browser tooling is
prepared development tooling, not a runtime dependency. Processes must restart
after environment restoration. The [independent audit](audit/expressive-motion-v071.md),
[motion research](research/2026-10-motion-v071.md), [rail design](design/scroll-rail-v071.md)
and [ADR010](adr/010-living-scenes-and-navigation.md) contain supporting evidence.
