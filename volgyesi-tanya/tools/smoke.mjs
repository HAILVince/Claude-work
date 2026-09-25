import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const U = 'http://127.0.0.1:8193/index.html';
const br = await chromium.launch();
let bad = 0;
const is = (n, g, w) => { const o = g === w; if (!o) bad++; console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(40)} ${JSON.stringify(g)}`); };
{
  const c = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(U, { waitUntil: 'networkidle' });
  is('no JS errors', errs.join('|'), '');
  is('product rows', (await p.$$('.ar-l li')).length, 11);
  is('groups', (await p.$$('.ar-g')).length, 3);
  is('sold-out rows', (await p.$$('.ar-l li.out')).length, 1);
  is('call button dials her', await p.getAttribute('.call', 'href'), 'tel:+36306045424');
  const broken = await p.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach(i => { i.loading = 'eager'; });
    await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    return imgs.filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
  });
  is('all photos load', broken.join(','), '');
  await p.click('#f button[type=submit]');
  is('empty submit: 3 field errors', (await p.$$('.fld.bad')).length, 3);
  await p.fill('#f-nev', 'Teszt Anna'); await p.fill('#f-el', 'abc'); await p.fill('#f-mit', '1 kg friss sajt');
  await p.click('#f button[type=submit]');
  is('garbage contact rejected', await p.isVisible('.fld.bad #f-el'), true);
  await p.fill('#f-el', '06 30 123 4567');
  await p.click('#f button[type=submit]');
  is('phone accepted, confirmed', await p.isVisible('#ok'), true);
  is('form cleared', await p.inputValue('#f-mit'), '');
  await c.close();
}
{
  // A mangled or missing file must leave the baked list standing.
  const c = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  await p.route('**/termekek.txt', r => r.fulfill({ status: 200, body: 'ez nem lista\n## Üres csoport\n' }));
  await p.goto(U, { waitUntil: 'networkidle' });
  is('mangled file: baked list stays', (await p.$$('.ar-l li')).length, 11);
  await p.unroute('**/termekek.txt');
  await p.route('**/termekek.txt', r => r.fulfill({ status: 200, body: '## Sajtok\nSajtcsiga | elfogyott\nTúró | 2 000 Ft/kg\n' }));
  await p.reload({ waitUntil: 'networkidle' });
  is('edited file: list re-renders', (await p.$$('.ar-l li')).length, 2);
  is('edited file: sold-out greyed', (await p.$$('.ar-l li.out')).length, 1);
  await c.close();
}
{
  const c = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p = await c.newPage();
  await p.goto(U, { waitUntil: 'networkidle' });
  await p.click('.burger');
  is('mobile menu opens', await p.isVisible('.nav'), true);
  await p.click('.nav a[href="#kinalat"]');
  is('menu closes after a tap', await p.isVisible('.nav'), false);
  await c.close();
}
for (const w of [360, 390, 414, 600, 768, 860, 1000, 1100, 1280, 1440]) {
  const c = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 860, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto(U, { waitUntil: 'networkidle' });
  const over = await p.evaluate(w => [...document.querySelectorAll('body *')].filter(el => !el.classList.contains('skip') && (() => { const r = el.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1); })()).map(e => e.className || e.tagName), w);
  is(`width ${w}`, over.length === 0 && await p.evaluate(() => document.documentElement.scrollWidth) <= w, true);
  if (over.length) console.log('   ', [...new Set(over)].slice(0, 6));
  await c.close();
}
await br.close(); console.log(bad ? `${bad} FAILED` : 'all clean'); process.exit(bad ? 1 : 0);
