// The results screen.
//
// A score is only worth showing if it tells the learner what to do next,
// so the hierarchy is: the figure, then where it went wrong, then — the
// part that actually teaches — a link from each weak category straight to
// the lesson that covers it. That link is the whole reason lessons and
// questions share one category taxonomy.
//
// The review at the bottom is every question again with its explanation.
// It is long by nature, so it comes last and is separated by rules rather
// than boxed: eight cards in a column is the box-in-box failure with extra
// steps.

import { loadManifest, loadLessonsForTopics } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt } from "./storage.js";
import { el, clear, appendInline, appendBlanked } from "./dom.js";
import { icon } from "./icons.js";
import { announce, createActionBar } from "./shell.js";

const container = document.getElementById("results-container");
const actionBar = createActionBar("results-bar");

function formatPercent(correct, total) {
  return total === 0 ? "%0" : `%${Math.round((correct / total) * 100)}`;
}

function showMessage(text) {
  clear(container);
  container.appendChild(el("p", "t-meta", text));
  actionBar.set([{ label: "Ana sayfa", level: "primary", href: "index.html" }]);
}

function renderScore(result) {
  const block = el("section", "stack stack--tight");
  block.appendChild(el("p", "t-label", "Sonuç"));

  const figure = el("p", "t-display t-num", `${result.correctCount} / ${result.totalCount}`);
  block.appendChild(figure);

  const track = el("div", "progress");
  const fill = el("div", "progress__fill");
  fill.style.width = `${result.totalCount === 0 ? 0 : (result.correctCount / result.totalCount) * 100}%`;
  track.appendChild(fill);
  block.appendChild(track);

  block.appendChild(
    el("p", "t-meta t-num", `${formatPercent(result.correctCount, result.totalCount)} doğru`)
  );
  return block;
}

/**
 * @param {string} heading
 * @param {Record<string, {correct: number, total: number}>} breakdown
 * @param {(key: string) => string} resolveName
 * @param {(key: string) => string|null} [resolveLessonId] - when a row maps
 *   to a lesson, the row becomes a link into the Eğitim tab
 */
function renderBreakdown(heading, breakdown, resolveName, resolveLessonId) {
  const keys = Object.keys(breakdown);
  // A one-row breakdown just restates the score above it.
  if (keys.length <= 1) {
    return null;
  }

  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", heading));

  // Worst first. A breakdown in whatever order the questions happened to
  // come out is a table; in this order it is a reading list.
  const ranked = [...keys].sort(
    (a, b) =>
      breakdown[a].correct / breakdown[a].total - breakdown[b].correct / breakdown[b].total
  );

  const list = el("div");
  for (const key of ranked) {
    const stats = breakdown[key];
    const lessonId = resolveLessonId?.(key) ?? null;
    const row = el(lessonId ? "a" : "div", "row");
    if (lessonId) {
      row.href = `index.html#egitim/${lessonId}`;
    }

    // No "Dersi aç" line under every row: seven identical secondary lines
    // say nothing the chevron does not already say.
    const main = el("span", "row__main");
    const name = el("span", "row__title t-en", resolveName(key));
    name.lang = "en";
    main.appendChild(name);
    row.appendChild(main);

    const trail = el("span", "row__trail t-num", `${stats.correct}/${stats.total}`);
    if (lessonId) {
      trail.appendChild(icon("chevron-right", { size: 20 }));
    }
    row.appendChild(trail);

    list.appendChild(row);
  }
  section.appendChild(list);

  return section;
}

function renderReview(result) {
  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "İnceleme"));

  const list = el("div", "stack stack--loose");
  result.questionResults.forEach((question, index) => {
    const item = el("article", "stack stack--tight");
    if (index > 0) {
      item.appendChild(el("span", "divider"));
    }

    const verdict = el("p", "cluster");
    const mark = el("span", question.correct ? "ink-ok" : "ink-no");
    mark.appendChild(icon(question.correct ? "check" : "close", { size: 20 }));
    verdict.appendChild(mark);
    verdict.appendChild(el("span", "t-meta t-num", `Soru ${index + 1}`));
    item.appendChild(verdict);

    const prompt = el("p", "t-body t-en");
    prompt.lang = "en";
    appendBlanked(prompt, question.prompt);
    item.appendChild(prompt);

    const answers = el("p", "t-meta");
    answers.appendChild(document.createTextNode("Cevabın: "));
    const given = el("span", "t-en", question.selectedAnswer ?? "—");
    given.lang = "en";
    answers.appendChild(given);
    if (!question.correct) {
      answers.appendChild(document.createTextNode(" · Doğrusu: "));
      const right = el("span", "t-en", question.correctAnswer);
      right.lang = "en";
      answers.appendChild(right);
    }
    item.appendChild(answers);

    const explanation = el("p", "t-meta");
    appendInline(explanation, question.explanation);
    item.appendChild(explanation);

    if (question.tip) {
      const tip = el("p", "t-meta");
      tip.appendChild(el("strong", null, "Kural: "));
      appendInline(tip, question.tip);
      item.appendChild(tip);
    }

    list.appendChild(item);
  });
  section.appendChild(list);

  return section;
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
    // content load costs the topic titles and the lesson links, not the
    // page.
    console.error(error);
  }

  clear(container);
  container.appendChild(renderScore(result));
  announce(
    `Test bitti. ${result.totalCount} sorudan ${result.correctCount} doğru.`
  );

  const topicBreakdown = renderBreakdown(
    "Konuya göre",
    result.topicBreakdown,
    (topicId) => titleById.get(topicId) ?? result.topicTitles?.[topicId] ?? topicId
  );
  if (topicBreakdown) {
    container.appendChild(topicBreakdown);
  }

  if (result.categoryBreakdown) {
    const categoryBreakdown = renderBreakdown(
      "Kategoriye göre",
      result.categoryBreakdown,
      (category) => category,
      (category) => lessonIdByCategory.get(category) ?? null
    );
    if (categoryBreakdown) {
      container.appendChild(categoryBreakdown);
    }
  }

  container.appendChild(renderReview(result));

  actionBar.set([
    { label: "Ana sayfa", level: "secondary", href: "index.html" },
    // Draws a fresh random set from the same selection rather than
    // replaying the identical questions, hence "Yeni test".
    { label: "Yeni test", level: "primary", icon: "refresh", href: "quiz.html" },
  ]);
}

init();
