/**
 * Pruebas de la lógica que sostiene las cuatro funcionalidades.
 *
 * No hay framework de test a propósito: son aserciones directas sobre
 * funciones puras, se ejecutan con `npx tsx` y fallan con código 1.
 *
 *   npm run test
 */
import {
  ALQUILER,
  CATALOGO,
  VENTA,
  filtrar,
  contarFacetas,
  filtrosQueMasExcluyen,
  ordenar,
  relacionadas,
  specsDestacadas,
  getMaquina,
  getMaquinas,
  FILTROS_VACIOS,
  type Filtros,
} from "../src/lib/catalog/index.js";
import { numeroDe } from "../src/lib/catalog/types.js";
import { recomendar, PARAMETROS, TRABAJOS, ENTORNOS } from "../src/lib/advisor/index.js";
import { avisoCif, esquemaSolicitud } from "../src/lib/leads/schema.js";

let ok = 0;
const fallos: string[] = [];

function afirma(condicion: unknown, descripcion: string) {
  if (condicion) {
    ok++;
  } else {
    fallos.push(descripcion);
  }
}

const f = (parcial: Partial<Filtros> = {}): Filtros => ({
  ...FILTROS_VACIOS,
  ...parcial,
});

/* ============================================================
   Catálogo
   ============================================================ */

afirma(CATALOGO.length >= 60, `el catálogo tiene ${CATALOGO.length} máquinas`);
afirma(
  new Set(CATALOGO.map((m) => m.slug)).size === CATALOGO.length,
  "no hay slugs duplicados",
);
afirma(
  ALQUILER.length + VENTA.length === CATALOGO.length,
  "cada máquina está en alquiler o en venta",
);
afirma(
  CATALOGO.every((m) => m.descripcionCorta.length > 20),
  "todas tienen descripción",
);
afirma(
  CATALOGO.every((m) => m.delegaciones.length > 0),
  "todas tienen al menos una delegación",
);
afirma(getMaquina("genie-gs-4390") !== undefined, "se encuentra la GS-4390");
afirma(getMaquina("no-existe") === undefined, "un slug inventado no devuelve nada");
afirma(getMaquinas(["genie-gs-4390", "no-existe"]).length === 1, "getMaquinas descarta lo que no existe");

/* ============================================================
   Filtros
   ============================================================ */

afirma(filtrar(ALQUILER, f()).length === ALQUILER.length, "sin filtros salen todas");

const soloElevacion = filtrar(ALQUILER, f({ familia: "elevacion" }));
afirma(
  soloElevacion.length > 0 && soloElevacion.every((m) => m.familia === "elevacion"),
  "el filtro de familia solo devuelve esa familia",
);

const electricas = filtrar(ALQUILER, f({ energia: ["electrico"] }));
afirma(
  electricas.every((m) => m.facetas.energia === "electrico"),
  "el filtro de alimentación es exacto",
);

const interior = filtrar(ALQUILER, f({ entorno: ["interior"] }));
afirma(
  interior.every((m) => m.facetas.entornos.includes("interior")),
  "el filtro de uso interior es exacto",
);

/* La regla que sostiene la promesa del proyecto: una máquina sin altura
   confirmada queda FUERA del filtro de altura, no entra con un cero. */
const conRango = filtrar(ALQUILER, f({ alturaMin: 10, alturaMax: 16 }));
afirma(
  conRango.every((m) => {
    const h = numeroDe(m.specs.alturaTrabajo);
    return h != null && h >= 10 && h <= 16;
  }),
  "el filtro de altura respeta el rango",
);
const sinAlturaConocida = ALQUILER.filter(
  (m) => numeroDe(m.specs.alturaTrabajo) == null,
);
afirma(
  sinAlturaConocida.every((m) => !conRango.some((x) => x.slug === m.slug)),
  "las máquinas sin altura confirmada quedan fuera del filtro de altura",
);

const combinado = filtrar(
  ALQUILER,
  f({ familia: "elevacion", energia: ["electrico"], alturaMin: 6, alturaMax: 10 }),
);
afirma(combinado.length > 0, `el filtro combinado devuelve ${combinado.length}`);
afirma(
  combinado.every(
    (m) =>
      m.familia === "elevacion" &&
      m.facetas.energia === "electrico" &&
      numeroDe(m.specs.alturaTrabajo)! >= 6 &&
      numeroDe(m.specs.alturaTrabajo)! <= 10,
  ),
  "el filtro combinado cumple las tres condiciones",
);

const porTexto = filtrar(ALQUILER, f({ texto: "genie" }));
afirma(porTexto.length > 0, "la búsqueda por texto encuentra Genie");
const porModelo = filtrar(ALQUILER, f({ texto: "gs-4390" }));
afirma(porModelo.length >= 1, "la búsqueda por modelo parcial funciona");
afirma(
  filtrar(ALQUILER, f({ texto: "zzzzz" })).length === 0,
  "una búsqueda sin resultados devuelve cero",
);

/* Los contadores de faceta tienen que cuadrar con el filtro real. */
const cuentas = contarFacetas(ALQUILER, f());
afirma(
  cuentas.familia.elevacion === filtrar(ALQUILER, f({ familia: "elevacion" })).length,
  "el contador de familia cuadra con el filtro",
);
afirma(
  cuentas.energia.electrico === electricas.length,
  "el contador de alimentación cuadra con el filtro",
);

/* Rescate del estado vacío. */
const imposible = f({
  familia: "movimiento-tierras",
  energia: ["electrico"],
  alturaMin: 40,
});
afirma(filtrar(ALQUILER, imposible).length === 0, "el filtro imposible da cero");
const rescates = filtrosQueMasExcluyen(ALQUILER, imposible);
afirma(rescates.length > 0, "hay al menos un filtro que rescatar");
afirma(
  rescates.every((r) => r.resultados > 0),
  "cada rescate propuesto devuelve resultados de verdad",
);

/* Orden. */
const asc = ordenar([...ALQUILER], "altura-asc").map((m) =>
  numeroDe(m.specs.alturaTrabajo),
);
const ascConocidas = asc.filter((h): h is number => h != null);
afirma(
  ascConocidas.every((h, i) => i === 0 || ascConocidas[i - 1] <= h),
  "el orden por altura ascendente es monótono",
);
const desc = ordenar([...ALQUILER], "altura-desc").map((m) =>
  numeroDe(m.specs.alturaTrabajo),
);
afirma(desc[0] != null && desc[0] >= 40, `la más alta es de ${desc[0]} m`);

/* ============================================================
   Tarjeta y ficha
   ============================================================ */

afirma(
  CATALOGO.every((m) => specsDestacadas(m).length <= 3),
  "la tarjeta nunca enseña más de tres specs",
);
/* «Datos suficientes» son tres specs UTILIZABLES, no tres claves en el
   objeto: una gama del catálogo puede tener seis specs y que cinco sean
   `na()` porque no aplican a una carretilla. La tarjeta descarta las que
   no aplican a propósito —una raya ocupa el sitio de un dato—, así que
   la prueba cuenta lo mismo que cuenta la tarjeta. */
const utilizables = (m: (typeof CATALOGO)[number]) =>
  Object.values(m.specs).filter((d) => d && d.estado !== "no_aplica").length;

afirma(
  CATALOGO.filter((m) => utilizables(m) >= 3).every(
    (m) => specsDestacadas(m).length === 3,
  ),
  "con datos suficientes la tarjeta enseña exactamente tres specs",
);
afirma(
  CATALOGO.every((m) =>
    specsDestacadas(m).every((k) => m.specs[k]?.estado !== "no_aplica"),
  ),
  "la tarjeta nunca destaca una spec que no aplica",
);
afirma(
  CATALOGO.every((m) => specsDestacadas(m).every((k) => m.specs[k] !== undefined)),
  "las specs destacadas existen en la máquina",
);

const rel = relacionadas(getMaquina("genie-gs-4390")!);
afirma(rel.length === 3, "se proponen tres máquinas relacionadas");
afirma(
  rel.every((m) => m.slug !== "genie-gs-4390"),
  "una máquina no se relaciona consigo misma",
);

/* ============================================================
   Asesor
   ============================================================ */

afirma(TRABAJOS.length === 4, "el asesor pregunta por cuatro tipos de trabajo");
afirma(
  TRABAJOS.every((t) => (PARAMETROS[t.id]?.length ?? 0) >= 4),
  "cada trabajo tiene su propia segunda pregunta",
);
afirma(
  TRABAJOS.every((t) => PARAMETROS[t.id].some((o) => o.id === "no-se")),
  'toda segunda pregunta ofrece "No lo sé"',
);
afirma(
  ENTORNOS.some((e) => e.id === "no-se"),
  'la pregunta de entorno ofrece "No lo sé"',
);

const alturaInterior = recomendar({
  trabajo: "altura",
  parametro: "h-10",
  entorno: "interior-limpio",
});
afirma(
  alturaInterior.recomendadas.length > 0,
  "el asesor recomienda para trabajo en altura en interior",
);
afirma(
  alturaInterior.recomendadas.every(
    (r) => r.maquina.facetas.energia !== "diesel",
  ),
  "para interior limpio no propone ninguna diésel",
);
afirma(
  alturaInterior.recomendadas.every((r) => r.razones.length > 0),
  "cada recomendación explica por qué",
);
afirma(
  alturaInterior.recomendadas.every((r) => r.razones.length <= 3),
  "nunca más de tres razones",
);
afirma(
  alturaInterior.enlaceCatalogo.startsWith("/alquiler?"),
  "el asesor enlaza al catálogo con filtros",
);

const exteriorObra = recomendar({
  trabajo: "altura",
  parametro: "h-16",
  entorno: "exterior-obra",
});
afirma(
  exteriorObra.recomendadas.every(
    (r) => r.maquina.facetas.traccion === "4x4" || r.maquina.facetas.traccion === "oruga",
  ),
  "para terreno de obra solo propone tracción total u oruga",
);

const cargas = recomendar({
  trabajo: "cargas",
  parametro: "c-giro",
  entorno: "exterior-obra",
});
afirma(
  cargas.recomendadas.length > 0 &&
    cargas.recomendadas[0].maquina.subcategoriaSlug ===
      "manipuladores-telescopicos-giratorios",
  "pidiendo rotación 360º propone primero un manipulador giratorio",
);

const energia = recomendar({
  trabajo: "energia",
  parametro: "e-luz",
  entorno: "mixto",
});
afirma(
  energia.recomendadas.length > 0 &&
    energia.recomendadas[0].maquina.subcategoriaSlug === "torres-iluminacion",
  "pidiendo iluminación propone primero una torre de luz",
);

/* Determinista: las mismas respuestas, la misma lista. */
const r1 = recomendar({ trabajo: "tierra", parametro: "t-zanja", entorno: "acceso-estrecho" });
const r2 = recomendar({ trabajo: "tierra", parametro: "t-zanja", entorno: "acceso-estrecho" });
afirma(
  JSON.stringify(r1.recomendadas.map((x) => x.maquina.slug)) ===
    JSON.stringify(r2.recomendadas.map((x) => x.maquina.slug)),
  "el asesor es determinista",
);

/* Nunca un callejón sin salida. */
const extremo = recomendar({
  trabajo: "altura",
  parametro: "h-max",
  entorno: "acceso-estrecho",
});
afirma(
  extremo.recomendadas.length + extremo.alternativas.length > 0 || extremo.relajado,
  "ante una petición extrema, el asesor relaja o propone alternativas",
);

/* "No lo sé" ensancha, no bloquea. */
const noSe = recomendar({ trabajo: "altura", parametro: "no-se", entorno: "no-se" });
afirma(
  noSe.recomendadas.length > 0,
  '"No lo sé" en las dos preguntas sigue devolviendo recomendaciones',
);

/* ============================================================
   Formulario
   ============================================================ */

afirma(avisoCif("B12345678") !== null, "un CIF con dígito de control malo avisa");
afirma(avisoCif("") === null, "un CIF vacío no avisa todavía");
afirma(avisoCif("12345678Z") === null, "el NIF 12345678Z se acepta");

const manana = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const pasado = new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10);
const base = {
  tipo: "alquiler",
  maquinas: ["genie-gs-4390"],
  fechaInicio: manana,
  fechaFin: pasado,
  provincia: "Madrid",
  localidad: "Alcobendas",
  empresa: "Construcciones Ejemplo SL",
  cif: "B12345674",
  contacto: "Ana Pérez",
  telefono: "600123456",
  email: "ana@ejemplo.es",
  consentimiento: "on",
};

afirma(esquemaSolicitud.safeParse(base).success, "una solicitud completa valida");
afirma(
  !esquemaSolicitud.safeParse({ ...base, consentimiento: undefined }).success,
  "sin consentimiento no valida",
);
afirma(
  !esquemaSolicitud.safeParse({ ...base, fechaFin: manana, fechaInicio: pasado })
    .success,
  "una fecha de fin anterior a la de inicio no valida",
);
afirma(
  !esquemaSolicitud.safeParse({ ...base, telefono: "123" }).success,
  "un teléfono corto no valida",
);
afirma(
  !esquemaSolicitud.safeParse({ ...base, email: "no-es-un-correo" }).success,
  "un correo mal formado no valida",
);
afirma(
  esquemaSolicitud.safeParse({ ...base, maquinas: [] }).success,
  "se puede pedir asesoramiento sin elegir máquina",
);
afirma(
  !esquemaSolicitud.safeParse({
    ...base,
    fechaInicio: "2020-01-01",
    fechaFin: "2020-01-05",
  }).success,
  "una fecha pasada no valida",
);

/* ============================================================
   Resultado
   ============================================================ */

console.log(`\n${ok} comprobaciones correctas`);
if (fallos.length) {
  console.error(`\n${fallos.length} FALLOS:`);
  fallos.forEach((x) => console.error("  ✗ " + x));
  process.exit(1);
}
console.log("Todo en verde.\n");
