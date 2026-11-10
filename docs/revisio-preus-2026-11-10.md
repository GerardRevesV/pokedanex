# Revisió dels preus (10 de novembre de 2026)

Revisió de totes les dades de preus desades a `app/data/versions/`, aplicant
la mateixa regla que la web (`app/js/variants.js`): primer Cardmarket i, si
no en té, TCGplayer convertit de dòlars a euros (preu aproximat, "≈").

Només s'han revisat les dades de fitxer. Les versions creades amb el botó
"Actualitza dades" viuen al navegador i no s'han pogut mirar.

## Resum

| Expansió | Peces | Estat dels preus |
|---|---|---|
| sv6pt5, sv7, sv8, sv9, sv10, rsv10pt5, zsv10pt5 | 2.121 | Cardmarket (3 peces amb preu aproximat) |
| sv8pt5, me1, me2 | 804 | Tot amb preu aproximat de TCGplayer (Cardmarket buit) |
| me2pt5, me3, me4, me5 | 1.068 | **Cap preu**: ni Cardmarket ni TCGplayer |

## Problemes trobats

### 1. Quatre expansions sense cap preu

me2pt5 (295 cartes), me3 (124), me4 (122) i me5 (120) no porten cap preu de
cap de les dues fonts. A la web, el valor de la col·lecció i el cost de
completar-la hi surten a 0 €, amb l'avís de peces sense preu. Les dades són
de l'11 d'agost; pot ser que l'API ja en tingui ara.

### 2. Totes les dades tenen tres mesos

Tots els fitxers es van baixar l'11 d'agost de 2026 (sv6pt5 té, a més, una
versió del 9 d'agost). No hi ha cap versió posterior.

### 3. Els preus de Cardmarket són més vells que la data que ensenya la web

La web diu "preus de l'11 d'agost", però aquesta és la data de la baixada.
El preu de Cardmarket de cada carta du la seva pròpia data, i la majoria són
molt anteriors:

| Última actualització de Cardmarket | Cartes |
|---|---|
| novembre – desembre de 2025 | 605 |
| gener – febrer de 2026 | 451 |
| març – juliol de 2026 | 248 |

TCGplayer, en canvi, sí que és de l'11 d'agost a gairebé totes les cartes.
Com que la web prefereix Cardmarket, sovint tria el preu més vell.

### 4. Preus sospitosos (Cardmarket i TCGplayer discrepen més de 4 vegades)

| Carta | Variant | Cardmarket | TCGplayer (≈ €) | Lectura |
|---|---|---|---|---|
| sv7-107 Archaludon (Rare) | holo | 27,19 € | 0,05 € | Cardmarket gairebé segur erroni |
| sv7-111 Raging Bolt (Rare) | holo | 42,38 € | 0,24 € | Cardmarket gairebé segur erroni |
| sv8-29 Fuecoco (Common) | normal / reverse | 7,37 € / 4,43 € | 0,09 € / 0,22 € | Cardmarket gairebé segur erroni |
| sv7-57 Slowpoke (Common) | normal / reverse | 0,08 € / 0,18 € | 2,48 € / 4,00 € | TCGplayer sembla inflat; Cardmarket plausible |
| sv7-152 Milcery (Illustration Rare) | holo | 4,10 € | 17,59 € | Cardmarket vell (preu ha pujat?) |
| rsv10pt5-101 Litwick (Illustration Rare) | holo | 7,07 € | 30,51 € | Ídem |
| zsv10pt5-151 Audino (Illustration Rare) | holo | 7,03 € | 39,77 € | Ídem |
| zsv10pt5-153 Cinccino (Illustration Rare) | holo | 6,62 € | 27,21 € | Ídem |
| sv6pt5-39 Pecharunt ex (Double Rare) | holo | 1,38 € | 5,55 € | Ídem |
| zsv10pt5-28 Kyurem ex (Double Rare) | holo | 0,39 € | 3,11 € | Ídem |

Les tres primeres inflen el valor: una carta de cèntims compta com si en
valgués 27, 42 o 7 euros. Probablement Cardmarket hi barreja una altra
versió de la carta (per exemple, una promo segellada).

### 5. Cartes amb normal i holo al mateix preu

sv7-16, rsv10pt5-11, rsv10pt5-21 i zsv10pt5-1 existeixen en normal i en
holo, però Cardmarket només du un preu i la web l'aplica a totes dues.

## Què està bé

- La resta de les 2.121 peces amb Cardmarket tenen preus coherents amb
  TCGplayer i amb la seva pròpia mitjana de 30 dies.
- No hi ha cap preu negatiu ni cap peça que agafi una clau equivocada.

## Després de tornar a baixar les dades (mateix dia, 19:50–19:56)

S'han baixat versions noves de les 14 expansions amb `tools/fetch_data.py`.
Les versions de l'agost es conserven. El resultat és que baixar de nou
gairebé no arregla res, perquè el problema és a la font (pokemontcg.io):

- **Cardmarket no s'ha mogut.** Les dates són exactament les mateixes que a
  l'agost (la majoria, de novembre de 2025 a febrer de 2026). La font ha
  deixat d'actualitzar els preus europeus.
- **TCGplayer ha avançat només fins al 15 d'octubre.** Abans era de l'11
  d'agost; ara totes les cartes diuen 15 d'octubre, gairebé un mes enrere.
- **Les quatre expansions sense preu continuen sense preu**: me2pt5, me3,
  me4 i me5.
- **Els preus erronis hi continuen**: Archaludon (27,19 €), Raging Bolt
  (42,38 €) i Fuecoco (7,37 €), idèntics. N'apareixen dos de nous a sv10:
  Team Rocket's Moltres ex (Cardmarket 275,08 € contra ≈ 64,12 €) i Jamming
  Tower (21,50 € contra ≈ 4,95 €).

Conclusió: el que cal decidir ja no és quan es baixen les dades, sinó d'on.

## La solució: segona font i sistema de quatre regles (mateix dia)

S'afegeix TCGdex com a segona font i es defineix el sistema de preus de la
decisió D-013 (`docs/decisions.md`). Resultat sobre les dades noves,
calculat amb el codi real de la web (`app/js/variants.js`):

| | Abans (dades de l'agost, regla antiga) | Ara |
|---|---|---|
| Peces amb preu de Cardmarket | 2.118 (la majoria, vell) | 4.003 (del dia abans) |
| Peces amb preu convertit de dòlars (≈) | 807 | 8 |
| Peces amb preu antic (≈) | no es mirava | 1 |
| Peces amb preu dubtós, resolt a la baixa (≈) | no es mirava | 4 |
| Peces sense preu | 1.068 | 0 |

Què ha passat amb els preus erronis de la revisió:

- Archaludon (sv7-107) i Raging Bolt (sv7-111): 27,19 € i 42,38 € eren el
  preu de la versió amb segell. Ara surten als cèntims que valen.
- Fuecoco (sv8-29): TCGdex també hi porta un preu de Cardmarket erroni; la
  regla de contrast el detecta i es queda amb ≈ 0,09 €.
- La mateixa regla atrapa tres cartes més de Surging Sparks que la revisió
  no havia vist: Quaxly (sv8-50, Cardmarket 17,55 €), Duraludon (sv8-129) i
  Terapagos (sv8-161, Cardmarket 8,94 €).
- Les quatre expansions buides (me2pt5, me3, me4, me5) tenen ara preu de
  Cardmarket a totes les peces.

Queda una carta sense dades de TCGdex (zsv10pt5-80, el nom no coincideix
entre les dues fonts) i una amb preu antic (el holo de sv7-16, una variant
que només coneix la font vella). Totes dues tenen preu igualment, marcat.
