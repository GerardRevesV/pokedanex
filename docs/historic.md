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
