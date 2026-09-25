import { parsePrices, joinNotes } from './assets/price-parse.js';

/* ---------- prices ----------------------------------------------------
   index.html ships with the price list already in it, so the page is
   complete without JavaScript and search engines see real numbers. This
   only replaces that block when arak.txt loads AND parses into something
   usable; on any failure the baked-in list simply stays. */

const priceSlot = document.querySelector('#arak .wrap');

function renderPrices(groups) {
  const grid = document.createElement('div');
  grid.className = 'ar';

  for (const g of groups) {
    const box = document.createElement('div');
    box.className = 'ar-g reveal';

    const h = document.createElement('h3');
    h.textContent = g.title;
    box.append(h);

    const ul = document.createElement('ul');
    ul.className = 'ar-l';
    for (const it of g.items) {
      const li = document.createElement('li');
      const n = document.createElement('span');
      n.className = 'ar-n';
      n.textContent = it.name;
      const d = document.createElement('span');
      d.className = 'ar-dot';
      d.setAttribute('aria-hidden', 'true');
      const p = document.createElement('span');
      p.className = it.price.length > 14 ? 'ar-p wrap' : 'ar-p';
      p.textContent = it.price;
      li.append(n, d, p);
      ul.append(li);
    }
    box.append(ul);

    if (g.notes.length) {
      const note = document.createElement('p');
      note.className = 'ar-note';
      note.textContent = joinNotes(g.notes);
      box.append(note);
    }
    grid.append(box);
  }
  return grid;
}

async function loadPrices() {
  if (!priceSlot) return;
  let groups;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parsePrices(await res.text());
  } catch {
    return;                                   // offline, blocked, whatever — keep the baked list
  }
  if (!groups.length) return;                 // file emptied or mangled — keep the baked list

  const old = priceSlot.querySelector('.ar');
  const fresh = renderPrices(groups);
  if (old) old.replaceWith(fresh);
  else priceSlot.querySelector('.ar-foot').before(fresh);
  observe(fresh.querySelectorAll('.reveal'));
}

/* ---------- menu ---------- */

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
});

/* ---------- reveal ---------- */

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = still ? null : new IntersectionObserver((entries, obs) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    obs.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });

function observe(nodes) {
  for (const el of nodes) {
    if (io) io.observe(el);
    else el.classList.add('in');
  }
}
observe(document.querySelectorAll('.reveal'));

/* ---------- booking ----------------------------------------------------
   Demo data only. In the live site the free slots come from her calendar
   (the LeadConnector calendar she already has, or a free Google Calendar
   booking page), and a booked slot disappears from everyone's list. */

const DAYNAME = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
const MONTH = ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];
const PATTERN = [
  ['9:00', '11:00', '14:00', '16:30'],
  ['10:00', '15:00'],
  [],                                   // one full day, so the empty state shows
  ['9:00', '13:00', '17:00'],
  ['11:00', '14:00', '16:30'],
  ['9:00', '10:30'],
];

const daysEl = document.querySelector('#days');
const slotsEl = document.querySelector('#slots');
const sumEl = document.querySelector('#sum');
const slotErr = document.querySelector('#slot-err');
let pick = null;

function workdays(n) {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));   // no Sundays
  }
  return out;
}

const DAYS = workdays(6).map((date, i) => ({ date, slots: PATTERN[i] }));
const label = d => `${MONTH[d.getMonth()]} ${d.getDate()}.`;

function summary() {
  const svc = document.querySelector('input[name=szolg]:checked').value;
  sumEl.innerHTML = '';
  if (!pick) { sumEl.textContent = 'Válassz egy időpontot.'; return; }
  const b = document.createElement('b');
  b.textContent = `${svc}, ${label(pick.date)} ${DAYNAME[pick.date.getDay()]}, ${pick.time}`;
  sumEl.append('Foglalás: ', b);
}

function showDay(i) {
  [...daysEl.children].forEach((el, j) => el.setAttribute('aria-selected', String(i === j)));
  slotsEl.innerHTML = '';
  for (const t of DAYS[i].slots) {
    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'slot';
    s.textContent = t;
    s.setAttribute('aria-pressed', String(!!pick && pick.i === i && pick.time === t));
    s.addEventListener('click', () => {
      pick = { i, date: DAYS[i].date, time: t };
      slotErr.classList.remove('on');
      [...slotsEl.children].forEach(c => c.setAttribute('aria-pressed', String(c === s)));
      summary();
    });
    slotsEl.append(s);
  }
}

DAYS.forEach((d, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'day';
  b.setAttribute('role', 'tab');
  b.innerHTML = `<b>${DAYNAME[d.date.getDay()]}</b><span>${label(d.date)}</span><small>${d.slots.length ? d.slots.length + ' szabad' : 'betelt'}</small>`;
  if (!d.slots.length) b.disabled = true;
  b.addEventListener('click', () => showDay(i));
  daysEl.append(b);
});
showDay(0);
document.querySelectorAll('input[name=szolg]').forEach(r => r.addEventListener('change', summary));

/* ---------- form ---------- */

const form = document.querySelector('#book');
const ok = document.querySelector('#ok');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fail(input, msg) {
  input.closest('.fld').classList.add('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) { err.textContent = msg; err.classList.add('on'); }
}
function clear(input) {
  input.closest('.fld').classList.remove('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.classList.remove('on');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const nev = form.nev, mail = form.email, okbox = form.adatkezeles;
  [nev, mail, okbox].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!pick) {
    slotErr.textContent = 'Válassz egy napot és egy időpontot.';
    slotErr.classList.add('on');
    bad ||= daysEl.querySelector('.day:not(:disabled)');
  }
  if (!nev.value.trim()) { fail(nev, 'Írd be a neved.'); bad ||= nev; }
  if (!EMAIL.test(mail.value.trim())) {
    fail(mail, 'Ide küldöm a visszaigazolást, ezért kell egy működő e-mail-cím.');
    bad ||= mail;
  }
  if (!okbox.checked) { fail(okbox, 'Ehhez kell a beleegyezésed.'); bad ||= okbox; }

  if (bad) { bad.focus(); return; }

  const when = `${label(pick.date)} ${DAYNAME[pick.date.getDay()]}, ${pick.time}`;
  ok.textContent = `Köszönöm, lefoglaltam: ${when}. A visszaigazolást elküldtem a(z) ${mail.value.trim()} címre.`;
  ok.hidden = false;
  DAYS[pick.i].slots = DAYS[pick.i].slots.filter(t => t !== pick.time);
  const i = pick.i;
  pick = null;
  form.nev.value = ''; form.email.value = ''; form.uzenet.value = ''; okbox.checked = false;
  daysEl.children[i].querySelector('small').textContent =
    DAYS[i].slots.length ? DAYS[i].slots.length + ' szabad' : 'betelt';
  showDay(i);
  summary();
});

[form.nev, form.email].forEach(f => f.addEventListener('input', () => clear(f)));
form.adatkezeles.addEventListener('change', () => clear(form.adatkezeles));

loadPrices();
