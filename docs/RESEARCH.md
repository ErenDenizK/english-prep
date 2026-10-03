# Research and rationale

Research date: 3 October 2026. This redesign applies learning and accessibility guidance to the full `test` source at `39dcd46`: **10 topics, 60 article lessons, and 241 questions**. The existing corpus and its exam-coverage limits are retained. No learner interviews, usability study, or outcome experiment was conducted during this pass.

## Audience and source evidence

The source README describes an English-capable learner with gaps in academic terminology and conceptual distinctions: competence acquired through use, without the grammar labels that a university proficiency examination assumes. That description is repository evidence, not a newly recruited research sample.

This supports keeping Turkish teaching prose, English examples and grammar names, contrast-based articles, topic context, and detailed question feedback. It does not justify treating every learner as a novice in English or promising a general proficiency gain from this interface alone.

## Public sources actually consulted

The following documents were read from their authors' public GitHub repositories. Direct requests to the main W3C, Learning Scientists, PubMed/NIH, IES, and EEF websites were blocked by the environment's proxy. Accessible source links are provided for reproducibility; blocked resources are not counted as consulted evidence.

| Source | Finding in the source | Application and limit |
| --- | --- | --- |
| The Carpentries, **Practice and Learning**: [published page](https://carpentries.github.io/instructor-training/02-practice-learning.html), [verified source](https://raw.githubusercontent.com/carpentries/instructor-training/main/episodes/02-practice-learning.md) | Practice with corrective feedback helps develop usable mental models; formative assessment can expose misconceptions and guide subsequent learning. | Retain immediate answer feedback, explanation of the relevant distinction, and routes back to lessons. Choosing an answer is already a committed response; this evidence does not require adding a second Check button. |
| The Carpentries, **Memory and Cognitive Load**: [published page](https://carpentries.github.io/instructor-training/05-memory.html), [verified source](https://raw.githubusercontent.com/carpentries/instructor-training/main/episodes/05-memory.md) | Working memory is limited. Focused practice and reduced extraneous load can help. Retrieving and applying recently learned information supports consolidation. | Keep the article/question as the primary task, use explicit concept contrasts, and retain optional inline checks. The source does not establish a magic session length or validate this app's existing pretesting claim. |
| W3C, **Understanding Animation from Interactions**: [published page](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [verified source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/animation-from-interactions.html) | Nonessential movement can distract or cause dizziness, nausea, and headaches. Honoring reduced-motion preferences is one recommended approach. | Respect `prefers-reduced-motion` throughout the shell and content; suppress shaking/pop answer effects and decorative looping motion. This guidance is not evidence that animation improves learning. |
| W3C, **Understanding Target Size (Minimum)**: [published page](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [verified source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/22/target-size-minimum.html) | The minimum target is 24×24 CSS pixels with defined exceptions. Greater target size and spacing reduce accidental activation. | Preserve generous full-row answer targets, 44px icon/choice controls, and 48–52px primary controls. Those larger product targets exceed the criterion's minimum; they are not the criterion itself. |
| W3C, **Understanding Contrast (Minimum)**: [published page](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [verified source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/contrast-minimum.html) | Normal text generally requires 4.5:1 contrast and qualifying large text 3:1. Thresholds cannot be rounded up. | Measure actual foreground/background combinations in each theme. Pale reference captions and quiet decorative lines cannot be assumed adequate for essential text and controls. |

The Carpentries material is an evidence-informed guide for adult technical education, not a controlled study of English exam preparation. Applying it to this product is an inference. The redesign retains the source's pedagogy and makes the pre-reading question optional and initially collapsed; it does not claim to have independently verified the source's stronger assertions about pretesting benefits.

## Visual references and palette reasoning

The user supplied style packages for [Home](reference/design_home/DESIGN.md), [Ventriloc](reference/design_ventriloc/DESIGN.md), [Monopo](reference/design_monopo/DESIGN.md), and [Raycast](reference/refero-design.md). These are visual references, not educational research. Their normalized token exports and reconstructed examples should be interpreted rather than pasted as product requirements.

Margin uses warm paper and dark ink in light mode, with a subdued dark companion. Home and Ventriloc inform editorial grouping and restrained orange punctuation; Monopo informs type hierarchy and space; Raycast informs quiet dark surfaces. The result avoids importing marketing-scale animation or imagery into a reading task. Inter supports the interface while the existing Source Serif 4 continues to distinguish English examples and questions.

Contrast was calculated from the production token values in `css/editorial.css`. Secondary text against canvas measures 5.66:1 in light mode and 9.76:1 in dark mode. Primary button labels measure 13.32:1 and 12.38:1 respectively. Essential control edges against the raised surface measure 3.25:1 and 3.62:1. These measurements cover stated pairs; they do not establish whole-page conformance, typography quality, or a learning advantage for the palette. See [margin-design-system.md](margin-design-system.md) for the actual semantic values.

## Product decisions versus findings

- **Direct access to material:** remove forced first-visit setup and keep identity/goals optional. This reduces an entry barrier; its effect on use has not been measured here.
- **A calm study index:** show actual corpus size, curriculum search, and a reading/resume action. Daily targets and streaks are not the home page's main task. Existing optional profile functionality remains available.
- **Continuous articles:** retain the source's scrolling lessons and saved reading progress. Optional checks and collapsed pretests do not gate access or completion.
- **Immediate explanation:** preserve one-tap answer submission, the correct-answer rationale, the selected distractor's meaning, and the transferable rule.
- **Honest progress:** show actual performance and retain the source's distinctions between recommendations and evidence-backed weakness claims. Do not convert completion or accuracy into a universal readiness percentage.
- **Content preservation:** keep all lesson/question data unchanged. This pass is an experience redesign, not a fresh linguistic or pedagogical review of the corpus.

## What would validate the design next

Observe representative students find a concept, read an article, optionally attempt a check, resume after interruption, answer a question, and use its explanation to choose a next step. Assess whether they can state the distinction in their own words, whether the curriculum terminology matches their search, and whether progress figures are interpreted correctly.

Functional browser checks, cache-isolation tests, and contrast measurements support implementation quality. They do not replace learner testing, a screen-reader review, or evidence of longer-term learning outcomes. The full previous interface remains available for comparison; no comparative usability claim is made without such a study.
