import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALQUILER } from "@/lib/catalog";
import { FAMILIAS } from "@/lib/catalog/familias";
import {
  AlquilerCliente,
  BuscadorCatalogo,
} from "@/components/alquiler/AlquilerCliente";
import { ListaEstatica } from "@/components/alquiler/ListaEstatica";

export const metadata: Metadata = {
  title: "Alquiler de maquinaria",
  description:
    "Todo el catálogo de alquiler de JOFEMESA, filtrable por familia, altura de trabajo, capacidad de carga, alimentación, uso y delegación.",
};

export default function PaginaAlquiler() {
  return (
    <>
      <section className="ambient-light border-b border-rule">
        <div className="container-placa py-8 md:py-10">
          <p className="label text-ink-2">
            {ALQUILER.length} máquinas en {FAMILIAS.length} familias
          </p>
          <h1 className="display-1 mt-4 max-w-[24ch] text-ink" data-revelar>
            Todo el catálogo, en una página.
          </h1>
          <p className="lede mt-6 max-w-[56ch] text-ink-2">
            Filtra por lo que decide un alquiler: altura de trabajo, capacidad
            de carga, si es eléctrica o diésel, si entra en interior y en qué
            delegación la puedes recoger.
          </p>

          <div className="mt-8">
            <Suspense
              fallback={<div className="h-14 max-w-xl border border-rule bg-sunken" />}
            >
              <BuscadorCatalogo />
            </Suspense>
          </div>

          <Link
            href="/asesor"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
          >
            No sé qué máquina necesito
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* El <Suspense> es obligatorio alrededor de lo que lee la URL. Y
          el respaldo NO es un esqueleto: es el catálogo entero renderizado
          en servidor, así que el HTML servido trae las máquinas de verdad
          para los rastreadores y para la primera pintura. */}
      <Suspense fallback={<ListaEstatica />}>
        <AlquilerCliente />
      </Suspense>
    </>
  );
}
