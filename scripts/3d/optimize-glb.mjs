// Step 2 — web/AR delivery files from the clean glTF.
//
//   public/models/villa.glb              web viewer (<model-viewer>): meshopt + quantized geometry, WebP textures
//   public/models/villa-ar.glb           Android Scene Viewer direct links/QR: plain glTF (no meshopt, no quantization,
//                                        no WebP) because Scene Viewer only supports KHR_materials_unlit and
//                                        KHR_texture_transform. Also the fallback if villa.glb fails to load.
//   public/models/villa-ar-maqueta.glb   Scene Viewer tabletop: 1:20, "_Alto" geometry removed (cut at 1.15 m)
//   public/models/villa_tamano_real.usdz iOS AR Quick Look, copied as-is from source/villa3d/ar/
//   public/models/villa.report.json      sizes/stats consumed by the site build (schema contentSize, case-study figures)
//
// Invariants (checked again by verify-glb.mjs):
//   - Material NAMES are preserved. The viewer's "maqueta" cut finds materials whose name ends with "_Alto".
//     Materials are only merged when name AND every property are identical (dedup keepUniqueNames:true),
//     e.g. the 3 identical "Madera_Clara". palette() is never used.
//   - World-space geometry is unchanged (bounds compared to the source), so hotspot coordinates stay valid.
//     Quantization adds one dequantization transform on the nodes; world positions stay the same (<1 mm).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PropertyType } from '@gltf-transform/core';
import { EXTTextureWebP } from '@gltf-transform/extensions';
import { dedup, prune, weld, join, meshopt, listTextureSlots } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { P, CUT_SUFFIX, createIO, mb, kb, sceneStats, worldBounds, fmtBox, gltfDiskSize } from './lib.mjs';

// High-frequency normal maps (rug pile, artificial grass): at 1024 px they weigh ~0.3-0.6 MB each and
// grow when re-encoded; at viewer distance 512 px is indistinguishable.
const NOISY_NORMALS = { pattern: /^(rug|rugbed|grass)_nrm$/, max: 512 };

const CONFIG = {
  web: {
    // WebP q82: colour PSNR >= 37 dB on every texture (avg ~43 dB) vs the source JPEGs.
    textures: { format: 'webp', colorMax: 2048, normalMax: 1024, colorQuality: 82, normalQuality: 85, overrides: [NOISY_NORMALS] },
    // Measured 2026-09-28 (docs/research/06-3d-ar-pipeline.md §2): 'high' (8-bit octahedral normals via meshopt
    // filters) is 0.5 MB smaller than 'medium' (10-bit normals) and renders identically in close-ups
    // (PSNR 64-67 dB between both). 16-bit positions (0.2 mm grid on a 14 m scene) cost ~1 KB more than
    // 14-bit (0.9 mm) and shift coplanar faces less (less extra z-fighting). Scene-wide quantization
    // volume = one grid for all nodes, so no cracks between walls/floors of different meshes.
    meshopt: { level: process.env.MESHOPT_LEVEL || 'high', quantizationVolume: 'scene', quantizePosition: Number(process.env.QUANT_POS || 16), quantizeNormal: 10, quantizeTexcoord: 12 },
  },
  // Scene Viewer: plain glTF, JPEG/PNG only, textures <= 2048 px.
  ar: { textures: { format: 'jpeg', colorMax: 2048, normalMax: 1024, colorQuality: 85, normalQuality: 90, overrides: [NOISY_NORMALS] } },
  // Tabletop 1:20 (46 x 70 cm): 1024 px colour / 512 px normals are plenty at arm's length.
  arMaqueta: { scale: 1 / 20, textures: { format: 'jpeg', colorMax: 1024, normalMax: 512, colorQuality: 85, normalQuality: 90 } },
};

const io = await createIO();
const log = (...a) => console.log('[optimize]', ...a);
const isBlend = (mat) => mat && mat.getAlphaMode() === 'BLEND';

/** dedup (names kept) -> prune -> weld -> join by material. */
async function baseOptimize(doc) {
  await doc.transform(
    dedup({
      propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH, PropertyType.TEXTURE, PropertyType.MATERIAL],
      keepUniqueNames: true, // never merge "Pared_Corte" with "Pared_Corte_Alto" even though they are identical
    }),
    prune({ keepAttributes: false, keepLeaves: false, keepSolidTextures: true }),
    weld(),
    // Nodes are flat (all children of the scene) with identity transforms, so joining sibling
    // nodes by material is exact. Glass (alpha BLEND) is kept per object so three.js can still
    // depth-sort the panes against each other.
    join({ keepNamed: false, filter: (node) => !(node.getMesh()?.listPrimitives().some((p) => isBlend(p.getMaterial()))) }),
  );
  // join() keeps the name of the first node of each material group ("Alfombra Bano 2" would end up
  // holding every rug). Rename joined nodes after their materials; glass keeps the object names.
  for (const node of doc.getRoot().listNodes()) {
    const prims = node.getMesh()?.listPrimitives() || [];
    if (!prims.length || prims.some((p) => isBlend(p.getMaterial()))) continue;
    const name = 'grupo_' + [...new Set(prims.map((p) => p.getMaterial().getName()))].join('+');
    node.setName(name);
    node.getMesh().setName(name);
  }
}

/** Resize/re-encode textures with sharp. Normal maps get their own size cap and quality. */
async function encodeTextures(doc, { format, colorMax, normalMax, colorQuality, normalQuality, overrides = [], minGain = 0.9 }) {
  const rows = [];
  for (const tex of doc.getRoot().listTextures()) {
    const slots = listTextureSlots(tex);
    const isNormal = slots.length > 0 && slots.every((s) => /normal/i.test(s));
    const override = overrides.find((o) => o.pattern.test(tex.getName()));
    const max = override ? override.max : isNormal ? normalMax : colorMax;
    const src = tex.getImage();
    const meta = await sharp(src).metadata();
    const needsResize = meta.width > max || meta.height > max;
    let img = sharp(src);
    if (needsResize) img = img.resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' });
    const quality = isNormal ? normalQuality : colorQuality;
    img = format === 'webp'
      ? img.webp({ quality, effort: 6, smartSubsample: true })
      : img.jpeg({ quality, mozjpeg: true, chromaSubsampling: isNormal ? '4:4:4' : '4:2:0' });
    const out = new Uint8Array(await img.toBuffer());
    if (!needsResize && out.byteLength >= src.byteLength * minGain) {
      // Re-encoding saves < 10 % (or grows, e.g. noisy normals as WebP): keep the original JPEG.
      // A GLB may mix JPEG and WebP textures, and this avoids a second generation of loss.
      rows.push([tex.getName(), `${meta.width}x${meta.height}`, `kept ${tex.getMimeType()} (${format} was ${kb(out.byteLength)})`, kb(src.byteLength)]);
      continue;
    }
    const outMeta = await sharp(out).metadata();
    tex.setImage(out).setMimeType(`image/${format}`).setURI((tex.getURI() || tex.getName()).replace(/\.(jpe?g|png|webp)$/i, '') + (format === 'webp' ? '.webp' : '.jpg'));
    rows.push([tex.getName(), `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`, `${format} q${quality}${isNormal ? ' (normal)' : ''}`, `${kb(src.byteLength)} -> ${kb(out.byteLength)}`]);
  }
  if (doc.getRoot().listTextures().some((t) => t.getMimeType() === 'image/webp')) {
    doc.createExtension(EXTTextureWebP).setRequired(true);
  }
  return rows;
}

function imageBytes(doc) {
  return doc.getRoot().listTextures().reduce((s, t) => s + t.getImage().byteLength, 0);
}

function summary(label, doc, file) {
  const stats = sceneStats(doc);
  const bounds = worldBounds(doc);
  const bytes = fs.statSync(file).size;
  log(`${label}: ${path.relative(process.cwd(), file)}  ${mb(bytes)} (textures ${mb(imageBytes(doc))})`);
  log(`   ${JSON.stringify(stats)}`);
  log(`   bounds ${fmtBox(bounds)}`);
  return { file: path.relative(P.modelsDir, file).replace(/\\/g, '/'), bytes, textureBytes: imageBytes(doc), stats, bounds };
}

fs.mkdirSync(P.modelsDir, { recursive: true });
const report = { generated: new Date().toISOString(), source: {}, outputs: {} };

// ---- source numbers ------------------------------------------------------
{
  const doc = await io.read(P.cleanGltf);
  const disk = gltfDiskSize(P.cleanGltf);
  report.source = { file: 'source/villa3d/gltf-clean/villa.gltf', bytes: disk.total, geometryBytes: disk.buffers + disk.json, textureBytes: disk.images, stats: sceneStats(doc), bounds: worldBounds(doc) };
  log(`source: ${mb(disk.total)} (json ${mb(disk.json)}, bin ${mb(disk.buffers)}, textures ${mb(disk.images)})`);
  log(`   ${JSON.stringify(report.source.stats)}`);
  log(`   bounds ${fmtBox(report.source.bounds)}`);
}

// ---- web GLB ----------------------------------------------------------------
{
  const doc = await io.read(P.cleanGltf);
  await baseOptimize(doc);
  const tex = await encodeTextures(doc, CONFIG.web.textures);
  await doc.transform(meshopt({ encoder: MeshoptEncoder, ...CONFIG.web.meshopt }));
  doc.getRoot().getAsset().generator = 'glTF-Transform (scripts/3d/optimize-glb.mjs) from Blender glTF I/O 5.2 export';
  await io.write(P.webGlb, doc);
  report.outputs.web = { ...summary('web', doc, P.webGlb), textures: tex, config: CONFIG.web };
  console.table(tex.map(([name, dims, how, size]) => ({ name, dims, how, size })));
}

// ---- Scene Viewer GLB (real size) ---------------------------------------------
{
  const doc = await io.read(P.cleanGltf);
  await baseOptimize(doc);
  const tex = await encodeTextures(doc, CONFIG.ar.textures);
  doc.getRoot().getAsset().generator = 'glTF-Transform (scripts/3d/optimize-glb.mjs) from Blender glTF I/O 5.2 export';
  await io.write(P.arGlb, doc);
  report.outputs.ar = { ...summary('ar (Scene Viewer)', doc, P.arGlb), reencodedTextures: tex.filter((r) => r[2] !== 'kept') };
}

// ---- Scene Viewer GLB tabletop 1:20, cut at 1.15 m -----------------------------
{
  const doc = await io.read(P.cleanGltf);
  const root = doc.getRoot();
  let removed = 0;
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMaterial()?.getName().endsWith(CUT_SUFFIX)) { prim.dispose(); removed++; }
    }
  }
  await baseOptimize(doc);
  await encodeTextures(doc, CONFIG.arMaqueta.textures);
  const scene = root.getDefaultScene() || root.listScenes()[0];
  const pivot = doc.createNode('Maqueta_1a20').setScale([CONFIG.arMaqueta.scale, CONFIG.arMaqueta.scale, CONFIG.arMaqueta.scale]);
  for (const child of scene.listChildren()) pivot.addChild(child);
  scene.addChild(pivot);
  await doc.transform(prune({ keepAttributes: true, keepLeaves: false, keepSolidTextures: true }));
  const out = path.join(P.modelsDir, 'villa-ar-maqueta.glb');
  await io.write(out, doc);
  report.outputs.arMaqueta = { ...summary(`ar maqueta 1:20 (removed ${removed} "_Alto" primitives)`, doc, out), removedCutPrimitives: removed };
}

// ---- USDZ copy ------------------------------------------------------------------
fs.copyFileSync(P.srcUsdz, P.usdz);
report.outputs.usdz = { file: path.basename(P.usdz), bytes: fs.statSync(P.usdz).size };
log(`usdz: copied ${path.basename(P.usdz)} ${mb(report.outputs.usdz.bytes)}`);

fs.writeFileSync(P.report, JSON.stringify(report, null, 2));
log(`report -> ${path.relative(process.cwd(), P.report)}`);
