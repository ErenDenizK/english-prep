# Changelog

Versioning: `x.y`, `x` fixed at `0` while the app is in development — see
the README's **Versioning** section for the exact rule (only the project
owner bumps `x`; everything below is a `0.y` development build, not a
release).

## v0.6 — 2026-09-03

Eğitim becomes a real teaching mode, and content authoring gets a safety
net so it can be handed to someone other than whoever wrote the app.

- **Eğitim rewritten as a staged, interactive lesson experience.** The
  flat carousel across every topic's lessons is gone. In its place: a
  lesson index in syllabus order, each row showing its own progress, with
  an overall progress bar and a "pick up where you left off" card; and a
  focused reader (header and tab bar step aside, same as the quiz screen)
  that pages through one lesson a step at a time. Finishing a lesson
  offers the next one or a test on the same topic.
- **New lesson schema.** A lesson was a rule plus two example sentences —
  a shape that can only ever render as a slideshow. It is now
  `{ id, order, category, title, summary, steps[] }` with three step
  types: `read` (Turkish prose with `**bold**` and optional English
  examples), `table` (side-by-side signal-word comparisons), and `check`
  (an inline question that must be answered before continuing). The
  validator requires at least one `check` per lesson, so "interactive" is
  enforced rather than hoped for.
- **The six Tenses lessons rewritten against it**: 36 steps and 12 inline
  checks, each lesson ending with a concrete "Sınavda ne yaparsın"
  procedure rather than a restatement of the rule.
- **Lesson progress persists** (`localStorage`, per lesson id), resumes
  where you left off, and now feeds a "Tamamlanan ders" tile in Profil.
  "Geçmişi Sıfırla" clears it alongside test history; the confirmation
  copy now says so.
- **Weak categories became actionable.** On the results screen and in
  Profil, a category you're struggling with links straight to the lesson
  that teaches it — the payoff for lessons and questions sharing one
  category taxonomy.
- **Hash routing** (`#egitim`, `#test`, `#profil`, `#egitim/<lessonId>`).
  The device back button now steps back through the app instead of
  leaving it, a lesson can be linked to, and a reload keeps your place.

### Quality infrastructure

- **`tools/validate-content.mjs`** (`npm run validate`) validates the
  manifest, every topic file against the documented schema, and the
  agreement between them — the drift that silently breaks topic cards and
  the "new questions added" badge. It also catches content bugs no reader
  would spot, such as duplicate answer options, which the
  case-insensitive scorer would mark correct twice.
- **Unit tests** (`npm test`, `node:test`): 28 covering the scoring
  engine and the storage layer, including corrupt-store and
  unavailable-`localStorage` degradation.
- **CI** runs both on every push and PR to `main` and `test`.
- **`docs/CONTENT_GUIDE.md`** is now the authoritative schema (moved out
  of the README), and **`docs/agents/`** holds paste-ready briefs for the
  separate Claude sessions that author lessons and questions, plus the
  handoff loop — including why the category taxonomy is fixed before
  either agent starts.
- **`CLAUDE.md`** carries project context forward to future sessions.

### Fixes

- A failed content load left the Eğitim tab permanently stuck on its
  error message: the "already loaded" flag was set before the fetch, so
  leaving and returning never retried.
- Topic files were fetched and parsed twice (once for questions, once for
  lessons). They're cached now, and a failed fetch is evicted so a retry
  actually retries.
- `viewport-fit=cover` was declared but no safe-area insets were applied,
  so the bottom action bar sat under the home indicator on notched
  phones.
- The fixed shell used `height: 100%`, which jumps as mobile browser
  toolbars slide in and out; it now tracks `100dvh` where supported.
- Going back from the results screen re-entered `quiz.html` and silently
  rolled a brand new test. Results now `replace()` the quiz in history.
- Fraunces 400 was used by the question prompt and the lesson example
  sentences but never requested — the two most prominent pieces of
  teaching text rendered in a weight that wasn't loaded. The font request
  now asks for exactly the two weights the stylesheet uses (down from
  nine), which is also smaller.
- Anchors styled as buttons ("Ana Sayfa") carried the browser's underline.
- `isCorrectAnswer` threw on an unanswered question instead of scoring it
  wrong.
- Pressing Enter on a focused advance button could fire twice — once
  natively, once through the keyboard shortcut — and skip a question.

### Accessibility and mobile

- The custom dropdown now implements the full WAI-ARIA listbox contract
  it took over from `<select>`: arrow keys, Home/End, Enter/Escape,
  `aria-activedescendant`, and an accessible name that includes the
  current value (it previously announced only "Soru sayısı", never what
  it was set to).
- The confirm modal traps focus while open and returns it to whatever
  opened it, and opens on Cancel rather than the destructive action.
- Tabs follow the ARIA tabs pattern (roving tabindex, arrow-key
  navigation).
- Answer feedback is announced (`role="status"`) — previously the result
  was conveyed by colour alone — and a wrong answer in a lesson check now
  says so in words.
- Touch targets are at least 44px throughout; comparison tables stack
  into labelled blocks below 380px and stay side by side above it;
  `prefers-reduced-motion` is honoured.
- Verified with Playwright across 320/390/768/1280: no horizontal
  overflow, no undersized targets, no console errors on any screen.

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
