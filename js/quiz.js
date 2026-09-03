import { loadManifest, loadQuestionsForTopics } from "./topics.js";
import { buildQuizSession, isCorrectAnswer, scoreSession } from "./quiz-engine.js";
import { getQuizRequest, setQuizResult } from "./session-state.js";
import { renderAnswerFeedback } from "./feedback.js";
import { el, clear, appendBlanked } from "./dom.js";

const container = document.getElementById("quiz-container");
const appContent = document.getElementById("app-content");
const bottomBar = document.getElementById("quiz-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
};

function showBottomBarAction(label, onClick) {
  clear(bottomBarInner);
  const button = el("button", "btn", label);
  button.type = "button";
  button.addEventListener("click", onClick);
  bottomBarInner.appendChild(button);
  bottomBar.hidden = false;
  button.focus();
}

function hideBottomBar() {
  bottomBar.hidden = true;
  clear(bottomBarInner);
}

function showMessage(text, { withHomeLink = true } = {}) {
  hideBottomBar();
  clear(container);
  container.appendChild(el("p", "empty-state", text));

  if (withHomeLink) {
    const link = el("a", "btn", "Ana Sayfa");
    link.href = "index.html";
    container.appendChild(link);
  }
}

function renderCategoryLabel(category) {
  const label = el("p", "question-card__category", category);
  // English grammar term inside an otherwise-Turkish page: without this,
  // the CSS uppercase transform follows the page's lang="tr" and turns
  // "Simple" into "SİMPLE" (Turkish dotted İ) rather than "SIMPLE".
  label.lang = "en";
  return label;
}

function renderPrompt(promptText) {
  const paragraph = el("p", "question-card__prompt");
  appendBlanked(paragraph, promptText);
  return paragraph;
}

function renderFeedback(question, correct) {
  const feedback = renderAnswerFeedback(question, correct);
  document.getElementById("question-card").appendChild(feedback);
  // The bottom bar is fixed, so answering doesn't move the next button —
  // but on a small screen the explanation can still land below the fold.
  feedback.scrollIntoView({ block: "nearest" });
}

function handleOptionSelected(question, selectedOption, optionButtons) {
  if (state.answered) {
    return;
  }
  state.answered = true;
  state.selectedAnswers[state.currentIndex] = selectedOption;

  const correct = isCorrectAnswer(question, selectedOption);

  for (const button of optionButtons) {
    button.disabled = true;
    if (isCorrectAnswer(question, button.dataset.option)) {
      button.classList.add("option-btn--correct");
    } else if (button.dataset.option === selectedOption) {
      button.classList.add("option-btn--incorrect");
    }
  }

  renderFeedback(question, correct);

  const isLastQuestion = state.currentIndex === state.session.length - 1;
  showBottomBarAction(isLastQuestion ? "Sonuçları Gör" : "Sonraki Soru", advance);
}

function advance() {
  if (state.currentIndex === state.session.length - 1) {
    finishQuiz();
    return;
  }
  state.currentIndex += 1;
  state.answered = false;
  renderQuestion();
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
  hideBottomBar();
  clear(container);

  const nav = el("div", "quiz-nav");
  const exitLink = el("a", "quiz-nav__exit", "← Ana Sayfa");
  exitLink.href = "index.html";
  nav.appendChild(exitLink);
  nav.appendChild(el("p", "quiz-progress", `Soru ${state.currentIndex + 1} / ${state.session.length}`));
  container.appendChild(nav);

  const progressTrack = el("div", "progress-track");
  const progressFill = el("div", "progress-track__fill");
  progressFill.style.width = `${((state.currentIndex + 1) / state.session.length) * 100}%`;
  progressTrack.appendChild(progressFill);
  container.appendChild(progressTrack);

  const card = el("div", "question-card");
  card.id = "question-card";

  const question = state.session[state.currentIndex];
  if (question.category) {
    card.appendChild(renderCategoryLabel(question.category));
  }
  card.appendChild(renderPrompt(question.prompt));

  const optionsWrap = el("div", "options");
  const optionButtons = question.options.map((option, index) => {
    const button = el("button", "option-btn");
    button.type = "button";
    button.dataset.option = option;
    button.appendChild(el("span", "option-btn__key", `${index + 1}.`));
    button.appendChild(document.createTextNode(option));
    optionsWrap.appendChild(button);
    return button;
  });

  for (const button of optionButtons) {
    button.addEventListener("click", () =>
      handleOptionSelected(question, button.dataset.option, optionButtons)
    );
  }

  card.appendChild(optionsWrap);
  container.appendChild(card);
  appContent.scrollTo({ top: 0 });
}

function handleKeydown(event) {
  if (!state.session.length || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  // The advance button is focused as soon as a question is answered, so
  // pressing Enter there already activates it natively. Handling it here
  // too would advance twice and skip a question.
  if (bottomBar.contains(event.target)) {
    return;
  }

  if (!state.answered) {
    const choice = Number(event.key);
    if (Number.isInteger(choice) && choice >= 1 && choice <= 4) {
      event.preventDefault();
      document.querySelectorAll(".option-btn")[choice - 1]?.click();
    }
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    bottomBarInner.querySelector("button")?.click();
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
    const session = buildQuizSession(questions, request.count);

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
