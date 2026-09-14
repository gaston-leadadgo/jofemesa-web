import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAMILIAS } from "@/lib/catalog/familias";
import { ALQUILER } from "@/lib/catalog";
import { IconoMaquina } from "@/components/marca/IconoMaquina";

/**
 * S3 · Las seis familias, en clave de necesidad.
 *
 * Esta sección es la que cambió en la reunión del 24/08/2026. Antes era
 * un bento de fotografías; ahora son seis pastillas con el dibujo de la
 * máquina, que es la iconografía de la lámina que pasó el cliente y que
 * gustó a los dos: «el que aparezca la iconografía… qué pasa, que el
 * mobile no sé cómo soluciona esto».
 *
 * Así se resuelve el móvil, que era la duda: NO hay scroll horizontal.
 * Una rejilla de dos columnas a 375 px con el icono a la izquierda y el
 * texto a la derecha entra completa sin desplazamiento lateral, y el
 * dibujo aguanta a 44 px porque es trazo vectorial sin escalar. El
 * carrusel se queda para el catálogo, donde hay veinte tarjetas y no
 * seis.
 *
 * El titular sale del vídeo: «Nosotros ponemos la máquina».
 */
export function Necesidades() {
  return (
    <section id="familias" className="section-y border-b border-rule">
      <div className="container-placa">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div data-revelar>
            <p className="label text-accent">Catálogo de alquiler</p>
            <h2 className="display-2 mt-3 max-w-[28ch] text-ink">
              Dinos qué tienes que hacer. Nosotros ponemos la máquina.
            </h2>
            <p className="lede mt-4 max-w-[52ch] text-ink-2">
              Seis familias y {ALQUILER.length} referencias en un solo
              catálogo, filtrable por altura, carga, alimentación y terreno.
            </p>
          </div>
          <Link
            href="/alquiler"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
          >
            Ver el catálogo completo
            <ArrowRight
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul
          className="mt-8 grid gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-2xl"
          data-escalonar
        >
          {FAMILIAS.map((f) => {
            const unidades = ALQUILER.filter((m) => m.familia === f.id).length;
            return (
              <li key={f.id} className="bg-surface">
                <Link
                  href={`/alquiler/${f.slug}`}
                  className="group flex h-full items-start gap-4 p-5 transition-colors duration-200 hover:bg-sunken md:p-6"
                >
                  <IconoMaquina
                    icono={f.icono}
                    className="mt-0.5 h-11 w-14 shrink-0 text-accent transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5 md:h-14 md:w-18"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="title block text-ink transition-colors duration-200 group-hover:text-accent">
                      {f.necesidad}
                    </span>
                    <span className="mt-1.5 block text-sm text-ink-2">
                      {f.necesidadDesc}
                    </span>
                    {/* En caja baja y no en versalitas: «Demolición, corte
                        y perforación» en caja alta y partido en dos líneas
                        es lo que hacía este pie ilegible. La caja alta es
                        para etiquetas, no para frases. */}
                    <span className="meta mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-rule pt-3 text-ink-3">
                      <span>{f.rango}</span>
                      <span aria-hidden="true" className="text-rule-strong">
                        ·
                      </span>
                      <span className="whitespace-nowrap">
                        {unidades} referencia{unidades === 1 ? "" : "s"}
                      </span>
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-rule-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
