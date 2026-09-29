// regenerate.mjs - rebuild every deco asset from the Blender scene.
//   node regenerate.mjs                 all steps
//   node regenerate.mjs extract build   only these steps (extract | build | textures | verify | board)
// Env: BLENDER (path to blender.exe), PYTHON (python with numpy, shapely, Pillow).
//   extract   Blender headless: visible-line extraction (ray-cast hidden-line removal) -> _cache/*.json
//   build     python + shapely: clean, chain, simplify, write public/assets/deco/*.svg
//   textures  paper-grain.png, hatch-45.svg
//   verify    checks sizes, currentColor, no raster
//   board     docs/design/deco/board.png (needs playwright-cli)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BLENDER = process.env.BLENDER || 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe';
const PYTHON = process.env.PYTHON || 'python';
const blend = path.resolve(HERE, '..', 'villa_renders.blend');
const steps = process.argv.slice(2).length ? process.argv.slice(2) : ['extract', 'build', 'textures', 'verify', 'board'];

const run = (cmd, args) => {
  console.log('\n> ' + [cmd, ...args].join(' '));
  const r = spawnSync(cmd, args, { cwd: HERE, stdio: 'inherit' });
  if (r.status !== 0) { console.error('step failed'); process.exit(r.status || 1); }
};

for (const s of steps) {
  if (s === 'extract') run(BLENDER, ['-b', '--factory-startup', blend, '-P', 'extract_views.py', '--', '--views', 'iso,plan,axo,section,long']);
  else if (s === 'build') run(PYTHON, ['build_svg.py']);
  else if (s === 'textures') run(PYTHON, ['make_textures.py']);
  else if (s === 'verify') run(PYTHON, ['verify_svgs.py']);
  else if (s === 'board') run(process.execPath, ['make_board.mjs']);
  else { console.error('unknown step', s); process.exit(2); }
}
