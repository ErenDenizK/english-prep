// Builds the calibration corpus a reviewer is actually handed.
//
// This exists because of a real failure. `docs/agents/calibration.md` is
// the supervisor's KEY — ten items with their answers, defect classes and
// severities — and `docs/agents/reviewer.md` says a reviewer must never
// read it. But a supervisor briefing a reviewer has to point at
// *something*, and twice now a brief said "work the calibration set" and
// named that file. Both reviewers did as they were told, read the
// answers, and correctly refused to report a score. Two review passes lost
// their only measurement to a two-word ambiguity in a prompt.
//
// So the file to point a reviewer at is one that can be generated and
// cannot contain the answers. It is assembled from `data/` and then run
// through `tools/blind-corpus.mjs`, which works by allow-list — the same
// tool, for the same reason, as every other blinding in this project.
//
//   node tools/make-calibration.mjs <outDir>
//   npm run blind -- <outDir>/calibration-source.json <outDir>
//
// The ids below are the calibration set. They live here rather than in the
// key so that generating the corpus never opens the key.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Ten items, mixed and not grouped — the order is the order the reviewer
 * meets them, and grouping the defective ones would give the game away
 * before the first answer.
 *
 * Which are sound and which are planted is deliberately NOT recorded
 * here. That is what the key is for, and a comment naming them would
 * reintroduce the exact leak this file exists to close.
 */
const CALIBRATION_IDS = [
  "tenses-t17",
  "modals-t17",
  "tenses-t5",
  "passive-voice-t15",
  "modals-t10",
  "tenses-t20",
  "tenses-t6",
  "passive-voice-t4",
  "tenses-t7",
  "modals-t14",
  "passive-voice-t21",
  "tenses-t8",
  "modals-t23",
];

async function main() {
  const outDir = process.argv[2];
  if (!outDir) {
    console.error("usage: node tools/make-calibration.mjs <outDir>");
    process.exit(1);
  }

  const manifest = JSON.parse(await readFile("data/manifest.json", "utf8"));
  const wanted = new Set(CALIBRATION_IDS);
  const found = new Map();

  for (const topic of manifest.topics.filter((entry) => !entry.comingSoon)) {
    const data = JSON.parse(await readFile(topic.file, "utf8"));
    for (const question of data.questions ?? []) {
      if (wanted.has(question.id)) {
        found.set(question.id, question);
      }
    }
  }

  const missing = CALIBRATION_IDS.filter((id) => !found.has(id));
  if (missing.length) {
    // A calibration item that no longer exists is not a warning. The set
    // is graded against a written key, and a key that names an item the
    // corpus has since reworded grades nothing.
    console.error(`✗ calibration items missing from data/: ${missing.join(", ")}`);
    console.error("  The corpus moved under the key. Fix docs/agents/calibration.md first.");
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const out = path.join(outDir, "calibration-source.json");
  await writeFile(
    out,
    `${JSON.stringify({ questions: CALIBRATION_IDS.map((id) => found.get(id)) }, null, 2)}\n`,
    "utf8"
  );

  console.log(`${CALIBRATION_IDS.length} calibration item(s) → ${out}`);
  console.log(`Now blind it, and hand the reviewer ONLY the blinded file:`);
  console.log(`  npm run blind -- ${out} ${outDir}`);
}

await main();
