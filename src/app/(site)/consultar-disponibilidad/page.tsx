import type { Metadata } from "next";
import { FormularioDisponibilidad } from "@/components/forms/FormularioDisponibilidad";

/**
 * Los parámetros de la URL los lee EL SERVIDOR y bajan como props.
 *
 * Antes los leía el formulario con `useQueryState`, y eso obligaba a
 * envolverlo en `<Suspense>`: Next aplazaba la frontera al cliente, el
 * HTML servía el formulario dentro de un `<div hidden>` detrás del pie y
 * en su sitio quedaba un recuadro gris de 384 px. En la única página que
 * convierte era lo peor que se podía servir: sin JavaScript no había
 * formulario, y con JavaScript un parpadeo gris justo en el objetivo.
 *
 * Leyéndolos aquí, el formulario se pinta en su sitio dentro del HTML y
 * el `<form action>` se envía incluso con el JavaScript desactivado, que
 * es lo que promete el comentario del componente.
 */
export const dynamic = "force-dynamic";

/** `?m=a,b,c` → lista de slugs. Tolera el parámetro repetido. */
function slugs(v: string | string[] | undefined): string[] {
  const bruto = Array.isArray(v) ? v : v ? [v] : [];
  return bruto
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

const uno = (v: string | string[] | undefined): string | null =>
  (Array.isArray(v) ? v[0] : v) ?? null;

export const metadata: Metadata = {
  title: "Consultar disponibilidad",
  description:
    "Dinos qué máquina necesitas, para qué fechas y dónde está la obra. Te confirmamos disponibilidad y condiciones desde la delegación que la tiene.",
};

export default async function PaginaDisponibilidad({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;

  return (
    <div className="container-placa py-10 md:py-14">
      <h1 className="display-2 max-w-[26ch] text-ink">
        Dinos qué necesitas y qué día.
      </h1>
      <p className="lede mt-5 max-w-[58ch] text-ink-2">
        No hay pasarela de pago: el precio final depende del transporte, de la
        duración y de la disponibilidad real de cada delegación, así que lo
        confirmamos contigo.
      </p>

      <div className="mt-12">
        <FormularioDisponibilidad
          inicial={{
            m: slugs(q.m),
            contexto: uno(q.contexto),
            asunto: uno(q.asunto),
            del: uno(q.del),
          }}
        />
      </div>
    </div>
  );
}
