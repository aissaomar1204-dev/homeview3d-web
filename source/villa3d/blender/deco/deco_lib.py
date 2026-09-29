"""
deco_lib.py - shared geometry code for the villa line drawings (runs inside Blender, headless).

Stage A of the pipeline (Blender): read the villa meshes, weld vertices by position (the glTF importer
duplicates them at UV seams), find feature edges (borders, creases, view-dependent silhouettes), remove
hidden lines with BVH ray casts and write the visible 2D segments to _cache/<view>.json.
Stage B (build_svg.py, system Python + shapely) cleans, merges, simplifies and writes the SVG files.

Nothing here touches the scene on disk: the .blend is only read.
"""
import bpy
import os
import re
import math
import json
import time

import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_cache")

# ---------------------------------------------------------------------------------------------
# Classification (same layer split as villa_despiece.py: floors / walls / everything else)
# ---------------------------------------------------------------------------------------------
LAYER1 = {"Suelo", "Base", "Fondo"}
LAYER2 = {"Muro", "Tabique", "Patinillo", "Alicatado", "Peto", "Columna", "Murete", "Peldano", "Caracol",
          "Rodapies", "Mampara"}
STRUCT = {"Muro", "Tabique", "Patinillo", "Peto", "Murete"}
GLASS = {"Vidrio", "Vidrio_Ducha", "Cristal_Lavadora"}
LEAF = {"Hoja_Verde", "Hoja_Verde_Clara", "Hoja_Olivo"}
DROP_TOKENS = ("tirador", "junta", "manilla", "libro", "flor", "tallo", "cuenco", "jarron", "zocalo",
               "rodapies", "sumidero")
WALL_PREFIXES = ("Muro ", "Tabique ", "Patinillo ", "Alicatado ")
OPENING_WORDS = (" window ", " slide ", " door ")


def base_name(n):
    if len(n) > 4 and n[-4] == "." and n[-3:].isdigit():
        return n[:-4]
    return n


def strip_alto(m):
    return m[:-5] if m.endswith("_Alto") else m


def is_wall_cap(name):
    n = base_name(name) + " "
    return n.startswith(WALL_PREFIXES) and not any(w in n for w in OPENING_WORDS)


def classify(o):
    """Returns a dict describing how object o is drawn, or None when it is not part of any drawing."""
    rol = o.get("rol")
    if rol is None:
        return None
    nm = base_name(o.get("nombre_original", o.name))
    pre = re.split(r"[ _.]", nm)[0]
    mat = strip_alto(base_name(o.get("material_base", "")))
    low = (nm + " ").lower()
    layer = 1 if pre in LAYER1 else (2 if pre in LAYER2 else 3)
    d = dict(name=nm, pre=pre, mat=mat, rol=rol, layer=layer, glass=mat in GLASS, plant=False, drop=False,
             cap=False, crease=35.0, cls="furn", group=nm)
    if rol == "corte":
        d["cap"] = True
        d["cap_wall"] = is_wall_cap(nm)
    if mat in LEAF and "follaje" in low:
        d.update(plant=True, cls="plant", group=re.sub(r" follaje$", "", nm))
        return d
    if any(t in low for t in DROP_TOKENS):
        d["drop"] = True
    if d["glass"]:
        d["cls"] = "glass"
    elif " window " in low or " slide " in low or " door " in low:
        d["cls"] = "open"
    elif pre in STRUCT:
        d["cls"] = "open" if "albardilla" in low else "wall"
        d["crease"] = 25.0
    elif pre == "Base":
        d["cls"] = "plinth"
        d["crease"] = 25.0
    elif pre in ("Suelo", "Fondo"):
        d["cls"] = "floor"
        d["crease"] = 25.0
    elif pre in ("Caracol", "Peldano"):
        d["cls"] = "stair"
    elif pre == "Alfombra" or "cordaje" in low:
        d["cls"] = "fine"
    elif pre == "Alicatado":
        d["cls"] = "fine"
    else:
        d["cls"] = "furn"
    return d


# ---------------------------------------------------------------------------------------------
# Mesh reading
# ---------------------------------------------------------------------------------------------
def read_mesh(o, weld=1e-5):
    """World-space welded mesh: V (n,3), corner vertex ids cv (L,), loop_start ls (P,), loop_total lt (P,),
    triangles (T,3)."""
    me = o.data
    nv = len(me.vertices)
    if nv == 0 or len(me.polygons) == 0:
        return None
    V = np.empty(nv * 3, dtype=np.float64)
    me.vertices.foreach_get("co", V)
    V = V.reshape(-1, 3)
    M = np.array(o.matrix_world, dtype=np.float64)
    V = V @ M[:3, :3].T + M[:3, 3]
    key = np.round(V / weld).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    inv = inv.reshape(-1)
    Vm = V[first]
    L = len(me.loops)
    cv = np.empty(L, dtype=np.int32)
    me.loops.foreach_get("vertex_index", cv)
    cv = inv[cv].astype(np.int64)
    P = len(me.polygons)
    ls = np.empty(P, dtype=np.int32)
    lt = np.empty(P, dtype=np.int32)
    me.polygons.foreach_get("loop_start", ls)
    me.polygons.foreach_get("loop_total", lt)
    me.calc_loop_triangles()
    nt = len(me.loop_triangles)
    tv = np.empty(nt * 3, dtype=np.int32)
    me.loop_triangles.foreach_get("vertices", tv)
    tris = inv[tv.reshape(-1, 3)].astype(np.int64)
    tp = np.empty(nt, dtype=np.int32)
    me.loop_triangles.foreach_get("polygon_index", tp)
    keep = (tris[:, 0] != tris[:, 1]) & (tris[:, 1] != tris[:, 2]) & (tris[:, 0] != tris[:, 2])
    return dict(V=Vm, cv=cv, ls=ls.astype(np.int64), lt=lt.astype(np.int64), tris=tris[keep], tri_poly=tp[keep])


def face_normals(V, cv, ls, lt):
    P = len(ls)
    L = len(cv)
    fid = np.repeat(np.arange(P), lt)
    nxt = np.arange(L) + 1
    nxt[ls + lt - 1] = ls
    va = V[cv]
    vb = V[cv[nxt]]
    c = np.stack([(va[:, 1] - vb[:, 1]) * (va[:, 2] + vb[:, 2]),
                  (va[:, 2] - vb[:, 2]) * (va[:, 0] + vb[:, 0]),
                  (va[:, 0] - vb[:, 0]) * (va[:, 1] + vb[:, 1])], axis=1)
    N = np.zeros((P, 3))
    np.add.at(N, fid, c)
    nl = np.linalg.norm(N, axis=1)
    ok = nl > 1e-12
    N[ok] /= nl[ok, None]
    return N, ok, fid, nxt


def feature_edges(m, view, crease_deg):
    """Feature edges of a welded mesh: (a_idx, b_idx, kind) with kind 1 = border/non-manifold, 2 = crease,
    3 = silhouette. Face orientation is repaired per edge (two faces that traverse the shared edge in the
    same direction get one normal flipped), so open shells with mixed winding stay usable."""
    V, cv, ls, lt = m["V"], m["cv"], m["ls"], m["lt"]
    N, ok, fid, nxt = face_normals(V, cv, ls, lt)
    a = cv
    b = cv[nxt]
    nv = len(V)
    good = a != b
    lo = np.minimum(a, b)
    hi = np.maximum(a, b)
    key = lo * nv + hi
    idx = np.nonzero(good)[0]
    order = idx[np.argsort(key[idx], kind="stable")]
    ks = key[order]
    uniq, start, cnt = np.unique(ks, return_index=True, return_counts=True)
    ea = uniq // nv
    eb = uniq % nv
    kind = np.zeros(len(uniq), dtype=np.int8)
    kind[cnt == 1] = 1
    kind[cnt > 2] = 1
    two = np.nonzero(cnt == 2)[0]
    if len(two):
        i1 = order[start[two]]
        i2 = order[start[two] + 1]
        f1 = fid[i1]
        f2 = fid[i2]
        n1 = N[f1]
        n2 = N[f2].copy()
        same_dir = a[i1] == a[i2]
        n2[same_dir] *= -1.0
        valid = ok[f1] & ok[f2]
        dot = np.einsum("ij,ij->i", n1, n2)
        cos_t = math.cos(math.radians(crease_deg))
        crease = valid & (dot < cos_t)
        mid = 0.5 * (V[ea[two]] + V[eb[two]])
        vd = view.to_eye(mid)
        s1 = np.einsum("ij,ij->i", n1, vd)
        s2 = np.einsum("ij,ij->i", n2, vd)
        # silhouette = one face clearly front-facing, the other back-facing or edge-on (s = 0 happens in axis-aligned
        # orthographic views: the outline of a rounded object with exactly vertical sides)
        tol = 1e-6
        sil = valid & (((s1 > tol) & (s2 <= tol)) | ((s2 > tol) & (s1 <= tol))) & ~crease
        kind[two[crease]] = 2
        kind[two[sil]] = 3
    # non-manifold edges (>2 faces): boxes that touch share an edge. Internal back-to-back faces cancel; what is
    # left is a real edge only if the remaining faces are not coplanar (kills seams between adjacent boxes).
    cos_t = math.cos(math.radians(crease_deg))
    for e in np.nonzero(cnt > 2)[0]:
        fs = fid[order[start[e]:start[e] + cnt[e]]]
        ns = N[fs]
        used = np.zeros(len(fs), dtype=bool)
        for i in range(len(fs)):
            if used[i]:
                continue
            for j in range(i + 1, len(fs)):
                if not used[j] and float(ns[i] @ ns[j]) < -0.99:
                    used[i] = used[j] = True
                    break
        rem = [i for i in range(len(fs)) if not used[i]]
        if len(rem) == 0:
            kind[e] = 0
        elif len(rem) == 1:
            kind[e] = 1
        else:
            dmin = min(float(ns[i] @ ns[j]) for a_, i in enumerate(rem) for j in rem[a_ + 1:])
            kind[e] = 0 if dmin > cos_t else 2
    sel = kind > 0
    return ea[sel], eb[sel], kind[sel]


# ---------------------------------------------------------------------------------------------
# Views (projection + eye rays)
# ---------------------------------------------------------------------------------------------
class OrthoView:
    """Parallel projection. d = viewing direction (camera looks along d), up hint = +Z unless d is vertical.
    Output units: `scale` units per metre; u to the right, v downwards (SVG)."""

    def __init__(self, d, scale, origin=(0.0, 0.0, 0.0), up=(0.0, 0.0, 1.0), offset=(0.0, 0.0)):
        self.d = np.array(d, dtype=float)
        self.d /= np.linalg.norm(self.d)
        up = np.array(up, dtype=float)
        r = np.cross(self.d, up)
        if np.linalg.norm(r) < 1e-6:
            up = np.array([0.0, 1.0, 0.0])
            r = np.cross(self.d, up)
        self.r = r / np.linalg.norm(r)
        self.u = np.cross(self.r, self.d)
        self.s = float(scale)
        self.o = np.array(origin, dtype=float)
        self.off = np.array(offset, dtype=float)
        self.persp = False

    def project(self, P):
        P = np.asarray(P, dtype=float) - self.o
        return np.stack([P @ self.r * self.s + self.off[0], -(P @ self.u) * self.s + self.off[1]], axis=-1)

    def depth(self, P):
        return (np.asarray(P, dtype=float) - self.o) @ self.d

    def to_eye(self, P):
        return np.broadcast_to(-self.d, np.shape(P)).copy()

    def ray(self, P, back=200.0):
        P = Vector(P)
        d = Vector(self.d)
        return P - d * back, d, back


class PerspView:
    """Blender perspective camera, pixel-exact with the renders (sensor fit AUTO)."""

    def __init__(self, cam, W, H):
        self.cam = cam
        self.W, self.H = W, H
        self.C = np.array(cam.matrix_world.translation, dtype=float)
        Mi = np.array(cam.matrix_world.normalized().inverted(), dtype=float)
        self.Mi = Mi
        cd = cam.data
        self.f = cd.lens / cd.sensor_width * max(W, H)  # focal length in pixels
        self.sx = cd.shift_x * max(W, H)
        self.sy = cd.shift_y * max(W, H)
        self.persp = True
        self.off = np.zeros(2)

    def cam_space(self, P):
        P = np.asarray(P, dtype=float)
        return np.c_[P, np.ones(len(P))] @ self.Mi.T

    def project(self, P):
        P = np.asarray(P, dtype=float)
        single = P.ndim == 1
        if single:
            P = P[None]
        Q = self.cam_space(P)
        z = -Q[:, 2]
        u = self.W / 2 - self.sx + self.f * Q[:, 0] / z
        v = self.H / 2 + self.sy - self.f * Q[:, 1] / z
        out = np.stack([u, v], axis=-1)
        return out[0] if single else out

    def depth(self, P):
        return -self.cam_space(P)[:, 2]

    def to_eye(self, P):
        v = self.C - np.asarray(P, dtype=float)
        return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-9)

    def ray(self, P, back=0.0):
        P = Vector(P)
        C = Vector(self.C)
        d = P - C
        L = d.length
        return C, d / L, L


# ---------------------------------------------------------------------------------------------
# Scene assembly
# ---------------------------------------------------------------------------------------------
def collect(roles, extra_filter=None):
    """Meshes of the given roles (subset of base/alto/corte) with their classification and welded data."""
    items = []
    for o in bpy.data.objects:
        if o.type != "MESH" or o.get("rol") not in roles:
            continue
        info = classify(o)
        if info is None:
            continue
        if extra_filter and not extra_filter(o, info):
            continue
        m = read_mesh(o)
        if m is None:
            continue
        info["obj"] = o.name
        info["m"] = m
        V = m["V"]
        info["size"] = float(np.max(V.max(axis=0) - V.min(axis=0)))
        items.append(info)
    return items


def default_occluder(i):
    """Glass never hides lines behind it; dropped details are treated as not modelled."""
    return not (i["glass"] or i["drop"] or i.get("flat"))


def build_bvh(items, extra_tris=None, occluder=default_occluder):
    verts = []
    tris = []
    off = 0
    for it in items:
        if not occluder(it):
            continue
        m = it["m"]
        verts.append(m["V"])
        tris.append(m["tris"] + off)
        off += len(m["V"])
    if extra_tris is not None and len(extra_tris):
        V2, T2 = extra_tris
        verts.append(V2)
        tris.append(T2 + off)
    Vall = np.concatenate(verts)
    Tall = np.concatenate(tris)
    bvh = BVHTree.FromPolygons([tuple(v) for v in Vall.tolist()], [tuple(t) for t in Tall.tolist()],
                               all_triangles=True, epsilon=0.0)
    return bvh, len(Tall)


def plant_hulls(items, shrink=0.9):
    """Each plant (all its leaf objects) as one solid convex hull, scaled about its centroid: foliage hides
    what is behind it as a soft body instead of as sparse leaf cards. Returns (V, T) for build_bvh."""
    import bmesh
    groups = {}
    for it in items:
        if it["plant"]:
            groups.setdefault(it["group"], []).append(it["m"]["V"])
    Vs, Ts, off = [], [], 0
    for g, arrs in groups.items():
        P = np.concatenate(arrs)
        c = P.mean(axis=0)
        P = c + (P - c) * shrink
        bm = bmesh.new()
        for q in P:
            bm.verts.new(tuple(q))
        res = bmesh.ops.convex_hull(bm, input=bm.verts[:])
        bmesh.ops.delete(bm, geom=res["geom_interior"], context="VERTS")
        bm.verts.ensure_lookup_table()
        idx = {v.index: i for i, v in enumerate(bm.verts)}
        V = np.array([tuple(v.co) for v in bm.verts])
        T = []
        for f in bm.faces:
            vs = [idx[v.index] for v in f.verts]
            for k in range(1, len(vs) - 1):
                T.append((vs[0], vs[k], vs[k + 1]))
        bm.free()
        Vs.append(V)
        Ts.append(np.array(T, dtype=np.int64) + off)
        off += len(V)
    if not Vs:
        return None
    return np.concatenate(Vs), np.concatenate(Ts)


def is_visible(bvh, view, P, eps):
    o, d, L = view.ray(P)
    if L - eps <= 0:
        return True
    hit = bvh.ray_cast(o, d, L - eps)
    return hit[0] is None


def visible_runs(bvh, view, A, B, len2d, step, eps_base=0.012, eps_rel=2e-4):
    """Visible parameter intervals [(t0, t1), ...] along the 3D segment A->B."""
    n = int(min(64, max(1, math.ceil(len2d / step))))
    A = np.asarray(A, dtype=float)
    B = np.asarray(B, dtype=float)

    def vis_at(t):
        P = A + (B - A) * t
        eps = eps_base
        if view.persp:
            eps += eps_rel * float(np.linalg.norm(P - view.C))
        return is_visible(bvh, view, tuple(P), eps)

    ts = [(i + 0.5) / n for i in range(n)]
    st = [vis_at(t) for t in ts]
    if all(st):
        return [(0.0, 1.0)]
    if not any(st):
        return []
    runs = []
    cur = 0.0 if st[0] else None
    for i in range(1, n):
        if st[i] != st[i - 1]:
            lo, hi = ts[i - 1], ts[i]
            v_lo = st[i - 1]
            for _ in range(7):
                mid = 0.5 * (lo + hi)
                if vis_at(mid) == v_lo:
                    lo = mid
                else:
                    hi = mid
            tb = 0.5 * (lo + hi)
            if st[i]:
                cur = tb
            else:
                runs.append((cur, tb))
                cur = None
    if cur is not None:
        runs.append((cur, 1.0))
    return runs


def clip_edges_halfspace(A, B, n, p0):
    """Clip 3D segments to the half-space (P - p0).n >= 0. Returns (A', B', keep)."""
    sa = (A - p0) @ n
    sb = (B - p0) @ n
    keep = (sa > 1e-6) | (sb > 1e-6)
    A = A.copy()
    B = B.copy()
    ca = keep & (sa <= 1e-6)
    cb = keep & (sb <= 1e-6)
    t = np.where(ca, (1e-6 - sa) / np.where(sb - sa == 0, 1, sb - sa), 0.0)[:, None]
    A[ca] = (A + (B - A) * t)[ca]
    t = np.where(cb, (1e-6 - sb) / np.where(sa - sb == 0, 1, sa - sb), 0.0)[:, None]
    B[cb] = (B + (A - B) * t)[cb]
    return A, B, keep


def clip_tris_halfspace(V, T, n, p0):
    """Triangles clipped to (P - p0).n >= 0 -> (V2, T2). Straddling triangles are split."""
    s = (V - p0) @ n
    pos = s > 1e-6
    lab = pos[T]
    npos = lab.sum(axis=1)
    keep_full = npos == 3
    outV = [V]
    outT = [T[keep_full]]
    mixed = np.nonzero((npos > 0) & (npos < 3))[0]
    newV = []
    newT = []
    base = len(V)
    for i in mixed:
        tri = T[i]
        pts = [V[k] for k in tri]
        ss = [s[k] for k in tri]
        poly = []
        for a in range(3):
            b = (a + 1) % 3
            if ss[a] > 1e-6:
                poly.append(pts[a])
            if (ss[a] > 1e-6) != (ss[b] > 1e-6):
                t = (1e-6 - ss[a]) / (ss[b] - ss[a])
                poly.append(pts[a] + (pts[b] - pts[a]) * t)
        if len(poly) >= 3:
            ids = []
            for q in poly:
                newV.append(q)
                ids.append(base + len(newV) - 1)
            for k in range(1, len(ids) - 1):
                newT.append((ids[0], ids[k], ids[k + 1]))
    if newV:
        outV.append(np.array(newV))
        outT.append(np.array(newT, dtype=np.int64))
    return np.concatenate(outV), np.concatenate(outT)


def cut_segments(m, n, p0):
    """Intersection of the mesh with the plane (P - p0).n = 0 as 3D segments, shape (N, 2, 3)."""
    V, T = m["V"], m["tris"]
    s = (V - p0) @ n
    lab = (s > 1e-6)[T]
    npos = lab.sum(axis=1)
    idx = np.nonzero((npos > 0) & (npos < 3))[0]
    segs = []
    for i in idx:
        tri = T[i]
        pts = []
        for a in range(3):
            b = (a + 1) % 3
            ka, kb = tri[a], tri[b]
            if (s[ka] > 1e-6) != (s[kb] > 1e-6):
                t = (0.0 - s[ka]) / (s[kb] - s[ka])
                pts.append(V[ka] + (V[kb] - V[ka]) * t)
        if len(pts) == 2 and np.linalg.norm(pts[0] - pts[1]) > 1e-6:
            segs.append((pts[0], pts[1]))
    return np.array(segs, dtype=np.float64).reshape(-1, 2, 3)


def extract_lines(items, view, bvh, W, H, step=12.0, margin=20.0, crease_override=None, want=None, halfspace=None,
                  seam_z=None, log=print):
    """Visible feature-edge segments of all drawable items. Returns dict of arrays.
    halfspace = (n, p0): only the part of every edge with (P - p0).n >= 0 is considered (section views)."""
    t0 = time.time()
    segs = []
    cls_list = []
    grp_list = []
    n_edges = 0
    for it in items:
        if it["drop"] or it["plant"]:
            continue
        if want and not want(it):
            continue
        m = it["m"]
        ea, eb, kind = feature_edges(m, view, it["crease"] if crease_override is None else crease_override)
        if len(ea) == 0:
            continue
        A = m["V"][ea]
        B = m["V"][eb]
        if seam_z is not None:
            # objects were split at the section-cut height: horizontal edges exactly there are seams, not edges
            seam = (np.abs(A[:, 2] - seam_z) < 2e-3) & (np.abs(B[:, 2] - seam_z) < 2e-3)
            A, B = A[~seam], B[~seam]
            if len(A) == 0:
                continue
        if halfspace is not None:
            A, B, kp = clip_edges_halfspace(A, B, *halfspace)
            A, B = A[kp], B[kp]
            if len(A) == 0:
                continue
        A2 = view.project(A)
        B2 = view.project(B)
        # cull edges wholly outside the frame
        lo = np.minimum(A2, B2)
        hi = np.maximum(A2, B2)
        inside = (hi[:, 0] > -margin) & (lo[:, 0] < W + margin) & (hi[:, 1] > -margin) & (lo[:, 1] < H + margin)
        ln = np.linalg.norm(B2 - A2, axis=1)
        for i in np.nonzero(inside)[0]:
            n_edges += 1
            if ln[i] < 0.15:
                continue
            for (t0_, t1_) in visible_runs(bvh, view, A[i], B[i], ln[i], step):
                p0 = view.project(A[i] + (B[i] - A[i]) * t0_)
                p1 = view.project(A[i] + (B[i] - A[i]) * t1_)
                if np.linalg.norm(p1 - p0) < 0.15:
                    continue
                segs.append((p0[0], p0[1], p1[0], p1[1]))
                cls_list.append(it["cls"])
                grp_list.append(it["group"])
    log("  lines: %d edges tested, %d visible segments, %.1fs" % (n_edges, len(segs), time.time() - t0))
    return dict(segs=np.array(segs, dtype=np.float64).reshape(-1, 4), cls=cls_list, grp=grp_list)


def plant_points(items, view, bvh, log=print):
    """Visible foliage per plant: projected triangles whose centroid is not hidden by walls or furniture.
    `bvh` must be built WITHOUT the plants themselves (foliage is one soft body, its leaves do not hide
    each other)."""
    groups = {}
    for it in items:
        if it["plant"]:
            groups.setdefault(it["group"], []).append(it)
    out = []
    for g, its in groups.items():
        tris2 = []
        n_all = 0
        for it in its:
            m = it["m"]
            V = m["V"]
            for t in m["tris"]:
                tri = V[t]
                c = tri.mean(axis=0)
                n_all += 1
                eps = 0.03 + (2e-4 * float(np.linalg.norm(c - view.C)) if view.persp else 0.0)
                if is_visible(bvh, view, tuple(c), eps):
                    tris2.append(np.round(view.project(tri), 1).tolist())
        vis = len(tris2) / max(n_all, 1)
        out.append(dict(name=g, tris=tris2, vis=float(vis)))
    log("  plants:", [(o["name"], round(o["vis"], 2)) for o in out])
    return out


def _rect_pairs(T):
    """Pairs of triangles that together form a rectangle: [(tri_i, tri_j, quad vertex ids in order)]."""
    edge_map = {}
    for ti, t in enumerate(T):
        for a, b in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
            edge_map.setdefault((min(a, b), max(a, b)), []).append(ti)
    return edge_map


def cap_polys(items, view, bvh, key="cap_wall", log=print):
    """Wall section caps (poche) as 2D triangles. Rectangles (most walls) are cut where an occluder hides
    them: visible runs along the centre line, refined by bisection, exactly like edges. Anything else is kept
    or dropped by its centroid."""
    out = []
    n_rect = n_other = 0
    for it in items:
        if not it.get(key):
            continue
        m = it["m"]
        V, T = m["V"], m["tris"]
        used = np.zeros(len(T), dtype=bool)
        for (a, b), tl in _rect_pairs(T).items():
            if len(tl) != 2 or used[tl[0]] or used[tl[1]]:
                continue
            t1, t2 = T[tl[0]], T[tl[1]]
            c = [v for v in t1 if v not in (a, b)][0]
            d = [v for v in t2 if v not in (a, b)][0]
            P = V[[a, c, b, d]]
            e1, e2 = P[1] - P[0], P[2] - P[1]
            n1, n2 = np.linalg.norm(e1), np.linalg.norm(e2)
            if n1 < 1e-6 or n2 < 1e-6 or abs(float(e1 @ e2)) > 1e-4 * n1 * n2:
                continue
            used[tl[0]] = used[tl[1]] = True
            n_rect += 1
            # quad = P0, P0+e1, P0+e1+e2, P0+e2 (rectangle): long side along L, short side W, both from P0
            O = P[0]
            if n1 >= n2:
                Lv, Wv = e1, e2
            else:
                Lv, Wv = e2, e1
            A = O + Wv * 0.5
            B = A + Lv
            ln2 = float(np.linalg.norm(view.project(B) - view.project(A)))
            for (t0, t1_) in visible_runs(bvh, view, A, B, ln2, 6.0):
                q = np.array([O + Lv * t0, O + Lv * t1_, O + Lv * t1_ + Wv, O + Lv * t0 + Wv])
                q2 = np.round(view.project(q), 2).tolist()
                out.append([q2[0], q2[1], q2[2]])
                out.append([q2[0], q2[2], q2[3]])
        for i in np.nonzero(~used)[0]:
            tri = V[T[i]]
            c = tri.mean(axis=0)
            n_other += 1
            eps = 0.02 + (2e-4 * float(np.linalg.norm(c - view.C)) if view.persp else 0.0)
            if is_visible(bvh, view, tuple(c), eps):
                out.append(np.round(view.project(tri), 2).tolist())
    log("  poche: %d rectangles, %d loose triangles -> %d visible triangles" % (n_rect, n_other, len(out)))
    return out


def save_json(name, payload):
    os.makedirs(CACHE, exist_ok=True)

    def enc(o):
        if isinstance(o, np.ndarray):
            return o.tolist()
        if isinstance(o, (np.floating,)):
            return float(o)
        if isinstance(o, (np.integer,)):
            return int(o)
        raise TypeError(type(o))

    p = os.path.join(CACHE, name + ".json")
    with open(p, "w") as f:
        json.dump(payload, f, default=enc, separators=(",", ":"))
    print("[deco] wrote", p, os.path.getsize(p) // 1024, "KB")
    return p


def log(*a):
    print("[deco]", *a, flush=True)
