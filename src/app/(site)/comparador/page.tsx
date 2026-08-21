import { Suspense } from "react";
import type { Metadata } from "next";
import { ComparadorCliente } from "@/components/comparador/ComparadorCliente";

export const metadata: Metadata = {
  title: "Comparador de maquinaria",
  description:
    "Compara las fichas técnicas de varias máquinas una junto a otra: altura de trabajo, capacidad de carga, dimensiones y alimentación.",
  robots: { index: false },
};

/* La comparación se identifica por ?m=: si se prerenderiza, el HTML sale
   sin ninguna máquina y el enlace compartido llega en blanco. */
export const dynamic = "force-dynamic";

export default function PaginaComparador() {
  return (
    <div className="container-placa py-10 md:py-14">
      <h1 className="display-2 max-w-[24ch] text-ink">
        Ficha contra ficha, sin abrir diez pestañas.
      </h1>
      <p className="lede mt-5 max-w-[56ch] text-ink-2">
        Las mismas especificaciones, en el mismo orden, una columna por
        máquina. El mejor valor de cada fila va marcado.
      </p>

      <div className="mt-10">
        <Suspense fallback={<div className="h-96 border border-rule bg-sunken" />}>
          <ComparadorCliente />
        </Suspense>
      </div>
    </div>
  );
}
