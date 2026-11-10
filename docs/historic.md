# Històric del projecte

Registre cronològic de cada pas nou del projecte, amb un títol i una
explicació breu. L'entrada més recent va al final.

---

## 1. Creació del repositori a GitHub

*2026-08-09*

Es crea el repositori `pokedanex` a GitHub (compte GerardRevesV) i es clona
a l'ordinador, dins de `C:\repos\Pokedanex`. El repositori guardarà tot el
projecte: codi, documentació, treball escrit i presentació, amb historial
de canvis des del primer dia.

## 2. Definició de les regles del projecte

*2026-08-09*

Es crea el fitxer `CLAUDE.md` amb les regles fonamentals: no escriure ni
una línia de codi a mà (tot el genera la IA), pressupost màxim de 20 €/mes,
treballar en català i documentar tot el procés.

## 3. Estructura de carpetes

*2026-08-09*

Es defineix l'estructura del repositori: `app/` per al codi, `docs/` per a
la documentació tècnica, `treball/` per al treball escrit i `presentacio/`
per a la presentació final. Així cada lliurable del treball de recerca té
el seu lloc.

## 4. Planificació per fases

*2026-08-09*

Es crea `docs/planificacio.md` amb 6 fases: especificacions (Fase 0),
fonaments tècnics, funcionalitats, publicació, treball escrit i
presentació. Cada fase té un objectiu i un lliurable clars.

## 5. Inici de la Fase 0 — entrevista d'especificacions

*2026-08-09*

Comença l'entrevista de preguntes i respostes per definir exactament què ha
de fer la web (usuaris, cartes, preus, disseny...). El resultat serà el
document `docs/especificacions.md`.

## 6. Nova norma: registrar cada pas a l'històric

*2026-08-09*

S'afegeix la norma que cada cosa nova que fem quedi registrada en aquest
mateix document, amb títol i explicació, per poder recordar i explicar els
passos seguits.

## 7. Respostes de l'entrevista i primera versió de les especificacions

*2026-08-09*

L'Edanna respon la primera ronda de preguntes de la Fase 0: la v1 funcionarà
en local, sense registre d'usuaris, amb una sola expansió (Shrouded Fable),
pensada per a ordinador, amb preus de Cardmarket (i CardTrader si es pot).
Amb aquestes respostes es crea `docs/especificacions.md` (versió 1).

## 8. Identificat el projecte d'inspiració "tcg" (Sorcery)

*2026-08-09*

Es localitza el projecte previ de col·leccionisme per a Sorcery: Contested
Realm a `C:\Users\gerar\Downloads\tcg`. Servirà d'inspiració per a Pokedanex
(marcatge de cartes, estètica). Norma: no es modifica mai. S'investigarà a
fons en un pla paral·lel que generarà `docs/recerca-tcg-sorcery.md`.

## 9. Investigació completada del projecte "tcg" (Sorcery)

*2026-08-09*

Es llegeix a fons el projecte tcg (sense tocar-ne cap fitxer) i es documenta
a `docs/recerca-tcg-sorcery.md`: inventari de tots els scripts i dades, com
funciona el flux complet (marcar cartes al navegador, memòria cau de preus,
generació de l'àlbum, optimitzador de venedors), què és específic de Sorcery
i no serveix, què necessita Pokémon que allà no hi és (variants reverse holo,
API de dades amb preus de Cardmarket, àlbum 3×3...), i quines idees d'estètica
i UX val la pena mantenir a Pokedanex.

## 10. Fase 0 tancada: especificacions completes

*2026-08-09*

Es responen les últimes preguntes: les variants *reverse holo* es tractaran
com els *foils* del projecte tcg de Sorcery (el detall el donarà la
investigació en paral·lel), els preus assumiran estat Near Mint, i només es
tindran en compte cartes en anglès. Amb això `docs/especificacions.md` queda
completa i la Fase 0 es marca com a acabada. La investigació del projecte
tcg s'ha llançat en una sessió paral·lela.

## 11. Especificacions versió 2 i calendari

*2026-08-09*

Es responen les últimes preguntes (comptar còpies com al projecte tcg,
objectiu de compleció triable per interfície, cost de completar amb suma
simple, data límit final de setembre) i s'incorporen les conclusions de la
investigació del tcg com a especificacions concretes: API de Pokémon TCG
sense scrapers, identificador estable per número, comptadors per variant
(normal/reverse/holo), `localStorage` amb exportació JSON, àlbum 3×3, tema
fosc i panell de valor/cost. S'afegeix el calendari a la planificació.

## 12. Investigades les propietats de les cartes Pokémon

*2026-08-09*

Amb dades reals de l'API pokemontcg.io sobre Shrouded Fable (99 cartes) es
documenten a `docs/propietats-cartes-pokemon.md` totes les propietats d'una
carta: identificació (id estable, número), classificació (supertype, subtipus,
tipus d'energia, 9 rareses), propietats de joc (PV, atacs, debilitats...),
de col·leccionista (il·lustrador, número de Pokédex) i els preus de
Cardmarket/TCGplayer incrustats amb variants reverse holo. També es detecten
riscos: l'API falla de tant en tant (502) i els preus de Cardmarket poden
anar endarrerits — reforça la idea de la cau local de dades.

## 13. Decisions de la Fase 1 preses

*2026-08-09*

Amb les respostes de l'Edanna es tanquen les decisions de fonaments: web
estàtica sense frameworks (D-002), dades de pokemontcg.io amb cau local
versionada — botó d'actualitzar que crea una versió nova amb data i
historial de versions sempre consultable (D-003), preus de Cardmarket amb
data visible (D-004), i interfície en tres idiomes seleccionables (català,
castellà, anglès) amb els noms de les cartes en anglès. Es guarda la clau
de l'API en un fitxer exclòs de GitHub. S'aprova el sistema d'orquestració
amb subagents (executors, validadors i arregladors).

## 14. Script de descàrrega de dades i primera versió

*2026-08-09*

Es crea `tools/fetch_data.py`, un script en Python (només llibreria
estàndard) que baixa de pokemontcg.io la informació del set Shrouded Fable
i les seves 99 cartes, es queda només amb els camps que la web fa servir i
ho guarda com una versió nova (amb data i hora, mai sobreescrivint res) a
`app/data/versions/`, actualitzant l'índex `app/data/versions.json`. Amb
l'script es genera la primera versió de dades (2026-08-09, 99 cartes).
Durant les proves apareixen dos entrebancs de l'API: retorna 403 si no
s'envia un User-Agent propi, i de tant en tant falla amb errors de servidor
(5xx), cosa que es resol amb reintents amb esperes creixents.

## 15. Esquelet de la web: graella, versions i tres idiomes

*2026-08-09*

Es crea la primera versió de la web dins `app/`: HTML, CSS i JavaScript
vanilla amb mòduls ES, sense frameworks ni eines de compilació (decisió
D-002). Mostra la graella de les 99 cartes ordenades pel número de
col·lecció, amb cercador per nom o número, selector de versions de dades
(les de fitxer i les creades des del navegador), botó "Actualitza dades"
que crea una versió nova desada al `localStorage`, peu amb la data de les
dades que s'estan veient i interfície en tres idiomes (català, castellà i
anglès) amb els noms de les cartes en anglès.

## 16. Doble revisió de l'esquelet i verificació al navegador

*2026-08-09*

Es revisa tota la feina de la Fase 1 dues vegades: primer amb els validadors
del workflow (7 problemes trobats i arreglats: versions que es sobreescrivien
el mateix dia, missatges sense traduir en canviar d'idioma, un fals missatge
d'èxit, una cursa de peticions, dades corruptes que tombaven la web i
reintents inútils), i després amb un revisor independent d'ulls frescos que
confirma els 7 arranjaments, no troba cap error crític nou i verifica que la
clau de l'API no apareix enlloc del repositori ni del seu historial. Es
corregeix una última cosa menor (l'script Python també reintentava errors
permanents). La web es comprova al navegador real: zero errors de consola,
canvi d'idioma instantani, cercador correcte, cartes secretes ben mostrades
i el botó "Actualitza dades" funcionant de punta a punta. Es crea també el
document d'arquitectura (docs/arquitectura.md).

## 17. Fase 1 tancada i nou flux de treball amb pull requests

*2026-08-09*

Es tanca la Fase 1 (l'estudi de CardTrader passa a la Fase 2) i s'adopta el
flux de treball professional amb branques i pull requests (decisió D-005):
els canvis es preparen en una branca, es pugen a GitHub i es revisen en un
pull request abans d'arribar a la branca principal. Per estrenar el flux es
crea el primer pull request de prova, que inclou aquesta mateixa
documentació i un últim poliment de la web (missatges d'error més precisos
al botó d'actualitzar: ara distingeix si la culpa és de l'API o d'un
problema local).

## 18. Fase 2 construïda: col·lecció, àlbum 3×3 i estadístiques

*2026-08-09*

L'equip d'agents construeix el cor de la web en quatre blocs encadenats:
l'estat de la col·lecció (comptadors per variant normal/reverse/holo desats
al navegador, amb exportar/importar/buidar), el marcatge a la graella
(botons +/− d'un sol clic, cartes apagades si no les tens, filtres "les
tinc"/"em falten"), la vista d'àlbum de carpesà real (dues pàgines de 3×3
butxaques amb navegació) i el panell d'estadístiques ("la teva col·lecció
val X €" / "completar-la costaria Y €", amb objectiu de compleció triable).
Els validadors troben 6 problemes (entre ells dos forats subtils de
seguretat a la importació de JSON) i l'arreglador els tanca tots 6.

## 19. Recerca: l'API de CardTrader

*2026-08-09*

En paral·lel a la construcció, un agent investiga l'API de CardTrader com a
font de preus més fresca que els de Cardmarket incrustats a pokemontcg.io.
Conclusió (docs/recerca-cardtrader.md): és viable i gratuïta (calen compte
i token, que hauria de crear un adult), dona ofertes reals en euros carta a
carta, i encaixa amb la cau versionada via l'script de dades — però
s'adoptarà més endavant, quan toqui polir el bloc de preus; ara no aporta
prou per justificar la complexitat.

## 20. Doble revisió de la Fase 2 i pull request

*2026-08-09*

Es revisa tota la Fase 2 dues vegades: els validadors del workflow (6
problemes, tots arreglats) i un revisor independent que confirma els 6
arranjaments, refà els càlculs del panell pel seu compte (li quadren
cèntim a cèntim), comprova les 46 claus de traducció als 3 idiomes sense
cap forat, i verifica que la clau de l'API no apareix enlloc. La web es
prova al navegador real: marcar cartes, filtres, àlbum amb navegació,
objectiu de compleció canviant el cost a l'instant (12,88 € el set base;
525,53 € el complet — les secretes són les cares) i zero errors de
consola. La Fase 2 es tanca i s'obre el pull request perquè es revisi i
es fusioni.

## 21. Fase 2.1: zoom, filtres desplegables i pastilles de tipus

*2026-08-10*

Es tapen els tres forats detectats en repassar les especificacions després
de la Fase 2, cadascun amb el seu planificador i executor propis: el zoom
d'imatge gran en clicar una carta (amb accessibilitat: focus atrapat i
tancament amb Escape), els filtres desplegables de raresa, tipus d'energia
i categoria (construïts dinàmicament de les dades i combinables amb el
cercador i els filtres de col·lecció) i les pastilles de color dels tipus
(amb contrast WCAG AA verificat per càlcul). També s'unifica l'accés a
localStorage via storage.js i s'amplia la decisió D-006 després de
comprovar el comportament real del codi. Auditoria doble: 4 problemes
trobats i arreglats, i un revisor independent que ho aprova tot.

## 22. Marcatge ràpid amb clics i menú de variant activa

*2026-08-10*

A petició de l'Edanna: un menú nou (Consulta / Normal / Reverse / Holo) fa
que el clic esquerre sobre una carta afegeixi una còpia de la variant
activa i el clic dret en tregui una — tant a la graella com a l'àlbum, amb
flaix de vora com a resposta visual, sacseig si la carta no té la variant
triada, i un distintiu amb el comptador a cada butxaca de l'àlbum. En mode
Consulta tot es comporta com abans (zoom i salt àlbum→graella). Revisat
pels subagents: l'auditor UX no troba cap incompliment i el revisor de codi
troba 2 detalls del flaix visual, arreglats per l'arreglador.

## 23. La web ja és pública a internet (GitHub Pages)

*2026-08-10*

Comença la Fase 3: la web es pot visitar des de qualsevol lloc a
https://gerardrevesv.github.io/pokedanex/. Es fa amb un flux automàtic de
GitHub Actions (`.github/workflows/pages.yml`, pull request #3) que publica
la carpeta `app/` cada vegada que hi ha un canvi a la branca principal
(`main`): a partir d'ara, fusionar un canvi vol dir publicar-lo. La web
publicada es verifica en viu: carrega les 99 cartes amb els seus preus,
marcar cartes funciona i actualitza les estadístiques a l'instant, no hi ha
cap error de consola i en pantalla de mòbil (375 px) no apareix cap
desbordament horitzontal.

## 24. Repositori públic, republicació automàtica comprovada i adreça en estudi

*2026-08-10*

Tres passos que completen l'entrada anterior. Primer: per poder fer servir
GitHub Pages gratuït calia que el repositori fos públic, i abans de fer el
pas es va verificar que a tot l'historial de canvis no hi hagués cap secret
(la clau de l'API mai no s'ha pujat); el detall és a la decisió D-007.
Segon: es comprova que el flux automàtic funciona de debò — en fusionar la
Fase 2.1, la web pública s'ha republicat sola i al cap d'un minut ja
mostrava els filtres nous i el menú de marcatge, sense haver de tocar res.
I tercer: s'estudia com fer que l'adreça de la web no porti el nom personal
del compte: la proposta és crear una organització gratuïta de GitHub
anomenada «pokedanex» (nom comprovat: és lliure) i traslladar-hi el
repositori, cosa que donaria l'adreça https://pokedanex.github.io/. La
decisió queda pendent.

## 25. Fase 2.2: preu a cada fitxa i ordenació de la graella

*2026-08-10*

Dos poliments nous a la graella. Primer, cada fitxa mostra el **preu
orientatiu de Cardmarket** (el de la variant normal o, si no en té, el de
la primera variant amb preu conegut), formatat en euros segons l'idioma
actiu; si no se'n coneix cap, un guió amb l'explicació en passar-hi el
ratolí. Segon, un **selector d'ordenació**: número de col·lecció (el
defecte), preu (més cara primer), il·lustrador (A-Z) i número de Pokédex —
només afecta la graella, perquè l'àlbum és el carpesà físic i sempre va
per número. Com que cap carta de les dades actuals (2026-08-09) porta el
camp de l'il·lustrador, aquesta opció es mostra desactivada fins que una
versió de dades el porti. De passada, dues micro-correccions: s'aclareixen
els colors de les pastilles «darkness» i neutra per complir el contrast
WCAG AA sobre el fons de la fitxa, i el zoom neteja el seu estat de
càrrega en tancar-se.

## 26. La fitxa-zoom marcable: col·leccionar des de l'àlbum

*2026-08-10*

A petició de l'Edanna, el zoom es converteix en la fitxa completa de la
carta: en mode Consulta, clicar una butxaca de l'àlbum (o una carta de la
graella) obre la imatge gran amb els comptadors − / + de totes les
variants de la carta, actualitzats en viu, i un botó "Veure a la graella"
que substitueix l'antic salt directe. Així es pot afegir qualsevol variant
(normal, reverse o holo) sense sortir de l'àlbum ni canviar el menú de
marcatge. Lliçó de revisió interessant per al treball: el pla original
incloïa marcar amb clic esquerre/dret sobre la imatge gran, però els
revisors van descobrir que era codi impossible d'activar (el zoom només
s'obre en mode Consulta, on no hi ha variant activa) i es va retirar,
deixant els botons com a única via — més simple i suficient.

De la mateixa revisió en van sortir quatre retocs: la fitxa del zoom ara
fa scroll intern quan no cap a la pantalla (en finestres baixes, el × de
dalt i el botó de sota podien quedar retallats), es retira un `id` que
havia quedat sense ús al codi HTML, els selectors que busquen una carta
pel seu identificador es protegeixen amb `CSS.escape`, i l'ordre per
número de col·lecció passa a una comparació de text amb sentit numèric
que no es trencaria amb números com "TG01" d'altres sets.

## 27. Dues IA treballant alhora: el primer conflicte de veritat

*2026-08-11*

Durant les fases 2.x i 3 hi havia dues sessions d'IA treballant en
paral·lel en branques diferents, i va passar el que passa als equips de
programadors de veritat: totes dues van escriure als mateixos documents
(l'històric, el diari) i, en ajuntar les feines, git va avisar de
**conflictes de fusió** — fins i tot hi va haver dues entrades numerades
"21" alhora. Es van resoldre com ho fan els professionals: llegint les
dues versions, conservant-ho tot i renumerant en ordre cronològic. És un
episodi valuós per al treball: demostra que el flux de branques i pull
requests (decisió D-005) no era teatre — va evitar que una feina trepitgés
l'altra, i el conflicte es va detectar i resoldre de manera controlada.

## 28. El mètode de treball amb IA, consolidat

*2026-08-11*

Després de tres fases, la manera de treballar ha quedat fixada en un patró
que es repeteix a cada bloc de feina i que és, a la pràctica, la resposta
del projecte a la pregunta del treball ("es pot fer una web sense saber
programar?"): (1) un agent **planificador** escriu el pla concret de la
tasca; (2) un agent **executor** el construeix; (3) dos agents **revisors**
independents l'auditen alhora — un contra les especificacions i l'altre
buscant errors al codi; (4) un agent **arreglador** diferent tapa el que
troben; (5) un **revisor final d'ulls frescos** ho torna a mirar tot; i
(6) la web es prova al **navegador de veritat** abans del pull request.
Balanç fins avui: 5 pull requests fusionats, més de 40 subagents
coordinats, prop de trenta problemes trobats i arreglats **abans**
d'arribar a la branca principal (entre ells dos forats de seguretat i codi
mort que semblava correcte), i 0 € gastats en serveis. La lliçó clau per
al treball: la persona no escriu codi, però la **revisió per capes** és el
que fa que el resultat sigui fiable.

## 29. El mode Catàleg: totes les cartes a tot color

*2026-08-11*

A petició de l'Edanna, un commutador nou de visualització vora el de
Vista: el mode **Col·lecció** (l'habitual, amb les cartes que no tens
apagades i grisoses) i el mode **Catàleg**, que il·lumina totes les
cartes a tot color, tant a la graella com a l'àlbum, per poder gaudir
del set sencer com en un catàleg oficial. Perquè no es perdi la lectura
ràpida de què tens, en mode Catàleg les cartes tingudes porten un **marc
daurat fi** (un fil d'or amb degradat, triat entre tres propostes de
disseny: l'or crea un llenguatge propi per a "tinguda" sense confondre's
amb el turquesa, que ja vol dir interacció a tota la web). La preferència
es recorda al navegador i el canvi és tot CSS condicionat per un atribut
del body — el mateix patró senzill que ja usava el menú de marcatge —,
sense tocar ni la col·lecció ni els filtres.

## 30. Ctrl+clic: el zoom des de qualsevol mode

*2026-08-11*

Fins ara hi havia una limitació coneguda: amb un mode de marcatge actiu
(Normal, Reverse o Holo) no es podia obrir el zoom d'una carta, perquè el
clic ja volia dir "suma una còpia". A petició de l'Edanna s'ha afegit una
drecera universal: **Ctrl+clic** (Cmd al Mac) sobre una carta obre el
zoom sempre, a la graella i a l'àlbum, sigui quin sigui el mode — i sense
marcar res. El mode Consulta queda exactament com era (clic normal =
zoom). Perquè la drecera es descobreixi sola, en mode de marcatge les
cartes mostren un rètol en passar-hi el ratolí per sobre ("Ctrl+clic:
veure la carta"), traduït als tres idiomes.

## 31. El selector d'expansions: el logotip que obre "el Compendi"

*2026-08-11*

Amb els fonaments multi-expansió a punt, calia una manera bonica i
escalable de canviar de set. Es van redactar tres propostes de disseny
(vitrina, panell-llista i carrusel) i va guanyar el **panell-llista**:
el logotip del set a la capçalera ara és un botó (amb un caret ▾) que
obre un panell modal amb totes les expansions agrupades per sèrie, cada
una amb el seu símbol, la data de sortida, una mini-barra de progrés
("12/99") i un filet del seu color. El panell té **cerca instantània**,
es mou amb les fletxes del teclat, s'obre amb **Ctrl+K** i es tanca amb
Esc o clicant fora — tot gràcies a l'element `<dialog>` natiu del
navegador, que regala el teló i el comportament de finestra modal sense
codi propi. A més, cada expansió pot tenir el seu **tema de colors**:
en canviar de set, l'accent de tota la web llisca en 300 ms cap al color
del set (Shrouded Fable és lila, pel Pecharunt de la portada), amb un
interruptor al peu del panell per qui prefereixi el turquesa de sempre.

## 32. Prismatic Evolutions: la segona expansió (i l'estrena de la skill)

*2026-08-11*

S'ha afegit la segona expansió del Compendi: **Prismatic Evolutions**
(`sv8pt5`, gener del 2025), el set de l'Eevee i les seves evolucions,
amb 131 cartes numerades i secretes fins a 180. És la primera expansió
afegida seguint la **skill** `afegir-expansio` de dalt a baix: baixada i
registre amb `fetch_data.py`, tema visual propi i verificació al
navegador. El tema triat és un **daurat prismàtic** (`#f0a830`), el
color de les gemmes irisades del logotip i de la identitat "prismàtica"
del set, amb contrastos WCAG AA verificats per càlcul (entre 8,3:1 i
9,3:1 sobre els tres fons foscos, i 8,7:1 el text sobre l'accent).

## 33. Botonet per invertir l'ordre de les expansions

*2026-08-11*

Al panell del Compendi s'ha afegit un **botonet amb una fletxa** (↑/↓)
al costat de la cerca que inverteix l'ordre de la llista d'expansions:
per defecte va del més antic al més nou, i amb un clic passa del més
nou al més antic. La preferència es desa al navegador (localStorage),
de manera que es recorda entre visites, i el rètol del botó explica en
tot moment quin ordre hi ha aplicat i què farà el clic.

## 34. Campanya mòbil: 89 problemes en 3 rondes d'exploradors

*2026-08-11*

S'escomet la visualització mòbil amb l'operatiu més gran del projecte: 3
rondes de 8 exploradors (capçalera, graella, àlbum, diàlegs, tàctil,
tipografia, rendiment i transversal) seguides cadascuna d'un
planificador-arreglador i un revisor — 30 agents i 89 problemes reals
arreglats. Els més grossos: l'àlbum passa a una sola pàgina en pantalles
petites, la capçalera compacta els controls rere un botó de filtres, el
Compendi guanya un botó × (en tàctil no hi ha tecla Esc), restar còpies a
l'àlbum té botonet propi (el clic dret no existeix al mòbil), mantenir el
dit obre el zoom, els objectius tàctils pugen als 44px recomanats, s'evita
el zoom automàtic de l'iPhone als camps de text, i s'afegeix suport per a
prefers-reduced-motion. Tot el CSS mòbil viu dins @media (767px, 480px,
pointer coarse) i el revisor de cada ronda certifica que l'escriptori
queda intacte.

## 35. Dotze expansions de cop: el Compendi es posa al dia

*2026-08-11*

S'han afegit **totes les expansions publicades des de Shrouded Fable
fins avui**: 12 sets nous que se sumen als 2 que ja hi havia, fins a un
total de **14 expansions i 2.464 cartes**. Són *Stellar Crown*,
*Surging Sparks*, *Journey Together*, *Destined Rivals*, *Black Bolt*,
*White Flare* (Scarlet & Violet) i *Mega Evolution*, *Phantasmal
Flames*, *Ascended Heroes*, *Perfect Order*, *Chaos Rising* i *Pitch
Black*, aquests sis de la sèrie nova **Mega Evolution**, que el
Compendi agrupa automàticament sota el seu propi títol. Cada set té el
seu **tema de color** triat a partir del logotip i verificat per càlcul
amb contrast WCAG AA. Els 4 sets més nous encara no tenen art al CDN
oficial (serveixen un revers de carta genèric per a tots): s'ha resolt
fent que `fetch_data.py` usi els **logotips de TCGdex**, una font
alternativa oberta, mentre no arribi l'art oficial. La llista del
Compendi ja feia scroll per dins del panell, així que el menú aguanta
el creixement sense cap canvi.

## 36. Nou document «Reptes»: les dificultats, explicades per al treball

*2026-08-11*

Es crea `docs/reptes.md`, el germà de l'històric però amb la funció
inversa: si l'històric diu QUÈ hem fet, els Reptes diuen QUÈ HA COSTAT.
Recull els processos que han estat difícils de fer o d'entendre per a
una persona que no programa, explicats en un o dos paràgrafs de prosa
acabada, a punt per copiar al treball escrit. S'estrena amb cinc reptes
recuperats del passat del projecte — de l'API que fallava fins a les
dues sessions d'IA que van barrejar les feines i el fitxer perdut que
hauria trencat la web — i s'afegeix la norma 8 al CLAUDE.md perquè, a
partir d'ara, cada dificultat nova hi quedi registrada al moment.

## 37. Els preus que no hi eren: la reserva de TCGplayer

*2026-08-13*

L'Edanna descobreix que a Prismatic Evolutions i als sets de Mega
Evolution el valor de la col·lecció i el cost de completar surten a zero.
La investigació ho aclareix: l'API no porta cap preu de Cardmarket per a
aquests sets (el seu bloc està desactualitzat). Els de TCGplayer sí que
hi són, però només als tres sets que TCGplayer ja té llistats (Prismatic
Evolutions, Mega Evolution i Phantasmal Flames). S'implementa la cadena
de reserva de la decisió D-009: Cardmarket primer i, si no n'hi ha,
TCGplayer convertit de dòlars a euros amb una taxa fixa, marcat amb «≈»
a la fitxa i amb una nota al panell d'estadístiques quan els totals en
contenen. Els quatre sets sense cap preu enlloc (Ascended Heroes,
Perfect Order, Chaos Rising i Pitch Black, massa nous) mantenen el guió
i el recompte honest de cartes sense preu — comprovat a la cau i, en la
mesura que l'API en viu va respondre aquell dia, també contra l'API.

## 38. L'efecte de llibre: el full que gira en passar pàgina

*2026-11-03*

Fins ara la vista d'àlbum canviava de pàgina d'una revolada: les cartes
desapareixien i n'apareixien unes altres al mateix lloc. Ara passa com en
un llibre de debò. En clicar la fletxa ›, el full de la dreta s'aixeca,
volta sobre el llom del carpesà i cau cap a l'esquerra; mentre volta
ensenya pel darrere la pàgina nova, i per sota apareix la pàgina dreta
següent. La fletxa ‹ fa el mateix moviment del revés. El gir dura poc més
de mig segon i porta un vel d'ombra que enfosqueix el paper mentre
s'aixeca i el torna a la llum quan s'ajeu: és l'ombra, més que el
moviment, la que fa que sembli paper. En pantalles estretes, on l'àlbum
mostra una sola pàgina, el full volta sobre si mateix.

Tot està fet amb els efectes 3D del CSS i l'API d'animacions que el
navegador ja porta, sense cap llibreria ni cap cost. Si l'ordinador o el
mòbil tenen activada l'opció d'accessibilitat «redueix el moviment», o si
el navegador és massa antic per animar, el canvi de pàgina es fa sec com
abans: l'àlbum continua funcionant igual.

## 39. Els documents oficials del treball: requisits i rúbrica, en un full

*2026-11-03*

L'institut facilita tres documents per al treball de recerca: les
orientacions de la promoció 25-27, les de la promoció anterior i el full de
càlcul de la rúbrica amb què el tribunal posa la nota. Se'n fa un buidatge
complet i es destil·la a `treball/requisits-i-rubrica.md`: el calendari, el
repartiment de la nota (escrit 30 %, oral 35 %, procés 35 %), els trenta
criteris de les tres rúbriques —cadascun valorat de 0 a 1 en passos de
0,25—, les parts obligatòries i el format del document escrit, les
condicions que fan suspendre i les normes de citació. Del full de càlcul
se n'extreu la fórmula real de la nota, que els documents d'orientacions no
detallen, i l'escala exacta de cada criteri. L'últim apartat llegeix el
projecte Pokedanex amb els ulls de la rúbrica: la web és la «part pràctica»
i val 2 dels 10 punts de la memòria escrita, l'abstract ha d'anar en una
llengua estrangera i les faltes d'ortografia són eliminatòries. La
comparació amb les orientacions de la promoció anterior deixa clara la
direcció del canvi: ara pesa més el que es defensa en viu que el paper.

## 40. El guió del treball escrit: què s'explica, com s'ordena i què sobra

*2026-11-03*

Pluja d'idees sobre els continguts del treball escrit, recollida a
`treball/guio-continguts.md`. Es parteix de la llista de temes de l'Edanna
(skills, regles, GitHub, fusions, proves, branques, agents, memòria,
plans, continguts de la web, allotjament, errors, mòbil) i es creua amb
l'inventari del que ja hi ha escrit a `docs/` i amb els criteris de la
rúbrica. En surt un índex de quatre parts —marc teòric, metodologia,
el producte, i resultats i conclusions— amb 27 capítols i un repartiment
de pàgines, amb una idea rectora: **el treball no explica les eines, sinó
per què va caldre cada eina**, perquè totes van entrar al projecte el dia
que un problema concret les va exigir i això ja està datat a l'històric.
L'anàlisi detecta tres coses incòmodes i les deixa escrites: el marc
teòric no existeix en absolut i és precisament el que es lliura al primer
esborrany, el projecte no té cap prova automàtica (la comprovació ha estat
manual i per agents revisors) i els *dynamic workflows* de la llista no
s'han fet servir mai, de manera que explicar-los com a experiència seria
inventar. També es recullen les xifres reals del repositori per tenir-les
a mà al treball: 5.632 línies de codi en 14 fitxers, cap escrita a mà, 40
commits, 10 pull requests, 13 branques, 14 expansions i 0 € gastats.

## 41. El marc teòric, escrit: de la piulada de Karpathy a la «programació per intenció»

*2026-11-03*

S'escriu la Part I del treball a `treball/marc-teoric.md`: set capítols que
van de què vol dir programar fins a què diu la recerca sobre si això
funciona, passant per l'origen del terme, el funcionament d'un model de
llenguatge, la diferència entre un xat i un agent, les quatre menes de
memòria que es confonen i el panorama d'eines. Abans d'escriure res es
busquen i es verifiquen fonts externes, que era el forat més gros que havia
detectat el guió de continguts. Les tres troballes que més valen per a un
treball en català són institucionals: el **TERMCAT** ha fixat
**«programació per intenció»** com a equivalent català de *vibe coding*, el
**Departament d'Educació** té material propi sobre el tema i la
**Universitat de Girona** hi ha publicat un article de panorama. A fora,
queden documentats la piulada original de Karpathy del 2 de febrer del
2025, la proclamació de *vibe coding* com a paraula de l'any del diccionari
Collins el novembre del 2025, i tres estudis que donen al treball una
predicció comprovable en comptes d'un entusiasme: el 45 % de codi generat
amb vulnerabilitats de Veracode, la caiguda de confiança de l'enquesta de
Stack Overflow i l'assaig de METR en què els programadors experimentats van
un 19 % més lents amb IA mentre creuen que van més de pressa. La decisió
conceptual del capítol 2 és la que ordena tot el treball: Pokedanex **no és
*vibe coding* en sentit estricte**, perquè ningú no hi ha escrit codi però
tampoc no s'hi ha acceptat res sense revisar. Es crea també
`treball/fonts.md`, amb la bibliografia en el format que demana l'institut i
amb l'estat de verificació de cada font, perquè les dades que només s'han
pogut llegir de segona mà quedin marcades i es comprovin abans del
lliurament.

## 42. L'estudi d'usabilitat: 31 controls, vuit casos d'ús i nou confusions

*2026-11-03*

L'Edanna detecta que «hi ha filtres com raresa, tipus o energia que no
s'apliquen» i demana un estudi de casos d'ús de totes les funcionalitats,
per saber si la interfície és confusa. L'estudi es fa en tres capes i es
desa a `docs/estudi-usabilitat.md`: primer un inventari dels 31 controls de
la pantalla principal, llegint el codi per saber on té efecte cadascun;
després vuit casos d'ús recorreguts pas a pas; i finalment unes mesures
sobre les dades reals de les 14 expansions (2.464 cartes) per decidir amb
números i no d'intuïció. La sospita era certa i té una causa concreta: sis
controls —el cercador, el filtre Totes/Les tinc/Em falten, Raresa, Tipus
d'energia, Categoria i Ordena per— només funcionen a la vista Graella,
perquè la graella es construeix passant les cartes pel sedàs dels filtres
mentre que l'àlbum agafa la llista sencera; a la vista Àlbum es queden
visibles i actius sense fer res. Les mesures aporten tres dades que no
s'havien vist mai: el 58,4 % de les combinacions possibles dels tres
desplegables no retorna cap carta, cada valor d'un filtre està escampat per
un terç de les pàgines de l'àlbum (cosa que descarta la idea de «portar-te
a la pàgina de l'energia»: no existeix), i les rareses ocupen pàgines
seguides el 94 % de les vegades mentre que els tipus només el 3 %, perquè
les cartes especials del final del set repeteixen tots els tipus una segona
vegada. En total es documenten nou confusions ordenades per gravetat i una
recomanació de vuit punts, començant per convertir els filtres en un
ressaltador amb navegació a l'àlbum. Cap de les nou és un error de
programació: totes són forats entre peces o paraules mal triades.

## 43. L'estudi que es va espatllar, i la veu del treball

*2026-11-03*

Dues esmenes al marc teòric a partir d'observacions de l'Edanna, i totes
dues milloren el treball.

La primera: l'estudi de METR del 2025 que diu que els programadors van un
19 % més lents amb intel·ligència artificial estava citat sense dir que
mesurava **les eines de principis del 2025**. Buscant-ho, apareix que el
mateix METR va repetir l'experiment des de l'agost del 2025 amb 57
programadors i més de 800 tasques, i que el febrer del 2026 va publicar que
els resultats ja no són concloents —els intervals de confiança inclouen el
zero— i que **canvia el disseny de l'estudi**. El motiu pel qual se'ls va
espatllar és la dada més bona de tot el capítol: entre el 30 % i el 50 %
dels participants renunciaven a enviar tasques perquè no les volien fer
sense intel·ligència artificial, i un d'ells no en va completar ni una. En
poc més d'un any l'eina havia passat de frenar mesurablement els experts a
ser una cosa sense la qual no volien treballar. El capítol 7 queda reescrit
amb tres precaucions en comptes de dues, amb les fonts primàries de
metr.org verificades i amb una conclusió nova: com que no hi ha cap mesura
fiable de les eines d'avui, un projecte documentat pas a pas amb xifres
reals no és una anècdota, és una aportació.

La segona: al text s'hi havia escolat un «nosaltres» i, pitjor, una paraula
en castellà. Es corregeixen, i la qüestió de fons queda escrita com a norma
al guió de continguts (apartat 10): impersonal al cos del treball, primera
persona del singular a la Presentació i a l'autocrítica, i **«nosaltres»
mai**, perquè el treball de recerca és individual i un plural convida el
tribunal a preguntar-se quina part és de l'autora. S'afegeix també al guió
l'apartat 11, amb l'ordre de la feina que queda, posant primer el que té
temps d'espera: confirmar dates amb el tutor, buscar les persones per a les
proves d'usuari i verificar les fonts pendents.

## 44. Quatre revisors per a un text, i els documents publicats a internet

*2026-11-04*

Dues feines en una sessió. La primera: el marc teòric passa pel mateix
mètode de revisió per capes que fins ara s'havia aplicat només al codi.
Quatre revisors independents i simultanis, cadascun amb un únic criteri
—nivell i claredat, síntesi, rigor de les fonts i llengua catalana—, i un
orquestrador que decideix què s'aplica i resol els casos en què dos
revisors demanen coses contràries. El resultat queda registrat a
`treball/revisio-marc-teoric.md`: el text passa de 4.512 a 3.454 paraules i
de set capítols a cinc, i es corregeixen tretze errades de llengua greus
—entre elles «oblita» per «oblida» i «donat tot el text» per «a partir de
tot el text»—, qualsevol de les quals hauria fet suspendre el treball
segons la norma de l'institut. Les tres troballes de fons són pitjors i més
útils: el «0 €» del text contradeia el diari del projecte, que diu que el
cost de la subscripció d'IA està pendent de documentar; una citació de
Simon Willison estava mal transcrita («clarament arriscat» quan ell va
escriure «clarament una idea terrible»); i en explicar per què METR va
haver de canviar el seu experiment s'havia omès que la paga dels
participants havia baixat de 150 a 50 dòlars l'hora, que és el motiu que
més afebleix la interpretació. Es verifiquen també les nou fonts que
quedaven pendents, amb la troballa que el 2,74× que circula per internet
sobre codi generat per IA és només de *cross-site scripting*, no una xifra
general.

La segona feina: els documents del projecte ja es poden llegir des de
qualsevol ordinador. Es crea un lector a `app/documents/` amb índex
lateral, filtre de cerca i els documents agrupats, i un script
(`tools/prepara_documents.py`) que el desplegament executa per copiar
`docs/` i `treball/` dins de la web. La còpia no es guarda al repositori:
es genera a cada publicació, de manera que la web sempre serveix l'última
versió dels documents sense mantenir res a mà.

## 53. Les barres d'estadístiques, aixafades al mòbil: una línia de CSS

*2026-11-10*

En fer les captures de mòbil per a la Part III del treball es va veure, de
passada, que amb el panell d'estadístiques obert les barres de progrés
quedaven aixafades i el recompte («30/99») sortia tallat per la dreta. Es
comprova al navegador amb una pantalla simulada de 390 píxels i es
confirma: el bloc de les barres feia 83 píxels d'ample, la barra en si en
feia 2, i el recompte acabava 11 píxels més enllà de la vora de la
pantalla.

La causa és una regla que ja volia arreglar això mateix. En pantalles
estretes es treia l'amplada mínima del bloc de barres i se li demanava
«ocupa el 100 %», però aquesta segona ordre no tenia cap efecte: una regla
anterior, la que reparteix l'espai del panell, la deixava sense valor. Sense
mínim i sense amplada pròpia, el bloc ja no saltava a la línia de sota i es
conformava amb el racó que deixaven lliure els controls de l'objectiu. La
correcció és una sola línia a `app/css/style.css`, dins del bloc de
pantalles de fins a 480 píxels: la mateixa ordre, dita amb la propietat que
sí que mana (`flex-basis`). Ara el bloc ocupa una fila sencera: a 390
píxels la barra passa de 2 a 165 píxels i el recompte es llegeix sencer; a
320 píxels també hi cap. L'escriptori no canvia, perquè la regla només
s'aplica a pantalles estretes.

La numeració d'aquesta entrada salta del 44 al 53 expressament: les
entrades 45 a 52 són en branques que encara no s'han fusionat a `main`.
