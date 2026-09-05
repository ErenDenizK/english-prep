#!/usr/bin/env node
// Moves a reviewed draft topic out of docs/agents/drafts/ and into data/,
// and adds or updates its manifest entry. This is the act of shipping:
// nothing in drafts/ is served, and a topic in the manifest is.
//
// It generalises docs/agents/drafts/closest-meaning/assemble.mjs, which
// was written for one topic and then wanted four more times in a night.
//
// It checks the taxonomy and nothing else. It cannot tell whether an item
// has two defensible answers or whether a decision block certifies a
// distractor — that is what the blind pass and the sufficiency pass are
// for, and this script will happily ship content that failed both. Run
// `npm run draft` first, and do not run this until the reviews say ship.
//
// Supervisor's job, not an agent's: two agents assembling at once would
// clobber each other's manifest write.
//
//   node tools/ship-topic.mjs <topicId>
//   node tools/ship-topic.mjs <topicId> --dry-run
//
// Topic metadata lives in TOPICS below rather than in the draft, because
// the tier and the title are decisions about the app's shelf, not about
// the content — and a draft directory should not be able to insert itself
// into a tier by editing its own file.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DRAFTS = "docs/agents/drafts";
const MANIFEST = "data/manifest.json";

/** Fixed at kickoff (docs/agents/kickoff-v11.md), verbatim. Category order
 *  is the order the topic is meant to be studied in, and both the topic
 *  file and the manifest are written in it. */
const TOPICS = {
  "closest-meaning": {
    title: "Closest Meaning",
    tier: "compound-structures",
    level: "B2-C1",
    note: "The exam's sentence-restatement section: fifteen of Session I's sixty points. Written to docs/agents/closest-meaning-spec.md.",
    categories: [
      "Third Conditional vs Mixed Conditional",
      "Unless vs If Not vs Otherwise",
      "Despite vs Although vs However",
      "As...As vs Comparatives vs The More...The More",
      "Too vs Enough vs So...That",
      "Passive Reporting: It Is Said vs Is Said To",
    ],
  },
  connectors: {
    title: "Connectors & Discourse Markers",
    tier: "compound-structures",
    level: "B2-C1",
    note: "Written to docs/agents/connectors-spec.md.",
  },
  "relative-clauses": {
    title: "Relative Clauses",
    tier: "compound-structures",
    level: "B2-C1",
    note: "Written to docs/agents/relative-clauses-spec.md.",
  },
  quantifiers: {
    title: "Quantifiers & Determiners",
    tier: "core-grammar",
    level: "B2-C1",
    note: "Written to docs/agents/quantifiers-spec.md.",
  },
  "gerunds-infinitives": {
    title: "Gerunds & Infinitives",
    tier: "core-grammar",
    level: "B2-C1",
    note: "Written to docs/agents/gerunds-infinitives-spec.md.",
  },
  "academic-verbs": {
    title: "Academic Verbs",
    tier: "vocabulary",
    level: "B2-C1",
    note: "Two of the sample cloze's ten blanks are vocabulary, and every reading text carries a vocabulary-in-context item. Written to docs/agents/kickoff-vocabulary.md.",
  },
  "academic-nouns-adjectives": {
    title: "Academic Nouns & Adjectives",
    tier: "vocabulary",
    level: "B2-C1",
    note: "The other half of the vocabulary the paper rewards: the nouns and adjectives an academic passage turns on. Written to docs/agents/kickoff-vocabulary.md.",
  },
};

const [topicId, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");
const meta = TOPICS[topicId];
if (!meta) {
  console.error(
    `unknown topic "${topicId ?? ""}". Known: ${Object.keys(TOPICS).join(", ")}\n` +
      "A new topic needs an entry in TOPICS — its tier and title are decisions about the app, not about the draft."
  );
  process.exit(1);
}

const dir = join(DRAFTS, topicId);
const questionsPath = join(dir, "questions.json");
const lessonsPath = join(dir, "lessons.json");

// closest-meaning was written in two halves by two agents and kept them.
const questionParts = existsSync(questionsPath)
  ? [questionsPath]
  : ["questions-1-12.json", "questions-13-24.json"].map((f) => join(dir, f));
for (const path of [...questionParts, lessonsPath]) {
  if (!existsSync(path)) {
    console.error(`missing: ${path}`);
    process.exit(1);
  }
}

const questions = questionParts.flatMap((path) => JSON.parse(readFileSync(path, "utf8")));
const lessons = JSON.parse(readFileSync(lessonsPath, "utf8"));

// The taxonomy is the one thing the two authoring agents must agree on,
// and the thing the results screen uses to link a wrong answer to the
// lesson that teaches it. A category present in one file and absent from
// the other is a lesson nobody can reach, or a wrong answer that teaches
// nothing. Fail loudly.
const categories = meta.categories ?? lessons.map((lesson) => lesson.category);
const problems = [];
const lessonCategories = lessons.map((lesson) => lesson.category);
for (const category of categories) {
  const n = questions.filter((question) => question.category === category).length;
  if (n !== 4) problems.push(`"${category}": ${n} question(s), expected 4`);
  if (!lessonCategories.includes(category)) problems.push(`"${category}": no lesson`);
}
for (const category of new Set(questions.map((question) => question.category))) {
  if (!categories.includes(category)) problems.push(`invented category in questions: "${category}"`);
}
for (const category of lessonCategories) {
  if (!categories.includes(category)) problems.push(`invented category in lessons: "${category}"`);
}
if (lessons.length !== categories.length) {
  problems.push(`${lessons.length} lesson(s), expected ${categories.length}`);
}
const ids = questions.map((question) => question.id);
if (new Set(ids).size !== ids.length) problems.push("duplicate question ids");
for (const id of ids) {
  if (!id.startsWith(`${topicId}-`)) problems.push(`question id outside its topic's namespace: "${id}"`);
}
if (problems.length) {
  console.error(`refusing to ship ${topicId}:\n  ` + problems.join("\n  "));
  process.exit(1);
}

const order = (a, b) => categories.indexOf(a.category) - categories.indexOf(b.category);
questions.sort(order);
lessons.sort(order);

const file = `data/${topicId}/${topicId}.json`;
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const existing = manifest.topics.findIndex((topic) => topic.id === topicId);
const entry = {
  ...(existing >= 0 ? manifest.topics[existing] : {}),
  id: topicId,
  title: meta.title,
  tier: meta.tier,
  file,
  questionCount: questions.length,
  lessonCount: lessons.length,
  // A learner's cached copy is keyed on this. Bump on a reship so a phone
  // that already has the old file goes and gets the new one.
  contentVersion: existing >= 0 ? (manifest.topics[existing].contentVersion ?? 0) + 1 : 1,
  categories,
};

if (dryRun) {
  console.log(
    `${topicId} would ship: ${questions.length} question(s), ${lessons.length} lesson(s), ` +
      `tier ${meta.tier}, contentVersion ${entry.contentVersion}`
  );
  process.exit(0);
}

mkdirSync(`data/${topicId}`, { recursive: true });
writeFileSync(
  file,
  JSON.stringify(
    { topicId, title: meta.title, level: meta.level, note: meta.note, lessons, questions },
    null,
    2
  ) + "\n"
);
if (existing >= 0) manifest.topics[existing] = entry;
else manifest.topics.push(entry);
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `shipped ${topicId}: ${questions.length} question(s), ${lessons.length} lesson(s) → ${file}\n` +
    "Now run: npm run format && npm run check"
);
