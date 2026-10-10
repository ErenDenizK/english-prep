import { loadManifest } from "./topics.js";
import { getLastTopicScore, getWeakTopics, getHistory, clearHistory } from "./storage.js";
import { setQuizRequest } from "./session-state.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";

const TOPIC_TEST_DEFAULT_COUNT = 15;

const topicsContainer = document.getElementById("topics-container");
const startMixedBtn = document.getElementById("start-mixed-btn");
const mixedCountSelect = document.getElementById("mixed-count");
const clearHistoryBtn = document.getElementById("clear-history-btn");

function startQuiz(request) {
  setQuizRequest(request);
  window.location.href = "quiz.html";
}

function parseCount(rawValue) {
  return rawValue === "all" ? "all" : Number(rawValue);
}

function buildTopicCard(topic, weakTopicIds) {
  const card = document.createElement("div");
  card.className = "topic-card";

  const title = document.createElement("h3");
  title.textContent = topic.title;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "topic-card__meta";
  meta.textContent = `${topic.questionCount} questions`;
  card.appendChild(meta);

  const lastScore = getLastTopicScore(topic.id);
  if (lastScore) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `Last score: ${lastScore.correct}/${lastScore.total}`;
    card.appendChild(badge);
  }

  if (weakTopicIds.has(topic.id)) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Needs practice";
    card.appendChild(badge);
  }

  const startBtn = document.createElement("button");
  startBtn.className = "btn btn--secondary";
  startBtn.type = "button";
  startBtn.textContent = "Start Topic Test";
  startBtn.addEventListener("click", () => {
    const count = Math.min(TOPIC_TEST_DEFAULT_COUNT, topic.questionCount);
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
    empty.textContent = "No topics are available yet.";
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

async function init() {
  clearHistoryBtn.hidden = getHistory().length === 0;
  clearHistoryBtn.addEventListener("click", () => {
    const confirmed = window.confirm("Clear all locally saved scores? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    clearHistory();
    clearHistoryBtn.hidden = true;
    render();
  });

  startMixedBtn.addEventListener("click", async () => {
    const manifest = await loadManifest();
    const allTopicIds = manifest.topics.map((topic) => topic.id);
    startQuiz({ mode: "mixed", topicIds: allTopicIds, count: parseCount(mixedCountSelect.value) });
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
    message.textContent = "Could not load topics. Please refresh the page.";
    topicsContainer.appendChild(message);
    console.error(error);
  }
}

init();
