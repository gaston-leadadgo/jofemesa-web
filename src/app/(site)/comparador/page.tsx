import type { Metadata } from "next";
import { ComparadorCliente } from "@/components/comparador/ComparadorCliente";
import { slugsDeQuery } from "@/lib/compare/url";

export const metadata: Metadata = {
  title: "Comparador de maquinaria",
  description:
    "Compara las fichas técnicas de varias máquinas una junto a otra: altura de trabajo, capacidad de carga, dimensiones y alimentación.",
  robots: { index: false },
};

/* La comparación se identifica por ?m=: si se prerenderiza, el HTML sale
   sin ninguna máquina y el enlace compartido llega en blanco. Los slugs los
   lee el servidor y bajan como prop, así la tabla va dentro del HTML en su
   sitio y no dentro de un `<div hidden>` detrás del pie. */
export const dynamic = "force-dynamic";

/**
 * Sin cabecera de portada: quien llega aquí ya decidió comparar, no hace
 * falta convencerlo de nada. Al `<h1>` solo lo necesita el lector de
 * pantalla y el título de pestaña; visualmente es una etiqueta, no un
 * titular — la tabla empieza a la primera pantalla.
 */
export default async function PaginaComparador({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  return (
    <div className="container-placa py-6 md:py-8">
      <h1 className="label text-ink-3">Comparador de maquinaria</h1>

      <div className="mt-5">
        <ComparadorCliente inicial={slugsDeQuery(q.m)} />
      </div>
    </div>
  );
}
