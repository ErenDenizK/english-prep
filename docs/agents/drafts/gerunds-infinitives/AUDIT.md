# Lesson-sufficiency audit: Gerunds & Infinitives

## What was audited

| | |
|---|---|
| Branch | `test` |
| Commit | `3a6dba7` — *Record the relative-clauses examples repair, whose reasoning my commits ate* (2026-09-04 10:24:43 +0000) |
| Working tree | clean when the audited files were read; `js/quiz.js`, `quiz.html` and `tools/verify-ui.mjs` were modified by another session while the audit was being written, none of which touches content |

Files read, with their blob hashes at that commit, so a later session can
tell whether the ground has moved:

| File | Blob |
|---|---|
| `docs/agents/drafts/gerunds-infinitives/lessons.json` (6 lessons) | `4100efb168ee8f09a7a02d2a95e56eb3010c64d6` |
| `docs/agents/drafts/gerunds-infinitives/questions.json` (24 cloze items) | `17e399970ff7382e09e6e09ca0b67ad3a482c116` |
| `docs/agents/gerunds-infinitives-spec.md` | `0148c14881ae0518647929e15ee224d839f4a7ff` |

Also read as the standard being applied, not audited:
`docs/agents/curriculum-author.md`, `docs/CONTENT_GUIDE.md`, and
`docs/agents/drafts/closest-meaning/lessons.json` (the guarded,
defect-first, catch-all-last `decision` block this audit holds every
other `decision` block to).

**Nothing was edited.** Every replacement wording below is a proposal for
the session that applies the repairs. If `lessons.json` no longer hashes
to the blob above, re-derive the traces before applying anything.

## How the checklist was run

Each option is placed in the blank; the lesson's closing `decision` block
is then run top-to-bottom over the resulting sentence. The first rule
whose condition is satisfied yields a verdict (a form or a verb), and the
option is **certified** if it matches that verdict, **rejected** if it does
not, **no verdict** if no rule fires.

- **Blocking** — a rule rejects a KEY, or a rule certifies a DISTRACTOR.
- **Incomplete** — a rule fires on nothing, or an option gets no verdict.
- Also recorded: any fact a key turns on that no block of that lesson states.

---

# Part 1 · The three findings from the item review

## Finding 1 — lesson 6 hands the studying learner the wrong answer on t24

**Confirmed, and it is the worst single defect in the draft.** Lesson 6's
`decision` rule 1 (`'used to'nun önünde am / is / are / was / were varsa`
→ `be used to + V-ing`) fires on t24's key `was used to open` and rejects
it, while certifying the distractor `was used to opening`.

Lesson 6 contains no `text`, `contrast`, `forms`, `examples` or `pitfall`
block mentioning the passive of *use*, the `by`-agent test, or the fact
that an inanimate subject cannot be accustomed to anything. The spec
(§6, M35) says t24 "is the strongest item in the category" precisely
because "the lesson has to say that the rule holds only when `used` means
*accustomed*" — the lesson says the opposite.

## Finding 2 — lesson 5 teaches the unkeyable half and not the keyed half

**Confirmed, with one correction.** `for + -ing` is taught as an object's
function in the `contrast` (side 2), the `forms` block
(`N + is for + V-ing`), `examples` item 2 and `pitfall` 3. The
preposition-governed use appears **once**, in `examples` item 4's note
(`He apologised for arriving so late.` / "Fiilin edatı 'for' → for +
V-ing"). It appears in no `contrast`, no `forms` row, no `pitfall` and no
`decision` rule. The noun-governed case that t20 keys (`an apology for`)
appears **nowhere at all**.

`decision` rule 1 fires on t18 and yields `to V`, rejecting the key
`for blocking` and certifying both `to block` and `in order to block`.

Note also that the distinction the lesson is built on is the one the spec
marks unkeyable ("purpose of an object … absent, deliberately —
unkeyable"), so the lesson's centre of gravity sits on the one thing the
exam cannot ask.

## Finding 3 — the five example collisions

**Confirmed, all five, and one is worse than reported.**

- **Lesson 4 / t15.** `look forward to` appears four times: `forms` row 6
  example (`We look forward to hearing from you.`), the pitfall pair,
  `examples` item 5 (`We are looking forward to seeing the results.`) and
  the `decision` chip. `examples` item 5 is the near-verbatim key of t15
  (`looking forward to seeing`), which makes it the collision to fix
  rather than the pitfall.
- **Lesson 2 / t8.** `forms` row 8's example is `We regret to inform
  you.` — t8's frame is `"We ____ you that…"`, so the row is the item's
  blank already filled.
- **Lesson 1 / t1.** The `contrast` prints both t1's key (`She avoids
  driving at night.`) and t1's meaning distractor (`She refuses to drive
  at night.`) in the same frame.
- **Lesson 3 / t9.** The `contrast` example and t9 are the same teacher
  drilling the same class.
- **Lesson 6 / t22, t23.** `forms` rows 4/6/7 (`working nights`) and
  `pitfall` 3 (noise, "after a month") are t22's and t23's scenarios.

One distinction decides which collisions need fixing: reproducing an
item's **sentence or scenario** is a leak; teaching the **rule** the item
tests is the lesson working. Lesson 1's three `suggest` blocks are the
second kind (t3 is a pure form item on a different scenario) and no change
is proposed for them.

---

# Part 2 · The full audit, category by category

## 1 · `Verb + Gerund vs Verb + Infinitive`

Rules as written: **R1** enjoy/avoid/mind/suggest/consider/deny/postpone/risk
→ `V-ing`; **R2** finish/give up/quit/keep/imagine/can't stand → `V-ing`;
**R3** decide/plan/hope/expect/agree/promise/refuse/offer → `to V`;
**R4** manage/fail/afford/learn/pretend/seem → `to V`; **R5** not in the
lists + liking/avoiding/continuing (last-resort guess) → `V-ing`;
**R6** not in the lists + decision/intention/promise (last-resort guess)
→ `to V`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t1 avoids to drive | R1 | `V-ing` → rejected | ✓ |
| t1 **avoids driving** (KEY) | R1 | `V-ing` → certified | ✓ |
| t1 refuses to drive | R3 | `to V` → **certified** | ✗ distractor certified |
| t1 refuses driving | R3 | `to V` → rejected | ✓ |
| t2 managed repairing | R4 | `to V` → rejected | ✓ |
| t2 enjoyed repairing | R1 | `V-ing` → **certified** | ✗ distractor certified |
| t2 **managed to repair** (KEY) | R4 | `to V` → certified | ✓ |
| t2 enjoyed to repair | R1 | `V-ing` → rejected | ✓ |
| t3 suggested to move | R1 | `V-ing` → rejected | ✓ |
| t3 suggested them to move | R1 | `V-ing` → rejected | ✓ |
| t3 suggested to moving | R1 | `V-ing` → rejected | ✓ |
| t3 **suggested moving** (KEY) | R1 | `V-ing` → certified | ✓ |
| t4 **refused to pay** (KEY) | R3 | `to V` → certified | ✓ |
| t4 refused paying | R3 | `to V` → rejected | ✓ |
| t4 admitted paying | none | **no verdict** | ✗ incomplete |
| t4 admitted to pay | none | **no verdict** | ✗ incomplete |

**Rules firing on nothing:** R2, R5, R6. Legitimate for a memory-list
category — the spec's coverage ledger explicitly asks the lesson to teach
past the four verbs the questions happen to use.

**Facts a key turns on that no block states:** `admit` appears in no block
of lesson 1, so two of t4's four options cannot be eliminated by anything
the learner has read. The three meaning distinctions the items turn on
(`avoid` = a quiet habit vs `refuse` = a declared refusal; `manage` =
difficulty overcome vs `enjoy`; `refuse` vs `admit`) are stated nowhere —
the `contrast` glosses instead supply a *semantic rationale for the form*,
which the lesson's own opening `text` and `pitfall` 2 deny.

**Trap check (the memory-list trap).** The last-resort rules are guarded
(`Fiil listelerde yoksa`), so they cannot fire on a verb the lists already
cover. R6 is still unreliable for the proposal family — `recommend`,
`propose`, `contemplate`, `anticipate`, `dread` all take `-ing` while
looking forward — which is M5, the misconception t3 exists to punish.

### Fixes

1. `contrast` examples (t1 collision) — one scene, one variable, neither
   verb keyed anywhere in the topic:
   - side `Verb + V-ing` example → `"He postponed calling."`
   - side `Verb + to V` example → `"He promised to call."`
2. Add `"admit"` to R1's `signals`, and add one `forms` row:

```json
{ "form": "Verb + V-ing", "use": "İtiraf, inkâr", "pattern": "admit / deny + V-ing", "example": "He admitted taking it." }
```

3. Replace R6's `condition` with:

> `"Fiil yukarıdaki listelerin hiçbirinde yoksa ve bir karar, bir söz ya da bir ret bildiriyorsa (decide, promise, refuse ailesi; son çare tahmin). Bir **öneri** bildiriyorsa bu kural işlemez: suggest, recommend, propose ileriye baksa da -ing alır."`

4. Add as the **last** rule of the block:

```json
{ "condition": "Yukarıdaki kurallar şıkları tek bir tanesine indirmediyse ve elde iki farklı fiilin doğru biçimi kaldıysa, soru artık biçim sorusu değildir: paragrafın anlattığı olay hangi fiili gerektiriyorsa o. Sessiz bir alışkanlıkla ilan edilmiş bir tavır (avoid / refuse), zorlukla başarmakla keyif almak (manage / enjoy), reddetmekle kabul etmek (refuse / admit) aynı şey değildir.", "then": "Context, not form" }
```

**Verdict: SHIPS WITH THE LISTED FIXES.** No key is rejected and every key
rests on taught material.

---

## 2 · `Both, With a Meaning Change: Remember / Stop / Try / Regret`

Rules as written: **R1** the second event really happened / is happening
→ `V-ing`; **R2** the second event was not realised → `to V`; **R3** `stop`
+ the answer to "what did it stop for?" → `to V`; **R4** `try` + a method
offered → `V-ing`; **R5** `try` + a difficult attempt → `to V`;
**R6** chips `regret to inform you / regret to say / regret to tell you`
→ `to V`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t5 remembered to leave | R1 | `V-ing` → rejected | ✓ |
| t5 **remembered leaving** (KEY) | R1 | `V-ing` → certified | ✓ |
| t5 regretted leaving | R1 | `V-ing` → **certified** | ✗ |
| t5 tried leaving | R1 | `V-ing` → **certified** | ✗ |
| t6 stopped filling | R1 (they did fill them) | `V-ing` → **certified** | ✗ |
| t6 tried to fill | R1 | `V-ing` → rejected | ✓ right outcome, wrong reason |
| t6 **stopped to fill** (KEY) | R1 | `V-ing` → **key rejected** | ✗✗ |
| t6 tried filling | R1 | `V-ing` → **certified** | ✗ |
| t7 tried to use | R1 | `V-ing` → rejected | ✓ |
| t7 stopped using | R1 | `V-ing` → **certified** | ✗ |
| t7 **tried using** (KEY) | R1 | `V-ing` → certified | ✓ |
| t7 stopped to use | R1 | `V-ing` → rejected | ✓ |
| t8 regret informing | R1 (the informing is happening) | `V-ing` → **certified** | ✗ |
| t8 remember to inform | R1 | `V-ing` → rejected | ✓ |
| t8 **regret to inform** (KEY) | R1 | `V-ing` → **key rejected** | ✗✗ |
| t8 remember informing | R1 | `V-ing` → **certified** | ✗ |

**Rules firing on nothing:** R3, R4, R5 and R6 never fire on any of the
sixteen options — R1 pre-empts all four.

**The claim is false, not merely mis-ordered.** With `stop + to V` and
with `regret to inform`, the second action normally *does* happen — the
lesson's own example `On the way home she stopped to post a parcel.`
posts the parcel. "Did it happen?" is not the discriminator; "where does
it sit relative to the moment of the main verb?" is, which is what the
lesson's `summary` already says and what the rules abandon. This is the
category's trap: the rules were tested against what their own examples
settle rather than against what the paragraphs settle.

### Fixes

1. `contrast` heading → `"Tek soru: ana fiil anına göre ikinci eylem nerede?"`;
   glosses replaced with:

> side 1 (`Verb + V-ing`): `"İkinci eylem ana fiilden **önce** başlamıştır: ya çoktan olup bitmiştir, ya o sırada sürmektedir, ya da denenmek için gerçekten uygulanmıştır. Ana fiil ona geriye bakar."`

> side 2 (`Verb + to V`): `"İkinci eylem ana fiilden **sonra** gelir: ana fiil onun için yapılır ya da onu haber verir. O anda henüz başlamamıştır; sonradan gerçekleşmiş olması bunu değiştirmez."`

   (Examples unchanged — they are already one scene, one variable.)

2. `forms` row 8 example (t8 collision) → `"We regret to announce a delay."`
   Keep `regret to inform you` in the `decision` chips: the formula is the
   transferable teaching, the *sentence* is the leak.

3. Replace the `decision` rules entirely — verb-specific first, general
   last and guarded:

```json
[
 { "signals": ["regret to inform you", "regret to say", "regret to tell you", "regret to announce"], "then": "to V" },
 { "condition": "**stop**'tan sonra gelen eylem, durmadan önce sürmüyorduysa — duruşun sebebi, yani \"ne için durdu?\" sorusunun cevabıysa — o eylemin arkasından gerçekleşmiş olması hiçbir şeyi değiştirmez", "then": "to V" },
 { "condition": "**stop**'tan sonra gelen eylem durmadan önce zaten sürüyorduysa ve sona eriyorsa", "then": "V-ing" },
 { "condition": "**try**'dan sonra gelen şey, bir sorunu çözmek için gerçekten uygulanan bir yöntemse: zor değildir, uygulanır ve sonucuna bakılır", "then": "V-ing" },
 { "condition": "**try**'dan sonra gelen şey zor bir işi başarma çabasıysa ve başarıldığı söylenmiyorsa; devamında çoğu zaman \"but\" gelir", "then": "to V" },
 { "condition": "**remember** ya da **regret**'ten sonra gelen eylem, hatırlama ya da pişmanlık anından önce yapılmışsa", "then": "V-ing" },
 { "condition": "**remember**'dan sonra gelen eylem henüz yapılmamış, yapılması hatırlatılan bir işse", "then": "to V" },
 { "condition": "Yukarıdaki kurallar birden fazla şıkkı ayakta bıraktıysa, geriye kalan soru biçim değil fiil sorusudur: paragraf bir hatırlamadan mı, bir pişmanlıktan mı, bir duruştan mı, yoksa bir denemeden mi söz ediyor?", "then": "Context, not form" }
]
```

Re-run of the replacement block: t5 rule 6 → `remembered leaving`
certified, `remembered to leave` rejected, the two other verbs handed to
the closing rule; t6 rule 2 → `stopped to fill` certified, `stopped
filling` rejected, the `try` options handed to the closing rule; t7 rule 4
→ `tried using` certified, `tried to use` rejected, the `stop` options
handed to the closing rule; t8 rule 1 → `regret to inform` certified,
`regret informing` rejected, the `remember` options handed to the closing
rule. Every key certified; no distractor left silently standing.

**Verdict: DOES NOT SHIP.** Two keys are rejected by rule 1, and the
repair rewrites a claim about English in the lesson's highest-value block.
Per the project's own rule, that rewrite needs its own review before it
ships.

---

## 3 · `Causative Verb Patterns: Make / Let / Have / Get`

Rules as written: **R1** a bare infinitive after the object →
`make / let / have`; **R2** a to-infinitive after the object → `get`;
**R3** a past participle after the object → `have / get`; **R4**
compulsion → `make`; **R5** permission → `let`; **R6** someone already
expected to do the job → `have`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t9 made us to read | R2 | `get` → rejected | ✓ |
| t9 got us read | R1 | `make/let/have` → rejected | ✓ |
| t9 **made us read** (KEY) | R1 | candidate; sole survivor | ✓ |
| t9 had us to read | R2 | `get` → rejected | ✓ |
| t10 got him go | R1 | `make/let/have` → rejected | ✓ |
| t10 **got him to go** (KEY) | R2 | `get` → certified | ✓ |
| t10 made him to go | R2 | `get` → rejected | ✓ |
| t10 let him go | R1 | candidate; R4/R5/R6 all silent | ✗ **no rule ever rejects it** |
| t11 had them reprint | R1 (unguarded on animacy) | `make/let/have` → **certified** | ✗ M16 |
| t11 had reprinted them | none | **no verdict** | ✗ M15 |
| t11 made them reprint | R1 | `make/let/have` → **certified** | ✗ |
| t11 **had them reprinted** (KEY) | R3 | `have/get` → certified | ✓ |
| t12 **let him drive** (KEY) | R1 → R5 | `let` → certified | ✓ |
| t12 let him to drive | R2 | `get` → rejected | ✓ |
| t12 made him drive | R5 | `let` → rejected | ✓ |
| t12 had him to drive | R2 | `get` → rejected | ✓ |

**Rules firing on nothing:** R6 — consistent with the spec, which records
`have + person + bare infinitive` as keyed nowhere.

**Structural gaps.** There is no rule at all for `get` = persuasion: R2
reaches `get` only from an observed `to`-infinitive, so a learner
reasoning from meaning can never arrive at it, which is why `let him go`
survives on t10. R1 is unguarded on animacy even though the second
`contrast` block teaches the person/thing split, so the block contradicts
the lesson two screens above it — on the category's rule-punisher. The
heading `"Boşluktan sonrasına bak"` names a place that in all four items
contains no complement: the object and the verb are inside the option.

**Facts a key turns on that no block states:** none. All four patterns are
taught in the two `contrast` blocks and the `forms` block; the failure is
confined to the `decision` block.

### Fixes

1. Heading → `"Şıkkı oku: nesneden sonra ne geliyor?"`
2. R1 `condition` →

> `"Şıkta nesneden sonra 'to'suz yalın fiil varsa **ve nesne bir kişiyse** (made us read, let him drive, had the plumber check), üç aday kalır"`

3. Insert immediately after R1:

```json
{ "condition": "Şıkta nesne bir **eşya** ve ardından yalın fiil geliyorsa (had them reprint): bir eşya işi kendisi yapamaz, bu şık elenir", "then": "have + O + V3" }
```

4. Insert immediately after R3:

```json
{ "condition": "Şıkta fiilin üçüncü hâli nesneden **önce** yazılmışsa (had reprinted them), kalıbın sırası bozulmuştur; bu yapıda nesne her zaman fiilden önce gelir", "then": "have + O + V3" }
```

5. Insert after R5:

```json
{ "condition": "Direnen ya da isteksiz biri ikna, rica ya da uzun bir uğraşla razı edilmişse", "then": "get" }
```

6. `contrast` examples (t9 collision), one scene across the three sides:
   `"They made him wait."` / `"They let him wait."` / `"They got him to wait."`

**Verdict: SHIPS WITH THE LISTED FIXES.** No key is rejected; every key
rests on material the `contrast` and `forms` blocks already teach.

---

## 4 · `Adjective + Infinitive vs Preposition + Gerund`

Rules as written: **R1** a preposition immediately left → `V-ing`;
**R2** an adjective immediately left, no preposition → `to V`; **R3** chips
`look forward to / object to / in addition to / committed to` → `V-ing`;
**R4** chips `easy / difficult / hard / ready / willing / likely / able`
→ `to V`; **R5** the "it" test → `V-ing`; **R6** an adjective with a
written preposition → `V-ing`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t13 eager to hand | R2 | `to V` → **certified** | ✗ meaning distractor |
| t13 reluctant of handing | R1 | `V-ing` → **certified** | ✗ |
| t13 **reluctant to hand** (KEY) | R2 | `to V` → certified | ✓ |
| t13 eager for handing | R1 | `V-ing` → **certified** | ✗ |
| t14 capable to sing | R2 | `to V` → **certified** | ✗✗ M22, the item's own trap |
| t14 **capable of singing** (KEY) | R1 | `V-ing` → certified | ✓ |
| t14 able of singing | R1 | `V-ing` → **certified** | ✗ R4 would reject it; R1 fires first |
| t14 capable of sing | R1 | `V-ing` → rejected | ✓ |
| t15 looking forward to see | R3 | `V-ing` → rejected | ✓ |
| t15 looking forward seeing | none | **no verdict** | ✗ |
| t15 **looking forward to seeing** (KEY) | R3 | `V-ing` → certified | ✓ but see hazard below |
| t15 looking forward for seeing | R1 | `V-ing` → **certified** | ✗ |
| t16 slow to point | R2 | `to V` → **certified** | ✗ meaning distractor |
| t16 quick at pointing | R1 | `V-ing` → **certified** | ✗ |
| t16 **quick to point** (KEY) | R2 | `to V` → certified | ✓ |
| t16 slow at pointing | R1 | `V-ing` → **certified** | ✗ |

Seven distractors certified and one option left with no verdict — the
worst table in the topic.

**Hazard on the key of t15.** R2 fires on "an adjective immediately to the
left". A learner who parses `forward` as an adjective reaches R2 before
R3 and gets `to V`, which rejects the key. The key survives only if R3 is
reached first.

**Two causes.** R1/R2 are anchored to "immediately to the left of the
blank", which in all four items is `was` — the adjective and the
preposition are inside the option. And R1 fires on *any* preposition, so
it certifies every invented pairing (`reluctant of`, `eager for`, `quick
at`, `slow at`, `able of`, `looking forward for`): the block cannot tell a
welded preposition from a wrong one.

**Facts a key turns on that no block states — the sufficiency failure of
this category.** `capable`, `reluctant`, `quick`, `slow` and `eager`
appear in **no block of lesson 4**. R4's chip list is the lesson's only
closed list of infinitive-only adjectives and contains none of them.
Choosing between `reluctant to hand` and `reluctant of handing` requires
knowing that `reluctant` carries no preposition; between `capable of
singing` and `capable to sing`, that `capable` carries `of`. Three of the
four keys rest on adjective-specific knowledge the lesson does not supply.

### Fixes

1. Two `forms` rows:

```json
{ "form": "Adjective + to V", "use": "İsteklilik, hız", "pattern": "eager / reluctant / quick / slow + to V", "example": "She was reluctant to answer." }
{ "form": "Adjective + preposition + V-ing", "use": "Edatı sabit olan sıfatlar", "pattern": "capable of / responsible for / tired of + V-ing", "example": "He is capable of finishing it." }
```

2. One `pitfall` (M22, the trap t14 keys):

```json
{ "type": "pitfall",
  "wrong": "She is capable to finish it alone.",
  "right": "She is capable of finishing it alone.",
  "why": "**able** ile **capable** aynı anlama gelir ama biçimleri farklıdır: 'able to do' der, 'capable of doing' der. Sıfatın kendi edatı varsa kararı sıfat değil o edat verir." }
```

3. Collisions (t15): `forms` row 6 example → `"They objected to paying in
   advance."`; `examples` item 5 →

```json
{ "sentence": "He is committed to finishing on time.", "note": "Buradaki 'to' mastar değil edat → to + V-ing" }
```

   Keep the pitfall and the `decision` chip — that leaves the pattern
   taught once and removes the key string.

4. Replace the `decision` block, heading
   `"Şıkkı boşluğa koy, sonra fiilin soluna bak"`:

```json
[
 { "signals": ["capable of", "afraid of", "tired of", "interested in", "good at", "responsible for", "insist on", "succeed in"], "then": "V-ing" },
 { "condition": "Şıktaki sıfat **capable, afraid, interested, good, responsible, tired** gibi kendi edatını taşıyan bir sıfatsa, o sıfat edatsız kurulamaz: 'capable to sing' diye bir biçim yoktur", "then": "V-ing" },
 { "signals": ["look forward to", "object to", "committed to", "in addition to", "be used to"], "then": "V-ing" },
 { "signals": ["able", "ready", "willing", "likely", "easy", "difficult", "hard", "eager", "reluctant", "quick", "slow"], "then": "to V" },
 { "condition": "Kalıbın ya da sıfatın edatı değiştirilmiş, düşürülmüş ya da olmayan bir edat eklenmişse (reluctant of, quick at, eager for, look forward for, look forward ___), şık biçim olarak yanlıştır: bir sıfatın edatı ya vardır ya yoktur, değiştirilemez", "then": "to V" },
 { "condition": "Fiilin hemen solunda o fiile ait bir edat varsa (of, in, at, about, for, on, without, by); sıfat varsa ve araya edat girmiyorsa mastar gelir", "then": "V-ing" },
 { "condition": "'to' edat mı mastar mı belli değilse arkasına \"it\" koy: \"look forward to it\" oluyorsa edattır. Edattan sonra ne yalın fiil (capable of sing) ne de mastar (interested in to learn) gelir", "then": "V-ing" },
 { "condition": "Kurallar birden fazla şıkkı ayakta bıraktıysa, geriye kalan soru biçim değil sıfat sorusudur: paragraf hangi sıfatı gerektiriyor — istekli mi isteksiz mi, hızlı mı yavaş mı?", "then": "Context, not form" }
]
```

**Rule order matters:** the `capable` condition must precede the `able`
chip, because a chip-scanning learner finds "able" inside "capable".

**Verdict: DOES NOT SHIP.** Three of four keys rest on adjectives no block
names, and the block certifies M22 outright. The fix adds new teaching, so
it needs a re-review.

---

## 5 · `Infinitive of Purpose vs For + Gerund`

Rules as written: **R1** a person's reason for an action → `to V`;
**R2** an object's function → `for + V-ing`; **R3** `for` written before
the blank → `for + V-ing`; **R4** a negative purpose →
`so as not to / in order not to + V`; **R5** a noun after the purpose →
`for + noun`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t17 for putting | R1 | `to V` → rejected | ✓ |
| t17 **to put** (KEY) | R1 | `to V` → certified | ✓ |
| t17 for to put | R1 | `to V` → rejected | ✓ |
| t17 to putting | R1 | `to V` → rejected | ✓ |
| t18 to block | R1 | `to V` → **certified** | ✗ M29 |
| t18 **for blocking** (KEY) | R1 | `to V` → **key rejected** | ✗✗ |
| t18 in order to block | R1 | `to V` → **certified** | ✗ M30 |
| t18 for to block | R1 | `to V` → rejected | ✓ |
| t19 **to read** (KEY) | R1 | `to V` → certified | ✓ |
| t19 for reading | R1 | `to V` → rejected | ✓ |
| t19 to reading | R1 | `to V` → rejected | ✓ |
| t19 for to read | R1 | `to V` → rejected | ✓ |
| t20 for to flatten | R1 (read as a reason) | `to V` → rejected | ✓ |
| t20 to flatten | R1 | `to V` → **certified** | ✗ |
| t20 **for flattening** (KEY) | R1 | `to V` → **key rejected** | ✗✗ |
| t20 for flatten | none | **no verdict** | ✗ M27 |

On the narrow reading of R1 — the council's *purpose* was not to block the
footway — nothing fires on t18 or t20 at all and all eight of those
options get no verdict. Either way **the checklist never produces either
of the category's two `for + -ing` keys.**

**Rules firing on nothing:** R2 and R3 fire on nothing across all sixteen
options, and R2 can never fire on any keyable item — the spec marks
object-purpose unkeyable because both forms are correct there. R3's
trigger ("a `for` written immediately before the blank") never occurs,
because in every item the `for` is inside the option. R4 fires on nothing,
which is fine as teaching.

**Facts a key turns on that no block states:** the verb-governed `for`
(`fine … for`) appears only in one `examples` note; the noun-governed
`for` (`an apology for`) appears nowhere. Both keys of the category rest
on them.

### Fixes

1. `summary` → `"Amaç mı bildiriliyor, yoksa bir gerekçe mi?"`
2. `contrast` heading → `"Amaç mı, gerekçe mi?"`; side 1 example →
   `"She rang to explain."`; side 2 gloss →

> `"Bir eylemin **gerekçesini** verir ve bu 'for' bir öncekine aittir: onu isteyen fiil ya da isim cümlede yazılıdır (fine ... for, thank ... for, an apology for). Burada amaç değil, sebep vardır."`

   side 2 example → `"She was thanked for helping."`

3. `forms`: keep the object-function row, add two:

```json
{ "form": "verb + for + V-ing", "use": "Fiilin gerekçesi", "pattern": "thank / blame / fine + O + for + V-ing", "example": "They thanked her for waiting." }
{ "form": "noun + for + V-ing", "use": "İsmin gerekçesi", "pattern": "an apology / a reason / an excuse + for + V-ing", "example": "There is no excuse for lying." }
```

4. `examples`: add one item (six items, at the cap):

```json
{ "sentence": "She was blamed for missing the deadline.", "note": "Gerekçeyi 'blame' fiili istiyor → for + V-ing" }
```

5. Re-point `pitfall` 3 from the object-function use onto a governed
   `for`, so M27 is taught where it is keyed:

```json
{ "type": "pitfall",
  "wrong": "They thanked him for wait.",
  "right": "They thanked him for waiting.",
  "why": "'for' bir edattır ve edattan sonra fiil daima -ing alır; yalın fiil hiçbir zaman gelmez." }
```

6. Replace the `decision` block, heading `"Önce sor: amaç mı, gerekçe mi?"`:

```json
[
 { "signals": ["fine ... for", "thank ... for", "blame ... for", "apologise for", "an apology for", "a reason for", "an excuse for"], "then": "for + V-ing" },
 { "condition": "Boşluktan önceki fiil ya da isim kendi edatı olarak 'for' istiyorsa (fined it ___, an apology ___), cümle amaç değil **gerekçe** kuruyordur; 'to + fiil' burada olayı tersine çevirir: ceza, kaldırım kapansın diye kesilmemiştir", "then": "for + V-ing" },
 { "condition": "Böyle bir fiil ya da isim yoksa ve anlatılan, bir kişinin eylemi hangi amaçla yaptığıysa", "then": "to V" },
 { "condition": "Amaç olumsuzsa (bir şey olmasın diye)", "then": "so as not to / in order not to + V" },
 { "condition": "Amacı bildiren şey bir eylem değil bir şeyse (a walk, the conference)", "then": "for + noun" },
 { "condition": "'for'dan sonra hiçbir zaman yalın fiil ya da 'to' gelmez (for flatten, for to flatten); 'to'dan sonra da -ing gelmez (to putting)", "then": "for + V-ing" }
]
```

**Rule 5 must be worded on what fills the purpose slot, not on what
follows the blank** — `for flattening **it**` would otherwise misfire on
t20, which is what the old R5 does.

**Verdict: DOES NOT SHIP.** Both `for + -ing` keys rest on a structure the
lesson states once, in an `examples` note, and never in a rule; the
noun-governed case is absent entirely; rule 1 rejects a key.

---

## 6 · `Used To vs Be Used To vs Get Used To`

Rules as written: **R1** `be` before `used to` → `be used to + V-ing`;
**R2** `get` before `used to` → `get used to + V-ing`; **R3** "used to but
not now" → `used to + V`; **R4** "normal for me now" → `be used to +
V-ing`; **R5** "gradually / finally got used to" → `get used to + V-ing`;
**R6** negative or question → `use to + V`.

| Option | First rule to fire | Verdict | Correct? |
|---|---|---|---|
| t21 was used to being | R1 | `be used to + V-ing` → **certified** | ✗ |
| t21 **used to be** (KEY) | R3 | `used to + V` → certified | ✓ |
| t21 got used to being | R2 | `get used to + V-ing` → **certified** | ✗ |
| t21 is used to being | R1 | `be used to + V-ing` → **certified** | ✗ |
| t22 is used to sleep | R1 | `be used to + V-ing` → rejected | ✓ |
| t22 used to sleep | R4 | `be used to + V-ing` → rejected | ✓ |
| t22 **is used to sleeping** (KEY) | R1 | certified | ✓ |
| t22 gets used to sleeping | R2 | `get used to + V-ing` → **certified** | ✗ |
| t23 got used to hear | R2 | `get used to + V-ing` → rejected | ✓ |
| t23 was used to hearing | R1 | `be used to + V-ing` → **certified** | ✗ |
| t23 **got used to hearing** (KEY) | R2 | certified | ✓ |
| t23 used to hear | R5 | `get used to + V-ing` → rejected | ✓ |
| t24 was used to opening | R1 | `be used to + V-ing` → **certified** | ✗ |
| t24 used to open | R3 | `used to + V` → **certified** | ✗ |
| t24 **was used to open** (KEY) | R1 | `be used to + V-ing` → **key rejected** | ✗✗ |
| t24 got used to opening | R2 | `get used to + V-ing` → **certified** | ✗ |

**R1 and R2 are circular for every item in this category.** They test
whether the option contains `be` or `get` — and the option is what the
learner is choosing. They therefore certify whichever option already has
the shape they name, and they pre-empt R3–R5, which are the only rules
that read the paragraph.

**Rules firing on nothing:** R6 — deliberate per the spec, which excludes
`didn't use to` from the keyed material.

**Facts a key turns on that no block states:** the passive of *use*; the
`by`-agent as the test that selects it; and the fact that existential
`there` cannot be accustomed to anything. t24's key rests on the first
two, t21's on the third.

### Fixes

1. `forms`, two rows:

```json
{ "form": "be used to + V", "use": "Alışkanlık değil: 'kullanılmak'", "pattern": "S + was/is + used + to + V", "example": "This room was used to store files." }
{ "form": "be used to + noun", "use": "Alışkınlık, isimle", "pattern": "S + am/is/are + used to + N", "example": "He is used to the cold." }
```

2. Replace `pitfall` 2 (`didn't used to` — a live spelling dispute the
   spec explicitly refuses to key) with the passive:

```json
{ "type": "pitfall",
  "wrong": "The back room was used to storing the files.",
  "right": "The back room was used to store the files.",
  "why": "Burada **used** 'alışkın' değil, **use** fiilinin edilgenidir: oda dosya saklamak için kullanılıyordu. Bir eşya hiçbir şeye alışamaz; öznesi eşya olan ya da içinde **by ...** geçen cümlelerde kalıp 'be used to + yalın fiil'dir." }
```

3. Collisions: `forms` rows 4/5/6/7 examples → one abstract scene,
   `"She is used to waiting."` / `"She isn't used to waiting."` /
   `"He got used to waiting."` / `"He can't get used to waiting."`;
   `examples` item 4 → `"It took her a while to get used to the silence."`;
   `pitfall` 3 → wrong `"At first the room was cold, but I was used to it."`,
   right `"At first the room was cold, but I got used to it."`

4. Replace the `decision` block, heading
   `"Önce 'used'ın anlamına, sonra önündeki fiile bak"`:

```json
[
 { "condition": "Cümlede **by ...** öbeği varsa ya da özne bir eşyaysa ve o eşyaya bir iş yapılıyorsa: buradaki **used** 'alışkın' değil, 'kullanılmak'tır", "then": "be used to + V" },
 { "condition": "Cümle **There ___** ile kuruluyorsa: 'there' bir kişi değildir, hiçbir şeye alışamaz; geriye yalnızca geçmiş durum kalır", "then": "used to + V" },
 { "signals": ["little by little", "gradually", "slowly", "after a while", "by the third month"], "then": "get used to + V-ing" },
 { "condition": "Alışma bir **değişim** olarak anlatılıyorsa (önce zordu, sonra alıştı)", "then": "get used to + V-ing" },
 { "condition": "Durum yerleşmişse ve bir değişimden değil, kişiye artık normal gelen bir şeyden söz ediliyorsa", "then": "be used to + V-ing" },
 { "condition": "Anlam \"eskiden böyleydi, artık değil\" ise ve şimdiki durumun sürdüğünü söyleyen bir cümle yoksa", "then": "used to + V" },
 { "condition": "Karar verdikten sonra şıkkı denetle: 'be/get used to' **alışkınlık** anlamındaysa ardından yalın fiil değil -ing (ya da isim) gelir; 'used to' tek başınaysa ardında her zaman yalın fiil vardır", "then": "V-ing" },
 { "condition": "Geçmiş alışkanlık olumsuz ya da soru cümlesindeyse (didn't, did ... ?)", "then": "use to + V" }
]
```

Re-run of the replacement block over all sixteen options:

- **t21** rule 2 fires (`There`) → `used to be` certified; `was used to
  being`, `is used to being`, `got used to being` all rejected.
- **t22** rules 1–4 silent, rule 5 fires (a settled state) → `is used to
  sleeping` certified; `gets used to sleeping` and `used to sleep`
  rejected; `is used to sleep` rejected by rule 7.
- **t23** rule 3 fires (`Little by little`) → `got used to hearing`
  certified; `was used to hearing` and `used to hear` rejected; `got used
  to hear` rejected by rule 7.
- **t24** rule 1 fires (`by whichever assistant opened up`) → `was used to
  open` certified; `was used to opening`, `used to open` and `got used to
  opening` all rejected.

All four items fully decided, correctly, with no distractor left standing.

**Verdict: DOES NOT SHIP.** A key is rejected by the first rule, all four
items certify at least one distractor, and three facts that two keys turn
on are taught nowhere. The fix is specified above but adds new teaching,
so it needs a re-review.

---

# Part 3 · Summary and the three cross-cutting causes

| Category | Keys rejected | Distractors certified | No verdict | Verdict |
|---|---|---|---|---|
| 1 · Verb + Gerund vs Infinitive | 0 | 2 | 2 | SHIPS WITH THE LISTED FIXES |
| 2 · Both, With a Meaning Change | 2 (t6, t8) | 5 | 0 | DOES NOT SHIP |
| 3 · Causative | 0 | 3 | 1 | SHIPS WITH THE LISTED FIXES |
| 4 · Adjective vs Preposition | 0 | 7 | 1 | DOES NOT SHIP |
| 5 · Purpose vs For + Gerund | 2 (t18, t20) | 3 | 1 | DOES NOT SHIP |
| 6 · Used To triad | 1 (t24) | 7 | 0 | DOES NOT SHIP |

## Cause 1 — the blank swallows the words the rule tells you to look at

Lessons 4, 5 and 6 write their rules for a stem that already contains the
adjective, the preposition or the `be`/`get`, and then key items where all
of that is inside the option. In lesson 6 this makes rules 1–2 circular;
in lesson 4 it makes rules 1–2 unrunnable as written and, run over the
option instead, indiscriminate; in lesson 5 it makes R3 unreachable.
Lesson 3 has the same defect in its heading only. Any rewrite should say
`Şıkkı boşluğa koy` first, then test.

## Cause 2 — the general rule comes before the specific one, unguarded

Lessons 2 and 6 both put a broad semantic rule at the top, so the
verb-specific and structure-specific rules below it never fire. The
`closest-meaning` lessons do the opposite — defect-specific rules first,
one guarded catch-all last (`Yukarıdaki kuralların hiçbiri
ateşlemediyse …`) — and every fix above adopts that order.

## Cause 3 — no rule for the lexical half

Twelve of the topic's twenty-four items make the learner choose a verb or
an adjective as well as a form, and only lesson 3 has any rule that reads
meaning. That is why so many distractors are certified: the block decides
the form correctly and then stops. The closing rule proposed for lessons
1, 2 and 4 is the same fix in three places:

```json
{ "condition": "…", "then": "Context, not form" }
```

with the category's own wording — lesson 1's naming the three verb pairs
(`avoid / refuse`, `manage / enjoy`, `refuse / admit`), lesson 2's naming
the four events (a recall, a regret, a stop, an experiment), lesson 4's
naming the adjective axis (willing / unwilling, quick / slow). `then` is
English, as the schema requires, and the guide permits a `then` that is
not a form name where the lesson's own subject is which word goes in the
gap.

## Two lower-priority notes, not blocking

- Lesson 5's `contrast` is built on the object-function distinction the
  spec marks unkeyable, so the lesson's centre teaches the one thing the
  exam cannot ask. The fix above moves it to a `forms` row.
- Lesson 6's `pitfall` 2 takes a side in the `didn't use to` /
  `didn't used to` dispute that the spec deliberately refuses to key,
  which is why the fix reuses that block for the passive.

## Schema headroom for the proposed fixes

Every proposed replacement stays within the schema. Block counts after the
additions: lesson 1 → 12, lesson 2 → 10, lesson 3 → 14, lesson 4 → 12,
lesson 5 → 10, lesson 6 → 11 (all within 6–14). `examples` stays at six
items or fewer; each `decision` rule carries exactly one of `signals` /
`condition`; every `then` is English; every replacement `pitfall` differs
from its `wrong` in exactly one place; every `contrast` keeps 2–3 sides
and every replacement gloss stays under the 200-character warning. All
replacement example sentences are single-clause and abstract and share no
scenario with any of the twenty-four question paragraphs.

Run `npm run format` and `npm run validate` after applying any of this,
and re-review the four categories marked DOES NOT SHIP once the new
teaching is written — three of the first six rewrites in this project
failed their re-review, one because the fix traded a defect for a worse
one.
