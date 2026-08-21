/**
 * Datos reales de JOFEMESA, verificados en jofemesa.com (agosto 2026).
 *
 * REGLA DURA DEL PROYECTO: aquí no se inventa nada. Cada dato con valor
 * está publicado por el cliente. Lo que no esté verificado se deja en
 * `null` y la interfaz lo dice, en vez de rellenarlo a ojo.
 */

export const EMPRESA = {
  nombre: "JOFEMESA",
  razonSocial: "JOFEME S.A.",
  cif: "A33098948",
  fundacion: 1987,
  /** Se calcula: su web actual sigue diciendo "tres décadas". */
  get anios() {
    return new Date().getFullYear() - this.fundacion;
  },
  domicilioSocial:
    "Avda. del Aluminio, 20 — Parque Empresarial del Principado de Asturias, 33490 Avilés",
} as const;

/** Teléfono principal. Un solo sitio: cambiarlo aquí arregla todos los tel:. */
export const TELEFONO_PRINCIPAL = {
  visible: "91 361 31 31",
  tel: "+34913613131",
} as const;

export const WHATSAPP = {
  /** Pendiente de que el cliente confirme un número de WhatsApp Business. */
  numero: null as string | null,
};

export type Pais = "España" | "Portugal";

export type DelegacionId =
  | "madrid"
  | "asturias"
  | "valencia"
  | "castellon"
  | "malaga"
  | "sevilla"
  | "valladolid"
  | "alicante"
  | "portugal";

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
  /** Coordenadas en porcentaje sobre el mapa peninsular. */
  mapa: { x: number; y: number };
}

export const DELEGACIONES: readonly Delegacion[] = [
  {
    id: "madrid",
    nombre: "Madrid",
    provincia: "Madrid",
    pais: "España",
    direccion: "Carretera Madrid-Barcelona (A-2), km 15,300",
    cp: "28022",
    localidad: "Madrid",
    telefono: "91 361 31 31",
    tel: "+34913613131",
    email: "jofemesamadrid@jofemesa.com",
    horario: null,
    servicios: [
      "Parque de elevación y maquinaria",
      "Maquinaria Madrid — San Fernando de Henares",
      "Ferretería Madrid — Móstoles",
    ],
    mapa: { x: 51, y: 47 },
  },
  {
    id: "asturias",
    nombre: "Asturias",
    provincia: "Asturias",
    pais: "España",
    direccion: "Parque Empresarial Pdo. Asturias, Avda. del Aluminio, 20",
    cp: "33417",
    localidad: "Avilés",
    telefono: "985 985 212",
    tel: "+34985985212",
    email: "jofemesa@jofemesa.com",
    horario: null,
    servicios: [
      "Domicilio social y origen de la empresa",
      "Manutención Asturias — venta y recambios",
      "Distribución Jungheinrich",
      "Centro de formación IPAF",
    ],
    mapa: { x: 42, y: 14 },
  },
  {
    id: "valencia",
    nombre: "Valencia",
    provincia: "Valencia",
    pais: "España",
    direccion: "Polígono Industrial Parc Sagunt, C/ Braç de la Creu, s/n",
    cp: "46520",
    localidad: "Puerto de Sagunto",
    telefono: "962 680 581",
    tel: "+34962680581",
    email: "valencia@jofemesa.com",
    horario: null,
    servicios: [
      "Elevación y maquinaria de obra",
      "Maquinaria Valencia — Pol. Ind. Ingruinsa",
      "Servicio de estiba en puerto",
    ],
    mapa: { x: 73, y: 52 },
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
    mapa: { x: 74, y: 44 },
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
    email: "jofemesamalaga@jofemesa.com",
    horario: null,
    servicios: ["Elevación para infraestructura y edificación"],
    mapa: { x: 46, y: 86 },
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
    servicios: ["Elevación y movimiento de tierras", "Abierta en abril de 2023"],
    mapa: { x: 34, y: 78 },
  },
  {
    id: "valladolid",
    nombre: "Valladolid",
    provincia: "Valladolid",
    pais: "España",
    direccion: "Polígono San Cristóbal, C/ Turquesa, 47",
    cp: "47012",
    localidad: "Valladolid",
    telefono: "983 525 363",
    tel: "+34983525363",
    email: "valladolid@jofemesa.com",
    horario: null,
    servicios: ["Plataformas y carretillas industriales"],
    mapa: { x: 45, y: 35 },
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
    servicios: ["Elevación para edificación e industria", "Abierta en julio de 2023"],
    mapa: { x: 72, y: 64 },
  },
  {
    // Su primera expansión internacional, anunciada en noviembre de 2024 y
    // que su web actual no cuenta en ningún sitio visible. La dirección y el
    // teléfono los tiene que confirmar el cliente.
    id: "portugal",
    nombre: "Portugal",
    provincia: "Portugal",
    pais: "Portugal",
    direccion: null,
    cp: null,
    localidad: null,
    telefono: null,
    tel: null,
    email: null,
    horario: null,
    servicios: ["Primera expansión internacional, desde noviembre de 2024"],
    mapa: { x: 14, y: 44 },
  },
] as const;

export const DELEGACIONES_POR_ID = Object.fromEntries(
  DELEGACIONES.map((d) => [d.id, d]),
) as Record<DelegacionId, Delegacion>;

/** Solo las que se pueden ofrecer como punto de recogida hoy. */
export const DELEGACIONES_OPERATIVAS = DELEGACIONES.filter(
  (d) => d.telefono !== null,
);

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

export const AFILIACIONES = [
  { id: "ipaf", nombre: "IPAF", descripcion: "Centro de formación homologado" },
  { id: "anapat", nombre: "ANAPAT", descripcion: "Asociación del sector" },
  { id: "aseamac", nombre: "ASEAMAC", descripcion: "Alquiler de maquinaria" },
  {
    id: "jungheinrich",
    nombre: "Jungheinrich",
    descripcion: "Partner oficial",
  },
] as const;

/** Fabricantes cuya maquinaria está documentada en su propia flota. */
export const FABRICANTES_FLOTA = [
  { nombre: "Genie", area: "Elevación e híbridos" },
  { nombre: "JLG", area: "Plataformas telescópicas" },
  { nombre: "Haulotte", area: "Brazos y mástiles" },
  { nombre: "Manitou", area: "Manipuladores y carretillas" },
  { nombre: "Jungheinrich", area: "Partner intralogística" },
  { nombre: "Takeuchi", area: "Miniexcavadoras" },
  { nombre: "Volvo", area: "Palas cargadoras" },
  { nombre: "Bomag", area: "Compactación" },
  { nombre: "Pramac", area: "Energía profesional" },
  { nombre: "Atlas Copco", area: "Compresores" },
] as const;

/**
 * Suyo, y hoy enterrado en su web. Especialmente bueno para una
 * empresa con delegación propia en cada provincia donde opera.
 */
export const LEMA = "Llegamos lejos para estar cerca.";

/**
 * Lo que NO sabemos y por tanto NO se escribe en ninguna página.
 * Esta lista alimenta /admin/datos-pendientes.
 */
export const DATOS_PENDIENTES = [
  {
    campo: "Horarios de apertura",
    nota: "No publicados en ninguna página de jofemesa.com. La web dice «consúltanos» en vez de inventar un horario.",
  },
  {
    campo: "Delegación de Portugal",
    nota: "El blog anuncia la expansión en noviembre de 2024 pero no da ciudad, dirección ni teléfono.",
  },
  {
    campo: "Tamaño de flota y plantilla",
    nota: "Nunca lo publican. No se estima.",
  },
  {
    campo: "Número de WhatsApp Business",
    nota: "La barra móvil lo necesita para el botón de WhatsApp.",
  },
  {
    campo: "Certificados ISO en PDF",
    nota: "Los enlaces de su web (/images/certifications/*.pdf) devuelven una página HTML vacía con código 200. Hacen falta los documentos reales.",
  },
  {
    campo: "Inicio del partnership Jungheinrich",
    nota: "La página de partner no da fecha.",
  },
  {
    campo: "Territorio Jungheinrich",
    nota: "Su web dice «distribuidores para Asturias», pero el blog anuncia venta en Valencia, Castellón y Madrid.",
  },
  {
    campo: "Teléfono de Valladolid",
    nota: "Su web da dos números distintos: 983 525 363 en contacto y 681 144 958 en situación.",
  },
  {
    campo: "Autorización de imagen de fabricantes",
    nota: "La fotografía de producto de Genie, JLG, Haulotte, Manitou, Takeuchi y Jungheinrich tiene derechos. Hay que pedir acceso al portal de medios antes de publicar.",
  },
] as const;
