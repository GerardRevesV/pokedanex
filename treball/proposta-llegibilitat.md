# Proposta: baixar el nivell tècnic del treball

*11 de novembre del 2026*

Per a cada un dels 15 punts de `treball/revisio-llegibilitat.md` hi ha el
text d'**ara** i la **proposta**. Per acceptar-ne un, marca la casella amb
una `x` (`- [x] Acceptat`) o deixa-hi un comentari al PR. Si en vols un de
diferent, escriu-ho a sota a **Comentari**.

Quan estiguin decidits, els canvis es faran als textos d'origen
(`marc-teoric.md`, `part-2-metodologia.md`, `part-3-producte.md`) i es
tornarà a generar el document unificat. Les dades no canvien: només la
manera de dir-les.

---

## Prioritat alta

### 1. Cap. 19 — La regla dels preus

**Ara:**

> Per això es va afegir TCGdex com a segona font i es va escriure una regla
> nova, en quatre passos:
>
> 1. Hi ha quatre preus possibles, ordenats de més a menys fiable: el de
>    Cardmarket i el de TCGplayer segons TCGdex, i els mateixos dos segons
>    pokemontcg.io. Els preus en dòlars es passen a euros amb un canvi fix
>    (un dòlar, 0,90 euros).
> 2. Un preu només val si és recent, és a dir, si té menys de 60 dies quan
>    es baixen les dades. Es fa servir el primer de la llista que ho
>    compleixi.
> 3. Si no n'hi ha cap de recent, es fa servir el menys antic.
> 4. Si el preu en euros i el preu en dòlars d'una mateixa carta són molt
>    diferents (l'un cinc vegades l'altre, o més), es tria el més baix.

**Proposta:**

> Per això es va afegir TCGdex com a segona font i es va escriure una regla
> nova. La idea és senzilla: **de tots els preus que hi ha d'una carta, es
> tria el més fiable que sigui recent, i si dos preus no quadren gens, es
> desconfia del més alt.** En concret:
>
> 1. Primer es busca a TCGdex, que és la font més fiable: el preu europeu,
>    de Cardmarket, i si no n'hi ha, el nord-americà, de TCGplayer, passat
>    de dòlars a euros (un dòlar es compta com 0,90 euros). Si TCGdex no
>    en té cap, es fa el mateix amb pokemontcg.io.
> 2. Només es fa servir un preu recent, que vol dir que té menys de dos
>    mesos. Si no n'hi ha cap de recent, es fa servir el menys antic.
> 3. Si el preu europeu i el nord-americà d'una carta són molt diferents
>    (l'un cinc vegades més alt que l'altre, o més), es tria el més baix.

*Què canvia:* la idea va primer i els passos després. Els quatre passos
passen a ser tres.

- [x] Acceptat

**Comentari:**

---

### 2. Cap. 19 — Quins preus porten el signe «≈»

**Ara:**

> Tot preu que no sigui de Cardmarket, recent i sense dubtes surt marcat amb
> «≈» (figura 6), i en passar-hi el ratolí per sobre la web en diu el motiu:
> és convertit de dòlars, és antic o és dubtós. Si cap font no té preu, la
> web hi posa un guió i compta a part quantes cartes s'han quedat sense.

**Proposta:**

> Només els preus de Cardmarket recents i sense dubtes surten tal com són.
> Tots els altres porten el signe «≈» (figura 6), i si s'hi passa el ratolí
> per sobre, la web n'explica el motiu: que s'ha passat de dòlars, que és
> antic o que no és segur. Si no hi ha cap preu, la web hi posa un guió i
> compta a part quantes cartes n'han quedat sense.

*Què canvia:* es diu en positiu, sense tantes negacions seguides.

- [x] Acceptat

**Comentari:**

---

### 3. Cap. 5 — La segona precaució sobre l'estudi de METR

**Ara:**

> **Segona, i la més decisiva per llegir l'estudi: la data.** Les eines que es
> van mesurar són les de principis del 2025, de fa diverses generacions de
> models. El camp ha canviat tant que el mateix estudi ja no es pot fer. METR
> el va repetir a partir de l'agost del 2025. El febrer del 2026 va anunciar
> que canviarà el disseny de l'experiment, perquè els resultats ja no
> permeten afirmar ni que l'eina freni ni que acceleri. Un dels motius que
> dona és revelador: entre el **30 % i el 50 %** dels programadors
> renunciaven a enviar feines perquè no les volien fer sense intel·ligència
> artificial. Un d'ells no va completar ni una de les que li havien tocat
> sense l'eina (METR, 2026). En poc més d'un any, aquestes eines havien
> passat de frenar els experts a ser una cosa sense la qual bona part dels
> participants no volien treballar.

**Proposta:**

> **Segona, i la més decisiva: la data.** L'estudi va mesurar les eines de
> principis del 2025, i des de llavors han millorat tant que l'experiment ja
> no es pot repetir igual. METR ho va intentar a partir de l'agost del 2025,
> i el febrer del 2026 va explicar que n'havia de canviar el plantejament,
> perquè els resultats ja no deixaven dir si l'eina feia anar més de pressa
> o més a poc a poc. Un dels motius és revelador: entre el **30 % i el 50 %**
> dels programadors ja no volien fer feines sense intel·ligència artificial,
> i sense aquestes feines no es podia comparar (METR, 2026). En poc més d'un
> any, aquestes eines havien passat de frenar els experts a ser una cosa sense
> la qual molts ja no volien treballar.

*Què canvia:* fora «generacions de models», «disseny de l'experiment» i
«renunciaven a enviar feines». Es treu el cas del programador que no en va
completar cap, que no afegeix res a la idea.

- [x] Acceptat

**Comentari:**

---

### 4. Cap. 13 — Git, branca, *pull request* i fusionar

**Ara:**

> Si la màquina espatlla una cosa que funcionava, cal poder tornar enrere.
> Per a això serveix **git**, un programa que guarda una fotografia del
> projecte cada vegada que es fa un canvi, amb una nota que diu què s'ha
> canviat. Aquestes fotografies es desen també a internet, a **GitHub**,
> on es guarda el projecte des que es va començar la web. El compte de
> GitHub és del pare de l'autora.
>
> En tancar la Fase 1 es va decidir treballar sempre de la mateixa manera:
>
> 1. Cada canvi es fa en una **branca**, que és una còpia del projecte on
>    es pot treballar sense tocar la versió bona.
> 2. Quan el canvi està acabat, s'obre un ***pull request***: una petició
>    d'ajuntar la branca amb la versió bona. Allà es veu, línia per línia,
>    què canvia.
> 3. La màquina el revisa (capítol 12) i l'autora prova la web. Si tot
>    està bé, es **fusiona**, és a dir, s'ajunta amb la versió bona. En
>    aquell moment la web publicada s'actualitza tota sola (capítol 21).

**Proposta:**

> Si la màquina espatlla una cosa que funcionava, cal poder tornar enrere.
> Per a això serveix **git**, un programa que fa una fotografia del projecte
> cada vegada que es fa un canvi, amb una nota que diu què s'ha canviat. És
> com l'historial de versions d'un document compartit: es pot veure com era
> el projecte qualsevol dia i recuperar-lo. Aquestes fotografies es desen
> també a internet, a **GitHub**, on es guarda el projecte des que es va
> començar la web. El compte de GitHub és del pare de l'autora.
>
> En tancar la Fase 1 es va decidir treballar sempre de la mateixa manera,
> que s'assembla a fer un esborrany abans de tocar el document bo:
>
> 1. Cada canvi es fa en una **branca**: una còpia del projecte on es pot
>    provar el que calgui sense tocar la versió bona.
> 2. Quan el canvi està acabat, es demana d'ajuntar-lo amb la versió bona.
>    Aquesta petició es diu ***pull request***, i hi surt, línia per línia,
>    què canvia.
> 3. La màquina revisa el canvi (capítol 12) i l'autora prova la web. Si tot
>    està bé, la branca s'ajunta amb la versió bona, que és el que es diu
>    **fusionar**. En aquell moment la web publicada s'actualitza tota sola
>    (capítol 21).

*Què canvia:* dues comparacions quotidianes (l'historial de versions i
l'esborrany), i cada paraula nova surt després d'explicar què és, no abans.

- [x] Acceptat

**Comentari:**

---

## Prioritat mitjana

### 5. Cap. 20 — L'accessibilitat i el contrast

**Ara:**

> Aquell mateix dia es va treballar l'**accessibilitat**, que vol dir que la
> web la pugui fer servir tothom, també les persones amb problemes de vista.
> Cada expansió té el seu color, i un color bonic pot ser impossible de
> llegir. Les normes internacionals d'accessibilitat (WCAG) ho mesuren amb un
> número, el contrast entre el text i el fons, que ha de ser com a mínim de
> 4,5 a 1. Els colors no es van triar a ull: els de 13 de les 14 expansions
> es van ajustar per càlcul, i van quedar amb contrastos d'entre 6,2 i 12,5 a
> 1, força per sobre del mínim. A més, la web redueix les animacions a qui ha
> demanat al seu aparell que ho faci.

**Proposta:**

> Aquell mateix dia es va treballar l'**accessibilitat**, que vol dir que la
> web la pugui fer servir tothom, també les persones amb problemes de vista.
> Cada expansió té el seu color, i un color bonic pot fer que el text no es
> llegeixi. Unes normes internacionals, les WCAG, ho mesuren amb un número,
> el **contrast**: com més alt, més es distingeix el text del fons. El mínim
> que demanen és 4,5. Els colors no es van triar a ull: els de 13 de les 14
> expansions es van ajustar per càlcul, i tots van quedar força per sobre del
> mínim, entre 6,2 i 12,5. A més, si algú ha configurat el mòbil o
> l'ordinador perquè es moguin menys coses a la pantalla, la web en fa cas i
> redueix les animacions.

*Què canvia:* s'explica què vol dir el número, fora el «a 1», i l'última
frase es diu amb paraules de cada dia.

- [x] Acceptat

**Comentari:**

---

### 6. Cap. 17 — La web estàtica

**Ara:**

> Pokedanex és el que s'anomena una **web estàtica**. Vol dir que no hi ha
> cap programa funcionant en un altre ordinador ni cap base de dades: la web
> són fitxers, i el navegador de qui la visita els llegeix i ho fa tot. És la
> manera més senzilla i més barata de fer una web, i per a aquest projecte
> n'hi ha prou.

**Proposta:**

> Pokedanex és el que s'anomena una **web estàtica**. Moltes webs, com una
> xarxa social, tenen un ordinador a l'altra banda que guarda els comptes i
> les dades de tothom i que respon cada vegada que algú fa alguna cosa.
> Pokedanex no en té: la web són només fitxers, i el navegador de qui la
> visita els llegeix i ho fa tot. És la manera més senzilla i més barata de
> fer una web, i per a aquest projecte n'hi ha prou.

I al glossari:

> **Web estàtica.** Una web feta només de fitxers, sense cap ordinador a
> l'altra banda que guardi dades o respongui a qui la visita. (17)

*Què canvia:* un exemple conegut (una xarxa social) en lloc de «programa
funcionant en un altre ordinador» i «base de dades».

- [x] Acceptat

**Comentari:**

---

### 7. Cap. 3 — La finestra de context

**Ara:**

> **La finestra de context** és el que el model pot tenir al davant en un
> moment determinat: la conversa sencera i el contingut de tots els fitxers
> que ha llegit. És gran, però **finita**. Quan s'omple, el més antic s'ha de
> resumir o descartar, i això vol dir que l'agent **oblida**. Explica un
> comportament que sorprèn molt al principi: una eina que semblava entendre
> perfectament el projecte, al cap d'una sessió llarga, torna a fer preguntes
> que ja estaven resoltes.

**Proposta:**

> **La finestra de context** és el que el model pot tenir al davant en un
> moment determinat: la conversa sencera i el contingut de tots els fitxers
> que ha llegit. Es pot imaginar com una pissarra: és gran, però té una mida
> fixa. Quan s'omple, s'ha d'esborrar o resumir el que hi ha escrit des de
> fa més estona, i això vol dir que l'agent **oblida**. Per això passa una
> cosa que sorprèn molt al principi: una eina que semblava entendre
> perfectament el projecte, al cap d'una sessió llarga, torna a fer preguntes
> que ja estaven resoltes.

*Què canvia:* la comparació de la pissarra en lloc de «finita».

- [x] Acceptat

**Comentari:**

---

### 8. Cap. 3 — L'agent que treballa «en bucle»

**Ara:**

> Un **agent** és el mateix model, però amb **eines** i amb permís per
> fer-les servir. Pot llistar els fitxers d'una carpeta, llegir-los,
> escriure-hi, executar ordres a l'ordinador o obrir un navegador. I, sobretot,
> treballa en **bucle**: decideix una acció, la fa, **observa el resultat** i
> decideix la següent a partir del que ha vist. Si el canvi que acaba de fer
> provoca un error a la pàgina, l'agent pot obrir-la, llegir el missatge
> d'error, deduir-ne la causa, corregir el fitxer i tornar-ho a provar. Tot
> això, sense que hi intervingui cap persona.

**Proposta:**

> Un **agent** és el mateix model, però amb permís per fer coses a
> l'ordinador: obrir els fitxers del projecte, llegir-los, canviar-los i
> obrir la web en un navegador. Per exemple, l'agent canvia un botó, obre la
> pàgina i veu que surt un error. Llegeix el missatge, en dedueix la causa,
> corregeix el fitxer i ho torna a provar. Tot això, sense que hi
> intervingui cap persona. Aquest cicle de fer una cosa, **mirar què ha
> passat** i decidir la següent és el que s'anomena treballar en **bucle**.

*Què canvia:* fora «llistar» i «executar ordres». Primer l'exemple i
després el nom del concepte.

- [x] Acceptat

**Comentari:**

---

### 9. Cap. 5 — Els «40 punts percentuals»

**Ara:**

> A més, es pensaven que l'eina els havia ajudat molt més del que els havia
> ajudat, amb una diferència de 40 punts percentuals de mitjana (METR, 2025).

**Proposta:**

> A més, després de la prova es pensaven que l'eina els havia fet anar més de
> pressa, quan en realitat els havia fet anar més a poc a poc (METR, 2025).

*Què canvia:* es diu què va passar sense la xifra, que costa d'entendre.

- [x] Acceptat

**Comentari:**

---

### 10. Cap. 8 — Les fases

**Ara:**

> **Per fases.** El 9 d'agost es va escriure una planificació amb sis
> fases, de la 0 a la 5, cadascuna amb un objectiu i un resultat per
> entregar. La norma diu que no se'n comença cap sense tancar l'anterior.
> Segons la planificació, les fases 0, 1 i 2 (decidir què havia de fer la
> web, triar les eines i construir-la) es van tancar el 9 d'agost. La
> norma no s'ha complert del tot: la Fase 4, que és aquest treball escrit,
> s'ha començat amb la Fase 3 encara oberta, perquè falten les proves amb
> usuaris.

**Proposta:**

> **Per fases.** El 9 d'agost es va escriure una planificació amb sis
> fases, cadascuna amb un objectiu i un resultat per entregar. La norma diu
> que no se'n comença cap sense tancar l'anterior.
>
> | Fase | Què és | Estat |
> |---|---|---|
> | 0 | Decidir què ha de fer la web | Feta |
> | 1 | Triar les eines i preparar la base | Feta |
> | 2 | Construir la web | Feta |
> | 3 | Publicar-la i provar-la amb usuaris | Oberta |
> | 4 | Escriure aquest treball | En curs |
> | 5 | Preparar la presentació | Per fer |
>
> *Taula. Les fases del projecte el novembre del 2026.*
>
> La norma no s'ha complert del tot: aquest treball (Fase 4) s'ha començat
> abans de tancar la Fase 3, perquè falten les proves amb usuaris.

*Què canvia:* una taula petita perquè es vegi d'un cop d'ull quina fase és
quina.

- [x] Acceptat

**Comentari:**

---

## Prioritat baixa

### 11. Cap. 1 — «Per sensacions, no per variables»

**Ara:**

> Els responsables del diccionari ho van resumir a la premsa amb una altra
> frase: «és programar per sensacions, no per variables»

**Proposta:**

> Els responsables del diccionari ho van resumir a la premsa amb una altra
> frase: «és programar per sensacions, no per variables». Les variables són
> una de les peces bàsiques del codi: la frase vol dir que el que compta és
> el que es vol aconseguir, no com s'escriu.

*Què canvia:* s'explica la cita en lloc de treure-la.

- [x] Acceptat

**Comentari:**

---

### 12. Cap. 19 — El recompte de preus

**Ara:**

> Amb la regla nova, de les 4.016 peces que hi ha a les catorze expansions
> (cada variant d'una carta compta com una peça), 4.003 tenen preu de
> Cardmarket recent, 13 surten marcades amb «≈» i cap es queda sense preu.
> Abans de la revisió n'hi havia 1.068 sense preu.

**Proposta:**

> Amb la regla nova, gairebé totes les cartes tenen un preu de Cardmarket
> recent. De les 4.016 peces de les catorze expansions (cada variant d'una
> carta compta com una peça), només 13 surten marcades amb «≈», i cap es
> queda sense preu. Abans de la revisió, n'hi havia més de mil sense preu.

*Què canvia:* la conclusió va primer, i surten dues xifres menys.

- [x] Acceptat

**Comentari:**

---

### 13. Cap. 15 — Taula 3, primera fila

**Ara:**

> El servei d'internet que dona les dades rebutjava les peticions, i després
> fallava de tant en tant

**Proposta:**

> El servei d'internet que dona les dades al principi no les volia donar, i
> després fallava de tant en tant

- [x] Acceptat

**Comentari:**

---

### 14. Cap. 4 — La taula de famílies d'eines

**Ara:** la taula surt just després de dir d'on surten els noms.

**Proposta:** afegir una frase abans de la taula:

> No cal conèixer aquestes eines: els noms són només exemples de cada
> família.

- [x] Acceptat

**Comentari:**

---

### 15. Cap. 21 — Netlify i Cloudflare Pages

**Ara:**

> Es van mirar dues alternatives, Netlify i Cloudflare Pages, i es van
> descartar perquè obligaven a obrir un compte en un altre servei sense donar
> res a canvi.

**Proposta:**

> Es van mirar dos serveis semblants, Netlify i Cloudflare Pages, i es van
> descartar perquè calia obrir-hi un compte nou i no donaven res més.

*Què canvia:* es diu què són abans del nom.

- [x] Acceptat

**Comentari:**
