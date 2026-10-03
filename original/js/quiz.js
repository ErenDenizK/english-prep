// The Test screen — one question at a time, answered and explained before
// the next appears.
//
// It runs in the shell's focused mode: no header, no nav, and the forward
// action lives in the shell's own bar rather than in the scrolling content.
// That is the whole reason the bar exists. Answering reveals a block of
// feedback above it, and if the button moved with that content it would
// slide out from under a thumb that is already on its way down.

import { loadManifest, loadQuestionsForTopics } from "./topics.js";
import { buildQuizSession, isCorrectAnswer, scoreSession } from "./quiz-engine.js";
import { getQuizRequest, setQuizResult } from "./session-state.js";
import { getItemStats, getSetting, recordAttempt } from "./storage.js";
import { SETTINGS } from "./config.js";
import { renderAnswerFeedback, answerAnnouncement } from "./feedback.js";
import { renderPrompt } from "./prompt.js";
import { renderOptions } from "./answers.js";
import { el, clear, failureCard } from "./dom.js";
import { icon } from "./icons.js";
import { haptic } from "./widgets.js";
import { announce, scrollToTop, createActionBar, createBar } from "./shell.js";

const container = document.getElementById("quiz-container");
const actionBar = createActionBar("quiz-bar");
const bar = createBar("shell-header");

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
  /** What kind of test this is, in words — see `modeLabel`. */
  modeLabel: "",
  /**
   * "Önce kendin düşün": with the options hidden, answering is retrieval
   * rather than recognition — the learner has to produce the form before
   * they can see whether it is on the list. It is a setting rather than
   * the default because it makes every question slower, and someone
   * revising the night before is entitled to choose speed.
   */
  optionsHidden: false,
  /**
   * Whether this session's answers have already been written down, so a
   * `pagehide` on the way to the results screen cannot record the same
   * attempt a second time.
   */
  recorded: false,
};

function showMessage(text, { withHomeLink = true } = {}) {
  bar.set({ title: "Test", lead: null, trail: null });
  clear(container);
  container.appendChild(el("p", "t-body", text));
  if (withHomeLink) {
    actionBar.set([{ label: "Ana sayfa", level: "primary", href: "index.html" }]);
  } else {
    actionBar.hide();
  }
}

/**
 * How many questions have actually been answered. The quiz is strictly
 * sequential — there is no skip — so the answers are a prefix, and the
 * count is where that prefix ends.
 */
function answeredCount() {
  let last = -1;
  state.selectedAnswers.forEach((answer, index) => {
    if (answer !== null && answer !== undefined) {
      last = index;
    }
  });
  return last + 1;
}

/**
 * Record what has been answered, without navigating anywhere.
 *
 * `exitQuiz` handles the learner choosing to leave. This handles the
 * learner leaving without choosing: the iOS edge-swipe, the Android back
 * button, closing the tab, the browser being killed in the background.
 * On a phone that swipe IS the navigation gesture, so it is not an edge
 * case — it is how a test most often ends when something interrupts it.
 *
 * v0.19 made the in-app exit stop destroying answers and left this open,
 * which meant the fix covered the one way out that was already safe.
 *
 * `pagehide` rather than `beforeunload`: Safari has never fired
 * `beforeunload` reliably on mobile, and `pagehide` is the event the
 * back/forward cache uses. It has to be synchronous — nothing async
 * survives here — so it writes the attempt straight to storage rather
 * than going through the results screen.
 */
function recordPartialOnLeave() {
  const count = answeredCount();
  if (count === 0 || state.recorded) {
    return;
  }
  state.recorded = true;
  const scored = scoreSession(state.session.slice(0, count), state.selectedAnswers.slice(0, count));
  const request = getQuizRequest();
  recordAttempt({
    date: new Date().toISOString(),
    mode: request?.mode ?? "mixed",
    topicBreakdown: scored.topicBreakdown,
    categoryBreakdown: scored.categoryBreakdown,
    questions: scored.questionResults.map((question) => ({
      id: question.id,
      topicId: question.topicId,
      category: question.category,
      correct: question.correct,
      // Same shape as the normal path in js/results.js, and it has to
      // stay the same shape: two writers of one record is how a field
      // ends up present on some attempts and absent on others.
      selected: question.selectedAnswer ?? null,
    })),
  });
}

/**
 * Leaving mid-test. This was a plain link, then a link plus a
 * confirmation dialog, and both were wrong in the same way: a dialog
 * makes the loss loud instead of making it not a loss. Five answered
 * questions are a five-question test — so the exit records them and
 * shows the score, exactly as finishing does, and the label says so.
 * With nothing answered there is nothing to record and it is still Çık.
 */
function exitQuiz() {
  if (answeredCount() === 0) {
    window.location.href = "index.html";
    return;
  }
  finishQuiz({ upTo: answeredCount() });
}

/**
 * The test named in one word or a title, for the top strip and the tab:
 * a screen of ten questions never said whether they were the mistake
 * book, one topic or everything mixed, and the category label under the
 * strip names the question, not the test.
 */
function modeLabel(request, titleById) {
  switch (request?.mode) {
    case "mistakes":
      return "Yanlış defteri";
    case "topic":
      return titleById.get(request.topicIds?.[0]) ?? "Konu testi";
    case "category":
      return "Kategori testi";
    default:
      return "Karışık test";
  }
}

/**
 * The bar: the way out on the left — "Çık" before anything is answered,
 * "Bitir" once something is, because from then on leaving saves — the
 * test's name in the middle, the count on the right, the position along
 * the bottom edge.
 */
function setQuizBar() {
  const early = answeredCount() > 0;
  const readout = el("p", "t-meta t-num strip__readout");
  const mode = el("span", "strip__mode", state.modeLabel);
  if (/[A-Za-z]/.test(state.modeLabel) && !/test|defteri/.test(state.modeLabel)) {
    mode.lang = "en";
  }
  readout.appendChild(el("span", null, `${state.currentIndex + 1} / ${state.session.length}`));
  bar.set({
    title: state.modeLabel,
    lead: { label: early ? "Bitir" : "Çık", icon: early ? "check" : "close", onClick: exitQuiz },
    trail: readout,
    progress: (state.currentIndex + 1) / state.session.length,
  });
}

function handleOptionSelected(question, selectedOption) {
  if (state.answered) {
    return;
  }
  state.answered = true;
  state.selectedAnswers[state.currentIndex] = selectedOption;

  const correct = isCorrectAnswer(question, selectedOption);
  haptic();
  announce(...answerAnnouncement(question, correct, selectedOption));
  // 4.1.3 is explicit that a status message arrives "without receiving
  // focus", and moving focus here would take the learner away from the
  // button they are about to press.
  renderQuestion();
}

function advance() {
  if (state.currentIndex === state.session.length - 1) {
    finishQuiz();
    return;
  }
  state.currentIndex += 1;
  state.answered = false;
  state.optionsHidden = getSetting(SETTINGS.THINK_FIRST);
  renderQuestion();
  scrollToTop();
}

/**
 * @param {{upTo?: number}} [options] - `upTo` scores only the first N
 *   questions, which is what an early finish means: the ones that were
 *   never shown are not wrong answers and must not be scored as any.
 */
async function finishQuiz({ upTo } = {}) {
  const count = upTo ?? state.session.length;
  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
  const scored = scoreSession(
    state.session.slice(0, count),
    state.selectedAnswers.slice(0, count)
  );

  const request = getQuizRequest();
  // Claimed before navigating: results.js records the attempt, and the
  // `pagehide` this navigation fires must not record it as well.
  state.recorded = true;
  setQuizResult({
    date: new Date().toISOString(),
    mode: request?.mode ?? "mixed",
    partial: count < state.session.length,
    ...scored,
    topicTitles: Object.fromEntries(
      Object.keys(scored.topicBreakdown).map((topicId) => [topicId, titleById.get(topicId) ?? topicId])
    ),
  });

  // replace(), not href: going back from the results screen should return
  // to where the test was started, not silently re-roll a brand new test.
  window.location.replace("results.html");
}

function renderQuestion() {
  const question = state.session[state.currentIndex];
  const selected = state.selectedAnswers[state.currentIndex] ?? null;

  clear(container);
  setQuizBar();
  const page = el("div", "stack stack--loose animate-in");

  const block = el("div", "stack");
  // The prompt on a card of its own: the question is the object the
  // options answer, and it reads as one when it has an edge.
  const prompt = el("div", "quiz__prompt stack stack--tight");
  if (question.category) {
    const category = el("p", "t-label", question.category);
    category.lang = "en";
    prompt.appendChild(category);
  }
  prompt.appendChild(renderPrompt(question));
  block.appendChild(prompt);

  if (state.optionsHidden) {
    const reveal = el("button", "btn btn--secondary", "Şıkları göster");
    reveal.type = "button";
    reveal.addEventListener("click", () => {
      state.optionsHidden = false;
      announce("Şıklar göründü.");
      renderQuestion();
      // The learner asked for the options, so put them under the thumb
      // rather than making them look for what just appeared.
      document.querySelector(".option")?.focus({ preventScroll: true });
    });
    block.appendChild(reveal);
  } else {
    block.appendChild(
      renderOptions(question, {
        selected,
        answered: state.answered,
        onSelect: (option) => handleOptionSelected(question, option),
      })
    );
  }

  const feedback = state.answered
    ? block.appendChild(renderAnswerFeedback(question, isCorrectAnswer(question, selected), { selected }))
    : null;

  page.appendChild(block);
  container.appendChild(page);

  // The bar is fixed, so answering never moves the button — but on a short
  // screen the explanation itself can still land below the fold. "nearest"
  // scrolls only if it has to.
  feedback?.scrollIntoView({ block: "nearest" });

  if (state.answered) {
    const isLast = state.currentIndex === state.session.length - 1;
    actionBar.set([
      {
        label: isLast ? "Sonuçları gör" : "Sonraki soru",
        level: "primary",
        onClick: advance,
        focus: true,
      },
    ]);
  } else {
    // Not a disabled button: a disabled control is exempt from the
    // contrast rules, drops out of the tab order, and explains nothing.
    actionBar.hint(
      state.optionsHidden ? "Cevabı düşün, sonra şıklara bak" : "Bir seçenek seç"
    );
  }
}

function handleKeydown(event) {
  if (!state.session.length || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  // Enter already activates a focused control natively, so handling it
  // here too would fire twice — advancing the quiz *and* pressing whatever
  // the learner actually meant to press. That is the advance button, which
  // takes focus as soon as a question is answered, and it is also the
  // problem-report link inside the feedback block: reporting a question
  // used to skip the next one.
  if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea")) {
    return;
  }

  if (!state.answered) {
    // With the options hidden there is nothing for a number key to mean,
    // and guessing "3" before seeing the list is exactly what the setting
    // exists to prevent.
    if (state.optionsHidden) {
      return;
    }
    const choice = Number(event.key);
    if (Number.isInteger(choice) && choice >= 1 && choice <= 4) {
      event.preventDefault();
      document.querySelectorAll(".option")[choice - 1]?.click();
    }
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    actionBar.buttons()[0]?.click();
  }
}

async function init() {
  const request = getQuizRequest();
  if (!request) {
    // Not an error, and not a screen worth having. The request lives in
    // sessionStorage, so the only way to arrive here without one is to
    // arrive in a NEW session — an installed app or a phone browser
    // reopening the last page it had, a day later. The learner did not
    // ask for a quiz screen; the app reopened where it was. What they
    // got was a fullscreen page with no header, no nav and one button,
    // which reads as a broken app, and the owner reported it as one.
    //
    // Nothing is lost by leaving: `recordPartialOnLeave` wrote down
    // whatever had been answered on the way out, so the score is already
    // in the history the home screen reads.
    //
    // `replace` rather than `assign`, so Back does not return to the
    // page we are leaving and bounce them straight out again.
    window.location.replace("index.html");
    return;
  }

  try {
    const manifest = await loadManifest();
    state.modeLabel = modeLabel(
      request,
      new Map(manifest.topics.map((topic) => [topic.id, topic.title]))
    );
    document.title = `${state.modeLabel} — English Prep`;
    const topics = manifest.topics.filter(
      (topic) => !topic.comingSoon && request.topicIds.includes(topic.id)
    );
    let questions = await loadQuestionsForTopics(topics);
    if (request.category) {
      questions = questions.filter((question) => question.category === request.category);
    }
    if (Array.isArray(request.ids)) {
      // Yanlış defteri: the exact set the learner was shown a count for.
      const wanted = new Set(request.ids);
      questions = questions.filter((question) => wanted.has(question.id));
    }
    // Worst-known first: questions never answered, then ones answered
    // wrong last time, then the least recently seen. Without this the app
    // re-asks what the learner already knows and the score stops meaning
    // anything after the first pass through a category.
    const session = buildQuizSession(questions, request.count, getItemStats());

    if (session.length === 0) {
      showMessage("Bu seçim için soru bulunamadı.");
      return;
    }

    state.session = session;
    state.selectedAnswers = new Array(session.length).fill(null);
    state.optionsHidden = getSetting(SETTINGS.THINK_FIRST);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("pagehide", recordPartialOnLeave);
    renderQuestion();
  } catch (error) {
    console.error(error);
    clear(container);
    container.appendChild(
      failureCard("Test", () => init(), { label: "Ana sayfa", href: "index.html" })
    );
    actionBar.hide();
  }
}

init();
