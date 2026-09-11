# Fourth repair round — `passive-voice`

2026-09-05. Scope: `data/passive-voice/passive-voice.json`, nothing else. No
code, no manifest, no other content file. Working from
`docs/audit/re-audit-passive-voice-2.md`, which blocks three of the six
categories and lists four smaller findings.

The round under repair is `docs/audit/repair-passive-voice-2.md`. Two of my
three blocking items are that round's own edits: a rule reworded to reach one
item and left false of another, and a qualifier written to close a hazard the
log had correctly diagnosed that does not close it. So every rule I touched is
re-run below as a literal checklist over **all four** items in its category,
by reading only the string a learner sees — and so are the three blocks I did
not touch.

---

## 0 · Everything that changed

| where | change |
| --- | --- |
| **t1** | `paragraph` rewritten: the durational frame (*the same recipe that's been in the family for three generations*) is gone. `explanation`, `tip` and two `optionNotes` rewritten with it. §3 |
| **t4** | `explanation` rewritten — it now names `has been` and `was` in their own words. §4.5 |
| **t16** | `explanation` rewritten — it now names `had` and `have had`. §4.5 |
| **t17** | `paragraph` gains one clause (*he had spotted the crack himself during an inspection*) and *a note* becomes *his note*; `explanation` and the `is said to have been warned` note re-stated against the new text. §4.1 |
| **t18** | *after the second tremor* → *when the tremors began* (a definite reference with no antecedent); the `It is believed that they have` note's stated reason corrected. §4.4 |
| **`Passive Reporting Structures` › `forms`** | two rows added — `It + was + V3 + that` and `was supposed to`; heading changed from *to'dan sonrası zamanı taşır*, which is no longer the whole truth; two `use` cells re-pointed at the axis the rows now contrast on. §4.2 |
| **`Passive Reporting Structures` › `text`** | rewritten: the reporting verb carries a tense of its own, and the `that`-clause carries its own. §4.2 |
| **`Passive Reporting Structures` › `examples`** | one item added, in the past (`was believed to be`). §4.2 |
| **`Passive Reporting Structures` › `decision`** | r1's second conjunct now reaches a subject that sits inside the option; r2 stops spelling a tense it does not decide; two rules added that decide that tense. §1 |
| **`By + Agent` › `decision` r1** | second conjunct now excludes an instrument as well as an agent. §2 |
| **`Causative` › `decision` r5** | *(repaired them, cut my hair)* → *(cleaned the windows, cut my own hair)*: it no longer prints t14's best distractor. §4.3 |

Not touched, deliberately: t6, t7, t9, t10, t12 (§8.1), and every question in
`Passive with Modals` and `Modal Perfects in Passive`.

**Results.** `npm run format` then `npm run check`: exit 0, `✓ content files
are formatted`, `✓ Content validation passed`, 136/136 tests including the
`CEILING = 0` giveaway ratchet. The two warnings `npm run validate` prints are
the pre-existing ones in `academic-nouns-adjectives` and `roadmap.json`; none
in this file. Giveaway sweeps in §7.

---

## 1 · Blocker — `Passive Reporting Structures` › `decision`

**The defect.** r1 read *"Boşluk cümlenin başındaysa **ve arkasından tam bir
cümle (özne + fiil) geliyorsa**"*. The previous round rewrote t18 so that its
subject moved **inside the option** (`It is believed that **they**`), leaving a
bare VP after the blank. r1's second conjunct is false of that text, so r1 does
not fire; r2 and r3 do not; **r4 fires** and returns `to have + V3`, which on
t18 is `They are believed to have` — a distractor.

**The repair, in three parts.**

```
r1  Boşluk cümlenin başındaysa ve arkasından bir cümle gövdesi (fiil)
    geliyorsa — öznesi boşluktan sonra da durabilir, seçeneğin içinde de
    olabilir                       → It is/was said/believed/reported that ...
r2  … (unchanged condition)                     → is / was supposed to + V
r6  Kalıbı seçtikten sonra bir de aktarma fiilinin zamanı kalır: aktarılan
    görüş bugün de tekrarlanıyorsa ya da beklenen an henüz gelmediyse
    aktarma fiili geniş zamanda kalır  → is said / is believed / is supposed to
r7  Aktarılan görüş sonradan bırakılmışsa ya da beklenen an gelip geçmiş,
    beklenen iş olmamışsa aktarma fiili geçmişe çekilir
                                      → was said / was believed / was supposed to
```

1. **r1's second conjunct** now asks for a clause *body* and says outright that
   the subject may be inside the option. This is the wording the `Causative`
   block got last round for the identical reason and did not carry across.
2. **r1's and r2's `then` stop spelling a tense they do not decide.**
   `It is said/believed/reported that ...` → `It is/was …`, and
   `is supposed to + V` → `is / was supposed to + V`. Before this round the
   lesson taught no past reporting verb at all, so spelling the present in the
   `then` was invisible; now that the past is taught (§4.2), a `then` that
   silently picks a tense is a rule that is false of an item nobody has written
   yet. The tense is decided by r6/r7 instead.
3. **r6 and r7 decide `is` against `was`** — the axis both t18 and t20 now turn
   on, and the one the audit refused to accept as knowledge borrowed from a
   neighbouring lesson. They are placed last and their conditions say they are
   a second step (*"Kalıbı seçtikten sonra…"*), because they choose a tense on
   a frame the earlier rules have already chosen.

**What r1 does not do, and I am not claiming it does.** Its `then` is a frame,
and on t18 three of the four options instantiate it. r6 then removes
`It was believed that they`. The last cut — `It is believed that they` against
`It is believed that they have` — is the tense *inside* the `that`-clause,
which the block does not own and now says so: the `text` block's closing
sentence is *"that'li yapıda yan cümle kendi zamanını kurar"*. The full trace is
in §5.5.

---

## 2 · Blocker — `By + Agent: Include vs Omit` › `decision` r1

**The defect.** The previous round's qualifier read *"…ve boşluktan sonra
**onu** söyleyen bir öbek yoksa"* — no phrase after the blank naming **the
agent**. On t23 nobody knows who forged the letter and what follows the blank
is *a modern ballpoint pen*, an **instrument**. So the conjunct is true, r1
fires, and it returns `Passive without an agent` = `was written`, a distractor.
The learner who reasons correctly about the pen gets the wrong answer; the only
path to the key was to skip r1 entirely.

**The repair.** r1 now reads:

> Faili sen de bilmiyorsan ya da someone / people / they gibi belirsizse **ve
> boşluktan sonra ne faili ne de kullanılan aracı söyleyen bir isim öbeği
> yoksa** → Passive without an agent

This is the same disambiguator r4 already had (*"— kullanılan bir araç ya da
malzeme değil"*), applied to the rule that needed it. I took the wording fix
rather than the audit's alternative of moving r5 in front of r1: r1's text is
what is false, and reordering would leave a false rule in the file that happens
not to be reached. Full trace over t21–t24 in §5.6, including the check that
matters for the fix — r1 still fires on t24, where what follows the blank is
*to hospital*, a place, and on t21, where it is a subordinate clause.

---

## 3 · Blocker — t1, and `question-author.md` rule 2

**The defect**, found by two audits and deferred by the last round: *"Fresh
bread **has been baked** every morning at this bakery, using the same recipe
that's been in the family for three generations"* is a sentence a competent
teacher accepts. The perfect wants a durational frame and one was sitting in
the second clause. An option a teacher accepts is a wrong option, and an
`optionNotes` entry that argues the adverbial attaches to the recipe rather
than to the baking is the explanation arguing that the key is *more natural* —
which the brief names as the shape of a broken item.

**The repair** is the paragraph, not the option set: the option set
(`is baked` · `was baked` · `has been baked` · `is being baked`) is four
auxiliaries of one verb and is the reason the item passes the
paragraph-deleted test. The durational frame is gone and the evidence around
the blank is now habitual present:

> Fresh bread ____ every morning at the bakery on the corner, and the queue
> starts forming before the shutters are even up. Whatever is left when the
> shop closes goes to the shelter down the road.

`explanation`, `tip` and the `was baked` / `has been baked` notes are rewritten
against it; the `is being baked` note was already true of the new text and is
unchanged. The substitution test is in §6.1.

---

## 4 · The five smaller findings

### 4.1 t17 — the exclusion the paragraph did not make

The audit's finding: the `explanation` excludes the closest distractor
(`is said to have been warned`) with a fact the paragraph never states — that
the note reached the councillors' desks **from him**. It offered a one-word
repair, *his note*, and told me to check it first.

**I checked it, and one word is not enough.** With *"…two councillors now admit
that **his** note reached their desks"*, the passive option still substitutes
coherently: *the manager was warned about the beam, and then sent a note on to
the council*. Being warned and passing a warning upward are compatible events,
so *his note* makes the passive reading less economical without excluding it —
and rule 2 is about what a teacher **accepts**.

What excludes it is the manager being the *origin* of the warning, which the
paragraph now says:

> The site manager ____ about the cracked roof beam weeks before the ceiling
> came down — **he had spotted the crack himself during an inspection** — and
> two councillors now admit that **his** note reached their desks and was
> quietly filed.

I took *his note* as well: it is what makes the `explanation`'s existing claim
(*notu meclis üyelerine o göndermiş*) true of the text. The `explanation` and
the `is said to have been warned` note are re-stated against the new clause.
Substitution test in §6.2; nothing about the option set or the 2×2 design
changed, so §2.1 of the audit stands.

### 4.2 The `Passive Reporting` lesson had no past-tense reporting verb

t18 and t20 both key `is` against `was` on the reporting verb, and the lesson
attested exactly one cell: six present `forms` rows, present `contrast`,
present `examples`, three present `pitfall`s, and a `text` block that said the
tense difference is carried by what comes after `to` — which steers a learner
toward `is supposed to have started` and `It is believed that they have`, two
distractors. Four additions, all in the lesson:

- **`forms` row** `It + was + V3 + that` / *It was thought/believed that +
  cümle* / *For centuries it was thought that the marshes had no bottom.*
- **`forms` row** `was supposed to` / *S + was supposed to + V* / *The ferry
  was supposed to dock at six, but it never came.*
- **`examples` item** *The tomb was believed to be empty until a second chamber
  was found.* — *Sonradan bırakılmış bir görüş → was believed to + fiil*. This
  is the past of the **subject** frame, which the two new rows do not cover.
- **`text` block** rewritten:

  > Bu kalıpta iki ayrı zaman vardır. **Aktarma fiili** görüşün kendi durumunu
  > söyler: is said bugün de geçerli, was said sonradan bırakılmış demektir.
  > **to'dan sonrası** ise olayın zamanını taşır: … that'li yapıda yan cümle
  > kendi zamanını kurar.

  390 characters, under the 400-character limit the validator enforces.

Two consequential smaller edits came with them. The `forms` heading was
*to'dan sonrası zamanı taşır*, which is now only half of what the block says,
and is `Hangi parça hangi zamanı taşır`. And the two rows that now have a past
counterpart had their `use` re-pointed at the axis they contrast on:
*Genel görüş, cümleyle devam eder* → *Bugün de aktarılan genel görüş*, and
*Beklenti, plan ya da kural* → *Beklenti, plan ya da kural — hâlâ geçerli*.

None of the four new English sentences shares a content word with any of
t17–t20 beyond the pattern verb, and none contains any option string; both
sweeps in §7 are unchanged by them.

### 4.3 The `Causative` r5 parenthetical printed t14's best distractor

The previous round added *"(repaired them, cut my hair)"* to r5. `repaired
them` is t14's option string exactly, in the lesson whose `check` blocks draw
t13–t16. It is two words, so no threshold worth shipping sees it; fixed by
hand:

> Nesne V3'ten sonra geliyorsa **(cleaned the windows, cut my own hair)** ortada
> yaptırma yoktur: işi özne kendi yapmıştır

`cleaned the windows` is the mirror of r2's own illustration (*the windows
cleaned*), which is what the rule is contrasting, and neither string is an
option anywhere in the category. The before/after option-string sweep in §7.3
shows this row as the only delta in that channel.

### 4.4 t18's note, and a definite reference with no antecedent

- The `It is believed that they have` note said *"Anlatılan göç ise 1628 yazına
  tarihlenmiş"*. The paragraph dates the **eruption** to 1628 and says
  explicitly that what became of the people *is far less certain*. The note's
  conclusion was right and its stated reason was not; it now reads *"…1628
  yazına tarihlenen patlamanın ardına düşen, kapanmış bir geçmişe ait."*
- *after the second tremor* named a first tremor the paragraph never mentions.
  It is now *when the tremors began* — a bridging reference to the eruption,
  which the paragraph does mention. It also strengthens the item: a `when`
  clause is a definite past-time adverbial, and the present perfect in
  `It is believed that they have` cannot take one. §6.3.

### 4.5 t4 and t16 explained only their keys

Both were single sentences that named no wrong option, and
`checkExplanationsNameDistractors` missed both by substring collision (t4's
explanation contains the string `is` and t4 has an option `is`; t16's contains
`had`). Both are now full explanations that name the closest wrong option in
its own words — t4: `has been`, then `was`; t16: `had`, then `have had`. The
checker's false negative is a tooling matter and out of scope here (§8.4).

### 4.6 The claim that every rewritten option is a `forms` row

The previous round's log and commit message claim *"Every one of the twelve
options across the three items is a row of the category's own `forms` table"*.
It was false for three of t20's four and for `It was believed that they`.

**I closed two of the gaps and I am leaving two open.** After §4.2 the table
carries `It is …that` and `It was …that`, `S + is supposed to + V` and
`S + was supposed to + V`. It does **not** carry `is supposed to have + V3` or
`was supposed to have + V3`, and I did not add them: they are t20's two
remaining distractors, and a `forms` table is the list of patterns the lesson
teaches a learner to use. The general rule that produces them is already in the
block (`S + is reported to have + V3`) and in the `text` block that says the
infinitive carries the event's time.

**The exact state of the file**, counted rather than asserted: ten of the
twelve options instantiate a row of the table — all four of t17
(`S + is said to + V`, `S + be + V3 + to be + V-ing`, `S + be + V3 + to have +
V3`, `S + be + V3 + to have been + V3`), all four of t18 (the `It is …that` and
`It was …that` rows, plus the subject frame for `They are believed to have`;
the perfect in `It is believed that they have` sits inside the row's own
*+ cümle*), and two of t20. The two that do not are t20's
`is supposed to have started` and `was supposed to have started`, and they are
distractors on purpose. That is the claim, and it is the ceiling of what should
be claimed.

---

## 5 · All six `decision` blocks as literal checklists

Rules read in file order, by their text only, with the item's stem beside them
and the author's intention out of the room. *Fires* means both conjuncts are
true of the text a learner sees before choosing. A rule that fires and returns
a form that is not an option, or is a wrong option, is blocking.

### 5.1 `Tense Forms in Passive` › *Hangi zamanın edilgeni?* — six rules, clean

t1's stem is new this round, so this block is re-run in full.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| **t1** | **r1**, chip `every morning`, verbatim in the new stem | Present Simple Passive | `is baked` ✔ — the only present simple of the four |
| t2 | r1 no; r2 no; **r3** — *in 1973*, a year, with no `since` binding it to today | Past Simple Passive | `was built` ✔ |
| t3 | r1 no; r2 no; **r3 does not fire** — *since it was first published* binds the closed moment to today; **r4**, chip `since` | Present Perfect Passive | `have been sold` ✔ |
| t4 | r1 no; **r2**, chip `now` inside *for now* | Present Continuous Passive | `is being` ✔ |

Rules not reached, checked against t1 anyway because its stem changed: r2's
chips (`now`, `at the moment`, `currently`) — the old stem had none and the new
one has none; r3 — the new stem gives no closed past moment; r4's chips — none;
r5 — there are no two past events; r6 — no `this week` / `this year`. **r1 is
the only rule in the block that fires on t1, and the removal of *for three
generations* did not put a `for`/`since` frame anywhere near r4.**

### 5.2 `Passive with Modals` › *Aktif mi, edilgen mi?* — four rules, clean

Block untouched this round; re-run because the brief says to run the block next
door.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t5 | **r1** — after the blank, *this week rather than next*, a time phrase and not an object | Modal + be + V3 | all four options are `modal + be + V3`; no wrong return |
| t6 | **r1** — *at all times* | Modal + be + V3 | eliminates `must wear` ✔ |
| t7 | **r1** — *in nine smaller instalments across the year*, a PP | Modal + be + V3 | eliminates `can pay` ✔ |
| t8 | **r1** — *until spring* | Modal + be + V3 | all four are passive; no wrong return |

r2 returns the same form as r1 and cannot contradict it. r3 (`Modal + V`) would
return `must wear` on t6 and `can pay` on t7 — it is not reached on either,
because r1 fires first, and its own condition (*özne eylemi yapan kişiyse*) is
false of *hard hats* and of *tuition*. r4 (`Modal + have been + V3`) names a
form no item in t5–t8 offers and fires on none of them.

### 5.3 `Passive with Modals` › *Hangi modal?* — five rules, clean

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t5 | **r1 does not fire** — *no deadline*, *no penalty*: the sanction is explicitly removed; **r2** — filing early is advisable | should be + V3 | `should be submitted` ✔ |
| t6 | **r1** — *anyone who takes one off is walked straight back up to the surface* | must be + V3 | `must be worn` ✔ |
| t7 | r1 no (*the registrar's office is relaxed about this*); **r2 does not fire** — *the total comes to exactly the same amount either way* removes the advantage, so there is nothing to advise; **r3** — an open option | can be + V3 | `can be paid` ✔ |
| t8 | r1 no; r2 no; r3 no (no choice is offered to anybody); **r4** — *the board did not vote* | may / might be + V3 | `might be postponed` ✔ |

r5 (`will be + V3`) would return `will be postponed` on t8; it does not fire —
nothing in t8 is settled or announced, which is the item's point.

### 5.4 `Modal Perfects in Passive` — five rules, clean

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t9 | r1 no — the delivery has happened; **r2** — *it's not here, and the tracking says it arrived yesterday* | must have been + V3 | `must have been` ✔ |
| t10 | r1 no — *much earlier* and *until the final review* close the window, so the catching is no longer doable; r2 no; r3 no; r4 no; **r5** — *it's frustrating that nobody noticed* | should have been + V3 | `should have been` ✔ |
| t11 | r1–r3 no; **r4** — *on the ground floor and completely sheltered* | can't have been + V3 | `can't have been` ✔ |
| t12 | r1 no; r2 no — nothing is asserted as certain; **r3** — *it is just as likely that…* | may / might have been + V3 | `may have been` ✔, the slash form's first branch, and the branch that is an option |

r1 is the rule that could misfire: its `modal + be + V3` is exactly the fourth
option in all four items (`must be`, `should be`, `might be`, `may be`). It
fires on none of them, and the escape on t10 is narrow but real — r1 requires
the action to be *still doable*.

### 5.5 `Passive Reporting Structures` › *Boşluğun iki yanına bak* — seven rules, now clean

r1 and r2 changed this round, r6 and r7 are new, and three of the four items
were rewritten by the previous round.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t17 | **r1 no** — the blank is mid-sentence (*The site manager ____ about…*); r2 no — a warning that was given, not a plan; **r3 no** — the event is earlier, but the manager is the warner, and the new clause says so twice; **r4** | to have + V3 | `is said to have warned` ✔, the only option of that shape |
| **t18** | **r1 fires** — the blank opens its sentence, and after it stands *moved inland when the tremors began*, a clause body whose subject is inside the option | It is/was said/believed/reported that … | narrows to three: `It is believed that they`, `It was believed that they`, `It is believed that they have`; eliminates `They are believed to have`. **Then r6** — *an account the island's guidebooks still repeat* → present reporting verb → eliminates `It was believed that they`. Two left; the last cut is the `that`-clause's own tense (§1) |
| t19 | r1 no — blank mid-sentence; r2 no; **r3** — *late last night*, and the hikers were seen | to have been + V3 | `are reported to have been` ✔ |
| t20 | r1 no; **r2** — a scheduled meeting whose schedule is not to be trusted | is / was supposed to + V | narrows to two: `is supposed to start`, `was supposed to start`. **Then r6** — the corridor clock says twenty to, so the expected moment has not come → `is supposed to start` ✔ |

Rule by rule, is each true of **every** item in the category?

- **r1** fires on t18 only. Its first conjunct is false of t17, t19 and t20,
  whose blanks are all mid-sentence, so the widened second conjunct cannot
  reach them. ✔
- **r2** fires on t20 only. t17 is a warning that was given; t19 a sighting
  reported; t18 a belief about a migration — none is an expectation that may
  not have been met. ✔
- **r3** fires on t19 only; on t17 and t18 the reported event *is* earlier but
  the subject did the acting, and on t20 there is no earlier event. ✔
- **r4** fires on t17 only — and, decisively, **is not reached on t18**, where
  it returns a distractor. That is the whole repair. ✔
- **r5** is reached by no item; it would return `S + is said to + V`, which is
  t17's `is said to warn` — it does not fire there, because the warning is not
  contemporaneous with the report (*weeks before the ceiling came down*). ✔
- **r6** fires on t18 and t20, correctly in both. On t17 and t19 it is
  consistent with the key rather than contradicting it: both keys carry a
  present reporting verb (`is said`, `are reported`), and both items are
  current reports. ✔
- **r7** fires on no item in the category and returns a form no item offers.
  It is the branch the lesson now teaches (§4.2) and the reason r1's and r2's
  `then` no longer pick a tense silently. ✔

**No rule in this block returns a non-key option on any of the four.**

### 5.6 `By + Agent: Include vs Omit` › *By yazayım mı?* — five rules, now clean

r1 changed this round.

| item | trace | returns | on the item? |
| --- | --- | --- | --- |
| t21 | **r1** — *I have no idea who took it*; after the blank stands *while I was on the crowded train…*, a subordinate clause, so neither an agent nor an instrument is named | Passive without an agent | `was stolen` ✔ |
| t22 | r1 no — the agent is known **and** *a fifteen-year-old student* stands right after the blank; r2 no — it is a surprise, not a default; **r3** — *which surprised every critic* | Passive + by + agent | `was written by` ✔ |
| **t23** | **r1 does not fire** — the agent is unknown, but *a modern ballpoint pen* is a noun phrase after the blank naming the **instrument**, which the new conjunct excludes; r2 no; **r3 no** — the agent is not named at all, so it cannot be the sentence's most surprising part; **r4 no** — the phrase after the blank is an instrument, which r4 already excluded; **r5** | Passive + with + instrument | `was written with` ✔ |
| t24 | **r1** — nobody is named, and what follows the blank is *to hospital*, a place: not a noun phrase naming an agent or an instrument | Passive without an agent | `was taken` ✔ |

Rule by rule over all four:

- **r1** fires on t21 and t24 and returns the key on both; it is now false of
  t23 (an instrument follows) and of t22 (the agent is known **and** named). ✔
- **r2** returns the same answer as r1 and holds on t24 as a second reason
  (*An ambulance was there in four minutes*). It cannot contradict a key. ✔
- **r3** fires on t22 only. On t23 the agent is never named; on t21 and t24 it
  is unknown. ✔
- **r4** fires on nothing after r3 has taken t22; its disambiguator keeps it
  off t23. ✔
- **r5** fires on t23 only — the only item whose post-blank phrase is an
  instrument. ✔

The one risk in this wording is the opposite failure: an item where the agent
is unknown and a noun phrase that is *neither* agent nor instrument follows the
blank. t24 is exactly that item (*to hospital*), and r1 still fires on it,
because the conjunct asks only about phrases naming an agent or an instrument.

---

## 6 · The rewritten paragraphs, option by option

`question-author.md`'s question asked of each wrong option: would a competent
teacher accept it in this paragraph? An option that survives is a defect, not a
distractor.

### 6.1 t1

> Fresh bread ____ every morning at the bakery on the corner, and the queue
> starts forming before the shutters are even up. Whatever is left when the
> shop closes goes to the shelter down the road.

- **`was baked`** — *"Fresh bread was baked every morning at the bakery on the
  corner, and the queue starts forming before the shutters are even up."*
  **Rejected.** The coordinated clause and the whole second sentence are
  present simple habitual (*starts*, *is left*, *closes*, *goes*); a past
  habitual cannot sit under them. **Live**: a learner who reads the description
  as a reminiscence picks it, and it is the item's only past option.
- **`has been baked`** — *"Fresh bread has been baked every morning at the
  bakery on the corner…"* **Rejected**, and this is the repair. A present
  perfect with a repeated-event adverbial has to measure a period to now, and
  the paragraph no longer contains one — no *since*, no *for*, no *this week*,
  and nothing durational attached to anything else either. The teacher's
  question *"since when?"* has no answer in the text. **Live**: the Turkish
  learner who reads *hâlâ yapılıyor* reaches for the perfect, which is why the
  option stays in the set.
- **`is being baked`** — **Rejected**: a single event in progress, against
  *every morning*. **Live**, and the commonest error this audience makes.

The key, `is baked`, is the only habitual passive of the four. The evidence for
it is spread across both sentences rather than sitting only in the chip next to
the blank, which the old stem also did not do.

### 6.2 t17

> Nobody at the council will put a name to the story, and the minutes of the
> safety meeting were never circulated. The site manager ____ about the cracked
> roof beam weeks before the ceiling came down — he had spotted the crack
> himself during an inspection — and two councillors now admit that his note
> reached their desks and was quietly filed.

- **`is said to warn`** — **Rejected.** A bare infinitive puts the warning at
  the reporting time or makes it habitual; *weeks before the ceiling came down*
  cannot sit under it. **Live** — it is `pitfall` 2 of this lesson exactly.
- **`is said to be warning`** — **Rejected**, the same failure in the
  progressive. **Live**.
- **`is said to have been warned`** — *"The site manager is said to have been
  warned about the cracked roof beam weeks before the ceiling came down — he
  had spotted the crack himself during an inspection — and two councillors now
  admit that his note reached their desks…"* **Rejected**, and now on the text
  rather than on an inference about narrative function: if he spotted the crack
  himself, nobody warned him about it, and the note that reached the council is
  his. **Live**, and still the closest distractor: the tense is right and only
  the direction is wrong.

Key: `is said to have warned`. The 2×2 of {active, passive} × {contemporaneous,
earlier} is untouched, so §2.1 of the audit — all four options well-formed, no
odd one out — still holds.

### 6.3 t18

Only the stem's time adverbial changed (*after the second tremor* → *when the
tremors began*), so all three wrong options were re-substituted against the new
text:

- **`It was believed that they`** — **Rejected** on *an account the island's
  guidebooks still repeat*, and on the paragraph's present frame (*is dated*,
  *is far less certain*). `was believed` requires a belief that has been given
  up. **Live**, and this is the axis the lesson now teaches (§4.2) rather than
  the axis it silently withheld.
- **`It is believed that they have`** — **Rejected**, and more firmly than
  before: *when the tremors began* is a definite past-time clause, which a
  present perfect cannot take, and it clashes with the coordinated *settled*.
- **`They are believed to have`** — **Rejected**: the following *and that…*
  conjunct has nothing to attach to. **Live** — `pitfall` 1's error exactly.

`explanation`, `tip` and all three notes re-read against the new text: the
explanation quotes *and that a few of them settled…* (still present) and argues
from *rehber kitaplar onu bugün de tekrarlıyor* (still present); the corrected
`have` note now states a fact the paragraph does state (§4.4). Every
`optionNotes` key still matches an option exactly — the validator checks this
and passes.

---

## 7 · Giveaways, before and after

### 7.1 The shipped checker

`checkLessonGiveaway` from `tools/content-checks.mjs`, run over every lesson in
this file with its own category's questions, at the shipped threshold
(run ≥ 6, or ≥ 8 without the key):

| | rows | items |
| --- | --- | --- |
| before (HEAD) | **0** | 0 |
| after | **0** | 0 |

Corpus-wide the count is still 0, so `tests/content-checks.test.js`'s
`CEILING = 0` ratchet holds: 136/136.

### 7.2 The three-word sweep

Run ≥ 3, the lesson sentence must contain the normalised key, and there must be
at least one shared content word between the filled stem and the lesson
sentence — the audit's stricter sweep, re-implemented.

| | rows | items |
| --- | --- | --- |
| before | **2** | 2 |
| after | **2** | 2 |

Identical rows, both the ones two audits have agreed to leave:

| item | lesson sentence | shared | run |
| --- | --- | --- | --- |
| t8 | *The project might be postponed.* | `postponed` | 3 |
| t19 | *Two paintings are reported to have been recovered from a garage.* | `reported` | 5 |

In each the single shared word is the row's own pattern verb. **The number did
not grow**, which is the thing the brief asked me to watch: four new English
sentences went into the `Passive Reporting` lesson this round and none of them
lands in this sweep.

### 7.3 The channel `lessonSentences()` does not read

Verbatim multi-word option strings printed in `decision.rules[].then`, `forms
.rows[].pattern`/`.use`, `contrast.sides[].gloss`/`.label`, `examples
.items[].note`, `pitfall.why` and block headings. Before: 44 rows. After: 43.
The one row that went is the one the previous round added:

```
- Causative › decision.rules[4].condition
-   "Nesne V3'ten sonra geliyorsa (repaired them, cut my hair) …"
-   — passive-voice-t14, DISTRACTOR "repaired them"
```

Nothing was added. In particular the four new `then` strings
(`It is/was said/believed/reported that ...`, `is / was supposed to + V`,
`is said / is believed / is supposed to`, `was said / was believed / was
supposed to`) contain no option string of t17–t20, and neither do the two new
`forms` rows or the new `examples` item. Everything remaining in this channel
is the `Modal Perfects` and `Causative` tables printing the modal and causative
forms that *are* the option strings, which is unavoidable in a category whose
options are the forms it teaches, and which both previous audits accepted.

---

## 8 · What I did not do, and why

1. **The doubled-modal tell in t6, t7, t9, t10 and t12.** The audit ruled the
   previous round's decision right and one of its three reasons false: the
   `Modal Perfects` `forms` block is six modals wide, not four, so
   non-colliding option sets do exist. The reason that carries is the other
   one — do not add a fifth rewrite to a passing category on a night already
   carrying four. This night carries three blocking repairs and a lesson
   rebuild; I left all five items untouched, as the brief instructs.
2. **`Tense Forms` r4's bare `since` chip.** `CONTENT_GUIDE.md` says a signal
   that appears in both branches is worse than no signal, and causal `since` is
   the second branch — t3's own `tip` says so. No item in t1–t4 has causal
   `since`, and the honest fix is a new `condition` rule after r4, which is a
   rule added to a category I am already rewriting an item in. I left it and
   record it as outstanding.
3. **The `Causative` block deciding one item in four.** On t13, t14 and t15,
   r2 returns a *pattern* and the remaining choice is tense, which no rule in
   that block makes. That is the audit's recorded cost and it needs a new rule
   about where the tense sits, in a category that ships. Not this round.
4. **`checkExplanationsNameDistractors`'s substring matching**, which missed t4
   and t16 because their explanations contained the strings `is` and `had`.
   That is a change to `tools/content-checks.mjs` and its tests, and my scope
   is one content file. Both items are fixed in the content; the checker's
   false negative is unchanged and is worth somebody's two lines.
5. **`is supposed to have + V3` as a `forms` row** — §4.6. It is a real form,
   and it is also two of t20's distractors; I would rather the table stayed the
   list of patterns to use.
6. **`npm run verify`.** No HTML, CSS or JS changed.
7. **Anything outside this file.** `contentVersion` for `passive-voice` is 3
   and this round materially changes four questions and a lesson, so whoever
   merges should consider bumping it — but `data/manifest.json` is outside my
   scope and I did not touch it.

---

## 9 · The calls I am least sure of

1. **`has been baked` on the new t1.** The durational frame is gone, and I
   believe the perfect now needs a period the paragraph does not give. A reader
   who thinks *"Fresh bread has been baked every morning at the bakery on the
   corner"* can stand alone with an implied *lately* would say the item is
   still a rule-2 failure. I think the habitual present in the coordinated
   clause settles it, and I would rather be told I am wrong about this one item
   than defer it a third time.
2. **Whether r6 and r7 belong in the `decision` block at all.** They choose a
   tense on a frame the earlier rules chose, so they break the block's "first
   rule that fires wins" shape, and I signalled that inside r6's own condition
   rather than by any structure the schema offers. The alternative was leaving
   the axis both t18 and t20 turn on undecided anywhere in the lesson, which is
   what the audit refused to ship.
3. **t17's added clause.** *he had spotted the crack himself during an
   inspection* is a fifty-third word in a stem that was already long, and it
   makes the exclusion explicit rather than inferential. Somebody may prefer
   the audit's lighter *his note* alone; I did not take it, because I could not
   make it exclude the option (§4.1) and an exclusion that needs an argument is
   what rule 2 is about.
4. **`got repaired` on t14** — inherited, untouched, and I share the audit's
   doubt that it is live rather than dead. It does not move the category's
   verdict either way.
5. **The new `forms` rows changing what the lesson emphasises.** The table is
   now eight rows, and two of them are past. A reader who thinks the block was
   already at its limit would put the past into `examples` alone. I think a
   table that attests one cell of a 2×2 six times over is the giveaway the
   audit called it, and rows are the part of a lesson a learner comes back to.
