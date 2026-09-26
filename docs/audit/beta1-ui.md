# Beta1 UI audit — is this a finished app to a stranger?

Design-audit arm, 2026-09-09, against `test` at v0.44 (852300b). The
question is the owner's: he likes the interface, does not trust that it
is the best one, and wants every screen judged from scratch as if by
someone who has never met him. Colour and typographic hierarchy are
being measured by two sibling arms and are not re-argued here; where a
colour or a size is mentioned it is because a layout or a state depends
on it.

**Method.** The app was served from `npm run serve` and driven with
Playwright (`loadChromium()` copied from `tools/verify-ui.mjs`;
`/opt/node22/lib/node_modules/playwright`). Every reachable screen was
captured in both themes at 320×568, 390×844 and 1280×800, plus 568×320
landscape, 390×2400 "tall" captures of the long screens, and 1280×560 /
1024×768 / 768×1024 for the split's stand-down cases. Learner states
were seeded into `localStorage` before load (fresh, mid-progress,
returning after 21 days, everything done, history with an empty mistake
book, think-first on, a 40-character name); error states were produced
by aborting requests, blocking `localStorage`, and taking the context
offline after the service worker had installed. 338 screenshots, in
`scratchpad/audit/`, named `<screen>-<state>--<width>-<theme>.png`; the
files cited below are those names. Every one was looked at. Nothing in
`data/` or `js/` was changed; the harness is `scratchpad/shoot.mjs`.

**The verdict, in one paragraph.** The bones are finished. The quiz
screen, the feedback block, the lesson reader, the results split, the
two dialogs, the redirect cases and the offline shell all behave like a
product and would survive a stranger. What would not survive is the
*frame around* them: the app tells the stranger on its first screen that
it is unfinished, then tells them again in Profil with a roadmap and
reviewer statistics; the one screen that ends a topic offers two buttons
that differ by one syllable; one card ends in a sentence fragment; a tap
on a topic row can silently do nothing; and the same text is printed
twice on the results screen. None of these is a design problem. They are
the residue of an app built in public by its own user, and the beta1 job
is to take that residue off. **Class A totals ~12 hours. Class B ~9.
Class C ~2.** The ranked list is §8; the argument for each item is in
§1–§7.

---

## 0 · The ten findings that decide beta1

Ranked by how fast a stranger would form the judgement "not finished".

1. **The app says it is unfinished, twice.** First-run card: *"Uygulama
   hâlâ yazılıyor. Neyin bitip neyin sırada olduğunu Profil'de
   görebilirsin."* — the last line of the first thing anyone reads
   (`egitim-fresh--390-light.png`). Profil: a section headed *"Neler var,
   neler geliyor"* with Bitti / Planlandı chips, a roadmap note that
   repeats *"Uygulama hâlâ yazılıyor"*, and row details like *"en eski
   üçünde 73 sorunun 73'ünde denetçi anahtarla aynı cevabı verdi"*
   (`profil-mid-3--390-light.png`, `profil-fresh-bottom--390-light.png`).
   §7 has the recommendation per string. **A, 1.5h.**
2. **The all-done card ends in a fragment.** Its last line is
   `okuma (21 puan) ve paragraf tamamlama (9 puan)` — lowercase, no verb,
   because `renderAllDoneCard` is handed `state.uncovered`, which is
   `sectionListPhrase(...)`, a list phrase and not a sentence
   (`egitim-alldone--390-light.png`, `js/education.js:452–484`). **A, 0.5h.**
3. **The topic screen's bar: "Derslere dön" / "Derslere geç".** Same
   noun, one syllable apart, and the retreat wraps to two lines at 320
   beside a one-line advance (`intro-tenses--320-light.png`). When every
   lesson is done the advance becomes "Bu konudan test çöz", and the
   wrapped "Derslere / dön" sits beside it (`x-intro-alldone--320x568-dark.png`).
   **A, 1h.**
4. **A topic row can do nothing.** `openTopicIntro` falls back to the
   index on a failed topic fetch and leaves the hash at `#egitim/konu/<id>`.
   From the learner's side: tap Modals, nothing changes
   (`edge-topicfail-intro--390-light.png`,
   `edge-offline-intro-uncached--390-light.png`, and `_log.txt`: the URL
   stays on the intro route). The lesson route has a proper failure card
   for the same event (`edge-topicfail-lesson--390-light.png`); the intro
   route needs the same one. **A, 1.5h.**
5. **The results screen prints its hedge twice.** *"Bu testte her
   başlıktan bir-iki soru çıktı; bu bir sıralama, bir sonuç değil."*
   appears under *Konuya göre* and again under *Kategoriye göre*
   (`results-perfect--390-light.png`). **A, 0.5h.**
6. **Secondary lines are clipped where they are the only explanation.**
   §7.1's one-line rule was written for *hints*. On the Eğitim index the
   secondary line is the topic's gloss — the one sentence in the app
   that says what "Quantifiers & Determiners" is — and at 320 and 390
   every gloss is cut mid-word (`egitim-fresh--390-light.png`: *"Olayın
   ne zaman olduğundan çok nasıl görül…"*). The same rule clips the
   description of the one setting the app has (*"Testte şıklar, sen
   hazır olduğunu söyleyene …"*, `profil-mid-2--390-light.png`) and every
   roadmap detail. **A, 2h.**
7. **The "Tamamlandı" chip breaks the lesson row at 320.** With the chip
   in the trail, a title wraps to four lines and the summary to three
   characters (`x-intro-alldone--320x568-light.png`: *"Past Simple vs /
   Past / Continuous vs / Past Perfect"*, *"Hangisi önce bi…"*). The
   chip also shares the trail with a chevron, which §7.1 does not
   allow two of. **A, 1h.**
8. **Quiet buttons read as captions.** *"Ya da kısa bir testle başla"*,
   *"Kaldığın yerden devam et"*, *"Sıradaki derse geç"* and *"Bu soruda bir
   sorun var"* are centred or left-aligned bold text with no affordance
   of any kind (`egitim-fresh--390-light.png`, `egitim-away--390-light.png`,
   `quiz-wrong-bottom--390-light.png`). On the first-run card the
   stranger's second choice is invisible as a choice. **A, 1h.**
9. **The Test tab opens on two identical cards.** *Yanlış defteri* and
   *Karışık test* are the same shape — title, paragraph, "Soru sayısı"
   listbox, full-width button — stacked, so the tab's fold is two
   forms and the ten topics start a screen and a half down
   (`test-mid--390-light.png`, `tall-test-mid--390x2400-light.png`). And
   once the book empties it stays as a card with no action, for ever
   (`x-test-after-clear--390x844-light.png`). **A, 2h.**
10. **Profil is six screens, half of them the app talking about itself.**
    Ten sections at 390 (`tall-profil-mid--390x2400-light.png` runs off
    the bottom). The learner's own material ends at *Ayarlar*; after it
    come *Sınavın hangi kısmı burada* (three paragraphs), the roadmap,
    and *İçerik hakkında* (two). The honesty is the product's; the
    length is not. **A, 2h** (overlaps 1).

Everything else is §1–§7.

---

## 1 · Screen by screen, state by state

### 1.1 Eğitim index

**First run** (`egitim-fresh--{320,390,1280}-{light,dark}.png`). The card
says what the app is in one sentence, offers one filled button, one
quiet alternative, and the privacy fact. That is the right shape and the
copy is good. Three things read as beta: the last line (§0.1); the
heading — *"English Prep"* in the card, 60px under *"English Prep"* in
the header, so the first screen names the app twice and the card's
heading says nothing the header did not; and the quiet button (§0.8).
At 320 the card fills the fold exactly and the search field is the
first thing below it, which is fine.

**Mid-progress** (`egitim-mid--*`). Resume card with category, topic,
%, bar, "Devam et". Correct and calm. Below it the backup nudge, then
the search field, then the grouped topic rows with `n/6` and a chevron.
The nudge is the only dismissible element in the app and the only
`.note`; it is a sentence that names Profil but does not go there — the
sentence should be the link.

**Next step** (`egitim-nextstep--*`): "Sıradaki adım · Future Forms ·
Son testlerinde en çok bu sorularda zorlandın…" — this is the best card
on the index; the hedge is right and the meta line *"Tenses · 60 dersten
0 tanesi tamamlandı"* is a fact under the button rather than the
headline. Nothing to change.

**Returning** (`egitim-away--*`): "Önce 5 soruyla hatırla" filled,
"Kaldığın yerden devam et" quiet, then *"Tenses konusuna yeni sorular
eklendi."* Reads as a menu, as the code comment intends. The quiet
button problem (§0.8) is worst here: the resume action is the one a
returner most expects and it is the one that does not look tappable.

**All done** (`egitim-alldone--*`): §0.2. Otherwise fine — "Karışık
testle tekrar et" is the honest offer.

**Search** (`edge-search-hits--390-*`, `edge-search-none--390-*`). Works,
folds Turkish correctly, announces. Two small things: the hits are
lesson rows whose lead is the lesson's *order within its topic*, so a
cross-topic result list reads "2, 3, 1" (`edge-search-hits`); and
`type="search"` gives Chromium's native clear glyph inside a field the
design system otherwise draws itself. Empty result copy *"Eşleşen ders
yok."* is right.

**Wide** (`egitim-mid--1280-*`, `edge-egitim--1280x560-*`,
`edge-egitim--768x1024-*`). The split engages at 1280×800 with the
card and nudge in the pane and search + rows in the column; stands down
at 1280×560 and 768×1024 exactly as §7.3 says. The wide glosses are
*not* clipped at 1280 (there is room), which makes the phone clipping a
width problem rather than a content one, and confirms §0.6.

### 1.2 Topic overview

(`intro-tenses--*`, `intro-tenses-bottom--*`, `tall-intro-tenses--390x2400-*`.)
Focused mode: header and nav gone. The page opens on the label "Genel
bakış" and the question "Tense nedir?"; there is no back control at the
top and no topic name above the question — the only way out is the bar
at the bottom, and the only place the word "Tenses" appears is the
`<title>`. A learner who arrived from a lesson-end "Sıradaki konu"
button has no on-screen confirmation of where they are. The lesson
reader solves the same problem with a sticky strip ("← Dersler · %0");
the topic screen should carry the same strip with the topic name.

The bar (§0.3). Beyond the wording, the rule §7.3 sets — retreat takes
the pane's width, advance the column — puts a 1:2 bar under a
`split--main-first` screen at 1280 (`intro-tenses--1280-*`), where the
column is on the *left*, so the wide retreat sits under the prose and
the narrow advance under the lesson list. Readable, but the keylines
argument does not hold for this screen; §7.3 admits "there the bar is
left as it is".

The lesson list in the pane at 1280 is right; at 390 the six rows sit a
screen and a half down (`tall-intro-tenses`), which is the documented
trade and acceptable because the bar's advance goes to the next unread
lesson. "Bu konudan test çöz · 25 soru" as a row with a target icon is
the same launcher the Test tab has and is correctly last.

### 1.3 Lesson reader

(`lesson-start--*`, `lesson-mid--*`, `lesson-check-unanswered--*`,
`lesson-check-wrong--*`, `lesson-end--*`, `tall-lesson--390x3200-*`.)
Typography and flow are the other arm's. What is in this arm's remit:
the sticky strip ("← Dersler", "%45", progress rule) is the best piece
of chrome in the app; the pretest "Önce bir dene" reads as intended;
the inline check re-renders in place and keeps scroll; the end card
offers "Bu konudan test çöz" (secondary) and "Sıradaki ders" (filled)
and the topic-crossing variant names the next topic. All correct.

**"Atla" does not exist.** `CLAUDE.md` and `docs/design-system.md` §7.2
both say an unanswered check reads "Atla". The reader has been a
scrolling page since the block schema landed; checks are inline and the
bar is hidden (`actionBar.hide()` in `renderLesson`). The brief asked
for the "Atla" state; there is none to capture. The documents should
stop describing it (§9).

**`document.title` does not move.** Opening a lesson leaves the title at
"Eğitim — English Prep" (`extra.log`), while the topic overview sets
"Tenses — English Prep". `docs/audit/product.md` §1.6 reported this in
an earlier round; still open. §8.5 says it is a 2.4.2 requirement.

**No pane at any width** — correct, and the reason is written down.
1280 shows the 640px column centred with nothing either side
(`lesson-start--1280-*`), which §7.3 calls finished. Agreed.

**Landscape** (`edge-landscape-lesson--568x320-*`): the strip, heading
and first prose line fit in 320px of height; the page scrolls. Passes
1.3.4.

### 1.4 Test tab

(`test-fresh--*`, `test-bookempty--*`, `test-mid--*`, `test-mid-bottom--*`,
`test-mid-listbox-open--*`, `x-test-book1--*`, `x-test-after-clear--*`,
`tall-test-mid--390x2400-*`.)

**No history**: one card ("Karışık test"), then the grouped topic rows.
Good. **History, empty book**: a *second* card above it that says only
that nothing is waiting (`test-bookempty--390-*`) — a Surface with no
action, which §7.1 does not justify, and it stays for the life of the
install. **History, book populated**: two cards of the same shape
(§0.9); the book's button is filled and the mixed test's steps down,
which is the right §7.2 call. **Weak spots** below both: five rows with
a target icon, "Bu kategoriden pratik yap" repeated on every row (§7.1
would say the heading's hint already says it), and `n/m`.

The mixed-test card carries two paragraphs every time it is shown. The
second (*"Bir kısmı henüz okumadığın derslerden gelecek…"*) is
onboarding for the first low score and reads as a paragraph of
justification to everyone after that. It should show while completed
lessons are few and go when they are not; the code already knows the
count.

The listbox popup (`test-mid-listbox-open--390-*`) is the right width
for its trigger here; compare Profil's (§1.6). "Tümü (17)" as the last
option is good; "Tümü (1)" as the only sensible option in a one-item
book (`x-test-book1`) is a select with nothing to select.

Topic rows say *"25 soru · 6 ders"*: on a tab where the row starts a
test, "6 ders" is the other tab's fact. The accuracy `%47` in the trail
appears once there is history (`test-mid-bottom`), unspaced beside the
chevron; fine.

### 1.5 Quiz

(`quiz-unanswered--*`, `quiz-right--*`, `quiz-wrong--*`,
`quiz-wrong-bottom--*`, `quiz-last-unanswered--*`, `quiz-last-answered--*`,
`quiz-thinkfirst--*`, `quiz-thinkfirst-revealed--*`, `quiz-mistakes--*`,
`quiz-mistakes-q3-bitir--*`, `quiz-category--*`, `edge-landscape-quiz*`,
`edge-onequestion-quiz--*`.)

This screen is finished. "Çık" becomes "Bitir" once anything is
answered, with the icon changing with it; the strip's "1 / 3" and the
rule beneath it; category label; serif stem with the uniform blank;
four rows with their number keys; the bar hint "Bir seçenek seç"
instead of a disabled button; answering paints the verdict on the row
and the block below without moving the bar; the last question's bar
says "Sonuçları gör". Think-first shows "Şıkları göster" and the hint
"Cevabı düşün, sonra şıklara bak". At 568×320 the stem fits and the
options are one flick down (`edge-landscape-quiz--568x320-*`), which is
acceptable. 1280 centres the 640px page with nothing beside it, as §7.3
decided.

Two things a careful user notices. The screen never says which test
this is: a mistake-book run, a category practice and a topic test look
identical (`quiz-mistakes--390-*` vs `quiz-category--390-*`), and the
strip has room for a word. And *"Bu soruda bir sorun var"* is the one
control in the block and is styled as its least visible line (§0.8);
after a tap it becomes *"Kopyalanamadı. Soru numarası: tenses-t1"*
(`x-report-clicked--390x844-*`, the headless clipboard refused) — true,
and it does not say what to do with the number.

### 1.6 Results

(`results-mixed--*`, `results-mixed-mid--*`, `results-mixed-bottom--*`,
`results-perfect--*`, `results-mistakes-partial--*`,
`results-mistakes-partial-bottom--*`, `x-results-book-cleared--*`,
`edge-onequestion-results--*`.)

Score, rule, "%67 doğru", then the breakdowns worst-first, then the
mistake-book row, then the review with option notes. At 1280 the summary
becomes the pane and the review keeps the column, which is exactly the
case §7.3 was written for and it works (`results-mixed--1280-*`). Option
notes render as *"will leave: Kararın konuşma anında verildiğini…"*
under "Cevabın / Doğrusu" and before the explanation, so a wrong answer
carries four paragraphs; long, but a review is allowed to be.

Findings: the doubled hedge (§0.5); no mode or topic name anywhere on
the screen — "Sonuç" is the label for a Tenses test, a mixed test and
a mistake-book run alike; after a mistakes run that empties the book
the bar offers "Karışık test" under a *refresh* icon, which means
"again" and this is not again (`x-results-book-cleared`), and nothing
on the screen says the book is now empty — the one moment the app could
report a graduation, it does not. The one-question results
(`edge-onequestion-results`) correctly drops both breakdowns.

### 1.7 Profil

(`profil-fresh--*`, `profil-fresh-{2,3,bottom}--*`, `profil-mid--*`,
`profil-mid-{2,3,bottom}--*`, `profil-theme-open--*`,
`profil-reset-modal--*`, `profil-restore-{dialog,corrupt,foreign,step2,done}--*`,
`profil-after-theme-change--*`, `edge-longname-profil--*`,
`x-longname-profil--320x568-*`, `tall-profil-mid--390x2400-*`.)

**Fresh.** The first thing on the screen is a card asking for a name,
then four figures reading `0/60 · 0 · 0 · —` and *"Henüz başlamadın…"*.
A stranger opening Profil in their first minute is handed a form. The
name is optional and the card says so; it should not be the only
Surface on the screen and should not lead it — the figures and *Verilerin*
are what Profil is for, the name is a nicety.

**With data.** Stats are right (`%51 · Son 35 soruda` is the correct
label for a windowed average). The two weak lists are rows with a
rank lead, and every category row repeats "Dersi aç" as its secondary
line — the same redundancy as the Test tab's "Bu kategoriden pratik yap".
*Verilerin* is well written. Then:

- **Görünüm** is its own section with a paragraph and a listbox; the
  next section, **Ayarlar**, holds one switch row and the reset button.
  Two adjacent settings, two control shapes, two headings. Görünüm is a
  setting and belongs under Ayarlar as a row whose trail is the value.
- The theme listbox's popup is **page-wide under a 95px trigger**
  (`profil-theme-open--390-*`), because its container is a full-width
  `div`; on the Test tab the same primitive opens at the trigger's
  width. One primitive, two widths.
- **"Geçmişi sıfırla"** is a secondary button of identical weight and
  width to "Yedek al" and "Yedekten geri yükle" forty pixels above it.
  The one destructive action in the app is dressed as the two safe
  ones. It should be a quiet button, last.
- The switch row's description is clipped (§0.6).

**Dialogs.** Reset: two equal secondary buttons, focus on Vazgeç,
backdrop dims the page, works at 320 (`profil-reset-modal--320-*`). The
copy is the best paragraph of Turkish in the app. Restore: file button,
"Ya da yapıştır", textarea, then per-failure messages — *"Bu metin
okunamadı. Yedeğin tamamını kopyaladığından emin ol."* for garbage
(`profil-restore-corrupt`), *"Bu bir English Prep yedeği değil."* for
foreign JSON, then the dated step two *"9 Eylül 2026 tarihli yedek. Geri
yüklersen bu cihazdaki ilerlemenle birleştirilecek; hiçbir şey
silinmeyecek."* and, after commit, *"Yedekte bu cihazda olmayan bir şey
yoktu — hiçbir şey değişmedi."* in the section's status line. This is
finished work and it is the standard the rest of the app should be held
to.

**Theme change** applies instantly, repaints the whole shell including
the dialog backdrop and the listbox, and the head script means no flash
on reload — verified by every light-theme capture in this set having
been taken from a cold load.

**Wide** (`profil-mid--1280-*`): main-first split, the learner's blocks
in the column and the three about-the-app sections in the pane. The
right division. At 1280 the roadmap rows are still clipped.

**Long name** (`edge-longname-*`): the header shows "Ş", the input
scrolls natively; nothing breaks at 320.

### 1.8 `quiz.html` and `results.html` without a session

Both `replace()` to `index.html` (`edge-redirect-quiz--390-*`,
`edge-redirect-results--390-*`; `_log.txt` shows the final URLs). A
malformed lesson hash lands on `#egitim` (`edge-badhash`). Correct, and
invisible, which is the point.

---

## 2 · Consistency across screens

Listed, then ranked into §8.

1. **Number formatting.** Display and strip use spaces — `2 / 3`,
   `1 / 3` — every row uses none — `1/2`, `0/6`, `7/15`, `2/60`. Percent is
   `%67` everywhere, which is right. Pick one slash; the row form.
2. **Two words for one state.** Lesson rows say "Tamamlandı"; the roadmap
   says "Bitti". Fixing §0.1 removes the roadmap; the chip word then
   only has to be short enough for 320 (§0.7).
3. **The listbox opens at two widths** (§1.7).
4. **Two settings, two control shapes, two headings** (§1.7).
5. **Error surfaces come in three kinds.** A lesson that fails to load
   gets a card with "Tekrar dene" and "Derslere dön"
   (`edge-topicfail-lesson`); the manifest failing gets one `t-meta`
   line, *"Dersler yüklenemedi. Sayfayı yenile."* / *"Konular yüklenemedi.
   Sayfayı yenile."* (`edge-manifestfail-egitim`, `-test`); the quiz
   failing gets *"Test yüklenirken bir sorun oluştu. Tekrar dene."* with
   a single button that says **"Ana sayfa"** — the copy says retry, the
   control says leave (`edge-topicfail-quiz`). One card, one retry
   button, one copy pattern.
6. **Secondary lines that repeat the heading's hint** — "Dersi aç" ×5
   in Profil, "Bu kategoriden pratik yap" ×5 on Test — against the
   results breakdown, which deliberately dropped "Dersi aç" from every
   row for exactly this reason (`js/results.js`, comment at
   `renderBreakdown`). The results screen is right; the other two should
   follow it.
7. **Trail contents.** Eğitim rows: `n/6` + chevron; Test rows: `%47` +
   chevron; lesson rows: chip + chevron, or `%45` + chevron; weak rows:
   `1/3` + chevron; results category rows: `1/1` + chevron, topic rows
   `1/1` without. The fraction-or-percent split follows the code's
   reasoning (a row already carrying one fraction shows a percent) and
   holds; the chip + chevron pair is the one that breaks (§0.7).
8. **Two `.btn--quiet` alignments.** Centred on cards (welcome, re-entry),
   left-aligned in the feedback block. Same class, two intentions.
9. **Where the primary sits.** In cards: always last-but-meta. In the
   bar: always right. In the reset dialog: none, by design. Consistent.
10. **English is marked consistently.** Every category, option, stem,
    example and the brand carry `lang="en"` and the serif; Turkish
    stays sans. Verified by reading the DOM on the index, the intro, a
    lesson, the quiz and the results. No finding.
11. **Weight 700 is declared, 600 ships.** `.btn--primary` and
    `.feedback__verdict` ask for 700; `css/fonts.css` provides Source Sans
    3 at 400 and 600 only. Measured in the browser: the same string at
    600, 700 and 800 renders at identical width (358px at 40px), so
    Chromium resolves 700 to the 600 face without synthesis. The
    declaration is dead — and during `font-display: swap` the
    metric-matched fallback *does* render a real 700, so the primary
    label gets lighter as the webfont lands. Declare 600.
12. **Heading treatments.** Section labels are `t-label` (uppercase
    tracked) on every screen; card titles `t-title`; the intro's `h1` is
    `t-title` while the lesson's `h1` is `t-display` in the serif. The
    intro is prose, the lesson is a named thing; defensible, but the
    stranger sees two screens from the same tab with two sizes of h1.
    The typography arm's call; noted here for the inventory.

---

## 3 · Copy

**Register.** *Sen* throughout — no *siz* form anywhere in `js/` or
`index.html` (grepped for `-ınız/-iniz/-unuz/-ünüz`, `siz`). Verified.
Tone holds its two rules: nothing congratulates ("Dersleri bitirdin",
"Doğru", "1 test ve 2 ders eklendi." are facts), nothing nags (the nudge
dismisses for good, the re-entry card names no number of days).

**Capitalisation and punctuation.** Buttons are sentence case, labels
are uppercase by CSS, chips sentence case. Consistent. Turkish
apostrophes on English terms are right ("Profil'den", "Tenses ile",
"Simple'ı"). The dash is the em dash with spaces everywhere. The one
exception is the fragment in §0.2, which is a bug rather than a style.

**Strings that will date, or are the exam's rather than the learner's:**

- *"Session I'de 40 soru ve 60 puan var…"*, *"Session II'nin tamamı
  dinleme ve not alma; o da yok."* — the paper's own section names,
  in English, in a Turkish paragraph. The learner sitting the paper
  knows them; anyone else is handed jargon. Keep the fact, lose the
  labels: "Sınavın okuma ve paragraf tamamlama bölümleri burada yok;
  dinleme de yok."
- *"örnek sınavdaki 10 boşluktan 9 tanesinin dersi burada var, so / such
  yok."* — a coverage audit, addressed to the owner.
- *"sınavda da öyle olacak"* (Karışık test) — fine; it is the argument.
- Roadmap details: *"v1'den sonra, teker teker"*, *"73 sorunun 73'ünde"*,
  *"24 sorunun 24'ünü tutturdu"* — developer notes (§7).
- *"Uygulama hâlâ yazılıyor"* ×2 (§0.1).

**Developer text leaking:** none in the DOM beyond the roadmap. The
report text ("English Prep — soru bildirimi … Soru: tenses-t1") is
deliberately for the owner and is fine. Item ids surface once more in
*"Kopyalanamadı. Soru numarası: tenses-t1"*, which is the right fallback.

**Truncation at 320.** Glosses (§0.6), the setting description, roadmap
details, and the lesson-row summary under a chip (§0.7). Button labels
survive except "Derslere dön" in the intro bar (§0.3). The category
label on the quiz wraps to two lines for the long categories
(`quiz-unanswered--320-dark.png`) and that is correct — a label may wrap,
a row's secondary line may not.

**Copy the stranger reads best:** the reset dialog, the restore
messages, the re-entry card, the next-step card, the coverage hedge on
results. Copy the stranger reads worst: the Profil pane.

---

## 4 · Empty, loading, error and edge states

| State | What happens | Verdict |
|---|---|---|
| Offline, shell cached | Index paints from cache, manifest from the content cache (`edge-offline-egitim`); Test tab paints (`edge-offline-test`) | Handled |
| Offline, lesson in a topic never fetched | "Ders yüklenemedi · Bağlantını kontrol edip tekrar dene. İlerlemen olduğu gibi duruyor." + Tekrar dene + Derslere dön (`edge-offline-lesson-uncached`) | Handled, well |
| Offline, topic overview never fetched | Silent fallback to the index; hash left on the intro route | **Falls through** (§0.4) |
| Topic file 404/aborted, from a lesson | Same failure card as offline | Handled |
| Topic file fails, from a topic row | Silent (§0.4) | **Falls through** |
| Topic file fails, in the quiz | "Test yüklenirken bir sorun oluştu. Tekrar dene." + **Ana sayfa** (`edge-topicfail-quiz`) | Handled, mislabelled |
| Manifest fails | One line + "Sayfayı yenile", no control, on both tabs; Profil shows `—` for lessons and drops the lesson links with no message (`edge-manifestfail-*`) | Handled, thin |
| `localStorage` throws | Every screen works; fresh state everywhere; the theme falls back to system; nothing tells the learner their work will not be kept (`edge-nostorage-*`) | Handled silently — a one-line status in *Verilerin* would make it honest |
| Corrupt backup pasted | "Bu metin okunamadı…" (`profil-restore-corrupt`) | Handled |
| Foreign JSON pasted | "Bu bir English Prep yedeği değil." | Handled |
| Backup with nothing new | "Yedekte bu cihazda olmayan bir şey yoktu — hiçbir şey değişmedi." | Handled, exemplary |
| 0 history, mistake book | Card not rendered at all (`test-fresh`) | Handled |
| History, empty book | Permanent card with no action (`test-bookempty`) | Handled, wrong shape (§0.9) |
| 1-question topic | Row "1 soru · 6 ders"; quiz "1 / 1"; results drop both breakdowns (`edge-onequestion-*`) | Handled |
| 40-character name | Header initial, input scrolls (`edge-longname-*`) | Handled |
| 320 landscape (568×320) | Index, lesson and quiz all usable; options one flick down | Handled |
| Wide-and-short 1280×560 | Single column, as specified | Handled |
| Stale `quiz.html` / `results.html` | Redirect home | Handled |
| Bad hash | Index, hash rewritten | Handled |
| Loading | "Dersler yükleniyor…" / "Konular yükleniyor…" / "Sorular yükleniyor…" — one `t-meta` line each; never seen on localhost, [≈] on a slow connection it is a blank screen with one grey line and no shell chrome on quiz.html | Adequate; a skeleton is polish |

Two states could not be produced here and are marked as such:
the iOS Add to Home Screen flow, and the share sheet paths for the
backup and the report (Chromium headless has neither `navigator.share`
nor a writable clipboard; the fallbacks were what rendered).

---

## 5 · First run and install

**The first thirty seconds, on a phone, no explanation.** Header
"English Prep" with a person icon; a card: "English Prep" again, one
sentence saying what it is and that it needs no account, a filled
"Tenses ile başla", a small line under it, a centred sentence that is
secretly a button, and *"Uygulama hâlâ yazılıyor…"*. Below the fold at
320 (`egitim-fresh--320-*`): a search field, a line *"Her konu, önce ne
olduğunu anlatır; dersler içinde."*, and the topic rows with `0/6`.

Does it say what it is? Yes, in one sentence, and the sentence is good.
Is there a moment the learner does not know what to tap? Two. The
centred *"Ya da kısa bir testle başla"* is not seen as a tap target
(§0.8), so the stranger who would rather test than read does not find
out that they can. And the card's heading repeats the brand instead of
saying *what to do* — a stranger reads "English Prep" twice and a
paragraph before reaching a verb.

Does the first-run card earn its space? Yes: it is the only place the
app introduces itself, it replaces the zero-progress bar rather than
sitting above it, and it goes away. It earns it with one line fewer.

**Install.** The manifest is right (`standalone`, icons, maskable, no
orientation lock — the earlier audit's §4.5 finding is fixed), the
apple-touch-icon is present, the head script prevents the theme flash on
a cold start. What is missing is any mention that installing is
possible: Chrome on Android may show its own prompt; iOS never does, and
the only way this app gets a home-screen icon there is a learner who
already knows about Share → Add to Home Screen. [≈] Given the audience
this is most of the friends. One line, in *Verilerin* next to the
backup argument (which is the same argument — WebKit's seven-day
eviction is what the home-screen install prevents), costs nothing and
is where a learner who has just read "your data lives in this browser"
is already looking.

---

## 6 · Presentability blockers versus polish — the rule applied

The line between A and B was drawn as: **A if a person who does not
know the owner, opening the app once on a phone, would see it without
looking for it.** That is why clipped glosses (visible on every arrival)
are A and the listbox width (visible when the theme is changed) is B;
why the doubled hedge (every results screen) is A and the missing mode
name (noticed on comparison) is B. C is anything only this audit would
find.

---

## 7 · Things that should not exist at beta1

| Item | Where | Recommendation |
|---|---|---|
| *"Uygulama hâlâ yazılıyor. Neyin bitip neyin sırada olduğunu Profil'de görebilirsin."* | first-run card, `js/education.js:265` | **Remove.** The card without it is a finished card. |
| *"Neler var, neler geliyor"* section — roadmap rows, Bitti/Planlandı chips, reviewer statistics, "v1'den sonra" | Profil pane, `renderRoadmap`, `data/roadmap.json` | **Remove the section.** Keep the one counted line, *"Şu an 10 konu, 60 ders, 241 soru."*, as the last line of *İçerik hakkında* — it is derived, it cannot go stale, and it is the only sentence in the section a learner can use. `roadmap.json` then has no consumer; delete it or leave it for `docs/`. |
| *"Uygulama hâlâ yazılıyor. Eğitim ve Test kullanıma hazır…"* | `data/roadmap.json` `note` | Goes with the section. |
| *"Session I'de 40 soru ve 60 puan var…"* ×3 paragraphs, *"so / such yok"* | Profil, `renderCoverage` | **Rewrite to two sentences**, no section labels, no blank counts: what the app covers, what it does not, and that the missing parts need the sample papers. The derived list stays derived. |
| *"…bu denetimde ortaya çıktı ve düzeltiliyor."* | Profil, `renderAbout` | **Trim** to the disclosure and the report instruction. "Is being fixed" is a status; the disclosure is the value. Keep the AI-authorship sentence — it is the product's honesty and the report button depends on it. |
| *"Şimdilik az veriyle sıralandı."* | Test tab, Profil weak lists | **Keep.** A hedge, not an apology, and it is true. |
| *"Bir kısmı henüz okumadığın derslerden gelecek…"* | Karışık test card | **Keep, but conditional** on few lessons completed. |
| "Hazırlanıyor" / "Yakında" rows | `renderTopicRow`, `comingSoon` | Dead path — no topic is `comingSoon`. Harmless; leave. |
| *"Kopyalanamadı. Soru numarası: tenses-t1"* | report button fallback | **Keep.** An id is the right fallback; add "bize yaz" or nothing. |
| `english-prep-arayuz-yonleri.html` | repo root, git-ignored | Not served, not shipped; a design canvas from a prior session. Move to `docs/mockups/` or delete so the next clone does not ask what it is. |

---

## 8 · Ranked, with hours

Owner hours; a range where the fix touches copy that wants a second
read.

### A — a stranger would notice and judge it (~12h)

| # | Finding | Files | h |
|---|---|---|---|
| A1 | Two "unfinished" admissions: first-run card line; Profil roadmap section with chips and reviewer stats (§0.1, §7) | `js/education.js` `renderWelcome`; `js/profile.js` `renderRoadmap`, `render`; `data/roadmap.json` | 1.5 |
| A2 | All-done card ends in a lowercase fragment (§0.2) | `js/education.js` `renderAllDoneCard`, `loadLessons` (`state.uncovered`) | 0.5 |
| A3 | Intro bar "Derslere dön / Derslere geç"; retreat wraps at 320; "Bu konudan test çöz" beside it (§0.3). Suggest "Geri" / "Derse başla" (or "1. ders"), and "Teste başla" | `js/education.js` `openTopicIntro` | 1 |
| A4 | Topic row silently does nothing when the file fails; hash left on the intro route (§0.4). Render the lesson-route failure card, from a shared function | `js/education.js` `openTopicIntro`, `openLesson` | 1.5 |
| A5 | Results hedge printed once per breakdown (§0.5). Once, above both | `js/results.js` `renderBreakdown`, `init` | 0.5 |
| A6 | Glosses, the setting description and every row whose secondary line is its only explanation are clipped at 320/390 (§0.6). Either write glosses to ≤ 40 characters or add a `row__sub--wrap` for the two rows that are explanations, keeping the one-line rule for hints | `css/style.css` `.row__sub`; `data/manifest.json` glosses; `js/profile.js` `toggleRow` | 2 |
| A7 | "Tamamlandı" chip breaks the lesson row at 320 and doubles the trail (§0.7). A check glyph in `ink-ok`, or the chip alone without the chevron | `js/education.js` `renderLessonRow`, `renderTopicGroup` | 1 |
| A8 | Quiet buttons read as captions (§0.8). Give `.btn--quiet` an affordance — a leading icon (the set has `arrow-right`), or the accent colour the design system reserves for one job, which on these cards is exactly "the second action" | `css/style.css` `.btn--quiet`; call sites | 1 |
| A9 | Test tab: two identical cards; empty-book card is permanent and actionless (§0.9). Empty book → one `t-meta` line under the mixed-test card; populated book → keep the card, drop the mixed-test card to a row-like offer | `js/home.js` `renderMistakeBook`, `renderMixedTest` | 2 |
| A10 | Profil length and the about-the-app half (§0.10, §7). Rewrite coverage to two sentences, trim about, remove roadmap; reorder so the name field is not first | `js/profile.js` | 2 (overlaps A1) |

### B — a careful user would notice (~9h)

| # | Finding | Files | h |
|---|---|---|---|
| B1 | Slash spacing: `2 / 3` vs `1/2` (§2.1) | `js/results.js` `renderScore`; `js/quiz.js` `renderTopStrip` | 0.3 |
| B2 | Görünüm: own section + listbox; think-first: switch row under Ayarlar; listbox popup page-wide (§1.7). One *Ayarlar* section, both as rows; constrain the listbox host | `js/profile.js` `renderTheme`, `renderSettings` | 1 |
| B3 | "Geçmişi sıfırla" dressed as the backup buttons (§1.7). Quiet, last | `js/profile.js` `renderSettings` | 0.3 |
| B4 | Lesson reader never sets `document.title`; the intro does (§1.3) | `js/education.js` `openLesson` | 0.3 |
| B5 | Three error surfaces, one mislabelled ("Tekrar dene" copy, "Ana sayfa" button) (§2.5). One failure card with a retry, used by index, Test, quiz | `js/home.js`, `js/quiz.js` `showMessage`, `js/education.js` | 1 |
| B6 | Quiz and results never name the mode/topic (§1.5, §1.6). One word in the strip, one label above "Sonuç" | `js/quiz.js` `renderTopStrip`; `js/results.js` `renderScore` | 1 |
| B7 | After a mistakes run empties the book: refresh icon on "Karışık test", nothing says the book is empty (§1.6) | `js/results.js` `newTestAction`, `renderMistakeShortcut` | 0.5 |
| B8 | "Dersi aç" ×5 and "Bu kategoriden pratik yap" ×5 as secondary lines the heading already states (§2.6) | `js/profile.js` `renderWeakList`; `js/home.js` `renderWeakSpots` | 0.3 |
| B9 | Backup nudge names Profil but is not a link (§1.1) | `js/education.js` `renderBackupNudge` | 0.3 |
| B10 | Search hits lead with in-topic order numbers; native clear glyph in the search field (§1.1) | `js/education.js` `renderIndexFilter`, `renderLessonRow`; CSS `::-webkit-search-cancel-button` | 0.5 |
| B11 | First-run card heading repeats the brand (§5). "Başlamak için" or the one-sentence description as the title | `js/education.js` `renderWelcome` | 0.3 |
| B12 | No install hint anywhere; iOS never prompts (§5) [≈] | `js/profile.js` `renderData` | 0.5 |
| B13 | Storage unavailable is silent (§4) | `js/profile.js` `renderData` | 0.5 |
| B14 | Topic screen has no top strip: no name, no way back except the bar (§1.2) | `js/education.js` `renderIntro`, reuse `renderReaderTop` | 1 |
| B15 | Weight 700 declared, 600 shipped; weight shifts during swap (§2.11) | `css/style.css` `.btn--primary`, `.feedback__verdict` | 0.2 |
| B16 | Test rows carry "6 ders" (§1.4) | `js/home.js` `topicMeta` | 0.2 |
| B17 | Light theme is outside `npm run verify`; CHANGELOG v0.43 says so. Loop the sweep over both `data-theme` values | `tools/verify-ui.mjs` | 1 |

### C — polish (~2h)

| # | Finding | h |
|---|---|---|
| C1 | "Tümü (1)" as the only option in a one-item book: hide the listbox below two choices | 0.3 |
| C2 | Karışık test explanatory paragraph shown for the life of the install (§1.4) | 0.3 |
| C3 | "Kopyalanamadı…" could say where to send the number | 0.1 |
| C4 | Hash not rewritten on the intro fallback (part of A4) | — |
| C5 | Loading states are one grey line with no shell on `quiz.html`; a skeleton would hold the frame [≈] on slow 4G | 1 |
| C6 | Quiet-button alignment differs between cards and feedback (§2.8) | 0.2 |
| C7 | `english-prep-arayuz-yonleri.html` in the repo root (§7) | 0.1 |

---

## 9 · What the documents say that the app no longer does

Not UI, but a stranger to the *repository* trips on these, and two of
them were in this brief.

- **"Atla."** `CLAUDE.md` (Non-negotiables) and `docs/design-system.md`
  §7.2 both cite an unanswered check reading "Atla". The reader is a
  scrolling page; no check has a button. Reword both to what is true:
  checks are inline, unscored and never gate.
- **"A theme toggle. Out."** `docs/app1-final.md` §7 lists it under
  *decided against — do not reopen*; v0.43 shipped Sistem / Açık / Koyu.
  The plan should record the reversal and the reason (hierarchy range,
  per CHANGELOG), or the next session reads the plan and removes the
  control.
- **Dark-only scope.** `docs/design-system.md` opens with *"Scope. Dark
  only."* and §11.5 argues the case. Now false; the colour arm will
  presumably rewrite §1, but the scope line is a one-word fix.
- **`css/fonts.css` §3 "Wiring (not done here — css/style.css was out of
  scope)"** describes work that has since been done. [≈] Stale comment.

---

## 10 · What is finished, so nobody re-opens it

For the record, because an audit that lists only defects invites a
redesign of things that are right.

The fixed-height shell and the bar that never moves. The quiz screen
end to end, including Çık → Bitir and the early-finish semantics. The
feedback block's four channels. The lesson reader's sticky strip and
inline checks. The results split. Both dialogs and every restore
message. The redirect and bad-hash handling. The service worker's
shell-versus-content split, verified offline. The theme switch with no
flash. The re-entry and next-step cards. The `lang="en"` discipline.
The 320-first layout, which held at 320×568 on every screen captured,
with the two wrapping cases named above as the whole list.

The stranger's judgement will be made on the frame, not on these. The
frame is twelve hours.
