# `optionNotes` — Tenses

2026-09-04. Scope: `data/tenses/tenses.json` only. No other file under
`data/`, no JavaScript, no CSS.

**75 notes written** — three per item on all 25 items, covering every wrong
option. No note on any key. Shortest 92 characters, longest 131
(`tenses-t25` / `has been going`), median and average both 116.
`npm run format && npm run check` clean: 0 errors, 0 warnings.

Method per `docs/agents/option-notes.md`: for each item, read the paragraph,
the key, the `explanation`, the `tip` and the lesson for that item's
category; substitute the wrong option and read it as written; then write the
belief that would make it look right and the one property of *this* item
that defeats it. Because `js/feedback.js:58` shows only the note for the
option the learner actually chose, every note is a standalone sentence to
one person and never compares the three.

## What the notes turn on

The lesson vocabulary was already consistent across all six lessons, so the
notes could be written in it without inventing a second terminology.

- **Present Simple vs Present Continuous** (t1–t4): the note says what the
  option asserts about time — a rutin, a şu anda süren geçici durum, a
  değişmeyen gerçek — and names the phrase in the item that fixes which one
  is meant (`every morning`, `right now`, `a fact`). t4 is the only one that
  argues from a verb class: `think` as a durum fiili, in the lesson's words.
- **Present Perfect vs Past Simple** (t5–t8): every note is about whether
  the dönem is open or closed, which is the lesson's own axis. The note
  names the expression that decides it (`since she started university`,
  `two years ago`, `over the past century`) or, in t7, the absence of any
  time expression at all.
- **Past Simple / Continuous / Perfect** (t9–t12, t19): the notes place the
  option on the timeline relative to the item's reference moment — before
  it, during it, or on the same line as it — and name the reference moment
  by its own words (`noticed`, `the professor arrived`, `didn't recognize`,
  `turned thirty`).
- **Future Forms** (t13–t16): each note names *when the decision was made*
  or *who set the time*, which is the lesson's framing, and points at the
  sentence's own defeater (`Look at those clouds`, `Don't worry about
  picking me up`, `the board at the station`, `already in both of our
  calendars`).
- **Perfect Aspects** (t17, t18, t20, t25): miktar vs süre for t17/t18, and
  where the person physically is for t20/t25. The two ill-formed options in
  t20 are the only notes in the topic that argue pure form.
- **Time Expressions** (t21–t24): the notes say what the word takes on
  either side of it — a başlangıç noktası, a süre miktarı, a cümle — and
  where the blank sits relative to that.

## Items where writing the notes showed the item is weak

Reported, not fixed.

### 1. Three of the four Time Expressions items are built on sentences from their own lesson

`docs/agents/question-author.md` forbids exactly this, and `check` blocks
draw from the same category, so the learner meets the keyed sentence on the
same lesson page as the question.

- **t22** — `The meeting had ____ started by the time we arrived`. The
  lesson's `examples` block carries *"The meeting had already started by the
  time we arrived."* verbatim.
- **t23** — `I've ____ finished the assignment`. The lesson's `already`
  contrast side and its second `pitfall` both carry *"I have already
  finished the assignment."* — the item differs only by the contraction.
- **t24** — `He moved to Istanbul five years ____`. The lesson's `examples`
  block and its third `pitfall` both carry *"He moved to Istanbul five years
  ago."*

The whole category is affected: t21 is the only one of the four not lifted
from its own lesson.

### 2. t19 is verbatim from the Perfect Aspects lesson

`By the time she turned thirty, she had founded two companies` appears twice
in `Perfect Aspects: Simple vs Continuous vs Been/Gone` — as an `examples`
item and as the Past Perfect side of the *"Hangi ana bağlı"* contrast. t19
is filed under `Past Simple vs Past Continuous vs Past Perfect`, so it is
not strictly its own lesson, but any learner who has read Perfect Aspects
has been shown the answer as a worked example.

Worth noting alongside this: that same category has **five** questions where
every other has four, and t19 is the fifth. If one item goes, it is the one
already told to the learner elsewhere.

### 3. t7 — `broke` is an option a competent teacher would accept

`Look at this mess! Someone ____ the coffee machine and left it broken for
the whole office.` *"Someone broke the coffee machine and left it broken"*
is natural, idiomatic and, in American usage, the likelier sentence. Worse,
the item's own coordination argues for it: the second verb is `left`, a Past
Simple, so the key produces *has broken … and left*, which mixes aspects
across an `and`. The note I wrote argues the emphasis (the result is in
front of you now) because that is the lesson's rule, but it is arguing a
preference against a sentence the item itself half-endorses. The repair is
probably in the second clause, not in the option list.

### 4. t20 is a two-way item wearing four options

Options are `been`, `gone`, `go`, `went`. `go` and `went` cannot follow
`Have you ____` at all; both fail on form before the item's own subject —
the `been to` / `gone to` distinction — is ever reached. Their notes have to
say so, which means two of the three notes teach V3 rather than been/gone.
Only `gone` tests what the item exists to test.

### 5. Three items where two distractors are really one

- **t3** — `boiled` and `has boiled`. Both are excluded by the single fact
  that the sentence states a timeless law (`a fact every chemistry student
  memorizes`), so no past-event reading is available at all. The two notes
  differ only in what kind of past event each names; the reason is the same
  reason.
- **t22** — `still` and `ago`. Neither can sit inside `had ____ started`,
  both for position, leaving `yet` as the only live distractor.
- **t23** — `ago` and `since`. Neither can sit between `I've` and a past
  participle, again leaving `yet` as the only live distractor. Since t22 and
  t23 are also the two lifted-from-the-lesson items, this category is thin
  in two independent ways.
- Adjacent, milder: **t1** — `has gone` and `went` are both excluded by
  `every morning` fixing a repeated routine, and the `explanation` argues
  only `is going`, which is the item's one real distractor.

### 6. Future Forms rests on textbook convention, not on what the options get wrong

Not a defect in any single item, but the shape of the whole category, and it
is visible only once you try to write a note that says what the option
*gets wrong*. `it will rain any minute now` (t13), `The last train back will
leave at 23:10` (t15) and `We will have dinner with the Özdemirs on
Saturday` (t16) are all sentences fluent speakers produce. What saves the
items is that each paragraph plants a defeater — `Look at those clouds`,
`the board at the station is very clear`, `it's already in both of our
calendars` — so the note can point at the sentence rather than at the
option. Every `will` note in this topic therefore argues *who decided, and
when*, which is the lesson's own axis; none claims the option is wrong
English, because it is not.

### 7. t8 — `experienced` is the softest exclusion outside Future Forms

`Turkey experienced several major earthquakes over the past century` is
accepted in ordinary usage and in American teaching. The item leans entirely
on the `tip`'s claim that `over the last/past + süre` marks a still-open
period; the note says the same thing, because there is nothing else to say.
Defensible, but it is a rule the item asserts rather than a fault the option
commits.

## Conventions followed

English forms are quoted with single quotes, matching every `explanation`
and `tip` in this file. No `**bold**` was needed. No note restates the key,
none refers to the other options, and none is repeated: the file's recurring
distractor shapes (a `have/has + V3` option in a past-tense item, a
`was + V-ing` option in a perfect item) are each written against the item's
own reference moment, so no two notes say the same sentence.
