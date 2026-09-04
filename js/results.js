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

import { loadManifest, lessonIndex } from "./topics.js";
import { getQuizResult, setQuizResult } from "./session-state.js";
import { recordAttempt, markTopicSeen, MIN_ITEMS_FOR_WEAK_ENTRY } from "./storage.js";
import { el, clear, appendInline } from "./dom.js";
import { icon } from "./icons.js";
import { announce, createActionBar } from "./shell.js";
import { renderPrompt } from "./prompt.js";

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

  // Ten questions spread over six categories is one or two each, and a
  // list sorted worst-first on one item reads as a finding. Drop the
  // claim, not the data: the rows stay, because a learner is entitled to
  // see their own test broken down. Same hedge, same threshold and the
  // same reasoning as the weak-spot list in Profil.
  const most = Math.max(...keys.map((key) => breakdown[key].total));
  if (most < MIN_ITEMS_FOR_WEAK_ENTRY) {
    section.appendChild(
      el(
        "p",
        "t-meta",
        "Bu testte her başlıktan bir-iki soru çıktı; bu bir sıralama, bir sonuç değil."
      )
    );
  }

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

    item.appendChild(renderPrompt(question, { lead: false }));

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

  let titleById = new Map();
  let versionById = new Map();
  let lessonIdByCategory = new Map();
  try {
    const manifest = await loadManifest();
    titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
    versionById = new Map(manifest.topics.map((topic) => [topic.id, topic.contentVersion]));
    // The results screen links a wrong answer to the lesson that teaches
    // it, which needs the mapping and not the lessons themselves.
    lessonIdByCategory = new Map(lessonIndex(manifest).map((lesson) => [lesson.category, lesson.id]));
  } catch (error) {
    // The score itself came through the session handoff, so a failed
    // content load costs the topic titles and the lesson links, not the
    // page — and the seen-version baseline simply waits for the next
    // test, which is the safe direction to fail in: a badge shown twice
    // beats a badge burned for content nobody saw.
    console.error(error);
  }

  // Guarded so reloading the results screen doesn't record the same
  // attempt twice and inflate the history.
  if (!result.recorded) {
    // The seen-version baseline is set here, not at launch, because this
    // is the first moment it is true. Marking a topic seen when a mixed
    // test *starts* burns the "Yeni" badge on every topic in the app for
    // questions the learner may never be shown — one tap, permanently.
    // `topicBreakdown` names exactly the topics they actually met.
    Object.keys(result.topicBreakdown).forEach((topicId) => {
      const version = versionById.get(topicId);
      if (typeof version === "number") {
        markTopicSeen(topicId, version);
      }
    });

    recordAttempt({
      date: result.date,
      mode: result.mode,
      topicBreakdown: result.topicBreakdown,
      categoryBreakdown: result.categoryBreakdown,
      // The category travels with the answer. Without it, working out
      // which grammar point a learner is weak at would mean guessing the
      // group from the question id, and the id only encodes the topic.
      questions: result.questionResults.map((question) => ({
        id: question.id,
        topicId: question.topicId,
        category: question.category,
        correct: question.correct,
      })),
    });
    result.recorded = true;
    setQuizResult(result);
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
