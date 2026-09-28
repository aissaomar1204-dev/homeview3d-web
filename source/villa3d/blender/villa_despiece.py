"""
villa_despiece.py - Exploded-view ("despiece") layers for the home/process pages.

Three pixel-registered RGBA layers rendered from the hero camera (CAM_villa_maqueta_iso, same sun,
sky, AgX look and shadow catcher as villa_maqueta_iso.png), at 1600x1030:

  villa_despiece_1.png  floor slabs + display base + the wall footprint drawn as poche on the floor
                        (the 2D plan on the slab), plus the whole model's shadow on the ground
  villa_despiece_2.png  walls, partitions, parapets, stairs, doors and windows, cut at 1.15 m
                        (with the dark section caps)
  villa_despiece_3.png  furniture, bathroom fittings, built-in wardrobes, decor and plants

How the layers stay "the same picture" (stack 1+2+3 with normal "over" = the hero render):
  - layer 1: floors visible; walls invisible to the camera but still cast their sun shadows on the floors
    (under-wall darkness is covered by the footprint poche); furniture fully excluded, so the floor has
    no black blotches under beds and sofas when the stack is exploded.
  - layer 2: walls visible; floors are holdouts (occlude, alpha 0); furniture is invisible to the camera
    but still shades the walls.
  - layer 3: two passes merged with numpy. 3a = furniture colour, floors and walls as holdouts (they still
    shade it). 3b = floors as shadow catchers, furniture invisible but casting shadows, walls camera-only
    holdouts; its alpha becomes pure black shadow. Layer 3 = 3a over 3b, so the furniture carries its own
    soft shadows (clean when the stack is exploded) and lands them on the floor of layer 1.

Usage (PowerShell):
  $B = "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe"
  & $B -b --factory-startup -P villa_despiece.py -- [--scale 100] [--samples 512] [--outdir ..\\renders]
Then: node scripts/images.mjs
"""
import bpy
import os
import re
import sys
import time
import json
import argparse

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import villa_render as vr  # noqa: E402  (reuses the scene builder: import, materials, sky, sun, ground, cameras)

RES = (1600, 1030)
HERO = "villa_maqueta_iso"
FOOTPRINT_Z = 0.004  # metres above the finished floor

# Object-name prefixes (original glTF node names) per layer; everything else is layer 3.
LAYER1 = {"Suelo", "Base", "Fondo"}
LAYER2 = {"Muro", "Tabique", "Patinillo", "Alicatado", "Peto", "Columna", "Murete", "Peldano", "Caracol",
          "Rodapies", "Mampara"}


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--scale", type=int, default=100)
    p.add_argument("--samples", type=int, default=512)
    p.add_argument("--outdir", default=vr.DEFAULT_OUT)
    p.add_argument("--only", default="", help="e.g. 1,3")
    a = p.parse_args(argv)
    a.sun_az, a.sun_el = vr.SUN_AZ, vr.SUN_EL
    return a


def layer_of(o):
    name = vr.base_name(o.get("nombre_original", o.name))
    prefix = re.split(r"[ _.]", name)[0]
    if prefix in LAYER1:
        return 1
    if prefix in LAYER2:
        return 2
    return 3


def make_footprint(col_corte):
    """Copy the wall section caps (poche at the 1.15 m cut) down onto the floor: the 2D plan on the slab."""
    scene = bpy.context.scene
    col = bpy.data.collections.new("Despiece huella")
    scene.collection.children.link(col)
    n = 0
    for o in list(col_corte.objects):
        if not vr.is_wall_cap(o):
            continue
        zmax = max((o.matrix_world @ v.co).z for v in o.data.vertices) if len(o.data.vertices) else 0.0
        d = o.copy()  # shares the mesh; only the object transform changes
        d.name = "Huella " + o.name
        d.location.z += FOOTPRINT_Z - zmax
        d["rol"] = "huella"
        d.is_holdout = False
        d.visible_shadow = False
        d.visible_diffuse = False
        d.visible_glossy = False
        d.visible_transmission = False
        d.visible_volume_scatter = False
        col.objects.link(d)
        n += 1
    vr.log("despiece: footprint caps", n)
    return col


RAYS = ("visible_camera", "visible_shadow", "visible_diffuse", "visible_glossy", "visible_transmission",
        "visible_volume_scatter")


def set_rays(o, **kw):
    for r in RAYS:
        setattr(o, r, kw.get(r, True))


def apply_layer(L, cols, ground, foot_col):
    """L = 1, 2, "3a" (furniture colour) or "3b" (furniture shadows on the floor, shadow-catcher pass)."""
    col_base, col_alto, col_corte = cols
    counts = {1: 0, 2: 0, 3: 0}
    for coll in (col_base, col_corte):
        for o in coll.objects:
            if o.type != "MESH":
                continue
            k = layer_of(o)
            counts[k] += 1
            o.hide_render = False
            o.is_holdout = False
            o.is_shadow_catcher = False
            set_rays(o)
            if L == 1:
                if k == 2:
                    o.visible_camera = False           # casts its shadow on the floor, not seen
                elif k == 3:
                    o.hide_render = True               # no furniture: no dark blotches under it
            elif L == 2:
                if k == 1:
                    o.is_holdout = True
                elif k == 3:
                    o.visible_camera = False           # still shades the walls
            elif L == "3a":
                if k in (1, 2):
                    o.is_holdout = True                # occlude + keep shading the furniture (wall shadows)
            else:  # "3b"
                if k == 1:
                    o.is_shadow_catcher = True
                elif k == 2:                           # camera occluder only: its own shadows are in layer 1
                    o.is_holdout = True
                    set_rays(o, visible_shadow=False, visible_diffuse=False, visible_glossy=False,
                             visible_transmission=False, visible_volume_scatter=False)
                else:                                  # furniture: casts shadows, never seen or reflected
                    set_rays(o, visible_camera=False, visible_glossy=False, visible_transmission=False)
    for o in foot_col.objects:
        o.hide_render = L != 1
    ground.visible_camera = L == 1
    return counts


def load_rgba(path):
    img = bpy.data.images.load(path, check_existing=False)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4), w, h


def save_rgba(arr, w, h, path):
    o = bpy.data.images.new("despiece_tmp", w, h, alpha=True, float_buffer=False)
    o.alpha_mode = "STRAIGHT"
    o.pixels.foreach_set(np.clip(arr, 0.0, 1.0).astype(np.float32).ravel())
    o.filepath_raw = path
    o.file_format = "PNG"
    o.save()
    bpy.data.images.remove(o)


def merge_furniture(path_a, path_b, out):
    """Layer 3 = furniture colour (3a) over its shadows turned into pure black + alpha (3b)."""
    a, w, h = load_rgba(path_a)
    b, _, _ = load_rgba(path_b)
    at = a[:, :, 3:4]
    ab = b[:, :, 3:4]
    oa = at + ab * (1.0 - at)
    rgb = np.where(oa > 1e-6, a[:, :, :3] * at / np.maximum(oa, 1e-6), 0.0)
    save_rgba(np.concatenate([rgb, oa], axis=2), w, h, out)


def main():
    args = parse_args()
    t0 = time.time()
    cols, ground, sun, cams = vr.build(args)
    scene = bpy.context.scene
    foot_col = make_footprint(cols[2])

    vr.set_mode("maqueta", cols, ground, sun)
    vr.aim_sun(sun, vr.SUN_AZ, vr.SUN_EL)
    scene.camera = cams[HERO]
    scene.render.resolution_x, scene.render.resolution_y = RES
    scene.render.resolution_percentage = args.scale
    scene.cycles.samples = args.samples
    os.makedirs(args.outdir, exist_ok=True)

    only = {int(s) for s in args.only.split(",") if s}
    timings = {}
    tpath = os.path.join(args.outdir, "_timings.json")
    if os.path.exists(tpath):
        try:
            timings = json.load(open(tpath))
        except Exception:
            timings = {}

    def render(L, out):
        counts = apply_layer(L, cols, ground, foot_col)
        scene.render.filepath = out
        vr.log("rendering layer", L, RES, "samples", scene.cycles.samples, "objects per layer", counts)
        t = time.time()
        bpy.ops.render.render(write_still=True)
        return time.time() - t

    for L in (1, 2, 3):
        if only and L not in only:
            continue
        name = "villa_despiece_%d" % L
        out = os.path.join(args.outdir, name + ".png")
        if L < 3:
            dt = render(L, out)
        else:
            tmp_a = os.path.join(args.outdir, "_despiece_3a.png")
            tmp_b = os.path.join(args.outdir, "_despiece_3b.png")
            dt = render("3a", tmp_a) + render("3b", tmp_b)
            merge_furniture(tmp_a, tmp_b, out)
            os.remove(tmp_a)
            os.remove(tmp_b)
        st = vr.stats(out)
        vr.log("done %s in %.1fs %s" % (name, dt, st))
        timings[name] = {"seconds": round(dt, 1), "scale": args.scale, "samples": scene.cycles.samples, **st}
        json.dump(timings, open(tpath, "w"), indent=1)
    vr.log("despiece total %.1fs" % (time.time() - t0))


if __name__ == "__main__":
    main()
