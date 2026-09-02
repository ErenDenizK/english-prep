// Pure functions for building a quiz session and scoring answers. No DOM
// or storage access here, so this stays easy to test in isolation.

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the input.
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Picks `count` random questions from the pool and shuffles each
 * question's answer options so the correct answer isn't always in the
 * same position.
 * @param {Array<object>} questions
 * @param {number|"all"} count
 * @returns {Array<object>}
 */
export function buildQuizSession(questions, count) {
  const pool = shuffle(questions);
  const size = count === "all" ? pool.length : Math.min(count, pool.length);
  return pool.slice(0, size).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase();
}

export function isCorrectAnswer(question, selectedOption) {
  return normalizeAnswer(selectedOption) === normalizeAnswer(question.correctAnswer);
}

function tallyBreakdown(breakdown, key, correct) {
  if (!breakdown[key]) {
    breakdown[key] = { correct: 0, total: 0 };
  }
  breakdown[key].total += 1;
  if (correct) {
    breakdown[key].correct += 1;
  }
}

/**
 * Scores a completed session against the answers the learner picked.
 * @param {Array<object>} session - questions as returned by buildQuizSession
 * @param {Array<string>} selectedAnswers - one selected option string per question, same order
 * @returns {{correctCount: number, totalCount: number, topicBreakdown: Record<string, {correct: number, total: number}>, categoryBreakdown: Record<string, {correct: number, total: number}>, questionResults: Array<object>}}
 */
export function scoreSession(session, selectedAnswers) {
  let correctCount = 0;
  const topicBreakdown = {};
  const categoryBreakdown = {};
  const questionResults = session.map((question, index) => {
    const selectedAnswer = selectedAnswers[index];
    const correct = isCorrectAnswer(question, selectedAnswer);
    if (correct) {
      correctCount += 1;
    }

    tallyBreakdown(topicBreakdown, question.topicId, correct);
    if (question.category) {
      tallyBreakdown(categoryBreakdown, question.category, correct);
    }

    return {
      id: question.id,
      topicId: question.topicId,
      category: question.category,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      tip: question.tip,
      selectedAnswer,
      correct,
    };
  });

  return {
    correctCount,
    totalCount: session.length,
    topicBreakdown,
    categoryBreakdown,
    questionResults,
  };
}
