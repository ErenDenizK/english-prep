# English Prep · Margin: experience

## Product and audience

The redesign starts from the full `test` branch source at `39dcd46`, not the earlier `main` prototype. The preserved corpus contains **10 topics, 60 scrolling article lessons, and 241 questions**, with the original explanations, option notes, category mappings, and exam-coverage boundaries. No learning data was rewritten for this makeover.

The intended learner already understands English through everyday use but lacks the academic concepts needed to explain an answer reliably. The interface and teaching prose are Turkish; English examples, question stems, answer choices, and grammar terms remain English. A lesson clarifies a distinction the learner partly knows rather than treating them as a complete beginner.

The central promise is modest: understand the distinction, apply it to a question, and learn from the explanation. Practice results describe performance on this material, not proficiency or readiness for every section of a university examination.

## Information architecture

**Eğitim** and **Test** remain the two content modes in the bottom navigation. **Profil** opens from the header because identity, settings, and data management are supporting activities. Topic overviews sit between the curriculum index and the six articles within each topic. Hash routes retain the source app's navigation model and browser Back behavior.

The home introduction is calm and immediately useful: “Bildiğin İngilizceyi netleştir.” It shows actual corpus totals and an appropriate reading action, followed by curriculum search and the topic index. Returning readers can continue their material. A streak, daily-goal ring, countdown, and mandatory setup do not compete with the reading action. Existing optional profile settings remain available.

## Journeys and use cases

| Learner situation | Route and behavior |
| --- | --- |
| First visit | Open Eğitim directly, understand the scope, browse a topic or follow the suggested reading action. No setup completion is required. |
| Looking for a grammar concept | Search the curriculum using titles, categories, or summaries; open the matching lesson with its topic context. |
| Exploring a topic | Read the overview, examples, and exam context, then choose one of its six articles. |
| Reading a lesson | Read one continuous article containing contrasts, forms, examples, pitfalls, and a decision procedure. The content scrolls within the fixed app shell. |
| Trying a question before reading | Optionally expand “Okumadan önce kendini yokla.” It is collapsed initially and never blocks access to the article. |
| Checking understanding | Answer an inline check or scroll past it. Checks are unscored and never gate reading or completion. |
| Returning after interruption | Use saved lesson progress to resume reading. Completion and position use the existing local progress model. |
| Practising a particular distinction | Launch category practice from the relevant learning context or result recommendation. |
| General practice | Open Test and choose a mixed or single-topic session, retaining the source app's scope/count controls. |
| Giving an answer | An answer button commits the choice and reveals immediate feedback. Read why the key fits, the transferable rule, and the chosen distractor's meaning before advancing. |
| Reviewing a session | Inspect the score, topic/category breakdowns, and answer review; follow the existing routes back to relevant lessons or practice. |
| Revisiting persistent mistakes | Open Yanlış defteri. Its existing rule remains: an item graduates after correct answers on two separate days; a new mistake resets that progress. |
| Understanding progress | Open Profil for actual lesson completion, recent accuracy and its basis, weak categories, and the scope the app does and does not cover. |
| Moving or protecting local work | Use the existing export/import flow. History, profile preferences, lesson progress, and settings remain local. |
| Comparing versions | Open the full original from the curriculum footer, or use the source snapshot and earlier prototype links in the README. |

Reading flow: **Eğitim → topic overview → article → optional checks → relevant practice**.

Practice flow: **Test → scope → answer → explanation → next → results → review or lesson**.

Return flow: **Eğitim → resume reading**, or **Test → Yanlış defteri**.

## Interaction and state rules

- Keep the learning material accessible before asking for optional identity or goals. The source setup route remains available without automatically opening on arrival.
- Preserve instant answer feedback. Answer options are action buttons in a named group, not radios requiring a second submission step.
- Keep feedback readable until the learner chooses to continue. Correctness uses words and marks as well as color.
- Keep lesson checks and the optional pretest separate from scored test history. Reaching the article's end follows the source completion behavior.
- Preserve existing loading, empty, unavailable-content, backup, and recovery flows. Do not make an empty profile resemble a populated dashboard.
- Retain the original local-storage model. Hosted copies on the same origin share browser storage; separate URLs and cache namespaces do not create separate profiles.
- Retain the source's session handoff; this redesign does not introduce a new claim that unfinished test answers survive every refresh or tab closure.
- Use recorded evidence for recommendations. Sparse practice history does not establish mastery, examination readiness, or a diagnosed weakness.

## Presentation and responsive structure

“Margin” treats the app as an academic reading space: paper and ink in light mode, a quiet dark companion, restrained editorial headings, and distinct English examples. Home and Ventriloc inform the warm structure, Monopo informs typographic restraint and space, and Raycast informs the dark counterpart. These are visual references, not evidence of educational effectiveness.

A fixed header and navigation frame surround the scrolling content. At 320px the app remains a single-column reading flow. A useful two-column layout starts at **1080px width and 600px height**: introduction beside curriculum, overview beside lesson list, or results beside review. The article and question screens remain single-column. Extra screen width creates adjacency, not excessively long reading lines.

The current component system and exact production tokens are documented in [margin-design-system.md](margin-design-system.md). Research and its limitations are in [RESEARCH.md](RESEARCH.md).

## Preservation and delivery boundaries

- `/` contains the redesigned full app.
- `original/` hosts the full v0.64 interface from `test` at `39dcd46`. Only its service worker is adjusted at runtime to isolate offline caches; its UI, modules, and learning data are retained. Its README identifies that adjustment.
- `original/source-39dcd46.zip` preserves the unmodified source snapshot.
- `legacy/` preserves the earlier `main` prototype; it is not the full original used for this redesign.

The app remains static HTML, CSS, and ES modules with no backend, account requirement, analytics, or runtime package dependency. The redesign does not add paid features, AI-generated lessons, a fictional curriculum, or a separate scoring system. Scope-specific service-worker caches preserve both hosted interfaces and existing offline lessons.

## Validation scope

Exercise first arrival, topic navigation, curriculum search, article scrolling/resume, collapsed pretests, optional checks, mixed/topic/category/mistake tests, immediate explanations, results, profile settings, export/import, and original-version navigation. Check keyboard focus, narrow-screen overflow, dark/light themes, reduced motion, local assets, offline content, and byte equivalence of learning data.

Functional and visual checks validate implementation behavior. They do not replace observing representative students use the app or establish complete accessibility conformance.
