// Home screen and the app's router.
//
// Eğitim and Test are the two content modes and live in the bottom nav —
// within thumb reach, and visually distinct rather than two mirror-image
// tabs sharing a bar. Profil is identity and settings, not a mode, so it
// opens from the header instead of sitting alongside them.
//
// Every screen is addressed by URL hash (`#egitim`, `#test`, `#profil`,
// plus `#egitim/<lessonId>` for an open lesson) rather than by in-memory
// state, which buys three things for free: the device back button steps
// back through the app instead of leaving it, a lesson can be linked to,
// and reloading keeps you where you were.

import { loadManifest } from "./topics.js";
import {
  getLastTopicScore,
  getWeakTopics,
  getSeenVersion,
  getProfileName,
  isDevNoteDismissed,
  dismissDevNote,
} from "./storage.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";
import { createDropdown } from "./dropdown.js";
import { showLessonIndex, openLesson, closeReader } from "./education.js";
import { initProfileTab } from "./profile.js";
import { startTopicTest, startMixedTest } from "./quiz-launch.js";
import { el, clear } from "./dom.js";
import { MAX_VISIBLE_CATEGORY_CHIPS, MIXED_TEST_DEFAULT_COUNT } from "./config.js";

const VIEW_IDS = ["egitim", "test", "profil"];
const DEFAULT_VIEW = "test";

const topicsContainer = document.getElementById("topics-container");
const startMixedBtn = document.getElementById("start-mixed-btn");
const profileTrigger = document.getElementById("profile-trigger");
const profileInitial = document.getElementById("profile-trigger-initial");
const devNote = document.getElementById("dev-note");
const tabs = Array.from(document.querySelectorAll(".bottom-nav__tab"));
const views = Object.fromEntries(VIEW_IDS.map((id) => [id, document.getElementById(`view-${id}`)]));

let mixedCountDropdown;

/* ---- Topic cards (Test tab) ---- */

function buildCategoryChips(categories) {
  const wrap = el("div", "category-chips");

  const visible = categories.slice(0, MAX_VISIBLE_CATEGORY_CHIPS);
  for (const category of visible) {
    const chip = el("span", "category-chip", category);
    chip.lang = "en";
    wrap.appendChild(chip);
  }

  const remaining = categories.length - visible.length;
  if (remaining > 0) {
    wrap.appendChild(el("span", "category-chip category-chip--more", `+${remaining} tane daha`));
  }

  return wrap;
}

function buildComingSoonCard(topic) {
  const card = el("div", "topic-card topic-card--coming-soon");
  const title = el("h3", null, topic.title);
  title.lang = "en";
  card.appendChild(title);
  card.appendChild(el("span", "badge badge--muted", "Yakında"));
  return card;
}

function buildTopicCard(topic, weakTopicIds) {
  if (topic.comingSoon) {
    return buildComingSoonCard(topic);
  }

  const card = el("div", "topic-card");

  const title = el("h3", null, topic.title);
  title.lang = "en";
  card.appendChild(title);

  const meta = [`${topic.questionCount} soru`];
  if (topic.lessonCount) {
    meta.push(`${topic.lessonCount} ders`);
  }
  card.appendChild(el("p", "topic-card__meta", meta.join(" · ")));

  if (topic.categories?.length) {
    card.appendChild(buildCategoryChips(topic.categories));
  }

  const badges = el("div", "badge-row");
  if (typeof topic.contentVersion === "number" && getSeenVersion(topic.id) < topic.contentVersion) {
    badges.appendChild(el("span", "badge badge--new", "Yeni sorular eklendi"));
  }
  const lastScore = getLastTopicScore(topic.id);
  if (lastScore) {
    badges.appendChild(el("span", "badge", `Son skor: ${lastScore.correct}/${lastScore.total}`));
  }
  if (weakTopicIds.has(topic.id)) {
    badges.appendChild(el("span", "badge", "Pratik gerekiyor"));
  }
  if (badges.childElementCount > 0) {
    card.appendChild(badges);
  }

  const startBtn = el("button", "btn btn--secondary", "Bu Konudan Başla");
  startBtn.type = "button";
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startTopicTest(topic.id).catch((error) => {
      console.error(error);
      startBtn.disabled = false;
    });
  });
  card.appendChild(startBtn);

  return card;
}

function buildTopicGrid(topics, weakTopicIds) {
  const grid = el("div", "topic-grid");
  for (const topic of topics) {
    grid.appendChild(buildTopicCard(topic, weakTopicIds));
  }
  return grid;
}

function renderTopicList(topics, weakTopicIds) {
  clear(topicsContainer);

  if (topics.length === 0) {
    topicsContainer.appendChild(el("p", "empty-state", "Henüz konu eklenmedi."));
    return;
  }

  const tiersPresent = TIER_ORDER.filter((tier) => topics.some((topic) => topic.tier === tier));

  // With only one tier populated (the realistic starting point), skip the
  // accordion entirely and show a flat, uncluttered list of topic cards.
  if (tiersPresent.length <= 1) {
    topicsContainer.appendChild(buildTopicGrid(topics, weakTopicIds));
    return;
  }

  tiersPresent.forEach((tier, index) => {
    const topicsInTier = topics.filter((topic) => topic.tier === tier);
    const details = el("details", "topic-tier");
    if (index === 0) {
      details.open = true;
    }
    details.appendChild(el("summary", null, `${TIER_LABELS[tier] ?? tier} (${topicsInTier.length})`));
    details.appendChild(buildTopicGrid(topicsInTier, weakTopicIds));
    topicsContainer.appendChild(details);
  });
}

async function renderTestTab() {
  try {
    const manifest = await loadManifest();
    const weakTopicIds = new Set(getWeakTopics().map((entry) => entry.topicId));
    renderTopicList(manifest.topics, weakTopicIds);
  } catch (error) {
    console.error(error);
    clear(topicsContainer);
    topicsContainer.appendChild(el("p", "empty-state", "Konular yüklenemedi. Sayfayı yenile."));
  }
}

/* ---- Routing ---- */

function parseRoute() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  const [view, ...rest] = raw.split("/");
  return VIEW_IDS.includes(view)
    ? { view, param: rest.join("/") || null }
    : { view: DEFAULT_VIEW, param: null };
}

function selectTab(view) {
  const known = tabs.some((tab) => tab.dataset.view === view);
  tabs.forEach((tab, index) => {
    const selected = tab.dataset.view === view;
    tab.setAttribute("aria-selected", String(selected));
    // Roving tabindex: one stop for the whole nav, arrow keys move within
    // it (WAI-ARIA tabs pattern). On Profil no tab is selected, so the
    // first one keeps the tab stop rather than the nav becoming
    // unreachable by keyboard.
    tab.tabIndex = selected || (!known && index === 0) ? 0 : -1;
  });
  profileTrigger.setAttribute("aria-current", String(view === "profil"));
}

/**
 * The header button stands in for the learner, so it shows their initial
 * once they've set a name. Turkish casing matters here: "i" upper-cases
 * to "İ", which `toUpperCase()` alone would get wrong.
 */
function refreshProfileTrigger() {
  const name = getProfileName().trim();
  profileInitial.textContent = name ? name[0].toLocaleUpperCase("tr") : "?";
  profileTrigger.setAttribute(
    "aria-label",
    name ? `Profilini aç (${name})` : "Profilini aç"
  );
}

function initDevNote() {
  if (isDevNoteDismissed()) {
    return;
  }
  devNote.hidden = false;
  document.getElementById("dev-note-dismiss").addEventListener("click", () => {
    devNote.hidden = true;
    dismissDevNote();
  });
}

async function applyRoute() {
  const { view, param } = parseRoute();

  selectTab(view);
  for (const id of VIEW_IDS) {
    views[id].hidden = id !== view;
  }

  if (view === "egitim") {
    await (param ? openLesson(param) : showLessonIndex());
    return;
  }

  // Leaving Eğitim: make sure the reader's focused mode is torn down, or
  // the header and tab bar would stay hidden on the next screen.
  closeReader();

  if (view === "profil") {
    await initProfileTab();
  } else {
    await renderTestTab();
  }
}

function navigate(view) {
  if (window.location.hash === `#${view}`) {
    return;
  }
  window.location.hash = view;
}

function handleTabKeydown(event) {
  const currentIndex = tabs.indexOf(event.target);
  if (currentIndex === -1) {
    return;
  }

  const offsets = { ArrowRight: 1, ArrowLeft: -1 };
  let nextIndex = null;
  if (event.key in offsets) {
    nextIndex = (currentIndex + offsets[event.key] + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  }
  if (nextIndex === null) {
    return;
  }

  event.preventDefault();
  tabs[nextIndex].focus();
  navigate(tabs[nextIndex].dataset.view);
}

/* ---- Init ---- */

function init() {
  for (const tab of tabs) {
    tab.addEventListener("click", () => navigate(tab.dataset.view));
    tab.addEventListener("keydown", handleTabKeydown);
  }

  profileTrigger.addEventListener("click", () => navigate("profil"));
  // Profil owns the name field; the header shows it. A DOM event keeps
  // that one-way rather than making the two modules import each other.
  document.addEventListener("profile:namechange", refreshProfileTrigger);
  refreshProfileTrigger();
  initDevNote();

  mixedCountDropdown = createDropdown({
    container: document.getElementById("mixed-count-dropdown"),
    options: [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "all", label: "Tümü" },
    ],
    value: MIXED_TEST_DEFAULT_COUNT,
    labelledBy: "mixed-count-label",
  });

  startMixedBtn.addEventListener("click", () => {
    const raw = mixedCountDropdown.getValue();
    startMixedBtn.disabled = true;
    startMixedTest(raw === "all" ? "all" : Number(raw)).catch((error) => {
      console.error(error);
      startMixedBtn.disabled = false;
    });
  });

  window.addEventListener("hashchange", () => {
    applyRoute();
  });

  return applyRoute();
}

init();
