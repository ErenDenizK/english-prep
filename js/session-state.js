// Tab-scoped requests/results and a resumable quiz snapshot. Stored questions
// are only identities and presentation order: scoring always uses the current
// question bank, never a correct answer supplied by browser storage.

import { isCorrectAnswer, scoreSession } from "./quiz-engine.js";

const QUIZ_REQUEST_KEY = "englishPrep.quizRequest";
const QUIZ_RESULT_KEY = "englishPrep.quizResult";
const ACTIVE_QUIZ_KEY = "englishPrep.activeQuiz";
const MODES = new Set(["mixed", "topic", "category", "mistakes"]);
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value) => typeof value === "string" && value.length > 0;
const safeKey = (value) => text(value) && !["__proto__", "constructor", "prototype"].includes(value);
const strings = (values) => Array.isArray(values) && values.length > 0 && values.every(text)
  && new Set(values).size === values.length;
const date = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));

function read(key, validate) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    return validate(value) ? value : null;
  } catch {
    return null;
  }
}

function write(key, value, validate) {
  if (!validate(value)) return false;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function remove(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function validRequest(request) {
  return object(request) && MODES.has(request.mode) && strings(request.topicIds)
    && (request.count === "all" || (Number.isInteger(request.count) && request.count > 0))
    && (request.category === undefined || text(request.category))
    && (request.mode !== "category" || text(request.category))
    && (request.ids === undefined || strings(request.ids))
    && (request.mode !== "mistakes" || strings(request.ids));
}

function requestKey(request) {
  return JSON.stringify([request.mode, [...request.topicIds].sort(), request.count,
    request.category ?? null, request.ids ? [...request.ids].sort() : null]);
}

function contentKey(question) {
  return JSON.stringify([question.topicId, question.type ?? "cloze", question.category ?? null,
    question.prompt, question.options, question.correctAnswer, question.explanation,
    question.tip ?? null, question.optionNotes ?? null]);
}

function validSnapshot(snapshot) {
  if (!object(snapshot) || snapshot.version !== 1 || !text(snapshot.attemptId)
    || !date(snapshot.date) || !validRequest(snapshot.request)
    || !Array.isArray(snapshot.order) || snapshot.order.length === 0
    || !snapshot.order.every((entry) => object(entry) && text(entry.id)
      && strings(entry.options) && text(entry.content))
    || new Set(snapshot.order.map((entry) => entry.id)).size !== snapshot.order.length
    || !Number.isInteger(snapshot.currentIndex) || snapshot.currentIndex < 0
    || snapshot.currentIndex >= snapshot.order.length
    || typeof snapshot.optionsHidden !== "boolean"
    || !Array.isArray(snapshot.selectedAnswers)
    || snapshot.selectedAnswers.length !== snapshot.order.length) return false;
  // Existing snapshots predate per-answer timing. Their missing timestamps
  // stay unknown; reading one must not move yesterday's answers into today.
  if (snapshot.answeredAt !== undefined && (!Array.isArray(snapshot.answeredAt)
    || snapshot.answeredAt.length !== snapshot.order.length
    || !snapshot.answeredAt.every((at, index) => at === null
      || (snapshot.selectedAnswers[index] !== null && date(at))))) return false;

  return snapshot.selectedAnswers.every((answer, index) => {
    if (index < snapshot.currentIndex) return snapshot.order[index].options.includes(answer);
    if (index > snapshot.currentIndex) return answer === null;
    return answer === null || (!snapshot.optionsHidden && snapshot.order[index].options.includes(answer));
  });
}

function validResult(result) {
  if (!object(result) || !MODES.has(result.mode) || !date(result.date)
    || (result.recorded !== undefined && typeof result.recorded !== "boolean")
    || (result.partial !== undefined && typeof result.partial !== "boolean")
    || !Array.isArray(result.questionResults) || result.questionResults.length === 0
    || !result.questionResults.every((question) => object(question) && text(question.id)
      && safeKey(question.topicId) && text(question.prompt) && text(question.correctAnswer)
      && (question.category === undefined || question.category === null || safeKey(question.category))
      && typeof question.explanation === "string"
      && (question.answeredAt === undefined || date(question.answeredAt))
      && (question.selectedAnswer === null || typeof question.selectedAnswer === "string")
      && question.correct === isCorrectAnswer(question, question.selectedAnswer))) return false;
  if (new Set(result.questionResults.map((question) => question.id)).size !== result.questionResults.length) return false;
  const scored = scoreSession(result.questionResults, result.questionResults.map((q) => q.selectedAnswer));
  const equalBreakdown = (given, expected) => object(given)
    && Object.keys(given).length === Object.keys(expected).length
    && Object.entries(expected).every(([key, value]) => object(given[key])
      && given[key].correct === value.correct && given[key].total === value.total);
  return result.correctCount === scored.correctCount && result.totalCount === scored.totalCount
    && equalBreakdown(result.topicBreakdown, scored.topicBreakdown)
    && (result.categoryBreakdown === undefined || equalBreakdown(result.categoryBreakdown, scored.categoryBreakdown));
}

export const setQuizRequest = (request) => write(QUIZ_REQUEST_KEY, request, validRequest);
export const getQuizRequest = () => read(QUIZ_REQUEST_KEY, validRequest);
export const setQuizResult = (result) => write(QUIZ_RESULT_KEY, result, validResult);
export const getQuizResult = () => read(QUIZ_RESULT_KEY, validResult);
export const clearQuizResult = () => remove(QUIZ_RESULT_KEY);
export const setActiveQuiz = (snapshot) => write(ACTIVE_QUIZ_KEY, snapshot, validSnapshot);
export const getActiveQuiz = () => read(ACTIVE_QUIZ_KEY, validSnapshot);
export const clearActiveQuiz = () => remove(ACTIVE_QUIZ_KEY);

export function createAttemptId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `quiz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/** Capture presentation order against the unshuffled, trusted bank. */
export function createQuizSnapshot({ attemptId, date: startedAt, request, session,
  selectedAnswers, answeredAt, currentIndex, optionsHidden }, bank) {
  const byId = new Map(bank.map((question) => [question.id, question]));
  return {
    version: 1, attemptId, date: startedAt, request,
    order: session.map((question) => ({ id: question.id, options: [...question.options],
      content: contentKey(byId.get(question.id)) })),
    selectedAnswers: [...selectedAnswers], currentIndex, optionsHidden,
    answeredAt: answeredAt ? [...answeredAt] : selectedAnswers.map(() => null),
  };
}

/** Reject stale/altered content, foreign requests and impossible answer paths. */
export function restoreQuizSession(snapshot, bank, request) {
  if (!validSnapshot(snapshot) || !validRequest(request)
    || requestKey(snapshot.request) !== requestKey(request)) return null;
  const expectedCount = request.count === "all" ? bank.length : Math.min(request.count, bank.length);
  if (snapshot.order.length !== expectedCount) return null;
  const byId = new Map(bank.map((question) => [question.id, question]));
  const session = [];
  for (const saved of snapshot.order) {
    const question = byId.get(saved.id);
    if (!question || saved.content !== contentKey(question)
      || saved.options.length !== question.options.length
      || !saved.options.every((option) => question.options.includes(option))) return null;
    session.push({ ...question, options: [...saved.options] });
  }
  return { ...snapshot, session, selectedAnswers: [...snapshot.selectedAnswers],
    answeredAt: snapshot.answeredAt ? [...snapshot.answeredAt] : snapshot.selectedAnswers.map(() => null) };
}
