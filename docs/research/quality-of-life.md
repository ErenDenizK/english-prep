# Quality of life, with five days left

What to change tonight so that five days of daily phone revision are
measurably better for one motivated user who already knows the app —
and what to leave alone.

Written 2026-09-04, against `bfab674`, on the day the exam date stopped
being unknown. The owner sits YTÜ's İYS in **five days** and starts using
the app daily tomorrow (2026-09-05).

The bar every candidate below is held to: **would this change what
happens on day 2 of 5, on a phone, for someone who has already read the
lessons?** Anything whose payoff arrives in a month is named and dropped.

---

## The short version

**1 · The single most useful thing tonight is a number picker on
`Yanlış defteri`.** Not because a picker is interesting, but because
without it the mistake book stops being usable exactly when it becomes
valuable. Simulated against the real engine (§1): at twenty questions a
day the book holds **24 items by day 4 and 30 by day 5**, and
`startMistakeBook` is hard-coded to `count = "all"`
(`js/quiz-launch.js:69`). A thirty-question forced session at eleven at
night is the session he skips.

**2 · And it is not a convenience. It is the difference between the
mistake book working and not working.** With no bounded book run,
**zero items graduate in five days** — the book only grows, exactly as
`the-last-week.md:474-499` predicted. With a ten-item book run each day,
**eleven graduate by day 5** and the book stabilises. `the-last-week.md`
concluded from this that the *copy* promising graduation should change.
The simulation says the opposite: the promise is keepable, and the fix is
to make it keepable rather than to weaken it.

**3 · The app's flagship diagnostic will not exist for the first two
days.** `getWeakCategories()` needs three distinct answered items in a
category (`js/storage.js:37,426`). Measured over 200 simulated runs at
twenty questions a day: **0.1 rows on day 1, 1.0 on day 2, 2.8 on day 3,
10.9 on day 5** — and `confident` is **false on every category on every
day of every run**, because it needs six items against a corpus of four
(`js/storage.js:40,424`). For the first half of this week the honest
answer to "what does the app know about him" is *almost nothing, and the
mistake book is the only diagnostic that works from the first wrong
answer*.

**4 · `Sınav haftası`, the one bit, should not be built.** It is costed
at ~8 hours (`docs/audit/next.md:663`) and specified at
`the-last-week.md:594-620`. Two of its three effects are refused below on
evidence (§5) and the third — one honest note — is true in every week and
therefore needs no toggle at all. That is eight hours released.

**5 · The app's own coverage numbers now disagree with each other by
four times, and both are on the honesty layer.** `docs/exam-spec.md:147`
says the app covers **~7 of ~100 points**; that table was written when
three topics shipped. Against the current manifest it is roughly
**22–25 of ~100** (§5.1). Meanwhile `js/profile.js:299-301` tells the
learner on screen that the app practises the cloze section *(15 puan)*
and the restatement section *(15 puan)*, which reads as 30. One number is
3× low, the other is ~1.3× high, and the true one is in between. Fixing
this is thirty minutes and it is a v1 criterion, not a nicety
(`docs/roadmap.md`, criterion 3).

---

## 0 · What I could verify, and how

**Egress, unchanged.** Every arm of this project has hit the same wall and
so did I: `onlinelibrary.wiley.com` and `www.retrievalpractice.org` both
returned `EGRESS_BLOCKED`. The one external claim I lean on that is not
already sourced in this repository — successive relearning — rests on
**search-result summaries only** and is labelled as such where it appears
(§5.3). I did not fetch a paper tonight and nothing below should be read
as though I had.

**Everything else here is measured against this repository.** The numbers
in §1 come from running `buildQuizSession` from `js/quiz-engine.js` over
the real `data/` corpus, with the real thresholds from `js/storage.js`,
200 trials per condition. The scripts are throwaway and the parameters are
stated inline so the results can be disagreed with rather than trusted.
Every file reference carries a line number.

**What the simulation assumes**, so it can be argued with: 193 questions,
48 categories, unseen-first draw, a fixed per-item accuracy of 70% (60%
in one condition), and — in §1.2 only — a +15% bonus per prior exposure to
an item, standing in for "he has just read the explanation". The accuracy
figure is a guess. The *shapes* are not: they follow from the corpus size,
from four items per category, and from the thresholds in the code.

---

## 1 · What five days of this app actually look like

### 1.1 Mixed test only, no mistake-book runs

Mean of 200 runs, one mixed test per day, unseen-first:

| | day 1 | day 2 | day 3 | day 4 | day 5 |
| --- | --- | --- | --- | --- | --- |
| **10 q/day, 70%** — questions seen | 10 | 20 | 30 | 40 | 50 |
| weak-spot rows | 0.0 | 0.1 | 0.3 | 0.9 | 1.8 |
| mistake book | 3.1 | 6.1 | 9.2 | 12.0 | 15.1 |
| **20 q/day, 70%** — questions seen | 20 | 40 | 60 | 80 | 100 |
| weak-spot rows | 0.1 | 1.0 | 2.8 | 6.1 | **10.9** |
| mistake book | 6.1 | 11.9 | 17.7 | **23.6** | **29.6** |
| **20 q/day, 60%** — mistake book | 8.1 | 16.4 | 24.4 | 32.3 | **40.4** |

`confident` categories: **0.0 in every cell.** Not "few" — zero, in all
600 runs, on every day. `MIN_ITEMS_FOR_WEAK_CLAIM = 6` against four items
per category (`js/storage.js:40`) makes the confident branch unreachable
by construction, which `js/home.js:203-208` already says in a comment and
`docs/audit/next.md:367-392` already proved for a month of data. This
week does not change it and neither will any week.

Three things fall straight out of that table.

**The bank does not empty.** `docs/audit/next.md:341-366` measured
exhaustion at around 2026-09-14 for a 20-a-day user. That is five days
*after* the exam. So the "he runs out of unseen questions" risk, which
drove a whole horizon in last night's audit, **does not arrive inside this
window**. Everything downstream of it — shipping the vocabulary drafts to
buy three more days of unseen items, the all-done card, item memory
polluting `correct` — is a post-exam problem. That is one fewer thing to
worry about tonight, and it is worth saying out loud because it was ranked
first in horizon 2 twelve hours ago.

**`En çok zorlandıkların` is a day-4 feature.** On the two days he is most
likely to be forming a habit with the app, the Test tab's second block
does not render at all (`js/home.js:190-192` returns null on an empty
list). The Test tab on day 2 is: the mistake book card, the mixed test
card, eight topic rows. That is fine — but it means any tuning of the
weak-spot list is tuning something he will not see until Thursday.

**The mistake book is the only thing that works from the first wrong
answer.** It has no threshold, it fills from attempt one, and it is
already correctly placed above the mixed test and correctly takes the
filled button when non-empty (`js/home.js:359-364`). The app's whole
five-day value concentrates in a card that cannot currently be run in a
bounded session.

### 1.2 What happens when the book is actually drilled

Same simulation, plus a mistake-book run each day, and a +15% accuracy
bonus per prior exposure to an item:

| | day 1 | day 2 | day 3 | day 4 | day 5 |
| --- | --- | --- | --- | --- | --- |
| **20 mixed, no book run** — pending | 6.4 | 12.5 | 18.4 | 24.4 | 30.5 |
| graduated | 0.0 | 0.0 | 0.0 | 0.0 | **0.0** |
| **20 mixed + 10 book** — pending | 5.9 | 8.4 | 11.9 | 15.0 | 18.4 |
| graduated | 0.0 | 3.0 | 5.7 | 8.5 | **11.2** |
| **10 mixed + 10 book** — pending | 2.9 | 3.5 | 3.7 | 3.8 | **3.9** |
| graduated | 0.0 | 2.3 | 5.0 | 8.0 | **10.9** |

This is the finding I would build tonight on.

`the-last-week.md:474-499` says the graduation rule *"cannot be satisfied
in six days"* and that the book *"only grows, for everyone"*. Row 1 of
that table is exactly that claim, confirmed. Rows 2 and 3 are the case it
did not model: **the learner running the book.** `MISTAKE_BOOK_GRADUATION
= 2` on two separate days (`js/storage.js:198`) is satisfiable from day 2
onward, and at ten book items a day the pending count stops growing
entirely.

So the recommendation inverts. `the-last-week.md` proposed changing the
Turkish so it stops promising a graduation the calendar cannot deliver.
The calendar can deliver it. What cannot deliver it is a card whose only
action is a 30-question session. **Fix the session length, keep the
promise, and the copy needs no apology.**

One more thing the engine already gets right and nobody has said: inside a
mistakes-only pool every item is tier 1 or tier 2, so `orderForPractice`
falls through to *least recently seen first* (`js/quiz-engine.js:58-60`).
A bounded book run therefore draws the ten items he has gone longest
without re-meeting — which is the successive-relearning schedule, for
free. The count control needs no selection logic behind it.

---

## 2 · The candidates, ranked and costed

Hours are supervisor hours on the audit's convention: the change, a unit
test where the logic is testable, and a `tools/verify-ui.mjs` assertion
where a screen changes. "Day 2" is what a learner notices on the second
of five days.

### 2.1 A count for `Yanlış defteri` — **1h**

`js/home.js:112-117` → `js/quiz-launch.js:69` (`count = "all"`).

**What it changes on day 2.** Nothing — the book holds six items and
"all" is right. **On day 4 it changes everything**: 24 items, one button,
no way to do ten of them. §1.2 shows the bounded run is also the only
thing that makes the graduation rule fire.

**Where it goes.** The same `cluster cluster--spread` row the mixed test
uses (`js/home.js:148-154`), inside the existing mistake-book surface,
between the intro paragraph and the button. `createListbox` mints its own
instance id (`js/listbox.js:30`), so two on one screen is safe; the label
needs its own id, since `mixed-count-label` is taken (`js/home.js:150`).
Default `10`, options `10 / 20 / Tümü` — not `5`, because a five-item book
run is shorter than the book on day 1.

**§7.2.** No new button. The card's filled `Yanlış çalış` stays the
screen's one filled control (`docs/design-system.md:561`), and the Test
tab's primary already moves between the two cards depending on whether the
book is empty (`js/home.js:364`).

**What could go wrong.** The card's copy names the count —
*"Yanlış yaptığın 60 soru burada"* — and now a session may be shorter than
that number. The sentence has to say both: the book holds N, this run
takes ten. Cheap, but it is copy and it is the honesty layer.

**Audit provenance.** `docs/audit/product.md:541-556`, ranked item 17
("before the next content round") and dated *"week two of daily use"*.
§1.1 dates it day 3–4. That is the only reason it moves to the top of this
list.

### 2.2 `Yeni test` stops replaying the set just drilled — **30m**

`js/session-state.js:33` (`clearQuizState`, exported, never imported) →
`js/results.js:268`.

**Reproduced by the audit** (`docs/audit/product.md:334-351`): finish a
mistake-book session, tap the results screen's filled `Yeni test`, and the
frozen `ids` list in `sessionStorage` re-runs the identical questions —
including the ones that graduated on the way through.

**Day 2.** He will run the book, get to results, and the one filled button
on that screen will lie to him. **This is the mode he will use most this
week**, so a defect on its exit path fires daily. Either clear the request
after a mistakes session or recompute the ids in `quiz.js` when
`mode === "mistakes"`; the second is better, because it makes "Yeni test"
mean "the book as it stands now".

**Risk.** Recomputing on `quiz.html` means the count the learner was shown
on the card and the set they get can differ — which is the exact thing
`js/quiz-launch.js:61-66` passes `ids` to prevent. So: recompute only on
the results-screen re-entry, not on the first run.

### 2.3 The mistake book, reachable from where mistakes are made — **45m**

Today `Yanlış defteri` exists on exactly one screen: the Test tab
(`js/home.js:359-362`). From the results screen — the one place in the app
where a learner is looking at their own wrong answers — reaching it is
`Ana sayfa` → the Test tab → the card. Three navigations, and the first
lands on Eğitim, not Test.

**Where it goes.** Not in the action bar. The bar has two slots at 320px
and both are spoken for (`js/results.js:264-269`), and adding a third
would either break the one-filled-button rule or take away the only route
home from a focused-mode screen with no nav.

Instead: **a Row, in the content, immediately below the category
breakdown and above `İnceleme`** — the same `row` primitive as the Test
tab's weak spots (`js/home.js:221-241`), a `target` icon in the lead, the
pending count in the trail. Rendered only when `getMistakeBook().length >
0`. `recordAttempt` has already run by then (`js/results.js:216`), so the
count includes the test just finished.

**Day 2.** After his first test with wrong answers, the highest-value next
action is one tap instead of three, at the moment he is looking at the
reason to take it.

**What could go wrong.** The results screen has **no height budget** in
the sweep (`docs/audit/product.md:513-521`); one row is ~64px and the
screen is already long by nature. And it duplicates a card that exists on
another screen — which is the correct kind of duplication (one action, two
entry points) rather than the kind `docs/audit/product.md:370-398` warns
about (two implementations disagreeing about what a row says), *provided*
it reuses the row primitive and the launcher rather than re-deriving
anything.

### 2.4 The next-step card stops recommending a lesson he has read — **45m**

`js/education.js:367-412`.

`renderNextStepCard` picks the weakest category's lesson and says:
*"Son testlerinde en çok bu sorularda zorlandın. Dersi okumak, aynı
soruları tekrar çözmekten daha çok işine yarar."* It never checks
`progress[target.id].done`.

Follow the calendar. Weak categories do not exist until day 3 (§1.1). By
day 3 he has read most of the 48 lessons. **So the card's advice becomes
wrong at exactly the moment the card starts working**: it will tell him to
re-read a lesson he finished on day 1, which is the archetypal low-yield
last-week activity (`the-last-week.md:500-511`, and §1.3's overlearning
null behind it). The exception that document draws is precise and the code
does not implement it: *"a lesson **never** read in a category the learner
is losing marks on — that is instruction, not restudy"*.

**The fix is one conditional and one string.** Where the weak lesson is
unread, the card is unchanged. Where it is `done`, the primary becomes
category practice (`startCategoryPractice`, already imported by
`js/education.js`) and the copy says the true thing: you have read this
one, the useful move now is to answer.

**Day 2.** Nothing. **Day 3–5.** The Eğitim tab — the app's default view —
stops giving the one piece of advice this horizon most clearly refuses.

**What could go wrong.** It puts a second route into category practice on
a screen whose job is reading, and `docs/research/user-flow.md:818-822`
refuses "ordering, greying or marking the lesson rows by weakness". This
is not that: it changes one card's action, not the list.

### 2.5 Reconcile the coverage number — **30m**, most of it documentation

`docs/exam-spec.md:147` says **~7 of ~100**. That table predates five
topics. Against the current manifest (§5.1) it is roughly **22–25**.
`the-last-week.md:78,519` argues from the 7 and calls it "the finding that
outranks all five"; `docs/roadmap.md` cites the same table.

Meanwhile `js/profile.js:299-301` tells the learner the app practises
"paragraf içindeki dilbilgisi ve kelime boşlukları (15 puan) ve anlamca en
yakın cümle (15 puan)" — two section point-totals in a sentence about what
the app covers, which reads as 30 of 60. It covers seven of the cloze's
ten blank types (`docs/roadmap.md`), not the section.

Both numbers are on the honesty layer, they disagree by four times, and
one of them is on a screen. The doc half is free; the screen half is one
qualifier. **This is the only change on this list that a learner other
than the owner is likely to be harmed by, because his four friends will
read that sentence and plan a week around it.**

### 2.6 The three true sentences, in Profil — **45m**, all Turkish

`the-last-week.md:500-529` lists five wording changes. Three of them do
not need any feature, any toggle, or any state:

1. **Answer rather than re-read.** Strongest at this horizon.
2. **Mixed rather than by topic.** Already the app's position and already
   well said on the mixed-test card (`js/home.js:138-145`); it needs
   nothing.
3. **This app is a small part of your paper.** Already on screen
   (`js/profile.js:293-325`) — this is the §2.5 correction, not a new
   sentence.

So the genuinely missing one is (1), plus the honest allocation: what to
do with the hours the app is *not* getting. Its home is the existing
"Sınavın hangi kısmı burada" block in Profil, which is already the screen
where the app discusses itself, is opt-in, and taxes no arrival.

**Day 2.** For the owner, near zero — he wrote the research. For the four
friends, this is the highest-value paragraph in the app.

**The arousal-reappraisal sentence** (`the-last-week.md:763-767`, d ≈ 0.20
on cognitive written tasks) belongs here too or nowhere. It is a tone call
and it is the owner's; I would include it, once, in this block, and never
on a results screen.

### 2.7 Remember the mixed-test count — **30m**

`js/config.js:8` (`MIXED_TEST_DEFAULT_COUNT = "10"`) and
`js/home.js:169-179`, which rebuilds the listbox at that default on every
render of the Test tab. If he prefers twenty, he re-picks it on every
arrival — ten or more times across five days.

**Not a one-liner, and that is why it is here rather than higher.**
`setSetting` coerces to boolean (`js/storage.js:733`: `value === true`),
by design — *"Everything here defaults to off"*. A count is not a boolean,
so this needs either a second accessor beside `getSetting`/`setSetting` or
a widening of the settings contract. `exportState` carries the whole
settings object (`js/storage.js:753`), so a new key rides the backup for
free, but a non-boolean value in a store documented as booleans is a
schema decision, not a convenience.

**Risk.** Low, and it is a per-viewer preference rather than a number that
means anything. But it is the one item on this list where the cost is in
the wrong place: thirty minutes of storage-contract thinking to save ten
taps.

### 2.8 A test action on the topic overview — **1h**

`#egitim/konu/<id>` has been the Eğitim index's primary destination since
v0.22. `renderIntro` (`js/education.js:812-885`) renders the orientation
and the six lesson rows and **offers no way to test the topic**.
`startTopicTest` is reachable from the Test tab's topic rows
(`js/home.js:296-298`) and from the end of a lesson
(`js/education.js:1437-1443`) — so a learner who is revising a topic from
Eğitim must cross to the other tab and find the row again.

**Where it goes.** One filled `Bu konudan test çöz` beneath the lesson
rows at the foot of the screen. The topic screen has no buttons at all
today, so it would be the screen's only filled control and §7.2 is
satisfied trivially.

**Risk.** It puts a test action on the reading side of the app, and the
whole point of the topic screen is orientation. Mitigated by placing it
last, after the lessons, where the end-of-lesson card already puts the
same offer.

### 2.9 Named and not recommended

| Candidate | Source | Hours | Why not this week |
| --- | --- | --- | --- |
| `Sınav haftası`, the one bit | `the-last-week.md:594`, `audit/next.md:663` | ~8 | §5.2. Two of three effects refused, the third needs no toggle |
| "Bugün pratik" | `audit/next.md:289` | ~4 | It selects a category untouched for three or more days, inside a five-day window. The rule barely fires, and unseen-first already covers "never practised" |
| Timed restatement block | `audit/next.md:665` | ~8 | Unblocked, genuine, and a day of code. The format rehearsal that pays this week is the real paper (`the-last-week.md:416-436`) |
| `optionNotes` for tenses/modals/passive | measured tonight | 12–20 | 73 of 193 questions lack them, and they are precisely the three topics the sample cloze does not test |
| History parse cache | `audit/product.md` §4.5 | ~1 | 7 ms at a month; ~10 attempts this week |
| Height budgets, radiogroup, live regions, topic-file split | `audit/product.md` §3–5 | ~8 | Real debt. None of it is felt by one user in five days |
| "Yeni" badge on the Eğitim index | `audit/product.md:370` | ~1 | No content ships this week, so there is no news to badge |

---

## 3 · The keyboard and the phone

**The honest headline: the keyboard is finished, and he is on a phone.**

`js/quiz.js:286-319` already takes `1`–`4` to answer and `Enter` to
advance, correctly guarded — it bails on modifier keys, and it bails when
the event target is inside a `button, a, input, select, textarea`, because
`Enter` on a focused control fires natively and handling it twice used to
make the problem-report link skip the next question (`js/quiz.js:290-298`).
That guard is the part hand-rolled key handling usually gets wrong, and it
is right here.

**One free keyboard addition, and it is small.** With *Önce kendin düşün*
on, `handleKeydown` returns early (`js/quiz.js:304-306`) and `Enter` does
nothing until the options are revealed by tapping the button. Four lines
would make `Enter` press `Şıkları göster`. It costs nothing and it will be
used by nobody on a phone. Build it if the file is open; do not schedule
it.

**Everything else I considered and would not add.** `Escape` to exit —
there is no Escape key on the device this is for, and on a laptop it turns
an accidental keypress into an early finish. `Space` to advance — it is
the scroll key in a fixed-height shell. Number keys on the reader's inline
checks (`js/education.js:1146`) — same argument, and the reader is
deliberately a place you scroll, not a place you drive.

So the brief's three questions get answered on the *phone* side, not the
keyboard side:

### 3.1 A way back into the last thing studied

**Already built, and better than a "recent" list would be.** The Eğitim
index renders exactly one card, chosen by what the app knows
(`js/education.js:552-576`): a resume card when a lesson is part-read
(`renderResumeCard`, `js/education.js:159`), a next-step card otherwise
(`renderNextStepCard`, `:367`), a re-entry card after ten days
(`:288`), the all-done card at the end (`:424`). A "last opened" card
would duplicate the first and compete with the second.

The gap is not *which* lesson but *what to do with it* — which is §2.4.
That is the change to make here, not a new card.

### 3.2 An obvious repeat of a just-finished test

**Already built**, as the filled `Yeni test` on the results screen
(`js/results.js:264-269`), which re-runs the stashed request and re-rolls
the draw rather than replaying the same items. The comment says so and the
label is right.

It is **broken in exactly one mode** — mistakes — and that is §2.2. Fix
that and this question is closed. I would not add a "repeat the last test"
control anywhere else: the Test tab's mixed card *is* that control, and the
only friction in it is that it forgets the count (§2.7).

### 3.3 The mistake book, reachable from where mistakes are made

§2.3, as a Row in the results content — not in the action bar, for the
reasons given there.

**And not inside the quiz.** The feedback block after a wrong answer
(`js/feedback.js:30-79`) is the most literal reading of "where mistakes
are made", and putting a route to the mistake book in it would be a
mid-test exit dressed as help. The block already carries the one link it
should: the problem report.

**And not as a badge.** `docs/research/user-flow.md:819-820` refuses "any
badge, counter or chip made out of the mistake-book count", and it is
right for the reason it gives: the book works because the learner chooses
to look at it. The results-screen row is a choice offered once, on a
screen he has just arrived at; a nav badge is a count following him
around.

---

## 4 · What the app knows and never shows

`js/storage.js` derives more than reaches a screen. Taken one at a time,
against five days:

| Known | Where it surfaces | Verdict for this week |
| --- | --- | --- |
| `getItemStats()` — per-item seen / wrong / lastCorrect / last (`:165`) | nowhere; used for ordering and for the all-done gate | **Show nothing.** A per-item log is honest at any sample size (`audit/next.md:314-333`) and is an eight-hour screen |
| `getMistakeBook()` entries carry `category` (`:224`) | only the count is shown (`js/home.js:106`) | **The one real candidate**, and I still would not, this week — see below |
| `weakestEntries` accuracy per category (`:395`) | Test tab and Profil, top 5 | Already shown. Empty until day 3 (§1.1) |
| `confident` / the Wilson bound (`:424`) | gates the hedge string | **Never true.** Zero in 600 simulated days |
| `getTopicAccuracy` (`:328`) | Test tab topic rows only | Correctly absent from Eğitim — a lesson list that scores itself is a scoreboard |
| Seen versions / "Yeni" (`:560`) | Test tab only | Moot: no content ships this week |
| Lesson read fractions (`:654`) | index rows, resume card | Already shown |
| `getHistory()` — the attempt log (`:123`) | aggregated only | A "son testlerin" list is one step from an attendance record. **No** |
| Bank coverage — "seen 100 of 193" | nowhere | A number that only goes up. `practice-modes.md:923-929` draws the line and this falls on the wrong side |

**The one that tempts me, and the reason I still say no.** The mistake
book knows which categories its items came from. On day 4 it holds ~24
items and naming the top two or three would be a *count of his own wrong
answers* — a log, not an inference, and therefore honest at n=1 by the
argument in `docs/audit/next.md:314-333`.

But it is the weak-spot list arriving early with less evidence and a
different name, and `MIN_ITEMS_FOR_WEAK_ENTRY = 3` exists precisely to stop
the app ranking categories off one or two observations
(`js/storage.js:37,426`). Two lists on one screen, ranking the same
categories by two different rules, one of them hedged and one of them not,
is worse than one list that arrives late. **The honest answer to this
section is: nothing new, and the reason is the sample, exactly as the
brief suspected.** What the app should do with the mistake book this week
is make it *runnable* (§2.1), not make it *talk*.

---

## 5 · Five days specifically

`docs/research/the-last-week.md` is 914 lines, was written on the
assumption of seven days and three topics, and was filed as blocked on the
exam date it did not need (`audit/next.md:393-417`). Two things have
changed since: the date is known and is **five days**, and the corpus went
from 73 questions across 3 topics to **193 across 8**, including the whole
restatement section. Re-tested item by item.

### 5.1 The number the whole document turns on has moved

`the-last-week.md:78` — *"the app addresses about 7% of this paper"* —
is the finding it says "outranks all five". Recomputed against
`docs/exam-spec.md:19-30,134-147` and today's `data/manifest.json`:

| Section | Points | Then | Now |
| --- | --- | --- | --- |
| Cloze (10 blanks) | 15 | ~3.75 | **~10** — 6 blank types covered outright (discourse markers, modals ×2, causative, relative pronouns, quantifiers), comparatives partly. Uncovered: `so/such`, both vocabulary blanks |
| Closest meaning | 15 | 0 (unshipped) | **~12–15** — `closest-meaning`'s six categories are third conditional, `unless`, concession, `as…as`/correlatives, `too/enough/so…that`, passive reporting. That is very nearly the sample's own list, and modal perfects and future forms sit in `modals` and `tenses` |
| Reading | 21 | 0 | 0 |
| Paragraph completion | 9 | 0 | 0 |
| Listening | 20 | 0 | 0 |
| Writing | ~20 | 0 | 0 |
| **Total** | **~100** | **~7** | **~22–25** |

**This inverts §4.2's headline recommendation.** That plan gives the app
**11% of the study time** on the grounds that it addresses 7% of the
marks. At 22–25% of the marks the proportional allocation is **40–50
minutes of a three-hour day, not twenty**. I would still not go higher
than that: the app is a *practice* surface for two sections, and the
sections it cannot touch are 50 of the 100 points.

I am not confident to the point of a decimal, and the estimate should not
enter `exam-spec.md` as a table until the owner has looked at it — the
same standard `audit/next.md:700-708` applied to the exam date. But the
direction is not in doubt, and **two documents and one screen are
currently arguing from a number that is three times too low.**

### 5.2 `the-last-week.md` §5.1, re-tested

| | Recommendation | Status |
| --- | --- | --- |
| 1 | **Ship Closest Meaning** | **Done**, and four more topics with it (v0.24) |
| 2 | **Say what the app covers** | **Done** — `js/profile.js:293-325`. Needs the §2.5 correction |
| 3 | **`Sınav haftası`, the one bit** | **Refuse.** See below |
| 4 | **One sentence of arousal reappraisal** | **Implementable tonight**, as copy, in Profil (§2.6). Owner's tone call |

**Why the one bit falls.** It was specified as changing exactly three
things (`the-last-week.md:600-616`), and five days of measurement takes
two of them away:

- *The weak-spot ranking sorts nearest-to-mastery first.* §1.1 says the
  list has **one row on day 2 and three on day 3**. And with four items
  per category, "under mastery" means accuracy in {0, 0.25, 0.5, 0.75}, so
  "nearest to 0.8 from below" promotes **3/4 — a single wrong answer** to
  the top of the list. Metcalfe's region of proximal learning is about
  medium-difficulty items *within a learner's own judgement*, measured on
  paired associates; `the-last-week.md:400-407` already flags the transfer
  as its own inference. At n = 4 the "middle band" is not identifiable and
  the comparator flip promotes noise. **Refuse the flip; keep worst-first.**
- *The mistake-book copy stops promising graduation.* §1.2 measures the
  promise as **keepable** — 11 graduations by day 5 with a daily bounded
  run. Weakening the copy would be apologising for a rule that works.
- *One note appears with three true things.* True in every week, so it
  needs no boolean (§2.6).

Eight hours, three effects, and none of them survives contact with the
data. That is the single largest saving in this document.

### 5.3 The mechanics that do survive five days

Unchanged from `the-last-week.md` §1 and not re-argued here: retrieval
practice with elaborated feedback, interleaving, and sleep. All three are
what the app already is. Spacing is nearly spent at this range
(§1.2 there), overlearning has a direct null against it (§1.3 there), and
`orderForPractice` should not be touched (§5.2 there — *"Never, as far as
I can tell"*). I agree with all of it.

One addition, and it is **search-summary only — I could not fetch a
paper**: the mistake book's rule is *successive relearning* — retrieval
to a criterion of correct recalls, spaced across separate sessions —
which appears in summaries of Rawson, Dunlosky & Sciartelli (2013) and of
a later classroom replication in biopsychology as improving performance on
real course exams, not only on lab retention tests. If that holds, it is
the strongest available argument for the mistake book being the app's main
five-day mode and for **not** lowering its threshold. Treat it as a
reason to leave something alone rather than as a reason to build
something.

### 5.4 What §4.2's plan looks like at five days

`the-last-week.md:659-696` gives a seven-day plan. Compressed to five,
with the coverage correction from §5.1, the only changes I would make are:

- **Day 5 (tomorrow, 2026-09-05) is still the diagnostic day.** Sit
  Session I of the sample paper whole and timed, then mark it and write
  down *why* each wrong answer was wrong. `the-last-week.md:416-436` rates
  this the highest-value block of the week and nothing about losing two
  days changes that — it changes only how much of the week depends on
  doing it *today*.
- **The app's share rises from 20 minutes to 40–50** (§5.1).
- **Day 1 is unchanged**: nothing new, one short mixed test, the error
  notes, sleep.
- **The plan stays in a message, not in the app.**
  `the-last-week.md:816-823` refuses a generated day-by-day plan inside
  the app and the refusal is stronger at five days, not weaker: a plan
  rendered by software looks derived from something, and this one is
  derived from a document and a guess about his evenings.

---

## 6 · What I would refuse

**A countdown, a stored exam date, or any rendering of "five days left".**
Upheld from `the-last-week.md:552-620` and `audit/next.md:706-712`, and
explicitly *strengthened* by the date being known: this is the exact
condition under which a ticking number does the most damage. The worry
component is the one most associated with poor performance, and he already
knows what day it is.

**`Sınav haftası` as specified.** §5.2. Not a refusal of the idea — a
refusal of building an eight-hour toggle whose three effects are two
refusals and a paragraph.

**Lowering `MISTAKE_BOOK_GRADUATION`.** `the-last-week.md:797-803` refused
it on principle; §1.2 now refuses it on measurement. Eleven items graduate
by day 5 with the threshold intact. Lowering it would make a number go
down by making it mean less.

**Rewriting the mistake-book copy to stop promising graduation.** The one
recommendation in `the-last-week.md` I am reversing rather than upholding,
and §1.2 is the reason.

**An exam-weighted question draw, or a "sınavda çıkanlar" test.** This is
the most tempting thing on my own list and it is wrong. The intuition:
`tenses`, `modals` and `passive-voice` are 73 of 193 questions and the
sample cloze tests no tense and no passive, so 38% of his practice goes to
the least-rewarded content. The arithmetic that kills it: the sample
*restatement* section turns on future perfect, modal perfects and passive
reporting — which live in exactly those three topics
(`data/manifest.json`, and `docs/exam-spec.md:66-73`). Weighting the draw
would hide content on a false premise, invent a weighting nobody measured,
and break the interleaving argument the mixed test rests on.

**"Bugün pratik".** `audit/next.md:289-313` costs it at half a day and
calls it "the one genuinely unblocked feature nobody has noticed". It
selects a category last practised three or more days ago, inside a
five-day window, for a learner who will have touched most categories once.
It is a good feature for October.

**Any "you have not studied today" prompt, badge, red dot or sentence.**
Upheld verbatim from `practice-modes.md:903` and
`the-last-week.md:790-796`. A deadline is not a licence for manufactured
urgency, and the backup nudge (`js/education.js:602-625`) stays the one
thing in the app that looks adjacent to this, because it fires on a
property of the data and dismisses for ever.

**A readiness claim, a "hazırsın", or any reading of a percentage as
preparedness.** `user-flow.md:815-817`. At 22–25% coverage this is more
dangerous now than it was at 7%, not less: the app is good enough at what
it covers that a high score there is *more* likely to be mistaken for a
verdict on Friday.

**A "sınav modu" that re-runs the whole pool.** `the-last-week.md:805-812`
and the direct overlearning null behind it. §1.1 adds a second reason: he
will not have seen the whole pool, so a full re-run would spend the week
re-measuring 100 items he already met instead of meeting the 93 he has not.

**Writing or shipping any new question this week.** Upheld verbatim
(`the-last-week.md:825-835`, `audit/next.md:759`). Including — and this is
the version most likely to be attempted tonight — the 219 missing
`optionNotes` on `tenses`, `modals` and `passive-voice` (measured: 120 of
193 questions carry notes; those three topics carry none). A gloss is
lower-risk than an item, and it is still unreviewed content landing in
`data/` four days before the exam, on the three topics the paper rewards
least.

**A per-question or per-section timer, in any form.** Unchanged.

**Anything that reopens the two-tab navigation, adds a third tab, or moves
Profil.** Nothing above needs it; every proposal lands on a screen that
already exists.

**An install prompt on the back of the service worker.** On iOS, Add to
Home Screen moves the app into a separate storage container and destroys
the progress on the way (`js/backup.js:1-16`). Four days before the exam
is the worst possible week to invite it. The backup nudge is the honest
version and it already ships.

### And three things a well-meaning assistant might build tonight

Named because deadline pressure makes each of them feel obviously right.

1. **A five-day plan screen.** It would look derived from a model, it
   would be derived from a guess, and it would be one more thing to
   maintain on a screen the learner did not ask for. §5.4.
2. **A "your weakest categories, act now" push on arrival.** The list has
   one row on day 2 (§1.1), never reaches `confident`, and putting it in
   front of him on arrival taxes every arrival — which this project
   refuses on principle and `docs/audit/product.md` measured the cost of
   when it retired the dev banner.
3. **Making a big change to `orderForPractice` "because the exam is
   close".** It is the one piece of the learning model that is right at
   every horizon, both prior arms say so, and a subtle regression in it
   four days out would be invisible to `npm run check`, invisible to
   `npm run verify`, and unrecoverable.

---

## 7 · Ranked recommendation

Ordered so the first item is the one to build first. Hours are supervisor
hours including a test and a sweep assertion.

| # | Work | § | Hours | Why here |
| --- | --- | --- | --- | --- |
| 1 | **A count listbox on `Yanlış defteri`** | 2.1 | 1h | The book reaches 24 items by day 4 and is all-or-nothing. Measured: without a bounded run, **zero items graduate in five days**; with one, eleven do |
| 2 | **`Yeni test` stops replaying a mistakes set** | 2.2 | 30m | Same code path, same sitting. It is a reproduced defect on the exit of the mode this week runs on |
| 3 | **`Yanlış defteri` row on the results screen** | 2.3 | 45m | Puts the week's best mode one tap from where its reason is visible. A Row in the content, not a third button in the bar |
| 4 | **Next-step card: practise, don't re-read, when the lesson is done** | 2.4 | 45m | The Eğitim card starts giving last-week-wrong advice on day 3, which is exactly when it starts appearing |
| 5 | **Reconcile the coverage number** (`exam-spec.md`, `the-last-week.md`, `renderCoverage`) | 2.5, 5.1 | 30m | Two documents and one screen disagree by 4×. His friends will plan a week from the screen |
| 6 | **The honest note in Profil** — answer rather than re-read; the allocation; optionally the reappraisal sentence | 2.6 | 45m | Copy only. Low value to the owner, high to the other four |
| 7 | **Remember the mixed-test count** | 2.7 | 30m | Ten taps saved, but it needs a non-boolean setting; do it last or not at all |
| 8 | **A test action on the topic overview** | 2.8 | 1h | Closes the one launcher that is reachable from one tab and not the other |

**Shipped in v0.27 (2026-09-04): items 1–4**, with three sweep sections
covering them. Item 5 is next; 6–8 stand as written.

**Stop after 4.** Items 1–4 are **three hours**, they are the whole of the
day-2-through-day-5 payoff, and each one is a change to a screen that
already exists rather than a screen that does not. 5 and 6 are honesty
work and should be done if the evening is longer than the code. 7 and 8
are genuine and would be the first things to cut.

**Not tonight, and not this week:** `Sınav haftası` (§5.2), "Bugün
pratik", the timed restatement block, `optionNotes` for the three oldest
topics, the parse cache, the height budgets, the radiogroup, the
topic-file split, and any new content. Every one of them is real work with
a real case; none of it changes what happens on a phone between tomorrow
and Tuesday.

---

## Open questions for the owner

1. **Is 22–25 of ~100 right?** (§5.1) It is arithmetic over
   `exam-spec.md` and the manifest, not a measurement, and it changes the
   time allocation in `the-last-week.md` §4.2 by a factor of two. Ten
   minutes with the sample paper settles it, and until it is settled
   `exam-spec.md:147` should carry a note rather than a new number.
2. **Should the Profil note say "spend 40 minutes here, not three hours"?**
   `the-last-week.md:847` asked the same question at 20 minutes and never
   got an answer. It is still a strange thing for an app to say and still
   the honest thing.
3. **Does the reappraisal sentence go in?** (§2.6) One paragraph,
   d ≈ 0.20, and a tone decision that is not an assistant's.
4. **Is the sample paper still unsat?** (`the-last-week.md:842`) §5.4's
   day-5 block is the highest-value hours of the week and it only works
   once.
