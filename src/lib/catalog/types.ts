import type { DelegacionId } from "@/content/es/empresa";

/* ============================================================
   Dato<T> — la pieza que sostiene la promesa de no inventar nada.
   Cada especificación lleva su estado de verificación, así que la
   interfaz puede distinguir entre "11,75 m leídos en la ficha del
   fabricante" y "no lo sabemos todavía".
   ============================================================ */

export type FuenteDato =
  /** CATÁLOGO GENERAL DE MAQUINARIA JOFEMESA — su material comercial vigente */
  | "catalogo-jofemesa"
  /** Publicado por el cliente en jofemesa.com */
  | "jofemesa.com"
  /** Transcrito de la ficha técnica en PDF que sirven ellos mismos */
  | "ficha-pdf"
  /** Deducido del propio nombre del modelo (GS-3268 → 32 ft / 68 in) */
  | "nomenclatura-modelo"
  /** Catálogo público del fabricante */
  | "fabricante";

export type Dato<T> =
  | { estado: "confirmado"; valor: T; fuente: FuenteDato }
  | { estado: "estimado"; valor: T; fuente: FuenteDato; nota?: string }
  | { estado: "pendiente"; nota?: string }
  | { estado: "no_aplica" };

/** Devuelve el valor solo si es utilizable para filtrar u ordenar. */
export function valorDe<T>(d: Dato<T> | undefined): T | undefined {
  if (!d) return undefined;
  return d.estado === "confirmado" || d.estado === "estimado"
    ? d.valor
    : undefined;
}

export function numeroDe(d: Dato<unknown> | undefined): number | undefined {
  const v = valorDe(d);
  return typeof v === "number" ? v : undefined;
}

/** Atajos, para que el catálogo se lea sin ruido. */
export const conf = <T,>(valor: T, fuente: FuenteDato = "ficha-pdf"): Dato<T> =>
  ({ estado: "confirmado", valor, fuente }) as const;

export const est = <T,>(
  valor: T,
  fuente: FuenteDato = "fabricante",
  nota?: string,
): Dato<T> => ({ estado: "estimado", valor, fuente, nota }) as const;

export const pend = <T,>(nota?: string): Dato<T> =>
  ({ estado: "pendiente", nota }) as const;

export const na = <T,>(): Dato<T> => ({ estado: "no_aplica" }) as const;

/* ============================================================
   Taxonomía de dos niveles: familia → subcategoría.
   Es la que usan los grandes del sector y la que hace que el
   filtro por categoría sea realmente útil.
   ============================================================ */

export type FamiliaId =
  | "elevacion"
  | "manipulacion"
  | "movimiento-tierras"
  | "energia"
  | "aire-martillos"
  | "herramienta-auxiliar";

export type Energia = "electrico" | "diesel" | "hibrido" | "gasolina";
export type Entorno = "interior" | "exterior";
export type Traccion = "2x4" | "4x4" | "oruga" | "remolcable" | "sobre-camion";
export type Linea = "alquiler" | "venta";
export type CondicionVenta = "nueva" | "reacondicionada";

/** Trabajos que reconoce el asesor "¿Qué máquina necesito?". */
export type TrabajoId = "altura" | "cargas" | "tierra" | "energia";

/* ============================================================
   Registro de especificaciones.
   Añadir una clave aquí y su definición en SPEC_DEFS la hace
   aparecer sola en la ficha y en el comparador: ni la tabla
   técnica ni el comparador cablean una sola fila.
   ============================================================ */

export type SpecKey =
  | "alturaTrabajo"
  | "alcanceHorizontal"
  | "capacidadCarga"
  | "alturaElevacion"
  | "dimensionesPlataforma"
  | "anchoTransporte"
  | "alturaTransporte"
  | "longitudTransporte"
  | "peso"
  | "pendienteSuperable"
  | "velocidadTraslacion"
  | "traccion"
  | "potencia"
  | "autonomia"
  | "profundidadExcavacion"
  | "capacidadCazo"
  | "caudalAire"
  | "presionAire"
  | "anchoTrabajo"
  | "fuerzaCentrifuga"
  | "voltaje"
  | "alturaPlataforma"
  | "personas"
  | "extensionPlataforma"
  | "radioGiroInterior"
  | "motor"
  | "rotacionTorreta";

/** Una spec puede ser numérica (11,75) o textual ("Kubota D-1105"). */
export type SpecValor = Dato<number | string>;

export type SpecGrupo =
  | "prestaciones"
  | "dimensiones"
  | "capacidades"
  | "motorizacion";

export interface SpecDef {
  key: SpecKey;
  etiqueta: string;
  /**
   * Versión corta para la franja de tres cifras de la tarjeta, donde
   * «Profundidad de excavación» no cabe y se corta a la mitad. Si no
   * hay, se usa `etiqueta`.
   */
  etiquetaCorta?: string;
  /** Unidad ya formateada. Cadena vacía si el propio valor la trae. */
  unidad: string;
  grupo: SpecGrupo;
  orden: number;
  /** Para resaltar el mejor valor de cada fila del comparador. */
  mejor: "mayor" | "menor" | null;
  /** Familias en cuya tarjeta sale, en la franja de tres specs. */
  destacadaEn?: FamiliaId[];
}

export const SPEC_DEFS: readonly SpecDef[] = [
  {
    key: "alturaTrabajo",
    etiqueta: "Altura de trabajo",
    etiquetaCorta: "Altura trabajo",
    unidad: "m",
    grupo: "prestaciones",
    orden: 10,
    mejor: "mayor",
    destacadaEn: ["elevacion"],
  },
  {
    key: "alcanceHorizontal",
    etiqueta: "Alcance horizontal",
    etiquetaCorta: "Alcance",
    unidad: "m",
    grupo: "prestaciones",
    orden: 20,
    mejor: "mayor",
    destacadaEn: ["elevacion"],
  },
  {
    key: "alturaElevacion",
    etiqueta: "Altura de elevación",
    etiquetaCorta: "Altura elev.",
    unidad: "m",
    grupo: "prestaciones",
    orden: 30,
    mejor: "mayor",
    destacadaEn: ["manipulacion"],
  },
  {
    key: "capacidadCarga",
    etiqueta: "Capacidad de carga",
    etiquetaCorta: "Carga máx.",
    unidad: "kg",
    grupo: "capacidades",
    orden: 40,
    mejor: "mayor",
    destacadaEn: ["elevacion", "manipulacion"],
  },
  {
    key: "profundidadExcavacion",
    etiqueta: "Profundidad de excavación",
    etiquetaCorta: "Prof. excav.",
    unidad: "m",
    grupo: "prestaciones",
    orden: 50,
    mejor: "mayor",
    destacadaEn: ["movimiento-tierras"],
  },
  {
    key: "capacidadCazo",
    etiqueta: "Capacidad del cazo",
    etiquetaCorta: "Cazo",
    unidad: "",
    grupo: "capacidades",
    orden: 60,
    mejor: null,
  },
  {
    key: "potencia",
    etiqueta: "Potencia",
    unidad: "",
    grupo: "motorizacion",
    orden: 70,
    mejor: null,
    destacadaEn: ["energia", "aire-martillos"],
  },
  {
    key: "caudalAire",
    etiqueta: "Caudal de aire",
    etiquetaCorta: "Caudal",
    unidad: "",
    grupo: "capacidades",
    orden: 80,
    mejor: null,
    destacadaEn: ["aire-martillos"],
  },
  {
    key: "presionAire",
    etiqueta: "Presión de trabajo",
    etiquetaCorta: "Presión",
    unidad: "",
    grupo: "capacidades",
    orden: 90,
    mejor: null,
  },
  {
    key: "anchoTrabajo",
    etiqueta: "Ancho de trabajo",
    etiquetaCorta: "Ancho trabajo",
    unidad: "m",
    grupo: "prestaciones",
    orden: 100,
    mejor: "mayor",
    destacadaEn: ["movimiento-tierras"],
  },
  {
    key: "fuerzaCentrifuga",
    etiqueta: "Fuerza centrífuga",
    etiquetaCorta: "Fuerza centr.",
    unidad: "",
    grupo: "prestaciones",
    orden: 110,
    mejor: null,
  },
  {
    key: "dimensionesPlataforma",
    etiqueta: "Plataforma de trabajo",
    etiquetaCorta: "Plataforma",
    unidad: "",
    grupo: "dimensiones",
    orden: 120,
    mejor: null,
  },
  {
    key: "anchoTransporte",
    etiqueta: "Anchura",
    unidad: "mm",
    grupo: "dimensiones",
    orden: 130,
    mejor: "menor",
    destacadaEn: ["movimiento-tierras"],
  },
  {
    key: "alturaTransporte",
    etiqueta: "Altura replegada",
    etiquetaCorta: "Altura repl.",
    unidad: "mm",
    grupo: "dimensiones",
    orden: 140,
    mejor: "menor",
  },
  {
    key: "longitudTransporte",
    etiqueta: "Longitud",
    unidad: "mm",
    grupo: "dimensiones",
    orden: 150,
    mejor: "menor",
  },
  {
    key: "peso",
    etiqueta: "Peso",
    unidad: "kg",
    grupo: "dimensiones",
    orden: 160,
    mejor: null,
    destacadaEn: ["movimiento-tierras"],
  },
  {
    key: "pendienteSuperable",
    etiqueta: "Pendiente superable",
    etiquetaCorta: "Pendiente",
    unidad: "%",
    grupo: "prestaciones",
    orden: 170,
    mejor: null,
  },
  {
    key: "velocidadTraslacion",
    etiqueta: "Velocidad de traslación",
    etiquetaCorta: "Velocidad",
    unidad: "",
    grupo: "prestaciones",
    orden: 180,
    mejor: null,
  },
  {
    key: "voltaje",
    etiqueta: "Voltaje",
    unidad: "",
    grupo: "motorizacion",
    orden: 185,
    mejor: null,
  },
  {
    key: "traccion",
    etiqueta: "Tracción",
    unidad: "",
    grupo: "motorizacion",
    orden: 190,
    mejor: null,
  },
  {
    key: "autonomia",
    etiqueta: "Autonomía",
    unidad: "",
    grupo: "motorizacion",
    orden: 200,
    mejor: null,
    destacadaEn: ["energia"],
  },
  {
    key: "alturaPlataforma",
    etiqueta: "Altura de plataforma",
    etiquetaCorta: "Altura plat.",
    unidad: "m",
    grupo: "prestaciones",
    orden: 15,
    mejor: "mayor",
  },
  {
    key: "personas",
    etiqueta: "Personas en plataforma",
    etiquetaCorta: "Personas",
    unidad: "",
    grupo: "capacidades",
    orden: 45,
    mejor: "mayor",
  },
  {
    key: "extensionPlataforma",
    etiqueta: "Extensión de plataforma",
    etiquetaCorta: "Extensión",
    unidad: "m",
    grupo: "dimensiones",
    orden: 125,
    mejor: "mayor",
  },
  {
    key: "radioGiroInterior",
    etiqueta: "Radio de giro interior",
    etiquetaCorta: "Radio giro",
    unidad: "m",
    grupo: "dimensiones",
    orden: 155,
    mejor: "menor",
  },
  {
    key: "rotacionTorreta",
    etiqueta: "Rotación de torreta",
    etiquetaCorta: "Rotación",
    unidad: "°",
    grupo: "prestaciones",
    orden: 35,
    mejor: "mayor",
  },
  {
    key: "motor",
    etiqueta: "Motor",
    unidad: "",
    grupo: "motorizacion",
    orden: 165,
    mejor: null,
  },
] as const;

export const SPEC_POR_KEY = Object.fromEntries(
  SPEC_DEFS.map((s) => [s.key, s]),
) as Record<SpecKey, SpecDef>;

/* ============================================================
   Familias y subcategorías
   ============================================================ */

/**
 * Los dibujos de máquina del sistema. Es la iconografía que el cliente
 * pasó en la reunión del 24/08/2026 y que gustó a las dos partes: trazo
 * rojo de una sola anchura, una máquina reconocible por categoría.
 */
export type IconoId =
  | "tijera"
  | "columna"
  | "brazo"
  | "telescopica"
  | "oruga"
  | "camion"
  | "manipulador"
  | "giratorio"
  | "carretilla"
  | "todoterreno"
  | "almacen"
  | "excavadora"
  | "mixta"
  | "minicargadora"
  | "dumper"
  | "rodillo"
  | "pison"
  | "grupo"
  | "torre"
  | "compresor"
  | "martillo"
  | "herramienta";

export interface Subcategoria {
  nombre: string;
  slug: string;
  /** Una frase que dice para qué sirve, sin jerga. */
  claim: string;
  descripcion: string;
  icono: IconoId;
}

export interface Familia {
  id: FamiliaId;
  nombre: string;
  /** El nombre tal y como lo titula su catálogo general. */
  nombreLargo: string;
  slug: string;
  claim: string;
  descripcion: string;
  /** Rango para la portada: "Desde 4,5 m hasta 57 m". */
  rango: string;
  /** Título de la tarjeta de portada, en clave de necesidad. */
  necesidad: string;
  necesidadDesc: string;
  icono: IconoId;
  subcategorias: readonly Subcategoria[];
}

/* ============================================================
   La máquina
   ============================================================ */

export interface ImagenMaquina {
  src: string;
  /** Obligatorio. El diagnóstico contó un 47% de imágenes sin descripción. */
  alt: string;
  ancho: number;
  alto: number;
  origen: "jofemesa.com" | "fabricante";
}

export interface FichaTecnica {
  src: string;
  bytes: number;
  urlOriginal?: string;
}

export interface Maquina {
  id: string;
  slug: string;
  marca: string;
  modelo: string;

  familia: FamiliaId;
  subcategoriaSlug: string;

  lineas: Linea[];
  condicionVenta?: CondicionVenta;
  destacada: boolean;
  orden: number;

  /**
   * Una gama, no una unidad concreta. Su catálogo general publica
   * manutención, energía, aire y herramienta por rangos («desde 2.000
   * hasta 7.000 kg») en vez de modelo a modelo, así que esas entradas
   * son la gama entera y la ficha lo dice con estas palabras. No se
   * inventa una lista de modelos que ellos no publican.
   */
  gama?: boolean;

  /** Facetas duras: siempre conocidas, alimentan los filtros. */
  facetas: {
    energia: Energia;
    entornos: Entorno[];
    traccion: Traccion;
    requiereFormacion: boolean;
  };

  delegaciones: DelegacionId[];

  specs: Partial<Record<SpecKey, SpecValor>>;

  /** 25-50 palabras: uso + beneficio + característica. */
  descripcionCorta: string;
  aplicaciones: string[];
  destacados: string[];

  imagenes: ImagenMaquina[];
  fichaTecnica: FichaTecnica | null;

  /** Para el asesor. */
  trabajos: TrabajoId[];
  notaAsesor?: string;
}
