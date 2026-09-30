# Csak Pizza, Tatabánya: demó

Ügyfél: **Szabó Zoltán**, „Csak Pizza” / „Pizza Eater Tatabánya”, csakpizza2020@gmail.com.
Mostani oldal: csakpizza.hu. Ez a falatozz.hu mögötti **Rillgo** éttermi rendszeren fut
(a lap címe „Falo - Online ételrendelés”), és a platform minden rendelés után jutalékot von le.
A falatozz.hu-n és a Facebookon az üzlet **Faló** néven szerepel. A „Pizza Eater” a „Pizzafaló” fordítása,
a Restaurant Guru is ezen a néven listázza.

A kérése: legyen egy bemutató oldal az étlappal, és egy külön rendelőoldal. A saját webshop fogadja a
rendelést, a pénz a saját számlájukra menjen, a bolt kapjon értesítést, és a rendelést ki lehessen
nyomtatni cetlinek, amit a futár visz a vevőhöz.

A demó két oldal:

- `index.html`: étlap (kategóriák, 22/32/47 cm-es árak), hétközi ajánlat, kiszállítás, nyitvatartás, kapcsolat.
- `rendeles.html`: kosár, kiszállítás vagy elvitel, cím, fizetési mód, és alul a **konyhai cetli** élő
  előnézete, amely nyomtatható (80 mm-es tekercsre). **Csak minta:** nincs háttérrendszer, semmi nem megy el.

## Amit találtunk (forrásokkal)

| Adat | Érték | Forrás | Az oldalon |
|---|---|---|---|
| Üzemeltető | Falánk City Kft., adószám 14804371-2-11 | [csakpizza.hu ÁSZF](https://csakpizza.hu/terms-and-conditions), [falatozz.hu Faló](https://falatozz.hu/rendeles/Tatabanya/Falo/) | lábléc |
| Cím | 2800 Tatabánya, Erkel Ferenc utca 4. | csakpizza.hu, ÁSZF, falatozz.hu | kapcsolat, lábléc, JSON-LD, cetli |
| Telefon | +36 30 861 7969 („Ügyfélszolgálat”); az ÁSZF-ben még 30/486-9383 és 34/785-902 | [csakpizza.hu](https://csakpizza.hu/), ÁSZF | fejléc, nyitókép, kapcsolat (csak az első) |
| E-mail | csakpizza2020@gmail.com | csakpizza.hu, ügyfél | kapcsolat, rendelőoldal |
| Nyitvatartás | „Ma: 10:00 - 21:00”, „Holnap: 10:00 - 21:00” (szerda, csütörtök); a falatozz.hu-n 10:00–20:55 | csakpizza.hu, falatozz.hu | minden napra 10–21, „utolsó rendelés 20:55” |
| Kiszállítás | „Tatabánya és vonzáskörzete”, 50–85 perc, legkisebb rendelés 2 000 Ft | csakpizza.hu, ÁSZF | tények sáv, Kiszállítás |
| Vidékre | „Vidékre 3 000 Ft feletti rendelés esetén szállítanak ki” | falatozz.hu | Kiszállítás, rendelőoldal figyelmeztetése |
| Csomagolás | „Egyszeri csomagolási díj 100 Ft” | falatozz.hu | étlap alja, kosár, cetli |
| Fizetés | bankkártya online, OTP és K&H SZÉP-kártya, készpénz a futárnál | csakpizza.hu, ÁSZF | Kiszállítás, rendelőoldal |
| Étlap | pizzák 22/32/47 cm-ben (2 050 / 2 990–3 190 / 5 990 Ft), gyros, hamburger, tészta, desszert, üdítő, sör, feltétekkel és árakkal | falatozz.hu (Faló, 2026. 09. 30.) | `arak.txt`, étlap, rendelőoldal |
| Ajánlat | „2db 32cm-es Sonkás-kukoricás pizza csak 4 980 Ft”; hétfőtől csütörtökig 2 490 Ft: 32 cm-es Sonkás-kukoricás, Margaréta, Hawaii, Falócsa, Bőség pizza, rántott csirkemell, rántott sajt | falatozz.hu | ajánlat doboz |
| Facebook | facebook.com/csakpizza.hu („Faló, Tatabánya”) | keresőtalálat | kapcsolat, JSON-LD |

A csakpizza.hu étlapja a letöltéskor üres volt („Menü nem érhető el erre a hétre”), ezért az étlap a
falatozz.hu Faló-oldaláról jön. A pizza-etterem.hu, a Restaurant Guru és a cylex oldalát nem tudtuk megnyitni.

## Amit mi találtunk ki vagy egyszerűsítettünk (élesítés előtt át kell nézetni)

- **Étlap terjedelme:** a falatozz.hu 103 pizzát sorol fel, a mintában 44 van, a többi kategóriából is csak egy rész (pl. 7 hamburger a 12-ből). A feltéteket vesszős listára írtuk át, az alapot a csoportcímbe tettük („paradicsomos alap”, „tejfölös alap”, „más alap”).
- **22 és 47 cm-es árak:** néhány pizzánál a letöltött adatban csak a 32 cm-es ár látszott; ott a többi pizza alapján 2 050 és 5 990 Ft-ot írtunk be. Át kell nézni.
- **„Az alap fokhagymás tejföl”** megjegyzés: a legtöbb tejfölös pizza így szerepel, de a csoportosítás a miénk.
- **Kiszállítási körzetek és díjak** (rendelőoldal): Tatabánya 300, Vértesszőlős 600, Környe 700, Tarján 900, Tata 900 Ft — **PÉLDA**, a települések is. A főoldalon a díj helyén szaggatott aláhúzású helyőrző áll.
- **Nyitvatartás minden napra 10–21:** csak két napot láttunk, a hetet ebből feltételeztük.
- **Elvitel „kb. 20 perc alatt kész”**, **„a futárnál is van terminál”** (kártyás fizetés átvételkor): feltételezés. Az eredeti oldalon csak a készpénz a futárnál szerepel.
- **Konyhai cetli, értesítés:** a hangjelzés, az e-mail a boltnak, az SMS/e-mail a vevőnek, a rendelésszám (1042) és a „Minta Péter / +36 20 000 0000 / Minta utca 12.” vevőadat mind minta.
- **Fizetés a saját számlára:** a szöveg egy hazai fizetési szolgáltatót (pl. Barion vagy SimplePay) feltételez; a szolgáltató nincs kiválasztva.
- **Szövegek:** magázó, többes szám első személy, a mi fogalmazásunk. A „Csak Pizza” nevet használtuk; a Faló név csak a források között van.

## A megjelenés

Kemence-fekete alap, egy paradicsompiros mező a nyitóképen és a kiszállításnál, sajtsárga gombok és
linkek. A nyitóképen kézzel rajzolt SVG pizza felülről, rajta a három méret köre valós arányban
(22, 32, 47 cm) és a méretek kezdőára. Címek: Titan One, minden más: Rubik (mindkettő saját tárhelyről,
`assets/fonts`). Szögletes sarkok, fotó nincs és helyőrző doboz sincs.

## Hogyan működne élesben

1. A vevő a `rendeles.html`-en összerakja a kosarat; a kosár és az árak ugyanabból az `arak.txt`-ből jönnek, mint az étlap.
2. Online fizetésnél a fizetési szolgáltató oldala nyílik meg, a pénz a Falánk City Kft. számlájára megy, rendelésenkénti platformjutalék nélkül.
3. A rendelés a saját szerverre kerül, a konyhán hangjelzés szól, e-mail megy a csakpizza2020@gmail.com címre.
4. A konyhán egy gombbal kinyomtatják a cetlit (80 mm-es hőpapíros nyomtató); a nyomtatási nézet csak a cetlit adja ki.

## Tőlük kell

1. A teljes, aktuális étlap (vagy engedély, hogy a falatozz.hu-s listát vegyük át), és hogy minden pizza kapható-e mindhárom méretben.
2. Kiszállítási körzetek és díjak, a vidéki települések listája.
3. A heti nyitvatartás, és hogy meddig vesznek fel rendelést.
4. Melyik név legyen elöl: Csak Pizza, Faló vagy Pizzafaló; logó, ha van.
5. Fizetés: van-e már kártyás elfogadójuk (Barion, SimplePay, OTP), elfogadnak-e kártyát a futárnál.
6. Van-e a konyhán számítógép vagy tablet és hőpapíros nyomtató.
7. Saját fotók a pizzákról és az üzletről (később, a rajz addig jó).

## Árlista, étlap

`arak.txt`: `## csoport`, `= 22 cm | 32 cm | 47 cm` (méretoszlopok), `név | feltét | ár | ár | ár`,
`> megjegyzés`, `# komment`. Mindkét oldal futás közben betölti (`assets/price-parse.js`,
`assets/menu-html.js`). Az étlap be van égetve az `index.html`-be is az `etlap:start/end` és
`toc:start/end` jelölők közé (`node tools/bake.mjs`), így JavaScript nélkül is látszik.

## Fájlok

- `index.html`, `rendeles.html`, `styles.css`, `script.js` (étlap), `order.js` (kosár, űrlap, cetli)
- `arak.txt`, `assets/price-parse.js`, `assets/menu-html.js`, `assets/fonts.css`, `assets/fonts/`, `assets/favicon.svg`
- `tools/bake.mjs` (étlap beégetése), `tools/deliver.mjs` (képernyőképek)
- `screenshots/csak-pizza-desktop.png`, `csak-pizza-mobile.png` (360 px, két hasábba hajtva), `csak-pizza-rendeles-desktop.png`

Képernyőképek: `python3 -m http.server 8247 -d csak-pizza`, majd a mappában `node tools/deliver.mjs`.
