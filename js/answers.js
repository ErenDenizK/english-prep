// The answer options for one question — the same control in a Test session
// and in an Eğitim check, because a learner should not have to relearn
// what an option looks like when they cross between the two.
//
// The whole row is the target, at reading size, in the serif: options are
// English, and English is the serif everywhere in this app. Once answered
// the rows stay focusable with aria-disabled rather than going `disabled`,
// which would drop them out of the tab order and out of the contrast
// requirements at exactly the moment the learner wants to read them.

import { el } from "./dom.js";
import { icon } from "./icons.js";
import { isCorrectAnswer } from "./quiz-engine.js";

/**
 * @param {{options: string[], correctAnswer: string}} question
 * @param {{selected?: string|null, answered?: boolean, onSelect?: (option: string) => void}} [state]
 * @returns {HTMLDivElement}
 */
export function renderOptions(question, { selected = null, answered = false, onSelect, labelledBy = "question-stem" } = {}) {
  // Full bleed: on a phone the viewport is already the frame, and an
  // option that runs to the gutter is a bigger target for free.
  const wrap = el("div", "bleed");

  // §8.7, WCAG 1.3.1: a question and its options are a group. Without
  // this a screen reader reads four unrelated buttons and never says
  // what is being asked or how many there are; with it, "Present Simple
  // vs Present Continuous, 1 of 4". `radiogroup` rather than `radio`
  // children, because these are buttons that commit an answer and do not
  // come back — arrow keys moving a selection would promise an undo the
  // app does not have.
  wrap.setAttribute("role", "radiogroup");
  wrap.setAttribute("aria-labelledby", labelledBy);

  question.options.forEach((option, index) => {
    const button = el("button", "option");
    button.type = "button";
    button.dataset.option = option;

    // The number is the keyboard shortcut, so it is shown rather than
    // being a hidden affordance only a mouse user could guess at.
    button.appendChild(el("span", "option__key t-num", String(index + 1)));

    const text = el("span", "option__text", option);
    text.lang = "en";
    button.appendChild(text);

    if (answered) {
      const correct = isCorrectAnswer(question, option);
      const chosen = option === selected;
      if (correct) {
        button.classList.add("option--ok");
      } else if (chosen) {
        button.classList.add("option--no");
      }
      if (correct || chosen) {
        const mark = el("span", "option__mark");
        mark.appendChild(icon(correct ? "check" : "close", { size: 20 }));
        button.appendChild(mark);
      }
      button.setAttribute("aria-disabled", "true");
    } else if (onSelect) {
      button.addEventListener("click", () => onSelect(option));
    }

    wrap.appendChild(button);
  });

  return wrap;
}
