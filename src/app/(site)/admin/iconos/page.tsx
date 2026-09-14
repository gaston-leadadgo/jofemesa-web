import type { Metadata } from "next";
import { FAMILIAS } from "@/lib/catalog/familias";
import { ALQUILER } from "@/lib/catalog";
import { IconoMaquina } from "@/components/marca/IconoMaquina";
import type { IconoId } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Iconografía de máquina",
  robots: { index: false, follow: false },
};

/**
 * La hoja de iconos.
 *
 * Existe por la misma razón que /admin/datos-pendientes: para poder
 * revisar de un vistazo algo que está repartido por toda la web. Aquí
 * se ven los veintidós dibujos a tres tamaños —el de la tarjeta de
 * familia, el de la pastilla de categoría y el del menú— que es donde
 * se nota si un trazo no aguanta.
 *
 * No está enlazada desde ninguna parte y lleva `noindex`.
 */
const TODOS: { id: IconoId; nombre: string; donde: string }[] = [
  ...FAMILIAS.map((f) => ({
    id: f.icono,
    nombre: f.nombre,
    donde: "Familia",
  })),
  ...FAMILIAS.flatMap((f) =>
    f.subcategorias.map((s) => ({
      id: s.icono,
      nombre: s.nombre,
      donde: f.nombre,
    })),
  ),
];

export default function PaginaIconos() {
  const unicos = new Map<IconoId, { nombre: string; donde: string }>();
  for (const t of TODOS) if (!unicos.has(t.id)) unicos.set(t.id, t);

  return (
    <div className="container-placa py-10 md:py-14">
      <p className="label text-accent">Uso interno</p>
      <h1 className="display-2 mt-3 max-w-[24ch] text-ink">
        Iconografía de máquina
      </h1>
      <p className="lede mt-5 max-w-[58ch] text-ink-2">
        {unicos.size} dibujos, mismo lienzo y misma anchura de trazo. Es la
        iconografía acordada en la reunión del 24 de agosto. A la
        derecha, cada uno a los tres tamaños reales en los que se usa.
      </p>

      <ul className="mt-10 grid gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-2xl">
        {[...unicos.entries()].map(([id, info]) => {
          const usos =
            TODOS.filter((t) => t.id === id).length +
            "";
          const refs = ALQUILER.filter((m) => {
            const f = FAMILIAS.find((x) => x.id === m.familia);
            const s = f?.subcategorias.find(
              (x) => x.slug === m.subcategoriaSlug,
            );
            return s?.icono === id || f?.icono === id;
          }).length;

          return (
            <li key={id} className="bg-surface p-5">
              <div className="flex items-end justify-between gap-4">
                <IconoMaquina icono={id} className="h-20 w-26 text-accent" />
                <div className="flex items-end gap-3">
                  <IconoMaquina icono={id} className="h-10 w-13 text-ink-2" />
                  <IconoMaquina icono={id} className="h-6 w-8 text-ink-3" />
                </div>
              </div>
              <p className="value mt-5 text-sm text-ink">{id}</p>
              <p className="mt-1 text-base text-ink-2">{info.nombre}</p>
              <p className="label-sm mt-2 text-ink-3">
                {usos} uso{usos === "1" ? "" : "s"} · {refs} referencias
              </p>
            </li>
          );
        })}
      </ul>

      {/* Sobre negro, que es el otro sitio donde viven. */}
      <div
        data-surface="dark"
        className="mt-10 border border-rule-inverse bg-inverse p-6"
      >
        <p className="label text-ink-inv-3">Sobre el faldón oscuro</p>
        <ul className="mt-5 flex flex-wrap gap-6">
          {[...unicos.keys()].map((id) => (
            <li key={id}>
              <IconoMaquina icono={id} className="h-12 w-16 text-accent-dark" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
