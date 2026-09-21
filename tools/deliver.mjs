/* Delivery renders. The upload path rejects images taller than ~8000px, so:
   - desktop ships as one continuous capture at 0.9x  (1296 x ~7950)
   - mobile is too long for that, so it ships folded into two columns        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { unlinkSync } from 'node:fs';

const B = 'http://127.0.0.1:8181/index.html';
const br = await chromium.launch();

const open = async (w, h, d, m) => {
  const c = await br.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:d,
    isMobile:m, hasTouch:m, reducedMotion:'reduce', colorScheme:'light' });
  const p = await c.newPage();
  await p.goto(B, { waitUntil:'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  return { c, p };
};

// --- desktop: one continuous full-length image ---
{
  const { c, p } = await open(1440, 900, 0.9, false);
  await p.screenshot({ path:'screenshots/desktop-full.png', fullPage:true });
  await c.close();
}

// --- mobile: capture at 2x, then fold into two columns ---
let half;
{
  const { c, p } = await open(390, 844, 2, true);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  half = Math.ceil(H / 2);
  await p.screenshot({ path:'screenshots/_c1.png', fullPage:true,
    clip:{ x:0, y:0, width:390, height:half } });
  await p.screenshot({ path:'screenshots/_c2.png', fullPage:true,
    clip:{ x:0, y:half, width:390, height:H - half } });
  await c.close();
}
{
  const PAD = 26, GAP = 30, COL = 390;
  const W = PAD*2 + COL*2 + GAP + 4;
  const c = await br.newContext({ viewport:{ width:W, height:half + PAD*2 + 2 }, deviceScaleFactor:1.4 });
  const p = await c.newPage();
  await p.goto(`http://127.0.0.1:8181/screenshots/_sheet.html`, { waitUntil:'networkidle' });
  await p.waitForTimeout(300);
  await p.screenshot({ path:'screenshots/mobile-full.png', fullPage:true });
  await c.close();
}
unlinkSync('screenshots/_c1.png'); unlinkSync('screenshots/_c2.png');
await br.close();
