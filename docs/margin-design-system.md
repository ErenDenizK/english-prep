# Margin: interface system · v0.67

Margin is English Prep's current interface. [ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) records the accepted typography, color and atmosphere decisions and their alternatives. This summary describes that implementation; [css/editorial.css](../css/editorial.css) supplies the actual values over the inherited [css/style.css](../css/style.css). The older [design-system.md](design-system.md) remains historical source documentation. [EXPERIENCE.md](EXPERIENCE.md) describes the learning journeys.

## Direction and themes

The working interface is a dark academic reading space with neutral charcoal surfaces, a blue-gray interactive accent, distinct text roles and quiet answer-state colors. The supplied visual references inform character and spacing; they do not prove readability or educational effectiveness.

New visits start dark. Profil retains **Koyu, Açık and Sistem**, including existing explicit preferences. System follows operating-system changes; storage failure still allows a document-local choice. The neutral light counterpart retains the same role hierarchy, while dark is the primary design and review target. Neither theme is claimed to be universally more comfortable.

## Semantic palette

| Role / token | Dark, default | Light |
| --- | --- | --- |
| Canvas `--page` | `#121416` | `#f5f6f7` |
| Surface `--card` | `#1b1e21` | `#ffffff` |
| Raised surface `--raised` | `#262a2e` | `#e9ecef` |
| Main text `--ink` | `#e4e6e7` | `#24292e` |
| Supporting text `--ink-2` | `#b4bcc3` | `#505962` |
| Decorative separator `--hairline` | `#343a40` | `#d9dee3` |
| Essential boundary `--edge` | `#737e86` | `#707a83` |
| Primary action / label | `#c4d7e7` / `#18232c` | `#293945` / `#ffffff` |
| Accent text / focus | `#b8cee1` | `#3c617d` |
| Selected tint `--accent-tint` | `#242c33` | `#e8eef3` |
| Correct marker / tint | `#a4c3af` / `#202b28` | `#356349` / `#eef3ef` |
| Incorrect marker / tint | `#d9a8ae` / `#2b2528` | `#88434d` / `#f6eff0` |

Main ink carries lesson prose, examples, answers and rationales. Supporting ink is for short annotations, context and metadata; the second paragraph of a teaching pair does not automatically become secondary text. Answer sentences keep main ink in every state. A subdued fill, check/cross and literal verdict express correctness without large saturated red or green paragraphs. Essential input/control edges remain distinct from optional decorative rules.

The selected dark palette's source calculations give minimum primary/supporting text ratios of **11.31:1 / 7.36:1** across its intended opaque surfaces. These are scoped calculations from the [color and motion report](research/2026-10-04-color-motion-evidence.md), not a whole-app accessibility result. The production [palette checker](../tools/editorial-palette.mjs) must also measure actual stylesheet roles and the atmosphere's conservative overlap bound. APCA supplements WCAG 2 contrast; it does not replace it or establish reading comfort. Final integrated results belong in [VALIDATION.md](VALIDATION.md).

## Typography and reading

**Inter is the working family for both languages.** English retains `lang="en"`; language is not a font role. The bundled variable font supplies real weights, with local fallbacks and `font-display: swap`. The serif assets remain available to the preserved original; the new working interface does not require them to distinguish every English sentence.

This decision follows official-source comparisons and actual-font/browser alternatives, not a rule that every application needs one family. [Typography evidence](research/2026-10-04-typography-evidence.md) includes a viable serif-title alternative and the wrap costs of a serif reading lane. Equal CSS font sizes do not have equal optical size.

Role values assume a 16px browser default; relative sizes honor user enlargement.

| Role | Size / leading / weight | Application |
| --- | --- | --- |
| Page title | 30/36 mobile; 36/43 wide; 600 | Study introduction and article H1. |
| Major panel title | 24/31–34; 600 | Topic/panel hierarchy below the main page title. |
| Instructional section | 20/28; 600 | Lesson H2, check heading, principal UI sections. |
| Form/group label | 16/24; 600 | `.lesson-form-label`, sentence case, primary ink. |
| Pattern | 18/30; 500 | `.lesson-pattern`, distinct from the actual example. |
| Reading text | 18/30; 400 | Prose, examples, options, feedback and review explanations. |
| Question stem | 20/32; 400 | The source text the learner must evaluate. |
| Short annotation / help | 16/25–26; 400 | `.lesson-use`, `.question-instruction`, settings help. |
| Control / field | 16/22–24; 600 control, 400 field | Actions and editable inputs. |
| Counter / short metadata | 14/20–22; 400–600 | Counts, compact category context; not teaching paragraphs. |

Semantic classes distinguish form name, pattern, use and example. A broad selector must not collapse headings, annotations and body paragraphs into one size. Mixed-language inline text inherits its paragraph's role. Emphasis is purposeful, and counters are tabular.

Within a teaching pair, use 8px; separate independent example units by 28px and repeated form rows by 16px. A form label sits closer to its first pattern than to the previous group. Sections use 40px mobile / 48px wide separation and approximately 12px between their heading and content. These relationships replace repetitive article rules. Topic initials and ornamental miniature progress bars are removed; real progress information stays available.

## Layout and geometry

The fixed shell contains one scrolling region, with a header and bottom navigation or contextual action bar. Mobile gutters are 24px, reducing to 16px below 360px. At **1080px width and 600px height**, suitable screens gain a 300px companion pane within the 988px maximum frame. The inner reading column stays approximately 592px; articles and quizzes remain single-column. A `ch` cap, where present, is a CSS glyph measure rather than a literal character count.

Buttons generally use 8px corners, fields 7px, selections 6px and surfaces 10–14px. Minimum heights allow content to grow: 44px icon/choice targets, 48px standard controls and 52px primary actions. Answer rows reserve a final verdict column **before** answering so adding the mark cannot reduce text width and trigger new wrapping. Their text and fixed action bar must remain stable through feedback.

An inline check has one surface. Feedback does not add another nested bordered/padded card. In the measured 390px comparison this recovered 42px of feedback width; typography is not the only contributor to reading layout. Recheck the final geometry with long content, enlarged text and short viewports.

## Component and state contracts

| Component | Required behavior |
| --- | --- |
| Navigation | Eğitim/Test remain peers; Profil belongs in the header. Preserve route context, browser Back, active state and visible focus. |
| Introduction | One short explanation of the two modes and an optional name; no exam date, goal, streak or absence-reminder setup. |
| Curriculum | Actual corpus totals, useful reading/resume action, search and empty-result feedback. No invented progress. |
| Fields and menus | Visible labels, keyboard operation and reachable menus above fixed chrome; active options scroll into view. |
| Article / pretest | Continuous source article; initially collapsed, optional pretest; unscored inline checks do not gate reading. |
| Answer / feedback | One press commits; keep rationale and selected-option explanation available until continuation. Valid same-tab refresh preserves order and feedback. |
| Results | Actual answered-question score and review; stable attempt IDs advance partial history without duplication. |
| Profile | Real progress, optional name, appearance, practice preference, local-data controls and install/about access. Removed date/goal/streak/reminder controls do not return here. |
| Restore | Native dialog, visible initial focus, review before merging, actionable failure/retry and honest rollback limits. |
| Legacy data | Preserve old backup/storage fields, including dates and goals, without exposing removed features in the new UI. |
| Branding / install | Restrained `ep.` identity, editable `/about/`, install guidance and a native install action only when supported. No automatic install interruption. |

Quiz snapshots are tab-local and validated against current content, not a cross-device resume service. Restore stages writes and attempts rollback because localStorage has no multi-key transaction. These boundaries and the unchanged backup format are described in [EXPERIENCE.md](EXPERIENCE.md).

## Atmosphere, motion and verification

A decorative blue/teal radial atmosphere sits behind the non-reading canvas. Each stop is capped at 6% alpha. It performs **one 3.6-second settle of at most 8px**, then remains static; there is no loop, route-triggered restart, pulsation or scroll parallax. Article and quiz scrolling surfaces remain opaque. The effect is hidden in light mode; reduced motion removes its animation, and forced colors removes the decoration.

State changes use short fades/transitions without delaying interaction. Answer shake/pop effects stay suppressed. Reduced motion also disables nonessential transitions, smooth scrolling and press translation. Use the visible focus outline and keep the actual focused object clear of fixed chrome; a contrast-compliant outline alone cannot ensure this.

[ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) defines the acceptance checks. The [screen hierarchy audit](research/2026-10-04-screen-hierarchy.md) records baseline/prototype defects; it is not a final pass claim. Verify the integrated implementation with `npm run check`, the repository browser sweep, 320px reflow, enlarged text/spacing, short dialogs, keyboard routes, option stability, final animation count, and offline/install/about paths. Record outcomes separately in [VALIDATION.md](VALIDATION.md); passing calculations cannot override the learner's reported reading experience.
