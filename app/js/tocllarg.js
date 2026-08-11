// tocllarg.js — el toc llarg en pantalles tàctils: mig segon amb el dit
// quiet sobre una carta en mode de marcatge obre el zoom (la drecera que
// a escriptori és Ctrl+clic i que amb el dit no existeix).
//
// El gest queda lliure perquè el menú contextual del toc llarg ja
// s'empassa en tàctil (main.js i album.js), i el CSS treu el full de
// "desar la imatge" d'iOS amb -webkit-touch-callout: none.

import { esModeVariant } from "./markmode.js";

const TEMPS_TOC_LLARG = 500; // mil·lisegons quiet per considerar-lo llarg
const MOVIMENT_MAXIM = 10;   // més moviment que això és scroll, no un toc

// Lliga el gest a un node (fitxa de la graella o funda de l'àlbum).
// Si el toc llarg es completa, crida l'acció i deixa una marca al node:
// el "click" que el navegador dispara en aixecar el dit es descartarà
// (si no, sumaria una còpia just després d'obrir el zoom).
export function afegirTocLlarg(node, accio) {
  let temporitzador = null;
  let inici = null; // posició del dit en començar el toc

  const cancellar = () => {
    clearTimeout(temporitzador);
    inici = null;
  };

  node.addEventListener("pointerdown", (esdeveniment) => {
    // Només en mode de marcatge: en consulta un toc normal ja obre el zoom
    if (!esModeVariant()) return;
    inici = { x: esdeveniment.clientX, y: esdeveniment.clientY };
    clearTimeout(temporitzador);
    temporitzador = setTimeout(() => {
      node.dataset.tocLlarg = "1";
      accio();
      // Si el clic final no arriba (el dit s'aixeca sobre el zoom obert),
      // la marca s'esborra sola per no empassar-se un clic futur
      setTimeout(() => delete node.dataset.tocLlarg, 800);
    }, TEMPS_TOC_LLARG);
  });

  // El dit es mou (scroll), s'aixeca aviat o el gest es cancel·la:
  // no és un toc llarg
  node.addEventListener("pointermove", (esdeveniment) => {
    if (!inici) return;
    if (Math.abs(esdeveniment.clientX - inici.x) > MOVIMENT_MAXIM
      || Math.abs(esdeveniment.clientY - inici.y) > MOVIMENT_MAXIM) {
      cancellar();
    }
  });
  node.addEventListener("pointerup", cancellar);
  node.addEventListener("pointercancel", cancellar);
}

// Retorna true (i esborra la marca) si aquest clic ve d'un toc llarg:
// els gestors de clic el fan servir per no marcar la carta per accident
export function clicDeTocLlarg(node) {
  if (node.dataset.tocLlarg) {
    delete node.dataset.tocLlarg;
    return true;
  }
  return false;
}
