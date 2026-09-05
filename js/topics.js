// Loads the topic manifest and topic files from the static data/ folder,
// and normalizes the authored question schema into the shape the rest of
// the app works with.
//
// Authored schema (what topic files contain — see docs/CONTENT_GUIDE.md
// for the full spec): { id, type, category, paragraph | sentence, options,
// correctIndex, explanation, tip, optionNotes? }
// Internal shape (what this module returns): { id, type, category, prompt,
// options, correctAnswer, explanation, tip, optionNotes }
//
// `prompt` is whichever the item type carries: a cloze item's `paragraph`,
// with its blank, or a restatement's `sentence`, without one. The screens
// need to know which they are showing — a restatement needs a lead-in
// telling the learner what to do with the sentence — but nothing else in
// the app has to care, and the scoring does not.
//
// The split exists so content authors write `correctIndex` against a fixed
// options list (robust, easy to author and to validate), while the quiz
// engine scores against a `correctAnswer` string (stable even after the
// options are shuffled for display).

const MANIFEST_URL = "data/manifest.json";
const ROADMAP_URL = "data/roadmap.json";

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

/**
 * What is built and what is coming, as the learner is shown it.
 *
 * A separate file from the manifest on purpose. The manifest is the
 * content index and the validator holds it to a strict shape; this is a
 * short editorial list that changes every time something ships, and it
 * has no business failing a content check. It is also the only file in
 * `data/` that is not content, which is why nothing else reads it.
 *
 * @returns {Promise<{note?: string, items: Array<{status: string, title: string, detail?: string}>}>}
 */
export function loadRoadmap() {
  return loadJson(ROADMAP_URL);
}

/** The item types the app can draw. Absent in a file means CLOZE. */
export const QUESTION_TYPE = {
  /** A passage with one blank — the format everything started as. */
  CLOZE: "cloze",
  /** A sentence and four paraphrases: the exam's "closest meaning". */
  RESTATEMENT: "restatement",
};

function normalizeQuestion(question) {
  const type = question.type ?? QUESTION_TYPE.CLOZE;
  return {
    id: question.id,
    type,
    category: question.category,
    prompt: type === QUESTION_TYPE.RESTATEMENT ? question.sentence : question.paragraph,
    options: question.options,
    correctAnswer: question.options[question.correctIndex],
    explanation: question.explanation,
    tip: question.tip,
    // Keyed by option TEXT, never by index: the engine shuffles options
    // for display, so an index would point at a different option on every
    // attempt. Optional and often partial.
    optionNotes: question.optionNotes ?? null,
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
/**
 * Every lesson there is, from the manifest alone — id, order, topic,
 * category and the one-line summary. No question data, and no topic file
 * fetched at all.
 *
 * This is what the Eğitim index, the Test tab, Profil and the results
 * screen need, and it is 1.7 KB against the 141 KB those screens used to
 * download. The index is generated into the manifest by
 * tools/format-content.mjs and checked by the validator, so it cannot
 * drift from the topic files it was copied out of.
 *
 * @param {{topics: Array<object>}} manifest
 * @returns {Array<{id: string, order: number, topicId: string, topicTitle: string, category: string, summary: string}>}
 */
export function lessonIndex(manifest) {
  return manifest.topics
    .filter((topic) => !topic.comingSoon && Array.isArray(topic.lessons))
    .flatMap((topic) =>
      topic.lessons.map((lesson, index) => ({
        id: lessonId(topic.id, lesson.category),
        order: index + 1,
        topicId: topic.id,
        topicTitle: topic.title,
        // Carried so the Eğitim index can tell a returner that a topic has
        // gained questions since they last opened it. Without it the index
        // has the topic's name and not its version, and the news is
        // unreachable from the only screen a returner lands on.
        contentVersion: topic.contentVersion,
        // One Turkish line saying what this group of six lessons IS.
        // The index shows a topic's English title and nothing else, so a
        // learner who does not already have the category meets
        // "Relative Clauses" and then, immediately, "Who vs Whom vs
        // Whose". Carried here because the index is built from the
        // manifest alone and never fetches a topic file.
        topicGloss: topic.gloss ?? null,
        // Whether this topic has an overview screen. On the manifest so
        // the index can offer the way in without fetching a topic file,
        // which is the whole reason the manifest carries a lesson index
        // at all. Generated by `npm run format`, never authored.
        hasIntro: topic.hasIntro === true,
        // The display grouping, so the Eğitim index can group the way
        // the Test tab already does. It is a grouping and not an order:
        // js/tiers.js says so, and nothing in Eğitim is locked.
        tier: topic.tier,
        category: lesson.category,
        summary: lesson.summary,
      }))
    );
}

/**
 * One topic's whole file, from the same cache every other reader uses.
 *
 * The index deliberately never calls this — that is the 1.7 KB-instead-of-
 * 141 KB decision in `lessonIndex` — but a screen that shows one topic's
 * own content has to fetch that topic, and exactly that topic.
 *
 * @param {{file: string}} topic - a manifest entry
 * @returns {Promise<object>} the parsed topic file
 */
export function loadTopicFile(topic) {
  return loadJson(topic.file);
}

/**
 * The full lessons, blocks and check questions included. Fetches every
 * topic file, so this is only for the reader — anything that just needs
 * the list of lessons wants `lessonIndex` instead.
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

/**
 * Which scored sections of the paper the app still does not practise.
 *
 * Read from the manifest rather than written down, because the answer
 * changes when content ships and a hardcoded list is a promise that goes
 * stale silently — the day `closest-meaning` went live, every sentence
 * naming it as missing became a lie about the app the learner was holding.
 *
 * The section ids are the topic ids that would cover them, which is why a
 * section is "covered" by a live topic of the same name. Reading is 21
 * points and paragraph completion is 9, from the two sample papers in
 * `docs/exam-spec.md`; Session II is listening and is not on this list
 * because no topic id could ever cover it.
 *
 * @param {Array<{id: string, comingSoon?: boolean}>} topics
 * @returns {Array<{label: string, points: number}>}
 */
export function uncoveredSections(topics) {
  const live = new Set(topics.filter((topic) => !topic.comingSoon).map((topic) => topic.id));
  return [
    { id: "closest-meaning", label: "anlamca en yakın cümle", points: 15 },
    { id: "reading", label: "okuma", points: 21 },
    { id: "paragraph-completion", label: "paragraf tamamlama", points: 9 },
  ].filter((section) => !live.has(section.id));
}

/**
 * The sample cloze passage, blank by blank, each tagged with the topic
 * that would cover it.
 *
 * `docs/exam-spec.md` §"Cloze test" is the source, and it is a reading of
 * the paper rather than an opinion: ten blanks, ten different things
 * tested, listed there with the options as printed. What changes over
 * time is not that list but which of those things this app teaches — so
 * the mapping is fixed data and the *count* is derived from the manifest,
 * for exactly the reason `uncoveredSections` is.
 *
 * `topicId: null` is a blank no grammar topic could cover — the two
 * vocabulary items. `so-such` has no topic yet; if one ships under a
 * different id the validator says so rather than letting this quietly
 * under-report.
 */
export const CLOZE_BLANKS = [
  { topicId: "connectors", label: "bağlaçlar" },
  { topicId: "modals", label: "modallar" },
  { topicId: "gerunds-infinitives", label: "ettirgen yapı" },
  { topicId: "modals", label: "modallar" },
  { topicId: null, label: "kelime bilgisi" },
  { topicId: "closest-meaning", label: "karşılaştırmalar" },
  { topicId: "so-such", label: "so / such" },
  { topicId: "relative-clauses", label: "ilgi zamirleri" },
  { topicId: "quantifiers", label: "miktar belirteçleri" },
  { topicId: null, label: "kelime bilgisi" },
];

/**
 * How much of the cloze section the app actually practises.
 *
 * The screen used to say the app covers "paragraf içindeki dilbilgisi ve
 * kelime boşlukları (15 puan)", which is a section's point total in a
 * sentence about coverage — it reads as fifteen points earned when it
 * means fifteen points attempted. Three of the ten blanks are things no
 * lesson here teaches, and two of those three are vocabulary.
 *
 * @param {Array<{id: string, comingSoon?: boolean}>} topics
 * @returns {{total: number, covered: number, missing: string[]}}
 */
export function clozeCoverage(topics) {
  const live = new Set(topics.filter((topic) => !topic.comingSoon).map((topic) => topic.id));
  const covered = CLOZE_BLANKS.filter((blank) => blank.topicId && live.has(blank.topicId));
  const missing = [];
  for (const blank of CLOZE_BLANKS) {
    if ((!blank.topicId || !live.has(blank.topicId)) && !missing.includes(blank.label)) {
      missing.push(blank.label);
    }
  }
  return { total: CLOZE_BLANKS.length, covered: covered.length, missing };
}

/**
 * "Okuma (21 puan) ve paragraf tamamlama (9 puan)" — the same list as a
 * Turkish phrase, with the conjunction the count calls for.
 *
 * @param {Array<{label: string, points: number}>} sections
 * @returns {string}
 */
export function sectionListPhrase(sections) {
  const parts = sections.map((section) => `${section.label} (${section.points} puan)`);
  if (parts.length <= 1) {
    return parts[0] ?? "";
  }
  return `${parts.slice(0, -1).join(", ")} ve ${parts[parts.length - 1]}`;
}
