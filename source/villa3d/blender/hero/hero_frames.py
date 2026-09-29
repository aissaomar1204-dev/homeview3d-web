"""
hero_frames.py - "El plano se vuelve 3D": 48-frame hero sequence for the website (Cycles, RGBA, 14:9).

Same scene, materials, sky, sun, shadow catcher, AgX look and hero camera as villa_render.py
(the last frame IS villa_maqueta_iso at half size), animated by driving empties from Python:

  layer   what                                             how it moves
  ------  -----------------------------------------------  ------------------------------------------
  floors  Suelo*, Base, Fondo, Peldano (steps below floor)  never (frame 0 = the coloured floor plan)
  walls   Muro/Tabique/Patinillo/Alicatado/Peto/Columna/    one empty at the origin, scale Z from the
          Murete/Caracol/Rodapies/Mampara + their doors,    floor (s0 -> 1, ease-out); the dark section
          windows, glass, section caps (poche)              caps at the 1.15 m cut rise with them
  furni.  everything else (sofas, beds, plants, ...)        one empty per piece at its base, uniform
                                                            scale-in, staggered room by room

Timeline (48 frames, the site plays ~20-24 fps):
  f0-5    top-down, walls flat (only their poche shows), no furniture   -> registered line drawing
  f5-22   walls + openings rise                (ease-out, power 1.7)
  f14-36  camera: near-orthographic top-down -> hero camera (dolly-zoom, ease-in-out)
  f22-40  furniture and plants, room by room   (ease-out quad, no overshoot)
  f34-47  sun: neutral high -> late-afternoon hero sun (direction + colour + strength)

Outputs in --outdir (default ../../renders/hero):
  hero_000.png .. hero_047.png   1400x900 RGBA masters (transparent background + shadow catcher)
  hero_plan_lines.png            architectural line drawing, from EXACTLY the frame-0 camera
  hero_points.json               per-frame projected points (0-1, origin top-left) + timeline + camera
  _timings.json

Usage (PowerShell, see README.md):
  $B = "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe"
  & $B -b --factory-startup -P hero_frames.py -- [--frames 0-47] [--samples 128] [--ss 1] [--scale 100]
       [--outdir PATH] [--no-lines | --lines-only | --points-only]
"""
import bpy
import os
import re
import sys
import math
import time
import json
import argparse
from types import SimpleNamespace

import numpy as np
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

HERE = os.path.dirname(os.path.abspath(__file__))
BLENDER_DIR = os.path.dirname(HERE)
VILLA = os.path.dirname(BLENDER_DIR)
sys.path.insert(0, BLENDER_DIR)
import villa_render as vr  # noqa: E402  (scene builder: model, materials, sky, sun, ground, hero camera, plan mode)
import villa_despiece as vd  # noqa: E402  (layer_of: the floors / walls / furniture classification)

DEFAULT_OUT = os.path.join(VILLA, "renders", "hero")
HERO = "villa_maqueta_iso"

# ---------------------------------------------------------------------------
# Timeline
# ---------------------------------------------------------------------------
NF = 48
FPS = 22
RES = (1400, 900)                 # masters, 14:9 (same aspect as villa_maqueta_iso 2800x1800)
T_WALL = (5.0, 22.0)
T_CAM = (14.0, 36.0)
T_FURN = (22.0, 40.0)
T_LIGHT = (34.0, 47.0)
WALL_EASE = 1.7
WALL_MIN = 0.004                  # walls "at ~0 height" in frames 0-5 (4.6 mm): only the dark caps read
FURN_DUR = 5.0                    # frames a piece takes to scale in
FURN_SPREAD = 1.4                 # frames of stagger inside a room

# Camera: px per metre at the target plane and perspective distance
S_TOP = 52.5                      # top-down scale at 1400 px wide: plan 14.05 m -> 738 px of 900
D_TOP = 1500.0                    # camera distance of the near-orthographic start (lens ~2000 mm)
DOLLY_POW = 0.7                   # <1 blooms the perspective earlier in the move

# Sun: neutral high (start) -> hero late afternoon (end = villa_render defaults 292/38, 4.2 W/m2, 1.0/0.80/0.60)
SUN0 = dict(az=312.0, el=53.0, energy=3.6, color=(1.0, 0.965, 0.93))
SUN1 = dict(az=vr.SUN_AZ, el=vr.SUN_EL, energy=4.2, color=(1.0, 0.80, 0.60))

# Building envelope in plan metres (outer faces of the masonry; the coping adds 3 cm on S/W/N)
BBOX = (0.0, 0.0, 9.10, 14.05)
PARAPET_TOP = 1.07                # NE and SW corners are terrace parapets with coping (walls are cut at 1.15)
CUT = 1.15

# Furniture rooms in the order they appear (floor object names contain these words)
ZONES = [
    ("salon", "Salón", "Living", ("Salon", "Distribuidor", "Rellano")),
    ("terraza_oeste", "Terraza oeste", "West terrace", ("Terraza Oeste",)),
    ("dormitorio_principal", "Dormitorio principal", "Main bedroom", ("Dormitorio Principal",)),
    ("bano_principal", "Baño principal", "Main bathroom", ("Bano Principal", "Ducha")),
    ("pasillo", "Pasillo y lavadero", "Hall and utility", ("Pasillo", "Lavadero")),
    ("dormitorio_3", "Dormitorio 3 y vestidor", "Bedroom 3 and dressing", ("Dormitorio 3", "Vestidor")),
    ("dormitorio_2", "Dormitorio 2", "Bedroom 2", ("Dormitorio 2", "Armario Ropa")),
    ("bano_2", "Baño 2", "Bathroom 2", ("Bano 2",)),
    ("terraza_norte", "Terraza norte", "North terrace", ("Terraza Norte",)),
]


def log(*a):
    print("[hero]", *a, flush=True)


def clamp01(x):
    return max(0.0, min(1.0, x))


def lerp(a, b, t):
    return a + (b - a) * t


def ramp(f, a, b):
    return clamp01((f - a) / (b - a))


def smoothstep(t):
    t = clamp01(t)
    return t * t * (3.0 - 2.0 * t)


def smootherstep(t):
    t = clamp01(t)
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def ease_out_cubic(t):
    return 1.0 - (1.0 - clamp01(t)) ** 3


def ease_out_quad(t):
    return 1.0 - (1.0 - clamp01(t)) ** 2


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--frames", default="0-%d" % (NF - 1), help="e.g. 0-47, 12,24,47, 47")
    p.add_argument("--samples", type=int, default=128)
    p.add_argument("--threshold", type=float, default=0.006, help="adaptive sampling noise threshold")
    p.add_argument("--ss", type=int, default=1, help="render at ss x 1400x900 and box-filter down")
    p.add_argument("--scale", type=int, default=100, help="resolution percentage (previews)")
    p.add_argument("--outdir", default=DEFAULT_OUT)
    p.add_argument("--no-lines", action="store_true")
    p.add_argument("--lines-only", action="store_true")
    p.add_argument("--lines-ss", type=int, default=3)
    p.add_argument("--lines-thickness", type=float, default=3.0, help="Freestyle px at lines-ss")
    p.add_argument("--points-only", action="store_true")
    p.add_argument("--seed", type=int, default=11)
    p.add_argument("--save-blend", default="", help="save the animated scene here (debug)")
    a = p.parse_args(argv)
    fr = set()
    for part in a.frames.split(","):
        part = part.strip()
        if "-" in part:
            lo, hi = part.split("-")
            fr.update(range(int(lo), int(hi) + 1))
        elif part:
            fr.add(int(part))
    a.frames = sorted(f for f in fr if 0 <= f < NF)
    a.sun_az, a.sun_el = vr.SUN_AZ, vr.SUN_EL
    return a


# ---------------------------------------------------------------------------
# Scene: classification, empties, camera
# ---------------------------------------------------------------------------
def piece_key(name):
    """'Cama Individual 1 almohada 1' -> 'Cama Individual 1'; 'Olivo follaje' -> 'Olivo'."""
    out = []
    for t in vr.base_name(name).split():
        if out and t[0].islower():
            break
        out.append(t)
    return " ".join(out)


def world_bbox(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx


def make_empty(name, loc):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = "PLAIN_AXES"
    e.empty_display_size = 0.2
    e.location = loc
    bpy.context.scene.collection.objects.link(e)
    bpy.context.view_layer.update()
    return e


def adopt(children, parent):
    inv = parent.matrix_world.inverted()
    for o in children:
        o.parent = parent
        o.matrix_parent_inverse = inv


def build_rig(cols):
    """Sort the model into floors / walls / furniture pieces and put the moving ones under empties."""
    col_base, col_alto, col_corte = cols
    walls, floors, pieces = [], [], {}
    for coll in (col_base, col_corte):
        for o in coll.objects:
            if o.type != "MESH":
                continue
            name = vr.base_name(o.get("nombre_original", o.name))
            layer = vd.layer_of(o)
            if re.split(r"[ _.]", name)[0] == "Peldano":   # steps below the slab: they stay with the floors
                layer = 1
            if layer == 1:
                floors.append(o)
            elif layer == 2:
                walls.append(o)
            else:
                pieces.setdefault(piece_key(name), []).append(o)
    log("rig: floors %d, wall-layer objects %d, furniture parts %d in %d pieces"
        % (len(floors), len(walls), sum(len(v) for v in pieces.values()), len(pieces)))

    wall_empty = make_empty("HERO_muros", (0.0, 0.0, 0.0))
    adopt(walls, wall_empty)

    # rooms = bounding rectangles of the floor slabs, grouped into ZONES
    rects = []
    for o in floors:
        n = vr.base_name(o.get("nombre_original", o.name))
        if not n.startswith("Suelo"):
            continue
        for zi, z in enumerate(ZONES):
            if any(k in n for k in z[3]):
                mn, mx = world_bbox([o])
                rects.append((zi, mn.x, mn.y, mx.x, mx.y))

    def zone_of(x, y):
        best, bd = 0, 1e9
        for zi, x0, y0, x1, y1 in rects:
            d = math.hypot(max(x0 - x, 0.0, x - x1), max(y0 - y, 0.0, y - y1))
            if d < bd:
                best, bd = zi, d
        return best

    groups = []
    for key, objs in pieces.items():
        mn, mx = world_bbox(objs)
        piv = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
        size = (mx.x - mn.x) * (mx.y - mn.y) + 0.05 * (mx.z - mn.z)
        e = make_empty("HERO_" + key, piv)
        adopt(objs, e)
        groups.append(dict(key=key, objs=objs, empty=e, zone=zone_of(piv.x, piv.y), size=size, pivot=tuple(piv)))

    nz = len(ZONES)
    step = (T_FURN[1] - T_FURN[0] - FURN_DUR - FURN_SPREAD) / (nz - 1)
    for zi in range(nz):
        zg = sorted([g for g in groups if g["zone"] == zi], key=lambda g: -g["size"])
        for r, g in enumerate(zg):
            g["start"] = T_FURN[0] + zi * step + (FURN_SPREAD * r / max(len(zg) - 1, 1))
    per_zone = [sum(1 for g in groups if g["zone"] == zi) for zi in range(nz)]
    log("furniture pieces per room:", dict(zip([z[0] for z in ZONES], per_zone)))
    return wall_empty, groups


class CamPath:
    """Near-orthographic top-down (north up) -> exact hero camera, as a dolly-zoom."""

    def __init__(self, hero_cam, res_x):
        self.hero = hero_cam
        self.t1 = Vector(hero_cam["target"])
        self.t0 = Vector((self.t1.x, self.t1.y, 0.0))
        rel = hero_cam.location - self.t1
        self.D1 = rel.length
        self.az1 = math.degrees(math.atan2(rel.x, rel.y)) % 360.0
        self.el1 = math.degrees(math.asin(rel.z / self.D1))
        self.lens1 = hero_cam.data.lens
        self.sx1, self.sy1 = hero_cam.data.shift_x, hero_cam.data.shift_y
        self.sensor = hero_cam.data.sensor_width
        self.s1 = self.lens1 * res_x / self.sensor / self.D1      # px per metre at the target plane
        log("hero cam: D %.3f m az %.2f el %.2f lens %.1f shift (%.4f, %.4f) scale %.1f px/m"
            % (self.D1, self.az1, self.el1, self.lens1, self.sx1, self.sy1, self.s1))
        # the closed form below must reproduce the hero camera's rotation
        rx, rz = math.radians(90.0 - self.el1), math.radians(180.0 - self.az1)
        e = hero_cam.rotation_euler
        assert abs(e.x - rx) < 1e-5 and abs(e.y) < 1e-6 and abs(e.z - rz) < 1e-5, (tuple(e), rx, rz)

    def u(self, f):
        return smootherstep(ramp(f, *T_CAM))

    def at(self, f):
        u = self.u(f)
        if u >= 1.0:
            h = self.hero
            return dict(loc=h.location.copy(), rot=h.rotation_euler.copy(), lens=self.lens1,
                        sx=self.sx1, sy=self.sy1, u=1.0, D=self.D1, az=self.az1, el=self.el1)
        az = lerp(180.0, self.az1, u)
        el = lerp(90.0, self.el1, u)
        ud = u ** DOLLY_POW
        D = math.exp(lerp(math.log(D_TOP), math.log(self.D1), ud))
        s = math.exp(lerp(math.log(S_TOP), math.log(self.s1), u))
        lens = s * D * self.sensor / RES[0]
        tgt = self.t0.lerp(self.t1, u)
        a, e = math.radians(az), math.radians(el)
        d = Vector((math.sin(a) * math.cos(e), math.cos(a) * math.cos(e), math.sin(e)))
        rot = (math.radians(90.0 - el), 0.0, math.radians(180.0 - az))
        return dict(loc=tgt + d * D, rot=rot, lens=lens, sx=self.sx1 * u, sy=self.sy1 * u, u=u, D=D, az=az, el=el)


def make_anim_camera(scene, path):
    cd = bpy.data.cameras.new("CAM_hero_anim")
    cd.sensor_width = path.sensor
    cd.sensor_fit = "AUTO"
    cd.clip_start = 0.1
    cd.clip_end = 6000.0
    cam = bpy.data.objects.new("CAM_hero_anim", cd)
    cam.rotation_mode = "XYZ"
    scene.collection.objects.link(cam)
    return cam


def set_camera(cam, p):
    cam.location = p["loc"]
    cam.rotation_euler = p["rot"]
    cam.data.lens = p["lens"]
    cam.data.shift_x = p["sx"]
    cam.data.shift_y = p["sy"]


# ---------------------------------------------------------------------------
# Per-frame state
# ---------------------------------------------------------------------------
def wall_scale(f):
    """Ease-out (power 1.7): most of the rise happens while the camera starts to tilt, so it is readable."""
    return lerp(WALL_MIN, 1.0, 1.0 - (1.0 - ramp(f, *T_WALL)) ** WALL_EASE)


def furn_scale(g, f):
    p = (f - g["start"]) / FURN_DUR
    return 0.0 if p <= 0.0 else ease_out_quad(p)


def sun_state(f):
    w = smoothstep(ramp(f, *T_LIGHT))
    return dict(az=lerp(SUN0["az"], SUN1["az"], w), el=lerp(SUN0["el"], SUN1["el"], w),
                energy=lerp(SUN0["energy"], SUN1["energy"], w),
                color=tuple(lerp(a, b, w) for a, b in zip(SUN0["color"], SUN1["color"])), w=w)


def apply_state(f, rig, cam, path, sun, lines=False):
    """Everything that changes with the frame number. lines=True: frame-0 walls, furniture at full size."""
    wall_empty, groups = rig
    ff = 0 if lines else f
    s = wall_scale(ff)
    wall_empty.scale = (1.0, 1.0, s)
    for g in groups:
        p = 1.0 if lines else furn_scale(g, ff)
        hidden = p < 0.01
        q = max(p, 0.01)
        g["empty"].scale = (q, q, q)
        for o in g["objs"]:
            o.hide_render = hidden
    set_camera(cam, path.at(ff))
    st = sun_state(ff)
    vr.aim_sun(sun, st["az"], st["el"])
    sun.data.energy = st["energy"]
    sun.data.color = st["color"]
    bpy.context.view_layer.update()
    return s, st


def project_points(scene, cam, s_wall):
    x0, y0, x1, y1 = BBOX

    def uv(x, y, z):
        v = world_to_camera_view(scene, cam, Vector((x, y, z)))
        return [round(v.x, 5), round(1.0 - v.y, 5)]

    return dict(
        corners=[uv(x0, y1, 0.0), uv(x1, y1, 0.0), uv(x1, y0, 0.0), uv(x0, y0, 0.0)],   # NW, NE, SE, SW
        wallTop=dict(ne=uv(x1, y1, PARAPET_TOP * s_wall), sw=uv(x0, y0, PARAPET_TOP * s_wall),
                     heightM=round(PARAPET_TOP * s_wall, 4)),
        cut=dict(ne=uv(x1, y1, CUT * s_wall), sw=uv(x0, y0, CUT * s_wall), heightM=round(CUT * s_wall, 4)),
    )


# ---------------------------------------------------------------------------
# Render helpers
# ---------------------------------------------------------------------------
def setup_cycles(args):
    scene = bpy.context.scene
    c = scene.cycles
    c.samples = args.samples
    c.use_adaptive_sampling = True
    c.adaptive_threshold = args.threshold
    c.adaptive_min_samples = 48
    c.seed = args.seed
    c.use_animated_seed = False          # same noise pattern every frame: no shimmer on static areas
    c.use_denoising = True
    c.denoiser = "OPENIMAGEDENOISE"
    try:
        c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
        c.denoising_prefilter = "ACCURATE"
        c.denoising_quality = "HIGH"
        c.denoising_use_gpu = True
    except Exception as e:  # noqa
        log("denoise options:", e)
    scene.render.film_transparent = True
    scene.render.filter_size = 1.5
    scene.render.use_persistent_data = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 25


def set_resolution(scene, ss, pct=100):
    scene.render.resolution_x = RES[0] * ss
    scene.render.resolution_y = RES[1] * ss
    scene.render.resolution_percentage = pct


def load_rgba(path):
    img = bpy.data.images.load(path, check_existing=False)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4), w, h


def save_rgba(arr, path):
    h, w = arr.shape[:2]
    o = bpy.data.images.new("hero_tmp", w, h, alpha=True, float_buffer=False)
    o.alpha_mode = "STRAIGHT"
    o.pixels.foreach_set(np.clip(arr, 0.0, 1.0).astype(np.float32).ravel())
    o.filepath_raw = path
    o.file_format = "PNG"
    o.save()
    bpy.data.images.remove(o)


def box_down(path_in, path_out, k):
    """k x k box filter on premultiplied RGBA (edges and shadows stay clean)."""
    a, w, h = load_rgba(path_in)
    al = a[:, :, 3:4]
    pm = np.concatenate([a[:, :, :3] * al, al], axis=2)
    pm = pm.reshape(h // k, k, w // k, k, 4).mean(axis=(1, 3))
    alpha = pm[:, :, 3:4]
    rgb = np.where(alpha > 1e-6, pm[:, :, :3] / np.maximum(alpha, 1e-6), 0.0)
    save_rgba(np.concatenate([rgb, alpha], axis=2), path_out)


def render_to(path):
    scene = bpy.context.scene
    scene.render.filepath = path
    t = time.time()
    bpy.ops.render.render(write_still=True)
    return time.time() - t


def alpha_stats(path):
    a, w, h = load_rgba(path)
    al = a[:, :, 3]
    vis = a[al > 0.9, :3]
    res = {"alpha_cover": round(float((al > 0.5).mean()), 4)}
    if len(vis):
        lum = vis @ np.array([0.2126, 0.7152, 0.0722])
        res.update(mean=round(float(lum.mean()), 4), clip=round(float((vis.max(axis=1) > 0.995).mean()), 6))
    return res


# ---------------------------------------------------------------------------
def main():
    args = parse_args()
    t_all = time.time()
    vr_args = SimpleNamespace(sun_az=args.sun_az, sun_el=args.sun_el, scale=100)
    cols, ground, sun, cams = vr.build(vr_args)
    scene = bpy.context.scene
    hero_cam = cams[HERO]
    rig = build_rig(cols)
    path = CamPath(hero_cam, RES[0])
    cam = make_anim_camera(scene, path)
    scene.camera = cam
    setup_cycles(args)
    set_resolution(scene, args.ss, args.scale)
    os.makedirs(args.outdir, exist_ok=True)

    tpath = os.path.join(args.outdir, "_timings.json")
    timings = {}
    if os.path.exists(tpath):
        try:
            timings = json.load(open(tpath))
        except Exception:
            timings = {}

    if args.save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.save_blend, compress=True)

    # ---- projected points + timeline for all 48 frames (cheap) --------------------------------
    vr.set_mode("maqueta", cols, ground, sun)
    scene.render.resolution_percentage = 100
    scene.render.resolution_x, scene.render.resolution_y = RES
    frames_meta = []
    for f in range(NF):
        s_wall, st = apply_state(f, rig, cam, path, sun)
        pt = project_points(scene, cam, s_wall)
        cp = path.at(f)
        frames_meta.append(dict(f=f, wallScale=round(s_wall, 4), u=round(cp["u"], 4), lensMm=round(cp["lens"], 1),
                                distM=round(cp["D"], 2), azDeg=round(cp["az"], 2), elDeg=round(cp["el"], 2),
                                sunAz=round(st["az"], 2), sunEl=round(st["el"], 2), sunW=round(st["w"], 4),
                                furniture=round(sum(1 for g in rig[1] if furn_scale(g, f) > 0.0) / len(rig[1]), 3),
                                **pt))
    set_resolution(scene, args.ss, args.scale)
    meta = dict(
        frames=NF, fps=FPS, width=RES[0], height=RES[1], aspect="14:9", finalMatches=HERO,
        cornerOrder=["NW", "NE", "SE", "SW"], footprintMeters=dict(
            width=round(BBOX[2] - BBOX[0], 2), depth=round(BBOX[3] - BBOX[1], 2), bbox=list(BBOX),
            note="outer face of the masonry; with the 3 cm coping on the S/W/N parapets the extent is 9.15 x 14.10 m"),
        timeline=dict(walls=list(T_WALL), camera=list(T_CAM), furniture=list(T_FURN), light=list(T_LIGHT)),
        camera=dict(topScalePxPerM=S_TOP, topDistanceM=D_TOP, topLensMm=round(path.at(0)["lens"], 1),
                    heroDistanceM=round(path.D1, 3), heroLensMm=path.lens1, heroAzDeg=round(path.az1, 2),
                    heroElDeg=round(path.el1, 2), heroShift=[round(path.sx1, 5), round(path.sy1, 5)]),
        sun=dict(start=SUN0, end=SUN1),
        rooms=[dict(id=z[0], es=z[1], en=z[2]) for z in ZONES],
        pieces=[dict(key=g["key"], room=ZONES[g["zone"]][0], start=round(g["start"], 2)) for g in
                sorted(rig[1], key=lambda g: g["start"])],
        points=frames_meta,
    )
    json.dump(meta, open(os.path.join(args.outdir, "hero_points.json"), "w"), indent=1, ensure_ascii=False)
    log("points written for", NF, "frames")
    if args.points_only:
        return

    # ---- frames ------------------------------------------------------------------------------
    todo = [] if args.lines_only else args.frames
    # frames 0-5 are identical (nothing changes before the walls start): render f0 once, copy it
    static_last = int(T_WALL[0])
    done_static = None
    for f in todo:
        out = os.path.join(args.outdir, "hero_%03d.png" % f)
        if f <= static_last and done_static and os.path.exists(done_static):
            with open(done_static, "rb") as src, open(out, "wb") as dst:
                dst.write(src.read())
            log("frame %d = copy of frame 0" % f)
            continue
        vr.set_mode("maqueta", cols, ground, sun)
        setup_cycles(args)
        set_resolution(scene, args.ss, args.scale)
        s_wall, st = apply_state(f, rig, cam, path, sun)
        raw = out if args.ss == 1 else os.path.join(args.outdir, "_raw_%03d.png" % f)
        dt = render_to(raw)
        if args.ss > 1:
            box_down(raw, out, args.ss)
            os.remove(raw)
        if f == 0:
            done_static = out
        stt = alpha_stats(out)
        log("frame %02d  walls %.3f  lens %6.0f mm  sun %.0f/%.0f  %.1fs  %s" %
            (f, s_wall, path.at(f)["lens"], st["az"], st["el"], dt, stt))
        timings["hero_%03d" % f] = dict(seconds=round(dt, 1), samples=args.samples, ss=args.ss, **stt)
        json.dump(timings, open(tpath, "w"), indent=0)

    # ---- line drawing from exactly the frame-0 camera ----------------------------------------------
    if not args.no_lines:
        k = args.lines_ss
        vr.set_mode("lineas", cols, ground, sun)
        scene.cycles.samples = 24
        scene.cycles.seed = args.seed
        set_resolution(scene, k, args.scale)
        apply_state(0, rig, cam, path, sun, lines=True)
        bpy.context.view_layer.freestyle_settings.linesets[0].linestyle.thickness = args.lines_thickness
        raw = os.path.join(args.outdir, "_raw_plan_lines.png")
        dt = render_to(raw)
        out = os.path.join(args.outdir, "hero_plan_lines.png")
        box_down(raw, out, k)
        os.remove(raw)
        log("plan lines %.1fs (%dx supersampled)" % (dt, k))
        timings["hero_plan_lines"] = dict(seconds=round(dt, 1), ss=k)
        json.dump(timings, open(tpath, "w"), indent=0)

    log("total %.1fs" % (time.time() - t_all))


if __name__ == "__main__":
    main()
