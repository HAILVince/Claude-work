/* Szélesség-söprés és viselkedés. 320 pixelen indul, mert egy borlap
   évjáratokkal pont az, ami ott szokott kilógni. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:8196';
const br = await chromium.launch();
let bad = 0;
const is = (n, got, want) => { const o = got === want; if (!o) bad++;
  console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(52)} ${o ? got : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`); };

for (const page of ['index.html', 'adatkezeles.html', '404.html']) {
  for (const w of [320, 360, 390, 414, 480, 560, 620, 768, 820, 1000, 1140, 1280, 1440]) {
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

/* A borlap a txt fájlból jön, és az egész üzenet azon áll, hogy a pince
   maga írja át évjáratváltáskor. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('a borlap csoportokat rajzol', (await p.$$('.bl-g')).length, 3);
  is('minden bor kikerül', (await p.$$('.bl-l li')).length, 5);
  is('az évjárat és a stílus egy sorban', await p.textContent('.bl-l li:first-child .bl-f'), '2024 · száraz');
  is('a csoport megjegyzése is', (await p.textContent('.bl-note')).includes('Érmellék'), true);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/borok.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: '# csak megjegyzés\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('üres fájl mellett marad a besütött borlap', (await p.$$('.bl-g')).length, 3);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/borok.txt', r => r.fulfill({ status: 404, body: '' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('hiányzó fájl mellett is marad a borlap', (await p.$$('.bl-g')).length, 3);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/borok.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8',
      body: '## Új évjárat\nBakator | 2026\nEgy bor mező nélkül\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('az új fájl felülírja a besütöttet', (await p.$$('.bl-g')).length, 1);
  is('mező nélküli bor is kikerül', (await p.$$('.bl-l li')).length, 2);
  is('ahol nincs mező, nincs alsor', (await p.$$('.bl-f')).length, 1);
  await ctx.close();
}

/* Az űrlap. A létszám dönti el, belefér-e a teraszra. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await p.click('#f button[type=submit]');
  is('üres küldés öt mezőt jelöl', (await p.$$('.fld.bad')).length, 5);

  await p.fill('#f-nev', 'Teszt Anna');
  await p.fill('#f-el', 'anna@example.com');
  await p.fill('#f-mikor', '2027. május');
  await p.fill('#f-uzenet', 'Debrecenből jönnénk.');

  await p.fill('#f-fo', '4');
  await p.click('#f button[type=submit]');
  is('négy fő kevés', (await p.$$('.fld.bad')).length, 1);
  is('a hibaüzenet mondja a minimumot', (await p.textContent('.err[data-for="f-fo"]')).includes('10'), true);

  await p.fill('#f-fo', '60');
  await p.click('#f button[type=submit]');
  is('hatvan fő sok', (await p.$$('.fld.bad')).length, 1);

  await p.fill('#f-fo', 'sokan');
  await p.click('#f button[type=submit]');
  is('"sokan" nem létszám', (await p.$$('.fld.bad')).length, 1);

  await p.fill('#f-fo', '18');
  await p.click('#f button[type=submit]');
  is('tizennyolc fő jó', (await p.$$('.fld.bad')).length, 0);
  is('van visszajelzés', await p.isVisible('#ok'), true);
  is('az űrlap kiürül', await p.inputValue('#f-nev'), '');

  /* Aki bort venne, annak nincs se létszáma, se időpontja. */
  await p.selectOption('#f-mit', 'Bort szeretnék venni');
  is('vásárlásnál eltűnik a létszám és az időpont', await p.isVisible('#row-reszletek'), false);
  await p.fill('#f-nev', 'Teszt Anna');
  await p.fill('#f-el', 'anna@example.com');
  await p.fill('#f-uzenet', 'Két üveg Bakatort szeretnék.');
  await p.click('#f button[type=submit]');
  is('vásárlásnál létszám nélkül is átmegy', (await p.$$('.fld.bad')).length, 0);

  await p.selectOption('#f-mit', 'Borkóstoló');
  is('kóstolónál visszajön a két mező', await p.isVisible('#row-reszletek'), true);
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
  await p.click('.nav a[href="#borok"]');
  is('linkre bezárul', await p.isVisible('.nav'), false);
  await p.click('.burger');
  await p.keyboard.press('Escape');
  is('Escape is bezárja', await p.isVisible('.nav'), false);
  await p.click('.burger');
  is('a fejléc gombja nem sötét a sötéten', await p.$eval('.nav-cta', el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
  await ctx.close();
}

/* A borászati oldalnak ki kell írnia a korhatárt. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  for (const page of ['index.html', 'adatkezeles.html', '404.html']) {
    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle' });
    is(`${page}: rajta a korhatár`, await p.isVisible('.ftr-age'), true);
  }
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
