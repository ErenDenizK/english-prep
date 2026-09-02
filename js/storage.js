// Persists quiz attempt history in localStorage so results survive across
// visits on the same device/browser. Shaped so a future profile layer can
// wrap this under `profiles.<id>.history` without changing this API.

const HISTORY_KEY = "englishPrep.history";
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
