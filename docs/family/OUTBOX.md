# Outbox to the family

Findings from English Prep that may matter to the portfolio or the other products. Written only
here; the portfolio session reads it, folds what it accepts into the kit, and the entry is then
marked `received <date>` by an English Prep session. Newest first.

Format: `## <date> · <short title>` then **Finding**, **Evidence**, **Suggestion**.

## 2026-10-10 · "No glass" was never a principle of English Prep

**Finding.** The family notes list "no glass" as an English Prep signature. It was a recovery rule.
v0.56's glass failed technically (an 88 % tint over a blur that did not render let text show
through; the capsule was narrower than the content); v0.62's UI 3 failed on taste as a whole skin
(glow, rings, confetti, streaks, countdown) and glass went out with it. The owner lifted the ban
on 2026-10-10: glass is allowed under a measured material contract, through a lab.

**Evidence.** `CHANGELOG.md` v0.56–v0.57 and v0.64; `docs/PRINCIPLES.md` §4.

**Suggestion.** In `docs/design/family.md` §2.1 and §2.3 and `docs/family-kit/README.md`, replace
"English Prep removed glass by decision" with "English Prep is opaque today; glass is gated by its
material contract". Glass still should not become a family constant.

## 2026-10-10 · iOS Safari does not report `prefers-reduced-transparency`

**Finding.** Per MDN browser-compat-data (2026-10-08), `prefers-reduced-transparency` is
Chromium-only. A glass product whose solid fallback depends on it gives iPhone users no way to
ask for solid surfaces.

**Evidence.** MDN BCD 8.1.5, `css.at-rules.media.prefers-reduced-transparency`.

**Suggestion.** The charter's rule 1 (still twin) could say: a product with glass offers an in-app
"solid surfaces" setting in addition to the media query. Recto already has Glass Solid as a user
choice; English Prep will add one before any glass ships.

## 2026-10-10 · The family capture tooling broke on English Prep v0.77

**Finding.** `tools/capture-portfolio.mjs` waits for the old About folio, which v0.77 removed; the
`world.json` generator also broke on About's new promise markup (fixed in `dbd2651`). The About
page was rebuilt around the thesis "İkisi de doğru. Fark, anlamda."; the folio no longer exists,
so the family's English Prep object ("the folio: three leaves") describes a page that is gone.

**Evidence.** `about/index.html` (v0.77), `tools/capture-portfolio.mjs:185`.

**Suggestion.** Keep the embassy waiting for English Prep's phase-3 captures (`docs/ROADMAP.md`)
and revisit the folio object in `family.md` §3.3 against the new About.
