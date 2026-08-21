"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const CLAVE = "jofemesa.comparador.v1";
export const MAX_COMPARAR = 4;

/* ============================================================
   La bandeja del comparador es estado del NAVEGADOR, no de React.
   Por eso vive en un store externo y se lee con useSyncExternalStore,
   que es la herramienta que React da justo para esto: `localStorage`
   se lee sin efectos, sin bandera de hidratación y sin llamar a
   setState dentro de un efecto.

   El snapshot de servidor es siempre una lista vacía, así que el
   primer render de cliente coincide con el HTML servido y React
   vuelve a renderizar con los datos reales en cuanto hidrata.
   ============================================================ */

const VACIO: string[] = [];

/** Caché del snapshot: useSyncExternalStore exige identidad estable. */
let cache: string[] = VACIO;
let cacheCruda: string | null = null;
const oyentes = new Set<() => void>();

function leerCrudo(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null; // modo privado, cuota, iframe sin permisos
  }
}

function snapshot(): string[] {
  const crudo = leerCrudo();
  if (crudo === cacheCruda) return cache;
  cacheCruda = crudo;
  try {
    const leidos = crudo ? JSON.parse(crudo) : [];
    cache = Array.isArray(leidos)
      ? leidos.filter((s): s is string => typeof s === "string")
      : VACIO;
  } catch {
    cache = VACIO;
  }
  return cache;
}

function snapshotServidor(): string[] {
  return VACIO;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // Otra pestaña puede cambiar la bandeja: nos enteramos.
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

function escribir(slugs: string[]) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(slugs));
  } catch {
    // Si no se puede persistir, al menos que la sesión funcione.
    cacheCruda = JSON.stringify(slugs);
    cache = slugs;
  }
  oyentes.forEach((o) => o());
}

/* ============================================================
   Contexto
   ============================================================ */

interface Valor {
  slugs: string[];
  alternar: (slug: string) => void;
  quitar: (slug: string) => void;
  limpiar: () => void;
  contiene: (slug: string) => boolean;
  lleno: boolean;
}

const Ctx = createContext<Valor | null>(null);

export function CompararProvider({
  children,
  slugsValidos,
}: {
  children: React.ReactNode;
  slugsValidos: string[];
}) {
  const guardados = useSyncExternalStore(
    suscribir,
    snapshot,
    snapshotServidor,
  );
  const validos = useMemo(() => new Set(slugsValidos), [slugsValidos]);

  // Se descartan los slugs que ya no existen en el catálogo.
  const slugs = useMemo(
    () => guardados.filter((s) => validos.has(s)).slice(0, MAX_COMPARAR),
    [guardados, validos],
  );

  const alternar = useCallback(
    (slug: string) => {
      const actual = snapshot().filter((s) => validos.has(s));
      if (actual.includes(slug)) {
        escribir(actual.filter((s) => s !== slug));
      } else if (actual.length < MAX_COMPARAR) {
        escribir([...actual, slug]);
      }
    },
    [validos],
  );

  const quitar = useCallback(
    (slug: string) => escribir(snapshot().filter((s) => s !== slug)),
    [],
  );

  const limpiar = useCallback(() => escribir([]), []);

  const valor = useMemo<Valor>(
    () => ({
      slugs,
      alternar,
      quitar,
      limpiar,
      contiene: (slug) => slugs.includes(slug),
      lleno: slugs.length >= MAX_COMPARAR,
    }),
    [slugs, alternar, quitar, limpiar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useComparar(): Valor {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useComparar tiene que usarse dentro de CompararProvider");
  return v;
}
