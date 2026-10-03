# Margin: current interface system

Margin is the presentation system for the full English Prep redesign. Production values live in [css/editorial.css](../css/editorial.css), loaded after the inherited [css/style.css](../css/style.css). The source layout, component semantics, and application modules remain the foundation; the extension changes their hierarchy, typography, surfaces, and visual behavior. The historical specification is preserved in [design-system.md](design-system.md).

## Direction and reference roles

Use a study publication's clarity: a restrained introduction, a real table of contents, readable articles, and an obvious next action. The supplied [Home](reference/design_home/DESIGN.md) and [Ventriloc](reference/design_ventriloc/DESIGN.md) references inform warm paper, quiet structure, and small orange accents. [Monopo](reference/design_monopo/DESIGN.md) informs the confidence of simple type and generous space. [Raycast](reference/refero-design.md) informs the restrained dark companion. Their marketing effects and original branding are not product requirements.

Interface text uses self-hosted Inter. English examples, questions, and options retain Source Serif 4. Color is a small part of the hierarchy; position, grouping, spacing, and type carry most of it. Decorative gradients, glass blur, floating orbs, and celebratory answer effects do not define the learning experience.

## Semantic palette

These are the extension's actual tokens, not the older source palette or unmodified reference exports.

| Role / token | Light | Dark |
| --- | --- | --- |
| Canvas `--page` | `#f5f3ed` | `#141513` |
| Surface `--card` | `#fffefa` | `#1d1f1b` |
| Recessed/selected surface `--raised` | `#eae8df` | `#272a24` |
| Main text `--ink` | `#242720` | `#f0eee7` |
| Secondary text `--ink-2` | `#5d6255` | `#bdbeb4` |
| Decorative divider `--hairline` | `#d9dacf` | `#373b32` |
| Control boundary `--edge` | `#7b8270` | `#7b8172` |
| Primary action `--accent` | `#2a3026` | `#e9e7df` |
| Primary label `--accent-ink` | `#fffdf6` | `#232620` |
| Accent text `--accent-text` | `#8c4328` | `#edab85` |
| Focus `--focus` | `#9b4722` | `#f1bb93` |
| Correct `--ok` / tint | `#286240` / `#e4eee5` | `#9bd0af` / `#1c3024` |
| Incorrect `--no` / tint | `#a13b39` / `#f6e7e3` | `#f1a1a1` / `#352024` |
| Decorative mark `--editorial-mark` | `#c85a31` | `#e9895b` |

Measured WCAG relative-luminance ratios from these token pairs: secondary text on canvas **5.66:1 light / 9.76:1 dark**; primary action labels **13.32:1 / 12.38:1**; control edges against raised surfaces **3.25:1 / 3.62:1**. These are checks of specific pairs, not proof that every rendered state conforms. Hairlines are decorative separators and must not stand in for essential control boundaries.

The interface follows the system theme unless Profil stores an explicit choice. The CSS provides both themes and supports forced-color presentation. Semantic answer states also have words/icons; success and correction never depend on hue alone.

## Typography

| Use | Production treatment |
| --- | --- |
| UI and Turkish prose | Inter, locally loaded with `font-display: swap` and system fallbacks. |
| English examples and options | Source Serif 4 at regular weight, using the existing local files and serif fallback stack. |
| Introduction | 34px mobile / 38px wide; 30px below 360px. Restrained 450 weight and approximately 1.18 line-height. |
| Article title | 32px mobile / 40px wide, with a 28px adjustment below 360px. |
| Article body | 17px mobile / 18px wide, 1.9 line-height; 16px at the narrowest viewport. |
| English lesson examples | 19px mobile / 21px wide, approximately 1.75 line-height. |
| Question prose | 21px mobile / 23px wide, 1.75 line-height; 20px below 360px. |
| Feedback explanation | 16px at 1.9 line-height. |
| Buttons and supporting labels | Typically 13–15px; smaller 10–12px metadata is supplementary, not the reading surface. |

Article prose is capped at 64 characters' width. Type stays legible because questions and teaching text get their own reading scale rather than inheriting compact navigation typography. Tabular figures stabilize counters. Uppercase tracking is confined to short labels and metadata.

## Layout, spacing, and geometry

Keep the inherited fixed application frame: header, one scrolling content region, and bottom navigation or contextual action bar. Mobile uses 24px gutters, reducing to 16px below 360px. Standard section gaps are around 24–32px. The wide layout begins only at 1080×600 or larger; it uses a 300px companion column and a maximum frame of 988px and a 592px inner reading column. Articles and quizzes remain single-column.

Buttons use 8px corners; fields use 7px; selections use 6px; surfaces generally use 10–14px. Pills are reserved for navigation-like containment rather than applied to every object. Essential borders use `--edge`; quiet separators use `--hairline`. Shadows are mostly removed. A modal retains enough elevation and a backdrop to communicate its relationship to the page.

## Components and interaction contracts

| Component | Behavior and states |
| --- | --- |
| Header and navigation | Eğitim/Test remain content modes; Profil is in the header. Preserve active-route semantics, focus, and Back behavior. |
| Introduction and corpus facts | One contextual reading action, optional secondary action, and actual topic/lesson/question counts. No invented progress or compulsory setup. |
| Curriculum row | Topic identity, explanation, real counts/progress, and a clear destination; search surfaces matching lessons. |
| Primary / secondary / quiet button | 52px primary and 48px standard minimum heights; readable neutral fills, visible focus, restrained hover, and subtle press feedback. Icon controls are at least 44px. |
| Field and listbox | 48px trigger/input height, clear boundary, accessible name, and preserved keyboard behavior. Choices are at least 44px. |
| Article blocks | Existing contrasts, patterns, examples, pitfalls, and decision steps, differentiated without turning every paragraph into a card. |
| Optional pretest | Native `details`/`summary`, collapsed on initial reading, with the source question interaction inside. It never gates the article. |
| Inline check | Optional practice within the article; unscored and independent of reading completion. |
| Answer option | At least 58px high. A button commits an answer immediately. Named group semantics; checked answers remain inspectable. Correct/incorrect states use text/marks and color. |
| Feedback | Original rationale, chosen-option note, and transferable rule. Keep the explanation visible until the learner advances. |
| Result and review | Real score, breakdowns, answer explanations, and routes into relevant learning/practice. |
| Profile and backup | Existing local progress, settings, import/export, and confirmation/recovery behavior receive the same visual vocabulary. |

## Motion and accessibility

Control transitions are approximately 180ms; the inherited motion curves are replaced with a restrained standard ease. Correct and incorrect answer animations are suppressed. Reduced-motion preference disables nonessential animations, transitions, smooth scrolling, and press translation. Never add looping decorative movement around a question or article.

Use the 2px visible focus outline with a 4px offset. Preserve native button, disclosure, form, dialog, and routing semantics. Keep targets generous, allow actions to wrap, and respect forced colors. A reduced-motion override and measured token pairs support accessibility, but page/state checks and assistive-technology testing remain necessary.

`npm run color` checks the inherited palette and runs `tools/editorial-palette.mjs` against this extension's actual CSS. The editorial audit verifies 112 text, control, and focus contrast pairs across both themes and checks that explicit and system light palettes agree. These token checks do not replace computed-color and interactive-state checks in the browser. Browser checks must cover 320px, both themes, wide splits, article measure, options, feedback, disclosures, and keyboard navigation.
