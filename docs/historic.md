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

## 45. Els filtres arriben a l'àlbum: ressaltar en comptes de filtrar

*2026-11-04*

S'implementen els dos primers punts de la recomanació de l'estudi
d'usabilitat. **Punt 1:** la cerca i els quatre filtres ja no són decoratius
a la vista d'Àlbum. Com que un àlbum amb forats és justament el que un
col·leccionista vol veure, no amaguen butxaques: encenen les cartes que
coincideixen amb un anell del color d'accent, apaguen la resta, i afegeixen
una barra que diu «4 cartes coincideixen · pàgines 1, 8» amb dues fletxes
per saltar de pàgina en pàgina amb coincidències. Si la pàgina oberta no en
té cap, l'àlbum hi salta tot sol: és la idea original de «porta'm a la
pàgina» feta de la manera que les dades permeten, perquè no existeix «la
pàgina» d'un tipus (D-011). El control «Ordena per» s'amaga a l'àlbum,
perquè l'ordre d'un àlbum és físic. **Punt 2:** els tres desplegables
desactiven les opcions que, amb els altres dos tal com estan, no deixarien
passar cap carta —l'exemple clar és qualsevol tipus d'energia amb la
categoria «Entrenador»—, cosa que tanca el 58,4 % de combinacions buides que
havia mesurat l'estudi; i el missatge de graella buida ha deixat de culpar
sempre «la cerca»: ara enumera els criteris que han deixat fora les cartes
(«Cap carta no coincideix amb la cerca «zzzz» · Raresa: Rare.») i porta un
botó «Treure els filtres». Tècnicament, el canvi de fons és que la cerca i
els filtres viuen ara en un sol lloc (`predicatActual()` a `main.js`) que
alimenta els dos camins que pinten cartes, la graella i l'àlbum: era la
separació entre aquests dos camins la que havia creat el problema.

## 46. Les paraules de la interfície: «Colors», «Què mostro» i quatre paranys menys

*2026-11-04*

S'acaben els punts 3 a 8 de la recomanació de l'estudi d'usabilitat, els que
no són de funcionament sinó de **comprensió**. «Visualització» passa a
«Colors»; el filtre «Col·lecció» passa a «Què mostro»; el panell
d'estadístiques, que sempre havia calculat només l'expansió oberta mentre es
titulava «de la col·lecció», ara ho diu —«Estadístiques d'aquesta
expansió»—, i el comptador del peu també; el botó «Buidar», que esborra
totes les expansions, passa a «Buidar-ho tot»; i «Consulta» passa a «Només
mirar». Amb això, la paraula «col·lecció» deixa de voler dir tres coses
diferents a la mateixa pantalla. Es tanquen també quatre paranys: al mòbil
el botó «Filtres i opcions» porta un distintiu amb el nombre de filtres
actius (amb el bloc plegat no hi havia cap pista que n'hi hagués); Importar
demana confirmació abans de substituir la col·lecció sencera, com ja feia
Buidar; canviar d'expansió treu la cerca i els filtres, que abans hi
viatjaven i obrien l'expansió nova amb vuit cartes i cap explicació; i la
pista del Ctrl+clic per veure una carta en gran mentre marques, que a
escriptori només es descobria per sort, ara surt com a missatge en entrar en
un mode de marcatge. Finalment, «Versió de les dades» i «Actualitza» s'ajunten
sota un sol títol, «Dades». Tot són canvis de text i de detall —cap
funcionalitat nova— i queden registrats a la decisió D-012.

## 47. Els comentaris de l'Edanna al marc teòric, aplicats

*2026-11-07*

L'Edanna va deixar nou comentaris sobre `treball/marc-teoric.md` a la pàgina
del pull request #13. Dos demanaven treure text, sis deien alguna variant de
«no ho entenc, canvia-ho o explica-ho millor» i un era la prova de
verificació del canal, de la setmana passada. En anar a aplicar-los va
aparèixer una sorpresa: set dels nou fils constaven com a **resolts** i, en
canvi, el fitxer no s'havia tocat des del 4 de novembre. Els havia resolt
ella mateixa just després d'escriure'ls, entenent «Resolve conversation» com
«ja t'ho he enviat» i no com «ja està arreglat». No s'havia perdut cap
petició, però tampoc no se n'havia aplicat cap. En aquesta sessió s'han
aplicat totes vuit.

**El que s'ha tret.** L'avís entre parèntesis que deia que la piulada de
Karpathy no s'havia pogut consultar directament; la frase sobre la paga dels
participants de l'estudi de METR, que allargava el raonament sense
sostenir-lo; i el paràgraf sencer «Un cas concret i una veu crítica», que
portava el cas de les aplicacions de Lovable amb dades exposades i la frase
de Simon Willison.

**El que s'ha reescrit, perquè no s'entenia.** Que la mateixa pregunta no
dona mai la mateixa resposta —ara amb el que això vol dir per a una recerca,
que el mètode es pot repetir i el resultat no—; el bucle de l'agent —ara amb
les quatre feines de programar, escriure, provar, trobar l'error i
esmenar-lo, i qui en fa cadascuna—; el fet que dues converses obertes alhora
no comparteixen res —ara amb el cas real de les dues entrades amb el mateix
número—; i la citació del Departament d'Educació, dita planerament. De
l'enquesta de Stack Overflow l'Edanna preguntava si realment feia falta: s'ha
conservat i se li ha afegit un paràgraf que diu per què hi és, perquè les
seves dues xifres (tothom ho fa servir, cada vegada se'n refien menys) són el
retrat del problema que el projecte es troba a la part pràctica.

**El que cal tenir present.** Amb el paràgraf de Lovable i Willison fora, el
capítol 5 es queda sense l'única veu crítica citada i sense l'únic cas
concret d'una web feta amb aquestes eines que va acabar ensenyant dades dels
usuaris. L'argument no queda despenjat, perquè la dada de Veracode —el 45 %
del codi generat amb vulnerabilitats— continua al text i és la que sosté la
conclusió del capítol. Però si algun professor pregunta per la part crítica
de la bibliografia, la resposta ha de sortir d'aquella dada i no de la frase
de Willison, que ara només consta a `treball/fonts.md`.

Les dues fonts que han quedat sense citar —Semafor i Willison— han baixat a
la secció de fonts reservades per a les parts següents, amb el motiu escrit
al costat: una bibliografia no pot dir «citada a la Part I» d'una cosa que ja
no s'hi cita. El capítol passa de 3.454 a 3.691 paraules: explicar-se bé
costa paraules.

## 48. La veu crítica torna al capítol 5, en una sola línia

*2026-11-10*

En aplicar els comentaris de l'Edanna (entrada 47) es va treure el paràgraf
«Un cas concret i una veu crítica», i va quedar apuntat que el capítol 5 es
quedava sense cap veu crítica citada. Tres dies després es decideix
recuperar-ne la meitat: la frase de Simon Willison —«arribar a un codi en
producció a base de *vibe coding* és clarament una idea terrible»— torna al
text, però no com a paràgraf propi sinó com a tancament del primer paràgraf
de «Què se'n deriva per a aquest treball», que és on fa més servei: just
després de dir que la màquina no escriu codi fiable tota sola. El cas de
Lovable no es recupera.

A la bibliografia, la fitxa de Willison torna a les fonts citades a la Part I
amb l'historial escrit (treta el dia 7, recuperada el dia 10), i Semafor es
queda sola a les reservades.

## 49. Els preliminars i la introducció, en esborrany, amb el pressupost de pàgines

*2026-11-10*

Es comença a escriure el que va davant del cos del treball. El document nou,
`treball/preliminars.md`, porta la portada, l'abstract en anglès, l'esquema
de l'índex, la presentació i la introducció. Abans d'escriure es van decidir
tres coses.

**Quins capítols fan falta.** L'índex queda en quatre parts i 26 capítols
numerats de corrido: 5 de marc teòric (els que ja hi ha escrits), 10 de
metodologia, 6 del producte i 5 de resultats i conclusions. La numeració és
nova: la del guió repetia el número 7 i encara no s'ha tocat, de manera que
els números dels dos documents no coincideixen fins que el guió s'actualitzi.

**Quantes pàgines té cada part.** El pressupost suma 47 pàgines, dins de les
40-50 que es volen: 9 de preliminars i introducció, 10 de marc teòric, 11 de
metodologia, 8 del producte, 6 de resultats i conclusions i 3 de glossari i
fonts. Els annexos no hi compten. Queden tres pàgines de marge per a taules i
figures.

**Què vol dir «útil».** La hipòtesi parla d'una web útil i el guió ja avisava
que aquesta paraula s'havia de definir abans de treure conclusions. La
introducció proposa tres condicions: que la web faci bé el que promet, que la
pugui fer servir algú que no ha participat en el projecte, i que estigui a
l'abast (publicada, per a ordinador i mòbil, i per menys de 20 euros al mes).
És una proposta: l'Edanna l'ha de donar per bona.

El text es va revisar dues vegades. La primera, fet per fet contra els
documents del projecte i contra el marc teòric, i en van sortir vuit
correccions: per exemple, deia que els programadors de l'estudi de METR eren
dos grups diferents, quan eren els mateixos fent feines amb l'eina i sense, i
deia que l'Edanna ja podia explicar amb les seves paraules els passatges
reescrits, cosa que encara no s'ha comprovat. La segona revisió va ser de
claredat i de llargada.

El que no s'ha escrit, expressament: el nom de l'institut, el del tutor o
tutora, la motivació personal i els agraïments. Són dades i paraules que
només pot donar l'Edanna i al text queden marcades amb «PER OMPLIR». La frase
de resultats de l'abstract queda com a «PENDENT» fins que es facin les proves
amb usuaris.

## 50. Els preus: revisió, una segona font i un sistema de quatre regles

*2026-11-10*

Es revisen els preus de les catorze expansions amb un programet que aplica
la mateixa regla que la web i compara les dues fonts entre elles. En surten
quatre expansions sense cap preu, preus de Cardmarket de fa gairebé un any i
una desena de cartes amb preus erronis (cartes de cèntims que comptaven com
si en valguessin 7, 27 i 42 euros). Es tornen a baixar totes les dades i no
canvia gairebé res: el problema és a la font, pokemontcg.io, que ha deixat
d'actualitzar els preus europeus.

La solució té dues parts. La primera és una **segona font**, TCGdex,
gratuïta i sense clau, que porta els preus de Cardmarket del dia abans i
separa les cartes corrents de les que duen segell de torneig. La segona és
un **sistema de quatre regles** (decisió D-013) que tria el preu de cada
carta: quatre fonts per ordre de confiança, només valen els preus de menys
de 60 dies, si no n'hi ha cap es fa servir el menys vell, i si euros i
dòlars discrepen moltíssim es tria el més baix. Tot el que no sigui un preu
de Cardmarket al dia surt marcat amb «≈» i la web en diu el motiu.

El programa de baixada (`tools/fetch_data.py`) i el botó «Actualitza» de la
web baixen ara de totes dues fonts, i la tria del preu viu en un sol lloc
(`app/js/variants.js`). Resultat, comprovat amb el codi real de la web
sobre les 4.016 peces: 4.003 amb preu de Cardmarket al dia, 13 marcades amb
«≈» i cap sense preu. Abans n'hi havia 1.068 sense preu.

## 51. L'índex comentat: cada capítol en dues línies, per ensenyar-lo a la professora

*2026-11-10*

L'índex dels preliminars només porta els títols, i un títol com «Les regles
del joc» no diu gaire a qui no ha seguit el projecte. Es fa un document a
part, `treball/index-comentat.md`, que repeteix l'índex i hi afegeix, sota
cada un dels 26 capítols, d'una a tres línies que diuen què explica. Serveix
perquè la professora pugui opinar sobre l'estructura abans que s'escrigui la
resta: de moment només la Part I està escrita, i de les altres tres el
document diu què ha d'explicar cada capítol, no què explica ja.

És una eina de treball i no s'entrega. Les explicacions surten del guió i dels
documents del projecte, i cada dada que hi surt (les dotze col·leccions
afegides de cop, els 89 problemes de la revisió al mòbil, els dos forats de
seguretat, els 0 euros de publicació) s'ha comprovat contra l'històric i els
reptes.

## 52. La Part III en esborrany, amb les primeres captures de la web

*2026-11-10*

S'escriu la Part III del treball, la que explica el producte: sis capítols
(del 16 al 21) a `treball/part-3-producte.md`, amb unes 2.100 paraules i
set figures. És la primera part del treball que porta imatges.

Abans d'escriure es va fer un estudi de quines pantalles calia ensenyar
(`docs/estudi-captures-part3.md`). El criteri: una captura entra si
demostra una cosa que el text afirma, si s'entén sense haver fet servir la
web i si no repeteix el que ja ensenya una altra. Entren la graella, el
panell d'estadístiques, l'àlbum, el zoom, el selector d'expansions, dues
fitxes de carta (preu exacte i preu aproximat) i dues pantalles de mòbil.
Queden fora el mode Catàleg, els desplegables i la barra d'adreces.

Les captures no s'han fet a mà. Les fa `tools/captures_part3.mjs`, que obre
la web en un navegador sense finestra, marca una col·lecció d'exemple de 30
cartes i desa les imatges a `treball/figures/`. Si la web canvia abans del
lliurament, tornar-lo a executar les refà totes iguals. No ha calgut
instal·lar res.

Perquè les imatges es vegin al lector de documents de la web s'han tocat
dues coses: el script que hi copia els documents ara copia també la carpeta
de figures, i el lector busca les imatges al costat del document.

El text es va revisar dues vegades. La primera, fet per fet contra les
especificacions, les decisions, l'històric i el codi: en van sortir set
correccions. La més important: deia que la web no demana mai dades al
servei extern, i sí que ho fa quan algú prem «Actualitza». La segona
revisió va ser de claredat: paraules sense explicar («servidor», «ports») i
una mateixa paraula amb dos sentits.

Dues coses queden apuntades. El guió parlava de 5.632 línies de codi i avui
se'n compten 6.035: la xifra s'haurà de tornar a comptar al final. I a les
captures de mòbil, amb el panell d'estadístiques obert, les barres de
progrés es veien aixafades i un número sortia tallat; no s'ha comprovat en
un telèfon real ni s'ha arreglat aquí.

## 53. La Part III es posa al dia amb els preus nous, i neix la llista de pendents

*2026-11-10*

El mateix dia que es va escriure la Part III, una altra sessió de treball va
canviar la manera de triar els preus (entrada 50, decisió D-013). En ajuntar
les dues feines, el capítol 19 explicava una regla que la web ja no feia
servir. Es demana repassar-ho tot i arreglar les contradiccions i els errors
que surtin. Se'n troben vuit:

- **El capítol 19** parlava d'una sola font i d'una regla de tres passos. Ara
  explica les dues fonts, la regla de quatre passos, el resultat (de 4.016
  peces, 4.003 amb preu de Cardmarket recent, 13 marcades amb «≈» i cap
  sense preu) i els límits de la regla.
- **Les captures** duien preus de l'11 d'agost. S'han refet totes amb les
  dades del 10 de novembre, i el peu de la figura 2 diu ara 4,91 € i 8,75 €.
- **La figura 6** ensenyava una carta de Mega Evolution amb «≈», i aquella
  carta ja té preu de Cardmarket. Ara el programa de captures busca tot sol
  una carta que porti el signe: n'ha trobat una de Surging Sparks, marcada
  perquè les fonts no es posaven d'acord.
- **El programa de captures tenia un error**: retallava malament una carta
  si la pàgina s'havia desplaçat, i en sortia un rectangle negre. Arreglat.
- **Les línies de codi**: la Part III deia «unes 6.000» i amb el codi nou
  són 6.346. Ara diu «unes 6.300», i el guió, que encara deia 5.632, porta
  la xifra nova amb la data.
- **Dos reptes amb el número 11**, un de cada sessió. El de les captures
  passa a ser el 12. De passada es veu que s'havia desat al mig del
  document, entre el repte 5 i el 6, i es mou al final.
- **L'índex comentat** deia que la Part III estava «per escriure» i descrivia
  el capítol 19 amb la regla antiga.
- **El guió** descrivia el mateix capítol amb la cadena de preus antiga.

Les entrades anteriors de l'històric i dels reptes no es toquen: expliquen
què era veritat el dia que es van escriure.

A petició, es crea també `docs/pendents.md`, una llista viva del que queda
per fer o per apuntar. La primera cosa que hi entra és el cost de la
subscripció de l'eina d'intel·ligència artificial, que és l'única despesa
del projecte i encara no està documentada enlloc.

## 54. La Part II en esborrany: la metodologia

*11 de novembre del 2026*

S'escriu `treball/part-2-metodologia.md`, la part del treball que explica
com s'ha treballat: capítols 6 a 15, unes 3.400 paraules i tres taules.

Abans d'escriure es va mirar si sobrava o faltava cap capítol. Es
mantenen els deu que hi havia a l'índex, amb la mateixa numeració. Tres
temes que no tenien capítol s'han posat dins dels que ja hi havia: la
documentació com a mètode (capítol 6), mirar què hi ha fet abans de
construir (capítol 8) i el mètode aplicat al text del treball (capítols 12
i 15).

El text es va revisar dues vegades, cada vegada amb un ajudant que no
l'havia escrit. La primera revisió comparava cada afirmació amb els
documents del projecte i va trobar sis errors de fet. El més clar: el
text deia que l'eina havia marcat com a «resolts» uns comentaris, i qui ho
havia fet era l'autora. La segona revisió mirava si s'entenia: es van
definir paraules, es va canviar «col·lecció» per «expansió» quan es parla
d'una tanda de cartes, i es van treure frases massa rotundes.

El que el text no pot afirmar perquè no consta als documents s'ha apuntat
a `docs/pendents.md`.

## 55. Els primers comentaris de l'Edanna a la Part II

*11 de novembre del 2026*

L'Edanna comenta la Part II al PR 21 i deixa una correcció al PR 19. Se
n'apliquen cinc:

- El treball de recerca va començar el **24 de març del 2026**, amb el
  seguiment dels professors i la hipòtesi; el 9 d'agost és el dia que es
  va començar la web. Els textos deien «el primer dia» sense distingir-ho.
- Tres passatges que no s'entenien s'han reescrit: el del pla que tenia un
  error, el dels forats de seguretat i el dels «serveis d'altri».
- Una frase del capítol 13 que no deixava clar de què parlava.

Queden quatre comentaris sense aplicar, que demanen treure passatges.
Depenen de decidir com s'explica al treball qui n'ha escrit el text, i
això queda apuntat a `docs/pendents.md`.

De passada es veu que el treball escrit no ha arribat a la versió
principal del projecte: els PR es van fusionar en un ordre que els ha
deixat en branques intermèdies. També queda a pendents.

## 56. Quatre passatges fora de la Part II

*11 de novembre del 2026*

S'apliquen els quatre comentaris de l'Edanna que quedaven al PR 21. Surten
de la Part II quatre passatges que no parlaven de la web sinó del text del
treball: la revisió del marc teòric (capítol 10), el cas del 10 de
novembre (capítol 11), els comentaris marcats com a resolts (capítol 13) i
els passatges del marc teòric que no s'entenien (capítol 15). La Part II
queda centrada en com s'ha fet la web. El capítol 11 passa de tres casos a
dos.

## 57. Les barres d'estadístiques, aixafades al mòbil: una línia de CSS

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

Aquesta entrada es va escriure el 10 de novembre amb el número 53, en una
branca a part. En ajuntar-la amb la resta ja hi havia una altra entrada 53
i les 54 a 56 eren a la branca de la Part II, de manera que passa a ser la
57 encara que sigui anterior.

## 58. El treball escrit arriba a la versió principal

*11 de novembre del 2026*

Els PR del treball escrit s'havien anat fent l'un sobre l'altre, en
cadena: cadascun demanava ajuntar-se amb la branca de l'anterior, i no amb
la versió principal (`main`). En fusionar-los en un ordre diferent del de
la cadena, la feina es va quedar en branques intermèdies. GitHub els
marcava tots com a fusionats, i a `main` només hi havia el marc teòric.

Es resol amb dos PR que van directament a `main`: el 22 hi porta els
preliminars, la Part III i els canvis de la web que també s'havien quedat
pel camí (filtres a l'àlbum, textos, preus), i el 23 hi porta la Part II.
En ajuntar-ho, l'entrada de les barres del mòbil, que portava el número
53, passa a ser la 57.

D'ara endavant, cada PR nou es fa directament contra `main`.

## 59. El glossari

*11 de novembre del 2026*

S'escriu `treball/glossari.md`: 30 paraules tècniques del treball, per
ordre alfabètic, cadascuna explicada en una o dues línies i amb el número
del capítol on surt amb més detall. Les definicions no són noves: són les
mateixes que ja donen el marc teòric i les parts II i III, escurçades. Es
fa ara perquè la professora ha demanat el que hi ha fins al moment.

De passada es posen al dia dues dades que havien quedat velles: la taula
d'estat dels preliminars i la nota de l'índex comentat, que encara deien
que les parts II i III estaven per escriure.

## 60. Repassada del que s'entrega a la professora

*11 de novembre del 2026*

La professora demana el que hi ha fet fins ara. Abans d'entregar-ho es
llegeixen seguits tots els apartats (preliminars, parts I, II i III, índex
comentat i glossari) per veure si es contradiuen. Es corregeix això:

- **Referències entre parts.** La Part I deia «la part de metodologia
  explica...» perquè es va escriure quan la Part II no existia. Ara diu el
  número del capítol (10, 11, 15 o 22).
- **«Independents».** L'abstract i la Part I parlaven de revisions
  «independents». La Part II explica que totes les fa la mateixa màquina,
  i la paraula s'ha tret.
- **Les dates.** «El primer dia» volia dir el 9 d'agost, i el treball va
  començar el 24 de març. Ara diu «el primer dia de feina amb la web».
- **Xifres que caduquen.** La Part II donava el nombre exacte d'entrades
  de l'històric i de pull requests «l'11 de novembre», i aquell mateix dia
  ja havien canviat. Ara són aproximades, fins a l'entrega final.
- **Paraules sense explicar**, que és el que més ha marcat l'Edanna en les
  seves revisions: «vulnerabilitats» passa a «forats de seguretat», «capes
  gratuïtes» a «modalitat gratuïta», «dades d'altri» a «dades que són
  d'altres», i s'explica què és una «peça» quan es compten 4.016.
- **Títols.** El capítol 20 tenia un títol a l'índex i un altre al text.
- **El glossari** passa a tenir una pàgina i mitja al pressupost de
  pàgines, i les notes dels dos índexs diuen què hi ha escrit de debò.

El que no s'ha tocat i queda per decidir és a `docs/pendents.md`.

## 61. La Part I, amb el mateix to que les altres

*11 de novembre del 2026*

El marc teòric es va escriure primer, i tenia frases més llargues i molts
incisos entre guions. Les parts II i III, escrites després, són més
planeres, i en llegir-les seguides es notava el canvi. Es reescriu la Part
I frase per frase sense tocar-ne el contingut: les frases llargues es
parteixen, els incisos passen a ser frases senceres i algunes paraules es
canvien per altres de més corrents.

La mitjana baixa de 16 a 13 paraules per frase, i dels 17 guions llargs
només en queda el del títol. Per assegurar que no s'havia perdut res, es
van comparar automàticament la versió vella i la nova: hi ha les mateixes
xifres, les mateixes cites, les mateixes fonts i els mateixos noms. L'únic
afegit és una frase que explica què vol dir «en producció» a la cita de
Simon Willison.

## 62. El document d'entrega parcial, en Word

*11 de novembre del 2026*

Els textos del treball són fitxers separats, escrits en un format senzill
de text. Per entregar-los a la professora calia un sol document de Word. Es
fa un petit programa, `tools/munta_entrega.py`, que els ajunta en ordre:
una pàgina de guia, la portada, l'abstract, l'índex, l'índex comentat, la
presentació, la introducció, les parts I, II i III i el glossari. En surten
44 pàgines.

La pàgina de guia és nova. Diu, apartat per apartat, què està escrit i què
hi falta, i avisa que l'índex comentat només hi és en aquesta entrega: al
treball final hi haurà l'índex normal.

El programa treu les notes internes de cada text (les que diuen «per
esborrar abans del lliurament») i el pressupost de pàgines. Les marques
«PER OMPLIR» i «PENDENT» es queden, en color, perquè es vegi què falta.

El Word no es guarda al projecte: es torna a generar cada vegada, i així
sempre surt dels textos tal com són aquell dia.

## 63. Les dades de l'Edanna: portada, motivació i agraïments

*11 de novembre del 2026*

Als preliminars hi havia buits marcats «PER OMPLIR» que només podia omplir
l'Edanna. S'omplen amb dues fonts: la seva proposta inicial del treball, un
document seu del març, i les respostes que ha donat a unes preguntes
fetes una per una.

- **Portada.** Títol nou, «*Vibe coding*: fer una web sense saber
  programar», que ajunta el d'ella i el que hi havia. Autora, grup,
  tutora, centre i data d'entrega (30 de novembre del 2026).
- **Per què aquest tema.** La idea va sortir de veure el seu pare fent un
  joc amb intel·ligència artificial. Hi consta també què esperava abans de
  començar, que tot fos més autònom i gairebé sense errors, i que per això
  la pregunta va passar de «es pot fer una web» a «es pot fer una web
  útil».
- **Agraïments**, al seu pare.
- **Objectius.** N'hi havia quatre i ara són cinc: s'hi afegeix «donar a
  conèixer el *vibe coding*», que era a la proposta inicial.
- **L'inici del treball**, el 24 de març del 2026, ara surt també a la
  introducció.

A petició seva es treu el buit que demanava una frase sobre l'ajuda de la
intel·ligència artificial en la redacció. No s'hi escriu res en lloc seu.

Queda una dada per confirmar abans d'escriure-la: el cost de la
subscripció. És a `docs/pendents.md`.

## 64. Més dades de l'Edanna: el primer tutor i el paper del pare

*11 de novembre del 2026*

Tres canvis petits als textos, a partir de més respostes de l'Edanna:

- **El primer tutor.** Del 24 de març fins al final del curs anterior, el
  tutor va ser Josep Carbonell. La presentació ho diu.
- **El pare.** L'Edanna explica que el seu pare ha provat la pàgina. El
  capítol 14 ara ho diu, en una frase. No s'ha atribuït cap error concret
  a les seves proves, perquè els documents del projecte no apunten qui va
  trobar cada cosa.
- **Dos passatges fora**, a petició seva: la tercera dificultat de la
  presentació i una frase del capítol 12, que parlaven de com s'ha escrit i
  revisat el text del treball. La presentació passa d'avançar tres
  dificultats a dues.
