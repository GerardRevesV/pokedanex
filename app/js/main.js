// main.js — la interfície: pinta la graella, el cercador i lliga els mòduls.

import { t, idiomaActual, canviarIdioma, aplicarTextos } from "./i18n.js";
import { carregarLlistaVersions, carregarVersio, actualitzarDades } from "./data.js";

// Estat de la pàgina
let versions = [];       // llista d'entrades per al selector de versions
let versioActiva = null; // dades completes de la versió que es mostra
let missatgeActual = null; // {clau, esError} del missatge visible, per retraduir-lo
let peticioVersio = 0;   // comptador per descartar càrregues de versió que arriben tard

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

function pintarGraella() {
  const graella = element("graella");
  graella.innerHTML = "";
  if (!versioActiva) return;

  const consulta = element("cercador").value.trim().toLowerCase();
  const visibles = versioActiva.cards.filter((carta) => coincideix(carta, consulta));

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

    fitxa.append(imatge, info);
    fragment.append(fitxa);
  }
  graella.append(fragment);
}

// El peu mostra sempre la data de les dades que s'estan veient
function pintarPeu() {
  if (!versioActiva) return;
  element("peu-dades").textContent = t("peu.dades", {
    data: formatarDataHora(versioActiva.fetchedAt),
    cartes: versioActiva.cards.length,
  });
}

// ---------- Botó "Actualitza dades" ----------

async function ferActualitzacio() {
  const boto = element("boto-actualitza");
  boto.disabled = true;
  mostrarMissatge("actualitza.enCurs");
  try {
    const resultat = await actualitzarDades();
    versions = await carregarLlistaVersions();
    omplirSelectorVersions(resultat.id);
    const nova = versions.find((v) => v.id === resultat.id);
    // Només anunciem l'èxit si la versió nova s'ha pogut carregar i pintar
    const carregada = await triarVersio(nova);
    if (carregada) {
      mostrarMissatge(resultat.desada ? "actualitza.fet" : "actualitza.senseEspai");
    }
  } catch {
    mostrarMissatge("actualitza.error", true);
  } finally {
    boto.disabled = false;
  }
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
    // Si hi ha un missatge d'estat visible, també el retraduïm
    if (missatgeActual) mostrarMissatge(missatgeActual.clau, missatgeActual.esError);
  });

  // El cercador filtra en escriure
  element("cercador").addEventListener("input", pintarGraella);

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
