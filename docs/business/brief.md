# The owner's brief, 2026-09-05

Written down because it arrived in two messages at one in the morning and
is the only statement of intent this project has. Everything in
`docs/business/` answers to it. Where a later document disagrees with this
one, this one is what the owner said and the other is an argument.

## The two paths

He does not want one product with a toggle. He wants **two apps**, and he
says so explicitly.

### App 1 — the exam app, Turkish market, as it is

University-focused, entirely Turkish, sold around prep-school and exam
season. Reach comes from his own social circle and possibly paid ads.

- **Price idea:** ~270 TL for a full unlock. After commission and tax he
  estimates ~150 TL net.
- **Volume idea:** three schools, ~50 people each.
- **The goal is explicitly not profit.** In his words: the point is the
  project and the experience. *"Yapay zekâ ücretlerini ve uygulama yükleme
  gibi ücretleri kendisi karşılayıp çıkarsa bile kârdır"* — if it covers
  the AI costs and the store fees, that is already a win. He is building
  it either way, and learning the whole pipeline is part of the return.

### App 2 — the improvement app, global

The mission he has stated from the beginning: **improvement, not
learning.** For the learner defined in `CLAUDE.md` — real English, no
academic foundation. A Duolingo, but *more instructive and more
respectable*.

- Slightly more of an online platform, though **not fully** — small in
  scope.
- Properly localised for foreign markets.
- Monthly recurring is plausible *there* because payment habit differs.
- Again: no wild profit targets. *"İşi doğru yapalım, gelirse ne âlâ."*
- He accepts this is a big project.

## Constraints and facts he stated

- **A meaningful part is free, in both.** Not negotiable: *"kesinlikle
  önemli bir bölümü ücretsiz olur."*
- **Model unresolved:** SaaS or one-time payment, either is open.
- **Apple, iOS, Turkey.** He knows there is a stack of process — tax,
  Apple policy, the iOS platform — and expects it to be researched, not
  assumed.
- **Tax:** he believes Turkey has a dedicated regime for influencers and
  app sellers that does not require forming a company, and that they can
  use it. **This needs verifying by a professional, not by us.**
- **He is not alone.** The friend who tested the app and sat the Bilkent
  prep exam has been admitted to industrial engineering, and they can run
  this together.

## What he asked for while he slept

Leave the app itself alone. Improve, think, research and plan everything
around it: the public presentation and GitHub page, the roadmap, the
feature and future planning, the paths the project could evolve down,
income, Turkish versus foreign users, Android versus Apple. Generate our
own questions and keep going.

## The standing rule for everything in this directory

Two of these subjects — **Turkish tax law and Apple's review policy** —
are the two where being confidently wrong is most expensive and where
this session cannot check a primary source: `WebFetch` is blocked here.
Every claim about either must be marked as unverified and pointed at the
person who can verify it. A number that looks authoritative and is a year
out of date is worse than no number.

---

## Addendum, 2026-09-06

Two things the owner settled after reading the first round of these
documents.

### Going private is the answer to "you cannot sell a public static file"

The four arms independently found that the repository being public makes
any paid tier decorative (`README.md` in this directory, §"The one
finding that arrived four times"), and set out three resolutions. His
answer is a fourth, and a simpler one:

> *"Zaten açık kaynağı kapatırız, ücretliye geçmeden önemli
> değişiklikler yaparız."*

Close the source before charging, and make substantial changes to the
content before that point anyway. This is coherent and it dissolves the
problem the arms were circling: they were all reasoning inside the
constraint that the repository stays public, and that constraint was
never one of his.

**One fact to carry, not an objection.** Making a repository private
later does not retract what was public: anyone who cloned or forked it
keeps that copy, permanently. What that costs depends entirely on his
second clause — and his second clause is the answer. A snapshot of the
corpus as it stands in September is out; the paid corpus is not that
snapshot. The plan works *because* of the "önemli değişiklikler" half,
so that half is load-bearing rather than incidental.

It also reorders `architecture.md` §6: closing the source is the cheap
prerequisite to rung 6, not part of the trapdoor itself.

### GitHub Pages serves `test`, not `main`

Confirmed by the owner. `main` is a single commit from 2026-09-02 and
was never the published branch — the two-branch convention in
`CLAUDE.md` described an intention that was never carried out, and both
it and the README have been corrected.

The consequence is worth stating in a business document as well as a
technical one: **there is no staging branch.** A push to `test` is a
deploy to every learner using the app.


---

## Addendum, 2026-09-06 — the second round

Three more decisions, after reading the vision document.

### App 2 goes global, and is taught in English

Not "Turkish first, then maybe localise". English teaching for learners
worldwide, positioned as *a higher-level, more instructive Duolingo*.

This appears to collide with `two-apps.md` §5.3 — *each language is a
co-author, 45–60 hours per L1* — and `vision.md` §3 now argues it does
not, because that finding assumed the learner's own language is the
medium. This app's audience already speaks English; the explanations can
be in English, and reading them is practice. The localisation cost does
not get solved cheaply, **it does not arise**. What remains is one
re-authoring pass of ~37,000 words of explanation, in English, paid once
rather than per language.

### Notifications are allowed for App 2

Explicitly flagged by the owner as needing research, and an arm is
running (`retention-and-pricing.md`). The line proposed in `vision.md`
§3: *a notification is acceptable if what it says would still be true
and useful even if the app had no interest in your returning.* Due
counts pass; streaks fail.

### A subscription, at a reasonable price, in whatever form the market takes

Recorded as the owner's direction. `vision.md` §3 names the tension it
collides with — the boundary model gives the learner a stopping rule, and
a subscription wants people not to finish — and recommends letting them
finish and leave rather than building retention mechanics, with one-time
as the fallback if the numbers do not work.

### App 1 is settled: everything except listening

> *"App 1 ise bu projenin bitmiş hâli, çok konuşulacak bir şey yok;
> listening hariç tüm özellikler tamamlanır."*

This supersedes the v1.0 definition accepted on 2026-09-04, which put
reading outside v1 because a passage costs 2.5–3.5 hours of review and
is single-use. Reading is 21 of Session I's 60 points — the largest
section — so with it in, App 1 covers **all four sections of Session I,
60 of 60**, and the only thing missing is a separate sitting.

Cost of the override, stated because it is not small: roughly 75–90
hours of review to finish App 1, plus the cold-solve debt on whatever is
sold.
