/* Behaviour checks. The price file is edited by hand by a non-developer, so
   most of this is about what happens when that file is wrong. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const URL = 'http://127.0.0.1:8191/index.html';
const br = await chromium.launch();
let bad = 0;
const is = (name, got, want) => {
  const okay = got === want;
  if (!okay) bad++;
  console.log(`${okay ? 'ok  ' : 'FAIL'} ${name.padEnd(46)} ${okay ? got : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
};

const open = async (arak) => {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  if (arak !== undefined) {
    await page.route('**/arak.txt', r =>
      arak === null ? r.fulfill({ status: 404, body: '' })
                    : r.fulfill({ status: 200, contentType: 'text/plain; charset=utf-8', body: arak }));
  }
  await page.goto(URL, { waitUntil: 'networkidle' });
  return { ctx, page };
};

const rows = page => page.$$eval('.ar-l li', ls => ls.map(l => [
  l.querySelector('.ar-n').textContent, l.querySelector('.ar-p').textContent].join(' = ')));

/* 1. the real file drives the page */
{
  const { ctx, page } = await open();
  const r = await rows(page);
  is('rows rendered from arak.txt', r.length, 10);
  is('first row', r[0], 'Kiszállás Debrecenben = 4 000 Ft');
  is('non-numeric price survives', r.includes('Számla = minden munkáról adok'), true);
  is('group headings', (await page.$$('.ar-g h3')).length, 4);
  await ctx.close();
}

/* 2. an edit shows up */
{
  const { ctx, page } = await open('## Munkadíj\nJavítás munkadíja | 10 000 Ft/óra\n');
  const r = await rows(page);
  is('edited price replaces the baked one', r[0], 'Javítás munkadíja = 10 000 Ft/óra');
  is('only the edited file is shown', r.length, 1);
  await ctx.close();
}

/* 3. she breaks it — the baked list has to stay */
for (const [name, body] of [
  ['file missing (404)', null],
  ['file emptied', ''],
  ['only comments left', '# minden kikommentelve\n# nincs ár\n'],
  ['pipes deleted', '## Munkadíj\nJavítás munkadíja 9 000 Ft\n'],
  ['heading with no items', '## Munkadíj\n\n## Bojler\n'],
  ['random paste', 'kedves adam\nitt vannak az arak\n'],
]) {
  const { ctx, page } = await open(body);
  const r = await rows(page);
  is(`falls back: ${name}`, r.length, 10);
  await ctx.close();
}

/* 4. partial damage keeps what still parses */
{
  const { ctx, page } = await open(
    '## Munkadíj\nKiszállás | 4 000 Ft\nelrontott sor pipe nélkül\n' +
    '| 40 000 Ft\nMunkadíj | 9 000 Ft\n## Üres csoport\n');
  const r = await rows(page);
  is('bad lines skipped, good ones kept', r.length, 2);
  is('empty group dropped', (await page.$$('.ar-g')).length, 1);
  await ctx.close();
}

/* 4b. a sentence in the price column must not blow the layout out */
{
  const { ctx, page } = await open(
    '## Egyéb\nSzámla | minden munkáról adok, készpénzre és átutalásra is\n');
  const ctx2 = ctx;
  await page.setViewportSize({ width: 360, height: 900 });
  await page.waitForTimeout(150);
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  is('long textual price does not overflow at 360', w <= 360, true);
  await ctx2.close();
}

/* 5. no markup injection from the file */
{
  const { ctx, page } = await open('## <img src=x onerror=alert(1)>\nA <b>név</b> | 1 Ft\n');
  is('heading escaped', await page.$eval('.ar-g h3', h => h.innerHTML), '&lt;img src=x onerror=alert(1)&gt;');
  is('name escaped', await page.$eval('.ar-n', n => n.innerHTML), 'A &lt;b&gt;név&lt;/b&gt;');
  await ctx.close();
}

/* 6. form */
{
  const { ctx, page } = await open();
  await page.click('#f button[type=submit]');
  is('empty submit flags four fields', (await page.$$('.fld.bad')).length, 4);

  await page.fill('#f-nev', 'Teszt Anna');
  await page.fill('#f-el', 'abc');
  await page.selectOption('#f-gep', 'Mosógép');
  await page.fill('#f-hol', 'Debrecen');
  await page.click('#f button[type=submit]');
  is('garbage contact rejected', (await page.$$('.fld.bad')).length, 1);

  await page.fill('#f-el', '06 30 123 4567');
  await page.click('#f button[type=submit]');
  is('phone accepted', (await page.$$('.fld.bad')).length, 0);
  is('confirmation shown', await page.isVisible('#ok'), true);
  is('form cleared', await page.inputValue('#f-nev'), '');

  await page.fill('#f-nev', 'Teszt Anna');
  await page.fill('#f-el', 'anna@example.com');
  await page.selectOption('#f-gep', 'Villanybojler');
  await page.fill('#f-hol', 'Hajdúböszörmény');
  await page.click('#f button[type=submit]');
  is('email accepted', (await page.$$('.fld.bad')).length, 0);
  await ctx.close();
}

/* 7. mobile menu */
{
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  is('menu starts closed', await page.isVisible('.nav'), false);
  await page.click('.burger');
  is('burger opens it', await page.isVisible('.nav'), true);
  is('aria-expanded tracks it', await page.getAttribute('.burger', 'aria-expanded'), 'true');
  await page.click('.nav a[href="#arak"]');
  is('closes on link tap', await page.isVisible('.nav'), false);
  await page.click('.burger');
  await page.keyboard.press('Escape');
  is('closes on Escape', await page.isVisible('.nav'), false);
  await ctx.close();
}

/* 8. width sweep */
for (const w of [360, 390, 414, 480, 560, 600, 768, 860, 1000, 1180, 1280, 1440]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 860, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  const over = await page.evaluate(w => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.classList.contains('skip')) continue;          // parked off-screen on purpose
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

await br.close();
console.log(bad ? `\n${bad} FAILED` : '\nall clean');
process.exit(bad ? 1 : 0);
