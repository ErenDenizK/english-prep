// Loads the topic manifest and topic files from the static data/ folder,
// and normalizes the authored question schema into the shape the rest of
// the app works with.
//
// Authored schema (what topic files contain — see docs/CONTENT_GUIDE.md
// for the full spec): { id, category, paragraph, options, correctIndex,
// explanation, tip }
// Internal shape (what this module returns): { id, category, prompt,
// options, correctAnswer, explanation, tip }
//
// The split exists so content authors write `correctIndex` against a fixed
// options list (robust, easy to author and to validate), while the quiz
// engine scores against a `correctAnswer` string (stable even after the
// options are shuffled for display).

const MANIFEST_URL = "data/manifest.json";

// A topic file holds both its questions and its lessons, so the Test tab
// and the Eğitim tab would otherwise fetch and parse the same file twice.
// Cache the in-flight promise, and drop a failed one so a retry actually
// retries instead of replaying the rejection forever.
const fileCache = new Map();

function loadJson(url) {
  if (!fileCache.has(url)) {
    const pending = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url} (HTTP ${response.status}).`);
        }
        return response.json();
      })
      .catch((error) => {
        fileCache.delete(url);
        throw error;
      });
    fileCache.set(url, pending);
  }
  return fileCache.get(url);
}

/**
 * @returns {Promise<{topics: Array<object>}>} the parsed manifest
 */
export function loadManifest() {
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
 * A lesson is identified by the topic it belongs to plus its category —
 * the two things that actually define it. Deriving the id instead of
 * authoring one means content files carry no bookkeeping field that could
 * be duplicated or renumbered by accident, and progress stays attached to
 * the right lesson as long as the category taxonomy holds (which the
 * validator enforces anyway).
 * @param {string} topicId
 * @param {string} category
 * @returns {string}
 */
export function lessonId(topicId, category) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${topicId}-${slug}`;
}

function groupByCategory(questions) {
  const byCategory = new Map();
  for (const question of questions) {
    if (!byCategory.has(question.category)) {
      byCategory.set(question.category, []);
    }
    byCategory.get(question.category).push(question);
  }
  return byCategory;
}

/**
 * Loads the Eğitim syllabus: every live topic's lessons, in topic order
 * and then authored order, each tagged with the topic it came from and
 * with the questions that share its category.
 *
 * Those questions are the lesson's `checkPool`. Embedded check cards draw
 * from the same pool the Test tab uses rather than from a reserved set,
 * so a category never needs two parallel bodies of content kept in sync —
 * and the topic file is one fetch either way.
 *
 * @param {Array<{id: string, title: string, file: string}>} topics
 * @returns {Promise<Array<object>>}
 */
export async function loadLessonsForTopics(topics) {
  const lessonSets = await Promise.all(
    topics.map(async (topic) => {
      const data = await loadJson(topic.file);
      const byCategory = groupByCategory((data.questions ?? []).map(normalizeQuestion));

      return (data.lessons ?? []).map((lesson, index) => ({
        ...lesson,
        id: lessonId(topic.id, lesson.category),
        order: index + 1,
        topicId: topic.id,
        topicTitle: topic.title,
        checkPool: byCategory.get(lesson.category) ?? [],
      }));
    })
  );
  return lessonSets.flat();
}
