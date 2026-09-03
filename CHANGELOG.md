# Changelog

Versioning: `x.y`, `x` fixed at `0` while the app is in development — see
the README's **Versioning** section for the exact rule (only the project
owner bumps `x`; everything below is a `0.y` development build, not a
release).

## v0.11 — 2026-09-03

A full visual and interaction overhaul, plus the functional gaps an audit
of the whole app turned up. Prompted by direct feedback that the UI was
"kutu içinde kutu, çok göz yoruyor" (box inside box, very tiring) with a
request for deliberate minimalism rather than another round of patches.

**The design system is now written down.** `docs/design-system.md` states
every rule and the reason behind it. The core change: in a dark
interface, depth comes from **lightness, not outlines**. Three surface
levels replace the old habit of drawing a 1px border around everything,
and a border is now permitted in exactly three roles — shell chrome,
state (correct/incorrect/selected/focus), and one accent rail. A section
is a heading plus space, never a bordered box wrapping more boxes.

- **Every screen rebuilt on that model.** The quiz question no longer
  sits in a card (the page *is* the card); topic cards are single tappable
  surfaces instead of outlined cards containing outlined chips, badges and
  a nested button; Profil's bordered panels are gone; results rows,
  review items and stat tiles are flat surfaces. Radius moved 3px → 10px
  so filled surfaces read as objects rather than outlined rectangles.
  A Playwright check now asserts *no bordered element sits inside another
  bordered element* on every screen, so this can't quietly regress.
- **First-run onboarding.** A first visit gets one focused welcome screen
  — what the app is, and one action — instead of a dismissible "still in
  development" banner sitting on top of every screen on every visit.
  Returning visitors go straight in.
- **Eğitim shows progress.** The chapter index marks what you've read,
  with a per-topic count and progress bar. Opening a chapter marks it
  read. Nothing is locked — this is visible progress, not gating (chapter
  locking remains a separate, deferred feature). Re-entering the tab now
  lands on the index rather than wherever you last stopped.
- **Leaving a test asks first.** Exiting mid-quiz silently discarded
  every answer; it now confirms and says what will be lost.
- **Results are readable.** The review defaults to *just the wrong
  answers* with a filter to see all, the score carries a one-line verdict
  telling you what to do next, and correct/incorrect items are marked by
  an edge rail rather than a full outline.
- **Smaller fixes.** The keyboard shortcuts (1–4, Enter) are now
  discoverable via an on-screen hint that hides itself on touch devices;
  Profil's empty state says something useful instead of showing three
  zeroes; one status line per topic card replaces up to three stacked
  badges.
- **The preview build is generated, not hand-maintained.**
  `scripts/build-artifact.js` produces the single-file shareable preview
  from the real `index.html`/`quiz.html`/`results.html`, `css/style.css`,
  `js/*.js` and `data/*.json`. It used to be a parallel copy in different
  class names that drifted from the app nearly every round. The site
  itself still has no build step — this only builds the preview.

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
