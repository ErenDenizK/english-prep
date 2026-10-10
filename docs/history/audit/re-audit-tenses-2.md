# Independent re-audit — the second repair round on `data/tenses/tenses.json`

2026-09-05. Scope: `data/tenses/tenses.json` — its six lessons and its
twenty-five questions. I did not write the content, did not write
`docs/audit/repair-tenses.md`, and did not write
`docs/audit/re-audit-tenses.md`. Nothing was repaired: this file is the
only thing this pass produced.

**The diff audited is `44a9562`** (`git diff 9d948bb 44a9562 --
data/tenses/tenses.json`), 55 lines across 8 hunks. The brief named
`6d05d59`; that hash is not in this repository, and `44a9562` is the
commit whose message begins *"Second repair round on tenses"*. HEAD is
`e6713bf`; `data/tenses/tenses.json` has not moved since `44a9562` and
the working tree is clean.

**This repair wrote no log.** Its session was killed by a rate limit
before `docs/audit/repair-tenses-2.md` existed, so check 3 of
`docs/agents/re-audit.md` — diff the repair against its own account —
has no account to diff against. The commit message is the only record
and was written by the supervisor from the diff, so I treat it as a
third party's reading of the diff rather than as the repairer's claim,
and I re-derive every sentence of it below (§7).

`data/passive-voice/passive-voice.json` was not opened; another session
is repairing it. `npm run validate` reports two warnings, one against
`academic-nouns-adjectives` (t13/t16 share an option set) and one
against `data/roadmap.json` (a 181-char detail). **Neither is mine and
neither is a finding here.** No warning of any kind is reported against
`data/tenses/tenses.json`.

---

## 1. Verdicts

**Five of six categories ship** (six of six after the supervisor's fix to `t25` — §9, appended later the same day). That is a change from the previous
audit, which shipped none of them, and it is earned: all six of its
blockers are genuinely closed, and two of the fixes — the `since`
untangling and the `still` rule — are more thorough than the findings
asked for. Nothing in this table is a mis-key; I substituted every
option of every item the round touched and agree with all four keys, and
every one of the six `decision` blocks returns its category's key on
every one of its category's items, at the first rule that fires.

| category | verdict | the one blocking defect |
| --- | --- | --- |
| Present Simple vs Present Continuous | **SHIPS** | — the orphaned *"Son kural"* prose is rewritten so it introduces the stative rule instead of pointing behind itself. Decision block clean on t1–t4. |
| Present Perfect vs Past Simple | **SHIPS** | — bare `since` is out of the chip list, and the new r1 reaches Past Perfect on `t12` before `since` can be scanned. Clean on t5–t8. |
| Past Simple vs Past Continuous vs Past Perfect | **SHIPS** | — `t12`'s paragraph and key are out of the `text` block, and the tightened r2 closes the previous audit's own least-certain finding. The cleanest work in the round. |
| Future Forms | **SHIPS** | — the `contrast` example that was `t16` minus one word is replaced; the collision is gone at every threshold I measured. |
| Perfect Aspects: Simple vs Continuous vs Been/Gone | **DOES NOT SHIP** — *superseded, see §9: the supervisor fixed this and the category now SHIPS* | `t25`'s rewritten `explanation` argues from a cue that does not discriminate: *"dönmüş olsaydı ceketini alır, masasına dönerdi"* is false of the scenario — someone returning from the archive to their own desk does not collect their coat, and the coat on the chair is equally true whether she is back or not. The learner who chose `has been` is handed an argument that does not exclude `has been`. Introduced by this round, in the one field that teaches a wrong answer. One-clause fix. |
| Time Expressions & Signal Words | **SHIPS** | — the `still`-before-the-auxiliary rule is now stated in five places that agree, and `ago` is replaced by an option the lesson's own chip list teaches. The most thorough fix in the round. |

Item-level, for the four items the round touched:

| item | verdict | note |
| --- | --- | --- |
| `t14` (note) | **ships** | The stranded `have taken` note is genuinely re-anchored: it now argues from *"nothing is arranged"* / *"until just now"*, both of which are in the paragraph. §5.1. |
| `t22` (option swap) | **ships** | `ago` → `yesterday` replaces a positionally-dead option with one the lesson teaches by name — `yesterday` is a chip in this lesson's own tense `decision` block. Two live distractors and one weak one, against one live and two dead before. §5.2. |
| `t25` (paragraph, explanation, notes) | **does not ship** — *fixed, §9* | The key survives, on evidence that sits in the first sentence. The explanation does not. §5.3. |
| `t20` | **untouched** | The brief says `t20`'s paragraph was rewritten. It was not — `git diff 9d948bb 44a9562` does not touch `t20`, and neither did round one. What changed is the *lesson* sentence it collided with. §4.5. |

---

## 2. The six `decision` blocks, run as literal checklists

Rule by rule, in file order, over all 25 items — including the three
categories this round did not touch. `fires` means the rule's antecedent
is true of the item's own text; a rule that fires and names a form the
item offers as a **wrong** option is blocking, whether or not a later
rule would have reached the key.

Round two added or reordered rules in three of the six blocks
(Present Perfect vs Past Simple, Past trio, Time Expressions). I traced
those three twice: once as written, and once assuming the learner scans
for the bolded and parenthesised cues rather than reading the condition.
Both traces are reported where they differ.

### 2.1 Present Simple vs Present Continuous — clean, untouched

r1 stative · r2 timeless truth · r3 habit chips · r4 `now` chips.

| item | first rule to fire | returns | key | on offer? |
| --- | --- | --- | --- | --- |
| t1 | r3 (`every morning`) | Present Simple | `goes` ✓ | — |
| t2 | r4 (`right now`) | Present Continuous | `is working` ✓ | — |
| t3 | r2 (`a fact … memorizes`) | Present Simple | `boils` ✓ | — |
| t4 | r1 (`think`) | Present Simple | `think` ✓ | — |

No misfire. r3's chips are still `every day` / `every morning` and not
bare `every`, so *"every chemistry student"* on t3 does not produce the
right answer off the wrong word; r2 fires first there in any case.

**The round-two change is prose only** and it works. The `text` block
now opens *"Sınavda en çok puan kaybettiren kural şudur:"* — a colon
introducing the stative rule that follows it, with no backward
reference. The dangle is gone, and nothing else in the lesson moved to
create a new one: the block still sits between `check` [3] and
`examples` [5], the examples still include *"I understand the problem
now."* with the note that a stative verb stays Simple, and `decision` r1
still says the same thing. Finding 1 is closed, at the cost of two
words, exactly as the previous audit predicted.

One thing I record without calling it a defect: *"Sınavda en çok puan
kaybettiren kural"* is a claim about the paper the app cannot support.
`docs/CONTENT_GUIDE.md` bans that shape in `intro` and does not ban it
in `text`, and the sentence it replaced made the same claim, so this is
inherited, not introduced.

### 2.2 Present Perfect vs Past Simple — clean, and finding 2 is closed

The block was rewritten. Rules now, in file order:

- **r1 (new)** — *"Cümlenin bağlandığı nokta şimdi değil, geçmişte bir an
  ise (by the time we arrived, when I finally got back): o andan
  öncesi"* → **Past Perfect**
- r2 — chips `[yesterday, last summer, in 2020, two years ago, when I
  was a child]` → Past Simple
- **r3 (edited)** — chips `[already, yet, just, ever, never, so far,
  recently]` → Present Perfect. **`since` is gone from this list.**
- **r4 (edited)** — *"Zaman aralığı hâlâ açıksa — **since** ile verilen
  bir başlangıç noktası da buraya girer (over the past century, this
  week, since she graduated)"* → Present Perfect
- r5 — unstated time, present result → Present Perfect

| item | first rule to fire | returns | key |
| --- | --- | --- | --- |
| t5 | r4 (`since she started university`, span open) | Present Perfect | `has done` ✓ |
| t6 | r2 (`two years ago`) | Past Simple | `met` ✓ |
| t7 | r5 (no time expression, `Look at this mess!` + instant coffee) | Present Perfect | `has broken` ✓ |
| t8 | r4 (`over the past century`, quoted in the condition) | Present Perfect | `has experienced` ✓ |

r2 before r4 is still load-bearing: t6 contains *"since then"*, and the
reverse order would return `have met`, a distractor on that item. It is
preserved.

**Does r1 misfire?** Its antecedent is arguably true of t5 (*"she
started university"*, *"each one taught her"*) and of t6 (*"two years
ago"*) if a learner reads "a past moment appears in the sentence"
rather than "the sentence is anchored to a past moment". I ran both
readings. **Past Perfect is not an option on any of t5–t8** —

- t5: `did` / `has done` / `was doing` / `does`
- t6: `have met` / `met` / `meet` / `was meeting`
- t7: `broke` / `has broken` / `breaks` / `was breaking`
- t8: `experienced` / `has experienced` / `experiences` / `was experiencing`

— so the misfire path returns nothing the learner can write down, they
fall through, and r2 or r4 then reaches the key. Not blocking, and the
block is robust under both readings.

**The finding-2 test, run on `t12`.** This is the whole point of the
change. `t12` — *"I didn't recognize the campus at first because they
____ the whole entrance **since** my last visit"* — is in the Past trio
category, and the previous audit's blocker was that this block, run on
it, returned `have rebuilt`, the trap `t12`'s own `optionNote` names.

Under the new block: **r1 fires.** The sentence is anchored to
*"I didn't recognize the campus"*, a past moment, and the blank is what
finished before it. r1 returns **Past Perfect** → `had rebuilt`, the
key. The defect is closed, by the same standard the previous audit used
to open it.

**Two costs, both real, neither blocking.**

1. **r1's `then` names a form this lesson never teaches.** The lesson's
   `contrast` has two sides (Past Simple, Present Perfect); its `forms`
   block has six rows and none of them is `had + V3`; no `example`,
   `pitfall` or `text` block mentions Past Perfect. The first
   instruction in this category's exam procedure now tells the learner
   to write down a form the page has not shown them a pattern for.
   `docs/CONTENT_GUIDE.md` explicitly permits this (*"a decision can
   name a form the lesson never set against another"*), and the
   alternative — deleting r1 — reopens finding 2, so I record it rather
   than block on it.
2. **r4 bolds `since`.** The guide reserves the scanned-for affordance
   for `signals` chips and says that when the honest answer is a
   condition, write the condition. r4 is a condition with a bolded
   English word inside it, in the one lesson whose repair was about
   `since` not being automatic. A learner who scans r1's parenthetical
   (`by the time we arrived`, `when I finally got back` — neither of
   which matches `t12`, whose past anchor is a bare main clause) can
   skip r1 and land on the bold `since` at r4, which returns
   `have rebuilt`. The rule as *written* is safe; the rule as *scanned*
   is one parenthetical away from the old defect. This is my second-least
   certain finding — §8.

### 2.3 Past Simple / Continuous / Perfect — clean on all five

r1 chips `[by the time, by then, already, before that]` · **r2
(tightened)** *"Anlatı sırayı bozup daha erken bir zamana dönüyorsa **ve
boşluk tam o geriye dönüşse** (ana çizgideki olaylardan önce bitmiş
iş)"* · r3 chips `[while, as, all morning]` · r4 interruption · r5
`when` + sequence.

| item | first rule to fire | returns | key |
| --- | --- | --- | --- |
| t9 | r3 (`while`) | Past Continuous | `was walking` ✓ |
| t10 | r1 (`by the time`, `already`) | Past Perfect | `had left` ✓ |
| t11 | r4 (cooking cut by the power going out) | Past Continuous | `was cooking` ✓ |
| t12 | r2 (the because-clause goes back behind `didn't recognize`, and the blank **is** that step back) | Past Perfect | `had rebuilt` ✓ |
| t19 | r5 (`glanced` → blank → `said`) | Past Simple | `asked` ✓ |

r1's chip `before that` does not match t9's *"before she reached"* or
t19's *"the year before, and"*; r3's `as` does not appear in t11 or t19.

**The tightening of r2 answers the previous audit's own least-certain
finding, and answers it correctly.** That audit recorded (its §2.3, §8.6)
that old r2's antecedent — *the narrative breaks order and returns to an
earlier time* — is true of `t19`, whose paragraph contains *"the deadline
I **had missed** the year before"*, and that the rule survived only
because its consequent scoped the answer. Read by antecedent alone, old
r2 fired on t19 and returned `had asked`, which is on offer.

New r2 puts the scoping **into the antecedent**: *"…ve boşluk tam o
geriye dönüşse"*. On t19 the narrative does step back, but the blank is
`asked`, a main-line event, not the step back — so the antecedent is now
false, on either reading. The exposure is gone. Nobody asked for this
fix; it is the round's best unrequested work, and it means the Past trio
verdict does not change for the second reason the previous audit warned
it might.

I checked the tightening for the opposite failure — a rule narrowed
until it stops firing where it should. r2's only in-category customer is
t12, and it still fires there. t10 is caught by r1 before r2 is reached.
No item loses its rule.

### 2.4 Future Forms — clean on all four, untouched, one inherited near-fire

r1 decision at speech time · r2 chips `[I promise, I think, probably,
maybe, I'm sure]` · r3 visible evidence · r4 arranged personal plan ·
r5 timetable chips · r6 timetable condition.

| item | first rule to fire | returns | key |
| --- | --- | --- | --- |
| t13 | r3 (`Look at those clouds`) | be going to | `is going to rain` ✓ |
| t14 | r1 (`Stop offering…`, `until just now`) | will | `will take` ✓ |
| t15 | r6 | Present Simple | `leaves` ✓ |
| t16 | r4 (`already in both of our calendars`) | Present Continuous | `are having` ✓ |

Round two did not touch this block, and I reach the previous audit's
conclusion independently, including its near-fire.

**t15 / r3 — I agree it is a near-fire, not a fire.** r3's antecedent is
*"Şu anda gözle görülen somut bir kanıta dayanan **tahmin**"*, and its
three parentheticals (darkening sky, empty fuel gauge, broken glass) are
physical states one infers a future event from. t15's *"the board at the
station is very clear"* is an authority statement, not physical
evidence, and t15 asserts a schedule rather than predicting anything, so
the antecedent is false. It matters that I get this right, because
`is going to leave` **is** an option on t15 and r6 sits three rules
behind r3. The safe shape the previous audit named — r6 beside r5, above
r3 — is still the right change and round two did not make it. Inherited,
recorded again, not blocking.

r3's antecedent is also loosely true of t16 (a calendar entry is
visible), and that is harmless for the same reason as §2.2: `be going
to` is not an option on t16.

### 2.5 Perfect Aspects — clean on all four, untouched

r1 gone-to · r2 been-to · r3 quantity chips · r4 quantity condition ·
r5 duration chips · r6 duration condition · r7 Past Perfect.

| item | first rule to fire | returns | key |
| --- | --- | --- | --- |
| t17 | r5 (`for almost three hours`) | PPC | `have been writing` ✓ |
| t18 | r3 (`so far`) | PP Simple | `has read` ✓ |
| t20 | r2 (`before`, experience; she is not in Japan) | have been to | `been` ✓ |
| t25 | r1 (archive named, nobody has seen her, not back) | have gone to | `has gone` ✓ |

r3's chip `three times` does not match t17's *"three hours"*. r1's
antecedent requires *"o kişi hâlâ oradaysa"*, which is false of t20's
addressee, so it does not fire there.

**The r4 / t17 near-fire survives the round.** r4 asks for *"tamamlanmış
bir miktar ya da sayılabilir bir sonuç"* and t17 contains *"two sections
left to finish"* — a countable quantity that is explicitly **not**
completed. The word `tamamlanmış` and the parenthetical *"(kaç bölüm
bitti)"* hold it off; if it fired it would return `have written`, t17's
designated closest distractor. Unchanged, inherited, recorded.

### 2.6 Time Expressions — both blocks clean, and both new rules are safe

The **word** block gained two rules and had one amended:

- r1 `since` · r2 `for` · r3 `ago` · **r4 `already`** ·
  **r5 (amended)** *"Olumsuz cümlede ya da soruda, bir iş henüz olmamışsa
  **ve boşluk fiilden sonra, cümlenin sonundaysa**"* → `yet` ·
  **r6 (new)** *"Aynı olumsuz cümlede boşluk yardımcı fiilin önündeyse"*
  → `still` · **r7 (new)** *"Bir deneyim soruluyorsa (Have you …?)
  **ever**, o deneyimin hiç yaşanmadığı söyleniyorsa **never**"* →
  `ever / never`

| item | first rule to fire | returns | key |
| --- | --- | --- | --- |
| t21 | r1 (blank followed by `last summer`, a point) | since | `since` ✓ |
| t22 | r5 (negative, undone, blank clause-final) | yet | `yet` ✓ |
| t23 | r4 (positive, done ahead of the reminder) | already | `already` ✓ |
| t24 | r3 (blank right after `five years`, verb `moved`) | ago | `ago` ✓ |

Four rules, four items, one each, in file order — the same shape the
previous audit verified, preserved through two additions.

**Do r6 and r7 misfire?** This is where an added rule earns or loses the
category, because `still`, `ever` and `never` are all options on live
items in it.

- **r6 on t21** — t21 is negative (*"I haven't seen my cousin ____"*),
  but the blank is after the object, not before `haven't`, so the
  antecedent is false. r1 fires first regardless, and `still` is not an
  option on t21. Safe twice over.
- **r6 on t22** — the blank is clause-final, so r6's antecedent is false
  and r5's amended antecedent is true. This is the whole discriminator
  of the item, and the two rules now state the two positions
  explicitly, in adjacent rules. Safe.
- **r6 on t24** — t24 contains the word `still` (*"he still says"*) in a
  **positive** clause. r6 requires *"Aynı olumsuz cümlede"*; false. And
  `still` is not an option on t24. Safe.
- **r7 on t23** — this is the one that matters, because **both** of
  r7's answers are t23's distractors. r7's first branch needs a question
  (*Have you …?*); t23 is a declarative. Its second branch needs the
  experience to be denied; t23 says the opposite (*"there's no need to
  remind me"*). The antecedent is false on both branches, and r4 fires
  three rules earlier in any case. **The ordering r4-before-r7 is
  load-bearing and it is correct.** Safe.
- **r7 against the lesson's own `yet` example** — *"Have you finished
  the report yet?"* (examples[4]) matches r7's scannable parenthetical
  `(Have you …?)` exactly. r7's condition qualifies it with *"bir
  deneyim"*, which a report deadline is not, and r5 fires two rules
  earlier and returns `yet`. Safe on file order.

The **tense** block was not touched and is still clean: t21 → r3
(`since`, span open) → Present Perfect, matching `haven't seen`; t22 →
r5 (`yet`) → Present Perfect, matching `haven't been entered`; t23 → r5
(`already`) → Present Perfect, matching `I've`; t24 → r2 (`ago`) → Past
Simple, matching `moved`.

One thing this round quietly earned: **the tense block's r2 chip list
already contains `yesterday`**, so the option that replaced `ago` on t22
is one this lesson names by name and assigns to Past Simple. The word
block's new r7 does the same for `never` and `ever`, which the previous
audit recorded as a taxonomy cost of round one's t23 swap. Both are now
taught. `during` and `while` — t21's other two options — are still
taught nowhere in the lesson (0 occurrences in the whole lesson object).
That class is narrowed, not closed. §6.

---

## 3. The mechanical checks, re-run rather than trusted

```
npm run format -- --check   ✓ content files are formatted
npm run validate            ✓ passed, 2 warnings, neither in tenses
npm test                    136/136 pass
npm run check               passes end to end
```

The two warnings are `academic-nouns-adjectives-t13`/`t16` sharing an
option set and a 181-char `roadmap.json` detail. Neither is in scope.
`tests/content-checks.test.js` now ratchets `CEILING = 0`, so any new
giveaway anywhere in the corpus fails CI.

### 3.1 `checkLessonGiveaway`, at the shipped threshold

I imported `checkLessonGiveaway` from `tools/content-checks.mjs` and ran
it over this topic directly, lesson by lesson against its own
category's questions:

- **tenses, in-category, `GIVEAWAY_RUN = 6`: 0.**
- **tenses, cross-category (every question against every *other* lesson
  in the topic), run ≥ 6: 0.**
- corpus-wide, all ten live topics, run ≥ 6: **0**.

The headline in the commit message is verified. It is also worth saying
what changed underneath it: `lessonSentences()` gained six lines in this
same round and now collects `block.body`, which is how the previous
audit's `t12`-in-a-`text`-block finding became measurable at all. So the
zero is a zero against a *wider* checker than the one that reported 5
before round one, not a zero achieved by holding the checker still.

### 3.2 `checkLessonGiveaway` at a threshold of three

This is the run the passive-voice audit used to find four cases the
shipped threshold misses. Same predicate, `GIVEAWAY_RUN = 3` (so: a run
of 3 carrying the key, or a run of 5 without it).

- **tenses, in-category, run ≥ 3: 5.**
- **tenses, cross-category, run ≥ 3: 0.**
- corpus-wide at 3: **48** (tenses 5, modals 13, passive-voice 15,
  connectors 6, quantifiers 4, academic-nouns-adjectives 3,
  closest-meaning 1, academic-verbs 1, relative-clauses 0,
  gerunds-infinitives 0). At 4: 19, of which **tenses is 1**.

The five in tenses, and what I think each is worth:

| item | lesson sentence | run | avoidable? |
| --- | --- | --- | --- |
| **t17** | `contrast` and `examples`: *"I have been writing for two hours."*; `forms`: *"I have been writing."* | **4**, carrying the key, printed **three times** in the lesson | **Yes.** Same verb, same duration frame, same key. The lesson could teach Present Perfect Continuous with any other verb. This is the strongest sub-threshold case in the file and the only tenses item that survives a threshold of 4. |
| **t18** | `examples`: *"She has read the whole book."* | 3, carrying the key | **Yes.** Same subject pronoun, same verb, same object noun (`book`); t18 is *"She has read five chapters of the book so far"*. |
| **t23** | `pitfall` `right`: *"I have already paid the bill."* | 3, carrying the key | Partly. `I have already + V3` is the pattern `already` **is**, so some overlap is forced; the shared first-person frame is not. |
| **t1** | `contrast`: *"She goes to the gym every morning."* | 3, carrying the key | **No.** The trigger and the key are both above the question — but a Present Simple habit example must contain a habit adverb and a Present Simple verb, so this is forced by what the category teaches. |
| **t20** | `forms`: *"Have you been writing?"* | 3, nominally carrying the key | **No** — an artifact. t20's key is the single word `been`, so `carriesKey` is true of any lesson sentence containing it. `Have you been` is the Perfect question pattern. Noise. |

**None of these was introduced by round two, and none of them is what
blocks Perfect Aspects below** — I block that category on the `t25`
explanation, not on a threshold nobody has adopted. But t17 and t18 are
two of that category's four items, they are avoidable, and the previous
audit named t17 as well. If the next pass wants one mechanical change
that would improve this file more than any other, it is changing the
verb in the Perfect Aspects lesson's `I have been writing` sentences.

### 3.3 The round's new lesson sentences, against the whole corpus

The failure mode the brief names is a sentence moved out of one
collision and into another. I took the seven English sentences this
round added or rewrote and ran each against all 241 questions in all ten
live topics, at run ≥ 3:

| new sentence | worst match anywhere |
| --- | --- |
| *"I am meeting my project partner at four on Thursday."* | none at all. The phrase `project partner` occurs once in `data/`. |
| *"Have you ever tried skiing?"* | none. |
| *"My sister has been / has gone to Berlin three times…"* | `academic-nouns-adjectives-t23`, run 3, **not** carrying the key (*"three times and"*). |
| *"They still haven't announced the results."* | `passive-voice-t20`, run 3, **not** carrying the key (*"still has not"*). |
| *"She still hasn't replied to my email."* | same, run 3, no key. |
| *"The street looked strange to me because they had planted new trees since I moved away."* | `tenses-t12`, run 3, **not** carrying the key (*"because they had"*). §4.3. |

**No sentence this round added carries any question's key anywhere in
the corpus.** That is the check the previous round failed twice and this
one passes cleanly.

---

## 4. Every lesson edit, checked against its whole lesson

Check 4 of the brief, and the one the worst historical failure came
from. For each edit: does the lesson still agree with itself, and does
the edit stay true of all four of its category's items?

### 4.1 Present Simple — the `text` block

Covered in §2.1. Agrees with `examples[2]` (*"I understand the problem
now."*), with `pitfall[0]` (*"I am understanding your point."*) and with
`decision` r1. No item is affected: `t4` is the stative item and its
`explanation`, `tip` and `am thinking` note all still name the same
rule. Clean.

### 4.2 Present Perfect vs Past Simple — *"Have you ever been to Japan?"* → *"Have you ever tried skiing?"*

- Against its own block: the `note` is unchanged (*"Hayat boyu süren bir
  deneyim sorusu → Present Perfect"*) and is still true of the new
  sentence — `ever` + a lifetime experience question. ✓
- Against its own lesson: `ever` is a chip in this lesson's `decision`
  r3 → Present Perfect, so the example and the rule agree. The other
  four `examples` items still cover both sides (`last summer` → Past
  Simple, `three times` → Present Perfect, `just` → Present Perfect,
  `for` + closed period → Past Simple). Coverage is unchanged; only the
  scenario moved. ✓
- Against its own four items: no overlap with t5–t8 at run ≥ 3. ✓
- **Against the item it was moved for:** `t20`'s stem is *"Have you ____
  to Japan before, or would this be your first time?"* with key `been`.
  The old sentence gave a learner the answer as a worked example in
  another lesson; the new one shares nothing with it. Cross-category
  run ≥ 3 for the whole topic is 0. Finding 5's second half is closed. ✓

The `decision` rewrite in the same lesson is §2.2.

### 4.3 Past trio — the `text` block's example

*"I didn't recognize the campus because they **had rebuilt** it since my
last visit. Referans 'didn't recognize' … 'had rebuilt'"*
→ *"The street looked strange to me because they **had planted** new
trees since I moved away. Referans 'looked strange' … 'had planted'."*

- **Is the new sentence correct English and does it teach the rule?**
  Yes. *"The street looked strange to me because they had planted new
  trees since I moved away"* is the canonical `since` + Past Perfect
  shape: a past reference point (`looked strange`), a completed prior
  action, an open-at-the-time span. The Turkish that follows it names
  the reference point and the form, both correctly, and both now refer
  to the new sentence. Nothing was left behind from the old one. ✓
- **Against the item it was written for.** t12 filled is *"I didn't
  recognize the campus at first because they had rebuilt the whole
  entrance since my last visit"*. Longest shared run with the new
  sentence: **3** (`because they had`), **not** carrying the key
  (`had rebuilt` does not appear). Six words carrying the key, before.
  Finding 3 is closed. ✓
- **The residual, and why I do not block on it.** The two sentences are
  the same *skeleton*: `X-past because they had V3 … since …`. A learner
  who read this block can answer t12 without reading it. Two things
  hold me back from calling that a giveaway. First, it is the rule the
  block exists to teach, and the guide's rule is about building a
  question on a lesson **sentence**, not about a lesson teaching the
  construction its questions test. Second, and decisively: the lesson's
  two `check` blocks sit at positions **3 and 7**, and this `text` block
  is position **8** — so t12, if it is drawn as a check, is met *above*
  this block, never below it. The mechanism the rule protects against
  cannot fire here. ✓
- Against the rest of the lesson: `contrast[1]`'s Past Perfect side
  (*"She had left when I called."*), `examples[2]`/`[3]`, `pitfall[5]`
  and `decision` r1/r2 all still say the same thing. No sentence in this
  lesson now mentions `since` except this block and it does not
  contradict the two lessons that also carry `since` — §6.

### 4.4 Future Forms — the Present Continuous `contrast` example

*"We are having dinner with them on Saturday."*
→ *"I am meeting my project partner at four on Thursday."*

- Against its own `gloss` (*"Kişisel olarak önceden ayarlanmış,
  kesinleşmiş bir buluşma ya da randevu; genelde zamanı ve tarafı
  bellidir"*): the new sentence carries a time (`at four on Thursday`)
  and a party (`my project partner`). Tighter to the gloss than the one
  it replaced. ✓
- Against the item: `t16` filled is *"We are having dinner with the
  Özdemirs on Saturday — it's already in both of our calendars."* The
  old example gave it five shared words carrying the key
  (`we are having dinner with`), one under the threshold, which is what
  the previous audit blocked the category on. The new example shares
  nothing. Verified at run ≥ 3, in-category and cross-category, 0.
  **Finding 4 is closed.** ✓
- Against the other three items: no overlap with t13, t14, t15. ✓
- **The one cost.** `examples[3]` in the same lesson is *"We are meeting
  the dentist on Friday."* The lesson's Present Continuous illustration
  is now `be + meeting + person + on Day` in **both** the `contrast` and
  the `examples` block, where before it was `have dinner` and `meet`.
  That is a small loss of lexical coverage inside the lesson, and it is
  the kind of thing that happens when a sentence is replaced without
  reading the block two below it. Not blocking, and worth one line to
  whoever writes the next example.

### 4.5 Perfect Aspects — the been/gone `pitfall`, reversed

*wrong* "She has been to the library; she'll be back in an hour." /
*right* "She has gone to the library; she'll be back in an hour."
→ *wrong* "My sister has gone to Berlin three times and she loved it
every time." / *right* "My sister has been to Berlin three times and she
loved it every time."

- **Do `wrong` and `right` still differ in exactly the taught thing?**
  Yes, and only there: `gone` ↔ `been`, everything else identical. The
  validator only checks they are not identical; this passes the check an
  author has to make. ✓
- **Is the new pair a real error a Turkish speaker makes?** Yes —
  `been to` / `gone to` in the experience direction is the same
  confusion the lesson's `contrast[6]` sets up, and *"has gone to Berlin
  three times"* is the error, not an invented one. ✓
- **The `why` was rewritten with it** and is true of the new pair:
  *"'Has gone to' kişinin hâlâ orada olduğunu söyler; oysa cümle dönmüş
  birinin anlattığı bir deneyimi bildiriyor."* ✓
- **Against the item it was written for.** The previous audit's blocker
  was that the old `pitfall` was `t25` in different clothes: it handed
  over `t25`'s cue (*she'll be back*), `t25`'s form and `t25`'s
  decision, in `t25`'s scenario. The new pair teaches the **opposite**
  direction (`been to`, which is t25's *distractor*), in a different
  scenario, with a different cue. Longest run against t25 filled: **2**
  (`has gone`). The paraphrase is gone. **Finding 5's first half is
  closed**, and closed by rewriting in the direction that costs the item
  the least. ✓
- **Against the rest of the lesson.** `contrast[6]`'s two sides are
  *"I have been to Italy twice."* and *"He has gone to the store; he'll
  be back soon."* — the second still carries the *he'll be back* cue
  that t25's paragraph used to share. t25's paragraph no longer contains
  it, so the overlap is 2 words and no cue. The lesson still covers both
  directions: `contrast[6]` states both, the `pitfall` now drills the
  `been to` one, and `decision` r1/r2 state both. No side lost its
  teaching. ✓
- **Against the other three items.** `t20` is the `been to` item, and
  the new `pitfall` is now on `t20`'s side of the contrast rather than
  `t25`'s. Shared run, t20 filled vs the pitfall: 2. No cue, no key.
  The fix did not move the collision from t25 onto t20 — which is the
  exact thing to check, and the thing round one failed to check when it
  moved the Future Forms `will` example. ✓

### 4.6 Time Expressions — the `still` rule, in five places

This is the round's largest lesson edit and the one the brief singles
out: a rule added to justify one item.

The claim added: **`still` goes before the verb in a positive sentence
and before the auxiliary in a negative one.**

Where it now appears, and whether the five agree:

| block | text | agrees? |
| --- | --- | --- |
| `contrast[2]` `still` gloss (edited) | *"olumlu cümlede fiilden, olumsuz cümlede yardımcı fiilden önce gelir"* | — |
| `contrast[2]` `still` example (unchanged) | *"She is still waiting for the results."* | ✓ positive; `still` precedes the main verb |
| `forms` row (edited) | `still` · Olumlu cümle · `S + still + V / S + be + still + V-ing` · *"She still works there."* | ✓ |
| `forms` row (**new**) | `still` · Olumsuz cümle · `S + still + haven't/hasn't + V3` · *"She still hasn't replied to my email."* | ✓ |
| `examples[5]` (replaced) | *"They still haven't announced the results."* — note *"Olumsuzda still yardımcı fiilden önce gelir → still"* | ✓ |
| `decision` word r6 (**new**) | *"Aynı olumsuz cümlede boşluk yardımcı fiilin önündeyse"* → `still` | ✓ |
| `t22` `explanation`, `tip`, `still` note | *"…yardımcı fiilden önce, cümlenin sonunda değil"* | ✓ |

**All seven statements agree, and the rule the item turns on is now in
the lesson three separate times over.** Finding 6's first half is not
just closed, it is over-closed relative to what the finding asked for.
The previous audit's complaint — *"the one rule that separates the key
from its nearest rival exists only inside the item"* — no longer holds.

**Is the added rule true?** Of `have/has` negatives, which is what the
category and the item are about, yes: *"She still hasn't replied"* is
standard and *"She hasn't still replied"* is not. It is a small
overreach for copular `be` (*"He is still not ready"* is good English
and puts `still` after the auxiliary), and the `forms` row is
Perfect-specific (`haven't/hasn't + V3`) so it does not cover *"She
still doesn't work there"*. Neither gap is false of anything the lesson
or its items say, and the guide's instruction *"do not invent a row to
square off the grid"* argues against adding the missing ones. Recorded,
not a finding.

**Is it true of the other three items?** `t24`'s paragraph contains the
word `still` — *"he **still** says it was the best decision"* — in a
positive clause, `still` before the verb, exactly as the new gloss says.
`t21` is negative but its blank is not in `still`'s slot. `t23` contains
no `still`. No item contradicts the new rule, and r6 does not fire on
any of them (§2.6). ✓

**Against the rest of the lesson.** The `examples` block previously
carried the positive `still` (*"She is still waiting for the results."*)
and now carries the negative one; the positive survives in
`contrast[2]`'s example, so the lesson did not lose a side. The `forms`
block now has seven rows and mixes purposes (`Başlangıç noktası`,
`Süre miktarı`, `Geçmişte bir an`) with polarities (`Olumlu cümle`,
`Olumsuz cümle ve soru`, ×2 for `still`). `docs/CONTENT_GUIDE.md` says a
block mixing polarities with purposes is two blocks. That mixture
predates this round; the round added one more polarity row to it.
Recorded, minor, not introduced.

**The one residual I am not comfortable with.** `examples[5]` is now
*"They still haven't announced the results."*, and `t22`'s paragraph
opens *"The results were supposed to go up on Friday"* and turns on
whether `still` can sit where the blank is. The lesson's new example
therefore shows the learner `still` + a negative + **the same subject
matter** two blocks above an item whose chief distractor is `still`.
What holds it off is that the example puts `still` in the *other*
slot and its own note says so in eight words. The two sentences share a
run of 2, so no tool sees anything, and the note does the work. But this
is the exact historical shape the brief warns about — *a repair closed a
defect by adding a sentence to a lesson, and the sentence lured toward a
distractor* — with the unusual twist that the item it lures on is the
one the sentence was added for. I do not block on it, and it is first in
my doubt list (§8).

---

## 5. The changed items, option by option

**A methodological admission first, because it costs this section
something.** The brief asks for every changed item to be answered from
the paragraph alone before the key is read. I dumped the file with
`correctIndex` marked and so I saw the three keys before I reasoned
about the paragraphs. What follows is therefore a full substitution of
every option into every changed paragraph — which is the work that
actually excludes a second answer — but it is **not** a blind pass, and
where I say "I agree with the key" that agreement is worth less than the
previous audit's on `t19` and `t22`, which was blind. `npm run blind`
exists for exactly this and I should have used it. The substitutions
below stand on their own; the agreement does not.

### 5.1 `t14` — the stranded note is genuinely re-anchored

*"Stop offering to pick me up — I ____ a taxi from the airport. I hadn't
thought about it until just now, so nothing is arranged."*

Only the `have taken` note changed:

> *"…Oysa konuşan henüz havaalanına inmiş bile değil."*
> → *"…Oysa ortada henüz yapılmamış, konuşma anında verilen bir karar
> var."*

The old clause was written against *"so just relax at home"*, which
round one deleted, and the previous audit filed it as the one note that
survived a paragraph change on a clause that was removed. The new clause
argues from *"I hadn't thought about it until just now"* and *"nothing
is arranged"* — both of which are in the paragraph, verbatim, in the
sentence immediately after the blank. It also does the job a note has to
do: it says what `have taken` **means** (already in the taxi, result
current) and why the paragraph does not select it (the decision has not
been acted on; it was made just now). ✓ Fixed.

The overlap it creates with the `am taking` note (*"Cümle ise 'nothing
is arranged' diyor"*) is mild — both now lean on the same clause — and
the two still say different things about their own options. Not a
finding.

The rest of the item is untouched and I re-read it: `will take` is the
key on the lesson's own axis (r1, decision at speech time); `am taking`
is dead on *"nothing is arranged"*; `take` is still answered only for
the timetable reading and not for the habitual one, which the previous
audit recorded and this round did not address. Inherited, minor.

### 5.2 `t22` — `ago` → `yesterday`, and the item now has three live options

*"The results were supposed to go up on Friday, and it is now the middle
of the following week. According to the secretary, the marks haven't
been entered ____, so nobody in our year can register for next term."*

| option | the sentence it produces | would a competent teacher accept it? |
| --- | --- | --- |
| `yet` (key) | *"…the marks haven't been entered yet, so nobody…"* | **yes** — clause-final `yet` under a negative, the standard form. |
| `already` | *"…the marks haven't been entered already, so nobody…"* | **no.** `already` belongs to positives; in a negative declarative in this slot it is not English in this meaning. Live for a Turkish learner as the mirror of `t23`, which asks the same contrast the other way round. |
| `still` | *"…the marks haven't been entered still, so nobody…"* | **no**, and wrong **only** on placement — the meaning is right. This is the item's real trap (`hâlâ` → `still`) and it is now the *taught* trap: five statements in the lesson give the position, and `decision` r6 names the slot. |
| `yesterday` (new) | *"…the marks haven't been entered yesterday, so nobody…"* | **no.** A definite past adverb cannot sit with a present perfect. |

**Was `ago` dead, and is `yesterday` alive?** `ago` was dead in the way
`docs/agents/question-author.md` §3 defines: it was wrong for a reason
*unrelated to anything the lesson teaches about this blank* — it needs a
quantity in front of it, and there is no quantity anywhere near the
blank, so the learner discards it on shape without engaging the
contrast. `yesterday` is wrong for a reason the lesson teaches
explicitly and by name: the `ago` `pitfall` (*"She has graduated two
years ago." / "She graduated two years ago."*), `examples[2]`, and —
decisively — the tense `decision` block's **r2 chip list, which contains
`yesterday` verbatim** and assigns it to Past Simple. A learner who
picks it is linked from the results screen to a lesson that names their
error. That is the whole difference between a dead option and a live
one, and the swap crosses it. ✓ **Finding 6's second half is closed.**

The honest qualification: `yesterday` is *legal* but not very
*tempting*. Nothing in the paragraph invites a past-time reading; the
lure is only the general Turkish-learner habit of pairing a past adverb
with a perfect. So t22 now reads as two strong distractors (`already`,
`still`) and one weak-but-taught one, against one strong and two dead
before. An improvement, not a perfect item.

The paragraph is unchanged and still avoids printing `already`, `yet`
or `still` outside the option list. ✓

### 5.3 `t25` — the key survives, the explanation does not

Paragraph, before and after:

> *"Nobody has seen Deniz since the lunch break, and her laptop is
> **still** open on the desk with the screen unlocked. She ____ down to
> the archive on the ground floor, I think, **so she should be back
> before the meeting starts**."*
>
> → *"Nobody has seen Deniz since the lunch break, and her laptop is
> open on the desk with the screen unlocked. She ____ down to the
> archive on the ground floor, I think, **and her coat is still on the
> back of her chair**."*

| option | the sentence it produces | accept? |
| --- | --- | --- |
| `has gone` (key) | *"She has gone down to the archive…"* | **yes.** She went and has not come back — which is what *"Nobody has seen Deniz since the lunch break"* and the open, unlocked laptop assert. |
| `has been` | *"She has been down to the archive on the ground floor, I think, and her coat is still on the back of her chair."* | **no**, but the margin narrowed. `has been to` asserts a completed round trip, and *"Nobody has seen Deniz since the lunch break"* denies that she has reappeared. The defeating evidence now sits **only** in the first sentence. |
| `has been going` | *"She has been going down to the archive…"* | **no.** Repeated trips; the paragraph describes one absence since lunch. |
| `had gone` | *"She had gone down to the archive…"* | **no.** Past Perfect needs a past reference point and every anchor here is present (`has seen`, `is open`, `is still on`). |

**The key is correct and no second answer survives.** What blocks the
category is the `explanation`, which this round rewrote:

> *"…En yakın çeldirici 'has been', kişinin gidip döndüğünü söyler —
> **dönmüş olsaydı ceketini alır, masasına dönerdi**."*

That clause is false of its own scenario, in two independent ways.
Someone who returns from the ground-floor archive to her own desk does
not collect her coat — the coat is on the chair *because* she is at
work; and the coat is on the chair in both worlds, so it does not
discriminate between the key and the option it is offered against. It is
also not what the first half of the same explanation says: that half
correctly stacks *"ceketi hâlâ sandalyesinde ve öğle arasından beri
kimse onu görmedi"*, and only *"kimse onu görmedi"* is doing work in it.

`docs/CONTENT_GUIDE.md` on `explanation`: *"This is the field that
decides whether a wrong answer teaches anything."* The learner who chose
`has been` is given a counterfactual that does not hold, in place of the
one sentence that would have corrected them. That is a defect this round
introduced, in the field the guide singles out, and it is one clause
long.

**Three smaller things the rewrite cost, which is why I am confident
this is not me over-reading one clause:**

1. The cue it removed — *"so she should be back before the meeting
   starts"* — asserted directly that she is not back. The cue that
   replaced it, *"her coat is still on the back of her chair"*, is true
   whether she is in the archive or at her desk. The item's evidence got
   weaker, not just different.
2. *"her laptop is **still** open"* lost its `still` in the same edit,
   which removes the durative reading that made the open laptop mean
   "she left it and has not come back" rather than "there is a laptop
   on the desk".
3. The `has been` `optionNote` was rewritten to lead with the same
   non-discriminating coat (*"Oysa ceketi hâlâ sandalyesinde ve öğle
   arasından beri onu gören olmamış"*) — though it does at least carry
   the real argument in its second clause, which the `explanation`
   does not.

The `tip`, the `has been going` note and the `had gone` note were all
re-read against the new paragraph and are all still true of it. ✓

**What the rewrite bought.** It is worth being clear that the rewrite
was right to happen: the old paragraph shared its cue and its decision
with the lesson's own `pitfall`, and the previous audit blocked on that.
The paraphrase collision is genuinely gone (§4.5). The round traded a
real defect for a smaller one — which is better than the historical
average in this repository, and still leaves the category not shipping.

---

## 6. `since` across all three lessons that touch it

The brief's fifth question: is the fix for finding 2 consistent with the
**third** lesson, or is this the one-place-and-not-the-next-door failure
a third time? Every place `since` is stated in this file, with what it
claims:

| lesson | block | what it says about `since` | qualified? |
| --- | --- | --- | --- |
| Present Perfect vs Past Simple | `pitfall[6]` | *"I know her since 2015" / "I have known her since 2015"* — `since` needs Present Perfect | no, and correctly so for that sentence |
| Present Perfect vs Past Simple | `decision` **r1** | past reference point → **Past Perfect** | **the qualification, added this round** |
| Present Perfect vs Past Simple | `decision` **r4** | span still open — *"**since** ile verilen bir başlangıç noktası da buraya girer"* → Present Perfect | **conditioned on the span, this round** |
| Past trio | `text[8]` | *"**since** her zaman Present Perfect demek değildir"* + a worked Past Perfect example | yes — the caveat's home |
| Past trio | `decision` r2 | the earlier-finished work → Past Perfect | yes, by construction |
| Time Expressions | `contrast[1]` `since` side | *"Yanına Present Perfect ister."* | **no** |
| Time Expressions | `forms` row | `have/has + V3 … since + point in time` | **no** |
| Time Expressions | `decision` word r1 | blank followed by a start point → `since` | n/a (word-level) |
| Time Expressions | `decision` tense r1 | *"referans noktası geçmişte bir an ise (by the time we arrived, **I didn't recognize it**)"* → Past Perfect | yes — added in **round one** |
| Time Expressions | `decision` tense r3/r4 | `since`/`for`: look at whether the span closed | yes |

**The mechanism that produces a wrong answer is now consistent in all
three lessons.** Run each of the three `decision` procedures on `t12`,
the item all of this is about:

- Present Perfect vs Past Simple → r1 fires → **Past Perfect** ✓ (was
  `have rebuilt` before this round)
- Past trio → r2 fires → **Past Perfect** ✓
- Time Expressions, tense block → r1 fires, on a parenthetical that
  quotes `t12`'s own clause → **Past Perfect** ✓

Three blocks, three lessons, one answer, and it is the key. **This is
not the same failure a third time.** It is the first time in this file
that a cross-lesson signal has been made to agree everywhere it appears.

**What is still uneven, and why I do not block on it.** The *prose* has
not caught up with the *procedures*. Time Expressions' `contrast[1]`
still tells the learner flatly that `since` *"Yanına Present Perfect
ister"*, and its `forms` row gives only the Present Perfect pattern —
while a `decision` block four blocks below, in the same lesson,
overrides both without acknowledging them. Compare `for`, which gets its
two-sidedness spelled out in a `text` block of its own (*"Bir kelime iki
tarafta da çıkabilir: **for**"*, Present Perfect vs Past Simple `text[8]`).
`since` has no such block in the lesson that introduces it as a
`contrast`.

I record this rather than block on it for one reason that I checked
rather than assumed: **no wrong answer routes a learner here.** The
lesson the results screen links to is the lesson of the item's own
category, and the only item `since` misleads on is `t12`, which is in
the Past trio category — whose lesson carries the caveat in a `text`
block. A learner who reads Time Expressions' `contrast` and carries
*"since → Present Perfect"* into `t12` gets it wrong and is then sent to
the lesson that corrects them. The document disagrees with itself; the
app does not send anyone to the wrong half of it.

The `for` block, if anyone wants the symmetric fix, is 252 characters
and the `since` version would be shorter.

### 6.1 The option classes this round narrowed, and the one it did not

The previous audit's §3.3 recorded a taxonomy cost: `never` and `ever`
were added to `t23` as options and were taught nowhere in the Time
Expressions lesson, enlarging a class the repair had itself recorded as
unfixed (`during`, `while`, `before`).

Counting occurrences in the whole lesson object now:

| option word, on a live Time Expressions item | occurrences in the lesson | taught? |
| --- | --- | --- |
| `ever` (t23) | 3 — `decision` word r7 condition, r7 `then`, tense r5 chips | **yes, new this round** |
| `never` (t23) | 3 — the same three | **yes, new this round** |
| `yesterday` (t22) | 1 — tense `decision` r2 chips | **yes, already there** |
| `during` (t21) | **0** | no |
| `while` (t21) | **0** | no |
| `before` (t24) | in `pitfall`/`examples` prose only, never as a rule | marginal |

So the round closed two thirds of the class it inherited, including
both members the previous round added, and did it as a by-product of the
`still` work rather than because anything asked for it. `t21`'s `during`
and `while` are still untaught: a learner who picks either is linked to
a lesson with no rule that would have stopped them. Inherited, unfixed,
and the smallest of the things left.

**One schema note on r7.** Its `then` is `"ever / never"`, and
`docs/CONTENT_GUIDE.md` allows a slash form *"where a rule genuinely
admits more than one answer"* — its example, `Might / Could`, is one
condition admitting two forms. r7 is two *different* conditions crammed
into one rule (a question → `ever`; a denied experience → `never`), so
the checklist hands the learner two answers and makes them re-read to
choose, which is the one thing a decision block exists to prevent. It
should be two rules. No live item reaches r7 (§2.6), so this is a shape
finding, not a behaviour one.

---

## 7. The commit message as the repair's only account

There is no `docs/audit/repair-tenses-2.md`, so check 3 of the brief has
to be run against `44a9562`'s message instead. It makes eight factual
claims about this file. Every one is mine to verify from the diff, and I
verified all eight:

| claim | verdict |
| --- | --- |
| *"The orphaned prose is rewritten so it no longer points at a rule list that was deleted under it."* | **true.** §2.1. The new sentence introduces the rule that follows it and refers to nothing above. |
| *"The `since -> Present Perfect` signal is out of the bare chip list in Present Perfect vs Past Simple."* | **true.** r3's list is now `[already, yet, just, ever, never, so far, recently]`. §2.2. |
| *"and `since` now sits inside the open-period condition where it is true."* | **true of the condition, and the condition is true.** The wording *"da buraya girer"* plus the bold makes it scannable as a chip, which is the residual in §2.2. |
| *"The `text` body that printed t12's paragraph, key and reasoning carries a different example."* | **true.** Run drops from 6 carrying the key to 3 not carrying it. §4.3. |
| *"The Future Forms contrast example that was t16 minus one word is replaced, on the side the first round did not reach."* | **true.** Run drops from 5 carrying the key to 0. §4.4. |
| *"The Perfect Aspects pitfall that was t25 in other clothes is rewritten in the opposite direction, and the Japan example that collided with t20 is gone."* | **both true.** §4.5, §4.2. |
| *"Time Expressions now states the rule its own rewritten item turns on … as a `forms` row, an example and a decision condition … `ago`, the second dead option, is replaced."* | **true, and understated** — the rule is also in the `contrast` gloss, so it is in four places, not three. §4.6, §5.2. |
| *"Corpus-wide, questions built on a sentence from their own lesson: 32 at the start of the night, 0 now."* | **true at the shipped threshold**, and true of a checker that grew `text.body` in the same round. §3.1. It is 48 at a threshold of three, of which 5 are in tenses. |

**The message claims nothing the diff does not support**, which is a
better record than two of the three logs this repository's audits have
checked. What it does not claim, and what nobody could have known
without re-reading the file, is the one thing this pass found: the `t25`
rewrite closed its defect and put a false clause in the explanation
(§5.3). That is not a dishonest log. It is what happens when a repair
ships without one — the supervisor writing from a diff can see that the
explanation changed, and cannot see that its argument stopped following.

Two things the message **also** got right that I tried to break and
could not: no key was changed on any item (all four `correctIndex`
values in the diff are unchanged, and the three paragraphs it touched
keep the same answer), and no sentence it added carries any question's
key anywhere in the corpus (§3.3).

---

## 8. What I am least sure of, most doubt first

1. **The Time Expressions `examples[5]` lure (§4.6).** The round's fix
   for `t22` added *"They still haven't announced the results."* to a
   lesson two blocks above an item whose chief distractor is `still` and
   whose scenario is also results not being posted. I decided the
   example's own note (*"Olumsuzda still yardımcı fiilden önce gelir"*)
   does the corrective work and shipped the category. If a learner reads
   the sentence and not the note — which is what an `examples` block is
   scanned like — the sentence is a `still` + negative + results pattern
   sitting above a `still` + negative + results question. This is the
   single judgement in this report I would most like a second reader on,
   and it is the one where the historical failure mode in the brief
   matches most exactly.
2. **Bolded `since` in Present Perfect vs Past Simple r4 (§2.2).** I
   ruled the block clean because r1's *condition* is true of `t12` and
   fires first. r1's *parentheticals* are `by the time we arrived` and
   `when I finally got back` — subordinate time clauses — and `t12`'s
   past anchor is a bare main clause that matches neither. A learner who
   scans parentheticals rather than reading conditions skips r1 and
   lands on a bold `since` at r4, which returns the trap. The guide's
   own reasoning (*chips are "scanned for, not read"*) argues that
   bolding an English word inside a condition gives it chip behaviour.
   If the next pass decides a checklist is read by scannable cue rather
   than by antecedent — which is the standard this repository has
   applied elsewhere — this category's verdict flips and finding 2 is
   only half closed. Adding `I didn't recognize the campus` to r1's
   parenthetical would settle it in nine words.
3. **Whether `t25`'s explanation is worth a DOES NOT SHIP (§5.3).** The
   key is right, no second answer survives, and the defect is one clause
   in a Turkish field. A grader who scopes a category verdict to
   *can a learner get this item wrong* would call it a note. I graded it
   blocking on the same standard the previous audit used for the
   *"Son kural"* dangle: introduced by the repair, one-clause fix, and
   located in the field the content guide singles out as the one that
   decides whether a wrong answer teaches anything. I am confident the
   clause is false; I am less confident it should stop a ship.
4. **`t17` and `t18` as sub-threshold giveaways (§3.2).** I called them
   avoidable and did not block on them, then blocked the same category
   on something else — so the verdict does not turn on this, but a next
   pass's might. `t17` shares four words and its key with a lesson
   sentence printed three times, and it is the only tenses item that
   survives a threshold of four. My reason for not blocking is that the
   shipped threshold is 6, nobody has adopted 3 or 4, and I do not think
   an auditor should invent a threshold and then block on it. Somebody
   who does adopt one will block on these two.
5. **The Future Forms r3/r6 ordering on `t15` (§2.4).** I agree with the
   previous audit that *"the board at the station is very clear"* is not
   *"gözle görülen somut bir kanıt"* for a *tahmin*, so r3 does not fire
   and r6 reaches the key. If it does fire it returns `be going to`, and
   `is going to leave` is on offer. Two audits have now reached the same
   answer independently and neither has been confident. Moving r6 above
   r3 costs nothing and would end the question.
6. **r1's untaught `then` in Present Perfect vs Past Simple (§2.2).**
   I recorded it and shipped, on the grounds that the guide explicitly
   permits a `then` the lesson never sets against anything and that
   deleting r1 reopens finding 2. But the first instruction in a
   category's exam procedure now names a form with no pattern, no
   example and no contrast side anywhere on the page, and it can never
   fire on any of that category's own four items. A reader who thinks a
   `decision` block should decide its own category's items would call
   that rule misplaced rather than permitted.

**What I did not check.** I did not open
`data/passive-voice/passive-voice.json`; the corpus counts in §3.2
include it as a number only. I did not run `npm run verify` (no markup,
CSS or JS changed, and it needs a server). I did not re-derive the keys
of the twenty-one items this round did not touch beyond what the
`decision` traces in §2 required — where I substituted options into an
untouched item (`t7`, `t14`, `t15`, `t17`, `t20`) I say so; elsewhere
the verdict rests on `blind-oldest.md`'s 73/73 and on the previous
audit's re-derivation rather than on my own reading. And, as §5 says,
**this pass was not blind**: I saw three keys before I reasoned about
their paragraphs, and a future pass over these three items should use
`npm run blind` and is entitled to discount my agreement with them.

---

## 9. Supervisor's fix to `t25`, verified

Appended 2026-09-05, after §1–§8 were written. The supervisor acted on
the one blocker in §5.3 and asked this pass to verify it, since it found
the defect and did not write the repair. Three changes to
`tenses-t25`, all in the working tree, none committed.

**Verdict: the fix works, and the category now ships.** The false clause
is gone, each of the three cues does the job the sentence assigns it and
no more, and the item's margin against `has been` is not merely restored
but is better evidenced than the pre-round-two version was. Nothing in
this file gets worse. I found one cosmetic wobble and one idle cue,
neither of them a defect.

### 9.1 The paragraph

> *"Nobody has seen Deniz since the lunch break, and her laptop is
> **still** open on the desk with the screen unlocked. She ____ down to
> the archive on the ground floor, I think, and her coat is still on the
> back of her chair."*

Restoring `still` to the laptop is the load-bearing half of this fix,
and it is worth saying why it matters more than it looks. Without it,
*"her laptop is open on the desk"* is a description that is equally true
whether Deniz is sitting in front of it or not. With it, the laptop has
**remained** open, unattended, since she left — and `with the screen
unlocked` is the marked state that says she expected to be back in a
minute. The cue stops being scenery and becomes evidence. §5.3 listed
its removal as one of the three things the previous rewrite cost; that
one is now repaid.

**Not restoring *"so she should be back before the meeting starts"* is
the right call, and I want to record that I agree with the reasoning
rather than just the outcome.** That clause was the sharpest cue the
item ever had, but it was also the clause the Perfect Aspects `pitfall`
shared word for word (*"she'll be back in an hour"*), which is what the
previous audit blocked the category on. The `pitfall` has since been
rewritten in the opposite direction so the collision would not fire
today — but the supervisor's argument is that a lesson block is edited
by whoever touches the lesson next, and an item that only survives
because of the current wording of a block in a different part of the
file is an item waiting to break. That is exactly the failure mode this
whole sequence of audits keeps finding, applied pre-emptively for once.
It also costs the item nothing measurable: see §9.4.

Re-substituting all four options into the new paragraph:

| option | accept? | on what evidence |
| --- | --- | --- |
| `has gone` (key) | **yes** | She went and has not come back. |
| `has been` | **no**, and on **two** independent cues now | *"Nobody has seen Deniz since the lunch break"* denies she has reappeared; *"her laptop is **still** open … unlocked"* denies she is back at it. After round two there was one cue and it sat in the first sentence alone. |
| `has been going` | **no** | Repeated trips against a single absence since lunch. |
| `had gone` | **no** | Past Perfect needs a past reference point; every anchor is present (`has seen`, `is still open`, `is still on`). |

The `decision` block trace is unchanged: r1 (*a place is named and the
person is still there, not back*) fires and returns `have gone to` →
`has gone`, the key. §2.5 stands.

### 9.2 The explanation, cue by cue

> *"Öğle arasından beri kimse onu görmemiş, bilgisayarı hâlâ açık ve
> kilitsiz duruyor, ceketi de sandalyesinde: işinin başından ayrılmış
> ama binadan çıkmamış, yani gittiği yerden henüz dönmemiş. … En yakın
> çeldirici 'has been', kişinin gidip döndüğünü söyler — oysa dönmüş
> olsa öğle arasından beri onu gören biri olurdu."*

| cue | job the sentence gives it | does the cue do that job? |
| --- | --- | --- |
| *"Öğle arasından beri kimse onu görmemiş"* | she has not come back | **yes.** This is the discriminating cue and it is now where the discrimination rests. |
| *"bilgisayarı hâlâ açık ve kilitsiz duruyor"* | *"işinin başından ayrılmış"* — she stepped away mid-task | **yes**, and only because `still` came back into the paragraph. Without `still` this cue could not have carried even this much. |
| *"ceketi de sandalyesinde"* | *"binadan çıkmamış"* — she has not left the building | **yes.** Leaving a building means taking your coat; the coat staying on the chair is good, ordinary, defeasible evidence for exactly that and for nothing beyond it. |

**On the coat, which is what the supervisor was least sure of: it is not
overclaiming.** The old clause failed because it asserted a
counterfactual that is false of the scenario — someone returning from
the ground-floor archive to her own desk does not collect her coat. The
new clause asserts only that she has not left the building, which is
what the coat shows, and the `has been` exclusion two sentences later
does not use the coat at all. That is the correct architecture: the cue
that cannot discriminate is no longer asked to.

One qualification, offered as information rather than as a finding. The
coat is now **true but idle for the key/distractor choice**: no option
on this item is "she went home", so ruling out that reading excludes
nothing. What it does earn is the *plausibility* of the sentence it sits
in — it is why *"down to the archive on the ground floor"* is the
natural completion rather than "she left for the day" — so it is doing
real work in the paragraph even though it is doing none in the
discrimination. Keeping it is right. If anyone ever wants the
explanation one clause shorter, the coat is the clause that can go
without weakening the argument.

The `yani` step holds: away from her workstation **and** still in the
building ⇒ she is somewhere else in the building ⇒ she has not come back
from where she went. The three cues are presented jointly, after a
colon, rather than as three independent proofs, which is the honest
shape given that the laptop cue leans on the first one to mean what it
is claimed to mean.

The counterfactual that carries the `has been` exclusion — *"dönmüş olsa
öğle arasından beri onu gören biri olurdu"* — is grounded in the
paragraph's own first clause and is valid. `docs/CONTENT_GUIDE.md`'s
requirement that the explanation name the closest wrong option in its
own words and say why *this* passage does not select it is met, which is
the requirement the previous version failed.

Schema: 511 chars (warns over 600), Turkish, names all three wrong
options. ✓

### 9.3 The other two exclusions, and the note

- **`has been going`** — explanation clause and `optionNote` both
  **untouched** and both still true of the new text. The note's *"öğle
  arasından beri süren tek bir gidiş"* rests on the paragraph's first
  clause, which this fix did not change. ✓
- **`had gone`** — explanation clause untouched and still true: there is
  no past reference point anywhere in the paragraph. Its `optionNote`
  names *"masada duran açık bilgisayar"* as the present anchor, which is
  still in the paragraph and is now slightly better supported by
  `still`. ✓
- **`optionNotes["has been"]`**, rewritten to *"Oysa öğle arasından beri
  onu gören olmamış — dönmüş olsa görülürdü."* — **consistent with the
  explanation**: same cue, same counterfactual, and the coat is out of it
  entirely. The note no longer leads with a cue the explanation has
  stopped relying on, which was the smallest of the three things §5.3
  listed. 113 chars, under the 160 warn. ✓

The only wobble worth naming: the `had gone` note foregrounds the
laptop while the explanation now foregrounds *"nobody has seen her"*.
Both are present-tense anchors and neither contradicts the other, so
this is a difference of emphasis, not an inconsistency. Not a finding.

### 9.4 Does the restored `still` collide with anything?

Re-run after the fix, same predicates as §3:

- `checkLessonGiveaway`, tenses in-category, shipped `GIVEAWAY_RUN = 6`:
  **0**. Cross-category: **0**. Corpus-wide: **0**.
- Threshold three, tenses in-category: **5** — `t1`, `t17`, `t18`,
  `t20`, `t23`. **Exactly the same five as before the fix; `t25` is not
  among them and never approaches it.** Cross-category at three: **0**.
- Corpus at three is now 40 rather than the 48 in §3.2. That drop is
  `passive-voice` going 15 → 7 as the other session's repair landed. The
  tenses figure is unchanged at 5.
- `t25` filled against **every** lesson sentence in the topic, all six
  lessons, run ≥ 3: **nothing**. Against every other question stem in
  the topic, run ≥ 4: **nothing**. Against `t22` directly: run 2
  (*"to the"*).
- Every sentence in the file containing `still`, against `t25` and
  `t22`: *"She is still waiting for the results."* 2 / 2; *"She still
  works there."* 1 / 0; *"She still hasn't replied to my email."* 1 / 1;
  *"They still haven't announced the results."* 1 / 2. Nothing anywhere
  near a threshold.
- `npm run validate` ✓ (same two out-of-scope warnings),
  `npm run format --check` ✓. The near-duplicate-stem and
  scenario-over-use checks report nothing against tenses.

So: no new collision, with this lesson, with the Time Expressions
lesson, or with `t22`.

**And a point in the fix's favour that the numbers do not show.** Both
of `t25`'s `still`s are in **positive** clauses, immediately after the
copula — *"is still open"*, *"is still on"* — which is the placement the
Time Expressions lesson teaches for positives and illustrates with
*"She is still waiting for the results."* Neither models the clause-final
placement that `t22`'s `still` distractor depends on. Counting every
`still` in the whole file — four lesson sentences, `t24`'s *"he still
says"*, and now `t25`'s two — **the file models `still` in its taught
slots six times and clause-final nowhere.** If restoring `still` here
tilts `t22` at all, it tilts it *away* from the distractor.

### 9.5 Does my doubt about `examples[5]` survive?

**Yes, unchanged in kind, and slightly reduced in degree.** Unchanged,
because `t25` is a Perfect Aspects item and cannot be drawn into a
Time Expressions `check` block, so the adjacency that worries me — a
`still` + negative + *results* sentence two blocks above a `still` +
negative + *results* question — is exactly as it was. Reduced, because
of the count in §9.4: nothing in this file now shows a learner `still`
at the end of a clause, so the only place the wrong placement is ever
displayed is `t22`'s own option list, where it is the thing being
tested. That is the right distribution.

§8's doubt list stands as written. Its item **3** — whether `t25`'s
explanation was worth a DOES NOT SHIP — is now moot: the clause is gone,
and the question of how heavily to weigh it does not have to be settled.
Item **1** stands, with the addendum above.

### 9.6 What this changes in §1

**Perfect Aspects: Simple vs Continuous vs Been/Gone → SHIPS.** All six
categories in `data/tenses/tenses.json` now ship. The row in §1's table
was written before this fix and is superseded by this section; I have
left it as it was rather than rewriting the record of what the audit
found, and marked it.

What still stands against the category, unchanged and not blocking, is
§3.2: `t17` shares four words and its key with a lesson sentence printed
three times, and `t18` shares three with another. Both are avoidable,
both predate every repair round, and neither is measured at the shipped
threshold. They remain the single most useful thing left to fix in this
file — changing the verb in the lesson's *"I have been writing"*
sentences closes `t17` outright.
