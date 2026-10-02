import { DELEGACIONES_POR_ID, SEDE_FORMACION } from "./empresa";

/**
 * Formación a clientes.
 *
 * El cliente pidió darle mucha más importancia (reunión del 28/09/2026)
 * y el guion de estructura web la sube a menú principal con tres partes:
 * legislación de referencia, catálogo de cursos y calendario nacional.
 *
 * Cursos y convocatorias. Este fichero es la forma de los datos. Está pensado para que el panel
 * de WordPress lo sustituya uno a uno: cada convocatoria es una fila con
 * curso, fecha, sede y —cuando lo gestionen— plazas y ocupación.
 */

/** Los cursos que tienen convocatoria abierta en el calendario. */
export type CursoConvocatoriaId =
  | "carretillas"
  | "plataformas"
  | "altura"
  | "andamios"
  | "confinados";

/** Los que se imparten a medida o bajo demanda, sin fecha fija. */
export type CursoMedidaId =
  | "ipaf"
  | "movimiento-de-tierras"
  | "carretillas-mas-10000-kg"
  | "gondolas-suspendidas"
  | "puente-grua"
  | "camion-pluma"
  | "estiba-y-eslingado";

export type CursoId = CursoConvocatoriaId | CursoMedidaId;

export type SedeCursoId = "san-fernando" | "sagunto";

export interface Convocatoria {
  id: string;
  curso: CursoConvocatoriaId;
  /** ISO, sin hora: la zona horaria no puede mover una convocatoria de día. */
  fecha: string;
  sede: SedeCursoId;
  inicio: string;
  fin: string;
  /** Plazas totales. `null` = aún no gestionado desde el panel. */
  plazas: number | null;
  /** Plazas ocupadas. `null` = aún no gestionado. */
  ocupadas: number | null;
}

/**
 * Una pregunta de la ficha del curso. `{calendario}` dentro de un párrafo
 * se pinta como enlace al calendario de convocatorias: es el «(vínculo)»
 * que marca el documento del cliente.
 */
export interface PreguntaCurso {
  p: string;
  r: string[];
}

export interface Curso {
  id: CursoId;
  /** El título tal cual el documento de Formación. */
  titulo: string;
  /** Nombre para listas y filas del calendario. */
  nombre: string;
  /** Nombre corto para chips y filtros. */
  corto: string;
  /** Norma que se enseña en chip, cuando la hay. */
  norma: string | null;
  /** Quién certifica el curso, si lo certifica alguien. */
  certificacion: string | null;
  /** Reales decretos que cumple, tal cual el documento. */
  normativa: string[];
  /** Duración resumida para la ficha y la tarjeta. */
  duracion: string;
  modalidad: string;
  descripcion: string;
  /** Primera frase de «¿Quién necesita esta formación?», para la tarjeta. */
  paraQuien: string;
  preguntas: PreguntaCurso[];
}

const NOTA_EPI =
  "Nota: En tu día a día, por la naturaleza de las instalaciones donde trabajes, te pueden obligar a utilizar más equipos de protección individual";

/*
 * El documento repite en TODOS los cursos la pregunta «¿Qué equipos de
 * protección individual necesito para realizar el curso o trabajar con una
 * Plataforma Elevadora?», también en puente grúa o en carretillas. Es un
 * arrastre de plantilla: la coletilla de la plataforma se deja solo en los
 * dos cursos de plataformas. Anotado en /admin/datos-pendientes.
 */
const EPI_PLATAFORMA =
  "¿Qué equipos de protección individual necesito para realizar el curso o trabajar con una Plataforma Elevadora?";
const EPI = "¿Qué equipos de protección individual necesito para realizar el curso?";

const GRUPO =
  "Estos cursos pueden realizarse también a medida, ya sea en instalaciones de nuestros clientes como en las instalaciones de Jofemesa, contacta con nosotros y te asesoraremos.";

/**
 * Los doce cursos, transcritos de «Listado de cursos con espacio para
 * descripciones.docx» (Material/Cursos, entregado el 02/10/2026). Los cinco
 * primeros tienen convocatoria abierta; el resto se imparte a medida.
 */
export const CURSOS: Record<CursoId, Curso> = {
  plataformas: {
    id: "plataformas",
    titulo: "Operador de Plataformas Elevadoras Móviles de Personal, Norma UNE 58923",
    nombre: "Operador de plataformas elevadoras",
    corto: "Plataformas (PEMP)",
    norma: "UNE 58923",
    certificacion: "Certificado por AENOR",
    normativa: ["RD 1215/97"],
    duracion: "8 h · 4 teóricas + 4 prácticas",
    modalidad: "Convocatoria abierta o a medida",
    descripcion:
      "Curso de capacitación de uso y manejo de Operadores de Plataformas Elevadoras Móviles de Personal certificado por AENOR en la Norma UNE 58923 y en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien:
      "Todos los trabajadores que utilizarán en su jornada laboral Plataformas Elevadoras Móviles de Personal.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilizarán en su jornada laboral Plataformas Elevadoras Móviles de Personal."],
      },
      {
        p: EPI_PLATAFORMA,
        r: ["Arnés completo + cabo de amarre, casco con barbuquejo y Calzado de Seguridad 100% obligatorios.", NOTA_EPI],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Disponemos de cursos en convocatoria abierta, consulta nuestro {calendario} de 8 horas de duración (4 horas teóricas + 4 horas prácticas)."],
      },
      { p: "¿Dispones de un grupo a formar?", r: [GRUPO] },
    ],
  },
  altura: {
    id: "altura",
    titulo: "Trabajos en Altura",
    nombre: "Trabajos en altura",
    corto: "Trabajos en altura",
    norma: null,
    certificacion: null,
    normativa: ["RD 2177/2004", "RD 1215/97"],
    duracion: "8 h · 4 teóricas + 4 prácticas",
    modalidad: "Convocatoria abierta o a medida",
    descripcion:
      "Curso teórico-práctico en cumplimiento del RD 2177/2004 de trabajos temporales en altura y RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que realicen trabajos temporales en altura.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que realicen trabajos temporales en altura. Este curso está orientado a trabajadores que trabajan en cubiertas, torres, postes y realizan progresiones por estructuras."],
      },
      {
        p: EPI,
        r: ["Arnés completo + cabo de amarre, casco con barbuquejo, Calzado de Seguridad y guantes 100% obligatorios.", NOTA_EPI],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Disponemos de cursos en convocatoria abierta, consulta nuestro {calendario} de 8 horas de duración (4 horas teóricas + 4 horas prácticas)."],
      },
      { p: "¿Dispones de un grupo a formar?", r: [GRUPO] },
    ],
  },
  confinados: {
    id: "confinados",
    titulo: "Trabajos en Espacios Confinados",
    nombre: "Trabajos en espacios confinados",
    corto: "Espacios confinados",
    norma: null,
    certificacion: null,
    normativa: ["RD 2177/2004", "RD 1215/97"],
    duracion: "8 h · 4 teóricas + 4 prácticas",
    modalidad: "Convocatoria abierta o a medida",
    descripcion:
      "Curso teórico-práctico en cumplimiento del RD 2177/2004 de trabajos temporales en altura y RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que realicen trabajos en espacios confinados.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que realicen trabajos en espacios confinados. Este curso está orientado a trabajadores que trabajan en cualquier tipo de espacio confinado (tuberías, alcantarillas, sótanos, silos, pozos, etc.)"],
      },
      {
        p: EPI,
        r: [
          "Arnés completo + cabo de amarre, casco con barbuquejo, Calzado de Seguridad y guantes 100% obligatorios.",
          "Nota: En tu día a día, por la naturaleza de las instalaciones donde trabajes, te pueden obligar a utilizar más equipos de protección individual como equipos de respiración autónoma (ERA), detector de gases, etc.",
        ],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Disponemos de cursos en convocatoria abierta, consulta nuestro {calendario} de 8 horas de duración (4 horas teóricas + 4 horas prácticas)."],
      },
      { p: "¿Dispones de un grupo a formar?", r: [GRUPO] },
    ],
  },
  andamios: {
    id: "andamios",
    titulo: "Montaje/Desmontaje de Andamios de Torre Móvil",
    nombre: "Montaje y desmontaje de andamios de torre móvil",
    corto: "Andamios de torre móvil",
    norma: null,
    certificacion: null,
    normativa: ["RD 2177/2004", "RD 1215/97"],
    duracion: "8 h · 4 teóricas + 4 prácticas",
    modalidad: "Convocatoria abierta o a medida",
    descripcion:
      "Curso teórico-práctico en cumplimiento del RD 2177/2004 de trabajos temporales en altura y RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que realicen montajes, desmontajes y uso de Andamios de Torre Móvil.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que realicen montajes, desmontajes y uso de Andamios de Torre Móvil."],
      },
      {
        p: EPI,
        r: ["Arnés completo + cabo de amarre, casco con barbuquejo, Calzado de Seguridad y guantes 100% obligatorios.", NOTA_EPI],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Disponemos de cursos en convocatoria abierta, consulta nuestro {calendario} de 8 horas de duración (4 horas teóricas + 4 horas prácticas)."],
      },
      { p: "¿Dispones de un grupo a formar?", r: [GRUPO] },
    ],
  },
  carretillas: {
    id: "carretillas",
    titulo: "Operador de Carretillas de Manutención hasta 10.000 kg, Norma UNE 58451",
    nombre: "Operador de carretillas elevadoras",
    corto: "Carretillas",
    /* La convocatoria del Excel es la del tipo 4; el documento añade el 6. */
    norma: "UNE 58451 · tipo 4",
    certificacion: "Certificado por AENOR",
    normativa: ["RD 1215/97"],
    duracion: "8 h · 6 teóricas + 2 prácticas",
    modalidad: "Convocatoria abierta o a medida",
    descripcion:
      "Curso teórico-práctico Certificado por AENOR en Norma UNE 58451 y en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien:
      "Todos los trabajadores que utilicen Carretillas Elevadoras Autopropulsadas que se encuentren dentro de la Norma UNE 58451.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilicen Carretillas Elevadoras Autopropulsadas que se encuentren dentro de la Norma UNE 58451."],
      },
      { p: EPI, r: ["Calzado de seguridad.", NOTA_EPI] },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Disponemos de cursos en convocatoria abierta de Carretillas Elevadoras de Categoría II – Tipo 4 – Frontales contrapesadas y de Carretillas Elevadoras de Categoría II – Tipo 6 - Retráctiles, consulta nuestro {calendario} de 8 horas de duración (6 horas teóricas + 2 horas prácticas)."],
      },
      {
        p: "¿Dispones de un grupo a formar?",
        r: ["¿Tienes necesidad de formar o formarte en el resto de Carretillas Elevadoras Autopropulsadas de Categoría I – Tipo 1 transpaletas, Tipo 2 – Tractoras de Arrastre, Tipo 3 – Apiladores y/o de Categoría II – Tipo 5 – Manipuladores, Tipo 7 – Recogepedidos de Gran Altura y/o Tipo 9 – Carretillas Todoterreno? Ponte en contacto con nosotros, coméntanos tus necesidades y te asesoraremos para cursos a medida en tus instalaciones, en las nuestras o posibles convocatorias abiertas a futuro."],
      },
    ],
  },

  /* ---------- Resto de cursos: a medida ---------- */

  ipaf: {
    id: "ipaf",
    titulo: "Programa de formación IPAF de operadores de PEMP/PTAS",
    nombre: "Programa de formación IPAF de operadores de PEMP/PTAS",
    corto: "IPAF",
    norma: "UNE 58923 · ISO 18878",
    certificacion: "Certificado por Bureau Veritas",
    normativa: ["RD 1215/97"],
    duracion: "Presencial o semipresencial",
    modalidad: "A medida · presupuesto",
    descripcion:
      "Curso de capacitación de uso y manejo de Operadores de Plataformas Elevadoras Móviles de Personal certificado por Bureau Veritas en la Norma UNE 58923 e ISO 18878 estándar internacional que establece los requisitos para la formación de los operadores y en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien:
      "Todos los trabajadores que utilizarán en su jornada laboral Plataformas Elevadoras Móviles de Personal y que quieran cumplir los estándares formativos de IPAF.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilizarán en su jornada laboral Plataformas Elevadoras Móviles de Personal y que, quiera cumplir los estándares formativos de IPAF (International Powered Access Federation)"],
      },
      {
        p: EPI_PLATAFORMA,
        r: ["Arnés completo + cabo de amarre, casco con barbuquejo y Calzado de Seguridad 100% obligatorios.", NOTA_EPI],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Solicítanos presupuesto e información. Estos cursos se pueden realizar 100% presenciales o semipresenciales a través del Módulo Elearning de IPAF, donde realizarás la parte teórica online y el examen presencial con equipos reales."],
      },
      {
        p: "¿Dispones de un grupo a formar?",
        r: ["Estos cursos pueden realizarse también a medida, 100% presenciales o semipresenciales, ya sea en instalaciones de nuestros clientes como en las instalaciones de Jofemesa, contacta con nosotros y te asesoraremos."],
      },
    ],
  },
  "movimiento-de-tierras": {
    id: "movimiento-de-tierras",
    titulo: "Operadores de Equipos de Movimiento de Tierras, Excavación y Compactación",
    nombre: "Operadores de equipos de movimiento de tierras, excavación y compactación",
    corto: "Movimiento de tierras",
    norma: null,
    certificacion: null,
    normativa: ["RD 1215/97"],
    duracion: "8, 12 o 16 h",
    modalidad: "En abierto o a medida",
    descripcion: "Cursos teórico-prácticos en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que utilicen equipos de Movimiento de Tierras, Excavación y/o compactación.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilicen equipos de Movimiento de Tierras, Excavación y/o compactación."],
      },
      { p: EPI, r: ["Calzado de seguridad y Casco Protector de la cabeza.", NOTA_EPI] },
      {
        p: "¿Sabes en qué equipos te quieres formar?",
        r: ["Realizamos formaciones teórico-prácticas sobre retroexcavadoras, retrocargadoras mixtas, mini cargadoras, palas cargadoras, rodillos de compactación y dúmper, ponte en contacto con nosotros y te asesoramos."],
      },
      {
        p: "¿Cuándo puedo realizar los cursos y cuánto duran?",
        r: ["Los cursos pueden tener una duración de 8 horas teórico-prácticas presenciales sobre un tipo de máquina hasta los grandes cursos combinados con distintos equipos (a tu elección) de 12 y 16 horas teórico-prácticos presenciales. Realizamos cursos en abierto y cursos a medida, ya sea en instalaciones de nuestros clientes o en las nuestras propias de Jofemesa, ponte en contacto con nosotros y te asesoraremos sobre tus necesidades."],
      },
    ],
  },
  "carretillas-mas-10000-kg": {
    id: "carretillas-mas-10000-kg",
    titulo: "Operador de Carretillas Elevadoras Autopropulsadas de más de 10.000 kg y/o Reach Stacker/Portacontenedores",
    nombre: "Operador de carretillas de más de 10.000 kg, reach stacker y portacontenedores",
    corto: "Carretillas +10.000 kg",
    norma: null,
    certificacion: null,
    normativa: ["RD 1215/97"],
    duracion: "8 h · 4 teóricas + 4 prácticas",
    modalidad: "A medida en tus instalaciones",
    descripcion: "Cursos teórico-prácticos en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que utilicen Carretillas de más de 10.000 Kg, Reach Stacker o Carretillas Portacontenedores.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilicen Carretillas de más de 10.000 Kg, Reach Stacker o Carretillas Portacontenedores."],
      },
      { p: EPI, r: ["Calzado de seguridad.", NOTA_EPI] },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura? ¿Dispones de un grupo a formar?",
        r: ["Podemos realizar cursos a medida en instalaciones de nuestros clientes con los equipos que utilizarán en su día a día, estos cursos pueden tener una duración de 8 horas de duración (4 horas teóricas + 4 horas prácticas)."],
      },
    ],
  },
  "gondolas-suspendidas": {
    id: "gondolas-suspendidas",
    titulo: "Operadores de Góndolas Suspendidas",
    nombre: "Operadores de góndolas suspendidas",
    corto: "Góndolas suspendidas",
    norma: null,
    certificacion: null,
    normativa: ["RD 2177/2004", "RD 1215/97"],
    duracion: "De 5 a 8 h",
    modalidad: "Solo en tus instalaciones",
    descripcion:
      "Curso teórico-práctico en cumplimiento del RD 2177/2004 de trabajos temporales en altura y RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que realicen trabajos temporales en altura.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que realicen trabajos temporales en altura. Este curso está orientado a trabajadores que trabajan en cubiertas, torres, postes y realizan progresiones por estructuras."],
      },
      {
        p: EPI,
        r: ["Arnés completo + cabo de amarre, casco con barbuquejo, Calzado de Seguridad y guantes 100% obligatorios.", NOTA_EPI],
      },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura? ¿Dispones de un grupo a formar?",
        r: ["Estos cursos solo podemos realizarlo en las instalaciones de nuestros clientes con las góndolas suspendidas que dispongan en sus instalaciones y pueden tener una duración de 5 a 8 horas teórico-prácticas presenciales dependiendo de los trabajadores a formar, ponte en contacto con nosotros y te asesoraremos."],
      },
    ],
  },
  "puente-grua": {
    id: "puente-grua",
    titulo: "Operador de Puente Grúa",
    nombre: "Operador de puente grúa",
    corto: "Puente grúa",
    norma: null,
    certificacion: null,
    normativa: ["RD 1215/97"],
    duracion: "De 5 a 8 h",
    modalidad: "A medida en tus instalaciones",
    descripcion: "Cursos teórico-prácticos en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que utilicen puentes grúa y polipastos.",
    preguntas: [
      { p: "¿Quién necesita esta formación?", r: ["Todos los trabajadores que utilicen puentes grúa y polipastos"] },
      { p: EPI, r: ["Calzado de seguridad, guantes y casco protector de la cabeza.", NOTA_EPI] },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Podemos realizar cursos a medida en instalaciones de nuestros clientes con los equipos que utilizarán en su día a día, estos cursos pueden tener una duración de 5 a 8 horas teórico-prácticas presenciales de duración dependiendo del nº de personas a formar, ponte en contacto con nosotros y te asesoramos."],
      },
    ],
  },
  "camion-pluma": {
    id: "camion-pluma",
    titulo: "Operador de Camión Pluma (GHA)",
    nombre: "Operador de camión pluma (GHA)",
    corto: "Camión pluma (GHA)",
    norma: null,
    certificacion: null,
    normativa: ["RD 1215/97"],
    duracion: "De 5 a 8 h",
    modalidad: "A medida en tus instalaciones",
    descripcion: "Cursos teórico-prácticos en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que utilicen Grúas Hidráulicas Articuladas (GHA) – Camiones Pluma.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que utilicen Grúas Hidráulicas Articuladas (GHA) – Camiones Pluma"],
      },
      { p: EPI, r: ["Calzado de seguridad, guantes y casco protector de la cabeza.", NOTA_EPI] },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Podemos realizar cursos a medida en instalaciones de nuestros clientes con los equipos que utilizarán en su día a día, estos cursos pueden tener una duración de 5 a 8 horas teórico-prácticas presenciales de duración dependiendo del nº de personas a formar, ponte en contacto con nosotros y te asesoramos."],
      },
    ],
  },
  "estiba-y-eslingado": {
    id: "estiba-y-eslingado",
    titulo: "Estiba y Eslingado de Cargas",
    nombre: "Estiba y eslingado de cargas",
    corto: "Estiba y eslingado",
    norma: null,
    certificacion: null,
    normativa: ["RD 1215/97"],
    duracion: "De 5 a 8 h",
    modalidad: "A medida en tus instalaciones",
    descripcion: "Cursos teórico-prácticos en cumplimiento del RD 1215/97 de equipos de trabajo.",
    paraQuien: "Todos los trabajadores que realicen arriostrado, elevación, eslingado y suspensión de cargas.",
    preguntas: [
      {
        p: "¿Quién necesita esta formación?",
        r: ["Todos los trabajadores que realicen arriostrado, elevación, eslingado y suspensión de cargas."],
      },
      { p: EPI, r: ["Calzado de seguridad, guantes y casco protector de la cabeza.", NOTA_EPI] },
      {
        p: "¿Cuándo puedo realizar el curso y cuánto dura?",
        r: ["Podemos realizar cursos a medida en instalaciones de nuestros clientes con los equipos y el material que utilizarán en su día a día, estos cursos pueden tener una duración de 5 a 8 horas teórico-prácticas presenciales de duración dependiendo del nº de personas a formar, ponte en contacto con nosotros y te asesoramos."],
      },
    ],
  },
};

/** Los de convocatoria abierta, en el orden del documento de Formación. */
export const ORDEN_CURSOS: CursoConvocatoriaId[] = [
  "plataformas",
  "altura",
  "confinados",
  "andamios",
  "carretillas",
];

/** «Resto de cursos», en el orden del documento. */
export const ORDEN_A_MEDIDA: CursoMedidaId[] = [
  "ipaf",
  "movimiento-de-tierras",
  "carretillas-mas-10000-kg",
  "gondolas-suspendidas",
  "puente-grua",
  "camion-pluma",
  "estiba-y-eslingado",
];

export const TODOS_LOS_CURSOS: CursoId[] = [...ORDEN_CURSOS, ...ORDEN_A_MEDIDA];

export const esCursoConvocatoria = (id: CursoId): id is CursoConvocatoriaId =>
  (ORDEN_CURSOS as CursoId[]).includes(id);

export const esCursoId = (v: string | null | undefined): v is CursoId =>
  !!v && v in CURSOS;

/** Valor del formulario para un curso que no está en el catálogo. */
export const OTRO_CURSO = "otro";
export type CursoSolicitado = CursoId | typeof OTRO_CURSO;
export const esCursoSolicitado = (v: string | null | undefined): v is CursoSolicitado =>
  v === OTRO_CURSO || esCursoId(v);

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
