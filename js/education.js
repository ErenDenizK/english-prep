// Eğitim tab: a story-card, chapter-by-chapter walk through each topic's
// grammar categories -- one full-screen "beat" at a time (a hook, the
// rule, each example, a couple of check questions, a chapter-complete
// beat), tap or use the edge arrows to move through them. Follows the
// content side's story-card vision in docs/education-notes.md: modeled
// on formats like Instagram/TikTok Stories, but not a literal clone --
// no auto-advance or timer, since grammar needs reading time a story
// doesn't assume.
//
// This is the presentation layer only. Every chapter of every live topic
// is reachable at any time -- nothing is locked. Progression/locking
// across chapters and topics is a deliberately separate, later piece of
// work (see docs/education-notes.md).

import { loadManifest, loadTopicContent } from "./topics.js";
import { isCorrectAnswer } from "./quiz-engine.js";
import { renderAnswerFeedback } from "./feedback.js";
import { setQuizRequest } from "./session-state.js";

const CHECK_QUESTIONS_PER_CHAPTER = 2;

const container = document.getElementById("lesson-container");

const state = {
  topics: [], // [{ id, title, lessons, questions }]
  topicIndex: 0,
  chapterIndex: 0,
  cards: [],
  cardIndex: 0,
  answers: new Map(), // card index -> the option string picked for that check card
  loaded: false,
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function currentTopic() {
  return state.topics[state.topicIndex];
}

function currentChapter() {
  return currentTopic().lessons[state.chapterIndex];
}

function buildCards(topic, chapter) {
  const cards = [];

  if (chapter.intro) {
    cards.push({ type: "hook", text: chapter.intro });
  }
  cards.push({ type: "rule", category: chapter.category, text: chapter.rule });
  chapter.examples.forEach((example) => {
    cards.push({ type: "example", sentence: example.sentence, note: example.note });
  });

  const checks = topic.questions
    .filter((question) => question.category === chapter.category)
    .slice(0, CHECK_QUESTIONS_PER_CHAPTER);
  checks.forEach((question) => cards.push({ type: "check", question }));

  const isLastChapterInTopic = state.chapterIndex === topic.lessons.length - 1;
  const isLastTopic = state.topicIndex === state.topics.length - 1;
  let nextLabel = null;
  if (!isLastChapterInTopic) {
    nextLabel = topic.lessons[state.chapterIndex + 1].category;
  } else if (!isLastTopic) {
    nextLabel = state.topics[state.topicIndex + 1].title;
  }
  cards.push({ type: "complete", topicId: topic.id, topicTitle: topic.title, isLastChapterInTopic, nextLabel });

  return cards;
}

function loadChapter() {
  state.cards = buildCards(currentTopic(), currentChapter());
  state.cardIndex = 0;
  state.answers = new Map();
  render();
}

function canAdvance() {
  const card = state.cards[state.cardIndex];
  return card.type !== "check" || state.answers.has(state.cardIndex);
}

function isAtVeryStart() {
  return state.topicIndex === 0 && state.chapterIndex === 0 && state.cardIndex === 0;
}

function isAtVeryEnd() {
  const topic = currentTopic();
  return (
    state.topicIndex === state.topics.length - 1 &&
    state.chapterIndex === topic.lessons.length - 1 &&
    state.cardIndex === state.cards.length - 1
  );
}

function goNext() {
  if (!canAdvance() || isAtVeryEnd()) {
    return;
  }
  if (state.cardIndex < state.cards.length - 1) {
    state.cardIndex += 1;
    render();
    return;
  }
  const topic = currentTopic();
  if (state.chapterIndex < topic.lessons.length - 1) {
    state.chapterIndex += 1;
  } else {
    state.topicIndex += 1;
    state.chapterIndex = 0;
  }
  loadChapter();
}

function goPrev() {
  if (isAtVeryStart()) {
    return;
  }
  if (state.cardIndex > 0) {
    state.cardIndex -= 1;
    render();
    return;
  }
  // At the first card of a chapter -- step back into the previous
  // chapter/topic, landing on its last card. Re-entering a chapter this
  // way shows it fresh (no remembered answers) -- there's no persisted
  // progress yet, this is the presentation layer only (see file header).
  if (state.chapterIndex > 0) {
    state.chapterIndex -= 1;
  } else {
    state.topicIndex -= 1;
    state.chapterIndex = state.topics[state.topicIndex].lessons.length - 1;
  }
  state.cards = buildCards(currentTopic(), currentChapter());
  state.cardIndex = state.cards.length - 1;
  state.answers = new Map();
  render();
}

function switchTopic(index) {
  if (index === state.topicIndex) {
    return;
  }
  state.topicIndex = index;
  state.chapterIndex = 0;
  loadChapter();
}

function startTopicTest(topicId) {
  setQuizRequest({ mode: "topic", topicIds: [topicId], count: "all" });
  window.location.href = "quiz.html";
}

// ---- Rendering ----

function renderTopicSwitcher() {
  if (state.topics.length <= 1) {
    return null;
  }
  const wrap = el("div", "topic-switcher");
  state.topics.forEach((topic, index) => {
    const isActive = index === state.topicIndex;
    const btn = el("button", isActive ? "topic-switcher__pill topic-switcher__pill--active" : "topic-switcher__pill", topic.title);
    btn.type = "button";
    btn.lang = "en";
    btn.addEventListener("click", () => switchTopic(index));
    wrap.appendChild(btn);
  });
  return wrap;
}

function renderProgress() {
  const track = el("div", "story-progress");
  state.cards.forEach((_, index) => {
    const segment = el("div", "story-progress__segment");
    if (index < state.cardIndex) {
      segment.classList.add("story-progress__segment--filled");
    } else if (index === state.cardIndex) {
      segment.classList.add("story-progress__segment--current");
    }
    track.appendChild(segment);
  });
  return track;
}

function renderEyebrow() {
  const topic = currentTopic();
  const eyebrow = el("p", "story-eyebrow", `${topic.title} · Bölüm ${state.chapterIndex + 1}/${topic.lessons.length}`);
  eyebrow.lang = "en";
  return eyebrow;
}

function renderPrompt(promptText) {
  const p = el("p", "question-card__prompt");
  const parts = promptText.split("____");
  parts.forEach((part, i) => {
    p.appendChild(document.createTextNode(part));
    if (i < parts.length - 1) {
      p.appendChild(el("span", "blank", "_____"));
    }
  });
  return p;
}

function renderCheckCard(card, index) {
  const wrap = el("div", "story-card story-card--check");
  const { question } = card;

  wrap.appendChild(el("p", "story-eyebrow", "Kontrol Sorusu"));
  wrap.appendChild(renderPrompt(question.prompt));

  const optionsWrap = el("div", "options");
  const selected = state.answers.get(index);
  const answered = selected !== undefined;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.textContent = option;
    if (answered) {
      button.disabled = true;
      if (option === question.correctAnswer) {
        button.classList.add("option-btn--correct");
      } else if (option === selected) {
        button.classList.add("option-btn--incorrect");
      }
    } else {
      button.addEventListener("click", () => {
        state.answers.set(index, option);
        render();
      });
    }
    optionsWrap.appendChild(button);
  });
  wrap.appendChild(optionsWrap);

  if (answered) {
    wrap.appendChild(renderAnswerFeedback(question, isCorrectAnswer(question, selected)));
  }

  return wrap;
}

function renderCompleteCard(card) {
  const wrap = el("div", "story-card story-card--complete");
  wrap.appendChild(el("div", "story-card__complete-check", "✓"));
  wrap.appendChild(
    el("h3", "story-card__complete-title", card.isLastChapterInTopic ? `${card.topicTitle} tamamlandı!` : "Bölüm tamamlandı!")
  );

  if (card.nextLabel) {
    const next = el("p", "story-card__complete-next", `Sıradaki: ${card.nextLabel}`);
    next.lang = "en";
    wrap.appendChild(next);
  } else {
    wrap.appendChild(el("p", "story-card__complete-next", "Şu an için tüm konuları tamamladın!"));
  }

  if (card.isLastChapterInTopic) {
    const actions = el("div", "story-card__complete-actions");
    const testBtn = el("button", "btn btn--secondary btn--sm", "Bu Konudan Test Et");
    testBtn.type = "button";
    testBtn.addEventListener("click", () => startTopicTest(card.topicId));
    actions.appendChild(testBtn);
    wrap.appendChild(actions);
  }

  return wrap;
}

function renderCard(card, index) {
  if (card.type === "hook") {
    const wrap = el("div", "story-card story-card--hook");
    wrap.appendChild(el("p", "story-card__hook", card.text));
    return wrap;
  }
  if (card.type === "rule") {
    const wrap = el("div", "story-card story-card--rule");
    const category = el("h3", "story-card__category", card.category);
    category.lang = "en";
    wrap.appendChild(category);
    wrap.appendChild(el("p", "story-card__rule", card.text));
    return wrap;
  }
  if (card.type === "example") {
    const wrap = el("div", "story-card story-card--example");
    wrap.appendChild(el("p", "story-card__example-sentence", card.sentence));
    wrap.appendChild(el("p", "story-card__example-note", card.note));
    return wrap;
  }
  if (card.type === "check") {
    return renderCheckCard(card, index);
  }
  return renderCompleteCard(card);
}

function render() {
  container.innerHTML = "";

  if (state.topics.length === 0) {
    container.appendChild(el("p", "empty-state", "Henüz ders eklenmedi."));
    return;
  }

  const switcher = renderTopicSwitcher();
  if (switcher) {
    container.appendChild(switcher);
  }
  container.appendChild(renderProgress());
  container.appendChild(renderEyebrow());

  const row = el("div", "story-row");

  const prevBtn = el("button", "story-edge story-edge--prev", "‹");
  prevBtn.type = "button";
  prevBtn.setAttribute("aria-label", "Önceki");
  prevBtn.disabled = isAtVeryStart();
  prevBtn.addEventListener("click", goPrev);
  row.appendChild(prevBtn);

  row.appendChild(renderCard(state.cards[state.cardIndex], state.cardIndex));

  const nextBtn = el("button", "story-edge story-edge--next", "›");
  nextBtn.type = "button";
  nextBtn.setAttribute("aria-label", "Sonraki");
  nextBtn.disabled = !canAdvance() || isAtVeryEnd();
  nextBtn.addEventListener("click", goNext);
  row.appendChild(nextBtn);

  container.appendChild(row);
}

function handleKeydown(event) {
  if (state.topics.length === 0) {
    return;
  }
  const card = state.cards[state.cardIndex];
  if (card.type === "check" && !state.answers.has(state.cardIndex) && ["1", "2", "3", "4"].includes(event.key)) {
    const buttons = document.querySelectorAll(".story-card--check .option-btn");
    buttons[Number(event.key) - 1]?.click();
    return;
  }
  if (event.key === "ArrowRight" || event.key === "Enter") {
    goNext();
  } else if (event.key === "ArrowLeft") {
    goPrev();
  }
}

export async function initEducationTab() {
  if (state.loaded) {
    return;
  }
  state.loaded = true;

  try {
    const manifest = await loadManifest();
    const realTopics = manifest.topics.filter((topic) => !topic.comingSoon);
    const contents = await Promise.all(
      realTopics.map(async (topic) => {
        const { lessons, questions } = await loadTopicContent(topic);
        return { id: topic.id, title: topic.title, lessons, questions };
      })
    );
    state.topics = contents.filter((topic) => topic.lessons.length > 0);

    if (state.topics.length === 0) {
      render();
      return;
    }

    document.addEventListener("keydown", handleKeydown);
    loadChapter();
  } catch (error) {
    console.error(error);
    container.innerHTML = "";
    container.appendChild(el("p", "empty-state", "Dersler yüklenemedi. Sayfayı yenile."));
  }
}
