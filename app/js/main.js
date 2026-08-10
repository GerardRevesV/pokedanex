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
import { magatzem } from "./storage.js";

// Estat de la pàgina
let versions = [];       // llista d'entrades per al selector de versions
let versioActiva = null; // dades completes de la versió que es mostra
let missatgeActual = null; // {clau, esError} del missatge visible, per retraduir-lo
let peticioVersio = 0;   // comptador per descartar càrregues de versió que arriben tard
let filtreColleccio = "totes"; // filtre actiu: "totes" | "tinc" | "falten"
let vistaActiva = "graella";   // vista oberta: "graella" | "album"

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
    amagarMissatge();
    pintarLogotips();
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

function pintarGraella() {
  const graella = element("graella");
  graella.innerHTML = "";
  if (!versioActiva) return;

  const consulta = element("cercador").value.trim().toLowerCase();
  const visibles = versioActiva.cards.filter(
    (carta) => coincideix(carta, consulta) && passaFiltreColleccio(carta),
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

    fitxa.append(imatge, info, crearControlsVariants(carta));
    fragment.append(fitxa);
  }
  graella.append(fragment);
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
    pintarGraella();
    pintarPeu();
    pintarBarraColleccio();
    refrescarAlbum(); // l'indicador de pàgines de l'àlbum també es tradueix
    refrescarEstadistiques(); // i els textos i formats del panell d'estadístiques
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

  // Panell d'estadístiques: plegat i objectiu de compleció
  iniciarEstadistiques();

  // Commutador de vista: graella o àlbum (es recorda al navegador)
  iniciarAlbum(anarACartaDeLaGraella);
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
