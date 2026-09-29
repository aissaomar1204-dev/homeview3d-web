"""Build the Home View 3D logo concepts: symbols, lockups, favicons and the presentation board.

    python docs/brand/tools/build.py            # writes docs/brand/concepts/**
"""
from __future__ import annotations

import json
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from geo import Piece, n  # noqa: E402
from concepts import CONCEPTS, GRID  # noqa: E402
from wordmark import ARCHIVO, GEIST, Face, outline  # noqa: E402

OUT = os.path.abspath(os.path.join(HERE, "..", "concepts"))
INK, ACCENT = "#14171B", "#2D4596"
INK_D, ACCENT_D = "#E8EBEE", "#A2B3EA"

# ----------------------------------------------------------------------------- wordmark styles
# 1 unit = 1 cap height of the wordmark.  "wdth"/"wght" = Archivo instance.
WORDMARKS = {
    "A": dict(wdth=113, wght=600, track=0.006, ws=0.36, three="same"),
    "B": dict(wdth=118, wght=580, track=0.010, ws=0.38, three="same"),
    "C": dict(wdth=108, wght=620, track=0.004, ws=0.34, three="same"),
    "D": dict(wdth=114, wght=610, track=0.006, ws=0.36, three="same"),
}


def build_wordmark(cid: str, cap: float):
    """Return dict(ink=d, accent=d, width=w, cap=cap). Origin: x=0 left, baseline y=0, y down."""
    st = WORDMARKS[cid]
    fa = Face(ARCHIVO, wdth=st["wdth"], wght=st["wght"])
    home = outline(fa, "Home View", x0=0.0, tracking=st["track"], scale_to_cap=cap)
    # left side bearing of "H": shift so ink starts at x=0
    lsb = home["bounds"][0]
    home = outline(fa, "Home View", x0=-lsb, tracking=st["track"], scale_to_cap=cap)
    x_end = home["bounds"][2]
    gap = (st["ws"] + 0.05) * cap  # optical: the round 3 needs a touch more air after the slanted w
    if st["three"] == "mono":
        fm = Face(GEIST, wght=500)
        th = outline(fm, "3D", x0=0.0, tracking=0.0, scale_to_cap=cap)
        l2 = th["bounds"][0]
        th = outline(fm, "3D", x0=x_end + gap - l2, tracking=0.0, scale_to_cap=cap)
    else:
        th = outline(fa, "3D", x0=0.0, tracking=st["track"], scale_to_cap=cap)
        l2 = th["bounds"][0]
        th = outline(fa, "3D", x0=x_end + gap - l2, tracking=st["track"], scale_to_cap=cap)
    width = th["bounds"][2]
    return dict(ink=home["d"], accent=th["d"], width=width, cap=cap,
                top=min(home["bounds"][1], th["bounds"][1]), bottom=max(home["bounds"][3], th["bounds"][3]))


# ----------------------------------------------------------------------------- svg helpers
def _ink_group(inner):
    return f'<g fill="currentColor">{inner}</g>'


def _acc_group(inner):
    return f'<g fill="currentColor" style="fill:var(--hv-accent,currentColor)">{inner}</g>'


def symbol_paths(pieces):
    ink = "".join(p.d for p in pieces if p.role == "ink")
    acc = "".join(p.d for p in pieces if p.role == "accent")
    return ink, acc


def svg_doc(w, h, body, title="Home View 3D", extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(w, 2)} {n(h, 2)}" width="{n(w, 2)}" height="{n(h, 2)}" '
            f'role="img" aria-labelledby="t"{extra}><title id="t">{title}</title>{body}</svg>\n')


def symbol_svg(pieces):
    ink, acc = symbol_paths(pieces)
    body = ""
    if ink:
        body += _ink_group(f'<path d="{ink}"/>')
    if acc:
        body += _acc_group(f'<path d="{acc}"/>')
    return svg_doc(GRID, GRID, body)


def _place_symbol(pieces, bounds, height, tx, ty):
    """Return (ink_markup, acc_markup) of the symbol scaled so its tight bbox is `height` tall,
    with the bbox top-left at (tx, ty)."""
    x0, y0, x1, y1 = bounds
    s = height / (y1 - y0)
    ink, acc = symbol_paths(pieces)
    tr = f'transform="translate({n(tx - x0 * s, 3)} {n(ty - y0 * s, 3)}) scale({n(s, 5)})"'
    return (f'<path {tr} d="{ink}"/>' if ink else "", f'<path {tr} d="{acc}"/>' if acc else "", s)


def lockup_h(cid, pieces, bounds, Hs=100.0, cap_ratio=0.365, gap_ratio=0.30):
    x0, y0, x1, y1 = bounds
    sw = (x1 - x0) * Hs / (y1 - y0)
    cap = Hs * cap_ratio
    wm = build_wordmark(cid, cap)
    gap = Hs * gap_ratio
    wx = sw + gap
    base = Hs / 2 + cap / 2  # cap block centred on the symbol's bbox
    ink_s, acc_s, _ = _place_symbol(pieces, bounds, Hs, 0, 0)
    tr = f'transform="translate({n(wx, 3)} {n(base, 3)})"'
    ink = ink_s + f'<path {tr} d="{wm["ink"]}"/>'
    acc = acc_s + f'<path {tr} d="{wm["accent"]}"/>'
    W = wx + wm["width"]
    body = _ink_group(ink) + _acc_group(acc)
    meta = dict(width=W, height=Hs, ratio=W / Hs, symbol_w=sw, gap=gap, cap=cap, wordmark_w=wm["width"])
    return svg_doc(W, Hs, body), meta


def lockup_s(cid, pieces, bounds, cap=34.0, sym_ratio=4.4, gap_ratio=1.25):
    wm = build_wordmark(cid, cap)
    x0, y0, x1, y1 = bounds
    Hs = cap * sym_ratio
    sw = (x1 - x0) * Hs / (y1 - y0)
    W = max(wm["width"], sw)
    gap = cap * gap_ratio
    ink_s, acc_s, _ = _place_symbol(pieces, bounds, Hs, (W - sw) / 2, 0)
    base = Hs + gap + cap
    tr = f'transform="translate({n((W - wm["width"]) / 2, 3)} {n(base, 3)})"'
    ink = ink_s + f'<path {tr} d="{wm["ink"]}"/>'
    acc = acc_s + f'<path {tr} d="{wm["accent"]}"/>'
    H = base
    body = _ink_group(ink) + _acc_group(acc)
    return svg_doc(W, H, body), dict(width=W, height=H)


def favicon_svg(pieces, bounds, pad=1.5):
    x0, y0, x1, y1 = bounds
    w, h = x1 - x0, y1 - y0
    side = max(w, h) + 2 * pad
    vx, vy = (x0 + x1) / 2 - side / 2, (y0 + y1) / 2 - side / 2
    ink, acc = symbol_paths(pieces)
    css = (f"path{{fill:{INK}}}.a{{fill:{ACCENT}}}"
           f"@media(prefers-color-scheme:dark){{path{{fill:{INK_D}}}.a{{fill:{ACCENT_D}}}}}")
    body = f"<style>{css}</style>"
    if ink:
        body += f'<path d="{ink}"/>'
    if acc:
        body += f'<path class="a" d="{acc}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{n(vx, 2)} {n(vy, 2)} {n(side, 2)} {n(side, 2)}">{body}</svg>\n')


# ----------------------------------------------------------------------------- build
def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def main():
    built = {}
    for cid, spec in CONCEPTS.items():
        pieces, bounds = spec["fn"]()
        d = os.path.join(OUT, cid)
        sym = symbol_svg(pieces)
        lh, meta = lockup_h(cid, pieces, bounds)
        ls, metas = lockup_s(cid, pieces, bounds)
        fav = favicon_svg(pieces, bounds)
        write(os.path.join(d, "symbol.svg"), sym)
        write(os.path.join(d, "lockup-horizontal.svg"), lh)
        write(os.path.join(d, "lockup-stacked.svg"), ls)
        write(os.path.join(d, "favicon.svg"), fav)
        built[cid] = dict(pieces=pieces, bounds=bounds, sym=sym, lh=lh, ls=ls, fav=fav, meta=meta, metas=metas)
        print(cid, "lockup-h ratio %.2f  (%dx%d)  sym %d B  lh %d B  ls %d B" % (
            meta["ratio"], meta["width"], meta["height"], len(sym), len(lh), len(ls)))
    import board
    board.build(built, OUT)


if __name__ == "__main__":
    main()
