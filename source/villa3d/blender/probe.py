import bpy, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.join(HERE, "import", "villa.gltf"))
objs = [o for o in bpy.context.scene.objects]
print("OBJECTS", len(objs), set(o.type for o in objs))
mn = [1e9]*3; mx = [-1e9]*3
from mathutils import Vector
for o in objs:
    if o.type != 'MESH':
        continue
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        for k in range(3):
            mn[k] = min(mn[k], w[k]); mx[k] = max(mx[k], w[k])
print("BOUNDS", mn, mx)
print("MATS", len(bpy.data.materials))
for m in bpy.data.materials:
    nodes = [n.bl_idname for n in m.node_tree.nodes] if m.use_nodes else []
    print("  ", m.name, m.blend_method if hasattr(m,'blend_method') else '', nodes)
print("IMAGES", [(i.name, i.size[:], i.filepath) for i in bpy.data.images][:5])
# multi-material objects
multi = [(o.name, [s.material.name for s in o.material_slots if s.material]) for o in objs if o.type=='MESH' and len(o.material_slots) > 1]
print("MULTI", len(multi), multi[:20])
# GPU devices
prefs = bpy.context.preferences.addons['cycles'].preferences
for t in ('OPTIX', 'CUDA'):
    try:
        prefs.compute_device_type = t
        prefs.get_devices()
        print("DEVICES", t, [(d.name, d.type) for d in prefs.devices])
    except Exception as e:
        print("ERR", t, e)
# sky texture enum
tree = bpy.data.worlds.new("w")
tree.use_nodes = True
sky = tree.node_tree.nodes.new("ShaderNodeTexSky")
print("SKY TYPES", [e.identifier for e in sky.bl_rna.properties['sky_type'].enum_items])
print("SKY PROPS", [p.identifier for p in sky.bl_rna.properties])
print("VIEW TRANSFORMS", [e.identifier for e in bpy.context.scene.view_settings.bl_rna.properties['view_transform'].enum_items])
sc = bpy.context.scene
print("LOOKS", [e.identifier for e in sc.view_settings.bl_rna.properties['look'].enum_items][:40])
print("ENGINES", [e.identifier for e in sc.render.bl_rna.properties['engine'].enum_items])
print("DENOISERS", [e.identifier for e in sc.cycles.bl_rna.properties['denoiser'].enum_items])
