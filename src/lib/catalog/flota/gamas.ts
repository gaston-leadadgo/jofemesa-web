import type { Maquina } from "../types";
import { conf, est, pend } from "../types";
import { construir, type Fila, type PerfilSubcategoria } from "./comun";

/**
 * MANUTENCIÓN DE CARGAS, ENERGÍA, AIRE Y HERRAMIENTA — 12 gamas, los siete
 * modelos de carretilla eléctrica (22/10/2026) y los ocho diésel (26/10/2026).
 *
 * Su catálogo general publica estas cuatro familias por RANGO, no modelo
 * a modelo: «capacidad de carga desde 2.000 hasta 7.000 kg», «potencia
 * desde 20 hasta 300 kVA». Así que aquí no hay modelos inventados: cada
 * entrada es la gama entera, marcada como tal (`gama: true`), con el
 * rango del catálogo y una nota que dice que la unidad concreta la
 * confirma la delegación.
 *
 * Es menos vistoso que rellenar la página con veinte modelos plausibles
 * y es lo único honesto que se puede hacer con el dato que hay. En
 * cuanto el cliente pase las tablas de manutención y energía —está
 * anotado en /admin/datos-pendientes— estas gamas se abren en modelos.
 *
 * Las marcas son las que nombra el propio catálogo en cada apartado
 * (Himoinsa, Atlas Copco, Dagartech, Ayerbe, Toku) o las que aparecen
 * fotografiadas en esa misma página (Manitou en manipuladores y
 * carretilla todo terreno, Jungheinrich en carretillas de almacén,
 * Hilti en herramienta).
 */


/* ============================================================
   Manutención de cargas
   ============================================================ */

const baseManutencion = {
  familia: "manipulacion",
  trabajos: ["cargas"],
  requiereFormacion: true,
  noAplica: [
    "alturaTrabajo",
    "profundidadExcavacion",
    "capacidadCazo",
    "caudalAire",
    "presionAire",
    "fuerzaCentrifuga",
    "anchoTrabajo",
  ],
} as const;

const CARRETILLAS_ELECTRICAS: PerfilSubcategoria = {
  ...baseManutencion,
  subcategoriaSlug: "carretillas-contrapesadas-electricas",
  energia: "electrico",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  aplicaciones: [
    "Carga y descarga de camión",
    "Trasiego de palets en almacén",
    "Estanterías de altura media",
    "Industria con exigencias de emisiones",
  ],
  describe: (f) => f.descripcion!,
};

const CARRETILLAS_DIESEL: PerfilSubcategoria = {
  ...CARRETILLAS_ELECTRICAS,
  subcategoriaSlug: "carretillas-contrapesadas-diesel",
  energia: "diesel",
  entornos: ["exterior"],
  aplicaciones: [
    "Patios logísticos y campas",
    "Carga continua de camión",
    "Cargas voluminosas en exterior",
    "Ciclos intensivos de trabajo",
  ],
};

const CARRETILLAS_TODOTERRENO: PerfilSubcategoria = {
  ...CARRETILLAS_ELECTRICAS,
  subcategoriaSlug: "carretillas-todoterreno",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Obra sin pavimentar",
    "Descarga de material en solar",
    "Terrenos con pendiente",
    "Suministro a tajo",
  ],
};

const MANIPULADORES: PerfilSubcategoria = {
  ...baseManutencion,
  subcategoriaSlug: "manipuladores-telescopicos-rigidos",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "4x4",
  aplicaciones: [
    "Elevación de palets a forjado",
    "Descarga de camión en obra",
    "Colocación de encofrado y viguetas",
    "Acopio y movimiento de material",
  ],
  describe: (f) => f.descripcion!,
};

const GIRATORIOS: PerfilSubcategoria = {
  ...MANIPULADORES,
  subcategoriaSlug: "manipuladores-telescopicos-giratorios",
  aplicaciones: [
    "Descarga en todo el perímetro sin mover la máquina",
    "Trabajos donde no cabe una grúa",
    "Montaje industrial",
    "Rehabilitación en casco urbano",
  ],
};

const ALMACEN: PerfilSubcategoria = {
  ...baseManutencion,
  subcategoriaSlug: "maquinas-almacen",
  energia: "electrico",
  entornos: ["interior"],
  traccion: "2x4",
  requiereFormacion: true,
  aplicaciones: [
    "Trasiego diario de palets",
    "Apilado en estanterías",
    "Preparación de pedidos",
    "Refuerzo de campaña",
  ],
  describe: (f) => f.descripcion!,
};

/* ============================================================
   Energía e iluminación
   ============================================================ */

const baseEnergia = {
  familia: "energia",
  trabajos: ["energia"],
  requiereFormacion: false,
  entornos: ["exterior"],
  traccion: "remolcable",
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "capacidadCarga",
    "profundidadExcavacion",
    "capacidadCazo",
    "anchoTrabajo",
    "fuerzaCentrifuga",
  ],
} as const;

const GRUPOS: PerfilSubcategoria = {
  ...baseEnergia,
  subcategoriaSlug: "grupos-electrogenos",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "remolcable",
  aplicaciones: [
    "Obra sin acometida eléctrica",
    "Respaldo en industria",
    "Eventos y rodajes",
    "Ampliación de potencia temporal",
  ],
  describe: (f) => f.descripcion!,
};

const GRUPOS_PORTATILES: PerfilSubcategoria = {
  ...GRUPOS,
  subcategoriaSlug: "grupos-electrogenos-portatiles",
  energia: "gasolina",
  traccion: "2x4",
  aplicaciones: [
    "Herramienta eléctrica en obra pequeña",
    "Reformas sin luz de obra",
    "Instalaciones puntuales",
    "Mantenimiento en campo",
  ],
};

const TORRES: PerfilSubcategoria = {
  ...GRUPOS,
  subcategoriaSlug: "torres-iluminacion",
  energia: "diesel",
  traccion: "remolcable",
  aplicaciones: [
    "Turnos de noche en obra",
    "Reparación de vía en horario nocturno",
    "Eventos y montajes",
    "Zonas de acopio sin alumbrado",
  ],
};

/* ============================================================
   Aire comprimido y martillos
   ============================================================ */

const baseAire = {
  familia: "aire-martillos",
  trabajos: ["energia"],
  requiereFormacion: false,
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "capacidadCarga",
    "profundidadExcavacion",
    "capacidadCazo",
    "anchoTrabajo",
  ],
} as const;

const COMPRESORES: PerfilSubcategoria = {
  ...baseAire,
  subcategoriaSlug: "compresores-remolcables",
  energia: "diesel",
  entornos: ["exterior"],
  traccion: "remolcable",
  aplicaciones: [
    "Alimentación de martillo neumático",
    "Perforación y barrenado",
    "Chorreo y limpieza a presión",
    "Soplado de conducciones",
  ],
  describe: (f) => f.descripcion!,
};

const MARTILLOS: PerfilSubcategoria = {
  ...baseAire,
  subcategoriaSlug: "martillos-neumaticos",
  energia: "diesel",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  aplicaciones: [
    "Demolición de solera y pavimento",
    "Apertura de zanja en firme",
    "Picado de hormigón",
    "Saneado de estructura",
  ],
  describe: (f) => f.descripcion!,
};

/* ============================================================
   Herramienta auxiliar
   ============================================================ */

const HERRAMIENTA: PerfilSubcategoria = {
  familia: "herramienta-auxiliar",
  subcategoriaSlug: "herramienta-obra",
  energia: "electrico",
  entornos: ["interior", "exterior"],
  traccion: "2x4",
  requiereFormacion: false,
  trabajos: ["tierra"],
  noAplica: [
    "alturaTrabajo",
    "alturaElevacion",
    "alcanceHorizontal",
    "capacidadCarga",
    "profundidadExcavacion",
    "capacidadCazo",
    "caudalAire",
    "presionAire",
    "anchoTrabajo",
  ],
  aplicaciones: [
    "Demolición ligera y picado",
    "Corte de hormigón, asfalto y metal",
    "Perforación de corona",
    "Fijación y replanteo",
  ],
  describe: (f) => f.descripcion!,
};

/* ============================================================
   Las gamas
   ============================================================ */

/*
 * Carretillas eléctricas, modelo a modelo (material del 22/10/2026). Antes
 * eran dos gamas del catálogo («de 3 ruedas», «de 4 ruedas»); con las fotos y
 * fichas de la flota la gama se abre en sus siete modelos.
 *
 * Solo se publica lo que dicen las fichas:
 *  - Heli CPD25 y EFG 535k: tabla VDI de su ficha (mástil estándar).
 *  - EFG Vac 22: el documento entregado no es del fabricante (dice basarse en
 *    un manual de 2003), así que sus cifras van como estimadas.
 *  - EFG 218k, 220, 318 y 320: la ficha de la serie 2 no trae estos modelos y
 *    la de la serie 3 llega con la tabla VDI vacía. Solo se da la capacidad
 *    que lleva el propio nombre (Jungheinrich: 218 = 1.800 kg) y el resto
 *    queda pendiente (anotado en /admin/datos-pendientes).
 */
const porNombre = (kg: number, modelo: string) =>
  est(
    kg,
    "nomenclatura-modelo",
    `Capacidad deducida del nombre del modelo (${modelo}): falta la ficha del fabricante para confirmarla.`,
  );
const vac22 = <T,>(v: T) =>
  est(
    v,
    "ficha-pdf",
    "Dato del documento entregado con la máquina, basado en el manual del modelo de 2003. La delegación confirma la unidad al responder tu solicitud.",
  );

const carretillasElectricas: Fila[] = [
  {
    marca: "Jungheinrich",
    modelo: "EFG 218k",
    tipo: "3 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de tres ruedas, de la serie EFG 2 de Jungheinrich. Gira en muy poco espacio para trabajar en pasillos estrechos y, al ser eléctrica, dentro de nave sin emisiones.",
    extra: { capacidadCarga: porNombre(1800, "EFG 218k") },
  },
  {
    marca: "Jungheinrich",
    modelo: "EFG 220",
    tipo: "3 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de tres ruedas, la mayor de la serie EFG 2 de Jungheinrich. Maniobrable en pasillos estrechos y sin emisiones para trabajar dentro de nave.",
    extra: { capacidadCarga: porNombre(2000, "EFG 220") },
  },
  {
    marca: "Jungheinrich",
    modelo: "EFG 318",
    tipo: "4 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de cuatro ruedas, de la serie EFG 3 de Jungheinrich. Más estable que la de tres ruedas para carga y descarga de camión y almacén, sin emisiones.",
    extra: { capacidadCarga: porNombre(1800, "EFG 318") },
  },
  {
    marca: "Jungheinrich",
    modelo: "EFG 320",
    tipo: "4 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de cuatro ruedas, la mayor de la serie EFG 3 de Jungheinrich. Estable para carga de camión y trasiego de palets, con cero emisiones para el interior.",
    extra: { capacidadCarga: porNombre(2000, "EFG 320") },
  },
  {
    marca: "Heli",
    modelo: "CPD25",
    tipo: "4 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de cuatro ruedas con batería de litio, 2.500 kg de capacidad y 3 m de elevación con el mástil estándar. Carga rápida en cualquier momento, para trabajar a varios turnos.",
    extra: {
      capacidadCarga: conf(2500),
      alturaElevacion: conf(3),
      anchoTransporte: conf(1160),
      alturaTransporte: conf(2000),
      longitudTransporte: conf(3502),
      peso: conf(3890),
    },
  },
  {
    marca: "Jungheinrich",
    modelo: "EFG Vac 22",
    tipo: "4 ruedas",
    descripcion:
      "Carretilla eléctrica contrapesada de cuatro ruedas de Jungheinrich, de 2.200 kg de capacidad y 3,1 m de elevación estándar, con bandajes superelásticos y batería de 80 V.",
    extra: {
      capacidadCarga: vac22(2200),
      alturaElevacion: vac22(3.1),
      alturaTransporte: vac22(2200),
      peso: vac22(4300),
    },
  },
  {
    marca: "Jungheinrich",
    modelo: "EFG 535k",
    tipo: "4 ruedas",
    destacada: true,
    descripcion:
      "Carretilla eléctrica contrapesada de cuatro ruedas de gran capacidad: 3.500 kg y 3,1 m de elevación con el mástil estándar. Para cargas pesadas en interior y exterior sin emisiones, con batería de 80 V.",
    extra: {
      capacidadCarga: conf(3500),
      alturaElevacion: conf(3.1),
      anchoTransporte: conf(1340),
      alturaTransporte: conf(2300),
      longitudTransporte: conf(3805),
      peso: conf(5968),
    },
  },
];

/*
 * Carretillas diésel, modelo a modelo (material del 26/10/2026), en lugar de
 * la gama «contrapesada diésel de 4 ruedas». Datos de la tabla VDI de cada
 * ficha, con el mástil estándar. Los nombres son los de la foto del cliente;
 * las tablas de Baoli KBD 25, 30 y 35 los titulan «G1 EU5» (anotado en
 * /admin/datos-pendientes).
 */
const diesel = (
  marca: string,
  modelo: string,
  kg: number,
  elev: number,
  ancho: number,
  plegado: number,
  largo: number,
  peso: number,
  descripcion: string,
  destacada = false,
): Fila => ({
  marca,
  modelo,
  tipo: "4 ruedas",
  destacada,
  descripcion,
  extra: {
    capacidadCarga: conf(kg),
    alturaElevacion: conf(elev),
    anchoTransporte: conf(ancho),
    alturaTransporte: conf(plegado),
    longitudTransporte: conf(largo),
    peso: conf(peso),
  },
});

const carretillasDiesel: Fila[] = [
  diesel("Baoli", "KBD 20 PLUS", 2000, 3, 1140, 2002, 3490, 3320,
    "Carretilla diésel contrapesada de cuatro ruedas, 2.000 kg de capacidad y 3 m de elevación con el mástil estándar. Compacta, para patios y carga de camión donde la autonomía manda."),
  diesel("Jungheinrich", "DFG 320s", 2000, 3.3, 1130, 2212, 3549, 3210,
    "Carretilla diésel contrapesada de cuatro ruedas, 2.000 kg de capacidad y 3,3 m de elevación. Para exterior y ciclos continuos de carga y descarga."),
  diesel("Baoli", "KBD 25 PLUS", 2500, 3, 1265, 2137, 3780, 4250,
    "Carretilla diésel contrapesada de cuatro ruedas, 2.500 kg de capacidad y 3 m de elevación con el mástil estándar. Para patios logísticos, campas y carga de camión."),
  diesel("Jungheinrich", "DFG 425s", 2500, 3.3, 1180, 2321, 3753, 3965,
    "Carretilla diésel contrapesada de cuatro ruedas, 2.500 kg de capacidad y 3,3 m de elevación. Para exterior y ciclos intensivos de trabajo."),
  diesel("Baoli", "KBD 30", 3000, 3, 1265, 2137, 3790, 4620,
    "Carretilla diésel contrapesada de cuatro ruedas, 3.000 kg de capacidad y 3 m de elevación con el mástil estándar. Para cargas voluminosas en exterior y carga continua de camión."),
  diesel("Jungheinrich", "DFG 430s", 3000, 3.3, 1320, 2325, 3853, 4580,
    "Carretilla diésel contrapesada de cuatro ruedas, 3.000 kg de capacidad y 3,3 m de elevación. Para cargas pesadas en patio y campa.",
    true),
  diesel("Baoli", "KBD 35 PLUS", 3500, 3, 1265, 2137, 3870, 5060,
    "Carretilla diésel contrapesada de cuatro ruedas, 3.500 kg de capacidad y 3 m de elevación con el mástil estándar. La mayor de la gama Baoli de la flota, para cargas pesadas en exterior."),
  diesel("Jungheinrich", "DFG 435s", 3500, 3.3, 1320, 2405, 3933, 4995,
    "Carretilla diésel contrapesada de cuatro ruedas, 3.500 kg de capacidad y 3,3 m de elevación. Para las cargas más pesadas de la flota diésel."),
];

/*
 * Carretillas todoterreno y manipuladores telescópicos, modelo a modelo
 * (material del 27/10/2026), en lugar de las tres gamas de Manitou. Datos de
 * la ficha de cada modelo (mástil o configuración estándar); lo que la ficha
 * no da en cifra (el alcance de la JLG 4017 y la MT 1235, la altura replegada
 * de las MC) no se publica. Nombres como en la foto del cliente.
 */
interface DatosFicha {
  kg: number;
  /** Elevación, en m. */
  elev: number;
  /** Alcance, en m. */
  alcance?: number;
  /** Anchura, altura replegada y longitud, en mm. */
  ancho?: number;
  alto?: number;
  largo?: number;
  peso: number;
  rotacion?: number;
}
const deFicha = (marca: string, modelo: string, d: DatosFicha, descripcion: string, destacada = false): Fila => ({
  marca,
  modelo,
  destacada,
  descripcion,
  extra: {
    capacidadCarga: conf(d.kg),
    alturaElevacion: conf(d.elev),
    ...(d.alcance != null ? { alcanceHorizontal: conf(d.alcance) } : {}),
    ...(d.ancho != null ? { anchoTransporte: conf(d.ancho) } : {}),
    ...(d.alto != null ? { alturaTransporte: conf(d.alto) } : {}),
    ...(d.largo != null ? { longitudTransporte: conf(d.largo) } : {}),
    peso: conf(d.peso),
    ...(d.rotacion != null ? { rotacionTorreta: conf(d.rotacion) } : {}),
  },
});

const carretillasTodoterreno: Fila[] = [
  deFicha("Ausa", "C 150 H x4", { kg: 1500, elev: 2.66, ancho: 1300, alto: 2037, peso: 2700 },
    "Carretilla todoterreno 4x4 compacta de 1.500 kg y 2,66 m de elevación con el mástil estándar. Para descargar material en solar y obra sin pavimentar."),
  deFicha("Manitou", "MC 18-4", { kg: 1800, elev: 3.3, ancho: 1450, largo: 4216, peso: 3606 },
    "Carretilla todoterreno de cuatro ruedas motrices, 1.800 kg de capacidad y 3,3 m de elevación con el mástil estándar. Para obra y terrenos sin pavimentar."),
  deFicha("Ausa", "C 201 H x4", { kg: 2000, elev: 3.3, ancho: 1520, alto: 2410, peso: 3635 },
    "Carretilla todoterreno 4x4 de 2.000 kg y 3,3 m de elevación con el mástil estándar. Tracción total para descargar en solar y suministrar a tajo."),
  deFicha("Manitou", "MH 20-4T", { kg: 2000, elev: 3.3, ancho: 1440, alto: 1990, largo: 4040, peso: 4040 },
    "Carretilla todoterreno 4x4 de 2.000 kg y 3,3 m de elevación, con menos de 2 m de altura total para pasar por accesos bajos."),
  deFicha("Ausa", "C 250 H x4", { kg: 2500, elev: 3.3, ancho: 1520, alto: 2460, peso: 4400 },
    "Carretilla todoterreno 4x4 de 2.500 kg y 3,3 m de elevación con el mástil estándar. Para cargas pesadas en obra y terrenos con pendiente."),
  deFicha("Ausa", "C 251 H x4", { kg: 2500, elev: 3.3, ancho: 1520, alto: 2460, peso: 4255 },
    "Carretilla todoterreno 4x4 de 2.500 kg y 3,3 m de elevación con el mástil estándar. Tracción total para descarga de material en solar."),
  deFicha("Manitou", "MC 25-4", { kg: 2500, elev: 3.3, ancho: 1450, largo: 4348, peso: 3928 },
    "Carretilla todoterreno de cuatro ruedas motrices, 2.500 kg de capacidad y 3,3 m de elevación con el mástil estándar. Para obra y terrenos sin pavimentar.",
    true),
  deFicha("Manitou", "MH 25-4T", { kg: 2500, elev: 3.3, ancho: 1440, alto: 1990, largo: 4040, peso: 4340 },
    "Carretilla todoterreno 4x4 de 2.500 kg y 3,3 m de elevación, con menos de 2 m de altura total para pasar por accesos bajos."),
];

const manipuladores: Fila[] = [
  deFicha("Manitou", "MT 420 H", { kg: 2000, elev: 4.35, alcance: 2.65, ancho: 1490, alto: 1970, largo: 3640, peso: 4190 },
    "Manipulador telescópico compacto de 2.000 kg y 4,35 m de elevación. Para descargar camión y mover material en obras con poco espacio."),
  deFicha("Ausa", "T204 H", { kg: 2000, elev: 4.2, alcance: 2.6, ancho: 1595, alto: 1995, largo: 4664, peso: 4050 },
    "Manipulador telescópico compacto de 2.000 kg y 4,2 m de elevación, con tracción 4x4 permanente. Para acopio y descarga en obra."),
  deFicha("Manitou", "MT 625 H", { kg: 2500, elev: 5.85, alcance: 3.4, ancho: 1810, alto: 1920, largo: 3830, peso: 4800 },
    "Manipulador telescópico compacto de 2.500 kg y 5,85 m de elevación. Para descarga de camión, acopio y trabajos en accesos bajos."),
  deFicha("Manitou", "MT 1235", { kg: 3500, elev: 12, ancho: 2390, alto: 2580, largo: 5590, peso: 9400 },
    "Manipulador telescópico de 3.500 kg y 12 m de elevación. Sube palets a forjado y coloca material en altura."),
  deFicha("Manitou", "MT 1440 Easy", { kg: 4000, elev: 13.53, alcance: 9.46, ancho: 2360, alto: 2450, largo: 6020, peso: 10855 },
    "Manipulador telescópico de 4.000 kg y 13,5 m de elevación, con 9,5 m de alcance. Para elevar palets a forjado y colocar encofrado.",
    true),
  deFicha("JLG", "4017", { kg: 4000, elev: 17.1, ancho: 2350, alto: 2663, largo: 6372, peso: 11500 },
    "Manipulador telescópico de 4.000 kg y 17,1 m de elevación, con estabilizadores. Para colocar material en altura en obra de edificación."),
  deFicha("Manitou", "MT 1840 Easy", { kg: 4000, elev: 17.55, alcance: 13.08, ancho: 2360, alto: 2450, largo: 6150, peso: 11710 },
    "Manipulador telescópico de 4.000 kg y 17,5 m de elevación, con 13 m de alcance. Para colocar material en altura y descargar camión."),
];

const giratorios: Fila[] = [
  deFicha("Manitou", "MRT 1432", { kg: 3200, elev: 13.82, alcance: 11.63, ancho: 2390, alto: 2970, largo: 5350, peso: 12450, rotacion: 400 },
    "Manipulador telescópico giratorio de 3.200 kg y 13,8 m de elevación, con torreta de 400°. Descarga y posiciona en todo el perímetro sin mover la máquina."),
  deFicha("Manitou", "MRT 1840 Easy", { kg: 4000, elev: 17.9, alcance: 15.1, ancho: 2400, alto: 2970, largo: 5540, peso: 13300 },
    "Manipulador telescópico giratorio de 4.000 kg y 17,9 m de elevación, con 15,1 m de alcance. Para montaje industrial y trabajos donde no cabe una grúa."),
  deFicha("Manitou", "MRT 2145 Easy", { kg: 4500, elev: 20.6, alcance: 17.9, ancho: 2500, alto: 3020, largo: 6590, peso: 14530 },
    "Manipulador telescópico giratorio de 4.500 kg y 20,6 m de elevación, con 17,9 m de alcance. El de más altura de la flota, para montaje y rehabilitación."),
];

const almacen: Fila[] = [
  {
    marca: "Jungheinrich",
    modelo: "Máquinas de almacén",
    gama: true,
    descripcion:
      "Transpaletas eléctricas, apiladores y preparadoras de pedidos para el movimiento diario del almacén. Somos partner oficial de Jungheinrich, así que la misma máquina se puede alquilar, comprar nueva o comprar reacondicionada.",
    extra: {
      capacidadCarga: pend(
        "La capacidad depende del equipo concreto. Dinos peso de palet y altura de estantería y te decimos cuál encaja.",
      ),
      alturaElevacion: pend(
        "Va por modelo, no por gama. Te la confirmamos al consultar disponibilidad.",
      ),
    },
  },
];

/*
 * Grupos electrógenos, modelo a modelo (material del 27/10/2026), en lugar
 * de las tres gamas del catálogo. Los cinco datos que el cliente pide para
 * el comparador van tal cual su tabla «GRUPOS ELECTRÓGENOS FICHAS DE
 * CARACTERÍSTICAS»: potencia PRP/ESP, frecuencia, tensión, emisiones y
 * versión. Las fotos y fichas llegan aparte.
 *  - Los dos Dagartech DGH (4,1 y 8 kVA, chasis abierto) van en portátiles.
 *  - «HYW20 T5 INS 50 HZ» se publica como «HYW20 T5»: INS y 50 Hz ya están
 *    en versión y frecuencia.
 */
const tablaGrupos = (v: string) => conf(v, "catalogo-jofemesa");
const grupo = (
  marca: string,
  modelo: string,
  potencia: string,
  frecuencia: string,
  tension: string,
  emisiones: string,
  version: string,
  destacada = false,
): Fila => {
  const portatil = /abierto/i.test(version);
  const tipo = version.replace(/\s*\(Rental\)/i, "").toLowerCase();
  const rental = /rental/i.test(version) ? ", de la serie Rental" : "";
  return {
    marca,
    modelo,
    destacada,
    descripcion:
      `Grupo electrógeno ${portatil ? "portátil " : ""}${tipo}${rental}: ${potencia} de potencia PRP/ESP, ${frecuencia} y ${tension}, con nivel de emisiones ${emisiones}. ` +
      (portatil
        ? "Para herramienta eléctrica y trabajos puntuales donde no hay luz de obra."
        : "Para obra sin acometida, respaldo en industria o eventos."),
    extra: {
      potenciaPrpEsp: tablaGrupos(potencia),
      frecuencia: tablaGrupos(frecuencia),
      voltaje: tablaGrupos(tension),
      emisiones: tablaGrupos(emisiones),
      version: tablaGrupos(version),
    },
  };
};

const grupos: Fila[] = [
  grupo("Himoinsa", "HYW20 T5", "20/22 kVA (16/17,6 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Atlas Copco", "QAS 30 KD 55", "30/33 kVA (24/26,4 kW)", "50 Hz", "400 V", "Stage IIIA", "Insonorizado"),
  grupo("Pramac", "GSW35", "32,5/35,7 kVA (26/28,6 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Himoinsa", "HYW35", "34/37 kVA (27/30 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Himoinsa", "HYW35 T5", "34/37 kVA (27/30 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Atlas Copco", "QAS 45 KD 55", "45/50 kVA (36/40 kW)", "50 Hz", "400 V", "Stage IIIA", "Insonorizado"),
  grupo("Himoinsa", "HYW45 T5", "45/50 kVA (36/40 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Pramac", "GSW50", "45/49,5 kVA (36/39,6 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Dagartech", "DGDR 60 ST", "54/59 kVA (43/47 kW)", "50 Hz", "400/230 V", "EU Stage V", "Insonorizado"),
  grupo("Himoinsa", "HRFW60 S5", "58/64 kVA (46/51 kW)", "50 Hz", "400/230 V", "EU Stage V", "Insonorizado (Rental)", true),
  grupo("Pramac", "GPW60P/FS3A", "60,3/65,9 kVA (48,2/52,7 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Dagartech", "DGDR 100 ST", "93/102 kVA (74/82 kW)", "50 Hz", "400/230 V", "EU Stage V", "Insonorizado"),
  grupo("Himoinsa", "HRFW100", "100/110 kVA (80/88 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado (Rental)"),
  grupo("Himoinsa", "HRFW100 T5", "100/110 kVA (80/88 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado (Rental)"),
  grupo("Pramac", "GSW115", "106,15/116 kVA (84,92/92,8 kW)", "50 Hz", "400 V", "Stage IIIA", "Insonorizado"),
  grupo("Dagartech", "DGDR150", "136/150 kVA (109/120 kW)", "50 Hz", "400/230 V", "EU Stage V", "Insonorizado"),
  grupo("Atlas Copco", "QAS 150 FPT S5", "150/166 kVA (120/133 kW)", "50 Hz", "400 V", "EU Stage V", "Insonorizado"),
  grupo("Himoinsa", "HFW160 T5", "152/168 kVA (122/134 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Pramac", "GSW167P", "152/167 kVA (121,6/133,6 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Pramac", "GSW210", "190,96/210,89 kVA (152,77/168,71 kW)", "50 Hz", "400 V", "Stage IIIA", "Insonorizado"),
  grupo("Atlas Copco", "QAS 200 FD S5", "200/220 kVA (160/176 kW)", "50 Hz", "400 V", "EU Stage V", "Insonorizado"),
  grupo("Himoinsa", "HFW200 T5", "200/220 kVA (160/176 kW)", "50 Hz", "400/230 V", "Stage IIIA", "Insonorizado"),
  grupo("Dagartech", "DGVS 275 ST", "250/275 kVA (200/220 kW)", "50 Hz", "400/230 V", "EU Stage II (uso estacionario)", "Insonorizado"),
  grupo("Dagartech", "DGVS 330 ST", "300/330 kVA (240/264 kW)", "50 Hz", "400/230 V", "EU Stage II (uso estacionario)", "Insonorizado"),
];
const gruposPortatiles: Fila[] = [
  grupo("Dagartech", "DGH 5000 B", "4,1 kVA / N/D (4,1 kW / N/D)", "50 Hz", "230 V", "EU Stage V", "No insonorizado (chasis abierto)"),
  grupo("Dagartech", "DGH 9 TF BC", "8 kVA / N/D (6,5 kW / N/D)", "50 Hz", "400/230 V", "EU Stage V", "No insonorizado (chasis móvil abierto)"),
];

const torres: Fila[] = [
  {
    marca: "Atlas Copco",
    modelo: "Torre de iluminación LED",
    gama: true,
    descripcion:
      "Torres de iluminación móviles con focos LED y generador incorporado. Mástil telescópico para cubrir una zona de acopio o un tajo completo en turno de noche, con consumo muy por debajo del halogenuro.",
    extra: {
      potencia: pend(
        "La potencia va por modelo de torre. Dinos la superficie a iluminar y las horas de turno y te decimos cuál encaja.",
      ),
      autonomia: pend(
        "Depende del modelo y del depósito. Te la confirmamos al consultar disponibilidad.",
      ),
    },
  },
];

const compresores: Fila[] = [
  {
    marca: "Atlas Copco",
    modelo: "Compresor de aire remolcable",
    gama: true,
    destacada: true,
    descripcion:
      "Compresores de aire remolcables insonorizados con aire libre suministrado de 2 a 11 m³/min. Se enganchan a un vehículo ligero y alimentan desde un martillo hasta una batería de herramienta neumática.",
    extra: {
      caudalAire: conf("2 – 11 m³/min", "catalogo-jofemesa"),
      motor: conf("Diésel", "catalogo-jofemesa"),
    },
  },
];

const martillos: Fila[] = [
  {
    marca: "Atlas Copco",
    modelo: "Martillo picador neumático",
    gama: true,
    descripcion:
      "Martillos picadores neumáticos Atlas Copco para picado de hormigón, saneado de estructura y apertura de rozas. Se alimentan desde cualquiera de nuestros compresores remolcables.",
    extra: { presionAire: pend("Según modelo y puntero.") },
  },
  {
    marca: "Atlas Copco",
    modelo: "Rompedor neumático",
    gama: true,
    descripcion:
      "Rompedores neumáticos Atlas Copco y Toku para demolición de solera y pavimento y apertura de zanja en firme. Distintos pesos de maza según el espesor a romper.",
    extra: { presionAire: pend("Según modelo y puntero.") },
  },
];

const herramienta: Fila[] = [
  {
    marca: "Hilti",
    modelo: "Herramienta eléctrica de obra",
    gama: true,
    descripcion:
      "Martillos rompedores y perforadores, cortadoras de disco, perforadoras de corona al agua, clavadoras de fijación y niveles láser. Es el remate que la máquina grande no hace y que acaba parando el tajo si falta.",
  },
];

export const FLOTA_GAMAS: Maquina[] = [
  ...construir(MANIPULADORES, 11000, manipuladores),
  ...construir(GIRATORIOS, 11200, giratorios),
  ...construir(CARRETILLAS_ELECTRICAS, 11400, carretillasElectricas),
  ...construir(CARRETILLAS_DIESEL, 11600, carretillasDiesel),
  ...construir(CARRETILLAS_TODOTERRENO, 11800, carretillasTodoterreno),
  ...construir(ALMACEN, 12000, almacen),
  ...construir(GRUPOS, 30000, grupos),
  ...construir(GRUPOS_PORTATILES, 30200, gruposPortatiles),
  ...construir(TORRES, 30400, torres),
  ...construir(COMPRESORES, 31000, compresores),
  ...construir(MARTILLOS, 31200, martillos),
  ...construir(HERRAMIENTA, 32000, herramienta),
];
