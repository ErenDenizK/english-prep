# Second repair round — `data/modals/modals.json`

2026-09-05. Scope: `data/modals/modals.json` only. Task list:
`docs/audit/re-audit-modals.md` §0 — the three categories that did not
ship (`m6`, `m19`, `m24` + its lesson), the §9 doubts, and the routing gap
§9.9 names (`blind-oldest.md` §1's `also works?` column for m9, m21, m22,
m24).

`data/passive-voice/passive-voice.json` is another session's this hour. I
did not open it. Any check output naming it is theirs, and is called out
where it appears below.

**Baseline before touching anything**

- `checkLessonGiveaway` over this topic, driven directly: **0 warnings**.
- `node tools/format-content.mjs --check`: modals canonically formatted.
- `npm test`: green (recorded again at the end).

---

## 0. What changed

| # | change | why |
| --- | --- | --- |
| 1 | `m6` — paragraph, explanation, tip, all three `optionNotes` rewritten; options `may be` / `can be` / `must be` / `maybe` kept | re-audit §0/§4.3: `must be` was the ordinary deontic passive and nothing excluded a requirement |
| 2 | lesson 2 › `decision` "Hangi tonu seçeceksin" › rule 1 — entry condition added | §9.7: the block had none, and TR1 fired on `m7` |
| 3 | `m19` — paragraph, explanation, tip, options and all three `optionNotes` rewritten | re-audit §0/§9.9: `must` was accepted English with the key's own reading, flagged by three passes |
| 4 | `m24` — paragraph, options and all three `optionNotes` rewritten; explanation and tip rewritten | §9.1: `can` is accepted after a temporal clause |
| 5 | lesson 6 › intro `text` — *"'can' bir modaldir, yani gelecekte kullanılamaz"* replaced | §9.1: the claim is false about English |
| 6 | lesson 6 › `pitfall` 2 `why` — *"'can' … gelecekteki bir yeteneği anlatamaz"* narrowed to the true claim | same falsehood, weaker form, same lesson |
| 7 | lesson 6 › `decision` rule 3 — generalised | §9.5: the rule was item-shaped |
| 8 | lesson 1 › `contrast` › Must example replaced | §9.4: `m1` was built on it |
| 9 | lesson 3 › `examples` 5 note — *"kanıt yok"* corrected | §9.8: the note denied the sentence beside it |

Nothing else in the file changed. No code, no manifest, no other topic.

---
## 1. `m6` — the item the last round rewrote, rewritten again

**Before** — *"The last marker handed in her scripts this morning; the
results ____ announced before the weekend, though the office has not put
up a notice yet."*

The re-audit's case (§4.3) is right and I re-derived it before accepting
it. `must + be + V3` with an institutional subject and a deadline is the
canonical deontic passive of English (*applications must be submitted by
Friday*), the paragraph named an institution (the office) and a deadline
(before the weekend), and nothing in it excluded a requirement. The
concessive clause frames the utterance as speculation only if you have
already decided the reading is epistemic; it does not stop *must* meaning
*is required to be*. Two further things the re-audit says are also right:
the defence in the first repair log (§7.3) confuses a passive auxiliary
with a copula, and `marker` / `scripts` are narrow British academic
register in the clause that carries the item's evidence.

**Two structural decisions, before any wording:**

1. **The complement is no longer a past participle of a controllable
   action.** That is what made the deontic reading available at all:
   anything a person can be told to do, a person can be *required* to do.
   With an adjectival/PP complement describing a state nobody controls
   (`out of order`), the deontic reading is not weakened, it is
   unavailable — you cannot require a lift to be broken.
2. **The `be` is now a copula, which is where `can` genuinely fails.**
   The old exclusion of `can be` was weak (§4.3: *can be announced* really
   does mean *it is possible for them to be announced*, which the first
   clause set up). The lesson's own `pitfall` 1 — *"She can be at the
   office, I'm not sure"* — is a copula, and that is exactly the frame in
   which `can` cannot state the likelihood of a specific situation. The
   distractor is now wrong for the reason the lesson teaches instead of
   for a reason the paragraph has to supply.

**After** — *"The lift has been standing with its doors open since
yesterday morning and the small display above the buttons is dark. It
____ out of order again, though the caretaker leaves it exactly like this
whenever he cleans the entrance hall."* Options unchanged: `may be` /
`can be` / `must be` / `maybe`, keyed `may be`.

The exclusion of `must be` is carried by *"leaves it exactly like this"*:
the rival explanation covers the whole of the evidence, not merely some of
it, and `must` is the modal that requires there to be no other
explanation. The key survives the same clause because the doors have been
open **since yesterday morning** — longer than a cleaning — so the fault
stays a serious option, which is precisely lesson 2's gloss for `may`
(*"makul bir ihtimal … konuşmacı bunu ciddi bir seçenek olarak
görüyor"*).

**Every wrong option substituted, one judgement each:**

| option | filled | would a competent teacher accept it? |
| --- | --- | --- |
| `can be` | *It **can be** out of order again, though the caretaker leaves it exactly like this whenever he cleans the entrance hall.* | **No.** Two failures at once: `can be` + a state gives the generic/habitual reading (*it is sometimes out of order*), which `again` and the perfect in the first sentence both fight, and a concessive clause attached to a generic statement is incoherent. This is lesson 2 `pitfall` 1 with the words changed. |
| `must be` | *It **must be** out of order again, though the caretaker leaves it exactly like this whenever he cleans the entrance hall.* | **No.** The deontic reading is gone with the participle — nothing can require a lift to be out of order — and the epistemic reading asserts certainty in the same breath as conceding an explanation that fits the evidence exactly. `must` is the "no other explanation left" modal; the sentence hands the learner the other explanation. |
| `maybe` | *It **maybe** out of order again, …* | **No.** Not a form: an adverb in a slot that needs a verb. Lesson 2 `pitfall` 2, and the live Turkish-learner error the item exists to spring. |

**What I did not claim to fix.** The category still cannot separate `may`
from `might` or `could` on meaning — re-audit §8.2, which is a
category-spec question and the supervisor's. m6 does not offer them, so
the item is sound; the *category* is sound only in the sense that each
item excludes its own three options. I have not made that escalation go
away and I am not pretending to.

**Second-order checks on the new paragraph:** 40 words, one blank, the
deciding clause sits at the far end of the passage from the blank; no
sentence of lesson 2 shares a run with it (`checkLessonGiveaway` still 0,
and I read the lesson for the near-misses the check cannot see — the
closest is the `May` contrast example *"Her flight may be delayed because
of the fog"*, which shares a frame with nothing here); the scenario is
new to the corpus (no lift, no caretaker anywhere in `data/`), and the
near-duplicate and scenario-share checks in `tools/content-checks.mjs`
are silent on it.

---
## 2. `m19` — three passes flagged `must`; `must` is gone

**Before** — *"As the eldest sibling, she ____ set a good example for the
younger ones, even when it's not easy."* — `ought to` / `had better` /
`must` / `can`.

I agree with the re-audit, and with the two passes before it. *"As the
eldest sibling, she must set a good example for the younger ones"* is
ordinary English carrying the same role-responsibility reading as the key.
The item's own `optionNote` argued against it with the internal/external
heuristic (*"konuşmacının o an koyduğu kesin bir zorunluluk"*) that the
first repair had already shown to be unreliable in the other direction
(§9.2), and the `explanation` never mentioned `must` at all. I also think
`can` was softer than anyone recorded: *"she can set a good example …
even when it's not easy"* is a sentence, and the concessive fits an
ability reading as well as an obligation one.

**Why I did not repair it by rewriting the paragraph.** I tried, and every
attempt failed the same way. `must` for a moral or role obligation is not
excluded by removing an authority, by removing a rule, or by hedging the
duty — *"It's not in the rules, but a captain must thank the volunteers"*
is fine English. There is no paragraph in which `ought to` is right and
`must` is wrong for this category's reading of `ought to`. So the option
had to go, and with it `can`, which was out of category anyway.

**After** — *"Reading the accounts aloud at the annual meeting is not in
the association's rules, and nobody would complain if the treasurer
skipped it — but she ____ do it anyway, because the members have expected
it for years."* — `ought to` / `had better` / `should to` / `shouldn't`,
keyed `ought to`.

Every option is now in category, which m19 could not previously claim
(it carried two imports), and the three failure modes are distinct: a
consequence the paragraph denies, a form that does not exist, and a
reversal of the advice.

| option | filled | would a competent teacher accept it? |
| --- | --- | --- |
| `had better` | *…nobody would complain if the treasurer skipped it — but she **had better** do it anyway, because the members have expected it for years.* | **No.** `had better` carries a bad consequence for not complying, and the paragraph denies one in as many words: *nobody would complain*. This is m17's exclusion device (*"nothing depends on it"*), which the re-audit called airtight; it is the only device this category has for excluding `had better` on meaning, and I say so rather than pretend the two items differ. |
| `should to` | *…but she **should to** do it anyway…* | **No.** Not a form. It is the exact mirror of the lesson's `pitfall` 2 (*"'Ought', 'should'ün aksine, kendisinden sonra mutlaka 'to' alır: İki kalıp tam ters yönde hataya açıktır"*), whose other direction — bare `ought` — m18 already springs and whose own direction nothing in the corpus tested. Rule 3 sanctions it explicitly: `had better to` is the model, and this is the same error. |
| `shouldn't` | *…nobody would complain if the treasurer skipped it — but she **shouldn't** do it anyway, because the members have expected it for years.* | **No**, twice over: it contradicts the final clause (*the members have expected it for years* is a reason to do it, not to refrain), and it makes the contrastive *but* incoherent — the first half already says she may skip it. |

**The key.** `ought to` is keyed on what the lesson keys it on: a
continuing responsibility attached to a role (*the treasurer*), formal in
tone, with no urgency and no threatened consequence. `should` is not on
offer, so the synonymy that makes this category hard is not in the item —
the same manoeuvre the re-audit accepted at m18, but at no cost here,
because the key is still decided by meaning against `had better` and
`shouldn't` rather than by form.

**Second-order checks:** 35 words, one blank; the clause that excludes
`had better` sits in the first half, well away from the blank; no run
shared with any sentence of lesson 5 (closest: *"Doctors ought to explain
the risks to their patients"*, two words); scenario new to this topic. I
noticed `treasurer` also occurs once in
`data/relative-clauses/relative-clauses.json` (a hiking club's treasurer
arranging refunds) and changed *club* to *association* so the two stems
share one word rather than two. The corpus checks were silent either way.

---
## 3. `m24`, and the false rule its lesson taught

### 3.1 The lesson first

The re-audit's §9.1 is the finding I have least doubt about too, and it
has two halves. The English fact: *Once you finish this course, you can
speak with much more confidence* is standard — a temporal or conditional
clause licenses `can` with future reference (*when you're eighteen you can
drive*), and nothing in the paragraph pushed against it. The teaching
fact: lesson 6 asserted the opposite in a form that is simply false —

> *"Üstüne 'can' bir modaldir, yani **gelecekte kullanılamaz**"* (intro
> `text`), echoed by m24's own note: *"'can' bir modal olduğu için
> **geleceğe taşınamaz**"*.

*I can meet you tomorrow* refutes both. A learner who believes the rule as
written will mark a correct sentence wrong, which is worse than getting
one item wrong. The true statement is the one the lesson's own `decision`
R4 already made correctly, and it is now what the lesson says:

- **intro** → *"'can' şu anki yeteneği anlatır ve mastar hâli yoktur —
  'will can' kurulamaz — yani henüz kazanılmamış bir yetenek 'will be able
  to' ister"*.
- **`pitfall` 2 `why`** (the weaker form of the same falsehood: *"'Can' …
  gelecekteki bir yeteneği anlatamaz"*) → *"'Can' şu anki yeteneği
  anlatır; henüz kazanılmamış, ileride ortaya çıkacak bir yeteneği
  anlatamaz. 'will can' de kurulamaz, çünkü 'can'in mastar hâli yoktur…"*.

I checked the corrected claim against every other block of lesson 6 and
against all four of its items: the `forms` row (`Can` / *"Şimdi, genel
yetenek"*) agrees, the two `contrast` sides are about the past and are
untouched, `pitfall` 2's own wrong/right pair (*Next month, you can cook
without a recipe*) is still wrong under the narrower claim — it is an
ability being acquired — and `decision` R4 is now the intro's own
sentence rather than its contradiction.

**`decision` R3 generalised** (§9.5). *"Yetenek henüz yok; cümle onu bir
kursun, bir eğitimin ya da bir sürecin bitmesine bağlıyor"* described
m24's scenario more precisely than the item-derived chip it replaced — a
string leak turned into a paraphrase leak. It now reads *"Yetenek şu anda
yok; cümle onu ileride kazanılacak bir şey olarak anlatıyor"*, which is
the shape category 1's replacement rule has. Re-run over all four items in
§4.3 below.

### 3.2 The item

**After** — *"When the Japanese course began in October he could barely
tell the characters apart, but he has been going twice a week ever since.
His teacher says that by the end of the summer he ____ read a whole page
of a newspaper without a dictionary."* — `will be able to` / `can` /
`will can` / `was able to`, keyed `will be able to`.

Three deliberate changes to what the item rests on:

1. **The temporal clause is gone.** *Once you finish this course* was the
   licence `can` was using; the frame is now a future time adverbial over
   an ability that does not exist yet, which is the one environment where
   `can` genuinely cannot go.
2. **`could` is gone.** It was never flagged, but it has a live
   tentative-future reading (*by the summer he could read a whole page*
   is a hedged prediction), and shipping a second accepted option while
   repairing the first would have been this round's own version of the m6
   defect.
3. **`will can` replaces it.** m24's `explanation` had argued against
   `will can` for months while `will can` was not an option — the
   re-audit noticed (§9.1: *"argues against 'will can', which is not an
   option, and never argues against 'can', which is"*). It is now an
   option, so the argument has a target, and the lesson's `pitfall` 2 has
   a spring for the first time. Dead to a fluent reader, live to this
   audience, and rule 3 names exactly this case.

| option | filled | would a competent teacher accept it? |
| --- | --- | --- |
| `can` | *…his teacher says that by the end of the summer he **can** read a whole page of a newspaper without a dictionary.* | **No.** `can` speaks from now, and the paragraph says the ability does not exist now (*could barely tell the characters apart*). The two readings that rescue future `can` elsewhere are both unavailable: there is no temporal or conditional clause, and reading a newspaper is not something anybody grants permission or makes an arrangement for. |
| `will can` | *…by the end of the summer he **will can** read…* | **No.** Not a form: `can` has no infinitive. The error a Turkish learner produces from *okuyabilecek*, and the one the lesson's `pitfall` 2 exists for. |
| `was able to` | *…by the end of the summer he **was able to** read…* | **No.** A single past achievement inside a clause pointing at next summer; the tense clash is total and the paragraph's *has been going … ever since* keeps the frame open to the future. |

**On the item's supports:** `explanation` and `tip` were rewritten and now
argue against `can` — the option that is on offer — first; the `can` note
no longer contains the false rule; the three notes match the three
options exactly.

**Second-order checks:** 46 words, one blank, ability-does-not-exist-yet
evidence in sentence 1 and the future frame in sentence 2; the closest
lesson sentence is `examples` *"By September, she will be able to drive on
the motorway"* — four shared words, under the six-word threshold, and the
frames differ (mine puts the adverbial inside a reported clause and the
lesson's at the front). The former giveaway pair — lesson `pitfall`
*"Next month, you can cook without a recipe"* against the old item — is
not reintroduced: nothing in the new stem is cooking, a recipe, or a bare
month adverbial.

---
## 4. The `decision` blocks re-run, rule by rule in file order

Two blocks changed (lesson 2's tone block, lesson 6's rule 3) and two
categories got a new item without a block change (5, and 2 again), so all
four of those blocks were run as literal checklists over all four items in
their category. Categories 1 and 3 were run too, because a lesson sentence
moved in each. Convention as in the re-audit: the first rule that fires,
and whether the form it names is an option on that item.

### 4.1 Lesson 2, tone block — the entry condition (§9.7)

R1 was *"Ortam samimi: arkadaş, aile ya da sınıf arkadaşı"* → `Can`, and
it names a **setting**, so a learner running the lesson top-down fired it
on m7's party and answered `Can`, which is not an option. It now reads
*"Cümle birinden bir şey istiyor (izin ya da rica) ve ortam samimi:
arkadaş, aile ya da sınıf arkadaşı"*.

```
TR1 cond   birinden bir şey istiyor (izin/rica) + ortam samimi → Can
TR2 signals please · possibly · if you don't mind · I'm sorry to bother you → Could
TR3 cond   resmî ortam, otorite figürü                        → May
```

| item | first rule to fire | returns | key | on offer | misfire |
| --- | --- | --- | --- | --- | --- |
| m5 | TR1 — a request, and *"the friend sitting beside her"* | Can | Can | yes | none |
| m6 | none — not a request | — | — | — | none, and now for the right reason: before the change TR1 could not tell |
| m7 | **none** — not a request, so TR1 no longer fires | — | might | — | **the §9.7 misfire is closed** |
| m8 | TR2 — *"possibly"* (TR1 declines: a request, but the addressee is a stranger) | Could | Could | yes | none |

### 4.2 Lesson 2, possibility block — unchanged, re-run for the new m6

```
PR1 cond   soru biçiminde ve birinden bir şey istiyor → Can/Could/May (ton bloğuna dön)
PR2 signals I'm not sure · perhaps · I doubt it · it depends → Might
PR3 cond   ihtimal ciddi bir seçenek, belirsizlik ayrıca vurgulanmıyor → May
PR4 cond   belirli bir olayın ihtimali ise 'can' şıkkını ele → May / Might
```

| item | first rule to fire | returns | key | on offer |
| --- | --- | --- | --- | --- |
| m5 | PR1 → tone TR1 | Can | Can | yes |
| m6 | PR3 (PR2 declines — none of its four chips is in the new paragraph) | May | may be | yes |
| m7 | PR2 — *"I'm not sure"* | Might | might | yes |
| m8 | PR1 → tone TR2 | Could | Could | yes |

The re-audit called m6's line the soft one, because the block reached the
key partly through the option set. That is better than it was — PR4 now
names the `can be` distractor and eliminates it explicitly, and PR3's
condition (a serious option, uncertainty not separately emphasised) is
what the new paragraph is built to satisfy — but it is not *solved*: PR3
and PR2 divide `may` from `might`, and the item does not offer `might`. I
record that as unchanged, not fixed. It is §8.2 and it is the
supervisor's.

### 4.3 Lesson 6 — with R3 generalised

```
R1 signals despite · in the end · finally · after a long struggle → Was / were able to
R2 signals next year · by the time you graduate · in the future · one day → Will be able to
R3 cond   yetenek şu anda yok; ileride kazanılacak bir şey olarak anlatılıyor → Will be able to
R4 cond   cümlede zaten 'will' ya da başka bir modal varsa      → Be able to
R5 cond   geçmişte bir dönem süren genel yetenek                → Could
R6 cond   şu anki genel yetenek                                 → Can
```

| item | first rule to fire | returns | key | on offer | note |
| --- | --- | --- | --- | --- | --- |
| m21 | R6 (R3 declines: the ability exists now) | Can | can | yes | ✓ |
| m22 | R5 — *"When she was only five years old"* (R3 declines: past, not future) | Could | could | yes | ✓ |
| m23 | R1 — *"Despite"* | Was / were able to | was able to | yes | ✓ |
| m24 | R2 if the learner reads *"by the end of the summer"* as the same species as *"by the time you graduate"*; otherwise R3 | Will be able to | will be able to | yes | ✓ either way |

No misfires, and the generalised R3 still carries m24 without describing
it: it declines on m21 and m22 for two different reasons, which is what a
rule that is not item-shaped looks like. R4 continues to fire on nothing
in this set — a second untested rule alongside category 1's R5, recorded
by the re-audit and not something an item edit should manufacture work
for.

### 4.4 Lesson 5 — unchanged block, new m19

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
| m19 | R4 | *"the treasurer … the members have expected it for years"* | Ought to | ought to | yes |
| m20 | R3 | risk, consequence not certain | Shouldn't | shouldn't | yes |

Four items, four rules, no misfires — the property the re-audit called the
cleanest piece of the last repair, and the new m19 keeps it. R1 and R2
both decline on m19 (no chip; *nobody would complain* denies the
consequence), which is the same fact that excludes the `had better`
option.

### 4.5 Lessons 1 and 3 — blocks untouched, re-run anyway

Category 1 is unchanged item-side; only the `contrast` › Must **example**
moved (§5.1). R1 still fires on m3, R3 on m4, R4 on m2, R6 on m1, and the
new example models R6 (*"zorunluluğu koyan konuşmacının kendisi"*) rather
than fighting it. Category 3 is unchanged except one `examples` note
(§5.2); R1 fires on m9, R2 on m10, R3+R4 on m11, R3 on m12, exactly as
the re-audit recorded.

---
## 5. The two lesson sentences that moved for a reason other than my three items

### 5.1 Lesson 1 › `contrast` › Must — §9.4

*"I must call my mother tonight — I promised her."* against m1: *"I ____
finish this report tonight — nobody is forcing me, but I promised my
manager…"*. Same modal, same *tonight*, same *I promised*, noun swapped.
`checkLessonGiveaway` scores two words and stays silent; rule 1 is not
about word runs. I agree with the re-audit and fixed it in the lesson
rather than in the item, because m1 is in a category that ships and
rewriting a shipping item to close a lesson leak is the more expensive of
the two moves.

New example: *"I must start going to bed earlier — I keep falling asleep
in lectures."* It models the same thing the gloss claims (an obligation
the speaker puts on themselves, *kendi kararı*), it is not the promise
frame, and it shares two words with nothing in the category. The other
three sides of the two `contrast` blocks and the `forms` examples were
re-read against it: no duplication (`forms` › Must/Olumlu is *"I must
remember to renew my passport"*, a different self-imposed shape).

### 5.2 Lesson 3 › `examples` — §9.8

*"She hasn't texted back. She might be asleep."* carried the note *"Zayıf
tahmin, **kanıt yok** → might"*. The sentence supplies evidence — she has
not texted back — so the note denied the sentence in front of it. The last
pass moved the sentence without re-reading the note; I agree with the
finding and the note now reads *"Kanıt var ama zayıf, başka açıklamaya da
yer bırakıyor → might"*, which agrees with the `contrast` gloss for
Might/Could (*"mümkün, ama konuşmacı hiç emin değil"*) and with the
block's own R3 (*"aynı kanıt birden fazla açıklamaya izin veriyor"*). It
now reads close to the `could` example's note beside it — the two forms
are one side of this lesson's contrast, so that is honest rather than
sloppy.

I made this change even though category 3 ships and is not on my list,
because it is a note that contradicts its own example. That is a
correctness fix, not a judgement call.

---

## 6. Verdicts on §9's doubts — every one, including those I left alone

| § | finding | my verdict | acted? |
| --- | --- | --- | --- |
| 9.1 | m24's `can`; lesson 6's false rule | **Agree, without reservation.** The English fact is not arguable and the false rule was quotable. | fixed — §3 |
| 9.2 | m1's `have to` is accepted; the first log's *"genuinely odd there"* is wrong | **Agree on the language, agree on not blocking — but I put it higher than the re-audit does.** *"I have to finish this report tonight — nobody is forcing me, but I promised"* is completely ordinary English; `have to` is not marked for the source of the obligation. What holds the item up is not that `have to` is odd but that *"nobody is forcing me"* is a planted disambiguator that makes `must` the better answer, which is a thinner defence than the category's headline contrast deserves. | **not fixed**, deliberately — see §7 |
| 9.3 | m3's new `shouldn't` is a thinner exclusion than the last log claimed | **Agree, and agree it does not block.** The last log's analogy to old-m4 does not hold: there `shouldn't` was contradicted by the paragraph, here it is merely weaker than the key. But *"it's strictly forbidden by the airline"* is the same speaker asserting something stronger in the next clause, and that is the textbook mustn't/shouldn't contrast rather than an accepted second answer. | not fixed |
| 9.4 | m1 is built on lesson 1's `contrast` sentence | **Agree.** | fixed in the lesson — §5.1 |
| 9.5 | lesson 6's `decision` R3 is item-shaped | **Agree.** A paraphrase leak is still a leak; the check going silent is not the same as the derivation going away. | fixed — §3.1 |
| 9.6 | m12's new gloss *"so there is no way of knowing"* | **Agree it is a note and not a defect, and I left it.** The counter-evidence (*people leave things behind here all the time*) already does the work, so the label is redundant; but m12 is in a shipping category, the item is sound, and removing a clause from a sound item to satisfy a stylistic principle is exactly the kind of unforced edit that has introduced defects here before. Worth a line in the next brief, not a rewrite. | not fixed |
| 9.7 | the tone `decision` block has no entry condition | **Agree**, and it was one clause in a lesson I had to open anyway. | fixed — §4.1 |
| 9.8 | lesson 3's `might` note says *"kanıt yok"* beside a sentence with evidence | **Agree.** | fixed — §5.2 |
| 9.9 | the two blocking calls (m6, m19) and the four items examined and passed | **Agree with both blocks** — and note that the re-audit's own suggested cheap fix for m6 (*"before the weekend"* → *"at some point next week"*) would not have been enough on its own: it removes the deadline but leaves a passive of a controllable action with an institutional subject, which is where the deontic reading lives. That is why §1 changes the complement rather than the time phrase. | fixed — §1, §2 |

---
## 7. The routing gap — `blind-oldest.md` §1's `also works?` column

§9.9 is right that §1's last column is a findings list in its own right:
its definition (*"grammatical **and** plausible in the paragraph as
written — a sentence a competent teacher would have to think about before
marking it wrong"*) is `question-author.md` rule 2 restated. Four modals
rows carry a note there; none of the four reached that report's §2 table.
All four re-derived against the file as it stands today:

| row | §1's note | current state | verdict |
| --- | --- | --- | --- |
| m24 | *"'can' is acceptable informally after 'Once you finish'"* | the note was the finding and the classification was the error | **a real defect — fixed this round** (§3). It is the one item in the whole modals corpus that reached three passes with an accepted second answer and no repair, and it got there by being filed in the wrong column. |
| m22 | *"'was able to' only at the cost of splitting 'already read'"* | *"she **was able to** already read entire novels on her own"* — the adverb is stranded; the sentence a speaker would produce is *was already able to*, which is not the option | **excluded, and on two grounds**: word order, and the general-ability meaning the paragraph builds (*when she was only five*, a period, not an occasion). Agree with the re-audit; nothing to do. |
| m21 | *"'could' available on a past reading of the anecdote"* | *"My little brother **could** solve a Rubik's cube in under a minute — it's honestly one of the most impressive things I've ever seen him do."* | **excluded, thinly.** Nothing in the paragraph opens a past frame, and a bare `could` without one drifts to the hypothetical (*would be able to*), which is a different claim; the present-tense second clause keeps the ability current. I would not block on it, and I record that it is category 6's thinnest exclusion now that m24 is repaired. |
| m9 | *"'might' is grammatical, merely under-committed"* | *"it **might** be the best place in town, since it's always this crowded"* | **the one I am least comfortable leaving.** A speaker can offer grounds and still hedge, so the sentence is sayable; what excludes it is that the `since`-clause presents the crowd as *sufficient* grounds, which is what `must` is for and what `might` throws away. Two readers have now named it (the blind pass and the re-audit, which examined it and declined to block). Category 3 ships, it is not on my list, and rewriting a shipping item on my own initiative is how this repository acquires new defects — so I record it rather than touch it, and I would put it at the top of the next brief for category 3. |

The routing lesson, stated so the next reviewer inherits it rather than
rediscovering it: **an `also works?` note is a finding, and a report's
findings table must contain it.** Where a reviewer wants to record an
alternative without blocking, that belongs in the table with a severity of
*note*, not in a column the repair pass never reads.

---

## 8. What I did not do, and why

- **`data/passive-voice/passive-voice.json`.** Not opened. Another session
  owns it, and by the time I ran the checks it had landed its work: unlike
  the re-audit, I saw no unformatted file and no warning naming it. My own
  giveaway runs are scoped to `data/modals/modals.json` (**0 before, 0
  after**); the corpus-wide run I did at the end, over all ten topics, is
  also 0, so nothing I wrote moved the ratchet in either direction.
- **m1's `have to` (§9.2) and m3's `shouldn't` (§9.3).** Category 1 ships;
  the re-audit did not block on either; one reader has flagged each. The
  escalation rule the brief applies to m19 — *an item three independent
  readers cannot defend is a defect* — does not yet apply to these. I have
  put my own reading on the record in §6 (I think m1's `have to` is
  accepted English and that only the planted *"nobody is forcing me"*
  saves the item) so that a third reader flagging it can close the loop
  without re-deriving anything.
- **m9's `might` (§7).** Same reasoning, and stated in §7.
- **m12's gloss (§9.6).** Same reasoning, and stated in §6.
- **m7's near-echo of its own lesson.** Not in any report, so it is mine:
  lesson 2's `contrast` › Might example is *"I'm not sure, but I might come
  later."* and m7 is *"I'm not sure yet, but I ____ come to the party later
  tonight…"*. Longest shared run is four words (*but I might come*), under
  the six-word threshold, so `checkLessonGiveaway` is silent — but this is
  the §9.4 species and it is closer than m1 was. I did not fix it: I had
  already opened category 2 for m6, and rewriting a second item in the same
  category on a finding I raised myself, in a round whose entire premise is
  that repairs introduce defects, is the wrong trade. **It should be the
  first line of the next brief for this category**, and the cheap fix is in
  the lesson (change the Might example), not in m7.
- **The category-spec escalations.** §8.2 (this category cannot
  discriminate `may` from `might`/`could` using its own modals) and §9.9's
  reading of m19 both end at the taxonomy, which is the supervisor's. Both
  items now exclude all three of their own options, which is what a repair
  session can deliver; neither makes the taxonomy question go away.
- **The app.** Nothing here touches `js/`, `css/` or the HTML, so
  `npm run verify` was not run.
- **`data/manifest.json`.** Untouched and needs no change: no category
  name, topic title or summary moved.

---

## 9. Checks

| check | result |
| --- | --- |
| `checkLessonGiveaway` over `data/modals/modals.json`, before | **0** |
| `checkLessonGiveaway` over `data/modals/modals.json`, after | **0** |
| `npm run format` | ran after every edit; the file is canonically formatted |
| `npm run validate` | **0 errors**; 2 warnings, both pre-existing and neither in this file (`academic-nouns-adjectives` duplicate option sets, `roadmap.json` detail length) |
| `npm test` | 136/136, including the giveaway ratchet |
| `npm run check` | **green end to end** — `format:check`, `validate`, `color`, `test` |
| `checkLessonGiveaway` corpus-wide, all ten topics, after | **0** |
| mechanical, re-derived per item | 24/24 items: four distinct options, exactly one `____`, `optionNotes` on all three wrong options and none on a key, notes under 160 chars, explanations 40–600 and each naming a wrong option in that option's own words, paragraphs over 15 words |

Not committed. Not pushed.
