// Shared "answer feedback" block builder -- a verdict, the explanation,
// and the generalizable tip. Used after any answered question, whether
// in a full Test session (quiz.js) or an embedded Eğitim check card
// (education.js), so the two never drift out of sync.

/**
 * @param {{correctAnswer: string, explanation: string, tip?: string}} question
 * @param {boolean} correct
 * @returns {HTMLDivElement}
 */
export function renderAnswerFeedback(question, correct) {
  const feedback = document.createElement("div");
  feedback.className = `feedback ${correct ? "feedback--correct" : "feedback--incorrect"}`;

  const heading = document.createElement("strong");
  heading.textContent = correct ? "Doğru!" : `Yanlış — doğru cevap: "${question.correctAnswer}".`;
  feedback.appendChild(heading);

  const explanation = document.createElement("p");
  explanation.className = "feedback__explanation";
  explanation.textContent = question.explanation;
  feedback.appendChild(explanation);

  if (question.tip) {
    const tip = document.createElement("p");
    tip.className = "feedback__tip";
    const tipLabel = document.createElement("strong");
    tipLabel.textContent = "Kural: ";
    tip.appendChild(tipLabel);
    tip.appendChild(document.createTextNode(question.tip));
    feedback.appendChild(tip);
  }

  return feedback;
}
