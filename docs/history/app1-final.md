# App 1 — the closed plan

**Planning for App 1 is closed as of 2026-09-06.** This document is the
whole of what remains. It is a list of work, not a discussion of
direction: the direction was settled by the owner —

> *"App 1 bu projenin bitmiş hâli, çok konuşulacak bir şey yok; listening
> hariç tüm özellikler tamamlanır."*

Anything below can be **executed**. Nothing below should be
**re-litigated**. A future session that wants to change App 1's scope
should first read §7, which records what was already decided against and
why, and then take it to the owner rather than to this file.

`docs/roadmap.md` remains the historical record of how the plan got
here. This is the plan.

---

## 1 · Where it stands, measured 2026-09-06

| | |
|---|---|
| Version | v0.39, on `test`, which is what GitHub Pages serves |
| Topics / questions / lessons | 10 / 241 / 60 |
| Categories | 60, at 4.0 questions each |
| Option notes | 723 — one for every wrong option in the app |
| Item types | 193 cloze, 24 restatement, 24 typed cloze |
| Unit tests / sweep checks | 161 / ~1,520, both green |
| Drafts not shipped | none |
| Source TODO/FIXME markers | none |
| Open validator warnings | 1 (§2, item C5) |
| Cold-solve debt | 241 items, **none of it paid** — and the per-item cost is unmeasured: between 40 seconds (`content-pipeline.md` §7.1) and several minutes, so between 3 and 28 hours. `docs/audit/solve-log.json` does not exist yet |

**Session I coverage today: 30 of 60 points.**

---

## 2 · Done means the whole of Session I

Session I is 60 points in four sections, all four-option multiple
choice. Session II is a separate sitting: listening and note-taking, 20
points, and it is **out** by the owner's decision.

| Section | Items | Points | Today |
|---|---|---|---|
| Cloze | 10 | 15 | **9 of 10 blank types** |
| Closest meaning | 10 | 15 | **done** |
| Reading — two texts | 14 | 21 | not started |
| Paragraph completion | 6 | 9 | not started |
| **Session I** | **40** | **60** | **30 of 60** |

**v1.0 is: every section of Session I practisable with reviewed content,
and the app never tells a learner something it cannot support.** 60 of
60. The version number itself still only moves from `0` to `1` when the
owner says so.

---

## 3 · The work, in order

Ordered so that each block is shippable on its own and nothing is
blocked by something later. Costs are the owner's hours, and where a
figure comes from a measurement rather than a guess it says so.

### Block A — finish the cloze section

**A1 · `so / such`.** The one cloze blank type nothing covers. One
category, four items, plus the lesson that teaches it.
*Cost:* ~half a day.
*Done when:* four items ship, through the full pipeline (§5).

**A2 · Repoint blank 7.** `CLOZE_BLANKS[6]` names a topic id `so-such`
that does not exist. `docs/roadmap.md` says the category should be folded
into an existing topic rather than made a topic of its own — **so a
decision is required and it must be made in the same commit as A1**: if
the category lands in `connectors`, blank 7 must point at `connectors`.
*Why this is a numbered item:* the identical mistake — a blank naming a
topic that never arrives — is what made the app understate its coverage
for two days, fixed in v0.39. The test now forbids a nameless blank; it
cannot forbid a wrongly-named one.
*Cost:* minutes.
*Done when:* `clozeCoverage(manifest.topics)` returns `covered: 10,
missing: []`, and `tests/coverage.test.js` asserts it.

### Block B — paragraph completion (9 points)

**B1 · The schema.** A ~120-word paragraph with one sentence removed and
four candidate sentences. It is neither a cloze nor a restatement, so it
needs its own item type: schema in `docs/CONTENT_GUIDE.md`, validation in
`tools/validate-content.mjs`, rendering in the quiz screen, and a case in
`tools/verify-ui.mjs`.
*The authoring difficulty, recorded so it is not discovered late:*
distractors here are on-topic and grammatical and fail on **coherence**.
That is a different skill from writing a grammar distractor, and the
category spec must say so.
*Cost:* ~1 day.

**B2 · The category spec**, per `docs/agents/category-spec.md`, before any
item is written.
*Cost:* ~half a day.

**B3 · 24 items** — six categories at four, matching the corpus's
existing density.
*Cost:* **~2 hours per item, ~48 hours.**
*Done when:* 24 items ship through the full pipeline, each with an option
note per wrong option.

### Block C — reading (21 points, the largest section)

**C1 · The schema.** Two texts, seven questions each. This is the first
item shape in the app where several questions share one stem, which
touches the quiz engine's draw as well as the renderer: a reading item
cannot be shuffled into a mixed test alone, and the mistake book must
handle an item whose passage is elsewhere.
*Cost:* ~1–2 days, and it is the most invasive code change left.

**C2 · Passages, as a supply rather than a project.** Each passage is
single-use — once read, all seven of its items are spent — so this is a
stock that gets replenished, not a task that completes.
*Cost:* **2.5–3.5 hours of review per passage.** A first stock of ten
passages is **25–35 hours** and 70 items.
*Done when:* six passages ship for v1.0; ten is comfortable.

**C3 · Reading is where the honesty claim gets hardest.** A reading
question with two defensible answers is much easier to write than a
grammar one, and much harder to detect. The cold-solve step (§5) is not
optional here.

### Block D — the screens that are left

**D1 · The error-tracking screen** (existing task #32, unblocked since the
chosen option started being stored). A place to examine past mistakes,
as opposed to the immediate feedback that already exists. The mistake
book covers *practising* them; this is *understanding* them.
*Note:* this is also App 2's core mechanic, and App 1 is the only place
it can be validated against ground truth, because here the paper says
whether the diagnosis was right. Build it properly.
*Cost:* ~2 evenings.

**D2 · The mock exam, under time.** All four sections at exam scale.
Last, because it cannot be honest until C2 has passages.
*Cost:* ~2–3 evenings.

### Block E — content debt

**E1 · The cold-solve debt.** §5. It is the gate on money, not on
shipping.
**Do one evening of it first, before planning around it.** The per-item
cost is the unit every estimate in `docs/business/` is denominated in
and it has never been measured — the repo's own two figures differ
tenfold. `npm run solve` records it; one sitting turns a guess into a
number.

**E2 · The duplicate-options warning.** `academic-nouns-adjectives-t13`
and `-t16` offer an identical option set within one category. Currently a
warning; either fix one item or record why it is acceptable, and get the
warning count to zero so the next one is visible.
*Cost:* under an hour.

**E3 · Every new item carries an option note per wrong option.** The
corpus is at 723 of 723 and that is a property worth not losing.

---

## 4 · Total, stated plainly

| | Hours |
|---|---|
| Paragraph completion (24 items + schema + spec) | ~60 |
| Reading (10 passages + schema) | ~35–45 |
| `so / such`, screens, debt items | ~15 |
| **To v1.0** | **~110–120** |
| Cold-solve, on whatever is sold | 3–28, unmeasured (see §1), shareable |

At an hour an evening that is roughly four months; at a weekend day a
week, roughly three. **The number is large because reading is large**,
and reading is 21 of the 60 points. It is the price of the cleaner claim
and the owner has taken it knowingly.

---

## 5 · The bar, which does not move

No item ships without all of it. This is not process for its own sake —
each step exists because it caught something the others could not.

1. **Category spec before content** (`docs/agents/category-spec.md`).
   Every finding worth acting on in the first review was invisible inside
   one item and obvious across four.
2. **Blind pass** — `npm run blind`, by a session that has not seen the
   key, on shuffled options and an allow-list.
3. **Lesson sufficiency pass** — run each lesson's decision procedure as
   a literal checklist over its own questions. A rule that fires and
   returns a wrong option is blocking even if a later rule would have
   reached the key.
4. **Repair, then an independent re-audit by a session that did not write
   the repair.** Five of the repair rounds so far introduced a *new*
   defect, every one caught here and none visible to `npm run check`.
5. **A human cold-solves it** — `npm run solve`, protocol in
   `docs/agents/solver.md`. The `b?` flag is the finding, not the score.
6. **`npm run check` green**, and **`npm run verify` green** for anything
   touching a screen.

**And the release rules:** `test` is what Pages serves, so a push is a
deploy and there is no staging branch. Exam weeks are code freezes.

---

## 6 · The paid release, v2.0

Not part of v1.0 and not blocked by it. The reasoning lives in
`docs/business/`; this is only the checklist.

| | |
|---|---|
| **Close the source** | The owner's decision. Going private does not retract what was public, so the paid corpus must not be the September corpus |
| **Contributor note** | Before a second person writes any content — text ready in `docs/business/contributing-draft.md` |
| **A domain** | Required for the Android route: Digital Asset Links must sit at an origin root, and the site is on a `github.io` subpath |
| **Entitlement** | Decide before building: a locally checked unlock code, or store-receipt entitlement. `docs/business/architecture.md` §3 |
| **Fetch or embed** | Decide before shipping: a wrong item that needs a store review to fix stays wrong during the one week it matters |
| **Ask an SMMM** | Whether running this jointly costs the GVK mük. 20/B exemption — *before* a developer account is opened in anyone's name |
| **Verify before spending** | `docs/business/shipping.md` §9 and `pricing.md` §7 |
| **Cold-solve what is sold** | §5, item 5. The gate |

---

## 7 · Decided against — do not reopen

Recorded so a future session does not spend a round rediscovering them.

- **Listening / Session II.** Out. Needs audio, which is a different
  project and a hosting decision.
- **Streaks, timers, notifications, leaderboards, any number that only
  goes up.** Refused for App 1. (App 2 reopens exactly one of these, on
  its own terms — that is App 2's decision and it does not travel
  backwards.)
- **Accounts, a backend, cloud sync.** Out. Export/import already covers
  the need at zero cost and zero risk.
- **Item-level spaced repetition and adaptive difficulty.** Both need
  roughly 15–20 items per category against 4 today. Not a principle, a
  threshold — and the threshold is not reached in App 1.
- **Flashcards.** Out.
- ~~**A theme toggle.**~~ Reopened by the owner on 2026-09-08 and
  shipped in v0.43 as a three-state preference (system / light / dark),
  because the light theme is a legibility measure rather than a taste:
  the owner's report of skimming small type is the documented signature
  of dark-mode reading. Both palettes are solved and re-measured in CI.
  What stays decided against is a *third* look.
- **The per-tier accent hue.** Parked in
  `docs/research/visual-longevity.md` §5.3 — and that document is now
  marked as researching a problem App 1 does not have.
- **A fourth lesson-block schema change.** Three presentations have each
  forced a content rewrite. If a fourth looks necessary, the question is
  whether the block *types* are wrong or only their rendering.
- **Bumping `x` to 1.** Only the owner does that, however finished it
  looks.

---

## 8 · After v1.0

Errata, and passages as supply. A yearly check that the paper has not
changed. That is the whole list.

**App 1 finishing is the point.** The way a solo project dies is by
never letting the first one finish, and every hour spent making App 1
more than this is an hour not spent on App 2, which is where the
interesting problem is.
