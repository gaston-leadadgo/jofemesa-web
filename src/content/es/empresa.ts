/**
 * Datos reales de JOFEMESA.
 *
 * REGLA DURA DEL PROYECTO: aquí no se inventa nada. Cada dato con valor
 * está publicado por el cliente. Lo que no esté verificado se deja en
 * `null` y la interfaz lo dice, en vez de rellenarlo a ojo.
 *
 * Fuentes, por orden de autoridad:
 *
 *   1. `CATÁLOGO GENERAL DE MAQUINARIA JOFEMESA.pdf` y su edición
 *      portuguesa de 2026 — material comercial vigente entregado por el
 *      cliente. De aquí salen las direcciones, teléfonos y correos de
 *      todas las delegaciones, incluidas las dos de Portugal, que su web
 *      actual no publica en ninguna parte.
 *   2. jofemesa.com (agosto de 2026) y su blog.
 *   3. Creatividades propias del cliente (la lámina de iconografía que
 *      pasó en la reunión de seguimiento del 24/08/2026).
 *
 * Lo que la reunión de seguimiento dejó cerrado y afecta a este fichero:
 *
 *   · «Desde 1987» tiene que ganar relevancia en la portada.
 *   · NO se puede decir que la flota sea nueva. Jorge lo desmintió por
 *     teléfono: «hay máquinas que están nuevas, pero hay máquinas que
 *     tienen un montón de años; eso no lo puedo poner». Cuando amplíen
 *     catálogo se hablará de «nuevo catálogo», nunca de «flota nueva».
 */

export const EMPRESA = {
  nombre: "JOFEMESA",
  razonSocial: "JOFEME S.A.",
  cif: "A33098948",
  fundacion: 1987,
  /** Fecha exacta, de la lámina de iconografía del propio cliente. */
  fundacionIso: "1987-03-24",
  /** Se calcula. Su web actual sigue diciendo «tres décadas». */
  get anios() {
    return new Date().getFullYear() - this.fundacion;
  },
  domicilioSocial:
    "Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés",
  web: "https://www.jofemesa.com",
} as const;

/** Teléfono principal. Un solo sitio: cambiarlo aquí arregla todos los tel:. */
export const TELEFONO_PRINCIPAL = {
  visible: "91 361 31 31",
  tel: "+34913613131",
} as const;

export const EMAIL_PRINCIPAL = "jofemesa@jofemesa.com";

export const WHATSAPP = {
  /** Pendiente de que el cliente confirme un número de WhatsApp Business. */
  numero: null as string | null,
};

export type Pais = "España" | "Portugal";

export type DelegacionId =
  | "madrid"
  | "asturias"
  | "valladolid"
  | "valencia"
  | "castellon"
  | "alicante"
  | "sevilla"
  | "malaga"
  | "oporto"
  | "lisboa";

export interface Delegacion {
  id: DelegacionId;
  nombre: string;
  provincia: string;
  pais: Pais;
  direccion: string | null;
  cp: string | null;
  localidad: string | null;
  telefono: string | null;
  tel: string | null;
  email: string | null;
  /** No publican horarios en ninguna página. No se inventan. */
  horario: string | null;
  /** Servicios verificados: unidades de negocio propias que sí documentan. */
  servicios: string[];
  /**
   * Posición sobre el mapa peninsular, en porcentaje.
   * Calculada desde la longitud y la latitud reales de cada dirección:
   * x = (lon + 9,6) / 13,1 · 100 e y = (44 − lat) / 8,2 · 100, que es
   * la misma proyección que usa el trazado de la península en <Mapa>.
   */
  mapa: { x: number; y: number };
  /** Sede central de alquiler. */
  central?: boolean;
}

export const DELEGACIONES: readonly Delegacion[] = [
  {
    id: "madrid",
    nombre: "Madrid",
    provincia: "Madrid",
    pais: "España",
    direccion: "A-2 dirección Barcelona, km 15,300 (vía de servicio)",
    cp: "28022",
    localidad: "Madrid",
    telefono: "91 361 31 31",
    tel: "+34913613131",
    email: "jofemesamadrid@jofemesa.com",
    horario: null,
    servicios: [
      "Sede central de alquiler",
      "Parque de elevación y maquinaria de obra",
      "Taller y asistencia técnica móvil",
    ],
    mapa: { x: 46.0, y: 43.3 },
    central: true,
  },
  {
    id: "asturias",
    nombre: "Asturias",
    provincia: "Asturias",
    pais: "España",
    direccion: "Parque Empresarial Principado de Asturias, Avda. del Aluminio, 20",
    cp: "33490",
    localidad: "Avilés",
    telefono: "985 985 212",
    tel: "+34985985212",
    email: "jofemesa@jofemesa.com",
    horario: null,
    servicios: [
      "Domicilio social y origen de la empresa",
      "Venta y recambios de manutención",
      "Distribución Jungheinrich",
    ],
    mapa: { x: 28.1, y: 5.5 },
  },
  {
    id: "valladolid",
    nombre: "Valladolid",
    provincia: "Valladolid",
    pais: "España",
    direccion: "Polígono Industrial San Cristóbal, C/ Pirita, 2",
    cp: "47012",
    localidad: "Valladolid",
    telefono: "983 525 363",
    tel: "+34983525363",
    email: "valladolid@jofemesa.com",
    horario: null,
    servicios: ["Plataformas elevadoras", "Carretillas industriales"],
    mapa: { x: 37.4, y: 28.9 },
  },
  {
    id: "valencia",
    nombre: "Valencia",
    provincia: "Valencia",
    pais: "España",
    direccion: "Polígono Industrial Parc Sagunt, C/ Braç de la Creu, s/n",
    cp: "46520",
    localidad: "Puerto de Sagunto",
    telefono: "96 268 05 81",
    tel: "+34962680581",
    email: "valencia@jofemesa.com",
    horario: null,
    servicios: [
      "Elevación y maquinaria de obra",
      "Servicio de estiba en puerto",
    ],
    mapa: { x: 71.5, y: 53.2 },
  },
  {
    id: "castellon",
    nombre: "Castellón",
    provincia: "Castellón",
    pais: "España",
    direccion: "Polígono Les Forques, Camí Plá de Museros, nave 3",
    cp: "12550",
    localidad: "Almassora",
    telefono: "902 220 252",
    tel: "+34902220252",
    email: "castellon@jofemesa.com",
    horario: null,
    servicios: ["Sector cerámico e industrial", "Elevación y manipulación"],
    mapa: { x: 72.8, y: 49.5 },
  },
  {
    id: "alicante",
    nombre: "Alicante",
    provincia: "Alicante",
    pais: "España",
    direccion: "Carretera d'Ocaña, 64D",
    cp: "03006",
    localidad: "Alicante",
    telefono: "965 74 21 75",
    tel: "+34965742175",
    email: "alquileresalicante@jofemesa.com",
    horario: null,
    servicios: ["Elevación para edificación e industria"],
    mapa: { x: 69.6, y: 68.9 },
  },
  {
    id: "sevilla",
    nombre: "Sevilla",
    provincia: "Sevilla",
    pais: "España",
    direccion: "Polígono Industrial Polysol, C/ Polysol Tres, 6",
    cp: "41500",
    localidad: "Alcalá de Guadaíra",
    telefono: "955 77 63 63",
    tel: "+34955776363",
    email: "jofemesasevilla@jofemesa.com",
    horario: null,
    servicios: ["Elevación y movimiento de tierras", "Taller y recambios"],
    mapa: { x: 28.7, y: 81.2 },
  },
  {
    id: "malaga",
    nombre: "Málaga",
    provincia: "Málaga",
    pais: "España",
    direccion: "Polígono Industrial Guadalhorce, C/ Hermanas Bronte, 70",
    cp: "29004",
    localidad: "Málaga",
    telefono: "951 173 730",
    tel: "+34951173730",
    email: "alquileresmalaga@jofemesa.com",
    horario: null,
    servicios: ["Elevación para infraestructura y edificación"],
    mapa: { x: 39.0, y: 88.8 },
  },
  {
    id: "oporto",
    nombre: "Oporto",
    provincia: "Oporto",
    pais: "Portugal",
    direccion: "Rua Central do Olival, n.º 7494",
    cp: "4415-957",
    localidad: "Vila Nova de Gaia",
    telefono: "+351 220 946 176",
    tel: "+351220946176",
    email: "logistica.porto@jofemesa.com",
    horario: null,
    servicios: ["Plataformas elevadoras", "Logística del norte"],
    mapa: { x: 7.6, y: 35.1 },
  },
  {
    id: "lisboa",
    nombre: "Lisboa",
    provincia: "Setúbal",
    pais: "Portugal",
    direccion: "Quinta da Marquesa I, junto a Autoeuropa",
    cp: "2954-024",
    localidad: "Quinta do Anjo, Palmela",
    telefono: "+351 211 333 790",
    tel: "+351211333790",
    email: "jofemesa.portugal@jofemesa.com",
    horario: null,
    servicios: ["Alquiler de equipos", "Asistencia técnica"],
    mapa: { x: 5.0, y: 66.1 },
  },
] as const;

export const DELEGACIONES_POR_ID = Object.fromEntries(
  DELEGACIONES.map((d) => [d.id, d]),
) as Record<DelegacionId, Delegacion>;

/** Todas tienen teléfono publicado, así que todas son operativas. */
export const DELEGACIONES_OPERATIVAS = DELEGACIONES.filter(
  (d) => d.telefono !== null,
);

export const DELEGACIONES_ESPANA = DELEGACIONES.filter(
  (d) => d.pais === "España",
);

export const DELEGACIONES_PORTUGAL = DELEGACIONES.filter(
  (d) => d.pais === "Portugal",
);

/**
 * Centros que no son delegación de alquiler pero sí dirección propia con
 * teléfono y correo distintos. Salen los dos del catálogo general.
 */
export const CENTROS = [
  {
    id: "formacion",
    nombre: "Central de Formación",
    direccion: "Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1",
    cp: "28830",
    localidad: "San Fernando de Henares, Madrid",
    telefono: "649 755 883",
    tel: "+34649755883",
    email: "formacion@jofemesa.com",
  },
  {
    id: "takeuchi",
    nombre: "Distribuidor oficial Takeuchi",
    direccion: "Polígono Industrial Las Fronteras, C/ Mar Mediterráneo, 1",
    cp: "28830",
    localidad: "San Fernando de Henares, Madrid",
    telefono: "680 800 215",
    tel: "+34680800215",
    email: "ventastakeuchi@jofemesa.com",
  },
] as const;

export const CERTIFICACIONES = [
  {
    id: "iso-9001",
    nombre: "ISO 9001",
    descripcion: "Gestión de la calidad",
  },
  {
    id: "iso-14001",
    nombre: "ISO 14001",
    descripcion: "Gestión ambiental",
  },
  {
    id: "iso-45001",
    nombre: "ISO 45001",
    descripcion: "Seguridad y salud en el trabajo",
  },
] as const;

/**
 * Homologaciones de formación, tal y como aparecen en la contraportada
 * del catálogo general: el sello IPAF y los dos de AENOR con su norma.
 */
export const HOMOLOGACIONES = [
  {
    id: "ipaf",
    nombre: "IPAF",
    descripcion: "Centro de formación homologado",
  },
  {
    id: "aenor-pemp",
    nombre: "AENOR · UNE 58923",
    descripcion: "Formación de operadores de PEMP",
  },
  {
    id: "aenor-carretillas",
    nombre: "AENOR · UNE 58451",
    descripcion: "Formación de operadores de carretillas",
  },
] as const;

export const AFILIACIONES = [
  { id: "anapat", nombre: "ANAPAT", descripcion: "Asociación del sector" },
  { id: "aseamac", nombre: "ASEAMAC", descripcion: "Alquiler de maquinaria" },
  {
    id: "jungheinrich",
    nombre: "Jungheinrich",
    descripcion: "Partner oficial",
  },
] as const;

/** Fabricantes cuya maquinaria está en el catálogo general vigente. */
export const FABRICANTES_FLOTA = [
  { nombre: "Genie", area: "Tijeras, brazos y telescópicas" },
  { nombre: "JLG", area: "Brazos, telescópicas y orugas" },
  { nombre: "Haulotte", area: "Tijeras, mástiles y brazos" },
  { nombre: "Manitou", area: "Manipuladores y carretillas" },
  { nombre: "Jungheinrich", area: "Partner de intralogística" },
  { nombre: "Takeuchi", area: "Retroexcavadoras" },
  { nombre: "JCB", area: "Retrocargadoras y tijeras" },
  { nombre: "Snorkel", area: "Tijeras y brazos" },
  { nombre: "Ausa", area: "Dúmperes 4x4" },
  { nombre: "Bomag", area: "Compactación" },
  { nombre: "Hamm", area: "Rodillos" },
  { nombre: "Wacker Neuson", area: "Compactación y carga" },
  { nombre: "Atlas Copco", area: "Aire comprimido y energía" },
  { nombre: "Himoinsa", area: "Grupos electrógenos" },
  { nombre: "Dagartech", area: "Grupos electrógenos" },
  { nombre: "Hilti", area: "Herramienta de obra" },
] as const;

/**
 * Cifra de la propia lámina del cliente. Se publica porque es suya, no
 * nuestra, y queda anotada en DATOS_PENDIENTES para que la confirme.
 */
export const FLOTA = {
  equipos: "+5.000",
  nota: "Cifra de la creatividad entregada el 24/08/2026.",
} as const;

/**
 * Suyo, y hoy enterrado en su web. Especialmente bueno para una
 * empresa con delegación propia en cada provincia donde opera.
 */
export const LEMA = "Llegamos lejos para estar cerca.";

/** El de su blog, que firma todas las entradas. */
export const LEMA_EQUIPO = "Un equipo de profesionales siempre a tu disposición";

/**
 * Lo que NO sabemos y por tanto NO se escribe en ninguna página.
 * Esta lista alimenta /admin/datos-pendientes.
 */
export const DATOS_PENDIENTES = [
  {
    campo: "Horarios de apertura",
    nota: "No publicados en ninguna página de jofemesa.com ni en el catálogo general. La web dice «llámanos» en vez de inventar un horario.",
  },
  {
    campo: "Tamaño de flota",
    nota: "La lámina entregada el 24/08/2026 dice «+5.000 equipos en flota». Está publicado con esa cifra: hay que confirmarla antes de salir a producción.",
  },
  {
    campo: "Antigüedad de la flota",
    nota: "Jorge desmintió por teléfono que la flota sea nueva: hay máquinas nuevas y máquinas de muchos años. Ningún claim de la web dice «flota nueva». Cuando amplíen catálogo se hablará de «nuevo catálogo».",
  },
  {
    campo: "Número de WhatsApp Business",
    nota: "La barra móvil lo necesita para el botón de WhatsApp. Mientras no esté, la barra sale con dos acciones en vez de tres.",
  },
  {
    campo: "Certificados ISO en PDF",
    nota: "Los enlaces de la web actual (/images/certifications/*.pdf) devuelven una página HTML vacía con código 200. Hacen falta los documentos reales.",
  },
  {
    campo: "Delegación de Castellón",
    nota: "El catálogo general la nombra en la portada pero no le da ficha de contacto. La dirección y el 902 vienen de jofemesa.com: conviene confirmarlos.",
  },
  {
    campo: "Fichas técnicas de manutención, tierras y energía",
    nota: "Están las 34 fichas de elevación. Para manutención de cargas, movimiento de tierras, compactación y energía el catálogo general solo da tablas, así que esas máquinas salen con las cifras del catálogo y sin PDF.",
  },
  {
    campo: "Fotografía de manutención, tierras y energía",
    nota: "Hay 27 fotos oficiales de JOFEMESA de tijeras eléctricas, diésel e híbridas. El resto del catálogo sale con dibujo técnico hasta que lleguen las fotografías de esas familias.",
  },
  {
    campo: "Contenido de Formación",
    nota: "Acordado en la reunión: se nombra dentro de Servicios pero no se desarrolla hasta que estén el calendario de convocatorias y el catálogo de cursos.",
  },
  {
    campo: "Migración del blog",
    nota: "Hay unas 267 entradas reales en /blogs/. Las 14 últimas están cargadas con título, fecha y entradilla verificados; el cuerpo sigue en el servidor actual y la tarjeta enlaza allí hasta que se migre.",
  },
] as const;
