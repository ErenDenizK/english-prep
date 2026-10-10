import test from 'node:test';
import assert from 'node:assert/strict';

const entries = new Map();
globalThis.localStorage = {
  getItem: (key) => entries.get(key) ?? null,
  setItem: (key, value) => entries.set(key, String(value)),
  removeItem: (key) => entries.delete(key),
};
const storage = await import('../js/storage.js');
const at = (day, hour = 12) => new Date(2026, 9, day, hour).toISOString();
const answer = (id, correct, answeredAt) => ({ id, topicId: 'tenses', category: 'A vs B', correct, ...(answeredAt === undefined ? {} : { answeredAt }) });
function attempt(id, date, questions, mode = 'mixed') {
  return { id, date, mode, questions,
    topicBreakdown: { tenses: { correct: questions.filter(q => q.correct).length, total: questions.length } },
    categoryBreakdown: {} };
}
test.beforeEach(() => entries.clear());

test('a resumed session counts each answer on its own local calendar day', () => {
  storage.recordAttempt(attempt('spanning', at(1), [
    answer('q1', true, at(2)), answer('q2', false, at(3)), answer('q3', true, at(3, 13)),
  ]));
  assert.equal(storage.getTodayCount(Date.parse(at(1))), 0, 'starting a session is not an answer');
  assert.equal(storage.getTodayCount(Date.parse(at(2))), 1);
  assert.equal(storage.getTodayCount(Date.parse(at(3))), 2);
  assert.deepEqual(storage.getStreak(Date.parse(at(3, 15))), { days: 2, activeToday: true });
  assert.equal(storage.getLastActivity(), Date.parse(at(3, 13)));
});

test('item recency follows the actual answer even when its session started earlier', () => {
  storage.recordAttempt(attempt('resumed', at(1), [answer('same', true, at(3))]));
  storage.recordAttempt(attempt('intervening', at(2), [answer('same', false, at(2))]));
  const item = storage.getItemStats().same;
  assert.equal(item.seen, 2);
  assert.equal(item.wrong, 1);
  assert.equal(item.lastCorrect, true);
  assert.equal(item.last, Date.parse(at(3)));
  assert.equal(storage.getMistakeBook()[0].correctDays, 1, 'the later answer starts recovery');
});

test('mistake-book graduation uses separate answer days rather than test start dates', () => {
  storage.recordAttempt(attempt('wrong', at(1), [answer('same', false, at(1))]));
  storage.recordAttempt(attempt('late-a', at(1, 13), [answer('same', true, at(2))]));
  storage.recordAttempt(attempt('late-b', at(1, 14), [answer('same', true, at(3))]));
  assert.deepEqual(storage.getMistakeBook(), []);
});

test('recent accuracy windows include an older session resumed most recently', () => {
  storage.recordAttempt(attempt('resumed', at(1), Array.from({length: 40}, (_, i) => answer(`right-${i}`, true, at(3))), 'mistakes'));
  storage.recordAttempt(attempt('intervening', at(2), Array.from({length: 40}, (_, i) => answer(`wrong-${i}`, false, at(2)))));
  assert.deepEqual(storage.getTopicAccuracy('tenses'), { correct: 40, answered: 40, accuracy: 1 });
  const overall = storage.getOverallStats();
  assert.equal(overall.accuracy, 1);
  assert.equal(overall.accuracyWindow, 40);
  assert.equal(overall.accuracyFromBook, 40);
  assert.equal(overall.totalQuestions, 80);
  assert.deepEqual(storage.getHistory().map(entry => entry.id), ['resumed', 'intervening'], 'readers do not reorder persisted history');
});

test('legacy and malformed answer times fall back to the original attempt date', () => {
  storage.recordAttempt(attempt('legacy', at(2), [answer('legacy', false), answer('bad-time', true, 'not-a-date')]));
  assert.equal(storage.getTodayCount(Date.parse(at(2))), 2);
  assert.equal(storage.getItemStats()['bad-time'].last, Date.parse(at(2)));
  assert.equal(storage.getLastActivity(), Date.parse(at(2)));
  assert.deepEqual(storage.getStreak(Date.parse(at(2))), {days: 1, activeToday: true});
});

test('valid answer time remains usable when the attempt date is absent or malformed', () => {
  storage.recordAttempt(attempt('recovered', 'invalid', [answer('good', true, at(3)), answer('unknown', false, 'invalid')]));
  assert.equal(storage.getTodayCount(Date.parse(at(3))), 1);
  assert.equal(storage.getLastActivity(), Date.parse(at(3)));
  assert.deepEqual(storage.getStreak(Date.parse(at(3))), {days: 1, activeToday: true});
});
