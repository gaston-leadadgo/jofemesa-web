"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Maximize2, Minimize2, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * La carcasa del modal, sobre el elemento nativo <dialog>.
 *
 * `showModal()` nos da gratis y bien hechas cuatro cosas que a mano
 * salen mal: la trampa de foco, el cierre con Escape, el fondo inerte y
 * la capa superior real, por encima de cualquier z-index.
 *
 * El cierre es `router.back()`, no un cambio de estado: así la ✕, el
 * Escape y el botón atrás del navegador hacen exactamente lo mismo.
 *
 * LO QUE ESTABA ROTO Y AHORA NO: el panel tenía `max-h-[88vh]` con el
 * cuerpo en `flex-1` pero sin `overflow` propio, así que la tabla de
 * especificaciones —que es larga— se salía por debajo del panel y no
 * había manera de llegar a ella. La cadena de scroll necesita las tres
 * piezas: alto tope en el panel, `min-h-0` en el cuerpo (o flexbox se
 * niega a encogerlo por debajo de su contenido) y `overflow-y-auto`.
 */
export function ModalShell({
  titulo,
  slug,
  children,
}: {
  titulo: string;
  /** Para el enlace a la ficha completa y rastreable. */
  slug?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [completa, setCompleta] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    // El fondo no debe hacer scroll mientras el modal está abierto.
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  const cerrar = () => router.back();

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onCancel={(e) => {
        // Escape: se evita el cierre nativo para poder retroceder la URL.
        e.preventDefault();
        cerrar();
      }}
      onClick={(e) => {
        // Clic en el fondo, no en el panel.
        if (e.target === ref.current) cerrar();
      }}
      /* El navegador centra los <dialog> modales con `margin:auto` y les
         pone un `max-height` propio. Con eso puesto, "pantalla completa"
         se quedaba 8px por debajo y desplazada 17px hacia abajo. Se fija
         la caja a mano, y en el estilo en línea para que ninguna clase
         de utilidad pueda volver a pisarla. */
      className="bg-transparent backdrop:bg-[rgba(20,23,26,.72)]"
      style={{
        position: "fixed",
        inset: 0,
        margin: 0,
        padding: 0,
        border: 0,
        width: "100vw",
        maxWidth: "100vw",
        height: "100dvh",
        maxHeight: "100dvh",
      }}
    >
      <div
        className={cn(
          "flex size-full justify-center",
          completa ? "p-0" : "items-stretch p-0 md:items-center md:p-6 lg:p-8",
        )}
      >
        <div
          className={cn(
            "panel-modal relative flex flex-col bg-surface",
            completa
              ? "size-full"
              : "h-full w-full md:h-auto md:max-h-[90dvh] md:w-[min(1160px,94vw)] md:border md:border-ink md:shadow-panel",
          )}
        >
          {/* ---------- Barra superior. No se mueve. ---------- */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-rule bg-surface px-3 py-2 md:px-5">
            <p className="label truncate text-ink-2">{titulo}</p>

            <div className="flex shrink-0 items-center gap-1">
              {slug && (
                <Link
                  href={`/maquina/${slug}`}
                  className="hidden min-h-11 items-center gap-2 px-3 text-sm font-semibold text-ink-2 transition-colors duration-200 hover:text-accent md:inline-flex"
                >
                  <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                  Abrir la ficha
                </Link>
              )}

              {/* Pantalla completa: hay fichas con veinte especificaciones
                  y cuatro delegaciones, y a 90dvh se leen a trozos. */}
              <button
                type="button"
                onClick={() => setCompleta((v) => !v)}
                className="hidden size-11 items-center justify-center text-ink-2 transition-colors duration-200 hover:text-accent md:flex"
                aria-pressed={completa}
                aria-label={
                  completa
                    ? "Salir de pantalla completa"
                    : "Ver la ficha a pantalla completa"
                }
              >
                {completa ? (
                  <Minimize2 size={19} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Maximize2 size={19} strokeWidth={2} aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={cerrar}
                autoFocus
                className="flex size-11 items-center justify-center text-ink transition-colors duration-200 hover:text-accent"
                aria-label="Cerrar la ficha y volver al catálogo"
              >
                <X size={21} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ---------- Cuerpo. La única cosa que hace scroll. ----------
              `min-h-0` es obligatorio: sin él, flexbox se niega a encoger
              este hijo por debajo del alto de su contenido y el panel se
              desborda en vez de hacer scroll. */}
          <div
            ref={cuerpoRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 md:px-6 md:py-6"
            tabIndex={-1}
          >
            <div className={cn(completa && "container-placa")}>{children}</div>
          </div>

          {/* En móvil el enlace a la ficha completa va abajo, donde el
              pulgar llega. */}
          {slug && (
            <div className="shrink-0 border-t border-rule bg-sunken px-4 py-2 md:hidden">
              <Link
                href={`/maquina/${slug}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-2"
              >
                <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                Abrir la ficha completa
              </Link>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
