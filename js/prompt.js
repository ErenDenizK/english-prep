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
export function renderPrompt(question, { lead = true, idSuffix = null } = {}) {
  const fragment = document.createDocumentFragment();

  const instruction = INSTRUCTION[question.type];
  if (instruction) {
    fragment.appendChild(el("p", "t-meta", instruction));
  }

  // appendBlanked is right for both: a restatement's sentence has no
  // "____" in it, so it comes through as plain text.
  const text = el("p", lead ? "t-lead t-en" : "t-body t-en");
  text.lang = "en";
  // Named so the option group can point at it (§8.7, 1.3.1): a screen
  // reader then announces what is being asked before "1 of 4", instead
  // of four unrelated buttons. One id per screen is enough because one
  // question is on screen at a time — the reader's `check` blocks are
  // the exception and pass `idSuffix`.
  text.id = idSuffix ? `question-stem-${idSuffix}` : "question-stem";
  appendBlanked(text, question.prompt);
  fragment.appendChild(text);

  return fragment;
}
