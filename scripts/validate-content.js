#!/usr/bin/env node
// Validates data/manifest.json and every topic file it references against
// the schema documented in README.md. No dependencies, no build step —
// plain Node + fs/JSON, matching the rest of this project. Run it after
// adding or editing any topic content:
//
//   node scripts/validate-content.js
//
// Exits 1 (and prints every problem found) if anything is wrong; exits 0
// and prints a per-topic summary if everything checks out.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "data", "manifest.json");

const errors = [];

function fail(context, message) {
  errors.push(`${context}: ${message}`);
}

function readJson(absPath, context) {
  if (!fs.existsSync(absPath)) {
    fail(context, `file not found: ${path.relative(ROOT, absPath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(absPath, "utf8"));
  } catch (error) {
    fail(context, `invalid JSON — ${error.message}`);
    return null;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function countBlanks(paragraph) {
  return (paragraph.match(/____/g) ?? []).length;
}

function validateQuestion(question, context) {
  if (!isNonEmptyString(question.id)) fail(context, "missing/empty `id`");
  if (!isNonEmptyString(question.category)) fail(context, "missing/empty `category`");
  if (!isNonEmptyString(question.paragraph)) {
    fail(context, "missing/empty `paragraph`");
  } else if (countBlanks(question.paragraph) !== 1) {
    fail(context, `\`paragraph\` must contain exactly one "____" blank (found ${countBlanks(question.paragraph)})`);
  }
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    fail(context, `\`options\` must be an array of exactly 4 strings (got ${Array.isArray(question.options) ? question.options.length : typeof question.options})`);
  } else if (!question.options.every(isNonEmptyString)) {
    fail(context, "every entry in `options` must be a non-empty string");
  }
  if (
    typeof question.correctIndex !== "number" ||
    !Number.isInteger(question.correctIndex) ||
    question.correctIndex < 0 ||
    question.correctIndex > 3
  ) {
    fail(context, `\`correctIndex\` must be an integer 0-3 (got ${JSON.stringify(question.correctIndex)})`);
  }
  if (!isNonEmptyString(question.explanation)) fail(context, "missing/empty `explanation`");
  if (!isNonEmptyString(question.tip)) fail(context, "missing/empty `tip`");
}

function validateLesson(lesson, context) {
  if (!isNonEmptyString(lesson.category)) fail(context, "missing/empty `category`");
  if (!isNonEmptyString(lesson.rule)) fail(context, "missing/empty `rule`");
  if (!Array.isArray(lesson.examples) || lesson.examples.length === 0) {
    fail(context, "`examples` must be a non-empty array");
  } else {
    lesson.examples.forEach((example, index) => {
      if (!isNonEmptyString(example?.sentence)) fail(context, `examples[${index}] missing/empty \`sentence\``);
      if (!isNonEmptyString(example?.note)) fail(context, `examples[${index}] missing/empty \`note\``);
    });
  }
  if (lesson.intro !== undefined && !isNonEmptyString(lesson.intro)) {
    fail(context, "`intro` is present but empty/not a string");
  }
}

function validateTopicFile(topic) {
  const context = `topic "${topic.id}" (${topic.file})`;
  const absPath = path.join(ROOT, topic.file);
  const data = readJson(absPath, context);
  if (!data) return;

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    fail(context, "`questions` must be a non-empty array");
    return;
  }

  const seenIds = new Set();
  data.questions.forEach((question, index) => {
    validateQuestion(question, `${context} questions[${index}]`);
    if (isNonEmptyString(question.id)) {
      if (seenIds.has(question.id)) fail(context, `duplicate question id "${question.id}"`);
      seenIds.add(question.id);
    }
  });

  if (typeof topic.questionCount === "number" && topic.questionCount !== data.questions.length) {
    fail(context, `manifest \`questionCount\` (${topic.questionCount}) does not match actual question count (${data.questions.length})`);
  }

  const questionCategories = new Set(data.questions.map((q) => q.category).filter(isNonEmptyString));

  if (data.lessons !== undefined) {
    if (!Array.isArray(data.lessons)) {
      fail(context, "`lessons` must be an array when present");
    } else {
      data.lessons.forEach((lesson, index) => validateLesson(lesson, `${context} lessons[${index}]`));
      const lessonCategories = new Set(data.lessons.map((l) => l.category).filter(isNonEmptyString));
      for (const category of lessonCategories) {
        if (!questionCategories.has(category)) {
          fail(context, `lesson category "${category}" has no matching questions`);
        }
      }
      for (const category of questionCategories) {
        if (!lessonCategories.has(category)) {
          fail(context, `question category "${category}" has no matching lesson`);
        }
      }
    }
  }

  if (Array.isArray(topic.categories)) {
    const manifestCategories = new Set(topic.categories);
    for (const category of questionCategories) {
      if (!manifestCategories.has(category)) {
        fail(context, `question category "${category}" is missing from the manifest's \`categories\` list`);
      }
    }
  }
}

function main() {
  const manifest = readJson(MANIFEST_PATH, "manifest.json");
  if (!manifest) {
    printAndExit();
    return;
  }

  if (!Array.isArray(manifest.topics)) {
    fail("manifest.json", "`topics` must be an array");
    printAndExit();
    return;
  }

  const seenTopicIds = new Set();
  let liveCount = 0;
  manifest.topics.forEach((topic, index) => {
    const context = `manifest.json topics[${index}]`;
    if (!isNonEmptyString(topic.id)) {
      fail(context, "missing/empty `id`");
      return;
    }
    if (seenTopicIds.has(topic.id)) fail(context, `duplicate topic id "${topic.id}"`);
    seenTopicIds.add(topic.id);

    if (!isNonEmptyString(topic.title)) fail(context, `topic "${topic.id}" missing/empty \`title\``);
    if (!isNonEmptyString(topic.tier)) fail(context, `topic "${topic.id}" missing/empty \`tier\``);

    if (topic.comingSoon) return; // stub entries need nothing else

    liveCount += 1;
    if (!isNonEmptyString(topic.file)) {
      fail(context, `topic "${topic.id}" missing/empty \`file\``);
      return;
    }
    validateTopicFile(topic);
  });

  printAndExit(liveCount);
}

function printAndExit(liveCount) {
  if (errors.length > 0) {
    console.error(`Content validation failed with ${errors.length} problem(s):\n`);
    errors.forEach((message) => console.error(`  - ${message}`));
    process.exit(1);
  }
  console.log(`Content validation passed — ${liveCount ?? 0} live topic(s) checked.`);
}

main();
