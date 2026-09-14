"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Maquina } from "@/lib/catalog/types";
import { TarjetaMaquina } from "@/components/maquina/TarjetaMaquina";

/**
 * S5 · Una selección del catálogo.
 *
 * El titular anterior era «las que más salen de nuestros almacenes», y
 * es un dato que no tenemos: no hay estadística de rotación. Estas son
 * las que llevan fotografía oficial y ficha técnica del fabricante, que
 * sí es verificable y además es el argumento: de estas puedes decidir
 * sin llamar.
 *
 * La galería se arrastra en horizontal con `scroll-snap` nativo. Las
 * dos flechas son la corrección literal de la reunión sobre el carrusel
 * de categorías —«lo que hay que hacer es poder poner una flecha para
 * que se puedan ver todas»—: en un carrusel sin flecha, quien no sabe
 * que se arrastra se pierde la mitad del contenido.
 */
export function Destacadas({ maquinas }: { maquinas: Maquina[] }) {
  const pista = useRef<HTMLUListElement>(null);

  const mover = (sentido: -1 | 1) => {
    const el = pista.current;
    if (!el) return;
    const paso = el.clientWidth * 0.8;
    el.scrollBy({ left: paso * sentido, behavior: "smooth" });
  };

  return (
    <section className="section-y border-b border-rule">
      <div className="container-placa">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div data-revelar>
            <p className="label text-accent">Con ficha y foto oficial</p>
            <h2 className="display-2 mt-3 max-w-[24ch] text-ink">
              {maquinas.length} máquinas que puedes decidir sin llamar
            </h2>
            <p className="lede mt-4 max-w-[52ch] text-ink-2">
              Fotografía de nuestra propia flota y ficha técnica del
              fabricante, para comparar cifras antes de pedir nada.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-1.5 md:flex">
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Ver las anteriores"
                className="flex size-11 items-center justify-center border border-rule-control text-ink transition-colors duration-200 hover:bg-sunken"
              >
                <ChevronLeft size={19} strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Ver las siguientes"
                className="flex size-11 items-center justify-center border border-rule-control text-ink transition-colors duration-200 hover:bg-sunken"
              >
                <ChevronRight size={19} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <Link
              href="/alquiler"
              className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
            >
              Ver todo el catálogo
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <ul
          ref={pista}
          className="pista-horizontal mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5"
        >
          {maquinas.map((m, i) => (
            <li
              key={m.slug}
              className="w-[86vw] max-w-96 shrink-0 snap-start md:w-[45vw] lg:w-[31vw] xl:w-84"
            >
              <TarjetaMaquina
                maquina={m}
                sizes="(min-width:1440px) 336px, (min-width:1024px) 31vw, (min-width:768px) 45vw, 86vw"
                prioridad={i < 2}
              />
            </li>
          ))}
        </ul>

        <p className="label-sm text-ink-3 md:hidden">
          Arrastra para ver el resto
        </p>
      </div>
    </section>
  );
}
