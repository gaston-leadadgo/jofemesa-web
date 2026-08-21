import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import type { OrdenId } from "@/lib/catalog";

/**
 * Los filtros viven en la URL, con nombres cortos y en español: acaban
 * pegados en un WhatsApp entre el jefe de obra y la oficina.
 *
 *   /alquiler?fam=elevacion&hmin=10&hmax=16&energia=electrico&del=madrid
 *
 * `shallow: true` → el filtrado es instantáneo en memoria, sin ida y vuelta
 * al servidor. `history: "replace"` → marcar una casilla no genera treinta
 * entradas de historial, pero la URL actual sí las lleva, así que volver
 * atrás desde una ficha restaura la vista filtrada exacta.
 */
export const PARSERS_FILTROS = {
  fam: parseAsString,
  sub: parseAsString,
  energia: parseAsArrayOf(parseAsString, ",").withDefault([]),
  uso: parseAsArrayOf(parseAsString, ",").withDefault([]),
  del: parseAsArrayOf(parseAsString, ",").withDefault([]),
  hmin: parseAsFloat,
  hmax: parseAsFloat,
  carga: parseAsFloat,
  q: parseAsString,
  orden: parseAsStringLiteral([
    "relevancia",
    "altura-asc",
    "altura-desc",
    "carga-desc",
  ] as const satisfies readonly OrdenId[]).withDefault("relevancia"),
};

export const OPCIONES_FILTROS = {
  history: "replace" as const,
  shallow: true,
  clearOnDefault: true,
  throttleMs: 120,
};

export const ETIQUETAS_ORDEN: Record<OrdenId, string> = {
  relevancia: "Más solicitadas",
  "altura-asc": "Altura, de menor a mayor",
  "altura-desc": "Altura, de mayor a menor",
  "carga-desc": "Capacidad de carga",
};

export const ETIQUETAS_ENERGIA: Record<string, string> = {
  electrico: "Eléctrica",
  diesel: "Diésel",
  hibrido: "Híbrida",
  gasolina: "Gasolina",
};

export const ETIQUETAS_USO: Record<string, string> = {
  interior: "Interior",
  exterior: "Exterior",
};

/** Tramos de altura, los mismos que usa el asesor. */
export const TRAMOS_ALTURA = [
  { label: "Hasta 6 m", min: null, max: 6 },
  { label: "6 – 10 m", min: 6, max: 10 },
  { label: "10 – 16 m", min: 10, max: 16 },
  { label: "16 – 28 m", min: 16, max: 28 },
  { label: "Más de 28 m", min: 28, max: null },
] as const;
