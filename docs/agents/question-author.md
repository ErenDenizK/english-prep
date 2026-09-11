# Brief: Question author

> Paste this whole file into a fresh Claude session that has the
> `english-prep` repository, with the kickoff block filled in.

## Kickoff (fill this in before sending)

```
Topic id:      
Topic title:   
Tier:          
Level:         

Categories (use these names verbatim, do not add or rename):
  1. 
  2. 
  ...

Questions: 4 per category
```

---

## Your job

Write the `questions` array for the topic above: paragraph-based
multiple-choice cloze questions in the style of a Turkish university
English prep-school proficiency exam (YTÜ İYS and similar), at B2–C1.

Read `docs/CONTENT_GUIDE.md` first — it is the authoritative schema and
the validator enforces it. Read the existing `data/tenses/tenses.json`
questions as a worked example of the bar you're aiming at.

Deliver **one file**: `data/<topicId>/<topicId>.questions.json`,
containing a single JSON array of question objects. Nothing else. Do not
touch `data/manifest.json`, the app code, or the topic's lessons — a
separate session is writing those.

## Shape

```json
{
  "id": "modals-t1",
  "category": "Deduction & Certainty (must be / can't be / might be)",
  "paragraph": "The lights are off and her car is gone, so she ____ still at the office. I'll try her mobile instead.",
  "options": ["can't be", "mustn't be", "shouldn't be", "won't be"],
  "correctIndex": 0,
  "explanation": "Kanıta dayalı bir çıkarım yapılıyor: ışıklar kapalı, araba yok. Bu kesinliğe yakın olumsuz çıkarım 'can't be' ile kurulur. 'mustn't be' yasak bildirir, çıkarım değil — Türkçedeki 'olmamalı' yanıltıcıdır.",
  "tip": "Çıkarımın olumsuzu 'must be' değil 'can't be'dir; 'mustn't' yasak anlamı taşır."
}
```

## The quality bar

This is where the work actually is. The schema is easy; these are not.

**The paragraph must require reading.** One to three sentences of real
context, with exactly one `____` blank. A learner should not be able to
answer from the blank's immediate neighbours alone — the deciding
evidence (a time expression, a cause, a consequence, a contrast) should
sit elsewhere in the passage. If your sentence would still be answerable
with the surrounding context deleted, it's too easy.

**The wrong options must be tempting.** Each distractor should be the
answer to a plausible misreading — a form a real student would pick for a
real reason. Options that are obviously ungrammatical waste one of four
slots. A good test: for each wrong option, can you name the specific
mistake that would lead someone to it? If not, replace it.

**Target the confusion, not the form.** Your categories name confusable
pairs and triads on purpose. A question in `"Present Perfect vs Past
Simple"` should be one a learner could plausibly get wrong by picking the
other one, not a question where only one option is even close.

**`explanation` is Turkish and does two things**, always both: why the
correct option fits *this* passage, and why the nearest wrong option
doesn't. Naming the trap is the point. One-liners are not acceptable.

**`tip` is Turkish and is transferable.** It's a rule the learner carries
to the next question, not a restatement of this one. "Bu cümlede 'since'
olduğu için Present Perfect" is a bad tip; "'since + geçmiş bir nokta'
her zaman Present Perfect ile kullanılır" is a good one.

**Some of your questions are used as teaching.** The Eğitim reader pulls
a lesson's check cards from the questions sharing its category, so a few
of yours will be met right after the rule is explained rather than in an
exam run. Nothing changes in how you write them — but a question that
only makes sense to someone who has already finished the whole topic is
worth flagging to the supervisor.

**Vary everything else.** Different subjects, settings, and sentence
shapes across the set. University life is a natural setting for this
audience but shouldn't be the only one. Do not reuse a scenario.

## Language

- `paragraph` and `options`: English.
- `explanation` and `tip`: **Turkish**.
- `category`: English, copied verbatim from the kickoff.

## Before you hand it over

```bash
npm run validate
```

It won't see your file until the supervisor merges it, so validate by
temporarily assembling the topic file locally, or ask the supervisor to
run it. Either way, these are the things it will reject or flag, so
check them yourself:

- exactly 4 options, all distinct (comparison is case-insensitive);
- `correctIndex` in range, and pointing at the option you meant;
- exactly one `____` (four underscores, no more, no fewer);
- **read the filled-in sentence**, not just the parts: the validator
  substitutes your correct option into the paragraph and rejects a word
  repeated across the seam ("The novel was written by ____ by a
  student"). It has already caught that in real content — writing the
  option and the sentence separately makes it invisible;
- ids unique and prefixed with the topic id;
- explanations and tips actually in Turkish;
- paragraphs of at least ~15 words.

Then re-read your own set once as a student: how many could you answer
without reading the full passage? Every one of those needs more context.

## Five rules the first content review had to invent

Everything above is the schema. These five are what a review of the first
72 questions found the schema could not say, and each one names a defect
that reached shipped content. `docs/content-review.md` has the evidence.

**1 · Never build a question on a sentence from its own lesson.** This is
the one nobody would guess. `check` blocks are filled from the questions
sharing the lesson's category, so a question built on the lesson's own
example sentence is a check whose answer the learner read three blocks
earlier. In one topic, **20 of 24 keys reused a lesson sentence's subject
and verb, most of them verbatim**. Take the grammar point from the
lesson; take the scenario from somewhere else.

**2 · An option a competent teacher would accept is a wrong option.** Not
"less natural than the key" — accepted. Sixteen of the first 72 items had
one, and they clustered: `should` against `ought to`, `leaves` against
`is leaving`, a bare passive against one with an obvious agent. If the
explanation has to argue that the key is *more natural*, the item is
broken. Rewrite the paragraph until one option is right and the rest are
wrong, or key a different contrast.

**3 · A dead option makes a four-option item a three-option one.** An
option is dead when it is wrong for a reason unrelated to anything the
lesson teaches — `am` in *I always am it painted*. It is **not** dead
merely because it looks obviously wrong to a fluent speaker: `had better
to` is the error this audience actually makes, and the lesson is built on
it. Write for the Turkish B2 learner, not for yourself.

**4 · One item in four must be decided by meaning, not by a trigger
word.** Three of the app's nineteen categories can currently be passed
without reading the paragraph at all — the trigger sits next to the blank
and the rest is scenery. And at least one item per category should be one
the trigger gets *wrong*, because that is the caveat the lesson spent its
most emphatic block on.

**5 · The explanation must name a wrong option, by its own words.** Not
"Present Perfect is used here" — *"'has done' would mean X, but the
period closed in 2019"*. `npm run validate` now counts the explanations
that never mention any wrong option and reports them per topic. Two
thirds of the first corpus failed it.

## Out of scope

Don't edit `js/`, `css/`, `*.html`, `data/manifest.json`, or the lessons
array. If the schema seems to be blocking a question you want to write,
say so and stop rather than working around it — changing the schema means
changing the validator and the app too, and that's the supervisor's call.

---

## Combination: the one way this app gets harder

Every category in this app sits at the same level by design. The tiers
are a display grouping, not an order (`js/tiers.js`), nothing is locked,
and `docs/research/progression.md` measured the corpus and found no
curriculum underneath: six content edges across sixty lessons, all six
already neutralised by the importing lesson re-teaching what it imports.

So difficulty cannot come from "later topics are harder", because there
are no later topics. It comes from two places, and this section is about
the first.

**A combined item holds one thing constant and makes the learner carry
two.** `passive-voice` already does it, in nine of the corpus's sixty
categories and most sharply in `Modal Perfects in Passive`: all four
options are passive, the passive is not the question, and what varies is
the modal — so the learner has to hold the passive steady *while*
choosing on a scale they learned somewhere else. Ten of that topic's
twenty-four items work this way.

That is the right kind of hard for this app's learner. CLAUDE.md's
"Who this is for" says why: someone with competence and no labels will
usually get either half right on its own, because their ear produces it.
They stumble when the two are stacked, which is exactly where an exam
puts them.

Write one deliberately, per category, when the material allows it:

1. **Name the constant.** Every option shares it, and no option is
   eliminated by it. If a learner can answer by noticing which option is
   the odd shape, the constant is not constant.
2. **Vary on the imported axis**, and make the paragraph decide it — not
   the category label, which the Test screen prints above the question.
3. **Re-teach the import in the lesson**, in full. That is what the six
   existing edges do and it is why "her ders ayrı bir makale" is still
   true. A combined item whose lesson assumes the other topic breaks the
   app's one promise about how it may be read.
4. **Apply the paragraph-deleted test.** Delete the paragraph; if one
   option still picks itself out, the item is testing form recognition
   and not the combination.

The counter-example is instructive and it is in this repository's own
history: before its third repair round, `Passive with Modals` held the
modal constant across all four options and varied only whether the option
was a well-formed passive. It looked like a combined item and it was a
spelling drill — nine of twelve keys in that part of the topic were the
only structurally legal option, so a student who read nothing scored
9/12.
