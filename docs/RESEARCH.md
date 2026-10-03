# Research and rationale · v0.69

Research access date: **4 October 2026**. The app retains the full source corpus: **10 topics, 60 scrolling articles, 241 questions and 723 option notes**. No learner interviews, comparative participant usability study or educational-outcome experiment was conducted.

The current answer-status, motion and product-presentation decision is [ADR 008](adr/008-explorable-interactions.md):

- [Answer-status research](research/2026-10-status-colors-v069.md): official Fluent/Radix/WCAG source roles, three candidates rendered through real answer/feedback components, dark/light contrast and aura composition. Muted jade/coral replaces iris/apricot verdicts; passing contrast alone did not make the earlier states appropriate.
- [Interaction-motion research](research/2026-10-interaction-motion-v069.md): official Fluent/Material timing sources, MDN/W3C lifecycle and accessibility evidence, measured application behavior, finite-effect cancellation and bounded pointer response.
- [Component review](audit/v0.69-component-review.md): 320/390/1440px measurements, menu selection/focus states, native-dialog padding defect, answer geometry and accessible state descriptions.
- [Explorable onboarding design](design/onboarding-v069.md) and [About design](design/about-v069.md): user-paced diagrams, shared compact/full brand, integrated responsive captures and editable study/architecture stories.

[ADR 007](adr/007-sakura-and-purposeful-motion.md) retains the Sakura background/brand foundation and linear progress design. Its [palette research](research/2026-10-sakura-palette.md), [purposeful-motion research](research/2026-10-motion-language.md), [interface diagnosis](audit/v0.68-interface-diagnosis.md), [portfolio plan](design/about-v0.68-plan.md) and [motion engineering review](audit/v0.68-motion-engineering.md) describe that revision. The old answer-status hues, header pause control, 180/420ms role choices and dedicated screenshot gallery are superseded by ADR 008.

[ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) still governs the retained reading typography. Its palette, finite atmosphere and one-page introduction describe the previous version. Earlier evidence is separated into:

- [Typography evidence and alternatives](research/2026-10-04-typography-evidence.md): OpenStax, Wikipedia, Hypothesis, GOV.UK and USWDS official frontend sources; actual bundled-font specimens; integrated A/B/C browser comparisons on the owner's Unless lesson and incorrect-answer feedback.
- [Color and motion evidence](research/2026-10-04-color-motion-evidence.md): VS Code, Primer and JupyterLab source palettes; semantic color contracts; two measured candidate systems; finite atmosphere and motion constraints.
- [Screen hierarchy audit](research/2026-10-04-screen-hierarchy.md): baseline/prototype teaching roles, grouping and rendering defects across the actual application.

The [3 October principles research](research/2026-10-ui-principles.md) remains useful background for Material, Microsoft/Fluent, W3C and The Carpentries. Historical audits describe their measured revision; they do not certify the latest one. Current implementation contracts are in [EXPERIENCE.md](EXPERIENCE.md) and [margin-design-system.md](margin-design-system.md).

## Evidence and limits

| Evidence | What it supports | What it does not establish |
| --- | --- | --- |
| Owner feedback, supplied screenshots and repository audience | Refine academic distinctions through Turkish explanation and English examples; address the reported reading difficulty without changing article/test structure. | A recruited learner sample or measured prevalence of a difficulty. |
| Official product/frontend typography sources | Several coherent family strategies exist; roles combine family, size, leading, weight, measure and grouping. | Live production computed styles: comparable sites were proxy-blocked, so reported values are explicitly source-derived. |
| Actual-font specimens and integrated browser alternatives | Concrete x-height, wrapping, text-height and grouping tradeoffs for the supplied content. | Reading speed, comprehension, reduced fatigue or universal superiority of a font family. |
| Official product palette tokens and recalculated pairs | Separate surface, text, action, focus and correctness roles; verify actual foreground/background combinations. | A universally comfortable dark palette or proof that a WCAG-passing color is pleasant. |
| Actual answer components rendered with three status palettes | Compare jade/coral, teal/rose and sage/clay in their real text, shape, surface and brand context; preserve option geometry and literal verdicts. | Universal recognition of a hue, color-vision certification or the owner's eventual preference. |
| Browser interaction measurements and official motion/API sources | Identify missing cues and repeated fades, preserve immediate state/focus, define cancellation and bounded decoration. | A scientifically optimal duration, physical-phone frame rate, reduced battery use or observed engagement gains. |
| W3C explanatory sources | Test contrast, color-independent meaning, reflow, spacing overrides, semantic relationships, focus and motion obligations. | Whole-app accessibility certification from a token table or a single automated scan; AA and AAA criteria must remain distinct. |

Primary sources and unsuccessful access attempts are recorded in the detailed reports. Blocked live pages are not presented as inspected screenshots. The supplied [Raycast](reference/refero-design.md), [Home](reference/design_home/DESIGN.md), [Ventriloc](reference/design_ventriloc/DESIGN.md) and [Monopo](reference/design_monopo/DESIGN.md) packages are visual references, not usability evidence.

## Decisions arising from the evidence

**Choose semantic hierarchy, not a prescribed number of fonts.** The selected working-family alternative uses Inter with different roles for page title, section heading, form name, pattern, reading paragraph, short annotation, control and metadata. A serif H1 alternative remained viable and changed no measured body-reading geometry; a serif reading lane required a larger optical size and increased mobile wrapping. Uniform 18px across every teaching role was rejected because it flattened hierarchy.

**Inspect containers as well as type.** In the 390px comparison, removing nested feedback framing recovered 42px of text width. Baseline-to-candidate wrap reduction cannot be attributed solely to the font. Within-pair and between-group distances also carry meaning, allowing repetitive article rules and ornamental topic initials to leave the interface.

**Separate brand from answer status.** Plum-neutral surfaces and cherry/Sakura brand roles remain from ADR 007. Its iris/apricot verdicts passed contrast but overlapped secondary-action and attention meanings, and the owner rejected them. Three actual-component alternatives were compared before selecting low-chroma jade/coral. The conservative aura minima are 7.26:1 correct / 6.69:1 incorrect in dark and 5.43:1 / 5.13:1 in light. Literal Doğru/Yanlış text, check/cross shapes, correct-answer text and accessible state descriptions carry meaning independently of hue. Whole answer sentences and cards remain neutral. Contrast calculations select viable pairs; they do not settle visual preference.

**Give motion one owner and a purpose.** The 100/160/220/360ms role scale covers press, local reveal, navigation and local completion. CSS handles ordinary states; shared finite WAAPI effects handle explicit events and cancellation. State, scoring, focus and navigation never wait for an effect. Menus enter from their positioned edge; answer marks settle without moving option text; a committed answer no longer fades the entire question again. Native dialog behavior stays intact, including corrected padding-versus-backdrop detection. Quiet input/search/reading states are deliberate exclusions from decorative animation. The scale and displacement limits are design choices informed by documented systems, not scientifically optimal values.

**Keep atmosphere bounded and controllable.** Three low-opacity cherry/iris/apricot fields drift behind all routes, under the existing measured overlap limits and opaque foreground controls. The owner's request removes the top pause button; Profile, the scrolling-content footer and About's footer expose the same persistent preference. Reduced motion wins, hidden pages pause background movement and cancel finite effects, and forced colors removes decoration. About's artwork alone can respond to a fine hover pointer, with at most 2° tilt and 6px movement. Text and hit targets stay fixed; touch and keyboard retain the same information. No idle JavaScript frame loop or unmeasured fourth light field is introduced behind teaching text.

**Explain through voluntary exploration.** The introduction remains three skippable pages: Education, Test and an optional name. The first two contain labeled diagrams with pressed-state controls and changing explanations. They preserve selection on Back, invent no learning questions and write no progress. Exam-date, goal, streak and absence-reminder UI stays removed while old backup fields remain compatible. The effect on engagement or understanding has not been measured.

**Make product presentation explain real actions.** A shared DOM brand supports `ep.` and `english prep.`. About replaces its separate screenshot gallery with a Read/Apply/Return story, supported by responsive captures of the actual app. Selectable architecture nodes explain real content, interface and local-continuity decisions with source links. Plain-text arrays and extra sections remain extensible; every control changes useful content or follows a real destination. The page does not mutate learner progress or require hover to understand a feature. Voluntary installation, caching and a stable manifest identity still require integration checks; icons alone do not establish them.

## Verification and unanswered questions

Implementation verification belongs in [VALIDATION.md](VALIDATION.md), not in the research conclusions. Required checks include actual role styles, palette pairs and aura overlap, full teaching blocks, option stability, 320px reflow, enlarged text, keyboard access, menu positioning, dialog padding/backdrop behavior, immediate state/focus, rapid replacement/cancellation, bounded pointer response, persisted/OS/hidden-page motion, install outcomes and offline nested routes. All screenshots are browser viewport captures with demonstration state; they are not evidence of physical iPhone/Safari testing. The preserved source material and original interface must remain unchanged.

A future learner study should observe concept finding, reading and explanation use, ask learners to express the distinction in their own words, and test whether the hierarchy helps them resume after interruption. Compare alternatives with representative users before claiming comfort, speed or learning gains. A successful automated check cannot invalidate the owner's report that a screen remains hard to read.
