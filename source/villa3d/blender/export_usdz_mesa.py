"""
export_usdz_mesa.py - Tabletop AR model (1:20) of the cut-away "maqueta" for iPhone/iPad AR Quick Look.

  blender -b --factory-startup -P export_usdz_mesa.py -- [--tex 512|1024|256] [--out PATH]

- Rebuilds the scene from ./import/villa.gltf with the same import/split as villa_render.py
- Removes every object whose material ends with "_Alto" (walls/objects above 1.15 m) -> cut applied
- Keeps the "Corte_Seccion" caps (dark poche on the cut walls)
- Scales to 1:20, centres the footprint on the origin and puts the underside of the base at 0
- Exports Y-up USDZ with UsdPreviewSurface materials and packed (optionally downscaled) textures
"""
import bpy
import os
import sys
import argparse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True
sys.path.insert(0, HERE)
import villa_render as vr  # noqa: E402

DEFAULT_OUT = os.path.join(os.path.dirname(HERE), "ar", "villa_maqueta_mesa.usdz")
SCALE = 1.0 / 20.0


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--tex", default="512")
    p.add_argument("--out", default=DEFAULT_OUT)
    a = p.parse_args(argv)

    vr.import_model()
    scene = bpy.context.scene

    # 1) apply the cut: delete everything above 1.15 m
    alto = [o for o in scene.objects if o.get("rol") == "alto"]
    for o in alto:
        bpy.data.objects.remove(o, do_unlink=True)
    meshes = [o for o in scene.objects if o.type == "MESH"]
    vr.log("removed", len(alto), "alto objects, exporting", len(meshes))

    # 2) bounds of what is left
    from mathutils import Vector, Matrix
    mn = Vector((1e9, 1e9, 1e9))
    mx = Vector((-1e9, -1e9, -1e9))
    for o in meshes:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            mn = Vector(map(min, mn, w))
            mx = Vector(map(max, mx, w))
    cx, cy = 0.5 * (mn.x + mx.x), 0.5 * (mn.y + mx.y)
    vr.log("bounds", tuple(round(v, 3) for v in mn), tuple(round(v, 3) for v in mx))

    # 3) bake 1:20 scale + centring into the mesh data (no parent transforms left)
    M = Matrix.Scale(SCALE, 4) @ Matrix.Translation((-cx, -cy, -mn.z))
    for o in meshes:
        o.data.transform(M @ o.matrix_world)
        o.matrix_world = Matrix.Identity(4)
        for k in list(o.keys()):
            del o[k]

    # clean orphan data so no unused textures get packed
    bpy.data.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)

    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    wanted = dict(
        filepath=a.out,
        selected_objects_only=True,
        export_animation=False,
        export_hair=False,
        export_uvmaps=True,
        rename_uvmaps=True,
        export_normals=True,
        export_materials=True,
        generate_preview_surface=True,
        generate_materialx_network=False,
        convert_orientation=True,
        export_global_forward_selection="NEGATIVE_Z",
        export_global_up_selection="Y",
        export_textures_mode="NEW",
        overwrite_textures=True,
        root_prim_path="/VillaMaqueta",
        export_custom_properties=False,
        accessibility_label="Maqueta 3D a escala 1:20 - villa en la Costa del Sol",
        accessibility_description="Planta alta seccionada a 1,15 m: salon, 3 dormitorios, 2 banos y 2 terrazas",
        export_lights=False,
        export_cameras=False,
        triangulate_meshes=True,
        usdz_downscale_size=a.tex,
        convert_scene_units="METERS",
        use_instancing=False,
        merge_parent_xform=True,
    )
    props = {pr.identifier for pr in bpy.ops.wm.usd_export.get_rna_type().properties}
    kwargs = {k: v for k, v in wanted.items() if k in props}
    skipped = [k for k in wanted if k not in props]
    if skipped:
        vr.log("exporter options not available:", skipped)
    bpy.ops.wm.usd_export(**kwargs)
    size = os.path.getsize(a.out) / 1e6
    vr.log("USDZ written %s (%.2f MB), footprint %.3f x %.3f m, height %.3f m" % (
        a.out, size, (mx.x - mn.x) * SCALE, (mx.y - mn.y) * SCALE, (mx.z - mn.z) * SCALE))


if __name__ == "__main__":
    main()
