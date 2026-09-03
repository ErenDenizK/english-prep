// Persists everything the app remembers about a learner in localStorage,
// so it survives across visits on the same device/browser:
//
//   - quiz attempt history (scores, per-topic and per-category breakdowns)
//   - Eğitim lesson progress (furthest step reached, and completion)
//   - a small local profile (optional display name)
//   - a silent "seen content" record, used only to power the
//     "new questions added" badge
//
// No login, no server — everything here lives entirely in this browser.

const HISTORY_KEY = "englishPrep.history";
const SEEN_VERSIONS_KEY = "englishPrep.seenVersions";
const PROFILE_NAME_KEY = "englishPrep.profileName";
const LESSON_PROGRESS_KEY = "englishPrep.lessonProgress";
const DEV_NOTE_DISMISSED_KEY = "englishPrep.devNoteDismissed";
const MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3;

/**
 * Reads and JSON-parses a key, falling back to `fallback` for anything
 * that isn't usable: storage unavailable (private browsing), absent key,
 * corrupt JSON, or a value of the wrong shape. Practising without saved
 * progress is an acceptable degradation; crashing is not.
 */
function readJson(key, fallback, isValid) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable or over quota. The app keeps working;
    // this session's progress just isn't remembered.
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function loadHistory() {
  return readJson(HISTORY_KEY, { attempts: [] }, (value) => isPlainObject(value) && Array.isArray(value.attempts));
}

function saveHistory(history) {
  writeJson(HISTORY_KEY, history);
}

/**
 * Appends a completed attempt to local history.
 * @param {{date: string, mode: "mixed"|"topic", topicBreakdown: Record<string, {correct: number, total: number}>, categoryBreakdown: Record<string, {correct: number, total: number}>, questions: Array<{id: string, topicId: string, correct: boolean}>}} attempt
 */
export function recordAttempt(attempt) {
  const history = loadHistory();
  history.attempts.push(attempt);
  saveHistory(history);
}

export function getHistory() {
  return loadHistory().attempts;
}

function sumBreakdowns(attempts, breakdownKey) {
  const totals = {};
  for (const attempt of attempts) {
    for (const [key, stats] of Object.entries(attempt[breakdownKey] ?? {})) {
      if (!totals[key]) {
        totals[key] = { correct: 0, total: 0 };
      }
      totals[key].correct += stats.correct;
      totals[key].total += stats.total;
    }
  }
  return totals;
}

/**
 * Aggregates correct/total counts per topic across all recorded attempts.
 * @returns {Record<string, {correct: number, total: number}>}
 */
/**
 * Per-question history, derived rather than stored: every attempt already
 * carries its own `date` and the ids it covered, so "when did this learner
 * last see this question" needs no new field and no migration.
 *
 * `lastCorrect` is the outcome of the most recent answer, not a running
 * average — what the session builder needs to know is whether the learner
 * got it wrong *last time*, which is a different question from whether
 * they usually do.
 *
 * @returns {Record<string, {seen: number, wrong: number, lastCorrect: boolean, last: number}>}
 */
export function getItemStats() {
  const stats = {};
  for (const attempt of getHistory()) {
    const at = Date.parse(attempt?.date ?? "");
    const when = Number.isNaN(at) ? 0 : at;
    for (const question of attempt?.questions ?? []) {
      if (typeof question?.id !== "string") {
        continue;
      }
      const entry = (stats[question.id] ??= { seen: 0, wrong: 0, lastCorrect: false, last: 0 });
      entry.seen += 1;
      if (!question.correct) {
        entry.wrong += 1;
      }
      // History is appended in order, but a restored backup could arrive
      // out of order, so the newest answer wins on timestamp rather than
      // on position.
      if (when >= entry.last) {
        entry.last = when;
        entry.lastCorrect = question.correct === true;
      }
    }
  }
  return stats;
}

export function getTopicTotals() {
  return sumBreakdowns(getHistory(), "topicBreakdown");
}

/**
 * Aggregates correct/total counts per grammar category across all
 * recorded attempts. Attempts recorded before category history existed
 * simply have no `categoryBreakdown` and are skipped for this one.
 * @returns {Record<string, {correct: number, total: number}>}
 */
export function getCategoryTotals() {
  return sumBreakdowns(getHistory(), "categoryBreakdown");
}

/**
 * Returns the most recent attempt's score for a single topic, if any.
 * @param {string} topicId
 * @returns {{correct: number, total: number} | null}
 */
export function getLastTopicScore(topicId) {
  const attempts = getHistory();
  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    const breakdown = attempts[i].topicBreakdown[topicId];
    if (breakdown) {
      return breakdown;
    }
  }
  return null;
}

function weakestEntries(totals, limit) {
  return Object.entries(totals)
    .map(([key, stats]) => ({ key, ...stats, accuracy: stats.correct / stats.total }))
    .filter((entry) => entry.total >= MIN_ATTEMPTS_FOR_WEAK_ENTRY && entry.accuracy < 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

/**
 * Returns the topics the learner is weakest in, based on cumulative
 * accuracy across all attempts. Topics with too little data are excluded
 * so a single unlucky question doesn't label a topic "weak".
 * @param {number} limit
 * @returns {Array<{topicId: string, correct: number, total: number, accuracy: number}>}
 */
export function getWeakTopics(limit = 3) {
  return weakestEntries(getTopicTotals(), limit).map(({ key, ...rest }) => ({ topicId: key, ...rest }));
}

/**
 * Same idea as getWeakTopics, but at the finer grammar-category level
 * (e.g. "Present Perfect vs Past Simple") rather than whole-topic level.
 * @param {number} limit
 * @returns {Array<{category: string, correct: number, total: number, accuracy: number}>}
 */
export function getWeakCategories(limit = 5) {
  return weakestEntries(getCategoryTotals(), limit).map(({ key, ...rest }) => ({ category: key, ...rest }));
}

/**
 * @returns {{testsCompleted: number, totalQuestions: number, totalCorrect: number, accuracy: number|null}}
 */
export function getOverallStats() {
  const attempts = getHistory();
  let totalQuestions = 0;
  let totalCorrect = 0;
  for (const attempt of attempts) {
    totalQuestions += attempt.questions.length;
    totalCorrect += attempt.questions.filter((q) => q.correct).length;
  }
  return {
    testsCompleted: attempts.length,
    totalQuestions,
    totalCorrect,
    accuracy: totalQuestions === 0 ? null : totalCorrect / totalQuestions,
  };
}

export function clearHistory() {
  removeKey(HISTORY_KEY);
}

function loadSeenVersions() {
  return readJson(SEEN_VERSIONS_KEY, {}, isPlainObject);
}

/**
 * @param {string} topicId
 * @returns {number} the content version the learner last saw (0 if never)
 */
export function getSeenVersion(topicId) {
  return loadSeenVersions()[topicId] ?? 0;
}

/**
 * Records that the learner has now seen a topic's current content
 * version, clearing its "new questions added" badge.
 * @param {string} topicId
 * @param {number} version
 */
export function markTopicSeen(topicId, version) {
  const seen = loadSeenVersions();
  seen[topicId] = version;
  writeJson(SEEN_VERSIONS_KEY, seen);
}

/**
 * @returns {string} the learner's chosen display name, or "" if unset
 */
export function getProfileName() {
  try {
    return localStorage.getItem(PROFILE_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * @param {string} name
 */
export function setProfileName(name) {
  if (!name) {
    removeKey(PROFILE_NAME_KEY);
    return;
  }
  try {
    localStorage.setItem(PROFILE_NAME_KEY, name);
  } catch {
    // Storage may be unavailable; the name just won't persist this visit.
  }
}

/* ---- Eğitim lesson progress ----
   One record per lesson: how far into it the learner got, and whether
   they finished it. `step` is the furthest step *reached*, which is what
   makes "resume where you left off" possible without replaying a whole
   lesson. Keyed by lesson id, so reordering or renaming lessons never
   silently reassigns someone's progress to the wrong lesson. */

function loadLessonProgress() {
  return readJson(LESSON_PROGRESS_KEY, {}, isPlainObject);
}

/**
 * Lesson progress is a *read fraction*, not a step index: a lesson is one
 * scrolling page now, so how far through it you are is a position on that
 * page. Kept as a number 0…1 so it survives the lesson getting longer or
 * shorter when its content is edited — a stored step index would silently
 * point somewhere else after an author adds a block.
 *
 * @returns {Record<string, {read: number, done: boolean}>} progress for
 *   every lesson the learner has opened
 */
export function getAllLessonProgress() {
  const stored = loadLessonProgress();
  const normalized = {};
  for (const [lessonId, entry] of Object.entries(stored)) {
    if (isPlainObject(entry)) {
      normalized[lessonId] = {
        read: clampRead(entry.read),
        done: entry.done === true,
      };
    }
  }
  return normalized;
}

/** Anything unparseable, out of range or absent reads as "not started". */
function clampRead(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return value >= 1 ? 1 : value;
}

/**
 * @param {string} lessonId
 * @returns {{read: number, done: boolean} | null} null if never opened
 */
export function getLessonProgress(lessonId) {
  return getAllLessonProgress()[lessonId] ?? null;
}

/**
 * Records how far down the lesson the learner has been. Only ever moves
 * forward, so scrolling back up does not undo progress.
 * @param {string} lessonId
 * @param {number} read - 0…1
 */
export function recordLessonRead(lessonId, read) {
  const value = clampRead(read);
  const progress = getAllLessonProgress();
  const existing = progress[lessonId];
  if (existing && existing.read >= value) {
    return;
  }
  progress[lessonId] = { read: value, done: existing?.done === true };
  writeJson(LESSON_PROGRESS_KEY, progress);
}

/**
 * @param {string} lessonId
 */
export function markLessonDone(lessonId) {
  const progress = getAllLessonProgress();
  progress[lessonId] = { read: 1, done: true };
  writeJson(LESSON_PROGRESS_KEY, progress);
}

/**
 * @param {string[]} lessonIds - the lessons that currently exist
 * @returns {number} how many of them the learner has completed
 */
export function countCompletedLessons(lessonIds) {
  const progress = getAllLessonProgress();
  return lessonIds.filter((lessonId) => progress[lessonId]?.done).length;
}

export function clearLessonProgress() {
  removeKey(LESSON_PROGRESS_KEY);
}

/* ---- "Still in development" note ----
   Kept out of both the history and the profile: dismissing a one-off
   notice is not progress, so resetting history must not bring it back. */

/**
 * @returns {boolean} whether the learner has dismissed the note
 */
export function isDevNoteDismissed() {
  try {
    return localStorage.getItem(DEV_NOTE_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissDevNote() {
  try {
    localStorage.setItem(DEV_NOTE_DISMISSED_KEY, "1");
  } catch {
    // Storage may be unavailable; the note just shows again next visit.
  }
}
