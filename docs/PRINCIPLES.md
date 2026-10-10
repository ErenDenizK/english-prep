# English Prep principles

How this product decides, 2026-10-10. Read after `CLAUDE.md`. [`STATE.md`](STATE.md) says what
the code does today, [`ROADMAP.md`](ROADMAP.md) what comes next, and
[`margin-design-system.md`](margin-design-system.md) holds the current interface values. This page
holds no pixel values; it says why the rules exist and how one is added, changed or retired.

> **Özet.** Bu sayfa kuralların nasıl doğduğunu ve öldüğünü anlatır. Beş fikir: (1) V1, içerik
> değil, sunulabilir bir üründür ve onu sen onaylarsın; (2) ailenin ortak paydası tüzük, ışık,
> hareket dili, imza ve sunumdur; malzeme, font ve renk her ürünün kendisinindir; (3) her kural ya
> senin tarihli bir tat kararın ya da CI'da ölçülen bir kapıdır, üçüncü tür kural yoktur; (4) her
> yeni teknik önce laboratuvarda denenir, ölçülür, sen onaylarsın, tek yüzeyle ve geri alınabilir
> girer; (5) bir sürüm yalnızca bir görsel ekseni değiştirir. UI 3'ü batıran cam değil, her şeyin
> aynı anda değişmesiydi.

## 1. What V1 means

V1 is a judgement on the **product**, not on its coverage. It has nothing to do with how much of
any exam the content covers, how many topics exist, or what the app becomes later. The owner calls
V1 when the product clears four bars and they sign it off:

| Bar | Means | Evidence |
|---|---|---|
| **Works** | No known defect on the main journeys; every automated suite runs in CI and is green; one pass on a real iPhone and a real Android | CI, `npm run verify`, the browser suites, a dated device note in `STATE.md` |
| **Looks** | Every screen holds up at 390×844, 1180×820 (touch) and 1440×900, dark and light, with motion on, reduced and off, and in forced colours | Screenshots checked before every report; the V1 polish list in `ROADMAP.md` is empty |
| **Tells** | One story, said the same way on About, the README, the manifest, page metadata and onboarding; every image is a current capture | §5 below; captures carry the build they were shot from |
| **Belongs** | It meets the family charter and ships the portfolio's embassy assets | §2 below; `docs/family/world.json` on the kit's schema; the clip and captures |

The version number follows the decision: `x` stays `0` until the owner says V1, then becomes `1`
and `main` receives the build by the owner's hand. Nothing an assistant does moves `x`.

What the product becomes after V1 (exam app, general English app, two apps) is open and parked in
[`PRODUCT-DIRECTION.md`](PRODUCT-DIRECTION.md). V1 must not decide it by accident: no change for
V1 may close either road.

## 2. The family and its common ground

English Prep is one of several products by one maker (`edk.`), presented in the portfolio as
"embassies" of one "house". The family kit in [`family/kit/`](family/kit/) is copied from the
portfolio repository and never edited here; [`family/README.md`](family/README.md) is English
Prep's own page in it.

**Shared (we adopt):**

1. **The quality charter** ([`kit/charter.md`](family/kit/charter.md)): eight rules, each enforced
   here by a named check (table in §6).
2. **Light as the shared origin** ([`kit/light.md`](family/kit/light.md)): English Prep's aurora is
   the kit's reference implementation. Keep it and keep its own CSS.
3. **A motion grammar** ([`kit/motion.md`](family/kit/motion.md)): the four roles press, settle,
   glide and pop. English Prep names its existing motions with these roles. The roles are
   vocabulary, not values: no duration is retuned to match another product.
4. **The maker's mark at exits only**: a credits line on About ("Yapan: edk." or the owner's
   chosen wording), never inside a working screen.
5. **Presentation** ([`kit/presentation.md`](family/kit/presentation.md)): real captures, a
   signature clip, `world.json`, the promise line with its proof.

**Own (never flattened to match a sibling):** typeface (Inter), colour and pigments (plum ground,
Sakura, iris, lagoon, apricot), answer semantics (opaque Sakura *Doğru*, periwinkle *Yanlış*,
always with words and marks), material choices, the press-and-release feel, the scroll rail, the
`ep.` mark, the Turkish *sen* voice, navigation. If a family idea conflicts with one of these, the
idea loses and the owner is told.

Material is explicitly **own**: Recto is glass, Eat Map is system glass, English Prep is opaque
today. Whether English Prep gains glass is decided by §4, not by the family.

**Talking to the family** (proposed 2026-10-10, awaiting the owner's yes). Findings that matter to the other products go in
`docs/family/OUTBOX.md` (date · finding · evidence · suggestion), written only in this repo. The
portfolio session reads every app's outbox and folds what it accepts into the kit. No session
writes into another product's repository.

## 3. Two kinds of rule, and no third

The old documentation failed because rules accumulated without saying where they came from: a fix
for one broken version ("no glass", "nothing under the bars", "no screenshot gallery") read like a
law, and every later session obeyed it. From now on every rule in `CLAUDE.md`, `margin-design-
system.md` or an ADR is one of two kinds:

- **A taste decision** by the owner: dated, in the owner's words, with what it replaced. It
  changes only when the owner changes it. Example: "Eğitim and Test are the two nav peers; Profil
  lives in the header (owner, 2026-09)."
- **A measurable gate**: a number and the check that enforces it, in CI or in `npm run verify`.
  It changes when the measurement shows it is wrong. Example: "text on any surface ≥ 7:1 against
  its worst backdrop (`npm run color`)."

A rule that is neither (a remembered incident, a preference of a past session, a description of
what one version looked like) is **history** and belongs in `docs/history/` or an ADR's context,
never in the instructions. Engineering lessons from one bug ("never reparent a clicked descendant
during pointerdown") live as a comment beside the code they protect.

When two documents disagree, the order is: the code and its checks › `STATE.md` › `CLAUDE.md` ›
the newest ADR on the topic › `margin-design-system.md` › anything in `docs/history/`.

## 4. Changing safely: one axis, through the lab, behind a gate

**One visual axis per release.** The axes are material, colour, type, motion, layout and
navigation. A release may change one of them broadly, or several of them in one component, never
several of them across the app. UI 3 (v0.62) changed material, colour, ornament, motion and
gamification at once; the owner could not reject one part without rejecting the whole, and the
app spent five versions recovering. Glass was the casualty, not the cause.

**New techniques go through the lab.**

1. **Lab.** The experiment lives in `lab/<topic>/index.html`: not linked from the app, `noindex`,
   not precached by `sw.js`, using a copy of the live tokens and fixture backdrops (the aurora at
   peak, a lesson, a white capture). The lab page shows its own gate numbers live.
2. **Gate.** The technique's measurable gates are written and pass in CI before it touches a real
   screen.
3. **Owner.** An ADR with before/after screenshots at the three sizes in both themes, and the
   owner's explicit yes recorded in it.
4. **Promotion.** One surface per release, behind a `data-*` switch whose default is the old
   behaviour until the release ships, so reverting is one line. The CHANGELOG entry names the gate
   numbers.

**The material contract (for any glass or blur).** Glass is allowed again (owner, 2026-10-10), on
these terms:

- *Where:* chrome only (top bar, tab capsule, action bar, transient menus, dialogs). Never cards,
  answers, inputs or the reading column. No glass inside glass. Reading and quiz screens carry at
  most one persistent glass surface; a phone at most two persistent and one transient.
- *G1, text on glass:* modelled over the worst backdrop (aurora at its cap, a Sakura answer, a
  white capture): body text ≥ 7:1, labels ≥ 4.5:1, APCA reported.
- *G2, failure is safe:* if the blur does not render, content behind the surface stays unreadable
  (residual contrast ≤ 1.15:1, which means tint alpha about 0.93 or more) — the v0.56 failure was
  exactly a blur that did not render over an 88 % tint.
- *G3, rendered pixels:* a software-rendered Chromium pass and a WebKit pass compare screenshots
  with the model.
- *G4, still twin:* reduced transparency, high contrast, forced colours, no `backdrop-filter`
  support and an in-app "Saydamlık" setting all render solid tokens. The in-app setting is needed
  because iOS Safari does not report `prefers-reduced-transparency`.
- *G5, cost:* on a 4× CPU-throttled phone profile, a lesson scroll with the aurora live keeps p95
  frame time ≤ 16.7 ms and within 2 ms of the solid build; one real-device check before promotion.
- *Behaviour:* no animated filters, no `will-change` at rest, no filtered ancestors, surfaces at
  least 32 px in both directions. Recto's glass model and tests are the reference implementation
  (`ErenDenizK/recto`, `docs/design/redesign-2026-10/`).

The same pattern (lab, gates, owner, one surface, switch) applies to any new technique: scroll-
driven animation, view transitions, a new atmosphere effect.

## 5. The story

The product's thesis already exists and is good: **"İkisi de doğru. Fark, anlamda."** The learner
it serves has a real English ear and no labels — competence without the scaffolding. The app does
not teach English from zero; it draws the boundary between two things the ear conflates and names
it. The unit of the product is a *distinction*.

For V1 the story is told from that thesis on every surface (About, README, manifest, page
metadata, onboarding, the portfolio embassy): who it is for and what it does, not which exam it
serves. The exam is a context the app is good for, mentioned where it helps (the Test tab, the
FAQ), not the headline. This keeps both roads in `PRODUCT-DIRECTION.md` open. The exact headline
and copy are the owner's to approve; sessions propose wording, never ship it unseen.

Presentation follows the charter: real captures of the shipping build, dated; no drawn device
frames; one signature clip (press, release, the Sakura *Doğru*); the promise line ("Ücretsiz ·
Hesap yok · İlerlemen kendi tarayıcında") linked to its proof (the storage code and the test that
asserts no network requests).

## 6. The charter, enforced here

| Charter rule | Enforced by | State (v0.77) |
|---|---|---|
| 1 Still twin | reduced-motion and forced-colours screenshots in the sweep | App passes; About fails in forced colours |
| 2 Contrast measured | `npm run color` (`tools/editorial-palette.mjs`) in CI | Passes |
| 3 Real captures | capture scripts in `tools/`; every image names its build | Captures are v0.73; About draws a fake device frame |
| 4 No characters as icons | `js/icons.js`; a sweep check for arrow/tick glyphs in UI strings | About and some help text use Unicode arrows |
| 5 Rest is still | an idle-frames check in the sweep | About runs three infinite loops |
| 6 Seen at three sizes | screenshots at 1440×900, 1180×820 touch, 390×844 (plus 320 and 768) | Not yet in the sweep's size list |
| 7 Decisions written | ADRs; this page's two kinds of rule | Partly; About v0.77 has no design note |
| 8 Promise proven | the promise links to `js/storage.js` and the no-network test | No link yet |

Closing the "State" column is part of V1 (`ROADMAP.md`, phase 3).

## 7. Modern platform, without a build step

The platform moves fast and the app should use it, under the same rules: no build step, no runtime
dependency, a fallback for every browser the learners use (mostly iPhone Safari). Adopt a feature
when it deletes code or fixes a real problem, not because it is new. Current calls, from the
2026-10 platform survey (support data: MDN browser-compat-data, 2026-10-08):

- **Now:** subset Inter to Latin + Turkish + arrows (344 KB → about 100 KB on every cold load);
  `text-wrap: pretty`/`balance`; delete the dead glass and view-transition CSS.
- **V1:** one ordered `@layer` stack for all stylesheets (removes the `!important` overrides and
  the two-skin problem); `scrollend` for the rail with the timer as fallback; anchor positioning
  for the listbox behind `CSS.supports`; `commandfor` on dialog buttons.
- **After V1:** customizable `<select>` to retire `js/listbox.js` once Firefox and older iPhones
  catch up; scroll-driven animation for About and the rail; the Navigation API for the router;
  `light-dark()`.
- **Avoid for now:** same-document view transitions for routes (the snapshot swallows taps, as
  ADR 014 found for cross-document ones); speculation rules; `content-visibility` in the reader
  (it breaks the rail's measurements); Chrome-only features as anything but enhancement.
