# Roadmap to V1 and after

Written 2026-10-10 at v0.77. Replaces every earlier plan (now in `docs/history/`). V1 is defined
in [`PRINCIPLES.md`](PRINCIPLES.md) §1: a working, presentable, family-aligned product the owner
signs off. Each phase lists what it delivers and how it is checked. Owner decisions are marked
**[owner]**; a session proposes, the owner chooses, and nothing marked so ships unseen.

> **Özet.** Beş faz: (0) dokümanları tek doğruluk kaynağına indirmek, (1) teknik temel: testleri
> CI'a almak, ölü kodu ve eski görünüm katmanını silmek, fontu küçültmek, (2) ürün cilası:
> bilinen görsel kusurlar, (3) aile ve sunum: tüzüğün sekiz kuralı, gerçek ekran görüntüleri,
> klip, world.json, hikâye, (4) laboratuvar: cam ve yeni teknikler, ölçülerek ve senin onayınla.
> Sonra sen V1 dersin. V1'den sonra ürün yönü kararı ve içerik gelir.

## Phase 0 · One source of truth (docs and agents)

Goal: a new session reads three short documents and acts correctly.

- [x] Merge the family kit and handover drafts into `test`; fix `tools/make-world.mjs` for v0.77.
- [x] New `CLAUDE.md` (about 120 lines): what the app is, where things live, the hard rules,
      cheap verification. No design values, no history.
- [x] `docs/STATE.md`: the app as the code is today (v0.77), verified file by file. Replaces
      `docs/history/handover/CURRENT.md` and `docs/history/handoff-v1.md`.
- [x] `docs/PRINCIPLES.md`, this roadmap, `docs/PRODUCT-DIRECTION.md`.
- [x] Superseded plans, specs, audits and round notes move to `docs/history/`.
- [ ] Remaining live docs that still describe the folio About or old motion (EXPERIENCE,
      Margin, development) get rewritten sections, not just banners.
- [x] Agent briefs: fix the delivery paths in `docs/agents/`; the family `README.md` drops "no glass" for
      the material contract; the old session prompt moves to history.
- [ ] `docs/family/OUTBOX.md` for findings to the portfolio **[owner: approve the outbox idea]**.
- [ ] Old branches deleted on GitHub, leaving `main` and `test` **[owner: the session cannot
      delete remote branches]**.

Check: every relative link in live docs resolves; `npm run check` green; a fresh session given
only `CLAUDE.md` can name the live branch, the current design document and the V1 definition.

## Phase 1 · Foundation (no visible change)

Goal: every later change is cheap and safe to verify.

1. **Browser suites in CI.** One harness for `tests/*_browser.py`: shared `--base-url` and
   `--browser-path` flags with environment defaults, one port, `tests/requirements.txt`
   (playwright, pillow), a CI job running them with `npm run verify`. Rename version-named suites
   by feature (`v073_motion_browser.py` → `motion_browser.py`).
2. **Dead code out.** `js/celebrate.js`; unused exports in `js/widgets.js`, `js/storage.js`,
   `js/topics.js` (`loadRoadmap`, `data/roadmap.json`), `js/backup-ui.js`; unused CSS and tokens;
   `css/fonts.css` and `fonts/` (the Source faces are never used); `legacy/`; the dead glass and
   `::view-transition` rules in `css/style.css`; `sw.js` precache list updated.
3. **Fonts.** Subset Inter to Latin + Turkish + arrows and the symbols in use (344 KB → about
   100 KB), keep both axes; one `@font-face`.
4. **One style stack.** Every stylesheet in one ordered `@layer` list; the UI 3 skin under
   `editorial.css` deleted rather than overridden; `!important` removed; one token source;
   `tools/palette.mjs` retired or pointed at the live tokens; the sweep's "bar alpha ≥ 0.8" check
   replaced by real legibility checks. Highest value and highest risk of the phase: done in
   steps, each with `check`, `verify` and the browser suites green, and before/after screenshots
   identical.
5. **Split the two large modules** without behaviour change: `js/storage.js` (re-exporting
   facade kept), `js/education.js`.
6. **Offline:** precache About's images; `sw.js` `VERSION` bumped every release.
7. Content: fix the identical option sets in `academic-nouns-adjectives` t13/t16.

Check: identical screenshots before and after at the three sizes; all suites green in CI; first
load bytes measured and recorded in `STATE.md`.

## Phase 2 · Product polish (the V1 "Looks" bar)

Known defects, from the 2026-10-10 screenshots (`STATE.md` weak spots):

1. The tab capsule overlaps the last list row at rest on wide and tablet screens.
2. The scroll rail sits in the middle third with its thumb mid-screen at the top of a page.
3. Onboarding page 3 leaves a large empty band on phones.
4. Lesson titles truncate in the phone bar (accepted rule; **[owner]** keep or wrap).
5. About: loop section long and dim before scroll; a ghost `ep.` behind the closing action;
   install help made of arrows; always dark even in the light theme (**[owner]** follow theme?).
6. One pass on a real iPhone and Android: motion, the toolbar, the aurora's cost. Dated note.

Check: the polish list is empty; screenshots at 390×844, 1180×820 touch, 1440×900, dark and
light, motion on/reduced/off, forced colours, reviewed by the owner.

## Phase 3 · Family and presentation (the "Tells" and "Belongs" bars)

1. **Charter, all eight rules passing** (`PRINCIPLES.md` §6): About's forced colours; no Unicode
   glyphs as icons; About's three infinite loops made finite; the three sizes in the sweep;
   an idle-frames check; an About v0.77 design note; the promise line linked to its proof.
2. **Motion grammar named:** press/settle/glide/pop mapped onto the existing timings in
   `docs/design/motion-v076.md` and beside `MOTION_DURATIONS`. No timing changes.
3. **Story.** One story across About, README, manifest, page metadata, onboarding: the thesis
   first ("İkisi de doğru. Fark, anlamda."), the exam as context. **[owner]** headline and copy.
4. **Captures and clip.** Rewrite `tools/capture-portfolio.mjs` for v0.77 and the kit's
   `presentation.md` (names, sizes including 1180×820, CDP frames, AV1/HEVC/H.264 with poster,
   6–10 s, rest to rest). Re-shoot About's loop captures, `docs/github/` media and the social card;
   every image names its build. Remove About's drawn device frame.
5. **`world.json` on the kit's schema** (version, slug, source commit, light, motion roles, fonts,
   links, captures); `npm test` keeps it in sync.
6. **Credits line** on About's footer, in English Prep's own type, the `edk.` dot in Sakura
   **[owner: wording, e.g. "Yapan: edk."]**.
7. README rewritten around the same story, with the new media.

Check: the charter table in `PRINCIPLES.md` §6 is all "passes"; the portfolio session can build
the embassy from this repo alone.

## Phase 4 · Lab (modern techniques, under control)

Runs beside phases 2–3, never inside a live screen until promoted (`PRINCIPLES.md` §4).

1. **Glass lab** (`lab/glass/`): the material contract's gates G1–G5 computed live; candidates for
   the top bar, the tab capsule and dialogs over the real aurora; an in-app "Saydamlık" switch
   designed. First, bring About's existing masthead blur under the contract (solid fallback,
   G2), since it is live today without one.
2. **Motion lab:** scroll-driven reveals for About; `@starting-style` exits for dialogs.
3. **Promotion** of at most one surface per release, each with an ADR and the owner's yes.

Check: nothing from the lab is reachable from the app until its ADR records the owner's yes.

## V1

The owner reviews the four bars (`PRINCIPLES.md` §1) on the live `test` build and says V1. Then:
`CHANGELOG` becomes `v1.0`, the owner moves `main` to that build by hand, and the portfolio's
embassy points at it.

## After V1

In order of dependency, not commitment:

1. **Product direction** (`PRODUCT-DIRECTION.md`): exam app, general app, two apps or one.
2. **Content**, if the road needs it: the human cold-solve pass, `so / such`, paragraph
   completion, reading passages (the September plan's remaining 30 of 60 points), the mistake
   review screen.
3. **Platform:** customizable `<select>` replacing `js/listbox.js`; Navigation API router;
   scroll-driven rail; `light-dark()` tokens.
4. **App 2**, if chosen: research in `docs/history/app2/`.
