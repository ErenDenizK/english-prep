# `docs/business/` — what this is, and what is actually being asked

Six documents, written 2026-09-05 against the owner's brief of the same
night. This file exists because there are now roughly 2,700 lines here
and none of it is worth anything if he has to read all of it to find the
three decisions that are his.

**None of this is urgent.** The exam is days away. Every deadline below
is measured in weeks or months except one, and that one is only a
deadline because a friend might start writing content.

---

## The documents

**`ozet.md` is the whole of this directory in Turkish, on one page.**
Start there; everything below is the long form.

Read in this order. Each is self-contained; each says what it could not
verify.

| | | |
|---|---|---|
| **`ozet.md`** | **Türkçe özet — hepsi bir sayfada** | Where to start |
| **`brief.md`** | What the owner actually said | The record. Where anything below disagrees with it, this is what he said and the other is an argument |
| **`two-apps.md`** | Is the App 1 / App 2 split right? | Yes — but the seam is *exam / no exam*, not *Turkish / global* |
| **`pricing.md`** | The 270 / 150 / three-schools arithmetic | It clears his bar. The production cost, which he never computed, is the interesting number |
| **`shipping.md`** | How this reaches a paying student | The cheapest path has no store in it. Android before Apple |
| **`architecture.md`** | What "a bit online" costs the codebase | The app already contains the hard half of sync. One purchase is irreversible |
| **`licensing.md`** | Who owns this | Public repo, no licence. Two assets wanting opposite answers |

---

## The one finding that arrived four times

Four documents were written independently, from four different starting
questions, and all four hit the same wall:

> **You cannot sell a public static file.**

`two-apps.md` §6.1 names it as a collision between two of the project's
own commitments — *"a meaningful part is free"* and *"content is data,
served as static JSON"*. `pricing.md` §2.0 calls it a constraint that
comes before the free-tier design. `architecture.md` §3 works out that
this makes the paywall a hosting decision rather than a code decision.
`shipping.md` §2 arrives at it from the store side: the 15% a store
takes is really rent on an entitlement service, and that is the service
this app does not have.

Every question, lesson and option note is retrievable today with one
`curl` and ten more. A paid unlock stored in `localStorage` is a lock on
an open door, in a repository whose source anyone can read.

**Settled by the owner, 2026-09-06** (`brief.md`, addendum): the source
gets closed before anything is charged for, and the content changes
substantially before that point anyway. That is a fourth resolution and
a cleaner one — all four arms were reasoning inside a constraint (the
repository stays public) that was never actually his. The one fact it
carries rather than removes: going private does not retract what was
public, so the September corpus is out for good. His second clause is
what makes that fine, which makes it load-bearing rather than
incidental.

The three the documents had reached, kept because they are still the
map of what each choice costs (`two-apps.md` §6.1):

1. **Sell the container, give away the content.** The web app stays free
   and complete; what people buy is installation, offline convenience,
   and supporting the project.
2. **Split the corpus.** Free content in the repo, paid content only in
   a store binary — at the cost of one of the project's rules, which is
   load-bearing for the whole authoring model.
3. **Charge nothing for App 1.** Treat the listing and the tax
   registration as the rehearsal, and let App 2 be the thing that ever
   asks for money.

The documents lean different ways and say why. Nobody can pick for him,
because the choice turns on how much he wants the money — and he has
already said the money is not the point.

---

## Where the documents disagree

Recorded rather than smoothed over, because a synthesis that hides its
disagreements is worth less than the arms it summarises.

**Should App 2 be a subscription?** `pricing.md` §3.2 says recurring,
annual-first, *conditional on committing to ship content monthly*.
`two-apps.md` §5.4 says don't — because that same commitment is 3–4
hours of his personal attention every month, permanently, and a monthly
price is a promise of continuing supply. They agree on the mechanism
exactly and differ on whether the bet is worth taking. `two-apps.md`
offers the compromise: a *supporter* subscription that withholds
nothing.

**Should App 1 charge at all?** `pricing.md` assumes a price and
computes what it is worth (~163 TL net per sale, ~150 sales to clear his
stated bar). `two-apps.md` §6.1 argues option 3 — charge nothing —
precisely because the owner said the point is the experience, and
charging nothing removes the refund surface, the DRM temptation and the
review-policy risk in one move, at a cost of about 23,000 TL that was
never the goal.

**How badly does an unlock code leak?** `architecture.md` §3 argues that
at his scale a key a determined student defeats in ten minutes still
collects from the ninety-odd per cent who never try, at zero hosting
cost. `shipping.md` §2 argues the opposite from the same fact: 150
students across three schools all know each other, and one screenshot in
a class group chat ends the model. Both are right about different
things, and the difference between them is **how good the free tier
already is** — which is `pricing.md` §2.5's answer, *free forever, paid
depth*. A shared code that unlocks depth for someone who would never
have paid costs nothing. A shared code that unlocks the product does.

---

## What the documents actually agree on

- **Two apps, not one with a toggle.**
- **The corpus travels; the lessons do not.** 21 of 241 questions reason
  about Turkish; 51 of 60 lessons do. So localisation is a co-author per
  language, not a translation ticket.
- **Content supply is the binding constraint**, and it does not scale:
  6–8 minutes of the owner's own attention per shipped item.
- **The pipeline is the product.** Not the explanations — explanations
  are free everywhere now, which is why the competitor is ChatGPT rather
  than Duolingo. What is hard to copy is a review process that is slow
  on purpose.
- **Android before Apple**, on the reported >85% Android share in
  Turkey, and no native rewrite — not for the five-to-nine months, but
  because it would put every corrected question behind a store review in
  the week before an exam.
- **Guard the zero running cost.** It is the property that lets this
  still be alive next year; it cannot be killed by neglect and it cannot
  leak what it does not hold.

---

## The decisions that are his, by deadline

| When | Decision | Where |
|---|---|---|
| **Before his friend writes any content** | A one-paragraph note that contributions are licensed to the project and may be relicensed. Whoever writes a lesson owns it by default, and a later sale or relicence would need every author's individual agreement | `licensing.md` §5 |
| Before a developer account is opened in anyone's name | Whether running this jointly costs the Turkish tax exemption — summaries say an *adi ortaklık* cannot use it. **For an SMMM, not a search engine** | `two-apps.md` §7.2 |
| Before spending the $25 | Whether Türkiye is a supported Google Play merchant location. The whole Android route depends on it and it could not be confirmed | `shipping.md` §9 |
| ~~Before charging anything~~ | ~~Which of the three resolutions above~~ — **decided: close the source first** | `brief.md` addendum |
| Before charging anything | Whether the paid app *fetches* content or *embeds* it — a wrong question that needs a store review to fix stays wrong during the one week it matters | `pricing.md` §5.3 |
| Whenever | `data/` all-rights-reserved or CC BY-NC-ND; MIT or Apache-2.0 for the code | `licensing.md` §3 |

---

## What was re-derived independently

This project's own rule is that a finding is not a finding until someone
who did not produce it has re-produced it. The repo-derived numbers the
arms lean on were re-measured on 2026-09-05 by a separately written
script, against `data/` rather than against the documents:

| Claim | Where | Re-derived |
|---|---|---|
| 21 of 241 questions reason about Turkish | `two-apps.md` §1.1 | **21 / 241 (8.7%)** ✓ |
| 51 of 60 lessons do | `two-apps.md` §1.1 | **51 / 60 (85.0%)** ✓ |
| ~37,000 words of lesson prose | `two-apps.md` §5.3 | **36,987**, 616 per lesson ✓ |
| ~80,000 authored words | `pricing.md` §1.2 | **79,778** ✓ |
| ~178 words per question | `two-apps.md` §5.1 | **178** ✓ |
| Four calendar days | `pricing.md` §1.2 | first commit 2026-09-02, latest 2026-09-05 ✓ |

The measurement that matters most is the first pair, because the whole
*exam / no-exam* seam rests on it: the item bank travels and the lessons
do not. It reproduces exactly.

**The figures that were not re-derived are the ones from outside the
repository** — every tax rate, commission, store fee and policy clause.
Those are the subject of the next section, and none of them has been
verified at source.

---

## The rule this directory is written under

Turkish tax law and Apple's review policy are the two subjects where
being confidently wrong is most expensive, and the sessions that wrote
these documents had **no working `WebFetch`**. So every claim carries a
mark, or is marked `[unverified]`, or names the professional who should
answer it instead. Where a document says a figure came from a search
summary rather than a source, that distinction is real and should be
treated as real.

Three numbers in here are load-bearing and none of them has been
verified at source: the Turkish KDV rate, the App Store Small Business
Program terms, and GVK mükerrer 20/B. Each document says so where it
uses them.
