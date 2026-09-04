# Product and code audit

Audited 2026-09-04 against `a35a3af` ("Finishing a topic is now a thing
that happens"). Content is audited separately in `docs/audit/content.md`;
this arm stayed out of `data/` except where code and data disagree.

**Method.** Read the whole of `js/`, `tools/`, `tests/`, `index.html`,
`quiz.html`, `results.html`, the design system §8, the last ten changelog
entries and the three research arms named in the brief. Then drove the
real app in Chromium against a local server to reproduce every suspected
defect rather than infer it. Everything marked **reproduced** below was
observed in the running app, not read out of the source. `npm run check`
is clean (107/107). `npm run verify` is green at 1,158 checks. Every
defect in this document passes both.

---

## 0 · What can bite the owner this week

He starts tomorrow, daily, on a phone, on a real connection. These are
the ones he meets, ordered by how likely he is to meet them.

### 0.1 The back gesture out of a live test destroys every answer

`js/quiz.js:73-79`, `js/quiz.js:141-164`

**Reproduced.** Start a mixed test, answer three questions, swipe back
(or press the system Back button). Result: `index.html#test`, and
`englishPrep.history` has **zero attempts**. The three answers are gone,
`getItemStats` never sees them, the mistake book never learns about the
one he got wrong.

v0.19 fixed exactly this complaint — "Leaving a test no longer costs you
the test" — but it fixed it for the **in-app `Bitir` button only**.
`exitQuiz` records the answered prefix; the browser's own back navigation
does not, because nothing listens for it. On iOS the edge-swipe is the
back gesture and it is the most-used navigation gesture on the device.
The learner has no way to know that one exit is safe and the other is
not; they are the same act.

The same hole covers: closing the tab, the OS killing the tab for memory,
and the phone locking long enough for Safari to discard the page.

**Fix.** A `pagehide` listener on `quiz.html` that calls the same
scoring path `exitQuiz` uses and writes the attempt via `recordAttempt`,
guarded by `answeredCount() > 0` and by a flag so the normal
`finishQuiz` → `results.html` path does not double-record. `pagehide`
(not `beforeunload`) is the one that fires reliably on iOS.
**~1 hour**, and it is the single highest-value hour in this document.

### 0.2 A failed topic fetch in the reader is a dead end — and it marks the previous lesson complete

`js/education.js:1513-1520`, `js/education.js:1256-1284`

**Reproduced**, twice, two ways.

Open a lesson. Navigate to a lesson in another topic while the connection
drops (or the file 404s). `openLesson`'s catch block renders
*"Ders yüklenemedi. Bağlantını kontrol edip tekrar dene."* and then calls
`setReaderChrome(true)` — which **hides the header and the bottom nav**.
Measured on the resulting screen: **zero buttons, zero links, header
hidden, nav hidden, action bar hidden.** There is no control on the page.
The only ways out are the browser back gesture or killing the app. In a
`display: standalone` install there is no browser chrome to fall back on.

It is also worse than a dead end. `openLesson` returns from the catch
**before** clearing `state.reader`, so the previous lesson's reader state
is still live and the scroll listener is still attached. One scroll on
that short error screen makes `readFraction()` return 1, and
`handleReaderScroll` calls `markLessonDone(currentLesson().id)` — on the
**previous** lesson. Reproduced: `englishPrep.lessonProgress` went from
`{}` to `{"tenses-present-simple-vs-present-continuous":{"read":1,"done":true}}`
without the learner reading it.

Note the asymmetry, which is the tell that this path was never designed:
`openTopicIntro`'s catch (`js/education.js:869-873`) calls
`showLessonIndex()` and recovers cleanly with the nav intact. The same
failure on the lesson route strands the learner. Two error paths for one
failure, one of them correct.

**Fix.** Set `state.reader = null` before rendering the error, and give
the error screen the way out it lacks — either call `closeReader()` and
render the message on the index, matching `openTopicIntro`, or give the
action bar a *"Derslere dön"* and a *"Tekrar dene"*. **~1 hour.**

### 0.3 The problem-report has lost the question it is reporting

`js/report.js:48`, `js/report.js:19-22`

**Reproduced in the running app.** `buildReport` reads
`question.paragraph`, and no question object in the app has a `paragraph`
field. `normalizeQuestion` (`js/topics.js:79-95`) maps the authored
`paragraph`/`sentence` onto `prompt`, and every caller
(`js/feedback.js:294`) passes that normalized object. `Array.join`
renders `undefined` as empty, so the failure is silent. Real output:

```
English Prep — soru bildirimi

Soru: tenses-t1
Konu: Present Simple vs Present Continuous
Benim işaretlediğim: is going
Uygulamanın doğru dediği: goes



Sorun ne? (buraya yaz)

— 04.09.2026
```

Two blank lines where the paragraph should be. The whole design of this
feature — `js/report.js:1-13`, `js/profile.js:342-351` — is that six
friends sitting the real exam are the only pretest panel this project can
have, and that the report must carry "what somebody would need to find
the item again". The id is there, so it is findable; the *stem the
learner was looking at* is not, which is precisely the field that says
whether the item was later rewritten.

The unit test at `tests/content-checks.test.js:250-268` asserts
`/Turkey ____ several major earthquakes/` and passes — because it builds
its own fixture with a `paragraph` key that the app never produces. The
browser sweep asserts four things about the clipboard text
(`tools/verify-ui.mjs:577-580`) and none of them is the stem.

**Fix.** `question.prompt ?? question.paragraph` in `buildReport`, fix
the JSDoc, and add the stem to both the unit assertion and the sweep's
clipboard assertion. **~30 minutes.**

### 0.4 The app does not work offline at all

No service worker anywhere (`grep serviceWorker js/ *.html` → nothing).

**Reproduced.** Load the app, go offline, reload: navigation fails,
`net::ERR_INTERNET_DISCONNECTED`, blank page. Not a degraded app — no
app. Revising on a bus, in a metro, in a building with no signal is a
blank screen.

The intermediate case is better than I expected and worth recording: when
the HTML/CSS/JS are still in the HTTP cache but `data/` is unreachable,
the app loads and says the true thing — *"Dersler yüklenemedi. Sayfayı
yenile."* on Eğitim, *"Konular yüklenemedi. Sayfayı yenile."* on Test.
That is an honest failure, but it is still no lessons and no questions,
and there is no retry control on either screen (switching tabs does
retry, because `topics.js:40-42` drops the failed promise — but nothing
tells the learner that).

GitHub Pages sends `Cache-Control: max-age=600`, so the ten-minute-old
cache is all that stands between the owner and a blank app. See §6 for
the smallest honest fix.

### 0.5 A malformed hash bricks the app

`js/home.js:427`

**Reproduced.** `index.html#%` → `decodeURIComponent` throws
`URIError: URI malformed`, `parseRoute` throws, `applyRoute` throws,
`init()`'s returned promise rejects unhandled, and the app **never
renders**: the screen stays on *"Dersler yükleniyor…"* forever. Same on a
`hashchange` after load.

This app is distributed by pasting a URL into a group chat. A truncated
or re-encoded link is not exotic. One character and the recipient's first
impression of the app is a permanently loading screen with no error.

**Fix.** Wrap the decode in a try/catch that falls back to the raw hash,
and add a top-level `.catch` on `applyRoute` that renders an error and
routes to `#egitim`. **~15 minutes.**

### 0.6 Every scroll frame at the bottom of a lesson writes to localStorage

`js/education.js:1276-1284`

**Reproduced: 80 `localStorage.setItem` calls in 80 animation frames.**

`recordLessonRead` has a monotonic guard (`js/storage.js:632-634`) and
writes at most once per new high-water mark. `markLessonDone` has no
guard at all: while `read >= 0.98`, every rAF tick reads the whole
progress object, normalizes 48 entries, re-stringifies and writes it.
`localStorage.setItem` is synchronous and on iOS Safari can touch disk.
This is jank in the app's core activity — reading — at exactly the moment
the learner reaches the end of a lesson and the end-of-lesson card is
being read.

**Fix.** One line: skip the write when the stored entry is already
`done`. **~10 minutes.**

---

## 1 · Correctness, where neither the tests nor the sweep reach

Ranked. "Reachable" is my judgement of whether the owner meets it this
month.

| # | Finding | Reachable |
| --- | --- | --- |
| 1.1 | Back gesture out of a quiz loses the attempt (§0.1) | **daily** |
| 1.2 | Reader error screen is a dead end + false completion (§0.2) | **weekly** — any flaky connection |
| 1.3 | Malformed hash bricks the app (§0.5) | on a mangled shared link |
| 1.4 | Corrupt `sessionStorage` gives a dead loading screen | rare |
| 1.5 | A malformed attempt in history takes Profil down before the backup button | rare, but it destroys the escape hatch |
| 1.6 | `document.title` is never set inside a lesson | **daily**, silently |
| 1.7 | `setQuizRequest` throws when storage is blocked; the button does nothing | private browsing only |
| 1.8 | Two tabs: last-writer-wins on whole-object rewrites, no `storage` listener | rare |

### 1.4 Corrupt session state gives a dead loading screen

`js/session-state.js:16-19`, `js/session-state.js:28-31`; consumed at
`js/quiz.js:273` and `js/results.js:176`.

`getQuizRequest` and `getQuizResult` call `JSON.parse` with no guard,
outside the callers' `try`. **Reproduced:** a corrupt
`englishPrep.quizRequest` leaves `quiz.html` on *"Sorular yükleniyor…"*
with the action bar hidden — no home link, no way out. Same on
`results.html` for a corrupt `quizResult`.

This is a straight inconsistency with `js/storage.js:44-55`, whose whole
design is that "practising without saved progress is an acceptable
degradation; crashing is not". `session-state.js` is the one storage
module that does not follow its own house rule.

**Fix.** The same `readJson` shape: try/catch returning `null`. And give
`showMessage` a home link on the failure path it already has one for.
**~20 minutes.**

### 1.5 One malformed attempt takes Profil down — before the backup button

`js/storage.js:442-445`

```js
for (const attempt of attempts) {
  totalQuestions += attempt.questions.length;          // ← unguarded
  totalCorrect += attempt.questions.filter((q) => q.correct).length;
}
```

Eight lines further down, the same function writes
`attempts[i].questions ?? []` — guarded. The two loops in one function
disagree about whether an attempt is trustworthy.

**Reproduced:** an attempt with no `questions` array →
`TypeError: Cannot read properties of undefined (reading 'length')`, and
Profil renders **only the name field**. Everything below it —
stats, weak lists, **"Yedek al"**, **"Yedekten geri yükle"**, settings,
the coverage paragraph, the roadmap — never renders. A `null` attempt
does the same.

The ordering is the bad part. The one screen that could get the learner's
data *out* is the screen a corrupt store takes down. And `mergeHistory`
(`js/backup.js:34-48`) accepts any object with a string `date`, so a
restore is a live route to this state.

Note also `getHistory()` returns `loadHistory().attempts` with no
per-element validation; `sumBreakdowns` (`js/storage.js:98-110`) throws
on a `null` element for the same reason.

**Fix.** Guard both lines, and filter non-object attempts once in
`loadHistory`'s validator. **~20 minutes.**

### 1.6 A lesson never sets `document.title`

`js/education.js:1521-1560` (no `document.title`), against
`js/education.js:896` where the topic intro does, and `js/home.js:443-445`
where the comment says exactly why it matters:

> 2.4.2: the title has to say which screen this is, or the back button
> walks through a history of identically-named entries.

**Reproduced:** inside `tenses-present-simple-vs-present-continuous` the
title is *"Eğitim — English Prep"*. On the topic intro it is
*"Tenses — English Prep"*. So the back stack is exactly the run of
identical entries the comment forbids, and the failure is in the deepest,
most-linked route. The sweep checks the title on the tab switch
(`tools/verify-ui.mjs:1479`) and on the intro (`:1424`) and never inside a
lesson.

**Fix.** One line in `openLesson`. **~10 minutes.**

### 1.7 `setQuizRequest` is the one unguarded write in the app

`js/session-state.js:13`

Every write in `storage.js` is wrapped. This one is not, so with storage
blocked (iOS "Prevent Cross-Site Tracking" in some configurations,
enterprise policy, some private modes) `go()` throws inside an async
launcher and lands in `.catch(console.error)` at
`js/home.js:165`/`:239`/`js/education.js:250` — **the button silently
does nothing**. No message, no fallback, no clue.

**Fix.** Guard the write and have `go()` report failure so the caller can
say something. **~20 minutes.**

### 1.8 Two tabs

`sessionStorage` is per-tab, so two concurrent quizzes do not collide —
verified. `localStorage` is shared, and there is no `storage` event
listener anywhere. `recordAttempt`, `markTopicSeen`, `recordLessonRead`
and `markLessonDone` are all read-modify-write of a whole object, so a
write from tab B between tab A's read and write is lost. I reproduced the
loss, but only by forcing the interleaving; in real use the window is a
single synchronous tick and the realistic symptom is milder: **tab A's
Test tab keeps showing pre-test numbers after tab B finishes a test**,
until it is re-rendered.

Not worth fixing before the exam. Worth knowing it is there.

### What I checked and found correct

- Unknown lesson id (`#egitim/no-such-lesson`) → `replaceState` to
  `#egitim`, index renders, no dead history entry. ✓
- Unknown topic id (`#egitim/konu/does-not-exist`) → same. ✓
- `#egitim/`, `#egitim/konu/`, `#EGITIM`, `#profil/junk` → all land
  somewhere sane. ✓
- Back button: `#egitim` → `#egitim/konu/tenses` → `#egitim/<lesson>` →
  back → back walks correctly, and backing out of the reader restores the
  header, the nav and the `is-reading` body class. ✓
- Back from Profil → Test. ✓
- Back from a lesson opened by a results-screen link → returns to
  `results.html`. ✓
- Results → category row → lesson link: 8 rows, correct hrefs, opens the
  reader. ✓ (This is the app's best feature and nothing in the sweep
  clicks it — see §5.)
- Reload of `results.html` does not double-record (`result.recorded`,
  `js/results.js:203-233`). ✓
- `localStorage` unavailable: every read and write in `storage.js`
  degrades. ✓ (covered by `tests/storage.test.js:469`)
- 1.4.12 text spacing at 320 on the quiz: no overflow, nothing clipped. ✓
- Landscape 844×390 on the quiz: options scroll clear of the bar. ✓

---

## 2 · Half-built and inconsistent

### 2.1 `clearQuizState` is dead, and its absence is a bug

`js/session-state.js:33-36` — exported, never imported anywhere.

The consequence: **`englishPrep.quizRequest` is never cleared.**
"Yeni test" on the results screen is `href="quiz.html"`
(`js/results.js:268`), which re-runs the request still sitting in
`sessionStorage`. For mixed and topic tests that is the intended
behaviour and the comment says so. For the **mistake book** it is not:
the request carries a frozen `ids` list, so **reproduced** — finish a
one-item mistake-book session, tap "Yeni test", and you get a `1 / 1`
test of the identical question you just answered, labelled as a new one.
As the book grows this becomes "re-drill the exact set you just drilled,
including the ones that graduated in the process".

**Fix.** Either clear the request after a mistakes-mode session, or
recompute the id set on `quiz.html` when `mode === "mistakes"`. **~30
minutes.**

### 2.2 The mistake book's rule is written down twice

`js/storage.js:162` (`MISTAKE_BOOK_GRADUATION = 2`, exported and used
nowhere but its own file) against `js/home.js:106-107`, which tells the
learner *"ayrı iki günde"* as a hard-coded Turkish word. Change the
constant and the app lies to the learner. The constant is exported for a
consumer that does not exist.

### 2.3 Three copies of the "started reading" threshold

`js/education.js:137` (`> 0.02`), `:527` (`> 0.02`), `:1532` (`<= 0.02`).
One file, three literals, one meaning, and the third is the inverse — so
a change that makes a lesson "in progress" on the index without making it
"read" in `openLesson` re-shows the pretest on a lesson the learner has
started. Should be one named constant beside `READ_THRESHOLD`
(`js/education.js:1248`), which is the same idea done correctly.

### 2.4 A topic row exists twice, and the two say different things

`js/home.js:256-302` (`renderTopicRow`, Test tab) and
`js/education.js:688-729` (`renderTopicIndex`, Eğitim index) are two
independent implementations of "a row for a topic".

They disagree about what a topic row carries:

| | Eğitim index | Test tab |
| --- | --- | --- |
| Secondary line | the manifest gloss | `24 soru · 6 ders` |
| Trailing | `3/6` lessons, or a "Tamamlandı" chip | `%73` accuracy |
| **"Yeni" badge** | **never** | yes |
| Grouped by tier | **no** | yes |

The badge is the one that matters. `getSeenVersion` marks a topic stale
when its `contentVersion` moves; the Test tab shows a "Yeni" chip for it,
and Eğitim never does. A learner who lives in Eğitim — which is the
default view, and the one the app is designed around — **never learns
that a topic gained content**, except through `newContentNote`
(`js/education.js:456-482`), which only renders inside the re-entry card,
which only appears after ten days away. New lessons in a topic he has
already read are invisible to him unless he stops using the app for a
fortnight.

The tier grouping is the second one. Eğitim's list is flat "Konular";
Test's is grouped under Temeller / Temel Dilbilgisi / Bileşik Yapılar.
Same eight topics, two orderings, one screen apart.

### 2.5 Comments that describe behaviour the code no longer has

- `js/topics.js:172-176`, `js/topics.js:215-216`, `js/education.js:81-82`
  — all four claim the manifest is **1.7 KB**. It is **12,344 bytes**
  today and will be ~20 KB at fourteen topics. The *decision* is still
  right (12 KB against 500 KB); the number is stale by 7×, and it is the
  number three separate comments use to justify the architecture.
- `CLAUDE.md:9` describes Eğitim as *"article-based lessons in a paged
  reader"*. `CLAUDE.md:184-197`, in the same file, says a lesson is "a
  page of typed blocks, **not an article and not screens**" and records
  that the article model and the paged model were both replaced. The
  binding context file contradicts itself in its own summary.
- `CLAUDE.md:254` — *"~430 checks"*. It is **1,158**.
- `CLAUDE.md:77-78` lists the routes and omits `#egitim/konu/<id>`,
  which is now the index's primary destination.
- `CLAUDE.md`'s `js/` inventory omits `backup.js`, `backup-ui.js`,
  `prompt.js` and `session-state.js` — including both halves of the
  app's only data-safety feature. Its `tools/` inventory omits
  `audit-ui.mjs`, `blind-corpus.mjs`, `check-draft.mjs`,
  `extract-wordlist.mjs`, `make-calibration.mjs` and `ship-topic.mjs`.
- `js/storage.js:472-475` and `js/storage.js:416-418` are orphaned JSDoc
  blocks: a `@param topicId / @returns the content version` comment
  sitting above `getLastActivity`, and a `@returns {{testsCompleted…}}`
  block sitting above `const ACCURACY_WINDOW`. Same in
  `js/topics.js:153-165`, where `loadLessonsForTopics`' doc sits above
  `lessonIndex`. Editing artefacts in the most-edited files, exactly as
  the brief predicted.
- `js/education.js:2-8` still describes the index as "every lesson across
  every topic". It has been eight topic rows since v0.22.

### 2.6 Exports with no consumer

`clearQuizState` (dead, §2.1), `MISTAKE_BOOK_GRADUATION` (§2.2),
`getSettings` (`js/storage.js:668`, used only inside its own file).
Nothing else in `js/` is unreachable — I checked every export against
`js/`, `tools/`, `tests/` and `docs/components.html`.

### 2.7 Three implementations of the progress bar

`js/education.js:114-120` (parameterised), `js/quiz.js:101-107` (reads
module state), `js/results.js:42-46` (inline). Identical markup, three
places to change. `shell.js` exists precisely because "before this they
each carried their own copy of the bar-building code, which is how the
three drifted apart last time" — and the progress bar is the copy that
did not get moved. Likewise `showMessage` (`js/quiz.js:40-48`,
`js/results.js:29-33`) and `formatPercent` (`js/results.js:25-27`,
`js/profile.js:43-45`, with different signatures).

### 2.8 What is genuinely finished and shared

Worth saying, because most of the app is on the right side of this line:
`answers.js`, `feedback.js`, `prompt.js`, `dom.js`, `shell.js`,
`quiz-launch.js`, `tiers.js` and `uncoveredSections`/`sectionListPhrase`
are each the single implementation of their thing, used by every screen
that needs them. The `lessonId` rule is shared between the app and the
validator by import, not by copy. The tier enum is validated from
`js/tiers.js` (`tools/validate-content.mjs:20,1045`), so a manifest tier
that would silently drop a topic off the Test tab cannot ship.

---

## 3 · What breaks at scale, with the number

The corpus is 8 topics / 193 questions / 48 lessons. Vocabulary adds
2 topics / 48 questions / 12 lessons; `so/such` and paragraph completion
follow.

### 3.1 The mixed test downloads the entire corpus — the real one

`js/quiz.js:280-284` → `js/topics.js:113-121`.

**Measured:** starting a **ten-question** mixed test issues
**9 requests and transfers 511,806 bytes** of JSON — `manifest.json` plus
**every one of the eight topic files**. `buildQuizSession` then discards
183 of the 193 questions.

It is linear in topic count and it lands on a cold cache every time,
because `quiz.html` is a separate document (the `fileCache` in
`topics.js:29` does not survive the navigation) and GitHub Pages sends
`max-age=600`.

| Topics | Payload for a 10-question mixed test |
| --- | --- |
| 8 (today) | 512 KB (~100 KB gzipped) |
| 10 (vocabulary shipped) | ~640 KB |
| 14 | ~900 KB |
| 20 | ~1.3 MB |

**This is already a real problem, not a future one.** On a Turkish mobile
connection at, say, 1.5 Mbps effective, ~100 KB gzipped is roughly half a
second of network plus 500 KB of JSON parsing on a mid-range phone — for
five questions on a bus. And `startCategoryPractice` and `startMistakeBook`
do the same thing (`js/quiz-launch.js:334-367`): they pass every live
topic id and then filter client-side.

**The number at which it stops being tolerable is around 12–15 topics**,
where the payload passes a megabyte uncompressed. That is one content
round away.

**Smallest honest fix within the constraints:** split each topic file into
`<topic>.questions.json` and `<topic>.lessons.json` at format time
(`tools/format-content.mjs` already generates the manifest's lesson
index, so it can generate this too). A mixed test then fetches only the
questions — measured across the eight files, questions are roughly 60% of
the bytes, so ~300 KB instead of 512 KB, and the reader stops downloading
question banks it does not use. Still no build step, still no dependency.
**~3 hours.** A second, larger step — a per-category index in the
manifest so `startCategoryPractice` fetches one file — is a further day
and should wait.

### 3.2 The Eğitim index is fine; Profil is the next 768px

**Measured `scrollHeight` at 320px:**

| Screen | Height | Screens | Budget in the sweep |
| --- | --- | --- | --- |
| Eğitim index | 1,116px | 1.7 | 3 ✓ |
| Test tab | 992px | 1.6 | **none** |
| Profil | **1,892px** | **3.0** | **none** |
| Topic intro (tenses) | — | — | 4 ✓ |
| Lesson reader | — | — | **none** |

The v0.22 lesson was "the sweep audited horizontal overflow and passed
1,051 checks while the index grew by 768px". The budget that came out of
it is applied to **two** screens: the index and the topic intro
(`tools/verify-ui.mjs:226,237,1031,1092,1112,1143,1203,1437`). The Test
tab (`:308`), Profil (`:354`), the quiz (`:317`), the results
(`:348`) and the reader (`:245`) all call `auditLayout` with no
`maxScreens`.

Profil is already 1,892px — **the longest landing screen in the app, at
exactly the index's budget, unbudgeted.** It grows on three independent
axes: `data/roadmap.json` items (7 today, rendered as rows), the weak
category list (up to 5) and the weak topic list (up to 3), and the
coverage paragraph. Ship the two vocabulary topics and add two roadmap
rows and Profil is over three screens with nothing to catch it. This is
the same failure shape as v0.22, one screen to the left.

The Eğitim index scales better than feared: at ~76px per topic row it is
1,568px (2.4 screens) at fourteen topics, still inside budget. The topic
level did its job.

### 3.3 The mistake book has no size control

`js/home.js:112-117` → `js/quiz-launch.js:358` (`count = "all"`).

Today the card can only offer a handful. After one full pass at a
realistic ~33% error rate the book holds **~60 items**, and
"Yanlışları çalış" starts a sixty-question session with no count picker —
while the mixed test, the weaker mode, has one. `Bitir` makes an
abandoned session survivable, so this is not a data-loss problem; it is a
"the better mode is the one that asks for twenty minutes" problem, and it
arrives in **week two of daily use**.

The card is honest about the count ("Yanlış yaptığın 60 soru burada"), so
the fix is small: the same listbox the mixed test uses, defaulting to 10.
**~1 hour.**

### 3.4 History size: not the binding constraint before the exam

**Measured** with synthetic histories, on desktop Chromium (a phone is
roughly 3–5× slower):

| History | Size | The 12 storage reads one Test-tab render performs |
| --- | --- | --- |
| 1 month @ 20 q/day | 77 KB | 5 ms (~20 ms on a phone) |
| 3 months @ 20 q/day | 232 KB | 15 ms (~60 ms) |
| 1 year @ 20 q/day | 941 KB | 55 ms (~220 ms) |

`renderTestTab` performs **twelve full parses of the whole history** per
render: `getMistakeBook` twice (`js/home.js:77` and `:364` — the same
computation, discarded and redone), `getHistory` once, `getWeakCategories`
→ `getItemStats` → `getHistory` once, and `getTopicAccuracy` once per
topic row (`js/home.js:287`), which is eight and grows with the corpus.
`renderIndex` does five more.

**Verdict: leave it.** At a month it is 20 ms. `localStorage`'s ~5 MB
quota is not reached until roughly 50,000 answered questions — years. The
cheap half of the fix is free anyway: pass one `getHistory()` result down
`renderTestTab` instead of calling the accessors, and call
`getMistakeBook()` once. **~30 minutes**, and it removes the only part
that grows with *both* history and corpus.

### 3.5 The derived-id scheme

`lessonId(topicId, category)` (`js/topics.js:134-140`) slugs to
`[a-z0-9-]`. Two categories in one topic that differ only in punctuation
or in non-ASCII characters would collide silently — progress for one
would be recorded against the other. Today's 48 ids are all distinct;
`tools/validate-content.mjs` mirrors the rule and would catch a duplicate
id. No action, but it is the one place where a content decision can
silently corrupt stored progress, and vocabulary categories (which will
carry commas and slashes more often than grammar ones) are the first real
test of it.

### 3.6 The index filter over 60+ lessons

`js/education.js:612-664`. Filtering is a `String.includes` over 48
in-memory strings — 84 after vocabulary, trivially fast at any size this
app will reach. It renders **every** match unbounded, so a one-letter
query like "e" paints 80 rows; harmless, and arguably correct. No action.

---

## 4 · The §8 accessibility contract, re-checked

I verified §8 by reading and by driving the app, not by trusting the
sweep. Most of it holds. Four items do not, and one of them has never
been implemented at all.

### 4.1 §8.7 / 1.3.1 — the radiogroup does not exist

`docs/design-system.md:681-684` is unambiguous:

> **1.3.1 Info and Relationships (A)** — a question and its options are a
> group: `role="radiogroup"` with `aria-labelledby` pointing at the stem,
> so a screen reader announces "3 of 4" and what is being asked.

`js/answers.js:145-185` builds a bare `<div class="bleed">` of
`<button>`s. **Reproduced:** `[role=radiogroup]` count is **0** on the
quiz screen, and `.option` has no `role`. There is no `aria-labelledby`,
no `aria-posinset`, no `aria-setsize`. `grep -rn "radiogroup" js/` returns
nothing.

A screen-reader user hears four unlabelled buttons with no relationship
to the paragraph above them and no position in the set. This is a written
contract item that was never built, and the sweep — which asserts
`aria-disabled` and the absence of `disabled` on the same elements
(`tools/verify-ui.mjs:1618-1619`) — does not check it.

**Fix.** `role="radiogroup"` on the wrapper, `role="radio"` +
`aria-checked` on each option, `aria-labelledby` pointing at the prompt
(which needs an id). Careful: `role="radio"` changes the expected
keyboard model (arrow keys move within the group), so either implement
that or use `role="group"`, which carries the labelling and the grouping
without the arrow-key contract. **~2 hours**, and add a sweep assertion.

### 4.2 §8.4 — three live regions, not one

`docs/design-system.md:638-641`: *"One **persistent** `role="status"`
node in the shell."*

**Reproduced on Profil:** three. `index.html:91` (`#live-region`, the
real one), `index.html:133` (`#restore-message`), and
`js/profile.js:184-185`, which creates a fourth-generation status node
**on every `render()`** — so the previously registered region is
destroyed and a new one appended each time Profil re-renders (after a
reset, after a restore).

The consequences are concrete: after a restore, `initProfileTab`
(`js/profile.js:522-529`) announces through `#live-region` **and** writes
the same sentence into a freshly-created `[role=status]` — the learner's
screen reader may hear it twice, or not at all, because a live region
appended together with its content is the failure §8.4 exists to prevent.

The sweep's check reads:

```js
ok(await page.locator("#live-region[role=status]").count() === 1, "tek kalıcı canlı bölge");
```

`tools/verify-ui.mjs:1467`. It asserts *"one persistent live region"* and
actually tests *"the element with id `live-region` exists"*. It would
pass with a hundred other status nodes on the page. See §5.

**Fix.** Make the restore dialog and Profil's backup status write through
`announce()`. **~45 minutes.**

### 4.3 §8.5 — focus lands on the container, not a heading; the title does not move

The spec asks for three things per route change. **Reproduced:**

| | Test tab | Topic intro | Lesson |
| --- | --- | --- | --- |
| `document.title` | ✓ "Test — English Prep" | ✓ "Tenses — English Prep" | ✗ "Eğitim — English Prep" |
| Focus moves | ✓ `#view-test` | ✓ `#view-egitim` | ✓ `#view-egitim` |
| Announced | ✓ "Test" | ✓ "Tenses genel bakış." | ✓ the category |

Two deviations. The title one is §0.6/1.6 above. The focus one is softer:
the spec says *"move focus to the new view's **heading**, given
`tabindex="-1"`"*; the code focuses the whole `<section class="view">`
(`js/home.js:454`). That is what forced `.view:focus-visible { outline:
none }` (`css/style.css:1035`) after a learner reported *"menüye
tıklayınca büyük sarı kutu"* — a focus ring drawn around 1,400px of
content. Focusing a heading would not have needed the workaround. The
sweep asserts the deviation as if it were the contract
(`tools/verify-ui.mjs:1480`).

Also: on the lesson route, `applyRoute` announces "Eğitim" and then
`openLesson` announces the category a few milliseconds later
(`js/home.js:446` then `js/education.js:1544`). Two replacements of one
region; most screen readers will read only the second, which is the one
that matters — but it is luck, not design.

### 4.4 The index filter announces on every keystroke

`js/education.js:659`. **Reproduced:** typing `ilgi` produced **four**
live-region updates:

```
48 ders eşleşti. / 18 ders eşleşti. / 3 ders eşleşti. / 2 ders eşleşti.
```

For a screen-reader user, typing a five-letter query means five
interruptions, each cancelling the last. The filter is new in v0.22 and
nothing checks its announcement behaviour. **Fix:** debounce the
`announce` by ~400 ms (not the filtering — that should stay instant).
**~20 minutes.**

### 4.5 The web manifest locks orientation, which §8.7 forbids

`manifest.webmanifest:10` — `"orientation": "portrait"`, against
`docs/design-system.md:687-689`:

> **1.3.4 Orientation (AA)** — do not lock to portrait. Landscape on a
> phone leaves roughly 380px of height; the reader and the action bar
> have to survive it.

I measured the quiz at 844×390 and it does survive — the options scroll
clear of the action bar. So the app is capable of what the manifest
forbids. This affects only the installed app, and nothing in `npm run
check` or `npm run verify` looks at `manifest.webmanifest` at all.
**Fix: delete one line.** **~2 minutes.**

### 4.6 What holds, verified rather than assumed

- **Listbox** (§8.2): `role="combobox"` + `aria-expanded` +
  `aria-controls` on the trigger, `role="listbox"` popup, `role="option"`
  + `aria-selected`, **DOM focus never leaves the trigger**, and
  Down/Up/Enter/Escape/Home/End/type-ahead all behave. Verified in the
  code (`js/listbox.js:41-234`) and driven in the browser. One nit:
  `aria-activedescendant` is set to the empty string when closed
  (`js/listbox.js:86`) where the attribute should be removed; and each
  option is bound to both `pointerup` and `click`, so `select()` fires
  twice on a mouse (harmless today because `changed` is false the second
  time — a latent double-`onChange` if a caller ever passes one).
- **Dialog** (§8.3): native `<dialog>` + `showModal()`, focus on Cancel,
  containment, Escape, focus restore to the invoker — all verified.
- **Keyboard reachability of what v0.22 added**: the topic rows are
  `<button class="row">` and the filter is `<input type="search">` — both
  in the tab order, both operable, and the topic index is reachable
  without a pointer. ✓
- **Bottom bar / 2.4.11**: `scroll-padding-bottom` is set on the
  scrolling region (`css/style.css:289`). ✓
- **`lang="en"`**: the sweep checks it on every topic intro
  (`tools/verify-ui.mjs:1430-1434`) and I found no untagged English in
  the reader, the quiz or the results.
- **1.4.1 use of colour**: every verdict carries a glyph as well as a
  tint (`js/feedback.js:218-228`, `js/answers.js:171-175`). ✓
- **First-run announcement**: on arrival the app announces "Eğitim" and
  renders the welcome card as an ordinary `<section>` with an `<h2>`.
  Nothing is announced that a sighted learner does not see, and nothing
  is hidden that they do. The one gap is §4.1 — the first question the
  learner is asked to answer, from the welcome card's "Ya da kısa bir
  testle başla", presents as four unrelated buttons.

---

## 5 · The harness

`tools/verify-ui.mjs` is 1,683 lines and 1,158 green checks. It is the
best thing in the repo and it has the failure modes that any suite this
size develops.

### 5.1 A check that asserts less than its message claims

`tools/verify-ui.mjs:1467`

```js
ok(await page.locator("#live-region[role=status]").count() === 1, "tek kalıcı canlı bölge");
```

Message: "one persistent live region". Test: "an element with id
`live-region` exists". There are three status regions on Profil (§4.2)
and this check has never noticed. The correct assertion is
`[role=status], [aria-live]` count === 1, document-wide, on every screen
it visits.

### 5.2 A check that would pass if the feature were deleted

`tools/verify-ui.mjs:577-580` — the problem-report section asserts four
things about the clipboard text: that it says "English Prep", that it
carries `Soru: <id>`, `Uygulamanın doğru dediği:` and
`Benim işaretlediğim:`. It never asserts the question stem. §0.3 is a
field that has been empty in every report ever generated, past four
assertions and a dedicated unit test.

Related, `tests/content-checks.test.js:250-268`: the unit test builds its
own fixture with `{paragraph: "Turkey ____ …"}`. No code path in the app
produces an object with that key. **A test that constructs its input by
hand tests the function, not the app** — and this is the case that shows
why that distinction is not pedantry.

### 5.3 A ReferenceError waiting in a fallback

`tools/verify-ui.mjs:456`

```js
const title = (await page.locator("#lesson-reader h1").textContent())?.trim() ?? `#${index}`;
```

`index` does not exist in this scope — it was removed when
`runEveryLesson` became id-driven rather than click-driven. The fallback
is only evaluated when a lesson has no `<h1>`, which is exactly the
failure this line exists to report; when it fires, the harness crashes
with a ReferenceError instead of naming the broken lesson.

### 5.4 Screens and states nothing covers

- **The back button. Anywhere.** `page.goBack()` appears **zero times**
  in 1,683 lines. §8.5 explicitly says *"Back and forward get the same
  treatment as a forward navigation, or the browser Back button silently
  strands focus"*, and nothing tests it. §0.1 — the highest-severity
  defect in this document — is a back-button defect.
- **The results → lesson link**, which is the whole reason lessons and
  questions share one taxonomy (`js/results.js:1-7`). The sweep reaches
  the results screen four times and always leaves via
  `#results-bar a` (`:350`). It never clicks a category row.
- **"Yeni test"** — the other action bar button on results, never
  clicked. §2.1 lives there.
- **Every failure path.** No test drives a 404 on a topic file, a
  malformed hash, a corrupt store, or an offline reload. §0.2's dead-end
  screen — no header, no nav, no controls — is one `page.route(…abort)`
  away from being caught.
- **Profil's own controls**: the name field is never typed into; "Geçmişi
  sıfırla" is opened and dismissed with Escape (`:1539`) but **never
  confirmed**, so nothing verifies that a reset actually clears anything
  or that Profil re-renders afterwards.
- **The topic index at 768 and 1280.** `runIndexStates` and
  `runTopicIntro` run only at 320.
- **Height budgets on Test, Profil, the reader, the quiz and the
  results** (§3.2), and height only ever at width 320.
- **The web manifest.** Nothing reads it (§4.5).

### 5.5 The next blind spot of the v0.22 kind

The v0.22 regression was: *a landing screen grew 768px and the sweep,
which measured everything horizontal, measured nothing vertical.* The
budget that came out of it was applied to the screen that had already
failed and to one neighbour.

**Profil is 1,892px, 3.0 screens, unbudgeted, and growing on three
axes** (§3.2). It is the same shape of miss with a different screen's
name on it. The general fix is to make `maxScreens` opt-**out** rather
than opt-in: default every landing screen to 3, exempt the reader and the
results review by name with a comment saying why. That inverts the
failure mode from "a new screen is silently unmeasured" to "a new screen
is measured until someone argues it shouldn't be".

### 5.6 `tools/audit-ui.mjs`

`tools/audit-ui.mjs:28-30` hard-codes the global Playwright path with no
`PLAYWRIGHT_PATH` fallback and no error message, unlike `verify-ui.mjs`'s
careful `loadChromium` (`:83-120`). It will die with an unresolved import
on any machine where Playwright lives elsewhere. It also measures only
the six index/test/profile screens — never the lesson reader, the quiz
or the results, which are three of the six screens §7 is about.

---

## 6 · Offline and installation

### What happens today

**Measured.** Offline with a cold cache: the navigation fails and the
browser shows its own error page. There is no app. Offline with the shell
in the HTTP cache but `data/` unreachable: the shell loads and both tabs
say the true thing — *"Dersler yüklenemedi. Sayfayı yenile."* /
*"Konular yüklenemedi. Sayfayı yenile."* — with no retry control.

GitHub Pages sends `Cache-Control: max-age=600` on static assets. So the
window in which the app half-works offline is ten minutes after the last
online visit. Beyond that: nothing.

### Is that acceptable for a learner revising on a bus?

**No.** This is a mobile-first exam-prep app whose stated distribution is
a link in a group chat, whose learners are commuting Turkish
undergraduates, and whose author is about to use it daily on a phone. The
Istanbul metro and most intercity buses are exactly the ten-minute
scenario. A study app that is a blank page underground is a study app you
stop opening.

It is also the one place where the "no build step, zero dependencies"
constraint costs the learner something real rather than costing the
developer convenience.

### The smallest honest fix

A hand-written service worker. It is plain ES, it needs no build step and
no dependency, and it is ~60 lines:

1. `sw.js` at the root, registered from `index.html`, `quiz.html` and
   `results.html` with a `navigator.serviceWorker` guard.
2. `install`: precache the four shell documents, `css/style.css`,
   `css/fonts.css`, the three woff2 files and the icons — **43 KB of CSS
   + 48 KB of fonts + 11 KB of icons**, a fixed list that does not grow
   with content.
3. `fetch`: cache-first for the shell, **stale-while-revalidate** for
   `data/*.json` — serve the cached copy instantly and refresh it in the
   background. This is the right policy here because content changes
   rarely and staleness is harmless (the "Yeni" badge already exists to
   handle exactly that).
4. A version constant in `sw.js` bumped by hand, with `activate` deleting
   old caches. One line per release, in the same commit as the
   `CHANGELOG` entry.

**Cost: ~3 hours, including a `runOffline` section in the sweep** —
`context.setOffline(true)`, reload, assert the index renders and a lesson
opens. That section is what stops the service worker from silently
rotting, which is the standard fate of a hand-written one.

**What it does *not* buy, and should not be claimed:** it does not make
the app installable-and-safe on iOS. `js/backup.js:1-12` already records
the trap — adding to the Home Screen on iOS moves the app into a separate
storage container and **destroys the progress on the way**. The app
correctly never prompts to install. Do not add an install prompt on the
back of a service worker.

**One line to fix while in there:** `manifest.webmanifest:10`'s portrait
lock (§4.5).

---

## 7 · Data safety

Everything a learner does is in one browser's `localStorage`, with a
manual export/import in Profil.

### How the data can be lost

| # | Path | Prevented today? |
| --- | --- | --- |
| 1 | **Answers in a live quiz, on any exit that is not `Bitir`** — back gesture, tab close, OS discard | **No.** §0.1. Reproduced: 3 answers → 0 recorded |
| 2 | **iOS/WebKit 7-day eviction** of script-written storage with no interaction on the origin | Partly: `requestPersistentStorage()` asks (`js/home.js:489`) and WebKit usually refuses; the backup is the real answer, and it is manual |
| 3 | **Installing to the iOS Home Screen** moves storage to a new container | Not prevented; correctly, the app never suggests installing |
| 4 | Browser data cleared, private window, new phone | Backup covers it, if one was taken |
| 5 | **A corrupt store taking Profil down before the backup button renders** | **No.** §1.5 |
| 6 | **Quota exceeded** — `writeJson` swallows `QuotaExceededError` silently (`js/storage.js:57-64`) | Deliberate, and the learner is never told. Not reachable in practice: ~5 MB is roughly 50,000 answered questions |
| 7 | Two tabs, last-writer-wins | Not prevented; §1.8; low exposure |
| 8 | A restore writing nothing because storage failed, while `describeRestore` reports success | **No.** `importState` (`js/storage.js:717-743`) writes through `writeJson`, which cannot fail loudly, and the summary is computed before the write |

### What the app does prevent, and does well

- The merge is **non-destructive by construction**, not by care:
  `mergeHistory` is first-writer-wins on attempt date, lesson progress is
  a maximum, `done` is sticky, seen-versions take the higher mark
  (`js/backup.js:34-90`). 16 unit tests and a two-context browser
  round-trip cover it.
- Restore is **two steps with a preview**, and every way a paste can fail
  has its own sentence (`js/backup-ui.js:193-198`).
- Restoring the same file twice is idempotent, and the app says so
  honestly ("hiçbir şey değişmedi") rather than showing a success toast.
- Sharing the backup goes through the share sheet first, with a cancelled
  share correctly treated as a decision rather than a failure.
- Profil says plainly, in Turkish, that the data lives in this browser
  and will be lost (`js/profile.js:176-181`).

This is the best-engineered part of the app. The problem is not the
mechanism; it is that **nothing ever asks him to use it.**

### The cheapest additional protection

Ranked by value per hour.

1. **Fix §0.1 and §1.5** — ~1h20m total. Between them they are two of the
   eight loss paths, and §1.5 is the one that removes the escape hatch.
2. **A backup nudge with a real trigger.** Store `lastBackupAt` in
   settings; when there is unbacked-up progress older than ~7 days *and*
   at least one recorded attempt, put one quiet line in Profil's
   "Verilerin" section: *"Son yedeğin 12 gün önce. O günden beri 6 test
   çözdün."* Not a banner, not a modal, not on any other screen — Profil
   is already the honest-metadata screen and this is the same species of
   fact as the coverage paragraph. This is the single highest-value data-
   safety change in the document, because every other protection depends
   on a file that currently only exists if he remembers. **~1 hour.**
3. **Make a failed write visible.** `writeJson` returns a boolean;
   `recordAttempt` and `importState` propagate it; the results screen and
   the restore dialog say *"Kaydedilemedi"* rather than lying by silence.
   **~1 hour.**
4. **Refuse to render Profil without the backup buttons.** Move
   `renderData()` above `renderStats()` in `js/profile.js:471-514` and
   wrap each section in its own try/catch, so no computation over
   learner data can take the export with it. **~30 minutes**, and it is
   defence in depth against the next §1.5.

Explicitly **not** recommended: automatic cloud backup, an account, or
any periodic auto-download. All three violate stated non-negotiables and
none is needed to close the gap.

---

## What is complete

- **The learning model.** Scoring, session building
  (`orderForPractice`'s worst-known-first), the windowed accuracies, the
  Wilson bound on every claim, the mistake book's two-days graduation
  rule. 107 unit tests, and the reasoning is written down beside the code
  rather than in a wiki.
- **Backup and restore**, as a mechanism (§7).
- **The design system as an enforced artefact.** `npm run color`
  re-measures every token in CI; `npm run audit` measures §7 in the
  running app instead of reading the stylesheet.
- **The honesty layer.** The coverage paragraph, the roadmap section, the
  hedged weak-spot claims, the "you are not ready" end state, the
  disclosure that the content is model-written. Every number on screen
  answers a question the app can actually answer, and the three that did
  not were fixed in v0.19. This is the app's best quality and it is fully
  built.
- **Navigation and routing**, for every input I could think of except a
  malformed percent-escape (§0.5). Hash routes, deep links, stale ids,
  the topic namespace, the back button through three levels.
- **The content pipeline** — validator, formatter, blinding, calibration,
  draft checks, ship script — is complete and, judging by the changelog,
  is the reason the corpus is trustworthy.

## What is incomplete, and by how much

- **Offline: 0%.** Not started, no service worker, no cache policy. ~3
  hours from nothing to working (§6).
- **The §8 contract: about 85%.** §8.1, §8.2, §8.3, §8.5's announcement
  and focus movement, §8.6, 1.4.1, 1.4.10, 1.4.12 all hold. **1.3.1's
  radiogroup has never been built** (§4.1); §8.4's single-live-region rule
  is broken three ways (§4.2); §8.5's title rule fails on the lesson
  route (§1.6); 1.3.4 is contradicted by the web manifest (§4.5). ~4
  hours to close all four.
- **Error paths: about 40%.** The happy path and the *content-missing*
  paths are careful and well-commented. The *transport-failed* and
  *store-corrupt* paths are not: one dead-end screen with no controls
  (§0.2), two dead loading screens (§1.4), one crash that hides the
  backup button (§1.5), one unhandled router throw (§0.5). ~3 hours.
- **The harness: about 90% of what it claims.** 1,158 real checks; one
  check weaker than its message, one that would pass with the feature
  broken (and did), one latent ReferenceError, zero back-button coverage,
  zero failure-path coverage, and height budgets on two screens of six.
  ~4 hours to close the named gaps.
- **Payload at scale: works today, one content round from a problem.**
  512 KB for a ten-question mixed test, linear in topics (§3.1). ~3 hours
  for the file split.
- **Documentation drift: small but in the load-bearing file.** `CLAUDE.md`
  contradicts itself on what a lesson is, is 7× off on the manifest size
  (in four places, in code comments used to justify the architecture),
  is 2.7× off on the check count, and omits four `js/` modules including
  both halves of backup. ~1 hour.

---

## Ranked, with hours

### Do these before he starts using it — 4h20m

| | Fix | § | Hours |
| --- | --- | --- | --- |
| 1 | Record the attempt on `pagehide` so the back gesture stops destroying a live test | 0.1 | 1h |
| 2 | Reader error screen: clear `state.reader`, give it a way out, stop it completing the previous lesson | 0.2 | 1h |
| 3 | `buildReport` reads `prompt`; assert the stem in the unit test **and** the sweep | 0.3 | 30m |
| 4 | Guard `getOverallStats`; move `renderData()` above the stats in Profil | 1.5, 7 | 40m |
| 5 | try/catch the hash decode + a top-level catch on `applyRoute` | 0.5 | 15m |
| 6 | `markLessonDone` skips the write when already done | 0.6 | 10m |
| 7 | `document.title` in `openLesson` | 1.6 | 10m |
| 8 | Guard `getQuizRequest` / `getQuizResult`; home link on the failure screens | 1.4 | 20m |
| 9 | Delete `"orientation": "portrait"` | 4.5 | 2m |
| 10 | Debounce the filter's `announce` | 4.4 | 20m |

### Then, in the first week — 8h

| | Fix | § | Hours |
| --- | --- | --- | --- |
| 11 | Service worker: shell precache + stale-while-revalidate for `data/`, plus a `runOffline` sweep section | 6 | 3h |
| 12 | Backup nudge in Profil, from a `lastBackupAt` setting | 7 | 1h |
| 13 | Height budgets opt-out rather than opt-in; budget Profil, Test, quiz, results | 3.2, 5.5 | 1h |
| 14 | Harness: `page.goBack()` coverage, click the results→lesson link and "Yeni test", one aborted-fetch failure path, fix `:456` and `:1467` | 5 | 2h |
| 15 | `role="group"` + `aria-labelledby` on the options (or the full radiogroup) | 4.1 | 1h |

### Then, before the next content round — 6h

| | Fix | § | Hours |
| --- | --- | --- | --- |
| 16 | Split topic files into questions/lessons at format time; mixed test stops downloading lesson prose | 3.1 | 3h |
| 17 | Mistake book gets a count listbox | 3.3 | 1h |
| 18 | Route the restore dialog and Profil's status through `announce()` | 4.2 | 45m |
| 19 | Clear (or recompute) the quiz request for mistakes mode | 2.1 | 30m |
| 20 | `renderTestTab` computes the history once | 3.4 | 30m |

### Housekeeping, whenever — 2h

- One `STARTED_READING = 0.02` constant (§2.3); one shared `progressBar`
  in `shell.js` (§2.7); delete `clearQuizState` once §2.1 has a real call
  site or wire it up; drop the unused `MISTAKE_BOOK_GRADUATION` export or
  make `home.js` use it (§2.2).
- Fix the four "1.7 KB" comments, `CLAUDE.md:9`, `:77`, `:254` and the
  module inventory, and the three orphaned JSDoc blocks (§2.5).
- Decide whether the "Yeni" badge belongs on the Eğitim index (§2.4). I
  would put it there: it is the default view, and news about content is
  currently reachable only from a screen a returning learner may not
  visit and a card that needs a ten-day absence to appear.
- `tools/audit-ui.mjs` gets `verify-ui`'s Playwright loader (§5.6).

---

## What I would refuse

- **A confirmation dialog on leaving a quiz.** `user-flow.md` refused it
  and was right; §0.1 is fixed by recording the work, not by making the
  loss loud.
- **An install prompt on the back of the service worker.** On iOS it
  destroys the progress it would be advertised as protecting
  (`js/backup.js:1-12`).
- **Automatic or cloud backup.** No accounts, no backend. The nudge in
  §7 is the honest version.
- **A build step to solve §3.1.** The file split is a formatter change,
  which the project already has.
- **Reopening the navigation, the topic level, or the flat index.** All
  three are settled by feedback and none of the findings above needs
  them reopened.
