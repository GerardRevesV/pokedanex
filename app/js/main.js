// main.js — la interfície: pinta la graella, el cercador i lliga els mòduls.

import { t, idiomaActual, canviarIdioma, aplicarTextos } from "./i18n.js";
import {
  carregarSets, setActiu, setActiuDesat, canviarSetActiu,
  carregarLlistaVersions, carregarVersio, actualitzarDades,
} from "./data.js";
import { variantsDisponibles, preuVariant } from "./variants.js";
import {
  comptadors, ajustar, enTeCap, subscriure,
  exportarJson, importarJson, buidar,
} from "./collection.js";
import {
  iniciarAlbum, carregarAlbum, mostrarAlbum, refrescarAlbum, actualitzarButxaques,
} from "./album.js";
import { iniciarSelectorExpansions } from "./selector-expansions.js";
import { aplicarTema } from "./temes.js";
import { iniciarEstadistiques, carregarEstadistiques, refrescarEstadistiques } from "./stats.js";
import { modeActiu, canviarMode, esModeVariant } from "./markmode.js";
import { afegirTocLlarg, clicDeTocLlarg } from "./tocllarg.js";
import { magatzem } from "./storage.js";

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
  "marcar.senseVariant", "marcar.ajudaTocLlarg",
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

// Preu orientatiu d'una carta: el de la variant normal o, si no en té,
// el de la primera variant amb preu conegut; null si cap en té
function preuCarta(carta) {
  const normal = preuVariant(carta, "normal");
  if (normal !== null) return normal;
  for (const variant of variantsDisponibles(carta)) {
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

function pintarGraella() {
  const graella = element("graella");
  graella.innerHTML = "";
  if (!versioActiva) return;

  const consulta = element("cercador").value.trim().toLowerCase();
  // filter retorna un array nou, així el sort no toca l'ordre original de
  // versioActiva.cards (l'àlbum i les estadístiques en depenen)
  const visibles = versioActiva.cards.filter(
    (carta) =>
      coincideix(carta, consulta) &&
      passaFiltreColleccio(carta) &&
      passaFiltresDesplegables(carta),
  ).sort(COMPARADORS[ordreGraella]);

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
    // En mode de marcatge, recordatori que amb Ctrl+clic es veu la carta
    // (en tàctil no: no hi ha Ctrl, i el title tampoc no es veuria)
    if (esModeVariant() && !esTactil.matches) fitxa.title = t("marcar.ajudaZoom");

    const imatge = document.createElement("img");
    imatge.className = "carta-imatge";
    // lazy i decoding ABANS de src: si s'assignen després, la petició ja
    // ha sortit amb l'estat per defecte (eager) i el lazy no fa res
    imatge.loading = "lazy";
    imatge.decoding = "async";
    imatge.src = carta.images.small;
    imatge.alt = carta.name;
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

    // Preu orientatiu de Cardmarket; si no se'n coneix cap, un guió
    // amb l'explicació en passar-hi el ratolí per sobre
    const preu = preuCarta(carta);
    const espaiPreu = document.createElement("span");
    espaiPreu.className = "carta-preu";
    if (preu !== null) {
      espaiPreu.textContent = formatarPreu(preu);
    } else {
      espaiPreu.textContent = "—";
      espaiPreu.title = t("carta.sensePreu");
    }
    info.append(espaiPreu);

    info.append(crearPastillesTipus(carta));

    fitxa.append(imatge, info, crearControlsVariants(carta));

    // Mode de marcatge: clic esquerre suma i clic dret resta una còpia
    // de la variant activa. Els botons +/− queden fora (van per si sols).
    fitxa.addEventListener("click", (esdeveniment) => {
      if (!esModeVariant()) return;
      // Ctrl+clic (Cmd al Mac): obre el zoom en lloc de marcar.
      // (Els botons +/− aturen la propagació, però fan el mateix guard.)
      if (esdeveniment.ctrlKey || esdeveniment.metaKey) {
        obrirZoom(carta);
        return;
      }
      // En tàctil, un toc dins del bloc de variants que no encerta cap
      // botó (el número, el nom, l'espai entre files) no fa res: si
      // arribés a la fitxa sumaria una còpia de la variant del MODE
      // actiu, que pot no ser la de la fila on s'apuntava
      if (esTactil.matches && esdeveniment.target.closest(".variants")) return;
      if (esdeveniment.target.closest(".boto-comptador")) return;
      // El clic que arriba en aixecar el dit d'un toc llarg no ha de sumar
      if (clicDeTocLlarg(fitxa)) return;
      marcarCarta(carta, +1, fitxa);
    });
    // En tàctil, el toc llarg (mig segon quiet) obre el zoom en mode de
    // marcatge: l'equivalent del Ctrl+clic, que amb el dit no existeix
    if (esTactil.matches) afegirTocLlarg(fitxa, () => obrirZoom(carta));
    fitxa.addEventListener("contextmenu", (esdeveniment) => {
      if (!esModeVariant()) return; // en consulta, menú del navegador intacte
      // En tàctil, el toc llarg dispara aquest esdeveniment (Android): no
      // ha de restar per accident — per restar hi ha els botons − de sota
      if (esTactil.matches) {
        esdeveniment.preventDefault();
        return;
      }
      // A macOS, Ctrl+clic no arriba com a "click" sinó com a clic dret:
      // ha d'obrir el zoom (com el guard de Ctrl del clic esquerre), no restar
      if (esdeveniment.ctrlKey) {
        esdeveniment.preventDefault();
        obrirZoom(carta);
        return;
      }
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

// Botó − o + d'una variant: un sol clic ajusta el comptador.
// Ctrl+clic (Cmd al Mac) no marca mai: fora del zoom obre la carta;
// dins del zoom (que ja és obert) no fa res.
function crearBotoComptador(carta, variant, delta, simbol) {
  const boto = document.createElement("button");
  boto.type = "button";
  boto.className = "boto-comptador";
  boto.textContent = simbol;
  boto.addEventListener("click", (esdeveniment) => {
    esdeveniment.stopPropagation(); // que el clic no arribi a la carta
    if (esdeveniment.ctrlKey || esdeveniment.metaKey) {
      if (!boto.closest("#zoom")) obrirZoom(carta);
      return;
    }
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
    node.title = t("marcar.senseVariant", { variant: t("variant." + variant) });
    // En tàctil el title no es veu mai: el motiu es mostra també com a
    // missatge d'estat (mostrarMissatge ja l'amaga sol al cap d'un moment)
    if (esTactil.matches) {
      mostrarMissatge("marcar.senseVariant", true, { variant: t("variant." + variant) });
    }
    node.classList.add("carta--sacseig");
    setTimeout(() => {
      node.classList.remove("carta--sacseig");
      // No restaurem el títol antic a cegues: el mode pot haver canviat
      // durant el sacseig. El recalculem segons l'estat d'ara.
      if (esModeVariant() && !esTactil.matches) {
        node.title = t("marcar.ajudaZoom");
      } else if (node.classList.contains("butxaca-funda")) {
        node.title = carta.name; // la funda sempre mostra el nom en consulta
      } else {
        node.removeAttribute("title"); // la fitxa no en porta en consulta
      }
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
    // amagada també té la carta i no és la que s'ha de fer brillar.
    // CSS.escape protegeix el selector si l'id portés caràcters especials
    const selector = node.classList.contains("butxaca-funda")
      ? `.butxaca-funda[data-id="${CSS.escape(carta.id)}"]`
      : `.carta[data-id="${CSS.escape(carta.id)}"]`;
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
  // La graella no es repinta en canviar de mode: posem o traiem en lloc
  // el recordatori del Ctrl+clic de cada fitxa (l'àlbum sí que es repinta).
  // En tàctil el recordatori seria fals (no hi ha Ctrl): no es posa mai.
  const ajudaZoom = esModeVariant() && !esTactil.matches ? t("marcar.ajudaZoom") : "";
  for (const fitxa of element("graella").querySelectorAll(".carta")) {
    if (ajudaZoom) fitxa.title = ajudaZoom;
    else fitxa.removeAttribute("title");
  }
  // En tàctil, el toc llarg (l'equivalent del Ctrl+clic) no es veu enlloc:
  // en entrar en un mode de marcatge, una pista flotant l'anuncia
  // (mostrarMissatge l'amaga sol al cap d'un moment)
  if (esModeVariant() && esTactil.matches) {
    mostrarMissatge("marcar.ajudaTocLlarg");
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
  // Si el zoom és obert, els seus comptadors també s'actualitzen en viu
  if (!element("zoom").hidden && cartaZoom) {
    const valors = comptadors(cartaZoom.id);
    for (const valor of element("zoom-variants").querySelectorAll(".comptador-valor")) {
      pintarComptador(valor, valors[valor.dataset.variant]);
    }
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

// Textos del zoom que canvien amb l'idioma: l'aria-label del × i, si el
// zoom és obert, les files de variants (es refan amb els noms traduïts)
function traduirZoom() {
  element("zoom-tancar").setAttribute("aria-label", t("zoom.tancar"));
  if (!element("zoom").hidden && cartaZoom) {
    element("zoom-variants").replaceChildren(crearControlsVariants(cartaZoom));
  }
}

// Obre la finestra de zoom d'una carta: imatge gran + fitxa marcable
function obrirZoom(carta) {
  cartaZoom = carta;
  element("zoom-numero").textContent = formatarNumero(carta);
  element("zoom-nom").textContent = carta.name;
  element("zoom-raresa").textContent = carta.rarity ?? "";
  // Les mateixes files de comptadors − N + que té la carta a la graella
  element("zoom-variants").replaceChildren(crearControlsVariants(carta));

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
  cartaZoom = null;
  peticioZoom++; // descarta la imatge gran si encara estava carregant
  // Si la imatge gran encara carregava, netegem l'estat de càrrega
  element("zoom-imatge").classList.remove("zoom-imatge--carregant");
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

// ---------- Mode de visualització (col·lecció / catàleg) ----------

// Aplica un mode de visualització: "colleccio" (les cartes pendents es
// veuen apagades) o "cataleg" (totes a color, amb marc daurat a les
// tingudes). Tot el canvi visual és CSS condicionat per l'atribut del
// body (mateix patró que el mode de marcatge); aquí només es posa
// l'atribut, es marca el botó actiu i es recorda la tria al navegador.
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
  pintarGraella();
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
  const set = setActiu(); // capturat un cop: l'expansió podria canviar mentre baixem
  boto.disabled = true;
  mostrarMissatge("actualitza.enCurs");

  // Primer pas: baixar les dades de l'API (l'única part que pot fallar per culpa de l'API)
  let resultat = null;
  try {
    resultat = await actualitzarDades(set);
  } catch {
    mostrarMissatge("actualitza.error", true);
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
      pintarGraella();
      return;
    }
    clearTimeout(temporitzadorCerca);
    temporitzadorCerca = setTimeout(pintarGraella, 150);
  });

  // En tàctil, el missatge flotant es pot tancar amb un toc (els estats
  // de càrrega no: desapareixen sols quan la feina acaba)
  element("missatge").addEventListener("click", () => {
    if (!esTactil.matches || !missatgeActual) return;
    if (missatgeActual.clau === "actualitza.enCurs") return;
    if (missatgeActual.clau === "graella.carregant") return;
    amagarMissatge();
  });

  // Botó "Filtres i opcions" (només es veu en mòbil, el CSS l'amaga a
  // escriptori): plega i desplega el gruix de controls de la capçalera
  element("boto-filtres").addEventListener("click", () => {
    const obert = element("bloc-filtres").classList.toggle("bloc-filtres--obert");
    element("boto-filtres").setAttribute("aria-expanded", obert ? "true" : "false");
  });

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

  // Selector d'ordenació: canvia el criteri i repinta la graella
  element("ordre-graella").addEventListener("change", (esdeveniment) => {
    ordreGraella = esdeveniment.target.value;
    pintarGraella();
  });

  // Zoom d'imatge gran: es tanca amb clic fora, botó × o tecla Escape
  traduirZoom();
  element("zoom").addEventListener("click", (esdeveniment) => {
    if (esdeveniment.target === element("zoom")) tancarZoom();
  });
  element("zoom-tancar").addEventListener("click", tancarZoom);
  document.addEventListener("keydown", (esdeveniment) => {
    if (esdeveniment.key === "Escape") tancarZoom(); // no fa res si ja és tancat
    // Amb el zoom obert, Tab no ha de sortir del diàleg (els controls de
    // darrere l'overlay no s'han de poder tocar): cicla entre els botons
    // de la fitxa (×, − i + de cada variant, "Veure a la graella")
    if (esdeveniment.key === "Tab" && !element("zoom").hidden) {
      esdeveniment.preventDefault();
      const botons = [...element("zoom").querySelectorAll("button")];
      const actual = botons.indexOf(document.activeElement);
      const pas = esdeveniment.shiftKey ? -1 : 1;
      // Si el focus s'ha perdut (actual = −1), tornem al primer botó
      const seguent = actual === -1 ? 0 : (actual + pas + botons.length) % botons.length;
      botons[seguent]?.focus();
    }
  });

  // El zoom es pot obrir en qualsevol mode (en consulta amb un clic; en
  // els modes de marcatge amb Ctrl+clic). Dins del zoom, el marcatge es
  // fa sempre amb els botons − i + de cada variant, mai clicant la imatge

  // Botó "Veure a la graella": tanca el zoom i ensenya la carta ressaltada
  element("zoom-graella").addEventListener("click", () => {
    if (!cartaZoom) return;
    const id = cartaZoom.id; // tancarZoom esborra cartaZoom: el desem abans
    tancarZoom();
    anarACartaDeLaGraella(id);
  });

  // Panell d'estadístiques: plegat i objectiu de compleció
  iniciarEstadistiques();

  // Mode de marcatge amb clics: consulta o variant (es recorda al navegador)
  element("mode-marcatge").addEventListener("click", (esdeveniment) => {
    const boto = esdeveniment.target.closest("button[data-mode]");
    if (boto) aplicarModeMarcatge(boto.dataset.mode);
  });
  aplicarModeMarcatge(modeActiu());

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
  // En mode consulta, clicar una butxaca obre el zoom de la carta
  // (des del zoom, el botó "Veure a la graella" fa el salt d'abans).
  iniciarAlbum(obrirZoom, marcarCarta);
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
