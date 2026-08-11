---
name: afegir-expansio
description: Manual pas a pas per afegir una expansió (set/edició) nova de cartes Pokémon a la web Pokedanex. Usa-la sempre que es demani afegir, incorporar o donar d'alta una expansió nova.
---

# Afegir una expansió nova a Pokedanex

Aquesta skill és autosuficient: seguint-la de dalt a baix, l'expansió queda
baixada, registrada, amb tema visual propi, verificada i documentada.
Totes les rutes són relatives a l'arrel del repositori (`C:\repos\Pokedanex`)
i totes les ordres s'executen des d'aquesta arrel.

**Fitxers que aquesta feina pot tocar (i cap altre):**
- `app/data/` (sets.json i versions/ — els escriu l'script, no a mà)
- `app/js/temes.js` (el tema visual del set nou)
- `docs/historic.md` i `docs/diari.md` (documentació)
- `tools/fetch_data.py` — **només** el diccionari `IMATGES_ALTERNATIVES`
  (per a sets sense art oficial; vegeu el pas 2b)

La skill val igual per a **una** expansió que per a **moltes de cop**; als
passos hi ha les indicacions extres per al cas múltiple.

---

## Pas 0 — Branca de treball

Comprova la branca activa amb `git status`. Si ets a `main`, crea una branca
nova abans de tocar res (el projecte exigeix branca pròpia + pull request per
a canvis nous). **No facis commit ni push** si l'usuari no ho demana.

**Anota la sortida de `git status` abans de començar**: la branca pot dur ja
canvis d'altres feines sense commit, i el checklist del pas 6 compara contra
aquest estat inicial per saber quins canvis són teus.

## Pas 1 — Identificar el set

Cal l'**id oficial** del set a l'API pokemontcg.io (ex.: `sv6pt5`, `sv8pt5`).
Si no se sap, cerca'l per nom a l'API. **Atenció:** l'API bloqueja el
User-Agent per defecte de Python (403 comprovat); per coherència s'envia
sempre un User-Agent propi també amb curl.

```
curl -sG -w "\n%{http_code}" -H "User-Agent: Pokedanex/1.0" --data-urlencode "q=name:\"NOM DEL SET\"" https://api.pokemontcg.io/v2/sets
```

(El `--data-urlencode` codifica sol el nom — espais i cometes inclosos —,
que si no curl rebutja la URL per malformada. El nom va en anglès, que és
com apareix a l'API. L'ordre és per a `curl` real — a PowerShell escriu
`curl.exe`, perquè `curl` a seques pot ser un àlies d'`Invoke-WebRequest`.)

El `-w "\n%{http_code}"` fa que el codi HTTP surti sempre a l'última línia:
sense això, un error 5xx sense cos de resposta deixaria la sortida totalment
buida i no es veuria enlloc què ha passat.

**Si la resposta surt buida (o amb un error) i el codi és 5xx** (500/502),
no és culpa del User-Agent ni del nom: l'API és inestable (la mateixa que es
descriu al pas 2); reintenta al cap d'uns segons.

De la resposta interessa, per a cada candidat:
`id`, `name`, `series`, `total` (nombre de cartes, secretes incloses) i
`releaseDate`.

**Si hi ha més d'un candidat o cap coincidència exacta** (passa sovint: sets
amb noms semblants, reedicions, promos), NO triïs tu: mostra a l'usuari els
candidats amb id, nom, sèrie, data i total de cartes, i demana-li quin és.

**Per trobar "totes les expansions des de X" (cas múltiple):** la cerca per
rang de dates (`q=releaseDate:[2024/08/02 TO *]`) torna **HTTP 400**
(comprovat) — no la facis servir. Baixa la llista completa de sets (són
menys de 200: `pageSize=250` i el `select` de sota per no inflar la
resposta) i filtra per `releaseDate` localment amb Python:

```
curl -sG -w "\n%{http_code}" -H "User-Agent: Pokedanex/1.0" --data-urlencode "orderBy=releaseDate" --data-urlencode "select=id,name,series,printedTotal,total,releaseDate,ptcgoCode" --data-urlencode "pageSize=250" https://api.pokemontcg.io/v2/sets
```

Detalls que ja han sortit de veritat i no t'han de sorprendre:
- Hi ha ids atípics: `zsv10pt5` (Black Bolt) i `rsv10pt5` (White Flare),
  dos sets germans publicats el mateix dia.
- Les sèries canvien (després de "Scarlet & Violet" ve "Mega Evolution",
  amb ids `me1`, `me2`, `me2pt5`...): el selector de la web agrupa per
  `series` automàticament i **no cal tocar cap codi** perquè aparegui el
  grup nou.

Comprova també que el set no sigui ja a `app/data/sets.json`. **Si ja hi és**,
només cal actualitzar-ne les dades: executa el pas 2 amb la seva verificació,
salta el pas 3 si el set ja té entrada a `TEMES`, fes la comprovació ràpida
del pas 4 (recompte i zero errors) i documenta l'actualització al pas 5.

## Pas 2 — Baixar i registrar les dades

Des de l'arrel del repositori:

```
python tools\fetch_data.py <setId>
```

Què fa exactament l'script (no cal fer res més a mà):
1. Llegeix la clau de l'API de `config.json` (arrel del repo, fora de git).
   Si no hi és, continua sense clau amb límits més estrictes — no és un error.
2. Baixa la informació del set i totes les cartes, pàgina a pàgina, retallades
   als camps que la web usa.
3. Escriu una **versió datada** nova a
   `app/data/versions/<setId>/AAAA-MM-DD HH-MM-SS.json` (mai sobreescriu res).
4. Actualitza (o crea) l'índex del set: `app/data/versions/<setId>/index.json`.
5. Dona d'alta o actualitza el set al registre `app/data/sets.json`
   (ordenat per data de sortida, del més antic al més nou).

**Cas múltiple (diversos sets de cop):** llança'ls en **cua seqüencial**
(mai en paral·lel: l'API ja va prou justa) dins d'una sola ordre en segon
pla, guardant un registre amb l'exit code de cadascun:

```
for id in sv7 sv8 ...; do echo "=== $id ==="; python tools/fetch_data.py "$id"; echo "--- exit $id: $? ---"; done
```

En acabar, repassa els exit codes: els que hagin fallat (esgotats els 6
reintents per 502 en cadena), torna'ls a llançar **al cap d'uns minuts** —
comprovat que a la segona sol anar a la primera. Mentre la cua corre pots
avançar feina dels passos 2b i 3 (logotips i temes).

**Avisos coneguts:**
- L'API falla sovint amb errors 502: l'script ja porta reintents amb espera
  creixent (fins a 6 intents). Si veus missatges de reintent, és normal;
  només cal preocupar-se si esgota els 6 intents.
- Si l'script acaba amb un **error 404**, l'id del set no existeix: torna al
  pas 1 i verifica l'id amb la cerca per nom abans de reintentar res.
- Amb sets grans (200+ cartes) pot trigar uns quants minuts.
- **Recuperació:** davant de qualsevol fallada o interrupció (6 intents
  esgotats, tall a mitges), és segur tornar a executar l'script més tard —
  mai sobreescriu res i el selector agafa sempre la versió més nova. Si
  l'API continua caiguda, informa l'usuari i no continuïs amb els passos
  següents.

**Verificació del pas (obligatòria):**
- Existeix el fitxer de versió nou a `app/data/versions/<setId>/` i el seu
  `index.json` el llista a la primera posició.
- El set apareix a `app/data/sets.json` amb `id`, `name`, `total` i `images`.
- Els JSON són vàlids i el recompte quadra amb el `total` del set:

```
python -c "import json; d=json.load(open(r'app/data/versions/<setId>/index.json',encoding='utf-8')); v=d['versions'][0]; c=json.load(open(r'app/data/'+v['file'],encoding='utf-8')); print('cartes:',len(c['cards']),'| total del set:',c['set']['total'],'| index diu:',v['cardCount'])"
```

Els tres nombres han de coincidir. Si no, torna a executar l'script (la
versió incompleta no fa nosa: el selector sempre agafa la més nova).

## Pas 2b — Sets sense art oficial (comprovació obligatòria per a sets recents)

Els sets més nous poden **no tenir encara logo ni symbol** a
images.pokemontcg.io: el CDN **no torna cap error**, sinó que serveix una
imatge genèrica (el revers de carta Pokémon, 640×892) **idèntica per a tots
els sets afectats** — al Compendi es veurien tots iguals i indistingibles.

**Com detectar-ho:** baixa els logotips dels sets nous a una carpeta
temporal i compara'n les sumes MD5; si dos o més sets comparteixen suma,
són el revers genèric (comprova també el `symbol.png`, que sol estar igual).

**Com resoldre-ho (via alternativa comprovada):** TCGdex, una font oberta i
gratuïta, sol tenir l'art abans. Troba l'id TCGdex del set (atenció, no
coincideix amb el de pokemontcg.io: `me2pt5` hi és `me02.5`):

```
curl -s https://api.tcgdex.net/v2/en/series/me
```

i comprova que `https://assets.tcgdex.net/en/<serie>/<idTcgdex>/logo.png` i
`https://assets.tcgdex.net/univ/<serie>/<idTcgdex>/symbol.png` responen 200
(cal afegir `.png` a les URL que dona l'API). Després afegeix el set al
diccionari `IMATGES_ALTERNATIVES` de `tools/fetch_data.py` (hi ha entrades
de mostra) i **torna a executar** `python tools\fetch_data.py <setId>`
perquè el registre i la versió agafin les imatges bones. L'script avisa amb
"es fan servir les imatges de TCGdex" quan aplica la substitució. Quan
pokemontcg.io publiqui l'art oficial, només cal esborrar l'entrada del
diccionari i tornar a baixar el set.

**Ordre important en el cas múltiple:** si detectes sets sense art, edita
`IMATGES_ALTERNATIVES` **abans** de llançar la cua de baixades (o abans que
hi arribi): un set baixat abans de l'entrada al diccionari s'ha de tornar a
baixar sencer (comprovat amb un set de 295 cartes — es pot evitar).

## Pas 3 — Assignar el tema visual a `app/js/temes.js`

Cada expansió pot tenir el seu color d'accent. Afegeix una entrada nova a
l'objecte `TEMES` de `app/js/temes.js`. L'entrada `sv6pt5` existent és el
model per a l'**estructura de claus** (accent/accentText/resplendor); el
comentari amb els valors de contrast és un afegit nou que aquesta plantilla
introdueix (l'entrada antiga no el porta):

```js
  // <Nom del set>: <per què aquest color, en una línia>
  // Contrast WCAG: X,XX:1 sobre #0e1116 · X,XX:1 sobre #151a22 · X,XX:1 sobre #171d27;
  // accentText X,XX:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  <setId>: {
    accent: "#______",
    accentText: "#______",
    resplendor: "rgba(R, G, B, 0.25)",
  },
```

**Com triar l'accent:** segons la identitat visual del set. Baixa el `logo`
(i el `symbol`) de l'entrada del set a `app/data/sets.json` a una carpeta
temporal i llegeix-los com a imatge (o extreu-ne el color dominant amb un
petit script de Python); tria el color dominant (mascota de portada,
logotip) i ajusta'n la lluminositat fins a passar el contrast d'aquí sota.
El `resplendor` és el mateix color de l'accent en `rgba(...)` amb alfa `0.25`.

**Cas múltiple:** mira igualment cada logotip (el criteri final és la
identitat del set), però industrialitza els càlculs amb un script de Python
únic per a tots els sets: extreu les franges de to dominants de cada logotip
(PIL: redimensiona, descarta píxels transparents, quasi blancs/negres o poc
saturats, i agrupa per franges de 30° de to), proposa un accent per set i
**apuja'n la lluminositat en bucle** fins que passi el 4,5:1 sobre els tres
fons; el text fosc, a la inversa. Així surten d'una tacada els valors i els
contrastos per als comentaris. Amb molts sets, vigila també que dos sets
veïns no acabin amb accents gairebé iguals (varia to o lluminositat).

**Verificació OBLIGATÒRIA de contrast (WCAG AA, mínim 4,5:1).** L'accent es
fa servir com a color de text petit sobre els **tres fons foscos** de la web,
definits a `app/css/style.css`:

| Variable | Color | Ús |
|---|---|---|
| `--fons` | `#0e1116` | fons general de la pàgina |
| `--fons-suau` | `#151a22` | fons de controls |
| `--fons-carta` | `#171d27` | fons de cada carta |

Cal comprovar **per càlcul** (no a ull) que:
- `accent` dona **≥ 4,5:1** sobre cadascun dels tres fons, i
- `accentText` dona **≥ 4,5:1** sobre `accent` (és el text dels botons plens).

Càlcul ràpid amb la fórmula de luminància WCAG (canvia ACCENT i ACCENTTEXT):

```
python -c "
def L(h):
    r,g,b=(int(h[i:i+2],16)/255 for i in (1,3,5))
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def ratio(a,b):
    x,y=sorted((L(a),L(b)),reverse=True); return (x+0.05)/(y+0.05)
acc='#ACCENT'; txt='#ACCENTTEXT'
for fons in ('#0e1116','#151a22','#171d27'): print(fons, round(ratio(acc,fons),2))
print('accentText sobre accent:', round(ratio(txt,acc),2))
"
```

Si algun valor queda per sota de 4,5, aclareix (o enfosqueix, per a
`accentText`) el color i torna a calcular fins que tots passin. Deixa els
valors finals al **comentari** de l'entrada (com al model de dalt): és la
prova documentada que el tema compleix.

## Pas 4 — Verificar el resultat a la web

Si tens eines de navegador, fes aquestes comprovacions tu mateix (obre la
pàgina, llegeix-ne la consola); si no, demana a l'usuari que les faci i
espera'n la confirmació abans de passar al pas 5.

1. Sintaxi: `node --check app\js\temes.js` (no ha de dir res). Si no hi ha
   `node`, salta-ho: un error de sintaxi sortiria igualment com a error de
   mòdul a la consola del punt 6.
2. Servidor local des de l'arrel: `python -m http.server 8000` i obrir
   `http://localhost:8000/app/`.
3. Al selector d'expansions (clic al logotip de la capçalera, o Ctrl+K):
   el set nou hi apareix, amb el seu **símbol**, la data i el filet del
   color nou.
4. Canvia a l'expansió nova: la graella mostra les cartes, el peu diu el
   **recompte correcte** (= total del set) i, si l'interruptor "tema segons
   l'expansió" del panell és actiu, l'accent de tota la web passa al color
   nou en una transició suau.
5. Torna al set anterior: tot torna a lloc (cartes, recompte i tema).
6. Consola del navegador: **zero errors** durant tot el procés.

Si algun punt falla, no continuïs: arregla-ho abans de documentar.

**Notes per al cas múltiple (comprovades amb 14 expansions):**
- El **scroll del panell ja està previst** (`.expansions-llista` té
  `overflow-y: auto` i el diàleg `max-height: min(80vh, 42rem)`): amb
  moltes expansions la llista fa scroll per dins i no cal tocar cap CSS.
  Verifica-ho igualment (que `scrollHeight > clientHeight` de la llista).
- Un **grup de sèrie nou** (p. ex. "Mega Evolution") apareix sol.
- No cal clicar totes les expansions una a una: prova'n **dues o tres de
  representatives** (una de la sèrie nova, una amb imatges alternatives,
  la que hagi hagut de repetir baixada) més la tornada a l'original, i
  valida la resta amb el recompte de fitxers del pas 2 (un bucle de Python
  sobre tots els sets de `sets.json` comprovant cartes = total = índex).
- Si el navegador integrat no pot fer captures ("Browser pane is not
  displayed"), les comprovacions valen igual amb les eines de text:
  `read_page`, consola i `javascript_tool` (llegir `--accent`, comptar
  `article`, mirar `dialog.open`...).

## Pas 5 — Documentar

1. **`docs/historic.md`**: afegeix una entrada nova al final, seguint el
   format del fitxer: `## <número següent>. <Títol>` (numeració correlativa
   — mira quin és l'últim número), a sota `*AAAA-MM-DD*` en cursiva, i un
   paràgraf breu que digui quina expansió s'ha afegit i quin tema de color
   té (i per què aquest color).
2. **`docs/diari.md`**: crea una secció nova
   `## AAAA-MM-DD — <títol de la feina>` (el diari en pot tenir més d'una
   el mateix dia, una per feina) amb els apartats habituals del fitxer:
   **Què s'ha fet / Eines usades / Costos / Problemes**, esmentant
   l'expansió afegida, el seu tema i qualsevol problema sorgit (per exemple,
   reintents de l'API).

## Pas 6 — Checklist final de seguretat

Abans de donar la feina per acabada, comprova-ho tot:

- [ ] La clau de l'API **no** apareix en cap fitxer nou ni modificat
      (només pot viure a `config.json`, que és fora de git). Comprovació
      **sense manipular mai el valor de la clau**: confirma que `git status`
      no toca `config.json`, i cerca als fitxers canviats el nom del camp
      (`pokemontcgApiKey`) i cadenes amb pinta de clau (patró d'UUID) —
      no n'hi ha d'aparèixer cap.
- [ ] Comprova que el **TEU delta** (respecte de l'estat de `git status`
      anotat al pas 0) només toca: `app/data/**`, `app/js/temes.js`,
      `docs/**` i, si has passat pel pas 2b, `tools/fetch_data.py`
      (i en aquest cas, només el diccionari `IMATGES_ALTERNATIVES` i el
      seu ús) — els fitxers que ja eren bruts abans de començar no
      compten. **Si el teu delta toca cap altre fitxer, atura't**: vol dir
      que alguna cosa del projecte ha canviat respecte del que aquesta
      skill assumeix, i cal revisar (i segurament actualitzar) la skill
      abans de continuar.
- [ ] Els passos 2 i 4 han quedat verificats de veritat (fitxers, recomptes,
      contrast, navegador), no només executats.
