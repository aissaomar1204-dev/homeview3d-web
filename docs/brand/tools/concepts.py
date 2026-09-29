"""The four Home View 3D symbol concepts, drawn on a 64x64 grid.

Every builder returns (pieces, bounds) where `pieces` are fill-only Piece objects
(role 'ink' -> currentColor, role 'accent' -> var(--hv-accent, currentColor)) and
`bounds` is the tight content box (x0, y0, x1, y1) in grid units.

Shared construction rules (the "joint" system, so the four marks feel like siblings):
  * facets never touch: every internal joint is a clean gap of G = 2.6 units
  * only mitre joins, no rounded corners (Plano is a drawing language: sharp)
  * ink carries the volume, accent (añil) marks the plan / the view / the frame
"""
from __future__ import annotations

import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union
from shapely.affinity import translate

from geo import (GRID, Iso, Piece, arc_sector_d, geom_to_d, inset, n, prism_faces)

G = 2.6  # joint width


def _bounds(geoms):
    u = unary_union(geoms)
    return tuple(u.bounds)


def _centre(items, cx=32.0, cy=32.0):
    """Centre a list of (role, shapely geom) on (cx, cy) using the union bbox."""
    u = unary_union([g for _, g in items])
    x0, y0, x1, y1 = u.bounds
    dx, dy = cx - (x0 + x1) / 2, cy - (y0 + y1) / 2
    return [(r, translate(g, dx, dy)) for r, g in items]


def _pieces(items):
    return [Piece(r, geom_to_d(g)) for r, g in items]


# ============================================================ A  Habitacion
def concept_A(door_x=(0.50, 0.79), door_h=0.64, e=28.5):
    """Plan -> volume. The floor plan (añil rhombus) lies flat; two walls rise from its back
    edges, one of them opened by a door. A cube read from the inside: the room you will sell."""
    iso = Iso(e, 32, 32)
    floor = iso.poly([(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0)])
    wall_l = iso.poly([(0, 0, 0), (0, 1, 0), (0, 1, 1), (0, 0, 1)])
    wall_r = iso.poly([(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)])
    door = iso.poly([(door_x[0], 0, -0.3), (door_x[1], 0, -0.3), (door_x[1], 0, door_h), (door_x[0], 0, door_h)])
    f, l, r = [inset(p, G / 2) for p in (floor, wall_l, wall_r)]
    r = r.difference(door)
    items = [("accent", f), ("ink", l), ("ink", r)]
    items = _centre(items)
    return _pieces(items), _bounds([g for _, g in items])


# ============================================================ B  H plano
def concept_B(leg=9.5, bar=5.5, W=46.0, H=54.0, cy=30.0, r=18.0):
    """The initial as a plan. Two structural walls, a partition between them, and the swing of a
    door (an añil quarter disc, which is also a camera's view cone)."""
    x0, y0 = (GRID - W) / 2, (GRID - H) / 2
    left = box(x0, y0, x0 + leg, y0 + H)
    right = box(x0 + W - leg, y0, x0 + W, y0 + H)
    cross = box(x0 + leg, cy - bar / 2, x0 + W - leg, cy + bar / 2)
    wall = unary_union([left, right, cross])
    hx = x0 + leg + G  # hinge: one joint away from the wall...
    hy = cy + bar / 2 + G  # ...and one joint below the partition
    pieces = [Piece("ink", geom_to_d(wall)), Piece("accent", arc_sector_d(hx, hy, 0, r, 0, 90))]
    return pieces, (x0, y0, x0 + W, y0 + H)


# ============================================================ C  Visor
def _brackets(m=3.0, L=13.5, t=4.4):
    s = GRID
    out = []
    for (cx, cy), (sx, sy) in [((m, m), (1, 1)), ((s - m, m), (-1, 1)), ((m, s - m), (1, -1)), ((s - m, s - m), (-1, -1))]:
        h = box(min(cx, cx + sx * L), min(cy, cy + sy * t), max(cx, cx + sx * L), max(cy, cy + sy * t))
        v = box(min(cx, cx + sx * t), min(cy, cy + sy * L), max(cx, cx + sx * t), max(cy, cy + sy * L))
        out.append(unary_union([h, v]))
    return out


def _house(k=19.0, x1=1.3, y1=1.0, hw=0.72, hr=0.5, cx=32.0, cy=32.0):
    iso = Iso(k, 0, 0)
    ym = y1 / 2
    left = iso.poly([(0, y1, 0), (x1, y1, 0), (x1, y1, hw), (0, y1, hw)])
    gable = iso.poly([(x1, 0, 0), (x1, y1, 0), (x1, y1, hw), (x1, ym, hw + hr), (x1, 0, hw)])
    roof = iso.poly([(0, y1, hw), (x1, y1, hw), (x1, ym, hw + hr), (0, ym, hw + hr)])
    u = unary_union([left, gable, roof])
    x0, y0, xx, yy = u.bounds
    dx, dy = cx - (x0 + xx) / 2, cy - (y0 + yy) / 2
    return [translate(inset(p, G / 2), dx, dy) for p in (left, gable, roof)]


def concept_C(m=3.0, L=13.0, t=4.8, k=22.0):
    """Viewfinder. AR corner brackets (añil) frame a crisp isometric house (ink)."""
    br = _brackets(m, L, t)
    l, g, ro = _house(k=k)
    items = [("accent", b) for b in br] + [("ink", l), ("ink", g), ("ink", ro)]
    return _pieces(items), (m, m, GRID - m, GRID - m)


# ============================================================ D  Arco
def concept_D(x0=8.0, x1=56.0, top=4.0, bottom=60.0, vp=(41.0, 41.0), s=0.56):
    """The añil doorway. A thick-walled Mediterranean arch seen in one-point perspective: the
    reveal (ink), the floor running in, and the view beyond (añil)."""
    r0 = (x1 - x0) / 2
    cy0 = top + r0
    vx, vy = vp
    fx0 = vx + s * (x0 - vx)
    fx1 = vx + s * (x1 - vx)
    fcy = vy + s * (cy0 - vy)
    fbot = vy + s * (bottom - vy)
    r1 = (fx1 - fx0) / 2
    ftop = fcy - r1
    tunnel = (f"M{n(x0)} {n(bottom)}V{n(cy0)}A{n(r0)} {n(r0)} 0 0 1 {n(x1)} {n(cy0)}V{n(bottom)}"
              f"L{n(fx1)} {n(fbot)}V{n(fcy)}A{n(r1)} {n(r1)} 0 0 0 {n(fx0)} {n(fcy)}V{n(fbot)}Z")
    # floor trapezoid, eroded on three sides, bottom edge on the silhouette
    ext = G * 3
    k = (bottom + ext - fbot) / (bottom - fbot)
    a = (fx0 + (x0 - fx0) * k, fbot + (bottom - fbot) * k)
    b = (fx1 + (x1 - fx1) * k, fbot + (bottom - fbot) * k)
    quad = Polygon([a, b, (fx1, fbot), (fx0, fbot)])
    floor = quad.buffer(-G, join_style=2, mitre_limit=10).intersection(box(0, 0, GRID, bottom))
    # the view: far arch, eroded by one joint on the sides and top
    fx0i, fx1i = fx0 + G, fx1 - G
    ri = (fx1i - fx0i) / 2
    fcyi = ftop + G + ri
    view = (f"M{n(fx0i)} {n(fbot)}V{n(fcyi)}A{n(ri)} {n(ri)} 0 0 1 {n(fx1i)} {n(fcyi)}V{n(fbot)}Z")
    pieces = [Piece("ink", tunnel), Piece("ink", geom_to_d(floor)), Piece("accent", view)]
    return pieces, (x0, top, x1, bottom)


CONCEPTS = {
    "A": dict(fn=concept_A, name="Habitación", en="Room",
              idea="Plan to volume: the floor plan lies flat in añil, two walls rise from its edges, a door opens the way in."),
    "B": dict(fn=concept_B, name="H plano", en="H plan",
              idea="The initial drawn as a plan: two walls, a partition, and the swing of a door that is also a camera's view cone."),
    "C": dict(fn=concept_C, name="Visor", en="Viewfinder",
              idea="AR viewfinder brackets frame a crisp isometric house: the moment a plan becomes something you can look at."),
    "D": dict(fn=concept_D, name="Arco", en="Doorway",
              idea="The añil doorway: a Mediterranean arch in one-point perspective, the view you step into."),
}

if __name__ == "__main__":
    for k, v in CONCEPTS.items():
        pcs, b = v["fn"]()
        print(k, [round(x, 2) for x in b], sum(len(p.d) for p in pcs), "chars")
