# Changelog

Versioning: `x.y`, `x` fixed at `0` while the app is in development — see
the README's **Versioning** section for the exact rule (only the project
owner bumps `x`; everything below is a `0.y` development build, not a
release).

## v0.11 — 2026-09-03

Two lines of work that had run in parallel are merged here: the content
side's rewrite of every lesson into full article form, and a development
round that had continued from `v0.5` on its own branch. Nothing from
either is dropped — the navigation decisions made in `v0.6`–`v0.10` in
response to direct feedback stand, and the Eğitim reader is rebuilt on
top of them around the new content.

### Eğitim now reads the article content

- **Lessons are articles, not slides.** Every lesson across all three
  topics is authored as `intro / form / meaning / usage / examples /
  commonMistakes / recap` (content side, `docs/education-notes.md`),
  replacing the old rule-plus-two-examples shape that could only ever
  render as a slideshow. The app decides the pacing: those sections
  become the reader's steps, so content authors write prose, not screens.
- **Common mistakes get a real presentation** — the wrong form struck
  through above the fix, with the Turkish reason underneath. This is the
  step that carries the most exam value and it now looks like it.
- **Check questions are drawn from the same category's Test pool**, so a
  category never needs two parallel bodies of content kept in sync. They
  are never scored and **never gate progress**: an unanswered check reads
  "Atla", so re-reading one lesson for one rule never means sitting an
  exercise to get past it.
- **The index covers every topic**, grouped and skimmable, with per-lesson
  progress, an overall progress bar, and a "pick up where you left off"
  card. Lesson ids are derived from topic + category rather than
  authored, so a content file carries no bookkeeping field that could be
  renumbered by accident.
- **Hash routing** (`#egitim`, `#test`, `#profil`, `#egitim/<lessonId>`):
  the device back button steps back through the app instead of leaving
  it, a lesson can be linked to, and a reload keeps your place. Profil
  and the results screen use it to link a weak category straight to the
  lesson that teaches it.

### Quality infrastructure

- **`tools/validate-content.mjs`** (`npm run validate`) replaces
  `scripts/validate-content.js`, checking everything it did plus the
  lesson article schema, cross-file agreement (`questionCount`,
  `lessonCount`, `categories`), duplicate answer options — which the
  case-insensitive scorer would mark correct twice — and the seam between
  a question's blank and its correct option.
- That last check found two real content bugs on its first run:
  `passive-voice-t22` and `-t24` read "was written by **by** a student"
  once the correct option was filled in. An author writing the option and
  the sentence separately cannot see that seam, and neither can a reader
  of the JSON.
- **Unit tests** (`npm test`, `node:test`): 28 covering scoring and the
  storage layer, including corrupt-store and unavailable-`localStorage`
  degradation. **CI** runs both on every push and PR to `main` and `test`.
- **`docs/CONTENT_GUIDE.md`** is the authoritative schema, and
  **`docs/agents/`** holds paste-ready briefs for the sessions that
  author lessons and questions. **`CLAUDE.md`** carries project context
  forward.

### Fixes

- The "still in development" note stayed on screen inside the lesson
  reader, which is supposed to be a focused mode, eating a third of a
  phone screen.
- A failed content load left Eğitim permanently stuck on its error
  message: the "already loaded" flag was set before the fetch, so leaving
  and returning never retried. Topic files were also fetched and parsed
  twice; they're cached now, with failures evicted so a retry retries.
- `viewport-fit=cover` was declared but no safe-area insets were applied,
  so the bottom bar sat under the home indicator on notched phones.
- The fixed shell used `height: 100%`, which jumps as mobile browser
  toolbars slide in and out; it now tracks `100dvh` where supported.
- Going back from the results screen re-entered `quiz.html` and silently
  rolled a brand new test.
- Fraunces 400 was used by the question prompt and lesson example
  sentences but never requested. The font request now asks for exactly
  the two weights the stylesheet uses, down from nine.
- `isCorrectAnswer` threw on an unanswered question instead of scoring it
  wrong; pressing Enter on a focused advance button could fire twice and
  skip a question; anchors styled as buttons carried the UA underline.
- Five questions were single sentences rather than the cloze passages the
  exam uses, and the Passive Voice question ids didn't carry their topic
  prefix.

### Accessibility and mobile

- The custom dropdown now implements the WAI-ARIA listbox contract it
  took over from `<select>`: arrow keys, Home/End, Enter/Escape,
  `aria-activedescendant`, and an accessible name that includes the
  current value (it previously announced only "Soru sayısı").
- The confirm modal traps focus while open, returns it to whatever opened
  it, and opens on Cancel rather than the destructive action.
- The bottom nav follows the ARIA tabs pattern (roving tabindex,
  arrow-key navigation) and stays reachable while Profil is open.
- Answer feedback is announced (`role="status"`) rather than signalled by
  colour alone, and a wrong answer in a lesson check now says so in words.
- Every touch target is at least 44px; `prefers-reduced-motion` is
  honoured.
- Verified with Playwright across 320/390/768/1280: 217 checks, no
  horizontal overflow, no undersized targets, no console errors.

### Internal

- Extracted `js/dom.js` (shared node builders — the app still uses no
  `innerHTML` anywhere), `js/feedback.js` (one answer-feedback block for
  both Test and Eğitim checks), `js/quiz-launch.js` (the single path that
  starts a test, so a new entry point can't skip marking content seen),
  and `js/config.js`.

## v0.10 — 2026-09-03

UI/UX overhaul driven by direct feedback on v0.9 ("Eğitim sistemini hiç
beğenmedim", "tepedeki menü kötü"): the top navigation moves to the
bottom, the header shrinks, and Eğitim gets a skimmable entry point
instead of forcing one linear path through each chapter.

- **Bottom tab bar replaces the top tab bar.** Eğitim/Test now switch via
  a fixed bottom nav with distinct icons (open book vs. checklist),
  following the mobile-standard pattern for 2–5 top-level destinations —
  better thumb reach, and structurally separates the two modes instead of
  two mirror-image tabs sharing one bar. Profil deliberately stays out of
  it (still the header-corner avatar button) — it's identity/settings,
  not a content mode.
- **Header collapses to one slim row.** Drops the wordmark's subtitle/
  greeting line entirely; just "English Prep" + the profile avatar.
- **Eğitim gets a chapter index.** Opening Eğitim now shows a skimmable
  list of every chapter across every topic (category name + one-line rule
  preview) — tap any row to jump straight into that chapter's story
  cards, no need to walk through earlier ones first. A "‹ Konulara Dön"
  control returns to the index from mid-chapter, and the chapter-complete
  card now offers it alongside "Bu Konudan Test Et". This was the direct
  fix for the "didn't like the Eğitim system at all" feedback: a forced
  single path with no way to jump to or skip anything is a known-bad
  pattern for study/reference use (fine for onboarding a total novice,
  bad once you want a specific rule).
- **Check questions no longer hard-gate.** Down to 1 per chapter (from
  2); the forward control is never disabled on an unanswered check card —
  it reads "Atla" (skip) until answered, then the normal "›".
- Research and reasoning behind this round — bottom-nav ergonomics,
  Duolingo's path-vs-practice-hub split, linear-story vs. skimmable-view
  precedent, icon-based destination differentiation — are in the approved
  plan for this round; see the PR/commit for the full citation list.

## v0.9 — 2026-09-03

Eğitim rebuilt as a story-card chapter viewer, two new topics live, and
the content pipeline gets a validator.

- **Eğitim redesign: story cards.** Replaces the flat, all-topics-in-one
  pager with a chapter-by-chapter sequence of small full-screen beats per
  category — hook (when a lesson has one) → rule → each example → 2
  embedded check questions (answer required before advancing) → a
  generated chapter-complete beat, ending each topic with a "Bu Konudan
  Test Et" shortcut into a full Test session for it. A segmented progress
  bar (Stories-style) shows position within the current chapter; a topic
  switcher (pills) appears once more than one topic is live; edge arrows
  (plus ArrowLeft/ArrowRight/number-key/Enter shortcuts) move through
  cards. Built from the content side's "Vision" proposal in
  `docs/education-notes.md` — presentation only, no chapter locking yet
  (every chapter of every topic stays reachable any time, same as Test).
- **Modals and Passive Voice are live** (24 questions / 6 categories
  each, pulled in from the content-authoring side) — the app now has 3
  real topics instead of 1, and the home screen's tier accordion groups
  them for the first time.
- **`scripts/validate-content.js`**: a small, dependency-free script that
  checks the manifest and every topic file against the schema (see
  README). Passes clean against all 3 live topics.
- Small refactor: extracted `js/feedback.js` so the "verdict +
  explanation + tip" block isn't duplicated between `quiz.js` and the new
  story-card check cards.
- `docs/education-notes.md` gained a "Developer responses" section
  answering the content side's story-card vision and messages.

## v0.8 — 2026-09-03

Content/dev coordination lands, plus a small feature that closes the loop
on Profil's weak-spot data.

- **`docs/education-notes.md`** brought in from the content-authoring
  side's coordination branch: curriculum order for the next 12 topics, and
  a proposed interaction model for Eğitim (a linear, chapter-by-chapter
  guided path, soft-unlocked) versus Test (staying fully open, unchanged).
  Responded on the dev side: approved the proposal and its one new
  optional lesson field (`intro`), and decided embedded chapter-check
  questions share the same pool as Test rather than needing a reserved
  subset — full reasoning in the file.
- **New: "Pratik Yap" on weak categories.** Profil's weak-category list
  now has a button per entry that launches an open, category-scoped Test
  session straight from that weak spot, instead of just showing the
  number. `quiz.js` gained an optional `category` filter on top of its
  existing topic/count request shape to support this — no new schema,
  no content dependency.
- Weak-topic/weak-category list rows now share a `.breakdown-list__info`
  wrapper (small internal refactor to make room for the action button
  without duplicating the row-layout CSS).

## v0.7 — 2026-09-03

Small follow-ups from the `v0.6` navigation pass — closing out the last
two items planned for this round.

- **Dismissible "still in development" note**: a small banner above the
  tabs tells first-time visitors the app isn't `v1` yet and what's
  usable today (Eğitim, Test, Profil). Dismissing it is remembered
  locally and survives a history reset — it's a separate, deliberately
  simpler stand-in for the more elaborate multi-step onboarding tour
  that was on the roadmap; that fuller tour is deferred as
  disproportionate for this stage.
- **Weak-spot lists show rank numbers** ("1. Tenses", "2. ..."):
  addresses artifact-comment feedback that the ordering read as
  arbitrary — entries were already sorted weakest-first, the numbers
  just make that order visible instead of implicit.
- Ported both to the "Tenses Practice" artifact.

## v0.6 — 2026-09-03

Navigation restructure, driven directly by artifact-comment feedback left
on the `v0.5` preview — the recurring point across several comments was
that Profil didn't belong next to Eğitim/Test.

- **Profil moved out of the tab bar.** It now opens from a small circular
  button in the header instead of sitting as a third tab — it's
  identity/settings, not a content mode, so grouping it with Eğitim/Test
  was structurally wrong. The tab bar is back to two tabs.
- **Personalized header greeting.** Once a display name is set in Profil,
  the header shows "Hoş geldin, {name}!" instead of the static tagline,
  and the profile button shows the learner's initial. Updates live, no
  reload needed.
- **Header simplified**: the visible app name is now just "English Prep".
- Removed the artifact-only "Anlık önizleme" preview badge from its
  header, per direct feedback that it wasn't needed.
- This is the first step of a broader UX pass; see README's **Roadmap to
  v1.0** for what's next (a short onboarding tour, and a guided learning
  path mechanism in Eğitim).

## v0.5 — 2026-09-02

New "Profil" tab — a real, visible local profile, replacing the previous
silent/nameless tracking as the home for anything about *you* rather than
about a specific test result.

- **New "Profil" tab**: third tab alongside Eğitim/Test. Shows an optional
  display name (local only, saved on this device, never sent anywhere),
  overall stats (tests completed, questions answered, overall accuracy),
  and — once enough data exists — which topics and which grammar
  categories you're weakest in.
- **Per-category weak-spot history now persists**: category results were
  already shown per-test on the results screen, but weren't saved across
  sessions. `recordAttempt()` now persists `categoryBreakdown` alongside
  the existing per-topic breakdown, so "Zayıf Olduğun Kategoriler" reflects
  real history, not just the last test.
- **"Clear history" moved into Profil**: the old header button is gone;
  resetting local history (same in-app confirmation modal as before) now
  lives under Profil's "Ayarlar" section.
- Content-freshness tracking (the "Yeni sorular eklendi" badge) is
  unchanged and stays separate from the new profile — it isn't cleared by
  the history reset.
- Resolved the open design question on the quiz category eyebrow label:
  kept, since it's the same taxonomy the Eğitim tab's lessons use, not
  just decoration.

## v0.4 — 2026-09-02

Structural UX overhaul, driven by direct feedback on the v0.3 build and
preview artifact.

- **App shell rewrite**: the app is now a fixed-height column (header/tabs,
  a scrolling content area, a fixed bottom action bar on quiz/results)
  instead of an ordinary scrolling page. Answering a question no longer
  pushes the "Next Question" button around, and no screen ever shifts
  horizontally (no visible scrollbar anywhere, hidden via CSS while
  staying scrollable).
- **New "Eğitim" (teaching) mode**: a segmented Eğitim/Test tab control on
  the home screen. Eğitim is a fast, paginated tour through each topic's
  categories — a short rule plus simple examples, no scoring. Ships with 6
  real lessons for Tenses.
- **Custom in-app components replace native browser chrome**: the
  question-count picker is now an app-owned dropdown instead of `<select>`;
  "Clear history" now opens an in-app confirmation modal instead of
  `window.confirm()`. Neither can trigger OS-native UI or reflow the page.
- **Silent content-freshness tracking**: a nameless local record (extending
  the existing score history, no login, no visible profile screen) tracks
  which `contentVersion` of a topic a learner has seen, showing a "Yeni
  sorular eklendi" badge when it's grown since their last visit.
- **Full Turkish UI copy pass**: every interface string (buttons, headings,
  status lines, empty states) is now in Turkish. Practice sentences stay
  English; explanations/tips stay Turkish (already were); grammar category
  labels stay English.
- De-emphasized the `____` blank styling and removed the visible
  keyboard-shortcut hint (the 1–4/Enter shortcuts still work, just aren't
  advertised) per direct feedback that both were too loud for the primary
  mobile audience.

## v0.3 — 2026-09-02

UI/UX polish pass, informed by the roadmap (more topics, more tiers).

- Fixed a box-width inconsistency: the topic grid used `auto-fill` (which
  reserves empty grid tracks) and its padding wasn't scoped to a bordered
  container, so topic cards floated narrower than the hero panel with
  unexplained dead space. Switched to `auto-fit` and moved the grid's
  padding onto `.topic-tier`, so panels at the same nesting level always
  match widths.
- Quiz screen: added a "Back to Home" exit link, an animated progress bar,
  and a visible keyboard-shortcut hint (the 1-4/Enter shortcuts already
  worked but were undiscoverable).
- Topic cards now show a category-preview chip row.
- Added a real "Modals" (Core Grammar tier) `comingSoon` manifest entry, so
  the tier accordion groups topics for real today instead of only in a
  temporary test edit — rendered as a disabled "Coming soon" card, excluded
  from the mixed-test question pool.

## v0.2 — 2026-09-02

Content and visual identity overhaul, replacing v0.1's placeholder content
and generic look before any real use.

- **Tenses content rewritten**: replaced the 16 isolated, single-sentence
  placeholder questions with 24 paragraph-based cloze questions grouped
  into 6 confusable-form categories (e.g. "Present Perfect vs Past
  Simple"), matching the actual difficulty of a YTÜ İYS-style Cloze Test.
  Explanations and tips are now written in Turkish, the learner's own
  language; practice sentences stay in English.
- **New `tip` field**: each question now carries a short, generalizable
  rule alongside its situational explanation — shown in the quiz feedback
  and in the results review.
- **Category breakdown**: the results screen now shows a per-category score
  breakdown (in addition to per-topic), so a learner can see, e.g., that
  they specifically struggle with Past Perfect vs Past Simple.
- **Visual identity redesigned**: replaced the generic light "card + shadow"
  look with a single deliberate dark theme — warm ink-and-amber palette,
  Fraunces display serif for headings, IBM Plex Sans/Mono for body and
  numbers, hairline borders instead of shadowed cards.
- Manifest simplified to a single "Tenses" topic (was two separate,
  thinner per-tense topics).

## v0.1 — 2026-09-02

Initial development build.

- Home, quiz, and results screens for multiple-choice, fill-in-the-blank
  practice questions.
- Mixed test (random questions across all topics) and per-topic test modes.
- Immediate answer feedback with full teaching explanations.
- Results screen with score, per-topic breakdown, and a weak-topic callout
  based on locally saved history (`localStorage`, no backend).
- First topic set: Present Simple and Past Simple (8 questions each).
- Fully static, no build step; deploys directly via GitHub Pages.
