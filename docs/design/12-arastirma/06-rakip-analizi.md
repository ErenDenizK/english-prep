# Competitive teardown: what the category actually does

2026-09-15. Arm 6 of the design-system research. The question this arm
answers: **what do the best products in and around this category
actually do, and what does that tell us.**

Marks, as elsewhere in `docs/design/`:

- **[S]** read from the primary source itself, or measured in this
  repository.
- **[≈]** reported consistently by secondary sources; the number is
  probably right, the wording is not a quotation.
- **[?]** could not be verified in this pass. Treat as a lead, not a
  finding.

**A method limitation, stated first because it bounds everything
below.** This session's network egress is allow-listed. Search works;
direct fetching of most sites does not. `duolingo.com/design`,
`blog.duolingo.com`, `blog.khanacademy.org`, `khan.github.io`,
`monotype.com`, `christiandorian.com`, `borretti.me`, `are.na`,
`readwise.io`, `nytimes.com` and `arxiv.org` were all refused by the
proxy (403 at CONNECT). One primary document opened —
`github.com/nexu-io/open-design` — and it is a community
reconstruction, not a vendor spec. So most of what follows is
**[≈]**, and every quantity that matters is flagged. Where a number
would change a decision, §Doğrulanamayanlar says so and names what to
fetch on a machine with open egress.

---

## 0 · The short version

1. **The category has two visual dialects, and they map onto two
   business models, not two aesthetics.** Free, DAU-funded consumer
   products (Duolingo, Memrise, Quizlet) are loud. Paid,
   outcome-funded products (Babbel, UWorld, Anki's ecosystem) are
   sober. This app has no business model, no analytics and a six-week
   life. It is structurally in the second group and has been dressed
   as the first.
2. **Duolingo's design system is internally coherent and correct for
   Duolingo.** Its stated purpose is motivation, because its users
   have none. Our user has a stake — one exam, one year — so the app
   is not the source of motivation, and the research on extrinsic
   reward says adding one to an already-motivated task subtracts
   (Deci, Koestner & Ryan 1999, d = −0.28 to −0.40) [≈].
3. **The strongest serious test-prep move in the whole set is
   UWorld's: copy the exam's own chrome.** That is not a style
   choice, it has a memory-research basis (transfer-appropriate
   processing, Morris/Bransford/Franks 1977), and it is the single
   cheapest way for this app to look serious — because seriousness
   here is *fidelity*, not restraint.
4. **The editorial products all obey the same five rules**, and none
   of the five costs a dependency: one family or one accent doing
   every job; hierarchy by *class* not by size; ground as a named set
   rather than a light/dark switch; the reader's controls exposed
   rather than decided for them; and colour spent only where the
   content is.
5. **The intersection — a serious, quiet, well-typeset study tool —
   is very nearly empty.** The nearest occupants are Mochi and
   Readwise's Daily Review, both small. There is no template to copy,
   and the reason the intersection is empty is commercial, not
   aesthetic. That is a finding in this project's favour.

---

## 1 · Study and exam-prep apps

### 1.1 What is publicly documented, and what is not

| product | public design documentation | what it is |
|---|---|---|
| Khan Academy | **yes, real** — `Khan/wonder-blocks` on GitHub, `@khanacademy/wonder-blocks-tokens` on npm, Storybook docs | open-source React design system with published token packages [≈] |
| Duolingo | **a marketing page** at `duolingo.com/design`, plus brand/typeface case studies; no token spec published [≈] | brand and system shown, not specified |
| Quizlet | **a case study, not a spec** — "Assembly", written up by its designer [≈] | architecture described, values not published |
| Brilliant | brand refresh written up by the designer (Koto, 2023–24) [≈]; no token spec | brand only |
| Babbel | none found | — |
| Memrise | logo/identity work (Moving Brands, 2022) [≈]; no system | brand only |
| Anki | none — and this is the point (§1.4) | — |
| Elevate | none found; Apple's 2014 App of the Year citation praises "polished design and attention to detail" [≈] | award copy only |
| Magoosh | none found | — |
| UWorld | none — but its *product* is a documented imitation of another interface (§1.3) | — |

**What this means in this app.** Only one product in the category
publishes a design system you can actually read: Khan Academy's. If
the owner's instruction is "research a design system first", Wonder
Blocks is the only in-category artefact that can be read as a
specification rather than as a screenshot. Everything else has to be
inferred, which is exactly the trap `01-diagnosis.md` §4.2 describes —
writing a plan from reasoning and calling it research.

### 1.2 Khan Academy — the only readable system in the category

Wonder Blocks is a React component library with its tokens shipped as
a separate npm package, versioned independently (the tokens package
was at v17–v18 during 2025) [≈]. Two things in it are worth more than
its component list:

**Semantic tokens are an explicit layer.** The system separates
primitive values from tokens named for the *job* they do, and the
border tokens come in three intensities — **Primary, Subtle,
Strong** — a pattern repeated across other token families [≈].

**The internal learning metric is not engagement.** Khan Academy
publicly states that it uses **"skills to proficient+"** — the count
of skills a learner raised to Proficient or Mastered — as its learning
metric, because it is easy to understand *and* associated with gains
on an external mathematics assessment. The mastery ladder is
Attempted → Familiar → Proficient → Mastered, and **only Proficient
and Mastered count toward the course percentage**; Familiar does
not. Their published guidance is that it is better to take fewer
skills to Proficient than many to Familiar [≈].

**What this means in this app.** Two transfers, both free:

- Our palette is already solved per token, but the tokens are named
  by number (`--c-accent`, `--c-accent-2`, `surface-0/1/2`). A
  *Primary / Subtle / Strong* intensity ladder is a naming decision,
  not a colour decision, and it is what lets a rebrand — or a sixth
  visual round — move values without touching components. This is the
  architectural answer to "from scratch" that does not mean rewriting
  the app.
- N5 in `10-ihtiyaclar.md` asks for "record: what progressed, where
  weak — measurement, not decoration". Khan Academy has already
  answered it with a metric that is defensible against an external
  exam, and the exam is precisely what we have: 40 questions, four
  sections, 60 points. A "categories at proficient" count, with a
  threshold that excludes the shallow level, is a better headline
  number than any ring, and we hold the data already.

### 1.3 UWorld — the most transferable idea in the whole teardown

UWorld's SAT product **deliberately imitates the College Board's own
Bluebook testing application** — the same calculator panel, the same
reference sheet, the same answer-elimination tool — so the practice
environment feels like sitting the real exam [≈].

On the explanation screen it shows, per question [≈]:

- the **percentage of first-time answerers who chose each option**,
  printed beside the options themselves;
- **"Your Average Time Spent (Sec)"** against the peer average;
- topic-level performance and percentile comparison.

Note that UWorld is *not* well-made as an interface. App Store reviews
for its medical product describe it as "frustrating, poorly designed,
slow, glitchy", with the highlighting feature interrupting answering
and review [≈]. The lesson is not its craft. The lesson is its
*premise*.

**What this means in this app.** This is the finding I would defend
hardest. `10-ihtiyaclar.md` B4 says the app should "feel like the
exam" and marks it *partially met*; N2 says the four sections must be
visible and marks it *not met*. UWorld says the way to look serious is
not to be quieter — it is to **look like the paper**. Four options
lettered A–D, a numbered item, a section name in the bar, a plain
ground, a real paragraph. That costs no new token, no dependency and
no colour, and it converts "professional" from an adjective into a
checkable property: *does this screen look like the İYS booklet?*

The answer-distribution figure is the other half. We are a
single-player app with no server and no analytics, so we cannot show
peer percentages — but we hold every answer the learner has ever
given in `localStorage`, and `02-references.md` §13 already asks for
"ornament that is information". The item-level substitute is the
learner's own history: *you have met this contrast four times and
chosen the wrong side three of them.* Same move, no backend.

### 1.4 Anki — the control condition for this entire document

Anki's interface is widely described as utilitarian, dated and
intimidating: note types, deck options and scheduling settings, with a
steep learning curve [≈]. It has no mascot, no streak flame, no
confetti, no illustration, and no design system.

It also carries the strongest effectiveness evidence in the category.
Cohort work in medical education reports Anki users scoring
significantly higher across four exams, ranging **6.2% to 12.9%
higher**, and three studies finding high-frequency users outperforming
minimal users on USMLE Step 1 by **4–13 points** [≈]. These are
observational — self-selected diligent students use Anki — so they are
not proof of causation, and I am not offering them as proof. They are
offered as a boundary: **the visual language of a study tool is not
what produces its outcomes**, and the loudest products in the category
are not the ones with the best-evidenced ones.

**What this means in this app.** Anki is not a reference for how to
look. It is the answer to a specific fear — that a sober app will be
less effective — and the answer is that the best-evidenced tool in the
category is the plainest one in it. Which frees the visual round to be
about dignity and legibility instead of about motivation.

### 1.5 Quizlet — an architectural lesson, not a visual one

Quizlet's internal system is called **Assembly**. Its designer's
write-up describes building, underneath the component library, a
categorised icon set, a full typographic scale, a colour system built
for light and dark, and illustrated avatars — and reports that the
company went through **two rebrands** during the work. The second one
"revealed fragility in the colour system", which is what motivated the
**token architecture** that followed, so that a single rebrand decision
propagates across all three platforms at once [≈].

**What this means in this app.** This is the closest thing in the
category to our own situation, stated by someone who lived it. Six
rejected visual rounds *is* six rebrands. The lesson is not which
purple they picked; it is that **the thing that survives a rebrand is
the layer between the value and the component**, and we do not have
one. `css/style.css` is 1,986 lines and 51,879 bytes [S] with values
referenced directly by component classes. A seventh visual round
against the current architecture costs another full rewrite of the
stylesheet; against a semantic layer it costs a table of values.

### 1.6 Brilliant, Babbel, Memrise, Elevate, Magoosh — shorter notes

**Brilliant** refreshed its brand with Koto from autumn 2023,
explicitly to align with an audience of **young professionals**,
using CoFo Robert for marketing headers and CoFo Sans across the
product; the wordmark mixes rounded and squared corners to echo the
illustration style [≈]. Brilliant is the best-looking product in the
category by some distance, and it is still an *illustrated* product:
its identity is carried by drawn interactive diagrams, which is
content-borne colour and therefore legitimate. It looks good rather
than loud.

**Babbel** is the category's positioning control. Secondary coverage
consistently describes the split: Duolingo playful, freemium, built to
pull in curious learners at scale; Babbel sober, paid, aimed at adults
who are "buying structure, not entertainment", with a deliberately
business-like interface [≈]. No published system.

**Memrise** rebranded with Moving Brands in 2022 [≈] and, per a
gamification case study, continues to run points, levels, streaks,
leaderboards and achievements [≈]. Its own community forum threads
about the redesign are, by volume, complaints. Loud, not good.

**Elevate** won Apple's Best iPhone App of 2014, cited for "polished
design and plenty of attention to detail" [≈]. I could not verify any
specific typographic claim about it in this pass; anything said about
its serif usage would be invention. **[?]**

**Magoosh** differs from UWorld chiefly in pedagogy (video
explanations for every question) rather than in visual language, and
its practice interface is described as *not* matching the real test —
the inverse of UWorld's premise [≈].

### 1.7 Which of these look good, and which merely look loud

The brief asked for a verdict, so here is one, stated as an opinion
resting on the evidence above rather than as a measurement.

| product | good | loud | why |
|---|---|---|---|
| Brilliant | ✓ | | colour is the diagram; the identity is the content |
| Khan Academy | ✓ | | plain to the point of blandness, but coherent and documented |
| Babbel | ✓ | | dull, and correct for its buyer |
| Substack reader (§3) | ✓ | | one accent, two families, nothing else |
| Duolingo | ✓ | ✓ | genuinely well-made *and* deliberately loud; the two are not in tension for them |
| Quizlet | | ✓ | strong architecture, generic surface |
| Memrise | | ✓ | loudness without Duolingo's craft |
| UWorld | | | neither — it is exam furniture, and that is its point |
| Anki | | | outside the axis entirely |

The distinction that matters: **Duolingo is loud on purpose and good
at it; the imitators are loud because Duolingo is.** Our v0.62 was in
the second group. A flame, confetti and a hashed per-topic hue are
what the category's imitators ship, and `02-references.md` §12
measured our ten topic hues collapsing into 30° — loudness that does
not even deliver the distinction it costs.

---

## 2 · Duolingo specifically

### 2.1 What they have published, and what it says

The official design site is `duolingo.com/design` [≈, blocked in this
session]. Around it sit three well-covered pieces of material:

**The typeface.** Johnson Banks led the identity work with Fontsmith /
Monotype on a bespoke display face, **Feather Bold**, whose curves are
derived from the shapes in Duo the owl himself; it carries headings,
buttons and "any moment that needs personality", while a rounded
grotesque (DIN Next Rounded, later Mona Sans in product contexts)
handles longer-form and UI body text "where Feather would be too
loud" [≈]. The date is 2019, not 2022 [≈].

**The art style.** Duolingo's own blog post *Shape language: Duolingo's
art style* describes the move from static, hard-edged shapes on light
grey to the brighter, rounder, friendlier language, seeded by the
separate Duolingo KIDS app in 2018 and then brought back into the main
app. The stated reasons are production speed, clarity, scalability
across screen sizes after the move to vector tooling, and making
learning "feel doable, repeatable, and rewarding" [≈, post blocked].

**The tokens.** No vendor token spec is public. The most complete
reconstruction I could open is `nexu-io/open-design`, which is a
community `DESIGN.md` **[?] for authority**, listing owl green
`#58cc02` with deep/light/pale variants, streak orange `#ff9600`, gem
pink `#ce82ff`, eel blue `#1cb0f6`, cardinal red `#ff4b4b`, bee yellow
`#ffc800`; a 4px base spacing scale; radii 16px on cards and buttons,
12px on inputs, 9999px on chips and progress bars, 50% on skill nodes;
**weight 800 as the default heading weight**, with headings "25–40%
larger than typical product brands"; a **4px bottom border on every
interactive element** that collapses to 0 with a 4px translate on
press; motion of 180ms for a button press and 320ms with an
overshooting `cubic-bezier(0.34, 1.56, 0.64, 1)` for a skill unlock;
and a mascot blink every 4–6s [S, from that file; **[?]** as a
statement about Duolingo].

Three of those values — `#58cc02`, Feather Bold, and the 4px
bottom-border press — are corroborated across independent secondary
sources, so I treat those three as **[≈]** and the rest as **[?]**.

### 2.2 What they claim, and why

The claim, in the form it is most often quoted: *"the secret to
Duolingo is that we're not an education company. We're a fun and
motivation company."* I could not locate the primary utterance
**[?]**. What is corroborated is the same idea in von Ahn's own
words: *"It turns out that your average person doesn't really, even if
they say so, want to learn stuff. We have to make it fun for them to
actually want to do it,"* and *"the hardest thing about learning
something by yourself is staying motivated"* [≈].

That is a coherent and honest product thesis. Duolingo's constraint is
that its user has no external reason to come back tomorrow. So the
product manufactures one, and the visual language is the manufacturing
plant: the owl, the streak flame, the gems, the chunky press, the
overshoot spring. Reported results are consistent with it — by 2022
most daily active users were maintaining a streak, and a streak-repair
mechanism is credited with an 8% retention lift, out of a programme of
600+ experiments [≈].

### 2.3 Why this is wrong for this product — the argument

Not "Duolingo is bad". Five mismatches, each with evidence.

**(1) The motivation is already supplied, and adding a second one
subtracts.** Duolingo's premise is a user with no stake. Ours has the
largest stake a nineteen-year-old has that year: `CLAUDE.md` and
`10-ihtiyaclar.md` §2 both state it — the exam decides a year.
Deci, Koestner & Ryan's meta-analysis of 128 experiments found
tangible rewards *undermining* free-choice intrinsic motivation:
engagement-contingent d = **−0.40**, completion-contingent **−0.36**,
performance-contingent **−0.28** [≈]. Hanus & Fox ran the classroom
version over a 16-week semester with a leaderboard and badges against
the same curriculum without them, and found the gamified group
**lower** on motivation, satisfaction and empowerment over time, with
**lower final exam scores**, mediated by intrinsic motivation [≈].
Toda, Valle & Isotani's mapping of negative effects found **loss of
performance** the most frequently reported outcome and the
**leaderboard** the most frequently implicated element [≈].

This is not the claim that gamification never works. Sailer & Homner's
meta-analysis found real positive effects — cognitive g = **0.49**
(k = 19, N = 1,686), motivational g = **0.36**, behavioural g =
**0.25** [≈]. The claim is narrower and stronger: the moderators that
carried those effects were **game fiction and social interaction**,
and effects were largest in **young children in elementary
education** [≈]. This app has no fiction, no social layer, and an
adult user. We would be importing the surface of an effect without any
of the conditions that produced it.

**(2) The decay window is exactly our product's lifetime.** The
longitudinal work on the novelty effect finds gamification's effect
beginning to **decrease after about four weeks**, with the decline
lasting a further **two to six weeks**, before a familiarisation
recovery between weeks six and ten [≈]. `00-brief.md` states our usage
window: **~6 weeks before the exam**. A gamified layer would therefore
be at its measured weakest during the fortnight that decides the
outcome, and would have cost us the entire visual budget to build.
There is no recovery phase for us, because there is no week eleven.

**(3) The outcome ceilings differ, and so must the metric.** Duolingo's
published efficacy work and its critics converge on a ceiling around
CEFR **A2** for the app alone, with roughly half of learners reaching
A2 speaking proficiency [≈]. Our target is a specific 60-point paper
with a known composition (Cloze 15, Closest meaning 15, Reading 21,
Paragraph completion 9) [S, `10-ihtiyaclar.md` §1]. A product whose
headline number is a streak is optimising the thing its own critics
name: *a long streak does not correlate with fluency*, and users
"eventually start playing Duolingo to win points rather than learn"
[≈]. We have a real denominator. Using an invented one is a
downgrade.

**(4) The learner's own definition forbids it.** `CLAUDE.md` defines
the user as **competence without the labels** — someone whose ear is
good and who has never met `V3`. `10-ihtiyaclar.md` §2 draws the UI
consequence explicitly: celebration copy speaks to someone starting
from zero, and *seriousness is a feature*, because a thing that looks
like a game loses standing in this learner's eyes. Duolingo's visual
language is calibrated for a learner who must be persuaded that this
is not school. Ours has to be persuaded that it *is* — that this app
is exam-grade.

**(5) The retrieval surface should resemble the exam surface.**
Morris, Bransford & Franks established transfer-appropriate
processing: memory performance depends on the match between the
processing at encoding and at retrieval, not on encoding depth alone
[≈]. The practical corollary that UWorld built a company on is that
practice should look like the test. A cartoon frame around a cloze
item is a mismatch the real paper never contains. This is the one
argument in this section that is about pixels rather than psychology,
and it points the same way as the other four.

**(6) The repository already ran this experiment.**
`docs/research/visual-longevity.md` §6 refused streaks, XP, badges,
mascots, confetti and cosmetic unlocks with reasons. v0.62 shipped a
streak with a flame, confetti at 80%, and a hashed per-topic hue —
three of those refusals in one release [S, `01-diagnosis.md` §1] —
and it was rejected. The category's playbook has been tried in this
codebase and measured failing in this codebase.

**Counter-argument, stated honestly.** Duolingo is a $14bn company and
we are one developer and his friends; the presumption should be that
they know more. The reply is that they optimise a different objective
function — daily active users, because that is what a freemium
consumer subscription runs on — and they optimise it superbly. We have
**no accounts, no backend, no analytics** [S, `CLAUDE.md`], six weeks,
and one number that matters, and we are therefore the rare product
that can afford to be honest about retention because we do not sell
it.

---

## 3 · Editorial / reading products — the rules, not the look

The brief asks for the rules these products follow. Here are five that
every product in this group obeys, each with the evidence and each
with a cost in this codebase.

### R1 · One family, or one accent, doing every job

**Are.na** uses a **single variable family** (Areal Variable, Dinamo)
across every text role, generating hierarchy from weight and size
rather than from family changes; its chrome sinks into a near-black
canvas so that user-posted images are the only colour on the screen;
its single action colour (`#4a5cff`) appears sparingly, on the
progress indicator and interactive states, and was **tested against
both black and white grounds** before adoption [≈].

**Substack** takes the mirror route: a soft serif (Cahuenga) for
display and system-ui for all body and UI copy, so creator content
feels distinct while the platform's chrome stays invisible — and the
whole identity hangs on **one warm orange (`#ff6719`)** serving as
wordmark, primary button fill and accent border at once [≈].

**What this means here.** `02-references.md` §12 measured fifteen of
nineteen reference screens carrying exactly one accent hue family, and
§6 found our accent solved for the wrong job — one token doing both
ink and fill, with the ink requirement winning. Substack shows the
resolution used in the wild: **the accent is a fill and a mark; the
body is never the accent.** Are.na shows the discipline that makes it
survive: an action colour is adopted only after it is measured against
*both* grounds, which is what `npm run color` already does and what
`PAIRS` already encodes. We have the machinery. We have not applied it
to a fill-class token.

### R2 · Hierarchy by class, not by size

**NYT** runs three families with fixed jobs: **Cheltenham** for
headlines, **Imperial** for body, **NYT Franklin** for **captions,
metadata and navigation** [≈]. "Meta" is a *typeface*, not a smaller
size of the body face.

**Apple Books** uses **New York** (2019), six weights, with a
**variable optical-size axis**, so the same family is a traditional
reading face at small sizes and a graphic display face at large ones
[≈]. One family, two behaviours, no second file at the design level.

**What this means here.** `02-references.md` §8 measured the reading
references at a **2.9:1** display-to-body ratio — not the 5:1 of the
dashboards — with the top of the hierarchy differentiated by *class*
(serif italic, accent-coloured) rather than by scale. We already ship
Source Serif 4 and use it for almost nothing [S, `fonts/`]. The type
scale (36 · 28 · 22 · 18 · 15) does not need a new top; it needs the
existing top to change family.

The cost, measured: `fonts/` currently holds three files totalling
**48,016 bytes** [S] — Sans 400, Sans 600, Serif 400. There is **no
serif italic and no serif 600**. The reference device (serif italic in
the accent for the thing being taught) therefore costs one more
subset face of roughly 19 KB, taking the font payload to about 67 KB.
That is the whole price, there is no build step involved, and it is
the only item in this document that adds bytes.

### R3 · Ground is a named set, not a light/dark switch

**Kindle** offers page colours as four named grounds — **white, sepia,
light green, black** — plus alignment (left or justified) and an
improved layout engine with hyphenation and better justification, drop
caps and kerning [≈]. **Bookerly** (Dalton Maag, 2015) was
commissioned specifically for long-form reading on these screens
[≈].

**What this means here.** Our two themes are slate dark and cream
light, and the owner has already pushed once on this axis — *"beyaz
mod rezil"*, answered by switching white to cream [S,
`01-diagnosis.md` §3.2]. Kindle's model says the honest number of
grounds for a reading product is more than two, and that sepia exists
because pure white is wrong at night and pure black is wrong in
daylight. We do not have to ship four. We should notice that the
reading surface is the one screen where the ground is a **reading
decision** rather than a system preference, and `03-research.md` §4
is already asking whether the dark ground should be warm.

### R4 · The reader owns the controls

**Readwise Reader** exposes type size as a **continuous 14px–80px**
control with a **20px default**, plus a set of serif and sans faces
including **Atkinson Hyperlegible** and **OpenDyslexic**, plus light /
dark / auto, with generous margins and a measure around **65
characters** [≈]. **Apple Books** goes further and makes even the
page-turn *animation* a user setting — **Curl, Fast Fade, Scroll** —
alongside line, character and word spacing and margin sliders [≈].

**What this means here.** Two things, and they point in opposite
directions, so both are stated.

- The measure is already right. `css/style.css` sets
  `--w-measure: 65ch` [S], which is Bringhurst's ideal (45–75
  satisfactory, 66 ideal) and sits above Material's on-screen
  suggestion of 40–60 [≈]. This closes a question that a design
  round might otherwise reopen: **the ink deficit measured in
  `02-references.md` §7 is not a measure problem.**
- And the rule does not fully transfer, which is worth writing down
  before someone "fixes" it. Source Sans 3's digit advance is
  497/1000 em [S, `css/fonts.css`], so `1ch` at our 18px body is
  **8.95px**. At 320px with a 16px gutter the column is 288px, which
  is **~32 characters**; at 390px it is ~40. **The 45-character floor
  is unreachable on a phone at any type size above our measured 15px
  floor**, and Readwise's own 20px default on a 390px screen lands
  around 36 characters [≈] — they violate it too. Nobody obeys the
  editorial measure rule on a phone. Do not chase it.

Apple's page-turn setting is the sharper transfer. `CLAUDE.md`
mandates that motion collapses under reduced motion; Apple Books says
the stronger position is that motion is *owned* by the reader even
when they have no accessibility setting on.

### R5 · Colour comes from content, and the field is drained

Are.na's near-black canvas exists so that posted images are the only
saturated thing on screen [≈]. Substack's chrome is system-ui and
monochrome so the author's article is the object [≈]. NYT's Franklin
is deliberately the *quiet* family, reserved for the furniture.

**What this means here.** `02-references.md` §12 already named this
("drain the field so the one accent reads", reference 11c's grey map
under one orange dot) and §13 set the numbers: **1–2% saturated colour
on a reading surface** against our measured **0.1–0.2%**, and one
large non-ground area of **≥10%**, **≥25%** on the entrance. The
editorial products are the proof that draining is not the same as
being colourless: Are.na is near-monochrome *and* every screen has
colour on it, because the content supplies it. Our content is a
198-character English paragraph and a 377-character Turkish
explanation. **We have no content-borne colour, so ours has to be
drawn** — which is `02-references.md` §13's "does not transfer" entry
about book covers, restated as the central design problem of this
round.

---

## 4 · The synthesis question

**Has anyone successfully built a serious, quiet, well-typeset
learning tool?**

Nearly no one. The honest answer is that the intersection is close to
empty, and here is the census that produces that answer.

| candidate | serious | quiet | well-typeset | verdict |
|---|---|---|---|---|
| **Mochi** | ✓ | ✓ | ✓ | the closest occupant — and it is a small indie product |
| **Readwise (Daily Review)** | ✓ | ✓ | ✓ | editorial surface with a retrieval mechanic inside it |
| Anki | ✓ | ✓ | ✗ | the evidence leader, visually indifferent |
| UWorld | ✓ | ✓ | ✗ | exam furniture, poorly executed |
| Brilliant | ✓ | ✗ | ✓ | beautiful, illustrated, playful |
| Khan Academy | ✓ | ✓ | ✗ | coherent and bland |
| Babbel | ✓ | ✓ | ✗ | sober by positioning, not by craft |
| Duolingo / Quizlet / Memrise | ✗ | ✗ | — | the loud dialect |

**Mochi** is a markdown-first spaced-repetition app, cross-platform,
$5/month for sync, consistently described as "beautiful, clean and
elegant" with a "sleek UX", and positioned explicitly against Anki:
Anki prioritises algorithm power and customisation, Mochi prioritises
ease of use and aesthetics; Anki decks import directly [≈]. It is
the one product I found that is unmistakably a serious study tool and
unmistakably designed.

**Readwise's Daily Review** is the more interesting one for us,
because it is not a study app that got typeset — it is an *editorial*
product (Reader, §3 R4) with **spaced repetition built into it**. The
same company ships the 14–80px type control and the retrieval
mechanic in one surface. That is an existence proof that the two
languages can occupy one product without the study half dragging in
the mascot.

**Why the intersection is empty, which matters more than the census.**
Not because the combination doesn't work. Because of who funds it. A
consumer study app lives on daily actives and subscription retention,
and those metrics reward the loud dialect — measurably, as
Duolingo's 8% streak-repair lift shows [≈]. A quiet, typeset study
tool has no mechanism to manufacture a return visit, so it has to be
bought by someone who already intends to come back. Mochi charges $5 a
month; UWorld charges hundreds; Anki is free and ugly. **The visual
language of this category is downstream of its business model.**

**What this means in this app.** Three consequences, and the third is
the point of this arm.

1. **There is no competitor to copy.** Any round that proceeds by
   imitation will land on Duolingo's dialect by default, because that
   is what the category's screenshots are made of. This is probably
   part of the mechanism behind six rejections: the reference pool
   available to a session working from memory *is* the loud dialect.
   `02-references.md` exists because the owner supplied a different
   pool, and none of the eleven screens he chose is a study app.
2. **The nearest occupants are both tiny**, which means the design
   language must be assembled rather than adopted — editorial rules
   from §3, exam-fidelity structure from §1.3, progress semantics from
   §1.2.
3. **We are structurally free to build it.** No accounts, no backend,
   no analytics, no subscription, six weeks, and the owner is the
   user. The commercial pressure that produced the cliché does not
   exist here. An app that has nothing to sell is exactly the one that
   can afford to be quiet — and this is the first argument in six
   rounds for the sober direction that is not a matter of taste.

---

## 5 · What the category gets wrong

Each cliché, with what the evidence actually supports.

**Mascots.** No evidence located that a mascot improves retention or
learning outcomes **[?]**. Duo is a marketing asset — an identity
carrier, a notification voice, a meme — and Duolingo's own typeface
was derived from his shapes [≈], which tells you which way the
dependency runs: the mascot generates the brand, not the pedagogy.
There is an adjacent literature on **seductive details** (engaging but
irrelevant material depressing learning) that would bear directly on
cartoon illustration in a lesson; I did not verify it in this pass and
flag it as the single best lead for the next arm **[?]**.

**Streak flames.** The best-evidenced element *for engagement* and the
worst-evidenced *for learning*. Retention effects are real and
reported (most DAU on a streak by 2022; streak repair +8%) [≈]. The
failure mode is reported just as consistently: users opening the app,
tapping a few buttons and leaving to protect the number, "Duolingo
burnout" threads, and the flat observation that **a long streak does
not correlate with fluency** [≈]. Duolingo itself mitigates with
streak freezes and built-in breaks [≈] — a company adding brakes to
its own mechanism is evidence about the mechanism.

**Confetti.** No research located in either direction **[?]**. The
argument against it here is not empirical, and should be stated as
what it is: a **register** argument. `10-ihtiyaclar.md` §2 —
"Harikasın!", confetti and level badges are written for someone
starting from zero; this learner is closing gaps, not starting.
Shipped in v0.62 at 80%,
against `visual-longevity.md` §6, and rejected.

**Progress rings.** The one cliché the evidence partly *supports* —
with a condition. Nunes & Drèze's car-wash field experiment gave 300
customers either an 8-stamp card at 0/8 or a 10-stamp card at 2/10,
identical real effort, and completion went from **19% to 34%** [≈].
Visible progress toward a goal changes behaviour. But the denominator
has to be real: a ring against an invented daily goal measures
compliance with the app, whereas a ring against *40 questions in four
sections worth 60 points* measures the thing the learner came for. The
ring is not the mistake. **The invented denominator is.**

**Gamified levels, XP, leaderboards.** The leaderboard is the single
most frequently implicated element in the mapping of gamification's
negative effects, and loss of performance the most frequently reported
outcome [≈]; Hanus & Fox's gamified condition — leaderboard plus
badges — ended with lower exam scores mediated by lower intrinsic
motivation [≈]. This app has one user per browser and no social layer,
so a leaderboard is not even available. XP against an invented level
ladder is the solo version of the same error.

**Cartoon illustration.** No learning evidence located **[?]**.
Duolingo's own stated reasons for the style are production speed,
clarity and vector scalability [≈] — i.e. operational, not
pedagogical. For us there is a harder constraint than taste:
`CLAUDE.md` forbids a build step and runtime dependencies, `data/` is
already 798 KB [S], and an illustration set is either a large asset
payload or hand-drawn SVG maintained forever. `js/icons.js` already
carries twenty hand-drawn icons to a documented contract; that is the
right scale of drawn material for this app.

**And the meta-error, which is the expensive one.** Every item above
is a *retention* device. Retention is the correct obsession for a
product that must be reopened for a year. Ours must be reopened for
six weeks by someone with an exam. Optimising retention here is
solving a problem the calendar has already solved, with the side
effect of looking like a toy to the one person whose opinion decides
the round.

---

## 6 · Concrete details worth stealing

Eighteen, each with its source and each with what it means here.

**1 · UWorld — the practice screen imitates the exam's own chrome.**
Numbered item, lettered options, section name, a real paragraph, and
an answer-elimination strike-through tool copied from Bluebook [≈].
*Here:* this is N2 and B4 in one move, costs no token, and turns
"professional" into a checkable question — does this look like the
İYS booklet?

**2 · UWorld — the answer distribution is printed beside the
options.** "% of first-time answerers who chose this" [≈].
*Here:* we have no peers, but we have the learner's own history in
`localStorage`. *You have met this contrast 4 times and taken the
wrong side 3 of them* is the same device, single-player, and it is
`02-references.md` §13's "ornament that is information" with an actual
sentence attached.

**3 · UWorld — "your average time spent" on the item.** [≈]
*Here:* K1 in `10-ihtiyaclar.md` is a 5–10 minute standing session.
Seconds-per-item is data we can collect with no backend, and it is
exam-relevant: the paper is 40 questions against a clock.

**4 · Anki — the grading control states its own consequence.** The
review buttons are labelled with the interval they will produce
(Again 10m / Hard 1d / Good 3d), so the control *is* the outcome
rather than a name for it.
*Here:* `02-references.md` §12 states the rule as "the tile is the
control", from reference 10. Anki is the study-app instance of it, and
our answer options are the obvious candidate: the option is the
control, not a row inside a card.

**5 · Khan Academy — "skills to proficient+" as the headline
number.** An external-validity-checked learning metric instead of a
streak, with four named states of which only two count [≈].
*Here:* N5, answered. *Categories at proficient: 6 of 10* against a
known 60-point paper beats any ring, and the threshold — Familiar does
not count — is what stops the number inflating.

**6 · Khan Academy Wonder Blocks — token intensity as a named ladder.**
Primary / Subtle / Strong, applied consistently across token families
[≈].
*Here:* a renaming, not a repaint. It is the layer that lets a seventh
visual round change values without touching components, and it costs
one pass over `css/style.css`.

**7 · Quizlet Assembly — primitive → semantic token separation,
adopted *because* a rebrand broke the colour system.** [≈]
*Here:* six rejected rounds is six rebrands. This is the architecture
finding of the whole teardown, and the answer to "from scratch"
that does not mean rewriting 1,986 lines of CSS again.

**8 · Substack — one warm accent is the wordmark, the button fill and
the rule, and nothing else.** `#ff6719` [≈].
*Here:* directly supports `03-research.md`'s split-accent question.
The fill accent is not a second brand colour; it is the *only* one,
and the ink accent is the compromise we make for WCAG, not the
identity.

**9 · Substack — serif for content, system sans for chrome.** [≈]
*Here:* the cleanest possible rule for where Source Serif 4 goes. The
English sentence being taught is content. Everything Turkish and
chrome-shaped is sans. One rule, decidable per element, no taste
required.

**10 · Are.na — one variable family, hierarchy from weight and size
only.** [≈]
*Here:* the counter-proposal to #9, and the cheaper one — it costs
zero new bytes. Worth putting in front of the owner as a pair (A/B),
which is `01-diagnosis.md` §2's "two alternatives, a choice", the
step that has been skipped for four rounds.

**11 · Are.na — the action colour is verified against both grounds
before adoption.** [≈]
*Here:* we already do this better than they do — `tools/palette.mjs`
measures WCAG 2 and APCA in both themes for every declared size
pairing. The transfer is to apply it to a **fill-class row** in
`PAIRS`, which does not exist yet.

**12 · Apple Books / New York — one family with an optical-size axis:
reading face at small sizes, display face at large.** Six weights
[≈].
*Here:* the argument against adding a display family. If the serif
appears at 28–36px it is doing display work; Source Serif 4's design
already anticipates that, and buying a second family to get a display
voice would be spending bytes on a decision the family already makes.

**13 · Apple Books — the page-turn animation is a user setting.**
Curl / Fast Fade / Scroll [≈].
*Here:* stronger than our reduced-motion rule. Motion the learner
chose cannot be the thing that makes the app feel like a toy.

**14 · Kindle — four named grounds, not two themes.** White, sepia,
light green, black [≈].
*Here:* the reading surface is where the ground is a *reading*
decision. We need not ship four; we should stop assuming two is a law.

**15 · Kindle — hyphenation and a real justification engine.** [≈]
*Here:* at 320px our column is ~32 characters (§3 R4). That is exactly
the width at which a ragged right edge falls apart and justification
opens rivers. `hyphens: auto` with `lang="tr"` costs one CSS line and
no dependency, and it is the highest-leverage typographic change
available on the narrowest screen.

**16 · Readwise Reader — type size is a continuous 14–80px control,
default 20px.** [≈]
*Here:* we have a measured 15px floor from `ui-improve.md` and a fixed
type scale. A continuous control would break `PAIRS`. But a **two-step
reading size** on the lesson screen only (18 / 20) is checkable
against `PAIRS` by adding two rows, and it directly serves the ink
target of `02-references.md` §13.

**17 · NYT — a whole typeface reserved for metadata, captions and
navigation.** NYT Franklin [≈].
*Here:* `CLAUDE.md` already says 15px is for weight 600, one line, and
never a sentence. NYT's version is the same rule made visible: meta is
a *class*, and the fastest way to show that without a third family is
the tracked-uppercase treatment the owner's own reference set uses.

**18 · Duolingo — the press is a physical event, not a colour
change.** A 4px bottom border that collapses to 0 as the control
translates down 4px, 180ms [≈].
*Here:* steal the mechanic, refuse the look. `02-references.md` §12
found the references putting **one** filled action per screen, and
v0.62 gave a gradient and a glow to every primary action. A single
action whose press is a 4px displacement — no colour change, no glow,
no scale — is the whole interaction in two CSS lines, it survives
reduced motion by collapsing to nothing, and it is the one thing in
Duolingo's kit that is about *dignity of touch* rather than about
delight.

---

## Öneri

**1 · Take the exam, not the category, as the reference.** The single
highest-value finding in this teardown is UWorld's: the way a study
product reads as serious is *fidelity to the paper*, not restraint.
Before any token is chosen, the question screen should be redrawn as
the İYS booklet — numbered item, lettered A–D options, section name in
the bar, one paragraph at full measure, one filled action. This
satisfies N2, N3 and B4 simultaneously, has a memory-research basis
(transfer-appropriate processing), and converts *professional* into a
question with a yes/no answer. It is also the only recommendation here
that does not depend on a colour decision, which means it can be
specified and judged before the palette round reopens.

**2 · Adopt a semantic token layer before the seventh visual round,
not after it.** Quizlet's Assembly exists because a rebrand broke a
colour system; Khan Academy's Wonder Blocks ships Primary / Subtle /
Strong intensities. We have six rejected rounds and values referenced
directly by component classes across 1,986 lines of CSS. The layer is
cheap, is not a visual decision, and is what makes an eighth round
cost a table instead of a rewrite. This is the concrete answer to
"professional, from scratch, and a design system first" — the part of
"from scratch" that is architecture rather than taste.

**3 · Refuse the Duolingo dialect explicitly, with the reasons in the
spec rather than in a review.** Not because it is bad, but because
five conditions it needs are absent: the user's motivation is external
and large; the product's life (6 weeks) sits inside gamification's
measured decay window (weeks 4–10); the moderators that carried the
positive meta-analytic effects (game fiction, social interaction,
young children) do not exist here; the learner is defined by
competence without labels, for whom a toy costs credibility; and the
one element with real supporting evidence — visible progress, 19% →
34% — works only against a real denominator, which we have. Write
these five into the design document so that round eight cannot
rediscover the flame.

**4 · Put two typographic directions in front of the owner, not one.**
This is `01-diagnosis.md` §2 step 3, the step whose absence explains
four rejections, and the teardown produces the two candidates cleanly:

- **A · Substack/NYT route** — hierarchy by *class*. Source Serif 4
  carries the English being taught and the display line; Source Sans 3
  carries all Turkish and all chrome; meta is tracked uppercase. Costs
  one more subset face (~19 KB, taking `fonts/` from 48,016 bytes to
  roughly 67 KB) if italic is wanted. Matches the measured 2.9:1 ratio
  of the owner's own reading references.
- **B · Are.na route** — one family, hierarchy from weight and size
  only, chrome sunk into the ground, the serif dropped entirely. Costs
  **zero** bytes and removes a file.

Both are realisable on one screen in an afternoon. Neither is a
product-structure variation, which is what got step 5 rejected.

**5 · Spend the ornament budget on the record, not on reward.** Three
specific instruments, all from this teardown, all buildable without a
backend: the learner's own per-item history printed beside the options
(UWorld #2), seconds-per-item against the exam's own clock (UWorld
#3), and a "categories at proficient" count with a threshold that
excludes the shallow level (Khan Academy #5). `visual-longevity.md`
§5 ranked "richness earned from the learner's own record" second, six
weeks ago, and no round has touched it. The category's best products
put their visual budget on rendering data; ours is held and unrendered.

**6 · Two cheap typographic fixes that need no round at all.**
`hyphens: auto` on the reading and question prose — at our measured
~32-character column on a 320px screen this is the highest-leverage
change available — and confirmation in the spec that
`--w-measure: 65ch` is already correct, so no future round reopens the
measure. Both are one line; the second is one sentence.

**7 · Do not chase the editorial measure rule on a phone.** 45–75
characters is unreachable above our 15px floor: 288px of column at
18px is ~32 characters, and Readwise's own 20px default lands around
36. Recording this now is cheaper than a round spending itself on it.

---

## Doğrulanamayanlar

Marked **[?]** above; listed here with what would settle each.

1. **Duolingo's own design system specification.** `duolingo.com/design`
   and `blog.duolingo.com` are both blocked by this session's egress
   proxy. Every token value in §2.1 comes from a community
   reconstruction (`nexu-io/open-design`) whose provenance I cannot
   check; only `#58cc02`, Feather Bold and the 4px bottom-border press
   are independently corroborated. *Fetch on an open machine:*
   `duolingo.com/design`, and the blog posts *Shape language: Duolingo's
   art style* and *The science behind Duolingo's home screen redesign*.
2. **The "fun and motivation company" quotation.** Widely attributed to
   von Ahn, primary utterance not located. The corroborated paraphrase
   is quoted instead. Do not print the famous version as a quotation
   without a source.
3. **Khan Academy's colour method.** `blog.khanacademy.org`'s *How we
   rebuilt Khan Academy's color system from the ground up* and the
   Wonder Blocks Storybook were both blocked. Whether they solve
   against WCAG 2, APCA or both — which would tell us whether anyone
   else in the category measures colour the way `tools/palette.mjs`
   does — is unknown. This is the most useful single unfetched
   document in the list.
4. **Quizlet Assembly's actual numbers.** The case study
   (`christiandorian.com/assembly-design-system`) was blocked; the
   architecture is reported from search summaries. Component count,
   token layer names and platform count are unverified.
5. **Elevate's typography.** No primary material located. Any claim
   about serif usage or restraint in Elevate would be invention. Not
   made above.
6. **The Athletic and Monocle.** Searched; results were agency
   portfolio copy with no typographic specifics. Contributed nothing
   and are therefore absent from §3 rather than padded into it.
7. **Seductive details.** The literature on engaging-but-irrelevant
   material depressing learning bears directly on cartoon illustration
   in a lesson, and was not verified in this pass. Named as the single
   best lead for a follow-up. Start at Harp & Mayer (1998) and Rey's
   meta-analysis.
8. **Confetti.** No research located in either direction. The argument
   against it in §5 is a register argument from `10-ihtiyaclar.md` §2,
   not an empirical one, and is labelled as such.
9. **Every effect size in §2.3 and §5** was read from search summaries
   of the abstracts, not from the papers: Deci/Koestner/Ryan 1999
   (d = −0.28 / −0.36 / −0.40), Sailer & Homner 2020
   (g = 0.49 / 0.36 / 0.25), Hanus & Fox 2015, Toda/Valle/Isotani
   2018, Nunes & Drèze 2006 (19% → 34%), Roediger & Karpicke 2006
   (61% vs 40% at one week, 71% vs 83% at five minutes),
   Morris/Bransford/Franks 1977. The
   directions are consistent across multiple summaries and I am
   confident in them; the digits should be checked against the PDFs
   before any of them is printed in a user-facing document.
10. **The novelty-effect window (decline from ~week 4, lasting 2–6
    weeks, recovery by weeks 6–10)** carries more argumentative weight
    in §2.3 than any other number, because it coincides with our
    product's entire lifetime. It comes from one longitudinal study
    reported via summary. If one number from this document is
    verified, make it this one.
11. **Anki's outcome figures** (6.2–12.9% higher exam scores; 4–13
    Step 1 points) are observational and self-selected. They are used
    above only as a boundary on the claim that visual language drives
    outcomes, never as evidence that plainness causes learning.
12. **Mochi and Readwise Daily Review** were assessed from reviews and
    documentation, not from using them. The §4 claim that the
    intersection is "nearly empty" is a claim about a search, and a
    search can miss. If someone knows a serious, quiet, well-typeset
    study tool that is not in the §4 table, that single counter-example
    is worth more than the rest of this section.

---

## Sources

Design systems and product design

- [Wonder Blocks (Khan Academy) — GitHub](https://github.com/Khan/wonder-blocks)
- [`@khanacademy/wonder-blocks-tokens` — npm](https://www.npmjs.com/package/@khanacademy/wonder-blocks-tokens)
- [Wonder Blocks Storybook docs](https://khan.github.io/wonder-blocks/) *(blocked)*
- [Wonder Blocks: the story behind it — designsystems.com](https://www.designsystems.com/about-wonder-blocks-khan-academys-design-system-and-the-story-behind-it/)
- [How we rebuilt Khan Academy's color system](https://blog.khanacademy.org/how-we-rebuilt-khan-academys-color-system-from-the-ground-up) *(blocked)*
- [Duolingo design system — community `DESIGN.md`](https://github.com/nexu-io/open-design/blob/main/design-systems/duolingo/DESIGN.md)
- [Duolingo design (official)](https://www.duolingo.com/design) *(blocked)*
- [Shape language: Duolingo's art style](https://blog.duolingo.com/shape-language-duolingos-art-style/) *(blocked)*
- [Duolingo's custom font Feather — Monotype](https://www.monotype.com/resources/duolingo-custom-font-inspired-their-owl-mascot-duo) *(blocked)*
- [Duolingo gets a new logo and feathery custom typeface — Creative Bloq](https://www.creativebloq.com/news/feather-bold)
- [Assembly: Quizlet's first production-grade design system](https://www.christiandorian.com/assembly-design-system) *(blocked)*
- [A Brilliant brand refresh — Peter Cho](https://pcho.medium.com/a-brilliant-brand-refresh-4af021c11486) *(blocked)*
- [Memrise identity — Moving Brands, via Brand New](https://www.underconsideration.com/brandnew/archives/new_logo_for_memrise_by_moving_brands_and_in_house.php)
- [Substack design tokens and typography — DesignMD](https://designmd.cc/benchmarks/substack)
- [are.na website design: fonts, colours, UI patterns — Fudge](https://design.withfudge.com/share/are.na-design)

Reading and editorial products

- [Readwise Reader appearance settings](https://docs.readwise.io/reader/docs/faqs/appearance)
- [Readwise Reader — dark mode changelog](https://readwise.io/changelog/dark-mode)
- [Accessible reading options for Kindle apps — Amazon](https://www.amazon.com/gp/help/customer/display.html?nodeId=TABlJ4ot69emTO8jJG)
- [Amazon Ember vs Bookerly — Good e-Reader](https://goodereader.com/blog/reviews/amazon-ember-vs-amazon-bookerly-font-review)
- [Read books in the Books app on iPhone — Apple](https://support.apple.com/guide/iphone/read-books-iphc1af7c57/ios)
- [New York (2019 typeface)](https://en.wikipedia.org/wiki/New_York_(2019_typeface))
- [Apple Fonts](https://developer.apple.com/fonts/)
- [NYT Franklin in use — Fonts In Use](https://fontsinuse.com/typefaces/12496/nyt-franklin)
- [Understanding measure / line length — Google Fonts Knowledge](https://fonts.google.com/knowledge/using_type/understanding_measure_line_length)

Study and exam-prep products

- [UWorld SAT Prep review — Test Prep Insight](https://testprepinsight.com/reviews/uworld-sat-prep-review/)
- [UWorld peer % per question — Student Doctor Network](https://forums.studentdoctor.net/threads/uworld-peer-reported-per-question.915993/)
- [UWorld Medical Exam Prep — App Store reviews](https://apps.apple.com/us/app/uworld-medical-exam-prep/id991621303?see-all=reviews)
- [Anki as a spaced-repetition tool — cohort study (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10403443/)
- [Utilization patterns and perceptions of Anki (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12662189/)
- [Mochi — spaced repetition flashcards](https://mochi.cards/)
- [First impressions of Mochi — Fernando Borretti](https://borretti.me/article/first-impressions-mochi) *(blocked)*
- [What are Course and Unit Mastery? — Khan Academy](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery)
- [Why Khan Academy uses "skills to proficient"](https://blog.khanacademy.org/why-khan-academy-will-be-using-skills-to-proficient-to-measure-learning-outcomes/)
- [Duolingo efficacy studies](https://blog.duolingo.com/results-duolingo-efficacy-studies) *(blocked)*
- [Effectiveness of Duolingo English courses — CALICO Journal](https://utppublishing.com/doi/10.1558/cj.26704)
- [Duolingo's user retention: 8 tactics — Growth.Design](https://growth.design/content/case-studies/duolingo-user-retention/index.html)
- [Streak creep: when gamified engagement backfires — The Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)

Research

- [Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6)](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)
- [Hanus & Fox (2015), *Computers & Education* 80, 152–161](https://www.semanticscholar.org/paper/Assessing-the-effects-of-gamification-in-the-A-on-Hanus-Fox/dff76a9862467d426113ec530f83942016ae3a97)
- [Sailer & Homner (2020), *Educational Psychology Review*](https://eric.ed.gov/?id=EJ1245270)
- [Toda, Valle & Isotani (2018), *The Dark Side of Gamification*](https://link.springer.com/chapter/10.1007/978-3-319-97934-2_9)
- [Gamification suffers from the novelty effect (2022), *IJETHE*](https://eric.ed.gov/?id=EJ1325797)
- [Nunes & Drèze (2006), *The Endowed Progress Effect* — SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962)
- [Roediger & Karpicke (2006), *The Power of Testing Memory* (PDF)](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf)
- [Morris, Bransford & Franks (1977), levels vs transfer-appropriate processing](https://www.sciencedirect.com/science/article/abs/pii/S0022537177800169)
- [Diemand-Yauman et al. (2011) and Rummer et al.'s null replications](https://link.springer.com/article/10.1007/s11409-015-9151-5)
- [Gamification effectiveness meta-analysis (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10591086/)
