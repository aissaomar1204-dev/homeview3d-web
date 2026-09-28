// Step 2b — prove the delivery files are equivalent to the source for the viewer.
//   * every material name of the source still exists (all 21 "_Alto" ones in particular)
//   * triangles per material name are identical (nothing lost, nothing moved between materials)
//   * world-space bounds match the source within 1 mm (hotspots keep working)
//   * required extensions are the expected ones (web vs Scene Viewer)
// Exit code 1 on failure. Usage: node scripts/3d/verify-glb.mjs
import fs from 'node:fs';
import path from 'node:path';
import { P, CUT_SUFFIX, createIO, mb, sceneStats, worldBounds, fmtBox } from './lib.mjs';

const io = await createIO();
const TOL = 0.001; // metres
let ok = true;
const fail = (msg) => { ok = false; console.log('  FAIL', msg); };
const pass = (msg) => console.log('  ok  ', msg);

function trianglesByMaterial(doc) {
  const out = {};
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const name = prim.getMaterial()?.getName() ?? '(none)';
      const idx = prim.getIndices();
      out[name] = (out[name] || 0) + (idx ? idx.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    }
  }
  return out;
}

const src = await io.read(P.cleanGltf);
const srcNames = new Set(src.getRoot().listMaterials().map((m) => m.getName()));
const srcAlto = [...srcNames].filter((n) => n.endsWith(CUT_SUFFIX)).sort();
const srcTris = trianglesByMaterial(src);
const srcBox = worldBounds(src);
console.log(`source ${path.relative(process.cwd(), P.cleanGltf)}`);
console.log(`  ${srcNames.size} material names, ${srcAlto.length} ending in ${CUT_SUFFIX}: ${srcAlto.join(', ')}`);
console.log(`  bounds ${fmtBox(srcBox)}`);

const targets = [
  { file: P.webGlb, label: 'web', required: ['EXT_meshopt_compression', 'EXT_texture_webp', 'KHR_mesh_quantization'] },
  { file: P.arGlb, label: 'Scene Viewer', required: [] },
];

for (const t of targets) {
  console.log(`\n${t.label}: ${path.relative(process.cwd(), t.file)} (${mb(fs.statSync(t.file).size)})`);
  const doc = await io.read(t.file);
  const stats = sceneStats(doc);
  console.log(`  ${stats.drawCalls} draw calls · ${stats.triangles} triangles · ${stats.materials} materials · ${stats.textures} textures`);

  const names = new Set(doc.getRoot().listMaterials().map((m) => m.getName()));
  const missing = [...srcNames].filter((n) => !names.has(n));
  const extra = [...names].filter((n) => !srcNames.has(n));
  missing.length ? fail(`missing material names: ${missing.join(', ')}`) : pass(`all ${srcNames.size} material names present`);
  extra.length ? fail(`unexpected material names: ${extra.join(', ')}`) : pass('no new material names');
  const alto = [...names].filter((n) => n.endsWith(CUT_SUFFIX)).sort();
  alto.join() === srcAlto.join() ? pass(`${alto.length} "${CUT_SUFFIX}" materials intact`) : fail(`"${CUT_SUFFIX}" set differs: ${alto.join(', ')}`);

  const tris = trianglesByMaterial(doc);
  const diff = Object.keys({ ...srcTris, ...tris }).filter((k) => srcTris[k] !== tris[k]);
  diff.length ? fail(`triangle count per material differs: ${diff.map((k) => `${k} ${srcTris[k]}->${tris[k]}`).join(', ')}`) : pass('triangles per material identical');

  const box = worldBounds(doc);
  const delta = Math.max(...box.min.map((v, i) => Math.abs(v - srcBox.min[i])), ...box.max.map((v, i) => Math.abs(v - srcBox.max[i])));
  console.log(`  bounds ${fmtBox(box)}`);
  delta <= TOL ? pass(`bounds match source (max deviation ${(delta * 1000).toFixed(2)} mm)`) : fail(`bounds deviate ${(delta * 1000).toFixed(2)} mm`);

  const req = doc.getRoot().listExtensionsUsed().filter((e) => e.isRequired()).map((e) => e.extensionName).sort();
  req.join() === t.required.slice().sort().join() ? pass(`required extensions: [${req.join(', ') || 'none'}]`) : fail(`required extensions [${req.join(', ')}], expected [${t.required.join(', ')}]`);
}

console.log(ok ? '\nVERIFY OK' : '\nVERIFY FAILED');
process.exit(ok ? 0 : 1);
