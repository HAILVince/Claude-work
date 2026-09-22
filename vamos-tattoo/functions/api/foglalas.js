/* Vamos Tattoo — az időpontfoglaló űrlap e-mailbe.

   Cloudflare Pages Function: a /api/foglalas címre érkező POST-ot fogadja,
   ellenőrzi, és a Resend API-val küldi el Norbertnek. Nincs adatbázis és
   nincs tárolás — ami megérkezik, az azonnal e-mail lesz, és a kérés végén
   elfelejtjük. Ez nem takarékosság, hanem az adatkezelési tájékoztató
   betartása: ott az áll, hogy az üzenet e-mailben érkezik, és más nem fér
   hozzá.

   Amit a Cloudflare felületén be kell állítani (Settings -> Variables and
   Secrets), a részletek az EMAIL-BEALLITAS.md-ben:

     RESEND_API_KEY     kötelező   a Resend API-kulcsa
     MAIL_TO            kötelező   ide érkezzenek a jelentkezések
     MAIL_FROM          kötelező   pl. Vamos Tattoo <weboldal@vamostattoo.eu>
     TURNSTILE_SECRET   opcionális ha be van állítva, a Turnstile kötelező  */

const MAX_FILES = 5;
const MAX_TOTAL = 15 * 1024 * 1024;   /* a Resend 40 MB-ig enged, de a Gmail
                                         25 MB-nál elvágja — 15 alatt maradunk */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/* btoa egy nagy fájlra elszáll a hívási veremtől, ezért darabokban. */
function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let out = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(out);
}

async function turnstileOk(token, secret, ip) {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const out = await r.json().catch(() => ({}));
  return out.success === true;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const line = (label, value) => (value ? `${label}\n${value}\n\n` : '');

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.MAIL_TO || !env.MAIL_FROM) {
    return json({ error: 'A küldés még nincs beállítva.' }, 500);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Hibás kérés.' }, 400);
  }

  /* A mézesbödön: ember sosem tölti ki, mert nem látja. Botnak 200-at
     mondunk, hogy ne tudja meg, min bukott el. */
  if ((form.get('weboldal') || '').toString().trim()) return json({ ok: true });

  if (env.TURNSTILE_SECRET) {
    const ok = await turnstileOk(
      form.get('cf-turnstile-response'),
      env.TURNSTILE_SECRET,
      request.headers.get('cf-connecting-ip'),
    );
    if (!ok) return json({ error: 'A biztonsági ellenőrzés nem sikerült. Töltsd újra az oldalt.' }, 400);
  }

  const get = k => (form.get(k) || '').toString().trim();
  const nev = get('nev');
  const el = get('elerhetoseg');
  const otlet = get('otlet');
  const hol = get('testresz');
  const meret = get('meret');
  const mikor = get('mikor');
  const korrekcio = !!form.get('korrekcio');
  const elso = !!form.get('elso');

  /* Ugyanaz a szabály, mint a böngészőben: az űrlap ott is ezt kéri. A
     kliens oldali ellenőrzés kényelem, ez itt a tényleges feltétel. */
  if (!nev || !el || !otlet) return json({ error: 'Hiányzik a név, az elérhetőség vagy a leírás.' }, 400);
  if (!korrekcio && (!hol || !meret)) return json({ error: 'A testrész és a méret kötelező.' }, 400);

  const files = form.getAll('kepek').filter(f => typeof f === 'object' && f.size > 0);
  if (files.length > MAX_FILES) return json({ error: `Legfeljebb ${MAX_FILES} képet tudok fogadni.` }, 400);
  if (korrekcio && files.length === 0) return json({ error: 'A korrekcióhoz fotó kell.' }, 400);

  let total = 0;
  const attachments = [];
  for (const f of files) {
    total += f.size;
    if (total > MAX_TOTAL) return json({ error: 'A képek együtt túl nagyok. Küldj kevesebbet, vagy kisebbeket.' }, 413);
    attachments.push({
      filename: (f.name || 'kep.jpg').replace(/[^\w.\-]+/g, '_'),
      content: toBase64(await f.arrayBuffer()),
    });
  }

  const jel = [korrekcio ? 'KORREKCIÓ' : null, elso ? 'első tetoválás' : null].filter(Boolean);
  const subject = `${korrekcio ? 'Korrekció' : 'Időpontkérés'} — ${nev}${elso ? ' (első tetoválás)' : ''}`;

  const text =
    (jel.length ? `[ ${jel.join(' · ')} ]\n\n` : '') +
    line('Név', nev) +
    line('Elérhetőség', el) +
    line(korrekcio ? 'Mit javítana' : 'Elképzelés', otlet) +
    (korrekcio ? '' : line('Testrész', hol) + line('Méret', meret)) +
    line('Mikorra', mikor) +
    line('Csatolt képek', attachments.length ? `${attachments.length} db` : 'nincs') +
    (elso ? 'Jelezte, hogy ez lesz az első tetoválása — érdemes bővebben válaszolni.\n\n' : '') +
    `—\nvamostattoo.eu · ${new Date().toISOString()}`;

  const payload = {
    from: env.MAIL_FROM,
    to: [env.MAIL_TO],
    subject,
    text,
    ...(EMAIL.test(el) ? { reply_to: el } : {}),
    ...(attachments.length ? { attachments } : {}),
  };

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    /* A látogatónak nem a Resend hibakódja kell, hanem egy másik út. */
    console.error('resend', r.status, await r.text().catch(() => ''));
    return json({ error: 'Az üzenetet most nem sikerült elküldeni.' }, 502);
  }

  return json({ ok: true });
}

/* GET-re ne egy üres 405 jöjjön, ha valaki beírja a címet. */
export const onRequestGet = () => json({ error: 'Ez a cím csak az űrlap küldését fogadja.' }, 405);
