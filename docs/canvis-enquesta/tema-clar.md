# Canvis de l'enquesta — tema clar amb interruptor clar/fosc

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`).

## Entrada del diari

**Què s'ha fet.** La web ja es pot veure en **tema clar**, a més del fosc
de sempre. A l'enquesta, una persona va demanar poder canviar de fosc a clar
i una altra trobava la web «massa fosca». A la capçalera, al costat de
l'idioma, hi ha un interruptor nou, «Tema: Clar / Fosc». La tria es recorda.
Mentre l'usuari no tria res, la web fa servir el que tingui posat el
dispositiu (mòbil o ordinador en mode clar o fosc), i hi canvia sola si el
dispositiu canvia. En obrir la pàgina no hi ha cap parpelleig: el tema es
decideix abans que es pinti res.

Per fer-ho, primer un agent va fer l'inventari de tots els colors escrits
directament dins dels estils (una trentena: ombres, l'àlbum, el plàstic de
les butxaques, la capçalera...). Tots van passar a ser **variables de
color** amb dos jocs de valors, un de fosc i un de clar. El tema fosc ha
quedat exactament igual que abans, i s'ha comprovat valor per valor.

Cada expansió té el seu color propi, i aquests colors estan pensats per a
fons fosc: sobre blanc, un rosa pàl·lid o un groc no es llegirien. En lloc
d'escriure a mà 22 paletes noves, la web calcula la versió clara de cada
color: conserva el to i l'enfosqueix pas a pas fins que arriba al contrast
mínim que demana la norma d'accessibilitat (4,5:1). Les cartes que no tens
continuen sortint en gris, també sobre fons clar, i es diferencien bé de les
que tens.

**Eines.** Claude Code (Opus 5.5) com a orquestrador. Un agent (Sonnet) va
fer l'inventari de colors i un altre (Opus), que no havia escrit el codi, va
revisar el canvi abans de publicar-lo. Comprovat al navegador integrat en
mida d'ordinador i de mòbil (390 px), en clar i en fosc, amb dues expansions
de to diferent (Shrouded Fable, lila, i Prismatic Evolutions, daurat). Les
pantalles revisades són la graella, l'àlbum, el zoom, el selector
d'expansions, les estadístiques amb l'explicació dels preus, «A altres
expansions», els missatges d'error i el peu.

**Cost.** 0 € (dins de la subscripció).

**Problemes.** Al mòbil, els botons Clar / Fosc quedaven esclafats perquè
els botons d'aquest tipus es reparteixen l'amplada. Es va arreglar donant-los
una mida pròpia. Les cartes apagades sobre fons clar es fonien amb el blanc
de la fitxa i es va haver d'ajustar el gris.

## Entrades de l'històric

**Tema clar i interruptor Clar / Fosc.**
Un selector nou a la capçalera canvia entre el tema clar i el fosc i ho
recorda. Si no s'ha triat res, la web segueix el tema del dispositiu, sense
parpelleig en carregar la pàgina.

**Tots els colors en variables.**
Els colors que estaven escrits directament dins dels estils passen a ser
variables amb un valor per al tema fosc i un altre per al clar. El tema fosc
queda idèntic.

**Colors d'expansió calculats per al tema clar.**
La versió clara del color de cada expansió no s'escriu a mà: el programa
l'enfosqueix, conservant el to, fins que arriba al contrast mínim de la
norma d'accessibilitat WCAG.

## Decisió

**Calcular els colors clars en lloc d'escriure'ls a mà.**
Hi ha 22 expansions, cadascuna amb el seu color triat per al fons fosc.
Es podien escollir a mà 22 colors nous per al fons clar, però és fàcil
equivocar-se amb el contrast. A més, cada expansió nova en necessitaria
dos. S'ha preferit una regla automàtica: mateix to i lluminositat més
baixa fins que el text de color es llegeix bé (contrast 4,5:1, el mínim de
la norma WCAG). Així el color de cada expansió es reconeix en tots dos temes
i una expansió nova només necessita el seu color de sempre. El tema
s'aplica abans de pintar la pàgina, amb un script molt curt a l'inici del
document, perquè qui l'ha triat clar no vegi una pantalla negra uns
instants.

## Repte

**Un tema clar no és només canviar el negre per blanc**
*22 de novembre de 2026*

Semblava que fer un tema clar seria girar els colors, però hi havia colors
amagats per tot arreu. Les ombres eren negres i pensades per a un fons
negre. El plàstic de les butxaques de l'àlbum era una vora blanca
gairebé transparent, que sobre blanc desapareixia. Els colors de cada
expansió, triats perquè lluïssin sobre fosc, sobre blanc no es llegien. Si
se n'escapava un, quedava una taca fosca enmig de la pàgina clara.

Per no deixar-se'n cap, la IA va encarregar primer a un altre agent un
inventari complet de tots els colors escrits a mà. Després els va convertir
un per un en variables i va comprovar, mesurant-los, que el tema fosc no
havia canviat gens. Per als colors de les expansions va fer servir una
fórmula d'accessibilitat (el contrast WCAG) per calcular-los en lloc de
triar-los a ull. És un bon exemple de com la IA pot fer una feina pesada i
sistemàtica, sempre que se li demani que la verifiqui.
