# Four review passes — v0.67

4 October 2026, Türkiye time. Research and repeated engineering/design review;
not a recruited-user study. The shipped baseline is `b1d49cc`.

| Pass | Question / evidence | Resulting correction |
| --- | --- | --- |
| 1: research and alternatives | Five reading/information products or systems, three color-system implementations, two palette candidates, actual bundled-font measurements, three integrated type alternatives. | Reject the unshipped all-18px prototype. Choose semantic roles and one working family for this bilingual flow, with explicit alternatives/tradeoffs in ADR006. |
| 2: teaching hierarchy | Actual Unless form/contrast/example/pitfall blocks, topic intros, question/option/feedback and review across320/390/1440. |20px section heads,16px group labels,18px medium patterns,18px prose/examples,16px short annotations;8/16/28px grouping; remove repeated rules and topic initials. Apply reading styles to previously missed topic and results surfaces. |
| 3: interaction and accessibility | Long real tenant question before/after answering; enlarged text/spacing; keyboard, feedback semantics and finite motion. | Reserve status-column width (zero answer reflow); add accessible wrong/right labels in pitfalls; remove duplicated terminal punctuation; stop atmosphere after3.6s and keep reader/quiz opaque. |
| 4: integration and product presentation | Clean first visit, durable offline after HTTP-cache eviction, install accepted/dismissed/error, `/english-prep/` prefix, About and full source sweep. | Preserve installed app identity, persist actually visited JSON before first worker control, retain honest install outcomes, match branding to final palette, use an existing lesson excerpt in About. |

The new [validation record](../VALIDATION.md) reports final executed counts and
limits. The [typography](../research/2026-10-04-typography-evidence.md),
[color/motion](../research/2026-10-04-color-motion-evidence.md), and
[screen hierarchy](../research/2026-10-04-screen-hierarchy.md) reports distinguish
observations, standards, source-derived comparisons and design judgments.

The learning corpus, original application and original source archive remain
unchanged. Removed goal/date/streak/reminder UI does not delete compatible
stored data or old backup fields.
