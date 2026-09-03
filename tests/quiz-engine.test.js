// Unit tests for the pure quiz logic. These matter more than they look:
// scoring is the one place where a silent bug would quietly teach a
// learner the wrong thing.

import test from "node:test";
import assert from "node:assert/strict";
import { shuffle, buildQuizSession, isCorrectAnswer, scoreSession } from "../js/quiz-engine.js";

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
