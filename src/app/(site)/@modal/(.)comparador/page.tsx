import { ComparadorCliente } from "@/components/comparador/ComparadorCliente";
import { ModalShell } from "@/components/ficha/ModalShell";
import { slugsDeQuery } from "@/lib/compare/url";

/**
 * El MISMO comparador, interceptado.
 *
 * Antes «Comparar» en la bandeja llevaba a `/comparador` como página
 * completa: cabecera, nav, footer, todo el peso de una navegación nueva
 * para ver una tabla. Con la ruta interceptada, el clic desde dentro del
 * sitio abre la tabla encima de lo que ya había en pantalla —igual que la
 * ficha de una máquina—, y al recargar, pegar la URL o compartirla se
 * sirve la página completa de `/comparador` sin modal ni JavaScript de
 * más: el mismo enlace sirve para las dos cosas.
 */
export const dynamic = "force-dynamic";

export default async function ModalComparador({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;

  return (
    <ModalShell titulo="Comparador de maquinaria">
      <ComparadorCliente inicial={slugsDeQuery(q.m)} />
    </ModalShell>
  );
}
