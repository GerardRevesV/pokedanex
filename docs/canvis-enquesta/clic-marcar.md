# Canvis de l'enquesta — el clic sobre una carta i el selector «Marcar»

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`).

## Entrada del diari

**Què s'ha fet.** S'ha arreglat la queixa més repetida de l'enquesta (4
persones, i 2 dels 3 errors que s'hi van descriure): amb un mode de marcar
actiu, clicar una carta l'afegia a la col·lecció en lloc d'ensenyar-la, i si
la carta no tenia aquella variant semblava que no passava res. La drecera per
veure-la (Ctrl+clic, o mantenir el dit al mòbil) no la va descobrir ningú.
S'ha tret del tot el selector «Marcar»: ara clicar (o tocar) una carta
sempre l'obre en gran, tant a la graella com a l'àlbum, i les còpies
s'afegeixen i es treuen amb els botons + i − de cada carta i de la finestra
gran. De passada s'han fet tres millores més que l'enquesta demanava:

- Una frase que explica què és una carta **reverse holo**, perquè el 30% dels
  enquestats (el 53% dels que no col·leccionen) no entenia la diferència amb
  la normal. Surt a la finestra gran de les cartes que en tenen, amb una
  icona d'informació, i també en passar el ratolí pel nom «reverse».
- Fletxes ‹ › a la finestra gran per passar a la carta anterior o següent
  sense tancar-la (també amb les fletxes del teclat o lliscant el dit al
  mòbil). Segueixen l'ordre i els filtres que hi havia en obrir-la.
- En canviar de Graella a Àlbum (o a l'inrevés) ja no es torna al principi:
  l'altra vista s'obre on és la carta que s'estava mirant.

**Eines.** Claude Code (model Opus 5.5) en una sessió pròpia, en paral·lel
amb les altres sessions de millores de l'enquesta; un segon agent va revisar
el canvi abans de publicar-lo. Comprovat al navegador integrat en mida
d'ordinador i de mòbil (390 px).

**Cost.** 0 € (dins de la subscripció). Temps: una sessió.

**Problemes.** Treure una peça que tocava molts llocs (graella, àlbum,
estils, textos en tres idiomes, ajudes del Ctrl+clic i del toc llarg) sense
deixar codi mort. I decidir quina és «la carta que miraves» en canviar de
vista: s'ha triat la primera carta que es veu almenys mig sencera a dalt de
la pantalla.

## Entrades de l'històric

**Fora el selector «Marcar»: el clic sempre obre la carta.**
Es treu el mode de marcar amb clics (Només mirar / Normal / Reverse / Holo),
que confonia els usuaris: el clic o toc sobre una carta l'obre sempre en
gran, a la graella i a l'àlbum, i les còpies es marquen amb els botons + i −.
Desapareixen també les ajudes del Ctrl+clic i del toc llarg, que ja no calen,
i el clic dret torna a mostrar el menú normal del navegador.

**Explicació de les cartes reverse holo.**
A la finestra gran de cada carta que té variant reverse surt una frase curta
amb una icona d'informació: és la mateixa carta però amb la brillantor al
fons i no al dibuix, i es compta a part perquè és una impressió diferent amb
preu propi. En català, castellà i anglès.

**Passar de carta dins la finestra gran.**
La finestra gran té fletxes ‹ › (i funcionen les fletxes del teclat i
lliscar el dit) per anar a la carta anterior o següent sense tancar-la,
seguint l'ordre i els filtres de la graella, o l'ordre de l'àlbum.

**Graella i àlbum mantenen la posició.**
En canviar de vista, l'altra s'obre a l'alçada o a la pàgina on és la carta
que s'estava mirant, en lloc de tornar al principi.

## Decisió

**Treure el mode de marcar amb clics (en lloc d'explicar-lo millor).**
L'enquesta va mostrar que el mode de marcar era la principal font de
confusió: la gent hi entrava, s'oblidava que hi era, i clicar una carta
feia una cosa inesperada (afegir-la) o no feia res. Es podia haver intentat
explicar-ho millor (avisos, ajudes), però ja hi havia avisos i ningú no
havia descobert el Ctrl+clic. Per això s'ha optat per una regla simple que
no cal explicar: **clicar una carta sempre la mostra; per afegir-la hi ha
els botons + i −**. Es perd una drecera per marcar moltes cartes de pressa,
però els botons + i − ja hi eren a cada carta i fan el mateix amb un sol
clic.

## Repte

**Treure una funció sense deixar restes**
*22 de novembre de 2026*

Afegir una funció a una web és relativament fàcil; treure-la bé costa més
del que sembla. El selector «Marcar» no era només un grup de botons: canviava
el que feia el clic a la graella i a l'àlbum, tenia un comptador petit a
cada butxaca de l'àlbum, un botó de restar només per a mòbil, un gest de
«mantenir el dit» per obrir la carta, missatges d'ajuda en tres idiomes i
estils propis. Si se n'esborrava només una part, quedaven peces òrfenes que
no feien res o, pitjor, que encara canviaven el comportament d'amagat.

Per fer-ho amb garanties, la IA va buscar totes les referències al mode pel
seu nom dins del codi, les va treure una per una i, al final, va tornar a
buscar per comprovar que no en quedava cap. Després un segon agent, que no
havia escrit el canvi, va revisar-lo amb ulls nous abans de publicar-lo.
És una lliçó útil sobre el «vibe coding»: la IA pot fer aquesta neteja
sistemàtica molt de pressa, però cal demanar-li explícitament que no deixi
codi mort i comprovar-ho.
