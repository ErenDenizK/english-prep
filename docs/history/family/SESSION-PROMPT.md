# Session prompt: English Prep in the family

Paste everything below the line into a new English Prep session. Replace `<branch>` with the
branch you want the work on.

---

> **Özet:** English Prep'i aile kitine göre incele; imzalarını asla düzleştirmeden üç küçük
> adımı (About'a "edk." imza satırı, yay dilinin mevcut sürelere eşlenmesi, portföy için
> world.json ve ekran görüntüleri) seçenek olarak sun, arayüze dokunmadan önce bana sor.

You are working on English Prep, in this repository, on the branch `<branch>` (create it from
`test` if it does not exist). `test` is the live GitHub Pages branch: never push to `test` or
`main`, and never merge into them; I do that myself.

Read first, fully, before proposing anything:

1. `CLAUDE.md`, and obey it: no build step, zero runtime dependencies, no `innerHTML`, settled
   navigation, CHANGELOG version `x` stays 0, Turkish UI in *sen*, `npm run check` must pass and
   `npm run verify` must pass for anything that touches a screen.
2. `docs/family/README.md` (English Prep's DNA, its untouchables and the candidate moves),
   `docs/family/world.json`, and the family kit in `docs/family/kit/` (if it holds only a README,
   the kit has not been copied yet: say so and work from `docs/family/README.md`).

Then propose the moves in `docs/family/README.md` §3 as options, ranked, each with what it
changes, what it costs and how it would look; recommend one and wait for my answer. In short:

- the portfolio embassy's captures and `world.json` (already prepared; no UI change);
- a credits line on About, "Made by edk." or a Turkish variant, in English Prep's own type and
  footer style, the `edk.` dot in Sakura;
- the family's spring grammar (press, settle, glide, pop) mapped onto the existing timings as
  documentation, without changing a single duration or curve.

Rules for this session:

- Never flatten English Prep's signatures to match another product: the plum ground, the
  Sakura / periwinkle answers with their words and marks, the living aurora under one parent
  cap, no glass, Inter reading 18/30, `ep.` with the Sakura dot, the 120 ms press and 380 ms
  release, the v0.72 route choreography, the folio About, the rail, the *sen* voice. If a family
  idea conflicts with one of these, the idea loses; tell me instead of compromising.
- Ask me before any UI change, however small, and show me the copy before writing it. For a UI
  change, screenshot at 1440×900, 1180×820 (touch) and 390×844 and look before reporting.
- If you change a token, regenerate `docs/family/world.json` with `node tools/make-world.mjs`
  (`npm test` fails otherwise). To refresh the portfolio's captures, run `npm run serve` and
  `node tools/capture-portfolio.mjs`.
- Keep `npm run check` and `npm run verify` green before every push. Conventional Commits,
  lower-case subject, header at most 100 characters.
- I talk in Turkish, often by dictation: read through transcription errors and confirm names.
