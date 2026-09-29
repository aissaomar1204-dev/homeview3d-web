"""
build_svg.py - Stage B: clean the extracted segments and write the SVG line drawings.

  python build_svg.py [iso plan axo section long]        (default: every _cache/*.json that exists)

Needs numpy + shapely (system Python). Reads _cache/<view>.json (written by extract_views.py inside Blender)
and writes ../../../../public/assets/deco/<file>.svg : stroke only, currentColor, compact relative path data,
one <g> per line weight so a stylesheet can restyle any layer. Wall poche (and the cut solids of the
section) are separate fill groups.
"""
import json
import os
import sys
import time

import numpy as np
import shapely
from shapely.geometry import LineString, Polygon
from shapely.ops import unary_union, polygonize

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_cache")
OUT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "public", "assets", "deco"))
_T0 = [time.time()]
VERBOSE = "-v" in sys.argv
if VERBOSE:
    sys.argv.remove("-v")


def tick(msg):
    t = time.time()
    if VERBOSE:
        print("    %-40s %.1fs" % (msg, t - _T0[0]))
    _T0[0] = t


# layer id, class keys. Drawn bottom -> top; precedence for de-duplication is top -> bottom.
LAYERS = [
    ("footprint", ("footprint",)),
    ("floors", ("floor",)),
    ("fine", ("fine",)),
    ("furniture", ("furn",)),
    ("stairs", ("stair",)),
    ("glass", ("glass",)),
    ("openings", ("open",)),
    ("plinth", ("plinth",)),
    ("walls", ("wall",)),
]
BASE_W = dict(footprint=0.7, floors=0.8, fine=0.7, furniture=1.0, stairs=1.1, glass=0.7, openings=1.3, plinth=1.6,
              walls=1.8, plants=0.9, swings=0.7, guides=0.8, cutfurn=1.2)
BASE_OP = dict(footprint=0.5, floors=0.6, fine=0.55, furniture=0.85, stairs=0.85, glass=0.6, openings=1, plinth=1,
               walls=1, plants=0.75, swings=0.55, guides=0.55, cutfurn=1)
BASE_MIN = dict(footprint=4, floors=6, fine=5, furniture=3.5, stairs=3, glass=3, openings=2.5, plinth=3, walls=3,
                guides=2)


def scaled(base, k):
    return {a: round(b * k, 2) for a, b in base.items()}


CFG = {
    "plan": dict(file="villa-plan-lines.svg", prec=1, title="Villa demo - floor plan, line drawing", pad=14,
                 w=scaled(BASE_W, 1.0), op=BASE_OP, minlen=BASE_MIN, tol=0.28, plant_r=9.0, plant_hole=250),
    "iso": dict(file="villa-iso-lines.svg", prec=0, title="Villa demo - isometric line drawing", pad=14,
                w=scaled(BASE_W, 1.55), op=BASE_OP, minlen=scaled(BASE_MIN, 1.4), tol=0.6, plant_r=7.0, plant_hole=260),
    "axo": dict(file="villa-axo-exploded.svg", prec=0, title="Villa demo - exploded axonometric, line drawing", pad=14,
                w=scaled(BASE_W, 1.2), op=BASE_OP, minlen=scaled(BASE_MIN, 1.2), tol=0.5, plant_r=6.0, plant_hole=200),
    "section": dict(file="villa-section.svg", prec=1, title="Villa demo - cross section, line drawing", pad=14,
                    w=scaled(BASE_W, 1.0), op=BASE_OP, minlen=BASE_MIN, tol=0.28, plant_r=6.0, plant_hole=200),
    "long": dict(file="villa-section-long.svg", prec=1, title="Villa demo - longitudinal section, line drawing", pad=14,
                 w=scaled(BASE_W, 1.0), op=BASE_OP, minlen=BASE_MIN, tol=0.28, plant_r=6.0, plant_hole=200),
}


# ---------------------------------------------------------------------------------------------
def to_lines(segs, snap):
    a = np.round(np.asarray(segs, dtype=float).reshape(-1, 4) / snap) * snap
    keep = (np.abs(a[:, 0] - a[:, 2]) + np.abs(a[:, 1] - a[:, 3])) > 1e-9
    return shapely.linestrings(a[keep].reshape(-1, 2, 2))


def merge_lines(geoms):
    """Dedupe + node + chain."""
    if len(geoms) == 0:
        return []
    u = shapely.union_all(geoms)
    m = shapely.line_merge(u) if u.geom_type != "LineString" else u
    if m.geom_type == "LineString":
        return [m]
    return [g for g in m.geoms if g.geom_type == "LineString"]


def simplify_lines(lines, tol, minlen):
    out = []
    for ln in lines:
        s = ln.simplify(tol, preserve_topology=False)
        if s.is_empty or s.length < minlen:
            continue
        out.append(s)
    return out


def parts_of(g):
    if g.is_empty:
        return []
    if g.geom_type == "LineString":
        return [g]
    return [p for p in getattr(g, "geoms", []) if p.geom_type == "LineString"]


def cut_lines_by(lines, region, minlen):
    """Remove the parts of `lines` that fall inside `region` (prepared)."""
    if not lines:
        return lines
    arr = np.array(lines, dtype=object)
    hit = shapely.intersects(arr, region)
    out = [ln for ln, h in zip(lines, hit) if not h]
    for ln in arr[hit]:
        out += [p for p in parts_of(ln.difference(region)) if p.length >= minlen]
    return out


def fmt(n, prec):
    """n is an integer in units of 10^-prec."""
    if prec == 0:
        return str(int(n))
    sgn = "-" if n < 0 else ""
    n = abs(int(n))
    ip, fp = divmod(n, 10 ** prec)
    fs = str(fp).rjust(prec, "0").rstrip("0")
    s = (str(ip) if ip else "") + ("." + fs if fs else "")
    return sgn + (s or "0")


def join_tokens(tokens):
    out = []
    prev = ""
    for t in tokens:
        if not out:
            out.append(t)
        elif t.startswith("-") or (t.startswith(".") and "." in prev):
            out.append(t)
        elif t[0].isalpha() or prev[-1].isalpha():
            out.append(t)
        else:
            out.append(" " + t)
        prev = t
    return "".join(out)


def path_d(lines, prec):
    """Relative polyline data. Closed rings end with z. Every point is expressed against the previous
    *quantised* point so no error accumulates."""
    k = 10 ** prec
    toks = []
    cx = cy = 0
    for ln in lines:
        co = np.asarray(ln.coords)
        q = np.round(co * k).astype(np.int64)
        closed = len(q) > 3 and (q[0] == q[-1]).all()
        if closed:
            q = q[:-1]
        keep = np.ones(len(q), dtype=bool)
        keep[1:] = (np.abs(np.diff(q, axis=0)).sum(axis=1) > 0)
        q = q[keep]
        if len(q) < 2:
            continue
        toks += ["m", fmt(q[0][0] - cx, prec), fmt(q[0][1] - cy, prec)]
        for dx, dy in np.diff(q, axis=0):
            toks += [fmt(dx, prec), fmt(dy, prec)]
        if closed:
            toks.append("z")
            cx, cy = q[0]
        else:
            cx, cy = q[-1]
    return join_tokens(toks)


def poly_d(geom, prec):
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    rings = []
    for p in polys:
        if p.is_empty:
            continue
        rings.append(LineString(p.exterior.coords))
        for h in p.interiors:
            rings.append(LineString(h.coords))
    return path_d(rings, prec)


def chaikin(coords, iters=2):
    c = np.asarray(coords)[:-1]
    for _ in range(iters):
        n = np.roll(c, -1, axis=0)
        q = 0.75 * c + 0.25 * n
        r = 0.25 * c + 0.75 * n
        c = np.empty((len(c) * 2, 2))
        c[0::2] = q
        c[1::2] = r
    return np.vstack([c, c[:1]])


def blob(tris, r, simp, min_hole):
    """Foliage symbol from the visible leaf triangles: union (buffered by r), closed, small holes filled,
    simplified and softened with Chaikin corner cutting. Returns a list of rings (LineStrings)."""
    polys = [Polygon(t) for t in tris if len(t) == 3]
    polys = [p for p in polys if p.area > 1e-6]
    if not polys:
        return []
    g = shapely.union_all(shapely.buffer(np.array(polys, dtype=object), r, quad_segs=3))
    g = g.buffer(-r * 0.8, quad_segs=3)
    parts = [g] if g.geom_type == "Polygon" else list(getattr(g, "geoms", []))
    rings = []
    for p in parts:
        if p.is_empty or p.area < min_hole * 3:
            continue
        for ring, keep in [(p.exterior, True)] + [(h, Polygon(h).area > min_hole) for h in p.interiors]:
            if not keep:
                continue
            ls = Polygon(ring.coords).simplify(simp, preserve_topology=True)
            if ls.geom_type != "Polygon" or len(ls.exterior.coords) < 5:
                continue
            # slivers (a plant mostly hidden behind a wall) read as scribbles: keep compact shapes only
            if 4 * np.pi * ls.area / max(ls.length ** 2, 1e-9) < 0.42:
                continue
            rings.append(LineString(chaikin(ls.exterior.coords, 2)))
    return rings


# ---------------------------------------------------------------------------------------------
def crop_offset(data, pad):
    """Shift everything so the drawing starts at (pad, pad); returns (dx, dy, W, H, min corner)."""
    pts = [np.array(data["lines"]["segs"], dtype=float).reshape(-1, 2)]
    if data.get("cut"):
        pts.append(np.array(data["cut"]["segs"], dtype=float).reshape(-1, 2))
    for t in data.get("poche", []) + data.get("foot", []):
        pts.append(np.array(t))
    for p in data.get("plants", []):
        if p["vis"] >= 0.08 and p["tris"]:
            pts.append(np.array(p["tris"]).reshape(-1, 2))
    for d in data.get("doors", []):
        c, r = np.array(d["c"]), d["r"]
        pts.append(np.array([c - r, c + r]))
    P = np.concatenate(pts)
    mn, mx = P.min(axis=0), P.max(axis=0)
    return float(pad - mn[0]), float(pad - mn[1]), float(mx[0] - mn[0] + 2 * pad), float(mx[1] - mn[1] + 2 * pad), mn


def shift_data(data, dx, dy):
    d = np.array([dx, dy])
    data["lines"]["segs"] = (np.array(data["lines"]["segs"], dtype=float).reshape(-1, 4) + np.tile(d, 2)).tolist()
    if data.get("cut"):
        data["cut"]["segs"] = (np.array(data["cut"]["segs"], dtype=float).reshape(-1, 4) + np.tile(d, 2)).tolist()
    data["poche"] = [(np.array(t) + d).tolist() for t in data.get("poche", [])]
    data["foot"] = [(np.array(t) + d).tolist() for t in data.get("foot", [])]
    for p in data.get("plants", []):
        p["tris"] = (np.array(p["tris"]).reshape(-1, 3, 2) + d).tolist() if p["tris"] else []
    for dr in data.get("doors", []):
        for k in ("c", "p1", "p2"):
            dr[k] = (np.array(dr[k]) + d).tolist()


def polygonize_cells(segs, snap=0.02):
    """Closed cells of a set of 2D segments (noded)."""
    g = to_lines(segs, snap)
    if len(g) == 0:
        return []
    u = shapely.union_all(g)
    return [p for p in polygonize(u) if p.area > 2.0]


def hatch_lines(geom, spacing, minlen=2.0):
    """45-degree hatch clipped to a (multi)polygon."""
    minx, miny, maxx, maxy = geom.bounds
    cs = np.arange(minx + miny - 4, maxx + maxy + 4, spacing * np.sqrt(2))
    ls = [LineString([(minx - 4, c - (minx - 4)), (maxx + 4, c - (maxx + 4))]) for c in cs]
    out = []
    for g in shapely.intersection(np.array(ls, dtype=object), geom):
        out += [p for p in parts_of(g) if p.length >= minlen]
    return out


def section_cells(data, snap=0.02):
    cut = data["cut"]
    segs = np.array(cut["segs"], dtype=float).reshape(-1, 4)
    cls = np.array(cut["cls"])
    grp = np.array(cut["grp"])
    struct = []
    plinth = []
    for key in ("wall", "floor", "open"):
        sel = cls == key
        if sel.any():
            struct += polygonize_cells(segs[sel], snap)
    if (cls == "plinth").any():
        plinth = polygonize_cells(segs[cls == "plinth"], snap)
    furn = []
    fsel = np.isin(cls, ("furn", "stair", "fine"))
    for g in sorted(set(grp[fsel])):
        sel = (grp == g) & fsel
        furn += polygonize_cells(segs[sel], snap)
    glass = segs[cls == "glass"]
    return struct, plinth, furn, glass


def build(view):
    cfg = CFG[view]
    src = json.load(open(os.path.join(CACHE, view + ".json")))
    data = json.loads(json.dumps(src))
    prec = cfg["prec"]
    snap = 10 ** -(prec + 1)
    dx, dy, W, H, mn = crop_offset(data, cfg["pad"])
    shift_data(data, dx, dy)
    segs = np.array(data["lines"]["segs"], dtype=float).reshape(-1, 4)
    cls = np.array(data["lines"]["cls"])
    print("[%s] raw segments %d, canvas %.0f x %.0f" % (view, len(segs), W, H))
    tick("load")

    # --- section: cut cells (poche) and clipping region ------------------------------------
    poche_d = ""
    cutfurn_lines = []
    region = None
    hatch = []
    ground_outline = []
    if data.get("cut"):
        struct, plinth, furn, glass = section_cells(data)

        def merged(cells):
            return unary_union([c.buffer(0.01, join_style=2) for c in cells]).buffer(-0.01, join_style=2) if cells else None

        s_union, p_union, f_union = merged(struct), merged(plinth), merged(furn)
        parts = [g for g in (s_union, p_union, f_union) if g is not None]
        region = unary_union(parts).buffer(0.25, join_style=2)
        shapely.prepare(region)
        if s_union is not None:
            poche_d = poly_d(s_union.simplify(cfg["tol"] * 0.4, preserve_topology=True), prec)
        if p_union is not None:
            pu = p_union.simplify(cfg["tol"] * 0.4, preserve_topology=True)
            hatch = hatch_lines(pu.buffer(-1.2, join_style=2), 5.0)
            for p in ([pu] if pu.geom_type == "Polygon" else list(pu.geoms)):
                ground_outline.append(LineString(p.exterior.coords))
                ground_outline += [LineString(h.coords) for h in p.interiors]
        if f_union is not None:
            polys = [f_union] if f_union.geom_type == "Polygon" else list(f_union.geoms)
            for p in polys:
                p = p.simplify(cfg["tol"], preserve_topology=True)
                cutfurn_lines.append(LineString(p.exterior.coords))
                cutfurn_lines += [LineString(h.coords) for h in p.interiors]
        tick("section cells (%d struct, %d furn)" % (len(struct), len(furn)))
        if len(glass):
            gl = merge_lines(to_lines(glass, snap))
            cutfurn_lines += simplify_lines(gl, cfg["tol"], 1.5)
    elif data.get("poche"):
        tris = [Polygon(t) for t in data["poche"] if len(t) == 3]
        tris = [t for t in tris if t.area > 1e-6]
        un = unary_union([t.buffer(0.02, join_style=2) for t in tris]).buffer(-0.02, join_style=2)
        poche_d = poly_d(un.simplify(cfg["tol"] * 0.5, preserve_topology=True), prec)
    foot_hatch = []
    if data.get("foot"):
        ft = [Polygon(t) for t in data["foot"] if len(t) == 3]
        fu = unary_union([t.buffer(0.02, join_style=2) for t in ft if t.area > 1e-6]).buffer(-0.02, join_style=2)
        foot_hatch = hatch_lines(fu.buffer(-0.8, join_style=2), 4.5)
    tick("poche")

    # --- line layers, heaviest first so lighter layers can drop what is already drawn ------------
    per = {}
    heavy = []
    stats = {}
    for lid, keys in reversed(LAYERS):
        sel = np.isin(cls, keys)
        if not sel.any():
            continue
        ml = cfg["minlen"].get(lid, 3)
        lines = simplify_lines(merge_lines(to_lines(segs[sel], snap)), cfg["tol"], ml)
        if region is not None:
            lines = cut_lines_by(lines, region, ml)
        if heavy and lines:
            hb = shapely.union_all(shapely.buffer(np.array(heavy, dtype=object), cfg["w"][lid] * 0.35 + 0.15, quad_segs=2))
            shapely.prepare(hb)
            lines = cut_lines_by(lines, hb, ml)
        per[lid] = lines
        stats[lid] = len(lines)
        heavy += lines
        tick("layer %s" % lid)
    print("[%s] lines per layer %s" % (view, stats))

    # --- plants ---------------------------------------------------------------------------------
    plant_d = []
    if region is None:
        for p in data.get("plants", []):
            if p["vis"] < 0.08:
                continue
            plant_d += blob(p["tris"], cfg["plant_r"], 1.4, cfg["plant_hole"])
    tick("plants")

    # --- svg -----------------------------------------------------------------------------------
    body = []
    if poche_d:
        body.append('<g id="poche" fill="currentColor" stroke="none"><path fill-rule="evenodd" d="%s"/></g>' % poche_d)
    if foot_hatch:
        body.append('<g id="footprint-hatch" stroke-width="%s" opacity=".5"><path d="%s"/></g>' % (cfg["w"]["fine"], path_d(foot_hatch, prec)))
    for lid, keys in LAYERS:
        lines = per.get(lid)
        if not lines:
            continue
        body.append('<g id="%s" stroke-width="%s"%s><path d="%s"/></g>' % (
            lid if lid != "footprint" else "footprints", cfg["w"][lid],
            ("" if cfg["op"][lid] >= 1 else ' opacity="%s"' % cfg["op"][lid]), path_d(lines, prec)))
        if lid == "furniture" and plant_d:
            body.append('<g id="plants" stroke-width="%s" opacity="%s"><path d="%s"/></g>' % (
                cfg["w"]["plants"], cfg["op"]["plants"], path_d(plant_d, prec)))
    if "guide" in set(cls.tolist()):
        gl = simplify_lines(merge_lines(to_lines(segs[cls == "guide"], snap)), 0.3, 2)
        body.append('<g id="guides" stroke-width="%s" opacity="%s" stroke-dasharray="3 8"><path d="%s"/></g>' % (
            cfg["w"]["guides"], cfg["op"]["guides"], path_d(gl, prec)))
    if hatch:
        body.append('<g id="hatch" stroke-width="%s" opacity=".5"><path d="%s"/></g>' % (cfg["w"]["fine"], path_d(hatch, prec)))
    if ground_outline:
        body.append('<g id="cut-ground" stroke-width="%s"><path d="%s"/></g>' % (cfg["w"]["plinth"], path_d(ground_outline, prec)))
    if cutfurn_lines:
        body.append('<g id="cut-furniture" stroke-width="%s"><path d="%s"/></g>' % (cfg["w"]["cutfurn"], path_d(cutfurn_lines, prec)))
    if data.get("doors"):
        toks = []
        q = 10 ** prec
        for dr in data["doors"]:
            (cx, cy), (x1, y1), (x2, y2), r = dr["c"], dr["p1"], dr["p2"], dr["r"]
            sweep = 1 if ((x1 - cx) * (y2 - cy) - (y1 - cy) * (x2 - cx)) > 0 else 0
            toks.append("M%s %sA%s %s 0 0 %d %s %s" % (fmt(round(x1 * q), prec), fmt(round(y1 * q), prec),
                                                      fmt(round(r * q), prec), fmt(round(r * q), prec), sweep,
                                                      fmt(round(x2 * q), prec), fmt(round(y2 * q), prec)))
        body.append('<g id="swings" stroke-width="%s" opacity="%s"><path d="%s"/></g>' % (
            cfg["w"]["swings"], cfg["op"]["swings"], "".join(toks)))
    q = 10 ** prec
    crop = ""
    if view == "iso":
        crop = ' data-hero-crop="%d %d %d %d" data-hero-size="%d %d"' % (
            round(mn[0] - cfg["pad"]), round(mn[1] - cfg["pad"]), round(W), round(H), *[int(v) for v in src["size"]])
    head = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%d" height="%d" fill="none" '
            'stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"%s><title>%s</title>') % (
        fmt(round(W * q), prec), fmt(round(H * q), prec), round(W), round(H), crop, cfg["title"])
    out = head + "".join(body) + "</svg>"
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, cfg["file"])
    open(p, "w", encoding="utf-8").write(out)
    print("[%s] wrote %s  %.1f KB" % (view, p, len(out.encode()) / 1024))
    return p


if __name__ == "__main__":
    views = sys.argv[1:] or [f[:-5] for f in sorted(os.listdir(CACHE)) if f.endswith(".json") and f[:-5] in CFG]
    for v in views:
        build(v)
