// i18n.js — textos de la interfície en tres idiomes.
// Els noms de les cartes NO es tradueixen mai (són les cartes reals, en anglès).

import { magatzem } from "./storage.js";

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
    "filtre.etiqueta": "Col·lecció",
    "filtre.totes": "Totes",
    "filtre.tinc": "Les tinc",
    "filtre.falten": "Em falten",
    "variant.normal": "normal",
    "variant.reverse": "reverse",
    "variant.holo": "holo",
    "colleccio.total": "{tinc} de {total} cartes",
    "colleccio.exportar": "Exportar",
    "colleccio.importar": "Importar",
    "colleccio.buidar": "Buidar",
    "colleccio.buidarConfirma": "Segur que vols buidar tota la col·lecció? Aquesta acció no es pot desfer.",
    "colleccio.importada": "Col·lecció importada correctament.",
    "colleccio.importError": "No s'ha pogut importar: el fitxer no és una còpia vàlida de la col·lecció.",
    "colleccio.senseEspai": "El canvi es veu, però no s'ha pogut desar al navegador (no hi ha prou espai).",
    "vista.etiqueta": "Vista",
    "vista.graella": "Graella",
    "vista.album": "Àlbum",
    "album.indicador": "Pàgines {primera}-{segona} de {total}",
    "album.anterior": "Doble pàgina anterior",
    "album.seguent": "Doble pàgina següent",
    "estad.titol": "Estadístiques de la col·lecció",
    "estad.objectiu": "Objectiu de compleció",
    "estad.setBase": "Set base ({total} cartes)",
    "estad.setComplet": "Set complet ({total} cartes)",
    "estad.ambReverses": "Comptar les reverse holo",
    "estad.progresBase": "Set base",
    "estad.progresComplet": "Set complet",
    "estad.progresReverses": "Reverse holo",
    "estad.valor": "La teva col·lecció val",
    "estad.cost": "Completar-la costaria",
    "estad.preusData": "preus del {data}",
    "estad.sensePreu": "cartes sense preu: {n}",
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
    "filtre.etiqueta": "Colección",
    "filtre.totes": "Todas",
    "filtre.tinc": "Las tengo",
    "filtre.falten": "Me faltan",
    "variant.normal": "normal",
    "variant.reverse": "reverse",
    "variant.holo": "holo",
    "colleccio.total": "{tinc} de {total} cartas",
    "colleccio.exportar": "Exportar",
    "colleccio.importar": "Importar",
    "colleccio.buidar": "Vaciar",
    "colleccio.buidarConfirma": "¿Seguro que quieres vaciar toda la colección? Esta acción no se puede deshacer.",
    "colleccio.importada": "Colección importada correctamente.",
    "colleccio.importError": "No se ha podido importar: el archivo no es una copia válida de la colección.",
    "colleccio.senseEspai": "El cambio se ve, pero no se ha podido guardar en el navegador (no hay espacio suficiente).",
    "vista.etiqueta": "Vista",
    "vista.graella": "Cuadrícula",
    "vista.album": "Álbum",
    "album.indicador": "Páginas {primera}-{segona} de {total}",
    "album.anterior": "Doble página anterior",
    "album.seguent": "Doble página siguiente",
    "estad.titol": "Estadísticas de la colección",
    "estad.objectiu": "Objetivo de compleción",
    "estad.setBase": "Set base ({total} cartas)",
    "estad.setComplet": "Set completo ({total} cartas)",
    "estad.ambReverses": "Contar las reverse holo",
    "estad.progresBase": "Set base",
    "estad.progresComplet": "Set completo",
    "estad.progresReverses": "Reverse holo",
    "estad.valor": "Tu colección vale",
    "estad.cost": "Completarla costaría",
    "estad.preusData": "precios del {data}",
    "estad.sensePreu": "cartas sin precio: {n}",
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
    "filtre.etiqueta": "Collection",
    "filtre.totes": "All",
    "filtre.tinc": "Owned",
    "filtre.falten": "Missing",
    "variant.normal": "normal",
    "variant.reverse": "reverse",
    "variant.holo": "holo",
    "colleccio.total": "{tinc} of {total} cards",
    "colleccio.exportar": "Export",
    "colleccio.importar": "Import",
    "colleccio.buidar": "Clear",
    "colleccio.buidarConfirma": "Are you sure you want to clear your whole collection? This cannot be undone.",
    "colleccio.importada": "Collection imported successfully.",
    "colleccio.importError": "Could not import: the file is not a valid collection backup.",
    "colleccio.senseEspai": "The change is visible, but it could not be saved in the browser (not enough space).",
    "vista.etiqueta": "View",
    "vista.graella": "Grid",
    "vista.album": "Album",
    "album.indicador": "Pages {primera}-{segona} of {total}",
    "album.anterior": "Previous spread",
    "album.seguent": "Next spread",
    "estad.titol": "Collection statistics",
    "estad.objectiu": "Completion goal",
    "estad.setBase": "Base set ({total} cards)",
    "estad.setComplet": "Full set ({total} cards)",
    "estad.ambReverses": "Count reverse holos",
    "estad.progresBase": "Base set",
    "estad.progresComplet": "Full set",
    "estad.progresReverses": "Reverse holo",
    "estad.valor": "Your collection is worth",
    "estad.cost": "Completing it would cost",
    "estad.preusData": "prices from {data}",
    "estad.sensePreu": "cards without a price: {n}",
  },
};

// Còpia en memòria de l'idioma triat: si el navegador no pot desar,
// el canvi d'idioma funciona igualment mentre la pàgina és oberta
let idiomaTriat = null;

// Retorna l'idioma actiu (el triat, el desat al navegador, o català per defecte)
export function idiomaActual() {
  const desat = idiomaTriat ?? magatzem()?.getItem(CLAU_IDIOMA);
  return TEXTOS[desat] ? desat : IDIOMA_DEFECTE;
}

// Canvia d'idioma, el recorda al navegador i refresca els textos fixos
export function canviarIdioma(idioma) {
  if (TEXTOS[idioma]) {
    idiomaTriat = idioma;
    try {
      magatzem()?.setItem(CLAU_IDIOMA, idioma);
    } catch {
      // Sense espai: l'idioma queda actiu però no es recordarà en tornar
    }
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
