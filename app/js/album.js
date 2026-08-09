// album.js — vista d'àlbum realista: un carpesà obert amb dues pàgines
// de 3×3 butxaques (18 cartes per doble pàgina), en ordre de col·lecció.
// És una vista de CONSULTA: per marcar cartes es fa servir la graella.

import { t } from "./i18n.js";
import { enTeCap } from "./collection.js";

const CARTES_PER_PAGINA = 9;  // butxaques 3×3 (estàndard dels àlbums Pokémon)
const CARTES_PER_DOBLE = 18;  // dues pàgines obertes costat a costat

// Estat intern de la vista
let versio = null;       // dades de la versió que es mostra
let doble = 0;           // índex de la doble pàgina oberta (0 = la primera)
let visible = false;     // si l'àlbum s'està veient ara mateix
let contenidor = null;   // el bloc #album de la pàgina
let alTriarCarta = null; // callback amb l'id de la carta clicada

const element = (id) => document.getElementById(id);

// Quantes dobles pàgines calen per encabir totes les cartes
function totalDobles() {
  if (!versio) return 1;
  return Math.max(1, Math.ceil(versio.cards.length / CARTES_PER_DOBLE));
}

// Número de col·lecció amb el format dels àlbums: 033/064
function formatarNumero(carta) {
  const total = String(versio.set.printedTotal).padStart(3, "0");
  return `${carta.number.padStart(3, "0")}/${total}`;
}

// Una butxaca: amb carta (a color o apagada) o buida (només el plàstic)
function crearButxaca(carta) {
  const butxaca = document.createElement("div");
  butxaca.className = "butxaca";

  const funda = document.createElement("div");
  funda.className = "butxaca-funda";

  const numero = document.createElement("span");
  numero.className = "butxaca-numero";

  if (carta) {
    // Mateix llenguatge visual que la graella: sense cap còpia, apagada
    if (!enTeCap(carta.id)) funda.classList.add("butxaca-funda--pendent");
    const imatge = document.createElement("img");
    imatge.src = carta.images.small;
    imatge.alt = carta.name;
    imatge.loading = "lazy";
    funda.append(imatge);
    funda.title = carta.name;
    numero.textContent = formatarNumero(carta);
    // Un clic porta a la mateixa carta a la vista de graella
    funda.addEventListener("click", () => alTriarCarta?.(carta.id));
  } else {
    funda.classList.add("butxaca-funda--buida");
  }

  butxaca.append(funda, numero);
  return butxaca;
}

// Una pàgina de 9 butxaques a partir de la posició "inici" de la llista
function crearPagina(inici) {
  const pagina = document.createElement("div");
  pagina.className = "album-pagina";
  for (let i = 0; i < CARTES_PER_PAGINA; i++) {
    pagina.append(crearButxaca(versio.cards[inici + i]));
  }
  return pagina;
}

// Pinta la doble pàgina oberta, l'indicador i l'estat dels botons ‹ ›
function pintar() {
  if (!versio || !visible) return;
  const llibre = element("album-llibre");
  llibre.innerHTML = "";
  const inici = doble * CARTES_PER_DOBLE;
  llibre.append(crearPagina(inici), crearPagina(inici + CARTES_PER_PAGINA));

  element("album-indicador").textContent = t("album.indicador", {
    primera: doble * 2 + 1,
    segona: doble * 2 + 2,
    total: totalDobles() * 2,
  });
  const anterior = element("album-anterior");
  const seguent = element("album-seguent");
  anterior.disabled = doble === 0;
  seguent.disabled = doble === totalDobles() - 1;
  anterior.setAttribute("aria-label", t("album.anterior"));
  seguent.setAttribute("aria-label", t("album.seguent"));
}

// Passa de doble pàgina (delta = −1 enrere, +1 endavant)
function passarPagina(delta) {
  const nova = doble + delta;
  if (nova < 0 || nova >= totalDobles()) return;
  doble = nova;
  pintar();
}

// ---------- Funcions públiques (les crida main.js) ----------

// Lliga els botons ‹ › i les fletxes del teclat.
// "callbackCarta" es crida amb l'id de la carta que l'usuari clica.
export function iniciarAlbum(callbackCarta) {
  contenidor = element("album");
  alTriarCarta = callbackCarta;
  element("album-anterior").addEventListener("click", () => passarPagina(-1));
  element("album-seguent").addEventListener("click", () => passarPagina(1));
  // Fletxes del teclat: només amb l'àlbum visible i si no s'està escrivint
  document.addEventListener("keydown", (esdeveniment) => {
    if (!visible) return;
    const etiqueta = esdeveniment.target.tagName;
    if (etiqueta === "INPUT" || etiqueta === "SELECT" || etiqueta === "TEXTAREA") return;
    if (esdeveniment.key === "ArrowLeft") passarPagina(-1);
    if (esdeveniment.key === "ArrowRight") passarPagina(1);
  });
}

// Canvi de versió de dades: recorda-la i queda't en una pàgina vàlida
export function carregarAlbum(dades) {
  versio = dades;
  doble = Math.min(doble, totalDobles() - 1);
  pintar();
}

// Mostra o amaga la vista; en mostrar-la sempre es repinta
// (mentre estava amagada la col·lecció o l'idioma poden haver canviat)
export function mostrarAlbum(mostra) {
  visible = mostra;
  contenidor.hidden = !mostra;
  if (mostra) pintar();
}

// Repinta l'àlbum si és visible (canvis de col·lecció o d'idioma)
export function refrescarAlbum() {
  pintar();
}
