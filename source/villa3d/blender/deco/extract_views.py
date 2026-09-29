"""
extract_views.py - Stage A: visible line segments of the villa for every deco drawing.

  blender -b --factory-startup ../villa_renders.blend -P extract_views.py -- [--views iso,plan,axo,section,long]

Writes _cache/<view>.json (2D segments in the drawing's own units, classes, poche triangles, foliage triangles,
door swings, section cut segments). Stage B (build_svg.py) turns those into the SVG files in public/assets/deco/.
"""
import sys
import os
import re
import math
import argparse

import numpy as np
import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import deco_lib as L  # noqa: E402
from deco_lib import log  # noqa: E402

FOOT = (-0.03, -0.03, 9.13, 14.08)          # plan footprint (x0, y0, x1, y1), metres
HERO = "CAM_villa_maqueta_iso"
HERO_AZ, HERO_EL = 212.0, 42.0               # villa_render.py SHOTS["villa_maqueta_iso"]


def parse():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--views", default="iso,plan,axo,section,long")
    p.add_argument("--section-y", type=float, default=6.55, help="E-W section plane y (looks north)")
    p.add_argument("--section-x", type=float, default=5.0, help="N-S section plane x (looks east)")
    p.add_argument("--dz2", type=float, default=6.6, help="axo: lift of the wall layer (m)")
    p.add_argument("--dz3", type=float, default=12.4, help="axo: lift of the furniture layer (m)")
    return p.parse_args(argv)


# ---------------------------------------------------------------------------------------------
def check_projection(view, cam, W, H):
    """Sanity check: my numpy projection must match Blender's world_to_camera_view (pixel-exact)."""
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils import Vector
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = W, H
    worst = 0.0
    for P in ((0, 0, 0), (9.1, 14.0, 1.15), (4.5, 7.0, 2.6), (0, 14, -0.6)):
        c = world_to_camera_view(sc, cam, Vector(P))
        bl = np.array([c.x * W, (1 - c.y) * H])
        mine = view.project(np.array(P, dtype=float))
        worst = max(worst, float(np.abs(bl - mine).max()))
    log("projection check, worst error %.4f px" % worst)
    assert worst < 0.05, "projection mismatch"


def door_swings(items, view):
    """Door swing arcs (plan only): hinge at the leaf end nearest to a jamb; the arc runs from the closed
    position (along the frame) to where the modelled leaf stands open."""
    groups = {}
    for it in items:
        if it["cap"]:
            continue
        m = re.match(r"(.*) door (\d+) (hoja|marco)$", it["name"])
        if m:
            groups.setdefault((m.group(1), m.group(2)), {})[m.group(3)] = it
    out = []
    for key, g in groups.items():
        if "hoja" not in g or "marco" not in g:
            continue
        H = g["hoja"]["m"]["V"][:, :2]
        F = g["marco"]["m"]["V"][:, :2]

        def axis(P):
            c = P.mean(axis=0)
            u, s, vt = np.linalg.svd(P - c, full_matrices=False)
            e = vt[0]
            t = (P - c) @ e
            return c, e, t.min(), t.max()

        hc, he, hmin, hmax = axis(H)
        fc, fe, fmin, fmax = axis(F)
        Lh = hmax - hmin
        E1, E2 = hc + he * hmin, hc + he * hmax
        J1, J2 = fc + fe * fmin, fc + fe * fmax
        best = None
        for E, Eo in ((E1, E2), (E2, E1)):
            for J, Jo in ((J1, J2), (J2, J1)):
                d = np.linalg.norm(E - J)
                if best is None or d < best[0]:
                    best = (d, E, Eo, J, Jo)
        _, Hg, To, J, Jo = best
        dirc = (Jo - J) / np.linalg.norm(Jo - J)
        Tc = Hg + dirc * Lh
        a = math.degrees(math.acos(np.clip(np.dot((Tc - Hg) / Lh, (To - Hg) / max(np.linalg.norm(To - Hg), 1e-9)), -1, 1)))
        if a < 8:
            continue
        z = float(g["hoja"]["m"]["V"][:, 2].min())
        pts = view.project(np.array([[Hg[0], Hg[1], z], [Tc[0], Tc[1], z], [To[0], To[1], z]]))
        out.append(dict(name=key[0], c=pts[0].round(2).tolist(), p1=pts[1].round(2).tolist(),
                        p2=pts[2].round(2).tolist(), r=round(float(np.linalg.norm(pts[1] - pts[0])), 2),
                        angle=round(a, 1)))
    log("  door swings:", len(out))
    return out


def no_plants(i):
    return L.default_occluder(i) and not i["plant"]


def scene_bvh(items):
    hulls = L.plant_hulls(items)
    bvh, nt = L.build_bvh(items, extra_tris=hulls, occluder=no_plants)
    bvh_np, _ = L.build_bvh(items, occluder=no_plants)
    log("items", len(items), "occluder triangles", nt)
    return bvh, bvh_np


def pack(view_size, scale, lines, plants, caps, doors, **extra):
    d = dict(size=[round(float(view_size[0]), 1), round(float(view_size[1]), 1)], scale=scale, lines=lines,
             plants=plants, poche=caps, doors=doors)
    d.update(extra)
    return d


# ---------------------------------------------------------------------------------------------
def run_plan(a):
    log("== plan")
    S = 150.0
    pad = 0.30
    x0, y0, x1, y1 = FOOT
    origin = (x0 - pad, y1 + pad, 0.0)
    W = (x1 - x0 + 2 * pad) * S
    H = (y1 - y0 + 2 * pad) * S
    view = L.OrthoView(d=(0, 0, -1), scale=S, origin=origin)
    items = L.collect({"base", "corte"})
    bvh, bvh_np = scene_bvh(items)
    lines = L.extract_lines(items, view, bvh, W, H, step=10.0)
    plants = L.plant_points(items, view, bvh_np)
    caps = L.cap_polys(items, view, bvh)
    doors = door_swings(items, view)
    L.save_json("plan", pack((W, H), S, lines, plants, caps, doors))


def run_iso(a):
    log("== iso (hero camera)")
    cam = bpy.data.objects[HERO]
    W, H = [int(v) for v in cam["shot_res"]]
    view = L.PerspView(cam, W, H)
    check_projection(view, cam, W, H)
    items = L.collect({"base", "corte"})
    bvh, bvh_np = scene_bvh(items)
    lines = L.extract_lines(items, view, bvh, W, H, step=8.0)
    plants = L.plant_points(items, view, bvh_np)
    caps = L.cap_polys(items, view, bvh)
    L.save_json("iso", pack((W, H), 1.0, lines, plants, caps, []))


def outline_corners(items):
    """Outer corners of the plinth footprint (Base Maqueta top face), excluding the stair-well hole."""
    base = next(i for i in items if i["name"] == "Base Maqueta")
    hole = next((i for i in items if i["name"].startswith("Fondo")), None)
    V, T = base["m"]["V"], base["m"]["tris"]
    ztop = V[:, 2].max()
    top = np.abs(V[:, 2] - ztop) < 1e-4
    tri_top = T[top[T].all(axis=1)]
    tri_xy = V[tri_top][:, :, :2]
    cand = np.unique(np.round(V[top][:, :2], 3), axis=0)
    hole_xy = None if hole is None else np.round(hole["m"]["V"][:, :2], 3)

    def covered(p):
        a, b, c = tri_xy[:, 0], tri_xy[:, 1], tri_xy[:, 2]
        d1 = (p[0] - b[:, 0]) * (a[:, 1] - b[:, 1]) - (a[:, 0] - b[:, 0]) * (p[1] - b[:, 1])
        d2 = (p[0] - c[:, 0]) * (b[:, 1] - c[:, 1]) - (b[:, 0] - c[:, 0]) * (p[1] - c[:, 1])
        d3 = (p[0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (c[:, 0] - a[:, 0]) * (p[1] - a[:, 1])
        neg = (d1 < 0) | (d2 < 0) | (d3 < 0)
        pos = (d1 > 0) | (d2 > 0) | (d3 > 0)
        return bool((~(neg & pos)).any())

    out = []
    e = 0.03
    for p in cand:
        if hole_xy is not None and (np.abs(hole_xy - p).max(axis=1) < 1e-3).any():
            continue
        q = sum(covered(p + np.array(o) * e) for o in ((1, 1), (1, -1), (-1, 1), (-1, -1)))
        if q in (1, 3):
            out.append((float(p[0]), float(p[1])))
    log("  plinth corners:", out)
    return out


def run_axo(a):
    log("== exploded axonometric")
    S = 100.0
    dz = {1: 0.0, 2: a.dz2, 3: a.dz3}
    items = L.collect({"base", "corte"})
    corners = outline_corners(items)
    # wall footprint drawn on the floor layer (the 2D plan on the slab), as in villa_despiece_1
    clones = []
    for it in items:
        if it["cap"] and it.get("cap_wall"):
            c = dict(it)
            m = dict(it["m"])
            V = m["V"].copy()
            V[:, 2] = 0.004
            m["V"] = V
            c.update(m=m, cap=False, cap_wall=False, foot_wall=True, cls="footprint", layer=1, group="footprint", flat=True, crease=25.0)
            clones.append(c)
    for it in items:
        it["m"] = dict(it["m"])
        V = it["m"]["V"].copy()
        V[:, 2] += dz[it["layer"]]
        it["m"]["V"] = V
    items += clones
    az, el = math.radians(HERO_AZ), math.radians(HERO_EL)
    dcam = np.array([math.sin(az) * math.cos(el), math.cos(az) * math.cos(el), math.sin(el)])
    view = L.OrthoView(d=-dcam, scale=S)
    allV = np.concatenate([i["m"]["V"] for i in items if not i["drop"]])
    uv = view.project(allV)
    pad = 30.0
    mn = uv.min(axis=0)
    mx = uv.max(axis=0)
    view.off = np.array([pad - mn[0], pad - mn[1]])
    W, H = (mx - mn) + 2 * pad
    log("canvas", round(W), round(H))
    bvh, bvh_np = scene_bvh(items)
    lines = L.extract_lines(items, view, bvh, W, H, step=10.0)
    # vertical guides between the layers (dashed in Stage B), visible parts only
    gs = []
    guides = []
    for (cx, cy) in corners:
        guides.append(((cx, cy, 0.0), (cx, cy, dz[2] - 0.02)))
        guides.append(((cx, cy, 1.15 + dz[2]), (cx, cy, dz[3])))
    for A, B in guides:
        A, B = np.array(A), np.array(B)
        ln = float(np.linalg.norm(view.project(B) - view.project(A)))
        for (t0, t1) in L.visible_runs(bvh, view, A, B, ln, 10.0):
            p0 = view.project(A + (B - A) * t0)
            p1 = view.project(A + (B - A) * t1)
            gs.append((p0[0], p0[1], p1[0], p1[1]))
    if gs:
        lines["segs"] = np.concatenate([lines["segs"], np.array(gs).reshape(-1, 4)])
        lines["cls"] = list(lines["cls"]) + ["guide"] * len(gs)
        lines["grp"] = list(lines["grp"]) + ["guide"] * len(gs)
    plants = L.plant_points(items, view, bvh_np)
    caps = L.cap_polys(items, view, bvh)
    foot = L.cap_polys(items, view, bvh, key="foot_wall")
    L.save_json("axo", pack((W, H), S, lines, plants, caps, [], dz=[dz[1], dz[2], dz[3]], foot=foot))


def run_section(a, name, axis):
    """Vertical section: axis 'y' = E-W cut at y = section_y looking north; axis 'x' = N-S cut at x = section_x
    looking east. Full-height model (walls to 2.60 m), everything beyond the plane in elevation."""
    log("== section", name, axis)
    S = 150.0
    if axis == "y":
        n = np.array([0.0, 1.0, 0.0])
        p0 = np.array([0.0, a.section_y, 0.0])
    else:
        n = np.array([1.0, 0.0, 0.0])
        p0 = np.array([a.section_x, 0.0, 0.0])
    items = L.collect({"base", "alto"})
    view = L.OrthoView(d=tuple(n), scale=S)
    for it in items:
        m = it["m"]
        V2, T2 = L.clip_tris_halfspace(m["V"], m["tris"], n, p0)
        it["mc"] = dict(V=V2, tris=T2)
    bvh_items = [dict(it, m=it["mc"]) for it in items if L.default_occluder(it) and not it["plant"] and len(it["mc"]["tris"])]
    bvh, nt = L.build_bvh(bvh_items, occluder=lambda i: True)
    log("items", len(items), "clipped occluder triangles", nt)
    allV = np.concatenate([i["mc"]["V"] for i in items if len(i["mc"]["V"]) and not i["drop"]])
    uv = view.project(allV)
    pad = 0.35 * S
    mn, mx = uv.min(axis=0), uv.max(axis=0)
    view.off = np.array([pad - mn[0], pad - mn[1]])
    W, H = (mx - mn) + 2 * pad
    log("canvas", round(W), round(H))
    lines = L.extract_lines(items, view, bvh, W, H, step=10.0, halfspace=(n, p0), seam_z=1.15)
    cs, cc, cg = [], [], []
    for it in items:
        if it["drop"]:
            continue
        seg = L.cut_segments(it["m"], n, p0)
        if len(seg) == 0:
            continue
        P = view.project(seg.reshape(-1, 3)).reshape(-1, 4)
        cs.append(P)
        cc += [it["cls"]] * len(P)
        cg += [it["name"] if it["cls"] in ("furn", "stair", "fine") else it["cls"]] * len(P)
    cut = dict(segs=np.concatenate(cs), cls=cc, grp=cg)
    log("  cut segments:", len(cc))
    L.save_json(name, pack((W, H), S, lines, [], [], [], cut=cut, plane=dict(axis=axis, n=n.tolist(), p0=p0.tolist())))


def main():
    a = parse()
    for v in [v for v in a.views.split(",") if v]:
        if v == "iso":
            run_iso(a)
        elif v == "plan":
            run_plan(a)
        elif v == "axo":
            run_axo(a)
        elif v == "section":
            run_section(a, "section", "y")
        elif v == "long":
            run_section(a, "long", "x")
        else:
            log("unknown view:", v)


main()
