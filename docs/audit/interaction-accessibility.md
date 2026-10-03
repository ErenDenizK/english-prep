# Interaction and accessibility refinement audit

Audit baseline: `f607d0e`, Chromium at `http://127.0.0.1:8001`, 2026-10-03. This pass supplements the earlier functional and axe checks in [VALIDATION.md](../VALIDATION.md). It concentrates on keyboard use, enlarged text, short viewports, and states that a static screenshot misses. All six findings below have been fixed and their focused regressions pass. The final broad browser verification is recorded separately; earlier sweep totals are not presented as verification of new changes.

## Methods and scope

- Dark theme first; phone widths 320 and 390px, tablet 768px, desktop 1440px. Additional short viewports: 844×390 and 768×360; 720×450 also checks the CSS layout available when a 1440×900 window is zoomed to 200%.
- Keyboard-only disclosure, answer, custom select, and native dialog interaction. Bounds and `elementFromPoint` verify that the active control is actually visible and tappable, rather than merely present in the DOM.
- Text-only 200% stress: in a fresh document, snapshot each element's computed font size and line height, then double both once. Separately set the root font to 32px to exercise the new rem-based interface at a 200% font preference. This is a reproducible CSS stress test, not a claim to emulate a browser's native zoom. The existing 320px tests exercise the layout width relevant to 400% desktop zoom from 1280px.
- Text-spacing stress: line height 1.5, paragraph spacing 2em, letter spacing .12em, word spacing .16em. Check document and scrolling-region horizontal overflow, with article and controls still available.
- Source content and rendered reading order, language metadata, non-gating checks, reduced-motion computed styles. Theme persistence across all three HTML entry points is rechecked against the new explicit dark/system behavior.

## Findings and status

| Priority | Finding and reproduction | Evidence / status |
| --- | --- | --- |
| High | Test → Soru sayısı: open the count menu, then press End. The active `Tümü` option can be clipped by the hero or covered by fixed navigation. | Baseline at 320×640, 844×390, 768×360. At 844×390 the menu extended y210–394; at 768×360 y195–379. Keyboard still committed the hidden choice. Resolved: native top-layer placement and internal active-row scrolling pass at all three sizes. Keyboard navigation, pointer selection after focus scrolling, scroll dismissal, and the no-Popover fallback are covered by a retained regression. |
| High | Answer an optional pretest or inline lesson check with Enter. Replacing the check removes the focused option. | `document.activeElement` becomes `BODY`; the following Tab leaves the question context. Resolved: focus is restored to the corresponding answered option without scrolling. Pretest and inline-check keyboard regression passes. |
| Medium | Profile → Yedekten geri yükle; Shift+Tab twice from cancel reaches the file input. Its generic visually-hidden rule stops hiding it while focused. | At 320px dialog content width grows from 278 to 367px; landscape 350 to 367px. Resolved: the file input remains visually clipped while its visible label receives the focus outline. Focused-input reflow and Escape/focus-return regression passes. |
| Medium | At text-only 200%, the inline three-item corpus facts establish an excessive minimum content width. | At 320px the home view grows to 383px and the scrolling region to 399px, clipping the right side of the entire page. At 390px the scrolling region reaches 407px. The first article also grows to 324px at 320 due to its long enlarged title. Resolved: structural minimum widths and wrapping were corrected; 320/390px enlarged-text and spacing regression passes for home and article. |
| Low | The restore dialog initially focuses its bottom cancel action in a short viewport. | At 844×390 the title starts at y−105, and at 768×360 y−135. The dialog can scroll and actions remain available, but the opening context is out of view. Resolved: initial focus now goes to the visible dialog heading. The title and actual focus remain inside the dialog at both short landscape sizes; Escape returns to the opener. |
| Medium | A 200% root-font preference expands Profile controls after the rem conversion. | At 320px, an 11rem date input becomes 352px; the row expands to 386px and the scroll region to 402px. Daily-goal choices also cross the right edge. Resolved: input limits, wrapping settings rows, and constrained grid tracks keep Profile within 320px. The enlarged-text regression passes for both root font and doubled computed text. |

## Baseline behavior retained

- Optional pretest starts closed. Enter opens its native disclosure; Tab reaches an answer; Space on the summary closes it. Answer feedback stays inside the open disclosure. Inline checks do not gate scrolling or lesson completion.
- The first article has one H1 followed by H2 block headings in source order. Form names, patterns and English examples carry `lang="en"`; usage labels inherit Turkish. Contrasts, forms, examples, pitfalls, decisions and checks remain in the authored sequence.
- At normal text sizes, sampled home, Test, Profile, topic introduction, article, quiz and feedback states have no horizontal overflow. Sampled controls meet the project's 44px target minimum.
- Native reset confirmation starts on cancel; Escape closes it and restores the opener at phone and short landscape sizes. Browser chrome can receive focus when tabbing beyond a native dialog; a temporary `BODY` active element alone is not evidence of an application focus-trap defect.
- Reduced motion disables answer/route animations and smooth scrolling. The inherited universal transition duration computes to 0.00001s, which is effectively immediate.
- Text-spacing stress produced no horizontal overflow in the sampled states. Short descriptions deliberately clamped to two lines are distinguished from loss of the article's teaching content.

## Standards used

These links define test intent; automated measurements alone do not establish complete WCAG conformance or replace screen-reader testing on real devices.

- [WCAG 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [WCAG 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [WCAG 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WCAG 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [ARIA select-only combobox example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)

## Targeted verification during refinement

- `test_count_popup_keyboard_visibility_in_short_viewports`: passes with on-disk styles, including native and fallback popup placement, active-option hit testing, keyboard choices, and the below-fold pointer-opening regression.
- `test_lesson_keyboard_answers_keep_focus_and_restore_file_reflows`: passes for pretest/inline focus, stable reading position, focused file-control reflow, and Escape/focus return.
- Home/article 200% text stress and WCAG text-spacing checks pass at 320/390px. The expanded retained scenario also passes Profile at both widths, with doubled computed text, 200% root font, and text-spacing overrides.
- At 200% root font size, quiz and incorrect feedback retain their width and the action bar moves **0px** at 320×720, 390×844, 768×360, and 1440×900.
- The updated source theme checks pass **48/48**: explicit light on all entry pages, fresh dark under both OS schemes, saved system preference, live OS change, matching browser chrome, UI selection, and reload persistence.

- Axe-core 4.10.3: **16 additional scans, zero definite violations**, covering open Profile popup, restore dialog, wrong pretest feedback, and correct quiz feedback at 320/1440px in both themes. Together with the parent's fresh 32-state pass, this gives **48 current scans**. The additional pass includes WCAG 2.2 AA tags.
- Axe still requests manual review of popup `aria-controls`; the referenced menu and active-option IDs exist, and retained keyboard/hit-test checks exercise the real relationship. It also cannot infer textarea contrast inside the native dialog: measured rendered foreground/background ratios are **14.73:1 dark** and **15.01:1 light**, with the field fully inside the dialog. The earlier score/SVG contrast caveat remains distinct.

## Material preservation

`diff -qr data original/data` and `git diff --exit-code 39dcd46 -- data` both return exit 0. All **12 content files** match the original source commit: **10 live topics, 60 lessons, 241 questions**.

The preserved app has all **55 expected runtime files**, with no missing or extra runtime paths. Compared with source commit `39dcd46bd6c9388ed1a5ad017d82c0ad72d81c19`, only the preservation README preface and scoped service-worker adaptation differ. `original/source-39dcd46.zip` contains 55 byte-identical runtime files, including the untouched source service worker. It is a runtime-source archive; the full source commit has 420 files including repository documentation, tooling, tests, and configuration.

## Final browser verification

The complete editorial regression suite passes **12/12 scenarios** against the frozen app at `http://127.0.0.1:8001` (28.49s):

```sh
python tests/editorial_smoke.py --base-url http://127.0.0.1:8001
```

All source-verifier sections were exercised, with recovery runs reported explicitly:

1. The standard `tools/verify-ui.mjs` command completed **453 passing checks**, then stopped at an invalid visual fixture. That fixture claimed a 9/10 score with no question results; stricter session validation correctly rejected it. It now uses ten real bank questions and a consistent scored result while retaining the original score, ring, and no-confetti assertions.
2. The unchanged remaining driver sections completed **3,065 checks**. Four assertions still expected replaced home copy, the old restore focus target, and the old no-op restore message. All geometry, touch, lesson, offline, component-gallery, and accessibility checks passed.
3. Those four expectations were updated to the approved interface. The two complete affected functions then passed **84/84** checks, including visible initial dialog focus and duplicate-free restoration.

This covers **3,518 sweep checks**, with no outstanding failure after the focused rerun; it was **not one uninterrupted passing run**. The 84 repeated checks are not added to the sweep total. The service-worker upgrade test restored the actual repository `sw.js` to `english-prep-v0.66`; no temporary `vTEST` marker remains.

The external logs are `/tmp/english-prep-refinement/source-final.log`, `source-remaining.log`, `source-corrected.log`, and `editorial-final.log`. The resumed drivers were generated from the current repository verifier and ran against its actual application, component gallery, and service worker. No geometry assertion was removed or loosened.
