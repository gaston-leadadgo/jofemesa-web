import { notFound } from "next/navigation";
import { getMaquina } from "@/lib/catalog";
import { FichaMaquina } from "@/components/ficha/FichaMaquina";
import { ModalShell } from "@/components/ficha/ModalShell";

/**
 * La MISMA ficha, interceptada.
 *
 * Al pulsar una tarjeta desde el listado, esta ruta se cuela y la ficha se
 * abre encima sin desmontar el listado ni perder el scroll ni los filtros.
 * Al recargar, pegar la URL o entrar un rastreador, no hay interceptación:
 * se sirve la página completa de /maquina/[slug].
 *
 * El componente de la ficha es de servidor y se pasa como children a una
 * carcasa de cliente, así que su tabla de specs no viaja como JavaScript.
 */
export default async function ModalMaquina({
  params,
}: PageProps<"/maquina/[slug]">) {
  const { slug } = await params;
  const m = getMaquina(slug);
  if (!m) notFound();

  return (
    <ModalShell titulo={`${m.marca} ${m.modelo}`} slug={m.slug}>
      <FichaMaquina maquina={m} variante="modal" />
    </ModalShell>
  );
}
