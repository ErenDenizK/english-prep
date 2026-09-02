// Loads the topic manifest and question sets from the static data/ folder.

const MANIFEST_URL = "data/manifest.json";

/**
 * @returns {Promise<{topics: Array<{id: string, title: string, tier: string, file: string, questionCount: number}>}>}
 */
export async function loadManifest() {
  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    throw new Error("Failed to load the topic manifest.");
  }
  return response.json();
}

/**
 * @param {{id: string, file: string}} topic
 * @returns {Promise<Array<object>>} the topic's questions, unmodified
 */
export async function loadTopicQuestions(topic) {
  const response = await fetch(topic.file);
  if (!response.ok) {
    throw new Error(`Failed to load questions for topic "${topic.id}".`);
  }
  const data = await response.json();
  return data.questions;
}

/**
 * Loads questions for several topics and tags each question with its
 * topicId so downstream code can score and group by topic without holding
 * onto the topic list separately.
 * @param {Array<{id: string, file: string}>} topics
 * @returns {Promise<Array<object>>}
 */
export async function loadQuestionsForTopics(topics) {
  const questionSets = await Promise.all(
    topics.map(async (topic) => {
      const questions = await loadTopicQuestions(topic);
      return questions.map((question) => ({ ...question, topicId: topic.id }));
    })
  );
  return questionSets.flat();
}
