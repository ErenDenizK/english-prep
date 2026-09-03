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

Eğitim is not a slideshow and not a grammar reference. It's a short
interactive textbook — the learner walks through a lesson one step at a
time, reads a rule, sees it compared side by side, and gets asked a
question before moving on. Write for that experience.

Read `docs/CONTENT_GUIDE.md` first — it is the authoritative schema and
the validator enforces it. Read the six lessons in
`data/tenses/tenses.json` as a worked example of structure and voice.

Deliver **one file**: `data/<topicId>/<topicId>.lessons.json`, containing
a single JSON array of lesson objects. Nothing else. Do not touch
`data/manifest.json`, the app code, or the topic's questions — a separate
session is writing those.

## Shape

One lesson per category, `order` running `1..n` in the kickoff's order.
Each lesson is a list of steps of three types: `read` (Turkish prose with
`**bold**` and optional English example sentences), `table` (a side-by-side
comparison), and `check` (an inline question the learner must answer to
continue). See the content guide for the exact fields.

## The shape that works

Five to seven steps, following the pattern the Tenses lessons use:

1. **`read`** — what the forms actually *do*. Not conjugation tables: the
   job each form performs, and how they differ. Two or three example
   sentences.
2. **`table`** — the signal words, side by side. This is what a learner
   will picture in the exam, so make the columns the forms being
   contrasted and keep the cells short.
3. **`check`** — a quick check on exactly what you just taught. Two
   options is often stronger than four right after a binary contrast.
4. **`read`** — **the trap**. The exception, the over-applied rule, the
   case where the obvious answer is wrong. Every category has one, and it
   is the most valuable step in the lesson.
5. **`check`** — a harder check, four options, covering the trap.
6. **`read` — "Sınavda ne yaparsın"**. A concrete procedure for a real
   exam question: what to scan for first, what that lets you eliminate,
   what to do when there's no signal at all. This step must be a
   *procedure*, not a summary of the rule.

Deviate where the grammar calls for it — but every lesson needs at least
one `check` (the validator rejects lessons without one), and every lesson
should end by telling the learner what to actually do under exam
conditions.

## The quality bar

**Teach the contrast, not the form.** The category names a confusable
pair or triad. The lesson exists to make that specific confusion go away.

**Prose is Turkish, examples are English.** Explain in the learner's own
language; demonstrate in the language being learned. Use `**bold**` for
the form under discussion, sparingly — bolding half a paragraph bolds
nothing.

**Example sentences are teaching, not testing.** Clean, short, isolated —
the opposite of a test paragraph. Each carries a `note` naming the form
and why: `"Alışkanlık → Present Simple"`. One idea per example.

**`title` is Turkish and specific.** It's the lesson's name on the index,
next to the English category label. `"Rutin mi, şu an mı?"` tells a
learner what they're about to sort out; `"Present Simple"` just repeats
the category.

**`summary` is one Turkish sentence** saying what the learner walks away
with. It's read on the index, before they commit — make it worth tapping.

**`check` steps are for sticking, not grading.** Nothing is scored or
recorded. So make them the moment the rule bites: the sentence where
picking the wrong form is tempting. The `explanation` (Turkish, shown
either way) should name why the tempting option fails.

**Keep it finishable.** A lesson should take a few minutes. If a category
needs more than seven steps, tell the supervisor it should be split
rather than writing a long one.

## Ids are permanent

A learner's progress is stored against `id`. Never reuse an id for
different content, and never renumber ids in an existing topic — that
silently moves someone's completed lesson to a different one. New content
gets new ids.

## Before you hand it over

```bash
npm run validate
```

It won't see your file until the supervisor merges it, so validate by
temporarily assembling the topic file locally, or ask the supervisor to
run it. Either way, check what it checks:

- `order` runs `1..n`, no gaps or duplicates;
- every `category` is one from the kickoff, verbatim;
- every lesson has at least one `check` step;
- `**` markers are balanced in every `body`;
- every table row has exactly as many cells as there are columns;
- check `options` are 2–4 and distinct, `correctIndex` in range and
  pointing at the option you meant;
- prose, notes, summaries and explanations are in Turkish.

Then read one lesson end to end as a student. If the last step doesn't
change what you'd do when you meet the question on an exam, rewrite it.

## Out of scope

Don't edit `js/`, `css/`, `*.html`, `data/manifest.json`, or the questions
array. If a category needs a step type the schema doesn't have, say so and
stop rather than working around it — adding a step type means changing the
validator and the app too, and that's the supervisor's call.
