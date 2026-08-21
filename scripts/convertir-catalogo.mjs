/**
 * Convierte el catálogo de la maqueta de referencia al modelo de datos
 * de este proyecto, envolviendo cada especificación en Dato<T>.
 *
 * Se hace con un script y no a mano por una razón: una conversión
 * determinista no se equivoca en una cifra. Lo único que se decide aquí
 * es el ESTADO de cada dato, y el criterio es conservador:
 *
 *   - Toda spec de la referencia entra como `est(valor, "fabricante")`:
 *     es un valor de catálogo del fabricante, plausible, pero que nadie
 *     de JOFEMESA ha confirmado todavía contra su unidad de flota.
 *   - Solo pasan a `conf(valor, "ficha-pdf")` las máquinas cuya ficha
 *     técnica real hemos descargado de su propio servidor, y eso se
 *     transcribe aparte, a mano, en maquinas-verificadas.ts.
 *
 *   node scripts/convertir-catalogo.mjs
 */
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "..", "Jofemesa Copy", "src", "data", "machines.ts");
const destino = join(raiz, "src", "lib", "catalog", "maquinas-catalogo.ts");

/* ---------- 1 · leer el array de la referencia ---------- */
const fuente = readFileSync(origen, "utf8")
  .replace(/^import[\s\S]*?;\s*/m, "")
  .replace(/export const MACHINES:\s*Machine\[\]\s*=\s*/, "return ");
const MAQUINAS_REF = new Function(fuente)();

/* ---------- 2 · mapeos ---------- */

/** Nombre de delegación en la referencia → id de delegación real. */
const DELEGACION = {
  Madrid: "madrid",
  Asturias: "asturias",
  Valencia: "valencia",
  Castellón: "castellon",
  Málaga: "malaga",
  Sevilla: "sevilla",
  Valladolid: "valladolid",
  Alicante: "alicante",
  Oporto: "portugal",
  Lisboa: "portugal",
};

/** Fichas técnicas reales descargadas de jofemesa.com, por modelo. */
const FICHAS = {
  "GS-1932": "genie-gs-1932.pdf",
  "GS-5390 RT 4x4": "genie-gs-3390-4390-5390rt.pdf",
  // La GS-3246 no lleva ficha: el PDF de la serie ES que sirven es de JLG.
};

/** Las que salen en la portada: una por familia, con variedad real. */
const DESTACADAS = new Set([
  "haulotte-ha16-rtj",
  "jlg-1350sjp",
  "manitou-mt-1440",
  "manitou-mrt-2150",
  "takeuchi-tb290",
  "jcb-3cx",
  "pramac-gsw-60",
  "atlas-copco-hilight-v4",
  "bomag-bw-120-ad-5",
  "jungheinrich-efg-216k",
]);

/** Qué entornos admite cada tipo de energía y subcategoría. */
function entornosDe(m) {
  const soloInterior = ["mastiles-verticales", "carretillas-electricas"];
  const soloExterior = [
    "tijeras-diesel",
    "brazos-diesel",
    "brazos-telescopicos",
    "carretillas-todoterreno",
    "carretillas-diesel",
    "miniexcavadoras",
    "retrocargadoras",
    "minicargadoras",
    "dumpers-4x4",
    "pisones",
    "bandejas-vibrantes",
    "rodillos",
    "grupos-electrogenos",
    "torres-iluminacion",
    "compresores-portatiles",
    "plataformas-sobre-camion",
    "manipuladores-telescopicos-rigidos",
    "manipuladores-telescopicos-giratorios",
  ];
  if (soloInterior.includes(m.subcategoriaSlug)) return ["interior", "exterior"];
  if (soloExterior.includes(m.subcategoriaSlug)) return ["exterior"];
  if (m.tipoEnergia === "electrico") return ["interior", "exterior"];
  if (m.tipoEnergia === "hibrido") return ["interior", "exterior"];
  return ["exterior"];
}

/** Trabajo del asesor al que responde cada familia. */
const TRABAJO_POR_FAMILIA = {
  elevacion: ["altura"],
  manipulacion: ["cargas"],
  "movimiento-tierras": ["tierra"],
  compactacion: ["tierra"],
  energia: ["energia"],
  "aire-martillos": ["energia"],
  "herramienta-auxiliar": ["tierra"],
};

/** Las que requieren carné/formación IPAF para operar. */
const REQUIERE_FORMACION = new Set(["elevacion", "manipulacion"]);

const SPECS_TEXTO = new Set([
  "potencia",
  "capacidadCazo",
  "presionAire",
  "caudalAire",
  "dimensionesPlataforma",
  "velocidadTraslacion",
  "pendienteSuperable",
  "autonomia",
  "voltaje",
  "traccion",
]);

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const cita = (s) => JSON.stringify(s);

/* ---------- 3 · emitir ---------- */
const lineas = [];
lineas.push(`/* GENERADO por scripts/convertir-catalogo.mjs — no editar a mano.
 *
 * Especificaciones de catálogo de fabricante. Entran como "estimado"
 * a propósito: son cifras publicadas por Genie, JLG, Haulotte, Manitou,
 * Takeuchi, Jungheinrich y compañía, pero nadie de JOFEMESA las ha
 * confirmado todavía contra la unidad concreta que tiene en el parque.
 *
 * La interfaz las muestra con su marca de "dato de fabricante" y el
 * comercial las confirma al responder la solicitud. Las verificadas
 * contra la ficha técnica real viven en maquinas-verificadas.ts.
 */
import type { Maquina } from "./types";
import { est } from "./types";

export const MAQUINAS_CATALOGO: Maquina[] = [`);

let conFicha = 0;
const porFamilia = {};

MAQUINAS_REF.forEach((m, i) => {
  const slug = slugify(`${m.marca} ${m.modelo}`);
  const traccion = m.specs.tipoTraccion ?? (m.tipoEnergia === "electrico" ? "2x4" : "4x4");
  const entornos = entornosDe(m);
  const delegaciones = [
    ...new Set((m.delegacionesDisponibles ?? []).map((d) => DELEGACION[d]).filter(Boolean)),
  ];
  porFamilia[m.familia] = (porFamilia[m.familia] ?? 0) + 1;

  const specs = [];
  for (const [k, v] of Object.entries(m.specs)) {
    if (k === "tipoTraccion") continue;
    const valor = SPECS_TEXTO.has(k) ? cita(String(v)) : v;
    specs.push(`      ${k}: est(${valor}),`);
  }
  specs.push(`      traccion: est(${cita(traccion)}),`);

  const ficha = FICHAS[m.modelo];
  const rutaFicha = ficha ? join(raiz, "public", "fichas", ficha) : null;
  const fichaOk = rutaFicha && existsSync(rutaFicha);
  if (fichaOk) conFicha++;

  lineas.push(`  {
    id: ${cita(m.id)},
    slug: ${cita(slug)},
    marca: ${cita(m.marca)},
    modelo: ${cita(m.modelo)},
    familia: ${cita(m.familia)},
    subcategoriaSlug: ${cita(m.subcategoriaSlug)},
    lineas: [${m.esVenta ? '"venta"' : '"alquiler"'}],${
      m.condicionVenta ? `\n    condicionVenta: ${cita(m.condicionVenta)},` : ""
    }
    destacada: ${DESTACADAS.has(m.id)},
    orden: ${(i + 1) * 10},
    facetas: {
      energia: ${cita(m.tipoEnergia)},
      entornos: [${entornos.map(cita).join(", ")}],
      traccion: ${cita(traccion)},
      requiereFormacion: ${REQUIERE_FORMACION.has(m.familia)},
    },
    delegaciones: [${delegaciones.map(cita).join(", ")}],
    specs: {
${specs.join("\n")}
    },
    descripcionCorta: ${cita(m.descripcionCorta)},
    aplicaciones: [${(m.aplicaciones ?? []).map(cita).join(", ")}],
    destacados: [${(m.destacados ?? []).map(cita).join(", ")}],
    imagenes: [],
    fichaTecnica: ${
      fichaOk
        ? `{ src: ${cita("/fichas/" + ficha)}, bytes: ${statSync(rutaFicha).size} }`
        : "null"
    },
    trabajos: [${(TRABAJO_POR_FAMILIA[m.familia] ?? []).map(cita).join(", ")}],
  },`);
});

lineas.push("];\n");
writeFileSync(destino, lineas.join("\n"), "utf8");

console.log(`${MAQUINAS_REF.length} máquinas convertidas → ${destino}`);
console.log(`fichas técnicas reales adjuntadas: ${conFicha}`);
console.log("por familia:", porFamilia);
