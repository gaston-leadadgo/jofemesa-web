import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SEDE_FORMACION } from "@/content/es/empresa";
import { HexagonoRelleno } from "@/components/marca/Hexagono";

export const metadata: Metadata = {
  title: "Solicitud de formación recibida",
  robots: { index: false },
};

export default async function PaginaGraciasFormacion({
  searchParams,
}: PageProps<"/formacion/solicitar/gracias">) {
  const { ref } = await searchParams;
  const referencia = typeof ref === "string" ? ref : null;

  return (
    <div className="container-placa py-12 md:py-16">
      <div className="max-w-[60ch]">
        <HexagonoRelleno aria-hidden="true" className="size-10 text-accent" />

        <h1 className="display-2 mt-8 text-ink">Solicitud recibida.</h1>

        {referencia && (
          <p className="mt-6 border border-rule bg-sunken px-5 py-4">
            <span className="label-sm block text-ink-3">Tu referencia</span>
            <span className="value-lg mt-1 block text-ink">{referencia}</span>
          </p>
        )}

        <p className="lede mt-8 text-ink-2">
          La recibe el departamento de Formación y te llama para confirmar la
          plaza, el precio y lo que tienes que llevar el día del curso. Si es
          urgente, llama y cita la referencia.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <a
            href={`tel:${SEDE_FORMACION.tel}`}
            className="inline-flex h-14 items-center justify-center gap-2 border border-rule-control px-6 text-base font-semibold text-ink transition-colors duration-200 hover:bg-sunken pastilla"
          >
            <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className="value">{SEDE_FORMACION.telefono}</span>
          </a>
          <Link
            href="/formacion"
            className="inline-flex h-14 items-center justify-center px-6 text-base font-semibold text-accent underline decoration-2 underline-offset-4"
          >
            Volver a Formación
          </Link>
        </div>
      </div>
    </div>
  );
}
