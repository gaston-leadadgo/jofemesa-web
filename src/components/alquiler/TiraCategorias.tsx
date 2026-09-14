"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FAMILIAS } from "@/lib/catalog/familias";
import { ALQUILER } from "@/lib/catalog";
import { IconoMaquina } from "@/components/marca/IconoMaquina";

/**
 * Las tiras de categoría de encima del catálogo.
 *
 * Es la UX de la versión de Emilio, que es la que se aprobó en la
 * reunión —«UX de Emilio para alquiler»—, con la corrección que se
 * pidió allí mismo sobre el móvil:
 *
 *   «el mobile, al ser un scroll así horizontal, no se ven todas las
 *   categorías… lo que hay que hacer es poder poner una flecha para que
 *   se puedan ver todas las categorías».
 *
 * Así que la tira se arrastra Y tiene flechas. Y las flechas no están
 * siempre: aparecen solo cuando hay algo fuera de vista por ese lado,
 * porque una flecha que no hace nada enseña al usuario a no mirarlas.
 * Además hay un degradado en el borde donde queda contenido, que es la
 * señal que se entiende sin leer nada.
 *
 * Cada familia es un enlace a su propia URL —`/alquiler/elevacion`— y no
 * un filtro en la misma página. Eso también viene de la reunión: «esto
 * tiene que ser una URL diferente… para poder hacer una campaña de cada
 * categoría». Las subcategorías sí son filtro (`?sub=`), porque «en
 * principio no se va a hacer una campaña de una subcategoría».
 */

function useDesbordamiento() {
  const ref = useRef<HTMLDivElement>(null);
  const [izquierda, setIzquierda] = useState(false);
  const [derecha, setDerecha] = useState(false);

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const margen = 4;
    setIzquierda(el.scrollLeft > margen);
    setDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - margen);
  }, []);

  useEffect(() => {
    medir();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [medir]);

  const mover = (sentido: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.7 * sentido, behavior: "smooth" });
  };

  return { ref, izquierda, derecha, mover };
}

function Tira({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  const { ref, izquierda, derecha, mover } = useDesbordamiento();

  return (
    <div className="relative">
      <div
        ref={ref}
        className="pista-horizontal flex gap-2 overflow-x-auto scroll-smooth pb-1"
        role="group"
        aria-label={etiqueta}
      >
        {children}
      </div>

      {/* Degradados de borde: la señal de «hay más» que no hay que leer. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-surface to-transparent transition-opacity duration-200",
          izquierda ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent transition-opacity duration-200",
          derecha ? "opacity-100" : "opacity-0",
        )}
      />

      {izquierda && (
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label={`Ver ${etiqueta.toLowerCase()} anteriores`}
          className="absolute top-1/2 -left-1 flex size-11 -translate-y-1/2 items-center justify-center border border-rule-control bg-surface text-ink shadow-[0_1px_6px_rgba(20,23,26,.14)] transition-colors duration-200 hover:bg-sunken"
        >
          <ChevronLeft size={17} strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
      {derecha && (
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label={`Ver más ${etiqueta.toLowerCase()}`}
          className="absolute top-1/2 -right-1 flex size-11 -translate-y-1/2 items-center justify-center border border-rule-control bg-surface text-ink shadow-[0_1px_6px_rgba(20,23,26,.14)] transition-colors duration-200 hover:bg-sunken"
        >
          <ChevronRight size={17} strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function TiraCategorias({
  familiaActiva,
  subActiva,
  onSub,
}: {
  familiaActiva?: string | null;
  subActiva?: string | null;
  onSub: (slug: string | null) => void;
}) {
  const familia = FAMILIAS.find((f) => f.id === familiaActiva);

  return (
    <div className="space-y-3">
      <Tira etiqueta="Familias de maquinaria">
        <Link
          href="/alquiler"
          aria-current={!familiaActiva ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 text-base whitespace-nowrap transition-colors duration-200",
            !familiaActiva
              ? "border-ink bg-ink text-white"
              : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
          )}
        >
          Todas
          <span className="value text-sm opacity-70">{ALQUILER.length}</span>
        </Link>

        {FAMILIAS.map((f) => {
          const n = ALQUILER.filter((m) => m.familia === f.id).length;
          const activa = familiaActiva === f.id;
          return (
            <Link
              key={f.id}
              href={`/alquiler/${f.slug}`}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 text-base whitespace-nowrap transition-colors duration-200",
                activa
                  ? "border-ink bg-ink text-white"
                  : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
              )}
            >
              <IconoMaquina
                icono={f.icono}
                className={cn(
                  "h-6 w-8 shrink-0",
                  activa ? "text-white" : "text-accent",
                )}
              />
              {f.nombre}
              <span className="value text-sm opacity-70">{n}</span>
            </Link>
          );
        })}
      </Tira>

      {familia && (
        <Tira etiqueta="Subcategorías">
          <button
            type="button"
            onClick={() => onSub(null)}
            aria-pressed={!subActiva}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2 border px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
              !subActiva
                ? "border-rule-control bg-sunken text-ink"
                : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
            )}
          >
            Todas
          </button>
          {familia.subcategorias.map((s) => {
            const n = ALQUILER.filter(
              (m) => m.subcategoriaSlug === s.slug,
            ).length;
            const activa = subActiva === s.slug;
            return (
              <button
                key={s.slug}
                type="button"
                disabled={n === 0}
                onClick={() => onSub(s.slug)}
                aria-pressed={activa}
                className={cn(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 border px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
                  activa
                    ? "border-accent bg-accent-tint text-ink"
                    : "border-rule bg-surface text-ink-2 hover:border-rule-control hover:text-ink",
                  n === 0 && "cursor-not-allowed opacity-40",
                )}
              >
                {s.nombre}
                <span className="value text-xs opacity-70">{n}</span>
              </button>
            );
          })}
        </Tira>
      )}
    </div>
  );
}
