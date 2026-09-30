# Burján Húsbolt, Dömsöd — demó

Ügyfél: **Burján Húsbolt**, burjanhus@freemail.hu. Tulajdonos: **Burján András Attila** hentes
(a burjanhus.hu bemutatkozása szerint).
Előzmény: hideg megkeresés, amely szerint csak Facebookon szerepelnek, és a helyiek a Google-ben nem
találják a nyitvatartást és a kínálatot. „IGEN”-nel válaszolt az ingyenes mintára.

## FONTOS: már van weboldaluk
Kereséskor (2026-09-27) előjött a **https://burjanhus.hu/** (Elementorral épült WordPress, webshoppal,
~150 termékkel és kilós árakkal). A Google a Facebook-oldal mellett ezt is kiadja, a gastro.hu is ezt adja
meg weboldalként. **A megkereső levél „csak Facebookon vagytok” állítása tehát nem stimmel.** A demót
ettől függetlenül elkészítettem; a válaszlevélben erre ki kell térni (pl. a mostani oldal telefonon
nehezen kezelhető webshop, a nyitvatartás és a heti akció nincs elöl), és nem szabad úgy tenni, mintha
nem lenne oldaluk.

## Valós adatok és forrásuk
- Cím: **2344 Dömsöd, Kossuth Lajos út 92.** (burjanhus.hu, nyitva.hu, firmania.hu, gastro.hu)
- Telefon: **+36 30 409 4496** (burjanhus.hu, nyitva.hu, firmania.hu, gastro.hu). A burjanhus.hu-n
  további számok is szerepelhetnek (+36 30 925 9271, +36 70 319 9911 „bolt”): ezeket csak egy
  összefoglalóból láttam, az oldalra nem tettem ki, rá kell kérdezni.
- E-mail: burjanhus@freemail.hu (a levelezésből).
- Nyitvatartás (burjanhus.hu és gastro.hu): H zárva, K–P 6–17, Szo 6–13, V 7–11.
  **Eltérés:** a nyitva.hu és a firmania.hu szerint hétfőn 6–12 nyitva vannak. Az oldal a saját
  honlapjukat követi (hétfő zárva); rá kell kérdezni.
- Szlogen: „…és egy jó szó teljesen ingyen” (burjanhus.hu címsora).
- Bemutatkozás: „Burján András Attila vagyok, vállalkozó, hentes és 3 gyermek édesapja. A Burján Húsbolt
  családi vállalkozás Dömsöd központjában, melyet 2008-ban vettem meg édesapámtól…” (burjanhus.hu).
- Kiszállítás péntek délután: Dömsöd, Ráckeve, Szalkszentmárton, Szigetbecse, Kiskunlacháza, Bugyi,
  Apaj, Tass, Áporka, Kunszentmiklós. 20 000 Ft felett ingyenes, alatta 100 Ft/km. Fizetés készpénzzel
  vagy kártyával (burjanhus.hu).
- Termékkategóriák és **az összes ár** (`arak.txt`): a burjanhus.hu/webshop oldalról, 2026-09-27-i
  állapot. A heti akció három tétele (csontos fél fej 290, hasaalja szalonna 1 390, kockázott füstölt
  hátsó csülök 1 990 Ft/kg) a webshopban akciósként / a főoldalon kiemeltként szerepelt.
- Facebook: facebook.com/p/Burján-Húsbolt-100057260417859 (a szövege nem volt lekérhető).

## Kitalált / saját javaslat (jelölni kell a levélben)
- Az árlistában **mely tételek** szerepelnek (válogatás a webshop kb. 150 tételéből), a csoportok neve.
- Hogy a három akciós tétel „heti” akció, és a „Minden héten néhány termék kedvezőbb áron” mondat.
- A **Rendelés ünnepekre** blokk teljes szövege (karácsony, húsvét, kolbásztöltés termékjavaslatai;
  „ünnepek előtt hamar elfogy, félretesszük”). Ünnepi rendelésről sehol nem találtam semmit; a
  termékek (kacsa, töltött dagadó, füstölt áru, 70/30 darálthús, kocabél, fűszerpaprika) valósak.
- A rendelési űrlap (demó, nem küld el semmit) és a „visszajelzünk, hogy félretettük” ígéret.
- A „Jó magyar húst szeretnénk adni megfizethető áron…” mondat: a bemutatkozásuk összefoglalóján
  alapuló átfogalmazás, az „aki kérdez, annak elmondjuk, hogyan főzze” rész saját.
- A hero szövege, a kategóriakártyák leírásai, a „Családi bolt, apáról fiúra” cím.
- „Az árak tájékoztató jellegűek” lábjegyzet.
- Fotók nincsenek: szaggatott „Fotó helye” keretek (pult, portré) és „Térkép helye" (nincs beágyazott
  térkép, csak egy Google Térkép útvonal-link).

## Szerkezet
Ugyanaz, mint a pilates-center-pecs / derekmento-ecsed demóé:
`index.html`, `styles.css`, `script.js`, `arak.txt` (futás közben töltődik az `assets/price-parse.js`
segítségével, és be is van sütve a HTML-be: `node tools/bake.mjs`). Újdonság: az `arak.txt`
„## Heti akció” csoportja nem az árlistába, hanem a krétatáblára kerül, így hetente csak azt a pár
sort kell átírni. A mai nap ki van emelve a nyitvatartásban, mellette „Most nyitva / Most zárva”.

Design: csomagolópapír-krém alap, marhavér-bordó, krétatábla a heti akcióhoz, piros-fehér
napellenző-csík a fejlécen. Betűk: Zilla Slab 700 (címek), Barlow 400/500 (szöveg),
Barlow Condensed 700 (árak, címkék), helyben tárolva (`assets/fonts.css`).
Telefonon: nagy „Hívás” gomb a hero-ban, lent tapadó hívássáv, amint a hero gombja kigördül.

Képek: `python3 -m http.server 8193 -d burjan-husbolt`, majd a mappából
`BASE_URL=http://127.0.0.1:8193/index.html node tools/shoot.mjs` és `node tools/deliver.mjs`.
