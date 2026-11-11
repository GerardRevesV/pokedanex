# Part I — Marc teòric: què és la programació per intenció

> ⚠️ **Nota de treball, per esborrar abans del lliurament.** Les fonts
> d'aquest text es recullen a `treball/fonts.md`, on consta quines s'han
> comprovat directament i quines falta tornar a verificar. Queda pendent una
> dada: el cost mensual de la subscripció de l'eina d'intel·ligència
> artificial, al capítol 4.

---

## 1. Del codi a la intenció: què és el *vibe coding*

### Què vol dir programar

Un ordinador no entén el que vol dir una persona: només executa
instruccions. I les executa exactament, sense interpretar-les ni afegir-hi
el que falti. Programar és escriure aquestes instruccions en un llenguatge
que la màquina pugui executar, com ara JavaScript o Python. Demana una
precisió que el llenguatge humà no demana mai: n'hi ha prou amb una coma
fora de lloc perquè el programa no funcioni, o perquè funcioni malament.

El que costa anys d'aprendre, però, no és la gramàtica del llenguatge. És
saber descompondre un problema en passos. «Calcula quant val la meva
col·lecció» no és una instrucció per a un ordinador. Cal convertir-ho en
passos exactes: buscar el preu de cada carta que l'usuari ha marcat,
multiplicar-lo per les còpies que en té, sumar-ho tot i ensenyar el
resultat en euros. I, sobretot, decidir què es fa amb les cartes de les
quals no se sap el preu.

Per a aquest treball importen **dues coses que fins ara no es podien
separar**: saber escriure codi i saber què ha de fer el programa. Qui volia
una pàgina web havia de dominar les dues, o pagar algú que dominés la
primera. La pregunta d'aquest treball és si avui es poden separar.

### L'origen del terme: una piulada del febrer del 2025

El terme té data i autor. El 2 de febrer del 2025, Andrej Karpathy va
publicar un missatge a la xarxa social X. Karpathy és un informàtic conegut
per la seva feina en intel·ligència artificial a OpenAI i a Tesla. El
missatge deia:

> «Hi ha una manera nova de programar que jo anomeno *vibe coding*, en què
> et deixes anar del tot amb les sensacions i t'oblides que el codi
> existeix.»

La piulada parlava també d'«abraçar les exponencials», que en el seu argot
vol dir confiar que aquestes eines milloren molt de pressa. Karpathy
explicava com ho feia ell. Parlava amb l'eina per veu i acceptava tots els
canvis que li proposava sense llegir-los. Quan sortia un error, el copiava i
l'enganxava a la conversa sense ni comentar-lo. Deia que això li servia per
a projectes petits de cap de setmana.

Hi ha un detall que és la clau de tot el treball: en el sentit original del
terme, fer *vibe coding* vol dir **no llegir el codi**. No és que la
persona no en sàpiga: és que decideix no mirar-lo.

### De paraula d'internet a paraula de l'any

El novembre del 2025, el diccionari Collins va proclamar *vibe coding*
**paraula de l'any**. La va triar entre les paraules que més s'havien fet
servir aquell any a la seva base de dades, que té 24.000 milions de
paraules. La definició que en dona és senzilla: fer servir la
intel·ligència artificial, parlant-hi amb paraules normals, per ajudar a
escriure codi. Els responsables del diccionari ho van resumir a la premsa
amb una altra frase: «és programar per sensacions, no per variables»
(segons la cobertura de premsa de l'anunci; Collins Dictionary, 2025).

### El terme en català: «programació per intenció»

En un treball escrit en català, aquest punt és important. El TERMCAT és el
centre de terminologia de la llengua catalana. El 26 de març del 2026 va
publicar un apunt en què explica que «s'ha fixat el terme **programació per
intenció**» com a equivalent català de *vibe coding* (TERMCAT, 2026).

El nom triat diu molt. L'anglès posa l'accent en les *sensacions* de qui
programa. El català se centra en la **intenció** que aquesta persona
expressa, que és el que passa de debò. El mateix apunt remarca que «la
persona usuària ja no necessita dominar tots els llenguatges de
programació» i que, per als professionals, «la tasca passa de redactar codi
des de zero a supervisar, ajustar i validar».

Cal una precaució: el TERMCAT proposa aquest nom, però encara no és un
terme aprovat oficialment. Per això aquest treball fa servir *programació
per intenció* com a forma catalana recomanada. I manté *vibe coding* en
cursiva quan parla del terme original o de la pràctica tal com la va
descriure Karpathy.

### El sentit estricte i el sentit ampli

Durant el 2025 i el 2026 el terme s'ha eixamplat. Avui molta gent en diu
*vibe coding* a qualsevol manera de programar amb ajuda de la
intel·ligència artificial, encara que el codi es llegeixi, es revisi i es
provi. Aquesta ambigüitat és un problema per a un treball que vol ser
precís. Aquí es resol distingint dos sentits del terme:

- **Sentit estricte** (el de Karpathy): descriure el que es vol i acceptar
  el codi resultant sense llegir-lo ni entendre'l.
- **Sentit ampli** (l'ús corrent i el de Collins): construir programari
  descrivint-lo en llenguatge natural a una intel·ligència artificial, amb
  més o menys supervisió.

Això permet situar el projecte amb precisió: **Pokedanex no és *vibe
coding* en sentit estricte.** Ningú no hi ha escrit codi, però tampoc no
s'hi ha acceptat res a cegues. El capítol 5 explica per què es va triar
aquest camí.

---

## 2. Com funciona la màquina que escriu el codi

No cal entendre la intel·ligència artificial per dins per fer-la servir,
igual com no cal entendre un motor per conduir. Però sí que cal
entendre'n una cosa, perquè explica tots els problemes que surten més
endavant en aquest treball: **com decideix la màquina què escriu**.

Les eines de què tracta aquest treball funcionen amb el que s'anomena un
**model de llenguatge**. Un model d'aquesta mena fa una sola operació,
repetida milions de vegades. A partir de tot el text que ha vist fins ara,
calcula quin és el tros de text més probable que vindria a continuació.
L'escriu i torna a començar. Ha après aquestes probabilitats llegint
quantitats enormes de text, i entre aquest text hi havia moltíssim codi
públic.

Això explica dues coses alhora.

**Per què escriu codi tan bé.** El codi és molt més repetitiu i molt més
ordenat que la prosa. Hi ha milions d'exemples públics de com es fa una
graella de cartes o com es calcula un total. Un model que endevina
continuacions probables hi té molta feina feta.

**Per què s'inventa coses.** El model no busca la veritat: busca la
continuació més probable. No té cap manera de saber que no sap una cosa.
Quan li falta la informació, la completa amb el que sona més creïble. Això
és el que s'anomena **al·lucinació**. No és una avaria: és el funcionament
normal del sistema en un cas en què no tenia la dada. Pot inventar-se una
funció que no existeix, una adreça web que no porta enlloc o un preu que
no és a les dades.

D'aquí surt la conseqüència pràctica més important de tot el treball:
**plausible no vol dir correcte**. El codi que genera una intel·ligència
artificial té l'aspecte d'un codi correcte, perquè s'ha après d'exemples
correctes. Que ho sigui de debò és una altra qüestió, i no es pot saber
mirant-lo per sobre. El capítol 15 recull els casos d'aquesta mena que van
aparèixer al projecte.

Hi ha un últim tret que convé saber: **la mateixa pregunta no dona mai la
mateixa resposta**. El model tria entre continuacions possibles, i no
sempre tria la mateixa. Si se li demana dues vegades seguides la mateixa
cosa, en fa dues versions diferents. En aquest projecte es va notar a cada
pas: demanar el mateix botó dos dies diferents no tornava el mateix codi.

Això canvia la manera de llegir aquesta recerca. En un experiment de
ciències, qualsevol persona que repeteixi els passos ha d'obtenir el mateix
resultat. Aquí no: qui repetís aquest projecte amb les mateixes
instruccions no tindria la mateixa pàgina, sinó una altra que s'hi
assembla. Per això el treball documenta el **mètode** (què es va demanar,
en quin ordre i què es va rebutjar) i no només el resultat. El resultat no
es pot repetir; el mètode, sí.

---

## 3. L'agent: què pot fer i què recorda

Un xat i un agent no són dues eines que facin el mateix d'una manera
diferent. El que canvia és **qui fa la feina**.

En un **xat**, la persona descriu el que vol i el model respon amb un bloc
de codi. La persona l'ha de copiar, enganxar al lloc correcte del seu
projecte, desar-lo i provar-lo. El model pensa, i les mans són humanes. Per
a un exercici petit funciona. Per a un projecte amb catorze fitxers que
depenen els uns dels altres, és esgotador.

Un **agent** és el mateix model, però amb **eines** i amb permís per fer-les
servir. Pot llistar els fitxers d'una carpeta, llegir-los, escriure-hi,
executar ordres a l'ordinador o obrir un navegador. I, sobretot, treballa
en **bucle**: decideix una acció, la fa, **observa el resultat** i decideix
la següent a partir del que ha vist. Si el canvi que acaba de fer provoca
un error a la pàgina, l'agent pot obrir-la, llegir el missatge d'error,
deduir-ne la causa, corregir el fitxer i tornar-ho a provar. Tot això,
sense que hi intervingui cap persona.

Aquest bucle és el que canvia les coses. Programar no és només escriure:
és escriure, provar, trobar què no funciona i tornar-hi. D'aquestes quatre
feines, un xat només en fa la primera, i les altres tres queden per a la
persona. Un agent les fa totes quatre: escriu el codi, obre la pàgina, veu
que el botó no respon i ho arregla.

Per això es pot plantejar la pregunta d'aquest treball. A qui no programa
no se li demana que escrigui, ni que provi, ni que esmeni. Se li demana que
digui què vol i que miri si el que ha sortit és el que volia. Decidir i
jutjar són les dues feines que queden a mans de la persona, i cap de les
dues demana saber programar.

### Subagents i receptes guardades

Un agent pot engegar **altres agents**, anomenats subagents. Els encarrega
una tasca concreta perquè la facin pel seu compte i només li tornin la
conclusió. Serveix per a dues coses. La primera és la **concentració**:
cada subagent comença de zero, amb una sola feina i sense el soroll de la
conversa anterior. La segona és el **paral·lelisme**: diversos subagents
poden treballar alhora en parts diferents del mateix problema. El capítol
10 explica el cas més gran del projecte, en què trenta agents van trobar i
corregir vuitanta-nou problemes de la versió mòbil de la pàgina.

També es pot deixar escrita una **recepta**, que en aquestes eines es diu
*skill*. Són els passos d'una feina que es repeteix, i l'agent els llegeix
i els segueix tot sol. En aquest projecte, els passos per afegir una
expansió nova de cartes es van escriure una sola vegada en un document, en
lloc d'explicar-los cada cop.

### Què recorda un agent

Quan es parla d'aquestes eines, la paraula «memòria» vol dir dues coses
diferents. Val la pena separar-les, perquè totes dues surten en aquest
treball.

**La finestra de context** és el que el model pot tenir al davant en un
moment determinat: la conversa sencera i el contingut de tots els fitxers
que ha llegit. És gran, però **finita**. Quan s'omple, el més antic s'ha de
resumir o descartar, i això vol dir que l'agent **oblida**. Explica un
comportament que sorprèn molt al principi: una eina que semblava entendre
perfectament el projecte, al cap d'una sessió llarga, torna a fer preguntes
que ja estaven resoltes.

**La memòria escrita del projecte** és l'única que dura. La finestra de
context s'esborra entre sessions, de manera que la memòria real viu en
fitxers. En aquest projecte és un document amb les regles del joc, que
l'agent llegeix al començament de cada sessió. Per això les regles es van
posar per escrit el primer dia de feina amb la web. No és burocràcia: és
l'única manera que una decisió duri més que la sessió en què es va prendre.

D'aquí surt una conseqüència que al projecte va costar d'aprendre. Amb
aquestes eines es pot tenir **més d'una conversa oberta alhora**, i de
vegades convé: mentre una s'ocupa de l'àlbum, l'altra arregla els preus.
Però cada conversa té la seva finestra de context i no veu la de l'altra.
Cap de les dues sap què fa la companya. Mentre toquen fitxers diferents, no
passa res. El dia que totes dues van escriure al mateix document del
projecte, cadascuna hi va posar la seva versió i van quedar dues entrades
amb el mateix número. El capítol 11 explica com es va resoldre.

---

## 4. El panorama d'eines

Dir «fer una web amb intel·ligència artificial» encara no diu gairebé res.
Hi ha almenys quatre famílies d'eines que ho permeten, de maneres molt
diferents. La classificació que segueix és pròpia. Els noms d'eines surten,
en part, de l'article de panorama de l'Institut de Ciències de l'Educació
de la Universitat de Girona (ICE Josep Pallach, 2026).

| Família | Exemples | Com funciona | El seu límit |
|---|---|---|---|
| Xats generalistes | ChatGPT, Claude, Gemini | La persona demana i copia el codi al seu projecte | Ha de fer de missatger entre el xat i els seus fitxers |
| Agents de codi | Claude Code, Cursor, GitHub Copilot | Treballen dins del projecte: llegeixen i escriuen els fitxers i comproven el resultat | Cal entendre mínimament què està passant |
| Generadors d'aplicacions amb IA | Lovable, Replit i similars | Es descriu l'aplicació i l'eina la construeix i l'allotja | Menys control; gratuïtes fins a un límit i de pagament si en vols més |
| Eines clàssiques sense codi | Wix, WordPress | La persona munta la pàgina ajuntant blocs ja fets | No arriben quan es vol una cosa a mida |

L'article de l'ICE hi afegeix un avís que convé recordar: «el *vibe coding*
no substitueix la programació tradicional».

La idea que aquestes eines obren la porta a qui no programa no se l'ha
inventada aquest treball. També ho diu l'administració. El Departament
d'Educació de la Generalitat de Catalunya hi dedica material propi per als
mestres i ho explica així: permet «als docents crear aplicacions educatives
sense tenir coneixements de programació» (Departament d'Educació, 2025). És
a dir, la pregunta d'aquest treball ja se la fa qui ha de decidir què
s'ensenya a les escoles.

### Què fa servir tothom, i qui se'n refia

Stack Overflow és una de les comunitats de programadors més grans del món,
i cada any fa una enquesta. La del 2025 diu que el **84 %** dels que van
respondre fan servir o pensen fer servir eines d'intel·ligència artificial.
L'any anterior eren el 76 %. Però la dada més interessant va en direcció
contrària: **com més es fan servir, menys se'n refia la gent**. Els que
diuen que se'n refien han passat del **43 % al 33 %** en un any (Stack
Overflow, 2025).

Aquestes dues xifres juntes retraten el problema que aquest treball es
troba a la part pràctica. L'eina és prou bona perquè gairebé tothom la faci
servir, i prou poc fiable perquè qui la fa servir cada dia se'n refiï cada
vegada menys. I si els professionals, que saben llegir el codi, se'n refien
poc, qui no programa encara té menys manera de saber si el que li ha sortit
és bo. D'aquí surt el mètode de revisió que explica la Part II.

### Per què aquest projecte va triar un agent de codi

La tria de l'eina està documentada a les decisions del projecte, i té dos
motius. El primer és que un agent que treballa sobre els fitxers de debò
permet **controlar i revisar** el que fa. Un generador que ho amaga tot no
ho permet. El segon és que tot el procés queda **registrat** a l'historial
de canvis i als documents del projecte. En un treball de recerca, el procés
és la matèria primera: amb un generador d'aplicacions hi hauria una web,
però no hi hauria cap història per explicar.

Sobre el cost: la despesa en serveis externs (allotjament, dades de cartes
i repositori) ha estat de **0 €**, perquè tots tenen una modalitat
gratuïta. El cost de la subscripció de l'eina d'intel·ligència artificial
es detalla al capítol 22.

---

## 5. Què diu la recerca sobre si això funciona

Un treball que es pregunta si es pot fer una web útil sense saber programar
ha de començar mirant què s'ha mesurat ja. I el que s'ha mesurat, el 2025 i
el 2026, és molt menys clar del que fan pensar les xarxes socials.

**El codi generat funciona, però és menys segur.** L'empresa de seguretat
Veracode va demanar a més de cent models d'intel·ligència artificial que
resolguessin vuitanta feines de programació. Les havia triat perquè és
fàcil deixar-hi forats de seguretat. Va trobar que aproximadament el
**45 %** del codi generat en tenia algun. I la conclusió que en treu fa
pensar: amb els anys el codi generat funciona cada vegada millor, però no
és cada vegada més segur (segons la nota de premsa de Veracode, 2025).

**I deixa un codi més difícil de mantenir.** L'empresa GitClear va analitzar
211 milions de línies de codi modificades entre el 2020 i el 2024. Va veure
que el **codi repetit s'ha multiplicat per quatre** (GitClear, 2025). Dit
planerament: es genera molt codi i s'endreça poc, i el resultat és un
programa que cada vegada costa més de tocar. Cal saber que GitClear ven
eines d'aquest sector. Això no invalida les dades, però aconsella
prudència.

**I la gent es pensa que va més de pressa del que va.** El 2025
l'organització METR va fer un experiment amb setze programadors
experimentats. Feien feines reals dels seus propis projectes. A sorts, en
unes podien fer servir la intel·ligència artificial i en altres no. Abans
de començar estaven convençuts que amb l'eina anirien més de pressa. Va
passar el contrari: amb l'eina hi dedicaven un **19 % més** de temps. A
més, es pensaven que l'eina els havia ajudat molt més del que els havia
ajudat, amb una diferència de 40 punts percentuals de mitjana (METR, 2025).

Aquesta dada demana tres precaucions.

**Primera, de rigor.** Només eren setze persones, i els números que van
sortir no són prou clars per donar-los per segurs.

**Segona, i la més decisiva per llegir l'estudi: la data.** Les eines que es
van mesurar són les de principis del 2025, de fa diverses generacions de
models. El camp ha canviat tant que el mateix estudi ja no es pot fer. METR
el va repetir a partir de l'agost del 2025. El febrer del 2026 va anunciar
que canviarà el disseny de l'experiment, perquè els resultats ja no
permeten afirmar ni que l'eina freni ni que acceleri. Un dels motius que
dona és revelador: entre el **30 % i el 50 %** dels programadors
renunciaven a enviar feines perquè no les volien fer sense intel·ligència
artificial. Un d'ells no va completar ni una de les que li havien tocat
sense l'eina (METR, 2026). En poc més d'un any, aquestes eines havien
passat de frenar els experts a ser una cosa sense la qual bona part dels
participants no volien treballar.

**Tercera, i la més important per a aquest treball: les condicions d'aquell
estudi són les contràries a les d'aquest projecte.** Allà hi havia experts
que tocaven codi antic i complex que ja dominaven. Aquí hi ha una persona
sense coneixements previs que comença un projecte nou i petit. Per això
l'estudi de METR no refuta la hipòtesi d'aquest treball: en marca el límit.
Diu que aquestes eines no són una drecera per a qui ja en sap. No exclou
que siguin una porta d'entrada per a qui no en sap.

### Què se'n deriva per a aquest treball

Llegides juntes, aquestes dades diuen una cosa bastant coherent: **la
intel·ligència artificial escriu codi que funciona, però no escriu codi
fiable tota sola**. El problema no és que no en sàpiga. És que no té cap
manera de saber què no sap, i qui no llegeix el que ha generat la màquina
tampoc no en té. El programador Simon Willison, una de les veus més citades
d'aquest debat, ho diu així: «arribar a un codi en producció a base de
*vibe coding* és clarament una idea terrible» (Willison, 2025, traducció
pròpia). «En producció» vol dir un programa que la gent fa servir de debò.

Aquesta conclusió és la que va decidir el mètode de treball del projecte. I
converteix el treball en una cosa més interessant que una demostració: en
una **predicció comprovable**. Si la recerca té raó, un projecte fet
deixant-se anar, en el sentit estricte de Karpathy, hauria d'acabar amb
forats de seguretat i amb codi que ningú no entén. La resposta del projecte
va ser no deixar-se anar, i afegir capes de revisió entre la generació del
codi i la seva publicació. La Part II explica com es va fer, i la Part IV,
què s'hi va trobar.

Que no hi hagi mesures fiables de les eines d'avui també afecta el valor
d'aquest treball. Un projecte documentat pas a pas, amb xifres reals de
temps, de cost i d'errors trobats, **no és només una anècdota**. És una
manera modesta, però real, d'aportar alguna cosa a un terreny on encara
gairebé no s'ha mesurat res.
