# Canvis de l'enquesta — sessió «dades»

Text ja redactat perquè el coordinador el passi als documents numerats
(`docs/diari.md`, `docs/historic.md`, `docs/decisions.md`, `docs/reptes.md`).
Data de la feina: 2026-11-21/22.

---

## Entrada del diari

### 2026-11-22 — Les dades de la web: 8 expansions més, d'on surten els preus i un «Actualitza» que falla bé

**Què s'ha fet**

- **8 expansions noves**, totes les del bloc Scarlet & Violet que faltaven
  abans de Shrouded Fable: Scarlet & Violet, Paldea Evolved, Obsidian
  Flames, 151, Paradox Rift, Paldean Fates, Temporal Forces i Twilight
  Masquerade. La web passa de 14 a 22 expansions. La 151 l'havien
  demanada dues persones a l'enquesta. Cada expansió nova té el seu color
  (tema) triat a partir del logotip, amb el contrast comprovat per càlcul.
- **D'on surten els preus.** Al panell d'estadístiques, just sota «Les
  cartes que en tens valen», ara hi diu que els preus són aproximats, que
  surten de Cardmarket i TCGplayer (a través de TCGdex i pokemontcg.io) i
  de quin dia són. Un desplegable «Com es calculen?» ho explica en dues
  frases. Ho demanava un col·leccionista actiu que no se'n refiava. El peu
  de la pàgina ara també diu les dues fonts (abans només en deia una).
- **El botó «Actualitza» falla bé.** Un usuari deia que «alguns cops falla
  la connexió a la API». Ara la web ho torna a provar sola fins a 6 vegades
  durant un minut, avisa a cada intent («Ho tornem a provar, 2 de 5...»),
  i si no se'n surt explica el motiu en paraules planeres (no hi ha
  internet, el servidor triga massa, massa actualitzacions seguides, el
  servidor està caigut...) i recorda que continues veient les dades d'abans,
  que no s'han tocat.

**Eines usades:** Claude Code (Opus 5.5) com a orquestrador, amb subagents
per triar els colors dels temes i per revisar el codi; el programa del
projecte `tools/fetch_data.py` per baixar les dades; el navegador integrat
per comprovar-ho tot en mida d'ordinador i de mòbil (390 px).

**Costos:** 0 €. Les dues fonts de dades (pokemontcg.io i TCGdex) són
gratuïtes.

**Problemes**

- L'API de pokemontcg.io ha fallat contínuament durant la baixada (errors
  500, 502 i 503). A Temporal Forces van caldre 5 intents seguits, i
  Twilight Masquerade va esgotar els 6 intents dues vegades i es va haver
  de tornar a provar al cap d'uns minuts. Aquest mateix comportament és el
  que feia fallar el botó «Actualitza»: abans només esperava uns 9 segons
  en total abans de rendir-se, i ara n'espera un minut.
- A Scarlet & Violet (la primera expansió del bloc) tots els preus sortien
  com a «aproximats». Investigant-ho es va veure que TCGdex, en aquesta
  expansió, guarda els preus a la carta sencera i no a cada variant, i el
  programa els perdia. Es va arreglar sense canviar el format de les dades
  i ara 438 de les 444 peces tenen preu de Cardmarket al dia.
- Les dades pesen: `app/data/` creix de 17,1 MB a 26,5 MB (+9,4 MB, uns
  1,2 MB per expansió). No fa més lenta la web, perquè només es baixa
  l'expansió que es mira, però el repositori sí que creix: si algun dia
  s'acosta al límit recomanat de GitHub Pages (1 GB), caldrà esborrar
  versions antigues.

---

## Entrades de l'històric

### Vuit expansions més: tot el bloc Scarlet & Violet

S'han afegit les 8 expansions de Scarlet & Violet anteriors a Shrouded
Fable (Scarlet & Violet, Paldea Evolved, Obsidian Flames, 151, Paradox
Rift, Paldean Fates, Temporal Forces i Twilight Masquerade), amb el mateix
programa de sempre. Ara la web en té 22. Cada una té un color propi tret
del logotip: vermell escarlata (Scarlet & Violet), terracota (Paldea
Evolved), taronja de foc (Obsidian Flames), rosa de Mew (151), blau
elèctric (Paradox Rift), rosa daurat «shiny» (Paldean Fates), aiguamarina
(Temporal Forces) i verd d'Ogerpon (Twilight Masquerade).

### La web diu d'on surten els preus

Al panell d'estadístiques, sota el valor de la col·lecció, hi ha una frase
amb les fonts dels preus (Cardmarket i TCGplayer, via TCGdex i
pokemontcg.io), el dia en què es van baixar i l'avís que són aproximats,
més un desplegable «Com es calculen?» amb la regla resumida. Ve d'una
petició de l'enquesta.

### El botó «Actualitza» torna a provar-ho i explica per què falla

El botó que baixa dades noves ara espera fins a un minut quan el servidor
de les cartes falla, avisa de cada reintent i, si no se'n surt, diu el
motiu en llenguatge planer sense perdre les dades que ja es veien.

---

## Repte

### Quan la font de dades falla més del que funciona

*2026-11-22*

Durant la baixada de les vuit expansions noves, el servidor de
pokemontcg.io va respondre amb error moltíssimes vegades: gairebé a cada
expansió calia tornar-ho a provar, i en una es va haver d'esperar uns
minuts i començar de nou. Això explica una queixa de l'enquesta: el botó
«Actualitza» de la web es rendia al cap d'uns nou segons, i amb un servidor
així sovint no n'hi havia prou. La solució no és tenir un servidor millor
(no depèn de nosaltres i no en podem pagar cap), sinó fer que la web sigui
pacient i honesta: que ho torni a provar diverses vegades esperant cada cop
una mica més, que avisi que ho està fent, i que, si al final no pot, ho
digui clarament i no toqui les dades que ja tenia.

Un segon problema va sortir comparant les dues fonts de preus: en una de
les expansions, una font guardava els preus d'una manera diferent de la
resta, i el programa no els trobava. Sense mirar les dades una per una no
s'hauria vist, perquè la web no fallava: simplement mostrava preus menys
fiables. És un exemple de per què cal revisar els resultats i no només
comprovar que «funciona».
