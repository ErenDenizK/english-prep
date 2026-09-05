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
import { CLOZE_BLANKS } from "../js/topics.js";
import {
  checkExplanationsNameDistractors,
  checkNearDuplicates,
  checkOptionForms,
  checkScenarioReuse,
  checkOptionNotes,
  checkLessonGiveaway,
} from "./content-checks.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = "data/manifest.json";
const ROADMAP_PATH = "data/roadmap.json";

/** The three states a roadmap row may be in, and the only three. */
const ROADMAP_STATUSES = ["done", "next", "planned"];

const OPTIONS_PER_QUESTION = 4;
const MIN_EXPLANATION_LENGTH = 40;
/* An explanation is read once, right after the learner has committed to an
 * answer, and it has two jobs — why the key fits, why the closest wrong
 * option doesn't. Doing both honestly runs to three or four sentences;
 * the corpus averages 362 characters and its longest is 520. Past this it
 * is no longer an explanation but the lesson again, in the one place a
 * learner is least willing to read it. */
const MAX_EXPLANATION_LENGTH = 600;
const MIN_TIP_LENGTH = 20;
const MIN_PARAGRAPH_WORDS = 15;
/* A restatement's stem is one sentence, not a passage, so it has its own
 * floor — but a five-word sentence has nothing in it to restate, and the
 * exam's own stems run to fifteen or twenty words. */
const MIN_SENTENCE_WORDS = 10;
/* And its options are whole sentences. An option of three words is not a
 * paraphrase of anything; it is a cloze item that wandered in. */
const MIN_RESTATEMENT_OPTION_WORDS = 4;

/* The item types. Absent means cloze — every question authored before
 * restatements existed is a cloze item and must stay valid untouched. */
const QUESTION_TYPES = new Set(["cloze", "restatement"]);
const TOPIC_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

// Turkish-language heuristic for the prose fields that must be Turkish
// (explanations, tips, lesson bodies, summaries). Not a language detector —
// just enough to catch a set accidentally authored in English. Deliberately
// not applied to example `note`s: those are terse form labels that mix
// Turkish with English grammar terms ("Alışkanlık → Present Simple"), where
// the heuristic is unreliable and the payoff is low.
// â î û are ordinary Turkish spellings — resmî, kâğıt, âdet — and leaving
// them out made the heuristic call perfectly good Turkish foreign.
const TURKISH_CHARS = /[ıİşŞğĞçÇöÖüÜâÂîÎûÛ]/;
// A field written in English by accident is what this catches, so the list
// only has to contain words that cannot be English. It grew when the topic
// intros arrived: their fields are short — "tarif edilen isim",
// "Connector nedir?" — and a two-word Turkish phrase can easily carry
// neither a Turkish-specific character nor any of the original thirteen
// words. A heuristic that warns on correct content is one people learn to
// ignore, which is the same argument this repo makes about reviewers.
const TURKISH_WORDS =
  /\b(bir|ve|için|bu|ile|ama|çünkü|değil|gibi|olur|olarak|yani|hangi|nedir|mi|mı|mu|mü|önce|sonra|olan|eden|edilen|kelime|cümle|ismin|değişir|verir)\b/i;

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

/**
 * Reads the sentence the learner will actually see and flags a word
 * repeated across the blank's edge — "The novel was written by ____ by a
 * student". An author writing the option and the sentence separately
 * can't see that seam, and no reader of the JSON would spot it either;
 * it only shows up once the two are joined. "had had" and "that that"
 * are legitimate English, so they're allowed through.
 */
const ALLOWED_DOUBLE_WORDS = new Set(["had", "that"]);

function checkFilledSentence(report, where, paragraph, answer) {
  const filled = paragraph.replace("____", answer);
  const words = filled.match(/[A-Za-z']+/g) ?? [];
  for (let i = 1; i < words.length; i += 1) {
    const previous = words[i - 1].toLowerCase();
    if (previous === words[i].toLowerCase() && !ALLOWED_DOUBLE_WORDS.has(previous)) {
      report.error(
        where,
        `with the correct option filled in, the sentence repeats "${words[i]}":\n    ${filled}`
      );
      return;
    }
  }
}

function checkTurkish(report, where, field, text) {
  if (!TURKISH_CHARS.test(text) && !TURKISH_WORDS.test(text)) {
    report.warn(where, `${field} does not look like Turkish — it must be written in Turkish`);
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

  const type = question.type ?? "cloze";
  if (question.type !== undefined && !QUESTION_TYPES.has(question.type)) {
    report.error(where, `unknown type "${question.type}" — one of ${[...QUESTION_TYPES].join(", ")}`);
  }
  const restatement = type === "restatement";

  /* The two item shapes carry their stem in different fields, and each
   * must not carry the other's: a restatement with a `paragraph` is a
   * cloze item somebody relabelled, and the blank rule is the whole
   * difference between them. */
  if (restatement) {
    if (question.paragraph !== undefined) {
      report.error(where, "a restatement carries its stem in `sentence`, not `paragraph`");
    }
    if (!isNonEmptyString(question.sentence)) {
      report.error(where, "sentence is required — the sentence to be restated");
    } else {
      checkBlanks(report, where, question.sentence, { required: false });
      const words = question.sentence.trim().split(/\s+/).length;
      if (words < MIN_SENTENCE_WORDS) {
        report.warn(
          where,
          `sentence is only ${words} words — a stem this short has nothing in it to restate`
        );
      }
    }
  } else {
    if (question.sentence !== undefined) {
      report.error(where, "`sentence` belongs to a restatement; a cloze item uses `paragraph`");
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
  }

  if (checkOptions(report, where, question.options, { min: OPTIONS_PER_QUESTION, max: OPTIONS_PER_QUESTION })) {
    checkCorrectIndex(report, where, question.correctIndex, question.options.length);
    const answer = question.options[question.correctIndex];
    if (restatement) {
      const short = question.options.filter(
        (option) => isNonEmptyString(option) && option.trim().split(/\s+/).length < MIN_RESTATEMENT_OPTION_WORDS
      );
      if (short.length) {
        report.warn(
          where,
          `these options are not paraphrases of anything: ${short.map((o) => `"${o}"`).join(", ")}`
        );
      }
    } else if (isNonEmptyString(question.paragraph) && isNonEmptyString(answer)) {
      checkFilledSentence(report, where, question.paragraph, answer);
    }
    checkOptionForms(report, where, question);
  }

  if (!isNonEmptyString(question.explanation)) {
    report.error(where, "explanation is required");
  } else {
    const length = question.explanation.trim().length;
    if (length < MIN_EXPLANATION_LENGTH) {
      report.warn(
        where,
        `explanation is very short (${length} chars) — it must say why the right option fits and why the closest wrong one doesn't`
      );
    } else if (length > MAX_EXPLANATION_LENGTH) {
      report.warn(
        where,
        `explanation is ${length} chars — past ${MAX_EXPLANATION_LENGTH} it is the lesson again, in the place a learner is least willing to read it`
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
  checkOptionNotes(report, where, question, checkTurkish);
}

/** Mirrors lessonId() in js/topics.js — lesson ids are derived, not authored. */
function derivedLessonId(topicId, category) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${topicId}-${slug}`;
}

/* ---- Lesson blocks ----
 *
 * A lesson is a page built from typed blocks (docs/CONTENT_GUIDE.md). The
 * types are semantic, not presentational, so nothing below describes a
 * screen — `contrast` means "two forms set against each other", and how
 * that is drawn is js/education.js's business.
 *
 * The limits here exist to stop the schema decaying back into the article
 * it replaced. A `text` block over 400 characters is the wall of prose the
 * block model was introduced to break up: what it is really carrying is a
 * contrast or a decision that has not been written as one yet, and saying
 * so at validation time is the only moment anyone will act on it.
 */

const MAX_TEXT_BLOCK = 400;
const MAX_SUMMARY = 70;
const MIN_BLOCKS = 6;
const MAX_BLOCKS = 14;
const MAX_GLOSS = 200;

/** A topic gloss is one t-meta line under a heading at 320px. */
const MAX_TOPIC_GLOSS = 110;

/**
 * The whole intro, Turkish only, counted across every prose field.
 *
 * `docs/research/orientation.md` §3.2: past roughly this it is an
 * article, and articles were removed from this app once already. The
 * evidence is not a preference — the coherence principle found added
 * inessential material measurably *hurting* learning across 50 studies,
 * so length here has a cost and not merely a size.
 */
const MAX_INTRO_PROSE = 1400;

/** Every top-level key a topic file may carry. Anything else is dead weight. */
const TOPIC_FILE_KEYS = new Set(["topicId", "title", "level", "note", "intro", "questions", "lessons"]);
const MIN_EXAMPLE_ITEMS = 3;
const MAX_EXAMPLE_ITEMS = 6;

/** Runs `check` over every entry of an array field, with a shared shape. */
function eachEntry(report, where, field, value, { min, max, validate }) {
  if (!Array.isArray(value) || value.length < min) {
    report.error(where, `${field} must be an array of at least ${min} entries`);
    return;
  }
  if (max !== undefined && value.length > max) {
    report.warn(where, `${field} has ${value.length} entries — ${max} is the intended ceiling`);
  }
  value.forEach((entry, index) => validate(entry, `${where} › ${field}[${index}]`));
}

const BLOCK_VALIDATORS = {
  text(report, where, block) {
    if (!isNonEmptyString(block.body)) {
      report.error(where, "body is required");
      return;
    }
    checkTurkish(report, where, "body", block.body);
    if (block.body.length > MAX_TEXT_BLOCK) {
      report.error(
        where,
        `body is ${block.body.length} characters, over the ${MAX_TEXT_BLOCK} limit — ` +
          "a text block this long is an article paragraph again. Split it, or write " +
          "the contrast or decision it is really carrying as its own block."
      );
    }
  },

  contrast(report, where, block) {
    if (!Array.isArray(block.sides) || block.sides.length < 2 || block.sides.length > 3) {
      report.error(where, "sides must be an array of 2 or 3 entries");
      return;
    }
    block.sides.forEach((side, index) => {
      const sideWhere = `${where} › sides[${index}]`;
      if (!isNonEmptyString(side?.label)) {
        report.error(sideWhere, "label is required (the English form name)");
      }
      if (!isNonEmptyString(side?.gloss)) {
        report.error(sideWhere, "gloss is required");
      } else {
        checkTurkish(report, sideWhere, "gloss", side.gloss);
        if (side.gloss.length > MAX_GLOSS) {
          report.warn(
            sideWhere,
            "gloss is long — a contrast side should be one or two sentences, or it is a text block wearing a costume"
          );
        }
      }
      if (side?.example !== undefined && !isNonEmptyString(side.example)) {
        report.error(sideWhere, "example, when present, must be a non-empty string");
      }
    });
    // Two sides labelled the same thing is not a contrast.
    const labels = block.sides.map((side) => side?.label).filter(isNonEmptyString);
    if (new Set(labels).size !== labels.length) {
      report.error(where, "two sides share a label — there is nothing being contrasted");
    }
  },

  forms(report, where, block) {
    eachEntry(report, where, "rows", block.rows, {
      min: 2,
      validate(row, rowWhere) {
        for (const field of ["form", "use", "pattern"]) {
          if (!isNonEmptyString(row?.[field])) {
            report.error(rowWhere, `${field} is required`);
          }
        }
        if (row?.example !== undefined && !isNonEmptyString(row.example)) {
          report.error(rowWhere, "example, when present, must be a non-empty string");
        }
      },
    });
  },

  examples(report, where, block) {
    eachEntry(report, where, "items", block.items, {
      min: MIN_EXAMPLE_ITEMS,
      max: MAX_EXAMPLE_ITEMS,
      validate(item, itemWhere) {
        if (!isNonEmptyString(item?.sentence)) {
          report.error(itemWhere, "sentence is required");
        }
        // No Turkish check on a note. They are terse form labels that mix
        // Turkish with English grammar terms — "Resmî izin isteme → may" —
        // where the heuristic is unreliable and the payoff is low. That is
        // the rule the heuristic's own comment states; calling it here was
        // a contradiction, and it cost an author two false positives.
        if (!isNonEmptyString(item?.note)) {
          report.error(itemWhere, "note is required");
        }
      },
    });
  },

  pitfall(report, where, block) {
    for (const field of ["wrong", "right", "why"]) {
      if (!isNonEmptyString(block[field])) {
        report.error(where, `${field} is required`);
      }
    }
    if (isNonEmptyString(block.wrong) && block.wrong === block.right) {
      report.error(where, "wrong and right are identical — there is no mistake to show");
    }
    if (isNonEmptyString(block.why)) {
      checkTurkish(report, where, "why", block.why);
    }
  },

  decision(report, where, block) {
    eachEntry(report, where, "rules", block.rules, {
      min: 2,
      validate(rule, ruleWhere) {
        const hasSignals = rule?.signals !== undefined;
        const hasCondition = rule?.condition !== undefined;
        if (hasSignals === hasCondition) {
          report.error(ruleWhere, "a rule needs exactly one of signals or condition");
        }
        if (hasSignals) {
          if (!Array.isArray(rule.signals) || rule.signals.length === 0 || !rule.signals.every(isNonEmptyString)) {
            report.error(ruleWhere, "signals must be a non-empty array of trigger words");
          }
        }
        if (hasCondition) {
          if (!isNonEmptyString(rule.condition)) {
            report.error(ruleWhere, "condition must be a non-empty string");
          } else {
            checkTurkish(report, ruleWhere, "condition", rule.condition);
          }
        }
        if (!isNonEmptyString(rule?.then)) {
          report.error(ruleWhere, "then is required (the English form name that follows)");
        }
      },
    });
  },

  check(report, where, block) {
    // Deliberately has no content: the reader fills it from the questions
    // sharing the lesson's category. Anything else here is a misunderstanding
    // worth catching now rather than as a silently ignored field.
    const extra = Object.keys(block).filter((key) => key !== "type" && key !== "heading");
    if (extra.length) {
      report.error(where, `a check block carries no content of its own; remove ${extra.join(", ")}`);
    }
  },
};

const BLOCK_TYPES = Object.keys(BLOCK_VALIDATORS);

function validateBlocks(report, where, blocks, categoryQuestionCount) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    report.error(where, "blocks must be a non-empty array");
    return;
  }
  if (blocks.length < MIN_BLOCKS) {
    report.warn(where, `only ${blocks.length} blocks — under ${MIN_BLOCKS} a lesson is a stub`);
  }
  if (blocks.length > MAX_BLOCKS) {
    report.warn(where, `${blocks.length} blocks — over ${MAX_BLOCKS} it is an article again`);
  }

  let checks = 0;
  let hasContrast = false;

  blocks.forEach((block, index) => {
    const blockWhere = `${where} › blocks[${index}]${block?.type ? ` (${block.type})` : ""}`;
    if (!block || typeof block !== "object") {
      report.error(blockWhere, "block must be an object");
      return;
    }
    const validate = BLOCK_VALIDATORS[block.type];
    if (!validate) {
      report.error(blockWhere, `unknown block type "${block.type}" — one of ${BLOCK_TYPES.join(", ")}`);
      return;
    }
    if (block.heading !== undefined && !isNonEmptyString(block.heading)) {
      report.error(blockWhere, "heading, when present, must be a non-empty string");
    }
    if (block.type === "check") {
      checks += 1;
      if (index === 0) {
        report.warn(blockWhere, "a check as the first block is a quiz, not a lesson");
      }
    }
    if (block.type === "contrast") {
      hasContrast = true;
    }
    validate(report, blockWhere, block);
  });

  if (!hasContrast) {
    // Every category in this app names a confusable pair, so a lesson with
    // nothing set against anything is usually a lesson that has not found
    // its own point yet. A warning, not an error: the grammar occasionally
    // does not offer a pair.
    report.warn(where, "no contrast block — every category here names a confusable pair, so this is worth a second look");
  }
  if (checks === 0) {
    report.warn(where, "no check blocks — the lesson never asks the learner to try anything");
  }
  if (categoryQuestionCount !== null && checks > categoryQuestionCount) {
    report.warn(
      where,
      `${checks} check blocks but only ${categoryQuestionCount} question(s) in this category — the extras will render as nothing`
    );
  }
}

/**
 * A lesson is a page built from typed blocks. How those blocks are drawn,
 * and how the page is paced, is the app's decision (see js/education.js) —
 * so nothing here describes a screen.
 */
function validateLesson(report, file, lesson, index, seenIds, questionCategories, topicId, questionsByCategory, questionsFor) {
  const where = `${file} › lessons[${index}]${lesson?.category ? ` (${lesson.category})` : ""}`;

  if (!lesson || typeof lesson !== "object") {
    report.error(where, "lesson must be an object");
    return;
  }

  let categoryQuestionCount = null;
  if (!isNonEmptyString(lesson.category)) {
    report.error(where, "category is required");
  } else {
    if (questionCategories.size && !questionCategories.has(lesson.category)) {
      report.error(
        where,
        `category "${lesson.category}" is not used by any question in this topic — lessons and questions must share one taxonomy`
      );
    }
    categoryQuestionCount = questionsByCategory.get(lesson.category) ?? 0;
    // Ids are derived from topic + category, so two lessons sharing a
    // category inside a topic would silently collapse into one.
    const id = derivedLessonId(topicId, lesson.category);
    if (seenIds.has(id)) {
      report.error(where, `two lessons resolve to the same id "${id}" — categories must be unique per topic`);
    }
    seenIds.add(id);
  }

  if (!isNonEmptyString(lesson.summary)) {
    report.error(where, "summary is required — it is the lesson's line on the index");
  } else {
    checkTurkish(report, where, "summary", lesson.summary);
    if (lesson.summary.length > MAX_SUMMARY) {
      report.error(
        where,
        `summary is ${lesson.summary.length} characters, over ${MAX_SUMMARY} — ` +
          "the index clips it to one line, so write one rather than a sentence that will be cut"
      );
    }
  }

  validateBlocks(report, where, lesson.blocks, categoryQuestionCount);

  if (isNonEmptyString(lesson.category)) {
    checkLessonGiveaway(report, file, lesson, questionsFor(lesson.category));
  }
}

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw);
}

function sameSet(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

async function validateTopicFile(report, topic, seenQuestionIds, seenLessonIds, corpus) {
  const file = topic.file;
  let data;
  try {
    data = await readJson(file);
  } catch (error) {
    report.error(file, `could not read/parse: ${error.message}`);
    return;
  }

  if ((data.intro !== undefined) !== (topic.hasIntro === true)) {
    report.error(
      file,
      data.intro
        ? "has an intro but the manifest does not say so — run `npm run format`"
        : "has no intro but the manifest says hasIntro — run `npm run format`"
    );
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

  // A key nothing reads is content the learner downloads and never sees.
  // Three topic files carried a 1,400–1,800 character `overview` object
  // for months after the reader redesign orphaned it, and it was
  // invisible precisely because the validator ignored what it did not
  // recognise. Silence about an unknown key is not neutrality.
  if (data.intro !== undefined) {
    validateIntro(report, file, data.intro);
    checkIntroGiveaway(report, file, data.intro, data.questions ?? [], topic.tier);
  }

  for (const key of Object.keys(data)) {
    if (!TOPIC_FILE_KEYS.has(key)) {
      report.warn(
        file,
        `"${key}" is not a key the app reads — it ships to the learner and nothing renders it. ` +
          `Use it or drop it (docs/CONTENT_GUIDE.md lists the topic file's keys).`
      );
    }
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    report.error(file, "questions must be a non-empty array");
    return;
  }

  data.questions.forEach((question, index) =>
    validateQuestion(report, file, question, index, seenQuestionIds, topic.id)
  );

  // Kept for the corpus-wide pass below, which cannot run until every
  // topic has been read: a near-duplicate stem is invisible inside one
  // file and obvious across three.
  for (const question of data.questions) {
    if (question && typeof question === "object") {
      corpus.push({ ...question, file, topicId: topic.id });
    }
  }
  checkExplanationsNameDistractors(report, file, data.questions);

  if (data.questions.length !== topic.questionCount) {
    report.error(
      file,
      `has ${data.questions.length} questions but the manifest says questionCount: ${topic.questionCount}`
    );
  }

  // Also counted, not just collected: a lesson can ask for more check
  // blocks than its category has questions to fill them with, and the
  // extras would then render as nothing at all.
  const questionsByCategory = new Map();
  for (const question of data.questions) {
    if (isNonEmptyString(question?.category)) {
      questionsByCategory.set(question.category, (questionsByCategory.get(question.category) ?? 0) + 1);
    }
  }
  const questionCategories = new Set(questionsByCategory.keys());

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

  lessons.forEach((lesson, index) =>
    validateLesson(
      report,
      file,
      lesson,
      index,
      seenLessonIds,
      questionCategories,
      topic.id,
      questionsByCategory,
      (category) => data.questions.filter((question) => question.category === category)
    )
  );

  // The manifest's lesson index is generated by tools/format-content.mjs
  // so the screens can be built without downloading the question bank. A
  // topic file edited without re-running the formatter would leave it
  // stale, and a stale index is a lesson list that names lessons the
  // reader cannot open — so it fails here rather than shipping.
  const expectedIndex = lessons.map((lesson) => ({
    category: lesson?.category,
    summary: lesson?.summary,
  }));
  if (JSON.stringify(topic.lessons ?? null) !== JSON.stringify(expectedIndex)) {
    report.error(
      MANIFEST_PATH,
      `topic "${topic.id}": the lesson index is out of sync with ${file}. Run: npm run format`
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

/**
 * An orientation must not hand over its own topic's answers.
 *
 * `docs/agents/question-author.md` rule 1 exists because 20 of 24 keys in
 * one topic were built on the lesson's own sentences, and an orientation
 * is the *most* likely place to reintroduce that: it is written last,
 * about the same material, by someone who has just read all of it. It
 * also sits one screen above the questions rather than three blocks
 * above, so a collision here is worse than a collision in a lesson.
 *
 * Only the English is checked, and only against options and stems. The
 * Turkish is prose about the category and is expected to share words with
 * the Turkish explanations; requiring it not to would be a check that
 * fires on correct content.
 */
/**
 * @param {string} [tier] - `vocabulary` turns off the single-word
 *   exemption for the option arm; see below.
 */
function checkIntroGiveaway(report, file, intro, questions, tier) {
  const strings = [
    ...(intro.examples ?? []).map((item) => item.en),
    ...(intro.parts ?? []).map((part) => part.en),
  ].filter(isNonEmptyString);

  for (const raw of strings) {
    // An illustration is often a list — "can · must · should" — and each
    // side of it is what a question could key.
    for (const piece of raw.split(/[·|]/).map((part) => part.trim()).filter(Boolean)) {
      // Single words are the grammar being taught and cannot be avoided:
      // a quantifiers intro that may not print `many` teaches nothing.
      // A phrase is a different matter — that is a scenario, not a term.
      //
      // Except in a vocabulary topic, where a single word is not the name
      // of a rule — it IS an item's answer. Every option in these two
      // topics is one word, so the exemption turned the option arm off
      // entirely and the rule was left to the author's diligence. The
      // author who noticed said so; that is not a system.
      //
      // The stem arm keeps the exemption even there: a stem is a
      // paragraph, and one word of it appearing in an intro is a
      // coincidence rather than a giveaway.
      const single = piece.split(/\s+/).length < 2;
      if (single && tier !== "vocabulary") {
        continue;
      }
      for (const question of questions) {
        if (single) {
          // Option arm only.
          if ((question.options ?? []).some((option) => option.toLowerCase() === piece.toLowerCase())) {
            report.error(
              `${file} › intro`,
              `"${piece}" is an option in ${question.id} — in a vocabulary topic the word is the answer`
            );
          }
          continue;
        }
        const stem = question.paragraph ?? question.sentence ?? "";
        if (stem.toLowerCase().includes(piece.toLowerCase())) {
          report.error(
            `${file} › intro`,
            `"${piece}" also appears in ${question.id}'s stem — the intro is one screen above the questions`
          );
        }
        if ((question.options ?? []).some((option) => option.toLowerCase() === piece.toLowerCase())) {
          report.error(
            `${file} › intro`,
            `"${piece}" is an option in ${question.id} — an intro must not print an item's answer`
          );
        }
      }
    }
  }
}

/**
 * A topic's overview screen (`#egitim/konu/<topicId>`).
 *
 * Typed fields rather than one prose blob, and the validator is where
 * that stays true. Two reasons, both structural: English has to sit in
 * its own field so the renderer can give it `lang="en"` — a Turkish
 * prose field cannot, because `js/dom.js` has no `lang` handling and
 * `text-transform: uppercase` would turn SIMPLE into SİMPLE — and the
 * five fields are the five questions `docs/research/orientation.md` §3.2
 * says an orientation answers, in order. A sixth field would be a sixth
 * question nobody has argued for.
 */
function validateIntro(report, file, intro) {
  const where = `${file} › intro`;
  if (!intro || typeof intro !== "object" || Array.isArray(intro)) {
    report.error(where, "intro must be an object");
    return;
  }

  for (const field of ["title", "what", "choice", "lessons", "exam"]) {
    if (!isNonEmptyString(intro[field])) {
      report.error(where, `${field} is required and must be a non-empty string`);
    } else {
      checkTurkish(report, where, field, intro[field]);
    }
  }

  const prose = ["title", "what", "choice", "lessons", "exam"]
    .map((field) => (typeof intro[field] === "string" ? intro[field].length : 0))
    .reduce((total, length) => total + length, 0);
  if (prose > MAX_INTRO_PROSE) {
    report.warn(
      where,
      `${prose} characters of Turkish — keep it under ${MAX_INTRO_PROSE}, or it is an article rather than an orientation`
    );
  }

  if (intro.examples !== undefined) {
    if (!Array.isArray(intro.examples) || intro.examples.length === 0) {
      report.error(where, "examples must be a non-empty array when present");
    } else {
      intro.examples.forEach((item, index) => {
        if (!isNonEmptyString(item?.en)) {
          report.error(`${where} › examples[${index}]`, "en is required");
        }
        if (item?.note !== undefined && !isNonEmptyString(item.note)) {
          report.error(`${where} › examples[${index}]`, "note must be a non-empty string when present");
        } else if (item?.note) {
          checkTurkish(report, `${where} › examples[${index}]`, "note", item.note);
        }
      });
    }
  }

  // The parts list is the part that earns the page: Mayer's pre-training
  // principle is about knowing the names and characteristics of the main
  // concepts, and in the experiments that is a parts list rather than an
  // essay. Two to four, because one is not a list and five is a lesson.
  if (!Array.isArray(intro.parts) || intro.parts.length < 2 || intro.parts.length > 4) {
    report.error(where, "parts must be an array of 2–4 named components");
    return;
  }
  intro.parts.forEach((part, index) => {
    const partWhere = `${where} › parts[${index}]`;
    if (!isNonEmptyString(part?.name)) {
      report.error(partWhere, "name is required");
    }
    if (part?.gloss !== undefined && !isNonEmptyString(part.gloss)) {
      report.error(partWhere, "gloss must be a non-empty string when present");
    } else if (part?.gloss) {
      checkTurkish(report, partWhere, "gloss", part.gloss);
    }
    if (part?.en !== undefined && !isNonEmptyString(part.en)) {
      report.error(partWhere, "en must be a non-empty string when present");
    }
  });
}

/**
 * `data/roadmap.json` — the one file in `data/` that is not content.
 *
 * It is checked here anyway, and lightly: a typo in `status` would ship a
 * row whose chip says the wrong thing about whether something exists,
 * which is the single claim this file is on screen to make. The app
 * degrades to no list if the file is unreachable, so a missing file is
 * not an error; a malformed one is.
 */
/**
 * The cloze map in `js/topics.js` names a topic per blank of the sample
 * passage, and Profil derives "how much of this section is here" from it.
 * A topic id that matches nothing is not a crash — the coverage number
 * just silently drops, which is the one direction an honesty line must
 * never fail in. So a blank must point at a live topic, a coming-soon
 * one, or a grammar point that has no topic yet and is listed here.
 */
const CLOZE_TOPICS_NOT_YET_WRITTEN = new Set(["so-such"]);

function validateClozeMap(report, manifest) {
  const known = new Set(manifest.topics.map((topic) => topic.id));
  CLOZE_BLANKS.forEach((blank, index) => {
    if (blank.topicId === null || known.has(blank.topicId)) {
      return;
    }
    if (CLOZE_TOPICS_NOT_YET_WRITTEN.has(blank.topicId)) {
      return;
    }
    report.error(
      "js/topics.js",
      `CLOZE_BLANKS[${index}] "${blank.topicId}" manifestte yok. Konu ` +
        "yeniden adlandırıldıysa haritayı da taşı; henüz yazılmadıysa " +
        "CLOZE_TOPICS_NOT_YET_WRITTEN'a ekle."
    );
  });
}

async function validateRoadmap(report) {
  let roadmap;
  try {
    roadmap = await readJson(ROADMAP_PATH);
  } catch (error) {
    if (error.code === "ENOENT") {
      return 0;
    }
    report.error(ROADMAP_PATH, `could not be read: ${error.message}`);
    return 0;
  }

  if (!Array.isArray(roadmap.items)) {
    report.error(ROADMAP_PATH, "items must be an array");
    return 0;
  }
  if (roadmap.note !== undefined && typeof roadmap.note !== "string") {
    report.error(ROADMAP_PATH, "note must be a string when present");
  }

  roadmap.items.forEach((item, index) => {
    const where = `items[${index}]`;
    if (!ROADMAP_STATUSES.includes(item.status)) {
      report.error(
        ROADMAP_PATH,
        `${where}: status must be one of ${ROADMAP_STATUSES.join(", ")} (got ${JSON.stringify(item.status)})`
      );
    }
    if (typeof item.title !== "string" || item.title.trim() === "") {
      report.error(ROADMAP_PATH, `${where}: title must be a non-empty string`);
    }
    if (item.detail !== undefined && typeof item.detail !== "string") {
      report.error(ROADMAP_PATH, `${where}: detail must be a string when present`);
    }
    // The row's subtitle is one line on a 320px screen before it wraps
    // into a paragraph inside a row, which is the box-in-box failure the
    // design system refuses.
    if (typeof item.detail === "string" && item.detail.length > 160) {
      report.warn(ROADMAP_PATH, `${where}: detail is ${item.detail.length} chars; keep it under 160`);
    }
  });

  return roadmap.items.length;
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

  const corpus = [];
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
    // Optional, because a topic can ship before someone has written its
    // line. Capped because it renders as one `t-meta` line under the
    // topic heading on the Eğitim index, and a paragraph there is a
    // lesson wearing a costume — the same reasoning, and the same
    // failure, as a contrast side's gloss.
    if (topic.hasIntro !== undefined && topic.hasIntro !== true) {
      report.error(where, "hasIntro is generated by `npm run format` and is either true or absent");
    }
    if (topic.gloss !== undefined) {
      if (!isNonEmptyString(topic.gloss)) {
        report.error(where, "gloss must be a non-empty string when present");
      } else {
        checkTurkish(report, where, "gloss", topic.gloss);
        if (topic.gloss.length > MAX_TOPIC_GLOSS) {
          report.warn(
            where,
            `gloss is ${topic.gloss.length} chars — it is one line under a heading at 320px, so keep it under ${MAX_TOPIC_GLOSS}`
          );
        }
      }
    }
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
    await validateTopicFile(report, topic, seenQuestionIds, seenLessonIds, corpus);
  }

  checkNearDuplicates(report, corpus);
  checkScenarioReuse(report, corpus);

  validateClozeMap(report, manifest);
  const roadmapItems = await validateRoadmap(report);

  console.log(
    `Checked ${manifest.topics.length} manifest topic(s): ` +
      `${liveTopics.length} live, ${manifest.topics.length - liveTopics.length} coming soon. ` +
      `${seenQuestionIds.size} question(s), ${seenLessonIds.size} lesson(s), ` +
      `${roadmapItems} roadmap row(s).`
  );

  process.exit(report.print() ? 0 : 1);
}

await main();
