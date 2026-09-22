/* The artifact preview is index.html with the document shell stripped: the
   host page supplies <html>, <head> and <body>, so those tags are removed and
   `body id="top"` becomes a plain anchor. Generated, never hand-edited. */
import { readFileSync, writeFileSync } from 'node:fs';

const out = readFileSync('index.html', 'utf8')
  .replace(/^[\s\S]*?<title>/, '<title>')
  .replace(/<\/head>\s*<body id="top">/, '<div id="top"></div>')
  .replace(/<\/body>\s*<\/html>\s*$/, '');

writeFileSync('artifact/index.html', out.trimEnd() + '\n');
console.log('artifact/index.html written —', out.length, 'bytes');
