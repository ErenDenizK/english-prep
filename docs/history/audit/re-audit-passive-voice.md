# Independent re-audit — the `passive-voice` repair

2026-09-05. Scope: `data/passive-voice/passive-voice.json`, all 24 questions
and all 6 lessons. Repairs nothing. Method: `docs/agents/re-audit.md`.

The repair under audit is commit `f543ec9` (the only commit touching this
file since `b606330`); its account is `docs/audit/repair-passive-voice.md`.
The working tree is clean, so the diff audited is exactly
`git show f543ec9 -- data/passive-voice/passive-voice.json`.

**What I ran, before reading any of the repair's own judgements:**

- answered the twelve rewritten items from the paragraph alone, keys hidden
  (a script printed paragraph + alphabetised options, no `correctIndex`);
- re-ran the paragraph-deleted test on all 24 items, not only the ten the
  brief names;
- substituted all three wrong options into every rewritten item;
- traced all **seven** `decision` blocks (the `Passive with Modals` lesson
  now carries two) rule by rule in file order over their own four items;
- ran `checkLessonGiveaway` from `tools/content-checks.mjs` over the pre- and
  post-repair files, then re-ran it with the six-word threshold lowered and a
  content-word overlap filter, to see what the checker cannot see;
- `npm run check` (validate + format --check + palette + 136 unit tests).

**Mechanical claims: all verified.** `npm run check` is clean. `npm run
validate` prints two warnings, both in other topics (`academic-nouns-
adjectives`, `roadmap.json`); none is attributable to this file. The
giveaway count is **14 → 0**, and the fourteen ids the log lists are exactly
the fourteen the checker reports on the pre-repair file. Every `optionNotes`
key is one of its own question's options, no note sits on a correct answer,
and all twelve rewritten items cover all three wrong options.

**Blind answering: 12 of 12.** I answered t5, t6, t7, t8, t9, t10, t12, t13,
t14, t15, t21 and t24 from the paragraph alone and agreed with the key on
every one. Nothing in this file is mis-keyed. That is not the question.

---

## Verdict

| category | verdict | the one defect that blocks it |
| --- | --- | --- |
| **Tense Forms in Passive** (t1–t4) | **DOES NOT SHIP** | t3 and t4 still meet their own keyed sentences in their lesson's `forms` block — *"Three million copies have been sold."* and *"The lobby is being renovated."* — the same block from which this repair removed t2's. Two rows fixed, two left, one block. |
| **Passive with Modals** (t5–t8) | **SHIPS** | Nothing blocking. The category's defect is genuinely closed: four items that now turn on modal meaning, three well-formed passives in each. Costs recorded in §3 and §5. |
| **Modal Perfects in Passive** (t9–t12) | **SHIPS** | Nothing blocking. Recorded cost: in all three rewritten items the throwaway fourth option repeats the key's own modal (`must have been`/`must be`, `should have been`/`should be`, `may have been`/`may be`), which the untouched model item t11 does not do. §1.3. |
| **Causative: Have/Get Something Done** (t13–t16) | **DOES NOT SHIP** | t14 — the item written to give this category a meaning-decided question — fails the paragraph-deleted test: `got them repaired` is the only option the category label admits, the other three being two malformed strings and one non-causative. The rewrite reproduces the defect it was for. |
| **Passive Reporting Structures** (t17–t20) | **DOES NOT SHIP** | Three of its four items (t17, t18, t20) are items whose key is the only well-formed option — the file's headline defect, in the one category the repair never opened and never lists as not done. Secondary: t17's keyed sentence is its own lesson's `pitfall` 6. |
| **By + Agent: Include vs Omit** (t21–t24) | **DOES NOT SHIP** | t23's key **and** its closest distractor are the lesson's own `pitfall` 7 pair (*"The letter was written by a fountain pen." → "…with a fountain pen."*) on the same letter-and-pen scenario. Below the checker's threshold; in a lesson this repair had open and edited in four other places. |

Four of the six blocking defects are one-sentence fixes. The verdict is about
what the file needs before it is believed, not about how much work it is.

**The pattern across them.** The repair's giveaway sweep was calibrated to
the checker's six-word threshold plus four sub-threshold cases it caught by
eye, and it says so honestly. Three of the four sub-threshold giveaways still
standing are in lessons it had open and was editing — one of them in the very
`forms` block whose neighbouring row it rewrote. And the one item it wrote
from scratch to cure the file's headline structural defect (t14) has that
defect, while the category that carries three more untouched instances of it
(Passive Reporting) is not in the log's scope sections or its "did not do"
list.

---

## 1 · The paragraph-deleted test, re-run

The test as the brief states it: delete the paragraph, look at the four
options **and the category label**, and ask whether one option still picks
itself out — by being the only well-formed one, by being the only one the
label admits, or by being the only one of its shape.

The label is not hypothetical. `js/quiz.js:225–228` renders
`question.category` as a `t-label` directly above the paragraph on every
question, and inside a lesson the learner is in the category by definition.
So "the only option the label admits" is a live giveaway, not a thought
experiment.

I ran it on all 24 items, not only the ten named.

### 1.1 The four items that fail

| item | options | why the key picks itself out |
| --- | --- | --- |
| **t14** | `got them repaired` · `repaired them` · `made them repaired` · `got repaired them` | `made them repaired` and `got repaired them` are not English. `repaired them` is well-formed but is not a causative, and the label says *Causative: Have/Get Something Done*. The key is the only option the label admits. |
| **t17** | `is said to` · `is saying to` · `says to` · `is telling to` | The other three are active. Under *Passive Reporting Structures* the key is the only option of the named shape. |
| **t18** | `It is believed` · `It believes` · `It is believing` · `They believe it` | Same: one passive report, three actives. |
| **t20** | `is supposed to` · `is supposing to` · `supposes to` · `is supposed` | Two actives and one truncation. Only `is supposed to` is a well-formed reporting structure. |

t17, t18 and t20 are pre-existing, and they are not incidental: they are part
of the **nine of twelve** the blind pass counted
(`docs/audit/blind-oldest.md` §2, "Across the twelve items of `Passive with
Modals`, `Modal Perfects in Passive` and `Passive Reporting Structures`, nine
keys are the only structurally well-formed option"). The blind reviewer's own
confidence note on p17 reads *"The only well-formed reporting passive"*. Three
of the nine live in `Passive Reporting Structures`, and the repair addressed
the other two categories of the three the finding names.

t14 is new work. It is the item the log is proudest of — *"the meaning-decided
item the category did not have"* — and the meaning decision only binds a
learner who ignores the label. The old t14 (`got` · `made` · `did` · `took`)
failed the same test; the rewrite changed the option shape and did not change
that property.

### 1.2 The eight named items that pass

| item | after deleting the paragraph | verdict |
| --- | --- | --- |
| t5 | four well-formed modal passives, `should / must / might / will be submitted` | passes |
| t6 | three well-formed passives; `must wear` is eliminable, the key is not | passes |
| t7 | three well-formed passives; `can pay` eliminable | passes |
| t8 | four well-formed passives | passes — the cleanest item in the file |
| t9 | three modal perfects; `must be` eliminable by the label | passes within the item (see §1.3) |
| t10 | three modal perfects; `should be` eliminable | passes within the item (see §1.3) |
| t12 | three modal perfects; `may be` eliminable | passes within the item (see §1.3) |
| t13 | three forms of *have* plus `let`; the label no longer names one option | passes — a real repair, `did`/`took` are gone |
| t15 | `have` and `am having` are both have-causatives; the paragraph decides | passes, narrowly |

The other untouched items (t1–t4, t11, t16, t19, t22, t23) all pass: each
offers at least two options of the shape its label names.

### 1.3 A cross-item tell the within-item test does not catch

In five of the file's items exactly one modal appears **twice** in the option
list, and in all five the key is that modal's fuller form:

| item | doubled modal | key |
| --- | --- | --- |
| t6 | `must be worn` / `must wear` | `must be worn` |
| t7 | `can be paid` / `can pay` | `can be paid` |
| t9 | `must have been` / `must be` | `must have been` |
| t10 | `should have been` / `should be` | `should have been` |
| t12 | `may have been` / `may be` | `may have been` |

The rule *"if one modal appears twice, the answer is its fuller form"* fires
on five items, is right five times, and is never wrong elsewhere in the file
because nowhere else does a single modal repeat. It answers three of the four
`Modal Perfects` items and two of the four `Passive with Modals` items with
the paragraph deleted.

All five of those items were rewritten by this repair. The model it copied
for the modal perfects — **t11, which it left alone** — is the one item in
that category that does not do it: its present-tense foil is `might be`,
against a key of `can't have been`. The shape was copied; the property that
made the shape safe was not.

I do not call this blocking. It needs an induction across items, where the
defect the repair was convened against needed none — a student who read
nothing and picked legal English scored 9 of 12 on a single glance. But it
is the same class of tell, it is cheap to remove (change the fourth option's
modal on two of t9/t10/t12, as t11 already does), and it is the reason
`Modal Perfects` ships with a note rather than cleanly.

---

## 2 · Every rewritten item, answered blind then opened

Keys hidden, options alphabetised, paragraph only. My answer and the key
agreed on all twelve: t5 `should be submitted`, t6 `must be worn`, t7 `can be
paid`, t8 `might be postponed`, t9 `must have been`, t10 `should have been`,
t12 `may have been`, t13 `had`, t14 `got them repaired`, t15 `have`, t21 `was
stolen`, t24 `was taken`.

Two things that reading blind made visible and reading the log would not:

- **t8 is the best of the rewritten items.** Four well-formed passives, no
  doubled modal, and the decisive evidence (*the board did not vote … the next
  meeting is three weeks away*) sits a sentence away from the blank.
- **t9 and t10 are one-sentence items.** *"The package ____ delivered to the
  wrong address — it's not here, and the tracking says it arrived yesterday."*
  is nineteen words, and everything that decides it sits after the dash, next
  to the blank. Both paragraphs are unchanged by the repair, so this is
  inherited, not introduced — but the category was declared rebuilt, and its
  two shortest stems were not touched while their options were.

## 3 · Every wrong option substituted, and judged

`question-author.md`'s question of each: **would a competent teacher accept
it?** A "textbook prefers X" defence is not an exclusion.

### 3.1 `Passive with Modals`

| item | option | substituted | judgement |
| --- | --- | --- | --- |
| t5 | `must be submitted` | *"There is no deadline … no penalty … Even so, your application must be submitted this week…"* | **Contestable, and the weakest exclusion in the file.** Emphatic *must* for insistent advice is ordinary English. What saves it is the passive: *"your application must be submitted"* with no stated authority reads institutionally, and the stem denies an institution's requirement twice in its own words. I agree with the repair's decision to keep it and with its decision to flag it. |
| t5 | `might be submitted` | *"your application might be submitted this week rather than next"* | Wrong. An epistemic guess addressed to the person who will do the submitting. |
| t5 | `will be submitted` | *"your application will be submitted this week … because the grants go to the folders that reach the desk first"* | Wrong, but less flatly than the log states. *Will* can be directive. The concessive *Even so* plus a reason-to-act is what carries the exclusion, not the tense. |
| t6 | `can be worn` | contradicted by *anyone who takes one off is walked straight back up* | Wrong, cleanly. |
| t6 | `might be worn` | a guess about a rule that is being enforced in the same sentence | Wrong. |
| t6 | `must wear` | *"hard hats must wear at all times"* | Wrong, and live: it is the Turkish-learner error the lesson's `contrast` and `pitfall` 8 are built on. Not a dead option. |
| t7 | `must be paid` | *"Tuition must be paid in nine instalments … though plenty of families still hand over the whole amount"* | Wrong: the concessive makes an obligation impossible. |
| t7 | `might be paid` | *"Tuition might be paid in nine smaller instalments"* | Wrong **inside this lesson**, which glosses `may / might` as *İhtimal* only and never as permission. Note the fragility: `may be paid` would be an accepted answer in real institutional English, and it is not offered. Do not add it here. |
| t7 | `can pay` | active | Wrong, live. |
| t8 | `will be postponed` | announces a decision the board has not taken | Wrong. |
| t8 | `must be postponed` | obligation with nothing requiring it | Wrong. |
| t8 | `can't be postponed` | closes what the paragraph keeps open | Wrong. |

I confirm the log's t7 note: its first draft (*"Tuition ____ in a single
instalment … or spread over nine"*) would indeed have admitted `must be paid`,
and the published version's concessive closes it.

### 3.2 `Modal Perfects in Passive`

| item | option | judgement |
| --- | --- | --- |
| t9 | `can't have been` | Wrong — contradicts the tracking record. |
| t9 | `should have been` | Wrong — nobody expected the package to go astray. |
| t9 | `must be` | Wrong — present, and the delivery is done. Eliminable from the label alone. |
| t10 | `must have been` | Wrong — asserts it *was* caught; the stem denies it. |
| t10 | `can't have been` | Wrong, **by presupposition**: the frustration assumes it was catchable. I agree this is the softest exclusion in the category, and I agree it holds. |
| t10 | `should be` | Wrong — *much earlier* has closed the opportunity. |
| t12 | `must have been` | Wrong — *just as likely* denies certainty. The rewrite is correct and necessary: the old stem (*"it's worth checking there before assuming it never arrived"*) did admit it. |
| t12 | `can't have been` | Wrong — then there would be nothing to look for. |
| t12 | `may be` | Wrong — the email was sent; a generic reading is blocked by the definite *The email* and by *I typed*. |

### 3.3 `Causative`

| item | option | judgement |
| --- | --- | --- |
| t13 | `let` | Wrong: *let* takes a person and a bare verb. Live. |
| t13 | `has had` | Wrong — by narrative tense, inside a closed past. Agreed with the log that this is a tenses judgement inside a passive topic; the causative `forms` block does teach it, so it is on-topic, and it is not blocking. |
| t13 | `will have` | Wrong — the job is finished and its result reported. |
| t14 | `repaired them` | Wrong **about meaning**, and the best distractor in the file: perfectly formed, and contradicted by both the lease and the electrician's bill. Its only weakness is the label, §1.1. |
| t14 | `made them repaired` | Wrong. |
| t14 | `got repaired them` | Wrong — the order `pitfall` 7 teaches. |
| t15 | `make`, `let` | Wrong, live. |
| t15 | `am having` | Wrong — one job in progress against *Every few years*. `do` is correctly gone. |

### 3.4 `By + Agent`

| item | option | judgement |
| --- | --- | --- |
| t21 | `was stolen by someone` | Grammatical and idiomatic; wrong only as style. The repair's remedy — an explanation that says outright *"yanlış bir cümle değildir — dilbilgisi kusursuzdur — ama fazlalıktır"* — is the right one and is exactly what the blind pass asked for. |
| t21 | `was stolen by a stranger` | **The explanation's argument for excluding it is wrong.** It claims the option *"bilinmeyen bir şeyi bilirmiş gibi … iddia eder"* and that *I have no idea who took it* excludes it. It does not: knowing the thief was a stranger is entirely compatible with not knowing who they were, on a crowded train it is the default assumption, and the blind pass said so in its own words (*"so are `by a stranger` and `by a person`"* — consistent with the following clause). The repair took the blind pass's remedy for `by someone` and invented a different, weaker one for `by a stranger` instead of taking its second remedy ("or make the agent genuinely unavailable"). The item still has two options a competent teacher would accept. |
| t21 | `stole` | Wrong, live, and a good replacement for `by a person`. |
| t24 | `was taken by` | Wrong — a stranded preposition. Live: the reflex *by* is what the lesson opens on. |
| t24 | `took`, `is taken` | Wrong: role reversal and habitual present. |

**On t24 more broadly.** Its three distractors fail on voice, on tense and on
a stranded preposition. None of them requires the include/omit judgement the
category names, so a learner who has never read the lesson can answer it. The
log says as much (*"t24 tests omit by syntax, not by judgement"*) and I agree
with its reasoning for accepting that; it is worth recording that the
category's four items are now three syntax decisions and one style judgement,
and the style judgement is the contestable one.

---

## 4 · All seven `decision` blocks, run as literal checklists

Rule by rule in file order, over each category's own four items. A rule that
fires and returns a non-key option is blocking; the learner stops at the
first rule that fires.

### 4.1 `Tense Forms in Passive` › *Hangi zamanın edilgeni?* — **one hazard, introduced by this repair**

The repair changed two rules: r3 from a signal list to a condition, and r6's
`then` to a slash form. Both changes are right, and the r6 fix closes §3.5 of
`lessons-oldest.md` exactly as claimed.

| item | first rule that fires | returns | on the item? |
| --- | --- | --- | --- |
| t1 | r1 on *every morning* | Present Simple Passive | `is baked` ✔ |
| t2 | r3 on *in 1973* | Past Simple Passive | `was built` ✔ |
| t3 | r3 **or** r4 — see below | Past Simple Passive **or** Present Perfect Passive | `were sold` ✘ / `have been sold` ✔ |
| t4 | r2 on *for now*, not r6 | Present Continuous Passive | `is being` ✔ |

Two corrections to the log's trace, one harmless and one not.

**t4 (harmless).** The log records t4 as reached by r6. It is not: r2's chip
list is `["now", "at the moment", "currently"]` and t4's stem opens *"Please
use the side entrance **for now**"*. A learner scanning for chips finds `now`
and stops at r2, which returns the key anyway. The trace is wrong about which
rule fires and right about the outcome.

**t3 (the hazard).** Old r3 was
`signals: ["yesterday", "in 1973", "last week", "two years ago"]`. Those are
literal strings, and none of them occurs in t3, so old r3 could not fire on
t3 and r4 (`since`) decided it. New r3 is a judgement — *"Belirli ve kapanmış
bir geçmiş an veriliyorsa"*, "if a definite, closed past moment is given" —
and t3's stem gives one: *"since it **was first published**"*. Publication is
a definite closed past moment; that is precisely why `since` licenses the
perfect. r3 now sits in front of r4 and returns **Past Simple Passive**, which
is `were sold`, an actual option on t3 and its closest distractor.

What saves it is the condition's own gloss, which lists three *shapes* — a
date, a year, an expression like *yesterday / last week / two years ago* — and
a subordinate clause is none of them. A careful learner reads past it. A
learner scanning for "is there a finished past moment here?" does not.

This is the cost of the fix, and it lands on the one item in the category
whose decisive signal is `since` — the same signal whose caveat the log
records (§7, from `lessons-oldest.md` §3.6) as still missing from r4, where
`since` is listed unqualified while t3's own `tip` carries the warning. The
two together are the single change I would most like made in this category:
either r3 gains *"…ama cümlede `since` varsa 4. kurala geç"*, or r4 gains the
caveat that lives in t3's tip.

### 4.2 `Passive with Modals` › *Aktif mi, edilgen mi?* — clean

r1 (*no object after the blank — a `by`, a time or a place follows*) fires
first on all four items and returns `Modal + be + V3` every time: t5 *this
week*, t6 *at all times*, t7 *in nine smaller instalments*, t8 *until spring*.
It eliminates the active on t6 (`must wear`) and t7 (`can pay`) and returns
the shape all four options share on t5 and t8. Nothing non-key is ever
returned. The log's own reading — that r2 and r3 are now unreached — is
accurate, and its fix to r2's parenthetical (*(form, kapı, ilaç, proje)*, the
four old items' own subjects → *(bir belge, bir bina, bir kural)*) is the
right kind of fix and is verified in the diff.

### 4.3 `Passive with Modals` › *Hangi modal?* (new block) — clean, and it is a real block

This is the block the brief warns about: new, written to support rewritten
items, the likeliest place for a rule that certifies a distractor. It does
not.

| item | rules that do not fire | first firing rule | returns | on the item? |
| --- | --- | --- | --- | --- |
| t5 | r1 — the stem denies a sanction twice (*no deadline*, *no penalty*) | r2 (advice, not compulsory) | `should be + V3` | `should be submitted` ✔ |
| t6 | — | r1 (*anyone who takes one off is walked straight back up*) | `must be + V3` | `must be worn` ✔ |
| t7 | r1; r2 — *"yapılması iyi olur"* fails, because *the total comes to exactly the same amount either way* denies any advantage | r3 (an open option) | `can be + V3` | `can be paid` ✔ |
| t8 | r1, r2; r3 — an undecided outcome is not an offered option | r4 (decision not taken) | `may / might be + V3` | `might be postponed` ✔ |

Two near misses I checked and cleared. r2's second clause (*"ortada bir
tavsiye varsa"*) could snag t7 for a careless reader — but `should be paid` is
not one of t7's options, so the checklist stalls rather than misleads. r3's
*"açık bir seçenek"* could be read into t8's open outcome — but `can be
postponed` is not offered either. In both cases the option sets, not the
rules, are doing the saving; that is luck rather than design, and it is worth
knowing.

r5 (`will be + V3`) is reached by no item. The log records this. Agreed, and
it is defensible: the `forms` table has a `will` row, and `will be submitted`
is a distractor on t5, so the rule earns its place by excluding rather than
by keying.

### 4.4 `Modal Perfects in Passive` › *Sınavda sırayla bunlara bak* — clean

Block unchanged; three of its four items changed under it. One rule each, in
order, and the first firing rule reaches the key every time: t9 r2 (evidence →
`must have been`), t10 r5 (criticism → `should have been`), t11 r4
(impossibility → `can't have been`), t12 r3 (*just as likely* → `may / might
have been`). The property `lessons-oldest.md` §4 credited this block with
survives the rewrites, which is the log's claim and it is true.

The closest call is r1 on t10 — *"Olay henüz olmamışsa **ve hâlâ yapılabilir
durumdaysa**"*. Its first half is true of t10 (the mistake was not caught
early) and its second half is what excludes `should be`, an actual option.
The item's own `optionNote` for `should be` makes the same argument, so lesson
and item agree; non-blocking, but it is where this block is thinnest.

### 4.5 `Causative` › *Boşluktan sonrasına bak* (rewritten) — **the block cannot reach t14**

The repair added a tense rule in front of the pattern rule, to close §3.3.
Against t16 it works, and the `forms` row that gave t16 away verbatim is gone.

| item | trace | verdict |
| --- | --- | --- |
| t16 | **r1** — *By the time we moved in* is an earlier past moment and *the entire kitchen renovated* is object + V3 → `had had + object + V3` | ✔ the §3.3 hole is genuinely closed |
| t15 | r1 no, **r2** → `have / get + object + V3`; the tense comes from the `forms` Present Simple row | ✔ reaches `have`, does not exclude `am having` |
| t13 | r1 is arguable (see below), **r2** → causative pattern, tense on have/get | ✔ eliminates `let`; `has had` and `will have` are eliminated by `forms`, not by this block |
| t14 | **no rule fires** | ✘ |

**t14 is outside the block's reach, and the log's trace papers over it.** The
block's heading is *Boşluktan sonrasına bak* — "look at what comes after the
blank" — and every rule is phrased that way. In t14 the causative phrase is
*inside the option*: what comes after the blank is *"within a day, and the
landlord paid the electrician's bill"*. The log's trace row reads
*"r2 on **them repaired**"*, but `them repaired` is option text, not stem
text. The rule the learner is told to run cannot be run on this item. That is
a direct cost of the fix for the t13/t14 shared-option-set defect: the option
shape was varied, and varying it moved the item out of its own category's
procedure.

**r1 fires on t13 on a literal reading.** *"…bu iş, cümlede anlatılan başka
bir geçmiş andan önce bitmişse"* — the reprint does finish before *"the second
batch was exactly right"*, which is another past moment narrated in the same
stem. It returns `had had + object + V3`, which is not one of t13's options,
so the learner stalls and moves on rather than being misled. Non-blocking, and
I hold it more loosely than the rest of this section: t16 marks its reference
point with *By the time*, and a learner may well require that. But r1 was
widened from nothing to a judgement in order to reach one item, and t13 is the
item next door.

**r5's `then` is wrong as a general rule**, and was before this pass:
*"Nesne fiilden sonra geliyorsa cümle causative değildir"* → `Past Perfect
(had + V3)`. Object-after-verb does not imply past perfect; it implies "not
causative". On t14 the log says r5 "read in reverse" excludes `repaired them`
— but read forwards, r5 hands a learner `had + V3`, which t14 does not offer.
The `then` should be the thing the learner writes down, and here it is a form
name lifted from `pitfall` 7's single example.

### 4.6 `Passive Reporting Structures` › *Boşluğun iki yanına bak* (reordered) — clean, and the §3.4 defect is gone

| item | first firing rule | returns | on the item? |
| --- | --- | --- | --- |
| t18 | r1 — blank sentence-initial, full clause behind | `It is said/believed/reported that …` | `It is believed` ✔ |
| t20 | r2 — *According to the schedule … but half the team still hasn't arrived* | `is supposed to + V` | ✔ |
| t19 | r3 — *late last night*, **and** the hikers were seen, not seeing | `to have been + V3` | `are reported to have been` ✔ |
| t17 | r5 — subject in front, contemporaneous with the report | `S + is said to + V` | ✔ |

I re-derived the old failure to be sure the fix is real: old r3
(*"Aktarılan olay aktarımdan daha önce olmuşsa"*) fires on t19's *late last
night* and returns `to have + V3`, the active. The new r3 carries the voice
test inside its own condition and fires correctly. This is the best repair in
the file, and it is worth naming what makes it good: the discriminating test
was **folded into the earlier rule**, rather than the rules being reordered
and left to fire in whatever order the item happens to permit.

One quiet loss: r5's condition changed from *"arkasından yalın fiil
geliyorsa"* (a bare verb follows — a syntactic cue anyone can check) to
*"olay aktarımla aynı zamandaysa"* (the event is contemporaneous — a
judgement). It still reaches t17. It is a slightly worse rule to run under
exam pressure.

### 4.7 `By + Agent: Include vs Omit` › *By yazayım mı?* — **rule 3 is not untested; the log and the previous audit both have it backwards**

| item | first firing rule | returns | on the item? |
| --- | --- | --- | --- |
| t21 | r1 — *I have no idea who took it* | passive without an agent | `was stolen` ✔ |
| t22 | **r3** — the agent is the most surprising part | passive + `by` + agent | `was written by` ✔ |
| t23 | r5 — a pen is an instrument | passive + `with` | `was written with` ✔ |
| t24 | r2 — *An ambulance was there in four minutes*: the agent is obvious | passive without an agent | `was taken` ✔ |

The log's trace row for t22 reads *"r1–r3 no, **r4**"*, and its §7 records
*"`By + Agent` rule 3 is still untested … because r4 reaches t22 first"*.
**r3 is earlier than r4 in the file.** It reads *"Fail cümlenin en şaşırtıcı
ya da en bilgilendirici parçasıysa"*, and t22's stem is built to satisfy it —
*"The prize jury assumed the manuscript had come from an established
author. In fact the novel ____ a fifteen-year-old student, **which surprised
every critic**"* — as t22's own explanation says in as many words
(*"cümlenin en şaşırtıcı bilgisi"*). r3 fires on t22, first, and returns the
key. It is tested. `lessons-oldest.md` §3.2 made the same error, and the
repair inherited it rather than re-deriving it; this is where the brief's
"every claim in the repair log is unverified" earned its keep.

The consequence runs the other way from the log's: the rule now reached by no
item is **r4**, and r4 is the one whose condition is purely syntactic. That is
the better outcome, not the worse one — but it also means the category's
`decision` block now has a rule that fires only in the counterfactual, and
that the §7 residual is describing a problem the block does not have.

**The order defect this block does have**, and which the Passive Reporting
block was fixed for: r3 and r4 both say *fail* (agent) and both precede r5,
the instrument rule. t23 is the instrument item, and mistaking an instrument
for an agent is its entire test — the lesson's `pitfall` 7 is exactly that
error. A learner who makes it stops at r3 or r4 and writes `by`, which is
t23's keyed distractor. Both rules do say "agent" and so a learner who has
already made the discrimination is safe; the block simply does not help them
make it, and it puts the two rules that reward the error first. The same fix
that was applied to Passive Reporting — fold the discriminating test into the
earlier rule — was not applied here.

---

## 5 · Giveaways: the count is right, and it is not the whole story

**14 → 0 is verified.** I ran `checkLessonGiveaway` from
`tools/content-checks.mjs` (the current version, which reads `text.body`) over
both the pre-repair file at `f543ec9^` and the shipped one. Before: fourteen
warnings, on t1, t2, t5, t6, t9, t10, t11, t12, t13, t14, t19, t20, t22, t24
— exactly the list the log gives. After: none. The lesson-side rewrites in the
log's §5 table are all present in the diff, and I spot-checked the four
sub-threshold cases it says it fixed by eye (the Causative house-painting
triple, *The injured man was taken to hospital*, *The CEO is said to be
extremely demanding*, the vase-and-cat example). All four are gone.

**Then I lowered the threshold.** The checker fires at six shared words, or
at eight without the key. I re-ran it at three shared words, requiring the
lesson sentence to *contain the key* and to share at least one content word
with the question stem — i.e. the same scenario, not merely the same pattern.
Four items survive, across five lesson sentences. All four are in lessons this
repair edited, and two of them are in the very block whose neighbouring row it
rewrote:

| item | lesson sentence still standing | shared | block |
| --- | --- | --- | --- |
| **t4** | *"The lobby is being renovated."* | `lobby`, `renovated`, run 4, key inside | `forms`, Present Continuous row — **the same block whose Past Simple row the repair rewrote for t2** |
| **t3** | *"Three million copies have been sold."* | `three`, `million`, `copies`, `sold`, key inside | `forms`, Present Perfect row — same block again |
| **t3** | *"Over a million units have been sold since launch."* | `over`, `million`, `sold`, `since`, key inside | `examples` |
| **t17** | *"The CEO is said to be very demanding."* | `ceo`, `said`, `demanding`, run 5, key inside | `pitfall` 6 `right` |
| **t23** | *"The letter was written by a fountain pen." → "The letter was written with a fountain pen."* | `letter`, `written`, `pen`, run 5 — **`wrong` is t23's closest distractor and `right` is its key** | `pitfall` 7 |

The Tense Forms case is the sharpest. The `forms` block has seven rows, one
per tense. The repair opened it, rewrote the Past Simple row because the
checker flagged t2 at six words, and left the Present Perfect row (t3's key
sentence, three words) and the Present Continuous row (t4's key sentence
minus its adverbial, four words) untouched. Two of the category's four items
still meet their own answer in the table above the question, and the reason
they were missed is that they were shorter than the threshold, not that they
were less of a giveaway. *"The lobby is being renovated."* against *"the main
lobby ____ renovated this week"* is the same sentence.

The Passive Reporting case is the same shape inside one lesson: the repair
rewrote the `contrast` example *"The CEO is said to be extremely demanding"*
because it echoed t17, and left `pitfall` 6, whose `right` is *"The CEO is
said to be very demanding"* — the same sentence, one adverb different, in the
same lesson, carrying the same key.

The By + Agent case is the worst of the four in kind, because it hands over
both halves. The log's §5 states the principle it worked to: *"Every
`pitfall` whose `wrong`/`right` pair was an item's distractor/key pair was
rewritten onto a different scenario."* `pitfall` 7 is *"The letter was written
**by** a fountain pen"* → *"The letter was written **with** a fountain pen"*,
and t23 is *"the whole letter ____ a modern ballpoint pen"* keyed
`was written with` against the distractor `was written by`. It was not
rewritten. The claim is false of the file it describes.

**Two things I checked and cleared.** The `Modal Perfects` and `Causative`
lesson rewrites are thorough: every moved sentence lands on a scenario none
of its four items uses, and none of the new sentences creates a fresh echo.
The remaining pattern-level overlaps (t5 against *"Applications should be
submitted online"*, t8 against *"The project might be postponed"*, t18/t19/
t20/t22 against their own `forms` rows) share the key string but not the
scenario, and for these categories the key string **is** the pattern the
table has to exemplify. Only one of them is worth a second look: t5's stem is
now about an *application* being *submitted*, and the lesson's `should` row is
*"Applications should be submitted online."* The repair rewrote `pitfall` 3 to
get t5's old scenario out of the lesson and then rebuilt t5 on the scenario
the untouched `forms` row still carries. Three shared words is below anything
I would call blocking; changing one of the two is a minute's work.

**One near-miss worth recording, not a finding.** The By + Agent `pitfall` 5
was rewritten from t21's pair (*My wallet was stolen by someone on the
train*) to *"My bicycle was taken by someone from outside the library." → "My
bicycle was taken from outside the library."* — which is `was taken` + a
locative, the structure of the new t24 (*"he was taken to hospital"*). Two
shared words, different subject, different place. It does not reach the level
of the four above; it is the second time in one lesson that a replacement
landed near an item the same session was writing.

---

## 6 · Explanations, tips and `optionNotes` against the new text

Mechanically clean: every `optionNotes` key is one of its question's own
options, none covers a correct answer, and all twelve rewritten items gloss
all three wrong options. Read against the new stems, all twelve
`explanation`s argue for the key and name at least one wrong option in its own
words, and all twelve `tip`s are transferable rules rather than restatements.
Three substantive notes:

1. **t21's explanation is wrong about `by a stranger`** (§3.4). It is the
   only place in the twelve where the explanation's argument does not survive
   being checked against the paragraph.
2. **t13's explanation makes a false claim about English**, and it is new
   text: *"bu sırayı İngilizcede yalnızca 'have' ile 'get' alır"* — "only
   *have* and *get* take this order". Object + past participle is also taken
   by *want*, *need*, *like*, *prefer*, *see*, *hear* (*I want the whole set
   reprinted*, *I need this finished by Friday*). Nothing in t13's options
   turns on it, so it is not blocking, but this repository has a commit named
   *"Correct twelve false claims in the new explanations"* and this is the
   thirteenth. Narrowing it to *"…yaptırma anlamını 'have' ile 'get' taşır"*
   costs nothing.
3. **A pre-existing overstatement, now in two items.** `"'Make something
   done' diye bir kalıp yoktur"` was t15's wording and the repair copied it
   into t14's note for `made them repaired`. *Make + object + past participle*
   does exist in a small fixed class (*make yourself understood*, *make it
   known*). Harmless for the option it excludes; worth knowing it is now
   asserted twice.

Everything else checks out. t5's explanation claims *"Dört seçenek de düzgün
kurulmuş edilgen yapılar"* — true of t5, and correctly not claimed on t6, t7
or t8, which each carry an active. t9's new `tip` maps must/can't/should onto
certainty/impossibility/criticism and is true of all four items in its
category. t10's and t15's unchanged `tip`s are still true of their rewritten
option sets.

---

## 7 · The log against its own diff

The diff is 159 insertions / 130 deletions in one file. I reconstructed which
questions changed by field, from `f543ec9^`:

- **changed:** t5, t6, t7, t8 (paragraph, options, explanation, tip, notes) ·
  t9 (options, explanation, tip, notes) · t10, t15 (options, explanation,
  notes) · t12, t13, t14, t24 (all five) · t21 (options, explanation, tip,
  notes);
- **unchanged:** t1, t2, t3, t4, t11, t16, t17, t18, t19, t20, t22, t23.

That is exactly the account §§1–4 give. Lesson-side, the blocks changed are
the blocks the §5 table lists, no more and no fewer. The log does not claim
work it did not do, and where it hedges — t5's `must`, t16, t24's syntactic
"omit" — the hedges are accurate and load-bearing. It is a better log than
most in this directory.

Four places where it claims more than the file supports:

1. **"`By + Agent` rule 3 is still untested."** False; r3 decides t22 and is
   one step *earlier* than the rule the log credits. §4.7.
2. **"Every `pitfall` whose `wrong`/`right` pair was an item's distractor/key
   pair was rewritten."** False; By + Agent `pitfall` 7 is t23's pair and
   stands. §5.
3. **The `Causative` decision trace for t14** reads option text as stem text.
   The block cannot reach that item at all. §4.5.
4. **The `Tense Forms` trace for t4** attributes it to r6; r2's `now` chip
   fires first on *for now*. Harmless — same answer. §4.1.

And one thing the log does not say. Its §7 is a nine-item list of what was
not done, and the largest omission is not on it: **`Passive Reporting
Structures` carries three of the "nine of twelve" keys that are the only
well-formed option in their item**, which is the finding the whole repair
exists to answer, and the category appears in the log only under giveaways
and decision traces. Nothing obliged the repair to fix it — but a "did not
do" list that records the register claim in a `contrast` gloss and omits three
items with the headline defect is misleading about where the file stands.

### The four residual risks, judged

| # | the log's risk | my verdict |
| --- | --- | --- |
| 1 | t5's `must be submitted` — emphatic advice | **Agree.** Real, correctly kept, correctly the item most likely to be argued with. The passive voice and the twice-denied requirement carry it. |
| 2 | t7's `might be paid` — a hedged statement of an available option | **Agree**, and add one thing the log does not: the exclusion depends on this lesson never glossing `may` as permission, which it doesn't. Adding `may be paid` to any item in this category would break it. |
| 3 | t10's `can't have been` — excluded by presupposition | **Agree.** Softest exclusion in the category and it holds; the `optionNote` argues it honestly. |
| 4 | t13's `has had` — excluded by narrative tense | **Agree**, and it is less of a category drift than the log fears: the causative `forms` block teaches the tense of *have/get* explicitly. |
| 5 | "every rewritten item had all three wrong options substituted" | **Cannot verify the process; the outcome is consistent with it** on eleven of twelve. t21 is the exception — its `by a stranger` exclusion does not survive substitution (§3.4) — and the substitution test was clearly not extended to the *paragraph-deleted* test on t13–t15, where t14 fails it. |

### The "did not do" list, judged

| item | my verdict |
| --- | --- |
| t16 unchanged, "record and leave" | **Agree with the decision.** The blind pass rated it *probable*, plain causative `had` reads acceptably, and every fix strains the item. Worth stating plainly that this leaves the category with a second contestable key besides t14's label problem — and worth crediting that the `forms` row which used to hand t16 its answer verbatim is now gone, so the item is at least no longer pre-answered. |
| t22 unchanged | **Agree.** Clean item, and varying it too would have cost the category its "include" side. |
| `By + Agent` rule 3 untested | **Disagree.** §4.7. The rule fires on t22 and returns the key. The rule that is now untested is r4, and that is an improvement, not a defect. |
| §3.6 — the `since` caveat missing from the lesson | **Agree it is undone, disagree that it can wait.** Widening r3 into a judgement about "a definite closed past moment" put a rule in front of `since` that t3 can satisfy, so the two findings are now one. §4.1. |
| §3.7 — the register claim in Passive Reporting's `contrast` | **Agree with leaving it**, in the sense that it was out of scope. It is one clause and the reason `CONTENT_GUIDE.md` bans the class from `intro` applies to a `gloss` too; whoever next opens that lesson should delete it. |
| §3.7 — the "garbled Turkish" in Tense Forms `pitfall` 3 | **Agree with the repair against the previous audit.** *"Özne yapılacak bir nesne yoktur"* is well-formed Turkish for "there is no object that could be made the subject". `lessons-oldest.md` was wrong; recording the disagreement rather than acting on it was the right call. |
| §3.7 — lessons 2 and 3 disagreeing about `modal + be + V3` | **Agree, for a different reason.** Lesson 2 frames it as "what must be done, agent hidden"; lesson 3 as "not yet done, still doable". These are compatible framings of one form, not a contradiction, and I could not construct an item they answer differently. |
| untested pitfalls in Tense Forms (`was happened`, `was wrote`) | **Agree.** Neither is an option in t1–t4, and both are real Turkish-learner errors that earn their place in the lesson without an item. |
| t1's thin exclusion (`has been baked`) | **Agree it is real; disagree that it should keep being deferred.** *"Fresh bread has been baked every morning at this bakery"* is a sentence a competent teacher accepts — a repeated action running up to now. That is `question-author.md` rule 2, in the same category I am already failing for §5, so it should be fixed in the same pass. |
| `contentVersion` not bumped | **Agree, and it is still not bumped.** `data/manifest.json` has `contentVersion: 2` for this topic, unchanged since `65db64b`. Fourteen items changed materially; the badge will not fire until someone bumps it to 3. |
| `npm run verify` not run | **Agree.** Content-only change, no HTML/CSS/JS, and the sweep needs a browser. |

---

## 8 · What I checked and did not find

So that a thorough pass can be told from a shallow one, and because three of
my six verdicts rest on the categories the repair did not rewrite items in:

- **All 24 items answered or re-answered**, twelve of them blind. No
  mis-keying anywhere in the file; the blind pass's 24/24 agreement holds.
- **All seven `decision` blocks traced over all four of their items** —
  including the three blocks the repair did not touch (`Modal Perfects`,
  `By + Agent`, and `Passive with Modals` › *Aktif mi, edilgen mi?*). The
  `Modal Perfects` block is still the best in the file: one rule per item, in
  order, and it survived having three of its four items rewritten under it.
- **Every `pitfall` in all six lessons** read against its own category's four
  items, for the `wrong`/`right` = distractor/key pattern. Two hits, both
  reported (By + Agent 7, Passive Reporting 6). The other sixteen are clean,
  and the six the repair rewrote are all onto scenarios their items do not
  use.
- **Every `contrast`, `forms` and `examples` sentence** in all six lessons
  scanned against its category's filled key sentences at a three-word
  threshold with a content-word filter. Four hits, all reported.
- **`npm run check`**, and `checkLessonGiveaway` run directly against both
  versions of the file.
- **Cross-category collisions:** none that matter. The repair put *prints*
  into a `Modal Perfects` lesson example and into the new t13 stem on the same
  night, and *tunnel* into two lessons; check blocks only ever draw from their
  own category, so neither is a giveaway. Recorded because someone will find
  them and wonder.

---

## 9 · The findings I am least sure of, in order of my own doubt

**1. t14's paragraph-deleted failure — the finding I would most like a
second reader on, because the whole Causative verdict rests on it.** The
chain is: the app shows the category label above every question
(`js/quiz.js:225`); the label says *Causative: Have/Get Something Done*; two
of the four options are not English and the third is not a causative;
therefore the key is the only option the label admits, and the paragraph is
optional. Every link is checkable. What I am not sure of is the weight: this
is a label-plus-pattern-knowledge giveaway, and the nine items the repair was
convened against needed no knowledge at all — you picked the only legal
string. A reader who thinks "knows what a causative is" is enough work to ask
of a B2 learner will call t14 a good item, and their verdict is defensible.
Mine is that the category name is printed on the screen and the item is
answerable from it.

**2. The doubled-modal tell (§1.3).** Five items, five hits, never wrong. I
believe the pattern is there — it is arithmetic. What I cannot calibrate is
whether a Turkish B2 exam candidate would find and trust it. It needs an
induction across items that the original defect did not, so I recorded it as
a cost rather than a block, and both modal categories ship. If I am wrong in
either direction it is here, and the fix is two words on two items, so the
cheap course is to make it moot.

**3. Whether r3 fires on t3 (§4.1).** The condition's head — "a definite,
closed past moment is given" — is satisfied by *since it was first published*.
Its gloss — "a date, a year, or an expression like *yesterday / last week /
two years ago*" — is not. Which half a learner runs on is a guess about
learners, and I am guessing. What I hold firmly is the narrower claim: the
repair replaced a rule that *could not* fire on t3 with a rule that *can*, in
front of the rule that decides t3, while leaving that rule's known missing
caveat undone. The hazard is new even if it never fires.

**4. r1 firing on t13 (§4.5).** I read *"bu iş … başka bir geçmiş andan önce
bitmişse"* literally, and t13's narrative does put the reprint before *"the
second batch was exactly right"*. A learner may reasonably require the
explicit *By the time* marker that t16 has. It returns a form t13 does not
offer, so nothing rides on it; I include it only because the rule was widened
to reach one item and t13 is the item next door.

**5. t21's `by a stranger`.** I am confident the explanation's argument is
wrong — *no idea who took it* does not exclude *a stranger*. I am less
confident about what follows. This is a style item by design, the repair and
the blind pass both say so, and the explanation is otherwise the most honest
in the file. The finding is "the reason given is not the true reason", not
"the item must go".

**6. The four sub-threshold giveaways (§5).** These I doubt least. The
sentences are in the file, the shared words are countable, and the standard
is the repair's own, applied by the repair to four other sentences in the
same lessons on the same night. If anything here is wrong it is my ranking of
t3/t4 as blocking while calling t5's *"Applications should be submitted
online"* merely worth fixing — the line between "same scenario" and "same
pattern" is mine, not the project's, and I drew it at whether the shared
words are the sentence's content nouns.

**7. Passive Reporting's three structural failures.** Almost no doubt about
the fact — `is said to` against three actives is not a four-option item — and
some about the verdict, since the repair was never asked to fix them. I am
failing a category for a defect its repairer did not introduce and did not
claim to have addressed. I think that is right: the verdict is about the file,
and the point of an independent pass is to say where the file actually stands
rather than to grade the diff.
