// Unit tests for the pure quiz logic. These matter more than they look:
// scoring is the one place where a silent bug would quietly teach a
// learner the wrong thing.

import test from "node:test";
import assert from "node:assert/strict";
import {
  shuffle,
  orderForPractice,
  buildQuizSession,
  isCorrectAnswer,
  scoreSession,
} from "../js/quiz-engine.js";

const sortedCopy = (items) => [...items].sort();

function makeQuestion(overrides = {}) {
  return {
    id: "q1",
    topicId: "tenses",
    category: "Present Perfect vs Past Simple",
    prompt: "She ____ here since 2019.",
    options: ["has worked", "worked", "works", "is working"],
    correctAnswer: "has worked",
    explanation: "Açıklama.",
    tip: "Kural.",
    ...overrides,
  };
}

test("shuffle preserves the multiset without mutating the input", () => {
  const input = [1, 2, 3, 4, 5];
  const snapshot = [...input];
  const result = shuffle(input);

  assert.notEqual(result, input, "returns a new array");
  assert.deepEqual(input, snapshot, "leaves the input untouched");
  assert.deepEqual(sortedCopy(result), sortedCopy(snapshot));
});

test("shuffle handles empty and single-element arrays", () => {
  assert.deepEqual(shuffle([]), []);
  assert.deepEqual(shuffle(["only"]), ["only"]);
});

test("buildQuizSession clamps the count to the pool size", () => {
  const pool = [makeQuestion({ id: "a" }), makeQuestion({ id: "b" })];

  assert.equal(buildQuizSession(pool, 10).length, 2);
  assert.equal(buildQuizSession(pool, 1).length, 1);
  assert.equal(buildQuizSession(pool, 0).length, 0);
  assert.equal(buildQuizSession(pool, "all").length, 2);
});

test("buildQuizSession shuffles options without losing any or mutating the source", () => {
  const source = makeQuestion();
  const originalOptions = [...source.options];

  const [session] = buildQuizSession([source], 1);

  assert.deepEqual(sortedCopy(session.options), sortedCopy(originalOptions));
  assert.deepEqual(source.options, originalOptions, "source question is not mutated");
  assert.equal(session.correctAnswer, "has worked", "correctAnswer survives the shuffle");
  assert.ok(session.options.includes(session.correctAnswer));
});

test("buildQuizSession never returns the same question twice", () => {
  const pool = Array.from({ length: 12 }, (_, i) => makeQuestion({ id: `q${i}` }));
  const ids = buildQuizSession(pool, 12).map((question) => question.id);
  assert.equal(new Set(ids).size, 12);
});

test("isCorrectAnswer ignores case and surrounding whitespace", () => {
  const question = makeQuestion();

  assert.equal(isCorrectAnswer(question, "has worked"), true);
  assert.equal(isCorrectAnswer(question, "  HAS Worked  "), true);
  assert.equal(isCorrectAnswer(question, "worked"), false);
});

test("isCorrectAnswer treats a missing answer as wrong instead of throwing", () => {
  const question = makeQuestion();

  assert.equal(isCorrectAnswer(question, null), false);
  assert.equal(isCorrectAnswer(question, undefined), false);
});

test("scoreSession counts, groups by topic and category, and echoes teaching fields", () => {
  const session = [
    makeQuestion({ id: "a", topicId: "tenses", category: "Future Forms", correctAnswer: "will go" }),
    makeQuestion({ id: "b", topicId: "tenses", category: "Future Forms", correctAnswer: "will go" }),
    makeQuestion({ id: "c", topicId: "modals", category: "Obligation", correctAnswer: "must" }),
  ];
  const answers = ["will go", "goes", "must"];

  const result = scoreSession(session, answers);

  assert.equal(result.correctCount, 2);
  assert.equal(result.totalCount, 3);
  assert.deepEqual(result.topicBreakdown, {
    tenses: { correct: 1, total: 2 },
    modals: { correct: 1, total: 1 },
  });
  assert.deepEqual(result.categoryBreakdown, {
    "Future Forms": { correct: 1, total: 2 },
    Obligation: { correct: 1, total: 1 },
  });

  const [first] = result.questionResults;
  assert.equal(first.id, "a");
  assert.equal(first.correct, true);
  assert.equal(first.selectedAnswer, "will go");
  assert.equal(first.explanation, "Açıklama.");
  assert.equal(first.tip, "Kural.");
});

test("scoreSession skips the category breakdown for questions without a category", () => {
  const session = [makeQuestion({ category: undefined })];

  const result = scoreSession(session, ["has worked"]);

  assert.deepEqual(result.categoryBreakdown, {});
  assert.deepEqual(result.topicBreakdown, { tenses: { correct: 1, total: 1 } });
});

test("scoreSession scores an unanswered question as wrong", () => {
  const session = [makeQuestion({ id: "a" }), makeQuestion({ id: "b" })];

  const result = scoreSession(session, ["has worked", null]);

  assert.equal(result.correctCount, 1);
  assert.equal(result.questionResults[1].correct, false);
  assert.equal(result.questionResults[1].selectedAnswer, null);
});

test("scoreSession on an empty session produces an empty, non-crashing result", () => {
  const result = scoreSession([], []);

  assert.equal(result.correctCount, 0);
  assert.equal(result.totalCount, 0);
  assert.deepEqual(result.topicBreakdown, {});
  assert.deepEqual(result.questionResults, []);
});

/* ---- Ordering practice by what the learner needs ---- */

const practicePool = [
  { id: "a", options: ["1", "2"], correctAnswer: "1" },
  { id: "b", options: ["1", "2"], correctAnswer: "1" },
  { id: "c", options: ["1", "2"], correctAnswer: "1" },
  { id: "d", options: ["1", "2"], correctAnswer: "1" },
];

test("unseen questions come before seen ones", () => {
  const stats = {
    a: { seen: 3, wrong: 0, lastCorrect: true, last: 100 },
    b: { seen: 1, wrong: 1, lastCorrect: false, last: 200 },
  };
  const order = orderForPractice(practicePool, stats).map((q) => q.id);

  // c and d have never been answered, so they lead in some order.
  assert.deepEqual(order.slice(0, 2).sort(), ["c", "d"]);
  // Then the one answered wrong last time, then the one answered right.
  assert.deepEqual(order.slice(2), ["b", "a"]);
});

test("among questions answered correctly, the oldest comes first", () => {
  const stats = {
    a: { seen: 1, wrong: 0, lastCorrect: true, last: 300 },
    b: { seen: 1, wrong: 0, lastCorrect: true, last: 100 },
    c: { seen: 1, wrong: 0, lastCorrect: true, last: 200 },
    d: { seen: 1, wrong: 0, lastCorrect: true, last: 400 },
  };
  assert.deepEqual(
    orderForPractice(practicePool, stats).map((q) => q.id),
    ["b", "c", "a", "d"]
  );
});

test("with no history at all, every question is a candidate", () => {
  assert.deepEqual(orderForPractice(practicePool).map((q) => q.id).sort(), ["a", "b", "c", "d"]);
  assert.equal(orderForPractice(practicePool, {}).length, 4);
});

test("a short session draws the questions that are needed, not random ones", () => {
  const stats = {
    a: { seen: 2, wrong: 0, lastCorrect: true, last: 100 },
    b: { seen: 2, wrong: 0, lastCorrect: true, last: 200 },
    c: { seen: 2, wrong: 0, lastCorrect: true, last: 300 },
    d: { seen: 1, wrong: 1, lastCorrect: false, last: 400 },
  };
  // Run it repeatedly: the selection must be stable even though the
  // presentation order inside the session is shuffled.
  for (let run = 0; run < 20; run += 1) {
    const ids = buildQuizSession(practicePool, 2, stats).map((q) => q.id).sort();
    assert.deepEqual(ids, ["a", "d"], "the wrong one and the oldest one");
  }
});

test("selection is principled but presentation is not", () => {
  const stats = {};
  const orders = new Set();
  for (let run = 0; run < 40; run += 1) {
    orders.add(buildQuizSession(practicePool, 4, stats).map((q) => q.id).join(""));
  }
  assert.ok(orders.size > 1, "a session should not always arrive in the same order");
});

test("buildQuizSession still works when no stats are passed", () => {
  const session = buildQuizSession(practicePool, 2);
  assert.equal(session.length, 2);
  assert.equal(buildQuizSession(practicePool, "all").length, 4);
});
