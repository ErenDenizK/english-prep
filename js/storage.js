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
 * @returns {Record<string, {step: number, done: boolean}>} progress for
 *   every lesson the learner has opened
 */
export function getAllLessonProgress() {
  const stored = loadLessonProgress();
  const normalized = {};
  for (const [lessonId, entry] of Object.entries(stored)) {
    if (isPlainObject(entry)) {
      normalized[lessonId] = {
        step: Number.isInteger(entry.step) && entry.step >= 0 ? entry.step : 0,
        done: entry.done === true,
      };
    }
  }
  return normalized;
}

/**
 * @param {string} lessonId
 * @returns {{step: number, done: boolean} | null} null if never opened
 */
export function getLessonProgress(lessonId) {
  return getAllLessonProgress()[lessonId] ?? null;
}

/**
 * Records that the learner reached a step. Only ever moves forward, so
 * paging back through a lesson doesn't undo progress.
 * @param {string} lessonId
 * @param {number} stepIndex - 0-based
 */
export function recordLessonStep(lessonId, stepIndex) {
  const progress = getAllLessonProgress();
  const existing = progress[lessonId];
  if (existing && existing.step >= stepIndex) {
    return;
  }
  progress[lessonId] = { step: stepIndex, done: existing?.done === true };
  writeJson(LESSON_PROGRESS_KEY, progress);
}

/**
 * @param {string} lessonId
 * @param {number} lastStepIndex - the lesson's final step index
 */
export function markLessonDone(lessonId, lastStepIndex) {
  const progress = getAllLessonProgress();
  progress[lessonId] = {
    step: Math.max(progress[lessonId]?.step ?? 0, lastStepIndex),
    done: true,
  };
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
