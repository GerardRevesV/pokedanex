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

**Cost:** 0 €.
