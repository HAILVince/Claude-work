# Elixír Biobolt, Tapolca: demó

Ügyfél: **Elixír Biobolt**, bio- és reformbolt (drogéria, biobolt) Tapolcán.
Kapcsolat: **Marton István**, bioboltelixir@gmail.com. Jelenlegi oldal: elixirbiobolt.hu
(csak HTTP, HTTPS nincs; a https-kérést visszairányítja http-re).
A hideg megkeresésre (biztonságos, gyors, mobilos oldal + egyszerű webáruház) azt írta:
„Érdeklődve várom javaslatait, ajánlatát.”

## Amit találtunk (forrásokkal)

| Adat | Érték | Forrás | Az oldalon |
|---|---|---|---|
| Cím | 8300 Tapolca, Deák Ferenc utca 9. | [nyitva.hu](https://nyitva.hu/tapolca/elix%C3%ADr-biobolt-150100), [menteshelyek.hu](https://menteshelyek.hu/menteshely/elixir-biobolt/), [zafirnet.hu](https://zafirnet.hu/viszonteladok) | nyitó blokk, Kapcsolat, lábléc, JSON-LD |
| GPS | 46.88267, 17.43832 | [placedigger](https://hu.placedigger.com/elixir-biobolt799417747.html) | „Útvonal” gombok |
| Telefon | 06 87 687 636 | nyitva.hu, menteshelyek.hu, [firmania.hu](https://firmania.hu/tapolca/elix%C3%ADr-biobolt-163866), [magyarvelemeny.com](https://magyarvelemeny.com/bolt/tapolca/elixir-biobolt/) | fejléc, nyitó blokk, Kapcsolat |
| E-mail | bioboltelixir@gmail.com (ügyfél) | ügyfél levele | Kapcsolat. *Régi címek a neten: elixirbiobolt@tolna.net (menteshelyek.hu), bioboltelixir@freemail.hu (gyogynovenybolt.hu)* |
| Nyitvatartás | H 9–17:30, K 9–17, Sze 9–18, Cs 9–17, P 9–17, Szo 9–12:30, V zárva | menteshelyek.hu, magyarvelemeny.com, placedigger | Nyitvatartás tábla, Kapcsolat, JSON-LD. *nyitva.hu és firmania.hu szerint hétfőn 17:00-ig; ellenőrizni!* |
| Kínálat, mentes | allergénmentes, bio, cukormentes, gluténmentes, laktózmentes, tejmentes, vegán, paleo, csökkentett cukortartalmú | [menteshelyek.hu](https://menteshelyek.hu/menteshely/elixir-biobolt/) | Mit talál a polcokon |
| Kínálat, egyéb | reformélelmiszer, gyógyteák, bio termékek, drogéria | magyarvelemeny.com, firmania.hu, nyitva.hu | Mit talál a polcokon |
| Márkák | Zafír viszonteladó; Vitaking üzletlistában szerepel | [zafirnet.hu](https://zafirnet.hu/viszonteladok), webkeresés: „Elixír Biobolt - Vitaking” (vitaking.hu/stores, az oldal 404) | táblázat, vitamin sor |
| Vélemények | 60 értékelés; kedves, segítőkész eladók, beszerzik a nehezen kapható dolgokat, „barátságos és jól felszerelt kis bolt” | [magyarvelemeny.com](https://magyarvelemeny.com/bolt/tapolca/elixir-biobolt/) | „Ha valami nincs a polcon”, bevezető |
| Közösségi | facebook.com/elixirbiobolt, instagram.com/elixirbiobolt | webkeresés | Kapcsolat, JSON-LD |

Az elixirbiobolt.hu-t (Bemutatkozunk, Csapat oldalak) nem tudtuk megnyitni (http→https
átirányítási hurok az eszközeinkben), a Facebook és az Instagram robots.txt miatt nem olvasható.

## Amit mi találtunk ki (élesítés előtt át kell nézetni)

- **Webáruház-minta (`arak.txt`):** mind a 6 termék és minden ár PÉLDA (Hajdinaliszt 1 kg
  1 490 Ft, gluténmentes zabpehely 500 g 1 290 Ft, zabital 1 l 890 Ft, kókuszzsír 500 ml
  1 690 Ft, csalánlevél tea 50 g 690 Ft, eritrit 500 g 1 590 Ft). Márkát szándékosan nem írtunk.
- **Polcok táblázat „Például” oszlopa:** a kategóriák valósak (menteshelyek.hu), a példák
  (növényi italok, eritrit, xilit, szappanok, tisztítószerek stb.) általános becslés.
- **„Ha valami nincs a polcon”:** a beszerzés a vélemények alapján valószínű, de a
  „félre is tesszük” és a tanácsadás mondatai a mi megfogalmazásunk.
- **Webáruház működése:** fizetés (bankkártya, átutalás, utánvét), átvétel (boltban,
  futár, csomagautomata), platform (Shoprenter vagy UNAS) javaslat, nem egyeztetett.
- **„Marton István és a bolt csapata”:** a név az ügyféltől, a megfogalmazás a miénk.
- Minden bevezető és szakaszszöveg a mi megfogalmazásunk; magázó, többes szám első személy.

## Helyőrzők

- **Fotók:** bolt bejárata, gluténmentes polc, gyógyteák, 6 termékfotó. Vékony keretes
  „Fotó: …” téglalapok, nincs stock fotó.
- **Térkép:** keret + Google Térkép link a GPS-koordinátával; beágyazott térkép (külső kérés,
  süti) szándékosan nincs.

## Tőlük kell

1. Hétfői zárás: 17:00 vagy 17:30? (a források eltérnek), és ünnepnapi nyitvatartás.
2. 6–10 saját fotó: bolt kívülről, polcok, pult; és hogy van-e logó.
3. Melyik e-mail él még (gmail, tolna.net, freemail), melyik kerüljön ki.
4. Webáruházhoz: kb. hány terméket tennének fel elsőre, van-e termékadatbázis/árlista
   (pénztárgépből, nagykereskedőtől), és hogyan szállítanának (csak boltban átvétel vagy futár is).
5. Mely márkákat, szolgáltatásokat emeljük ki (pl. rendelésre beszerzés, tanácsadás).

## Árlista / termékek

`arak.txt`: `## polc`, `Terméknév, kiszerelés | ár`, `> megjegyzés`, `# komment`. Az oldal
futás közben betölti (`assets/price-parse.js`), a kiszerelésből egységárat számol (Ft/kg,
Ft/l). Ugyanez be van égetve az `index.html`-be a `termekek:start/end` jelölők közé
(`node tools/bake.mjs`), így JavaScript nélkül is működik. A „Kosárba” gomb csak számol
(minta), nem rendel.

## Dizájn

A `DESIGN.md` alapján. A bolt tárgyaiból: az ajtóra kitett nyitvatartás-kártya (fehér lap,
2px fekete keret, a mai nap félkövér), a polcok listája táblázatban, és a webáruház
termékei polccímke-árcédulák: fehér címke, vékony fekete keret, felül a polc neve, nagy ár,
alatta az egységár, ahogy a boltban kötelező. Papírszínű háttér (`#F3F1EB`), tinta
(`#1D1F1C`), halványabb tinta (`#565B53`), második papírtónus (`#E6E2D7`). Egy kiemelőszín,
a patikaüveg barna (`#7A3B10`), csak gombokon és linkeken. Nem zöld levél, nem öko-sablon.
Egy betűcsalád: **Archivo** (változtatható, saját tárhelyen, a tisztitlak demóból).
Minden sarok szögletes, a gombok 2px-esek. Nincs szemöldök-felirat, számozott kártya,
ikon, átmenet, animáció.

Ellenőrizve: `grep border-radius styles.css` csak `0` és `2px`; egy betűcsalád; nincs dőlt
vagy színes kiemelés a címekben; 320–1440 px között nincs vízszintes görgetés.

## Fájlok

```
index.html            egyoldalas oldal; a termékek a termekek:start/end jelölők között
arak.txt              webáruház-minta termékei (PÉLDA!)
styles.css            tokenek, elrendezés, töréspontok
script.js             termékbetöltő, minta-kosár, mai nap kiemelése
assets/               fonts.css + fonts/, favicon.svg, price-parse.js
tools/bake.mjs        arak.txt beégetése az index.html-be
tools/shoot.mjs       munkaképek ellenőrzéshez (BASE_URL), nem kerülnek a repóba
tools/deliver.mjs     átadási képek: screenshots/elixir-biobolt-{desktop,mobile}.png;
                      asztali 1440 px, mobil 360 px két hasábra hajtva
```

Futtatás: `python3 -m http.server 8231 -d elixir-biobolt`, majd a mappában
`node tools/shoot.mjs` és `node tools/deliver.mjs`.
