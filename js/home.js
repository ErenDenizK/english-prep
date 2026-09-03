import { loadManifest } from "./topics.js";
import { getLastTopicScore, getWeakTopics, getSeenVersion, markTopicSeen, getProfileName } from "./storage.js";
import { setQuizRequest } from "./session-state.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";
import { createDropdown } from "./dropdown.js";
import { initEducationTab } from "./education.js";
import { initProfileTab } from "./profile.js";

const TOPIC_TEST_DEFAULT_COUNT = 15;

const topicsContainer = document.getElementById("topics-container");
const startMixedBtn = document.getElementById("start-mixed-btn");
const headerSubtitle = document.getElementById("header-subtitle");
const profileTrigger = document.getElementById("profile-trigger");
const profileTriggerInitial = document.getElementById("profile-trigger-initial");

const DEFAULT_SUBTITLE = headerSubtitle.textContent;

let mixedCountDropdown;

function startQuiz(request) {
  setQuizRequest(request);
  window.location.href = "quiz.html";
}

function parseCount(rawValue) {
  return rawValue === "all" ? "all" : Number(rawValue);
}

function markSeenIfVersioned(topic) {
  if (typeof topic.contentVersion === "number") {
    markTopicSeen(topic.id, topic.contentVersion);
  }
}

const MAX_VISIBLE_CATEGORY_CHIPS = 3;

function buildCategoryChips(categories) {
  const wrap = document.createElement("div");
  wrap.className = "category-chips";

  const visible = categories.slice(0, MAX_VISIBLE_CATEGORY_CHIPS);
  visible.forEach((category) => {
    const chip = document.createElement("span");
    chip.className = "category-chip";
    chip.textContent = category;
    wrap.appendChild(chip);
  });

  const remaining = categories.length - visible.length;
  if (remaining > 0) {
    const chip = document.createElement("span");
    chip.className = "category-chip category-chip--more";
    chip.textContent = `+${remaining} tane daha`;
    wrap.appendChild(chip);
  }

  return wrap;
}

function buildComingSoonCard(topic) {
  const card = document.createElement("div");
  card.className = "topic-card topic-card--coming-soon";

  const title = document.createElement("h3");
  title.textContent = topic.title;
  card.appendChild(title);

  const badge = document.createElement("span");
  badge.className = "badge badge--muted";
  badge.textContent = "Yakında";
  card.appendChild(badge);

  return card;
}

function buildTopicCard(topic, weakTopicIds) {
  if (topic.comingSoon) {
    return buildComingSoonCard(topic);
  }

  const card = document.createElement("div");
  card.className = "topic-card";

  const title = document.createElement("h3");
  title.textContent = topic.title;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "topic-card__meta";
  meta.textContent = `${topic.questionCount} soru`;
  card.appendChild(meta);

  if (topic.categories?.length) {
    card.appendChild(buildCategoryChips(topic.categories));
  }

  if (typeof topic.contentVersion === "number" && getSeenVersion(topic.id) < topic.contentVersion) {
    const badge = document.createElement("span");
    badge.className = "badge badge--new";
    badge.textContent = "Yeni sorular eklendi";
    card.appendChild(badge);
  }

  const lastScore = getLastTopicScore(topic.id);
  if (lastScore) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `Son skor: ${lastScore.correct}/${lastScore.total}`;
    card.appendChild(badge);
  }

  if (weakTopicIds.has(topic.id)) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Pratik gerekiyor";
    card.appendChild(badge);
  }

  const startBtn = document.createElement("button");
  startBtn.className = "btn btn--secondary";
  startBtn.type = "button";
  startBtn.textContent = "Bu Konudan Başla";
  startBtn.addEventListener("click", () => {
    const count = Math.min(TOPIC_TEST_DEFAULT_COUNT, topic.questionCount);
    markSeenIfVersioned(topic);
    startQuiz({ mode: "topic", topicIds: [topic.id], count });
  });
  card.appendChild(startBtn);

  return card;
}

function buildTopicGrid(topics, weakTopicIds) {
  const grid = document.createElement("div");
  grid.className = "topic-grid";
  for (const topic of topics) {
    grid.appendChild(buildTopicCard(topic, weakTopicIds));
  }
  return grid;
}

function renderTopics(topics, weakTopicIds) {
  topicsContainer.innerHTML = "";

  if (topics.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Henüz konu eklenmedi.";
    topicsContainer.appendChild(empty);
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
    const details = document.createElement("details");
    details.className = "topic-tier";
    if (index === 0) {
      details.open = true;
    }

    const summary = document.createElement("summary");
    summary.textContent = `${TIER_LABELS[tier] ?? tier} (${topicsInTier.length})`;
    details.appendChild(summary);
    details.appendChild(buildTopicGrid(topicsInTier, weakTopicIds));

    topicsContainer.appendChild(details);
  });
}

// Profil isn't a peer of Eğitim/Test — it's identity/settings, not a
// content mode — so it lives behind its own header trigger rather than a
// third tab. showView() is still the single switchboard for all three
// views; only how each one gets triggered differs.
function showView(view) {
  const tabs = Array.from(document.querySelectorAll(".tab-bar__tab"));
  const views = {
    egitim: document.getElementById("view-egitim"),
    test: document.getElementById("view-test"),
    profil: document.getElementById("view-profil"),
  };

  tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.view === view)));
  profileTrigger.setAttribute("aria-current", String(view === "profil"));

  views.egitim.hidden = view !== "egitim";
  views.test.hidden = view !== "test";
  views.profil.hidden = view !== "profil";

  if (view === "egitim") {
    initEducationTab();
  } else if (view === "profil") {
    initProfileTab();
  } else {
    render();
  }
}

function initNavigation() {
  const tabs = Array.from(document.querySelectorAll(".tab-bar__tab"));
  tabs.forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));
  profileTrigger.addEventListener("click", () => showView("profil"));
}

function updateHeaderGreeting() {
  const name = getProfileName();
  headerSubtitle.textContent = name ? `Hoş geldin, ${name}!` : DEFAULT_SUBTITLE;
  profileTriggerInitial.textContent = name ? name.trim().charAt(0).toUpperCase() : "P";
}

async function init() {
  initNavigation();
  updateHeaderGreeting();
  window.addEventListener("englishprep:profilenamechanged", updateHeaderGreeting);

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
    const availableTopicIds = availableTopics.map((topic) => topic.id);
    startQuiz({
      mode: "mixed",
      topicIds: availableTopicIds,
      count: parseCount(mixedCountDropdown.getValue()),
    });
  });

  await render();
}

async function render() {
  try {
    const manifest = await loadManifest();
    const weakTopicIds = new Set(getWeakTopics().map((entry) => entry.topicId));
    renderTopics(manifest.topics, weakTopicIds);
  } catch (error) {
    topicsContainer.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "Konular yüklenemedi. Sayfayı yenile.";
    topicsContainer.appendChild(message);
    console.error(error);
  }
}

init();
