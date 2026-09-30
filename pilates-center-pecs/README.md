# Pilates Center Pécs — demó

Ügyfél: **Medical Pilates Kft.** (Pilates Center Pécs), kapcsolattartó **Gilián Zsanett**,
pilatescenterpecs@gmail.com, +36 30 435 3837. Cím az e-mail-aláírásából: 7621 Pécs, Váradi u. 10.
Régi oldal: https://pilatescenter.hu/ (aloldalak: Rólunk, Stúdió, Árak, Kapcsolat).

Előzmény: hideg megkeresés 2026-09-14-én a vince@axiomaweb.hu címről („árak megegyezés
alapján”, ár nem hangzott el). 2026-09-26-án válaszolt: „Küldj nekem kérlek egy prototípus oldalt.”

## Amit NEM tudtam ellenőrizni
A pilatescenter.hu és a Facebook a konténerből nem érhető el, a keresőben csak a címek látszanak.
Ezért kitalált, és a levélben jelölve van:
- minden ár (`arak.txt`), az órarend és az óratípusok (gerincbarát, szenior, kezdő, haladó);
- hogy van-e gépes (reformer) óra — a demó csak matracos órát említ;
- a csoportlétszám (max. 8 fő) és a lemondási szabály;
- a „Kinek szól” lista és a „mikor kérdezd meg az orvosod” szöveg.
- Cím: az aláírásban Váradi u. 10., egy edzőterem-katalógus (edzoterem.info) Mátyás király u. 23.-at ír. Rá kell kérdezni, hol vannak az órák.
- Fotók nincsenek, csak szaggatott keretek (vásárolt képet nem teszünk ügyfél oldalára).

Szerkezet: ugyanaz, mint a derekmento-ecsed demóé (árak külön `arak.txt`-ben, `assets/price-parse.js`).
Képek: `tools/shoot.mjs`, `tools/deliver.mjs` (szerver: `python3 -m http.server 8181 -d pilates-center-pecs`).
