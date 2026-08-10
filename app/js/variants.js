// variants.js — el coneixement de les variants d'una carta.
//
// Una mateixa carta de Pokémon pot existir en diverses variants:
//  - "normal":  la carta corrent
//  - "reverse": reverse holo (tota la carta brilla menys el dibuix)
//  - "holo":    holo (brilla el dibuix; a les rareses altes és l'única forma)
// Aquest mòdul diu quines variants té cada carta i quin preu té cadascuna.

// L'ordre fix en què es mostren les variants a tota la web
const ORDRE_VARIANTS = ["normal", "reverse", "holo"];

// Correspondència entre les claus de preus de TCGplayer i les nostres
// variants. Les claus que no hi són ("1stEditionHolofoil"...) s'ignoren.
const VARIANT_PER_CLAU_TCGPLAYER = {
  normal: "normal",
  reverseHolofoil: "reverse",
  holofoil: "holo",
};

// Rareses que existeixen en normal i reverse holo (per si falta TCGplayer)
const RARESES_AMB_REVERSE = ["Common", "Uncommon", "Rare"];

// Claus de preus de Cardmarket per variant, en ordre de preferència:
// si la primera no hi és, es prova la següent (reserves).
// Nota: a les cartes holo, el trendPrice de Cardmarket JA és el preu holo
// (Cardmarket no du una clau a part per a la variant holo).
const CLAUS_PREU_CARDMARKET = {
  normal: ["trendPrice", "avg30", "averageSellPrice"],
  reverse: ["reverseHoloTrend", "reverseHoloAvg30", "reverseHoloSell"],
  holo: ["trendPrice", "avg30", "averageSellPrice"],
};

// Retorna les variants que existeixen d'una carta, sempre en l'ordre
// normal → reverse → holo i mai buit (com a mínim ["normal"]).
export function variantsDisponibles(carta) {
  const trobades = new Set();

  // Si TCGplayer llista preus, cada clau de preu és una variant que existeix
  const preus = carta?.tcgplayer?.prices;
  if (preus) {
    for (const clau of Object.keys(preus)) {
      const variant = VARIANT_PER_CLAU_TCGPLAYER[clau];
      if (variant) trobades.add(variant);
    }
  }

  // Sense TCGplayer (o sense cap clau reconeguda): deduïm per la raresa
  if (trobades.size === 0) {
    trobades.add("normal");
    if (RARESES_AMB_REVERSE.includes(carta?.rarity)) trobades.add("reverse");
  }

  return ORDRE_VARIANTS.filter((v) => trobades.has(v));
}

// Preu en euros d'una variant segons Cardmarket, o null si no n'hi ha
export function preuVariant(carta, variant) {
  const preus = carta?.cardmarket?.prices;
  const claus = CLAUS_PREU_CARDMARKET[variant];
  if (!preus || !claus) return null;
  for (const clau of claus) {
    const preu = preus[clau];
    if (typeof preu === "number" && preu > 0) return preu;
  }
  return null;
}
