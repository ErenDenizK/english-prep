import { loadManifest, loadQuestionsForTopics } from "./topics.js";
import { buildQuizSession, isCorrectAnswer, scoreSession } from "./quiz-engine.js";
import { getQuizRequest, setQuizResult } from "./session-state.js";

const container = document.getElementById("quiz-container");

const state = {
  session: [],
  selectedAnswers: [],
  currentIndex: 0,
  answered: false,
};

function showMessage(text, { withHomeLink = true } = {}) {
  container.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = text;
  container.appendChild(message);

  if (withHomeLink) {
    const link = document.createElement("a");
    link.className = "btn";
    link.href = "index.html";
    link.textContent = "Back to Home";
    container.appendChild(link);
  }
}

function renderCategoryLabel(category) {
  const label = document.createElement("p");
  label.className = "question-card__category";
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
  renderNextAction();
}

function renderFeedback(question, correct) {
  const existing = document.getElementById("feedback");
  if (existing) {
    existing.remove();
  }

  const feedback = document.createElement("div");
  feedback.id = "feedback";
  feedback.className = `feedback ${correct ? "feedback--correct" : "feedback--incorrect"}`;

  const heading = document.createElement("strong");
  heading.textContent = correct ? "Correct!" : `Incorrect — the correct answer is "${question.correctAnswer}".`;
  feedback.appendChild(heading);

  const explanation = document.createElement("p");
  explanation.className = "feedback__explanation";
  explanation.textContent = question.explanation;
  feedback.appendChild(explanation);

  if (question.tip) {
    const tip = document.createElement("p");
    tip.className = "feedback__tip";
    const tipLabel = document.createElement("strong");
    tipLabel.textContent = "Kural: ";
    tip.appendChild(tipLabel);
    tip.appendChild(document.createTextNode(question.tip));
    feedback.appendChild(tip);
  }

  document.getElementById("question-card").appendChild(feedback);
}

function renderNextAction() {
  const existing = document.getElementById("next-action-row");
  if (existing) {
    existing.remove();
  }

  const isLastQuestion = state.currentIndex === state.session.length - 1;

  const row = document.createElement("div");
  row.id = "next-action-row";
  row.className = "actions-row";

  const nextBtn = document.createElement("button");
  nextBtn.className = "btn";
  nextBtn.type = "button";
  nextBtn.textContent = isLastQuestion ? "See Results" : "Next Question";
  nextBtn.addEventListener("click", advance);
  row.appendChild(nextBtn);

  document.getElementById("question-card").appendChild(row);
  nextBtn.focus();
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

  window.location.href = "results.html";
}

function renderQuestion() {
  container.innerHTML = "";

  const progress = document.createElement("p");
  progress.className = "quiz-progress";
  progress.textContent = `Question ${state.currentIndex + 1} of ${state.session.length}`;
  container.appendChild(progress);

  const card = document.createElement("div");
  card.id = "question-card";
  card.className = "question-card";

  const question = state.session[state.currentIndex];
  if (question.category) {
    card.appendChild(renderCategoryLabel(question.category));
  }
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
  if (!state.session.length) {
    return;
  }

  if (!state.answered && ["1", "2", "3", "4"].includes(event.key)) {
    const buttons = document.querySelectorAll(".option-btn");
    const button = buttons[Number(event.key) - 1];
    button?.click();
    return;
  }

  if (state.answered && event.key === "Enter") {
    document.getElementById("next-action-row")?.querySelector("button")?.click();
  }
}

async function init() {
  const request = getQuizRequest();
  if (!request) {
    showMessage("No quiz is in progress. Start one from the home page.");
    return;
  }

  try {
    const manifest = await loadManifest();
    const topics = manifest.topics.filter((topic) => request.topicIds.includes(topic.id));
    const questions = await loadQuestionsForTopics(topics);
    const session = buildQuizSession(questions, request.count);

    if (session.length === 0) {
      showMessage("No questions are available for this selection.");
      return;
    }

    state.session = session;
    state.selectedAnswers = new Array(session.length).fill(null);
    document.addEventListener("keydown", handleKeydown);
    renderQuestion();
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong loading this quiz. Please try again.");
  }
}

init();
