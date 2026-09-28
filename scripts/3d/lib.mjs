// Shared helpers for the 3D/AR delivery pipeline (glTF-Transform based).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const P = {
  srcGltf: path.join(ROOT, 'source/villa3d/gltf/villa-modelo.json'),
  cleanDir: path.join(ROOT, 'source/villa3d/gltf-clean'),
  cleanGltf: path.join(ROOT, 'source/villa3d/gltf-clean/villa.gltf'),
  srcUsdz: path.join(ROOT, 'source/villa3d/ar/villa_tamano_real.usdz'),
  modelsDir: path.join(ROOT, 'public/models'),
  webGlb: path.join(ROOT, 'public/models/villa.glb'),
  arGlb: path.join(ROOT, 'public/models/villa-ar.glb'),
  usdz: path.join(ROOT, 'public/models/villa_tamano_real.usdz'),
  report: path.join(ROOT, 'public/models/villa.report.json'),
};

/** The viewer cut ("maqueta" mode, walls cut at 1.15 m) relies on this suffix. */
export const CUT_SUFFIX = '_Alto';

export async function createIO() {
  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;
  return new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'meshopt.decoder': MeshoptDecoder,
      'meshopt.encoder': MeshoptEncoder,
    });
}

export const mb = (bytes) => (bytes / 1048576).toFixed(2) + ' MB';
export const kb = (bytes) => (bytes / 1024).toFixed(0) + ' KB';

/** Size of a .gltf plus every external resource it references (buffers + images). */
export function gltfDiskSize(gltfPath) {
  const json = JSON.parse(fs.readFileSync(gltfPath, 'utf8'));
  const dir = path.dirname(gltfPath);
  let total = fs.statSync(gltfPath).size;
  let buffers = 0;
  let images = 0;
  for (const b of json.buffers || []) if (b.uri && !b.uri.startsWith('data:')) buffers += fs.statSync(path.join(dir, decodeURIComponent(b.uri))).size;
  for (const i of json.images || []) if (i.uri && !i.uri.startsWith('data:')) images += fs.statSync(path.join(dir, decodeURIComponent(i.uri))).size;
  return { json: total, buffers, images, total: total + buffers + images };
}

/**
 * World-space AABB computed from the actual vertex data (dequantized, with node
 * world matrices applied). Used to prove the optimized scene occupies exactly
 * the same space as the source, so hotspot coordinates remain valid.
 */
export function worldBounds(document) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const v = [0, 0, 0];
  const scene = document.getRoot().getDefaultScene() || document.getRoot().listScenes()[0];
  scene.traverse((node) => {
    const mesh = node.getMesh();
    if (!mesh) return;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      for (let i = 0, n = pos.getCount(); i < n; i++) {
        pos.getElement(i, v); // getElement() de-normalizes quantized data
        const x = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
        const y = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
        const z = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
        if (x < min[0]) min[0] = x; if (y < min[1]) min[1] = y; if (z < min[2]) min[2] = z;
        if (x > max[0]) max[0] = x; if (y > max[1]) max[1] = y; if (z > max[2]) max[2] = z;
      }
    }
  });
  return { min, max, size: max.map((x, i) => x - min[i]) };
}

export function sceneStats(document) {
  const root = document.getRoot();
  let prims = 0;
  let tris = 0;
  let verts = 0;
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      prims++;
      const idx = prim.getIndices();
      const pos = prim.getAttribute('POSITION');
      verts += pos.getCount();
      tris += (idx ? idx.getCount() : pos.getCount()) / 3;
    }
  }
  const materialNames = root.listMaterials().map((m) => m.getName());
  return {
    nodes: root.listNodes().length,
    meshes: root.listMeshes().length,
    drawCalls: prims,
    triangles: Math.round(tris),
    vertices: verts,
    materials: materialNames.length,
    uniqueMaterialNames: new Set(materialNames).size,
    cutMaterials: materialNames.filter((n) => n.endsWith(CUT_SUFFIX)).length,
    textures: root.listTextures().length,
    extensionsUsed: root.listExtensionsUsed().map((e) => e.extensionName),
  };
}

export const fmtBox = (b) =>
  `min [${b.min.map((x) => x.toFixed(4)).join(', ')}]  max [${b.max.map((x) => x.toFixed(4)).join(', ')}]  size [${b.size.map((x) => x.toFixed(3)).join(' x ')}] m`;
