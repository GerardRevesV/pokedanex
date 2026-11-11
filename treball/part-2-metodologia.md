# Part II — Metodologia: com s'ha treballat

*Esborrany de l'11 de novembre del 2026. Capítols 6 a 15.*

La Part I explica què és el *vibe coding*. Aquesta explica com s'ha fet
servir en aquest projecte. Cada capítol parteix d'un problema que va
aparèixer durant la feina i explica com es va resoldre. Les dates, les
xifres i els exemples surten dels documents que el projecte ha anat
escrivint dia a dia.

Tres paraules es fan servir sempre amb el mateix sentit. **L'eina** és
Claude Code, el programa amb què s'ha fet el projecte. **La màquina** és
la intel·ligència artificial que hi ha dins de l'eina. I una **conversa**
és cada sessió de feina amb l'eina. La web es descriu a la Part III; aquí
n'hi ha prou de saber que ensenya cartes, compta les que té l'usuari i en
calcula el preu.

## 6. Les regles del joc

El treball de recerca va començar el 24 de març del 2026, amb el
seguiment dels professors, la tria del tema i la hipòtesi. La web es va
començar el 9 d'agost del 2026, i una de les primeres coses que es van
fer no va ser cap pàgina web. Va ser un document curt amb les normes del
projecte. Al principi n'hi havia quatre:

1. L'autora no escriu ni una línia de codi. Tot el codi el genera la
   màquina.
2. El projecte no pot costar més de 20 euros al mes.
3. Tot es fa en català.
4. Tot el que es fa queda apuntat.

Aquest document es diu `CLAUDE.md` i té una particularitat: l'eina el
llegeix tota sola cada vegada que comença una conversa. Això és important
perquè la màquina no recorda les converses anteriors. Sense el document,
cada dia s'hauria de tornar a explicar què es pot fer i què no.

Les normes van créixer amb el projecte, i avui n'hi ha vuit. El mateix 9
d'agost se'n van afegir dues: explicar cada decisió en llenguatge planer
i apuntar cada pas nou en un històric. L'11 d'agost, dues més: donar
sempre l'adreça per veure la web acabada de canviar, i escriure en un
document a part el que hagués costat d'entendre o de resoldre.

La quarta norma, apuntar-ho tot, ha acabat sent un mètode de treball. El
projecte té quatre documents que s'omplen a cada sessió:

| Document | Què s'hi apunta |
|---|---|
| Diari | Què s'ha fet cada dia, amb quines eines i quins problemes |
| Històric | Cada pas nou, amb un títol i una explicació |
| Decisions | Què s'ha triat i per què, en llenguatge planer |
| Reptes | El que ha costat d'entendre o de resoldre |

*Taula 1. Els quatre documents de procés del projecte.*

A principis de novembre del 2026 l'històric tenia més de cinquanta entrades,
i hi havia 13 decisions i una dotzena de reptes escrits. Són la font
d'aquesta part del treball: sense ells no es podria explicar què va passar
tres mesos enrere.

## 7. Dir-ho bé: com es demana una cosa a la màquina

La màquina sol fer el que se li demana, i aquí hi ha la dificultat: cal
saber què es vol abans de demanar-ho.

Per això la primera decisió del projecte va ser no començar pel codi.
Primer es va fer una entrevista, i les preguntes les feia la màquina.
L'autora va respondre en tres tandes, i a cada tanda es prenien
decisions. De la primera va sortir, per exemple, que la web no tindria
comptes d'usuari. De la segona, que només es comptarien cartes en anglès
i en bon estat. De la tercera, que es podrien comptar les còpies
repetides. Les respostes es van escriure en un document d'especificacions,
i la web es va construir a partir d'aquest document (capítol 16).

L'entrevista funciona perquè capgira els papers. Qui no sap programar no
sap quines preguntes s'ha de fer. La màquina sí que ho sap, i les fa. La
persona només ha de respondre sobre el que vol, que és el que coneix.

Un cop feta la web, les peticions eren concretes: per exemple, que el
botó esquerre del ratolí sumés una carta i el dret la restés. Una petició
així es pot fer i es pot comprovar. Una de vaga, com ara «millora els
filtres», no diu què s'ha de millorar ni com se sabrà si ha millorat.

Demanar les coses peça a peça té un límit, que es va veure al novembre.
Cada petició s'havia fet bé: un filtre per raresa, un altre per tipus,
una vista d'àlbum. Però no s'havia demanat que els filtres funcionessin
dins de l'àlbum, i no hi funcionaven: sis controls de la pantalla no hi
feien res. No era cap error de programació. Cada peça era correcta, i el
conjunt no s'entenia. D'aquí va sortir el propòsit de demanar de tant en
tant a la màquina que repassi la web sencera tal com la faria servir una
persona, i no només la peça nova.

## 8. Pensar abans de fer: els plans

Una màquina que escriu codi molt de pressa també s'equivoca molt de
pressa. Per això abans de fer es planifica, de tres maneres.

**Per fases.** El 9 d'agost es va escriure una planificació amb sis
fases, de la 0 a la 5, cadascuna amb un objectiu i un resultat per
entregar. La norma diu que no se'n comença cap sense tancar l'anterior.
Segons la planificació, les fases 0, 1 i 2 (decidir què havia de fer la
web, triar les eines i construir-la) es van tancar el 9 d'agost. La
norma no s'ha complert del tot: la Fase 4, que és aquest treball escrit,
s'ha començat amb la Fase 3 encara oberta, perquè falten les proves amb
usuaris.

**Comparant propostes.** Quan calia triar un disseny, es demanaven tres
propostes per escrit i se'n triava una.

**Amb un pla escrit per a cada tasca.** Abans de tocar res, la màquina
escriu què farà i en quin ordre. El pla està escrit en paraules i es pot
llegir sense saber programar. És el moment de dir «això no és el que
volia»: corregir un pla costa molt menys que corregir el codi ja fet.

Tenir un pla no vol dir que el pla estigui bé. En un dels plans, la
màquina hi va posar una part de codi que sobrava: estava ben escrita,
però la web no la feia servir mai (capítol 15). Com que el codi es va
escriure seguint el pla, l'error va passar del pla al codi, i no es va
trobar fins a la revisió. Planificar redueix els errors, però després
cal revisar igualment.

## 9. Quan la feina es repeteix: les receptes guardades

Les cartes es publiquen per expansions: una expansió és una tanda de
cartes que surt junta. La web va començar amb una de sola, Shrouded
Fable. Afegir-ne una altra volia dir fer sempre el mateix: baixar les
dades, registrar l'expansió, triar-li un color, comprovar que es veu bé i
apuntar-ho als documents. Són passos fàcils d'oblidar quan es fan de
memòria.

L'eina permet desar un procediment així com una recepta, que en anglès
s'anomena *skill*. És un text que explica els passos un per un. Quan se
li demana que afegeixi una expansió, la màquina obre la recepta i la
segueix. El projecte en té una, creada l'11 d'agost del 2026.

Es va estrenar aquell mateix dia amb una expansió de 180 cartes, i tot
seguit se'n van afegir dotze més d'una sola tirada. La web va passar de 2
expansions a 14, amb 2.464 cartes (4.016 peces, si cada variant d'una carta
es compta a part).

Una recepta no es fa un cop i prou. En afegir les dotze expansions es va
veure que quatre no tenien logotip oficial, i el pas per resoldre-ho es
va escriure a la recepta. Al novembre, quan es va afegir una segona font
de preus (capítol 19), també es va afegir a la recepta. Cada problema
resolt hi queda escrit, i és més difícil que es repeteixi.

## 10. Repartir la feina: agents i subagents

Una conversa fa una cosa darrere l'altra. Quan la feina és gran, l'eina
permet que la conversa principal n'encarregui parts a altres còpies de la
mateixa màquina, que treballen alhora i tornen cadascuna el seu resultat.
En anglès se'n diuen *agents* o *subagents*; aquí s'anomenen ajudants.

El cas més clar és l'adaptació de la web al mòbil, feta l'11 d'agost del
2026 (capítol 20). Calia trobar tot el que fallava en una pantalla
petita, i es va fer en tres rondes. A cada ronda, vuit ajudants miraven
cadascun una part diferent de la web. Un altre recollia el que havien
trobat i ho arreglava, i un últim comprovava que la correcció no hagués
espatllat la versió d'ordinador. En total, 30 ajudants i 89 problemes
trobats i arreglats.

Repartir la feina té dos avantatges. El primer és el temps. El segon és
que cada ajudant mira una sola cosa, i per això troba detalls que en una
revisió general passen per alt.

Els ajudants són la mateixa màquina amb encàrrecs diferents, no persones
diferents. Poden coincidir tots en un mateix error.

## 11. Dues converses alhora

També es poden tenir obertes dues converses sobre el mateix projecte,
cadascuna amb la seva feina. És còmode, però té un problema que no es veu
fins que passa: **una conversa no sap res del que fa l'altra**. No
comparteixen memòria.

Al projecte va passar diverses vegades. Dos casos ho expliquen bé.

El 10 d'agost, dues converses van apuntar la seva feina a l'històric
alhora, i totes dues van posar el número 21 a la seva entrada. En ajuntar
les dues feines es van conservar les dues entrades i es van tornar a
numerar.

L'11 d'agost va ser més greu. Dues converses treballaven a la mateixa
carpeta de l'ordinador, i la feina de l'una es va barrejar amb la de
l'altra. En separar-les es va descobrir que faltava un fitxer que altres
parts de la web necessitaven: si s'hagués publicat així, la web no
s'hauria obert. La solució va ser donar a cada conversa una carpeta de
treball pròpia. És el que s'intenta fer des de llavors, tot i que al
novembre encara van coincidir dues converses a la mateixa carpeta.

Treballar en paral·lel estalvia temps, però obliga a tres coses: separar
bé la feina de cada conversa, donar-li una carpeta pròpia i repassar-ho
tot quan s'ajunta.

## 12. La revisió per capes

Aquest capítol respon a l'objecció més seriosa que es pot fer al
projecte: si l'autora no llegeix el codi, com sap que està bé?

L'autora no comprova el codi: comprova la web, fent-la servir. El codi el
revisa la màquina, però no la mateixa còpia que l'ha escrit. Cada bloc de
feina passa per una cadena de sis passos, i a cada pas hi intervé un
ajudant diferent, que no ha escrit el que revisa:

| Pas | Qui | Què fa |
|---|---|---|
| 1 | Planificador | Escriu el pla de la tasca |
| 2 | Executor | Escriu el codi seguint el pla |
| 3 | Dos revisors, alhora | L'un comprova que el codi fa el que s'havia demanat; l'altre hi busca errors |
| 4 | Arreglador | Corregeix el que han trobat els revisors |
| 5 | Revisor final | Ho torna a mirar tot amb ulls nous i comprova les correccions |
| 6 | Prova al navegador | La web s'obre i es fa servir |

*Taula 2. La cadena de revisió, fixada l'11 d'agost del 2026.*

La idea és la mateixa que quan es demana a algú altre que llegeixi un
text propi: qui l'ha escrit llegeix el que volia dir, i no el que hi diu.
Per això qui revisa no és qui ha escrit, i qui arregla no és qui ha
trobat l'error.

L'11 d'agost, quan es va fixar el mètode, ja s'havien trobat així prop
de trenta problemes abans que arribessin a la versió bona de la web.
Entre ells hi havia dos forats de seguretat, és a dir, dues maneres de
fer malbé la web des de fora. La web permet desar la col·lecció en un
fitxer i tornar-la a carregar. Els revisors van veure que, si algú
preparava un fitxer fals amb mala intenció i un usuari el carregava, la
web d'aquell usuari es podia espatllar. Amb fitxers normals tot
funcionava: fent servir la web, el problema no es veia.

Totes les capes les fa la mateixa màquina. Que una còpia revisi la feina
d'una altra redueix els errors, i els resultats ho mostren, però no és el
mateix que la revisió d'un programador expert. Als documents del projecte
no hi consta cap revisió del codi feta per una persona.

## 13. Guardar-ho tot: l'historial de canvis

Si la màquina espatlla una cosa que funcionava, cal poder tornar enrere.
Per a això serveix **git**, un programa que guarda una fotografia del
projecte cada vegada que es fa un canvi, amb una nota que diu què s'ha
canviat. Aquestes fotografies es desen també a internet, a **GitHub**,
on es guarda el projecte des que es va començar la web. El compte de
GitHub és del pare de l'autora.

En tancar la Fase 1 es va decidir treballar sempre de la mateixa manera:

1. Cada canvi es fa en una **branca**, que és una còpia del projecte on
   es pot treballar sense tocar la versió bona.
2. Quan el canvi està acabat, s'obre un ***pull request***: una petició
   d'ajuntar la branca amb la versió bona. Allà es veu, línia per línia,
   què canvia.
3. La màquina el revisa (capítol 12) i l'autora prova la web. Si tot
   està bé, es **fusiona**, és a dir, s'ajunta amb la versió bona. En
   aquell moment la web publicada s'actualitza tota sola (capítol 21).

Això dona tres coses. Es pot tornar enrere. Cap canvi del codi no arriba a
la web publicada sense haver passat per una revisió. I en queda constància:
cada *pull request* és una prova de què es va fer i quan. A principis de
novembre del 2026 se n'havien obert una vintena en tot el projecte.

## 14. Com es comprova que funciona

En aquest projecte, comprovar vol dir obrir la web i fer-la servir.
Gairebé a cada canvi, la màquina obre la web en un navegador, el programa
amb què es mira internet, i fa el que faria una persona: marca cartes,
canvia l'idioma, filtra, passa pàgines de l'àlbum. Mira que no surti cap
error i que els números siguin els que han de ser. En una de les
revisions, per exemple, un revisor va tornar a fer a part tots els
càlculs de valor i de cost, cèntim a cèntim, i els va comparar amb els de
la web.

El pare de l'autora també ha ajudat a revisar la web: l'ha provat i hi ha
donat consells.

Algunes coses es comproven per càlcul. Que les lletres es llegeixin bé
sobre cada color de fons es va mesurar amb una fórmula de contrast
(capítol 20). I els preus es van revisar aplicant la regla de la web a
totes les cartes i comptant quantes es quedaven sense preu (capítol 19).

Tres coses no s'han fet:

- **No hi ha proves automàtiques.** Els programadors solen escriure
  petits programes que comproven sols, a cada canvi, que tot el que
  funcionava continua funcionant. Aquest projecte no en té cap. Cada
  comprovació s'ha fet de nou cada vegada, i el que no es torna a mirar
  no es comprova. L'única cosa automàtica és la publicació de la web.
- **No consta cap prova en un telèfon de debò.** El mòbil s'ha comprovat
  amb una pantalla simulada a l'ordinador, que imita l'amplada d'un
  telèfon.
- **No consta cap prova amb usuaris.** És la que falta per poder dir si
  la web és útil, i forma part de la Fase 3, que continua oberta.

Mirar la pantalla continua sent necessari fins i tot quan hi ha càlculs.
En canviar la regla dels preus, la comprovació per càlcul va sortir bé, i
en obrir la web es va veure que un grup de cartes sortia marcat com a
«preu antic» sense ser-ho. L'error era a la manera d'ensenyar el preu, no
al preu. Només es veia mirant.

## 15. Quan la màquina s'equivoca

La màquina s'equivoca, i en un projecte així l'important és saber com.
La taula 3 recull els casos més clars.

| Què va passar | Com es va descobrir | Què es va fer |
|---|---|---|
| El servei d'internet que dona les dades rebutjava les peticions, i després fallava de tant en tant | A la primera prova de baixar dades | La web treballa amb una còpia desada de les dades |
| Un fitxer preparat amb mala intenció podia espatllar la web | A la revisió per capes | Es va corregir abans de publicar res |
| Un tros de codi estava ben escrit però no es podia arribar a fer servir mai | A la revisió per capes | Es va esborrar |
| Completar una expansió nova «costava» 0,00 € | Ho va veure l'autora fent servir la web | Preu aproximat, marcat amb «≈» |
| Sis controls no feien res a la vista d'àlbum | Ho va veure l'autora fent servir la web | Es van connectar els filtres a l'àlbum i es van canviar noms |
| Preus de feia gairebé un any, i cartes de cèntims valorades en 7, 27 i 42 € | En comparar dues fonts de preus | Segona font i regla nova de preus |

*Taula 3. Errors del projecte, com es van descobrir i què es va fer.*

D'aquests casos es treuen quatre idees.

**L'error perillós és el que sembla correcte.** Quan la web no s'obre, es
veu de seguida. Un cost de 0,00 € que surt de sumar cartes sense preu, o
un preu de 42 euros en una carta de cèntims, no fan saltar cap avís. La
màquina no pot avisar d'un error que no veu.

**Alguns errors no eren de la màquina.** El servei que fallava i els
preus que ningú no actualitzava venien de fora. Una web com aquesta
depèn de serveis que són d'altres empreses, com el que dona les dades i
els preus de les cartes, i això passa igual quan la programa una
persona.

**Hi ha errors que només veu qui fa servir la web.** El zero i els
controls que no feien res no els va trobar cap revisor. Els va trobar
l'autora, que mirava la web com una col·leccionista. El zero, per exemple,
el va veure marcant col·leccions: hi havia cartes sense preu, i el total
no podia ser bo. No saber programar no li ho va impedir.

**De vegades qui s'equivoca és la persona.** L'autora va demanar dues
vegades que el tipus d'una carta, l'Eevee, digués «Normal» en lloc
d'«Incolor». La màquina no ho va fer: va consultar les dades oficials del
joc de cartes, on el tipus és Incolor, i ho va explicar. L'autora ho va
acceptar. Si la màquina hagués dit que sí, la web tindria una dada falsa.
