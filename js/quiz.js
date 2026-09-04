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
import { el, clear } from "./dom.js";
import { icon } from "./icons.js";
import { announce, scrollToTop, createActionBar } from "./shell.js";

const container = document.getElementById("quiz-container");
const actionBar = createActionBar("quiz-bar");

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
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
  clear(container);
  container.appendChild(el("p", "t-meta", text));
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

function renderTopStrip() {
  const strip = el("div", "cluster cluster--spread");

  // A button, not a link, because it does something before it navigates.
  // Once anything is answered it stops being an exit and becomes an early
  // finish, and the word has to change with it: "Çık" beside work that is
  // about to be saved would describe the old behaviour, not this one.
  const early = answeredCount() > 0;
  const exit = el("button", "btn btn--quiet", early ? "Bitir" : "Çık");
  exit.type = "button";
  exit.prepend(icon(early ? "check" : "close", { size: 20 }));
  exit.addEventListener("click", exitQuiz);
  strip.appendChild(exit);

  strip.appendChild(
    el("p", "t-meta t-num", `${state.currentIndex + 1} / ${state.session.length}`)
  );
  return strip;
}

function progressBar() {
  const track = el("div", "progress");
  const fill = el("div", "progress__fill");
  fill.style.width = `${((state.currentIndex + 1) / state.session.length) * 100}%`;
  track.appendChild(fill);
  return track;
}

function handleOptionSelected(question, selectedOption) {
  if (state.answered) {
    return;
  }
  state.answered = true;
  state.selectedAnswers[state.currentIndex] = selectedOption;

  const correct = isCorrectAnswer(question, selectedOption);
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
  const page = el("div", "stack stack--loose");
  page.appendChild(renderTopStrip());
  page.appendChild(progressBar());

  const block = el("div", "stack");
  if (question.category) {
    const category = el("p", "t-label", question.category);
    category.lang = "en";
    block.appendChild(category);
  }

  block.appendChild(renderPrompt(question));

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
    showMessage("Devam eden bir test yok. Ana sayfadan bir test başlat.");
    return;
  }

  try {
    const manifest = await loadManifest();
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
    showMessage("Test yüklenirken bir sorun oluştu. Tekrar dene.");
  }
}

init();
