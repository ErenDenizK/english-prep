import { loadManifest } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt, getWeakTopics } from "./storage.js";

const container = document.getElementById("results-container");

function showMessage(text) {
  container.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = text;
  container.appendChild(message);

  const link = document.createElement("a");
  link.className = "btn";
  link.href = "index.html";
  link.textContent = "Back to Home";
  container.appendChild(link);
}

function formatPercent(correct, total) {
  return total === 0 ? "0%" : `${Math.round((correct / total) * 100)}%`;
}

function renderScoreSummary(result) {
  const summary = document.createElement("section");
  summary.className = "score-summary";

  const value = document.createElement("div");
  value.className = "score-summary__value";
  value.textContent = `${result.correctCount} / ${result.totalCount}`;
  summary.appendChild(value);

  const label = document.createElement("p");
  label.textContent = `${formatPercent(result.correctCount, result.totalCount)} correct`;
  summary.appendChild(label);

  return summary;
}

function renderWeakTopicsCallout(titleById) {
  const weakTopics = getWeakTopics();
  if (weakTopics.length === 0) {
    return null;
  }

  const names = weakTopics.map((entry) => titleById.get(entry.topicId) ?? entry.topicId).join(", ");
  const callout = document.createElement("div");
  callout.className = "callout";
  callout.textContent = `Focus on this next: ${names}`;
  return callout;
}

function renderBreakdown(result, titleById) {
  const topicIds = Object.keys(result.topicBreakdown);
  if (topicIds.length <= 1) {
    return null;
  }

  const section = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = "Breakdown by Topic";
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "breakdown-list";
  topicIds.forEach((topicId) => {
    const stats = result.topicBreakdown[topicId];
    const item = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = titleById.get(topicId) ?? topicId;
    item.appendChild(name);

    const score = document.createElement("span");
    score.textContent = `${stats.correct}/${stats.total}`;
    item.appendChild(score);

    list.appendChild(item);
  });
  section.appendChild(list);

  return section;
}

function renderReview(result) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = "Review";
  section.appendChild(heading);

  result.questionResults.forEach((question, index) => {
    const item = document.createElement("div");
    item.className = "review-item";

    const prompt = document.createElement("p");
    prompt.className = "review-item__prompt";
    prompt.textContent = `${index + 1}. ${question.prompt}`;
    item.appendChild(prompt);

    const yourAnswer = document.createElement("p");
    yourAnswer.className = `review-item__answer review-item__answer--${question.correct ? "correct" : "incorrect"}`;
    yourAnswer.textContent = `Your answer: ${question.selectedAnswer}`;
    item.appendChild(yourAnswer);

    if (!question.correct) {
      const correctAnswer = document.createElement("p");
      correctAnswer.className = "review-item__answer review-item__answer--correct";
      correctAnswer.textContent = `Correct answer: ${question.correctAnswer}`;
      item.appendChild(correctAnswer);
    }

    const explanation = document.createElement("p");
    explanation.className = "review-item__explanation";
    explanation.textContent = question.explanation;
    item.appendChild(explanation);

    section.appendChild(item);
  });

  return section;
}

function renderActions() {
  const row = document.createElement("div");
  row.className = "actions-row";

  const retryBtn = document.createElement("button");
  retryBtn.className = "btn";
  retryBtn.type = "button";
  retryBtn.textContent = "Try Again";
  retryBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
  row.appendChild(retryBtn);

  const homeLink = document.createElement("a");
  homeLink.className = "btn btn--secondary";
  homeLink.href = "index.html";
  homeLink.textContent = "Back to Home";
  row.appendChild(homeLink);

  return row;
}

async function init() {
  const result = getQuizResult();
  if (!result) {
    showMessage("No results to show yet. Start a test from the home page.");
    return;
  }

  if (!result.recorded) {
    recordAttempt({
      date: result.date,
      mode: result.mode,
      topicBreakdown: result.topicBreakdown,
      questions: result.questionResults.map((question) => ({
        id: question.id,
        topicId: question.topicId,
        correct: question.correct,
      })),
    });
    result.recorded = true;
    setQuizResult(result);
  }

  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));

  container.innerHTML = "";
  container.appendChild(renderScoreSummary(result));

  const weakCallout = renderWeakTopicsCallout(titleById);
  if (weakCallout) {
    container.appendChild(weakCallout);
  }

  const breakdown = renderBreakdown(result, titleById);
  if (breakdown) {
    container.appendChild(breakdown);
  }

  container.appendChild(renderReview(result));
  container.appendChild(renderActions());
}

init();
