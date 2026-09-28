/* ═══════════════════════════════════════════════════════════════
   IndexNow ping after a PRODUCTION deploy (owner: GEO). 04-geo §5.1.
   Netlify event-triggered function (file name = event name):
   runs when a deploy has been published. It
     1. ignores every context except production,
     2. reads indexnow-pending.json FROM THE DEPLOY (written by the build:
        only URLs whose Markdown changed vs the live manifest),
     3. POSTs them to https://api.indexnow.org/indexnow (≤ 10,000 per batch),
     4. logs the result. It never throws (a failed ping must not alert).
   Manual resubmission: node scripts/indexnow.mjs --all --submit
   ═══════════════════════════════════════════════════════════════ */

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000;

const log = (...a) => console.log('[indexnow]', ...a);

export default async (req) => {
  try {
    let payload = {};
    try { ({ payload = {} } = await req.json()); } catch { /* empty body */ }
    const context = payload.context || payload.deploy?.context || process.env.CONTEXT || '';
    if (context !== 'production') { log(`skipped: context "${context || 'unknown'}"`); return new Response('skipped', { status: 200 }); }

    const base = payload.deploy_ssl_url || payload.links?.permalink || payload.ssl_url || payload.url || process.env.DEPLOY_URL || process.env.URL;
    if (!base) { log('skipped: no deploy URL in the event payload'); return new Response('no url', { status: 200 }); }

    const res = await fetch(new URL('/indexnow-pending.json', base), { headers: { 'cache-control': 'no-cache' } });
    if (!res.ok) { log(`skipped: indexnow-pending.json HTTP ${res.status}`); return new Response('no pending', { status: 200 }); }
    const pending = await res.json();
    const urls = Array.isArray(pending.urls) ? pending.urls : [];
    if (!urls.length) { log(`nothing to submit (${pending.basis || 'no changes'})`); return new Response('nothing', { status: 200 }); }
    if (!pending.host || !pending.key || /\.(example|test|invalid|localhost)$/.test(pending.host)) { log(`skipped: host "${pending.host}" is a placeholder`); return new Response('placeholder', { status: 200 }); }

    const own = urls.filter((u) => { try { return new URL(u).host === pending.host; } catch { return false; } });
    for (let i = 0; i < own.length; i += BATCH) {
      const urlList = own.slice(i, i + BATCH);
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: pending.host, key: pending.key, keyLocation: pending.keyLocation || `https://${pending.host}/${pending.key}.txt`, urlList }),
      });
      // 200 OK · 202 accepted (key pending validation) · 400 bad request · 403 key invalid · 422 URL of another host · 429 too many requests
      log(`HTTP ${r.status} · ${urlList.length} URL(s) · ${pending.basis || ''}`);
    }
    return new Response('ok', { status: 200 });
  } catch (e) {
    log(`error (ignored): ${e && e.message}`);
    return new Response('error', { status: 200 });
  }
};
