/* Vamos Tattoo — menü, vélemények, időpontfoglaló űrlap.

   Az űrlap a lap értelme, ezért az ellenőrzés akörül épül, amire Norbertnek
   az árajánlathoz szüksége van: egy elérhetőség, mit szeretne a vendég, hova,
   és hány centi.

   Két jelölőnégyzet változtat azon, mit kérdez az űrlap. A „korrekció" azt
   jelenti, hogy a tetoválás már megvan, tehát nem kérdezzük meg, hol van és
   mekkora — az a fotón látszik —, hanem a fotót kérjük. Az „első tetoválás"
   az ellenőrzésen nem változtat semmit: Norbertnek szól, hogy tudja, bővebben
   kell válaszolnia. */

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
});

/* ---------- vélemények ---------- */

/* A kártyák a velemenyek.txt fájlból jönnek, hogy a véleményekhez ne kelljen
   HTML-t nyitni. A formátum:

     ## Név | Mikor | Hány csillag
     a szöveg, a következő ## sorig

   A „Mikor" és a csillagszám elhagyható. A # kezdetű sorok megjegyzések. */
function parseReviews(text) {
  const out = [];
  let cur = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('##')) {
      const [name, when, stars] = line.slice(2).split('|').map(s => (s || '').trim());
      cur = { name, when: when || '', stars: Math.min(5, Math.max(1, parseInt(stars, 10) || 5)), body: [] };
      if (cur.name) out.push(cur);
      continue;
    }
    if (!cur || !line || line.startsWith('#')) continue;
    cur.body.push(line);
  }
  return out
    .map(r => ({ ...r, body: r.body.join(' ').trim() }))
    .filter(r => r.body);
}

const revBox = document.querySelector('#rev-box');
const revs = document.querySelector('#revs');
const revCount = document.querySelector('#rev-count');
const revPanel = document.querySelector('#rev-panel');
const revPrev = document.querySelector('.rev-nav[data-dir="-1"]');
const revNext = document.querySelector('.rev-nav[data-dir="1"]');

function syncNav() {
  const max = revs.scrollWidth - revs.clientWidth - 2;
  const fits = max <= 0;
  for (const b of [revPrev, revNext]) b.hidden = fits;
  revPrev.disabled = revs.scrollLeft <= 2;
  revNext.disabled = revs.scrollLeft >= max;
}

function stepRail(dir) {
  const card = revs.firstElementChild;
  const by = card ? card.getBoundingClientRect().width + 14 : revs.clientWidth;
  revs.scrollBy({ left: dir * by, behavior: smooth ? 'smooth' : 'auto' });
}

function renderReviews(list) {
  if (!list.length) return;
  /* textContent végig: a txt fájl tartalma szöveg, nem HTML — így akkor sem
     történik semmi, ha valaki egy < jelet másol bele egy értékelésből. */
  const frag = document.createDocumentFragment();
  for (const r of list) {
    const q = document.createElement('blockquote');
    q.className = 'rev-q';

    const st = document.createElement('p');
    st.className = 'rev-st';
    st.textContent = '★'.repeat(r.stars);
    st.setAttribute('aria-label', `${r.stars} csillag`);

    const body = document.createElement('p');
    body.textContent = r.body;

    const cite = document.createElement('cite');
    cite.textContent = r.when ? `${r.name} · ${r.when}` : r.name;

    q.append(st, body, cite);
    frag.append(q);
  }
  revs.replaceChildren(frag);
  revBox.hidden = false;
  /* A fejlécben már ott az „Értékelj" gomb, a panel csak addig kellett, amíg
     nem volt mit mutatni. */
  revPanel.hidden = true;
  revCount.textContent = list.length === 1
    ? 'Egy értékelés a Google-profilomról.'
    : `${list.length} értékelés a Google-profilomról.`;
  revCount.hidden = false;
  syncNav();
}

revPrev.addEventListener('click', () => stepRail(-1));
revNext.addEventListener('click', () => stepRail(1));
revs.addEventListener('scroll', syncNav, { passive: true });
addEventListener('resize', syncNav);

fetch('velemenyek.txt', { cache: 'no-cache' })
  .then(r => (r.ok ? r.text() : ''))
  .then(t => renderReviews(parseReviews(t)))
  .catch(() => { /* nincs fájl vagy nincs háló: a szakasz marad a gombbal */ });

/* ---------- űrlap ---------- */

const form = document.querySelector('#f');
const ok = document.querySelector('#ok');
const korr = document.querySelector('#f-korr');
const elso = document.querySelector('#f-elso');
const sendBtn = document.querySelector('#send');
const sendBad = document.querySelector('#sendbad');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ENDPOINT = form.getAttribute('action') || '/api/foglalas';
const MAX_FILES = 5;
const MAX_TOTAL = 15 * 1024 * 1024;
const MAX_EDGE = 2000;

const hintKep = document.querySelector('#hint-kep');
const optKep = document.querySelector('#opt-kep');
const lblOtlet = document.querySelector('label[for="f-otlet"]');
const noteKorr = document.querySelector('#note-korr');
const noteElso = document.querySelector('#note-elso');

/* Amire egy korrekció nem tud válaszolni. */
const offOnKorr = [document.querySelector('#f-hol'), document.querySelector('#f-meret')];

function fail(input, msg) {
  input.closest('.fld').classList.add('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.textContent = msg;
}
function clear(input) {
  input.closest('.fld').classList.remove('bad');
}

/* Letiltva, nem elrejtve: látszik, mit csinált a pipa, és letiltott mező nem
   is küldődik el, tehát egy ottfelejtett érték nem utazhat el a korrekciós
   jelzéssel. A beírt szöveg megmarad, ha valaki visszaveszi a pipát. */
function setOff(input, off) {
  input.disabled = off;
  input.closest('.fld').classList.toggle('off', off);
  if (off) clear(input);
}

function applyMode() {
  const c = korr.checked;

  offOnKorr.forEach(i => setOff(i, c));

  /* Korrekció per definíció nem lehet valakinek az első tetoválása. */
  if (c) elso.checked = false;
  setOff(elso, c);

  noteKorr.hidden = !c;
  noteElso.hidden = !elso.checked;

  optKep.textContent = c ? '(kötelező)' : '(nem kötelező)';
  hintKep.textContent = c
    ? 'Egy éles fotó a gyógyult tetoválásról, arról a részről, ami javítást igényelhet.'
    : 'Inspirációs képek, vagy takarás esetén a meglévő tetoválás.';
  lblOtlet.textContent = c ? 'Mit javítanál rajta?' : 'Mi az elképzelésed?';
  form.otlet.placeholder = c
    ? 'Írd le, melyik résszel nem vagy elégedett, és mikor készült a tetoválás.'
    : 'Mit szeretnél, és mit jelent neked? Ha van hozzá történet, írd meg.';
}
korr.addEventListener('change', () => { applyMode(); clear(form.kepek); });
elso.addEventListener('change', applyMode);
applyMode();

/* Egy telefonfotó 5–8 MB, és ebből semmit nem lát a címzett, amit egy 2000
   pixeles élből ne látna. A kicsinyítés a böngészőben történik, hogy a
   feltöltés ne álljon meg mobilneten. */
async function shrink(file) {
  if (!file.type.startsWith('image/')) return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;                       /* pl. HEIC, amit a böngésző nem nyit */
  }
  const edge = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, MAX_EDGE / edge);
  if (scale === 1 && file.size < 1.5e6) { bitmap.close(); return file; }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const cx = canvas.getContext('2d');
  cx.imageSmoothingQuality = 'high';
  cx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.82));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}

async function send() {
  const data = new FormData(form);          /* a letiltott mezők kimaradnak */
  data.delete('kepek');

  let total = 0;
  for (const f of [...form.kepek.files].slice(0, MAX_FILES)) {
    const small = await shrink(f);
    total += small.size;
    data.append('kepek', small, small.name);
  }
  if (total > MAX_TOTAL) {
    throw new Error('A csatolt képek együtt túl nagyok. Küldj kevesebbet, vagy kisebb felbontásban.');
  }

  const res = await fetch(ENDPOINT, { method: 'POST', body: data });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.ok) throw new Error(out.error || 'Az üzenetet most nem sikerült elküldeni.');
}

function showSendError(msg) {
  sendBad.textContent = `${msg} Ha nem múlik el, írj közvetlenül: `;
  const a = document.createElement('a');
  a.href = 'mailto:tattoo.vamos@gmail.com';
  a.textContent = 'tattoo.vamos@gmail.com';
  sendBad.append(a);
  sendBad.hidden = false;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const { nev, elerhetoseg: el, otlet, testresz: hol, meret, kepek } = form;
  [nev, el, otlet, hol, meret, kepek].forEach(clear);
  ok.hidden = true;
  sendBad.hidden = true;
  let bad = null;

  if (!nev.value.trim()) { fail(nev, 'Írd be a neved, hogy tudjam, kihez szóljak.'); bad ||= nev; }

  const v = el.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) { fail(el, 'Elérhetőség nélkül nem tudok visszajelezni.'); bad ||= el; }
  else if (!EMAIL.test(v) && digits < 7) { fail(el, 'Ez így nem tűnik e-mail-címnek vagy telefonszámnak.'); bad ||= el; }

  if (!otlet.value.trim()) {
    fail(otlet, korr.checked ? 'Írd le, melyik részt javítanád.' : 'Írd le pár mondatban, mit szeretnél.');
    bad ||= otlet;
  }

  if (!korr.checked) {
    if (!hol.value.trim()) { fail(hol, 'Írd meg, a test melyik részére szeretnéd.'); bad ||= hol; }

    /* A méretből lesz az ár és az alkalom hossza, ezért kötelező, és számot
       kell tartalmaznia — a „kicsi" nem méret. */
    const m = meret.value.trim();
    if (!m) { fail(meret, 'A méret nélkül nem tudok árat mondani — elég egy közelítő szám cm-ben.'); bad ||= meret; }
    else if (!/\d/.test(m)) { fail(meret, 'Írj bele egy számot, például "10 cm".'); bad ||= meret; }
  }

  if (korr.checked && kepek.files.length === 0) {
    fail(kepek, 'Korrekcióhoz kérlek csatolj egy éles fotót a gyógyult tetoválásról.');
    bad ||= kepek;
  }
  if (kepek.files.length > MAX_FILES) {
    fail(kepek, `Egyszerre legfeljebb ${MAX_FILES} képet tudok fogadni.`);
    bad ||= kepek;
  }

  if (bad) { bad.focus(); return; }

  const label = sendBtn.textContent;
  sendBtn.disabled = true;
  sendBtn.textContent = 'Küldés…';
  try {
    await send();
    form.reset();
    applyMode();
    ok.hidden = false;
  } catch (err) {
    showSendError(err.message);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = label;
  }
});

[...form.querySelectorAll('input[type="text"], textarea')].forEach(f =>
  f.addEventListener('input', () => clear(f))
);
form.kepek.addEventListener('change', () => clear(form.kepek));
