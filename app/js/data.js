// data.js — càrrega i actualització de les dades de les cartes.
//
// Hi ha dos tipus de versions de dades:
//  - de fitxer: les que hi ha a app/data/versions/ (creades amb tools/fetch_data.py)
//  - de navegador: les creades amb el botó "Actualitza dades" (desades a localStorage)
// Mai se sobreescriu res: cada actualització és una versió nova amb la seva data.

import { magatzem } from "./storage.js";

const CLAU_VERSIONS = "pokedanex.dataVersions";
const API_BASE = "https://api.pokemontcg.io/v2";
const SET_ID = "sv6pt5";
const MAX_REINTENTS = 4;

// Camps de cada carta que la web fa servir (els mateixos que a tools/fetch_data.py)
const CAMPS_CARTA = [
  "id", "number", "name", "supertype", "subtypes", "types", "rarity",
  "hp", "attacks", "abilities", "weaknesses", "resistances",
  "retreatCost", "convertedRetreatCost", "evolvesFrom", "evolvesTo",
  "artist", "flavorText", "nationalPokedexNumbers", "images",
  "cardmarket", "tcgplayer",
];

// Versions creades ara mateix que no han cabut al localStorage
// (només viuen mentre la pàgina és oberta)
const versionsEnMemoria = [];

// ---------- Llista de versions ----------

// Llegeix les versions desades al navegador. Cada una: {id, fetchedAt, cardCount, dades}
function llegirVersionsLocals() {
  try {
    // Sense magatzem (galetes bloquejades) no hi ha versions desades
    const desat = JSON.parse(magatzem()?.getItem(CLAU_VERSIONS));
    const versions = Array.isArray(desat?.versions) ? desat.versions : [];
    // Descartem les entrades malformades (p. ex. per un canvi d'esquema
    // futur): així una entrada corrupta no tomba tota la càrrega de la web
    return versions.filter(
      (v) => typeof v?.id === "string" && typeof v?.fetchedAt === "string",
    );
  } catch {
    return [];
  }
}

// Fusiona les versions de fitxer i les del navegador, de més nova a més vella
export async function carregarLlistaVersions() {
  const resposta = await fetch("data/versions.json");
  if (!resposta.ok) {
    throw new Error("No s'ha pogut llegir data/versions.json");
  }
  const index = await resposta.json();

  const deFitxer = index.versions.map((v) => ({
    id: v.id,
    fetchedAt: v.fetchedAt,
    cardCount: v.cardCount,
    file: v.file,
    origen: "fitxer",
  }));
  const deNavegador = [...llegirVersionsLocals(), ...versionsEnMemoria].map((v) => ({
    id: v.id,
    fetchedAt: v.fetchedAt,
    cardCount: v.cardCount,
    origen: "navegador",
  }));

  return [...deFitxer, ...deNavegador]
    .sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt));
}

// Carrega les dades completes d'una versió de la llista anterior
export async function carregarVersio(entrada) {
  let dades;
  if (entrada.origen === "fitxer") {
    const resposta = await fetch("data/" + entrada.file);
    if (!resposta.ok) {
      throw new Error("No s'ha pogut llegir la versió " + entrada.id);
    }
    dades = await resposta.json();
  } else {
    const totes = [...versionsEnMemoria, ...llegirVersionsLocals()];
    dades = totes.find((v) => v.id === entrada.id)?.dades;
    if (!dades) {
      throw new Error("No s'ha trobat la versió " + entrada.id + " al navegador");
    }
  }
  // Cartes sempre ordenades pel número de col·lecció (l'ordre de l'àlbum)
  dades.cards.sort((a, b) => Number(a.number) - Number(b.number));
  return dades;
}

// ---------- Botó "Actualitza dades" ----------

// Prova de llegir la clau de l'API de config.json (a l'arrel del repositori).
// Aquest fitxer no es puja mai a GitHub: quan la web estigui publicada no hi
// serà, i llavors seguim sense clau (amb límits de peticions més estrictes).
async function llegirClauApi() {
  try {
    const resposta = await fetch("../config.json");
    if (!resposta.ok) return null;
    return (await resposta.json()).pokemontcgApiKey || null;
  } catch {
    return null;
  }
}

function esperar(millisegons) {
  return new Promise((resol) => setTimeout(resol, millisegons));
}

// Petició a l'API amb reintents (l'API cau sovint). Només es reintenten els
// errors transitoris: caigudes de xarxa, 429 (massa peticions) i 5xx (servidor).
// Els altres 4xx (clau invàlida, adreça inexistent...) són permanents:
// reintentar només faria esperar l'usuari per res.
async function peticioApi(url, clauApi) {
  for (let intent = 1; intent <= MAX_REINTENTS; intent++) {
    try {
      const opcions = clauApi ? { headers: { "X-Api-Key": clauApi } } : {};
      const resposta = await fetch(url, opcions);
      if (!resposta.ok) {
        const error = new Error("HTTP " + resposta.status);
        error.permanent = resposta.status < 500 && resposta.status !== 429;
        throw error;
      }
      return await resposta.json();
    } catch (error) {
      if (error.permanent || intent === MAX_REINTENTS) throw error;
      await esperar(1500 * intent); // esperem una mica més a cada reintent
    }
  }
}

// Es queda només amb els camps que la web fa servir
function retallarCarta(carta) {
  const retallada = {};
  for (const camp of CAMPS_CARTA) {
    if (camp in carta) retallada[camp] = carta[camp];
  }
  return retallada;
}

// Baixa totes les cartes del set, pàgina a pàgina
async function baixarCartes(clauApi) {
  const cartes = [];
  let pagina = 1;
  while (true) {
    const url = `${API_BASE}/cards?q=set.id:${SET_ID}&pageSize=250&page=${pagina}`;
    const resposta = await peticioApi(url, clauApi);
    cartes.push(...resposta.data.map(retallarCarta));
    if (cartes.length >= resposta.totalCount || resposta.data.length === 0) break;
    pagina++;
  }
  cartes.sort((a, b) => Number(a.number) - Number(b.number));
  return cartes;
}

// Data en format ISO amb l'hora local (com fa tools/fetch_data.py)
function dataLocalISO(data) {
  const p = (n) => String(n).padStart(2, "0");
  const minutsDesfase = -data.getTimezoneOffset();
  const signe = minutsDesfase >= 0 ? "+" : "-";
  const absoluts = Math.abs(minutsDesfase);
  return (
    `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}` +
    `T${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}` +
    `${signe}${p(Math.floor(absoluts / 60))}:${p(absoluts % 60)}`
  );
}

// Desa una versió nova al navegador. Retorna false si no hi cap
// (localStorage té un límit d'uns 5 MB).
function desarVersioLocal(entrada) {
  const versions = llegirVersionsLocals();
  versions.push(entrada);
  const emmagatzematge = magatzem();
  if (!emmagatzematge) return false; // sense magatzem no es pot desar
  try {
    emmagatzematge.setItem(CLAU_VERSIONS, JSON.stringify({ versions }));
    return true;
  } catch {
    return false;
  }
}

// Baixa les dades fresques de l'API i crea una versió nova amb la data d'ara.
// Retorna { id, desada }: desada és false si no ha cabut al localStorage.
export async function actualitzarDades() {
  const clauApi = await llegirClauApi();
  const conjunt = (await peticioApi(`${API_BASE}/sets/${SET_ID}`, clauApi)).data;
  const cartes = await baixarCartes(clauApi);

  const ara = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const entrada = {
    id: `${ara.getFullYear()}-${p(ara.getMonth() + 1)}-${p(ara.getDate())}` +
        ` ${p(ara.getHours())}:${p(ara.getMinutes())}:${p(ara.getSeconds())}`,
    fetchedAt: dataLocalISO(ara),
    cardCount: cartes.length,
    dades: {
      schemaVersion: 1,
      fetchedAt: dataLocalISO(ara),
      source: "pokemontcg.io",
      set: conjunt,
      cards: cartes,
    },
  };

  const desada = desarVersioLocal(entrada);
  if (!desada) {
    versionsEnMemoria.push(entrada); // almenys es podrà consultar avui
  }
  return { id: entrada.id, desada };
}
