import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALQUILER } from "@/lib/catalog";
import { FAMILIAS } from "@/lib/catalog/familias";
import { AlquilerCliente } from "@/components/alquiler/AlquilerCliente";
import { ListaEstatica } from "@/components/alquiler/ListaEstatica";

/** Una URL rastreable por familia: sirve de aterrizaje para Ads y SEO. */
export function generateStaticParams() {
  return FAMILIAS.map((f) => ({ familia: f.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/alquiler/[familia]">): Promise<Metadata> {
  const { familia } = await params;
  const f = FAMILIAS.find((x) => x.slug === familia);
  if (!f) return {};
  return {
    title: `Alquiler de ${f.nombre.toLowerCase()}`,
    description: f.descripcion,
  };
}

export default async function PaginaFamilia({
  params,
}: PageProps<"/alquiler/[familia]">) {
  const { familia } = await params;
  const f = FAMILIAS.find((x) => x.slug === familia);
  if (!f) notFound();

  const total = ALQUILER.filter((m) => m.familia === f.id).length;

  return (
    <>
      <section className="ambient-light border-b border-rule">
        <div className="container-placa py-8 md:py-10">
          <nav aria-label="Migas de pan" className="label-sm text-ink-3">
            <Link href="/alquiler" className="hover:text-ink">
              Alquiler
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-ink">{f.nombre}</span>
          </nav>

          <h1 className="display-1 mt-5 max-w-[26ch] text-ink">{f.claim}</h1>
          <p className="lede mt-6 max-w-[58ch] text-ink-2">{f.descripcion}</p>
          <p className="label mt-8 text-ink-2">
            {total} modelo{total === 1 ? "" : "s"} · {f.rango}
          </p>

          {/* Las subcategorías, como aterrizajes propios de la familia. */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {f.subcategorias.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/alquiler/${f.slug}?sub=${s.slug}`}
                  className="inline-flex min-h-11 items-center border border-rule bg-surface px-4 text-base text-ink-2 transition-colors duration-200 hover:border-rule-strong hover:text-ink"
                >
                  {s.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Igual que en /alquiler: el respaldo es la lista real de la
          familia, no un "Cargando…". Estas páginas son aterrizajes de
          buscador y tienen que traer producto en el HTML. */}
      <Suspense fallback={<ListaEstatica familiaFija={f.id} />}>
        <AlquilerCliente familiaFija={f.id} />
      </Suspense>
    </>
  );
}
