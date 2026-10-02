import { notFound } from "next/navigation";
import { ModalShell } from "@/components/ficha/ModalShell";
import { FichaCurso } from "@/components/formacion/FichaCurso";
import { CURSOS, esCursoId } from "@/content/es/formacion";

/**
 * La información del curso, interceptada: desde el calendario o el
 * catálogo se abre encima de /formacion sin perder el scroll ni los
 * filtros. Al recargar o compartir el enlace se sirve la página completa.
 */
export default async function ModalCurso({
  params,
}: PageProps<"/formacion/cursos/[curso]">) {
  const { curso } = await params;
  if (!esCursoId(curso)) notFound();

  return (
    <ModalShell
      titulo={CURSOS[curso].nombre}
      enlace={{ href: `/formacion/cursos/${curso}`, texto: "Abrir la página del curso" }}
      cerrarEtiqueta="Cerrar la información del curso"
    >
      <FichaCurso id={curso} variante="modal" />
    </ModalShell>
  );
}
