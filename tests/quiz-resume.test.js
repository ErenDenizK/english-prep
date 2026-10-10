import test from "node:test";
import assert from "node:assert/strict";
import {
  getQuizRequest, setQuizRequest, getQuizResult, setQuizResult,
  getActiveQuiz, setActiveQuiz, clearActiveQuiz, createQuizSnapshot,
  restoreQuizSession,
} from "../js/session-state.js";
import { scoreSession } from "../js/quiz-engine.js";
import { recordAttempt, getHistory } from "../js/storage.js";
import { mergeHistory, buildBackup, parseBackup } from "../js/backup.js";

const request = { mode: "mixed", topicIds: ["grammar"], count: 2 };
const bank = [
  { id: "q1", topicId: "grammar", category: "Tenses", type: "cloze", prompt: "She ____ every day.",
    options: ["walks", "walked", "walking", "walk"], correctAnswer: "walks", explanation: "A regular habit." },
  { id: "q2", topicId: "grammar", category: "Tenses", type: "cloze", prompt: "They ____ yesterday.",
    options: ["walks", "walked", "walking", "walk"], correctAnswer: "walked", explanation: "A finished past action." },
];
let sessionEntries;
let localEntries;
function storage(entries) {
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, String(value)),
    removeItem: (key) => entries.delete(key),
  };
}
function snapshot(overrides = {}) {
  return createQuizSnapshot({
    attemptId: "attempt-1", date: "2026-10-03T10:00:00.000Z", request,
    session: [{ ...bank[1], options: [...bank[1].options].reverse() }, bank[0]],
    selectedAnswers: ["walking", null], currentIndex: 0, optionsHidden: false,
    ...overrides,
  }, bank);
}
function attempt(count, extra = {}) {
  return {
    id: "attempt-1", date: "2026-10-03T10:00:00.000Z", mode: "mixed",
    questions: bank.slice(0, count).map((q) => ({ id: q.id, topicId: q.topicId, correct: false })),
    ...extra,
  };
}

test.beforeEach(() => {
  sessionEntries = new Map();
  localEntries = new Map();
  globalThis.sessionStorage = storage(sessionEntries);
  globalThis.localStorage = storage(localEntries);
});

test("refresh restores exact order, wrong answer, current position and revealed choices", () => {
  const saved = snapshot();
  assert.equal(setActiveQuiz(saved), true);
  const restored = restoreQuizSession(getActiveQuiz(), bank, request);
  assert.deepEqual(restored.session.map((q) => q.id), ["q2", "q1"]);
  assert.deepEqual(restored.session[0].options, [...bank[1].options].reverse());
  assert.deepEqual(restored.selectedAnswers, ["walking", null]);
  assert.equal(restored.currentIndex, 0);
  assert.equal(restored.optionsHidden, false);
  assert.equal(restored.session[0].correctAnswer, "walked");
});

test("an advanced unanswered question and think-first visibility survive refresh", () => {
  const restored = restoreQuizSession(snapshot({ currentIndex: 1, optionsHidden: true }), bank, request);
  assert.equal(restored.currentIndex, 1);
  assert.equal(restored.optionsHidden, true);
  assert.deepEqual(restored.selectedAnswers, ["walking", null]);
});

test("answer commit times survive resume without inventing times for older snapshots", () => {
  const first = "2026-10-02T20:59:00.000Z";
  const second = "2026-10-02T21:01:00.000Z";
  const saved = snapshot({ answeredAt: [first, null] });
  assert.equal(setActiveQuiz(saved), true);
  assert.deepEqual(restoreQuizSession(getActiveQuiz(), bank, request).answeredAt, [first, null]);
  const completed = snapshot({ currentIndex: 1, selectedAnswers: ["walking", "walks"], answeredAt: [first, second] });
  assert.deepEqual(restoreQuizSession(completed, bank, request).answeredAt, [first, second]);
  delete saved.answeredAt;
  assert.deepEqual(restoreQuizSession(saved, bank, request).answeredAt, [null, null]);
  assert.equal(setActiveQuiz(snapshot({ answeredAt: ["not-a-date", null] })), false);
  assert.equal(setActiveQuiz(snapshot({ answeredAt: [first, second] })), false, "an unanswered question has no commit time");
});

test("each launch mode remains valid and distinct", () => {
  const requests = [request,
    { mode: "topic", topicIds: ["grammar"], count: 2 },
    { mode: "category", topicIds: ["grammar"], category: "Tenses", count: "all" },
    { mode: "mistakes", topicIds: ["grammar"], ids: ["q1", "q2"], count: "all" },
  ];
  for (const value of requests) {
    assert.equal(setQuizRequest(value), true);
    assert.deepEqual(getQuizRequest(), value);
    assert.ok(restoreQuizSession(snapshot({ request: value }), bank, value));
  }
  assert.equal(restoreQuizSession(snapshot(), bank, requests[1]), null);
  assert.equal(restoreQuizSession(snapshot(), bank, { ...request, count: 1 }), null);
});

test("reject changed content, removed IDs and altered option order payloads", () => {
  assert.equal(restoreQuizSession(snapshot(), bank.slice(0, 1), request), null);
  assert.equal(restoreQuizSession(snapshot(), [{ ...bank[0], correctAnswer: "walk" }, bank[1]], request), null);
  assert.equal(restoreQuizSession(snapshot(), [{ ...bank[0], prompt: "A revised prompt" }, bank[1]], request), null);
  const forged = snapshot();
  forged.order[0].options[0] = "A forged choice";
  assert.equal(restoreQuizSession(forged, bank, request), null);
});

test("reject impossible selection paths and malformed storage without throwing", () => {
  for (const overrides of [
    { currentIndex: 2 }, { currentIndex: -1 },
    { selectedAnswers: [null, "walks"] },
    { currentIndex: 1, selectedAnswers: [null, null] },
    { selectedAnswers: ["not an option", null] },
    { optionsHidden: true },
  ]) assert.equal(setActiveQuiz(snapshot(overrides)), false);
  for (const key of ["englishPrep.quizRequest", "englishPrep.activeQuiz", "englishPrep.quizResult"]) {
    sessionEntries.set(key, "{broken");
  }
  assert.equal(getQuizRequest(), null);
  assert.equal(getActiveQuiz(), null);
  assert.equal(getQuizResult(), null);
  sessionEntries.set("englishPrep.activeQuiz", JSON.stringify({ version: 1 }));
  assert.equal(getActiveQuiz(), null);
});

test("result handoff validates score and question shape while accepting legacy result format", () => {
  const result = { date: "2026-10-03T10:00:00.000Z", mode: "mixed", ...scoreSession(bank, ["walks", "walking"]) };
  assert.equal(setQuizResult(result), true);
  assert.deepEqual(getQuizResult(), JSON.parse(JSON.stringify(result)));
  assert.equal(setQuizResult({ ...result, correctCount: 2 }), false);
  const forged = structuredClone(result);
  forged.questionResults[1].correct = true;
  sessionEntries.set("englishPrep.quizResult", JSON.stringify(forged));
  assert.equal(getQuizResult(), null);
  forged.questionResults[0].topicId = "__proto__";
  assert.equal(setQuizResult(forged), false);
  assert.equal(Object.prototype.total, undefined);
  const timed = structuredClone(result);
  timed.questionResults[0].answeredAt = "2026-10-03T11:00:00.000Z";
  assert.equal(setQuizResult(timed), true);
  assert.equal(getQuizResult().questionResults[0].answeredAt, timed.questionResults[0].answeredAt);
  timed.questionResults[0].answeredAt = "not-a-date";
  assert.equal(setQuizResult(timed), false);
});

test("blocked storage fails safely rather than navigating with an absent handoff", () => {
  globalThis.sessionStorage = {
    getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };
  assert.equal(getQuizRequest(), null);
  assert.equal(getQuizResult(), null);
  assert.equal(getActiveQuiz(), null);
  assert.equal(setQuizRequest(request), false);
  assert.equal(setActiveQuiz(snapshot()), false);
  assert.equal(clearActiveQuiz(), false);
});

test("refresh/pagehide partials and final completion share one history record", () => {
  recordAttempt(attempt(1));
  recordAttempt(attempt(1));
  recordAttempt(attempt(2, { partial: false }));
  recordAttempt(attempt(1)); // stale pagehide after returning from BFCache
  assert.equal(getHistory().length, 1);
  assert.equal(getHistory()[0].questions.length, 2);
  assert.equal(getHistory()[0].partial, false);
});

test("new attempts and old records without IDs continue appending", () => {
  recordAttempt(attempt(1));
  recordAttempt(attempt(1, { id: "attempt-2" }));
  const legacy = attempt(1);
  delete legacy.id;
  recordAttempt(legacy);
  recordAttempt(legacy);
  assert.equal(getHistory().length, 4);
});

test("backup round trip preserves identities and deduplicates the fixed attempt date", () => {
  recordAttempt(attempt(1));
  recordAttempt(attempt(2));
  const source = { attempts: getHistory() };
  const parsed = parseBackup(JSON.stringify(buildBackup({ history: source })));
  assert.equal(parsed.ok, true);
  const imported = mergeHistory(source, parsed.backup.data.history);
  assert.equal(imported.attempts.length, 1);
  assert.equal(imported.attempts[0].id, "attempt-1");
});

test("backup advances the same partial attempt without merging conflicting answers", () => {
  const shorter = attempt(1);
  const longer = attempt(2);
  assert.deepEqual(mergeHistory({ attempts: [shorter] }, { attempts: [longer] }).attempts, [longer]);
  assert.deepEqual(mergeHistory({ attempts: [longer] }, { attempts: [shorter] }).attempts, [longer]);
  const conflict = structuredClone(longer);
  conflict.questions[0].correct = true;
  assert.deepEqual(mergeHistory({ attempts: [shorter] }, { attempts: [conflict] }).attempts, [shorter]);
  recordAttempt(shorter);
  recordAttempt(conflict);
  assert.equal(getHistory()[0].questions.length, 1);
});

test("distinct stable IDs stay distinct even when created in the same millisecond", () => {
  const merged = mergeHistory({ attempts: [attempt(1)] }, { attempts: [attempt(1, { id: "another" })] });
  assert.equal(merged.attempts.length, 2);
});

test("older backup prefixes cannot erase known answer times or change their calendar day", () => {
  const previous = attempt(1);
  previous.questions[0].answeredAt = "2026-10-03T10:00:00.000Z";
  const next = attempt(2);
  next.questions[1].answeredAt = "2026-10-04T10:00:00.000Z";
  recordAttempt(previous);
  recordAttempt(next);
  assert.equal(getHistory()[0].questions[0].answeredAt, previous.questions[0].answeredAt);
  const merged = mergeHistory({ attempts: [previous] }, { attempts: [next] });
  assert.equal(merged.attempts[0].questions[0].answeredAt, previous.questions[0].answeredAt);
  assert.equal(merged.attempts[0].questions[1].answeredAt, next.questions[1].answeredAt);
  const conflicting = structuredClone(next);
  conflicting.questions[0].answeredAt = "2026-10-05T10:00:00.000Z";
  assert.deepEqual(mergeHistory({ attempts: [previous] }, { attempts: [conflicting] }).attempts, [previous]);
});
