// The answer options for one question — the same control in a Test session
// and in an Eğitim check, because a learner should not have to relearn
// what an option looks like when they cross between the two.
//
// The whole row is the target, using the shared reading role. Once answered
// the rows stay focusable with aria-disabled rather than going `disabled`,
// which would drop them out of the tab order and out of the contrast
// requirements at exactly the moment the learner wants to read them.

import { el } from "./dom.js";
import { icon } from "./icons.js";
import { isCorrectAnswer } from "./quiz-engine.js";

let groupCount = 0;

/**
 * @param {{options: string[], correctAnswer: string}} question
 * @param {{selected?: string|null, answered?: boolean, onSelect?: (option: string) => void}} [state]
 * @returns {HTMLDivElement}
 */
export function renderOptions(question, { selected = null, answered = false, onSelect, labelledBy = "question-stem" } = {}) {
  // The reserved key/text/mark columns keep the answer stable at commit.
  const wrap = el("div", "options");
  const groupId = ++groupCount;

  // §8.7, WCAG 1.3.1: a question and its options are a group. Without
  // this a screen reader reads four unrelated buttons and never says
  // what is being asked.
  //
  // `group`, not `radiogroup`. These are buttons that commit an answer
  // and do not come back, so `role="radio"` children would promise an
  // undo the app does not have — that part of the old comment was
  // right. What it got wrong was the next step: a `radiogroup` whose
  // children stay plain buttons. ARIA requires a radiogroup to own
  // radios, and the accessibility tree was dumped in Chromium to see
  // what the violation actually bought:
  //
  //   radiogroup + button   → children role=button, no checked state
  //   group      + button   → children role=button, no checked state
  //   radiogroup + radio    → children role=radio,  checked=true/false
  //
  // The first two are the same tree, name included. The "1 of 4" the
  // old comment promised comes from the `radio` role, which this
  // pattern deliberately does not use, so it was never delivered.
  // `group` gives the whole benefit that was real — the grouping and
  // the name — and claims nothing that is not there.
  wrap.setAttribute("role", "group");
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
      if (chosen) {
        // A styling hook, never a request to move or shake the answer.
        button.classList.add("option--picked");
      }
      if (correct || chosen) {
        const mark = el("span", "option__mark");
        mark.dataset.answerState = correct ? "correct" : "incorrect";
        mark.appendChild(icon(correct ? "check" : "close", { size: 20 }));
        button.appendChild(mark);

        // Keep this outside the button: the answer's accessible name and
        // its English language remain untouched, while revisiting it also
        // announces the committed state in Turkish.
        const description = el("span", "visually-hidden answer-state",
          correct ? (chosen ? "Doğru cevap. Senin cevabın." : "Doğru cevap.")
            : "Senin cevabın. Yanlış.");
        description.id = `answer-state-${groupId}-${index}`;
        description.lang = "tr";
        button.setAttribute("aria-describedby", description.id);
        wrap.appendChild(description);
      }
      button.setAttribute("aria-disabled", "true");
    } else if (onSelect) {
      button.addEventListener("click", () => onSelect(option));
    }

    wrap.appendChild(button);
  });

  return wrap;
}
