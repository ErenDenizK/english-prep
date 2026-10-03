# Research and rationale · v0.66

Research access date: **3 October 2026**. The product retains the full `test` source corpus at `39dcd46`: **10 topics, 60 scrolling articles, and 241 questions**. No learner interviews, comparative usability study, or educational-outcome experiment was conducted for this redesign.

The detailed evidence matrix, inspected sections, source URLs, failed-access record, limitations, and proposed review protocol are in [2026-10-ui-principles.md](research/2026-10-ui-principles.md). That record contains 22 distinct evidence entries covering Material, Microsoft/Fluent, W3C, and The Carpentries. It is research and guidance, not a claim that its recommendations were all implemented or empirically validated. Current implementation is specified in [EXPERIENCE.md](EXPERIENCE.md) and [margin-design-system.md](margin-design-system.md).

## What the evidence supports

| Evidence | Practical implication | Limit |
| --- | --- | --- |
| Repository audience description | Keep Turkish conceptual explanations, English examples, stable grammar terminology, and meaningful contrasts for learners who already use English. | This is product/source evidence, not a recruited learner sample. |
| Material type/color roles and Microsoft/Fluent typography, spacing, adaptive layout, navigation, and themes | Use complete text roles, semantic color pairs, consistent grouping, bounded reading lines, and useful adjacency on larger windows. | Platform guidance does not prescribe this web app's exact font sizes, breakpoints, or architecture. |
| W3C contrast, non-text contrast, reflow, text spacing, focus, targets, use of color, visual presentation, and motion | Test actual surfaces and states, enlarged text, 320px layout, short fixed-shell windows, reachable focus, semantic answer feedback, and reduced motion. | AA and AAA criteria differ. A passing palette, one screenshot, or one focus outline does not certify the whole app. |
| The Carpentries on formative feedback, cognitive load, and expertise | Preserve clear corrective explanations, conceptual connections, optional checks, stable terminology, and uncluttered reading. | Adult technical-teaching guidance is applied by inference; it is not a controlled English-exam study or proof of an optimal session length. |

All substantive sources used in the detailed record were read from official public repositories after direct-site restrictions. Apple HIG, NN/g, and primary learning-paper endpoints that could not be read are documented as unsuccessful access, not cited as supporting evidence. The record distinguishes normative requirements, explanatory guidance, implementation tokens, and teaching synthesis.

## Visual references and product choices

The supplied [Raycast](reference/refero-design.md), [Home](reference/design_home/DESIGN.md), [Ventriloc](reference/design_ventriloc/DESIGN.md), and [Monopo](reference/design_monopo/DESIGN.md) packages are aesthetic inputs. Their marketing layouts and reconstructed token exports do not demonstrate usability or learning outcomes.

The final direction prioritizes dark neutral surfaces, warm readable text, restrained emphasis, and an academic reading hierarchy. Light remains a complete option; System is an explicit saved choice that follows OS changes. The user's dark-priority brief determines the initial theme. Consulted evidence does not establish that dark mode universally improves comfort or comprehension.

Inter serves UI and Turkish teaching prose; existing Source Serif 4 serves English examples and questions. Relative type roles, readable supporting text, section hierarchy, and a bounded article measure are implementation decisions consistent with the guidance. They are not evidence that one typeface pairing is educationally superior.

## Decisions and their boundaries

- **Direct access:** the curriculum and reading action precede optional identity/goals. No forced onboarding or progress spectacle is needed to start reading; the effect on engagement has not been measured.
- **Continuous source articles:** optional pretests start collapsed, and inline checks never gate reading or completion. Existing content is preserved; stronger source claims about pretesting were not independently verified.
- **Meaningful feedback:** one answer press reveals the rationale, chosen-option note, and transferable rule. Feedback remains until deliberate continuation.
- **Reliable interruption handling:** valid same-tab quiz snapshots retain order, answers, and feedback. Stable IDs prevent duplicate results and allow matching partial progress to advance. This improves implementation continuity; it is not a learning-outcome claim or guaranteed recovery after tab loss.
- **Honest local data:** restore fills missing preferences, preserves local choices, and reports storage failure with retry. A partial rollback is disclosed. Export/share cancellation never counts as success.
- **Honest progress:** completion, recent accuracy, and supported recommendations do not become a universal exam-readiness score.

## Verification and unanswered questions

Production contrast checks cover 112 semantic foreground/background pairs in both themes; current values and precise measurement scope live in the design-system document. [Type/color observations](audit/type-color.md) and [interaction/accessibility observations](audit/interaction-accessibility.md) record browser findings, scenarios, and remaining limits. These checks are implementation evidence, not user research or complete accessibility certification.

The next learner study should observe concept finding, reading, optional checks, interruption/recovery, explanation use, and backup comprehension. Ask learners to state the distinction in their own words and explain what progress figures mean. Evaluate whether Turkish category names match their search vocabulary and whether feedback helps them choose the next task. Only such observation and appropriate longer-term studies could support comparative usability or learning claims.
