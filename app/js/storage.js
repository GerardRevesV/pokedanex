// storage.js — accés segur al localStorage, compartit per tots els mòduls.
//
// En alguns navegadors (p. ex. amb "bloqueja totes les galetes") només
// tocar window.localStorage llança un error. Aquest ajudant el captura:
// si no hi ha emmagatzematge, retorna null i cada mòdul segueix funcionant
// amb els valors per defecte, sense desar res.
export function magatzem() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
