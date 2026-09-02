// Ephemeral, tab-scoped handoff between pages for the quiz currently in
// progress. Unlike storage.js (persistent history in localStorage), this
// data is only meant to survive the index -> quiz -> results navigation
// and is safe to lose when the tab closes.

const QUIZ_REQUEST_KEY = "englishPrep.quizRequest";
const QUIZ_RESULT_KEY = "englishPrep.quizResult";

/**
 * @param {{mode: "mixed"|"topic", topicIds: string[], count: number|"all"}} request
 */
export function setQuizRequest(request) {
  sessionStorage.setItem(QUIZ_REQUEST_KEY, JSON.stringify(request));
}

export function getQuizRequest() {
  const raw = sessionStorage.getItem(QUIZ_REQUEST_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * @param {object} result - the scored session plus mode/date metadata
 */
export function setQuizResult(result) {
  sessionStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(result));
}

export function getQuizResult() {
  const raw = sessionStorage.getItem(QUIZ_RESULT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearQuizState() {
  sessionStorage.removeItem(QUIZ_REQUEST_KEY);
  sessionStorage.removeItem(QUIZ_RESULT_KEY);
}
