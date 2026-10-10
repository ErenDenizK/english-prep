# Repair pass — `data/passive-voice/passive-voice.json`

2026-09-04. Scope: that one file. Nothing else under `data/` was opened or
edited; `tools/`, `js/`, and `data/manifest.json` were not touched. (`npm run
format` rewrites the manifest's generated lesson index as a matter of course;
no manifest field was authored by hand, and the topic's `categories`,
`questionCount` and `lessonCount` are unchanged.)

Worked from `docs/audit/blind-oldest.md` §2 (rows `p*`), `docs/audit/
lessons-oldest.md` §0 and §3, and `docs/audit/option-notes-6.md`.

**Result.** `npm run format` clean, `npm run check` clean: 0 errors, and 0
warnings attributable to this file (the three warnings the run prints belong
to `data/tenses/`, `data/academic-nouns-adjectives/` and `data/roadmap.json`,
which other sessions are editing concurrently).

**Giveaway warnings: 14 → 0.** Measured on both versions with the *current*
`checkLessonGiveaway` (it was extended mid-session by another repair session
to read `text.body` as well, so the before-count was recomputed against the
pre-edit file rather than taken from the run I made at the start): before —
t1, t2, t5, t6, t9, t10, t11, t12, t13, t14, t19, t20, t22, t24; after — none.

No key was changed except where an item was rewritten outright; the blind pass
agreed with the key on 24 of 24 items in this file and nothing here disputes
that.

---

## 1. `Passive with Modals` (t5–t8) — the modal is now the decision

**The finding.** The modal was constant across all four options in every item
and exactly one option was a well-formed passive, so the paragraph decided
nothing and the category tested one fact four times.

**What I did.** All four items rewritten. In every item the key is now chosen
by what the paragraph says about obligation, advice, permission or an open
outcome. Two items (t6, t7) keep one active option, because the
active/passive decision is what the lesson's `decision` block is for and it
would otherwise go untested — but three well-formed passives remain in each,
so the key is never "the only legal string". The keyed modals still span
should / must / can / might, as before.

### t5 — key `should be submitted`

> There is no deadline for this scholarship and no penalty for a late form;
> the office reads whatever arrives before term starts. Even so, your
> application ____ this week rather than next, because the grants go to the
> folders that reach the desk first.

| option | judgement |
| --- | --- |
| `must be submitted` | **Wrong.** States a requirement the first sentence has just denied twice ("no deadline", "no penalty"). This is the closest distractor and the explanation names it. |
| `might be submitted` | **Wrong.** Epistemic: "perhaps it will be handed in this week". "Even so" plus a reason for acting is advice, not a guess about what will happen. |
| `will be submitted` | **Wrong.** A prediction about the reader's own action, which the writer is in no position to make, and which the concessive "Even so" does not set up. |

**Paragraph deleted:** the four options are `should / must / might / will be
submitted`. All four are well-formed passives; nothing picks itself out. ✔

**Honest risk.** This is the one rewritten item where the closest distractor
is contestable: spoken English uses emphatic *must* for insistent advice
("you must try it"). I kept it because the item is *about* the
obligation/advice boundary and because the paragraph denies a requirement in
its own words; a marker who accepted `must be submitted` would be accepting a
sentence that contradicts the stem. It is the item in this file most likely
to be argued with.

### t6 — key `must be worn`

> The technician stopped us at the top of the stairs and pointed at the sign
> on the door. Below ground, hard hats ____ at all times, and anyone who takes
> one off is walked straight back up to the surface.

| option | judgement |
| --- | --- |
| `can be worn` | **Wrong.** Permission: wearing one is allowed, not wearing one equally so. The last clause punishes taking one off. |
| `might be worn` | **Wrong.** A guess about what people do; the sentence reports a rule that is enforced. |
| `must wear` | **Wrong.** Active: the hats do the wearing. The live Turkish-learner error the lesson's `contrast` and `decision` rules 2–3 are built on. |

**Paragraph deleted:** three well-formed passives remain (`must / can / might
be worn`); the active is eliminable but the key is not. ✔

### t7 — key `can be paid`

> The registrar's office is relaxed about this, and the total comes to exactly
> the same amount either way. Tuition ____ in nine smaller instalments across
> the year, though plenty of families still hand over the whole amount on
> registration day.

| option | judgement |
| --- | --- |
| `must be paid` | **Wrong.** Turns an available route into the only route — and if instalments were compulsory there could be no families paying the whole amount on registration day. |
| `might be paid` | **Wrong.** Speculation about a standing arrangement the paragraph is describing, not guessing at. |
| `can pay` | **Wrong.** Active: the tuition does the paying. |

**Paragraph deleted:** three well-formed passives remain. ✔

**A rewrite of the rewrite.** My first version of this paragraph was *"Tuition
____ in a single instalment on registration day, or spread over nine smaller
payments across the year"*. Substituting the distractors caught it: *must be
paid in A, or B* reads as an obligation to pay, satisfied either way — a
second answer a teacher would accept. The published version puts one route in
the blank's clause and the other in a concessive, so an obligation reading
contradicts the sentence.

### t8 — key `might be postponed`

> The board did not vote on Thursday: two members wanted to see the autumn
> figures first, and the next meeting is three weeks away. Until then the
> staff are being told only that the launch ____ until spring.

| option | judgement |
| --- | --- |
| `will be postponed` | **Wrong.** Announces a decision; the board has not voted and does not meet for three weeks. Closest distractor, named in the explanation. |
| `must be postponed` | **Wrong.** Obligation; nothing in the paragraph requires a postponement of anyone. |
| `can't be postponed` | **Wrong.** Closes the possibility the paragraph is keeping open. |

**Paragraph deleted:** four well-formed passives. ✔

**Lesson support.** Because these items now turn on modal meaning, the lesson
needed a block that decides a modal; the `forms` block listed the meanings but
nothing told the learner how to choose. A second `decision` block,
*"Hangi modal?"*, was added (five general conditions → `must be + V3`,
`should be + V3`, `can be + V3`, `may / might be + V3`, `will be + V3`). It is
written as classes of situation, not as the four paragraphs — the §0.2 defect.
The lesson is now 12 blocks (limit 14).

---

## 2. `Modal Perfects in Passive` (t9, t10, t12) — built to p11's shape

p11 was the model: three well-formed modal perfect passives plus one
present-tense modal, so the learner has to weigh *must / can't / should /
may*. t9, t10 and t12 now have the same shape.

| id | key | options now |
| --- | --- | --- |
| t9 | `must have been` | must have been · can't have been · should have been · must be |
| t10 | `should have been` | should have been · must have been · can't have been · should be |
| t11 | `can't have been` | *(unchanged)* |
| t12 | `may have been` | may have been · must have been · can't have been · may be |

**t9** — *"The package ____ delivered to the wrong address — it's not here, and
the tracking says it arrived yesterday."*
`can't have been`: **wrong** — denies a delivery the tracking records.
`should have been`: **wrong** — criticism/expectation; nobody expected the
package to go to the wrong address. `must be`: **wrong** — present obligation,
and the delivery already happened.

**t10** — *"This mistake ____ caught much earlier — it's frustrating that
nobody noticed it until the final review."*
`must have been`: **wrong** — deduces that it *was* caught, which the second
clause denies. `can't have been`: **wrong** — asserts that catching it earlier
was impossible; the frustration presupposes the opposite. `should be`:
**wrong** — still-open task against "much earlier".

**t12** — paragraph rewritten:

> The email ____ sent to your spam folder by mistake, though it is just as
> likely that I typed one letter of your address wrongly. Either way, it is
> worth looking before you assume it never arrived.

The old paragraph (*"it's worth checking there before assuming it never
arrived"*) left `must have been` acceptable — "It must have gone to spam,
worth a look" is ordinary English. The rewrite puts a second, equally likely
explanation in the sentence, so certainty is excluded in the paragraph's own
words. `must have been`: **wrong** — "just as likely" denies it.
`can't have been`: **wrong** — if it were impossible there would be nothing to
look for. `may be`: **wrong** — the email has been sent; the question is where
it went.

Each item now offers three options that are perfect passives, so no key in
this category is the only well-formed string.

---

## 3. `Causative: Have/Get Something Done`

**The findings.** The label contained the answers; `did` and `took` are not
errors anyone makes; t13 and t14 shared three of four options and the same
decision; `make` was the distractor in three consecutive items.

**t13 — new paragraph, new options** (key `had`; `let`, `has had`, `will have`):

> The prints came back so dark that the studio apologised twice. Rather than
> argue about it, she simply ____ the whole set reprinted, and the second
> batch was exactly right.

`let`: **wrong** — takes a person and a bare verb (*let the studio reprint
it*), never `object + V3`. The live confusion the brief names, and the one
verb foil kept in this item. `has had`: **wrong** — ties the job to now,
inside a narrative that closes ("apologised", "was exactly right").
`will have`: **wrong** — puts a finished job in the future.
Three of the four options are forms of *have*, so the category label no longer
picks the answer out of the set.

**t14 — new paragraph, new option shape** (key `got them repaired`):

> The lease is very clear that tenants are not to touch the wiring themselves.
> So when the kitchen sockets stopped working we ____ within a day, and the
> landlord paid the electrician's bill.

`repaired them`: **wrong, and wrong about meaning, not grammar** — a perfectly
formed sentence that says the tenants did the work; the lease forbids it and
the landlord paid an electrician. This is the meaning-decided item the
category did not have. `made them repaired`: **wrong** — *make something done*
is not a pattern; make coerces a person and takes a bare verb.
`got repaired them`: **wrong** — the order the lesson's second `pitfall`
teaches. The option shape (whole phrases) differs from t13's, so the two items
no longer share a decision or an option set.

**t15 — options only** (key `have`; `make`, `let`, `am having`). `do` was
removed as the dead option the reports named. `am having`: **wrong** — one job
in progress, against "Every few years". `make` / `let`: unchanged, and their
notes unchanged.

**t16 — left alone, deliberately.** The blind reviewer's recommendation is
"record and leave": plain causative *had* ("the previous owners had the entire
kitchen renovated") is the ordinary past and reads acceptably, so the item's
`had had` is a sequence-of-tenses preference rather than a rule. Every fix I
could see either strained the paragraph or replaced the tense test with a verb
test the other three items already carry. Recorded here as an open item; the
`optionNote` for `had` already argues the preference rather than a breach,
which `option-notes-6.md` calls the honest and the weakest thing to say.

What the category tests after the pass: t13 verb + tense, t14 meaning +
pattern order, t15 verb + aspect, t16 tense. `make` now appears in two items
rather than three; `let` in two.

---

## 4. `By + Agent: Include vs Omit`

**t21 — kept, with the explanation the blind pass asked for, and one option
replaced.** The explanation now says in as many words that the alternatives
are *not wrong sentences* — *"yanlış bir cümle değildir — dilbilgisi
kusursuzdur — ama fazlalıktır"* — and separates the two exclusions: `by
someone` is redundant, `by a stranger` claims something the last clause denies.
`by a person` (which failed for exactly the same reason as `by someone` —
one distractor in two costumes, per `option-notes-6.md`) was replaced by
`stole`, the active role reversal, so the item now has one style judgement
rather than three and a voice decision besides.

**t22 — unchanged.** It is the "include, because an agent NP follows" item and
the blind pass passed it. Only its lesson leak was fixed (§5).

**t24 — rewritten to test omission**, so that p22 and p24 are no longer the
same item:

> He came off his bike at the crossroads and could not get up again. An
> ambulance was there in four minutes, and he ____ to hospital before his
> sister had even heard what had happened.

Key `was taken`. `was taken by`: **wrong** — *by* needs an agent behind it and
what follows is a place. `took`: **wrong** — active, and the injured man is
the one taken. `is taken`: **wrong** — a habitual present inside a closed past
narrative. The two `by` items are now mirrors (t22: an agent NP follows, so
*by* is compulsory; t24: none does, so it is not written), which is the
two-sided contrast the category name promises.

**Honest limit.** t24 tests *omit* by syntax, not by judgement. Every version
I drafted of the deeper rule — omit because the agent is obvious or carries no
information — required the learner to choose between two grammatical
sentences, which is the exact defect the blind pass recorded against t21. I
would rather have one contestable item in this category than two, so the
judgement half is still carried by t21 alone.

---

## 5. Giveaways — what changed in the lessons

Where a lesson sentence and a question were the same sentence, the **lesson**
changed, per the brief. Every `pitfall` whose `wrong`/`right` pair was an
item's distractor/key pair was rewritten onto a different scenario, teaching
the same thing.

| lesson | block | was | now |
| --- | --- | --- | --- |
| Tense Forms | `contrast` both sides | This bakery bakes fresh bread… / Fresh bread is baked every morning. (t1) | A local firm collects the recycling… / The recycling is collected every Thursday. |
| Tense Forms | `forms` Past Simple | The bridge was built in 1973. (t2) | The tunnel was opened in 1988. |
| Tense Forms | `pitfall` 1 | The bridge built in 1973 by a French engineer. → …was built… (t2) | The stadium demolished last winter. → The stadium was demolished last winter. |
| Passive with Modals | `pitfall` 3 | This form should submit… → …should be submitted… (t5's pair) | The lids must replace after use. → The lids must be replaced after use. |
| Modal Perfects | `contrast` both sides | This mistake should be corrected. / …should have been caught much earlier. (t10's pair) | The password should be changed. / The password should have been changed months ago. |
| Modal Perfects | `forms` × 3 | The package must have been delivered to the wrong address. (t9) · The email may have been sent to your spam folder. (t12) · The window can't have been broken by the wind. (t11) | The letters must have been posted without stamps. · The keys may have been left in the car. · These prints can't have been damaged by the sun. |
| Modal Perfects | `examples` × 2 | The letter must have been delivered by now. · The vase can't have been broken by the cat… | The alarm must have been switched off before dawn. · The vase can't have been knocked over by the cat… |
| Modal Perfects | `pitfall` 1–3 | window/storm (echoes t11) · This mistake should be caught much earlier. (t10's pair) · The email can have been sent to your spam folder. (t12's pair) | The safe must have opened by a professional. → …must have been opened… · These files should be backed up before the server crashed. → …should have been backed up… · The keys can have been left in the door. → The keys may have been… |
| Causative | `contrast` all three sides | I painted / had / finally got the house painted (echoes t15) | I translated the contract myself. / I had the contract translated. / I finally got the contract translated. |
| Causative | `forms` × 3 | She had her hair cut before the wedding. (t13, then) · The owners had had the kitchen renovated before we moved in. (t16, cue and all) · I'll have the documents translated. | They had the carpets cleaned after the party. · We had had the locks changed before we handed over the keys. · I'll have the tyres changed before the trip. |
| Causative | `examples` | We're having the house painted next month. (echoes t15) | We're having the bathroom retiled next month. |
| Causative | `pitfall` 3 | We made the kitchen renovated. → We had the kitchen renovated. (t16's scenario) | We made the windows replaced. → We had the windows replaced. |
| Passive Reporting | `contrast` both sides | It is believed that the city was destroyed by an earthquake. (t18) / The CEO is said to be extremely demanding. (t17) | It is believed that the fire started in the roof space. / The minister is said to be considering an early election. |
| Passive Reporting | `forms` × 2 | The hikers are reported to have been seen near the trail. (t19) · The meeting is supposed to start at nine. (t20) | The tunnel is reported to have been closed for repairs. · The new library is supposed to open in March. |
| Passive Reporting | `examples` | Two climbers are reported to have been rescued last night. (echoes t19) | Two paintings are reported to have been recovered from a garage. |
| Passive Reporting | `pitfall` 3 | The meeting is supposed start at nine. → …is supposed to… (t20's pair) | The bus is supposed leave at seven. → The bus is supposed to leave at seven. |
| By + Agent | `contrast` both sides | My wallet was stolen on the train. (t21) / The novel was written by a fifteen-year-old student. (t22) | The files were deleted at some point over the weekend. / The alarm was set off by a cleaner at four in the morning. |
| By + Agent | `forms` row 1 | The patient was taken to hospital. (would have been the new t24's key sentence) | The road was closed for two days. |
| By + Agent | `examples` | The injured man was taken to hospital. (same) | The bins are emptied every Tuesday morning. |
| By + Agent | `pitfall` 1 | My wallet was stolen by someone on the train. → …was stolen on the train. (t21's pair) | My bicycle was taken by someone from outside the library. → …was taken from outside the library. |

Several of these were **below** the checker's six-word threshold and were
changed anyway, because they are the same sentence to a learner: the Causative
`contrast`'s house-painting triple against t15, `The injured man was taken to
hospital` against the new t24, `The CEO is said to be extremely demanding`
against t17, and the vase/cat example against t11 (which sits at exactly five
shared words with the key inside it).

---

## 6. Decision-block traces

Run as a literal ordered checklist, rule by rule in file order, over all four
items of each category. Four blocks were touched; all four were re-traced, and
so was `Modal Perfects` (untouched, but its items changed).

### `Tense Forms in Passive` › *Hangi zamanın edilgeni?* (rules 3 and 6 changed)

Rule 3 was `signals: [yesterday, in 1973, last week, two years ago]` — a chip
that exists in the corpus once, in t2 (§0.2). It is now a `condition` naming
the class: *"Belirli ve kapanmış bir geçmiş an veriliyorsa — bir tarih, bir
yıl, ya da yesterday / last week / two years ago gibi bir ifade"*. Rule 6's
`then` said `Present Continuous Passive` for a condition that branches two
ways (§3.5); it now reads `Present Continuous Passive / Present Perfect
Passive`, the slash form `CONTENT_GUIDE.md` prescribes, and the condition
still says which branch to take.

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t1 | r1 on *every morning* | Present Simple Passive | yes — `is baked` ✔ |
| t2 | r1 no, r2 no, **r3** on *in 1973* (a year — the class the condition names) | Past Simple Passive | yes — `was built` ✔ |
| t3 | r1–r3 no, **r4** on *since* | Present Perfect Passive | yes — `have been sold` ✔ |
| t4 | r1–r5 no, **r6** on *this week* + still noisy | Present Continuous / Present Perfect Passive, condition selects Continuous | yes — `is being` ✔ |

### `Passive with Modals` › *Aktif mi, edilgen mi?* (rule 2's parenthetical changed)

The parenthetical *(form, kapı, ilaç, proje)* listed the four old items' own
subjects; it now reads *(bir belge, bir bina, bir kural)*.

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t5 | **r1** — after the blank comes *this week*, a time, not an object | Modal + be + V3 | yes, but all four options are that shape — the second block decides |
| t6 | **r1** — *at all times* | Modal + be + V3 | eliminates `must wear` ✔ |
| t7 | **r1** — *in nine smaller instalments* | Modal + be + V3 | eliminates `can pay` ✔ |
| t8 | **r1** — *until spring* | Modal + be + V3 | all four are that shape |

Honest reading: r1 now fires first on all four items, so **r2 and r3 are never
reached** by a current item, though r2 is true of every one of these subjects
and r3 is the active branch no item keys. r4 belongs to the next lesson. This
is not a regression — before the rewrite the block reached all four by r2 —
but it is a block whose second and third rules no item exercises.

### `Passive with Modals` › *Hangi modal?* (new block)

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t5 | r1 no (*no deadline*, *no penalty*), **r2** on *Even so … because the grants go to the folders that reach the desk first* | `should be + V3` | yes — `should be submitted` ✔ |
| t6 | **r1** on *anyone who takes one off is walked straight back up* | `must be + V3` | yes — `must be worn` ✔ |
| t7 | r1 no, r2 no, **r3** on *the same amount either way* + *plenty of families still hand over the whole amount* | `can be + V3` | yes — `can be paid` ✔ |
| t8 | r1–r3 no, **r4** on *The board did not vote … the next meeting is three weeks away* | `may / might be + V3` | yes — `might be postponed` ✔ (slash `then`; `may be postponed` is not offered) |

r5 (`will be + V3`) is not reached by any item. It is in the block because the
`forms` table has a `will` row; recorded as untested.

### `Modal Perfects in Passive` › *Sınavda sırayla bunlara bak* (block unchanged, items changed)

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t9 | r1 no (delivery already happened), **r2** on *it's not here … the tracking says it arrived yesterday* | must have been + V3 | yes ✔ |
| t10 | r1–r4 no, **r5** on *it's frustrating that nobody noticed it* | should have been + V3 | yes ✔ |
| t11 | r1–r3 no, **r4** on *completely sheltered* | can't have been + V3 | yes ✔ |
| t12 | r1 no, r2 no (*just as likely* denies certainty), **r3** | may / might have been + V3 | yes — `may have been` ✔ |

One rule each, in order, on four items — the property the lessons pass
credited this block with, preserved after the item rewrites.

### `Causative: Have/Get Something Done` › *Boşluktan sonrasına bak* (rewritten)

The old block had four rules and none about tense, so it never reached t16
(§3.3): rule 1 fired and returned the pattern. A tense rule now sits in front
of it, and the pattern rule says where the tense is carried.

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t13 | r1 no (the reprint precedes no other past moment), **r2** on *the whole set reprinted*; the narrative is a closed past, and `forms` gives Past Simple = `S + had + nesne + V3` | have / get + object + V3, tense on have/get | yes — `had` ✔; eliminates `let`, and the tense half eliminates `has had` and `will have` |
| t14 | r1 no, **r2** on *them repaired* | get + object + V3 | yes — `got them repaired` ✔; eliminates `got repaired them` (order) and `made them repaired` (r4 does not fire — no coercion). **r5** read in reverse is what excludes `repaired them`: object after the verb means the sentence is not causative, which the lease denies |
| t15 | r1 no, **r2** on *the whole house painted*; *Every few years* → Present Simple row | have / get + object + V3 | yes — `have` ✔ |
| t16 | **r1** — *By the time we moved in* is an earlier past moment and *the entire kitchen renovated* is object + V3 | had had + object + V3 | yes — `had had` ✔ **(the §3.3 hole is closed)** |

r3 (*have + person + V*) and r4 (*make + person + V*) are not reached by any
item; both are real English the lesson teaches and both are recorded as
untested, as before this pass.

### `Passive Reporting Structures` › *Boşluğun iki yanına bak* (reordered)

Old order fired rule 3 (*event before the report* → `to have + V3`) on t19 and
handed back the **active** (§3.4). The passive-perfect rule now precedes it and
carries the voice test inside its own condition; the *supposed to* rule was
also moved ahead of the generic subject rule, which used to fire first on t20
and return the wrong reporting verb.

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t17 | r1 no (blank not sentence-initial), r2 no, r3 no, r4 no, **r5** — subject in front, bare *be* behind, same time as the report | S + is said to + V | yes — `is said to` ✔ |
| t18 | **r1** — blank at the start, *that the ancient city was destroyed…* is a full clause | It is said/believed/reported that … | yes — `It is believed` ✔ |
| t19 | r1 no, r2 no, **r3** — *late last night* is before the report **and** the hikers were seen, not seeing | to have been + V3 | yes — `are reported to have been` ✔ **(the §3.4 defect is gone; the old order returned the active here)** |
| t20 | r1 no, **r2** — *According to the schedule … but half the team still hasn't arrived* is a plan that has not come off | is supposed to + V | yes — `is supposed to` ✔ |

r4 (*to have + V3*, an earlier event the subject performed) is not reached by
any item. It is the honest counterpart of r3 and must stay in the block;
recorded as untested.

### `By + Agent: Include vs Omit` › *By yazayım mı?* (unchanged; t21 and t24 changed)

| item | rules that fire | returns | in the options? |
| --- | --- | --- | --- |
| t21 | **r1** — *I have no idea who took it* | Passive without an agent | yes — `was stolen` ✔ |
| t22 | r1–r3 no, **r4** — an agent NP follows the blank | Passive + by + agent | yes — `was written by` ✔ |
| t23 | r1–r4 no, **r5** — a pen is an instrument | Passive + with + instrument | yes — `was written with` ✔ |
| t24 | r1 no (the agent is not unknown), **r2** — *An ambulance was there in four minutes*, so the agent is obvious from context | Passive without an agent | yes — `was taken` ✔ **(r2 was untested before this pass)** |

r3 (*the agent is the most surprising or informative part*) is now reached by
no item: t22 is decided by r4, which is one step earlier. That was already the
finding in §3.2 and this pass does not fix it — see §7.

---

## 7. What I did **not** do, and why

- **t16 is unchanged.** Followed the blind reviewer's "record and leave"; the
  reasoning and the residual weakness are in §3 above. The item's contestable
  option (`had`) survives.
- **t22 is unchanged.** It is a clean item and the pass agreed with its key;
  varying it as well as t24 would have left the category with no "include"
  item decided by a following agent NP.
- **`By + Agent` rule 3 is still untested.** The rule that names the *reason*
  for including an agent (it is the most informative part of the sentence)
  fires on no item, because r4 — an agent NP follows the blank — reaches t22
  first. Fixing it means an item where an agent is available and the learner
  must decide whether it earns its place, which is the two-grammatical-options
  judgement I argue against in §4. Left open for the supervisor.
- **§3.6 — the `since` caveat** that lives in t3's `tip` (*"'çünkü' anlamındaki
  since böyle bir sinyal vermez"*) and not in the Tense Forms lesson, where
  `decision` rule 4 still lists `since` unqualified. Not on my four-item task
  list, and it is a lesson-content addition rather than a repair; not done.
- **§3.7 — the register claim** in Passive Reporting's `contrast` (*"akademik
  metinlerde daha sık görülür"*), which is the class of claim the guide bans
  from `intro`. Not done: the ban is written for `intro`, and rewriting a
  gloss the pass called "note" was outside the four items I was given.
- **§3.7 — the "garbled Turkish"** in Tense Forms `pitfall` 3. I read
  *"özne yapılacak bir nesne yoktur"* as parsing ("there is no object to be
  made the subject") and did not change it; recording the disagreement rather
  than acting on it.
- **§3.7 — lessons 2 and 3 disagreeing** about what `modal + be + V3` means.
  Not done; no item turns on it, and lesson 2's `forms` table (which the
  rewritten t5–t8 now lean on) is the accurate one.
- **The untested pitfalls in Tense Forms** (`was happened`, `was wrote`) are
  still untested; no item in t1–t4 offers either error, and I did not rewrite
  t1–t4.
- **t1's thin exclusion** (`has been baked` is defensible English for a habit
  running up to now — `option-notes-6.md`) is untouched. It is a real
  weakness and it was not on my list; the fix it names (attach a clean
  Present-Simple signal to the baking) would mean rewriting an item the blind
  pass passed.
- **`contentVersion` was not bumped** in `data/manifest.json`, because the
  brief forbids touching the manifest. Fourteen items in this topic changed
  materially; the supervisor should bump it so the "Yeni sorular eklendi"
  badge fires.
- **`npm run verify` was not run.** The change is content-only — no HTML, CSS
  or JS — and the sweep needs a running server and a browser.

## 8. Residual risks, stated plainly

1. **t5's `must be submitted`** — the emphatic-advice reading of *must*. §1.
2. **t7's `might be paid`** — a reader could hear it as a hedged statement of
   an available option rather than a guess. The paragraph frames a policy the
   office is describing, which is what excludes it.
3. **t10's `can't have been`** — excluded by presupposition (the frustration
   assumes the mistake was catchable), not by a rule.
4. **t13's `has had`** — excluded by narrative tense agreement, which is a
   tenses judgement inside a passive topic.
5. Every item I rewrote had all three of its wrong options substituted into
   the finished paragraph and read as a whole sentence before it was kept;
   two paragraphs (t7, t12) were rewritten a second time because that reading
   found a second acceptable answer, and both are recorded above.
