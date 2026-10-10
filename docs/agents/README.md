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

`docs/history/education-notes.md` is the running content/dev channel — curriculum
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
   `categories`, `contentVersion`, and dropping `comingSoon`), runs
   `npm run format`, and then `npm run check`.

   The formatter is the supervisor's job, not an agent's, and that is
   deliberate: two agents running it concurrently would clobber each
   other's files. Agents write valid JSON and leave the shape alone.
5. **Review** — the validator checks shape, not teaching quality. The
   supervisor still reads the content and judges the things no script
   can: are the wrong options actually tempting, does the explanation
   name the trap, do a lesson's `pitfall` blocks differ in exactly the
   thing being taught, do the signal words in its `decision` block really
   decide the answer or only usually? And, because a lesson is a page of
   typed blocks rather than an article, whether the author used them: a
   lesson carried by `text` blocks is the old prose in new packaging.
6. **Ship** — commit and push to `test` after the checks, then try it on a phone. `main` is the owner's.

## What agents must not do

Both briefs say this, and it matters enough to repeat here. A content
agent does not:

- edit anything under `js/`, `css/`, or any `.html` file;
- edit `data/manifest.json` (the supervisor does that at merge time);
- invent, rename or drop categories from the kickoff;
- change the schema. If the schema seems to be in the way, say so and
  stop — that's a decision for the supervisor, and a schema change means
  changing the validator and the app together.


## Why the pipeline works this way

Moved here from `CLAUDE.md` on 2026-10-10: these are the incidents behind the content rules.

Lessons and questions are written by separate Claude sessions working
from `docs/agents/`. The supervisor fixes the category taxonomy first —
that's the one thing the two agents must agree on, and the thing the app
uses to link a wrong answer on the results screen to the lesson that
teaches it. See `docs/agents/README.md` for the loop.

**A reviewer is calibrated with a file, never with a document.**
`docs/agents/calibration.md` is the supervisor's *key*; `npm run calibrate`
assembles the same ten items from `data/` and `npm run blind` unkeys them.
Two briefs said "work the calibration set" and pointed at the key. Both
reviewers obeyed, read the answers, and refused to report a score — which
was correct, and cost two review passes their only measurement. The ids
live in `tools/make-calibration.mjs` so that building the corpus never
opens the key.

**Blind a corpus with `npm run blind`, never by hand.** The first
hand-rolled attempt hid `correctIndex` and `explanation` and left `tip`
— and a tip is a standalone rule written for the item it belongs to, so
it names the keyed form outright in twenty-two items out of
twenty-four. Two reviewers opened their reports by saying so and had to
discount their own agreement rate, which is the one number a blind pass
exists to produce. `tools/blind-corpus.mjs` works by allow-list, shuffles
the options, and writes the key back beside the source rather than into
the directory the reviewer is pointed at.

**The one step that cannot be delegated is a person solving the item.**
`npm run solve` puts items in a terminal unkeyed, shuffled and with the
category hidden, and records the result in `docs/audit/solve-log.json`;
`docs/agents/solver.md` is the protocol, and it is written for a human
rather than a session. The finding it exists to collect is not the score
but the `b?` answer — *I chose b and another option is defensible too* —
which is the project's "an option a competent teacher would accept is a
wrong option" rule, seen from the solver's side. Measured cost: ~7
minutes an item, ~28 hours for the corpus, which
`docs/history/business/vision.md` argues is the gate on charging money.

**Content is reviewed by a session that has not seen the key.** The one
controlled comparison in the literature found teacher-plus-AI items
carrying *more* flaws than teacher-only items, because reviewers gave the
drafts less engagement — so `docs/agents/reviewer.md` is built to stop
that, and `calibration.md` grades the reviewer against ten items whose
answer is already known before its findings are believed. This applies to
your own rewrites too: three of the first six failed their re-review, one
because the fix traded a defect for a worse one.

**Write the category spec before the content.** `docs/agents/category-spec.md`,
with a worked example beside it. Every finding worth acting on in the
first review was invisible inside one item and obvious across four, which
is what the spec is for.

Two rules that only exist because a review found them, both in
`docs/agents/question-author.md`: a question must never be built on a
sentence from its own lesson (`check` blocks draw from the same category,
so the learner would meet the answer three blocks above the question),
and an option a competent teacher would accept is a wrong option, not a
less natural one.
