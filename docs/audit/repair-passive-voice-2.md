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

## 0 · Everything that changed

Nine question fields across five items, six lesson sentences, and eight
`decision` rules — in one file, `data/passive-voice/passive-voice.json`.

| what | where | § |
| --- | --- | --- |
| t17, t18, t20 rewritten — stem, options, explanation, tip, all notes | `Passive Reporting Structures` | §1 |
| t14 rewritten — stem, options, explanation, two notes | `Causative` | §2 |
| t13's explanation: a false claim about English narrowed | `Causative` | §2.2 |
| t15's explanation and `make` note: the same overstatement, softened | `Causative` | §2.2 |
| t21: `by a stranger` → `by a thief`, explanation and note with it | `By + Agent` | §4.2 |
| two `forms` examples and one `examples` sentence replaced | `Tense Forms in Passive` | §3 |
| one `forms` example replaced | `Passive with Modals` | §6 |
| `pitfall` 7 moved to a new scenario | `By + Agent` | §4.1 |
| `decision` r3 gains the `since` test | `Tense Forms in Passive` | §3.1 |
| `decision` heading, r1, r2, r5 `then` | `Causative` | §2.1 |
| `decision` r1, r3, r4 gain the agent/instrument test | `By + Agent` | §4.3 |

Unchanged: every item in `Passive with Modals` and `Modal Perfects in
Passive`, t1–t4, t11, t15's options, t16, t19, t22, t23, t24, and the
`Passive Reporting Structures` `decision` block.

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

---

## 4 · `By + Agent: Include vs Omit` — t23's lesson pair, and t21's unsound exclusion

### 4.1 `pitfall` 7 was t23's key **and** its closest distractor

The worst of the four sub-threshold giveaways, because it hands over both
halves of the item:

> `pitfall` 7, before: *"The letter was written **by** a fountain pen."* →
> *"The letter was written **with** a fountain pen."*
>
> t23: *"…the whole letter ____ a modern ballpoint pen"*, keyed
> `was written with` against the distractor `was written by`.

Same verb, same object, same instrument class, in the lesson the previous
round had open and edited in four other places, under the principle that round
stated and did not keep (*"Every `pitfall` whose `wrong`/`right` pair was an
item's distractor/key pair was rewritten onto a different scenario"*).

The pitfall moved, not the item — t23 is sound and it is the category's only
instrument item.

> after: *"The parcel was tied **by** a length of string."* →
> *"The parcel was tied **with** a length of string."*

`wrong` and `right` still differ in exactly one thing, the preposition. The
new scenario shares no content word with any of t21–t24 (`parcel`, `tied`,
`string` against wallet/train, novel/manuscript, letter/pen, bike/ambulance),
and `string` cannot be read as an agent, which the old pen could not either —
that is the point of the pair. The `why` changed only in its second sentence,
to name the new instrument.

This also closes a giveaway on **t22** that the re-audit did not name: the old
pitfall's `wrong` string, *"The letter was written by a fountain pen"*,
contains `was written by` — t22's key — and shares `written` with t22's stem.
It fell out with the rewrite.

### 4.2 t21 — `by a stranger` replaced by `by a thief`

The re-audit is right and the finding is the one I would have been slowest to
find on my own. t21's explanation excluded `was stolen by a stranger` by
claiming it *"asserts, as though it were known, that the thief was a
stranger"*, and that *I have no idea who took it* rules it out. It does not:
on a crowded train, a stranger is the default assumption, and knowing the
thief was a stranger is entirely compatible with not knowing who they were.
A competent teacher accepts it — which is `question-author.md` rule 2, and
makes it a second correct answer rather than a distractor.

The remedy is the blind pass's, applied to the option rather than to the
paragraph: replace it with a redundancy whose emptiness is not an inference.

> `was stolen` ✔ · `was stolen by someone` · **`was stolen by a thief`** ·
> `stole`

**Substitution, one option at a time.**

- `was stolen by someone` — *"My wallet was stolen by someone while I was on
  the crowded train."* **Rejected** — and, as the previous round had it,
  rejected as redundancy rather than as error: the sentence is flawless
  English and `someone` is the long way of saying *I don't know*. The
  explanation says so outright. Unchanged.
- `was stolen by a thief` — *"My wallet was stolen by a thief while I was on
  the crowded train."* **Rejected.** The agent is contained in the verb: what
  steals is a thief, so `by a thief` adds nothing at all. Unlike `by a
  stranger` this needs no claim about what the speaker could or could not
  know, so the exclusion survives substitution — which is the whole reason for
  the swap. No teacher defends it as good writing.
- `stole` — *"My wallet stole while I was on the crowded train."* **Rejected**,
  and live: it reverses the roles, and the reflex to leave the verb active is
  what the lesson's opening `text` block is about.

**Paragraph deleted:** three well-formed passives differing only in what
follows `by`, plus one active. The two `by` options are grammatically perfect,
so nothing picks itself out on form; the decision is a judgement about
information, which is what the category is named for. **Passes**, and it is
still the file's one style item — recorded, not hidden.

Two costs, both recorded rather than fixed. Two of the three wrong options are
now redundancy of a kind (an indefinite agent, a tautological one) rather than
three distinct failure modes; they are distinct as *errors* — one is empty
because it is unknown, the other because it is entailed — but they are one
judgement. And the category still has three syntax items and one style item,
which is the shape the re-audit describes.

### 4.3 The block's order defect, closed by folding the test in

The re-audit's §4.7 records what this block does have wrong: r3 and r4 both
say *fail* and both precede r5, the instrument rule. Mistaking an instrument
for an agent is t23's entire test and `pitfall` 7's entire subject, and the
block puts the two rules that reward that mistake first.

The same fix that was applied to `Passive Reporting` — put the discriminating
test inside the earlier rule instead of relying on order:

| rule | before | after |
| --- | --- | --- |
| r1 | "Faili sen de bilmiyorsan ya da someone / people / they gibi belirsizse" | "…**ve boşluktan sonra onu söyleyen bir öbek yoksa**" |
| r3 | "Fail cümlenin en şaşırtıcı ya da en bilgilendirici parçasıysa" | "Fail — **işi yapan kişi ya da kurum** — cümlenin en şaşırtıcı…" |
| r4 | "Boşluktan hemen sonra faili söyleyen bir isim öbeği geliyorsa" | "Boşluktan hemen sonra **işi yapanı** söyleyen bir isim öbeği geliyorsa — **kullanılan bir araç ya da malzeme değil**" |

r1's qualifier is there for a second reason: read literally, r1 fires on t23
(nobody knows who forged the letter) and returns `Passive without an agent`,
which is `was written` — an actual distractor. The re-audit's trace has t23
reaching r5, i.e. it read r1 as a rule about *omitting* an agent rather than
about a blank with a phrase waiting behind it. With the qualifier the two
readings agree, and t21 and t24 — neither of which has a noun phrase after the
blank — are untouched.

Re-run as a literal checklist over all four items, in file order:

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t21 | **r1** — *I have no idea who took it*, and nothing follows the blank but *while I was on the crowded train* | passive without an agent | `was stolen` ✔ |
| t22 | r1 no (the agent is known **and** stands right after the blank); r2 no (it is the opposite of obvious); **r3** — *which surprised every critic*, and a fifteen-year-old student is a person | passive + `by` + agent | `was written by` ✔ |
| t23 | r1 no (a phrase follows the blank); r2 no; r3 no — a ballpoint pen is not a person or an institution; r4 no — the noun phrase names the instrument, not the doer; **r5** | passive + `with` | `was written with` ✔ |
| t24 | **r1** and **r2** both fire — nobody is named, and *An ambulance was there in four minutes* makes the agent obvious | passive without an agent | `was taken` ✔ |

No rule returns a non-key option on any of the four, and t23 now reaches r5
by being **excluded** from r3 and r4 rather than by their happening to be
about something else. r4 is still reached by no item; as the re-audit says,
that is the better outcome, since r4 is the rule whose condition is purely
syntactic and it earns its place by excluding `was written` on t22.

---

## 5 · The `decision` blocks whose items moved

Three blocks changed and were re-traced in §2.1, §3.1 and §4.3. One block did
**not** change and had three of its four items rewritten under it, which is
the case the previous round got wrong in `Passive with Modals`, so it is
traced here in full.

### 5.1 `Passive Reporting Structures` › *Boşluğun iki yanına bak* — unchanged, and still clean

| item | rules that do not fire | first firing rule | returns | on the item? |
| --- | --- | --- | --- | --- |
| t18 | — | **r1** — the blank opens the sentence and a full clause follows | `It is said/believed/reported that …` | `It is believed that they` ✔ |
| t20 | r1 | **r2** — a plan that may not come off (*nothing will be decided before eleven*) | `is supposed to + V` | `is supposed to start` ✔ |
| t19 | r1, r2 | **r3** — *late last night*, and the hikers were seen rather than seeing | `to have been + V3` | `are reported to have been` ✔ |
| t17 | r1, r2; **r3 no** — the event is earlier, but the manager is the one who warned | **r4** | `to have + V3` | `is said to have warned` ✔ |

No rule returns a non-key option. Two things worth recording rather than
fixing:

- **r2 returns the whole key on t20.** Its `then` spells both halves —
  `is supposed to + V` — so it rejects `was supposed to start`,
  `is supposed to have started` and `was supposed to have started` at once.
  That is the block doing more work than before, not less.
- **r1 narrows t18 from four options to two, not to one.** Its `then` names the
  frame, and both `It is believed that they` and `It is believed that they
  have` instantiate it; the remaining choice is the tense of the reported clause, which
  the paragraph's *summer of 1628* decides and which is ordinary tense
  knowledge rather than reporting-structure knowledge. A block about *which
  reporting structure* has no business choosing that, and I would rather
  record the gap than widen a rule to cover a tense the lesson next door owns.
- **r5 is now reached by no item**, where before it reached t17. It is the
  contemporaneous branch that makes r3 and r4 mean anything — a learner runs
  it on t17 and finds the event is *not* contemporaneous, which is how they
  arrive at r4 — and `is said to warn` is a live distractor it names. It earns
  its place by excluding, on the same reasoning the re-audit accepted for
  `Passive with Modals` r5.

### 5.2 The doubled-modal tell (re-audit §1.3) — **not broken, and why**

The finding: in t6, t7, t9, t10 and t12 exactly one modal appears twice in the
option set and the key is always its fuller form, so *"if one modal repeats,
take the longer one"* answers five items with the paragraph deleted and is
never wrong elsewhere in the file. The re-audit records it as a cost, not a
block, and leaves the call here. I am leaving the five items alone. Three
reasons, and the first is the one that changed my mind:

1. **In every one of the five the doubling is the item's design, not an
   accident.** t6 (`must be worn` / `must wear`) and t7 (`can be paid` /
   `can pay`) hold the modal constant so that the item tests **voice**; change
   the second modal and the active distractor starts failing for two reasons
   at once, which is weaker, not stronger. t9, t10 and t12 hold the modal
   constant so that the item tests **the perfect infinitive**. A minimal pair
   is supposed to differ in one thing. What produces the tell is not the
   doubling but the fact that in all five the *fuller* member happens to be
   keyed.
2. **The cheap fix is not cheap.** The re-audit's suggestion — change the
   fourth option's modal on two of t9/t10/t12, as the untouched model t11 does
   — collides with the corpus check for *"two questions in the same category
   with an identical set of options"*. t11 is `can't have been` / `must have
   been` / `should have been` / `might be`. Give t9 `might be` and t9 **is**
   t11; give t10 `might be` and t10 is t11. `may be` is taken by t12. The
   modal inventory in this category is four wide and the doubling is part of
   what keeps the four option sets distinct.
3. **The durable fix is a rewrite, in a category that ships.** What actually
   kills the tell is keying the *present* form in one of the five — an item
   where `must be` is right and `must have been` is wrong. That is a new item
   in a category the re-audit passed, written by a round that owns it and can
   re-substitute all three of its wrong options. Tonight's file already fails
   four categories; adding a fifth rewrite to a passing one is how the last
   nine rounds introduced defects.

So: recorded, argued, and left. If the next round disagrees, the work is one
item, not five, and §5.2 says which item to write.

---

## 6 · Giveaways, at the shipped threshold and below it

`checkLessonGiveaway` from `tools/content-checks.mjs`, run over this topic
before and after, and then re-run the way the re-audit found its four cases —
threshold lowered to a **three-word** shared run, the lesson sentence required
to contain the key, and at least one shared content word between stem and
lesson sentence, so that a shared *pattern* is not counted as a shared
*scenario*.

| | shipped checker (run ≥ 6) | stricter sweep (run ≥ 3 + key + content word) |
| --- | --- | --- |
| before this round | 0 | 15 rows, 11 items |
| after | **0** | **2 rows, 2 items** |

The corpus-wide count over all ten topics is **0**, so
`tests/content-checks.test.js`'s ratchet (`CEILING = 0`) still holds; the
suite is green.

What the stricter sweep still reports, and why both are left:

| item | lesson sentence | shared content words |
| --- | --- | --- |
| t8 | *"The project might be postponed."* | `postponed` only |
| t19 | *"Two paintings are reported to have been recovered from a garage."* | `reported` only |

In both, the single shared word is the row's own pattern verb — the thing the
`forms` table exists to exemplify — and the scenarios (a launch held back by
an unheld board vote; missing hikers) share nothing with the lesson sentence.
This is the line the re-audit itself drew and I have kept it.

Cleared this round, all five of them sub-threshold and therefore invisible to
CI: t3 (two sentences), t4, t17, t22, t23, plus t5's and t20's. Two were
closed by moving a lesson sentence (§3), two by rewriting a `pitfall` (§4.1),
and four by rewriting the item onto a scenario the lesson does not use (§1) —
which is worth noting on its own: a giveaway can be closed from either end,
and closing it from the item's end costs nothing when the item had to be
rewritten anyway.

One extra, outside the brief's list and recorded as such: the
`Passive with Modals` `should` row was *"Applications should be submitted
online."* against t5's *"your application should be submitted this week"*. The
re-audit calls it worth a second look and not blocking; it is a one-line
change to a `forms` example that no `decision` rule and no item depends on, so
it was made (*"Damaged books should be reported at the desk."*) rather than
left inconsistent with the identical calls made for t3 and t4. No item in that
category changed, and the category's two `decision` blocks are untouched.

---

## 7 · What I did not do, and why

- **`contentVersion` is still 2.** The re-audit asks for it and it is right to
  ask, but `data/manifest.json` is explicitly outside this session's scope —
  other sessions are working in it tonight. Whoever merges these rounds should
  bump `passive-voice` to 3; sixteen of its twenty-four items have changed
  materially across the two repairs and the "Yeni sorular eklendi" badge will
  not fire until someone does.
- **The doubled-modal tell is still there.** Argued at length in §5.2: the
  doubling is each item's minimal-pair design, the cheap fix collides with the
  identical-option-set check, and the real fix is a new item in a category that
  ships.
- **`npm run verify` was not run.** Content-only change, no HTML/CSS/JS, and
  the sweep needs a browser.
- **t16 is still unchanged**, and with it the re-audit's judgement that the
  category keeps one contestable key. The blind pass rated it *probable*, plain
  causative `had` reads acceptably, and every fix I could construct strained
  the item; t14's repair does not depend on it.
- **t1's thin exclusion of `has been baked`** — *"Fresh bread has been baked
  every morning at this bakery"* is a sentence a competent teacher accepts, as
  the re-audit says. It is a real `question-author.md` rule 2 failure and it
  is **not fixed here**: the brief's list for `Tense Forms in Passive` is the
  t3/t4 giveaways, the fix is a paragraph rewrite rather than a lesson move,
  and I would rather hand the next round one clearly-stated item than fold an
  unasked-for rewrite into a round already carrying four. It is the first thing
  I would put on the next list.
- **The register claim in `Passive Reporting`'s `contrast` gloss**
  (*"akademik metinlerde daha sık görülür"*) is a claim the app cannot support,
  and both audits say it should go. It sits in a category I rewrote three items
  in, so leaving it is a judgement call: deleting the clause changes what the
  learner is told about *when to use* the second frame, which is the axis t18
  now tests, and I did not want to make that change in the same round that
  rewrote the items. Recorded, unchanged, still true that it should go.
- **`Passive with Modals` and `Modal Perfects in Passive` items are
  untouched.** Both ship on the re-audit's verdict; the only thing changed in
  either lesson is the one `forms` example in §6.
- **I did not commit or push.** One snapshot commit
  (`ce88106 Snapshot: passive-voice third round, in progress`) appeared
  mid-session from the environment's own checkpointing, not from a git command
  in this session; the remaining changes are in the working tree.

---

## 8 · What was run

```
npm run format          # after every content edit
npm run check           # format --check + validate + palette + 136 unit tests
```

`npm run check` is clean. `npm run validate` prints two warnings, both
pre-existing and both in other files (`academic-nouns-adjectives`,
`roadmap.json`); none is attributable to `passive-voice`. All 136 tests pass,
including `the corpus backlog only shrinks`, whose ceiling is 0.

Per item, before it was accepted:

- every wrong option substituted into the paragraph and judged one at a time
  against `question-author.md`'s question — §1.1, §1.2, §1.3, §2, §4.2;
- the paragraph-deleted test run on all four rewritten items, with the
  category label in view because `js/quiz.js:225` prints it — all four pass,
  t14 narrowly;
- every `explanation`, `tip` and `optionNotes` entry re-read against the new
  text, and every `optionNotes` key checked against its own option set (the
  validator enforces this, and it passes);
- all four `decision` blocks in the four categories traced rule by rule in
  file order over all four of their own items — §2.1, §3.1, §4.3, §5.1. No
  rule returns a non-key option anywhere.

## 9 · Where I am least confident

1. **t18's exclusion of `It was believed that they`.** It rests on the closing
   apposition — *an account the island's guidebooks still repeat* — making the
   belief current. That is a real signal and it is deliberately placed away
   from the blank, but a learner who reads the past-tense narrative and matches
   the reporting verb to it has made a mistake I want them to make, and a
   marker who reads quickly might call the option defensible. Of everything
   here this is the exclusion I would most like a second reader on.
2. **t14's `got repaired`.** I judge it live — dropping the object is the
   `pitfall` 7 error, and `get + V3` is real English — but it is the weakest of
   the three, and if a reader calls it dead the item is back to three options
   and the paragraph-deleted result gets narrower still.
3. **t21 having two redundancy distractors.** `by someone` and `by a thief`
   are distinct as errors and identical as judgements. I am confident the swap
   is an improvement on an exclusion that did not survive substitution; I am
   not confident it is the best available option set, and a round that wanted
   to could instead give the category a second genuine include/omit item and
   let t21 carry one redundancy only.
4. **Editing `Passive with Modals`' lesson at all** (§6). It is a category the
   re-audit passed and the brief did not assign me. One `forms` example, no
   item, no rule — but the rule that "five of nine rounds introduced a new
   defect" is about exactly this kind of confident small edit, and it is
   recorded here so the next reader can undo it in one line if they disagree.
