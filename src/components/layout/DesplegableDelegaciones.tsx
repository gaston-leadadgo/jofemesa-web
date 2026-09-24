"use client";

import { useId } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  DELEGACIONES,
  DELEGACIONES_ESPANA,
  DELEGACIONES_PORTUGAL,
  type Delegacion,
} from "@/content/es/empresa";
import { useDesplegable } from "./useDesplegable";

/**
 * «Delegaciones» en la franja superior: un vistazo de las diez sin salir
 * de la página. Cada nombre lleva a su ficha en /delegaciones y cada
 * teléfono llama directo; son dos enlaces separados y no una fila entera
 * clicable, porque un enlace dentro de otro no se puede pulsar bien.
 */
export function DesplegableDelegaciones() {
  const { abierto, setAbierto, bloque, boton, alPerderFoco } = useDesplegable();
  const idPanel = useId();

  return (
    <div ref={bloque} className="relative h-full" onBlur={alPerderFoco}>
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls={idPanel}
        className={cn(
          "label-sm flex h-full items-center gap-1.5 transition-colors duration-200 hover:text-accent-dark",
          abierto ? "text-ink-inv" : "text-ink-inv-2",
        )}
      >
        <MapPin size={14} strokeWidth={2} aria-hidden="true" className="text-accent-dark" />
        Delegaciones
        <ChevronDown
          size={13}
          strokeWidth={2.25}
          aria-hidden="true"
          className={cn("transition-transform duration-200", abierto && "rotate-180")}
        />
      </button>

      {abierto && (
        <div
          id={idPanel}
          className="absolute top-full right-0 z-50 mt-1.5 w-[min(34rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-rule bg-surface text-ink shadow-panel motion-safe:animate-[panel-entra_.18s_var(--ease-entrance)]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
            <p className="text-sm font-semibold text-ink">
              {DELEGACIONES.length} delegaciones propias
            </p>
            <Link
              href="/delegaciones"
              onClick={() => setAbierto(false)}
              className="inline-flex min-h-8 items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Ver mapa y direcciones
              <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>

          <div className="max-h-[min(78vh,40rem)] overflow-y-auto px-5 py-4">
            <Grupo titulo="España" delegaciones={DELEGACIONES_ESPANA} cerrar={() => setAbierto(false)} />
            <Grupo
              titulo="Portugal"
              delegaciones={DELEGACIONES_PORTUGAL}
              cerrar={() => setAbierto(false)}
              className="mt-4 border-t border-rule pt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Grupo({
  titulo,
  delegaciones,
  cerrar,
  className,
}: {
  titulo: string;
  delegaciones: readonly Delegacion[];
  cerrar: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="meta text-ink-3">{titulo}</p>
      <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
        {delegaciones.map((d) => (
          <li key={d.id} className="flex items-start gap-2.5 py-1">
            <MapPin size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0">
              <Link
                href={`/delegaciones#${d.id}`}
                onClick={cerrar}
                className="text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent"
              >
                {d.nombre}
                {d.central && (
                  <span className="ml-2 rounded-full bg-accent-tint px-1.5 py-0.5 text-[0.6875rem] font-semibold text-accent">
                    Central
                  </span>
                )}
              </Link>
              {d.localidad && d.localidad !== d.nombre && (
                <p className="truncate text-xs text-ink-3">{d.localidad}</p>
              )}
              {d.tel && (
                <a
                  href={`tel:${d.tel}`}
                  className="value mt-0.5 flex min-h-6 w-fit items-center gap-1.5 text-xs text-ink-2 transition-colors duration-200 hover:text-accent"
                >
                  <Phone size={12} strokeWidth={2} aria-hidden="true" />
                  {d.telefono}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
