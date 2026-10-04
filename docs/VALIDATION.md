# Validation — v0.70

4 October 2026. Baseline: shipped `c134dcc` (v0.69). The original material
from `test` commit `39dcd46` remains unchanged: **10 topics, 60 continuous
lessons, 241 questions and 723 option notes**. SHA-256 comparisons against
v0.69 found identical files in `data/` (12), `original/` (56) and `legacy/` (17).
Previous validation reports remain in Git history.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | **237 unit tests passed**, zero failures/skips. Content format/schema and both palette systems passed; includes 17 motion/preference tests and two new negative answer-boundary regressions. |
| Current palette | **7,848 numeric comparisons passed**, including 3,324 answer-surface/boundary/transition-model checks. These are calculations, not separate usability tests. |
| `tools/verify-ui.mjs` | **3,611 checks passed** in the final run under `/english-prep/`: source articles, themes, responsive flows, keyboard, history, backup and failure paths. |
| `tests/editorial_smoke.py` | **12 scenarios passed**. The initial short-landscape menu failure was fixed and rerun; the other 11 passed on the initial run. |
| `tests/reading_system.py` | **14 scenarios passed**: optional tour, six selections without learning writes, motion controls, OS reduction, install and first-visit/offline modules. |
| `tests/component_interactions_browser.py` | **6 scenarios passed**: menus, native dialogs, answer semantics/focus, motion and reduction. |
| `tests/pretest_progress_browser.py` | **3 scenarios passed**: correct/wrong pretest, body-only progress, resume and short-body completion. |
| `tests/quiz_resume_browser.py` | **10 scenarios passed**: identity/order, answer timing, persistence and failure paths. |
| `tests/ux_refinements.py` | **7 scenarios passed**: caret/focus, report/restore, deferred navigation and launch counts. |
| `tests/onboarding_interaction_browser.py` | **6 scenarios passed**: initial composition, all scenes, interruption, motion preferences, responsive geometry and 200% text. |
| `tests/about_interaction_browser.py` | **11 scenarios passed**: mobile density, real media, disclosures, art/architecture composition, rapid replacement, fine pointer, touch, preferences and long authored content. |
| `tests/v070_motion_browser.py` | **9 scenarios passed**: actual event boundaries, input priority, menu/dialog interruption, answer geometry, normal quiz completion/reload, once-only lesson completion, Profile editing, route and motion cancellation. |
| Axe-core 4.10.3 | **86 final scans, zero definite violations**: 32 main-app states and 54 onboarding/About/open-menu/expanded-feature states. WCAG 2 A/AA, 2.1 AA and best-practice tags. |
| Actual animated colors | **28 Chromium frames / 140 measured pairs passed** across correct/incorrect, both themes and seven timeline samples. Four off/reduced checks and two forced-color checks also passed. |
| Assets | Eight actual captures regenerated at 390×844 and 1440×1000; all loaded. No fabricated screen or question replaced app output. |

Checks ran in Chromium on the prepared cloud machine, using the production
`/english-prep/` prefix. No runtime dependency, build or account service was added.

## Color and stable answers

Three full-surface answer palettes were rendered through the real component.
The selected Sakura/periwinkle treatment uses separate text, tint and softened
edge roles. Neutral English text, literal Doğru/Yanlış, check/cross shapes and
linked accessible descriptions carry meaning independently of hue. Pink is a
brand-specific educational confirmation, not a universal color convention.

The initial light incorrect border failed against a possible aura composition
at 2.88:1; it was darkened before acceptance. Final status boundaries pass all
measured surrounding surfaces. Production checks sample the modeled transitions;
an independent browser audit also paused the actual 220ms CSS effects at seven
points. Measured minima were **11.43/11.89:1** for dark/light answer text,
**7.44/5.65:1** for keys, **8.02/5.61:1** for glyphs and **4.15/3.27:1** for
boundaries in those actual animation frames. Geometry did not change; text/row
opacity stayed 1 and row transform stayed none. The result is committed before
these color effects run. See [answer research](research/2026-10-answer-surfaces-v070.md).

Axe marked 1,255 contrast node occurrences incomplete: 1,019 gradient, 144 overlap,
22 partial overlap, 20 pseudo-element, 20 short numeric and 30 non-text glyph
occurrences. They repeat across states. Ten popup `aria-controls` checks were
also incomplete; 12 independent DOM checks confirmed unique connected listboxes
and valid label IDs before/after opening, in both themes and three widths.
Zero automated violations is not a whole-app accessibility certification. The
independent contrast, geometry and keyboard checks supplement those limitations.

## Motion verified through actual journeys

[ADR009](adr/009-expressive-study-motion.md) defines productive 100/220/360ms
and expressive 560/720/900ms roles. Actual engine timings measured onboarding
compositions at 720–880ms and About artwork at up to900ms. Delayed entries are
bounded and interruptible. Native input, focus, scores and navigation never wait.
Focus/pointer input settles moving ancestors; unrelated illustration can finish.

The independent pass found three interaction regressions and repaired them:

- A normal quiz already records history before reaching results. A separate
  tab-local presentation marker now controls once-only result choreography;
  refreshing does not replay completion or duplicate history.
- Popup scaling mixed transformed rectangles with unscaled scroll coordinates.
  Menus now translate without scaling, preserving active-option visibility.
- A moving route could change a popup anchor during queued focus-scroll. Input
  now settles that route first. Sixteen rapid native/fallback trials had no
  unexpected closure, and real scrolling still dismisses the popup.

A lesson draws its new completion signature only on the existing unfinished→done
transition. Completed rereads stay quiet. Resumed instructional prose remains
stationary; fresh lesson entry moves only its heading. A new quiz question can
enter, while an answer changes only its colors/new marks. Profile entry does not
replay during name edits. Scores are available immediately and never count up.

Rapid About selections canceled 12 superseded effects and retained only the
latest three. Motion-off canceled active effects immediately; a synthetic hidden
page event canceled WAAPI and paused all three bounded aura fields. Stationary
onboarding/About samples scheduled zero extra rAF over500ms; the reader did so
over750ms. These short headless observations do not establish physical-phone
frame rate, GPU cost or battery use. [Motion research](research/2026-10-motion-v070.md)
records the sources, methods and distinction from design judgment.

## Mobile composition and PWA

At390px, About hero height fell from1,009px to871px, study from1,430px to1,201px,
and features from2,231px to1,314px. Real screenshots are near their selected
context, with no separate gallery. Native feature disclosures keep useful
headings visible. Added long content and 200% root text reflowed. Artwork reveals
observe the actual art, so they do not finish above the phone's viewport.

Onboarding heights stayed649px at320px and682px at390px despite richer drawing.
Profile identity/stats remained294.8/195.2px at390px. The result's signature adds
19.6px to its score block; 320px and 200% text reflow without collision.

Offline checks cover the new presentation through the scoped v0.70 worker and
preserved copies. Captures cache when visited; installation does not imply all
lessons/images are downloaded. Manifest identity and learning backup formats
remain unchanged. The new result-presentation marker is tab-local decoration,
not a learning record. [About authoring](../about/README.md) explains extensibility.

## Limits and reproduction

No physical iPhone/Safari install, older Android battery profiling, full
VoiceOver/TalkBack session or participant study was performed. Simulated browser
install events do not establish universal support. A390px capture is not evidence
of testing an actual iPhone. Contrast cannot prove the owner's visual preference.

Start `python3 -m http.server 8072 --bind 127.0.0.1 --directory /workspace`.
From `/workspace/english-prep`, run `npm run check` and the nine Python suites
above with `--base-url http://127.0.0.1:8072/english-prep`.

```sh
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node tools/verify-ui.mjs http://127.0.0.1:8072/english-prep
```

Generate captures with `python3 tools/capture-portfolio.py --base-url
http://127.0.0.1:8072/english-prep`. Recheck these environment-specific tool paths
on restoration. The [four-pass audit and manual route](audit/expressive-motion-v0.70.md)
explain decisions, discovered defects and the next hands-on review.
