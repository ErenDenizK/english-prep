# Element inventory and interaction audit

Audited **3 October 2026, Europe/Istanbul**, against the complete `test`-branch application and the current Margin presentation layer. This is a baseline for the four refinement passes, not a proposal to replace the information architecture. Content, learning logic, language, the Education/Test split, and the reading format remain the foundation.

## Method and evidence

- Read the route, education, test, quiz, results, profile, onboarding, shell, answer, feedback, report, listbox, modal, backup, storage, and service-worker modules.
- Inspected the running application at **320×740, 390×844, 768×1024, and 1440×1000**, in **dark and light** themes.
- Collected **120 rendered-state records**: 64 route/search states and 56 interactive quiz, results, listbox, and modal states. No horizontal document overflow or uncaught application error appeared in that matrix.
- Captured fresh screenshots under `/tmp/english-prep-element-audit/`. Earlier screenshots with a perimeter outline around the view are stale: the current view-focus rule has fixed that issue.
- Measured computed typography, spacing, borders, control geometry, states, and active element. Measurements include below-fold layout; content inside a closed native disclosure is not treated as a visible interaction target. Visually hidden file inputs/headings are also excluded from painted-element size conclusions.
- Audited the 60 articles by their shared renderers and verified corpus counts from data. This document inventories every renderer/state; it does not duplicate every authored sentence or answer option.

Evidence files are temporary execution artifacts, not application runtime files:

| Evidence | Location |
| --- | --- |
| Route/state computed styles | `/tmp/english-prep-element-audit/measurements.json` |
| Interactive-state computed styles | `/tmp/english-prep-element-audit/interaction-measurements.json` |
| Focus and stale-route reproductions | `/tmp/english-prep-element-audit/reproductions.json` |
| Narrow dark home | `/tmp/english-prep-element-audit/dark-320-home.png` |
| Dark reading surface | `/tmp/english-prep-element-audit/dark-390-article.png` |
| Wide dark home | `/tmp/english-prep-element-audit/dark-1440-home.png` |
| Delayed lesson corrupting Profile chrome | `/tmp/english-prep-element-audit/dark-390-stale-route.png` |
| Quiz/error/correct/result/dialog views | Matching `dark/light-width-state.png` files in the same directory |

## Learner and low-burden flow

The learner already uses English and needs to distinguish related forms, understand labels, and repair particular gaps. The useful default journey is:

1. Resume an unfinished article, choose a topic, or search the exact distinction.
2. Read its existing Turkish explanation, English examples, contrasts, forms, pitfalls, and decision rules on one scrolling page.
3. Optionally open the pretest or use an inline check; neither gates reading.
4. Launch practice for that topic/category, understand the explanation, and proceed deliberately.
5. Review mistakes and return to the relevant article; revisit the mistake book later.

The existing two content destinations, header Profile control, topic overview, direct search results, and free navigation already support this. Refinement should lower visual and interaction effort within this flow. It should not add flashcards, compulsory setup, locked chapters, rewards, or a new navigation hierarchy.

## Corpus and article coverage

All ten live topics have six articles. Tenses has 25 questions; the other topics have 24 each. Total: **10 topics, 60 articles, 241 questions**.

| Topic | Articles | Questions |
| --- | ---: | ---: |
| Tenses | 6 | 25 |
| Modals | 6 | 24 |
| Passive Voice | 6 | 24 |
| Closest Meaning | 6 | 24 |
| Connectors & Discourse Markers | 6 | 24 |
| Quantifiers & Determiners | 6 | 24 |
| Relative Clauses | 6 | 24 |
| Gerunds & Infinitives | 6 | 24 |
| Academic Nouns & Adjectives | 6 | 24 |
| Academic Verbs | 6 | 24 |

The actual JSON `type` values are 217 cloze and 24 restatement questions; pedagogical vocabulary/cloze subgroups share those renderers.

| Article block | Instances | Rendered elements and behavior |
| --- | ---: | --- |
| `text` | 100 | Turkish paragraphs; permitted bold/emphasis; no card around each paragraph. |
| `contrast` | 85 | Section heading, English form label, Turkish gloss, optional English example; related sides grouped in one quiet band. |
| `forms` | 60 | Form labels and grouped pattern/use/example rows; reference-style separators. |
| `examples` | 60 | English sentence followed by Turkish teaching note. |
| `pitfall` | 172 | Wrong/right sentence pair, distinct cross/check glyphs, explanation; consecutive pitfalls grouped under one heading. |
| `decision` | 63 | Signal-word chips or condition sentence, arrow, English outcome; consecutive equal outcomes grouped. |
| `check` | 120 | Numbered optional question block, four answers, correctness feedback, explanation, selected-option note, report action. |
| Pretest | Up to 1 per first opening | Same question/feedback objects inside a collapsed native disclosure; independent `-1` answer key. |
| End | 60 | Topic practice and next article/topic/index actions; marks article read. |

## Complete route and state inventory

### Frame, routing, and shared controls

| Element/state | Label/action | Semantics and behavior |
| --- | --- | --- |
| Empty, unknown, malformed root hash | Education | Defaults safely to `#egitim`; deep lesson/topic links remain addressable. |
| Root header | `Eğitim` / `Test`; profile avatar | Header title plus 44px named Profile button. Profile name enriches its accessible name. |
| Profile header | `Profil`; `Eğitim` or `Test` back | Returns to the actual prior root tab. |
| Topic header | Topic name; `Konular`; read/total | Topic overview uses focused chrome. |
| Article header | Category; `Dersler`; position | Ellipsizes long title visually; full article heading remains below. Scroll progress is separate. |
| Quiz header | Mode/topic; `Çık` or `Bitir`; question count | Exit before answering, finish answered prefix afterward. |
| Results header | `Sonuç` | Summary/review below; actions fixed at bottom. |
| Bottom navigation | `Eğitim`, `Test` | Links with `aria-current`, filled/outline icons; absent in focused reading and setup. Correctly not ARIA tabs. |
| Root version link | `Orijinal uygulamayı aç` | Real `original/index.html` destination. |
| Status region | Route, answer, operation announcements | One polite live region; preserve concise status rather than move focus merely to announce text. |
| Route transition | Crossfade | Reduced-motion aware; delayed callbacks must not overwrite a newer route. |
| Failure card | `Tekrar dene`, optional return | Preserves meaningful escape/retry; should retain existing progress. |
| Service worker | Silent online installation | Root/original scopes separate; visited article data usable offline; uncached content still needs network. |

### Education home, search, and recommendations

| State | Visible elements/actions | State/interaction contract |
| --- | --- | --- |
| Fresh | Intro title; first topic; `Kısa test çöz`; corpus facts | No mandatory onboarding and no invented progress. Short test draws five questions. |
| Unfinished article | `Kaldığın yer`; category, percentage, topic; `Devam et` | Goes directly to existing article and reading position. |
| Returning after absence | Five-question recall; resume/next lesson; optional content news | Offers choices without penalizing absence. |
| Tested but not read | Weakest relevant article/category or next unread | `Bu dersi aç` or `Bu kategoriden pratik yap`; all other topics stay open. |
| Everything covered | Corpus completion fact; `Karışık testle tekrar et`; coverage limit | Revision offered; no unsupported exam-readiness claim. |
| No next recommendation | Reading progress summary | Still retains full content index. |
| Corpus facts | 10 `konu`, 60 `ders`, 241 `soru` | Derived from loaded corpus; no daily target or streak in intro. |
| Backup reminder | Backup note; `Bu notu kapat` | Appears after useful history exists; dismissal persists. |
| Search empty | `Ders ara` | Named `Dersler arasında ara`; native search input. |
| Search matches | Count and matching lesson rows | Searches Turkish-folded topic, category, and summary; results directly open article. |
| Search no matches | `Eşleşen ders yok.` | Announced; input remains usable. |
| Clear search | Original tier/topic groups | No separate results page or navigation trap. |
| Topic row | Monogram, English topic, Turkish gloss, completion count/line | One large target; open topic overview. Completion also has a check glyph. |
| Lesson result row | Order, English distinction, summary, progress/check | One target; direct reading route. |
| Empty corpus | `Henüz ders eklenmedi.` | No misleading start action. |
| Failed manifest | `Dersler yüklenemedi`, retry | Recovery stays on useful route. |

### Topic overview and article

| Element/state | Labels/actions | Contract |
| --- | --- | --- |
| Overview article | `Genel bakış`; source title/body/examples/parts/notes | All source material retained; actual reading column, no flashcard paging. |
| Topic contents | `Dersler`; six numbered entries | Every lesson directly available. |
| Topic test row | `Bu konudan test çöz`; bank count | Actual launched session size should be explicit; currently defaults to 15. |
| Overview bottom | `Konulara dön`, `Derse başla` | Opens first incomplete article; after all read, primary becomes `Teste başla`. |
| Article start | English topic/title, Turkish summary | One h1; top-level article section headings h2. |
| Pretest closed | `Okumadan önce kendini yokla` | Native summary, 52px measured; article text visible without answering. |
| Pretest open | `Önce bir dene`, question, answers, rationale | Open state survives answer feedback; optional. |
| Inline answer unanswered | `Kontrol N`, four numbered options | Immediate commit; no implicit gating or quiz-history scoring. |
| Inline correct/incorrect | Mark, label, explanation, option note, report | Focus should remain meaningfully attached to the answered option. |
| Reading progress | Header line, stored read fraction | Resume partial reading; completed article restarts at top. |
| Completion | `Ders bitti` / `Konu bitti` | Scroll threshold or end action marks read; no score awarded. |
| Same-topic onward | `Sıradaki ders` | Next article. |
| Topic boundary | `Sıradaki konu: …` | Opens next overview where available. |
| Final article | `Derslere dön` | Returns to contents. |
| Any article end | `Bu konudan test çöz` | Uses shared topic launcher. |
| Unknown ID/missing intro | Index fallback | Hash corrected to actual destination. |
| Fetch error | Failure card and return/retry | Must not write progress for a prior article. |
| Slow fetch then another route | Latest route wins | Baseline bug confirmed; pending article must not replace Profile header/hide its nav. |

### Test setup, modes, and live question

| State/control | Labels/actions | Contract |
| --- | --- | --- |
| Mixed setup | `Karışık test`; question-count listbox; `Teste başla` | 5/10/20/all; remembered count; shared launch path. |
| Mistake book absent | No card before history | Avoids unusable empty promotion. |
| Mistake book empty | Explanatory sentence | Empty is not mastery. |
| Mistake book nonempty | Waiting count, count choice, `Yanlışları çalış` | Questions leave after correct answers on two separate days; bounded practice. |
| Weak category | Category and recent score | Live categories only; starts targeted practice. |
| Topic practice | Topic monogram/name, bank count, optional accuracy/newness | Default at most 15; clarify count before launch. |
| Coming soon | `Hazırlanıyor` / `Yakında` | Noninteractive, clearly distinguished. |
| Loading/empty/error | Loading message, unavailable selection, retry | No permanent spinner; missing request returns home. |
| Cloze | English passage/blank, four options | Blank does not reveal answer length; category cue when present. |
| Closest meaning | Instruction/source sentence, four options | Uses same answer controls and explanation contract. |
| Think-first | `Şıkları göster` | Options initially hidden; reveal announces and focuses first option. |
| Unanswered | `Bir seçenek seç` hint | Four answer buttons, numbered 1–4. |
| Answered correct | Correct option mark, `Doğru`, explanation/rule | Answer immutable; no decorative celebration needed. |
| Answered wrong | Wrong choice and correct option marks, `Yanlış`, correct answer, note/explanation/rule | Multiple communication channels; no color-only verdict. |
| Advance | `Sonraki soru` / `Sonuçları gör` | Fixed bottom action remains in same place through answer feedback. |
| Early exit | `Çık` before answer; `Bitir` afterward | Only answered prefix counts. |
| External leave | Pagehide partial save | Refresh/resume must reconcile this with final history; assigned resilience work. |
| Keyboard | 1–4; Enter; native button behavior | Modifier/editable-target guards; no duplicate native/global activation. |
| Reporting | `Bu soruda bir sorun var` | Share/copy prepared report; cancellation/error must leave a retry route. |

### Results and review

| State/control | Labels/actions | Contract |
| --- | --- | --- |
| Summary | Mode, real correct/total, percentage, verdict | Supported by the actual completed/partial session. |
| Topic breakdown | More than one topic only | Worst first; avoids repeating one aggregate. |
| Category breakdown | Category score, small-sample caution | Relevant category row opens its source article. |
| Mistake-book prompt | `Yanlış defteri` and count | Routes to Test; not repeated after a mistake-book run. |
| Full review | `İnceleme`, `Soru N`, prompt, chosen/correct answer, notes/explanation/rule | Every question retained; no hidden review content. Each question stem needs a unique ID. |
| New normal test | `Yeni test` | Reuses mode/selection with a new draw. |
| New mistake test | Rebuild from current book | Does not replay already-cleared IDs; empty book offers mixed practice entry. |
| Home action | `Ana sayfa` | Return to study contents. |
| Result reload | Existing result | Idempotent history recording. |
| Manifest failure | Score and review survive | Optional title/lesson lookup may degrade; core result retained. |
| Missing result | Home fallback | Avoids blank page. |

### Profile, preferences, backup, and dialogs

| Element/state | Labels/actions | Contract |
| --- | --- | --- |
| Identity | Name or `Profilin`; optional `İsmin` field | Max 40 characters; local only; editing must preserve focus/caret. |
| General state | Lessons, recent accuracy, streak, attempts, answers | All real data. Streak/daily-goal emphasis is inherited; academic refinement can reduce its visual weight without deleting preferences. |
| Weak rows | Category-to-lesson links; weak-topic scores | Use precise context and evidence limits. |
| Exam date | `Sınav tarihi` | Optional native date field; preserve current selection/focus after edit. |
| Daily goal | 5/10/20 choices | Actual preference, optional; pressed state and focus retained. |
| Data section | Local storage explanation and install instructions | Safari/Chrome manual install guidance; no invented native install support. |
| Export | `Yedek al` | Native file share where supported; otherwise actual JSON download. |
| Restore entry | `Yedekten geri yükle` | Opens native modal. |
| Restore input | `Dosya seç` / `Ya da yapıştır`; `Vazgeç`, `Devam` | File chooser or JSON text; empty/read/parse/foreign/newer-format errors visible. |
| Restore confirmation | Dated merge summary; `Geri yükle` | Changes must be announced/focused; storage failure must not be called success. |
| Restore success | Imported counts or no-new-data status | Summary should include preference-only changes where applicable. |
| Think-first | `Önce kendin düşün` switch | Preserves existing quiz preference; announced on/off state. |
| Theme | `Sistem`, `Açık`, `Koyu` listbox | Explicit preference persists; system follows OS; selected item visible. |
| Optional setup | `İlk açılışı tekrar gör` | Opens optional setup without making it a barrier to lessons. |
| Reset entry | `Geçmişi sıfırla` | Native confirmation; no accidental immediate deletion. |
| Reset modal | `Vazgeç`, `Sil` | Least-destructive initial focus, Escape/backdrop cancel, focus restoration; retains settings/name. |
| Coverage | `Sınavın hangi kısmı burada` | Accurately separates practisable and unsupported sections. |
| Content note | `İçerik hakkında` | Existing authorship/reporting information remains available. |

### Optional setup and offline/failure coverage

| State | Controls | Contract |
| --- | --- | --- |
| Welcome | `Başla`, `Zaten kullanıyorum, atla` | Explicit optional route; no first-visit interception. |
| Exam date | `Geri`, `Atla`, date, `Devam`, `Bilmiyorum` | Can continue without date. |
| Daily goal | 5/10/20, `Devam`, back/skip | Draft values saved only through completed flow. |
| Name/theme | Name, theme choices, `Hazırım` | Theme previews immediately; remaining draft commits on completion. |
| Setup skip | Education | Does not invent completed work; user has a direct escape. |
| Cached offline reload | Root and original articles | Previously fetched content works within its own service-worker scope. |
| Uncached offline topic | Retryable fetch failure | Keep navigation and existing stored progress. |
| Corrupt history | Recover valid records where supported | Do not crash a reading/practice screen. |
| Corrupt/blocked tab storage | Actionable failure or safe recovery | Baseline unguarded in quiz handoff; assigned to resilience pass. |
| Storage quota on restore/save | Clear failure status | Do not announce persistence that did not occur. |

## Shared visual and input inventory

Computed baseline examples below use **390px dark theme**, unless specified. Classes, not tag defaults, determine the painted size.

| Object | Measured/defined treatment | States and refinement boundary |
| --- | --- | --- |
| Canvas/surface/raised | `#141513 / #1d1f1b / #272a24`; light `#f5f3ed / #fffefa / #eae8df` | Already restrained; maintain small semantic palette. |
| Main/secondary text | Dark `#f0eee7 / #bdbeb4`; light `#242720 / #5d6255` | Existing token audit passes; remeasure actual pair changes. |
| Hairline/essential edge | Dark `#373b32 / #7b8172`; light `#d9dacf / #7b8270` | Hairline is decorative; essential control boundary uses stronger edge. |
| Primary | Dark pale neutral fill/dark ink; light dark fill/paper ink | High contrast already good; one primary action per decision area. |
| Orange/focus | Warm orange accent; focus dark `#f1bb93`, light `#9b4722` | Use sparingly; preserve visible keyboard focus. |
| Correct/incorrect | Separate colors, tints, word/glyph states | Preserve redundant state communication. |
| UI font | Locally served Inter | No remote runtime font dependency. |
| English learning text | Source Serif 4 | Useful distinction from Turkish/UI; retain readable measure. |
| Home title | 34px / 40.12px / 450; 30px under360; 38px wide | Confident but mobile vertical budget needs attention. |
| Topic heading | 26px / 34px / 500 | Existing source overview title. |
| Article heading | 32px /40px /450; 28px under360; 40px wide | Long contrast titles wrap cleanly; do not widen prose to fix wrapping. |
| Article Turkish body | 17px /1.9; 16px under360; 18px wide | Good sustained-reading rhythm. |
| English article example | 19px /1.75; 21px wide | Preserve hierarchy over supporting labels. |
| Question/option | Question21px/1.75; option19px/31.35px/400 | Option text wraps; 18px on narrowest screen. |
| Feedback | 16px /1.9; verdict15px/1.6 | Keep explanatory prose at body scale. |
| Section eyebrow | 11px /18.7px /550, tracked | Metadata only; not a substitute for body explanation. |
| Primary button | Height52px; label14px/22px/500; horizontal padding18px | Hover/focus/press/disabled. |
| Standard button | Height48px; same label scale | Quiet and secondary maintain target size. |
| Header icon button | 44×44; avatar34px | Named action, decorative icon. |
| Answer option | About61px tall, padding14px16px, gap14px | Unanswered, pressed, locked correct, locked wrong, other locked. |
| Input | 48px tall; 15px/26.25px; padding16px | Placeholder, entered, focus, disabled; avoid losing caret on rerender. |
| Count listbox | 48px trigger; named popup/active option | Arrows/Home/End/type-ahead/Enter/Escape; focus stays on trigger. |
| Small choice button | Minimum44px | Daily-goal/theming pressed state. |
| Native pretest summary | 52px tall;13px/24px;14px4px padding | Mouse, Space/Enter, open/closed; no added button inside summary. |
| Curriculum row | 342px wide; about123px with gloss;16px vertical padding | Large whole-row target; avoid decorative card proliferation. |
| Test topic row | 342×84;18px vertical padding | Distinguish bank inventory from actual session count. |
| Phone gutters | 24px;16px below360 | Already no horizontal overflow in matrix. |
| Reading width | Same narrow column across viewport sizes | Wide uses companion pane; articles/quizzes stay one column. |
| Gaps | Main stacks generally24–32px; options10px | Tune repeated rhythm rather than arbitrarily adding panels. |
| Bottom navigation | Fixed two-destination capsule;62px + inset | Never covers final reachable action; currently initial320px search lies underneath it until scroll. |
| Dialog | Native top-layer/backdrop, grouped form/buttons | Escape, focus containment, Cancel first; file input focus needs clipping care. |
| Motion | Approximately180–220ms standard ease; no answer shake/pop | Reduced motion suppresses transitions/animations/press displacement. |

## Findings: preserve versus fix

### Already good

- Readable article format and original material; clear English/Turkish type distinction.
- Narrow prose measure, consistent corpus structure, topic overviews, direct search, free navigation.
- Real native disclosures/dialogs, semantic navigation links, large controls, correctly separate dark/light palettes.
- Collapsed optional pretest; full feedback retained until advance; fixed quiz action position.
- No horizontal document overflow across the measured eight viewport/theme combinations.
- No current full-view focus perimeter; that older screenshot issue is resolved.
- No need to replace the IA, rewrite lessons, add a card for each block, or expand gamification.

### Prioritized real defects and focused refinements

| ID | Priority | Evidence at audit baseline | Focused correction / owner |
| --- | --- | --- | --- |
| Q1 | P1 | Quiz refresh rerolls/loss of current order and answers; pagehide partial and final history can overlap. Source-confirmed. | Persist active session; stable attempt identity and idempotent history. Assigned dedicated resilience agent. |
| Q2 | P1 | SessionStorage JSON/read/write unguarded; missing/corrupt state can strand pages. | Validate and expose useful recovery; same agent. |
| N1 | P1 | Slow lesson response after Profile navigation changes its header to article title and hides bottom nav. Browser reproduced. | Monotonic education navigation token; ignore obsolete success/error/scroll work. |
| K1 | P2 | Name field Tab/change rerender leaves BODY focused. Browser reproduced; date/goal share pattern. | Preserve focused control and text selection through Profile rebuild. |
| K2 | P2 | Keyboard answer replaces inline-check subtree; active element becomes BODY. Browser reproduced. | Restore the selected, inspectable answer target after replacement. |
| K3 | P2 | Quiz answer focuses Next; advancing leaves no prompt target. Browser/source confirmed. | Deliberate focus after advance, concise answer live announcement; coordinate with resilience work. |
| R1 | P2 | Report control permanently disabled after cancellation/failure; cancellation can look like success. Source-confirmed. | Restore retryability and distinguish cancel/failure; avoid external action during tests. |
| R2 | P2 | Review prompts reuse default `question-stem` ID. Source-confirmed. | Unique stable suffix per reviewed question. |
| C1 | P2 | Topic rows say24/25 questions but launched session defaults15. Source-confirmed. | Label actual session count and bank size separately. |
| B1 | P1 | Backup write failures swallowed despite success summary. Source-confirmed. | Real write result and failure status; backup owner. |
| B2 | P2 | Daily goal exports but is not imported; preference-only restore summary misleading. Source-confirmed. | Preserve compatibility while accurately restoring/reporting preferences. |
| B3 | P2 | Restore confirmation description changes without a clear focus/announcement. | Announce review state and preserve modal focus; backup owner. |
| V1 | P2 | At320×740 search y694, nav begins≈666, first topic y794. At390 searchy618 and first topicy718. | Trim mobile intro's accumulated vertical gaps without rewriting its text or changing navigation. |
| V2 | P3 | 10–11px metadata is frequent and profile contains inherited daily/streak emphasis. | Keep small text supplementary; reduce visual competition with learning/progress information. |

Implementation status belongs in the final validation record. Items above describe the measured starting point; later passes should mark specific fixes and regression evidence rather than silently delete the findings.

## Third-pass implementation and regression record

The baseline findings above remain as evidence of what was measured. The following changes were completed on 3 October 2026 without altering the 60 articles or 241 question records:

| Finding | Resolution | Verification |
| --- | --- | --- |
| Q1–Q2 | Active quiz snapshots retain shuffled order, current question, selected answers, feedback and revealed choices. Validated storage and stable attempt identities prevent malformed-state failures and overlapping partial/final history. Explicit new launches clear the old snapshot. | Dedicated `tests/quiz-resume.test.js` and `tests/quiz_resume_browser.py`; resilience owner reported 109 unit tests and 7 browser regressions passing. |
| N1 | Education navigation epochs invalidate obsolete manifest/topic/lesson responses, error fallbacks and pending reading-progress frames; deferred view transitions also check the current route generation. | Delayed lesson and topic responses followed by Profile navigation retain Profile title, visible nav and current screen. |
| K1 | Profile rebuilds preserve the current field/control, native Tab destination, text selection/caret/direction, in-progress field value and scroll position. Outdated rebuilds are discarded. | Name-to-date Tab, text selection, goal selection and generated theme listbox focus regressions pass. |
| K2 | Inline checks restore focus to the answered option after replacing the subtree while retaining reading position and the optional pretest disclosure. | Keyboard Enter remains on the inspectable answered option; subsequent Tab continues within the lesson. |
| R1 | Report sharing distinguishes cancellation from success. Cancellation and clipboard failure retain a retry action; cancellation never silently writes to clipboard. | Mocked share cancel → failed fallback → successful clipboard retry passes without external communication. |
| R2 | Results review prompts receive distinct `question-stem-review-N` IDs. | A completed five-question review has five unique prompt IDs. |
| C1 | Topic launch rows explicitly separate the actual session count from the full question pool: `Test: 15 soru · Havuz: 25`. | Tenses launch produces exactly 15 questions; labels retain the pool count. |
| B1–B2 | Coordinated backup work reports verified writes, preserves reviewed data for retry, restores daily-goal preferences and summarizes preference-only changes. Profile reports canceled sharing neutrally. | Backup owner owns storage regressions; focused browser test verifies `Paylaşım iptal edildi.` instead of a false saved/shared claim. |
| V1 | The first-visit summary and search helper use the requested shorter interface copy; source lesson prose remains unchanged. | Visual recheck accompanies the current spacing/type changes. |

Focused UX validation: `python3 tests/ux_refinements.py` passed **7 tests**. All six modified UI JavaScript modules passed syntax checks. These tests complement the broad editorial suite and do not replace content validation, accessibility checks or visual inspection.

Cross-day resume follow-up: answer timestamps now drive local-day counts, activity dates, current item outcomes and mistake-book graduation. Older questions retain the attempt-date fallback. Recent topic/profile accuracy still counts whole attempts, ordered by the latest answer in each session. `tests/answer-times.test.js` adds six scenarios; all passed both in the environment timezone and `TZ=Europe/Istanbul`, alongside 78 existing selected storage/session tests. The public history order and backup identity are unchanged.

Latest visual recheck: `/tmp/english-prep-refinement-visual/` contains fresh Home, Test, Profile, article, Profile settings and answered-pretest screenshots at 320, 390 and 1440px in dark and explicitly selected light modes. The new default is dark, so light captures set `englishPrep.theme=light` rather than relying on the emulated OS preference. No horizontal overflow appeared. Profile date/goal reflow and stat-card labels are readable; article and feedback wrapping remain comfortable. The 390px first view now includes the first topic, with search moved from approximately y618 to y550. At 320px only, the search field's final four pixels overlap the fixed navigation at initial paint; an optional eight-pixel spacing reduction would clear that border without changing type sizes. This is a density recommendation, not a blocked control: scrolling and focus keep it reachable.
