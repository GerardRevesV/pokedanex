# Canvis de l'enquesta: la web al mòbil

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`). Al final hi ha
una llista de comprovació per fer amb un telèfon de debò.

## Entrada del diari

**Què s'ha fet:**
- Revisió de la web al mòbil, perquè a l'enquesta el 64% de les persones
  la van provar només amb el telèfon, hi posaven notes més baixes (8,5
  contra 8,9) i sis deien que «no es veu bé a la pantalla». S'ha recorregut
  la web en pantalles de 320, 360, 390 i 430 píxels d'ample, en vertical i
  apaïsat, amb tema clar i fosc, i un subagent ha revisat el codi buscant
  els problemes que un navegador d'ordinador no ensenya.
- **Primera pantalla amb cartes:** abans la primera carta sortia a 911
  píxels de dalt (més avall que tota la pantalla d'un mòbil); ara surt a
  290. La capçalera s'ha compactat (l'idioma i el tema van a dins de
  «Filtres i opcions», i «Graella/Àlbum» comparteix fila amb aquest botó) i
  les estadístiques comencen plegades al mòbil.
- **Accés ràpid des de qualsevol punt:** quan s'ha baixat i la capçalera ja
  no es veu, surten dos botons rodons a baix a la dreta: la lupa porta al
  cercador (amb el teclat obert) i la fletxa torna a dalt de tot.
- **Botons per al dit:** els botons + i − de les cartes passen de 27 a 40
  píxels (44 de zona tàctil) i els del zoom a 44.
- **Àlbum:** les cartes de l'àlbum passen de 95 a 110 píxels d'ample i
  l'àlbum comença just sota la capçalera.
- **Detalls d'iPhone i Android:** el menú «Desa la imatge» ja no surt en
  mantenir el dit sobre una carta, no apareix el requadre gris a cada toc,
  la lletra no s'engrandeix sola en posar el mòbil apaïsat, i el botó de
  tancar del zoom respecta la barra d'estat.
- **Error trobat de passada:** el panell de canviar d'expansió sortia
  enganxat al cantó de dalt a l'esquerra en lloc de centrat (també a
  l'ordinador). Ara surt centrat.

**Eines usades:** Claude Code (amb subagents per a l'auditoria del codi i
la revisió), navegador integrat amb simulació de mòbil.

**Costos:** 0 € (de subscripció a part).

**Problemes:** el navegador de l'ordinador només *simula* un mòbil. No pot
provar el teclat de debò, la barra d'adreces que s'amaga, l'osca, els
gestos del sistema ni el menú d'iOS. Per això hi ha la llista de
comprovació del final.

## Entrades de l'històric

### La web, pensada per al mòbil

A l'enquesta, la majoria de persones van fer servir la web amb el mòbil, i
la puntuaven més baix que les que la feien servir amb l'ordinador. En
obrir-la al mòbil, tota la primera pantalla eren menús i estadístiques:
no es veia cap carta. Ara la capçalera és més curta (l'idioma i el tema
s'amaguen dins de «Filtres i opcions») i les estadístiques comencen
plegades, de manera que les cartes surten de seguida.

### Botons flotants per tornar a dalt

Al mòbil la capçalera no es queda fixa a dalt, perquè ocuparia mitja
pantalla. Per buscar una altra carta des de la meitat de la llista calia
fer lliscar el dit fins a dalt de tot. Ara, quan la capçalera ja no es veu,
apareixen dos botons rodons a baix a la dreta: un per anar al cercador i
un per tornar a dalt. A l'ordinador no surten.

### Botons més grans per al dit

Els botons + i − que serveixen per marcar les cartes que tens feien 27
píxels, i la mida recomanada per tocar amb el dit és de 44. Ara fan 40
píxels visibles i responen fins a 44. Perquè hi càpiguen, el nom de la
variant (normal, reverse, holo) va a la seva pròpia línia, a sobre.

## Decisió

### Botons flotants en lloc d'una capçalera fixa

Hi havia dues maneres de tenir el cercador sempre a mà al mòbil: deixar la
capçalera fixa a dalt (com a l'ordinador) o afegir botons flotants. La
capçalera, fins i tot compactada, fa uns 200 píxels: fixa, es menjaria una
quarta part de la pantalla tota l'estona. Els botons flotants només ocupen
un cantó i només surten quan fan falta. Per això s'han triat els botons.

## Repte

### Provar un mòbil sense tenir-lo a la mà

Tota la revisió s'ha fet amb el navegador de l'ordinador fent veure que és
un mòbil: se li diu la mida de la pantalla i que es toca amb el dit, i la
web s'hi adapta. Però hi ha coses que la simulació no pot reproduir. El
teclat de debò tapa mitja pantalla, la barra d'adreces apareix i
desapareix en fer lliscar el dit, l'iPhone té una osca a dalt i un gest per
tornar enrere des de la vora, i Safari fa zoom automàtic en tocar un camp
de text si la lletra és petita. Alguns d'aquests problemes es poden
preveure llegint el codi, i així s'ha fet; però l'única manera de saber
que funcionen és provar-ho amb un telèfon de veritat. Per això el treball
acaba amb una llista de comprovació que l'autora pot seguir amb el seu
mòbil en cinc minuts.

Durant la revisió també es va trobar un error que no era del mòbil: el
panell per canviar d'expansió sortia arraconat dalt a l'esquerra, també a
l'ordinador. Una regla general que esborra els marges de tots els elements
(per partir de zero) també esborrava el marge automàtic que el navegador
fa servir per centrar els panells. És un bon exemple de com una regla
pensada per simplificar pot tenir efectes en llocs inesperats.

## Llista de comprovació amb un telèfon de debò (5 minuts)

Obre la web publicada amb el mòbil (Safari a l'iPhone o Chrome a Android) i
marca cada punt:

1. En obrir la web, sense tocar res, es veu almenys una fila de cartes.
2. Toca el cercador: surt el teclat i la pàgina **no** fa zoom sola.
   Escriu «picachu» i surten Pikachus.
3. Toca «Filtres i opcions»: surten l'idioma, el tema i els filtres.
   Torna'l a tocar i es pleguen.
4. Fes lliscar el dit cap avall fins a la carta 50: a baix a la dreta
   surten una lupa i una fletxa.
5. Toca la fletxa: torna a dalt. Torna a baixar i toca la lupa: torna a
   dalt amb el teclat obert.
6. Marca una carta amb el + i desmarca-la amb el −: el dit encerta el botó
   a la primera i no se selecciona cap text.
7. Mantén el dit sobre la imatge d'una carta: **no** ha de sortir el menú
   «Desa la imatge / Copia».
8. Toca una carta: s'obre gran. Fes lliscar la imatge a l'esquerra i a la
   dreta per passar de carta, i tanca amb la ×. La × no queda tapada per
   la barra de dalt del mòbil.
9. Obre una carta holo o «ex»: mou el dit per sobre i la brillantor el
   segueix.
10. Canvia a «Àlbum»: les cartes es veuen senceres sense moure el mòbil, i
    lliscar de costat passa la pàgina (sense que el navegador torni enrere).
11. Toca «Canvia d'expansió»: el panell surt centrat, la llista es mou amb
    el dit i la pàgina del darrere no es mou.
12. Posa el mòbil apaïsat: la lletra no s'engrandeix sola i res no surt de
    la pantalla pels costats.
13. Canvia a tema clar i a tema fosc: tot es llegeix bé en tots dos.
14. Obre «Estadístiques d'aquesta expansió»: es desplega, i en tornar a
    obrir la web es recorda com l'has deixat.

Si algun punt falla, apunta quin mòbil i quin navegador és, i fes-ne una
captura de pantalla.
