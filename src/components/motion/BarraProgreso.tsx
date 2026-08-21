"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * El filete rojo de carga en el borde superior.
 *
 * No hace la navegación más rápida: hace que la espera sea legible. Sin
 * esto, entre el clic y la pintura de la página nueva no pasa nada
 * visible y el usuario vuelve a pulsar — que es exactamente lo que la
 * hace más lenta.
 *
 * En vez de un booleano se guarda LA URL DESDE LA QUE se pulsó. Así el
 * apagado se resuelve comparando durante el render, sin un efecto que
 * llame a setState: si la URL guardada ya no es la actual, la página
 * nueva está en pantalla y la barra sobra. Es el patrón de ajuste de
 * estado durante el render que documenta React, y evita el rebote de
 * renders en cascada de hacerlo desde un `useEffect`.
 */
export function BarraProgreso() {
  const ruta = usePathname();
  const query = useSearchParams();
  const actual = `${ruta}?${query}`;

  const [desde, setDesde] = useState<string | null>(null);

  // Ajuste durante el render: la navegación terminó.
  if (desde !== null && desde !== actual) setDesde(null);

  useEffect(() => {
    function alPulsar(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const enlace = (e.target as Element | null)?.closest?.("a");
      if (!(enlace instanceof HTMLAnchorElement)) return;
      if (enlace.target === "_blank" || enlace.hasAttribute("download")) return;

      const destino = new URL(enlace.href, window.location.href);
      if (destino.origin !== window.location.origin) return;
      // Un ancla dentro de la misma página no navega.
      if (
        destino.pathname === window.location.pathname &&
        destino.search === window.location.search
      )
        return;

      setDesde(`${window.location.pathname}?${window.location.search.slice(1)}`);
    }

    document.addEventListener("click", alPulsar, { capture: true });
    return () =>
      document.removeEventListener("click", alPulsar, { capture: true });
  }, []);

  if (desde === null) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5 overflow-hidden"
    >
      <span className="sr-only">Cargando la página</span>
      <span
        aria-hidden="true"
        className="barra-navegando block size-full bg-accent"
      />
    </div>
  );
}
