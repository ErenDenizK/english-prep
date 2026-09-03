# Working with content agents

Content for this app — lessons and questions — is authored by separate
Claude sessions, not by whoever is working on the code. This directory
holds the briefs to hand those sessions, and this file describes how the
handoff works and why it's shaped this way.

## Why two agents

Two roles, because the work genuinely splits in two and the split is
clean:

- **Curriculum author** (`curriculum-author.md`) writes the `lessons`
  array for a topic — the Eğitim tab.
- **Question author** (`question-author.md`) writes the `questions` array
  — the Test tab.

They can work at the same time without reading each other's output. That
only holds because of the one thing they *must* agree on, which is settled
before either starts: the category taxonomy.

**Scale up by running a pair per topic in flight, not by adding roles.**
Two topics being authored at once means four sessions — two pairs — each
pair working from its own kickoff. A third role only earns its place when
a genuinely different kind of content appears; the obvious candidate is
Vocabulary / Word Formation, which needs a different question shape than
the paragraph-cloze format everything else is built on, and needs its own
schema design first.

`docs/education-notes.md` is the running content/dev channel — curriculum
order for upcoming topics, proposals from the content side, and the
development side's answers. Read it before a kickoff and write decisions
back into it, so the reasoning outlives any one session.

## The kickoff: decide categories before delegating

The category taxonomy is the coupling point between the two agents. A
lesson declares a `category`, a question declares a `category`, and the
app connects them by that string — a wrong answer on the results screen
links straight to the lesson that teaches it. If the two agents each
invent their own names, nothing links up.

The validator catches that drift (`category "X" is not used by any
question in this topic`), but catching it after both agents have finished
means throwing work away. So the taxonomy is decided **first**, by
whoever is supervising, and handed to both agents as fixed input.

A kickoff is short. Fill this in and paste it at the top of both briefs:

```
Topic id:      modals
Topic title:   Modals
Tier:          core-grammar
Level:         B2-C1

Categories (use these names verbatim, do not add or rename):
  1. Ability & Possibility (can / could / be able to)
  2. Obligation & Necessity (must / have to / should)
  3. Prohibition & Absence of Obligation (mustn't / don't have to)
  4. Deduction & Certainty (must be / can't be / might be)
  5. Past Modals (must have / should have / could have)
  6. Requests, Offers & Permission

Questions: 4 per category (24 total)
Lessons:   1 per category (6 total)
```

Rules of thumb for setting one:

- 5–7 categories per topic. Fewer and the results breakdown says nothing
  useful; more and each one is too thin to build a lesson around.
- Each category names a **confusable pair or triad**, not a single form —
  that's where real exam difficulty lives.
- 4 questions per category. That's the smallest number that makes a
  per-category score (`3/4`) mean something.
- One lesson per category, so every category a learner can fail has
  somewhere to send them.

## The loop

1. **Kickoff** — supervisor fixes the taxonomy and counts (above).
2. **Author** — both agents work in parallel, each producing one JSON
   array. Neither touches the manifest, the app code, or the other's
   array.
3. **Self-check** — each agent runs `npm run validate` and fixes what it
   reports. A drop that hasn't been validated isn't finished.
4. **Merge** — supervisor assembles the topic file from both arrays,
   updates `data/manifest.json` (`file`, `questionCount`, `lessonCount`,
   `categories`, `contentVersion`, and dropping `comingSoon`), and runs
   `npm run validate && npm test`.
5. **Review** — the validator checks shape, not teaching quality. The
   supervisor still reads the content and judges the things no script
   can: are the wrong options actually tempting, does the explanation
   name the trap, is the lesson's "Sınavda ne yaparsın" step a real
   procedure or a restatement of the rule?
6. **Ship** — commit to `test`, try it on a phone, then merge to `main`.

## What agents must not do

Both briefs say this, and it matters enough to repeat here. A content
agent does not:

- edit anything under `js/`, `css/`, or any `.html` file;
- edit `data/manifest.json` (the supervisor does that at merge time);
- invent, rename or drop categories from the kickoff;
- change the schema. If the schema seems to be in the way, say so and
  stop — that's a decision for the supervisor, and a schema change means
  changing the validator and the app together.
