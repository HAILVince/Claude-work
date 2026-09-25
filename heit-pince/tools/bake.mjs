/* A borok.txt aktuális tartalmát beírja az index.html-be a markerek közé.

   Az oldalnak JavaScript nélkül is működnie kell, és a Google-nek is valódi
   borneveket kell látnia, ezért a lista a HTML-ben is ott van. Mindkét oldal
   ugyanazon a parseren megy át, tehát a besütött másolat és a futásidőben
   kirajzolt lista nem tud mást mondani. */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseList, joinNotes } from '../assets/list-parse.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const groups = parseList(readFileSync('borok.txt', 'utf8'));
if (!groups.length) throw new Error('borok.txt semmit nem adott — nem sütök be üres borlapot');

const html = ['      <div class="bl">'];
let rows = 0;

for (const g of groups) {
  html.push('        <div class="bl-g">');
  html.push(`          <h3>${esc(g.title)}</h3>`);
  html.push('          <ul class="bl-l">');
  for (const it of g.items) {
    rows++;
    html.push('            <li>');
    html.push(`              <p class="bl-n">${esc(it.name)}</p>`);
    if (it.fields.length) html.push(`              <p class="bl-f">${esc(it.fields.join(' · '))}</p>`);
    html.push('            </li>');
  }
  html.push('          </ul>');
  if (g.notes.length) html.push(`          <p class="bl-note">${esc(joinNotes(g.notes))}</p>`);
  html.push('        </div>');
}
html.push('      </div>');

const page = readFileSync('index.html', 'utf8');
const out = page.replace(
  /(<!-- borok:start -->)[\s\S]*?(<!-- borok:end -->)/,
  `$1\n${html.join('\n')}\n      $2`,
);
if (out === page) throw new Error('nem találom a borok markereket az index.html-ben');

writeFileSync('index.html', out);
console.log(`besütve: ${groups.length} csoport, ${rows} bor`);
