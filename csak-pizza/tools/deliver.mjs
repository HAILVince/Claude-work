/* Delivery renders. The upload path rejects images taller than ~8000px, so:
   - desktop ships as one continuous capture at 0.9x
   - mobile is too long for that, so it ships folded into two columns
   - the order page ships as one desktop capture
   Serve first:  python3 -m http.server 8247 -d csak-pizza                 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync, unlinkSync, writeFileSync } from 'node:fs';

const ROOT = process.env.BASE_URL || 'http://127.0.0.1:8247/';
const B = ROOT + 'index.html';
mkdirSync('screenshots', { recursive: true });
writeFileSync('screenshots/_sheet.html',
  '<!DOCTYPE html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
  'body{padding:26px;display:flex;gap:30px;align-items:flex-start}' +
  'img{width:360px;display:block;border:1px solid #D8D2CC}</style>' +
  '<img src="_c1.png"><img src="_c2.png">');

const br = await chromium.launch();

const open = async (url, w, h, d, m) => {
  const c = await br.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:d,
    isMobile:m, hasTouch:m, reducedMotion:'reduce', colorScheme:'light' });
  // a believable evening time on the sample kitchen ticket
  if (c.clock) await c.clock.setFixedTime(new Date('2026-09-30T18:42:00'));
  const p = await c.newPage();
  await p.goto(url, { waitUntil:'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // the sticky header would repeat down a full-page capture
  await p.addStyleTag({ content: '.hdr{position:static!important}.side{position:static!important}' });
  await p.waitForTimeout(400);
  return { c, p };
};

// --- desktop: one continuous full-length image ---
{
  const { c, p } = await open(B, 1440, 900, 0.9, false);
  await p.screenshot({ path:'screenshots/csak-pizza-desktop.png', fullPage:true });
  await c.close();
}

// --- order page, desktop ---
{
  const { c, p } = await open(ROOT + 'rendeles.html', 1440, 900, 0.9, false);
  await p.screenshot({ path:'screenshots/csak-pizza-rendeles-desktop.png', fullPage:true });
  await c.close();
}

// --- mobile: capture at 2x, then fold into two columns ---
let half;
{
  const { c, p } = await open(B, 360, 780, 2, true);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const W = await p.evaluate(() => document.documentElement.scrollWidth);
  if (W > 360) console.warn(`mobile page is ${W}px wide — horizontal scroll`);
  half = Math.ceil(H / 2);
  await p.screenshot({ path:'screenshots/_c1.png', fullPage:true, clip:{ x:0, y:0, width:360, height:half } });
  await p.screenshot({ path:'screenshots/_c2.png', fullPage:true, clip:{ x:0, y:half, width:360, height:H - half } });
  await c.close();
}
{
  const PAD = 26, GAP = 30, COL = 360;
  const W = PAD*2 + COL*2 + GAP + 4;
  const c = await br.newContext({ viewport:{ width:W, height:half + PAD*2 + 2 }, deviceScaleFactor:1.4 });
  const p = await c.newPage();
  await p.goto(ROOT + 'screenshots/_sheet.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(300);
  await p.screenshot({ path:'screenshots/csak-pizza-mobile.png', fullPage:true });
  await c.close();
}
['_c1.png','_c2.png','_sheet.html'].forEach(f => unlinkSync('screenshots/' + f));
await br.close();
