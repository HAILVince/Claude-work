/* Line drawings of the things on the shop's shelves: jars, bottles, tea
   boxes, paper bags, cartons, pouches. They stand in for product photos
   until the shop sends its own. Shared by script.js (runtime) and
   tools/bake.mjs (build time) so both draw the same picture.

   Every shape is drawn standing on a base line `b`, from left edge `x`,
   `w` wide and `h` tall. Colours come from CSS via currentColor-free
   classes: .pk (white body, ink line), .pk-i (solid ink), .pk-l (label). */

const r = (x, y, w, h, c = 'pk') =>
  `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const poly = (pts, c = 'pk') =>
  `<polygon class="${c}" points="${pts.map(p => p.join(',')).join(' ')}"/>`;
const line = (x1, y1, x2, y2) =>
  `<line class="pk-ln" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;

/* a label with two text lines on it */
const label = (x, y, w, h) =>
  r(x, y, w, h, 'pk-l') +
  line(x + w * 0.15, y + h * 0.38, x + w * 0.85, y + h * 0.38) +
  line(x + w * 0.15, y + h * 0.66, x + w * 0.6, y + h * 0.66);

export const shapes = {
  jar(x, b, w, h) {
    const lid = h * 0.16, top = b - h;
    return r(x + w * 0.06, top, w * 0.88, lid, 'pk-i') +
      r(x, top + lid, w, h - lid) +
      label(x + w * 0.14, top + h * 0.38, w * 0.72, h * 0.34);
  },
  bottle(x, b, w, h) {
    const top = b - h;
    return r(x + w * 0.33, top, w * 0.34, h * 0.1, 'pk-i') +
      r(x + w * 0.3, top + h * 0.1, w * 0.4, h * 0.26) +
      poly([[x + w * 0.3, top + h * 0.36], [x + w * 0.7, top + h * 0.36], [x + w, top + h * 0.46], [x + w, b], [x, b], [x, top + h * 0.46]]) +
      label(x + w * 0.12, top + h * 0.56, w * 0.76, h * 0.26);
  },
  dropper(x, b, w, h) {
    const top = b - h;
    return r(x + w * 0.3, top, w * 0.4, h * 0.2, 'pk-i') +
      r(x + w * 0.2, top + h * 0.2, w * 0.6, h * 0.1) +
      r(x, top + h * 0.3, w, h * 0.7) +
      label(x + w * 0.12, top + h * 0.5, w * 0.76, h * 0.3);
  },
  box(x, b, w, h) {
    const top = b - h;
    return r(x, top, w, h) + r(x, top, w, h * 0.16, 'pk-i') +
      label(x + w * 0.12, top + h * 0.34, w * 0.76, h * 0.4);
  },
  bag(x, b, w, h) {
    const top = b - h, fold = top + h * 0.22;
    return poly([[x + w * 0.08, top], [x + w * 0.92, top], [x + w, fold], [x + w, b], [x, b], [x, fold]]) +
      line(x, fold, x + w, fold) +
      label(x + w * 0.12, top + h * 0.42, w * 0.76, h * 0.34);
  },
  carton(x, b, w, h) {
    const top = b - h, shoulder = top + h * 0.2;
    return r(x + w * 0.2, top, w * 0.6, h * 0.06, 'pk-i') +
      poly([[x + w * 0.2, top + h * 0.06], [x + w * 0.8, top + h * 0.06], [x + w, shoulder], [x, shoulder]]) +
      r(x, shoulder, w, b - shoulder) +
      label(x + w * 0.12, top + h * 0.42, w * 0.76, h * 0.32);
  },
  pouch(x, b, w, h) {
    const top = b - h;
    return poly([[x + w * 0.04, top], [x + w * 0.96, top], [x + w, b], [x, b]]) +
      r(x + w * 0.04, top, w * 0.92, h * 0.1, 'pk-i') +
      line(x + w * 0.04, top + h * 0.2, x + w * 0.96, top + h * 0.2) +
      label(x + w * 0.14, top + h * 0.38, w * 0.72, h * 0.36);
  },
};

/* Which drawing fits a product name from arak.txt. */
export function packFor(name) {
  const n = String(name).toLowerCase();
  if (/liszt|cukor|só\b/.test(n)) return 'bag';
  if (/tea|filter/.test(n)) return 'box';
  if (/ital|tej\b|lé\b|szörp/.test(n)) return 'carton';
  if (/olaj|ecet/.test(n)) return 'bottle';
  if (/csepp|tinktúra|kivonat/.test(n)) return 'dropper';
  if (/zsír|krém|méz|vaj|lekvár|eritrit|xilit/.test(n)) return 'jar';
  return 'pouch';
}

/* Picture for a product card: one pack standing on the card's shelf. */
export function packSvg(name) {
  const kind = packFor(name);
  const size = { bag: [96, 150], box: [120, 110], carton: [84, 160], bottle: [70, 160],
    dropper: [60, 110], jar: [104, 120], pouch: [104, 140] }[kind];
  const [w, h] = size;
  return `<svg viewBox="0 0 200 170" width="200" height="170" focusable="false">${shapes[kind](100 - w / 2, 168, w, h)}</svg>`;
}
