import { loadManifest } from "./topics.js";
import {
  getLastTopicScore,
  getWeakTopics,
  getSeenVersion,
  markTopicSeen,
  getProfileName,
  hasOnboarded,
  markOnboarded,
} from "./storage.js";
import { setQuizRequest } from "./session-state.js";
import { navigateTo } from "./navigate.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";
import { createDropdown } from "./dropdown.js";
import { initEducationTab } from "./education.js";
import { initProfileTab } from "./profile.js";

const TOPIC_TEST_DEFAULT_COUNT = 15;
const MAX_VISIBLE_CATEGORIES = 3;

const topicsContainer = document.getElementById("topics-container");
const startMixedBtn = document.getElementById("start-mixed-btn");
const profileTrigger = document.getElementById("profile-trigger");
const profileTriggerInitial = document.getElementById("profile-trigger-initial");
const bottomNav = document.getElementById("bottom-nav");

let mixedCountDropdown;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function startQuiz(request) {
  setQuizRequest(request);
  navigateTo("quiz.html");
}

function parseCount(rawValue) {
  return rawValue === "all" ? "all" : Number(rawValue);
}

function markSeenIfVersioned(topic) {
  if (typeof topic.contentVersion === "number") {
    markTopicSeen(topic.id, topic.contentVersion);
  }
}

// One status line per card, not a stack of badges. Whichever fact is most
// useful right now wins: brand-new content first, then "you're weak here",
// then your last score. Showing all three at once was the old design's
// clutter, and three competing badges say less than one clear line.
function buildStatus(topic, weakTopicIds) {
  if (typeof topic.contentVersion === "number" && getSeenVersion(topic.id) < topic.contentVersion) {
    return el("span", "topic-card__status topic-card__status--new", "Yeni sorular eklendi");
  }
  if (weakTopicIds.has(topic.id)) {
    return el("span", "topic-card__status topic-card__status--weak", "Pratik gerekiyor");
  }
  const lastScore = getLastTopicScore(topic.id);
  if (lastScore) {
    return el("span", "topic-card__status", `Son skor: ${lastScore.correct}/${lastScore.total}`);
  }
  return el("span", "topic-card__status", "");
}

function buildComingSoonCard(topic) {
  const card = el("div", "topic-card topic-card--coming-soon");
  const title = el("h3", null, topic.title);
  title.lang = "en";
  card.appendChild(title);
  card.appendChild(el("p", "topic-card__meta", "Yakında"));
  return card;
}

function buildTopicCard(topic, weakTopicIds) {
  if (topic.comingSoon) {
    return buildComingSoonCard(topic);
  }

  // The whole card is the control. A card that looks tappable but hides
  // its action in a small button inside itself is a needless extra
  // target, and the nested button was one of the boxes-in-boxes.
  const card = el("button", "topic-card");
  card.type = "button";

  const title = el("h3", null, topic.title);
  title.lang = "en";
  card.appendChild(title);

  const chapterCount = topic.categories?.length ?? 0;
  const meta = chapterCount
    ? `${topic.questionCount} soru · ${chapterCount} bölüm`
    : `${topic.questionCount} soru`;
  card.appendChild(el("p", "topic-card__meta", meta));

  if (topic.categories?.length) {
    // Plain text rather than a row of outlined chips: the same
    // information, a quarter of the visual weight.
    const visible = topic.categories.slice(0, MAX_VISIBLE_CATEGORIES);
    const remaining = topic.categories.length - visible.length;
    const summary = el("p", "topic-card__categories", visible.join(" · ") + (remaining > 0 ? ` +${remaining}` : ""));
    summary.lang = "en";
    card.appendChild(summary);
  }

  const footer = el("div", "topic-card__footer");
  footer.appendChild(buildStatus(topic, weakTopicIds));
  footer.appendChild(el("span", "topic-card__cta", "Başla →"));
  card.appendChild(footer);

  card.addEventListener("click", () => {
    const count = Math.min(TOPIC_TEST_DEFAULT_COUNT, topic.questionCount);
    markSeenIfVersioned(topic);
    startQuiz({ mode: "topic", topicIds: [topic.id], count });
  });

  return card;
}

function buildTopicGrid(topics, weakTopicIds) {
  const grid = el("div", "topic-grid");
  for (const topic of topics) {
    grid.appendChild(buildTopicCard(topic, weakTopicIds));
  }
  return grid;
}

function renderTopics(topics, weakTopicIds) {
  topicsContainer.innerHTML = "";

  if (topics.length === 0) {
    topicsContainer.appendChild(el("p", "empty-state empty-state--center", "Henüz konu eklenmedi."));
    return;
  }

  const tiersPresent = TIER_ORDER.filter((tier) => topics.some((topic) => topic.tier === tier));

  // With only one tier populated, an accordion is pure overhead — show a
  // flat list of cards instead of a group wrapper containing one group.
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

    const summary = document.createElement("summary");
    summary.appendChild(el("span", "eyebrow", TIER_LABELS[tier] ?? tier));
    details.appendChild(summary);
    details.appendChild(buildTopicGrid(topicsInTier, weakTopicIds));

    topicsContainer.appendChild(details);
  });
}

// Profil isn't a peer of Eğitim/Test — it's identity/settings, not a
// content mode — so it lives behind its own header trigger rather than a
// third tab. showView() is still the single switchboard for every view;
// only how each one gets triggered differs.
function showView(view) {
  const tabs = Array.from(document.querySelectorAll(".bottom-nav__tab"));
  const views = {
    welcome: document.getElementById("view-welcome"),
    egitim: document.getElementById("view-egitim"),
    test: document.getElementById("view-test"),
    profil: document.getElementById("view-profil"),
  };

  tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.view === view)));
  profileTrigger.setAttribute("aria-current", String(view === "profil"));

  Object.entries(views).forEach(([name, node]) => {
    node.hidden = name !== view;
  });

  // The welcome screen offers exactly one decision, so the app's own
  // navigation stays out of the way until that decision is made.
  const onboarding = view === "welcome";
  bottomNav.hidden = onboarding;
  profileTrigger.hidden = onboarding;

  if (view === "egitim") {
    initEducationTab();
  } else if (view === "profil") {
    initProfileTab();
  } else if (view === "test") {
    render();
  }
}

function initWelcome() {
  document.getElementById("welcome-start-egitim").addEventListener("click", () => {
    markOnboarded();
    showView("egitim");
  });
  document.getElementById("welcome-start-test").addEventListener("click", () => {
    markOnboarded();
    showView("test");
  });
}

function initNavigation() {
  const tabs = Array.from(document.querySelectorAll(".bottom-nav__tab"));
  tabs.forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));
  profileTrigger.addEventListener("click", () => showView("profil"));
}

function updateProfileAvatar() {
  const name = getProfileName();
  profileTriggerInitial.textContent = name ? name.trim().charAt(0).toUpperCase() : "P";
}

async function init() {
  initNavigation();
  initWelcome();
  updateProfileAvatar();
  window.addEventListener("englishprep:profilenamechanged", updateProfileAvatar);

  mixedCountDropdown = createDropdown({
    container: document.getElementById("mixed-count-dropdown"),
    options: [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "all", label: "Tümü" },
    ],
    value: "10",
    onChange: () => {},
    labelledBy: "mixed-count-label",
  });

  startMixedBtn.addEventListener("click", async () => {
    const manifest = await loadManifest();
    const availableTopics = manifest.topics.filter((topic) => !topic.comingSoon);
    availableTopics.forEach(markSeenIfVersioned);
    startQuiz({
      mode: "mixed",
      topicIds: availableTopics.map((topic) => topic.id),
      count: parseCount(mixedCountDropdown.getValue()),
    });
  });

  showView(hasOnboarded() ? "test" : "welcome");
}

async function render() {
  try {
    const manifest = await loadManifest();
    const weakTopicIds = new Set(getWeakTopics().map((entry) => entry.topicId));
    renderTopics(manifest.topics, weakTopicIds);
  } catch (error) {
    topicsContainer.innerHTML = "";
    topicsContainer.appendChild(el("p", "empty-state empty-state--center", "Konular yüklenemedi. Sayfayı yenile."));
    console.error(error);
  }
}

init();
