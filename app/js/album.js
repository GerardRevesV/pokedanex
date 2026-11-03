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

// Pinta la vista oberta (doble pàgina o pàgina sola) i el seu indicador
function pintar() {
  if (!versio || !visible) return;
  tancarGir(true); // si hi havia un full a mig girar, manda aquest repintat
  const llibre = element("album-llibre");
  llibre.innerHTML = "";
  const inici = doble * cartesPerVista();
  // Pantalla estreta: una sola pàgina (el CSS fa servir el mateix llindar)
  if (vistaEstreta.matches) llibre.append(crearPagina(inici));
  else llibre.append(crearPagina(inici), crearPagina(inici + CARTES_PER_PAGINA));
  pintarIndicador();
}

// L'indicador de pàgines i l'estat dels botons ‹ ›. Va a part de pintar()
// perquè en passar pàgina el número ha de canviar de seguida, mentre el
// full encara volta.
function pintarIndicador() {
  if (!versio) return;
  element("album-indicador").textContent = vistaEstreta.matches
    ? t("album.indicadorSola", { n: doble + 1, total: totalVistes() })
    : t("album.indicador", {
        primera: doble * 2 + 1,
        segona: doble * 2 + 2,
        total: totalVistes() * 2,
      });
  const anterior = element("album-anterior");
  const seguent = element("album-seguent");
  anterior.disabled = doble === 0;
  seguent.disabled = doble === totalVistes() - 1;
  anterior.setAttribute("aria-label", t("album.anterior"));
  seguent.setAttribute("aria-label", t("album.seguent"));
}

// Passa de vista (delta = −1 enrere, +1 endavant) girant el full
function passarPagina(delta) {
  const nova = doble + delta;
  if (nova < 0 || nova >= totalVistes()) return;
  // Un full que encara volta s'assenta de cop: així dues passades
  // seguides (clics ràpids, fletxa mantinguda) no s'encavalquen
  tancarGir(false);
  const velles = [...element("album-llibre").children];
  const mides = mesurarFull(velles); // null si el gir no toca o no es pot fer
  doble = nova;
  pintarIndicador();
  if (!mides) {
    pintar(); // canvi sec, com abans del gir
    return;
  }
  try {
    girarFull(delta > 0, velles, mides);
  } catch (error) {
    // Si el full no es pot muntar, el canvi de pàgina s'ha de veure igual
    console.warn("[àlbum] no s'ha pogut girar el full:", error);
    tancarGir(true);
    pintar();
  }
}

// ---------- El gir del full (l'efecte de llibre en passar pàgina) ----------
// En passar pàgina el carpesà no es repinta de cop: es munta un "full" per
// sobre, amb la pàgina vella en una cara i la nova a l'altra, i es fa
// voltar sobre el llom amb CSS 3D. Les pàgines que no volten ja són les
// definitives, i en acabar el gir el full s'assenta al seu lloc sense
// repintar res (les imatges no es tornen a crear).

const DURADA_GIR = 520; // ms: prou per veure el paper, prou poc per no esperar
const CORBA_GIR = "cubic-bezier(0.45, 0.05, 0.3, 1)"; // arrenca viu, aterra suau

// Preferència d'accessibilitat del sistema: amb la reducció de moviment
// activada no es gira res (el canvi de pàgina es fa sec)
const reduirMoviment = window.matchMedia("(prefers-reduced-motion: reduce)");

let girActual = null; // { full, animacions, assentar } mentre un full volta

// Mesures del full que ha de girar, preses amb les pàgines encara al seu
// lloc. Retorna null si el gir no toca o no es pot fer: aleshores el canvi
// de pàgina es fa sec, exactament com abans.
function mesurarFull(velles) {
  if (reduirMoviment.matches) return null;
  if (typeof Element.prototype.animate !== "function") return null;
  const dues = !vistaEstreta.matches; // doble pàgina o pàgina sola
  // El llibre ha d'estar tal com l'esperem: dues pàgines o una de sola
  if (velles.length !== (dues ? 2 : 1)) return null;
  const model = dues ? velles[1] : velles[0]; // la pàgina que farà de full
  if (!model.offsetWidth || !model.offsetHeight) return null;
  return {
    dues,
    x: model.offsetLeft,
    y: model.offsetTop,
    ample: model.offsetWidth,
    alt: model.offsetHeight,
    // L'eix del gir: el llom del carpesà (el mig del buit entre les dues
    // pàgines obertes) a escriptori; el centre del full en pàgina sola
    eix: dues
      ? `${(velles[0].offsetLeft + velles[0].offsetWidth + model.offsetLeft) / 2 - model.offsetLeft}px center`
      : "center",
  };
}

// Converteix una pàgina en una cara del full i li posa el vel d'ombra (que
// retorna) perquè el paper sembli entrar i sortir de la llum
function muntarCara(pagina, darrere) {
  pagina.classList.add(
    "album-full-cara",
    darrere ? "album-full-cara--darrere" : "album-full-cara--davant",
  );
  const ombra = document.createElement("div");
  ombra.className = "album-full-ombra";
  pagina.append(ombra);
  return ombra;
}

// Torna la cara a ser una pàgina normal del carpesà
function desmuntarCara(cara) {
  cara.classList.remove(
    "album-full-cara",
    "album-full-cara--davant",
    "album-full-cara--darrere",
  );
  cara.querySelector(".album-full-ombra")?.remove();
  return cara;
}

// Munta el full i engega el gir. "velles" són les pàgines que hi havia al
// llibre i "doble" ja apunta a la vista NOVA.
function girarFull(endavant, velles, mides) {
  const llibre = element("album-llibre");
  const inici = doble * cartesPerVista();
  // Les pàgines de la vista nova (la segona només a doble pàgina)
  const novaPrimera = crearPagina(inici);
  const novaSegona = mides.dues ? crearPagina(inici + CARTES_PER_PAGINA) : null;

  // Qui es queda al carpesà i qui fa de full:
  //  · endavant, el full és la pàgina dreta vella: cau cap a l'esquerra
  //    ensenyant pel darrere la nova pàgina esquerra, i mentre s'aixeca
  //    apareix a sota la nova pàgina dreta;
  //  · enrere, el full torna de l'esquerra a la dreta amb la nova pàgina
  //    dreta al davant i la vella esquerra al darrere.
  // "ranura" és la pàgina del carpesà que el full acabarà substituint.
  let ranura;
  let caraDavant;
  let caraDarrere;
  if (mides.dues) {
    ranura = endavant ? velles[0] : velles[1];
    llibre.replaceChildren(
      endavant ? ranura : novaPrimera,
      endavant ? novaSegona : ranura,
    );
    caraDavant = endavant ? velles[1] : novaSegona;
    caraDarrere = endavant ? novaPrimera : velles[0];
  } else {
    // Pàgina sola: el full volta sobre el seu centre i a sota es deixa una
    // pàgina de butxaques buides invisible, perquè el carpesà no
    // s'encongeixi mentre volta l'única pàgina que hi havia
    ranura = crearPagina(versio.cards.length); // cap carta: totes buides
    ranura.classList.add("album-pagina--mida");
    ranura.style.height = `${mides.alt}px`; // clavada a la pàgina de debò
    llibre.replaceChildren(ranura);
    caraDavant = endavant ? velles[0] : novaPrimera;
    caraDarrere = endavant ? novaPrimera : velles[0];
  }
  // La cara amb el contingut nou és la que es quedarà al carpesà
  const caraNova = endavant ? caraDarrere : caraDavant;

  const full = document.createElement("div");
  full.className = "album-full";
  full.style.left = `${mides.x}px`;
  full.style.top = `${mides.y}px`;
  full.style.width = `${mides.ample}px`;
  full.style.height = `${mides.alt}px`;
  full.style.transformOrigin = mides.eix;
  const ombraDavant = muntarCara(caraDavant, false);
  const ombraDarrere = muntarCara(caraDarrere, true);
  full.append(caraDavant, caraDarrere);
  llibre.append(full);
  llibre.classList.add("album-llibre--girant");

  // Enrere és el mateix gir del revés (direction: "reverse"): així les
  // tres animacions van sempre sincronitzades
  const comu = {
    duration: DURADA_GIR,
    easing: CORBA_GIR,
    fill: "both",
    direction: endavant ? "normal" : "reverse",
  };
  const gir = {
    full,
    animacions: [
      full.animate(
        [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }],
        comu,
      ),
      // La cara de davant s'enfosqueix en aixecar-se i la de darrere
      // s'aclareix en ajeure's: és l'ombra la que fa que sembli paper
      ombraDavant.animate([{ opacity: 0 }, { opacity: 0.85 }], comu),
      ombraDarrere.animate([{ opacity: 0.85 }, { opacity: 0 }], comu),
    ],
    assentar() {
      ranura.replaceWith(desmuntarCara(caraNova));
    },
  };
  girActual = gir;
  Promise.all(gir.animacions.map((animacio) => animacio.finished))
    .then(() => {
      if (girActual === gir) tancarGir(false);
    })
    .catch(() => {}); // cancel·lar el gir rebutja la promesa: ja està tractat
}

// Talla el gir en curs i deixa el llibre a la vista nova. Amb "descartar"
// només es treu el full: qui ho demana ja repinta tot el carpesà.
function tancarGir(descartar) {
  const gir = girActual;
  if (!gir) return;
  girActual = null;
  for (const animacio of gir.animacions) animacio.cancel();
  if (!descartar) gir.assentar();
  gir.full.remove();
  element("album-llibre").classList.remove("album-llibre--girant");
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
  // Si s'amaga a mig gir, el full s'assenta al seu lloc de seguida
  if (!mostra) tancarGir(false);
  if (mostra) pintar();
}

// Repinta l'àlbum si és visible (canvis de mode, d'idioma o de pàgina)
export function refrescarAlbum() {
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
