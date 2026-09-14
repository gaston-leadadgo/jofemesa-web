import type { Maquina } from "../types";
import { construir, num, type Fila, type PerfilSubcategoria } from "./comun";

/**
 * EXCAVACIÓN, MOVIMIENTO DE TIERRAS Y COMPACTACIÓN — 50 modelos.
 *
 * Transcripción de la página 4 del catálogo general, contrastada con el
 * documento «MAQUINARIA DE MOVIMIENTO DE TIERRAS Y COMPACTACIÓN SEGÚN
 * GUIÓN» que entregó el cliente. Ese documento es el que fija el orden
 * de los submenús —y por tanto el de este fichero—:
 *
 *   2.2.1 Retroexcavadoras
 *   2.2.2 Retrocargadoras / mixtas
 *   2.2.3 Mini cargadoras
 *   2.2.4 Dúmper
 *   2.2.5 Rodillos de compactación
 *   2.2.6 Pisones y bandejas de compactación
 *
 * y el que pide que «dentro de cada submenú aparezcan los diferentes
 * modelos, tonelaje, fichas técnicas y excavación de cada uno de ellos».
 *
 * Dos designaciones se normalizan a la marca real, que el catálogo
 * escribe mal de forma evidente:
 *
 *   · «BOMAC»  → Bomag  (BW65H y BW 211 son modelos de Bomag)
 *   · «GHEL»   → Gehl   (SL-R135 es de Gehl)
 *
 * Y la marca de los dúmperes no está en la tabla: las designaciones
 * D100AHA, D150AHG, D250RHGS… son la nomenclatura de AUSA, que es
 * además la máquina que aparece fotografiada en esa misma página.
 */

const base = {
  familia: "movimiento-tierras",
  requiereFormacion: true,
  trabajos: ["tierra"],
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "caudalAire",
    "presionAire",
  ],
} as const;

/* ------------------------------------------------------------
   Perfiles
   ------------------------------------------------------------ */

const RETROEXCAVADORAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "retroexcavadoras",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "oruga",
  aplicaciones: [
    "Zanjeo para canalizaciones de servicios",
    "Cimentaciones y pozos",
    "Reformas y demolición selectiva",
    "Urbanización y ajardinamiento",
  ],
  describe: (f) =>
    `Retroexcavadora de orugas de ${num(f.peso! / 1000, f.peso! < 10000 ? 1 : 1)} t y ${num(f.excavacion! / 1000, 2)} m de profundidad de excavación, con ${num(f.ancho!)} mm de ancho de tren de rodaje. Cadenas de goma que no marcan el pavimento y radio de giro contenido para trabajar pegado a fachada.`,
  destacados: (f) => [
    `${num(f.excavacion! / 1000, 2)} m de profundidad de excavación`,
    `${num(f.peso!)} kg de peso operativo`,
    "Orugas de goma: apta para pavimento urbano",
  ],
};

const RETROCARGADORAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "retrocargadoras",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Urbanización y obra civil",
    "Carga de camión y acopio",
    "Zanjas de saneamiento",
    "Retirada de escombro",
  ],
  describe: (f) =>
    `Retrocargadora mixta de ${num(f.peso! / 1000, 1)} t con ${num(f.excavacion! / 1000, 2)} m de profundidad de excavación. Carga frontal y excavación trasera en la misma máquina: una sola unidad y un solo transporte para dos trabajos.`,
  destacados: (f) => [
    "Cargadora frontal y retro en un solo equipo",
    `${num(f.excavacion! / 1000, 2)} m de excavación`,
    "Tracción 4x4 y desplazamiento por vía",
  ],
};

const MINICARGADORAS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "minicargadoras",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "profundidadExcavacion",
    "caudalAire",
    "presionAire",
  ],
  aplicaciones: [
    "Despeje y limpieza de obra",
    "Carga rápida de escombro",
    "Trabajo en accesos estrechos",
    "Movimiento de áridos y tierra vegetal",
  ],
  describe: (f) =>
    `Minicargadora de ${num(f.peso!)} kg con ${num(f.carga!)} kg de capacidad y ${num(f.ancho!)} mm de ancho. Gira sobre su propio eje, así que trabaja en accesos donde no entra una cargadora convencional.`,
  destacados: (f) => [
    `${num(f.carga!)} kg de capacidad`,
    `${num(f.ancho!)} mm de ancho: entra por accesos estrechos`,
    "Giro sobre su propio eje",
  ],
};

const DUMPERES: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "dumperes",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  noAplica: [
    "alturaTrabajo",
    "alcanceHorizontal",
    "profundidadExcavacion",
    "caudalAire",
    "presionAire",
  ],
  aplicaciones: [
    "Transporte de tierra y escombro en obra",
    "Suministro de hormigón y árido",
    "Obra con accesos sin pavimentar",
    "Vertido en zanja y en encofrado",
  ],
  describe: (f) =>
    `Dúmper 4x4 de ${num(f.peso!)} kg con tolva de ${f.tolva} litros y descarga ${f.tipo!.toLowerCase()}. Tracción total para moverse por terreno sin preparar y ${num(f.sinArco!)} mm de altura sin arco para pasar por huecos bajos.`,
  destacados: (f) => [
    `Tolva de ${f.tolva} l`,
    `Descarga ${f.tipo!.toLowerCase()}`,
    `${num(f.sinArco!)} mm de altura sin arco`,
  ],
};

const RODILLOS: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "rodillos",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "profundidadExcavacion",
    "capacidadCarga",
    "caudalAire",
    "presionAire",
  ],
  aplicaciones: [
    "Compactación de bases de árido",
    "Asfaltado y reposición de firme",
    "Zanjas y rellenos",
    "Explanaciones y viales",
  ],
  describe: (f) =>
    `${f.tipo} de ${num(f.peso! / 1000, f.peso! < 1000 ? 2 : 1)} t con ${num(f.pisada!)} mm de pisada. Compactación uniforme y control de pasadas para dejar la base lista antes de la siguiente fase.`,
  destacados: (f) => [
    `${num(f.pisada!)} mm de pisada`,
    `${num(f.peso!)} kg de peso operativo`,
    f.tipo!,
  ],
};

const PISONES: PerfilSubcategoria = {
  ...base,
  subcategoriaSlug: "pisones-bandejas",
  energia: "gasolina",
  entornos: ["exterior"],
  traccion: "2x4",
  requiereFormacion: false,
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "profundidadExcavacion",
    "capacidadCarga",
    "caudalAire",
    "presionAire",
  ],
  aplicaciones: [
    "Compactación de zanjas estrechas",
    "Recebo y relleno de canalizaciones",
    "Adoquinado y solados",
    "Bases de acera y bordillo",
  ],
  describe: (f) =>
    `${f.tipo} de ${num(f.peso!)} kg con ${num(f.pisada!)} mm de pisada. Equipo de conducción manual para los remates de compactación que una máquina grande no puede hacer.`,
  destacados: (f) => [
    `${num(f.pisada!)} mm de pisada`,
    `${num(f.peso!)} kg: lo mueve una persona`,
    f.tipo!,
  ],
};

/* ------------------------------------------------------------
   Las tablas
   ------------------------------------------------------------ */

/**
 * Los dos modelos más pequeños llevan tren de rodaje extensible, y el
 * catálogo lo publica como «750/1.020». Aquí entra el ancho retraído,
 * que es el dato que decide si la máquina pasa por un acceso, y el
 * extendido se cuenta en la descripción.
 */
const retroexcavadoras: Fila[] = [
  {
    marca: "Takeuchi",
    modelo: "TB 210",
    peso: 1201,
    ancho: 750,
    alturaTotal: 2190,
    excavacion: 1755,
    descripcion:
      "Miniexcavadora de 1,2 t con tren de rodaje extensible de 750 a 1.020 mm y 1,76 m de profundidad de excavación. Pasa por una puerta de paso y trabaja dentro de un patio o de un sótano.",
  },
  {
    marca: "Takeuchi",
    modelo: "TB 216",
    peso: 1990,
    ancho: 1055,
    alturaTotal: 2360,
    excavacion: 2390,
    descripcion:
      "Miniexcavadora de 2 t con tren de rodaje extensible de 1.055 a 1.300 mm y 2,39 m de profundidad de excavación. El equilibrio habitual entre acceso estrecho y capacidad real de zanjeo.",
    destacada: true,
  },
  { marca: "Takeuchi", modelo: "TB 230", peso: 3093, ancho: 1450, alturaTotal: 2525, excavacion: 2835 },
  { marca: "Takeuchi", modelo: "TB 235", peso: 3530, ancho: 1630, alturaTotal: 2450, excavacion: 3400 },
  { marca: "Takeuchi", modelo: "TB 240A", peso: 4327, ancho: 1740, alturaTotal: 2490, excavacion: 3465 },
  { marca: "Takeuchi", modelo: "TB 335K", peso: 3760, ancho: 1740, alturaTotal: 2520, excavacion: 2505 },
  { marca: "Takeuchi", modelo: "TB 250 2A", peso: 5360, ancho: 1840, alturaTotal: 2555, excavacion: 3620 },
  { marca: "Takeuchi", modelo: "TB 350", peso: 5085, ancho: 2000, alturaTotal: 2565, excavacion: 3575 },
  { marca: "Takeuchi", modelo: "TB 260", peso: 6030, ancho: 2000, alturaTotal: 2560, excavacion: 3735 },
  { marca: "Takeuchi", modelo: "TB 370", peso: 7000, ancho: 2100, alturaTotal: 2595, excavacion: 4110 },
  { marca: "Takeuchi", modelo: "TB 290", peso: 8952, ancho: 2200, alturaTotal: 2550, excavacion: 4410 },
  { marca: "Takeuchi", modelo: "TB 2150R", peso: 16293, ancho: 2500, alturaTotal: 2960, excavacion: 5500, destacada: true },
];

const retrocargadoras: Fila[] = [
  { marca: "JCB", modelo: "3CX", peso: 8580, ancho: 2350, alturaTotal: 3610, excavacion: 4240, destacada: true },
  { marca: "Hidromek", modelo: "HMK 102 B", peso: 9000, ancho: 2300, alturaTotal: 2950, excavacion: 5627 },
];

/** El catálogo da 1.940,6 mm para la S450; aquí va redondeado a 1.941. */
const minicargadoras: Fila[] = [
  { marca: "Manitou", modelo: "850R", peso: 1350, ancho: 909, alturaTotal: 1900, carga: 386 },
  { marca: "Bobcat", modelo: "S70", peso: 1270, ancho: 901, alturaTotal: 1910, carga: 318 },
  { marca: "Manitou", modelo: "1350R", peso: 2384, ancho: 1372, alturaTotal: 1930, carga: 612 },
  { marca: "Bobcat", modelo: "S450", peso: 2365, ancho: 1941, alturaTotal: 1976, carga: 654 },
  { marca: "Gehl", modelo: "SL-R135", peso: 2953, ancho: 1448, alturaTotal: 1930, carga: 613 },
  { marca: "Takeuchi", modelo: "TL 8", peso: 3835, ancho: 985, alturaTotal: 2230, carga: 955, traccion: "oruga" },
  { marca: "Takeuchi", modelo: "TL 10", peso: 4660, ancho: 1740, alturaTotal: 2270, carga: 1145, traccion: "oruga" },
  { marca: "Wacker Neuson", modelo: "WL20", peso: 2250, ancho: 1210, alturaTotal: 2189, carga: 2000 },
  { marca: "Wacker Neuson", modelo: "WL28", peso: 2800, ancho: 1250, alturaTotal: 2340, carga: 2640 },
];

const dumperes: Fila[] = [
  { marca: "Ausa", modelo: "D100AHA", tipo: "Descarga elevada", peso: 1300, tolva: "345 – 565", ancho: 990, alturaTotal: 2620, sinArco: 2000 },
  { marca: "Ausa", modelo: "D150AHA", tipo: "Descarga elevada", peso: 1510, tolva: "605 – 852", ancho: 1400, alturaTotal: 2560, sinArco: 1950 },
  { marca: "Ausa", modelo: "D150AHG", tipo: "Giratoria", peso: 1650, tolva: "520 – 835", ancho: 1450, alturaTotal: 2600, sinArco: 1275, destacada: true },
  { marca: "Ausa", modelo: "D250RHGS", tipo: "Giratoria autocargable", peso: 2170, tolva: "850 – 1.200", ancho: 1520, alturaTotal: 2240, sinArco: 2240 },
  { marca: "Ausa", modelo: "D250AHG", tipo: "Giratoria", peso: 2650, tolva: "818 – 1.910", ancho: 1530, alturaTotal: 2740, sinArco: 1900 },
  { marca: "Ausa", modelo: "D350AHG", tipo: "Giratoria", peso: 2831, tolva: "1.050 – 2.737", ancho: 1858, alturaTotal: 2770, sinArco: 1740 },
  { marca: "Ausa", modelo: "D450AHG", tipo: "Giratoria", peso: 2970, tolva: "1.370 – 2.670", ancho: 1860, alturaTotal: 2820, sinArco: 2100 },
  { marca: "Ausa", modelo: "D600AHG", tipo: "Giratoria", peso: 4380, tolva: "1.640 – 3.132", ancho: 2200, alturaTotal: 3250, sinArco: 2230 },
  { marca: "Ausa", modelo: "D1000AHG", tipo: "Giratoria", peso: 4379, tolva: "1.850 – 3.900", ancho: 2470, alturaTotal: 3330, sinArco: 2510 },
  { marca: "Ausa", modelo: "D601 APG", tipo: "Giratoria", peso: 4345, tolva: "1.665 – 3.154", ancho: 2210, alturaTotal: 3280, sinArco: 2290 },
];

const rodillos: Fila[] = [
  { marca: "Bomag", modelo: "BW65H", tipo: "Rodillo de lanza", peso: 710, ancho: 762, alturaTotal: 960, pisada: 650 },
  { marca: "Hamm", modelo: "HD8 VV", tipo: "Rodillo tándem", peso: 1580, ancho: 938, alturaTotal: 2210, pisada: 800 },
  { marca: "Hamm", modelo: "HD10 VV", tipo: "Rodillo tándem", peso: 2475, ancho: 1110, alturaTotal: 2530, pisada: 1100 },
  { marca: "Hamm", modelo: "H7i", tipo: "Rodillo monocilíndrico", peso: 6700, ancho: 1844, alturaTotal: 2930, pisada: 1700, destacada: true },
  { marca: "Hamm", modelo: "H11i", tipo: "Rodillo monocilíndrico", peso: 11200, ancho: 2284, alturaTotal: 2960, pisada: 2080 },
  { marca: "Hamm", modelo: "3414", tipo: "Rodillo monocilíndrico", peso: 13850, ancho: 2250, alturaTotal: 2990, pisada: 2150 },
  { marca: "Hamm", modelo: "3518", tipo: "Rodillo monocilíndrico", peso: 19150, ancho: 2390, alturaTotal: 2980, pisada: 2220 },
  { marca: "Bomag", modelo: "BW 211", tipo: "Rodillo monocilíndrico", peso: 10600, ancho: 2270, alturaTotal: 2990, pisada: 2130 },
];

const pisones: Fila[] = [
  { marca: "Bomag", modelo: "BT60", tipo: "Pisón vibrante", peso: 60, ancho: 350, alturaTotal: 1030, pisada: 230 },
  { marca: "Wacker Neuson", modelo: "BS50-4AS", tipo: "Pisón vibrante", peso: 65, ancho: 343, alturaTotal: 965, pisada: 280 },
  { marca: "Bomag", modelo: "BP 12/50 A", tipo: "Bandeja unidireccional", peso: 73, ancho: 500, alturaTotal: 555, pisada: 500 },
  { marca: "Wacker Neuson", modelo: "BPU 2540", tipo: "Bandeja reversible", peso: 145, ancho: 400, alturaTotal: 703, pisada: 400 },
  { marca: "Bomag", modelo: "BVP 20/50 D", tipo: "Bandeja unidireccional", peso: 109, ancho: 500, alturaTotal: 862, pisada: 500 },
  { marca: "Bomag", modelo: "BPR 25/40 D", tipo: "Bandeja reversible", peso: 150, ancho: 400, alturaTotal: 1080, pisada: 400 },
  { marca: "Bomag", modelo: "BPR 40/60 D", tipo: "Bandeja reversible", peso: 260, ancho: 600, alturaTotal: 1220, pisada: 600 },
  { marca: "Bomag", modelo: "BPR 60/65 D", tipo: "Bandeja reversible", peso: 460, ancho: 450, alturaTotal: 1350, pisada: 650 },
  { marca: "Bomag", modelo: "BPR 70/70", tipo: "Bandeja reversible", peso: 579, ancho: 700, alturaTotal: 1470, pisada: 700 },
];

export const FLOTA_TIERRAS: Maquina[] = [
  ...construir(RETROEXCAVADORAS, 20000, retroexcavadoras),
  ...construir(RETROCARGADORAS, 21000, retrocargadoras),
  ...construir(MINICARGADORAS, 22000, minicargadoras),
  ...construir(DUMPERES, 23000, dumperes),
  ...construir(RODILLOS, 24000, rodillos),
  ...construir(PISONES, 25000, pisones),
];
