# Diari de desenvolupament

Registre de cada sessió de treball: què s'ha fet, eines usades, costos i
problemes. Aquest document és font primària per a la part pràctica del
treball escrit.

---

## 2026-08-09 — Inici del projecte

**Què s'ha fet:**
- Creat el repositori a GitHub (`GerardRevesV/pokedanex`) i clonat en local.
- Definida l'estructura de carpetes del projecte (`app/`, `docs/`,
  `treball/`, `presentacio/`).
- Creada la planificació per fases (`docs/planificacio.md`).
- Creades les regles del projecte (`CLAUDE.md`): no escriure codi a mà,
  pressupost màxim 20 €/mes, documentar-ho tot.
- Iniciada la Fase 0: entrevista d'especificacions.

**Eines usades:** GitHub (gratuït), Claude Code (assistent d'IA).

**Costos:** 0 € (de moment només eines gratuïtes; el cost de l'assistent
d'IA es documentarà quan es concreti la subscripció usada).

**Problemes:** cap.

## 2026-08-09 — Fase 1: script de dades i esquelet de la web

**Què s'ha fet:**
- Tancada la Fase 0 (especificacions versió 2, amb calendari) i preses les
  decisions de fonaments: web estàtica sense frameworks, dades de
  pokemontcg.io amb memòria cau local versionada i preus de Cardmarket amb
  data visible.
- Creat l'script `tools/fetch_data.py`, que descarrega el set Shrouded
  Fable i en guarda una versió nova datada a `app/data/versions/`. Generada
  la primera versió de dades (2026-08-09, 99 cartes).
- Creat l'esquelet de la web a `app/`: graella de cartes amb cercador,
  selector de versions de dades, botó "Actualitza dades" (crea versions
  noves desades al navegador, sense sobreescriure mai res) i interfície en
  tres idiomes (català, castellà i anglès).

**Eines usades:** Claude Code (assistent d'IA), Python (només llibreria
estàndard), API gratuïta de pokemontcg.io, servidor local de proves
(`python -m http.server`).

**Costos:** 0 €.

**Problemes:**
- L'API de pokemontcg.io retornava un error 403: bloqueja el User-Agent
  per defecte de Python. Resolt enviant-ne un de propi ("Pokedanex/1.0").
- L'API falla de tant en tant amb errors de servidor (5xx). Resolt amb
  reintents automàtics amb esperes creixents, tant a l'script com a la web.

## 2026-08-09 — Doble revisió, verificació al navegador i flux de PR

**Què s'ha fet:**
- Doble revisió de l'esquelet: validadors del workflow (7 problemes trobats
  i arreglats) + revisor independent (confirma els arranjaments, cap error
  crític nou, clau de l'API neta a tot el repositori i historial).
- Verificació de la web al navegador real: zero errors de consola, canvi
  d'idioma en calent, cercador i cartes secretes correctes, botó
  "Actualitza dades" funcionant de punta a punta.
- Creat el document d'arquitectura (`docs/arquitectura.md`).
- Tancada la Fase 1 i adoptat el flux de branques + pull requests (D-005),
  amb un primer pull request de prova.

**Eines usades:** Claude Code (orquestrador + subagents de validació i
arreglat), navegador integrat, git i GitHub.

**Costos:** 0 €.

**Problemes:** cap de nou; queda apuntat que els preus de Cardmarket dins
l'API poden anar endarrerits (s'estudiarà CardTrader a la Fase 2).

## 2026-08-09 — Fase 2: col·lecció, àlbum i estadístiques

**Què s'ha fet:**
- Construït el cor de la web amb l'equip d'agents en 4 blocs: estat de la
  col·lecció (comptadors per variant normal/reverse/holo, exportar/importar/
  buidar), marcatge a la graella (+/− d'un clic, cartes apagades, filtres),
  vista d'àlbum de carpesà (dues pàgines 3×3 amb navegació) i panell
  d'estadístiques (valor, cost de completar i objectiu triable).
- En paral·lel, recerca de l'API de CardTrader: viable i gratuïta però
  posposada (docs/recerca-cardtrader.md).
- Doble revisió: 6 problemes trobats i arreglats (2 de seguretat subtils a
  la importació de JSON) + revisor independent amb veredicte net.
- Verificació funcional al navegador i pull request de la Fase 2.

**Eines usades:** Claude Code (orquestrador + 8 agents del workflow + 1
revisor independent), navegador integrat, git i GitHub.

**Costos:** 0 €.

**Problemes:** cap de nou. Detall interessant per al treball: els
validadors van caçar dos forats de seguretat subtils (ids "__proto__" a la
importació) que un sol revisor hauria pogut passar per alt — la revisió en
capes funciona.
