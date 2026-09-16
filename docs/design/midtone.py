"""Ad-hoc diagnostic, NOT a new standard column.

Asks one thing measure-screens.py does not: how much of the screen sits
between the ground and the ink. A screen built from exactly two values
(dark field, light text) has a high `tonal` and still reads flat,
because nothing populates the middle. Reported for our screens and the
owner's five references together, so it is a comparison and not a claim.

mid = share of pixels whose CIE L* is in [0.30, 0.70]
"""
import sys, statistics
from PIL import Image

def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

LIN = [srgb_to_lin(i) for i in range(256)]

def lstar(r, g, b):
    y = 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b]
    return (y * 903.3 / 100.0) if y <= 0.008856 else (1.16 * y ** (1/3) - 0.16)

def measure(path, inset=0.0):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if inset:
        dx, dy = int(w * inset), int(h * inset)
        im = im.crop((dx, dy, w - dx, h - dy)); w, h = im.size
    px = im.tobytes()
    n = w * h
    mid = 0
    for i in range(0, len(px), 3):
        L = lstar(px[i], px[i+1], px[i+2])
        if 0.30 <= L <= 0.70:
            mid += 1
    return 100.0 * mid / n

if __name__ == "__main__":
    inset = 0.0
    args = []
    for a in sys.argv[1:]:
        if a.startswith("--inset="): inset = float(a.split("=")[1])
        else: args.append(a)
    vals = []
    for p in args:
        v = measure(p, inset)
        vals.append(v)
        print(f"{p.split('/')[-1]:<28} mid {v:5.1f}%")
    if len(vals) > 1:
        print(f"{'median':<28} mid {statistics.median(vals):5.1f}%")
