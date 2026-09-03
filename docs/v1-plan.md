# The road to v1

Written 2026-09-03, out of the six research arms in `docs/research/`.
This is the plan of record, the way `docs/redesign-plan.md` was for the
interface rebuild. Update it as decisions land — the point is that the
reasoning outlives any one session.

Read the arms for the evidence. This file is only the decisions.

---

## What the round actually found

Six arms researched independently and converged on one thing:

> **The app is well built and is preparing for the wrong shape of exam,
> with a tenth of the content it needs.**

That is not a criticism of the last two rounds. The architecture, the
design system and the lesson model are all sound, and none of this would
be reachable without them. But it reorders everything: **the next thing to
build is not a seventh grammar topic.**

Three findings carry the plan.

**1 · There is no discrete grammar section on the exam — and the grammar
it does test is not the grammar the app teaches.** **Verified**: the owner
supplied YTÜ SFL's own sample papers on 2026-09-03 and the specification
is now in `docs/exam-spec.md`. Session I is 40 questions at 1.5 points
each: a 10-blank cloze passage, 10 restatements, two reading texts of
seven questions, six paragraph completions. Session II is listening, and
its larger half is a hand-written note-taking sheet rather than multiple
choice.

The research arm estimated the app covered 12–19% of the marks. The real
paper puts it at about **7%**, and for a reason nobody predicted: of the
ten cloze blanks, **not one tests a tense or the passive**. Two test
modals. The rest test discourse markers, relative pronouns, quantifiers,
comparatives, `so/such` and causatives — almost exactly the grammar the
app does not cover. The learning-design arm reached the same conclusion
from published error analyses of Turkish learners; the paper confirms it
from the other side.

**2 · Four questions per category is the binding constraint on
everything.** Three arms reached this independently. A second topic test
delivers ~5.6 unseen questions against 9 repeats. "Pratik Yap" on a weak
category returns *the same four questions forever* — verified in the code.
After the first pass, `correct` stops measuring grammar and starts
measuring item memory, which invalidates every estimator in the learning
literature at once. No amount of modelling escapes this; only content
does.

**3 · Review throughput, not generation, is the content bottleneck — and
the naive way of spending it is a negative control.** The one controlled
comparison found teacher-plus-AI items carrying *more* item-writing flaws
than teacher-only items (*d* = 1.06), because reviewers gave AI drafts
measurably less engagement than their own. Reading a generated item with
its key and a fluent explanation attached is a task in which the defect is
invisible. (`content-pipeline.md`.)

That third finding explains why the last round worked: not because
anything was generated well, but because a second agent read the first
one's output adversarially against a written schema.

### And one thing is losing data right now

WebKit deletes script-written storage after seven days of browser use
without interaction on the origin. On iOS Safari, "comes back after two
weeks" already means "progress is gone". The documented escape is a
home-screen install — **except that installing on iOS moves the app into a
separate storage container and destroys the progress first.** So export
and import have to ship *before* any install advice. Nobody would have
guessed that ordering. (`onboarding.md`.)

---

## Verified defects

Five claims the arms made about our own code. All checked by hand, all
true.

| | |
| --- | --- |
| `buildQuizSession` is `shuffle(pool).slice(0, n)` and has no imports — the per-question history recorded since day one is never used for selection | `js/quiz-engine.js` |
| "Pratik Yap" on a 4-question category is `Math.min(15, 4)` — the same four items, every time, forever | `js/quiz-launch.js` |
| `MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3` with `accuracy < 1` labels a *random guesser* weak 99.6% of the time | `js/storage.js` |
| No `apple-touch-icon`, no Open Graph tags, no manifest, no PNG anywhere — a pasted link previews blank, and Add-to-Home-Screen yields a screenshot | all three HTML files |
| `startCategoryPractice` marks every live topic seen on its way out, clearing every "Yeni" badge | `js/quiz-launch.js` |

And one content defect, verified by reading all four items: **nothing in
*Present Perfect vs Past Simple* ever punishes the signal-word
heuristic**, although the lesson itself warns that `for` appears on both
sides. A learner can score full marks while holding exactly the belief the
lesson tried to correct. The other seventeen categories have not been
checked. (`docs/education-notes.md`.)

---

## The one conflict between arms, and how it resolves

The exam arm ranks a **timed exam mode** first, at one day of code and no
content. The practice-modes arm says v1 includes **"any timer"** in its
refusals, and separately refuses "a mock exam assembled from the existing
grammar items".

They are not actually disagreeing. The practice arm is refusing timers as
*pressure applied to learning* — per-question countdowns, sprints, a clock
on an item you are trying to understand. The exam arm is asking for a
*rehearsal of the exam's own conditions*, which is a different activity
with different evidence behind it.

**The decision:** build the timed, feedback-deferred block, and hold it
back until there is exam-shaped content to put in it. A timed run at 40
single-blank grammar items is not a rehearsal of a paper that contains no
such section; it is a grammar drill with a clock on it, which is the thing
the practice arm is right to refuse. It ships with the restatement items,
not before. Per-question timers stay refused permanently.

---

## The plan

Four stages. Stage 0 is a few days and fixes what is broken. Stage 1 is
the pipeline, and it runs against content that already exists before it is
pointed at content that does not. Stage 2 is the exam shape. Stage 3 is
volume, and it is months rather than days.

### Stage 0 · Fix what is broken — ✅ **done, 2026-09-03**

Nothing here needed new content, a schema change or a decision from
anyone. All seven landed the day the plan was written; `npm run verify` is
416 checks and green, `npm test` is 56.

Two things turned out differently from the plan. Item 2 needed no new
field at all — an attempt already stores its own date beside the ids it
covered, so "when was this last seen" was derivable. And item 5 removed
more than expected: with the lesson index in the manifest, *four* screens
stopped fetching topic files rather than two, because the Test tab and the
results screen had been loading the question bank for a category list the
manifest already contained. Opening the app went from 328.8 KB and
1,034 ms to 221.0 KB and 647 ms.

1. **Draw unseen questions first.** One pure function in
   `js/quiz-engine.js`, which has 29 tests around it: unseen items, then
   items answered wrong, then the rest. Three separate arms named this
   first. It makes every existing mode better without adding a mode, and
   it is the precondition for anything being measured on fresh items.
2. **Record when each item was last seen.** One field beside the
   `{id, topicId, correct}` already stored. Worth nothing today and the
   precondition for everything later; do it while the history is small.
3. **Export and import, with a non-destructive merge.** The item that
   matters, because the alternative is losing a learner's history to a
   browser policy. A file *or* pasted text on the way in — the paste path
   cannot fail and needs no API on either end. Plus
   `navigator.storage.persist()` at boot, and one honest sentence in
   Profil about where the data lives.
4. **Make the weak statistic mean something.** Window accuracy to recent
   answers, count distinct items rather than answers, and stop showing a
   percentage for a category with too few observations. It currently
   drives all three places the app tells a learner what is wrong with
   them.
5. **The manifest lesson index**, generated by the formatter. The home
   screen downloads 141 KB to render 1.7 KB of information; at the content
   volume stage 3 implies, that becomes 1.4 MB.
6. **Link previews and icons.** Open Graph tags, a real description naming
   the exam, `apple-touch-icon`, a manifest. The app is distributed by
   pasted URL, so the WhatsApp preview *is* the first impression, and it
   is currently blank. Icons come **after** item 3, per the iOS ordering
   above.
7. **Hide the options until the learner commits.** An opt-in toggle:
   answer in your head first, then reveal. Zero content cost, and the
   highest value-per-line in the practice-modes arm.

## Decisions the owner has made

- **Taxonomy: fix now.** All four category problems corrected 2026-09-03,
  accepting the lesson-progress reset. Cheaper now than at any later
  point, with six users.
- **Next section: restatement / closest meaning.** Fifteen of Session I's
  sixty points and the cheapest real section on the paper. The code
  landed 2026-09-03. The content — 24 questions and 6 lessons — is
  written and reviewed but **not shipped**: it is in
  `docs/agents/drafts/closest-meaning/`, with the repair list beside it.
  Both blind passes picked the author's key 24/24, so nothing is
  miskeyed; what stopped it is two lesson claims about English that are
  false, and two distractor patterns a student could learn to exploit
  without reading a stem.
- **Offline: not a v1 requirement**, and not a requirement at all while
  this is a link people open rather than an app they install. Recorded in
  the README so nobody adds a service worker for its own sake. Revisit
  only if the app becomes something people install.

---

### Stage 1 · Prove the pipeline on the content we have — ✅ **done, 2026-09-03**

All six landed. The report is `docs/content-review.md`; `npm run verify`
is 416 checks and green, `npm test` is 75.

It answered its own question — the reviewer scored 5/5 recall and 5/5
precision on the calibration set, so the pipeline can be pointed at new
content — and then returned three findings nobody had planned for.

**Nothing in the corpus is miskeyed.** Two independent blind passes,
different option orders, no answer key: 144 of 144 matched. That is the
result that made the rest worth doing, because it means the content is
worth repairing rather than replacing.

**No lesson is insufficient; every lesson teaches more than its questions
test.** Zero L1 across all eighteen, and about twenty caveats warned
about and never sprung. The failure runs the opposite way from what
anybody expected, and item 3 was written expecting the opposite.

**Questions were built on their own lessons' example sentences** — 20 of
24 keys in one topic. `check` blocks draw from the same category, so the
learner meets the answer sentence a few blocks above the question that
asks it. This is a coupling between the block schema and question
authoring that nobody costed when `check` was designed, and it is now
rule 1 in `docs/agents/question-author.md`.

Seven questions were rewritten; three of those rewrites failed their own
blind re-review and were reverted or redone, which is the pipeline
working on its operator.

The pipeline should be proven on 72 questions before it is aimed at 900.

1. **A reviewer brief and a calibration set** — the five known-bad items
   already recorded in `education-notes.md`, plus five verified-good ones.
   A reviewer that does not catch known-bad items is decoration.
2. **A blind pass over the existing 72.** Answer each item cold, in both
   option orders; then answer it again with the deciding context removed.
   An item still answerable that way is testing a surface cue. I expect
   this to fail all four *Present Perfect vs Past Simple* items, which is
   the point.
3. **A lesson-sufficiency pass over all 18 lessons** — answer a category's
   questions using only its lesson. Six of the ten known defects are
   lesson defects and three are outright lesson/question contradictions.
   Nothing currently looks for them.
4. **Four validator checks**: the explanation must name a distractor;
   banned option forms; corpus-wide near-duplicate stems; scenario
   over-use. All four enforce rules `CONTENT_GUIDE.md` already states and
   cannot check.
5. **The category spec** as a template plus one worked example — the
   discrimination, a numbered misconception list every distractor must
   cite, a context bank, a difficulty recipe. About an hour per category,
   written as categories come up for extension rather than all eighteen at
   once.
6. **A "bu soruda bir sorun var" link** on the feedback block, and one
   paragraph in Profil saying the content is AI-written and human-checked.
   This is what turns six users into the only pretest panel this project
   can have.

### Stage 2 · The exam's actual shape

Ordered by exam weight against cost. **Blocked on verifying the exam
specification** — see below.

1. **Restatement items** ("Closest Meaning"). A `type` discriminator, a
   CSS pass so a four-line option survives 320px, a validator branch. No
   engine change, no passage. **15 of Session I's 60 points — a quarter of
   the paper** — and the cheapest real section there is. *~1 day of code,
   40 items to ship.*
2. **The timed, feedback-deferred block**, shipping with the above.
   *~1 day of code, no content.*
3. **Reading passages.** The real structural change: the question pool
   becomes units, because a passage of seven items stays together;
   `context` has to reach the results screen; and `checkPool` needs a
   guard or an Eğitim check will pull one orphaned question out of a
   passage. **21 points, the largest section on Session I.** The sample
   papers add a requirement the research could not have known: passages
   are divided into Roman-numbered paragraphs and most questions cite one,
   so paragraphs have to be addressable in the schema rather than a blob
   of text. *~1 week of code, 10 passages / 70 items to ship.*
4. **Reading-skill lessons** — five short ones, so the results screen's
   category→lesson link does not dead-end on the new taxonomy. Ships with
   the above or the feature is half-wired. *No code; the block schema
   already fits.*
5. **Vocabulary.** Needs no schema change at all — an AWL item is a
   single-blank cloze with content words. The work is Leitner scheduling
   and a session builder. *~2–3 days of code, 180 items to ship.*
6. **Cloze passages**, then **paragraph completion**. The unit change is
   already paid for by reading.

### Stage 3 · Volume

Roughly 490 items to ship the sections above, 950 to be credible, against
72 today. At six to eight minutes of genuine review per item that is 50–65
hours for the first number. The honest response is to **ship fewer
sections properly** rather than all of them thinly.

Also here, and now confirmed by the paper rather than inferred: **the
three topics are the wrong three.** Tenses, Modals and Passive Voice were
chosen without a sample paper in front of anyone. They are real B1–B2
grammar and they carry two cloze blanks and part of the restatement
section, so none of that work is wasted — but the grammar the paper
actually rewards is **discourse markers, relative clauses, conditionals,
comparatives, quantifiers and `so/such`**, and that is what the next
grammar round should write. The learning-design arm reached the same list
from published error analyses of Turkish learners.

And one item in four should be decided by something other than the surface
cue.

---

## Refused

Carried from the arms, and recorded so they are not relitigated:

- **Streaks, points, XP, leaderboards, lives, daily reminders, unlock
  progression.** The evidence for gamification improving *learning* is
  weak and heavily moderated; the evidence that extrinsic rewards damage
  intrinsic motivation when withdrawn is not. The users are six friends
  sitting a real exam, not a retention funnel.
- **Per-question timers and sprints.**
- **A mock exam assembled from the current grammar items.**
- **Grading the essay.** A textarea with no feedback is a false signal on
  a quarter of the paper.
- **Speaking, and listening for now** — listening is 25% of the paper but
  0% of the gate, and text-to-speech destroys the note-taking task that
  section is actually testing.
- **A placement test.** Arithmetically impossible on this content: a
  four-item category subtest reaches Cronbach's α of 0.24, and an
  eighteen-item diagnostic would spend a quarter of the pool and
  contaminate the rest. The retrospective diagnostic already exists and
  gets *more* reliable with use.
- **A daily-minutes goal.** Implementation intentions work for one-time
  actions (*d* = .65); pointed at repeated behaviour they produce a
  tightly-estimated null. It fails on its own evidence before the
  motivation argument is even needed.
- **FSRS, BKT, item-level spaced repetition, SM-2's self-graded quality.**
  Sophistication estimating noise at four items per category. The
  schedulable unit here is the *category*, not the item.
- **A service worker added for its own sake**, and any build step.

### One position that was never actually written down

Earlier work rejected streaks on introjected-regulation grounds, and I
have repeatedly described that as a decision in the design system. **It is
not in the repository.** The practice-modes arm grepped for it and said
so. The reasoning is now made properly in `practice-modes.md` §4.3 and
should be lifted into `docs/design-system.md` as a real recorded decision
rather than a thing everyone assumed was there.

---

## Blocked on the owner

1. ~~**The exam specification.**~~ **Resolved 2026-09-03**: the owner
   supplied both sample papers. `docs/exam-spec.md` is now the verified
   source and supersedes the research arm. Still unknown, and only
   relevant to a mock-exam mode: the writing task's format and weight, the
   pass mark, and the session durations — none of the three appears on the
   sample papers.
2. **The exam date.** The answer given was ambiguous — "we have a week"
   and "there is time to add enough content" point in opposite directions.
   Stage 0 and stage 1 are correct under either reading and are being
   built regardless. Stage 2 and stage 3 are not.
3. **Prerequisite edges**, if the `requires` field is wanted. Authored
   data beats inference here, and the judgement is the owner's.
4. **How many sections to attempt.** Stage 3's arithmetic says shipping
   reading and restatement properly beats shipping six sections thinly.
   Which sections is a decision about the exam, not about software.
