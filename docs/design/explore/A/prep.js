async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const st = document.createElement('style');
  st.textContent = '.main > section{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}';
  document.head.appendChild(st);
  const h = () => document.documentElement.scrollHeight;
  document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
  for (let y = 0; y < h(); y += 600) { window.scrollTo(0, y); await sleep(80); }
  window.scrollTo(0, h()); await sleep(300);
  document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in'));
  await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); })));
  await sleep(500);
  window.scrollTo(0, 0); await sleep(300);
  return h();
}
