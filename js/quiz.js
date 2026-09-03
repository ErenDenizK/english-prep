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
import { getItemStats } from "./storage.js";
import { renderAnswerFeedback, answerAnnouncement } from "./feedback.js";
import { renderOptions } from "./answers.js";
import { el, clear, appendBlanked } from "./dom.js";
import { icon } from "./icons.js";
import { announce, scrollToTop, createActionBar } from "./shell.js";

const container = document.getElementById("quiz-container");
const actionBar = createActionBar("quiz-bar");

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
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

function renderTopStrip() {
  const strip = el("div", "cluster cluster--spread");

  const exit = el("a", "btn btn--quiet", "Çık");
  exit.href = "index.html";
  exit.prepend(icon("close", { size: 20 }));
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
  announce(...answerAnnouncement(question, correct));
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
  renderQuestion();
  scrollToTop();
}

async function finishQuiz() {
  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
  const scored = scoreSession(state.session, state.selectedAnswers);

  const request = getQuizRequest();
  setQuizResult({
    date: new Date().toISOString(),
    mode: request?.mode ?? "mixed",
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

  const prompt = el("p", "t-lead t-en");
  prompt.lang = "en";
  appendBlanked(prompt, question.prompt);
  block.appendChild(prompt);

  block.appendChild(
    renderOptions(question, {
      selected,
      answered: state.answered,
      onSelect: (option) => handleOptionSelected(question, option),
    })
  );

  const feedback = state.answered
    ? block.appendChild(renderAnswerFeedback(question, isCorrectAnswer(question, selected)))
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
    actionBar.hint("Bir seçenek seç");
  }
}

function handleKeydown(event) {
  if (!state.session.length || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  // The advance button takes focus as soon as a question is answered, so
  // Enter there already activates it natively; handling it here too would
  // advance twice and skip a question.
  if (actionBar.contains(event.target)) {
    return;
  }

  if (!state.answered) {
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
    document.addEventListener("keydown", handleKeydown);
    renderQuestion();
  } catch (error) {
    console.error(error);
    showMessage("Test yüklenirken bir sorun oluştu. Tekrar dene.");
  }
}

init();
