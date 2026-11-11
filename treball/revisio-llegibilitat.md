# Revisió de llegibilitat: paràgrafs massa tècnics

*11 de novembre del 2026*

Repàs de `treball/revisio-tot-junt.md` buscant paràgrafs que costin
d'entendre a una persona de 17 anys sense coneixements de programació. En
general el text ja és planer; aquests són els punts on més s'encalla la
lectura, de més a menys greu. Els números de línia són del document unificat
d'aquesta data. **No s'ha canviat res**: és només la llista, per decidir què
es retoca.

## Prioritat alta

1. **Cap. 19, la regla dels preus en quatre passos** (línies 1408-1425).
   És el passatge més dens del treball: quatre fonts de preu ordenades, un
   canvi de moneda fix, el llindar de 60 dies i la regla de «cinc vegades».
   Massa condicions seguides. Proposta: explicar primer la idea en una frase
   («es tria el preu més fiable i més recent, i si dos preus no quadren es
   desconfia del més alt») i deixar el detall en una taula o a un annex.

2. **Cap. 19, «Tot preu que no sigui de Cardmarket, recent i sense dubtes
   surt marcat amb ≈»** (línies 1427-1430). La frase acumula negacions i
   s'ha de llegir dues vegades. Proposta: dir-ho en positiu («Només els
   preus de Cardmarket recents i sense dubtes surten sense marca; tots els
   altres porten «≈»).

3. **Cap. 5, la segona precaució sobre l'estudi de METR** (línies 870-881).
   Hi surten «generacions de models», un estudi repetit, un canvi de disseny
   i programadors que «renunciaven a enviar feines». Cal saber com era
   l'experiment per entendre-ho. Proposta: escurçar-ho a la idea central
   (les eines han canviat tant que el mateix estudi ja no es pot repetir) i
   explicar en una frase per què.

4. **Cap. 13, git, branca, *pull request* i fusionar** (línies 1153-1173).
   Quatre paraules noves en pocs paràgrafs. Les definicions hi són, però una
   darrere l'altra. Proposta: una comparació quotidiana (com treballar en una
   còpia d'un document compartit i demanar que l'aprovin abans de passar els
   canvis a l'original).

## Prioritat mitjana

5. **Cap. 20, l'accessibilitat i el contrast** (línies 1483-1491). WCAG,
   «4,5 a 1», «entre 6,2 i 12,5 a 1» i les animacions reduïdes en un sol
   paràgraf. Una ràtio de contrast no és intuïtiva. Proposta: dir què vol
   dir el número («com més alt, més es distingeix el text del fons») i
   treure una de les xifres.

6. **Cap. 17, la web estàtica** (línies 1293-1297). «Cap programa
   funcionant en un altre ordinador ni cap base de dades» dona per sabut què
   és un servidor i una base de dades. Proposta: contrastar-la amb una web
   que sí que en té (per exemple, una xarxa social que guarda els comptes de
   tothom).

7. **Cap. 3, la finestra de context** (línies 748-754). El concepte és
   abstracte. Proposta: una comparació (com una pissarra de mida fixa: quan
   s'omple, cal esborrar el més antic).

8. **Cap. 3, l'agent que treballa en bucle** (línies 704-711). «Executar
   ordres», «eines» i «bucle» seguits. L'exemple final ajuda, però arriba
   tard. Proposta: començar per l'exemple del botó que no respon.

9. **Cap. 5, els «40 punts percentuals»** (línies 862-863). La diferència
   entre punts percentuals i percentatge no és evident. Proposta: dir-ho
   amb un exemple («es pensaven que anaven un 20 % més de pressa i en
   realitat anaven un 19 % més a poc a poc»), comprovant les xifres a la
   font.

10. **Cap. 8, les fases** (línies 1013-1020). Sis fases numerades de la 0
    a la 5, i dir que la Fase 4 és aquest treball mentre la 3 és oberta
    confon si no es veu la llista. Proposta: una taula petita amb les sis
    fases i el seu estat.

## Prioritat baixa

11. **Cap. 1, la frase de Collins «per sensacions, no per variables»**
    (línia 596). Qui no programa no sap què és una variable. Proposta: una
    nota breu o treure la cita.

12. **Cap. 19, el recompte final de preus** (línies 1441-1444). Quatre
    xifres grans seguides (4.016, 4.003, 13 i 1.068). Proposta: quedar-se
    amb el contrast «abans, més de mil sense preu; ara, cap».

13. **Cap. 15, taula 3, primera fila** (línia 1220). «Rebutjava les
    peticions» és vocabulari tècnic. Proposta: «no responia quan se li
    demanaven les dades».

14. **Cap. 4, taula de famílies d'eines** (línies 782-787). Molts noms
    d'eines que un lector no coneix. És acceptable en una taula, però es
    podria dir que no cal conèixer-les.

15. **Cap. 21, Netlify i Cloudflare Pages** (línies 1509-1511). Dos noms
    que no tornen a sortir. Es podria dir «dos serveis semblants» i deixar
    els noms per a una nota.
