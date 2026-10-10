# Validation — v0.66

Validated on 3 October 2026 against the full `test` source at `39dcd46`. The redesigned app retains **10 topics, 60 scrolling article lessons, 241 questions, and 723 option notes**. All **12 data files** are byte-identical across the current app, `original/data/`, and that Git commit.

## Reproduce

Serve the repository with `npm run serve`, then run:

```sh
npm run check
python3 tests/editorial_smoke.py --base-url http://127.0.0.1:8000
python3 tests/quiz_resume_browser.py --base-url http://127.0.0.1:8000
python3 tests/ux_refinements.py --base-url http://127.0.0.1:8000
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium npm run verify -- http://127.0.0.1:8000
```

Python Playwright, Node Playwright, and Chromium are external verification tools supplied by this cloud environment; verify their paths on another machine. This run used the same static server on port **8001** because 8000 was occupied. No application build step or runtime dependency was added.

## Executed results

| Check | Result |
| --- | --- |
| `npm run check` | **218 unit tests pass**, none failed or skipped; content formatting/schema and both palette systems pass. |
| Full article/application browser suite | **12/12 scenarios pass** in one final run. Includes every authored article string, original-version practice, both themes, layout, input, backup, and real offline service workers. |
| Quiz-resume browser suite | **10/10 scenarios pass**. The three midnight/quota scenarios also passed after the final visible save-warning change. |
| Focused UX browser suite | **7/7 scenarios pass**, covering focus/caret, stale route requests, accurate launch counts, cancel/retry outcomes, and unique review IDs. |
| Source browser verifier | **All sections verified.** The initial run passed 453 checks before an invalid synthetic result fixture stopped execution. The remaining sections completed 3,065 checks; four outdated copy/focus expectations were corrected, and the affected functions then passed **84/84** checks. This covers 3,518 sweep checks with the corrections verified separately, not an uninterrupted single-run pass. |
| Theme-specific browser checks | **48/48 pass** across three entry pages, fresh dark defaults, explicit light, saved System, live OS changes, and matching browser chrome. |
| Axe-core 4.10.3 | **48 current scans, zero definite violations**: 32 main-state scans plus 16 new popup/dialog/feedback scans, across dark/light and 320/1440px. The additional scans include WCAG 2.2 AA tags. |
| Production palette | **112 contrast pairs pass**. Minimum secondary ratios: dark **9.20:1**, light **4.92:1**. Dark secondary APCA minimum: **Lc 74.5**. Minimum control boundaries: dark **3.98:1**, light **3.12:1**. |
| Material/original audit | All 12 data files unchanged. All 55 preserved runtime files present; the hosted copy differs only in its README preservation note and service-worker cache isolation. |

The source verifier's synthetic results fixture previously claimed 9/10 with an empty question list. It now uses actual bank questions and the production scoring/handoff functions. Geometry, target-size, score, reading-content, and offline assertions were retained. The other changed expectations match the deliberately shorter introduction, visible dialog-heading focus, and accurate no-op restore message.

One existing content warning remains unchanged: `academic-nouns-adjectives-t13` and `academic-nouns-adjectives-t16` offer the same set of options. The material was not rewritten during this design task.

## Behavior covered

- All topic introductions and 60 articles preserve their source prose, contrasts, forms, examples, pitfalls, decisions, questions, and explanations. Lessons complete by scrolling; pretests and inline checks remain optional and unscored.
- Mixed, topic, category, and mistake-book practice retain scoring, selected-option notes, early finish, results review, and relevant study routes.
- Refresh/back navigation preserves the same quiz questions, shuffled options, answers, feedback, and position. A stable identity advances one attempt instead of duplicating it. Explicit new launches start fresh.
- Answer timestamps survive a test resumed across local midnight. Daily activity, latest correctness, mistake-book spacing, and recent-session statistics use the actual answer time; older records remain readable.
- Transient and persistent history failures retain a retryable result handoff. Failed saves have visible recovery text. Backup merging preserves longer matching attempts and known answer times.
- Restore stages writes and rolls back failures where possible; it never reports failure as success. Pending files can be retried, stale file reads cannot replace newer input, and native share cancellation remains neutral.
- Keyboard focus and selection survive profile rendering and lesson-answer replacement. Slow lesson requests cannot reopen old content after navigation. Listboxes remain reachable above fixed chrome, including browsers without native Popover support.
- 320/390px enlarged-text checks cover computed text doubling, a 200% root font preference, and WCAG text-spacing overrides. Profile controls reflow. Quiz action bars remain stable at 320, 390, 768, and 1440px.
- Root/original workers have independent scopes and caches; both reload visited articles offline. Legacy cached content survives migration. New shell installation bypasses the HTTP cache.

## Evidence and limits

The [four-pass record](audit/refinement-log.md), [full element inventory](audit/element-inventory.md), [type/color measurements](audit/type-color.md), [interaction audit](audit/interaction-accessibility.md), and [independent code review](audit/pass3-code-review.md) retain the findings and repairs. The [research ledger](../research/2026-10-ui-principles.md) distinguishes retrieved sources from inaccessible references and design judgment.

Axe marked SVG ring contrast and closed-popup control references for manual review. The labels use measured text colors; popup IDs and open/closed keyboard behavior were checked separately. Zero automatic violations does not establish complete accessibility conformance. Real iOS Safari, screen readers, native sharing, and sustained student use were not tested on physical devices.

`original/source-39dcd46.zip` contains the exact **55-file runtime source archive**, not the entire repository's historical documentation and tooling. The source commit remains in Git history. Active quiz state is tab-scoped and is not included in exported progress backups.

Final reference views: [mobile](../previews/mobile.png), [desktop](../previews/desktop.png), [article](../previews/article.png), [profile](../previews/profile.png), and [light alternative](../previews/light.png). The [component catalogue](../components.html) loads the production system.
