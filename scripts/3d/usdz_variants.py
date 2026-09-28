"""USDZ variants for iOS AR Quick Look, derived from the real-size USDZ exported by Blender.

    maqueta  -> public/models/villa_maqueta_1a20.usdz
                tabletop model at 1:20 with the "maqueta" cut: every mesh bound to a material whose
                name ends in "_Alto" (geometry above 1.15 m) is removed, so the rooms are visible from above.
    walkin   -> source/villa3d/ar/candidatos/villa_tamano_real_suelo0.usdz  (candidate, test on device)
                real size, "Base Maqueta" removed and the model lowered 0.6 m so the villa FLOOR (not the
                bottom of the display base) sits on the detected floor. Quick Look anchors the model origin
                on the plane; the source USDZ has its origin at the bottom of the 0.6 m base.

Requires the Pixar USD Python package (not a site dependency):
    python -m venv .venv-usd && .venv-usd/Scripts/python -m pip install usd-core
    .venv-usd/Scripts/python scripts/3d/usdz_variants.py [maqueta|walkin|all]
"""
import os
import shutil
import sys
import tempfile
import zipfile

from pxr import Gf, Sdf, Usd, UsdGeom, UsdShade, UsdUtils

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "source", "villa3d", "ar", "villa_tamano_real.usdz")
CUT_SUFFIX = "_Alto"
BASE_OFFSET = 0.6  # metres between the bottom of "Base Maqueta" and the villa floor (glTF y = -0.6 .. 0)


def bound_material_names(prim):
    subsets = UsdGeom.Subset.GetAllGeomSubsets(UsdGeom.Imageable(prim))
    targets = [s.GetPrim() for s in subsets] or [prim]
    names = []
    for t in targets:
        mat = UsdShade.MaterialBindingAPI(t).ComputeBoundMaterial()[0]
        names.append(mat.GetPrim().GetName() if mat else None)
    return names


def bounds(stage):
    cache = UsdGeom.BBoxCache(Usd.TimeCode.Default(), [UsdGeom.Tokens.default_, UsdGeom.Tokens.render])
    r = cache.ComputeWorldBound(stage.GetPseudoRoot()).ComputeAlignedRange()
    return r.GetMin(), r.GetMax()


def build(variant, out_path):
    work = tempfile.mkdtemp(prefix="usdz-")
    try:
        with zipfile.ZipFile(SRC) as z:
            z.extractall(work)
            root_layer = z.namelist()[0]  # first file of a USDZ is its default layer
        stage = Usd.Stage.Open(os.path.join(work, root_layer))
        villa = stage.GetDefaultPrim()

        to_remove = []
        for prim in stage.Traverse():
            if not prim.IsA(UsdGeom.Mesh):
                continue
            names = [n for n in bound_material_names(prim) if n]
            if variant == "maqueta" and names and all(n.endswith(CUT_SUFFIX) for n in names):
                to_remove.append(prim.GetPath())
            if variant == "walkin" and prim.GetParent().GetName().startswith("Base_Maqueta"):
                to_remove.append(prim.GetParent().GetPath())
        for path in sorted(set(to_remove), key=lambda p: -len(str(p))):
            stage.RemovePrim(path)

        xf = UsdGeom.Xformable(villa)
        if variant == "maqueta":
            xf.AddScaleOp(opSuffix="maqueta").Set(Gf.Vec3f(0.05, 0.05, 0.05))
        else:
            # Put the villa floor at the origin. Translate is applied last (outermost) so it is in metres
            # of the final (Y-up) space regardless of the existing rotate op.
            op = xf.AddTranslateOp(opSuffix="suelo")
            order = xf.GetOrderedXformOps()
            xf.SetXformOpOrder([op] + [o for o in order if o.GetOpName() != op.GetOpName()])
            op.Set(Gf.Vec3d(0, -BASE_OFFSET, 0))

        mn, mx = bounds(stage)
        edited = os.path.join(work, f"villa_{variant}.usdc")
        stage.GetRootLayer().Export(edited)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        if os.path.exists(out_path):
            os.remove(out_path)
        ok = UsdUtils.CreateNewARKitUsdzPackage(Sdf.AssetPath(edited), out_path)
        print(f"[usdz] {variant}: removed {len(set(to_remove))} prims -> {os.path.relpath(out_path, ROOT)} "
              f"{os.path.getsize(out_path) / 1048576:.2f} MB, package ok={ok}")
        print(f"       bounds min {tuple(round(v, 3) for v in mn)} max {tuple(round(v, 3) for v in mx)}")

        errors, warnings = validate(out_path)
        print(f"       validation: {len(errors)} errors, {len(warnings)} warnings")
        for e in errors[:10]:
            print("       ERROR", e)
        for w in warnings[:5]:
            print("       warn ", w)
        return not errors
    finally:
        shutil.rmtree(work, ignore_errors=True)


def validate(usdz_path):
    """USD >= 24.11: UsdValidation framework (usdz package + geom/shade rules). Older: ComplianceChecker --arkit."""
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


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    targets = {
        "maqueta": os.path.join(ROOT, "public", "models", "villa_maqueta_1a20.usdz"),
        "walkin": os.path.join(ROOT, "source", "villa3d", "ar", "candidatos", "villa_tamano_real_suelo0.usdz"),
    }
    results = [build(v, p) for v, p in targets.items() if which in (v, "all")]
    sys.exit(0 if all(results) else 1)
