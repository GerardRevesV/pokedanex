// main.js — la interfície: pinta la graella, el cercador i lliga els mòduls.

import { t, idiomaActual, canviarIdioma, aplicarTextos } from "./i18n.js";
import { carregarLlistaVersions, carregarVersio, actualitzarDades } from "./data.js";
import { variantsDisponibles } from "./variants.js";
import {
  comptadors, ajustar, enTeCap, subscriure,
  exportarJson, importarJson, buidar,
} from "./collection.js";
import { iniciarAlbum, carregarAlbum, mostrarAlbum, refrescarAlbum } from "./album.js";
import { iniciarEstadistiques, carregarEstadistiques, refrescarEstadistiques } from "./stats.js";
import { modeActiu, canviarMode, esModeVariant } from "./markmode.js";
import { magatzem } from "./storage.js";

// Estat de la pàgina
let versions = [];       // llista d'entrades per al selector de versions
let versioActiva = null; // dades completes de la versió que es mostra
let missatgeActual = null; // {clau, esError} del missatge visible, per retraduir-lo
let peticioVersio = 0;   // comptador per descartar càrregues de versió que arriben tard
let filtreColleccio = "totes"; // filtre actiu: "totes" | "tinc" | "falten"
let vistaActiva = "graella";   // vista oberta: "graella" | "album"

// Filtres desplegables actius ("" vol dir "tots")
let filtreRaresa = "";
let filtreTipus = "";
let filtreCategoria = "";

const CLAU_VISTA = "pokedanex.view"; // la vista triada es recorda al navegador

const element = (id) => document.getElementById(id);

// ---------- Missatges d'estat ----------

// Rep la clau de traducció (no el text) per poder retraduir el missatge
// si l'usuari canvia d'idioma mentre encara és visible.
function mostrarMissatge(clau, esError = false) {
  missatgeActual = { clau, esError };
  const missatge = element("missatge");
  missatge.textContent = t(clau);
  missatge.classList.toggle("missatge--error", esError);
  missatge.hidden = false;
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
    pintarGraella();
    pintarPeu();
    pintarBarraColleccio();
    carregarAlbum(dades); // l'àlbum també canvia de versió de dades
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

// Una carta coincideix si la cerca apareix al nom o al número
function coincideix(carta, consulta) {
  if (!consulta) return true;
  return (
    carta.name.toLowerCase().includes(consulta) ||
    carta.number.includes(consulta) ||
    carta.number.padStart(3, "0").includes(consulta)
  );
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
}

function pintarGraella() {
  const graella = element("graella");
  graella.innerHTML = "";
  if (!versioActiva) return;

  const consulta = element("cercador").value.trim().toLowerCase();
  const visibles = versioActiva.cards.filter(
    (carta) =>
      coincideix(carta, consulta) &&
      passaFiltreColleccio(carta) &&
      passaFiltresDesplegables(carta),
  );

  if (visibles.length === 0) {
    const buida = document.createElement("p");
    buida.className = "graella-buida";
    buida.textContent = t("graella.buida");
    graella.append(buida);
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
    imatge.src = carta.images.small;
    imatge.alt = carta.name;
    imatge.loading = "lazy";
    // Un clic a la imatge obre el zoom, però només en mode consulta:
    // en mode variant el clic el gestiona la fitxa sencera (més avall)
    imatge.addEventListener("click", () => {
      if (!esModeVariant()) obrirZoom(carta);
    });

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

    info.append(crearPastillesTipus(carta));

    fitxa.append(imatge, info, crearControlsVariants(carta));

    // Mode de marcatge: clic esquerre suma i clic dret resta una còpia
    // de la variant activa. Els botons +/− queden fora (van per si sols).
    fitxa.addEventListener("click", (esdeveniment) => {
      if (!esModeVariant()) return;
      if (esdeveniment.target.closest(".boto-comptador")) return;
      marcarCarta(carta, +1, fitxa);
    });
    fitxa.addEventListener("contextmenu", (esdeveniment) => {
      if (!esModeVariant()) return; // en consulta, menú del navegador intacte
      if (esdeveniment.target.closest(".boto-comptador")) return;
      esdeveniment.preventDefault();
      marcarCarta(carta, -1, fitxa);
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
function crearBotoComptador(id, variant, delta, simbol) {
  const boto = document.createElement("button");
  boto.type = "button";
  boto.className = "boto-comptador";
  boto.textContent = simbol;
  boto.addEventListener("click", (esdeveniment) => {
    esdeveniment.stopPropagation(); // que el clic no arribi a la carta
    // false = el canvi és viu però no s'ha pogut desar al navegador
    if (!ajustar(id, variant, delta)) {
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

    const valor = document.createElement("span");
    valor.className = "comptador-valor";
    valor.dataset.variant = variant;
    pintarComptador(valor, valors[variant]);

    fila.append(
      nom,
      crearBotoComptador(carta.id, variant, -1, "−"),
      valor,
      crearBotoComptador(carta.id, variant, +1, "+"),
    );
    bloc.append(fila);
  }
  return bloc;
}

// ---------- Mode de marcatge amb clics ----------

// Temps dels efectes de marcar (coordinat amb les animacions del CSS)
const DURADA_EFECTE = 400;

// Recorda el temporitzador del flaix de cada node: si es clica de pressa,
// el cancel·lem perquè el clic anterior no retalli el flaix del nou
const temporitzadorsFlaix = new WeakMap();

// Suma (delta +1) o resta (−1) una còpia de la variant activa en clicar
// una carta. "node" és la fitxa de la graella o la funda de l'àlbum.
function marcarCarta(carta, delta, node) {
  const variant = modeActiu();

  // La carta no existeix en aquesta variant: sacseig subtil i cap canvi.
  // El títol explica el perquè si l'usuari hi passa el ratolí per sobre.
  if (!variantsDisponibles(carta).includes(variant)) {
    if (node.classList.contains("carta--sacseig")) return;
    const titolAntic = node.title;
    node.title = t("marcar.senseVariant", { variant: t("variant." + variant) });
    node.classList.add("carta--sacseig");
    setTimeout(() => {
      node.classList.remove("carta--sacseig");
      node.title = titolAntic;
    }, DURADA_EFECTE);
    return;
  }

  // false = el canvi és viu però no s'ha pogut desar al navegador
  if (!ajustar(carta.id, variant, delta)) {
    mostrarMissatge("colleccio.senseEspai", true);
  }

  // Flaix de vora perquè es vegi que el clic ha entrat. L'àlbum es repinta
  // sencer en canviar la col·lecció: si el node antic ja no és a la pàgina,
  // busquem el nou pel seu identificador de carta.
  let objectiu = node;
  if (!node.isConnected) {
    // Busquem un node del mateix tipus (funda o fitxa): la graella
    // amagada també té la carta i no és la que s'ha de fer brillar
    const selector = node.classList.contains("butxaca-funda")
      ? `.butxaca-funda[data-id="${carta.id}"]`
      : `.carta[data-id="${carta.id}"]`;
    objectiu = document.querySelector(selector);
    if (!objectiu) return; // la carta ha sortit de la vista (filtres)
  }
  const classe = delta > 0 ? "carta--marcada" : "carta--restada";
  clearTimeout(temporitzadorsFlaix.get(objectiu));
  objectiu.classList.remove("carta--marcada", "carta--restada");
  void objectiu.offsetWidth; // reinicia l'efecte si es clica de pressa
  objectiu.classList.add(classe);
  temporitzadorsFlaix.set(
    objectiu,
    setTimeout(() => objectiu.classList.remove(classe), DURADA_EFECTE)
  );
}

// Aplica un mode de marcatge: el desa, marca el botó actiu del menú i
// informa el CSS (cursors i distintiu de l'àlbum) via l'atribut del body
function aplicarModeMarcatge(mode) {
  canviarMode(mode);
  document.body.dataset.marcatge = modeActiu();
  for (const boto of element("mode-marcatge").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.mode === modeActiu());
  }
  refrescarAlbum(); // el distintiu de les butxaques depèn del mode actiu
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
  }
  pintarBarraColleccio();
  refrescarAlbum(); // les cartes de l'àlbum també s'encenen o s'apaguen
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

// L'aria-label del botó × canvia amb l'idioma: es posa a l'arrencada i a cada canvi
function traduirZoom() {
  element("zoom-tancar").setAttribute("aria-label", t("zoom.tancar"));
}

// Obre la finestra de zoom d'una carta amb la seva imatge gran
function obrirZoom(carta) {
  element("zoom-numero").textContent = formatarNumero(carta);
  element("zoom-nom").textContent = carta.name;
  element("zoom-raresa").textContent = carta.rarity ?? "";

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

  // Recordem on era el focus per retornar-l'hi en tancar
  elementAmbFocus = document.activeElement;
  element("zoom").hidden = false;
  element("zoom-tancar").focus();
}

// Tanca el zoom (si és obert) i retorna el focus on era
function tancarZoom() {
  const zoom = element("zoom");
  if (zoom.hidden) return;
  peticioZoom++; // descarta la imatge gran si encara estava carregant
  zoom.hidden = true;
  if (elementAmbFocus?.isConnected) elementAmbFocus.focus();
  elementAmbFocus = null;
}

// ---------- Commutador de vista (graella / àlbum) ----------

// Canvia de vista, marca el botó actiu i ho recorda al navegador
function canviarVista(vista, desar = true) {
  vistaActiva = vista;
  element("graella").hidden = vista === "album";
  mostrarAlbum(vista === "album");
  for (const boto of element("commutador-vista").querySelectorAll("button")) {
    boto.classList.toggle("actiu", boto.dataset.vista === vista);
  }
  if (desar) {
    try {
      magatzem()?.setItem(CLAU_VISTA, vista);
    } catch {
      // Sense espai: la vista canvia igualment, només no es recordarà
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
  pintarGraella();
  const fitxa = element("graella").querySelector(`.carta[data-id="${id}"]`);
  if (!fitxa) return;
  fitxa.scrollIntoView({ behavior: "smooth", block: "center" });
  // La ressaltem un moment perquè l'ull la trobi de seguida
  fitxa.classList.add("carta--ressaltada");
  setTimeout(() => fitxa.classList.remove("carta--ressaltada"), 1500);
}

// ---------- Barra d'eines de la col·lecció ----------

// "X de 99 cartes": quantes cartes diferents de la versió actual tens
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

async function ferActualitzacio() {
  const boto = element("boto-actualitza");
  boto.disabled = true;
  mostrarMissatge("actualitza.enCurs");

  // Primer pas: baixar les dades de l'API (l'única part que pot fallar per culpa de l'API)
  let resultat = null;
  try {
    resultat = await actualitzarDades();
  } catch {
    mostrarMissatge("actualitza.error", true);
  }

  // Segon pas: refrescar la llista i mostrar la versió nova (si falla, és un error local)
  if (resultat) {
    try {
      versions = await carregarLlistaVersions();
      omplirSelectorVersions(resultat.id);
      const nova = versions.find((v) => v.id === resultat.id);
      // Només anunciem l'èxit si la versió nova s'ha pogut carregar i pintar
      const carregada = await triarVersio(nova);
      if (carregada) {
        mostrarMissatge(resultat.desada ? "actualitza.fet" : "actualitza.senseEspai");
      }
    } catch {
      mostrarMissatge("graella.error", true);
    }
  }
  boto.disabled = false;
}

// ---------- Arrencada ----------

async function iniciar() {
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
    if (missatgeActual) mostrarMissatge(missatgeActual.clau, missatgeActual.esError);
  });

  // El cercador filtra en escriure
  element("cercador").addEventListener("input", pintarGraella);

  // Filtre de col·lecció: Totes / Les tinc / Em falten
  element("filtre-colleccio").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-filtre]");
    if (!boto) return;
    triarFiltreColleccio(boto.dataset.filtre);
    pintarGraella();
  });

  // Filtres desplegables: cada canvi desa la tria i repinta la graella
  for (const [id, desar] of [
    ["filtre-raresa", (valor) => { filtreRaresa = valor; }],
    ["filtre-tipus", (valor) => { filtreTipus = valor; }],
    ["filtre-categoria", (valor) => { filtreCategoria = valor; }],
  ]) {
    element(id).addEventListener("change", (esdeveniment) => {
      desar(esdeveniment.target.value);
      pintarGraella();
    });
  }

  // Zoom d'imatge gran: es tanca amb clic fora, botó × o tecla Escape
  traduirZoom();
  element("zoom").addEventListener("click", (esdeveniment) => {
    if (esdeveniment.target === element("zoom")) tancarZoom();
  });
  element("zoom-tancar").addEventListener("click", tancarZoom);
  document.addEventListener("keydown", (esdeveniment) => {
    if (esdeveniment.key === "Escape") tancarZoom(); // no fa res si ja és tancat
    // Amb el zoom obert, Tab no ha de sortir del diàleg (els controls de
    // darrere l'overlay no s'han de poder tocar). L'únic focalitzable és el ×.
    if (esdeveniment.key === "Tab" && !element("zoom").hidden) {
      esdeveniment.preventDefault();
      element("zoom-tancar").focus();
    }
  });

  // Panell d'estadístiques: plegat i objectiu de compleció
  iniciarEstadistiques();

  // Mode de marcatge amb clics: consulta o variant (es recorda al navegador)
  element("mode-marcatge").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-mode]");
    if (boto) aplicarModeMarcatge(boto.dataset.mode);
  });
  aplicarModeMarcatge(modeActiu());

  // Commutador de vista: graella o àlbum (es recorda al navegador)
  iniciarAlbum(anarACartaDeLaGraella, marcarCarta);
  element("commutador-vista").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-vista]");
    if (boto) canviarVista(boto.dataset.vista);
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

  // Carreguem la llista de versions i mostrem la més nova
  mostrarMissatge("graella.carregant");
  try {
    versions = await carregarLlistaVersions();
    omplirSelectorVersions(versions[0]?.id);
    if (versions.length > 0) {
      await triarVersio(versions[0]);
    } else {
      mostrarMissatge("graella.error", true);
    }
  } catch {
    mostrarMissatge("graella.error", true);
  }
}

iniciar();
