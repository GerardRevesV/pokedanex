# Canvis de l'enquesta: l'índex lleuger de la cerca global

Text ja redactat perquè el coordinador el passi als documents numerats
(`diari.md`, `historic.md`, `decisions.md`, `reptes.md`). Continua el que
explica `cerca.md`.

## Entrada del diari

**Què s'ha fet:**
- La cerca «A altres expansions» ja no baixa totes les expansions senceres
  a la primera cerca. Ara baixa un sol fitxer petit,
  `app/data/index-cerca.json`, que només té el número i el nom de cada
  carta. Amb les 22 expansions, la primera cerca passa de baixar uns
  20,7 MB (1,44 MB comprimits, en 44 peticions) a 92 KB (27 KB comprimits,
  en una sola petició): unes 50 vegades menys.
- L'expansió sencera només es baixa quan es clica un resultat, que és quan
  de debò es necessita.
- El programa que baixa les dades (`tools/fetch_data.py`) torna a fer
  l'índex cada cop que s'afegeix o s'actualitza una expansió.

**Eines usades:** Claude Code.

**Costos:** 0 € (de subscripció a part).

**Problemes:** cap de greu. Calia que la cerca continués sent correcta
quan l'usuari actualitza una expansió des del navegador (vegeu la decisió).

## Entrada de l'històric

### Un índex lleuger per a la cerca a totes les expansions

Quan es va crear la cerca a totes les expansions, la web baixava les dades
completes de cada expansió (preus, atacs, il·lustradors...) només per
llegir-ne els noms. Amb 22 expansions eren més de 20 MB, massa per a un
mòbil amb dades. Ara el programa que baixa les dades genera també un
fitxer d'índex amb només el número i el nom de cada carta (92 KB), i la web
busca sobre aquest fitxer. Per estalviar encara més, de cada expansió es
guarda una sola vegada l'adreça de les imatges, i cada carta només hi
afegeix el seu número.

## Decisió

### Què passa amb l'índex quan l'usuari prem «Actualitza»

El botó «Actualitza» baixa dades noves d'una expansió i les desa al
navegador, però l'índex és un fitxer de la web i no canvia. Si una carta
canviés de nom o n'hi aparegués una de nova, la cerca podria mostrar una
cosa i, en clicar-la, la web n'obriria una altra. Per evitar-ho, quan una
expansió té al navegador una versió més nova que la de l'índex, la cerca
fa servir els noms d'aquella versió, que ja és a l'ordinador i no cal
baixar. A més, si mai hi ha una expansió que no surt a l'índex (per
exemple, si algú l'afegeix i s'oblida de pujar-lo), la web la baixa
sencera com feia abans: la cerca és una mica més lenta però mai incompleta.

S'havia considerat no fer índex i mantenir la baixada completa, que era
més simple, però amb 22 expansions el pes ja no era raonable al mòbil.
