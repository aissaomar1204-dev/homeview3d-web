"""probe_scene.py - inspect villa_renders.blend: collections, roles, cameras, mesh stats (diagnostic)."""
import bpy, os, re, collections
from mathutils import Vector
sc = bpy.context.scene
print("SCENE", sc.name, "unit", sc.unit_settings.system, sc.unit_settings.scale_length)
print("COLLECTIONS", [(c.name, len(c.objects), c.hide_render, c.hide_viewport) for c in bpy.data.collections])
print("CAMERAS")
for o in bpy.data.objects:
    if o.type == "CAMERA":
        d = o.data
        print("  ", o.name, d.type, "lens", d.lens, "ortho", d.ortho_scale, "shift", round(d.shift_x, 4), round(d.shift_y, 4),
              "loc", tuple(round(v, 3) for v in o.location), "rot", tuple(round(v, 4) for v in o.rotation_euler),
              "sensor", d.sensor_width, d.sensor_fit, {k: o[k] for k in o.keys() if k.startswith("shot_") or k == "target"})
print("RES", sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage)
def base(n):
    return n[:-4] if len(n) > 4 and n[-4] == "." and n[-3:].isdigit() else n
tot = 0
groups = collections.OrderedDict()
dg = bpy.context.evaluated_depsgraph_get()
for o in bpy.data.objects:
    if o.type != "MESH":
        continue
    me = o.data
    nm = base(o.get("nombre_original", o.name))
    pre = re.split(r"[ _.]", nm)[0]
    key = (o.get("rol"), pre)
    g = groups.setdefault(key, [0, 0, 0])
    g[0] += 1; g[1] += len(me.polygons); g[2] += len(me.edges)
    tot += len(me.polygons)
print("TOTAL POLYS", tot)
for k, v in groups.items():
    print("  ", k, "objs", v[0], "polys", v[1], "edges", v[2])
mn = [1e9]*3; mx = [-1e9]*3
for o in bpy.data.objects:
    if o.type != "MESH": continue
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        for k in range(3):
            mn[k] = min(mn[k], w[k]); mx[k] = max(mx[k], w[k])
print("BOUNDS", [round(v, 3) for v in mn], [round(v, 3) for v in mx])
print("MODIFIERS", sum(len(o.modifiers) for o in bpy.data.objects))
print("ADDONS", list(bpy.context.preferences.addons.keys()))
