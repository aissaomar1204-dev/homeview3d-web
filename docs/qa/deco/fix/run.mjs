// usage: node run.mjs <template.js> KEY=VAL ... ; runs the template with playwright-cli session fixD and prints the JSON result
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const [,, tpl, ...kv] = process.argv;
let s = fs.readFileSync(path.join(HERE, tpl), 'utf8');
for (const p of kv) { const i = p.indexOf('='); s = s.split('__' + p.slice(0, i) + '__').join(p.slice(i + 1)); }
fs.mkdirSync(path.join(HERE, '_tmp'), { recursive: true });
const f = path.join(HERE, '_tmp', 'run-' + tpl).split(path.sep).join('/'); fs.writeFileSync(f, s);
const out = execFileSync('playwright-cli', ['-s=fixD', 'run-code', `--filename=${f}`], { encoding: 'utf8', shell: true, maxBuffer: 64 * 1024 * 1024 });
const m = out.match(/### Result\s*\n"([\s\S]*?)"\n###/);
if (!m) { console.log(out.slice(0, 1500)); process.exit(1); }
console.log(JSON.parse('"' + m[1] + '"'));
