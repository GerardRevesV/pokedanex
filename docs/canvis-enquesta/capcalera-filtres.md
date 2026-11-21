# Canvis de l'enquesta — capçalera, filtres i cartes apagades

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`).

## Entrada del diari

**Què s'ha fet.** Quatre retocs a la part de dalt de la web, tots sortits
de l'enquesta:

- **El botó per canviar d'expansió ara es veu.** Tres persones no van
  descobrir que, per canviar d'expansió, calia clicar el logotip, i una va
  pensar que la web només tenia Shrouded Fable. Ara el logotip va dins un
  botó de debò, amb fons, vora i el text «Canvia d'expansió ▾». Al mòbil,
  el text queda sota el logotip.
- **Botó «Treu tots els filtres».** Surt només quan hi ha alguna cerca o
  algun filtre actiu, i amb un clic ho torna tot a l'inici: el cercador,
  «Què mostro», la raresa, el tipus d'energia i la categoria. L'ordre i la
  vista no es toquen, perquè no amaguen cap carta. El mateix botó surt al
  missatge de «cap carta no coincideix».
- **«Colors» passa a dir-se «Cartes que no tinc».** Les dues opcions són ara
  «Apagades» i «En color» (abans «Col·lecció» i «Catàleg», que no
  s'entenien). Està en català, castellà i anglès.
- **Les cartes que no tens es veuen més clares.** Segueixen en gris, perquè
  es distingeixin d'un cop d'ull de les que tens (que són en color), però ja
  no són gairebé negres: es reconeix el Pokémon i es llegeix el nom, fins i
  tot a les cartes fosques. El candidat més clar a les queixes de «no es veu
  bé» i «massa fosca».

**Eines.** Claude Code (Opus 5.5), en una sessió paral·lela a les altres
millores de l'enquesta. Un segon agent va revisar el canvi abans de
publicar-lo. Comprovat al navegador integrat en mida d'ordinador i de mòbil
(390 px), a la graella i a l'àlbum, i amb dos temes d'expansió (Shrouded
Fable i Prismatic Evolutions).

**Cost.** 0 € (dins de la subscripció).

**Problemes.** Al mòbil, el botó nou d'expansions, amb el text al costat del
logotip, no hi cabia: sortia 17 píxels per fora de la pantalla. Es va
resoldre posant el text sota el logotip en pantalles estretes.

## Entrades de l'històric

**El canvi d'expansió es veu com un botó.**
El logotip de l'expansió de la capçalera va dins un botó amb el text
«Canvia d'expansió», perquè a l'enquesta hi havia qui no sabia que es podia
clicar.

**Botó «Treu tots els filtres».**
Un botó que només apareix quan hi ha filtres o una cerca activa i que ho
neteja tot d'un sol clic, tant al bloc de filtres com al missatge de «cap
carta no coincideix».

**«Cartes que no tinc: Apagades / En color».**
El selector que abans es deia «Colors» (amb les opcions «Col·lecció» i
«Catàleg») canvia de nom perquè s'entengui sense explicacions.

**Cartes apagades més clares.**
Les cartes que encara no tens continuen en gris, però més clares i
llegibles. La intensitat es controla amb dues variables de color, de
manera que el futur tema clar la pugui ajustar sense tocar res més.

## Decisió

**Què vol dir «treure els filtres».**
El botó torna a l'inici tot el que **amaga cartes**: la cerca, «Què
mostro», la raresa, el tipus d'energia i la categoria. No toca l'ordre de
la graella ni la vista (Graella o Àlbum), perquè no amaguen res: només
canvien com es mostren les cartes. Si el botó els canviés, l'usuari
perdria una preferència que ha triat a consciència, cosa que no espera
d'un botó que es diu «treu els filtres».

## Repte

**Fer visible el que per al dissenyador és obvi**
*22 de novembre de 2026*

Per a qui va fer la web, era evident que el logotip de l'expansió es podia
clicar: tenia una fleteta al costat i s'il·luminava en passar-hi el ratolí.
L'enquesta va demostrar que no era gens evident: tres persones no ho van
descobrir, i una va pensar que la web només servia per a una expansió. Una
cosa semblant passava amb les cartes apagades: el gris fosc semblava una
bona idea per distingir les que tens de les que no tens, però sobre un fons
fosc moltes cartes es tornaven gairebé invisibles.

La lliçó és que les proves amb usuaris reals troben problemes que qui fa
la web no veu, perquè ja sap com funciona. La solució no va ser gaire
complicada (posar text al botó i aclarir el gris), però sense l'enquesta
no s'hauria fet. És una bona mostra de per què val la pena preguntar als
usuaris, tant si la web l'ha programada una persona com una IA.
