# Content audit

Written 2026-09-04, against `main` as it stands: **8 topics, 193
questions, 48 lessons, 48 categories, 8 intros**. Audit only — nothing in
`data/`, `js/`, `tools/` or `tests/` was changed.

The organising question is the one the brief set: **what does the owner
hit this week?** He starts studying tomorrow. He will open Eğitim, read a
lesson, answer its two checks, then take a test on the same four
questions. Findings are ranked by that, not by how structurally
interesting they are.

Defect codes are `docs/agents/reviewer.md`'s (D1–D12, L1–L5).

---

## 0 · What the tooling already sees, and what it cannot

```
npm run validate  →  ✓ Content validation passed.     0 errors, 0 warnings
```

Zero warnings across 193 questions and 48 lessons. I also ran the
corpus-wide near-duplicate check at a third of the shipped threshold
(10% shared token trigrams instead of 30%): **10 pairs out of 18,528, and
the highest shares two trigrams.** There is no lexical duplication in
this corpus. Every one of the 193 stems is a distinct scenario, and that
is a real achievement worth recording before anything else.

Which means: **every finding below is invisible to `npm run check` by
construction**, and most of them are invisible to a reader looking at one
item. They are properties of a *category*, of a *lesson-and-its-items
pair*, or of a claim's truth. That is exactly the residue the pipeline
docs predict, and it is where the whole of this report sits.

Two corrections to the brief's own measurements, both minor:

- Category sizes: **one** category of 5 (`tenses` ›
  *Past Simple vs Past Continuous vs Past Perfect*), not two. 6 × 4 + 1 = 25.
- `so / such` is not absent. It has one `forms` row and one `examples`
  item inside `closest-meaning` › *Too vs Enough vs So...That*. See §1.4.

---

## 1 · Coverage against the paper

`docs/exam-spec.md` gives Session I as **40 items, 1.5 points each, 60
points**, and a blank-by-blank breakdown of the sample cloze. Mapping the
corpus onto it:

### 1.1 The cloze section — 10 blanks, 15 points

| Blank | Tests | In the corpus | Practisable |
| --- | --- | --- | --- |
| 1 | discourse markers (`Similarly / Nevertheless / In spite of / Since`) | `connectors`, 24 items | **yes** |
| 2 | modals (`used to / must not / should / did not have to`) | `modals`, 24 items — but see §1.2 | **partly** |
| 3 | causative `make + object + bare infinitive` | `gerunds-infinitives` › *Causative Verb Patterns*, 4 items | **yes** |
| 4 | modals (`should not / do not have to / used to / had better`) | `modals` — see §1.2 | **partly** |
| 5 | vocabulary (`consumerism / gratitude / conflict / generosity`) | nothing shipped | **no** |
| 6 | comparatives (`as advanced as / less advanced than`) | taught only as *restatement*, in `closest-meaning` | **no, as a cloze** |
| 7 | `so / such` (`so smoothly / such a smooth / so smooth`) | one `forms` row, zero items | **no** |
| 8 | relative pronouns (`whom / whose / which / that`) | `relative-clauses`, 24 items | **yes** |
| 9 | quantifiers (`a few / much / plenty of / a little`) | `quantifiers`, 24 items | **yes** |
| 10 | vocabulary (`appreciate / devastate / smuggle / emerge`) | nothing shipped | **no** |

**4 blanks clean, 2 partial, 4 not covered = 6 to 7.5 of the 15 cloze
points.**

> **`docs/roadmap.md` still counts this in the wrong unit.** It was
> edited during this audit from *"8 of the 10 blank types shipped"* to
> *"**7 of the 10 blank types shipped**"*, which fixes the size of the
> overstatement but not the unit. There are **8 blank types across 10
> blanks**, not 10 types. Of the 8 types: 5 shipped clean (discourse
> markers, modals, causative, relative pronouns, quantifiers), 1 partial
> (comparatives), 2 absent (vocabulary, `so/such`). By *blanks* it is 4
> clean and 2 partial of 10, and two of the four "clean" ones are the
> modal blanks whose real option sets the app has never assembled
> (§1.2). v1 criterion 1 is measured in this unit, so **"5 of 8 types;
> 4 clean and 2 partial of 10 blanks"** is the line to carry into the v1
> decision.

### 1.2 The seam nobody has written down: `used to` never meets a modal

Both modal blanks on the sample paper put **`used to` inside the option
set**:

- blank 2 — `used to / must not / should / did not have to`
- blank 4 — `should not / do not have to / used to / had better`

In the corpus, `used to` lives in `gerunds-infinitives` ›
*Used To vs Be Used To vs Get Used To*, whose four items key
`used to be`, `is used to sleeping`, `got used to hearing`,
`was used to open`. **The string `used to` does not appear anywhere in
`data/modals/modals.json` — zero occurrences, in any option, stem,
explanation or lesson block.**

So the app trains `used to` against `be used to` and `get used to`, and
trains modals against modals, and never once trains the discrimination
the paper actually prints. Both of the two blanks the app claims as its
strongest coverage are option sets it has never assembled. Four items
would close it.

### 1.3 Closest meaning — 10 items, 15 points: the strongest section

`docs/exam-spec.md` names nine things the sample restatement section
turns on. Eight are covered, most of them well:

future perfect · third conditional · passive reporting · modal perfects ·
`unless` · correlative comparatives · `as … as` · `enough to` ·
concession

**Future perfect is the exception, and it is a hole nobody has recorded.**
`will have + V3` appears **nowhere in `data/`** — I grepped the whole
directory. The three hits are `will have to` (closest-meaning-t8's
distractor), `will have no reason` (t20) and `S + will have + nesne + V3`
(a causative pattern row). `tenses` › *Future Forms* stops at
`will / be going to / Present Continuous / Present Simple`; the word
"perfect" never meets the word "future" in this corpus.

That is a named phenomenon on the sample paper, in the section the app
covers best, with zero coverage. Call closest meaning **~13.5 of 15
points practisable**.

### 1.4 `so / such` — not missing, worse: taught once and never asked

`closest-meaning` › *Too vs Enough vs So...That* carries:

```
forms row:  such ... that | İsim öbeğiyle | such + a/an + adj + noun + that + clause
            example: "It was such a dark room that we stopped reading."
examples:   "It was such a hot day that nobody went out."  →  such ... that
```

and **not one of the topic's 24 items keys or offers `such`**. This is
textbook **L5 — untested caveat**: the lesson warns about a form none of
its category's questions ever springs.

Worse, the form that *is* taught is not the one the paper asks for. Blank
7 is `so smoothly / such a smooth / so smooth` — adverb vs noun phrase vs
bare adjective, **with no `that`-clause at all**. The corpus teaches
`such + a/an + adj + noun + that + clause` and nothing else. A learner who
studies this row and meets blank 7 has been given the wrong half of the
contrast.

### 1.5 The whole paper

| Section | Points | Practisable now |
| --- | --- | --- |
| Cloze | 15 | 6–7.5 |
| Closest meaning | 15 | ~13.5 |
| Reading (2 texts, 14 items) | 21 | 0 |
| Paragraph completion (6 items) | 9 | 0 |
| **Session I** | **60** | **~20–21** |
| Listening | 20 | 0 |
| Writing (unspecified) | ~20 | 0 |

`docs/exam-spec.md` put the pre-grammar-ship figure at **~7 of ~100**.
It is now **~20 of 60 in Session I**, roughly a threefold gain. That is
the number to be pleased about, and it is smaller than the roadmap's
framing suggests.

### 1.6 Where the corpus over-invests

`docs/exam-spec.md`: *"not one blank in the sample cloze tests a tense or
the passive."* Nobody has counted what that costs.

| Topic | Items | Cloze blanks it serves | Restatement phenomena it serves |
| --- | --- | --- | --- |
| `tenses` | 25 | **0** | **0** |
| `passive-voice` | 24 | **0** | 2 of 9 (modal perfects, passive reporting) |

**49 of 193 items — 25% of the corpus — sit on the two topics the sample
paper does not test.** About 16 of the 24 passive items (the four
categories *Tense Forms*, *Passive with Modals*, *Causative*, *By +
Agent*) plus all 25 tense items target no scoring point on the paper
directly. They are real B2–C1 grammar and they support reading; that is
not the same as being practice.

They are also the *first two topics in the Eğitim index*, which is what
the owner opens tomorrow. That is a sequencing decision, not a content
one, and it is the cheapest thing on this whole list to change.

---

## 2 · Fifteen lessons, run against their own items

I ran each lesson's `decision` block literally over its own category's
questions, for **15 lessons across all 8 topics** — the brief asked for
12, weighted to the oldest content.

**Sample:** `tenses` ×4 (*Present Simple vs Present Continuous*,
*Present Perfect vs Past Simple*, *Past Simple vs Past Continuous vs Past
Perfect*, *Time Expressions & Signal Words*); `modals` ×3 (*Can vs Could
vs May vs Might*, *Must vs Can't vs Might/Could*, *Can vs Could vs Be
Able To*); `passive-voice` ×3 (*Passive with Modals*, *By + Agent*,
*Passive Reporting Structures*); `connectors` ×1 (*Result vs Purpose*);
`quantifiers` ×1 (*Each vs Every vs Both vs All*); `relative-clauses` ×1
(*Where vs When vs Why vs Which*); `gerunds-infinitives` ×1 (*Both, With
a Meaning Change*); `closest-meaning` ×1 (*Unless vs If Not vs
Otherwise*). 61 items.

### 2.1 The headline result

> **Every decision block reaches the key. 15 of 15 categories, 61 of 61
> items. Not one certifies a distractor.**

That is a genuinely good result and it should be said plainly. The one
near-miss is `tenses` › *Present Perfect vs Past Simple*, where rule 2's
signal chip `since` fires on **tenses-t6** — *"I met him at a conference
in Izmir two years ago, but we haven't kept in touch **since then**"* —
which is keyed **Past Simple**. The procedure survives only because the
Past Simple rule is listed first and the learner honours the order; the
block's heading (*"Sınavda cümledeki zaman ifadesine bak"*) makes no
ordering claim. A learner scanning for `since` gets it wrong.

### 2.2 Why the untrue-claim rate is a third of what the brief expected

The brief warned that finding zero untrue claims in 12 lessons would
itself be a finding. I found **five across 15 lessons — roughly one per
three** — against the pipeline's historical one per lesson. The
explanation is not that I looked less hard; it is **where the claims now
live**.

The lessons have been through a sufficiency pass. The **tips and
explanations have not** — they are per-item, written last, and no review
pass in `docs/agents/` targets them. Four of my five untrue claims are in
`tip` or `explanation` fields, not in lesson blocks. **That is the next
review pass this project needs and it does not have a brief for it.**

The five, in severity order:

**(a) `for` is taught as a Present Perfect signal in one `tenses` lesson
and as the canonical both-sides trap in another. — L2, blocking.**

`docs/CONTENT_GUIDE.md` names this exact word as the example of the
defect:

> *"A signal that appears in both branches is worse than no signal. `for`
> looks like a Present Perfect trigger until you meet* I lived there for
> five years."

`tenses` › *Present Perfect vs Past Simple*, text block 8:

> *"Bir kelime iki tarafta da çıkabilir: **for**. … Kararı veren kelime
> değil, dönemin hâlâ açık olup olmadığıdır."*

`tenses` › *Time Expressions & Signal Words*, contrast block 1, the `for`
side:

> *"Sürecin ne kadar sürdüğünü verir: bir süre miktarı. **Yine Present
> Perfect ile gelir.**"*

…and decision block 11:

> `{"signals":["since","for","already","yet","just","so far","ever","never"],"then":"Present Perfect"}`

Two lessons in the same topic, on the same index, contradicting each
other about the same word — and the one that gets it wrong is the one
whose whole subject is signal words. `for` never appears in either
category's items, so nothing catches it.

**(b) quantifiers-t14 — an untrue rule, in a tip. Blocking.**

> EXPL: *"'practically, nearly, almost' gibi sözcükler **yalnızca**
> 'every' ile birleşir çünkü 'every' bir bütünün oranını verir."*
> TIP: *"'almost, nearly, practically' **yalnızca** 'every' ile
> kullanılır; 'all' çoğul isim, 'both' tam iki şey ister."*

`almost all`, `nearly all` and `practically all` are standard English and
commoner than `almost every`. The *item* is fine — with the singular noun
`ground-floor flat`, `all` really is out — but the tip is written as a
transferable rule, which is what a tip is for, and it is false. A learner
carrying it will reject `almost all the flats` on the paper.

The lesson's own `decision` block gets this right (rule 6 fires only
*after* the singular-countable gate). The item's tip dropped the gate.

**(c) gerunds-infinitives-t17's tip is refuted by two items in its own
category. Blocking.**

> t17 TIP: *"Amaç bildirirken 'for + fiil' asla kullanılmaz: 'to + fiil'
> ya da 'in order to + fiil' denir; **'for' yalnızca isimle gelir**."*

The category is *Infinitive of Purpose vs For + Gerund*. Its other two
items key exactly what that tip forbids:

- **t18** key: `for blocking` — *"the council fined it ____ the footway"*
- **t20** key: `for flattening` — *"a written apology ____ it"*

Four items, and one of them hands the learner a rule that makes the other
two unanswerable. Scoped to purpose the claim is true; as written and as
carried, it is not.

**(d) modals-t2 — the only D1 in the corpus. Blocking.**

> STEM: *"According to the university's regulations, every student ____
> submit a health report before moving into the dormitory."*
> KEY: `has to` · distractor: `must`
> EXPL: *"Anlamca 'must'a **yakın olsa da**, resmi kurumsal kural
> bağlamında sınavlarda 'have to' **tercih edilir**."*

This is the D1 test verbatim: *"the explanation argues the key is more
natural rather than that the alternative is wrong."* Written regulations
are the environment in which English most characteristically uses `must`
— *every student must submit* is what the regulation itself would say.
The item punishes the student who knows more.

It is internally consistent with its lesson, which is the problem: the
lesson's *decision* rule 3 (`according to the regulations`, `the law`,
`company policy` → **Have to**) manufactures the defect. The lesson is
where the fix goes.

I screened all 193 explanations for D1 hedging (`tercih edilir`, `daha
doğal`, `neredeyse aynı`, `yakın olsa da`, …). Four hits; three are
harmless because the "more natural" option is not on the item's list.
**modals-t2 is the only real one. One D1 in 193 is a good number and
should be said.**

**(e) `tenses` › *Present Simple vs Present Continuous*, decision block
10 — a signal chip that fires on the wrong thing. Note.**

Rule 3 lists the bare chip `every`. In **tenses-t3** — *"Water ____ at 100
degrees Celsius at sea level, a fact **every** chemistry student memorizes
early on"* — it fires on `every chemistry student`, which is not a time
expression. It reaches the right key for a reason the lesson does not
hold. Block 4 of the same lesson has the correct chip (`every day`).

Also: **blocks 4 and 10 of that lesson are the same three rules,
reordered.** The learner reads the procedure twice.

### 2.3 The real defect the sample found: branches that never fire

Every procedure works. What they never have to do is discriminate. Per
category, the branches that no item exercises:

| Lesson | Untested branch | Evidence |
| --- | --- | --- |
| `tenses` › *Past Simple vs Past Cont vs Past Perfect* (5 items) | **Past Simple is never the key** | keys: `was waiting`, `had left`, `was cooking`, `had rebuilt`, `had founded`. The tense named first in the category title appears only as a distractor, five times. A learner drills "never pick Past Simple" — the opposite of what a narrative paper rewards. |
| `tenses` › *Present Perfect vs Past Simple* | **`for` untested** — L5 | the lesson's text block 8 exists for it; t5 uses `since`, t6 `two years ago`, t7 nothing, t8 `over the past century`. |
| `tenses` › *Present Simple vs Present Continuous* | **the stative-verb-beats-`now` collision untested** — L5 | the lesson spends a text block, a pitfall and an example on *"I understand the problem now"*; t4 tests `think` with no competing `now`. |
| `tenses` › *Time Expressions* | **`for`, `yet`, `still` never keyed**; `already` keyed **twice** | keys: `since`, `already`, `already`, `ago`. Six items taught, four questions, two of them the same decision (t22/t23 are both "already vs yet"). D11 at category level. |
| `modals` › *Can vs Could vs May vs Might* | **`may` and `might` never appear in the same item. Neither do `can` and `could`.** | t5 `Can/Must/Should/Will`; t6 `may/must/should/can`; t7 `might/must/have to/can't`; t8 `Could/Must/Shall/Need`. The lesson has *two* contrast blocks — a politeness scale and a probability scale — and **neither is ever contested by an item.** t5 and t8 have only one category member on the list at all. |
| `modals` › *Must vs Can't vs Might/Could* | **`could` appears in zero of the four items** | t9 `must/might/can't/should`; t10 `can't/must/might/mustn't`; t11 `might/must/can't/have to`; t12 `must/should/can/will`. The category names it; the lesson gives it a `forms` row and an `examples` item. |
| `modals` › *Can vs Could vs Be Able To* | **the affirmative-only caveat untested** — L5 | text block 4 is entirely about `couldn't` being free in the negative. All four items are affirmative. |
| `passive-voice` › *Passive with Modals* | **one rule answers all four items** | decision rule 2 ("subject can't perform the action") fires on `form`, `fire exits`, `medication`, `project`. Rules 3 and 4 never fire. Four items, one question. |
| `passive-voice` › *By + Agent* | **the lesson's headline decision is tested once** | rules 1 and 4 do all the work; rule 4 is purely syntactic ("is there a noun phrase after the blank?"). t22 and t24 have identical option architecture (`was V3 by` / `was V3` / `V2` / `has V3`). Only **t21** asks the semantic question the lesson exists for. |
| `passive-voice` › *Passive Reporting* | **the procedure is genuinely exercised in one item** | t17, t18 and t20's distractors are all malformed (`is saying to`, `It is believing`, `is supposing to`), so those three are form recognition. Only **t19** requires choosing an infinitive tense. |

Contrast with the four newest topics, where this does not happen:

| Lesson | Result |
| --- | --- |
| `connectors` › *Result vs Purpose* | **every rule fires on exactly one item.** t9 → `therefore` (rule 2), t10 → `so that` (3), t11 → `in order to` (4), t12 → `so` (1). The exclusion rule (`because`) is exercised as a distractor in t10. |
| `quantifiers` › *Each vs Every vs Both vs All* | all four forms keyed once each; every rule fires. |
| `relative-clauses` › *Where vs When vs Why vs Which* | all four forms keyed once each; every rule fires. |
| `gerunds-infinitives` › *Both, With a Meaning Change* | all four verbs keyed once, each on a different branch, **and the option sets cross verbs** (t5 offers `regretted leaving` and `tried leaving`), so an item needs both the form decision and the verb decision. |

The four newest topics do this because a category spec was written before
the content. The three oldest were written before that rule existed.

One small L1: `closest-meaning` › *Unless vs If Not vs Otherwise*'s
decision block has no rule for "the option adds information the original
does not carry", and **closest-meaning-t5**'s distractor
*"The landlord will keep **part of** the deposit **even after** the
tenants repair the kitchen floor"* is exactly that. The sibling
*Third Conditional* lesson has the rule (`Overshoot`); this one does not.
One rule to add.

---

## 3 · The 193 items, screened mechanically

### 3.1 The finding that matters most this week: 42 items reuse a sentence from their own lesson

`docs/agents/question-author.md` rule 1 exists because *"20 of 24 keys in
one topic were built on the lesson's own sentences."* I measured the same
thing across the live corpus: content-word overlap between each stem and
every English string in its **own** lesson (`contrast.example`,
`forms.example`, `examples.sentence`, `pitfall.wrong`, `pitfall.right`),
at a 0.55 threshold.

**42 of 193 items (22%).** And the distribution is the whole story:

| Topic | Items reusing their own lesson | Share |
| --- | --- | --- |
| `passive-voice` | **19 / 24** | **79%** |
| `modals` | **16 / 24** | **67%** |
| `tenses` | 6 / 25 | 24% |
| `closest-meaning` | 1 / 24 | 4% |
| `connectors` | **0 / 24** | 0% |
| `quantifiers` | **0 / 24** | 0% |
| `relative-clauses` | **0 / 24** | 0% |
| `gerunds-infinitives` | **0 / 24** | 0% |

**41 of the 73 items in the three oldest topics — 56% — are the lesson's
own sentences with the answer removed.** The four newest topics have
none: the rule was written after the old topics shipped and was never
applied backwards.

`docs/roadmap.md` was edited during this audit to say exactly this in
prose — *"the pipeline has tightened four times since `tenses`, `modals`
and `passive-voice` went out … Those three topics have never met the
current bar"* — and to record the gap as the owner's open decision worth
*"about twenty hours of work"*. **This is the measurement behind that
sentence.** The twenty-hour estimate is close: fix 5 below prices the
stem rewrites at 10–14 hours, and fixes 2, 4 and 10 add most of the rest.

The clearest cases, at overlap 1.00:

```
modals-t23   Q: "Despite the terrible traffic, she ____ arrive at the interview exactly on time…"
             L: pitfall.wrong — "Despite the traffic, she could arrive on time."

modals-t21   Q: "My little brother ____ solve a Rubik's cube in under a minute…"
             L: examples — "My brother can solve a Rubik's cube in under a minute."

modals-t11   Q: "Someone is knocking on the door. It ____ be the courier with my package…"
             L: examples — "Someone is knocking. It might be the courier."

modals-t8    Q: "'____ you possibly lend me your charger for a few minutes?…'"
             L: contrast — "Could you possibly lend me your charger?"

modals-t17   Q: "…but in my opinion you ____ try that new bakery downtown at some point…"
             L: examples — "In my opinion, you should try that new bakery."

passive-t13  Q: "She ____ her hair cut before the wedding…"
             L: forms  — "She had her hair cut before the wedding."

passive-t9   Q: "The package ____ delivered to the wrong address…"
             L: forms  — "The package must have been delivered to the wrong address."

passive-t12  Q: "The email ____ sent to your spam folder by mistake…"
             L: forms  — "The email may have been sent to your spam folder."

passive-t10  Q: "This mistake ____ caught much earlier…"
             L: contrast — "This mistake should have been caught much earlier."
```

Whole categories are affected, not scattered items:

- **`modals` › *Can vs Could vs Be Able To*: all four items** (t21, t22,
  t23, t24) are the lesson's own examples and pitfalls.
- **`modals` › *Should vs Ought To vs Had Better*: three of four**
  (t17, t19, t20).
- **`modals` › *Must vs Have to…*: three of four** (t1, t3, t4) —
  t3 is the lesson's pitfall on takeoff phones, t4 its `don't have to`
  contrast example.
- **`passive-voice` › *Modal Perfects in Passive*: all four**, each one a
  `forms` row example.

**Why this bites on day one, specifically.** Every lesson in the corpus
has **exactly two `check` blocks** (I counted: 0 of 48 have three) against
a category of four questions. `js/education.js` fills them from the same
category. So a learner reading `passive-voice` › *Modal Perfects in
Passive* meets the sentence in the `forms` table, scrolls three blocks,
and is asked it. Then the Test tab draws from the same four. In the two
worst topics **the check block is not a check** — it is a recall prompt
for a sentence two screens up, and the score it produces means nothing.

One further leak, cross-lesson: **tenses-t19**'s stem
*"By the time she turned thirty, she ____ two companies…"* is verbatim
the *Perfect Aspects* lesson's `examples` sentence and its final
`contrast` example — but the item is filed under *Past Simple vs Past
Continuous vs Past Perfect*, so it is met as an example in one lesson and
as a question in another.

### 3.2 Keys guessable without the paragraph

Not automatable, so I read for it. The finding is not scattered items but
**two categories where the paragraph does no work**:

**`passive-voice` › *Passive with Modals* (t5–t8).** All four items have
identical option architecture: key = `modal + be + V3`; one active
distractor; two pattern violations.

```
t5  should be submitted  | should submit  | should be submitting | should submitted
t6  must be kept         | must keep      | must been kept       | must being kept
t7  can be taken         | can take       | can be take          | can taking
t8  might be postponed   | might postpone | might been postponed | might be postpone
```

I am **not** calling the malformed options D2. `reviewer.md` is explicit
that an option encoding an error the lesson teaches against is a live
distractor however wrong it looks, and this lesson's pitfall block 7 is
literally *"All fire exits must been kept clear."* The defect is D11 and
D4 at category level: **four items, one question, asked four times, and
all four are answerable from the subject noun alone** — you never read
past *"This form ____"*.

**`passive-voice` › *By + Agent* (t21–t24).** Three of four are decided by
one syntactic test — is there a noun phrase after the blank? — not by the
lesson's actual subject, which is whether the agent is worth naming.
t22 and t24 are the same item with different nouns.

Elsewhere the option sets are honest. `connectors` deserves specific
credit: **every one of its 24 items draws its distractors from other
categories in the topic**, so the whole 24 is one pool — which is exactly
the shape of the paper's blank 1, where four different classes of
connector compete. It is the only topic that builds its option sets the
way the exam does.

### 3.3 Near-duplicate scenarios

**Lexically, none** (§0). The duplication is structural — the same
*decision* asked twice with different nouns:

| Pair | Shared decision |
| --- | --- |
| tenses-t22 / tenses-t23 | `already` vs `yet` in a positive clause — 2 of 4 items in the category |
| tenses-t10 / tenses-t19 | `by the time` → Past Perfect |
| modals-t9 / modals-t12 | concrete evidence → `must` |
| passive-voice-t22 / passive-voice-t24 | noun phrase follows the blank → `by` |
| passive-voice-t5 / t6 / t7 / t8 | recognise `modal + be + V3` |

No tooling can see these, and no tooling should try; the fix is a category
spec, which the four newest topics have and the three oldest do not.

### 3.4 Tips that contradict their own lesson or their own key

Screened all 193. Three real hits, all covered above: **quantifiers-t14**
(§2.2b), **gerunds-infinitives-t17** (§2.2c), and the cross-lesson `for`
conflict that **tenses-t21**'s tip sits inside (§2.2a). Nothing else in
the corpus asserts something its own lesson denies.

### 3.5 Answer visible in the paragraph

One hit in 193: **passive-voice-t15**, key `have`, stem opens
*"I **have** never held a paint roller in my life."* The key form is
already printed in sentence one. Low severity — the causative reading is
different — but it is the only D12 in the corpus and it is one word to
change.

### 3.6 What the distractors actually test, and what they never do

Counting all 579 wrong options:

- **393 (68%) are named in the explanation. 186 are not.**

| Topic | names 1 of 3 | names 2 of 3 | names 3 of 3 |
| --- | --- | --- | --- |
| `quantifiers` | 0 | 0 | **24** |
| `gerunds-infinitives` | 0 | 15 | 9 |
| `connectors` | 0 | 21 | 3 |
| `relative-clauses` | 1 | 19 | 4 |
| `tenses` | 4 | 17 | 4 |
| `passive-voice` | 3 | 18 | 3 |
| **`modals`** | **11** | 10 | 3 |
| `closest-meaning` | 24 | 0 | 0 |

`closest-meaning` is a measurement artefact — its options are whole
sentences, quoted once in full and the other two described in prose; read
them and all three are addressed. **`modals` is the real outlier: 11 of
24 items tell the learner about one wrong option out of three**, and
modals carries the shortest explanations in the corpus (298 characters
average against 464 for `closest-meaning`). The four shortest
explanations in the whole app are passive-voice-t4 (125 chars),
passive-voice-t20 (126), tenses-t21 (128) and modals-t5 (135) — all under
the guide's "three or four sentences is the shape".

By *kind*, the distractors divide cleanly by generation:

- **The three oldest topics** drill *inflection*: four forms of one verb,
  or four members of one modal set. That trains a paradigm.
- **The four newest topics** drill *choice between distinct words*, with
  distractors borrowed across categories, plus L1-transfer error forms
  (`for to put`, `made us to read`, `capable to sing`, `looking forward to
  see`) that are exactly the mistakes a Turkish speaker makes. That trains
  a decision.

The second is what the paper tests. The first is what a coursebook tests.

---

## 4 · The eight intros

These have had **no content review at all** (`docs/research/orientation.md`;
`data/roadmap.json` nonetheless marks *Konu girişleri* `done`). Checked
against §3.2's template and its "must never contain" table.

**First, the structural finding.** `tools/validate-content.mjs` ›
`checkIntroGiveaway` is meant to stop an intro handing over its own
answers. It skips single words by design:

```js
// Single words are the grammar being taught and cannot be avoided:
// a quantifiers intro that may not print `many` teaches nothing.
if (piece.split(/\s+/).length < 2) { continue; }
```

That carve-out is right for a heading and wrong for a list. **Four intros
print single-word lists that are the option sets of their own lessons,
and the check cannot see any of them.**

| Topic | Verdict |
| --- | --- |
| **`quantifiers`** | **Worst.** Its three `parts` are three keyed contrasts of three of its own six lessons, each with a worked minimal pair: `many pencils · much water` (the *Much vs Many* decision), `any · some` glossed *"bazı kelimeler yalnız olumsuzda ya da soruda çalışır"* — **that is the decision rule of *Some vs Any vs No vs None*, which the table forbids outright** — and `most students · most of the students`, which is precisely the t21/t22/t24 contrast. `any` is the key of t9, `some` of t10, `most` of t21, `most of` of t22 and t24. |
| **`tenses`** | `parts[2]` is *"Sinyal kelimeler … `since · for · ago · already`"* — **a signal-word list, forbidden outright**, and the four words are the option set of *Time Expressions & Signal Words*: `since`, `already` and `ago` are the three distinct keys of that lesson's four questions and `for` is a distractor in two of them. Separately, `choice` reuses lesson 1's own opening: intro *"Türkçede *gidiyorum* hem rutini hem şu anı karşılayabilir, çünkü Türkçe farkı çoğu zaman bağlamdan çıkarır"* against lesson 1 block 0 *"Türkçe'de 'gidiyorum' dediğinde … bağlamdan anlarız"* — same word, same claim, same shape. Longest intro at ~1,235 Turkish characters, over §3.2's ~1,200 (under the schema's 1,400). |
| **`passive-voice`** | `parts[2]` is *"by + fail — isteğe bağlı; **sadece yeni bir bilgi veriyorsa**"* — the keyed contrast of *By + Agent: Include vs Omit*, stated as its rule. Its two `examples` then work the pair: *"The fence was repainted last spring"* / *"The fence was repainted by the council"*, noted *"Fail gerçekten bir bilgi taşıyorsa eklenir."* That is the whole sixth lesson, one screen above passive-voice-t21/t22/t24. Its `exam` field also contradicts `docs/exam-spec.md`: it says the passive is only needed *"uzun cümleleri doğru okuyabilmen için"*, where the spec credits *Modal Perfects* and *Passive Reporting* with ~3 of the closest-meaning section's 15 points. |
| **`gerunds-infinitives`** | Two keyed contrasts in one `parts` list: *"Edat — bir edattan sonra fiil daima -ing alır — `good at jogging`"* (the decision behind t13 and t14) and *"Anlam değiştiren çiftler — `stopped smoking · stopped to smoke`"* (the entire *Both, With a Meaning Change* lesson, worked). `what` also near-repeats lesson 1's opening: intro *"koşmayı sevmek, koşmaya karar vermek"* against lesson *"yüzmeyi severim ile yüzmeye karar verdim"* — same two verbs, same point. |
| **`modals`** | `parts[2]` (*modal + have + V3*) pre-answers part of modals-t13, whose explanation turns on *"bu kalıp her zaman modal + have + V3'tür"*. `parts[0]`'s `can · must · should · may · might` covers four of the eight keys in two of its lessons. **Its `exam` field states something false about the source:** *"on boşluğun ikisi modal soruyor — **tek bir konu için en yüksek pay**."* Blanks 5 and 10 are both vocabulary, so modals is *tied*, not highest — and "how common a form is / what usually happens on the paper" is on the forbidden list by name. |
| **`connectors`** | One keyed contrast: `parts[2]` *"Noktalama — zarf iki cümleyi virgülle bağlayamaz"* is exactly the decision connectors-t8 turns on. Its `exam` field also misdescribes the paper: *"dört seçenek de farklı türden bağlaç"* — blank 1 is `Similarly / Nevertheless / In spite of / Since`, and the first two are the same type (conjunctive adverbs). Otherwise good. |
| **`relative-clauses`** | **Clean on keyed contrasts** — its `parts` list is the pronoun inventory, which `orientation.md` §3.1 explicitly drafted and sanctioned. The one issue is the one that document asked a reviewer to settle: *"it does not repeat lesson 1's own opening sentence … a reviewer should check whether even that is one repetition too many."* **Answer: yes.** Intro: *"yan cümle ismin **arkasına** geçer"*; lesson 1 block 0: *"cümle ismin **arkasına** gelir."* Same claim, near-identical wording, adjacent screens. |
| **`closest-meaning`** | **The best of the eight.** No keyed contrast (its `parts` are the invariants a paraphrase must preserve, which is the section's frame rather than any lesson's answer), no signal-word list, no unsupported claim, and **the only `exam` field entirely supported by `docs/exam-spec.md`**: *"Kâğıtta ayrı bir bölüm: on soru, 15 puan. Her soruda bir cümle ve dört tam cümlelik seçenek var."* Use it as the model when the other seven are rewritten. |

**Across all eight:** no encouragement, no outcome promises, all within the
schema's length limit, all eight keys correct, all `parts` lists 3 entries.
Five of eight `exam` fields make a claim `docs/exam-spec.md` does not
support. Six of eight carry at least one keyed contrast of one of their
own lessons.

---

## 5 · What is missing that nobody has written down

Ordered by what a learner meets first.

1. **Future perfect** (§1.3). Named in `docs/exam-spec.md` as one of nine
   things the sample restatement section turns on. Zero coverage, zero
   mention in `docs/roadmap.md`. `will have + V3` does not exist in
   `data/`.

2. **`used to` never competes with a modal** (§1.2). Both modal blanks on
   the sample paper print `used to` in the option set. Zero occurrences of
   the string in `data/modals/modals.json`.

3. **`so / such` is taught in the wrong shape** (§1.4). One `forms` row,
   zero items, and the row covers `such + a/an + adj + noun + that` while
   the paper's blank 7 is `so smoothly / such a smooth / so smooth` with no
   `that`-clause. The roadmap's half-day estimate for "one category, four
   items" also needs to fix the row.

4. **Past Simple is never a key in the category that names it** (§2.3).
   Five items, five non-Past-Simple keys. On a narrative reading passage
   the default past tense is Past Simple, and this corpus trains against it.

5. **The `for` trap is taught in one tenses lesson and denied in
   another, and tested in neither** (§2.2a). The single defect
   `CONTENT_GUIDE.md` names by name.

6. **Three categories never make their hardest pair compete** — the
   `academic-verbs` REPAIR pattern, alive in shipped content:
   `may` vs `might` and `can` vs `could` (never co-occur);
   `could` (absent from all four items of the category that names it);
   `should` vs `ought to` (avoided, correctly, but then never contested
   except once).

7. **A Turkish-learner trap no lesson names: the bare-infinitive
   perception verbs.** `see / hear / watch / feel + object + bare
   infinitive vs -ing` (*I saw him leave* / *I saw him leaving*). It is a
   sibling of the causative pattern the app teaches well, it is a standard
   Turkish-learner error, and it appears nowhere in the corpus. Not on the
   sample paper's cloze, so it is a note rather than a gap — but it is the
   nearest neighbour of the one thing blank 3 does test.

8. **`data/roadmap.json` tells the learner something the project's own
   documents deny.** See §7 — this is the top-ranked fix and it is not a
   content-authoring job.

---

## 6 · `optionNotes` — zero of 193

The honest accounting, so the decision can be revisited on evidence.

**What its absence costs, precisely.** 186 of 579 wrong options (32%) are
never named in their item's explanation. Subtract `closest-meaning`,
where the naming metric under-counts because the explanations describe
options rather than quote them, and the real figure is **~138 of 507
grammar distractors, 27%**. A learner who picks one of those 138 is told
what the right answer was and is never told what they chose.

`CONTENT_GUIDE.md` already states the rule that decides where this
matters: the explanation names the closest wrong option **"and the other
two fail for the same reason"** — true when the options are four forms of
one verb, false when they are four different words. So the cost is
concentrated exactly where the options are lexically distinct:

| Priority | Items | Why |
| --- | --- | --- |
| **1. `connectors`, 21 of 24 items** | 21 | Each item's three distractors are three connectors from three *different* relation classes, each failing for a *different* reason. 21 items name only two of three. connectors-t1's `By then` gets no gloss; t4's `Subsequently` none; t21's `By then` none. This is the vocabulary-set case in everything but name, and it is the topic that serves the highest-value cloze blank. **63 notes.** |
| **2. `relative-clauses`, 19 items** | 19 | Same shape — `who's`, `of it`, `of them`, `what`, `neither of which` all fail differently. 19 name two of three. **19 notes.** |
| **3. `modals`, 21 items** | 21 | Not because the options are lexically distinct but because the explanations are the corpus's thinnest: 11 items address one distractor out of three. **~32 notes.** |
| Not worth it | `quantifiers` (24/24 already name all three), `gerunds-infinitives` (9 name all three; the rest fail for one shared reason — a pattern violation), `closest-meaning` (options are sentences; the explanation already walks all three), `tenses`/`passive-voice` (four forms of one verb — the shared-reason case the guide describes) |

**So the revisitable number is not 291 notes. It is ~114**, covering the
three topics where a distractor genuinely needs its own gloss, and 63 of
those sit in one topic. At the drafts' observed length (~100–140
characters each) that is roughly **6–8 hours for `connectors` alone**, and
`connectors` serves cloze blank 1.

The owner's decision — *"completing the app's features is worth more than
deepening content that already teaches"* — stands for `tenses`,
`passive-voice`, `quantifiers` and `gerunds-infinitives`. It is weakest
for `connectors`, and that is the case to re-put.

---

## 7 · Verdict

### What is complete

- **The schema and the tooling.** 193 items, 48 lessons, zero validator
  errors, zero warnings, zero lexical near-duplicates at a third of the
  shipped threshold. Every explanation names at least one wrong option.
  Every lesson has a `contrast` and two `check`s. Nothing in this audit is
  a thing the tooling should have caught and didn't — except one carve-out
  (§4), which is a two-line change.
- **`closest-meaning`.** 24 restatement items covering 8 of the 9
  phenomena `docs/exam-spec.md` names, with distractors that do what the
  real paper's distractors do (re-time, re-modalise, reverse, overshoot,
  drop a condition). ~13.5 of 15 points. The best content in the app and
  the cheapest section to have built.
- **The four newest grammar topics** (`connectors`, `quantifiers`,
  `relative-clauses`, `gerunds-infinitives`): 96 items, **zero**
  lesson-sentence reuse, decision procedures where every branch fires on
  exactly one item, and option sets that cross category boundaries the way
  the paper's do. `quantifiers` › *Each vs Every vs Both vs All*,
  `relative-clauses` › *Where vs When vs Why vs Which*,
  `gerunds-infinitives` › *Both, With a Meaning Change* and
  `connectors` › *Result vs Purpose* are the four categories to copy.
- **Turkish prose quality** throughout: every lesson opens from the
  Turkish structure the learner already has, and the pitfalls are real
  L1-transfer errors rather than invented ones.

### What is incomplete, and by how much

| | Measure |
| --- | --- |
| Session I coverage | **~20 of 60 points.** Cloze 6–7.5 of 15; closest meaning ~13.5 of 15; reading 0 of 21; paragraph completion 0 of 9. |
| Whole exam | ~20 of ~100. Listening and writing untouched and correctly deferred. |
| Items that reuse their own lesson's sentence | **42 of 193 (22%)** — but **41 of the 73 in the three oldest topics (56%)**, and **0 of 96** in the four newest. |
| Categories whose four items never contest the pair the category names | **6 identified in a 15-lesson sample** (~40% of the sample). Unmeasured in the other 33 lessons. |
| Distractors never explained | 186 of 579 (32%); ~138 of 507 excluding `closest-meaning`. |
| Intros with a keyed contrast of their own lesson | **6 of 8.** With an unsupported `exam` claim: **5 of 8.** Reviewed: **0 of 8.** |
| Untrue or overstated claims about English | **5 in 15 lessons** (~1 per 3, against the pipeline's historic 1 per lesson) — and **4 of the 5 are in `tip`/`explanation`, which no review pass covers.** |
| Blocking defects | **6**: `data/roadmap.json`'s review claim; the `for` contradiction; quantifiers-t14's tip; gerunds-infinitives-t17's tip; modals-t2 (D1); the `passive-voice`/`modals` lesson leak, at category scale. |

### Ranked: what to fix first

Ordered strictly by *what a learner meets this week*, with hours.

| # | Fix | Why first | Hours |
| --- | --- | --- | --- |
| **1** | **`data/roadmap.json`: the app tells the learner something untrue.** The `Gramer` row, on screen in Profil, reads *"Sınavın boşluk doldurma bölümünün ödüllendirdiği **sekiz konu**. Her ders ve her soru, cevabı görmemiş ayrı bir denetimden geçti."* Two of the eight topics are the two the cloze section does **not** reward (`docs/exam-spec.md`), and `docs/roadmap.md` — as edited today — says of the same claim that `tenses`, `modals` and `passive-voice` *"have never met the current bar"* and records the gap as an **open** decision. The intros, marked `done` in the same file, have had no review at all. So the app asserts to the learner, in Turkish, a thing the project's own roadmap lists as unresolved. | v1 criterion 3 is *"Nothing on screen claims more than the data supports"*, and this is the one screen that makes a claim about the content. It is also the first thing a friend sitting Bilkent's PAE will read. | **0.5** |
| **2** | **The three blocking tips.** quantifiers-t14 (`almost/nearly/practically yalnızca every`), gerunds-infinitives-t17 (`'for' yalnızca isimle gelir`, refuted by t18 and t20 in its own category), and the `for` contradiction between `tenses` › *Time Expressions* (contrast block 1 + decision block 11) and `tenses` › *Present Perfect vs Past Simple* (text block 8). | Three false statements about English, each carried into the exam as a rule. The `for` one is the defect `CONTENT_GUIDE.md` names by name. | **1.5** |
| **3** | **Reorder the Eğitim index so `tenses` and `passive-voice` are not first.** 49 of 193 items serve zero points on the paper; they are the first 49 the owner will meet. Put `connectors`, `quantifiers`, `relative-clauses`, `gerunds-infinitives`, `closest-meaning` ahead of them via `tier` in `data/manifest.json`. | Zero content is written. It moves ~25% of the corpus out of week one and the best-reviewed 120 items into it. Highest ratio of exam value to effort on this list. | **1** |
| **4** | **modals-t2 (D1) and its lesson's rule.** Change the item so `must` is not on the list, **and** soften decision rule 3 in *Must vs Have to vs Mustn't vs Don't Have to* — written regulations are where English most uses `must`. | The only item in 193 that punishes a learner for knowing more, and the lesson manufactures it. | **1** |
| **5** | **Repair `passive-voice` and `modals` for lesson-sentence reuse** — 35 items across the two, worst first: *Can vs Could vs Be Able To* (4/4), *Modal Perfects in Passive* (4/4), *Should vs Ought To vs Had Better* (3/4), *Must vs Have to…* (3/4). Rewrite the **stems**, not the lessons. | This is what makes the check blocks meaningless and the four-item test a memory test, in the two topics the owner meets in week one. `docs/agents/question-author.md` rule 1 already forbids it; it was never applied backwards. | **10–14** (~20 min/item, plus a blind re-review of the rewrites — `docs/roadmap.md` records that 5 of the previous repairs introduced a new defect) |
| **6** | **Rewrite the eight `exam` fields against `docs/exam-spec.md`, and strip the four forbidden `parts` entries** (`tenses`' signal-word list; `quantifiers`' three keyed contrasts; `passive-voice`' `by + fail` rule; `gerunds-infinitives`' two). Use `closest-meaning`'s intro as the model. | Zero of eight were reviewed; five make an unsupported claim about the paper and six hand over an answer one screen above the question. | **3–4** |
| **7** | **Fix `checkIntroGiveaway`'s single-word carve-out** in `tools/validate-content.mjs`: allow a single word in `parts[].name`/heading position, flag it when **three or more** single words from one `en` field are options in one category. Would have caught `tenses` and `quantifiers` automatically. | Two lines, and it stops the next intro reintroducing this. | **1** |
| **8** | **Finish correcting the blank-type count in `docs/roadmap.md`.** It moved from 8 to 7 during this audit; the unit is still wrong. Make it "5 of 8 blank types; 4 of 10 blanks clean, 2 partial". | v1 criterion 1 is measured in this unit. | **0.25** |
| **9** | **Close the four unrecorded coverage holes**, in this order: `so/such` **including the wrong-shape `forms` row** (4 items + 1 row), `used to` against modals (4 items), future perfect (4 restatement items + a `Future Forms` contrast side), comparatives as a *cloze* rather than only a restatement (4 items). | 16 items and two lesson edits close every coverage gap in Session I except vocabulary, reading and paragraph completion. | **8–10** |
| **10** | **Repair the six categories whose items never contest their own pair** — force `may` vs `might` and `can` vs `could` into one item each; put `could` into *Must vs Can't vs Might/Could*; key Past Simple at least once in the category that names it; key `for`, `yet` or `still` in *Time Expressions* instead of `already` twice; make *Passive with Modals* and *By + Agent* ask more than one question between them. | The `academic-verbs` REPAIR pattern, alive in shipped content. Each fix is a swapped option set, not a new scenario. | **6–8** |
| **11** | **A `tip`-and-`explanation` review pass, and a brief for it.** Four of the five untrue claims I found are in per-item fields that no pass in `docs/agents/` covers. Start with `modals`, where 11 of 24 items address one distractor of three and the average explanation is 298 characters. | This is the gap in the pipeline itself, not in one topic. Everything above is a symptom of it. | **brief 2, first pass 6–8** |
| **12** | **`optionNotes` for `connectors` only** — 63 notes, 21 items (§6). Revisit the decision on this evidence; leave it standing for the other five grammar topics. | 21 items where one of three distractors is currently unexplained, in the topic serving the highest-value cloze blank. | **6–8** |

Items 1–4 are **four hours** and remove every blocking defect a learner
meets in week one. Item 5 is the expensive one and is the difference
between a lesson check that measures something and one that does not.

Two smaller notes not worth a row: **passive-voice-t15**'s key `have`
appears in its own first sentence (§3.5, one word to change), and
`tenses` › *Present Simple vs Present Continuous* carries the same three
decision rules twice, in blocks 4 and 10 (§2.2e).
