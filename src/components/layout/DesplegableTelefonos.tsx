"use client";

import { useId } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CENTROS,
  DELEGACIONES,
  TELEFONO_PRINCIPAL,
} from "@/content/es/empresa";
import { useDesplegable } from "./useDesplegable";

/**
 * El teléfono de la cabecera, con todos los números.
 *
 * Antes solo había el de la central, y quien está en una obra de Sevilla
 * quiere hablar con Sevilla. Cada fila es UN enlace `tel:` entero, con
 * 44px de alto: en móvil se pulsa con el pulgar.
 *
 * El panel se ancla a la cabecera en móvil (de filo a filo con 16px de
 * aire) y al botón a partir de tableta. Anclado al botón en un móvil, el
 * panel de 20rem se salía por la izquierda de la pantalla.
 */
export function DesplegableTelefonos({ alAbrir }: { alAbrir?: () => void }) {
  const { abierto, setAbierto, bloque, boton, alPerderFoco } = useDesplegable();
  const idPanel = useId();

  const alternar = () => {
    if (!abierto) alAbrir?.();
    setAbierto(!abierto);
  };

  return (
    <div ref={bloque} className="md:relative" onBlur={alPerderFoco}>
      <button
        ref={boton}
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        aria-controls={idPanel}
        aria-label={`Teléfonos de las delegaciones. Central: ${TELEFONO_PRINCIPAL.visible}`}
        className={cn(
          "flex h-11 items-center justify-center gap-2 text-ink transition-colors duration-200",
          "w-11 border border-rule-control hover:bg-sunken",
          "xl:w-auto xl:border-0 xl:px-0 xl:hover:bg-transparent xl:hover:text-accent",
          abierto && "text-accent",
        )}
      >
        <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
        <span className="value hidden xl:inline">{TELEFONO_PRINCIPAL.visible}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.25}
          aria-hidden="true"
          className={cn(
            "hidden transition-transform duration-200 xl:block",
            abierto && "rotate-180",
          )}
        />
      </button>

      {abierto && (
        <div
          id={idPanel}
          className="absolute top-full right-4 left-4 z-50 mt-2 overflow-hidden rounded-2xl border border-rule bg-surface shadow-panel motion-safe:animate-[panel-entra_.18s_var(--ease-entrance)] md:left-auto md:right-0 md:w-80"
        >
          <p className="border-b border-rule px-4 py-3 text-sm font-semibold text-ink">
            ¿A qué delegación llamas?
          </p>
          <div className="max-h-[min(78vh,42rem)] overflow-y-auto py-1.5">
            <ul>
              {DELEGACIONES.filter((d) => d.tel).map((d) => (
                <li key={d.id}>
                  <Fila
                    tel={d.tel!}
                    visible={d.telefono!}
                    nombre={d.nombre}
                    detalle={d.pais === "Portugal" ? "Portugal" : undefined}
                    central={d.central}
                    cerrar={() => setAbierto(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="meta mt-1.5 border-t border-rule px-4 pt-3 pb-1 text-ink-3">
              Otros centros
            </p>
            <ul>
              {CENTROS.map((c) => (
                <li key={c.id}>
                  <Fila
                    tel={c.tel}
                    visible={c.telefono}
                    nombre={c.nombre}
                    cerrar={() => setAbierto(false)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Fila({
  tel,
  visible,
  nombre,
  detalle,
  central,
  cerrar,
}: {
  tel: string;
  visible: string;
  nombre: string;
  detalle?: string;
  central?: boolean;
  cerrar: () => void;
}) {
  return (
    <a
      href={`tel:${tel}`}
      onClick={cerrar}
      className="group flex min-h-11 items-center justify-between gap-4 px-4 py-2 transition-colors duration-200 hover:bg-sunken"
    >
      <span className="min-w-0 truncate text-sm text-ink">
        <span className="font-semibold group-hover:text-accent">{nombre}</span>
        {central && (
          <span className="ml-2 rounded-full bg-accent-tint px-1.5 py-0.5 text-[0.6875rem] font-semibold text-accent">
            Central
          </span>
        )}
        {detalle && <span className="ml-1.5 text-xs text-ink-3">{detalle}</span>}
      </span>
      <span className="value shrink-0 text-sm whitespace-nowrap text-ink-2 group-hover:text-accent">
        {visible}
      </span>
    </a>
  );
}
