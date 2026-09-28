#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Manual IndexNow submission (owner: GEO). 04-geo §5.1.
   Normal deploys are pinged automatically by netlify/functions/deploy-succeeded.mjs;
   use this for the launch ("submit all") or to resend specific URLs.

     npm run indexnow                          dry run: list the pending URLs of dist/
     npm run indexnow -- --all                 dry run with EVERY indexable URL (manifest)
     npm run indexnow -- --all --submit        send them (launch day)
     npm run indexnow -- --url https://…/precios/ --url https://…/en/pricing/ --submit
   Options: --dist <dir> (default dist) · --submit (without it nothing is sent)
   Refuses to submit while build/data/site.mjs has a placeholder domain, and checks
   first that https://<domain>/<key>.txt is live (IndexNow validates it).
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../build/data/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const values = (f) => argv.flatMap((a, i) => (a === f && argv[i + 1] ? [argv[i + 1]] : []));
const DIST = path.resolve(values('--dist')[0] || path.join(ROOT, 'dist'));
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const host = new URL(site.domain).host;
const key = site.indexNowKey;
const keyLocation = `${site.domain}/${key}.txt`;

const readJson = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DIST, f), 'utf8')); } catch { return null; } };

let urls = values('--url');
let source = '--url';
if (!urls.length && has('--all')) {
  const man = readJson('indexnow-manifest.json');
  if (!man) { console.error('dist/indexnow-manifest.json not found: run "npm run build" first.'); process.exit(1); }
  urls = Object.keys(man);
  source = 'indexnow-manifest.json (all indexable URLs)';
} else if (!urls.length) {
  const pend = readJson('indexnow-pending.json');
  if (!pend) { console.error('dist/indexnow-pending.json not found: run "npm run build" first.'); process.exit(1); }
  urls = pend.urls || [];
  source = `indexnow-pending.json (${pend.basis})`;
}
urls = [...new Set(urls)];
const foreign = urls.filter((u) => { try { return new URL(u).host !== host; } catch { return true; } });
if (foreign.length) { console.error(`URLs not on ${host} (IndexNow would answer 422):\n  ${foreign.join('\n  ')}`); process.exit(1); }

console.log(`IndexNow · host ${host} · key ${key} · ${urls.length} URL(s) from ${source}`);
for (const u of urls.slice(0, 50)) console.log(`  ${u}`);
if (urls.length > 50) console.log(`  … ${urls.length - 50} more`);

if (!has('--submit')) { console.log('\nDry run. Add --submit to send.'); process.exit(0); }
if (site.domainPlaceholder || /\.(example|test|invalid|localhost)$/.test(host)) {
  console.error(`\nRefusing to submit: ${site.domain} is a placeholder (build/data/site.mjs → domain, domainPlaceholder).`);
  process.exit(1);
}
if (!urls.length) { console.log('\nNothing to submit.'); process.exit(0); }

try {
  const k = await fetch(keyLocation, { signal: AbortSignal.timeout(8000) });
  const text = k.ok ? (await k.text()).trim() : '';
  if (text !== key) { console.error(`\n${keyLocation} does not serve the key (HTTP ${k.status}). Deploy first.`); process.exit(1); }
} catch (e) { console.error(`\nCannot reach ${keyLocation}: ${e.message}`); process.exit(1); }

let failed = false;
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  const meaning = { 200: 'OK', 202: 'accepted, key pending validation', 400: 'bad request', 403: 'key not valid', 422: 'URL of another host', 429: 'too many requests' }[r.status] || '';
  console.log(`\nHTTP ${r.status} ${meaning} · ${urlList.length} URL(s)`);
  if (r.status >= 400) failed = true;
}
process.exit(failed ? 1 : 0);
