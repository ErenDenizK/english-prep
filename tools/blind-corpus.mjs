#!/usr/bin/env node
// Strips a draft question set down to what a reviewer may see, and writes
// the key out separately.
//
// This exists because two independent reviewers, on the same night, opened
// their reports by saying the "blind" file they had been given was not
// blind. The first pass hid `correctIndex` and `explanation` and left
// `tip` — and a tip is a standalone rule written for the item it belongs
// to, so it names the keyed form outright in the great majority of items:
// "…ilgi zamiri öznedir ve 'who' kullanılır". Twenty-two of twenty-four.
// Both reviewers had to discount their own agreement rate, which is the
// one number a blind pass exists to produce.
//
// The lesson generalises past `tip`: a blind file should carry only what
// the LEARNER sees before answering. Anything written to teach, justify or
// label the item is a channel to the key. So this works by allow-list —
// a field nobody has thought about is withheld, not leaked.
//
// Options are shuffled as well as unkeyed. Without that, an author who
// tends to put the key third hands a reviewer a prior, and the reviewer
// cannot tell they have been handed one.
//
//   node tools/blind-corpus.mjs docs/agents/drafts/<topic>/questions.json <outDir>
//
// The blind file goes to <outDir>; the key goes back beside the SOURCE,
// never into <outDir>. The key is not a secret — questions.json holds it
// in plain sight — but the directory a reviewer is pointed at must not
// contain it, because a reviewer who stumbles on a key has to discount
// their own pass and the pass is then worth nothing.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

/* Exactly what the app renders on the question screen before an answer:
 * the item's identity, its type, and the text the learner reads. */
const VISIBLE = ["id", "type", "category", "paragraph", "sentence", "options"];

/** Fisher-Yates. Returns the permutation, so the key can record where the
 *  answer landed and a later pass can be traced back to the original. */
function shuffled(length) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function blindQuestion(question) {
  const order = shuffled(question.options.length);
  const blind = {};
  for (const field of VISIBLE) {
    if (question[field] !== undefined) {
      blind[field] = field === "options" ? order.map((i) => question.options[i]) : question[field];
    }
  }
  return {
    blind,
    key: {
      answer: question.options[question.correctIndex],
      original: question.correctIndex,
      shown: order.indexOf(question.correctIndex),
      order,
    },
  };
}

/** Fields present in the source that this file has never been told about.
 *  Reported rather than silently dropped: a new authored field is either
 *  learner-visible, and belongs in VISIBLE, or it is a channel to the key
 *  and someone should have decided that on purpose. */
export function unknownFields(questions) {
  const known = new Set([...VISIBLE, "correctIndex", "explanation", "tip", "optionNotes"]);
  const seen = new Set();
  for (const question of questions) {
    for (const field of Object.keys(question)) {
      if (!known.has(field)) seen.add(field);
    }
  }
  return [...seen];
}

function main() {
  const [source, outDir = dirname(source)] = process.argv.slice(2);
  if (!source) {
    console.error("usage: node tools/blind-corpus.mjs <questions.json> [outDir]");
    process.exit(1);
  }
  const questions = JSON.parse(readFileSync(source, "utf8"));
  const list = Array.isArray(questions) ? questions : questions.questions;
  if (!Array.isArray(list)) {
    console.error(`${source}: expected an array of questions, or an object with a questions array`);
    process.exit(1);
  }

  const unknown = unknownFields(list);
  if (unknown.length) {
    console.error(
      `refusing to blind ${source}: unrecognised field(s) ${unknown.join(", ")}.\n` +
        "Decide whether each is learner-visible (add it to VISIBLE) or a channel to the key (add it to `known`)."
    );
    process.exit(1);
  }

  const topic = basename(source).replace(/\.json$/, "").replace(/-?questions?$/, "") || basename(dirname(source));
  const blind = [];
  const key = {};
  for (const question of list) {
    const result = blindQuestion(question);
    blind.push(result.blind);
    key[question.id] = result.key;
  }

  mkdirSync(outDir, { recursive: true });
  const blindPath = join(outDir, `${topic}-blind.json`);
  const keyPath = join(dirname(source), `${topic}-key.json`);
  writeFileSync(blindPath, JSON.stringify(blind, null, 2) + "\n");
  writeFileSync(keyPath, JSON.stringify(key, null, 2) + "\n");
  console.log(`${blind.length} item(s) blinded\n  reviewer gets: ${blindPath}\n  keep back:     ${keyPath}`);
}

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  main();
}
