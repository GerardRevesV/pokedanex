// main.js — la interfície: pinta la graella, el cercador i lliga els mòduls.

import { t, idiomaActual, canviarIdioma, aplicarTextos } from "./i18n.js";
import {
  carregarSets, setActiu, setActiuDesat, canviarSetActiu,
  carregarLlistaVersions, carregarVersio, actualitzarDades,
} from "./data.js";
import { variantsDisponibles, preuVariant, motiuPreuAproximat } from "./variants.js";
import { iniciarHolo, aplicarHolo } from "./holo.js";
import {
  comptadors, ajustar, enTeCap, subscriure, totals,
  exportarJson, importarJson, buidar,
} from "./collection.js";
import {
  iniciarAlbum, carregarAlbum, mostrarAlbum, refrescarAlbum, actualitzarButxaques,
  ressaltarAlbum, situarAlbumACarta, cartaVisibleAlbum,
} from "./album.js";
import { iniciarSelectorExpansions } from "./selector-expansions.js";
import { aplicarTema, aplicarModeColor } from "./temes.js";
import { iniciarEstadistiques, carregarEstadistiques, refrescarEstadistiques } from "./stats.js";
import { magatzem } from "./storage.js";
import { prepararConsulta, puntuar } from "./cerca.js";
import { iniciarCercaGlobal, refrescarCercaGlobal } from "./cerca-global.js";

// Estat de la pàgina
let versions = [];       // llista d'entrades per al selector de versions
let versioActiva = null; // dades completes de la versió que es mostra
let missatgeActual = null; // {clau, esError} del missatge visible, per retraduir-lo
let peticioVersio = 0;   // comptador per descartar càrregues de versió que arriben tard
let peticioLlista = 0;   // el mateix, per a les càrregues de llistes de versions
let filtreColleccio = "totes"; // filtre actiu: "totes" | "tinc" | "falten"
let vistaActiva = "graella";   // vista oberta: "graella" | "album"

// Filtres desplegables actius ("" vol dir "tots")
let filtreRaresa = "";
let filtreTipus = "";
let filtreCategoria = "";

// Criteri d'ordenació de la graella (no es desa: en recarregar torna al defecte)
let ordreGraella = "numero";

const CLAU_VISTA = "pokedanex.view"; // la vista triada es recorda al navegador
const CLAU_VISUAL = "pokedanex.displayMode"; // el mode de visualització també
const CLAU_MODE_COLOR = "pokedanex.colorScheme"; // tema clar o fosc (index.html també la llegeix)

// Pantalla tàctil (dit en lloc de ratolí): alguns comportaments canvien
// una mica, sempre de manera additiva (l'escriptori no perd res)
const esTactil = window.matchMedia("(pointer: coarse)");

const element = (id) => document.getElementById(id);

// ---------- Missatges d'estat ----------

// En tàctil el missatge flota fix a baix de la pantalla: els avisos
// puntuals s'amaguen sols al cap d'un moment (a escriptori el missatge
// és un bloc estàtic de dalt i no tapa res: es queda com sempre)
const CLAUS_MISSATGE_PUNTUAL = new Set([
  "actualitza.fet", "actualitza.senseEspai",
  "colleccio.importada", "colleccio.importError", "colleccio.senseEspai",
]);
let temporitzadorMissatge = null;

// Rep la clau de traducció (no el text) per poder retraduir el missatge
// si l'usuari canvia d'idioma mentre encara és visible. "parametres" són
// els valors que la traducció insereix (ex. {variant}), si en té.
function mostrarMissatge(clau, esError = false, parametres = undefined) {
  missatgeActual = { clau, esError, parametres };
  const missatge = element("missatge");
  missatge.textContent = t(clau, parametres);
  missatge.classList.toggle("missatge--error", esError);
  missatge.hidden = false;
  // El temporitzador anterior no ha d'amagar un missatge nou
  clearTimeout(temporitzadorMissatge);
  if (esTactil.matches && CLAUS_MISSATGE_PUNTUAL.has(clau)) {
    temporitzadorMissatge = setTimeout(() => {
      if (missatgeActual?.clau === clau) amagarMissatge();
    }, 4000);
  }
}

function amagarMissatge() {
  missatgeActual = null;
  element("missatge").hidden = true;
}

// ---------- Formats de data ----------

function formatarDataHora(iso) {
  return new Date(iso).toLocaleString(idiomaActual(), {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function etiquetaVersio(entrada) {
  const data = new Date(entrada.fetchedAt);
  if (entrada.origen === "fitxer") {
    return data.toLocaleDateString(idiomaActual(), { dateStyle: "medium" });
  }
  // Versió creada des del navegador: hi afegim l'hora i una marca
  const text = data.toLocaleString(idiomaActual(), { dateStyle: "medium", timeStyle: "short" });
  return `${text} (${t("versio.navegador")})`;
}

// ---------- Selector de versions ----------

function omplirSelectorVersions(idSeleccionada) {
  const selector = element("selector-versio");
  selector.innerHTML = "";
  for (const entrada of versions) {
    const opcio = document.createElement("option");
    opcio.value = entrada.id;
    opcio.textContent = etiquetaVersio(entrada);
    selector.append(opcio);
  }
  if (idSeleccionada) selector.value = idSeleccionada;
}

// Carrega i pinta una versió. Retorna true si s'ha pogut mostrar.
async function triarVersio(entrada) {
  const peticio = ++peticioVersio;
  mostrarMissatge("graella.carregant");
  try {
    const dades = await carregarVersio(entrada);
    // Si mentre esperàvem l'usuari ha triat una altra versió, descartem aquesta
    if (peticio !== peticioVersio) return false;
    versioActiva = dades;
    tancarZoom(); // la carta del zoom pot no existir a la versió nova
    amagarMissatge();
    pintarLogotips();
    construirFiltresDesplegables(); // les opcions surten de les dades noves
    actualitzarOpcioArtista(); // pot canviar l'ordre actiu: abans de pintar
    pintarGraella();
    pintarPeu();
    pintarBarraColleccio();
    carregarAlbum(dades); // l'àlbum també canvia de versió de dades
    refrescarRessaltatAlbum(); // amb cartes noves, les coincidències canvien
    carregarEstadistiques(dades); // i el panell d'estadístiques es recalcula
    return true;
  } catch {
    if (peticio === peticioVersio) mostrarMissatge("graella.error", true);
    return false;
  }
}

// ---------- Pintar la pàgina ----------

// Logotip del set a la capçalera i símbol al peu (URLs dins les dades del set)
function pintarLogotips() {
  const imatges = versioActiva.set.images ?? {};
  const logo = element("logo-set");
  const simbol = element("simbol-set");
  if (imatges.logo) {
    logo.src = imatges.logo;
    logo.alt = versioActiva.set.name;
    logo.hidden = false;
  }
  if (imatges.symbol) {
    simbol.src = imatges.symbol;
    simbol.alt = "";
    simbol.hidden = false;
  }
}

// Número de col·lecció amb el format dels àlbums: 033/064
function formatarNumero(carta) {
  const total = String(versioActiva.set.printedTotal).padStart(3, "0");
  return `${carta.number.padStart(3, "0")}/${total}`;
}

// Preu orientatiu d'una carta i, si porta la marca "≈", el motiu
// ("aproximat", "antic" o "dubtos"; null si no en porta), triats
// d'una sola passada: el de la primera variant de la carta amb preu
// conegut (normal, holo, reverse); preu null si cap en té. La graella
// ho fa servir per no repetir la tria de variant a cada fitxa (el
// repintat és sensible en mòbil).
// Les variants que la carta té de debò, en l'ordre en què donen el preu
// orientatiu: primer la versió base (la normal o, si no n'hi ha, l'holo)
// i al final el reverse. Demanar el preu d'una variant inexistent podria
// tornar el d'una font antiga que no distingeix variants.
function variantsPerPreu(carta) {
  const disponibles = variantsDisponibles(carta);
  return ["normal", "holo", "reverse"].filter((v) => disponibles.includes(v));
}

function infoPreuCarta(carta) {
  for (const variant of variantsPerPreu(carta)) {
    const preu = preuVariant(carta, variant);
    if (preu !== null) {
      return { preu, motiu: motiuPreuAproximat(carta, variant) };
    }
  }
  return { preu: null, motiu: null };
}

// La clau de text que explica cada motiu del "≈"
const TEXT_MOTIU_PREU = {
  aproximat: "carta.preuAproximat",
  antic: "carta.preuAntic",
  dubtos: "carta.preuDubtos",
};

// Només el preu (per ordenar per preu sense calcular la marca "≈")
function preuCarta(carta) {
  for (const variant of variantsPerPreu(carta)) {
    const preu = preuVariant(carta, variant);
    if (preu !== null) return preu;
  }
  return null;
}

// Escriu un preu en euros amb el format de l'idioma actiu (ex. "1,23 €").
// El formatador es construeix UN cop i es reutilitza (crear-ne un per
// carta a cada repintat costava desenes de ms en un mòbil modest);
// només es refà si l'idioma canvia.
let formatadorPreu = null;
let idiomaFormatador = null;
function formatarPreu(valor) {
  if (idiomaFormatador !== idiomaActual()) {
    idiomaFormatador = idiomaActual();
    formatadorPreu = new Intl.NumberFormat(idiomaFormatador, {
      style: "currency",
      currency: "EUR",
    });
  }
  return formatadorPreu.format(valor);
}

// La cerca, ja preparada per a cerca.js: { text, aproximada }. El text
// en minúscules serveix per al número (que continua sent exacte) i la
// versió preparada per a la cerca per proximitat del nom
function consultaActual() {
  const text = element("cercador").value.trim().toLowerCase();
  return { text, aproximada: prepararConsulta(text) };
}

// Fins a quin punt una carta coincideix amb la cerca: 0 (exacta) a 4
// (aproximada, amb errors d'escriptura), o null si no hi coincideix.
// El número de carta no admet errors: «25» és la 25 (o la 125, 250...),
// mai la 24. Si la cerca són només xifres, el nom no es busca aproximat.
function rellevancia(carta, consulta) {
  if (!consulta.text) return 0;
  const numero = String(carta.number).toLowerCase();
  if (numero === consulta.text || numero.padStart(3, "0") === consulta.text) return 0;
  if (numero.includes(consulta.text) || numero.padStart(3, "0").includes(consulta.text)) return 1;
  if (/^\d+$/.test(consulta.text)) {
    return carta.name.toLowerCase().includes(consulta.text) ? 2 : null;
  }
  // Una cerca feta només de signes («!», «-») no busca res al nom
  if (!consulta.aproximada) return null;
  return puntuar(carta.name, consulta.aproximada);
}

// Una carta coincideix si la cerca apareix al nom (o s'hi assembla) o al número
function coincideix(carta, consulta) {
  return rellevancia(carta, consulta) !== null;
}

// Una carta passa el filtre de col·lecció segons si en tens alguna còpia
function passaFiltreColleccio(carta) {
  if (filtreColleccio === "tinc") return enTeCap(carta.id);
  if (filtreColleccio === "falten") return !enTeCap(carta.id);
  return true; // "totes"
}

// ---------- Filtres desplegables (raresa / tipus / categoria) ----------

// Ordre de valor de les rareses; una raresa desconeguda anirà al final.
// Els noms de raresa es mostren en anglès tal qual: és l'argot del col·leccionisme.
const ORDRE_RARESES = [
  "Common", "Uncommon", "Rare", "Double Rare", "ACE SPEC Rare",
  "Illustration Rare", "Ultra Rare", "Special Illustration Rare", "Hyper Rare",
];

// Ordre habitual dels tipus d'energia i de les categories de carta
const ORDRE_TIPUS = [
  "Grass", "Fire", "Water", "Lightning", "Psychic",
  "Fighting", "Darkness", "Metal", "Dragon", "Colorless",
];
const ORDRE_CATEGORIES = ["Pokémon", "Trainer", "Energy"];

// Comparador que segueix una llista d'ordre; els valors que no hi són
// van al final, ordenats alfabèticament entre ells
function ordenaSegons(ordre) {
  return (a, b) => {
    const posicioA = ordre.indexOf(a);
    const posicioB = ordre.indexOf(b);
    return (
      (posicioA === -1 ? ordre.length : posicioA) -
        (posicioB === -1 ? ordre.length : posicioB) ||
      a.localeCompare(b)
    );
  };
}

// Tradueix un nom de tipus o categoria; si no tenim la traducció,
// mostrem el nom anglès tal qual (mai una clau a mitges)
function traduirNomDada(prefix, nom) {
  const text = t(prefix + nom);
  return text === prefix + nom ? nom : text;
}

// Omple un desplegable amb l'opció "Tots" i les opcions donades,
// conservant la tria antiga si encara existeix. Retorna la tria activa.
function omplirDesplegable(select, opcions, triaAntiga) {
  select.innerHTML = "";
  const totes = document.createElement("option");
  totes.value = "";
  totes.textContent = t("filtre.tots");
  select.append(totes);
  for (const { valor, text } of opcions) {
    const opcio = document.createElement("option");
    opcio.value = valor;
    opcio.textContent = text;
    select.append(opcio);
  }
  const tria = opcions.some((opcio) => opcio.valor === triaAntiga) ? triaAntiga : "";
  select.value = tria;
  return tria;
}

// (Re)construeix els tres desplegables amb les dades de la versió activa.
// Es crida en canviar de versió (les opcions poden variar) i en canviar
// d'idioma (per retraduir "Tots" i els noms de tipus i categoria).
function construirFiltresDesplegables() {
  // Sense versió activa (la càrrega ha fallat), els desplegables
  // mostren igualment l'opció "Tots" en lloc de quedar buits
  const cartes = versioActiva?.cards ?? [];
  const rareses = new Set();
  const tipus = new Set();
  const categories = new Set();
  for (const carta of cartes) {
    if (carta.rarity) rareses.add(carta.rarity);
    for (const tipusEnergia of carta.types ?? []) tipus.add(tipusEnergia);
    if (carta.supertype) categories.add(carta.supertype);
  }
  filtreRaresa = omplirDesplegable(
    element("filtre-raresa"),
    [...rareses].sort(ordenaSegons(ORDRE_RARESES))
      .map((nom) => ({ valor: nom, text: nom })),
    filtreRaresa,
  );
  filtreTipus = omplirDesplegable(
    element("filtre-tipus"),
    [...tipus].sort(ordenaSegons(ORDRE_TIPUS))
      .map((nom) => ({ valor: nom, text: traduirNomDada("tipus.", nom) })),
    filtreTipus,
  );
  filtreCategoria = omplirDesplegable(
    element("filtre-categoria"),
    [...categories].sort(ordenaSegons(ORDRE_CATEGORIES))
      .map((nom) => ({ valor: nom, text: traduirNomDada("categoria.", nom) })),
    filtreCategoria,
  );
  actualitzarOpcionsPossibles(); // opcions noves: tornem a mirar què és possible
  pintarCompteFiltres();         // i el distintiu es retradueix amb l'idioma
}

// Una carta passa els tres desplegables alhora ("" sempre passa)
function passaFiltresDesplegables(carta) {
  if (filtreRaresa && carta.rarity !== filtreRaresa) return false;
  if (filtreTipus && !(carta.types ?? []).includes(filtreTipus)) return false;
  if (filtreCategoria && carta.supertype !== filtreCategoria) return false;
  return true;
}

// Torna els tres desplegables a "Tots" (per exemple, en anar a una carta concreta)
function netejarFiltresDesplegables() {
  filtreRaresa = "";
  filtreTipus = "";
  filtreCategoria = "";
  for (const id of ["filtre-raresa", "filtre-tipus", "filtre-categoria"]) {
    element(id).value = "";
  }
  actualitzarOpcionsPossibles(); // sense cap filtre, tot torna a ser possible
}

// Desactiva les opcions que, amb els altres dos desplegables tal com
// estan ara, no deixarien passar cap carta. Sense això, el 58% de les
// combinacions possibles dels tres filtres donava una graella buida
// (per exemple, qualsevol tipus d'energia amb la categoria "Entrenador",
// perquè els entrenadors no tenen tipus). El valor ja triat i l'opció
// "Tots" no es desactiven mai: el desplegable sempre ha de poder tornar
// enrere.
function actualitzarOpcionsPossibles() {
  const possibles = { raresa: new Set(), tipus: new Set(), categoria: new Set() };
  for (const carta of versioActiva?.cards ?? []) {
    const passaRaresa = !filtreRaresa || carta.rarity === filtreRaresa;
    const passaTipus = !filtreTipus || (carta.types ?? []).includes(filtreTipus);
    const passaCategoria = !filtreCategoria || carta.supertype === filtreCategoria;
    if (passaTipus && passaCategoria && carta.rarity) {
      possibles.raresa.add(carta.rarity);
    }
    if (passaRaresa && passaCategoria) {
      for (const tipus of carta.types ?? []) possibles.tipus.add(tipus);
    }
    if (passaRaresa && passaTipus && carta.supertype) {
      possibles.categoria.add(carta.supertype);
    }
  }
  for (const [id, valors] of [
    ["filtre-raresa", possibles.raresa],
    ["filtre-tipus", possibles.tipus],
    ["filtre-categoria", possibles.categoria],
  ]) {
    for (const opcio of element(id).querySelectorAll("option")) {
      opcio.disabled = opcio.value !== "" && !opcio.selected && !valors.has(opcio.value);
    }
  }
}

// ---------- La cerca i els filtres, en un sol lloc ----------

// El sedàs complet ("passa la cerca i tots els filtres actius"), amb la
// consulta calculada un sol cop. El fan servir els DOS camins que pinten
// cartes: la graella i el ressaltat de l'àlbum (D-011).
function predicatActual() {
  const consulta = consultaActual();
  return (carta) =>
    coincideix(carta, consulta) &&
    passaFiltreColleccio(carta) &&
    passaFiltresDesplegables(carta);
}

// Hi ha alguna cerca o algun filtre actiu ara mateix?
function hiHaFiltreActiu() {
  return (
    element("cercador").value.trim() !== "" ||
    filtreColleccio !== "totes" ||
    filtreRaresa !== "" ||
    filtreTipus !== "" ||
    filtreCategoria !== ""
  );
}

// A l'àlbum els filtres no treuen butxaques: ressalten. Sense cap filtre
// actiu es passa null i l'àlbum torna a l'aspecte de sempre.
function refrescarRessaltatAlbum() {
  ressaltarAlbum(hiHaFiltreActiu() ? predicatActual() : null);
}

// Qualsevol canvi de cerca o de filtre ha de passar per aquí: abans
// només es repintava la graella i els controls no feien res a l'àlbum
function aplicarFiltres() {
  pintarGraella();
  refrescarRessaltatAlbum();
  pintarCompteFiltres();
}

// Els criteris actius en text llegible ("la cerca «pika»", "Raresa: Rare"),
// per poder dir al missatge de graella buida qui ha deixat fora les cartes
function criterisActius() {
  const criteris = [];
  const consulta = element("cercador").value.trim();
  if (consulta) criteris.push(t("graella.criteriCerca", { text: consulta }));
  if (filtreColleccio !== "totes") criteris.push(t("filtre." + filtreColleccio));
  if (filtreRaresa) criteris.push(`${t("filtre.raresa")}: ${filtreRaresa}`);
  if (filtreTipus) {
    criteris.push(`${t("filtre.tipus")}: ${traduirNomDada("tipus.", filtreTipus)}`);
  }
  if (filtreCategoria) {
    criteris.push(`${t("filtre.categoria")}: ${traduirNomDada("categoria.", filtreCategoria)}`);
  }
  return criteris;
}

// Deixa la cerca i tots els filtres a zero, sense repintar res
function netejarCercaIFiltres() {
  element("cercador").value = "";
  triarFiltreColleccio("totes");
  netejarFiltresDesplegables();
}

// Treu la cerca i tots els filtres d'un cop (botó «Treu tots els
// filtres» del bloc de filtres i del missatge de graella buida). L'ordre
// i la vista no són filtres: es queden com estan. En buidar el cercador,
// la secció «A altres expansions» també s'amaga (es refà amb la graella).
function treureElsFiltres() {
  netejarCercaIFiltres();
  aplicarFiltres();
}

// Quants filtres hi ha actius. La cerca no hi compta: el cercador es
// veu sempre. Al mòbil, en canvi, la resta de controls van plegats
// darrere "Filtres i opcions", i sense aquest distintiu es podien tenir
// filtres actius -i mitja expansió sense sortir- sense cap pista a la vista.
function pintarCompteFiltres() {
  const actius = [
    filtreColleccio !== "totes",
    filtreRaresa !== "",
    filtreTipus !== "",
    filtreCategoria !== "",
  ].filter(Boolean).length;
  const distintiu = element("filtres-compte");
  distintiu.hidden = actius === 0;
  distintiu.textContent = actius;
  distintiu.title = t("filtres.actius", { n: actius });
  // El botó «Treu tots els filtres» només surt si hi ha res a treure
  // (aquí sí que compta la cerca: també la buida)
  element("boto-treure-filtres").hidden = !hiHaFiltreActiu();
}

// El missatge de graella buida: diu quins criteris no han deixat passar
// cap carta (abans deia sempre "la cerca", encara que la culpa fos d'un
// desplegable) i ofereix treure'ls tots
function crearGraellaBuida() {
  const bloc = document.createElement("div");
  bloc.className = "graella-buida";
  const criteris = criterisActius();
  const text = document.createElement("p");
  text.textContent = criteris.length === 0
    ? t("graella.buida")
    : t("graella.buidaAmb", { criteris: criteris.join(" · ") });
  bloc.append(text);
  if (criteris.length > 0) {
    const boto = document.createElement("button");
    boto.type = "button";
    boto.className = "boto-suau";
    boto.textContent = t("graella.treureFiltres");
    boto.addEventListener("click", treureElsFiltres);
    bloc.append(boto);
  }
  return bloc;
}

// ---------- Ordenació de la graella ----------

// Ordre per defecte: el número de col·lecció (el mateix criteri que data.js).
// Comparació de text amb sentit numèric: "2" abans que "10", i els números
// amb lletres (com "TG01" d'altres sets) no trenquen l'ordre
function perNumero(a, b) {
  return String(a.number).localeCompare(String(b.number), undefined, { numeric: true });
}

// Preu descendent (la més cara primer); les cartes sense preu, al final
function perPreu(a, b) {
  const preuA = preuCarta(a);
  const preuB = preuCarta(b);
  if (preuA === null && preuB === null) return perNumero(a, b);
  if (preuA === null) return 1;
  if (preuB === null) return -1;
  return preuB - preuA || perNumero(a, b);
}

// Il·lustrador alfabètic (segons l'idioma actiu); sense il·lustrador, al final
function perArtista(a, b) {
  const nomA = a.artist || null;
  const nomB = b.artist || null;
  if (nomA === null && nomB === null) return perNumero(a, b);
  if (nomA === null) return 1;
  if (nomB === null) return -1;
  return nomA.localeCompare(nomB, idiomaActual()) || perNumero(a, b);
}

// Número de Pokédex ascendent; sense número (Entrenadors, Energies), al final
function perPokedex(a, b) {
  const numA = a.nationalPokedexNumbers?.[0] ?? null;
  const numB = b.nationalPokedexNumbers?.[0] ?? null;
  if (numA === null && numB === null) return perNumero(a, b);
  if (numA === null) return 1;
  if (numB === null) return -1;
  return numA - numB || perNumero(a, b);
}

const COMPARADORS = {
  numero: perNumero,
  preu: perPreu,
  artista: perArtista,
  pokedex: perPokedex,
};

// Ordenar per il·lustrador només té sentit si les dades porten el camp
// artist; si cap carta de la versió activa el té, desactivem l'opció
// perquè no sembli un control espatllat (es reactiva amb dades que el portin)
function actualitzarOpcioArtista() {
  const selector = element("ordre-graella");
  const opcio = selector.querySelector('option[value="artista"]');
  const hiHaIllustradors = versioActiva.cards.some((carta) => carta.artist);
  opcio.disabled = !hiHaIllustradors;
  // Si l'opció desactivada era la triada, tornem a l'ordre per defecte
  if (!hiHaIllustradors && ordreGraella === "artista") {
    ordreGraella = "numero";
    selector.value = "numero";
  }
}

// Les cartes que mostra la graella, ja filtrades i en l'ordre triat
// (també el recorregut de les fletxes del zoom).
// filter retorna un array nou, així el sort no toca l'ordre original de
// versioActiva.cards (l'àlbum i les estadístiques en depenen).
// Amb una cerca escrita, primer les coincidències exactes i de prefix
// i al final les aproximades; dins de cada nivell, l'ordre triat.
function cartesDeLaGraella() {
  if (!versioActiva) return [];
  const consulta = consultaActual();
  const nivells = new Map();
  return versioActiva.cards
    .filter(predicatActual())
    .sort((a, b) => {
      if (consulta.text) {
        if (!nivells.has(a)) nivells.set(a, rellevancia(a, consulta));
        if (!nivells.has(b)) nivells.set(b, rellevancia(b, consulta));
        const diferencia = nivells.get(a) - nivells.get(b);
        if (diferencia !== 0) return diferencia;
      }
      return COMPARADORS[ordreGraella](a, b);
    });
}

function pintarGraella() {
  // La mateixa cerca, a les altres expansions (secció de sota la graella).
  // Va aquí perquè tot el que repinta la graella (cerca, canvi d'expansió,
  // d'idioma o de versió) també ha de refer o amagar aquesta secció
  refrescarCercaGlobal(element("cercador").value, setActiu());
  const graella = element("graella");
  graella.innerHTML = "";
  if (!versioActiva) return;

  const visibles = cartesDeLaGraella();

  if (visibles.length === 0) {
    graella.append(crearGraellaBuida());
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const carta of visibles) {
    const fitxa = document.createElement("article");
    fitxa.className = "carta";
    fitxa.dataset.id = carta.id; // identificador estable (ex. sv6pt5-33)
    // Sense cap còpia, la carta es veu apagada; s'encén quan en tens alguna
    fitxa.classList.toggle("carta--pendent", !enTeCap(carta.id));

    const imatge = document.createElement("img");
    imatge.className = "carta-imatge";
    // lazy i decoding ABANS de src: si s'assignen després, la petició ja
    // ha sortit amb l'estat per defecte (eager) i el lazy no fa res
    imatge.loading = "lazy";
    imatge.decoding = "async";
    imatge.src = carta.images.small;
    imatge.alt = carta.name;

    const info = document.createElement("div");
    info.className = "carta-info";
    for (const [classe, text] of [
      ["carta-numero", formatarNumero(carta)],
      ["carta-nom", carta.name],
      ["carta-raresa", carta.rarity ?? ""],
    ]) {
      const linia = document.createElement("span");
      linia.className = classe;
      linia.textContent = text;
      info.append(linia);
    }

    // Preu orientatiu (el sistema de fonts és a variants.js); si no se'n
    // coneix cap, un guió amb l'explicació en passar-hi el ratolí per sobre
    const { preu, motiu } = infoPreuCarta(carta);
    const espaiPreu = document.createElement("span");
    espaiPreu.className = "carta-preu";
    if (preu !== null) {
      // El "≈" marca tot preu que no sigui de Cardmarket i al dia; el
      // títol en diu el motiu (convertit de dòlars, antic o dubtós)
      if (motiu) {
        espaiPreu.textContent = "≈ " + formatarPreu(preu);
        espaiPreu.title = t(TEXT_MOTIU_PREU[motiu]);
      } else {
        espaiPreu.textContent = formatarPreu(preu);
      }
    } else {
      espaiPreu.textContent = "—";
      espaiPreu.title = t("carta.sensePreu");
    }
    info.append(espaiPreu);

    info.append(crearPastillesTipus(carta));

    fitxa.append(imatge, info, crearControlsVariants(carta));

    // Un clic (o toc) a la carta l'obre sempre en gran. Només el bloc de
    // variants queda fora: s'hi marca amb els botons − i +, i un toc que
    // els erri per poc (el nom, l'espai entre files) no ha d'obrir res.
    // El clic dret es queda amb el menú normal del navegador.
    fitxa.addEventListener("click", (esdeveniment) => {
      if (esdeveniment.target.closest(".variants")) return;
      obrirZoom(carta, visibles);
    });

    fragment.append(fitxa);
  }
  graella.append(fragment);
}

// ---------- Pastilles de color dels tipus ----------

// Tipus amb fons clar: la lletra de la pastilla ha de ser fosca
const TIPUS_LLETRA_FOSCA = new Set(["Grass", "Lightning", "Metal", "Dragon", "Colorless"]);
// Tipus amb fons molt fosc: una vora fina perquè la pastilla no es perdi
const TIPUS_AMB_VORA = new Set(["Darkness"]);

// Una pastilla petita amb el nom traduït i les classes de color adequades
function crearPastilla(text, classeColor, lletraFosca, ambVora) {
  const pastilla = document.createElement("span");
  pastilla.className = "pastilla-tipus " + classeColor;
  if (lletraFosca) pastilla.classList.add("pastilla-tipus--fosca-lletra");
  if (ambVora) pastilla.classList.add("pastilla-tipus--vora");
  pastilla.textContent = text;
  return pastilla;
}

// El bloc de pastilles d'una carta: una per tipus d'energia; si la carta
// no en té (Entrenador, Energia), una pastilla neutra amb la categoria
function crearPastillesTipus(carta) {
  const bloc = document.createElement("div");
  bloc.className = "carta-tipus";
  if (carta.types?.length) {
    for (const tipus of carta.types) {
      bloc.append(crearPastilla(
        traduirNomDada("tipus.", tipus),
        "pastilla-tipus--" + tipus.toLowerCase(),
        TIPUS_LLETRA_FOSCA.has(tipus),
        TIPUS_AMB_VORA.has(tipus),
      ));
    }
  } else if (carta.supertype) {
    bloc.append(crearPastilla(
      traduirNomDada("categoria.", carta.supertype),
      "pastilla-tipus--neutre",
      false,
      true,
    ));
  }
  return bloc;
}

// ---------- Comptadors de la col·lecció a cada carta ----------

// Escriu el valor d'un comptador i el ressalta si és més gran que zero
function pintarComptador(espai, valor) {
  espai.textContent = valor;
  espai.classList.toggle("comptador-valor--te", valor > 0);
}

// Botó − o + d'una variant: un sol clic ajusta el comptador
function crearBotoComptador(carta, variant, delta, simbol) {
  const boto = document.createElement("button");
  boto.type = "button";
  boto.className = "boto-comptador";
  boto.textContent = simbol;
  boto.addEventListener("click", (esdeveniment) => {
    esdeveniment.stopPropagation(); // que el clic no arribi a la carta
    // false = el canvi és viu però no s'ha pogut desar al navegador
    if (!ajustar(carta.id, variant, delta)) {
      mostrarMissatge("colleccio.senseEspai", true);
    }
  });
  return boto;
}

// Una fila "variant − N +" per cada variant que existeix de la carta
function crearControlsVariants(carta) {
  const bloc = document.createElement("div");
  bloc.className = "variants";
  const valors = comptadors(carta.id);
  for (const variant of variantsDisponibles(carta)) {
    const fila = document.createElement("div");
    fila.className = "variant-fila";

    const nom = document.createElement("span");
    nom.className = "variant-nom";
    nom.textContent = t("variant." + variant);
    // El 30% de l'enquesta no sabia què és una reverse holo: passant-hi
    // el ratolí es llegeix l'explicació (al zoom es veu sempre escrita)
    if (variant === "reverse") nom.title = t("variant.ajudaReverse");

    const valor = document.createElement("span");
    valor.className = "comptador-valor";
    valor.dataset.variant = variant;
    pintarComptador(valor, valors[variant]);

    fila.append(
      nom,
      crearBotoComptador(carta, variant, -1, "−"),
      valor,
      crearBotoComptador(carta, variant, +1, "+"),
    );
    bloc.append(fila);
  }
  return bloc;
}

// Es crida (per subscripció) després de cada canvi de la col·lecció
function refrescarColleccio() {
  if (filtreColleccio === "totes") {
    // Actualitzem comptadors i estat apagat en lloc, sense repintar-ho tot
    for (const fitxa of element("graella").querySelectorAll(".carta")) {
      fitxa.classList.toggle("carta--pendent", !enTeCap(fitxa.dataset.id));
      const valors = comptadors(fitxa.dataset.id);
      for (const valor of fitxa.querySelectorAll(".comptador-valor")) {
        pintarComptador(valor, valors[valor.dataset.variant]);
      }
    }
  } else {
    // Amb un filtre actiu, el canvi pot fer entrar o sortir cartes
    pintarGraella();
    refrescarRessaltatAlbum(); // i el filtre depèn de la col·lecció: el ressaltat també
  }
  // Si el zoom és obert, els seus comptadors també s'actualitzen en viu
  if (!element("zoom").hidden && cartaZoom) {
    const valors = comptadors(cartaZoom.id);
    for (const valor of element("zoom-variants").querySelectorAll(".comptador-valor")) {
      pintarComptador(valor, valors[valor.dataset.variant]);
    }
    aplicarHolo(cartaZoom); // marcar una holo o una reverse la fa brillar al moment
  }
  pintarBarraColleccio();
  // Les butxaques de l'àlbum s'encenen o s'apaguen EN LLOC, sense
  // reconstruir la pàgina sencera (repintar recreava 9-18 <img> per toc)
  actualitzarButxaques();
  refrescarEstadistiques(); // progrés, valor i cost canvien amb la col·lecció
}

// El peu mostra sempre la data de les dades que s'estan veient
function pintarPeu() {
  if (!versioActiva) return;
  element("peu-dades").textContent = t("peu.dades", {
    data: formatarDataHora(versioActiva.fetchedAt),
    cartes: versioActiva.cards.length,
  });
}

// ---------- Zoom d'imatge gran ----------

let elementAmbFocus = null; // element per retornar-hi el focus en tancar el zoom
let peticioZoom = 0;        // comptador per descartar imatges grans que arriben tard
let cartaZoom = null;       // carta oberta al zoom (per marcar-la des de la fitxa)
// Les cartes per on es passa amb ‹ › dins del zoom: les que es veien
// (amb els filtres i l'ordre actius) en el moment d'obrir-lo. És una
// foto fixa: si marcar una carta la treu del filtre «Em falten», el
// recorregut no salta ni es perd.
let llistaZoom = [];

// Textos del zoom que canvien amb l'idioma: els aria-label del × i de les
// fletxes i, si el zoom és obert, les files de variants (es refan amb els
// noms traduïts)
function traduirZoom() {
  element("zoom-tancar").setAttribute("aria-label", t("zoom.tancar"));
  element("zoom-anterior").setAttribute("aria-label", t("zoom.anterior"));
  element("zoom-seguent").setAttribute("aria-label", t("zoom.seguent"));
  if (!element("zoom").hidden && cartaZoom) {
    element("zoom-variants").replaceChildren(crearControlsVariants(cartaZoom));
  }
}

// La posició de la carta del zoom dins del recorregut (−1 si no hi és)
function posicioZoom() {
  return cartaZoom ? llistaZoom.findIndex((carta) => carta.id === cartaZoom.id) : -1;
}

// Obre la finestra de zoom d'una carta: imatge gran + fitxa marcable.
// "llista" són les cartes per on es podrà passar amb les fletxes.
function obrirZoom(carta, llista = [carta]) {
  llistaZoom = llista;
  mostrarCartaAlZoom(carta);
  // Recordem on era el focus per retornar-l'hi en tancar
  elementAmbFocus = document.activeElement;
  element("zoom").hidden = false;
  element("zoom-tancar").focus();
}

// Passa a la carta anterior (delta −1) o següent (+1) sense tancar el zoom
function passarCartaZoom(delta) {
  const posicio = posicioZoom();
  const desti = llistaZoom[posicio + delta];
  if (posicio === -1 || !desti) return;
  mostrarCartaAlZoom(desti);
}

// Omple el zoom amb una carta (en obrir-lo i en passar de carta)
function mostrarCartaAlZoom(carta) {
  cartaZoom = carta;
  element("zoom-numero").textContent = formatarNumero(carta);
  element("zoom-nom").textContent = carta.name;
  element("zoom-raresa").textContent = carta.rarity ?? "";
  // Les mateixes files de comptadors − N + que té la carta a la graella
  element("zoom-variants").replaceChildren(crearControlsVariants(carta));
  aplicarHolo(carta); // brillantor si la carta és holo o reverse (holo.js)
  // L'explicació de què és una reverse holo, només si la carta en té
  element("zoom-ajuda-reverse").hidden = !variantsDisponibles(carta).includes("reverse");

  // Fletxes ‹ ›: apagades al principi i al final del recorregut, i
  // amagades del tot si només hi ha una carta
  const posicio = posicioZoom();
  const anterior = element("zoom-anterior");
  const seguent = element("zoom-seguent");
  anterior.hidden = seguent.hidden = llistaZoom.length < 2;
  anterior.disabled = posicio <= 0;
  seguent.disabled = posicio === -1 || posicio >= llistaZoom.length - 1;
  // Si el focus s'ha perdut (una fletxa que s'acaba d'apagar, o un botó
  // − / + que s'ha refet amb la carta nova), torna al × del zoom
  const focus = document.activeElement;
  if (!element("zoom").hidden
    && (focus?.disabled || !element("zoom").contains(focus))) {
    element("zoom-tancar").focus();
  }

  // Primer la miniatura ampliada (ja és a la memòria cau del navegador);
  // la imatge gran només es demana ara, en obrir el zoom
  const imatge = element("zoom-imatge");
  imatge.src = carta.images.small;
  imatge.alt = t("zoom.carregant");
  const gran = carta.images.large ?? carta.images.small;
  const peticio = ++peticioZoom;
  imatge.classList.add("zoom-imatge--carregant");
  const carregadora = new Image();
  carregadora.addEventListener("load", () => {
    // Si mentre esperàvem s'ha obert una altra carta (o tancat), ho descartem
    if (peticio !== peticioZoom) return;
    imatge.src = gran;
    imatge.alt = carta.name;
    imatge.classList.remove("zoom-imatge--carregant");
  });
  carregadora.addEventListener("error", () => {
    // La imatge gran falla: ens quedem amb la miniatura ampliada
    if (peticio !== peticioZoom) return;
    imatge.alt = carta.name;
    imatge.classList.remove("zoom-imatge--carregant");
  });
  carregadora.src = gran;
}

// Tanca el zoom (si és obert) i retorna el focus on era
function tancarZoom() {
  const zoom = element("zoom");
  if (zoom.hidden) return;
  cartaZoom = null;
  llistaZoom = [];
  peticioZoom++; // descarta la imatge gran si encara estava carregant
  // Si la imatge gran encara carregava, netegem l'estat de càrrega
  element("zoom-imatge").classList.remove("zoom-imatge--carregant");
  aplicarHolo(null); // sense brillantor ni animació amb el zoom tancat
  zoom.hidden = true;
  if (elementAmbFocus?.isConnected) elementAmbFocus.focus();
  elementAmbFocus = null;
}

// ---------- Commutador de vista (graella / àlbum) ----------

// On acaba la capçalera a la pantalla: a escriptori és enganxosa (sticky)
// i tapa el començament de la pàgina; al mòbil es desplaça i no tapa res
function altCapcaleraFixa() {
  const capcalera = document.querySelector(".capcalera");
  if (getComputedStyle(capcalera).position !== "sticky") return 0;
  return Math.max(0, capcalera.getBoundingClientRect().bottom);
}

// La carta de la graella que s'està mirant: la primera fitxa que es veu
// almenys mig sencera per sota de la capçalera (null si no n'hi ha cap)
function cartaVisibleGraella() {
  const dalt = altCapcaleraFixa();
  for (const fitxa of element("graella").querySelectorAll(".carta")) {
    const caixa = fitxa.getBoundingClientRect();
    if (caixa.bottom - caixa.height / 2 > dalt) {
      return caixa.top < window.innerHeight ? fitxa.dataset.id : null;
    }
  }
  return null;
}

// Desplaça la graella perquè la carta "id" quedi a dalt de tot, just per
// sota de la capçalera. Si els filtres l'han deixat fora, prova amb les
// cartes que la segueixen a l'àlbum (en ordre de col·lecció).
function situarGraellaACarta(id) {
  const cartes = versioActiva?.cards ?? [];
  const inici = cartes.findIndex((carta) => carta.id === id);
  if (inici === -1) return;
  for (const carta of cartes.slice(inici)) {
    const fitxa = element("graella").querySelector(`.carta[data-id="${CSS.escape(carta.id)}"]`);
    if (!fitxa) continue;
    const marge = 12; // una mica d'aire entre la capçalera i la carta
    window.scrollTo({
      top: window.scrollY + fitxa.getBoundingClientRect().top - altCapcaleraFixa() - marge,
      behavior: "instant",
    });
    return;
  }
}

// Canvia de vista, marca el botó actiu i ho recorda al navegador.
// Amb "mantenirPosicio", l'altra vista s'obre on és la carta que s'estava
// mirant (abans tornava sempre al principi i calia buscar-la de nou).
function canviarVista(vista, desar = true, mantenirPosicio = false) {
  let cartaReferencia = null;
  if (mantenirPosicio && vista !== vistaActiva) {
    cartaReferencia = vistaActiva === "graella" ? cartaVisibleGraella() : cartaVisibleAlbum();
  }
  // A l'àlbum, abans de mostrar-lo: així es pinta de primer a la pàgina bona
  if (cartaReferencia && vista === "album") situarAlbumACarta(cartaReferencia);
  vistaActiva = vista;
  element("graella").hidden = vista === "album";
  mostrarAlbum(vista === "album");
  // "Ordena per" no té sentit a l'àlbum: l'ordre d'un àlbum és físic
  element("control-ordre").hidden = vista === "album";
  for (const boto of element("commutador-vista").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.vista === vista);
  }
  if (cartaReferencia && vista === "graella") situarGraellaACarta(cartaReferencia);
  if (cartaReferencia && vista === "album") {
    // La pàgina es fa més curta sense la graella: si l'àlbum ha quedat
    // per sobre de la pantalla, el portem a la vista
    const album = element("album");
    if (album.getBoundingClientRect().top < altCapcaleraFixa()) {
      window.scrollTo({
        top: window.scrollY + album.getBoundingClientRect().top - altCapcaleraFixa() - 12,
        behavior: "instant",
      });
    }
  }
  if (desar) {
    try {
      magatzem()?.setItem(CLAU_VISTA, vista);
    } catch {
      // Sense espai: la vista canvia igualment, només no es recordarà
    }
  }
}

// ---------- Tema clar / fosc ----------

// Marca el botó del tema actiu (el mode el posa l'script del <head>)
function pintarCommutadorTema() {
  const mode = document.documentElement.dataset.tema;
  for (const boto of element("commutador-tema").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.tema === mode);
    boto.setAttribute("aria-pressed", boto.dataset.tema === mode ? "true" : "false");
  }
}

// Si l'usuari ha triat tema en aquesta visita (encara que el navegador
// no l'hagi pogut desar): aleshores el canvi del dispositiu ja no mana
let modeColorTriat = false;

// Canvia de tema i, si l'ha triat l'usuari, ho recorda al navegador
function triarModeColor(mode, desar = true) {
  aplicarModeColor(mode);
  pintarCommutadorTema();
  if (desar) {
    modeColorTriat = true;
    try {
      magatzem()?.setItem(CLAU_MODE_COLOR, mode);
    } catch {
      // Sense espai: el tema canvia igualment, només no es recordarà
    }
  }
}

// ---------- Mode de visualització (col·lecció / catàleg) ----------

// Aplica un mode de visualització: "colleccio" (les cartes pendents es
// veuen apagades) o "cataleg" (totes a color, amb marc daurat a les
// tingudes). Tot el canvi visual és CSS condicionat per l'atribut del
// body; aquí només es posa l'atribut, es marca el botó actiu i es
// recorda la tria al navegador.
function aplicarModeVisual(mode, desar = true) {
  document.body.dataset.visualitzacio = mode;
  for (const boto of element("mode-visual").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.visual === mode);
  }
  if (desar) {
    try {
      magatzem()?.setItem(CLAU_VISUAL, mode);
    } catch {
      // Sense espai: el mode canvia igualment, només no es recordarà
    }
  }
}

// Activa un filtre de col·lecció i marca el botó corresponent
function triarFiltreColleccio(filtre) {
  filtreColleccio = filtre;
  for (const boto of element("filtre-colleccio").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.filtre === filtre);
  }
}

// Des de l'àlbum: torna a la graella i fes scroll fins a la carta clicada
function anarACartaDeLaGraella(id) {
  element("cercador").value = "";  // cercador net perquè la carta hi sigui
  triarFiltreColleccio("totes");   // i sense cap filtre de col·lecció
  netejarFiltresDesplegables();    // ni cap filtre desplegable
  canviarVista("graella");
  aplicarFiltres();
  const fitxa = element("graella").querySelector(`.carta[data-id="${CSS.escape(id)}"]`);
  if (!fitxa) return;
  fitxa.scrollIntoView({ behavior: "smooth", block: "center" });
  // La ressaltem un moment perquè l'ull la trobi de seguida
  fitxa.classList.add("carta--ressaltada");
  setTimeout(() => fitxa.classList.remove("carta--ressaltada"), 1500);
}

// ---------- Barra d'eines de la col·lecció ----------

// "X de N cartes": quantes cartes diferents de la versió actual tens
function pintarBarraColleccio() {
  if (!versioActiva) return;
  const tinc = versioActiva.cards.filter((carta) => enTeCap(carta.id)).length;
  element("colleccio-total").textContent = t("colleccio.total", {
    tinc,
    total: versioActiva.cards.length,
  });
}

// Descarrega la col·lecció com a fitxer JSON de còpia de seguretat
function exportarColleccio() {
  const blob = new Blob([exportarJson()], { type: "application/json" });
  const enllac = document.createElement("a");
  enllac.href = URL.createObjectURL(blob);
  enllac.download = "pokedanex-colleccio.json";
  enllac.click();
  // Alliberem la URL una mica després: fer-ho a l'acte podria
  // cancel·lar la descàrrega en alguns navegadors
  setTimeout(() => URL.revokeObjectURL(enllac.href), 1000);
}

// Llegeix el fitxer triat i substitueix la col·lecció (si el JSON és vàlid)
async function importarColleccio(esdeveniment) {
  const fitxer = esdeveniment.target.files[0];
  esdeveniment.target.value = ""; // permet tornar a triar el mateix fitxer
  if (!fitxer) return;
  // Importar SUBSTITUEIX la col·lecció sencera (de totes les expansions),
  // no la fusiona. Si hi ha res a perdre es demana abans, com fa "Buidar"
  if (totals() > 0 && !confirm(t("colleccio.importarConfirma"))) return;
  try {
    const desada = importarJson(await fitxer.text());
    mostrarMissatge(desada ? "colleccio.importada" : "colleccio.senseEspai", !desada);
  } catch {
    // El mòdul rebutja el fitxer sense tocar la col·lecció actual
    mostrarMissatge("colleccio.importError", true);
  }
}

// Esborra tota la col·lecció, amb confirmació prèvia
function buidarColleccio() {
  if (!confirm(t("colleccio.buidarConfirma"))) return;
  if (!buidar()) mostrarMissatge("colleccio.senseEspai", true);
}

// ---------- Botó "Actualitza dades" ----------

// Els motius de fallada que data.js sap distingir; cadascun té el seu
// missatge en llenguatge planer (claus "actualitza.error.<motiu>")
const MOTIUS_ERROR_ACTUALITZA = new Set([
  "senseXarxa", "temps", "limit", "servidor", "tcgdex", "permanent",
]);

async function ferActualitzacio() {
  const boto = element("boto-actualitza");
  const set = setActiu(); // capturat un cop: l'expansió podria canviar mentre baixem
  boto.disabled = true;
  mostrarMissatge("actualitza.enCurs");

  // Primer pas: baixar les dades de l'API (l'única part que pot fallar per culpa de l'API).
  // Si l'API falla, data.js ho torna a provar sol unes quantes vegades i
  // ens avisa de cada reintent perquè l'usuari sàpiga que no s'ha penjat.
  let resultat = null;
  try {
    resultat = await actualitzarDades(set, (intent, max) => {
      // Si l'usuari ja mira una altra expansió, els avisos d'aquesta no li toquen
      if (setActiu() !== set) return;
      if (intent === null) mostrarMissatge("actualitza.enCurs"); // ja respon
      else mostrarMissatge("actualitza.reintent", false, { intent, max });
    });
  } catch (error) {
    // Si falla, no s'ha desat res: la web continua amb les dades que ja
    // mostrava, i el missatge diu per què i de quin dia són. Si l'usuari
    // ha canviat d'expansió mentrestant, no se li barreja l'avís amb les
    // dades de l'altra (que no han canviat en absolut).
    const motiu = MOTIUS_ERROR_ACTUALITZA.has(error?.motiu) ? error.motiu : "servidor";
    if (setActiu() === set) {
      mostrarMissatge("actualitza.error." + motiu, true, {
        data: versioActiva ? formatarDataHora(versioActiva.fetchedAt) : "—",
      });
    }
  }

  // Segon pas: refrescar la llista i mostrar la versió nova (si falla, és un error local).
  // Si mentre baixàvem l'usuari ha canviat d'expansió, no repintem res: la
  // versió nova ja queda desada i apareixerà quan torni a aquesta expansió.
  if (resultat && setActiu() === set) {
    const peticio = ++peticioLlista;
    try {
      const llista = await carregarLlistaVersions(set);
      if (peticio === peticioLlista) {
        versions = llista;
        omplirSelectorVersions(resultat.id);
        const nova = versions.find((v) => v.id === resultat.id);
        // Només anunciem l'èxit si la versió nova s'ha pogut carregar i pintar
        const carregada = await triarVersio(nova);
        if (carregada) {
          mostrarMissatge(resultat.desada ? "actualitza.fet" : "actualitza.senseEspai");
        }
      }
    } catch {
      if (peticio === peticioLlista) mostrarMissatge("graella.error", true);
    }
  } else if (resultat) {
    // L'actualització ha anat bé encara que ja no mirem aquesta expansió
    mostrarMissatge(resultat.desada ? "actualitza.fet" : "actualitza.senseEspai");
  }
  boto.disabled = false;
}

// ---------- Canvi d'expansió ----------

// Canvia l'expansió activa i en mostra la versió de dades més nova.
// La crida el selector d'expansions (el panell del logotip de la capçalera).
export async function canviarExpansio(setId) {
  const efectiu = canviarSetActiu(setId); // valida l'id (desconegut → defecte)
  // Els filtres no viatgen d'una expansió a l'altra: abans s'hi quedaven
  // (les rareses i els tipus es repeteixen a gairebé tots els sets) i
  // s'obria l'expansió nova amb vuit cartes i cap explicació
  netejarCercaIFiltres();
  pintarCompteFiltres(); // distintiu i «Treu tots els filtres», ja sense filtres
  aplicarTema(efectiu); // els colors de la web segueixen l'expansió
  const peticio = ++peticioLlista;
  mostrarMissatge("graella.carregant");
  try {
    const llista = await carregarLlistaVersions(efectiu);
    // Si mentre esperàvem s'ha demanat una altra llista, descartem aquesta
    if (peticio !== peticioLlista) return false;
    versions = llista;
    omplirSelectorVersions(versions[0]?.id);
    if (versions.length === 0) {
      mostrarMissatge("graella.error", true);
      return false;
    }
    // triarVersio ja repinta logotips, filtres, graella, peu, barra,
    // àlbum i estadístiques amb les dades de l'expansió nova
    return await triarVersio(versions[0]);
  } catch {
    if (peticio === peticioLlista) mostrarMissatge("graella.error", true);
    return false;
  }
}

// ---------- Arrencada ----------

async function iniciar() {
  // Tema de colors abans del primer pintat: amb l'id desat al navegador,
  // sense esperar sets.json (així no hi ha flaix turquesa → lila en obrir)
  aplicarTema(setActiuDesat());
  // En tàctil, l'ajuda del zoom no pot prometre la tecla Esc (no n'hi ha):
  // es canvia la clau de traducció abans del primer aplicarTextos, i els
  // canvis d'idioma posteriors ja faran servir la versió tàctil
  if (esTactil.matches) {
    element("zoom-ajuda").dataset.i18n = "zoom.ajudaTactil";
  }
  aplicarTextos();
  element("selector-idioma").value = idiomaActual();

  // Canvi d'idioma en calent: refresquem tots els textos de la pàgina
  element("selector-idioma").addEventListener("change", (esdeveniment) => {
    canviarIdioma(esdeveniment.target.value);
    omplirSelectorVersions(element("selector-versio").value);
    construirFiltresDesplegables(); // retradueix "Tots", tipus i categories
    pintarGraella();
    pintarPeu();
    pintarBarraColleccio();
    refrescarAlbum(); // l'indicador de pàgines de l'àlbum també es tradueix
    refrescarEstadistiques(); // i els textos i formats del panell d'estadístiques
    traduirZoom(); // l'aria-label del botó de tancar el zoom també es tradueix
    // Si hi ha un missatge d'estat visible, també el retraduïm
    if (missatgeActual) {
      mostrarMissatge(missatgeActual.clau, missatgeActual.esError, missatgeActual.parametres);
    }
  });

  // El cercador filtra en escriure. En tàctil, un petit retard (150 ms)
  // agrupa les tecles seguides: reconstruir la graella sencera (fins a
  // 180 fitxes) a cada tecla feia anar el teclat a batzegades.
  // A escriptori no canvia res: el filtre continua sent immediat.
  let temporitzadorCerca = null;
  element("cercador").addEventListener("input", () => {
    if (!esTactil.matches) {
      aplicarFiltres();
      return;
    }
    clearTimeout(temporitzadorCerca);
    temporitzadorCerca = setTimeout(aplicarFiltres, 150);
  });

  // En tàctil, el missatge flotant es pot tancar amb un toc (els estats
  // de càrrega no: desapareixen sols quan la feina acaba)
  element("missatge").addEventListener("click", () => {
    if (!esTactil.matches || !missatgeActual) return;
    if (missatgeActual.clau === "actualitza.enCurs") return;
    if (missatgeActual.clau === "actualitza.reintent") return;
    if (missatgeActual.clau === "graella.carregant") return;
    amagarMissatge();
  });

  // Botó "Filtres i opcions" (només es veu en mòbil, el CSS l'amaga a
  // escriptori): plega i desplega el gruix de controls de la capçalera
  element("boto-filtres").addEventListener("click", () => {
    const obert = element("bloc-filtres").classList.toggle("bloc-filtres--obert");
    element("boto-filtres").setAttribute("aria-expanded", obert ? "true" : "false");
  });

  element("boto-treure-filtres").addEventListener("click", treureElsFiltres);

  // Filtre de col·lecció: Totes / Les tinc / Em falten
  element("filtre-colleccio").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-filtre]");
    if (!boto) return;
    triarFiltreColleccio(boto.dataset.filtre);
    aplicarFiltres();
  });

  // Filtres desplegables: cada canvi desa la tria i repinta la graella
  for (const [id, desar] of [
    ["filtre-raresa", (valor) => { filtreRaresa = valor; }],
    ["filtre-tipus", (valor) => { filtreTipus = valor; }],
    ["filtre-categoria", (valor) => { filtreCategoria = valor; }],
  ]) {
    element(id).addEventListener("change", (esdeveniment) => {
      desar(esdeveniment.target.value);
      actualitzarOpcionsPossibles(); // el que ara és possible depèn dels altres dos
      aplicarFiltres();
    });
  }

  // Selector d'ordenació: canvia el criteri i repinta la graella
  element("ordre-graella").addEventListener("change", (esdeveniment) => {
    ordreGraella = esdeveniment.target.value;
    pintarGraella();
  });

  // Zoom d'imatge gran: es tanca amb clic fora, botó × o tecla Escape
  traduirZoom();
  iniciarHolo(); // capes de brillantor holo al voltant de la imatge del zoom
  element("zoom").addEventListener("click", (esdeveniment) => {
    if (esdeveniment.target === element("zoom")) tancarZoom();
  });
  element("zoom-tancar").addEventListener("click", tancarZoom);
  // Fletxes ‹ › del zoom: passen de carta sense tancar-lo
  element("zoom-anterior").addEventListener("click", () => passarCartaZoom(-1));
  element("zoom-seguent").addEventListener("click", () => passarCartaZoom(1));
  // En tàctil, lliscar el dit sobre la imatge també passa de carta (el
  // mateix gest i el mateix llindar que per passar pàgina a l'àlbum:
  // clarament horitzontal i de més de 48px)
  let iniciLliscar = null;
  element("zoom-imatge").addEventListener("pointerdown", (esdeveniment) => {
    // Només el primer dit: un segon dit és un pessic (ampliar), no lliscar
    if (!esdeveniment.isPrimary) {
      iniciLliscar = null;
      return;
    }
    iniciLliscar = { x: esdeveniment.clientX, y: esdeveniment.clientY };
  });
  element("zoom-imatge").addEventListener("pointerup", (esdeveniment) => {
    if (!iniciLliscar || !esdeveniment.isPrimary) return;
    const deltaX = esdeveniment.clientX - iniciLliscar.x;
    const deltaY = esdeveniment.clientY - iniciLliscar.y;
    iniciLliscar = null;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > 2 * Math.abs(deltaY)) {
      passarCartaZoom(deltaX < 0 ? 1 : -1); // dit cap a l'esquerra = següent
    }
  });
  element("zoom-imatge").addEventListener("pointercancel", () => { iniciLliscar = null; });
  document.addEventListener("keydown", (esdeveniment) => {
    if (esdeveniment.key === "Escape") tancarZoom(); // no fa res si ja és tancat
    // Fletxes del teclat amb el zoom obert: carta anterior o següent
    // (sense Alt/Ctrl/Cmd: Alt+← és «enrere» del navegador)
    const ambModificador = esdeveniment.altKey || esdeveniment.ctrlKey || esdeveniment.metaKey;
    if (!element("zoom").hidden && !ambModificador) {
      if (esdeveniment.key === "ArrowLeft") passarCartaZoom(-1);
      if (esdeveniment.key === "ArrowRight") passarCartaZoom(1);
    }
    // Amb el zoom obert, Tab no ha de sortir del diàleg (els controls de
    // darrere l'overlay no s'han de poder tocar): cicla entre els botons
    // de la fitxa (×, ‹ ›, − i + de cada variant, "Veure a la graella")
    // que es poden fer servir ara mateix (ni amagats ni apagats)
    if (esdeveniment.key === "Tab" && !element("zoom").hidden) {
      esdeveniment.preventDefault();
      const botons = [...element("zoom").querySelectorAll("button")]
        .filter((boto) => !boto.disabled && !boto.hidden);
      const actual = botons.indexOf(document.activeElement);
      const pas = esdeveniment.shiftKey ? -1 : 1;
      // Si el focus s'ha perdut (actual = −1), tornem al primer botó
      const seguent = actual === -1 ? 0 : (actual + pas + botons.length) % botons.length;
      botons[seguent]?.focus();
    }
  });

  // Dins del zoom, el marcatge es fa sempre amb els botons − i + de cada
  // variant, mai clicant la imatge

  // Botó "Veure a la graella": tanca el zoom i ensenya la carta ressaltada
  element("zoom-graella").addEventListener("click", () => {
    if (!cartaZoom) return;
    const id = cartaZoom.id; // tancarZoom esborra cartaZoom: el desem abans
    tancarZoom();
    anarACartaDeLaGraella(id);
  });

  // Panell d'estadístiques: plegat i objectiu de compleció
  iniciarEstadistiques();

  // Tema clar o fosc. Mentre l'usuari no n'hagi triat cap, segueix el
  // del dispositiu també si canvia amb la pàgina oberta (mode nocturn
  // automàtic, per exemple)
  pintarCommutadorTema();
  element("commutador-tema").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-tema]");
    if (boto) triarModeColor(boto.dataset.tema);
  });
  const sistemaClar = window.matchMedia("(prefers-color-scheme: light)");
  const seguirSistema = (canvi) => {
    let desat = null;
    try {
      desat = magatzem()?.getItem(CLAU_MODE_COLOR);
    } catch {
      // Sense accés al navegador: es fa com si no n'hi hagués cap de desat
    }
    if (modeColorTriat || desat === "clar" || desat === "fosc") return;
    triarModeColor(canvi.matches ? "clar" : "fosc", false);
  };
  // Safari anterior a la 14 només coneix addListener
  if (sistemaClar.addEventListener) sistemaClar.addEventListener("change", seguirSistema);
  else sistemaClar.addListener?.(seguirSistema);

  // Mode de visualització: col·lecció o catàleg (es recorda al navegador).
  // Només s'accepta el valor exacte "cataleg"; qualsevol altre (o cap)
  // cau al mode col·lecció per defecte.
  element("mode-visual").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-visual]");
    if (boto) aplicarModeVisual(boto.dataset.visual);
  });
  const visualDesada = magatzem()?.getItem(CLAU_VISUAL);
  aplicarModeVisual(visualDesada === "cataleg" ? "cataleg" : "colleccio", false);

  // Commutador de vista: graella o àlbum (es recorda al navegador).
  // Clicar una butxaca obre el zoom de la carta (des del zoom, el botó
  // "Veure a la graella" fa el salt d'abans). Les fletxes del zoom hi
  // segueixen l'ordre de l'àlbum: només les cartes ressaltades si hi ha
  // cap filtre actiu, i totes si no n'hi ha cap.
  iniciarAlbum((carta) => {
    const cartes = versioActiva?.cards ?? [carta];
    obrirZoom(carta, hiHaFiltreActiu() && predicatActual()(carta)
      ? cartes.filter(predicatActual())
      : cartes);
  });
  element("commutador-vista").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-vista]");
    if (boto) canviarVista(boto.dataset.vista, true, true);
  });
  if (magatzem()?.getItem(CLAU_VISTA) === "album") canviarVista("album", false);

  // Barra d'eines de la col·lecció (peu de pàgina)
  element("boto-exportar").addEventListener("click", exportarColleccio);
  element("boto-importar").addEventListener("click", () => element("fitxer-importar").click());
  element("fitxer-importar").addEventListener("change", importarColleccio);
  element("boto-buidar").addEventListener("click", buidarColleccio);

  // Quan la col·lecció canvia (per qualsevol via), la pantalla es refresca
  subscriure(refrescarColleccio);

  // Canvi de versió de dades
  element("selector-versio").addEventListener("change", (esdeveniment) => {
    const entrada = versions.find((v) => v.id === esdeveniment.target.value);
    if (entrada) triarVersio(entrada);
  });

  element("boto-actualitza").addEventListener("click", ferActualitzacio);

  // Omplim els desplegables d'entrada (només "Tots"): si la càrrega de
  // dades falla, així no queden completament buits
  construirFiltresDesplegables();

  // Carreguem el registre d'expansions (valida quina és l'activa) i,
  // de l'expansió activa, la llista de versions; mostrem la més nova
  mostrarMissatge("graella.carregant");
  const peticio = ++peticioLlista;
  try {
    const sets = await carregarSets();
    // Amb el registre carregat ja sabem l'expansió activa: n'apliquem el
    // tema de colors i arrenquem el selector d'expansions de la capçalera
    aplicarTema(setActiu());
    iniciarSelectorExpansions({ sets, setActiu, enTriar: canviarExpansio });
    // Una carta trobada a una altra expansió: s'obre aquella expansió i
    // es localitza la carta a la graella (com des de l'àlbum)
    iniciarCercaGlobal({
      enTriar: async (setId, cardId) => {
        if (await canviarExpansio(setId)) anarACartaDeLaGraella(cardId);
      },
    });
    const llista = await carregarLlistaVersions(setActiu());
    // Si mentre esperàvem s'ha demanat una altra llista, descartem aquesta
    if (peticio !== peticioLlista) return;
    versions = llista;
    omplirSelectorVersions(versions[0]?.id);
    if (versions.length > 0) {
      await triarVersio(versions[0]);
    } else {
      mostrarMissatge("graella.error", true);
    }
  } catch {
    if (peticio === peticioLlista) mostrarMissatge("graella.error", true);
  }
}

iniciar();
