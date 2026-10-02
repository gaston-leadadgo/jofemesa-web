import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FichaCurso } from "@/components/formacion/FichaCurso";
import { CURSOS, TODOS_LOS_CURSOS, esCursoId } from "@/content/es/formacion";

export const dynamicParams = false;

export function generateStaticParams() {
  return TODOS_LOS_CURSOS.map((curso) => ({ curso }));
}

export async function generateMetadata({
  params,
}: PageProps<"/formacion/cursos/[curso]">): Promise<Metadata> {
  const { curso } = await params;
  if (!esCursoId(curso)) return {};
  const c = CURSOS[curso];
  return {
    title: `Curso: ${c.nombre}`,
    description: `${c.descripcion} Duración: ${c.duracion}. ${c.modalidad}.`,
  };
}

/** La página propia de cada curso: la que se comparte y se indexa. */
export default async function PaginaCurso({
  params,
}: PageProps<"/formacion/cursos/[curso]">) {
  const { curso } = await params;
  if (!esCursoId(curso)) notFound();

  return (
    <div className="container-placa py-10 md:py-14">
      <Link
        href="/formacion#cursos"
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-2 transition-colors duration-200 hover:text-accent"
      >
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        Todos los cursos de Formación
      </Link>
      <FichaCurso id={curso} variante="pagina" />
    </div>
  );
}
