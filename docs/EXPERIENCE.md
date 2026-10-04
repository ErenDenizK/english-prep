# English Prep · Margin / Sakura: experience · v0.73

## Product and audience

The redesign starts from the full `test` branch source at `39dcd46`. Its **10 topics, 60 scrolling article lessons, and 241 questions** retain their original explanations, option notes, category mappings, and exam-coverage boundaries. No learning data was rewritten for the makeover.

The intended learner already uses English but needs the academic concepts and distinctions that explain why an answer fits. The interface and teaching prose are Turkish; examples, question stems, choices, and grammar terms remain English. The product promise is to clarify a distinction, apply it, and understand the feedback. Practice performance is not a proficiency certificate or a prediction for every examination section.

## Information architecture

**Eğitim** and **Test** are the bottom-navigation peers. **Profil** opens from the header for progress, preferences, and data management. Topic overviews connect the curriculum to six articles per topic. Hash routes retain browser Back and the source navigation structure.

Eğitim opens with “Bildiğin İngilizceyi netleştir.”, actual corpus totals, an appropriate reading action, curriculum search, and the topic index. Returning readers can continue their material. An optional three-page introduction demonstrates the Eğitim flow, the Test/feedback flow, then offers a name and start action. The first two pages contain six selectable, labeled scenes whose sheets, answer rows and connecting paths assemble in bounded sequences; choices survive Back and never write learning progress or fabricate questions. Controls and final copy remain available throughout. It remains skippable and does not intercept direct lesson links. Exam-date, daily-goal, streak and absence-reminder controls are removed from the current interface; they are not prerequisites for reading or practice.

## Journeys

| Situation | Route and behavior |
| --- | --- |
| First visit | Open Eğitim directly; browse a topic or follow the reading action. Dark is the initial theme. An optional three-page introduction lets learners explore the two study flows and accepts an optional name. Skip or return without losing diagram choices or a typed name. |
| Find a concept | Search titles, categories, and summaries; open a matching lesson with its topic context. |
| Explore a topic | Read its overview, examples, and exam context, then choose an article. |
| Read and return | Read a continuous article with contrasts, patterns, examples, pitfalls, and decision steps. A labeled resume bar shows the saved position within the instructional body; the heading and preliminary question do not contribute to that fraction. |
| Try a pretest | An unread lesson starts with the open “Önce bir dene” disclosure. Collapse it or use “Derse geç” to reach the article immediately. Answering and reading its explanation never increases article completion. |
| Check understanding | Attempt or skip unscored inline checks. Completion remains independent of correctness. A drawn signature accompanies the first unfinished-to-done event; reopening a finished lesson does not replay it or delay the next action. |
| Practise a distinction | Start category practice from a relevant lesson, result, or recommendation. |
| General practice | Choose a mixed or topic session in Test; counts describe the session being started. |
| Answer and learn | One press commits an answer and reveals the explanation, transferable rule, and relevant distractor note. Correct/incorrect marks have a local cue; existing question text does not fade again. Returning to an answered option exposes its state through an accessible description. Advance deliberately after reading. |
| Refresh during a test | In the same tab, restore a valid saved question/option order, answers, position, feedback, and hidden-options state. |
| Finish early | With answers recorded, finish with a score for those answers; unseen questions do not become mistakes. With no answers, exit without creating a result. |
| Review | Inspect the stable correct/answered fraction, a linear bar, topic/category breakdowns and explanations. A paper-to-review signature marks first presentation; final values and actions exist immediately. Reloading does not replay completion or duplicate a stable attempt. |
| Revisit mistakes | Use Yanlış defteri. Its source rule remains: two correct answers on separate days graduate an item; a new mistake resets that progress. |
| Understand progress | Profil shows linear lesson completion and recent-accuracy metrics with their basis, plain lifetime counts, weak categories, and coverage limits. Missing test data has an explicit empty state; sparse evidence does not establish mastery. |
| Choose appearance | Select Koyu, Açık, or Sistem in Profil. System follows OS changes live and remains an explicit saved preference. |
| Control movement | Use grouped Profile settings; About links there. This is the only motion toggle. The choice persists; system reduced motion takes precedence and hidden pages pause decoration and cancel finite effects. |
| Protect local work | Preview one backup snapshot, its record counts, included name and file size; explicitly share its file, download it or copy its JSON. Review before merging a file/pasted backup. Storage and transfer errors retain a retry path. |
| Install or learn about the product | Use Profil for supported install controls or browser-specific guidance. `/about/` explains features through a selectable Read/Apply/Return story and engineering through selectable architecture nodes. An inspectable folio brings actual article/test/results leaves forward, separates the stack or turns it through explicit controls; native feature/technical disclosures keep the mobile narrative focused. Actual phone/wide viewport captures illustrate the story without a separate gallery. Real actions link to reading, tests or source. |
| Compare versions | Open the full original from the curriculum footer; the exact source archive and earlier prototype remain available. |

Reading flow: **Eğitim → topic overview → article → optional checks → relevant practice**.

Practice flow: **Test → scope → answer → explanation → next → results → review or lesson**.

## State and recovery contracts

A new quiz launch deliberately starts a new session. Refreshing an active quiz in the same tab restores its validated snapshot instead of rerolling questions. The snapshot references current trusted question content; stale or altered content cannot supply its own scoring key. Snapshot storage can fail, and the app reports that failure rather than promising resume. Browser tab closure, eviction, a crash, and transfer to another device are not guaranteed resume paths.

A stable attempt ID lets a matching longer answer prefix advance the existing partial attempt. Legacy history keeps its existing compatibility rules. Session handoff and local history are separate: showing a result and durably saving it are not the same operation. Storage failures must not produce a success claim. Reading checks remain separate from scored test history. Result presentation has its own tab-local `englishPrep.resultPresented` marker, claimed after the final DOM and actions exist even when motion is off. The quiz normally records before navigation, so `recorded` cannot establish that the learner has seen the result. This marker controls decoration only; it does not change scoring, durable history or backup semantics. Without presentation storage, a direct quiz handoff may receive the cue; other cases retain a complete static result.

The export action opens a native preview dialog with a single current v1 snapshot, record counts, name inclusion and file size. Opening does not start sharing, downloading or copying. Separate user actions choose the channel; optional raw JSON can be inspected and manually selected. File sharing runs directly from a user gesture, with capability checks against the actual JSON file. Cancellation is neutral and does not fall through to an unsolicited download. Copy failure opens the same selectable text rather than claiming success. Download feedback says it started; the application cannot prove an OS file save. Closing clears the private preview and invalidates pending feedback; reopening takes a new snapshot. No server or account is introduced.

The restore dialog opens at its visible heading, including in short landscape windows. Keyboard focus then follows its controls; native Escape closes it and returns focus to the opener. Clicking interior padding keeps it open and preserves uncommitted input; an actual backdrop click dismisses it. The reset confirmation shares that distinction and focuses its cancel action immediately. Choosing a file or pasting content leads to a review step before applying the merge. An old asynchronous file read cannot replace newer pasted text or populate a reopened dialog.

Restore keeps existing local progress and explicit preferences on conflicts. It merges history, advances lesson progress and seen-content versions, and fills absent profile/practice preferences. Legacy exam-date and daily-goal fields remain compatible: valid missing values may still be restored, but the new UI no longer exposes those controls. Existing valid local values win. The backup format is unchanged; the active quiz snapshot and separate theme/motion preferences are not included in it.

Writes are staged from a readable storage snapshot. If a write fails, the restore attempts to return its changed keys to their exact prior values. localStorage cannot guarantee a multi-key transaction, so failed rollback is disclosed as a potentially partial merge. The dialog stays open with the reviewed backup ready for retry; it does not announce completion. A canceled native share also receives neutral cancellation feedback, with no unsolicited download.

The app remains local to the browser. Original and redesigned copies hosted on the same origin share learner storage; separate URL paths and service-worker cache namespaces do not create separate profiles. Keep backups when moving between devices or browser containers.

## Presentation and responsiveness

Margin prioritizes dark plum-neutral surfaces and cherry/Sakura branding. Full opaque Sakura answer surfaces identify correct choices, and periwinkle surfaces identify selected incorrect choices. Separate measured borders support both states; pink is a product-specific choice, not a universally understood correctness code. Cool lagoon provides a second supporting accent; iris and apricot retain structural/attention jobs. Neutral supporting ink and essential boundaries are brighter to remain readable over the stronger atmosphere. Primary and supporting text retain distinct jobs. Inter serves both languages through roles for headings, form labels, patterns, prose, annotations and controls. English attributes remain semantic; language changes do not automatically change typography. Answer sentences and shortcut numbers stay neutral and stable; full colored rows, distinct check/cross marks, literal verdicts and accessible descriptions expose the result without relying on hue. Explicit light/System preferences remain available. Theme or family choice is not a claim of improved learning.

Examples and explanations group through spacing instead of repetitive rules or highlighted boxes. Answer rows reserve their verdict space before feedback. Resume percentages are separate from English lesson titles, paired with a named linear track. Profile groups study settings, appearance/motion and application links; backup/reset retain their local-data context. Results describe this session's actual answers, with no ring/count-up or broad proficiency judgment from one question.

Three bounded aurora clusters sit behind all routes, including reading and the portfolio, while foreground cards stay opaque. Each cluster cycles cherry `#a04278`, iris `#6350a5` and lagoon `#28798a`; drift takes 9.75/11.75/13.75 seconds and full pigment cycles 13.5/15.75/18 seconds, with independent phases. All nine pigment layers flatten under **one parent cap** of 0.42 dark / 0.09 light, rather than accumulating that alpha per layer. The production palette checker covers the entire continuous composite envelope and intermediate mixtures. A small static halo belongs only to selected neutral titles. Pause keeps the current atmosphere still; reduced motion uses three distinct stationary pools and hidden pages pause all twelve timelines.

Interaction motion is intentionally more visible in v0.73: a 620ms arrival
composes headings, context and actions with bounded stagger. Larger 24–32px
travel belongs to display titles, supporting groups use 12px, and compact
headings use 6px; a contained 6px entrance keeps control labels
inside their fills. A press compresses the inner face in 120ms, then a 380ms
release starts from its current position. The surrounding click target stays
usable, and one keyboard activation produces one release. A pre-paint control
preparation step avoids reparenting a pointer target during its gesture.

Data, focus, answers and navigation commit immediately. Readiness ensures slow
fonts or images do not consume an entrance before it can be seen. Replacement,
real input, motion-off, OS reduction and hidden pages clean up pending/active
effects. Onboarding retains its articulated drawings and About its interactive
folio. A resumed article restores position; typing and answer feedback do not
replay the page's arrival. Earlier restrained-motion reports are historical
decisions, not a prohibition on the owner's new animation direction.

About's opening object is one inspectable folio, not separate floating devices. Three real article/test/results leaves share an index, frame, inspection controls and caption. Native chapter buttons bring a leaf forward; the front leaf and “Katmanları aç” separate the stack. “Döndür” and “Öne dön” offer deliberate angled/front views. Optional horizontal dragging turns a leaf at a 46px release threshold, with bounded ±16° horizontal / ±5° vertical decoration. Native buttons and Left/Right/Home/End provide alternatives; vertical page swipes and pinch zoom remain available. Text that explains the product stays outside the moving geometry. Cancellation, blur, hidden page and preference changes release handling without selecting another chapter. There is no idle JavaScript frame loop.

Study and architecture selections remain user-paced, with immediate content/pressed states and no automatic rotation. Large artwork waits for image/font readiness and its own visibility before one-shot articulation. Native feature/technical disclosures open and close immediately; no illustration sequence gates access.

A fixed header and navigation or action bar surround the scrolling content. The app works as a single column at 320px. A useful split starts at **1080×600**: introduction beside curriculum, overview beside lesson list, or results beside review. Articles and quizzes remain single-column. At ≥1080px wide and ≥800px tall, the home companion pane stays stationary while the curriculum moves; shorter windows let it flow to preserve access. Enlarged text, spacing overrides, browser zoom and short windows must retain reachable content, controls and focus. Tour pages can grow rather than clipping to a fixed slideshow height.

The current decision is [ADR 012](adr/012-elastic-edge-and-expressive-arrivals.md); component contracts and exact tokens are in [margin-design-system.md](margin-design-system.md). [Living atmosphere research](research/2026-10-living-aura-v072.md), [articulated controls](research/2026-10-articulated-controls-v072.md), [folio design](design/about-v072.md), [rail design](design/scroll-rail-v073.md) and [data transfer](research/2026-10-data-transfer-v072.md) record current evidence and choices. Earlier ADRs remain historical evidence; their per-field aura caps, passive mobile rail and whole-popup translation are superseded.

## Preservation and verification

- `/` contains the redesigned full app.
- `original/` hosts the full v0.64 interface from `test` at `39dcd46`. Its only runtime adjustment isolates service-worker caches; source UI, modules, and learning data remain preserved.
- `original/source-39dcd46.zip` is the unmodified source archive.
- `legacy/` preserves the earlier `main` prototype.

The app remains static HTML, CSS and ES modules, with no backend, account requirement, analytics or runtime package dependency. Shared `js/brand.js` supplies compact `ep.`, full `english prep.` and responsive signatures with one accessible brand name and Sakura dot. App icons retain the compact identity. The portfolio connects product benefits to study actions and explains actual engineering decisions; screenshots are supporting illustrations inside that story. Extensible `folioChapters`, `studyStages`, `architecture`, feature and extra-section data live in `about/content.js`; static hero/section placement lives in `about/index.html`. [About authoring](../about/README.md) explains adding entries, longer copy and real captures without changing the renderer. Captures use browser viewports and demonstration state, not physical-device testing. The manifest retains the app identity and Eğitim/Test shortcuts. Installation is voluntary and depends on browser support; successful offline use depends on available cached resources, not installation alone. Scoped caches preserve both interfaces. About/install behavior is part of final integration checks, not assumed from the manifest.

Verify navigation/search, article resume, optional checks, all practice modes, quiz refresh and interrupted-session handling, results deduplication, profile preferences, backup success/failure/retry, original navigation, and unchanged learning data. Include keyboard focus, small and short viewports, themes, persisted/reduced/hidden-page motion, rapid repeated interactions, default-open pretest progress boundaries, reflow, menu positioning, dialog padding/backdrop outcomes, editable portfolio content, pointer cleanup and offline assets. Automated and browser checks establish implementation behavior within their tested scope; they do not replace representative learner observation, physical-device testing or complete assistive-technology testing.

The branded rail follows actual native scrolling. Mobile and desktop share
a 1.5px line and a 5px thumb, growing only to 8px on contact. A local curve bends
up to 14px inward under the finger and settles smoothly; vertical scroll position
is never eased behind the pointer. Mobile retains a local 44px touch target and
reveals a narrow 16px edge strip for tap destinations. There is no expanding
opaque box. Wheel/drag stay continuous; section dots and Shift+Arrow lead to real
blocks without automatic snapping. Motion-off disables decorative deformation;
forced colors and insufficient space restore native controls. Captures use 3×
phone and 2× desktop density.
