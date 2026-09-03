# Brief: Curriculum author

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

Lessons: 1 per category, in the order listed above
```

---

## Your job

Write the `lessons` array for the topic above: the Eğitim tab's content.

A lesson is a **short article**, not a sequence of screens. You write
named sections; the app decides how they are paced into the reader's
steps and where it slots in check questions. Do not think about cards,
pages or step counts — think about what a Turkish student needs read to
them, in what order, to stop getting this contrast wrong.

Read `docs/CONTENT_GUIDE.md` first — it is the authoritative schema and
`tools/validate-content.mjs` enforces it. Read the Tenses lessons in
`data/tenses/tenses.json` as a worked example of structure and voice.

Deliver **one file**: `data/<topicId>/<topicId>.lessons.json`, containing
a single JSON array of lesson objects — one per category, in the kickoff's
order. Do not touch `data/manifest.json`, the app code, or the topic's
questions; a separate session is writing those.

## Shape

```json
{
  "category": "…",
  "intro": "…",
  "form": "…",
  "meaning": "…",
  "usage": "…",
  "examples": [{ "sentence": "…", "note": "…" }],
  "commonMistakes": [{ "wrong": "…", "right": "…", "why": "…" }],
  "recap": "…"
}
```

Every field is required. There is no `id` and no `order` — the id is
derived from the topic and the category, and the order is the array
order.

## What each section is for

Writing all seven well is the job; the schema is the easy part.

**`intro`** — why this pair is worth a lesson. The best ones name the
confusion a *Turkish speaker specifically* has, often because Turkish
makes a distinction English doesn't, or the reverse. Also used as the
lesson's one-line preview on the index, so the first sentence must stand
on its own.

**`form`** — the structural patterns, positive/negative/question for each
form, in parallel: `S + have/has + V3 → 'She has visited.'` It renders in
monospace, so terse and symmetrical beats prose. No teaching here.

**`meaning`** — what each form *says*. The idea behind it, not yet the
rules for spotting it. If `meaning` and `usage` read the same, `meaning`
is wrong.

**`usage`** — when each is actually used, and above all **the signal
words that decide it in an exam**. This is the section a student will
recall under time pressure, so name the triggers explicitly.

**`examples`** — 4–6 clean, isolated English sentences, much simpler than
a test paragraph: teaching, not testing. Cover every form in the
contrast, one idea each. Each `note` is a short Turkish label naming the
form and why: `"Alışkanlık → Present Simple"`.

**`commonMistakes`** — 2–3 `{ wrong, right, why }`. The highest-value
section in the lesson. Use errors Turkish speakers genuinely make, not
invented ones; `wrong` and `right` should differ in exactly the thing
being taught and nothing else, because the app shows them stacked and any
other difference reads as noise. `why` is Turkish and names the rule that
was broken.

**`recap`** — one or two Turkish sentences the student could carry into
the exam. A decision procedure — "see X → use Y; see Z → use W" — not a
summary of the article. If it just restates `meaning`, rewrite it.

## Language

- `form`, `examples[].sentence`, `commonMistakes[].wrong` / `.right`:
  English.
- `intro`, `meaning`, `usage`, `examples[].note`,
  `commonMistakes[].why`, `recap`: **Turkish**.
- `category`: English, copied verbatim from the kickoff.

## You do not write check questions

The reader pulls them from the questions that share the lesson's
category, so a category never needs two parallel bodies of content kept
in sync. They are never scored and never block progress.

One thing follows from this that's worth knowing: some of that category's
test questions will be met right after your explanation rather than in an
exam run. If a question would only make sense to someone who has already
finished the topic, say so to the supervisor — that's a note for the
question author, not something to work around here.

## Renaming a category renames the lesson

Lesson ids are derived from topic + category, and a learner's progress is
stored against that id. Changing a category name is a taxonomy change:
questions, manifest and lesson have to move together, and existing
progress for it resets. Never do it on your own initiative — raise it.

## Before you hand it over

```bash
npm run validate
```

It won't see your file until the supervisor merges it, so validate by
temporarily assembling the topic file locally, or ask the supervisor to
run it. Either way, check what it checks:

- every `category` is one from the kickoff, verbatim, and used once;
- all seven fields present and non-empty in every lesson;
- at least 2 `examples` and 1 `commonMistakes` entry (aim for 4–6 and
  2–3);
- `wrong` and `right` actually differ;
- Turkish fields actually in Turkish.

Then read one lesson end to end as a student. If `recap` wouldn't change
what you do when you meet this contrast on an exam, rewrite it.

## Out of scope

Don't edit `js/`, `css/`, `*.html`, `data/manifest.json`, or the questions
array. If a lesson needs a section the schema doesn't have, say so and
stop rather than forcing it into `usage` — adding a section means
changing the validator and the reader too, and that's the supervisor's
call.
