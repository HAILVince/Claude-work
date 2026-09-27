# GJ Tetőfedő Bádogos — bemutató oldal

Demó a **GJ tetőfedő bádogos** vállalkozásnak (`tetoprofibadogos@gmail.com`).
Vince hideg e-mailjére (a munkáikat Facebookon mutatják, weboldaluk nincs)
ezt válaszolták: *„Igen esetleg van referencia? és milyen árban van?"*

## Amit találtunk (forrásokkal)

Két nyilvános hirdetés a tevekenysegeim.hu oldalon, **ugyanazzal az
e-mail-címmel**, amelyről a válasz jött — ezért tekintjük őket a megrendelő
saját adatainak. A hirdetésekben a vállalkozás neve „Ács tetőfedő bádogos";
a „GJ" rövidítés és a tulajdonos neve sehol nem szerepel.

- <https://www.tevekenysegeim.hu/regi-tetok-felujitasa-nograd-megye-magyarorszag/acs-tetofedo-badogos/MM1p3b6>
- <https://www.tevekenysegeim.hu/olcso-es-profi-tetofedo-pest-megye/acs-tetofedo-badogos/MM1ABSg>

| Adat | Érték | Az oldalon |
|---|---|---|
| Telefon | +36 20 533 85 23 | hero gomb, fejléc, kapcsolat, lábléc |
| E-mail | tetoprofibadogos@gmail.com | kapcsolat, lábléc |
| Cím | Lengyendi út 7, 3070 Bátonyterenye | **csak „3070 Bátonyterenye"** — a pontos utcát szándékosan nem tettük ki (valószínűleg lakcím); ha kéri, beírható |
| Nyitvatartás | H–V 7:00–20:00 | hero, kapcsolat, GYIK |
| Mióta | „2020 óta" | hero felirat |
| Terület | Nógrád, Pest, Heves megye; kérésre országosan | „Hol dolgozunk" szakasz |
| Szolgáltatások | régi tetők teljes körű felújítása, új tetőszerkezet, bádogos és tetőfedő munkák, lemezfedés | szolgáltatás-kártyák |
| Épülettípus | családi ház, ipari épület, társasház | hero, GYIK |
| Felmérés | helyszíni felmérés és árajánlat ingyenes | hero, árak, GYIK |
| Szlogen | „Minden projektet úgy végzünk, mintha a saját otthonunkon dolgoznánk" | a kivitelezés lépésnél átfogalmazva |

Keresések, amelyek nem hoztak semmit: „GJ tetőfedő bádogos", „Tetőprofi
bádogos", Facebook-oldal (nem találtuk meg a linkjét).

## Amit mi találtunk ki (élesítés előtt vele át kell nézetni)

- **Minden ár az `arak.txt`-ben** (7 500 Ft/m²-től, 6 500 Ft/m²-től,
  5 500 Ft/fm-től, 30 000 Ft-tól, 45 000 Ft/db-tól). Csak a „felmérés:
  ingyenes" és „árajánlat: ingyenes" valós. Az, hogy az árak munkadíjat
  jelentenek, szintén feltételezés.
- **Szolgáltatások, amelyek a hirdetésben nem szerepeltek**: ereszcsatorna,
  beázás-javítás, tetőtéri ablak beépítése, kéménybádogozás/szegélyek. (A
  „bádogos munkák" alá valószínűleg beletartoznak, de erősítse meg.)
  Márkanevet (pl. Lindab) szándékosan nem írtunk; „cserepeslemez,
  trapézlemez" szerepel.
- **A kártyák és lépések leíró szövegei** (pl. „egy csapat végzi az ács-,
  tetőfedő és bádogos munkát", „a padlás felől is megnézzük", „tételes,
  írásos ajánlat", „több anyagra is adunk árat", „összeszedjük a bontott
  anyagot").
- **Cégnév-írásmód**: „GJ Tetőfedő Bádogos" — az e-mailes aláírásukból.
- **Referencia-képaláírások** („Tetőfelújítás, családi ház", „Település · év"
  stb.) — mind helyőrző, a valódi munkák fotóihoz kell igazítani.
- **H1 szöveg**: „Tető, ami hosszú évekig bírja az időjárást." — a hirdetés
  „időjárásálló, hosszú élettartamú" megfogalmazásából.
- Az űrlap csak bemutató: ellenőriz, visszajelez, de nem küld el semmit.

## Helyőrzők

- **Fotók**: a hero kép és hat referencia-keret szaggatott vonalas
  „Fotó helye — saját munka" doboz. Nincs stock fotó, nincs külső kép. Ez a
  válasz a „van referencia?" kérdésre: a Facebookon lévő saját fotóik ide
  kerülnek.
- **Facebook-link**: „Facebook-oldal linkjének helye" (a linket nem
  találtuk).

## Árlista

`arak.txt` — `## csoport`, `név | ár`, `> megjegyzés`, `# komment`. Az oldal
futás közben betölti (`assets/price-parse.js`), és ugyanez be van égetve az
`index.html`-be (`node tools/bake.mjs`), így JavaScript nélkül is működik.
Hibás fájlnál a beégetett lista marad. Karbantartást nem vállalunk; az árat
ő maga írja át GitHubon.

## Dizájn

Antracit pala (`#1F2327`) + meleg törtfehér papír (`#F3F1EC`) + egy réz
kiemelés (`#A55A22` gombokon, fehér szöveggel 5,1:1; `#D08A4E` sötét
háttéren). Barlow Condensed 600/700 címek, Barlow 400/500/600 szöveg,
saját tárhelyen (`assets/fonts.css`). A telefonszám a legnagyobb elem a
hero-ban — tetőfedőt telefonon hívnak.

## Ellenőrzés

`node tools/check.mjs` (8191-es porton futó szerverrel): árlista 9 sor /
4 csoport, szerkesztés megjelenik, 6 féle elrontott fájlra visszaesik,
escaping, űrlap (4 kötelező mező), mobilmenü, 12 szélesség 360–1440 között
vízszintes túlcsordulás nélkül — minden zöld.

## Fájlok

```
index.html            egyoldalas oldal; az árak az arak:start/end jelölők között
arak.txt              irányárak (kitalált összegek!)
styles.css            tokenek, elrendezés, töréspontok
script.js             árbetöltő, menü, reveal, űrlap-ellenőrzés
assets/               fonts.css + fonts/, favicon.svg, price-parse.js
tools/bake.mjs        arak.txt beégetése az index.html-be
tools/fonts.mjs       betűkészlet újratöltése
tools/check.mjs       viselkedés + szélesség-teszt
tools/shoot.mjs       képernyőképek (BASE_URL)
tools/deliver.mjs     átadási képek (BASE_URL); a mobil hasábokra hajtva
tools/review.mjs      sávos áttekintő képek
```

Futtatás: `python3 -m http.server 8191 -d gj-tetofedo`, majd a mappában
`BASE_URL=http://127.0.0.1:8191/index.html node tools/shoot.mjs` és
`... node tools/deliver.mjs`.
