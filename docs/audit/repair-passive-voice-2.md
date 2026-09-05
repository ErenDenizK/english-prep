# Second repair round — `passive-voice`

2026-09-05. Scope: `data/passive-voice/passive-voice.json` and nothing else.
Worked from `docs/audit/re-audit-passive-voice.md`, which confirmed the first
repair (`f543ec9`) on `Passive with Modals` and `Modal Perfects in Passive`
and failed four categories. Those four are this round's list, in the order the
brief gives them. No code, no manifest, no other content file was touched.

The standard I held every change to is the brief's, not "did I address the
finding": **does the item now exclude every wrong option, and does it still
need its paragraph.** So every rewritten item below carries three substituted
wrong options judged one at a time, a paragraph-deleted result, and — where a
`decision` block moved — a rule-by-rule trace over all four of its items.

Two corrections from the re-audit are taken as the current state and are not
re-litigated: `By + Agent` rule 3 **is** tested (it precedes r4 and decides
t22), and the `Causative` trace for t14 in the previous log read option text
as stem text.

---

## 1 · `Passive Reporting Structures` — t17, t18 and t20 rewritten

The headline defect of the file, in the one category the previous round never
opened: three of four items whose key was the only well-formed option. The
category label is printed above every question (`js/quiz.js:225`), so
"the only option the label admits" is a live giveaway and not a thought
experiment.

Before:

| item | options | why the key picked itself out |
| --- | --- | --- |
| t17 | `is said to` · `is saying to` · `says to` · `is telling to` | one passive report, three actives |
| t18 | `It is believed` · `It believes` · `It is believing` · `They believe it` | one passive report, two malformed actives, one active |
| t20 | `is supposed to` · `is supposing to` · `supposes to` · `is supposed` | two actives and one truncation |

t19 is the category's good item — the re-audit calls it the only one that
tests time in the infinitive — and it is the model all three rewrites copy:
**the reporting frame is held constant across all four options and the
paragraph decides what goes inside it.** Nothing in the three new option sets
is ungrammatical, and no option is of a different shape from the others.

Every one of the twelve options across the three items is a row of the
category's own `forms` table (`It ... that`, `to + V`, `to be + V-ing`,
`to have + V3`, `to have been + V3`, `be supposed to`), so the lesson
supports every option the learner has to reject.

### 1.1 t17 — active-vs-passive infinitive, with the time held down

> Nobody in the department will put a name to the story, and the minutes of
> that meeting were never circulated. The site manager **____** about the
> cracked roof beam weeks before the ceiling came down, and two councillors
> now admit that a note reached their desks and was quietly filed.
>
> `is said to have warned` ✔ · `is said to warn` · `is said to be warning` ·
> `is said to have been warned`

A 2×2 grid: {active, passive} × {contemporaneous, earlier}. The key is
active + earlier. The verb is `warn about`, which passivises without an
object (`he was warned about X`), so **all four options are grammatical in
the slot** — the choice is meaning, not syntax. That is the property the old
item lacked and the reason the scenario had to change: with an object after
the blank the passive options are ungrammatical and the item collapses again.

**Substitution, one option at a time.** Would a competent teacher accept it?

- `is said to warn` — *"The site manager is said to warn about the cracked roof
  beam weeks before the ceiling came down."* **Rejected.** A present habitual
  infinitive under a specific closed-past adverbial; the two cannot be in the
  same clause. Live error: matching the infinitive to the reporting verb.
- `is said to be warning` — *"...is said to be warning about the cracked roof
  beam weeks before the ceiling came down."* **Rejected**, for the same reason
  in the progressive: it puts the warning in progress now, and the paragraph
  puts it before the ceiling fell and reports its consequence.
- `is said to have been warned` — *"...is said to have been warned about the
  cracked roof beam weeks before the ceiling came down, and two councillors now
  admit that a note reached their desks."* **Rejected, and this is the item's
  real test.** Grammatical, and the time is right; it reverses who warned whom.
  The paragraph decides it in the second clause: the note reached the
  councillors' desks, so the manager is the source, not the recipient. Nothing
  next to the blank settles this — the deciding evidence is a clause away.

**Paragraph deleted:** four strings of the form `is said to …`. None is the
only well-formed one, none is the only one the label admits, none is of a
different shape. A learner with no paragraph must guess between four rows of
the lesson's own table. **Passes.**

This item is also what makes the category's `decision` block r3/r4 pair
(earlier + undergoer vs earlier + doer) a decision somebody actually has to
make; before, no item turned on it.

### 1.2 t18 — the two frames, decided by a second `that`-clause

> The eruption itself is dated, from the ash layer, to the summer of 1628.
> What became of the people who farmed the eastern slope is far less certain.
> **____** moved inland after the second tremor, and that a few of them
> settled as far away as the mainland — an account the island's guidebooks
> still repeat.
>
> `It is believed that they` ✔ · `It was believed that they` ·
> `It is believed that they have` · `They are believed to have`

The lesson's headline `contrast` is *It is said that + clause* against
*S + is said to + V*, and until now no item made the learner choose between
them — the old t18 made them choose between one passive and three actives.
The sentence carries a **second** coordinated `that`-clause, which only the
`It ... that` frame can host. That is a structural fact about the two
patterns, not a stylistic preference, so the choice is decidable.

**Substitution:**

- `They are believed to have` — *"They are believed to have moved inland after
  the second tremor, and that a few of them settled as far away as the
  mainland."* **Rejected.** The `and that ...` conjunct has nothing to attach
  to; the subject-first frame continues with `to + V` and cannot take a
  `that`-clause. This is exactly the error `pitfall` 6 in this lesson is built
  on, so it is live rather than dead.
- `It was believed that they` — **Rejected.** A past reporting verb says the
  belief has been given up. The last clause says the guidebooks still print it.
  The evidence is at the far end of the sentence, not beside the blank.
- `It is believed that they have` — **Rejected.** Present perfect against an
  event dated to the summer of 1628 in the paragraph's first sentence. Also
  decided from a distance.

**Paragraph deleted:** all four are well-formed reporting fragments; two are
the `It` frame in different tenses, one is the `It` frame with a perfect, one
is the subject frame. Nothing picks itself out. **Passes.**

### 1.3 t20 — `be supposed to`, tense on both halves

> The programme taped to the door gives nine as the starting time, and the
> clock in the corridor still says twenty to. The meeting **____** at nine,
> though anyone who has sat through one of these knows that nothing will be
> decided before eleven.
>
> `is supposed to start` ✔ · `was supposed to start` ·
> `is supposed to have started` · `was supposed to have started`

A second 2×2: {is, was} × {to start, to have started}, perfectly balanced, so
no option is the odd one out on shape. The clock decides all three exclusions,
and the clock is in the previous sentence.

**Substitution:**

- `was supposed to start` — *"The meeting was supposed to start at nine."*
  **Rejected**, and it is the closest distractor: `was supposed to` says the
  nine o'clock start has already failed. It is twenty to nine. (Note the old
  paragraph — *half the team still hasn't arrived* — would have **accepted**
  this option; that is why the paragraph had to move the clock before nine.)
- `is supposed to have started` — **Rejected.** The expectation is that the
  meeting has already begun by now; it is not yet nine.
- `was supposed to have started` — **Rejected** on both counts at once, and
  it needs an earlier past vantage point the paragraph never supplies.

**Paragraph deleted:** four `supposed`-frames, two tenses × two infinitives.
**Passes.**

The old t20's paragraph had a second defect worth recording: *half the team
still hasn't arrived and nobody seems worried* is the evidence for a plan
that has already failed, which is the reading `was supposed to` wants. The
item was keyed present and written past.

### 1.4 What the rewrites cost, and what they closed

- **Closed without touching the lesson:** the re-audit's sub-threshold
  giveaway on t17 (its keyed sentence was `pitfall` 6's `right`, *"The CEO is
  said to be very demanding"*) is gone, because the item no longer keys
  `is said to` on a demanding boss. Same for the three `is supposed to`
  lesson sentences that carried t20's old key verbatim. The stricter sweep
  (§6) drops from seven hits in this lesson to zero without a lesson edit.
- **Cost:** the old t17 and t20 each punished a real Turkish-learner error
  that no item now punishes — `is supposed` without `to` (`pitfall` 8) and
  `tell` in a reporting frame. Both errors remain taught in the lesson; they
  are no longer tested. That is the price of "every option well formed", and
  it is the trade the brief asks for.
- The `decision` block for this category is **unchanged**; its trace over the
  three new items is in §5.1.

---

## 2 · `Causative: Have/Get Something Done` — t14, and the block that could not reach it

The re-audit's finding: t14 was rewritten by the previous round *to be* the
category's meaning-decided item and reproduced the defect it was written for.
Under the printed label *Causative: Have/Get Something Done*, `made them
repaired` and `got repaired them` are not English and `repaired them` is not a
causative, so the key was the only option the label admits — the paragraph was
optional.

Before: `got them repaired` · `repaired them` · `made them repaired` ·
`got repaired them`.
After: `got them repaired` ✔ · `repaired them` · `get them repaired` ·
`got repaired`.

The paragraph moved with the options, because the old one could not exclude a
present tense: *"when the kitchen sockets stopped working"* is a past frame
but a thin one, so the stem now dates it and closes it twice.

> The lease is very clear that tenants must not touch the wiring themselves.
> So when the kitchen sockets went dead **last month** we **____** within a
> day, and the landlord **paid** the electrician's bill without an argument.

**Substitution, one option at a time.**

- `repaired them` — *"...we repaired them within a day, and the landlord paid
  the electrician's bill."* **Rejected**, and it stays the best distractor in
  the file: flawless English, and contradicted twice — the lease forbids the
  tenants touching the wiring, and an electrician billed the landlord. The
  item's whole test.
- `get them repaired` — *"...when the kitchen sockets went dead last month we
  get them repaired within a day, and the landlord paid..."* **Rejected.** The
  causative pattern is right and the tense is wrong: two past verbs in the same
  sentence (`went dead`, `paid`) rule out a present habitual, and `last month`
  rules out a historical present. This is the option that keeps the paragraph
  necessary — it is admitted by the label exactly as the key is, and only the
  paragraph separates them.
- `got repaired` — *"...we got repaired within a day..."* **Rejected.** A
  well-formed `get`-passive with the object dropped, which makes the tenants
  the thing repaired. Not dead: dropping the object is the same word-order
  failure `pitfall` 7 teaches, and the option is the one a learner writes when
  they remember `get ... done` but not `get something done`.

**Paragraph deleted:** two of the four options (`got them repaired`,
`get them repaired`) are `get + object + V3` causatives that the label admits
equally, and a third (`got repaired`) is in the family's shape. Nothing is
malformed, nothing is the only thing the label admits, and the choice between
the two causatives is a tense the options cannot carry on their own.
**Passes** — narrowly, in the same way the re-audit records t15 passing.

### 2.1 The `decision` block, re-run rule by rule over all four items

Three changes, all forced by the re-audit's §4.5:

| | before | after |
| --- | --- | --- |
| heading | *Boşluktan sonrasına bak* | *Nesne fiilden önce mi geliyor, sonra mı?* |
| r1 | "…ve bu iş, cümlede anlatılan başka bir geçmiş andan önce bitmişse" | "…ve cümle 'by the time' / 'before' gibi bir ifadeyle daha geç bir geçmiş an veriyorsa" |
| r2 | "**Boşluktan sonra** \"nesne + V3\" sırası varsa" | "\"Nesne + V3\" sırası varsa — **ister boşluktan sonra, ister seçeneğin içinde**" |
| r5 `then` | `Past Perfect (had + V3)` | `Active: S + V + object` |

The heading was the reason the block could not reach t14: every rule was
phrased about what follows the blank, and in t14 the causative phrase is
*inside the option*. The heading now names the discrimination the block
actually makes, and r2 says where to look for it. r5's `then` was wrong as a
general rule — object-after-verb does not imply past perfect, it implies *not
causative* — and now says the thing the learner writes down.

r1's tightening closes the re-audit's §9.4 hazard: as written it could be read
onto t13, whose reprint does finish before *"the second batch was exactly
right"*. It now requires the explicit marker t16 carries.

Traced in file order, first firing rule wins:

| item | r1 | r2 | result |
| --- | --- | --- | --- |
| **t13** | no — `the whole set reprinted` is object + V3, but there is no *by the time / before* | **fires** → `have / get + object + V3`, tense on have/get; closed past → | `had` ✔ (and `let` eliminated) |
| **t14** | no — no such marker | **fires**, on the option-internal `them repaired` → tense on get; closed past → | `got them repaired` ✔ |
| **t15** | no | **fires** → tense on have/get; *Every few years* → present simple → | `have` ✔ |
| **t16** | **fires** — *By the time we moved in* is exactly the marker, and `the entire kitchen renovated` is object + V3 → | — | `had had` ✔ |

No rule returns a non-key option on any of the four, and the block now reaches
every item in its own category — which it did not before this change. r3
(`have + person + V`) and r4 (`make + person + V`) are reached by no item and
earn their place by excluding: r4 excludes `make` on t15, r3 is the second
causative pattern the `examples` block teaches. r5 is an exclusion rule and is
read as one; with its `then` corrected it no longer hands a learner a form the
item does not offer.

### 2.2 Two true-about-English fixes in the same category

- **t13's explanation claimed something false.** *"…bu sırayı İngilizcede
  yalnızca 'have' ile 'get' alır"* — only *have* and *get* take object + past
  participle. *Want*, *need*, *like*, *prefer*, *see* and *hear* all do
  (*I want the whole set reprinted*, *I need this finished by Friday*). The
  claim was narrowed rather than deleted, to the thing that is true and is what
  the item turns on: *"…bu kalıpta yaptırma anlamını taşıyan fiiller have ile
  get'tir."* Nothing in t13's options turns on the wider claim, so no option
  judgement changes.
- **The `make something done` overstatement is gone from both places.** The
  re-audit recorded it as asserted twice: t15's note and, copied by the
  previous round, t14's note for `made them repaired`. That option no longer
  exists, so one instance went with it; t15's note and explanation were
  reworded to exclude `make` by what it *does* take (a person and a bare verb)
  rather than by denying a pattern that exists in a small fixed class
  (*make yourself understood*, *make it known*). The exclusion is unchanged in
  force.

---

## 3 · `Tense Forms in Passive` — the lesson moved, not the questions

The re-audit's finding is the class of defect it says every re-audit tonight
has found: the previous round opened the `forms` table, rewrote its Past
Simple row because the checker flagged t2 at six words, and left the two rows
next to it that carry t3's and t4's keyed sentences below the threshold.

> *"The lobby is being renovated."* against *"the main lobby ____ renovated
> this week"* is the same sentence.

The brief's instruction — move the lesson rows, not the questions — is right:
both items are sound, and both are the only item in the category testing their
own tense. Three lesson sentences changed, no question did.

| block | before | after | why |
| --- | --- | --- | --- |
| `forms`, Present Continuous | *The lobby is being renovated.* | *The old cinema is being converted into flats.* | t4's keyed sentence minus its adverbial |
| `forms`, Present Perfect | *Three million copies have been sold.* | *Two new wards have been added to the hospital.* | t3's keyed sentence, three content words |
| `examples`, item 4 | *Over a million units have been sold since launch.* | *Nearly four hundred trees have been planted since the campaign began.* | t3 again, this time with `since` as well |

Each replacement was checked against all four of the category's filled key
sentences: `cinema / converted / flats`, `wards / added / hospital` and
`trees / planted / campaign` share no content word with t1 (bread, bakery),
t2 (bridge, 1973), t3 (copies, novel, sold) or t4 (lobby, renovated). They
still carry the key *string* of their own row (`is being`, `have been`) —
which is unavoidable, because that string is the pattern the row exists to
show, and it is the line the re-audit itself draws between a shared pattern
and a shared scenario.

**After:** the stricter sweep (§6) reports nothing at all in this lesson, at
either threshold.

### 3.1 The `since` hazard the previous round introduced, closed

The re-audit's §4.1 records a hazard this round did not create but does
inherit. The previous repair replaced r3's literal chip list with a judgement
— *"Belirli ve kapanmış bir geçmiş an veriliyorsa"* — and t3's stem gives one:
*since it **was first published***. r3 sits in front of r4, and it returns
**Past Simple Passive**, which is `were sold` — t3's closest distractor. A
rule that fires and returns a non-key option is blocking, so it is fixed here
even though the brief names only the giveaways for this category.

The fix is the one the re-audit praises in `Passive Reporting`: fold the
discriminating test into the earlier rule rather than rely on order.

> r3, after: *"Belirli ve kapanmış bir geçmiş an veriliyorsa — bir tarih, bir
> yıl, ya da yesterday / last week / two years ago gibi bir ifade — **ve bu an
> bir 'since' ile bugüne bağlanmıyorsa**"* → `Past Simple Passive`

Re-run as a literal checklist, first firing rule wins:

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t1 | r1, chip *every morning* | Present Simple Passive | `is baked` ✔ |
| t2 | r1 no, r2 no; r3 — *in 1973*, no `since` | Past Simple Passive | `was built` ✔ |
| t3 | r1 no, r2 no; **r3 no** — the closed past moment is bound to today by *since*; r4, chip `since` | Present Perfect Passive | `have been sold` ✔ |
| t4 | r2, chip `now` inside *for now* | Present Continuous Passive | `is being` ✔ |

r5 and r6 are reached by no item. r6 is the block's own caveat about
`this week` / `this year`, added by the previous round and correct; it earns
its place by warning rather than by keying.

**What I did not do here.** The re-audit also asks for the `since = çünkü`
caveat that lives in t3's `tip` to reach r4. It cannot: r4 is a `signals` rule
and the schema allows exactly one of `signals` / `condition` per rule, so
carrying the caveat would mean giving up the chip list — which is the part of
r4 a learner actually scans for. The re-audit offers r3 *or* r4 as the place;
r3 is the one the schema allows, and it is now done.
