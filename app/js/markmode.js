// markmode.js — el mode de marcatge amb clics.
//
// "consulta" (per defecte): els clics només consulten (zoom a la graella,
// salt de l'àlbum a la graella). "normal" / "reverse" / "holo": el clic
// esquerre sobre una carta afegeix una còpia d'aquesta variant i el clic
// dret en treu una. La tria es recorda al navegador.

import { magatzem } from "./storage.js";

const CLAU_MODE = "pokedanex.markMode";
const MODES = ["consulta", "normal", "reverse", "holo"];

// Llegeix el mode desat; un valor estrany o inexistent torna a "consulta"
function carregarMode() {
  const desat = magatzem()?.getItem(CLAU_MODE);
  return MODES.includes(desat) ? desat : "consulta";
}

// Còpia en memòria: si el navegador no pot desar, el mode funciona igual
let mode = carregarMode();

// El mode actiu ara mateix
export function modeActiu() {
  return mode;
}

// És un mode que marca cartes (qualsevol menys "consulta")?
export function esModeVariant() {
  return mode !== "consulta";
}

// Canvia el mode i el recorda al navegador
export function canviarMode(nou) {
  if (!MODES.includes(nou)) return;
  mode = nou;
  try {
    magatzem()?.setItem(CLAU_MODE, nou);
  } catch {
    // Sense espai: el mode canvia igualment, només no es recordarà
  }
}
