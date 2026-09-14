import type { Maquina } from "../types";
import { est } from "../types";
import { construir, num, type Fila, type PerfilSubcategoria } from "./comun";

/**
 * PLATAFORMAS ELEVADORAS MÓVILES DE PERSONAL — 80 modelos.
 *
 * Transcripción íntegra de la página 2 del CATÁLOGO GENERAL DE
 * MAQUINARIA JOFEMESA, tabla por tabla y en su mismo orden: equipos
 * eléctricos, equipos híbridos y equipos diésel y estáticos.
 *
 * Las columnas del catálogo son siempre las mismas seis —marca, modelo,
 * altura de trabajo (m), ancho (mm), altura con barandilla (mm), peso
 * (kg) y carga máxima (kg)— y aquí se llaman `h`, `ancho`, `hb`, `peso`
 * y `carga`. El asterisco del catálogo («anchura del equipo en modo
 * transporte») se traduce en `anchoEsTransporte: true`, que hace que la
 * cifra salga marcada en la interfaz en vez de darse por buena tal cual.
 *
 * Tres designaciones se corrigen respecto al catálogo porque la ficha
 * técnica del fabricante que entregó el propio cliente dice otra cosa,
 * y la ficha manda sobre el folleto:
 *
 *   · JCB «1930ES»   → S1930E   (JCB no fabrica ningún «1930ES»)
 *   · JCB «S 4540 E» → S4550E
 *   · SNORKEL «4740 E» → S4740E (la ficha titula «S4740E»)
 */

const SIN_SENTIDO_EN_PLATAFORMA = [
  "alturaElevacion",
  "profundidadExcavacion",
  "capacidadCazo",
  "caudalAire",
  "presionAire",
  "fuerzaCentrifuga",
] as const;

const base = {
  familia: "elevacion",
  requiereFormacion: true,
  trabajos: ["altura"],
  noAplica: [...SIN_SENTIDO_EN_PLATAFORMA],
} as const;

/* ============================================================
   Equipos eléctricos
   ============================================================ */

const COLUMNAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "columnas-verticales",
  energia: "electrico",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  aplicaciones: [
    "Mantenimiento de luminarias y falsos techos",
    "Instalación eléctrica y de climatización",
    "Inventario y picking en altura",
    "Montaje de rótulos y señalética",
  ],
  describe: (f) =>
    `Columna vertical de ${num(f.h!, f.h! % 1 ? 1 : 0)} m de altura de trabajo y ${num(f.ancho!)} mm de ancho. Entra por puertas estándar, gira sobre sí misma y trabaja sin emisiones ni ruido dentro de naves e instalaciones en servicio.`,
  destacados: (f) => [
    `Pasa por puertas de ${num(f.ancho!)} mm`,
    `${num(f.carga!)} kg de carga en cesta`,
    "Eléctrica: sin emisiones en interior",
  ],
};

const TIJERAS_ELECTRICAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "tijeras-electricas",
  energia: "electrico",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  aplicaciones: [
    "Mantenimiento industrial en nave",
    "Instalaciones y conductos en techo",
    "Pintura y acabados en interior",
    "Montaje de estanterías y cubiertas ligeras",
  ],
  describe: (f) =>
    `Tijera eléctrica de ${num(f.h!, f.h! % 1 ? 1 : 0)} m de altura de trabajo, ${num(f.ancho!)} mm de ancho y ${num(f.carga!)} kg de carga en plataforma. Plataforma estable para trabajar cómodo y funcionamiento eléctrico para interiores y superficies firmes.`,
  destacados: (f) => [
    `${num(f.carga!)} kg en plataforma`,
    `${num(f.ancho!)} mm de ancho de máquina`,
    "Eléctrica: sin emisiones en interior",
  ],
};

const BRAZOS_ELECTRICOS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "brazos-articulados-electricos",
  energia: "electrico",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  aplicaciones: [
    "Trabajo sobre obstáculos e instalaciones aéreas",
    "Mantenimiento de puentes grúa",
    "Fachadas y patios interiores",
    "Montajes industriales en nave en servicio",
  ],
  describe: (f) =>
    `Brazo articulado eléctrico de ${num(f.h!)} m de altura de trabajo. La geometría articulada salva obstáculos y llega a puntos que no están justo encima, en silencio y sin emisiones.`,
  destacados: (f) => [
    "Sortea obstáculos por encima y por el lado",
    `${num(f.carga!)} kg de carga en cesta`,
    "Eléctrico: apto para interior",
  ],
};

/* ============================================================
   Equipos híbridos
   ============================================================ */

const TIJERAS_HIBRIDAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "tijeras-hibridas",
  energia: "hibrido",
  entornos: ["interior", "exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Obras que empiezan fuera y acaban dentro",
    "Montaje de estructura y cerramiento",
    "Industria con exigencias de emisiones",
    "Cargas pesadas a media altura",
  ],
  describe: (f) =>
    `Tijera híbrida de ${num(f.h!)} m de altura de trabajo y ${num(f.carga!)} kg de carga en plataforma. Alimentación eléctrica para trabajar dentro y motor de apoyo para el exterior, sin cambiar de máquina a mitad de obra.`,
  destacados: (f) => [
    `${num(f.carga!)} kg de carga: sube material, no solo operarios`,
    "Modo eléctrico para interior",
    "Tracción 4x4 para terreno de obra",
  ],
};

const BRAZOS_HIBRIDOS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "brazos-articulados-hibridos",
  energia: "hibrido",
  entornos: ["interior", "exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Mantenimiento industrial dentro y fuera",
    "Trabajos nocturnos con límite de ruido",
    "Fachadas en casco urbano",
    "Instalaciones con obstáculos aéreos",
  ],
  describe: (f) =>
    `Brazo articulado híbrido de ${num(f.h!)} m de altura de trabajo. Alcance articulado con doble alimentación: cero emisiones donde hace falta y autonomía diésel cuando la jornada se alarga.`,
  destacados: () => [
    "Doble alimentación: eléctrico o diésel",
    "Cero emisiones en modo eléctrico",
    "Tracción 4x4",
  ],
};

/* ============================================================
   Equipos diésel y estáticos
   ============================================================ */

const TIJERAS_DIESEL: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "tijeras-diesel",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Edificación y obra civil",
    "Montaje de estructura metálica",
    "Cubiertas y naves en construcción",
    "Subida de material a plataforma",
  ],
  describe: (f) =>
    `Tijera diésel de ${num(f.h!)} m de altura de trabajo y ${num(f.carga!)} kg de carga en plataforma. Tracción a las cuatro ruedas, autonomía de jornada completa y estabilizadores para trabajar en terreno de obra sin preparar.`,
  destacados: (f) => [
    `${num(f.carga!)} kg de carga en plataforma`,
    "Tracción 4x4 para terreno irregular",
    "Autonomía de jornada completa",
  ],
};

const BRAZOS_DIESEL: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "brazos-articulados-diesel",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Obra civil e infraestructura",
    "Trabajo por encima de obstáculos",
    "Naves industriales en construcción",
    "Mantenimiento de instalaciones exteriores",
  ],
  describe: (f) =>
    `Brazo articulado diésel de ${num(f.h!)} m de altura de trabajo. Salva obstáculos por arriba y por el lado, con tracción 4x4 y pendiente superable para llegar al punto de trabajo en terreno de obra.`,
  destacados: (f) => [
    "Alcance articulado sobre obstáculos",
    "Tracción 4x4 y pendiente de obra",
    `${num(f.carga!)} kg de carga en cesta`,
  ],
};

const TELESCOPICOS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "brazos-telescopicos-diesel",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Grandes alturas en infraestructura",
    "Montaje industrial y silos",
    "Fachadas y cubiertas de gran altura",
    "Torres, antenas y estructuras",
  ],
  describe: (f) =>
    `Brazo telescópico diésel de ${num(f.h!)} m de altura de trabajo. Alcance directo y posicionamiento rápido cuando el punto de trabajo está lejos y alto, con tracción 4x4 y estabilizadores.`,
  destacados: (f) => [
    `${num(f.h!)} m de altura de trabajo`,
    "Posicionamiento directo y rápido",
    "Tracción 4x4",
  ],
};

const ORUGAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "plataformas-sobre-orugas",
  energia: "diesel",
  entornos: ["interior", "exterior"],
  traccion: "oruga",
  aplicaciones: [
    "Acceso por puertas y pasillos estrechos",
    "Forjados y pavimentos delicados",
    "Jardines, taludes y pendientes",
    "Iglesias, museos y patrimonio",
  ],
  describe: (f) =>
    `Plataforma tipo araña sobre orugas de ${num(f.h!)} m de altura de trabajo y ${num(f.ancho!)} mm de ancho en modo transporte. Entra donde no entra una plataforma convencional y reparte su peso sobre el pavimento.`,
  destacados: (f) => [
    `Pasa por huecos de ${num(f.ancho!)} mm`,
    "Orugas: no marca el pavimento",
    "Estabilizadores independientes",
  ],
};

const SOBRE_CAMION: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "plataformas-sobre-camion",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "sobre-camion",
  aplicaciones: [
    "Varias intervenciones el mismo día",
    "Alumbrado público y semáforos",
    "Poda y jardinería urbana",
    "Rótulos y mantenimiento en vía pública",
  ],
  describe: (f) =>
    `Camión cesta de ${num(f.h!)} m de altura de trabajo. Se desplaza por carretera hasta el punto exacto, estabiliza y eleva en minutos: pensado para varias intervenciones en la misma jornada.`,
  destacados: (f) => [
    "Movilidad por carretera",
    "Estabilización y elevación inmediata",
    `${num(f.carga!)} kg de carga en cesta`,
  ],
};

/* ============================================================
   Las tablas
   ============================================================ */

const columnas: Fila[] = [
  { marca: "JLG", modelo: "NANO SP PLUS", h: 4.5, ancho: 750, hb: 1590, peso: 540, carga: 200 },
  { marca: "JLG", modelo: "1230 ES", h: 6, ancho: 760, hb: 1590, peso: 790, carga: 230 },
  { marca: "Genie", modelo: "GR-15", h: 6, ancho: 750, hb: 1570, peso: 994, carga: 227 },
  { marca: "Haulotte", modelo: "STAR 8 AE", h: 8, ancho: 680, hb: 1990, peso: 2585, carga: 200 },
  { marca: "Genie", modelo: "GR-26J", h: 10, ancho: 990, hb: 1990, peso: 2650, carga: 200 },
  { marca: "Haulotte", modelo: "STAR 10", h: 10, ancho: 990, hb: 1990, peso: 2760, carga: 200 },
  { marca: "JLG", modelo: "TOUCAN 12E", h: 12, ancho: 1200, hb: 1990, peso: 4300, carga: 200 },
];

const tijerasElectricas: Fila[] = [
  { marca: "Haulotte", modelo: "SWIFT UP 4.5 SP", h: 4.5, ancho: 700, hb: 1800, peso: 430, carga: 240 },
  { marca: "Genie", modelo: "GS-1432M", h: 6, ancho: 770, hb: 1880, peso: 900, carga: 227 },
  { marca: "Genie", modelo: "GS-1932", h: 8, ancho: 810, hb: 2100, peso: 1503, carga: 227, destacada: true },
  { marca: "Genie", modelo: "GS-2032", h: 8, ancho: 810, hb: 2130, peso: 1825, carga: 363 },
  { marca: "JLG", modelo: "2032ES", h: 8, ancho: 810, hb: 2300, peso: 1970, carga: 360 },
  { marca: "JCB", modelo: "S1930E", h: 8, ancho: 760, hb: 2020, peso: 1565, carga: 230 },
  { marca: "Genie", modelo: "GS-2632", h: 10, ancho: 810, hb: 2260, peso: 1956, carga: 227, destacada: true },
  { marca: "Genie", modelo: "GS-2646", h: 10, ancho: 1150, hb: 2260, peso: 2447, carga: 454 },
  { marca: "JLG", modelo: "2632ES", h: 10, ancho: 810, hb: 1980, peso: 2135, carga: 230 },
  { marca: "Genie", modelo: "GS-3246", h: 12, ancho: 1170, hb: 2390, peso: 2812, carga: 318, destacada: true },
  { marca: "Genie", modelo: "GS-4047", h: 14, ancho: 1160, hb: 2540, peso: 3260, carga: 350, destacada: true },
  { marca: "Snorkel", modelo: "S4740E", h: 14, ancho: 1190, hb: 2140, peso: 3251, carga: 250 },
  { marca: "Haulotte", modelo: "COMPACT 14", h: 14, ancho: 1200, hb: 2500, peso: 3175, carga: 350, destacada: true },
  { marca: "JLG", modelo: "4045R", h: 14, ancho: 1140, hb: 1920, peso: 3175, carga: 350 },
  { marca: "JLG", modelo: "ES4046", h: 14, ancho: 1170, hb: 2530, peso: 2826, carga: 350, destacada: true },
  { marca: "Genie", modelo: "GS-4655", h: 16, ancho: 1350, hb: 2740, peso: 3700, carga: 350 },
  { marca: "JCB", modelo: "S4550E", h: 16, ancho: 1250, hb: 2760, peso: 3366, carga: 227 },
];

const brazosElectricos: Fila[] = [
  { marca: "Genie", modelo: "Z-30/20 N", h: 11, ancho: 1170, hb: 2000, peso: 6450, carga: 227 },
  { marca: "Genie", modelo: "Z-34/22 N", h: 12, ancho: 1420, hb: 2000, peso: 5171, carga: 227 },
  { marca: "Snorkel", modelo: "A38E", h: 13, ancho: 1490, hb: 2000, peso: 3795, carga: 215 },
  { marca: "Haulotte", modelo: "HA-15TP", h: 15, ancho: 1500, hb: 2000, peso: 7730, carga: 230 },
  { marca: "Genie", modelo: "Z-40/23 N RJ", h: 15, ancho: 1420, hb: 1980, peso: 6940, carga: 227 },
  { marca: "Genie", modelo: "Z-45/25J DC", h: 16, ancho: 1830, hb: 2000, peso: 7190, carga: 227 },
  { marca: "Manitou", modelo: "170 AETJ-L", h: 17, ancho: 1750, hb: 1970, peso: 7435, carga: 227 },
  { marca: "JLG", modelo: "EC520AJ", h: 18, ancho: 2260, hb: 2270, peso: 7985, carga: 250 },
  { marca: "JLG", modelo: "E600JP", h: 20, ancho: 2420, hb: 2540, peso: 7815, carga: 230 },
];

const tijerasHibridas: Fila[] = [
  { marca: "Haulotte", modelo: "HS15 E PRO", h: 15, ancho: 1890, hb: 3050, peso: 7518, carga: 750, destacada: true },
  { marca: "Haulotte", modelo: "HS18 E PRO", h: 18, ancho: 1890, hb: 3150, peso: 8048, carga: 750 },
];

const brazosHibridos: Fila[] = [
  { marca: "Genie", modelo: "Z-45 FE", h: 16, ancho: 2290, hb: 2290, peso: 6379, carga: 300 },
  { marca: "Genie", modelo: "Z-60/37 FE", h: 20, ancho: 2440, hb: 2540, peso: 7530, carga: 227 },
  { marca: "Haulotte", modelo: "HA20 LE PRO", h: 20, ancho: 2410, hb: 2500, peso: 9375, carga: 350 },
];

const tijerasDiesel: Fila[] = [
  { marca: "Genie", modelo: "GS-3369 RT", h: 12, ancho: 1750, hb: 2590, peso: 3557, carga: 454 },
  { marca: "Genie", modelo: "GS-3390", h: 12, ancho: 1830, hb: 2710, peso: 5433, carga: 1134 },
  { marca: "Snorkel", modelo: "S3370 RT", h: 12, ancho: 1800, hb: 2000, peso: 3620, carga: 450 },
  { marca: "Snorkel", modelo: "S3970 RT", h: 14, ancho: 1800, hb: 2130, peso: 3790, carga: 350 },
  { marca: "Genie", modelo: "GS-4069 RT", h: 14, ancho: 1750, hb: 2740, peso: 4744, carga: 363 },
  { marca: "Genie", modelo: "GS-4390", h: 15, ancho: 2290, hb: 2930, peso: 5973, carga: 680, destacada: true },
  { marca: "Snorkel", modelo: "A46JRT", h: 16, ancho: 2100, hb: 2160, peso: 7540, carga: 227 },
  { marca: "Genie", modelo: "GS-5390", h: 18, ancho: 2290, hb: 3150, peso: 7639, carga: 680, destacada: true },
  { marca: "Holland Lift", modelo: "B-195 DL", h: 22, ancho: 2440, hb: 2870, peso: 11990, carga: 750 },
];

const brazosDiesel: Fila[] = [
  { marca: "Genie", modelo: "Z-34/22 RT", h: 12, ancho: 1420, hb: 2000, peso: 4838, carga: 227 },
  { marca: "JLG", modelo: "340 AJ", h: 12, ancho: 1930, hb: 2170, peso: 4445, carga: 230 },
  { marca: "JLG", modelo: "450AJ SII", h: 16, ancho: 2340, hb: 2300, peso: 6250, carga: 230 },
  { marca: "Genie", modelo: "Z-45/25J RT", h: 16, ancho: 2290, hb: 2130, peso: 6460, carga: 227 },
  { marca: "Haulotte", modelo: "HA16 RTJ PRO", h: 16, ancho: 2300, hb: 2300, peso: 6650, carga: 230 },
  { marca: "JLG", modelo: "520 AJ", h: 18, ancho: 2350, hb: 2270, peso: 7985, carga: 250 },
  { marca: "Genie", modelo: "Z-51/30J RT", h: 18, ancho: 1830, hb: 2130, peso: 7394, carga: 227 },
  { marca: "JLG", modelo: "600 AJ", h: 20, ancho: 2440, hb: 2560, peso: 10650, carga: 230 },
  { marca: "Haulotte", modelo: "HA20 RTJ PRO", h: 20, ancho: 2430, hb: 2470, peso: 9430, carga: 230 },
  { marca: "Genie", modelo: "Z-62/40", h: 20, ancho: 2490, hb: 2560, peso: 10281, carga: 227 },
  { marca: "Haulotte", modelo: "HA26 RTJ PRO", h: 26, ancho: 2480, hb: 2970, peso: 15500, carga: 250 },
  {
    marca: "Genie",
    modelo: "Z-80/60",
    h: 26,
    ancho: 2440,
    hb: 2540,
    carga: 227,
    // El catálogo da 7.530 kg, la misma cifra exacta que el Z-60/37 FE
    // de la tabla de híbridos. Para un brazo de 26 m no encaja, así que
    // se publica marcada y pendiente de confirmar en vez de darla por
    // buena: un peso de transporte equivocado es un problema de verdad.
    extra: {
      peso: est(
        7530,
        "catalogo-jofemesa",
        "El catálogo general publica 7.530 kg, la misma cifra que el Z-60/37 FE de 20 m. Confirmamos el peso real de transporte al responder tu solicitud.",
      ),
    },
  },
  { marca: "JLG", modelo: "800 AJ", h: 26, ancho: 2430, hb: 3000, peso: 15600, carga: 230 },
  { marca: "Haulotte", modelo: "HA32 RTJ PRO", h: 32, ancho: 2530, anchoEsTransporte: true, hb: 2800, peso: 20100, carga: 250 },
  { marca: "JLG", modelo: "1250 AJP", h: 40, ancho: 2490, anchoEsTransporte: true, hb: 3050, peso: 21000, carga: 450 },
  { marca: "Genie", modelo: "ZX-135/70", h: 43, ancho: 2440, anchoEsTransporte: true, hb: 3090, peso: 20502, carga: 272 },
];

const telescopicos: Fila[] = [
  { marca: "JLG", modelo: "660 SJ", h: 22, ancho: 2440, hb: 2560, peso: 13115, carga: 230 },
  { marca: "Genie", modelo: "S-65 XC", h: 22, ancho: 2440, anchoEsTransporte: true, hb: 2810, peso: 11412, carga: 300 },
  { marca: "JLG", modelo: "860 SJ", h: 28, ancho: 2490, hb: 3050, peso: 17200, carga: 230 },
  { marca: "Genie", modelo: "S-85", h: 28, ancho: 2440, anchoEsTransporte: true, hb: 2800, peso: 17236, carga: 227 },
  { marca: "Genie", modelo: "SX-125 XC", h: 40, ancho: 2440, anchoEsTransporte: true, hb: 3070, peso: 20248, carga: 227 },
  { marca: "JLG", modelo: "1350 SJP", h: 43, ancho: 2490, anchoEsTransporte: true, hb: 3050, peso: 20400, carga: 230 },
  { marca: "Genie", modelo: "SX-150", h: 48, ancho: 2440, anchoEsTransporte: true, hb: 3050, peso: 22657, carga: 340 },
  { marca: "Genie", modelo: "SX-180", h: 57, ancho: 2440, anchoEsTransporte: true, hb: 3050, peso: 24948, carga: 340, destacada: true },
];

const orugas: Fila[] = [
  { marca: "Imer", modelo: "IM R15 DA", h: 15, ancho: 990, anchoEsTransporte: true, hb: 1420, peso: 2030, carga: 230 },
  { marca: "JLG", modelo: "X15J PLUS", h: 15, ancho: 1340, anchoEsTransporte: true, hb: 1990, peso: 1910, carga: 230 },
  { marca: "JLG", modelo: "X17J PLUS", h: 17, ancho: 800, anchoEsTransporte: true, hb: 2000, peso: 2190, carga: 230 },
  { marca: "Easy Lift", modelo: "R180", h: 18, ancho: 1100, anchoEsTransporte: true, hb: 2010, peso: 2330, carga: 200 },
  { marca: "JLG", modelo: "X20J PLUS", h: 20, ancho: 800, anchoEsTransporte: true, hb: 1990, peso: 2840, carga: 230 },
  { marca: "Teupen", modelo: "LEO30T", h: 30, ancho: 1580, anchoEsTransporte: true, hb: 1980, peso: 4500, carga: 400 },
];

const sobreCamion: Fila[] = [
  { marca: "Klubb", modelo: "K32", h: 12, ancho: 2030, hb: 2070, peso: 3500, carga: 120 },
  {
    marca: "Socage",
    modelo: "T315",
    h: 15,
    hb: 1410,
    peso: 3090,
    carga: 225,
    // El catálogo da 720 mm de ancho para una plataforma montada sobre
    // furgón. No puede ser la anchura del vehículo, así que no se
    // publica como tal.
    extra: {
      anchoTransporte: est(
        720,
        "catalogo-jofemesa",
        "El catálogo publica 720 mm, que no corresponde a la anchura del vehículo. Confirmamos las cotas de acceso antes del transporte.",
      ),
    },
  },
  {
    marca: "Socage",
    modelo: "DA320",
    h: 20,
    hb: 2850,
    peso: 3385,
    carga: 225,
    extra: {
      anchoTransporte: est(
        700,
        "catalogo-jofemesa",
        "El catálogo publica 700 mm, que no corresponde a la anchura del vehículo. Confirmamos las cotas de acceso antes del transporte.",
      ),
    },
  },
];

export const FLOTA_ELEVACION: Maquina[] = [
  ...construir(COLUMNAS, 1000, columnas),
  ...construir(TIJERAS_ELECTRICAS, 2000, tijerasElectricas),
  ...construir(BRAZOS_ELECTRICOS, 3000, brazosElectricos),
  ...construir(TIJERAS_HIBRIDAS, 4000, tijerasHibridas),
  ...construir(BRAZOS_HIBRIDOS, 5000, brazosHibridos),
  ...construir(TIJERAS_DIESEL, 6000, tijerasDiesel),
  ...construir(BRAZOS_DIESEL, 7000, brazosDiesel),
  ...construir(TELESCOPICOS, 8000, telescopicos),
  ...construir(ORUGAS, 9000, orugas),
  ...construir(SOBRE_CAMION, 10000, sobreCamion),
];
