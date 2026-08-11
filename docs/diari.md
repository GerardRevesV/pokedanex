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

## 2026-08-10 — Fase 2.2: preu a cada fitxa i ordenació de la graella

**Què s'ha fet:**
- Preu orientatiu de Cardmarket a cada fitxa de la graella (variant normal
  o la primera amb preu conegut), amb format de moneda segons l'idioma i
  guió explicatiu quan no hi ha preu.
- Selector d'ordenació de la graella: número de col·lecció (defecte),
  preu descendent, il·lustrador i número de Pokédex. L'àlbum no canvia
  mai d'ordre: representa el carpesà físic.
- Micro-correccions: contrast WCAG AA de les pastilles «darkness» i
  neutra, i neteja de l'estat de càrrega del zoom en tancar-lo.
- Ronda d'arreglador: desactivada l'opció d'il·lustrador quan les dades
  no porten el camp, i escrita la documentació de la sessió.
- La fitxa-zoom marcable (petició de l'Edanna): el zoom s'obre també des
  de l'àlbum i porta els comptadors − / + de totes les variants a dins,
  més el botó «Veure a la graella». Els revisors van caçar codi mort (el
  marcatge amb clic sobre la imatge gran era inabastable) i es va retirar.

**Eines usades:** Claude Code (agents constructors + arreglador
independent), servidor local de Python per provar, git.

**Costos:** 0 €.

**Problemes:** cap carta de la versió de dades 2026-08-09 porta el camp
`artist`, així que «Ordena per il·lustrador» no tenia cap efecte visible;
s'ha desactivat l'opció fins que una versió futura porti el camp. A més,
la branca anava un commit per darrere de `main` i el diff semblava
esborrar una entrada de l'històric: s'ha portat la versió de `main` del
fitxer a la branca i el diff ha quedat net.

## 2026-08-11 — Fase 2.2: mode Catàleg (visualització a tot color)

**Què s'ha fet:**
- Funcionalitat demanada per l'Edanna: commutador Col·lecció / Catàleg al
  costat del de Vista. En mode Catàleg totes les cartes es veuen a tot
  color (graella i àlbum) i les tingudes es distingeixen amb un marc
  daurat fi; la tria es recorda al navegador
  (`pokedanex.displayMode`).
- Es van fer tres propostes de disseny del marc i un jutge-planificador
  va triar la "Vora Daurada de Mestre" (or = llenguatge propi de
  "tinguda"; el turquesa ja vol dir interacció) amb el hover pla d'una
  altra proposta. Una de les propostes descartades tenia CSS invàlid.
- Implementació mínima: atribut `data-visualitzacio` al body (mateix
  patró que el mode de marcatge), CSS nou amb `:where()` per no barallar
  especificitats amb el flaix de marcar i el ressaltat, tres claus i18n
  noves i cap canvi a album.js, collection.js ni markmode.js.

**Eines usades:** Claude Code (planificador + executor), servidor local
de Python i navegador integrat per verificar, git.

**Costos:** 0 €.

**Problemes:** el pla proposava per a les fundes de l'àlbum una capa de
fons translúcida sota el marc daurat, però amb transparència l'or es
veuria per tota la funda; s'ha substituït per l'equivalent opac del
mateix color.

## 2026-08-11 — Fase 2.2: zoom universal amb Ctrl+clic

**Què s'ha fet:**
- Petició de l'Edanna: Ctrl+clic (Cmd al Mac) sobre una carta obre el
  zoom en qualsevol mode de marcatge, a la graella i a l'àlbum, sense
  marcar cap còpia. Arregla la limitació documentada que en mode variant
  no es podia fer zoom. El mode Consulta no canvia gens.
- Descobribilitat: en mode de marcatge, cada carta porta un rètol
  emergent ("Ctrl+clic: veure la carta") amb clau i18n als tres idiomes;
  el rètol es posa i es treu en canviar de mode sense repintar la graella.

**Eines usades:** Claude Code (planificador + executor), servidor local
de Python per verificar, git.

**Costos:** 0 €.

**Problemes:** dos de bons, caçats pels auditors i arreglats després:
(1) Ctrl+clic sobre un botó +/− marcava en lloc d'obrir el zoom (els
botons aturen la propagació del clic); s'ha resolt passant la carta
sencera als botons, i ara Ctrl+clic hi obre el zoom com a la resta de
la carta. (2) A macOS, Ctrl+clic no genera un clic sinó el
esdeveniment de menú contextual: sense arreglar-ho, un usuari de Mac
que seguís el rètol hauria RESTAT una còpia en lloc de fer zoom; els
gestors de clic dret ara detecten el Ctrl i obren el zoom també al Mac.

## 2026-08-11 — Expansió nova: Prismatic Evolutions (estrena de la skill)

**Què s'ha fet:**
- Afegida l'expansió **Prismatic Evolutions** (`sv8pt5`, 180 cartes)
  seguint per primera vegada la skill `afegir-expansio` pas a pas:
  identificació del set a l'API, baixada i registre amb
  `tools/fetch_data.py`, tema visual nou a `temes.js` i verificació
  completa al navegador (selector, recompte 180/180, canvi de tema
  d'anada i tornada, zero errors de consola).
- Tema del set: **daurat prismàtic** `#f0a830` (color dominant de les
  gemmes del logotip, extret amb un petit script de Python), text
  `#241600` sobre l'accent. Contrastos WCAG AA calculats: 9,32:1 /
  8,60:1 / 8,34:1 sobre els tres fons i 8,70:1 el text sobre l'accent
  (mínim exigit: 4,5:1).

**Eines usades:** Claude Code amb la skill `afegir-expansio`, API
pokemontcg.io, servidor local de Python i navegador integrat, git.

**Costos:** 0 €.

**Problemes:** l'API ha estat inestable com sempre (errors 500 a la
cerca del set i un reintent durant la baixada), però els reintents ja
previstos ho han absorbit tot.

## 2026-08-11 — Botonet d'ordre al selector d'expansions

**Què s'ha fet:**
- Afegit un botonet (↑/↓) al costat de la cerca del panell del Compendi
  per invertir l'ordre de la llista d'expansions per data de sortida
  (del més antic al més nou per defecte, invertible amb un clic).
- La tria es desa al navegador (`pokedanex.ordreExpansions`) i el rètol
  del botó, traduït als tres idiomes, explica l'ordre actual.
- Verificat al navegador integrat: la llista s'inverteix, la fletxa i
  el rètol canvien, la preferència queda desada i no hi ha errors de
  consola.

**Eines usades:** Claude Code, servidor local de Python i navegador
integrat, git.

**Costos:** 0 €.

**Problemes:** cap; només ha calgut aixecar el servidor de proves en un
port alternatiu (8001) perquè el 8000 estava ocupat per una altra
sessió.

## 2026-08-11 — Dotze expansions noves: de Shrouded Fable fins avui

**Què s'ha fet:**
- Cercades a l'API totes les expansions publicades des de *Shrouded
  Fable* (02/08/2024) fins avui: 14 en total, 12 de noves (les altres
  2 ja hi eren i se n'han refrescat les dades i els preus).
- Baixades i registrades les 12 noves amb `tools/fetch_data.py`, en
  cua seqüencial: *Stellar Crown* (175), *Surging Sparks* (252),
  *Journey Together* (190), *Destined Rivals* (244), *Black Bolt*
  (172), *White Flare* (173), *Mega Evolution* (188), *Phantasmal
  Flames* (130), *Ascended Heroes* (295), *Perfect Order* (124),
  *Chaos Rising* (122) i *Pitch Black* (120). Recomptes verificats
  fitxer a fitxer: tots quadren amb el total oficial del set.
- Tema de color nou per a cada set a `temes.js`, triat mirant els
  logotips (color dominant extret amb Python) i ajustat per càlcul
  fins a complir WCAG AA (tots entre 6,2:1 i 12,5:1; mínim 4,5:1).
- **Problema d'art resolt per una via alternativa:** els 4 sets més
  nous (*Ascended Heroes*, *Perfect Order*, *Chaos Rising* i *Pitch
  Black*) no tenen logotip ni símbol a images.pokemontcg.io — el CDN
  serveix el mateix revers de carta genèric per a tots quatre, i al
  menú s'haurien vist idèntics. S'ha afegit a `fetch_data.py` un
  diccionari d'imatges alternatives que apunta als logotips de
  **TCGdex** (assets.tcgdex.net, font oberta i gratuïta); quan
  pokemontcg.io publiqui l'art oficial, només caldrà esborrar
  l'entrada corresponent.
- Verificat al navegador integrat: les 14 expansions al Compendi
  agrupades en dues sèries (la sèrie nova "Mega Evolution" es crea
  sola), scroll intern de la llista funcionant (el panell ja el tenia
  previst i no ha calgut tocar res), canvi d'expansió amb recompte
  exacte i tema aplicat (provat amb *Pitch Black*, *Stellar Crown* i
  tornada a *Shrouded Fable*), i zero errors de consola.
- Millorada la skill `afegir-expansio` amb tot el que s'ha après
  (vegeu Problemes).

**Eines usades:** Claude Code amb la skill `afegir-expansio`, APIs
pokemontcg.io i TCGdex, Python (baixades, extracció de colors i càlcul
de contrast), servidor local i navegador integrat, git.

**Costos:** 0 €.

**Problemes:**
- La cerca per rang de dates a l'API (`releaseDate:[... TO *]`) torna
  HTTP 400: s'ha hagut de baixar la llista completa de sets i filtrar
  per data localment.
- *Stellar Crown* va esgotar els 6 reintents de l'script (errors 502
  seguits de l'API); s'ha tornat a llançar al cap d'uns minuts i ha
  funcionat a la primera.
- *Ascended Heroes* es va baixar abans que la correcció d'imatges fos
  a l'script i s'ha hagut de tornar a baixar perquè el registre agafés
  els logotips de TCGdex.
- El revers de carta genèric dels 4 sets sense art (mateix fitxer per
  a tots, detectat comparant-ne les sumes MD5) hauria fet el menú
  inservible per distingir-los: resolt amb TCGdex com s'explica a dalt.
