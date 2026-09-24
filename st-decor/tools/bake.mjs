/* Az arak.txt aktuális tartalmát beírja az index.html-be a markerek közé.

   Az oldalnak JavaScript nélkül is működnie kell, és a Google-nek is valódi
   árakat kell látnia, ezért a lista a HTML-ben is ott van. Mindkét oldal
   ugyanazon a parseren megy át, tehát a besütött másolat és a futásidőben
   kirajzolt lista nem tud mást mondani. Átadás után Tímea az arak.txt-t
   írja, és az oldal élőben onnan tölt — a besütött változat a tartalék. */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseList, joinNotes } from '../assets/list-parse.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const WRAP_AT = 20;

const groups = parseList(readFileSync('arak.txt', 'utf8'));
if (!groups.length) throw new Error('arak.txt semmit nem adott — nem sütök be üres árlistát');

const html = ['      <div class="ar">'];
let rows = 0;

for (const g of groups) {
  html.push('        <div class="ar-g">');
  html.push(`          <h3>${esc(g.title)}</h3>`);
  html.push('          <ul class="ar-l">');
  for (const it of g.items) {
    rows++;
    html.push(
      `            <li><span class="ar-n-t">${esc(it.name)}</span>` +
      '<span class="ar-dot" aria-hidden="true"></span>' +
      `<span class="${it.value.length > WRAP_AT ? 'ar-p wrap' : 'ar-p'}">${esc(it.value)}</span></li>`
    );
  }
  html.push('          </ul>');
  if (g.notes.length) html.push(`          <p class="ar-note">${esc(joinNotes(g.notes))}</p>`);
  html.push('        </div>');
}
html.push('      </div>');

const page = readFileSync('index.html', 'utf8');
const out = page.replace(
  /(<!-- arak:start -->)[\s\S]*?(<!-- arak:end -->)/,
  `$1\n${html.join('\n')}\n      $2`,
);
if (out === page) throw new Error('nem találom az arak markereket az index.html-ben');

writeFileSync('index.html', out);
console.log(`besütve: ${groups.length} csoport, ${rows} tétel`);
