// mobil.js — els dos botons flotants del mòbil: «cerca i filtres» i
// «torna a dalt».
//
// Al mòbil la capçalera no es queda clavada a dalt (ocuparia mitja
// pantalla), així que, des de la carta 80, per buscar o filtrar calia
// tornar a dalt de tot fent lliscar el dit. Quan la capçalera ja no es
// veu, apareixen aquests dos botons a baix a la dreta. A l'ordinador la
// capçalera sí que és enganxosa i els botons no surten mai.

const element = (id) => document.getElementById(id);

// Només en mòbil (pantalla estreta o tàctil): un ordinador amb la
// finestra molt baixa també té la capçalera no enganxosa, però allà els
// botons no hi pintaven res
const esMobil = window.matchMedia("(max-width: 767px), (pointer: coarse)");

// Els botons només tenen sentit si la capçalera NO és enganxosa (el CSS
// decideix quan ho és: aquí només se'n llegeix el resultat)
function capcaleraEnganxosa() {
  return getComputedStyle(document.querySelector(".capcalera")).position === "sticky";
}

// Es mostren quan la capçalera ha sortit del tot de la pantalla
function actualitzar() {
  const capcalera = document.querySelector(".capcalera");
  const fora = capcalera.getBoundingClientRect().bottom < 0;
  element("botons-flotants").hidden = !fora || !esMobil.matches || capcaleraEnganxosa();
}

function anarADalt(comportament) {
  window.scrollTo({ top: 0, behavior: comportament });
}

export function iniciarMobil() {
  // Un sol càlcul per fotograma, per molt que es faci lliscar el dit
  let pendent = false;
  const programar = () => {
    if (pendent) return;
    pendent = true;
    requestAnimationFrame(() => {
      pendent = false;
      actualitzar();
    });
  };
  window.addEventListener("scroll", programar, { passive: true });
  window.addEventListener("resize", programar, { passive: true });

  // Torna a dalt de tot, amb moviment suau (tret que el sistema demani
  // reduir el moviment)
  element("boto-flotant-amunt").addEventListener("click", () => {
    const suau = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    anarADalt(suau ? "smooth" : "auto");
  });

  // Cerca i filtres: enfoca el cercador (el teclat surt de seguida, ja
  // que el focus va dins del mateix toc) i salta a dalt, on també hi ha
  // el botó «Filtres i opcions»
  element("boto-flotant-cerca").addEventListener("click", () => {
    element("cercador").focus({ preventScroll: true });
    anarADalt("auto");
  });

  actualitzar();
}
