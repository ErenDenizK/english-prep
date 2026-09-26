#!/usr/bin/env node
// Turns one of the prep school's published word lists into JSON.
//
// The lists are four-column tables with a bold heading over each group, so
// a plain text extraction reads straight across the page and interleaves
// four unrelated lists into nonsense. Words are bucketed by their x
// position instead, and a heading is any cell set in bold.
//
// Kept in the repo rather than in a scratch directory because there is
// more than one of these lists — the prep school publishes one per level —
// and the next one should cost a command rather than an afternoon.
//
//   node tools/extract-wordlist.mjs <list.pdf> <out.json>
//
// It needs a PDF reader, which this project does not and will not depend
// on. Point it at one:
//
//   PDF_PARSER=/usr/lib/python3/dist-packages node tools/extract-wordlist.mjs ...
//
// or just run tools/extract-wordlist.py, which is what this shells out to.
// Node is the front door only so the command matches every other tool
// here; the parsing is Python because that is where the PDF libraries are.

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const [pdf, out] = process.argv.slice(2);
if (!pdf || !out) {
  console.error("usage: node tools/extract-wordlist.mjs <list.pdf> <out.json>");
  process.exit(1);
}

const result = spawnSync("python3", [join(here, "extract-wordlist.py"), pdf, out], {
  stdio: "inherit",
});
if (result.error || result.status !== 0) {
  console.error(
    "\nCould not run the extractor. It needs Python with pdfplumber:\n" +
      "  pip install pdfplumber\n" +
      "Neither is a dependency of this project, and neither should become one — " +
      "this tool runs once per published list, not at build or test time."
  );
  process.exit(2);
}
