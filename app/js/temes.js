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
  // Prismatic Evolutions: el daurat de les gemmes prismàtiques del logotip,
  // la identitat irisada de l'Eevee i les seves evolucions
  // Contrast WCAG: 9,32:1 sobre #0e1116 · 8,60:1 sobre #151a22 · 8,34:1 sobre #171d27;
  // accentText 8,70:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv8pt5: {
    accent: "#f0a830",
    accentText: "#241600",
    resplendor: "rgba(240, 168, 48, 0.25)",
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
