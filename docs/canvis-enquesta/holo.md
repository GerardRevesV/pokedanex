# Canvis de l'enquesta — sessió «holo»

Text ja redactat perquè el coordinador el passi als documents numerats
(`docs/diari.md`, `docs/historic.md`, `docs/decisions.md`, `docs/reptes.md`).
Data de la feina: 2026-11-22.

---

## Entrada del diari

### 2026-11-22 — Les cartes holo brillen al zoom

**Què s'ha fet:** una persona de l'enquesta demanava «zooms de cartes holo
amb efectes de brillantor». Ara, quan obres una carta en gran i és holo o
reverse holo, la carta brilla. A l'ordinador s'inclina una mica i el
reflex de colors segueix el ratolí. Al mòbil segueix el dit i, si no la
toques, la brillantor es mou sola, a poc a poc. Les cartes holo brillen
només a la il·lustració i les reverse a tot el marc menys la il·lustració,
com les de veritat. Les cartes «ex» i les rareses altes brillen senceres,
i les més rares porten a més una mica de purpurina.

**Eines usades:** Claude Code (Opus 5.5) com a orquestrador, amb un
subagent per revisar el codi; el navegador integrat per provar-ho en mida
d'ordinador i de mòbil. Tot està fet amb CSS i JavaScript propis: no s'hi
ha afegit cap llibreria ni cap imatge.

**Costos:** 0 €.

**Problemes:** la primera versió de la reverse amb prou feines es veia
sobre els marcs de colors clars, i se n'ha hagut d'apujar la intensitat.
També es va veure que les cartes «ex» tenen la il·lustració a tota la
carta, i limitar-ne la brillantor al requadre de dalt quedava estrany.

---

## Entrada de l'històric

### Brillantor holo al zoom de les cartes

Al zoom, les cartes holo i reverse holo brillen amb un reflex de colors i
una llum que segueixen el ratolí (la carta s'inclina) o el dit, i que al
mòbil es mouen soles. Brilla el que tens: una carta que no tens, o que
només tens en normal, no brilla; al mode catàleg brillen també les que
existeixen en holo. Si l'ordinador o el mòbil té activat «reduir el
moviment», la brillantor es queda quieta.

---

## Decisió

### Quines cartes brillen, i on

**Decisió:** al zoom brilla el que tens. Si en tens alguna còpia holo, la
carta brilla com a holo. Si no en tens cap d'holo però sí alguna reverse,
brilla com a reverse. Si només la tens en normal, o no la tens (la carta
es veu apagada), no brilla. Al mode catàleg, on cap carta no es veu
apagada, també brillen les cartes que existeixen en holo encara que no
les tinguis.

On brilla:
- **Holo:** només la il·lustració.
- **Reverse:** tota la carta menys la il·lustració, com al paper de veritat.
- **Cartes d'art complet** (les «ex» i les Illustration, Ultra i Hyper Rare):
  la carta sencera, i les més rares amb purpurina.

**Per què:** la web és una eina de col·leccionista, i el que interessa és
veure *la teva* carta. Si una carta comuna brillés sempre que existeix en
reverse, brillarien gairebé totes i l'efecte deixaria de voler dir res. La
zona de la il·lustració s'ha mesurat sobre les imatges de les cartes
normals de Scarlet & Violet i Mega Evolution.

**Alternatives considerades:** fer brillar també les cartes de la graella i
de l'àlbum en passar-hi el ratolí. S'ha descartat per ara: amb 250 cartes
a la pantalla podria alentir els mòbils, i el zoom és on es mira una carta
de prop. Es va considerar també fer servir una llibreria d'efectes holo ja
feta, però hauria afegit pes i una dependència externa per a un efecte que
es pot fer amb unes poques línies de CSS.

**Cost:** 0 €.
