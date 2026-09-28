// Builds the web USDZ files (real size + 1:20) with usd-core in a local venv.
// Usage: npm run model:usdz [-- real|maqueta|all]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const venv = path.resolve('.venv-usd');
const py = process.platform === 'win32' ? path.join(venv, 'Scripts', 'python.exe') : path.join(venv, 'bin', 'python');
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

if (!fs.existsSync(py)) {
  run(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'venv', venv]);
  run(py, ['-m', 'pip', 'install', '-q', 'usd-core']);
}
run(py, ['source/villa3d/blender/usdz_web.py', process.argv[2] || 'all']);
