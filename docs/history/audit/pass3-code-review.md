# Pass 3 — independent code review

Reviewed against `f607d0e`, 2026-10-03. Scope: resumable tests and stable history IDs, backup merging/restoration, the listbox popup, theme initialization, and service-worker changes. This pass reads the implementation and adds narrowly targeted reproductions; it does not repeat the broad suites run by the implementation and QA agents.

**Resolution:** both P2 findings below are corrected and verified. The implementation owner reports **100/100** targeted unit tests and **10/10** resume browser regressions passing; the three quota/midnight cases also passed again after the final visible save-warning change. An independent Chromium probe repeated one-shot failure, persistent failure followed by recovery, and next-day answering: each passed. The findings retain their original reproduction details below so the reason for each correction remains reviewable.

## Corrected P2 — Results retry loses the stable attempt identity

**Location:** `js/results.js`, the `if (!result.recorded)` fallback in `init()`; `js/quiz.js`, `finishQuiz()`.

The quiz now records its attempt before handing off to results. If that write fails, it deliberately sends `recorded: false` so results can retry. The inherited results writer does not forward `result.id` or `result.partial`, and sets `result.recorded = true` without checking whether `recordAttempt()` succeeded.

This is a data-integrity regression in the new resumable path. A partial attempt already saved on refresh has a stable ID. If the final write fails once, the results fallback appends a second ID-less record instead of updating that attempt. If writes keep failing, the fallback reports the result as recorded and suppresses a later retry.

**Chromium reproduction:** start a five-question test, answer one question, reload, then inject a one-shot `QuotaExceededError` for the next `englishPrep.history` write and press **Bitir**. Before finishing, history contains one stable-ID record with one answer. After opening results, it contains two records with the same date and answer: the original stable-ID partial and an ID-less copy. The test/answer counts are inflated.

**Required correction:** pass the ID and partial flag through the results fallback. Only set the session result's recorded flag after a successful history write. Keep the retry path available when storage remains unavailable; legacy results without an ID must still work.

**Correction and verification:** the results fallback now forwards stable identity, partial state, and answer timestamps, and sets `recorded` only when the history write succeeds. A failed save leaves the retry available and displays a save warning. Both dedicated browser cases pass: `test_results_retries_a_one_time_history_write_failure_with_same_id` and `test_results_keeps_failed_handoff_pending_until_storage_recovers`. The independent probe also confirms one history record with the original ID after both recovery paths, `recorded: false` while blocked, and `recorded: true` after recovery.

## Corrected P2 — Resumed answers inherit the launch day

**Location:** `js/quiz.js`, `state.date` and `recordProgress()`; `js/storage.js`, date-based activity/item statistics.

`state.date` is now the quiz's original launch timestamp, preserved through reloads and upserts. Every answered question is consequently attributed to that timestamp. A test opened yesterday and answered today contributes zero to today's count and leaves `activeToday` false. Interleaved tests can also make latest-answer correctness and mistake-book chronology incorrect, since those functions use the attempt timestamp for every answer.

**Chromium reproduction:** install the browser clock one day earlier, launch a test without answering, advance the clock to today, answer one question and press **Bitir**. The captured result has one answer, but `getTodayCount()` returns **0**, `getStreak().activeToday` is **false**, and `getLastActivity()` returns yesterday's launch timestamp. This is a normal suspended-tab/resume case, not malformed data.

**Smallest correction that preserves the meaning of the data:** add an optional per-answer `answeredAt` timestamp. Carry it through the active snapshot, result handoff, history, and backup; use the attempt date as the fallback for older records. Do not simply move `attempt.date` to the resume/finish time, because that would move yesterday's already-saved answers into today.

The shared timestamp resolver should be used by `getTodayCount`, `getStreak`, `getLastActivity`, `getItemStats`, and `getMistakeBook`. The existing recent-accuracy windows operate on whole attempts, so retain that contract but order attempts by their most recent answer timestamp. Upserting an earlier array slot otherwise leaves newly answered material behind tests completed in the meantime. Stable IDs remain the merge identity, and the original launch date can remain intact for compatibility.

**Correction and verification:** optional per-answer `answeredAt` values now pass through the producer, snapshot, results, history, and backup paths. Statistics use answer time with the original attempt date as a legacy fallback; recent accuracy retains whole-attempt windows ordered by latest answer time. Unit coverage includes interleaved attempts, legacy records, and backup preservation. The browser regression `test_resume_across_local_midnight_preserves_each_answer_day` verifies separate daily counts and streak behavior across Istanbul midnight. The independent probe additionally confirms that a test launched yesterday and answered today retains its launch date while returning today's count **1**, `activeToday: true`, and today's latest-activity timestamp.

## Focused regression commands

```sh
node --test tests/quiz-resume.test.js tests/answer-times.test.js tests/backup.test.js tests/storage.test.js
python3 tests/quiz_resume_browser.py --base-url http://127.0.0.1:8001
```

Reported results: **100 unit tests passed; 10 browser tests passed**. After the final save-warning change, the owner reran the three named browser regressions above: **3/3 passed**. The independent failure-injection and date-change probe also passed all three scenarios. These focused checks supplement the application's full validation recorded in `docs/VALIDATION.md`.

## Reviewed without an additional concrete regression

- Active snapshots restore question and option order against the current trusted bank. Changed/removed content and impossible answer paths are rejected; malformed session JSON returns a safe empty state.
- Normal partial/finished upserts preserve a longer matching prefix, while conflicting answers do not overwrite that prefix. Stable IDs distinguish attempts made in the same millisecond. Legacy ID-less records retain their older behavior.
- Backup import stages values before writing, checks for changed storage, rolls back completed writes on failure, and distinguishes an incomplete rollback. The restore dialog keeps the pending backup available for retry. Async file reads have a generation guard so older reads cannot overwrite a newer paste or selection. These paths also have dedicated tests from their owner.
- The popup remains a combobox with focus on its trigger. Native popover escapes clipping; the fallback mounts under the body. Position calculations constrain the menu to the visual viewport and shell bars; scrolling the menu does not scroll the application. Close handlers remove temporary position listeners.
- Dark-first bootstrap and live initialization agree on all entry pages. Explicit light/dark choices remain authoritative; explicit System tracks OS changes and browser chrome. Storage errors retain a temporary choice during the current document. This is covered by ten targeted theme tests.
- The shell cache is now version 0.66; installation requests bypass the browser HTTP cache. Cache namespaces remain specific to each service-worker scope. No new cross-copy cache-deletion path was found. The preserved original's code and raw archive remain separate from the new runtime.

This section records review coverage, not a claim that arbitrary corrupted input or every concurrent browser interaction has been exhaustively tested.

## Component catalogue verification

The catalogue at `docs/components.html` now loads the actual editorial stylesheet and self-hosted Inter/Source Serif assets. Its descriptions reflect opaque surfaces, neutral controls, restrained transitions, and the current type roles. Existing module-built examples and IDs remain; study introduction, corpus facts, article contrast, and optional pretest examples were added.

Focused Chromium checks at **320, 390, and 1440px** confirm no page errors, no horizontal shell overflow, dark-first behavior on a light-configured device, explicit light switching, and live System-to-dark chrome updates. The page uses the production theme module instead of changing only the root attribute.
