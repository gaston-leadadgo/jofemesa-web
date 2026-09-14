/**
 * Noticias.
 *
 * En la reunión quedó claro de dónde sale esto: «las noticias las saco
 * de su página actual… ellos tienen como 200 blogs cargados» → «pues
 * aquí hacemos que aparezcan 5 o 6, como mucho» y «que puedas filtrar
 * por aquí». Y, sobre las que había: «las que están ahí publicadas son
 * ficticias». Ya no hay ninguna inventada.
 *
 * Estas catorce son entradas reales de jofemesa.com/blogs, con su
 * titular, su fecha y su entradilla tal y como las publican. El cuerpo
 * sigue en su servidor, así que cada tarjeta enlaza allí hasta que se
 * migre el blog: es la ruta honesta mientras la migración esté
 * pendiente, y está anotada en /admin/datos-pendientes.
 */

export type CategoriaNoticia =
  | "casos"
  | "entregas"
  | "formacion"
  | "empresa"
  | "sostenibilidad";

export interface Noticia {
  slug: string;
  titulo: string;
  /** ISO, para <time> y para ordenar. */
  fecha: string;
  entradilla: string;
  categoria: CategoriaNoticia;
  /** Delegación de la que habla la entrada, si la nombra. */
  delegacion?: string;
  /** La entrada original en su servidor. */
  url: string;
}

export const CATEGORIAS_NOTICIA: {
  id: CategoriaNoticia;
  nombre: string;
}[] = [
  { id: "casos", nombre: "Casos de éxito" },
  { id: "entregas", nombre: "Entregas de flota" },
  { id: "empresa", nombre: "La empresa" },
  { id: "formacion", nombre: "Formación" },
  { id: "sostenibilidad", nombre: "Sostenibilidad" },
];

const BLOG = "https://www.jofemesa.com/blogs";

export const NOTICIAS: readonly Noticia[] = [
  {
    slug: "resultados-excepcionales-plataformas-madrid",
    titulo:
      "Resultados excepcionales con JOFEMESA: el poder del alquiler de plataformas en proyectos de Madrid",
    fecha: "2025-02-27",
    entradilla:
      "Casos de éxito del alquiler de plataformas elevadoras en obras y proyectos de la Comunidad de Madrid.",
    categoria: "casos",
    delegacion: "Madrid",
    url: `${BLOG}/resultados-excepcionales-con-jofemesa-el-poder-del-alquiler-de-plataformas-en-proyectos-de-madrid`,
  },
  {
    slug: "obras-con-energia-malaga-grupos-electrogenos",
    titulo:
      "Obras con energía: alquiler de maquinaria en Málaga con grupos electrógenos de alta potencia",
    fecha: "2025-02-25",
    entradilla:
      "Potencia y color en Málaga: grupos electrógenos para obras que no pueden depender de la red.",
    categoria: "casos",
    delegacion: "Málaga",
    url: `${BLOG}/obras-con-energiacutea-alquiler-de-maquinaria-en-maacutelaga-con-grupos-electroacutegenos-de-alta-potencia`,
  },
  {
    slug: "maquinaria-jofemesa-proyectos-construccion",
    titulo:
      "La maquinaria JOFEMESA: clave en el éxito de proyectos de construcción en España",
    fecha: "2025-02-21",
    entradilla:
      "El papel de JOFEMESA en el desarrollo de proyectos de construcción por toda la península.",
    categoria: "empresa",
    url: `${BLOG}/la-maquinaria-jofemesa-clave-en-el-eacutexito-de-proyectos-de-construccioacuten-en-espantildea`,
  },
  {
    slug: "sostenibilidad-en-accion-asturias",
    titulo: "Sostenibilidad en acción: alquiler de maquinaria en Asturias",
    fecha: "2025-02-19",
    entradilla:
      "Compromiso verde: prácticas sostenibles en el alquiler de maquinaria desde la delegación de Asturias.",
    categoria: "sostenibilidad",
    delegacion: "Asturias",
    url: `${BLOG}/sostenibilidad-en-accioacuten-alquiler-de-maquinaria-en-asturias-con-jofemesa`,
  },
  {
    slug: "iluminando-el-futuro-plataformas-valencia",
    titulo:
      "Iluminando el futuro: alquiler de plataformas en Valencia con dedicación y profesionalismo",
    fecha: "2025-02-17",
    entradilla:
      "Plataformas de tijera detrás de cada panel solar: la fuerza del equipo de Instasagunto en Valencia.",
    categoria: "casos",
    delegacion: "Valencia",
    url: `${BLOG}/iluminando-el-futuro-alquiler-de-plataformas-en-valencia-con-dedicacioacuten-y-profesionalismo`,
  },
  {
    slug: "manipuladores-telescopicos-madrid-manitou",
    titulo:
      "Alquiler de manipuladores telescópicos en Madrid: vista panorámica y gran capacidad con Manitou",
    fecha: "2025-02-14",
    entradilla:
      "Optimiza tu trabajo en altura: manipuladores telescópicos Manitou desde la delegación de Madrid.",
    categoria: "casos",
    delegacion: "Madrid",
    url: `${BLOG}/alquiler-de-manipuladores-telescoacutepicos-en-madrid-vista-panoraacutemica-y-gran-capacidad-con-manitou`,
  },
  {
    slug: "automatizacion-almacenes-asturias-jungheinrich",
    titulo:
      "Automatización de almacenes en Asturias: ventajas de apostar por la venta de carretillas Jungheinrich",
    fecha: "2025-02-11",
    entradilla:
      "Apuesta por la eficiencia y la seguridad en tu almacén con la automatización y la gama Jungheinrich.",
    categoria: "empresa",
    delegacion: "Asturias",
    url: `${BLOG}/automatizacioacuten-de-almacenes-en-asturias-ventajas-de-apostar-por-la-venta-de-carretillas-jungheinrich-en-jofemesa`,
  },
  {
    slug: "revolucion-tecnologia-alquiler-madrid",
    titulo:
      "La revolución de la tecnología en el alquiler de maquinaria en Madrid",
    fecha: "2025-02-06",
    entradilla:
      "Cómo la tecnología de gestión de flota cambia el alquiler de maquinaria y qué supone para el cliente.",
    categoria: "empresa",
    delegacion: "Madrid",
    url: `${BLOG}/la-revolucioacuten-de-la-tecnologiacutea-en-el-alquiler-de-maquinaria-en-madrid-la-experiencia-de-jofemesa`,
  },
  {
    slug: "entrega-genie-sx-150-sevilla",
    titulo:
      "Entregamos la impresionante plataforma telescópica Genie SX-150 en Sevilla",
    fecha: "2025-01-31",
    entradilla:
      "Arrancamos 2025 a lo grande con la entrega de una telescópica de 48 metros de altura de trabajo.",
    categoria: "entregas",
    delegacion: "Sevilla",
    url: `${BLOG}/entregamos-la-impresionante-plataforma-telescoacutepica-genie-sx-150-en-sevilla-iexclcomenzamos-el-2025-a-lo-grande`,
  },
  {
    slug: "innovaciones-futuro-alquiler-valencia",
    titulo:
      "Innovaciones y futuro del alquiler de maquinaria en Valencia: el compromiso de JOFEMESA",
    fecha: "2025-01-29",
    entradilla:
      "Tendencias del alquiler de maquinaria y cómo se están aplicando en la delegación de Valencia.",
    categoria: "empresa",
    delegacion: "Valencia",
    url: `${BLOG}/innovaciones-y-futuro-del-alquiler-de-maquinaria-en-valencia-el-compromiso-de-jofemesa`,
  },
  {
    slug: "tipos-de-alquiler-de-plataformas-madrid",
    titulo:
      "Tipos de alquiler de plataformas en Madrid: soluciones versátiles para cada proyecto",
    fecha: "2025-01-24",
    entradilla:
      "Qué plataforma elegir según el trabajo en altura que tengas delante y qué cambia entre unas y otras.",
    categoria: "casos",
    delegacion: "Madrid",
    url: `${BLOG}/tipos-de-alquiler-de-plataformas-en-madrid-con-jofemesa-soluciones-versaacutetiles-para-cada-proyecto`,
  },
  {
    slug: "historia-y-evolucion-de-jofemesa",
    titulo:
      "Historia y evolución de JOFEMESA: tres décadas de éxito en el alquiler de maquinaria",
    fecha: "2025-01-22",
    entradilla:
      "La trayectoria desde la fundación en 1987 en Asturias hasta las delegaciones de España y Portugal.",
    categoria: "empresa",
    url: `${BLOG}/historia-y-evolucioacuten-de-jofemesa-tres-deacutecadas-de-eacutexito-en-el-alquiler-de-maquinaria`,
  },
  {
    slug: "excavadora-takeuchi-tb-2150-asturias",
    titulo:
      "Alquiler de maquinaria en Asturias: la poderosa excavadora Takeuchi TB-2150 en acción",
    fecha: "2025-01-20",
    entradilla:
      "Innovación en movimiento: la retroexcavadora de 16 toneladas trabajando en obra asturiana.",
    categoria: "casos",
    delegacion: "Asturias",
    url: `${BLOG}/alquiler-de-maquinaria-en-asturias-la-poderosa-excavadora-takeuchi-tb-2150-en-accioacuten`,
  },
  {
    slug: "innovaciones-plataformas-elevadoras-madrid",
    titulo:
      "Innovaciones en plataformas elevadoras: alquiler seguro y eficiente en Madrid",
    fecha: "2025-01-14",
    entradilla:
      "Cómo las mejoras en las plataformas elevadoras aumentan la seguridad del operario en obra.",
    categoria: "casos",
    delegacion: "Madrid",
    url: `${BLOG}/innovaciones-en-plataformas-elevadoras-de-jofemesa-alquiler-seguro-y-eficiente-en-madrid`,
  },
] as const;

export const NOTICIAS_RECIENTES = NOTICIAS.slice(0, 3);

export const URL_BLOG = BLOG;
