# Validation — v0.68

4 October 2026 (Türkiye time; 3 October UTC). Baseline: shipped `c92be0c`.
The original material from `test` commit `39dcd46` remains unchanged:
**10 topics, 60 continuous lessons, 241 questions and 723 option notes**.
No changes to `data/`, `original/` or `legacy/` in this round.
Previous results remain in the Git history; [v0.66](VALIDATION-v0.66.md) and
[v0.67 review](audit/readability-v0.67.md) are historical evidence.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run check` | **224 unit tests passed**, zero failures/skips; content format/schema and original/current palette checks passed. Includes six motion preference/lifecycle tests. |
| Current palette | **4,524 numeric comparisons passed**:154 opaque pairs,330 aura compositions,4,040 sRGB action-gradient samples. These are color calculations, not separate browser/usability tests. |
| `tools/verify-ui.mjs` | **3,600 checks passed in one uninterrupted final run** under `/english-prep/`, including all articles, themes, responsive flows, keyboard, history, backup and error paths. |
| `tests/editorial_smoke.py` | **12 scenarios passed**; source material, study/practice journeys, enlarged text, worker coexistence and preserved original. |
| `tests/quiz_resume_browser.py` | **10 scenarios passed**; refresh/resume, question identity/order, answer timing, history and failure paths. |
| `tests/ux_refinements.py` | **7 scenarios passed**; focus/caret, report/restore outcomes, deferred navigation and accurate launch counts. |
| `tests/reading_system.py` | **13 scenarios passed**; three-page optional tour, pretest skip, continuous/paused/reduced motion, install outcomes, first-visit offline and dynamic About modules. |
| `tests/pretest_progress_browser.py` | **3 scenarios passed**, covering320/390/1440px, correct/wrong pretest answers, expanded explanations, article-only position/resume and short-body completion. |
| Axe-core4.10.3 | **50 scans, zero definite violations**:32 main-app states (8×2widths×2themes) and18 tour/About/open-menu states (6×3width/theme combinations). WCAG2A/AA,2.1AA and best-practice tags. |
| Portfolio |32 screen/viewport selections at320/390/768/1440px; keyboard focus,24px root text/spacing overrides, long text and extra content items tested without overflow. |
| Assets | Eight real app captures generated at390×844 and1440×1000; all loaded. Icons/social image generated from the local Inter face. |

Tests ran in Chromium on the prepared cloud machine, against the production
`/english-prep/` path. No runtime packages, build or account services were added.

## Color and geometry

CandidateA's dark primary/supporting text remains at least **11.03:1/7.18:1**
under conservative complete overlap of all three aura fields; essential edges
remain **3.19:1** or higher. Every single/double/triple composition order is
checked, as are101 positions along the explicitly sRGB primary-action gradient.
Light/system-light declarations agree. The palette checker rejects eight tested
classes of deliberately broken fixture, including unreadable colors, excessive
opacity and unaudited overrides. See [research](research/2026-10-sakura-palette.md).

Browser inspection confirms ordinary blending, bounded0.10/0.05 dark/light
alpha, three fields, opaque card/option surfaces and no leaked legacy topic
hues. Correct/retry labels and glyphs preserve meaning without color. The
inherited white enabled-switch thumb failed; using on-primary ink corrected it.

Axe flags gradient contrast as incomplete, so its zero-violation result is not
an all-clear contrast measurement. The separate conservative palette math and
computed-style review cover those compositions. Collapsed listbox `aria-controls`
was also marked incomplete; its referenced popup exists when opened, with
keyboard focus/active-descendant behavior covered separately.

Reading roles remain Inter18px/30px, question20px/32px, with separate headings,
form labels, short annotations and metadata. Final tests cover enlarged text,
spacing overrides, answer row stability,320px layouts and keyboard focus.

## Motion and progress

The optional three-page tour changes content/focus immediately. The native
View Transition was removed after it blocked hit testing while duplicating the
CSS entry cue. Three28/34/42-second aura loops run across app/About screens;
the persistent pause control, OS reduced motion and visibility handling work.
No result number counts up and no answer waits for an animation.

A four-second settled reader trace with motion on/off recorded no recurring
layout, style recalculation, paint or JavaScript animation frames in that sample.
It does **not** establish battery consumption or frame-rate guarantees on real
phones. See the [motion engineering review](audit/v0.68-motion-engineering.md)
for method, layers, task time and limitations.

Unread lessons show the optional pretest open. Answering it, reading its long
feedback or collapsing it does not advance the article's progress. Skip focuses
the instructional body; saved body-relative fractions restore across viewport
sizes without the pretest. Existing stored fractions remain compatible; because
v0.67 included preliminary height, an older fraction may resume at a slightly
different paragraph, without deleting progress.

## PWA, presentation and limits

The new motion/progress/About-content modules are explicitly precached. A real
first-visit offline failure exposed the missing entries during development and
was fixed. Offline tests clear ordinary HTTP cache and test scoped worker
coexistence. Portfolio screenshots cache when visited; installation does not
claim every lesson or image has downloaded. Manifest identity remains stable.

About content is editable in `about/content.js`, with additional sections and
long-text reflow; [authoring instructions](../about/README.md) explain the model.
The screenshots use real source questions and explicitly disclosed demo
progress/results. A390px viewport is not a claim of physical iPhone testing.

No physical iPhone/Safari install, Android hardware/battery, full assistive-
technology audit or participant learning study was performed. Native install
outcomes were exercised with browser events; their test scope is not proof that
every platform supports installation. Code/browser checks do not prove learning
effectiveness or invalidate future readability feedback.

## Reproduce

Start `python3 -m http.server 8012 --bind 127.0.0.1 --directory /workspace`.
From `/workspace/english-prep` run `npm run check`, the five Python suites above
with `--base-url http://127.0.0.1:8012/english-prep`, and the browser verifier:

```sh
PLAYWRIGHT_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright CHROMIUM_PATH=/usr/bin/chromium node tools/verify-ui.mjs http://127.0.0.1:8012/english-prep
```

Generate the screenshots with `python3 tools/capture-portfolio.py --base-url
http://127.0.0.1:8012/english-prep`. Tool locations are environment-specific;
recheck them in a restored workspace. The [four-pass record](audit/sakura-v0.68.md)
explains what changed between diagnosis and final validation.
