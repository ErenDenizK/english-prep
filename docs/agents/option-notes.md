# Brief — `optionNotes`

You are writing the one line a learner sees when they pick a **wrong**
option: what that option would have meant, and why this item does not
select it.

This brief is the method five topics were written to (`connectors`,
`closest-meaning`, `quantifiers`, `relative-clauses`,
`gerunds-infinitives` — reports in `docs/audit/option-notes-*.md`). Follow
it rather than inventing one, and add to it if you find something it
does not cover.

## Your scope

One topic file, named in your task. `data/<topic>/<topic>.json`, and
nothing else under `data/`. You may **read** anything in the repository.

## What the field is

`docs/CONTENT_GUIDE.md` §`optionNotes` is the schema and it is enforced:

- An object **keyed by the option text**, never by index — the engine
  shuffles options and scores against the string.
- Every key must be one of that question's own options. Validator error.
- **Never a note on the correct answer.** The explanation already argues
  for it, and a note beside it reads as a second key. Validator error.
- Turkish. English forms inside the sentence are fine and expected —
  they are the thing being talked about.
- `**bold**` works (`appendInline`). Nothing else does: no italics, no
  lists, no line breaks.
- The validator warns past **160 characters**. Aim for 80–140. Past 160
  the note competes with the explanation it sits under, in a fixed-height
  shell, on a phone.

## The one fact that shapes every note

`js/feedback.js:58` shows **only the note for the option the learner
actually chose.** They will never see the other two.

So each note is a standalone sentence addressed to the person who
believed *that* option. It may not say "the other two are also wrong", may
not compare the three, and may not assume anything has been read except
the question itself.

## How to write one

For each item, in this order:

1. Read the paragraph or sentence, the key, the `explanation`, the `tip`,
   and the **lesson for that item's category** (`data/<topic>/<topic>.json`,
   `lessons[]`). The note must use the lesson's own vocabulary, in
   Turkish, or the learner meets a second terminology for one rule.
2. Substitute the wrong option into the sentence and read it as written.
3. Write **the belief that would make it look right**, then **the one
   property of this item that defeats it**.

One reason, not a recital. If an option fails on both form and meaning,
name the one that actually decides it here. Two reasons in 140 characters
is two half-explanations.

Never:

- restate the key ("doğrusu X'tir") — the verdict line above already says it;
- describe the option in the abstract without touching this item;
- write the same note twice in a topic. If two options in one item fail
  for the same reason, they are one distractor and that is a **finding**
  about the item, not a licence to duplicate a sentence.

## Worked shape

> `has gone`: **Gidip henüz dönmemiş olmak.** Paragraf bir sonuçtan değil,
> tamamlanmış bir yolculuktan söz ediyor.

Belief, then the property of *this* paragraph that defeats it.

## Finish

```bash
npm run format      # required — several sessions write into data/
npm run check       # must be 0 errors, 0 warnings
```

Then write `docs/audit/option-notes-<n>.md`: how many notes, the longest,
what the topic's notes turn on, and — the part that is worth more than
the notes — **any item where writing the notes showed the item itself is
weak**: two distractors that are one distractor, an option a competent
teacher would accept, an explanation that argues for something the
paragraph does not say. Report those; do not fix them. A repair is a
separate pass with its own reviewer, per `docs/agents/README.md`.
