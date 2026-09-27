# Gloriett Fejlesztőház — demó

Ügyfél: **Gloriett Fejlesztőház**, kapcsolattartó **Stieber Magdolna**,
gloriettfejlesztohaz@gmail.com, 06 70 389 6102 (+36 70 389 6102).
Cím: 1186 Budapest, Tövishát u. 77. (XVIII. kerület, Pestszentlőrinc).
Régi oldal: http://gloriettfejlesztohaz.hu (nincs HTTPS: a https-cím tanúsítványa nem erre a
domainre szól, és 302-vel visszairányít a http-re).
Facebook: https://www.facebook.com/GloriettFejlesztohaz/ · Instagram: https://www.instagram.com/gloriettfejlesztohaz/

Előzmény: azt válaszolták, „Érdekel minket”. Úgy látják, a mostani oldaluk jól optimalizált
a keresőre, ezért a demó a meglévő szolgáltatásaikat és a saját megfogalmazásaikat viszi tovább,
csak modern, mobilbarát formában. A régi aloldalak nevei horgonyként (`id`) megmaradtak az új
oldalon (pl. `#alapozoterapia`, `#iskolaerettsegi`, `#devenyi`), így a régi URL-ek egy az egyben
átirányíthatók (lásd lent).

## Honnan jönnek a tények
A régi oldal a konténerből nem olvasható (a proxy nem engedi a hostot, a WebFetch https-re vált,
ahol hibás a tanúsítvány). Ezért katalógusoldalakból és a keresőben látszó oldalcímekből dolgoztam:

- programturizmus.hu/partner-gloriett-fejlesztohaz-budapest.html — korosztályonkénti szolgáltatáslista
  (0–3 év, óvodások, iskolások), SEED fejlődési skála (0–4 év), iskolaérettségi vizsgálat,
  kiscsoport + egyéni terápia, 0–16 év, ünnepi programok (halloween, karácsonyi kézműves délelőtt,
  húsvét, családi nap akadálypályával), nyitvatartás
- gyermekfejlesztes.hu/item/gloriett-fejlesztohaz/ — cím, a „Játékos fejlődés családias, biztonságos
  környezetben a 18. kerületben” szlogen, a „A vidám, játékos fejlesztés által a gyerekek az iskolában
  és az életben is kudarc nélkül vegyék az akadályokat” mondat, szolgáltatások
- 18.kerulet.ittlakunk.hu/holmi/oktatas/gloriett-fejlesztohaz — Stieber Magdolna, telefon,
  „Fejlesztőházunkban mozgásfejlesztő és komplex képességfejlesztő foglalkozások várják a 0-16 éves
  gyerekeket.”, H–P 8–19, ingyenes utcai parkolás
- 18.kerulet.ittlakunk.hu/holmi/szolgaltatas/babatorna-gloriett-fejlesztohazban — babatorna
  (4 hónapos kortól), óvoda-előkészítő, oktató: Horváth Janka (régi hirdetés)
- schoolandcollegelistings.com (Facebook-leírás másolata) — „Alapozó terápia, mozgásfejlesztés,
  homloklebeny fejlesztés, iskolaelőkészítő foglalkozásainkra várunk 1-16 éves gyerekeket egész évben!”
- a régi oldal aloldalcímei (keresőtalálatok): Dévény-oldal címe „Érdeklődni lehet: Palotai Gabriella”,
  táborok (nyári, tavaszi szüneti, iskola-előkészítő), homloklebeny fejlesztő tábor (stayhappening.com)

## Kitalált vagy bizonytalan tartalom (jóváhagyatni!)
- **Minden ár** (`arak.txt`) kitalált. A régi oldalon van `arak.html`, de nem tudtuk elolvasni.
  (Egy régi hirdetésben babatorna 1 000 Ft/alkalom, óvoda-előkészítő 1 200 Ft/alkalom szerepel —
  ez nyilván elavult, nem használtuk.) A bérletkedvezmény és a tábori ellátás szövege is kitalált.
- Nyitvatartás: a források eltérnek (H–P 7:30–19:00, 8:00–19:00, 8:00–19:30). A demó 8:00–19:00-t ír.
- Stieber Magdolna szerepe („a Fejlesztőház vezetője”) feltételezés; csak kapcsolattartóként szerepel.
- Palotai Gabriella (Dévény) és Horváth Janka (babatorna, óvoda-előkészítő) régi oldalakról/hirdetésből
  jön, lehet, hogy már nem dolgoznak ott. Telefonszámukat nem tettük ki. A bemutatkozó szövegek helye üres.
- A szolgáltatások egysoros magyarázatai, a „Mikor érdemes eljönni?” lista, a felmérések rövid leírása,
  a négylépéses jelentkezési folyamat és a táboros bekezdés a mi megfogalmazásunk.
- Az életkori sávok (3–7, 7–16 év) a „óvodások / iskolások” felosztásból vannak kikövetkeztetve.
- A „Logopédia” szót nem használtuk szolgáltatásnévként, mert a forrásokban „beszédindító” és
  „komplex beszédfejlesztő foglalkozás” szerepel. Ha van logopédusuk, érdemes külön kiírni.
- Az `orarend03.html` címe „Gloriett Fejlesztőház, Vecsés” — lehet, hogy volt/van vecsési helyszín is.
  Rá kell kérdezni.
- Fotók nincsenek: szaggatott „Fotó helye” keretek (boltíves forma a „gloriett” név miatt).
  Az ő képeiket nem linkeltük be, stockfotót nem használtunk.
- Az űrlap nem küld semmit (demó); élesben e-mailre kell kötni.

## A régi oldal ismert aloldalai (átirányításhoz)
| Régi URL | Oldalcím (keresőből) | Új helye |
|---|---|---|
| `/` | Gloriett Fejlesztőház | `/` |
| `/rolunk.html` | Gloriett Fejlesztőház | `/#top` |
| `/csapat.html` | Gloriett Fejlesztőház | `/#csapat` |
| `/elerhetosegek.html` | Kapcsolat | `/#elerhetosegek` |
| `/arak.html` | Gloriett Fejlesztőház | `/#arak` |
| `/orarend01.html` | Gloriett Fejlesztőház | `/#foglalkozasok` |
| `/orarend03.html` | Gloriett Fejlesztőház, Vecsés | `/#foglalkozasok` (?) |
| `/beszedindito.html` | Komplex beszédfejlesztő foglalkozás | `/#beszedindito` |
| `/beszedindito2.html` | Gloriett Fejlesztőház | `/#beszedindito2` |
| `/devenyi.html` | Érdeklődni lehet: Palotai Gabriella 0630/ 428 37 42 | `/#devenyi` |
| `/babamasszazs.html` | Babamasszázs és hangterápia | `/#babamasszazs` |
| `/babamama.html` | Baba-Mama foglalkozások | `/#babamama` |
| `/ovodoaelokeszito.html` | Óvoda előkészítő | `/#ovodoaelokeszito` |
| `/alapozofejlesztes.html` | Mozgásfejlesztés | `/#alapozofejlesztes` |
| `/alapozoterapia.html` | Alapozó terápia | `/#alapozoterapia` |
| `/homloklebenyterapia.html` | Homloklebeny terápia | `/#homloklebenyterapia` |
| `/szinjatszas.html` | Iskolaelőkészítő foglalkozás \| Színjátszás | `/#szinjatszas` |
| `/seed.html` | Gloriett Fejlesztőház | `/#seed` |
| `/kepesseg5eves.html` | Alapozó terápiás mozgás és képességfelmérés 5 éves kortól | `/#kepesseg5eves` |
| `/iskolaerettsegi.html` | Iskolaérettségi vizsgálat a Gloriett Fejlesztőházban | `/#iskolaerettsegi` |
| `/taborok.html` | játékos mozgás- és képességfejlesztő táborok | `/#taborok` |
| `/taborokaltalaban.html` | Komplex mozgás- és képességfejlesztő táborok | `/#taborok` |
| `/taborokevkozben.html` | (tavaszi szüneti tábor) | `/#taborok` |
| `/taborokovi.html` | Mozgás- és képességfejlesztő tábor, Iskola előkészítő … | `/#taborok` |

Megjegyzés SEO-hoz: ha a sok aloldalas szerkezet hozza nekik a forgalmat, élesben érdemes a fő
témákra (alapozó terápia, beszédfejlesztés, iskolaérettségi vizsgálat, Dévény, táborok) külön
aloldalt hagyni ugyanazon az URL-en, ez a demó egyoldalas bemutató.

## Szerkezet
Ugyanaz, mint a pilates-center-pecs / derekmento-ecsed demóé:
`index.html`, `styles.css`, `script.js`, `arak.txt` (futáskor az `assets/price-parse.js` olvassa be,
és a `tools/bake.mjs` bele is süti a HTML-be), `assets/fonts.css` + `assets/fonts/` (Alegreya,
Nunito Sans, saját tárhelyen), `assets/favicon.svg`.
Képek: `python3 -m http.server 8192 -d gloriett-fejlesztohaz`, majd a mappában
`BASE_URL=http://127.0.0.1:8192/index.html node tools/shoot.mjs` és `… node tools/deliver.mjs`.
