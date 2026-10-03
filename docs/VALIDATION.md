# Validation — v0.69

4 October 2026 (Türkiye time; 3 October UTC). Baseline: shipped `9e68e84`.
The original material from `test` commit `39dcd46` remains unchanged:
**10 topics, 60 continuous lessons, 241 questions and 723 option notes**.
SHA-256 comparisons against the v0.68 checkout found identical files in
`data/` (12), `original/` (56) and `legacy/` (17). Previous reports remain in Git.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | **231 unit tests passed**, zero failures/skips; content format/schema and original/current palette checks passed. Includes 13 shared motion/preference tests. |
| Current palette | **4,524 numeric comparisons passed**: 154 opaque pairs, 330 aura compositions, 4,040 sRGB action-gradient samples. Color calculations are not separate browser or usability tests. |
| `tools/verify-ui.mjs` | **3,614 checks passed** under `/english-prep/`: articles, themes, responsive flows, keyboard, history, backup and error paths. |
| `tests/editorial_smoke.py` | **12 scenarios passed**. The first run found a 200% Profile motion-label overflow; it was fixed and the failing scenario passed on rerun. |
| `tests/quiz_resume_browser.py` | **10 scenarios passed**: refresh/resume, question identity/order, answer timing, history and failure paths. |
| `tests/ux_refinements.py` | **7 scenarios passed**: focus/caret, report/restore outcomes, deferred navigation and launch counts. |
| `tests/reading_system.py` | **14 scenarios passed**: interactive optional tour, six selections without learning writes, footer preference, OS reduction, install outcomes and first-visit/offline About modules. |
| `tests/pretest_progress_browser.py` | **3 scenarios passed**: correct/wrong answers, expanded explanations, body-only progress, resume and short-body completion. |
| `tests/component_interactions_browser.py` | **6 scenarios passed**: menus, reset/restore dialog padding, answer semantics/focus, local animation and reduction. |
| `tests/onboarding_interaction_browser.py` | **4 scenarios passed**: responsive geometry, rapid scene replacement, OS/stored motion preference and 200% text. |
| `tests/about_interaction_browser.py` | **7 scenarios passed**: story/architecture controls, real media, fine-pointer lifecycle, touch, motion preference and long authored additions. |
| Axe-core 4.10.3 | **80 final scans, zero definite violations**: 32 main-app states and 48 onboarding/About/open-menu states. WCAG 2 A/AA, 2.1 AA and best-practice tags. |
| Assets | Eight actual app captures regenerated at 390×844 and 1440×1000; all loaded. No mocked question or screen was substituted. |

Browser tests ran in Chromium on the prepared cloud machine, against the
production `/english-prep/` path. No runtime dependency, build or account service
was added. The preserved app copies and current modules remain separately scoped.

## Color, typography and geometry

The accepted jade/coral status candidate was compared with two alternatives in
actual answer components. Its text contrast is at least **7.26:1 / 6.69:1** in
dark mode and **5.43:1 / 5.13:1** in light mode under bounded aura compositions.
English option text stays neutral; words and check/cross shapes identify the
outcome independently of hue. Forced-colors verdict symbols use `CanvasText`.
Twelve browser answer cases (2 outcomes × 2 themes × 3 widths) preserved geometry.
See the [status research](research/2026-10-status-colors-v069.md).

Main reading roles remain Inter 18px/30px and question 20px/32px, with separate
headings, form labels, annotations and metadata. Layout tests cover 320px,
200% text and spacing overrides. Menu rows remain 48px high; selected glyphs
reserve their space. Correct/wrong option bounding boxes changed by **0px**.

Onboarding measured 649px rather than 745px at 320px, and 682px rather than
753px at 390px. Its short-screen content scrolls without a nested scroll area.
About's merged narrative measured 1,430px rather than 2,785px at 390px, and 989px
rather than 1,852px at 1440px. Long extra text, an additional story stage, feature
and section reflowed without renderer changes. Its decorative reflection clears
all live captions across nine widths, with a minimum 15.98px separation.

Axe reports **1,053 color-contrast node occurrences as incomplete**, including
918 involving gradients; the rest include overlaps/pseudo-elements and short or
symbolic text. These occurrences repeat across states. Ten `aria-controls`
references were also incomplete; closed/open/closed inspection confirmed the
connected listbox exists exactly once, with the correct active descendant.
Zero automated violations is not a complete accessibility or contrast verdict.
Independent palette math, actual styles, geometry and keyboard checks supply
additional evidence; real assistive-technology testing remains outstanding.

## Motion and interaction

[ADR008](adr/008-explorable-interactions.md) records the shared 100/160/220/360ms
roles. Finite WAAPI effects replace earlier effects on the same target/channel.
Motion-off, OS reduction and hidden-page events cancel effects and reset pointer
presentation; three bounded aura fields remain pausable. The preference moved
from headers to Profile, the end of app content and the About footer.

Selection, navigation, focus, scoring and persistence happen immediately.
Answering no longer fades the entire question; only new verdict marks reveal.
Scroll-derived reader progress tracks immediately. Native dialogs now distinguish
outside backdrop clicks from their own interior padding.

Rapid About stage changes left only one final scene effect, with the latest
selection already visible. Fine-pointer artwork is bounded to 2°/6px; touch does
not trigger it. A stationary pointer scheduled zero additional frames over 1.2s.
In a three-second settled reader sample, both motion-on and motion-off recorded
zero recurring layout/style/JS work and no requested animation frames. Sampled
main-task time was 5.066ms on and 0.698ms off. This headless desktop observation
is not a frame-rate or battery guarantee on phones. See [motion research](research/2026-10-interaction-motion-v069.md).

## PWA, presentation and limits

The new interaction, brand and onboarding CSS/modules are precached in `sw.js`.
Tests exercise offline About selection and worker coexistence after ordinary HTTP
cache is cleared. Actual screenshots cache when visited; installing does not
imply every lesson/image has downloaded. Manifest identity is unchanged.

About now uses real screenshots within the product story, without a dedicated
gallery. Demo progress/results are disclosed. Content arrays and extra sections
remain editable; [About authoring](../about/README.md) explains how to add them.
A 390px viewport is not a claim of physical iPhone testing.

No physical iPhone/Safari install, Android hardware/battery, full assistive-
technology audit or participant study was performed. Simulated browser install
events do not establish universal platform support. Future priorities and a
manual review route are in the [review guide](design/interaction-backlog-v069.md).

## Reproduce

Start `python3 -m http.server 8012 --bind 127.0.0.1 --directory /workspace`.
From `/workspace/english-prep`, run `npm run check` and the eight Python suites
listed above with `--base-url http://127.0.0.1:8012/english-prep`.

```sh
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node tools/verify-ui.mjs http://127.0.0.1:8012/english-prep
```

Generate the screenshots with `python3 tools/capture-portfolio.py --base-url
http://127.0.0.1:8012/english-prep`. Tool locations are environment-specific;
recheck them after restoring a workspace. The [four-pass record](audit/interactions-v0.69.md)
explains diagnosis, integration and final corrections. Checks here describe this
machine and checkout, not a future environment or physical-device session.
