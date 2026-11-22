# Coses pendents

Llista viva del que queda per fer, per decidir o per apuntar. Quan una cosa
es resol no s'esborra: es passa a «Fet», amb la data, perquè en quedi
constància per al treball.

*Última actualització: 22 de novembre del 2026.*

**Dates:** esborrany el 13 de novembre del 2026; entrega final el 30 de
novembre del 2026.

## Costos per documentar

- [ ] **La subscripció de l'eina d'intel·ligència artificial.** El capítol
  21 diu ara el preu del pla de pagament més barat (18 euros al mes,
  pàgina oficial, 11-11-2026). **Falta, per al capítol 22:** què ha costat
  aquest projecte. S'ha fet amb una part d'una subscripció compartida, que
  paga el pare de l'autora (ho diuen els agraïments). La
  família estima que l'ús del projecte hauria cabut en el pla més barat,
  però no s'ha escrit al treball perquè no s'ha pogut comprovar: la pàgina
  de preus diu que aquest pla no inclou un dels models amb què s'ha
  treballat, que s'hi paga a part. Si hi ha dades d'ús que ho demostrin,
  es pot afegir.
- [ ] **El cost total del projecte**, mes a mes, en una taula per al
  treball (capítol de resultats).
- [ ] **El temps dedicat.** Segons l'Edanna: unes 30 hores a la pàgina web
  i unes 40 al treball escrit. El diari apunta el temps d'algunes sessions
  i d'altres no; cal veure si quadra abans de posar-ho al capítol 22.
## Dades que només pot donar l'Edanna

- [ ] El pare de l'autora ha provat la web. La Part II ho diu en general
  (capítol 14). Els documents del projecte no apunten quins errors va
  trobar ell, i per això el text no n'hi atribueix cap. Si l'Edanna o el
  seu pare en recorden algun de concret, es pot afegir.
- [ ] **L'enquesta:** com es va repartir, a qui, què se'ls va dir abans de
  provar la web, si les persones sabien que era per a un treball, i el
  text exacte de les preguntes dels dos formularis. Fa falta per al
  capítol 23 i per a l'annex.
- [ ] **L'Excel de l'enquesta** i el programa que l'ha fet no són al
  repositori, que és públic. L'Excel no té noms, però sí l'edat de cada
  persona i tot el que va escriure. Cal decidir si es puja, i com.

## El treball escrit

- [ ] **Entrega parcial a la professora.** El Word es genera amb
  `python tools/munta_entrega.py` i surt a `treball/entrega/`. Abans
  d'enviar-lo, l'Edanna l'ha de llegir sencer i omplir o treure les marques
  «PER OMPLIR» que vulgui.
- [ ] Part II, capítols 6 i 13: les xifres de l'històric, dels reptes i
  dels pull requests ara són aproximades («més de cinquanta», «una
  vintena»). Posar-hi les exactes el dia de l'entrega final.
- [ ] **L'ús d'IA en el text del treball.** A petició de l'Edanna s'ha tret
  de la presentació el buit que hi havia per explicar-ho. El treball no
  diu com s'ha escrit el text. Mirar què demana la normativa del centre i
  parlar-ho amb la tutora.
- [ ] Una lectura de la Part II feta per algú que no l'hagi escrit. Les
  dues revisions (fets i claredat) les han fet ajudants de la mateixa IA.
- [ ] Part II, capítol 6: diu que l'eina llegeix `CLAUDE.md` tota sola a
  cada conversa. Cal citar-ho amb la documentació oficial de l'eina a
  `treball/fonts.md`.
- [ ] Part II, capítol 12: diu que no consta cap revisió del codi feta per
  una persona. Si algú l'ha mirat, cal dir-ho i apuntar qui i quan.
- [ ] Part II, capítols 8 i 14: diuen que la Fase 3 és oberta i que no hi
  ha proves amb usuaris ni en telèfons de debò. Amb l'enquesta, 24
  persones han obert la web amb el seu telèfon. Cal posar-ho al dia, i
  apuntar també si l'Edanna l'ha oberta al seu mòbil.
- [ ] **Part III: descriu la web d'abans de les millores de l'enquesta.**
  Queden desfasats els capítols 16 (14 expansions), 18 (el selector
  «Marcar», el control «Colors», el logotip per canviar d'expansió), 19
  (les xifres de les catorze expansions) i 20 (el mòbil i els contrastos),
  i també l'abstract (línies de codi). Cal decidir què es reescriu.
- [ ] **Les captures de la Part III** (`treball/figures`) són de la web
  d'abans. S'han de refer totes amb `node tools/captures_part3.mjs`, i
  comprovar abans que el programa encara funciona: fa servir controls que
  ja no hi són.
- [ ] Part IV, resultats i conclusions: per escriure. El capítol 23 és
  l'enquesta, amb un apartat sobre què s'ha canviat arran seu.
- [ ] Abstract: omplir la frase «PENDENT» amb els resultats de l'enquesta
  i la conclusió, sense passar gaire de 250 paraules.
- [ ] Annex de l'enquesta: el qüestionari en les dues llengües, les
  taules i les respostes escrites.
- [ ] Posar al dia `treball/index-comentat.md` (capítols 14, 18 i 23),
  `docs/planificacio.md` (Fase 3) i `tools/munta_entrega.py`, que encara
  no inclou la Part IV.
- [ ] Glossari: afegir-hi les paraules noves de la Part IV quan s'escrigui.
- [ ] Una lectura de la Part III feta per algú que no l'hagi escrit. Les
  dues revisions les ha fet la mateixa IA que la va redactar.
- [ ] El guió (`treball/guio-continguts.md`) numera la Part III del 17 al
  22 i l'índex definitiu del 16 al 21. Es va decidir no renumerar el guió;
  cal tenir-ho present en citar capítols.
- [ ] Tornar a comptar les xifres del projecte just abans d'entregar
  (línies de codi, commits, entrades de l'històric, reptes, decisions) i
  refer les captures amb les dades d'aquell dia
  (`node tools/captures_part3.mjs`).

## La web

- [ ] **Comprovar la web en un telèfon de debò.** Totes les millores del
  mòbil s'han provat només amb una pantalla simulada. La llista de 14
  passos és a `docs/prova-mobil.md` (uns cinc minuts). A l'enquesta, 6 de
  les 16 persones del formulari català que van fer servir només el mòbil
  deien que no es veia bé, i no se sap si les millores ho han resolt.
- [ ] Els dos números de la regla de preus (60 dies i cinc vegades) es van
  triar mirant les dades. Revisar-los si apareixen preus estranys
  (decisió D-013).
- [ ] Ningú ha tornat a provar la web després de les millores: les notes
  de l'enquesta són de la web d'abans.
- **Coneguts i acceptats al mòbil** (revisats el 22-11-2026; no es
  faran):
  - Al zoom, en pantalles molt petites (320×640) o en apaïsat, cal
    desplaçar dins de la fitxa per veure «Veure a la graella» i la nota del
    preu. Es dona per bo: el desplaçament intern funciona i la × de tancar
    queda sempre fixa a dalt.
  - Els botons flotants poden tapar el + d'una carta de la columna dreta
    quan passa per la franja de baix de la pantalla. N'hi ha prou de
    desplaçar una mica la pàgina.
  - En apaïsat, la pàgina de l'àlbum (unes 740 píxels d'alt) no cap en una
    pantalla de 360-390: cal desplaçar per veure-la sencera. Fer-la cabre
    deixaria les cartes de 30 píxels.
- [ ] Les dades de les cartes ja pesen 26,5 MB. Si el repositori s'acosta
  al límit de GitHub Pages (1 GB), caldrà esborrar versions antigues.

## Línies de futur (demanades a l'enquesta i no fetes)

No es faran abans de l'entrega. Van al capítol 24 del treball.

- Entrar amb un compte (login) perquè la col·lecció es pugui veure des de
  diversos aparells. El demanen dues persones, i una posa un 1 a la
  confiança per desar-hi la col·lecció.
- Fer la web instal·lable com una aplicació (PWA).
- Una llista de desitjos: marcar les cartes que es busquen.
- Un sistema d'intercanvi o de compartir la col·lecció.
- Altres jocs de cartes, a més de Pokémon.
- Clic dret per restar una còpia, i poder escriure el nombre de còpies.
- Posar els filtres en una columna a l'esquerra.

## Fet

- [x] *22-11-2026.* Proves amb usuaris: enquesta amb 33 respostes, del 15
  al 18 de novembre (entrada 74 de l'històric).
- [x] *22-11-2026.* Les quatre propostes del mòbil que havien quedat sense
  aplicar al PR 35: nom i número sota cada carta a l'àlbum del mòbil;
  motiu del preu «≈» escrit al zoom; lliscaments des de la vora ignorats;
  botons que ja no queden ressaltats després d'un toc (entrades 98 a 101
  de l'històric).
- [x] *22-11-2026.* Millores de la web arran de l'enquesta, PR 28 a 35:
  el clic sempre obre la carta i fora «Marcar»; explicació de reverse
  holo; fletxes al zoom; cerca tolerant i a totes les expansions; de 14 a
  22 expansions, amb la 151; font i data dels preus a la vista;
  «Actualitza» amb reintents; botó d'expansions visible; «Treu tots els
  filtres»; «Cartes que no tinc» en lloc de «Colors»; cartes apagades més
  clares; brillantor holo; tema clar; i revisió del mòbil (entrades 75 a
  96 de l'històric).

- [x] *11-11-2026.* El text diu que el compte de GitHub és del pare de
  l'autora (capítols 13 i 21). La referència al projecte anterior de
  cartes s'ha tret del capítol 8, a petició de l'Edanna.
- [x] *11-11-2026.* Portada, motivació personal, agraïments i inici del
  treball, omplerts amb les respostes de l'Edanna i la seva proposta
  inicial. Altres costos: no n'hi ha cap.
- [x] *11-11-2026.* La definició de «útil», donada per bona per l'Edanna.
- [x] *11-11-2026.* Document d'entrega parcial en Word, amb una pàgina de
  guia al principi.
- [x] *11-11-2026.* Part I: passada d'estil perquè soni com les parts II
  i III.
- [x] *11-11-2026.* Glossari: esborrany amb 30 paraules.
- [x] *11-11-2026.* El treball escrit i els canvis pendents de la web, a
  la versió principal (PR 22 i 23).
- [x] *10-11-2026.* Panell d'estadístiques al mòbil: les barres ja ocupen
  tota la fila (PR 20). Falta refer la captura de mòbil de la Part III.
- [x] *11-11-2026.* Part II, metodologia (capítols 6 a 15): esborrany
  escrit i revisat dues vegades.
- [x] *10-11-2026.* Preus antics i erronis: segona font i regla de quatre
  passos (decisió D-013).
- [x] *10-11-2026.* El capítol 19 i les captures de la Part III, posats al
  dia amb els preus nous.
