// Profil tab — the home for anything about *you* rather than about a
// particular test result: an optional display name, how much you've done
// overall, and where you're weakest. Everything is read from the same
// local storage the rest of the app writes to; there is no login and no
// server, and "Geçmişi Sıfırla" only ever clears this browser's data.
//
// The weak-category list is deliberately actionable rather than a
// read-out: each category the learner is struggling with links straight
// to the Eğitim lesson that teaches it, which is the whole point of
// lessons and questions sharing one category taxonomy.

import { loadManifest, loadLessonsForTopics } from "./topics.js";
import {
  getProfileName,
  setProfileName,
  getOverallStats,
  getWeakTopics,
  getWeakCategories,
  countCompletedLessons,
  clearHistory,
  clearLessonProgress,
} from "./storage.js";
import { createConfirmModal } from "./modal.js";
import { el, clear } from "./dom.js";

const container = document.getElementById("profile-container");
let resetModal;
let initialized = false;

function formatPercent(value) {
  return value === null ? "—" : `%${Math.round(value * 100)}`;
}

function renderNameField() {
  const section = el("section", "panel");
  const heading = el("h2", null, "İsmin");
  heading.id = "profile-name-label";
  section.appendChild(heading);
  section.appendChild(
    el("p", "hero__description", "İsteğe bağlı — sadece bu cihazda saklanır, hiçbir yere gönderilmez.")
  );

  const input = document.createElement("input");
  input.type = "text";
  input.className = "text-input";
  input.placeholder = "İsmini yaz (isteğe bağlı)";
  input.value = getProfileName();
  input.maxLength = 40;
  input.autocomplete = "off";
  input.setAttribute("aria-labelledby", "profile-name-label");
  input.addEventListener("change", () => setProfileName(input.value.trim()));
  section.appendChild(input);

  return section;
}

function statTile(value, label) {
  const tile = el("div", "stat-tile");
  tile.appendChild(el("div", "stat-tile__value", value));
  tile.appendChild(el("div", "stat-tile__label", label));
  return tile;
}

function renderStats(stats, lessonsDone, lessonsTotal) {
  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Genel Durum"));

  const grid = el("div", "stat-grid");
  grid.appendChild(statTile(lessonsTotal ? `${lessonsDone}/${lessonsTotal}` : "—", "Tamamlanan ders"));
  grid.appendChild(statTile(String(stats.testsCompleted), "Tamamlanan test"));
  grid.appendChild(statTile(String(stats.totalQuestions), "Çözülen soru"));
  grid.appendChild(statTile(formatPercent(stats.accuracy), "Genel doğruluk"));
  section.appendChild(grid);

  if (stats.testsCompleted === 0 && lessonsDone === 0) {
    section.appendChild(
      el("p", "empty-state", "Henüz başlamadın — bir ders okuyunca ya da test çözünce burası dolacak.")
    );
  }

  return section;
}

function renderWeakTopics(entries, titleById) {
  if (entries.length === 0) {
    return null;
  }

  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Zayıf Olduğun Konular"));

  const list = el("ul", "breakdown-list");
  for (const entry of entries) {
    const item = document.createElement("li");
    const name = el("span", null, titleById.get(entry.topicId) ?? entry.topicId);
    name.lang = "en";
    item.appendChild(name);
    item.appendChild(el("span", null, `${entry.correct}/${entry.total}`));
    list.appendChild(item);
  }
  section.appendChild(list);

  return section;
}

function renderWeakCategories(entries, lessonIdByCategory) {
  if (entries.length === 0) {
    return null;
  }

  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Zayıf Olduğun Kategoriler"));
  section.appendChild(
    el("p", "hero__description", "Dersi olan bir kategoriye dokununca doğrudan o dersi açar.")
  );

  const list = el("ul", "breakdown-list");
  for (const entry of entries) {
    const item = document.createElement("li");
    const lessonId = lessonIdByCategory.get(entry.category);
    const score = `${entry.correct}/${entry.total}`;

    if (lessonId) {
      const link = el("a", "breakdown-link");
      link.href = `#egitim/${lessonId}`;
      const name = el("span", null, entry.category);
      name.lang = "en";
      link.appendChild(name);
      link.appendChild(el("span", "breakdown-link__score", `${score} · Dersi aç →`));
      item.className = "breakdown-list__item--link";
      item.appendChild(link);
    } else {
      const name = el("span", null, entry.category);
      name.lang = "en";
      item.appendChild(name);
      item.appendChild(el("span", null, score));
    }

    list.appendChild(item);
  }
  section.appendChild(list);

  return section;
}

function renderSettings() {
  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Ayarlar"));
  section.appendChild(
    el("p", "hero__description", "Test geçmişini ve ders ilerlemeni bu cihazdan siler.")
  );

  const resetBtn = el("button", "btn btn--danger", "Geçmişi Sıfırla");
  resetBtn.type = "button";
  resetBtn.addEventListener("click", () => resetModal.open());
  section.appendChild(resetBtn);

  return section;
}

async function render() {
  let titleById = new Map();
  let lessons = [];
  try {
    const manifest = await loadManifest();
    const liveTopics = manifest.topics.filter((topic) => !topic.comingSoon);
    titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
    lessons = await loadLessonsForTopics(liveTopics);
  } catch (error) {
    // Stats come from local storage and are still worth showing, so a
    // failed content load degrades the lesson counter and the
    // category-to-lesson links rather than the whole tab.
    console.error(error);
  }

  const lessonIds = lessons.map((lesson) => lesson.id);
  const lessonIdByCategory = new Map(lessons.map((lesson) => [lesson.category, lesson.id]));

  clear(container);
  container.appendChild(renderNameField());
  container.appendChild(
    renderStats(getOverallStats(), countCompletedLessons(lessonIds), lessonIds.length)
  );

  const weakTopics = renderWeakTopics(getWeakTopics(), titleById);
  if (weakTopics) {
    container.appendChild(weakTopics);
  }

  const weakCategories = renderWeakCategories(getWeakCategories(), lessonIdByCategory);
  if (weakCategories) {
    container.appendChild(weakCategories);
  }

  container.appendChild(renderSettings());
}

export async function initProfileTab() {
  if (!initialized) {
    initialized = true;
    resetModal = createConfirmModal({
      overlayId: "confirm-modal",
      confirmId: "confirm-modal-confirm",
      cancelId: "confirm-modal-cancel",
      onConfirm: () => {
        clearHistory();
        clearLessonProgress();
        render();
      },
    });
  }
  await render();
}
