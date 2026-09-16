#!/usr/bin/env node
// Runs the corpus checks over a draft topic that is not in the manifest
// yet, so a defect is found before assembly rather than after.
//
// `npm run validate` walks the manifest, which is the right thing for
// shipped content and useless for a draft: a topic sitting in
// docs/agents/drafts/ has no manifest entry by design, because putting one
// there is precisely the act of shipping it. This runs the same checks
// against a draft pair, plus the taxonomy check the assembler makes, and
// says nothing about whether the teaching is any good — that is what the
// blind pass and the sufficiency pass are for.
//
//   node tools/check-draft.mjs docs/agents/drafts/<topic>

import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import {
  checkExplanationsNameDistractors,
  checkNearDuplicates,
  checkOptionForms,
  checkOptionNotes,
  checkScenarioReuse,
} from "./content-checks.mjs";

function report() {
  const errors = [];
  const warnings = [];
  return {
    errors,
    warnings,
    error: (where, message) => errors.push(`${where}: ${message}`),
    warn: (where, message) => warnings.push(`${where}: ${message}`),
  };
}

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node tools/check-draft.mjs docs/agents/drafts/<topic>");
  process.exit(1);
}

const questionsPath = join(dir, "questions.json");
const lessonsPath = join(dir, "lessons.json");
for (const path of [questionsPath, lessonsPath]) {
  if (!existsSync(path)) {
    console.error(`missing: ${path}`);
    process.exit(1);
  }
}

const questions = JSON.parse(readFileSync(questionsPath, "utf8"));
const lessons = JSON.parse(readFileSync(lessonsPath, "utf8"));
const topic = basename(dir);
const r = report();

checkExplanationsNameDistractors(r, topic, questions);
for (const question of questions) {
  checkOptionForms(r, question.id, question);
  checkOptionNotes(r, question.id, question);
}
checkNearDuplicates(r, questions);
checkScenarioReuse(r, questions);

// The taxonomy is the coupling point between the two authoring agents, so
// it is checked here as well as in the assembler: found now it is a
// rewrite, found at assembly it is a rewrite plus a wasted review pass.
const lessonCategories = lessons.map((lesson) => lesson.category);
const counts = new Map();
for (const question of questions) {
  counts.set(question.category, (counts.get(question.category) ?? 0) + 1);
}
for (const category of lessonCategories) {
  const n = counts.get(category) ?? 0;
  if (n !== 4) r.error(topic, `"${category}": ${n} question(s), expected 4`);
}
for (const category of counts.keys()) {
  if (!lessonCategories.includes(category)) {
    r.error(topic, `questions use a category with no lesson: "${category}"`);
  }
}
const ids = questions.map((question) => question.id);
if (new Set(ids).size !== ids.length) r.error(topic, "duplicate question ids");

for (const line of r.errors) console.error(`  error   ${line}`);
for (const line of r.warnings) console.warn(`  warning ${line}`);
console.log(
  `${topic}: ${questions.length} question(s), ${lessons.length} lesson(s) — ` +
    `${r.errors.length} error(s), ${r.warnings.length} warning(s)`
);
process.exit(r.errors.length ? 1 : 0);
