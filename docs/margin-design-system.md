# Margin / Sakura: interface system · v0.74

> **Partly superseded (2026-10-10).** Written at v0.74. Motion is now [ADR 014](adr/014-choreographed-entrances.md) and [motion v0.76](design/motion-v076.md); About was rebuilt in v0.77 ([about/README.md](../about/README.md)), so every folio passage here is history. Tokens, colour roles, answer semantics, type and the aurora still hold. Precedence: `CLAUDE.md`.

Margin is English Prep's current interface. [ADR 012](adr/012-elastic-edge-and-expressive-arrivals.md) records the living atmosphere, articulated controls, inspectable portfolio, mobile scroll grip and explicit data transfer. Earlier ADRs remain historical evidence: ADR 006 retains the typography decision and the Sakura answer semantics remain, while earlier per-field aura caps, passive mobile rail and whole-popup motion are superseded. [css/editorial.css](../css/editorial.css) supplies presentation tokens over inherited [css/style.css](../css/style.css); [css/interactions.css](../css/interactions.css) owns shared control states, [css/onboarding.css](../css/onboarding.css) the introduction, and [css/scroll-rail.css](../css/scroll-rail.css) the grip and rail. The older [design-system.md](history/design-system.md) remains historical source documentation. [EXPERIENCE.md](EXPERIENCE.md) describes the learning journeys.

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
| Supporting text `--ink-2` | `#d2c9d3` | `#625864` |
| Decorative separator `--hairline` | `#39313d` | `#e2d8e2` |
| Essential boundary `--edge` | `#95899b` | `#887b88` |
| Primary gradient `--accent` / `--accent-2` | `#ed96b4` / `#dca2d8` | `#a13462` / `#854987` |
| Primary label `--accent-ink` | `#301b27` | `#ffffff` |
| Sakura text / selected tint | `#efb1cb` / `#30222d` | `#922e55` / `#f6e7ed` |
| Focus `--focus` | `#d4b5f8` | `#7848af` |
| Secondary accent `--secondary` | `#c8b4e9` | `#7652a0` |
| Cool context `--cool` / `--cool-tint` | `#a4d3db` / `#1e3038` | `#28677a` / `#e5f1f5` |
| Attention accent `--tertiary` | `#e9bb95` | `#92501f` |
| Correct `--ok` / `--ok-tint` | `#eeb4d1` / `#392532` | `#953b67` / `#fae5ef` |
| Incorrect `--no` / `--no-tint` | `#b6c6ed` / `#252d42` | `#405f94` / `#eaf0ff` |
| Correct boundary `--ok-edge` | `#bb8ca4` | `#b16b8d` |
| Incorrect boundary `--no-edge` | `#8d9bbd` | `#657fac` |

Cherry identifies the brand and primary action; Sakura supports selected destinations and concise structural emphasis. Sakura correct and periwinkle incorrect are semantic aliases chosen for this product; pink is not claimed to universally mean correct. Lagoon supplies a cool context/action counterpoint; iris and apricot retain structural/attention roles. The interface does not assign Sakura to every label simply because it is the primary brand color. Hues alone never establish correctness: check/cross shapes and literal Doğru/Yanlış verdicts stay visible, while linked Turkish descriptions expose answered state on focus. English sentences and shortcut keys remain neutral. Correct and selected-incorrect rows receive full opaque tints, measured softer borders and colored verdict marks; unselected incorrect alternatives remain neutral. Explanation paragraphs receive no additional frame. Essential boundaries remain distinct from decorative separators.

Main ink carries lesson prose, examples, answers and rationales. Supporting ink belongs to short context/help, not automatically every second teaching paragraph. Form labels may use the secondary accent; key terms may use Sakura. Neither adds filled highlight boxes to continuous reading.

The [living atmosphere study](research/2026-10-living-aura-v072.md) replaces the old per-field overlap model with a single parent-composition cap and continuous convex-envelope proof. [The production checker](../tools/editorial-palette.mjs) measures actual stylesheet roles, state borders against inside/surrounding planes, action gradients, explicit sRGB answer transitions, intermediate aura mixtures and conservative full-alpha title halos. Across every allowed dark atmosphere composite, main prose remains ≥9.66:1, supporting text/notes ≥7.19:1, control boundaries ≥3.49:1 and focus ≥6.49:1. A haloed neutral title retains ≥7.04:1 before blur reduces local shadow alpha. Correct/incorrect cards remain opaque. These are color measurements, not proof of comfort or a preferred emotional tone. WCAG 2 contrast is enforced; APCA remains supplementary. [The v0.70 answer study](research/2026-10-answer-surfaces-v070.md) preserves evidence for the Sakura/periwinkle choice; older background bounds are historical. Final integrated results belong in [VALIDATION.md](VALIDATION.md).

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

The fixed shell contains one scrolling region, with a header and bottom navigation or contextual action bar. Mobile gutters are 24px, reducing to 16px below 360px. At **1080px width and 600px height**, suitable screens gain a 300px companion pane within the 988px maximum frame. The inner reading column stays approximately 592px; articles and quizzes remain single-column. The home companion pane is sticky only at ≥1080px width and ≥800px height, with a 48px top inset; in shorter windows it flows so its controls remain reachable. A `ch` cap, where present, is a CSS glyph measure rather than a literal character count.

Buttons and fields generally use 8px corners, answer rows 10px, and larger component surfaces 12–16px. Minimum heights allow content to grow: 44px icon/choice targets, 48px standard controls and 52px primary actions. Answer rows reserve a final verdict column **before** answering so adding the mark cannot reduce text width and trigger new wrapping. Their text and fixed action bar must remain stable through feedback.

An inline check has one containing surface; feedback adds no nested frame. Topic hover has rounded local treatment and text emphasis, not a square edge-to-edge slab. Resume uses a labeled reading-position bar separate from its English lesson name. Profile and results use comparable linear metrics, stable numbers and honest empty states. Recheck geometry with long content, enlarged text and short viewports.

## Component and state contracts

| Component | Required behavior |
| --- | --- |
| Navigation | Eğitim/Test remain peers; Profil belongs in the header. Preserve route context, browser Back, active state and visible focus. |
| Introduction | Three optional pages: six Education/Test scenes built from composed sheets, answer rows and drawn paths, then optional name/start. Native pressed-state controls change meaningful explanation immediately; choices survive Back. No diagram writes learning progress. Skip remains available; no dates, goals, streaks, fabricated questions or deep-link interruption. |
| Curriculum | Actual corpus totals, useful reading/resume action, search and empty-result feedback. No invented progress. |
| Fields and menus | Visible labels, keyboard operation and reachable menus above fixed chrome; active options scroll into view. The committed value has a reserved check slot, separate from keyboard-active focus. Chevron tracks expanded state. Popup geometry stays fixed; an outside shadow responds while up to four visible labels and the selected check assemble independently. No clipping mask changes the hit area. It closes immediately. Pointer/focus input settles moving ancestors. |
| Article / pretest | Continuous source article; unread pretest starts open and has a direct `Derse geç` action. Its height and explanation are excluded from article progress. Manual collapse persists during the reader session; checks never gate reading. A drawn completion signature accompanies only the first unfinished-to-done event. Reopening a completed lesson does not replay it; resume prose stays still. |
| Answer / feedback | One press commits; keep rationale and selected-option explanation available until continuation. Small marks receive a finite cue; the question does not replay its entrance and answer geometry stays fixed. Turkish state descriptions do not replace English option names. Valid same-tab refresh preserves order and feedback. |
| Results | Stable correct/answered fraction and linear bar, never a count-up or score ring. One answer describes that answer, not overall proficiency. Review and stable attempt IDs remain. A first-presentation paper-to-review signature uses a separate tab-local marker; recording an attempt before navigation does not mean its result has been presented. |
| Profile | Linear completion/recent-accuracy metrics with sample context and an explicit empty state. Group study, appearance/motion, application links and local-data actions. Preserve name, focus, backup/restore/reset and install behavior. Visible groups compose only on arrival; name edits and internal renders do not replay the entrance. |
| Backup export | Preview one current v1 snapshot, record counts, name inclusion and size before choosing file share, download or text copy. Opening transfers nothing; cancellation never starts a fallback download. Clipboard failure reveals selectable JSON; closing clears the preview and invalidates pending feedback. |
| Restore | Native dialog, visible initial focus, review before merging, actionable failure/retry and honest rollback limits. Dialog geometry remains stationary while title, description and action contents assemble. Interior-padding clicks preserve draft input; real backdrop/Escape closes immediately with native focus restoration. |
| Legacy data | Preserve old backup/storage fields, including dates and goals, without exposing removed features in the new UI. |
| Branding / install | Shared `ep.` / `english prep.` wordmarks and Sakura dot. Expandable `/about/` opens with an inspectable three-leaf folio and nearby chapter/inspection controls, real captures and native feature/technical disclosures; no separate gallery. Supported native install action or honest guidance; no automatic interruption. |

Quiz snapshots are tab-local and validated against current content, not a cross-device resume service. Restore stages writes and attempts rollback because localStorage has no multi-key transaction. These boundaries and the unchanged backup format are described in [EXPERIENCE.md](EXPERIENCE.md).

## Atmosphere, motion and verification

Three bounded clusters sit behind every route, including lessons, questions and About. Each contains cherry `#a04278`, iris `#6350a5` and lagoon `#28798a` radial pigments. Cluster drift takes 9.75/11.75/13.75 seconds; complete color cycles take 13.5/15.75/18 seconds, with independent phases. The **parent** `.ambient` flattens all nine child layers before applying opacity 0.42 dark / 0.09 light. Do not move that cap onto individual fields: it would invalidate the contrast proof. Every permitted mixture and overlap stays in the measured continuous color envelope. Reading ink is stable; cards remain opaque. A static halo is confined to selected neutral titles. No animated blur, hue rotation, particles, scroll parallax, automatic story rotation or animated teaching-text color is used.

`js/motion.js` owns the persistent preference. Only Profile settings expose the labeled motion toggle; About links to these settings. There are no top, onboarding or content-footer toggles. Pausing leaves a still atmospheric background. Hidden tabs pause all three drift and nine pigment timelines; system reduced motion takes precedence and uses a distinct stationary tone at each anchor. Forced colors removes the decoration. The bounded background must remain contrast-safe at every field position, not only in a screenshot.

| Interaction role | Token / behavior |
| --- | --- |
| Press / release | 120ms inner compression, then `--d-release: 380ms` rebound from the current transform; outer target stays usable. |
| Reveal | `--d-reveal: 220ms`; local/menu/disclosure cue while state/focus updates immediately. |
| Page arrival | Restored v0.72: `--d-route: 360ms`, 12px route slide, existing question panel and local result cues. |
| Short transition | `--d-route: 360ms`; retained panel/artwork cue, no blocking overlay. |
| Scene | `--d-scene: 560ms`; grouped Profile/product artwork composition. |
| Completion | `--d-complete: 720ms`; genuine completion signature and decorative path drawing; final values exist immediately. |
| Story | `--d-story: 900ms`; articulated onboarding/product artwork, never an input delay. |
| Flow | `--d-flow: 1100ms`; soft illustrated movement and connected path tracing in cohesive story scenes. |
| Answer / input / selection | Commit immediately; no scoring delay, punitive shake or celebratory count-up. |

Disabling motion preserves every state and control. Focus remains visible and clear of fixed chrome. Reading progress uses the real instructional-body start for both calculation and restoration, so changing preliminary practice height cannot manufacture completion. Existing stored fractions remain compatible; this is a proportional bookmark, not an exact sentence anchor.

`js/interactions.js` owns named finite WAAPI effects, `animateSequence` with bounded offsets, and their cancellation registry. A replacement cancels the older effect on the same target/channel; outgoing views and scenes cancel their delayed work. Pointerdown/focus settles animated ancestors so input takes priority. Motion-off, OS reduction and hidden-page changes release effects. Neither completion nor cancellation schedules application state. CSS owns ordinary control/chevron/indicator states and local answer/question cues. Ordinary control faces receive tactile press/release and fresh pages use their restored `animateSequence`/`route` cues; menu/dialog shells retain their outside shadow/outline response; item labels, selected checks and button contents animate separately. Onboarding uses `item`, `unfold`, `fan`, `signal`, `rule` and `trace` roles instead of repeating a whole-diagram wobble. Explanatory copy stays stationary. Longer motion belongs to grouped artwork and genuine completion, not article paragraph cascades. Do not animate article height, input text or restored reading position; closing dialogs/menus never waits for an exit animation.

The portfolio reads shared tokens and motion preferences. Edit `folioChapters`, `studyStages`, `architecture`, feature stories, engineering details and extra sections in `about/content.js`; use [the authoring guide](../about/README.md) for structure and screenshot updates. Actual browser viewport captures with demonstration state illustrate selected Read/Apply/Return stages. A native responsive picture chooses the appropriate asset; mobile controls sit near their image and copy. Feature and technical bodies use native details disclosures, while meaningful headings remain available. Large artwork begins its one-shot entrance when the artwork itself becomes visible. There is no separate gallery or viewport chooser. Captures are not physical-device test evidence.

About's main object is an inspectable folio with three real screenshot leaves. Its index, stack, handling controls and caption share one frame. Native chapter controls select a leaf; “Katmanları aç” separates the stack, and “Döndür”/“Öne dön” explicitly choose the angle. Stack/angle composition takes 860/680ms, while capture fold, sheet fan, corner and icon use shared finite roles. Each active capture waits for decoding, fonts and visibility; rapid choices cancel older arrivals. Optional horizontal dragging selects an adjacent leaf after 46px release travel, with at most ±16° horizontal / ±5° vertical decoration. Vertical swipes and pinch zoom remain native; buttons and Left/Right/Home/End expose the same chapter actions. Cancel/blur/hidden/preference changes release handling without selecting a chapter. Explanatory text stays outside moving geometry, and no idle JavaScript frame loop runs.

[ADR 013](adr/013-restore-page-entry-and-browser-space.md) defines current acceptance; [living atmosphere](research/2026-10-living-aura-v072.md), [articulated controls](research/2026-10-articulated-controls-v072.md), [folio design](history/design/about-v072.md), [rail design](design/scroll-rail-v073.md), [data transfer](research/2026-10-data-transfer-v072.md) and [About authoring](../about/README.md) record evidence and choices. Earlier reports remain historical. Verify `npm run check`, browser sweeps, 320px reflow, enlarged text/spacing, keyboard/focus, invariant option and popup hit geometry, pretest progress/resume, rapid cancellation, export/restore outcomes, pause/reduced/hidden behavior, editable About layouts, mobile rail gestures and offline/install paths. Record actual outcomes in [VALIDATION.md](VALIDATION.md); automation does not replace learner observation.

Readiness-gated `whenVisible` waits for actual fonts/images and intersection before
finite artwork starts. Pending arrivals share cancellation with active scenes.
The [elastic rail](design/scroll-rail-v073.md) follows actual scroll position.
Its 1.5px thread and 5px thumb remain slim on both mobile and desktop; a held
thumb grows to 8px and pulls a local curve inward by at most 14px. Horizontal
deformation uses a finite frame-time response, while vertical position is exact.
Section markers follow the curve. Release continues smoothly from the current
bend without a separate keyframe or pulse ring. A measured desktop gutter
protects content; compact layouts use a local 44px target and an optional 16px
edge strip for destination taps. No opaque well opens. Continuous scrolling,
intentional section travel, keyboard and cancellation remain distinct, complete
operations. Forced colors/insufficient space use native fallbacks. Equal header
outer tracks keep titles centered as controls change.
