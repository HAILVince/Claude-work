/* The client's photos are 2000px+ JPEGs, ~1.3 MB each. Re-encode them for the
   web through Chromium's canvas: no image library is installed here, and the
   browser is already a dependency for the screenshots. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'assets/gallery', OUT = 'assets/gallery-web';
const WIDTH = 1400, QUALITY = 0.82;
mkdirSync(OUT, { recursive: true });

const br = await chromium.launch();
const page = await (await br.newContext()).newPage();
await page.goto('about:blank');

for (const f of readdirSync(SRC).filter(n => n.endsWith('.jpg')).sort()) {
  const b64 = readFileSync(`${SRC}/${f}`).toString('base64');
  const out = await page.evaluate(async ([data, width, q]) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/jpeg;base64,' + data; });
    const scale = Math.min(1, width / img.naturalWidth);
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return { url: c.toDataURL('image/jpeg', q), w: c.width, h: c.height };
  }, [b64, WIDTH, QUALITY]);

  const buf = Buffer.from(out.url.split(',')[1], 'base64');
  writeFileSync(`${OUT}/${f}`, buf);
  console.log(`${f.padEnd(28)} ${out.w}x${out.h}  ${(buf.length / 1024).toFixed(0)} kB`);
}
await br.close();
