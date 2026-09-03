// Profil tab: a real, visible local profile — optional display name,
// overall practice stats, and weak-spot summaries (by topic and by
// grammar category), all read from the same local history storage.js
// already keeps. No login, no server: everything here lives in this
// browser only, and "Reset" only ever clears this browser's data.
//
// Each block is a section (heading + space), not a bordered panel — see
// docs/design-system.md rule 2. The old panels wrapped stat tiles and
// list rows in a second box, which was the worst of the nesting.

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
import { navigateTo } from "./navigate.js";

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

function section(heading) {
  const node = el("section", "section");
  if (heading) {
    node.appendChild(el("h2", "section-heading", heading));
  }
  return node;
}

function renderNameField() {
  const wrap = section("İsmin");
  wrap.appendChild(el("p", "muted", "İsteğe bağlı — sadece bu cihazda, sadece sana görünür."));

  const input = document.createElement("input");
  input.type = "text";
  input.className = "text-input";
  input.placeholder = "İsmini yaz";
  input.value = getProfileName();
  input.maxLength = 40;
  input.addEventListener("change", () => {
    setProfileName(input.value.trim());
    window.dispatchEvent(new CustomEvent("englishprep:profilenamechanged"));
  });
  wrap.appendChild(input);

  return wrap;
}

function renderStats(stats) {
  const wrap = section("Genel istatistikler");

  // With nothing recorded yet, three zeroes say less than one sentence
  // and an obvious next step — so show that instead of empty tiles.
  if (stats.testsCompleted === 0) {
    const empty = el("div", "empty-state");
    empty.appendChild(document.createTextNode("Henüz test çözmedin. İlk testini bitirince istatistiklerin burada birikir."));
    wrap.appendChild(empty);
    return wrap;
  }

  const grid = el("div", "stat-grid");
  const tiles = [
    { value: String(stats.testsCompleted), label: "Tamamlanan test" },
    { value: String(stats.totalQuestions), label: "Çözülen soru" },
    { value: formatPercent(stats.accuracy), label: "Genel doğruluk" },
  ];
  tiles.forEach(({ value, label }) => {
    const tile = el("div", "stat-tile");
    tile.appendChild(el("div", "stat-tile__value", value));
    tile.appendChild(el("div", "stat-tile__label", label));
    grid.appendChild(tile);
  });
  wrap.appendChild(grid);

  return wrap;
}

// Entries arrive sorted weakest-first. The rank number makes that order
// visible instead of implicit — without it the list reads as arbitrary.
// `buildAction`, when given, appends a trailing button per entry (used by
// the category list's "Pratik Yap"; weak topics already have their own
// start control on the Test screen, so they don't need a second one).
function renderWeakList(heading, entries, resolveName, buildAction) {
  if (entries.length === 0) {
    return null;
  }

  const wrap = section(heading);

  const list = el("ul", "breakdown-list");
  entries.forEach((entry, index) => {
    const item = document.createElement("li");
    const info = el("div", "breakdown-list__info");
    const name = el("span", null, `${index + 1}. ${resolveName(entry)}`);
    name.lang = "en";
    info.appendChild(name);
    info.appendChild(el("span", "breakdown-list__score", `${entry.correct}/${entry.total}`));
    item.appendChild(info);
    if (buildAction) {
      item.appendChild(buildAction(entry));
    }
    list.appendChild(item);
  });
  wrap.appendChild(list);

  return wrap;
}

function startCategoryPractice(category, allTopicIds) {
  setQuizRequest({ mode: "topic", topicIds: allTopicIds, category, count: "all" });
  navigateTo("quiz.html");
}

function renderSettings() {
  const wrap = section("Ayarlar");

  const resetBtn = el("button", "btn btn--danger btn--sm", "Geçmişi Sıfırla");
  resetBtn.type = "button";
  resetBtn.addEventListener("click", () => resetModal.open());
  wrap.appendChild(resetBtn);

  return wrap;
}

async function render() {
  container.innerHTML = "";

  const manifest = await loadManifest();
  const titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));

  container.appendChild(renderNameField());
  container.appendChild(renderStats(getOverallStats()));

  const weakTopics = renderWeakList("Zayıf olduğun konular", getWeakTopics(), (entry) =>
    titleById.get(entry.topicId) ?? entry.topicId
  );
  if (weakTopics) {
    container.appendChild(weakTopics);
  }

  const allTopicIds = manifest.topics.filter((topic) => !topic.comingSoon).map((topic) => topic.id);
  const weakCategories = renderWeakList(
    "Zayıf olduğun kategoriler",
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
