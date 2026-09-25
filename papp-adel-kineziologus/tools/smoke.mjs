import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const br = await chromium.launch();
let bad = 0;
const is = (n, g, w) => { const o = g === w; if (!o) bad++; console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(40)} ${JSON.stringify(g)}`); };
{
  const c = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://127.0.0.1:8191/index.html', { waitUntil: 'networkidle' });
  is('no JS errors', errs.join('|'), '');
  is('price rows', (await p.$$('.ar-l li')).length, 9);
  is('six days', (await p.$$('.day')).length, 6);
  is('one full day disabled', (await p.$$('.day:disabled')).length, 1);
  await p.click('#book button[type=submit]');
  is('empty submit: slot error', await p.isVisible('#slot-err'), true);
  is('empty submit: 3 field errors', (await p.$$('.fld.bad')).length, 3);
  await p.click('.slot >> nth=1');
  await p.fill('#f-nev', 'Teszt Anna'); await p.fill('#f-mail', 'anna@example.com'); await p.check('#f-ok');
  const before = (await p.$$('.slot')).length;
  await p.click('#book button[type=submit]');
  is('booked', await p.isVisible('#ok'), true);
  is('slot removed', (await p.$$('.slot')).length, before - 1);
  console.log('   ', await p.textContent('#ok'));
  await c.close();
}
for (const w of [360, 390, 414, 600, 768, 860, 1000, 1280, 1440]) {
  const c = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 860, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8191/index.html', { waitUntil: 'networkidle' });
  const over = await p.evaluate(w => [...document.querySelectorAll('body *')].filter(el => !el.classList.contains('skip') && !(el.type === 'radio') && (() => { const r = el.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1); })()).map(e => e.className || e.tagName), w);
  is(`width ${w}`, over.length === 0 && await p.evaluate(() => document.documentElement.scrollWidth) <= w, true);
  if (over.length) console.log('   ', [...new Set(over)].slice(0, 6));
  await c.close();
}
await br.close(); console.log(bad ? `${bad} FAILED` : 'all clean'); process.exit(bad ? 1 : 0);
