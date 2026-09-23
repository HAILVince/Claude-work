/* Az egész demó tétje az, hogy telefonon is jó legyen — Dani pont azért
   kapcsolta ki a Canvás oldalát, mert ott nem volt az. Ezért a szélesség-
   söprés itt nem formaság, és a 320 pixel is benne van, nem csak a 360. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:8194';
const br = await chromium.launch();
let bad = 0;
const is = (n, got, want) => { const o = got === want; if (!o) bad++;
  console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(48)} ${o ? got : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`); };

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

/* A naptár a txt fájlból jön, és az egész üzenet azon áll, hogy Dani maga
   írja át. Ha ez elromlik, a demó érve romlik el. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('a naptár hónapokat rajzol', (await p.$$('.cal-m')).length > 0, true);
  is('vannak szabad napok', (await p.$$('.cal-d')).length > 0, true);
  is('a foglalt nap nem gomb', (await p.$$('.cal-x button')).length, 0);
  is('a hónap megjegyzése kikerül', (await p.textContent('.cal-note')).includes('legkeresettebb'), true);

  const first = await p.$('.cal-d');
  const label = await first.getAttribute('data-date');
  is('a dátum az évszámmal együtt megy az űrlapba', /^2027\./.test(label), true);
  await first.click();
  await p.waitForTimeout(700);
  is('kattintásra kitölti az űrlapot', await p.inputValue('#f-datum'), label);
  is('a dátummező nem hibás ilyenkor', await p.$eval('#f-datum', el => el.closest('.fld').classList.contains('bad')), false);
  await ctx.close();
}

/* Egy elrontott txt ne vigye magával az oldalt. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/idopontok.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: '# csak megjegyzés\nés egy értelmetlen sor\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('értelmetlen fájl mellett marad a besütött naptár', (await p.$$('.cal-m')).length > 0, true);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/idopontok.txt', r => r.fulfill({ status: 404, body: '' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('hiányzó fájl mellett is marad a naptár', (await p.$$('.cal-m')).length > 0, true);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/idopontok.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8',
      body: '## 2028. április\náprilis 1. | szabad\náprilis 8. | BETELT\n' }));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('az új fájl felülírja a besütöttet', (await p.$$('.cal-m')).length, 1);
  is('a BETELT is foglaltnak számít', (await p.$$('.cal-x')).length, 1);
  is('a másik nap szabad marad', (await p.$$('.cal-d')).length, 1);
  await ctx.close();
}

/* Az űrlap. Dátum nélkül nincs értelme a levélnek, ezért az kötelező. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await p.click('#f button[type=submit]');
  is('üres küldés négy mezőt jelöl', (await p.$$('.fld.bad')).length, 4);

  await p.fill('#f-nev', 'Anna és Péter');
  await p.fill('#f-el', 'valami');
  await p.fill('#f-datum', '2027. június 19.');
  await p.fill('#f-uzenet', 'Kb. 90 fő, kerti helyszín.');
  await p.click('#f button[type=submit]');
  is('a rossz elérhetőség fennakad', (await p.$$('.fld.bad')).length, 1);

  await p.fill('#f-el', 'anna@example.com');
  await p.click('#f button[type=submit]');
  is('jó adatokkal átmegy', (await p.$$('.fld.bad')).length, 0);
  is('van visszajelzés', await p.isVisible('#ok'), true);
  is('az űrlap kiürül', await p.inputValue('#f-nev'), '');

  await p.fill('#f-el', '06 30 59 44 888');
  is('a telefonszám is jó elérhetőség', await p.inputValue('#f-el'), '06 30 59 44 888');
  await ctx.close();
}

/* Menü telefonon. */
{
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  is('a menü zárva indul', await p.isVisible('.nav'), false);
  await p.click('.burger');
  is('a hamburger nyitja', await p.isVisible('.nav'), true);
  await p.click('.nav a[href="#rolam"]');
  is('linkre bezárul', await p.isVisible('.nav'), false);
  await p.click('.burger');
  await p.keyboard.press('Escape');
  is('Escape is bezárja', await p.isVisible('.nav'), false);

  /* A fejléc gombja sötét alapon világos szöveg — ezt egy korábbi oldalon
     elrontotta a `.nav a` nagyobb súlya, úgyhogy itt tesztelem. */
  await p.click('.burger');
  const cta = await p.$eval('.nav-cta', el => getComputedStyle(el).color);
  is('a fejléc gombja nem sötét a sötéten', cta, 'rgb(255, 255, 255)');
  await ctx.close();
}

/* Minden hivatkozott fájl létezik. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const missing = [];
  p.on('response', r => { if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`); });
  await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await p.goto(`${BASE}/adatkezeles.html`, { waitUntil: 'networkidle' });
  await p.goto(`${BASE}/404.html`, { waitUntil: 'networkidle' });
  is('nincs hiányzó fájl', missing.join(' | '), '');
  await ctx.close();
}

await br.close();
console.log(bad ? `\n${bad} HIBA` : '\nminden rendben');
process.exit(bad ? 1 : 0);
