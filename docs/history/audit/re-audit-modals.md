# Independent re-audit — `data/modals/modals.json`

2026-09-04. Scope: `data/modals/modals.json` and the repair recorded in
`docs/audit/repair-modals.md` (commit `3df21db`). I did not write the content
and did not write the repair log; every claim in that log was re-derived here
before it was believed. **I repaired nothing.** This file is the only thing
this pass wrote.

`data/passive-voice/passive-voice.json` is being repaired by another session
and was **not opened**. `npm run check` stops at `format:check` with
`data/passive-voice/passive-voice.json` unformatted, and `npm run validate`
prints warnings that all name that file. Both are that session's, not this
one's; ignored, as instructed.

What I ran myself: `npm run validate` (0 errors, **0 warnings naming
`data/modals/modals.json`**), `npm test` (136/136), `npm run color` (clean),
`node tools/format-content.mjs --check` (modals is canonically formatted), and
`checkLessonGiveaway` from `tools/content-checks.mjs` driven directly over this
topic, on both the pre-repair and post-repair file.

---

## 0. Verdict

| # | category | verdict | the one defect that blocks it |
| --- | --- | --- | --- |
| 1 | Must vs Have to vs Mustn't vs Don't Have to | **SHIPS** | — (two reservations: `m1`'s `have to`, `m3`'s new `shouldn't`; §9.2, §9.3) |
| 2 | Can vs Could vs May vs Might | **DOES NOT SHIP** | `m6` — *"the results **must be** announced before the weekend"* is the ordinary deontic passive, and nothing in the paragraph excludes a requirement. The item the repair rewrote reproduces the defect the rewrite was for. |
| 3 | Must vs Can't vs Might/Could | **SHIPS** | — (`m9`'s `might`, carried from the blind pass, unrepaired and recorded) |
| 4 | Modal Perfects: Must / Can't / Should / Needn't Have | **SHIPS** | — |
| 5 | Should vs Ought To vs Had Better | **DOES NOT SHIP** | `m19` — *"As the eldest sibling, she **must** set a good example"* is accepted English with the same responsibility reading as the key, and nothing in the paragraph pushes against it. Flagged by two prior passes; left. |
| 6 | Can vs Could vs Be Able To | **DOES NOT SHIP** | `m24` — *"Once you finish this course, you **can** speak with much more confidence"* is standard: a temporal clause licenses future `can`. The lesson's own prose asserts the opposite in a form that is simply false. |

**The two decisions I was asked to rule on:**

- **`m2` — the repair is right, and its reasoning is right for one more reason
  than it gives.** The rewrite excludes all three wrong options, and the
  paragraph does force a past reading at the blank (§2.1).
- **`m18` — I agree with the trade.** The category genuinely cannot key
  `had better` on meaning, the form facts are real, and the item still makes
  the paragraph do one unit of work (`had better not`). Two costs recorded in
  §2.2.
- **`m12` (re-keyed, tested hardest after those two) — sound.** All three
  distractors fail, the category now spans its four named forms, and the
  scenario is not lifted from the lesson. One stylistic objection in §9.6.

**On the repair's own account of itself:** 13 → 0 giveaway warnings is true and
I reproduced both numbers. Two claims in the log are not: one is wrong about
its own file (§7.2) and one is wrong about English (§7.3).

---

## 1. Answering the rewritten items myself

Eleven items changed: m2, m3, m4, m5, m6, m7, m8, m12, m16, m18, m20. I read
each paragraph with its four options and wrote an answer before looking at
`correctIndex`.

| item | my answer | key | agree? | how sure |
| --- | --- | --- | --- | --- |
| m2 | had to | had to | yes | certain |
| m3 | mustn't | mustn't | yes | certain |
| m4 | don't have to | don't have to | yes | certain |
| m5 | Can | Can | yes | certain |
| m6 | may be | may be | yes | probable — see §4.3 |
| m7 | might | might | yes | certain |
| m8 | Could | Could | yes | certain |
| m12 | could | could | yes | certain |
| m16 | needn't have | needn't have | yes | certain |
| m18 | had better | had better | yes | certain |
| m20 | shouldn't | shouldn't | yes | certain |

11 of 11. No item was mis-keyed by the repair, including the re-key at m12.
That is the easy half; the rest of this report is the other half — whether the
*wrong* options are wrong.

---

## 2. The three items the brief singles out

### 2.1 `m2` — past time, and a second exclusion the log does not claim

> "I had promised to meet friends at six, but the shift supervisor rewrote the
> rota that morning without warning anyone, so I ____ stay at the shop until
> closing time and missed them completely." — `["had to", "must", "didn't have
> to", "mustn't"]`, keyed `had to`.

**Does the paragraph force a past reading at the blank?** Yes, and by two
independent routes:

1. **Narrative tense.** `had promised`, `rewrote … that morning`, `missed them
   completely` fix the whole passage before speech time. The event at the blank
   (staying until closing) is inside that closed span.
2. **The coordination — which the log does not lean on and should.** The blank
   sits in `so I [____ stay …] and [missed them completely]`: one subject, two
   coordinated predicates. Whatever fills the blank has to be finite and past,
   because it is conjoined with a past finite verb. `must` cannot be, and the
   only reading that would rescue a present modal — free indirect or reported
   speech (*she knew she must stay*) — needs a governing clause the sentence
   does not have.

That second route matters because it is the one that does not depend on the
teaching claim. The generalisation "*must* has no past form" is true of the
deontic modal in a main clause but is not true in every environment a learner
will meet (backshift keeps `must` freely). Here the coordination removes the
escape hatch. The item is airtight; the `tip` — *"Geçmişteki zorunluluk için
tek seçenek 'had to'dur"* — is the transferable form of it and is correct at
this level.

Substitution, my own reading of each:

| option | filled | verdict |
| --- | --- | --- |
| `must` | *…so I must stay at the shop until closing time and missed them completely.* | **excluded** — tense clash with the coordinated `missed`, and no past deontic `must` in a main clause. |
| `didn't have to` | *…so I didn't have to stay …and missed them completely.* | **excluded** — asserts there was no obligation, which `and missed them completely` contradicts: he missed them *because* he stayed. |
| `mustn't` | *…so I mustn't stay …and missed them completely.* | **excluded** — prohibition, plus the same tense clash. |

**One cost the log does not record.** The item's `explanation` opens on the
source of the obligation — *"Zorunluluğu koyan konuşmacı değil, vardiya
sorumlusu: dışarıdan gelen bir kural"* — which does **no work** in the new
item. `had to` would be the answer whoever imposed the obligation, and the
repair says so itself in decision rule 4 (*"kim koymuş olursa olsun"*). A
learner reading the explanation top-down is told the internal/external split
decided this item; it did not. The first sentence should go, or be demoted
behind the tense argument. Non-blocking, but it re-teaches the heuristic the
repair had just declared unreliable.

**And the consequence the log states but understates.** After this rewrite no
item in the topic keys `have to`, and `m1` is the only item left standing on
the internal/external distinction. The log asserts that this is fine because
*"have to is genuinely odd there"*. It is not (§9.2).

### 2.2 `m18` — I agree, with two costs

The premise is right and I re-derived it: `should` is available wherever `had
better` is. *"We should start walking down to the pier — otherwise we'll be
sleeping in the car"* is unimpeachable English. Urgency raises the pragmatic
strength of advice; it does not make the ordinary advice modal wrong. The
implication runs one way only, which is exactly why `m17` and `m20` — the two
items that exclude *`had better`* — both survive. Keying `had better` on
meaning in a four-option set that contains `should` is not repairable by
rewriting the paragraph.

Given that, the two available moves were: withhold the rival (the defect
`lessons-oldest.md` already records twice in this topic), or turn on form.
Form is the better move here, and it is explicitly sanctioned by
`question-author.md` rule 3, which names `had better to` as the error this
audience makes and says an option is not dead merely because a fluent speaker
sees through it. Substituting:

| option | filled | verdict |
| --- | --- | --- |
| `had better to` | *…so we had better to start walking…* | **excluded**, ungrammatical. Lesson `pitfall` 1. |
| `had better not` | *…so we had better not start walking down to the pier — otherwise we will be sleeping in the car.* | **excluded** on meaning: well-formed, and flatly contradicted by the `otherwise` clause. |
| `ought` | *…so we ought start walking…* | **excluded**, ungrammatical. Lesson `pitfall` 2. |

Exactly one option is both well-formed and coherent. Three distinct failure
modes, and two of the lesson's three untested pitfalls now have a spring.

**Cost 1, recorded by the log:** the item is largely decided at the blank. I
would soften that slightly — `had better not` is well-formed, so the learner
must read the `otherwise` clause to reject it. One of three distractors needs
the paragraph, which is more than a pure form item and less than the rest of
the topic.

**Cost 2, not recorded:** the new paragraph contains the word `otherwise`,
which is the first chip in the lesson's own `decision` rule 1. Before the
rewrite the chip was general and no item contained it; now it is a literal
lesson→item match. This is the same species as the item-derived chips
`lessons-oldest.md` §0.2 objected to, arriving from the other direction. It is
one connective and it does not decide the item (the form does), so it is a
note, not a finding.

### 2.3 `m12` — the re-key

> "The kettle in the staff kitchen is still warm and somebody's jacket is over
> a chair, but people leave things behind here all the time, so there is no way
> of knowing — a colleague ____ still be in the building." — `["could",
> "must", "can't", "should"]`, keyed `could`.

| option | filled | verdict |
| --- | --- | --- |
| `must` | *…so there is no way of knowing — a colleague must still be in the building.* | **excluded** — a strong inference contradicted in the same sentence, twice: by the second explanation of the evidence and by *"no way of knowing"*. |
| `can't` | *…a colleague can't still be in the building.* | **excluded** — the warm kettle keeps the possibility open; this is the opposite pole. |
| `should` | *…a colleague should still be in the building.* | **excluded** — expectation, and there is no normal state of affairs to expect from. Lesson `pitfall` 3. |

Checked besides: the key is not lifted from the lesson (`checkLessonGiveaway`
clean, and I read the whole lesson for the near misses the check cannot see —
the closest is *"She could be stuck in traffic, but I don't know."*, which is
generic); the scenario does not duplicate `m13`'s lights-and-door stem (the
corpus near-duplicate check is clean and the two share no frame); the category
now keys `must` / `can't` / `might` / `could` one each, closing the hole
`blind-oldest.md` §3 recorded; and all three `optionNotes` are new and true of
the new text. Sound.

My one objection is stylistic and is in §9.6: the clause *"so there is no way
of knowing"* is a gloss that states the answer's condition rather than leaving
it to be inferred — the same thing the repair declined to remove from `m3` and
`m17` on the blind reviewer's advice, newly written into `m12` by the same
pass.

---

## 3. The `decision` blocks as literal checklists — 24 traces

The brief says six blocks; there are **seven**. `Can vs Could vs May vs Might`
carries two (`Hangi tonu seçeceksin`, block 2; `Sınavda önce şuna bak`, block
10). All seven were run in file order over every item in their category, and
the untouched categories were run too.

Convention below: the first rule that fires, and whether the form it names is
an option on that item. A rule firing earlier and naming a non-key form is
recorded as a misfire whether or not a later rule recovers.

### 3.1 Must vs Have to vs Mustn't vs Don't Have to

```
R1 signals forbidden · not allowed · prohibited · against the rules → Mustn't
R2 signals optional · there is no need · if you want to · it's up to you → Don't have to
R3 cond   bir bilgi işi yapma gereğini ortadan kaldırıyor            → Don't have to
R4 cond   zorunluluk geçmişte kalmış — kim koymuş olursa olsun       → Had to
R5 signals according to the regulations · the law · company policy … → Have to
R6 cond   zorunluluğu koyan konuşmacının kendisi                     → Must
```

| item | first rule to fire | on what | returns | key | on offer | misfire |
| --- | --- | --- | --- | --- | --- | --- |
| m1 | R6 | *"nobody is forcing me, but I promised"* | Must | must | yes | none — R4 does not fire, the obligation is for *tonight* |
| m2 | R4 | *"had promised … rewrote that morning … missed them"* | Had to | had to | yes | none |
| m3 | R1 | *"strictly forbidden"* | Mustn't | mustn't | yes | none |
| m4 | R3 | *"she'll provide printed copies for everyone"* | Don't have to | don't have to | yes | none — R2's chips no longer contain the item's own words |

Clean. R5 fires on no item in the set (the log records this). R4 sits before R5
deliberately and correctly: on m2 R5 would return `Have to`, which is not an
option.

### 3.2 Can vs Could vs May vs Might — tone block (block 2)

```
TR1 cond   ortam samimi: arkadaş, aile, sınıf arkadaşı → Can
TR2 signals please · possibly · if you don't mind · I'm sorry to bother you → Could
TR3 cond   resmî ortam, otorite figürü                 → May
```

| item | fires | returns | key | on offer | note |
| --- | --- | --- | --- | --- | --- |
| m5 | TR1 — *"the friend sitting beside her"* | Can | Can | yes | ✓ |
| m6 | none | — | — | — | correct: not a request |
| m7 | **TR1 is readable as firing** — *"come to the party"* is an informal setting | Can | might | **no** | misfire, recoverable (§9.7) |
| m8 | TR2 — *"possibly"* | Could | Could | yes | ✓ |

The block has no entry condition. Its heading scopes it (*"Hangi tonu
seçeceksin"*) and the possibility block's R1 routes requests into it, but a
learner running the lesson top-down meets the tone block first and TR1 names a
*setting*, not a speech act. On m7 it returns `Can`, which is not an option, so
the learner recovers. One clause (*"Cümle bir istek/rica ise"*) would close it.

### 3.3 Can vs Could vs May vs Might — possibility block (block 10)

```
PR1 cond   soru biçiminde ve birinden bir şey istiyor → Can / Could / May (ton bloğuna dön)
PR2 signals I'm not sure · perhaps · I doubt it · it depends → Might
PR3 cond   ihtimal ciddi bir seçenek, belirsizlik ayrıca vurgulanmıyor → May
PR4 cond   belirli bir olayın ihtimali ise 'can' şıkkını ele → May / Might
```

| item | first rule to fire | returns | key | on offer |
| --- | --- | --- | --- | --- |
| m5 | PR1 → tone TR1 | Can | Can | yes |
| m6 | PR3 | May | may be | yes |
| m7 | PR2 — *"I'm not sure"* | Might | might | yes |
| m8 | PR1 → tone TR2 | Could | Could | yes |

m6's line is the soft one and the log says so. I agree it is recoverable
mechanically — PR2 is a chip rule, no chip matches, and `might` is not an
option — but note what that means: on m6 the block reaches the key partly
because the *option set* rules the alternative out, not because the block does.
This is the same synonymy the repair escalates in §6 of its log, showing up
inside the trace.

### 3.4 Must vs Can't vs Might/Could

```
R1 cond kanıt söylenen şeyi doğruluyor, başka açıklama yok → Must
R2 cond kanıt söylenen şeyi çürütüyor; imkânsız            → Can't
R3 cond aynı kanıt birden fazla açıklamaya izin veriyor / emin değil → Might / Could
R4 signals I'm not sure · I'm not expecting · perhaps · it's hard to say → Might / Could
R5 cond yasak yoksa 'mustn't' şıkkını ele                  → Can't
R6 cond 'should' beklenti bildirir                          → Must
```

| item | first rule to fire | returns | key | on offer | note |
| --- | --- | --- | --- | --- | --- |
| m9 | R1 — *"always this crowded"* | Must | must | yes | **but see below** |
| m10 | R2 — *"I just saw her car leaving"* | Can't | can't | yes | R1 no longer fires; the repair's fix to `lessons-oldest.md` §2.7 works |
| m11 | R3, and R4 on *"I'm not really expecting"* | Might / Could | might | yes | ✓ |
| m12 | R3 — *"people leave things behind here all the time … no way of knowing"* | Might / Could | could | yes | ✓ |

**m10 is genuinely repaired.** Under the old rule 1 (*"Cümlede somut bir kanıt
var ve tek makul açıklama bu"*) a learner stopped at rule 1 and answered
`must`, the item's closest distractor. The rewritten rules 1 and 2 name the
direction of the evidence, and rule 1 now correctly declines to fire. I
re-derived this rather than taking the log's word for it.

**m9's trace is decided by the learner, not the block.** R1 and R3 are
judgement conditions over the same evidence: a queue *does* admit other
explanations (cheap, fashionable, small), so a careful learner refuses R1,
reaches R3 and answers `might` — which is an option, and is not the key. This
is the blind reviewer's *"'might' is grammatical, merely under-committed"*
arriving through the checklist. It is not new and the repair records it as
untouched; I record it as the one place in this category where the procedure
does not settle the item.

### 3.5 Modal Perfects

```
R1 kanıt + tek makul açıklama          → Must have + V3
R2 kanıt tersini söylüyor              → Can't have + V3
R3 yapılmamış bir şeye pişmanlık       → Should have + V3
R4 yapılmış, sonradan gereksiz çıkmış  → Needn't have + V3
R5 şıkta 'mustn't have' varsa ele      → Can't have + V3
```

| item | first rule to fire | returns | key | on offer |
| --- | --- | --- | --- | --- |
| m13 | R1 | Must have | must have | yes |
| m14 | R2 | Can't have | can't have | yes |
| m15 | R3 | Should have | should have | yes |
| m16 | R4 (R3 correctly declines — the umbrellas *were* brought) | Needn't have | needn't have | yes |

Clean, and still the strongest block in the topic. **R5 fires on nothing** —
see §7.2, where the log says otherwise.

### 3.6 Should vs Ought To vs Had Better

```
R1 signals otherwise · or else · or you'll ... · before it's too late → Had better
R2 cond   kötü sonuç kesin ve yakın                                  → Had better
R3 cond   risk/kötü alışkanlık, sonuç kesin değil; olumsuz tavsiye    → Shouldn't
R4 cond   rolden doğan süregelen sorumluluk, resmî ton                → Ought to
R5 signals in my opinion · I think · if you ask me                    → Should
R6 cond   aciliyet/tehdit/resmî sorumluluk yoksa (varsayılan)         → Should
```

| item | first rule to fire | on what | returns | key | on offer |
| --- | --- | --- | --- | --- | --- |
| m17 | R5 | *"in my opinion"* | Should | should | yes |
| m18 | R1 | *"otherwise"* | Had better | had better | yes |
| m19 | R4 | *"As the eldest sibling … for the younger ones"* | Ought to | ought to | yes |
| m20 | R3 | *"it's basically an invitation for someone to break in"* + *"like that"* | Shouldn't | shouldn't | yes |

Four items, four rules, no misfires. **This block is repaired.** The old rule 2
fired on m20 and returned `had better not`, a form m20 does not offer, while
the `examples` block called the same sentence *"bir uyarı değil"*; both halves
of that contradiction are gone, and the replacement criterion (certain and
imminent vs a risk) is one a learner can actually apply. This is the cleanest
piece of work in the repair.

### 3.7 Can vs Could vs Be Able To

```
R1 signals despite · in the end · finally · after a long struggle → Was / were able to
R2 signals next year · by the time you graduate · in the future · one day → Will be able to
R3 cond   yetenek henüz yok; bir kursun/sürecin bitmesine bağlı     → Will be able to
R4 cond   cümlede zaten 'will' ya da başka bir modal varsa          → Be able to
R5 cond   geçmişte bir dönem süren genel yetenek                    → Could
R6 cond   şu anki genel yetenek                                     → Can
```

| item | first rule to fire | returns | key | on offer |
| --- | --- | --- | --- | --- |
| m21 | R6 | Can | can | yes |
| m22 | R5 — *"When she was only five years old"* | Could | could | yes |
| m23 | R1 — *"Despite"* | Was / were able to | was able to | yes |
| m24 | R3 | Will be able to | will be able to | yes |

No misfires; the item-derived chip `"once you finish"` is gone and R3 carries
m24 as the log says. **But R3 is item-shaped**: *"bir kursun, bir eğitimin ya
da bir sürecin bitmesine bağlıyor"* describes m24's scenario more precisely
than the chip it replaced. The string leak is closed and the derivation is not
(§9.5). R4 fires on no item in the set — a second untested rule, alongside
§3.1's R5.

---

## 4. Substituting every wrong option — the eleven rewritten items

m2, m12, m16 and m18 are in §2 and §9. The rest:

### 4.1 `m3` — options now `mustn't` / `don't have to` / `have to` / `shouldn't`

| option | filled | verdict |
| --- | --- | --- |
| `don't have to` | *Passengers don't have to use their phones …; it's strictly forbidden…* | excluded — no-necessity against a prohibition. The taught trap, and the right one to keep. |
| `have to` | *Passengers have to use their phones…* | excluded — flat contradiction with the second clause. |
| `shouldn't` | *Passengers shouldn't use their phones during takeoff and landing; it's strictly forbidden by the airline for safety reasons.* | **weak exclusion — see §9.3.** The sentence is well-formed and a speaker can say it; what makes it wrong is that the same speaker then asserts something stronger in the next clause. |

The repair's stated justification for `shouldn't` — that it is *"the same
relation `modals-t4` used `shouldn't` for before this pass"* — does not hold.
In the old m4, `shouldn't` was contradicted by the paragraph (there was no
reason not to bring a book). Here it is merely weaker than the key. Different
relation, and the weaker one.

### 4.2 `m4` — options now `don't have to` / `mustn't` / `must` / `had to`

| option | filled | verdict |
| --- | --- | --- |
| `mustn't` | *You mustn't bring your own textbook…* | excluded — a prohibition the professor never issues. The mirror trap; correctly kept. |
| `must` | *You must bring your own textbook — the professor said she'll provide printed copies…* | excluded — contradicted by the second clause. |
| `had to` | *You had to bring your own textbook — …she'll provide printed copies for everyone.* | excluded — past obligation against a seminar that has not happened and a promise in `she'll`. |

All three now in-category, which is a real gain (the item shed `can` and
`shouldn't`). `had to` is the thin one and the log says so; I agree, and it is
still better than the two out-of-category options it replaced.

### 4.3 `m6` — options now `may be` / `can be` / `must be` / `maybe`

This is the item that fails.

| option | filled | verdict |
| --- | --- | --- |
| `must be` | *The last marker handed in her scripts this morning; the results **must be** announced before the weekend, though the office has not put up a notice yet.* | **NOT excluded.** `must + be + V3` with an institutional subject and a deadline is the canonical deontic passive of English — *applications must be submitted by Friday*. Read that way the passage is entirely coherent: marking is finished; the rule requires announcement before the weekend; the office has not posted anything yet. Nothing in the paragraph rules out a requirement, and the concessive clause fits the deontic reading as comfortably as the epistemic one. |
| `can be` | *…the results can be announced before the weekend, though the office has not put up a notice yet.* | **weakly excluded.** The feasibility reading is live and the first clause supplies its enabling condition: now that the last marker is done, announcement is possible. What pushes against it is the concessive — a missing notice is evidence against a likelihood, not against a possibility — so I stop short of calling it accepted. But see §7.3: the repair's grammatical defence of this exclusion is wrong. |
| `maybe` | *…the results maybe announced…* | excluded — ungrammatical, and a live Turkish-learner error with a `pitfall` behind it. Good option. |

`option-notes-5.md` reported the *old* m6's defect as: *"Read as necessity
rather than certainty … the item intends an ihtimal frame and the
`explanation` treats `must` only as kesinlik."* The new `explanation` says
*"'must be' kesinlik bildirir ve ofisin henüz ilan asmamış olmasıyla
çelişir"* — the same move, on a paragraph where the necessity reading is
**stronger** than before, because the old stem's verb was `postponed` in a
conditional and the new one is a passive with an institutional subject and a
deadline. The item was rewritten and the defect came with it.

Secondary: `marker` (a person who marks scripts) and `scripts` (exam papers)
are British academic register. The first clause is the item's enabling
evidence; a learner who does not know either word loses it.

### 4.4 `m5` — stem rewritten, options unchanged

| option | filled | verdict |
| --- | --- | --- |
| `Must` | *Must I borrow your notes from yesterday, if you don't need them?* | excluded — asks about an obligation on the speaker. |
| `Should` | *Should I borrow your notes from yesterday, if you don't need them? I was off sick and I have nothing written down.* | excluded, and this is the item's thinnest exclusion. Dropping *"casually"* removed what the blind reviewer said was holding `Should` out; `if you don't need them` does replace it — a clause addressed to the owner's willingness makes the utterance a request rather than a request for an opinion — and the follow-up sentence justifies wanting the notes rather than wondering whether to want them. It holds, with less margin than the other three. |
| `Will` | *Will I borrow your notes…?* | excluded. |

The log claims the three `optionNotes` were re-read and remain true because
none referred to the adverb or to *"yesterday's lecture"*. I checked all three
against the new text: correct.

### 4.5 `m7` — `have to` → `might not`

| option | filled | verdict |
| --- | --- | --- |
| `must` | *I'm not sure yet, but I must come to the party…* | excluded — deontic against an explicit epistemic hedge. |
| `might not` | *I'm not sure yet, but I might not come to the party later tonight if I finish my assignment early.* | excluded — the conditional makes finishing early the thing that *enables* coming; reversing polarity makes it incoherent. A genuinely good distractor, and a real improvement on `have to`, which was a second costume of `must`. |
| `can't` | *…but I can't come…if I finish my assignment early.* | excluded. |

### 4.6 `m8` — `Shall` → `May`

| option | filled | verdict |
| --- | --- | --- |
| `May` | *May you possibly lend me your charger for a few minutes?* | excluded — `may` in a request is `May I …?`, always for the speaker. In-category, live for this audience (the lesson teaches `may` as the formal permission modal), unambiguously wrong. A good swap. |
| `Must` | *Must you possibly lend me…?* | excluded. |
| `Need` | *Need you possibly lend me…?* | excluded, and still dead — not an error this audience produces. Recorded by the repair as unfixed; I agree with the reasoning (§8.1). |

### 4.7 `m20` — three options replaced

| option | filled | verdict |
| --- | --- | --- |
| `don't have to` | *You don't have to leave your valuables visible in the car like that; it's basically an invitation…* | excluded, with less margin than the log allows. *"You don't have to shout"* is an idiomatic English rebuke of an unnecessary action, and this sentence is built the same way. What saves the item is that the second clause argues the behaviour is *dangerous*, not *unnecessary*. Keep, but it is the second-weakest exclusion in the topic after §4.3. |
| `hadn't better` | *You hadn't better leave your valuables…* | excluded — not a form. Lesson `pitfall` 3, in-category, untested until now. Good addition. |
| `had better` | *You had better leave your valuables visible in the car like that; it's basically an invitation for someone to break in.* | excluded — well-formed, reverses the advice. |

Out-of-category options in this item went 3 → 1, and the item now springs a
pitfall. Net clearly positive.

---

## 5. The moved lesson sentences, read against their whole lessons

Nineteen English sentences in the lessons changed. I read each one back into
its own lesson — its block's gloss or `use`, the other blocks, and all four of
the category's items.

**Coherent, and three are improvements to the lesson's own argument:**

- `forms` › Must/Olumlu: *"You must wear a helmet."* → *"I must remember to
  renew my passport."* The old example was an externally imposed rule
  addressed to someone else, i.e. the exact thing the `contrast` two blocks
  above says `must` is *not*. The new one models what the contrast claims.
  Same for *"You mustn't park here."* → *"You mustn't lend this card to
  anyone."* and for the airline sentence in `contrast` 2.
- The two new gloss clauses (*"Bu ayrım yalnızca olumlu cümleler içindir"* and
  *"Yasağı kimin koyduğu fark etmez"*) are true, they agree with each other,
  and they agree with `decision` R1, which keys `Mustn't` off prohibition
  signals without asking who prohibits.
- Lesson 4's new `pitfall` (`shouldn't have printed` / `needn't have printed`)
  differs in exactly the thing being taught and nothing else. So do lesson 6's
  two new pitfalls and lesson 2's `maybe`/`may` pair.

**One leftover the repair moved a sentence past:**

- Lesson 3 › `examples`: *"Someone is knocking. It might be the courier."* →
  **"She hasn't texted back. She might be asleep."** — and the `note` is
  unchanged: *"Zayıf tahmin, **kanıt yok** → might"*. The new sentence supplies
  evidence (she hasn't texted back), so the note now denies what the sentence
  in front of it does. Small, and the old sentence was loose in the same way,
  but it is a sentence this pass moved without re-reading its note. §9.8.

**One conceptual leak the mechanical check cannot see, and the repair did not
catch:**

- Lesson 1 › `contrast` › Must: *"I must call my mother tonight — I promised
  her."* against **m1**: *"I ____ finish this report tonight — nobody is
  forcing me, but I promised my manager…"*. Same modal, same time adverb, same
  justification (*I promised*), noun swapped. `checkLessonGiveaway` scores the
  longest shared run at two words, so it is silent; `question-author.md` rule 1
  is not about word runs, it is about meeting the answer three blocks above
  the question. The repair replaced four sentences in this lesson and left the
  one closest to a shipped item. §9.4.

**And one small loss:**

- Lesson 6 › `pitfall`: *"Next year, you can speak English fluently **if you
  keep practising**."* → *"Next month, you can cook without a recipe."* The
  giveaway is gone (it was m24's key sentence), but the old pitfall modelled a
  *conditional* future frame, which is m24's frame (*Once you finish this
  course*); the new one uses a bare time adverbial, which is the easy case.
  The lesson now models the case m24 does not test and no longer models the
  one it does. This matters because of §9.1.

---

## 6. `explanation`, `tip`, `optionNotes` against the new texts

Checked every field on all eleven rewritten items, plus the notes that were
left in place beside a changed paragraph — the ones most likely to have been
left behind.

| item | changed fields | notes carried over unchanged | still true? |
| --- | --- | --- | --- |
| m2 | all | — | yes |
| m3 | explanation, 2 notes | `don't have to` | yes |
| m4 | explanation, 2 notes | `mustn't` | yes |
| m5 | paragraph, explanation | all three notes | yes — none referenced the dropped adverb or *"yesterday's lecture"* |
| m6 | all | — | internally consistent; the `must be` note is the one that argues the wrong thing (§4.3) |
| m7 | explanation, 1 note | `must`, `can't` | yes |
| m8 | explanation, tip, 1 note | `Must`, `Need` | yes |
| m12 | all | — | yes |
| m16 | paragraph, explanation, 1 note | `must have`, `can't have` | yes — both survive the added clause |
| m18 | all | — | yes |
| m20 | explanation, tip, 2 notes | `don't have to` | yes |

Mechanically: 24/24 items have four distinct options, exactly one `____`,
`optionNotes` on all three wrong options and none on a key, every note under
160 characters, every explanation between 40 and 600 and naming at least one
wrong option in that option's own words, every paragraph over 15 words. I
re-derived all of that rather than reading it off §7 of the log; it is
accurate.

Two content objections rather than truth objections, both above: m2's
explanation leads with a distinction that does not decide the item (§2.1), and
m24's note asserts something false about English (§9.1).

---

## 7. The log against its own diff

### 7.1 Verified

- **13 → 0 giveaway warnings.** Reproduced both ends by running
  `checkLessonGiveaway` over `HEAD^` (13 warnings: t4, t5, t6, t8, t14, t16,
  t17, t19, t20, t21, t22, t23, t24 — exactly the list the log gives) and over
  `HEAD` (0).
- **Eleven questions changed, all six lessons changed** — the diff carries
  exactly m2, m3, m4, m5, m6, m7, m8, m12, m16, m18, m20.
- **"The topic's out-of-category option count went down overall."** True, and
  by more than the log claims credit for: −8 across the seven items with
  option changes (m3 +1, m4 −2, m6 −1, m7 −1, m8 −1, m12 −2, m20 −2).
- **Nothing outside the file was touched** beyond the two `docs/audit` files
  and the one-line `academic-verbs` example; `data/manifest.json` is untouched
  and needs no change (no category or summary moved).
- **`npm run validate` names zero warnings in this file.** Confirmed.
- **The `may be` / `maybe` pair does not trip the duplicate-option check.**
  Confirmed empirically — validate is silent on it.

### 7.2 Wrong about its own file

§2.6: *"R5 (`mustn't have` is never the answer) is a guard and **fires on
t13's option set**."* It does not. m13's options are `must have` / `can't
have` / `should have` / `might`; no item in the topic offers `mustn't have`
any more, because the repair itself removed the only one (from m20). The Modal
Perfects R5 fires on nothing, exactly like §3.1's R5 and §3.7's R4. Harmless
to the content, but it is a trace the log reports as run and verified when it
was not.

### 7.3 Wrong about English

§4 on m6: *"…which is why the blank takes `be` rather than a dynamic verb:
with a dynamic verb `can` slides into 'is now able to' and becomes
acceptable."*

The blank does not take a copular `be`. `may be announced` is the passive of
the dynamic verb *announce*; the `be` is the passive auxiliary. The lesson
`pitfall` the defence appeals to — *"She can be at the office, I'm not sure"*
— is a copula, which is why `can` fails there. That argument does not transfer
to a dynamic passive, and `can be announced` means precisely *"it is possible
for them to be announced"*, which is the reading the paragraph's first clause
sets up. The exclusion may still be defensible on the concessive clause
(§4.3); the reason given for it is not.

### 7.4 Contested

§1.1: *"`modals-t1` still keys `must` on the internal side …, which is
defensible **because `have to` is genuinely odd there**."* It is not odd.
§9.2.

---

## 8. The three things the repair says it did not do

### 8.1 m8's `Can` / `Would` swap — **agree, and the log is right to have refused the brief**

*"Can you possibly lend me your charger?"* and *"Would you possibly lend me
your charger?"* are both standard polite requests. Following the blind
reviewer's suggested fix literally would have given the item two right
answers — a worse defect than the dead option it removed. `Shall` → `May` is
the right move: it is in-category, it is an error this audience actually makes
(the lesson teaches `may` as the polite/formal permission modal and gives the
pattern as `May + I + V?`), and *"May you …?"* is not a request form. `Need`
staying dead is a real but small cost, correctly recorded.

### 8.2 The `Can vs Could vs May vs Might` synonymy — **agree with the diagnosis, disagree that it can be left pending**

The analysis is right: for a possibility key, `might` and `could` are synonyms
of `may`; for a permission key, `can` is accepted wherever `may` is; so every
discriminating item in the category must import a modal from another lesson.
That is a category-spec decision and not an item edit, and escalating it is
correct.

But the escalation is not cost-free, and the log treats it as though it were.
The modal m6 had to import is `must be`, and that import is what makes m6
unsound (§4.3). "This category cannot discriminate using its own four modals"
and "m6 ships" cannot both stand. One of the two items in the possibility
branch has to be rewritten around a modal whose deontic reading the paragraph
kills, or the category has to shrink.

### 8.3 The `m3` and `m17` paragraph glosses — **agree on m3, half-agree on m17, and note that the pass wrote a new one**

`m3`: agree, and for the reason the log gives. *"It's strictly forbidden"* is
the only thing in that paragraph that excludes `shouldn't` — which the repair
had just added — so removing the gloss would have made the item worse, not
better.

`m17`: agree that the gloss is load-bearing (it is what makes the exclusion of
`had better` airtight, and that is the one direction this category can be
tested in), but note that the item now carries *two* answer-shaped phrases:
*"nothing depends on it"* and *"in my opinion"*, the second of which is
verbatim the `decision` block's R5 chip. The item is answerable from that chip
alone.

And the pass wrote a **new** gloss of the same species into m12 — *"so there is
no way of knowing"* — while declining to remove two. Not a defect in m12 (§9.6),
but the principle should be applied in one direction or the other.

---

## 9. Findings, ordered by my own doubt — most confident first

### 9.1 `m24`'s `can` is accepted English, and its lesson states a false rule — **blocking, category 6**

> "Once you finish this course, you ____ speak with much more confidence in job
> interviews and everyday conversations." — key `will be able to`, `can` on
> offer.

*Once you finish this course, you can speak with much more confidence* is
normal English: a temporal or conditional clause licenses `can` with future
reference freely (*when you're eighteen you can drive*; *once the form is in,
you can start*). Nothing in the paragraph pushes against it. The blind reviewer
recorded exactly this in `blind-oldest.md` §1 — *"'can' is acceptable informally
after 'Once you finish'"* — and then classed m24 in §4 as *passed with a
recorded note but not a defect*, so it never reached that report's §2 findings
table, which is what the repair worked from. I think the note was the finding
and the classification was the error: an option that is acceptable English in
the paragraph as written is the definition of the defect
`question-author.md` rule 2 names, whatever the register.

Worse, the item's supports are false as written. Lesson 6 block 0:
*"'can' bir modaldir, yani **gelecekte kullanılamaz**"*, and m24's `can` note:
*"'can' bir modal olduğu için **geleceğe taşınamaz**"*. Both are wrong — *I can
meet you tomorrow* is future reference on `can`. The true statement is the one
the same lesson's `decision` R4 already makes correctly: `can` has no
infinitive, so it cannot follow `will`; for an ability that does not yet exist,
use `will be able to`. The item's `explanation` argues against `will can`,
which is not an option, and never argues against `can`, which is.

Least doubt of anything here: the English fact is not arguable, the false rule
is quotable, and a second reader reached the same place blind.

### 9.2 `m1`'s `have to` — the log's justification is wrong even though the item survives — **worth fixing, category 1**

> "I ____ finish this report tonight — nobody is forcing me, but I promised my
> manager and I don't want to let her down." — key `must`, `have to` on offer.

*"I have to finish this report tonight — nobody is forcing me, but I
promised"* is completely ordinary English. `have to` is not marked for the
source of the obligation; it is the general-purpose obligation form, and
speakers use it for self-imposed obligations constantly (*I have to call my
mum, I promised*). The must/have-to split is a teaching heuristic — which is
precisely the argument the repair itself makes to justify rewriting m2: *"a
speaker reporting an external rule still says `must` freely."* The mirror of
that sentence is true too, and the log does not notice: a speaker under a
self-imposed obligation still says `have to` freely.

So the log's claim that *"`have to` is genuinely odd there"* is the one
sentence in it I would strike. I stop short of blocking the category because
the paragraph plants an explicit disambiguator (*"nobody is forcing me"*),
which makes `must` the clearly better answer, and because three prior reads —
the blind pass (certain, "also works?": no), `lessons-oldest.md` (*"t1 is
defensible inside the taught system"*) and `option-notes-5.md` (which lists
t2, t19 and t6 as accepted-option items and not t1) — all passed it. My doubt
is real: I would not be surprised to be wrong about how much work *"nobody is
forcing me"* does.

What is not in doubt is the coverage consequence, which the log states and
then waves away: after this repair, `have to` is never keyed anywhere in the
topic, and m1 is the only item on which the category's headline contrast does
any work at all.

### 9.3 `m3`'s new `shouldn't` — **worth fixing, category 1, introduced by this repair**

*Passengers shouldn't use their phones during takeoff and landing; it's
strictly forbidden by the airline for safety reasons* is a sentence a speaker
can produce — advice, backed by the fact that it is forbidden. What makes it
wrong is pragmatic rather than semantic: the same speaker asserts something
stronger in the next clause, so the advice understates their own evidence.
That is a real exclusion, and a thinner one than the two the item already had.

I did not block on it because of that pragmatic tension, and because the
option genuinely adds a third failure mode to an item that previously had one
distractor in three costumes — which was the finding it was fixed for. But the
repair's own defence of the choice (the analogy to old-m4) does not hold
(§4.1), so the option is standing on a different argument from the one the log
made for it.

### 9.4 `m1` is built on its own lesson's contrast sentence — **worth fixing, category 1**

Lesson 1 `contrast` › Must: *"I must call my mother tonight — I promised
her."*
m1: *"I ____ finish this report tonight — nobody is forcing me, but I promised
my manager…"*

Same modal, same *tonight*, same *I promised*. `checkLessonGiveaway` cannot see
it (longest shared run: two words), which is exactly the case
`question-author.md` rule 1 exists for: a `check` block draws from this
category, so the learner can meet the answer three blocks above the question.
The repair replaced four sentences in this lesson to drive the mechanical count
to zero and left the one that is closest to a shipped item — which is the
characteristic failure mode of repairing to a counter.

### 9.5 The `Can vs Could vs Be Able To` decision rule 3 is item-shaped — **note, category 6**

The chip `"once you finish"` was item-derived and is gone; its replacement,
*"cümle onu bir kursun, bir eğitimin ya da bir sürecin bitmesine bağlıyor"*,
describes m24's scenario at least as closely. A string match became a
paraphrase, so the check is silent and the derivation is intact. Compare
category 1's replacement rule (*"ihtiyaç zaten karşılanmış ya da başkası
hallediyor"*), which really is general — that is what this one should look
like.

### 9.6 `m12`'s new gloss — **note**

*"so there is no way of knowing"* labels the evidence instead of leaving the
learner to weigh it; the counter-evidence (*"people leave things behind here
all the time"*) has already done the work. It is the same species as the m3 and
m17 glosses the same pass declined to touch on the blind reviewer's advice.
The item is sound either way, and if one of the two clauses were dropped I would
drop the label, not the counter-evidence.

### 9.7 The tone `decision` block has no entry condition — **note, category 2**

TR1 names a *setting* (*"arkadaş, aile ya da sınıf arkadaşı"*), so a learner
running the lesson top-down can fire it on m7's party and answer `Can`, which
is not an option. Recoverable, one clause to fix, and worth fixing while the
category is open anyway for §4.3.

### 9.8 Lesson 3's `might` example note says *"kanıt yok"* beside a sentence that gives evidence — **note**

Sentence moved by this pass, note not re-read. One clause.

### 9.9 Where my doubt is highest — `m6` and `m19`, the two items I blocked on

Both are judgement calls about what a competent teacher accepts, and both could
go the other way.

**`m6`'s `must be` (§4.3).** My case is that `must + be + V3` with an
institutional subject and a deadline is *the* deontic passive frame, and that
nothing in the paragraph excludes a requirement. The case against me is that
the concessive clause (*"though the office has not put up a notice yet"*)
frames the whole utterance as speculation, and a reader who takes that framing
will not reach for a rule that is never mentioned. I think the frame is not
strong enough to override the collocation, and I note that this is the same
defect `option-notes-5.md` reported on the item before it was rewritten — which
is why I weighted it as blocking rather than as a note. If the next pass
disagrees, the cheap fix is to remove the deadline (*"before the weekend"* →
*"at some point next week"*), which kills the deontic reading outright.

**`m19`'s `must` (§0, category 5).** *"As the eldest sibling, she must set a
good example for the younger ones, even when it's not easy"* is accepted
English with the same responsibility reading as `ought to`, and unlike m1 there
is nothing in the paragraph pushing against it — no *"nobody is forcing me"*,
no formality marker, nothing. The item's `explanation` argues only against
`had better` and never mentions `must` at all; the `optionNote` that does argue
against it (*"Konuşmacının o an koyduğu kesin bir zorunluluk"*) re-runs the same
internal/external heuristic that §9.2 says does not hold. Two prior passes
flagged this — `blind-oldest.md` §2 as a D1 note, `option-notes-5.md` as an
option a competent teacher would accept — and the repair left it with a stated
reason: it cannot be fixed by adding `should` (two right answers) and rewriting
it as a form item would give the category two form items out of four. That
reasoning is sound as far as it goes, and I still cannot call a category
shippable whose second-weakest item has an accepted second answer that three
readers have now named. The honest resolution is not another item edit: it is
the category-spec escalation the repair asks for in its own §6.

**Below both of those, and worth stating so the next pass does not re-derive
it:** I examined `m9`'s `might`, `m21`'s `could`, `m22`'s `was able to` and
`m20`'s `don't have to` and did **not** block on any of them. In each case the
paragraph does push against the alternative — the *since*-clause on m9, the
absence of a past frame on m21, the split *"was able to already read"* on m22,
the danger-not-necessity argument on m20. Three of those four are the blind
reviewer's own "also works" notes from `blind-oldest.md` §1 (m9, m21, m22);
none of the §1 notes on m21, m22 or m24 reached that report's §2 findings
table, and therefore none of them reached the repair, which worked from §2.
That routing gap is worth a line in the next brief: **§1's `also works?`
column is a findings list too** — it is the column that caught §9.1, which is
the one finding in this report I have no doubt about.

---

## 10. What I did not check

- `data/passive-voice/passive-voice.json`, and every check result naming it.
  Another session owns that file this hour; the two `npm run check` failures
  are its unformatted state, not modals.
- The app. Nothing in this pass touched `js/`, `css/` or the HTML, so
  `npm run verify` was not run.
- The other seven topics, except where a corpus-wide check reads them
  (near-duplicate stems, scenario over-use) — those ran and are silent on
  modals.
- Whether the six categories are the right taxonomy. Two of my three blocking
  findings (§8.2, §9.9) end at that question, and it is the supervisor's.

Not committed. Not pushed.
