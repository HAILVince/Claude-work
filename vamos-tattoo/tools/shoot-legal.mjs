/* One full shot of the privacy notice, and a tight crop of the new footer
   row, so the client can see both without opening the live page. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const br = await chromium.launch();

{
  const c = await br.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.9, colorScheme: 'light' });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8192/adatkezeles.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'screenshots/adatkezeles.png', fullPage: true });
  console.log('adatkezeles ok');
  await c.close();
}
{
  const c = await br.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8192/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('.ftr');
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await el.screenshot({ path: 'screenshots/lablec.png' });
  console.log('lablec ok');
  await c.close();
}
await br.close();
