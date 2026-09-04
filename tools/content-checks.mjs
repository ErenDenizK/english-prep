// The content checks that could not live in the schema validator.
//
// They are here rather than in tools/validate-content.mjs for the same
// reason tools/color.mjs is not inside tools/palette.mjs: a script with a
// top-level await main() cannot be imported, so nothing in it can be unit
// tested, and these are the checks whose thresholds most need a test
// around them. tests/content-checks.test.mjs plants each defect and asserts
// it is caught.
//
// Each takes a `report` with .error(where, message) and .warn(where,
// message) — the validator's Report class, or anything shaped like it.

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

/** The manifest is where a corpus-wide finding is reported against. */
const MANIFEST_PATH = "data/manifest.json";

/**
 * A question's own text, whichever field its type keeps it in: a cloze
 * item's `paragraph`, a restatement's `sentence`. Every check below works
 * on the stem rather than on a field name, so a new item type costs one
 * line here instead of four scattered ones.
 */
const stemOf = (question) => question?.paragraph ?? question?.sentence ?? "";

/* Corpus-wide thresholds. All four of these enforce rules
 * docs/CONTENT_GUIDE.md already states and could not previously check —
 * they are the difference between a schema validator and a content one.
 *
 * They are corpus-wide on purpose: a near-duplicate stem or an over-used
 * scenario is invisible inside one topic file and obvious across three.
 */

/** Token-trigram Jaccard above this and two stems are the same question. */
const STEM_SIMILARITY_LIMIT = 0.3;
/** A content word in this share of one category's questions is its scenario, not its context. */
const CATEGORY_SCENARIO_SHARE = 0.75;
/** A content word in this share of the whole corpus is a rut. */
const CORPUS_SCENARIO_SHARE = 0.15;
/** Below this, a category is too small for the count to mean anything. */
const MIN_CATEGORY_FOR_SCENARIO = 3;
/** And below this there is no corpus to speak of — one topic's worth. */
const MIN_CORPUS_FOR_SCENARIO = 24;
/** Words too short to be a scenario. */
const SCENARIO_MIN_LENGTH = 5;

/* Irregular verbs whose regular -ed form is not a word. An option like
 * "leaved" is a dead option in the exact sense docs/agents/reviewer.md
 * means by D2: no learner considers it, so a four-option item is really a
 * three-option item, and the item measures less than it claims to.
 *
 * Deliberately not the full irregular list — only stems whose *-ed form
 * is not also a real English word. "found"/"founded", "hanged"/"hung",
 * "lied"/"lay" are all legitimate and must not be flagged.
 */
/* Real English words that the rule above would otherwise call invented:
 * "seed" strips to "see". Add to this rather than removing a stem from
 * NO_ED_FORM, which would lose the check for the whole verb.
 */
const REAL_ED_WORDS = new Set(["seed"]);

const NO_ED_FORM = new Set([
  "become", "begin", "bring", "buy", "catch", "choose", "come", "do", "draw",
  "drink", "drive", "eat", "fall", "feel", "fight", "fly", "forget", "get",
  "give", "go", "grow", "hear", "hold", "keep", "know", "leave", "lend",
  "lose", "make", "mean", "meet", "pay", "read", "ride", "rise", "run",
  "say", "see", "sell", "send", "sing", "sit", "sleep", "speak", "spend",
  "stand", "steal", "swim", "take", "teach", "tell", "think", "throw",
  "understand", "wear", "win", "write",
]);

/* Function words, and the vocabulary of the grammar itself. Excluded from
 * the scenario count because "would" recurring across a modals topic is
 * the topic, not a rut. Everything else is left in: the check is meant to
 * be data-driven, so it should not need a scenario lexicon anybody has to
 * maintain.
 */
const SCENARIO_STOPWORDS = new Set([
  "about", "after", "again", "against", "already", "although", "always",
  "another", "anything", "because", "before", "being", "below", "between",
  "could", "doesn", "don't", "during", "eight", "either", "enough", "even",
  "every", "everyone", "everything", "first", "found", "further", "going",
  "hasn", "have", "haven", "having", "hundred", "instead", "isn't", "itself",
  "just", "might", "more", "most", "much", "must", "mustn", "myself",
  "never", "nobody", "nothing", "other", "ought", "over", "really", "right",
  "same", "seven", "several", "shall", "should", "shouldn", "since", "some",
  "someone", "something", "still", "such", "than", "that", "their", "them",
  "then", "there", "these", "they", "thing", "things", "third", "this",
  "those", "three", "through", "under", "until", "very", "what", "when",
  "where", "whether", "which", "while", "whole", "will", "with", "within",
  "without", "would", "wouldn", "yesterday", "your",
]);

/* The validator checks one file against the schema. These four check the
 * *content* against rules docs/CONTENT_GUIDE.md states in prose and could
 * not previously enforce — and three of the four can only be answered by
 * looking at every question at once.
 *
 * They are warnings, not errors, and deliberately so: each describes a
 * question that works and measures less than it should, which is a thing
 * to fix in an authoring round rather than a thing to block a commit on.
 * The one exception is a dead option, which is a defect in the item as
 * shipped.
 */

/** Content words of a paragraph, blank removed, deduplicated. */
function scenarioWords(paragraph) {
  return new Set(
    paragraph
      .toLowerCase()
      .replace(/____/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length >= SCENARIO_MIN_LENGTH && !SCENARIO_STOPWORDS.has(word))
  );
}

/**
 * Token trigrams plus bare tokens. Trigrams catch a reused sentence
 * frame; bare tokens catch a reused scenario with the words reordered.
 * Either alone misses half of what a duplicate looks like in practice.
 */
function stemShingles(paragraph) {
  const words = paragraph
    .toLowerCase()
    .replace(/____/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const shingles = new Set(words);
  for (let i = 0; i + 2 < words.length; i += 1) {
    shingles.add(words.slice(i, i + 3).join(" "));
  }
  return shingles;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) {
      intersection += 1;
    }
  }
  return intersection / (a.size + b.size - intersection);
}

/**
 * 1 · The explanation must name a distractor.
 *
 * CONTENT_GUIDE requires an explanation to say why the correct option
 * fits *and* why the closest wrong one doesn't. An explanation that only
 * argues for the key is the most common defect in this corpus, and the
 * one that makes a review feel productive while teaching nothing: the
 * learner who chose the distractor is told what is right and never told
 * why what they chose is wrong.
 *
 * Checked by looking for a wrong option's own text inside the
 * explanation. That is a floor, not a ceiling — an explanation can quote
 * an option and still not argue against it — so this catches the absence
 * of the move, not the quality of it. Reported once per topic: at the
 * volumes stage 3 implies, one warning per question would bury every
 * other warning here.
 */
export function checkExplanationsNameDistractors(report, file, questions) {
  const silent = questions
    .filter((question) => {
      if (!isNonEmptyString(question?.explanation) || !Array.isArray(question.options)) {
        return false;
      }
      const explanation = question.explanation.toLowerCase();
      return !question.options.some(
        (option, index) =>
          index !== question.correctIndex &&
          isNonEmptyString(option) &&
          explanation.includes(option.toLowerCase())
      );
    })
    .map((question) => question.id);

  if (silent.length) {
    report.warn(
      file,
      `${silent.length} of ${questions.length} explanations never name a wrong option, ` +
        `so they argue only for the key:\n    ${silent.join(", ")}`
    );
  }
}

/**
 * 2 · Banned option forms.
 *
 * A four-option item with a dead option is a three-option item. These are
 * the dead-option shapes a script can actually see:
 *
 *   - an invented -ed past of an irregular verb ("leaved", "teached");
 *   - two options differing only in case or spacing, which is one option
 *     written twice;
 *   - the correct answer appearing verbatim elsewhere in the paragraph,
 *     which hands the item to anyone who reads before choosing.
 *
 * The first is an error: it ships a non-word to somebody studying for an
 * exam. The other two are warnings.
 */
export function checkOptionForms(report, where, question) {
  const options = question.options;
  if (!Array.isArray(options)) {
    return;
  }

  for (const option of options) {
    if (!isNonEmptyString(option)) {
      continue;
    }
    for (const word of option.toLowerCase().split(/\s+/)) {
      if (!word.endsWith("ed") || REAL_ED_WORDS.has(word)) {
        continue;
      }
      const stem = word.slice(0, -2);
      // Three spellings of the same invented past, and all three occur:
      // "teached" drops nothing, "leaved" dropped a silent e, "runned"
      // doubled the final consonant.
      const candidates = [stem, `${stem}e`];
      if (stem.length > 1 && stem[stem.length - 1] === stem[stem.length - 2]) {
        candidates.push(stem.slice(0, -1));
      }
      if (candidates.some((candidate) => NO_ED_FORM.has(candidate))) {
        report.error(
          where,
          `option "${option}" contains "${word}", which is not an English word — ` +
            `a dead option makes this a three-option question`
        );
      }
    }
  }

  const seen = new Set();
  for (const option of options.filter(isNonEmptyString)) {
    const normalised = option.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(normalised)) {
      report.warn(where, `two options are the same once case and spacing are ignored: "${normalised}"`);
    }
    seen.add(normalised);
  }

  const answer = options[question.correctIndex];
  const stem = stemOf(question);
  if (isNonEmptyString(answer) && isNonEmptyString(stem)) {
    const rest = stem.replace(/____/g, " ").toLowerCase();
    const needle = answer.toLowerCase();
    if (needle.split(/\s+/).length > 1 && rest.includes(needle)) {
      report.warn(
        where,
        `the correct answer "${answer}" also appears in the question's own text — ` +
          `the item can be answered by matching rather than by choosing`
      );
    }
  }
}

/**
 * 3 · Near-duplicate stems, across the whole corpus.
 *
 * Two questions built on one scenario measure the same thing twice, and
 * the second measures memory of the first. At four questions per category
 * that is a quarter of the evidence for a category gone.
 *
 * Also flagged: two questions in one category with an identical option
 * set. Not always wrong — a deduction category legitimately offers
 * must/can't/might again and again — but worth seeing, because it is what
 * an item pool looks like just before it stops discriminating.
 */
export function checkNearDuplicates(report, questions) {
  const shingles = questions.map((question) =>
    isNonEmptyString(stemOf(question)) ? stemShingles(stemOf(question)) : new Set()
  );

  for (let i = 0; i < questions.length; i += 1) {
    for (let j = i + 1; j < questions.length; j += 1) {
      const similarity = jaccard(shingles[i], shingles[j]);
      if (similarity >= STEM_SIMILARITY_LIMIT) {
        report.warn(
          questions[i].file,
          `"${questions[i].id}" and "${questions[j].id}" share ${(similarity * 100).toFixed(0)}% ` +
            `of their wording — the second one measures memory of the first`
        );
      }
    }
  }

  const byOptionSet = new Map();
  for (const question of questions) {
    if (!Array.isArray(question.options) || !isNonEmptyString(question.category)) {
      continue;
    }
    const key = `${question.category} ${[...question.options]
      .map((option) => String(option).toLowerCase())
      .sort()
      .join("|")}`;
    if (!byOptionSet.has(key)) {
      byOptionSet.set(key, []);
    }
    byOptionSet.get(key).push(question);
  }
  for (const group of byOptionSet.values()) {
    if (group.length > 1) {
      report.warn(
        group[0].file,
        `${group.map((question) => question.id).join(", ")} offer an identical set of options ` +
          `within "${group[0].category}"`
      );
    }
  }
}

/**
 * 4 · Scenario over-use.
 *
 * Every paragraph in this app is a small piece of fiction, and an author
 * writing forty of them in one sitting writes forty about university.
 * That is a validity problem rather than a style one: a learner who has
 * only ever met the present perfect in a library sentence has learned the
 * library sentence.
 *
 * Data-driven on purpose — no scenario lexicon for anybody to maintain.
 * Function words and the grammar's own vocabulary are excluded, because
 * "would" recurring across a modals topic is the topic, not a rut.
 */
export function checkScenarioReuse(report, questions) {
  const byCategory = new Map();
  const corpusCounts = new Map();

  for (const question of questions) {
    if (!isNonEmptyString(stemOf(question)) || !isNonEmptyString(question.category)) {
      continue;
    }
    const words = scenarioWords(stemOf(question));
    for (const word of words) {
      corpusCounts.set(word, (corpusCounts.get(word) ?? 0) + 1);
    }
    const key = `${question.topicId} ${question.category}`;
    if (!byCategory.has(key)) {
      byCategory.set(key, {
        file: question.file,
        category: question.category,
        total: 0,
        counts: new Map(),
      });
    }
    const bucket = byCategory.get(key);
    bucket.total += 1;
    for (const word of words) {
      bucket.counts.set(word, (bucket.counts.get(word) ?? 0) + 1);
    }
  }

  for (const bucket of byCategory.values()) {
    if (bucket.total < MIN_CATEGORY_FOR_SCENARIO) {
      continue;
    }
    const shared = [...bucket.counts]
      .filter(([, count]) => count > 1 && count / bucket.total >= CATEGORY_SCENARIO_SHARE)
      .map(([word, count]) => `${word} (${count}/${bucket.total})`);
    if (shared.length) {
      report.warn(
        bucket.file,
        `"${bucket.category}" builds its questions on one scenario: ${shared.join(", ")}`
      );
    }
  }

  if (questions.length < MIN_CORPUS_FOR_SCENARIO) {
    return;
  }

  const overused = [...corpusCounts]
    .filter(([, count]) => count / questions.length >= CORPUS_SCENARIO_SHARE)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => `${word} (${count}/${questions.length})`);
  if (overused.length) {
    report.warn(MANIFEST_PATH, `the corpus keeps returning to one setting: ${overused.join(", ")}`);
  }
}

// An option note is a gloss, not a second explanation: what this one word
// means and why the paragraph does not select it. Past this it is
// competing with the explanation it sits under.
const MAX_OPTION_NOTE_LENGTH = 160;

/* An optional per-option gloss, keyed BY THE OPTION TEXT.
 *
 * Not an array parallel to `options`, because the quiz engine shuffles
 * options for display (js/quiz-engine.js) and scores against the answer
 * STRING rather than an index. A parallel array would be permuted apart
 * from its own options on every attempt, silently. A keyed object cannot
 * drift, and the key set can be checked against the option set here — so
 * an alignment error is impossible rather than invisible.
 *
 * It is optional and may be partial: one grammar distractor sometimes
 * needs a word of its own and the other two fail for the reason the
 * explanation already gives. It becomes the minimum honest explanation
 * for a vocabulary set, where every wrong option is a different word.
 *
 * `checkTurkish` is injected rather than imported: it is the validator's
 * own prose heuristic, and it carries the validator's word lists. A test
 * that only cares about the key/option alignment can leave it out.
 */
export function checkOptionNotes(report, where, question, checkTurkish = () => {}) {
  const notes = question.optionNotes;
  if (notes === undefined) {
    return;
  }
  if (typeof notes !== "object" || notes === null || Array.isArray(notes)) {
    report.error(where, "optionNotes must be an object keyed by option text");
    return;
  }
  if (!Array.isArray(question.options)) {
    return;
  }
  const correct = question.options[question.correctIndex];
  for (const [option, note] of Object.entries(notes)) {
    if (!question.options.includes(option)) {
      report.error(where, `optionNotes has a key that is not an option: "${option}"`);
      continue;
    }
    if (option === correct) {
      report.error(
        where,
        "optionNotes covers the correct answer — the explanation already argues for it, and a note beside it reads as a second key"
      );
    }
    if (typeof note !== "string" || note.trim() === "") {
      report.error(where, `optionNotes["${option}"] must be a non-empty string`);
      continue;
    }
    if (note.trim().length > MAX_OPTION_NOTE_LENGTH) {
      report.warn(
        where,
        `optionNotes["${option}"] is ${note.trim().length} chars — past ${MAX_OPTION_NOTE_LENGTH} it competes with the explanation it sits under`
      );
    }
    checkTurkish(report, where, `optionNotes["${option}"]`, note);
  }
}

/**
 * Example sentences a lesson prints, from every block type that carries
 * one. The reader shows these two or three blocks above a `check`, which
 * is filled from the questions in the same category — so a sentence here
 * that IS a question's keyed sentence hands the learner the answer.
 */
export function lessonSentences(lesson) {
  const out = [];
  for (const block of lesson.blocks ?? []) {
    for (const side of block.sides ?? []) {
      if (isNonEmptyString(side.example)) out.push(side.example);
    }
    for (const row of block.rows ?? []) {
      if (isNonEmptyString(row.example)) out.push(row.example);
    }
    for (const item of block.items ?? []) {
      if (isNonEmptyString(item.sentence)) out.push(item.sentence);
    }
    for (const field of ["wrong", "right"]) {
      if (isNonEmptyString(block[field])) out.push(block[field]);
    }
  }
  return out;
}

/** Contractions expanded, punctuation dropped, case folded. "I've already
 *  finished" and "I have already finished" are the same sentence to a
 *  learner who has just read one and is being asked the other. */
function normalizeSentence(text) {
  return text
    .toLowerCase()
    .replace(/[’']ve\b/g, " have")
    .replace(/[’']s\b/g, " is")
    .replace(/[’']re\b/g, " are")
    .replace(/[’']ll\b/g, " will")
    .replace(/[’']d\b/g, " would")
    .replace(/n[’']t\b/g, " not")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GIVEAWAY_RUN = 6;

/** The longest run of consecutive words the two share. */
function longestSharedRun(a, b) {
  const left = a.split(" ");
  const right = new Set();
  const rightWords = b.split(" ");
  for (let size = Math.min(left.length, rightWords.length); size >= 1; size -= 1) {
    right.clear();
    for (let i = 0; i + size <= rightWords.length; i += 1) {
      right.add(rightWords.slice(i, i + size).join(" "));
    }
    for (let i = 0; i + size <= left.length; i += 1) {
      if (right.has(left.slice(i, i + size).join(" "))) {
        return size;
      }
    }
  }
  return 0;
}

/**
 * A question must never be built on a sentence from its own lesson.
 *
 * `docs/agents/question-author.md` states the rule and `checkIntroGiveaway`
 * has enforced it for the intro screen since the intros shipped. It was
 * never enforced for the lesson itself, and the sufficiency pass of
 * 2026-09-04 found the consequence: 49 of the 72 questions in the three
 * oldest topics have their keyed sentence reproduced inside their own
 * lesson, and in 9 of the 18 lessons all four do. A `check` block draws
 * from the same category, so the learner meets the answer two blocks
 * above the question.
 *
 * A WARNING rather than an error, for now, and only because of the size
 * of the backlog: making it an error today would fail CI on fifty items
 * that a repair pass is working through. It measures the backlog, stops
 * it growing, and becomes an error when the count reaches zero.
 */
export function checkLessonGiveaway(report, file, lesson, questions) {
  const sentences = lessonSentences(lesson).map((raw) => ({
    raw,
    normalized: normalizeSentence(raw),
  }));
  if (sentences.length === 0) {
    return;
  }

  for (const question of questions) {
    const stem = question.paragraph ?? question.sentence ?? "";
    const key = question.options?.[question.correctIndex];
    if (!isNonEmptyString(stem) || !isNonEmptyString(key)) {
      continue;
    }
    const filled = normalizeSentence(stem.replace(/_{2,}/, key));
    const normalizedKey = normalizeSentence(key);
    for (const sentence of sentences) {
      const run = longestSharedRun(filled, sentence.normalized);
      // Six words of shared frame is not by itself a giveaway — "by the
      // end of the week" is six words and belongs to nobody. What makes
      // it one is the lesson sentence also carrying the keyed form, so
      // the learner has seen this frame WITH this answer in it. A very
      // long run is a giveaway on its own: at eight words the two
      // sentences are the same sentence whatever the key is doing.
      const carriesKey = sentence.normalized.includes(normalizedKey);
      if (run >= GIVEAWAY_RUN && (carriesKey || run >= GIVEAWAY_RUN + 2)) {
        report.warn(
          `${file} › ${lesson.category}`,
          `${question.id}'s keyed sentence shares ${run} words with a sentence in its own ` +
            `lesson ("${sentence.raw}") — a check block draws from this category, so the ` +
            "learner meets the answer above the question"
        );
        break;
      }
    }
  }
}
