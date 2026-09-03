import { loadManifest, loadQuestionsForTopics } from "./topics.js";
import { buildQuizSession, isCorrectAnswer, scoreSession } from "./quiz-engine.js";
import { getQuizRequest, setQuizResult } from "./session-state.js";
import { renderAnswerFeedback } from "./feedback.js";
import { createConfirmModal } from "./modal.js";
import { navigateTo, registerPage, isBundled } from "./navigate.js";

const container = document.getElementById("quiz-container");
const bottomBar = document.getElementById("quiz-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");
const exitOverlay = document.getElementById("exit-modal");

const exitModal = createConfirmModal({
  overlayId: "exit-modal",
  confirmId: "exit-modal-confirm",
  cancelId: "exit-modal-cancel",
  onConfirm: () => {
    navigateTo("index.html");
  },
});

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
};

function showBottomBarAction(label, onClick) {
  bottomBarInner.innerHTML = "";
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.type = "button";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  bottomBarInner.appendChild(btn);
  bottomBar.hidden = false;
  btn.focus();
}

function hideBottomBar() {
  bottomBar.hidden = true;
  bottomBarInner.innerHTML = "";
}

function showMessage(text, { withHomeLink = true } = {}) {
  hideBottomBar();
  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "empty-state empty-state--center";
  wrap.appendChild(document.createTextNode(text));

  if (withHomeLink) {
    const link = document.createElement("a");
    link.className = "btn";
    link.href = "index.html";
    link.textContent = "Ana Sayfa";
    wrap.appendChild(link);
  }

  container.appendChild(wrap);
}

function renderCategoryLabel(category) {
  const label = document.createElement("p");
  label.className = "question-card__category";
  // English grammar term inside an otherwise-Turkish page: without this,
  // the CSS uppercase transform follows the page's lang="tr" and turns
  // "Simple" into "SİMPLE" (Turkish dotted İ), not "SIMPLE".
  label.lang = "en";
  label.textContent = category;
  return label;
}

function renderPrompt(promptText) {
  const paragraph = document.createElement("p");
  paragraph.className = "question-card__prompt";
  const parts = promptText.split("____");
  parts.forEach((part, index) => {
    paragraph.appendChild(document.createTextNode(part));
    if (index < parts.length - 1) {
      const blank = document.createElement("span");
      blank.className = "blank";
      blank.textContent = "_____";
      paragraph.appendChild(blank);
    }
  });
  return paragraph;
}

function handleOptionSelected(question, selectedOption, optionButtons) {
  if (state.answered) {
    return;
  }
  state.answered = true;
  state.selectedAnswers[state.currentIndex] = selectedOption;

  const correct = isCorrectAnswer(question, selectedOption);

  optionButtons.forEach((button) => {
    button.disabled = true;
    if (isCorrectAnswer(question, button.dataset.option)) {
      button.classList.add("option-btn--correct");
    } else if (button.dataset.option === selectedOption) {
      button.classList.add("option-btn--incorrect");
    }
  });

  renderFeedback(question, correct);

  const isLastQuestion = state.currentIndex === state.session.length - 1;
  showBottomBarAction(isLastQuestion ? "Sonuçları Gör" : "Sonraki Soru", advance);
}

function renderFeedback(question, correct) {
  document.getElementById("question-card").appendChild(renderAnswerFeedback(question, correct));
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

  navigateTo("results.html");
}

function renderQuestion() {
  hideBottomBar();
  container.innerHTML = "";

  const nav = document.createElement("div");
  nav.className = "quiz-nav";

  // A button, not a link: leaving discards every answer so far, so it
  // has to be able to ask first.
  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "quiz-nav__exit";
  exitBtn.textContent = "← Çık";
  exitBtn.addEventListener("click", () => exitModal.open());
  nav.appendChild(exitBtn);

  const progress = document.createElement("p");
  progress.className = "quiz-progress";
  progress.textContent = `Soru ${state.currentIndex + 1} / ${state.session.length}`;
  nav.appendChild(progress);
  container.appendChild(nav);

  const progressTrack = document.createElement("div");
  progressTrack.className = "progress-track";
  const progressFill = document.createElement("div");
  progressFill.className = "progress-track__fill";
  const percentComplete = ((state.currentIndex + 1) / state.session.length) * 100;
  progressFill.style.width = `${percentComplete}%`;
  progressTrack.appendChild(progressFill);
  container.appendChild(progressTrack);

  const card = document.createElement("div");
  card.id = "question-card";
  card.className = "question-card";

  const question = state.session[state.currentIndex];
  if (question.category) {
    card.appendChild(renderCategoryLabel(question.category));
  }

  // Only shown where there's a real keyboard (CSS hides it on touch) —
  // the shortcuts exist, so they should be discoverable rather than
  // something you'd only find by guessing.
  const hint = document.createElement("p");
  hint.className = "keyboard-hint";
  hint.textContent = "1–4 ile cevapla · Enter ile devam et";
  card.appendChild(hint);

  card.appendChild(renderPrompt(question.prompt));

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "options";

  const optionButtons = question.options.map((option, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.dataset.option = option;

    const key = document.createElement("span");
    key.className = "option-btn__key";
    key.textContent = `${index + 1}.`;
    button.appendChild(key);
    button.appendChild(document.createTextNode(option));

    optionsWrap.appendChild(button);
    return button;
  });

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => handleOptionSelected(question, button.dataset.option, optionButtons));
  });

  card.appendChild(optionsWrap);
  container.appendChild(card);
}

function handleKeydown(event) {
  // While the exit confirm is open it owns the keyboard — otherwise
  // Enter would answer the question behind the dialog.
  if (!state.session.length || !exitOverlay.hidden) {
    return;
  }

  if (!state.answered && ["1", "2", "3", "4"].includes(event.key)) {
    const buttons = document.querySelectorAll(".option-btn");
    const button = buttons[Number(event.key) - 1];
    button?.click();
    return;
  }

  if (state.answered && event.key === "Enter") {
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
    const topics = manifest.topics.filter((topic) => request.topicIds.includes(topic.id));
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

// The real site loads this module only on its own page, so it starts
// immediately. The single-file build loads every module at once and
// starts each page on navigation instead.
registerPage("quiz.html", init);
if (!isBundled()) {
  init();
}
