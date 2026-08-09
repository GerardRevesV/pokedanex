# Especificacions de Pokedanex

> Versió 2 — Fase 0 tancada (2026-08-09). Incorpora les respostes de
> l'entrevista i les conclusions de la investigació del projecte tcg
> (`recerca-tcg-sorcery.md`).

## Què és

**Pokedanex** és una web de col·leccionisme de cartes Pokémon. L'usuari marca
quines cartes té (i quantes), i la web li mostra el valor aproximat de la
seva col·lecció i quant li costaria completar-la.

## Abast de la primera versió (v1)

- Funciona **en local**, sense servidor de veritat ni base de dades: una web
  estàtica que es pot obrir amb un servidor local senzill. Publicació a
  Internet en fases posteriors.
- **Una sola expansió: Shrouded Fable** (SV6.5, agost 2024; 64 cartes
  numerades + secretes fins a 99), preparada perquè afegir-ne més sigui fàcil.
- **Sense registre d'usuaris**: la col·lecció es guarda al navegador.
- **Pensada per a ordinador** (desktop). Mòbil no prioritari.
- **Interfície multilingüe:** català, castellà i anglès, seleccionable per
  l'usuari. Els noms de les cartes sempre en anglès (són les cartes reals).

## Dades de les cartes

- Font: una **API gratuïta de Pokémon TCG** (candidata principal:
  pokemontcg.io, que inclou imatges i preus de Cardmarket per carta;
  la tria definitiva es confirma a la Fase 1). **Res d'scrapers ni llistes
  fetes a mà**: la lliçó principal del projecte tcg.
- **Identificador estable de carta:** codi d'expansió + número
  (p. ex. `sv6pt5-23`). Mai el nom de la carta com a clau.
- Les cartes es mostren ordenades **pel número de col·lecció** (001/064,
  002/064...), que és l'ordre natural dels àlbums de Pokémon.
- Imatges: les URL que dona la mateixa API (miniatura a les llistes, imatge
  gran en fer zoom).

## La col·lecció

- Cada carta té **comptadors independents per variant**: normal,
  **reverse holo** i holo (segons les variants que existeixin de la carta).
  Model heretat dels comptadors normal/foil del projecte tcg, ampliat.
- Es compten **quantitats** (còpies), no només tinc/no tinc, amb botons
  **+ / −** directament sobre cada carta.
- La col·lecció es desa **a l'instant al navegador** (`localStorage`), sense
  comptes. El codi separa l'**estat** (mòdul de dades) de la **interfície**
  (patró del projecte tcg que funciona bé).
- **Exportar / importar** la col·lecció com a fitxer JSON de còpia de
  seguretat, i botó de reset amb confirmació.

## Preus, valor i compleció

- Font de preus: **Cardmarket** (euros), via l'API de dades. Si és viable,
  comparar també amb **CardTrader** (es valora a la Fase 1).
- Es assumeix estat **Near Mint** i cartes **en anglès**.
- **Memòria cau de dades i preus versionada:**
  - Les dades s'actualitzen amb un **botó d'actualitzar** a la mateixa web.
  - Cada actualització crea una **versió nova amb la seva data** — mai se
    sobreescriu res.
  - Sempre es pot **consultar qualsevol versió guardada** (això, de regal,
    permet veure l'evolució dels preus en el temps).
  - La web mostra sempre la data de la versió de preus que s'està veient.
- **Valor de la col·lecció:** suma del preu de cada carta que tens, comptant
  totes les còpies i variants.
- **Cost de completar:** **suma simple** dels preus de les cartes que falten.
  (L'optimitzador de venedors del projecte tcg queda com a idea de futur.)
- **Objectiu de compleció triable per interfície:** l'usuari pot triar què
  vol dir "completar" —
  - set base (les 64 numerades),
  - set complet (les 99 amb secretes),
  - i si les variants reverse holo compten o no.

## Interfície i estètica

Es manté la línia estètica del projecte tcg mentre sigui compatible:

- **Tema fosc** amb un color d'accent i pastilles de color per categoritzar
  (aquí, els tipus d'energia de Pokémon).
- **Cercador gran i immediat** a dalt, amb filtres desplegables a sota.
- Les cartes que **no tens es veuen apagades/grisoses**; s'encenen quan les
  tens. L'estat de la col·lecció s'ha de veure d'un cop d'ull.
- **Vista d'àlbum realista**: dues pàgines obertes, amb butxaques de
  **3×3 = 9 cartes** (estàndard Pokémon; no 4×3 com a Sorcery).
- **Panell d'estadístiques plegable** amb barres de progrés i les dues xifres
  estrella: *"la teva col·lecció val X €"* i *"completar-la costaria Y €"*.

## Evolució prevista (després de la v1)

1. Segona expansió, i que afegir-ne més sigui trivial.
2. Registre d'usuaris perquè cadascú guardi la seva col·lecció.
3. Publicació amb domini totalment gratuït.
4. Idees de futur: optimitzador de compra per venedors, comparador
   Cardmarket/CardTrader.

## Calendari

- **Final de setembre de 2026:** ha d'estar tot fet **excepte** la part
  pràctica escrita i les conclusions del treball.
- **Objectiu ambiciós:** intentar tenir-ho **tot** (web + treball complet)
  per a final de setembre.
- El detall per fases és a `planificacio.md`.
