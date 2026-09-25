/* Egy parser a borok.txt-hez, amit a böngésző futásidőben és a
   tools/bake.mjs a beírásnál is használ — így a HTML-be sütött borlista és a
   fájlból kirajzolt nem tud mást mondani.

   A fájlt kézzel szerkeszti valaki, aki nem programozó, ezért minden szabály
   puhán bukik: az ismeretlen sort átugorjuk, a tétel nélküli csoportot
   eldobjuk, és egy használhatatlan fájl érintetlenül hagyja az oldalt. Egy
   borlap, ami egy elgépelt karakter miatt kiürül, rosszabb, mint ha nem is
   lenne borlap.

   A sor alakja:  Név | mező | mező | ...
   Az első a bor neve, a többi mellé kerül (évjárat, stílus, bármi). */

export function parseList(text) {
  const groups = [];
  let group = null;

  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('##')) {
      group = { title: line.slice(2).trim(), items: [], notes: [] };
      groups.push(group);
      continue;
    }
    if (line.startsWith('#')) continue;      // neki szóló megjegyzés, nem az oldalnak
    if (!group) continue;                    // bármi az első cím előtt

    if (line.startsWith('>')) {
      const note = line.slice(1).trim();
      if (note) group.notes.push(note);
      continue;
    }

    const parts = line.split('|').map(s => s.trim());
    const name = parts.shift();
    const fields = parts.filter(Boolean);
    if (!name) continue;
    group.items.push({ name, fields });
  }

  // Egy cím, amit beírt, de még nem töltött ki, ne rajzoljon üres dobozt.
  return groups.filter(g => g.items.length);
}

/* Az egymás utáni `>` sorok egy tördelt mondatként olvasandók, mert így is
   vannak írva a fájlban. */
export function joinNotes(notes) {
  return notes.join(' ');
}
