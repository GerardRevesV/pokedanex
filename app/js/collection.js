// collection.js — l'estat de la col·lecció de l'usuari.
//
// Segueix el patró "estat separat de la interfície" del projecte tcg:
// aquest mòdul només guarda dades (quantes còpies tens de cada carta i
// variant) i avisa els subscriptors quan canvien; qui pinta la pantalla
// és un altre mòdul. Es desa al navegador (localStorage), sense comptes.
//
// Format desat: {"schemaVersion":1,"cards":{"sv6pt5-33":{"normal":2,"reverse":1}}}
// Només s'hi guarden comptadors > 0: quan tots els comptadors d'una carta
// tornen a zero, la carta desapareix del registre.

import { magatzem } from "./storage.js";

const CLAU_COLLECCIO = "pokedanex.collection";
const VARIANTS = ["normal", "reverse", "holo"];

// Noms reservats de JavaScript que mai poden ser ids de carta: assignar
// "__proto__" a un objecte en tocaria el prototip en lloc de crear l'entrada
const IDS_PROHIBITS = ["__proto__", "constructor", "prototype"];

// Es queda només amb els comptadors vàlids: enters > 0 de variants conegudes
function netejar(cards) {
  const net = {};
  if (typeof cards !== "object" || cards === null) return net;
  for (const [id, valors] of Object.entries(cards)) {
    if (IDS_PROHIBITS.includes(id)) continue; // id impossible: el saltem
    const entrada = {};
    for (const variant of VARIANTS) {
      const valor = valors?.[variant];
      if (Number.isInteger(valor) && valor > 0) entrada[variant] = valor;
    }
    if (Object.keys(entrada).length > 0) net[id] = entrada;
  }
  return net;
}

// Llegeix la col·lecció desada; si està corrupta, es comença de zero
function carregar() {
  try {
    const desat = JSON.parse(magatzem().getItem(CLAU_COLLECCIO));
    if (desat?.schemaVersion !== 1) return {};
    return netejar(desat.cards);
  } catch {
    return {};
  }
}

// L'estat viu: { "sv6pt5-33": { normal: 2, reverse: 1 }, ... }
let cartes = carregar();

// Desa l'estat al navegador. Retorna false si no s'ha pogut (l'estat
// continua viu en memòria igualment, i la interfície pot avisar).
function desar() {
  try {
    magatzem().setItem(
      CLAU_COLLECCIO,
      JSON.stringify({ schemaVersion: 1, cards: cartes }),
    );
    return true;
  } catch {
    return false;
  }
}

// ---------- Avisos (patró de subscripció) ----------

const subscriptors = [];

// Registra una funció que es cridarà cada cop que la col·lecció canviï
export function subscriure(funcio) {
  subscriptors.push(funcio);
}

function avisar() {
  for (const funcio of subscriptors) funcio();
}

// ---------- Consultes ----------

// Comptadors d'una carta: sempre les tres variants, amb 0 per defecte
export function comptadors(id) {
  const c = cartes[id];
  return {
    normal: c?.normal ?? 0,
    reverse: c?.reverse ?? 0,
    holo: c?.holo ?? 0,
  };
}

// Té almenys una còpia de la carta, en qualsevol variant?
// (Object.hasOwn i no "in": "in" també miraria el prototip de l'objecte)
export function enTeCap(id) {
  return Object.hasOwn(cartes, id);
}

// Nombre de cartes diferents que es tenen (en qualsevol variant)
export function totals() {
  return Object.keys(cartes).length;
}

// Nombre de cartes diferents que es tenen d'una expansió, comptades pel
// prefix dels ids (ex. "sv6pt5-"). Permet al selector d'expansions mostrar
// el progrés de cada set sense carregar-ne les dades.
export function comptarAmbPrefix(prefix) {
  return Object.keys(cartes).filter((id) => id.startsWith(prefix)).length;
}

// ---------- Canvis ----------

// Suma delta (+1, -1...) al comptador d'una variant, sense baixar mai de 0.
// Retorna true si s'ha pogut desar al navegador (false = només en memòria).
export function ajustar(id, variant, delta) {
  if (!VARIANTS.includes(variant)) return false;
  const nous = comptadors(id);
  nous[variant] = Math.max(0, nous[variant] + Math.trunc(delta));

  // Només guardem comptadors > 0; si tots són zero, la carta desapareix
  const entrada = {};
  for (const v of VARIANTS) {
    if (nous[v] > 0) entrada[v] = nous[v];
  }
  if (Object.keys(entrada).length > 0) cartes[id] = entrada;
  else delete cartes[id];

  const desada = desar();
  avisar();
  return desada;
}

// Esborra tota la col·lecció. Retorna true si s'ha pogut desar.
export function buidar() {
  cartes = {};
  const desada = desar();
  avisar();
  return desada;
}

// ---------- Exportar / importar (còpia de seguretat en JSON) ----------

// Text JSON de la col·lecció, a punt per descarregar com a fitxer
export function exportarJson() {
  return JSON.stringify({ schemaVersion: 1, cards: cartes }, null, 2);
}

// Substitueix la col·lecció pel contingut d'un fitxer exportat abans.
// Si el text no quadra amb el format, llança un Error amb el motiu
// (i la col·lecció actual NO es toca). Retorna true si s'ha pogut desar.
export function importarJson(text) {
  let dades;
  try {
    dades = JSON.parse(text);
  } catch {
    throw new Error("El fitxer no és un JSON vàlid");
  }
  if (
    dades?.schemaVersion !== 1 ||
    typeof dades.cards !== "object" ||
    dades.cards === null ||
    Array.isArray(dades.cards)
  ) {
    throw new Error(
      "El fitxer no té el format esperat (schemaVersion 1 amb 'cards')",
    );
  }

  const noves = {};
  for (const [id, valors] of Object.entries(dades.cards)) {
    if (IDS_PROHIBITS.includes(id)) continue; // id impossible: el saltem
    if (typeof valors !== "object" || valors === null || Array.isArray(valors)) {
      throw new Error("La carta " + id + " no té comptadors vàlids");
    }
    const entrada = {};
    for (const [variant, valor] of Object.entries(valors)) {
      if (!VARIANTS.includes(variant)) {
        throw new Error("La carta " + id + " té una variant desconeguda: " + variant);
      }
      if (!Number.isInteger(valor) || valor < 0) {
        throw new Error(
          "La carta " + id + " té un comptador invàlid: " + variant + " = " + valor,
        );
      }
      if (valor > 0) entrada[variant] = valor;
    }
    if (Object.keys(entrada).length > 0) noves[id] = entrada;
  }

  cartes = noves;
  const desada = desar();
  avisar();
  return desada;
}
