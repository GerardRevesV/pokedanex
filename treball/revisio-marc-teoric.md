# Revisió del marc teòric: quatre revisors i un orquestrador

*4 de novembre del 2026*

Registre de la revisió del marc teòric. Es guarda perquè és **material per a
la part de metodologia del treball**: és un exemple documentat del mètode de
revisió per capes aplicat a un text, i no al codi.

## Com es va fer

Es van llançar **quatre revisors independents i simultanis** sobre
`treball/marc-teoric.md`, cadascun amb un únic criteri i sense veure la feina
dels altres:

| Revisor | Criteri | Resultat |
|---|---|---|
| Nivell i claredat | Ho entendria una persona de 16 anys? Es pot defensar davant d'un tribunal no tècnic? | 26 troballes |
| Síntesi i estructura | Què es pot retallar sense perdre l'argument? | 19 retalls, taula per capítols |
| Rigor i fonts | Cada xifra i cada citació quadren amb la bibliografia? | 21 troballes |
| Llengua catalana | Hi ha cap errada que pugui fer suspendre? | 13 greus, 17 mitjanes |

Després, un **orquestrador** (la sessió principal) va decidir què s'aplicava,
va resoldre els casos en què dos revisors demanaven coses contràries i va fer
la reescriptura en una sola passada.

## El resultat

| | Abans | Després |
|---|---|---|
| Paraules | 4.512 | **3.454** |
| Capítols | 7 | **5** |
| Xifres i percentatges | ~30 | 13 |
| Errades de llengua greus | 13 | 0 |

## Les sis troballes que importaven

1. **El «0 €» contradeia una font pròpia del projecte.** El text deia que
   «el que s'ha acabat gastant en serveis és 0 €». El diari del projecte diu
   una altra cosa: «0 € (de moment només eines gratuïtes; el cost de
   l'assistent d'IA es documentarà quan es concreti la subscripció usada)».
   Era l'única afirmació del text que contradeia la documentació del projecte,
   i és la primera pregunta que faria un tribunal. Ara el text diu què inclou
   el zero (serveis externs) i remet el cost de la subscripció a la part de
   resultats. **La xifra encara està pendent de decidir.**

2. **Una citació mal transcrita.** El text atribuïa a Simon Willison la frase
   «arribar a un codi en producció a base de vibe coding és clarament
   arriscat». El que va escriure de debò, al seu blog, és «clarament **una
   idea terrible**». La versió «arriscada» és una paràfrasi que circula per
   blogs secundaris. Corregida contra la font primària.

3. **Una sobreinterpretació d'un estudi.** En explicar per què METR va haver
   de canviar l'experiment, el text donava com «el motiu» que els
   programadors no volien treballar sense IA. METR en dona quatre, i el text
   omitia el més prosaic: la paga dels participants va baixar de 150 a 50
   dòlars l'hora, cosa que per si sola explica part de la caiguda de
   participació. Ara hi surten tots dos. Dir el que va en contra teva dona
   més credibilitat, no menys.

4. **Una xifra imprecisa.** «El codi duplicat s'ha multiplicat per quatre»
   (GitClear). El que s'ha multiplicat per quatre són els **clons de codi**;
   les línies copiades com a percentatge van del 8 % al 12-18 %. Corregit, i
   s'hi ha afegit que GitClear ven eines d'aquest sector.

5. **Dues faltes de llengua que haurien fet suspendre.** «Oblita» en lloc
   d'«oblida», i «donat tot el text» en lloc d'«a partir de tot el text»
   (participi absolut, calc del castellà). Amb la norma de l'institut, una
   sola n'hi hauria hagut prou. La revisió lingüística en va trobar onze més
   de greus: «com la forma» per «com a forma», «es resol» per «es resolen»,
   «història que explicar» per «cap història per explicar», «dit en pla»,
   «posa el focus en», «la cau» per «la memòria cau», «confondre-ho» per
   «confondre-la», i dues marques de primera persona del plural.

6. **Massa vocabulari tècnic d'un sol ús.** Fora del text: «tokens»,
   «determinista», «interval de confiança», la sigla «LLM», «CWE»,
   «freemium» i «consola». El criteri que es va adoptar: **cap terme tècnic
   que no es faci servir almenys dues vegades, i cap xifra que l'autora no
   pugui explicar amb les seves paraules.**

## Els casos en què els revisors es contradeien

Decisions de l'orquestrador:

- **L'enquesta de METR del maig del 2026.** Rigor demanava citar-la amb totes
  les limitacions; claredat demanava eliminar-la perquè són dades
  autodeclarades que el text mateix desqualifica. **Es va eliminar**: una
  dada que has de desacreditar en citar-la no sosté cap argument, i treure-la
  servia també l'ordre de sintetitzar.
- **Els intervals de confiança.** Rigor volia les xifres exactes al text;
  claredat volia el terme fora. **Es va treure el terme i les xifres del
  cos**, i les xifres exactes queden a `treball/fonts.md`, que és on un
  tribunal les pot anar a buscar.
- **La nota d'estat de dalt del document.** Els tres revisors la volien fora
  perquè no pot arribar al tribunal. **Es va conservar amb un avís explícit**
  («per esborrar abans del lliurament»), perquè mentre el text sigui un
  esborrany és informació útil.

## El que va quedar bé

Val la pena registrar-ho perquè també és un resultat: **cap xifra del marc
teòric contradeia la bibliografia.** El revisor de rigor va comprovar unes 75
afirmacions, una per una, i totes les dades de Stack Overflow, Veracode, METR,
TERMCAT i del projecte mateix eren exactes, inclòs el signe de les
estimacions negatives de METR, que és on era més fàcil equivocar-se. El que
fallava no eren les xifres: eren les **atribucions** (secundari presentat com
a primari) i la **manca de cautela** en dades marcades per verificar.

La revisió lingüística també va deixar constància del que estava bé: cap
castellanisme de paraula sencera, geminades i dièresis impecables, i `per`/
`per a` correcte a tot el document.

## Pendent

- **Decidir el cost de la subscripció** de l'eina d'intel·ligència artificial
  (capítol 4 del marc teòric i apartat de costos de la part de resultats).
- **Verificar quatre formes dubtoses** a l'Optimot o al DIEC abans del
  lliurament: `desajust`, `referenciar`, `sobreestimar` i `sonat`. Totes
  quatre s'han evitat a la versió actual, però convé saber-ne la resposta.
- **Una lectura ortogràfica feta per una persona.** La cerca de patrons que
  es fa aquí no ho substitueix: la prova és que, en reescriure el text
  d'aquesta revisió, s'hi va tornar a escolar la paraula «conviene», la
  mateixa que ja s'havia corregit el dia abans.
