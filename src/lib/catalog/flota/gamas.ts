import type { Maquina } from "../types";
import { conf, est, pend } from "../types";
import { construir, type Fila, type PerfilSubcategoria } from "./comun";

/**
 * MANUTENCIÓN DE CARGAS, ENERGÍA, AIRE Y HERRAMIENTA — 15 gamas.
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

const rango = (min: number, max: number, unidad: string) =>
  est(
    max,
    "catalogo-jofemesa",
    `El catálogo publica una gama de ${min.toLocaleString("es-ES")} a ${max.toLocaleString("es-ES")} ${unidad}. Aquí se muestra el máximo de la gama: la unidad concreta la confirma la delegación al responder tu solicitud.`,
  );

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

const carretillasElectricas: Fila[] = [
  {
    marca: "Jungheinrich",
    modelo: "Contrapesada eléctrica de 3 ruedas",
    gama: true,
    descripcion:
      "Carretilla frontal contrapesada eléctrica de tres ruedas, de 1.600 a 2.000 kg de capacidad y hasta 7 m de elevación. Tres ruedas para girar en pasillos estrechos y motor eléctrico para trabajar dentro de nave sin emisiones.",
    extra: {
      capacidadCarga: rango(1600, 2000, "kg"),
      alturaElevacion: conf(7, "catalogo-jofemesa"),
    },
  },
  {
    marca: "Jungheinrich",
    modelo: "Contrapesada eléctrica de 4 ruedas",
    gama: true,
    destacada: true,
    descripcion:
      "Carretilla frontal contrapesada eléctrica de cuatro ruedas, de 1.500 a 2.500 kg de capacidad y hasta 7 m de elevación. Más estabilidad que la de tres ruedas manteniendo el cero emisiones del interior.",
    extra: {
      capacidadCarga: rango(1500, 2500, "kg"),
      alturaElevacion: conf(7, "catalogo-jofemesa"),
    },
  },
];

const carretillasDiesel: Fila[] = [
  {
    marca: "Jungheinrich",
    modelo: "Contrapesada diésel de 4 ruedas",
    gama: true,
    descripcion:
      "Carretilla frontal contrapesada diésel de cuatro ruedas, de 1.800 a 3.500 kg de capacidad y hasta 5,50 m de elevación. Para patios, campas y ciclos de carga continuos donde la autonomía manda.",
    extra: {
      capacidadCarga: rango(1800, 3500, "kg"),
      alturaElevacion: conf(5.5, "catalogo-jofemesa"),
    },
  },
];

const carretillasTodoterreno: Fila[] = [
  {
    marca: "Manitou",
    modelo: "Carretilla todo terreno diésel 4x4",
    gama: true,
    descripcion:
      "Carretilla todo terreno diésel de cuatro ruedas motrices, de 1.500 a 2.500 kg de capacidad y hasta 4,60 m de elevación. Neumáticos de obra y tracción total para descargar material en solar sin pavimentar.",
    extra: {
      capacidadCarga: rango(1500, 2500, "kg"),
      alturaElevacion: conf(4.6, "catalogo-jofemesa"),
    },
  },
];

const manipuladores: Fila[] = [
  {
    marca: "Manitou",
    modelo: "Manipulador telescópico rígido",
    gama: true,
    destacada: true,
    descripcion:
      "Manipulador telescópico rígido todo terreno, de 2.000 a 7.000 kg de capacidad y alcance variable de 4 a 18 metros. Sube palets a forjado, descarga camión y mueve acopio con una sola máquina.",
    extra: {
      capacidadCarga: rango(2000, 7000, "kg"),
      alturaElevacion: rango(4, 18, "m"),
    },
  },
];

const giratorios: Fila[] = [
  {
    marca: "Manitou",
    modelo: "Manipulador telescópico giratorio",
    gama: true,
    descripcion:
      "Manipulador telescópico giratorio todo terreno, de 3.200 a 4.000 kg de capacidad y alcance variable de 14 a 21 metros. Torreta de giro continuo: descarga y posiciona en todo el perímetro sin mover la máquina.",
    extra: {
      capacidadCarga: rango(3200, 4000, "kg"),
      alturaElevacion: rango(14, 21, "m"),
      rotacionTorreta: conf(360, "catalogo-jofemesa"),
    },
  },
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

const grupos: Fila[] = [
  {
    marca: "Himoinsa",
    modelo: "Grupo electrógeno Stage V de 20 a 300 kVA",
    gama: true,
    destacada: true,
    descripcion:
      "Grupos electrógenos diésel insonorizados Stage V de 20 a 300 kVA, de Himoinsa y Atlas Copco. Cuadro de distribución, depósito de gran autonomía y nivel sonoro apto para casco urbano.",
    extra: {
      potencia: conf("20 – 300 kVA", "catalogo-jofemesa"),
      motor: conf("Diésel Stage V", "catalogo-jofemesa"),
    },
  },
  {
    marca: "Dagartech",
    modelo: "Grupo electrógeno Stage V de 30 a 300 kVA",
    gama: true,
    descripcion:
      "Grupos electrógenos diésel Dagartech Stage V de 30 a 300 kVA, en versión de alquiler. Fabricación europea, arranque automático y cuadro preparado para obra.",
    extra: {
      potencia: conf("30 – 300 kVA", "catalogo-jofemesa"),
      motor: conf("Diésel Stage V", "catalogo-jofemesa"),
    },
  },
];

const gruposPortatiles: Fila[] = [
  {
    marca: "Dagartech",
    modelo: "Grupo electrógeno portátil de gasolina",
    gama: true,
    descripcion:
      "Grupos electrógenos portátiles de gasolina de 5 a 10 kVA, de Dagartech y Ayerbe. Los mueve una persona y dan corriente para herramienta eléctrica donde no hay luz de obra.",
    extra: {
      potencia: conf("5 – 10 kVA", "catalogo-jofemesa"),
      motor: conf("Gasolina", "catalogo-jofemesa"),
    },
  },
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
