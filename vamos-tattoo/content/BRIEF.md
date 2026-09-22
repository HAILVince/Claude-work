# Vamos Tattoo — build brief

**Megbízva 2026-09-21.** Vámos Norbert, `tattoo.vamos@gmail.com`, Szolnok.
Ár: **90 000 Ft**, fizetés **45 000 Ft induláskor, 45 000 Ft élesítéskor**.
Számlaigénye nincs (ezt ő mondta, ne nyissuk újra).

## Amit megvett

Fejlesztés · 1 saját e-mail-cím · saját 404 oldal · e-mail küldő űrlap ·
galéria. Visszatérő költség csak a domain: **2 800 Ft/év** (.eu). Utólagos
változtatás a véglegesítés után **10 000 Ft/óra**.

## Domain és átadás

- **vamostattoo.eu**, jelenleg a Hostingernél; **Cloudflare-re migrálandó**.
- Fejlesztés alatt a domainen „fejlesztés alatt" oldal, az aktuális állapot a
  **vamostattoo.eu/prod** címen.
- Kell egy (lehetőleg új) **Gmail-cím**, arra épül a hozzáférés, és az lesz az
  oldal saját e-mail-fiókja.
- Átadás: Google-höz benyújtás, majd kijelentkezés mindenből és jelszócsere —
  onnantól csak neki van hozzáférése.

## Amit ő kért (az első köre alapján)

- A landingen a **Vamos Tattoo név mellett ő maga is** jelenjen meg —
  műtermi képpel. **A kép még nem érkezett meg.**
- **Saját logó** a bal felső sarokba és a bemutatkozás után.
- **Helyszín nem kerül ki**, csak annyi, hogy **Szolnok** — privát stúdió,
  nem fogad vendégeket munka közben.
- Az űrlap **ne legyen elküldhető elérhetőség nélkül**, és lehessen **képet
  csatolni** (ez váltja ki a linkelést). A „hova szeretnéd" mezőnél **kb-i
  méret cm-ben** kötelező.
- A konzultáció **csak foglalás esetén ingyenes** — ő maga jelezte, hogy a
  10 000 Ft-ot marketingszempontból talán nem érdemes kiírni, és
  visszatért rá, hogy átgondolja. **Kérdezz rá, mielőtt kikerül.**
- **Google-értékelések** a landing aljára. A link még nem érkezett meg.
- Háttéranimáció érdekli, ha van rá több téma.
- Videóbeágyazás: lehetséges, ha küld anyagot.

## Amink megvan

- `content/weboldal-szoveganyag.md` — **az ő saját szövege, teljes**:
  bemutatkozás, stílus, mit nem vállal, korhatár, foglalás és fizetés,
  módosítás és lemondás, érkezés, felkészülés, az alkalom, utókezelés,
  korrekció. Ez a mérvadó szöveg, nem a demó javaslatai.
- `assets/brand/` — négy logófájl, **de nem mind az övé**:
  `vamos-wordmark-black.png` és `vamos-wordmark-white.png` a Vamos Tattoo
  kézírásos szóképe, `inkness-logo-teal.png` és `inkness-logo-white.png`
  pedig az **Inkness Tattoo Care** logója, amit a szövegében az utókezelő
  krémhez kért. A türkiz kör tehát nem a Vamos jele — ezt elsőre elnéztem.
  **Önálló Vamos-jel (ikon) nincs**, csak a szókép, ami favicon méretben
  olvashatatlan; a „v" betűt javasoltuk neki ikonnak.
- `assets/gallery/` — hét munkafotó. **Egy kiemelt, nagyobb helyre kerül**;
  melyik legyen, ránk bízta.
- `assets/studio-src/` — a három műtermi fotó, ahogy megérkezett. Ebből a
  kettő kerül az oldalra (`assets/studio/`): a bárszéken ülő, pulóveres a
  heróba (ezt ő is javasolta, és a saját szóképe van a mellkasán), a mosolygós
  közeli portré a bemutatkozás mellé, fej-váll kivágásban. A harmadik, álló
  képet nem használjuk.

## Amire még vár a munka

1. Videó, ha lesz.
2. Melyik galériakép legyen a kiemelt (ránk bízta, de a jelenlegi választás
   megerősíthető).
3. **Két-három értékelés szó szerint**, ha szeretné, hogy idézetként is
   kikerüljenek — a helye elő van készítve a Vélemények szakaszban.
4. A Google-profil „olvasó" linkje, ha a mostani (értékelésíró) link mellé
   egy „értékelések megnyitása" gomb is kell.

## Ami nélkül nem indul a munka

1. **A 45 000 Ft első részlet.**
2. **Gmail-cím és jelszó** — új fiók, erre épül a hozzáférés, és ez lesz az
   oldal postafiókja.
3. **Hostinger-belépés**, hogy a domain átvihető legyen Cloudflare-re. A
   levél felajánlja az alternatívát is: ha nem akarja kiadni, elég, ha ő írja
   át a két névszervert, amit küldünk.

## Állapot — 2026-09-22 (második kör, Norbert visszajelzése után)

Norbert visszajelzése alapján bekerült:

- **Műtermi kép a heróba** (`assets/studio/norbert-hero.jpg`, 1200×1600) — a
  bárszéken ülő, pulóveres kép, ahogy ő javasolta. A világos háttér a fekete
  heróban világító panelként ül, ezért nem kapott keretet.
- **Portré a bemutatkozás mellé** (`assets/studio/norbert-portre.jpg`,
  800×1000) — a mosolygós közeli, fej-váll kivágásban. A kivágás szándékos: a
  pólófelirat („I listen and I definitely judge") így nem kerül az oldalra.
- **Google-értékelések** — a Vélemények szakasz mostantól egy valódi panel az
  „Értékelést írok" gombbal, ami az általa küldött linkre mutat
  (`https://g.page/r/CZ-XETu7AiRvEAE/review`). Idézeteknek előkészített,
  kikommentelt blokk vár a HTML-ben.
- **Favicon** (`assets/favicon.svg`) — a szóképből kivágott **„v" betű**,
  kontúrra vektorizálva, csontszínnel tintafekete lapon. Ez a saját
  betűtípusának a betűje, nem utánrajzolás: a `vamos-wordmark-black.png`
  0–185 × 87–310 pixeles részéből származik.
- **Űrlap** — a „korrekciót jelzek" pipa mostantól **kikapcsolja** a testrész
  és a méret mezőt (a meglévő tetoválásból látszik mindkettő), és marad a
  fotó, a leírás és az időpont. Új, csak tájékoztató pipa: **„Ez lesz az első
  tetoválásom"** — nem változtat a kötelező mezőkön, csak jelzi Norbertnek,
  hogy több magyarázat kell. A két pipa kizárja egymást.

## Állapot — 2026-09-22 (első változat)

**Az oldal első változata elkészült**, privát artifact-linken nézhető meg
(csak Vince fér hozzá, amíg meg nem osztja). A fizetés, a Gmail-pár és a
Hostinger-belépés még nem érkezett meg, tehát a domain és az éles tárhely
felé még nem indult semmi — ez csak a lap.

Ami rajta van: az ő teljes szövege szó szerint, a hét fotó webre
újrakódolva (8,7 MB → 1,2 MB), a szókép a fejlécben és a heróban, az
Inkness logó a krémnél, a hosszú tudnivalók saját szakaszban tapadó
tartalomjegyzékkel, és az időpontfoglaló űrlap.

Ami hely van fenntartva: a **műtermi kép** a heróban (keretes slot), és a
**Google-értékelések** szakasza.

Az űrlap logikája: a „korrekciót jelzek" jelölőnégyzet átírja a kérdést
(„Mit javítanál rajta?"), a fotót kötelezővé teszi, és elengedi a méretet —
egy korrekcióhoz nincs értelme cm-t kérni.

Elkészült az **adatkezelési tájékoztató** (`adatkezeles.html`), a lábléc
alsó sorából érhető el, mellette a „Fejlesztette: Axióma Webfejlesztés"
kredit axiomaweb.hu hivatkozással (a 404-es oldalon is).

**A tájékoztató nem teljes, és ezt ki is írja magáról.** Egy keretes doboz
jelzi a tetején, hogy a szögletes zárójeles helyekre a hivatalos adatok
kerülnek. Ami hiányzik:

- a vállalkozás **hivatalos neve, székhelye, nyilvántartási száma / adószáma**
- a **tárhelyszolgáltató neve és címe** (ez az élesítés után derül ki)
- a megőrzési idők megerősítése (1 év érdeklődésre, 2 év elkészült
  tetoválásra — ez javaslat)

Ami viszont igaz és ellenőrzött: az oldal **nem használ sütiket** és nem mér
látogatottságot, tehát süti-felugró sem kell. A tájékoztató kitér arra is,
hogy az űrlap szándékosan nem kérdez egészségügyi adatot, és hogy a
galériába kerülő vendégfotókhoz külön hozzájárulás kell.

## Amit a szövege miatt meg kell építeni

- Az űrlapnak **fájlfeltöltést** kell tudnia (inspirációs képek, illetve a
  korrekcióhoz éles fotó) — ez több, mint az eddigi demók űrlapjai.
- **Méret cm-ben**, kötelező mezőként.
- A korrekciós ág: jelölőnégyzet + kötelező fotó.
- Az utókezelés hosszú, tagolt szöveg — saját szakasz, nem a „tudnivalók"
  közé gyömöszölve.
