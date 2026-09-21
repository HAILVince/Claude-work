# Dr. Nagy Levente Ákos — landing page prototype

Demo for **dr. Nagy Levente Ákos**, közlekedési és büntető ügyvéd, Debrecen
(`drnagyleventeakos@gmail.com`, +36 70 337 0361). Current site:
drnagyleventeakosugyved.hu

## Research this was built from

- **1994-től 18 év a rendőrségnél** — helyszínelő és baleseti nyomozó
- Jogi diploma **Miskolci Egyetem, 2002**; szakvizsga **2006**
- A rendőrség után alkalmazott ügyvéd Debrecen egyik legnagyobb irodájában
- **2018 óta egyéni ügyvéd**
- Iroda: 4024 Debrecen, Petőfi tér 18. 1/7 — eljár Debrecenben és Nyíregyházán
- Ügytípusok a saját oldaláról: ittas vezetés, járművezetéstől eltiltás,
  járművezetés tiltott átengedése, közlekedési balesetek, büntetőügyek

## The thesis

The eighteen years as an **accident investigator** is the whole page. He was
the person who built these cases before he started defending them — no other
traffic lawyer in Debrecen can say that. The hero says it plainly:

> Tizennyolc évig én nyomoztam ezeket az ügyeket. **Ma én védem őket.**

## Design

The reader is frightened and often ashamed, searching late at night after
something went wrong. So the page is serious and steady but never intimidating.
Warm paper, graphite, one claret. Deliberately **no scales, no gavels, no
navy-and-gold** — the clichés of the category.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F4F1` | page ground |
| `--ink` | `#17191C` | "Miért én" block, contact block |
| `--graphite` | `#23262B` | facts strip, footer |
| `--claret` | `#7A2E2E` | accent — 8.4:1 on paper |

Type: **Spectral** for display (serious screen serif, not Playfair), **IBM Plex
Sans** for body. Self-hosted. Note the font pipeline needed a fix: multi-weight
families collided on filename, so only the last weight survived — weights are
now part of the filename, verified 12 files to 12 `@font-face` blocks.

## No outcome promises

Deliberate: the copy never suggests a result. *"Nem ígérek eredményt — azt
tisztességes ügyvéd nem tehet. Azt viszont megígérem, hogy őszintén megmondom,
mire számíthat."* Same applies to the ranking question in the e-mail: say what
actually changes, don't name a number.

## The contact form

Posts to **Web3Forms** → his inbox. Demo mode until a key is set in
`data-access-key` on `<form id="contactForm">`. The form states that what is
written is covered by ügyvédi titok.

## Placeholder — confirm with him

- **Whether the practice-area list is complete**, and whether sértetti
  képviselet belongs on it.
- **Ügyvédi díj** — not stated on the page, only that it is agreed in writing.
- **A photo of him.** A lawyer's page works far better with a face; there is
  none in the demo.
- Kamarai nyilvántartási szám, ha ki akarja írni.
