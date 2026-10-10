# English Prep in the family

**Status:** documentation and tooling only, 2026-10-09; corrected 2026-10-10 for v0.77 and the owner's decisions (glass gated, About free to change). The work on these moves is in `docs/ROADMAP.md` phase 3. Nothing here changes the app, and
nothing here is binding on English Prep. Every move in §3 needs the owner's yes, one at a time,
in an English Prep session of their own.

**Where this comes from.** The maker's portfolio (`erendenizk.github.io`, repo `Portfolio`)
wrote a family vision, *Kept light* (`docs/design/family.md` there), on the evidence of a family
audit (`docs/research/2026-10-family-audit.md` there). It treats Recto, English Prep and Eat Map
as products by one maker that keep their own character and meet at a shared origin. The
portfolio is the "house"; each project view in it is the product's "embassy", where the
product's own ground, light and real captures take over. Brief amendments of 2026-10-09 that
bear on this app: each app keeps its own fonts; light is the shared origin; `edk.` (the maker's
mark) appears in an app only at exits; the owner runs each app's work in its own session.

The family kit (shared design files and prompts) is copied into [`kit/`](kit/) from the
portfolio's `docs/family-kit/`; `kit/README.md` says how. This file is English
Prep's part of it.

## 1. English Prep's DNA, as recorded

Every value below is read from the app's own files. [`world.json`](world.json) carries the same
values in machine form; it is generated, never edited (§4).

| Facet | Value | Source |
|---|---|---|
| Ground | plum `#141216`; card `#1d1a20`; raised `#28242c`; light theme `#fbf7fa` / `#ffffff` / `#f0eaf0`; new visits start dark | `css/editorial.css` `:root` |
| Ink | `#eee9ed` main (15.5:1 on the ground), `#d2c9d3` supporting (11.6:1); hairline `#39313d`, essential edge `#95899b` | same; ratios from `tools/color.mjs` |
| Accent | Sakura pair `#ed96b4` → `#dca2d8`, `linear-gradient(120deg in srgb, …)`, ink `#301b27` (7.3:1 on both stops); Sakura text `#efb1cb`; focus `#d4b5f8` | same |
| Accent's one job | the one primary action, and *correct* (always with the check and the word *Doğru*) | Margin system, `CLAUDE.md` |
| Supporting roles | iris `#c8b4e9` (structure), lagoon `#a4d3db` (context, application), apricot `#e9bb95` (attention, return) | `--secondary`, `--cool`, `--tertiary` |
| Answers | correct: opaque Sakura `#eeb4d1` on `#392532`, edge `#bb8ca4`; selected incorrect: periwinkle `#b6c6ed` on `#252d42`, edge `#8d9bbd` | `--ok*`, `--no*` |
| Light (the aurora) | three clusters (north, east, south), each crossfading cherry `#a04278`, iris `#6350a5`, lagoon `#28798a`; drift 9.75 / 11.75 / 13.75 s, colour cycles 13.5 / 15.75 / 18 s, independent phases; **one parent opacity** .42 dark / .09 light; paused when hidden; reduced motion = three still pools; forced colours hide it | `.ambient*` in `css/editorial.css`, `js/motion.js` |
| Materials | opaque today (`--glass: var(--page)`, `backdrop-filter: none` in the app shell; About's masthead blurs); glass is gated by the material contract (`docs/PRINCIPLES.md` §4), not banned; opaque cards; elevation `0 8px 28px #00000024` + 1 px inner highlight | `css/editorial.css` |
| Type | Inter variable (self-hosted `assets/fonts/InterVariable.woff2`), both languages; reading 18/30 in a ~600 px column; titles 600 with tight tracking | same |
| Mark | `ep.` / `english prep.`, Inter 600, tracking −0.065 em, the dot in Sakura `#efb1cb` | `js/brand.js`, `.brand-mark` |
| Motion | press: inner face to .945 in 120 ms; release 380 ms (.945 → 1.035 → 1); route 360 ms over 12 px; scene 560; complete 720; story 900; flow 1100; ease `cubic-bezier(0.22, 1, 0.36, 1)` | `css/interactions.css`, `js/interactions.js` |
| Signatures | the living aurora; the answer commit (colour cue 220 ms, verdict mark 560 ms); the elastic scroll rail; the drawn lesson signature; About v0.77's two-sentence lens (the v0.72–0.76 folio is gone) | `CLAUDE.md`, `about/about.css` |
| Voice | Turkish in *sen*, short and warm; English example sentences; "refine, not teach from zero" | `CLAUDE.md` |
| Promise line | "Ücretsiz · Hesap yok · İlerlemen kendi tarayıcında" (*Free. No account. Your progress stays in your browser.*); the family's short form drops the first word | `about/index.html` `.ab-quiet` |

Note on the checkers: the live palette is audited by `tools/editorial-palette.mjs` against
`css/editorial.css`, the one token source; `world.json` reads the same layer. The UI 3 palette
and its checker are gone.

## 2. What stays untouchable

From the family vision's §2.3, which outranks every family idea: if a move touches a row here,
the move loses.

- The plum ground and the Sakura / periwinkle answer semantics, always with words and marks.
- The living three-cluster aurora under one parent cap, with its still twin.
- Opaque cards; any glass only through the material contract (owner, 2026-10-10).
- Inter reading 18/30 in a ~600 px column; no new font bytes for the family.
- `ep.` with the Sakura dot.
- The 120 ms press and the 380 ms release; the v0.76 choreographed entrances (ADR 014).
- The scroll rail. (About may be redesigned from scratch: owner, 2026-10-10.)
- Turkish *sen* voice.
- Settled navigation: two peers in the capsule, Profil in the header.
- No build step, no runtime dependency, no `innerHTML`; `CHANGELOG` `x` stays 0; `test` is live.

## 3. The smallest candidate moves, ranked

None is scheduled. Each is small, reversible and sits at an exit or outside the app. Each needs
the owner's OK before it is built.

1. **Captures and `world.json` for the portfolio's embassy (no UI change).** Already prepared
   here: `world.json` and `tools/capture-portfolio.mjs`. The portfolio copies them; English Prep
   ships nothing new to learners. The only open question is whether the owner wants the embassy
   to use these screens (Eğitim, a lesson, an answered question, results, About) and the
   answer clip.
2. **A credits line on About ("Made by edk." variant), in English Prep's own style.** One line
   in the existing About footer, in Inter at the footer's size and `--ink-2`, the `edk.` dot in
   Sakura `#efb1cb` so `ep.` and `edk.` rhyme on one screen, linking to the portfolio's English
   Prep view. Turkish candidates, for the owner to choose: "edk. tarafından yapıldı." or
   "Yapan: edk." (the English "Made by edk." if the owner prefers the mark untranslated). No new
   font: the `edk.` mark is set in Inter, not the portfolio's serif, unless the owner chooses the
   drawn mark (family vision §6.1 Q5 d). Placement: the footer's first column, under
   "İngilizceyi sıfırdan değil, ayrımlarıyla düşün.", never in the hero. Needs a
   string, a link and screenshots at 1440×900, 1180×820 and 390×844; `npm run check` and
   `verify` green.
3. **The shared spring grammar as a naming map, with no timing changed.** The family names four
   roles (press, settle, glide, pop). English Prep already has all four; the map is
   documentation (a comment beside `MOTION_DURATIONS` or a line in `docs/design/motion-v076.md`),
   never a retune:

   | Family role | English Prep today (unchanged) |
   |---|---|
   | press | inner face to .945 in 120 ms, `cubic-bezier(.2,.65,.25,1)` |
   | settle | the continuous 380 ms release, .945 → 1.035 → 1 |
   | glide | route 360 ms over 12 px; scene 560 ms |
   | pop | the verdict mark, 560 ms (.72 → 1.1 → 1), after a 220 ms colour cue |

   Since v0.76 English Prep's entrances use springs sampled into CSS `linear()` (`js/interactions.js`); press and release stay bezier keyframes. No value is retuned for the family. The family
   rule "rest is still; only ambient light drifts, ≥ 9 s, paused when hidden" is already true
   here (the shortest drift is 9.75 s).
4. **Later, only if asked:** a "How this is made" link to the family's quality charter beside
   About's existing technical disclosures; a social card in the family format (product ground,
   `english prep.` left, `edk.` small bottom right).

Not proposed, and why: anything inside working screens (the maker's mark at exits only); any
change of face, colour, material or motion to match another product (the vision forbids it).

## 4. Tools

| Tool | What it does |
|---|---|
| `node tools/make-world.mjs` | Regenerates [`world.json`](world.json) from `css/editorial.css`, `css/interactions.css`, `js/interactions.js` and `about/index.html`. `--check` fails on drift; `tests/family-world.test.js` runs that check inside `npm test`, so a token change that forgets it fails CI. |
| `node tools/capture-portfolio.mjs [baseUrl]` | Needs `npm run serve`. Shoots home, lesson, question with feedback, results and About at 1440×900 and 390×844, DPR 2 (broken on v0.77: it waits for the removed folio, `tools/capture-portfolio.mjs:185`; rewritten in roadmap phase 3), and records the answer clip (correct, next question, wrong; about 9 s) at both sizes. Writes to `captures/portfolio/` (gitignored): PNG always, WebP and a trimmed VP9 WebM with a poster when `ffmpeg` is on PATH. Playwright is found as `tools/verify-ui.mjs` finds it; no dependency is added. |
| `python3 tools/capture-portfolio.py` | The older tool that keeps About's own committed captures (`about/assets/`); unrelated to the portfolio, left as it is. |

The stills use reduced motion, which shows the aurora as its three still pools and makes every
frame repeatable; the clips run with motion on. Everything on screen is the real app: the quiz
session and the 4 / 5 result are seeded through the app's own modules, as the About captures
are. Playwright's recorder caps clip quality; if the portfolio needs a sharper clip, record a
CDP screencast instead (a change to this tool, not to the app).

`world.json`'s schema is provisional (`family-world/0`): when the kit's `presentation.md` fixes
the schema, adjust `tools/make-world.mjs` and regenerate.

## 5. For the owner's English Prep session

The 2026-10-09 session prompt is in `docs/history/family/SESSION-PROMPT.md`; it predates the
owner's 2026-10-10 decisions and is superseded by `CLAUDE.md`, `docs/PRINCIPLES.md` and
`docs/ROADMAP.md`. Findings for the family go in [`OUTBOX.md`](OUTBOX.md).
