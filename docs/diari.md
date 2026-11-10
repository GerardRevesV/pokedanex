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

## 2026-08-11 — Campanya de visibilitat mòbil

**Què s'ha fet:**
- 3 cicles de 8 exploradors + arreglador + revisor (30 agents en total):
  89 problemes de mòbil trobats amb càlculs demostrables i arreglats,
  sempre dins de media queries per no tocar l'escriptori.
- Millores estrella: àlbum d'una pàgina en mòbil, capçalera compacta,
  botó × al Compendi, botonet de restar a l'àlbum, toc llarg per obrir
  el zoom, objectius tàctils de 44px i respecte per reduced-motion.

**Eines usades:** Claude Code (workflow de 30 agents), càlculs WCAG i
d'amplades a mà, git (worktree separat per no interferir amb la sessió
paral·lela d'expansions).

**Costos:** 0 €.

**Problemes:** la sessió paral·lela va canviar la branca del repositori a
mig vol i l'arbre de treball barrejava les dues feines; s'ha resolt
comitejant els fitxers mòbils des d'un worktree separat de git.

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

## 2026-08-11 — Nou document «Reptes» i norma 8

**Què s'ha fet:**
- Creat el document `docs/reptes.md` (les dificultats del projecte
  explicades en prosa per al treball escrit, amb 5 reptes recuperats del
  passat) i afegida la norma 8 al CLAUDE.md: cada procés difícil de fer
  o d'entendre s'hi registra a partir d'ara.
- Els 5 reptes inicials, reconstruïts a partir de l'històric, el diari,
  les decisions i l'historial de git: l'API que fallava (403 i 502) i la
  cau versionada, els dos forats de seguretat de la importació i la
  revisió per capes, el codi impossible d'activar de la fitxa-zoom, les
  dues sessions d'IA en paral·lel (worktrees, rebase i el fitxer
  `tocllarg.js` que hauria trencat la web) i els colors per càlcul amb
  contrast WCAG.
- Entrada 36 a `docs/historic.md` registrant el document nou.

**Eines usades:** Claude Code (assistent d'IA), git (historial com a
font per verificar els fets dels reptes).

**Costos:** 0 €.

**Problemes:** dos reptes candidats recordats de paraula (el debat
Incolor/Normal de l'Eevee i la memòria cau del navegador després d'una
publicació) no apareixen enlloc de la documentació existent i no s'han
pogut redactar amb fets verificables; queden pendents d'afegir amb el
testimoni de l'Edanna si els recorda.

## 2026-08-13 — Arreglat: els preus a zero dels sets nous

**Què s'ha fet:**
- Investigat l'error trobat per l'Edanna (valor i cost a zero a Prismatic
  Evolutions i Mega Evolution): l'API no té preus de Cardmarket per a
  aquests sets. Comprovat amb un recompte per set: sv8pt5, me1 i me2 tenen
  0 preus de Cardmarket però tots els de TCGplayer; me2pt5, me3, me4 i me5
  no tenen cap preu de cap font (el seu bloc de TCGplayer només porta
  l'enllaç, sense preus).
- Tornat a consultar l'API en viu el mateix 13-08 per si ja portava preus
  d'aquests quatre sets: Perfect Order (me3) i Pitch Black (me5) continuen
  sense cap preu; Chaos Rising (me4) i Ascended Heroes (me2pt5) no s'han
  pogut comprovar perquè l'API responia amb errors 500 (les fallades
  intermitents del repte 1), però a la cau tampoc no en tenen cap. Per
  tant, en aquests quatre sets el valor i el cost seguiran sortint a
  0,00 € amb el recompte honest de «cartes sense preu» fins que l'API en
  tingui (queda documentat a D-009).
- Implementada la cadena de reserva (D-009): Cardmarket → TCGplayer
  convertit de dòlars (taxa fixa 0,90) marcat amb «≈» → guió honest.
- Afegida una nota petita al panell d'estadístiques («inclou preus
  aproximats (≈): n») perquè quan el valor o el cost barregen preus
  exactes i convertits, la xifra ho digui.
- Documentat el repte al document de reptes (norma 8).

**Eines usades:** Claude Code, anàlisi de les dades de la cau amb Python,
navegador integrat per verificar, git.

**Costos:** 0 €.

**Problemes:** el descrit — i la lliçó que un zero enganyós és pitjor que
una aproximació marcada honestament. A banda, un avís per al pull request:
aquesta branca (`arregla-preus`) inclou el contingut de la branca `reptes`
que encara no és a `main` (la capçalera i els reptes 1-6 de
`docs/reptes.md`, i l'entrada 36 de l'històric), perquè el repte 7 i
l'entrada 37 no quedin penjats sense els anteriors. Convé fusionar primer
la branca `reptes` i, si en fusionar la segona hi ha conflicte en aquests
dos fitxers (totes dues branques hi afegeixen el mateix text), resoldre'l
quedant-se la versió d'`arregla-preus`, que és la més completa.

## 2026-11-03 — Estudi dels documents oficials del treball de recerca

**Què s'ha fet:**
- Buidats els tres documents que facilita l'institut: `TR orientacions
  2025-27.docx` (el vigent per a la promoció de l'Edanna), `TR orientacions
  2024-26 (1).docx` (el de la promoció anterior) i `Rúbrica Treball recerca
  Batxillerat-2527.xlsm`.
- Creat `treball/requisits-i-rubrica.md`, un resum únic amb el calendari, el
  repartiment de la nota, les tres rúbriques criteri per criteri, les parts
  i el format obligatoris del treball escrit, les condicions que fan
  suspendre, les normes de l'exposició oral i les de citació de fonts.
- Extreta del full de càlcul la fórmula real de la nota, que el document
  d'orientacions no detalla: `0,30 × escrit + 0,35 × oral + 0,15 ×
  seguiment 2n + 0,10 × seguiment 1r + 0,10 × esborrany`, arrodonida a un
  nombre enter. També l'escala de cada criteri (0 / 0,25 / 0,5 / 0,75 / 1) i
  que cada rúbrica té 10 criteris d'1 punt.
- Comparades les dues versions de les orientacions: a la 25-27 l'oral puja
  del 30 % al 35 %, l'escrit baixa del 35 % al 30 %, el seguiment de 2n
  baixa del 25 % al 15 %, apareix un primer esborrany de setembre que val un
  10 % i el tribunal pot abaixar la nota de l'escrit si l'alumne/a no sap
  respondre les preguntes sobre el seu propi treball.
- Llegit el projecte a la llum de la rúbrica: la web és la «part pràctica» i
  val 2 dels 10 punts de la memòria escrita; el diari, les decisions,
  l'històric i els reptes cobreixen els criteris de fonts, de problemes i
  solucions i de valoració crítica; l'abstract ha d'anar en una llengua
  estrangera; les il·lustracions necessiten indicació de la font.

**Eines usades:** Claude Code, Python amb `python-docx` i `openpyxl` per
llegir els documents de Word i el full de càlcul (cap d'ells es pot llegir
com a text pla).

**Costos:** 0 €. Totes dues llibreries ja eren instal·lades.

**Problemes:** dos, tots dos de calendari i de contingut dels documents. El
full de la rúbrica només descriu el nivell màxim de cada criteri (l'1), no
els intermedis, de manera que no se sap exactament què separa un 0,75 d'un
0,5: ho decideix el tribunal. I el calendari de les orientacions 25-27 ja no
dona dates exactes —les fixa l'institut cada curs—, però situa el lliurament
de l'esborrany a mitjans de novembre, el treball definitiu a final de
novembre o primers de desembre i les exposicions orals al desembre. Si la
promoció de l'Edanna és la 25-27, aquestes dates són ara mateix i cal
confirmar-les amb el tutor/a; la planificació del projecte
(`docs/planificacio.md`) encara apunta a «final de setembre de 2026» com a
data límit de la part teòrica i convindria revisar-la.

## 2026-11-03 — Pluja d'idees: els continguts del treball escrit

**Què s'ha fet:**
- Repassat l'històric de procediments (`docs/historic.md`, 38 entrades) i la
  resta de documentació de `docs/` per inventariar quin material hi ha ja
  escrit per a cada tema del treball.
- Comptades les xifres reals del repositori (codi, commits, pull requests,
  branques, agents, documents) per poder-les citar al treball.
- Creat `treball/guio-continguts.md`: l'índex proposat del treball escrit en
  quatre parts i 27 capítols, amb estimació de pàgines, la ubicació de
  cadascun dels quinze temes de la llista de l'Edanna, el que hi falta, el
  que sobra i les decisions pendents.
- Comprovat al repositori què s'ha fet servir de debò i què no, per no
  explicar al treball eines que no s'han utilitzat.

**Eines usades:** Claude Code, git i recompte de línies amb eines de
consola.

**Costos:** 0 €.

**Problemes:** tres troballes incòmodes, totes anotades al guió. La primera:
el marc teòric del treball (què és el vibe coding, d'on surt el terme, qui
l'ha definit, amb quines fonts externes) no està escrit en cap lloc, i és
exactament el que es lliura al primer esborrany que val un 10 % de la nota.
La segona: el projecte no té ni una prova automàtica —tota la comprovació
ha estat manual al navegador i a través d'agents revisors, i l'única cosa
automatitzada és la publicació—, de manera que el capítol de «testing» s'ha
d'escriure reconeixent-ho. I la tercera: els *dynamic workflows* que
apareixien a la llista de temes no s'han fet servir mai en aquest projecte
(no hi ha cap `.claude/workflows/`), i explicar-los com a experiència pròpia
seria inventar; queden com a esment en el capítol del panorama d'eines.
També queda per confirmar amb l'Edanna si els «forks de xats» es van fer
servir de debò o si el que es va fer van ser sessions en paral·lel amb
worktrees, que és l'únic que consta documentat.

## 2026-11-03 — Escrit el marc teòric del treball

**Què s'ha fet:**
- Cercades i verificades fonts externes citables, que era el forat més gros
  que havia detectat el guió de continguts. En surten tres fonts
  institucionals en català (TERMCAT, Departament d'Educació i Universitat de
  Girona) i vuit internacionals.
- Escrita la Part I del treball a `treball/marc-teoric.md`: set capítols
  (què vol dir programar · què és el vibe coding · com funciona el model que
  escriu el codi · d'un xat a un agent · la memòria d'un agent · el panorama
  d'eines · què diu la recerca).
- Creat `treball/fonts.md` amb la bibliografia en el format de l'Annex II de
  les orientacions i amb l'estat de verificació de cada font.
- Afegit el capítol 7 al guió de continguts (`treball/guio-continguts.md`),
  que no estava previst: el treball necessita un apartat sobre l'estat de
  l'evidència abans de començar.
- Guardada una norma nova a la memòria del projecte, a petició de l'Edanna:
  el feedback i les recomanacions no es queden al xat, van sempre a un
  fitxer del repositori.

**Eines usades:** Claude Code, cerca web i lectura de pàgines web.

**Costos:** 0 €.

**Problemes:** dues pàgines no s'han pogut obrir des d'aquest entorn —
l'article d'Ars Technica que transcriu la piulada de Karpathy i la pàgina
oficial de la paraula de l'any de Collins, que ha respost un error d'accés—,
de manera que aquestes dues citacions s'han pres de fonts secundàries
fiables i queden marcades amb un avís a `treball/fonts.md` perquè es
verifiquin abans del lliurament. Passa el mateix amb set dades més (els
estudis de GitClear i CodeRabbit, el cas de Lovable, l'episodi de Replit, el
«setembre etern» de GitHub, les dades de Y Combinator i la citació de Simon
Willison), que s'han llegit a la Viquipèdia i que caldrà citar de
l'original. I un matís de terminologia que també queda anotat: el TERMCAT
diu que el terme «programació per intenció» «s'ha fixat», però no consta que
el seu Consell Supervisor l'hagi normalitzat formalment, així que convé
consultar la Neoloteca abans d'afirmar-ho al treball.

## 2026-11-03 (2a sessió) — Estudi d'usabilitat de la interfície

**Què s'ha fet:**
- Resposta a un dubte de l'Edanna sobre la diferència entre els modes
  Col·lecció i Catàleg (són dos modes de colors, no dos filtres).
- A partir d'una observació seva —«hi ha filtres com raresa, tipus o
  energia que no s'apliquen»— s'ha fet un estudi d'usabilitat complet i
  s'ha desat a `docs/estudi-usabilitat.md`: inventari dels 31 controls de
  la pantalla principal amb la part de la web on té efecte cadascun, vuit
  casos d'ús recorreguts pas a pas, i tres mesures sobre les dades reals.
- S'han documentat nou confusions ordenades per gravetat i una recomanació
  de vuit punts, i s'han analitzat les dues idees que proposava l'Edanna
  (mostrar els filtres només quan tinguin sentit; que el filtre porti a la
  pàgina de l'energia corresponent).
- Afegida l'entrada 9 a `docs/reptes.md` amb la lliçó de mètode.

**Eines usades:** Claude Code (lectura del codi de `app/js/` i tres scripts
de mesura sobre els fitxers de dades de les 14 expansions).

**Costos:** 0 €. No s'ha tocat ni una línia de codi de la web.

**Problemes:** cap problema tècnic. La troballa incòmoda és de disseny: sis
controls de la capçalera no fan res a la vista Àlbum i no ho diuen, i la
paraula «col·lecció» designa tres coses diferents a la mateixa pantalla.
Queda pendent decidir quins punts de la recomanació s'implementen i en quin
ordre; cap canvi de codi no s'ha fet en aquesta sessió.

## 2026-11-03 — Esmenes al marc teòric: l'estudi desactualitzat i la veu del text

**Què s'ha fet:**
- Investigat si l'estudi de METR del juliol del 2025 continua vigent, a
  partir de l'observació de l'Edanna que la tecnologia ha canviat molt des
  del gener del 2026. Trobats i verificats dos documents posteriors a
  metr.org: el canvi de disseny de l'experiment del 24 de febrer del 2026 i
  l'enquesta a treballadors tècnics de l'11 de maig del 2026.
- Reescrit el capítol 7 del marc teòric amb tres precaucions (rigor, data i
  condicions contràries a les d'aquest projecte) en comptes de dues, i amb
  una conclusió nova sobre el valor d'un projecte documentat quan no hi ha
  mesures fiables de les eines actuals.
- Actualitzat `treball/fonts.md`: les tres entrades de METR passen a estar
  verificades, amb les adreces primàries i les xifres exactes, i amb les
  limitacions que reconeixen els mateixos autors.
- Corregida la veu del text: tret un «teniu a les mans» i un «ens cal», i
  corregida una paraula escrita en castellà («conviene» per «convé»).
- Escrits dos apartats nous al guió de continguts: el 10, amb la norma de la
  veu del treball, i l'11, amb l'ordre de la feina que queda.

**Eines usades:** Claude Code, cerca web amb filtre de domini, lectura de
pàgines web, cerca de patrons al text per trobar castellanismes i marques de
primera i segona persona.

**Costos:** 0 €.

**Problemes:** tres, i els tres són de rigor. El primer: diversos blogs
secundaris expliquen el segon estudi de METR com si fos una «reversió» del
resultat o com si l'estudi s'hagués «arxivat», i cap de les dues coses és el
que diu METR; el text del treball s'ha escrit dient només el que diu la
font original, que és que els resultats no són concloents i que canvien el
disseny. El segon: una dada que hi havia al capítol —que els participants
van continuar creient que l'eina els havia accelerat— venia de la
Viquipèdia; s'ha substituït per la xifra equivalent de la font primària, que
és que van sobreestimar l'efecte sobre el seu temps en 40 punts percentuals
de mitjana. I el tercer, el més incòmode: la paraula en castellà que s'havia
escolat al text. És precisament el tipus d'error que fa suspendre un treball
de recerca segons les orientacions, de manera que abans del lliurament cal
una lectura ortogràfica completa feta per una persona, no només la cerca de
patrons que s'ha fet avui.

## 2026-11-03 — L'efecte de llibre en passar pàgina de l'àlbum

**Què s'ha fet:**
- Estudiat com canviava de pàgina la vista d'àlbum (`app/js/album.js`):
  la funció `passarPagina()` repintava el carpesà sencer de cop.
- Implementat el gir del full amb CSS 3D (`perspective`, `rotateY`,
  `transform-style: preserve-3d`, `backface-visibility`) i l'API
  d'animacions del navegador, sense cap llibreria: 520 ms, amb l'eix del
  gir clavat al llom del carpesà i un vel d'ombra que fa l'efecte de
  paper.
- Descobert que la numeració de l'àlbum ja encaixava amb un llibre de
  debò: passar de les pàgines 1-2 a les 3-4 és exactament girar un full,
  perquè el darrere del full que té la pàgina 2 al davant és la pàgina 3.
  Per això el full que volta porta la pàgina vella al davant i la nova al
  darrere, i en acabar es queda al carpesà fent de pàgina esquerra.
- Fet que el gir no repinti res: les pàgines que no volten ja són les
  definitives abans de començar i, en acabar, el full s'assenta al seu
  lloc. Les imatges de les cartes no es tornen a crear ni a descarregar.
- Respectada la preferència d'accessibilitat «redueix el moviment» i
  previst el cas d'un navegador sense animacions: en tots dos casos el
  canvi de pàgina es fa sec i la pàgina continua funcionant igual.
- Verificat al navegador integrat: gir endavant i enrere, quatre clics
  ràpids seguits, vista d'una sola pàgina (mòbil), canvi de vista a mig
  gir, i que els botons + i − i el valor de la col·lecció segueixen bé.
  Cap error a la consola.
- Documentada la decisió (D-010), l'entrada 38 de l'històric i el repte 8.

**Eines usades:** Claude Code, el navegador integrat (congelant
l'animació a mig gir per poder fotografiar-la i mesurar-la), git.

**Costos:** 0 €. Cap servei nou, cap llibreria.

**Problemes:**
- El port 8000 estava ocupat per un altre servidor local que ja corria,
  i per provar aquesta branca va caldre servir-la al port 8002. És només
  cosa de les proves: la web no canvia.
- En vista d'una sola pàgina, el carpesà s'encongia 6 píxels mentre el
  full voltava. El motiu: a sota del full hi deixem una pàgina de
  butxaques buides i invisible perquè el carpesà no es quedi sense res a
  dins, i aquesta pàgina feia una mica menys d'alçada que una de plena.
  Resolt fixant-li l'alçada exacta de la pàgina de debò.

## 2026-11-04 — Revisió del marc teòric amb quatre revisors, i els documents a internet

**Què s'ha fet:**
- Llançats quatre revisors independents i simultanis sobre
  `treball/marc-teoric.md`, amb un criteri cadascun: nivell i claredat,
  síntesi i estructura, rigor de les fonts, i llengua catalana. En total, 79
  troballes.
- Decidit què s'aplicava de cada revisió i reescrit el text en una sola
  passada: de 4.512 a 3.454 paraules, de 7 capítols a 5, i de ~30 xifres a
  13.
- Verificades les nou fonts que quedaven pendents. Tres citacions del text
  eren incorrectes i s'han corregit contra la font primària.
- Reescrit `treball/fonts.md`: ara separa les fonts citades a la Part I de
  les que queden documentades per a les parts següents, amb la clau de
  citació de cadascuna.
- Creat `treball/revisio-marc-teoric.md` amb el registre de la revisió, que
  serveix de material per a la part de metodologia del treball.
- Creat el lector de documents a `app/documents/index.html` i l'script
  `tools/prepara_documents.py`, i connectat al desplegament de GitHub Pages
  perquè `docs/` i `treball/` es publiquin amb la web.

**Eines usades:** Claude Code amb quatre subagents en paral·lel, cerca web
per verificar fonts, i cerca de patrons al text per comprovar que les
correccions de llengua havien quedat aplicades.

**Costos:** 0 € en serveis. (El cost de la subscripció continua pendent de
documentar, i la revisió de rigor l'ha assenyalat com la primera pregunta
que farà el tribunal.)

**Problemes:** tres. El primer, que en reescriure el text per corregir una
paraula en castellà s'hi va tornar a escolar la mateixa paraula
(«conviene»), que es va detectar i corregir a la verificació final: és la
prova que una lectura humana abans del lliurament no és opcional. El segon,
que la navegació a localhost està bloquejada en aquesta sessió, de manera
que el lector de documents s'ha comprovat per HTTP —les quinze rutes
responen correctament— però no visualment. I el tercer, de coordinació: el
pull request #12 d'una altra sessió (l'efecte de llibre de l'àlbum) ja és a
main i toca els mateixos documents compartits, de manera que el pull request
#13 ha quedat en conflicte. A més, una tercera sessió té feina sense desar en
aquesta mateixa carpeta (l'estudi d'usabilitat i el seu repte), que no entra
en aquest canvi. Hi ha una triple col·lisió de numeració a l'històric i als
reptes que cal resoldre conservant-ho tot i renumerant en ordre cronològic,
tal com es va fer a l'entrada 27.

## 2026-11-04 — Punts 1 i 2 de l'estudi d'usabilitat, implementats

**Què s'ha fet:**
- **Punt 1 (àlbum):** la cerca i els filtres ja funcionen a la vista
  d'Àlbum, en forma de ressaltat: les cartes que coincideixen s'encenen amb
  un anell, la resta s'apaguen, i una barra nova diu quantes n'hi ha i a
  quines pàgines, amb fletxes per saltar-hi. «Ordena per» s'amaga a l'àlbum.
- **Punt 2 (desplegables):** les opcions que no donarien cap carta queden
  desactivades, i el missatge de graella buida diu els criteris reals i
  ofereix el botó «Treure els filtres».
- Decisió D-011 registrada a `docs/decisions.md` amb les tres alternatives
  que es van considerar i per què es va triar aquesta.
- Fitxers tocats: `app/index.html`, `app/js/main.js`, `app/js/album.js`,
  `app/js/i18n.js` (textos nous en català, castellà i anglès) i
  `app/css/style.css`.

**Eines usades:** Claude Code i el navegador integrat per provar-ho.

**Costos:** 0 €.

**Problemes:** dos, tots dos de procés. El primer: el navegador servia la
versió antiga dels fitxers (la memòria cau), i durant una estona semblava
que el codi nou no funcionés quan el que passava és que no s'estava
executant; es va resoldre forçant la recàrrega de cada fitxer. El segon,
més interessant, és que la primera idea —«que el filtre et porti a la
pàgina de l'energia»— no es podia fer tal com estava pensada, i es va haver
de mesurar sobre les dades reals per poder-ho dir amb arguments i proposar
l'alternativa.

**Pendent:** els canvis estan al disc però **sense cap commit**, perquè la
còpia de treball tenia alhora feina d'una altra sessió (el workflow de
Pages, `tools/prepara_documents.py` i `app/documents/`). Cal decidir on van.
També ha quedat detectat, de passada, un desbordament horitzontal al mòbil
que ve del panell d'estadístiques (`estad-barra-xifres`), anterior a aquests
canvis i no tocat.

## 2026-11-04 (2a sessió) — Punts 3 a 8 de l'estudi: el vocabulari

**Què s'ha fet:**
- **Punt 3 (noms):** «Visualització» → «Colors», el filtre «Col·lecció» →
  «Què mostro», el panell i el peu diuen «d'aquesta expansió», i «Buidar» →
  «Buidar-ho tot». En català, castellà i anglès.
- **Punt 4:** distintiu amb el nombre de filtres actius al botó «Filtres i
  opcions» del mòbil (la cerca no hi compta: el cercador es veu sempre).
- **Punt 5:** Importar demana confirmació abans de substituir la col·lecció.
- **Punt 6:** canviar d'expansió treu la cerca i els filtres.
- **Punt 7:** «Consulta» → «Només mirar», i la pista del Ctrl+clic surt com
  a missatge en entrar en un mode de marcatge (a escriptori no es veia).
- **Punt 8:** «Versió de les dades» i «Actualitza» agrupats sota «Dades».
- Decisió **D-012** i entrada **46** de l'històric.

**Eines usades:** Claude Code i el navegador integrat.

**Costos:** 0 €.

**Problemes:** dos, tots dos trobats provant-ho i no llegint-ho. El primer:
l'script que fa els canvis tenia un error en el cas d'una línia repetida
—«Consulta» s'escriu igual en català i en castellà— i va enganxar un tros
de text al final del fitxer de traduccions, que el va deixar trencat. Es va
veure de seguida perquè la comprovació de sintaxi va fallar, i a partir
d'aquí s'ha afegit una comprovació nova: que els tres idiomes tinguin
exactament les mateixes claus (ara en són 110 cadascun). El segon: el
missatge de confirmació d'Importar deia «1 cartes». En comptes d'afegir una
frase per al singular, s'ha tret el número: el que importa no és quantes
cartes es perden, sinó que es perden **totes**.

## 2026-11-07 — Els comentaris del marc teòric, llegits i aplicats

**Què s'ha fet:**
- Lectura dels nou comentaris de l'Edanna al pull request #13 sobre
  `treball/marc-teoric.md`.
- Aplicats els vuit que demanaven alguna cosa: tres retallades i cinc
  passatges reescrits o aclarits.
- `treball/fonts.md`: Semafor i Willison baixen a les fonts reservades per a
  les parts següents, perquè el paràgraf que les citava ja no hi és; la
  rebaixa de la paga de l'estudi de METR passa de «dada citada» a «dada
  disponible i no citada»; i la reserva sobre la piulada de Karpathy, que
  abans anava al cos del text, queda documentada a la fitxa de la font.
- Contestat cada fil a GitHub explicant què s'ha fet, i marcats com a
  resolts.
- Entrada **47** de l'històric i repte **10**.

**Eines usades:** Claude Code i l'API de GitHub (`gh`).

**Costos:** 0 € (de subscripció a part, pendent de documentar).

**Problemes:** el gros va ser descobrir que set dels nou fils constaven com a
resolts sense que el text s'hagués canviat: l'Edanna havia entès «Resolve
conversation» com «ja t'ho he enviat». Si la sessió s'hagués fiat de la
marca, s'haurien perdut sis peticions seves. Es va veure comparant la data de
l'últim canvi del fitxer amb la dels comentaris. El segon problema va ser
d'eina i es va resoldre de seguida: el primer intent d'escriure l'script de
substitucions des del terminal va petar per les cometes del text català, i es
va haver de crear el fitxer d'una altra manera.

## 2026-11-10 — La frase de Willison, recuperada

**Què s'ha fet:**
- L'Edanna ha rellegit aquí mateix, al xat, els cinc passatges reescrits del
  marc teòric per comprovar si ara s'entenen.
- Recuperada la frase de Simon Willison al capítol 5, en una sola línia, dins
  de «Què se'n deriva per a aquest treball».
- `treball/fonts.md`: la fitxa de Willison torna a les fonts citades; Semafor
  es queda a les reservades.
- Entrada **48** de l'històric.

**Eines usades:** Claude Code.

**Costos:** 0 € (de subscripció a part, pendent de documentar).

**Problemes:** cap.
