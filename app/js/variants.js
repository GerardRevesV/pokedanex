// variants.js — el coneixement de les variants d'una carta.
//
// Una mateixa carta de Pokémon pot existir en diverses variants:
//  - "normal":  la carta corrent
//  - "reverse": reverse holo (tota la carta brilla menys el dibuix)
//  - "holo":    holo (brilla el dibuix; a les rareses altes és l'única forma)
// Aquest mòdul diu quines variants té cada carta i quin preu té cadascuna.
//
// EL SISTEMA DE PREUS (decisió D-013), en quatre regles:
//  1. Quatre fonts, per ordre de confiança:
//       a) Cardmarket segons TCGdex      (euros, s'actualitza cada dia)
//       b) TCGplayer segons TCGdex       (dòlars convertits: aproximat)
//       c) Cardmarket segons pokemontcg.io  (euros, sovint antic)
//       d) TCGplayer segons pokemontcg.io   (dòlars convertits: aproximat)
//  2. Un preu només val si és fresc: com a màxim 60 dies més vell que la
//     baixada de les dades. Guanya la primera font amb un preu fresc.
//  3. Si cap font té un preu fresc, es fa servir el menys vell i es marca.
//  4. Si el preu en euros i el preu en dòlars discrepen moltíssim (5 vegades
//     o més), un dels dos és d'una altra carta: ens quedem el més baix,
//     que és el prudent, i es marca.
// Tot preu que no sigui "Cardmarket, fresc i sense discrepància" surt amb
// el símbol "≈" a la web. Si cap font té preu, no se n'inventa cap.

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

  // Sense TCGplayer (passa amb els sets més nous): ho diu TCGdex, que
  // porta el detall de les variants de cada carta. Les que duen segell
  // (premis de torneig, promocions de botiga) no compten: no surten dels
  // sobres de l'expansió.
  if (trobades.size === 0) {
    for (const entrada of entradesSenseSegell(carta)) {
      if (ORDRE_VARIANTS.includes(entrada.type)) trobades.add(entrada.type);
    }
  }

  // Sense cap de les dues fonts: deduïm per la raresa
  if (trobades.size === 0) {
    trobades.add("normal");
    if (RARESES_AMB_REVERSE.includes(carta?.rarity)) trobades.add("reverse");
  }

  return ORDRE_VARIANTS.filter((v) => trobades.has(v));
}

// ---------- Paràmetres del sistema de preus ----------

// Conversió aproximada de dòlars a euros per als preus de TCGplayer.
// És una aproximació orientativa, no una cotització (decisió D-009).
const TAXA_USD_EUR = 0.9;

// Un preu és "fresc" si no és més de 60 dies més vell que la baixada
const DIES_FRESC = 60;
const MS_PER_DIA = 24 * 60 * 60 * 1000;

// Dues fonts "discrepen moltíssim" si una multiplica l'altra per 5 o més
// i, a més, la diferència passa d'1 € (en cartes de cèntims no importa)
const FACTOR_DISCREPANCIA = 5;
const DIFERENCIA_MINIMA = 1;

// ---------- Eines petites ----------

function esPreu(valor) {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0;
}

// Converteix una data de qualsevol de les fonts ("2026/06/29" o
// "2026-11-09T23:49:45.866Z") a mil·lisegons; null si no s'entén
function llegirData(text) {
  if (typeof text !== "string") return null;
  const ms = Date.parse(text.replaceAll("/", "-"));
  return Number.isNaN(ms) ? null : ms;
}

// El valor del mig de tres (o el primer que hi hagi, si en falten).
// Amb tres mesures, una de sola que s'hagi tornat boja no ens enganya.
function valorCentral(valors) {
  const bons = valors.filter(esPreu);
  if (bons.length === 0) return null;
  if (bons.length < 3) return bons[0];
  return [...bons].sort((a, b) => a - b)[1];
}

// ---------- Font nova: TCGdex ----------

// Claus de Cardmarket a TCGdex: les "planes" són de la versió base del
// producte, les "-holo" de la seva versió brillant (el reverse)
const CLAUS_PLANES = ["trend", "avg30", "avg7"];
const CLAUS_BRILLANTS = ["trend-holo", "avg30-holo", "avg7-holo"];

function preuCardmarketDe(bloc, claus) {
  return valorCentral(claus.map((clau) => bloc[clau])) ?? null;
}

// Les entrades de TCGdex que compten: les que no porten cap segell
// (les cartes amb segell de torneig o de botiga són un altre producte,
// molt més car, i barrejar-les era l'origen dels preus disbarat)
function entradesSenseSegell(carta) {
  const detall = carta?.tcgdex?.variants_detailed;
  if (!Array.isArray(detall)) return [];
  return detall.filter(
    (e) => e && (!e.stamp || e.stamp.length === 0),
  );
}

// Preu de Cardmarket d'una entrada de TCGdex. Un mateix producte de
// Cardmarket pot servir per a dues variants (p. ex. normal i reverse):
// llavors la variant base fa servir les claus planes i l'altra les "-holo".
function preuCardmarketEntrada(entrada, totes) {
  const bloc = entrada?.pricing?.cardmarket;
  if (!bloc) return null;
  const companyes = new Set(
    totes
      .filter((e) => e?.pricing?.cardmarket?.idProduct === bloc.idProduct)
      .map((e) => e.type),
  );
  let preu;
  if (companyes.size > 1) {
    // Producte compartit: la base és la normal o, si no n'hi ha, l'holo
    const base = companyes.has("normal") ? "normal" : "holo";
    preu = preuCardmarketDe(bloc, entrada.type === base ? CLAUS_PLANES : CLAUS_BRILLANTS);
  } else if (entrada.type === "reverse") {
    // Producte propi d'un reverse: tot ell és brillant
    preu = preuCardmarketDe(bloc, CLAUS_BRILLANTS) ?? preuCardmarketDe(bloc, CLAUS_PLANES);
  } else {
    preu = preuCardmarketDe(bloc, CLAUS_PLANES) ?? preuCardmarketDe(bloc, CLAUS_BRILLANTS);
  }
  return preu === null ? null : { preu, data: llegirData(bloc.updated) };
}

// Claus de TCGplayer a TCGdex per variant
const CLAU_TCGDEX_TCGPLAYER = {
  normal: "normal",
  reverse: "reverse-holofoil",
  holo: "holofoil",
};
const CLAUS_PREU_TCGDEX_TCGPLAYER = ["marketPrice", "midPrice", "lowPrice"];

function preuTcgplayerEntrada(entrada, variant) {
  const bloc = entrada?.pricing?.tcgplayer;
  if (!bloc) return null;
  let grup = bloc[CLAU_TCGDEX_TCGPLAYER[variant]];
  if (!grup) {
    // Algunes variants amb producte propi porten un sol grup amb un altre nom
    const grups = Object.values(bloc).filter((v) => v && typeof v === "object");
    if (grups.length === 1) grup = grups[0];
  }
  if (!grup) return null;
  for (const clau of CLAUS_PREU_TCGDEX_TCGPLAYER) {
    if (esPreu(grup[clau])) {
      return { preu: grup[clau] * TAXA_USD_EUR, data: llegirData(bloc.updated) };
    }
  }
  return null;
}

// D'entre les entrades d'una variant, el preu que la representa: el de
// l'entrada corrent (sense patró especial) si en té; si no, el més barat
// dels patrons (p. ex. reverse "Poké Ball" i reverse "energia": el corrent
// és el barat; el patró rar no és el que té la majoria de col·leccionistes)
function preuTcgdex(carta, variant, llegir) {
  const totes = entradesSenseSegell(carta);
  const candidats = [];
  for (const entrada of totes) {
    if (entrada.type !== variant) continue;
    const trobat = llegir(entrada, totes);
    if (trobat) candidats.push({ ...trobat, corrent: !entrada.foil });
  }
  if (candidats.length === 0) return null;
  const corrents = candidats.filter((c) => c.corrent);
  const tria = (corrents.length > 0 ? corrents : candidats)
    .reduce((a, b) => (b.preu < a.preu ? b : a));
  return { preu: tria.preu, data: tria.data };
}

// ---------- Font antiga: pokemontcg.io ----------

// Claus de preus de Cardmarket per variant, en ordre de preferència.
// Nota: a les cartes holo, el trendPrice de Cardmarket JA és el preu holo.
const CLAUS_PREU_CARDMARKET = {
  normal: ["trendPrice", "avg30", "averageSellPrice"],
  reverse: ["reverseHoloTrend", "reverseHoloAvg30", "reverseHoloSell"],
  holo: ["trendPrice", "avg30", "averageSellPrice"],
};

function preuCardmarketAntic(carta, variant) {
  const preus = carta?.cardmarket?.prices;
  const claus = CLAUS_PREU_CARDMARKET[variant];
  if (!preus || !claus) return null;
  for (const clau of claus) {
    if (esPreu(preus[clau])) {
      return { preu: preus[clau], data: llegirData(carta.cardmarket.updatedAt) };
    }
  }
  return null;
}

// Claus de preus de TCGplayer per variant, en ordre de preferència
const CLAU_TCGPLAYER_PER_VARIANT = {
  normal: "normal",
  reverse: "reverseHolofoil",
  holo: "holofoil",
};
const CLAUS_PREU_TCGPLAYER = ["market", "mid", "low"];

function preuTcgplayerAntic(carta, variant) {
  const grup = carta?.tcgplayer?.prices?.[CLAU_TCGPLAYER_PER_VARIANT[variant]];
  if (!grup) return null;
  for (const clau of CLAUS_PREU_TCGPLAYER) {
    if (esPreu(grup[clau])) {
      return {
        preu: grup[clau] * TAXA_USD_EUR,
        data: llegirData(carta.tcgplayer.updatedAt),
      };
    }
  }
  return null;
}

// ---------- La tria ----------

// Les quatre fonts, per ordre de confiança (regla 1)
const FONTS = [
  { nom: "cardmarket", euros: true, llegir: (c, v) => preuTcgdex(c, v, preuCardmarketEntrada) },
  { nom: "tcgplayer", euros: false, llegir: (c, v) => preuTcgdex(c, v, (e) => preuTcgplayerEntrada(e, v)) },
  { nom: "cardmarket", euros: true, llegir: preuCardmarketAntic },
  { nom: "tcgplayer", euros: false, llegir: preuTcgplayerAntic },
];

const SENSE_PREU = Object.freeze({
  preu: null, font: null, aproximat: false, antic: false, dubtos: false,
});

function triarPreu(carta, variant) {
  const candidats = [];
  for (const font of FONTS) {
    const trobat = font.llegir(carta, variant);
    if (trobat) candidats.push({ ...trobat, font });
  }
  if (candidats.length === 0) return SENSE_PREU;

  // La data de referència és la de la baixada (carregarVersio l'apunta a
  // cada carta). Si no hi és, la data més nova que tingui la mateixa carta.
  const referencia =
    llegirData(carta.dataDades) ??
    Math.max(0, ...candidats.map((c) => c.data ?? 0));
  const esFresc = (c) =>
    c.data !== null && referencia - c.data <= DIES_FRESC * MS_PER_DIA;

  // Regles 2 i 3: el primer de fresc; si no n'hi ha cap, el menys vell
  let triat = candidats.find(esFresc);
  const antic = !triat;
  if (!triat) {
    triat = candidats.reduce((a, b) => ((b.data ?? 0) > (a.data ?? 0) ? b : a));
  }

  // Regla 4: contrast entre el preu en euros i el preu en dòlars. Només
  // es comparen preus igual de fiables (tots dos frescos, o cap dels dos).
  let dubtos = false;
  const altre = candidats.find(
    (c) => c.font.euros !== triat.font.euros && (antic || esFresc(c)),
  );
  if (altre) {
    const gran = Math.max(triat.preu, altre.preu);
    const petit = Math.min(triat.preu, altre.preu);
    if (gran >= petit * FACTOR_DISCREPANCIA && gran - petit >= DIFERENCIA_MINIMA) {
      dubtos = true;
      if (altre.preu < triat.preu) triat = altre;
    }
  }

  return {
    preu: triat.preu,
    font: triat.font.nom,
    aproximat: !triat.font.euros,
    antic,
    dubtos,
  };
}

// La tria es recorda per carta: la graella la demana moltes vegades i les
// dades d'una versió no canvien mentre és carregada
const memoria = new WeakMap();

// Tot el que se sap del preu d'una variant:
//   { preu, font, aproximat, antic, dubtos }
// preu és null si cap font en té. aproximat: convertit de dòlars.
// antic: cap font el té al dia. dubtos: les fonts discrepaven moltíssim.
export function infoPreuVariant(carta, variant) {
  if (!carta || typeof carta !== "object") return SENSE_PREU;
  let perVariant = memoria.get(carta);
  if (!perVariant) {
    perVariant = {};
    memoria.set(carta, perVariant);
  }
  if (!(variant in perVariant)) perVariant[variant] = triarPreu(carta, variant);
  return perVariant[variant];
}

// Preu en euros d'una variant, o null si cap font en té
export function preuVariant(carta, variant) {
  return infoPreuVariant(carta, variant).preu;
}

// Diu si el preu s'ha de marcar amb "≈" a la interfície: qualsevol preu
// que no sigui Cardmarket, fresc i sense discrepància
export function preuEsAproximat(carta, variant) {
  const info = infoPreuVariant(carta, variant);
  return info.preu !== null && (info.aproximat || info.antic || info.dubtos);
}

// El motiu del "≈", per explicar-lo en passar-hi el ratolí: "dubtos",
// "antic", "aproximat" o null si el preu no porta marca
export function motiuPreuAproximat(carta, variant) {
  const info = infoPreuVariant(carta, variant);
  if (info.preu === null) return null;
  if (info.dubtos) return "dubtos";
  if (info.antic) return "antic";
  if (info.aproximat) return "aproximat";
  return null;
}
