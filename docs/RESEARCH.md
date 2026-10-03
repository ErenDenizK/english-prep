# Research and rationale · v0.67

Research access date: **4 October 2026**. The app retains the full source corpus: **10 topics, 60 scrolling articles, 241 questions and 723 option notes**. No learner interviews, comparative participant usability study or educational-outcome experiment was conducted.

The current decision is [ADR 006](adr/006-reading-hierarchy-and-atmosphere.md). Its evidence is separated into:

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
| W3C explanatory sources | Test contrast, color-independent meaning, reflow, spacing overrides, semantic relationships, focus and motion obligations. | Whole-app accessibility certification from a token table or a single automated scan; AA and AAA criteria must remain distinct. |

Primary sources and unsuccessful access attempts are recorded in the detailed reports. Blocked live pages are not presented as inspected screenshots. The supplied [Raycast](reference/refero-design.md), [Home](reference/design_home/DESIGN.md), [Ventriloc](reference/design_ventriloc/DESIGN.md) and [Monopo](reference/design_monopo/DESIGN.md) packages are visual references, not usability evidence.

## Decisions arising from the evidence

**Choose semantic hierarchy, not a prescribed number of fonts.** The selected working-family alternative uses Inter with different roles for page title, section heading, form name, pattern, reading paragraph, short annotation, control and metadata. A serif H1 alternative remained viable and changed no measured body-reading geometry; a serif reading lane required a larger optical size and increased mobile wrapping. Uniform 18px across every teaching role was rejected because it flattened hierarchy.

**Inspect containers as well as type.** In the 390px comparison, removing nested feedback framing recovered 42px of text width. Baseline-to-candidate wrap reduction cannot be attributed solely to the font. Within-pair and between-group distances also carry meaning, allowing repetitive article rules and ornamental topic initials to leave the interface.

**Give each color a job.** Cool neutral surfaces, two neutral text roles and one blue-gray interaction accent separate content from chrome. Correct/incorrect states use quiet fills, glyphs and verdicts while the answer text remains neutral. Supporting text is for short supporting roles, not every second teaching paragraph. Contrast calculations select viable pairs; visual judgment and the owner's review remain necessary.

**Bound decorative movement.** A faint atmosphere makes one 3.6-second movement of at most 8px and then stays still. It does not animate behind article or quiz text; reduced-motion/forced-color handling and composited contrast are explicit contracts. Duration, displacement and opacity are product choices, not scientifically optimal values. Avoiding persistent movement also avoids adding a pause/settings flow to the study application.

**Simplify optional setup.** Explain Eğitim and Test and optionally collect a name. Remove exam-date, goal, streak and absence-reminder UI while preserving old backup fields. Real reading progress, accuracy and mistake review remain useful. The effect on engagement has not been measured.

**Keep product presentation separate from study.** Restrained branding, voluntary installation and the editable `/about/` page come after the learning-interface work. About describes both the product and its construction. Installability, cached offline behavior and a stable manifest identity require integration checks; they are not guaranteed by adding icons.

## Verification and unanswered questions

Implementation verification belongs in [VALIDATION.md](VALIDATION.md), not in the research conclusions. The required checks include actual role styles, palette pairs and aura overlap, full teaching blocks, option stability, 320px reflow, enlarged text, keyboard access, finite animation, install outcomes and offline nested routes. The preserved source material and original interface must remain unchanged.

A future learner study should observe concept finding, reading and explanation use, ask learners to express the distinction in their own words, and test whether the hierarchy helps them resume after interruption. Compare alternatives with representative users before claiming comfort, speed or learning gains. A successful automated check cannot invalidate the owner's report that a screen remains hard to read.
