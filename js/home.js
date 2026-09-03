// The app's router, and the Test tab.
//
// Eğitim and Test are the two content modes and live in the bottom nav.
// Eğitim is the default: someone opening a study app wants to carry on
// where they left off, not to be handed an exam. Profil is identity and
// settings rather than a mode, so it opens from the header.
//
// Every screen is addressed by URL hash (`#egitim`, `#test`, `#profil`,
// plus `#egitim/<lessonId>` for an open lesson) rather than by in-memory
// state, which buys three things for free: the device back button steps
// back through the app instead of leaving it, a lesson can be linked to,
// and reloading keeps you where you were.
//
// The Test tab's own hierarchy is: the mixed test, because that is what
// the tab is for; then the categories the learner keeps failing, which is
// the most valuable thing the app knows about them; then the topic list.

import { loadManifest, loadLessonsForTopics } from "./topics.js";
import {
  getLastTopicScore,
  getWeakCategories,
  getSeenVersion,
  getProfileName,
  isDevNoteDismissed,
  dismissDevNote,
  requestPersistentStorage,
} from "./storage.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";
import { createListbox } from "./listbox.js";
import { showLessonIndex, openLesson, closeReader } from "./education.js";
import { initProfileTab } from "./profile.js";
import { startTopicTest, startMixedTest, startCategoryPractice } from "./quiz-launch.js";
import { el, clear } from "./dom.js";
import { icon } from "./icons.js";
import { announce, scrollToTop } from "./shell.js";
import { MIXED_TEST_DEFAULT_COUNT } from "./config.js";

const VIEW_IDS = ["egitim", "test", "profil"];
const DEFAULT_VIEW = "egitim";

const VIEW_TITLES = {
  egitim: "Eğitim",
  test: "Test",
  profil: "Profil",
};

const NAV_ICONS = {
  egitim: "book",
  test: "check-square",
};

const testPanel = document.getElementById("test-panel");
const profileTrigger = document.getElementById("profile-trigger");
const profileFace = document.getElementById("profile-trigger-face");
const devNote = document.getElementById("dev-note");
const navItems = Array.from(document.querySelectorAll(".nav__item"));
const views = Object.fromEntries(VIEW_IDS.map((id) => [id, document.getElementById(`view-${id}`)]));

let mixedCount;

/* ---- Test tab ---- */

function sectionHeading(text, hint) {
  const head = el("div", "stack stack--tight");
  head.appendChild(el("h2", "t-label", text));
  if (hint) {
    head.appendChild(el("p", "t-meta", hint));
  }
  return head;
}

function renderMixedTest() {
  const surface = el("section", "surface stack");

  const intro = el("div", "stack stack--tight");
  intro.appendChild(el("h2", "t-title", "Karışık test"));
  intro.appendChild(
    el(
      "p",
      "t-body",
      "Sorular tüm konulardan rastgele gelir. Seviyeni görmenin en hızlı yolu."
    )
  );
  surface.appendChild(intro);

  const row = el("div", "cluster cluster--spread");
  const label = el("span", "t-ui", "Soru sayısı");
  label.id = "mixed-count-label";
  row.appendChild(label);
  const listboxHost = el("div");
  row.appendChild(listboxHost);
  surface.appendChild(row);

  const start = el("button", "btn btn--primary", "Teste başla");
  start.type = "button";
  start.addEventListener("click", () => {
    const raw = mixedCount.getValue();
    startMixedTest(raw === "all" ? "all" : Number(raw)).catch(console.error);
  });
  surface.appendChild(start);

  mixedCount = createListbox({
    container: listboxHost,
    options: [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "all", label: "Tümü" },
    ],
    value: MIXED_TEST_DEFAULT_COUNT,
    labelledBy: "mixed-count-label",
  });

  return surface;
}

/**
 * The categories the learner is weakest at, each one a shortcut into
 * practice scoped to exactly that category. Only here, on the Test tab:
 * the same list in Profil links to the *lesson* instead, so a row never
 * has to carry two competing actions.
 */
function renderWeakSpots(entries) {
  if (entries.length === 0) {
    return null;
  }

  const section = el("section", "stack stack--tight");
  // A ranking, not a verdict. The app knows which categories the learner
  // has got most wrong; on four questions it does not know that they
  // *cannot do* them, and the heading should not claim otherwise. The
  // hint says which of the two this is.
  const confident = entries.some((entry) => entry.confident);
  section.appendChild(
    sectionHeading(
      "En çok zorlandıkların",
      confident
        ? "Dokunduğunda sadece o kategoriden pratik başlar."
        : "Şimdilik az veriyle sıralandı. Dokunduğunda o kategoriden pratik başlar."
    )
  );

  const list = el("div");
  for (const entry of entries) {
    const row = el("button", "row");
    row.type = "button";

    const lead = el("span", "row__lead");
    lead.appendChild(icon("target", { size: 20 }));
    row.appendChild(lead);

    const main = el("span", "row__main");
    const title = el("span", "row__title t-en", entry.category);
    title.lang = "en";
    main.appendChild(title);
    main.appendChild(el("span", "row__sub", "Bu kategoriden pratik yap"));
    row.appendChild(main);

    const trail = el("span", "row__trail t-num", `${entry.correct}/${entry.total}`);
    row.appendChild(trail);

    row.addEventListener("click", () => {
      startCategoryPractice(entry.category).catch(console.error);
    });
    list.appendChild(row);
  }
  section.appendChild(list);

  return section;
}

function topicMeta(topic) {
  const parts = [`${topic.questionCount} soru`];
  if (topic.lessonCount) {
    parts.push(`${topic.lessonCount} ders`);
  }
  return parts.join(" · ");
}

function renderTopicRow(topic) {
  const interactive = !topic.comingSoon;
  const row = el(interactive ? "button" : "div", "row");
  if (interactive) {
    row.type = "button";
  }

  const main = el("span", "row__main");
  const title = el("span", "row__title t-en", topic.title);
  title.lang = "en";
  main.appendChild(title);
  main.appendChild(el("span", "row__sub", topic.comingSoon ? "Hazırlanıyor" : topicMeta(topic)));
  row.appendChild(main);

  const trail = el("span", "row__trail");
  if (topic.comingSoon) {
    trail.appendChild(el("span", "chip", "Yakında"));
  } else {
    if (typeof topic.contentVersion === "number" && getSeenVersion(topic.id) < topic.contentVersion) {
      trail.appendChild(el("span", "chip chip--accent", "Yeni"));
    }
    const lastScore = getLastTopicScore(topic.id);
    if (lastScore) {
      trail.appendChild(el("span", "t-num", `${lastScore.correct}/${lastScore.total}`));
    }
    trail.appendChild(icon("chevron-right", { size: 20 }));
  }
  row.appendChild(trail);

  if (interactive) {
    row.addEventListener("click", () => {
      startTopicTest(topic.id).catch(console.error);
    });
  }

  return row;
}

/**
 * Grouped by difficulty tier when there is more than one — and in that case
 * the tier names *are* the headings. An umbrella "Konular" above them would
 * put two labels of identical weight one line apart, which reads as a pile
 * rather than as a hierarchy.
 */
function renderTopicList(topics) {
  const section = el("section", "stack");
  const tiersPresent = TIER_ORDER.filter((tier) => topics.some((topic) => topic.tier === tier));

  const group = (heading, inGroup) => {
    const block = el("section", "stack stack--tight");
    block.appendChild(el("h2", "t-label", heading));
    const list = el("div");
    inGroup.forEach((topic) => list.appendChild(renderTopicRow(topic)));
    block.appendChild(list);
    return block;
  };

  if (tiersPresent.length <= 1) {
    section.appendChild(group("Konular", topics));
    return section;
  }

  for (const tier of tiersPresent) {
    section.appendChild(
      group(TIER_LABELS[tier] ?? tier, topics.filter((topic) => topic.tier === tier))
    );
  }

  return section;
}

async function renderTestTab() {
  let manifest;
  try {
    manifest = await loadManifest();
  } catch (error) {
    console.error(error);
    clear(testPanel);
    testPanel.appendChild(el("p", "t-meta", "Konular yüklenemedi. Sayfayı yenile."));
    return;
  }

  // Weak spots are stored by category, and a category only becomes a link
  // to practice if some live topic still carries it — a category that was
  // renamed out of the taxonomy should not strand the learner in an empty
  // test.
  let liveCategories = new Set();
  try {
    const lessons = await loadLessonsForTopics(manifest.topics.filter((topic) => !topic.comingSoon));
    liveCategories = new Set(lessons.map((lesson) => lesson.category));
  } catch (error) {
    console.error(error);
  }

  clear(testPanel);
  testPanel.appendChild(renderMixedTest());

  const weakSpots = renderWeakSpots(
    getWeakCategories().filter((entry) => liveCategories.size === 0 || liveCategories.has(entry.category))
  );
  if (weakSpots) {
    testPanel.appendChild(weakSpots);
  }

  if (manifest.topics.length === 0) {
    testPanel.appendChild(el("p", "t-meta", "Henüz konu eklenmedi."));
  } else {
    testPanel.appendChild(renderTopicList(manifest.topics));
  }
}

/* ---- Chrome ---- */

function initNav() {
  for (const item of navItems) {
    const host = item.querySelector("[data-icon]");
    host.replaceChildren(icon(NAV_ICONS[item.dataset.view], { size: 24 }));
  }
}

function selectTab(view) {
  for (const item of navItems) {
    const selected = item.dataset.view === view;
    // The filled variant, not a recoloured outline: fill changes visual
    // mass, so the selected destination survives greyscale and
    // forced-colors mode.
    const name = NAV_ICONS[item.dataset.view];
    item.querySelector("[data-icon]").replaceChildren(
      icon(selected ? `${name}-fill` : name, { size: 24 })
    );
    if (selected) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  }
  profileTrigger.setAttribute("aria-current", view === "profil" ? "page" : "false");
}

/**
 * The header button stands in for the learner: their initial once they
 * have set a name, and the generic figure until then. Turkish casing
 * matters — "i" upper-cases to "İ", which `toUpperCase()` gets wrong.
 */
function refreshProfileTrigger() {
  const name = getProfileName().trim();
  if (name) {
    profileFace.replaceChildren(document.createTextNode(name[0].toLocaleUpperCase("tr")));
    profileTrigger.setAttribute("aria-label", `Profilini aç (${name})`);
  } else {
    profileFace.replaceChildren(icon("user", { size: 22 }));
    profileTrigger.setAttribute("aria-label", "Profilini aç");
  }
}

function initDevNote() {
  if (isDevNoteDismissed()) {
    return;
  }
  devNote.hidden = false;
  const dismiss = document.getElementById("dev-note-dismiss");
  dismiss.appendChild(icon("close", { size: 20 }));
  dismiss.addEventListener("click", () => {
    devNote.hidden = true;
    dismissDevNote();
  });
}

/* ---- Routing ---- */

function parseRoute() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  const [view, ...rest] = raw.split("/");
  return VIEW_IDS.includes(view)
    ? { view, param: rest.join("/") || null }
    : { view: DEFAULT_VIEW, param: null };
}

let routed = false;

async function applyRoute() {
  const { view, param } = parseRoute();

  selectTab(view);
  for (const id of VIEW_IDS) {
    views[id].hidden = id !== view;
  }
  // 2.4.2: the title has to say which screen this is, or the back button
  // walks through a history of identically-named entries.
  document.title = `${VIEW_TITLES[view]} — English Prep`;
  announce(VIEW_TITLES[view]);
  scrollToTop();

  // A hash route is a navigation, so focus has to move with it or the next
  // Tab resumes from wherever the last screen left it — and the browser's
  // own Back button strands it entirely. Not on first paint, though: a
  // focus ring on a page nobody has interacted with is just noise.
  if (routed) {
    views[view].focus({ preventScroll: true });
  }
  routed = true;

  if (view === "egitim") {
    await (param ? openLesson(param) : showLessonIndex());
    return;
  }

  // Leaving Eğitim: tear the reader's focused mode down, or the header
  // and nav stay hidden on the next screen.
  closeReader();

  if (view === "profil") {
    await initProfileTab();
  } else {
    await renderTestTab();
  }
}

/* ---- Init ---- */

function init() {
  // Ask the browser to keep this origin's storage. Free on Chrome; on
  // WebKit the documented heuristic includes whether the site has been
  // added to the Home Screen, so it will usually say no — the backup in
  // Profil is the real answer, and this costs nothing to ask.
  requestPersistentStorage();
  initNav();
  profileTrigger.addEventListener("click", () => {
    window.location.hash = "profil";
  });
  // Profil owns the name field; the header shows it. A DOM event keeps
  // that one-way rather than making the two modules import each other.
  document.addEventListener("profile:namechange", refreshProfileTrigger);
  refreshProfileTrigger();
  initDevNote();

  window.addEventListener("hashchange", () => {
    applyRoute();
  });

  return applyRoute();
}

init();
