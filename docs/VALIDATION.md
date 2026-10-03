# Validation — v0.67

4 October 2026 (Türkiye time; 3 October UTC). Baseline: shipped `b1d49cc`.
The original material from `test` commit `39dcd46` remains unchanged: **10 topics,
60 continuous lessons, 241 questions and 723 option notes**. `data/`, `original/`
and `legacy/` have no changes in this round. [v0.66 results](VALIDATION-v0.66.md)
remain separately preserved.

## Executed checks

| Check | Final result |
| --- | --- |
| `npm run check` | **218 unit tests passed**, zero failures/skips; content format/schema and original/current palette checks passed. |
| Production palette | **148 pairs passed**: 112 opaque pairs +36 conservative atmosphere bounds. Dark primary ≥11.31:1, supporting ≥7.36:1, essential edges ≥3.41:1. |
| Comprehensive source browser verifier | **3,376 checks passed in one uninterrupted final run**, including all articles, both themes, mobile/tablet/wide flows, keyboard, backup, errors and offline. Served under `/english-prep/`, matching the production path. |
| `tests/editorial_smoke.py` | **12 scenarios passed** under `/english-prep/`; authored material, source preservation, full study/practice flows, text enlargement and worker coexistence. |
| `tests/quiz_resume_browser.py` | **10 scenarios passed** under `/english-prep/`; validated resume, answer timing, history and failure behavior retained. |
| `tests/ux_refinements.py` | **7 scenarios passed**; current focus/caret flow, deferred navigation, report/backup outcomes and accurate launch counts. |
| `tests/reading_system.py` | **10 scenarios passed** under `/english-prep/`; optional-name intro, installation outcomes, first-visit durable offline, storage failure, role hierarchy, answer geometry and finite/reduced motion. |
| Axe-core 4.10.3 | **37 scans, zero definite violations**:32 main app scans (8 states ×2 widths ×2 themes),5 About scans (320/390/768/1440 plus enlarged text at320). WCAG2 A/AA,2.1/2.2AA and best-practice tags. |
| About integration | Correct real lesson link; no overflow or page errors at320/390/768/1440, including combined enlarged root text/spacing at320; nested-path offline entry passed. |
| Material/original diff | No changed files in `data/`, `original/`, `legacy/` relative to v0.66; all authored strings retained by browser suite. |

Axe left manual-review items for text inside SVG progress rings and a closed
combobox's deferred popup. Actual ring ink is the audited main text color on
the audited canvas; the SVG stroke does not cover its text. Opening the menu
creates exactly one referenced listbox, its active-descendant ID exists,
keyboard selection works, and Escape closes it. These are not presented as an
automated full-conformance verdict.

## Measured reading and motion outcomes

The real Unless forms at390px render section20/28/600, form label16/24/600,
pattern18/30/500, short use annotation16/25.6/400 in supporting ink, and example
18/30/400 in main ink. Article titles are30/36 mobile and36/43 wide. Question
stems are20/32; answer sentences and explanations18/30. Topic introductions
and result review now receive the reading role too.

The supplied long tenant question uses actual bank content. **Every answer
retains identical height and text width before/after a wrong answer at320,
390 and1440px.** Reserving the status column removes the previous30–61px
height jumps. Role/grouping decisions and baseline/alternative comparisons
are in [ADR006](adr/006-reading-hierarchy-and-atmosphere.md) and the
[screen audit](research/2026-10-04-screen-hierarchy.md).

At320px, root text enlarged to24px and WCAG spacing overrides were also
inspected on topic/article/quiz-feedback/results without horizontal text or
control overflow. The longest topic introduction now measures3503px (5.47
640px screens) because its teaching paragraphs use18px instead of16px. Its
bounded regression budget is5.6; prose was not shrunk or omitted to preserve
the old5.25 budget.

The atmospheric layer has fixed colors and one3.6-second,8px transform.
Browser animation inspection confirms it finishes after4seconds, stays finished
across SPA navigation, and is absent under reduced motion. Article and quiz
scroll surfaces are opaque. The worst conservative gradient overlap is
approximately `#1e2528`: main text12.44:1, supporting8.10:1, edge3.75:1.

## Offline and installation boundaries

A fresh-context test reads one lesson before the first worker takes control,
confirms that only visited JSON material was persisted, **clears the ordinary
HTTP cache**, disconnects the browser, then successfully reloads that lesson
and About. An unvisited topic is not silently promised offline. CacheStorage
failure does not prevent online reading. Native install outcomes are synthetic
browser-event tests; no physical iOS/Android installation is claimed. The
manifest's explicit identity preserves its former `start_url` identity.

## Reproduce

No runtime dependencies or build step were added. Start a static server from
the checkout (`npm run serve`) and substitute that URL below. This cloud run
used ports8010 (checkout) and8012 with `/workspace` as the server root to test
the realistic `/english-prep/` prefix.

```sh
npm run check
python3 tests/editorial_smoke.py --base-url http://127.0.0.1:8012/english-prep
python3 tests/quiz_resume_browser.py --base-url http://127.0.0.1:8012/english-prep
python3 tests/ux_refinements.py --base-url http://127.0.0.1:8012/english-prep
python3 tests/reading_system.py --base-url http://127.0.0.1:8012/english-prep
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium npm run verify -- http://127.0.0.1:8012/english-prep
```

The earlier sweep attempts exposed outdated test expectations for the removed
onboarding/reminders and instruction class, plus three root-absolute imports
inside the harness. They were updated to assert current behavior and relative
URLs; meaningful geometry and content assertions remain. The final complete
run above passed after those corrections.

## Evidence limits

Official-source competitor comparisons are not measurements of their live
sites: the proxy blocked those sites. Actual font and English Prep layout
measurements used Chromium and the bundled fonts. No claim of improved reading
speed, universal font superiority, full accessibility certification, or real
assistive-technology/device testing is made. Final visual preference remains
subject to the owner's use. [Current screenshots](previews/mobile.png),
[desktop](previews/desktop.png), [forms](previews/article.png), and
[About](../about/) make the result reviewable.
