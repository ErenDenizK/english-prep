# Margin / Sakura: interface system · v0.68

Margin is English Prep's current interface. [ADR 007](adr/007-sakura-and-purposeful-motion.md) records the current palette, motion, progress and introduction decisions. [ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) remains the typography decision and previous visual comparison; its atmosphere/palette/onboarding choices are superseded. This summary describes that implementation; [css/editorial.css](../css/editorial.css) supplies the actual values over the inherited [css/style.css](../css/style.css). The older [design-system.md](design-system.md) remains historical source documentation. [EXPERIENCE.md](EXPERIENCE.md) describes the learning journeys.

## Direction and themes

The working interface is a dark academic reading space with plum-neutral surfaces, cherry/sakura brand accents, iris confirmation and apricot retry markers, and distinct reading roles. The supplied visual references inform character and spacing; they do not prove readability or educational effectiveness.

New visits start dark. Profil retains **Koyu, Açık and Sistem**, including existing explicit preferences. System follows operating-system changes; storage failure still allows a document-local choice. The pale Sakura light counterpart retains the same role hierarchy, while dark is the primary design and review target. Neither theme is claimed to be universally more comfortable.

## Semantic palette

| Role / token | Dark, default | Light |
| --- | --- | --- |
| Canvas `--page` | `#141216` | `#fbf7fa` |
| Surface `--card` | `#1d1a20` | `#ffffff` |
| Raised surface `--raised` | `#28242c` | `#f0eaf0` |
| Main text `--ink` | `#eee9ed` | `#302831` |
| Supporting text `--ink-2` | `#c6bcc6` | `#625864` |
| Decorative separator `--hairline` | `#39313d` | `#e2d8e2` |
| Essential boundary `--edge` | `#847988` | `#887b88` |
| Primary gradient `--accent` / `--accent-2` | `#ed96b4` / `#dca2d8` | `#a13462` / `#854987` |
| Primary label `--accent-ink` | `#301b27` | `#ffffff` |
| Sakura text / selected tint | `#efb1cb` / `#30222d` | `#922e55` / `#f6e7ed` |
| Focus `--focus` | `#d4b5f8` | `#7848af` |
| Secondary accent `--secondary` | `#c8b4e9` | `#7652a0` |
| Confirmed marker / small tint | `#bbb6f2` / `#262432` | `#654bb0` / `#eeebf9` |
| Retry marker / small tint | `#e9bb95` / `#2f2725` | `#92501f` / `#f7eee5` |

Cherry identifies the brand and primary action; Sakura supports selected destinations and concise structural emphasis. Iris marks a confirmed answer and apricot an attempt to reconsider. These custom hues do not intrinsically mean correct/incorrect: the check/close glyphs and literal verdict stay visible. Answer sentences retain primary ink and neutral surfaces; color is concentrated in their reserved key/mark spaces rather than whole red/green rectangles. Essential boundaries remain distinct from decorative separators.

Main ink carries lesson prose, examples, answers and rationales. Supporting ink belongs to short context/help, not automatically every second teaching paragraph. Form labels may use the secondary accent; key terms may use Sakura. Neither adds filled highlight boxes to continuous reading.

The [Sakura palette research](research/2026-10-sakura-palette.md) compares alternatives and calculates the conservative aurora overlap. [The production checker](../tools/editorial-palette.mjs) measures stylesheet roles, both action-gradient stops/intermediate colors, and single/double/triple field overlaps in both themes. Field opacity is bounded at 10% dark and 5% light; foreground cards are opaque because the same overlap applied to raised cards would violate the selected edge requirement. WCAG 2 contrast is enforced; APCA remains supplementary evidence, not a claim of reading comfort. Final integrated results belong in [VALIDATION.md](VALIDATION.md).

## Typography and reading

**Inter is the working family for both languages.** English retains `lang="en"`; language is not a font role. The bundled variable font supplies real weights, with local fallbacks and `font-display: swap`. The serif assets remain available to the preserved original; the new working interface does not require them to distinguish every English sentence.

This decision follows official-source comparisons and actual-font/browser alternatives, not a rule that every application needs one family. [Typography evidence](research/2026-10-04-typography-evidence.md) includes a viable serif-title alternative and the wrap costs of a serif reading lane. Equal CSS font sizes do not have equal optical size.

Role values assume a 16px browser default; relative sizes honor user enlargement.

| Role | Size / leading / weight | Application |
| --- | --- | --- |
| Page title | 30/36 mobile; 36/43 wide; 600 | Study introduction and article H1. |
| Major panel title | 24/31–34; 600 | Topic/panel hierarchy below the main page title. |
| Instructional section | 20/28; 600 | Lesson H2, check heading, principal UI sections. |
| Form/group label | 16/24; 600 | `.lesson-form-label`, sentence case, secondary accent. |
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

Buttons and fields generally use 8px corners, answer rows 10px, and larger component surfaces 12–16px. Minimum heights allow content to grow: 44px icon/choice targets, 48px standard controls and 52px primary actions. Answer rows reserve a final verdict column **before** answering so adding the mark cannot reduce text width and trigger new wrapping. Their text and fixed action bar must remain stable through feedback.

An inline check has one containing surface; feedback adds no nested frame. Topic hover has rounded local treatment and text emphasis, not a square edge-to-edge slab. Resume uses a labeled reading-position bar separate from its English lesson name. Profile and results use comparable linear metrics, stable numbers and honest empty states. Recheck geometry with long content, enlarged text and short viewports.

## Component and state contracts

| Component | Required behavior |
| --- | --- |
| Navigation | Eğitim/Test remain peers; Profil belongs in the header. Preserve route context, browser Back, active state and visible focus. |
| Introduction | Three optional pages: Education flow, Test/feedback flow, then optional name/start. Skip remains available, with Back after the first page; no dates, goals or streaks, and no deep-link interruption. |
| Curriculum | Actual corpus totals, useful reading/resume action, search and empty-result feedback. No invented progress. |
| Fields and menus | Visible labels, keyboard operation and reachable menus above fixed chrome; active options scroll into view. |
| Article / pretest | Continuous source article; unread pretest starts open and has a direct `Derse geç` action. Its height and explanation are excluded from article progress. Manual collapse persists during the reader session; checks never gate reading. |
| Answer / feedback | One press commits; keep rationale and selected-option explanation available until continuation. Valid same-tab refresh preserves order and feedback. |
| Results | Stable correct/answered fraction and linear bar, never a count-up or score ring. One answer describes that answer, not overall proficiency. Review and stable attempt IDs remain. |
| Profile | Linear completion/recent-accuracy metrics with sample context and an explicit empty state. Group study, appearance/motion, application links and local-data actions. Preserve name, focus, backup/restore/reset and install behavior. |
| Restore | Native dialog, visible initial focus, review before merging, actionable failure/retry and honest rollback limits. |
| Legacy data | Preserve old backup/storage fields, including dates and goals, without exposing removed features in the new UI. |
| Branding / install | Shared `ep.`/Sakura-dot identity; expandable `/about/` product/engineering stories and a user-controlled real viewport gallery. Supported native install action or honest guidance; no automatic interruption. |

Quiz snapshots are tab-local and validated against current content, not a cross-device resume service. Restore stages writes and attempts rollback because localStorage has no multi-key transaction. These boundaries and the unchanged backup format are described in [EXPERIENCE.md](EXPERIENCE.md).

## Atmosphere, motion and verification

Three radial light fields sit behind every route, including lessons, questions and About: cherry `#c65b88`, iris `#785ca8`, and apricot `#c68571`. The application uses 28/34/42-second alternating transform/opacity paths, with small displacements and the alpha bounds above. Reading ink is stable; cards remain opaque. No blur animation, hue rotation, particles, scroll parallax, autoplay gallery or animated teaching-text color is used.

`js/motion.js` owns the persistent preference. A header control is reachable during reading and quizzes, and Profile presents the same control with an explanatory label. Pausing leaves a still atmospheric background. Hidden tabs pause the fields; system reduced motion takes precedence over the saved choice. Forced colors removes the decoration. The bounded background must remain contrast-safe at every field position, not only in a screenshot.

| Interaction role | Token / behavior |
| --- | --- |
| Press | `--d-press: 100ms`; small local feedback, no layout shift. |
| Reveal | `--d-feedback: 180ms`; short visual cue while state/focus updates immediately. |
| Route / introduction page | `--d-route: 220ms`; one entering CSS cue, no native View Transition snapshot or second crossfade. |
| Completion | `--d-complete: 420ms`; local meter emphasis with final numbers available immediately. |
| Answer / input / selection | Commit immediately; no scoring delay, punitive shake or celebratory count-up. |

Disabling motion preserves every state and control. Focus remains visible and clear of fixed chrome. Reading progress uses the real instructional-body start for both calculation and restoration, so changing preliminary practice height cannot manufacture completion. Existing stored fractions remain compatible; this is a proportional bookmark, not an exact sentence anchor.

The portfolio reads shared tokens and motion preferences. Edit its tour, feature stories, engineering details and additional sections in `about/content.js`; use [the authoring guide](../about/README.md) for structure and screenshot updates. Gallery images are real browser viewport captures with demonstration state, not claims of physical iPhone testing. Screen and viewport selection is user-controlled.

[ADR 007](adr/007-sakura-and-purposeful-motion.md) defines current acceptance, and the [v0.68 diagnosis](audit/v0.68-interface-diagnosis.md) records the source problems. Earlier v0.67 reports remain historical evidence. Verify `npm run check`, the repository browser sweep, 320px reflow, enlarged text/spacing, keyboard/focus, invariant option geometry, pretest progress/resume, pause/reduced/hidden-page behavior, editable About layouts, and offline/install paths. Record actual outcomes in [VALIDATION.md](VALIDATION.md); calculation or automation does not replace learner observation.
