# The category specification

One page per category, written **before** its questions and its lesson,
and handed to both authors as fixed input alongside the kickoff.

It costs about an hour. It exists because of what the first content
review found (`docs/content-review.md`): every defect worth acting on in
72 questions was **invisible while reading one item and obvious across
four**. An untested caveat, a cue-only category, a set that spans one
half of its own contrast, four options that are really two — none of them
can be seen by an author writing item three, or by a reviewer reading it.

A category spec is the artefact that makes them visible, because it says
in advance what the four items are each for.

---

## The template

Copy this, fill it in, and keep it beside the topic file.

```markdown
# <Category name, verbatim from the kickoff>

## 1 · The discrimination

One sentence: what a learner who has this right can do that a learner who
has it wrong cannot. Not "knows the present perfect" — *"can tell whether
a period is still open when the sentence gives no date."*

Then the **honest bound**: what this category can *not* discriminate, and
therefore must not be keyed on. Every category has one; writing it down
is what stops an author reaching for it in item three.

## 2 · Misconceptions

Numbered, and specific to Turkish speakers. **Every distractor in every
question must cite one of these by number.** A distractor that cites
nothing is decoration, and this is the rule that makes a dead option
visible at authoring time instead of at review time.

  M1. <the belief> → <the wrong answer it produces>
  M2. ...

Three to six. If you cannot find three, the category is too narrow to
carry four questions.

## 3 · The item plan

Four rows. Fill in every column before writing a single paragraph.

| # | keys | tests | decided by | misconceptions punished |
|---|---|---|---|---|
| 1 | <form> | <which half of the contrast> | signal / meaning | M1, M3 |
| 2 | ... | | | |

Three rules the table has to satisfy:

- **Both halves of the contrast are keyed.** A 3:1 split means guessing
  the majority form scores 75%.
- **At least one item is decided by meaning, not by a signal word.** If
  all four are decided by a trigger sitting next to the blank, the
  category can be passed without reading the paragraph — measured, in
  three of this app's nineteen categories.
- **At least one item punishes the rule.** The lesson's own caveat — the
  word that appears on both sides, the form that looks like the other
  one — has to be the thing that decides one item. A caveat no question
  ever springs is a caveat the learner can score 4/4 without holding.

## 4 · Context bank

Eight to twelve one-line scenarios, from **different domains**, assigned
one per item and the rest spare. Written here rather than invented per
item, because an author writing four paragraphs in one sitting writes
four about university.

Two hard constraints:

- **No scenario may reuse a sentence from the lesson.** `check` blocks
  are filled from this category's own questions, so a question built on
  the lesson's example sentence is a check whose answer the learner read
  three blocks earlier. This was true of 20 of 24 keys in one topic
  before anybody counted.
- **No two items in the category share a scenario.** `npm run validate`
  now fails this, but the spec is where it is cheap to fix.

## 5 · Difficulty recipe

What makes an item in *this* category hard, in order:

1. <e.g. the period is open but no signal word says so>
2. <e.g. the deciding clause comes after the blank>
3. ...

And what makes one artificially hard, which is not the same thing and is
not wanted: obscure vocabulary in the paragraph, an option nobody would
consider, a decision between two acceptable answers.

## 6 · Coverage ledger

Every form the lesson teaches, against how it appears in the questions:

| form | key | distractor | absent |
|---|---|---|---|

**A form taught in the lesson and absent from every option list is a
hole.** One topic taught fifteen such forms; its own Future Passive was
taught in two lessons, with the same example sentence, and tested
nowhere. Nobody could see it until it was written as a table.
```

---

## Worked example

`should-vs-ought-to-vs-had-better.md` in this directory is a real one,
written after the category failed review three times. It is worth reading
before writing your first spec, mostly for §1's second half: the category
turned out to be unable to discriminate the thing its own name promises,
and no amount of item rewriting was going to fix that. A spec written
first would have caught it in an hour instead of a round.
