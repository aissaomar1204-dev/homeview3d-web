// Runs the official Khronos glTF-Validator (npm: gltf-validator) on .gltf/.glb files.
// Usage: node scripts/3d/validate.mjs [file ...]   (defaults: clean .gltf + public GLBs)
// Exit code 1 if any file has errors.
import fs from 'node:fs';
import path from 'node:path';
import validator from 'gltf-validator';
import { P } from './lib.mjs';

const files = process.argv.slice(2).length ? process.argv.slice(2) : [P.cleanGltf, P.webGlb, P.arGlb].filter((f) => fs.existsSync(f));
let failed = false;

for (const file of files) {
  const abs = path.resolve(file);
  const report = await validator.validateBytes(new Uint8Array(fs.readFileSync(abs)), {
    uri: path.basename(abs),
    maxIssues: 500,
    externalResourceFunction: (uri) =>
      new Promise((resolve, reject) => {
        fs.readFile(path.resolve(path.dirname(abs), decodeURIComponent(uri)), (err, data) => (err ? reject(err.toString()) : resolve(new Uint8Array(data))));
      }),
  });
  const { numErrors, numWarnings, numInfos, numHints, messages } = report.issues;
  const info = report.info || {};
  console.log(`\n[validate] ${path.relative(process.cwd(), abs)}`);
  console.log(`  validator ${report.validatorVersion} · errors ${numErrors} · warnings ${numWarnings} · infos ${numInfos} · hints ${numHints}`);
  console.log(`  extensionsUsed ${JSON.stringify(info.extensionsUsed || [])} · required ${JSON.stringify(info.extensionsRequired || [])}`);
  console.log(`  drawCalls ${info.drawCallCount} · triangles ${info.totalTriangleCount} · vertices ${info.totalVertexCount} · materials ${info.materialCount} · textures ${(info.resources || []).filter((r) => r.image).length}`);
  const counts = {};
  for (const m of messages) {
    const k = `${['ERROR', 'WARNING', 'INFO', 'HINT'][m.severity]} ${m.code}`;
    counts[k] = counts[k] || { n: 0, example: `${m.pointer || ''} ${m.message}` };
    counts[k].n++;
  }
  for (const [k, v] of Object.entries(counts)) console.log(`  - ${k} x${v.n}  e.g. ${v.example}`);
  if (numErrors > 0) failed = true;
}
process.exit(failed ? 1 : 0);
