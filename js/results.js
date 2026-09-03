import { loadManifest, loadLessonsForTopics } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt, getWeakTopics } from "./storage.js";
import { el, clear, appendBlanked } from "./dom.js";

const container = document.getElementById("results-container");
const bottomBar = document.getElementById("results-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

function formatPercent(correct, total) {
  return total === 0 ? "%0" : `%${Math.round((correct / total) * 100)}`;
}

function showMessage(text) {
  clear(container);
  container.appendChild(el("p", "empty-state", text));

  clear(bottomBarInner);
  const link = el("a", "btn", "Ana Sayfa");
  link.href = "index.html";
  bottomBarInner.appendChild(link);
  bottomBar.hidden = false;
}

function renderScoreSummary(result) {
  const summary = el("section", "score-summary");
  summary.appendChild(el("div", "score-summary__value", `${result.correctCount} / ${result.totalCount}`));
  summary.appendChild(el("p", null, `${formatPercent(result.correctCount, result.totalCount)} doğru`));
  return summary;
}

function renderWeakTopicsCallout(titleById) {
  const weakTopics = getWeakTopics();
  if (weakTopics.length === 0) {
    return null;
  }

  const names = weakTopics.map((entry) => titleById.get(entry.topicId) ?? entry.topicId).join(", ");
  return el("div", "callout", `Sırada bu konuya odaklan: ${names}`);
}

/**
 * @param {string} heading
 * @param {Record<string, {correct: number, total: number}>} breakdown
 * @param {(key: string) => string} resolveName
 * @param {(key: string) => string|null} [resolveLessonId] - when a row
 *   maps to a lesson, the row becomes a link into the Eğitim tab
 */
function renderBreakdown(heading, breakdown, resolveName, resolveLessonId) {
  const keys = Object.keys(breakdown);
  // A one-row breakdown just restates the score above it.
  if (keys.length <= 1) {
    return null;
  }

  const section = el("section");
  section.appendChild(el("h2", null, heading));

  const list = el("ul", "breakdown-list");
  for (const key of keys) {
    const stats = breakdown[key];
    const item = document.createElement("li");
    const score = `${stats.correct}/${stats.total}`;
    const lessonId = resolveLessonId?.(key) ?? null;

    if (lessonId) {
      const link = el("a", "breakdown-link");
      link.href = `index.html#egitim/${lessonId}`;
      const name = el("span", null, resolveName(key));
      name.lang = "en";
      link.appendChild(name);
      link.appendChild(el("span", "breakdown-link__score", `${score} · Dersi aç →`));
      item.className = "breakdown-list__item--link";
      item.appendChild(link);
    } else {
      const name = el("span", null, resolveName(key));
      name.lang = "en";
      item.appendChild(name);
      item.appendChild(el("span", null, score));
    }

    list.appendChild(item);
  }
  section.appendChild(list);

  return section;
}

function renderReview(result) {
  const section = el("section");
  section.appendChild(el("h2", null, "İnceleme"));

  result.questionResults.forEach((question, index) => {
    const item = el("div", "review-item");

    const prompt = el("p", "review-item__prompt");
    prompt.appendChild(document.createTextNode(`${index + 1}. `));
    appendBlanked(prompt, question.prompt);
    item.appendChild(prompt);

    item.appendChild(
      el(
        "p",
        `review-item__answer review-item__answer--${question.correct ? "correct" : "incorrect"}`,
        `Cevabın: ${question.selectedAnswer ?? "—"}`
      )
    );

    if (!question.correct) {
      item.appendChild(
        el("p", "review-item__answer review-item__answer--correct", `Doğru cevap: ${question.correctAnswer}`)
      );
    }

    item.appendChild(el("p", "review-item__explanation", question.explanation));

    if (question.tip) {
      const tip = el("p", "review-item__tip");
      tip.appendChild(el("strong", null, "Kural: "));
      tip.appendChild(document.createTextNode(question.tip));
      item.appendChild(tip);
    }

    section.appendChild(item);
  });

  return section;
}

function renderBottomBarActions() {
  clear(bottomBarInner);

  const homeLink = el("a", "btn btn--secondary", "Ana Sayfa");
  homeLink.href = "index.html";
  bottomBarInner.appendChild(homeLink);

  // Draws a fresh random set from the same selection rather than
  // replaying the identical questions, hence "Yeni Test".
  const retryBtn = el("button", "btn", "Yeni Test");
  retryBtn.type = "button";
  retryBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
  bottomBarInner.appendChild(retryBtn);

  bottomBar.hidden = false;
}

async function init() {
  const result = getQuizResult();
  if (!result) {
    showMessage("Henüz gösterilecek bir sonuç yok. Ana sayfadan bir test başlat.");
    return;
  }

  // Guarded so reloading the results screen doesn't record the same
  // attempt twice and inflate the history.
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

  let titleById = new Map();
  let lessonIdByCategory = new Map();
  try {
    const manifest = await loadManifest();
    titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
    const lessons = await loadLessonsForTopics(manifest.topics.filter((topic) => !topic.comingSoon));
    lessonIdByCategory = new Map(lessons.map((lesson) => [lesson.category, lesson.id]));
  } catch (error) {
    // The score itself came through the session handoff, so a failed
    // content load costs the topic titles and lesson links, not the page.
    console.error(error);
  }

  clear(container);
  container.appendChild(renderScoreSummary(result));

  const weakCallout = renderWeakTopicsCallout(titleById);
  if (weakCallout) {
    container.appendChild(weakCallout);
  }

  const topicBreakdown = renderBreakdown(
    "Konuya Göre Dağılım",
    result.topicBreakdown,
    (topicId) => titleById.get(topicId) ?? result.topicTitles?.[topicId] ?? topicId
  );
  if (topicBreakdown) {
    container.appendChild(topicBreakdown);
  }

  if (result.categoryBreakdown) {
    const categoryBreakdown = renderBreakdown(
      "Kategoriye Göre Dağılım",
      result.categoryBreakdown,
      (category) => category,
      (category) => lessonIdByCategory.get(category) ?? null
    );
    if (categoryBreakdown) {
      container.appendChild(categoryBreakdown);
    }
  }

  container.appendChild(renderReview(result));
  renderBottomBarActions();
}

init();
