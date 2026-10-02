import { useSyncExternalStore } from "react";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import type { CursoConvocatoriaId } from "@/content/es/formacion";

const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const sinSuscripcion = () => () => {};

/**
 * La fecha de hoy del navegador. En el servidor es `null`: las páginas
 * están prerenderizadas y no saben qué día las abre nadie.
 */
export function useHoy(): string | null {
  return useSyncExternalStore(sinSuscripcion, hoyIso, () => null);
}

export const proximasDe = (curso: CursoConvocatoriaId, hoy: string | null) =>
  CONVOCATORIAS.filter((c) => c.curso === curso && (!hoy || c.fecha >= hoy));

/*
 * El curso elegido en el calendario vive fuera de React para que lo
 * puedan fijar las tarjetas del catálogo y la ficha del curso (que se
 * abre en otro segmento de ruta) antes de saltar a #calendario.
 */
let cursoElegido: CursoConvocatoriaId | null = null;
const oyentes = new Set<() => void>();

export function elegirCursoCalendario(curso: CursoConvocatoriaId | null) {
  cursoElegido = curso;
  oyentes.forEach((f) => f());
}

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => oyentes.delete(f);
};

export function useCursoCalendario(): CursoConvocatoriaId | null {
  return useSyncExternalStore(suscribir, () => cursoElegido, () => null);
}
