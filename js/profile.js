// Profil tab: a real, visible local profile — optional display name,
// overall practice stats, and weak-spot summaries (by topic and by
// grammar category), all read from the same local history storage.js
// already keeps. No login, no server: everything here lives in this
// browser only, and "Reset" only ever clears this browser's data.

import { loadManifest } from "./topics.js";
import {
  getProfileName,
  setProfileName,
  getOverallStats,
  getWeakTopics,
  getWeakCategories,
  clearHistory,
} from "./storage.js";
import { createConfirmModal } from "./modal.js";
import { setQuizRequest } from "./session-state.js";

const container = document.getElementById("profile-container");
let resetModal;
let initialized = false;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatPercent(value) {
  return value === null ? "—" : `%${Math.round(value * 100)}`;
}

function renderNameField() {
  const section = el("section", "panel");
  section.appendChild(el("h2", null, "İsmin"));
  section.appendChild(el("p", "hero__description", "İsteğe bağlı — sadece bu cihazda, sadece sana görünür."));

  const input = document.createElement("input");
  input.type = "text";
  input.className = "text-input";
  input.placeholder = "İsmini yaz (isteğe bağlı)";
  input.value = getProfileName();
  input.maxLength = 40;
  input.addEventListener("change", () => {
    setProfileName(input.value.trim());
    window.dispatchEvent(new CustomEvent("englishprep:profilenamechanged"));
  });
  section.appendChild(input);

  return section;
}

function renderStats(stats) {
  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Genel İstatistikler"));

  const grid = el("div", "stat-grid");

  const tests = el("div", "stat-tile");
  tests.appendChild(el("div", "stat-tile__value", String(stats.testsCompleted)));
  tests.appendChild(el("div", "stat-tile__label", "Tamamlanan test"));
  grid.appendChild(tests);

  const questions = el("div", "stat-tile");
  questions.appendChild(el("div", "stat-tile__value", String(stats.totalQuestions)));
  questions.appendChild(el("div", "stat-tile__label", "Çözülen soru"));
  grid.appendChild(questions);

  const accuracy = el("div", "stat-tile");
  accuracy.appendChild(el("div", "stat-tile__value", formatPercent(stats.accuracy)));
  accuracy.appendChild(el("div", "stat-tile__label", "Genel doğruluk"));
  grid.appendChild(accuracy);

  section.appendChild(grid);

  if (stats.testsCompleted === 0) {
    section.appendChild(el("p", "empty-state", "Henüz test çözmedin — bir test tamamlayınca burada görünecek."));
  }

  return section;
}

// Entries arrive sorted weakest-first (lowest accuracy first) — the rank
// number makes that order visible instead of implicit, since without it
// the list reads as an arbitrary ordering rather than "worst to best".
// `buildAction`, when given, appends a trailing button per entry (used by
// the category list's "Pratik Yap" — weak topics already have a start
// button on their home-page card, so they don't need a second one here).
function renderWeakList(heading, entries, resolveName, buildAction) {
  if (entries.length === 0) {
    return null;
  }

  const section = el("section", "panel");
  section.appendChild(el("h2", null, heading));

  const list = el("ul", "breakdown-list");
  entries.forEach((entry, index) => {
    const item = document.createElement("li");
    const info = el("div", "breakdown-list__info");
    info.appendChild(el("span", null, `${index + 1}. ${resolveName(entry)}`));
    info.appendChild(el("span", "breakdown-list__score", `${entry.correct}/${entry.total}`));
    item.appendChild(info);
    if (buildAction) {
      item.appendChild(buildAction(entry));
    }
    list.appendChild(item);
  });
  section.appendChild(list);

  return section;
}

function startCategoryPractice(category, allTopicIds) {
  setQuizRequest({ mode: "topic", topicIds: allTopicIds, category, count: "all" });
  window.location.href = "quiz.html";
}

function renderSettings() {
  const section = el("section", "panel");
  section.appendChild(el("h2", null, "Ayarlar"));

  const resetBtn = el("button", "btn btn--danger", "Geçmişi Sıfırla");
  resetBtn.type = "button";
  resetBtn.addEventListener("click", () => resetModal.open());
  section.appendChild(resetBtn);

  return section;
}

async function render() {
  container.innerHTML = "";

  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));

  container.appendChild(renderNameField());
  container.appendChild(renderStats(getOverallStats()));

  const weakTopics = renderWeakList("Zayıf Olduğun Konular", getWeakTopics(), (entry) =>
    titleById.get(entry.topicId) ?? entry.topicId
  );
  if (weakTopics) {
    container.appendChild(weakTopics);
  }

  const allTopicIds = manifest.topics.filter((topic) => !topic.comingSoon).map((topic) => topic.id);
  const weakCategories = renderWeakList(
    "Zayıf Olduğun Kategoriler",
    getWeakCategories(),
    (entry) => entry.category,
    (entry) => {
      const btn = el("button", "btn btn--secondary btn--sm", "Pratik Yap");
      btn.type = "button";
      btn.addEventListener("click", () => startCategoryPractice(entry.category, allTopicIds));
      return btn;
    }
  );
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
        render();
      },
    });
  }
  await render();
}
