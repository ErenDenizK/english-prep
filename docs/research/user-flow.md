# The end-to-end flow

What a learner actually sees, tap by tap, on the five journeys that matter
— arriving cold, coming back the same day, coming back after three weeks,
doing badly, and running out of app.

Written against the `v0.17` build, 2026-09-04. **Everything below was
driven in a real Chromium at 390×844 and re-checked at 320×640**, against
`npm run serve`, with `localStorage` cleared before each journey. Screen
contents, element positions and fold lines are measured from the running
page, not read out of the source; where a file and function are named it
is because the behaviour was reproduced first and then traced.

This file extends `onboarding.md` rather than repeating it. That brief's
§1 (first run) and §6 (coming back) both have designs and costs already;
this one starts from what shipped and reports what the shipped version
does on a phone.

---

## What has landed since `onboarding.md`, and what it changed

Four of that brief's items are live, and they change the questions worth
asking. Verified in the browser:

- **The first-run empty state exists** (`renderWelcome`,
  `js/education.js:182`). The `%0 · 0/18` opener is gone for a fresh
  learner; the card names the exam, states the privacy fact and offers one
  primary action.
- **Export / import exists** (`Yedek al` / `Yedekten geri yükle` in
  Profil, `js/backup.js`, `js/backup-ui.js`), with the **Verilerin** block
  and its honest sentence about the browser.
- **The re-entry card exists** (`renderReEntryCard`,
  `js/education.js:234`), with `getLastActivity()` and `RE_ENTRY_DAYS = 10`
  in `js/storage.js`. `onboarding.md` §6 asked this file to confirm it does
  not exist. **It does — but it is gated so that most returners never
  reach it.** §J3 below.
- **Windowed accuracy exists** — Profil's headline reads "Son 40 soruda
  %20" rather than a lifetime average, and the weak lists carry the
  "Şimdilik az veriyle sıralandı" hedge.

So the first-run problem is smaller than it was. **The problem has moved
to the second visit and everything after it**, which is where nothing was
ever designed: the welcome card is single-use, and once it is gone the
Eğitim index says the same thing to every learner in the app regardless of
what the app knows about them.

Two housekeeping results, since they are cheap to state and were checked
on every screen visited: **no console errors anywhere**, and **no
horizontal overflow at 320 or 390** on any of the fifteen screens this
audit landed on.

---

## Journey 1 · Brand-new learner, arriving from a pasted link

### The path

| Tap | What happens |
| --- | --- |
| — | Link opens `index.html`, router lands on `#egitim` |
| 1 | **İlk dersi aç** → `#egitim/tenses-present-simple-vs-present-continuous` |
| 2 | An option in **Önce bir dene** → answered, feedback opens inline |

**Two taps to a first answered question.** That is very good and it should
be defended. The alternative route — Test → Teste başla → an option — is
three, and the welcome card's own secondary (**Ya da kısa bir testle
başla**) is also three.

### What is on screen, in reading order

Measured at 390×844, scroll region 56..784:

| y | |
| --- | --- |
| 84..132 | **Geliştirme aşamasındayız** — henüz v1 değil… (dismissible) |
| 192..306 | **English Prep** / "Üniversite İngilizce yeterlik sınavı için dersler ve paragraf soruları. Hesap açman gerekmiyor; ne yaptığın yalnızca bu telefonda kalıyor." |
| 322..374 | **İlk dersi aç** (filled) |
| 390..406 | Tenses · Present Simple vs Present Continuous |
| 422..470 | Ya da kısa bir testle başla (quiet) |
| 518.. | Tenses / 18 lesson rows |

**The first thing they read is still the dev note.** `initDevNote()`
(`js/home.js:425`) renders above `.app-content`, so the first sentence a
stranger reads is that the thing they were sent is not finished, and the
second is what it is for. `onboarding.md` flagged this and left it as the
owner's call; it is still true, and it now costs 48px of the 320 fold as
well as the first impression.

### Verdict

**Strong.** The landing screen does its job: purpose, one action, a
privacy fact, and a list you can scroll past all of. Nothing on it is
meaningless except one badge (below).

### Friction, ranked by cost

**1 · The pretest and the lesson's own check questions collide about half
the time.** This is the worst defect in the whole audit and it is four
lines to fix.

`renderLesson` builds its check pool with `takeChecks(lesson)`
(`js/education.js:768`) — one shuffle, each `check` block takes the next
item, "two checks in one lesson are never the same question", as the
comment says. But the **Dersten önce** pretest is drawn from a *second,
independent* `takeChecks(lesson)()` call at `js/education.js:959`. A
category has four questions and a lesson renders two checks, so the
pretest lands inside the check set with probability 2/4.

Measured: **13 collisions in 24 fresh opens of
`tenses-present-simple-vs-present-continuous`** (54%; theory says 50%).

What the learner gets when it collides: they answer the question at the
top of the lesson, read the explanation and the correct answer, scroll
three blocks down, and meet the identical stem and the identical options
again, labelled **Kontrol**. It is the same failure mode as the one
`docs/agents/question-author.md` rule 1 exists to stop — meeting the
answer a few blocks above the question — except here it is produced by the
renderer rather than by an author, so no content review can catch it.

**Fix:** draw the pretest from the same closure the blocks use, so the
pool is shared. One `takeChecks` per lesson render, threaded from
`renderLesson` into the pretest branch. **~5 lines. No schema change, no
content change.**

**2 · At 320, the first answerable thing is below the fold.** In the
reader at 320×640 (fold at 640) the **Önce bir dene** heading is at 279,
its four-line rationale runs to ~430, the question paragraph to ~610, and
the first option sits at **625..677** — top edge only, options 2–4 
entirely off screen. At 390 all four options are visible (543..751). So on
the width this project designs to first, tap 2 needs a scroll first.

The cause is the rationale paragraph — four lines explaining why a
question you are expected to fail is useful. The explanation is good and
worth keeping; it is in the wrong order. Put the question first and the
rationale in the feedback, where the learner has just experienced the
thing being explained.

**Fix:** move the "Bilmiyorsan sorun değil…" paragraph from above the
question to below it, shown with the feedback. Keeps every word, saves
~150px, and the sentence lands at the moment it is true. **~10 lines in
`renderPretestBlock` (`js/education.js:631`).**

**3 · "Yeni" is on all three topics for someone who has never seen
anything.** `getSeenVersion` returns `0` for a fresh store and every topic
has `contentVersion ≥ 2`, so `renderTopicRow` (`js/home.js:281`) badges
all three. On the one screen where every single thing is new, the app
distinguishes three of them as new. See §J2 for the other half of this
problem, which is worse.

**4 · The purpose statement is single-use.** "üniversite İngilizce
yeterlik sınavı" appears in exactly one runtime string — `renderWelcome`
(`js/education.js:191`) — which is destroyed the moment the learner has
any history. From the second visit on, nothing in the running app says
what it is for. (It survives in the `<meta>` and OG tags, which are for
the link preview, not for the app.)

---

## Journey 2 · Second visit, same day — five questions answered, then left

Two different things happen depending on *how* they left, and one of them
loses the work.

### 2a · They finished a five-question test

Path: Eğitim → **Ya da kısa bir testle başla** → five options → results →
close the tab → come back.

What they get on return, measured at 320:

```
Geliştirme aşamasındayız …
İlerlemen
18 dersten 0 tanesi tamamlandı
Tenses  ▸ 6 rows
Modals  ▸ 6 rows
Passive Voice ▸ 6 rows
```

The welcome card is gone — `renderIndex` computes
`untouched = completed === 0 && no progress && getHistory().length === 0`
(`js/education.js:349`), and one attempt falsifies it — and what replaces
it is `renderProgressSummary`: **a progress line reading zero**. So the
second visit is strictly worse than the first: the learner has lost the
purpose statement and the one obvious action, and gained a bar at 0/18.

That is the exact trade `onboarding.md` §1 warned about in the other
direction ("a progress bar reading zero and an empty-state card on the
same screen is two ways of saying you have done nothing"). The card was
removed and the zero bar was kept.

And the app is not short of things to say here. It knows this learner
answered five questions, which categories they were, and which they got
wrong. The Eğitim index reads none of it.

### 2b · They answered five and tapped Çık

**Everything is discarded, silently.**

`Çık` is a plain `<a href="index.html">` (`js/quiz.js:53–56`). No
confirmation, no partial record. Verified: after answering five of ten and
tapping Çık, `localStorage` contains **only** `englishPrep.seenVersions` —
no history, no lesson progress. The learner lands on the *first-run
welcome card*, because `untouched` is still true. The app has forgotten
they were ever here.

The same is true of a browser reload mid-quiz: the session lives in page
memory only (`js/session-state.js` stashes the *request*, not the answers),
so a refresh at 4/10 silently restarts at 1/10 with a fresh draw.

This matters more than it looks. Five questions on a phone between classes
is a completely normal session length, and it is the session length this
app is built for. The one destructive action in Profil goes through a
native `<dialog>` confirmation; the action that throws away a learner's
actual work goes through an anchor tag.

### 2c · One tap burns every "Yeni" badge, permanently

`startMixedTest`, `startCategoryPractice` and `startMistakeBook` all call
`topics.forEach(markSeen)` before navigating (`js/quiz-launch.js`). Only
`startTopicTest` marks just its own topic.

Verified: `seenVersions` is `null` before the tap and
`{"tenses":3,"modals":2,"passive-voice":2}` immediately after tapping the
welcome card's **Ya da kısa bir testle başla** — before a single question
is displayed, and regardless of whether the learner finishes. Also
verified: after one *abandoned* mixed test, all three "Yeni" chips are
gone from the Test tab for good.

So the badge is spent on a learner's first or second tap, having shown
them nothing, and can never afterwards do the job it exists for. It also
takes `newContentNote` with it — the re-entry card's news line
(`js/education.js:268`) requires `getSeenVersion(topicId) > 0 &&
< contentVersion`, which after this can only become true again when the
owner ships new content, to a learner whose badge was already consumed
without cause.

`onboarding.md` §6 found this trap and it is still live; the mitigation
that shipped (reading the note before rendering the buttons) protects one
render, not the state.

### Verdict

**The weakest journey in the app.** A learner who did real work gets a
screen that is either indifferent to it (2a) or has erased it (2b), and
the app quietly consumed its own "new content" signal on the way (2c).

### Friction, ranked

1. **Çık discards answered questions with no warning and no record.**
2. **`markSeen` fires at launch instead of at delivery.**
3. **The Eğitim index has nothing to say to a test-only learner** — the
   welcome card is gone and the replacement is a zero.
4. Mid-quiz reload silently restarts.

---

## Journey 3 · Returner after three weeks

Simulated by playing two mixed tests and reading lessons, then rewriting
every `attempt.date` to 21 days ago. `getLastActivity()` returns the aged
timestamp and `away` evaluates true — confirmed in the page.

### What actually happens

**The re-entry card exists and works — and this learner does not see it.**

`renderIndex` (`js/education.js:351–359`) computes `away` *inside* the
`if (resumable)` branch:

```js
const resumable = lessons.find((lesson) => {
  const entry = progress[lesson.id];
  return entry && !entry.done && entry.read > 0.02;
});
if (resumable) {
  const last = getLastActivity();
  const away = …;
  indexContainer.appendChild(away ? renderReEntryCard(…) : renderResumeCard(…));
}
```

So the whole re-entry behaviour is conditional on there being **a lesson
left half-read**. Verified both ways:

- Three lessons finished, two tests, 21 days away, no part-read lesson →
  **"İlerlemen · 18 dersten 3 tanesi tamamlandı"** and 18 rows. Byte for
  byte the same-day screen.
- Same state plus one lesson at `{read: 0.73, done: false}` → the re-entry
  card renders correctly: *Kaldığın yer / Future Forms / Tenses · %73 /
  **Önce 5 soruyla hatırla** / Kaldığın yerden devam et.*

The card is good. The copy obeys both of its own rules — it never names
the number of days and never implies fault — and **Önce 5 soruyla
hatırla** is the right primary. The gate is the problem: it rewards the
learner who abandoned something mid-scroll and ignores the one who
finished what they started. A learner who reads lessons to the end and
takes tests — the app's best-behaved user — is invisible to it.

There is a second, quieter reason the gate bites. `getLastActivity()`
reads `attempt.date` only, and lesson progress is `{read, done}` with **no
timestamp** (verified: `getAllLessonProgress()` returns exactly those two
fields). So a learner who has only ever read lessons has no last-activity
date at all and can never trigger re-entry, by construction.
`onboarding.md` §8 called this out and it was not built.

### Where the good news is, and it is one tap away and unadvertised

The same 21-day returner's **Test** tab carries everything Eğitim is
missing:

```
Yanlış defteri
Yanlış yaptığın 8 soru burada. Sınavdan önce tekrar bakman gerekenler bunlar…
[ Yanlışları çalış ]

Karışık test … [ Teste başla ]

En çok zorlandıkların        (Şimdilik az veriyle sıralandı.)
  Past Simple vs Past Continuous vs Past Perfect   1/3
  Future Forms                                     1/3
  Should vs Ought To vs Had Better                 2/3

Temeller       Tenses  25 soru · 6 ders   %55
Temel Dilbilgisi  Modals 24 soru · 6 ders %71
```

**The app lands them on the screen with nothing for them, and keeps the
re-entry material on the screen they have to choose to visit.** The
Yanlış defteri is exactly the right thing to offer a returner and it is
behind a tab.

### Verdict

**The design is right and the gate is wrong.** This is a ~25-line change,
not a feature.

### Friction, ranked

1. **Re-entry is gated on a half-read lesson.** Most returners get the
   same-day screen.
2. **Lesson progress has no timestamp**, so lessons-only learners are
   permanently outside re-entry.
3. The Yanlış defteri — the best re-entry material in the app — is not
   reachable from the landing screen.

---

## Journey 4 · A learner who is doing badly

Four mixed tests of twenty, answered at ~20%. 80 questions, 4/24 on
Modals, 5/25 on Tenses, 7/24 on Passive Voice.

### What the app says

**Eğitim (the landing screen):**

```
İlerlemen
18 dersten 0 tanesi tamamlandı
Tenses ▸ 6 rows · Modals ▸ 6 rows · Passive Voice ▸ 6 rows
```

Nothing else. Every row identical, no ordering, no marks, no hint. The app
has 80 observations about this person and the screen they arrive on shows
none of them.

**Test tab:**

- *Yanlış defteri* — "Yanlış yaptığın **58** soru burada." → `Yanlışları çalış` (filled)
- *Karışık test* → `Teste başla` (filled)
- *En çok zorlandıkların* — five rows, all `0/5` or `0/4`
- Topic rows — `%26`, `%19`, `%15`

**Profil:**

- Stat grid — `0/18` · `4` · `80` · `%20` (Son 40 soruda)
- *En çok zorlandığın kategoriler* — five rows, all `0/4`, each linking to a lesson
- *En çok zorlandığın konular* — `4/24`, `5/25`, `7/24`

### Verdict

**It helps them once and scores them five times.**

The one genuinely helpful thing is the Yanlış defteri, and it is excellent
— a work queue, not a score, with a graduation rule and an honest caveat.
Everything else is the same bad news restated: two weak-category lists
(differing only in what happens on tap), one weak-topic list, three
accuracy chips, four stat tiles.

And the two lists are **the same list with different behaviour**:

| | Heading | On tap |
| --- | --- | --- |
| Test tab, `renderWeakSpots` (`js/home.js:197`) | "En çok zorlandıkların" | starts practice in that category |
| Profil, `renderWeakList` (`js/profile.js:111`) | "En çok zorlandığın kategoriler" | opens the lesson |

Neither says which it does until you read the one-line hint, and a learner
who has met one has no reason to expect the other to differ. Worse, the
learner who most needs the *lesson* is on the Test tab, where the row
starts another test.

**Nothing anywhere sequences.** Two filled primaries compete on the Test
tab, and neither is "read the lesson for the thing you keep getting
wrong", which is the correct answer at 20%.

### Friction, ranked

1. **The landing screen is diagnostically blank** while three other
   screens are saturated.
2. **No first action.** Two filled primaries (§7.2 says one per screen)
   and no ranking between them.
3. **Two identical-looking lists with opposite tap behaviour.**
4. **`Teste başla` is below the fold.** Measured on the Test tab once the
   Yanlış defteri card is present (i.e. for every learner who has taken a
   test): at 320×640, `Teste başla` sits at **826..878** against a fold at
   **580** — 246px under. At 390×844 it is at 736..788 against a fold at
   784, so it is clipped. Cause: two stacked cards each carrying a full
   explanatory paragraph (4 and 5 lines at 320).
5. **The mistake-book count is the one number in the app that rises with
   failure.** "58 soru" out of a 73-question bank. I would keep it — it is
   a work queue that can reach zero, the copy explicitly warns the list
   will grow, and it is a fact rather than a score — but it is worth
   naming as the closest thing to a guilt mechanic that exists here, and
   worth watching if anyone ever proposes putting it in the header.

---

## Journey 5 · A learner who has finished everything

All 18 lessons read to the end, then the whole 73-question bank answered
correctly twice.

### What is offered

**Eğitim:** "18 dersten 18 tanesi tamamlandı", and 18 rows each stamped
**Tamamlandı**. No card. No next action. The screen a learner reaches after
finishing everything is the screen they started on with a stamp on each
row.

**Test:** the Yanlış defteri empty state — and it is the best writing in
the app:

> Şu an defterinde bekleyen soru yok. Bu, yanlışlarını temizlediğin
> anlamına gelir — soruların hepsini bildiğin anlamına değil. Karışık
> testle devam et; yeni bir yanlış çıkarsa buraya düşer.

Then the mixed test, then three topic rows reading `%100`. Tapping any of
them replays questions the learner has now seen twice.

**Profil:** `18/18` · `2` · `146` · `%100` (Son 73 soruda). Both weak lists
have vanished, correctly.

### Verdict

**A dead end, and one that misleads by omission.**

The app's whole remaining offer is "take the same 73 questions again". It
never says the pool is exhausted, although `getItemStats()` already knows
exactly which items have been seen and the manifest already carries
`questionCount` per topic — so "you have seen all 73" is derivable today
with no new storage.

And `%100` on a bank that `docs/v1-plan.md` puts at **about 7% of the
marks on the paper this targets** is the most screenshottable number in
the app. Nobody wrote it as a proficiency claim, but at 18/18 and
"Son 73 soruda %100" with nothing else on screen, it reads as one. The
`onboarding.md` refusal of "a single proficiency number" was about a CEFR
badge; this is the same claim arrived at by arithmetic.

### Friction, ranked

1. **No end state.** Nothing acknowledges finishing and nothing points
   anywhere.
2. **`%100` stands unqualified** on a bank that covers a fraction of the
   exam.
3. **Repeats are invisible.** The engine draws unseen items first
   (`js/quiz-engine.js`, shipped in stage 0) but the learner is never told
   when there are none left, so a second full pass looks identical to a
   first.

---

## The three questions the owner asked

### Where does the flow break down for someone who has never seen the app?

**It does not — the first run is genuinely good.** Two taps to an answered
question, one obvious action, the purpose named, the privacy fact stated,
nothing between the link and a lesson. That is better than the brief
expected to find, and it should be defended.

It breaks down on **the second screen after the first tap**, three
different ways:

- **In the lesson**, where a 54%-probability duplicate question means half
  of all first lessons show the learner the same item twice, the second
  time with its answer three blocks above it.
- **At 320**, where the first thing they can tap is below the fold.
- **On the way back**, because the welcome card that did all that work is
  destroyed by their first test and replaced by a progress bar reading
  zero. The app's best screen is the one it shows exactly once.

### What should the screen do differently for someone coming back?

**Keep exactly one card at the top of Eğitim, always, and let its content
be a function of what the app knows.** Today there are three mutually
exclusive branches (welcome / resume / re-entry) and a bare progress line
for everyone who falls through, which is most returners.

Five states, one surface, one primary action each:

**1 · Untouched** — today's `renderWelcome`, unchanged.

**2 · Has test history, no lesson finished** (Journey 2a, Journey 4):

> **Sıradaki adım**
> Son testlerinde en çok **Present Perfect vs Past Simple** sorularında
> zorlandın. Bu dersi okumak, aynı soruları tekrar çözmekten daha çok
> işine yarar.
>
> [ Bu dersi aç ]
> 18 dersten 0 tanesi tamamlandı.

Tap: `openLessonByHash(lessonId(topicId, category))` for
`getWeakCategories()[0]`. Fall back to the first unread lesson when the
weak list is empty. The progress line moves *below* the button, as a fact
rather than a headline.

**3 · Recent, with a part-read lesson** — today's `renderResumeCard`,
unchanged.

**4 · Away** (`getLastActivity()` older than `RE_ENTRY_DAYS`) — today's
`renderReEntryCard`, **ungated from `resumable`**. When there is a
part-read lesson, exactly what it renders today. When there is not:

> **Kaldığın yer**
> 18 dersten 6'sı tamamlandı.
>
> [ Önce 5 soruyla hatırla ]
> [ Sıradaki derse geç ]  ·  Perfect Aspects: Simple vs Continuous vs Been/Gone
>
> Passive Voice konusuna yeni sorular eklendi.

The primary is unchanged — `startCategoryPractice(getWeakCategories()[0]
?.category ?? …, 5)`, falling back to `startMixedTest(5)` — because
retrieval is the right re-entry and the existing button already does it.
The secondary opens the first unread lesson. The news line is
`newContentNote(lessons)`, read before the buttons render, exactly as
today.

**5 · Everything read, and every question seen:**

> **Dersleri bitirdin**
> 18 dersin hepsini okudun ve bankadaki 73 sorunun hepsini gördün.
> Buradan sonrası tekrar — gördüğün bir soruyu yeniden çözmek, ilk
> seferki kadar öğretmez.
>
> [ Karışık testle tekrar et ]
>
> Bu uygulama sınavın tamamını kapsamıyor: okuma parçaları, yeniden
> ifade ve boşluk doldurma bölümleri burada yok.

"Every question seen" is `Object.keys(getItemStats()).length >= Σ
manifest.topics[].questionCount` — derivable today, no new storage. The
last line is the honest counterweight to `%100`, and it is a fact about
the app rather than a verdict on the learner.

**None of this locks anything.** Every lesson row stays open and in the
same order; the card is a suggestion above a list you can ignore, which is
what `docs/education-notes.md` settled ("no locking, at any level") and
what `practice-modes.md` §11 refuses under "unlock progression". A
recommendation is not a gate.

### Is there anything that reads as a dead end, a guilt trip, or a number that means nothing?

**Guilt trips: none.** The project's refusals have held. There is no
streak, no daily target, no minutes goal, no notification, no number that
only goes up, nothing that reports a state the learner has failed. The
re-entry card never counts the days. The mistake-book copy explicitly
pre-empts the "my list is growing" reading. Checked deliberately and found
clean.

The one thing worth watching: **the mistake-book count rises with
failure** — 58 of 73 for the Journey 4 learner. It survives the test
because it is a work queue that can reach zero, and because the card says
so in its own second sentence. It would stop surviving the moment it
appeared as a badge, in the header, or anywhere the learner had not chosen
to look at it.

**Dead ends: three.**

1. **Journey 5.** No end state, no acknowledgement, nothing offered but a
   replay.
2. **`Çık` mid-quiz.** Five answered questions vanish, and the learner
   lands on the screen for someone who has never used the app.
3. **The Eğitim index for a test-only learner.** Everything the app knows
   is on two other screens.

**Numbers that mean nothing: five.**

| | Where | Why |
| --- | --- | --- |
| `Yeni` on all three topics | `renderTopicRow`, `js/home.js:281` | `getSeenVersion` is 0 for a fresh store, so "new" marks everything on the one screen where everything is new — and then all three are consumed by the first mixed test |
| `0/1` category rows | `renderBreakdown`, `js/results.js:61` | The results screen applies **no** evidence threshold. A 10-question mixed test produced **nine** rows, seven of them `0/1` or `1/1`, sorted worst-first so they read as a ranking. `home.js` and `profile.js` both gate on `MIN_ITEMS_FOR_WEAK_ENTRY = 3`; results does not |
| `18 dersten 0 tanesi tamamlandı` | `renderProgressSummary`, `js/education.js:123` | A bar at zero, shown to a learner who has done work the bar cannot represent |
| `%0` / `%26` topic chips | `getTopicAccuracy`, `js/storage.js:280` | Lifetime accuracy on ≥3 items, rendered as a bare `%` beside the button that starts that topic's test |
| `Son 73 soruda %100` | `getOverallStats` window | Correct arithmetic; the window label naming the entire bank makes a lifetime claim out of a windowed statistic |

And one **inconsistency of meaning**: Profil's headline `%` is a
40-question window, while the Test tab's topic `%` is a lifetime average.
Two bare percentages, one screen apart, that answer different questions. A
learner who improves sees one move and the other lag, with nothing to
explain it.

---

## What has been implemented

**All nine, 2026-09-04**, plus the two decisions items 4 and 5 asked for.
Written here rather than deleting the recommendations, because what each
one cost and where it landed is the useful record.

| # | Where it landed | Deviation |
| --- | --- | --- |
| 1 | `js/education.js` — one `takeChecks` closure threaded through the pretest | none |
| 2 | `markSeen` moved from `js/quiz-launch.js` to `js/results.js`; `> 0` guard in `renderTopicRow` | marking moved for **every** mode including `startTopicTest`, so there is one rule in one place rather than two that agree |
| 3 | `away` lifted out of `if (resumable)`, and `renderReEntryCard` given the no-resumable branch | the heading stays "Kısa bir hatırlatma", not "Kaldığın yer" — there is no place this learner left off, and the card should not invent one |
| 4 | `Çık` → `Bitir` at one answer, routing to `results.html` with the answered prefix; the dialog and its markup deleted | none |
| 5 | `renderBreakdown` hedge under the heading | applied to the **topic** breakdown as well as the category one: both are sorted worst-first, so both read as a ranking |
| 6 | `renderNextStepCard` and `renderAllDoneCard` in `js/education.js`; `renderIndex` now picks exactly one card | none |
| 7 | `at: Date.now()` on both writers, `getLastActivity` reads it, `mergeLessonProgress` maxes it | none |
| 8 | `renderMixedTest({primary})`; three card bodies cut to one sentence | the fold cost is unchanged and still stated as unsolved |
| 9 | `TOPIC_ACCURACY_WINDOW = 20`, whole attempts, floor not cap | windowed over `topicBreakdown` rather than the question list, so a history recorded before questions carried topic ids still counts |

**The two decisions, taken and recorded.** "Çözülen test" now counts an
abandoned session as a test, because it is a count of what happened
rather than a target — and the alternative buys a tidier number with a
special case. And state 5's closing sentence **names** the missing
sections, from the manifest rather than from a hardcoded list: the day
`closest-meaning` shipped, every sentence naming it as missing became a
lie about the app the learner was holding, and `uncoveredSections()` in
`js/topics.js` is now the single answer that both this card and Profil's
coverage paragraph read.

Open question 3 answered by the implementation: `renderProgressSummary`
survives as the fallback when there is no card to show — reachable only
by running out of both suggestions and lessons — and is otherwise folded
into whichever card is showing.

Verified by 1051 harness checks at 320/390/768/1280, including six index
states and a section on what each number on screen means.

---

## Recommendations, ranked by value per unit of work

Sizes assume no new dependencies, no build step, and no `innerHTML`.

### 1 · Share one check pool with the pretest — **~5 lines**

`js/education.js:959` calls `takeChecks(lesson)()` independently of the
`takeChecks(lesson)` at `:768`. Thread one closure through
`renderLesson` → `renderPretestBlock` so the pretest consumes from the
same shuffle the `check` blocks draw from. Kills a defect that fires on
54% of first lesson opens.

*No schema change. Add one assertion to `tools/verify-ui.mjs`: open a
lesson and check that no two visible question stems on the page are
identical — it is a one-line DOM query on a screen the sweep already
visits.*

### 2 · Mark a topic seen when its questions are delivered — **~10 lines**

Move `markSeen` out of `startMixedTest` / `startCategoryPractice` /
`startMistakeBook` (`js/quiz-launch.js`) and into `js/results.js`, where
the attempt is recorded and `attempt.topicBreakdown` names exactly the
topics the learner actually met. `startTopicTest` can keep marking at
launch — it is already correct.

Then suppress the badge entirely on a first run: in `renderTopicRow`, show
"Yeni" only when `getSeenVersion(topicId) > 0`. A learner with no seen
versions has no baseline for "new" to be relative to. This is the same
`> 0` guard `newContentNote` already applies.

*No schema change. Restores a shipped feature that currently destroys
itself on the learner's first tap.*

### 3 · Ungate the re-entry card — **~25 lines**

Lift `const away = …` out of the `if (resumable)` block in `renderIndex`
(`js/education.js:351`). Then:

- `away && resumable` → today's `renderReEntryCard`, unchanged.
- `away && !resumable` → the same card with the state-4 body above:
  progress line, `Önce 5 soruyla hatırla` primary, `Sıradaki derse geç`
  secondary pointing at the first unread lesson, news line unchanged.
- `!away && resumable` → today's `renderResumeCard`.
- otherwise → today's `renderProgressSummary`.

*No schema change. `getLastActivity()` and `RE_ENTRY_DAYS` already exist
and are already correct.*

### 4 · Stop `Çık` from destroying answered questions — **~20 lines**

The cheapest correct fix reuses the recording path that already exists:
when at least one question has been answered, **the exit control routes to
`results.html` with the partial session** instead of to `index.html`, and
its label changes from `Çık` to `Bitir`. `results.js` records the attempt
through `recordAttempt` exactly as it does for a completed test — a
five-question session is a five-question session. With no answers, it
still goes straight to `index.html` as today.

That removes the need for a confirmation dialog entirely, and the learner
gets what they earned: a score, a breakdown, and their wrong answers in
the Yanlış defteri.

**Storage semantics change, and it needs to be a decision:** Profil's
"Çözülen test" counter would begin counting abandoned sessions. That is
still a count of what happened rather than a target
(`onboarding.md` §3's line), but it is a change in what the number means
and the owner should agree to it. The alternative — recording the attempt
but excluding short ones from `testsCompleted` — buys a tidier number for
a special case in `getOverallStats`, and I would not.

*No schema change; an attempt with five `questions` entries is already a
valid attempt.*

### 5 · One qualifier on the results breakdown — **1 conditional string**

In `renderBreakdown` (`js/results.js:61`), when
`Math.max(...totals) < MIN_ITEMS_FOR_WEAK_ENTRY`, append a `t-meta` line
under the heading:

> Bu testte her kategoriden bir-iki soru çıktı; bu bir sıralama, bir
> sonuç değil.

Do **not** drop the rows — a learner is entitled to see their own test
broken down. Drop the claim, not the data. This is the same hedge
`renderWeakSpots` already carries ("Şimdilik az veriyle sıralandı") and
the same reasoning as `wilsonUpper` in `js/storage.js:306`.

### 6 · The next-step card on Eğitim — **~60 lines plus copy**

States 2 and 5 from the answer above. This is the largest item here and it
is what Journeys 2a, 4 and 5 are all actually asking for: one card, at the
top of the landing screen, that is never absent and never a zero.

It reuses everything — `surface` + `stack`, the §7.1 heterogeneous case
that `renderWelcome` and `renderReEntryCard` already are; `getWeakCategories()`
for state 2; `getItemStats()` and the manifest's `questionCount` for state
5's "hepsini gördün"; `lessonId()` for the tap.

*No schema change, no storage change.*

**Three lines it must not cross**, all of them already decided elsewhere:
it suggests and never locks; it names no proficiency level; and state 5's
closing sentence is a fact about the app's coverage, never a claim about
the learner's readiness.

### 7 · A timestamp on lesson progress — **1 field · storage change**

`recordLessonRead` stores `{read, done}`. Adding `at: Date.now()` makes
`getLastActivity()` answerable for a learner who has only ever read
lessons — today they can never trigger re-entry, however long they are
away. `getAllLessonProgress`'s existing normalisation absorbs it and old
records simply read as unknown, the way `clampRead` already handles a
missing value.

**This is the one storage change in this document.** `onboarding.md` §8
proposed it; stage 0's "needed no new field at all" note refers to
per-*question* last-seen, which is derivable from `attempt.date`, and does
not cover this case. It also needs one line in `js/backup.js`'s merge —
`max(at)` alongside the existing `max(read)`.

### 8 · One filled button per screen, and trim the Test tab — **~10 lines**

Demote `Teste başla` to `btn--secondary` when the Yanlış defteri card is
present; the mistake book is the better mode and the practice research
ranked it first, so it should be the one that is filled. That satisfies
§7.2 ("three levels, one filled per screen").

Then cut each card's body to one sentence. Measured saving is roughly
200px, which brings `Teste başla` from 826 to ~626 at 320×640 — **still
below the 580 fold.** Say that plainly rather than claiming the fix: with
three stacked modes and a 580px scroll region, the third one is below the
fold and copy cannot change that. It is a real cost and a small one, and
the honest response is to stop pretending the trim solves it.

### 9 · Reconcile the two percentages — **~5 lines**

Either window `getTopicAccuracy` the way `getOverallStats` windows the
headline, or label the topic chip so it says which question it answers.
Windowing is the better answer — a learner who has improved should see the
chip move — and it costs one loop.

---

## What needs a decision, not an implementation

- **The dev note.** Still the first thing a stranger reads, still keyed
  separately (`englishPrep.devNoteDismissed`), still a one-line retirement.
  `onboarding.md` asked; it is still open, and it now also costs 48px of
  the 320 fold.
- **Whether "Çözülen test" may count abandoned sessions** (item 4).
- **Whether state 5's coverage sentence names the missing sections.**
  Naming them ("okuma parçaları, yeniden ifade, boşluk doldurma") is
  accurate against `docs/exam-spec.md` and reads as a roadmap promise. Not
  naming them leaves `%100` unqualified. I would name them; it is the
  owner's call.

## What I would refuse

- **A "you're ready" or "hazırsın" message at 18/18.** The bank is ~7% of
  the paper. State 5's copy is deliberately a statement about the app.
- **Telling the returner how long they were away.** `onboarding.md` §6,
  and the shipped card already obeys it.
- **Any badge, counter or chip made out of the mistake-book count.** It
  works because the learner chooses to look at it.
- **Ordering, greying or marking the lesson rows by weakness.** It is the
  obvious way to put diagnosis on the Eğitim index and it turns an open
  list into a scoreboard of eighteen rows. The card carries the
  suggestion; the list stays a list.
- **A confirmation dialog on `Çık` as the fix.** A dialog makes the loss
  loud instead of silent. Recording the work makes it not a loss.
- **Anything that reopens the navigation.** Two destinations, Profil in
  the header. Nothing in this document needs a third tab; every proposal
  above lands on a screen that already exists.

## Open questions

1. **Is the Yanlış defteri the right thing to surface on Eğitim for a
   returner?** State 4's primary is currently `Önce 5 soruyla hatırla`
   (category practice), which is what the shipped card does. The mistake
   book may be the better five questions. It is a one-line change to the
   handler and I do not have evidence to choose between them.
2. **How long is "everything seen"?** State 5 fires on
   `seen ≥ 73`. If the bank grows to 300, "hepsini gördün" is a state
   almost nobody reaches, and state 5 quietly stops existing. That is
   fine, but it means the dead end is fixed by content and the card is a
   stopgap — worth knowing before spending 60 lines on it.
3. **Should `renderProgressSummary` survive at all?** Every state above
   folds the "18 dersten N tanesi" line into a card as a secondary fact.
   If states 1–5 cover everything, the bare summary has no remaining
   caller.
