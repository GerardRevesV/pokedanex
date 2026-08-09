# Propietats de les cartes Pokémon

> Investigació feta el 2026-08-09 amb dades reals de l'API pokemontcg.io
> sobre l'expansió Shrouded Fable (sv6pt5). És l'equivalent Pokémon de les
> propietats (color, cost, raresa...) que el projecte tcg usava per a Sorcery.

## Xifres reals de Shrouded Fable

- **99 cartes**: 64 numerades + 35 secretes (número per sobre de 64).
- Per gran categoria (*supertype*): **79 Pokémon, 18 Entrenador (Trainer),
  2 Energia**.

## Propietats de cada carta (segons l'API)

### Identificació (les més importants per a nosaltres)

| Propietat | Exemple | Ús a Pokedanex |
|---|---|---|
| `id` | `sv6pt5-33` | Identificador estable únic (clau de la col·lecció) |
| `number` | `33` | Número de col·lecció — **ordre de l'àlbum** |
| `set` | Shrouded Fable + totals | Sabem si és secreta (número > 64) |
| `regulationMark` | `H` | Marca de regulació (torneigs) — poc útil per a nosaltres |
| `images.small` / `large` | URL PNG | Miniatura a la graella / zoom |

### Classificació (per a filtres i ordenació)

| Propietat | Valors a Shrouded Fable | Equivalent a Sorcery (tcg) |
|---|---|---|
| `supertype` | Pokémon · Trainer · Energy | El "tipus" de carta |
| `subtypes` | Basic, Stage 1, Stage 2, ex, Tera, Ancient, Future, Item, Supporter, Stadium, Pokémon Tool, ACE SPEC | Subtipus |
| `types` (tipus d'energia) | Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless | El **color** de Sorcery (Air, Fire, Earth, Water...) |
| `rarity` | 9 rareses (vegeu sota) | Les 4 rareses de Sorcery |

**Rareses reals del set (amb recompte):** Common (28), Uncommon (20),
Rare (7), Double Rare (6), ACE SPEC Rare (3), Illustration Rare (15),
Ultra Rare (10), Special Illustration Rare (5), Hyper Rare (5).
Les 4 primeres + ACE SPEC són del set base; les altres són les secretes.

### Propietats de joc (per a la fitxa de la carta)

- `hp` — punts de vida (només Pokémon).
- `attacks` — llista d'atacs: nom, **cost en energies** (p. ex.
  `["Darkness","Colorless"]`), cost total (`convertedEnergyCost`), dany i text.
  És l'equivalent del "cost de manà" de Sorcery.
- `abilities` — habilitats (nom + text), si en té.
- `weaknesses` / `resistances` — debilitat i resistència (tipus + valor, p. ex. Grass ×2).
- `retreatCost` / `convertedRetreatCost` — cost de retirada.
- `evolvesFrom` / `evolvesTo` — línia evolutiva (Inkay → Malamar).

### Propietats de col·leccionista

- `artist` — il·lustrador (a Sorcery també hi era i s'usava per filtrar!).
- `flavorText` — text d'ambientació.
- `nationalPokedexNumbers` — número de Pokédex nacional (p. ex. Inkay = 686):
  permet una ordenació alternativa "com la Pokédex".

### Preus (incrustats a la mateixa carta!)

- `cardmarket.prices` (euros): `trendPrice`, `lowPrice`, `avg1/7/30`... i —
  molt important — **versions reverse holo a part**: `reverseHoloTrend`,
  `reverseHoloLow`, `reverseHoloAvg30`...
- `tcgplayer.prices` (dòlars): per variant (`normal`, `reverseHolofoil`,
  `holofoil`) amb low/mid/high/market.
- **Detectar variants:** si una carta té preu `reverseHolofoil`, existeix en
  reverse holo. Regla general: comuns/infreqüents/rares tenen normal +
  reverse; les rareses especials (Illustration Rare i superiors) només normal.

## Ordenacions i filtres que això ens permet

1. **Per número de col·lecció** (per defecte — l'ordre de l'àlbum real).
2. **Per raresa** (les 9, en ordre de valor).
3. **Per tipus d'energia** (les "pastilles de color" heretades de l'estètica tcg).
4. **Per categoria**: Pokémon / Entrenador / Energia, i subtipus (ex, Tera...).
5. **Per preu** (de més cara a més barata).
6. **Per il·lustrador** i **per número de Pokédex** (extres fàcils).
7. **Filtre "em falten"** / "les tinc" (com al tcg).

## Riscos detectats (a vigilar a la Fase 1)

- **L'API pokemontcg.io de tant en tant falla** (errors 502 durant aquesta
  mateixa investigació). Reforça la decisió de treballar amb **cau local**:
  descarregar les dades un cop i servir-les des del nostre JSON.
- **Els preus de Cardmarket dins l'API poden anar endarrerits** (a la carta
  de prova: actualitzats el març de 2026; els de TCGplayer, al dia). Cal
  decidir a la Fase 1 com ho gestionem (mostrar la data sempre, i valorar
  CardTrader o una altra font com a complement).
- Sense clau d'API (gratuïta, es demana amb un correu) hi ha límits de
  peticions més estrictes.
