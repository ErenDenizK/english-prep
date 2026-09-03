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
- ids unique and prefixed with the topic id;
- explanations and tips actually in Turkish;
- paragraphs of at least ~15 words.

Then re-read your own set once as a student: how many could you answer
without reading the full passage? Every one of those needs more context.

## Out of scope

Don't edit `js/`, `css/`, `*.html`, `data/manifest.json`, or the lessons
array. If the schema seems to be blocking a question you want to write,
say so and stop rather than working around it — changing the schema means
changing the validator and the app too, and that's the supervisor's call.
