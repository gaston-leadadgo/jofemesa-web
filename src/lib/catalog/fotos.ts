import registro from "../../../data/fotos-provisionales.json";
import type { Maquina, FamiliaId } from "./types";

/* ============================================================
   Fotografía PROVISIONAL de maqueta.

   No es la foto del modelo exacto: son imágenes de licencia libre
   de Wikimedia Commons, elegidas por subcategoría, que sirven para
   ver la web con volumen real de imagen mientras llega la
   autorización de los fabricantes.

   Se marcan como provisionales en la interfaz a propósito. Este
   proyecto no presenta como cierto nada que no lo sea, y una foto
   de otra unidad de la misma familia es exactamente eso.

   Cuando llegue la foto buena, se rellena `imagenes` en la máquina
   y esta capa deja de intervenir sola: `imagenes` tiene prioridad.
   ============================================================ */

export interface FotoProvisional {
  subcategoria: string;
  fichero: string;
  ancho: number;
  alto: number;
  commons: string;
  autor: string;
  licencia: string;
  origen: string | null;
}

const TODAS = registro as FotoProvisional[];

const POR_SUBCATEGORIA = new Map<string, FotoProvisional[]>();
for (const f of TODAS) {
  const lista = POR_SUBCATEGORIA.get(f.subcategoria) ?? [];
  lista.push(f);
  POR_SUBCATEGORIA.set(f.subcategoria, lista);
}

/** Familia → subcategorías con foto, para cuando la subcategoría
 *  concreta de la máquina se quedó sin candidata en Commons. */
const RESPALDO_FAMILIA: Record<FamiliaId, string[]> = {
  elevacion: [
    "tijeras-electricas",
    "tijeras-diesel",
    "brazos-diesel",
    "brazos-telescopicos",
    "brazos-articulados-electricos",
    "mastiles-verticales",
  ],
  manipulacion: [
    "manipuladores-telescopicos-rigidos",
    "carretillas-electricas",
    "carretillas-todoterreno",
  ],
  "movimiento-tierras": ["miniexcavadoras", "minicargadoras", "retrocargadoras"],
  compactacion: ["rodillos", "pisones", "bandejas-vibrantes"],
  energia: ["grupos-electrogenos", "torres-iluminacion"],
  "aire-martillos": ["compresores-portatiles", "martillos-neumaticos"],
  "herramienta-auxiliar": ["bombas-agua", "cortadoras"],
};

/** Hash estable del slug: la misma máquina recibe siempre la misma foto,
 *  y dentro de una subcategoría el reparto queda distribuido en vez de
 *  darle la primera imagen a las veintiuna tijeras. */
function indiceDe(slug: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h) % modulo;
}

/** Foto provisional de una máquina, o null si no hay ninguna aplicable. */
export function fotoProvisional(m: Maquina): FotoProvisional | null {
  const propias = POR_SUBCATEGORIA.get(m.subcategoriaSlug);
  if (propias?.length) return propias[indiceDe(m.slug, propias.length)];

  // Sin foto de su subcategoría: se recurre a otra de la misma familia.
  const candidatas = (RESPALDO_FAMILIA[m.familia] ?? []).flatMap(
    (s) => POR_SUBCATEGORIA.get(s) ?? [],
  );
  if (!candidatas.length) return null;
  return candidatas[indiceDe(m.slug, candidatas.length)];
}

/** Foto de portada de una subcategoría, para las páginas de familia. */
export function fotoSubcategoria(slug: string): FotoProvisional | null {
  return POR_SUBCATEGORIA.get(slug)?.[0] ?? null;
}

/** Foto de portada de una familia, para el bento de la portada. */
export function fotoFamilia(id: FamiliaId): FotoProvisional | null {
  for (const sub of RESPALDO_FAMILIA[id] ?? []) {
    const f = POR_SUBCATEGORIA.get(sub)?.[0];
    if (f) return f;
  }
  return null;
}

/** Todas, para la página de créditos de imagen. */
export const FOTOS_PROVISIONALES = TODAS;
