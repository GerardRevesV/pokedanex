// data.js — càrrega i actualització de les dades de les cartes.
//
// Hi ha dos tipus de versions de dades:
//  - de fitxer: les que hi ha a app/data/versions/ (creades amb tools/fetch_data.py)
//  - de navegador: les creades amb el botó "Actualitza dades" (desades a localStorage)
// Mai se sobreescriu res: cada actualització és una versió nova amb la seva data.

import { magatzem } from "./storage.js";

// Les versions de navegador es desen amb una clau per expansió:
// "pokedanex.dataVersions:sv6pt5", "pokedanex.dataVersions:sv8pt5"...
const CLAU_VERSIONS = "pokedanex.dataVersions";
const CLAU_SET_ACTIU = "pokedanex.activeSet";
const SET_DEFECTE = "sv6pt5";
const API_BASE = "https://api.pokemontcg.io/v2";
// 1 intent + 5 reintents (esperes de 2, 4, 8, 16 i 32 s, com tools/fetch_data.py):
// l'API torna errors 500/502 molt sovint i de vegades cal un minut perquè respongui
const MAX_REINTENTS = 6;
// Segona font de preus (decisió D-013): TCGdex, oberta, gratuïta i sense
// clau, que actualitza cada dia els preus de Cardmarket i de TCGplayer
const TCGDEX_BASE = "https://api.tcgdex.net/v2/en";
const TCGDEX_SIMULTANIES = 8; // peticions alhora (n'hi ha una per carta)

// Camps de cada carta que la web fa servir (els mateixos que a tools/fetch_data.py)
const CAMPS_CARTA = [
  "id", "number", "name", "supertype", "subtypes", "types", "rarity",
  "hp", "attacks", "abilities", "weaknesses", "resistances",
  "retreatCost", "convertedRetreatCost", "evolvesFrom", "evolvesTo",
  "artist", "flavorText", "nationalPokedexNumbers", "images",
  "cardmarket", "tcgplayer",
];

// Versions creades ara mateix que no han cabut al localStorage
// (només viuen mentre la pàgina és oberta). Cada una porta el seu setId.
const versionsEnMemoria = [];

// ---------- Registre d'expansions (sets) ----------

// Llista d'expansions llegida de data/sets.json (cache del mòdul)
let setsEnMemoria = null;

// Llegeix el registre d'expansions (un cop; després es reutilitza)
export async function carregarSets() {
  if (setsEnMemoria) return setsEnMemoria;
  const resposta = await fetch("data/sets.json");
  if (!resposta.ok) {
    throw new Error("No s'ha pogut llegir data/sets.json");
  }
  const dades = await resposta.json();
  setsEnMemoria = Array.isArray(dades?.sets) ? dades.sets : [];
  return setsEnMemoria;
}

// Expansió activa desada al navegador. Un valor desconegut (o cap)
// cau a l'expansió per defecte. Cal haver cridat carregarSets() abans
// perquè la validació tingui la llista contra la qual comparar.
export function setActiu() {
  try {
    const desat = magatzem()?.getItem(CLAU_SET_ACTIU);
    const conegut = setsEnMemoria?.some((conjunt) => conjunt.id === desat);
    return conegut ? desat : SET_DEFECTE;
  } catch {
    return SET_DEFECTE;
  }
}

// L'id d'expansió desat al navegador, sense validar contra sets.json
// (per aplicar el tema de colors abans del primer pintat, sense esperar
// cap fetch; temaDe ja cau al tema per defecte amb ids desconeguts)
export function setActiuDesat() {
  try {
    return magatzem()?.getItem(CLAU_SET_ACTIU) ?? SET_DEFECTE;
  } catch {
    return SET_DEFECTE;
  }
}

// Canvia l'expansió activa (validant-la) i retorna l'id que ha quedat actiu
export function canviarSetActiu(setId) {
  const conegut = setsEnMemoria?.some((conjunt) => conjunt.id === setId);
  const efectiu = conegut ? setId : SET_DEFECTE;
  try {
    magatzem()?.setItem(CLAU_SET_ACTIU, efectiu);
  } catch {
    // Sense espai: el canvi val igualment, només no es recordarà
  }
  return efectiu;
}

// ---------- Llista de versions ----------

// Abans de tenir més d'una expansió, les versions de navegador es desaven
// totes sota una sola clau. Aquesta migració (un cop per càrrega de pàgina)
// trasllada la clau antiga a la clau per expansió de sv6pt5, perquè els
// usuaris que ja tenien versions desades no les perdin.
let migracioFeta = false;
function migrarClauAntiga() {
  if (migracioFeta) return;
  migracioFeta = true;
  try {
    const emmagatzematge = magatzem();
    if (!emmagatzematge) return;
    const antic = emmagatzematge.getItem(CLAU_VERSIONS);
    if (antic === null) return;
    const clauNova = CLAU_VERSIONS + ":" + SET_DEFECTE;
    // Si la clau nova ja existeix, no la sobreescrivim: només netegem l'antiga
    if (emmagatzematge.getItem(clauNova) === null) {
      emmagatzematge.setItem(clauNova, antic);
    }
    // Només s'esborra l'antiga si el trasllat no ha fallat (setItem no ha llançat)
    emmagatzematge.removeItem(CLAU_VERSIONS);
  } catch {
    // Si el trasllat falla (p. ex. sense espai), la clau antiga es conserva:
    // no es perd res i es tornarà a provar a la propera càrrega
  }
}

// Llegeix les versions desades al navegador per a una expansió.
// Cada una: {id, fetchedAt, cardCount, dades}
function llegirVersionsLocals(setId) {
  migrarClauAntiga();
  try {
    // Sense magatzem (galetes bloquejades) no hi ha versions desades
    const desat = JSON.parse(magatzem()?.getItem(CLAU_VERSIONS + ":" + setId));
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

// Fusiona les versions de fitxer i les del navegador d'una expansió,
// de més nova a més vella
export async function carregarLlistaVersions(setId) {
  const resposta = await fetch(`data/versions/${setId}/index.json`);
  if (!resposta.ok) {
    throw new Error(`No s'ha pogut llegir data/versions/${setId}/index.json`);
  }
  const index = await resposta.json();

  const deFitxer = index.versions.map((v) => ({
    id: v.id,
    fetchedAt: v.fetchedAt,
    cardCount: v.cardCount,
    file: v.file,
    origen: "fitxer",
  }));
  const enMemoria = versionsEnMemoria.filter((v) => v.setId === setId);
  const deNavegador = [...llegirVersionsLocals(setId), ...enMemoria].map((v) => ({
    id: v.id,
    fetchedAt: v.fetchedAt,
    cardCount: v.cardCount,
    setId, // per saber a quina expansió buscar les dades en carregar-la
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
    const enMemoria = versionsEnMemoria.filter((v) => v.setId === entrada.setId);
    const totes = [...enMemoria, ...llegirVersionsLocals(entrada.setId)];
    dades = totes.find((v) => v.id === entrada.id)?.dades;
    if (!dades) {
      throw new Error("No s'ha trobat la versió " + entrada.id + " al navegador");
    }
  }
  // Cada carta recorda de quin dia són les seves dades: el sistema de
  // preus (variants.js) ho necessita per saber si un preu és massa vell
  for (const carta of dades.cards) carta.dataDades = dades.fetchedAt;
  // Cartes sempre ordenades pel número de col·lecció (l'ordre de l'àlbum);
  // la comparació numèrica de textos tolera números com "TG01"
  dades.cards.sort((a, b) =>
    String(a.number).localeCompare(String(b.number), undefined, { numeric: true })
  );
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

// Error de l'actualització amb el motiu en paraules de la web, perquè
// main.js pugui explicar a l'usuari què ha passat:
//  "senseXarxa" (no hi ha connexió), "temps" (el servidor no contesta a
//  temps), "limit" (massa peticions seguides), "servidor" (l'API ha caigut),
//  "tcgdex" (la segona font de preus no respon) o "permanent" (altres).
function errorActualitzacio(motiu, detall) {
  const error = new Error(detall || motiu);
  error.motiu = motiu;
  return error;
}

// Espera abans del reintent número `intent`: 2, 4, 8 s... amb una mica
// d'atzar perquè dos navegadors no tornin a picar alhora. Si l'API diu
// quant cal esperar (capçalera Retry-After, amb els 429), se li fa cas
// fins a un màxim de 30 s.
function esperaReintent(intent, retryAfter) {
  const segons = Number(retryAfter);
  if (Number.isFinite(segons) && segons > 0) return Math.min(segons, 30) * 1000;
  return 2000 * 2 ** (intent - 1) + Math.random() * 500;
}

// Petició a l'API amb temps màxim i reintents (l'API cau sovint i, sense
// clau, té un límit de peticions per minut). Només es reintenten els errors
// transitoris: caigudes de xarxa, temps esgotat, 429 (massa peticions) i
// 5xx (servidor). Els altres 4xx (adreça inexistent...) són permanents:
// reintentar només faria esperar l'usuari per res.
//  - tempsMax: mil·lisegons que s'espera cada intent abans de donar-lo per
//    perdut (60 s, com tools/fetch_data.py: una pàgina de 250 cartes pot trigar)
//  - enReintent(intent, max): avís opcional abans de cada reintent; quan
//    després d'algun reintent la petició surt bé, avisa amb enReintent(null)
//    perquè la web torni a dir "actualitzant" i no es quedi el "reintentant"
async function peticioApi(url, clauApi, { intents = MAX_REINTENTS, tempsMax = 60000, enReintent } = {}) {
  for (let intent = 1; intent <= intents; intent++) {
    // Sense connexió no té sentit esperar: es diu de seguida
    if (navigator.onLine === false) throw errorActualitzacio("senseXarxa");
    const control = new AbortController();
    const rellotge = setTimeout(() => control.abort(), tempsMax);
    let error;
    let retryAfter = null;
    try {
      const opcions = { signal: control.signal };
      if (clauApi) opcions.headers = { "X-Api-Key": clauApi };
      const resposta = await fetch(url, opcions);
      if (resposta.ok) {
        const dades = await resposta.json();
        if (intent > 1) enReintent?.(null);
        return dades;
      }
      retryAfter = resposta.headers.get("Retry-After");
      if (resposta.status === 429) error = errorActualitzacio("limit", "HTTP 429");
      else if (resposta.status >= 500) error = errorActualitzacio("servidor", "HTTP " + resposta.status);
      else {
        const permanent = errorActualitzacio("permanent", "HTTP " + resposta.status);
        permanent.estat = resposta.status; // per distingir un 404 (no hi és) d'un bloqueig
        throw permanent;
      }
    } catch (problema) {
      if (problema.motiu === "permanent") throw problema;
      if (problema.name === "AbortError") error = errorActualitzacio("temps");
      // Un fetch que peta sense resposta: o no hi ha xarxa o el servidor
      // ha caigut sense contestar (els errors 502 de l'API sovint arriben
      // així, sense permisos CORS, i el navegador no en veu ni el codi)
      else if (!problema.motiu) {
        error = errorActualitzacio(navigator.onLine === false ? "senseXarxa" : "servidor", String(problema));
      } else error = problema;
    } finally {
      clearTimeout(rellotge);
    }
    if (intent === intents || error.motiu === "senseXarxa") throw error;
    enReintent?.(intent, intents - 1);
    await esperar(esperaReintent(intent, retryAfter));
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

// Baixa totes les cartes d'un set, pàgina a pàgina
async function baixarCartes(setId, clauApi, enReintent) {
  const cartes = [];
  let pagina = 1;
  while (true) {
    const url = `${API_BASE}/cards?q=set.id:${setId}&pageSize=250&page=${pagina}`;
    const resposta = await peticioApi(url, clauApi, { enReintent });
    cartes.push(...resposta.data.map(retallarCarta));
    if (cartes.length >= resposta.totalCount || resposta.data.length === 0) break;
    pagina++;
  }
  // Una resposta sense cap carta és una API que no va bé, no una expansió
  // buida: millor no crear una versió nova que deixaria la web en blanc
  if (cartes.length === 0) throw errorActualitzacio("servidor", "cap carta");
  cartes.sort((a, b) =>
    String(a.number).localeCompare(String(b.number), undefined, { numeric: true })
  );
  return cartes;
}

// Nom en minúscules i només amb lletres i xifres, per comparar les dues fonts
function normalitzarNom(nom) {
  return String(nom).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Es queda amb el que la web fa servir de TCGdex: quines variants existeixen
// i els preus de cadascuna (el mateix retall que a tools/fetch_data.py)
function retallarTcgdex(dades) {
  const detall = (dades.variants_detailed ?? []).map((variant) => {
    const entrada = { type: variant.type };
    if (variant.foil) entrada.foil = variant.foil;
    if (variant.stamp?.length) entrada.stamp = variant.stamp;
    if (variant.pricing) entrada.pricing = variant.pricing;
    return entrada;
  });
  // A alguns sets (p. ex. sv01) TCGdex posa els preus a la carta sencera i
  // no a cada variant: es copien a les variants sense segell (com fa
  // tools/fetch_data.py), i variants.js ja reparteix el bloc compartit
  if (dades.pricing && !detall.some((e) => e.pricing)) {
    for (const entrada of detall) {
      if (!entrada.stamp?.length) entrada.pricing = dades.pricing;
    }
  }
  return { variants: dades.variants, variants_detailed: detall };
}

// Afegeix a cada carta el bloc "tcgdex" (variants i preus de TCGdex).
// Si TCGdex no coneix una carta, o falla en alguna de soltes, aquella carta
// es queda sense bloc i el sistema de preus fa servir les altres fonts.
// Però si TCGdex falla per a la majoria de cartes (ha caigut), la versió
// nova tindria pitjors preus que la que ja tenim: llavors s'atura tot
// amb el motiu "tcgdex" i l'usuari es queda amb les dades d'abans.
async function afegirPreusTcgdex(setId, cartes) {
  const tcgdexId = setsEnMemoria?.find((conjunt) => conjunt.id === setId)?.tcgdexId;
  if (!tcgdexId) return;
  let seguent = 0;
  let encerts = 0;
  let fallades = 0;
  let absents = 0; // cartes que TCGdex diu que no té (404)
  let senseXarxa = false;
  // Massa fallades: més de la meitat, o 16 sense cap encert. També si
  // TCGdex no té cap de les cartes (l'id del set deu haver canviat).
  const massaFallades = () =>
    fallades > cartes.length / 2 ||
    (fallades >= 16 && encerts === 0) ||
    (absents > cartes.length / 2 && encerts === 0);
  async function treballar() {
    while (seguent < cartes.length && !massaFallades() && !senseXarxa) {
      const carta = cartes[seguent++];
      const numero = String(carta.number);
      const local = /^\d+$/.test(numero) ? numero.padStart(3, "0") : numero;
      try {
        const url = `${TCGDEX_BASE}/cards/${encodeURIComponent(tcgdexId + "-" + local)}`;
        const dades = await peticioApi(url, null, { intents: 3, tempsMax: 15000 });
        encerts += 1;
        // Comprovació de seguretat: és la mateixa carta a les dues fonts?
        if (normalitzarNom(dades.name) === normalitzarNom(carta.name)) {
          carta.tcgdex = retallarTcgdex(dades);
        }
      } catch (error) {
        // Una carta que TCGdex no té (404) no és cap fallada: es queda
        // amb les altres fonts. La resta (servidor caigut, bloqueig...) sí.
        if (error.motiu === "senseXarxa") senseXarxa = true;
        else if (error.estat === 404) absents += 1;
        else fallades += 1;
      }
    }
  }
  await Promise.all(Array.from({ length: TCGDEX_SIMULTANIES }, treballar));
  // Si s'ha tallat la connexió a mitges, el motiu és aquest, no TCGdex
  if (senseXarxa) throw errorActualitzacio("senseXarxa");
  if (massaFallades()) throw errorActualitzacio("tcgdex");
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

// Desa una versió nova al navegador (a la clau de la seva expansió).
// Retorna false si no hi cap (localStorage té un límit d'uns 5 MB).
function desarVersioLocal(setId, entrada) {
  const versions = llegirVersionsLocals(setId);
  versions.push(entrada);
  const emmagatzematge = magatzem();
  if (!emmagatzematge) return false; // sense magatzem no es pot desar
  try {
    emmagatzematge.setItem(CLAU_VERSIONS + ":" + setId, JSON.stringify({ versions }));
    return true;
  } catch {
    return false;
  }
}

// Baixa les dades fresques d'una expansió de l'API i crea una versió nova
// amb la data d'ara. Retorna { id, desada }: desada és false si no ha
// cabut al localStorage. Si falla, llança un error amb `motiu` (vegeu
// errorActualitzacio) i no es desa res: les dades d'abans no es toquen.
// enReintent(intent, max) avisa cada cop que l'API falla i es torna a provar.
export async function actualitzarDades(setId, enReintent) {
  const clauApi = await llegirClauApi();
  const conjunt = (await peticioApi(`${API_BASE}/sets/${setId}`, clauApi, { enReintent })).data;
  const cartes = await baixarCartes(setId, clauApi, enReintent);
  await afegirPreusTcgdex(setId, cartes);

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
      source: "pokemontcg.io + tcgdex.net",
      set: conjunt,
      cards: cartes,
    },
  };

  const desada = desarVersioLocal(setId, entrada);
  if (!desada) {
    // Almenys es podrà consultar avui; el setId diu de quina expansió és
    versionsEnMemoria.push({ ...entrada, setId });
  }
  return { id: entrada.id, desada };
}
