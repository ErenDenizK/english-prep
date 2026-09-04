// The one answer-feedback block, shared by a full Test session (quiz.js)
// and an embedded Eğitim check (education.js), so the two can never drift.
//
// The verdict travels on four redundant channels — a glyph, a word, a
// background tint, and the correct answer spelled out — because colour
// alone says nothing in greyscale, in sunlight, in forced-colors mode, or
// to the roughly 8% of men with a colour-vision deficiency. That is WCAG
// 1.4.1, and it is also just how a verdict should read.
//
// The block itself is not a live region. There is one persistent region in
// the shell (see js/shell.js) and the caller announces through it: a
// region built together with its text is frequently missed, and focus must
// never move into feedback — it would pull the learner away from the
// button they are already reaching for.

import { el, appendInline } from "./dom.js";
import { icon } from "./icons.js";
import { buildReport, sendReport, REPORT_RESULT } from "./report.js";
import { announce } from "./shell.js";

/**
 * @param {{id: string, category: string, paragraph: string, correctAnswer: string, explanation: string, tip?: string, optionNotes?: Record<string, string>|null}} question
 * @param {boolean} correct
 * @param {{withTip?: boolean, selected?: string|null}} [options] - Eğitim
 *   checks omit the tip: the lesson has just spent several blocks stating
 *   the rule. `selected` picks the option note and travels into the
 *   problem report.
 * @returns {HTMLDivElement}
 */
export function renderAnswerFeedback(question, correct, { withTip = true, selected = null } = {}) {
  const block = el("div", `feedback bleed ${correct ? "feedback--ok" : "feedback--no"}`);

  const verdict = el("p", "feedback__verdict");
  verdict.appendChild(icon(correct ? "check" : "close", { size: 20 }));
  if (correct) {
    verdict.appendChild(document.createTextNode("Doğru"));
  } else {
    verdict.appendChild(document.createTextNode("Doğru cevap: "));
    const answer = el("span", "t-en", question.correctAnswer);
    answer.lang = "en";
    verdict.appendChild(answer);
  }
  block.appendChild(verdict);

  const explanation = el("p", "feedback__body");
  appendInline(explanation, question.explanation);
  block.appendChild(explanation);

  // The note for the option the learner actually chose, when there is one.
  //
  // Only that one. For a grammar item the explanation names the closest
  // wrong option and the other two usually fail for the same reason; for
  // a vocabulary set every wrong option is a different word, and the
  // learner who chose it needs to be told what IT means — not what the
  // other two mean. Showing all three would treble a block that sits in
  // a fixed-height shell and would say nothing at all to the learner who
  // was right.
  const note = !correct && selected ? question.optionNotes?.[selected] : null;
  if (note) {
    const line = el("p", "feedback__body");
    const word = el("strong", "t-en", selected);
    word.lang = "en";
    line.appendChild(word);
    line.appendChild(document.createTextNode(": "));
    appendInline(line, note);
    block.appendChild(line);
  }

  if (withTip && question.tip) {
    const tip = el("p", "feedback__body");
    tip.appendChild(el("strong", null, "Kural: "));
    appendInline(tip, question.tip);
    block.appendChild(tip);
  }

  block.appendChild(renderReportButton(question, selected));

  return block;
}

/**
 * "Bu soruda bir sorun var".
 *
 * Quiet on purpose, and last: it must be findable by the learner who has
 * just decided a question is wrong, and invisible to everyone else. A
 * prominent one would invite a shrug rather than a report, and this is
 * the channel that has to stay believable.
 *
 * The button is never removed and never changes height — it turns into
 * its own confirmation. Replacing it with a line of text would reflow the
 * block under a thumb that is already moving.
 *
 * And it is never `disabled`, for the same reason an answered option
 * isn't: disabling the control that currently has focus drops the
 * keyboard user at the top of the document, having just told them
 * nothing. `aria-disabled` with a guard keeps it focusable and readable,
 * and the outcome goes through the shell's one live region, because a
 * label that changes under a screen reader's cursor is a label nobody
 * hears change.
 */
function renderReportButton(question, selected) {
  const button = el("button", "btn btn--quiet feedback__report", "Bu soruda bir sorun var");
  button.type = "button";
  button.addEventListener("click", async () => {
    if (button.getAttribute("aria-disabled") === "true") {
      return;
    }
    button.setAttribute("aria-disabled", "true");
    const outcome = await sendReport(buildReport(question, selected));
    const message = outcome === "failed" ? REPORT_RESULT.failed + question.id : REPORT_RESULT[outcome];
    button.textContent = message;
    announce(message);
  });
  return button;
}

/**
 * The same verdict as spoken text, for the shell's live region. Returns
 * `announce`-shaped parts so the English answer keeps its `lang`.
 *
 * It says what the block says, including the chosen option's note: a
 * screen-reader user who is told less than the screen shows has been
 * given a different app.
 * @param {{correctAnswer: string, explanation: string, optionNotes?: Record<string, string>|null}} question
 * @param {boolean} correct
 * @param {string|null} [selected]
 * @returns {Array<string|{en: string}>}
 */
export function answerAnnouncement(question, correct, selected = null) {
  if (correct) {
    return ["Doğru. ", question.explanation];
  }
  const parts = ["Yanlış. Doğru cevap: ", { en: question.correctAnswer }, ". ", question.explanation];
  const note = selected ? question.optionNotes?.[selected] : null;
  if (note) {
    parts.push(" ", { en: selected }, ": ", note);
  }
  return parts;
}
