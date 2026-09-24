import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT = process.argv[2];
const W = Number(process.argv[3]);
const MOB = process.argv[4] === 'mobile';
const BAND = 1000;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: 900 }, deviceScaleFactor: 1,
  isMobile: MOB, hasTouch: MOB, reducedMotion: 'reduce', colorScheme: 'light',
});
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8195/index.html', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0, i = 1; y < H; y += BAND, i++) {
  await page.screenshot({ path: `${OUT}/band-${String(i).padStart(2,'0')}.png`,
    clip: { x: 0, y, width: W, height: Math.min(BAND, H - y) }, fullPage: true });
}
console.log('bands', Math.ceil(H / BAND), 'height', H);
await browser.close();
