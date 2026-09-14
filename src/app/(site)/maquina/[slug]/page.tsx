import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CATALOGO, getMaquina, numeroDe } from "@/lib/catalog";
import { FAMILIA_POR_ID } from "@/lib/catalog/familias";
import { FichaMaquina } from "@/components/ficha/FichaMaquina";

export function generateStaticParams() {
  return CATALOGO.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/maquina/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMaquina(slug);
  if (!m) return {};
  const h = numeroDe(m.specs.alturaTrabajo);
  return {
    title: `${m.marca} ${m.modelo} en alquiler`,
    description: m.descripcionCorta,
    alternates: { canonical: `/maquina/${m.slug}` },
    openGraph: {
      title: `${m.marca} ${m.modelo}${h ? ` · ${h} m` : ""}`,
      description: m.descripcionCorta,
    },
  };
}

export default async function PaginaMaquina({
  params,
}: PageProps<"/maquina/[slug]">) {
  const { slug } = await params;
  const m = getMaquina(slug);
  if (!m) notFound();

  const familia = FAMILIA_POR_ID[m.familia];

  /* Product + Offer sin precio y sin AggregateRating: el diagnóstico
     señaló las reseñas no verificables como un riesgo real. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${m.marca} ${m.modelo}`,
    brand: { "@type": "Brand", name: m.marca },
    category: familia?.nombre,
    description: m.descripcionCorta,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "JOFEMESA" },
    },
  };

  return (
    <div className="container-placa py-8 md:py-10">
      <nav aria-label="Migas de pan" className="label-sm mb-8 -mt-1.5 text-ink-3">
        <Link href="/alquiler" className="inline-block py-1.5 hover:text-ink">
          Alquiler
        </Link>
        {familia && (
          <>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href={`/alquiler/${familia.slug}`} className="inline-block py-1.5 hover:text-ink">
              {familia.nombre}
            </Link>
          </>
        )}
        <span aria-hidden="true" className="mx-2">/</span>
        <span className="text-ink">{m.modelo}</span>
      </nav>

      <FichaMaquina maquina={m} variante="pagina" />

      <Link
        href="/alquiler"
        className="mt-12 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4"
      >
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        Volver al catálogo
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
