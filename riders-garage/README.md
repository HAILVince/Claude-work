# Rider's Garage: demó

Ügyfél: **Rider's Garage**, info@ridersgarage.hu. Mostani oldal: ridersgarage.hu (WordPress, HTTPS nélkül).
A hideg e-mailben felajánlott ingyenes mintaoldalra „Igen”-nel válaszoltak. Az e-mail
pótalkatrész-árusítást és egy későbbi webshopot említett; ez a demó bemutatkozó oldal
„kérjen árajánlatot / hívjon” folyamattal, **nem** webshop.

## Amit találtunk (forrásokkal)

A ridersgarage.hu-t és a Facebook-oldalt nem tudtuk megnyitni (időtúllépés, robots.txt),
így csak a keresőtalálatok címei álltak rendelkezésre. Kevés a biztos adat.

| Adat | Érték | Forrás | Az oldalon |
|---|---|---|---|
| Név | Rider's Garage | [ridersgarage.hu](https://ridersgarage.hu/) (találati cím: „Rider's Garage - ridersgarage”) | mindenhol |
| E-mail | info@ridersgarage.hu | ügyfél (erről válaszoltak) | fejléc alatt, űrlap, Kapcsolat, lábléc |
| Oldalak a régi webhelyen | „Szolgáltatásaink”, „Kapcsolat” | [ridersgarage.hu/szolgaltatasaink](https://ridersgarage.hu/szolgaltatasaink/), [ridersgarage.hu/kapcsolat](https://ridersgarage.hu/kapcsolat/) | – |
| Tevékenység | motoros műhely („garage”), a hideg e-mail szerint pótalkatrész | domain, Facebook-név, hideg e-mail | Szerviz, Alkatrész |
| Facebook | „Rider's Garage \| Bazsi”, facebook.com/motokulcsar | [facebook.com/motokulcsar](https://www.facebook.com/motokulcsar/) | Kapcsolat, JSON-LD |
| Régi oldal állapota | a domainen egy „Oldalak Magyar Blackjack Játék Ingyen” című kaszinós spamoldal is indexelve van, valószínűleg feltört WordPress | webes keresés (ridersgarage.hu) | – |

## Amit mi találtunk ki (élesítés előtt át kell nézetni)

- **Telefonszám:** `+36 30 000 0000` / `tel:+36300000000` — PÉLDA, mindenhol cserélni kell.
- **Cím:** szaggatott aláhúzással „a műhely címe ide kerül” helyőrző. JSON-LD-ben nincs cím.
- **Nyitvatartás:** „H–P 9–17 óra, szombaton bejelentkezéssel” — kitalált.
- **Árak (`arak.txt`):** minden összeg becsült PÉLDA (kis szerviz 18 000 Ft-tól, nagy szerviz 65 000 Ft-tól, óradíj 14 000 Ft stb.).
- **Szolgáltatáslista** (Szerviz szakasz) és a **alkatrésztáblázat** beszerzési idői („raktáron”, „1–3 munkanap”) — általános motorszervizes kínálat, nem tőlük származik.
- **Márkák:** „japán és európai motorok, robogók is” — feltételezés.
- **A javítás menete, Kérdések:** a mi megfogalmazásunk (saját alkatrész beszerelése, megvárható munkák, garancia).
- **Szövegek:** magázó, többes szám első személy, a mi fogalmazásunk.

## Helyőrzők

- **Fotók:** műhely (nyitókép), szelephézag-állítás, fékbetétcsere. Vékony keretes „Fotó: …” téglalapok, nincs stock fotó.
- **Térkép:** „Térkép: a műhely helye” keret; beágyazott térkép nincs (külső kérés, süti).

## Tőlük kell

1. Telefonszám és pontos cím (település, utca), kell-e bejelentkezés.
2. Nyitvatartás.
3. Valódi munkadíjak (kis/nagy szerviz, óradíj, gumiszerelés), és hogy kiírhatók-e.
4. Milyen márkákkal / típusokkal foglalkoznak, és az alkatrész-beszerzés hogyan megy (raktár, határidők).
5. 6–10 saját fotó a műhelyről és munkákról; logó, ha van.
6. Melyik Facebook-oldal a hivatalos, és a tulajdonos neve kiírható-e („Bazsi”?).

## Árlista

`arak.txt`: `## csoport`, `név | ár`, `> megjegyzés`, `# komment`. Az oldal futás közben
betölti (`assets/price-parse.js`). Ugyanez be van égetve az `index.html`-be az
`arak:start/end` jelölők közé (`node tools/bake.mjs`), így JavaScript nélkül is működik.

## Alkatrész-kérés

Az űrlap (márka, típus, évjárat, alkatrész, név, telefon, „beszerelést is kérek”) nem küld
szerverre: JavaScripttel olvasható e-mailt nyit az info@ridersgarage.hu címre, anélkül
sima `mailto` űrlap. Élesben ide jöhet egy egyszerű űrlapkezelő, később webshop.

## Dizájn

A `DESIGN.md` alapján: munkalap / alkatrészpult-lista. Betonszürke papír (`#EDECE8`),
fekete tinta (`#17191B`), halványabb tinta (`#4F5358`), második papírtónus (`#E0DED8`)
a fotóhelyekhez, űrlaphoz, kapcsolat-blokkhoz. Egy kiemelőszín, égetett narancs (`#A83A0C`),
csak gombokon és linkeken (fehér rajta 6,1:1, papíron 5,3:1). Két betűcsalád, saját
tárhelyen: **Barlow Condensed** 700 nagybetűs címekhez (műhelytábla-hatás), **Barlow**
400/600 a szöveghez (a gj-tetofedo demóból átvett fájlok). Minden sarok szögletes,
gomb 2px. Szakaszok előtt 3px-es fekete vonal, árak és alkatrészek táblázatban, a menet
definíciós lista. Nincs szemöldök-felirat, kártyasor, ikon, animáció.

Ellenőrizve: `grep border-radius styles.css` csak `0` és `2px`; nincs dőlt vagy színes
kiemelés címben; 320–1440 px között nincs vízszintes görgetés.

## Fájlok

```
index.html            egyoldalas oldal; az árak az arak:start/end jelölők között
arak.txt              árlista (MINDEN ÖSSZEG PÉLDA)
styles.css            tokenek, elrendezés, töréspontok
script.js             árbetöltő (arak.txt) + alkatrész-kérés e-mailbe
assets/               fonts.css + fonts/, favicon.svg, price-parse.js
tools/bake.mjs        arak.txt beégetése az index.html-be
tools/shoot.mjs       munkaképek ellenőrzéshez (BASE_URL)
tools/deliver.mjs     átadási képek: screenshots/riders-garage-{desktop,mobile}.png
                      (asztali 1440 px, mobil 360 px két hasábra hajtva)
```

Futtatás: `python3 -m http.server 8231 -d riders-garage`, majd a mappában
`node tools/deliver.mjs`.
