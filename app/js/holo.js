// holo.js — la brillantor de les cartes holo i reverse holo al zoom.
//
// Una persona de l'enquesta demanava «zooms de cartes holo amb efectes de
// brillantor». Al zoom, si la carta que mires brilla de veritat, s'hi
// posen dues capes per sobre de la imatge (els estils són a css/holo.css):
//  - el reflex de colors (l'arc de Sant Martí del paper holo), que es
//    mou amb el punter, i
//  - una llum blanca suau, com la d'un llum que es reflecteix a la carta.
// A l'ordinador la carta s'inclina una mica i el reflex segueix el
// ratolí; al mòbil segueix el dit i, si no la toques, es mou sola.
//
// QUINES CARTES BRILLEN (una regla, la mateixa a tot arreu):
//  - Mode col·lecció: brilla el que tens. Si en tens alguna còpia holo,
//    brilla com a holo; si no, però en tens alguna reverse, com a reverse.
//    Si només la tens en normal, o no la tens (la carta apagada), no brilla.
//  - Mode catàleg (cap carta apagada): a més, les cartes que existeixen
//    en holo brillen com a holo encara que no les tinguis.
// ON BRILLA:
//  - holo: només la il·lustració (com al paper de veritat);
//  - reverse: tota la carta menys la il·lustració;
//  - cartes d'art complet (les «ex», Illustration Rare, Ultra Rare...):
//    tota la carta; les rareses més altes, amb un reflex més ric
//    (purpurina a sobre).
// Tot el moviment és amb transform i opacity (el que el navegador mou
// sense recalcular la pàgina), i amb «reduir el moviment» activat al
// sistema la brillantor es queda quieta.

import { variantsDisponibles } from "./variants.js";
import { comptadors, enTeCap } from "./collection.js";

// Rareses altes: la il·lustració ocupa tota la carta i el reflex és més
// ric. Les «ex» (Double Rare) també tenen l'art a tota la carta, però
// sense la purpurina de les més rares.
const RARESES_RIQUES = new Set([
  "Illustration Rare", "Special Illustration Rare", "Ultra Rare",
  "Hyper Rare", "Shiny Ultra Rare", "Mega Hyper Rare", "Black White Rare",
  "MEGA_ATTACK_RARE",
]);
const RARESES_ART_COMPLET = new Set([...RARESES_RIQUES, "Double Rare"]);

// Després de tocar-la amb el dit, quant temps es queda on l'has deixat
// abans de tornar al moviment automàtic
const PAUSA_DIT_MS = 2500;

const menysMoviment = matchMedia("(prefers-reduced-motion: reduce)");

let marc = null; // el contenidor de la imatge del zoom i les capes (no s'inclina)
let temporitzadorDit = null;

// Quina brillantor toca a una carta: "holo", "reverse" o null (cap)
export function tipusBrillantor(carta) {
  if (!carta) return null;
  const cataleg = document.body.dataset.visualitzacio === "cataleg";
  // Les cartes d'art complet només existeixen en holo. A les expansions
  // més noves les fonts encara no diuen quines variants tenen (variants.js
  // hi posa "normal" per defecte): per la raresa ja sabem que brillen.
  if (RARESES_ART_COMPLET.has(carta.rarity)) {
    return enTeCap(carta.id) || cataleg ? "holo" : null;
  }
  const variants = variantsDisponibles(carta);
  const copies = comptadors(carta.id);
  if (variants.includes("holo") && copies.holo > 0) return "holo";
  if (variants.includes("reverse") && copies.reverse > 0) return "reverse";
  if (cataleg && variants.includes("holo")) return "holo";
  return null;
}

// Posa el punt de llum a (x, y), en fraccions de 0 a 1 dins la carta
function moureLlum(x, y) {
  const dx = Math.min(1, Math.max(0, x)) * 2 - 1; // de −1 a 1
  const dy = Math.min(1, Math.max(0, y)) * 2 - 1;
  marc.style.setProperty("--holo-x", dx.toFixed(3));
  marc.style.setProperty("--holo-y", dy.toFixed(3));
}

// Torna la llum al centre (i la carta a pla)
function reposar() {
  marc.style.setProperty("--holo-x", "0");
  marc.style.setProperty("--holo-y", "0");
}

function posicioDins(esdeveniment) {
  const caixa = marc.getBoundingClientRect();
  return [
    (esdeveniment.clientX - caixa.left) / caixa.width,
    (esdeveniment.clientY - caixa.top) / caixa.height,
  ];
}

// Embolcalla la imatge del zoom amb el marc i les capes (un sol cop).
// Dos nivells: el marc exterior no es mou mai (hi escoltem el punter i el
// mesurem) i el de dins és el que s'inclina. Si escoltéssim l'element
// inclinat, a les vores la carta fugiria del cursor i tremolaria.
// Les capes no reben clics ni tocs (pointer-events: none al CSS): el
// lliscar entre cartes, el pessic i el clic fora del zoom segueixen
// funcionant exactament igual que abans.
export function iniciarHolo() {
  const imatge = document.getElementById("zoom-imatge");
  if (!imatge || marc) return;
  marc = document.createElement("div");
  marc.className = "holo";
  const inclinacio = document.createElement("div");
  inclinacio.className = "holo-inclinacio";
  marc.append(inclinacio);
  imatge.replaceWith(marc);
  const reflex = document.createElement("div");
  reflex.className = "holo-capa holo-reflex";
  reflex.innerHTML = '<div class="holo-colors"></div><div class="holo-purpurina"></div>';
  const llum = document.createElement("div");
  llum.className = "holo-capa holo-llum";
  llum.innerHTML = '<div class="holo-punt"></div>';
  for (const capa of [reflex, llum]) capa.setAttribute("aria-hidden", "true");
  inclinacio.append(imatge, reflex, llum);
  reposar();

  // Ratolí: la llum segueix el cursor; en sortir, la carta torna a pla
  marc.addEventListener("pointermove", (esdeveniment) => {
    if (!marc.dataset.holo || menysMoviment.matches) return;
    if (esdeveniment.pointerType === "mouse") {
      moureLlum(...posicioDins(esdeveniment));
      return;
    }
    // Dit (o llapis): segueix el dit i atura un moment el moviment sol.
    // No es crida preventDefault: el navegador i el lliscar del zoom
    // reben el gest igual que sempre.
    if (!esdeveniment.isPrimary) return;
    marc.classList.add("holo--dit");
    moureLlum(...posicioDins(esdeveniment));
    clearTimeout(temporitzadorDit);
    temporitzadorDit = setTimeout(() => {
      marc.classList.remove("holo--dit");
      reposar();
    }, PAUSA_DIT_MS);
  });
  marc.addEventListener("pointerleave", (esdeveniment) => {
    if (esdeveniment.pointerType === "mouse") reposar();
  });
}

// Aplica (o treu, amb null) la brillantor de la carta oberta al zoom.
// La criden main.js en obrir el zoom, en passar de carta, quan la
// col·lecció canvia (marcar una reverse la fa brillar al moment) i en
// tancar-lo. Amb el zoom tancat el marc no és visible i no s'anima res.
export function aplicarHolo(carta) {
  if (!marc) return;
  const tipus = tipusBrillantor(carta);
  clearTimeout(temporitzadorDit);
  marc.classList.remove("holo--dit");
  reposar();
  // En passar de carta, les capes canvien d'un cop (sense fondre's), perquè
  // el reflex de l'anterior no es vegi uns instants sobre la nova
  marc.classList.add("holo--canvi");
  requestAnimationFrame(() => requestAnimationFrame(() => marc.classList.remove("holo--canvi")));
  if (!tipus) {
    delete marc.dataset.holo;
    delete marc.dataset.holoArt;
    delete marc.dataset.holoRic;
    return;
  }
  marc.dataset.holo = tipus;
  // Les cartes d'art complet brillen senceres quan són holo; les més
  // rares, a més, amb purpurina
  const holo = tipus === "holo";
  if (holo && RARESES_ART_COMPLET.has(carta.rarity)) marc.dataset.holoArt = "complet";
  else delete marc.dataset.holoArt;
  if (holo && RARESES_RIQUES.has(carta.rarity)) marc.dataset.holoRic = "";
  else delete marc.dataset.holoRic;
}
