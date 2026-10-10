# Documentation audit · 2026-10-10

Draft for the owner. Nothing here changes the app or replaces `CLAUDE.md`.
Companion drafts: [CLAUDE.draft.md](CLAUDE.draft.md) and [CURRENT.md](CURRENT.md).

## Özet (Türkçe)

- `CLAUDE.md` 495 satır ve üç farklı dönemi üst üste anlatıyor: v0.75'in güncel hâli
  (ilk 118 satır), UI 2/UI 3 dönemi (cam, gölge, halka, geri sayım) ve Eylül'ün içerik planları.
  Yeni bir oturum hangisinin geçerli olduğunu bilemiyor ve eskisini uyguluyor.
- `CLAUDE.md` hâlâ `design-system.md`'yi "bağlayıcı" diyor; o dosya ise kendini "tarihî" ilan
  ediyor. Gerçek görünüm `css/editorial.css` (Margin/Sakura) dosyasında.
- Kodla çelişen en az 12 cümle var: tek stil dosyası (aslında 8), `.app-content` (yok),
  "Atla" düğmesi (yok), sayfalı okuyucu (artık tek akan makale), skor halkası, sınav tarihi
  soran ilk açılış, Profil'de yol haritası (gösterilmiyor), 430 kontrol (3.400+), 320/608 px
  panel (300/592 px).
- Bazı kurallar tek bir bozuk sürümü düzeltmek için yazılıp kalıcı ilke gibi duruyor.
  En önemlisi "cam yok": v0.57'de bulanık barların arkasından yazı okununca konuldu, sonra
  Margin "cam/oyunlaştırılmış görünümü" kaldırırken kalıcılaştı, aile notlarına
  "dokunulmaz" diye geçti. Senin dediğin gibi cama ya da grene ilke olarak karşı değilsin.
- Taslak `CLAUDE.md` 120 satırın altında: uygulama ve öğrenci profili, dosyaların yeri,
  gerçekten değişmez 9 kural, ucuz doğrulama, güncel belgelere işaretler. Tasarım değerleri
  orada tekrar edilmiyor; tek kaynak Margin belgesi ve `CURRENT.md`.
- `CURRENT.md` yeni oturumun ilk okuyacağı tek sayfa: ekranlar, gerçekten uygulanan görsel dil,
  zayıf noktalar ve açık sorular.
- Eski planlar (UI 2/3, beta1, v1, redesign, eski design-system, 01–17 tasarım klasörleri)
  `docs/history/`'e taşınmak üzere listelendi; henüz taşınmadı.

### Senin vermen gereken kararlar

1. **Cam (blur) yeniden serbest mi?** Seçenekler: (a) serbest, ama okunabilirlik ölçülerek
   (arkasından yazı okunmamalı); (b) şimdilik opak kalsın ama "kararla cam yok" yazısı silinsin;
   (c) yasak kalsın.
2. **Gren/doku serbest mi?** Hiçbir belge greni yasaklamıyor ama kodda da yok. (a) aura/zemin
   için serbest, (b) şimdilik yok, ileride bakılır.
3. **`app1-final.md` "kapalı plan" hâlâ bağlayıcı mı?** (a) evet, yalnızca içerik işleri
   (so/such, paragraf tamamlama) için; (b) hayır, uygulama düzeyi büyük iyileştirmelere açılsın
   ve yeni bir yol haritası yazılsın.
4. **Taslakları ne zaman geçirelim?** (a) `CLAUDE.md`'yi taslakla değiştir ve geçmişi
   `docs/history/`'e tek seferde taşı; (b) önce yalnızca `CLAUDE.md`, taşıma sonra; (c) önce
   düzelt istediğin yerleri söyle.
5. **About sayfası ve kurallar:** About değişebilir dedin. (a) folio dahil About'u "dokunulmaz"
   listesinden çıkar; (b) folio kalsın, metin ve yapı serbest olsun.

## How to read the tables

Class: **a** current and true · **b** historical/superseded · **c** a fix for one broken
version, stated as a permanent principle · **d** contradicted by the code · **e** unclear.
`C:n` is a line in `CLAUDE.md` at commit `3b8b261`. Evidence was read from the files named,
on this branch.

## 1. Rules and claims in CLAUDE.md

### 1.1 "Current presentation (v0.75)", C:5–118

| # | Claim | Class | Evidence |
|---|---|---|---|
| 1 | ADR 013 + Margin supersede older visual values (C:7–9) | a, but see contradiction X1 | `docs/margin-design-system.md:3` points to ADR 012 and is headed v0.74 |
| 2 | Inter role typography from ADR 006 and Sakura brand remain (C:9–10) | a | `css/editorial.css:6-12` (Inter variable), `:13-22` Sakura tokens |
| 3 | Correct = opaque Sakura, selected incorrect = periwinkle, separate `ok-edge`/`no-edge` (C:10–11) | a | `css/editorial.css:27-33` |
| 4 | Pink is a product choice, not a universal claim; marks + verdict words carry meaning (C:12–14) | a | `docs/margin-design-system.md:34` |
| 5 | Lagoon / iris / apricot roles (C:14–15) | a | `--cool`, `--secondary`, `--tertiary` in `css/editorial.css` |
| 6 | Three aurora clusters, 9.75/11.75/13.75 s drift, 13.5/15.75/18 s colour cycles (C:18–20) | a | `css/editorial.css:1586-1599` |
| 7 | One parent opacity cap .42 dark / .09 light, never per layer (C:20–21) | a | `css/editorial.css:95,134,165,1570` |
| 8 | Palette checker proves the convex envelope (C:21–23) | a | `tools/editorial-palette.mjs`, run by `npm run color` (`package.json`) |
| 9 | Static halo only on selected neutral titles; prose never glows (C:23–24) | a (e for "only") | Margin `:94`; not exhaustively checked |
| 10 | Motion toggle only in Profile; About links there (C:24–25) | a | `js/profile.js:41,409`; `js/motion.js` |
| 11 | Hidden pages pause twelve timelines; reduced motion = three still pools (C:25–26) | a | Margin `:96`; `css/editorial.css:1674` |
| 12 | v0.72 page openings restored: 360 ms, 12 px (C:28–30) | a | `css/editorial.css:98` `--d-route: 360ms`; ADR 013 |
| 13 | 120 ms press, 380 ms release (C:30–31) | a | `css/interactions.css:3,91,98` |
| 14 | Never reparent a clicked descendant during pointerdown; one key activation = one release (C:31–33) | c (valid engineering note, written for one v0.73 bug) | ADR 012/013 history; belongs in `js/interactions.js` doc comment, not CLAUDE.md |
| 15 | "These choices follow user feedback rather than a universal motion limit" (C:35–36) | a | ADR 012:8 |
| 16 | `js/interactions.js` owns finite effects; `whenVisible` waits for fonts/images (C:38–44) | a | `js/interactions.js`, imported by `js/home.js:42` |
| 17 | theme-color only `(display-mode: standalone)` on all four entry pages (C:46–47) | a | `index.html:9`, `quiz.html:8`, `results.html:8`, `about/index.html:6` |
| 18 | Atmosphere extends to `100lvh`, controls stay in `dvh` (C:48–50) | a | `css/editorial.css:1574-1576` |
| 19 | Physical iPhone toolbar unverified (C:51–52) | a (open question) | CHANGELOG v0.75 |
| 20 | About feature disclosure grid; "do not let the press wrapper's flex collapse label and title" (C:54–57) | c | one v0.75 render bug (CHANGELOG v0.75 first bullet) |
| 21 | Rail: 1.5 px thread, 5 px thumb, 8 px held, 14 px pull, 44 px target, 16 px strip (C:59–71) | a | `css/scroll-rail.css:2,10,59-61`; `js/scroll-rail.js` |
| 22 | "No opaque well, pulse ring or separate release keyframe remains" (C:62–63) | c | describes what v0.72's rail had; a removal note, not a rule |
| 23 | `js/brand.js` signatures, optional three-page intro, never writes progress (C:73–76) | a | `js/brand.js`, `js/onboarding.js` |
| 24 | Pretest starts open, skippable, excluded from progress (C:76–77) | a | `js/education.js:1296` ("Derse geç") |
| 25 | `englishPrep.resultPresented` tab-local marker (C:79–81) | a | `js/results.js:112-113` |
| 26 | Companion pane sticky at ≥1080×800, flows below (C:83–85) | a | `css/composition.css:55,58` |
| 27 | About folio, no screenshot gallery (C:85–91) | a; c for "There is no screenshot gallery" (a v0.69 removal stated as a rule) | `about/about.js`; CHANGELOG v0.69 |
| 28 | Backup preview, share/download/copy explicit, v1 format unchanged (C:93–99) | a | `js/backup-ui.js`, `js/backup.js` |
| 29 | Exam dates, goals, streaks, reminders stay out of the UI; stored values compatible (C:101–102) | a | `docs/EXPERIENCE.md:13`; `js/onboarding.js` asks name only |
| 30 | Captures 3× phone / 2× wide WebP (C:104) | a | `about/assets/` |
| 31 | Browser tests listed exist (C:105–108) | a | `tests/*_browser.py`; no npm script runs them (see W5 in CURRENT) |
| 32 | Install support in `js/install.js`; address bars cannot be removed (C:108–111) | a | `js/install.js`, imported by `js/home.js:1` |
| 33 | "Historical descriptions below do not authorize reinstating old visuals" (C:116–117) | c, and the root cause of the "glass ban" reading | It turns every later section into history without saying which; sessions read it as "glass is forbidden" |

### 1.2 What this is / who it is for, C:120–164

| # | Claim | Class | Evidence |
|---|---|---|---|
| 34 | Static, mobile-first, Turkish prep exams (YTÜ İYS style), Eğitim + Test bottom nav, Profil in header (C:122–128) | a | `index.html:65,107-110` |
| 35 | Eğitim = "article-based lessons in a **paged reader**" (C:124) | d | lessons are one continuous article: Margin `:81`, EXPERIENCE `:5` ("scrolling article lessons") |
| 36 | No accounts, backend, analytics; localStorage only (C:130–131) | a | `js/storage.js`; no network code in `js/` |
| 37 | Learner profile: competence without the labels, explain notation not language, X vs Y, no over-absolute rules, refine not teach (C:135–164) | a | owner 2026-09-05; still drives `docs/agents/question-author.md` |

### 1.3 Non-negotiables, C:166–192

| # | Claim | Class | Evidence |
|---|---|---|---|
| 38 | No build step; zero dependencies (C:168–170) | a | `package.json` has no `dependencies`; `index.html` loads CSS/ES modules directly |
| 39 | No `innerHTML` anywhere (C:171–173) | a | no `innerHTML`/`insertAdjacentHTML` in `js/` or `about/*.js` (comments only: `js/dom.js:2`) |
| 40 | Verify at 320 px first; fixed shell; only **`.app-content`** scrolls (C:174–176) | a, d for the class name | the scroller is `main.shell__scroll#shell-scroll` (`index.html:76`); `.app-content` exists nowhere |
| 41 | Answering never moves the button the learner is about to tap (C:176) | a | Margin `:69` reserved verdict column |
| 42 | Wide layout: **320 px** pane, **608 px** column, five screens (C:177–184) | d (values) / a (principle) | live value `--w-aside: 300px` (`css/editorial.css:70`); Margin `:67` says 300 px pane, ~592 px column, 988 px frame; old 320 px is `css/style.css:169` (overridden) |
| 43 | Reader and quiz never get a pane (C:182–184) | a | Margin `:67` "articles and quizzes remain single-column" |
| 44 | Navigation settled by feedback; Profil out of tab bar (C:185–187) | a | `index.html:107-110` |
| 45 | Unanswered lesson check reads **"Atla"** (C:187–188) | d | no "Atla" string in `js/`; checks sit inline in the article and simply do not gate (`js/education.js:1203`) |
| 46 | Version `x` stays 0 (C:189–192) | a | CHANGELOG head `v0.75` |

### 1.4 Commands, branches, layout, C:194–292

| # | Claim | Class | Evidence |
|---|---|---|---|
| 47 | Command list (C:196–211) | a, incomplete | `package.json`; missing `format:check`; tools not listed: `editorial-palette.mjs`, `capture-portfolio.*`, `make-world.mjs`, `ship-topic.mjs`, `extract-wordlist.*`, `token-check.mjs` |
| 48 | `npm run color` = palette + stylesheet check (C:199) | a, incomplete | also runs `tools/editorial-palette.mjs`, the checker for the **live** layer |
| 49 | `check` = "all four", in CI on `main`/`test` (C:202,214) | a | `package.json`; `.github/workflows/` (push/PR to main, test) — this branch is not covered by CI |
| 50 | Run `npm run format` after editing content (C:217–221) | a | `tools/format-content.mjs`; CI step "Check content formatting" |
| 51 | `test` is live; `main` is one commit, 180+ behind (C:225–235) | a / e | `test` live per owner; `main` is not fetched in this clone, count unverified |
| 52 | `css/style.css` "Single stylesheet" (C:273) | d | eight stylesheets load: `index.html:49-56` |
| 53 | `css/fonts.css` "the three subset faces" (C:274) | b | Source Sans/Serif faces kept for `original/`; the live face is Inter from `assets/fonts/` (`css/editorial.css:6-12`) |
| 54 | Layout tree (C:239–291) | b/d | missing `brand.js`, `motion.js`, `interactions.js`, `scroll-rail.js`, `backup*.js`, `install.js`, `share.js`, `theme.js`, `progress.js`, `prompt.js`, `session-state.js`, `about/`, `original/`, `legacy/`, six stylesheets |
| 55 | `widgets.js`: ring, monogram, choice group, count-up (C:254–255) | d | `ring`, `monogram`, `initialsOf`, `choices`, `countUp` have no callers; only `avatar`, `hueOf`, `haptic` are used |
| 56 | `celebrate.js` confetti (C:257) | d | not imported by any page or module; only precached in `sw.js:17` |
| 57 | `icons.js` "the 20 hand-drawn icons" (C:266) | e | count not re-verified; Margin adds custom icons (ADR 008) |
| 58 | `data/roadmap.json` "Shown in Profil" (C:277–278) | d | `loadRoadmap` (`js/topics.js:90`) has no caller |
| 59 | `docs/content-review.md` "all 72 questions" (C:291) | b | corpus is 241 questions (counted from `data/`) |

### 1.5 Design, C:294–339 (the core of the problem)

| # | Claim | Class | Evidence |
|---|---|---|---|
| 60 | `docs/design-system.md` is "the binding specification" (C:296) | d / b | the file itself says "Historical specification" (`docs/design-system.md:3-9`) |
| 61 | Depth = lighter plane + tokenised shadow; one card level; "one accent with a glow" (C:301–305) | b | `--shadow-glow: none`, `--glow: transparent` (`css/editorial.css:44-45`) |
| 62 | Colours solved, not chosen by eye, both themes, in CI (C:305–308) | a, but points at the wrong tool | live layer is measured by `tools/editorial-palette.mjs`; `tools/palette.mjs` measures the overridden UI 3 tokens |
| 63 | "Slate dark by default" (C:308) | b | plum `#141216` (`css/editorial.css:14`) |
| 64 | Five type sizes 36·28·22·18·15; 15 px only at 600 (C:310–312) | b | Margin roles 30/24/20/18/16/14 (`css/editorial.css:51-62`, Margin `:50-59`) |
| 65 | New text rule → add a row to `PAIRS` in `tools/palette.mjs` (C:312–313) | b / e | the live checker is `editorial-palette.mjs`; unclear which file a new rule must enter |
| 66 | Structure first: bar · body · foot; 21 components each in `docs/components.html`, enforced by the sweep (C:315–322) | a for the anatomy (`js/shell.js`), e for "21" and enforcement | sweep loads components.html (`tools/verify-ui.mjs:1378`) |
| 67 | UI 3: chrome is glass ≥82 % opaque, capsule tab bar, lit cards, daily ring, countdown, topic colours, answers pop or shake, score ring counts up, first run asks exam date and goal (C:324–332) | b and d | glass neutralised (`css/editorial.css:184-189`); no score ring/count-up (Margin `:83`); no shake (Margin `:108`); onboarding asks name only (C:101) |
| 68 | Motion on three springs from `scratchpad/ui3/spring.mjs`; transform/opacity only (C:332–334) | d / b | `scratchpad/` does not exist in the repo; live motion uses `cubic-bezier` tokens (`css/interactions.css:91`) |
| 69 | "No shadow, easing or component inline: tokens or nothing" (C:334–335) | a as a principle | still how `editorial.css`/`interactions.css` work |

### 1.6 Where the project is going, C:341–364

| # | Claim | Class | Evidence |
|---|---|---|---|
| 70 | `docs/app1-final.md` is the closed plan (C:343–348) | e | dated 2026-09-06 at v0.39; the owner now expects app-level improvements (owner decision 3) |
| 71 | `docs/app2/` is research for a second app, nothing built (C:350–353) | a | |
| 72 | `docs/v1-plan.md` is the plan of record; what is left is vocabulary, so/such, paragraph completion (C:358–364) | b / d | vocabulary shipped (`data/academic-*`, `data/roadmap.json` "Kelime: done"); so/such still has no topic (`js/topics.js:334`); paragraph completion planned |

### 1.7 Conventions and content authoring, C:366–472

| # | Claim | Class | Evidence |
|---|---|---|---|
| 73 | Turkish UI/explanations, English examples/options/category names (C:368–371) | a | `data/*/*.json` |
| 74 | `lang="en"` on English text (C:373–376) | a | 23 `lang` settings in `js/` |
| 75 | Replaced native controls owe the full contract; listbox; native `<dialog>` (C:378–387) | a | `js/listbox.js`, `js/modal.js` |
| 76 | Content is data; schema in `CONTENT_GUIDE.md`, validator (C:389–392) | a | `tools/validate-content.mjs` |
| 77 | Lesson ids derived by `lessonId(topicId, category)` (C:394–398) | a | `js/topics.js:157` |
| 78 | Lesson = `{category, summary, blocks}` with typed blocks (C:400–405) | a, list incomplete | data also uses `text` and `examples` blocks (counted: pitfall 172, check 120, text 100, contrast 85, decision 63, forms 60, examples 60) |
| 79 | Block history paragraph (C:407–413) | b | history; the rule "no fourth schema change without asking" is in `app1-final.md` §7 |
| 80 | Content authoring loop, calibration, blind, solve, reviewer, category spec (C:417–465) | a | `docs/agents/*`, `tools/blind-corpus.mjs`, `tools/make-calibration.mjs`, `tools/solve.mjs` |
| 81 | Stories of how each rule was learned (C:426–440, 458–460) | b | belong in `docs/agents/README.md`; rules stay |
| 82 | Never build a question on its own lesson's sentence; an option a competent teacher would accept is wrong (C:467–472) | a | `docs/agents/question-author.md` |

### 1.8 Verifying, C:474–495

| # | Claim | Class | Evidence |
|---|---|---|---|
| 83 | `npm run serve` + `npm run verify` for UI changes (C:479–482) | a | `package.json` |
| 84 | "~430 checks" (C:481) | d | CHANGELOG v0.56–v0.58 already report 3,335–3,462 checks |
| 85 | Sweep at 320/390/768/1280 (C:485) | a | `tools/verify-ui.mjs:8,94-95` |
| 86 | Playwright is not a dependency; global install or `PLAYWRIGHT_PATH` (C:492–495) | a | `tools/verify-ui.mjs` |
| 87 | The sweep asserts bars ≥0.8 opaque "before their blur" | c | `tools/verify-ui.mjs:2765` still checks UI 3 glass; the live bars are fully opaque so it passes trivially |

## 2. Rules born from one broken version (class c), in one list

| Rule as it reads now | Where | Where it came from | Suggested status |
|---|---|---|---|
| **No glass** ("no glass by decision", "untouchable") | `docs/family/README.md:34,53`, `docs/family/kit/README.md:45`, `css/editorial.css:2-3,184-189` | v0.57: blurred bars let text show through where the engine failed to composite the blur (CHANGELOG v0.57); v0.66 Margin then replaced the whole "glass/gamified skin" because the owner disliked UI 3 as a whole, not glass as such | A taste question for the owner (decision 1). If allowed: keep the measurable part (text behind must never be readable; reduced-transparency fallback) |
| **Bars must be opaque, nothing scrolls under them** | CHANGELOG v0.57; sweep at the time | same bug | Replace with the legibility test |
| **No grain** | not written in English Prep docs; the family kit records that Recto's "no grain" was a misrecording (`docs/family/kit/PROMPT-TEMPLATE.md:74-76`) | Recto's glass banding fix | State "grain is allowed; no decision yet" (decision 2) |
| **No animated blur, hue rotation, particles, parallax** | Margin `:94`, ADR 006:80 | ADR 006's "faint, restrained" brief, before the owner asked for a living aura (ADR 011) | Keep only "reading text never moves or changes colour"; the rest are open techniques |
| **No count-up, no score ring, no confetti, no shake** | Margin `:83,108`, ADR 007:93-94 | the owner found rings unhelpful (ADR 007 context); "punitive" shake is a pedagogy point | Keep "no punitive feedback" and "numbers are final from the first frame"; rings are a taste call, not a principle |
| **No screenshot gallery on About** | C:90–91 | v0.69 About rewrite | About may change; drop as a rule |
| **Press wrapper must not collapse About labels** | C:54–57 | v0.75 render bug | Move to a code comment |
| **Never reparent during pointerdown** | C:31–32 | v0.73 input bug | Keep as an engineering note in `js/interactions.js` |
| **Rail: no opaque well / pulse ring** | C:62–63 | v0.72 rail rejected | History |
| **"Historical descriptions below do not authorize reinstating old visuals"** | C:116–117 | written to stop sessions reviving UI 3 | Remove; make history physically separate instead |

## 3. Contradictions between documents

| ID | Contradiction | Files |
|---|---|---|
| X1 | Which document is current: CLAUDE.md says ADR 013 + Margin, Margin says ADR 012 and is headed v0.74, EXPERIENCE is v0.74, CLAUDE is v0.75 | `CLAUDE.md:7`, `docs/margin-design-system.md:1,3`, `docs/EXPERIENCE.md:1` |
| X2 | `design-system.md` "binding" vs "historical" | `CLAUDE.md:296` vs `docs/design-system.md:3` |
| X3 | Glass: UI 3 section describes glass chrome as current; Margin removes it; family README makes "no glass" untouchable; owner says glass is not banned | `CLAUDE.md:326`, `css/editorial.css:2`, `docs/family/README.md:53` |
| X4 | Colour tooling: CLAUDE.md names `palette.mjs`/`PAIRS`; Margin and family README name `editorial-palette.mjs` as the live checker | `CLAUDE.md:199,313`, Margin `:38`, `docs/family/README.md:45` |
| X5 | Plan of record: `app1-final.md` "closed plan" vs `v1-plan.md` "plan of record" vs `roadmap.md` "history" vs `data/roadmap.json` (user-facing, not shown) | `CLAUDE.md:343,358` |
| X6 | Typography: CLAUDE.md five sizes, ADR 006 role table, Margin role table (30/24/20/18/16/14) | `CLAUDE.md:310`, ADR 006:42-51, Margin `:50-59` |
| X7 | Wide layout: 320/608 (CLAUDE.md, design-system §7.3) vs 300/592/988 (Margin, live CSS) | `CLAUDE.md:178`, `css/editorial.css:70` |
| X8 | Atmosphere: ADR 006 "keep reading backgrounds opaque or suppress the aura there" vs ADR 011+/Margin "behind every route, including lessons and questions" | ADR 006:80, Margin `:94` |
| X9 | Motion: ADR 007/008 "restrained", ADR 009/010 "expressive", ADR 012 "visibly expressive", ADR 013 back to v0.72 openings; only the last one is current, and each ADR restates the parts it keeps | `docs/adr/007-013` |
| X10 | ADR numbering starts at 006; 001–005 do not exist in `docs/adr/` | `docs/adr/` |
| X11 | Lesson reader: "paged reader" (CLAUDE.md) vs continuous article (Margin, EXPERIENCE) | `CLAUDE.md:124`, `docs/EXPERIENCE.md:5` |
| X12 | Browser tests assume different servers: `tests/aura_browser.py` uses `:8000`, `tests/v073_review_browser.py` uses `:8182/english-prep` | test argparse defaults |

## 4. What would move to docs/history/ (not moved yet)

Plans and specs that describe earlier presentations or closed rounds:

- `docs/design-system.md` (UI 2/UI 3 spec; extract §8 accessibility contract and §9 technical
  constraints first and re-check them against the code; much of them still applies)
- `docs/ui2-plan.md`, `docs/ui3-plan.md`, `docs/redesign-plan.md`, `docs/beta1-plan.md`,
  `docs/v1-plan.md`, `docs/app-plan.md`, `docs/roadmap.md`, `docs/proto-ui4.html`
- `docs/VALIDATION-v0.66.md`, `docs/content-review.md` (72-question review)
- `docs/design/01-diagnosis.md` … `docs/design/17-olcum/` (the numbered UI 4 research folders),
  `docs/mockups/`, `docs/previews/`
- superseded versioned design notes: `docs/design/about-v0.68-plan.md`, `about-v069.md`,
  `about-v070.md`, `about-v071.md`, `onboarding-v069.md`, `onboarding-v070.md`,
  `scroll-rail-v071.md`, `scroll-rail-v072.md`, `interaction-backlog-v069.md`,
  `composition-v071.md` (the current ones stay: `about-v072.md`, `onboarding-v071.md`,
  `scroll-rail-v073.md`, `motion-v073.md`, `profile-results-v070.md`)
- research written for earlier rounds: `docs/research/beta1-*.md`, `ui-improve.md`,
  `visual-longevity.md`, `2026-10-motion-v070.md`, `2026-10-motion-v071.md`,
  `2026-10-interaction-motion-v069.md`, `2026-10-status-colors-v069.md`
- ADRs 006–011 stay in `docs/adr/` (ADRs are history by nature) but get a "Superseded by" line
- from `CLAUDE.md`: C:5–118 (moves into `CURRENT.md` and the Margin doc), C:301–339 (UI 2/3),
  C:355–364 (old plans), C:407–413 and the story parts of C:423–460 (to `docs/agents/README.md`)

`legacy/` and `original/` are served snapshots of the MVP and the v0.64 interface; they stay
where they are.
