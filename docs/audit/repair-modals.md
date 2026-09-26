# Repair pass — `data/modals/modals.json`

2026-09-04. Scope: `data/modals/modals.json` only. Nothing else was opened
or edited — not `data/tenses/`, not `data/passive-voice/`, not
`data/manifest.json` (beyond what `npm run format` regenerates in its
lesson index), not `js/`, not the tools.

Inputs, worked in the order the brief set: `docs/audit/blind-oldest.md`
§2, `docs/audit/lessons-oldest.md` §0 and §2, `docs/audit/option-notes-5.md`.

**Result:** `npm run format && npm run check` — 0 errors. The lesson-giveaway
warnings for this file went from **13 to 0** (t4, t5, t6, t8, t14, t16, t17,
t19, t20, t21, t22, t23, t24 all cleared). The 14 warnings `validate` still
prints are all in `data/passive-voice/passive-voice.json`, another session's
file.

Eleven of the twenty-four questions changed; all six lessons changed. No
question was made easier and no explanation was weakened to let an item
survive: where an item could not be repaired without that, it was left alone
and is recorded in §6.

---

## 1. The two blocking items

### 1.1 `modals-t2` — *must* / *has to* both standard

**Was:** "According to the university's regulations, every student ____ submit
a health report before moving into the dormitory." — keyed `has to`, with
`must` on offer and defended only by *"sınavlarda 'have to' tercih edilir"*.

The brief's suggested shape was "a speaker reporting a rule imposed on them
from outside, with no written-regulation frame". **That alone does not fix
it.** A speaker reporting an external rule still says *must* freely — *"my
boss says I must be there at eight"* — so the source-of-obligation split is a
teaching heuristic and cannot be made to exclude `must` by context. What
excludes `must` absolutely is **past time**: `must` has no past form. That is
a hard fact, it is the lesson's own second `pitfall`, it has a row in the
lesson's `forms` block, and it is exam-rewarded.

So the rewrite keeps the brief's shape — the obligation is imposed on the
speaker by someone else, with no written regulation anywhere — and moves it
into the past, where only one form exists.

**Now:** "I had promised to meet friends at six, but the shift supervisor
rewrote the rota that morning without warning anyone, so I ____ stay at the
shop until closing time and missed them completely."
Options `["had to", "must", "didn't have to", "mustn't"]`, keyed `had to`.

Option-by-option, substituted into the paragraph:

| option | filled | would a competent teacher accept it? |
| --- | --- | --- |
| `had to` | *…so I had to stay at the shop until closing time and missed them completely.* | key |
| `must` | *…so I must stay at the shop…and missed them completely.* | **No.** The narrative is anchored in the past by `had promised`, `rewrote … that morning` and the coordinated `missed`. Deontic `must` has no past form and there is no reporting verb governing the clause that could licence it. |
| `didn't have to` | *…so I didn't have to stay…and missed them completely.* | **No.** It asserts there was no obligation, which the contrastive `but` and the coordinated `and missed them completely` both contradict — she missed her friends *because* she stayed. |
| `mustn't` | *…so I mustn't stay…and missed them completely.* | **No.** Prohibition, not obligation, and incoherent with `missed them completely`. On-category: `mustn't` vs the obligation forms is the lesson's own second contrast. |

`explanation`, `tip` and all three `optionNotes` were rewritten against the new
text. The explanation names `must` and `didn't have to` in their own words; the
appeal to exam convention is gone.

Deliberate consequence, recorded: the category no longer contains an item that
turns on *external vs internal* obligation with both `must` and `have to` on
offer. That test is exactly the one the blind reviewer showed cannot be made to
discriminate, so it is not a test that was lost — it never worked. `modals-t1`
still keys `must` on the internal side (*"nobody is forcing me, but I
promised"*), which is defensible because `have to` is genuinely odd there.

### 1.2 `modals-t18` — *should* and *ought to* both fine

**Was:** "You ____ finish that assignment tonight — if you hand it in late
again, the teacher said she won't accept it at all." — keyed `had better`,
with `should` and `ought to` both on offer and both fluent.

**The category cannot be separated by grammar in the direction that keys
`had better`.** Stated plainly, as the brief asks: `should` is available
wherever `had better` is. The implication only runs one way — `had better` is
bad for timeless or role-based advice, so a paragraph can exclude *it*
(`modals-t17` and `modals-t19` both do exactly that, and both survive), but no
paragraph can exclude `should` from a situation urgent enough for `had better`.
Adding urgency raises the pragmatic strength of the advice; it does not make
the ordinary advice modal wrong.

Two ways out: drop `should` and `ought to` and key it by elimination, or turn
the item on **form**. Keying by elimination is the defect `lessons-oldest.md`
§2.4 and §2.6 already record twice in this topic (an item answerable only
because its true rival was withheld), so it is not an improvement. Form is:
`had better` + bare infinitive, `ought` + `to`, and `had better not` for the
negative are three facts with no grey area, they are the half of this lesson
that transfers to a real paper, and per `lessons-oldest.md` §2.5 **all three of
the lesson's `pitfall` blocks were untested** — three pitfalls, zero springs.

**Now:** "The last ferry leaves in ten minutes and there is nothing after it
until the morning, so we ____ start walking down to the pier — otherwise we
will be sleeping in the car."
Options `["had better", "had better to", "had better not", "ought"]`, keyed
`had better`.

| option | filled | accept? |
| --- | --- | --- |
| `had better` | *…so we had better start walking down to the pier…* | key. The consequence is written in the sentence, so the pragmatics also point here. |
| `had better to` | *…so we had better to start walking…* | **No** — ungrammatical. Lesson `pitfall` 1, and the error this audience actually makes. |
| `had better not` | *…so we had better not start walking down to the pier — otherwise we will be sleeping in the car.* | **No.** Well-formed, so this is a meaning distractor, not a form one: it advises *against* walking, which the `otherwise` clause flatly contradicts. |
| `ought` | *…so we ought start walking…* | **No** — ungrammatical, `ought` requires `to`. Lesson `pitfall` 2, and the mirror of the `had better to` error, which the lesson itself points out. |

Three distinct failure modes: added `to`, reversed polarity, missing `to`.
`explanation`, `tip` and all three `optionNotes` rewritten. The trade this
makes is honest and is recorded in §6: the item is now decided at the blank
rather than by reading the paragraph. Within this category that is one item in
four (m17, m19 and m20 are all decided by meaning), which is inside
`docs/agents/reviewer.md`'s "fine once per category, fatal as a pattern".

---

## 2. The two decision blocks that contradicted their own lesson

Every `decision` block I touched was re-run afterwards as a literal ordered
checklist over **all four** items in its category. The traces are below; each
line records whether the rule fires, on what text, and whether the form it
names is an option on that item. I also re-traced the two blocks I did *not*
rewrite (`Modal Perfects`, and both blocks of `Can vs Could vs May vs Might`
after their signal chips changed), because items in those categories changed.

### 2.1 `Should vs Ought To vs Had Better`

The old rule 2 — *"Tavsiyeye uyulmazsa ne olacağı cümlede açıkça yazıyorsa
(ceza, kaçırılan tren, kabul edilmeyen ödev)"* → `Had better` — fired on
`modals-t20`, whose key is `shouldn't` and which does not offer `had better
not` at all; and the parenthetical's third item was `modals-t18`'s own
consequence (`lessons-oldest.md` §0.2). Meanwhile the `examples` block called
the same sentence *"bir uyarı değil"*.

The fix separates *warning* from *advice* on something a learner can actually
apply: **is the bad outcome certain and imminent, or a risk?** `had better`
needs the first; a risk written as a risk ("basically an invitation for someone
to break in") is the second. The item-derived parenthetical is gone.

New rules, in file order:

```
R1  signals: otherwise · or else · or you'll ... · before it's too late   → Had better
R2  cond: uyulmazsa doğacak kötü sonuç kesin ve yakın                     → Had better
R3  cond: risk ya da kötü alışkanlık var, sonuç kesin değil               → Shouldn't
R4  cond: rolden/konumdan doğan süregelen sorumluluk, resmî ton           → Ought to
R5  signals: in my opinion · I think · if you ask me                      → Should
R6  cond: aciliyet, tehdit ya da resmî sorumluluk yoksa (varsayılan)      → Should
```

Trace:

| item | R1 | R2 | R3 | R4 | R5 | R6 | decided | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t17 | no signal | no — *"nothing depends on it"* | no — positive advice, no risk | no | **fires** on *"in my opinion"* | — | Should | `should` | yes |
| t18 | **fires** on *"otherwise"* | — | — | — | — | — | Had better | `had better` | yes |
| t19 | no | no consequence | no | **fires** on *"As the eldest sibling … for the younger ones"* | — | — | Ought to | `ought to` | yes |
| t20 | no | no — *"basically an invitation"* is a risk, not a certainty | **fires** on *"an invitation for someone to break in"* + *"like that"* | — | — | — | Shouldn't | `shouldn't` | yes |

Four items, four rules, one rule each, and every named form is an option on the
item it decides. R6 fires on nothing — it is the stated default, not a signal.

The `examples` block sentence that contradicted rule 2 was also the `modals-t20`
giveaway; it was replaced (§3) and its `note` reworded to *"Riskli bir
alışkanlığa karşı olumsuz tavsiye → shouldn't"*, which is what the new rule 3
says.

### 2.2 `Must vs Have to vs Mustn't vs Don't Have to`

Two separate faults: the `forms` block modelled `must` with externally imposed
rules addressed to someone else (*"You must wear a helmet."*, *"You mustn't
park here."*) while the `contrast` said `must` is speaker-internal; and the
second `contrast` compounded it with an airline regulation.

Fixes:

- `contrast` 1 › Must `gloss` now scopes the claim: *"Bu ayrım yalnızca olumlu
  cümleler içindir."* That is the honest statement — the internal/external split
  is a fact about the positive only.
- `contrast` 2 › Mustn't `gloss` says so from the other side: *"Yasağı kimin
  koyduğu fark etmez; olumlu taraftaki içsel/dışsal ayrımı burada işlemez."*
- `forms` Must/Olumlu example: `You must wear a helmet.` → **`I must remember to
  renew my passport.`** (speaker-internal, matching the contrast).
- `forms` Must/Olumsuz example: `You mustn't park here.` → **`You mustn't lend
  this card to anyone.`** (a prohibition that is not institutional, and no
  longer a near-copy of the `examples` block's fire-exit sentence).
- `contrast` 2 › Mustn't example: `You mustn't use your phone during takeoff.`
  → **`You mustn't tell anyone what we discussed.`** This was the audit's
  "compounding" sentence and also a near-echo of `modals-t3`'s paragraph.
- `contrast` 2 › Don't have to example: `You don't have to bring a book — she'll
  provide copies.` → **`You don't have to dress up — it's a very casual
  place.`** (this was the `modals-t4` giveaway).

The `decision` block was rebuilt, because dropping the item-derived chip
`"we'll provide them"` (`lessons-oldest.md` §0.2 — it is `modals-t4`'s clue and
nothing else) would otherwise have left t4 undecided, and the new t2 needs a
tense guard that overrides the source-of-obligation rules.

```
R1  signals: forbidden · not allowed · prohibited · against the rules      → Mustn't
R2  signals: optional · there is no need · if you want to · it's up to you → Don't have to
R3  cond: bir bilgi işi yapma gereğini ortadan kaldırıyor                  → Don't have to
R4  cond: zorunluluk geçmişte kalmış — kim koymuş olursa olsun             → Had to
R5  signals: according to the regulations · the law · company policy · the rules say → Have to
R6  cond: zorunluluğu koyan konuşmacının kendisi                           → Must
```

Trace:

| item | R1 | R2 | R3 | R4 | R5 | R6 | decided | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t1 | no | no | no | no — the obligation is for *tonight* | no | **fires** on *"nobody is forcing me, but I promised"* | Must | `must` | yes |
| t2 | no | no | no | **fires** — *"had promised … rewrote that morning … missed them"* | (skipped) | — | Had to | `had to` | yes |
| t3 | **fires** on *"strictly forbidden"* | — | — | — | — | — | Mustn't | `mustn't` | yes |
| t4 | no | no | **fires** on *"she'll provide printed copies for everyone"* | — | — | — | Don't have to | `don't have to` | yes |

R4 is deliberately ordered **before** R5: on t2 the obligation *is* externally
imposed, so R5 would return `Have to`, which is not the option on offer —
`had to` is. R4's wording says outright that it overrides ("kim koymuş olursa
olsun").

R5 now fires on **no item in the set** (recorded in §6). It was kept because it
is a genuinely general and transferable cue, and because with t2 rewritten
`"according to the regulations"` is no longer lifted from a question — it is a
real English frame the paper uses.

### 2.3 `Must vs Can't vs Might/Could` (not on the brief's list; fixed because t12 changed)

`lessons-oldest.md` §2.7: rule 1 said nothing about which *direction* the
evidence points, so a learner running the list in order answers `must` on t10,
which is t10's closest distractor. Rules 1 and 2 now name the direction, and a
new rule 3 covers evidence that admits more than one reading — which is what
the rewritten t12 turns on.

```
R1  cond: kanıt söylenen şeyi doğruluyor ve başka açıklama bırakmıyor    → Must
R2  cond: kanıt söylenen şeyi çürütüyor; mantıken imkânsız               → Can't
R3  cond: aynı kanıt birden fazla açıklamaya izin veriyor / emin değil   → Might / Could
R4  signals: I'm not sure · I'm not expecting · perhaps · it's hard to say → Might / Could
R5  cond: yasak yoksa 'mustn't' şıkkını ele                              → Can't
R6  cond: 'should' beklenti bildirir, çıkarım değil                      → Must
```

Trace:

| item | R1 | R2 | R3 | decided | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- |
| t9 | **fires** — *"always this crowded"* confirms | — | — | Must | `must` | yes |
| t10 | no — the evidence *refutes* "she is at home" | **fires** — *"I just saw her car leaving"* | — | Can't | `can't` | yes |
| t11 | no | no | **fires** — *"I'm not really expecting anything today"* | Might / Could | `might` | yes |
| t12 | no | no | **fires** — *"people leave things behind here all the time, so there is no way of knowing"* | Might / Could | `could` | yes |

R4 re-fires on t11 with the same answer. R5 is a guard and fires on t10, which
is the only item offering `mustn't`. R6 is a guard and fires on t9 and t12, the
two items offering `should`. `then: "Might / Could"` is the honest slash form
the content guide allows: t11 offers `might` and not `could`, t12 the reverse,
because the two are synonyms and putting both in one option set would give the
item two right answers.

### 2.4 `Can vs Could vs May vs Might` (chips only, plus the possibility branch)

The tone block's rule 2 chips were `["politely", "possibly", "please", "a
stranger"]` — three of the four literally in `modals-t8` (§0.2). Now
`["please", "possibly", "if you don't mind", "I'm sorry to bother you"]`:
`politely` and `a stranger` are frame words from the item, not English request
cues; `possibly` stays because it is a real politeness cue that happens also to
be in t8.

The possibility block's rules 2–4 were re-ordered and re-worded so that the
rewritten t6 is not sent to `might`, which it does not offer:

```
R1  cond: cümle soru biçiminde ve birinden bir şey istiyor  → Can / Could / May (ton kuralına dön)
R2  signals: I'm not sure · perhaps · I doubt it · it depends → Might
R3  cond: ihtimal ciddi bir seçenek, belirsizlik ayrıca vurgulanmıyor → May
R4  cond: belirli bir olayın ihtimali söz konusuysa 'can' şıkkını ele → May / Might
```

Trace:

| item | tone R1 | tone R2 | poss. R1 | poss. R2 | poss. R3 | decided | key | on offer? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| t5 | **fires** — *"the friend sitting beside her"* | — | fires (request) → tone block | — | — | Can | `Can` | yes |
| t8 | no — a stranger | **fires** on *"possibly"* | fires (request) → tone block | — | — | Could | `Could` | yes |
| t6 | — | — | no (not a request) | no chip matches | **fires** | May | `may be` | yes |
| t7 | — | — | no | **fires** on *"I'm not sure"* | — | Might | `might` | yes |

t6's line is the softest trace in the file and is recorded as such in §6: a
learner could read *"though the office has not put up a notice yet"* as
emphasised uncertainty and try R2. R2 is a chip rule and no chip matches, and
`might` is not an option, so the branch is recoverable — but it is a judgement
call, not a mechanical one.

### 2.5 `Can vs Could vs Be Able To` (chip only)

Rule 2's chips contained `"once you finish"`, which is `modals-t24`'s opening
(§0.2). Removing it alone would have left t24 undecided, so the chip list is
now general future markers and a new condition rule carries t24:

```
R1  signals: despite · in the end · finally · after a long struggle       → Was / were able to
R2  signals: next year · by the time you graduate · in the future · one day → Will be able to
R3  cond: yetenek henüz yok; bir kursun/sürecin bitmesine bağlanmış        → Will be able to
R4  cond: cümlede zaten 'will' ya da başka bir modal varsa                 → Be able to
R5  cond: geçmişte bir dönem boyunca süren genel yetenek                   → Could
R6  cond: şu anki genel yetenek                                            → Can
```

Trace: t21 → R6 (`can`, on offer); t22 → R5 on *"When she was only five years
old"* (`could`, on offer); t23 → R1 on *"Despite"* (`was able to`, on offer);
t24 → R3 on *"Once you finish this course"* (`will be able to`, on offer).

### 2.6 `Modal Perfects` — re-traced, unchanged

`modals-t16`'s paragraph changed, so the block was re-run. R1 (evidence, one
explanation) → t13; R2 (evidence refutes) → t14; R3 (regret for something *not*
done) → t15 — does not fire on t16, because the umbrellas *were* brought; R4
(done, later turned out unnecessary) → t16. R5 (`mustn't have` is never the
answer) is a guard and fires on t13's option set. One rule each, all keys on
offer. No change needed — this remains the strongest block in the topic.

---

## 3. Giveaways: 13 → 0

`npm run validate` warned on thirteen items in this file. Per the brief, in
every case the **lesson's example changed, not the question** — except where
the question was already being rewritten for a different finding (t6, t16),
where both moved.

| warning | lesson sentence removed | replaced with |
| --- | --- | --- |
| t4 | `You don't have to bring a book — she'll provide copies.` | `You don't have to dress up — it's a very casual place.` |
| t5 | `Can I borrow your notes from yesterday?` (contrast) | `Can I use your bike this afternoon?` |
| t6 | `The meeting may be postponed to next week.` (examples) | `There may be a strike at the airport next month.` |
| t6 | `The results may be announced tomorrow.` (contrast) — would have collided with the rewritten t6 | `Her flight may be delayed because of the fog.` |
| t8 | `Could you possibly lend me your charger?` (contrast) | `Could you keep an eye on my bag for a moment?` |
| t14 | `He can't have finished the marathon in three hours.` (contrast) | `She can't have read the whole report in ten minutes.` |
| t16 | `We needn't have brought umbrellas — it didn't rain.` (contrast) | `You needn't have queued — the tickets were free at the door.` |
| t16 | `pitfall`: `We shouldn't have brought umbrellas…` / `We needn't have brought umbrellas…` — the item's own distractor/key pair | `I shouldn't have printed the slides — the lecturer put them online anyway.` / `I needn't have printed the slides — …` |
| t17 | `In my opinion, you should try that new bakery.` | `In my opinion, you should ask for a second quote before you sign.` |
| t19 | `As the eldest, she ought to set a good example.` (contrast) | `A guide ought to warn visitors about the currents.` |
| t20 | `You shouldn't leave your valuables visible in the car.` | `You shouldn't reply to messages when you are angry.` |
| t21 | `My brother can solve a Rubik's cube in under a minute.` | `I can touch-type without looking at the keyboard.` |
| t22 | `At five, she could already read entire novels.` | `As a child, I could name every player in the squad.` |
| t23 | `pitfall`: `Despite the traffic, she could arrive on time.` / `…she was able to arrive on time.` — the item's own distractor/key pair | `Despite the power cut, we could finish the experiment.` / `Despite the power cut, we were able to finish the experiment.` |
| t24 | `After this course, you will be able to speak more confidently.` | `By September, she will be able to drive on the motorway.` |
| t24 (second pass) | `pitfall`: `Next year, you can speak English fluently…` still shared six words with the key sentence | `Next month, you can cook without a recipe.` / `Next month, you will be able to cook without a recipe.` |

Three further lesson sentences were replaced that the validator did **not**
warn on but the audit counted as leaks (`lessons-oldest.md` §0.1), because the
run was five words rather than six:

- `Must vs Have to` › `contrast` 2: `You mustn't use your phone during takeoff.`
  → `You mustn't tell anyone what we discussed.` (`modals-t3`'s scenario)
- `Must vs Can't vs Might/Could` › `examples`: `Someone is knocking. It might be
  the courier.` → `She hasn't texted back. She might be asleep.`
  (`modals-t11` verbatim in substance)
- `Must vs Can't vs Might/Could` › `examples`: `The lights are on, so someone
  must be home.` → `Her bike is chained up outside, so she must be in the
  library.` (would have echoed the rewritten `modals-t12`)

Every `pitfall` I rewrote still differs in **exactly** the thing being taught
and nothing else: `shouldn't have` vs `needn't have` on one identical sentence;
`could` vs `were able to` on one identical sentence; `can` vs `will be able to`
on one identical sentence.

---

## 4. Distractor collapse

For each item: the failure modes the option set now carries, and the
substitution test on every wrong option.

### `modals-t3` — three costumes of "no obligation"

Was `["mustn't", "don't have to", "don't need to", "may not need to"]`.
Now `["mustn't", "don't have to", "have to", "shouldn't"]`.

| option | filled | accept? |
| --- | --- | --- |
| `don't have to` | *Passengers don't have to use their phones…; it's strictly forbidden…* | **No** — no-necessity against a prohibition stem. The taught trap; kept. |
| `have to` | *Passengers have to use their phones…; it's strictly forbidden…* | **No** — obligation, in flat contradiction with the second clause. |
| `shouldn't` | *Passengers shouldn't use their phones…; it's strictly forbidden by the airline for safety reasons.* | **No** — advice is too weak for a stated legal prohibition. This is the same relation `modals-t4` used `shouldn't` for before this pass, in the same category, and the blind reviewer passed t4. |

Three failure modes: no-necessity, obligation, weak advice. Cost, recorded:
`shouldn't` belongs to lesson 5, so one out-of-category option enters this item.
There is no fourth *in-category* option with a distinct failure mode — the
lesson's forms are `must`, `have to`/`had to`, `mustn't`, `don't have to`, and
every remaining combination is either a second costume of one of the two above
or ungrammatical for a reason the lesson does not teach (`Passengers doesn't
have to`). The topic's out-of-category option count went **down** overall,
because t4 lost two (§4.2) and t20 lost three (§4.4).

### `modals-t4` — three costumes of "prohibition"

Was `["don't have to", "mustn't", "can't", "shouldn't"]`.
Now `["don't have to", "mustn't", "must", "had to"]`.

| option | filled | accept? |
| --- | --- | --- |
| `mustn't` | *You mustn't bring your own textbook…* | **No** — prohibition; the professor removes a need, she forbids nothing. The mirror trap; kept. |
| `must` | *You must bring your own textbook…she'll provide printed copies…* | **No** — obligation, contradicted by the second clause. A learner who reads *"the professor said"* as an instruction reaches for it. |
| `had to` | *You had to bring your own textbook…she'll provide printed copies for everyone.* | **No** — past obligation against a seminar that has not happened and a promise in the future (`she'll`). |

Both remaining distractors are now in-category. `had to` is the weakest of the
three as a *plausible misreading* — recorded in §6.

### `modals-t6` — `should` and `can` both read naturally

Was "The meeting ____ be postponed to next week if the director doesn't manage
to finish reviewing the budget in time.", options `["may", "must", "should",
"can"]`. `should be postponed` and `can be postponed` are both natural there,
and `must` has a necessity reading the conditional supplies
(`option-notes-5.md` says so too).

Now: "The last marker handed in her scripts this morning; the results ____
announced before the weekend, though the office has not put up a notice yet."
Options `["may be", "can be", "must be", "maybe"]`, keyed `may be`.

| option | filled | accept? |
| --- | --- | --- |
| `can be` | *…the results can be announced before the weekend, though the office has not put up a notice yet.* | **No** — `can` states a general possibility or a permission ("it is possible to announce them"), not the likelihood of one specific announcement. This is the lesson's own first `pitfall` (*"She can be at the office, I'm not sure."*), which is why the blank takes `be` rather than a dynamic verb: with a dynamic verb `can` slides into "is now able to" and becomes acceptable. |
| `must be` | *…the results must be announced before the weekend…* | **No** — certainty, refused by *"though the office has not put up a notice yet"*; and there is no rule in the paragraph to license a necessity reading. |
| `maybe` | *…the results maybe announced before the weekend…* | **No** — ungrammatical. `maybe` is a one-word adverb and cannot fill the modal slot. Lesson `pitfall` 2, and the error this audience makes constantly. |

`should` is gone. `must be` remains and is out of category — see §6: this
category **cannot** be made to discriminate using only its own four modals, and
that is a category-spec finding, not something one item can fix.

The options `may be` and `maybe` are not flagged as duplicates: the check
collapses runs of whitespace but does not delete spaces, so they normalise
apart. That near-identity is the trap, and it is a real one on this paper.

### `modals-t7` — `must` and `have to` were one distractor

Now `["might", "must", "might not", "can't"]`.

| option | filled | accept? |
| --- | --- | --- |
| `must` | *I'm not sure yet, but I must come to the party…* | **No** — obligation against an explicit hedge. |
| `might not` | *I'm not sure yet, but I might not come to the party later tonight if I finish my assignment early.* | **No** — the conditional makes finishing early the thing that *enables* coming; reversing the polarity makes the sentence incoherent. A learner who does not track the conditional picks it. |
| `can't` | *…but I can't come to the party…if I finish my assignment early.* | **No** — impossibility, which closes the possibility the sentence opens. |

Three failure modes: obligation, reversed polarity, impossibility.

### `modals-t8` — *Shall you* / *Need you* are not in the interlanguage

The brief (following the blind reviewer) asks for `Can` and `Would` as
replacements, "which are the real confusions". **I did not do that, and it
would have broken the item.** *"Can you possibly lend me your charger?"* and
*"Would you possibly lend me your charger?"* are both standard polite requests
that any competent teacher accepts; putting either in the set gives the item
two right answers, which is a worse defect than a dead option. The same is true
of `Will` and `Might`.

What I did instead: `Shall` → **`May`**. *"May you possibly lend me your
charger?"* is ungrammatical as a request to the hearer — `may` in a request is
`May I …?`, always for the speaker — and over-applying `may` to `you` is an
error this audience genuinely makes, because the lesson teaches `may` as the
polite/formal permission modal and its `forms` block gives the pattern as
`May + I + V?`. So it is in-category, live, and unambiguously wrong.

`Need` stays. Recorded in §6 as not fixed: the reviewer is right that it is not
in the interlanguage, and I could not find a fourth option that is both a live
confusion and not a request a teacher would accept.

Options now `["Could", "May", "Must", "Need"]`. `explanation`, `tip` and the
`May` note rewritten; `Must` and `Need` notes unchanged and still true.

### `modals-t12` — none of `can` / `will` / `should` expresses deduction

Rewritten, and this is also §5 (coverage): the category keyed `must` twice and
**never keyed `could`**.

Now: "The kettle in the staff kitchen is still warm and somebody's jacket is
over a chair, but people leave things behind here all the time, so there is no
way of knowing — a colleague ____ still be in the building."
Options `["could", "must", "can't", "should"]`, keyed `could`.

| option | filled | accept? |
| --- | --- | --- |
| `must` | *…so there is no way of knowing — a colleague must still be in the building.* | **No** — a strong deduction directly contradicted by *"there is no way of knowing"* and by the sentence that gives the evidence a second explanation. |
| `can't` | *…a colleague can't still be in the building.* | **No** — the warm kettle leaves the possibility open; this is the opposite pole, and it is what forces the learner to read which way the evidence points. |
| `should` | *…a colleague should still be in the building.* | **No** — expectation, not inference. The lesson's third `pitfall`. |

The scenario was chosen to avoid `modals-t13`'s stem (*"The lights are still on
and the door is unlocked"*): an earlier draft of this paragraph used a light and
an unlocked door and would have been a near-duplicate stem of an item in a
different category. Category keys are now `must` (t9), `can't` (t10), `might`
(t11), `could` (t12) — full span, and the "Might/Could" branch is tested on
both halves for the first time.

### `modals-t20` — `don't have to` and `needn't` are one, `mustn't have` is not a form

Was `["shouldn't", "mustn't have", "don't have to", "needn't"]` — three options
from three other lessons, two of them synonyms and one of them a string English
does not build.

Now `["shouldn't", "don't have to", "hadn't better", "had better"]`.

| option | filled | accept? |
| --- | --- | --- |
| `don't have to` | *You don't have to leave your valuables visible in the car like that; it's basically an invitation…* | **No** — no-necessity, where the sentence is calling the behaviour a bad idea. The classic contrast; the one out-of-category option kept, because it is the trap a learner actually falls into. |
| `hadn't better` | *You hadn't better leave your valuables…* | **No** — ungrammatical. Lesson `pitfall` 3, in-category, and untested until now. |
| `had better` | *You had better leave your valuables visible in the car like that; it's basically an invitation for someone to break in.* | **No** — well-formed but reverses the advice: it recommends the risky behaviour the second clause warns about. |

`mustn't have` and `needn't` are gone. Out-of-category options in this item:
3 → 1. Together with §1.2, all three of the lesson's `pitfall` blocks now have
a spring: `had better to` and bare `ought` in t18, `hadn't better` in t20.

### `modals-t5` / `modals-t8` — one stem shape doing two of four items

Both were a quoted request closed by a register adverb (*"asked her friend
casually"* / *"asked the stranger next to her politely"*). t5 varied: the frame
now comes first and the register is carried by the situation rather than an
adverb.

"Ayşe leaned over to the friend sitting beside her a few minutes before the
seminar started. \"____ I borrow your notes from yesterday, if you don't need
them? I was off sick and I have nothing written down.\""

`if you don't need them` was added deliberately: dropping *"casually"* removed
what had been holding `Should` out (the blind reviewer's note on t5 said
exactly that — *"'Should' reads as advice — plausible but not what 'casually'
frames"*), and a clause addressed to the owner's willingness makes the sentence
a request for permission rather than a request for an opinion. Options
unchanged; `explanation` expanded from a one-liner to argue all three wrong
options; the three `optionNotes` were re-read against the new text and all
three remain true (none of them referred to the adverb or to "yesterday's
lecture").

### `modals-t16` — `shouldn't have` was natural about the same facts

The brief offered this as record-and-leave "unless you can make the
harmlessness explicit". It can be made explicit, so it was:

"We ____ brought umbrellas after all — the forecast said rain, but the sky
stayed clear the whole afternoon **and they were no trouble to carry**."

`shouldn't have brought` asserts the action was a mistake; a clause saying the
umbrellas cost nothing to carry removes the ground for calling it one, leaving
only "done, and it turned out unnecessary" — which is `needn't have`. `must
have` and `can't have` fail as before. `explanation` rewritten to carry the new
argument; the `shouldn't have` note rewritten; the `must have` and `can't have`
notes re-read and unchanged.

---

## 5. Coverage

`Must vs Can't vs Might/Could` keyed `must` twice and never keyed `could`. Done
via the `modals-t12` rewrite (§4). The category now keys one item per named
form.

Not done: `Can vs Could vs May vs Might` still never puts `may` against `might`,
and `Should vs Ought To vs Had Better` still never puts `should` against `ought
to`. Both are §6 — they are not coverage gaps that a re-key can close.

---

## 6. What I did not do, and why

Honestly and separately, as asked.

**Left on the reviewer's own recommendation.**

- **`modals-t19`** (*"As the eldest sibling, she ____ set a good example"*) —
  `must` is plausible. Left. Only its lesson giveaway was fixed. The deeper
  problem is §2.4 of `lessons-oldest.md`: the item is answerable only because
  `should` was withheld, and adding `should` would give it two right answers.
  I could not fix that without rewriting the item into a form item, which the
  category already has one of after §1.2, and two of four would be a pattern.
- **`modals-t3`'s paragraph gloss** — *"it's strictly forbidden by the airline"*
  states the definition of `mustn't` rather than creating a situation from which
  it is inferred. Left; the reviewer's own note says the gloss is the teaching
  here, and removing it would leave nothing to exclude `shouldn't`, which I
  have just added.
- **`modals-t17`'s paragraph gloss** — *"There is no rush and nothing depends on
  it, but in my opinion"* likewise states the answer before the blank. Left.
  It is also what makes the item's exclusion of `had better` airtight, which is
  the one direction this category *can* be tested in.

**Attempted and judged unfixable within one item.**

- **`Can vs Could vs May vs Might` cannot be made to discriminate using only
  its own four modals.** For a possibility key, `might` and `could` are
  synonyms of `may` and a teacher accepts them; for a permission key, `can` is
  accepted wherever `may` is. So every discriminating item in this category
  must import at least one modal from another lesson. `modals-t6` went from two
  imported modals (`must`, `should`) to one (`must be`), which is the direction
  the brief asked for, but it could not go to zero. This is the same finding
  `option-notes-5.md` reports as "a category whose own contrast is never
  tested", and it needs a category-spec decision, not an item edit.
- **`modals-t8`'s `Need`** — kept. See §4: every option that is a *real* Turkish-
  learner confusion in this slot (`Can`, `Would`, `Will`, `Might`) is a request
  form a competent teacher accepts, so following the brief's suggested swap
  literally would have given the item two right answers. One of the two dead
  options was replaced with a live one (`May`); the other stays dead.
- **`Should vs Ought To vs Had Better` cannot separate `should` from `ought
  to`, and cannot key `had better` on meaning.** Stated in §1.2. `modals-t18`
  is now a form item as a result. This is the finding to escalate: the category
  name promises a three-way semantic contrast that English does not support,
  and the honest options are to rename it around the form facts or to accept
  that half its items test form.

**Findings from the audits that are in this file but outside what I changed.**

- **`modals-t9`** — `might` is grammatical there, merely under-committed
  (blind, "probable"). Not on the brief's list; not touched.
- **`modals-t11`** — `must` and `have to` are defeated by the same clause and
  differ only in register (`option-notes-5.md`). Not on the brief's list; not
  touched. Fixing it would mean another option-set rewrite in a category I have
  already rewritten one item of.
- **Option recycling inside `Must vs Can't vs Might/Could`** — the four items
  still draw from a five-form pool, so `must`, `can't` and `should` recur across
  items. Inherent to the category's size; recorded, not fixed. No two items in
  the category share an identical option set.
- **`had better` now appears in three of the four `Should vs Ought To vs Had
  Better` items** (key in t18, distractor in t17 and t20). That is more
  recycling than I would like. It is deliberate in t20 — a learner meeting the
  same well-formed string right in one item and wrong in another is being taught
  that the form is fine and the context decides — but it is worth a second
  opinion.
- **`Must vs Have to` decision rule 5** (`according to the regulations · the law
  · company policy · the rules say` → `Have to`) now fires on **no item in the
  set**, because t2 moved to the past. Kept because it is transferable and
  because it is no longer copied out of a question, but it is an untested rule.
- **`modals-t4`'s `had to`** is the weakest distractor I introduced: it is
  unambiguously wrong, but a learner reaching for it is doing so on a thin
  misreading (*"the professor said"*) rather than on a real confusion.
- **`modals-t18` is now decided at the blank**, not by reading the paragraph.
  That is a real cost, accepted for the reasons in §1.2, and it is the change
  in this pass most likely to be argued with.
- **`modals-t6`'s decision-block trace is a judgement call**, not a mechanical
  one — see §2.4.

**Out of scope, untouched:** `data/tenses/tenses.json`,
`data/passive-voice/passive-voice.json`, `data/manifest.json` (only
`npm run format`'s generated lesson index moved), all code and tools. Nothing
required a manifest change: the category taxonomy is unchanged, the question
count is unchanged at 24, and no lesson was added or removed.

---

## 7. Verification

```
npm run format      # clean
npm run check       # format:check ✓  validate ✓ (0 errors)  color ✓  test 136/136 ✓
```

`npm run validate` prints 14 warnings, all of them
`data/passive-voice/passive-voice.json`. **Zero warnings name
`data/modals/modals.json`** — down from 13.

Every question in the file still has exactly four distinct options, exactly one
`____`, `optionNotes` covering all three wrong options and none covering a key,
and an `explanation` that names at least one wrong option in that option's own
words. Every lesson still has 6–14 blocks, a `contrast`, and `check` blocks it
has questions to fill.

Not committed, not pushed.
