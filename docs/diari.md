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

## 2026-08-10 — Fase 2.1: polits i marcatge amb clics

**Què s'ha fet:**
- Tapats els tres forats de les especificacions: zoom d'imatge gran,
  filtres desplegables (raresa/tipus/categoria) i pastilles de color dels
  tipus d'energia. Cada tasca amb el seu pla propi i executor.
- Coses menors: data.js unificat amb storage.js i decisió D-006 ampliada
  dient el comportament real (comprovat al codi abans d'escriure-ho).
- Funcionalitat nova demanada per l'Edanna: marcatge ràpid amb clic
  esquerre (+1) i clic dret (−1) a graella i àlbum, amb menú de variant
  activa (Consulta/Normal/Reverse/Holo).
- Dues rondes de revisió amb subagents a cada bloc (auditoria
  d'especificacions/UX + revisió de codi + arreglador independent), més
  revisor final d'ulls frescos i verificació funcional al navegador.
  Detalls de qualitat caçats pels revisors: contrast WCAG de les
  pastilles, atrapament del focus del zoom, curses del flaix visual.

**Eines usades:** Claude Code (orquestrador + 10 agents del workflow de
polits + 5 del de marcatge + revisor independent), navegador integrat,
git i GitHub.

**Costos:** 0 €.

**Problemes:** cap de greu. El panell del navegador integrat no permetia
fer captures (pestanya no visible); la verificació es va fer igualment
per DOM amb JavaScript.

## 2026-08-10 — Inici de la Fase 3: publicació a GitHub Pages

**Què s'ha fet:**
- Fet públic el repositori de GitHub (decisió D-007), després de verificar
  que a l'historial de git no hi ha cap secret (el `config.json` amb la
  clau de l'API no s'ha comitejat mai).
- Creat el flux de publicació automàtica amb GitHub Actions
  (`.github/workflows/pages.yml`, pull request #3): publica la carpeta
  `app/` a GitHub Pages a cada canvi de `main`.
- Verificada la web publicada en viu a
  https://gerardrevesv.github.io/pokedanex/: les 99 cartes carreguen amb
  preus, marcar cartes funciona i actualitza les estadístiques, zero
  errors de consola i cap desbordament horitzontal en pantalla de mòbil
  (375 px).

**Eines usades:** Claude Code (assistent d'IA), GitHub Actions i GitHub
Pages (gratuïts), navegador integrat per a la verificació.

**Costos:** 0 €. Sessió curta.

**Problemes:** cap.
