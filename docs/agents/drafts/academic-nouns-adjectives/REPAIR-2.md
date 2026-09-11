# academic-nouns-adjectives — second repair, against RE-AUDIT.md

Written 2026-09-04 by a session that wrote neither `REPAIR.md` nor
`RE-AUDIT.md` nor either review. Scope was one directory:
`docs/agents/drafts/academic-nouns-adjectives/`. Nothing under `data/`,
no code, and nothing in `academic-verbs` was touched.

The task was the two categories `RE-AUDIT.md` §1 blocks:

| category | blocking defect | status |
| --- | --- | --- |
| **Significance & Priority** | §3.1 — t15 as rewritten *is* `pitfall` b8, which sits immediately above a `check` that draws from this category; and §4 — `looked ____ ; even so` still admits `negligible` | **fixed, one rewrite for both** |
| **Stance & Disposition** | §3.2 — `pitfall` b8's `wrong` (*"The wording was reluctant."*) marks as an error the transferred epithet `contrast` b1 and `forms` license and t21's key requires | **fixed** |

`RE-AUDIT.md` §7 says these are one problem and one problem: *"the frame
that reproduces the pitfall is the frame that admits the pitfall's `wrong`
word."* Both fixes below are built on that reading.

---

## 0 · A bookkeeping accident I have to declare first

My brief said **do not commit**. I did not run `git commit`. But while I
was working, a **concurrent session** committed
`c2e0fc7 "Check that an option note reaches the screen, and land the lesson pass"`
with `git commit -a`-shaped staging, and it swept up my two
**lessons.json** edits as they stood at that moment. `git show c2e0fc7 --
docs/agents/drafts/academic-nouns-adjectives/lessons.json` shows exactly
two hunks, both mine: the `Significance` b6 noun swap (in an intermediate
form I later changed again) and the whole `Stance` b8 replacement.

Consequences a re-auditor needs to know:

- The **`Stance` b8 fix is already in history**, inside a commit whose
  message says nothing about it.
- The `Significance` b6 change is in history **in a form I have since
  superseded** (`time / wasted` → `stock / destroyed`, and the reason for
  the second change is §3 below). The superseding edit is uncommitted.
- The **questions.json** changes are entirely uncommitted, as intended.

I did not try to unpick this. Rewriting another session's commit to
extract my lines is a larger and riskier act than leaving an accurate
note, and the working tree is correct either way. `git diff` against
`c2e0fc7` shows the rest of my work.

Also visible in the tree and **not mine**: uncommitted edits to
`tools/validate-content.mjs` and `tools/content-checks.mjs` by the same
concurrent session, adding a `checkLessonGiveaway` check. I used it (§6)
but did not write or modify it.

---

## 1 · Significance & Priority — t15 rewritten

### What §3.1 and §4 actually charged

Two charges, one cause. `pitfall` b8 is

> **wrong:** *The effect was negligible, but it changed the outcome.*
> **right:** *The effect was marginal, but it changed the outcome.*

and t15 as the first repair left it was *"the tyre figure looked ____ ;
even so, it was those four tenths that carried the depot…"* — the same
shape (small word · contrastive · it changed the outcome), the same two
candidate words, three blocks under the block that names which of the two
is right in that shape. Separately, §4 showed the fix had not closed the
D1 it was aimed at: *looked* scopes the judgement to appearance, and
*"beside the seven-per-cent scheme the tyre figure looked negligible; even
so…"* is ordinary English a teacher accepts.

Both live in the concessive frame. So the frame goes.

### The rewrite

Before:

> Fitting the whole fleet with the new tyres cut fuel use by four tenths
> of one per cent — a saving the depot could measure, but only just.
> Beside the driver-training scheme that took seven per cent off the same
> bill the tyre figure looked **____** ; even so, it was those four tenths
> that carried the depot under its emissions cap in November, and the
> finance office has kept them in the accounts ever since.

After:

> Fitting the whole fleet with the new tyres cut fuel use by four tenths
> of one per cent. The depot's auditors call that a **____** saving:
> anything the fuel meters can separate from ordinary week-to-week
> variation has to be carried in the annual return, so the four tenths are
> entered in full rather than rounded away.

Options are unchanged — `{marginal, negligible, substantial,
considerable}`, key `marginal` — so the contest the review asked for
(`marginal` vs `negligible`, the pair the lesson works hardest on and no
item decided) is still the contest. What changed is **what decides it**:
not a consequence set against the blank by a concessive, but an accounting
statement in the vocabulary of the lesson's own discriminator — whether
the quantity may be dropped from the calculation.

Consequences of the rewrite, each checked:

- **No concessive, no consequence.** Nothing in the paragraph now depends
  on the four tenths, and there is no *even so* / *but*. The pitfall's
  shape is not reproduced, and the shape is what §3.1 charged.
- **Slot changed too.** The pitfall's slot is bare predicative (*The effect
  was ____*); t15's is now attributive (*a ____ saving*), which `forms`
  licenses (`a marginal + N`).
- Explanation, tip and all three `optionNotes` rewritten against the new
  paragraph's own facts (*binde dört*, *yıllık beyan*, *yuvarlanıp
  atılmıyor*). The tip was already transferable and true of the new
  paragraph, so it is unchanged.
- `November`, `emissions cap`, `driver-training`, `seven per cent` are all
  gone from the item. The word `figure` is gone (it can read as *a
  peripheral person* before an adjective like `marginal`, which is why the
  head noun is now `saving`).

### The three wrong options, substituted into the rewritten paragraph

The test is `question-author.md` rule 2: an option a competent teacher
would **accept** is a wrong option, not a less natural one.

| option | filled sentence | verdict |
| --- | --- | --- |
| `negligible` | *"The depot's auditors call that a **negligible** saving: … so the four tenths are entered in full rather than rounded away."* | **Rejected.** The colon makes the second clause the *reason for* the label, and it states that the figure is carried in full. A negligible quantity is by definition one that need not be counted. The sentence refutes its own label. |
| `substantial` | *"…call that a **substantial** saving: anything the fuel meters can separate from ordinary week-to-week variation has to be carried…"* | **Rejected.** Four tenths of one per cent, and the whole reason clause is about a figure at risk of being rounded away. A substantial saving needs no rule to keep it in the books. |
| `considerable` | *"…call that a **considerable** saving: …"* | **Rejected.** Same size objection, and `considerable` sits on unmeasured abstract degrees (*interest, difficulty*) per the lesson's own gloss — the opposite of a metered fuel figure. |

None is a **dead** option (rule 3): all four are ordinary adjectives before
`saving`, all four are grammatical, and each fails on an axis the lesson
teaches — size, or whether the amount stays in the calculation.

The blank's immediate neighbours (*call that a ____ saving*) decide
nothing; both pieces of evidence — the size, and the countability — sit
elsewhere in the passage. That is rule 4's requirement, and this item is
now decided by meaning rather than by any trigger word.

**Honest cost.** Dropping *"Beside the driver-training scheme that took
seven per cent off the same bill"* removed a comparison that pulled on the
size axis. `substantial` and `considerable` are now excluded by *"four
tenths of one per cent"* alone, which is sufficient but flatter than
before. I judged that acceptable because that same comparison is precisely
what §4 showed made `negligible` defensible, and because the item's real
contest was never on the size axis.

---

## 2 · Stance & Disposition — `pitfall` b8 replaced

### What §3.2 charged

`contrast` b1's `reluctant` gloss and the `forms` attributive row, both
added by the first repair, license carrying a person's unwillingness onto
the work they do — which is exactly what t21's key is (*a **reluctant**
signature*). `pitfall` b8 then printed an instance of that transfer as an
error:

> **wrong:** *The wording was reluctant.* → **right:** *The wording was
> deliberate.*
> **why:** *…reluctant kişinin gönülsüzlüğünü anlatır; bir eylemi kasıtlı
> diye niteleyemez.*

*Wording* is work a person did. The lesson contradicted itself, three
blocks above a `check` that draws from this category.

There is a second thing wrong with the old block that §3.2 did not need to
say: **it was never a real error.** No Turkish B2 learner reaches for
`reluctant` when they mean *on purpose*. `CONTENT_GUIDE.md` asks a pitfall
for "a real error a Turkish speaker makes, not an invented one".

### The replacement

> **wrong:** *The board wanted the merger and was **reluctant**, so it
> asked for a second legal opinion.*
> **right:** *The board wanted the merger and was **cautious**, so it
> asked for a second legal opinion.*
> **why:** *reluctant yapmayı istememektir; kurul birleşmeyi istiyor,
> dolayısıyla gönülsüz değil. Ağır davranmasının nedeni istememek değil,
> hukuki risk — riski tartarak ölçülü ilerlemenin sözcüğü cautious'tır.*

Why this one and not another:

- **It is the error the lesson already says is the live one.** `text` b10:
  *"cautious ile reluctant birçok cümlede birbirinin yerine geçer… Fark
  nedendedir: cautious bir riskten kaçınır, reluctant istemeden yapar."*
  That claim had no worked example anywhere in the lesson. It does now.
- **The `wrong` is wrong on meaning, not on syntax**, which is b7's proven
  shape (*The campaign was cautious and never let up.*). *wanted the
  merger* and *was reluctant* cannot both hold: `reluctant` with no
  complement means unwilling to do the thing at hand. A teacher marks it.
  I deliberately avoided *"was reluctant about the legal risk"*, which was
  my first draft: *reluctant about* is attested often enough that a teacher
  might let it stand, which would have been rule 2 all over again.
- **`cautious` is the only one of the five that is never a key** — it is a
  distractor at t21, t22 and t24 and nothing else. So a learner served a
  check at b9 cannot lift any item's answer out of this block. The old b8
  named `deliberate`, which *is* t22's key.
- **The `right` words across the lesson's three pitfalls are now
  `reluctant` (b6), `persistent` (b7), `cautious` (b8)** — three different
  words instead of the previous overlap.

`deliberate` loses its pitfall. It keeps `contrast` b2, two `forms` rows
and an `examples` sentence, so every rule about it is still demonstrated;
`CONTENT_GUIDE.md` asks for 2–3 pitfalls per lesson, not one per word, and
the lesson still has three.

### Checked against every other block in the same lesson

| block | interaction | verdict |
| --- | --- | --- |
| b0 `text` — *"Ayrımı yapan **neden**dir. İstemediği için mi, riskten çekindiği için mi…"* | b8 is a direct instance of the question the lesson opens on | consistent |
| b1 `contrast` — `reluctant` *"İstemiyor… Kişiyi niteler; kişinin gönülsüzlüğü onun yaptığı işe de taşınabilir"*; `cautious` *"yapmak isteyebilir, ama tehlikeyi ya da belirsizliği tartıyor"* | b8's subject is a party, not a product, so **the transferred epithet is neither used nor denied**; b8's `why` restates the `cautious` gloss | **the §3.2 contradiction is gone** |
| b2 `contrast` (`deliberate` / `persistent`) | b8 names neither | no interaction |
| b3 `forms` | b8's `right` is bare predicative `was cautious`. The table lists `be cautious about + N` and `a cautious + N`, and its own heading says *"yeri tek başına hiçbir şıkkı elemez"*; `contrast` b1's example is *"Investors remain cautious."* — bare predicative already licensed | consistent |
| b5 `examples` — *"The bank stayed cautious about lending."* | different sentence, different frame, no duplicate | consistent |
| b6 `pitfall` (*reluctant of admitting* → *to admit*) | a **form** error; b8 is a **meaning** error, and its `why` says so outright, so b8 cannot be misread as claiming bare `reluctant` is ungrammatical | consistent |
| b7 `pitfall` (*cautious* → *persistent*) | b7 marks `cautious` wrong where there is no let-up; b8 marks it right where a risk is being weighed. Both are b1's gloss | consistent |
| b10 `text` | b8 is b10's rule instantiated | consistent, and b10 gains its missing example |
| b11 `decision` R4 (`cautious`: *"kaçınılan bir riskten söz ediyorsa"*) | b8's `right` resolves at R4; R1–R3 are blocked (no accident contrast, no repetition, the board plainly cares) | consistent |

### Checked against all four of the category's items

| item | key | does b8 disturb it? |
| --- | --- | --- |
| t21 | `reluctant` | No. b8 marks bare `reluctant` wrong **only where the party wants the thing**; t21's head of department refused twice and still calls the change a mistake. b8 also requires an avoided risk for `cautious`, which t21 has none of — that is t21's nearest distractor, and b8 helps exclude it by the rule rather than by the item |
| t22 | `deliberate` | No. b8 names neither `deliberate` nor `indifferent`; it tightens `cautious`, a t22 distractor |
| t23 | `persistent` | No. `reluctant` is t23's nearest distractor, and b8's ground for rejecting `reluctant` (the party wants the thing) is the widow's case exactly |
| t24 | `indifferent` | No. `cautious` and `reluctant` are both t24 distractors; b8 requires a risk or an unwillingness, and t24 supplies neither |

No item's frame is reproduced: b8's is *X wanted Y and was ____, so …*;
t21 is attributive before a noun, t22 is *had been ____ , not careless*,
t23 is *but she was ____ , and six years on*, t24 is *it was simply ____*.

---

## 3 · One change the re-audit asked for as a note, and the false start in it

`RE-AUDIT.md` §3.6 records a §C hit nobody had listed: `Significance`
`pitfall` b6 was *"A **crucial** amount of water was **lost**."* → *"A
substantial amount of water was lost."*, and t13 keys `crucial` on a
quantity of rain whose paragraph ends *"the whole planting would have been
**lost**."* §3.6 calls it pre-existing, not false teaching, and *"worth the
supervisor's attention while this category is open anyway"*. The category
is open, so I took it: only the two nouns change, and the `why` — the
sentence that carries the teaching — is untouched.

**My first attempt at it was wrong and I reverted it.** I first wrote *"A
crucial amount of **time** was **wasted**."* → *"A substantial amount of
time was wasted."* Then I ran the check the brief asks for — the pitfall's
`right` word against every item in the category — and `substantial` is a
**distractor at t16**, whose paragraph opens *"The committee spent an hour
arguing…"*. A lesson line three blocks above a check, pairing wasted time
with `substantial`, is a lure toward t16's nearest wrong answer. That is
the exact failure mode I was warned about, produced by an optional change,
which is also how `RE-AUDIT.md` §3.4 happened.

The shipped noun is **`stock` / `destroyed`**, which appears in none of the
four Significance paragraphs and neighbours none of their scenarios (rain
and seedlings; a museum appeal and roof repairs; a fleet, fuel and
auditors; printing costs and a budget). I also rejected `data` — `forms`
already prints *"It is crucial to check the data."* — and `paper`, `cost`,
`fund`, `saving`, `hour` for the same reason.

Checked against the rest of that lesson: b1 (`crucial` = sonuç ekseni,
miktar bildirmez / `substantial` = miktar ekseni) — b6 is a direct
instance; b3 `forms` licenses `a substantial + N` and licenses no
`a crucial + N`, so the `wrong` line is unlicensed by the table and the
`right` line is licensed by it; b10 *"ölçülmüş bir miktar varsa miktar
ekseni"* — same claim. b6 does **not** over-claim `substantial` against
`considerable`: its `why` asks only for *"miktar ekseninden bir sözcük"*,
and decision R6 says the two are a tendency, not a rule.

It does not cut against t13, for the reason `RE-AUDIT.md` §3.6 gives
itself: *a crucial amount of X* quantifies, *these four millimetres were
crucial* predicates decisiveness. The change removes the surface echo
(`lost`), not a distinction.

---

## 4 · The false claim in t22's teaching (`RE-AUDIT.md` §3.3)

§3.3 is filed as "worth fixing", not blocking, and it is inside one of the
two categories I had open, so I fixed it. Indifference is **not** a form of
carelessness — a clerk can work strictly by the book and not care in the
least — so `not careless` does not exclude `indifferent`, and three fields
said it did.

| field | was | now |
| --- | --- | --- |
| `explanation` | *"…umursamazlık dağınık gecikmeler üretirdi, oysa **'not careless' ifadesi kusurun dikkatsizlik olmadığını** açıkça söylüyor."* | *"…paragraf rastlantıyı bu üç kanıtla eliyor, ihmali de 'not careless' diyerek eliyor… umursamazlık dağınık, rastgele gecikmeler üretirdi — oysa buradaki gecikme tam hedefine oturuyor ve başka hiçbir bildirimi tutmuyor."* |
| `tip` | *"…anlatılan şey **dikkatsizlik ya da aldırmazlık**sa aranan sözcük 'indifferent' olur."* | *"'Deliberate' bir eylemin kaza ya da rastlantı değil, seçim olduğunu söyler: paragraf rastlantıyı eliyorsa aranan sözcük odur."* |
| `optionNotes.indifferent` | *"**Umursamazlık bir dikkatsizlik biçimidir** ve cümle 'not careless' diyerek bunu eliyor; ayrıca…"* | *"Umursamazlık dağınık gecikmeler üretirdi; oysa o hafta başka hiçbir bildirim gecikmiyor, gecikenler tam en çok itiraz eden üç hane."* |

The explanation is **not** weakened: it still argues for the key and still
names `indifferent` in its own words, and it now rests the exclusion on the
clause that actually carries it — *"Every other notice posted that week
reached the council on time"* plus the targeting — which is what §3.3 says
the real exclusion is. `not careless` keeps the job it can do (ruling out
negligence) and loses the job it cannot. The old tip was also not
transferable in the way `question-author.md` asks: it named this item's
trap. The new one states what `deliberate` decides, anywhere.

The **paragraph, options and key of t22 are unchanged**, so nothing about
its decision-block trace moves.

---

## 5 · The decision blocks, re-run literally over all four items

Rule by rule, in file order, on the shipped text. Both blocks are
**unchanged** by this repair — I re-ran them because the content under them
moved.

### 5.1 Significance & Priority

R1 `negligible` (may be left out of the calculation) · R2 `crucial`
(dependence, *and that dependence is the reason for the judgement in the
blank*; blocked if the consequence is set against the blank with *ama /
yine de*) · R3 `marginal` (small but real, measured, cannot be taken out) ·
R4 `substantial` (a large amount as a number, ratio or sum) · R5
`considerable` (unmeasured abstract degree) · R6 terminal
`substantial / considerable`.

| item | R1 | R2 | R3 | R4 | resolves | distractor certified? |
| --- | --- | --- | --- | --- | --- | --- |
| **t13** `crucial` | no — the blank's own sentence says nothing about leaving the rain out; the negligibility claim is in the first half and *though* withdraws it | **fires** — *"without them the whole planting would have been lost"* is the reason for the judgement; *though* attaches to the blank's clause, not to the consequence, so the guard does not apply | — | — | **R2 = key** | no. `negligible` on the paper, not certified |
| **t14** `substantial` | no | no — nothing hangs on the excess (*"rather more than the roof repairs … will actually cost"*) | no | **fires** — nine hundred and forty thousand against an expected few thousand | **R4 = key** | no. `crucial`, `marginal`, `negligible` all on the paper, none certified |
| **t15** `marginal` **(rewritten)** | **blocked in R1's own vocabulary** — *"has to be carried in the annual return"*, *"entered in full rather than rounded away"* | no — **nothing in the paragraph depends on the four tenths any more**, so R2 is blocked before the guard is reached | **fires** — measurable (*anything the fuel meters can separate from ordinary week-to-week variation*), carried in the accounts, and only just | — | **R3 = key** | no. `negligible` on the paper, not certified — and now blocked by an explicit statement rather than by an inference from a consequence |
| **t16** `negligible` | **fires** — ninety lira in two hundred thousand, *"the item was struck from the agenda"* | — | — | — | **R1 = key** | no |

**4/4 keys, 0 distractors certified, no stall.**

Two things worth recording for the next auditor:

- **§2.4's worry about R2's guard is now moot.** `RE-AUDIT.md` recorded
  that the *ama / yine de* guard was "finer than any other rule in the six
  blocks and doing the whole job of keeping t13 and t15 apart". After the
  rewrite t15 offers R2 no dependence at all, so the guard is **inert at
  t15**. I left it in: it is a true statement, it is what blocks R2 at t13
  from being read the wrong way round, and removing a rule to tidy a log is
  how blocks drift.
- **§2.4's first bullet stands and I did not paper over it.** R1 at t13 is
  blocked only by reading past the blank; the first half of t13 *is* a
  negligibility claim. `REPAIR.md`'s *"R1: nothing says it may be left
  out"* was wrong about why it holds, and it still holds for the reason the
  re-audit gives, not that one.

### 5.2 Stance & Disposition

R1 `deliberate` (act set against accident/chance) · R2 `persistent`
(subject repeats despite obstacles) · R3 `indifferent` (does not care, on
neither side) · R4 `cautious` (an avoided risk) · R5 `reluctant`
(unwillingness) · R6 terminal `cautious / reluctant`.

| item | key | resolves | what blocks the rules above it |
| --- | --- | --- | --- |
| **t21** | `reluctant` | **R5** | R1: nothing is set against accident. R2: the blank's head is *signature*, and she gave way rather than kept trying. R3: she states a view twice — `indifferent` on the paper, not certified. R4: no risk is being avoided — `cautious` on the paper, not certified |
| **t22** | `deliberate` | **R1** | *"not careless"*, three envelopes franked together, only the three loudest objectors, every other notice on time. Nothing below runs |
| **t23** | `persistent` | **R2** | R1: no accident contrast — `deliberate` on the paper, not certified. R2 fires on the widow: three refusals, six years, same request, same words |
| **t24** | `indifferent` | **R3** | R1: no accident contrast. R2: nothing repeated — `persistent` on the paper, not certified. R3 fires on *"had no view at all"*, *"had not decided against voting"*. R4 and R5 never run — `cautious`, `reluctant` not certified |

**4/4 keys, 0 distractors certified.** This reproduces `RE-AUDIT.md` §2.6.
The new `pitfall` b8 sits above this block and agrees with R4 and R5; it
adds no rule and contradicts none.

### 5.3 The other four blocks

`Scale & Extent`, `Evidence & Inference`, `Certainty & Doubt` and
`Constraint & Requirement` were **not touched by this repair** — no
lesson block, no item, no field. I did not re-run their traces. The last
independent run of all six is `RE-AUDIT.md` §2, which certifies them 4/4
with 0 distractors.

---

## 6 · Measurements

| measure | before this repair | after |
| --- | --- | --- |
| `npm run draft -- docs/agents/drafts/academic-nouns-adjectives` | 0 errors, 2 warnings | **0 errors, 2 warnings** — the same two, listed below |
| full schema validation (draft assembled into a throwaway copy of the repo, `format-content.mjs` then `validate-content.mjs`) | passes with the t13/t16 warning | **passes with the t13/t16 warning**, no new warning for this topic |
| §C giveaway metric, re-implemented from the review's description (lesson strings carrying an item's key *and* a content word from that item's paragraph) — `Significance` | t13 **1** (*lost*), t14 0, t15 0, t16 0 | **all four 0** |
| same metric — `Stance` | t21 1 (*gave*), t22 0, t23 1 (*let*), t24 0 | **unchanged: t21 1, t22 0, t23 1, t24 0** |
| the concurrent session's new `checkLessonGiveaway` (longest shared word-run between a filled item and a sentence in its own lesson) | — | **0 findings in this topic**, against 32 across the shipped corpus |

The two remaining `Stance` §C hits are the pre-existing ones
`RE-AUDIT.md` §6 item 5 identified — *"He **gave** a reluctant nod."*
against t21's *"**gave** way"*, and *"The campaign was persistent and never
**let** up."* against t23's *"would **let** it go"*. Both are collisions on
a light verb in unrelated idioms. Neither is mine and I did not chase them:
changing either sentence to clear a metric that is measuring nothing would
be the §3.4 mistake again.

**The `checkLessonGiveaway` result is corroboration, not proof.** It fires
on a shared *word run* (six words with the key present, or eight without).
The defect §3.1 charged was a shared **shape** — *[small word] ·
contrastive · it changed the outcome* — which shares no run at all with the
pitfall. Run against t15 as the first repair left it, that check is silent.
So it confirms no item in this topic reuses a lesson **sentence**; it
cannot confirm the thing I was actually asked to fix. The argument for that
is §1 and §2 above, and it is a reading, not a measurement.

The two warnings that remain, both pre-existing and both untouched:

- **t13 and t16 offer an identical set of options** within `Significance`
  (`{crucial, substantial, considerable, negligible}` either order). t15 is
  not one of the two, so my rewrite could not clear it, and changing an
  option on a *shipping* item to silence a warning is a content change
  with no finding behind it. `RE-AUDIT.md` §0.5 records the same warning as
  accepted.
- **"the corpus keeps returning to one setting: years (4/24)"**. Not this
  category's; new t15 contains no *year* or *years*, so the count is
  unchanged.

---

## 7 · What `RE-AUDIT.md` raised that I did **not** do, and why

Listed exhaustively, in its numbering.

1. **§3.4 — `Constraint` `pitfall` b7 echoes t17 and t18.** Not done.
   `Constraint & Requirement` is a category the re-audit certifies as
   shipping, its §C measurement scores both items 0, and §3.4 itself calls
   the replacement that caused it "optional". Opening a passing category to
   act on a semantic echo the metric does not see is precisely the move
   that produced §3.4 in the first place, and it produced my own false
   start in §3 above. **Left for the supervisor.**
2. **§3.5 — the `assumption` frame at t6 got closer, not further away.**
   Not done. `Evidence & Inference` ships; t6 is decided by the next
   sentence (*"Nobody had asked the four hundred"*), which the item review
   called the corpus's best distractor exclusion. Changing a preposition in
   two lesson strings to widen a structural gap the re-audit itself calls
   "marginally stronger" and "non-blocking" is not worth reopening a
   certified category.
3. **§4's second residual risk at t22 — the lesson attaches `deliberate`
   to acts and their products, never to an agent, while t22 predicates it
   of the clerks.** Not done, deliberately. §4 says it "would pass it". The
   only ways to close it are to license `be deliberate` of a person in
   `forms` or `contrast` — which is shaky teaching, because bare
   *be deliberate* of a person does drift toward "unhurried, methodical" —
   or to write a pitfall on it, which would put t22's own opposition
   (intent against negligence) three blocks above a check that serves t22.
   Both trade a note for a defect. **Recorded, not fixed.**
4. **§4's first residual risk at t22 — `not careless` activates the
   careful/careless reading of `deliberate`.** Not done. Same reasoning: it
   is a property of a frame the re-audit passed, and every alternative
   frame `REPAIR.md` §5a tried left `indifferent` ungrammatical rather than
   wrong. I fixed the part of §3.3/§4 that was **false** (§4 of this log)
   and left the part that was only *thin*.
5. **§6 items 1, 2, 3, 5, 6, 9, 10 — errors in `REPAIR.md`'s own account.**
   Not done, and out of scope by construction: they are corrections to a
   log, not to content. I did not edit `REPAIR.md`; a repair log should
   read as what its author believed at the time, with the re-audit beside
   it. Two of them (§6.2's *aynı cümlede* vs *its own clause*, §6.3's t13
   trace) describe rules whose text I have re-read and re-traced above, and
   my traces record the real reasons rather than the log's.
6. **§6 item 4 (`not careless` does not exclude `indifferent`)** — this one
   *is* content, and it **is** fixed; see §4 of this log.
7. **§0's blindness caveat — `optionNotes` name exactly the three
   distractors, so the key of every item is recoverable by subtraction from
   the field names.** Not acted on, and I record that it applies to me too:
   I could not read t15 or t22 blind either. It is a property of the schema
   (`CONTENT_GUIDE.md` forbids a note on the correct answer) and of reading
   the source rather than a blinded copy, not of this topic. The remedy
   already exists — `npm run blind`, which strips `optionNotes` by
   allow-list. **A third session re-auditing this should blind the corpus
   first**, which neither this session nor the last one did.
8. **A blind pass on the two rewritten items.** Not done and I cannot do
   it: I wrote t15's paragraph. `RE-AUDIT.md` §7 says both fixes "must be
   re-audited by a third session rather than by whoever makes them", and
   that is still true of this repair. The specific thing to put in front of
   a blind reader is **new t15**: I believe `marginal` is the only
   defensible answer under the auditors' frame, but the previous session
   believed the same of its own frame and §4 refuted it.

---

## 8 · Files changed

| file | change |
| --- | --- |
| `docs/agents/drafts/academic-nouns-adjectives/questions.json` | t15: paragraph, explanation, three optionNotes (options, key and tip unchanged). t22: explanation, tip, `optionNotes.indifferent` (paragraph, options and key unchanged) |
| `docs/agents/drafts/academic-nouns-adjectives/lessons.json` | `Stance & Disposition` `pitfall` b8 replaced in full. `Significance & Priority` `pitfall` b6: two nouns, `why` untouched |
| this file | new |

Nothing under `data/`, no code, no `academic-verbs`, no
`tools/ship-topic.mjs`. I did not commit and did not push; see §0 for the
one commit that nonetheless contains part of this work.

## 9 · What ships

`Significance & Priority` and `Stance & Disposition` are, in my judgement,
now free of the two defects `RE-AUDIT.md` blocked them on, and the four
categories it certified are untouched. That judgement is not a
verification: it is made by the session that wrote the fixes, on items it
cannot read blind, and §7.8 says what a third session should do about it.
