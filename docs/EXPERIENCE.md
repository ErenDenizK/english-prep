# English Prep · Margin / Sakura: experience · v0.69

## Product and audience

The redesign starts from the full `test` branch source at `39dcd46`. Its **10 topics, 60 scrolling article lessons, and 241 questions** retain their original explanations, option notes, category mappings, and exam-coverage boundaries. No learning data was rewritten for the makeover.

The intended learner already uses English but needs the academic concepts and distinctions that explain why an answer fits. The interface and teaching prose are Turkish; examples, question stems, choices, and grammar terms remain English. The product promise is to clarify a distinction, apply it, and understand the feedback. Practice performance is not a proficiency certificate or a prediction for every examination section.

## Information architecture

**Eğitim** and **Test** are the bottom-navigation peers. **Profil** opens from the header for progress, preferences, and data management. Topic overviews connect the curriculum to six articles per topic. Hash routes retain browser Back and the source navigation structure.

Eğitim opens with “Bildiğin İngilizceyi netleştir.”, actual corpus totals, an appropriate reading action, curriculum search, and the topic index. Returning readers can continue their material. An optional three-page introduction demonstrates the Eğitim flow, the Test/feedback flow, then offers a name and start action. The first two pages contain selectable, labeled diagram stages; choices survive Back and never write learning progress or fabricate questions. It remains skippable and does not intercept direct lesson links. Exam-date, daily-goal, streak and absence-reminder controls are removed from the current interface; they are not prerequisites for reading or practice.

## Journeys

| Situation | Route and behavior |
| --- | --- |
| First visit | Open Eğitim directly; browse a topic or follow the reading action. Dark is the initial theme. An optional three-page introduction lets learners explore the two study flows and accepts an optional name. Skip or return without losing diagram choices or a typed name. |
| Find a concept | Search titles, categories, and summaries; open a matching lesson with its topic context. |
| Explore a topic | Read its overview, examples, and exam context, then choose an article. |
| Read and return | Read a continuous article with contrasts, patterns, examples, pitfalls, and decision steps. A labeled resume bar shows the saved position within the instructional body; the heading and preliminary question do not contribute to that fraction. |
| Try a pretest | An unread lesson starts with the open “Önce bir dene” disclosure. Collapse it or use “Derse geç” to reach the article immediately. Answering and reading its explanation never increases article completion. |
| Check understanding | Attempt or skip unscored inline checks. Completion remains independent of correctness. |
| Practise a distinction | Start category practice from a relevant lesson, result, or recommendation. |
| General practice | Choose a mixed or topic session in Test; counts describe the session being started. |
| Answer and learn | One press commits an answer and reveals the explanation, transferable rule, and relevant distractor note. Correct/incorrect marks have a local cue; existing question text does not fade again. Returning to an answered option exposes its state through an accessible description. Advance deliberately after reading. |
| Refresh during a test | In the same tab, restore a valid saved question/option order, answers, position, feedback, and hidden-options state. |
| Finish early | With answers recorded, finish with a score for those answers; unseen questions do not become mistakes. With no answers, exit without creating a result. |
| Review | Inspect the stable correct/answered fraction, a restrained bar, topic/category breakdowns, and explanations; move directly to relevant reading or practice. Reloading results does not duplicate a stable attempt. |
| Revisit mistakes | Use Yanlış defteri. Its source rule remains: two correct answers on separate days graduate an item; a new mistake resets that progress. |
| Understand progress | Profil shows linear lesson completion and recent-accuracy metrics with their basis, plain lifetime counts, weak categories, and coverage limits. Missing test data has an explicit empty state; sparse evidence does not establish mastery. |
| Choose appearance | Select Koyu, Açık, or Sistem in Profil. System follows OS changes live and remains an explicit saved preference. |
| Control movement | Use grouped Profile settings or the quiet control at the bottom of scrolling app content, also reachable during lessons and tests. About has the same setting in its footer. No top motion button remains. The choice persists; system reduced motion takes precedence and hidden pages pause decoration and cancel finite effects. |
| Protect local work | Export a backup or review and merge an existing file/pasted backup. Storage errors remain visible with a retry path. |
| Install or learn about the product | Use Profil for supported install controls or browser-specific guidance. `/about/` explains features through a selectable Read/Apply/Return story and engineering through selectable architecture nodes. Actual phone/wide viewport captures illustrate the story without a separate gallery. Real actions link to reading, tests or source. |
| Compare versions | Open the full original from the curriculum footer; the exact source archive and earlier prototype remain available. |

Reading flow: **Eğitim → topic overview → article → optional checks → relevant practice**.

Practice flow: **Test → scope → answer → explanation → next → results → review or lesson**.

## State and recovery contracts

A new quiz launch deliberately starts a new session. Refreshing an active quiz in the same tab restores its validated snapshot instead of rerolling questions. The snapshot references current trusted question content; stale or altered content cannot supply its own scoring key. Snapshot storage can fail, and the app reports that failure rather than promising resume. Browser tab closure, eviction, a crash, and transfer to another device are not guaranteed resume paths.

A stable attempt ID lets a matching longer answer prefix advance the existing partial attempt. Legacy history keeps its existing compatibility rules. Session handoff and local history are separate: showing a result and durably saving it are not the same operation. Storage failures must not produce a success claim. Reading checks remain separate from scored test history.

The restore dialog opens at its visible heading, including in short landscape windows. Keyboard focus then follows its controls; native Escape closes it and returns focus to the opener. Clicking interior padding keeps it open and preserves uncommitted input; an actual backdrop click dismisses it. The reset confirmation shares that distinction and focuses its cancel action immediately. Choosing a file or pasting content leads to a review step before applying the merge. An old asynchronous file read cannot replace newer pasted text or populate a reopened dialog.

Restore keeps existing local progress and explicit preferences on conflicts. It merges history, advances lesson progress and seen-content versions, and fills absent profile/practice preferences. Legacy exam-date and daily-goal fields remain compatible: valid missing values may still be restored, but the new UI no longer exposes those controls. Existing valid local values win. The backup format is unchanged; the active quiz snapshot and separate theme/motion preferences are not included in it.

Writes are staged from a readable storage snapshot. If a write fails, the restore attempts to return its changed keys to their exact prior values. localStorage cannot guarantee a multi-key transaction, so failed rollback is disclosed as a potentially partial merge. The dialog stays open with the reviewed backup ready for retry; it does not announce completion. A canceled native share also receives neutral cancellation feedback, with no unsolicited download.

The app remains local to the browser. Original and redesigned copies hosted on the same origin share learner storage; separate URL paths and service-worker cache namespaces do not create separate profiles. Keep backups when moving between devices or browser containers.

## Presentation and responsiveness

Margin prioritizes dark plum-neutral surfaces, cherry/Sakura branding, muted jade confirmation and warm coral error accents. Iris and apricot remain decorative/attention roles rather than answer verdicts. Primary and supporting text retain distinct jobs. Inter serves both languages through roles for headings, form labels, patterns, prose, annotations and controls. English attributes remain semantic; language changes do not automatically change typography. Answer rows keep neutral surfaces, readable keys and stable primary text, with colored check/cross marks and literal verdicts. Explicit light/System preferences remain available. Theme or family choice is not a claim of improved learning.

Examples and explanations group through spacing instead of repetitive rules or highlighted boxes. Answer rows reserve their verdict space before feedback. Resume percentages are separate from English lesson titles, paired with a named linear track. Profile groups study settings, appearance/motion and application links; backup/reset retain their local-data context. Results describe this session's actual answers, with no ring/count-up or broad proficiency judgment from one question.

Three bounded aurora fields appear behind all routes, including reading and the portfolio, while foreground cards stay opaque. Cherry, iris and apricot fields drift slowly over 28/34/42-second paths at most 10% opacity each in dark mode and 5% in light mode. They can be paused without removing the still atmosphere. Reduced motion disables decoration movement; hidden pages pause it. Color/overlap bounds are measured alongside ordinary foreground roles.

Interaction motion has explicit jobs: 100ms press feedback, 160ms reveals, 220ms route/tutorial cues, and 360ms completion emphasis. Input, focus, answer commits and navigation remain immediate. CSS owns hover, press, chevrons, switches and tab indicators; a shared finite-effect module owns menu/dialog/diagram events and cancels replaced, disabled or hidden-page effects. Menus arrive from their actual attachment edge, reserve a selected-check column and close immediately. Routes use one entering cue, with no native View Transition snapshot that adds a second effect or temporarily blocks clicks. Wrong answers do not shake; numbers do not count up. Reading text, input and search do not receive decorative replays.

About's illustration responds to a fine hover pointer with at most 2° tilt and 6px displacement. The effect applies to artwork only: headlines, paragraphs and hit targets stay stable. Touch and keyboard expose the same information through ordinary controls. Pointer leave, blur, hidden-page and motion-off states reset the effect; no permanent JavaScript frame loop is required. Study and architecture selections are user-paced, with immediate content/pressed-state changes and no automatic rotation.

A fixed header and navigation or action bar surround the scrolling content. The app works as a single column at 320px. A useful split starts at **1080×600**: introduction beside curriculum, overview beside lesson list, or results beside review. Articles and quizzes remain single-column. Enlarged text, spacing overrides, browser zoom and short windows must retain reachable content, controls and focus. Tour pages can grow rather than clipping to a fixed slideshow height.

The current decision is [ADR 008](adr/008-explorable-interactions.md); component contracts and exact tokens are in [margin-design-system.md](margin-design-system.md). [Status-color research](research/2026-10-status-colors-v069.md), [interaction-motion research](research/2026-10-interaction-motion-v069.md) and the [component review](audit/v0.69-component-review.md) document this refinement. [ADR 007](adr/007-sakura-and-purposeful-motion.md) retains the background/brand foundation; [ADR 006](adr/006-reading-hierarchy-and-atmosphere.md) retains the typography reasoning. Their replaced status hues, motion controls and product gallery are historical decisions. These are source reviews, measurements and implementation comparisons, not participant usability testing.

## Preservation and verification

- `/` contains the redesigned full app.
- `original/` hosts the full v0.64 interface from `test` at `39dcd46`. Its only runtime adjustment isolates service-worker caches; source UI, modules, and learning data remain preserved.
- `original/source-39dcd46.zip` is the unmodified source archive.
- `legacy/` preserves the earlier `main` prototype.

The app remains static HTML, CSS and ES modules, with no backend, account requirement, analytics or runtime package dependency. Shared `js/brand.js` supplies compact `ep.`, full `english prep.` and responsive signatures with one accessible brand name and Sakura dot. App icons retain the compact identity. The portfolio connects product benefits to study actions and explains actual engineering decisions; screenshots are supporting illustrations inside that story. Extensible `studyStages`, `architecture`, feature and extra-section data live in `about/content.js`; static hero/section placement lives in `about/index.html`. [About authoring](../about/README.md) explains adding entries, longer copy and real captures without changing the renderer. Captures use browser viewports and demonstration state, not physical-device testing. The manifest retains the app identity and Eğitim/Test shortcuts. Installation is voluntary and depends on browser support; successful offline use depends on available cached resources, not installation alone. Scoped caches preserve both interfaces. About/install behavior is part of final integration checks, not assumed from the manifest.

Verify navigation/search, article resume, optional checks, all practice modes, quiz refresh and interrupted-session handling, results deduplication, profile preferences, backup success/failure/retry, original navigation, and unchanged learning data. Include keyboard focus, small and short viewports, themes, persisted/reduced/hidden-page motion, rapid repeated interactions, default-open pretest progress boundaries, reflow, menu positioning, dialog padding/backdrop outcomes, editable portfolio content, pointer cleanup and offline assets. Automated and browser checks establish implementation behavior within their tested scope; they do not replace representative learner observation, physical-device testing or complete assistive-technology testing.
