# The calibration set

**Supervisor only. A reviewer must not read this file** — it holds the
answer key to the set used to grade reviewers, and a reviewer who has read
it cannot be graded. `docs/agents/reviewer.md` says so too.

Ten items: five with known defects, five verified sound. A reviewer is run
against these ten before its findings on anything else are believed.

Why bother: a reviewer that finds nothing is indistinguishable from a
clean corpus, and a reviewer that flags everything is indistinguishable
from a broken one. Neither can be told apart by reading its output. The
only way to know whether a review is worth acting on is to hand it a set
whose answer is already known.

The five defects below were found by hand while converting the lessons to
blocks (`docs/education-notes.md`), before any reviewer existed. That is
what makes them fair: nobody wrote them to be caught.

---

## Scoring

Run the reviewer on all ten, in one pass, in the order given here — mixed,
not grouped. Then:

| | |
| --- | --- |
| **Recall** | of the five defects, how many were named with the right defect class |
| **Precision** | of the five sound items, how many were left alone |
| **Discrimination** | did it separate blocking from worth-fixing the way the key does |

A reviewer that scores **4/5 recall with 5/5 precision** is worth
believing on unseen content. **Below 3/5 recall it is decoration** — the
brief needs work, not the corpus. **Below 4/5 precision it is worse than
nothing**: a review that cries wolf on sound items is a review nobody
finishes reading, which is exactly the mechanism that made AI-assisted
item writing come out *behind* teacher-only item writing in the one
controlled study there is.

Getting the defect class wrong but the item right is a half-hit. Naming a
sixth defect on a sound item is a miss even if the reasoning is
interesting.

---

## The five with known defects

### `tenses-t20` — D2, worth fixing

> Have you ____ to Japan before, or would this be your first time?
> `gone | **been** | go | went`

Two dead options. `go` and `went` are ungrammatical after `have` for
reasons that have nothing to do with the point being taught, so the item
is `been` versus `gone` — a two-option question. It is also decided by
`before` alone (**D4**), which is the second half of the finding.

### `modals-t17` — D1, blocking

> In my opinion, you ____ try that new bakery downtown.
> `**should** | had better | must | ought to`

`ought to` is grammatical, natural and means very nearly the same thing.
The explanation argues `should` is *more* natural, which is a preference,
not a rule. An item like this punishes the student who knows more.

### `passive-voice-t15` — D2, worth fixing

> I don't paint my own house — I always ____ it painted by professionals.
> `**have** | do | make | am`

`am` produces *I always am it painted*, which no learner would consider.
Effectively a three-option item.

### `passive-voice-t21` — D3, worth fixing

> My wallet ____ while I was on the crowded train yesterday afternoon.
> `**was stolen** | was stolen by someone | was stolen by a stranger | was stolen by a person`

Every option is grammatical. The item rewards guessing which phrasing the
author found natural, which is a style judgement dressed as a grammar
item. `-t23` (*The patient ____ to the hospital*) has the same shape and
is the worse of the two.

### The *Present Perfect vs Past Simple* set — L5, blocking, category level

`tenses-t5`, `-t6`, `-t7`, `-t8`.

The lesson explicitly warns that `for` appears on both sides — *I have
lived here for five years* against *I lived there for five years, then I
moved* — and says what decides it is whether the period is still open.
Not one of the four questions ever punishes the heuristic: `t5` has
`since`, `t6` has `two years ago`, `t8` has `over the past century`, and
`t7` has no time marker at all. A learner can score 4/4 while holding
exactly the belief the lesson tried to correct.

A reviewer that reports this **per item** rather than once at category
level has half-found it: the individual items are all correct English,
correctly keyed, and none of them is wrong on its own.

---

## The five that are sound

Flagging any of these is a false positive. Each was checked against the
whole taxonomy before being put here.

### `tenses-t17`

> I ____ this report for almost three hours now, and I still have two
> sections left to finish.
> `wrote | have written | **have been writing** | am writing`

`for three hours now` is a real signal, but `still have two sections left`
is what rules out `have written`, and the item does not work without it.
All four options are grammatical English somewhere.

### `modals-t10`

> She ____ be at home right now — I just saw her car leaving the parking
> lot ten minutes ago.
> `**can't** | must | might | should`

Four live options, no trigger word anywhere, decided entirely by the
evidence in the second clause. This is what a deduction item should look
like.

### `modals-t14`

> He ____ finished the marathon in under three hours — he's never run more
> than five kilometers in his life.
> `**can't have** | must have | should have | needn't have`

All four are standard structures. The key is decided by real-world
reasoning over the evidence, not by a form.

### `modals-t23`

> Despite the terrible traffic, she ____ arrive at the interview exactly
> on time.
> `**was able to** | could | can | would be able to`

The best item in the corpus. `could` is the naive answer — *could* is past
ability, and every learner has been taught that — and it is wrong, because
a single successful achievement takes `was able to`. This is the one item
that punishes a heuristic rather than rewarding it, which is what one item
in four should do.

### `passive-voice-t4`

> Please use the side entrance for now — the main lobby ____ renovated
> this week, so it's quite noisy in there.
> `**is being** | was | has been | is`

All four produce grammatical sentences. `for now` and `quite noisy in
there` together are what make it in-progress, and neither alone is
enough.

---

## Results

Dated, newest first. Record every reviewer run, including the bad ones —
a brief that had to be rewritten is the most useful thing in this file.
