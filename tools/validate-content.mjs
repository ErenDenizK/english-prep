#!/usr/bin/env node
// Content validator — the safety net that makes it safe to hand question
// and lesson authoring to someone (or something) other than whoever wrote
// the app. Zero dependencies; run it with `npm run validate`.
//
// It checks three things:
//   1. the manifest is internally valid (ids, tiers, coming-soon rules);
//   2. every topic file matches the schema documented in docs/CONTENT_GUIDE.md;
//   3. the manifest and the topic files agree with each other (question
//      counts, category lists, lesson counts) — the drift that silently
//      breaks home-page cards and the "new questions added" badge.
//
// Errors fail the run (exit 1). Warnings are printed but don't fail, so a
// style nit never blocks a content drop.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TIER_ORDER } from "../js/tiers.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = "data/manifest.json";

const LESSON_STEP_TYPES = new Set(["read", "table", "check"]);
const OPTIONS_PER_QUESTION = 4;
const MIN_CHECK_OPTIONS = 2;
const MAX_CHECK_OPTIONS = 4;
const MIN_EXPLANATION_LENGTH = 40;
const MIN_TIP_LENGTH = 20;
const MIN_PARAGRAPH_WORDS = 15;
const TOPIC_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

// Turkish-language heuristic for the prose fields that must be Turkish
// (explanations, tips, lesson bodies, summaries). Not a language detector —
// just enough to catch a set accidentally authored in English. Deliberately
// not applied to example `note`s: those are terse form labels that mix
// Turkish with English grammar terms ("Alışkanlık → Present Simple"), where
// the heuristic is unreliable and the payoff is low.
const TURKISH_CHARS = /[ıİşŞğĞçÇöÖüÜ]/;
const TURKISH_WORDS = /\b(bir|ve|için|bu|ile|ama|çünkü|değil|gibi|olur|olarak|yani|hangi)\b/i;

class Report {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  error(where, message) {
    this.errors.push({ where, message });
  }

  warn(where, message) {
    this.warnings.push({ where, message });
  }

  print() {
    const line = ({ where, message }) => `  ${where}\n    ${message}`;
    if (this.warnings.length) {
      console.log(`\n${this.warnings.length} warning(s):`);
      console.log(this.warnings.map(line).join("\n"));
    }
    if (this.errors.length) {
      console.log(`\n${this.errors.length} error(s):`);
      console.log(this.errors.map(line).join("\n"));
      console.log("\n✗ Content validation failed.");
      return false;
    }
    console.log(
      `\n✓ Content validation passed${this.warnings.length ? " (with warnings)" : ""}.`
    );
    return true;
  }
}

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isInteger = (value) => Number.isInteger(value);

/** Underscore runs in a prompt. A blank must be exactly four underscores. */
function blankRuns(text) {
  return [...text.matchAll(/_+/g)].map((match) => match[0]);
}

function checkBlanks(report, where, text, { required }) {
  const runs = blankRuns(text);
  const blanks = runs.filter((run) => run.length === 4);
  const malformed = runs.filter((run) => run.length !== 4);

  if (malformed.length) {
    report.error(
      where,
      `blank must be exactly four underscores ("____"); found ${malformed
        .map((run) => `"${run}" (${run.length})`)
        .join(", ")}`
    );
  }
  if (required && blanks.length !== 1) {
    report.error(where, `expected exactly one "____" blank, found ${blanks.length}`);
  }
  if (!required && blanks.length > 1) {
    report.error(where, `expected at most one "____" blank, found ${blanks.length}`);
  }
}

function checkTurkish(report, where, field, text) {
  if (!TURKISH_CHARS.test(text) && !TURKISH_WORDS.test(text)) {
    report.warn(where, `${field} does not look like Turkish — it must be written in Turkish`);
  }
}

function checkBoldMarkers(report, where, text) {
  const markers = (text.match(/\*\*/g) ?? []).length;
  if (markers % 2 !== 0) {
    report.error(where, `unbalanced "**" bold markers in body (${markers} found)`);
  }
}

/**
 * Validates a set of answer options shared by test questions and lesson
 * checks: distinct after the same normalization the quiz engine scores
 * with, so two options can never both light up as correct.
 */
function checkOptions(report, where, options, { min, max }) {
  if (!Array.isArray(options) || options.length < min || options.length > max) {
    const expected = min === max ? `${min}` : `${min}-${max}`;
    report.error(where, `options must be an array of ${expected} strings`);
    return false;
  }
  if (!options.every(isNonEmptyString)) {
    report.error(where, "every option must be a non-empty string");
    return false;
  }
  if (options.some((option) => option !== option.trim())) {
    report.warn(where, "options have leading/trailing whitespace");
  }
  const normalized = options.map((option) => option.trim().toLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    report.error(
      where,
      "options contain duplicates (the quiz engine compares case-insensitively, so both would score as correct)"
    );
    return false;
  }
  return true;
}

function checkCorrectIndex(report, where, correctIndex, optionCount) {
  if (!isInteger(correctIndex) || correctIndex < 0 || correctIndex >= optionCount) {
    report.error(where, `correctIndex must be an integer between 0 and ${optionCount - 1}`);
  }
}

function validateQuestion(report, file, question, index, seenIds, topicId) {
  const where = `${file} › questions[${index}]${question?.id ? ` (${question.id})` : ""}`;

  if (!question || typeof question !== "object") {
    report.error(where, "question must be an object");
    return;
  }

  if (!isNonEmptyString(question.id)) {
    report.error(where, "id is required");
  } else {
    if (!question.id.startsWith(`${topicId}-`)) {
      report.warn(where, `id should start with "${topicId}-" so ids stay traceable to their topic`);
    }
    if (seenIds.has(question.id)) {
      report.error(where, `duplicate id "${question.id}" (ids must be unique across all topics)`);
    }
    seenIds.add(question.id);
  }

  if (!isNonEmptyString(question.category)) {
    report.error(where, "category is required");
  }

  if (!isNonEmptyString(question.paragraph)) {
    report.error(where, "paragraph is required");
  } else {
    checkBlanks(report, where, question.paragraph, { required: true });
    const words = question.paragraph.trim().split(/\s+/).length;
    if (words < MIN_PARAGRAPH_WORDS) {
      report.warn(
        where,
        `paragraph is only ${words} words — the exam format needs 1-3 sentences of real context, not an isolated sentence`
      );
    }
  }

  if (checkOptions(report, where, question.options, { min: OPTIONS_PER_QUESTION, max: OPTIONS_PER_QUESTION })) {
    checkCorrectIndex(report, where, question.correctIndex, question.options.length);
  }

  if (!isNonEmptyString(question.explanation)) {
    report.error(where, "explanation is required");
  } else {
    if (question.explanation.trim().length < MIN_EXPLANATION_LENGTH) {
      report.warn(
        where,
        `explanation is very short (${question.explanation.trim().length} chars) — it must say why the right option fits and why the closest wrong one doesn't`
      );
    }
    checkTurkish(report, where, "explanation", question.explanation);
  }

  if (!isNonEmptyString(question.tip)) {
    report.error(where, "tip is required");
  } else {
    if (question.tip.trim().length < MIN_TIP_LENGTH) {
      report.warn(where, "tip is very short — it should be a standalone, reusable rule");
    }
    checkTurkish(report, where, "tip", question.tip);
  }
}

function validateLessonStep(report, file, lessonLabel, step, index) {
  const where = `${file} › ${lessonLabel} › steps[${index}]`;

  if (!step || typeof step !== "object") {
    report.error(where, "step must be an object");
    return;
  }
  if (!LESSON_STEP_TYPES.has(step.type)) {
    report.error(where, `type must be one of ${[...LESSON_STEP_TYPES].join(", ")}`);
    return;
  }

  if (step.type === "read") {
    if (!isNonEmptyString(step.heading)) report.error(where, "read step needs a heading");
    if (!isNonEmptyString(step.body)) {
      report.error(where, "read step needs a body");
    } else {
      checkBoldMarkers(report, where, step.body);
      checkTurkish(report, where, "body", step.body);
    }
    if (step.examples !== undefined) {
      if (!Array.isArray(step.examples) || step.examples.length === 0) {
        report.error(where, "examples, when present, must be a non-empty array");
      } else {
        step.examples.forEach((example, exampleIndex) => {
          const exampleWhere = `${where} › examples[${exampleIndex}]`;
          if (!isNonEmptyString(example?.sentence)) {
            report.error(exampleWhere, "sentence is required");
          }
          if (!isNonEmptyString(example?.note)) {
            report.error(exampleWhere, "note is required");
          }
        });
      }
    }
    return;
  }

  if (step.type === "table") {
    if (!isNonEmptyString(step.heading)) report.error(where, "table step needs a heading");
    if (!Array.isArray(step.columns) || step.columns.length < 2 || !step.columns.every(isNonEmptyString)) {
      report.error(where, "columns must be an array of at least 2 non-empty strings");
      return;
    }
    if (!Array.isArray(step.rows) || step.rows.length === 0) {
      report.error(where, "rows must be a non-empty array");
      return;
    }
    step.rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row) || row.length !== step.columns.length) {
        report.error(`${where} › rows[${rowIndex}]`, `row must have exactly ${step.columns.length} cells`);
      } else if (!row.every(isNonEmptyString)) {
        report.error(`${where} › rows[${rowIndex}]`, "every cell must be a non-empty string");
      }
    });
    return;
  }

  // step.type === "check"
  if (!isNonEmptyString(step.prompt)) {
    report.error(where, "check step needs a prompt");
  } else {
    checkBlanks(report, where, step.prompt, { required: false });
  }
  if (checkOptions(report, where, step.options, { min: MIN_CHECK_OPTIONS, max: MAX_CHECK_OPTIONS })) {
    checkCorrectIndex(report, where, step.correctIndex, step.options.length);
  }
  if (!isNonEmptyString(step.explanation)) {
    report.error(where, "check step needs an explanation");
  } else {
    checkTurkish(report, where, "explanation", step.explanation);
  }
}

function validateLesson(report, file, lesson, index, seenIds, questionCategories, topicId) {
  const label = `lessons[${index}]${lesson?.id ? ` (${lesson.id})` : ""}`;
  const where = `${file} › ${label}`;

  if (!lesson || typeof lesson !== "object") {
    report.error(where, "lesson must be an object");
    return null;
  }

  if (!isNonEmptyString(lesson.id)) {
    report.error(where, "id is required");
  } else {
    if (!lesson.id.startsWith(`${topicId}-`)) {
      report.warn(where, `id should start with "${topicId}-"`);
    }
    if (seenIds.has(lesson.id)) {
      report.error(where, `duplicate lesson id "${lesson.id}"`);
    }
    seenIds.add(lesson.id);
  }

  if (!isInteger(lesson.order) || lesson.order < 1) {
    report.error(where, "order must be an integer >= 1");
  }
  if (!isNonEmptyString(lesson.title)) report.error(where, "title is required");
  if (!isNonEmptyString(lesson.summary)) {
    report.error(where, "summary is required (shown on the lesson index card)");
  } else {
    checkTurkish(report, where, "summary", lesson.summary);
  }

  if (!isNonEmptyString(lesson.category)) {
    report.error(where, "category is required");
  } else if (questionCategories.size && !questionCategories.has(lesson.category)) {
    report.error(
      where,
      `category "${lesson.category}" is not used by any question in this topic — lessons and questions must share one taxonomy`
    );
  }

  if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) {
    report.error(where, "steps must be a non-empty array");
    return lesson.order;
  }

  lesson.steps.forEach((step, stepIndex) => validateLessonStep(report, file, label, step, stepIndex));

  if (!lesson.steps.some((step) => step?.type === "check")) {
    report.error(
      where,
      "lesson has no check step — every lesson must ask the learner at least one question (that's what makes Eğitim interactive rather than a slideshow)"
    );
  }

  return lesson.order;
}

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw);
}

function sameSet(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

async function validateTopicFile(report, topic, seenQuestionIds, seenLessonIds) {
  const file = topic.file;
  let data;
  try {
    data = await readJson(file);
  } catch (error) {
    report.error(file, `could not read/parse: ${error.message}`);
    return;
  }

  if (data.topicId !== topic.id) {
    report.error(file, `topicId "${data.topicId}" does not match the manifest id "${topic.id}"`);
  }
  if (data.title !== topic.title) {
    report.error(file, `title "${data.title}" does not match the manifest title "${topic.title}"`);
  }
  if (!isNonEmptyString(data.level)) {
    report.warn(file, "level is missing (e.g. \"B2-C1\")");
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    report.error(file, "questions must be a non-empty array");
    return;
  }

  data.questions.forEach((question, index) =>
    validateQuestion(report, file, question, index, seenQuestionIds, topic.id)
  );

  if (data.questions.length !== topic.questionCount) {
    report.error(
      file,
      `has ${data.questions.length} questions but the manifest says questionCount: ${topic.questionCount}`
    );
  }

  const questionCategories = new Set(
    data.questions.map((question) => question?.category).filter(isNonEmptyString)
  );

  if (topic.categories !== undefined) {
    if (!Array.isArray(topic.categories) || !topic.categories.every(isNonEmptyString)) {
      report.error(MANIFEST_PATH, `topic "${topic.id}": categories must be an array of non-empty strings`);
    } else if (!sameSet(new Set(topic.categories), questionCategories)) {
      const manifestOnly = topic.categories.filter((category) => !questionCategories.has(category));
      const fileOnly = [...questionCategories].filter((category) => !topic.categories.includes(category));
      report.error(
        MANIFEST_PATH,
        `topic "${topic.id}": categories are out of sync with ${file}` +
          (manifestOnly.length ? `\n    only in manifest: ${manifestOnly.join(", ")}` : "") +
          (fileOnly.length ? `\n    only in questions: ${fileOnly.join(", ")}` : "")
      );
    }
  }

  const lessons = data.lessons;
  if (lessons === undefined) {
    report.warn(file, "no lessons — this topic will not appear in the Eğitim tab");
    if (topic.lessonCount !== undefined) {
      report.error(MANIFEST_PATH, `topic "${topic.id}": lessonCount is set but the file has no lessons`);
    }
    return;
  }

  if (!Array.isArray(lessons) || lessons.length === 0) {
    report.error(file, "lessons, when present, must be a non-empty array");
    return;
  }

  const orders = lessons.map((lesson, index) =>
    validateLesson(report, file, lesson, index, seenLessonIds, questionCategories, topic.id)
  );

  const expected = Array.from({ length: lessons.length }, (_, i) => i + 1);
  const actual = orders.filter(isInteger).slice().sort((a, b) => a - b);
  if (actual.length === lessons.length && actual.join(",") !== expected.join(",")) {
    report.error(
      file,
      `lesson "order" values must be 1..${lessons.length} with no gaps or duplicates (found ${actual.join(", ")})`
    );
  }

  if (topic.lessonCount !== undefined && topic.lessonCount !== lessons.length) {
    report.error(
      MANIFEST_PATH,
      `topic "${topic.id}": lessonCount is ${topic.lessonCount} but the file has ${lessons.length} lessons`
    );
  }

  const lessonCategories = new Set(lessons.map((lesson) => lesson?.category).filter(isNonEmptyString));
  const uncovered = [...questionCategories].filter((category) => !lessonCategories.has(category));
  if (uncovered.length) {
    report.warn(
      file,
      `these categories have questions but no lesson: ${uncovered.join(", ")}`
    );
  }
}

async function main() {
  const report = new Report();

  let manifest;
  try {
    manifest = await readJson(MANIFEST_PATH);
  } catch (error) {
    console.error(`✗ Could not read ${MANIFEST_PATH}: ${error.message}`);
    process.exit(1);
  }

  if (!Array.isArray(manifest.topics) || manifest.topics.length === 0) {
    report.error(MANIFEST_PATH, "topics must be a non-empty array");
    report.print();
    process.exit(1);
  }

  const seenTopicIds = new Set();
  const seenQuestionIds = new Set();
  const seenLessonIds = new Set();
  const liveTopics = [];

  for (const [index, topic] of manifest.topics.entries()) {
    const where = `${MANIFEST_PATH} › topics[${index}]${topic?.id ? ` (${topic.id})` : ""}`;

    if (!topic || typeof topic !== "object") {
      report.error(where, "topic must be an object");
      continue;
    }
    if (!isNonEmptyString(topic.id)) {
      report.error(where, "id is required");
    } else {
      if (!TOPIC_ID_PATTERN.test(topic.id)) {
        report.error(where, `id "${topic.id}" must be a lowercase slug (letters, digits, hyphens)`);
      }
      if (seenTopicIds.has(topic.id)) {
        report.error(where, `duplicate topic id "${topic.id}"`);
      }
      seenTopicIds.add(topic.id);
    }
    if (!isNonEmptyString(topic.title)) report.error(where, "title is required");
    if (!TIER_ORDER.includes(topic.tier)) {
      report.error(where, `tier must be one of ${TIER_ORDER.join(", ")} (found ${JSON.stringify(topic.tier)})`);
    }
    if (topic.contentVersion !== undefined && (!isInteger(topic.contentVersion) || topic.contentVersion < 1)) {
      report.error(where, "contentVersion must be an integer >= 1");
    }

    if (topic.comingSoon === true) {
      for (const field of ["file", "questionCount", "lessonCount"]) {
        if (topic[field] !== undefined) {
          report.error(
            where,
            `comingSoon topic must not declare "${field}" — drop comingSoon once the content exists`
          );
        }
      }
      continue;
    }
    if (topic.comingSoon !== undefined) {
      report.error(where, "comingSoon must either be true or omitted entirely");
    }

    if (!isNonEmptyString(topic.file)) {
      report.error(where, "file is required for a live topic");
      continue;
    }
    if (!existsSync(path.join(ROOT, topic.file))) {
      report.error(where, `file "${topic.file}" does not exist`);
      continue;
    }
    if (!isInteger(topic.questionCount) || topic.questionCount < 1) {
      report.error(where, "questionCount must be an integer >= 1");
    }
    if (topic.lessonCount !== undefined && (!isInteger(topic.lessonCount) || topic.lessonCount < 1)) {
      report.error(where, "lessonCount must be an integer >= 1");
    }

    liveTopics.push(topic);
  }

  for (const topic of liveTopics) {
    await validateTopicFile(report, topic, seenQuestionIds, seenLessonIds);
  }

  console.log(
    `Checked ${manifest.topics.length} manifest topic(s): ` +
      `${liveTopics.length} live, ${manifest.topics.length - liveTopics.length} coming soon. ` +
      `${seenQuestionIds.size} question(s), ${seenLessonIds.size} lesson(s).`
  );

  process.exit(report.print() ? 0 : 1);
}

await main();
