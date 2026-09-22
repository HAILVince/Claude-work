/* Overflow sweep and form behaviour. The form is what the page exists for. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const URL = 'http://127.0.0.1:8192/index.html';
const br = await chromium.launch();
let bad = 0;
const is = (n, got, want) => { const o = got === want; if (!o) bad++;
  console.log(`${o ? 'ok  ' : 'FAIL'} ${n.padEnd(46)} ${o ? got : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`); };

for (const w of [360, 390, 414, 480, 560, 620, 768, 860, 1000, 1180, 1280, 1440]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 860 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  const over = await page.evaluate(w => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.classList.contains('skip')) continue;
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > w + 1 || r.left < -1)) out.push(el.className || el.tagName);
    }
    return out;
  }, w);
  const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
  is(`width ${w}`, over.length === 0 && scroll <= w, true);
  if (over.length) console.log('      overflowing:', [...new Set(over)].slice(0, 6));
  await ctx.close();
}

/* The endpoint is a Pages Function, which the static server does not run, so
   the tests stand in for it — what matters here is what the page does with
   each answer. */
const stubSend = (page, body = { ok: true }, status = 200) =>
  page.route('**/api/foglalas', r =>
    r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }));

{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await stubSend(page);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('#f button[type=submit]');
  is('empty submit flags five fields', (await page.$$('.fld.bad')).length, 5);

  await page.fill('#f-nev', 'Teszt Anna');
  await page.fill('#f-el', 'abc');
  await page.fill('#f-otlet', 'Egy finom vonalas kolibri.');
  await page.fill('#f-hol', 'bal alkar');
  await page.fill('#f-meret', 'kicsi');
  await page.click('#f button[type=submit]');
  is('garbage contact and wordy size rejected', (await page.$$('.fld.bad')).length, 2);

  await page.fill('#f-el', '06 30 123 4567');
  await page.fill('#f-meret', '10 cm');
  const sent = page.waitForRequest(r => r.url().includes('/api/foglalas') && r.method() === 'POST');
  await page.click('#f button[type=submit]');
  const req = await sent;
  is('valid form posts to the endpoint', (await page.$$('.fld.bad')).length, 0);
  is('the post carries the answers', /Teszt Anna/.test(req.postData() || ''), true);
  await page.waitForSelector('#ok:visible');
  is('confirmation shown', await page.isVisible('#ok'), true);
  is('form cleared', await page.inputValue('#f-nev'), '');
  is('no error box on success', await page.isVisible('#sendbad'), false);

  await page.check('#f-elso');
  is('first tattoo shows its note', await page.isVisible('#note-elso'), true);
  is('first tattoo changes nothing else', await page.isDisabled('#f-meret'), false);

  await page.check('#f-korr');
  is('correction relabels the idea field', await page.textContent('label[for="f-otlet"]'), 'Mit javítanál rajta?');
  is('photo becomes required', await page.textContent('#opt-kep'), '(kötelező)');
  is('correction switches off the placement', await page.isDisabled('#f-hol'), true);
  is('correction switches off the size', await page.isDisabled('#f-meret'), true);
  is('switched-off fields are marked', await page.$eval('#f-meret', el => el.closest('.fld').classList.contains('off')), true);
  is('correction shows its note', await page.isVisible('#note-korr'), true);
  is('correction clears first tattoo', await page.isChecked('#f-elso'), false);
  is('correction locks first tattoo', await page.isDisabled('#f-elso'), true);
  is('first-tattoo note goes away', await page.isVisible('#note-elso'), false);

  await page.fill('#f-nev', 'Teszt Anna');
  await page.fill('#f-el', 'anna@example.com');
  await page.fill('#f-otlet', 'A bal szélén kifakult egy vonal.');
  await page.click('#f button[type=submit]');
  is('correction without a photo is blocked', (await page.$$('.fld.bad')).length, 1);
  is('placement is not demanded for a correction', await page.$eval('#f-hol', el => el.closest('.fld').classList.contains('bad')), false);
  is('size is not demanded for a correction', await page.$eval('#f-meret', el => el.closest('.fld').classList.contains('bad')), false);

  await page.uncheck('#f-korr');
  is('unticking gives the placement back', await page.isDisabled('#f-hol'), false);
  is('unticking gives the size back', await page.isDisabled('#f-meret'), false);
  is('unticking unlocks first tattoo', await page.isDisabled('#f-elso'), false);
  is('the note goes away', await page.isVisible('#note-korr'), false);
  is('the idea field is relabelled back', await page.textContent('label[for="f-otlet"]'), 'Mi az elképzelésed?');
  await ctx.close();
}

/* A failed send must never look like a sent one. */
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await stubSend(page, { error: 'Az üzenetet most nem sikerült elküldeni.' }, 502);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.fill('#f-nev', 'Teszt Anna');
  await page.fill('#f-el', 'anna@example.com');
  await page.fill('#f-otlet', 'Egy finom vonalas kolibri.');
  await page.fill('#f-hol', 'bal alkar');
  await page.fill('#f-meret', '10 cm');
  await page.click('#f button[type=submit]');
  await page.waitForSelector('#sendbad:visible');
  is('a failed send says so', await page.isVisible('#sendbad'), true);
  is('a failed send is not a confirmation', await page.isVisible('#ok'), false);
  is('a failed send keeps what was typed', await page.inputValue('#f-nev'), 'Teszt Anna');
  is('the button works again', await page.isDisabled('#send'), false);
  is('the fallback address is offered', await page.isVisible('#sendbad a[href^="mailto:"]'), true);
  is('the honeypot is out of the tab order', await page.getAttribute('#f-web', 'tabindex'), '-1');
  await ctx.close();
}

/* The review rail: empty file -> no rail; reviews -> a scrollable rail. */
const REVIEWS = `# megjegyzés
## Kiss Anna | 2026. augusztus | 5
Első sor.
Második sor.

## Nagy Péter | 2026. július
Egy másik vélemény.

## Kovács Éva
Harmadik.
`;
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  is('no reviews, no rail', await page.isVisible('#rev-box'), false);
  is('the Google button stands alone', await page.isVisible('.rev-cta a'), true);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/velemenyek.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: REVIEWS }));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#rev-box:visible');
  is('every review becomes a card', (await page.$$('.rev-q')).length, 3);
  is('the lines of one review join up', await page.textContent('.rev-q:first-child p:nth-of-type(2)'), 'Első sor. Második sor.');
  is('a missing date is left off', await page.textContent('.rev-q:last-child cite'), 'Kovács Éva');
  is('the default is five stars', await page.textContent('.rev-q:nth-child(2) .rev-st'), '★★★★★');
  is('the count is stated', /3 értékelés/.test(await page.textContent('#rev-count')), true);
  is('the stand-in panel steps aside', await page.isVisible('#rev-panel'), false);
  is('one Google button remains', (await page.$$('#velemenyek a[href*="g.page"]:visible')).length, 1);
  await ctx.close();
}
{
  /* Narrow enough that three cards cannot fit: the arrows must work. */
  const ctx = await br.newContext({ viewport: { width: 900, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/velemenyek.txt', r =>
    r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: REVIEWS }));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#rev-box:visible');
  is('at the start there is nothing to go back to', await page.isDisabled('.rev-nav[data-dir="-1"]'), true);
  const before = await page.$eval('#revs', el => el.scrollLeft);
  await page.click('.rev-nav[data-dir="1"]');
  await page.waitForFunction(x => document.querySelector('#revs').scrollLeft > x + 50, before);
  is('the arrow scrolls the rail', await page.$eval('#revs', el => el.scrollLeft > 50), true);
  await ctx.close();
}

{
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  is('menu starts closed', await page.isVisible('.nav'), false);
  await page.click('.burger');
  is('burger opens it', await page.isVisible('.nav'), true);
  await page.click('.nav a[href="#munkaim"]');
  is('closes on link tap', await page.isVisible('.nav'), false);
  await page.click('.burger');
  await page.keyboard.press('Escape');
  is('closes on Escape', await page.isVisible('.nav'), false);
  await ctx.close();
}

await br.close();
console.log(bad ? `\n${bad} FAILED` : '\nall clean');
process.exit(bad ? 1 : 0);
