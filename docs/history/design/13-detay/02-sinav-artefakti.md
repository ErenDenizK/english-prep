# Arm 2 — the exam artifact itself

Network reality per `00-brief.md`: every `*.edu.tr` domain, `osym.gov.tr`
and every one of its subdomains (`dokuman.osym.gov.tr` included),
`scribd.com`, `memurlar.net`, `uzmanyds.com`, `rehberpanda.com`,
`angoradil.com`, `web.archive.org` — every direct source tried for this
arm — returned `EGRESS_BLOCKED`. `WebSearch` was reachable and is the
only tool that touched real content in this round: its result blocks
often contain verbatim excerpts of the page it found (a search engine's
own cached snippet, not a Claude paraphrase), and I quote those
excerpts below with `[≈]`. Nothing in §1 or §5 is `[S]` — I could not
open a single primary PDF — and that gap is named plainly rather than
papered over.

---

## 1 · What the actual booklet looks like

### 1.1 The four sections, their order, and the points — confirmed

`CLAUDE.md` and `docs/app1-final.md` §2 already state: Cloze 10/15,
Closest meaning 10/15, Reading 14/21, Paragraph completion 6/9, 40/60.
A search snippet quoting an İstanbul Dil Akademisi page on the current
İYS format gives the same **order**, in Turkish, independently of this
repo [≈]:

> *"Sınavın ilk aşaması cloze test, yakın anlam (closest meaning),
> reading ve paragraf tamamlama (paragraph completion)
> bölümlerinden... oluşur."*

So the app's four-section spine (`js/topics.js` §272–276: `cloze`,
`closest-meaning`, `reading`, `paragraph-completion`, in that order,
15/15/21/9 points) matches the sequence the exam itself uses, not just
the point totals. That sequencing is worth keeping visible in the UI
(N2 in `10-ihtiyaclar.md`) precisely because it is the exam's own
sequence, not an invented one.

One caution: other snippets in the same search round describe *older or
adjacent* İYS variants with different numbers — "50 questions... 75
minutes," "45 questions... 50 points," "Use of English ve Reading" as
the only two named parts [≈, multiple mutually-inconsistent snippets,
unreconciled]. The format visibly changed at least once ("Yeni YTÜ İYS
Formatı" is a page title turning up in the same search [≈]), and the
sources found here don't let me date which version is current beyond
trusting `docs/app1-final.md`'s own figure, which the owner already
verified against YTÜ's site before this file existed. I am not
overriding that — I am recording that a naive websearch of "İYS format"
surfaces stale numbers, which is itself a finding: **do not re-derive
the section table from a search each time; it is already sourced once,
correctly, in this repo.**

### 1.2 Option lettering — A) B) C) D), not numbers

A search snippet reproduces an actual YDS dialogue-completion item
verbatim, five options lettered with a closing parenthesis, capital
Latin letters, no space before the parenthesis [≈]:

> *"A) Yazlık tatiller hakkında ne dersiniz?... B) Emin misiniz?...
> C) Bu genç insanlar kaç yaşında?... D) Bu bana çekici gelmiyor...
> E) Orta yaşlı, daha ciddi olanlar hakkında ne dersiniz?"*

YDS itself is five-option (`A`–`E`); İYS-style institutional proficiency
exams are four-option per `CLAUDE.md`'s own "hepsi dört şıklı," so the
transferable fact is the **lettering convention** — capital letter,
closing paren, no full stop — not the count. This is corroborated by
every other ÖSYM-family snippet touched in this round using the same
`A)` `B)` `C)` `D)` shape when quoting item text.

**This app currently does not do this.** `js/answers.js` line 56 labels
each option with `String(index + 1)` — the rendered key is `1 2 3 4`,
not `A B C D`. That is a genuine, checkable artifact-fidelity gap: a
learner who has sat any ÖSYM-family exam expects to hear "the answer is
C," not "the answer is 3," and every real answer sheet (§1.4) is
lettered, not numbered.

### 1.3 Rubric wording — the app invented its own, and it doesn't match

`js/prompt.js` line 16 hard-codes the closest-meaning instruction as:

> `"Aşağıdaki cümleye anlamca en yakın seçeneği bul."`

Two things are off against the register search turned up for the real
item type, again from a quoted excerpt [≈]:

> *"YDS sınavının 68-71. sorularında, verilen cümleye anlamca en
> yakın... cümleyi bulunuz."*

- **`bul` vs `bulunuz`.** ÖSYM instructions use the formal plural
  imperative (`bulunuz`, `işaretleyiniz`, `seçiniz`) throughout, the
  register used for addressing an unknown exam candidate. `bul` is the
  informal singular — correct café-app Turkish, wrong exam Turkish.
  This is a register mismatch a learner who has seen a real booklet
  will register as "not what the exam sounds like," even though the
  words are otherwise close.
- **`seçeneği` vs `cümleyi`.** The real instruction names the object
  being asked for — a *sentence* (`cümleyi`) — not the abstraction
  "option" (`seçenek`). The app's phrasing is generic enough to serve
  as a template for any restatement item, which is presumably why it
  was written that way, but it costs the one thing free fidelity buys:
  sounding like the paper.

For the two remaining rubric families this app will eventually need
(cloze, paragraph completion), search snippets converge on two stable
formulae used across the whole YDS/YÖKDİL/İYS family [≈, repeated
verbatim across independent pages, so treated as reliable despite no
primary fetch]:

> *"1-20. sorularda, cümlede boş bırakılan yerlere uygun düşen sözcük
> ya da ifadeyi bulunuz."* (cloze / sentence-level blank)

> *"19-27. sorularda, aşağıdaki parçada numaralanmış yerlere uygun
> düşen sözcük ya da ifadeyi bulunuz."* (paragraph-internal blanks)

and, for paragraph completion specifically (picking the sentence that
completes a paragraph, not a word):

> *"Hoşunuza giden değil, boşluğa gelebilecek en uygun cümle sizden
> istenmektedir."* — a clarifying aside some prep sources add, worth
> knowing even if it never ships as UI copy: it names exactly the
> mistake this learner's "ear" (`CLAUDE.md` "Who this is for") is
> likely to make on this item type — picking the *nicest* sentence
   instead of the *structurally required* one.

**Concrete recommendation for §3 below:** every rubric line this app
ever ships for a cloze, restatement or paragraph-completion item should
use `bulunuz`/`seçiniz` register and name the object being sought
(`cümleyi`/`sözcüğü`/`ifadeyi`), not a generic `seç`/`bul`. This is a
one-line change to `js/prompt.js` plus writing the two missing
instructions when paragraph completion ships (Block B, `app1-final.md`
§3) — free, and currently wrong.

### 1.4 Page layout, monochrome, answer sheet

Not independently verified this round (every primary source blocked).
What the search snippets converge on, stated at the confidence they
deserve:

- **Monochrome.** No snippet from any ÖSYM-family source this round
  mentioned colour anywhere in a booklet description; several
  emphasize the booklets are strictly access-controlled, reproduced
  only from ÖSYM's own PDF distribution, and copyright-locked — a
  detail relevant to why so few third parties host readable scans.
  `[?]` — I did not see a booklet page directly.
- **Optical answer sheet ("optik form").** Separate from the question
  booklet; candidates bubble one of four/five lettered ovals per row.
  General ÖSYM practice, not İYS-specific: `[≈]`.
- **e-sınav (computer-based) exists as a parallel track for the
  ÖSYM-family exams (e-YDS since ~2018) and is described, in a search
  snippet quoting a prep blog, in terms that map directly onto a
  modern CBT reviewer UI [≈]:**

  > *"Bir soru hem yeşil (cevap verilmiş) hem sarı (işaretli) olabilir
  > — cevabınızdan emin değilseniz şık seçip ayrıca işaretlersiniz.
  > Sınavın sonunda tüm sarı işaretli soruları gözden geçirirsiniz."*
  > *"Herhangi bir soru numarasına tıkladığınızda o soruya atlanır."*

  Green = answered, yellow = answered-but-flagged, a numbered jump
  list, and an end-of-session review pass restricted to the flagged
  set. This is the single most useful primary-adjacent fact for §4:
  it is a **Turkish, ÖSYM-branded precedent** for exactly the
  mark/review/jump mechanic Bluebook and Pearson VUE also use (§4), so
  adopting it is not importing a foreign convention, it is matching
  the version of computer-based testing this learner may have already
  sat (e-YDS, e-YÖKDİL) or will sit later.

I could not confirm layout details a fidelity mock genuinely needs —
column count, whether a reading passage sits above, beside, or on a
facing page from its questions, exact typeface, point size, header/
footer content, how the exam name and session number are printed. Every
attempt (İTÜ, YTÜ, Boğaziçi, ODTÜ, Hacettepe institutional pages;
istdilakademisi.com; sedayekeler.com.tr; every PDF found) was blocked.
Listed in full under **Doğrulanamayanlar**.

---

## 2 · The transfer-appropriate-processing case, properly

### 2.1 The core citation, and what it actually says

`06-rakip-analizi.md` cites Morris, Bransford & Franks (1977) once,
correctly, for the general claim. Fuller from this round [≈, search
summary of the paper and Wikipedia's TAP article, not the PDF itself]:

> *"Experiment 1 showed that semantic acquisition was superior to
> rhyme acquisition given a standard recognition test, whereas rhyme
> acquisition was superior to semantic acquisition given a rhyming
> recognition test."*

The finding is specifically about **encoding-task vs. retrieval-task
match**, not about surface décor. TAP's actual claim: memory
performance depends on whether the *kind of processing* done while
studying matches the *kind of processing* the test demands — not on
whether the study material and the test material look alike. This
matters for §3: it argues for matching the **cognitive operation**
(read a gapped paragraph and choose the grammatically/semantically
required filler, under one pass, no re-reading aid) more than for
matching the **visual chrome** (A4, monochrome, serif). UWorld's
Bluebook-imitation move is a *plausible* application of TAP, not a
tested one — no source found this round measured whether copying
Bluebook's pixels specifically improved SAT scores versus copying only
its *task structure* (timed, one item at a time, no instant feedback).
That gap is real and should be named as an assumption, not treated as
established.

### 2.2 Context-dependent memory — the classic citation, and its ceiling

Godden & Baddeley (1975), divers learning word lists on land/underwater
and recalling in matched/mismatched environments: *"Lists learned
underwater were best recalled underwater, and vice versa"* [≈]. This is
the study `06-rakip-analizi.md` doesn't cite but that underlies the
"copy the chrome" intuition generally. Its effect size, and the ceiling
on it, come from the meta-analysis that followed:

> Smith & Vela (2001), meta-analysis of environmental context-dependent
> memory: **recognition d = 0.27, recall d = 0.29** [≈]. Small by
> Cohen's standard (0.2 = small, 0.5 = medium).
>
> The same meta-analysis names the **outshining hypothesis**: *"when
> noncontextual cues are used to guide memory, the effects of
> contextual cues are diminished or eliminated... recognition tests...
> should show even less context dependence"* [≈].

This is the finding that most directly bounds §3. This app's items are
**recognition** tests (four printed options, pick one) with strong
**noncontextual cues already present** — the sentence itself, the
grammar rule the learner half-knows. Per the outshining hypothesis,
environmental/visual context match (does the screen look like the
paper) should matter *less* here than it would for free recall of
unstructured material. The effect is not zero, but d≈0.3 on a
task where outshining predicts an even smaller residual is a small
lever, not the "single cheapest way to look serious" `06-rakip-analizi`
frames it as. It is cheap — that half of the claim holds — but "cheap
and effective" and "cheap and the load-bearing lever" are different
claims, and only the first is supported here.

### 2.3 Format transfer in testing itself — mixed, and specific

Two separate literatures matter and this round found both:

**Test-format transfer is broad, not narrow.** Kang, McDermott &
Roediger (summarized in a review found this round) had students answer
either short-answer or multiple-choice questions after reading an
article, then tested both groups with *both* formats three days later:
*"they recalled more information on the final test, whether the
questions on the final test were multiple choice or short answer"*
[≈]. Practising in format A helped on format B nearly as much as
practising in format A helped on format A. This directly undercuts the
strong version of "practice must match the exam's exact shape" — the
literature's actual message is closer to *"practice retrieval at all,
in something like the right cognitive shape, and it transfers,"* which
is good news for an app that cannot literally reproduce a paper
booklet on a 320px screen.

**Format itself is not neutral — it changes what is measured.** Currie
& Chiramanee (2010), 152 undergraduates tested on English structure
first in constructed-response then in "three stem-equivalent
multiple-choice formats": *"only 26% of responses were the same,
suggesting that most of what the multiple-choice items measured was
directly dependent on the item format"* [≈]. This is the sharpest
counter-evidence found this round, and it cuts a specific way: **the
danger is not too little fidelity to the exam's look, it is too much
fidelity to multiple-choice as a *skill* rather than to the grammar
point underneath it** — which is exactly the failure mode
`docs/agents/question-author.md`'s "an option a competent teacher
would accept is a wrong option" rule and the blind-pass process
(`CLAUDE.md`, Content authoring) already exist to catch. The literature
independently confirms the corpus process is aimed at the right risk.

**Testwiseness is the same risk under its proper name.** Millman,
Bishop & Ebel (1965): testwiseness is *"a subject's capacity to
utilize the characteristics and formats of the test... to receive a
high score,"* explicitly *"logically independent of the examinee's
knowledge of the subject matter"* [≈]. A mock exam that trains a
learner to eliminate the grammatically-absurd option fast is training
testwiseness, not English — useful (real points on the real day) but
not to be confused with the lesson-then-check loop's actual job.

**Format familiarity does reduce anxiety, separately from raising true
ability.** *"Increasing familiarity with test format through review
questions in the same format as the test minimizes test anxiety
increases and increases test scores"* [≈]. This is the honest,
supportable version of the fidelity argument for this specific
learner: K3 in `10-ihtiyaclar.md` ("sınavdan önceki hafta... gergin")
is an anxiety problem as much as a knowledge problem, and format
familiarity is a real, if modest, lever on anxiety specifically — which
is a different and better-supported claim than "fidelity raises test
scores."

### 2.4 Numbers, gathered in one place

| finding | number | source strength |
|---|---|---|
| environmental context-dependent memory, recognition | d = 0.27 | [≈] meta-analysis (Smith & Vela 2001) |
| same, recall | d = 0.29 | [≈] meta-analysis |
| MC-practice → SA-final / SA-practice → MC-final, format-crossed testing effect | present, "recalled more... whether... multiple choice or short answer" | [≈] review of Kang/McDermott/Roediger |
| constructed-response vs. stem-equivalent MC, same construct, response overlap | 26% | [≈] Currie & Chiramanee 2010 |
| extrinsic reward on an already-motivated task (carried over from `06-rakip-analizi.md`, relevant to §3's "no gamified chrome") | d = −0.28 to −0.40 | [≈], already in this repo |

---

## 3 · What fidelity means for a phone

The paper is A4, monochrome, lettered options, formal-register Turkish
rubrics, one passage with seven questions stacked under it. The app is
a 320px dark-theme phone screen with instant feedback as its entire
value proposition (`docs/app1-final.md` never proposes removing
instant feedback from Test/Eğitim, and TAP itself (§2.1) argues for
matching *cognitive operation*, not chrome). So the question is not
"how do we make the phone look like the paper" — it can't, and
§2.2–2.3 both say the visual match is the weaker lever anyway. The
question is which of the paper's features are the ones actually
carrying the small-but-real transfer effect, versus which are
incidental to it.

**Adopt — cheap, load-bearing, currently missing or wrong:**

- **Option lettering, A/B/C/D.** §1.2. Currently `1 2 3 4`
  (`js/answers.js` line 56). This is the single highest-value, lowest-
  cost change in this whole document: one string, every screen that
  renders options, and it is the exact artifact UWorld's own move
  cashes in on — "does this look like the booklet" becomes checkable
  and the checkable answer flips from no to yes for the price of a
  label.
- **Rubric register and object-naming.** §1.3. `bulunuz` not `bul`,
  name the thing being sought (`cümleyi`/`sözcüğü`). One line in
  `js/prompt.js`, plus writing the two missing instructions correctly
  the first time when cloze/paragraph-completion instructions are
  added (they do not exist yet — `js/prompt.js`'s `INSTRUCTION` map
  only has `RESTATEMENT`; cloze is silent, self-explaining by the gap,
  per the file's own comment, which is defensible for cloze but not an
  argument against fixing restatement).
- **Passage-then-questions order, one passage serving several items.**
  Already the committed design for reading (`app1-final.md` C1: "two
  texts, seven questions each... a reading item cannot be shuffled into
  a mixed test alone"). This is a cognitive-operation match (read once,
  answer several, no re-presenting the passage per item) more than a
  visual one, which is exactly the kind of fidelity §2.1 says actually
  transfers.
- **Section identity visible per item ("Cloze," "Closest meaning" etc.
  in the bar).** Already N2, already planned. Free with the
  four-section spine, and it is the one piece of "does this look like
  the exam" a phone can do exactly as well as paper: naming the
  section is typographic, not spatial.
- **The mock's flag/review/jump mechanic modelled on e-sınav, not
  invented.** §1.4, §4. This is the one place literal interface
  fidelity is warranted, argued in §4.

**Do not adopt — incidental, or actively wrong for this product:**

- **Instant feedback removed from Test/Eğitim.** Never on the table.
  `app1-final.md` §7 refuses "any number that only goes up" and this
  repo's whole B3/K5/N4 case (`10-ihtiyaclar.md`) is built on
  answer-then-explain. §2.3's "format transfer is broad, format-match
  is not the strong lever" result gives explicit cover for keeping
  instant feedback everywhere except the one screen built to be timed
  (§4) — the literature does not demand withholding feedback to get
  the transfer benefit.
- **Literal A4/monochrome/paper chrome.** Already excluded by
  `CLAUDE.md`'s "no `innerHTML`," "no shadow/easing/component inline"
  and the whole UI3 direction (glass, colour-per-topic, motion). §2.2's
  outshining hypothesis is the citable reason this was never going to
  be the lever anyway: a recognition task with strong in-item cues
  (the sentence, the rule) discounts environmental match hardest.
- **A persistent countdown-to-exam-date widget.** Already rejected,
  `10-ihtiyaclar.md` §6 ("sınava kalan süre sayacı"). Distinct from a
  *within-mock* timer (§4), which is the opposite thing — a countdown
  to the exam date is anxiety ornament with no retrieval-practice
  content; a mock's own clock is the retrieval condition itself.
- **Five-option (A–E) lettering.** The A–E example quoted in §1.2 is
  YDS, not İYS. İYS is four-option per `CLAUDE.md`. Adopt the letter
  convention, not the option count.
- **Gamified motivational chrome as a stand-in for format fidelity.**
  Already excluded, already argued in `06-rakip-analizi.md` finding 2
  (Deci/Koestner/Ryan, d = −0.28 to −0.40 on an already-motivated
  task). Restated here only to be explicit that "make it feel more
  like a real exam" and "make it feel more like a game" are opposite
  moves and this document endorses only the first.

---

## 4 · The one screen where fidelity is not optional: the mock exam

Task **D2** (`app1-final.md` §3, Block D: *"All four sections at exam
scale... Last, because it cannot be honest until C2 has passages."*)
is explicitly the screen where the answer to "does this feel like the
exam" has to be yes, because it is the only screen whose entire job is
simulating exam conditions (K3, `10-ihtiyaclar.md`: *"sınavdan önceki
hafta... sadece yanlışlar, ve sınav ölçeğinde deneme"*). Three
independent computer-based-exam interfaces converge this round, and
the convergence itself is the finding — this is not one product's
idiosyncratic choice, it is the shape CBT high-stakes exams settle into
across unrelated organizations:

| element | e-sınav (ÖSYM) [≈] | Bluebook (College Board) [≈] | Pearson VUE [≈] |
|---|---|---|---|
| answered/unanswered state | shown per item | shown per item | shown per item |
| flag-for-review | yes — separate "işaretli" (yellow) state, distinct from "answered" | "Mark for Review" | "flag for later" |
| end-of-session review restricted to flagged | yes, explicit | dedicated review page listing flags | summary screen: answered / unanswered / flagged |
| jump-to-question by number | click number, jumps directly | question navigator, click to jump | — (not confirmed this round) |
| one question per screen | — (not confirmed) | — (modules, not single-question, per some sources) | yes, explicit |
| visible countdown timer | — (not confirmed) | yes | yes, "corner" |

**What D2 should borrow, concretely:**

1. **Section order fixed, exam's own order** (§1.1): Cloze → Closest
   meaning → Reading → Paragraph completion, not shuffled, because the
   real exam does not shuffle it and the mock's entire purpose is
   rehearsing the real sequence, pacing included.
2. **A per-item flag, distinct from "answered."** Not a fourth answer
   option — a small toggle, e.g. reusing the bookmark/flag glyph
   already in `js/icons.js`'s twenty-icon set (design-system §6) rather
   than a new one. State: unanswered / answered / answered-and-flagged
   — the third state is the one e-sınav, Bluebook and Pearson VUE all
   keep distinct from plain "answered," and for good reason: a flagged
   answered item and a confident answered item are different mental
   states the learner wants to find again.
3. **A jump list / review screen, not a linear next-only flow.** The
   Test screen today is linear (`js/quiz.js`, one question, forward
   only, per the layout doc). D2 needs the one exception: a summary
   the learner can open mid-session to see every item's state and jump
   to any of them, closing on "review flagged" as the default filter
   when time is short — matching e-sınav's own end-of-session pattern
   almost exactly, which is the strongest possible fidelity claim
   available (§1.4) because it is not just "like Bluebook," it is
   "like the ÖSYM system this learner may already have sat."
4. **Feedback withheld until the whole mock ends.** This is the one
   screen that should *not* carry this app's usual instant-feedback
   identity — because a mock's entire diagnostic value is measuring
   what the learner does under real exam information conditions (no
   mid-test correction), and `app1-final.md` §3 Block D1 already
   separates "practising" (instant feedback, everywhere else) from
   "understanding" (the error-tracking screen, after the fact). D2 is
   the practising-under-real-conditions counterpart to D1's
   understanding-after-the-fact: results, review, and per-item
   explanation belong on the results screen the mock ends into, not
   inside the mock.
5. **A visible timer, coarse, `role="status"`.** Already specified in
   this repo — `docs/design/12-arastirma/05-bilesenler-erisilebilirlik.md`
   row 12: *"The timer is a status message, not a live ticker... updated
   at coarse intervals (minutes, not seconds)."* WCAG 2.2.1 applies
   unless the limit is essential; for an exam simulation the time limit
   is the thing being simulated, so it is essential and the exemption
   applies — that row already reasons this correctly and D2 should
   implement it as written rather than re-deriving it.
6. **Section-scale timing, not one global clock, if the real exam
   allots time per section.** Not confirmed this round which the real
   İYS does (global 75/90/whatever-minute block, vs. per-section caps)
   — flagged under Doğrulanamayanlar. This changes D2's timer model
   materially (one countdown vs. four sequential ones) and should be
   settled before D2 is built, not assumed.
7. **Score withheld from the flagged-review interaction itself** — i.e.
   flagging and reviewing must not leak correctness. Pearson VUE's
   summary screen shows answered/unanswered/flagged, never right/wrong,
   during the session; D2's review screen should do the same, which
   `answers.js`'s existing `aria-disabled`-after-answer pattern already
   supports structurally (an item can be "answered" in storage without
   its feedback classes being applied until the mock resolves).

**What D2 should not borrow:**

- Bluebook's built-in calculator/graphing tools, annotation/highlight
  tools, digital whiteboard, scratch pad — all real Pearson VUE/
  Bluebook features found this round [≈], none relevant to a language
  proficiency exam and each one a new component this app has no
  taxonomy slot for (design-system §7's twenty-one components would
  need a twenty-second and twenty-third for no benefit to this
  content).
- A literal per-second ticking clock. Named against directly by the
  accessibility row already cited (WCAG 2.2.1, the coarse-interval
  requirement) and by this app's own "must never move the button the
  learner is about to tap" rule (`CLAUDE.md` non-negotiables) — a
  ticking number is exactly the kind of layout churn that rule exists
  to prevent.

---

## 5 · Turkish-language exam conventions — formulae collected

Everything here is a search-engine-quoted excerpt of a real page,
`[≈]`, not independently opened. Collected because `CLAUDE.md`
Conventions and this app's actual `js/prompt.js` currently invent
phrasing (§1.3) where the exam family already has stable, recognisable
formulae:

- **Sentence-level blank (cloze):**
  *"1-20. sorularda, cümlede boş bırakılan yerlere uygun düşen sözcük
  ya da ifadeyi bulunuz."*
- **Paragraph-internal blank (numbered gaps inside a passage):**
  *"19-27. sorularda, aşağıdaki parçada numaralanmış yerlere uygun
  düşen sözcük ya da ifadeyi bulunuz."*
- **Closest meaning / paraphrase:**
  *"verilen cümleye anlamca en yakın... cümleyi bulunuz."*
- **Paragraph completion (picking the sentence that fits, not the
  nicest one):**
  *"Hoşunuza giden değil, boşluğa gelebilecek en uygun cümle sizden
  istenmektedir."* (a prep-source aside, not ÖSYM's own rubric line,
  but worth keeping as an internal note on the item type even if it
  never ships as UI copy)
- **Reading, passage-then-questions cue (general ÖSYM-family phrasing,
  not confirmed İYS-specific):**
  *"aşağıdaki parçayı okuyunuz"* precedes a passage; the block of
  questions under it is numbered continuously, not restarted per
  question.

All four use the **formal plural imperative** (`bulunuz`, not `bul`;
`istenmektedir`, not `istiyoruz`). That register — not any individual
word choice — is the actual, cheap, currently-missing fidelity signal:
every rubric line this app ships should end `-unuz`/`-iniz` or use a
passive/impersonal construction (`istenmektedir`), never a second-
person informal imperative, regardless of which specific verb is
chosen.

---

## Öneri

1. **Change option lettering from `1 2 3 4` to `A B C D`** in
   `js/answers.js` (line 56, `String(index + 1)`). Single highest-
   value, lowest-cost change this document found: it is the literal
   UWorld move (§1.2), it is confirmed against real ÖSYM-family item
   text, and it costs one string transform, not a new component.
2. **Fix the closest-meaning rubric register and object-naming** in
   `js/prompt.js` (§1.3): `bulunuz` not `bul`, name `cümleyi`
   (`"Verilen cümleye anlamca en yakın cümleyi bulunuz."` or similar),
   and write the still-missing cloze/paragraph-completion instruction
   strings in the same register from the start rather than inventing
   new phrasing later.
3. **Treat literal visual fidelity (paper colour, column layout,
   typeface) as a low-value lever, not a high-value one**, on the
   strength of the outshining hypothesis (§2.2): a recognition-format
   item with strong in-sentence cues discounts environmental-context
   match hardest. Do not chase A4/monochrome pastiche on the phone;
   `CLAUDE.md`'s existing "no build step," "no shadow inline," UI3
   direction already forecloses this and the memory literature agrees
   with foreclosing it, for a reason worth recording rather than
   assuming.
4. **Design D2 (the mock exam) around the flag/answered/jump/review
   pattern common to e-sınav, Bluebook and Pearson VUE (§4)**, holding
   all feedback until the mock resolves into the results screen. This
   is the one screen in the whole app where literal interface fidelity
   is the correct target, and it is buildable without a new dependency
   — a flag icon, a state on the existing answer-storage shape, and a
   review list are all within the current component inventory.
5. **Resolve, before D2 is built, whether İYS times per-section or
   globally** (Doğrulanamayanlar below) — it changes the timer model.
6. **Adopt the four collected Turkish rubric formulae (§5) verbatim**
   as the basis for every instruction string this app ships, and keep
   the formal-imperative register as the one non-negotiable property
   of any new rubric line, even where the exact wording is adapted.
7. **Do not read "fidelity" as license to remove instant feedback**
   from Test or Eğitim. The literature this round found argues for
   matching *cognitive operation* over *visual chrome* (§2.1, §2.3),
   and explicitly does not require withholding feedback to obtain a
   transfer benefit. Reserve delayed feedback for D2 alone, where it is
   the condition being rehearsed, not a general design principle.

## Doğrulanamayanlar

- **Any primary exam booklet page, image or PDF.** Every host tried —
  `ybd.yildiz.edu.tr`, `ogi.yildiz.edu.tr`, `ydy.itu.edu.tr`,
  `yadyok.bogazici.edu.tr`, `cdn.istanbul.edu.tr`, `osym.gov.tr` and
  `dokuman.osym.gov.tr`, `istdilakademisi.com`, `temadil.com`,
  `sedayekeler.com.tr`, `memurlar.net`, `uzmanyds.com`,
  `angoradil.com`, `scribd.com`, `web.archive.org` — returned
  `EGRESS_BLOCKED`. If this is re-run from a machine without the
  proxy, start with `ybd.yildiz.edu.tr/en/ogrenci/sample-exams` (the
  official YTÜ sample-exam page) and
  `ydy.itu.edu.tr/sinav-ornegi-ve-analizi` (İTÜ's own "sample and
  analysis" page, which by its title likely contains exactly the kind
  of layout/format breakdown this document needed and couldn't get).
- **Page layout of the real booklet**: column count, passage placement
  relative to its questions (same page vs. facing page vs. above the
  block), typeface, point size, header/footer content, how the exam
  name and session are printed on the cover. Nothing found this round
  showed an actual page image or described one in enough detail to
  report a number.
- **Whether the booklet is genuinely monochrome.** Inferred from the
  complete absence of any colour reference across every snippet
  touched, which is weak evidence (absence of mention, not confirmation
  of absence) — `[?]`.
- **The current, dated İYS format** at the precision this document
  wanted (§1.1). Search snippets disagree with each other across
  what look like different exam years/variants (50q/75min vs.
  45q/50pt vs. this repo's already-sourced 40q/60pt). I did not find a
  way to date-stamp any of them against each other. `docs/app1-final.md`
  §2's figures are the trusted source and this arm did not improve on
  them — it independently corroborated the *section order* only.
- **Whether İYS times each section separately or the whole Session I
  as one block.** Decides D2's timer architecture (§4, item 6) and was
  not found this round.
- **Whether e-sınav's one-question-per-screen vs. multi-question
  scrolling matches Bluebook's module structure or Pearson VUE's
  strict one-per-screen.** The table in §4 has real gaps (marked `—`)
  because no source this round described all three systems on all
  rows; what's filled in is genuine, what's blank was not found rather
  than found-to-be-absent.
- **Whether copying Bluebook's/e-sınav's pixels (vs. only its task
  structure) has ever been isolated and measured for a score effect.**
  No source this round separated "chrome fidelity" from "structural
  fidelity" as an independent variable — the whole UWorld/Bluebook case
  in `06-rakip-analizi.md` and here remains a plausible application of
  TAP, not a tested one, and should keep being described that way.
- **The exact optical-answer-sheet bubble shape and lettering** (oval
  vs. circle, whether the letter prints inside or beside the bubble).
  General ÖSYM practice was found; the İYS-specific sheet was not.
