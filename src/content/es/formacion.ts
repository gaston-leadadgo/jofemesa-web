import { DELEGACIONES_POR_ID, SEDE_FORMACION } from "./empresa";

/**
 * Formación a clientes.
 *
 * El cliente pidió darle mucha más importancia (reunión del 28/09/2026)
 * y el guion de estructura web la sube a menú principal con tres partes:
 * legislación de referencia, catálogo de cursos y calendario nacional.
 *
 * Este fichero es la forma de los datos. Está pensado para que el panel
 * de WordPress lo sustituya uno a uno: cada convocatoria es una fila con
 * curso, fecha, sede y —cuando lo gestionen— plazas y ocupación.
 */

export type CursoId =
  | "carretillas"
  | "plataformas"
  | "altura"
  | "andamios"
  | "confinados";

export type SedeCursoId = "san-fernando" | "sagunto";

export interface Convocatoria {
  id: string;
  curso: CursoId;
  /** ISO, sin hora: la zona horaria no puede mover una convocatoria de día. */
  fecha: string;
  sede: SedeCursoId;
  inicio: string;
  fin: string;
  /** Plazas totales. `null` = aún no gestionado: se muestra «Consultar plazas». */
  plazas: number | null;
  /** Plazas ocupadas. `null` = aún no gestionado. */
  ocupadas: number | null;
}

export interface Curso {
  id: CursoId;
  nombre: string;
  /** Nombre corto para chips y filtros. */
  corto: string;
  /** Norma de referencia, cuando la hay. */
  norma: string | null;
  resumen: string;
}

/**
 * Los cinco cursos que tienen convocatoria abierta. El nombre y la norma
 * son los del Excel del cliente; el resumen dice para qué habilita, sin
 * inventar temario, horas de práctica ni precio.
 */
export const CURSOS: Record<CursoId, Curso> = {
  plataformas: {
    id: "plataformas",
    nombre: "Operador de plataformas elevadoras",
    corto: "Plataformas (PEMP)",
    norma: "UNE 58923",
    resumen:
      "Para manejar plataformas elevadoras móviles de personal —tijeras, brazos articulados y telescópicos— con la formación que exige la norma.",
  },
  carretillas: {
    id: "carretillas",
    nombre: "Operador de carretillas elevadoras",
    corto: "Carretillas",
    norma: "UNE 58451 · tipo 4",
    resumen:
      "Formación del operador de carretillas de manutención conforme a la UNE 58451, en la categoría tipo 4.",
  },
  altura: {
    id: "altura",
    nombre: "Trabajos en altura",
    corto: "Trabajos en altura",
    norma: null,
    resumen:
      "Prevención del riesgo de caída: equipos de protección, puntos de anclaje y procedimientos para trabajar en altura con seguridad.",
  },
  andamios: {
    id: "andamios",
    nombre: "Montaje y desmontaje de andamios de torre móvil",
    corto: "Andamios de torre móvil",
    norma: null,
    resumen:
      "Montaje, uso y desmontaje de andamios de torre móvil siguiendo las instrucciones del fabricante y la normativa de trabajos temporales en altura.",
  },
  confinados: {
    id: "confinados",
    nombre: "Espacios confinados",
    corto: "Espacios confinados",
    norma: null,
    resumen:
      "Identificación de riesgos, medición de atmósfera y procedimientos de entrada, trabajo y rescate en espacios confinados.",
  },
};

/** El orden en que se enseñan: el que más convocatorias tiene, primero. */
export const ORDEN_CURSOS: CursoId[] = [
  "plataformas",
  "carretillas",
  "altura",
  "andamios",
  "confinados",
];

export interface SedeCurso {
  id: SedeCursoId;
  nombre: string;
  tipo: string;
  zona: string;
  direccion: string;
  cp: string;
  localidad: string;
  /** Enlace de Maps que da el propio Excel del cliente. */
  maps: string;
  telefono: string;
  tel: string;
  email: string;
}

const valencia = DELEGACIONES_POR_ID.valencia;

/** Direcciones y enlaces de Maps tal cual el Excel de convocatorias. */
export const SEDES_CURSO: Record<SedeCursoId, SedeCurso> = {
  "san-fernando": {
    id: "san-fernando",
    nombre: "San Fernando de Henares",
    tipo: "Sede de formación",
    zona: "Madrid",
    direccion: "Pol. Ind. Las Fronteras, C/ Mar Adriático con Mar Mediterráneo, 1",
    cp: "28830",
    localidad: "San Fernando de Henares (Madrid)",
    maps: "https://maps.app.goo.gl/rEFVwDXHP6VVntpP7",
    telefono: SEDE_FORMACION.telefono,
    tel: SEDE_FORMACION.tel,
    email: SEDE_FORMACION.email,
  },
  sagunto: {
    id: "sagunto",
    nombre: "Puerto de Sagunto",
    tipo: "Delegación de Valencia",
    zona: "Valencia",
    direccion: "Pol. Ind. Parc Sagunt, C/ Braç de la Creu, s/n",
    cp: "46520",
    localidad: "Puerto de Sagunto (Valencia)",
    maps: "https://maps.app.goo.gl/PvgK3FYxzyomvngw9",
    telefono: valencia.telefono ?? SEDE_FORMACION.telefono,
    tel: valencia.tel ?? SEDE_FORMACION.tel,
    email: SEDE_FORMACION.email,
  },
};

/**
 * Legislación de referencia (guion, punto 5.1). Solo normas cuya
 * referencia es inequívoca; sin años de edición de las UNE, que cambian
 * con las revisiones. Anotado en /admin/datos-pendientes para que
 * Formación la valide y complete.
 */
export const LEGISLACION = [
  {
    ref: "Ley 31/1995",
    titulo: "Prevención de Riesgos Laborales",
    nota: "Obliga a la empresa a garantizar la formación de cada trabajador en los riesgos de su puesto (art. 19).",
  },
  {
    ref: "Real Decreto 1215/1997",
    titulo: "Utilización de equipos de trabajo",
    nota: "Los equipos con riesgos específicos solo pueden manejarlos trabajadores con formación adecuada.",
  },
  {
    ref: "Real Decreto 2177/2004",
    titulo: "Trabajos temporales en altura",
    nota: "Modifica el RD 1215/1997 para escaleras de mano, andamios y técnicas de acceso con cuerdas.",
  },
  {
    ref: "UNE 58923",
    titulo: "Formación del operador de PEMP",
    nota: "Norma de referencia para la formación de operadores de plataformas elevadoras móviles de personal.",
  },
  {
    ref: "UNE 58451",
    titulo: "Formación de operadores de carretillas",
    nota: "Norma de referencia para la formación de operadores de carretillas de manutención.",
  },
] as const;

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Partes de una fecha ISO, calculadas en UTC para que no cambie de día. */
export function partesFecha(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return {
    dia: d,
    mes: MESES[m - 1],
    mesCorto: MESES_CORTOS[m - 1],
    diaSemana: DIAS[f.getUTCDay()],
    anio: a,
    claveMes: `${a}-${String(m).padStart(2, "0")}`,
  };
}

export const nombreMes = (claveMes: string) => {
  const [a, m] = claveMes.split("-").map(Number);
  const mes = MESES[m - 1];
  return `${mes[0].toUpperCase()}${mes.slice(1)} ${a}`;
};
