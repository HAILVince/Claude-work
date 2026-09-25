/* Self-host the webfonts. Google's CSS serves one file per (weight, subset);
   for variable families several weights point at the SAME file, so download
   each unique URL once and let the @font-face blocks share it. Keeping the
   weight in the filename was the fix for an earlier collision bug. */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';

const CSS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600'
          + '&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
         + '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const KEEP = new Set(['latin', 'latin-ext']);
const SLUG = { 'Fraunces': 'fraunces', 'Nunito Sans': 'nunitosans' };

mkdirSync('assets/fonts', { recursive: true });

const css = await (await fetch(CSS, { headers: { 'User-Agent': UA } })).text();

// each block is preceded by a /* subset */ comment
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
const urlToFile = new Map();
const out = ["/* Self-hosted webfonts — no third-party requests (GDPR-safe). */\n"];
let kept = 0;

for (const [, subset, block] of blocks) {
  if (!KEEP.has(subset)) continue;
  const fam = /font-family:\s*'([^']+)'/.exec(block)[1];
  const wght = /font-weight:\s*(\d+)/.exec(block)[1];
  const url = /url\((https:[^)]+)\)/.exec(block)[1];

  let file = urlToFile.get(url);
  if (!file) {
    file = `${SLUG[fam]}-${wght}-${subset}.woff2`;
    const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
    writeFileSync(`assets/fonts/${file}`, buf);
    urlToFile.set(url, file);
    console.log(`fetched ${file.padEnd(34)} ${buf.length} bytes`);
  }
  out.push(block.replace(/url\(https:[^)]+\)/, `url(fonts/${file})`).trim() + '\n');
  kept++;
}

writeFileSync('assets/fonts.css', out.join('\n'));
console.log(`\n${kept} @font-face blocks, ${urlToFile.size} unique files`);
for (const f of urlToFile.values()) if (!existsSync(`assets/fonts/${f}`)) throw new Error('missing ' + f);
