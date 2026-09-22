import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8189/index.html';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: 'desktop-full',  width: 1440, height: 900,  dsf: 2, full: true,  mobile: false },
  { name: 'mobile-full',   width: 390,  height: 844,  dsf: 3, full: true,  mobile: true  },
  { name: 'desktop-hero',  width: 1440, height: 900,  dsf: 2, full: false, mobile: false },
  { name: 'mobile-hero',   width: 390,  height: 844,  dsf: 3, full: false, mobile: true  },
];

const browser = await chromium.launch();

for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.dsf,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: 'reduce',       // forces every .reveal visible
    colorScheme: 'light',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // open nothing, close nothing — capture the page in its resting state
  await page.waitForTimeout(400);
  const path = `${OUT}/${s.name}.png`;
  await page.screenshot({ path, fullPage: s.full });
  const dims = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.scrollHeight,
  ]);
  console.log(`${s.name.padEnd(14)} ${s.width}x${s.height} @${s.dsf}x  page=${dims[0]}x${dims[1]}  ${s.full ? 'FULL' : 'fold'}`);
  await ctx.close();
}

await browser.close();
console.log('done');
