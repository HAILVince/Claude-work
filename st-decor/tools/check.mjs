/* Szélesség-söprés és viselkedés. A söprés 320 pixelen indul, mert egy
   négyzetméter-áras lista pont az, ami ott szokott kilógni. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:8195';
const br = await chromium.launch();
let bad = 0;
const is = (n, got, want) => { const o = got === want; if (!o) bad++;
  console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(50)} ${o ? got : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`); };

for (const page of ['index.html', 'adatkezeles.html', '404.html']) {
  for (const w of [320, 360, 390, 414, 480, 560, 620, 768, 820, 1000, 1160, 1280, 1440]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 820 });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle' });
    const over = await p.evaluate(w => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (el.classList.contains('skip')) continue;
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > w + 1 || r.left < -1)) out.push(el.className || el.tagName);
      }
      return out;
    }, w);
    const scroll = await p.evaluate(() => document.documentElement.scrollWidth);
    is(`${page} @ ${w}`, over.length === 0 && scroll <= w, true);
    if (over.length) console.log('      túllóg:', [...new Set(over)].slice(0, 6));
    await ctx.close();
  }
}

/* Az árlista a txt fájlból jön, és az egész üzenet azon áll, hogy Tímea
   maga írja át. Ha ez elromlik, a demó érve romlik el. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('az árlista csoportokat rajzol', (await p.$$('.ar-g')).length, 3);
  is('minden tétel kikerül', (await p.$$('.ar-l li')).length, 9);
  is('a csoport megjegyzése is', (await p.textContent('.ar-note')).includes('bonyolultságától'), true);
  is('a rövid árak nem tördelnek', (await p.$$('.ar-p.wrap')).length, 0);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/arak.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: '# csak megjegyzés\nés egy értelmetlen sor\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('értelmetlen fájl mellett marad a besütött lista', (await p.$$('.ar-g')).length, 3);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/arak.txt', r => r.fulfill({ status: 404, body: '' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('hiányzó fájl mellett is marad a lista', (await p.$$('.ar-g')).length, 3);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 360, height: 900 }, isMobile: true });
  const p = await ctx.newPage();
  await p.route('**/arak.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8',
      body: '## Teszt\nEgy tétel | kérésre, egyeztetés után\nMásik | 9 000 Ft/m²-től\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('az új fájl felülírja a besütöttet', (await p.$$('.ar-g')).length, 1);
  is('a mondat hosszú érték tördelhet', (await p.$$('.ar-p.wrap')).length, 1);
  is('a szám nem tördel', (await p.$$('.ar-p:not(.wrap)')).length, 1);
  is('360 pixelen sem lóg ki semmi', await p.evaluate(() => document.documentElement.scrollWidth <= 360), true);
  await ctx.close();
}

/* Az űrlap. A visszahívás és a workshop is átírja, mit kérdez. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await p.click('#f button[type=submit]');
  is('üres küldés négy mezőt jelöl', (await p.$$('.fld.bad')).length, 4);

  is('a visszahívás időpontja alapból rejtve van', await p.isVisible('#fld-mikor'), false);
  await p.check('#f-hivas');
  is('pipálva megjelenik', await p.isVisible('#fld-mikor'), true);

  await p.fill('#f-nev', 'Teszt Anna');
  await p.fill('#f-el', 'anna@example.com');
  await p.fill('#f-meret', '12 m²');
  await p.fill('#f-uzenet', 'A nappali egyik falát szeretném.');
  await p.click('#f button[type=submit]');
  is('visszahíváshoz e-mail nem elég', (await p.$$('.fld.bad')).length, 1);

  await p.fill('#f-el', '06 20 230 0997');
  await p.click('#f button[type=submit]');
  is('telefonszámmal átmegy', (await p.$$('.fld.bad')).length, 0);
  is('van visszajelzés', await p.isVisible('#ok'), true);
  is('az űrlap kiürül', await p.inputValue('#f-nev'), '');
  is('a visszahívás mező újra rejtve van', await p.isVisible('#fld-mikor'), false);

  await p.selectOption('#f-mit', 'Workshop');
  is('workshopnál nincs négyzetméter', await p.isVisible('#fld-meret'), false);
  await p.fill('#f-nev', 'Teszt Anna');
  await p.fill('#f-el', 'anna@example.com');
  await p.fill('#f-uzenet', 'A kiscsoportos workshop érdekelne.');
  await p.click('#f button[type=submit]');
  is('workshopnál méret nélkül is átmegy', (await p.$$('.fld.bad')).length, 0);

  await p.selectOption('#f-mit', 'Dekor falfestés');
  is('falfestésnél visszajön a méret', await p.isVisible('#fld-meret'), true);
  await ctx.close();
}

/* A négyzetméter számot kell tartalmazzon, különben nincs miből árat mondani. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await p.fill('#f-nev', 'Teszt Anna');
  await p.fill('#f-el', 'anna@example.com');
  await p.fill('#f-meret', 'egy fal');
  await p.fill('#f-uzenet', 'A nappali.');
  await p.click('#f button[type=submit]');
  is('"egy fal" nem méret', await p.$eval('#f-meret', el => el.closest('.fld').classList.contains('bad')), true);
  await ctx.close();
}

/* Menü telefonon, és a fejléc gombja sötét alapon világos szöveg. */
{
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('a menü zárva indul', await p.isVisible('.nav'), false);
  await p.click('.burger');
  is('a hamburger nyitja', await p.isVisible('.nav'), true);
  await p.click('.nav a[href="#arak"]');
  is('linkre bezárul', await p.isVisible('.nav'), false);
  await p.click('.burger');
  await p.keyboard.press('Escape');
  is('Escape is bezárja', await p.isVisible('.nav'), false);
  await p.click('.burger');
  const cta = await p.$eval('.nav-cta', el => getComputedStyle(el).color);
  is('a fejléc gombja nem sötét a sötéten', cta, 'rgb(242, 239, 233)');
  await ctx.close();
}

/* Minden hivatkozott fájl létezik. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const missing = [];
  p.on('response', r => { if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`); });
  for (const page of ['index.html', 'adatkezeles.html', '404.html']) {
    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle' });
  }
  is('nincs hiányzó fájl', missing.join(' | '), '');
  await ctx.close();
}

await br.close();
console.log(bad ? `\n${bad} HIBA` : '\nminden rendben');
process.exit(bad ? 1 : 0);
