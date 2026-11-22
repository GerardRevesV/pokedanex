// temes.js — el tema de color de cada expansió.
//
// Cada expansió pot tenir el seu color d'accent (l'estètica del set);
// un interruptor al selector d'expansions permet quedar-se sempre amb
// el turquesa de la web. Un set sense tema propi cau al tema per defecte.
//
// Els colors de sota són els del tema FOSC. La versió per al tema clar
// no s'escriu a mà: es calcula (versioClara) enfosquint cada accent, amb
// el mateix to, fins que arriba al contrast mínim WCAG sobre els fons clars.

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
  // Scarlet & Violet: el vermell escarlata de la paraula "SCARLET" del logotip
  // (el color de Koraidon, que obre tota l'era)
  // Contrast WCAG: 5,88:1 sobre #0e1116 · 5,43:1 sobre #151a22 · 5,26:1 sobre #171d27;
  // accentText 5,63:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv1: {
    accent: "#ff4d6d",
    accentText: "#2e0812",
    resplendor: "rgba(255, 77, 109, 0.25)",
  },
  // Paldea Evolved: el terracota de la placa de pedra que sosté el logotip
  // Contrast WCAG: 8,35:1 sobre #0e1116 · 7,71:1 sobre #151a22 · 7,47:1 sobre #171d27;
  // accentText 7,62:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv2: {
    accent: "#d9a07c",
    accentText: "#2a1608",
    resplendor: "rgba(217, 160, 124, 0.25)",
  },
  // Obsidian Flames: el taronja de foc de la paraula "FLAMES" (el Charizard
  // tera de tipus fosc envoltat de flames)
  // Contrast WCAG: 5,90:1 sobre #0e1116 · 5,45:1 sobre #151a22 · 5,28:1 sobre #171d27;
  // accentText 5,64:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv3: {
    accent: "#ff5500",
    accentText: "#2a0e00",
    resplendor: "rgba(255, 85, 0, 0.25)",
  },
  // 151: el rosa pàl·lid de Mew, el Pokémon que tanca la Pokédex original
  // Contrast WCAG: 12,71:1 sobre #0e1116 · 11,73:1 sobre #151a22 · 11,37:1 sobre #171d27;
  // accentText 11,95:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv3pt5: {
    accent: "#ffc2e6",
    accentText: "#2e0a20",
    resplendor: "rgba(255, 194, 230, 0.25)",
  },
  // Paradox Rift: el blau elèctric dels llamps que esquerden el logotip
  // Contrast WCAG: 6,02:1 sobre #0e1116 · 5,56:1 sobre #151a22 · 5,39:1 sobre #171d27;
  // accentText 5,71:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv4: {
    accent: "#5a8dff",
    accentText: "#08143a",
    resplendor: "rgba(90, 141, 255, 0.25)",
  },
  // Paldean Fates: el daurat rosat i lluent de les cartes shiny del set
  // Contrast WCAG: 13,36:1 sobre #0e1116 · 12,34:1 sobre #151a22 · 11,95:1 sobre #171d27;
  // accentText 11,71:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv4pt5: {
    accent: "#ffd0a8",
    accentText: "#2e1a08",
    resplendor: "rgba(255, 208, 168, 0.25)",
  },
  // Temporal Forces: l'aiguamarina brillant de les lletres del logotip
  // Contrast WCAG: 15,91:1 sobre #0e1116 · 14,69:1 sobre #151a22 · 14,23:1 sobre #171d27;
  // accentText 12,07:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv5: {
    accent: "#b0fae6",
    accentText: "#06302a",
    resplendor: "rgba(176, 250, 230, 0.25)",
  },
  // Twilight Masquerade: el verd fulla d'Ogerpon, la màscara estrella del set
  // Contrast WCAG: 10,28:1 sobre #0e1116 · 9,49:1 sobre #151a22 · 9,20:1 sobre #171d27;
  // accentText 8,46:1 sobre l'accent (mínim 4,5:1 a tot arreu)
  sv6: {
    accent: "#3fd97a",
    accentText: "#062a14",
    resplendor: "rgba(63, 217, 122, 0.25)",
  },
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

// ---------- Versió clara de cada tema ----------

// Els tres fons del tema clar (han de coincidir amb --fons, --fons-suau i
// --fons-carta de :root[data-tema="clar"] a style.css). L'accent es fa
// servir com a text petit sobre tots tres, així que ha de complir sobre
// el que contrasta menys.
const FONS_CLARS = ["#f3f5f8", "#ffffff", "#ffffff"];
const CONTRAST_MINIM = 4.5; // WCAG AA per a text normal

// "#rrggbb" → [r, g, b] (0-255)
function hexARgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbAHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

// Luminància relativa (fórmula WCAG 2.x)
function luminancia(hex) {
  const [r, g, b] = hexARgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contrast WCAG entre dos colors (d'1:1 a 21:1)
export function contrast(a, b) {
  const [clar, fosc] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (clar + 0.05) / (fosc + 0.05);
}

// RGB ↔ HSL, per poder enfosquir sense canviar el to
function rgbAHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0)
    : max === g ? (b - r) / d + 2
    : (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslARgb([h, s, l]) {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const canal = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [canal(h + 1 / 3), canal(h), canal(h - 1 / 3)].map((v) => v * 255);
}

// La versió clara d'un tema: el mateix to i saturació, amb la lluminositat
// baixant d'un punt en un punt fins que l'accent fa 4,5:1 sobre tots els
// fons clars. Sobre un accent ja fosc, el text va en blanc (si l'accent fa
// 4,5:1 amb el fons clar, també el fa amb el blanc, que és encara més clar).
function versioClara(tema) {
  const [h, s, l] = rgbAHsl(hexARgb(tema.accent));
  let accent = tema.accent;
  for (let lluminositat = l; lluminositat > 0; lluminositat -= 0.01) {
    accent = rgbAHex(hslARgb([h, s, lluminositat]));
    if (FONS_CLARS.every((fons) => contrast(accent, fons) >= CONTRAST_MINIM)) break;
  }
  const [r, g, b] = hexARgb(accent);
  return {
    accent,
    accentText: "#ffffff",
    resplendor: `rgba(${r}, ${g}, ${b}, 0.22)`,
  };
}

// Les versions clares es calculen un sol cop i es guarden
const clars = new Map();
function temaClar(tema) {
  if (!clars.has(tema)) clars.set(tema, versioClara(tema));
  return clars.get(tema);
}

// ---------- Mode clar / fosc ----------

// El mode actiu el decideix l'script del <head> (index.html) abans del
// primer pintat, i l'interruptor de la capçalera el pot canviar (main.js)
function modeClar() {
  return document.documentElement.dataset.tema === "clar";
}

// Tema d'una expansió en el mode actiu (també per al filet de color de
// cada fila del selector); si el set no en té de propi (o l'id és
// desconegut), el per defecte
export function temaDe(setId) {
  const tema = TEMES[setId] ?? DEFECTE;
  return modeClar() ? temaClar(tema) : tema;
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
  setTemaAplicat = setId; // per refer-lo si es canvia de clar a fosc
  const tema = temaPerSetActiu() ? temaDe(setId) : (modeClar() ? temaClar(DEFECTE) : DEFECTE);
  const arrel = document.documentElement.style;
  arrel.setProperty("--accent", tema.accent);
  arrel.setProperty("--accent-text", tema.accentText);
  arrel.setProperty("--resplendor", tema.resplendor);
}

// L'expansió del darrer aplicarTema: en passar de clar a fosc (o a
// l'inrevés) l'accent s'ha de tornar a calcular per al mode nou
let setTemaAplicat = null;

// Canvia entre el tema clar i el fosc. Es crida amb "clar" o "fosc".
export function aplicarModeColor(mode) {
  document.documentElement.dataset.tema = mode;
  aplicarTema(setTemaAplicat);
}
