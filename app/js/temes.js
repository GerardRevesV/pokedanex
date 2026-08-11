// temes.js — el tema de color de cada expansió.
//
// Cada expansió pot tenir el seu color d'accent (l'estètica del set);
// un interruptor al selector d'expansions permet quedar-se sempre amb
// el turquesa de la web. Un set sense tema propi cau al tema per defecte.

import { magatzem } from "./storage.js";

const CLAU_TEMA_PER_SET = "pokedanex.temaPerSet";

// El tema per defecte: el verd-turquesa de tota la web
const DEFECTE = {
  accent: "#2fd6b5",
  accentText: "#06231d",
  resplendor: "rgba(47, 214, 181, 0.25)",
};

// Temes propis per expansió (accent, text sobre l'accent i halo suau)
const TEMES = {
  // Shrouded Fable: el lila de Pecharunt, el Pokémon estrella del set
  // (prou clar perquè el text petit contrasti bé sobre el fons de carta)
  sv6pt5: {
    accent: "#bb6ce4",
    accentText: "#26082f",
    resplendor: "rgba(187, 108, 228, 0.25)",
  },
  // Stellar Crown: la lavanda prismàtica de les lletres i les gemmes del
  // logotip (l'energia estel·lar de Terapagos)
  // Contrast WCAG: 10,15:1 sobre #0e1116 · 9,37:1 sobre #151a22 · 9,08:1 sobre #171d27;
  // accentText 9,97:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv7: {
    accent: "#c9b4f0",
    accentText: "#180a33",
    resplendor: "rgba(201, 180, 240, 0.25)",
  },
  // Surging Sparks: el groc elèctric dels llamps de Pikachu ex, l'estrella del set
  // Contrast WCAG: 12,54:1 sobre #0e1116 · 11,58:1 sobre #151a22 · 11,22:1 sobre #171d27;
  // accentText 8,98:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv8: {
    accent: "#f5d020",
    accentText: "#362e08",
    resplendor: "rgba(245, 208, 32, 0.25)",
  },
  // Prismatic Evolutions: el daurat de les gemmes prismàtiques del logotip,
  // la identitat irisada de l'Eevee i les seves evolucions
  // Contrast WCAG: 9,32:1 sobre #0e1116 · 8,60:1 sobre #151a22 · 8,34:1 sobre #171d27;
  // accentText 8,70:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv8pt5: {
    accent: "#f0a830",
    accentText: "#241600",
    resplendor: "rgba(240, 168, 48, 0.25)",
  },
  // Journey Together: el blau cel-turquesa del degradat tropical del logotip
  // Contrast WCAG: 10,05:1 sobre #0e1116 · 9,28:1 sobre #151a22 · 8,99:1 sobre #171d27;
  // accentText 7,85:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv9: {
    accent: "#5ecbe6",
    accentText: "#082c35",
    resplendor: "rgba(94, 203, 230, 0.25)",
  },
  // Destined Rivals: el taronja de foc del logotip, l'estètica del Team Rocket
  // Contrast WCAG: 7,49:1 sobre #0e1116 · 6,91:1 sobre #151a22 · 6,70:1 sobre #171d27;
  // accentText 6,67:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv10: {
    accent: "#ff7d55",
    accentText: "#361208",
    resplendor: "rgba(255, 125, 85, 0.25)",
  },
  // Black Bolt: el cian elèctric dels llamps de Zekrom sobre negre
  // Contrast WCAG: 8,21:1 sobre #0e1116 · 7,58:1 sobre #151a22 · 7,35:1 sobre #171d27;
  // accentText 6,54:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  zsv10pt5: {
    accent: "#2ab8e8",
    accentText: "#082a36",
    resplendor: "rgba(42, 184, 232, 0.25)",
  },
  // White Flare: el rosa-magenta de les flames de Reshiram
  // Contrast WCAG: 7,84:1 sobre #0e1116 · 7,24:1 sobre #151a22 · 7,01:1 sobre #171d27;
  // accentText 7,20:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  rsv10pt5: {
    accent: "#ff7ab5",
    accentText: "#36081c",
    resplendor: "rgba(255, 122, 181, 0.25)",
  },
  // Mega Evolution: el taronja daurat del degradat d'arc de Sant Martí del logotip
  // Contrast WCAG: 8,93:1 sobre #0e1116 · 8,24:1 sobre #151a22 · 7,99:1 sobre #171d27;
  // accentText 7,31:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me1: {
    accent: "#ff9a2e",
    accentText: "#361f08",
    resplendor: "rgba(255, 154, 46, 0.25)",
  },
  // Phantasmal Flames: el violeta espectral de les lletres fantasmagòriques
  // Contrast WCAG: 7,00:1 sobre #0e1116 · 6,46:1 sobre #151a22 · 6,26:1 sobre #171d27;
  // accentText 6,99:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me2: {
    accent: "#a48cff",
    accentText: "#110836",
    resplendor: "rgba(164, 140, 255, 0.25)",
  },
  // Ascended Heroes: el daurat d'estil còmic del logotip (art via TCGdex,
  // perquè pokemontcg.io encara no en té)
  // Contrast WCAG: 12,31:1 sobre #0e1116 · 11,36:1 sobre #151a22 · 11,01:1 sobre #171d27;
  // accentText 9,51:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me2pt5: {
    accent: "#ffc85c",
    accentText: "#362608",
    resplendor: "rgba(255, 200, 92, 0.25)",
  },
  // Perfect Order: el verd neó del contorn del logotip sobre negre
  // Contrast WCAG: 12,07:1 sobre #0e1116 · 11,14:1 sobre #151a22 · 10,79:1 sobre #171d27;
  // accentText 8,48:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me3: {
    accent: "#86e63c",
    accentText: "#1c3608",
    resplendor: "rgba(134, 230, 60, 0.25)",
  },
  // Chaos Rising: el blau d'aigua dels esquitxos que envolten el logotip
  // Contrast WCAG: 10,41:1 sobre #0e1116 · 9,61:1 sobre #151a22 · 9,31:1 sobre #171d27;
  // accentText 8,95:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me4: {
    accent: "#7cc8ff",
    accentText: "#082236",
    resplendor: "rgba(124, 200, 255, 0.25)",
  },
  // Pitch Black: el magenta-violeta que brilla sobre el negre del logotip
  // Contrast WCAG: 6,89:1 sobre #0e1116 · 6,36:1 sobre #151a22 · 6,16:1 sobre #171d27;
  // accentText 6,26:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  me5: {
    accent: "#e070e8",
    accentText: "#320835",
    resplendor: "rgba(224, 112, 232, 0.25)",
  },
};

// Tema d'una expansió (per al filet de color de cada fila del selector);
// si el set no en té de propi (o l'id és desconegut), el per defecte
export function temaDe(setId) {
  return TEMES[setId] ?? DEFECTE;
}

// L'interruptor "tema segons l'expansió" és actiu? (per defecte, sí)
export function temaPerSetActiu() {
  try {
    return magatzem()?.getItem(CLAU_TEMA_PER_SET) !== "off";
  } catch {
    return true;
  }
}

// Desa la tria de l'interruptor al navegador
export function canviarTemaPerSet(valor) {
  try {
    magatzem()?.setItem(CLAU_TEMA_PER_SET, valor ? "on" : "off");
  } catch {
    // Sense espai: la tria val mentre la pàgina és oberta
  }
}

// Aplica el tema d'una expansió a tota la web: escriu les variables CSS
// globals i el CSS fa la resta (amb una transició suau de 300 ms).
// Amb l'interruptor apagat, sempre el tema per defecte.
export function aplicarTema(setId) {
  const tema = temaPerSetActiu() ? temaDe(setId) : DEFECTE;
  const arrel = document.documentElement.style;
  arrel.setProperty("--accent", tema.accent);
  arrel.setProperty("--accent-text", tema.accentText);
  arrel.setProperty("--resplendor", tema.resplendor);
}
