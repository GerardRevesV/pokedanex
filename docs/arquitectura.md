# Arquitectura de Pokedanex

> Com està construïda la web per dins, explicat peça a peça.
> (Escrit el 2026-08-09, després de l'esquelet de la Fase 1.)

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
├── tools/
│   └── fetch_data.py    ← baixa les dades de l'API i crea versions de fitxer
├── app/                 ← LA WEB (tot el que hi ha aquí es publicarà)
│   ├── index.html       ← l'estructura de la pàgina
│   ├── css/style.css    ← l'aspecte (tema fosc, graella de cartes)
│   ├── js/
│   │   ├── i18n.js      ← textos en català, castellà i anglès
│   │   ├── data.js      ← càrrega i actualització de dades (versions)
│   │   └── main.js      ← la interfície: pinta i lliga-ho tot
│   └── data/
│       ├── versions.json           ← índex de les versions de fitxer
│       └── versions/2026-08-09.json ← una versió de dades (cartes + preus)
└── docs/ · treball/ · presentacio/  ← documentació i lliurables del treball
```

## Les tres capes de la web

### 1. Dades (`data.js` + `app/data/` + `fetch_data.py`)

Les dades de les cartes (Shrouded Fable: 99 cartes amb imatges i preus de
Cardmarket/TCGplayer) venen de l'API gratuïta **pokemontcg.io**, però la web
**mai** en depèn en viu: sempre llegeix una còpia local — la **cau versionada**.

Hi ha **dos tipus de versions**, i el selector de la web les fusiona:

| Tipus | Qui les crea | On viuen |
|---|---|---|
| De fitxer | `tools/fetch_data.py` (des de l'ordinador) | `app/data/versions/*.json` (es pugen a GitHub) |
| De navegador | el botó **"Actualitza dades"** de la web | `localStorage` del navegador |

Cada actualització crea una **versió nova amb la seva data**; mai no
s'esborra ni se sobreescriu res, i qualsevol versió antiga es pot tornar a
consultar (així es pot veure l'evolució dels preus).

Detalls tècnics rellevants:
- Identificador estable de carta: `id` de l'API (ex. `sv6pt5-33`).
- Les cartes es guarden retallades als camps que la web usa (llista única
  compartida conceptualment entre `fetch_data.py` i `data.js`).
- L'API falla sovint (502): totes les peticions porten **reintents amb
  espera creixent**.
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
- **Cercador:** filtra per nom o número a mesura que s'escriu.
- **Peu:** data de la versió de dades que s'està veient i el nombre de cartes.
- Estètica heretada del projecte tcg: **tema fosc** amb accent verd-turquesa.

## Claus de `localStorage` que fa servir la web

| Clau | Contingut |
|---|---|
| `pokedanex.lang` | Idioma triat (ca / es / en) |
| `pokedanex.dataVersions` | Versions de dades creades des del navegador |

(A la Fase 2 s'hi afegirà la col·lecció de l'usuari.)

## Per què així (resum de decisions)

Vegeu `decisions.md`: web estàtica sense frameworks (D-002), cau local
versionada per no dependre d'una API inestable (D-003), preus de Cardmarket
amb data visible (D-004). Límit conegut i acceptat: `localStorage` ronda els
5 MB — unes 20 versions de navegador; si mai s'omple, la web avisa i la
versió es pot consultar igualment durant la sessió.
