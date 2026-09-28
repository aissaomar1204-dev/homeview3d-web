"""usdz_web.py - AR Quick Look files for the website, derived from the Blender real-size export.

    real     -> public/models/villa_tamano_real.usdz
                "walk-in" at 1:1. The display base (Base_Maqueta), the stair void bottom and the 11 steps going
                down to the lower floor are removed, the finished floor of the upper floor is put at y = 0 and the
                2 cm under-floor edges of slabs/walls are clamped to y = 0. So the model origin AND the bottom of
                its bounding box are both the finished floor: whether Quick Look anchors the origin or the bbox,
                the virtual floor lands on the real one (the original floated 0.60 m).
    maqueta  -> public/models/villa_maqueta_1a20.usdz
                tabletop model at 1:20 with the 1.15 m cut (meshes bound only to "*_Alto" materials removed),
                display base kept (its underside at y = 0, footprint centred on the origin).

    Both: normal maps PNG -> JPEG (q90, 4:4:4, max 1024 px; 512 px for the 1:20 model, whose colour maps are
    also capped at 512 px), materials no longer bound to any mesh are pruned, then the ARKit package is
    rebuilt (uncompressed, 64-byte aligned) and validated with UsdValidation (usd-core >= 24.11).

Source (never modified): source/villa3d/ar/villa_tamano_real.usdz (Blender export: Y-up, metres, origin at the
bottom of the 0.60 m display base, footprint centred).

Requirements: Pixar USD for Python and node + sharp (texture step, usdz_textures.mjs):
    python -m venv .venv-usd && .venv-usd/Scripts/python -m pip install usd-core
    .venv-usd/Scripts/python source/villa3d/blender/usdz_web.py [real|maqueta|all] [--out-dir DIR]

Status: validated with usd-core only. NOT yet tested on an iPhone/iPad (AR Quick Look).
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

from pxr import Gf, Sdf, Usd, UsdGeom, UsdShade, UsdUtils

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
SRC = os.path.join(ROOT, "source", "villa3d", "ar", "villa_tamano_real.usdz")
TEX_SCRIPT = os.path.join(HERE, "usdz_textures.mjs")
CUT_SUFFIX = "_Alto"
FLOOR_Z_IN_SOURCE = 0.6          # /Villa/Villa translate z (Z-up frame) = floor height above the base bottom
REAL_REMOVE = re.compile(r"^(Base_Maqueta|Fondo_Hueco_Escalera|Peldano_\d+)$")

VARIANTS = {
    "real": dict(out="villa_tamano_real.usdz", name="villa_tamano_real", tex_max=1024, nrm_max=1024),
    "maqueta": dict(out="villa_maqueta_1a20.usdz", name="villa_maqueta_1a20", tex_max=512, nrm_max=512),
}


def log(*a):
    print("[usdz]", *a, flush=True)


def bound_material_paths(prim):
    subsets = UsdGeom.Subset.GetAllGeomSubsets(UsdGeom.Imageable(prim))
    targets = [prim] + [s.GetPrim() for s in subsets]
    out = []
    for t in targets:
        mat = UsdShade.MaterialBindingAPI(t).ComputeBoundMaterial()[0]
        if mat:
            out.append(mat.GetPrim().GetPath())
    return out


def world_range(stage):
    cache = UsdGeom.BBoxCache(Usd.TimeCode.Default(), [UsdGeom.Tokens.default_, UsdGeom.Tokens.render])
    r = cache.ComputeWorldBound(stage.GetPseudoRoot()).ComputeAlignedRange()
    return r.GetMin(), r.GetMax()


def clamp_below_floor(stage, floor_y=0.0, eps=1e-5):
    """Move every vertex below the finished floor up to it (world Y). Returns (meshes touched, vertices moved)."""
    xc = UsdGeom.XformCache()
    meshes = touched = 0
    for prim in stage.Traverse():
        if not prim.IsA(UsdGeom.Mesh):
            continue
        mesh = UsdGeom.Mesh(prim)
        pts = mesh.GetPointsAttr().Get()
        if not pts:
            continue
        M = xc.GetLocalToWorldTransform(prim)
        inv = M.GetInverse()
        new = []
        moved = 0
        for p in pts:
            w = M.Transform(Gf.Vec3d(p))
            if w[1] < floor_y - eps:
                w = Gf.Vec3d(w[0], floor_y, w[2])
                moved += 1
                new.append(Gf.Vec3f(inv.Transform(w)))
            else:
                new.append(p)
        if moved:
            mesh.GetPointsAttr().Set(new)
            mesh.GetExtentAttr().Set(UsdGeom.PointBased.ComputeExtent(new))
            meshes += 1
            touched += moved
    return meshes, touched


def prune_materials(stage):
    used = set()
    for prim in stage.Traverse():
        if prim.IsA(UsdGeom.Mesh):
            used.update(bound_material_paths(prim))
    removed = []
    for prim in list(stage.Traverse()):
        if prim.IsA(UsdShade.Material) and prim.GetPath() not in used:
            removed.append(prim.GetPath())
    for p in removed:
        stage.RemovePrim(p)
    return len(removed)


def texture_shaders(stage):
    for prim in stage.Traverse():
        if prim.IsA(UsdShade.Shader):
            sh = UsdShade.Shader(prim)
            f = sh.GetInput("file")
            if f and f.Get() is not None and f.Get().path:
                yield sh, f


def convert_textures(stage, work, layer_dir, tex_max, nrm_max):
    jobs, rewrites = [], []
    seen = {}
    for sh, f in texture_shaders(stage):
        rel = f.Get().path
        src = os.path.normpath(os.path.join(layer_dir, rel))
        cs = sh.GetInput("sourceColorSpace")
        is_normal = (cs is not None and cs.Get() == "raw") or "_nrm" in os.path.basename(rel)
        base, _ = os.path.splitext(rel)
        new_rel = base + ".jpg"
        if src not in seen:
            dst = os.path.normpath(os.path.join(work, "tex_out", os.path.relpath(src, layer_dir)))
            dst = os.path.splitext(dst)[0] + ".jpg"
            seen[src] = dst
            jobs.append({"in": src, "out": dst, "max": nrm_max if is_normal else tex_max,
                         "quality": 90 if is_normal else 86, "normal": is_normal})
        rewrites.append((f, new_rel))
    jobs_path = os.path.join(work, "tex_jobs.json")
    json.dump(jobs, open(jobs_path, "w"))
    subprocess.run(["node", TEX_SCRIPT, jobs_path], check=True, cwd=ROOT)
    # swap the converted files in next to the layer, remove the originals
    for src, dst in seen.items():
        target = os.path.splitext(src)[0] + ".jpg"
        if os.path.exists(src) and src != target:
            os.remove(src)
        shutil.copyfile(dst, target)
    for f, new_rel in rewrites:
        f.Set(Sdf.AssetPath(new_rel))
    return len(seen)


def validate(usdz_path):
    try:
        from pxr import UsdValidation
    except ImportError:
        from pxr.UsdUtils.complianceChecker import ComplianceChecker
        checker = ComplianceChecker(arkit=True, skipARKitRootLayerCheck=False, rootPackageOnly=False)
        checker.CheckCompliance(usdz_path)
        return checker.GetErrors(), checker.GetWarnings()
    ctx = UsdValidation.ValidationContext(
        keywords=["UsdzValidators", "UsdUtilsValidators", "UsdGeomValidators", "UsdShadeValidators", "UsdCoreValidators"])
    found = ctx.Validate(Usd.Stage.Open(usdz_path))
    errors = [f"{e.GetName()}: {e.GetMessage()}" for e in found if e.GetType() == UsdValidation.ValidationErrorType.Error]
    warnings = [f"{e.GetName()}: {e.GetMessage()}" for e in found if e.GetType() != UsdValidation.ValidationErrorType.Error]
    return errors, warnings


def package_check(usdz_path):
    """USDZ rules: stored (no compression), every file's data 64-byte aligned, first file = root layer."""
    bad = []
    with zipfile.ZipFile(usdz_path) as z, open(usdz_path, "rb") as fh:
        for info in z.infolist():
            if info.compress_type != zipfile.ZIP_STORED:
                bad.append(f"compressed: {info.filename}")
            fh.seek(info.header_offset + 26)
            n, m = int.from_bytes(fh.read(2), "little"), int.from_bytes(fh.read(2), "little")
            data_off = info.header_offset + 30 + n + m
            if data_off % 64:
                bad.append(f"unaligned: {info.filename}")
        names = z.namelist()
    return bad, names


def build(variant, out_dir):
    cfg = VARIANTS[variant]
    work = tempfile.mkdtemp(prefix=f"usdz-{variant}-")
    try:
        with zipfile.ZipFile(SRC) as z:
            z.extractall(work)
            root_layer = z.namelist()[0]
        layer_path = os.path.join(work, root_layer)
        layer_dir = os.path.dirname(layer_path)
        stage = Usd.Stage.Open(layer_path)
        villa = stage.GetDefaultPrim()                     # /Villa (rotateX -90: Z-up model -> Y-up)
        inner = stage.GetPrimAtPath(villa.GetPath().AppendChild("Villa"))

        removed = []
        mixed = 0
        if variant == "real":
            for child in inner.GetChildren():
                if REAL_REMOVE.match(child.GetName()):
                    removed.append(child.GetPath())
        else:
            for prim in stage.Traverse():
                if not prim.IsA(UsdGeom.Mesh):
                    continue
                names = [p.name for p in bound_material_paths(prim)]
                if names and all(n.endswith(CUT_SUFFIX) for n in names):
                    removed.append(prim.GetPath())
                elif any(n.endswith(CUT_SUFFIX) for n in names):
                    mixed += 1
        for p in sorted(set(removed), key=lambda p: -len(str(p))):
            stage.RemovePrim(p)
        log(f"{variant}: removed {len(removed)} prims" + (f", {mixed} meshes mix cut/uncut materials (kept)" if mixed else ""))

        if variant == "real":
            op = next(o for o in UsdGeom.Xformable(inner).GetOrderedXformOps() if o.GetOpType() == UsdGeom.XformOp.TypeTranslate)
            t = op.Get()
            op.Set(Gf.Vec3d(t[0], t[1], t[2] - FLOOR_Z_IN_SOURCE))   # finished floor -> y = 0
            m, v = clamp_below_floor(stage, 0.0)
            log(f"real: floor moved to y=0; clamped {v} vertices in {m} meshes (2 cm slab/wall undersides)")
        else:
            # Scale 1:20 on the inner prim (translate and scale ops), not as an extra op on the root: some
            # importers (Blender's, at least) drop the default prim's own transform.
            k = 0.05
            for op in UsdGeom.Xformable(inner).GetOrderedXformOps():
                if op.GetOpType() == UsdGeom.XformOp.TypeTranslate:
                    op.Set(Gf.Vec3d(op.Get()) * k)
                elif op.GetOpType() == UsdGeom.XformOp.TypeScale:
                    op.Set(Gf.Vec3f(op.Get()) * k)

        pm = prune_materials(stage)
        nt = convert_textures(stage, work, layer_dir, cfg["tex_max"], cfg["nrm_max"])
        log(f"{variant}: pruned {pm} unbound materials; {nt} textures converted/copied")

        mn, mx = world_range(stage)
        edited = os.path.join(layer_dir, cfg["name"] + ".usdc")
        stage.GetRootLayer().Export(edited)
        out_path = os.path.join(out_dir, cfg["out"])
        os.makedirs(out_dir, exist_ok=True)
        tmp_out = out_path + ".tmp.usdz"
        if os.path.exists(tmp_out):
            os.remove(tmp_out)
        ok = UsdUtils.CreateNewARKitUsdzPackage(Sdf.AssetPath(edited), tmp_out)
        if not ok:
            raise RuntimeError("CreateNewARKitUsdzPackage failed")
        errors, warnings = validate(tmp_out)
        bad, names = package_check(tmp_out)
        size = os.path.getsize(tmp_out)
        log(f"{variant}: {size} bytes ({size / 1048576:.2f} MB), {len(names)} files, first = {names[0]}")
        log(f"{variant}: bounds min {tuple(round(v, 4) for v in mn)} max {tuple(round(v, 4) for v in mx)}")
        log(f"{variant}: validation {len(errors)} errors, {len(warnings)} warnings; package issues: {bad or 'none'}")
        for e in errors[:10]:
            log("  ERROR", e)
        for w in warnings[:8]:
            log("  warn ", w)
        if errors or bad:
            os.remove(tmp_out)
            return False, None
        os.replace(tmp_out, out_path)
        try:
            shown = os.path.relpath(out_path, ROOT)
        except ValueError:  # another drive
            shown = out_path
        return True, {"path": shown, "bytes": size, "min": [round(v, 4) for v in mn], "max": [round(v, 4) for v in mx]}
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    which = next((a for a in args if a in ("real", "maqueta", "all")), "all")
    out_dir = os.path.join(ROOT, "public", "models")
    if "--out-dir" in args:
        out_dir = os.path.abspath(args[args.index("--out-dir") + 1])
    results = {}
    for v in VARIANTS:
        if which in (v, "all"):
            ok, info = build(v, out_dir)
            results[v] = info if ok else "FAILED"
    print(json.dumps(results, indent=1))
    sys.exit(0 if all(r != "FAILED" for r in results.values()) else 1)
