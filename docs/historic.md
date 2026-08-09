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
