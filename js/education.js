// Eğitim tab: a chapter index (skim/jump to any chapter directly) plus a
// story-card, chapter-by-chapter walk (hook, rule, each example, a check
// question, a chapter-complete beat) for whichever chapter you open.
//
// The index exists because a pure linear "story" format -- the only way
// in was v0.9's -- is bad for study/reference use: you can't jump to a
// specific rule without tapping through everything before it. This keeps
// the story cards (they work well as a "walk me through it" experience)
// but they're no longer the only entry point, and answering a check
// question is no longer a hard gate -- the forward control still moves
// on ("Atla") if you haven't answered yet. See docs/education-notes.md
// and the plan behind this round for the research this is based on.
//
// Every chapter of every live topic is reachable at any time -- nothing
// is locked. Progression/locking across chapters and topics is a
// deliberately separate, later piece of work.

import { loadManifest, loadTopicContent } from "./topics.js";
import { isCorrectAnswer } from "./quiz-engine.js";
import { renderAnswerFeedback } from "./feedback.js";
import { setQuizRequest } from "./session-state.js";

const CHECK_QUESTIONS_PER_CHAPTER = 1;

const container = document.getElementById("lesson-container");

const state = {
  topics: [], // [{ id, title, lessons, questions }]
  view: "index", // "index" | "chapter"
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

function openChapter(topicIndex, chapterIndex) {
  state.topicIndex = topicIndex;
  state.chapterIndex = chapterIndex;
  state.view = "chapter";
  loadChapter();
}

function backToIndex() {
  state.view = "index";
  render();
}

// A check card no longer blocks moving on -- answering it is encouraged
// (it's the natural next tap, and stays visible) but skimming past an
// unanswered one is always allowed. Only the very last card of the very
// last chapter has nothing further to move to.
function isUnansweredCheck() {
  const card = state.cards[state.cardIndex];
  return card.type === "check" && !state.answers.has(state.cardIndex);
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
  if (isAtVeryEnd()) {
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
  openChapter(index, 0);
}

function startTopicTest(topicId) {
  setQuizRequest({ mode: "topic", topicIds: [topicId], count: "all" });
  window.location.href = "quiz.html";
}

// ---- Rendering: chapter index ----

function renderChapterRow(topicIndex, chapterIndex, chapter) {
  const row = el("button", "chapter-row");
  row.type = "button";
  const title = el("span", "chapter-row__title", chapter.category);
  title.lang = "en";
  row.appendChild(title);
  row.appendChild(el("span", "chapter-row__preview", chapter.rule));
  row.addEventListener("click", () => openChapter(topicIndex, chapterIndex));
  return row;
}

function renderIndexView() {
  state.topics.forEach((topic, topicIndex) => {
    const section = el("section", "panel");
    const heading = el("h3", null, topic.title);
    heading.lang = "en";
    section.appendChild(heading);

    const list = el("div", "chapter-list");
    topic.lessons.forEach((chapter, chapterIndex) => {
      list.appendChild(renderChapterRow(topicIndex, chapterIndex, chapter));
    });
    section.appendChild(list);

    container.appendChild(section);
  });
}

// ---- Rendering: story-card chapter view ----

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

function renderChapterNav() {
  const nav = el("div", "quiz-nav");
  const backBtn = el("button", "quiz-nav__exit", "‹ Konulara Dön");
  backBtn.type = "button";
  backBtn.addEventListener("click", backToIndex);
  nav.appendChild(backBtn);

  const topic = currentTopic();
  const eyebrow = el("p", "quiz-progress", `${topic.title} · Bölüm ${state.chapterIndex + 1}/${topic.lessons.length}`);
  eyebrow.lang = "en";
  nav.appendChild(eyebrow);
  return nav;
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

  const actions = el("div", "story-card__complete-actions");
  if (card.isLastChapterInTopic) {
    const testBtn = el("button", "btn btn--secondary btn--sm", "Bu Konudan Test Et");
    testBtn.type = "button";
    testBtn.addEventListener("click", () => startTopicTest(card.topicId));
    actions.appendChild(testBtn);
  }
  const indexBtn = el("button", "btn btn--secondary btn--sm", "Konulara Dön");
  indexBtn.type = "button";
  indexBtn.addEventListener("click", backToIndex);
  actions.appendChild(indexBtn);
  wrap.appendChild(actions);

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

function renderChapterView() {
  const switcher = renderTopicSwitcher();
  if (switcher) {
    container.appendChild(switcher);
  }
  container.appendChild(renderProgress());
  container.appendChild(renderChapterNav());

  const row = el("div", "story-row");

  const prevBtn = el("button", "story-edge story-edge--prev", "‹");
  prevBtn.type = "button";
  prevBtn.setAttribute("aria-label", "Önceki");
  prevBtn.disabled = isAtVeryStart();
  prevBtn.addEventListener("click", goPrev);
  row.appendChild(prevBtn);

  row.appendChild(renderCard(state.cards[state.cardIndex], state.cardIndex));

  const skip = isUnansweredCheck();
  const nextBtn = el("button", skip ? "story-edge story-edge--next story-edge--skip" : "story-edge story-edge--next", skip ? "Atla" : "›");
  nextBtn.type = "button";
  nextBtn.setAttribute("aria-label", skip ? "Soruyu atla" : "Sonraki");
  nextBtn.disabled = isAtVeryEnd();
  nextBtn.addEventListener("click", goNext);
  row.appendChild(nextBtn);

  container.appendChild(row);
}

function render() {
  container.innerHTML = "";

  if (state.topics.length === 0) {
    container.appendChild(el("p", "empty-state", "Henüz ders eklenmedi."));
    return;
  }

  if (state.view === "index") {
    renderIndexView();
  } else {
    renderChapterView();
  }
}

function handleKeydown(event) {
  if (state.topics.length === 0 || state.view !== "chapter") {
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

    document.addEventListener("keydown", handleKeydown);
    render();
  } catch (error) {
    console.error(error);
    container.innerHTML = "";
    container.appendChild(el("p", "empty-state", "Dersler yüklenemedi. Sayfayı yenile."));
  }
}
