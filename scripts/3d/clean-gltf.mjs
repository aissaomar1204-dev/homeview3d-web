// Step 1 — clean, valid copy of the Blender export.
//
//   source/villa3d/gltf/villa-modelo.json (+ villa-geometria.wasm, tex/*.jpg)
//     -> source/villa3d/gltf-clean/villa.gltf (+ villa.bin, tex/*.jpg)
//
// Changes (nothing else is touched: node names/transforms, material names and
// order, textures and image bytes stay the same):
//   1. Buffer renamed to villa.bin (the .wasm name was only a hosting workaround).
//   2. Invalid `texCoord: -1` (Blender I/O 5.2 writes it for image textures that
//      used Generated/Object coords) -> texCoord 0.
//   3. Those textures sit on 10 small primitives WITHOUT a UV map (drawer fronts,
//      a table leg, a bowl, a book, a shelf back). The validator reports that as an
//      ERROR and three.js would sample texel (0,0) and get NaN tangents for the
//      normal map. We add a box-projected TEXCOORD_0 (world-space, per-vertex
//      dominant normal axis) with the same texel density as the other primitives
//      that use the same texture, which is what Blender's box/Generated mapping
//      showed in the renders.
import fs from 'node:fs';
import path from 'node:path';
import { Accessor } from '@gltf-transform/core';
import { P, createIO, gltfDiskSize, mb, sceneStats, worldBounds, fmtBox } from './lib.mjs';

const io = await createIO();
const doc = await io.read(P.srcGltf);
const root = doc.getRoot();
const log = (...a) => console.log('[clean]', ...a);

// 1. buffer name
const buffers = root.listBuffers();
buffers.forEach((b, i) => b.setURI(i === 0 ? 'villa.bin' : `villa_${i}.bin`));

// 2. texCoord -1 -> 0
let fixedTexCoord = 0;
for (const mat of root.listMaterials()) {
  for (const info of [mat.getBaseColorTextureInfo(), mat.getNormalTextureInfo(), mat.getMetallicRoughnessTextureInfo(), mat.getOcclusionTextureInfo(), mat.getEmissiveTextureInfo()]) {
    if (info && info.getTexCoord() < 0) {
      info.setTexCoord(0);
      fixedTexCoord++;
    }
  }
}
log(`texCoord -1 -> 0 on ${fixedTexCoord} texture slots`);

// 3. box-projected UVs for textured primitives that have no TEXCOORD_0
const texturesOf = (mat) => [mat.getBaseColorTexture(), mat.getNormalTexture(), mat.getMetallicRoughnessTexture(), mat.getOcclusionTexture(), mat.getEmissiveTexture()].filter(Boolean);

function triArea(a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = (b[2] ?? 0) - (a[2] ?? 0);
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = (c[2] ?? 0) - (a[2] ?? 0);
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
}

/** UV units per metre measured on primitives that already have UVs and share `texture`. */
function texelDensity(texture) {
  let uvArea = 0, worldArea = 0;
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const mat = prim.getMaterial();
      const uv = prim.getAttribute('TEXCOORD_0');
      if (!mat || !uv || !texturesOf(mat).includes(texture)) continue;
      const pos = prim.getAttribute('POSITION');
      const idx = prim.getIndices();
      const n = idx ? idx.getCount() : pos.getCount();
      const a = [], b = [], c = [], ta = [], tb = [], tc = [];
      for (let i = 0; i < n; i += 3) {
        const i0 = idx ? idx.getScalar(i) : i, i1 = idx ? idx.getScalar(i + 1) : i + 1, i2 = idx ? idx.getScalar(i + 2) : i + 2;
        worldArea += triArea(pos.getElement(i0, a), pos.getElement(i1, b), pos.getElement(i2, c));
        uvArea += triArea(uv.getElement(i0, ta), uv.getElement(i1, tb), uv.getElement(i2, tc));
      }
    }
  }
  return worldArea > 0 && uvArea > 0 ? Math.sqrt(uvArea / worldArea) : 1;
}

const densityCache = new Map();
let generated = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial();
    if (!mat || prim.getAttribute('TEXCOORD_0') || texturesOf(mat).length === 0) continue;
    const tex = mat.getBaseColorTexture() || texturesOf(mat)[0];
    if (!densityCache.has(tex)) densityCache.set(tex, texelDensity(tex));
    const d = densityCache.get(tex);
    const pos = prim.getAttribute('POSITION');
    const nrm = prim.getAttribute('NORMAL');
    const count = pos.getCount();
    const out = new Float32Array(count * 2);
    const p = [0, 0, 0], nv = [0, 1, 0];
    for (let i = 0; i < count; i++) {
      pos.getElement(i, p);
      if (nrm) nrm.getElement(i, nv);
      const ax = Math.abs(nv[0]), ay = Math.abs(nv[1]), az = Math.abs(nv[2]);
      let u, v;
      if (ay >= ax && ay >= az) { u = p[0]; v = p[2]; }        // horizontal face: plan projection
      else if (ax >= az) { u = p[2]; v = p[1]; }               // faces east/west
      else { u = p[0]; v = p[1]; }                             // faces north/south
      out[i * 2] = u * d;
      out[i * 2 + 1] = 1 - v * d;
    }
    const acc = doc.createAccessor().setType(Accessor.Type.VEC2).setArray(out).setBuffer(buffers[0]);
    prim.setAttribute('TEXCOORD_0', acc);
    generated++;
    log(`  + TEXCOORD_0 (box, ${d.toFixed(3)} uv/m) on "${node.getName()}" [${mat.getName()}]`);
  }
}
log(`generated UVs on ${generated} primitives`);

// write .gltf + villa.bin + tex/*.jpg (image URIs are kept as tex/<name>.jpg)
fs.rmSync(P.cleanDir, { recursive: true, force: true });
fs.mkdirSync(path.join(P.cleanDir, 'tex'), { recursive: true });
await io.write(P.cleanGltf, doc);

const s = gltfDiskSize(P.cleanGltf);
log(`wrote ${path.relative(process.cwd(), P.cleanGltf)}  json ${mb(s.json)} + bin ${mb(s.buffers)} + images ${mb(s.images)} = ${mb(s.total)}`);
log('stats', JSON.stringify(sceneStats(doc)));
log('bounds', fmtBox(worldBounds(doc)));
