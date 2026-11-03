# Part I — Marc teòric: què és això del vibe coding

> **Estat:** primer esborrany, per revisar i fer teu. Totes les dades i
> citacions d'aquest text estan referenciades a `treball/fonts.md`, on
> consta també quines fonts s'han comprovat directament i quines caldrà
> tornar a verificar abans del lliurament definitiu.

---

## 1. Programar: què vol dir, de debò

Un ordinador no entén el que vol dir una persona: només executa
instruccions. I les executa exactament, sense interpretar-les ni suplir el
que falti. Programar és escriure aquestes instruccions en un llenguatge que
la màquina pugui executar —JavaScript, Python, Java i centenars més—, i fer-ho
amb una precisió que el llenguatge humà no demana mai.

Aquesta precisió té tres nivells. El primer és el **vocabulari**: cada
llenguatge té les seves paraules i les seves ordres, i cal conèixer-les. El
segon és la **sintaxi**, que és la gramàtica del llenguatge: una coma fora de
lloc, un parèntesi sense tancar o una lletra majúscula on toca una minúscula
i el programa no funciona, o pitjor, funciona malament. El tercer nivell, i
el que de debò costa anys, és **saber partir un problema en passos**. Dir
«calcula quant val la meva col·lecció» no és una instrucció per a un
ordinador; cal convertir-ho en: recórrer totes les cartes que l'usuari ha
marcat, buscar per a cadascuna el preu de la variant corresponent,
comprovar si aquest preu existeix, multiplicar-lo pel nombre de còpies,
sumar-ho tot i mostrar el resultat amb dos decimals i el símbol de l'euro.
Aquesta traducció —d'una intenció humana a una seqüència exacta de passos—
és l'ofici del programador.

Per a aquest treball, el que importa és una distinció que
tradicionalment no es podia separar: **saber escriure codi** i **saber què
ha de fer el programa**. Qui volia una pàgina web havia de dominar les dues
coses, o contractar algú que dominés la primera. La pregunta que investiga
aquest treball és si avui es poden separar: si una persona que té molt clar
què vol, però que no sap escriure ni una línia de codi, pot acabar tenint
una pàgina web que funcioni de debò.

La idea no és nova com a intuïció. Ja el 2023, l'informàtic Andrej Karpathy
va escriure una frase que es va fer coneguda: «el llenguatge de programació
nou més de moda és l'anglès» (Karpathy, citat a Viquipèdia, 2026). El que
ha canviat des de llavors no és la intuïció, sinó que les eines han arribat
al punt de fer-la practicable.

---

## 2. Què és el vibe coding

### L'origen: una piulada del febrer del 2025

El terme té data i autor. El 2 de febrer del 2025, Andrej Karpathy
—informàtic conegut per la seva feina en intel·ligència artificial a OpenAI
i a Tesla— va publicar a la xarxa social X un missatge que començava així:

> «Hi ha una manera nova de programar que jo anomeno *vibe coding*, en què
> et deixes anar del tot amb les sensacions, abraces les exponencials i
> t'oblides que el codi existeix.»
>
> — Andrej Karpathy, X, 2 de febrer del 2025

El missatge continuava explicant com ho feia ell: parlava amb l'eina per
veu, acceptava tots els canvis que li proposava sense llegir-los, i quan
sortia un error el copiava i l'enganxava a la conversa sense ni comentar-lo.
Deia també que això li servia per a «projectes de cap de setmana per
llençar» (Viquipèdia, 2026).

Val la pena aturar-se en aquest detall, perquè és la clau de tot el treball:
en el sentit original del terme, fer *vibe coding* vol dir **no llegir el
codi**. No és que la persona no en sàpiga: és que decideix no mirar-lo i
confiar en el resultat.

### De paraula d'internet a paraula de l'any

En poc temps el terme va saltar de les comunitats tècniques al llenguatge
general. El novembre del 2025, el diccionari Collins va proclamar *vibe
coding* **paraula de l'any**, triada entre els termes que més havien crescut
dins el seu corpus de 24.000 milions de paraules, per davant de candidates
com *clanker*, *glaze* o *aura farming* (Collins Dictionary, 2025). La
definició que en dona Collins és deliberadament sòbria: «l'ús de la
intel·ligència artificial, estimulada mitjançant llenguatge natural, per
ajudar a escriure codi informàtic». La frase amb què els seus lexicògrafs ho
van resumir a la premsa és més memorable: «és programar per sensacions, no
per variables».

El diccionari Merriam-Webster també hi va donar entrada, en el seu apartat
d'argot (Merriam-Webster, 2025). Dit d'una altra manera: en menys d'un any,
una expressió improvisada en una piulada havia entrat als diccionaris.

### El terme en català: «programació per intenció»

Per a un treball escrit en català, aquest punt té importància pròpia. El
TERMCAT —el centre de terminologia de la llengua catalana— va publicar el
26 de març del 2026 un apunt en què explica que «s'ha fixat el terme
**programació per intenció**» com a equivalent català de *vibe coding*
(TERMCAT, 2026).

L'elecció del nom no és capritxosa i diu molt: mentre l'anglès posa el focus
en les *sensacions* de qui programa, el català posa el focus en la
**intenció** que aquesta persona expressa. I això descriu millor el que
passa de debò, perquè el que fa la persona és declarar un propòsit. El
mateix apunt del TERMCAT remarca que «la persona usuària ja no necessita
dominar tots els llenguatges de programació» i que, per als professionals,
«la tasca passa de redactar codi des de zero a supervisar, ajustar i
validar».

Cal una precaució honesta: l'apunt diu que el terme «s'ha fixat», però no
consta que el Consell Supervisor del TERMCAT l'hagi **normalitzat**
formalment ni apareix a la Neoloteca. Per tant, en aquest treball es fa
servir *programació per intenció* com la forma catalana recomanada, i es
manté *vibe coding* en cursiva quan es parla del terme original o de la
pràctica tal com la va descriure Karpathy.

### El sentit estricte i el sentit ampli

Al llarg del 2025 i el 2026 el terme s'ha eixamplat. Avui molta gent en diu
*vibe coding* a qualsevol manera de programar amb ajuda de la
intel·ligència artificial, encara que el codi es llegeixi, es revisi i es
provi. Aquesta ambigüitat és un problema per a qualsevol treball que vulgui
dir alguna cosa precisa, i aquí es resol distingint-ne dos sentits:

- **Sentit estricte** (el de Karpathy): descriure el que es vol i acceptar
  el codi resultant sense llegir-lo ni entendre'l.
- **Sentit ampli** (l'ús corrent i el de Collins): construir programari
  descrivint-lo en llenguatge natural a una intel·ligència artificial, amb
  més o menys supervisió.

Aquesta distinció permet situar amb precisió el projecte d'aquest treball, i
convé dir-ho ja d'entrada: **Pokedanex no és *vibe coding* en sentit
estricte.** Ningú no ha escrit codi a mà, cert, però tampoc no s'ha acceptat
res a cegues: cada bloc de feina ha passat per diverses capes de revisió
abans d'arribar a la versió pública de la web. Per què es va triar aquest
camí, i no el de deixar-se anar, és precisament el que explica el capítol 7
d'aquesta part.

---

## 3. Com funciona la màquina que escriu el codi

No cal entendre la intel·ligència artificial per dins per fer servir aquestes
eines, igual com no cal entendre un motor d'explosió per conduir. Però sí
que cal entendre'n una cosa, perquè explica tots els problemes que apareixen
més endavant en aquest treball: **com decideix la màquina què escriu**.

Les eines de què parlem funcionen amb un **model de llenguatge gran** (en
anglès, *large language model* o LLM). Un model d'aquesta mena fa una sola
operació, repetida milions de vegades: donat tot el text que ha vist fins
ara, calcula quin és el fragment de text més probable que vindria a
continuació, l'escriu, i torna a començar. Aquests fragments s'anomenen
**tokens** i són més petits que una paraula: una paraula llarga pot ocupar
dos o tres tokens. El model ha après aquestes probabilitats llegint
quantitats enormes de text, i entre aquest text hi havia moltíssim codi
públic.

Això explica dues coses alhora.

**Per què escriu codi tan bé.** El codi és, en comparació amb la prosa, molt
més repetitiu i molt més estructurat. Hi ha milions d'exemples públics de com
es fa una graella de cartes, com es llegeix un fitxer de dades o com es
calcula un total. Un model que endevina continuacions probables es troba en
un terreny còmode.

**Per què s'inventa coses.** El model no busca la veritat: busca la
continuació més plausible. No té cap mecanisme per saber que no sap una
cosa, de manera que, quan li falta la informació, la completa amb el que
*faria patxoca*. Això és el que s'anomena **al·lucinació**, i no és una
avaria: és el funcionament normal del sistema aplicat a un cas en què no
tenia la dada. Pot inventar-se una funció que no existeix, una adreça web
que no porta enlloc o un preu que no és a les dades.

D'aquí surt la conseqüència pràctica més important de tot aquest treball,
que es repetirà a cada capítol de la part de metodologia: **plausible no
vol dir correcte**. Un codi generat per intel·ligència artificial té
exactament l'aspecte que ha de tenir un codi correcte, perquè s'ha après
d'exemples correctes. Que ho sigui de debò és una altra qüestió, i no es pot
saber mirant-lo per sobre. Al projecte Pokedanex en van aparèixer dos casos
de llibre: un tros de codi que semblava perfectament raonable i que era
impossible d'activar perquè mai no s'arribava a executar, i una afirmació
sobre el tipus elemental de l'Eevee que la màquina va defensar amb seguretat
i que era equivocada (vegeu els reptes 3 i 6 del projecte).

Hi ha un últim tret que convé saber: **aquests sistemes no són
deterministes**. Si es fa la mateixa pregunta dues vegades, les dues
respostes seran diferents. Això té implicacions per a qualsevol recerca que
els faci servir: un resultat no es pot reproduir exactament, només
aproximadament.

---

## 4. D'un xat a un agent

Entre demanar codi a un xat i treballar amb un agent hi ha més diferència
que entre dues eines: hi ha un canvi de qui fa la feina.

En un **xat** convencional —ChatGPT, Claude o Gemini al navegador— la
persona descriu el que vol, el model respon amb un bloc de codi, i la
persona ha de copiar-lo, enganxar-lo al lloc correcte del seu projecte,
desar-lo, provar-lo, i si surt un error tornar al xat a explicar-lo. El
model pensa; les mans són humanes. Per a un exercici petit funciona; per a
un projecte amb catorze fitxers que es criden entre ells, és esgotador i
propens a errors.

Un **agent** és el mateix model, però amb **eines** i amb permís per
utilitzar-les: pot llistar els fitxers d'una carpeta, llegir-ne el contingut,
escriure-hi, executar ordres a l'ordinador, consultar internet o obrir un
navegador. I, sobretot, treballa en **bucle**: decideix una acció, la fa,
**observa el resultat** i decideix la següent a partir del que ha vist. Si
el canvi que acaba de fer provoca un error a la pàgina, l'agent pot obrir la
pàgina, llegir el missatge d'error a la consola, deduir-ne la causa,
corregir el fitxer i tornar a provar-ho, tot sense intervenció humana.

Aquest bucle és el canvi de fons, perquè trasllada a la màquina la part de
l'ofici que no és escriure: comprovar. I és el que fa possible la pregunta
d'aquest treball, perquè la persona pot quedar-se en el paper de dir què vol
i de jutjar si el resultat és bo.

### Subagents: repartir la feina

Un agent pot obrir **altres agents** —els anomenem subagents— i encarregar-los
una tasca concreta i tancada, perquè la facin pel seu compte i només li
tornin la conclusió. Serveix per a dues coses. La primera és la
**concentració**: cada subagent comença de zero, amb una única feina i sense
tot el soroll de la conversa anterior, i això el fa més precís. La segona és
el **paral·lelisme**: diversos subagents poden treballar alhora sobre
aspectes diferents del mateix problema.

Al projecte Pokedanex, l'exemple més clar d'aquesta manera de treballar va
ser la revisió de la visualització al mòbil: tres rondes de vuit
«exploradors», cada un encarregat d'un aspecte concret —la capçalera, la
graella, l'àlbum, els diàlegs, el funcionament tàctil, la tipografia, el
rendiment i una revisió transversal—, seguides cadascuna d'un agent que
arreglava el que havien trobat i d'un altre que ho revisava. En total, trenta
agents i vuitanta-nou problemes reals corregits.

### Skills: ensenyar un procediment

Hi ha un tercer element que convé presentar aquí perquè és un concepte propi
d'aquestes eines: una **skill** és un procediment escrit que l'agent llegeix
quan la tasca encaixa. En comptes d'explicar cada vegada els vuit passos que
cal seguir per afegir una expansió nova de cartes al projecte, es deixen
escrits una sola vegada en un document i l'agent els segueix. És
l'equivalent, en aquest context, del protocol escrit d'una feina repetitiva.

---

## 5. La memòria d'un agent

La paraula «memòria» és una de les que més confusió generen en aquest camp,
perquè designa tres coses diferents que, a més, es confonen fàcilment amb una
quarta que no té res a veure. Val la pena separar-les, perquè totes quatre
apareixen en aquest treball.

**1. La finestra de context.** És el que el model pot «tenir al davant» en un
moment donat: la conversa sencera més el contingut de tots els fitxers que ha
llegit. És gran, però **finita**. Quan s'omple, el que hi ha de més antic
s'ha de resumir o descartar, i això vol dir que l'agent **oblita**. És
l'explicació d'un comportament que sorprèn molt al principi: una eina que
semblava entendre perfectament el projecte, al cap d'una sessió llarga,
comença a repetir preguntes ja resoltes.

**2. La memòria escrita del projecte.** Com que la finestra de context
s'esborra entre sessions, l'única memòria que de debò perdura és la que
queda **escrita en fitxers**. En aquest projecte, el fitxer `CLAUDE.md`
conté les regles del joc —no escriure codi a mà, pressupost màxim, treballar
en català, documentar-ho tot— i l'agent el llegeix al començament de cada
sessió. Per això les regles es van posar per escrit el primer dia: no és
burocràcia, és l'únic mecanisme perquè una decisió sobrevisqui a la sessió
en què es va prendre.

**3. La cau de context.** És una optimització tècnica del servei: el
començament d'una conversa, que ja ha estat processat, es guarda perquè no
calgui tornar-lo a processar a cada missatge. Fa que la conversa sigui més
ràpida i més barata, però **no amplia el que l'agent recorda**. És fàcil
confondre-ho amb la memòria, i no ho és.

**4. I, finalment, el que no és memòria de l'agent: la cau de dades de la
web.** El projecte Pokedanex guarda una còpia pròpia de les dades de les
cartes dins del repositori, organitzada per versions, perquè la pàgina no
depengui que l'API externa estigui disponible en aquell moment. És una
decisió de disseny de la web (la decisió D-003 del projecte) i no té cap
relació amb la memòria del model. Les dues coses es diuen «cau» i són
completament diferents: confondre-les és l'error més fàcil de cometre quan
s'explica aquest projecte.

### La prova que la memòria viu als fitxers

Aquesta distinció no és teòrica: el projecte en té una demostració. Durant
unes setmanes hi va haver **dues sessions d'intel·ligència artificial
treballant alhora** en branques separades del mateix projecte. Cada una
sabia només el que havia fet ella: no compartien finestra de context ni cap
altra forma de memòria. Totes dues van escriure als mateixos documents de
documentació i, en ajuntar les feines, el sistema de control de versions va
avisar del xoc —fins al punt que hi va haver dues entrades numerades igual.

La lliçó és doble. Primera: **la memòria d'un projecte no és a la màquina,
és als fitxers**, i per això documentar-ho tot no és una manca de confiança
sinó una necessitat tècnica. Segona: fer treballar dues intel·ligències
artificials en paral·lel planteja exactament els mateixos problemes de
coordinació que fer treballar dues persones, i es resol amb les mateixes
eines, que és el que explica la part de metodologia.

---

## 6. El panorama d'eines

Dir «fer una web amb intel·ligència artificial» no diu encara gairebé res,
perquè hi ha almenys quatre famílies d'eines que permeten fer-ho de maneres
molt diferents.

**Els xats generalistes** (ChatGPT, Claude, Gemini) són el punt d'entrada
més habitual. Tenen versions gratuïtes, no cal instal·lar res i serveixen
per aprendre i per a peces petites. L'inconvenient ja s'ha explicat: la
persona ha de fer de missatger entre el xat i els seus propis fitxers.

**Els agents de codi** (Claude Code, Cursor, GitHub Copilot) treballen dins
del projecte: llegeixen i escriuen els fitxers de debò, executen ordres i
comproven el resultat. És la família que fa servir aquest treball.

**Els generadors d'aplicacions per intel·ligència artificial** (Lovable, v0,
Bolt, Base44, Replit) van un pas més enllà en comoditat: es descriu
l'aplicació, i l'eina la construeix i l'allotja a internet ella mateixa. És
el camí més ràpid per veure alguna cosa funcionant, a canvi de menys control
sobre el resultat, i acostumen a funcionar amb un model *freemium* en què la
versió gratuïta té límits. L'article de l'Institut de Ciències de l'Educació
de la Universitat de Girona que descriu aquest panorama assenyala precisament
aquesta combinació: xats per dissenyar i plataformes per publicar, i una
advertència que convé retenir —«el *vibe coding* no substitueix la
programació tradicional» (ICE Josep Pallach, 2026).

**Les eines sense codi clàssiques** (Wix, WordPress, Webflow) són les més
antigues i no necessiten intel·ligència artificial: la persona munta la
pàgina ajuntant blocs ja fets. Van molt bé per a una web de presentació i
es queden curtes quan el que es vol és una cosa a mida, com calcular el
valor d'una col·lecció de cartes a partir de preus que canvien.

### Què fa servir tothom

L'enquesta anual de Stack Overflow —la comunitat de programadors més gran
del món— dona una fotografia útil de l'any 2025: el **84 %** dels
participants fan servir o pensen fer servir eines d'intel·ligència
artificial, enfront del 76 % de l'any anterior, i la meitat dels
professionals les fan servir cada dia. Entre les eines concretes, Cursor
apareix amb un 18 % d'ús i Claude Code amb un 10 % (Stack Overflow, 2025).

El mateix estudi conté una dada que va en direcció contrària i que és la més
interessant de totes: **la confiança baixa mentre l'ús puja**. El 46 % dels
enquestats desconfia de l'exactitud del que produeixen aquestes eines i
només el 33 % se'n refia —eren el 43 % l'any anterior—, i l'opinió favorable
general ha caigut del 72 % al 60 % en un any. La gent les fa servir cada cop
més i se'n refia cada cop menys.

### Per què aquest projecte va triar un agent de codi

La tria d'eina d'aquest treball està documentada a les decisions del
projecte, i els motius són tres. El primer és que un agent que treballa
sobre els fitxers de debò permet **controlar i revisar** el que fa, cosa que
un generador que ho amaga tot no permet. El segon és que tot el procés queda
**registrat** al sistema de control de versions i als documents del
projecte, i en un treball de recerca el procés és la matèria primera: amb un
generador d'aplicacions hi hauria una web, però no hi hauria història que
explicar. El tercer és el **cost**: el projecte s'havia fixat un sostre de
20 € al mes i el que s'ha acabat gastant en serveis és 0 €.

Aquesta tria també imposa un límit que cal reconèixer: com que no s'ha fet
la mateixa web amb un generador com Lovable, aquest treball **no pot afirmar
que el camí triat sigui el més ràpid**, només que és el que permet explicar
i verificar el que ha passat.

---

## 7. Què diu la recerca sobre si això funciona

Un treball que es pregunta si es pot fer una web útil sense saber programar
ha de començar per mirar què s'ha mesurat ja. I el que s'ha mesurat, el 2025
i el 2026, dibuixa un panorama molt més matisat que l'entusiasme de les
xarxes socials.

**El codi generat funciona, però és menys segur.** L'informe *GenAI Code
Security Report* de l'empresa de seguretat Veracode va posar més de cent
models de llenguatge davant de vuitanta tasques de programació
dissenyades per destapar les debilitats catalogades al sistema CWE, i va
trobar que aproximadament el **45 %** del codi generat contenia alguna
vulnerabilitat de seguretat. El llenguatge Java va ser el pitjor, amb un
índex de fallada per damunt del 70 %. La conclusió que l'informe en treu és
la que més hauria de fer pensar: la qualitat **funcional** del codi generat
ha anat millorant amb els anys, mentre que la seguretat no ha seguit el
mateix camí (Veracode, 2025).

**I és més car de mantenir.** L'anàlisi de GitClear sobre 211 milions de
línies modificades entre el 2020 i el 2024 detecta que la pràctica de
reescriure el codi per simplificar-lo ha caigut de representar el 25 % de
les línies canviades a menys del 10 %, mentre que el codi duplicat s'ha
multiplicat per quatre. Dit en pla: es genera molt, s'endreça poc, i el
resultat és un programa que cada vegada costa més de tocar.

**I la gent es pensa que va més de pressa del que va.** L'estudi més
incòmode de tots és un assaig controlat de l'organització METR, publicat el
10 de juliol del 2025: setze programadors experimentats van fer 246 tasques
reals als seus propis projectes, amb l'eina d'intel·ligència artificial
permesa o prohibida a l'atzar. Abans de començar esperaven anar un 24 % més
de pressa. El resultat mesurat va ser que les tasques els duraven un **19 %
més** amb l'eina (METR, 2025). I el més revelador no és la xifra, sinó el
desajust que l'acompanyava: segons els mateixos autors, les persones van
sobreestimar l'efecte de la intel·ligència artificial sobre el seu temps
**en 40 punts percentuals de mitjana**.

Aquesta dada demana tres precaucions.

**Primera, de rigor.** La mostra és petita —setze persones—, l'interval de
confiança és ampli i els mateixos autors admeten que hi podria haver un
efecte d'aprenentatge que només apareix després de centenars d'hores d'ús.

**Segona, i la més important: la data.** Les eines que es van mesurar són
les de principis del 2025, diverses generacions de models enrere, i el camp
s'ha mogut tant que el mateix estudi ha deixat de poder-se fer. METR el va
repetir a partir de l'agost del 2025, aquesta vegada amb 57 programadors,
143 projectes i més de 800 tasques, i el 24 de febrer del 2026 en va
publicar el resultat: les estimacions continuen sent negatives, però els
intervals de confiança inclouen el zero, de manera que ja no permeten
afirmar ni que l'eina freni ni que acceleri. El motiu pel qual l'estudi es
va espatllar, però, diu més que qualsevol xifra: entre el **30 % i el 50 %**
dels participants van declarar que renunciaven a enviar algunes tasques
**perquè no les volien fer sense intel·ligència artificial**, i hi va haver
un programador que no va completar ni una de les tasques que li havien
tocat sense l'eina. METR reconeix que això esbiaixa la seva pròpia mesura
cap al pessimisme i ha anunciat que canvia el disseny de l'experiment
(METR, 2026a).

En poc més d'un any, doncs, la mateixa eina havia passat de frenar
mesurablement els experts a ser una cosa sense la qual no volien treballar.
Això no demostra que ara acceleri: demostra que **encara no hi ha cap mesura
controlada i fiable de les eines actuals**. L'enquesta que METR va publicar
el maig del 2026 a 349 treballadors tècnics apunta en direcció contrària a
l'estudi original —un guany de valor declarat d'entre 1,4 i 2 vegades—, però
són dades autodeclarades i els mateixos autors avisen que és justament la
mena de xifra que la gent infla (METR, 2026b).

**Tercera, i la més important per a aquest treball: les condicions d'aquell
estudi són precisament les contràries a les d'aquest projecte.** Allà hi
havia experts tocant codi antic i complex que ja dominaven; aquí hi ha una
persona sense coneixements previs començant un projecte nou i petit. Per
això l'estudi de METR no refuta la hipòtesi d'aquest treball: en delimita
l'abast. Diu que aquestes eines no són una drecera per a qui ja sap, cosa
que no exclou que siguin una porta d'entrada per a qui no sap.

I el buit que deixen aquests tres anys de mesures contradictòries té una
conseqüència que convé dir clarament, perquè afecta el valor d'aquest
treball: mentre no hi hagi mesures controlades i fiables de les eines
d'avui, un projecte documentat pas a pas, amb xifres reals de temps, de cost
i d'errors trobats, **no és només una anècdota**. És una de les poques
maneres que té algú de fora del món acadèmic d'aportar-hi alguna cosa.

**Els casos sonats i les veus crítiques.** El relat d'aquests dos anys també
té episodis que s'han de citar: una anàlisi de 1.645 aplicacions web fetes
amb la plataforma Lovable va trobar que 170 tenien un problema que deixava
exposades dades personals; un agent de la plataforma Replit va esborrar una
base de dades tot i tenir instruccions de no tocar res; i GitHub ha descrit
l'arribada massiva de contribucions de baixa qualitat generades amb
intel·ligència artificial als projectes de codi obert com un «setembre
etern». El programador Simon Willison ho va resumir en una frase que s'ha
citat molt: «arribar a un codi en producció a base de *vibe coding* és
clarament arriscat».

### Què se'n deriva per a aquest treball

Si es llegeixen juntes, aquestes dades diuen una cosa bastant coherent: **la
intel·ligència artificial escriu codi que funciona, però no escriu codi
fiable tota sola**. El problema no és que no en sàpiga; és que no té manera
de saber què no sap, i qui no llegeix el que ha generat no té manera de
saber-ho tampoc.

Aquesta conclusió de la bibliografia és el que va determinar el mètode de
treball del projecte Pokedanex, i converteix el treball en una cosa més
interessant que una demostració: en una **predicció comprovable**. Si la
recerca té raó, un projecte fet deixant-se anar, en el sentit estricte del
terme de Karpathy, hauria d'acabar amb forats de seguretat i amb codi que
ningú no entén. La resposta del projecte va ser no deixar-se anar: afegir
capes de revisió independents entre la generació del codi i la seva
publicació. La part de metodologia explica com es va fer, i la de resultats,
què s'hi va trobar —entre altres coses, dos forats de seguretat detectats en
revisió que no van arribar mai a la versió pública de la pàgina.
