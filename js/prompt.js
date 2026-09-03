// The question's own text — the passage with the blank, or the sentence to
// be restated — shared by the Test screen, an Eğitim check and the results
// review, for the same reason js/answers.js and js/feedback.js are shared:
// three copies of this drift, and the learner is the one who notices.
//
// A restatement carries an instruction and a cloze does not, and that is
// the whole difference. A gap in a passage explains itself; four complete
// sentences under one complete sentence do not, and a learner meeting the
// format for the first time in an exam-prep app should not have to infer
// the task from the shape of the options.

import { el, appendBlanked } from "./dom.js";
import { QUESTION_TYPE } from "./topics.js";

const INSTRUCTION = {
  [QUESTION_TYPE.RESTATEMENT]: "Aşağıdaki cümleye anlamca en yakın seçeneği bul.",
};

/**
 * @param {{type?: string, prompt: string}} question
 * @param {{lead?: boolean}} [options] - `lead` false gives the smaller
 *   type the results review uses, where the sentence is a reminder of a
 *   question already answered rather than the question itself.
 * @returns {DocumentFragment}
 */
export function renderPrompt(question, { lead = true } = {}) {
  const fragment = document.createDocumentFragment();

  const instruction = INSTRUCTION[question.type];
  if (instruction) {
    fragment.appendChild(el("p", "t-meta", instruction));
  }

  // appendBlanked is right for both: a restatement's sentence has no
  // "____" in it, so it comes through as plain text.
  const text = el("p", lead ? "t-lead t-en" : "t-body t-en");
  text.lang = "en";
  appendBlanked(text, question.prompt);
  fragment.appendChild(text);

  return fragment;
}
