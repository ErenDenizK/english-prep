# Validation

The redesigned app uses the complete `test`-branch corpus: **10 topics, 60 lessons, and 241 questions**. All **12 files in `data/` are byte-identical to `original/data/`**. The original remains available at `/original/`.

## Commands

Serve the repository with `npm run serve`, then run:

```sh
npm run check
python tests/editorial_smoke.py --base-url http://127.0.0.1:8000
CHROMIUM_PATH=/usr/bin/chromium npm run verify -- http://127.0.0.1:8000
```

Browser tooling is external to the application. This cloud environment supplies Python Playwright and Chromium. Its Node verifier also needs:

```sh
export PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
```

No application runtime dependency or build step was added.

## Results

- `npm run check`: **174 unit tests pass**, including content and palette validation. The existing content warning remains: `academic-nouns-adjectives-t13` and `academic-nouns-adjectives-t16` have identical option sets.
- `tests/editorial_smoke.py`: **9 browser scenarios pass**. The original eight passed together; the added service-worker scenario and expanded pretest-disclosure check passed separately.
- Source browser verifier: **3,535 of 3,536 checks passed** in the full sweep. Its sole failure found a desktop reading-column width mismatch. After correcting the grid gap, the unchanged wide-layout checks passed **35/35**, including equal 592px reading columns, all split layouts, touch targets, and quiz/results geometry. The responsive dark/light browser journey also passed again after that correction.
- Axe-core 4.10.3: **32 scans, zero definite violations** across eight screen states, dark/light themes, and 320/1440px layouts. Score text overlapping SVG rings requires manual contrast review because axe cannot determine the background there. Its collapsed-listbox warning was checked manually: the referenced popup ID exists and theme selection works.
- Palette audit: **112 foreground/background pairs pass**. Minimum ratios are 11.88:1 for prose, 4.92:1 for secondary text, 3.12:1 for control boundaries, and 4.96:1 for focus indicators.

The browser suite covers:

1. All topic introductions and every authored article string, including contrast, forms, examples, pitfalls, decisions, and checks; all lessons finish by scrolling.
2. Optional collapsed pretests and non-gating inline checks, preserving scroll and feedback state.
3. Mixed-test scoring, full answer explanations, duplicate-free results refresh, and exact mistake-book question selection.
4. Complete single-topic tests followed by category-specific practice.
5. Early finish scoring only the questions answered.
6. Profile name, persistent theme selection, real JSON backup download, safe reset, invalid-backup rejection, and restore.
7. Complete original-version practice and shared history.
8. Dark/light journeys at 320, 390, 768, and 1440px, without horizontal overflow or answer-bar movement.
9. Separate root/original service-worker scopes and caches, cached editorial CSS/font assets, and offline reload of complete articles in both versions.

The source verifier retains its geometry, touch-target, keyboard, storage, content, and offline assertions. Its typography, optional-onboarding, copy, no-confetti, and scope-specific-cache expectations were updated for the redesign. Visually hidden text is excluded from painted typography measurements; invisible outlines are checked by style and width.

## Reference views

- [Mobile](previews/mobile.png)
- [Desktop](previews/desktop.png)
- [Dark theme](previews/dark.png)
- [Article](previews/article.png)
