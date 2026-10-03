# Four-pass refinement record — v0.66

3 October 2026. This round starts from the complete `test` source at `39dcd46` (v0.64), with the first integrated redesign preserved in local commit `f607d0e`. The original application and source archive remain in `original/`. Learning material is unchanged: 10 topics, 60 scrolling articles, 241 questions, and 723 option notes.

The work was divided among research, typography/color, interaction inventory, functional QA, and quiz-state agents, with integration and visual review by the coordinating agent. Review passes are not independent user studies; they are repeated implementation inspections with different questions and measurements.

## 1. Inventory and diagnosis

- Read the full route/component/learning flow and all reference design exports. Treat the supplied sites as visual references for type, color, space, and motion, not as an application specification.
- Record 120 rendered states across narrow phones, tablet, and desktop in both themes. Catalogue every shared renderer and its loading, empty, active, answered, error, and recovery states in the [element inventory](element-inventory.md).
- Measure 48 typography/color combinations and representative reading-line lengths. Find small secondary labels, undersized lesson headings, inconsistent language roles, and dark secondary ink with little perceptual contrast margin at small sizes.
- Read official Material, Microsoft/Fluent, W3C, and educational-design sources. The [source ledger](../research/2026-10-ui-principles.md) distinguishes retrieved evidence from inaccessible sources and design judgment.

## 2. System and flow changes

- Make dark the fresh-visit default while preserving explicit light/dark choices and adding a persistent System choice that follows OS changes live.
- Apply neutral charcoal surfaces, warm ink, clear control edges, semantic answer colors, and a restrained warm accent. Preserve a paper light alternative.
- Use Inter for interface and Turkish explanations, Source Serif 4 for English study material. Raise article-section headings to 16px, supporting text to appropriate 14–15px roles, fields to 16px, and lesson/feedback prose to 17px with 18px wide article text. Express text sizes in rem units.
- Shorten introductory presentation copy, distinguish actual test size from bank size, and preserve topic → scrolling article → optional check → focused practice.
- Retain generous action targets, single-column articles/questions, a 592px wide reading measure, and the fixed mobile action bar. Use opacity transitions and slight control feedback; reduced motion disables nonessential movement.
- Preserve quiz presentation and answers on same-tab refresh, with stable attempt identity and a retryable persistence handoff.

## 3. Independent interaction review and repairs

The next review exercised interruptions and input methods instead of only normal taps:

| Finding | Implemented repair |
| --- | --- |
| Count/theme menus clipped by cards or covered by bottom chrome | Viewport-aware positioning in the native popover top layer, with a body-portal fallback and keyboard behavior retained. |
| A queued scroll immediately closed a newly opened menu | Close only when the actual trigger position changes; ignore scrolling inside the popup. |
| Profile updates destroyed active input/caret; lesson answers destroyed focused options | Restore the corresponding control, selection, and scroll context after rendering. |
| A slow article response overwrote Profile after navigation | Invalidate pending reader requests and stale transition callbacks. |
| Canceled reports became permanently disabled; canceled shares announced success | Explicit cancellation outcomes, retryable actions, accurate feedback. |
| Repeated question review IDs | Unique prompt IDs for each result question. |
| History write failure could duplicate a partially saved attempt | Retain stable identity in the results fallback and only mark successfully persisted results recorded. |
| Cross-day quiz resume attributed new answers to the first day | Optional per-answer timestamps with a legacy date fallback, including daily counts and mistake-book timing. |
| Restore write errors were swallowed | Stage changes, roll back successful writes on failure, keep the reviewed backup available for retry, and report rollback limitations accurately. |
| Short-landscape dialog focused an invisible cancel button | Focus the visible heading when opening a long dialog; preserve Escape and opener return. |
| Enlarged Profile fields expanded the grid | Reflow label/control rows, constrain minimum grid widths, and retain enlarged text. |
| Larger stat labels collided with adjacent cards | Place ring and label vertically within bounded cards. |

See the [interaction audit](interaction-accessibility.md) and [independent code review](pass3-code-review.md) for reproduction and test evidence.

## 4. Integrated acceptance and publication

Final acceptance uses the repository checks, the comprehensive source browser verifier, the expanded article/application suite, focused UX and resume suites, enlarged-text/keyboard checks, actual service-worker/offline checks, and a fresh axe scan matrix. The final executed results and limitations are recorded in [VALIDATION.md](../VALIDATION.md); that file is the authority for counts and pass status.

The final [mobile](../previews/mobile.png), [desktop](../previews/desktop.png), [article](../previews/article.png), and [profile](../previews/profile.png) reference views use the actual app. The [component catalogue](../components.html) uses the same production stylesheet and module-built controls.

Publication targets the existing GitHub Pages `test` branch after verification. It does not replace the protected v0.64 original or change the academic material. Remote publication and live-host verification are separate outcomes and must be reported separately when network policy prevents the latter.

## Deliberate limits

This is a measured engineering/design review, not a usability study with representative students or a complete accessibility certification. Real iOS Safari, assistive technologies, native sharing, and long-term device storage behavior still need device testing. Active quiz resume is tab-scoped and is not included in a progress backup. The app remains a static, local-data application without a backend or new runtime dependencies.
