/* Mi kerül ki az élesbe.

   A repóban a weboldal mellett ott van a brief a megbízás árával, a
   képernyőképek és a munkaeszközök is. Ha a tárhely egyszerűen kiteszi a
   mappát, ezek mind letölthetők lennének a domainről — a brief a
   legrosszabb, mert abban az ár és a fizetési bontás áll.

   Ezért nem a mappát tesszük ki, hanem összeállítunk egy `dist` könyvtárat,
   amiben csak az van, ami a látogatóé. Ami nincs felsorolva, az nem megy ki.

   A Cloudflare Pages beállítása ehhez:
     Root directory          vamos-tattoo
     Build command           node tools/build.mjs
     Build output directory  dist

   A `functions/` mappa szándékosan nincs a listában: azt a Pages a projekt
   gyökeréből olvassa, nem a kimenetből, és nem is statikus fájlként. */

import { cp, mkdir, rm, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const PUBLIC = [
  'index.html',
  '404.html',
  'adatkezeles.html',
  'styles.css',
  'script.js',
  'velemenyek.txt',
  'assets',
];

/* A `-src` végű mappákban az eredeti, vágatlan fotók vannak. Azok a repóé:
   az oldal a kicsinyített változatokat használja, és fölöslegesen tíz
   megabájttal hizlalnák az élest. */
const isSource = name => name.endsWith('-src');

const OUT = 'dist';

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

let files = 0;
let bytes = 0;

async function count(path) {
  const s = await stat(path);
  if (s.isFile()) { files++; bytes += s.size; return; }
  for (const e of await readdir(path)) await count(join(path, e));
}

for (const name of PUBLIC) {
  await cp(name, join(OUT, name), {
    recursive: true,
    filter: src => !isSource(src.split('/').pop()),
  });
  await count(join(OUT, name));
}

console.log(`${OUT}: ${files} fájl, ${(bytes / 1048576).toFixed(1)} MB`);
