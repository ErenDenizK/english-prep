# Margin / Sakura: interface system · v0.71

Margin is English Prep's current interface. [ADR 009](adr/009-expressive-study-motion.md) records the current filled answer states, composed motion, introduction and mobile portfolio. ADR 008 retains the earlier native input/focus contracts; its neutral answer surfaces and short timing scale are superseded. [ADR 007](adr/007-sakura-and-purposeful-motion.md) retains the measured background/brand and progress foundation; [ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) retains the typography decision. Superseded choices remain historical evidence. [css/editorial.css](../css/editorial.css) supplies the presentation tokens over inherited [css/style.css](../css/style.css); [css/interactions.css](../css/interactions.css) owns shared control states and [css/onboarding.css](../css/onboarding.css) the introduction. The older [design-system.md](design-system.md) remains historical source documentation. [EXPERIENCE.md](EXPERIENCE.md) describes the learning journeys.

## Direction and themes

The working interface is a dark academic reading space with plum-neutral surfaces, cherry/sakura brand accents, full Sakura correct-answer and periwinkle incorrect-answer surfaces, and distinct reading roles. The supplied visual references inform character and spacing; they do not prove readability or educational effectiveness.

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
| Correct `--ok` / `--ok-tint` | `#eeb4d1` / `#392532` | `#953b67` / `#fae5ef` |
| Incorrect `--no` / `--no-tint` | `#b6c6ed` / `#252d42` | `#405f94` / `#eaf0ff` |
| Correct boundary `--ok-edge` | `#bb8ca4` | `#b16b8d` |
| Incorrect boundary `--no-edge` | `#8d9bbd` | `#657fac` |

Cherry identifies the brand and primary action; Sakura supports selected destinations and concise structural emphasis. Sakura correct and periwinkle incorrect are semantic aliases chosen for this product; pink is not claimed to universally mean correct. Iris and apricot remain available for their decorative/attention roles. Hues alone never establish correctness: check/cross shapes and literal Doğru/Yanlış verdicts stay visible, while linked Turkish descriptions expose answered state on focus. English sentences and shortcut keys remain neutral. Correct and selected-incorrect rows receive full opaque tints, measured softer borders and colored verdict marks; unselected incorrect alternatives remain neutral. Explanation paragraphs receive no additional frame. Essential boundaries remain distinct from decorative separators.

Main ink carries lesson prose, examples, answers and rationales. Supporting ink belongs to short context/help, not automatically every second teaching paragraph. Form labels may use the secondary accent; key terms may use Sakura. Neither adds filled highlight boxes to continuous reading.

The [Sakura palette research](research/2026-10-sakura-palette.md) calculates the conservative aurora overlap; the [v0.70 answer study](research/2026-10-answer-surfaces-v070.md) compares Sakura/periwinkle, jade/berry and lilac/ochre through actual app components. [The production checker](../tools/editorial-palette.mjs) measures stylesheet roles, status borders against their inside and surrounding planes, action gradients, explicit sRGB answer-transition samples, and single/double/triple field overlaps in both themes. On the final answer fills, prose/supporting text reach at least 11.43:1 / 7.44:1 dark and 11.89:1 / 5.65:1 light. Status borders against all permitted surfaces and atmosphere reach at least 4.66:1 dark and 3.14:1 light. These are contrast measurements, not proof of a preferred emotional tone. Field opacity is bounded at 10% dark and 5% light; foreground cards remain opaque. WCAG 2 contrast is enforced; APCA remains supplementary evidence, not a claim of reading comfort. Final integrated results belong in [VALIDATION.md](VALIDATION.md).

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
| Introduction | Three optional pages: six Education/Test scenes built from composed sheets, answer rows and drawn paths, then optional name/start. Native pressed-state controls change meaningful explanation immediately; choices survive Back. No diagram writes learning progress. Skip remains available; no dates, goals, streaks, fabricated questions or deep-link interruption. |
| Curriculum | Actual corpus totals, useful reading/resume action, search and empty-result feedback. No invented progress. |
| Fields and menus | Visible labels, keyboard operation and reachable menus above fixed chrome; active options scroll into view. The committed value has a reserved check slot, separate from keyboard-active focus. Chevron tracks expanded state; popup translates from its positioned edge without scaling and closes immediately. Pointer/focus input settles moving ancestors. |
| Article / pretest | Continuous source article; unread pretest starts open and has a direct `Derse geç` action. Its height and explanation are excluded from article progress. Manual collapse persists during the reader session; checks never gate reading. A drawn completion signature accompanies only the first unfinished-to-done event. Reopening a completed lesson does not replay it; resume prose stays still. |
| Answer / feedback | One press commits; keep rationale and selected-option explanation available until continuation. Small marks receive a finite cue; the question does not replay its entrance and answer geometry stays fixed. Turkish state descriptions do not replace English option names. Valid same-tab refresh preserves order and feedback. |
| Results | Stable correct/answered fraction and linear bar, never a count-up or score ring. One answer describes that answer, not overall proficiency. Review and stable attempt IDs remain. A first-presentation paper-to-review signature uses a separate tab-local marker; recording an attempt before navigation does not mean its result has been presented. |
| Profile | Linear completion/recent-accuracy metrics with sample context and an explicit empty state. Group study, appearance/motion, application links and local-data actions. Preserve name, focus, backup/restore/reset and install behavior. Visible groups compose only on arrival; name edits and internal renders do not replay the entrance. |
| Restore | Native dialog, visible initial focus, review before merging, actionable failure/retry and honest rollback limits. Interior-padding clicks preserve draft input; real backdrop/Escape closes immediately with native focus restoration. |
| Legacy data | Preserve old backup/storage fields, including dates and goals, without exposing removed features in the new UI. |
| Branding / install | Shared `ep.` / `english prep.` wordmarks and Sakura dot. Expandable `/about/` uses a compact mobile hero, nearby study controls, real captures and native feature/technical disclosures; no separate gallery. Supported native install action or honest guidance; no automatic interruption. |

Quiz snapshots are tab-local and validated against current content, not a cross-device resume service. Restore stages writes and attempts rollback because localStorage has no multi-key transaction. These boundaries and the unchanged backup format are described in [EXPERIENCE.md](EXPERIENCE.md).

## Atmosphere, motion and verification

Three radial light fields sit behind every route, including lessons, questions and About: cherry `#c65b88`, iris `#785ca8`, and apricot `#c68571`. The application uses 16/21/27-second alternating transform/opacity paths, with viewport-relative travel and contained gradient falloffs and the alpha bounds above. Reading ink is stable; cards remain opaque. No blur animation, hue rotation, particles, scroll parallax, automatic story rotation or animated teaching-text color is used.

`js/motion.js` owns the persistent preference. Only Profile settings expose the labeled motion toggle; About links to these settings. There are no top, onboarding or content-footer toggles. Pausing leaves a still atmospheric background. Hidden tabs pause the fields; system reduced motion takes precedence over the saved choice. Forced colors removes the decoration. The bounded background must remain contrast-safe at every field position, not only in a screenshot.

| Interaction role | Token / behavior |
| --- | --- |
| Press | `--d-control: 100ms`; small local feedback, no layout shift. |
| Reveal | `--d-reveal: 220ms`; local/menu/disclosure cue while state/focus updates immediately. |
| Navigation | `--d-route: 360ms`; one composed entrance, no native View Transition snapshot or blocking overlay. |
| Scene | `--d-scene: 560ms`; grouped Profile/product artwork composition. |
| Completion | `--d-complete: 720ms`; genuine completion signature and decorative path drawing; final values exist immediately. |
| Story | `--d-story: 900ms`; articulated onboarding/product artwork, never an input delay. |
| Flow | `--d-flow: 1100ms`; soft illustrated movement and connected path tracing in cohesive story scenes. |
| Answer / input / selection | Commit immediately; no scoring delay, punitive shake or celebratory count-up. |

Disabling motion preserves every state and control. Focus remains visible and clear of fixed chrome. Reading progress uses the real instructional-body start for both calculation and restoration, so changing preliminary practice height cannot manufacture completion. Existing stored fractions remain compatible; this is a proportional bookmark, not an exact sentence anchor.

`js/interactions.js` owns named finite WAAPI effects, `animateSequence` with bounded offsets, and their cancellation registry. A replacement cancels the older effect on the same target/channel; outgoing views and scenes cancel their delayed work. Pointerdown/focus settles animated ancestors so input takes priority. Motion-off, OS reduction and hidden-page changes release effects. Neither completion nor cancellation schedules application state. CSS owns ordinary control/chevron/indicator states and local answer/question cues. Longer motion belongs to grouped artwork and genuine completion, not paragraph cascades. Do not animate article height, input text or restored reading position; closing dialogs/menus never waits for an exit animation.

The portfolio reads shared tokens and motion preferences. Edit `studyStages`, `architecture`, feature stories, engineering details and extra sections in `about/content.js`; use [the authoring guide](../about/README.md) for structure and screenshot updates. Actual browser viewport captures with demonstration state illustrate selected Read/Apply/Return stages. A native responsive picture chooses the appropriate asset; mobile controls sit near their image and copy. Feature and technical bodies use native details disclosures, while meaningful headings remain available. Large artwork begins its one-shot entrance when the artwork itself becomes visible. There is no separate gallery or viewport chooser. Captures are not physical-device test evidence.

Only About's decorative artwork responds to a fine hover pointer, at most 2° tilt and 6px displacement. Text and hit targets stay fixed; touch/keyboard controls expose every feature. Pointer effects reset on leave/blur/preference-off/hidden and request frames only in response to input. Reflection is confined to artwork; it is not an extra unmeasured light behind teaching text.

[ADR 009](adr/009-expressive-study-motion.md) defines current acceptance; the [answer research](research/2026-10-answer-surfaces-v070.md), [motion research](research/2026-10-motion-v070.md), [onboarding design](design/onboarding-v070.md), [Profile/results design](design/profile-results-v070.md) and [About authoring](../about/README.md) record the evidence and implementation choices. Earlier reports remain historical evidence. Verify `npm run check`, the repository browser sweep, 320px reflow, enlarged text/spacing, keyboard/focus, invariant option geometry, pretest progress/resume, rapid interaction/cancellation, dialog outcomes, pause/reduced/hidden-page behavior, editable About layouts, and offline/install paths. Record actual outcomes in [VALIDATION.md](VALIDATION.md); calculation or automation does not replace learner observation.

Readiness-gated `whenVisible` waits for actual fonts/images and intersection before
finite artwork starts. Pending arrivals share cancellation with active scenes.
The [adaptive rail](design/scroll-rail-v071.md) enhances actual scrolling with
bounded navigation in a measured wide gutter, and a passive narrow-screen
indicator. It neither snaps articles nor advances quiz questions. Equal header
outer tracks keep the screen title centered when controls change.
