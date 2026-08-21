import type { DelegacionId } from "@/content/es/empresa";
import { MAQUINAS_CATALOGO } from "./maquinas-catalogo";
import { MAQUINAS_TIJERAS } from "./maquinas-tijeras";
import { MAQUINAS_VERIFICADAS } from "./maquinas-verificadas";
import { FAMILIAS, FAMILIA_POR_ID, SUBCATEGORIA_POR_SLUG } from "./familias";
import {
  numeroDe,
  SPEC_DEFS,
  type Energia,
  type Entorno,
  type FamiliaId,
  type Maquina,
  type SpecKey,
  type TrabajoId,
} from "./types";

export * from "./types";
export { FAMILIAS, FAMILIA_POR_ID, SUBCATEGORIA_POR_SLUG } from "./familias";

/** El catálogo completo, ordenado. Fuente única para filtros, asesor,
 *  comparador y fichas: si algo no está aquí, no existe en la web. */
const TODAS = [
  ...MAQUINAS_TIJERAS,
  ...MAQUINAS_VERIFICADAS,
  ...MAQUINAS_CATALOGO,
];

/** Si dos ficheros describen el mismo modelo, gana el que tiene la ficha
 *  técnica real transcrita: MAQUINAS_TIJERAS va primero a propósito. */
export const CATALOGO: readonly Maquina[] = TODAS.filter(
  (m, i) => TODAS.findIndex((o) => o.slug === m.slug) === i,
).sort((a, b) => a.orden - b.orden);

export const ALQUILER = CATALOGO.filter((m) => m.lineas.includes("alquiler"));
export const VENTA = CATALOGO.filter((m) => m.lineas.includes("venta"));

const POR_SLUG = new Map(CATALOGO.map((m) => [m.slug, m]));
export const getMaquina = (slug: string) => POR_SLUG.get(slug);

export const getMaquinas = (slugs: string[]) =>
  slugs.map((s) => POR_SLUG.get(s)).filter((m): m is Maquina => Boolean(m));

/* ============================================================
   Filtros
   ============================================================ */

export interface Filtros {
  familia?: FamiliaId | null;
  subcategoria?: string | null;
  energia: Energia[];
  entorno: Entorno[];
  delegacion: DelegacionId[];
  /** Altura de trabajo en metros. */
  alturaMin?: number | null;
  alturaMax?: number | null;
  /** Capacidad de carga en kg. */
  cargaMin?: number | null;
  texto?: string | null;
  orden: OrdenId;
}

export type OrdenId =
  | "relevancia"
  | "altura-asc"
  | "altura-desc"
  | "carga-desc";

export const FILTROS_VACIOS: Filtros = {
  familia: null,
  subcategoria: null,
  energia: [],
  entorno: [],
  delegacion: [],
  alturaMin: null,
  alturaMax: null,
  cargaMin: null,
  texto: null,
  orden: "relevancia",
};

const normaliza = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Una máquina sin altura confirmada queda EXCLUIDA de un filtro de altura,
 * no se cuela con un 0. Es la diferencia entre "no lo sabemos" y "mide cero".
 */
export function filtrar(
  maquinas: readonly Maquina[],
  f: Filtros,
): Maquina[] {
  const texto = f.texto ? normaliza(f.texto) : null;

  const res = maquinas.filter((m) => {
    if (f.familia && m.familia !== f.familia) return false;
    if (f.subcategoria && m.subcategoriaSlug !== f.subcategoria) return false;
    if (f.energia.length && !f.energia.includes(m.facetas.energia)) return false;
    if (
      f.entorno.length &&
      !f.entorno.some((e) => m.facetas.entornos.includes(e))
    )
      return false;
    if (
      f.delegacion.length &&
      !f.delegacion.some((d) => m.delegaciones.includes(d))
    )
      return false;

    if (f.alturaMin != null || f.alturaMax != null) {
      const h = numeroDe(m.specs.alturaTrabajo);
      if (h == null) return false;
      if (f.alturaMin != null && h < f.alturaMin) return false;
      if (f.alturaMax != null && h > f.alturaMax) return false;
    }

    if (f.cargaMin != null) {
      const c = numeroDe(m.specs.capacidadCarga);
      if (c == null || c < f.cargaMin) return false;
    }

    if (texto) {
      const heno = normaliza(
        [
          m.marca,
          m.modelo,
          m.descripcionCorta,
          SUBCATEGORIA_POR_SLUG[m.subcategoriaSlug]?.nombre ?? "",
          FAMILIA_POR_ID[m.familia]?.nombre ?? "",
          ...m.aplicaciones,
        ].join(" "),
      );
      if (!texto.split(/\s+/).every((t) => heno.includes(t))) return false;
    }

    return true;
  });

  return ordenar(res, f.orden);
}

export function ordenar(maquinas: Maquina[], orden: OrdenId): Maquina[] {
  const copia = [...maquinas];
  const asc = (k: SpecKey) => (a: Maquina, b: Maquina) =>
    (numeroDe(a.specs[k]) ?? Infinity) - (numeroDe(b.specs[k]) ?? Infinity);
  const desc = (k: SpecKey) => (a: Maquina, b: Maquina) =>
    (numeroDe(b.specs[k]) ?? -Infinity) - (numeroDe(a.specs[k]) ?? -Infinity);

  switch (orden) {
    case "altura-asc":
      return copia.sort(asc("alturaTrabajo"));
    case "altura-desc":
      return copia.sort(desc("alturaTrabajo"));
    case "carga-desc":
      return copia.sort(desc("capacidadCarga"));
    default:
      // Relevancia: primero las destacadas, después por orden de catálogo.
      return copia.sort(
        (a, b) =>
          Number(b.destacada) - Number(a.destacada) || a.orden - b.orden,
      );
  }
}

/**
 * Cuenta cuántas máquinas quedarían si se añadiera cada valor de faceta,
 * manteniendo el resto del filtro. Sirve para poner el número junto a cada
 * opción y para deshabilitar (no ocultar) las que darían cero.
 */
export function contarFacetas(maquinas: readonly Maquina[], f: Filtros) {
  const cuenta = <T extends string>(
    valores: readonly T[],
    parcial: (v: T) => Partial<Filtros>,
  ) =>
    Object.fromEntries(
      valores.map((v) => [v, filtrar(maquinas, { ...f, ...parcial(v) }).length]),
    ) as Record<T, number>;

  return {
    familia: cuenta(
      FAMILIAS.map((x) => x.id),
      (familia) => ({ familia, subcategoria: null }),
    ),
    energia: cuenta(
      ["electrico", "diesel", "hibrido", "gasolina"] as const,
      (e) => ({ energia: [e] }),
    ),
    entorno: cuenta(["interior", "exterior"] as const, (e) => ({
      entorno: [e],
    })),
  };
}

/** Las dos facetas activas que más resultados están excluyendo. */
export function filtrosQueMasExcluyen(
  maquinas: readonly Maquina[],
  f: Filtros,
): { etiqueta: string; quitar: Partial<Filtros>; resultados: number }[] {
  const candidatos: { etiqueta: string; quitar: Partial<Filtros> }[] = [];

  if (f.alturaMin != null || f.alturaMax != null)
    candidatos.push({
      etiqueta: "el filtro de altura",
      quitar: { alturaMin: null, alturaMax: null },
    });
  if (f.cargaMin != null)
    candidatos.push({
      etiqueta: "el filtro de carga",
      quitar: { cargaMin: null },
    });
  if (f.energia.length)
    candidatos.push({ etiqueta: "el filtro de alimentación", quitar: { energia: [] } });
  if (f.entorno.length)
    candidatos.push({ etiqueta: "el filtro de uso", quitar: { entorno: [] } });
  if (f.delegacion.length)
    candidatos.push({ etiqueta: "el filtro de delegación", quitar: { delegacion: [] } });
  if (f.subcategoria)
    candidatos.push({ etiqueta: "la subcategoría", quitar: { subcategoria: null } });
  if (f.texto)
    candidatos.push({ etiqueta: "la búsqueda por texto", quitar: { texto: null } });

  const solos = candidatos
    .map((c) => ({
      ...c,
      resultados: filtrar(maquinas, { ...f, ...c.quitar }).length,
    }))
    .filter((c) => c.resultados > 0)
    .sort((a, b) => b.resultados - a.resultados);

  if (solos.length > 0) return solos.slice(0, 2);

  /* Hay combinaciones en las que quitar un filtro no basta: por ejemplo
   * compactación + eléctrica + más de 40 m. Antes se devolvía una lista
   * vacía y el usuario se quedaba sin salida, que es justo lo que este
   * estado vacío tenía que evitar. Se prueban pares. */
  const pares: ReturnType<typeof filtrosQueMasExcluyen> = [];
  for (let i = 0; i < candidatos.length; i++) {
    for (let j = i + 1; j < candidatos.length; j++) {
      const quitar = { ...candidatos[i].quitar, ...candidatos[j].quitar };
      const resultados = filtrar(maquinas, { ...f, ...quitar }).length;
      if (resultados > 0) {
        pares.push({
          etiqueta: `${candidatos[i].etiqueta} y ${candidatos[j].etiqueta}`,
          quitar,
          resultados,
        });
      }
    }
  }

  return pares.sort((a, b) => b.resultados - a.resultados).slice(0, 2);
}

/* ============================================================
   Specs de la tarjeta
   ============================================================ */

/** Las tres specs que salen en la franja de la tarjeta, por familia. */
export function specsDestacadas(m: Maquina): SpecKey[] {
  const preferidas = SPEC_DEFS.filter(
    (d) => d.destacadaEn?.includes(m.familia) && m.specs[d.key],
  ).map((d) => d.key);

  if (preferidas.length >= 3) return preferidas.slice(0, 3);

  const relleno = SPEC_DEFS.filter(
    (d) => !preferidas.includes(d.key) && m.specs[d.key],
  ).map((d) => d.key);

  return [...preferidas, ...relleno].slice(0, 3);
}

/** Specs de la ficha, agrupadas y ordenadas por el registro. */
export function specsAgrupadas(m: Maquina) {
  const grupos = new Map<string, { def: (typeof SPEC_DEFS)[number]; dato: NonNullable<Maquina["specs"][SpecKey]> }[]>();
  for (const def of SPEC_DEFS) {
    const dato = m.specs[def.key];
    if (!dato) continue;
    const lista = grupos.get(def.grupo) ?? [];
    lista.push({ def, dato });
    grupos.set(def.grupo, lista);
  }
  return grupos;
}

/* ============================================================
   Relacionadas
   ============================================================ */

export function relacionadas(m: Maquina, limite = 3): Maquina[] {
  const h = numeroDe(m.specs.alturaTrabajo);
  return ALQUILER.filter((o) => o.slug !== m.slug)
    .map((o) => {
      let p = 0;
      if (o.subcategoriaSlug === m.subcategoriaSlug) p += 50;
      else if (o.familia === m.familia) p += 25;
      if (o.facetas.energia === m.facetas.energia) p += 10;
      const ho = numeroDe(o.specs.alturaTrabajo);
      if (h != null && ho != null) p += Math.max(0, 20 - Math.abs(h - ho) * 2);
      return { o, p };
    })
    .sort((a, b) => b.p - a.p)
    .slice(0, limite)
    .map((x) => x.o);
}

export const TRABAJOS: { id: TrabajoId; label: string; desc: string }[] = [
  {
    id: "altura",
    label: "Trabajos en altura e instalaciones",
    desc: "Pintura, electricidad, climatización, cubiertas, fachadas o poda.",
  },
  {
    id: "cargas",
    label: "Mover y elevar cargas o palets",
    desc: "Descarga de camiones, estanterías de almacén, acopio en forjados.",
  },
  {
    id: "tierra",
    label: "Excavar, abrir zanjas o mover escombros",
    desc: "Canalizaciones, cimentaciones, urbanización y reformas.",
  },
  {
    id: "energia",
    label: "Suministro eléctrico o aire comprimido",
    desc: "Grupos electrógenos e iluminación para obras sin red.",
  },
];
