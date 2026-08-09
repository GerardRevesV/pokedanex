// i18n.js — textos de la interfície en tres idiomes.
// Els noms de les cartes NO es tradueixen mai (són les cartes reals, en anglès).

const CLAU_IDIOMA = "pokedanex.lang";
const IDIOMA_DEFECTE = "ca";

const TEXTOS = {
  ca: {
    "idioma.etiqueta": "Idioma",
    "cerca.placeholder": "Cerca per nom o número...",
    "versio.etiqueta": "Versió de les dades",
    "versio.navegador": "navegador",
    "actualitza.boto": "Actualitza dades",
    "actualitza.enCurs": "Actualitzant les dades... pot trigar una mica.",
    "actualitza.fet": "Dades actualitzades correctament.",
    "actualitza.error": "No s'han pogut actualitzar les dades. L'API de pokemontcg.io no respon; torna-ho a provar d'aquí a una estona.",
    "actualitza.senseEspai": "La versió nova es pot consultar, però no s'ha pogut desar al navegador (no hi ha prou espai).",
    "graella.carregant": "Carregant les cartes...",
    "graella.buida": "Cap carta no coincideix amb la cerca.",
    "graella.error": "No s'han pogut carregar les dades de les cartes.",
    "peu.dades": "Dades del {data} · {cartes} cartes · font: pokemontcg.io",
  },
  es: {
    "idioma.etiqueta": "Idioma",
    "cerca.placeholder": "Busca por nombre o número...",
    "versio.etiqueta": "Versión de los datos",
    "versio.navegador": "navegador",
    "actualitza.boto": "Actualizar datos",
    "actualitza.enCurs": "Actualizando los datos... puede tardar un poco.",
    "actualitza.fet": "Datos actualizados correctamente.",
    "actualitza.error": "No se han podido actualizar los datos. La API de pokemontcg.io no responde; vuelve a intentarlo dentro de un rato.",
    "actualitza.senseEspai": "La versión nueva se puede consultar, pero no se ha podido guardar en el navegador (no hay espacio suficiente).",
    "graella.carregant": "Cargando las cartas...",
    "graella.buida": "Ninguna carta coincide con la búsqueda.",
    "graella.error": "No se han podido cargar los datos de las cartas.",
    "peu.dades": "Datos del {data} · {cartes} cartas · fuente: pokemontcg.io",
  },
  en: {
    "idioma.etiqueta": "Language",
    "cerca.placeholder": "Search by name or number...",
    "versio.etiqueta": "Data version",
    "versio.navegador": "browser",
    "actualitza.boto": "Update data",
    "actualitza.enCurs": "Updating data... this may take a moment.",
    "actualitza.fet": "Data updated successfully.",
    "actualitza.error": "Could not update the data. The pokemontcg.io API is not responding; please try again in a while.",
    "actualitza.senseEspai": "The new version can be browsed, but it could not be saved in the browser (not enough space).",
    "graella.carregant": "Loading cards...",
    "graella.buida": "No cards match your search.",
    "graella.error": "Could not load the card data.",
    "peu.dades": "Data from {data} · {cartes} cards · source: pokemontcg.io",
  },
};

// Retorna l'idioma actiu (el desat al navegador, o català per defecte)
export function idiomaActual() {
  const desat = localStorage.getItem(CLAU_IDIOMA);
  return TEXTOS[desat] ? desat : IDIOMA_DEFECTE;
}

// Canvia d'idioma, el recorda al navegador i refresca els textos fixos
export function canviarIdioma(idioma) {
  if (TEXTOS[idioma]) {
    localStorage.setItem(CLAU_IDIOMA, idioma);
  }
  aplicarTextos();
}

// Tradueix una clau. Els valors entre claus ({data}) se substitueixen.
export function t(clau, valors = {}) {
  let text = TEXTOS[idiomaActual()][clau] ?? TEXTOS[IDIOMA_DEFECTE][clau] ?? clau;
  for (const [nom, valor] of Object.entries(valors)) {
    text = text.replace("{" + nom + "}", valor);
  }
  return text;
}

// Omple tots els elements marcats amb data-i18n o data-i18n-placeholder
export function aplicarTextos() {
  document.documentElement.lang = idiomaActual();
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  }
}
