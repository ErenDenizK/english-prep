// Loads the topic manifest and question sets from the static data/ folder,
// and normalizes the authored question schema into the shape the rest of
// the app works with.
//
// Authored schema (what question files contain, see README for the full
// spec): { id, category, paragraph, options, correctIndex, explanation, tip }
// Internal shape (what this module returns): { id, category, prompt,
// options, correctAnswer, explanation, tip }
//
// The split exists so content authors write `correctIndex` against a fixed
// options list (robust, easy for AI to generate), while the quiz engine
// scores against a `correctAnswer` string (stable even after options are
// shuffled for display).

const MANIFEST_URL = "data/manifest.json";

/**
 * Reads one of the data/ JSON files.
 *
 * Normally that's a fetch. The generated single-file build has no server
 * to fetch from, so it inlines the same JSON under this global and this
 * function reads it from there instead — which is what lets the preview
 * run the real modules rather than a hand-copied imitation of them.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function loadJson(url) {
  const embedded = globalThis.__ENGLISH_PREP_DATA__;
  if (embedded) {
    if (!embedded[url]) {
      throw new Error(`No embedded data for "${url}".`);
    }
    return embedded[url];
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load "${url}".`);
  }
  return response.json();
}

/**
 * @returns {Promise<{topics: Array<{id: string, title: string, tier: string, file: string, questionCount: number}>}>}
 */
export async function loadManifest() {
  return loadJson(MANIFEST_URL);
}

function normalizeQuestion(question) {
  return {
    id: question.id,
    category: question.category,
    prompt: question.paragraph,
    options: question.options,
    correctAnswer: question.options[question.correctIndex],
    explanation: question.explanation,
    tip: question.tip,
  };
}

/**
 * @param {{id: string, file: string}} topic
 * @returns {Promise<Array<object>>} the topic's questions, normalized
 */
export async function loadTopicQuestions(topic) {
  const data = await loadJson(topic.file);
  return data.questions.map(normalizeQuestion);
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

/**
 * Loads a topic's lessons and questions together from its one JSON file
 * (a single fetch — the Eğitim story-card viewer needs both at once, to
 * pull a chapter's embedded check questions from the same category).
 * @param {{id: string, file: string}} topic
 * @returns {Promise<{lessons: Array<object>, questions: Array<object>}>}
 */
export async function loadTopicContent(topic) {
  const data = await loadJson(topic.file);
  return {
    lessons: data.lessons ?? [],
    questions: (data.questions ?? []).map(normalizeQuestion),
  };
}
