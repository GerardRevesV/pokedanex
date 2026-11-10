# Reptes del projecte

L'històric (docs/historic.md) explica QUÈ hem fet, pas a pas. Aquest
document explica QUÈ HA COSTAT: els processos que han estat difícils de
fer o d'entendre per a una persona que no programa. Cada repte s'explica
en un o dos paràgrafs de prosa acabada, pensats per copiar-los
directament al treball escrit: què va passar, com es va resoldre i què
en vam aprendre. L'entrada més recent va al final.

---

## 1. Una API que decideix quan funciona: el 403 misteriós, els errors 502 i el naixement de la cau versionada

*2026-08-09*

El primer contacte amb un servei extern va ser un cop de realitat. Les
dades de les cartes surten d'una API gratuïta (pokemontcg.io), i la
primera vegada que li vam demanar les cartes va respondre amb un error
403 sense cap explicació. La causa era desconcertant per a algú que no
programa: el servidor bloquejava el "User-Agent" per defecte de Python
— és a dir, rebutjava la petició perquè el programa no es presentava
amb nom propi, com qui no obre la porta a un desconegut que no diu qui
és. Es va resoldre fent que l'script es presentés com "Pokedanex/1.0",
però tot seguit va aparèixer el segon problema: l'API queia de tant en
tant amb errors 502, sense avisar i sense motiu aparent. La dificultat
de debò no era tècnica sinó conceptual: entendre que no pots confiar
que una cosa d'internet estigui sempre disponible.

La solució va convertir el problema en virtut. Es va decidir que la web
no parlaria mai amb l'API en viu: treballa sempre contra còpies locals
datades (decisió D-003), i el botó "Actualitza dades" crea una versió
nova sense esborrar mai les anteriors. Així, si l'API cau, la web
continua funcionant amb l'última còpia bona — i, de regal, guardar
totes les versions amb data permet ensenyar al treball com evolucionen
els preus de les cartes al llarg del temps. La lliçó: quan depens d'un
servei que no controles, la resposta no és esperar que no falli, sinó
dissenyar perquè les seves fallades no t'afectin.

## 2. Dos forats de seguretat que ningú no hauria vist sol: per què revisem en capes

*2026-08-09*

En construir la funció d'importar còpies de seguretat (un fitxer JSON
amb la teva col·lecció, per no perdre-la mai), els agents revisors van
caçar dos forats de seguretat molt subtils: un fitxer manipulat a mà
que contingués identificadors especials com `__proto__` podia
corrompre el funcionament intern de la web. La idea costa d'explicar
i d'entendre: com pot ser que un simple fitxer de dades "ataqui" un
programa? Passa perquè, en JavaScript, alguns noms tenen un significat
reservat dins del llenguatge, i si un fitxer maliciós els fa servir com
si fossin cartes, el programa que el llegeix sense filtrar-los es pot
espatllar per dins. És el tipus d'error que un sol revisor — humà o
IA — hauria passat per alt perfectament, perquè el codi "es veu bé".

La resolució va venir del mètode, no de la sort: el projecte treballa
amb revisió per capes (un agent planifica, un altre construeix, dos
revisors independents auditen alhora, un arreglador diferent tapa el
que troben i un revisor final d'ulls frescos ho torna a mirar tot,
entrada 28 de l'històric), i va ser aquesta doble mirada la que va fer
aflorar els dos forats abans que el codi arribés a la branca principal.
La lliçó és el cor del treball: la persona no escriu codi, però el
mètode de revisió en capes és el que fa el resultat fiable — fins avui,
prop de trenta problemes caçats abans d'arribar a `main`.

## 3. El codi que semblava correcte però era impossible d'activar

*2026-08-10*

Quan es va convertir el zoom en la fitxa completa de la carta, el pla
original incloïa poder marcar cartes clicant directament sobre la
imatge gran (clic esquerre per sumar una còpia, clic dret per
restar-la). Es va construir, el codi era correcte i no donava cap
error... i els revisors van descobrir una cosa estranya: aquell codi
no es podia executar mai. El motiu era una trampa lògica: el zoom
només s'obria en mode Consulta, i en mode Consulta no hi ha cap
variant activa per marcar — de manera que la condició per activar el
marcatge des de la imatge no es podia complir de cap manera. És un
concepte que costa d'entendre si no programes: pot existir codi ben
escrit, sense errors, que simplement no serveix de res, i costa
moltíssim de veure perquè res no falla ni avisa.

Es va retirar aquell codi i van quedar els botons − / + de cada
variant dins de la fitxa, que fan la mateixa feina per un camí més
clar. La lliçó té dues cares: de vegades revisar no vol dir arreglar
sinó esborrar, i la solució més simple — si és suficient — sempre és
millor, perquè és més fàcil d'entendre, de mantenir i d'explicar.

## 4. Dues IA treballant alhora al mateix ordinador: branques, worktrees i el fitxer que hauria trencat la web

*2026-08-11*

Per entendre aquest repte cal entendre primer què és una branca de
git: imagineu un document compartit del qual cada equip es fa una
còpia per treballar-hi tranquil, i al final les còpies s'ajunten en
una de sola. El projecte havia arribat a un punt en què hi havia dues
sessions d'IA treballant alhora — una fent la campanya de millores per
a mòbil i l'altra afegint les dotze expansions noves — cadascuna a la
seva branca, però totes dues sobre la mateixa carpeta de l'ordinador.
I aquí va venir l'embolic: quan una sessió va canviar de branca a mig
vol, les feines de totes dues van quedar barrejades al mateix
directori, com dos cuiners remenant la mateixa olla amb receptes
diferents. Els fitxers de mòbil i els d'expansions es tocaven de
costat sense que cap de les dues sessions ho hagués volgut.

La sortida va ser aplicar dues eines professionals de git. La primera,
els *worktrees*: una segona carpeta de treball independent per a la
mateixa història del projecte — una cuina per a cada cuiner —, que va
permetre separar les dues feines fitxer a fitxer i que cada branca es
quedés només amb el que era seu. La segona, un *rebase* per reordenar
els canvis d'una branca sobre l'altra de manera neta. I en fer aquesta
separació va aparèixer el descobriment que fa el repte memorable: el
commit de la campanya mòbil s'havia deixat el fitxer `tocllarg.js` — un
fitxer que `main.js` i `album.js` importen — i sense ell la web sencera
hauria deixat de carregar en el moment de publicar-se. Va caldre un
commit exprés per afegir-lo, que queda a l'historial de git com a prova
("Afegir tocllarg.js que faltava"). La lliçó: el sistema de branques i
revisions no és burocràcia — és exactament el que va convertir un
embolic potencialment desastrós en un problema ordenat, detectable i
corregible abans que arribés a la web pública (i lliga amb els
conflictes de fusió de l'entrada 27 de l'històric).

## 5. Triar colors per càlcul i no per gust: el contrast WCAG dels temes d'expansió

*2026-08-11*

Cada expansió de la web té el seu color d'accent, inspirat en el seu
logotip o la seva portada, perquè el canvi d'expansió es noti i faci
goig. El
problema és que un color "bonic" pot ser perfectament il·legible: un
daurat clar sobre fons fosc pot quedar elegant i alhora impossible de
llegir per a molta gent. La dificultat va ser entendre que la
llegibilitat no és una opinió sinó una mesura: existeix un número, la
ràtio de contrast de les normes WCAG d'accessibilitat, que compara la
lluminositat del text i del fons, i que ha de ser com a mínim de
4,5:1. Dit d'una altra manera: la tria estètica passa per un filtre
matemàtic. Per a 13 dels 14 sets (tots menys Shrouded Fable, que ja
tenia el lila triat pel Pecharunt de la portada) es va extreure el
color dominant del logotip amb un petit script de Python i després es
va ajustar per càlcul — enfosquint-lo o aclarint-lo — fins que tots
els contrastos van quedar entre 6,2:1 i 12,5:1, força per sobre del
mínim.

La lliçó va més enllà dels temes de color, perquè el mateix filtre
s'havia aplicat ja a les pastilles de color dels tipus d'energia: en
accessibilitat no es discuteix de gustos, es calcula. És una idea potent per al treball — una web feta
sense saber programar pot complir normes professionals d'accessibilitat
precisament perquè la comprovació no depèn de l'ull de ningú, sinó
d'un número que qualsevol pot verificar.

---

*Aquest document queda obert: cada vegada que un procés nou sigui
difícil de fer o d'entendre, s'hi afegirà un repte (norma 8 del
CLAUDE.md).*

## 6. Quan la IA et porta la contrària: l'Eevee, el tipus Normal i l'Incolor

*2026-08-11*

Als videojocs de Pokémon, l'Eevee és de tipus Normal. Per això, quan la
web va mostrar la seva carta amb una pastilla que deia «Incolor», la
reacció natural va ser demanar a la IA que ho corregís — i es va demanar
dues vegades. En lloc d'obeir, l'assistent va anar a comprovar-ho a les
dades oficials de la carta: al joc de cartes no existeix el tipus Normal,
sinó els «tipus d'energia», i els Pokémon de tipus Normal hi porten
l'energia Incolor — l'estrella blanca que es veu impresa a la cantonada
de qualsevol Eevee físic. La web, que és de col·leccionisme de cartes,
havia de dir el que diu la carta, no el que diu el videojoc. Hi havia a
més un segon motiu de disseny: a la nostra web la paraula «normal» ja
identifica una de les tres variants de col·lecció (normal, reverse i
holo), i fer-la servir també per a un tipus hauria creat una confusió
permanent.

La lliçó d'aquest repte no és sobre cartes, sinó sobre el mètode: en el
«vibe coding» la persona mana, però un bon procés deixa que les proves
guanyin les discussions. La IA no va dir «no» — va portar les dades de
les dues cartes reals de l'Eevee, va explicar la diferència entre
videojocs i joc de cartes, i va deixar la decisió final a l'autora, que
va acceptar el canvi de criteri. Discrepar amb evidències, i poder-ho
comprovar un mateix, és una part tan important del mètode com escriure
codi que funcioni.

## 7. El zero enganyós: quan la font de preus va deixar de tenir preus

*2026-08-13*

Amb les expansions noves va aparèixer un error silenciós dels que costen
de veure: la web deia que completar Prismatic Evolutions costava 0,00 €,
i que la col·lecció que en tinguessis també valia zero. No era cap errada
de càlcul — el codi sumava perfectament — sinó un forat a les dades: la
font de preus europea (Cardmarket) que l'API ens proporciona estava
desactualitzada i simplement no tenia cap preu per als sets més nous. El
programa feia el que li havíem dit («suma els preus de Cardmarket»), i la
suma de cap preu és zero. La dificultat d'entendre era doble: primer, que
una web pot estar «bé» i alhora dir mentides si les dades que menja són
incompletes; i segon, que la solució no era arreglar cap línia trencada,
sinó decidir una política nova.

La decisió va ser una «cadena de reserva»: si Cardmarket no té el preu,
es fa servir el de TCGplayer — el mercat americà, que a l'API va més al
dia, tot i que només cobreix els sets nous que ja té llistats — convertit
de dòlars a euros amb una taxa fixa aproximada. I com que un preu
convertit no és exacte, la web ho confessa: els preus de reserva porten
el símbol «≈» i una explicació en passar-hi el ratolí, i els sets tan
nous que encara no tenen preu enlloc (quatre, ara mateix) mantenen el
guió i el recompte de «cartes sense preu». La lliçó per al treball:
davant de dades incompletes hi ha tres opcions — el zero enganyós,
l'aproximació honesta o el silenci — i la bona resposta gairebé sempre
és l'aproximació que diu la veritat sobre si mateixa.

## 8. Girar un full en una pantalla plana: el llibre que no hi és

*2026-11-03*

La vista d'àlbum de Pokedanex imita un carpesà obert, amb les butxaques
de plàstic i tot, però canviava de pàgina com canvia una diapositiva:
les cartes desapareixien i n'apareixien unes altres al mateix lloc, sense
cap moviment. El repte era fer-hi passar un full, i la dificultat de fons
és que una pantalla és plana i una pàgina web no té pàgines: és una
superfície contínua on les coses es poden moure amunt i avall, però no
«girar». El que sí que es pot fer és enganyar l'ull. Al navegador se li
pot dir que un tros de pàgina és un full de paper col·locat en un espai
amb profunditat, donar-li una cara i un dors, i fer-lo voltar sobre un
eix. L'eix és el que ho decideix tot: si el full volta pel mig sembla una
carta de la baralla que gira; perquè sembli un llibre, ha de voltar sobre
el llom. I el detall que acaba de convèncer no és cap càlcul de
geometria, sinó la llum: una ombra que enfosqueix el paper mentre
s'aixeca i el deixa tornar a la claror quan s'ajeu. Sense l'ombra, el
moviment és correcte i no s'ho creu ningú.

La sorpresa va venir en adonar-nos que l'àlbum ja era un llibre sense
saber-ho. Com que a l'ordinador se'n veuen dues pàgines alhora, passar de
les pàgines 1-2 a les 3-4 és exactament el que passa quan gires un full
de paper: el full que té la pàgina 2 a la cara té la 3 al dors, i en caure
cap a l'esquerra deixa la 3 a la vista i descobreix la 4 a sota.
L'animació, doncs, no havia d'inventar cap lògica nova; només havia de
dir en veu alta el que l'àlbum ja feia en silenci. L'última part del
repte va ser la menys vistosa i potser la més important: hi ha persones a
qui els moviments d'aquesta mena els provoquen mareig, i per això els
ordinadors i els mòbils tenen una opció d'accessibilitat que demana
reduir el moviment. La web la consulta i, si està activada, canvia de
pàgina sense cap gir. La mateixa prudència val per als navegadors antics
que no saben animar: l'efecte és una capa posada a sobre, i si no es pot
fer, la pàgina canvia igualment. La lliçó per al treball és que un
adorn mai no pot ser la condició perquè una cosa funcioni.

## 13. Dos servidors al mateix port: quan la correcció és bona i no es veu

*2026-11-10*

Arreglar les barres d'estadístiques del mòbil va ser canviar una línia. El
que va costar va ser creure's que la línia funcionava. Per provar el canvi
sense molestar una altra sessió de treball, la IA va engegar un segon
servidor local —el programa que serveix la web a l'ordinador mateix— en un
port diferent, el 8002. Un port és com el número de porta d'un edifici: el
navegador truca a una porta concreta i li respon qui hi hagi darrere. El que
la IA no sabia és que una altra sessió ja tenia un servidor a la mateixa
porta, i Windows, en lloc de queixar-se, va deixar que tots dos hi
escoltessin alhora. El navegador trucava i li responia l'altre, amb la
versió vella de la pàgina.

El resultat era desconcertant: el fitxer del disc tenia la correcció, el
navegador insistia que no, i la primera sospita —que la correcció estava
mal pensada— era falsa. La IA va trigar tres intents a deixar de mirar el
CSS i començar a mirar qui responia: va demanar a la pàgina que li
ensenyés el full d'estils que havia rebut, va veure que no era el del disc,
i va llistar els programes que escoltaven al port. N'hi havia dos. Amb un
port lliure, la mateixa línia va funcionar a la primera. La lliçó per al
treball és que, quan una prova contradiu el que hauria de passar, abans de
dubtar de la solució cal comprovar que s'està provant el que un es pensa.
