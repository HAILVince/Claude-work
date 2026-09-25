import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const URL = 'http://127.0.0.1:8192/index.html';
const br = await chromium.launch();
let bad = 0;
const is = (n, g, w) => { const o = g === w; if (!o) bad++; console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(40)} ${JSON.stringify(g)}`); };
{
  const c = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL, { waitUntil: 'networkidle' });
  is('no JS errors', errs.join('|'), '');
  is('price rows from arak.txt', (await p.$$('.ar-l li')).length, 12);
  is('price groups', (await p.$$('.ar-g')).length, 5);
  is('call link', await p.getAttribute('.call', 'href'), 'tel:+36306946388');
  await p.click('#f button[type=submit]');
  is('empty submit flags three fields', (await p.$$('.fld.bad')).length, 3);
  await p.fill('#f-nev', 'Teszt Anna'); await p.fill('#f-el', 'abc'); await p.fill('#f-kor', '5');
  await p.click('#f button[type=submit]');
  is('garbage contact rejected', (await p.$$('.fld.bad')).length, 1);
  await p.fill('#f-el', '06 30 123 4567');
  await p.click('#f button[type=submit]');
  is('phone accepted, confirmed', await p.isVisible('#ok'), true);
  is('form cleared', await p.inputValue('#f-nev'), '');
  await c.close();
}
{
  const c = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  is('menu starts closed', await p.isVisible('.nav'), false);
  await p.click('.burger');
  is('burger opens it', await p.isVisible('.nav'), true);
  await p.click('.nav a[href="#arak"]');
  is('closes on link tap', await p.isVisible('.nav'), false);
  await c.close();
}
for (const w of [360, 390, 414, 600, 768, 860, 1000, 1100, 1280, 1440]) {
  const c = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 860, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  const over = await p.evaluate(w => [...document.querySelectorAll('body *')].filter(el => {
    if (el.classList.contains('skip') || el.type === 'radio' || el.closest('.hero-art')) return false;
    const r = el.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1);
  }).map(e => e.className || e.tagName), w);
  is(`width ${w}`, over.length === 0 && await p.evaluate(() => document.documentElement.scrollWidth) <= w, true);
  if (over.length) console.log('   ', [...new Set(over)].slice(0, 6));
  await c.close();
}
await br.close(); console.log(bad ? `${bad} FAILED` : 'all clean'); process.exit(bad ? 1 : 0);
