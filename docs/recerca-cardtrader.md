# Recerca: l'API de CardTrader com a font complementària de preus

> Escrit el 2026-08-09 (Fase 2 en curs). Respon a un risc detectat a
> `propietats-cartes-pokemon.md`: els preus de Cardmarket que venen
> incrustats a l'API de pokemontcg.io poden anar mesos endarrerits.
> Aquí investiguem si l'API de CardTrader pot ser una segona font de
> preus en euros, més fresca. Només recerca: no s'ha tocat cap codi.

## El problema que volem resoldre

Pokedanex valora la col·lecció amb els preus de **Cardmarket** que dona
pokemontcg.io. A la pràctica hem vist que aquests preus poden anar
endarrerits (a la carta de prova, de mesos). La web ja ho gestiona amb
honestedat (mostra sempre la data de la versió de preus), però una segona
font **en euros i al dia** faria les xifres més fiables.

## Què és CardTrader

**CardTrader** (cardtrader.com) és un mercat de compravenda de cartes
col·leccionables — Magic, **Pokémon**, Yu-Gi-Oh! i més — amb seu a Itàlia
i venedors de tota Europa. És competència directa de Cardmarket i treballa
sobretot **en euros**. Hem comprovat que hi ha l'expansió **Shrouded
Fable** amb les seves cartes individuals (per exemple, la pàgina de
"Crobat 029/064 Shrouded Fable").

## Què ofereix l'API i com funciona

Documentació oficial: `https://www.cardtrader.com/en/docs/api/full/reference`
Adreça base: `https://api.cardtrader.com/api/v2`

### Accés

- **És gratuïta.** Cal un **compte de CardTrader** (gratuït); des de la
  configuració del perfil es genera un **token JWT** que s'envia a cada
  petició amb la capçalera `Authorization: Bearer <token>`.
- **Tot demana token.** Ho hem comprovat en directe: una petició sense
  token a `/games` retorna `401 Unauthorized`. No hi ha cap mode anònim
  (a diferència de pokemontcg.io, que funciona sense clau amb límits).

### Les crides que ens servirien

| Crida | Què retorna |
|---|---|
| `GET /games` | Llista de jocs (Pokémon inclòs), amb el seu id |
| `GET /expansions` | Totes les expansions, amb codi propi de CardTrader |
| `GET /blueprints/export?expansion_id=X` | Totes les cartes "de catàleg" d'una expansió: nom, imatge, i **ids de Cardmarket i TCGplayer** per creuar dades |
| `GET /marketplace/products?expansion_id=X` | Per a **cada carta** de l'expansió, les **25 ofertes més barates** ara mateix al mercat |

Amb **dues crides** (blueprints + marketplace) tindríem els preus de tota
Shrouded Fable. Cada oferta porta el preu en **cèntims amb la moneda**
(`{"cents": 250, "currency": "EUR"}` — la moneda és la del compte, per
tant euros si el compte està en EUR) i un `properties_hash` amb l'estat
de la carta (Near Mint...), l'idioma i les variants (foil / reverse holo;
el nom exacte de la propietat per a Pokémon cal confirmar-lo amb el token).

### Un matís important: són ofertes, no "preu de tendència"

Cardmarket ens dona un **preu de tendència** (`trendPrice`, una mitjana
elaborada). CardTrader ens donaria **ofertes reals en viu**: el més
natural seria quedar-nos el **preu mínim en Near Mint i anglès** de cada
carta. Són dues maneres diferents de mesurar; no es poden barrejar en una
sola xifra, però sí mostrar-les de costat ("tendència Cardmarket (data X)
vs. mínim CardTrader (avui)"). Encaixa amb el criteri "preu mínim
disponible" que ja vam heretar del projecte tcg.

### Límits de peticions

Molt generosos per al nostre cas: **200 peticions cada 10 segons** en
global, i 10 per segon al mercat. Nosaltres en necessitem **2 per
expansió i actualització**. Cap problema.

### Es pot cridar des del navegador?

Tècnicament sí: hem comprovat que l'API respon amb la capçalera
`access-control-allow-origin: *` (CORS obert). **Però no ho hem de fer**:
el token hauria d'anar dins el JavaScript de la web i, quan la web es
publiqui, **qualsevol el podria copiar** i fer-se passar pel nostre
compte. Per tant:

- El botó **"Actualitza dades"** del navegador **no pot** usar CardTrader
  (pokemontcg.io sí, perquè funciona sense clau).
- La via correcta és la que ja tenim: un pas intermedi tipus
  `tools/fetch_data.py`, executat des de l'ordinador, que llegeixi el
  token de `config.json` (que no es puja mai a GitHub) i generi
  **versions de fitxer** amb data. Encaixa exactament amb la cau
  versionada actual.

## Encaixa amb el projecte?

| Criteri | Veredicte |
|---|---|
| Pressupost 0 € | Sí: compte i API gratuïts |
| Preus en EUR | Sí (moneda del compte) |
| Preus frescos | Sí: ofertes del mercat en temps real |
| Cau versionada | Sí, per la via `fetch_data.py` → versions de fitxer |
| Botó d'actualitzar del navegador | **No** (exposaria el token) |
| Senzillesa | A mitges: cal **aparellar identificadors** (vegeu riscos) |

## Riscos i limitacions

1. **Aparellar cartes.** El nostre identificador és el de pokemontcg.io
   (ex. `sv6pt5-33`); CardTrader usa els seus propis `blueprint_id` i
   codis d'expansió. L'aparellament és factible — el número de col·lecció
   (029/064) surt al nom del blueprint, i els blueprints porten ids de
   Cardmarket/TCGplayer per creuar — però és un pas nou d'script que cal
   fer bé i revisar a mà un cop per expansió (compte amb les secretes).
2. **Condicions d'ús.** Les ToS diuen que l'API està pensada per
   **gestionar el propi inventari i vendes**; per a "APIs de mercat amb
   dades de preus i disponibilitat" demanen **escriure'ls** perquè
   valorin cada cas. Per a un ús personal i educatiu com el nostre el
   risc és petit, però si algun dia la web publicada mostra preus de
   CardTrader, el pas correcte és enviar-los un correu explicant el
   projecte. El scraping del web està prohibit explícitament (nosaltres
   no en fem: usaríem l'API).
3. **Edat mínima.** Les ToS demanen **18 anys** per comprar o vendre.
   L'Edanna és menor: el compte (encara que només sigui per llegir preus)
   l'hauria de crear i gestionar un adult de la família.
4. **Metodologia diferent.** "Mínim d'ofertes" no és comparable amb
   "tendència": s'han de mostrar com a dues xifres separades, mai
   sumades ni barrejades.
5. **Segona dependència externa.** Un servei més que pot canviar o
   fallar. La cau versionada ens protegeix (la web mai en depèn en viu),
   i seria sempre **complement opcional**: si CardTrader falla, tot
   segueix funcionant amb Cardmarket.

## Recomanació

**Adoptar-la més endavant, no ara.** És viable, gratuïta i resol de
veritat el problema de la frescor, però la Fase 2 (col·lecció) no la
necessita i afegiria ara mateix dues feines noves (aparellament d'ids i
gestió del token) que no aporten res a la fase actual. La finestra bona
és quan es treballi el bloc de **valor i preus**: llavors sí, com a
**segona columna de preu opcional** al costat de Cardmarket.

Passos concrets quan s'adopti:

1. Un adult de la família crea el compte de CardTrader i genera el token;
   es desa a `config.json` (mai al repositori) com a clau nova, per
   exemple `"cardtrader_token"`.
2. Estendre `tools/fetch_data.py` amb un pas opcional CardTrader: baixar
   blueprints i ofertes de l'expansió, aparellar per número de col·lecció
   (revisió manual la primera vegada) i calcular el mínim Near Mint en
   anglès per carta i variant.
3. Afegir al JSON de cada versió un bloc `cardtrader` per carta (preu
   mínim en cèntims, moneda i data), al costat dels preus de Cardmarket.
   Si el pas CardTrader no s'executa, el bloc simplement no hi és.
4. A la web, mostrar-lo com a segona xifra amb la seva data ("mínim a
   CardTrader"), amb claus i18n noves en ca/es/en, sense barrejar-lo mai
   amb el valor Cardmarket.
5. Abans de publicar la web amb aquests preus, escriure a CardTrader
   explicant l'ús educatiu i sense ànim de lucre.

## Fonts

- Documentació de l'API: https://www.cardtrader.com/en/docs/api/full/reference
- Portal per a desenvolupadors: https://www.cardtrader.com/en/docs/api
- Condicions del servei: https://static.cardtrader.com/en/pages/terms-of-service
- Shrouded Fable a CardTrader: https://www.cardtrader.com/en/games/pokemon/expansions/shrouded-fable/categories
- Comprovació pròpia (2026-08-09): `GET /api/v2/games` sense token → 401;
  capçalera `access-control-allow-origin: *` present a la resposta.
