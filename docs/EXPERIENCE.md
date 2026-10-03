# English Prep · Margin: experience · v0.66

## Product and audience

The redesign starts from the full `test` branch source at `39dcd46`. Its **10 topics, 60 scrolling article lessons, and 241 questions** retain their original explanations, option notes, category mappings, and exam-coverage boundaries. No learning data was rewritten for the makeover.

The intended learner already uses English but needs the academic concepts and distinctions that explain why an answer fits. The interface and teaching prose are Turkish; examples, question stems, choices, and grammar terms remain English. The product promise is to clarify a distinction, apply it, and understand the feedback. Practice performance is not a proficiency certificate or a prediction for every examination section.

## Information architecture

**Eğitim** and **Test** are the bottom-navigation peers. **Profil** opens from the header for progress, preferences, and data management. Topic overviews connect the curriculum to six articles per topic. Hash routes retain browser Back and the source navigation structure.

Eğitim opens with “Bildiğin İngilizceyi netleştir.”, actual corpus totals, an appropriate reading action, curriculum search, and the topic index. Returning readers can continue their material. Optional identity, goals, and setup are available without delaying access to a lesson. Streaks and countdowns do not dominate the home screen.

## Journeys

| Situation | Route and behavior |
| --- | --- |
| First visit | Open Eğitim directly; browse a topic or follow the reading action. Dark is the initial theme; setup is optional. |
| Find a concept | Search titles, categories, and summaries; open a matching lesson with its topic context. |
| Explore a topic | Read its overview, examples, and exam context, then choose an article. |
| Read and return | Read a continuous article with contrasts, patterns, examples, pitfalls, and decision steps. Existing saved progress supports reading continuation. |
| Try a pretest | Expand the initially collapsed “Okumadan önce kendini yokla.” disclosure if useful. Reading never depends on answering. |
| Check understanding | Attempt or skip unscored inline checks. Completion remains independent of correctness. |
| Practise a distinction | Start category practice from a relevant lesson, result, or recommendation. |
| General practice | Choose a mixed or topic session in Test; counts describe the session being started. |
| Answer and learn | One press commits an answer and reveals the explanation, transferable rule, and relevant distractor note. Advance deliberately after reading. |
| Refresh during a test | In the same tab, restore a valid saved question/option order, answers, position, feedback, and hidden-options state. |
| Finish early | With answers recorded, finish with a score for those answers; unseen questions do not become mistakes. With no answers, exit without creating a result. |
| Review | Inspect score, topic/category breakdowns, and explanations; move directly to relevant reading or practice. Reloading results does not duplicate a stable attempt. |
| Revisit mistakes | Use Yanlış defteri. Its source rule remains: two correct answers on separate days graduate an item; a new mistake resets that progress. |
| Understand progress | Profil shows real lesson completion, recent accuracy and its basis, weak categories, and coverage limits. Sparse evidence does not establish mastery. |
| Choose appearance | Select Koyu, Açık, or Sistem in Profil. System follows OS changes live and remains an explicit saved preference. |
| Protect local work | Export a backup or review and merge an existing file/pasted backup. Storage errors remain visible with a retry path. |
| Compare versions | Open the full original from the curriculum footer; the exact source archive and earlier prototype remain available. |

Reading flow: **Eğitim → topic overview → article → optional checks → relevant practice**.

Practice flow: **Test → scope → answer → explanation → next → results → review or lesson**.

## State and recovery contracts

A new quiz launch deliberately starts a new session. Refreshing an active quiz in the same tab restores its validated snapshot instead of rerolling questions. The snapshot references current trusted question content; stale or altered content cannot supply its own scoring key. Snapshot storage can fail, and the app reports that failure rather than promising resume. Browser tab closure, eviction, a crash, and transfer to another device are not guaranteed resume paths.

A stable attempt ID lets a matching longer answer prefix advance the existing partial attempt. Legacy history keeps its existing compatibility rules. Session handoff and local history are separate: showing a result and durably saving it are not the same operation. Storage failures must not produce a success claim. Reading checks remain separate from scored test history.

The restore dialog opens at its visible heading, including in short landscape windows. Keyboard focus then follows its controls; native Escape closes it and returns focus to the opener. Choosing a file or pasting content leads to a review step before applying the merge. An old asynchronous file read cannot replace newer pasted text or populate a reopened dialog.

Restore keeps existing local progress and explicit preferences on conflicts. It merges history, advances lesson progress and seen-content versions, fills absent profile/practice preferences and exam date, and restores a valid daily goal only when no valid local choice exists. The existing backup format is unchanged; the active quiz snapshot and the separate theme preference are not included in it.

Writes are staged from a readable storage snapshot. If a write fails, the restore attempts to return its changed keys to their exact prior values. localStorage cannot guarantee a multi-key transaction, so failed rollback is disclosed as a potentially partial merge. The dialog stays open with the reviewed backup ready for retry; it does not announce completion. A canceled native share also receives neutral cancellation feedback, with no unsolicited download.

The app remains local to the browser. Original and redesigned copies hosted on the same origin share learner storage; separate URL paths and service-worker cache namespaces do not create separate profiles. Keep backups when moving between devices or browser containers.

## Presentation and responsiveness

Margin prioritizes a dark academic reading space with neutral charcoal surfaces, warm text, a readable supporting hierarchy, and restrained accents. Light mode remains fully usable. Inter distinguishes interface/Turkish teaching text from the existing Source Serif 4 English material. Relative type roles support enlarged text; bounded columns keep long articles readable on desktop. Theme choice is a preference, not a claim that dark mode improves learning.

A fixed header and navigation or action bar surround the scrolling content. The app works as a single column at 320px. A useful split starts at **1080×600**: introduction beside curriculum, overview beside lesson list, or results beside review. Articles and quizzes remain single-column. Enlarged text, spacing overrides, browser zoom, and short windows must retain reachable content, controls, and focus.

The component specification is [margin-design-system.md](margin-design-system.md). Evidence and limitations are in [RESEARCH.md](RESEARCH.md), with the detailed October research in [2026-10-ui-principles.md](research/2026-10-ui-principles.md).

## Preservation and verification

- `/` contains the redesigned full app.
- `original/` hosts the full v0.64 interface from `test` at `39dcd46`. Its only runtime adjustment isolates service-worker caches; source UI, modules, and learning data remain preserved.
- `original/source-39dcd46.zip` is the unmodified source archive.
- `legacy/` preserves the earlier `main` prototype.

The app remains static HTML, CSS, and ES modules, with no backend, account requirement, analytics, or runtime package dependency. Scoped caches preserve both interfaces and offline lessons.

Verify navigation/search, article resume, optional checks, all practice modes, quiz refresh and interrupted-session handling, results deduplication, profile preferences, backup success/failure/retry, original navigation, and unchanged learning data. Include keyboard focus, small and short viewports, themes, reduced motion, reflow, and offline assets. Automated and browser checks establish implementation behavior within their tested scope; they do not replace representative learner observation or complete assistive-technology testing.
