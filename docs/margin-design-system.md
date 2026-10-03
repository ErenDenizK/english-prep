# Margin: interface system · v0.66

Margin is the current English Prep interface. [css/editorial.css](../css/editorial.css) is the production extension over the inherited [css/style.css](../css/style.css); actual values and rendered behavior take precedence over this summary. [design-system.md](design-system.md) preserves the source specification. [EXPERIENCE.md](EXPERIENCE.md) describes the learner's journeys, and [RESEARCH.md](RESEARCH.md) separates evidence from design decisions.

## Direction and themes

The primary experience is a quiet, dark academic reading space: neutral charcoal planes, warm text, readable supporting information, restrained orange emphasis, and distinct English examples. [Raycast](reference/refero-design.md) informs dark surfaces; [Home](reference/design_home/DESIGN.md) and [Ventriloc](reference/design_ventriloc/DESIGN.md) inform grouping and the light palette; [Monopo](reference/design_monopo/DESIGN.md) informs typographic confidence and space. These references are aesthetic inputs, not evidence of learning effectiveness.

A fresh visit starts **dark**, including when the operating system is light. Profil offers **Koyu, Açık, and Sistem**. Existing explicit choices survive upgrades; System is itself stored and follows operating-system changes live. The blocking head scripts and shared theme module agree across index, quiz, and results, including browser chrome. If storage fails, the current document can still apply a chosen theme. Warm-paper light mode remains a complete supported choice.

## Semantic palette

| Role / token | Dark, default | Light |
| --- | --- | --- |
| Canvas `--page` | `#111316` | `#f5f3ed` |
| Surface `--card` | `#191c20` | `#fffefa` |
| Selected/recessed surface `--raised` | `#24282d` | `#eae8df` |
| Main text `--ink` | `#f0eee7` | `#242720` |
| Supporting text `--ink-2` | `#d0d2cc` | `#5d6255` |
| Decorative separator `--hairline` | `#363c44` | `#d9dacf` |
| Essential boundary `--edge` | `#838993` | `#7b8270` |
| Primary action `--accent` | `#e9e7df` | `#2a3026` |
| Primary label `--accent-ink` | `#232620` | `#fffdf6` |
| Accent text `--accent-text` | `#efbc99` | `#8c4328` |
| Focus `--focus` | `#f1bb93` | `#9b4722` |
| Correct / tint | `#9bd0af` / `#1c3024` | `#286240` / `#e4eee5` |
| Incorrect / tint | `#f1a1a1` / `#352024` | `#a13b39` / `#f6e7e3` |
| Reading contrast block `--editorial-wash` | `#20262c` | `#e6e9dc` |
| Decorative mark `--editorial-mark` | `#e9895b` | `#c85a31` |

Do not substitute a decorative hairline for an essential field boundary. Correctness also uses words and marks; no meaning depends only on hue. Surfaces have restrained depth without glass blur, glow, or decorative looping movement.

The production palette checker measures **112 foreground/background pairs**. Minimum ratios across its applicable surfaces are 12.08:1 dark / 11.88:1 light for prose, 9.20:1 / 4.92:1 for supporting text, and 3.98:1 / 3.12:1 for essential boundaries. Filled-action labels measure 12.38:1 / 13.32:1. These are scoped token measurements, not whole-page accessibility certification. APCA values are additional diagnostics; they do not replace WCAG criteria.

## Typography and reading

Inter is self-hosted for Turkish prose, navigation, controls, and headings. English examples, prompts, options, and review material use the existing self-hosted Source Serif 4. Both retain fallback fonts and `font-display: swap`. Font roles use relative sizes so a root-font preference can enlarge them; pixel equivalents below assume a 16px browser default.

| Role | Size and treatment |
| --- | --- |
| UI body / metadata tokens | `1rem` / `0.875rem`; token leading `1.75rem` / `1.375rem`. |
| Introduction | `2.125rem` mobile, `2.375rem` wide; `1.875rem` below 360px. Approximately 1.18 leading. |
| Article title | `2rem` mobile, `2.5rem` wide, `1.75rem` below 360px; medium weight. |
| Turkish article summary | Inter `1.125rem`, 1.6 leading. |
| Turkish article body | `1.0625rem` (17px), including 320px; `1.125rem` wide. Leading 1.77–1.78. |
| Article section labels | `1rem`, semibold, sentence case; distinguish instructional headings from compact metadata. |
| English lesson examples | `1.1875rem` mobile / `1.3125rem` wide; 1.75 leading. |
| Question prose | `1.3125rem` mobile / `1.4375rem` wide; `1.25rem` below 360px; 1.75 leading. |
| Answer options | `1.1875rem`, reducing to `1.125rem` below 360px; 1.65 leading. |
| Answer rationale | Inter `1.0625rem`, 1.77 leading. |
| Controls and supporting prose | Generally `0.875–1rem`; native input text `1rem`. Small supplementary labels have their own roles. |

Prose stays within a bounded reading column, with a `64ch` cap where applicable. `ch` is a CSS measure, not an exact character count in proportional text. Keep paragraphs left aligned, emphasis purposeful, and counters tabular. Do not shrink the teaching text to fit a narrow screen or hide an explanation with truncation.

## Layout and geometry

The inherited fixed frame surrounds one scrolling content region, with a header and bottom navigation or contextual action bar. Mobile gutters are 24px, reducing to 16px below 360px. At **1080px width and 600px height**, suitable screens gain a 300px companion pane within the 988px maximum frame; the inner reading column remains 592px. Articles and quizzes remain single-column. Screen size, browser zoom, text growth, and short landscape windows must be considered together.

Buttons generally use 8px corners, fields 7px, selections 6px, and surfaces 10–14px. Essential controls use `--edge`; visual grouping can use quieter separators. Standard spacing clusters related controls more closely than separate sections. Minimum control heights allow content to grow: 44px icon/choice targets, 48px standard controls, 52px primary actions, and 58px answer rows.

## Component and state contracts

| Component | Required behavior |
| --- | --- |
| Navigation | Eğitim/Test remain peers; Profil belongs in the header. Preserve route context, active state, browser Back, and visible focus. |
| Curriculum | Real corpus totals, useful reading/resume action, searchable topic/lesson context, and empty-search feedback. No invented progress. |
| Fields and choice menus | Visible labels/boundaries and keyboard operation. Menus stay reachable above fixed chrome; active options scroll into view. |
| Article and pretest | Continuous source article. Native pretest disclosure starts collapsed. Inline checks are optional and unscored; neither gates reading. |
| Answer and feedback | One press commits an answer. Show the rationale, chosen-option note, and transferable rule until explicit continuation. Preserve feedback and option order after a valid same-tab refresh. |
| Results | Actual answered-question score and review. Stable attempt IDs update a matching partial attempt rather than counting the same session again. |
| Profile | Actual progress, optional goals, settings, clear empty states, and explicit confirmation for reset. No claim of universal exam readiness. |
| Restore dialog | Focus the visible heading with `tabindex="-1"` on opening, then follow normal keyboard order. Keep native Escape and opener restoration. File/paste review precedes merging; failures remain actionable in the open dialog. |
| Backup and recovery | Honor share cancellation, preserve local explicit preferences, restore a missing daily goal, and report storage failures. Keep the reviewed backup available for retry. |

The active quiz snapshot is scoped to its browser tab and validated against current content. It is not a cross-device resume service. Restore uses staged writes and attempted rollback because localStorage has no multi-key transaction; incomplete rollback is reported honestly. See [EXPERIENCE.md](EXPERIENCE.md) for these boundaries.

## Motion, focus, and verification

A short entering-surface fade and approximately 180–220ms control transitions establish changes without delaying interaction. Correct/incorrect shake and pop effects are suppressed. Reduced motion disables nonessential animation, transitions, smooth scrolling, and press translation. Forced-color presentation retains control and state visibility.

Use the visible 2px focus outline with a 4px offset where specified, and keep the focused object within the visible scrolling region. An outline token alone does not prevent focus from being hidden behind fixed chrome. Native buttons, disclosures, forms, and dialogs remain the semantic foundation.

`npm run color` includes [editorial-palette.mjs](../tools/editorial-palette.mjs). Browser checks must also exercise dark/light/System, 320px reflow, enlarged text and spacing overrides, short dialogs, keyboard routes, choice-menu positioning, article/quiz feedback, reduced motion, and offline assets. Current observations live in [type-color.md](audit/type-color.md) and [interaction-accessibility.md](audit/interaction-accessibility.md); their stated test limits matter.
