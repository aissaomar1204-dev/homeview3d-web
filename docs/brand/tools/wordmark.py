"""Wordmark outliner for Home View 3D.

Instances the site font (Archivo variable) at a chosen (wdth, wght), applies the
font's own GPOS kerning, and returns the text as OUTLINED SVG path data so the
logo never depends on font loading.

Coordinates returned are in "cap units": 1 unit = 1 cap height (686 font units),
baseline at y = 0, y grows downwards, so caps span y in [-1, 0].
"""
from __future__ import annotations

import functools
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
ARCHIVO = os.path.join(ROOT, "public", "assets", "fonts", "archivo-var.woff2")
GEIST = os.path.join(ROOT, "public", "assets", "fonts", "geist-mono-var.woff2")


@functools.lru_cache(maxsize=None)
def _instance(path: str, axes: tuple):
    f = TTFont(path)
    f.flavor = None
    inst = instancer.instantiateVariableFont(f, dict(axes), inplace=False)
    return inst


def _pair_kern_table(font: TTFont):
    """Return a function (left_glyph, right_glyph) -> x-advance adjustment."""
    gpos = font["GPOS"].table
    lookups = []
    for fr in gpos.FeatureList.FeatureRecord:
        if fr.FeatureTag == "kern":
            lookups.extend(fr.Feature.LookupListIndex)
    lookups = sorted(set(lookups))
    subtables = []
    for li in lookups:
        lk = gpos.LookupList.Lookup[li]
        for st in lk.SubTable:
            if lk.LookupType == 9:
                st = st.ExtSubTable
            if st.LookupType == 2 if hasattr(st, "LookupType") else True:
                subtables.append(st)

    def value(rec):
        if rec is None:
            return 0
        return getattr(rec, "XAdvance", 0) or 0

    def kern(a: str, b: str) -> int:
        for st in subtables:
            if not hasattr(st, "Format"):
                continue
            cov = st.Coverage.glyphs
            if a not in cov:
                continue
            if st.Format == 1:
                ps = st.PairSet[cov.index(a)]
                for pvr in ps.PairValueRecord:
                    if pvr.SecondGlyph == b:
                        return value(pvr.Value1)
            elif st.Format == 2:
                c1 = st.ClassDef1.classDefs.get(a, 0)
                c2 = st.ClassDef2.classDefs.get(b, 0)
                rec = st.Class1Record[c1].Class2Record[c2]
                v = value(rec.Value1)
                if v:
                    return v
                # class pair exists but zero -> explicit zero, stop searching
                return 0
        return 0

    return kern


class Face:
    def __init__(self, path: str, **axes):
        self.font = _instance(path, tuple(sorted(axes.items())))
        self.upm = self.font["head"].unitsPerEm
        self.cap = self.font["OS/2"].sCapHeight
        self.xh = self.font["OS/2"].sxHeight
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.hmtx = self.font["hmtx"]
        self.kern = _pair_kern_table(self.font)

    def glyph_name(self, ch: str) -> str:
        return self.cmap[ord(ch)]

    def layout(self, text: str, tracking: float = 0.0, word_space: float | None = None, kerning: bool = True):
        """Return [(glyph_name, x_in_font_units)], total advance (font units)."""
        pen_x = 0.0
        out = []
        names = [self.glyph_name(c) for c in text]
        for i, (ch, g) in enumerate(zip(text, names)):
            out.append((g, pen_x, ch))
            adv = self.hmtx[g][0]
            if ch == " " and word_space is not None:
                adv = word_space * self.upm
            pen_x += adv
            if kerning and i + 1 < len(names):
                pen_x += self.kern(g, names[i + 1])
            pen_x += tracking * self.upm
        return out, pen_x


def outline(face: Face, text: str, x0: float = 0.0, tracking: float = 0.0, word_space: float | None = None,
            kerning: bool = True, ndigits: int = 2, scale_to_cap: float = 1.0):
    """Outline `text`. Returns dict(d=path_data, advance=float, bounds=(x0,y0,x1,y1)) in cap units.

    x0 = left origin (cap units). The advance excludes trailing tracking.
    """
    k = scale_to_cap / face.cap  # font units -> cap units
    layout, total = face.layout(text, tracking, word_space, kerning)
    spen = SVGPathPen(face.gs, ntos=lambda v: ("%." + str(ndigits) + "f") % v)
    bpen = BoundsPen(face.gs)
    for g, x, ch in layout:
        if ch == " ":
            continue
        t = (k, 0, 0, -k, x0 + x * k, 0)
        face.gs[g].draw(TransformPen(spen, t))
        face.gs[g].draw(TransformPen(bpen, t))
    d = spen.getCommands()
    # tidy trailing zeros: 1.000 -> 1, 0.500 -> .5
    import re

    def tidy(m):
        s = m.group(0)
        if "." in s:
            s = s.rstrip("0").rstrip(".")
        if s.startswith("0."):
            s = s[1:]
        elif s.startswith("-0."):
            s = "-" + s[2:]
        return s if s not in ("", "-") else "0"

    d = re.sub(r"-?\d+\.\d+|-?\d+", tidy, d)
    tr = tracking * face.upm * k
    advance = total * k - tr
    return dict(d=d, advance=advance, bounds=bpen.bounds and tuple(v for v in bpen.bounds), left=x0)


if __name__ == "__main__":
    f = Face(ARCHIVO, wdth=114, wght=590)
    print(f.cap, f.xh, f.upm)
    r = outline(f, "Home View 3D")
    print(r["advance"], r["bounds"], len(r["d"]))
    print("kern V-i", f.kern("V", "i"), "e-space", f.kern("e", "space"), "o-m", f.kern("o", "m"))
