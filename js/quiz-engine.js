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
 * Orders a pool by what the learner most needs to see, worst-known first:
 *
 *   1. questions never answered
 *   2. questions whose last answer was wrong
 *   3. everything else, least recently seen first
 *
 * This is the whole of the app's "adaptivity" and it is deliberately not
 * more than this. With a handful of questions per category, an estimator
 * fitted to six noisy observations is estimating noise; drawing the
 * unseen ones first is correct on day one with no data at all.
 *
 * It matters more than it looks. Without it a session is
 * `shuffle(pool).slice(0, n)`, so a learner meets the same items over and
 * over — and once that happens `correct` stops measuring whether they know
 * the grammar and starts measuring whether they remember the question.
 *
 * @param {Array<object>} questions
 * @param {Record<string, {seen: number, lastCorrect: boolean, last: number}>} [stats]
 *   keyed by question id; anything absent counts as never seen
 * @returns {Array<object>} a new array, best-first
 */
export function orderForPractice(questions, stats = {}) {
  const tierOf = (question) => {
    const entry = stats[question.id];
    if (!entry || !entry.seen) {
      return 0;
    }
    return entry.lastCorrect ? 2 : 1;
  };

  // Shuffle first so that items which tie — everything in tier 0, and
  // anything sharing a timestamp because it was answered in the same
  // session — come out in a different order each time.
  return shuffle(questions).sort((a, b) => {
    const tierDelta = tierOf(a) - tierOf(b);
    if (tierDelta !== 0) {
      return tierDelta;
    }
    // Within a tier, oldest first. Unseen questions have no timestamp and
    // keep the shuffled order they arrived in.
    return (stats[a.id]?.last ?? 0) - (stats[b.id]?.last ?? 0);
  });
}

/**
 * Picks `count` questions and shuffles each question's answer options so
 * the correct answer isn't always in the same position.
 *
 * Selection is principled and presentation is not: the questions are
 * *chosen* worst-known first, then shuffled again before being handed
 * over, so a session never feels like it is working down a list.
 *
 * @param {Array<object>} questions
 * @param {number|"all"} count
 * @param {Record<string, {seen: number, lastCorrect: boolean, last: number}>} [stats]
 * @returns {Array<object>}
 */
export function buildQuizSession(questions, count, stats = {}) {
  const ordered = orderForPractice(questions, stats);
  const size = count === "all" ? ordered.length : Math.min(count, ordered.length);
  return shuffle(ordered.slice(0, size)).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

function normalizeAnswer(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

/**
 * True only when an answer was actually given and it matches. A missing
 * answer (null/undefined) scores as wrong rather than throwing, so an
 * unanswered question can never take the whole results screen down.
 * @param {{correctAnswer: string}} question
 * @param {string|null|undefined} selectedOption
 */
export function isCorrectAnswer(question, selectedOption) {
  const selected = normalizeAnswer(selectedOption);
  return selected !== null && selected === normalizeAnswer(question.correctAnswer);
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
      type: question.type,
      category: question.category,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      tip: question.tip,
      // Carried so the results review can say what the chosen option
      // would have meant, not only that it was wrong. The learner met
      // that line once, during the test; the review is the pass where a
      // mistake is consolidated rather than merely met, and for the two
      // vocabulary topics it is the only thing that tells them what
      // *their* word meant — the explanation names the closest wrong
      // option, and in a vocabulary set every wrong option is a
      // different word.
      optionNotes: question.optionNotes ?? null,
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
