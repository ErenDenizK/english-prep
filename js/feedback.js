// Shared "answer feedback" block — the verdict, the explanation, and the
// generalizable rule. Used after any answered question, whether in a full
// Test session (quiz.js) or an embedded Eğitim check card
// (education.js), so the two can never drift apart.

import { el } from "./dom.js";

/**
 * @param {{correctAnswer: string, explanation: string, tip?: string}} question
 * @param {boolean} correct
 * @param {{withTip?: boolean}} [options] - Eğitim checks omit the tip: the
 *   lesson has just spent several steps stating the rule.
 * @returns {HTMLDivElement}
 */
export function renderAnswerFeedback(question, correct, { withTip = true } = {}) {
  const feedback = el("div", `feedback ${correct ? "feedback--correct" : "feedback--incorrect"}`);
  // Without this the outcome is conveyed by colour alone, which says
  // nothing to a screen reader.
  feedback.setAttribute("role", "status");

  feedback.appendChild(
    el("strong", null, correct ? "Doğru!" : `Doğru değil — doğru cevap: "${question.correctAnswer}".`)
  );
  feedback.appendChild(el("p", "feedback__explanation", question.explanation));

  if (withTip && question.tip) {
    const tip = el("p", "feedback__tip");
    tip.appendChild(el("strong", null, "Kural: "));
    tip.appendChild(document.createTextNode(question.tip));
    feedback.appendChild(tip);
  }

  return feedback;
}
