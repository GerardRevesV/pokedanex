# Recerca: el projecte "tcg" (Sorcery: Contested Realm)

> Investigació feta el 2026-08-09 sobre el projecte previ de
> `C:\Users\gerar\Downloads\tcg`, que serveix d'**inspiració** per a Pokedanex.
> Norma recordada: aquell projecte **no es modifica mai** — només s'ha llegit.

## Resum en dues frases

El projecte "tcg" és una eina personal per gestionar una col·lecció de cartes
del joc **Sorcery: Contested Realm**: una pàgina web (un sol fitxer HTML) on es
marquen les cartes que es tenen, es veuen preus de 5 botigues i es calcula el
valor de la col·lecció, més un conjunt de scripts Python que recullen preus,
descarreguen imatges i fins i tot optimitzen a quins venedors comprar les
cartes que falten. Tot funciona **en local i gratis** (sense servidor ni base
de dades), cosa molt alineada amb el pressupost de Pokedanex.

> **Aclariment important:** la botiga de cartes usades és **CardNexus**
> (cardnexus.com), no Cardmarket. Sorcery no es ven a Cardmarket; Pokémon sí,
> i per això Pokedanex vol Cardmarket com a font de preus.

---

## 1. Inventari: què hi ha i què fa cada peça

### a) El cor: generador de l'àlbum

| Fitxer | Què fa |
|---|---|
| `build_album_layout.py` (2.252 línies) | El script principal. Llegeix la llista de cartes d'un Excel, demana les dades oficials de cada carta a l'API de Sorcery, ordena les cartes en "ordre d'àlbum", hi enganxa preus i imatges, i genera els CSV de col·locació i la pàgina `album_lookup.html`. |
| `Sorcery_...Checklist.xlsx` (+ còpia `.backup`) | L'Excel font: un full per expansió (Beta, Arthurian Legends, Dragonlord, Gothic), amb seccions per "color" i columnes de quantes còpies es tenen (normal, foil, promo). És la **font de veritat** de la llista de cartes i, al principi, també de la col·lecció. |
| `Beta_layout.csv`, `Gothic_layout.csv`, etc. | Sortida generada: per a cada carta, a quina **pàgina** i **butxaca** de l'àlbum físic va (`page, slot, color, rarity, cost, type, name`). Serveix per col·locar les cartes reals al carpesà. |
| `album_lookup.html` (1,7 MB) | La pàgina web final. És **un sol fitxer autocontingut**: porta les dades de totes les cartes incrustades com a JSON dins del propi HTML. S'obre amb un servidor local senzill (`python -m http.server`). |

### b) Preus: scrapers i memòria cau

| Fitxer | Què fa |
|---|---|
| `scrape_prices.py` | Recull preus de 3 botigues: `sorcerytcg.eu` i `trollsoftherealm.com` (per l'API pública de WooCommerce, la plataforma de la botiga) i `cardnexus.com` (llegint l'HTML de cada carta, ~20 min). Converteix dòlars a euros amb un canvi fix (0,93). |
| `rescrape_eu.py` | Versió millorada de l'scraper de les dues botigues europees: usa les metadades del producte en lloc d'endevinar pel nom. |
| `scrape_rubble.py` | Recull preus de `rubble.dk` (una sola crida que retorna ~1.080 cartes). |
| `prices_cache.json` (1,3 MB) | La memòria cau de preus: per cada carta (`Edició|nom normalitzat`) guarda, per botiga, el preu **normal** i el preu **foil**, si està en estoc, i la data de la recollida (`fetched_at`). |
| `refresh_prices.bat` | El "botó" per a l'usuari: un fitxer que, amb doble clic, actualitza totes les botigues en ordre i regenera l'HTML. Escriu la cau de manera incremental, així si es talla a mitges no es perd res. |
| `fuzzy_price_matches.txt` | Registre dels noms de carta que no coincidien exactament entre botigues i s'han aparellat per semblança (p. ex. errates com "Malachai"/"Malachia"). |

### c) Imatges

| Fitxer | Què fa |
|---|---|
| `download_images.py` | Baixa les imatges oficials de les cartes des del CDN de Sorcery. Guarda la versió gran (PNG) i genera una **miniatura webp de 200 px** (~10 KB) per fer la web lleugera. Es pot tornar a executar sense repetir feina. |
| `images/` + `manifest.json` | Les imatges (grans a `full/`, miniatures a `thumbs/`) i un índex de 1.100 cartes que diu on és cada fitxer. |

### d) La web: marcar cartes i estadístiques

| Fitxer | Què fa |
|---|---|
| `collection.js` | El mòdul d'**estat de la col·lecció**. Guarda al `localStorage` del navegador (memòria local, sense servidor) quantes còpies tens de cada carta, amb **dos comptadors independents per carta: normal i foil**. Té exportar/importar a fitxer JSON i un sistema d'avisos perquè la resta de la interfície es repinti quan canvia alguna cosa. |
| `collection_ui.js` (1.113 línies) | La capa interactiva: botons +/- a cada carta, indicadors visuals de quantes en tens, filtre "només les que em falten", vista d'àlbum (dues pàgines obertes com el carpesà real), mini-àlbum a cada fila, finestra de zoom d'una pàgina, marca de "comprada". |
| `collection_stats.js` (896 línies) | El panell d'estadístiques, amb 5 seccions plegables: resum per expansió, mètriques de compleció, playsets, **valor del que tens** (suma del preu mínim en estoc de cada carta) i **cost del que et falta** (camí més barat per completar). |
| `collection_ui.css`, `collection_stats.css` | Els estils d'aquestes dues capes. |
| `collection.json` | Un fitxer de col·lecció buit d'exemple (l'export real es descarrega des del navegador). |

### e) Optimitzador de compres (venedors de CardNexus)

Un conjunt de scripts fets per resoldre un problema concret: *"em falten ~200
cartes foil; a quins venedors les compro per gastar el mínim, comptant que
cada venedor cobra 7 € d'enviament?"*

| Fitxer | Què fa |
|---|---|
| `find_api.py`, `chunks.txt`, `lr_p1.html`, `zgley_p2.html`, `r.json`, `r2.json`, `resp.json`, `tmp.json` | Material d'enginyeria inversa: pàgines desades i proves per descobrir com llegir l'inventari dels venedors de CardNexus. |
| `find_sellers.py` | Mostreja pàgines de cartes per descobrir quins venedors actius hi ha. |
| `scrape_seller.py` | Baixa tot l'inventari d'un venedor (`seller_<nom>.json` — n'hi ha 14 de desats). |
| `filter_seller.py` | Filtra l'inventari d'un venedor: cartes foil que no tinc i que compleixen els criteris de compra (barates, comunes o d'un il·lustrador concret). |
| `compare_seller.py`, `compare_foil_prices.py`, `refresh_cardnexus_subset.py` | Comparen els preus d'un venedor contra el mínim de les altres botigues, per saber si és bon preu. |
| `multi_seller.py` | Combina tots els venedors i tria el més barat per a cada carta. |
| `optimize_sellers.py` | L'optimització fina: prova de **descartar venedors** un a un — un venedor només cau si les seves cartes es poden recomprar a altres per menys del que s'estalvia en enviament. |
| `build_optimal.py` | Genera l'Excel final de la compra: llista per venedor amb colors, full de resum amb totals i enviaments, i full de cartes perdudes. |
| `sellers_4way/7way/12way/optimal_9way.xlsx` | Els Excels de compra generats en diferents escenaris. |
| `cart_check.py`, `cart_by_seller.csv`, `cart_new.csv` | Comprovacions manuals del carret: duplicats, cartes que ja tens en foil, i línies "no-foil" colades. |
| `gen_foil_lists.py`, `foils_have.csv`, `foils_missing.csv`, `assumed_foils.json`, `beta_ordinary_missing.csv`, `*_rubble_competitive.csv` | Llistes de treball: quines foils tinc / em falten, quines "dono per fet" que tinc, i on rubble.dk era competitiu. |

### f) Altres

- `.claude/launch.json` — arrenca la web amb `python -m http.server 8765`.
- `__pycache__/`, `scrape.log` — residus tècnics sense interès.

---

## 2. Com funciona el flux complet

### Preparar les dades (Python, de tant en tant)

1. **Llista de cartes:** l'Excel diu *quines* cartes existeixen; l'API oficial
   de Sorcery (`api.sorcerytcg.com/api/cards`) hi afegeix les dades de cada
   una (cost, tipus, text, il·lustrador, identificador d'imatge). Els noms es
   "normalitzen" (minúscules, sense accents ni símbols) per poder aparellar
   fonts diferents.
2. **Ordre d'àlbum:** les cartes s'ordenen per color → raresa → cost → tipus →
   nom, i es reparteixen en pàgines de **12 butxaques (4×3)**; cada secció de
   color comença en pàgina nova. Això dona la posició física de cada carta al
   carpesà.
3. **Preus:** cada scraper deixa els seus preus a `prices_cache.json`. Quan un
   nom no coincideix exactament, es busca el més semblant (llindar del 85 %).
4. **Resultat:** `build_album_layout.py` ho ajunta tot i escriu un únic
   `album_lookup.html` amb totes les dades a dins. El `refresh_prices.bat`
   encadena tots aquests passos amb un doble clic.

### Marcar cartes (navegador, cada dia)

5. L'usuari obre la web, cerca una carta i clica **+ / −** per dir quantes en
   té. Hi ha dos "modes": col·lecció **normal** i col·lecció **foil**, cada
   una amb el seu comptador. Tot es desa a l'instant al navegador
   (`localStorage`) — sense comptes ni servidor — i es pot exportar/importar
   com a fitxer JSON de còpia de seguretat.
6. Cada carta mostra el seu estat visualment: les que no tens es veuen
   apagades i en gris, i s'encenen a mesura que t'acostes al "playset" (el
   nombre de còpies objectiu, que a Sorcery depèn de la raresa: 1, 2, 3 o 4).

### Calcular valor i cost de completar

7. El panell d'estadístiques suma, carta a carta, **el preu mínim en estoc**
   entre les 5 botigues: el que *tens* dona el valor de la col·lecció, i el
   que *et falta* dona el cost de completar-la (amb opcions: comptar només
   1 còpia, filtrar per raresa/color, usar preus fora d'estoc com a reserva,
   preferir preus foil...). Els preus fora d'estoc es mostren amb un asterisc.

### Optimitzar la compra (scripts a part, puntual)

8. Es baixa l'inventari de cada venedor de CardNexus, es filtra a les cartes
   que falten, es tria el venedor més barat per carta i després es descarten
   venedors mentre l'estalvi d'enviament (7 €/venedor) compensi. El resultat
   és un Excel de compra ordenat per venedor.

---

## 3. Coses que NO serveixen per a Pokémon (específiques de Sorcery)

- **El sistema de "colors"/elements** (Sites, Avatars, Air, Fire, Earth,
  Water...) com a criteri d'ordenació. Pokémon té tipus, però els àlbums
  s'ordenen pel **número de col·lecció** de la carta, no per tipus.
- **Les rareses de Sorcery** (Ordinary/Exceptional/Elite/Unique) i els
  **llindars de playset per raresa** (4/3/2/1 còpies). A Pokémon el
  col·leccionista busca normalment **1 còpia de cada carta**, no 4.
- **L'ordre complex color → raresa → cost → tipus → nom.** A Pokémon
  l'ordenació natural és pel número de carta (001/064, 002/064...), molt més
  senzilla.
- **Les fonts de dades:** l'API de Sorcery, el seu CDN d'imatges i l'Excel
  checklist. Pokémon té les seves pròpies fonts (vegeu el punt 4).
- **Les 5 botigues concretes** (sorcerytcg.eu, trollsoftherealm.com,
  cardnexus.com, rubble.dk, tcgplayer.com) i tots els scrapers fets a mida
  per a elles, incloent-hi el parseig de noms amb lletres gregues (β, γ...).
- **Tot el material de venedors** (seller_*.json, Excels de compra, carrets):
  són dades personals d'una compra concreta, no una funcionalitat reutilitzable
  tal qual.
- **Camps de carta de Sorcery** (cost de manà, atac/defensa/vida, llindars
  d'elements) mostrats a la fitxa.

## 4. Coses que Pokémon necessita i el projecte tcg NO té

- **Variants reverse holo (i holo):** a Sorcery només hi ha normal/foil, i el
  projecte ho resol amb dos comptadors per carta. A Pokémon una mateixa carta
  comuna existeix en **normal i reverse holo** (i algunes en holo), amb preus
  diferents. Caldrà decidir com es modela (l'esborrany d'especificacions ja
  ho té com a pendent). La idea dels "comptadors paral·lels per carta" del
  `collection.js` és un bon punt de partida, ampliant-la a 3 variants.
- **Una API de dades de Pokémon TCG:** el tcg depèn d'un Excel fet a mà + API
  de Sorcery. Per a Pokémon existeixen APIs gratuïtes amb totes les cartes,
  imatges **i preus**: per exemple **pokemontcg.io** (inclou preus de
  **Cardmarket** i TCGplayer a cada carta) o **TCGdex**. Això pot estalviar
  tots els scrapers. La decisió concreta es prendrà a la Fase 1.
- **Numeració i símbols d'expansió:** número de col·lecció (p. ex. 23/64),
  cartes secretes (número per sobre del total), símbol i logotip del set.
- **Preus en funció d'idioma i estat de la carta** (Near Mint, Played...): a
  Cardmarket el preu varia per idioma i estat; el tcg ho ignora del tot.
- **Àlbum de 9 butxaques:** els àlbums de Pokémon estàndard són pàgines de
  **3×3 = 9** cartes, no de 4×3 = 12 com el carpesà de Sorcery. La vista
  d'àlbum s'ha d'adaptar.
- **Interfície en català:** el tcg és tot en anglès.
- **Previsió de multiexpansió i comptes d'usuari:** el tcg és una eina
  personal d'una sola persona; Pokedanex vol arribar a tenir registre
  d'usuaris i publicació a Internet (fases posteriors).

## 5. Decisions estètiques i d'UX que val la pena mantenir

- **Tema fosc elegant** amb un color d'accent (verd-turquesa) i **pastilles de
  color** per categoritzar (allà colors de Sorcery; aquí podrien ser els tipus
  d'energia de Pokémon).
- **Cercador gran i immediat** a dalt de tot, amb el text trobat ressaltat, i
  una graella de **filtres desplegables** a sota.
- **Estat de la col·lecció visible d'un cop d'ull:** les cartes que no tens es
  veuen **apagades/grisoses** i les que tens, a tot color. És intuïtiu i molt
  satisfactori de veure omplir-se.
- **Botons + / − amb comptador** directament sobre cada carta: marcar una
  carta costa un sol clic, sense formularis.
- **Vista d'àlbum "com el real":** dues pàgines obertes amb la graella de
  butxaques, per veure exactament com queda el carpesà (adaptant-la a 3×3).
- **Miniatures lleugeres** (webp ~10 KB) per a les llistes i imatge gran
  només en fer zoom: la pàgina vola tot i tenir centenars de cartes.
- **Panell d'estadístiques plegable** amb barres de progrés i les dues xifres
  estrella: *"la teva col·lecció val X €"* i *"completar-la costaria Y €"*.
- **Preus honestos:** mostrar la data de l'última actualització de preus i
  marcar amb un asterisc els preus de productes fora d'estoc.
- **Exportar/Importar la col·lecció en JSON** com a còpia de seguretat, i botó
  de Reset amb confirmació.

## 6. Recomanacions: què reutilitzar com a idea

1. **El patró "estat + interfície separats"** (`collection.js` vs
   `collection_ui.js`): un mòdul petit i net que guarda la col·lecció a
   `localStorage` i avisa la interfície quan canvia. És exactament el que la
   v1 de Pokedanex necessita (local, sense comptes). *Reutilitzar la idea,
   no el codi* — el nostre model de dades tindrà variants diferents.
2. **Comptadors per variant dins de cada carta** (`{owned, foil}` →
   `{normal, reverse, holo}`), amb la regla "la carta s'esborra del registre
   només quan tots els comptadors són zero".
3. **Identificador estable de carta:** allà és `Edició::Nom`; a Pokémon tenim
   una cosa millor: **codi d'expansió + número de carta** (p. ex.
   `sv6pt5-23`), que evita tot el problema de noms que no coincideixen i el
   matching difús. Els scrapers i el fuzzy matching del tcg són justament la
   lliçó de *què passa quan no tens identificadors bons*.
4. **Memòria cau de preus en JSON amb data** (`fetched_at`): separar "obtenir
   preus" (de tant en tant) de "mostrar la web" (sempre). A Pokedanex, la
   font seria l'API de Pokémon TCG en lloc de scrapers.
5. **Web autocontinguda per a la v1:** el truc de generar/servir una pàgina
   estàtica sense servidor de veritat encaixa amb "funciona en local" i
   pressupost zero. (No cal arribar a l'extrem d'incrustar-ho tot en un sol
   HTML de 1,7 MB; amb un JSON de dades al costat n'hi ha prou.)
6. **Les dues mètriques de valor** (valor del que tens / cost de completar)
   amb el criteri "preu mínim disponible", i les opcions de filtre del panell
   d'estadístiques.
7. **Miniatures + imatge gran sota demanda**, si acabem servint imatges
   pròpies (les APIs de Pokémon ja donen les imatges per URL, potser ni cal).
8. **L'optimitzador de venedors, només com a idea de futur:** és la
   funcionalitat més enginyosa del tcg ("on compro el que em falta gastant el
   mínim"), però queda fora de l'abast de la v1 de Pokedanex. L'apuntem com a
   possible evolució.
9. **Què NO imitar:** dependre d'un Excel fet a mà com a font de veritat,
   scrapers fràgils fets a mida per a cada botiga, i deixar fitxers de proves
   i dades personals barrejats amb el codi. Pokedanex ho farà amb una API de
   dades i el repositori net.

---

*Document generat a partir de la lectura completa del projecte tcg
(scripts Python, mòduls JavaScript, CSV, JSON i HTML generats). Cap fitxer
del projecte original no s'ha modificat.*
