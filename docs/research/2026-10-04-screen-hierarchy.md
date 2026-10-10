# Screen hierarchy audit — 4 October 2026

Status: research and candidate contracts, before the next implementation decision. This report does not accept the uncommitted “one reading voice” prototype. The useful distinction is **semantic role**, not a target number of fonts or colors.

## Scope and method

Read `CLAUDE.md`, the current education, answer, feedback, prompt, results, profile and onboarding renderers, and both stylesheet layers. The owner's current instructions supersede the historical glass, streak and four-step onboarding descriptions in that file. Preserve scrolling lessons, topic-based tests, optional checks, real learning progress, local data and the two navigation modes.

The released baseline was served from an archive of commit `b1d49cc` (v0.66) on port 8011; the frozen uncommitted draft was served on 8010. Chromium loaded the actual local font files with service workers blocked and reduced motion enabled. The study index, topic introduction, Unless lesson, Test index, Profile and onboarding were visited at **320, 390 and 1440px**: 36 screen/viewport observations. Six real four-question category sessions added question, answered-question and results observations at the same widths. The random question order was not seeded; before/after answer geometry was compared within the same question, not falsely treated as an exact cross-version text comparison.

Computed styles, dimensions, headings and screenshots were recorded in `/tmp/ep-hierarchy-audit/`; the temporary files are reproducibility evidence for this session, not application dependencies. The static screen observations did not show page-level horizontal overflow. That is a narrow result, not proof that all content or enlarged-text states pass.

The specific article was `closest-meaning-unless-vs-if-not-vs-otherwise`, matching the owner's screenshots. Source and browser observations are distinguished below. No reading-speed study or user preference experiment was performed.

## Findings from the actual screens

### 1. The existing difficulty is not “three fonts”

The article uses two loaded families, Inter and Source Serif 4. Its many perceived voices come from role assignments that change several variables simultaneously. At 390px, the forms block measures:

| Role and actual content | Released v0.66 | Frozen uniform draft |
| --- | --- | --- |
| Section heading, “Üç kalıp, aynı sahne” | Inter **16/25.6px**, 600, primary ink | Inter **18/30.6px**, 600, primary ink |
| Form name, “unless” | Inter **13/20.8px**, 600, accent, uppercase | Inter **18/30.6px**, 600, primary ink, sentence case |
| Pattern, “Unless + olumlu cümle…” | Source Serif 4 **19/33.25px**, 400 | Inter **18/30.6px**, 400 |
| Instruction, “Başta gelen koşul” | Inter **14/22.4px**, 500, secondary ink | Inter **18/30.6px**, 400, primary ink |
| Example, “Unless the code is entered…” | Source Serif 4 **19/33.25px**, 400 | Inter **18/30.6px**, 400 |

The whole released lesson includes nine nominal sizes at 390px: 13, 14, 15, 16, 17, 18, 19, 22 and 32px, including controls and the title. This count is a diagnostic, **not** a criterion that nine is intrinsically wrong. The problematic relationship is that a local example can be larger than its structural heading, while a sentence explaining the concept is given a metadata treatment. The prototype reduces the count to four but makes pattern, annotation, example and section body visually too similar. Neither counting families nor minimizing sizes establishes hierarchy.

The current draft also leaves a 12px home eyebrow in place. A blanket claim that every text is now at least 14px would be false.

### 2. Existing spacing is partly sound; removing lines needs local compensation

At 390px, the lesson grid gap is **28px**, and labelled blocks have **16px additional top margin**. The effective boundary between those sections is therefore already about **44px**. Adding more whitespace everywhere would increase scrolling without solving the form ambiguity.

Within the forms block, the label-to-row gap is **8px**, pattern-to-use-to-example gaps are **4px**, and the next pattern within the same form is only **8px** away. In the baseline, separate form groups additionally carry a repeated rule and 24px top padding; the draft removes these and retains a 28px list gap. Removing the repeated lines is reasonable, but the same-form rows need explicit pattern emphasis and slightly clearer grouping, because the teaching unit contains three distinct roles.

A useful candidate rhythm is: 4–8px for a directly associated annotation, 8–12px from a local label to its unit, 16–20px between two patterns within one form, 24–28px between independent example/form units, and 36–48px between instructional sections. These are proposed relational values, not universal accessibility thresholds. The invariant is that an explanation sits visibly closer to its own example than to the next independent example.

### 3. A real answer-state rendering defect is independent of palette

`renderOptions()` inserts `.option__mark` only after an answer. It occupies flex width that was previously available to the answer text. At 320px, in a real Unless-category session, the draft's chosen option gained **30.59px** of height and the revealed correct option gained **61.19px**. A baseline sample also gained 59.38px and 29.69px. These are one- and two-line rewraps caused by adding the state icon.

Reserve the same icon/label space before and after answering, or position the glyph in permanently reserved padding. Verify the option text width and row height before/after with the longest complete-sentence answers. Keeping the fixed footer stable is necessary but does not catch this separate text reflow.

The quiz intentionally scrolls to feedback, so raw viewport `y` deltas across answer transitions are not a valid measure of layout shift. Compare row heights, available text width and document/scroll-relative positions; inspect the fixed action bar separately.

### 4. Some surfaces escape the broad reading selector

The draft article and feedback use 18px, but the topic introduction still uses 16px prose and 14px section labels. The results review also remains 16px: `.review .t-en` does not affect the rendered review because the results renderer does not assign that class. Thus a sentence can have different reading treatment when it appears in an article, question feedback and results, without a defined role-based reason.

Assign a real reading container/role to the topic introduction and result review. It is acceptable for a summary result heading or a short reminder to differ from the live question, but the explanatory paragraphs are still educational reading and should not silently inherit generic UI body styles.

### 5. A few semantic relationships are absent from accessible output

The pitfall renderer shows an X and a check with color, but its SVGs are hidden from assistive technology and the sentence wrappers carry no textual “wrong example”/“correct example” equivalent. The two sentences are therefore not identified by their visible status in the accessibility tree. Add a visually hidden text equivalent at each sentence, retaining the original sentence text and language semantics.

The results screen's static shell already supplies its primary H1 (`.bar__title`, “Sonuç”); review and breakdown headings are H2. Preserve this structure. An initial renderer-only inspection overlooked the static shell, but the focused browser check caught that error: promoting the score mode to H1 would create a second primary heading. That proposed change was withdrawn.

Keep the existing question/group `aria-labelledby`, real button semantics, focus preservation and shared live announcement. These encode relationships that the visual redesign must not regress.

## Screen-by-screen candidate contracts

The numbers below are candidates to test with the integrated design. They describe jobs, not language: `lang="en"` stays semantic and must not itself dictate family, size or color.

| Surface/block | Primary reading task | Candidate hierarchy and grouping | Avoid |
| --- | --- | --- | --- |
| Education index | Find a gap and open its topic | One page title around 30–32px; topic title 18px/600; topic description 16/25; progress/count 14/20; group label 16/24/600. Title/description form a unit; count remains peripheral. | Decorative initial-letter blocks; treating the topic description as a disabled label; elaborate progress ornament. |
| Topic introduction | Understand this topic, then choose a lesson | Page title 28–30px; section H2 20/28/600; teaching prose 18/29–30. Examples share the reading lane. Lesson list uses the index's actionable-row contract. | Applying generic settings prose to a long educational introduction; adding a second reading column. |
| Lesson heading | Identify the distinction being taught | Title 28–32px mobile, up to 36px wide, with natural wrap; short topic/position metadata 14/20; summary 18/29. | Shrinking a long title until it fits one line; huge display typography that pushes the first paragraph off a phone. |
| Text block | Read the explanation continuously | 18/29–30 regular, primary ink, 16px paragraph gaps, a bounded reading measure. Inline emphasis 600 only where content supplies it. | Lowering Turkish explanatory content to metadata or changing face mid-paragraph. |
| Contrast block | Compare two or three terms and meanings | Term 18–20px/600; gloss and example 18/29 regular; 8px within each term's unit and 24–28px between units. Heading remains above the term level. | Two columns at 320px; card within card; 400-weight term indistinguishable from its explanation. |
| Forms block | Locate form, read pattern, understand use, see example | Form name 16–18px/600; pattern 18/28 medium; short use annotation 16/25; example 18/29 regular. Keep the use line readable, not tiny. Separate repeated patterns with 16–20px. | Language-defined serif switching; uppercase accent labels alongside unrelated small metadata; every line equal in role. |
| Examples block | Associate sentence and explanation | Example and substantive explanation stay 18px; 8px between pair, 24–28px between units. An isolated short annotation can use the explicit 16px support role. | Automatically making all explanations smaller because they occur second; a line after every example. |
| Pitfalls | Compare wrong/right, then understand why | Stable 20px glyph column; both examples same 18px reading role; visible glyph plus accessible text equivalent; explanation 18/29. One H2 for a run. | Coloring the whole sentence red/green; missing accessible verdict; middle-aligned glyphs on multi-line text. |
| Decision rules | Follow conditions to one outcome | Conditions 18/29; outcome 18/28 medium with arrow and indentation; 8–12px inside a rule, 24–28px between outcomes. | Outcome looking like the next rule's heading; tiny signal chips with different decorative colors. |
| Inline lesson check | Recognize a mode change and answer without leaving the article | H2 20/28/600; task instruction 16/25; stem and options 18/29; one restrained practice surface; minimum 44–48px controls. | Nested bordered cards; changing the answer typography between lesson check and Test. |
| Test stem/options | Read source sentence and compare plausible answers | Category 14–16px support; task instruction 16/25; stem 18–20px/29–31; options 18/29. Reserve verdict space; numbers are 14px metadata. | Larger decorative quote styling for an already long stem; state-driven text movement. |
| Answer feedback | Understand the verdict and reasoning | Verdict 18px/600 with glyph; “Doğru cevap” identifiable label; answer and explanation 18/29–30; paragraphs grouped at 16px; selected-option note separated by space and existing emphasis. | Three families within one explanatory paragraph; saturated backgrounds across every line; report button competing with Next. |
| Results | Locate weak topic, then review explanations | Score is a summary role; review section title 20px/600; question marker 14px; all explanatory review paragraphs use the reading role. Split summary/review only on wide screens. | The unused `.review` selector; forced dense metadata for the longest reading surface. |
| Profile/settings | Change name, appearance or stored data | Page title 24–30px; section titles 18–20px/600; labels/control text 16px; supporting copy 16/25; real statistics 24px plus14px labels. | Exam countdown, goal or streak UI in this requested scope; low-contrast labels; clipping expanded controls. |
| Optional introduction | Understand the app and its two modes | One title; one short purpose paragraph; “Eğitim” and “Test” as 18px/600 headings; 16px body; optional name; one clear action. | Another tutorial stepper; mode headings at the same regular weight as descriptions; asking for dates/goals. |

Primary teaching text and structural headings may share one color: size, weight and spacing already distinguish them. Secondary color should identify supporting UI information, not arbitrarily downgrade the meaning of a lesson paragraph. Answer status hue has a separate job from text hierarchy. A grayscale inspection should retain section, unit and state understanding.

## Family alternatives for the ADR

| Alternative | Benefit | Risk in this app | Assessment |
| --- | --- | --- | --- |
| Existing serif-English / sans-Turkish with tightened roles | Familiar separation of example and explanation; retains editorial texture | Repeated language alternation also changes optical size and line metrics; inline feedback alternates texture; form patterns mix languages | Viable in principle, weak fit for the specific complaint unless block treatment is fundamentally revised. |
| One working family with explicit role hierarchy | Stable glyph metrics through bilingual explanations; fewer unexpected wraps; identity can come from proportion, spacing and material | Can become flat if all roles collapse to 18px/400/main ink | Preferred candidate **only with** the role contracts above; the frozen uniform prototype does not satisfy them. |
| Sans working text, serif only for display titles or a whole long passage | Academic character at predictable structural boundaries, avoiding a switch at every language change | Extra font loading; Source Serif 4's shipped weight is 400; synthetic bold must be avoided; title wraps need testing | Defensible second candidate. Long passage treatment must encompass a complete passage, not scattered English words. |

The separate [typography evidence report](2026-10-04-typography-evidence.md) examines OpenStax, Wikipedia, Hypothesis, GOV.UK and USWDS official sources, and measures the repository's actual typefaces in a controlled browser specimen. It supports multiple coherent strategies, not a universal one-family rule. Family choice and role-scale choice should be separate ADR decisions.

## Research principles and their limits

W3C's [Info and Relationships](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/info-and-relationships.html) describes how size, weight, spacing, grouping and background communicate structure, and requires that those relationships remain available when presentation changes. This supports semantic headings/groups and wrong/right text equivalents; it does not prescribe “two fonts” or “18px.”

W3C's [Headings and Labels](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/headings-and-labels.html) explains how descriptive headings help orientation and finding information. Use existing meaningful teaching headings, then give them consistent visual treatment. It does not require inventing a heading for every paragraph.

W3C's [Visual Presentation](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/visual-presentation.html) discusses bounded line length, non-justified text, adjustable presentation and reflow. Its 80-character discussion belongs to **AAA 1.4.8**, not a universal AA requirement or a mandate to force 80 characters on a phone. The present narrow reading lane is worth retaining; mobile lines necessarily have fewer characters.

W3C's [Non-text Contrast](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/non-text-contrast.html) concerns information needed to identify controls and graphical objects. A decorative divider and an answer-control boundary do not have identical obligations. Removing unnecessary dividers can reduce clutter while control affordances remain measurable.

These official documents were retrieved successfully as public source HTML. This audit does not claim that a browser was used to measure inaccessible external production sites. The evidence establishes defensible constraints and identifies defects; it cannot prove subjective comfort or learning gains.

## Acceptance checks for the integrated candidate

1. Capture the exact Unless article plus a long grammar/vocabulary article at 320/390/768/1440. Record role size, family, leading, color and actual reading width for title, H2, form label, formula, use line, example, explanation and option. Do not judge the system by an allowed-size list alone.
2. Assert that H2, form label and prose roles are intentional and that educational annotations are not metadata. Verify short support text and long teaching paragraphs with different selectors. Inspect topic intros and results, not only `.lesson`.
3. Verify within-unit gaps are smaller than between-unit gaps, including same-form repeated patterns. Check headings remain closer to their content than to preceding content. Count effective margins plus grid gaps; a CSS `gap` alone is not total separation.
4. Answer a long complete-sentence question at 320px; compare option text width and row height before/after correct and incorrect outcomes. Confirm no line is gained merely because the verdict icon appears. Separately verify the footer action stays at the same viewport coordinate.
5. Check 200% text/zoom, 320px reflow and WCAG text-spacing overrides. Measure nested scroll overflow, clipped action text and input/menu geometry, not just `document.scrollWidth`.
6. Inspect heading order and accessible names. Pitfall rows expose wrong/right meaning; test groups point to their question; changing font treatment never removes `lang` attributes or moves keyboard focus unexpectedly.
7. Recheck color on neutral, selected, correct and incorrect grounds, and in grayscale. Borders need not divide every teaching item; answer outcomes must survive loss of color.
8. Inspect first visit, one-page optional introduction, partial reading resume, completed topic, empty/nonempty mistake book, results and populated settings. Real learner state must remain useful after removing gamification.

The final visual choice belongs in a cross-discipline ADR alongside measured palette/motion evidence and then in the component catalogue. Do not convert these candidate numbers into “research proved optimal” claims.

## Integrated implementation check after ADR 006

After [ADR 006](../adr/006-reading-hierarchy-and-atmosphere.md) established the roles, the renderers received explicit `lesson-form`, `lesson-form-row`, `lesson-form-label`, `lesson-pattern`, `lesson-use`, `lesson-example` and `lesson-term` classes. The topic's prose pane is `topic-intro`; the results section and entries are `review` / `review-entry`. Pitfalls and results marks now expose a textual status alongside the hidden SVG. The data and question wording were not rewritten.

A second focused Chromium pass used the **exact tenant/deposit question from the owner's screenshot**, selected by its real question ID through the application's supported mistakes request, then submitted a wrong answer and opened its real result. This removes the random-question confound in the earlier exploratory observations.

Measured final roles at 390px:

| Role | Computed size / leading / weight |
| --- | --- |
| Article title | 30 / 36 / 600 |
| Article section heading | 20 / 28 / 600 |
| Form label | 16 / 24 / 600 |
| Pattern | 18 / 30 / 500 |
| Short use annotation | 16 / 25.6 / 400, supporting ink |
| Example and ordinary reading | 18 / 30 / 400, primary ink |
| Topic title / section / prose | 24 / 31 / 600; 20 / 28 / 600; 18 / 30 / 400 |
| Live question stem | 20 / 32 / 400 |
| Answer option and feedback explanation | 18 / 30 / 400 |
| Short feedback verdict | 16 / 24 / 600 |
| Result review heading / explanation | 20 / 28 / 600; 18 / 30 / 400 |

The reserved verdict column produced **zero change in both answer-row height and answer-text width for all four options at 320, 390 and 1440px** when the tenant question moved from unanswered to incorrect-answer feedback. This resolves the measured state-icon rewrap defect for that long-question fixture. It does not assert that every possible content update can never wrap.

Article, topic, question feedback and result review showed no document or scroll-region horizontal overflow at those three widths. At 320px, separate **24px root-font** and **text-spacing override** checks also showed no horizontal overflow or out-of-viewport text/control rectangles. The text-spacing run used 1.5 line height, 0.12em letter spacing, 0.16em word spacing and 2em paragraph spacing. The 24px-root check is 150% relative to the 16px default, not a falsely labelled 200% zoom test. The repository's wider verification remains responsible for its additional zoom, keyboard, interaction and content cases.

The exact feedback and forms screenshots were inspected. The final forms visually distinguish the medium-weight pattern, short supporting instruction and regular example without restoring repeated separators. The feedback retains consistent reading metrics through English and Turkish text. A minor pre-existing presentational defect remains visible in that capture: appending a colon to a selected answer already ending in a full stop produces `floor.:`. It was reported to the implementation owner separately; the screenshot is not a claim that punctuation had already been corrected.

Evidence for this final focused pass: `/tmp/ep67-final/hierarchy-final.json`, `hierarchy-article-390.png`, `hierarchy-topic-390.png`, and `hierarchy-tenant-feedback-{320,390,1440}.png`. No runtime errors were observed during these flows. These objective results support geometry and role consistency; the owner's reading comfort still requires review of the integrated product.
