/**
 * Adapta el fichero de tijeras (28 máquinas transcritas a mano desde las
 * fichas técnicas reales) al modelo de datos definitivo.
 *
 * Transformación puramente mecánica: renombra claves, unifica unidades y
 * colapsa la taxonomía antigua en familia + subcategoría. No toca ni una
 * cifra, solo su envoltorio.
 *
 *   node scripts/adaptar-tijeras.mjs
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "src", "lib", "catalog", "maquinas-tijera.ts");
const destino = join(raiz, "src", "lib", "catalog", "maquinas-tijeras.ts");

let s = readFileSync(origen, "utf8");

/* ---------- 1 · fichas renombradas al fabricante real ---------- */
const FICHAS = {
  "genie-gs-3268rt.pdf": "genie-gs-2668-3268rt.pdf",
  "genie-gs-3390rt.pdf": "genie-gs-3390-4390-5390rt.pdf",
  "genie-gs-3394rt.pdf": "jlg-3394-4394rt.pdf",
  "haulotte-2030-3246es.pdf": "jlg-serie-es.pdf",
  "haulotte-compact-8-12.pdf": "haulotte-compact-8-10.pdf",
};
for (const [antes, ahora] of Object.entries(FICHAS)) {
  s = s.replaceAll(`/fichas/${antes}`, `/fichas/${ahora}`);
}

/* ---------- 2 · campos ---------- */
s = s.replace(/^(\s*)fabricante:/gm, "$1marca:");

/** categoria → familia + subcategoría, deducida de la energía del bloque. */
s = s.replace(
  /categoria: "plataformas-tijera",([\s\S]*?)energia: \[([^\]]+)\],/g,
  (_m, medio, energias) => {
    const lista = energias.split(",").map((x) => x.trim().replace(/"/g, ""));
    const electrica = lista.includes("electrico");
    const sub = electrica ? "tijeras-electricas" : "tijeras-diesel";
    // La energía pasa de lista a valor único: la principal manda, las
    // alternativas (gas/GLP) ya se cuentan en la spec del motor.
    const principal = electrica ? "electrico" : lista[0];
    return `familia: "elevacion",\n    subcategoriaSlug: "${sub}",${medio}energia: "${principal}",`;
  },
);

s = s.replace(/traccion: "2wd"/g, 'traccion: "2x4"');
s = s.replace(/traccion: "4wd"/g, 'traccion: "4x4"');

/* ---------- 3 · claves de spec ---------- */
const RENOMBRA = {
  pesoTotal: "peso",
  velocidadDesplazamiento: "velocidadTraslacion",
  motor: "motor",
};
for (const [antes, ahora] of Object.entries(RENOMBRA)) {
  if (antes !== ahora) s = s.replace(new RegExp(`(\\s)${antes}:`, "g"), `$1${ahora}:`);
}

/** Metros → milímetros, para que coincidan con el resto del catálogo. */
const A_MM = {
  anchuraMaquina: "anchoTransporte",
  alturaReplegada: "alturaTransporte",
  longitudReplegada: "longitudTransporte",
};
for (const [antes, ahora] of Object.entries(A_MM)) {
  s = s.replace(
    new RegExp(`${antes}: (conf|est)\\(\\s*([\\d.]+)`, "g"),
    (_m, fn, valor) => `${ahora}: ${fn}(${Math.round(parseFloat(valor) * 1000)}`,
  );
  // Las pendientes quedan sin valor numérico (pend/na): solo renombrar.
  s = s.replace(new RegExp(`(\\s)${antes}:`, "g"), `$1${ahora}:`);
}

/* ---------- 4 · trabajos del asesor ---------- */
s = s.replace(/trabajos: \[[^\]]*\]/gs, 'trabajos: ["altura"]');

/* ---------- 5 · la descripción larga no está en el modelo ---------- */
s = s.replace(/\n\s*descripcionLarga:\s*(?:"(?:[^"\\]|\\.)*"|`[^`]*`),?/g, "");

/* ---------- 6 · destacados: el modelo los pide ---------- */
// El fichero rescatado no trae `destacados`; se derivan de las aplicaciones
// para no dejar el campo vacío ni inventar texto nuevo.
s = s.replace(
  /aplicaciones: \[([\s\S]*?)\],\n(\s*)imagenes: \[\],/g,
  (_m, items, sangria) =>
    `aplicaciones: [${items}],\n${sangria}destacados: [],\n${sangria}imagenes: [],`,
);

/* ---------- 7 · nombre del export ---------- */
s = s.replace(/export const TIJERAS/g, "export const MAQUINAS_TIJERAS");

writeFileSync(destino, s, "utf8");
if (existsSync(origen)) renameSync(origen, origen + ".bak");
console.log("adaptado →", destino);
