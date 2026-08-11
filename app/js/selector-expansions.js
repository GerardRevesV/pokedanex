// selector-expansions.js — el panell per canviar d'expansió ("el Compendi").
//
// Un <dialog> natiu amb la llista d'expansions agrupada per sèrie, cerca
// instantània i el progrés de cada set. El diàleg natiu ja regala el teló,
// la tecla Esc i el focus tancat a dins, sense codi nostre.

import { t, idiomaActual } from "./i18n.js";
import { comptarAmbPrefix } from "./collection.js";
import { temaDe, temaPerSetActiu, canviarTemaPerSet, aplicarTema } from "./temes.js";

// Referències que ens passa main.js en arrencar:
// { sets, setActiu, enTriar } (llista d'expansions, quina és activa, què fer en triar-ne una)
let referencies = null;

const element = (id) => document.getElementById(id);

// ---------- Construcció de la llista ----------

// Una fila del panell: símbol, nom, sèrie + data i progrés de col·lecció
function crearFila(conjunt, idActiu) {
  const fila = document.createElement("button");
  fila.type = "button";
  fila.className = "expansio-fila";
  fila.setAttribute("role", "option");
  fila.dataset.nom = conjunt.name.toLowerCase(); // per a la cerca
  // El filet de color de l'esquerra porta el tema propi del set
  fila.style.setProperty("--tema-set", temaDe(conjunt.id).accent);
  const activa = conjunt.id === idActiu;
  fila.setAttribute("aria-selected", activa ? "true" : "false");
  if (activa) fila.title = t("expansions.activa");

  const simbol = document.createElement("img");
  simbol.className = "expansio-simbol";
  simbol.src = conjunt.images?.symbol ?? "";
  simbol.alt = "";
  simbol.loading = "lazy";

  const info = document.createElement("span");
  info.className = "expansio-info";
  const nom = document.createElement("b");
  nom.textContent = conjunt.name;
  const detall = document.createElement("small");
  const data = new Date(conjunt.releaseDate)
    .toLocaleDateString(idiomaActual(), { dateStyle: "medium" });
  detall.textContent = `${conjunt.series} · ${data}`;
  info.append(nom, detall);

  // Progrés del set: cartes diferents que tens / total del set. Es compta
  // amb el prefix dels ids (ex. "sv6pt5-"), sense carregar les dades del set.
  const tinc = comptarAmbPrefix(conjunt.id + "-");
  const progres = document.createElement("span");
  progres.className = "expansio-progres";
  const pista = document.createElement("span");
  pista.className = "expansio-pista";
  const ple = document.createElement("span");
  ple.className = "expansio-ple";
  const percentatge = conjunt.total > 0
    ? Math.min(100, Math.round((tinc / conjunt.total) * 100))
    : 0;
  ple.style.width = percentatge + "%";
  pista.append(ple);
  const xifres = document.createElement("small");
  xifres.textContent = `${tinc}/${conjunt.total}`;
  progres.append(pista, xifres);

  fila.append(simbol, info, progres);
  fila.addEventListener("click", () => {
    element("selector-expansions").close();
    // Triar l'expansió que ja és activa no ha de recarregar ni repintar res
    if (conjunt.id === referencies.setActiu()) return;
    referencies.enTriar(conjunt.id);
  });
  return fila;
}

// (Re)construeix tota la llista, agrupada per sèrie en l'ordre de sets.json.
// Es refà a cada obertura: així el progrés, l'idioma i la marca d'expansió
// activa sempre estan al dia sense cap comptabilitat extra.
function construirLlista() {
  const { sets, setActiu } = referencies;
  const idActiu = setActiu();
  const grups = new Map(); // sèrie → les seves expansions, en ordre
  for (const conjunt of sets) {
    if (!grups.has(conjunt.series)) grups.set(conjunt.series, []);
    grups.get(conjunt.series).push(conjunt);
  }
  const llista = element("expansions-llista");
  llista.replaceChildren();
  for (const [serie, conjunts] of grups) {
    const grup = document.createElement("section");
    grup.className = "expansions-grup";
    const titol = document.createElement("h3");
    titol.textContent = serie; // el nom de sèrie no es tradueix (nom oficial)
    const cos = document.createElement("div");
    cos.setAttribute("role", "listbox");
    for (const conjunt of conjunts) cos.append(crearFila(conjunt, idActiu));
    grup.append(titol, cos);
    llista.append(grup);
  }
}

// ---------- Cerca ----------

// Amaga les files que no coincideixen amb la cerca (i els grups buits);
// si no en queda cap, mostra el missatge de "cap resultat"
function filtrar() {
  const consulta = element("expansions-cerca").value.trim().toLowerCase();
  let algunaVisible = false;
  for (const grup of element("expansions-llista").querySelectorAll(".expansions-grup")) {
    let visibles = 0;
    for (const fila of grup.querySelectorAll(".expansio-fila")) {
      const passa = !consulta || fila.dataset.nom.includes(consulta);
      fila.hidden = !passa;
      if (passa) visibles++;
    }
    grup.hidden = visibles === 0;
    if (visibles > 0) algunaVisible = true;
  }
  element("expansions-buit").hidden = algunaVisible;
}

// ---------- Obertura i teclat ----------

function obrir() {
  construirLlista();
  const cerca = element("expansions-cerca");
  cerca.value = "";
  filtrar();
  element("selector-expansions").showModal();
  cerca.focus();
}

// Mou el focus a la fila visible següent (+1) o anterior (−1)
function moureFocus(pas) {
  const files = [...element("expansions-llista").querySelectorAll(".expansio-fila")]
    .filter((fila) => !fila.hidden && !fila.closest(".expansions-grup").hidden);
  if (files.length === 0) return;
  const actual = files.indexOf(document.activeElement);
  // Des de la cerca (o enlloc), ↓ va a la primera fila i ↑ a l'última
  const seguent = actual === -1
    ? (pas > 0 ? 0 : files.length - 1)
    : (actual + pas + files.length) % files.length;
  files[seguent].focus();
}

// ---------- Arrencada ----------

export function iniciarSelectorExpansions({ sets, setActiu, enTriar }) {
  referencies = { sets, setActiu, enTriar };
  const dialeg = element("selector-expansions");

  // S'obre amb el logotip de la capçalera o amb Ctrl+K (Cmd+K al Mac)
  element("boto-expansions").addEventListener("click", obrir);
  document.addEventListener("keydown", (esdeveniment) => {
    if (esdeveniment.key.toLowerCase() !== "k") return;
    if (!esdeveniment.ctrlKey && !esdeveniment.metaKey) return;
    esdeveniment.preventDefault(); // que el navegador no obri la seva cerca
    // Amb el zoom de carta obert no obrim el panell (l'Esc els tancaria alhora)
    if (!element("zoom").hidden || dialeg.open) return;
    obrir();
  });

  // Clic al teló (fora de la fitxa). L'objectiu del clic és el mateix dialog
  // també quan es clica el padding interior del panell, així que comprovem
  // les coordenades: només tanquem si el clic cau fora del rectangle visible.
  dialeg.addEventListener("click", (esdeveniment) => {
    if (esdeveniment.target !== dialeg) return;
    const caixa = dialeg.getBoundingClientRect();
    const fora = esdeveniment.clientX < caixa.left || esdeveniment.clientX > caixa.right
      || esdeveniment.clientY < caixa.top || esdeveniment.clientY > caixa.bottom;
    if (fora) dialeg.close();
  });

  // Fletxes ↑/↓ per moure's entre les files visibles (Enter ja és el clic)
  dialeg.addEventListener("keydown", (esdeveniment) => {
    if (esdeveniment.key === "ArrowDown" || esdeveniment.key === "ArrowUp") {
      esdeveniment.preventDefault();
      moureFocus(esdeveniment.key === "ArrowDown" ? 1 : -1);
    }
  });

  element("expansions-cerca").addEventListener("input", filtrar);

  // L'interruptor del tema per expansió: es desa i s'aplica a l'instant
  const interruptor = element("tema-per-set");
  interruptor.checked = temaPerSetActiu();
  interruptor.addEventListener("change", () => {
    canviarTemaPerSet(interruptor.checked);
    aplicarTema(setActiu());
  });
}
