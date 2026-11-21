// cerca-global.js — la secció «A altres expansions», sota la graella.
//
// El cercador de dalt busca dins l'expansió oberta. A l'enquesta, dues
// persones buscaven una carta (el Pikachu) sense saber de quina expansió
// era. Aquesta secció repeteix la mateixa cerca a TOTES les altres
// expansions i, en clicar una carta, obre aquella expansió amb la carta
// localitzada.
//
// Pes: les dades de les altres expansions NO es baixen en obrir la web.
// Es baixen un sol cop, la primera vegada que l'usuari escriu una cerca
// de 3 lletres o més (uns 0,7 MB comprimits per a 14 expansions), i
// després es reaprofiten. De cada carta només ens quedem el que cal per
// a la llista (id, nom, número, imatge).

import { t } from "./i18n.js";
import { carregarSets, carregarLlistaVersions, carregarVersio } from "./data.js";
import { prepararConsulta, puntuar } from "./cerca.js";

const LLETRES_MINIMES = 3; // amb menys, la llista seria massa llarga
const MAXIM_RESULTATS = 40; // a partir d'aquí, millor afinar la cerca

// { setId: [cartes lleugeres] }, quan ja s'han baixat; null abans
let index = null;
let carregant = false; // la baixada ja ha començat (no la repetim)
let ambErrors = false; // alguna expansió no s'ha pogut llegir
let darrerIntent = 0; // quan es va provar de baixar (per reintentar sense insistir)
const ESPERA_REINTENT = 10000; // ms entre reintents de les expansions que han fallat
let ultimaCerca = { text: "", setActiu: "" }; // per repintar en acabar la baixada
let referencies = null; // { enTriar(setId, cardId) } que passa main.js

const element = (id) => document.getElementById(id);

// Baixa la versió més nova de cada expansió que encara no tinguem (totes
// alhora). Si una falla, les altres continuen: aquella expansió no surt a
// la cerca, i es torna a provar en una cerca posterior (p. ex. si s'havia
// perdut la connexió un moment).
async function baixarIndex() {
  carregant = true;
  darrerIntent = Date.now();
  const sets = await carregarSets();
  const resultat = { ...index };
  let fallades = false;
  await Promise.all(sets.filter((conjunt) => !resultat[conjunt.id]).map(async (conjunt) => {
    try {
      const versions = await carregarLlistaVersions(conjunt.id);
      if (versions.length === 0) return;
      const dades = await carregarVersio(versions[0]);
      resultat[conjunt.id] = dades.cards.map((carta) => ({
        id: carta.id,
        name: carta.name,
        number: String(carta.number),
        imatge: carta.images?.small ?? "",
      }));
    } catch {
      fallades = true;
    }
  }));
  ambErrors = fallades;
  index = resultat;
  carregant = false;
  pintar();
}

// Les coincidències de totes les expansions menys l'oberta, de la millor
// a la pitjor; a igualtat, primer les expansions més noves
function buscar(consulta, setActiu, sets) {
  const trobades = [];
  for (const conjunt of sets) {
    if (conjunt.id === setActiu || !index[conjunt.id]) continue;
    for (const carta of index[conjunt.id]) {
      const nivell = puntuar(carta.name, consulta);
      if (nivell !== null) trobades.push({ carta, conjunt, nivell });
    }
  }
  return trobades.sort((a, b) =>
    a.nivell - b.nivell ||
    String(b.conjunt.releaseDate).localeCompare(String(a.conjunt.releaseDate)) ||
    a.carta.number.localeCompare(b.carta.number, undefined, { numeric: true }));
}

// Una carta de la llista: un botó amb la imatge petita, el nom i de quina
// expansió és. En clicar-lo, main.js obre l'expansió i hi localitza la carta.
function crearResultat({ carta, conjunt }) {
  const boto = document.createElement("button");
  boto.type = "button";
  boto.className = "global-carta";
  boto.title = t("global.anar", { set: conjunt.name });
  const imatge = document.createElement("img");
  imatge.loading = "lazy";
  imatge.decoding = "async";
  imatge.src = carta.imatge;
  imatge.alt = "";
  const nom = document.createElement("b");
  nom.textContent = carta.name;
  const detall = document.createElement("small");
  detall.textContent = `${conjunt.name} · ${carta.number}`;
  boto.append(imatge, nom, detall);
  boto.addEventListener("click", () => referencies.enTriar(conjunt.id, carta.id));
  return boto;
}

function pintar() {
  const seccio = element("cerca-global");
  const { text, setActiu } = ultimaCerca;
  const consulta = prepararConsulta(text);
  // Ni amb cerques curtes ni amb només xifres: el número de carta
  // només té sentit dins d'una expansió (la 25 n'hi ha a totes)
  if (!consulta || consulta.junt.length < LLETRES_MINIMES || /^\d+$/.test(consulta.junt)) {
    seccio.hidden = true;
    return;
  }
  seccio.hidden = false;
  const estat = element("cerca-global-estat");
  const llista = element("cerca-global-llista");

  if (!index) {
    estat.textContent = t("global.carregant");
    llista.replaceChildren();
    if (!carregant) {
      baixarIndex().catch(() => {
        carregant = false;
        estat.textContent = t("global.error");
      });
    }
    return;
  }

  // Si alguna expansió havia fallat, es torna a provar (sense insistir a
  // cada tecla); mentrestant es mostra el que ja tenim
  if (ambErrors && !carregant && Date.now() - darrerIntent > ESPERA_REINTENT) {
    baixarIndex().catch(() => { carregant = false; });
  }

  // carregarSets ja està en memòria (l'ha llegit main.js en arrencar)
  carregarSets().then((sets) => {
    // Si mentre tant s'ha escrit una altra cerca, ja la pintarà la seva crida
    if (ultimaCerca.text !== text || ultimaCerca.setActiu !== setActiu) return;
    const trobades = buscar(consulta, setActiu, sets);
    const textos = [];
    if (trobades.length === 0) textos.push(t("global.cap"));
    if (trobades.length > MAXIM_RESULTATS) {
      textos.push(t("global.mes", { n: trobades.length - MAXIM_RESULTATS }));
    }
    if (ambErrors) textos.push(t("global.incomplet"));
    estat.textContent = textos.join(" ");
    estat.hidden = textos.length === 0;
    const fragment = document.createDocumentFragment();
    for (const trobada of trobades.slice(0, MAXIM_RESULTATS)) {
      fragment.append(crearResultat(trobada));
    }
    llista.replaceChildren(fragment);
  });
}

// La crida main.js cada cop que es repinta la graella (cerca, canvi
// d'expansió, d'idioma...): amb la cerca buida, la secció s'amaga
export function refrescarCercaGlobal(text, setActiu) {
  ultimaCerca = { text: String(text ?? "").trim(), setActiu };
  if (!referencies) return;
  element("cerca-global-estat").hidden = false;
  pintar();
}

export function iniciarCercaGlobal({ enTriar }) {
  referencies = { enTriar };
}
