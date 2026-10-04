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

import {
  loadManifest,
  lessonIndex,
  uncoveredSections,
  sectionListPhrase,
  clozeCoverage,
} from "./topics.js";
import {
  getProfileName,
  setProfileName,
  getOverallStats,
  getWeakTopics,
  getWeakCategories,
  countCompletedLessons,
  clearHistory,
  clearLessonProgress,
  getSetting,
  setSetting,
  setOnboarded,
} from "./storage.js";
import { SETTINGS } from "./config.js";
import { createConfirmModal } from "./modal.js";
import { createListbox } from "./listbox.js";
import { getTheme, setTheme, THEME_LABELS } from "./theme.js";
import { createBackupDialog, createRestoreDialog, describeRestore } from "./backup-ui.js";
import { el, clear, pane } from "./dom.js";
import { icon } from "./icons.js";
import { avatar } from "./widgets.js";
import { progressMetric } from "./progress.js";
import { createMotionControl } from "./motion.js";
import { animateElement, animateArrival, cancelAnimationsWithin, whenVisible } from "./interactions.js";
import { announce } from "./shell.js";
import { createInstallControl } from "./install.js";

const container = document.getElementById("profile-container");
let resetModal;
let restoreDialog;
let backupDialog;
let initialized = false;
let renderVersion = 0;

// Saving a field refreshes the profile's derived figures. Capture focus
// after the browser has finished a native change/Tab event so the next
// field, rather than the one just left, keeps the keyboard position.
function captureFocus() {
  const active = document.activeElement;
  if (!container.contains(active)) return null;
  const key = active.id
    ? { id: active.id }
    : active.dataset.value
      ? { value: active.dataset.value, group: active.closest("[aria-labelledby]")?.getAttribute("aria-labelledby") }
      : { label: active.getAttribute("aria-labelledby")?.split(" ")[0], text: active.textContent, role: active.getAttribute("role"), tag: active.tagName };
  return {
    key,
    value: active instanceof HTMLInputElement ? active.value : null,
    start: active instanceof HTMLInputElement ? active.selectionStart : null,
    end: active instanceof HTMLInputElement ? active.selectionEnd : null,
    direction: active instanceof HTMLInputElement ? active.selectionDirection : null,
    scrollTop: document.getElementById("shell-scroll").scrollTop,
  };
}

function restoreFocus(saved) {
  if (!saved) return;
  const { key } = saved;
  const control = [...container.querySelectorAll("input, button, a, [tabindex]")].find((node) => {
    if (key.id) return node.id === key.id;
    if (key.value) return node.dataset.value === key.value && node.closest("[aria-labelledby]")?.getAttribute("aria-labelledby") === key.group;
    return node.tagName === key.tag && node.getAttribute("role") === key.role &&
      (key.label ? node.getAttribute("aria-labelledby")?.split(" ")[0] === key.label : node.textContent === key.text);
  });
  if (!control) return;
  if (saved.value !== null && control instanceof HTMLInputElement) {
    control.value = saved.value;
    if (saved.start !== null) control.setSelectionRange(saved.start, saved.end, saved.direction);
  }
  control.focus({ preventScroll: true });
  document.getElementById("shell-scroll").scrollTop = saved.scrollTop;
}

function formatPercent(value) {
  return value === null ? "—" : `%${Math.round(value * 100)}`;
}

function renderIdentity() {
  const surface = el("section", "surface hero profile-identity");
  surface.dataset.profilePart = "identity";
  surface.appendChild(el("span", "hero__orb"));

  const head = el("div", "hero__figure");
  const name = getProfileName().trim();
  head.appendChild(avatar(name, { size: "lg" }));
  const titles = el("div", "stack stack--snug");
  titles.appendChild(el("h1", "t-title", name || "Profilin"));
  head.appendChild(titles);
  surface.appendChild(head);

  const label = el("label", "t-label", "İsmin");
  label.htmlFor = "profile-name";
  surface.appendChild(label);
  const input = document.createElement("input");
  input.type = "text";
  input.id = "profile-name";
  input.className = "field";
  input.value = getProfileName();
  input.maxLength = 40;
  input.autocomplete = "off";
  input.placeholder = "İsteğe bağlı";
  input.addEventListener("change", () => {
    const nextName = input.value.trim();
    // Replacing a focused, edited input can emit its pending native change.
    // A value already committed by this handler must not schedule a second
    // full render and detach the field just restored for keyboard input.
    if (nextName === getProfileName()) return;
    setProfileName(nextName);
    // The header shows the learner's initial; tell it to catch up without
    // the two modules having to import each other.
    document.dispatchEvent(new CustomEvent("profile:namechange"));
    render();
  });
  surface.appendChild(input);
  surface.appendChild(el("p", "t-quiet", "Adın bu tarayıcıda saklanır ve aldığın yedeğe dahil edilir."));

  return surface;
}

function stat(value, label) {
  const cell = el("div", "stat");
  cell.appendChild(el("div", "stat__value t-num", value));
  cell.appendChild(el("div", "stat__label", label));
  return cell;
}

function renderStats(stats, lessonsDone, lessonsTotal) {
  const section = el("section", "stack stack--tight");
  section.dataset.profilePart = "stats";
  section.appendChild(el("h2", "t-label", "Genel durum"));

  const metrics = el("div", "profile-metrics");
  const grid = el("div", "stats stats--counts");
  metrics.appendChild(progressMetric({
    label: "Tamamlanan ders",
    value: lessonsTotal ? `${lessonsDone} / ${lessonsTotal}` : "İçerik yüklenemedi",
    ratio: lessonsTotal ? lessonsDone / lessonsTotal : null,
  }));
  metrics.appendChild(progressMetric({
    label: "Son cevaplarında doğruluk",
    value: stats.accuracy === null ? "Henüz test yok" : formatPercent(stats.accuracy),
    ratio: stats.accuracy,
    tone: "confirmed",
    description: stats.accuracyWindow > 0 ? `Son ${stats.accuracyWindow} soru üzerinden.` : "Bir test çözdüğünde burada görünür.",
  }));
  grid.appendChild(stat(String(stats.testsCompleted), "Çözülen test"));
  grid.appendChild(stat(String(stats.totalQuestions), "Çözülen soru"));
  section.appendChild(metrics);
  section.appendChild(grid);

  // What is in the window, when part of it is the mistake book. The
  // number is not filtered — a book run is the learner answering
  // questions, and excluding it would decide a defensible reading for
  // them — but an average that falls because they took the app's advice
  // has to say so, or it quietly argues against the mode the Test tab
  // recommends.
  if (stats.accuracyFromBook > 0) {
    section.appendChild(
      el(
        "p",
        "t-quiet",
        `Bu ortalamanın ${stats.accuracyFromBook} sorusu yanlış defterinden geliyor; ` +
          "defterdekiler zaten en zorlandıkların."
      )
    );
  }

  if (stats.testsCompleted === 0 && lessonsDone === 0) {
    section.appendChild(
      el("p", "t-quiet", "Henüz başlamadın — bir ders okuyunca ya da test çözünce burası dolacak.")
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
  head.appendChild(el("p", "t-quiet", hint));
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
    // No "Dersi aç" under every row: five identical secondary lines say
    // nothing the chevron does not already say.
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
  const section = el("section", "stack stack--tight profile-data");
  section.dataset.profilePart = "data";
  section.appendChild(el("h2", "t-label", "Verilerin"));
  section.appendChild(
    el(
      "p",
      "t-body",
      "İlerlemen bu tarayıcıda saklanır; hesap ve otomatik eşitleme yok. " +
        "Yedeğini kendin paylaşır veya diğer cihazda geri yüklersin. " +
        "Tarayıcı verilerini silmeden ya da cihaz değiştirmeden önce yedek al."
    )
  );
  // Installing is the other half of the same argument — a home-screen app
  // is exempt from WebKit's seven-day eviction — and nothing said it was
  // possible; iOS never prompts.
  section.appendChild(
    el(
      "p",
      "t-quiet",
      "Ana ekrana eklersen uygulama gibi açılır ve tarayıcı verini daha zor " +
        "siler: Safari'de Paylaş → Ana Ekrana Ekle, Chrome'da menüden " +
        "Ana ekrana ekle."
    )
  );

  const status = el("p", "t-meta");
  status.classList.add("profile-transfer-status");
  status.setAttribute("role", "status");

  const backup = el("button", "btn btn--secondary", "Yedek al");
  backup.prepend(icon("archive", { size: 20 }));
  backup.type = "button";
  backup.addEventListener("click", () => backupDialog.open());
  section.appendChild(backup);

  const restore = el("button", "btn btn--secondary", "Yedekten geri yükle");
  restore.type = "button";
  restore.addEventListener("click", () => restoreDialog.open());
  section.appendChild(restore);

  section.appendChild(status);

  const resetArea = el("div", "settings-reset stack stack--tight");
  const reset = el("button", "btn btn--secondary btn--reset", "Geçmişi sıfırla");
  reset.prepend(icon("refresh", { size: 20 }));
  reset.type = "button";
  reset.addEventListener("click", () => resetModal.open());
  resetArea.appendChild(reset);
  resetArea.appendChild(el("p", "t-quiet", "Test geçmişini ve ders ilerlemeni bu cihazdan siler. Önce yedek alabilirsin."));
  section.appendChild(resetArea);
  return section;
}

/**
 * A switch, made out of a Row rather than a new primitive: the whole row
 * is the target, which is what a Row is for, and `role="switch"` with
 * `aria-checked` gives it the semantics without inventing a control.
 */
function toggleRow({ name, title, description }) {
  const row = el("button", "row");
  row.type = "button";
  row.setAttribute("role", "switch");

  const main = el("span", "row__main");
  main.appendChild(el("span", "row__title", title));
  main.appendChild(el("span", "row__sub", description));
  row.appendChild(main);

  const state = el("span", "switch");
  state.appendChild(el("span", "switch__thumb"));
  row.appendChild(el("span", "row__trail")).appendChild(state);

  const paint = () => {
    const on = getSetting(name);
    row.setAttribute("aria-checked", String(on));
  };
  paint();

  row.addEventListener("click", () => {
    setSetting(name, !getSetting(name));
    paint();
  });

  return row;
}

/**
 * Three states, so not a switch.
 *
 * "Follow the phone" is a third thing rather than the off position of a
 * boolean, and the Listbox already owns the whole select-only combobox
 * contract — keyboard, `aria-activedescendant`, type-ahead — so this
 * costs no new primitive and no new promise. A hand-rolled radiogroup
 * would owe roving tabindex and arrow keys before it was honest.
 */
function renderThemeRow() {
  // A Row like the switch beside it, not a section of its own: it was the
  // newest control on the screen, dressed in its own heading and its own
  // paragraph, and it read as a feature rather than a setting. The row's
  // sub says the one thing worth saying; the listbox sits in the trail.
  const row = el("div", "row");
  const main = el("span", "row__main");
  const title = el("span", "row__title", "Görünüm");
  title.id = "profile-theme-label";
  main.appendChild(title);
  const descriptions = {
    dark: "Koyu renk paleti.",
    light: "Açık renk paleti.",
    system: "Cihazının görünümünü izler.",
  };
  const description = el("span", "row__sub", descriptions[getTheme()]);
  main.appendChild(description);
  row.appendChild(main);

  const trail = el("span", "row__trail");
  const container = el("span", "listbox-host");
  trail.appendChild(container);
  row.appendChild(trail);
  createListbox({
    container,
    labelledBy: "profile-theme-label",
    value: getTheme(),
    options: Object.entries(THEME_LABELS).map(([value, label]) => ({ value, label })),
    onChange: (value) => {
      setTheme(value);
      description.textContent = descriptions[value];
    },
  });

  return row;
}

function renderSettings() {
  const section = el("section", "stack stack--tight profile-settings");
  section.dataset.profilePart = "settings";
  section.appendChild(el("h2", "t-label", "Ayarlar"));

  const group = (title) => {
    const wrap = el("div", "settings-group");
    wrap.appendChild(el("h3", "settings-group__title", title));
    const list = el("div", "settings-list");
    wrap.appendChild(list);
    section.appendChild(wrap);
    return list;
  };
  const study = group("Çalışma");
  study.appendChild(
    toggleRow({
      name: SETTINGS.THINK_FIRST,
      title: "Önce kendin düşün",
      description: "Testte şıklar, sen hazır olduğunu söyleyene kadar gizli kalır.",
    })
  );
  const appearance = group("Görünüm ve hareket");
  appearance.appendChild(renderThemeRow());
  const motion = el("div", "row");
  const motionMain = el("span", "row__main");
  motionMain.appendChild(el("span", "row__title", "Arayüz hareketi"));
  motionMain.appendChild(el("span", "row__sub", "Arka plan ışıklarını ve geçiş animasyonlarını aç veya durdur."));
  motion.appendChild(motionMain);
  motion.appendChild(el("span", "row__trail")).appendChild(createMotionControl());
  appearance.appendChild(motion);

  const application = group("Uygulama");
  const navigation = (tag, label, glyph) => {
    const row = el(tag, "row settings-link");
    if (glyph) row.appendChild(el("span", "settings-link__icon")).appendChild(icon(glyph, { size: 20 }));
    const main = el("span", "row__main");
    main.appendChild(el("span", "row__title", label));
    row.appendChild(main);
    row.appendChild(el("span", "row__trail")).appendChild(icon("chevron-right", { size: 20 }));
    return row;
  };

  // The short product introduction is always available again.
  const replay = navigation("button", "Uygulamayı tanı", "route");
  replay.type = "button";
  replay.addEventListener("click", () => {
    setOnboarded(false);
    window.location.hash = "hosgeldin";
  });
  application.appendChild(replay);
  const about = navigation("a", "English Prep hakkında", "compare");
  about.href = "about/";
  application.appendChild(about);
  application.appendChild(createInstallControl());

  return section;
}

/**
 * Where the content comes from, said plainly.
 *
 * It is written by a language model and reviewed by another one, against
 * a written brief, and `docs/content-review.md` records what that process
 * caught and what it missed. Someone studying for an exam that decides
 * their year is entitled to know that before they trust a question — and
 * knowing it is also what turns a learner into the only pretest panel
 * this project can have. The report button on every answer is downstream
 * of this paragraph: it only gets used by someone who has been told the
 * content can be wrong.
 */
/**
 * What the app covers, and what it does not.
 *
 * A v1 criterion rather than a nicety. Session I is 60 points in four
 * sections and this app practises two of them; Session II is another 20
 * and it practises none. An app that silently omits half the paper is
 * worse than one that says so, because the learner who does well here
 * concludes something false about Friday.
 *
 * The restatement half is read from the manifest rather than asserted,
 * so this paragraph cannot quietly become untrue the way a hand-written
 * coverage claim does. The section point values come from
 * docs/exam-spec.md and change only if the paper does.
 */
/** "a, b ve c" — the conjunction Turkish wants, for a plain list. */
function listPhrase(parts) {
  if (parts.length <= 1) {
    return parts[0] ?? "";
  }
  return `${parts.slice(0, -1).join(", ")} ve ${parts[parts.length - 1]}`;
}

function renderCoverage(topics) {
  const hasRestatement = topics.some((topic) => topic.id === "closest-meaning" && !topic.comingSoon);

  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "Sınavın hangi kısmı burada"));

  // "15 puan" next to a section the app practises reads as fifteen points
  // earned. It means fifteen points *attempted*, and not all of them: one
  // of the sample cloze's ten blanks is `so / such`, which no lesson here
  // teaches. The count is derived, so it moves on its own when a topic
  // ships — but only for a blank that names its covering topic in
  // CLOZE_BLANKS, which is why a `null` there is a bug rather than a
  // placeholder. Two of them sat as `null` through the vocabulary topics
  // shipping and this line understated the app by two blanks.
  const cloze = clozeCoverage(topics);
  const covered = hasRestatement
    ? "paragraf içindeki boşluklar (15 puan) ve anlamca en yakın cümle (15 puan)"
    : "paragraf içindeki boşluklar (15 puan)";
  // Built from the manifest, not written out: the day `closest-meaning`
  // shipped, a hardcoded list naming it as missing became a lie about the
  // app the learner was holding, and the next topic to ship would do the
  // same thing again.
  const phrase = sectionListPhrase(uncoveredSections(topics));
  const missing = `${phrase.charAt(0).toLocaleUpperCase("tr")}${phrase.slice(1)} burada yok`;

  section.appendChild(
    el(
      "p",
      "t-body",
      `Session I'de 40 soru ve 60 puan var. Bu uygulama şu an ${covered} ` +
        `çalıştırıyor. ${missing}. Session II'nin tamamı dinleme ve not alma; o da yok.`
    )
  );
  if (cloze.missing.length > 0) {
    section.appendChild(
      el(
        "p",
        "t-body",
        `Çalıştırdığı bölümleri de bütünüyle değil: örnek sınavdaki ` +
          `${cloze.total} boşluktan ${cloze.covered} tanesinin dersi burada var, ` +
          `${listPhrase(cloze.missing)} yok.`
      )
    );
  }
  section.appendChild(
    el(
      "p",
      "t-body",
      "Yani buradaki ilerleme sınavın tamamı hakkında bir şey söylemiyor. " +
        "Eksik bölümleri örnek sınav kâğıtlarından çalışman gerekiyor."
    )
  );
  return section;
}

function renderAbout() {
  const section = el("section", "stack stack--tight");
  section.appendChild(el("h2", "t-label", "İçerik hakkında"));
  section.appendChild(
    el(
      "p",
      "t-body",
      "Buradaki dersler ve sorular yapay zekâ ile yazıldı, sonra yazılı bir " +
        "ölçüte göre ayrı bir denetimden geçirildi. Yine de hata çıkabiliyor: " +
        "bazı soruların birden fazla savunulabilir cevabı olduğu, bazı " +
        "derslerin uyardığı tuzağı hiçbir sorunun sınamadığı bu denetimde " +
        "ortaya çıktı ve düzeltiliyor."
    )
  );
  section.appendChild(
    el(
      "p",
      "t-body",
      "Bir soru sana yanlış geldiyse büyük ihtimalle haklısın. Cevabı " +
        "gördüğün ekranda \u201cBu soruda bir sorun var\u201d bağlantısı, " +
        "soruyu bulmaya yetecek bilgiyi hazırlar; kopyalayıp bize " +
        "ilettiğinde en güvenilir hata bildirimi o oluyor."
    )
  );
  return section;
}

/** One arrival, not one animation per settings change. All values and controls
 * already exist before the presentation starts. Offscreen prose stays still. */
function presentProfile() {
  if (container.closest("[hidden]")) return;
  const viewport = document.getElementById("shell-scroll").getBoundingClientRect();
  const visible = [...container.querySelectorAll(":scope > .stack > section")].filter((section) => {
    const box = section.getBoundingClientRect();
    return box.top < viewport.bottom && box.bottom > viewport.top;
  }).slice(0, 4);
  // A bounded identity mark can settle longer than text without delaying
  // reading, a field edit, or a settings action.
  const identity = container.querySelector('[data-profile-part="identity"] .avatar');
  whenVisible(visible[0] ?? container, () => {
    visible.forEach((element, index) => animateArrival(element, { channel: "profile-arrival", delay: index * 45 }));
    if (identity) animateElement(identity, "complete", { channel: "profile-identity", delay: 60 });
  },
    { channel: "profile-arrival", threshold: 0 });
}

async function render({ enter = false } = {}) {
  const version = ++renderVersion;
  let titleById = new Map();
  let lessons = [];
  let topics = [];
  try {
    const manifest = await loadManifest();
    topics = manifest.topics;
    titleById = new Map(manifest.topics.map((topic) => [topic.id, topic.title]));
    // Names and ids only — Profil never shows a lesson's contents, so it
    // has no business downloading them.
    lessons = lessonIndex(manifest);
  } catch (error) {
    // Stats come from local storage and are still worth showing, so a
    // failed content load degrades the lesson counter and the
    // category-to-lesson links rather than the whole tab.
    console.error(error);
  }


  await new Promise((resolve) => requestAnimationFrame(resolve));
  if (version !== renderVersion) return;
  const focused = captureFocus();
  const lessonIds = lessons.map((lesson) => lesson.id);
  const lessonIdByCategory = new Map(lessons.map((lesson) => [lesson.category, lesson.id]));

  cancelAnimationsWithin(container);
  clear(container);

  // Main-first, and the line is what a block is ABOUT rather than where it
  // happens to sit: everything that is the learner's — their name, their
  // figures, what they are weakest at, their data and the switches over it
  // — keeps the reading column, and everything that is the app describing
  // itself goes in the pane.
  //
  // Drawn there and not one block earlier because of the empty profile,
  // which is what a first visit is: with no history there are no weak
  // lists, and a division that put only the name and the figures in the
  // reading column left it a third full beside a pane running off the
  // bottom of the screen. Four blocks against three holds either way.
  //
  // On a phone the order is unchanged, which is also the order a screen
  // reader and the Tab key get.
  const main = pane();
  const aside = pane();
  container.classList.add("split", "split--main-first");

  // Figures first: the screen is the learner's, and the name is a
  // setting, so its card sits with the settings rather than opening the
  // screen as if it were the point.
  main.appendChild(renderIdentity());
  main.appendChild(
    renderStats(getOverallStats(), countCompletedLessons(lessonIds), lessonIds.length)
  );

  const weakCategories = getWeakCategories();
  const weakCategoryList = renderWeakList(
    "En çok zorlandığın kategoriler",
    // `every`, not `some` — see the note in js/home.js: the hint is about
    // the whole list, and one well-evidenced row must not speak for four
    // that are not.
    weakCategories.every((entry) => entry.confident)
      ? "Dokunduğunda o kategoriyi anlatan ders açılır."
      : "Şimdilik az veriyle sıralandı. Dokunduğunda o kategoriyi anlatan ders açılır.",
    weakCategories.map((entry) => ({
      name: entry.category,
      score: `${entry.correct} / ${entry.total}`,
      lessonId: lessonIdByCategory.get(entry.category) ?? null,
    }))
  );
  if (weakCategoryList) {
    main.appendChild(weakCategoryList);
  }

  const weakTopics = renderWeakList(
    "En çok zorlandığın konular",
    // "Şu an" is doing real work: the score is the most recent answer to
    // each distinct question, so it moves as soon as the learner does.
    "Her sorunun en son cevabına göre, şu an en çok yanıldığından başlayarak.",
    getWeakTopics().map((entry) => ({
      name: titleById.get(entry.topicId) ?? entry.topicId,
      score: `${entry.correct} / ${entry.total}`,
    }))
  );
  if (weakTopics) {
    main.appendChild(weakTopics);
  }

  main.appendChild(renderData());
  main.appendChild(renderSettings());
  aside.appendChild(renderCoverage(topics));
  aside.appendChild(renderAbout());

  container.append(main, aside);
  restoreFocus(focused);
  if (enter) presentProfile();
}

export async function initProfileTab({ enter = true } = {}) {
  if (!initialized) {
    initialized = true;
    backupDialog = createBackupDialog({ onResult: (message) => {
      const status = container.querySelector(".profile-transfer-status");
      if (status) {
        status.textContent = message;
        animateElement(status, "item");
      }
    } });
    // A learner can start typing while the arrival is still settling. Stop
    // presentation at that point so the caret and field stay stationary.
    container.addEventListener("focusin", (event) => {
      if (event.target.matches("input, textarea, [contenteditable]")) {
        cancelAnimationsWithin(container);
      }
    });
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
  await render({ enter });
}
