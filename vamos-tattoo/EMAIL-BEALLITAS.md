# Hogyan küldjön az űrlap e-mailt

Egy statikus oldal magától nem tud levelet küldeni — kell mögé valami, ami
fogadja az űrlapot és továbbítja. A kód készen van (`functions/api/foglalas.js`),
csak a fiókokat kell beállítani hozzá. Kb. 20 perc, egyszer.

A választás: **Cloudflare Pages + Resend**. Azért ez, mert a domain úgyis
Cloudflare-re megy, a Pages ingyenes, és nincs rajta semmi, amit karban kellene
tartani — nincs szerver, nincs PHP-frissítés, nincs plugin.

---

## Amit csinálni kell

### 1. Az oldal felmegy Cloudflare Pages-re

Cloudflare irányítópult → **Workers & Pages** → **Create** → **Pages** →
*Connect to Git*, és rá kell mutatni erre a repóra, a `vamos-tattoo` mappára.

- Build command: **nincs** (üresen kell hagyni)
- Build output directory: `/` (a `vamos-tattoo` mappa gyökere)

A `functions/` mappát a Cloudflare magától megtalálja, és a benne lévő
fájlból lesz a `/api/foglalas` végpont. Semmit nem kell beállítani hozzá.

### 2. Resend-fiók

[resend.com](https://resend.com) → regisztráció. **Norbert új Gmail-címével
kell csinálni**, ne a sajátoddal: átadáskor így ez is az övé lesz, ugyanúgy,
mint a Google-fiók.

- **Domains** → *Add domain* → `vamostattoo.eu`. Kapsz 3-4 DNS-rekordot
  (SPF, DKIM, és egy MX a visszapattanóknak).
- Ezeket a Cloudflare **DNS** fülén kell felvenni. Ha a domain már ott van,
  ez 2 perc. Utána a Resendben *Verify*.
- **API Keys** → *Create API key*, `Sending access` jogosultsággal. A kulcsot
  egyszer mutatja meg, tedd el.

Ingyenes keret: 3 000 levél/hó, napi 100. Ide ez sok.

### 3. A három beállítás a Cloudflare-en

A Pages-projektben: **Settings → Variables and Secrets**, és mindhármat
*Secret* típusként (nem *Text*):

| Név | Érték |
| --- | --- |
| `RESEND_API_KEY` | a Resend API-kulcsa (`re_...`) |
| `MAIL_TO` | ide érkezzenek a jelentkezések, pl. `tattoo.vamos@gmail.com` |
| `MAIL_FROM` | `Vamos Tattoo <weboldal@vamostattoo.eu>` |

A `MAIL_FROM` domainjének **annak kell lennie, amit a Resendben igazoltál**.
Gmail-címet nem lehet feladóként megadni, azt a Google nem engedi — de a
válasz-címet (`reply_to`) a kód automatikusan a jelentkező e-mail-címére
állítja, tehát Norbert nyugodtan nyomhat Válasz-t.

Változó felvétele vagy módosítása után **újra kell deployolni** (Deployments →
Retry deployment), különben a régi értékekkel fut.

### 4. Próba

Küldj magadnak egy jelentkezést az éles oldalról, egy képpel együtt. Ha
megérkezik, kész. Ha nem, a Cloudflare **Workers & Pages → a projekt →
Logs** fülén látszik, mi a hiba.

---

## Spamszűrés (érdemes, de nem kötelező)

Egy nyilvános űrlapra előbb-utóbb rájárnak a botok. Két védelem:

1. **Mézesbödön** — már benne van, nem kell vele csinálni semmit. Van egy
   rejtett mező, amit ember nem lát; ha kitöltve érkezik, az üzenet a
   kukába megy.

2. **Cloudflare Turnstile** — ingyenes, és nem kell hozzá képeket kattintgatni.
   Ha kell:
   - Cloudflare → **Turnstile** → *Add site*, domain `vamostattoo.eu`.
   - A kapott **site key**-jel egy sort be kell szúrni az `index.html`-be,
     közvetlenül az `Elküldöm` gomb elé:

     ```html
     <div class="cf-turnstile" data-sitekey="IDE_A_SITE_KEY"></div>
     ```

     és a `</head>` elé:

     ```html
     <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
     ```
   - A **secret key**-t pedig `TURNSTILE_SECRET` néven fel kell venni a
     Cloudflare változói közé.

   A szerveroldal magától észreveszi: ha a `TURNSTILE_SECRET` be van állítva,
   megköveteli az ellenőrzést, ha nincs, átengedi. Tehát a sorrend mindegy,
   de a változót csak azután vedd fel, hogy a widget már kint van az oldalon.

---

## Amit a kód magától elintéz

- **A képeket a böngésző kicsinyíti** feltöltés előtt (leghosszabb él 2000 px,
  JPEG). Egy 8 MB-os telefonfotóból így fél MB lesz, és mobilneten sem akad
  meg a küldés. Legfeljebb 5 kép, összesen 15 MB — a Gmail 25 MB-nál vágja el
  a leveleket, ezért maradunk alatta.
- **A tárgy sor beszédes**: `Időpontkérés — Kiss Anna`, korrekciónál
  `Korrekció — …`, és ha valaki bepipálta az első tetoválást, az is kikerül
  a tárgyba.
- **Semmit nem tárolunk.** Az adat a kérés idejére él, utána e-mail lesz
  belőle, és annyi. Nincs adatbázis, nincs fájltár.
- **A letiltott mezők nem küldődnek el**, tehát korrekciónál nem utazik el a
  testrész és a méret, ha valaki előbb kitöltötte, aztán pipált.

---

## Ha mégsem Cloudflare lesz a tárhely

Az `index.html`-ben az űrlapon ez a sor mondja meg, hova küldjön:

```html
<form class="form" id="f" action="/api/foglalas" ...>
```

Ha Hostinger-tárhelyen marad az oldal, ezt kell átírni a PHP-fájl címére
(pl. `action="/kuldes.php"`), és kell egy PHP, ami ugyanezt csinálja. Szólj,
és megírom — de ha nincs rá más okod, a Cloudflare-es út olcsóbb és nincs
rajta mit frissíteni.

---

## Amit az adatkezelési tájékoztatóban is át kell írni

Ez nem formaság: a tájékoztató most azt írja, hogy az üzenethez a Google-on
kívül csak a tárhelyszolgáltató fér hozzá. A küldés bekapcsolásával ez
változik, és a `adatkezeles.html`-ben javítani kell:

1. Az **adatfeldolgozók** listájába be kell kerülnie a **Cloudflare**-nek
   (tárhely és a küldő végpont) és a **Resend**-nek (a levél kézbesítése).
   Mindkettő EU-s adatközponttal is elérhető.
2. A **sütikről** szóló rész ma azt állítja, hogy az oldal egyáltalán nem
   használ sütit. A Cloudflare mögött megjelenhet egy `__cf_bm` nevű,
   működéshez szükséges süti — ezt meg kell említeni. (Hozzájárulás továbbra
   sem kell hozzá, mert technikailag szükséges, de leírni kell.)
3. A Turnstile-t, ha bekapcsolod, szintén érdemes egy sorban megemlíteni.

Az élesítés előtt ezt a hármat átvezetem, ha szólsz.
