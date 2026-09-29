// Close-ups of the signature moments, cut from the full-page screenshots (run after shoot.sh)
import sharp from 'sharp';
import fs from 'node:fs';
const boxes = (n) => JSON.parse(fs.readFileSync(`shots/_boxes-${n}.json`, 'utf8'));
const H = boxes('home'), S = boxes('service');
const by = (list, re, k = 0) => list.filter((b) => re.test(b.cls))[k];
const cut = async (src, out, top, height, width = 1440) => {
  const m = await sharp(src).metadata();
  const t = Math.max(0, Math.round(top)), h = Math.min(Math.round(height), m.height - t);
  await sharp(src).extract({ left: 0, top: t, width, height: h }).jpeg({ quality: 90, mozjpeg: true }).toFile(out);
  console.log(out, width + 'x' + h);
};
const ONLY = process.argv[2]; // home | service | mobile (default: all)
const on = (k) => !ONLY || ONLY === k;
const home = 'shots/home-1440-light.png', svc = 'shots/service-1440-light.png';
if (on('home')) {
await cut(home, 'shots/moment-1-hero-and-key-facts.jpg', 0, 1350);
const proc = by(H, /block--process/);
await cut(home, 'shots/moment-2-process-graphite.jpg', proc.top, proc.h);
const pr = by(H, /block--pricing/);
await cut(home, 'shots/moment-3-pricing-grey-mat.jpg', pr.top, pr.h);
const dip = by(H, /a-plate--2/), aud = by(H, /block--audiences/);
await cut(home, 'shots/moment-4-plates-and-index.jpg', dip.top, dip.h + 760);
const ft = by(H, /site-footer/), form = by(H, /block--form/);
await cut(home, 'shots/moment-5-contact-and-footer.jpg', form.top + 300, form.h - 300 + ft.h);
}
if (on('service')) {
const stat = by(S, /block--stat/);
await cut(svc, 'shots/moment-6-service-stat-and-pricing.jpg', stat.top, stat.h + 700);
const sp = by(S, /block--process/);
await cut(svc, 'shots/moment-7-service-process-side-drawing.jpg', sp.top, sp.h);
const need = by(S, /block--needs/), tab = by(S, /block--table/);
await cut(svc, 'shots/moment-8-service-table-and-plates.jpg', tab.top, tab.h + 100);
}
// Mobile (390) close-ups
if (on('mobile')) {
const M = boxes('home390');
const mob = 'shots/home-390-light.png';
const mproc = by(M, /block--process/), mprice = by(M, /block--pricing/), mdip = by(M, /a-plate--2/);
await cut(mob, 'shots/moment-9-mobile-hero-and-key-facts.jpg', 0, 1750, 390);
await cut(mob, 'shots/moment-10-mobile-process.jpg', mproc.top, Math.min(mproc.h, 2200), 390);
await cut(mob, 'shots/moment-11-mobile-plates-and-index.jpg', mdip.top, 2200, 390);
await cut(mob, 'shots/moment-12-mobile-pricing.jpg', mprice.top, Math.min(mprice.h, 2200), 390);
}
