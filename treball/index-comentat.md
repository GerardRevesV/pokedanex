# Índex comentat

> **Document d'aclariment: no forma part del treball.** És l'índex del
> treball amb una explicació d'una a tres línies de cada capítol, perquè es
> vegi d'un cop d'ull què diu cadascun. Les parts I, II i III i el glossari
> ja estan escrits, en esborrany, i el que hi ha aquí n'és el resum. La Part
> IV encara no està escrita: el que hi ha aquí és el que cada capítol **ha
> d'explicar**, i els títols són provisionals.

## Abans del cos del treball

**Presentació** *(esborrany, amb dades per omplir)*
L'única part en primera persona: per què s'ha triat el tema, com s'ha fet el
treball, quines dificultats hi ha hagut i els agraïments.

**Introducció** *(esborrany)*
La pregunta i la hipòtesi, per què la resposta no és evident, què vol dir que
una web sigui «útil», els objectius i l'ordre del document.

## Part I — Marc teòric: què és la programació per intenció *(en esborrany)*

Què se sabia del tema abans de començar. Tot el que s'hi afirma ve de fonts
externes citades.

**1. Del codi a la intenció: què és el *vibe coding***
Què vol dir programar i per què fins ara calia aprendre'n. D'on surt el terme
(una piulada d'Andrej Karpathy del febrer del 2025), com es diu en català i
quina diferència hi ha entre el sentit estricte i l'ampli.

**2. Com funciona la màquina que escriu el codi**
Què és un model de llenguatge, explicat sense matemàtiques: per què sovint
encerta, per què de vegades s'inventa coses i per què no contesta mai dues
vegades igual.

**3. L'agent: què pot fer i què recorda**
La diferència entre un xat, que només escriu, i un agent, que també prova el
que ha fet i ho corregeix. Què són els subagents i les receptes guardades, i
què recorda i què oblida una conversa.

**4. El panorama d'eines**
Quines menes d'eines hi ha per fer una web sense programar, qui les fa servir
i fins a quin punt se'n refia, i per què aquest projecte en va triar una i no
una altra.

**5. Què diu la recerca sobre si això funciona**
Els estudis que hi ha sobre la seguretat i la qualitat del codi generat i
sobre si de debò es va més de pressa. La conclusió marca el mètode del
treball: el codi de la màquina s'ha de revisar.

## Part II — Metodologia: com s'ha treballat *(en esborrany)*

El cor del treball. Cada capítol és un problema que va aparèixer durant el
projecte i la manera com es va resoldre.

**6. Les regles del joc**
Les normes que es van posar per escrit abans de començar: no escriure cap
línia de codi a mà, no passar de 20 euros al mes, fer-ho tot en català i
documentar cada pas. Com la màquina les llegeix a cada sessió, i els quatre
documents on s'apunta tot el que es fa.

**7. Dir-ho bé: com es demana una cosa a la màquina**
Què canvia entre una petició vaga i una de concreta. L'exemple és
l'entrevista de preguntes i respostes amb què es va decidir què havia de fer
la web. I el límit de demanar les coses peça a peça.

**8. Pensar abans de fer: els plans**
Per què es fa escriure un pla a la màquina i es llegeix abans de deixar-li
tocar res, com el projecte es va repartir en fases, i per què abans de
construir es mira què hi ha fet.

**9. Quan la feina es repeteix: les receptes guardades**
Afegir una expansió de cartes nova eren sempre els mateixos passos. Es van
guardar com una recepta que la màquina segueix sola, i amb ella es van afegir
dotze expansions de cop.

**10. Repartir la feina: agents i subagents**
Com es reparteix una feina gran entre diversos ajudants que treballen alhora.
El cas d'estudi és la revisió de la web al mòbil: tres rondes d'ajudants
que van trobar 89 problemes.

**11. Dues converses alhora**
Què passa quan hi ha dues converses obertes treballant en el mateix projecte:
cap de les dues sap què fa l'altra. Dos casos del projecte, i què s'hi va
aprendre.

**12. La revisió per capes**
El capítol més important. Com que l'autora no llegeix el codi, cada canvi
passa per diversos revisors, que no són qui l'ha escrit, i per una prova al
navegador abans de donar-lo per bo. Així es van trobar dos forats de
seguretat. El límit: tots els revisors són la mateixa màquina.

**13. Guardar-ho tot: l'historial de canvis**
Com es desa cada versió del projecte per poder tornar enrere, i per què cada
canvi es fa a part i es revisa abans d'ajuntar-lo amb la resta.

**14. Com es comprova que funciona**
Com s'ha provat la web: fent-la servir en un navegador, a l'ordinador i en
una pantalla de mòbil simulada. El capítol diu què no s'ha fet: proves
automàtiques, proves en un telèfon de debò i proves amb usuaris.

**15. Quan la màquina s'equivoca**
El catàleg d'errors reals del projecte: codi que semblava correcte i no es
podia activar, un servei de dades que fallava quan volia, un preu que
sortia a zero, i el dia que la màquina va contradir l'autora i tenia raó la
màquina.

## Part III — El producte: la web Pokedanex *(en esborrany)*

Què ha sortit de tot plegat: la web, explicada per a qui no l'ha vista.

**16. Què havia de fer**
L'encàrrec inicial: apuntar quines cartes Pokémon es tenen, saber quant val
la col·lecció i quant costaria completar-la. I què es va decidir deixar fora
de la primera versió.

**17. Com està feta per dins**
Les tres peces de la web (les dades de les cartes, els textos en tres idiomes
i el que es veu a la pantalla), amb un esquema. Sense entrar en el codi.

**18. Les funcionalitats, una per una**
Un recorregut per la web amb captures: la graella de cartes, l'àlbum de nou
cartes per pàgina, el zoom, els filtres, les estadístiques i el selector
d'expansions.

**19. D'on surten les dades i els preus**
D'on es treuen les cartes i els preus (dues fonts), per què se'n guarda una
còpia dins del projecte i què fa la web quan un preu falta, és antic o és
dubtós: marcar-lo i dir-ne el motiu, en comptes d'ensenyar un número que
enganya.

**20. Ordinador i mòbil**
Què canvia quan no hi ha ratolí i la pantalla és petita, i què s'ha fet
perquè la web es pugui llegir bé, com ara calcular el contrast dels colors en
comptes de triar-los a ull.

**21. Publicar-la a internet**
Com es posa una web a l'abast de tothom, on està allotjada, com s'actualitza
sola cada vegada que s'aprova un canvi i què costa: 0 euros.

## Part IV — Resultats i conclusions *(per escriure)*

**22. Què ha costat**
Les xifres del projecte en una taula: temps, sessions de treball, diners i
mida del que s'ha construït.

**23. Les proves amb usuaris** *(les proves encara no s'han fet)*
La prova de la hipòtesi: persones que no han participat en el projecte fan
servir la web per fer unes tasques concretes, i s'apunta què aconsegueixen i
on s'encallen.

**24. Els límits**
Què no s'ha pogut fer, de què depèn el projecte (una eina de pagament i una
font de dades que no són pròpies) i el problema de mantenir un codi que
l'autora no sap llegir.

**25. Què ha fet realment la persona**
La resposta a «si no has escrit codi, què has fet tu?»: decidir, explicar què
es vol, provar, veure què està malament i dir que no.

**26. Conclusions**
Si la hipòtesi es confirma, amb quins matisos, i quins dubtes queden oberts.

## Després del cos del treball

**Glossari** *(en esborrany)*
Les paraules tècniques del treball, explicades en una o dues línies cadascuna.

**Fonts d'informació** *(fetes per a la Part I)*
Tot el que s'ha citat, amb l'autor, la data i l'adreça de cada font.

**Annexos** *(per decidir)*
Material de suport que no compta per al límit de pàgines, com ara fragments
del diari del projecte o captures de la web.
