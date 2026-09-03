// Starting a test is the one action reachable from several places — a
// topic card, the mixed-test hero, and the end of an Eğitim lesson — and
// each one has to do the same three things in the same order: record that
// the learner has now seen the topic's current content version (which is
// what clears the "new questions added" badge), stash the request for
// quiz.html to pick up, and navigate. Keeping that here means a new entry
// point can't quietly skip a step.

import { loadManifest } from "./topics.js";
import { markTopicSeen, getMistakeBook } from "./storage.js";
import { setQuizRequest } from "./session-state.js";
import { TOPIC_TEST_DEFAULT_COUNT } from "./config.js";

function markSeen(topic) {
  if (typeof topic.contentVersion === "number") {
    markTopicSeen(topic.id, topic.contentVersion);
  }
}

function go(request) {
  setQuizRequest(request);
  window.location.href = "quiz.html";
}

/**
 * @param {string} topicId
 * @param {number} [count] - clamped to the topic's question count
 * @returns {Promise<boolean>} false if the topic isn't a live topic
 */
export async function startTopicTest(topicId, count = TOPIC_TEST_DEFAULT_COUNT) {
  const manifest = await loadManifest();
  const topic = manifest.topics.find((entry) => entry.id === topicId && !entry.comingSoon);
  if (!topic) {
    return false;
  }
  markSeen(topic);
  go({ mode: "topic", topicIds: [topic.id], count: Math.min(count, topic.questionCount) });
  return true;
}

/**
 * Practice for a single grammar category, across every topic that uses
 * it. Reached from a weak spot in Profil, so the whole point is that the
 * learner lands on exactly the thing they keep getting wrong.
 * @param {string} category
 * @param {number} [count]
 */
export async function startCategoryPractice(category, count = TOPIC_TEST_DEFAULT_COUNT) {
  const manifest = await loadManifest();
  const topics = manifest.topics.filter((topic) => !topic.comingSoon);
  topics.forEach(markSeen);
  go({ mode: "category", topicIds: topics.map((topic) => topic.id), category, count });
}

/**
 * @param {number|"all"} count
 */
export async function startMixedTest(count) {
  const manifest = await loadManifest();
  const topics = manifest.topics.filter((topic) => !topic.comingSoon);
  topics.forEach(markSeen);
  go({ mode: "mixed", topicIds: topics.map((topic) => topic.id), count });
}

/**
 * Yanlış defteri — only the questions this learner has got wrong and not
 * yet earned their way out of. The ids travel in the request rather than
 * being recomputed on the quiz screen, so the set the learner was shown a
 * count for is exactly the set they get.
 *
 * @param {number|"all"} [count]
 * @returns {Promise<boolean>} false if the book is empty
 */
export async function startMistakeBook(count = "all") {
  const ids = getMistakeBook().map((entry) => entry.id);
  if (ids.length === 0) {
    return false;
  }
  const manifest = await loadManifest();
  const topics = manifest.topics.filter((topic) => !topic.comingSoon);
  topics.forEach(markSeen);
  go({ mode: "mistakes", topicIds: topics.map((topic) => topic.id), ids, count });
  return true;
}
