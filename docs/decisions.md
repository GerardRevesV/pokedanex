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

## D-010 · L'efecte de llibre fet amb el navegador, sense cap llibreria

**Data:** 2026-11-03

**Decisió:** fer el gir del full de l'àlbum amb els efectes
tridimensionals que el CSS ja porta de sèrie (girar un element com si
fos un full de paper a l'espai, amb cara i dors) i amb l'API
d'animacions del navegador, en comptes d'afegir al projecte una
llibreria especialitzada en «page flip». El gir dura 520 mil·lèsimes de
segon, volta sobre el llom del carpesà i s'acompanya d'una ombra que
s'enfosqueix mentre el paper s'aixeca.

**Per què:** el navegador ja sap fer-ho tot sol. Una llibreria d'aquest
estil pesa centenars de kilobytes, obliga a reescriure com es dibuixen
les pàgines de l'àlbum i afegeix una dependència externa que algun dia
caldrà actualitzar; amb el CSS no hi ha res a instal·lar, res a
mantenir i res a pagar. La durada tampoc és arbitrària: per sota de
quatre dècimes el gir no s'arriba a veure, i per sobre de sis es fa
pesat quan es passen moltes pàgines seguides.

També s'ha decidit que l'efecte sigui **una capa per sobre i no una
peça del mecanisme**: les pàgines noves ja hi són abans que el full
comenci a voltar, i si l'animació no es pot fer —perquè l'usuari té
activada l'opció «redueix el moviment» del sistema, o perquè el
navegador és massa antic— el canvi de pàgina es fa sec i prou. Un efecte
bonic no pot ser mai la condició perquè la web funcioni.

**Alternatives considerades:** una llibreria de page flip (descartada
pel pes i la dependència); esvair una pàgina i encendre l'altra, que és
molt més senzill però no explica res (podria ser qualsevol web, no un
àlbum de cromos); i deixar-ho tal com estava.

**Cost:** 0 €.

## D-011 · A l'àlbum els filtres ressalten, no filtren

**Data:** 2026-11-04

**Decisió:** la cerca i els filtres (Totes/Les tinc/Em falten, Raresa,
Tipus d'energia, Categoria) ara també tenen efecte a la vista d'Àlbum, però
**d'una altra manera que a la graella**: a la graella amaguen les cartes que
no coincideixen; a l'àlbum no amaguen res. Les cartes que coincideixen
queden enceses i amb un anell del color d'accent, les altres s'apaguen, i
apareix una barra que diu quantes coincidències hi ha i a quines pàgines,
amb dues fletxes per saltar d'una pàgina amb coincidències a la següent.
Si la pàgina oberta no en té cap, l'àlbum salta tot sol a la primera que en
tingui. El control «Ordena per» s'amaga a l'àlbum.

Alhora, els tres desplegables **desactiven les opcions que no donarien cap
carta** tenint en compte els altres dos, i el missatge de graella buida diu
quins criteris han deixat fora les cartes i ofereix un botó per treure'ls
tots.

**Per què:** l'estudi d'usabilitat (`docs/estudi-usabilitat.md`) va trobar
que sis controls de la capçalera no feien res a la vista d'Àlbum, perquè la
graella es construeix passant les cartes pel sedàs dels filtres i l'àlbum
agafava la llista sencera. Es van considerar tres sortides. Amagar els
controls a l'àlbum hauria fet saltar la interfície i hauria tret una
funcionalitat útil. Fer-los filtrar de debò hauria buidat butxaques: un
àlbum amb nou cartes de foc enganxades a les tres primeres butxaques ja no
és un àlbum, i els forats són justament el que un col·leccionista hi vol
veure. La idea inicial —«que el filtre et porti a la pàgina de l'energia
corresponent»— es va mesurar sobre les 14 expansions i no es pot fer
literalment: **no existeix «la pàgina» d'un tipus**, perquè cada tipus surt
al bloc del set base i una segona vegada a les cartes especials del final
(només el 3 % dels tipus ocupa pàgines seguides, i cada tipus toca el 35,8 %
de les pàgines de l'àlbum). El ressaltat amb navegació compleix la mateixa
intenció —«porta'm on són»— amb la informació que les dades permeten dir de
debò.

La desactivació d'opcions ataca un número mesurat: el **58,4 %** de les
combinacions possibles dels tres desplegables no retornava cap carta (per
exemple, qualsevol tipus d'energia amb la categoria «Entrenador», perquè els
entrenadors no en tenen). Es desactiven en comptes d'amagar-les perquè la
llista no balli: així es veu que l'opció existeix però que ara no porta
enlloc. L'opció «Tots» i el valor ja triat no es desactiven mai, perquè el
desplegable sempre ha de poder tornar enrere.

## D-012 · Les paraules de la interfície, i quatre paranys tancats

**Data:** 2026-11-04

**Decisió:** s'apliquen els punts 3 a 8 de la recomanació de l'estudi
d'usabilitat. Són canvis petits un per un, però tots ataquen el mateix:
que la pantalla digui la veritat sense que calgui endevinar-la.

*Noms (punt 3).* «Visualització» passa a dir-se **«Colors»**, que és el que
fa de debò. El filtre que es deia «Col·lecció» passa a **«Què mostro»**. El
panell, que calculava només l'expansió oberta però es titulava «de la
col·lecció», ara diu **«Estadístiques d'aquesta expansió»**, i amb ell «Les
cartes que en tens valen» i «Completar l'expansió costaria». El comptador
del peu diu **«X de N cartes d'aquesta expansió»** i, al seu costat, el botó
que esborra de debò tota la col·lecció passa de «Buidar» a **«Buidar-ho
tot»**. «Consulta» passa a **«Només mirar»** (punt 7).

*Paranys (punts 4, 5, 6).* Al mòbil, el botó «Filtres i opcions» porta un
**distintiu amb el nombre de filtres actius**, perquè amb el bloc plegat no
hi havia cap manera de saber que n'hi havia. **Importar demana confirmació**
abans de substituir la col·lecció, com ja feia Buidar. I **canviar
d'expansió treu la cerca i els filtres**.

*Agrupació (punt 8).* «Versió de les dades» i «Actualitza» viuen ara en un
sol bloc titulat **«Dades»**, i el botó només diu «Actualitza», perquè el
títol del grup ja diu de què.

**Per què:** l'estudi va comptar que la paraula «col·lecció» designava tres
coses diferents a la mateixa pantalla, i que dues paraules gairebé iguals
—«Vista» i «Visualització»— manaven coses que no tenen res a veure. Una
interfície pot ser correcta i ser il·legible: aquests canvis no arreglen cap
error de programació, arreglen el que la pantalla fa entendre. Els tres
paranys (filtres invisibles al mòbil, importar que esborra sense avisar,
filtres que viatgen d'una expansió a l'altra) eren casos en què la web feia
exactament el que li havien programat i l'usuari no tenia com saber-ho.

La xifra del distintiu **no compta la cerca**: el cercador es veu sempre,
fins i tot amb el bloc plegat, i comptar-lo hauria fet sortir un «1» que no
assenyala res amagat. I el missatge de confirmació d'Importar no diu quantes
cartes es perdran, sinó que es perd **tot**: era més curt i més honest que
una xifra que obligava a triar entre «1 cartes» i una frase doble.

## D-013 · Dues fonts de preus i quatre regles per triar-ne un

**Data:** 2026-11-10

**Decisió:** la web deixa de dependre d'una sola font de preus. S'hi afegeix
**TCGdex** (tcgdex.net), una base de dades oberta i gratuïta que actualitza
cada dia els preus de Cardmarket (euros) i de TCGplayer (dòlars), i el preu
de cada variant de cada carta es tria sempre amb les mateixes quatre regles:

1. **Quatre fonts, per ordre de confiança:** Cardmarket segons TCGdex,
   TCGplayer segons TCGdex, Cardmarket segons pokemontcg.io i TCGplayer
   segons pokemontcg.io. Els preus en dòlars es converteixen a euros amb la
   taxa fixa de D-009 (0,90).
2. **Un preu només val si és fresc:** com a màxim 60 dies més vell que el
   dia que es van baixar les dades. Guanya la primera font de la llista que
   tingui un preu fresc.
3. **Si cap font té un preu fresc,** es fa servir el menys vell i es marca
   com a antic.
4. **Si el preu en euros i el preu en dòlars discrepen moltíssim** (un
   multiplica l'altre per 5 o més, i la diferència passa d'1 €), un dels dos
   és d'una altra carta: ens quedem el més baix i es marca com a dubtós.

Tot preu que no sigui «Cardmarket, fresc i sense discrepància» surt amb el
símbol «≈», i en passar-hi el ratolí la web en diu el motiu: convertit de
dòlars, antic o dubtós. Si cap font té preu, es manté el guió i el recompte
de «cartes sense preu» (D-009): no se n'inventa cap.

Tres detalls que fan que el sistema encerti:

- **Les cartes amb segell no compten.** Una mateixa carta pot existir amb
  un segell de torneig o de botiga, que val molt més. Barrejar-les era
  l'origen dels preus disbarat (un Raging Bolt de 14 cèntims surt a 42 € a
  pokemontcg.io perquè hi porta el preu de la versió amb segell). TCGdex les
  separa i la web les descarta, tant per al preu com per saber quines
  variants té una carta.
- **El valor del mig de tres.** De Cardmarket no s'agafa una sola xifra sinó
  la del mig entre la tendència, la mitjana de 7 dies i la de 30: si una de
  les tres s'ha tornat boja, no ens enganya.
- **Patrons de reverse.** Als sets on el reverse existeix en diversos
  patrons (Poké Ball, energia...), el preu del reverse és el del patró
  corrent o, si tots són especials, el més barat.

**Per què:** la revisió del 10-11 (`docs/revisio-preus-2026-11-10.md`) va
trobar que pokemontcg.io ja no actualitza Cardmarket (la majoria de preus
eren d'entre novembre de 2025 i febrer de 2026), que quatre expansions no
tenien cap preu i que una desena de cartes tenien preus erronis. Tornar a
baixar les dades no arreglava res: el problema era a la font. Amb el
sistema nou, de les 4.016 peces de les 14 expansions, 4.003 tenen preu de
Cardmarket al dia, 8 un preu convertit de dòlars, 1 un preu antic, 4 un preu
dubtós (resolt cap a la xifra prudent) i **cap** es queda sense preu.

El criteri de «quedar-se el més baix» quan dues fonts discrepen és una
tria de prudència: en tots els casos trobats, el preu alt era el d'una
altra carta, i una web que calcula el valor d'una col·lecció fa menys mal
quedant-se curta que inflant-lo.

**Límits que cal conèixer:** la regla 4 necessita dues fonts per comparar;
si una carta només té preu a Cardmarket i aquest és erroni, no es detecta.
I 60 dies i 5 vegades són llindars triats a ull mirant les dades, no
mesures exactes.

**Alternatives considerades:** canviar del tot a TCGdex i abandonar
pokemontcg.io (es perdria la xarxa de seguretat i les versions antigues
deixarien de tenir preu); CardTrader (`docs/recerca-cardtrader.md`), que
demana registre i clau; i preferir simplement TCGplayer quan Cardmarket és
vell, que no donava preu a les quatre expansions buides.

**Cost:** 0 €. TCGdex és gratuït i no demana clau. Baixar una expansió
passa de 2 peticions a unes 200 (una per carta), uns 15 segons.

## D-014 · Treure el selector «Marcar»: el clic sempre obre la carta

**Data:** 2026-11-21

**Decisió:** es treu del tot el mode de marcar amb clics (Només mirar /
Normal / Reverse / Holo). Clicar o tocar una carta sempre l'obre en gran,
a la graella i a l'àlbum, i les còpies s'afegeixen i es treuen amb els
botons + i − de cada carta i de la finestra gran. La decisió es va prendre
abans de començar les millores, en repassar els resultats de l'enquesta.

**Per què:** l'enquesta va mostrar que el mode de marcar era la principal
font de confusió. Tres persones, sense conèixer-se, van descriure el
mateix: la gent hi entrava, s'oblidava que hi era, i clicar una carta feia
una cosa inesperada (afegir-la) o no feia res, si la carta no tenia aquella
variant. La drecera per veure la carta amb el mode actiu (Ctrl+clic, o
mantenir el dit al mòbil) no la va descobrir ningú.

**Alternatives considerades:** explicar-ho millor amb avisos i ajudes. Es
va descartar perquè ja hi havia avisos i no havien servit. Es prefereix
una regla simple que no cal explicar: clicar una carta sempre la mostra;
per afegir-la hi ha els botons + i −.

**Cost:** 0 €. Es perd una drecera per marcar moltes cartes de pressa, però
els botons + i − ja hi eren a cada carta i fan el mateix amb un sol clic.

## D-015 · Com es tolera un error d'escriptura sense trobar-ho tot

**Data:** 2026-11-21

**Decisió:** el cercador busca per proximitat. Per saber si una paraula
«s'assembla» a una altra, es fa servir la **distància d'edició**: el nombre
mínim de lletres que cal canviar, afegir, treure o intercanviar per passar
d'una a l'altra. «fabel» i «fable» estan a distància 1 (s'intercanvien dues
lletres). El nombre d'errors permesos creix amb la llargada del que
s'escriu: cap error fins a 3 lletres, un fins a 6, dos fins a 9 i tres a
partir de 10. Les cartes es mostren ordenades de la coincidència més segura
a la menys segura, perquè una semblança dubtosa (com «Pichu» quan es busca
«picachu») no passi davant de la carta bona.

**Per què:** a l'enquesta, una persona va buscar «el Picachu» i no el va
trobar. Amb paraules curtes gairebé tot s'assembla («mew» està a una lletra
de «dew» o de «hex»), i per això la tolerància no pot ser la mateixa per a
totes les llargades.

**Alternatives considerades:** fer servir una llibreria externa de cerca.
S'ha descartat: hauria afegit dependències per a una funció que cap en un
fitxer de 150 línies, i el projecte prefereix entendre el que fa.

**Cost:** 0 €.

## D-016 · On es busca la carta quan no saps l'expansió

**Data:** 2026-11-21

**Decisió:** quan s'escriu una cerca, la web busca també a les altres
expansions i ensenya els resultats en una franja «A altres expansions».
Per fer-ho, baixa les dades de les altres expansions la primera vegada que
es fa una cerca, i no en obrir la pàgina. **Aquesta manera de baixar-les
va durar poques hores: la D-017 la substitueix per un índex.**

**Per què:** a l'enquesta, dues persones van dir que no trobaven una carta
perquè no sabien de quina expansió era.

**Alternatives considerades:** preparar un fitxer petit amb només els noms
de totes les cartes (un «índex»). Es va descartar en un primer moment
perquè obligava a mantenir un fitxer nou, mentre que baixant les dades la
cerca incloïa sola qualsevol expansió nova. El preu era que la primera
cerca baixava al voltant d'1 MB comprimit amb 22 expansions. Ja es va
apuntar que, si les expansions creixien, caldria passar a l'índex.

**Cost:** 0 €.

## D-017 · Un índex lleuger per a la cerca, i què passa quan es prem «Actualitza»

**Data:** 2026-11-22

**Decisió:** la cerca a totes les expansions deixa de baixar les
expansions senceres i baixa un sol fitxer, `app/data/index-cerca.json`,
que només té el número i el nom de cada carta. La primera cerca passa de
baixar uns 20,7 MB (1,44 MB comprimits, en 44 peticions) a 92 KB (27 KB
comprimits, en una sola petició). L'expansió sencera només es baixa quan
es clica un resultat. El programa que baixa les dades
(`tools/fetch_data.py`) torna a fer l'índex cada cop que s'afegeix o
s'actualitza una expansió.

El botó «Actualitza» baixa dades noves d'una expansió i les desa al
navegador, però l'índex és un fitxer de la web i no canvia. Si una carta
canviés de nom o n'hi aparegués una de nova, la cerca podria mostrar una
cosa i, en clicar-la, la web n'obriria una altra. Per evitar-ho, quan una
expansió té al navegador una versió més nova que la de l'índex, la cerca
fa servir els noms d'aquella versió, que ja és a l'ordinador i no cal
baixar. I si mai hi ha una expansió que no surt a l'índex (per exemple, si
algú l'afegeix i s'oblida de pujar-lo), la web la baixa sencera com feia
abans: la cerca és una mica més lenta però mai incompleta.

**Per què:** la D-016 es va decidir quan la web tenia 14 expansions. El
mateix dia en van entrar 8 més (D-018), i baixar-les totes ja no era
raonable en un mòbil amb dades.

**Alternatives considerades:** no fer índex i mantenir la baixada
completa, que era més simple.

**Cost:** 0 €. Un fitxer més per mantenir, que es genera sol.

## D-018 · Afegir tot el bloc Scarlet & Violet, i no només la 151

**Data:** 2026-11-21

**Decisió:** s'afegeixen les 8 expansions del bloc Scarlet & Violet que
faltaven abans de Shrouded Fable: Scarlet & Violet, Paldea Evolved,
Obsidian Flames, 151, Paradox Rift, Paldean Fates, Temporal Forces i
Twilight Masquerade. La web passa de 14 a 22 expansions. La decisió es va
prendre abans de començar les millores.

**Per què:** a l'enquesta, dues persones demanaven més cartes, i una
demanava expressament la 151. Afegint tot el bloc, la web el té sencer i
no queda un forat entre expansions.

**Alternatives considerades:** afegir només la 151, que era el que es
demanava. Costava gairebé el mateix, perquè afegir una expansió és una
recepta que la màquina segueix sola, i deixava el bloc a mitges.

**Cost:** 0 €. Les dades creixen de 17,1 MB a 26,5 MB (uns 1,2 MB per
expansió). La web no es fa més lenta, perquè només es baixa l'expansió que
es mira, però el repositori sí que creix. I el treball escrit, que parla
de 14 expansions en diversos llocs, s'ha de posar al dia.

## D-019 · Què vol dir «treure els filtres»

**Data:** 2026-11-22

**Decisió:** el botó «Treu tots els filtres» torna a l'inici tot el que
**amaga cartes**: la cerca, «Què mostro», la raresa, el tipus d'energia i
la categoria. No toca l'ordre de la graella ni la vista (Graella o Àlbum).

**Per què:** l'ordre i la vista no amaguen res: només canvien com es
mostren les cartes. Si el botó els canviés, l'usuari perdria una
preferència que ha triat a consciència, cosa que no espera d'un botó que
es diu «treu els filtres».

**Cost:** 0 €.

## D-020 · Les cartes que no tens, en un gris més clar

**Data:** 2026-11-21

**Decisió:** les cartes que no es tenen continuen sortint en gris, però en
un gris més clar: es reconeix el Pokémon i es llegeix el nom, també a les
cartes fosques. La decisió es va prendre abans de començar les millores.

**Per què:** a l'enquesta, sis persones del formulari català deien que la
web no es veia bé a la pantalla i una altra la trobava «massa fosca». Les
cartes apagades, gairebé negres sobre un fons fosc, n'eren el candidat més
clar.

**Alternatives considerades:** ensenyar-les en color. Es va descartar
perquè el gris és el que permet saber d'un cop d'ull què es té i què no,
que és per al que serveix la web. Qui les vulgui veure en color ja ho pot
triar amb «Cartes que no tinc: En color».

**Cost:** 0 €.

## D-021 · Quines cartes brillen, i on

**Data:** 2026-11-22

**Decisió:** al zoom brilla el que tens. Si en tens alguna còpia holo, la
carta brilla com a holo. Si no en tens cap d'holo però sí alguna reverse,
brilla com a reverse. Si només la tens en normal, o no la tens (la carta
es veu apagada), no brilla. Quan les cartes que no es tenen es veuen en
color, també brillen les que existeixen en holo encara que no es tinguin.

On brilla:
- **Holo:** només la il·lustració.
- **Reverse:** tota la carta menys la il·lustració, com al paper de veritat.
- **Cartes d'art complet** (les «ex» i les Illustration, Ultra i Hyper Rare):
  la carta sencera, i les més rares amb purpurina.

**Per què:** la web és una eina de col·leccionista, i el que interessa és
veure *la teva* carta. Si una carta comuna brillés sempre que existeix en
reverse, brillarien gairebé totes i l'efecte deixaria de voler dir res. La
zona de la il·lustració s'ha mesurat sobre les imatges de les cartes
normals de Scarlet & Violet i Mega Evolution.

**Alternatives considerades:** fer brillar també les cartes de la graella i
de l'àlbum en passar-hi el ratolí. S'ha descartat per ara: amb 250 cartes
a la pantalla podria alentir els mòbils, i el zoom és on es mira una carta
de prop. Es va considerar també fer servir una llibreria d'efectes holo ja
feta, però hauria afegit pes i una dependència externa per a un efecte que
es pot fer amb unes poques línies de CSS.

**Cost:** 0 €.

## D-022 · Tema clar amb interruptor, i colors clars calculats

**Data:** 2026-11-21 (el tema clar) i 2026-11-22 (com es calculen els colors)

**Decisió:** la web es pot veure en tema clar, a més del fosc de sempre,
amb un interruptor «Tema: Clar / Fosc» a la capçalera. La tria es recorda,
i mentre no s'ha triat res la web fa servir el tema del dispositiu. La
decisió de fer el tema clar es va prendre abans de començar les millores.

La versió clara del color de cada expansió no s'escriu a mà: es calcula.
Es conserva el to i es baixa la lluminositat fins que el text de color es
llegeix bé sobre el fons clar (contrast 4,5:1, el mínim de la norma WCAG).
El tema s'aplica abans de pintar la pàgina, amb un script molt curt a
l'inici del document, perquè qui l'ha triat clar no vegi una pantalla negra
uns instants.

**Per què:** a l'enquesta, una persona va demanar poder canviar de fosc a
clar i una altra trobava la web «massa fosca». I hi ha 22 expansions,
cadascuna amb el seu color triat per al fons fosc: sobre blanc, un rosa
pàl·lid o un groc no es llegirien.

**Alternatives considerades:** escollir a mà 22 colors nous per al fons
clar. És fàcil equivocar-se amb el contrast, i cada expansió nova en
necessitaria dos. Amb la regla automàtica, el color de cada expansió es
reconeix en tots dos temes i una expansió nova només necessita el seu color
de sempre.

**Cost:** 0 €.

## D-023 · Al mòbil, botons flotants en lloc d'una capçalera fixa

**Data:** 2026-11-22

**Decisió:** al mòbil, quan s'ha baixat per la llista i la capçalera ja no
es veu, surten dos botons rodons a baix a la dreta: la lupa porta al
cercador i la fletxa torna a dalt de tot. A l'ordinador no surten.

**Per què:** calia tenir el cercador sempre a mà. La capçalera, fins i tot
compactada, fa uns 200 píxels: fixa, es menjaria una quarta part de la
pantalla tota l'estona. Els botons flotants només ocupen un cantó i només
surten quan fan falta.

**Alternatives considerades:** deixar la capçalera fixa a dalt, com a
l'ordinador.

**Cost:** 0 €.
