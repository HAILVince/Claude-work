/* Az előnézeti példány az index.html a dokumentumkeret nélkül: a
   befogadó oldal adja a <html>, <head> és <body> elemeket. Generált
   fájl, kézzel nem szerkesztendő. */
import { readFileSync, writeFileSync } from 'node:fs';

const out = readFileSync('index.html', 'utf8')
  .replace(/^[\s\S]*?<title>/, '<title>')
  .replace(/<\/head>\s*<body id="top">/, '<div id="top"></div>')
  .replace(/<\/body>\s*<\/html>\s*$/, '');

writeFileSync('artifact/index.html', out.trimEnd() + '\n');
console.log('artifact/index.html kész —', out.length, 'bájt');
