# Arquitectura de Pokedanex

> Com està construïda la web per dins, explicat peça a peça.
> (Escrit el 2026-08-09 després de l'esquelet de la Fase 1;
> actualitzat el 2026-08-11 amb el suport multi-expansió.)

## Vista general

Pokedanex és una **web estàtica**: no hi ha servidor de veritat ni base de
dades. Tot són fitxers (HTML, CSS, JavaScript i JSON) que el navegador
llegeix directament. Per treballar en local s'arrenca un servidor senzill:

```
python -m http.server 8000        (des de l'arrel del repositori)
→ obrir http://localhost:8000/app/
```

## Mapa de fitxers

```
Pokedanex/
├── config.json          ← clau de l'API (NO es puja mai a GitHub)
├── .claude/skills/
│   └── afegir-expansio/ ← el manual (skill) per afegir expansions noves
├── tools/
│   └── fetch_data.py    ← baixa un set de l'API: python tools/fetch_data.py <setId>
├── app/                 ← LA WEB (tot el que hi ha aquí es publicarà)
│   ├── index.html       ← l'estructura de la pàgina
│   ├── css/style.css    ← l'aspecte (tema fosc, graella de cartes)
│   ├── js/
│   │   ├── i18n.js      ← textos en català, castellà i anglès
│   │   ├── data.js      ← càrrega de dades: sets, versions i set actiu
│   │   ├── storage.js   ← accés segur a localStorage (no peta si està bloquejat)
│   │   ├── variants.js  ← quines variants té cada carta i el preu de cadascuna
│   │   ├── collection.js← l'estat de la col·lecció (comptadors per variant)
│   │   ├── album.js     ← la vista d'àlbum 3×3 de dues pàgines
│   │   ├── stats.js     ← el panell de valor, cost i objectiu de compleció
│   │   ├── temes.js     ← el tema visual de cada expansió (i el per defecte)
│   │   ├── selector-expansions.js ← el panell "Compendi" per triar expansió
│   │   ├── cerca.js     ← la cerca per proximitat (tolera errors d'escriptura)
│   │   ├── cerca-global.js ← la secció «A altres expansions» sota la graella
│   │   └── main.js      ← la interfície: pinta i lliga-ho tot
│   └── data/
│       ├── sets.json    ← registre de les expansions disponibles
│       └── versions/
│           ├── sv6pt5/  ← versions datades de Shrouded Fable + index.json
│           └── sv8pt5/  ← versions datades de Prismatic Evolutions + index.json
└── docs/ · treball/ · presentacio/  ← documentació i lliurables del treball
```

## Les tres capes de la web

### 1. Dades (`data.js` + `app/data/` + `fetch_data.py`)

La web és **multi-expansió**: `app/data/sets.json` és el registre de les
expansions disponibles (ara 22: tot el bloc Scarlet & Violet des de la
primera, més les de Mega Evolution), i cada
expansió té la seva carpeta de versions. Les dades de les cartes venen de
l'API gratuïta **pokemontcg.io**, però la web **mai** en depèn en viu:
sempre llegeix una còpia local — la **cau versionada per expansió**.

Hi ha **dos tipus de versions**, i el selector de la web les fusiona:

| Tipus | Qui les crea | On viuen |
|---|---|---|
| De fitxer | `tools/fetch_data.py <setId>` (des de l'ordinador) | `app/data/versions/<setId>/*.json` (es pugen a GitHub) |
| De navegador | el botó **"Actualitza dades"** de la web | `localStorage`, en claus separades per expansió |

L'**expansió activa** es tria amb el selector "el Compendi" (clic al
logotip de la capçalera o Ctrl+K): panell amb cercador, símbol oficial,
data i progrés de compleció de cada set. Cada expansió té el seu **tema
visual** (`temes.js`); el commutador "tema segons l'expansió" del mateix
panell decideix si l'estètica canvia amb el set o es queda el turquesa
Pokedanex. Per afegir una expansió nova hi ha la skill
`.claude/skills/afegir-expansio` (baixar dades, tema amb contrast
verificat, comprovacions i documentació).

Cada actualització crea una **versió nova amb la seva data**; mai no
s'esborra ni se sobreescriu res, i qualsevol versió antiga es pot tornar a
consultar (així es pot veure l'evolució dels preus).

Detalls tècnics rellevants:
- Identificador estable de carta: `id` de l'API (ex. `sv6pt5-33`).
- Les cartes es guarden retallades als camps que la web usa (llista única
  compartida conceptualment entre `fetch_data.py` i `data.js`).
- L'API falla sovint (500/502): totes les peticions porten **reintents amb
  espera creixent**. Al botó "Actualitza" (`data.js`) són 6 intents en
  aproximadament un minut (esperes de 2, 4, 8, 16 i 32 s), cada intent amb
  un temps màxim d'espera; si tot falla, no es desa res, la web es queda amb
  les dades d'abans i el missatge diu el motiu (sense xarxa, temps esgotat,
  massa peticions, servidor caigut o TCGdex caigut).
- A alguns sets (p. ex. `sv1`) TCGdex dona els preus per carta i no per
  variant: el retall els copia a cada variant sense segell, amb el mateix
  format de dades.
- La clau de l'API es llegeix de `config.json` (arrel del repo, exclòs de
  GitHub). La web publicada no tindrà clau i funcionarà igualment amb els
  límits gratuïts.

### 2. Idiomes (`i18n.js`)

Tots els textos de la interfície tenen una clau (ex. `actualitza.boto`) i
tres traduccions: **català** (defecte), **castellà** i **anglès**. El canvi
d'idioma és immediat (sense recarregar) i es recorda a `localStorage`.
Els noms de les cartes no es tradueixen mai: són les cartes reals, en anglès.

### 3. Interfície (`main.js` + `index.html` + `style.css`)

- **Capçalera:** nom, logotip del set, selector d'idioma, cercador,
  selector de versió de dades i botó d'actualitzar.
- **Graella:** les 99 cartes ordenades pel número de col·lecció, amb imatge
  petita (càrrega mandrosa), número tipus àlbum (033/064), nom i raresa.
- **Cercador:** filtra per nom o número a mesura que s'escriu. El nom es
  busca **per proximitat** (`cerca.js`): sense majúscules ni accents i
  tolerant errors d'escriptura («picachu» → Pikachu), amb les
  coincidències exactes i de prefix primer; el número continua sent exacte.
  El cercador d'expansions del Compendi fa servir la mateixa funció.
- **A altres expansions (`cerca-global.js`):** sota la graella, la mateixa
  cerca feta a totes les altres expansions; un clic obre aquella expansió
  amb la carta localitzada. Les dades de les altres expansions es baixen
  només la primera vegada que s'escriu una cerca de 3 lletres o més.
- **Peu:** data de la versió de dades que s'està veient i el nombre de cartes.
- Estètica heretada del projecte tcg: **tema fosc** amb accent verd-turquesa.

## Les capes de la Fase 2

- **Col·lecció (`collection.js` + `variants.js`):** cada carta té comptadors
  independents per variant (normal / reverse holo / holo — les variants que
  té cada carta es dedueixen dels preus de l'API amb reserva per raresa).
  Es desa a l'instant al navegador; exportable/importable en JSON i amb
  buidat amb confirmació. Patró estat/interfície separats heretat del tcg.
- **Marcar (`main.js`):** botons + / − a cada carta de la graella i al
  zoom (un clic), cartes apagades/grisoses quan no en tens cap, filtres
  Totes / Les tinc / Em falten combinables amb el cercador. Un clic (o toc)
  sobre una carta, a la graella o a l'àlbum, l'obre sempre en gran (el zoom);
  no hi ha cap mode que canviï el que fa el clic.
- **Zoom (`main.js`):** imatge gran, comptadors de cada variant, una frase
  que explica què és una reverse holo (si la carta en té) i fletxes ‹ › per
  passar de carta sense tancar-lo (també amb ← → del teclat o lliscant el
  dit sobre la imatge). El recorregut són les cartes que es veien en obrir-lo:
  a la graella, amb els filtres i l'ordre actius; a l'àlbum, en ordre de
  col·lecció (només les ressaltades si hi ha filtres).
- **Àlbum (`album.js`):** vista de carpesà real — dues pàgines obertes de
  3×3 butxaques, navegació amb botons i fletxes de teclat, secretes
  incloses; un clic a una carta l'obre en gran. En passar de graella a
  àlbum (o a l'inrevés) l'altra vista s'obre on és la carta que s'estava
  mirant. La cerca i els filtres
  hi **ressalten** en comptes de filtrar (D-011): cap butxaca no desapareix,
  les cartes que coincideixen porten anell i la barra de coincidències diu
  a quines pàgines són.
- **Estadístiques (`stats.js`):** panell plegable amb barres de progrés,
  "la teva col·lecció val X €" (totes les còpies i variants) i "completar-la
  costaria Y €" (suma simple del que falta), amb **objectiu de compleció
  triable** (set base / complet, amb o sense reverses). Sota el valor diu
  d'on surten els preus (Cardmarket i TCGplayer via TCGdex i pokemontcg.io),
  de quin dia són i que són aproximats, amb un desplegable «Com es
  calculen?» que resumeix la regla de D-013.
- **`storage.js`:** tots els accessos a `localStorage` passen per aquí,
  perquè la web funcioni encara que el navegador el bloquegi.

## Claus de `localStorage` que fa servir la web

| Clau | Contingut |
|---|---|
| `pokedanex.lang` | Idioma triat (ca / es / en) |
| `pokedanex.dataVersions:<setId>` | Versions de navegador, per expansió |
| `pokedanex.collection` | La col·lecció: comptadors per carta i variant (global, tots els sets) |
| `pokedanex.view` | Vista activa (graella / àlbum) |
| `pokedanex.statsOpen` | Si el panell d'estadístiques és obert o plegat |
| `pokedanex.completionTarget` | L'objectiu de compleció triat |
| `pokedanex.displayMode` | «Cartes que no tinc»: apagades (`colleccio`) o en color (`cataleg`) |
| `pokedanex.activeSet` | L'expansió activa |
| `pokedanex.temaPerSet` | Si l'estètica segueix l'expansió o no |

## Per què així (resum de decisions)

Vegeu `decisions.md`: web estàtica sense frameworks (D-002), cau local
versionada per no dependre d'una API inestable (D-003), preus de Cardmarket
amb data visible (D-004). Límit conegut i acceptat: `localStorage` ronda els
5 MB — unes 20 versions de navegador; si mai s'omple, la web avisa i la
versió es pot consultar igualment durant la sessió.
