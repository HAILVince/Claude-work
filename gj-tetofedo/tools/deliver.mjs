/* Delivery renders. The upload path rejects images taller than ~8000px, so:
   - desktop ships as one continuous capture at 0.9x  (1296 x ~7950)
   - mobile is too long for that, so it ships folded into columns            */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { unlinkSync, writeFileSync } from 'node:fs';

const B = process.env.BASE_URL || 'http://127.0.0.1:8191/index.html';
const ROOT = B.replace(/[^/]*$/, '');
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

// --- mobile: capture at 2x, then fold into as many columns as keep the
//     sheet under ~7900px tall (this page is long, so usually three) ---
const PAD = 26, GAP = 30, COL = 390, SHEET_DSF = 1.4, MAX_H = 7900;
let cols, part;
{
  const { c, p } = await open(390, 844, 2, true);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  cols = Math.max(2, Math.ceil(H * SHEET_DSF / (MAX_H - PAD * 2 * SHEET_DSF)));
  part = Math.ceil(H / cols);
  for (let i = 0; i < cols; i++) {
    const y = i * part;
    await p.screenshot({ path:`screenshots/_c${i + 1}.png`, fullPage:true,
      clip:{ x:0, y, width:390, height:Math.min(part, H - y) } });
  }
  await c.close();
}
writeFileSync('screenshots/_sheet.html',
  '<!DOCTYPE html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
  `body{padding:${PAD}px;display:flex;gap:${GAP}px;align-items:flex-start}` +
  `img{width:${COL}px;display:block;border:1px solid #D2DFE8}</style>` +
  Array.from({ length: cols }, (_, i) => `<img src="_c${i + 1}.png">`).join(''));
{
  const W = PAD*2 + COL*cols + GAP*(cols - 1) + 2*cols;
  const c = await br.newContext({ viewport:{ width:W, height:part + PAD*2 + 2 }, deviceScaleFactor:SHEET_DSF });
  const p = await c.newPage();
  await p.goto(ROOT + 'screenshots/_sheet.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(300);
  await p.screenshot({ path:'screenshots/mobile-full.png', fullPage:true });
  await c.close();
}
for (let i = 0; i < cols; i++) unlinkSync(`screenshots/_c${i + 1}.png`);
unlinkSync('screenshots/_sheet.html');
await br.close();
