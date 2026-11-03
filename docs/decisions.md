# Registre de decisions

Cada decisió tècnica important del projecte, explicada en llenguatge planer,
amb les alternatives que es van considerar i el cost de l'opció triada.

---

## D-001 · Organitzar el projecte per fases amb especificacions primer

**Data:** 2026-08-09

**Decisió:** abans d'escriure cap codi, fer una fase d'especificacions
(Fase 0) on es defineix exactament què ha de fer la web, mitjançant una
entrevista de preguntes i respostes amb la IA.

**Per què:** és com treballen els equips professionals de software. Evita
construir coses que després no serveixen, i el document resultant es pot
incloure al treball escrit com a evidència del mètode seguit.

**Cost:** 0 €.

## D-002 · Web estàtica sense frameworks

**Data:** 2026-08-09

**Decisió:** la web es fa amb HTML, CSS i JavaScript "purs" (sense React ni
eines de compilació), més fitxers JSON de dades. S'obre amb un servidor
local senzill.

**Per què:** és el mateix patró que va funcionar al projecte tcg de Sorcery,
no costa res, es pot publicar gratis a qualsevol allotjament estàtic, i al
treball és molt més fàcil d'explicar què fa cada peça.

**Alternatives considerades:** un framework modern (React). Descartat per
complexitat innecessària per a l'abast de la v1.

**Cost:** 0 €.

## D-003 · Font de dades: pokemontcg.io amb cau local versionada

**Data:** 2026-08-09

**Decisió:** les dades de cartes (i els preus que porten incrustats) surten
de l'API gratuïta pokemontcg.io. La web NO depèn de l'API en viu: treballa
sempre contra una còpia local (cau). La cau és **versionada**: el botó
"Actualitza dades" crea una versió nova amb data, i totes les versions
anteriors queden guardades i consultables.

**Per què:** durant la investigació l'API va fallar amb errors 502 — si la
web en depengués en viu, cauria quan l'API caigués. A més, guardar versions
amb data permet ensenyar l'evolució dels preus, cosa interessant per al
treball. La clau de l'API es guarda en un fitxer local que NO es puja mai a
GitHub (està a .gitignore), perquè les claus són personals.

**Cost:** 0 € (API i clau gratuïtes).

## D-004 · Política de preus

**Data:** 2026-08-09

**Decisió:** es fan servir els preus de Cardmarket que porta l'API (euros),
assumint Near Mint i cartes en anglès, mostrant sempre la data de la versió
de dades. Es va detectar que aquests preus poden anar endarrerits; durant la
Fase 1-2 s'estudiarà si l'API gratuïta de CardTrader pot servir de
complement més fresc.

**Matisada per D-009 (2026-08-13):** si Cardmarket no té el preu d'una
variant, es fa servir de reserva el de TCGplayer convertit de dòlars,
marcat com a aproximat.

**Cost:** 0 €.

## D-005 · Treballar amb branques i pull requests

**Data:** 2026-08-09

**Decisió:** a partir de la Fase 2, els canvis nous no es fan directament
sobre la branca principal (`main`): es fan en una branca pròpia i s'obre un
**pull request** a GitHub, que es revisa abans de fusionar.

**Per què:** és com treballen els equips professionals — cada canvi queda
agrupat, explicat i revisat abans d'entrar al projecte. A més, els pull
requests queden guardats a GitHub per sempre i són una evidència
excel·lent del procés per al treball de recerca.

**Cost:** 0 €.

## D-006 · Importar còpies d'una variant que la carta no té: s'accepta i no es mostra

**Data:** 2026-08-09

**Decisió:** en importar una còpia de seguretat, es valida que cada variant
sigui una de les tres conegudes (normal, reverse, holo), però NO es comprova
si aquella carta concreta existeix de debò en aquella variant. Si un fitxer
editat a mà diu que tens una carta en una variant que no existeix (p. ex.
"holo" d'una carta que només surt en normal i reverse), la dada es guarda
però la graella no la mostra (només pinta les variants reals de cada carta)
i el càlcul de valor tampoc no la compta. En canvi, al panell
d'estadístiques la carta sí que compta com a tinguda: el progrés i el cost
de completar només miren si tens alguna còpia de la carta (en qualsevol
variant, encara que sigui una variant "fantasma"), així que una entrada
d'aquestes fa pujar el progrés i abaixar el cost de completar.

**Per què:** el flux normal (exportar des de la web i tornar a importar) mai
no pot produir aquest cas; només passa amb fitxers manipulats a mà. Per
comprovar-ho caldria que el mòdul de la col·lecció conegués les dades de les
cartes, i això trencaria la separació "estat / dades / interfície" que fa el
codi fàcil d'explicar. S'accepta el cas límit i es deixa apuntat aquí.

**Alternatives considerades:** pintar a la graella també les variants
inexistents amb comptador > 0 perquè es poguessin corregir. Descartat per
complexitat afegida per a un cas que no surt del flux normal.

**Cost:** 0 €.

## D-007 · Repositori públic i publicació amb GitHub Pages

**Data:** 2026-08-10

**Decisió:** fer públic el repositori de GitHub i publicar la web a
internet amb **GitHub Pages**, el servei d'allotjament gratuït del mateix
GitHub.

**Per què:** GitHub Pages en la modalitat gratuïta només funciona amb
repositoris públics. Abans de fer el pas es va verificar que a l'historial
de git no hi ha cap secret: el fitxer amb la clau de l'API (`config.json`)
no s'ha comitejat mai. Fer-ho tot dins de GitHub evita donar d'alta cap
servei nou, i que el repositori sigui públic és fins i tot un avantatge per
al treball: qualsevol membre del tribunal pot veure el codi i tot el procés.

**Alternatives considerades:** Netlify i Cloudflare Pages, que sí que
poden publicar des de repositoris privats. Descartades perquè caldria
crear un compte en un servei extern i no aportaven res més per a aquest
projecte.

**Cost:** 0 €.

## D-008 · Selector d'expansions amb `<dialog>` natiu i tema de colors per set

**Data:** 2026-08-11

**Decisió:** el canvi d'expansió es fa des d'un panell modal que s'obre
clicant el logotip del set a la capçalera (o amb Ctrl+K): una llista
vertical d'expansions agrupades per sèrie, amb cerca, progrés de cada set
i teclat complet. El panell és un element `<dialog>` natiu del navegador.
A més, cada expansió pot definir el seu color d'accent (tres variables
CSS), que s'aplica a tota la web amb una transició suau; un interruptor
al peu del panell («Tema segons l'expansió», activat per defecte) permet
tornar al turquesa fix.

**Per què:** una llista vertical funciona igual de bé amb 2 sets que amb
20 (no sembla mai buida) i escala amb la cerca. El `<dialog>` natiu regala
el teló fosc, la tecla Esc i el focus tancat a dins sense ni una línia de
JavaScript: menys codi i més fàcil d'explicar al tribunal. El progrés de
cada set es calcula comptant els ids de la col·lecció pel seu prefix
(ex. "sv6pt5-"), sense haver de carregar les dades dels sets no actius.
El tema per set és l'aportació visual estrella per a la demo i no té risc:
un set sense tema propi cau al turquesa per defecte.

**Alternatives considerades:** una "vitrina" de capses de sets i un
carrusel horitzontal. Descartades perquè amb poques expansions es veuen
buides i perquè obliguen a gestionar el focus i els overlays a mà.

**Cost:** 0 €.

## D-009 · Cadena de reserva de preus: Cardmarket primer, TCGplayer convertit si no n'hi ha

**Data:** 2026-08-13

**Decisió:** el preu d'una carta surt de Cardmarket (euros) com sempre
(política D-004, que aquesta decisió matisa); però si Cardmarket no en té
(passa amb els sets més nous: l'API porta el seu bloc buit), es fa servir
de reserva el preu de mercat de TCGplayer (dòlars americans) convertit a
euros amb una taxa fixa aproximada (0,90). Els preus de reserva es
marquen amb «≈» a la fitxa de la carta, amb l'explicació en passar-hi el
ratolí, i el panell d'estadístiques afegeix una nota («inclou preus
aproximats (≈): n») quan el valor o el cost en contenen algun. Si cap
font té preu, es manté el guió i el recompte honest de «cartes sense
preu» al panell.

La reserva actua **variant a variant**, no set a set: també en sets amb
Cardmarket complet, si una variant concreta no hi té preu (un reverse amb
les claus a zero, una carta sense bloc de Cardmarket), aquella variant
agafa el preu de TCGplayer i surt marcada amb «≈».

**Per què:** en afegir Prismatic Evolutions i els sets de Mega Evolution
es va descobrir que el valor de la col·lecció i el cost de completar hi
sortien a zero: cap carta d'aquells sets no tenia preus de Cardmarket a
l'API. TCGplayer sí que en té per als sets que ja té llistats —
Prismatic Evolutions, Mega Evolution i Phantasmal Flames —, i un preu
aproximat marcat honestament és més útil que un zero enganyós. Els
altres quatre sets nous (Ascended Heroes, Perfect Order, Chaos Rising i
Pitch Black) de moment no tenen preu a cap font — comprovat a la cau i,
el 13-08, contra l'API en viu (que va confirmar Perfect Order i Pitch
Black sense preus; per als altres dos responia amb els errors
intermitents coneguts) — i mantenen el guió i el recompte de «cartes
sense preu» fins que l'API en porti. La taxa fixa és
una simplificació documentada: per a una web orientativa de
col·leccionisme és suficient, i evita dependre d'un servei de canvi de
divises.

**Alternatives considerades:** esperar que l'API actualitzi Cardmarket
(pot trigar mesos), o integrar l'API de CardTrader (queda apuntada com a
millora futura a docs/recerca-cardtrader.md; la reserva de TCGplayer és
gratuïta i immediata perquè les dades ja són a la cau).

**Cost:** 0 €.
