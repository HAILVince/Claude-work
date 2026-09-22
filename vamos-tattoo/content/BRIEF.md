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
  melyik legyen, megkérdezve.

## Amire még vár a munka

1. Műtermi kép róla.
2. Google-profil / értékelések linkje.
3. Videó, ha lesz.
4. Melyik galériakép legyen a kiemelt.
5. **Megerősítés a korrekciós űrlapról**: ugyanaz a bejelentkező űrlap egy
   „korrekciót jelzek" jelölőnégyzettel, és akkor kötelező fotót feltölteni.

## Ami nélkül nem indul a munka

1. **A 45 000 Ft első részlet.**
2. **Gmail-cím és jelszó** — új fiók, erre épül a hozzáférés, és ez lesz az
   oldal postafiókja.
3. **Hostinger-belépés**, hogy a domain átvihető legyen Cloudflare-re. A
   levél felajánlja az alternatívát is: ha nem akarja kiadni, elég, ha ő írja
   át a két névszervert, amit küldünk.

## Állapot — 2026-09-22

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
