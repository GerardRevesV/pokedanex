# Guió de continguts del treball escrit

Pluja d'idees ordenada: què s'ha d'explicar al treball, on va cada cosa,
què hi falta i què sobra. Punt de partida: la llista de temes de l'Edanna,
l'inventari del que ja hi ha escrit a `docs/` i els criteris de
`treball/requisits-i-rubrica.md`.

> **Estat:** proposta per discutir. Res d'això no és definitiu.

---

## 1. El criteri per decidir què entra i què no

La rúbrica de la memòria escrita diu dues coses que manen sobre tota la
resta:

- «Tots els capítols han de ser significatius per donar resposta a
  l'objectiu (**cal evitar capítols innecessaris**)».
- «Idees pròpies, coherents i ben argumentades; el desenvolupament temàtic
  segueix una estructura lògica i metòdica».

Per tant, el filtre de cada tema de la llista és una pregunta: **què aporta
això a la hipòtesi «es pot crear una pàgina web útil sense saber
programar?»**

Això descarta d'entrada la temptació més gran que té aquest treball:
convertir-lo en un **manual de Claude Code**. Un capítol titulat «Què són
les skills» és un manual. El mateix contingut dins d'un capítol titulat
«Quan la feina es repeteix: ensenyar un procediment a la màquina» és
recerca, perquè explica un problema, una solució i un resultat.

**La idea central de l'organització:** el treball no explica les eines, sinó
**per què va caldre cada eina**. Totes van entrar al projecte el dia que un
problema concret les va exigir, i això està datat a `docs/historic.md`. Si
s'escriu seguint aquest fil, les eines s'expliquen soles i el treball té
una trama.

---

## 2. Inventari: què tenim ja escrit

Gairebé tot el material primari existeix. Això és un avantatge enorme i cal
dir-ho al treball (és el criteri de «fonts d'informació» de la rúbrica).

| Font | Què conté | Quant |
|---|---|---|
| `docs/historic.md` | 38 entrades datades: cada pas nou del projecte, amb títol i explicació | 534 línies |
| `docs/reptes.md` | 7 dificultats explicades en prosa acabada, pensades per copiar al treball | 209 línies |
| `docs/diari.md` | Sessió per sessió: què s'ha fet, eines, costos, problemes | 20 KB |
| `docs/decisions.md` | 9 decisions tècniques (D-001…D-009) amb alternatives i motius | 207 línies |
| `docs/especificacions.md` | Què havia de fer la web, decidit abans de començar | 106 línies |
| `docs/arquitectura.md` | Com està feta la web per dins, en tres capes | 148 línies |
| `docs/planificacio.md` | Les 6 fases del projecte i el calendari | 3,5 KB |
| `docs/recerca-tcg-sorcery.md`, `docs/recerca-cardtrader.md`, `docs/propietats-cartes-pokemon.md` | Recerca prèvia: el projecte d'inspiració, fonts de preus alternatives, com són les cartes | 29 KB |

**El que NO tenim escrit enlloc** és precisament la part que el tribunal
preguntarà: el marc teòric (què és el vibe coding, segons qui, des de
quan), la comparació amb altres maneres de fer una web sense programar, i
les proves amb usuaris reals.

---

## 3. L'índex proposat

Quatre parts, amb una lògica de recerca: primer què se sap del tema, després
què hem fet nosaltres, després què n'ha sortit, i finalment què en
concloem. Les pàgines són una estimació per repartir l'esforç (mínim
obligatori: 20; proposta: unes 40).

### Preliminars (~5 pàg.)
Portada · Abstract en anglès (250 paraules) · Índex automàtic ·
Presentació (escola, tutor, motivació personal, agraïments, dificultats) ·

### Introducció (~2 pàg.)
L'objectiu i la hipòtesi, raonada · Per què aquest tema · Com està
organitzat el document i per què en aquest ordre.

### Part I — Marc teòric: què és això del vibe coding (~8 pàg.)

1. **Programar: què vol dir, de debò** — què és el codi, què és un llenguatge
   de programació, per què fins ara calien anys per aprendre'n.
2. **Què és el vibe coding** — l'origen del terme (Andrej Karpathy, febrer
   del 2025), què vol dir exactament i què no, i com s'ha popularitzat.
3. **Com funciona la màquina que escriu el codi** — model de llenguatge,
   què és un *token*, per què encerta i per què s'inventa coses. Just el
   necessari per entendre la resta del treball.
4. **D'un xat a un agent** — la diferència entre demanar codi a un xat i
   tenir un **agent** que llegeix fitxers, els modifica, executa ordres i
   comprova el resultat. Aquí entra el concepte d'agent i també el de
   **subagent**.
5. **La memòria d'un agent** — què recorda i què oblida: la finestra de
   context, la memòria del projecte (`CLAUDE.md`), la cau de context. Cal
   distingir-ho de la **cau de dades** de la web, que és una altra cosa
   (la del projecte, versionada, de `docs/decisions.md` D-003): confondre
   les dues «caus» és l'error més fàcil de cometre en aquest capítol.
6. **El panorama d'eines** — assistents de xat, agents de codi (Claude Code,
   Cursor, Copilot), generadors de webs per IA (Lovable, v0, Bolt) i les
   eines sense codi clàssiques (Wix, Webflow, Wordpress). Què s'ha triat i
   per què.
7. **Què diu la recerca sobre si això funciona** — l'estat de l'evidència
   abans de començar: els estudis sobre seguretat del codi generat
   (Veracode), sobre deute tècnic (GitClear) i sobre productivitat real
   (METR), i què se'n deriva per al mètode d'aquest projecte. *Capítol
   afegit en escriure la Part I; els capítols de les parts següents queden
   desplaçats en un número.*

### Part II — Metodologia: com s'ha treballat de debò (~12 pàg.)

El cor del treball. Cada capítol és un problema que va aparèixer i l'eina
que el va resoldre, en l'ordre en què va passar.

7. **Les regles del joc** — el fitxer `CLAUDE.md`: no escriure ni una línia
   de codi a mà, 20 €/mes de pressupost, català, documentar-ho tot. Per què
   posar per escrit les regles abans de començar, i com la màquina les
   llegeix cada vegada. (Històric 2 i 6.)
8. **Dir-ho bé: l'art de demanar** — com es demana una cosa perquè surti bé:
   l'entrevista d'especificacions de la Fase 0 com a exemple, i el que es va
   aprendre sobre ser concret. (Històric 5 i 7.)
9. **Pensar abans de fer: els plans** — per què es fa escriure un pla i es
   llegeix abans de deixar que toqui res, i com s'executa després pas a pas.
   (Històric 13, 14; fases de `planificacio.md`.)
10. **Quan la feina es repeteix: les skills** — afegir la tercera expansió
    era repetir els mateixos vuit passos, així que es va ensenyar el
    procediment a la màquina: la skill `afegir-expansio`. Resultat: dotze
    expansions afegides de cop. (Històric 32 i 35.)
11. **Repartir la feina: agents i subagents** — la campanya mòbil com a cas
    d'estudi: 3 rondes de 8 exploradors, 30 agents, 89 problemes reals
    arreglats. Què vol dir que treballin «en paral·lel» i per què això no es
    pot fer sol. (Històric 34.)
12. **Dues màquines a la mateixa taula** — dues sessions treballant alhora en
    branques i carpetes separades (*worktrees*), i el dia que totes dues van
    escriure al mateix document i git va avisar. Aquí entren els xats en
    paral·lel i els seus límits: **no comparteixen memòria**. (Històric 27;
    repte 4.)
13. **La revisió per capes** — el capítol més important de tot el treball:
    planificador → executor → dos revisors independents → arreglador →
    revisor final d'ulls frescos → prova al navegador de veritat. És la
    resposta real a la hipòtesi: la persona no escriu codi, però el que fa
    que el resultat sigui fiable és la revisió. (Històric 28.)
14. **Guardar-ho tot: git, GitHub, rames i pull requests** — què és una
    branca, què és un *merge*, què és un *pull request* i per què es revisa
    abans de fusionar. El conflicte de fusió real del projecte com a prova
    que el flux no era teatre. 10 pull requests, 40 commits, 13 branques.
    (Històric 1, 17, 27; decisió D-005.)
15. **Com es comprova que funciona** — i aquí cal ser honest: **no hi ha
    proves automàtiques** en aquest projecte. La comprovació ha estat
    manual (navegador real, PC i mòbil), feta per agents revisors, i
    l'única automatització és la publicació. Explicar-ho bé, dir què
    s'hauria guanyat amb proves automàtiques i per què no s'hi va arribar
    és millor material que fingir que n'hi ha. (Històric 16, 20.)
16. **Quan la màquina s'equivoca** — el catàleg d'errors, que és el capítol
    més valuós després del 13: codi que semblava correcte i era impossible
    d'activar, dos forats de seguretat que ningú no hauria vist sol, una
    API que decidia quan funcionava, un preu que sortia a zero sense dir
    per què, i el dia que la IA li va portar la contrària a l'Edanna sobre
    el tipus de l'Eevee… i tenia raó ella. (Reptes 1, 2, 3, 6, 7.)

### Part III — El producte: la web Pokedanex (~9 pàg.)

17. **Què havia de fer** — l'especificació: col·leccionar cartes, calcular
    el valor i el cost de completar. Les decisions d'abast de la v1.
18. **Com està feta per dins** — les tres capes (dades, idiomes,
    interfície), amb un esquema. 5.632 línies de codi en 14 fitxers, cap
    d'elles escrita a mà.
19. **Les funcionalitats, una per una** — la graella de cartes, el mode
    Catàleg, l'àlbum 3×3, el zoom amb Ctrl+clic, el Compendi d'expansions
    amb tema de color propi, el marcatge ràpid, els filtres, el panell
    d'estadístiques, els tres idiomes.
20. **D'on surten les dades i els preus** — l'API pokemontcg.io, la cau
    local versionada, i la cadena de preus Cardmarket → TCGplayer convertit
    → guió honest quan no n'hi ha. Per què un zero enganyós és pitjor que
    una aproximació marcada. (Decisions D-003, D-004, D-009; repte 7.)
21. **Ordinador i mòbil: el mateix web, dues pantalles** — què canvia quan
    no hi ha ratolí (no hi ha clic dret, no hi ha tecla Esc, el dit no és
    precís), els 44 píxels dels objectius tàctils, l'àlbum que es replega.
    I l'**accessibilitat**: contrastos de color calculats, no triats a ull,
    i el respecte per qui ha reduït les animacions. (Històric 34; repte 5.)
22. **Publicar-ho a internet** — què és un *hosting*, per què GitHub Pages,
    com es republica automàticament cada vegada que es fusiona un canvi, i
    què costa (0 €). (Històric 23, 24; decisió D-007.)

### Part IV — Resultats, anàlisi i conclusions (~6 pàg.)

23. **Què ha costat** — temps, sessions, diners. Les xifres de l'apartat 6
    d'aquest guió.
24. **Funciona? Les proves amb usuaris reals** — la Fase 3 del projecte.
    **Això encara no està fet** i és la prova empírica del treball.
25. **Els límits del vibe coding** — què no s'ha pogut fer, de què depèn el
    projecte (un servei de pagament d'una empresa), què passa si demà
    l'API tanca, i el problema de mantenir un codi que no entens.
26. **Què ha fet realment la persona** — la pregunta que farà el tribunal:
    «si no has escrit codi, què has fet tu?». Decidir, especificar,
    provar, detectar el que estava malament i dir no. Val la pena comptar
    les vegades que l'Edanna va rebutjar una proposta de la IA.
27. **Conclusions** — es confirma la hipòtesi? Amb matisos i amb els dubtes
    que queden oberts (la rúbrica demana explícitament els dubtes pendents).

### Final
Glossari (molt recomanable: el treball té molt vocabulari tècnic) ·
Fonts d'informació · Annexos.

---

## 4. On va cada tema de la teva llista

| El teu tema | Capítol | Material que ja hi ha | Avís |
|---|---|---|---|
| Què són les skills | 10 | Històric 32, 35; `.claude/skills/afegir-expansio/SKILL.md` | Explicar-ho a partir del problema (la feina repetida), no com a manual |
| Rules | 7 | Històric 2, 6; `CLAUDE.md` | És el millor començament de la Part II: les regles es van escriure el primer dia |
| GitHub | 14 | Històric 1, 23, 24 | Separar dues coses que es confonen: **git** (guardar versions) i **GitHub** (el web on es publiquen) |
| Procés de merge | 14 | Històric 17, 27; D-005 | El conflicte real de l'entrada 27 és l'exemple; sense exemple, és teoria buida |
| Testing | 15 | Històric 16, 20 | **No hi ha proves automàtiques.** Cal explicar què s'ha fet en comptes, i reconèixer-ho |
| Rames | 14 i 12 | D-005; repte 4 | Les branques surten dues vegades: com a eina (14) i com a solució al xoc de dues sessions (12) |
| Forks de xats | 12 | Històric 27; repte 4 | **A confirmar:** el que consta documentat són dues sessions en paral·lel amb worktrees. Si no s'han fet servir forks de debò, no s'han d'explicar com a experiència |
| Concepte d'agent | 4 i 11 | Històric 28, 34 | Teoria al 4 (què és), experiència a l'11 (els 30 agents de la campanya mòbil) |
| La memòria i la cau d'un agent | 5 | Històric 27 (les dues sessions no comparteixen memòria) | **No confondre** la memòria de l'agent amb la cau de dades de la web (D-003). Són dues coses diferents amb el mateix nom |
| Creació i execució de plans | 9 | Històric 13, 14; `planificacio.md` | Distingir el pla **del projecte** (les 6 fases) del pla **d'una tasca** (el que escriu l'agent abans de tocar res) |
| Dynamic workflows | — | **Cap** | **No s'han fet servir en aquest projecte**: no hi ha `.claude/workflows/`. Explicar-los com a experiència seria inventar. Com a màxim, una frase al capítol 6 dient que existeixen i que no van caldre |
| Continguts de la pàgina | 19 | Històric 18, 21, 22, 25, 26, 29, 30, 31; `especificacions.md` | És el capítol més fàcil d'inflar. Una funcionalitat, un paràgraf, una captura |
| Hosting | 22 | Històric 23, 24; D-007 | Lligar-ho amb el pressupost: 0 € és un resultat del treball, no un detall |
| Correcció d'errors de codi i dels agents | 16 | Reptes 1, 2, 3, 6, 7 | Ja està escrit en prosa acabada al document de reptes. És quasi copiar i enganxar |
| PC i mòbil | 21 | Històric 34; repte 5 | 89 problemes en 3 rondes: és la xifra més impressionant del treball |

---

## 5. Què hi falta (per ordre d'importància)

Això és el que he trobat que no és enlloc i que el treball necessita.

1. **El marc teòric sencer.** No hi ha ni una línia escrita sobre què és el
   vibe coding, d'on surt el terme ni qui l'ha definit. És la Part I
   completa i és el que es lliura al **primer esborrany**, que val un 10 %
   de la nota. És la feina més urgent.
2. **Fonts externes citables.** Tot el que hi ha a `docs/` és font primària
   pròpia, i això és excel·lent, però la rúbrica demana «fonts
   d'informació pertinents, ben documentades i referenciades» i la
   «diversitat» de fonts. Falten articles, notícies i documentació oficial
   que es puguin citar.
3. **Comparació amb les alternatives.** Dir «es pot fer una web sense
   programar» no vol dir res si no es compara amb les altres maneres de
   fer-ho sense programar (Wix, Lovable, v0…). És el grup de control de
   l'experiment: què hauria sortit amb cada eina.
4. **Com es mesura «útil».** La hipòtesi diu «una pàgina web **útil**», i el
   treball ha de dir abans de començar què compta com a útil: que la faci
   servir algú altre? que calculi bé? que no es trenqui? Sense criteri
   definit, la conclusió no es pot argumentar.
5. **Les proves amb usuaris reals** (Fase 3, pendent). És l'única evidència
   empírica que la web és útil per a algú que no sigui l'autora. Amb cinc
   persones i una graella de tasques n'hi ha prou.
6. **Legalitat i ètica.** Tres temes que un tribunal pot preguntar i que no
   són enlloc: els drets de les imatges i els noms de Pokémon (són de
   Nintendo i The Pokémon Company), les condicions d'ús de l'API i de les
   fonts de preus, i la qüestió de qui és l'autor d'un codi escrit per una
   IA i qui en respon si falla.
7. **Privacitat.** La web no té comptes ni demana dades: la col·lecció es
   guarda al navegador de l'usuari (`localStorage`). Això és una decisió de
   disseny que val la pena explicar, i juga a favor.
8. **Seguretat.** Els dos forats trobats (repte 2) i la norma que la clau de
   l'API no pot acabar al repositori. Està documentat, però no està pensat
   com a capítol.
9. **Les xifres del projecte,** recollides en un lloc (apartat 6 d'aquest
   guió). La rúbrica valora el rigor en la presentació de dades.
10. **El futur.** Què li falta a la web, què es faria diferent i què es
    deixa obert. Dona peu a les «conclusions amb dubtes pendents» que
    demana la rúbrica.

---

## 6. Les xifres del projecte (per tenir-les a mà)

Dades reals, comptades al repositori el 3 de novembre del 2026:

| | |
|---|---|
| Línies de codi | **5.632**, en 14 fitxers |
| Línies escrites a mà per l'Edanna | **0** |
| Dades de cartes descarregades | 5,6 MB |
| Commits | 40 |
| Pull requests fusionats | 10 |
| Branques creades | 13 |
| Skills pròpies | 1 (`afegir-expansio`) |
| Agents coordinats | més de 40 fins a l'entrada 28, i 30 més a la campanya mòbil |
| Problemes trobats abans d'arribar a `main` | prop de 30, més 89 de la campanya mòbil |
| Forats de seguretat detectats en revisió | 2 |
| Expansions al Compendi | 14 |
| Documents de procés | 11 fitxers a `docs/` |
| Entrades a l'històric | 38 |
| Reptes documentats | 7 |
| Decisions registrades | 9 |
| Cost en serveis | **0 €** (pressupost disponible: 20 €/mes) |

---

## 7. Què sobra, o s'ha de reduir

- **Un capítol per eina.** Quinze capítols tècnics seguits són un manual i
  la rúbrica els castiga («cal evitar capítols innecessaris»). La proposta
  els agrupa en deu capítols de metodologia on l'eina apareix quan el
  problema la demana.
- **Dynamic workflows.** No s'han fet servir. Fora del cos del treball.
- **El detall tècnic fi.** Les regles `@media`, les claus de `localStorage`,
  els noms dels fitxers JavaScript: tot això és a `docs/arquitectura.md` i
  el seu lloc és un **annex**, no el cos. Al cos, esquemes i explicacions.
- **Les 38 entrades de l'històric copiades.** Al cos hi va una **cronologia
  resumida en una taula**; l'històric sencer, a l'annex.
- **La llista completa de les 14 expansions amb els seus colors.** Una
  frase i una imatge; la taula sencera, a l'annex.
- **Explicar com funciona un model de llenguatge per dins.** Dues pàgines
  com a màxim, i només el que calgui per entendre per què la màquina
  s'equivoca. No és un treball d'intel·ligència artificial, és un treball
  sobre fer servir la IA per construir una cosa.
- **Captures de pantalla decoratives.** Cada imatge ha de demostrar alguna
  cosa i ha de portar la font indicada (ho demana la rúbrica).

---

## 8. Decisions que cal prendre

1. **Forks de xats:** s'han fet servir de debò o el que es va fer van ser
   sessions en paral·lel amb worktrees? Determina si el capítol 12 els
   explica com a experiència o no els esmenta.
2. **Proves automàtiques:** s'assumeix que no n'hi ha i s'explica (recomanat,
   i és bona autocrítica), o es dedica una estona a afegir-n'hi unes
   quantes per poder-ho explicar en positiu?
3. **Proves amb usuaris:** es fan? Amb quantes persones i quines tasques?
4. **Profunditat del marc teòric:** 6 capítols com proposa l'apartat 3, o
   es concentra en 3 i es guanyen pàgines per a la metodologia?
5. **Comparació amb alternatives:** es prova de fer la mateixa web amb una
   altra eina per comparar de debò, o es compara només llegint-ne la
   documentació?

---

## 9. Índex, guió i descripció del document: tres coses diferents

És fàcil confondre-les i les tres fan falta, però només dues s'entreguen.

**1. L'índex — obligatori, va dins del treball.** Les orientacions el posen
com la tercera part del document, just després de l'abstract, i diuen com
ha de ser: «ha de recollir tots els capítols amb numeració de pàgina (el
processador de text ho fa de manera automàtica, **cal fer servir els
estils**)». No és una recomanació: la rúbrica puntua explícitament l'«ús de
l'índex automàtic i la paginació del processador de textos» dins del criteri
de presentació i format. Fer-lo a mà, escrivint els títols i els números de
pàgina un per un, és perdre part d'aquest punt (i garantir-se que els
números quedin desquadrats a la primera correcció).

Com que es genera sol a partir dels estils de títol, **no es fa ara: es
genera al final**. L'única cosa que cal fer mentrestant és escriure amb la
jerarquia de títols ben marcada. Els esborranys en Markdown d'aquesta
carpeta ja ho fan (`#` per a les parts, `##` per als capítols, `###` per
als apartats), i en passar-los al processador de textos aquests nivells es
converteixen en Títol 1, Títol 2 i Títol 3, de manera que l'índex
automàtic sortirà bé sense feina extra.

**2. La descripció del document — obligatòria, va dins de la Introducció.**
Això és una cosa diferent de l'índex, i es passa per alt sovint. Les
orientacions demanen que la introducció contingui la «descripció del
document (capítols, **justificació de l'ordre**)»: no la llista dels
capítols, que ja és a l'índex, sinó un o dos paràgrafs explicant en prosa
per què el treball va en aquest ordre i no en un altre. En aquest treball
té una resposta clara i val la pena dir-la: primer el que ja se sabia
(marc teòric), després com s'ha treballat (metodologia), després què n'ha
sortit (el producte) i finalment si la hipòtesi es confirma (resultats i
conclusions).

**3. El guió de continguts — eina de treball, NO s'entrega.** És aquest
document. Serveix per decidir què s'escriu, en quin ordre i amb quantes
pàgines, i per no perdre el fil mentre es redacta. Quan el treball estigui
escrit, el guió ja haurà fet la seva feina. Si de cas, pot acabar
mencionat a la «Presentació» com a part del mètode de treball, però no és
una part obligatòria del document.

I una cosa que sí que és necessària **ara**: el guió és l'eina per decidir
per on continuar. L'apartat 11 hi posa l'ordre.

---

## 10. La veu del treball: primera persona, plural o impersonal?

Les orientacions no ho diuen enlloc, de manera que és una decisió pròpia.
Però no és una decisió petita, perquè la rúbrica valora la «utilització d'un
estil formal» i la «claredat expositiva, presentació ben enllaçada i ben
cohesionada»: el que es penalitza no és triar una veu o una altra, és
barrejar-les sense criteri.

La proposta és repartir-ho així:

**El cos del treball, en impersonal.** «S'ha triat», «es va decidir», «el
projecte va adoptar», «la web calcula». És el registre acadèmic estàndard,
és el que fa que el text soni a treball de recerca i no a diari personal, i
té un avantatge pràctic: permet explicar decisions preses amb ajuda sense
haver de precisar a cada frase qui les va prendre.

**La «Presentació» i la valoració crítica, en primera persona del
singular.** «Vaig triar aquest tema perquè…», «el que més em va costar va
ser…», «si ho tornés a fer…». Aquí l'impersonal sona fals i a més
contradiu el que demanen les orientacions, que a la Presentació exigeixen
explícitament la «motivació personal», els «agraïments» i les «referències
a les dificultats trobades». El mateix val per a les conclusions quan
s'hagi de fer autocrítica, que és un criteri de la rúbrica.

**«Nosaltres», mai.** Això és l'important, i és el que va motivar aquest
apartat. Les orientacions diuen que «el TR té un caràcter individual», i un
plural dins del text obre una pregunta que no interessa obrir: qui són
«nosaltres»? En un treball que explica precisament que el codi l'ha escrit
una intel·ligència artificial, i que s'ha fet amb acompanyament, el plural
convida el tribunal a preguntar quina part és de l'autora. El contingut del
treball ja respon aquesta pregunta amb claredat i honestedat —hi ha un
capítol sencer dedicat a què va fer realment la persona—, i la veu del text
no l'ha de contradir.

El «plural de modèstia» («hem analitzat», «proposem») és tradicional en
l'escriptura acadèmica i no és incorrecte en si mateix, però en un treball
individual defensat davant d'un tribunal no aporta res i pot despistar. Per
tant: impersonal al cos, singular on toqui parlar d'un mateix, i prou.

---

## 11. Per on continuar: l'ordre de la feina

La regla que ordena aquesta llista: **primer el que té temps d'espera**. Hi
ha feines que no depenen de nosaltres i que, si es deixen per al final, ja
no es poden fer; les altres són escriure, i escriure va en línia recta.

### Ara mateix, aquesta setmana

1. **Confirmar les dates amb el tutor/a.** Tot el calendari d'aquesta
   llista en depèn, i les orientacions 25-27 ja no donen dates exactes
   (vegeu `treball/requisits-i-rubrica.md`, apartat 1). Si l'esborrany es
   lliura a mitjans de novembre, queden poc més de dues setmanes.
2. **Començar a buscar les persones per a les proves d'usuari.** Amb cinc
   n'hi ha prou, però cal quedar-hi, i això és el que té més temps d'espera
   de tot el treball. Sense aquestes proves, les conclusions no es poden
   argumentar: són l'única evidència que la web és útil per a algú altre.
   Es pot fer mentre s'escriu la resta.
3. **Verificar les nou fonts pendents** de `treball/fonts.md`. És una hora
   de feina i protegeix tot el treball: una citació falsa és el pitjor que
   li pot passar.

### Per al primer esborrany (val un 10 % de la nota)

4. **Llegir el marc teòric i fer-lo seu** (`treball/marc-teoric.md`).
   Adaptar la veu segons l'apartat 10, treure el que no es pugui defensar a
   l'oral i afegir-hi el que falti. L'esborrany ha de contenir «com a mínim
   el marc teòric», i això ja hi és.
5. **Escriure la Introducció.** Són dues pàgines i contenen el primer
   criteri de la rúbrica: objectiu, hipòtesi ben raonada, justificació i
   descripció del document amb la justificació de l'ordre. Amb això,
   l'esborrany passa de ser un capítol a ser un treball començat.

### El gruix de la redacció

6. **Part II, la metodologia** (capítols 8-17). És el cor del treball i,
   paradoxalment, el més fàcil d'escriure: tot el material és a
   `docs/historic.md`, `docs/reptes.md` i `docs/decisions.md`. Els reptes ja
   estan en prosa acabada.
7. **Part III, el producte** (capítols 18-23). També té el material fet, a
   `docs/especificacions.md` i `docs/arquitectura.md`. Aquí fan falta
   **captures de pantalla**, i hi ha una trampa de calendari: la interfície
   està canviant ara mateix. Els *pull requests* #14 i #15 reanomenen
   controls i textos —el panell d'estadístiques i el comptador del peu ara
   diuen «d'aquesta expansió» en comptes de «de la col·lecció»— i canvien
   com es comporten els filtres a l'àlbum. **Les captures s'han de fer quan
   aquests canvis ja siguin a la web publicada**, no abans, o mostraran una
   interfície que ja no existeix. I val més no citar literalment cap text de
   la interfície sense comprovar-lo el dia que s'escriu el capítol.
8. **Tancar la Fase 3 del projecte** si encara no ho està: publicar i provar
   la web amb els usuaris del punt 2, i apuntar els resultats.

### El final

9. **Part IV, resultats i conclusions** (capítols 24-28). No es pot escriure
   abans del punt 8, perquè les conclusions han de sortir de les dades.
10. **L'abstract en anglès** (250 paraules), el **glossari** i les **fonts
    d'informació** ordenades.
11. **Generar l'índex automàtic** i fer una **lectura ortogràfica completa**
    del treball i de les diapositives. Això no és opcional: les faltes fan
    suspendre.
12. **Preparar l'exposició oral**, que val un 35 % —més que el treball
    escrit— i demana assaig, no només diapositives.

### El que es pot fer en paral·lel

Els punts 1, 2 i 3 no depenen de res i es poden tenir enllestits aquesta
setmana. Les captures de pantalla del punt 7 es poden anar fent sempre que
es toqui la web. I la presentació del punt 12 es pot començar a esbossar
mentre s'escriu la Part III, perquè surt del mateix material.
