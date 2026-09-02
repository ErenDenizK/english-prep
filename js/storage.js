// Persists quiz attempt history in localStorage so results survive across
// visits on the same device/browser. Shaped so a future profile layer can
// wrap this under `profiles.<id>.history` without changing this API.
//
// Also holds a silent, nameless "seen content" record — no login, no
// visible profile screen — used only to power "new questions added"
// badges: a topic whose manifest `contentVersion` is higher than what's
// recorded here has content the learner hasn't seen yet.

const HISTORY_KEY = "englishPrep.history";
const SEEN_VERSIONS_KEY = "englishPrep.seenVersions";
const MIN_ATTEMPTS_FOR_WEAK_TOPIC = 3;

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
 * @param {{date: string, mode: "mixed"|"topic", topicBreakdown: Record<string, {correct: number, total: number}>, questions: Array<{id: string, topicId: string, correct: boolean}>}} attempt
 */
export function recordAttempt(attempt) {
  const history = loadHistory();
  history.attempts.push(attempt);
  saveHistory(history);
}

export function getHistory() {
  return loadHistory().attempts;
}

/**
 * Aggregates correct/total counts per topic across all recorded attempts.
 * @returns {Record<string, {correct: number, total: number}>}
 */
export function getTopicTotals() {
  const totals = {};
  for (const attempt of getHistory()) {
    for (const [topicId, stats] of Object.entries(attempt.topicBreakdown)) {
      if (!totals[topicId]) {
        totals[topicId] = { correct: 0, total: 0 };
      }
      totals[topicId].correct += stats.correct;
      totals[topicId].total += stats.total;
    }
  }
  return totals;
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

/**
 * Returns the topics the learner is weakest in, based on cumulative
 * accuracy across all attempts. Topics with too little data are excluded
 * so a single unlucky question doesn't label a topic "weak".
 * @param {number} limit
 * @returns {Array<{topicId: string, correct: number, total: number, accuracy: number}>}
 */
export function getWeakTopics(limit = 3) {
  const totals = getTopicTotals();
  return Object.entries(totals)
    .map(([topicId, stats]) => ({ topicId, ...stats, accuracy: stats.correct / stats.total }))
    .filter((entry) => entry.total >= MIN_ATTEMPTS_FOR_WEAK_TOPIC && entry.accuracy < 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
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
