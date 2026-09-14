import type { Metadata } from "next";
import { ComparadorCliente } from "@/components/comparador/ComparadorCliente";

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

/** `?m=a,b,c` → lista de slugs. Tolera el parámetro repetido. */
function slugs(v: string | string[] | undefined): string[] {
  const bruto = Array.isArray(v) ? v : v ? [v] : [];
  return bruto
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function PaginaComparador({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
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
        <ComparadorCliente inicial={slugs(q.m)} />
      </div>
    </div>
  );
}
