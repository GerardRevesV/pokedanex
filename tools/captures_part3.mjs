// Fa les captures de pantalla de la Part III del treball.
// Obre la web local en un Chrome sense finestra, hi marca una col·lecció
// d'exemple fent servir els botons de la mateixa web, i desa les imatges a
// treball/figures/. Cal tenir el servidor local engegat (port 8000).
//   node tools/captures_part3.mjs
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL_WEB = "http://localhost:8000/app/";
const SORTIDA = "treball/figures";
const PORT = 9444;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const perfil = mkdtempSync(join(tmpdir(), "pokedanex-captures-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--remote-debugging-port=" + PORT,
  "--user-data-dir=" + perfil, "--no-first-run", "--hide-scrollbars", "about:blank",
]);

let ws, seq = 0;
const pendents = new Map();
function cdp(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((ok, ko) => pendents.set(id, { ok, ko }));
}
async function js(expr) {
  const r = await cdp("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(expr.slice(0, 80) + " -> " + r.exceptionDetails.text);
  return r.result.value;
}
async function pantalla(width, height, mobile) {
  await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 2 : 1.5, mobile });
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: mobile });
}
// Espera que les imatges que es veuen a la pantalla hagin acabat de carregar
async function imatges() {
  for (let i = 0; i < 40; i++) {
    const falten = await js(`[...document.images].filter(im => { const r = im.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < innerHeight && !(im.complete && im.naturalWidth > 0); }).length`);
    if (!falten) break;
    await espera(250);
  }
  await espera(600);
}
async function desa(nom, selector) {
  await imatges();
  const params = { format: "jpeg", quality: 88 };
  if (selector) {
    const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
      return { x: r.x + scrollX - 8, y: r.y + scrollY - 8, width: r.width + 16, height: r.height + 16 }; })()`);
    params.clip = { ...c, scale: 1 };
  }
  const r = await cdp("Page.captureScreenshot", params);
  writeFileSync(join(SORTIDA, nom + ".jpg"), Buffer.from(r.data, "base64"));
  console.log("desada", nom);
}
async function carrega() {
  await cdp("Page.navigate", { url: URL_WEB });
  for (let i = 0; i < 60; i++) {
    await espera(250);
    if (await js("document.querySelectorAll('#graella > article').length") > 0) break;
  }
  await espera(400);
}
// Desplaça la pàgina fins que l'element quedi just sota la capçalera fixa
const sotaCapcalera = (sel) => js(`(() => {
  const cap = document.querySelector('header');
  const fixa = cap && ['sticky', 'fixed'].includes(getComputedStyle(cap).position);
  const alt = fixa ? cap.getBoundingClientRect().height : 0;
  scrollTo(0, document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect().top + scrollY - alt - 12);
})()`);
const clic = (sel) => js(`document.querySelector(${JSON.stringify(sel)}).click()`);

try {
  let desti;
  for (let i = 0; i < 40 && !desti; i++) {
    await espera(250);
    try {
      const llista = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      desti = llista.find((t) => t.type === "page");
    } catch { /* Chrome encara s'està obrint */ }
  }
  ws = new WebSocket(desti.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    const p = pendents.get(m.id);
    if (!p) return;
    pendents.delete(m.id);
    m.error ? p.ko(new Error(m.error.message)) : p.ok(m.result);
  };
  await cdp("Page.enable");
  await pantalla(1280, 860, false);

  // Shrouded Fable, la primera expansió del projecte
  await carrega();
  await js("localStorage.setItem('pokedanex.activeSet', 'sv6pt5')");
  await carrega();

  // Col·lecció d'exemple: es prem el «+» de dues de cada tres cartes de les
  // 45 primeres, i algunes en porten dues còpies
  const marcades = await js(`(() => { let n = 0;
    [...document.querySelectorAll('#graella > article')].slice(0, 45).forEach((a, i) => {
      if (i % 3 === 2) return;
      const mes = a.querySelector('.variant-fila .boto-comptador:last-child');
      mes.click(); if (i % 7 === 0) mes.click(); n++; });
    return n; })()`);
  console.log("cartes marcades:", marcades);
  await carrega();

  await desa("fig-graella");
  await desa("fig-estadistiques", "#panell-estad");
  await desa("fig-carta", "#graella > article:nth-child(2)");

  await clic("#graella > article:nth-child(4) .carta-imatge");
  await espera(500);
  await desa("fig-zoom");
  await clic("#zoom-tancar");

  await clic('#commutador-vista button[data-vista="album"]');
  await espera(800);
  await sotaCapcalera("#album");
  await desa("fig-album");
  await clic('#commutador-vista button[data-vista="graella"]');
  await js("scrollTo(0, 0)");

  await clic("#boto-expansions");
  await espera(700);
  await desa("fig-compendi");
  await clic("#expansions-tancar");

  // Un preu marcat amb «≈»: en queden molt pocs, o sigui que es busca la
  // primera carta que en porti, expansió per expansió
  let trobada = null;
  for (const set of ["sv8", "me1", "me2", "me2pt5", "me3", "me4", "me5",
    "sv7", "sv8pt5", "sv9", "sv10", "zsv10pt5", "rsv10pt5", "sv6pt5"]) {
    await js(`localStorage.setItem('pokedanex.activeSet', '${set}')`);
    await carrega();
    trobada = await js(`(() => {
      const a = [...document.querySelectorAll('#graella > article')]
        .find((x) => x.textContent.includes('≈'));
      if (!a) return null;
      a.id = 'carta-aprox';
      a.querySelector('.variant-fila .boto-comptador:last-child').click();
      const marca = [...a.querySelectorAll('*')]
        .find((e) => e.children.length === 0 && e.textContent.includes('≈'));
      return a.textContent.replace(/\s+/g, ' ').slice(0, 120) + ' | motiu: ' +
        (marca && (marca.title || marca.getAttribute('aria-label')));
    })()`);
    if (trobada) { console.log("preu aproximat:", set, trobada); break; }
  }
  if (!trobada) throw new Error("cap carta amb preu «≈»");
  await sotaCapcalera("#carta-aprox");
  await espera(600);
  await desa("fig-preu-aproximat", "#carta-aprox");
  await js("scrollTo(0, 0)");

  // El mateix web en una pantalla de mòbil
  await js("localStorage.setItem('pokedanex.activeSet', 'sv6pt5')");
  await pantalla(390, 844, true);
  await carrega();
  await clic("#estad-capcalera"); // el panell d'estadístiques, plegat
  await espera(400);
  await desa("fig-mobil-graella");
  await clic('#commutador-vista button[data-vista="album"]');
  await espera(800);
  await sotaCapcalera("#album");
  await desa("fig-mobil-album");
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
}
