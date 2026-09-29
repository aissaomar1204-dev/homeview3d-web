"""
villa_interiores.py - eye-level interior stills of the villa (salon, main bedroom, en-suite, terrace).

The render set of villa_render.py is a cut-away "maqueta" seen from the air. This script turns the same
scene into a finished floor seen by a person standing in it:

- full-height walls (the `Alto` collection, 1.15 -> 2.60 m) and no section caps;
- a 30 cm roof slab over the interior with its ceiling at 2.60 m (the two terraces stay open);
- architectural window glass (Fresnel reflection + transparent shadows), so the low sun actually crosses
  the sliding doors and windows (the transmission glass of the aerial set blocks direct light without caustics);
- a physical sky and a sea plane 60 m below, so openings show a believable horizon (an illustrative backdrop,
  not the real surroundings of the anonymised villa);
- warm late-afternoon sun, light portals on every opening, warm recessed downlights (2,700 K) and the
  existing lamps switched on (floor lamp, bedside lamps) for the interior bounce;
- cameras at 1.60 m, perfectly level (verticals stay vertical), framed with lens shift, 24-26 mm (36 mm film).

Usage (PowerShell, from source/villa3d/blender):
  & $B -b --factory-startup -P villa_interiores.py                         # the 4 stills, 2400x1600
  & $B -b --factory-startup -P villa_interiores.py -- --only villa_interior_salon
  & $B -b --factory-startup -P villa_interiores.py -- --scale 25 --samples 64 --outdir $env:TEMP\\int_prev

Options: --only a,b  --scale N  --samples N  --outdir PATH  --save-blend (villa_interiores.blend)
         --variants '{"test_1": {"base": "villa_interior_bano", "cam": [8.3, 1.0, 1.6], "az": 262}}'
         renders extra framings of a shot (tests only; use with --outdir outside ../renders)
Input: villa_renders.blend (villa_render.py -- --save-blend). Output: ../renders/<shot>.png (opaque RGB).
"""
import bpy
import bmesh
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
BLEND_IN = os.path.join(HERE, "villa_renders.blend")
BLEND_OUT = os.path.join(HERE, "villa_interiores.blend")
DEFAULT_OUT = os.path.join(VILLA, "renders")
sys.path.insert(0, HERE)
import villa_render as vr  # noqa: E402  (scene helpers: devices, sun aiming, stats)

CEILING_Z = 2.60
SLAB_TOP = 2.90
SEA_Z = -60.0
EYE = 1.60
WARM_2700K = (1.0, 0.72, 0.46)

# Interior footprint covered by the roof slab (plan metres): the building minus the two open terraces.
SLAB_RECTS = [(3.00, 0.00, 9.10, 12.70), (0.00, 8.40, 3.00, 12.70)]

# ---------------------------------------------------------------------------
# Shots. Camera position in plan metres (x east, y north, z up), `az` = compass heading of the view
# (0 = N, 90 = E, 180 = S, 270 = W). The camera is level (pitch 0): framing only moves the lens shift.
# `sun` = (azimuth the light comes FROM, elevation), `exposure` = AgX exposure (EV).
# ---------------------------------------------------------------------------
SHOTS = {
    # Salon from its south-east corner, towards the three sliding panels and the terrace, sea behind.
    "villa_interior_salon": dict(
        cam=(6.20, 5.08, EYE), az=302.0, lens=26.0, shift=(0.0, -0.02),
        sun=(287.0, 17.0), exposure=0.0, samples=1024),
    # Main bedroom from the door, towards the headboard wall and the sliding door to the terrace.
    "villa_interior_dormitorio": dict(
        cam=(7.02, 4.52, EYE), az=230.0, lens=24.0, shift=(0.0, -0.06),
        sun=(287.0, 17.0), exposure=0.0, samples=1024),
    # En-suite from the shower entrance (fixed glass screen hidden from the camera only, door leaf removed),
    # towards the vanity, the round mirror and the freestanding tub under the west window.
    "villa_interior_bano": dict(
        cam=(7.70, 1.15, EYE), az=258.0, lens=24.0, shift=(0.0, -0.05),
        sun=(287.0, 17.0), exposure=0.9, samples=1024,
        hide_camera=("Mampara",), remove=("Tabique Bano Principal door 1 hoja", "Tabique Bano Principal door 1 mani")),
    # Main terrace from its middle, towards the outdoor sofa and the olive tree; a higher sun keeps the
    # floor out of the west parapet's shadow.
    "villa_interior_terraza": dict(
        cam=(2.60, 5.40, EYE), az=206.0, lens=26.0, shift=(0.0, -0.12),
        sun=(252.0, 28.0), exposure=0.0, samples=768),
}
ORDER = ["villa_interior_salon", "villa_interior_dormitorio", "villa_interior_bano", "villa_interior_terraza"]

# Recessed downlights (plan x, y) per room; they are all in the scene, every shot sees its own and its
# neighbours' through doors. Power in W per spot.
DOWNLIGHTS = {
    "salon": [(4.05, 5.75), (5.65, 5.75), (4.05, 7.55), (5.65, 7.55)],
    "principal": [(4.25, 3.05), (5.45, 3.05), (4.25, 4.30), (5.45, 4.30), (6.65, 3.20), (8.25, 3.20)],
    "suite": [(3.90, 1.00), (5.20, 1.10), (6.60, 1.15), (8.10, 0.75)],  # 14 W: black porcelain walls
    "paso": [(7.20, 5.60), (7.20, 7.30), (4.40, 9.00), (6.20, 9.00), (8.40, 9.00)],
}
DOWNLIGHT_W = 9.0
LAMPS = [  # (name, plan x, y, z, watts): light bulbs inside the existing lamp shades
    ("Bombilla_Lampara_Pie", 3.50, 7.95, 1.48, 10.0),
    ("Bombilla_Mesilla_P1", 3.56, 2.32, 0.86, 9.0),
    ("Bombilla_Mesilla_P2", 5.92, 2.32, 0.86, 9.0),
]
# Openings that get a light portal: (x0, y0, z0, x1, y1, z1) of the glazed area, normal points indoors.
PORTALS = [
    ("Portal_Salon", (3.10, 5.19, 0.09, 3.10, 8.11, 2.21), (1, 0, 0)),
    ("Portal_Principal", (3.10, 2.54, 0.09, 3.10, 3.91, 2.21), (1, 0, 0)),
    ("Portal_Suite_Oeste", (3.10, 0.59, 1.04, 3.10, 1.41, 2.06), (1, 0, 0)),
    ("Portal_Suite_Este", (9.00, 0.49, 1.64, 9.00, 0.96, 2.16), (-1, 0, 0)),
    ("Portal_Vestidor", (9.00, 2.14, 0.94, 9.00, 3.86, 2.16), (-1, 0, 0)),
]


def log(*a):
    print("[interior]", *a, flush=True)


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--only", default="")
    p.add_argument("--scale", type=int, default=100)
    p.add_argument("--samples", type=int, default=0)
    p.add_argument("--outdir", default=DEFAULT_OUT)
    p.add_argument("--save-blend", action="store_true")
    p.add_argument("--no-render", action="store_true")
    p.add_argument("--variants", default="", help='JSON {"out_name": {"base": shot, ...overrides}} for framing tests')
    return p.parse_args(argv)


# ---------------------------------------------------------------------------
# Materials
# ---------------------------------------------------------------------------
def principled(name, color, rough=0.85, spec=0.5):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = spec
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    return m


def texture_mean(img_name):
    img = bpy.data.images.get(img_name)
    if not img or img.size[0] == 0:
        return None
    a = np.empty(img.size[0] * img.size[1] * img.channels, dtype=np.float32)
    img.pixels.foreach_get(a)
    return tuple(float(v) for v in a.reshape(-1, img.channels)[:, :3].mean(axis=0))


def arch_glass(m, tint=(0.94, 0.97, 0.965)):
    """Thin architectural glass: Fresnel mix of a sharp glossy reflection over a tinted Transparent BSDF.
    Transparent BSDF lets shadow rays through, so the sun lands inside without caustics."""
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*tint, 1.0)
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    gl.inputs["Roughness"].default_value = 0.0
    fr = nt.nodes.new("ShaderNodeFresnel")
    # The Fresnel node inverts the IOR on back faces, so a pane seen from its back face reaches total
    # internal reflection past ~41 deg and turns into a mirror (a hard, curved dark band on oblique panes).
    # Feed 1/1.52 on back faces: every face then reflects like the front of a 1.52 pane.
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    ior = nt.nodes.new("ShaderNodeMath")
    ior.operation = "MULTIPLY_ADD"
    ior.inputs[1].default_value = 1.0 / 1.52 - 1.52
    ior.inputs[2].default_value = 1.52
    nt.links.new(geo.outputs["Backfacing"], ior.inputs[0])
    nt.links.new(ior.outputs["Value"], fr.inputs["IOR"])
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(fr.outputs["Fac"], mix.inputs["Fac"])
    nt.links.new(tr.outputs["BSDF"], mix.inputs[1])
    nt.links.new(gl.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])


def lamp_shade(m):
    """Linen shade: diffuse outside, warm translucency so the bulb inside makes it glow."""
    nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    tl = nt.nodes.new("ShaderNodeBsdfTranslucent")
    tl.inputs["Color"].default_value = (0.95, 0.80, 0.58, 1.0)
    mix = nt.nodes.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = 0.55
    nt.links.new(b.outputs["BSDF"], mix.inputs[1])
    nt.links.new(tl.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])


def tune_interior_materials():
    plaster = texture_mean("plaster_col") or (0.8, 0.79, 0.76)
    log("plaster mean", tuple(round(v, 3) for v in plaster))
    for m in bpy.data.materials:
        if not m.node_tree:
            continue
        name = vr.base_name(m.name)
        base = name.replace("_Alto", "")
        if base in ("Vidrio", "Vidrio_Ducha"):
            arch_glass(m, (0.94, 0.97, 0.965) if base == "Vidrio" else (0.90, 0.95, 0.95))
        elif base == "Pared_Corte":
            # Reveals and sills inside the wall thickness: plaster, not the grey of the section drawing.
            b = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if b:
                b.inputs["Base Color"].default_value = (*plaster, 1.0)
        elif base == "Pantalla_Lampara":
            lamp_shade(m)
        elif base == "Espejo":
            b = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if b:
                b.inputs["Base Color"].default_value = (0.92, 0.93, 0.92, 1.0)
                b.inputs["Metallic"].default_value = 1.0
                b.inputs["Roughness"].default_value = 0.01
        elif base in ("Porcelanico_Negro", "Porcelanico_Oliva"):
            # Large-format polished porcelain: the tile normal map reads as hammered metal in the
            # downlight reflections at eye level.
            for n in m.node_tree.nodes:
                if n.type == "NORMAL_MAP":
                    n.inputs["Strength"].default_value = 0.2
        elif base == "Pantalla_TV":
            b = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if b:
                b.inputs["Base Color"].default_value = (0.004, 0.004, 0.005, 1.0)
                b.inputs["Roughness"].default_value = 0.08
    return plaster


# ---------------------------------------------------------------------------
# Geometry added for the interiors
# ---------------------------------------------------------------------------
def link_to(obj, coll_name):
    coll = bpy.data.collections.get(coll_name)
    if coll is None:
        coll = bpy.data.collections.new(coll_name)
        bpy.context.scene.collection.children.link(coll)
    for uc in list(obj.users_collection):
        uc.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


def box_mesh(name, boxes, mat):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for (x0, y0, z0, x1, y1, z1) in boxes:
        r = bmesh.ops.create_cube(bm, size=1.0)
        for v in r["verts"]:
            v.co.x = x0 if v.co.x < 0 else x1
            v.co.y = y0 if v.co.y < 0 else y1
            v.co.z = z0 if v.co.z < 0 else z1
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    return ob


def add_slab(plaster):
    ceiling = principled("Techo_Enlucido", tuple(min(1.0, c * 1.04) for c in plaster), rough=0.9, spec=0.3)
    boxes = [(x0, y0, CEILING_Z, x1, y1, SLAB_TOP) for (x0, y0, x1, y1) in SLAB_RECTS]
    ob = box_mesh("Forjado_Cubierta", boxes, ceiling)
    link_to(ob, "Interiores")
    return ob


def densify_olive():
    """The potted olive of the web model has a sparse canopy (it is read from above). For eye-level views, add two
    rotated, slightly rescaled copies of its foliage around the trunk (render scene only; the model is untouched)."""
    leaves = [o for o in bpy.context.scene.objects if o.type == "MESH"
              and vr.base_name(o.get("nombre_original", o.name)).startswith("Olivo follaje")]
    trunk = [o for o in bpy.context.scene.objects if o.type == "MESH"
             and vr.base_name(o.get("nombre_original", o.name)) == "Olivo tronco"]
    if not leaves or not trunk:
        return
    c = sum((trunk[0].matrix_world @ Vector(v) for v in trunk[0].bound_box), Vector()) / 8.0
    from mathutils import Matrix as M
    for i, (ang, sc, dz) in enumerate(((121.0, 0.93, 0.06), (239.0, 1.04, -0.05))):
        for o in leaves:
            d = o.copy()
            d.name = f"{o.name}_denso{i + 1}"
            T = (M.Translation((c.x, c.y, 0.0)) @ M.Rotation(math.radians(ang), 4, "Z")
                 @ M.Scale(sc, 4) @ M.Translation((-c.x, -c.y, 0.0)))
            d.matrix_world = M.Translation((0.0, 0.0, dz)) @ T @ o.matrix_world
            link_to(d, "Interiores")
    log("olive canopy x3")


def add_sea():
    m = bpy.data.materials.new("Mar")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = (0.006, 0.040, 0.075, 1.0)
    b.inputs["Roughness"].default_value = 0.16
    b.inputs["IOR"].default_value = 1.33
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.35, 1.4, 1.0)   # long, low swell
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.2
    nz.inputs["Detail"].default_value = 6.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    bump.inputs["Distance"].default_value = 0.4
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    me = bpy.data.meshes.new("Mar")
    s = 12000.0
    me.from_pydata([(-s, -s, 0), (s, -s, 0), (s, s, 0), (-s, s, 0)], [], [(0, 1, 2, 3)])
    me.materials.append(m)
    ob = bpy.data.objects.new("Mar", me)
    ob.location = (4.55, 7.0, SEA_Z)
    link_to(ob, "Interiores")
    return ob


def emission_mat(name, color, strength):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1.0)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs["Emission"], out.inputs["Surface"])
    return m


def add_downlights():
    ring = principled("Aro_Downlight", (0.85, 0.85, 0.84), rough=0.35, spec=0.5)
    glow = emission_mat("Difusor_Downlight", WARM_2700K, 60.0)
    n = 0
    for room, pts in DOWNLIGHTS.items():
        for (x, y) in pts:
            n += 1
            # trim ring (7 cm radius) flush with the ceiling, lit diffuser recessed 5 mm inside it
            bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=0.07, depth=0.012,
                                                location=(x, y, CEILING_Z - 0.006))
            r = bpy.context.active_object
            r.name = f"Downlight_{room}_{n}_aro"
            r.data.materials.append(ring)
            link_to(r, "Interiores")
            bpy.ops.mesh.primitive_circle_add(vertices=40, radius=0.05, fill_type="NGON",
                                              location=(x, y, CEILING_Z - 0.0125))
            d = bpy.context.active_object
            d.name = f"Downlight_{room}_{n}_difusor"
            d.data.materials.append(glow)
            d.visible_shadow = False
            link_to(d, "Interiores")
            ld = bpy.data.lights.new(f"Downlight_{room}_{n}", "SPOT")
            ld.energy = DOWNLIGHT_W * (1.55 if room == "suite" else 1.0)
            ld.color = WARM_2700K
            ld.spot_size = math.radians(105)
            ld.spot_blend = 0.65
            ld.shadow_soft_size = 0.03
            lo = bpy.data.objects.new(f"Downlight_{room}_{n}", ld)
            lo.location = (x, y, CEILING_Z - 0.02)
            lo.rotation_euler = (0.0, 0.0, 0.0)  # spots point down (-Z)
            link_to(lo, "Interiores")
    log("downlights", n)


def add_lamps():
    for name, x, y, z, w in LAMPS:
        ld = bpy.data.lights.new(name, "POINT")
        ld.energy = w
        ld.color = WARM_2700K
        ld.shadow_soft_size = 0.04
        lo = bpy.data.objects.new(name, ld)
        lo.location = (x, y, z)
        link_to(lo, "Interiores")


def add_portals():
    for name, (x0, y0, z0, x1, y1, z1), nrm in PORTALS:
        ld = bpy.data.lights.new(name, "AREA")
        ld.shape = "RECTANGLE"
        w = max(abs(x1 - x0), abs(y1 - y0))
        h = z1 - z0
        ld.size, ld.size_y = w, h
        ld.cycles.is_portal = True
        lo = bpy.data.objects.new(name, ld)
        # just outside the glazing, emitting indoors (area lights emit along their local -Z)
        n = Vector(nrm)
        lo.location = (0.5 * (x0 + x1) - 0.06 * n.x, 0.5 * (y0 + y1) - 0.06 * n.y, 0.5 * (z0 + z1))
        link_to(lo, "Interiores")
        _orient_area(lo, n)
    log("portals", len(PORTALS))


def _orient_area(obj, n):
    """Area light facing along n (horizontal), local Y = world up, local X = along the wall."""
    z = -n.normalized()             # local +Z points away from the room; light emits along -Z = n
    y = Vector((0.0, 0.0, 1.0))
    x = y.cross(z).normalized()
    m = Matrix((x, y, z)).transposed()
    obj.rotation_euler = m.to_euler()


def setup_world_interior():
    scene = bpy.context.scene
    world = bpy.data.worlds.new("Cielo_Interiores")
    scene.world = world
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_disc = False
    sky.altitude = 60.0
    sky.air_density = 1.0
    sky.aerosol_density = 1.0
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Saturation"].default_value = 1.0
    nt.links.new(sky.outputs["Color"], hsv.inputs["Color"])
    nt.links.new(hsv.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.24
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    world["sky_node"] = sky.name
    world["bg_node"] = bg.name
    return world


# ---------------------------------------------------------------------------
# Scene
# ---------------------------------------------------------------------------
def prepare_scene(args):
    bpy.ops.wm.open_mainfile(filepath=BLEND_IN)
    scene = bpy.context.scene
    vr.setup_render(args.scale)       # GPU devices + the set's Cycles defaults
    # Full-height walls, no section caps, no shadow-catcher ground, no ground-only sun twin.
    bpy.data.collections["Alto (sobre 1,15 m)"].hide_render = False
    bpy.data.collections["Corte seccion"].hide_render = True
    for name in ("Suelo_Sombra", "Sol_Tarde_Suelo"):
        o = bpy.data.objects.get(name)
        if o:
            o.hide_render = True
    sun = bpy.data.objects["Sol_Tarde"]
    sun.light_linking.receiver_collection = None
    sun.data.energy = 4.6
    sun.data.color = (1.0, 0.76, 0.52)
    sun.data.angle = math.radians(0.9)
    plaster = tune_interior_materials()
    # Mirrors are flat panes: smooth shading bends their normals towards the rim (a convex, fish-eye reflection).
    for o in scene.objects:
        if o.type == "MESH" and vr.base_name(o.get("material_base", "")).startswith("Espejo"):
            o.data.polygons.foreach_set("use_smooth", [False] * len(o.data.polygons))
            o.data.update()
    add_slab(plaster)
    densify_olive()
    add_sea()
    add_downlights()
    add_lamps()
    add_portals()
    setup_world_interior()

    c = scene.cycles
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.008
    c.adaptive_min_samples = 64
    c.max_bounces = 16
    c.diffuse_bounces = 8
    c.glossy_bounces = 6
    c.transmission_bounces = 12
    c.transparent_max_bounces = 24
    c.sample_clamp_indirect = 6.0
    c.blur_glossy = 0.6          # "Filter Glossy": tames the few caustic paths off chrome and mirrors
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGB"
    vs = scene.view_settings
    vs.view_transform = "AgX"
    for look in ("AgX - Medium High Contrast", "AgX - Base Contrast", "None"):
        try:
            vs.look = look
            break
        except TypeError:
            continue
    return sun


def make_camera(name, spec, W, H):
    cd = bpy.data.cameras.new("CAM_" + name)
    cam = bpy.data.objects.new("CAM_" + name, cd)
    link_to(cam, "Interiores")
    cd.type = "PERSP"
    cd.sensor_fit = "HORIZONTAL"
    cd.sensor_width = 36.0
    cd.lens = spec["lens"]
    cd.clip_start = 0.05
    cd.clip_end = 30000.0
    cd.shift_x, cd.shift_y = spec.get("shift", (0.0, 0.0))
    cam.location = spec["cam"]
    cam.rotation_euler = (math.radians(90.0), 0.0, math.radians(-spec["az"]))  # level: pitch 0, roll 0
    return cam


def main():
    args = parse_args()
    t0 = time.time()
    sun = prepare_scene(args)
    scene = bpy.context.scene
    W, H = 2400, 1600
    order = list(ORDER)
    if args.variants:
        for vname, ov in json.loads(args.variants).items():
            SHOTS[vname] = {**SHOTS[ov.pop("base")], **ov}
            order.append(vname)
    cams = {n: make_camera(n, SHOTS[n], W, H) for n in order}
    log("scene ready in %.1fs" % (time.time() - t0))
    if args.save_blend:
        bpy.context.preferences.filepaths.save_version = 0
        bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUT, compress=True, relative_remap=True)
        log("saved", BLEND_OUT)
    if args.no_render:
        return
    os.makedirs(args.outdir, exist_ok=True)
    only = [s for s in args.only.split(",") if s]
    todo = [n for n in order if not only or n in only]
    tpath = os.path.join(args.outdir, "_timings.json")
    timings = {}
    if os.path.exists(tpath):
        try:
            timings = json.load(open(tpath))
        except Exception:
            timings = {}
    for name in todo:
        spec = SHOTS[name]
        hidden, removed = [], []
        for o in scene.objects:
            if o.type != "MESH":
                continue
            n = vr.base_name(o.get("nombre_original", o.name))
            if any(n.startswith(h) for h in spec.get("hide_camera", ())):
                o.visible_camera = False
                hidden.append(o)
            if any(n.startswith(h) for h in spec.get("remove", ())) and not o.hide_render:
                o.hide_render = True
                removed.append(o)
        vr.aim_sun(sun, *spec["sun"])
        scene.view_settings.exposure = spec.get("exposure", 0.0)
        scene.camera = cams[name]
        scene.render.resolution_x, scene.render.resolution_y = W, H
        scene.cycles.samples = args.samples or spec["samples"]
        out = os.path.join(args.outdir, name + ".png")
        scene.render.filepath = out
        log("rendering", name, (W, H), "samples", scene.cycles.samples, "scale", args.scale)
        t = time.time()
        bpy.ops.render.render(write_still=True)
        dt = time.time() - t
        for o in hidden:
            o.visible_camera = True
        for o in removed:
            o.hide_render = False
        st = vr.stats(out)
        log("done %s in %.1fs %s" % (name, dt, st))
        timings[name] = {"seconds": round(dt, 1), "scale": args.scale, "samples": scene.cycles.samples, **st}
        json.dump(timings, open(tpath, "w"), indent=1)


if __name__ == "__main__":
    main()
