#!/usr/bin/env python3
"""Measure a screenshot the way docs/design/02-references.md measures one.

Not part of `npm run check` and not a dependency of anything: it needs
Pillow, it measures PNGs rather than the app, and CI has no browser to
produce the PNGs. It lives here so the numbers in 02-references.md can
be reproduced and so the next round measures the same things the same
way, rather than inventing a metric to fit a conclusion.

    python3 docs/design/measure-screens.py shot.png [more.png ...]

Crop to the screen itself first — inside the bezel, with no studio
backdrop, no hand and no host chrome. The first version of
02-references.md did not, and its main finding was an artefact of the
backdrop it left in the sample.

Columns, all defined in 02-references.md §2:

  neutral     OKLab chroma < 0.035
  structure   gradient to the next pixel right/down > 0.08 in CIE L*
  tonal       p95 - p5 of CIE L*
  conc        share of chromatic pixels in the busiest 32 of a 10x16 grid
  counter     share on the far side of L 0.5 from the screen's own ground
  ink         share more than 0.35 in OKLab L from the ground, at 390px
"""

import math
import sys
from collections import Counter

from PIL import Image

C_NEUTRAL = 0.035   # OKLab chroma below this counts as neutral
G_EDGE = 0.08       # CIE L* step to the next pixel that counts as structure
INK_DELTA = 0.35    # OKLab L distance from the ground that counts as ink


def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def oklab(px):
    r, g, b = (_lin(v / 255.0) for v in px)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_ = l ** (1 / 3) if l > 0 else 0.0
    m_ = m ** (1 / 3) if m > 0 else 0.0
    s_ = s ** (1 / 3) if s > 0 else 0.0
    return (
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    )


def lstar(px):
    r, g, b = (_lin(v / 255.0) for v in px)
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    f = y ** (1 / 3) if y > 0.008856 else (7.787 * y + 16 / 116)
    return (116 * f - 16) / 100


def ground(pixels):
    """The screen's own surface: mean of its most common quantised colour."""
    key = Counter((r // 6, g // 6, b // 6) for r, g, b in pixels).most_common(1)[0][0]
    same = [q for q in pixels if (q[0] // 6, q[1] // 6, q[2] // 6) == key]
    return tuple(round(sum(c[i] for c in same) / len(same)) for i in range(3))


def _pixels(im):
    raw = im.tobytes()
    return [tuple(raw[i:i + 3]) for i in range(0, len(raw), 3)]


def measure(path, inset=0.0):
    im = Image.open(path).convert("RGB")
    if inset:
        dx, dy = round(im.width * inset), round(im.height * inset)
        im = im.crop((dx, dy, im.width - dx, im.height - dy))

    wide = im.resize((390, max(1, round(im.height * 390 / im.width))), Image.LANCZOS)
    wp = _pixels(wide)
    g_l = oklab(ground(wp))[0]
    if g_l >= 0.5:
        ink = sum(1 for q in wp if oklab(q)[0] < g_l - INK_DELTA) / len(wp)
    else:
        ink = sum(1 for q in wp if oklab(q)[0] > g_l + INK_DELTA) / len(wp)

    small = im.resize((200, max(1, round(im.height * 200 / im.width))), Image.LANCZOS)
    w, h = small.size
    p = _pixels(small)
    n = w * h
    ls = [lstar(q) for q in p]
    cs = [math.hypot(*oklab(q)[1:]) for q in p]

    neutral = sum(1 for c in cs if c < C_NEUTRAL) / n

    edges = 0
    for i in range(n):
        x, y = i % w, i // w
        gx = ls[i + 1] - ls[i] if x < w - 1 else 0.0
        gy = ls[i + w] - ls[i] if y < h - 1 else 0.0
        if math.hypot(gx, gy) > G_EDGE:
            edges += 1
    structure = edges / n

    ordered = sorted(ls)
    tonal = ordered[int(0.95 * (n - 1))] - ordered[int(0.05 * (n - 1))]

    cols, rows = 10, 16
    cell = [[0] * cols for _ in range(rows)]
    total = 0
    for i, c in enumerate(cs):
        if c >= C_NEUTRAL:
            x, y = i % w, i // w
            cell[min(rows - 1, y * rows // h)][min(cols - 1, x * cols // w)] += 1
            total += 1
    flat = sorted((cell[r][c] for r in range(rows) for c in range(cols)), reverse=True)
    conc = sum(flat[: max(1, round(rows * cols / 5))]) / total if total else 0.0

    oks = [oklab(q)[0] for q in p]
    if g_l >= 0.5:
        counter = sum(1 for v in oks if v <= 0.45) / n
    else:
        counter = sum(1 for v in oks if v >= 0.60) / n

    return dict(
        ground=g_l, neutral=neutral, structure=structure,
        tonal=tonal, conc=conc, counter=counter, ink=ink,
    )


def main(argv):
    inset = 0.0
    paths = []
    for a in argv:
        if a.startswith("--inset="):
            inset = float(a.split("=", 1)[1])
        else:
            paths.append(a)
    if not paths:
        print(__doc__)
        return 1
    print(f"{'screen':28s} {'ground':>6} {'neutral':>8} {'struct':>7} "
          f"{'tonal':>6} {'conc':>5} {'counter':>8} {'ink':>6}")
    for path in paths:
        m = measure(path, inset)
        name = path.split("/")[-1]
        print(f"{name[:28]:28s} {m['ground']:6.2f} {m['neutral']*100:7.1f}% "
              f"{m['structure']*100:6.1f}% {m['tonal']:6.2f} {m['conc']*100:4.0f}% "
              f"{m['counter']*100:7.1f}% {m['ink']*100:5.1f}%")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
