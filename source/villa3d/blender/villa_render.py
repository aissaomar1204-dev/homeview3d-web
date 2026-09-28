"""
villa_render.py - Render set for the website (villa en la Costa del Sol, planta alta).

Builds the scene from the glTF copy in ./import, sets up Cycles (GPU OptiX),
a late-afternoon Mediterranean sun + physical sky, a shadow-catcher ground,
one camera per shot, and renders every shot to ../renders/.

Usage (see README.md):
  blender -b --factory-startup -P villa_render.py -- [options]

Options:
  --only a,b,c      render only these shots (names without .png)
  --scale N         resolution percentage (default 100) - use 25..50 for previews
  --samples N       override samples for every shot
  --outdir PATH     output folder (default ../renders)
  --save-blend      save villa_renders.blend (scene with all cameras) and exit if --no-render
  --no-render       build the scene only
"""
import bpy
import os
import sys
import math
import time
import json
import argparse

import numpy as np
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
VILLA = os.path.dirname(HERE)
GLTF = os.path.join(HERE, "import", "villa.gltf")
BLEND = os.path.join(HERE, "villa_renders.blend")
DEFAULT_OUT = os.path.join(VILLA, "renders")

# Seamless background for the opaque variants (sRGB 8-bit). Historical default: warm off-white #EFEBE4.
# The website uses the cool-grey stage token instead (--bg E4E7EA); scripts/images.mjs rebuilds the
# *_opaco plates from the RGBA renders over --color-stage anyway, so this only matters for og_image.
BG_SRGB = (0xEF, 0xEB, 0xE4)

# Base of the maqueta block (the "Base Maqueta" object goes from z=-0.60 to -0.02)
GROUND_Z = -0.601

# ---------------------------------------------------------------------------
# Shots. Coordinates are plan metres (x east, y north), z up (floor = 0).
# az = compass azimuth of the CAMERA seen from the target (0=N, 90=E, 180=S, 270=W)
# el = elevation of the camera above the horizon, degrees
# box = region (x0, y0, x1, y1, z0, z1) that must fit in the frame
# ---------------------------------------------------------------------------
FOOT = (-0.03, -0.03, 9.13, 14.08, -0.60, 1.15)
SHOTS = {
    "villa_maqueta_iso": dict(
        res=(2800, 1800), mode="maqueta", kind="persp", az=212.0, el=42.0, lens=50,
        box=FOOT, margin=0.06, samples=512, dof=None, opaque=True),
    "villa_planta_cenital": dict(
        res=(2400, 3700), mode="maqueta", kind="top", samples=512, opaque=True, sun=(292.0, 50.0)),
    "villa_plano_lineas": dict(
        res=(2400, 3700), mode="lineas", kind="top", samples=32, opaque=False),
    "villa_salon_dormitorio": dict(
        res=(2400, 1600), mode="maqueta", kind="persp", az=255.0, el=47.0, lens=40,
        box=(3.2, 1.9, 7.6, 8.45, 0.0, 0.9), margin=0.035, samples=384, dof=2.8, opaque=True,
        sun=(292.0, 50.0)),
    "villa_dormitorios": dict(
        res=(2400, 1600), mode="maqueta", kind="persp", az=190.0, el=50.0, lens=40,
        box=(0.1, 8.5, 9.0, 14.07, 0.0, 1.5), margin=0.02, samples=384, dof=2.8, opaque=True,
        sun=(292.0, 50.0)),
    "villa_bano_suite": dict(
        res=(2000, 1600), mode="maqueta", kind="persp", az=62.0, el=56.0, lens=50,
        box=(3.2, 0.2, 6.4, 1.8, 0.0, 1.0), margin=0.04, samples=384, dof=2.8, opaque=True,
        sun=(292.0, 52.0)),
    "villa_terraza": dict(
        res=(2400, 1600), mode="maqueta", kind="persp", az=238.0, el=48.0, lens=40,
        box=(0.0, 0.0, 3.3, 8.5, 0.0, 2.0), margin=0.03, samples=384, dof=2.8, opaque=True,
        sun=(292.0, 50.0)),
    "villa_muros_completos": dict(
        res=(2800, 1800), mode="full", kind="persp", az=228.0, el=32.0, lens=50,
        box=(-0.03, -0.03, 9.13, 14.08, -0.60, 2.60), margin=0.06, samples=512, dof=None, opaque=True),
    "og_image": dict(
        res=(1200, 630), mode="maqueta", kind="persp", az=262.0, el=34.0, lens=50,
        box=(0.0, 0.0, 9.1, 14.07, 0.0, 2.2), margin=0.03, samples=512, dof=None, opaque=True,
        only_opaque=True, sun=(215.0, 38.0)),
}
ORDER = ["villa_maqueta_iso", "villa_planta_cenital", "villa_salon_dormitorio", "villa_dormitorios",
         "villa_bano_suite", "villa_terraza", "og_image", "villa_muros_completos", "villa_plano_lineas"]

# Late-afternoon sun (Marbella, early autumn ~18:30): WSW-W, fairly low
SUN_AZ = 292.0
SUN_EL = 38.0


def log(*a):
    print("[villa]", *a, flush=True)


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--only", default="")
    p.add_argument("--scale", type=int, default=100)
    p.add_argument("--samples", type=int, default=0)
    p.add_argument("--outdir", default=DEFAULT_OUT)
    p.add_argument("--save-blend", action="store_true")
    p.add_argument("--no-render", action="store_true")
    p.add_argument("--sun-az", type=float, default=SUN_AZ)
    p.add_argument("--sun-el", type=float, default=SUN_EL)
    p.add_argument("--force-sun", default="", help="az,el applied to every shot (testing)")
    p.add_argument("--bg", default="", help="RRGGBB background for the opaque composites (default EFEBE4)")
    return p.parse_args(argv)


def base_name(mat_name):
    """Material name without Blender's .001 suffix."""
    if len(mat_name) > 4 and mat_name[-4] == "." and mat_name[-3:].isdigit():
        return mat_name[:-4]
    return mat_name


def srgb_to_linear(c):
    c = c / 255.0 if c > 1.0 else c
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


# ---------------------------------------------------------------------------
# Scene construction
# ---------------------------------------------------------------------------
def import_model():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=GLTF)
    scene = bpy.context.scene
    meshes = [o for o in scene.objects if o.type == "MESH"]
    log("imported", len(meshes), "mesh objects")

    for o in meshes:
        o["nombre_original"] = o.name
    # Split multi-material objects so every object has a single role
    multi = [o for o in meshes if len(o.data.materials) > 1]
    if multi:
        bpy.ops.object.select_all(action="DESELECT")
        for o in multi:
            o.select_set(True)
        bpy.context.view_layer.objects.active = multi[0]
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.mesh.separate(type="MATERIAL")
        bpy.ops.object.mode_set(mode="OBJECT")
        bpy.ops.object.select_all(action="DESELECT")

    col_base = bpy.data.collections.new("Maqueta")
    col_alto = bpy.data.collections.new("Alto (sobre 1,15 m)")
    col_corte = bpy.data.collections.new("Corte seccion")
    for c in (col_base, col_alto, col_corte):
        scene.collection.children.link(c)

    counts = {"base": 0, "alto": 0, "corte": 0}
    for o in [o for o in scene.objects if o.type == "MESH"]:
        me = o.data
        # material actually used by the faces
        idx = me.polygons[0].material_index if len(me.polygons) else 0
        mat = me.materials[idx] if len(me.materials) > idx else None
        name = base_name(mat.name) if mat else ""
        if name.endswith("_Alto"):
            role, col = "alto", col_alto
        elif name == "Corte_Seccion":
            role, col = "corte", col_corte
        else:
            role, col = "base", col_base
        o["rol"] = role
        o["material_base"] = name
        counts[role] += 1
        for uc in list(o.users_collection):
            uc.objects.unlink(o)
        col.objects.link(o)
    log("roles", counts)
    return col_base, col_alto, col_corte


def tune_materials():
    """Small physically-motivated tweaks on top of the glTF materials."""
    for m in bpy.data.materials:
        if not m.node_tree:
            continue
        name = base_name(m.name).replace("_Alto", "")
        bsdf = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf is None:
            continue
        # Glass: real transmission instead of alpha blending (thin panes -> thin-walled look)
        if name in ("Vidrio", "Vidrio_Ducha"):
            for l in list(bsdf.inputs["Alpha"].links):
                m.node_tree.links.remove(l)
            bsdf.inputs["Alpha"].default_value = 1.0
            bsdf.inputs["Transmission Weight"].default_value = 1.0
            bsdf.inputs["Roughness"].default_value = 0.02
            bsdf.inputs["IOR"].default_value = 1.05  # thin pane: avoid heavy refraction offset
            col = bsdf.inputs["Base Color"].default_value
            tint = (0.93, 0.97, 0.97, 1.0) if name == "Vidrio" else (0.86, 0.93, 0.93, 1.0)
            bsdf.inputs["Base Color"].default_value = tint
        # Mirrors: make sure they are metallic mirrors
        if name == "Espejo":
            bsdf.inputs["Metallic"].default_value = 1.0
            bsdf.inputs["Roughness"].default_value = 0.02
        # Base block: satin dark grey, a bit lifted so it is not a black hole
        if name == "Base_Maqueta":
            bsdf.inputs["Base Color"].default_value = (0.085, 0.085, 0.09, 1.0)
            bsdf.inputs["Roughness"].default_value = 0.55
        # Section cut (poche): matte, near black but not pure black
        if name == "Corte_Seccion":
            bsdf.inputs["Base Color"].default_value = (0.035, 0.035, 0.038, 1.0)
            bsdf.inputs["Roughness"].default_value = 0.9
        # Plants: a touch of subsurface/transmission for backlit leaves
        if name in ("Hoja_Verde", "Hoja_Verde_Clara", "Hoja_Olivo"):
            try:
                bsdf.inputs["Subsurface Weight"].default_value = 0.0
                bsdf.inputs["Transmission Weight"].default_value = 0.0
                bsdf.inputs["Sheen Weight"].default_value = 0.15
            except KeyError:
                pass


def check_textures():
    bad = []
    for img in bpy.data.images:
        if img.source == "FILE":
            if not img.has_data:
                try:
                    img.reload()
                except Exception:
                    pass
            if img.size[0] == 0:
                bad.append(img.name)
    if bad:
        log("WARNING missing textures:", bad)
    else:
        log("textures OK:", sum(1 for i in bpy.data.images if i.source == "FILE"))
    return bad


def setup_world(sun_az, sun_el):
    scene = bpy.context.scene
    world = bpy.data.worlds.new("Cielo_Mediterraneo")
    scene.world = world
    try:
        world.use_nodes = True
    except Exception:
        pass
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_disc = False
    sky.sun_elevation = math.radians(sun_el)
    sky.sun_rotation = math.radians(-sun_az) % (2 * math.pi)
    sky.altitude = 100.0
    sky.air_density = 1.0
    sky.aerosol_density = 1.5
    # slightly desaturate / warm the sky fill so white walls do not turn blue
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Saturation"].default_value = 0.55
    hsv.inputs["Value"].default_value = 1.0
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    inp = {s.identifier: s for s in mix.inputs}
    outp = {s.identifier: s for s in mix.outputs}
    inp["B_Color"].default_value = (1.0, 0.93, 0.85, 1.0)
    nt.links.new(sky.outputs["Color"], hsv.inputs["Color"])
    nt.links.new(hsv.outputs["Color"], inp["A_Color"])
    nt.links.new(outp["Result_Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.16
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    world["sky_node"] = sky.name
    world["bg_node"] = bg.name

    # Sun lamp (warm, soft)
    sun_data = bpy.data.lights.new("Sol_Tarde", type="SUN")
    sun_data.energy = 4.2
    sun_data.angle = math.radians(1.6)
    sun_data.color = (1.0, 0.80, 0.60)
    sun = bpy.data.objects.new("Sol_Tarde", sun_data)
    scene.collection.objects.link(sun)
    aim_sun(sun, sun_az, sun_el)
    return sun


def aim_sun(sun, az, el):
    d = Vector((math.sin(math.radians(az)) * math.cos(math.radians(el)),
                math.cos(math.radians(az)) * math.cos(math.radians(el)),
                math.sin(math.radians(el))))
    # light travels along -d; lamp -Z axis must point along -d
    sun.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    twin = bpy.data.objects.get("Sol_Tarde_Suelo")
    if twin:
        twin.rotation_euler = sun.rotation_euler
    w = bpy.context.scene.world
    if w and "sky_node" in w:
        sky = w.node_tree.nodes[w["sky_node"]]
        sky.sun_elevation = math.radians(el)
        sky.sun_rotation = math.radians(-az) % (2 * math.pi)


def setup_ground():
    scene = bpy.context.scene
    bpy.ops.mesh.primitive_plane_add(size=400.0, location=(4.55, 7.0, GROUND_Z))
    g = bpy.context.active_object
    g.name = "Suelo_Sombra"
    g.is_shadow_catcher = True
    m = bpy.data.materials.new("Suelo_Sombra")
    m.diffuse_color = (0.8, 0.8, 0.8, 1)
    g.data.materials.append(m)
    for uc in list(g.users_collection):
        uc.objects.unlink(g)
    scene.collection.objects.link(g)
    return g


def set_link_state(coll, obj, state):
    objs = list(coll.objects)
    idx = objs.index(obj)
    coll.collection_objects[idx].light_linking.link_state = state


def setup_light_linking(sun, ground):
    """The spiral stair rises 2.6 m above the cut model; its sun shadow on the virtual ground
    lands as a detached ring next to the maqueta. Split the sun in two with light linking:
    - Sol_Tarde lights everything except the ground (normal shadows, incl. the stair on the terrace)
    - Sol_Tarde_Suelo lights only the ground, and the stair does not block it."""
    scene = bpy.context.scene
    c_model = bpy.data.collections.new("LL_todo_menos_suelo")
    c_model.objects.link(ground)
    set_link_state(c_model, ground, "EXCLUDE")
    sun.light_linking.receiver_collection = c_model

    twin = bpy.data.objects.new("Sol_Tarde_Suelo", sun.data)
    scene.collection.objects.link(twin)
    twin.rotation_euler = sun.rotation_euler
    c_ground = bpy.data.collections.new("LL_solo_suelo")
    c_ground.objects.link(ground)
    set_link_state(c_ground, ground, "INCLUDE")
    twin.light_linking.receiver_collection = c_ground

    stair = [o for o in scene.objects if o.type == "MESH"
             and base_name(o.get("nombre_original", o.name)).startswith("Caracol")]
    c_block = bpy.data.collections.new("LL_bloqueo_sin_caracol")
    for o in stair:
        c_block.objects.link(o)
        set_link_state(c_block, o, "EXCLUDE")
    twin.light_linking.blocker_collection = c_block
    log("light linking: stair objects excluded from ground shadow:", len(stair))


def setup_render(scale):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    device_type = None
    for t in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = t
            prefs.get_devices()
            gpus = [d for d in prefs.devices if d.type == t]
            if gpus:
                for d in prefs.devices:
                    d.use = d.type == t
                device_type = t
                break
        except Exception as e:  # noqa
            log("device", t, "failed:", e)
    scene.cycles.device = "GPU" if device_type else "CPU"
    log("compute device:", device_type or "CPU")

    c = scene.cycles
    c.samples = 256
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.01
    c.adaptive_min_samples = 32
    c.use_denoising = True
    try:
        c.denoiser = "OPENIMAGEDENOISE"
        c.denoising_use_gpu = True
    except Exception:
        c.denoiser = "OPTIX"
    try:
        c.denoising_prefilter = "ACCURATE"
        c.denoising_quality = "HIGH"
    except Exception:
        pass
    c.max_bounces = 10
    c.diffuse_bounces = 4
    c.glossy_bounces = 4
    c.transmission_bounces = 8
    c.transparent_max_bounces = 16
    c.caustics_reflective = False
    c.caustics_refractive = False
    c.sample_clamp_indirect = 8.0
    c.use_light_tree = True
    scene.render.use_persistent_data = True
    scene.render.film_transparent = True
    scene.render.resolution_percentage = scale
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 40
    set_look("photo")


def set_look(kind):
    vs = bpy.context.scene.view_settings
    if kind == "photo":
        vs.view_transform = "AgX"
        for look in ("AgX - Medium High Contrast", "AgX - Base Contrast", "None"):
            try:
                vs.look = look
                break
            except TypeError:
                continue
        vs.exposure = 0.0
        vs.gamma = 1.0
    else:
        vs.view_transform = "Standard"
        vs.look = "None"
        vs.exposure = 0.0
        vs.gamma = 1.0


# ---------------------------------------------------------------------------
# Cameras
# ---------------------------------------------------------------------------
def box_points(box):
    x0, y0, x1, y1, z0, z1 = box
    return np.array([[x, y, z] for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)], dtype=float)


def visible_points(box):
    """Bounding-box corners of visible (non-alto) objects intersecting box, clipped to box."""
    x0, y0, x1, y1, z0, z1 = box
    pts = []
    for o in bpy.context.scene.objects:
        if o.type != "MESH" or o.get("rol") == "alto" or o.name == "Suelo_Sombra":
            continue
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            pts.append((min(max(w.x, x0), x1), min(max(w.y, y0), y1), min(max(w.z, z0), z1)))
    return np.array(pts, dtype=float) if pts else box_points(box)


def project(cam, scene, pts):
    """Project world points into normalized camera frame coordinates (0..1)."""
    M = np.array(cam.matrix_world.normalized().inverted())
    P = np.c_[pts, np.ones(len(pts))] @ M.T
    frame = [v for v in cam.data.view_frame(scene=scene)]
    fx = [v.x for v in frame]
    fy = [v.y for v in frame]
    if cam.data.type == "ORTHO":
        x, y = P[:, 0], P[:, 1]
    else:
        d = -frame[0].z
        z = -P[:, 2]
        x = P[:, 0] * d / z
        y = P[:, 1] * d / z
    u = (x - min(fx)) / (max(fx) - min(fx))
    v = (y - min(fy)) / (max(fy) - min(fy))
    return u, v


def place_orbit(cam, target, az, el, dist):
    az, el = math.radians(az), math.radians(el)
    d = Vector((math.sin(az) * math.cos(el), math.cos(az) * math.cos(el), math.sin(el)))
    cam.location = Vector(target) + d * dist
    cam.rotation_euler = (-d).to_track_quat("-Z", "Y").to_euler()


def fit_perspective(cam, scene, pts, az, el, margin):
    target = Vector(pts.mean(axis=0))
    cam.data.shift_x = cam.data.shift_y = 0.0
    W, H = scene.render.resolution_x, scene.render.resolution_y
    m = max(W, H)
    dist = 20.0
    for _ in range(6):
        lo, hi = 1.0, 300.0
        for _ in range(40):
            dist = 0.5 * (lo + hi)
            place_orbit(cam, target, az, el, dist)
            bpy.context.view_layer.update()
            u, v = project(cam, scene, pts)
            span_u = u.max() - u.min()
            span_v = v.max() - v.min()
            if span_u <= 1 - 2 * margin and span_v <= 1 - 2 * margin * W / H:
                hi = dist
            else:
                lo = dist
        dist = hi
        place_orbit(cam, target, az, el, dist)
        bpy.context.view_layer.update()
        u, v = project(cam, scene, pts)
        du = 0.5 * (u.max() + u.min()) - 0.5
        dv = 0.5 * (v.max() + v.min()) - 0.5
        cam.data.shift_x += du * W / m
        cam.data.shift_y += dv * H / m
    return target, dist


def make_camera(name, spec, scene):
    cd = bpy.data.cameras.new("CAM_" + name)
    cam = bpy.data.objects.new("CAM_" + name, cd)
    scene.collection.objects.link(cam)
    cd.clip_start = 0.05
    cd.clip_end = 500.0
    W, H = spec["res"]
    scene.render.resolution_x, scene.render.resolution_y = W, H
    if spec["kind"] == "top":
        cd.type = "ORTHO"
        x0, y0, x1, y1 = -0.03, -0.03, 9.13, 14.08
        cx, cy = 0.5 * (x0 + x1), 0.5 * (y0 + y1)
        # portrait: ortho_scale spans the larger (vertical) dimension
        span = max((y1 - y0) * 1.07, (x1 - x0) * 1.07 * H / W)
        cd.ortho_scale = span
        cam.location = (cx, cy, 30.0)
        cam.rotation_euler = (0.0, 0.0, 0.0)
        cam["target"] = (cx, cy, 0.0)
    else:
        cd.type = "PERSP"
        cd.lens = spec.get("lens", 50)
        cd.sensor_width = 36.0
        cd.sensor_fit = "AUTO"
        pts = visible_points(spec["box"]) if spec.get("tight") else box_points(spec["box"])
        target, dist = fit_perspective(cam, scene, pts, spec["az"], spec["el"], spec["margin"])
        cam["target"] = tuple(target)
        if spec.get("dof"):
            cd.dof.use_dof = True
            cd.dof.focus_distance = (cam.location - target).length
            cd.dof.aperture_fstop = spec["dof"]
            cd.dof.aperture_blades = 7
    for k in ("res", "mode", "samples"):
        cam["shot_" + k] = spec[k] if k != "res" else list(spec[k])
    return cam


# ---------------------------------------------------------------------------
# Modes
# ---------------------------------------------------------------------------
def set_mode(mode, cols, ground, sun):
    col_base, col_alto, col_corte = cols
    scene = bpy.context.scene
    vl = bpy.context.view_layer
    col_alto.hide_render = mode in ("maqueta", "lineas")
    col_corte.hide_render = mode == "full"
    ground.hide_render = mode == "lineas"
    sun.hide_render = mode == "lineas"
    twin = bpy.data.objects.get("Sol_Tarde_Suelo")
    if twin:
        twin.hide_render = mode == "lineas"
    if mode == "lineas":
        vl.material_override = plan_material()
        scene.render.use_freestyle = True
        vl.use_freestyle = True
        scene.render.film_transparent = True
        set_look("flat")
        scene.cycles.use_denoising = False
        scene.cycles.max_bounces = 0
    else:
        vl.material_override = None
        scene.render.use_freestyle = False
        scene.render.film_transparent = True
        set_look("photo")
        scene.cycles.use_denoising = True
        scene.cycles.max_bounces = 10


FLOOR_MATS = {"Suelo_Roble", "Suelo_Roble_Tostado", "Suelo_Barro_Cocido", "Cesped_Artificial",
              "Porcelanico_Blanco", "Terrazo", "Base_Maqueta", "Hueco_Escalera"}


def plan_material():
    """Flat emission material driven by the per-object property 'plano_valor' (0..1 greyscale)."""
    m = bpy.data.materials.get("Plano_Plano")
    if m:
        return m
    set_plan_values()
    m = bpy.data.materials.new("Plano_Plano")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_type = "OBJECT"
    attr.attribute_name = '["plano_valor"]'
    em.inputs["Strength"].default_value = 1.0
    nt.links.new(attr.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])

    return m


WALL_PREFIXES = ("Muro ", "Tabique ", "Patinillo ", "Alicatado ")
OPENING_WORDS = (" window ", " slide ", " door ")


def is_wall_cap(o):
    """True for section caps of walls (poche); caps of furniture/windows/doors stay white."""
    n = o.get("nombre_original", o.name)
    n = base_name(n) + " "
    return n.startswith(WALL_PREFIXES) and not any(w in n for w in OPENING_WORDS)


def set_plan_values():
    """Per-object greyscale for the line drawing (read by the Plano_Plano override material)."""
    white = 1.0
    floor = srgb_to_linear(0xF1)  # very light grey floors
    terr = srgb_to_linear(0xE9)   # terraces slightly darker
    for o in bpy.context.scene.objects:
        if o.type != "MESH":
            continue
        name = o.get("material_base", "")
        if o.get("rol") == "corte" and is_wall_cap(o):
            val = 0.0
        elif name in ("Suelo_Barro_Cocido", "Cesped_Artificial"):
            val = terr
        elif name in FLOOR_MATS:
            val = floor
        else:
            val = white
        o["plano_valor"] = (val, val, val)
        o.update_tag()


def setup_freestyle():
    scene = bpy.context.scene
    vl = bpy.context.view_layer
    fs = vl.freestyle_settings
    fs.crease_angle = math.radians(130)
    fs.use_culling = False
    fs.use_smoothness = False
    for ls in list(fs.linesets):
        fs.linesets.remove(ls)
    ls = fs.linesets.new("Contornos")
    ls.select_by_visibility = True
    ls.visibility = "VISIBLE"
    ls.select_by_edge_types = True
    ls.select_silhouette = True
    ls.select_border = True
    ls.select_crease = True
    ls.select_contour = True
    ls.select_external_contour = True
    ls.select_material_boundary = False
    lst = ls.linestyle
    lst.name = "Linea_Plano"
    lst.color = (0.018, 0.018, 0.02)
    lst.thickness = 1.6
    lst.thickness_position = "CENTER"
    lst.caps = "ROUND"
    lst.chaining = "PLAIN"
    scene.render.line_thickness_mode = "ABSOLUTE"
    scene.render.line_thickness = 1.0


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
def composite_opaque(src, dst, bg=BG_SRGB):
    img = bpy.data.images.load(src, check_existing=False)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    a = a.reshape(h, w, 4)
    alpha = a[:, :, 3:4]
    bgc = np.array(bg, dtype=np.float32).reshape(1, 1, 3) / 255.0
    rgb = a[:, :, :3] * alpha + bgc * (1.0 - alpha)
    out = np.concatenate([rgb, np.ones((h, w, 1), dtype=np.float32)], axis=2)
    o = bpy.data.images.new("opaque_tmp", w, h, alpha=False, float_buffer=False)
    o.pixels.foreach_set(out.ravel())
    o.filepath_raw = dst
    o.file_format = "PNG"
    o.save()
    bpy.data.images.remove(o)
    bpy.data.images.remove(img)


def stats(path):
    img = bpy.data.images.load(path, check_existing=False)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    a = a.reshape(-1, 4)
    alpha = a[:, 3]
    vis = a[alpha > 0.9, :3]
    res = {"size": [w, h], "alpha_cover": float((alpha > 0.5).mean())}
    if len(vis):
        lum = vis @ np.array([0.2126, 0.7152, 0.0722])
        res.update(mean=float(lum.mean()), clip=float((vis.max(axis=1) > 0.995).mean()),
                   black=float((lum < 0.02).mean()))
    bpy.data.images.remove(img)
    return res


# ---------------------------------------------------------------------------
def build(args):
    t0 = time.time()
    cols = import_model()
    tune_materials()
    check_textures()
    sun = setup_world(args.sun_az, args.sun_el)
    ground = setup_ground()
    setup_light_linking(sun, ground)
    setup_render(args.scale)
    setup_freestyle()
    plan_material()
    scene = bpy.context.scene
    cams = {}
    for name in ORDER:
        spec = SHOTS[name]
        if spec["kind"] == "top" and "CAM_planta" in bpy.data.objects:
            cams[name] = bpy.data.objects["CAM_planta"]
            continue
        cam = make_camera(name, spec, scene)
        if spec["kind"] == "top":
            cam.name = "CAM_planta"
            cam.data.name = "CAM_planta"
        cams[name] = cam
    set_mode("maqueta", cols, ground, sun)
    scene.camera = cams["villa_maqueta_iso"]
    scene.render.resolution_x, scene.render.resolution_y = SHOTS["villa_maqueta_iso"]["res"]
    log("scene built in %.1fs" % (time.time() - t0))
    return cols, ground, sun, cams


def main():
    args = parse_args()
    cols, ground, sun, cams = build(args)
    scene = bpy.context.scene
    if args.save_blend:
        bpy.context.preferences.filepaths.save_version = 0  # no .blend1 backups
        bpy.ops.wm.save_as_mainfile(filepath=BLEND, compress=True)
        bpy.ops.file.make_paths_relative()
        bpy.ops.wm.save_mainfile(compress=True)
        log("saved", BLEND)
    if args.no_render:
        return
    os.makedirs(args.outdir, exist_ok=True)
    only = [s for s in args.only.split(",") if s]
    todo = [n for n in ORDER if not only or n in only]
    timings = {}
    tpath = os.path.join(args.outdir, "_timings.json")
    if os.path.exists(tpath):
        try:
            timings = json.load(open(tpath))
        except Exception:
            timings = {}
    for name in todo:
        spec = SHOTS[name]
        set_mode(spec["mode"], cols, ground, sun)
        if args.force_sun:
            aim_sun(sun, *[float(v) for v in args.force_sun.split(",")])
        elif spec.get("sun"):
            aim_sun(sun, *spec["sun"])
        else:
            aim_sun(sun, args.sun_az, args.sun_el)
        scene.camera = cams[name]
        scene.render.resolution_x, scene.render.resolution_y = spec["res"]
        scene.cycles.samples = args.samples or spec["samples"]
        out = os.path.join(args.outdir, name + ".png")
        scene.render.filepath = out
        log("rendering", name, spec["res"], "samples", scene.cycles.samples, "scale", args.scale)
        t = time.time()
        bpy.ops.render.render(write_still=True)
        dt = time.time() - t
        if spec.get("opaque"):
            opq = out if spec.get("only_opaque") else os.path.join(args.outdir, name + "_opaco.png")
            composite_opaque(out, opq, bg=tuple(int(args.bg[i:i + 2], 16) for i in (0, 2, 4)) if args.bg else BG_SRGB)
        if spec["mode"] == "lineas":
            composite_opaque(out, out, bg=(255, 255, 255))
        st = stats(out)
        log("done %s in %.1fs %s" % (name, dt, st))
        timings[name] = {"seconds": round(dt, 1), "scale": args.scale, "samples": scene.cycles.samples, **st}
        json.dump(timings, open(tpath, "w"), indent=1)


if __name__ == "__main__":
    main()
