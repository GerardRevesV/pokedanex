// album.js — vista d'àlbum realista: un carpesà obert amb dues pàgines
// de 3×3 butxaques (18 cartes per doble pàgina), en ordre de col·lecció.
// En mode consulta un clic obre el zoom de la carta; en mode de marcatge
// (markmode.js) el clic esquerre suma i el clic dret resta una còpia.
// Ctrl+clic (Cmd al Mac) obre el zoom sigui quin sigui el mode.

import { t } from "./i18n.js";
import { enTeCap, comptadors } from "./collection.js";
import { modeActiu, esModeVariant } from "./markmode.js";
import { afegirTocLlarg, clicDeTocLlarg } from "./tocllarg.js";

const CARTES_PER_PAGINA = 9;  // butxaques 3×3 (estàndard dels àlbums Pokémon)
const CARTES_PER_DOBLE = 18;  // dues pàgines obertes costat a costat
const MAX_PAGINES_LLISTA = 6; // pàgines que es llisten a la barra abans dels punts

// En pantalles estretes la doble pàgina no hi cap, i en pantalles BAIXES
// (mòbil apaïsat: més de 767px d'amplada però poca alçada) tampoc: es
// mostra UNA sola pàgina per vista (el CSS fa servir el mateix llindar)
const vistaEstreta = window.matchMedia("(max-width: 767px), (max-height: 480px)");
// En pantalles tàctils no hi ha clic dret: restar es fa amb un botonet −
const esTactil = window.matchMedia("(pointer: coarse)");

// Estat intern de la vista
let versio = null;       // dades de la versió que es mostra
let doble = 0;           // índex de la vista oberta (doble pàgina a
                         // escriptori, pàgina sola en pantalla estreta)
let visible = false;     // si l'àlbum s'està veient ara mateix
let contenidor = null;   // el bloc #album de la pàgina
let alTriarCarta = null; // callback amb la carta clicada (mode consulta)
let alMarcar = null;     // callback per marcar una carta (mode variant)
let coincideixCarta = null; // predicat de la cerca i els filtres (null = cap actiu)

const element = (id) => document.getElementById(id);

// Cartes que es veuen alhora: 18 (doble pàgina) o 9 (pàgina sola en mòbil)
function cartesPerVista() {
  return vistaEstreta.matches ? CARTES_PER_PAGINA : CARTES_PER_DOBLE;
}

// Quantes vistes (dobles pàgines o pàgines soles) calen per a totes les cartes
function totalVistes() {
  if (!versio) return 1;
  return Math.max(1, Math.ceil(versio.cards.length / cartesPerVista()));
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
    // Ressaltat de la cerca i els filtres: cap butxaca no desapareix mai,
    // només es distingeixen les cartes que coincideixen de les que no
    if (coincideixCarta) {
      funda.classList.add(
        coincideixCarta(carta) ? "butxaca-funda--coincident" : "butxaca-funda--descartada",
      );
    }
    const imatge = document.createElement("img");
    // lazy i decoding ABANS de src: si s'assignen després, la petició ja
    // ha sortit amb l'estat per defecte (eager) i el lazy no fa res
    imatge.loading = "lazy";
    imatge.decoding = "async";
    imatge.src = carta.images.small;
    imatge.alt = carta.name;
    funda.append(imatge);
    // En mode de marcatge, recordatori que amb Ctrl+clic es veu la carta
    // (en tàctil no hi ha Ctrl: el recordatori seria fals)
    funda.title = esModeVariant() && !esTactil.matches
      ? t("marcar.ajudaZoom") : carta.name;
    funda.dataset.id = carta.id; // per retrobar la funda després de repintar
    numero.textContent = formatarNumero(carta);

    // Distintiu amb el comptador de la variant activa: el CSS només
    // el mostra en mode de marcatge (l'àlbum es repinta a cada canvi)
    const distintiu = document.createElement("span");
    distintiu.className = "butxaca-comptador";
    if (esModeVariant()) distintiu.textContent = comptadors(carta.id)[modeActiu()];
    funda.append(distintiu);

    // Clic esquerre: en consulta obre el zoom; en mode variant suma.
    // Ctrl+clic (Cmd al Mac) obre el zoom en qualsevol mode.
    funda.addEventListener("click", (esdeveniment) => {
      if (esdeveniment.ctrlKey || esdeveniment.metaKey) {
        alTriarCarta?.(carta);
        return;
      }
      // El clic que arriba en aixecar el dit d'un toc llarg no ha de sumar
      if (esModeVariant() && clicDeTocLlarg(funda)) return;
      if (esModeVariant()) alMarcar?.(carta, +1, funda);
      else alTriarCarta?.(carta);
    });
    // En tàctil, un botonet − superposat resta una còpia (no hi ha clic
    // dret amb el dit); el CSS només el mostra en mode de marcatge.
    // I el toc llarg (mig segon quiet) obre el zoom: l'equivalent del
    // Ctrl+clic, que amb el dit no existeix.
    if (esTactil.matches) {
      afegirTocLlarg(funda, () => alTriarCarta?.(carta));
      const resta = document.createElement("button");
      resta.type = "button";
      resta.className = "butxaca-resta";
      resta.textContent = "−";
      resta.setAttribute("aria-label", t("album.restar"));
      resta.addEventListener("click", (esdeveniment) => {
        esdeveniment.stopPropagation(); // que el toc no sumi a la funda
        alMarcar?.(carta, -1, funda);
      });
      funda.append(resta);
    }

    // Clic dret: només en mode variant resta una còpia (i s'evita el
    // menú contextual); en consulta el menú del navegador queda intacte
    funda.addEventListener("contextmenu", (esdeveniment) => {
      if (!esModeVariant()) return;
      // En tàctil, el toc llarg dispara aquest esdeveniment (Android):
      // no ha de restar per accident ni obrir el menú de desar la
      // imatge — per restar ja hi ha el botonet −
      if (esTactil.matches) {
        esdeveniment.preventDefault();
        return;
      }
      // A macOS, Ctrl+clic no arriba com a "click" sinó com a clic dret:
      // ha d'obrir el zoom (com el guard de Ctrl del clic esquerre), no restar
      if (esdeveniment.ctrlKey) {
        esdeveniment.preventDefault();
        alTriarCarta?.(carta);
        return;
      }
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

// Pinta la vista oberta (doble pàgina o pàgina sola), l'indicador
// i l'estat dels botons ‹ ›
function pintar() {
  if (!versio || !visible) return;
  const llibre = element("album-llibre");
  llibre.innerHTML = "";
  const inici = doble * cartesPerVista();
  if (vistaEstreta.matches) {
    // Pantalla estreta: una sola pàgina i l'indicador en singular
    llibre.append(crearPagina(inici));
    element("album-indicador").textContent = t("album.indicadorSola", {
      n: doble + 1,
      total: totalVistes(),
    });
  } else {
    llibre.append(crearPagina(inici), crearPagina(inici + CARTES_PER_PAGINA));
    element("album-indicador").textContent = t("album.indicador", {
      primera: doble * 2 + 1,
      segona: doble * 2 + 2,
      total: totalVistes() * 2,
    });
  }
  const anterior = element("album-anterior");
  const seguent = element("album-seguent");
  anterior.disabled = doble === 0;
  seguent.disabled = doble === totalVistes() - 1;
  anterior.setAttribute("aria-label", t("album.anterior"));
  seguent.setAttribute("aria-label", t("album.seguent"));
  pintarRessaltat();
}

// ---------- Ressaltat de la cerca i els filtres ----------

// Pàgines físiques (de 9 butxaques) que contenen alguna coincidència.
// Les cartes van en ordre, així que n'hi ha prou de comparar amb l'última
// pàgina afegida per no repetir-la.
function paginesAmbCoincidencia() {
  const pagines = [];
  if (!versio || !coincideixCarta) return pagines;
  versio.cards.forEach((carta, posicio) => {
    if (!coincideixCarta(carta)) return;
    const pagina = Math.floor(posicio / CARTES_PER_PAGINA);
    if (pagines.at(-1) !== pagina) pagines.push(pagina);
  });
  return pagines;
}

// Les vistes (dobles pàgines, o pàgines soles en mòbil) que en contenen
function vistesAmbCoincidencia() {
  const vistaDe = (pagina) =>
    vistaEstreta.matches ? pagina : Math.floor(pagina / 2);
  return [...new Set(paginesAmbCoincidencia().map(vistaDe))];
}

// La llista de pàgines tal com es diria: "1, 4, 8" (i un «i més» si
// n'hi ha massa, perquè la barra no es faci inacabable)
function formatarPagines(pagines) {
  const llista = pagines
    .slice(0, MAX_PAGINES_LLISTA)
    .map((pagina) => pagina + 1)
    .join(", ");
  return pagines.length > MAX_PAGINES_LLISTA ? llista + "…" : llista;
}

// La barra de coincidències: quantes n'hi ha, a quines pàgines, i si
// queda alguna coincidència amunt o avall per a les seves fletxes
function pintarRessaltat() {
  const barra = element("album-ressaltat");
  barra.hidden = !coincideixCarta;
  if (!coincideixCarta) return;
  const pagines = paginesAmbCoincidencia();
  const total = versio.cards.filter((carta) => coincideixCarta(carta)).length;
  element("album-ressaltat-text").textContent =
    total === 0 ? t("album.ressaltatCap")
    : total === 1 ? t("album.ressaltatUna", { pagines: formatarPagines(pagines) })
    : t("album.ressaltat", { n: total, pagines: formatarPagines(pagines) });
  const vistes = vistesAmbCoincidencia();
  const anterior = element("coincidencia-anterior");
  const seguent = element("coincidencia-seguent");
  anterior.disabled = !vistes.some((vista) => vista < doble);
  seguent.disabled = !vistes.some((vista) => vista > doble);
  anterior.setAttribute("aria-label", t("album.coincidenciaAnterior"));
  seguent.setAttribute("aria-label", t("album.coincidenciaSeguent"));
}

// Salta a la vista següent (o anterior) que tingui alguna coincidència
function anarACoincidencia(delta) {
  const vistes = vistesAmbCoincidencia();
  const desti = delta > 0
    ? vistes.find((vista) => vista > doble)
    : vistes.filter((vista) => vista < doble).at(-1);
  if (desti === undefined) return;
  doble = desti;
  pintar();
}

// Passa de vista (delta = −1 enrere, +1 endavant)
function passarPagina(delta) {
  const nova = doble + delta;
  if (nova < 0 || nova >= totalVistes()) return;
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
  // Fletxes de la barra de coincidències (salten de coincidència en coincidència)
  element("coincidencia-anterior").addEventListener("click", () => anarACoincidencia(-1));
  element("coincidencia-seguent").addEventListener("click", () => anarACoincidencia(1));
  // Si la pantalla creua el llindar (girar el mòbil, canviar la finestra),
  // convertim l'índex perquè es continuï veient la mateixa zona de l'àlbum
  vistaEstreta.addEventListener("change", (esdeveniment) => {
    doble = esdeveniment.matches ? doble * 2 : Math.floor(doble / 2);
    doble = Math.min(doble, totalVistes() - 1);
    pintar();
  });
  // En tàctil, lliscar el dit (swipe) sobre el llibre passa pàgina: el
  // gest natural en un àlbum. Cal que el moviment sigui clarament
  // horitzontal (el vertical és scroll) i prou llarg (48px).
  if (esTactil.matches) {
    const llibre = element("album-llibre");
    let iniciGest = null;   // posició del dit en començar el gest
    let momentSwipe = 0;    // quan s'ha completat l'últim swipe
    llibre.addEventListener("pointerdown", (esdeveniment) => {
      iniciGest = { x: esdeveniment.clientX, y: esdeveniment.clientY };
    });
    llibre.addEventListener("pointerup", (esdeveniment) => {
      if (!iniciGest) return;
      const deltaX = esdeveniment.clientX - iniciGest.x;
      const deltaY = esdeveniment.clientY - iniciGest.y;
      iniciGest = null;
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > 2 * Math.abs(deltaY)) {
        momentSwipe = Date.now();
        passarPagina(deltaX < 0 ? 1 : -1); // dit cap a l'esquerra = endavant
      }
    });
    llibre.addEventListener("pointercancel", () => { iniciGest = null; });
    // El clic residual que el navegador pot disparar en acabar el gest
    // no ha d'arribar a cap funda (en mode de marcatge sumaria una còpia)
    llibre.addEventListener("click", (esdeveniment) => {
      if (Date.now() - momentSwipe < 400) {
        esdeveniment.stopPropagation();
        esdeveniment.preventDefault();
      }
    }, true);
  }

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
  doble = Math.min(doble, totalVistes() - 1);
  pintar();
}

// Mostra o amaga la vista; en mostrar-la sempre es repinta
// (mentre estava amagada la col·lecció o l'idioma poden haver canviat)
export function mostrarAlbum(mostra) {
  visible = mostra;
  contenidor.hidden = !mostra;
  if (mostra) pintar();
}

// Repinta l'àlbum si és visible (canvis de mode, d'idioma o de pàgina)
export function refrescarAlbum() {
  pintar();
}

// main.js hi passa un predicat quan la cerca o algun filtre estan actius,
// i null quan no n'hi ha cap. Si la vista oberta no té cap coincidència,
// l'àlbum salta a la primera que en tingui: és el "porta'm on són" que
// a l'àlbum substitueix el filtrar (no existeix «la pàgina» d'un tipus:
// cada tipus surt al bloc del set base i una altra vegada a les
// cartes especials del final).
export function ressaltarAlbum(predicat) {
  coincideixCarta = predicat;
  if (versio && predicat) {
    const vistes = vistesAmbCoincidencia();
    if (vistes.length > 0 && !vistes.includes(doble)) doble = vistes[0];
  }
  pintar();
}

// Actualització EN LLOC quan només canvia la col·lecció: es refan l'estat
// apagat i el distintiu de cada butxaca sense reconstruir la pàgina (el
// mateix patró que la graella a main.js). Repintar-ho tot recreava 9-18
// <img> a cada toc de marcar, amb layout i pintat sencers de l'àlbum.
export function actualitzarButxaques() {
  if (!versio || !visible) return;
  const enModeVariant = esModeVariant();
  for (const funda of contenidor.querySelectorAll(".butxaca-funda[data-id]")) {
    const id = funda.dataset.id;
    funda.classList.toggle("butxaca-funda--pendent", !enTeCap(id));
    if (enModeVariant) {
      const distintiu = funda.querySelector(".butxaca-comptador");
      if (distintiu) distintiu.textContent = comptadors(id)[modeActiu()];
    }
  }
}
