# Estudi d'usabilitat: què fa cada control de Pokedanex i què s'entén

*3 de novembre del 2026*

## Per què aquest estudi

Pokedanex ha crescut funcionalitat a funcionalitat: primer la graella de
cartes, després els filtres, després el marcatge per variants, l'àlbum, les
estadístiques, el selector d'expansions, els modes de visualització. Cada
peça es va demanar per separat, es va generar per separat i es va comprovar
per separat. La pregunta que no s'havia fet mai és la que importa ara:
**totes aquestes peces, juntes, s'entenen?**

La sospita que ha originat l'estudi la va formular l'autora en una frase:
«hi ha filtres com raresa, tipus o energia que no s'apliquen». La sospita
era correcta, i l'estudi n'ha trobat la causa exacta i vuit problemes més.

El mètode té tres parts: un **inventari** de tots els controls, llegint el
codi per saber on té efecte cadascun; vuit **casos d'ús** recorreguts pas a
pas, com els faria una persona que entra a la web per primera vegada; i unes
**mesures** sobre les dades reals (14 expansions, 2.464 cartes) per
comprovar amb números si els filtres tenen sentit.

---

## 1. Inventari: 31 controls i on té efecte cadascun

La pantalla principal té **31 controls interactius** (sense comptar les
cartes ni el selector d'expansions). La taula diu què fa cada un i, el que
és més important, **en quina de les tres parts de la web té efecte**: la
graella de cartes, l'àlbum, o el panell d'estadístiques.

| Control | Què fa | Graella | Àlbum | Estadístiques |
|---|---|:--:|:--:|:--:|
| Idioma | Canvia tots els textos | sí | sí | sí |
| Logotip de l'expansió | Canvia d'expansió | sí | sí | sí |
| **Cerca per nom o número** | Filtra | **sí** | **no** | **no** |
| Vista: Graella / Àlbum | Tria la disposició | — | — | — |
| Visualització: Col·lecció / Catàleg | Canvia els colors | sí | sí | — |
| Marcar: Consulta / Normal / Reverse / Holo | Tria què fa el clic | sí | sí | — |
| **Col·lecció: Totes / Les tinc / Em falten** | Filtra | **sí** | **no** | **no** |
| **Raresa** | Filtra | **sí** | **no** | **no** |
| **Tipus d'energia** | Filtra | **sí** | **no** | **no** |
| **Categoria** | Filtra | **sí** | **no** | **no** |
| **Ordena per** | Ordena | **sí** | **no** | — |
| Versió de les dades | Tria la còpia de dades | sí | sí | sí |
| Actualitza dades | Baixa dades noves | sí | sí | sí |
| Objectiu de compleció | Tria què vol dir «completa» | — | — | sí |
| Comptar les reverse holo | Inclou les reverses a l'objectiu | — | — | sí |
| Exportar / Importar / Buidar | Còpia de seguretat | sí | sí | sí |
| Fletxes de l'àlbum | Passa pàgina | — | sí | — |

**La troballa principal és la columna del mig.** Sis controls —el cercador,
el filtre Totes/Les tinc/Em falten, Raresa, Tipus d'energia, Categoria i
Ordena per— **només funcionen a la vista Graella**. A la vista Àlbum no fan
absolutament res: no s'apaguen, no es desactiven, no canvien d'aspecte i no
avisen de res. Es queden allà, amb el mateix color i el mateix cursor que
quan sí que funcionen, esperant que algú els toqui per no fer res.

La causa, en llenguatge planer: la graella es construeix cada vegada
agafant la llista de cartes i **fent-la passar pel sedàs** dels filtres
([main.js:402](../app/js/main.js:402)), mentre que l'àlbum es construeix
agafant **la llista sencera**, sense passar per cap sedàs
([album.js:150](../app/js/album.js:150)). Són dos camins separats dins del
programa, i els filtres només es van connectar al primer. No és un error de
programació —cada peça fa exactament el que se li va demanar— sinó un forat
entre dues peces que ningú no va demanar que es connectessin.

---

## 2. Vuit casos d'ús, recorreguts pas a pas

### CU-1 · «Acabo d'obrir un sobre i vull apuntar tres cartes noves»

Funciona, i funciona bé. Es clica la carta, s'obre la fitxa gran i hi ha
botons − i + per a cada variant (normal, reverse, holo). Per apuntar-ne
moltes de seguida hi ha els modes de marcatge, que converteixen el clic
esquerre en «+1» i el dret en «−1» sobre la graella o l'àlbum.

*Punt feble:* el mode per defecte es diu **«Consulta»**, una paraula que no
diu què passa si cliques. El que passa (s'obre la carta en gran) és una de
les coses més útils de la web i la que menys s'anuncia.

### CU-2 · «Quant val la meva col·lecció?»

El panell d'estadístiques ho respon: progrés, valor i cost de completar.
Però el títol diu «Estadístiques de **la col·lecció**» i la xifra diu «La
teva **col·lecció** val», quan en realitat **només compten l'expansió que
s'està mirant** ([stats.js:73](../app/js/stats.js:73)). Qui tingui cartes de
cinc expansions veurà una xifra molt més petita del que creu estar llegint,
sense cap avís.

El mateix passa al peu de la pàgina: el comptador «X de N cartes» és
**d'aquesta expansió** ([main.js:900](../app/js/main.js:900)), però just al
costat hi ha el botó **Buidar**, que esborra **totes les expansions**
([collection.js:131](../app/js/collection.js:131)). Dos significats de la
paraula «col·lecció» a dos centímetres l'un de l'altre.

### CU-3 · «Quines em falten d'aquesta expansió?»

A la graella, perfecte: «Em falten» i ja està. **A l'àlbum, el botó no fa
res** —i l'àlbum és precisament on una persona busca els buits, perquè és la
vista que imita el carpesà de debò.

### CU-4 · «Vull veure només les cartes de foc»

A la graella, perfecte. **A l'àlbum, res.** Aquest és el cas que va originar
l'estudi.

### CU-5 · «Vull ensenyar el meu àlbum a un amic»

Funciona molt bé: vista Àlbum + visualització Catàleg. És la combinació més
maca de la web i no hi ha res a arreglar.

### CU-6 · «Entro des del mòbil»

Al mòbil, gairebé tots els controls es pleguen darrere el botó «Filtres i
opcions». Si hi ha un filtre actiu —posem Raresa: Double Rare— **el control
que ho explica queda amagat**: es veuen quatre cartes on hi hauria d'haver
cent, i l'única pista és un botó plegat que no diu que hi hagi res a dins.

### CU-7 · «Canvio d'expansió»

Els filtres **es mantenen** en canviar d'expansió, sempre que el valor
existeixi també a la nova (i les rareses i els tipus es repeteixen a gairebé
tots els sets). També es manté el text del cercador. Resultat: es canvia
d'expansió i apareixen vuit cartes, sense que res digui per què.

### CU-8 · «He fet una còpia de seguretat; la torno a carregar»

**Importar no fusiona: substitueix** tota la col·lecció
([collection.js:148](../app/js/collection.js:148)), i **no demana
confirmació**. En canvi Buidar, que fa exactament el mateix mal, sí que la
demana. El botó perillós avisa i el botó igual de perillós, no.

---

## 3. Mesures sobre les dades reals

Les tres mesures següents s'han calculat sobre les 14 expansions que té la
web (2.464 cartes), per no decidir d'intuïció.

### Mesura 1 · El 58,4 % de les combinacions de filtres no dona cap carta

Combinant els tres desplegables (Raresa × Tipus d'energia × Categoria) hi ha
5.254 combinacions possibles a les 14 expansions. **3.066 no retornen cap
carta: el 58,4 %.** Hi ha combinacions impossibles per definició —qualsevol
tipus d'energia amb la categoria «Entrenador», perquè els entrenadors no
tenen tipus— i d'altres que simplement no existeixen en aquell set concret.

| Expansió | Combinacions | Sense cap carta |
|---|--:|--:|
| sv6pt5 (Shrouded Fable) | 439 | 308 (70,2 %) |
| me4 | 395 | 244 (61,8 %) |
| zsv10pt5 | 395 | 243 (61,5 %) |
| sv10 | 359 | 194 (54,0 %) |
| me1 | 296 | 126 (42,6 %) |
| **Total (14 expansions)** | **5.254** | **3.066 (58,4 %)** |

I quan es cau en una d'aquestes combinacions, el missatge que apareix és
«Cap carta no coincideix **amb la cerca**»
([i18n.js:22](../app/js/i18n.js:22)) — que assenyala el cercador quan la
culpa és d'un desplegable. L'usuari esborra el text de la cerca, no passa
res, i es queda sense saber què té trencat.

### Mesura 2 · Cada valor d'un filtre està escampat per un terç de l'àlbum

Si un filtre hagués de «portar-te a la pàgina corresponent», hauria d'haver
**una** pàgina per valor. No n'hi ha:

| Filtre | Pàgines de l'àlbum que contenen cada valor |
|---|--:|
| Tipus d'energia | 35,8 % |
| Raresa | 40,5 % |
| Categoria | 54,0 % |

De mitjana, triar «Foc» assenyala **més d'un terç de totes les pàgines** de
l'àlbum. No existeix «la pàgina del foc».

### Mesura 3 · Les rareses van seguides; els tipus, no

De 116 valors de raresa analitzats, **109 (el 94 %) ocupen pàgines
seguides**. De 136 valors de tipus, només **4 (el 3 %)**.

El motiu és bonic i té a veure amb com es numeren les cartes de debò: dins
del set base les cartes van ordenades per tipus (primer les de planta,
després les de foc, les d'aigua...), però les cartes especials del final
—les *illustration rare*, les *ultra rare*— repeteixen tots els tipus una
segona vegada. Així, «Planta» són les cartes 1-6 **i també** la 65: dos
blocs separats, no un.

**Conseqüència per a la idea de «portar-te a la pàgina»:** per a la raresa
tindria sentit tècnic, però no pràctic (una raresa com «Common» comença a la
pàgina 1 i no cal portar-hi ningú). Per al tipus d'energia, que és justament
el cas que es volia resoldre, hi ha sempre dos o tres destins possibles, i
triar-ne un seria arbitrari.

---

## 4. Les nou confusions, per ordre de gravetat

| # | Confusió | Gravetat |
|---|---|---|
| C-1 | A l'àlbum, sis controls visibles i actius no fan res | Alta |
| C-2 | El 58,4 % de combinacions de filtres no dona res, i el missatge d'error acusa el cercador | Alta |
| C-3 | «Col·lecció» vol dir tres coses: un mode de colors, un filtre, i les cartes que tens (unes vegades d'aquesta expansió, altres de totes) | Alta |
| C-4 | Al mòbil, els filtres actius queden amagats darrere un botó plegat | Alta |
| C-5 | «Importar» substitueix tota la col·lecció i no demana confirmació | Alta |
| C-6 | Els filtres i la cerca es mantenen en canviar d'expansió | Mitjana |
| C-7 | «Vista» (Graella/Àlbum) i «Visualització» (Col·lecció/Catàleg) són dues paraules gairebé iguals per a dues coses diferents | Mitjana |
| C-8 | «Consulta» no diu que serveixi per veure la carta en gran; i el Ctrl+clic per veure-la en mode marcatge només es descobreix per sort | Mitjana |
| C-9 | «Versió de les dades» i «Actualitza dades» són vocabulari de programador enmig de controls de col·leccionista | Baixa |

---

## 5. Les dues idees proposades, analitzades

### Idea A · «Mostrar els filtres només quan tinguin sentit»

És la idea correcta, i es pot aplicar a dos nivells diferents.

**A1. Dins de cada desplegable: amagar les opcions que no donarien cap
carta.** Si tens triada la categoria «Entrenador», el desplegable de tipus
d'energia no hauria d'oferir cap tipus. Això elimina d'un cop el 58,4 % de
culs-de-sac mesurat, i és la millora amb més efecte per menys feina.
*Recomanat.*

**A2. Entre vistes: amagar els controls que no apliquen a la vista activa.**
Aquí cal matisar. Amagar controls fa que la interfície «salti» i que
l'usuari dubti de la seva memòria («abans hi havia un cercador aquí, no?»).
La pràctica habitual en disseny d'interfícies és **desactivar amb
explicació** en comptes d'amagar, excepte quan el control és genuïnament
absurd en aquella vista. Per tant: «Ordena per» sí que s'ha d'amagar a
l'àlbum (l'ordre d'un àlbum és físic, no es pot canviar), però el cercador i
els filtres val més **fer-los funcionar** que amagar-los. Vegeu la idea B.

### Idea B · «Que el filtre et porti a la pàgina de l'energia corresponent»

La intuïció és excel·lent i apunta a la solució, però les mesures diuen que
la forma literal no es pot fer: **no existeix «la pàgina» d'un tipus** (cada
tipus toca el 35,8 % de les pàgines, en dos o tres blocs separats).

La versió honesta de la mateixa idea és convertir el filtre en un
**ressaltador amb navegació**, que és exactament el que fa el «cercar dins
la pàgina» de qualsevol navegador:

1. Es tria «Tipus: Foc» amb l'àlbum obert.
2. Les cartes de foc es mantenen enceses i la resta s'apaguen una mica
   (l'àlbum no perd cap butxaca: els buits són l'essència d'un àlbum).
3. Apareix un comptador: «9 cartes de foc · pàgines 1, 4 i 6» amb fletxes
   per anar saltant d'un bloc al següent.

Així el filtre deixa de ser mentida a l'àlbum, l'àlbum continua tenint
l'ordre físic de debò, i la intuïció original —«porta'm on són»— es compleix
de la manera que les dades permeten.

---

## 6. Recomanació, per ordre

> **Estat:** els punts **1 i 2 ja estan fets** (4 de novembre del 2026,
> decisió D-011). Del 3 al 8, pendents.

1. **Fer que la cerca i els filtres ressaltin a l'àlbum** (idea B
   reformulada), i amagar-hi «Ordena per». Això sol tanca C-1.
   — *Fet el 4-11-2026.*
2. **Desactivar les opcions impossibles** dels desplegables i reescriure el
   missatge de graella buida perquè digui la causa real i ofereixi un botó
   «Treure els filtres». Tanca C-2. — *Fet el 4-11-2026.*
3. **Desambiguar el vocabulari**: «Visualització» → **«Colors»**; el filtre
   «Col·lecció» → **«Què mostro»**; el panell → «Estadístiques **d'aquesta
   expansió**» i el peu, igual. Tanca C-3 i C-7.
4. **Al mòbil, un distintiu amb el nombre de filtres actius** al botó
   «Filtres i opcions». Tanca C-4.
5. **Demanar confirmació a Importar** (o, millor, oferir «fusionar» en
   comptes de «substituir»). Tanca C-5.
6. **Treure els filtres en canviar d'expansió.** Tanca C-6.
7. **«Consulta» → «Només mirar»**, i una pista visible del Ctrl+clic. Tanca
   C-8.
8. **Agrupar «Versió de les dades» i «Actualitza dades»** sota un títol
   «Dades» amb etiquetes planeres. Tanca C-9.

Els punts 1 i 2 són els que canvien l'experiència; del 3 al 8 són retocs de
text i de detall que es poden fer tots en una tarda.

## 7. Què no s'hauria de fer

- **No amagar controls** que tornaran a aparèixer: desactivar-los amb una
  explicació és menys desconcertant (excepte «Ordena per» a l'àlbum).
- **No fer que els filtres esborrin butxaques de l'àlbum.** Un àlbum amb
  només nou cartes de foc, enganxades a les tres primeres butxaques, ja no
  és un àlbum: és una graella amb plàstic.
- **No afegir més controls** fins que els 31 actuals s'entenguin. Tota
  funcionalitat nova suma a la confusió mesurada aquí.

---

## 8. La lliçó, per al treball escrit

Aquest estudi ha trobat una cosa que no esperàvem i que val per a la
hipòtesi del treball. **Cap dels nou problemes és un error de programació.**
El codi de cada peça és correcte: els filtres filtren bé, l'àlbum pinta bé,
les estadístiques calculen bé. Els nou problemes són tots d'una altra mena:
són **forats entre peces** i **paraules mal triades**.

Això assenyala el punt cec del mètode. Quan es demana «fes-me un filtre de
raresa», la IA fa un filtre de raresa excel·lent — i no pregunta si també
l'ha de connectar a la vista d'àlbum que es va fer la setmana passada, ni
avisa que la paraula «col·lecció» ja estava ocupada dues vegades. Ningú no
té la pantalla sencera al cap: la IA perquè només veu la petició que té
davant, i la persona perquè no sap que hi ha dos camins diferents dins del
programa. El resultat és una web on **tot funciona i res no s'entén**, i
això no es detecta provant funcionalitats una per una, sinó recorrent
tasques completes com s'ha fet aquí.
