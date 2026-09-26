// Assembles the Closest Meaning topic from the three drafts beside it.
//
// Do not run this until the repairs in README.md are done: the content it
// assembles has two blocking lesson defects and two structural question
// defects, all listed there. The script checks the taxonomy, not the
// teaching.
// Supervisor's job, not an agent's: two agents running the formatter at
// once would clobber each other's files.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** The drafts sit beside this script. Run it from the repo root. */
const S = dirname(fileURLToPath(import.meta.url));
const CATEGORIES = [
  "Third Conditional vs Mixed Conditional",
  "Unless vs If Not vs Otherwise",
  "Despite vs Although vs However",
  "As...As vs Comparatives vs The More...The More",
  "Too vs Enough vs So...That",
  "Passive Reporting: It Is Said vs Is Said To",
];

for (const f of ["questions-1-12.json", "questions-13-24.json", "lessons.json"]) {
  if (!existsSync(`${S}/${f}`)) {
    console.error(`missing: ${f}`);
    process.exit(1);
  }
}

const questions = [
  ...JSON.parse(readFileSync(`${S}/questions-1-12.json`, "utf8")),
  ...JSON.parse(readFileSync(`${S}/questions-13-24.json`, "utf8")),
];
const lessons = JSON.parse(readFileSync(`${S}/lessons.json`, "utf8"));

// The taxonomy is the coupling point between the two agents, so it is the
// first thing checked and the only one worth failing loudly on.
const qCats = new Set(questions.map((q) => q.category));
const lCats = lessons.map((l) => l.category);
const problems = [];
for (const c of CATEGORIES) {
  const n = questions.filter((q) => q.category === c).length;
  if (n !== 4) problems.push(`${c}: ${n} questions, expected 4`);
  if (!lCats.includes(c)) problems.push(`${c}: no lesson`);
}
for (const c of qCats) if (!CATEGORIES.includes(c)) problems.push(`invented category in questions: "${c}"`);
for (const c of lCats) if (!CATEGORIES.includes(c)) problems.push(`invented category in lessons: "${c}"`);
if (questions.length !== 24) problems.push(`${questions.length} questions, expected 24`);
if (lessons.length !== 6) problems.push(`${lessons.length} lessons, expected 6`);
const ids = questions.map((q) => q.id);
if (new Set(ids).size !== ids.length) problems.push("duplicate question ids");
if (problems.length) {
  console.error("refusing to assemble:\n  " + problems.join("\n  "));
  process.exit(1);
}

// Order questions and lessons by the spec's category order, so the file
// reads the way the topic is meant to be studied.
questions.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
lessons.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));

mkdirSync("data/closest-meaning", { recursive: true });
writeFileSync(
  "data/closest-meaning/closest-meaning.json",
  JSON.stringify(
    {
      topicId: "closest-meaning",
      title: "Closest Meaning",
      level: "B2-C1",
      note: "The exam's sentence-restatement section: fifteen of Session I's sixty points. Written to docs/agents/closest-meaning-spec.md.",
      lessons,
      questions,
    },
    null,
    2
  ) + "\n"
);

const manifest = JSON.parse(readFileSync("data/manifest.json", "utf8"));
const existing = manifest.topics.findIndex((t) => t.id === "closest-meaning");
const entry = {
  id: "closest-meaning",
  title: "Closest Meaning",
  tier: "compound-structures",
  file: "data/closest-meaning/closest-meaning.json",
  questionCount: questions.length,
  lessonCount: lessons.length,
  contentVersion: 1,
  categories: CATEGORIES,
};
if (existing >= 0) manifest.topics[existing] = { ...manifest.topics[existing], ...entry };
else manifest.topics.push(entry);
writeFileSync("data/manifest.json", JSON.stringify(manifest, null, 2) + "\n");

console.log(`assembled ${questions.length} questions and ${lessons.length} lessons`);
