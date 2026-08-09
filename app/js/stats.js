// stats.js — el panell d'estadístiques plegable: barres de progrés,
// valor de la col·lecció i cost de completar-la segons l'objectiu triat.
// Llegeix l'estat d'altres mòduls (collection, variants) i només pinta.

import { t, idiomaActual } from "./i18n.js";
import { variantsDisponibles, preuVariant } from "./variants.js";
import { comptadors, enTeCap } from "./collection.js";
import { magatzem } from "./storage.js";

const CLAU_OBERT = "pokedanex.statsOpen";           // panell obert o plegat
const CLAU_OBJECTIU = "pokedanex.completionTarget"; // objectiu de compleció

// Estat intern de la vista
let versio = null; // dades de la versió que es mostra
// Què vol dir "completar la col·lecció" per a l'usuari:
// abast "base" (cartes numerades) o "complet" (amb secretes),
// i si les variants reverse holo també compten.
let objectiu = { abast: "base", reverses: false };

const element = (id) => document.getElementById(id);

// ---------- L'objectiu de compleció (es recorda al navegador) ----------

function carregarObjectiu() {
  try {
    const desat = JSON.parse(magatzem()?.getItem(CLAU_OBJECTIU));
    if (desat?.abast === "base" || desat?.abast === "complet") {
      objectiu = { abast: desat.abast, reverses: desat.reverses === true };
    }
  } catch {
    // Si el que hi ha desat no quadra, es queda l'objectiu per defecte
  }
}

function desarObjectiu() {
  try {
    magatzem()?.setItem(CLAU_OBJECTIU, JSON.stringify(objectiu));
  } catch {
    // Sense espai: l'objectiu queda actiu en memòria i el panell es pinta igual
  }
}

// ---------- Càlculs ----------

// Número de carta com a enter (les secretes van per sobre de printedTotal)
const numeroDe = (carta) => parseInt(carta.number, 10) || 0;

// Les cartes del set base: número dins de l'interval imprès (1..printedTotal)
function cartesBase() {
  return versio.cards.filter((carta) => numeroDe(carta) <= versio.set.printedTotal);
}

// Les cartes que formen part de l'objectiu triat
function cartesObjectiu() {
  return objectiu.abast === "complet" ? versio.cards : cartesBase();
}

// La variant "principal" d'una carta: la primera que no és reverse
// (normal a les comunes, holo a les rareses que només brillen)
function variantPrincipal(carta) {
  const variants = variantsDisponibles(carta);
  return variants.find((variant) => variant !== "reverse") ?? variants[0];
}

// Valor de la col·lecció: totes les còpies de totes les variants × el seu
// preu. Les variants sense preu a les dades no sumen, però es compten a part.
function calcularValor() {
  let total = 0;
  let sensePreu = 0;
  for (const carta of versio.cards) {
    const copies = comptadors(carta.id);
    for (const variant of variantsDisponibles(carta)) {
      if (copies[variant] === 0) continue;
      const preu = preuVariant(carta, variant);
      if (preu === null) sensePreu += 1;
      else total += copies[variant] * preu;
    }
  }
  return { total, sensePreu };
}

// Les peces (carta + variant) que falten per assolir l'objectiu:
// de cada carta de l'objectiu que no tens, la seva variant principal;
// i si les reverses compten, la variant reverse de cada carta que en té
// i encara no la tens en reverse.
function pecesQueFalten() {
  const peces = [];
  for (const carta of cartesObjectiu()) {
    if (!enTeCap(carta.id)) peces.push([carta, variantPrincipal(carta)]);
    if (
      objectiu.reverses &&
      variantsDisponibles(carta).includes("reverse") &&
      comptadors(carta.id).reverse === 0
    ) {
      peces.push([carta, "reverse"]);
    }
  }
  return peces;
}

// Cost de completar: suma simple d'1 còpia del preu de cada peça que falta
function calcularCost() {
  let total = 0;
  let sensePreu = 0;
  for (const [carta, variant] of pecesQueFalten()) {
    const preu = preuVariant(carta, variant);
    if (preu === null) sensePreu += 1;
    else total += preu;
  }
  return { total, sensePreu };
}

// ---------- Formats ----------

// Import en euros amb 2 decimals, amb el format de l'idioma actiu
function formatarEuros(quantitat) {
  return new Intl.NumberFormat(idiomaActual(), {
    style: "currency",
    currency: "EUR",
  }).format(quantitat);
}

// La mateixa data de les dades que surt al peu de la pàgina
function formatarDataHora(iso) {
  return new Date(iso).toLocaleString(idiomaActual(), {
    dateStyle: "long",
    timeStyle: "short",
  });
}

// ---------- Pintar el panell ----------

// Els textos del selector d'objectiu porten el total de cartes de cada abast
function pintarObjectiu() {
  const selector = element("estad-abast");
  selector.querySelector('option[value="base"]').textContent =
    t("estad.setBase", { total: versio.set.printedTotal });
  selector.querySelector('option[value="complet"]').textContent =
    t("estad.setComplet", { total: versio.set.total });
  selector.value = objectiu.abast;
  element("estad-reverses").checked = objectiu.reverses;
}

// Una barra de progrés: etiqueta, barra plena al tant per cent i "tinc/total"
function crearBarra(clauEtiqueta, tinc, total) {
  const fila = document.createElement("div");
  fila.className = "estad-barra";

  const nom = document.createElement("span");
  nom.className = "estad-barra-nom";
  nom.textContent = t(clauEtiqueta);

  const pista = document.createElement("div");
  pista.className = "estad-pista";
  const ple = document.createElement("div");
  ple.className = "estad-ple";
  ple.style.width = (total > 0 ? (tinc / total) * 100 : 0) + "%";
  pista.append(ple);

  const xifres = document.createElement("span");
  xifres.className = "estad-barra-xifres";
  xifres.textContent = `${tinc}/${total}`;

  fila.append(nom, pista, xifres);
  return fila;
}

function pintarBarres() {
  const bloc = element("estad-barres");
  bloc.innerHTML = "";
  const base = cartesBase();
  bloc.append(
    crearBarra(
      "estad.progresBase",
      base.filter((carta) => enTeCap(carta.id)).length,
      versio.set.printedTotal,
    ),
    crearBarra(
      "estad.progresComplet",
      versio.cards.filter((carta) => enTeCap(carta.id)).length,
      versio.set.total,
    ),
  );
  // La barra de reverses només surt si l'objectiu les inclou
  if (objectiu.reverses) {
    const ambReverse = cartesObjectiu().filter((carta) =>
      variantsDisponibles(carta).includes("reverse"),
    );
    bloc.append(
      crearBarra(
        "estad.progresReverses",
        ambReverse.filter((carta) => comptadors(carta.id).reverse > 0).length,
        ambReverse.length,
      ),
    );
  }
}

// Una xifra estrella: etiqueta, import gros i notes petites (data dels preus
// i, si cal, quantes cartes no han pogut comptar per falta de preu)
function crearXifra(clauNom, resultat, ambData) {
  const bloc = document.createElement("div");
  bloc.className = "estad-xifra";

  const nom = document.createElement("span");
  nom.className = "estad-xifra-nom";
  nom.textContent = t(clauNom);

  const valor = document.createElement("span");
  valor.className = "estad-xifra-valor";
  valor.textContent = formatarEuros(resultat.total);

  bloc.append(nom, valor);

  const notes = [];
  if (ambData) notes.push(t("estad.preusData", { data: formatarDataHora(versio.fetchedAt) }));
  if (resultat.sensePreu > 0) notes.push(t("estad.sensePreu", { n: resultat.sensePreu }));
  if (notes.length > 0) {
    const nota = document.createElement("span");
    nota.className = "estad-xifra-nota";
    nota.textContent = notes.join(" · ");
    bloc.append(nota);
  }
  return bloc;
}

function pintar() {
  if (!versio) return;
  pintarObjectiu();
  pintarBarres();
  const xifres = element("estad-xifres");
  xifres.innerHTML = "";
  xifres.append(
    crearXifra("estad.valor", calcularValor(), true),
    crearXifra("estad.cost", calcularCost(), false),
  );
}

// Plega o desplega el panell (i ho recorda al navegador si cal)
function aplicarPlegat(obert, desar = true) {
  element("panell-estad").classList.toggle("estad--tancat", !obert);
  element("estad-capcalera").setAttribute("aria-expanded", String(obert));
  element("estad-cos").hidden = !obert;
  if (desar) {
    try {
      magatzem()?.setItem(CLAU_OBERT, obert ? "1" : "0");
    } catch {
      // Sense espai: el panell es plega igualment, només no es recordarà
    }
  }
}

// ---------- Funcions públiques (les crida main.js) ----------

// Lliga el botó de plegar i els controls de l'objectiu,
// i recupera les tries desades (obert per defecte el primer cop)
export function iniciarEstadistiques() {
  carregarObjectiu();
  aplicarPlegat(magatzem()?.getItem(CLAU_OBERT) !== "0", false);

  element("estad-capcalera").addEventListener("click", () => {
    aplicarPlegat(element("estad-cos").hidden); // si està amagat, s'obre
  });
  element("estad-abast").addEventListener("change", (esdeveniment) => {
    objectiu.abast = esdeveniment.target.value;
    desarObjectiu();
    pintar();
  });
  element("estad-reverses").addEventListener("change", (esdeveniment) => {
    objectiu.reverses = esdeveniment.target.checked;
    desarObjectiu();
    pintar();
  });
}

// Canvi de versió de dades: el panell es mostra i es recalcula tot
export function carregarEstadistiques(dades) {
  versio = dades;
  element("panell-estad").hidden = false;
  pintar();
}

// Recalcula el panell (canvis de col·lecció o d'idioma)
export function refrescarEstadistiques() {
  pintar();
}
