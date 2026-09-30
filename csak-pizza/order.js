import { parseMenu, toFt, ft } from './assets/price-parse.js';

/* A picture of the order flow, not a shop. Nothing leaves the browser:
   "Megrendelem" only shows what the customer and the kitchen would see.
   The live version would post the order to the shop's own backend, take
   card payments through a Hungarian payment provider straight to the shop's
   account, and push the ticket to the kitchen printer. */

const PACK = 100;           // one-off packaging fee, from the current menu
const MIN = 2000;           // minimum order in Tatabánya
const MIN_FAR = 3000;       // minimum order outside Tatabánya

const $ = s => document.querySelector(s);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

let groups = [];
const byId = new Map();          // item id -> { item, group }
const cart = new Map();          // key "id|sizeIndex" -> qty
const form = $('#order');

/* ---------- menu picker ---------- */
function showGroup(g) {
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.id === g.id)));
  $('#pick-h').textContent = g.title;
  $('#pick-note').textContent = g.cols
    ? 'Koppintson a méretre, és a pizza a kosárba kerül.'
    : 'Koppintson az árra, és a tétel a kosárba kerül.';
  const list = $('#pick-list');
  list.replaceChildren();
  for (const it of g.items) {
    const li = el('li', 'pick-row');
    const name = el('div');
    name.append(el('span', 'mt-n', it.name));
    if (it.desc) name.append(el('span', 'mt-d', it.desc));
    const sizes = el('div', 'sizes');
    it.prices.forEach((p, i) => {
      if (!p) return;
      const b = el('button', 'add');
      b.type = 'button';
      b.append(el('b', null, g.cols ? g.cols[i] : 'Kosárba'), document.createTextNode(ft(toFt(p))));
      b.setAttribute('aria-label', `${it.name}${g.cols ? ', ' + g.cols[i] : ''}, ${ft(toFt(p))}, kosárba`);
      b.addEventListener('click', () => {
        add(it.id, i);
        b.classList.add('hit');
        setTimeout(() => b.classList.remove('hit'), 500);
      });
      sizes.append(b);
    });
    li.append(name, sizes);
    list.append(li);
  }
}

function buildTabs() {
  const tabs = $('#tabs');
  tabs.replaceChildren();
  for (const g of groups) {
    const t = el('button', 'tab', g.title.replace(/^Pizza, /, 'Pizza: '));
    t.type = 'button';
    t.setAttribute('role', 'tab');
    t.dataset.id = g.id;
    t.addEventListener('click', () => showGroup(g));
    tabs.append(t);
  }
}

/* ---------- cart ---------- */
function add(id, size, n = 1) {
  const k = `${id}|${size}`;
  const q = (cart.get(k) || 0) + n;
  if (q <= 0) cart.delete(k); else cart.set(k, q);
  render();
}

function lines() {
  return [...cart].map(([k, qty]) => {
    const [id, s] = k.split('|');
    const { item, group } = byId.get(id);
    const size = group.cols ? group.cols[+s] : '';
    const unit = toFt(item.prices[+s]);
    return { k, qty, item, group, size, unit, total: unit * qty };
  });
}

function state() {
  const f = new FormData(form);
  const zone = $('#zona').selectedOptions[0];
  const mode = f.get('mode');
  const far = mode === 'kiszallitas' && zone.hasAttribute('data-far');
  const ls = lines();
  const sub = ls.reduce((a, l) => a + l.total, 0);
  const del = mode === 'kiszallitas' ? +zone.dataset.fee : 0;
  return {
    f, mode, zone: zone.textContent, far, ls, sub, del,
    pack: ls.length ? PACK : 0,
    tot: ls.length ? sub + PACK + del : 0,
    min: far ? MIN_FAR : MIN,
  };
}

function render() {
  const st = state();
  const ul = $('#cart');
  ul.replaceChildren();
  for (const l of st.ls) {
    const li = el('li');
    const n = el('span', 'c-n', l.item.name);
    if (l.size) n.append(el('span', 'c-s', l.size));
    const q = el('span', 'qty');
    const minus = el('button', null, '−'); minus.type = 'button';
    minus.setAttribute('aria-label', `Eggyel kevesebb: ${l.item.name}`);
    minus.addEventListener('click', () => add(l.item.id, l.k.split('|')[1], -1));
    const plus = el('button', null, '+'); plus.type = 'button';
    plus.setAttribute('aria-label', `Eggyel több: ${l.item.name}`);
    plus.addEventListener('click', () => add(l.item.id, l.k.split('|')[1], 1));
    q.append(minus, el('span', null, String(l.qty)), plus);
    li.append(n, q, el('span', 'c-p', ft(l.total)));
    ul.append(li);
  }
  $('#empty').hidden = st.ls.length > 0;
  $('#s-sub').textContent = ft(st.sub);
  $('#s-pack').textContent = ft(st.pack);
  $('#s-del').textContent = ft(st.del);
  $('#r-del').hidden = st.mode !== 'kiszallitas';
  $('#s-tot').textContent = ft(st.tot);
  $('#hdr-n').textContent = `(${st.ls.reduce((a, l) => a + l.qty, 0)})`;

  const warn = $('#warn');
  if (st.ls.length && st.sub < st.min) {
    warn.hidden = false;
    warn.textContent = `A legkisebb rendelés ${st.far ? 'Tatabányán kívülre ' : ''}${ft(st.min)}. Még ${ft(st.min - st.sub)} hiányzik.`;
  } else warn.hidden = true;

  $('#addr').hidden = st.mode !== 'kiszallitas';
  $('#mode-hint').textContent = st.mode === 'kiszallitas'
    ? 'Kiszállítás 50–85 perc alatt.'
    : 'Elvitel: Tatabánya, Erkel Ferenc utca 4.';

  ticket(st);
}

/* ---------- the kitchen ticket ---------- */
const PAY = {
  online: ['Fizetve online, kártyával', true],
  szep: ['Fizetve online, SZÉP-kártyával', true],
  kp: ['Fizetendő készpénzben', false],
  kartya: ['Fizetendő kártyával, vigyen terminált', false],
};

function ticket(st) {
  const t = $('#ticket');
  t.replaceChildren();
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const when = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}. ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const hr = () => el('hr', 't-rule');

  t.append(el('p', 't-shop', 'Csak Pizza'), el('p', 't-addr', 'Tatabánya, Erkel Ferenc u. 4. · +36 30 861 7969'), hr());
  const no = el('p', 't-no');
  no.append(el('span', null, 'Rendelés 1042'), el('span', null, 'minta'));
  t.append(no, el('p', 't-when', `Beérkezett: ${when}`));
  t.append(el('p', 't-mode', st.mode === 'kiszallitas' ? 'KISZÁLLÍTÁS' : 'ELVITEL'));

  const c = el('div', 't-cust');
  c.append(el('p', null, st.f.get('nev') || '(név)'), el('p', 't-big', st.f.get('tel') || '(telefonszám)'));
  if (st.mode === 'kiszallitas') {
    c.append(el('p', 't-big', `${st.zone}, ${st.f.get('utca') || '(utca, házszám)'}`));
    if (st.f.get('ajto')) c.append(el('p', null, st.f.get('ajto')));
  }
  t.append(c);
  if (st.f.get('megj')) t.append(el('p', 't-note', `Megjegyzés: ${st.f.get('megj')}`));
  t.append(hr());

  const tb = el('table', 't-items');
  const body = el('tbody');
  for (const l of st.ls) {
    const tr = el('tr');
    const name = el('td');
    name.append(el('span', 't-it', l.item.name));
    if (l.size) name.append(el('span', 't-sz', l.size));
    tr.append(el('td', null, `${l.qty}×`), name, el('td', null, ft(l.total)));
    body.append(tr);
  }
  if (!st.ls.length) {
    const tr = el('tr'); const td = el('td', null, 'A kosár üres.'); td.colSpan = 3; tr.append(td); body.append(tr);
  }
  tb.append(body);
  t.append(tb, hr());

  const sum = el('table', 't-sum');
  const sb = el('tbody');
  const row = (a, b, cls) => { const tr = el('tr', cls); tr.append(el('td', null, a), el('td', null, b)); sb.append(tr); };
  row('Étel, ital', ft(st.sub));
  row('Csomagolás', ft(st.pack));
  if (st.mode === 'kiszallitas') row('Kiszállítás', ft(st.del));
  row('Összesen', ft(st.tot), 't-tot');
  sum.append(sb);
  t.append(sum);

  const [label, paid] = PAY[st.f.get('fiz')] || PAY.kp;
  t.append(el('p', 't-pay', paid ? label.toUpperCase() : `${label.toUpperCase()}: ${ft(st.tot)}`));
  t.append(hr(), el('p', 't-foot', 'Rendelés a csakpizza.hu oldalon'));
}

/* ---------- submit ---------- */
form.addEventListener('input', render);
form.addEventListener('change', render);
form.addEventListener('submit', e => {
  e.preventDefault();
  const st = state();
  const done = $('#done');
  const miss = [];
  if (!st.ls.length) miss.push('tegyen valamit a kosárba');
  if (st.ls.length && st.sub < st.min) miss.push(`a legkisebb rendelés ${ft(st.min)}`);
  if (!st.f.get('nev')) miss.push('adja meg a nevét');
  if (!st.f.get('tel')) miss.push('adja meg a telefonszámát');
  if (st.mode === 'kiszallitas' && !st.f.get('utca')) miss.push('adja meg az utcát és a házszámot');
  done.hidden = false;
  if (miss.length) {
    done.textContent = 'Még hiányzik: ' + miss.join(', ') + '.';
    return;
  }
  const online = ['online', 'szep'].includes(st.f.get('fiz'));
  done.textContent = (online ? 'Itt nyílna meg a kártyás fizetés. ' : '') +
    `Köszönjük, a rendelés megérkezett a konyhára (minta, valójában nem ment el). ` +
    (st.mode === 'kiszallitas' ? 'Várható érkezés: 50–85 perc.' : 'Kb. 20 perc múlva jöhet érte.');
});
$('#print').addEventListener('click', () => window.print());

/* ---------- start ---------- */
async function start() {
  let text;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    $('#pick-list').replaceChildren(el('li', 'pick-row', 'Az étlapot most nem sikerült betölteni. Telefonon is rendelhet: +36 30 861 7969.'));
    return;
  }
  groups = parseMenu(text);
  for (const g of groups) for (const it of g.items) byId.set(it.id, { item: it, group: g });
  if (!groups.length) return;
  buildTabs();
  showGroup(groups[0]);

  // A filled sample basket, so the ticket has something on it.
  const seed = [['pizza-paradicsomos-alap--sonkas-kukoricas', 1, 2], ['pizza-tejfolos-alap--juh-asz', 2, 1], ['udito-es-sor--coca-cola', 0, 1]];
  for (const [id, s, n] of seed) if (byId.has(id)) cart.set(`${id}|${s}`, n);
  render();
}
start();
