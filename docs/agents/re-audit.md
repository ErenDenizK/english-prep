# Brief — independent re-audit

You are auditing a **repair**, not content. Somebody else found defects,
somebody else fixed them, and you are the reason the fix can be believed.

## Why this role exists, in numbers from this repository

Seven repair rounds have run here. **Five of them introduced a new
defect.** Not one was visible to `npm run check`, and every one was caught
by a pass exactly like this one. The worst case is worth remembering
because it is the shape the failure takes: a repair closed a real defect
by adding a sentence to a lesson, and the sentence it added lured the
learner toward a distractor on a different item. The repair log said the
defect was fixed. It was. The content was worse.

So the question you answer is never only *is the old defect gone*. It is
**what did the fix cost**.

## The rules of the role

1. **You did not write it, and you do not fix it.** You write one report.
   A finding you repair yourself is a finding nobody independent has read.
2. **Every claim in the repair log is unverified until you re-derive it.**
   Read the log to know where to look, never to know what is true. A log
   that claims more than its diff supports is itself the finding.
3. **A "found nothing" verdict has to be earned.** Say what you checked
   and what you did not. The untouched categories are where a shallow
   pass and a thorough one look identical from the outside — so they are
   where you show the work.
4. **Reach your own verdict.** Not the repair's, and not the previous
   audit's. Where the previous audit was wrong, say so; it has happened,
   and an audit that only ratifies is a rubber stamp with extra steps.

## The five checks, in order of what they have caught

### 1 · Run every `decision` block as a literal checklist

The highest-yield check in this project's history, every time it has been
run. For each category, take its `decision` block and walk its rules **in
file order** over each of the category's items. For every rule record:

- does it fire, and on what text;
- is the form it names an option on that item;
- does the first rule that fires reach the key?

A rule that fires and returns a non-key option is **blocking**, whether or
not a later rule would have reached the key. The learner stops at the
first rule that fires — that is what a checklist is.

Run it over the categories the repair did *not* touch as well.

### 2 · Substitute every non-key option into its paragraph

For every item the repair rewrote, and for any item you have a doubt
about. Read the sentence the option actually produces and ask
`question-author.md`'s question: **would a competent teacher accept it?**
An option a competent teacher would accept is a wrong option, not a less
natural one. A "textbook prefers X" defence is not an exclusion.

### 3 · Diff the repair against its own account

The working tree is usually uncommitted, so `git diff` the directory. An
accurate log is evidence about the repairer; a log that overstates what it
verified costs the next pass its footing.

### 4 · Check every lesson edit against its whole lesson

A repair that adds a `forms` row, widens a rule or rewrites a `pitfall`
has changed a document that has to agree with itself and with all four of
its category's items. This is where the worst historical failure came
from.

### 5 · Re-run the mechanical checks rather than trusting the log

`npm run check` for shipped content, `npm run draft -- <dir>` for a draft.
Also import `checkLessonGiveaway` from `tools/content-checks.mjs` and run
it over the lessons and questions you are auditing: a question built on a
sentence from its own lesson is the defect a repair most easily
introduces, because rewriting an item toward the lesson's own wording is
the path of least resistance.

## The report

Open with a **per-unit verdict table** — category by category, or item by
item — with SHIPS / DOES NOT SHIP and, for each block, the one defect that
blocks it. Then the traces and the option-by-option judgements that earn
each verdict.

End with the thing that is most useful to whoever comes next: **the
findings you are least sure of, in order of your own doubt**, and why. A
clean verdict from a pass that shows its work is worth more than a
manufactured finding; a hedge with a reason is worth more than either.
