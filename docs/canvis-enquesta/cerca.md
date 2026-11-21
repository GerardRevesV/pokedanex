# Canvis de l'enquesta: el cercador

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`).

## Entrada del diari

**Què s'ha fet:**
- El cercador de cartes i el d'expansions ara busquen **per proximitat**:
  troben el que busques encara que hi hagi errors d'escriptura, lletres
  que falten o sobren, accents o majúscules diferents («picachu» →
  Pikachu, «charizar» → Charizard, «shrouded fabel» → Shrouded Fable).
  Els resultats exactes i els que comencen igual surten primer; el número
  de carta es continua buscant exacte.
- Sota la graella apareix una secció nova, **«A altres expansions»**, amb
  les cartes que coincideixen amb la cerca a les altres expansions. Un clic
  a una d'aquestes cartes obre la seva expansió i hi porta directament.
  Respon a les dues persones de l'enquesta que buscaven el Pikachu sense
  saber de quina expansió era.

**Eines usades:** Claude Code (una sessió dedicada al cercador, dins del
treball en paral·lel de les millores de l'enquesta).

**Costos:** 0 € (de subscripció a part).

**Problemes:** cap de greu. Calia evitar que paraules curtes ho trobessin
tot (vegeu la decisió) i que la web no es fes més pesada en obrir-la.

## Entrades de l'històric

### Cerca per proximitat

El cercador abans només trobava una carta si s'escrivia un tros del nom
exactament igual. Ara hi ha un fitxer nou, `app/js/cerca.js`, que compara
els noms d'una manera més tolerant: passa tot a minúscules, treu els accents
i compta quantes lletres caldria canviar, afegir, treure o intercanviar per
passar del que s'ha escrit al nom de la carta. Si són poques, la carta surt.
Les coincidències exactes van primer, després les que comencen igual, les
que contenen el text i, al final, les que només s'hi assemblen. El mateix
fitxer serveix per al cercador d'expansions.

### Cerca a totes les expansions

Fins ara el cercador només mirava dins l'expansió oberta. Ara, quan
s'escriu una cerca de 3 lletres o més, la web mira també totes les altres
expansions i les mostra en una franja «A altres expansions» sota la graella,
amb el nom de l'expansió de cada carta. En clicar-ne una, la web canvia a
aquella expansió i fa lliscar la pàgina fins a la carta, que queda
ressaltada un moment. Les dades de les altres expansions no es baixen en
obrir la web, sinó la primera vegada que es fa una cerca.

## Decisió

### Com es tolera un error d'escriptura sense trobar-ho tot

Per saber si una paraula «s'assembla» a una altra, es fa servir la
**distància d'edició**: el nombre mínim de lletres que cal canviar, afegir,
treure o intercanviar per passar d'una a l'altra. «fabel» i «fable» estan a
distància 1 (s'intercanvien dues lletres). El problema és que amb paraules
curtes gairebé tot s'assembla: «mew» està a una lletra de «dew» o de «hex».
Per això el nombre d'errors permesos creix amb la llargada del que
s'escriu: cap error fins a 3 lletres, un fins a 6, dos fins a 9 i tres a
partir de 10. A més, les cartes es mostren ordenades de la coincidència més
segura a la menys segura, perquè una semblança dubtosa (com «Pichu» quan es
busca «picachu») no passi davant de la carta bona.

S'ha descartat fer servir una llibreria externa de cerca: hauria afegit
dependències per a una funció que cap en un fitxer de 150 línies, i el
projecte prefereix entendre el que fa.

### On es busca la carta quan no saps l'expansió

Hi havia dues opcions: preparar un fitxer petit amb només els noms de totes
les cartes (un «índex»), o baixar les dades de les altres expansions quan
l'usuari busca. S'ha triat la segona perquè no obliga a mantenir cap fitxer
nou: quan s'afegeix una expansió, la cerca global la inclou sola. El preu és
que la primera cerca baixa unes dades que, comprimides, pesen al voltant
d'1 MB amb 22 expansions; només passa una vegada per visita i mai en obrir
la pàgina. Si algun dia les expansions fossin moltes més, caldria passar a
l'índex.

## Repte

### Fer que l'ordinador entengui «picachu»

Per a una persona és evident que qui escriu «picachu» busca el Pikachu, però
un ordinador compara lletra per lletra i, si una no coincideix, diu que no
hi és. Fer que la cerca toleri errors va obligar a explicar-li a la màquina
què vol dir «s'assembla»: comptar quantes lletres caldria tocar per passar
d'una paraula a l'altra. El més difícil no va ser aquest càlcul sinó trobar
el punt just. Si es permeten massa errors, buscar «mew» treu cartes que no hi
tenen res a veure; si se'n permeten massa pocs, «charizar» no troba el
Charizard. La solució va ser fer que la tolerància depengui de la llargada
del que s'escriu, i provar-la amb els 1.289 noms de cartes diferents que té
la web fins que els exemples de l'enquesta funcionessin sense que apareguessin
resultats estranys.
