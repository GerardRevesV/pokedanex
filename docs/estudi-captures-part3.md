# Estudi previ: què cal ensenyar amb captures a la Part III

*2026-11-10 · Document de treball. Serveix per decidir, abans d'escriure,
quines pantalles de la web val la pena ensenyar al treball i quines no.*

## El problema

La Part III (capítols 16 a 21) té un pressupost de 8 pàgines. Unes 2.100
paraules de text n'ocupen cinc i mitja, de manera que queden unes dues
pàgines i mitja per a figures. La web té moltes pantalles i no hi caben
totes: s'ha de triar.

## El criteri

Una captura entra si compleix tres condicions:

1. **Demostra una cosa que el text afirma.** No hi ha cap captura de
   decoració.
2. **S'entén sense haver fet servir la web.** El tribunal no la coneix.
3. **No repeteix el que ja ensenya una altra.**

## Les pantalles candidates

| Pantalla | Què demostra | Capítol | Decisió |
|---|---|---|---|
| Graella general | Que la web existeix i com és: cartes, comptadors, controls | 18 | **Entra.** És la imprescindible |
| Franja d'estadístiques | La promesa de la web: «valen X €» i «completar costaria Y €» | 18 | **Entra.** És el resultat que dona sentit a tota la resta |
| Vista d'àlbum | La funció més original: nou cartes per pàgina, com un arxivador de debò | 18 | **Entra** |
| Zoom d'una carta | Que es pot mirar una carta de prop | 18 | **Entra**, petita |
| El Compendi (selector d'expansions) | Que hi ha 14 expansions i cadascuna té el seu progrés | 18 | **Entra**, petita |
| Dues fitxes de carta, una amb preu exacte i una amb «≈» | La política de preus honesta | 19 | **Entra.** Són dos retalls petits, de costat |
| Graella i àlbum en pantalla de mòbil | Que la mateixa web s'adapta a una pantalla estreta | 20 | **Entra**, les dues de costat |
| Mode Catàleg (tot en color) | Poca cosa: s'assembla massa a la graella | 18 | **Fora.** S'explica en una frase |
| Desplegables dels filtres | Res que no es pugui dir amb paraules | 18 | **Fora** |
| La web en un altre idioma | Que hi ha tres idiomes | 18 | **Fora.** El selector d'idioma ja es veu a la graella |
| La barra d'adreces amb la web publicada | Que és a internet | 21 | **Fora.** És millor donar l'adreça, que es pot comprovar |

El capítol 17 (com està feta per dins) no porta cap captura: el que
s'hi explica no es veu a la pantalla. Hi va una taula amb les tres peces.

## Resultat

Set figures, fetes amb nou imatges. Totes surten de `tools/captures_part3.mjs`,
que obre la web en un navegador sense finestra, marca una col·lecció
d'exemple i desa les imatges a `treball/figures/`. Tornar-lo a executar
refà totes les captures iguals, cosa que serà útil si la web canvia abans
del lliurament.

## Tres avisos que han de constar als peus de figura

- **La col·lecció que es veu és un exemple** fet per a les captures (30
  cartes de 99). No és la col·lecció de ningú.
- **Els preus són els de l'11 d'agost del 2026**, la versió de dades que
  la web tenia carregada. La data es veu a la mateixa captura.
- **Les captures de mòbil estan fetes amb una pantalla simulada** de 390
  píxels d'amplada, no amb un telèfon de debò.

## Una cosa vista de passada

A la primera tanda de captures de mòbil, amb el panell d'estadístiques
obert, les barres de progrés quedaven aixafades i el «30/99» sortia tallat
per la dreta. No s'ha comprovat en un telèfon real ni s'ha arreglat: no és
feina d'aquesta part. Queda apuntat aquí perquè es revisi a part. Les
captures de mòbil del treball es fan amb el panell plegat.
