"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Maquina } from "@/lib/catalog/types";
import { TarjetaMaquina } from "@/components/maquina/TarjetaMaquina";

/**
 * S5 · Las que más salen del almacén.
 *
 * En escritorio es una galería que se arrastra en horizontal con
 * `scroll-snap` nativo, con su barra de progreso visible. Se ha descartado
 * fijar la sección con GSAP: en una rejilla de catálogo el fijado oculta
 * contenido y rompe la restauración del scroll, y el usuario de esta web
 * está buscando, no viendo una película.
 */
export function Destacadas({ maquinas }: { maquinas: Maquina[] }) {
  return (
    <section className="section-y border-b border-rule">
      <div className="container-placa">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="display-2 max-w-[22ch] text-ink" data-revelar>
            Las que más salen de nuestros almacenes.
          </h2>
          <Link
            href="/alquiler"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
          >
            Ver todo el catálogo
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <ul
          className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5"
          style={{ scrollbarWidth: "thin" }}
        >
          {maquinas.map((m, i) => (
            <li
              key={m.slug}
              className="w-[86vw] max-w-96 shrink-0 snap-start md:w-[45vw] lg:w-[30vw] xl:w-80"
            >
              <TarjetaMaquina maquina={m} sizes="(min-width:1440px) 320px, 45vw" prioridad={i < 2} />
            </li>
          ))}
        </ul>

        <p className="label-sm text-ink-3">
          {maquinas.length} equipos · arrastra para ver el resto
        </p>
      </div>
    </section>
  );
}
