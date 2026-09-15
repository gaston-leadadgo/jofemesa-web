import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALQUILER } from "@/lib/catalog";
import { FAMILIAS } from "@/lib/catalog/familias";
import { AlquilerCliente } from "@/components/alquiler/AlquilerCliente";
import { ListaEstatica } from "@/components/alquiler/ListaEstatica";
import { CabeceraSeccion } from "@/components/marca/CabeceraSeccion";
import { fotoFamilia } from "@/lib/img/ambiente";
import { DELEGACIONES } from "@/content/es/empresa";

/**
 * Una URL rastreable por familia.
 *
 * No es un detalle de SEO: es un requisito de negocio que salió de la
 * reunión del 24/08/2026. «Esto tiene que ser una URL diferente… para
 * poder hacer una campaña de cada categoría». Las subcategorías se
 * quedan como filtro (`?sub=`) porque «en principio no se va a hacer
 * una campaña de una subcategoría».
 */
export function generateStaticParams() {
  return FAMILIAS.map((f) => ({ familia: f.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/alquiler/[familia]">): Promise<Metadata> {
  const { familia } = await params;
  const f = FAMILIAS.find((x) => x.slug === familia);
  if (!f) return {};
  const n = ALQUILER.filter((m) => m.familia === f.id).length;
  return {
    title: `Alquiler de ${f.nombreLargo.toLowerCase()}`,
    description: `${n} referencias de ${f.nombre.toLowerCase()} en alquiler. ${f.descripcion}`,
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
      <CabeceraSeccion
        kicker={f.nombreLargo}
        icono={f.icono}
        /* Si existe `public/img/familias/<slug>.jpg`, entra de fondo.
           Estas páginas son aterrizajes de campaña: una cabecera con
           fotografía de obra convierte mejor que una placa lisa. */
        foto={fotoFamilia(f.slug)}
        titulo={f.claim}
        lede={f.descripcion}
        migas={
          <nav aria-label="Migas de pan" className="label-sm">
            <Link
              href="/alquiler"
              className="inline-block py-1.5 transition-colors duration-200 hover:text-ink-inv"
            >
              Alquiler
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-ink-inv">{f.nombre}</span>
          </nav>
        }
        datos={[
          { k: "Referencias", v: `${total}` },
          { k: "Rango", v: f.rango },
          { k: "Delegaciones", v: `${DELEGACIONES.length}` },
        ]}
        cta={{
          href: `/consultar-disponibilidad?contexto=${encodeURIComponent(f.nombreLargo)}`,
          texto: "Consultar disponibilidad",
        }}
        secundario={{ href: "/asesor", texto: "No sé cuál necesito" }}
      />

      {/* Igual que en /alquiler: el respaldo es la lista real de la
          familia, no un «Cargando…». Estas páginas son aterrizajes de
          campaña y tienen que traer producto en el HTML. */}
      <Suspense fallback={<ListaEstatica familiaFija={f.id} />}>
        <AlquilerCliente familiaFija={f.id} />
      </Suspense>
    </>
  );
}
