# Item review — `academic-verbs` (blind pass)

Reviewer session, 2026-09-04. Stimulus:
`scratchpad/blind-verbs/academic-verbs-blind.json` (24 items, options
shuffled by `tools/blind-corpus.mjs`, `correctIndex` / `explanation` /
`tip` / `optionNotes` stripped). `questions.json` and
`academic-verbs-key.json` were **not** opened at any point in this
session. `lessons.json` was opened only after the 24 answers below were
written to disk.

---

## 0 · Calibration — I have no score, and here is why

**I cannot report a calibration score, and no number I gave you would
mean anything.**

My task instructed me to work `docs/agents/calibration.md` and report the
result before touching the corpus. I opened it. It is not a stimulus file
— it is the *key*: all ten items appear there with their answers, their
defect classes, their severities and a written explanation of each. Both
that file and `docs/agents/reviewer.md` say in terms that a reviewer who
reads it cannot be graded:

> *"`docs/agents/calibration.md` is **off limits**: it holds the answer
> key to the set used to grade reviewers, and a reviewer who has read it
> cannot be graded."* — `reviewer.md`

So the instruction as given is not executable: there is no blind form of
the calibration set in the repository, and reading the only file that
holds it destroys the measurement. Scoring myself 5/5 recall and 5/5
precision after reading the answers would be exactly the failure mode
this whole pipeline is built to prevent — a reviewer reporting agreement
with a key it had already seen.

**What the supervisor should do instead**, and it is cheap: run
`tools/blind-corpus.mjs` over a `questions.json`-shaped file containing
the ten calibration items, hand a fresh session *only* that file, and
grade it. Until that exists, treat the findings below as **ungraded**.

**What I can offer in place of a score**, so a shallow pass can still be
told from a thorough one:

- My 24 answers were written to
  `scratchpad/blind-verbs/MY-ANSWERS-committed.md` **before** I opened
  `lessons.json`, `kickoff-vocabulary.md` or `exam-vocabulary.md`. That
  file is the audit trail and it is reproduced verbatim in §1.
- Every finding below quotes the text it rests on.
- §7 lists the fifteen items I examined and could not break.

---

## 1 · Blind answers (committed before reading anything else)

| id | my answer | conf. | what decided it | does another option also work? |
| --- | --- | --- | --- | --- |
| t1 | `emerged` | certain | parapet came back into view above water | no |
| t2 | `shifted` | certain | "abrupt", "within three issues" | `evolved` collocates with *from…to*; abruptness kills it |
| t3 | `declined` | certain | enrolment fell year after year | no |
| t4 | `faded` | certain | *fade from memory*; gradual, unmeasured | no |
| t5 | `triggered` | certain | leaked page started a sudden sell-off | `accelerated` needs a sell-off already running |
| t6 | `prompted` | certain | photograph caused a survey that had not begun | `accelerated` needs an ongoing survey |
| t7 | `undermine` | certain | counter-graph weakens the case | no |
| t8 | `reinforced` | certain | maps confirmed a pre-existing belief | no |
| t9 | `asserts` | certain | stated outright, no evidence offered | no |
| t10 | `implies` | certain | "never says … ____ as much" | no |
| t11 | `conceded` | certain | admitted under pressure, against interest | **`acknowledged` would — it is not offered** |
| t12 | `disputed` | certain | three labs published objections | no |
| t13 | `determine` | certain | establish the cause of the fire | no |
| t14 | `verify` | certain | typed grades checked against records | `assess`, only if you stop reading |
| t15 | `estimated` | certain | "about five thousand", counting impossible | no |
| t16 | `monitor` | certain | continuous, "around the clock" | no |
| t17 | `maintain` | certain | *maintain a temperature*, held unbroken | `preserve` is the lure, not idiomatic here |
| t18 | `restricts` | **probable** | path never closed; "keep to the marked line" | **`suspends` — see D1 below** |
| t19 | `suspended` | certain | "enrolment started again in September" | no |
| t20 | `abandoned` | certain | "altogether", site sold, scaffolding down | no |
| t21 | `allocates` | certain | earmarked, "cannot be moved to anything else" | no |
| t22 | `assigned` | **probable** | editor gave the task to one reporter | **`allocated` — see D1 below** |
| t23 | `withheld` | **probable** | payment held back pending photographs | **`retained` — see D1 below** |
| t24 | `retains` | certain | university keeps it; author must ask permission | no |

**Coverage ledger check (kickoff rule 4).** On my answers the rule holds
exactly in all six sets: four members keyed once each, the fifth never
keyed but appearing as a distractor 3–4 times — `evolve`, `accelerate`,
`acknowledge`, `assess`, `preserve`, `distribute`. Every member appears
as a distractor at least once. This is by design and is **not** a
finding. Its one consequence is worth recording as a note: a learner who
meets a category's four items in one sitting sees `assess` offered four
times and never correct, and `preserve` three times and never correct.
Shuffling does not remove that, because it is a property of the option,
not of its position. One item per category should probably key the fifth
member in the *next* topic rather than the same four always.

---

## 2 · Findings table

| id | defect | severity | evidence | suggested fix |
| --- | --- | --- | --- | --- |
| t22 | **D1** two defensible answers | worth fixing | Key frame is *assign a task to a person*. But the paragraph's own first sentence — "Every reporter on the desk **wanted** the flood story" — builds the scarce-resource-in-demand frame that the lesson gives to `allocate` ("Sınırlı bir kaynağın bir bölümü … resmen ayrılır"). *"The editor allocated the story to the one who had spent two summers on that stretch of coast"* is English a competent teacher accepts; work is routinely *allocated to* staff. | rewrite the first sentence so the story is a job, not a prize |
| t23 | **D1** two defensible answers | worth fixing | *"It has simply **retained** the final payment until the garage sends the photographs"* is standard commercial English — retention pending documentation. The lesson separates the pair by "is there a waiting party?", which resolves this item, but that is not the real line (`withhold` = refuse what is *due*; `retain` = keep what is *yours*) and it misfires elsewhere: in t24 there **is** a waiting party (an author asking permission) and the key is `retains`. | drop `retained` from t23's options, or name the *due* relation in the paragraph |
| t18 | **D1** two defensible answers, borderline | note | Key needs *limit, don't stop*. `suspends` is defensible: "Between April and July … the warden suspends access to the eastern half of the beach" is natural, and the disclaimer that rules it out — "The coast **path** is not closed at any point in the year" — is about the *path*, not about access to half the beach. The two are compatible. | make the disclaimer about beach access, not the path |
| t24 | **D4** decided by polarity alone | worth fixing | Options are `assigns / allocates / retains / distributes` — three giving-out verbs against one holding-back verb. A learner who knows only which half of the set means "keep" answers it without distinguishing `retain` from anything. | swap one give-verb for `withhold` (and see the t23 note) |
| t12 | **D12** answer visible in the paragraph | worth fixing | "Nobody **questioned** the measurements themselves. What the other three laboratories ____ was the conclusion…" — the parallel supplies the verb: what was *not questioned* vs what was. "published their **objections**" repeats it. | drop "questioned" for a non-synonym ("Nobody had trouble with the measurements") |
| t9 | **D12** answer visible in the paragraph | note | "…and he repeats **the claim** twice more before the chapter ends." Naming the speech act as a *claim* rules out `concedes`, `acknowledges` and `implies` on its own; the evidence sentence that follows is then decorative. | "repeats it twice more" |
| t1 | **L1** lesson insufficient / **D8** contradicts its lesson | worth fixing | The lesson's `emerge` gloss is *"Daha önce görünmeyen ya da bilinmeyen bir şey ilk kez ortaya çıkar. **Öncesinde ortada o şey yoktur.**"* and the `decision` rule repeats it. The parapet existed for half a century — it was submerged, not absent. t1 turns on the *become visible from concealment* sense, which no block of its lesson teaches; the lesson's own rule, applied strictly, rejects the key. All four `forms`/`contrast` examples are abstract (`A pattern emerged from the results`). Not blocking only because the other three options fail too, so elimination still lands the studied learner on the key. | add the concrete sense to the `emerge` gloss, or re-site the item |
| t5 | **question built on a lesson sentence** | worth fixing | Lesson `forms` row, `trigger`: *"The news triggered **a sell-off**."* Item: *"a single leaked page of the audit ____ **a sell-off** so sudden…"*. Same verb, same object noun, and `check` blocks draw from this category — the learner meets the answer a few blocks above. | change the object noun in the item |
| t21 | same | worth fixing | Lesson `examples`: *"The **budget allocates** a third to research."* Lesson `pitfall`: *"Half of the budget was **distributed** to research."* → *"…was **allocated** to research."* Item: *"Next year's **budget** ____ two hundred thousand lira to the repair…"* — the item is the pitfall with the numbers changed, and the pitfall is exactly the allocate-vs-distribute discrimination the item tests. | change the subject away from a budget |
| t22 | same | worth fixing | Lesson `contrast`, `assign`: *"**The editor assigned** the task to a junior."* Item: *"**The editor** ____ it **to** the one who…"*. | change the actor |
| t17 | same | worth fixing | Lesson `pitfall`: *"The engine **preserves** a constant speed."* → *"The engine **maintains** a constant speed."* Item: *"the seed vault has to ____ **a temperature** of minus eighteen degrees"* — the same pitfall with speed swapped for temperature, and the pitfall's whole point is `preserve` ≠ `maintain` for a level. | keep the item, move the pitfall to a different pair |
| t18 | same | worth fixing | Lesson `contrast`, `restrict`: *"The rules **restrict access to** members."* Item: *"the warden simply ____ **access to** the eastern half"*. The item's whole collocation is in the gloss. | vary the object |
| t13 | same | worth fixing | Two of the lesson's three pitfalls are this item: *"The team verified how many species live in the area."* → *"determined…"*, and *"Researchers monitored **the cause** of the failure."* → *"Researchers **determined the cause**…"*. Plus `forms`: *"The study determined why it failed."* Item: *"to ____ what had started it"*. | one pitfall, not two, and change the item's object |
| t23 | same | note | Lesson `forms`, `withhold`: *"They **withheld payment** from the supplier."* Item: *"has simply ____ **the final payment**"*. | change the object |
| — | **L5** untested caveat — `Cause & Consequence` | **blocking** (category) | The lesson names `trigger`/`prompt` as its one genuine overlap: *"bir olayın ardından resmî bir işlem başlıyorsa hem **trigger** hem **prompt** doğru sayılır … cümle bunlardan hiçbirini söylemiyorsa iki fiil de savunulabilir."* No item ever springs it: t5's options contain no `prompt`, t6's contain no `trigger`, and the only item where both appear (t7) keys neither. A learner can score 4/4 believing the two are interchangeable — the *Present Perfect vs Past Simple* failure, same shape. | rebuild t5 or t6 so the pair competes |
| — | **L5** untested caveat — `Claim & Concede` | **blocking** (category) | Same shape, and it is the harder pair. The lesson: *"bir yazar kendi çalışmasının sınırını kabul ettiğinde hem **acknowledge** hem **concede** kullanılabilir…"* — but `acknowledged` is **absent from t11's options**, the one `concede`-keyed item, and t11's frame ("Under questioning … she finally ____") is precisely where a learner must choose between them. | put `acknowledged` back into t11 and make the paragraph decide it |
| — | **D4 at category level** — `Allocate & Withhold` | worth fixing | Confirms `exam-vocabulary.md` §3.2. See §5.1 for the measurement. | see §5.1 |

Nothing in this corpus is **D2** (dead option), **D3** (style not
grammar), **D6** (miskeyed), **D9** (miscategorised), **D10** (context
does not carry) or **D11** (near-duplicate). All 24 items keep four
options of the same part of speech in the same inflection, so no option
is eliminable on grammar; every paragraph is 2–3 sentences of real
context and none of them is decorative. That is a genuinely high floor
and it should be said.

`D5` (explanation does not name the trap) is **unassessable in a blind
pass** — `explanation` and `optionNotes` are stripped by design. It needs
a separate adversarial pass with the key.

---

## 3 · Items where more than one option is defensible

This is the finding the pass exists for, so here is what I did to try,
before the result: for every one of the 24 items I substituted each
non-key option into the full paragraph and asked whether a teacher
marking a paper would take it — not whether it was worse, which the
question-author brief says is not the test. Three survived.

**t22 — `assigned` vs `allocated`.** Strongest of the three. What a
teacher accepts: *allocate* governs the giving-out of anything in short
supply according to a decision, and English uses it for work
(*cases are allocated to caseworkers*, *shifts are allocated*). The
paragraph then does the wrong half of the job for the item: it opens
"Every reporter on the desk wanted the flood story", which establishes
scarcity and competition — the `allocate` frame — before the blank
arrives. The taught line (task-to-a-person = `assign`) still favours the
key, so this is worth fixing rather than blocking; but the item currently
punishes a student who has learned that `allocate` is what you do with a
contested resource.

**t23 — `withheld` vs `retained`.** What a teacher accepts: an insurer
*retaining* a final payment pending documentation is standard — the
construction-contract sense of retention is exactly this. The lesson's
discriminator ("is there a party waiting?") does resolve the item, and
the family in the hire car is that party. But the discriminator is not
the real distinction, and the corpus itself shows so: t24 has a waiting
party (an author who must "write and ask permission") and keys `retains`.
So the learner is being asked to apply a rule the corpus does not obey.

**t18 — `restricts` vs `suspends`.** Weakest of the three and I nearly
did not report it. What a teacher accepts: seasonal *suspension* of
access to a nesting area, April to July, is normal conservation English.
The sentence meant to exclude it — "The coast path is not closed at any
point in the year" — talks about the path; suspending access to the
eastern half of the *beach* leaves the path open. If the disclaimer said
"no part of the beach is closed at any point in the year", the item would
be clean.

Rate: 3 in 24, or 2 in 24 counting only the ones I would defend in front
of the author. That is the ~1-in-12 this pipeline has run at.

---

## 4 · Items guessable without the paragraph

Test applied: read **only the clause containing the blank**. Does exactly
one option produce idiomatic English?

**Seven of 24, clearly** — t1 (`____ above the surface`), t3 (`enrolment
____ year after year`), t4 (`____ from memory`), t13 (`____ what had
started it`), t16 (`____ the temperature … around the clock`), t17 (`____
a temperature of minus eighteen degrees`), t20 (`____ the restoration
altogether`).

**Four more, borderline** — t6, t11, t15 (`____ that **about** five
thousand pairs breed` — the hedge decides it), t21.

So **7 clear, 11 counting borderline**, against 8 of 24 recorded and left
alone in `gerunds-infinitives`. Same rate, and for vocabulary it is
partly unavoidable: collocation *is* half of what a word means, and a set
of five near-synonyms will always contain some pairs that only one object
noun takes. Two of the seven are worth changing anyway because the
deciding word sits immediately beside the blank and the rest of the
paragraph then does nothing — **t20** ("altogether") and **t16** ("around
the clock"). The other five I would record and leave.

---

## 5 · The two things `exam-vocabulary.md` §3.2 asked for

### 5.1 `Allocate & Withhold` — §3.2 is right, and here is the number

The set is two polarity groups: `allocate / distribute / assign` give
out, `withhold / retain` hold back. Count how many distractors fall to
polarity alone, before any lexical knowledge:

| item | options (G = give, K = keep) | key | survive polarity |
| --- | --- | --- | --- |
| t21 | retains K, allocates G, distributes G, withholds K | G | **2** |
| t22 | assigned G, retained K, withheld K, allocated G | G | **2** |
| t23 | withheld K, distributed G, assigned G, retained K | K | **2** |
| t24 | assigns G, allocates G, retains K, distributes G | K | **1** |

**In three of four items a learner who knows only which half of the set
means "keep" is down to a two-way choice; in t24 that learner is already
done.** So every item in this category is at most a two-option item, and
one is a one-option item — the "dead option in a new costume" that
kickoff rule 2 names, arriving through polarity as §3.2 predicted.

And the residual two-way choice is where both my D1s live (t22, t23).
That is the whole set: polarity halves it, and what is left over is a
pair too fine to be decided fairly by a three-sentence paragraph.

It is also worth noting the trap the design is in. Kickoff rule 4
requires every member to appear as a distractor, and the set has two
polarity halves, so mixed-polarity option lists are *forced* — you cannot
fix this set item by item. Either the option lists stay inside one
polarity half (which breaks rule 4), or the set is split into two
three-member sets, or it is replaced. §3.2's "if a set has to be
replaced, this one" survives this review.

### 5.2 `Change & Emergence` — half lexis, half direction

Groups: `emerge` = appear, `shift` = move A→B, `decline`/`fade` = go
down, `evolve` = develop.

| item | key | survive a direction-only check | decided by |
| --- | --- | --- | --- |
| t1 | `emerged` | **1** | direction alone |
| t2 | `shifted` | 2 (`shifted`, `evolved` — both take *from…to*) | **lexis**: "abrupt", "within three issues" |
| t3 | `declined` | **1** (`fade` is not offered) | direction alone |
| t4 | `faded` | 2 (`declined`, `faded`) | **lexis**: no measurable quantity, "from memory" |

**Two of four are decided by direction without any lexical
discrimination; two of four require exactly the contrast the lesson
teaches, and the paragraph names it in both cases.** So the answer to
§3.2 is: not merely polarity, but half of it is. t2 is the best item in
the topic — `evolved` collocates with the same frame, and only "Nobody
expected the change to be so abrupt" and "within three issues" separate
them. t4 is the same quality. t1 and t3 are thin, and t3 is thin by
option choice: leaving `faded` out of the one item where a countable
quantity would decide `decline` vs `fade` removes the set's other real
contrast from the only place it could have been tested.

On §3.2's `fade` frequency-band worry: I would not act on it. The lesson
and every item use `fade` in its abstract sense (interest, support,
memory), which is not the K1–K3 core sense, and t4 is one of the two
items in the set that tests real lexical knowledge.

---

## 6 · What the lesson hands over

Checked only after §1 was written to disk. This is the largest finding in
the review by count, and it is **systemic rather than per-item**: in five
of six categories, the lesson supplies a short sentence carrying the same
verb with the same class of object as the item that keys that verb. The
`check` blocks draw from the same category, so the learner meets these a
few blocks above the question.

Worst six, all quoted in §2: **t5** (`triggered a sell-off`, verbatim
object), **t21** (`budget allocates … to`, plus a pitfall that *is* the
item), **t22** (`The editor assigned the task to a junior`), **t17** (the
`preserve`/`maintain` pitfall on a constant level), **t18** (`restrict
access to`), **t13** (two pitfalls plus a `forms` example, all
"determine the cause").

Moderate, listed once and not itemised: t6 (`The complaint prompted an
inquiry`), t7 (`The error undermined the argument`), t8 (`The new data
reinforced an earlier conclusion`), t12 (`Critics dispute the figure`),
t14 (`An auditor verified the reported totals`), t15 (`Officials
estimated the crowd at 20,000`), t16 (`The agency monitors air quality`),
t19 (`The board suspended the trial`), t20 (`The project was abandoned
after two years`), t24 (`The founder retained a majority stake`).

**The tension is real and the author did not create it.** For grammar,
the rule "never build a question on a sentence from its own lesson" costs
nothing. For vocabulary, showing the word's typical object *is* the
teaching, so a lesson that does its job will always contain the item's
collocation. The fix is not to strip the lessons — it is to make the
item's object noun different from the lesson's in the six worst cases,
which is a one-noun edit each. But `question-author.md`'s rule should
probably grow a vocabulary clause saying that, rather than being read as
satisfied because no sentence is verbatim.

One item runs the other way and is worth flagging for it: **t1 uses a
sense the lesson excludes** (§2, L1/D8).

---

## 7 · Items I could not break

Examined against the full taxonomy and passed: **t2, t3, t4, t6, t7, t8,
t10, t11, t14, t15, t16, t19, t20** — thirteen. (t3, t6, t15, t20 carry
the guessability note in §4 and t6/t20 carry the lesson-overlap note in
§6, but none of them is defective on the key or on D1–D3.)

Passed on the key but carrying a defect named above: t1, t5, t9, t12,
t13, t17, t18, t21, t22, t23, t24.

Two I want to praise, because a review that only reports failures gives
no way to calibrate the rest of it:

- **t14** is the best-aimed item in the topic. `verify` is defined by
  needing a prior claim to check, and the paragraph builds one — "Applicants
  type their own grades into the online form and no certificates are asked
  for at that stage" — then confirms the checking relation with "about one
  file in forty turns out not to match the school's records". Nothing in
  the clause around the blank decides it; the paragraph does all the work.
- **t19/t20** are the only pair in the corpus that tests a contrast in
  both directions with the other member present as a distractor:
  `suspended` with `abandoned` offered and "enrolment started again in
  September" deciding it, then `abandoned` with `suspended` offered and
  "altogether … for the last time" deciding it. That is what all six
  categories should look like, and it is the model for fixing §5.1 and the
  two L5s.

---

## 8 · Verdict per category

| category | verdict | blocking item / reason |
| --- | --- | --- |
| `Change & Emergence` | **SHIPS**, with edits | none blocking. t1 needs the lesson's `emerge` gloss widened (L1); t3 is thin. The set spans its contrast unevenly — t2 and t4 test it, t1 and t3 do not. |
| `Cause & Consequence` | **DOES NOT SHIP** | category-level **L5**: the lesson flags `trigger`/`prompt` as its one real overlap and no item ever tests it — t5 offers no `prompt`, t6 offers no `trigger`. Worst item **t5**, which is also handed over verbatim by the lesson (*"The news triggered a sell-off"*). |
| `Claim & Concede` | **DOES NOT SHIP** | category-level **L5**: `concede`/`acknowledge` is the pair the lesson teaches and **t11** — the only `concede` item — does not offer `acknowledged`. Blocking item **t11**. t12 additionally leaks its answer through "Nobody *questioned* the measurements". |
| `Examine & Establish` | **SHIPS**, with edits | none blocking. Cleanest set in the topic: the flagged `assess`/`estimate` overlap **is** tested (t15 offers both), no D1 anywhere. **t13** needs its object changed — two of the lesson's three pitfalls are that item. |
| `Sustain & Restrict` | **SHIPS**, with edits | none blocking. **t18** is a borderline D1 (`suspends`) fixable by one word in the disclaimer; t17 is pre-solved by the lesson's third pitfall. t19/t20 are the best-built pair in the corpus. |
| `Allocate & Withhold` | **DOES NOT SHIP** | blocking item **t22** (D1: `allocated`), plus **t24** decided by polarity alone and **t21** reproduced in the lesson's own pitfall. This is `exam-vocabulary.md` §3.2's set and §5.1 measures the charge: at most a two-option item throughout, one-option in t24. Fixing it item by item is not possible while kickoff rule 4 forces mixed-polarity option lists — this needs a design decision, not an edit. |

Three of six categories ship. The two L5s and the `Allocate & Withhold`
polarity problem are the same underlying fault seen three times: **the
four items of a set never make its hardest pair compete.** Where they do
— t19/t20, t2, t15 — the items are good.
