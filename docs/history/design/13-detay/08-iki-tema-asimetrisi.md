# The two themes are not mirrors, and the measurement says so

Written by the supervising session, not an arm, because it closes a gap
in `12-arastirma/07-karar.md`: that document solved the surface ladder
for the dark theme only. The light theme was assumed to be the same
problem upside down. It is not.

Everything here was computed with this repo's own `tools/color.mjs`.

## 1 · The dark theme's ceiling is set by the ink

Already established in `07-karar.md` §2 and repeated here for the
comparison. Pure white ink, slate ground rising:

| CIE L\* | hex | Lc | WCAG | Lc ≥ 90 | WCAG ≥ 7 |
|---:|---|---:|---:|---|---|
| 4.9 | `#0C1117` | 107 | 18.95 | ok | ok |
| 22.4 | `#31363D` | 101 | 12.17 | ok | ok |
| 30.4 | `#43484F` | 96 | 9.22 | ok | ok |
| 36.3 | `#50565D` | 91 | 7.42 | ok | ok |
| 42.1 | `#5E646B` | 85 | 5.98 | **no** | **no** |

Both requirements break at nearly the same place. The text-bearing band
is **CIE L\* 4.9 → 36.3, about 31 points wide**, and the ladder in
`07-karar.md` uses 4.9 → 30.3 of it. It reaches the edge of the mid-tone
band (which starts at L\* 30).

## 2 · The light theme's floor is not set by the ink

Pure black ink — the darkest possible — on the warm cream ground,
descending:

| CIE L\* | hex | Lc | WCAG | Lc ≥ 85 | WCAG ≥ 7 |
|---:|---|---:|---:|---|---|
| 95.3 | `#F7F1E5` | 98 | 18.67 | ok | ok |
| 88.3 | `#E3DDD1` | 86 | 15.53 | ok | ok |
| 85.1 | `#DAD4C7` | 81 | 14.22 | **no** | ok |
| 81.5 | `#D0CABE` | 76 | 12.87 | no | ok |
| 72.0 | `#B6B0A4` | 62 | 9.74 | no | ok |
| 62.9 | `#9D988C` | 49 | 7.30 | no | ok |

**APCA binds and WCAG does not.** Lc 85 fails just under L\* 87, while
the WCAG 7:1 requirement survives all the way down to about L\* 62 —
twenty-five points further. So on the light theme the binding rule is
the self-imposed one.

And darkening the ink barely helps, because the ground already dominates:

```
ink L 0.225 #211B14 (bugünkü)  ->  en koyu metin taşıyan yüzey  CIE L* 89.0
ink L 0.200 #1B150E            ->                               CIE L* 88.3
ink L 0.170 #140E08            ->                               CIE L* 87.9
ink L 0.140 #0D0804            ->                               CIE L* 87.5
ink L 0.110 #070401            ->                               CIE L* 87.5
```

Going from the shipped ink to near-black buys **1.5 points of L\***.
In the dark theme, the corresponding move — ink L 0.941 → 0.975 — buys
**10.7 points** and is the whole reason the ladder can grow.

## 3 · The number that matters

| | text-bearing band | distance to the mid-tone band (L\* 30–70) |
|---|---|---|
| dark | CIE L\* 4.9 – 30.3, **25.4 points** | **touches it** |
| light | CIE L\* 89.0 – 95.3, **6.3 points** | **19 points away** |

The light theme's whole surface ladder has to live inside a six-point
window, and no ink choice widens it. `LIGHT_SPEC` already concedes part
of this — light `text-1` is held to Lc 85 where dark `text-1` is held to
Lc 90 — but nobody wrote down what the concession implies.

It implies this: **the light theme can never take its mid-tone from a
text-bearing surface.** Not with a deeper ink, not with more steps, not
with a different hue. The band is out of reach by nineteen points.

## 4 · What this constrains

`00-v4-olcumu.md` set a rejection condition of ≥ 10 % mid-tone
population. That condition has to be met in **both** themes, because
`npm run verify` sweeps both and WCAG conformance is defined per
responsive variation.

So whatever fills the mid-tone must be **non-text area** — and it must
be non-text area that exists in both themes, because in light it is the
*only* available source. That rules out, by measurement rather than by
taste:

- filling the gap by adding more surface steps (works in dark, cannot
  work in light);
- a mid-tone that is really "a card that is a bit lighter" (same);
- any scheme where the light theme is derived from the dark one by
  inversion — the two ladders have different widths and different
  binding constraints, so inversion cannot preserve both.

And it means the two themes need **different mechanisms for depth**, not
different values for one mechanism. The dark theme has 25 points of
lightness to spend and can express elevation as a ladder. The light
theme has 6, and has to express it some other way — edge, shadow,
chroma, or a plate that carries no text. `docs/design-system.md` already
says depth is "a lighter plane with a tokenised edge and shadow"; this
measurement says the *proportions* of those three cannot be the same in
both themes, and today they are.

## 5 · The open question this hands on

Arm 3 of this round is measuring what the owner's reference screens put
in their mid-tone and what could legitimately fill ours. This document
narrows its brief: the answer has to work at L\* 30–70 **against a cream
ground as well as a slate one**, and in the light theme it is carrying
the whole budget alone.

That is a harder constraint than it looks, because an element that is
mid-tone on both grounds is, by definition, not derived from either
ground. It is its own value — which is what "counter-plane" meant in
`02-references.md`, and which the app has never had.

## Öneri

1. **Stop treating the light theme as the dark theme inverted.** Write
   the asymmetry into `docs/design-system.md` as a measured fact with
   this table, so the next round does not rediscover it. The two
   ladders have different widths (25.4 vs 6.3 L\* points) and different
   binding constraints (both models together vs APCA alone).
2. **Solve the mid-tone once, for both themes, as non-text area.** Any
   proposal that produces mid-tone only in dark is a half-proposal and
   will fail the light sweep.
3. **Re-derive the light theme's depth mechanism separately.** With six
   points of lightness to spend, the edge and the shadow have to do more
   of the work than they do in dark. Solve their values against the
   same bar rather than reusing the dark theme's ratios.
4. **Consider whether light `text-1` at Lc 85 is the right concession.**
   It was made to make the light theme possible at all. It is worth
   restating as a deliberate, documented exception rather than a number
   that differs from its dark counterpart for unstated reasons.

## Doğrulanamayanlar

- **Why APCA's dark-on-light curve is stricter here is not verified
  from the source.** The measurement is solid — Lc breaks 25 L\* points
  before WCAG does on the cream ground — but the explanation lives in
  APCA's own documentation, and `w3.org`, `git.apcacontrast.com` and
  the Myndex docs sites are all blocked by this session's egress
  policy. `Myndex/SAPC-APCA` on `raw.githubusercontent.com` is
  reachable and should be read on an open machine to confirm the
  polarity asymmetry is intended and not an artefact of this repo's
  `apca()` port. `tools/color.mjs`'s implementation was cross-checked
  against `apca-w3` and `colorjs.io` in an earlier round
  (`CHANGELOG.md`, v0.56 Premium palette work), so the port itself is
  not in doubt; the interpretation is.
- **The 1.5-point figure assumes the current cream hue (H 85) and
  chroma (0.018).** A less saturated or cooler light ground would move
  it slightly. Not tested, because the warm cream was itself solved in
  an earlier round and reopening it is out of scope here.
- **Whether Lc 85 is the right light-theme bar** is a judgement, not a
  measurement. It is recorded as an open question, not answered.
