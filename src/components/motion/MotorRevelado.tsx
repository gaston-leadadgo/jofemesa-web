"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Un solo IntersectionObserver para toda la web.
 *
 * Por qué así y no un componente envoltorio por sección: cualquier
 * componente de SERVIDOR puede animarse añadiendo `data-revelar` a su
 * marcado, sin convertirse en componente de cliente ni mandar su HTML
 * al navegador como JavaScript. Un observador y cero árboles nuevos.
 *
 * El atributo `data-motor` en <html> lo pone este efecto. Es la llave
 * de la regla de accesibilidad del proyecto: el CSS que oculta los
 * elementos cuelga de ese atributo, así que sin JavaScript —o con un
 * rastreador leyendo— la página se sirve entera y visible.
 *
 * Con `prefers-reduced-motion` no se registra nada en absoluto: ni
 * observador, ni atributo, ni transiciones. La página se ve igual de
 * completa, solo que de golpe.
 */
export function MotorRevelado() {
  const ruta = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const raiz = document.documentElement;
    raiz.dataset.motor = "on";

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.visible = "";
          // Una vez revelado, se deja de observar: nada se re-anima al
          // volver a pasar por encima, que es lo que marea.
          observador.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    /** Reparte el escalonado. Tope de 6: a partir de ahí el último
     *  elemento tardaría más de lo que nadie espera. */
    function preparar() {
      for (const grupo of document.querySelectorAll<HTMLElement>(
        "[data-escalonar]",
      )) {
        const hijos = Array.from(grupo.children) as HTMLElement[];
        hijos.forEach((h, i) => {
          if (!h.hasAttribute("data-revelar")) h.dataset.revelar = "";
          h.style.setProperty("--retardo", String(Math.min(i, 5)));
        });
      }

      for (const el of document.querySelectorAll<HTMLElement>(
        "[data-revelar], .filete-anim",
      )) {
        if (el.dataset.visible !== undefined) continue;
        // Lo que ya está en pantalla al cargar se revela de inmediato:
        // esperar al scroll para animar el hero es un parpadeo, no una
        // animación.
        const caja = el.getBoundingClientRect();
        if (caja.top < window.innerHeight * 0.92) {
          el.dataset.visible = "";
        } else {
          observador.observe(el);
        }
      }
    }

    /* La primera pasada espera dos fotogramas.
     *
     * No es una precaución vaga: este efecto corre cuando hidrata el
     * layout, pero React hidrata de forma selectiva y los árboles que
     * hay dentro de un <Suspense> —el catálogo y el asesor— pueden
     * hidratar después. Si `preparar()` escribe `data-visible` en un
     * nodo de esos ANTES de que React lo hidrate, React encuentra un
     * atributo que no puso y avisa de desajuste de hidratación. Dos
     * `requestAnimationFrame` dejan pasar la hidratación selectiva y no
     * se notan: el estado inicial de los elementos ya es el oculto.
     */
    let pendiente = 0;
    pendiente = requestAnimationFrame(() => {
      pendiente = requestAnimationFrame(preparar);
    });

    // El catálogo filtra en cliente: los nodos nuevos también se animan.
    const vigilante = new MutationObserver(() => preparar());
    vigilante.observe(document.body, { childList: true, subtree: true });

    /* ---------- Paralaje ----------
     *
     * Solo sobre capas DECORATIVAS marcadas con `data-parallax`, nunca
     * sobre texto ni sobre controles: desplazar la línea que alguien
     * está leyendo es incomodísimo y, a poco que se pase, marea.
     *
     * Un único listener pasivo para todas, y el trabajo real dentro de
     * un `requestAnimationFrame`, así que como mucho se toca el estilo
     * una vez por fotograma aunque el scroll dispare veinte eventos.
     * Solo `transform`: ni una propiedad que obligue a recalcular
     * distribución.
     */
    const capas = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    let tick = 0;
    function mover() {
      tick = 0;
      const y = window.scrollY;
      for (const capa of capas) {
        const factor = Number(capa.dataset.parallax) || 0;
        capa.style.transform = `translate3d(0, ${(y * factor).toFixed(1)}px, 0)`;
      }
    }
    function alScroll() {
      if (tick) return;
      tick = requestAnimationFrame(mover);
    }
    if (capas.length) {
      window.addEventListener("scroll", alScroll, { passive: true });
      mover();
    }

    return () => {
      cancelAnimationFrame(pendiente);
      if (tick) cancelAnimationFrame(tick);
      window.removeEventListener("scroll", alScroll);
      observador.disconnect();
      vigilante.disconnect();
      delete raiz.dataset.motor;
    };
  }, [ruta]);

  return null;
}
