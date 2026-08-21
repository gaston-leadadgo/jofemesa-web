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

    preparar();

    // El catálogo filtra en cliente: los nodos nuevos también se animan.
    const vigilante = new MutationObserver(() => preparar());
    vigilante.observe(document.body, { childList: true, subtree: true });

    return () => {
      observador.disconnect();
      vigilante.disconnect();
      delete raiz.dataset.motor;
    };
  }, [ruta]);

  return null;
}
