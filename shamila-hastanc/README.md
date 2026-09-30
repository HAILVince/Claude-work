# Shamila hastánc, Szombathely: demó

Ügyfél: **Csuka Adrienn**, színpadi nevén **Shamila**, hastánc-oktató Szombathelyen.
shamila.dance@gmail.com, +36 70 424 8294.
Jelenlegi oldal: www.shamila.hu. Régi, nincs HTTPS, mobilon nem használható. Ebből a környezetből
nem értük el, ezért a tartalmát nem néztük meg.
Facebook: facebook.com/Shamiladance · Instagram: @shamiladance

## Amit találtunk (forrásokkal)

A shamila.hu-t nem tudtuk megnyitni. Az adatok webes keresésből származnak, a pontos
forrás-URL-eket (a Turul-listázáson kívül) élesítés előtt érdemes újra kigyűjteni.

| Adat | Érték | Forrás | Az oldalon |
|---|---|---|---|
| Név, színpadi név | Csuka Adrienn, „Shamila” | webes keresés, Facebook | fejléc, Rólam, lábléc |
| Telefon, e-mail | +36 70 424 8294, shamila.dance@gmail.com | webes keresés, oktatasturul.eu | hero, fejléc, kapcsolat |
| Közösségi | facebook.com/Shamiladance, @shamiladance | Facebook, Instagram | kapcsolat |
| Tánc | 2004 óta | webes keresés | hero felirat, Rólam |
| Oktatói képesítés | 2007, Budapest | webes keresés | Rólam |
| Tanít Szombathelyen | 2010 óta | webes keresés | Rólam |
| Órák | heti csoportos órák, kérésre magánóra | webes keresés | Órák |
| Tanítványi fellépés | évente 1–2 alkalom | webes keresés | Órák („Színpad”) |
| Szemlélet | önbizalom, nőiesség, belső egyensúly, támogató közösség | webes keresés | Rólam |
| Fellépések | szóló, duó, csoportos; klasszikus keleti tánc modern elemekkel; céges rendezvény, esküvő, fesztivál, magánünnep | webes keresés | Fellépések |
| Savaria Karnevál | „Keleti udvar” hastánc-program, Szombathely | webes keresés (Savaria Karnevál program) | Fellépések |
| Jelmondat | „nőiesség, elegancia és a keleti világ szépségei” | webes keresés | hero lede |
| Díj | Turul Oktatás díj, 2025 és 2026 | oktatasturul.eu listázás | Rólam |
| Cím | Szombathely, Bejczy István u. 1-3., III. emelet 41. | oktatasturul.eu listázás | **csak „Szombathely”**. **Nem ellenőrzött:** lehet a terem, de lehet lakcím is. Tőle kell megkérdezni. |

## Amit mi találtunk ki (élesítés előtt vele át kell nézetni)

- **Órarend (PÉLDA):**
  Kedd 18:00–19:00 kezdő, kedd 19:15–20:30 haladó,
  csütörtök 18:00–19:00 kezdő, csütörtök 19:15–20:30 koreográfia/fellépésre készülés,
  magánóra egyeztetés szerint. Az `index.html`-ben van (`#orarend`), nem az `arak.txt`-ben.
- **Minden ár az `arak.txt`-ben (PÉLDA):** havi bérlet heti 1 óra 12 000 Ft, heti 2 óra 20 000 Ft,
  alkalmi jegy 3 500 Ft, próbaóra 2 500 Ft, egyéni magánóra (60 perc) 10 000 Ft, páros óra
  14 000 Ft, fellépés „egyedi ajánlat”. Az is kitalált, hogy a bérlet a naptári hónapra szól.
  Az is, hogy van próbaóra és páros óra.
- **Szövegek:** a címsorok („Nem kell tudnod táncolni. Ezért jössz.”, „Tánc az ünnepedre”,
  „Várlak az első órán.”), a kártyák leírásai, a „Kezdőket is szeretettel várok” és a
  „Gyere el egy órára, és próbáld ki!” mondat. A tényeken alapulnak, a megfogalmazás a miénk.
  Tegező, első személyű hang (Adrienn beszél).
- „Koreográfia, fellépésre készülés” órarend-tétel és a „Kérj ajánlatot” e-mail-tárgy.

## Helyőrzők

- **Fotók:** hero („Shamila tánc közben”), portré, csoportos óra, tanítványok fellépése,
  fellépés. Mind szaggatott vonalas „Fotó helye” keret. Nincs stock fotó, nincs külső kép.
- **Terem címe:** csak „Szombathely”. Az órarend alatt: „jelentkezéskor megírom a részleteket”.

## Tőle kell

1. 4–6 saját fotó: tánc közben (álló), portré, óra, színpad/fellépés.
2. A valódi órarend: napok, időpontok, szintek, és a terem pontos címe.
3. A valódi árak. Az `arak.txt`-be ő maga is beírhatja.
4. Megerősítés, hogy a Bejczy István utcai cím kiírható-e.
5. Maradjon-e a tegező megszólítás, a „Shamila” vagy a „Csuka Adrienn” legyen-e hangsúlyosabb,
   és van-e logója.
6. Domain: a shamila.hu marad, HTTPS-sel.

## Árlista

`arak.txt`: `## csoport`, `név | ár`, `> megjegyzés`, `# komment`. Az oldal futás közben
betölti (`assets/price-parse.js`). Ugyanez be van égetve az `index.html`-be az
`arak:start/end` jelölők közé (`node tools/bake.mjs`), így JavaScript nélkül is működik.
Hibás fájlnál a beégetett lista marad.

## Dizájn

Mély szilva (`#2A0F23`, gombokon `#5A1F4A`), meleg törtfehér (`#FAF5F0`), meleg arany
(`#D6B06E` sötét háttéren, `#8C6429` világos háttéren). Spectral 300/500/600 címek,
Inter szöveg, saját tárhelyen (`assets/fonts.css`, a st-decor demóból átvéve).
Egyetlen díszítés van: a nyolcágú csillag (két elforgatott négyzet). Mellette a
fotókeretek felül íveltek, mint egy keleti boltív. Nincs pénzérme, fátyol vagy arab
kalligráfia-utánzat.

## Fájlok

```
index.html            egyoldalas oldal; az árak az arak:start/end jelölők között
arak.txt              árlista (PÉLDA összegek!)
styles.css            tokenek, elrendezés, töréspontok
script.js             árbetöltő, menü, reveal
assets/               fonts.css + fonts/, favicon.svg, price-parse.js
tools/bake.mjs        arak.txt beégetése az index.html-be
tools/shoot.mjs       képernyőképek (BASE_URL)
tools/deliver.mjs     átadási képek (BASE_URL); a mobil két hasábra hajtva
```

Futtatás: `python3 -m http.server 8194 -d shamila-hastanc`, majd a mappában
`node tools/shoot.mjs` és `node tools/deliver.mjs`.
Ellenőrizve 320–1440 px között: nincs vízszintes görgetés.
