import { loadManifest } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt, getWeakTopics } from "./storage.js";
import { navigateTo, registerPage, isBundled } from "./navigate.js";

const container = document.getElementById("results-container");
const bottomBar = document.getElementById("results-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

// "Yanlışlar" is the default view whenever anything was missed: the
// wrong answers are the reason to be on this screen at all, and making
// someone scroll a full correct-answer list to find them is busywork.
const state = {
  result: null,
  reviewFilter: "wrong", // "wrong" | "all"
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function showMessage(text) {
  container.innerHTML = "";
  const wrap = el("div", "empty-state empty-state--center");
  wrap.appendChild(document.createTextNode(text));
  container.appendChild(wrap);

  bottomBarInner.innerHTML = "";
  const link = el("a", "btn", "Ana Sayfa");
  link.href = "index.html";
  bottomBarInner.appendChild(link);
  bottomBar.hidden = false;
}

function formatPercent(correct, total) {
  return total === 0 ? "%0" : `%${Math.round((correct / total) * 100)}`;
}

// A number alone doesn't tell a learner whether to move on or go back
// over the topic. One honest sentence does.
function verdictFor(ratio) {
  if (ratio >= 0.9) return "Çok iyi — bu konu oturmuş görünüyor.";
  if (ratio >= 0.7) return "İyi gidiyor. Yanlışlarını gözden geçir, sonra devam et.";
  if (ratio >= 0.5) return "Temel var ama pekiştirmek gerek. Eğitim'den bu konuyu tekrar et.";
  return "Bu konuyu Eğitim'den tekrar etmek iyi olur, sonra tekrar dene.";
}

function renderScoreSummary(result) {
  const summary = el("section", "score-summary");
  summary.appendChild(el("div", "score-summary__value", `${result.correctCount}/${result.totalCount}`));
  summary.appendChild(
    el("p", "score-summary__label", `${formatPercent(result.correctCount, result.totalCount)} doğru`)
  );
  summary.appendChild(
    el("p", "score-summary__message", verdictFor(result.totalCount === 0 ? 0 : result.correctCount / result.totalCount))
  );
  return summary;
}

function renderWeakTopicsCallout(titleById) {
  const weakTopics = getWeakTopics();
  if (weakTopics.length === 0) {
    return null;
  }

  const names = weakTopics.map((entry) => titleById.get(entry.topicId) ?? entry.topicId).join(", ");
  const callout = el("div", "callout");
  const text = el("p", "callout__text");
  text.appendChild(document.createTextNode("Sırada buna odaklan: "));
  const strong = el("strong", null, names);
  strong.lang = "en";
  text.appendChild(strong);
  callout.appendChild(text);
  return callout;
}

function renderBreakdown(heading, breakdown, resolveName) {
  const keys = Object.keys(breakdown);
  if (keys.length <= 1) {
    return null;
  }

  const section = el("section", "section");
  section.appendChild(el("h2", "section-heading", heading));

  const list = el("ul", "breakdown-list");
  keys.forEach((key) => {
    const stats = breakdown[key];
    const item = document.createElement("li");
    const name = el("span", null, resolveName(key));
    name.lang = "en";
    item.appendChild(name);
    item.appendChild(el("span", "breakdown-list__score", `${stats.correct}/${stats.total}`));
    list.appendChild(item);
  });
  section.appendChild(list);

  return section;
}

function renderReviewItem(question, index) {
  const item = el("div", `review-item review-item--${question.correct ? "correct" : "incorrect"}`);

  const prompt = el("p", "review-item__prompt", `${index + 1}. ${question.prompt}`);
  prompt.lang = "en";
  item.appendChild(prompt);

  const yourAnswer = el(
    "p",
    `review-item__answer review-item__answer--${question.correct ? "correct" : "incorrect"}`,
    `Cevabın: ${question.selectedAnswer}`
  );
  item.appendChild(yourAnswer);

  if (!question.correct) {
    item.appendChild(el("p", "review-item__answer review-item__answer--correct", `Doğru cevap: ${question.correctAnswer}`));
  }

  item.appendChild(el("p", "review-item__explanation", question.explanation));

  if (question.tip) {
    const tip = el("p", "review-item__tip");
    tip.appendChild(el("strong", null, "Kural: "));
    tip.appendChild(document.createTextNode(question.tip));
    item.appendChild(tip);
  }

  return item;
}

function renderReviewList() {
  const list = el("div", "review-list");
  const wrongOnly = state.reviewFilter === "wrong";

  state.result.questionResults.forEach((question, index) => {
    if (wrongOnly && question.correct) {
      return;
    }
    list.appendChild(renderReviewItem(question, index));
  });

  if (!list.children.length) {
    list.appendChild(el("p", "empty-state empty-state--center", "Bu testte hiç yanlışın yok."));
  }

  return list;
}

function renderReview() {
  const section = el("section", "section");
  section.id = "review-section";

  const wrongCount = state.result.questionResults.filter((question) => !question.correct).length;

  const heading = el("h2", "section-heading");
  heading.appendChild(el("span", null, "İnceleme"));
  section.appendChild(heading);

  // The filter only earns its place when there is actually something to
  // filter — with a perfect score there is no second view to switch to.
  if (wrongCount > 0) {
    const segmented = el("div", "segmented");
    const options = [
      { value: "wrong", label: `Yanlışlar (${wrongCount})` },
      { value: "all", label: `Tümü (${state.result.questionResults.length})` },
    ];
    options.forEach((option) => {
      const btn = el("button", "segmented__option", option.label);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(state.reviewFilter === option.value));
      btn.addEventListener("click", () => {
        state.reviewFilter = option.value;
        rerenderReview();
      });
      segmented.appendChild(btn);
    });
    heading.appendChild(segmented);
  }

  section.appendChild(renderReviewList());
  return section;
}

// Only the review section is rebuilt when the filter changes — the score
// and breakdowns above it don't move, so the page doesn't jump.
function rerenderReview() {
  const existing = document.getElementById("review-section");
  existing.replaceWith(renderReview());
}

function renderBottomBarActions() {
  bottomBarInner.innerHTML = "";

  const retryBtn = el("button", "btn", "Tekrar Dene");
  retryBtn.type = "button";
  retryBtn.addEventListener("click", () => {
    navigateTo("quiz.html");
  });
  bottomBarInner.appendChild(retryBtn);

  const homeLink = el("a", "btn btn--secondary", "Ana Sayfa");
  homeLink.href = "index.html";
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

  state.result = result;

  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));

  container.innerHTML = "";
  container.appendChild(renderScoreSummary(result));

  const weakCallout = renderWeakTopicsCallout(titleById);
  if (weakCallout) {
    container.appendChild(weakCallout);
  }

  const topicBreakdown = renderBreakdown("Konuya göre", result.topicBreakdown, (topicId) =>
    titleById.get(topicId) ?? topicId
  );
  if (topicBreakdown) {
    container.appendChild(topicBreakdown);
  }

  if (result.categoryBreakdown) {
    const categoryBreakdown = renderBreakdown("Kategoriye göre", result.categoryBreakdown, (category) => category);
    if (categoryBreakdown) {
      container.appendChild(categoryBreakdown);
    }
  }

  container.appendChild(renderReview());
  renderBottomBarActions();
}

// The real site loads this module only on its own page, so it starts
// immediately. The single-file build loads every module at once and
// starts each page on navigation instead.
registerPage("results.html", init);
if (!isBundled()) {
  init();
}
