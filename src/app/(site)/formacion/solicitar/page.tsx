import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { FormularioFormacion } from "@/components/forms/FormularioFormacion";
import { CONVOCATORIAS } from "@/content/es/convocatorias";
import { esCursoId } from "@/content/es/formacion";
import { SEDE_FORMACION } from "@/content/es/empresa";

/** Los parámetros los lee el servidor, como en el formulario de alquiler. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solicitar plaza o curso de formación",
  description:
    "Pide plaza en una convocatoria abierta o un curso a medida para tu equipo. El departamento de Formación de JOFEMESA te confirma fecha, plazas y precio.",
};

const uno = (v: string | string[] | undefined): string | null =>
  (Array.isArray(v) ? v[0] : v) ?? null;

export default async function PaginaSolicitarFormacion({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const conv = CONVOCATORIAS.find((c) => c.id === uno(q.convocatoria)) ?? null;
  const cursoUrl = uno(q.curso);
  const curso = conv?.curso ?? (esCursoId(cursoUrl) ? cursoUrl : null);

  return (
    <div className="container-placa py-10 md:py-14">
      <Link
        href="/formacion#calendario"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-2 transition-colors duration-200 hover:text-accent"
      >
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        Volver al calendario de formación
      </Link>
      <p className="label text-accent">Departamento de Formación</p>
      <h1 className="display-2 mt-3 max-w-[24ch] text-ink">
        {conv ? "Solicita tu plaza." : "Cuéntanos qué formación necesitas."}
      </h1>
      <p className="lede mt-5 max-w-[58ch] text-ink-2">
        Formación revisa la solicitud y te llama para confirmar la plaza, el
        precio y lo que tienes que llevar. Si lo prefieres, llama directamente:{" "}
        <a
          href={`tel:${SEDE_FORMACION.tel}`}
          className="value inline-flex items-center gap-1.5 whitespace-nowrap text-ink underline decoration-accent decoration-2 underline-offset-4"
        >
          <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
          {SEDE_FORMACION.telefono}
        </a>
        .
      </p>

      <div className="mt-12">
        <FormularioFormacion inicial={{ curso, convocatoria: conv?.id ?? null }} />
      </div>
    </div>
  );
}
