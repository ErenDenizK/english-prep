// Persists quiz attempt history in localStorage so results survive across
// visits on the same device/browser, plus a small local profile (optional
// display name, and a silent "seen content" record used only to power
// "new questions added" badges). No login, no server — everything here
// lives entirely in this browser.

const HISTORY_KEY = "englishPrep.history";
const SEEN_VERSIONS_KEY = "englishPrep.seenVersions";
const PROFILE_NAME_KEY = "englishPrep.profileName";
const DEV_NOTE_DISMISSED_KEY = "englishPrep.devNoteDismissed";
const MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.attempts) ? parsed : { attempts: [] };
  } catch {
    return { attempts: [] };
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage may be unavailable (e.g. private browsing quota). Practicing
    // without a saved history is an acceptable degradation.
  }
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
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}

function loadSeenVersions() {
  try {
    const raw = localStorage.getItem(SEEN_VERSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
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
  try {
    localStorage.setItem(SEEN_VERSIONS_KEY, JSON.stringify(seen));
  } catch {
    // Storage may be unavailable; the badge just won't clear this visit.
  }
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
  try {
    if (name) {
      localStorage.setItem(PROFILE_NAME_KEY, name);
    } else {
      localStorage.removeItem(PROFILE_NAME_KEY);
    }
  } catch {
    // Storage may be unavailable; the name just won't persist this visit.
  }
}

/**
 * @returns {boolean} whether the learner has dismissed the "still in
 * development" note. Separate from history/profile-name so resetting
 * history doesn't bring the note back.
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
    // Storage may be unavailable; the note will just show again next visit.
  }
}
