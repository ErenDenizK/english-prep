# academic-verbs — repair log

Started 2026-09-04 by the supervisor, after the item review
(`REVIEW-items.md`) and the lesson sufficiency review
(`REVIEW-lessons.md`).

**This log covers one finding of several. The topic is not repaired and
must not ship.** Two repair agents were commissioned for the full list
and both terminated on a session rate limit before changing anything;
what follows is the single blocking defect the supervisor took on
directly because it is a false statement about English rather than a
judgement call. Everything else in both reviews is still open, and is
listed at the bottom.

**Both reviewers were uncalibrated** — their briefs mistakenly pointed
them at the answer key, they read it, and they correctly refused to
report a score. Their findings are therefore evidence, not verdicts. The
finding below was re-verified against the files before anything changed.

---

## Fixed: `Change & Emergence` taught something false, and it eliminated
its own key

**The finding, verified.** The lesson said in three places that `emerge`
requires the thing not to have existed before:

| Where | What it said |
| --- | --- |
| `contrast` b1, the `emerge` side | *"Öncesinde ortada o şey yoktur."* |
| `pitfall` b8, the `why` | *"Öncesinde o şey yoksa emerge kullanılır."* |
| `decision` R1 | *"…öncesinde ortada olmayan bir şeyin ilk kez göründüğünü söylüyorsa"* |

That is not true of English — *the sun emerged from behind the cloud* —
and it is not true of this category's own first item. `academic-verbs-t1`
keys `emerged` for a bridge parapet that stood under a reservoir for
fifty years and rises *"above the surface **again**"*. Run literally, R1
never fires on t1, and R4 (*measurable quantity, direction down*) then
fires on *"the water dropped so far"* and certifies `declined`, which is
on the paper. The procedure did not merely fail to reach the key; it
pointed at a distractor.

The item's own `tip` already carried the correction — *"ilk kez **ya da
yeniden**"* — which appeared nowhere in the lesson. An item quietly
repairing its lesson is the tell that they were written apart.

**What changed.** Four edits, and the two rule edits bind to the same
thing:

1. **b1 `emerge` gloss** — now: *"Görünmeyen ya da bilinmeyen bir şey
   görünür hâle gelir: ilk kez ortaya çıkabilir, ya da onu örten şey
   kalktığı için yeniden. Belirleyici olan, öncesinde görünmüyor
   olmasıdır — var olmaması değil."* The distinction is stated as a
   relation; the block's own example (`A new approach emerged.`) is
   unchanged.
2. **b8 `pitfall` why** — the false universal is gone and the pitfall
   still teaches what it was for: `evolve` is an existing thing turning
   into something else and the sentence says what into; `emerge` is
   something coming into view.
3. **R1** now reaches a thing becoming visible *again*, **and** requires
   the blank's subject to be the thing becoming visible.
4. **R4** now requires the blank's subject to be the measurable quantity
   itself.

**The subject binding is not invented.** The lesson's own `forms` block
already gives each verb the subject it takes — `emerge`: *eğilim, kanıt,
sorun*; `decline`: *sayı, oran, düzey*. The rules were simply not
carrying what the forms rows already said, which is the failure class
`curriculum-author.md` names as *rules written against the lesson's
examples rather than against the items*. Nothing here is quoted from a
live item: an illustration lifted from an item goes stale the moment the
item is reworded, and that is how two previous repairs regressed.

**The whole block re-traced afterwards**, not just the repaired rules:

| Item | Key | Resolves at | Distractor certified? |
| --- | --- | --- | --- |
| t1 | `emerged` | **R1** — parapet is the thing coming into view | no; R4 is blocked by its subject clause (the falling quantity is the water, not the parapet) |
| t2 | `shifted` | **R2** — start point and end point given | no; R3 needs long gradual development and the paragraph says *abrupt*, *within three issues* |
| t3 | `declined` | **R4** — enrolment is the measured quantity and it is the subject | no; R5 is blocked by its own *no measured quantity* clause |
| t4 | `faded` | **R5** — intensity disappearing, no number | no; R4 is blocked, there is no quantity |

4/4 reach a verdict, 4/4 are the key, 0 distractors certified.

**Blast radius checked.** No item outside this category offers any of the
five verbs as an option, so the repaired rules govern only their own set.
`npm run draft` stays at 0 errors.

---

## Not done, and still blocking

Nothing below has been touched.

- **`Cause & Consequence`, L5** — `trigger` and `prompt` never appear in
  the same option list, so the set's hardest pair is never the decision.
  The fix is at paragraph level (make one of them genuinely wrong), not
  by adding an option: `drafts/README.md` records why they cannot
  currently share an item.
- **`Claim & Concede`, L5** — `acknowledged` is absent from `t11`, the
  only `concede` item.
- **`Allocate & Withhold`** — the item review's arithmetic, unverified
  here: polarity alone leaves 2 options in t21/t22/t23 and **1 in t24**.
- **Second defensible answers** — `t22` (`assigned`/`allocated`), `t23`
  (`withheld`/`retained`, whose lesson discriminator is contradicted by
  `t24`), `t18` (`restricts`/`suspends`, borderline).
- **Six items pre-solved by a lesson sentence** — `t5`'s `sell-off` is
  verbatim; `t21` *is* its lesson's pitfall. Fix the lesson's English,
  not the items.

## Before this ships

**This repair needs an independent re-audit like any other.** Three of
the first six repairs in this project failed their re-review, one because
the fix traded a defect for a worse one — and the supervisor wrote this
one, so nobody uncommitted to it has read it yet. The trace above is a
claim, not a verification.
