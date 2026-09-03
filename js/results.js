import { loadManifest } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt, getWeakTopics } from "./storage.js";

const container = document.getElementById("results-container");
const bottomBar = document.getElementById("results-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

function showMessage(text) {
  container.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = text;
  container.appendChild(message);

  bottomBarInner.innerHTML = "";
  const link = document.createElement("a");
  link.className = "btn";
  link.href = "index.html";
  link.textContent = "Ana Sayfa";
  bottomBarInner.appendChild(link);
  bottomBar.hidden = false;
}

function formatPercent(correct, total) {
  return total === 0 ? "%0" : `%${Math.round((correct / total) * 100)}`;
}

function renderScoreSummary(result) {
  const summary = document.createElement("section");
  summary.className = "score-summary";

  const value = document.createElement("div");
  value.className = "score-summary__value";
  value.textContent = `${result.correctCount} / ${result.totalCount}`;
  summary.appendChild(value);

  const label = document.createElement("p");
  label.textContent = `${formatPercent(result.correctCount, result.totalCount)} doğru`;
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
  callout.textContent = `Sırada bu konuya odaklan: ${names}`;
  return callout;
}

function renderBreakdown(heading, breakdown, resolveName) {
  const keys = Object.keys(breakdown);
  if (keys.length <= 1) {
    return null;
  }

  const section = document.createElement("section");
  const headingEl = document.createElement("h2");
  headingEl.textContent = heading;
  section.appendChild(headingEl);

  const list = document.createElement("ul");
  list.className = "breakdown-list";
  keys.forEach((key) => {
    const stats = breakdown[key];
    const item = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = resolveName(key);
    item.appendChild(name);

    const score = document.createElement("span");
    score.className = "breakdown-list__score";
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
  heading.textContent = "İnceleme";
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
    yourAnswer.textContent = `Cevabın: ${question.selectedAnswer}`;
    item.appendChild(yourAnswer);

    if (!question.correct) {
      const correctAnswer = document.createElement("p");
      correctAnswer.className = "review-item__answer review-item__answer--correct";
      correctAnswer.textContent = `Doğru cevap: ${question.correctAnswer}`;
      item.appendChild(correctAnswer);
    }

    const explanation = document.createElement("p");
    explanation.className = "review-item__explanation";
    explanation.textContent = question.explanation;
    item.appendChild(explanation);

    if (question.tip) {
      const tip = document.createElement("p");
      tip.className = "review-item__tip";
      const tipLabel = document.createElement("strong");
      tipLabel.textContent = "Kural: ";
      tip.appendChild(tipLabel);
      tip.appendChild(document.createTextNode(question.tip));
      item.appendChild(tip);
    }

    section.appendChild(item);
  });

  return section;
}

function renderBottomBarActions() {
  bottomBarInner.innerHTML = "";

  const retryBtn = document.createElement("button");
  retryBtn.className = "btn";
  retryBtn.type = "button";
  retryBtn.textContent = "Tekrar Dene";
  retryBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
  bottomBarInner.appendChild(retryBtn);

  const homeLink = document.createElement("a");
  homeLink.className = "btn btn--secondary";
  homeLink.href = "index.html";
  homeLink.textContent = "Ana Sayfa";
  bottomBarInner.appendChild(homeLink);

  bottomBar.hidden = false;
}

async function init() {
  const result = getQuizResult();
  if (!result) {
    showMessage("Henüz gösterilecek bir sonuç yok. Ana sayfadan bir test başlat.");
    return;
  }

  if (!result.recorded) {
    recordAttempt({
      date: result.date,
      mode: result.mode,
      topicBreakdown: result.topicBreakdown,
      categoryBreakdown: result.categoryBreakdown,
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

  const topicBreakdown = renderBreakdown("Konuya Göre Dağılım", result.topicBreakdown, (topicId) =>
    titleById.get(topicId) ?? topicId
  );
  if (topicBreakdown) {
    container.appendChild(topicBreakdown);
  }

  if (result.categoryBreakdown) {
    const categoryBreakdown = renderBreakdown(
      "Kategoriye Göre Dağılım",
      result.categoryBreakdown,
      (category) => category
    );
    if (categoryBreakdown) {
      container.appendChild(categoryBreakdown);
    }
  }

  container.appendChild(renderReview(result));
  renderBottomBarActions();
}

init();
