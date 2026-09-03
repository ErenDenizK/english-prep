// Profil — everything about *you* rather than about a particular test: an
// optional display name, how much you have done overall, and where you are
// weakest. Everything is read from the same local storage the rest of the
// app writes to; there is no login and no server, and "Geçmişi sıfırla"
// only ever clears this browser's data.
//
// The weak lists here lead into the *lessons*, because that is what this
// screen is for: understanding where you stand and what to study. The same
// lists on the Test tab start practice instead. One row, one action, and
// which action it is follows from which screen you are on.

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
import { downloadBackup, createRestoreDialog, describeRestore } from "./backup-ui.js";
import { el, clear } from "./dom.js";
import { icon } from "./icons.js";
import { announce } from "./shell.js";

const container = document.getElementById("profile-container");
let resetModal;
let restoreDialog;
let initialized = false;

function formatPercent(value) {
  return value === null ? "—" : `%${Math.round(value * 100)}`;
}

function renderNameField() {
  const surface = el("section", "surface stack stack--tight");

  const heading = el("h2", "t-label", "İsmin");
  heading.id = "profile-name-label";
  surface.appendChild(heading);
  surface.appendChild(
    el("p", "t-meta", "İsteğe bağlı — sadece bu cihazda saklanır, hiçbir yere gönderilmez.")
  );

  const input = document.createElement("input");
  input.type = "text";
  input.className = "field";
  input.placeholder = "İsmini yaz";
  input.value = getProfileName();
  input.maxLength = 40;
  input.autocomplete = "off";
  input.setAttribute("aria-labelledby", "profile-name-label");
  input.addEventListener("change", () => {
    setProfileName(input.value.trim());
    // The header shows the learner's initial; tell it to catch up without
    // the two modules having to import each other.
    document.dispatchEvent(new CustomEvent("profile:namechange"));
  });
  surface.appendChild(input);

  return surface;
}

function stat(value, label) {
  const cell = el("div");
  cell.appendChild(el("div", "stat__value", value));
  cell.appendChild(el("div", "stat__label", label));
  return cell;
}

function renderStats(stats, lessonsDone, lessonsTotal) {
  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "Genel durum"));

  const grid = el("div", "stats");
  grid.appendChild(stat(lessonsTotal ? `${lessonsDone}/${lessonsTotal}` : "—", "Tamamlanan ders"));
  grid.appendChild(stat(String(stats.testsCompleted), "Çözülen test"));
  grid.appendChild(stat(String(stats.totalQuestions), "Çözülen soru"));
  // The label says which question the number answers. Three lifetime
  // counters beside one recent average would otherwise read as four of the
  // same kind of thing, and the learner would take the average for a
  // lifetime one — which is the reading that makes it discouraging.
  grid.appendChild(
    stat(
      formatPercent(stats.accuracy),
      stats.accuracyWindow > 0 ? `Son ${stats.accuracyWindow} soruda` : "Doğruluk"
    )
  );
  section.appendChild(grid);

  if (stats.testsCompleted === 0 && lessonsDone === 0) {
    section.appendChild(
      el("p", "t-meta", "Henüz başlamadın — bir ders okuyunca ya da test çözünce burası dolacak.")
    );
  }

  return section;
}

/**
 * @param {string} heading
 * @param {string} hint
 * @param {Array<{name: string, score: string, lessonId?: string|null}>} rows
 */
function renderWeakList(heading, hint, rows) {
  if (rows.length === 0) {
    return null;
  }

  const section = el("section", "stack stack--tight");
  const head = el("div", "stack stack--tight");
  head.appendChild(el("h2", "t-label", heading));
  head.appendChild(el("p", "t-meta", hint));
  section.appendChild(head);

  const list = el("div");
  rows.forEach((entry, index) => {
    const row = el(entry.lessonId ? "a" : "div", "row");
    if (entry.lessonId) {
      row.href = `#egitim/${entry.lessonId}`;
    }

    // Entries arrive sorted weakest-first; the rank makes that visible
    // instead of leaving it to be inferred from the scores.
    row.appendChild(el("span", "row__lead t-num t-meta", String(index + 1)));

    const main = el("span", "row__main");
    const name = el("span", "row__title t-en", entry.name);
    name.lang = "en";
    main.appendChild(name);
    if (entry.lessonId) {
      main.appendChild(el("span", "row__sub", "Dersi aç"));
    }
    row.appendChild(main);

    const trail = el("span", "row__trail t-num", entry.score);
    if (entry.lessonId) {
      trail.appendChild(icon("chevron-right", { size: 20 }));
    }
    row.appendChild(trail);

    list.appendChild(row);
  });
  section.appendChild(list);

  return section;
}

/**
 * The one part of Profil that is not a read-out.
 *
 * Everything the app knows about a learner lives in this browser and can
 * be deleted by it without asking — WebKit clears script-written storage
 * after seven days of browser use without an interaction on the origin.
 * That is not a rare edge case for a study app used a few times a week
 * before an exam; it is the normal case. So the app says so plainly, and
 * gives them the file.
 */
function renderData() {
  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "Verilerin"));
  section.appendChild(
    el(
      "p",
      "t-meta",
      "İlerlemen sadece bu tarayıcıda saklanıyor — bir hesap yok, hiçbir yere " +
        "gönderilmiyor. Telefon değiştirirsen ya da tarayıcı verini silerse kaybolur. " +
        "Ara sıra yedek al; başka bir cihaza da böyle taşırsın."
    )
  );

  const status = el("p", "t-meta");
  status.setAttribute("role", "status");

  const backup = el("button", "btn btn--secondary", "Yedek al");
  backup.type = "button";
  backup.addEventListener("click", () => {
    downloadBackup()
      .then((how) => {
        status.textContent =
          how === "shared" ? "Yedek paylaşıma hazırlandı." : "Yedek dosyan indirildi.";
      })
      .catch((error) => {
        console.error(error);
        status.textContent = "Yedek alınamadı. Tarayıcıyı yenileyip tekrar dene.";
      });
  });
  section.appendChild(backup);

  const restore = el("button", "btn btn--secondary", "Yedekten geri yükle");
  restore.type = "button";
  restore.addEventListener("click", () => restoreDialog.open());
  section.appendChild(restore);

  section.appendChild(status);
  return section;
}

function renderSettings() {
  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "Ayarlar"));
  section.appendChild(el("p", "t-meta", "Test geçmişini ve ders ilerlemeni bu cihazdan siler."));

  const reset = el("button", "btn btn--secondary", "Geçmişi sıfırla");
  reset.type = "button";
  reset.addEventListener("click", () => resetModal.open());
  section.appendChild(reset);

  return section;
}

async function render() {
  let titleById = new Map();
  let lessons = [];
  try {
    const manifest = await loadManifest();
    titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
    lessons = await loadLessonsForTopics(manifest.topics.filter((topic) => !topic.comingSoon));
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

  const weakCategories = getWeakCategories();
  const weakCategoryList = renderWeakList(
    "En çok zorlandığın kategoriler",
    weakCategories.some((entry) => entry.confident)
      ? "Dokunduğunda o kategoriyi anlatan ders açılır."
      : "Şimdilik az veriyle sıralandı. Dokunduğunda o kategoriyi anlatan ders açılır.",
    weakCategories.map((entry) => ({
      name: entry.category,
      score: `${entry.correct}/${entry.total}`,
      lessonId: lessonIdByCategory.get(entry.category) ?? null,
    }))
  );
  if (weakCategoryList) {
    container.appendChild(weakCategoryList);
  }

  const weakTopics = renderWeakList(
    "En çok zorlandığın konular",
    // "Şu an" is doing real work: the score is the most recent answer to
    // each distinct question, so it moves as soon as the learner does.
    "Her sorunun en son cevabına göre, şu an en çok yanıldığından başlayarak.",
    getWeakTopics().map((entry) => ({
      name: titleById.get(entry.topicId) ?? entry.topicId,
      score: `${entry.correct}/${entry.total}`,
    }))
  );
  if (weakTopics) {
    container.appendChild(weakTopics);
  }

  container.appendChild(renderData());
  container.appendChild(renderSettings());
}

export async function initProfileTab() {
  if (!initialized) {
    initialized = true;
    restoreDialog = createRestoreDialog({
      onRestored: (summary) => {
        const said = describeRestore(summary);
        announce(said);
        render().then(() => {
          const status = container.querySelector('[role="status"]');
          if (status) {
            status.textContent = said;
          }
        });
      },
    });
    resetModal = createConfirmModal({
      dialogId: "confirm-dialog",
      confirmId: "confirm-dialog-confirm",
      cancelId: "confirm-dialog-cancel",
      onConfirm: () => {
        clearHistory();
        clearLessonProgress();
        render();
      },
    });
  }
  await render();
}
