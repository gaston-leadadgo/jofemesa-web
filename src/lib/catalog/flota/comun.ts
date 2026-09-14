import type { DelegacionId } from "@/content/es/empresa";
import type {
  Energia,
  Entorno,
  FamiliaId,
  Maquina,
  SpecKey,
  SpecValor,
  Traccion,
  TrabajoId,
} from "../types";
import { conf, est, na } from "../types";

/* ============================================================
   El andamio del catálogo.

   Todas las cifras de este directorio salen del CATÁLOGO GENERAL DE
   MAQUINARIA JOFEMESA que entregó el cliente, transcritas tabla por
   tabla. Es su material comercial vigente, así que entran como
   `conf(..., "catalogo-jofemesa")`.

   La tabla de cada subcategoría se escribe como una fila compacta y de
   ahí sale el objeto `Maquina`. El motivo no es ahorrar teclas: 142
   objetos escritos a mano son 142 oportunidades de colar una cifra en
   la columna de al lado, y esta forma se revisa contra el PDF de un
   vistazo.
   ============================================================ */

/**
 * Las diez delegaciones. Ninguna máquina está asignada a un parque
 * concreto porque el cliente no publica ese dato: el catálogo es común
 * y la disponibilidad de la fecha la confirma la delegación al
 * responder la solicitud. La interfaz lo dice con esas palabras.
 */
export const DELEGACIONES_TODAS: DelegacionId[] = [
  "madrid",
  "asturias",
  "valladolid",
  "valencia",
  "castellon",
  "alicante",
  "sevilla",
  "malaga",
  "oporto",
  "lisboa",
];

/** Quita acentos y deja un slug estable a partir de marca y modelo. */
export function slugDe(marca: string, modelo: string): string {
  return `${marca} ${modelo}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Cifra con coma decimal y punto de millar, para las descripciones.
 *
 * `useGrouping: "always"` es el mismo criterio que usa la interfaz en
 * `lib/utils/format`. Sin él, el español no agrupa los números de cuatro
 * cifras y la misma máquina salía con «1.170 mm» en la franja de specs
 * y «1170 mm» en la descripción de debajo. Dos formatos en la misma
 * tarjeta se leen como descuido.
 */
export function num(n: number, decimales = 0): string {
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: "always",
  });
}

/* ------------------------------------------------------------
   Fotografía y fichas técnicas reales
   ------------------------------------------------------------ */

/**
 * Las 27 fotos oficiales de JOFEMESA que entregó el cliente. Son sus
 * propias creatividades de producto —máquinas de su flota, con su
 * rotulación y su marca de agua—, así que no hay ningún problema de
 * derechos y no hace falta ninguna etiqueta de «foto de referencia».
 *
 * De cada creatividad salen dos derivados, generados una sola vez:
 *
 *   · `tarjeta/` — lienzo 4:3 de 1200×900 con la máquina centrada. Es
 *     lo que se ve en la tarjeta y en la ficha, y hace que las 27 se
 *     vean como una serie y no como 27 encuadres distintos.
 *   · `recorte/` — la máquina recortada a su caja real, en vertical.
 *     Es lo que se usa a sangre en el hero.
 *
 * La capa de fotografía provisional de Wikimedia Commons que había
 * antes está retirada por completo: varias de esas imágenes llevaban
 * rotulación visible de empresas de alquiler de la competencia
 * («renta», «Sunbelt», «Skyjack») y una de ellas era el hero de la
 * portada. Una máquina sin foto oficial sale con dibujo técnico.
 */
export const CON_FOTO = new Set([
  "genie-gs-1432m",
  "genie-gs-1932",
  "genie-gs-2032",
  "genie-gs-2632",
  "genie-gs-2646",
  "genie-gs-3246",
  "genie-gs-4047",
  "genie-gs-4655",
  "haulotte-compact-14",
  "haulotte-swift-up-4-5-sp",
  "jcb-s4550e",
  "jcb-s1930e",
  "jlg-2032es",
  "jlg-2632es",
  "jlg-4045r",
  "jlg-es4046",
  "snorkel-s4740e",
  "genie-gs-3369-rt",
  "genie-gs-3390",
  "genie-gs-4069-rt",
  "genie-gs-4390",
  "genie-gs-5390",
  "holland-lift-b-195-dl",
  "snorkel-s3370-rt",
  "snorkel-s3970-rt",
  "haulotte-hs15-e-pro",
  "haulotte-hs18-e-pro",
]);

/**
 * Las 34 fichas técnicas de fabricante que entregó el cliente, con su
 * tamaño real en bytes para que el enlace de descarga lo anuncie.
 * Si un modelo no está aquí, el botón de ficha NO se dibuja: nunca una
 * descarga rota.
 */
export const FICHAS: Record<string, number> = {
  "genie-gr-15": 846969,
  "genie-gr-26j": 1135269,
  "genie-gs-1432m": 817272,
  "genie-gs-1932": 873091,
  "genie-gs-2032": 806633,
  "genie-gs-2632": 876445,
  "genie-gs-2646": 870287,
  "genie-gs-3246": 985160,
  "genie-gs-3369-rt": 857538,
  "genie-gs-3390": 713898,
  "genie-gs-4047": 667110,
  "genie-gs-4069-rt": 857538,
  "genie-gs-4390": 713898,
  "genie-gs-4655": 932956,
  "genie-gs-5390": 713898,
  "haulotte-compact-14": 494026,
  "haulotte-hs15-e-pro": 2497665,
  "haulotte-hs18-e-pro": 2497665,
  "haulotte-star-10": 1645447,
  "haulotte-star-8-ae": 1109533,
  "haulotte-swift-up-4-5-sp": 822806,
  "holland-lift-b-195-dl": 4161249,
  "jcb-s1930e": 96393,
  "jcb-s4550e": 96393,
  "jlg-1230-es": 299477,
  "jlg-2032es": 157454,
  "jlg-2632es": 1476489,
  "jlg-4045r": 173687,
  "jlg-es4046": 2144294,
  "jlg-nano-sp-plus": 1099911,
  "jlg-toucan-12e": 824810,
  "snorkel-s3370-rt": 1611150,
  "snorkel-s3970-rt": 1611150,
  "snorkel-s4740e": 155309,
};

/* ------------------------------------------------------------
   Constructor
   ------------------------------------------------------------ */

export interface PerfilSubcategoria {
  familia: FamiliaId;
  subcategoriaSlug: string;
  energia: Energia;
  entornos: readonly Entorno[];
  traccion: Traccion;
  requiereFormacion: boolean;
  trabajos: readonly TrabajoId[];
  aplicaciones: readonly string[];
  /** Specs que no existen en este tipo de máquina. */
  noAplica?: readonly SpecKey[];
  /** Texto de 25-50 palabras a partir de los datos reales de la fila. */
  describe: (f: Fila) => string;
  destacados?: (f: Fila) => string[];
}

export interface Fila {
  marca: string;
  modelo: string;
  /** Altura de trabajo, en metros. */
  h?: number;
  /** Ancho del equipo, en mm. */
  ancho?: number;
  /** El ancho de la tabla es el del equipo en modo transporte. */
  anchoEsTransporte?: boolean;
  /** Altura con barandilla, en mm. */
  hb?: number;
  /** Peso, en kg. */
  peso?: number;
  /** Carga máxima, en kg. */
  carga?: number;
  /** Profundidad de excavación, en mm. */
  excavacion?: number;
  /** Altura total, en mm. */
  alturaTotal?: number;
  /** Pisada del rodillo o la bandeja, en mm. */
  pisada?: number;
  /** Capacidad de la tolva, en litros (rango como texto). */
  tolva?: string;
  /** Altura sin arco, en mm. */
  sinArco?: number;
  /** Etiqueta de tipo dentro de la subcategoría. */
  tipo?: string;
  /** Sobrescribe la tracción del perfil (una misma tabla mezcla ruedas y orugas). */
  traccion?: Traccion;
  /** Sobrescribe la alimentación del perfil. */
  energia?: Energia;
  /** Marca de destacada en la portada. */
  destacada?: boolean;
  /** Notas y especificaciones extra ya envueltas en `Dato`. */
  extra?: Partial<Record<SpecKey, SpecValor>>;
  /** Es una gama del catálogo, no una unidad concreta. */
  gama?: boolean;
  /** Texto de descripción propio, cuando la plantilla no sirve. */
  descripcion?: string;
}

const FUENTE = "catalogo-jofemesa" as const;

/**
 * Construye las máquinas de una subcategoría.
 *
 * `ordenBase` reserva un hueco de 1000 por subcategoría, así que el
 * orden del catálogo web es exactamente el del catálogo impreso.
 */
export function construir(
  perfil: PerfilSubcategoria,
  ordenBase: number,
  filas: Fila[],
): Maquina[] {
  return filas.map((f, i) => {
    const slug = slugDe(f.marca, f.modelo);
    const specs: Partial<Record<SpecKey, SpecValor>> = {};

    for (const k of perfil.noAplica ?? []) specs[k] = na();

    if (f.h != null) specs.alturaTrabajo = conf(f.h, FUENTE);
    if (f.carga != null) specs.capacidadCarga = conf(f.carga, FUENTE);
    if (f.excavacion != null)
      specs.profundidadExcavacion = conf(f.excavacion / 1000, FUENTE);
    if (f.ancho != null)
      specs.anchoTransporte = f.anchoEsTransporte
        ? est(
            f.ancho,
            FUENTE,
            "El catálogo marca esta anchura como la del equipo en modo transporte.",
          )
        : conf(f.ancho, FUENTE);
    if (f.hb != null) specs.alturaTransporte = conf(f.hb, FUENTE);
    if (f.alturaTotal != null) specs.alturaTransporte = conf(f.alturaTotal, FUENTE);
    if (f.pisada != null) specs.anchoTrabajo = conf(f.pisada / 1000, FUENTE);
    if (f.peso != null) specs.peso = conf(f.peso, FUENTE);
    if (f.tolva != null) specs.capacidadCazo = conf(`${f.tolva} l`, FUENTE);

    Object.assign(specs, f.extra ?? {});

    return {
      id: slug,
      slug,
      marca: f.marca,
      modelo: f.modelo,
      familia: perfil.familia,
      subcategoriaSlug: perfil.subcategoriaSlug,
      lineas: ["alquiler"],
      destacada: Boolean(f.destacada),
      orden: ordenBase + i * 10,
      gama: f.gama,
      facetas: {
        energia: f.energia ?? perfil.energia,
        entornos: [...perfil.entornos],
        traccion: f.traccion ?? perfil.traccion,
        requiereFormacion: perfil.requiereFormacion,
      },
      delegaciones: [...DELEGACIONES_TODAS],
      specs,
      descripcionCorta: f.descripcion ?? perfil.describe(f),
      aplicaciones: [...perfil.aplicaciones],
      destacados: perfil.destacados?.(f) ?? [],
      imagenes: CON_FOTO.has(slug)
        ? [
            {
              src: `/img/maquinas/oficial/tarjeta/${slug}.webp`,
              alt: `${f.marca} ${f.modelo} de la flota de JOFEMESA`,
              ancho: 1200,
              alto: 900,
              origen: "jofemesa.com" as const,
            },
          ]
        : [],
      fichaTecnica:
        FICHAS[slug] != null
          ? { src: `/fichas/${slug}.pdf`, bytes: FICHAS[slug] }
          : null,
      trabajos: [...perfil.trabajos],
    } satisfies Maquina;
  });
}
