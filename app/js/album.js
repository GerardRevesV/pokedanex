// album.js — vista d'àlbum realista: un carpesà obert amb dues pàgines
// de 3×3 butxaques (18 cartes per doble pàgina), en ordre de col·lecció.
// En mode consulta un clic obre el zoom de la carta; en mode de marcatge
// (markmode.js) el clic esquerre suma i el clic dret resta una còpia.

import { t } from "./i18n.js";
import { enTeCap, comptadors } from "./collection.js";
import { modeActiu, esModeVariant } from "./markmode.js";

const CARTES_PER_PAGINA = 9;  // butxaques 3×3 (estàndard dels àlbums Pokémon)
const CARTES_PER_DOBLE = 18;  // dues pàgines obertes costat a costat

// Estat intern de la vista
let versio = null;       // dades de la versió que es mostra
let doble = 0;           // índex de la doble pàgina oberta (0 = la primera)
let visible = false;     // si l'àlbum s'està veient ara mateix
let contenidor = null;   // el bloc #album de la pàgina
let alTriarCarta = null; // callback amb la carta clicada (mode consulta)
let alMarcar = null;     // callback per marcar una carta (mode variant)

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
    funda.dataset.id = carta.id; // per retrobar la funda després de repintar
    numero.textContent = formatarNumero(carta);

    // Distintiu amb el comptador de la variant activa: el CSS només
    // el mostra en mode de marcatge (l'àlbum es repinta a cada canvi)
    const distintiu = document.createElement("span");
    distintiu.className = "butxaca-comptador";
    if (esModeVariant()) distintiu.textContent = comptadors(carta.id)[modeActiu()];
    funda.append(distintiu);

    // Clic esquerre: en consulta obre el zoom; en mode variant suma
    funda.addEventListener("click", () => {
      if (esModeVariant()) alMarcar?.(carta, +1, funda);
      else alTriarCarta?.(carta);
    });
    // Clic dret: només en mode variant resta una còpia (i s'evita el
    // menú contextual); en consulta el menú del navegador queda intacte
    funda.addEventListener("contextmenu", (esdeveniment) => {
      if (!esModeVariant()) return;
      esdeveniment.preventDefault();
      alMarcar?.(carta, -1, funda);
    });
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
// "callbackCarta" es crida amb la carta clicada en mode consulta;
// "callbackMarcar" es crida amb (carta, delta, node) en mode de marcatge.
export function iniciarAlbum(callbackCarta, callbackMarcar) {
  contenidor = element("album");
  alTriarCarta = callbackCarta;
  alMarcar = callbackMarcar;
  element("album-anterior").addEventListener("click", () => passarPagina(-1));
  element("album-seguent").addEventListener("click", () => passarPagina(1));
  // Fletxes del teclat: només amb l'àlbum visible i si no s'està escrivint
  document.addEventListener("keydown", (esdeveniment) => {
    if (!visible) return;
    // Amb el zoom obert, les fletxes no han de passar pàgines per darrere
    if (!element("zoom").hidden) return;
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
