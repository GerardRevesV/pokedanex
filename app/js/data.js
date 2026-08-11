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

// Baixa totes les cartes d'un set, pàgina a pàgina
async function baixarCartes(setId, clauApi) {
  const cartes = [];
  let pagina = 1;
  while (true) {
    const url = `${API_BASE}/cards?q=set.id:${setId}&pageSize=250&page=${pagina}`;
    const resposta = await peticioApi(url, clauApi);
    cartes.push(...resposta.data.map(retallarCarta));
    if (cartes.length >= resposta.totalCount || resposta.data.length === 0) break;
    pagina++;
  }
  cartes.sort((a, b) =>
    String(a.number).localeCompare(String(b.number), undefined, { numeric: true })
  );
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
// cabut al localStorage.
export async function actualitzarDades(setId) {
  const clauApi = await llegirClauApi();
  const conjunt = (await peticioApi(`${API_BASE}/sets/${setId}`, clauApi)).data;
  const cartes = await baixarCartes(setId, clauApi);

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

  const desada = desarVersioLocal(setId, entrada);
  if (!desada) {
    // Almenys es podrà consultar avui; el setId diu de quina expansió és
    versionsEnMemoria.push({ ...entrada, setId });
  }
  return { id: entrada.id, desada };
}
