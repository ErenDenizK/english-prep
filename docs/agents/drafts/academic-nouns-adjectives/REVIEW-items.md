# Item review — `academic-nouns-adjectives`

Blind pass (A) over 24 items, plus a lesson cross-check. Reviewer had no
access to `questions.json`, `academic-nouns-adjectives-key.json`, or any
`optionNotes`/`explanation`/`tip`. Stimulus was
`blind-nouns/academic-nouns-adjectives-blind.json`, built by
`tools/blind-corpus.mjs`.

---

## 0 · Calibration — not run, and the score must not be quoted

**I have no calibration score, and I cannot be given one.**

My task instruction told me to work `docs/agents/calibration.md` first and
report the score. `docs/agents/reviewer.md` lines 9–11 says that file is
**off limits to a reviewer**, because it holds the answer key to the ten
graded items. I read the task instruction, opened `calibration.md`, and
was three paragraphs into the key before the conflict registered.

So: I have read the answers to all ten calibration items, including which
five are planted and which five are sound. Any number I reported against
that set would be a measurement of my ability to copy a file. Reporting
"5/5 recall, 5/5 precision" here would be worse than reporting nothing,
because it would read as evidence.

**This is a process bug, not a judgement call, and it will recur.** Two
documents give opposite instructions about who runs the calibration set.
`reviewer.md` is right: the reviewer must be *given* the ten items as a
blind stimulus by the supervisor, mixed and unlabelled, exactly as this
corpus was given. The reviewer must never be pointed at `calibration.md`
itself. Whoever writes the next reviewer task should hand over a
`blind-calibration.json` and nothing else.

**What survives.** The blind pass below is unaffected. I did not open
`questions.json` or the key file, and I committed all 24 answers in
writing (`scratchpad/COMMITTED-ANSWERS.md`) before reading `lessons.json`.
The findings in §2–§7 are independent judgements about the paragraphs and
survive regardless; what is missing is the assurance that a reviewer
making those judgements has been shown to be worth believing. Treat this
review as **uncalibrated**: read the evidence, do not take the verdicts on
trust.

---

## 1 · Blind pass — all 24

Answers chosen before any comparison, and before `lessons.json` was
opened. "Also works?" is the judgement the brief calls the most valuable
column.

| id | my answer | conf. | what decided it (≤12 words) | also works? |
| --- | --- | --- | --- | --- |
| t1 | `magnitude` | certain | *a storm of that ___* — the collocation, not the paragraph | no |
| t2 | `scope` | certain | *drawn far too narrowly*; inquiry told what it may ask | `extent` — weakly; see §2 |
| t3 | `margin` | certain | nine votes apart out of nineteen thousand; recount | no |
| t4 | `threshold` | certain | *falls below a certain ___*; behaviour changes past a point | no |
| t5 | `evidence` | certain | memory versus two decades of catch records | no |
| t6 | `assumption` | certain | *nobody had asked* — kills `consensus` outright | no |
| t7 | `implication` | certain | not the finding but what follows from it | no |
| t8 | `consensus` | certain | *the ___ among excavators is that*; three labs now agree | no |
| t9 | `conclusive` | certain | *suggestive but never ___*; case dropped | no |
| t10 | `plausible` | certain | fits the evidence, cannot be confirmed | no |
| t11 | `questionable` | certain | firm marked its own homework; regulator withheld the licence | no |
| t12 | `tentative` | certain | interim figure, divers expect to move it | no |
| t13 | `crucial` | certain | tiny quantity, decisive timing; *would have been lost* | no |
| t14 | `substantial` | certain | 940,000 against an expected few thousand | no |
| t15 | `marginal` | certain | 0.4% beside 7%; measurable but only just | `negligible` — absent from the set; see §5 |
| t16 | `negligible` | certain | ninety lira against two hundred thousand | `marginal` — absent from the set; see §5 |
| t17 | `constraint` | certain | four-metre ceiling, five-metre machines; a physical limit | no |
| t18 | `obligation` | certain | *the ___ to + V*; duty no captain may set aside | no |
| t19 | `criterion` | certain | one standard settles the order among applicants | no |
| t20 | `exemption` | certain | vans are on the list of those that do not pay | no |
| t21 | `reluctant` | certain | refused twice, signed, still calls it a mistake | no |
| t22 | `deliberate` | **probable** | exactly the objectors, one office, one afternoon | **`indifferent` — see §2** |
| t23 | `persistent` | certain | six years, same request, same desk | no |
| t24 | `indifferent` | certain | *had not decided against voting*; no view at all | no |

23 of 24 at **certain**, one at **probable**. That uniformity is itself
worth reading: see §3.

---

## 2 · Items where more than one option is defensible

**One near-miss, no clean D1.** Across 24 items I found nothing that meets
the brief's bar — "a competent teacher would accept a second option" —
squarely. The pipeline's rate is about one per twelve; this corpus is
below it, and I want to be explicit that this is a finding of *absence*
and not of *not looking*.

### What I did to try

For every one of the 24 items I substituted each of the three unkeyed
options into the blank and read the whole paragraph back with it, rather
than judging from the option list. That surfaced the following near-misses,
each of which I then rejected and why:

| id | rival | why it is nevertheless wrong |
| --- | --- | --- |
| t2 | `extent` | *the extent of the inquiry* is real English, but you do not **draw** an extent — you draw boundaries, terms, a scope. The verb blocks it. |
| t4 | `margin` | *below a certain margin* is heard loosely, but a margin is a gap between two values, not a level you fall beneath. |
| t3 | `threshold` | recount thresholds exist, but a *small* threshold would make recounts rarer, not obligatory. The logic reverses. |
| t6 | `consensus` | takes a `that`-clause identically, and is killed by the next sentence — *nobody had asked the four hundred*. Deliberate and well made. |
| t10 | `questionable` | grammatical and idiomatic in the frame, but the em-dash clause supplies confirming evidence. Directly contradicted. |
| t12 | `plausible` | *therefore* points back to two unlaboratoried planks — that is provisionality, not credibility. |
| t18 | `provision` | a legal provision could require rescue, but *provision **to** go* is not a pattern the noun takes. |
| t13 | `substantial` | four millimetres against two hundred. The paragraph makes size the wrong axis on purpose. |

### t22 — the one I would not certify

> The three households that had objected loudest to the car park were the
> three whose notices arrived four days after the deadline, all franked at
> the same office on the same afternoon. The ombudsman decided the clerks
> had been ____ about it.

`deliberate` and `indifferent` are both defensible, for two separate
reasons that compound.

**Meaning.** The paragraph's selectivity (exactly the objectors) and the
single franking event argue for intent, and I answered `deliberate`. But
*"the ombudsman decided the clerks had been indifferent about it, and
ordered the consultation to be run a second time"* is a completely
coherent finding — and it is the finding an ombudsman is far more likely
to make in reality, because maladministration through indifference is
provable and intent is not. A teacher who knows what an ombudsman does
would accept it.

**Phrasing.** *be deliberate about something* is strained. The natural
English is *the delay was deliberate* or *the clerks had acted
deliberately* — and the lesson's own pitfall uses the natural frame (*The
delay was deliberate, not accidental*). Meanwhile *be indifferent about
something* is the ordinary collocation. So a learner with a good ear is
pushed **towards** the wrong answer by the syntax while being pushed
towards the right one by the content. That is the shape that punishes the
student who knows more.

Severity: **worth fixing**, not blocking — the content evidence does
favour `deliberate` and the lesson supports it. But it is the only item in
the corpus I could not certify, and the fix is cheap: rephrase to *the
delay had been deliberate* / *the clerks had acted deliberately*, or add
one clause that rules indifference out (a note in the file, a clerk who
was told).

---

## 3 · Items answerable without the paragraph

The comparison asked for: `gerunds-infinitives` had 8 of 24. **This corpus
has 8 decided by a collocation inside the blank's own clause, plus 2 more
decided by size polarity alone — 10 of 24.** Slightly worse than the
grammar corpus, and worse in a way that matters more, because the whole
premise of the set-based design (`kickoff-vocabulary.md` rule 3) is that
*the paragraph selects the key*.

### 3a · Collocation-decided (8)

Delete everything but the clause containing the blank and the key is still
uniquely recoverable:

| id | the clause alone | why it decides |
| --- | --- | --- |
| t1 | *a storm of that ____* | `magnitude` is the only noun that takes this frame |
| t4 | *falls below a certain ____* | fixed collocation; also the lesson's pitfall verbatim |
| t8 | *the ____ among excavators is that* | `consensus among X is that` admits nothing else |
| t9 | *suggestive but never ____* | near-formulaic pair |
| t16 | *— ____ against a budget of two hundred thousand —* | the two numbers are in the same clause |
| t18 | *the ____ to go to the help of* | only `obligation` takes `to`+V; see §6 |
| t19 | *let only one ____ settle the order* | only `criterion` settles an order |
| t20 | *have held their ____ since 1998* | only `exemption` is a thing held under a charge |

For t1, t4, t9 and t18 the surrounding paragraph is genuinely decorative
for the *choice* — it is good prose that supplies no discrimination the
frame has not already supplied. That is **D4** at the item level and, in
`Scale & Extent`, at category level: two of that set's four items are on
this list.

t8, t19 and t20 are milder — the paragraph does real supporting work (no
two teams agreed → three labs now agree; income/time/distance were all
recorded; the list of those that do not pay) — but the shortcut is still
available to a learner who never reads it.

### 3b · Polarity-decided (2, all in one set)

t14 and t15 need the paragraph, but only to establish whether the quantity
is big or small. Once that is known, exactly one option in the set has the
right polarity, and no discrimination among near-synonyms occurs. Detail
in §5.

### 3c · The reason this matters more here than in the grammar corpus

The paragraphs carry a heavy load of low-frequency and British-institutional
vocabulary that sits **above** the band the options are pitched at:
`franked`, `returning officer`, `parish register`, `ombudsman`, `keel`,
`skippers`, `timbers`, `hull`, `corrosion`, `stallholders`, `distress
call`, `master` (= captain), `plantation`, `depot`, `trustees`,
`loom-repair`.

`kickoff-vocabulary.md` rule 2 governs the frequency band of the
**options**, not of the paragraph, so nothing here breaks a stated rule.
But the interaction is the problem: a B2 Turkish learner who cannot read
*franked at the same office* or *the returning officer* falls back on the
one strategy still available, which is the collocation — and §3a says that
strategy pays in a third of the corpus. The prose is genuinely good; it is
aimed at a reader a level above the item's own target.

Severity: **worth fixing**, at corpus level, once. Not per item.

### 3d · One more corpus-level pattern

Nearly every paragraph is built on the same template: a precise number set
against a second precise number, inside a British institutional reversal
(inquiry, recount, ombudsman, housing panel, council charge, committee
budget, museum appeal — seven items). A test-wise learner learns *find the
two numbers and compare them* before learning any of the sixty words. In
`Significance & Priority` that is literally the answering method (§5).

**D11 at corpus level, worth fixing** — cheap, and does not touch a single
key: vary the settings.

---

## 4 · What the lesson hands over

Checked only after §1 was committed to a file.

**The rule that was violated in five of the last six topics is clean
here.** No question paragraph reuses a sentence from its own lesson. The
lesson examples are short generic sentences (*The team won by a narrow
margin.*), the paragraphs are 2–3 sentence narratives; there is no overlap
at sentence level in any of the six categories. Checked all 30 `example` /
`sentence` strings against all 24 paragraphs.

**But the lesson hands over the *frames*, which for this content type is
almost the same thing.** Because §3a's items are decided by a collocation
rather than by the paragraph, and because the lesson teaches exactly those
collocations, the item reduces to recall of the lesson line:

| lesson line | item it pre-answers | how directly |
| --- | --- | --- |
| pitfall: *stayed below the margin* → *below the threshold* | **t4** | the item **is** the pitfall, with a meadow around it |
| *A failure of this magnitude is rare.* | **t1** | same frame, `X of this/that magnitude` |
| *There is broad consensus among economists.* | **t8** | same frame, `consensus among X` |
| *The finding has implications for future work.* | **t7** | lesson pairs the exact noun *finding* with *implications*; t7 is *not the finding itself but its ___* |
| *That is one plausible explanation.* | **t10** | lesson pairs `plausible` + *explanation*; t10 is *___ as an explanation* |
| pitfall: *conclusive findings; more data will follow* → *tentative* | **t12** | the pitfall is t12's scenario in miniature |
| pitfall: *plausible enough to end the debate* → *conclusive* | **t9** | teaches `conclusive` = ends the argument, which is t9 |
| *The difference is negligible.* | **t16** | t16's clause is *the difference came to ninety lira — negligible* |
| *Employers have an obligation to report accidents.* | **t18** | teaches the `obligation to`+V pattern that t18 turns on |
| *Small firms were granted an exemption.* | **t20** | same relation, same word |
| pitfall: *A crucial amount of water* → *A substantial amount* | **t14** | removes t14's only non-polarity distractor |

Eleven of 24. This is not cheating and it is not a defect in the ordinary
sense — a lesson is *supposed* to make its questions answerable. Record it
as the measurement it is: **for roughly a third of this corpus the check
measures recall of a lesson line rather than selection by a paragraph**,
and the two findings (§3a, §4) are the same finding seen from both ends.

### 4a · The most-taught word in a set is often the one never keyed

`kickoff-vocabulary.md` rule 4 fixes this by design: four of five members
are keyed, the fifth is a distractor only. Confirmed against my answers,
the never-keyed member of each set is:

`extent` · `indication` · `apparent` · `considerable` · `provision` · `cautious`

Two of these are the words the lesson spends **most** space on:

- **`provision`** gets two example sentences (*The contract includes a
  provision on delays* / *The provision of housing improved*) plus a
  Turkish note (*Belgedeki madde → provision*) — the largest allocation in
  `Constraint & Requirement` — and no question ever rewards it.
- **`apparent`** gets two examples covering both of its senses (*It soon
  became apparent* / *Her apparent confidence hid real doubt*) plus a
  `pattern` block, and the treacherous second sense — *apparent* = seeming
  rather than real, which is the one a Turkish learner will get wrong — is
  never tested at all.

Per spec, so not a defect. But the consequence is real and the supervisor
should decide rather than inherit it: across four items a learner learns
*this word is never the answer*, which is a property of the option and
survives shuffling — the exact kind of role-cue `reviewer.md` says **is** a
finding. If the four-per-category constraint ever loosens, a fifth item
per set is the fix; short of that, rotating which member goes unkeyed
across topics is free.

---

## 5 · `Significance & Priority`, as asked

### 5a · The identical option set — the judgement is right, and over-applied

The two items sharing an option set are **t13 and t16**, both
`{considerable, crucial, negligible, substantial}`. Both exclude
`marginal`. They key different words (t13 → `crucial`, t16 →
`negligible`), so this is a shared option set, not a duplicate item.

**Right in t16.** *ninety lira against a budget of two hundred thousand* —
`marginal` is fully defensible there. A competent teacher accepts *a
marginal difference* for ninety lira in two hundred thousand without
blinking. Excluding it was correct and is exactly the D1 discipline the
brief asks for.

**Unnecessary in t13.** The key is `crucial`, and the paragraph ends
*without them the whole planting would have been lost*. `marginal`
contradicts that as flatly as `negligible` does. It could have entered
t13 safely; excluding it bought nothing and is what forced the two items
onto an identical option list.

### 5b · Meaning or degree — three of four are degree

| id | decided by | detail |
| --- | --- | --- |
| **t13** | **meaning** | 4 mm against 200 mm. The paragraph makes size *the wrong axis on purpose*, so "this needs a big-sounding word" actively fails. The learner must know `crucial` is about consequence, not magnitude. |
| t14 | **degree** | 940,000 against an expected few thousand. Of `{crucial, negligible, substantial, marginal}` exactly one means *large*. |
| t15 | **degree** | 0.4% beside 7%. Of `{crucial, marginal, substantial, considerable}` exactly one means *small*. |
| t16 | **degree** | 90 against 200,000. Of `{negligible, substantial, crucial, considerable}` exactly one means *small*. |

So the answer to the question as posed: **yes, a learner can answer three
of the four by noticing the sentence needs a big- or small-sounding word,
without knowing which.** Only t13 requires the distinction the set is named
for, and t13 is the best item in the corpus for exactly that reason — it is
this corpus's `modals-t23`, the one item that punishes a heuristic instead
of rewarding it.

### 5c · The finding that matters most in this set — L5

`marginal` and `negligible` co-occur in exactly one item, **t14** — and
t14 keys `substantial`, so the pair is never the decision. The same is
true of every other item in the set.

**The lesson teaches this pair in a pitfall block:**

> wrong: *The effect was negligible, but it changed the outcome.*
> right: *The effect was marginal, but it changed the outcome.*

That is the sharpest distinction in the set, correctly taught, with the
recipe for a good item printed inside it — *small, but it changed the
outcome*. **No question in the category ever springs it.** A learner can
score 4/4 while holding precisely the belief the pitfall was written to
correct: that `marginal` and `negligible` are interchangeable words for
"small".

This is **L5**, at category level, and it is the same defect as the
*Present Perfect vs Past Simple* failure in the shipped grammar corpus —
four correct, correctly keyed items that between them never test the thing
the lesson warns about. Reported once here, not four times, because no
individual item is wrong.

**And it is untested for a defensible reason**, which the supervisor
should know before deciding: `negligible` genuinely *is* defensible in
t15 as written (*a saving the depot could measure, but only just* … *it
had dropped out of the monthly report altogether* — a saving nobody tracks
any more is a saving one may disregard). The author faced a real D1 and
avoided it by separating the pair. That was the right call on the item and
the wrong call on the category. The fix is not to add `negligible` to t15
as it stands — it is to rewrite t15's paragraph so the small saving still
**changes something**, which is what the lesson's own pitfall sentence
does in nine words.

### 5d · Second-order: t15 and t16 are the same item

Both are *a small measured figure set against a large one, in an
institutional cost review, which is then dropped from the record* — t15
ends *it had dropped out of the monthly report altogether*, t16 ends *the
item was struck from the agenda*. Same decision, same shape, same closing
beat, differing only in which small-polarity word is on offer. **D11,
worth fixing**, and fixing §5c fixes this too.

---

## 6 · Findings

| id | defect | severity | evidence | suggested fix |
| --- | --- | --- | --- | --- |
| **`Significance & Priority`** | **L5** | **blocking** (category level) | lesson pitfall *"The effect was negligible, but it changed the outcome" → "marginal"*; `marginal`+`negligible` co-occur only in t14, which keys `substantial` | rewrite t15 so the small saving changes an outcome, then admit `negligible` |
| t15 | D11 | worth fixing | *"dropped out of the monthly report altogether"* against t16's *"the item was struck from the agenda"* — same decision twice | rewrite (same fix as above) |
| t22 | D1 | worth fixing | *"the clerks had been ____ about it"* — `indifferent` is a coherent ombudsman finding, and *be indifferent about* is the better collocation than *be deliberate about* | rephrase to *had acted deliberately*, or rule indifference out in one clause |
| t18 | D2 | worth fixing | *"the ____ to go to the help of anyone in danger at sea"* — `constraint`, `provision`, `exemption` all fail on complementation (`constraint on`, `provision for`, `exemption from`), not on meaning | rewrite the frame so the three rivals are grammatical and wrong for meaning |
| t1 | D4 | worth fixing | *"a storm of that ____"* — the frame decides; the bridge, the forty years and the corrosion supply nothing the frame has not | rewrite the frame, or record and leave |
| t4 | D4 | worth fixing | *"falls below a certain ____"* — fixed collocation, and identical to the lesson pitfall *"below the margin / below the threshold"* | rewrite the frame |
| t9 | D4 | note | *"suggestive but never ____"* is near-formulaic; the paragraph is good and still redundant | record and leave |
| t13 / t16 | D2-adjacent | note | identical option sets; `marginal` excluded from t13 where it is safely wrong | admit `marginal` to t13 |
| t8 / t12 | D11 | note | both are laboratory dating of ship/building timbers to *a decade* — different categories, same scenario | vary one setting |
| corpus | D10-adjacent | worth fixing | paragraph vocabulary above the option band: `franked`, `returning officer`, `parish register`, `ombudsman`, `keel`, `hull`, `corrosion`, `stallholders`, `master` | simplify surrounding prose; keep the item words |
| corpus | D11 | worth fixing | seven items are a British institutional reversal decided by two precise numbers (t2, t3, t14, t16, t19, t20, t22) | vary the settings |
| — | D5 | **not assessed** | `explanation` and `optionNotes` stripped by the blind harness | run pass C on the keyed file |

**Not found, having looked:** no D6 (I disagree with no key I can infer),
no D7, no D8, no D9, no D12. No paragraph contains its own answer or an
inflection of it; checked all 24.

---

## 7 · Verdict per category

| category | verdict | spans its contrast? |
| --- | --- | --- |
| **Scale & Extent** | **ships**, with D4 recorded | yes — degree (t1), frame (t2), difference (t3), tipping point (t4). Weakest set on §3: half its items are collocation-decided, and `extent` is keyed nowhere. |
| **Evidence & Inference** | **ships** | yes, and best balanced. t5 (data vs memory) and t6 (*nobody had asked*) are properly paragraph-decided; t6 is the most carefully built distractor exclusion in the corpus. |
| **Certainty & Doubt** | **ships** | yes — insufficient (t9), credible (t10), untrustworthy (t11), provisional (t12). t10/t11/t12 all require reading. `apparent`, the set's odd member and its only polysemous one, is never assessed. |
| **Significance & Priority** | **does not ship as-is** | **no.** Three of four items are decided by size polarity; the set's defining contrast (`marginal` / `negligible`) is never the decision. **Blocking item: t15**, as the cheapest place to fix a category-level L5. |
| **Constraint & Requirement** | **ships**, with t18 recorded | yes — limit (t17), duty (t18), standard (t19), release (t20). t18 is decided by complementation rather than meaning; `provision` is the most-taught, never-keyed word in the corpus. |
| **Stance & Disposition** | **ships**, with t22 recorded | yes — unwilling (t21), intentional (t22), dogged (t23), unbothered (t24). t24 is the second-best item in the corpus: it names and excludes its nearest rival inside the paragraph (*had not decided against voting*). |

**Five of six categories ship. One does not, at category level, on an L5.**

---

## 8 · Items I could not break

Examined against the full taxonomy and passed:

**t2, t3, t5, t6, t7, t10, t11, t12, t13, t14, t16, t17, t19, t20, t21,
t23, t24** — 17 of 24.

Of these, four are better than "not broken":

- **t13** — the corpus's best item. A tiny quantity that is decisive.
  Defeats the "big number, big word" heuristic outright, which is what one
  item in four should do.
- **t24** — names its nearest rival and excludes it inside the paragraph:
  *"The ward had not decided against voting — it was simply ____."* That
  sentence is what turns a two-answer item into a one-answer item, and it
  is the technique the rest of the corpus needs.
- **t6** — *"Nobody had asked the four hundred who live out in the
  villages"* exists solely to kill `consensus`, which takes the same
  `that`-clause as the key. Deliberate distractor management.
- **t11** — three independent facts (own lab, own choice of batches,
  two-page summary) converge on `questionable` with no collocational
  shortcut available.

The remaining 13 are sound items with nothing to report beyond what §3 and
§4 say about the corpus as a whole.

---

## 9 · One note on the harness

`tools/blind-corpus.mjs` kept the `category` field, which names all five
set members (*Scale & Extent (extent / scope / magnitude / margin /
threshold)*). Combined with `kickoff-vocabulary.md` rule 4 — four of five
members keyed across four items — a reviewer who has answered three items
in a set can constrain the fourth by elimination. It did not affect this
pass (I answered in file order and rechecked nothing), but it is a live
channel. Dropping the parenthesised member list from `category` in the
blind output closes it for a line of code.
