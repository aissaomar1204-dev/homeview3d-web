"""Small geometry toolkit for the Home View 3D logo concepts.

All symbols are drawn on a 64x64 grid. Shapes are shapely polygons (exact vertices,
mitre joins) or hand-written path strings when true arcs are needed. Everything is
emitted as fill-only paths, so the marks never depend on stroke rendering.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass

from shapely.affinity import rotate, translate, scale as sh_scale
from shapely.geometry import LineString, MultiPolygon, Point, Polygon, box
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

S3 = math.sqrt(3) / 2  # cos 30
GRID = 64


def n(v: float, nd: int = 2) -> str:
    """Compact number: 12.50 -> 12.5, 0.30 -> .3, -0.0 -> 0"""
    s = f"{v:.{nd}f}"
    if "." in s:
        s = s.rstrip("0").rstrip(".")
    if s in ("-0", ""):
        s = "0"
    if s.startswith("0."):
        s = s[1:]
    elif s.startswith("-0."):
        s = "-" + s[2:]
    return s


def ring_to_d(coords, nd: int = 2) -> str:
    pts = list(coords)
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    # drop collinear points
    cleaned = []
    m = len(pts)
    for i in range(m):
        a, b, c = pts[i - 1], pts[i], pts[(i + 1) % m]
        cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
        if abs(cross) > 1e-9:
            cleaned.append(b)
    pts = cleaned
    out = []
    px = py = None
    for i, (x, y) in enumerate(pts):
        x, y = round(x, nd), round(y, nd)
        if i == 0:
            out.append(f"M{n(x, nd)} {n(y, nd)}")
        elif y == py:
            out.append(f"H{n(x, nd)}")
        elif x == px:
            out.append(f"V{n(y, nd)}")
        else:
            out.append(f"L{n(x, nd)} {n(y, nd)}")
        px, py = x, y
    out.append("Z")
    d = "".join(out)
    # join "L" separators compactly: "L1 2L3 4" is fine; strip spaces before letters
    return d


def geom_to_d(g, nd: int = 2) -> str:
    if g.is_empty:
        return ""
    if isinstance(g, Polygon):
        g = orient(g, 1.0)
        parts = [ring_to_d(g.exterior.coords, nd)]
        for r in g.interiors:
            parts.append(ring_to_d(r.coords, nd))
        return "".join(parts)
    if hasattr(g, "geoms"):
        return "".join(geom_to_d(x, nd) for x in g.geoms)
    raise TypeError(type(g))


def inset(g, d: float):
    """Shrink by d with mitre joins (sharp corners)."""
    return g.buffer(-d, join_style=2, mitre_limit=10)


def grow(g, d: float):
    return g.buffer(d, join_style=2, mitre_limit=10)


def seg_poly(p0, p1, w: float, cap: str = "flat"):
    """A line segment as a filled rectangle of width w."""
    ls = LineString([p0, p1])
    return ls.buffer(w / 2, cap_style=2 if cap == "flat" else 3, join_style=2)


def poly_line(pts, w: float, closed: bool = False, cap: str = "flat"):
    ls = LineString(pts + ([pts[0]] if closed else []))
    return ls.buffer(w / 2, cap_style=2 if cap == "flat" else 3, join_style=2, mitre_limit=10)


class Iso:
    """Isometric projection. x -> lower right, y -> lower left, z -> up. Camera at (+x,+y,+z)."""

    def __init__(self, k: float, ox: float, oy: float):
        self.k, self.ox, self.oy = k, ox, oy

    def p(self, x, y, z=0.0):
        k = self.k
        return (self.ox + (x - y) * S3 * k, self.oy + (x + y) * 0.5 * k - z * k)

    def poly(self, pts3):
        return Polygon([self.p(*q) for q in pts3])


def prism_faces(iso: Iso, footprint: Polygon, z0: float, z1: float):
    """Visible faces of a vertical prism over an axis-aligned footprint (in x,y units).

    Returns dict(top=Polygon, left=[...], right=[...]) as screen polygons.
    'left' faces look to the lower-left (+y normal), 'right' to the lower-right (+x normal).
    """
    fp = orient(footprint, 1.0)  # CCW in x,y
    coords = list(fp.exterior.coords)
    left, right = [], []
    for a, b in zip(coords[:-1], coords[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        # outward normal for CCW polygon in a y-up sense: (dy, -dx)
        nx, ny = dy, -dx
        quad = iso.poly([(a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z1), (a[0], a[1], z1)])
        if abs(nx) < 1e-9 and ny > 1e-9:
            left.append(quad)
        elif abs(ny) < 1e-9 and nx > 1e-9:
            right.append(quad)
    top = Polygon([iso.p(x, y, z1) for x, y in coords])
    return dict(top=top, left=left, right=right)


def arc_sector_d(cx, cy, r0, r1, a0, a1, nd: int = 2):
    """Annular sector as a filled path. Angles in degrees, 0 = +x, 90 = +y (down on screen)."""
    def pt(r, a):
        return (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))

    large = 1 if abs(a1 - a0) > 180 else 0
    sweep = 1 if a1 > a0 else 0
    p0o, p1o = pt(r1, a0), pt(r1, a1)
    if r0 <= 0:
        return (f"M{n(cx, nd)} {n(cy, nd)}L{n(p0o[0], nd)} {n(p0o[1], nd)}"
                f"A{n(r1, nd)} {n(r1, nd)} 0 {large} {sweep} {n(p1o[0], nd)} {n(p1o[1], nd)}Z")
    p0i, p1i = pt(r0, a0), pt(r0, a1)
    return (f"M{n(p0o[0], nd)} {n(p0o[1], nd)}A{n(r1, nd)} {n(r1, nd)} 0 {large} {sweep} {n(p1o[0], nd)} {n(p1o[1], nd)}"
            f"L{n(p1i[0], nd)} {n(p1i[1], nd)}A{n(r0, nd)} {n(r0, nd)} 0 {large} {1 - sweep} {n(p0i[0], nd)} {n(p0i[1], nd)}Z")


@dataclass
class Piece:
    role: str          # 'ink' | 'accent'
    d: str             # path data
    evenodd: bool = False


def svg_symbol(pieces, size: int = GRID, extra_style: str = "") -> str:
    """Standalone symbol.svg using currentColor for ink and --hv-accent (falls back to currentColor)."""
    body = []
    ink = [p for p in pieces if p.role == "ink"]
    acc = [p for p in pieces if p.role == "accent"]
    if ink:
        body.append(_group(ink, 'fill="currentColor"'))
    if acc:
        body.append(_group(acc, 'fill="var(--hv-accent,currentColor)"'))
    return "".join(body)


def _group(pcs, fill_attr):
    # merge all pieces of one role into one path when none needs evenodd separately
    if all(not p.evenodd for p in pcs):
        d = "".join(p.d for p in pcs)
        return f'<path {fill_attr} d="{d}"/>'
    if all(p.evenodd for p in pcs):
        d = "".join(p.d for p in pcs)
        return f'<path {fill_attr} fill-rule="evenodd" d="{d}"/>'
    return "".join(
        f'<path {fill_attr}{" fill-rule=\"evenodd\"" if p.evenodd else ""} d="{p.d}"/>' for p in pcs
    )
