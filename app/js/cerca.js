// cerca.js — la cerca "per proximitat": troba el que busques encara que
// ho escriguis malament («picachu» → Pikachu, «charizar» → Charizard,
// «shrouded fabel» → Shrouded Fable).
//
// Sense llibreries: tot és una funció pròpia que
//  1. normalitza els textos (minúscules, sense accents ni signes), i
//  2. puntua cada nom amb un "nivell" de coincidència, del millor al pitjor:
//       0 = exacta, 1 = comença igual (prefix), 2 = hi és a dins
//       (subcadena), 3 = s'hi assembla amb un sol error, 4 = s'hi
//       assembla amb més d'un error (distància d'edició petita).
//     Si no s'hi assembla prou, retorna null (no coincideix).
//
// La "distància d'edició" és el nombre mínim de lletres que cal canviar,
// afegir, treure o intercanviar per passar d'una paraula a l'altra
// («fabel» → «fable» és 1: intercanviar la e i la l). Per no trobar-ho
// tot amb paraules curtes, el màxim permès creix amb la llargada.

export const NIVELL = { EXACTA: 0, PREFIX: 1, SUBCADENA: 2, APROXIMADA: 3, LLUNYANA: 4 };

// El nivell d'una coincidència aproximada segons els errors: amb «picachu»,
// Pikachu (1 error) ha de sortir abans que Pichu (2 errors)
const nivellSegonsErrors = (errors) => (errors <= 1 ? NIVELL.APROXIMADA : NIVELL.LLUNYANA);

// Minúscules, sense accents ni apòstrofs, i qualsevol altre signe com a
// espai: «Farfetch'd» → «farfetchd», «Mr. Mime» → «mr mime», «Pokémon» → «pokemon»
export function normalitzar(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Errors permesos per a una paraula sencera, segons la seva llargada:
// fins a 3 lletres cap (si no, «mew» trobaria «dew», «hex»...), 4-6 una,
// 7-9 dues, 10 o més tres
function errorsPermesos(llargada) {
  if (llargada <= 3) return 0;
  if (llargada <= 6) return 1;
  if (llargada <= 9) return 2;
  return 3;
}

// Distància d'edició (Damerau-Levenshtein restringida): canviar, afegir,
// treure o intercanviar dues lletres seguides costa 1. Es para aviat si
// ja se supera el màxim, perquè és el que més es crida.
function distancia(a, b, maxim) {
  if (Math.abs(a.length - b.length) > maxim) return maxim + 1;
  let abans = null;
  let previa = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const actual = [i];
    let minimFila = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let valor = Math.min(previa[j] + 1, actual[j - 1] + 1, previa[j - 1] + cost);
      if (abans && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        valor = Math.min(valor, abans[j - 2] + 1);
      }
      actual[j] = valor;
      if (valor < minimFila) minimFila = valor;
    }
    if (minimFila > maxim) return maxim + 1;
    abans = previa;
    previa = actual;
  }
  return previa[b.length];
}

// Una paraula de la cerca s'assembla a una paraula del nom? Sencera (amb
// els errors permesos) o, si la cerca és prou llarga, com a començament
// mal escrit («picac» mentre encara s'escriu «picachu»). Retorna el
// nivell (3 o 4) o null si no s'hi assembla prou.
function paraulaAproximada(paraulaCerca, paraulaNom) {
  const maxim = errorsPermesos(paraulaCerca.length);
  if (maxim === 0) return null;
  const errors = distancia(paraulaCerca, paraulaNom, maxim);
  if (errors <= maxim) return nivellSegonsErrors(errors);
  if (paraulaCerca.length < 5 || paraulaNom.length <= paraulaCerca.length) return null;
  const maximPrefix = Math.floor(paraulaCerca.length / 4);
  let millor = null;
  for (let llarg = paraulaCerca.length - 1; llarg <= paraulaCerca.length + 1; llarg++) {
    const errorsPrefix = distancia(paraulaCerca, paraulaNom.slice(0, llarg), maximPrefix);
    if (errorsPrefix <= maximPrefix && (millor === null || errorsPrefix < millor)) {
      millor = errorsPrefix;
    }
  }
  return millor === null ? null : nivellSegonsErrors(millor);
}

// Els noms normalitzats es guarden: la mateixa carta es puntua a cada
// tecla, i amb milers de cartes no cal tornar-los a calcular
const memoria = new Map();
function prepararNom(nom) {
  let preparat = memoria.get(nom);
  if (!preparat) {
    const net = normalitzar(nom);
    preparat = { net, junt: net.replace(/ /g, ""), paraules: net.split(" ") };
    memoria.set(nom, preparat);
  }
  return preparat;
}

// Prepara la cerca un sol cop (i no per a cada carta). Retorna null si
// la cerca és buida o només té signes.
export function prepararConsulta(text) {
  const net = normalitzar(text);
  if (!net) return null;
  return { net, junt: net.replace(/ /g, ""), paraules: net.split(" ") };
}

// El nivell de coincidència d'un nom amb una cerca preparada (0-4), o
// null si no coincideix. Amb diverses paraules, totes han de sortir al
// nom (en qualsevol ordre) i el nivell és el de la pitjor: «charizar»
// fa prefix de la paraula «Charizard» de «Mega Charizard X ex» (nivell 1).
export function puntuar(nom, consulta) {
  if (!consulta) return NIVELL.EXACTA;
  const n = prepararNom(nom);
  if (n.net === consulta.net) return NIVELL.EXACTA;
  if (n.net.startsWith(consulta.net)) return NIVELL.PREFIX;

  let pitjor = NIVELL.PREFIX;
  for (const paraula of consulta.paraules) {
    let millor = null;
    for (const paraulaNom of n.paraules) {
      let nivell = null;
      if (paraulaNom.startsWith(paraula)) nivell = NIVELL.PREFIX;
      else if (paraulaNom.includes(paraula)) nivell = NIVELL.SUBCADENA;
      else nivell = paraulaAproximada(paraula, paraulaNom);
      if (nivell !== null && (millor === null || nivell < millor)) millor = nivell;
      if (millor === NIVELL.PREFIX) break;
    }
    if (millor === null) {
      pitjor = null;
      break;
    }
    pitjor = Math.max(pitjor, millor);
  }
  if (pitjor !== null) return pitjor;

  // Alguna paraula no surt enlloc. Potser s'han separat paraules
  // («pika chu»): es prova el nom sencer sense espais
  if (n.junt.includes(consulta.junt)) return NIVELL.SUBCADENA;
  // O s'han ajuntat («mrmime»): només amb una sola paraula escrita. Amb
  // més d'una, cada paraula ha de sortir (si no, «pikachu ex» trauria
  // també el Pikachu sense «ex»)
  if (consulta.paraules.length > 1) return null;
  const maxim = errorsPermesos(consulta.junt.length);
  if (maxim === 0) return null;
  const errors = distancia(consulta.junt, n.junt, maxim);
  return errors <= maxim ? nivellSegonsErrors(errors) : null;
}

// Dreceres per a qui només vol saber si coincideix o no
export function coincideixText(nom, consulta) {
  return puntuar(nom, consulta) !== null;
}
